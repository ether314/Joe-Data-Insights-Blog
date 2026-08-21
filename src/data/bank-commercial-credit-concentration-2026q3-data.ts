/**
 * Bank & commercial credit — Q3 2026 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (Where is stress showing up on bank loan books and CRE portfolios?)
 *
 * Q3 vintage complements concentration-2026 by adding (1) HHI across deposit /
 * CRE-stress / charge-off / CMBS lenses, (2) a deposit Lorenz curve, (3) July
 * SLOOS net-easing asymmetry as a *supply* concentration overlay, and (4) Trepp
 * July MoM deltas that reweight CMBS stress shares — while keeping top-1 /
 * top-3 deposit anchors and CRE cohort capital vs PDNA dollar splits.
 *
 * Primary sources (latest published / carried vintages as of Aug 2026):
 * - FDIC Quarterly Banking Profile / Summary of Deposits — domestic deposit ranks
 * - Fed H.8 / Call Report aggregates — large-bank asset share framing
 * - FDIC 2026 Risk Review — CRE/capital medians by size; CRE PDNA by cohort
 * - Fed Charge-Off and Delinquency Rates (SA) through 2026Q1
 * - July 2026 SLOOS (published Aug 3) — net % tightening / easing
 * - Trepp / CREFC CMBS delinquency (July 2026; MoM vs prior theme print)
 * - Theme baselines: concentration-2026 + update-2026q3 + research-2026
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Q3 concentration lens. Bank asset and domestic-deposit market shares follow FDIC QBP / Summary of Deposits and Call Report–style large-bank rankings through the latest 2025–2026 published window, rounded for viz; HHI values are analytical indexes on stated bucket shares (0–10,000). CRE loans / (Tier 1 capital + ACL) medians and CRE PDNA by asset-size cohort follow FDIC 2026 Risk Review (disclosed where labeled). Loan-book delinquency and charge-off rates are Fed SA through 2026Q1 (May 19, 2026 release). SLOOS net % = share tightening minus share easing from the July 2026 survey (period 2026:3). CMBS property-type delinquency follows Trepp July 2026; MoM deltas vs the Aug-update / prior concentration framing. Stress-share ladders that reallocate aggregate delinquency or CMBS balances across categories may be estimated to sum to 100% and are labeled accordingly.";

export const SOURCES = [
  {
    label: "FDIC — Quarterly Banking Profile",
    url: "https://www.fdic.gov/analysis/quarterly-banking-profile",
  },
  {
    label: "FDIC 2026 Risk Review",
    url: "https://www.fdic.gov/media/189821",
  },
  {
    label: "July 2026 SLOOS (Fed)",
    url: "https://www.federalreserve.gov/data/sloos/sloos-202607.htm",
  },
  {
    label: "Fed charge-off & delinquency rates (SA)",
    url: "https://www.federalreserve.gov/releases/Chargeoff/delallsa.htm",
  },
  {
    label: "Trepp — July 2026 CMBS delinquency",
    url: "https://www.trepp.com/trepptalk/cmbs-delinquency-report-july-2026",
  },
  {
    label: "Prior concentration print",
    url: "/blog/bank-commercial-credit-concentration-2026",
  },
  {
    label: "Q3 theme update",
    url: "/blog/bank-commercial-credit-update-2026q3",
  },
] as const;

export const PRIOR_CONCENTRATION_PATH =
  "/blog/bank-commercial-credit-concentration-2026";
export const PRIOR_RESEARCH_PATH = "/blog/bank-commercial-credit-research-2026";
export const PRIOR_Q3_PATH = "/blog/bank-commercial-credit-update-2026q3";
export const PRIOR_UPDATE_PATH = "/blog/bank-commercial-credit-update-202608";
export const PRIOR_CHARGEOFF_PATH = "/blog/bank-loan-chargeoffs-2026";
export const PRIOR_CRE_SIZE_PATH = "/blog/cre-bank-delinquency-size-split-2026";

export const HEADLINE = {
  asOfBanks: "FDIC QBP / SoD latest 2025–2026 window",
  asOfStress: "Fed SA 2026Q1 · Trepp July 2026 CMBS · July SLOOS",
  /** Domestic deposit / asset concentration — carried tip, Q3 context */
  top1BankSharePct: 12.8,
  top1BankLabel: "JPMorgan Chase",
  top3BankSharePct: 33.4,
  top4BankSharePct: 40.6,
  top10BankSharePct: 54.2,
  depositHhi: 680,
  assetHhi: 705,
  /** CRE capital concentration (median CRE / T1+ACL) */
  topCreCohortPct: 311,
  topCreCohortLabel: "$1B–$10B banks",
  midCreCohortPct: 289,
  industryCreMedianPct: 200,
  megaCreCohortPct: 95,
  /** Stress concentration */
  cardsChargeOffPct: 3.84,
  creDelinqPct: 1.56,
  creChargeOffPct: 0.17,
  creDelinqToChargeMultiple: 9.2,
  cmbsOverallDelinqPct: 7.86,
  cmbsOverallMomBp: 51,
  cmbsOfficeDelinqPct: 11.91,
  cmbsOfficeDeltaPp: 0.6,
  cmbsMfDelinqPct: 7.69,
  cmbsMfDeltaPp: 1.05,
  cmbsOfficeSsPct: 16.58,
  /** Large-bank CRE PDNA vs industry */
  largeBankCrePdnaPct: 1.67,
  industryCrePdnaPct: 1.45,
  largeBankCreStressSharePct: 48,
  officeCmbsStressSharePct: 42,
  /** Q3 SLOOS supply asymmetry (net %; negative = net easing) */
  sloosCreNfnrNet: -11.3,
  sloosCreMfNet: -5.7,
  sloosCreCldNet: -3.7,
  sloosCiLargeNet: 0.0,
  sloosCiSmallNet: 1.8,
  sloosCardsTightenNet: 6.7,
  /** Stress HHIs (analytical on share ladders) */
  creStressHhi: 3180,
  chargeOffHhi: 3420,
  cmbsStressHhi: 2680,
} as const;

