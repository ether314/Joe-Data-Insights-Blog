/**
 * Bank & commercial credit — August 2026 vintage update.
 * Prior theme post: bank-commercial-credit-update-2026q3
 *   (July SLOOS easing + Trepp July CMBS delinquency).
 * New vintage: Trepp July special-servicing divergence + August hard-maturity
 * cohort (published Aug 4–10). Fed SA still closes on 2026Q1; SLOOS still July.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "August 2026 vintage delta vs bank-commercial-credit-update-2026q3. Fed SA charge-off/delinquency levels carried from May 19, 2026 release through 2026Q1 (unchanged). July SLOOS CRE/C&I/card standards carried from prior post (Board July 2026 survey). New ledger: Trepp July 2026 CMBS Special Servicing Report (overall 11.09%, −11 bp MoM; office 16.58% −53 bp; retail 13.28% +33 bp) and Trepp August 2026 CMBS hard-maturity cohort ($5.49B vs July $2.55B; $3.04B debt yield <8%; $996M <6%). Headline CMBS delinquency 7.86% (+51 bp) from Trepp July Delinquency Report / CREFC July 2026 loan-performance note. Performing matured balloon effective rate 9.62% (+9 bp).";

export const SOURCES = [
  {
    label: "Trepp — Aug 2026 CMBS hard maturities",
    url: "https://www.trepp.com/trepptalk/august-2026-cmbs-hard-maturities",
  },
  {
    label: "Trepp — July 2026 CMBS special servicing",
    url: "https://www.trepp.com/trepptalk/cmbs-special-servicing-july-2026",
  },
  {
    label: "Trepp — July 2026 CMBS delinquency",
    url: "https://www.trepp.com/trepptalk/cmbs-delinquency-report-july-2026",
  },
  {
    label: "CREFC July 2026 CMBS loan performance",
    url: "https://www.crefc.org/cre/content/News/Items/Research_and_Data/2026/CREFCs_July_2026_Monthly_CMBS_Loan_Performance_Report.aspx",
  },
  {
    label: "Fed charge-off rates (SA, carried 2026Q1)",
    url: "https://www.federalreserve.gov/releases/Chargeoff/chgallsa.htm",
  },
  {
    label: "Prior Q3 theme update",
    url: "/blog/bank-commercial-credit-update-2026q3",
  },
] as const;

/** Headline meters — Aug vintage vs Q3 post */
export const HEADLINE = {
  priorAsOf: "Q3 post (July SLOOS + Trepp July delinq)",
  newAsOf: "Trepp July SS + Aug hard maturities",
  fedSaAsOf: "2026Q1 Fed SA (May 19, 2026 — unchanged)",
  cmbsDelinq: 7.86,
  cmbsDelinqMomBp: 51,
  cmbsSs: 11.09,
  cmbsSsMomBp: -11,
  cmbsSsPrior: 11.2,
  officeSs: 16.58,
  officeSsMomBp: -53,
  retailSs: 13.28,
  retailSsMomBp: 33,
  cmbsOfficeDelinq: 11.91,
  cmbsMfDelinq: 7.69,
  augMaturityBn: 5.49,
  julMaturityBn: 2.55,
  maturityMultiple: 2.15,
  dyBelow8Bn: 3.04,
  dyBelow6Bn: 0.996,
  dyBelow6StillCurrentBn: 0.962,
  augNpMn: 136.6,
  julNpMn: 34.9,
  augSsBalanceBn: 1.38,
  julSsBalanceBn: 0.636,
  officeMaturityShare: 32.86,
  performingMaturedBalloon: 9.62,
  performingMaturedBalloonMomBp: 9,
  cardsChargeOff: 3.84,
  creDelinq: 1.56,
  creChargeOff: 0.17,
  sloosNfnrNet: -11.3,
} as const;

export type LedgerId =
  | "cmbsDelinq"
  | "cmbsSs"
  | "augMaturity"
  | "dyBelow8"
  | "augNp"
  | "officeSs"
  | "retailSs"
  | "fedCards";

