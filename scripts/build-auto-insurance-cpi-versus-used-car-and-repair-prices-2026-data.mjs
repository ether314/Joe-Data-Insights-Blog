/**
 * Build src/data/auto-insurance-cpi-versus-used-car-and-repair-prices-2026-data.ts
 * from BLS CPI-U series (scraped HTML tables).
 */
import fs from "node:fs";
import path from "node:path";

const SERIES = {
  insurance: "CUUR0000SETE",
  usedCars: "CUUR0000SETA02",
  bodyWork: "CUUR0000SETD01",
};

async function parseSeries(id) {
  const url = `https://data.bls.gov/timeseries/${id}?output_view=data&start_year=2019&end_year=2026`;
  const html = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());
  const rows = [];
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = trRe.exec(html))) {
    const cells = [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((x) =>
      x[1].replace(/<[^>]+>/g, "").trim(),
    );
    if (cells.length >= 13 && /^20\d{2}$/.test(cells[0])) {
      const year = +cells[0];
      for (let i = 0; i < 12; i++) {
        const v = cells[1 + i];
        if (!v || v === "-" || v.includes("(X)")) continue;
        const num = parseFloat(v.replace(/,/g, ""));
        if (!Number.isNaN(num)) {
          rows.push({ year, month: i + 1, value: num });
        }
      }
    }
  }
  return rows;
}

function key(y, m) {
  return `${y}-${String(m).padStart(2, "0")}`;
}

function pearson(xs, ys) {
  const n = xs.length;
  if (n < 3) return 0;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  return dx && dy ? num / Math.sqrt(dx * dy) : 0;
}

function lagCorr(monthly, lag) {
  const pairs = [];
  for (let i = lag; i < monthly.length; i++) {
    const a = monthly[i - lag];
    const b = monthly[i];
    if (a.usedCarsIdx != null && b.insuranceIdx != null) {
      pairs.push([a.usedCarsIdx, b.insuranceIdx]);
    }
  }
  return {
    lag,
    corr: +pearson(
      pairs.map((p) => p[0]),
      pairs.map((p) => p[1]),
    ).toFixed(3),
    n: pairs.length,
  };
}

function round1(n) {
  return +n.toFixed(1);
}

function round2(n) {
  return +n.toFixed(2);
}