export type BankShare = {
  id: string;
  label: string;
  short: string;
  assetSharePct: number;
  depositSharePct: number;
  rank: number;
  fill: string;
  confidence: Confidence;
};

/** Top domestic banks by share — rounded FDIC/Call-style ranks */
export const BANK_SHARES: BankShare[] = [
  {
    id: "jpm",
    label: "JPMorgan Chase",
    short: "JPM",
    assetSharePct: 13.2,
    depositSharePct: 12.8,
    rank: 1,
    fill: "#0ea5e9",
    confidence: "estimated",
  },
  {
    id: "bac",
    label: "Bank of America",
    short: "BAC",
    assetSharePct: 11.1,
    depositSharePct: 11.4,
    rank: 2,
    fill: "#8b5cf6",
    confidence: "estimated",
  },
  {
    id: "wfc",
    label: "Wells Fargo",
    short: "WFC",
    assetSharePct: 8.4,
    depositSharePct: 9.2,
    rank: 3,
    fill: "#14b8a6",
    confidence: "estimated",
  },
  {
    id: "c",
    label: "Citigroup",
    short: "C",
    assetSharePct: 7.6,
    depositSharePct: 7.2,
    rank: 4,
    fill: "#f59e0b",
    confidence: "estimated",
  },
  {
    id: "usb",
    label: "U.S. Bancorp",
    short: "USB",
    assetSharePct: 2.8,
    depositSharePct: 3.1,
    rank: 5,
    fill: "#64748b",
    confidence: "estimated",
  },
  {
    id: "pnc",
    label: "PNC",
    short: "PNC",
    assetSharePct: 2.4,
    depositSharePct: 2.6,
    rank: 6,
    fill: "#94a3b8",
    confidence: "estimated",
  },
  {
    id: "rest",
    label: "All other banks",
    short: "Rest",
    assetSharePct: 54.5,
    depositSharePct: 53.7,
    rank: 99,
    fill: "#cbd5e1",
    confidence: "estimated",
  },
];

export const BANK_CONCENTRATION_CURVE = [
  { n: 1, sharePct: 12.8, label: "Top 1" },
  { n: 3, sharePct: 33.4, label: "Top 3" },
  { n: 4, sharePct: 40.6, label: "Top 4" },
  { n: 10, sharePct: 54.2, label: "Top 10" },
  { n: 25, sharePct: 66.0, label: "Top 25" },
  { n: 100, sharePct: 78.5, label: "Top 100" },
] as const;

