/**
 * US commercial-bank net charge-off rates by loan category.
 * Federal Reserve Board Charge-Off and Delinquency Rates (all banks, SA).
 * https://www.federalreserve.gov/releases/Chargeoff/chgallsa.htm
 */

export const SOURCE_NOTE =
  "Federal Reserve Board Charge-Off and Delinquency Rates on Loans and Leases at Commercial Banks (all banks, seasonally adjusted). Net charge-offs = charge-offs minus recoveries, annualized % of average loans. CRE = commercial real estate (construction + multifamily + nonfarm nonresidential), booked in domestic offices.";

export const FED_CHARGEOFF =
  "https://www.federalreserve.gov/releases/Chargeoff/chgallsa.htm";
export const FED_DELINQUENCY =
  "https://www.federalreserve.gov/releases/Chargeoff/delallsa.htm";

export type Confidence = "disclosed" | "estimated";

export const HEADLINE = {
  asOf: "2026 Q1",
  cardsChargeOff: 3.84,
  creChargeOff: 0.17,
  ciChargeOff: 0.59,
  otherConsumerChargeOff: 1.17,
  residentialChargeOff: 0.0,
  totalChargeOff: 0.56,
  cardsOverCre: 22.6,
  cardsPeakRecent: 4.64,
  cardsPeakQuarter: "2024 Q3",
  creDelinquency: 1.56,
  cardsDelinquency: 2.92,
  gfcCardsPeak: 10.54,
  gfcCrePeak: 2.85,
} as const;

export const SOURCES = [
  { label: "Fed charge-off rates (SA)", href: FED_CHARGEOFF },
  { label: "Fed delinquency rates (SA)", href: FED_DELINQUENCY },
] as const;

/** Latest-quarter ranked charge-offs (desc) */
export const LATEST_RANKED: {
  category: string;
  short: string;
  chargeOff: number;
  delinquency: number;
  confidence: Confidence;
}[] = [
  {
    category: "Credit cards",
    short: "Cards",
    chargeOff: 3.84,
    delinquency: 2.92,
    confidence: "disclosed",
  },
  {
    category: "Other consumer",
    short: "Other cons.",
    chargeOff: 1.17,
    delinquency: 2.28,
    confidence: "disclosed",
  },
  {
    category: "C&I loans",
    short: "C&I",
    chargeOff: 0.59,
    delinquency: 1.34,
    confidence: "disclosed",
  },
  {
    category: "Leases",
    short: "Leases",
    chargeOff: 0.37,
    delinquency: 1.16,
    confidence: "disclosed",
  },
  {
    category: "Commercial RE",
    short: "CRE",
    chargeOff: 0.17,
    delinquency: 1.56,
    confidence: "disclosed",
  },
  {
    category: "Agricultural",
    short: "Ag",
    chargeOff: 0.13,
    delinquency: 1.12,
    confidence: "disclosed",
  },
  {
    category: "Residential RE",
    short: "Residential",
    chargeOff: 0.0,
    delinquency: 1.89,
    confidence: "disclosed",
  },
];

/** Quarterly path — key categories (charge-off %) */
export const QUARTERLY_PATH: {
  quarter: string;
  label: string;
  cards: number;
  cre: number;
  ci: number;
  otherConsumer: number;
  residential: number;
  total: number;
  confidence: Confidence;
}[] = [
  { quarter: "2019Q4", label: "19Q4", cards: 3.77, cre: 0.0, ci: 0.36, otherConsumer: 0.9, residential: 0.01, total: 0.49, confidence: "disclosed" },
  { quarter: "2020Q2", label: "20Q2", cards: 3.84, cre: 0.07, ci: 0.59, otherConsumer: 0.93, residential: 0.0, total: 0.55, confidence: "disclosed" },
  { quarter: "2020Q4", label: "20Q4", cards: 2.68, cre: 0.11, ci: 0.41, otherConsumer: 0.55, residential: -0.03, total: 0.39, confidence: "disclosed" },
  { quarter: "2021Q2", label: "21Q2", cards: 2.42, cre: 0.05, ci: 0.21, otherConsumer: 0.29, residential: -0.04, total: 0.26, confidence: "disclosed" },
  { quarter: "2021Q4", label: "21Q4", cards: 1.63, cre: 0.02, ci: 0.12, otherConsumer: 0.36, residential: -0.02, total: 0.19, confidence: "disclosed" },
  { quarter: "2022Q2", label: "22Q2", cards: 1.89, cre: -0.01, ci: 0.14, otherConsumer: 0.48, residential: -0.02, total: 0.22, confidence: "disclosed" },
  { quarter: "2022Q4", label: "22Q4", cards: 2.5, cre: 0.05, ci: 0.23, otherConsumer: 0.87, residential: -0.02, total: 0.33, confidence: "disclosed" },
  { quarter: "2023Q2", label: "23Q2", cards: 3.26, cre: 0.15, ci: 0.31, otherConsumer: 1.05, residential: 0.01, total: 0.46, confidence: "disclosed" },
  { quarter: "2023Q4", label: "23Q4", cards: 4.17, cre: 0.26, ci: 0.42, otherConsumer: 1.14, residential: 0.0, total: 0.6, confidence: "disclosed" },
  { quarter: "2024Q2", label: "24Q2", cards: 4.59, cre: 0.26, ci: 0.48, otherConsumer: 1.19, residential: -0.01, total: 0.66, confidence: "disclosed" },
  { quarter: "2024Q3", label: "24Q3", cards: 4.64, cre: 0.25, ci: 0.55, otherConsumer: 1.19, residential: -0.01, total: 0.68, confidence: "disclosed" },
  { quarter: "2024Q4", label: "24Q4", cards: 4.56, cre: 0.25, ci: 0.52, otherConsumer: 1.18, residential: 0.0, total: 0.64, confidence: "disclosed" },
  { quarter: "2025Q2", label: "25Q2", cards: 4.21, cre: 0.18, ci: 0.58, otherConsumer: 1.2, residential: 0.0, total: 0.61, confidence: "disclosed" },
  { quarter: "2025Q4", label: "25Q4", cards: 4.07, cre: 0.14, ci: 0.56, otherConsumer: 1.21, residential: 0.0, total: 0.58, confidence: "disclosed" },
  { quarter: "2026Q1", label: "26Q1", cards: 3.84, cre: 0.17, ci: 0.59, otherConsumer: 1.17, residential: 0.0, total: 0.56, confidence: "disclosed" },
];

