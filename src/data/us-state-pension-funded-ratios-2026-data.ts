/**
 * US state pension funded ratios (2026 desk).
 *
 * Core question: What is the distribution of actuarial / market-valued
 * funded ratios across state plans, and how concentrated is unfunded
 * actuarial accrued liability (UAAL) in a handful of states?
 *
 * Primary anchors: Equable Institute State of Pensions 2025 (January 2026
 * update) for state-weighted funded ratios and UAAL; Boston College CRR
 * Issue Brief 25-15 (July 2025) for Public Plans Database actuarial
 * aggregate path and tercile distribution; Pew Charitable Trusts State
 * Pension Funding Gap series for contribution-policy context.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export type RegionId =
  | "Northeast"
  | "Midwest"
  | "South"
  | "West"
  | "DC";

export type BandId = "resilient" | "fragile" | "distressed";

export const SOURCE_NOTE =
  "State funded ratios and unfunded liabilities (UAAL) are Equable Institute State of Pensions 2025 January 2026 estimates for statewide plans plus large municipally managed plans (≥$1B liabilities), weighted by assets/liabilities within each state. National aggregate funded ratio 82.5% and UAAL $1.27T are Equable end-2025 estimates (market-valued / estimated assets). Boston College CRR IB 25-15 reports a lower Public Plans Database actuarial funded ratio of 77.7% for FY 2025 — a different measurement basis (actuarial vs market/estimated). Pew funding-gap briefs supply historical contribution and amortization context, not the 2025 state cross-section. Negative UAAL denotes overfunded status. Desk concentration shares use positive UAAL only against Equable’s $1.27T national shortfall.";

export const SOURCES = [
  {
    label: "Equable — State of Pensions 2025 (January 2026 update)",
    url: "https://equable.org/wp-content/uploads/2026/01/State-of-Pensions-2025_January-Update_Final.pdf",
  },
  {
    label: "Equable — 2025 pension funded status by state",
    url: "https://equable.org/news/unfunded-liabilities-for-state-pension-plans-in-2025/",
  },
  {
    label: "Equable — Pension plan funded ratio rankings 2025",
    url: "https://equable.org/news/pension-plan-funded-ratio-rankings-2025/",
  },
  {
    label:
      "Boston College CRR — The Funded Status of Public Plans Keeps Improving (IB 25-15)",
    url: "https://crr.bc.edu/wp-content/uploads/2025/07/IB_25-15-3.pdf",
  },
  {
    label: "Public Plans Database (CRR / MissionSquare / NASRA / GFOA)",
    url: "https://publicplansdata.org/",
  },
  {
    label: "Pew Charitable Trusts — The State Pension Funding Gap",
    url: "https://www.pew.org/en/research-and-analysis/issue-briefs/2019/06/the-state-pension-funding-gap-2017",
  },
] as const;

/** Headline punchline — top-state UAAL share */
export const HEADLINE = {
  /** Equable national aggregate funded ratio, end-2025 est. */
  nationalFundedRatioPct: 82.5,
  /** Equable national UAAL, $T */
  nationalUaalTrillion: 1.27,
  /** Equable prior-year UAAL, $T */
  nationalUaalTrillion2024: 1.54,
  /** Equable prior-year funded ratio % */
  nationalFundedRatio2024Pct: 78.0,
  /** CRR PPD actuarial funded ratio FY 2025 est. */
  crrActuarialFundedPct: 77.7,
  /** CRR top-third / middle / bottom-third plan aggregates FY 2025 */
  crrTopThirdPct: 95,
  crrMiddleThirdPct: 78,
  crrBottomThirdPct: 58,
  /** CA + IL share of national positive UAAL */
  top2UaalSharePct: 36.4,
  /** Top 5 states share of national positive UAAL */
  top5UaalSharePct: 54.6,
  /** Top 10 states share of national positive UAAL */
  top10UaalSharePct: 70.4,
  /** California UAAL $B */
  californiaUaalB: 256.4,
  /** Illinois UAAL $B */
  illinoisUaalB: 205.9,
  /** Illinois funded ratio % (worst statewide average) */
  illinoisFundedPct: 54.0,
  /** States + DC at/above 100% funded */
  fullyFundedCount: 7,
  /** States below 60% funded (distressed) */
  distressedCount: 3,
  /** Equable avg assumed return % */
  assumedReturnPct: 6.87,
  /** Equable 2025 avg investment return % */
  actualReturn2025Pct: 9.5,
} as const;

export type StateRow = {
  id: string;
  label: string;
  region: RegionId;
  /** Equable 2025 estimated funded ratio, % */
  fundedPct: number;
  /** Equable 2025 estimated UAAL, $B (negative = surplus) */
  uaalB: number;
  /** Rank by funded ratio (1 = best) */
  fundedRank: number;
  band: BandId;
  confidence: Confidence;
};

