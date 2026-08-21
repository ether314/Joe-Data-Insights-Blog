/**
 * AI capex & spend concentration — Q3 2026 vintage.
 * Top-1 / top-3 shares, HHI, cumulative ladder, and Aug→Q3 raise concentration
 * across Big-5 hyperscaler gross programs (mid-Q3 desk stack ~$835B).
 */

export type Confidence =
  | "actual"
  | "guidance"
  | "midpoint"
  | "desk"
  | "net-of-prepay"
  | "call";

export const SOURCE_NOTE =
  "Concentration lens on Big-5 hyperscaler gross capex — mid-Q3 2026 desk vintage. Amazon ~$230B, Alphabet mid $210B, Microsoft ~$175B CY (lease reclass), Meta mid $145B, Oracle ~$75B net → Big-5 sum ~$835B. Prior Aug post-Q2 print ~$802.5B; Jul research ~$760B. AI-attributed factor ≈75% of gross (CreditSights convention). Shares and HHI are within the Big-5 perimeter, not the entire global IT capex universe.";

export const SOURCES = [
  {
    label: "Mid-Q3 spend update",
    url: "/blog/ai-capex-spend-update-2026q3",
  },
  {
    label: "Aug post-Q2 spend update",
    url: "/blog/ai-capex-spend-update-2026",
  },
  {
    label: "Late-Aug 202608 concentration companion",
    url: "/blog/ai-capex-spend-concentration-2026",
  },
  {
    label: "Theme baseline — AI capex spend research",
    url: "/blog/ai-capex-spend-research-2026",
  },
  {
    label: "Goldman Sachs Global Institute — Tracking Trillions",
    url: "https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out",
  },
] as const;

export const HEADLINE = {
  /** Mid-Q3 Big-5 midpoints */
  big5TotalBn: 835,
  top1SharePct: 27.5,
  top1Label: "Amazon",
  top1Bn: 230,
  top3SharePct: 73.6,
  top3Bn: 615,
  top3Labels: "Amazon + Alphabet + Microsoft",
  hhi: 2211,
  equalShareHhi: 2000,
  aiShareOfGross: 0.75,
  aiSliceBn: 626,
  /** Jul → Aug → Q3 path */
  julBig5: 760,
  augBig5: 802.5,
  q3Big5: 835,
  augToQ3DeltaBn: 32.5,
  julToQ3DeltaBn: 75,
  /** Share of positive Aug→Q3 dollar raises from Amazon+Alphabet */
  top2RaiseSharePct: 61.5,
  amazonRaiseBn: 10,
  alphabetRaiseBn: 10,
  /** Top-1 share path */
  top1Share2024Pct: 32.5,
  top1Share2025Pct: 30.2,
  top1ShareJul2026Pct: 26.3,
  top1ShareAug2026Pct: 27.4,
  top1ShareQ3Pct: 27.5,
  /** Top-3 share path */
  top3Share2024Pct: 79.2,
  top3Share2025Pct: 76.7,
  top3ShareJul2026Pct: 75.6,
  top3ShareAug2026Pct: 74.1,
  top3ShareQ3Pct: 73.6,
} as const;

export const HYPERSCALERS = [
  "Amazon",
  "Alphabet",
  "Microsoft",
  "Meta",
  "Oracle",
] as const;

export type Hyperscaler = (typeof HYPERSCALERS)[number];

export const COMPANY_COLORS: Record<Hyperscaler, string> = {
  Amazon: "#ff9900",
  Alphabet: "#34a853",
  Microsoft: "#00a4ef",
  Meta: "#0668e1",
  Oracle: "#f80000",
};

export type ShareRow = {
  company: Hyperscaler;
  bn: number;
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  note: string;
};

/** Ranked mid-Q3 2026 share ladder (descending) */
export const SHARE_LADDER_Q3: ShareRow[] = [
  {
    company: "Amazon",
    bn: 230,
    sharePct: 27.5,
    cumulativeSharePct: 27.5,
    confidence: "desk",
    fill: COMPANY_COLORS.Amazon,
    note: "Largest program; +$10B Aug→Q3 on AWS / capacity commentary",
  },
  {
    company: "Alphabet",
    bn: 210,
    sharePct: 25.1,
    cumulativeSharePct: 52.6,
    confidence: "midpoint",
    fill: COMPANY_COLORS.Alphabet,
    note: "Third raise of the year; $205–215 midpoint $210B",
  },
  {
    company: "Microsoft",
    bn: 175,
    sharePct: 21.0,
    cumulativeSharePct: 73.6,
    confidence: "call",
    fill: COMPANY_COLORS.Microsoft,
    note: "Accounting CY flat; economic build nearer ~$190B if lease reclass reversed",
  },
  {
    company: "Meta",
    bn: 145,
    sharePct: 17.4,
    cumulativeSharePct: 91.0,
    confidence: "midpoint",
    fill: COMPANY_COLORS.Meta,
    note: "$140–150 mid; finance-lease principal still in stack",
  },
  {
    company: "Oracle",
    bn: 75,
    sharePct: 9.0,
    cumulativeSharePct: 100.0,
    confidence: "net-of-prepay",
    fill: COMPANY_COLORS.Oracle,
    note: "Net of customer prepayments; gross nearer $95–100B",
  },
];