export type VintageMeter = {
  id: LedgerId;
  label: string;
  prior: number;
  neu: number;
  delta: number;
  unit: "pct" | "pp" | "bp" | "bn" | "mn";
  deltaLabel: string;
  direction: "up" | "down" | "flat";
  note: string;
  confidence: Confidence;
};

/** Scoreboard — signed moves vs prior Q3 theme update / prior month */
export const VINTAGE_METERS: VintageMeter[] = [
  {
    id: "cmbsDelinq",
    label: "CMBS delinquency (overall)",
    prior: 7.35,
    neu: 7.86,
    delta: 0.51,
    unit: "pct",
    deltaLabel: "+51 bp MoM",
    direction: "up",
    note: "Highest since Nov 2020; matured balloons drove the jump",
    confidence: "disclosed",
  },
  {
    id: "cmbsSs",
    label: "CMBS special servicing",
    prior: 11.2,
    neu: 11.09,
    delta: -0.11,
    unit: "pct",
    deltaLabel: "−11 bp MoM",
    direction: "down",
    note: "Workouts outpaced new transfers even as delinq rose",
    confidence: "disclosed",
  },
  {
    id: "augMaturity",
    label: "Hard-maturity cohort ($B)",
    prior: 2.55,
    neu: 5.49,
    delta: 2.94,
    unit: "bn",
    deltaLabel: "~2.2× July",
    direction: "up",
    note: "August private-label CMBS hard maturities roughly doubled",
    confidence: "disclosed",
  },
  {
    id: "dyBelow8",
    label: "Debt yield <8% ($B)",
    prior: 0,
    neu: 3.04,
    delta: 3.04,
    unit: "bn",
    deltaLabel: "$3.04B at risk",
    direction: "up",
    note: "Refinance friction band inside August cohort",
    confidence: "disclosed",
  },
  {
    id: "augNp",
    label: "Cohort non-performing ($M)",
    prior: 34.9,
    neu: 136.6,
    delta: 101.7,
    unit: "mn",
    deltaLabel: "+$102M vs July",
    direction: "up",
    note: "All NP loan pieces in office",
    confidence: "disclosed",
  },
  {
    id: "officeSs",
    label: "Office special servicing",
    prior: 17.11,
    neu: 16.58,
    delta: -0.53,
    unit: "pct",
    deltaLabel: "−53 bp MoM",
    direction: "down",
    note: "Largest SS category improved even as office delinq rose",
    confidence: "disclosed",
  },
  {
    id: "retailSs",
    label: "Retail special servicing",
    prior: 12.95,
    neu: 13.28,
    delta: 0.33,
    unit: "pct",
    deltaLabel: "+33 bp MoM",
    direction: "up",
    note: "Regional-mall maturity defaults into SS",
    confidence: "disclosed",
  },
  {
    id: "fedCards",
    label: "Card charge-offs (Fed SA)",
    prior: 3.84,
    neu: 3.84,
    delta: 0,
    unit: "pct",
    deltaLabel: "unchanged vintage",
    direction: "flat",
    note: "Still 2026Q1 SA — no newer Fed charge-off print",
    confidence: "disclosed",
  },
];

/** Property-type divergence: delinquency MoM bp vs special-servicing MoM bp */
export type DivergenceRow = {
  id: string;
  label: string;
  short: string;
  delinqPct: number;
  delinqMomBp: number;
  ssPct: number;
  ssMomBp: number;
  confidence: Confidence;
};

