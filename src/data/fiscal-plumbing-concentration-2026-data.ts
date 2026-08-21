/**
 * Fiscal plumbing — concentration / market-share lens (2026).
 * Core question: How concentrated is this system at the top of the distribution?
 * (Which budget lines, trust funds, and off-balance vehicles move real levers?)
 *
 * Complements fiscal-plumbing-research-2026 (map of instruments) and the
 * update vintages (what moved) with a distribution cut: Top-1 / Top-3 / HHI
 * across tax expenditures, trust-fund outlays, off-balance credit stocks,
 * and the editorial plumbing-layer composition.
 *
 * Primary anchors (disclosed roundings; see SOURCE_NOTE):
 * - JCT FY2026 tax expenditures (~$2.3T) + top-10 line items via CRFB (Feb 2026)
 * - SSA / Medicare Trustees mid-2020s vintage (reserves, costs, depletion years)
 * - FHFA / ED / FDIC public outstanding / exposure stocks (GSE MBS, Direct Loans, DI)
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Concentration lens on US fiscal plumbing. Tax-expenditure totals and top-10 ranking: CRFB summary of JCT (Feb 2026). Trust-fund outlays/reserves/depletion years: mid-2020s SSA and Medicare Trustees framing (rounded). Off-balance stocks: public outstanding/exposure round numbers (FHFA GSE MBS, ED Direct Loans, FDIC insured deposits, FHA/VA, PBGC). Plumbing-layer pie is an editorial composition map of annual flows — not a single CBO table. Tax expenditures interact; do not sum line items as a joint repeal score. HHI values are analytical indexes on the stated bucket shares (0–10,000).";

export const PRIOR_RESEARCH_PATH = "/blog/fiscal-plumbing-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/fiscal-plumbing-update-2026";
export const PRIOR_Q3_PATH = "/blog/fiscal-plumbing-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/fiscal-plumbing-update-202608";
export const RELATED_SS_PATH = "/blog/us-social-security-trust-fund-depletion-2034";
export const RELATED_TE_PATH = "/blog/us-tax-expenditure-catalog-2026";

export const HEADLINE = {
  /** Top-1 tax expenditure as share of JCT FY2026 aggregate */
  teTop1Pct: 15.4,
  teTop1Label: "Pensions / retirement exclusion",
  teTop1Bn: 355,
  /** Top-3 tax expenditures as share of JCT FY2026 aggregate */
  teTop3Pct: 36.8,
  teTop3Bn: 847,
  teUniverseTn: 2.3,
  teTop10Bn: 1434,
  teTop10ShareOfTotalPct: 62.3,
  teHhiOnTop10: 1486,
  /** Trust-fund outlay concentration (OASI+DI+HI+SMI; no OASDI double-count) */
  trustTop1Pct: 54.5,
  trustTop1Label: "OASI",
  trustTop3Pct: 93.9,
  trustOutlayBn: 2660,
  trustHhi: 3812,
  /** Off-balance credit / guarantee stock concentration */
  offTop1Pct: 47.0,
  offTop1Label: "FDIC deposit insurance",
  offTop3Pct: 91.3,
  offStockTn: 22.35,
  offHhi: 3568,
  /** Editorial plumbing-layer annual-flow concentration */
  layerTop1Pct: 29.4,
  layerTop1Label: "Tax expenditures (JCT)",
  layerTop3Pct: 79.3,
  layerUniverseBn: 7820,
  layerHhi: 2284,
  oasdiDepletionYear: 2034,
  hiDepletionYear: 2036,
} as const;

