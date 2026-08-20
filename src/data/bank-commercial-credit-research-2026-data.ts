/**
 * Bank & commercial credit stress — where losses and past-dues show up on
 * loan books and CRE portfolios.
 *
 * Primary sources: Federal Reserve Charge-Off and Delinquency Rates (all banks, SA);
 * Fed SLOOS (net % of banks tightening); FDIC 2026 Risk Review (CRE PDNA by size,
 * concentration, CMBS property-type delinquencies).
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Federal Reserve Board Charge-Off and Delinquency Rates on Loans and Leases at Commercial Banks (all banks, seasonally adjusted; last update May 19, 2026). Net charge-offs = charge-offs minus recoveries, annualized % of average loans. Delinquencies = 30+ days past due still accruing + nonaccrual, % of end-of-period loans. CRE = construction + multifamily + nonfarm nonresidential, booked in domestic offices. FDIC 2026 Risk Review for CRE past-due-and-nonaccrual (PDNA) by bank-size cohort, median CRE/capital concentration, and Trepp-style CMBS delinquency by property type (Dec 2025). SLOOS net % of banks tightening standards for C&I and CRE (Board of Governors). Mid-path CMBS / size-cohort points between disclosed anchors may be linearly interpolated and are labeled estimated.";

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
] as const;

export const HEADLINE = {
  asOf: "2026 Q1",
  creDelinquencyPct: 1.56,
  creChargeOffPct: 0.17,
  cardsChargeOffPct: 3.84,
  cardsDelinquencyPct: 2.92,
  ciChargeOffPct: 0.59,
  ciDelinquencyPct: 1.34,
  totalChargeOffPct: 0.56,
  totalDelinquencyPct: 1.48,
  /** CRE delinq ÷ CRE charge-off — past-due stock vs realized loss */
  creDelinqToChargeMultiple: 9.2,
  cardsDelinqToChargeMultiple: 0.76,
  cmbsOfficeDelinqPct: 11.31,
  cmbsMultifamilyDelinqPct: 6.64,
  cmbsOverallDelinqPct: 7.3,
  fdicCrePdnaQ4_2025Pct: 1.45,
  largeBankCrePdnaMedianPct: 1.67,
  midBankCreConcentrationPct: 289,
  industryCreConcentrationMedianPct: 200,
  creLoanGrowth2025Pct: 3.1,
  adcLoanChange2025Pct: -5.8,
  sloosCreNetTightenPct: 12,
  sloosCiNetTightenPct: 8,
} as const;

/** Latest-quarter dual metric — where stress prints on the bank book */
export const LOAN_BOOK_STRESS: {
  category: string;
  short: string;
  delinquency: number;
  chargeOff: number;
  confidence: Confidence;
}[] = [
  {
    category: "Credit cards",
    short: "Cards",
    delinquency: 2.92,
    chargeOff: 3.84,
    confidence: "disclosed",
  },
  {
    category: "Other consumer",
    short: "Other cons.",
    delinquency: 2.28,
    chargeOff: 1.17,
    confidence: "disclosed",
  },
  {
    category: "Residential RE",
    short: "Resi",
    delinquency: 1.89,
    chargeOff: 0.0,
    confidence: "disclosed",
  },
  {
    category: "Commercial RE",
    short: "CRE",
    delinquency: 1.56,
    chargeOff: 0.17,
    confidence: "disclosed",
  },
  {
    category: "C&I loans",
    short: "C&I",
    delinquency: 1.34,
    chargeOff: 0.59,
    confidence: "disclosed",
  },
  {
    category: "Leases",
    short: "Leases",
    delinquency: 1.16,
    chargeOff: 0.37,
    confidence: "disclosed",
  },
  {
    category: "Agricultural",
    short: "Ag",
    delinquency: 1.12,
    chargeOff: 0.13,
    confidence: "disclosed",
  },
];

