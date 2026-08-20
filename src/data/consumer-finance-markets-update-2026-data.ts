/**
 * Consumer finance & household balance sheets — vintage update (Aug 2026).
 * Prior theme post: consumer-finance-markets-research-2026 (Q4 2025 / early-2026 print).
 * New vintage: NY Fed HHDC 2026Q1 (May 2026); BEA personal saving Q2 2026;
 * ICI MMF week ended Aug 19, 2026; Board G.19 / funds path for APR gap.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Vintage delta vs consumer-finance-markets-research-2026. Debt stocks and product delinquency from NY Fed Quarterly Report on Household Debt and Credit, 2026Q1 (released May 2026). Personal saving rate from BEA NIPA / FRED A072RC1Q156SBEA (Q2 2026 = 2.8%). Money market fund AUM from ICI weekly (week ended Aug 19, 2026 = $7.93T). Card APR / fed funds path uses Board G.19 / effective funds with estimated mid-2026 anchors. Prior-post figures are the research dashboard print, not a restated NY Fed PDF row.";

export const SOURCES = [
  {
    label: "NY Fed — Household Debt and Credit, 2026Q1",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "BEA / FRED — Personal saving rate (A072RC1Q156SBEA)",
    url: "https://fred.stlouisfed.org/series/A072RC1Q156SBEA",
  },
  {
    label: "ICI — Money Market Fund Assets (Aug 19, 2026 week)",
    url: "https://www.ici.org/research/stats/mmf",
  },
  {
    label: "Fed G.19 — Consumer Credit / APR series",
    url: "https://www.federalreserve.gov/releases/g19/current/",
  },
  {
    label: "Prior theme post — Consumer finance markets research",
    url: "/blog/consumer-finance-markets-research-2026",
  },
] as const;

/** Headline meters — new vintage and Δ vs research print */
export const HEADLINE = {
  priorAsOf: "Research print (Q4 2025 / early 2026)",
  newAsOfDebt: "2026Q1 (NY Fed, May 2026)",
  newAsOfSaving: "2026Q2 (BEA)",
  newAsOfMmf: "Week ended Aug 19, 2026 (ICI)",
  totalDebtPriorTn: 18.42,
  totalDebtNewTn: 18.794,
  totalDebtDeltaTn: 0.374,
  totalDebtDeltaPct: 2.0,
  qoQDebtDeltaBn: 18,
  mortgageNewTn: 13.191,
  cardNewTn: 1.252,
  cardPriorTn: 1.21,
  cardDeltaTn: 0.042,
  autoNewTn: 1.685,
  studentNewTn: 1.658,
  helocNewTn: 0.446,
  otherNewTn: 0.562,
  aggregateDelinqAnyPct: 4.8,
  student90StockPriorPct: 9.6,
  student90StockNewPct: 10.3,
  student90DeltaPp: 0.7,
  mortgageSeriousTransPriorPct: 1.4,
  mortgageSeriousTransNewPct: 1.5,
  mortgageSeriousDeltaPp: 0.1,
  cardEarlyTransPriorPct: 8.7,
  cardEarlyTransNewPct: 8.6,
  cardEarlyDeltaPp: -0.1,
  savingPriorPct: 3.9,
  savingQ1Pct: 3.9,
  savingNewPct: 2.8,
  savingDeltaPp: -1.1,
  savingJuneMonthlyPct: 2.7,
  mmfPriorTn: 7.85,
  mmfNewTn: 7.93,
  mmfDeltaTn: 0.08,
  depositsEstTn: 15.0,
  cardAprPct: 21.3,
  fedFundsPct: 4.1,
  aprGapPp: 17.2,
  cardAprPriorPct: 21.4,
  fedFundsPriorPct: 4.25,
  aprGapPriorPp: 17.15,
} as const;

export type LedgerId =
  | "debt"
  | "saving"
  | "student90"
  | "mmf"
  | "card"
  | "mortgageStress";

export type VintageMeter = {
  id: LedgerId;
  label: string;
  unit: "tn" | "pct" | "pp";
  prior: number;
  neu: number;
  delta: number;
  deltaLabel: string;
  direction: "up" | "down" | "flat";
  note: string;
};

