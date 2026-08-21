/**
 * Capex intensity concentration — Q3 2026 vintage.
 * Top-1 / top-3 shares of the intensity distribution, excess-reinvestment
 * ladder, and FCF sustainability across Big-5 hyperscalers. Complements
 * absolute-dollar spend concentration with a *ratio* lens: who sits at the
 * extreme of reinvestment / revenue under mid-Q3 guide.
 */

export type Confidence = "disclosed" | "estimated" | "annualized" | "guide" | "desk";

export const SOURCE_NOTE =
  "Concentration lens on Big-5 hyperscaler *capex intensity* (gross PP&E purchases ÷ total revenue). Mid-Q3 2026 vintage aligned with the companion intensity update: Oracle 43.5%, Meta 39.1%, Alphabet 27.2%, Microsoft 26.8%, Amazon 22.8%. Shares and HHI are within the intensity-sum perimeter (each firm’s intensity as a share of the five intensities), not of global IT capex. Excess intensity = intensity − 11% pre-AI cloud norm. FCF margin = (OCF − capex) ÷ revenue.";

export const SOURCES = [
  {
    label: "Q3 intensity mid-guide update",
    url: "/blog/ai-capex-intensity-update-2026q3",
  },
  {
    label: "Late-Aug intensity concentration companion",
    url: "/blog/ai-capex-intensity-concentration-2026",
  },
  {
    label: "Q3 spend concentration companion",
    url: "/blog/ai-capex-spend-concentration-2026q3",
  },
  {
    label: "August intensity update",
    url: "/blog/ai-capex-intensity-update-2026",
  },
  {
    label: "Theme baseline — intensity research",
    url: "/blog/ai-capex-intensity-research-2026",
  },
] as const;

export const COMPANIES = [
  "Oracle",
  "Meta",
  "Alphabet",
  "Microsoft",
  "Amazon",
] as const;

export type CompanyId = (typeof COMPANIES)[number];

export const COMPANY_COLORS: Record<CompanyId, string> = {
  Oracle: "#f80000",
  Meta: "#0668e1",
  Alphabet: "#34a853",
  Microsoft: "#00a4ef",
  Amazon: "#ff9900",
};

export const BENCHMARKS = {
  telecomNorm: 20,
  preAiCloud: 11,
  foundryBandLow: 35,
} as const;

export type IntensityVintageKey =
  | "fy24"
  | "fy25"
  | "h1-26"
  | "q3-26"
  | "aug-20";

export const VINTAGE_LABELS: Record<IntensityVintageKey, string> = {
  fy24: "FY24 actual",
  fy25: "FY25 actual",
  "h1-26": "H1’26 annualized",
  "q3-26": "Q3’26 mid-guide",
  "aug-20": "Late-Aug 202608",
};

export type IntensityRow = {
  company: CompanyId;
  intensityPct: number;
  revenueBn: number;
  capexBn: number;
  fcfMarginPct: number;
  confidence: Confidence;
};

/** Intensity % and supporting levels by vintage (desk-aligned with theme updates) */
export const INTENSITY_BY_VINTAGE: Record<
  IntensityVintageKey,
  IntensityRow[]