/** Lorenz-style cumulative deposit share vs equal-share diagonal */
export const DEPOSIT_LORENZ = [
  { popSharePct: 0, depositSharePct: 0, equalPct: 0 },
  { popSharePct: 14.3, depositSharePct: 12.8, equalPct: 14.3 },
  { popSharePct: 28.6, depositSharePct: 24.2, equalPct: 28.6 },
  { popSharePct: 42.9, depositSharePct: 33.4, equalPct: 42.9 },
  { popSharePct: 57.1, depositSharePct: 40.6, equalPct: 57.1 },
  { popSharePct: 71.4, depositSharePct: 43.7, equalPct: 71.4 },
  { popSharePct: 85.7, depositSharePct: 46.3, equalPct: 85.7 },
  { popSharePct: 100, depositSharePct: 100, equalPct: 100 },
] as const;

export type CreCohort = {
  id: string;
  cohort: string;
  short: string;
  creCapitalPct: number;
  crePdnaPct: number;
  creStockSharePct: number;
  creStressSharePct: number;
  confidence: Confidence;
};

export const CRE_COHORTS: CreCohort[] = [
  {
    id: "mega",
    cohort: "> $100B assets",
    short: ">$100B",
    creCapitalPct: 95,
    crePdnaPct: 1.67,
    creStockSharePct: 38,
    creStressSharePct: 48,
    confidence: "disclosed",
  },
  {
    id: "mid",
    cohort: "$10B–$100B assets",
    short: "$10–100B",
    creCapitalPct: 289,
    crePdnaPct: 0.88,
    creStockSharePct: 28,
    creStressSharePct: 24,
    confidence: "disclosed",
  },
  {
    id: "community",
    cohort: "$1B–$10B assets",
    short: "$1–10B",
    creCapitalPct: 311,
    crePdnaPct: 0.75,
    creStockSharePct: 22,
    creStressSharePct: 18,
    confidence: "disclosed",
  },
  {
    id: "small",
    cohort: "< $1B assets",
    short: "<$1B",
    creCapitalPct: 175,
    crePdnaPct: 0.78,
    creStockSharePct: 12,
    creStressSharePct: 10,
    confidence: "estimated",
  },
];

export type LoanStressShare = {
  id: string;
  category: string;
  short: string;
  delinquencyPct: number;
  chargeOffPct: number;
  delinqSharePct: number;
  chargeSharePct: number;
  confidence: Confidence;
};

export const LOAN_STRESS_SHARES: LoanStressShare[] = [
  {
    id: "cards",
    category: "Credit cards",
    short: "Cards",
    delinquencyPct: 2.92,
    chargeOffPct: 3.84,
    delinqSharePct: 22,
    chargeSharePct: 48,
    confidence: "estimated",
  },
  {
    id: "other-cons",
    category: "Other consumer",
    short: "Other cons.",
    delinquencyPct: 2.28,
    chargeOffPct: 1.17,
    delinqSharePct: 14,
    chargeSharePct: 12,
    confidence: "estimated",
  },
  {
    id: "resi",
    category: "Residential RE",
    short: "Resi",
    delinquencyPct: 1.89,
    chargeOffPct: 0.0,
    delinqSharePct: 28,
    chargeSharePct: 1,
    confidence: "estimated",
  },
  {
    id: "cre",
    category: "Commercial RE",
    short: "CRE",
    delinquencyPct: 1.56,
    chargeOffPct: 0.17,
    delinqSharePct: 18,
    chargeSharePct: 8,
    confidence: "estimated",
  },
  {
    id: "ci",
    category: "C&I loans",
    short: "C&I",
    delinquencyPct: 1.34,
    chargeOffPct: 0.59,
    delinqSharePct: 14,
    chargeSharePct: 26,
    confidence: "estimated",
  },
  {
    id: "other",
    category: "Leases & other",
    short: "Other",
    delinquencyPct: 1.14,
    chargeOffPct: 0.28,
    delinqSharePct: 4,
    chargeSharePct: 5,
    confidence: "estimated",
  },
];

export type CmbsProperty = {
  id: string;
  property: string;
  short: string;
  delinqPct: number;
  priorDelinqPct: number;
  deltaPp: number;
  specialServicingPct: number;
  stressSharePct: number;
  stockSharePct: number;
  fill: string;
  confidence: Confidence;
};

