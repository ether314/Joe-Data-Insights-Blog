/**
 * Bank & commercial credit — vintage update vs research print.
 * Prior theme post: bank-commercial-credit-research-2026 (2026Q1 map).
 * This update answers: what moved YoY (2025Q1→2026Q1) and QoQ (2025Q4→2026Q1)
 * in the Fed SA charge-off / delinquency release (last update May 19, 2026).
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Vintage delta vs bank-commercial-credit-research-2026. Levels from Federal Reserve Board Charge-Off and Delinquency Rates on Loans and Leases at Commercial Banks (all banks, seasonally adjusted; last update May 19, 2026). YoY = 2026Q1 minus 2025Q1; QoQ = 2026Q1 minus 2025Q4. Net charge-offs = charge-offs minus recoveries, annualized % of average loans. Delinquencies = 30+ days past due still accruing + nonaccrual, % of end-of-period loans. CRE = construction + multifamily + nonfarm nonresidential, booked in domestic offices. FDIC 2026 Risk Review for CRE PDNA / CMBS context carried from the research print. SLOOS net % tightening is directional from Board survey path.";

export const SOURCES = [
  {
    label: "Fed charge-off rates (SA)",
    url: "https://www.federalreserve.gov/releases/Chargeoff/chgallsa.htm",
  },
  {
    label: "Fed delinquency rates (SA)",
    url: "https://www.federalreserve.gov/releases/Chargeoff/delallsa.htm",
  },
  {
    label: "Fed Senior Loan Officer Opinion Survey",
    url: "https://www.federalreserve.gov/data/sloos.htm",
  },
  {
    label: "FDIC 2026 Risk Review",
    url: "https://www.fdic.gov/media/189821",
  },
  {
    label: "Prior theme post — Bank & commercial credit research",
    url: "/blog/bank-commercial-credit-research-2026",
  },
] as const;

/** Headline meters — 2026Q1 levels and YoY / QoQ deltas */
export const HEADLINE = {
  priorAsOf: "Research print (2026Q1 map)",
  newAsOf: "2026Q1 Fed SA (May 19, 2026 update)",
  yoyAsOf: "2025Q1 → 2026Q1",
  qoqAsOf: "2025Q4 → 2026Q1",
  cardsChargeOffNew: 3.84,
  cardsChargeOffYoyPrior: 4.46,
  cardsChargeOffYoyDelta: -0.62,
  cardsChargeOffQoqPrior: 4.07,
  cardsChargeOffQoqDelta: -0.23,
  creDelinqNew: 1.56,
  creDelinqYoyPrior: 1.57,
  creDelinqYoyDelta: -0.01,
  creDelinqQoqPrior: 1.58,
  creDelinqQoqDelta: -0.02,
  creChargeOffNew: 0.17,
  creChargeOffYoyPrior: 0.22,
  creChargeOffYoyDelta: -0.05,
  creChargeOffQoqPrior: 0.14,
  creChargeOffQoqDelta: 0.03,
  cardsDelinqNew: 2.92,
  cardsDelinqYoyPrior: 3.06,
  cardsDelinqYoyDelta: -0.14,
  cardsDelinqQoqPrior: 2.94,
  cardsDelinqQoqDelta: -0.02,
  ciChargeOffNew: 0.59,
  ciChargeOffYoyPrior: 0.55,
  ciChargeOffYoyDelta: 0.04,
  ciChargeOffQoqPrior: 0.56,
  ciChargeOffQoqDelta: 0.03,
  ciDelinqNew: 1.34,
  ciDelinqYoyPrior: 1.29,
  ciDelinqYoyDelta: 0.05,
  totalChargeOffNew: 0.56,
  totalChargeOffYoyPrior: 0.64,
  totalChargeOffYoyDelta: -0.08,
  totalDelinqNew: 1.48,
  totalDelinqYoyPrior: 1.55,
  totalDelinqYoyDelta: -0.07,
  resiDelinqNew: 1.89,
  resiDelinqYoyPrior: 1.77,
  resiDelinqYoyDelta: 0.12,
  resiDelinqQoqPrior: 1.79,
  resiDelinqQoqDelta: 0.1,
  creDelinqToChargeMultiple: 9.2,
  cmbsOfficeDelinqPct: 11.31,
  cmbsMultifamilyDelinqPct: 6.64,
  sloosCreNetTightenPct: 12,
  sloosCiNetTightenPct: 8,
} as const;

export type LedgerId =
  | "cardsCharge"
  | "creDelinq"
  | "creCharge"
  | "cardsDelinq"
  | "ciCharge"
  | "totalCharge"
  | "resiDelinq"
  | "ciDelinq";

