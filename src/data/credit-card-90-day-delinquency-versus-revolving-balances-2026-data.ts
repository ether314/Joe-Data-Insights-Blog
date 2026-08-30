/**
 * Credit-card 90-day delinquency versus revolving balances (2018–2026Q2).
 *
 * Core question: How far have NY Fed credit-card transition-into-90+ day
 * delinquency rates risen while Fed G.19 revolving credit outstanding
 * keeps climbing?
 *
 * Method: Pair NY Fed Consumer Credit Panel (CCP) annualized flow into
 * serious delinquency (90+) for credit cards with Board G.19 revolving
 * consumer credit outstanding (REVOLSL, seasonally adjusted, quarter-end).
 * CCP card balances (Equifax panel dollars) sit beside G.19 as a concept
 * bridge — CCP cards are a large subset of revolving, not identical.
 * Indexes rebase 2019Q4 = 100. Divergence gap = revolving index −
 * inverted delinquency index (higher when stock climbs while stress stays
 * elevated). Confidence: disclosed NY Fed HHDC 2026Q2 workbook + G.19 /
 * FRED REVOLSL; derived indexes and gaps.
 */

export const SOURCE_NOTE =
  "NY Fed Quarterly Report on Household Debt and Credit (CCP/Equifax) flow into 90+ day delinquency and card balances; Federal Reserve G.19 revolving credit outstanding (REVOLSL, SA). 2019Q4 = 100 indexes derived. Confidence: disclosed workbook + G.19; derived indexes/gaps.";

export const SOURCES = [
  {
    label: "NY Fed — Quarterly Report on Household Debt and Credit",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "NY Fed — Household Debt and Credit Q2 2026 release",
    url: "https://www.newyorkfed.org/newsevents/news/research/2026/20260811",
  },
  {
    label: "Federal Reserve — G.19 Consumer Credit",
    url: "https://www.federalreserve.gov/releases/g19/current/default.htm",
  },
  {
    label: "FRED — Revolving consumer credit (REVOLSL)",
    url: "https://fred.stlouisfed.org/series/REVOLSL",
  },
] as const;

export const HEADLINE = {
  latestLabel: "2026Q2",
  card90FlowPct: 6.97,
  card90PeakPct: 7.18,
  card90PeakLabel: "2024Q2",
  card90TroughPct: 3.04,
  card90TroughLabel: "2022Q1",
  card90PrePandemicPct: 5.32,
  card90PrePandemicLabel: "2019Q4",
  revolvingBn: 1351.1,
  revolvingPreBn: 1092.0,
  revolvingTroughBn: 952.1,
  revolvingTroughLabel: "2021Q1",
  ccpCardTn: 1.263,
  ccpCardPreTn: 0.927,
  revolvingIndex: 123.7,
  card90Index: 131.0,
  divergenceGap: 54.7,
  riseFromTroughPp: 3.93,
  revolvingRiseFromTroughPct: 41.9,
  revolvingRiseFromPrePct: 23.7,
  auto90FlowPct: 3.0,
  mortgage90FlowPct: 1.52,
  stock90CardPct: 12.92,
} as const;

export const VIZ_MARKERS = [
  "Dual-axis stress vs stock",
  "Indexed divergence ribbon",
  "Product 90+ comparison",
  "Balance–stress scatter",
] as const;

export type QuarterRow = {
  label: string;
  year: number;
  q: number;
  /** NY Fed CCP annualized % of balances newly 90+ (credit cards) */
  card90Flow: number;
  auto90Flow: number;
  mortgage90Flow: number;
  /** G.19 REVOLSL SA, $ billions */
  revolvingBn: number;
  /** CCP credit-card balances, $ trillions */
  ccpCardTn: number;
  revolvingIndex: number;
  card90Index: number;
  /** revolvingIndex − (200 − card90Index) style stress-adjusted gap */
  divergenceGap: number;
};

/** Round helper */
function r1(n: number) {
  return Math.round(n * 10) / 10;
}
function r2(n: number) {
  return Math.round(n * 100) / 100;
}

const BASE_REV = 1092.0; // 2019Q4 G.19
const BASE_90 = 5.32; // 2019Q4 CCP card 90+ flow

type Raw = {
  label: string;
  card90: number;
  auto90: number;
  mort90: number;
  revolBn: number;
  ccpTn: number;
};