export const CMBS_PROPERTIES: CmbsProperty[] = [
  {
    id: "office",
    property: "Office",
    short: "Office",
    delinqPct: 11.91,
    priorDelinqPct: 11.31,
    deltaPp: 0.6,
    specialServicingPct: 16.58,
    stressSharePct: 42,
    stockSharePct: 28,
    fill: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "retail",
    property: "Retail",
    short: "Retail",
    delinqPct: 7.2,
    priorDelinqPct: 6.9,
    deltaPp: 0.3,
    specialServicingPct: 13.28,
    stressSharePct: 18,
    stockSharePct: 16,
    fill: "#f59e0b",
    confidence: "estimated",
  },
  {
    id: "multifamily",
    property: "Multifamily",
    short: "MF",
    delinqPct: 7.69,
    priorDelinqPct: 6.64,
    deltaPp: 1.05,
    specialServicingPct: 8.4,
    stressSharePct: 22,
    stockSharePct: 32,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    id: "hotel",
    property: "Hotel",
    short: "Hotel",
    delinqPct: 5.8,
    priorDelinqPct: 5.5,
    deltaPp: 0.3,
    specialServicingPct: 7.1,
    stressSharePct: 10,
    stockSharePct: 10,
    fill: "#0ea5e9",
    confidence: "estimated",
  },
  {
    id: "industrial",
    property: "Industrial",
    short: "Ind.",
    delinqPct: 1.6,
    priorDelinqPct: 1.5,
    deltaPp: 0.1,
    specialServicingPct: 2.2,
    stressSharePct: 4,
    stockSharePct: 10,
    fill: "#14b8a6",
    confidence: "estimated",
  },
  {
    id: "other",
    property: "Other / mixed",
    short: "Other",
    delinqPct: 4.2,
    priorDelinqPct: 4.0,
    deltaPp: 0.2,
    specialServicingPct: 5.5,
    stressSharePct: 4,
    stockSharePct: 4,
    fill: "#64748b",
    confidence: "estimated",
  },
];

export type LensCompare = {
  id: string;
  label: string;
  short: string;
  top1Pct: number;
  top3Pct: number;
  hhi: number;
  unit: string;
  fill: string;
};

export const LENS_COMPARE: LensCompare[] = [
  {
    id: "deposits",
    label: "Domestic deposits (top banks)",
    short: "Deposits",
    top1Pct: 12.8,
    top3Pct: 33.4,
    hhi: 680,
    unit: "bank share",
    fill: "#0ea5e9",
  },
  {
    id: "assets",
    label: "Bank assets (top banks)",
    short: "Assets",
    top1Pct: 13.2,
    top3Pct: 32.7,
    hhi: 705,
    unit: "bank share",
    fill: "#8b5cf6",
  },
  {
    id: "cre-capital",
    label: "CRE/capital (highest cohort)",
    short: "CRE/cap",
    top1Pct: 311,
    top3Pct: 289,
    hhi: 2650,
    unit: "median % of T1+ACL",
    fill: "#f59e0b",
  },
  {
    id: "chargeoffs",
    label: "Charge-off dollars (cards share)",
    short: "C/O $",
    top1Pct: 48,
    top3Pct: 86,
    hhi: 3420,
    unit: "stress share",
    fill: "#f43f5e",
  },
  {
    id: "cmbs-office",
    label: "CMBS delinquent $ (office share)",
    short: "Office $",
    top1Pct: 42,
    top3Pct: 82,
    hhi: 2680,
    unit: "stress share",
    fill: "#14b8a6",
  },
  {
    id: "cre-pdna",
    label: "CRE PDNA $ (>$100B share)",
    short: "CRE PDNA",
    top1Pct: 48,
    top3Pct: 72,
    hhi: 3180,
    unit: "stress share",
    fill: "#64748b",
  },
];

export type HhiLens = {
  id: string;
  label: string;
  short: string;
  hhi: number;
  top1Pct: number;
  fill: string;
};

export const HHI_LENSES: HhiLens[] = [
  {
    id: "deposits",
    label: "Deposit firm shares",
    short: "Deposits",
    hhi: 680,
    top1Pct: 12.8,
    fill: "#0ea5e9",
  },
  {
    id: "assets",
    label: "Asset firm shares",
    short: "Assets",
    hhi: 705,
    top1Pct: 13.2,
    fill: "#8b5cf6",
  },
  {
    id: "cre-stress",
    label: "CRE PDNA $ by size",
    short: "CRE PDNA",
    hhi: 3180,
    top1Pct: 48,
    fill: "#f59e0b",
  },
  {
    id: "chargeoffs",
    label: "Charge-off $ by product",
    short: "C/O $",
    hhi: 3420,
    top1Pct: 48,
    fill: "#f43f5e",
  },
  {
    id: "cmbs",
    label: "CMBS delinquent $ by type",
    short: "CMBS $",
    hhi: 2680,
    top1Pct: 42,
    fill: "#14b8a6",
  },
];

