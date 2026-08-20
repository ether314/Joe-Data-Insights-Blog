/**
 * Consumer finance & household balance sheets — saving, borrowing, retail allocation.
 * Sources: BEA personal saving rate; NY Fed Quarterly Report on Household Debt and Credit;
 * Fed Z.1 financial accounts (household + nonprofit); Fed G.19 / Board APR series;
 * ICI MMF weekly + H.8 deposits (cross-check with money-market-funds post).
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "BEA NIPA Table 2.1 for personal saving rate (seasonally adjusted annual rate); NY Fed Center for Microeconomic Data Quarterly Report on Household Debt and Credit for aggregate balances and 90+ day delinquency transition rates by product; Fed Z.1 B.101 for household net worth and major asset shares (latest published quarter); Board of Governors G.19 / commercial bank rate series for credit-card APRs vs effective fed funds; ICI weekly MMF assets and Fed H.8 / FEDS Note framing for liquid cash parking. Mid-path quarters between disclosed anchors may be linearly interpolated and are labeled estimated.";

export const SOURCES = [
  {
    label: "BEA — Personal Income and Outlays (saving rate)",
    url: "https://www.bea.gov/data/income-saving/personal-income",
  },
  {
    label: "NY Fed — Household Debt and Credit Report",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "Fed Z.1 — Financial Accounts (household sector)",
    url: "https://www.federalreserve.gov/releases/z1/",
  },
  {
    label: "Fed G.19 — Consumer Credit / APR series",
    url: "https://www.federalreserve.gov/releases/g19/current/",
  },
] as const;

export const HEADLINE = {
  asOfDebt: "Q4 2025",
  totalHouseholdDebtTn: 18.42,
  mortgageSharePct: 69.8,
  creditCardDebtTn: 1.21,
  cardDelinq90Pct: 7.2,
  mortgageDelinq90Pct: 1.1,
  personalSavingRatePct: 3.9,
  peakSavingRate2021Pct: 26.2,
  householdNetWorthTn: 169.0,
  housingWealthSharePct: 28.4,
  equityWealthSharePct: 34.1,
  depositsCashTn: 15.0,
  mmfCashTn: 7.85,
  cardAprPct: 21.4,
  fedFundsPct: 4.25,
  aprGapPp: 17.15,
} as const;

export type SavingPoint = {
  year: number;
  q?: number;
  label: string;
  sortKey: number;
  savingRatePct: number;
  confidence: Confidence;
};

/** BEA personal saving rate — annual / selected quarterly anchors */
export const SAVING_RATE_PATH: SavingPoint[] = [
  { year: 2019, label: "2019", sortKey: 2019, savingRatePct: 7.6, confidence: "disclosed" },
  { year: 2020, label: "2020", sortKey: 2020, savingRatePct: 16.3, confidence: "disclosed" },
  { year: 2021, label: "2021", sortKey: 2021, savingRatePct: 11.9, confidence: "disclosed" },
  { year: 2021, q: 2, label: "2021 Q2", sortKey: 2021.25, savingRatePct: 26.2, confidence: "disclosed" },
  { year: 2022, label: "2022", sortKey: 2022, savingRatePct: 3.3, confidence: "disclosed" },
  { year: 2023, label: "2023", sortKey: 2023, savingRatePct: 4.5, confidence: "disclosed" },
  { year: 2024, label: "2024", sortKey: 2024, savingRatePct: 4.1, confidence: "disclosed" },
  { year: 2025, label: "2025", sortKey: 2025, savingRatePct: 4.0, confidence: "estimated" },
  { year: 2026, q: 1, label: "2026 Q1", sortKey: 2026.0, savingRatePct: 3.9, confidence: "estimated" },
];

export type DebtStockPoint = {
  year: number;
  label: string;
  mortgageTn: number;
  helocTn: number;
  autoTn: number;
  creditCardTn: number;
  studentTn: number;
  otherTn: number;
  totalTn: number;
  confidence: Confidence;
};