/** Six scoreboard meters — prior research print → new vintage */
export const VINTAGE_METERS: VintageMeter[] = [
  {
    id: "saving",
    label: "Personal saving rate",
    unit: "pct",
    prior: 3.9,
    neu: 2.8,
    delta: -1.1,
    deltaLabel: "−1.1 pp",
    direction: "down",
    note: "BEA quarterly SAAR; Q2 2026 vs research ~3.9%",
  },
  {
    id: "debt",
    label: "Total household debt",
    unit: "tn",
    prior: 18.42,
    neu: 18.794,
    delta: 0.374,
    deltaLabel: "+$0.37T",
    direction: "up",
    note: "NY Fed 2026Q1 vs research $18.42T print",
  },
  {
    id: "student90",
    label: "Student loan 90+ share",
    unit: "pct",
    prior: 9.6,
    neu: 10.3,
    delta: 0.7,
    deltaLabel: "+0.7 pp",
    direction: "up",
    note: "NY Fed stock 90+; 2025Q4 → 2026Q1",
  },
  {
    id: "mmf",
    label: "Money market fund AUM",
    unit: "tn",
    prior: 7.85,
    neu: 7.93,
    delta: 0.08,
    deltaLabel: "+$80B",
    direction: "up",
    note: "ICI weekly vs research $7.85T",
  },
  {
    id: "card",
    label: "Credit-card balances",
    unit: "tn",
    prior: 1.21,
    neu: 1.252,
    delta: 0.042,
    deltaLabel: "+$42B",
    direction: "up",
    note: "Seasonal QoQ dip inside a higher YoY stock",
  },
  {
    id: "mortgageStress",
    label: "Mortgage 90+ transition",
    unit: "pct",
    prior: 1.4,
    neu: 1.5,
    delta: 0.1,
    deltaLabel: "+0.1 pp",
    direction: "up",
    note: "Serious delinquency transition; still low absolute level",
  },
];

export type DebtProductVintage = {
  id: string;
  label: string;
  shortLabel: string;
  priorTn: number;
  newTn: number;
  deltaTn: number;
  newSharePct: number;
  confidence: Confidence;
};

/** Product stocks — research print → 2026Q1 disclosed */
export const DEBT_PRODUCT_VINTAGE: DebtProductVintage[] = [
  {
    id: "mortgage",
    label: "Mortgage",
    shortLabel: "Mortgage",
    priorTn: 12.86,
    newTn: 13.191,
    deltaTn: 0.331,
    newSharePct: 70.2,
    confidence: "disclosed",
  },
  {
    id: "student",
    label: "Student loans",
    shortLabel: "Student",
    priorTn: 1.62,
    newTn: 1.658,
    deltaTn: 0.038,
    newSharePct: 8.8,
    confidence: "disclosed",
  },
  {
    id: "auto",
    label: "Auto loans",
    shortLabel: "Auto",
    priorTn: 1.64,
    newTn: 1.685,
    deltaTn: 0.045,
    newSharePct: 9.0,
    confidence: "disclosed",
  },
  {
    id: "card",
    label: "Credit cards",
    shortLabel: "Cards",
    priorTn: 1.21,
    newTn: 1.252,
    deltaTn: 0.042,
    newSharePct: 6.7,
    confidence: "disclosed",
  },
  {
    id: "other",
    label: "Other consumer",
    shortLabel: "Other",
    priorTn: 0.55,
    newTn: 0.562,
    deltaTn: 0.012,
    newSharePct: 3.0,
    confidence: "disclosed",
  },
  {
    id: "heloc",
    label: "HELOC",
    shortLabel: "HELOC",
    priorTn: 0.39,
    newTn: 0.446,
    deltaTn: 0.056,
    newSharePct: 2.4,
    confidence: "disclosed",
  },
];

export type SavingPoint = {
  label: string;
  sortKey: number;
  savingRatePct: number;
  confidence: Confidence;
  vintage: "history" | "prior" | "new";
};

/** BEA personal saving rate path into the Q2 2026 print */
export const SAVING_RATE_PATH: SavingPoint[] = [
  { label: "2022", sortKey: 2022, savingRatePct: 3.3, confidence: "disclosed", vintage: "history" },
  { label: "2023", sortKey: 2023, savingRatePct: 4.5, confidence: "disclosed", vintage: "history" },
  { label: "2024", sortKey: 2024, savingRatePct: 4.1, confidence: "disclosed", vintage: "history" },
  { label: "2025 Q2", sortKey: 2025.25, savingRatePct: 5.0, confidence: "disclosed", vintage: "history" },
  { label: "2025 Q3", sortKey: 2025.5, savingRatePct: 4.4, confidence: "disclosed", vintage: "history" },
  { label: "2025 Q4", sortKey: 2025.75, savingRatePct: 3.8, confidence: "disclosed", vintage: "history" },
  { label: "2026 Q1", sortKey: 2026.0, savingRatePct: 3.9, confidence: "disclosed", vintage: "prior" },
  { label: "2026 Q2", sortKey: 2026.25, savingRatePct: 2.8, confidence: "disclosed", vintage: "new" },
];

export type StressPoint = {
  label: string;
  sortKey: number;
  student90Pct: number;
  mortgageSeriousPct: number;
  cardEarlyPct: number;
  aggregateAnyPct: number;
  confidence: Confidence;
};

