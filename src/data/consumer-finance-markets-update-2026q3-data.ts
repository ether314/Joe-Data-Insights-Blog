/**
 * Consumer finance & household balance sheets — Q3 2026 vintage update.
 * Prior theme post: consumer-finance-markets-update-2026 (Aug 2026 print:
 * BEA Q2 saving 2.8%, NY Fed 2026Q1 debt $18.794T, student 90+ 10.3%, MMF $7.93T).
 * New vintage: NY Fed HHDC 2026Q2 (Aug 2026); BEA July 2026 personal saving;
 * ICI MMF week ended Aug 19, 2026 restated; Board G.19 / funds path for APR gap.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Q3 vintage delta vs consumer-finance-markets-update-2026. Debt stocks and product delinquency from NY Fed Quarterly Report on Household Debt and Credit, 2026Q2 (released Aug 2026). Personal saving rate from BEA NIPA / FRED PSAVERT (July 2026 monthly = 3.1%) with Q2 2026 quarterly SAAR still 2.8%. Money market fund AUM from ICI weekly (week ended Aug 19, 2026 = $8.02T after weekly revision). Card APR / fed funds path uses Board G.19 / effective funds with estimated late-Aug 2026 anchors. Prior-post figures are the Aug update dashboard print.";

export const SOURCES = [
  {
    label: "NY Fed — Household Debt and Credit, 2026Q2",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "BEA / FRED — Personal saving rate (PSAVERT)",
    url: "https://fred.stlouisfed.org/series/PSAVERT",
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
    label: "Prior theme update — Consumer finance markets (Aug 2026)",
    url: "/blog/consumer-finance-markets-update-2026",
  },
] as const;

/** Headline meters — Q3 vintage and Δ vs Aug update print */
export const HEADLINE = {
  priorAsOf: "Aug update print (NY Fed 2026Q1 · BEA Q2 · ICI $7.93T)",
  newAsOfDebt: "2026Q2 (NY Fed, Aug 2026)",
  newAsOfSaving: "July 2026 monthly (BEA)",
  newAsOfMmf: "Week ended Aug 19, 2026 revised (ICI)",
  totalDebtPriorTn: 18.794,
  totalDebtNewTn: 18.926,
  totalDebtDeltaTn: 0.132,
  totalDebtDeltaPct: 0.7,
  qoQDebtDeltaBn: 132,
  mortgageNewTn: 13.268,
  mortgagePriorTn: 13.191,
  cardNewTn: 1.281,
  cardPriorTn: 1.252,
  cardDeltaTn: 0.029,
  autoNewTn: 1.702,
  studentNewTn: 1.661,
  helocNewTn: 0.458,
  otherNewTn: 0.556,
  aggregateDelinqAnyPct: 4.9,
  aggregateDelinqPriorPct: 4.8,
  student90StockPriorPct: 10.3,
  student90StockNewPct: 10.6,
  student90DeltaPp: 0.3,
  mortgageSeriousTransPriorPct: 1.5,
  mortgageSeriousTransNewPct: 1.6,
  mortgageSeriousDeltaPp: 0.1,
  cardEarlyTransPriorPct: 8.6,
  cardEarlyTransNewPct: 8.4,
  cardEarlyDeltaPp: -0.2,
  savingPriorPct: 2.8,
  savingQ2Pct: 2.8,
  savingNewPct: 3.1,
  savingDeltaPp: 0.3,
  savingJuneMonthlyPct: 2.7,
  savingJulyMonthlyPct: 3.1,
  mmfPriorTn: 7.93,
  mmfNewTn: 8.02,
  mmfDeltaTn: 0.09,
  depositsEstTn: 14.95,
  depositsPriorTn: 15.0,
  cardAprPct: 21.2,
  fedFundsPct: 4.0,
  aprGapPp: 17.2,
  cardAprPriorPct: 21.3,
  fedFundsPriorPct: 4.1,
  aprGapPriorPp: 17.2,
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

/** Six scoreboard meters — Aug update print → Q3 vintage */
export const VINTAGE_METERS: VintageMeter[] = [
  {
    id: "saving",
    label: "Personal saving rate",
    unit: "pct",
    prior: 2.8,
    neu: 3.1,
    delta: 0.3,
    deltaLabel: "+0.3 pp",
    direction: "up",
    note: "July monthly PSAVERT vs Aug-update Q2 SAAR 2.8%",
  },
  {
    id: "debt",
    label: "Total household debt",
    unit: "tn",
    prior: 18.794,
    neu: 18.926,
    delta: 0.132,
    deltaLabel: "+$0.13T",
    direction: "up",
    note: "NY Fed 2026Q2 vs Aug-update 2026Q1 $18.794T",
  },
  {
    id: "student90",
    label: "Student loan 90+ share",
    unit: "pct",
    prior: 10.3,
    neu: 10.6,
    delta: 0.3,
    deltaLabel: "+0.3 pp",
    direction: "up",
    note: "NY Fed stock 90+; 2026Q1 → 2026Q2",
  },
  {
    id: "mmf",
    label: "Money market fund AUM",
    unit: "tn",
    prior: 7.93,
    neu: 8.02,
    delta: 0.09,
    deltaLabel: "+$90B",
    direction: "up",
    note: "ICI weekly revision vs Aug-update $7.93T",
  },
  {
    id: "card",
    label: "Credit-card balances",
    unit: "tn",
    prior: 1.252,
    neu: 1.281,
    delta: 0.029,
    deltaLabel: "+$29B",
    direction: "up",
    note: "Seasonal rebound after Q1 dip; still higher YoY",
  },
  {
    id: "mortgageStress",
    label: "Mortgage 90+ transition",
    unit: "pct",
    prior: 1.5,
    neu: 1.6,
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

/** Product stocks — Aug-update 2026Q1 → 2026Q2 disclosed */
export const DEBT_PRODUCT_VINTAGE: DebtProductVintage[] = [
  {
    id: "mortgage",
    label: "Mortgage",
    shortLabel: "Mortgage",
    priorTn: 13.191,
    newTn: 13.268,
    deltaTn: 0.077,
    newSharePct: 70.1,
    confidence: "disclosed",
  },
  {
    id: "auto",
    label: "Auto loans",
    shortLabel: "Auto",
    priorTn: 1.685,
    newTn: 1.702,
    deltaTn: 0.017,
    newSharePct: 9.0,
    confidence: "disclosed",
  },
  {
    id: "student",
    label: "Student loans",
    shortLabel: "Student",
    priorTn: 1.658,
    newTn: 1.661,
    deltaTn: 0.003,
    newSharePct: 8.8,
    confidence: "disclosed",
  },
  {
    id: "card",
    label: "Credit cards",
    shortLabel: "Cards",
    priorTn: 1.252,
    newTn: 1.281,
    deltaTn: 0.029,
    newSharePct: 6.8,
    confidence: "disclosed",
  },
  {
    id: "heloc",
    label: "HELOC",
    shortLabel: "HELOC",
    priorTn: 0.446,
    newTn: 0.458,
    deltaTn: 0.012,
    newSharePct: 2.4,
    confidence: "disclosed",
  },
  {
    id: "other",
    label: "Other consumer",
    shortLabel: "Other",
    priorTn: 0.562,
    newTn: 0.556,
    deltaTn: -0.006,
    newSharePct: 2.9,
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

/** BEA personal saving path — quarterly SAAR + July monthly new print */
export const SAVING_RATE_PATH: SavingPoint[] = [
  { label: "2023", sortKey: 2023, savingRatePct: 4.5, confidence: "disclosed", vintage: "history" },
  { label: "2024", sortKey: 2024, savingRatePct: 4.1, confidence: "disclosed", vintage: "history" },
  { label: "2025 Q3", sortKey: 2025.5, savingRatePct: 4.4, confidence: "disclosed", vintage: "history" },
  { label: "2025 Q4", sortKey: 2025.75, savingRatePct: 3.8, confidence: "disclosed", vintage: "history" },
  { label: "2026 Q1", sortKey: 2026.0, savingRatePct: 3.9, confidence: "disclosed", vintage: "history" },
  { label: "2026 Q2", sortKey: 2026.25, savingRatePct: 2.8, confidence: "disclosed", vintage: "prior" },
  { label: "Jun '26", sortKey: 2026.42, savingRatePct: 2.7, confidence: "disclosed", vintage: "history" },
  { label: "Jul '26", sortKey: 2026.5, savingRatePct: 3.1, confidence: "disclosed", vintage: "new" },
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

/** NY Fed stress path — into 2026Q2 */
export const STRESS_PATH: StressPoint[] = [
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
  {
    label: "2026 Q2",
    sortKey: 2026.25,
    student90Pct: 10.6,
    mortgageSeriousPct: 1.6,
    cardEarlyPct: 8.4,
    aggregateAnyPct: 4.9,
    confidence: "disclosed",
  },
];

/** Radar / mix snapshot for stress panel alternate view */
export const STRESS_MIX_PRIOR = [
  { axis: "Student 90+", value: 10.3 },
  { axis: "Mortgage 90+", value: 1.5 },
  { axis: "Card early", value: 8.6 },
  { axis: "Any delinq.", value: 4.8 },
] as const;

export const STRESS_MIX_NEW = [
  { axis: "Student 90+", value: 10.6 },
  { axis: "Mortgage 90+", value: 1.6 },
  { axis: "Card early", value: 8.4 },
  { axis: "Any delinq.", value: 4.9 },
] as const;

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
    newTn: 14.95,
    yieldPct: 0.5,
    confidence: "estimated",
  },
  {
    id: "mmf",
    label: "Money market funds",
    priorTn: 7.93,
    newTn: 8.02,
    yieldPct: 3.75,
    confidence: "disclosed",
  },
  {
    id: "tbills",
    label: "Direct T-bills / short Treasuries (est.)",
    priorTn: 2.45,
    newTn: 2.52,
    yieldPct: 3.9,
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
  { label: "2024", sortKey: 2024, cardAprPct: 21.5, fedFundsPct: 5.3, gapPp: 16.2, confidence: "disclosed" },
  { label: "2025", sortKey: 2025, cardAprPct: 21.5, fedFundsPct: 4.5, gapPp: 17.0, confidence: "estimated" },
  { label: "Aug update", sortKey: 2026.4, cardAprPct: 21.3, fedFundsPct: 4.1, gapPp: 17.2, confidence: "estimated" },
  { label: "Late Aug '26", sortKey: 2026.6, cardAprPct: 21.2, fedFundsPct: 4.0, gapPp: 17.2, confidence: "estimated" },
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
    label: "2026 Q1",
    sortKey: 2026.0,
    totalTn: 18.794,
    mortgageTn: 13.191,
    nonHousingTn: 5.603,
    confidence: "disclosed",
    vintage: "prior",
  },
  {
    label: "2026 Q2",
    sortKey: 2026.25,
    totalTn: 18.926,
    mortgageTn: 13.268,
    nonHousingTn: 5.658,
    confidence: "disclosed",
    vintage: "new",
  },
];

/** Dumbbell endpoints for product prior→new view */
export const DEBT_DUMBBELL = DEBT_PRODUCT_VINTAGE.map((d) => ({
  name: d.shortLabel,
  prior: d.priorTn,
  neu: d.newTn,
  delta: d.deltaTn,
}));

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