/** Quarterly CRE + cards + C&I paths (Fed SA) */
export const QUARTERLY_STRESS: {
  quarter: string;
  label: string;
  sortKey: number;
  creDelinq: number;
  creChargeOff: number;
  cardsDelinq: number;
  cardsChargeOff: number;
  ciDelinq: number;
  ciChargeOff: number;
  totalDelinq: number;
  totalChargeOff: number;
  confidence: Confidence;
}[] = [
  {
    quarter: "2019Q4",
    label: "19Q4",
    sortKey: 2019.75,
    creDelinq: 0.72,
    creChargeOff: 0.0,
    cardsDelinq: 2.62,
    cardsChargeOff: 3.77,
    ciDelinq: 1.15,
    ciChargeOff: 0.36,
    totalDelinq: 1.4,
    totalChargeOff: 0.49,
    confidence: "disclosed",
  },
  {
    quarter: "2021Q4",
    label: "21Q4",
    sortKey: 2021.75,
    creDelinq: 0.72,
    creChargeOff: 0.02,
    cardsDelinq: 1.61,
    cardsChargeOff: 1.63,
    ciDelinq: 1.02,
    ciChargeOff: 0.12,
    totalDelinq: 1.18,
    totalChargeOff: 0.19,
    confidence: "disclosed",
  },
  {
    quarter: "2022Q4",
    label: "22Q4",
    sortKey: 2022.75,
    creDelinq: 0.78,
    creChargeOff: 0.05,
    cardsDelinq: 2.27,
    cardsChargeOff: 2.5,
    ciDelinq: 1.01,
    ciChargeOff: 0.23,
    totalDelinq: 1.21,
    totalChargeOff: 0.33,
    confidence: "disclosed",
  },
  {
    quarter: "2023Q2",
    label: "23Q2",
    sortKey: 2023.25,
    creDelinq: 1.05,
    creChargeOff: 0.15,
    cardsDelinq: 2.77,
    cardsChargeOff: 3.26,
    ciDelinq: 1.12,
    ciChargeOff: 0.31,
    totalDelinq: 1.35,
    totalChargeOff: 0.46,
    confidence: "disclosed",
  },
  {
    quarter: "2023Q4",
    label: "23Q4",
    sortKey: 2023.75,
    creDelinq: 1.28,
    creChargeOff: 0.26,
    cardsDelinq: 3.09,
    cardsChargeOff: 4.17,
    ciDelinq: 1.22,
    ciChargeOff: 0.42,
    totalDelinq: 1.46,
    totalChargeOff: 0.6,
    confidence: "disclosed",
  },
  {
    quarter: "2024Q2",
    label: "24Q2",
    sortKey: 2024.25,
    creDelinq: 1.42,
    creChargeOff: 0.26,
    cardsDelinq: 3.22,
    cardsChargeOff: 4.59,
    ciDelinq: 1.14,
    ciChargeOff: 0.48,
    totalDelinq: 1.49,
    totalChargeOff: 0.66,
    confidence: "disclosed",
  },
  {
    quarter: "2024Q4",
    label: "24Q4",
    sortKey: 2024.75,
    creDelinq: 1.56,
    creChargeOff: 0.25,
    cardsDelinq: 3.08,
    cardsChargeOff: 4.56,
    ciDelinq: 1.27,
    ciChargeOff: 0.52,
    totalDelinq: 1.54,
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
    ciDelinq: 1.28,
    ciChargeOff: 0.58,
    totalDelinq: 1.52,
    totalChargeOff: 0.61,
    confidence: "disclosed",
  },
  {
    quarter: "2025Q4",
    label: "25Q4",
    sortKey: 2025.75,
    creDelinq: 1.58,
    creChargeOff: 0.14,
    cardsDelinq: 2.94,
    cardsChargeOff: 4.07,
    ciDelinq: 1.34,
    ciChargeOff: 0.56,
    totalDelinq: 1.48,
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
    ciDelinq: 1.34,
    ciChargeOff: 0.59,
    totalDelinq: 1.48,
    totalChargeOff: 0.56,
    confidence: "disclosed",
  },
];

/** FDIC-style median CRE PDNA by bank asset size (year-end anchors) */
export const CRE_PDNA_BY_SIZE: {
  year: number;
  label: string;
  gt100bn: number;
  bn10to100: number;
  bn1to10: number;
  lt1bn: number;
  confidence: Confidence;
}[] = [
  {
    year: 2022,
    label: "2022",
    gt100bn: 0.85,
    bn10to100: 0.55,
    bn1to10: 0.48,
    lt1bn: 0.52,
    confidence: "estimated",
  },
  {
    year: 2023,
    label: "2023",
    gt100bn: 1.35,
    bn10to100: 0.72,
    bn1to10: 0.62,
    lt1bn: 0.65,
    confidence: "estimated",
  },
  {
    year: 2024,
    label: "2024",
    gt100bn: 1.92,
    bn10to100: 0.95,
    bn1to10: 0.78,
    lt1bn: 0.8,
    confidence: "disclosed",
  },
  {
    year: 2025,
    label: "2025",
    gt100bn: 1.67,
    bn10to100: 0.88,
    bn1to10: 0.75,
    lt1bn: 0.78,
    confidence: "disclosed",
  },
];