export type SloosRow = {
  id: string;
  label: string;
  short: string;
  netPct: number;
  priorEst: number;
  deltaVsPrior: number;
  fill: string;
};

/** July 2026 SLOOS — supply concentration / asymmetry overlay */
export const SLOOS_ROWS: SloosRow[] = [
  {
    id: "cre-nfnr",
    label: "CRE nonfarm nonresidential",
    short: "CRE NFNR",
    netPct: -11.3,
    priorEst: 12,
    deltaVsPrior: -23.3,
    fill: "#0ea5e9",
  },
  {
    id: "cre-mf",
    label: "CRE multifamily",
    short: "CRE MF",
    netPct: -5.7,
    priorEst: 8,
    deltaVsPrior: -13.7,
    fill: "#8b5cf6",
  },
  {
    id: "cre-cld",
    label: "CRE construction & land",
    short: "CRE C&L",
    netPct: -3.7,
    priorEst: 6,
    deltaVsPrior: -9.7,
    fill: "#14b8a6",
  },
  {
    id: "ci-large",
    label: "C&I large firms",
    short: "C&I lg",
    netPct: 0.0,
    priorEst: 5,
    deltaVsPrior: -5.0,
    fill: "#64748b",
  },
  {
    id: "ci-small",
    label: "C&I small firms",
    short: "C&I sm",
    netPct: 1.8,
    priorEst: 6,
    deltaVsPrior: -4.2,
    fill: "#94a3b8",
  },
  {
    id: "cards",
    label: "Credit cards",
    short: "Cards",
    netPct: 6.7,
    priorEst: 10,
    deltaVsPrior: -3.3,
    fill: "#f43f5e",
  },
];

export type VintageRestate = {
  id: string;
  label: string;
  prior: number;
  q3: number;
  unit: "pct" | "pp" | "hhi" | "netPct";
  note: string;
};

export const VINTAGE_RESTATE: VintageRestate[] = [
  {
    id: "top1-dep",
    label: "Top-1 deposit share",
    prior: 12.8,
    q3: 12.8,
    unit: "pct",
    note: "Carried firm tip",
  },
  {
    id: "top3-dep",
    label: "Top-3 deposit share",
    prior: 33.4,
    q3: 33.4,
    unit: "pct",
    note: "Carried firm tip",
  },
  {
    id: "cmbs-all",
    label: "CMBS overall delinq",
    prior: 7.35,
    q3: 7.86,
    unit: "pct",
    note: "+51 bp MoM (Trepp July)",
  },
  {
    id: "cmbs-office",
    label: "Office CMBS delinq",
    prior: 11.31,
    q3: 11.91,
    unit: "pct",
    note: "+0.6 pp vs prior print",
  },
  {
    id: "cmbs-mf",
    label: "MF CMBS delinq",
    prior: 6.64,
    q3: 7.69,
    unit: "pct",
    note: "+1.05 pp — fastest MoM",
  },
  {
    id: "sloos-nfnr",
    label: "SLOOS CRE NFNR net",
    prior: 12,
    q3: -11.3,
    unit: "netPct",
    note: "Flip to net easing",
  },
  {
    id: "office-stress-$",
    label: "Office share of CMBS delinq $",
    prior: 42,
    q3: 42,
    unit: "pct",
    note: "Share sticky; rate up",
  },
  {
    id: "cre-cap",
    label: "Peak CRE/capital cohort",
    prior: 311,
    q3: 311,
    unit: "pct",
    note: "$1–10B median carried",
  },
];

export type VintageCheck = {
  id: string;
  label: string;
  value: string;
  note: string;
};

export const VINTAGE_CHECKS: VintageCheck[] = [
  {
    id: "fed",
    label: "Fed SA close",
    value: "2026Q1",
    note: "Cards C/O 3.84% · CRE delinq 1.56%",
  },
  {
    id: "cmbs",
    label: "CMBS delinq",
    value: "7.86%",
    note: "Trepp July; +51 bp MoM",
  },
  {
    id: "sloos",
    label: "SLOOS CRE NFNR",
    value: "−11.3 net",
    note: "July survey; flip vs prior est.",
  },
  {
    id: "hhi",
    label: "Charge-off $ HHI",
    value: "3,420",
    note: "Cards ~48% of C/O dollars",
  },
];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtNum(n: number, digits = 0): string {
  return n.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function fmtNet(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}`;
}