/** NY Fed household debt balances ($ trillions) — year-end / report anchors */
export const DEBT_STOCK_PATH: DebtStockPoint[] = [
  {
    year: 2019,
    label: "2019",
    mortgageTn: 9.56,
    helocTn: 0.39,
    autoTn: 1.33,
    creditCardTn: 0.93,
    studentTn: 1.5,
    otherTn: 0.42,
    totalTn: 14.15,
    confidence: "disclosed",
  },
  {
    year: 2021,
    label: "2021",
    mortgageTn: 10.44,
    helocTn: 0.32,
    autoTn: 1.41,
    creditCardTn: 0.86,
    studentTn: 1.58,
    otherTn: 0.44,
    totalTn: 15.05,
    confidence: "disclosed",
  },
  {
    year: 2022,
    label: "2022",
    mortgageTn: 11.92,
    helocTn: 0.34,
    autoTn: 1.5,
    creditCardTn: 0.99,
    studentTn: 1.6,
    otherTn: 0.48,
    totalTn: 16.9,
    confidence: "disclosed",
  },
  {
    year: 2023,
    label: "2023",
    mortgageTn: 12.25,
    helocTn: 0.36,
    autoTn: 1.56,
    creditCardTn: 1.13,
    studentTn: 1.6,
    otherTn: 0.51,
    totalTn: 17.5,
    confidence: "disclosed",
  },
  {
    year: 2024,
    label: "2024",
    mortgageTn: 12.59,
    helocTn: 0.38,
    autoTn: 1.61,
    creditCardTn: 1.18,
    studentTn: 1.61,
    otherTn: 0.53,
    totalTn: 17.9,
    confidence: "disclosed",
  },
  {
    year: 2025,
    label: "2025",
    mortgageTn: 12.86,
    helocTn: 0.39,
    autoTn: 1.64,
    creditCardTn: 1.21,
    studentTn: 1.62,
    otherTn: 0.55,
    totalTn: 18.42,
    confidence: "estimated",
  },
];

export type DelinqPoint = {
  year: number;
  label: string;
  mortgage: number;
  auto: number;
  creditCard: number;
  student: number;
  confidence: Confidence;
};

/** 90+ day delinquency transition rates (% of balance) — NY Fed style */
export const DELINQUENCY_PATH: DelinqPoint[] = [
  { year: 2019, label: "2019", mortgage: 1.1, auto: 4.4, creditCard: 7.8, student: 9.9, confidence: "disclosed" },
  { year: 2020, label: "2020", mortgage: 0.6, auto: 3.1, creditCard: 5.2, student: 0.4, confidence: "disclosed" },
  { year: 2021, label: "2021", mortgage: 0.5, auto: 2.9, creditCard: 4.8, student: 0.3, confidence: "disclosed" },
  { year: 2022, label: "2022", mortgage: 0.6, auto: 3.5, creditCard: 5.9, student: 0.8, confidence: "disclosed" },
  { year: 2023, label: "2023", mortgage: 0.8, auto: 4.6, creditCard: 6.8, student: 5.1, confidence: "disclosed" },
  { year: 2024, label: "2024", mortgage: 1.0, auto: 5.1, creditCard: 7.0, student: 7.4, confidence: "disclosed" },
  { year: 2025, label: "2025", mortgage: 1.1, auto: 5.3, creditCard: 7.2, student: 7.8, confidence: "estimated" },
];

export type WealthSlice = {
  id: string;
  label: string;
  shortLabel: string;
  tn: number;
  sharePct: number;
  confidence: Confidence;
};

/** Fed Z.1 household + NPISH asset composition (~$169T net worth era) */
export const WEALTH_ALLOCATION: WealthSlice[] = [
  { id: "equities", label: "Corporate equities & mutual funds", shortLabel: "Equities/funds", tn: 57.6, sharePct: 34.1, confidence: "estimated" },
  { id: "housing", label: "Real estate (owner-occupied)", shortLabel: "Housing", tn: 48.0, sharePct: 28.4, confidence: "estimated" },
  { id: "pensions", label: "Pension entitlements", shortLabel: "Pensions", tn: 28.7, sharePct: 17.0, confidence: "estimated" },
  { id: "deposits", label: "Deposits & currency", shortLabel: "Deposits", tn: 15.0, sharePct: 8.9, confidence: "disclosed" },
  { id: "mmf", label: "Money market funds", shortLabel: "MMFs", tn: 7.85, sharePct: 4.6, confidence: "disclosed" },
  { id: "bonds", label: "Debt securities", shortLabel: "Bonds", tn: 6.1, sharePct: 3.6, confidence: "estimated" },
  { id: "other", label: "Other financial & nonfinancial", shortLabel: "Other", tn: 5.75, sharePct: 3.4, confidence: "estimated" },
];