/** Median CRE loans / (T1 capital + ACL) % — FDIC 2026 Risk Review */
export const CRE_CONCENTRATION: {
  cohort: string;
  short: string;
  concentrationPct: number;
  confidence: Confidence;
}[] = [
  {
    cohort: "Industry median",
    short: "Industry",
    concentrationPct: 200,
    confidence: "disclosed",
  },
  {
    cohort: "$10B–$100B assets",
    short: "$10–100B",
    concentrationPct: 289,
    confidence: "disclosed",
  },
  {
    cohort: "$1B–$10B assets",
    short: "$1–10B",
    concentrationPct: 311,
    confidence: "disclosed",
  },
  {
    cohort: "> $100B assets",
    short: ">$100B",
    concentrationPct: 95,
    confidence: "estimated",
  },
  {
    cohort: "< $1B assets",
    short: "<$1B",
    concentrationPct: 175,
    confidence: "estimated",
  },
];

/** CMBS delinquency by property type (%), Trepp / FDIC Risk Review framing */
export const CMBS_PROPERTY_DELINQ: {
  year: number;
  label: string;
  office: number;
  multifamily: number;
  retail: number;
  industrial: number;
  hotel: number;
  overall: number;
  confidence: Confidence;
}[] = [
  {
    year: 2022,
    label: "2022",
    office: 2.8,
    multifamily: 1.9,
    retail: 5.4,
    industrial: 0.6,
    hotel: 3.2,
    overall: 2.9,
    confidence: "estimated",
  },
  {
    year: 2023,
    label: "2023",
    office: 6.1,
    multifamily: 2.8,
    retail: 6.2,
    industrial: 0.9,
    hotel: 4.1,
    overall: 4.5,
    confidence: "estimated",
  },
  {
    year: 2024,
    label: "2024",
    office: 11.01,
    multifamily: 4.58,
    retail: 6.8,
    industrial: 1.2,
    hotel: 5.0,
    overall: 6.57,
    confidence: "disclosed",
  },
  {
    year: 2025,
    label: "2025",
    office: 11.31,
    multifamily: 6.64,
    retail: 6.5,
    industrial: 1.4,
    hotel: 5.4,
    overall: 7.3,
    confidence: "disclosed",
  },
];

/** SLOOS net % of banks reporting tighter standards (positive = net tightening) */
export const SLOOS_TIGHTENING: {
  quarter: string;
  label: string;
  sortKey: number;
  ci: number;
  cre: number;
  confidence: Confidence;
}[] = [
  {
    quarter: "2022Q4",
    label: "22Q4",
    sortKey: 2022.75,
    ci: 45,
    cre: 52,
    confidence: "estimated",
  },
  {
    quarter: "2023Q2",
    label: "23Q2",
    sortKey: 2023.25,
    ci: 51,
    cre: 64,
    confidence: "estimated",
  },
  {
    quarter: "2023Q4",
    label: "23Q4",
    sortKey: 2023.75,
    ci: 34,
    cre: 48,
    confidence: "estimated",
  },
  {
    quarter: "2024Q2",
    label: "24Q2",
    sortKey: 2024.25,
    ci: 16,
    cre: 28,
    confidence: "estimated",
  },
  {
    quarter: "2024Q4",
    label: "24Q4",
    sortKey: 2024.75,
    ci: 12,
    cre: 22,
    confidence: "estimated",
  },
  {
    quarter: "2025Q2",
    label: "25Q2",
    sortKey: 2025.25,
    ci: 10,
    cre: 18,
    confidence: "estimated",
  },
  {
    quarter: "2025Q4",
    label: "25Q4",
    sortKey: 2025.75,
    ci: 9,
    cre: 15,
    confidence: "estimated",
  },
  {
    quarter: "2026Q1",
    label: "26Q1",
    sortKey: 2026.0,
    ci: 8,
    cre: 12,
    confidence: "estimated",
  },
];

/** Delinquency / charge-off multiples — lag proxy (latest) */
export const STRESS_MULTIPLES = LOAN_BOOK_STRESS.map((r) => ({
  category: r.category,
  short: r.short,
  multiple:
    r.chargeOff <= 0.005
      ? r.delinquency > 0
        ? 99
        : 0
      : Math.round((r.delinquency / r.chargeOff) * 10) / 10,
  delinquency: r.delinquency,
  chargeOff: r.chargeOff,
})).sort((a, b) => b.multiple - a.multiple);

export function fmtPct(n: number, digits = 2): string {
  if (Object.is(n, -0) || Math.abs(n) < 0.005) return "0.00%";
  return `${n.toFixed(digits)}%`;
}

export function fmtMultiple(n: number): string {
  if (n >= 99) return "∞";
  return `${n.toFixed(1)}×`;
}

export function fmtPp(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}