/** NY Fed stress path — disclosed QoQ anchors into 2026Q1 */
export const STRESS_PATH: StressPoint[] = [
  {
    label: "2025 Q3",
    sortKey: 2025.5,
    student90Pct: 8.9,
    mortgageSeriousPct: 1.3,
    cardEarlyPct: 8.5,
    aggregateAnyPct: 4.5,
    confidence: "estimated",
  },
  {
    label: "2025 Q4",
    sortKey: 2025.75,
    student90Pct: 9.6,
    mortgageSeriousPct: 1.4,
    cardEarlyPct: 8.7,
    aggregateAnyPct: 4.8,
    confidence: "disclosed",
  },
  {
    label: "2026 Q1",
    sortKey: 2026.0,
    student90Pct: 10.3,
    mortgageSeriousPct: 1.5,
    cardEarlyPct: 8.6,
    aggregateAnyPct: 4.8,
    confidence: "disclosed",
  },
];

export type LiquidCashVintage = {
  id: string;
  label: string;
  priorTn: number;
  newTn: number;
  yieldPct: number;
  confidence: Confidence;
};

export const LIQUID_CASH_VINTAGE: LiquidCashVintage[] = [
  {
    id: "deposits",
    label: "Bank deposits (ex-large time)",
    priorTn: 15.0,
    newTn: 15.0,
    yieldPct: 0.55,
    confidence: "estimated",
  },
  {
    id: "mmf",
    label: "Money market funds",
    priorTn: 7.85,
    newTn: 7.93,
    yieldPct: 3.85,
    confidence: "disclosed",
  },
  {
    id: "tbills",
    label: "Direct T-bills / short Treasuries (est.)",
    priorTn: 2.4,
    newTn: 2.45,
    yieldPct: 4.0,
    confidence: "estimated",
  },
];

export type RateGapPoint = {
  label: string;
  sortKey: number;
  cardAprPct: number;
  fedFundsPct: number;
  gapPp: number;
  confidence: Confidence;
};

export const APR_GAP_PATH: RateGapPoint[] = [
  { label: "2023", sortKey: 2023, cardAprPct: 21.2, fedFundsPct: 5.0, gapPp: 16.2, confidence: "disclosed" },
  { label: "2024", sortKey: 2024, cardAprPct: 21.5, fedFundsPct: 5.3, gapPp: 16.2, confidence: "disclosed" },
  { label: "2025", sortKey: 2025, cardAprPct: 21.5, fedFundsPct: 4.5, gapPp: 17.0, confidence: "estimated" },
  { label: "Research", sortKey: 2025.9, cardAprPct: 21.4, fedFundsPct: 4.25, gapPp: 17.15, confidence: "estimated" },
  { label: "Mid-2026", sortKey: 2026.5, cardAprPct: 21.3, fedFundsPct: 4.1, gapPp: 17.2, confidence: "estimated" },
];

export type DebtStockPoint = {
  label: string;
  sortKey: number;
  totalTn: number;
  mortgageTn: number;
  nonHousingTn: number;
  confidence: Confidence;
  vintage: "history" | "prior" | "new";
};

export const DEBT_STOCK_PATH: DebtStockPoint[] = [
  {
    label: "2019",
    sortKey: 2019,
    totalTn: 14.15,
    mortgageTn: 9.56,
    nonHousingTn: 4.59,
    confidence: "disclosed",
    vintage: "history",
  },
  {
    label: "2022",
    sortKey: 2022,
    totalTn: 16.9,
    mortgageTn: 11.92,
    nonHousingTn: 4.98,
    confidence: "disclosed",
    vintage: "history",
  },
  {
    label: "2024",
    sortKey: 2024,
    totalTn: 17.9,
    mortgageTn: 12.59,
    nonHousingTn: 5.31,
    confidence: "disclosed",
    vintage: "history",
  },
  {
    label: "Research",
    sortKey: 2025.9,
    totalTn: 18.42,
    mortgageTn: 12.86,
    nonHousingTn: 5.56,
    confidence: "estimated",
    vintage: "prior",
  },
  {
    label: "2026 Q1",
    sortKey: 2026.0,
    totalTn: 18.794,
    mortgageTn: 13.191,
    nonHousingTn: 5.603,
    confidence: "disclosed",
    vintage: "new",
  },
];

export function meterDeltasSorted() {
  return [...VINTAGE_METERS].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

export function debtDeltasSorted() {
  return [...DEBT_PRODUCT_VINTAGE].sort((a, b) => Math.abs(b.deltaTn) - Math.abs(a.deltaTn));
}

export function fmtTn(n: number, digits = 2) {
  return `$${n.toFixed(digits)}T`;
}

export function fmtBn(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}$${n.toFixed(0)}B`;
}

export function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtDeltaTn(n: number) {
  const sign = n >= 0 ? "+" : "−";
  const abs = Math.abs(n);
  if (abs >= 1) return `${sign}$${abs.toFixed(2)}T`;
  return `${sign}$${(abs * 1000).toFixed(0)}B`;
}