function bandOf(fundedPct: number): BandId {
  if (fundedPct >= 90) return "resilient";
  if (fundedPct >= 60) return "fragile";
  return "distressed";
}

/** Equable January 2026 state ranking (funded ratio + UAAL). */
export const STATES_2025: StateRow[] = (
  [
    ["dc", "District of Columbia", "DC", 117.6, -2.07, 1],
    ["tn", "Tennessee", "South", 114.6, -10.19, 2],
    ["ne", "Nebraska", "Midwest", 107.2, -1.45, 3],
    ["wi", "Wisconsin", "Midwest", 106.2, -9.33, 4],
    ["wa", "Washington", "West", 103.2, -5.25, 5],
    ["ut", "Utah", "West", 100.2, -0.1, 6],
    ["sd", "South Dakota", "Midwest", 100.0, 0, 7],
    ["wv", "West Virginia", "South", 99.8, 0.04, 8],
    ["mn", "Minnesota", "Midwest", 95.4, 5.16, 9],
    ["nc", "North Carolina", "South", 94.1, 8.68, 10],
    ["ny", "New York", "Northeast", 93.7, 46.65, 11],
    ["de", "Delaware", "Northeast", 93.3, 0.98, 12],
    ["ia", "Iowa", "Midwest", 92.9, 3.8, 13],
    ["va", "Virginia", "South", 92.6, 10.76, 14],
    ["wy", "Wyoming", "West", 92.0, 0.98, 15],
    ["id", "Idaho", "West", 90.9, 2.42, 16],
    ["me", "Maine", "Northeast", 90.6, 2.21, 17],
    ["ok", "Oklahoma", "South", 89.5, 5.39, 18],
    ["ar", "Arkansas", "South", 87.1, 6.18, 19],
    ["nv", "Nevada", "West", 86.4, 11.74, 20],
    ["or", "Oregon", "West", 86.2, 15.37, 21],
    ["fl", "Florida", "South", 86.0, 36.01, 22],
    ["ga", "Georgia", "South", 84.8, 25.03, 23],
    ["ca", "California", "West", 84.2, 256.44, 24],
    ["ks", "Kansas", "Midwest", 83.9, 6.58, 25],
    ["in", "Indiana", "Midwest", 83.7, 8.82, 26],
    ["oh", "Ohio", "Midwest", 83.7, 49.21, 27],
    ["mo", "Missouri", "Midwest", 83.5, 18.74, 28],
    ["tx", "Texas", "South", 82.5, 86.68, 29],
    ["la", "Louisiana", "South", 82.3, 14.06, 30],
    ["mi", "Michigan", "Midwest", 81.9, 26.74, 31],
    ["mt", "Montana", "West", 78.5, 3.7, 32],
    ["ak", "Alaska", "West", 78.4, 5.49, 33],
    ["az", "Arizona", "West", 78.3, 23.96, 34],
    ["co", "Colorado", "West", 78.1, 23.39, 35],
    ["al", "Alabama", "South", 77.9, 15.87, 36],
    ["ma", "Massachusetts", "Northeast", 75.5, 33.31, 37],
    ["md", "Maryland", "South", 74.7, 26.2, 38],
    ["nd", "North Dakota", "Midwest", 74.2, 2.93, 39],
    ["nh", "New Hampshire", "Northeast", 74.2, 4.66, 40],
    ["ri", "Rhode Island", "Northeast", 73.3, 4.68, 41],
    ["vt", "Vermont", "Northeast", 70.4, 3.02, 42],
    ["pa", "Pennsylvania", "Northeast", 69.9, 58.94, 43],
    ["nm", "New Mexico", "West", 68.2, 17.44, 44],
    ["sc", "South Carolina", "South", 66.7, 25.16, 45],
    ["ct", "Connecticut", "Northeast", 66.3, 31.22, 46],
    ["hi", "Hawaii", "West", 62.6, 14.73, 47],
    ["nj", "New Jersey", "Northeast", 60.2, 85.74, 48],
    ["ms", "Mississippi", "South", 59.0, 25.1, 49],
    ["ky", "Kentucky", "South", 58.5, 35.76, 50],
    ["il", "Illinois", "Midwest", 54.0, 205.87, 51],
  ] as const
).map(([id, label, region, fundedPct, uaalB, fundedRank]) => ({
  id,
  label,
  region,
  fundedPct,
  uaalB,
  fundedRank,
  band: bandOf(fundedPct),
  confidence: "estimated" as Confidence,
}));

/** CRR PPD aggregate actuarial funded ratio path (selected years). */
export const CRR_FUNDED_PATH = [
  { year: 2001, fundedPct: 103 },
  { year: 2007, fundedPct: 87 },
  { year: 2009, fundedPct: 79 },
  { year: 2013, fundedPct: 72 },
  { year: 2016, fundedPct: 72 },
  { year: 2019, fundedPct: 72 },
  { year: 2021, fundedPct: 84 },
  { year: 2023, fundedPct: 76.2 },
  { year: 2024, fundedPct: 77.4 },
  { year: 2025, fundedPct: 77.7 },
] as const;