> = {
  fy24: [
    {
      company: "Meta",
      intensityPct: 22.8,
      revenueBn: 164.5,
      capexBn: 37.5,
      fcfMarginPct: 24.1,
      confidence: "disclosed",
    },
    {
      company: "Microsoft",
      intensityPct: 18.1,
      revenueBn: 245.1,
      capexBn: 44.5,
      fcfMarginPct: 28.2,
      confidence: "disclosed",
    },
    {
      company: "Alphabet",
      intensityPct: 14.9,
      revenueBn: 350.0,
      capexBn: 52.3,
      fcfMarginPct: 19.4,
      confidence: "disclosed",
    },
    {
      company: "Amazon",
      intensityPct: 13.0,
      revenueBn: 575.0,
      capexBn: 75.0,
      fcfMarginPct: 6.8,
      confidence: "disclosed",
    },
    {
      company: "Oracle",
      intensityPct: 13.0,
      revenueBn: 53.0,
      capexBn: 6.9,
      fcfMarginPct: 18.0,
      confidence: "disclosed",
    },
  ],
  fy25: [
    {
      company: "Oracle",
      intensityPct: 39.4,
      revenueBn: 57.4,
      capexBn: 22.6,
      fcfMarginPct: 7.2,
      confidence: "disclosed",
    },
    {
      company: "Meta",
      intensityPct: 34.7,
      revenueBn: 164.5,
      capexBn: 57.0,
      fcfMarginPct: 18.2,
      confidence: "disclosed",
    },
    {
      company: "Microsoft",
      intensityPct: 22.9,
      revenueBn: 281.7,
      capexBn: 64.5,
      fcfMarginPct: 25.4,
      confidence: "disclosed",
    },
    {
      company: "Alphabet",
      intensityPct: 22.7,
      revenueBn: 350.0,
      capexBn: 79.5,
      fcfMarginPct: 14.8,
      confidence: "disclosed",
    },
    {
      company: "Amazon",
      intensityPct: 18.4,
      revenueBn: 638.0,
      capexBn: 117.0,
      fcfMarginPct: 3.1,
      confidence: "disclosed",
    },
  ],
  "h1-26": [
    {
      company: "Oracle",
      intensityPct: 41.0,
      revenueBn: 72.0,
      capexBn: 29.5,
      fcfMarginPct: 5.8,
      confidence: "annualized",
    },
    {
      company: "Meta",
      intensityPct: 36.5,
      revenueBn: 210.0,
      capexBn: 76.7,
      fcfMarginPct: 16.1,
      confidence: "annualized",
    },
    {
      company: "Microsoft",
      intensityPct: 26.8,
      revenueBn: 329.8,
      capexBn: 88.4,
      fcfMarginPct: 22.1,
      confidence: "disclosed",
    },
    {
      company: "Alphabet",
      intensityPct: 25.4,
      revenueBn: 420.0,
      capexBn: 106.7,
      fcfMarginPct: 12.6,
      confidence: "annualized",
    },
    {
      company: "Amazon",
      intensityPct: 21.2,
      revenueBn: 700.0,
      capexBn: 148.4,
      fcfMarginPct: 2.4,
      confidence: "annualized",
    },
  ],
  "q3-26": [
    {
      company: "Oracle",
      intensityPct: 43.5,
      revenueBn: 88.5,
      capexBn: 38.5,
      fcfMarginPct: 3.5,
      confidence: "guide",
    },
    {
      company: "Meta",
      intensityPct: 39.1,
      revenueBn: 243.0,
      capexBn: 95.0,
      fcfMarginPct: 13.9,
      confidence: "guide",
    },
    {
      company: "Alphabet",
      intensityPct: 27.2,
      revenueBn: 470.0,
      capexBn: 128.0,
      fcfMarginPct: 10.8,
      confidence: "guide",
    },
    {
      company: "Microsoft",
      intensityPct: 26.8,
      revenueBn: 329.8,
      capexBn: 88.4,
      fcfMarginPct: 21.4,
      confidence: "disclosed",
    },
    {
      company: "Amazon",
      intensityPct: 22.8,
      revenueBn: 768.0,
      capexBn: 175.0,
      fcfMarginPct: 1.1,
      confidence: "guide",
    },
  ],
  "aug-20": [
    {
      company: "Oracle",
      intensityPct: 43.5,
      revenueBn: 88.5,
      capexBn: 38.5,
      fcfMarginPct: 3.0,
      confidence: "guide",
    },
    {
      company: "Meta",
      intensityPct: 40.5,
      revenueBn: 243.0,
      capexBn: 98.5,
      fcfMarginPct: 12.6,
      confidence: "desk",
    },
    {
      company: "Alphabet",
      intensityPct: 28.3,
      revenueBn: 470.0,
      capexBn: 133.0,
      fcfMarginPct: 9.9,
      confidence: "desk",
    },
    {
      company: "Microsoft",
      intensityPct: 26.8,
      revenueBn: 329.8,
      capexBn: 88.4,
      fcfMarginPct: 20.9,
      confidence: "disclosed",
    },
    {
      company: "Amazon",
      intensityPct: 23.8,
      revenueBn: 768.0,
      capexBn: 183.0,
      fcfMarginPct: 0.3,
      confidence: "desk",
    },
  ],
};

export type MetricMode = "intensity-sum" | "excess" | "capex-dollars";

