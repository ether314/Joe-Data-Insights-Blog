/**
 * Consumer finance & household balance sheets — August 202608 vintage.
 * Prior theme post: consumer-finance-markets-update-2026q3 (July PSAVERT 3.1%,
 * NY Fed 2026Q2 debt $18.926T, student 90+ 10.6%, ICI MMF restated $8.02T).
 * New vintage: ICI week ended Aug 19, 2026 official Aug 20 release ($7.93T);
 * Board G.19 June 2026 revolving / total consumer credit (Aug 7 release);
 * BEA / FRED PSAVERT still June 2.7% pending Aug 26 July print; Board card APR
 * May 2026 + FEDFUNDS July for disclosed APR−funds gap.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Aug 202608 vintage delta vs consumer-finance-markets-update-2026q3. Money market fund AUM from ICI weekly (week ended Aug 19, 2026 = $7.928T on the Aug 20, 2026 release — not the Q3 theme's $8.02T restatement). Revolving and total consumer credit from Board G.19 through June 2026 (Aug 7, 2026 release). Personal saving: last disclosed FRED PSAVERT monthly is June 2026 = 2.7%; July print due Aug 26, 2026 — Q3 theme's July 3.1% is carried as pending confirmation. Card APR from G.19 commercial-bank average (May 2026 = 20.94%); FEDFUNDS July 2026 = 3.63%. NY Fed HHDC 2026Q2 debt/stress figures are unchanged and carried from the Q3 print.";

export const SOURCES = [
  {
    label: "ICI — Money Market Fund Assets (Aug 20, 2026)",
    url: "https://www.ici.org/research/stats/mmf",
  },
  {
    label: "Fed G.19 — Consumer Credit (Aug 7, 2026 / June data)",
    url: "https://www.federalreserve.gov/releases/g19/current/",
  },
  {
    label: "BEA / FRED — Personal saving rate (PSAVERT)",
    url: "https://fred.stlouisfed.org/series/PSAVERT",
  },
  {
    label: "FRED — Effective federal funds rate (FEDFUNDS)",
    url: "https://fred.stlouisfed.org/series/FEDFUNDS",
  },
  {
    label: "NY Fed — Household Debt and Credit, 2026Q2 (carried)",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "Prior Q3 theme update — July saving / $8.02T MMF",
    url: "/blog/consumer-finance-markets-update-2026q3",
  },
] as const;

/** Headline meters — Aug 202608 official prints and Δ vs Q3 theme print */
export const HEADLINE = {
  priorAsOf: "Q3 theme print (July 3.1% · MMF $8.02T · NY Fed Q2)",
  newAsOfMmf: "Week ended Aug 19, 2026 (ICI Aug 20 release)",
  newAsOfRevolving: "June 2026 SA (G.19 Aug 7)",
  newAsOfSaving: "June 2026 monthly disclosed; July pending Aug 26",
  newAsOfApr: "May 2026 card APR · July FEDFUNDS",
  mmfPriorTn: 8.02,
  mmfNewTn: 7.928,
  mmfDeltaTn: -0.092,
  mmfRetailNewTn: 3.106,
  mmfRetailPriorEstTn: 3.15,
  mmfGovNewTn: 6.541,
  mmfPrimeNewTn: 1.238,
  revolvingPriorTn: 1.344,
  revolvingNewTn: 1.351,
  revolvingDeltaTn: 0.007,
  revolvingMayTn: 1.344,
  revolvingJuneTn: 1.351,
  totalConsumerCreditNewTn: 5.167,
  totalConsumerCreditPriorTn: 5.153,
  nyFedCardQ2Tn: 1.281,
  savingQ3ClaimPct: 3.1,
  savingDisclosedPct: 2.7,
  savingDeltaVsQ3Pp: -0.4,
  savingJunePct: 2.7,
  savingMayPct: 2.8,
  savingQ2SaarPct: 2.8,
  totalDebtCarriedTn: 18.926,
  student90CarriedPct: 10.6,
  aggregateDelinqCarriedPct: 4.9,
  cardAprNewPct: 20.94,
  cardAprPriorPct: 21.2,
  fedFundsNewPct: 3.63,
  fedFundsPriorPct: 4.0,
  aprGapNewPp: 17.31,
  aprGapPriorPp: 17.2,
  aprGapDeltaPp: 0.11,
  depositsEstTn: 14.98,
  depositsPriorEstTn: 14.95,
} as const;

export type LedgerId =
  | "mmf"
  | "revolving"
  | "savingConfirm"
  | "aprGap"
  | "debtCarry"
  | "student90";

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
  confidence: Confidence;
};