/** Equable national market/estimated funded ratio recent path. */
export const EQUABLE_NATIONAL_PATH = [
  { year: 2021, fundedPct: 83.9, uaalT: 0.95 },
  { year: 2022, fundedPct: 76.0, uaalT: 1.45 },
  { year: 2023, fundedPct: 77.0, uaalT: 1.4 },
  { year: 2024, fundedPct: 78.0, uaalT: 1.54 },
  { year: 2025, fundedPct: 82.5, uaalT: 1.27 },
] as const;

/** CRR FY 2025 tercile aggregates (plan thirds by funded status). */
export const CRR_TERCILES = [
  { id: "top", label: "Top third of plans", fundedPct: 95 },
  { id: "middle", label: "Middle third", fundedPct: 78 },
  { id: "bottom", label: "Bottom third", fundedPct: 58 },
] as const;

export const BAND_COUNTS = {
  resilient: STATES_2025.filter((s) => s.band === "resilient").length,
  fragile: STATES_2025.filter((s) => s.band === "fragile").length,
  distressed: STATES_2025.filter((s) => s.band === "distressed").length,
} as const;

/** Funded-ratio histogram bins (Equable state averages). */
export const FUNDED_BINS = [
  { bin: "<60%", lo: 0, hi: 60, count: 0 },
  { bin: "60–70%", lo: 60, hi: 70, count: 0 },
  { bin: "70–80%", lo: 70, hi: 80, count: 0 },
  { bin: "80–90%", lo: 80, hi: 90, count: 0 },
  { bin: "90–100%", lo: 90, hi: 100, count: 0 },
  { bin: "≥100%", lo: 100, hi: 200, count: 0 },
].map((b) => {
  const count = STATES_2025.filter(
    (s) => s.fundedPct >= b.lo && s.fundedPct < b.hi,
  ).length;
  return { bin: b.bin, count };
});

const POSITIVE_UAAL = STATES_2025.filter((s) => s.uaalB > 0).sort(
  (a, b) => b.uaalB - a.uaalB,
);

export const NATIONAL_UAAL_B = HEADLINE.nationalUaalTrillion * 1000;

export function uaalSharePct(uaalB: number): number {
  if (uaalB <= 0) return 0;
  return (uaalB / NATIONAL_UAAL_B) * 100;
}

/** Cumulative UAAL concentration curve (largest first). */
export const UAAL_CONCENTRATION = POSITIVE_UAAL.map((s, i) => {
  const cumB = POSITIVE_UAAL.slice(0, i + 1).reduce((a, r) => a + r.uaalB, 0);
  return {
    rank: i + 1,
    id: s.id,
    label: s.label,
    uaalB: s.uaalB,
    sharePct: uaalSharePct(s.uaalB),
    cumSharePct: (cumB / NATIONAL_UAAL_B) * 100,
  };
});

/** Top UAAL states for bar / table panels. */
export const TOP_UAAL = POSITIVE_UAAL.slice(0, 12).map((s) => ({
  ...s,
  sharePct: uaalSharePct(s.uaalB),
}));

/** Worst-funded states (lowest funded %). */
export const WORST_FUNDED = [...STATES_2025]
  .sort((a, b) => a.fundedPct - b.fundedPct)
  .slice(0, 10);

/** Best-funded states. */
export const BEST_FUNDED = [...STATES_2025]
  .sort((a, b) => b.fundedPct - a.fundedPct)
  .slice(0, 10);

/** Scatter: funded ratio vs UAAL (bubble size = |UAAL|). */
export const FUNDED_VS_UAAL = STATES_2025.map((s) => ({
  id: s.id,
  label: s.label,
  region: s.region,
  fundedPct: s.fundedPct,
  uaalB: s.uaalB,
  absUaalB: Math.abs(s.uaalB),
  band: s.band,
}));

export const REGION_OPTIONS: { id: RegionId | "all"; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "Northeast", label: "Northeast" },
  { id: "Midwest", label: "Midwest" },
  { id: "South", label: "South" },
  { id: "West", label: "West" },
  { id: "DC", label: "D.C." },
];

export function statesByRegion(region: RegionId | "all"): StateRow[] {
  if (region === "all") return STATES_2025;
  return STATES_2025.filter((s) => s.region === region);
}

export function fmt1(n: number): string {
  return n.toFixed(1);
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function fmtB(n: number): string {
  const sign = n < 0 ? "−" : "";
  return `${sign}$${Math.abs(n).toFixed(1)}B`;
}

export function fmtT(n: number): string {
  return `$${n.toFixed(2)}T`;
}