export type CapexYearKey =
  | "2024"
  | "2025"
  | "2026-jul"
  | "2026-aug"
  | "2026-q3";

/** Gross company capex by vintage (USD bn) */
export const GROSS_BY_YEAR: Record<
  CapexYearKey,
  Record<Hyperscaler, number>
> = {
  "2024": { Amazon: 75, Alphabet: 52, Microsoft: 56, Meta: 39, Oracle: 9 },
  "2025": { Amazon: 104, Alphabet: 80, Microsoft: 80, Meta: 60, Oracle: 20 },
  "2026-jul": {
    Amazon: 200,
    Alphabet: 185,
    Microsoft: 190,
    Meta: 135,
    Oracle: 50,
  },
  "2026-aug": {
    Amazon: 220,
    Alphabet: 200,
    Microsoft: 175,
    Meta: 137.5,
    Oracle: 70,
  },
  "2026-q3": {
    Amazon: 230,
    Alphabet: 210,
    Microsoft: 175,
    Meta: 145,
    Oracle: 75,
  },
};

export const YEAR_LABELS: Record<CapexYearKey, string> = {
  "2024": "2024 actual",
  "2025": "2025 actual",
  "2026-jul": "2026 Jul research",
  "2026-aug": "2026 Aug post-Q2",
  "2026-q3": "2026 mid-Q3",
};

export function yearTotal(year: CapexYearKey, aiOnly: boolean): number {
  const row = GROSS_BY_YEAR[year];
  const gross = HYPERSCALERS.reduce((s, c) => s + row[c], 0);
  return aiOnly ? Math.round(gross * HEADLINE.aiShareOfGross) : gross;
}

export function companyShares(
  year: CapexYearKey,
  aiOnly: boolean,
): Array<{
  company: Hyperscaler;
  bn: number;
  sharePct: number;
  fill: string;
}> {
  const row = GROSS_BY_YEAR[year];
  const total = yearTotal(year, false);
  return [...HYPERSCALERS]
    .map((company) => {
      const gross = row[company];
      const bn = aiOnly ? Math.round(gross * HEADLINE.aiShareOfGross) : gross;
      return {
        company,
        bn,
        sharePct: Math.round((gross / total) * 1000) / 10,
        fill: COMPANY_COLORS[company],
      };
    })
    .sort((a, b) => b.bn - a.bn);
}

export function concentrationMetrics(year: CapexYearKey) {
  const ranked = companyShares(year, false);
  const top1 = ranked[0].sharePct;
  const top3 =
    Math.round(
      ranked.slice(0, 3).reduce((s, r) => s + r.sharePct, 0) * 10,
    ) / 10;
  const hhi = Math.round(
    ranked.reduce((s, r) => s + r.sharePct * r.sharePct, 0),
  );
  return {
    top1,
    top1Label: ranked[0].company,
    top3,
    hhi,
    total: yearTotal(year, false),
    ranked,
  };
}

/** Lorenz / cumulative concentration curve */
export function concentrationCurve(year: CapexYearKey) {
  const ranked = companyShares(year, false);
  const points: Array<{
    rank: number;
    label: string;
    cumulativeSharePct: number;
    equalPct: number;
  }> = [{ rank: 0, label: "0", cumulativeSharePct: 0, equalPct: 0 }];
  let cum = 0;
  ranked.forEach((r, i) => {
    cum += r.sharePct;
    points.push({
      rank: i + 1,
      label: r.company,
      cumulativeSharePct: Math.round(cum * 10) / 10,
      equalPct: Math.round(((i + 1) / ranked.length) * 1000) / 10,
    });
  });
  return points;
}

