/**
 * Bank & commercial credit — concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (Where is stress showing up on bank loan books and CRE portfolios?)
 *
 * Complements research roll-up and 2026 vintage updates (Fed SA charge-offs /
 * delinquencies, FDIC CRE PDNA by size, Trepp CMBS property stress, SLOOS)
 * with top-1 / top-3 / top-4 bank asset & deposit shares, CRE/capital cohort
 * concentration, and stress-share ladders across loan books and CMBS types.
 *
 * Primary sources (latest published / carried vintages as of Aug 2026):
 * - FDIC Quarterly Banking Profile / Summary of Deposits — domestic deposit ranks
 * - Fed H.8 / Call Report aggregates — large-bank asset share framing
 * - FDIC 2026 Risk Review — CRE/capital medians by size; CRE PDNA by cohort
 * - Fed Charge-Off and Delinquency Rates (SA) through 2026Q1
 * - Trepp / CREFC CMBS delinquency & special servicing (July–Aug 2026 window)
 * - Theme baselines: bank-commercial-credit-research-2026 + update-202608
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Bank asset and domestic-deposit market shares follow FDIC Quarterly Banking Profile / Summary of Deposits and Call Report–style large-bank rankings through the latest 2025–2026 published window, rounded for viz; treat firm ranks as order-of-magnitude concentration, not a live ticker tape. CRE loans / (Tier 1 capital + ACL) medians and CRE PDNA by asset-size cohort follow FDIC 2026 Risk Review (disclosed where labeled). Loan-book delinquency and charge-off rates are Fed SA through 2026Q1 (May 19, 2026 release). CMBS property-type delinquency and special-servicing rates follow Trepp / CREFC July–Aug 2026 prints carried from theme updates. Stress-share ladders that reallocate aggregate delinquency or CMBS balances across categories may be estimated to sum to 100% and are labeled accordingly.";

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
    label: "Fed charge-off & delinquency rates (SA)",
    url: "https://www.federalreserve.gov/releases/Chargeoff/delallsa.htm",
  },
  {
    label: "Trepp — July 2026 CMBS delinquency",
    url: "https://www.trepp.com/trepptalk/cmbs-delinquency-report-july-2026",
  },
  {
    label: "Theme research roll-up",
    url: "/blog/bank-commercial-credit-research-2026",
  },
  {
    label: "Aug 202608 vintage update",
    url: "/blog/bank-commercial-credit-update-202608",
  },
] as const;

export const PRIOR_RESEARCH_PATH = "/blog/bank-commercial-credit-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/bank-commercial-credit-update-202608";
export const PRIOR_Q3_PATH = "/blog/bank-commercial-credit-update-2026q3";
export const PRIOR_CHARGEOFF_PATH = "/blog/bank-loan-chargeoffs-2026";
export const PRIOR_CRE_SIZE_PATH = "/blog/cre-bank-delinquency-size-split-2026";

export const HEADLINE = {
  asOfBanks: "FDIC QBP / SoD latest 2025–2026 window",
  asOfStress: "Fed SA 2026Q1 · Trepp July–Aug 2026 CMBS",
  /** Domestic deposit / asset concentration */
  top1BankSharePct: 12.8,
  top1BankLabel: "JPMorgan Chase",
  top3BankSharePct: 33.4,
  top4BankSharePct: 40.6,
  top10BankSharePct: 54.2,
  bankHhiProxy: 680,
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
  cmbsOfficeDelinqPct: 11.91,
  cmbsOfficeSsPct: 16.58,
  /** Large-bank CRE PDNA vs industry */
  largeBankCrePdnaPct: 1.67,
  industryCrePdnaPct: 1.45,
  /** Share of CRE stress sitting in >$100B cohort (estimated stock share) */
  largeBankCreStressSharePct: 48,
  officeCmbsStressSharePct: 42,
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

export type CreCohort = {
  id: string;
  cohort: string;
  short: string;
  creCapitalPct: number;
  crePdnaPct: number;
  /** Estimated share of industry CRE loan dollars */
  creStockSharePct: number;
  /** Estimated share of CRE PDNA dollars */
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
  /** Estimated share of industry delinquency dollars */
  delinqSharePct: number;
  /** Estimated share of industry charge-off dollars */
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
  specialServicingPct: number;
  /** Estimated share of CMBS delinquent balance */
  stressSharePct: number;
  /** Estimated share of CMBS UPB */
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
  unit: string;
  fill: string;
};

/** Cross-lens top-1 / thick-top for scatter */
export const LENS_COMPARE: LensCompare[] = [
  {
    id: "deposits",
    label: "Domestic deposits (top banks)",
    short: "Deposits",
    top1Pct: 12.8,
    top3Pct: 33.4,
    unit: "bank share",
    fill: "#0ea5e9",
  },
  {
    id: "assets",
    label: "Bank assets (top banks)",
    short: "Assets",
    top1Pct: 13.2,
    top3Pct: 32.7,
    unit: "bank share",
    fill: "#8b5cf6",
  },
  {
    id: "cre-capital",
    label: "CRE/capital (highest cohort)",
    short: "CRE/cap",
    top1Pct: 311,
    top3Pct: 289,
    unit: "median % of T1+ACL",
    fill: "#f59e0b",
  },
  {
    id: "chargeoffs",
    label: "Charge-off dollars (cards share)",
    short: "C/O $",
    top1Pct: 48,
    top3Pct: 86,
    unit: "stress share",
    fill: "#f43f5e",
  },
  {
    id: "cmbs-office",
    label: "CMBS delinquent $ (office share)",
    short: "Office $",
    top1Pct: 42,
    top3Pct: 82,
    unit: "stress share",
    fill: "#14b8a6",
  },
  {
    id: "cre-pdna",
    label: "CRE PDNA $ (>$100B share)",
    short: "CRE PDNA",
    top1Pct: 48,
    top3Pct: 72,
    unit: "stress share",
    fill: "#64748b",
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
    note: "Trepp July; office 11.91%",
  },
  {
    id: "ss",
    label: "CMBS special servicing",
    value: "11.09%",
    note: "Office SS 16.58%",
  },
  {
    id: "cre-cap",
    label: "Peak CRE/capital cohort",
    value: "311%",
    note: "$1–10B median vs 200% industry",
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
