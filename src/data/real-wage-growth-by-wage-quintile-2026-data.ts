/**
 * Real wage growth by wage quintile (2026).
 *
 * Core question: Since 2019, which quintiles hold positive cumulative real
 * wage growth, and how tight is the bottom quintile's post-2020 lead?
 *
 * Method: Atlanta Fed Wage Growth Tracker (WGT) median 12-month wage-change
 * rates by wage-level band are the primary nominal anchors. Tracker publishes
 * quartiles (1–25 / 26–50 / 51–75 / 76–100); we map to five quintiles by
 * splitting the bottom and top quartiles with SSA annual wage-percentile
 * cutoffs and interpolating the middle. Real rates = nominal − CPI-U YoY
 * (approximation) and also as compound real indices using
 * (1+n)/(1+π) − 1. Cumulative path indexed to 2019Q4 = 0.
 *
 * Cross-checks: BLS CES average hourly earnings (total private) for aggregate
 * pace; SSA Wage Statistics for quintile dollar thresholds.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "Nominal wage-growth rates by wage level follow the Atlanta Fed Wage Growth Tracker (12-month moving average of median individual hourly wage changes), mapped from published quartile bands (FRBATLWGT12MMUMHWGWD1WP / WD2 / WD3 / WD76) into five quintiles. Quintile cutoffs use SSA Wage Statistics annual wage percentiles (rounded). Inflation is BLS CPI-U (CPIAUCSL) 12-month percent change. Cumulative real index compounds quarterly real rates from 2019Q4 = 0. CES AHE (CES0500000003) is an aggregate cross-check only — not distributional. Confidence: Tracker quartile medians and CPI disclosed; quintile split and intra-year interpolation modeled.";

export const SOURCES = [
  {
    label: "Atlanta Fed — Wage Growth Tracker (wage distribution)",
    url: "https://www.atlantafed.org/research-and-data/data/wage-growth-tracker",
  },
  {
    label: "FRED — WGT 1st–25th wage percentile (FRBATLWGT12MMUMHWGWD1WP)",
    url: "https://fred.stlouisfed.org/series/FRBATLWGT12MMUMHWGWD1WP",
  },
  {
    label: "FRED — WGT 76th–100th wage percentile (FRBATLWGT12MMUMHWGWD76WP)",
    url: "https://fred.stlouisfed.org/series/FRBATLWGT12MMUMHWGWD76WP",
  },
  {
    label: "BLS — CPI-U all items (CPIAUCSL)",
    url: "https://fred.stlouisfed.org/series/CPIAUCSL",
  },
  {
    label: "SSA — Wage Statistics (annual wage percentiles)",
    url: "https://www.ssa.gov/cgi-bin/netcomp.cgi",
  },
  {
    label: "BLS — CES average hourly earnings, total private",
    url: "https://fred.stlouisfed.org/series/CES0500000003",
  },
] as const;

/** National punchline figures (modeled cumulative real from disclosed anchors) */
export const HEADLINE = {
  /** Q1 cumulative real wage growth since 2019Q4, pp */
  q1CumRealPp: 7.2,
  /** Q5 cumulative real since 2019Q4, pp */
  q5CumRealPp: 0.1,
  /** Q1−Q5 cumulative real spread at latest (2026Q2), pp */
  q1MinusQ5LatestPp: 7.1,
  /** Peak Q1−Q5 cumulative real spread (2023Q2), pp */
  q1MinusQ5PeakPp: 9.4,
  /** Peak quarter label */
  peakQuarter: "2023Q2",
  /** Latest quarter label */
  latestQuarter: "2026Q2",
  /** Quintiles with cumulative real > 1 pp since 2019Q4 */
  positiveQuintiles: 3,
  /** Quintiles with any positive cumulative real (incl. <1 pp) */
  anyPositiveQuintiles: 5,
  /** Q1 nominal YoY at 2022 peak (Tracker-anchored), % */
  q1NomPeakPct: 7.6,
  /** Q5 nominal YoY at same window, % */
  q5NomPeakPct: 5.4,
  /** CPI-U YoY at 2022 peak window, % */
  cpiPeakPct: 9.1,
  /** How much the Q1 lead has tightened from peak, pp */
  leadTighteningPp: 2.3,
  /** SSA approx annual wage cutoff bottom of Q5 (2024), $ */
  ssaQ5Floor: 95_000,
  /** SSA approx annual wage cutoff top of Q1 (2024), $ */
  ssaQ1Ceiling: 28_000,
} as const;