export type ShareRow = {
  id: string;
  label: string;
  short: string;
  value: number;
  unit: "bn" | "tn";
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** JCT FY2026 top-10 tax expenditures ranked; shares vs $2.3T aggregate. */
export const TE_SHARES: ShareRow[] = [
  {
    id: "pensions",
    label: "Exclusion for retirement savings and pension contributions",
    short: "Pensions",
    value: 355,
    unit: "bn",
    sharePct: 15.4,
    cumulativeSharePct: 15.4,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "cg-div",
    label: "Lower rates for dividends and long-term capital gains",
    short: "CG + dividends",
    value: 252,
    unit: "bn",
    sharePct: 11.0,
    cumulativeSharePct: 26.4,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    id: "esi",
    label: "Exclusion for employer-sponsored health insurance",
    short: "Employer health",
    value: 240,
    unit: "bn",
    sharePct: 10.4,
    cumulativeSharePct: 36.8,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    id: "ctc",
    label: "Child Tax Credit and credit for other dependents",
    short: "CTC / dependents",
    value: 128,
    unit: "bn",
    sharePct: 5.6,
    cumulativeSharePct: 42.4,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "aca",
    label: "ACA health insurance subsidies",
    short: "ACA subsidies",
    value: 105,
    unit: "bn",
    sharePct: 4.6,
    cumulativeSharePct: 47.0,
    confidence: "disclosed",
    fill: "#ef4444",
  },
  {
    id: "charity",
    label: "Charitable contributions deduction",
    short: "Charitable",
    value: 78,
    unit: "bn",
    sharePct: 3.4,
    cumulativeSharePct: 50.4,
    confidence: "disclosed",
    fill: "#ec4899",
  },
  {
    id: "199a",
    label: "Pass-through business income deduction (§199A)",
    short: "Pass-through",
    value: 76,
    unit: "bn",
    sharePct: 3.3,
    cumulativeSharePct: 53.7,
    confidence: "disclosed",
    fill: "#6366f1",
  },
  {
    id: "stepup",
    label: "Stepped-up basis for capital gains at death",
    short: "Step-up",
    value: 73,
    unit: "bn",
    sharePct: 3.2,
    cumulativeSharePct: 56.9,
    confidence: "disclosed",
    fill: "#a78bfa",
  },
  {
    id: "eitc",
    label: "Earned Income Tax Credit",
    short: "EITC",
    value: 67,
    unit: "bn",
    sharePct: 2.9,
    cumulativeSharePct: 59.8,
    confidence: "disclosed",
    fill: "#10b981",
  },
  {
    id: "salt",
    label: "State and local tax deduction",
    short: "SALT",
    value: 60,
    unit: "bn",
    sharePct: 2.6,
    cumulativeSharePct: 62.3,
    confidence: "disclosed",
    fill: "#64748b",
  },
  {
    id: "rest-te",
    label: "All other tax expenditures (residual of JCT aggregate)",
    short: "Rest of TE",
    value: 866,
    unit: "bn",
    sharePct: 37.7,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#94a3b8",
    note: "Closes $2.3T after disclosed top-10; hundreds of smaller items",
  },
];

export const TE_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 15.4, equalPct: 9.1 },
  { rank: 2, label: "Top-2", sharePct: 26.4, equalPct: 18.2 },
  { rank: 3, label: "Top-3", sharePct: 36.8, equalPct: 27.3 },
  { rank: 5, label: "Top-5", sharePct: 47.0, equalPct: 45.5 },
  { rank: 10, label: "Top-10", sharePct: 62.3, equalPct: 90.9 },
  { rank: 11, label: "All", sharePct: 100, equalPct: 100 },
];

/** Trust-fund / dedicated-account annual cost (excludes OASDI combined to avoid double-count). */
export const TRUST_SHARES: ShareRow[] = [
  {
    id: "oasi",
    label: "Old-Age & Survivors Insurance",
    short: "OASI",
    value: 1450,
    unit: "bn",
    sharePct: 54.5,
    cumulativeSharePct: 54.5,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "Largest dedicated outlay spine; combined OASDI depletes ~2034",
  },
  {
    id: "smi",
    label: "Supplementary Medical Insurance (Parts B+D)",
    short: "SMI",
    value: 620,
    unit: "bn",
    sharePct: 23.3,
    cumulativeSharePct: 77.8,
    confidence: "disclosed",
    fill: "#f59e0b",
    note: "Premium-financed; not on an exhaustion clock like HI",
  },
  {
    id: "hi",
    label: "Hospital Insurance (Part A)",
    short: "HI",
    value: 430,
    unit: "bn",
    sharePct: 16.2,
    cumulativeSharePct: 94.0,
    confidence: "disclosed",
    fill: "#f43f5e",
    note: "Trustee depletion ~2036",
  },
  {
    id: "di",
    label: "Disability Insurance",
    short: "DI",
    value: 160,
    unit: "bn",
    sharePct: 6.0,
    cumulativeSharePct: 100,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
];

export const TRUST_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 54.5, equalPct: 25 },
  { rank: 2, label: "Top-2", sharePct: 77.8, equalPct: 50 },
  { rank: 3, label: "Top-3", sharePct: 94.0, equalPct: 75 },
  { rank: 4, label: "All", sharePct: 100, equalPct: 100 },
];