export type VintageMeter = {
  id: LedgerId;
  label: string;
  metric: "chargeOff" | "delinquency";
  priorYoy: number;
  neu: number;
  yoyDelta: number;
  qoqDelta: number;
  deltaLabel: string;
  direction: "up" | "down" | "flat";
  note: string;
};

/** Scoreboard — signed YoY deltas (primary vintage lens) */
export const VINTAGE_METERS: VintageMeter[] = [
  {
    id: "cardsCharge",
    label: "Card charge-offs",
    metric: "chargeOff",
    priorYoy: 4.46,
    neu: 3.84,
    yoyDelta: -0.62,
    qoqDelta: -0.23,
    deltaLabel: "−0.62 pp YoY",
    direction: "down",
    note: "Largest cooling on the bank loss ledger",
  },
  {
    id: "totalCharge",
    label: "Total charge-offs",
    metric: "chargeOff",
    priorYoy: 0.64,
    neu: 0.56,
    yoyDelta: -0.08,
    qoqDelta: -0.02,
    deltaLabel: "−0.08 pp YoY",
    direction: "down",
    note: "Industry losses easing vs 2025Q1",
  },
  {
    id: "cardsDelinq",
    label: "Card delinquency",
    metric: "delinquency",
    priorYoy: 3.06,
    neu: 2.92,
    yoyDelta: -0.14,
    qoqDelta: -0.02,
    deltaLabel: "−0.14 pp YoY",
    direction: "down",
    note: "Past-dues cooling with write-offs",
  },
  {
    id: "creCharge",
    label: "CRE charge-offs",
    metric: "chargeOff",
    priorYoy: 0.22,
    neu: 0.17,
    yoyDelta: -0.05,
    qoqDelta: 0.03,
    deltaLabel: "−0.05 pp YoY / +0.03 QoQ",
    direction: "down",
    note: "YoY lower, but QoQ tick up from 0.14%",
  },
  {
    id: "creDelinq",
    label: "CRE delinquency",
    metric: "delinquency",
    priorYoy: 1.57,
    neu: 1.56,
    yoyDelta: -0.01,
    qoqDelta: -0.02,
    deltaLabel: "−0.01 pp YoY",
    direction: "flat",
    note: "Sticky past-due stock near research print",
  },
  {
    id: "ciCharge",
    label: "C&I charge-offs",
    metric: "chargeOff",
    priorYoy: 0.55,
    neu: 0.59,
    yoyDelta: 0.04,
    qoqDelta: 0.03,
    deltaLabel: "+0.04 pp YoY",
    direction: "up",
    note: "Business credit losses creep higher",
  },
  {
    id: "ciDelinq",
    label: "C&I delinquency",
    metric: "delinquency",
    priorYoy: 1.29,
    neu: 1.34,
    yoyDelta: 0.05,
    qoqDelta: 0.0,
    deltaLabel: "+0.05 pp YoY",
    direction: "up",
    note: "Flat QoQ; elevated vs year-ago",
  },
  {
    id: "resiDelinq",
    label: "Residential delinquency",
    metric: "delinquency",
    priorYoy: 1.77,
    neu: 1.89,
    yoyDelta: 0.12,
    qoqDelta: 0.1,
    deltaLabel: "+0.12 pp YoY",
    direction: "up",
    note: "Past-dues rising; charge-offs still ~0%",
  },
];

export type CategoryVintage = {
  id: string;
  label: string;
  short: string;
  chargeOff: { q1_2025: number; q4_2025: number; q1_2026: number; yoy: number; qoq: number };
  delinquency: { q1_2025: number; q4_2025: number; q1_2026: number; yoy: number; qoq: number };
  confidence: Confidence;
};