export const DIVERGENCE: DivergenceRow[] = [
  {
    id: "office",
    label: "Office",
    short: "Office",
    delinqPct: 11.91,
    delinqMomBp: 34,
    ssPct: 16.58,
    ssMomBp: -53,
    confidence: "disclosed",
  },
  {
    id: "multifamily",
    label: "Multifamily",
    short: "MF",
    delinqPct: 7.69,
    delinqMomBp: 46,
    ssPct: 8.39,
    ssMomBp: 16,
    confidence: "disclosed",
  },
  {
    id: "lodging",
    label: "Lodging",
    short: "Lodging",
    delinqPct: 5.35,
    delinqMomBp: 13,
    ssPct: 8.63,
    ssMomBp: -26,
    confidence: "disclosed",
  },
  {
    id: "retail",
    label: "Retail",
    short: "Retail",
    delinqPct: 7.5,
    delinqMomBp: 0,
    ssPct: 13.28,
    ssMomBp: 33,
    confidence: "estimated",
  },
  {
    id: "overall",
    label: "All CMBS",
    short: "Overall",
    delinqPct: 7.86,
    delinqMomBp: 51,
    ssPct: 11.09,
    ssMomBp: -11,
    confidence: "disclosed",
  },
];

/** August hard-maturity cohort by property type ($B) */
export type MaturitySlice = {
  id: string;
  label: string;
  short: string;
  balanceBn: number;
  sharePct: number;
  ssBalanceBn: number | null;
  npOnly: boolean;
  confidence: Confidence;
};

export const MATURITY_MIX: MaturitySlice[] = [
  {
    id: "office",
    label: "Office",
    short: "Office",
    balanceBn: 1.81,
    sharePct: 32.86,
    ssBalanceBn: 0.9865,
    npOnly: true,
    confidence: "disclosed",
  },
  {
    id: "retail",
    label: "Retail",
    short: "Retail",
    balanceBn: 1.77,
    sharePct: 32.19,
    ssBalanceBn: 0.372,
    npOnly: false,
    confidence: "disclosed",
  },
  {
    id: "mixed",
    label: "Mixed-use",
    short: "Mixed",
    balanceBn: 1.38,
    sharePct: 25.09,
    ssBalanceBn: null,
    npOnly: false,
    confidence: "disclosed",
  },
  {
    id: "other",
    label: "Other CRE",
    short: "Other",
    balanceBn: 0.53,
    sharePct: 9.86,
    ssBalanceBn: null,
    npOnly: false,
    confidence: "estimated",
  },
];

/** Debt-yield risk bands inside August cohort */
export type DyBand = {
  id: string;
  label: string;
  balanceBn: number;
  sharePct: number;
  note: string;
  confidence: Confidence;
};

export const DY_BANDS: DyBand[] = [
  {
    id: "ok",
    label: "Debt yield ≥8%",
    balanceBn: 2.45,
    sharePct: 44.6,
    note: "Clearer refinance path under today's lender tests",
    confidence: "estimated",
  },
  {
    id: "friction",
    label: "Debt yield 6–8%",
    balanceBn: 2.044,
    sharePct: 37.2,
    note: "Refinance friction — paydown or restructuring likely",
    confidence: "estimated",
  },
  {
    id: "severe",
    label: "Debt yield <6%",
    balanceBn: 0.996,
    sharePct: 18.1,
    note: "$962M of this band still current — forward delinquency risk",
    confidence: "disclosed",
  },
];

/** July → August maturity cohort comparison */
export const COHORT_COMPARE = [
  { metric: "Hard maturity ($B)", july: 2.55, august: 5.49, unit: "bn" as const },
  { metric: "Non-performing ($M)", july: 34.9, august: 136.6, unit: "mn" as const },
  {
    metric: "Special servicing ($B)",
    july: 0.636,
    august: 1.38,
    unit: "bn" as const,
  },
  {
    metric: "Top-5 share of balance (%)",
    july: 48.37,
    august: 52.65,
    unit: "pct" as const,
  },
  {
    metric: "Loan pieces (count)",
    july: 60,
    august: 130,
    unit: "count" as const,
  },
];