/** Six scoreboard meters — Q3 theme print → Aug 202608 official */
export const VINTAGE_METERS: VintageMeter[] = [
  {
    id: "mmf",
    label: "Money market fund AUM",
    unit: "tn",
    prior: 8.02,
    neu: 7.928,
    delta: -0.092,
    deltaLabel: "−$92B",
    direction: "down",
    note: "ICI Aug 20 official vs Q3 theme $8.02T restatement",
    confidence: "disclosed",
  },
  {
    id: "revolving",
    label: "G.19 revolving credit",
    unit: "tn",
    prior: 1.344,
    neu: 1.351,
    delta: 0.007,
    deltaLabel: "+$7B",
    direction: "up",
    note: "June SA vs May; Board G.19 Aug 7 release",
    confidence: "disclosed",
  },
  {
    id: "savingConfirm",
    label: "Saving (disclosed vs Q3)",
    unit: "pct",
    prior: 3.1,
    neu: 2.7,
    delta: -0.4,
    deltaLabel: "−0.4 pp",
    direction: "down",
    note: "Disclosed June PSAVERT vs Q3 July 3.1% pending Aug 26",
    confidence: "disclosed",
  },
  {
    id: "aprGap",
    label: "Card APR − fed funds",
    unit: "pp",
    prior: 17.2,
    neu: 17.31,
    delta: 0.11,
    deltaLabel: "+0.1 pp",
    direction: "up",
    note: "May card APR 20.94% − July FEDFUNDS 3.63%",
    confidence: "disclosed",
  },
  {
    id: "debtCarry",
    label: "NY Fed HH debt (carried)",
    unit: "tn",
    prior: 18.926,
    neu: 18.926,
    delta: 0,
    deltaLabel: "0",
    direction: "flat",
    note: "No new quarterly; 2026Q2 print unchanged",
    confidence: "carried",
  },
  {
    id: "student90",
    label: "Student 90+ share (carried)",
    unit: "pct",
    prior: 10.6,
    neu: 10.6,
    delta: 0,
    deltaLabel: "0",
    direction: "flat",
    note: "No new NY Fed quarterly stress print",
    confidence: "carried",
  },
];

export type MmfWeekPoint = {
  label: string;
  sortKey: number;
  totalTn: number;
  retailTn: number;
  institutionalTn: number;
  confidence: Confidence;
  vintage: "history" | "prior" | "new";
};

/** ICI weekly path into the Aug 20 official print */
export const MMF_WEEKLY_PATH: MmfWeekPoint[] = [
  {
    label: "Jul 29",
    sortKey: 2026.58,
    totalTn: 7.854,
    retailTn: 3.078,
    institutionalTn: 4.776,
    confidence: "disclosed",
    vintage: "history",
  },
  {
    label: "Aug 5",
    sortKey: 2026.6,
    totalTn: 7.909,
    retailTn: 3.099,
    institutionalTn: 4.81,
    confidence: "disclosed",
    vintage: "history",
  },
  {
    label: "Aug 12",
    sortKey: 2026.62,
    totalTn: 7.928,
    retailTn: 3.103,
    institutionalTn: 4.824,
    confidence: "disclosed",
    vintage: "history",
  },
  {
    label: "Aug 19",
    sortKey: 2026.64,
    totalTn: 7.928,
    retailTn: 3.106,
    institutionalTn: 4.822,
    confidence: "disclosed",
    vintage: "new",
  },
];

/** Q3 theme claimed level vs official Aug 19 week */
export const MMF_CORRECTION = [
  { label: "Q3 theme claim", totalTn: 8.02, fill: "prior" as const },
  { label: "ICI Aug 19 official", totalTn: 7.928, fill: "new" as const },
] as const;

export type RevolvingPoint = {
  label: string;
  sortKey: number;
  revolvingTn: number;
  totalTn: number;
  confidence: Confidence;
  vintage: "history" | "prior" | "new";
};

/** Board G.19 SA path — into June 2026 */
export const REVOLVING_PATH: RevolvingPoint[] = [
  {
    label: "2025 Q4",
    sortKey: 2025.75,
    revolvingTn: 1.324,
    totalTn: 5.099,
    confidence: "disclosed",
    vintage: "history",
  },
  {
    label: "Mar '26",
    sortKey: 2026.25,
    revolvingTn: 1.338,
    totalTn: 5.134,
    confidence: "disclosed",
    vintage: "history",
  },
  {
    label: "Apr '26",
    sortKey: 2026.33,
    revolvingTn: 1.35,
    totalTn: 5.154,
    confidence: "disclosed",
    vintage: "history",
  },
  {
    label: "May '26",
    sortKey: 2026.42,
    revolvingTn: 1.344,
    totalTn: 5.153,
    confidence: "disclosed",
    vintage: "prior",
  },
  {
    label: "Jun '26",
    sortKey: 2026.5,
    revolvingTn: 1.351,
    totalTn: 5.167,
    confidence: "disclosed",
    vintage: "new",
  },
];