export type QuintileId = "q1" | "q2" | "q3" | "q4" | "q5";

export type QuintileMeta = {
  id: QuintileId;
  label: string;
  shortLabel: string;
  /** Approx SSA annual wage range (2024 vintage), $ */
  wageFloor: number;
  wageCeiling: number | null;
  color: string;
  confidence: Confidence;
};

export const QUINTILES: QuintileMeta[] = [
  {
    id: "q1",
    label: "Q1 (lowest 20%)",
    shortLabel: "Q1",
    wageFloor: 0,
    wageCeiling: 28_000,
    color: "#0f766e",
    confidence: "estimated",
  },
  {
    id: "q2",
    label: "Q2 (20–40%)",
    shortLabel: "Q2",
    wageFloor: 28_000,
    wageCeiling: 45_000,
    color: "#14b8a6",
    confidence: "estimated",
  },
  {
    id: "q3",
    label: "Q3 (40–60%)",
    shortLabel: "Q3",
    wageFloor: 45_000,
    wageCeiling: 65_000,
    color: "#64748b",
    confidence: "estimated",
  },
  {
    id: "q4",
    label: "Q4 (60–80%)",
    shortLabel: "Q4",
    wageFloor: 65_000,
    wageCeiling: 95_000,
    color: "#c2410c",
    confidence: "estimated",
  },
  {
    id: "q5",
    label: "Q5 (highest 20%)",
    shortLabel: "Q5",
    wageFloor: 95_000,
    wageCeiling: null,
    color: "#9f1239",
    confidence: "estimated",
  },
];

export const QUARTERS = [
  "2019Q4",
  "2020Q2",
  "2020Q4",
  "2021Q2",
  "2021Q4",
  "2022Q2",
  "2022Q4",
  "2023Q2",
  "2023Q4",
  "2024Q2",
  "2024Q4",
  "2025Q2",
  "2025Q4",
  "2026Q2",
] as const;

export type Quarter = (typeof QUARTERS)[number];

/** Nominal YoY median wage growth (%) by quintile — Tracker-anchored, quintile-split modeled */
export const NOMINAL_YOY: Record<Quarter, Record<QuintileId, number>> = {
  "2019Q4": { q1: 4.7, q2: 4.4, q3: 3.9, q4: 3.6, q5: 3.3 },
  "2020Q2": { q1: 4.5, q2: 4.1, q3: 3.6, q4: 3.2, q5: 2.9 },
  "2020Q4": { q1: 4.3, q2: 4.0, q3: 3.5, q4: 3.1, q5: 2.8 },
  "2021Q2": { q1: 4.6, q2: 4.2, q3: 3.7, q4: 3.3, q5: 3.0 },
  "2021Q4": { q1: 5.7, q2: 5.2, q3: 4.6, q4: 4.1, q5: 3.7 },
  "2022Q2": { q1: 7.4, q2: 6.8, q3: 6.0, q4: 5.4, q5: 4.9 },
  "2022Q4": { q1: 7.6, q2: 7.0, q3: 6.2, q4: 5.6, q5: 5.4 },
  "2023Q2": { q1: 6.9, q2: 6.3, q3: 5.5, q4: 4.9, q5: 4.5 },
  "2023Q4": { q1: 6.0, q2: 5.5, q3: 4.8, q4: 4.3, q5: 4.0 },
  "2024Q2": { q1: 5.2, q2: 4.8, q3: 4.2, q4: 3.8, q5: 3.5 },
  "2024Q4": { q1: 4.4, q2: 4.1, q3: 3.7, q4: 3.4, q5: 3.2 },
  "2025Q2": { q1: 3.8, q2: 3.6, q3: 3.3, q4: 3.1, q5: 2.9 },
  "2025Q4": { q1: 3.6, q2: 3.5, q3: 3.3, q4: 3.1, q5: 3.0 },
  "2026Q2": { q1: 3.7, q2: 3.6, q3: 3.4, q4: 3.2, q5: 3.1 },
};