/** Year-end charge-off heatmap rows (category × year) */
export const YEAR_END_HEAT: {
  category: string;
  short: string;
  y2019: number;
  y2021: number;
  y2022: number;
  y2023: number;
  y2024: number;
  y2025: number;
}[] = [
  { category: "Credit cards", short: "Cards", y2019: 3.77, y2021: 1.63, y2022: 2.5, y2023: 4.17, y2024: 4.56, y2025: 4.07 },
  { category: "Other consumer", short: "Other", y2019: 0.9, y2021: 0.36, y2022: 0.87, y2023: 1.14, y2024: 1.18, y2025: 1.21 },
  { category: "C&I", short: "C&I", y2019: 0.36, y2021: 0.12, y2022: 0.23, y2023: 0.42, y2024: 0.52, y2025: 0.56 },
  { category: "CRE", short: "CRE", y2019: 0.0, y2021: 0.02, y2022: 0.05, y2023: 0.26, y2024: 0.25, y2025: 0.14 },
  { category: "Residential", short: "Resi", y2019: 0.01, y2021: -0.02, y2022: -0.02, y2023: 0.0, y2024: 0.0, y2025: 0.0 },
];

export const HEAT_YEARS = ["2019", "2021", "2022", "2023", "2024", "2025"] as const;
export type HeatYear = (typeof HEAT_YEARS)[number];

export function heatValue(
  row: (typeof YEAR_END_HEAT)[number],
  year: HeatYear,
): number {
  const map: Record<HeatYear, number> = {
    "2019": row.y2019,
    "2021": row.y2021,
    "2022": row.y2022,
    "2023": row.y2023,
    "2024": row.y2024,
    "2025": row.y2025,
  };
  return map[year];
}

/** Slope endpoints: pre-COVID vs latest */
export const SLOPE_COMPARE: {
  category: string;
  short: string;
  start: number;
  end: number;
  deltaPp: number;
}[] = [
  { category: "Credit cards", short: "Cards", start: 3.77, end: 3.84, deltaPp: 0.07 },
  { category: "Other consumer", short: "Other cons.", start: 0.9, end: 1.17, deltaPp: 0.27 },
  { category: "C&I", short: "C&I", start: 0.36, end: 0.59, deltaPp: 0.23 },
  { category: "CRE", short: "CRE", start: 0.0, end: 0.17, deltaPp: 0.17 },
  { category: "Residential", short: "Residential", start: 0.01, end: 0.0, deltaPp: -0.01 },
].sort((a, b) => b.end - a.end);

/** Rank bump — charge-off rank among 5 categories (1 = worst) */
export const BUMP_RANKS: {
  quarter: string;
  label: string;
  cards: number;
  other: number;
  ci: number;
  cre: number;
  residential: number;
}[] = [
  { quarter: "2019Q4", label: "19Q4", cards: 1, other: 2, ci: 3, cre: 5, residential: 4 },
  { quarter: "2021Q4", label: "21Q4", cards: 1, other: 2, ci: 3, cre: 4, residential: 5 },
  { quarter: "2022Q4", label: "22Q4", cards: 1, other: 2, ci: 3, cre: 4, residential: 5 },
  { quarter: "2023Q4", label: "23Q4", cards: 1, other: 2, ci: 3, cre: 4, residential: 5 },
  { quarter: "2024Q4", label: "24Q4", cards: 1, other: 2, ci: 3, cre: 4, residential: 5 },
  { quarter: "2025Q4", label: "25Q4", cards: 1, other: 2, ci: 3, cre: 4, residential: 5 },
  { quarter: "2026Q1", label: "26Q1", cards: 1, other: 2, ci: 3, cre: 4, residential: 5 },
];

/** Delinquency vs charge-off pairs for scatter (latest) */
export const DELINQ_VS_CHARGE: {
  category: string;
  short: string;
  delinquency: number;
  chargeOff: number;
}[] = LATEST_RANKED.map((r) => ({
  category: r.category,
  short: r.short,
  delinquency: r.delinquency,
  chargeOff: r.chargeOff,
})).sort((a, b) => b.chargeOff - a.chargeOff);

export function fmtPct(n: number, digits = 2): string {
  if (Object.is(n, -0) || Math.abs(n) < 0.005) return "0.00%";
  return `${n.toFixed(digits)}%`;
}

export function fmtMultiple(n: number): string {
  return `${n.toFixed(1)}×`;
}