export type LiquidCashRow = {
  id: string;
  label: string;
  tn: number;
  yieldPct: number;
  confidence: Confidence;
};

export const LIQUID_CASH: LiquidCashRow[] = [
  { id: "deposits", label: "Bank deposits (ex-large time)", tn: 15.0, yieldPct: 0.6, confidence: "disclosed" },
  { id: "mmf", label: "Money market funds", tn: 7.85, yieldPct: 3.9, confidence: "disclosed" },
  { id: "tbills", label: "Direct T-bills / short Treasuries (est.)", tn: 2.4, yieldPct: 4.1, confidence: "estimated" },
];

export type RateGapPoint = {
  year: number;
  label: string;
  cardAprPct: number;
  fedFundsPct: number;
  gapPp: number;
  confidence: Confidence;
};

export const APR_GAP_PATH: RateGapPoint[] = [
  { year: 2019, label: "2019", cardAprPct: 15.1, fedFundsPct: 2.2, gapPp: 12.9, confidence: "disclosed" },
  { year: 2021, label: "2021", cardAprPct: 14.5, fedFundsPct: 0.1, gapPp: 14.4, confidence: "disclosed" },
  { year: 2022, label: "2022", cardAprPct: 17.8, fedFundsPct: 1.7, gapPp: 16.1, confidence: "disclosed" },
  { year: 2023, label: "2023", cardAprPct: 21.2, fedFundsPct: 5.0, gapPp: 16.2, confidence: "disclosed" },
  { year: 2024, label: "2024", cardAprPct: 21.5, fedFundsPct: 5.3, gapPp: 16.2, confidence: "disclosed" },
  { year: 2025, label: "2025", cardAprPct: 21.5, fedFundsPct: 4.5, gapPp: 17.0, confidence: "estimated" },
  { year: 2026, label: "2026", cardAprPct: 21.4, fedFundsPct: 4.25, gapPp: 17.15, confidence: "estimated" },
];

export type DebtProductShare = {
  id: string;
  label: string;
  shortLabel: string;
  tn: number;
  sharePct: number;
  delinq90Pct: number;
};

export function latestDebtProductShares(): DebtProductShare[] {
  const d = DEBT_STOCK_PATH[DEBT_STOCK_PATH.length - 1];
  const del = DELINQUENCY_PATH[DELINQUENCY_PATH.length - 1];
  return [
    { id: "mortgage", label: "Mortgage", shortLabel: "Mortgage", tn: d.mortgageTn, sharePct: (d.mortgageTn / d.totalTn) * 100, delinq90Pct: del.mortgage },
    { id: "student", label: "Student loans", shortLabel: "Student", tn: d.studentTn, sharePct: (d.studentTn / d.totalTn) * 100, delinq90Pct: del.student },
    { id: "auto", label: "Auto loans", shortLabel: "Auto", tn: d.autoTn, sharePct: (d.autoTn / d.totalTn) * 100, delinq90Pct: del.auto },
    { id: "card", label: "Credit cards", shortLabel: "Cards", tn: d.creditCardTn, sharePct: (d.creditCardTn / d.totalTn) * 100, delinq90Pct: del.creditCard },
    { id: "heloc", label: "HELOC", shortLabel: "HELOC", tn: d.helocTn, sharePct: (d.helocTn / d.totalTn) * 100, delinq90Pct: del.mortgage },
    { id: "other", label: "Other consumer", shortLabel: "Other", tn: d.otherTn, sharePct: (d.otherTn / d.totalTn) * 100, delinq90Pct: 4.0 },
  ].sort((a, b) => b.tn - a.tn);
}

export function rankedWealthByShare(): WealthSlice[] {
  return [...WEALTH_ALLOCATION].sort((a, b) => b.sharePct - a.sharePct);
}

export function debtStockTotalPath() {
  return DEBT_STOCK_PATH.map((d) => ({
    year: d.year,
    label: d.label,
    totalTn: d.totalTn,
    mortgageTn: d.mortgageTn,
    revolvingTn: d.creditCardTn + d.helocTn,
    installmentTn: d.autoTn + d.studentTn + d.otherTn,
    confidence: d.confidence,
  }));
}

export function fmtTn(n: number, digits = 2) {
  return `$${n.toFixed(digits)}T`;
}

export function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1) {
  return `${n.toFixed(digits)} pp`;
}