/** Multi-year top-1 / top-3 / HHI path */
export const CONCENTRATION_PATH = (
  ["2024", "2025", "2026-jul", "2026-aug", "2026-q3"] as CapexYearKey[]
).map((year) => {
  const m = concentrationMetrics(year);
  return {
    year,
    label: YEAR_LABELS[year],
    top1Pct: m.top1,
    top3Pct: m.top3,
    hhi: m.hhi,
    totalBn: m.total,
    top1Label: m.top1Label,
  };
});

/** Aug post-Q2 → mid-Q3 company deltas (raise concentration) */
export type RaiseRow = {
  company: Hyperscaler;
  priorBn: number;
  q3Bn: number;
  deltaBn: number;
  fill: string;
  note: string;
};

export const RAISE_ROWS: RaiseRow[] = [
  {
    company: "Amazon",
    priorBn: 220,
    q3Bn: 230,
    deltaBn: 10,
    fill: COMPANY_COLORS.Amazon,
    note: "Largest absolute Aug→Q3 raise again",
  },
  {
    company: "Alphabet",
    priorBn: 200,
    q3Bn: 210,
    deltaBn: 10,
    fill: COMPANY_COLORS.Alphabet,
    note: "Tied for largest dollar step; third raise of the year",
  },
  {
    company: "Meta",
    priorBn: 137.5,
    q3Bn: 145,
    deltaBn: 7.5,
    fill: COMPANY_COLORS.Meta,
    note: "Floor and ceiling both stepped",
  },
  {
    company: "Oracle",
    priorBn: 70,
    q3Bn: 75,
    deltaBn: 5,
    fill: COMPANY_COLORS.Oracle,
    note: "Net-of-prepay step; gross still higher",
  },
  {
    company: "Microsoft",
    priorBn: 175,
    q3Bn: 175,
    deltaBn: 0,
    fill: COMPANY_COLORS.Microsoft,
    note: "Accounting print flat — lease reclass still the economic story",
  },
];

/** Positive-only raise shares for donut */
export const POSITIVE_RAISE_SLICES = RAISE_ROWS.filter((r) => r.deltaBn > 0).map(
  (r) => {
    const positiveSum = RAISE_ROWS.filter((x) => x.deltaBn > 0).reduce(
      (s, x) => s + x.deltaBn,
      0,
    );
    return {
      company: r.company,
      deltaBn: r.deltaBn,
      sharePct: Math.round((r.deltaBn / positiveSum) * 1000) / 10,
      fill: r.fill,
    };
  },
);

/** Scenario / perimeter comparison */
export type PerimeterRow = {
  id: string;
  label: string;
  scope: string;
  bn2026: number;
  color: string;
  note: string;
};

export const PERIMETER_STACKS: PerimeterRow[] = [
  {
    id: "big5-q3",
    label: "Big-5 mid-Q3",
    scope: "Hyperscaler gross midpoints",
    bn2026: 835,
    color: "#f59e0b",
    note: "Concentration lens perimeter",
  },
  {
    id: "street",
    label: "Street ~2026",
    scope: "Hyperscaler consensus band",
    bn2026: 820,
    color: "#8b5cf6",
    note: "Catch-up still trailing desk midpoints",
  },
  {
    id: "credit",
    label: "CreditSights",
    scope: "Hyperscaler credit-desk aggregate",
    bn2026: 830,
    color: "#06b6d4",
    note: "Near Big-5 sum; AI haircut separate",
  },
  {
    id: "gs-gi",
    label: "GS Global Institute",
    scope: "All-in AI infra (compute + DC + power)",
    bn2026: 765,
    color: "#0ea5e9",
    note: "Different perimeter — not company-shareable",
  },
  {
    id: "gs-ir",
    label: "GS IR hyperscaler",
    scope: "Investment Research hyperscaler path",
    bn2026: 800,
    color: "#f43f5e",
    note: "2026 IR vintage; 2027 base still $1.14T",
  },
];

/** Economic vs accounting Microsoft sensitivity on concentration */
export const MSFT_SENSITIVITY = [
  {
    id: "accounting",
    label: "Accounting CY ($175B)",
    msftBn: 175,
    big5: 835,
    top1Pct: 27.5,
    top3Pct: 73.6,
    hhi: 2211,
  },
  {
    id: "economic",
    label: "Economic CY (~$190B)",
    msftBn: 190,
    big5: 850,
    top1Pct: 27.1,
    top3Pct: 74.2,
    hhi: 2216,
  },
] as const;

export function fmtBn(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(2)}T`;
  return `$${n.toFixed(n % 1 === 0 ? 0 : 1)}B`;
}

export function fmtPct(n: number): string {
  return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}