/** Off-balance / credit-guarantee outstanding stocks. */
export const OFF_BALANCE_SHARES: ShareRow[] = [
  {
    id: "fdic",
    label: "FDIC-insured deposits (systemic backstop stock)",
    short: "FDIC DI",
    value: 10.5,
    unit: "tn",
    sharePct: 47.0,
    cumulativeSharePct: 47.0,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "gse-mbs",
    label: "Fannie/Freddie guaranteed MBS outstanding",
    short: "GSE MBS",
    value: 7.8,
    unit: "tn",
    sharePct: 34.9,
    cumulativeSharePct: 81.9,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    id: "fha-va",
    label: "FHA + VA mortgage insurance exposure",
    short: "FHA/VA",
    value: 2.1,
    unit: "tn",
    sharePct: 9.4,
    cumulativeSharePct: 91.3,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "student",
    label: "Federal Direct Student Loan portfolio",
    short: "Student loans",
    value: 1.6,
    unit: "tn",
    sharePct: 7.2,
    cumulativeSharePct: 98.5,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "pbgc",
    label: "PBGC insured pension liabilities (risk stock)",
    short: "PBGC",
    value: 0.35,
    unit: "tn",
    sharePct: 1.5,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#64748b",
  },
];

export const OFF_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 47.0, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 81.9, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 91.3, equalPct: 60 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

/** Editorial annual-flow layers — where levers live, not a unified scorecard. */
export const LAYER_SHARES: ShareRow[] = [
  {
    id: "tax-code",
    label: "Tax expenditures (JCT FY2026)",
    short: "Tax code",
    value: 2300,
    unit: "bn",
    sharePct: 29.4,
    cumulativeSharePct: 29.4,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    id: "trust-mandatory",
    label: "SS + Medicare outlays (approx)",
    short: "Trust / SS+Med",
    value: 2200,
    unit: "bn",
    sharePct: 28.1,
    cumulativeSharePct: 57.5,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "discretionary",
    label: "All discretionary (defense + nondefense)",
    short: "Discretionary",
    value: 1700,
    unit: "bn",
    sharePct: 21.7,
    cumulativeSharePct: 79.3,
    confidence: "estimated",
    fill: "#64748b",
  },
  {
    id: "net-interest",
    label: "Net interest",
    short: "Net interest",
    value: 970,
    unit: "bn",
    sharePct: 12.4,
    cumulativeSharePct: 91.7,
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    id: "medicaid-other",
    label: "Medicaid + other health mandatory (federal share)",
    short: "Medicaid+",
    value: 650,
    unit: "bn",
    sharePct: 8.3,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#f43f5e",
  },
];

export const LAYER_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 29.4, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 57.5, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 79.3, equalPct: 60 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export type LensId = "tax-exp" | "trust" | "off-balance" | "layers";

export const LENS_COMPARE = [
  {
    lens: "tax-exp" as LensId,
    label: "Tax expenditures",
    top1Pct: HEADLINE.teTop1Pct,
    top3Pct: HEADLINE.teTop3Pct,
    hhi: HEADLINE.teHhiOnTop10,
    top1Label: HEADLINE.teTop1Label,
    unitNote: "Share of JCT $2.3T FY2026",
    fill: "#f59e0b",
  },
  {
    lens: "trust" as LensId,
    label: "Trust-fund outlays",
    top1Pct: HEADLINE.trustTop1Pct,
    top3Pct: HEADLINE.trustTop3Pct,
    hhi: HEADLINE.trustHhi,
    top1Label: HEADLINE.trustTop1Label,
    unitNote: "Share of OASI+DI+HI+SMI costs",
    fill: "#0ea5e9",
  },
  {
    lens: "off-balance" as LensId,
    label: "Off-balance stocks",
    top1Pct: HEADLINE.offTop1Pct,
    top3Pct: HEADLINE.offTop3Pct,
    hhi: HEADLINE.offHhi,
    top1Label: HEADLINE.offTop1Label,
    unitNote: "Share of ~$22T credit/guarantee stock",
    fill: "#8b5cf6",
  },
  {
    lens: "layers" as LensId,
    label: "Plumbing layers",
    top1Pct: HEADLINE.layerTop1Pct,
    top3Pct: HEADLINE.layerTop3Pct,
    hhi: HEADLINE.layerHhi,
    top1Label: HEADLINE.layerTop1Label,
    unitNote: "Share of editorial annual-flow map",
    fill: "#f43f5e",
  },
];