/** Category-level vintage table — Fed SA disclosed */
export const CATEGORY_VINTAGE: CategoryVintage[] = [
  {
    id: "cards",
    label: "Credit cards",
    short: "Cards",
    chargeOff: { q1_2025: 4.46, q4_2025: 4.07, q1_2026: 3.84, yoy: -0.62, qoq: -0.23 },
    delinquency: { q1_2025: 3.06, q4_2025: 2.94, q1_2026: 2.92, yoy: -0.14, qoq: -0.02 },
    confidence: "disclosed",
  },
  {
    id: "otherCons",
    label: "Other consumer",
    short: "Other cons.",
    chargeOff: { q1_2025: 1.22, q4_2025: 1.21, q1_2026: 1.17, yoy: -0.05, qoq: -0.04 },
    delinquency: { q1_2025: 2.38, q4_2025: 2.27, q1_2026: 2.28, yoy: -0.1, qoq: 0.01 },
    confidence: "disclosed",
  },
  {
    id: "cre",
    label: "Commercial RE",
    short: "CRE",
    chargeOff: { q1_2025: 0.22, q4_2025: 0.14, q1_2026: 0.17, yoy: -0.05, qoq: 0.03 },
    delinquency: { q1_2025: 1.57, q4_2025: 1.58, q1_2026: 1.56, yoy: -0.01, qoq: -0.02 },
    confidence: "disclosed",
  },
  {
    id: "ci",
    label: "C&I loans",
    short: "C&I",
    chargeOff: { q1_2025: 0.55, q4_2025: 0.56, q1_2026: 0.59, yoy: 0.04, qoq: 0.03 },
    delinquency: { q1_2025: 1.29, q4_2025: 1.34, q1_2026: 1.34, yoy: 0.05, qoq: 0.0 },
    confidence: "disclosed",
  },
  {
    id: "resi",
    label: "Residential RE",
    short: "Resi",
    chargeOff: { q1_2025: 0.0, q4_2025: 0.0, q1_2026: 0.0, yoy: 0.0, qoq: 0.0 },
    delinquency: { q1_2025: 1.77, q4_2025: 1.79, q1_2026: 1.89, yoy: 0.12, qoq: 0.1 },
    confidence: "disclosed",
  },
  {
    id: "leases",
    label: "Leases",
    short: "Leases",
    chargeOff: { q1_2025: 0.25, q4_2025: 0.37, q1_2026: 0.37, yoy: 0.12, qoq: 0.0 },
    delinquency: { q1_2025: 1.13, q4_2025: 1.22, q1_2026: 1.16, yoy: 0.03, qoq: -0.06 },
    confidence: "disclosed",
  },
  {
    id: "ag",
    label: "Agricultural",
    short: "Ag",
    chargeOff: { q1_2025: 0.2, q4_2025: 0.2, q1_2026: 0.13, yoy: -0.07, qoq: -0.07 },
    delinquency: { q1_2025: 1.19, q4_2025: 1.16, q1_2026: 1.12, yoy: -0.07, qoq: -0.04 },
    confidence: "disclosed",
  },
  {
    id: "total",
    label: "Total loans & leases",
    short: "Total",
    chargeOff: { q1_2025: 0.64, q4_2025: 0.58, q1_2026: 0.56, yoy: -0.08, qoq: -0.02 },
    delinquency: { q1_2025: 1.55, q4_2025: 1.48, q1_2026: 1.48, yoy: -0.07, qoq: 0.0 },
    confidence: "disclosed",
  },
];

/** Quarterly path for dual-line CRE vs cards */
export const QUARTERLY_PATH: {
  quarter: string;
  label: string;
  sortKey: number;
  creDelinq: number;
  creChargeOff: number;
  cardsDelinq: number;
  cardsChargeOff: number;
  ciChargeOff: number;
  totalChargeOff: number;
  confidence: Confidence;
}[] = [
  {
    quarter: "2024Q1",
    label: "24Q1",
    sortKey: 2024.0,
    creDelinq: 1.38,
    creChargeOff: 0.24,
    cardsDelinq: 3.18,
    cardsChargeOff: 4.48,
    ciChargeOff: 0.5,
    totalChargeOff: 0.65,
    confidence: "estimated",
  },
  {
    quarter: "2024Q2",
    label: "24Q2",
    sortKey: 2024.25,
    creDelinq: 1.42,
    creChargeOff: 0.26,
    cardsDelinq: 3.22,
    cardsChargeOff: 4.59,
    ciChargeOff: 0.48,
    totalChargeOff: 0.66,
    confidence: "disclosed",
  },
  {
    quarter: "2024Q3",
    label: "24Q3",
    sortKey: 2024.5,
    creDelinq: 1.49,
    creChargeOff: 0.25,
    cardsDelinq: 3.15,
    cardsChargeOff: 4.55,
    ciChargeOff: 0.5,
    totalChargeOff: 0.65,
    confidence: "estimated",
  },
  {
    quarter: "2024Q4",
    label: "24Q4",
    sortKey: 2024.75,
    creDelinq: 1.56,
    creChargeOff: 0.25,
    cardsDelinq: 3.08,
    cardsChargeOff: 4.56,
    ciChargeOff: 0.52,
    totalChargeOff: 0.64,
    confidence: "disclosed",
  },
  {
    quarter: "2025Q1",
    label: "25Q1",
    sortKey: 2025.0,
    creDelinq: 1.57,
    creChargeOff: 0.22,
    cardsDelinq: 3.06,
    cardsChargeOff: 4.46,
    ciChargeOff: 0.55,
    totalChargeOff: 0.64,
    confidence: "disclosed",
  },
  {
    quarter: "2025Q2",
    label: "25Q2",
    sortKey: 2025.25,
    creDelinq: 1.57,
    creChargeOff: 0.18,
    cardsDelinq: 3.04,
    cardsChargeOff: 4.21,
    ciChargeOff: 0.58,
    totalChargeOff: 0.61,
    confidence: "disclosed",
  },
  {
    quarter: "2025Q3",
    label: "25Q3",
    sortKey: 2025.5,
    creDelinq: 1.58,
    creChargeOff: 0.16,
    cardsDelinq: 2.98,
    cardsChargeOff: 4.14,
    ciChargeOff: 0.57,
    totalChargeOff: 0.59,
    confidence: "estimated",
  },
  {
    quarter: "2025Q4",
    label: "25Q4",
    sortKey: 2025.75,
    creDelinq: 1.58,
    creChargeOff: 0.14,
    cardsDelinq: 2.94,
    cardsChargeOff: 4.07,
    ciChargeOff: 0.56,
    totalChargeOff: 0.58,
    confidence: "disclosed",
  },
  {
    quarter: "2026Q1",
    label: "26Q1",
    sortKey: 2026.0,
    creDelinq: 1.56,
    creChargeOff: 0.17,
    cardsDelinq: 2.92,
    cardsChargeOff: 3.84,
    ciChargeOff: 0.59,
    totalChargeOff: 0.56,
    confidence: "disclosed",
  },
];