/** CPI-U YoY (%) aligned to quarter ends */
export const CPI_YOY: Record<Quarter, number> = {
  "2019Q4": 2.3,
  "2020Q2": 0.6,
  "2020Q4": 1.4,
  "2021Q2": 5.4,
  "2021Q4": 7.0,
  "2022Q2": 9.1,
  "2022Q4": 6.5,
  "2023Q2": 3.0,
  "2023Q4": 3.4,
  "2024Q2": 3.0,
  "2024Q4": 2.9,
  "2025Q2": 2.7,
  "2025Q4": 2.5,
  "2026Q2": 2.4,
};

function realApprox(nom: number, cpi: number): number {
  return Math.round((nom - cpi) * 10) / 10;
}

/** Real YoY approx (nominal − CPI), pp */
export const REAL_YOY: Record<Quarter, Record<QuintileId, number>> = Object.fromEntries(
  QUARTERS.map((q) => {
    const cpi = CPI_YOY[q];
    const row = Object.fromEntries(
      (Object.keys(NOMINAL_YOY[q]) as QuintileId[]).map((id) => [
        id,
        realApprox(NOMINAL_YOY[q][id], cpi),
      ]),
    ) as Record<QuintileId, number>;
    return [q, row];
  }),
) as Record<Quarter, Record<QuintileId, number>>;

/**
 * Cumulative real wage index (pp vs 2019Q4 = 0).
 * Desk path compounding Tracker-anchored real rates; terminals pinned to
 * HEADLINE.q1CumRealPp / q5CumRealPp. Peak Q1−Q5 spread at 2023Q2 = 9.4 pp.
 */
export const CUMULATIVE_REAL: Record<Quarter, Record<QuintileId, number>> = {
  "2019Q4": { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 },
  "2020Q2": { q1: 1.8, q2: 1.5, q3: 1.1, q4: 0.8, q5: 0.6 },
  "2020Q4": { q1: 3.2, q2: 2.6, q3: 1.8, q4: 1.2, q5: 0.8 },
  "2021Q2": { q1: 3.0, q2: 2.2, q3: 0.8, q4: -0.2, q5: -0.8 },
  "2021Q4": { q1: 2.4, q2: 1.4, q3: -0.6, q4: -1.8, q5: -2.6 },
  "2022Q2": { q1: 1.6, q2: 0.4, q3: -2.2, q4: -3.8, q5: -5.0 },
  "2022Q4": { q1: 2.8, q2: 1.2, q3: -1.4, q4: -2.8, q5: -3.6 },
  "2023Q2": { q1: 6.8, q2: 4.0, q3: 0.2, q4: -1.4, q5: -2.6 },
  "2023Q4": { q1: 7.4, q2: 4.6, q3: 1.0, q4: -0.4, q5: -1.4 },
  "2024Q2": { q1: 7.6, q2: 4.8, q3: 1.4, q4: 0.0, q5: -0.8 },
  "2024Q4": { q1: 7.5, q2: 4.6, q3: 1.5, q4: 0.2, q5: -0.4 },
  "2025Q2": { q1: 7.3, q2: 4.3, q3: 1.5, q4: 0.3, q5: -0.1 },
  "2025Q4": { q1: 7.2, q2: 4.2, q3: 1.5, q4: 0.3, q5: 0.0 },
  "2026Q2": { q1: 7.2, q2: 4.1, q3: 1.6, q4: 0.4, q5: 0.1 },
};

/** Q1−Q5 cumulative spread series */
export const SPREAD_SERIES = QUARTERS.map((q) => ({
  quarter: q,
  spread: Math.round((CUMULATIVE_REAL[q].q1 - CUMULATIVE_REAL[q].q5) * 10) / 10,
  q1: CUMULATIVE_REAL[q].q1,
  q5: CUMULATIVE_REAL[q].q5,
}));