/** Trust-fund crossover: dedicated revenue vs cost (bn) + depletion year. */
export const TRUST_CROSSOVER = [
  {
    id: "oasi",
    short: "OASI",
    dedicatedRevBn: 1200,
    annualCostBn: 1450,
    gapBn: -250,
    reservesTn: 2.6,
    depletionYear: 2033,
    status: "exhausting" as const,
  },
  {
    id: "di",
    short: "DI",
    dedicatedRevBn: 170,
    annualCostBn: 160,
    gapBn: 10,
    reservesTn: 0.15,
    depletionYear: 2098,
    status: "solvent-long" as const,
  },
  {
    id: "hi",
    short: "HI",
    dedicatedRevBn: 400,
    annualCostBn: 430,
    gapBn: -30,
    reservesTn: 0.23,
    depletionYear: 2036,
    status: "exhausting" as const,
  },
  {
    id: "smi",
    short: "SMI",
    dedicatedRevBn: 620,
    annualCostBn: 620,
    gapBn: 0,
    reservesTn: 0.14,
    depletionYear: null as number | null,
    status: "premium-financed" as const,
  },
];

/** Visibility × leverage scatter for off-balance vehicles. */
export const LEVERAGE_SCATTER = [
  {
    id: "gse-mbs",
    short: "GSE MBS",
    stockTn: 7.8,
    budgetVisibility: 18,
    policyLeverage: 88,
    fill: "#8b5cf6",
  },
  {
    id: "student",
    short: "Student loans",
    stockTn: 1.6,
    budgetVisibility: 42,
    policyLeverage: 72,
    fill: "#14b8a6",
  },
  {
    id: "fdic",
    short: "FDIC DI",
    stockTn: 10.5,
    budgetVisibility: 12,
    policyLeverage: 95,
    fill: "#0ea5e9",
  },
  {
    id: "fha",
    short: "FHA/VA",
    stockTn: 2.1,
    budgetVisibility: 28,
    policyLeverage: 70,
    fill: "#f59e0b",
  },
  {
    id: "pbgc",
    short: "PBGC",
    stockTn: 0.35,
    budgetVisibility: 22,
    policyLeverage: 55,
    fill: "#64748b",
  },
];

/** TE family rollup inside disclosed top-10 (bn). */
export const TE_FAMILY_STACK = [
  { family: "Retirement", bn: 355, fill: "#0ea5e9" },
  { family: "Capital", bn: 252 + 73, fill: "#8b5cf6" },
  { family: "Health", bn: 240 + 105, fill: "#f43f5e" },
  { family: "Income support", bn: 128 + 67, fill: "#14b8a6" },
  { family: "Business / charity / other", bn: 76 + 78 + 60, fill: "#64748b" },
];

export const HHI_BANDS = [
  { band: "Unconcentrated", max: 1500, fill: "#94a3b8" },
  { band: "Moderate", max: 2500, fill: "#f59e0b" },
  { band: "High", max: 10000, fill: "#f43f5e" },
];

export const SOURCES = [
  "Joint Committee on Taxation tax expenditure estimates (FY2026), via CRFB (Feb 2026)",
  "CRFB — “JCT Projects Tax Expenditures Will Be $2.3T in 2026”",
  "U.S. Treasury — Tax Expenditures FAQ (FY2026 largest items)",
  "SSA / Medicare Trustees Reports (mid-2020s vintage; rounded reserves and depletion years)",
  "FHFA / ED / FDIC public stock figures for GSE MBS, Direct Loans, insured deposits (rounded)",
];

export function sharesForLens(lens: LensId): ShareRow[] {
  switch (lens) {
    case "tax-exp":
      return TE_SHARES;
    case "trust":
      return TRUST_SHARES;
    case "off-balance":
      return OFF_BALANCE_SHARES;
    case "layers":
      return LAYER_SHARES;
  }
}

export function curveForLens(lens: LensId) {
  switch (lens) {
    case "tax-exp":
      return TE_CONCENTRATION_CURVE;
    case "trust":
      return TRUST_CONCENTRATION_CURVE;
    case "off-balance":
      return OFF_CONCENTRATION_CURVE;
    case "layers":
      return LAYER_CONCENTRATION_CURVE;
  }
}

export function hhiBand(hhi: number): string {
  if (hhi < 1500) return "Unconcentrated";
  if (hhi < 2500) return "Moderate";
  return "High";
}

export function fmtBn(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}T`;
  return `$${n.toFixed(0)}B`;
}

export function fmtTn(n: number) {
  return `$${n.toFixed(1)}T`;
}

export function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number) {
  return n.toLocaleString("en-US");
}