const RAW: Raw[] = [
  { label: "2018Q1", card90: 4.72, auto90: 2.29, mort90: 1.13, revolBn: 1028.8, ccpTn: 0.815 },
  { label: "2018Q2", card90: 4.76, auto90: 2.34, mort90: 1.18, revolBn: 1025.3, ccpTn: 0.829 },
  { label: "2018Q3", card90: 4.8, auto90: 2.3, mort90: 1.18, revolBn: 1044.4, ccpTn: 0.844 },
  { label: "2018Q4", card90: 4.99, auto90: 2.36, mort90: 1.19, revolBn: 1053.8, ccpTn: 0.87 },
  { label: "2019Q1", card90: 5.04, auto90: 2.36, mort90: 1.1, revolBn: 1063.2, ccpTn: 0.848 },
  { label: "2019Q2", card90: 5.17, auto90: 2.34, mort90: 1.04, revolBn: 1071.4, ccpTn: 0.868 },
  { label: "2019Q3", card90: 5.16, auto90: 2.34, mort90: 0.99, revolBn: 1084.3, ccpTn: 0.881 },
  { label: "2019Q4", card90: 5.32, auto90: 2.36, mort90: 1.1, revolBn: 1092.0, ccpTn: 0.927 },
  { label: "2020Q1", card90: 5.31, auto90: 2.37, mort90: 1.17, revolBn: 1062.2, ccpTn: 0.893 },
  { label: "2020Q2", card90: 5.05, auto90: 2.26, mort90: 1.08, revolBn: 973.5, ccpTn: 0.817 },
  { label: "2020Q3", card90: 4.73, auto90: 2.09, mort90: 0.96, revolBn: 964.4, ccpTn: 0.807 },
  { label: "2020Q4", card90: 4.12, auto90: 1.84, mort90: 0.65, revolBn: 954.6, ccpTn: 0.819 },
  { label: "2021Q1", card90: 3.78, auto90: 1.72, mort90: 0.42, revolBn: 952.1, ccpTn: 0.77 },
  { label: "2021Q2", card90: 3.39, auto90: 1.61, mort90: 0.33, revolBn: 985.6, ccpTn: 0.787 },
  { label: "2021Q3", card90: 3.24, auto90: 1.57, mort90: 0.27, revolBn: 1005.5, ccpTn: 0.804 },
  { label: "2021Q4", card90: 3.22, auto90: 1.56, mort90: 0.29, revolBn: 1033.5, ccpTn: 0.856 },
  { label: "2022Q1", card90: 3.04, auto90: 1.61, mort90: 0.34, revolBn: 1077.5, ccpTn: 0.841 },
  { label: "2022Q2", card90: 3.35, auto90: 1.81, mort90: 0.44, revolBn: 1120.2, ccpTn: 0.887 },
  { label: "2022Q3", card90: 3.69, auto90: 2.02, mort90: 0.5, revolBn: 1155.4, ccpTn: 0.925 },
  { label: "2022Q4", card90: 4.01, auto90: 2.22, mort90: 0.57, revolBn: 1192.6, ccpTn: 0.986 },
  { label: "2023Q1", card90: 4.57, auto90: 2.33, mort90: 0.59, revolBn: 1220.9, ccpTn: 0.986 },
  { label: "2023Q2", card90: 5.08, auto90: 2.41, mort90: 0.63, revolBn: 1247.6, ccpTn: 1.031 },
  { label: "2023Q3", card90: 5.78, auto90: 2.53, mort90: 0.72, revolBn: 1277.9, ccpTn: 1.079 },
  { label: "2023Q4", card90: 6.36, auto90: 2.66, mort90: 0.82, revolBn: 1298.9, ccpTn: 1.129 },
  { label: "2024Q1", card90: 6.86, auto90: 2.78, mort90: 0.92, revolBn: 1320.9, ccpTn: 1.115 },
  { label: "2024Q2", card90: 7.18, auto90: 2.88, mort90: 0.95, revolBn: 1330.9, ccpTn: 1.142 },
  { label: "2024Q3", card90: 7.1, auto90: 2.9, mort90: 1.08, revolBn: 1342.5, ccpTn: 1.166 },
  { label: "2024Q4", card90: 7.18, auto90: 2.96, mort90: 1.09, revolBn: 1297.0, ccpTn: 1.211 },
  { label: "2025Q1", card90: 7.04, auto90: 2.94, mort90: 1.22, revolBn: 1292.8, ccpTn: 1.182 },
  { label: "2025Q2", card90: 6.93, auto90: 2.93, mort90: 1.29, revolBn: 1301.7, ccpTn: 1.209 },
  { label: "2025Q3", card90: 7.05, auto90: 2.99, mort90: 1.28, revolBn: 1312.7, ccpTn: 1.233 },
  { label: "2025Q4", card90: 7.13, auto90: 2.95, mort90: 1.38, revolBn: 1324.3, ccpTn: 1.277 },
  { label: "2026Q1", card90: 7.1, auto90: 2.97, mort90: 1.48, revolBn: 1338.0, ccpTn: 1.242 },
  { label: "2026Q2", card90: 6.97, auto90: 3.0, mort90: 1.52, revolBn: 1351.1, ccpTn: 1.263 },
];