/** Concept bridge: G.19 revolving vs NY Fed card stock */
export const REVOLVING_VS_NYFED = [
  {
    label: "G.19 revolving (Jun)",
    tn: 1.351,
    note: "Board owned+securitized SA",
    confidence: "disclosed" as Confidence,
  },
  {
    label: "NY Fed cards (Q2)",
    tn: 1.281,
    note: "Bureau balances; carried Q2",
    confidence: "carried" as Confidence,
  },
] as const;

export type SavingPoint = {
  label: string;
  sortKey: number;
  savingRatePct: number;
  confidence: Confidence;
  vintage: "history" | "prior" | "pending" | "disclosed";
};

/** BEA personal saving — disclosed path + Q3 July claim as pending */
export const SAVING_RATE_PATH: SavingPoint[] = [
  { label: "2025 Q4", sortKey: 2025.75, savingRatePct: 3.8, confidence: "disclosed", vintage: "history" },
  { label: "2026 Q1", sortKey: 2026.0, savingRatePct: 3.9, confidence: "disclosed", vintage: "history" },
  { label: "2026 Q2", sortKey: 2026.25, savingRatePct: 2.8, confidence: "disclosed", vintage: "history" },
  { label: "May '26", sortKey: 2026.42, savingRatePct: 2.8, confidence: "disclosed", vintage: "history" },
  { label: "Jun '26", sortKey: 2026.5, savingRatePct: 2.7, confidence: "disclosed", vintage: "disclosed" },
  { label: "Jul '26 (Q3)", sortKey: 2026.58, savingRatePct: 3.1, confidence: "estimated", vintage: "pending" },
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
    label: "Bank deposits (ex-large time, est.)",
    priorTn: 14.95,
    newTn: 14.98,
    yieldPct: 0.5,
    confidence: "estimated",
  },
  {
    id: "mmf",
    label: "Money market funds (ICI)",
    priorTn: 8.02,
    newTn: 7.928,
    yieldPct: 3.7,
    confidence: "disclosed",
  },
  {
    id: "mmfRetail",
    label: "Retail MMF sleeve",
    priorTn: 3.15,
    newTn: 3.106,
    yieldPct: 3.7,
    confidence: "disclosed",
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
  { label: "2025", sortKey: 2025, cardAprPct: 21.4, fedFundsPct: 4.5, gapPp: 16.9, confidence: "estimated" },
  { label: "Q3 theme", sortKey: 2026.55, cardAprPct: 21.2, fedFundsPct: 4.0, gapPp: 17.2, confidence: "estimated" },
  { label: "Aug '26 disclosed", sortKey: 2026.65, cardAprPct: 20.94, fedFundsPct: 3.63, gapPp: 17.31, confidence: "disclosed" },
];

export type DebtCarryRow = {
  id: string;
  label: string;
  shortLabel: string;
  tn: number;
  sharePct: number;
  confidence: Confidence;
};

/** Carried NY Fed 2026Q2 product mix — no new quarterly */
export const DEBT_CARRY_MIX: DebtCarryRow[] = [
  { id: "mortgage", label: "Mortgage", shortLabel: "Mortgage", tn: 13.268, sharePct: 70.1, confidence: "carried" },
  { id: "auto", label: "Auto loans", shortLabel: "Auto", tn: 1.702, sharePct: 9.0, confidence: "carried" },
  { id: "student", label: "Student loans", shortLabel: "Student", tn: 1.661, sharePct: 8.8, confidence: "carried" },
  { id: "card", label: "Credit cards", shortLabel: "Cards", tn: 1.281, sharePct: 6.8, confidence: "carried" },
  { id: "heloc", label: "HELOC", shortLabel: "HELOC", tn: 0.458, sharePct: 2.4, confidence: "carried" },
  { id: "other", label: "Other consumer", shortLabel: "Other", tn: 0.556, sharePct: 2.9, confidence: "carried" },
];

export type StressCarry = {
  label: string;
  student90Pct: number;
  mortgageSeriousPct: number;
  cardEarlyPct: number;
  aggregateAnyPct: number;
};

export const STRESS_CARRY: StressCarry = {
  label: "2026 Q2 (carried)",
  student90Pct: 10.6,
  mortgageSeriousPct: 1.6,
  cardEarlyPct: 8.4,
  aggregateAnyPct: 4.9,
};

export function meterDeltasSorted() {
  return [...VINTAGE_METERS].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

export function fmtTn(n: number, digits = 2) {
  return `$${n.toFixed(digits)}T`;
}

export function fmtBn(n: number) {
  const sign = n >= 0 ? "+" : "−";
  return `${sign}$${Math.abs(n).toFixed(0)}B`;
}

export function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1) {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(digits)} pp`;
}

export function fmtDeltaTn(n: number) {
  const sign = n >= 0 ? "+" : "−";
  const abs = Math.abs(n);
  if (abs >= 1) return `${sign}$${abs.toFixed(2)}T`;
  return `${sign}$${(abs * 1000).toFixed(0)}B`;
}