/** Dumbbell — prior YoY level → new for charge-offs */
export const CHARGEOFF_DUMBBELL = CATEGORY_VINTAGE.filter((c) => c.id !== "total").map((c) => ({
  id: c.id,
  label: c.short,
  prior: c.chargeOff.q1_2025,
  neu: c.chargeOff.q1_2026,
  delta: c.chargeOff.yoy,
  confidence: c.confidence,
}));

/** CRE multiple path — delinq / charge-off */
export const CRE_MULTIPLE_PATH = QUARTERLY_PATH.map((q) => ({
  label: q.label,
  sortKey: q.sortKey,
  multiple: q.creChargeOff > 0 ? Math.round((q.creDelinq / q.creChargeOff) * 10) / 10 : null,
  creDelinq: q.creDelinq,
  creChargeOff: q.creChargeOff,
  confidence: q.confidence,
}));

/** SLOOS path — net % tightening (research anchors + early-2026 directional) */
export const SLOOS_PATH: {
  label: string;
  sortKey: number;
  cre: number;
  ci: number;
  confidence: Confidence;
}[] = [
  { label: "23Q2", sortKey: 2023.25, cre: 46, ci: 51, confidence: "disclosed" },
  { label: "23Q4", sortKey: 2023.75, cre: 34, ci: 33, confidence: "disclosed" },
  { label: "24Q2", sortKey: 2024.25, cre: 28, ci: 18, confidence: "disclosed" },
  { label: "24Q4", sortKey: 2024.75, cre: 22, ci: 12, confidence: "estimated" },
  { label: "25Q2", sortKey: 2025.25, cre: 16, ci: 10, confidence: "estimated" },
  { label: "25Q4", sortKey: 2025.75, cre: 14, ci: 9, confidence: "estimated" },
  { label: "26Q1", sortKey: 2026.0, cre: 12, ci: 8, confidence: "estimated" },
];

/** Stress geography snapshot for scatter (latest quarter) */
export const LOAN_BOOK_LATEST = [
  { short: "Cards", delinquency: 2.92, chargeOff: 3.84 },
  { short: "Other cons.", delinquency: 2.28, chargeOff: 1.17 },
  { short: "Resi", delinquency: 1.89, chargeOff: 0.0 },
  { short: "CRE", delinquency: 1.56, chargeOff: 0.17 },
  { short: "C&I", delinquency: 1.34, chargeOff: 0.59 },
  { short: "Leases", delinquency: 1.16, chargeOff: 0.37 },
  { short: "Ag", delinquency: 1.12, chargeOff: 0.13 },
] as const;

export function meterDeltasSorted(mode: "yoy" | "qoq" = "yoy"): (VintageMeter & { delta: number })[] {
  const rows = VINTAGE_METERS.map((m) => ({
    ...m,
    delta: mode === "yoy" ? m.yoyDelta : m.qoqDelta,
  }));
  return rows.sort((a, b) => a.delta - b.delta);
}

export function categoryDeltasSorted(
  metric: "chargeOff" | "delinquency",
  mode: "yoy" | "qoq" = "yoy",
) {
  return CATEGORY_VINTAGE.filter((c) => c.id !== "total")
    .map((c) => ({
      id: c.id,
      label: c.short,
      prior: mode === "yoy" ? c[metric].q1_2025 : c[metric].q4_2025,
      neu: c[metric].q1_2026,
      delta: mode === "yoy" ? c[metric].yoy : c[metric].qoq,
    }))
    .sort((a, b) => a.delta - b.delta);
}

export function fmtPct(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 2): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}