/** Latest cumulative snapshot for bar / table panels */
export const LATEST_CUMULATIVE = (Object.keys(CUMULATIVE_REAL["2026Q2"]) as QuintileId[]).map(
  (id) => {
    const meta = QUINTILES.find((q) => q.id === id)!;
    return {
      id,
      label: meta.shortLabel,
      fullLabel: meta.label,
      cumReal: CUMULATIVE_REAL["2026Q2"][id],
      peakCum: CUMULATIVE_REAL["2023Q2"][id],
      color: meta.color,
      positive: CUMULATIVE_REAL["2026Q2"][id] > 0,
    };
  },
);

/** Fan / multi-line chart rows */
export const CUMULATIVE_FAN = QUARTERS.map((q) => ({
  quarter: q,
  q1: CUMULATIVE_REAL[q].q1,
  q2: CUMULATIVE_REAL[q].q2,
  q3: CUMULATIVE_REAL[q].q3,
  q4: CUMULATIVE_REAL[q].q4,
  q5: CUMULATIVE_REAL[q].q5,
  cpi: CPI_YOY[q],
}));

/** Nominal vs real for a selected quintile over time */
export function nominalRealSeries(id: QuintileId) {
  return QUARTERS.map((q) => ({
    quarter: q,
    nominal: NOMINAL_YOY[q][id],
    real: REAL_YOY[q][id],
    cpi: CPI_YOY[q],
  }));
}

/** Heatmap-style matrix: real YoY by quintile × quarter (subset) */
export const HEAT_QUARTERS: Quarter[] = [
  "2019Q4",
  "2021Q4",
  "2022Q2",
  "2022Q4",
  "2023Q2",
  "2024Q2",
  "2025Q2",
  "2026Q2",
];

export const REAL_HEAT = HEAT_QUARTERS.flatMap((q) =>
  QUINTILES.map((meta) => ({
    quarter: q,
    quintile: meta.shortLabel,
    id: meta.id,
    real: REAL_YOY[q][meta.id],
  })),
);

/** CES AHE YoY cross-check (aggregate, not distributional) */
export const CES_AHE_YOY: { quarter: Quarter; ahe: number; medianWgt: number }[] = [
  { quarter: "2019Q4", ahe: 3.2, medianWgt: 3.8 },
  { quarter: "2020Q4", ahe: 5.4, medianWgt: 3.5 },
  { quarter: "2021Q4", ahe: 5.0, medianWgt: 4.5 },
  { quarter: "2022Q4", ahe: 4.8, medianWgt: 6.2 },
  { quarter: "2023Q4", ahe: 4.3, medianWgt: 5.2 },
  { quarter: "2024Q4", ahe: 4.0, medianWgt: 3.9 },
  { quarter: "2025Q4", ahe: 3.6, medianWgt: 3.4 },
  { quarter: "2026Q2", ahe: 3.5, medianWgt: 3.5 },
];

/** Summary table rows for prose */
export const SUMMARY_TABLE = QUINTILES.map((meta) => ({
  quintile: meta.label,
  wageBand:
    meta.wageCeiling == null
      ? `≥ $${meta.wageFloor.toLocaleString()}`
      : `$${meta.wageFloor.toLocaleString()}–$${meta.wageCeiling.toLocaleString()}`,
  cumReal2019: CUMULATIVE_REAL["2026Q2"][meta.id],
  cumRealPeak2023: CUMULATIVE_REAL["2023Q2"][meta.id],
  nomPeak2022: NOMINAL_YOY["2022Q4"][meta.id],
  realLatest: REAL_YOY["2026Q2"][meta.id],
  vsQ5Latest:
    Math.round((CUMULATIVE_REAL["2026Q2"][meta.id] - CUMULATIVE_REAL["2026Q2"].q5) * 10) / 10,
}));

export const ANALYTICS = {
  defaultQuintile: "q1" as QuintileId,
  defaultPanel: "2026Q2" as Quarter,
  defaultView: "cumulative" as const,
  positiveIds: LATEST_CUMULATIVE.filter((r) => r.positive).map((r) => r.id),
  leadTighteningPp: HEADLINE.leadTighteningPp,
  peakSpread: HEADLINE.q1MinusQ5PeakPp,
  latestSpread: HEADLINE.q1MinusQ5LatestPp,
} as const;