export const QUARTERS: QuarterRow[] = RAW.map((d) => {
  const year = Number(d.label.slice(0, 4));
  const q = Number(d.label.slice(5));
  const revolvingIndex = r1((d.revolBn / BASE_REV) * 100);
  const card90Index = r1((d.card90 / BASE_90) * 100);
  // Combined elevation vs 2019Q4: (stock − 100) + (stress − 100)
  const gap = r1(revolvingIndex + card90Index - 200);
  return {
    label: d.label,
    year,
    q,
    card90Flow: d.card90,
    auto90Flow: d.auto90,
    mortgage90Flow: d.mort90,
    revolvingBn: d.revolBn,
    ccpCardTn: d.ccpTn,
    revolvingIndex,
    card90Index,
    divergenceGap: gap,
  };
});

export type ProductCompareRow = {
  product: string;
  short: string;
  flow90: number;
  color: string;
};

/** 2026Q2 product flow into 90+ (annualized %) */
export const PRODUCT_COMPARE: ProductCompareRow[] = [
  { product: "Credit cards", short: "Cards", flow90: 6.97, color: "#c2410c" },
  { product: "Other consumer", short: "Other", flow90: 5.19, color: "#a16207" },
  { product: "Auto loans", short: "Auto", flow90: 3.0, color: "#0369a1" },
  { product: "Mortgage", short: "Mortgage", flow90: 1.52, color: "#0f766e" },
  { product: "HELOC", short: "HELOC", flow90: 1.15, color: "#64748b" },
];

export type EraRow = {
  era: string;
  detail: string;
  card90: number;
  revolvingBn: number;
  ccpCardTn: number;
};

export const ERA_SNAPSHOTS: EraRow[] = [
  {
    era: "Pre-pandemic",
    detail: "2019Q4",
    card90: 5.32,
    revolvingBn: 1092.0,
    ccpCardTn: 0.927,
  },
  {
    era: "Stimulus trough",
    detail: "2022Q1 stress / 2021Q1 stock",
    card90: 3.04,
    revolvingBn: 952.1,
    ccpCardTn: 0.77,
  },
  {
    era: "Stress peak",
    detail: "2024Q2",
    card90: 7.18,
    revolvingBn: 1330.9,
    ccpCardTn: 1.142,
  },
  {
    era: "Latest",
    detail: "2026Q2",
    card90: 6.97,
    revolvingBn: 1351.1,
    ccpCardTn: 1.263,
  },
];

export const REFERENCE_TABLE = QUARTERS.filter((_, i) => i % 2 === 1 || i === QUARTERS.length - 1).map(
  (q) => ({
    label: q.label,
    card90Flow: q.card90Flow,
    revolvingBn: r1(q.revolvingBn),
    ccpCardTn: r2(q.ccpCardTn),
    revolvingIndex: q.revolvingIndex,
    card90Index: q.card90Index,
    divergenceGap: q.divergenceGap,
  }),
);

export type RangeId = "full" | "post2021" | "recent";

export const RANGE_OPTIONS: { id: RangeId; label: string; from: string }[] = [
  { id: "full", label: "2018–2026", from: "2018Q1" },
  { id: "post2021", label: "Since trough", from: "2021Q1" },
  { id: "recent", label: "2023–2026", from: "2023Q1" },
];

export function filterQuarters(range: RangeId): QuarterRow[] {
  const from = RANGE_OPTIONS.find((r) => r.id === range)?.from ?? "2018Q1";
  return QUARTERS.filter((q) => q.label >= from);
}

export function fmtPct(n: number, d = 2) {
  return `${n.toFixed(d)}%`;
}

export function fmtBn(n: number, d = 0) {
  return `$${n.toFixed(d)}B`;
}

export function fmtTn(n: number, d = 2) {
  return `$${n.toFixed(d)}T`;
}

// Keep unused helper referenced for type-check cleanliness in derived docs
void r2;