export type ShareLadderRow = {
  company: CompanyId;
  intensityPct: number;
  excessPct: number;
  sharePct: number;
  cumulativeSharePct: number;
  revenueBn: number;
  capexBn: number;
  fcfMarginPct: number;
  confidence: Confidence;
  fill: string;
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function weightFor(r: IntensityRow, mode: MetricMode): number {
  if (mode === "excess") {
    return Math.max(0, r.intensityPct - BENCHMARKS.preAiCloud);
  }
  if (mode === "capex-dollars") {
    return r.capexBn;
  }
  return r.intensityPct;
}

/** Build share ladder under one of three concentration perimeters */
export function shareLadder(
  vintage: IntensityVintageKey,
  mode: MetricMode = "intensity-sum",
): ShareLadderRow[] {
  const ranked = [...INTENSITY_BY_VINTAGE[vintage]].sort(
    (a, b) => weightFor(b, mode) - weightFor(a, mode),
  );
  const weights = ranked.map((r) => weightFor(r, mode));
  const total = weights.reduce((s, w) => s + w, 0);
  let cum = 0;
  return ranked.map((r, i) => {
    const w = weights[i];
    const sharePct = total > 0 ? round1((w / total) * 100) : 0;
    const isLast = i === ranked.length - 1;
    cum = isLast ? 100 : round1(cum + sharePct);
    return {
      company: r.company,
      intensityPct: r.intensityPct,
      excessPct: round1(r.intensityPct - BENCHMARKS.preAiCloud),
      sharePct,
      cumulativeSharePct: cum,
      revenueBn: r.revenueBn,
      capexBn: r.capexBn,
      fcfMarginPct: r.fcfMarginPct,
      confidence: r.confidence,
      fill: COMPANY_COLORS[r.company],
    };
  });
}

export function concentrationMetrics(
  vintage: IntensityVintageKey,
  mode: MetricMode = "intensity-sum",
) {
  const ladder = shareLadder(vintage, mode);
  const top1 = ladder[0].sharePct;
  const top3 = round1(
    ladder.slice(0, 3).reduce((s, r) => s + r.sharePct, 0),
  );
  const hhi = Math.round(
    ladder.reduce((s, r) => s + r.sharePct * r.sharePct, 0),
  );
  const intensitySum = ladder.reduce((s, r) => s + r.intensityPct, 0);
  const weighted =
    ladder.reduce((s, r) => s + r.capexBn, 0) /
    ladder.reduce((s, r) => s + r.revenueBn, 0);
  return {
    top1,
    top1Label: ladder[0].company,
    top1Intensity: ladder[0].intensityPct,
    top3,
    top3Labels: ladder
      .slice(0, 3)
      .map((r) => r.company)
      .join(" + "),
    hhi,
    intensitySum: round1(intensitySum),
    revenueWeightedPct: round1(weighted * 100),
    medianIntensity: ladder[2].intensityPct,
    ladder,
  };
}

export function concentrationCurve(
  vintage: IntensityVintageKey,
  mode: MetricMode = "intensity-sum",
) {
  const ladder = shareLadder(vintage, mode);
  const points: Array<{
    rank: number;
    label: string;
    cumulativeSharePct: number;
    equalPct: number;
  }> = [{ rank: 0, label: "0", cumulativeSharePct: 0, equalPct: 0 }];
  ladder.forEach((r, i) => {
    points.push({
      rank: i + 1,
      label: r.company,
      cumulativeSharePct: r.cumulativeSharePct,
      equalPct: round1(((i + 1) / ladder.length) * 100),
    });
  });
  return points;
}

export const CONCENTRATION_PATH = (
  ["fy24", "fy25", "h1-26", "q3-26", "aug-20"] as IntensityVintageKey[]
).map((vintage) => {
  const m = concentrationMetrics(vintage, "intensity-sum");
  const excess = concentrationMetrics(vintage, "excess");
  return {
    vintage,
    label: VINTAGE_LABELS[vintage],
    top1Pct: m.top1,
    top3Pct: m.top3,
    hhi: m.hhi,
    top1Label: m.top1Label,
    top1Intensity: m.top1Intensity,
    excessTop1Pct: excess.top1,
    excessTop3Pct: excess.top3,
    revenueWeightedPct: m.revenueWeightedPct,
  };
});

/** Mid-Q3 headline (intensity-sum perimeter) — primary vintage for this post */
const _q3 = concentrationMetrics("q3-26", "intensity-sum");
const _q3Excess = concentrationMetrics("q3-26", "excess");
const _q3Dollars = concentrationMetrics("q3-26", "capex-dollars");
const _h1 = concentrationMetrics("h1-26", "intensity-sum");
const _aug = concentrationMetrics("aug-20", "intensity-sum");

export const HEADLINE = {
  top1SharePct: _q3.top1,
  top1Label: _q3.top1Label,
  top1IntensityPct: _q3.top1Intensity,
  top3SharePct: _q3.top3,
  top3Labels: _q3.top3Labels,
  hhi: _q3.hhi,
  equalShareHhi: 2000,
  intensitySum: _q3.intensitySum,
  revenueWeightedPct: _q3.revenueWeightedPct,
  excessTop1SharePct: _q3Excess.top1,
  excessTop3SharePct: _q3Excess.top3,
  dollarTop1SharePct: _q3Dollars.top1,
  dollarTop1Label: _q3Dollars.top1Label,
  dollarTop3SharePct: _q3Dollars.top3,
  metaIntensity: 39.1,
  oracleIntensity: 43.5,
  amazonIntensity: 22.8,
  amazonFcf: 1.1,
  microsoftFcf: 21.4,
  alphabetIntensity: 27.2,
  telecomNorm: BENCHMARKS.telecomNorm,
  preAiCloud: BENCHMARKS.preAiCloud,
  namesAboveTelecom: 5,
  namesAboveFoundry: 2,
  fy24Top1Pct: concentrationMetrics("fy24").top1,
  fy25Top1Pct: concentrationMetrics("fy25").top1,
  h1Top1Pct: _h1.top1,
  h1Top3Pct: _h1.top3,
  h1Hhi: _h1.hhi,
  augTop1Pct: _aug.top1,
  augTop3Pct: _aug.top3,
  augHhi: _aug.hhi,
  q3ToAugTop1DeltaPp: round1(_aug.top1 - _q3.top1),
  q3ToAugTop3DeltaPp: round1(_aug.top3 - _q3.top3),
} as const;

export const SHARE_LADDER_Q3 = shareLadder("q3-26", "intensity-sum");

export type SustainabilityPoint = {
  company: CompanyId;
  intensity: number;
  fcfMargin: number;
  capexBn: number;
  fill: string;
  band: "comfortable" | "stretched" | "extreme";
};

export function sustainabilityScatter(
  vintage: IntensityVintageKey = "q3-26",
): SustainabilityPoint[] {
  return INTENSITY_BY_VINTAGE[vintage].map((r) => {
    let band: SustainabilityPoint["band"] = "comfortable";
    if (r.intensityPct >= 25) band = "extreme";
    else if (r.intensityPct >= 15) band = "stretched";
    return {
      company: r.company,
      intensity: r.intensityPct,
      fcfMargin: r.fcfMarginPct,
      capexBn: r.capexBn,
      fill: COMPANY_COLORS[r.company],
      band,
    };
  });
}

/** Excess-intensity slices for donut (mid-Q3) */
export const EXCESS_SLICES = shareLadder("q3-26", "excess").map((r) => ({
  company: r.company,
  value: r.excessPct,
  sharePct: r.sharePct,
  fill: r.fill,
}));

/** Dual-perimeter comparison: intensity-sum vs dollar shares (mid-Q3) */
export const PERIMETER_COMPARE = COMPANIES.map((company) => {
  const intensity = SHARE_LADDER_Q3.find((r) => r.company === company)!;
  const dollars = shareLadder("q3-26", "capex-dollars").find(
    (r) => r.company === company,
  )!;
  return {
    company,
    intensitySharePct: intensity.sharePct,
    dollarSharePct: dollars.sharePct,
    intensityPct: intensity.intensityPct,
    fill: COMPANY_COLORS[company],
  };
}).sort((a, b) => b.intensitySharePct - a.intensitySharePct);

/** H1 → Q3 → Late-Aug concentration delta strip */
export const VINTAGE_DELTA_STRIP = (
  ["h1-26", "q3-26", "aug-20"] as IntensityVintageKey[]
).map((vintage) => {
  const m = concentrationMetrics(vintage, "intensity-sum");
  return {
    vintage,
    label: VINTAGE_LABELS[vintage],
    top1Pct: m.top1,
    top3Pct: m.top3,
    hhi: m.hhi,
    top1Label: m.top1Label,
  };
});

export const SUSTAINABILITY_BANDS = {
  comfortable: {
    low: 0,
    high: 15,
    label: "Historical cloud range",
    fill: "#86efac",
  },
  stretched: {
    low: 15,
    high: 25,
    label: "Elevated reinvestment",
    fill: "#fde68a",
  },
  extreme: {
    low: 25,
    high: 50,
    label: "Telecom / foundry territory",
    fill: "#fecaca",
  },
} as const;

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtBn(n: number): string {
  return n >= 100 ? `$${n.toFixed(0)}B` : `$${n.toFixed(1)}B`;
}