async function main() {
  const raw = {};
  for (const [name, id] of Object.entries(SERIES)) {
    raw[name] = await parseSeries(id);
    await new Promise((r) => setTimeout(r, 1500));
  }

  const maps = {
    insurance: new Map(raw.insurance.map((r) => [key(r.year, r.month), r.value])),
    usedCars: new Map(raw.usedCars.map((r) => [key(r.year, r.month), r.value])),
    bodyWork: new Map(raw.bodyWork.map((r) => [key(r.year, r.month), r.value])),
  };

  const labels = [...maps.insurance.keys()].sort();
  const bases = {
    insurance2019:
      [...maps.insurance.entries()]
        .filter(([k]) => k.startsWith("2019-"))
        .reduce((s, [, v]) => s + v, 0) / 12,
    usedCars2019:
      [...maps.usedCars.entries()]
        .filter(([k]) => k.startsWith("2019-"))
        .reduce((s, [, v]) => s + v, 0) / 12,
    bodyWork2019:
      [...maps.bodyWork.entries()]
        .filter(([k]) => k.startsWith("2019-"))
        .reduce((s, [, v]) => s + v, 0) / 12,
  };

  const MONTHLY = labels.map((label) => {
    const [ys, ms] = label.split("-");
    const year = +ys;
    const month = +ms;
    const ins = maps.insurance.get(label) ?? null;
    const used = maps.usedCars.get(label) ?? null;
    const body = maps.bodyWork.get(label) ?? null;
    const insuranceIdx = ins != null ? round1((ins / bases.insurance2019) * 100) : null;
    const usedCarsIdx = used != null ? round1((used / bases.usedCars2019) * 100) : null;
    const bodyWorkIdx = body != null ? round1((body / bases.bodyWork2019) * 100) : null;
    const insUsedGap =
      insuranceIdx != null && usedCarsIdx != null
        ? round1(insuranceIdx - usedCarsIdx)
        : null;
    const insBodyGap =
      insuranceIdx != null && bodyWorkIdx != null
        ? round1(insuranceIdx - bodyWorkIdx)
        : null;
    return {
      label,
      year,
      month,
      rawInsurance: ins,
      rawUsedCars: used,
      rawBodyWork: body,
      insuranceIdx,
      usedCarsIdx,
      bodyWorkIdx,
      insUsedGap,
      insBodyGap,
      yoyInsurance: null,
      yoyUsedCars: null,
      yoyBodyWork: null,
    };
  });

  for (const row of MONTHLY) {
    const prev = MONTHLY.find((r) => r.year === row.year - 1 && r.month === row.month);
    if (!prev) continue;
    if (row.rawInsurance != null && prev.rawInsurance != null) {
      row.yoyInsurance = round1(((row.rawInsurance / prev.rawInsurance - 1) * 100));
    }
    if (row.rawUsedCars != null && prev.rawUsedCars != null) {
      row.yoyUsedCars = round1(((row.rawUsedCars / prev.rawUsedCars - 1) * 100));
    }
    if (row.rawBodyWork != null && prev.rawBodyWork != null) {
      row.yoyBodyWork = round1(((row.rawBodyWork / prev.rawBodyWork - 1) * 100));
    }
  }

  const latest = MONTHLY.filter((r) => r.insuranceIdx != null).at(-1);
  const peakInsUsedGap = MONTHLY.reduce(
    (best, r) =>
      r.insUsedGap != null && (best == null || r.insUsedGap > best.gap)
        ? { gap: r.insUsedGap, label: r.label }
        : best,
    null,
  );
  const peakYoyIns = MONTHLY.reduce(
    (best, r) =>
      r.yoyInsurance != null && (best == null || r.yoyInsurance > best.pct)
        ? { pct: r.yoyInsurance, label: r.label }
        : best,
    null,
  );

  const corrPairs = MONTHLY.filter(
    (r) => r.insuranceIdx != null && r.usedCarsIdx != null,
  );
  const corr = round2(
    pearson(
      corrPairs.map((r) => r.usedCarsIdx),
      corrPairs.map((r) => r.insuranceIdx),
    ),
  );

  const LAG_CORR = [0, 1, 2, 3, 4, 5, 6].map((lag) => lagCorr(MONTHLY, lag));

  const QUARTERLY = [];
  for (let y = 2019; y <= 2026; y++) {
    for (let q = 1; q <= 4; q++) {
      const months = MONTHLY.filter(
        (r) => r.year === y && r.month > (q - 1) * 3 && r.month <= q * 3,
      );
      if (!months.length) continue;
      const avg = (field) => {
        const vals = months.map((m) => m[field]).filter((v) => v != null);
        return vals.length ? round1(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
      };
      const insUsedGap = avg("insUsedGap");
      QUARTERLY.push({
        label: `${y}Q${q}`,
        year: y,
        q: `Q${q}`,
        insuranceIdx: avg("insuranceIdx"),
        usedCarsIdx: avg("usedCarsIdx"),
        bodyWorkIdx: avg("bodyWorkIdx"),
        insUsedGap,
        insBodyGap: avg("insBodyGap"),
        partial: months.some((m) => m.rawBodyWork == null),
      });
    }
  }

  const ANNUAL = [];
  for (let y = 2019; y <= 2026; y++) {
    const months = MONTHLY.filter((r) => r.year === y);
    const avg = (field) => {
      const vals = months.map((m) => m[field]).filter((v) => v != null);
      return vals.length ? round1(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
    };
    ANNUAL.push({
      year: y,
      insuranceIdx: avg("insuranceIdx"),
      usedCarsIdx: avg("usedCarsIdx"),
      bodyWorkIdx: avg("bodyWorkIdx"),
      insUsedGap: avg("insUsedGap"),
      insBodyGap: avg("insBodyGap"),
      partial: y >= 2025,
    });
  }

  const epochAvg = (from, to) => {
    const slice = MONTHLY.filter((r) => r.label >= from && r.label <= to);
    const avg = (field) => {
      const vals = slice.map((m) => m[field]).filter((v) => v != null);
      return vals.length ? round1(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
    };
    return {
      insuranceIdx: avg("insuranceIdx"),
      usedCarsIdx: avg("usedCarsIdx"),
      bodyWorkIdx: avg("bodyWorkIdx"),
    };
  };

  const EPOCH_BARS = [
    { epoch: "Pre-COVID\n2019", ...epochAvg("2019-01", "2019-12") },
    { epoch: "Collapse\n2020", ...epochAvg("2020-01", "2020-12") },
    { epoch: "Used spike\n2021–22", ...epochAvg("2021-01", "2022-12") },
    { epoch: "Cool-down\n2023–24", ...epochAvg("2023-01", "2024-12") },
    {
      epoch: "2026 YTD",
      ...epochAvg("2026-01", latest.label),
    },
  ];

  const SUMMARY_TABLE = ANNUAL.map((r) => ({
    year: String(r.year),
    insuranceIdx: r.insuranceIdx,
    usedCarsIdx: r.usedCarsIdx,
    bodyWorkIdx: r.bodyWorkIdx,
    insUsedGapPp: r.insUsedGap,
    insBodyGapPp: r.insBodyGap,
    partial: r.partial,
  }));

  const HEADLINE = {
    latestLabel: latest.label,
    insuranceIdx: latest.insuranceIdx,
    usedCarsIdx: latest.usedCarsIdx,
    bodyWorkIdx: latest.bodyWorkIdx ?? null,
    insUsedGapPp: latest.insUsedGap,
    insBodyGapPp: latest.insBodyGap,
    corr,
    peakInsUsedGapPp: peakInsUsedGap.gap,
    peakInsUsedGapLabel: peakInsUsedGap.label,
    peakYoyInsurancePct: peakYoyIns.pct,
    peakYoyInsuranceLabel: peakYoyIns.label,
    insurancePctSince2019: round1(latest.insuranceIdx - 100),
    usedCarsPctSince2019: round1(latest.usedCarsIdx - 100),
    bodyWorkPctSince2019:
      latest.bodyWorkIdx != null ? round1(latest.bodyWorkIdx - 100) : null,
    bases: {
      insurance2019: round2(bases.insurance2019),
      usedCars2019: round2(bases.usedCars2019),
      bodyWork2019: round2(bases.bodyWork2019),
    },
    bestLag: LAG_CORR.reduce((best, r) => (r.corr > best.corr ? r : best), LAG_CORR[0]),
  };

  const out = `/**
 * Auto insurance CPI vs used-car and body-work prices (2019–2026).
 *
 * Core question: Did insurance premiums keep climbing after used-car and
 * repair CPIs cooled?
 *
 * Method: Rebase CUUR0000SETE (motor vehicle insurance), CUUR0000SETA02
 * (used cars and trucks), and CUUR0000SETD01 (motor vehicle body work) to
 * 2019 calendar-year averages = 100. Gap = insurance index − peer index
 * (pp). Oct 2025 CPI cells missing (appropriations lapse); body-work series
 * has additional publication gaps. Confidence: disclosed BLS levels;
 * indexes, gaps, and correlations derived.
 */

export const SOURCE_NOTE =
  "BLS CPI-U motor vehicle insurance (CUUR0000SETE), used cars and trucks (CUUR0000SETA02), motor vehicle body work (CUUR0000SETD01). Rebased to 2019 averages = 100. Oct 2025 CPI gap; body-work has sparse months. Confidence: disclosed BLS levels; derived indexes/gaps/correlations.";

export const SOURCES = [
  {
    label: "BLS — CPI-U motor vehicle insurance (CUUR0000SETE)",
    url: "https://data.bls.gov/timeseries/CUUR0000SETE",
  },
  {
    label: "BLS — CPI-U used cars and trucks (CUUR0000SETA02)",
    url: "https://data.bls.gov/timeseries/CUUR0000SETA02",
  },
  {
    label: "BLS — CPI-U motor vehicle body work (CUUR0000SETD01)",
    url: "https://data.bls.gov/timeseries/CUUR0000SETD01",
  },
  {
    label: "BLS — Consumer Price Index overview",
    url: "https://www.bls.gov/cpi/",
  },
] as const;

export const HEADLINE = ${JSON.stringify(HEADLINE, null, 2)} as const;

export type SeriesId = "insurance" | "usedCars" | "bodyWork";

export const SERIES_META: Record<
  SeriesId,
  { label: string; short: string; color: string; bls: string }
> = {
  insurance: {
    label: "Motor-vehicle insurance CPI",
    short: "Insurance",
    color: "#ea580c",
    bls: "CUUR0000SETE",
  },
  usedCars: {
    label: "Used cars and trucks CPI",
    short: "Used cars",
    color: "#0284c7",
    bls: "CUUR0000SETA02",
  },
  bodyWork: {
    label: "Motor vehicle body work CPI",
    short: "Body work",
    color: "#a855f7",
    bls: "CUUR0000SETD01",
  },
};

export type MonthRow = {
  label: string;
  year: number;
  month: number;
  rawInsurance: number | null;
  rawUsedCars: number | null;
  rawBodyWork: number | null;
  insuranceIdx: number | null;
  usedCarsIdx: number | null;
  bodyWorkIdx: number | null;
  insUsedGap: number | null;
  insBodyGap: number | null;
  yoyInsurance: number | null;
  yoyUsedCars: number | null;
  yoyBodyWork: number | null;
};

export const MONTHLY: MonthRow[] = ${JSON.stringify(MONTHLY, null, 2)};

export const QUARTERLY = ${JSON.stringify(QUARTERLY, null, 2)};

export const ANNUAL = ${JSON.stringify(ANNUAL, null, 2)};

export const SUMMARY_TABLE = ${JSON.stringify(SUMMARY_TABLE, null, 2)};

export const LAG_CORR = ${JSON.stringify(LAG_CORR, null, 2)} as const;

export const EPOCH_BARS = ${JSON.stringify(EPOCH_BARS, null, 2)} as const;

export const ANALYTICS = {
  smokeMarker: "Insurance vs used-car and repair indexes",
  defaultPanel: "triple-track" as const,
  latestLabel: HEADLINE.latestLabel,
  corr: HEADLINE.corr,
};
`;

  const dest = path.join(
    process.cwd(),
    "src/data/auto-insurance-cpi-versus-used-car-and-repair-prices-2026-data.ts",
  );
  fs.writeFileSync(dest, out);
  console.log("Wrote", dest);
  console.log("HEADLINE", HEADLINE);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