/** Carried Fed SA quarterly path (same print as Q3 update) */
export const FED_SA_PATH: {
  quarter: string;
  label: string;
  sortKey: number;
  creDelinq: number;
  creChargeOff: number;
  cardsDelinq: number;
  cardsChargeOff: number;
  ciChargeOff: number;
  confidence: Confidence;
}[] = [
  {
    quarter: "2024Q4",
    label: "24Q4",
    sortKey: 2024.75,
    creDelinq: 1.56,
    creChargeOff: 0.25,
    cardsDelinq: 3.08,
    cardsChargeOff: 4.56,
    ciChargeOff: 0.52,
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
    confidence: "disclosed",
  },
];

/** Three-ledger stress map */
export const STRESS_MAP = [
  { short: "Cards (bank)", delinquency: 2.92, chargeOff: 3.84, book: "bank" },
  { short: "CRE (bank)", delinquency: 1.56, chargeOff: 0.17, book: "bank" },
  { short: "C&I (bank)", delinquency: 1.34, chargeOff: 0.59, book: "bank" },
  { short: "CMBS office", delinquency: 11.91, chargeOff: null, book: "cmbs" },
  { short: "CMBS MF", delinquency: 7.69, chargeOff: null, book: "cmbs" },
  { short: "CMBS all", delinquency: 7.86, chargeOff: null, book: "cmbs" },
] as const;

export type ScoreboardRow = {
  signal: string;
  prior: string;
  neu: string;
  delta: string;
  lens: string;
};

export const SCOREBOARD: ScoreboardRow[] = [
  {
    signal: "CMBS overall delinquency",
    prior: "7.35% (Jun)",
    neu: "7.86%",
    delta: "+51 bp MoM",
    lens: "Trepp July delinq",
  },
  {
    signal: "CMBS special servicing",
    prior: "11.20% (Jun)",
    neu: "11.09%",
    delta: "−11 bp MoM",
    lens: "Trepp July SS",
  },
  {
    signal: "Office special servicing",
    prior: "17.11%",
    neu: "16.58%",
    delta: "−53 bp MoM",
    lens: "Trepp July SS",
  },
  {
    signal: "Retail special servicing",
    prior: "12.95%",
    neu: "13.28%",
    delta: "+33 bp MoM",
    lens: "Mall maturity SS",
  },
  {
    signal: "Hard-maturity cohort",
    prior: "$2.55B (Jul)",
    neu: "$5.49B (Aug)",
    delta: "~2.2×",
    lens: "Trepp Aug maturities",
  },
  {
    signal: "Debt yield <8% in cohort",
    prior: "—",
    neu: "$3.04B",
    delta: "55% of Aug cohort",
    lens: "Refinance friction",
  },
  {
    signal: "Debt yield <6% still current",
    prior: "—",
    neu: "$962M",
    delta: "Forward delinq risk",
    lens: "Trepp Aug maturities",
  },
  {
    signal: "Cohort non-performing",
    prior: "$34.9M",
    neu: "$136.6M",
    delta: "All office",
    lens: "Jul → Aug",
  },
  {
    signal: "Performing matured balloon rate",
    prior: "~9.53%",
    neu: "9.62%",
    delta: "+9 bp (gap compressed)",
    lens: "CREFC / Trepp",
  },
  {
    signal: "Card charge-offs / CRE delinq (Fed SA)",
    prior: "3.84% / 1.56%",
    neu: "3.84% / 1.56%",
    delta: "Same vintage",
    lens: "Carried 2026Q1",
  },
  {
    signal: "SLOOS NFNR net %",
    prior: "−11.3",
    neu: "−11.3",
    delta: "Same July survey",
    lens: "Carried from Q3 post",
  },
];

export function meterDeltasSorted(): (VintageMeter & { sortDelta: number })[] {
  return [...VINTAGE_METERS]
    .map((m) => ({ ...m, sortDelta: m.delta }))
    .sort((a, b) => a.sortDelta - b.sortDelta);
}

export function divergenceSorted() {
  return [...DIVERGENCE].sort((a, b) => a.ssMomBp - b.ssMomBp);
}

export function fmtPct(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 2): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtBp(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n} bp`;
}

export function fmtBn(n: number, digits = 2): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtMn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}M`;
}
