/**
 * Fiscal plumbing — Aug 202608 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (Which budget lines, trust funds, and off-balance vehicles move real levers?)
 *
 * Complements fiscal-plumbing-concentration-2026 (baseline),
 * fiscal-plumbing-concentration-2026q3 (fall / late-Q3 share geometry),
 * and fiscal-plumbing-update-202608 (dollar deltas) with a distribution cut on
 * the late-Aug official prints: Top-1 / Top-3 / HHI across tax expenditures,
 * trust-fund outlays, off-balance credit stocks, and the editorial plumbing-
 * layer map — plus a three-vintage slope (2026 → Q3 → Aug).
 *
 * Primary anchors (disclosed roundings; see SOURCE_NOTE):
 * - CRFB/JCT late-summer 202608 refresh (~$2.57T TE path) + top-10 line items
 * - SSA / Medicare Trustees 2026 (carried depletion years; rounded costs)
 * - FHFA / ED / FDIC late-Aug outstanding / exposure stocks
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Aug 202608 concentration lens on US fiscal plumbing after the CRFB/JCT late-summer restatement and late-Aug stock prints. Tax-expenditure totals and top-10 ranking: CRFB summary of JCT (~$2.57T path). Trust-fund outlays/reserves/depletion years: 2026 SSA and Medicare Trustees framing (carried clocks; rounded costs). Off-balance stocks: late-Aug public outstanding/exposure (FHFA GSE MBS, ED Direct Loans, FDIC insured deposits, FHA/VA, PBGC). Plumbing-layer pie is an editorial composition map of annual flows — not a single CBO table. Prior-print meters cite fiscal-plumbing-concentration-2026q3 (and the 2026 baseline on the vintage slope). Tax expenditures interact; do not sum line items as a joint repeal score. HHI values are analytical indexes on the stated bucket shares (0–10,000; TE HHI renormalizes the disclosed top-10).";

export const PRIOR_CONCENTRATION_PATH =
  "/blog/fiscal-plumbing-concentration-2026";
export const PRIOR_Q3_CONC_PATH =
  "/blog/fiscal-plumbing-concentration-2026q3";
export const PRIOR_RESEARCH_PATH = "/blog/fiscal-plumbing-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/fiscal-plumbing-update-2026";
export const PRIOR_Q3_PATH = "/blog/fiscal-plumbing-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/fiscal-plumbing-update-202608";
export const RELATED_SS_PATH =
  "/blog/us-social-security-trust-fund-depletion-path-2026";
export const RELATED_TE_PATH = "/blog/us-tax-expenditure-catalog-2026";

export const HEADLINE = {
  /** Top-1 tax expenditure as share of JCT late-summer 202608 aggregate */
  teTop1Pct: 15.9,
  teTop1Label: "Pensions / retirement exclusion",
  teTop1Bn: 408,
  teTop1PriorPct: 15.8,
  /** Top-3 tax expenditures as share of JCT late-summer aggregate */
  teTop3Pct: 37.8,
  teTop3Bn: 972,
  teTop3PriorPct: 37.6,
  teUniverseTn: 2.57,
  teUniversePriorTn: 2.51,
  teTop10Bn: 1634,
  teTop10ShareOfTotalPct: 63.6,
  teHhiOnTop10: 1470,
  teHhiPrior: 1475,
  /** Trust-fund outlay concentration (OASI+DI+HI+SMI; no OASDI double-count) */
  trustTop1Pct: 54.3,
  trustTop1Label: "OASI",
  trustTop1PriorPct: 54.3,
  trustTop3Pct: 94.0,
  trustTop3PriorPct: 94.0,
  trustOutlayBn: 2835,
  trustHhi: 3799,
  trustHhiPrior: 3797,
  /** Off-balance credit / guarantee stock concentration */
  offTop1Pct: 45.8,
  offTop1Label: "FDIC deposit insurance",
  offTop1PriorPct: 46.1,
  offTop3Pct: 91.1,
  offTop3PriorPct: 91.2,
  offStockTn: 24.0,
  offStockPriorTn: 23.55,
  offHhi: 3515,
  offHhiPrior: 3527,
  /** Editorial plumbing-layer annual-flow concentration */
  layerTop1Pct: 29.6,
  layerTop1Label: "Tax expenditures (JCT)",
  layerTop1PriorPct: 29.5,
  layerTop3Pct: 78.0,
  layerTop3PriorPct: 78.3,
  layerUniverseBn: 8675,
  layerHhi: 2331,
  layerHhiPrior: 2339,
  oasdiDepletionYear: 2033,
  hiDepletionYear: 2035,
  gseMbsTn: 8.55,
  netInterestBn: 1180,
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

/** JCT late-summer 202608 top-10 tax expenditures ranked; shares vs $2.57T aggregate. */
export const TE_SHARES: ShareRow[] = [
  {
    id: "pensions",
    label: "Exclusion for retirement savings and pension contributions",
    short: "Pensions",
    value: 408,
    unit: "bn",
    sharePct: 15.9,
    cumulativeSharePct: 15.9,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "cg-div",
    label: "Lower rates for dividends and long-term capital gains",
    short: "CG + dividends",
    value: 288,
    unit: "bn",
    sharePct: 11.2,
    cumulativeSharePct: 27.1,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    id: "esi",
    label: "Exclusion for employer-sponsored health insurance",
    short: "Employer health",
    value: 276,
    unit: "bn",
    sharePct: 10.7,
    cumulativeSharePct: 37.8,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    id: "ctc",
    label: "Child Tax Credit and credit for other dependents",
    short: "CTC / dependents",
    value: 141,
    unit: "bn",
    sharePct: 5.5,
    cumulativeSharePct: 43.3,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "aca",
    label: "ACA health insurance subsidies",
    short: "ACA subsidies",
    value: 121,
    unit: "bn",
    sharePct: 4.7,
    cumulativeSharePct: 48.0,
    confidence: "disclosed",
    fill: "#ef4444",
  },
  {
    id: "charity",
    label: "Charitable contributions deduction",
    short: "Charitable",
    value: 86,
    unit: "bn",
    sharePct: 3.3,
    cumulativeSharePct: 51.4,
    confidence: "estimated",
    fill: "#ec4899",
  },
  {
    id: "199a",
    label: "Pass-through business income deduction (§199A)",
    short: "Pass-through",
    value: 85,
    unit: "bn",
    sharePct: 3.3,
    cumulativeSharePct: 54.7,
    confidence: "estimated",
    fill: "#6366f1",
  },
  {
    id: "stepup",
    label: "Stepped-up basis for capital gains at death",
    short: "Step-up",
    value: 84,
    unit: "bn",
    sharePct: 3.3,
    cumulativeSharePct: 58.0,
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    id: "eitc",
    label: "Earned Income Tax Credit",
    short: "EITC",
    value: 73,
    unit: "bn",
    sharePct: 2.8,
    cumulativeSharePct: 60.8,
    confidence: "estimated",
    fill: "#10b981",
  },
  {
    id: "salt",
    label: "State and local tax deduction",
    short: "SALT",
    value: 72,
    unit: "bn",
    sharePct: 2.8,
    cumulativeSharePct: 63.6,
    confidence: "disclosed",
    fill: "#64748b",
  },
  {
    id: "rest-te",
    label: "All other tax expenditures (residual of JCT aggregate)",
    short: "Rest of TE",
    value: 936,
    unit: "bn",
    sharePct: 36.4,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#94a3b8",
    note: "Closes $2.57T after disclosed/estimated top-10; hundreds of smaller items",
  },
];

export const TE_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 15.9, equalPct: 9.1 },
  { rank: 2, label: "Top-2", sharePct: 27.1, equalPct: 18.2 },
  { rank: 3, label: "Top-3", sharePct: 37.8, equalPct: 27.3 },
  { rank: 5, label: "Top-5", sharePct: 48.0, equalPct: 45.5 },
  { rank: 10, label: "Top-10", sharePct: 63.6, equalPct: 90.9 },
  { rank: 11, label: "All", sharePct: 100, equalPct: 100 },
];

/** Trust-fund / dedicated-account annual cost (excludes OASDI combined). */
export const TRUST_SHARES: ShareRow[] = [
  {
    id: "oasi",
    label: "Old-Age & Survivors Insurance",
    short: "OASI",
    value: 1540,
    unit: "bn",
    sharePct: 54.3,
    cumulativeSharePct: 54.3,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Largest dedicated outlay spine; combined OASDI depletes ~2033",
  },
  {
    id: "smi",
    label: "Supplementary Medical Insurance (Parts B+D)",
    short: "SMI",
    value: 665,
    unit: "bn",
    sharePct: 23.5,
    cumulativeSharePct: 77.8,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Premium-financed; not on an exhaustion clock like HI",
  },
  {
    id: "hi",
    label: "Hospital Insurance (Part A)",
    short: "HI",
    value: 460,
    unit: "bn",
    sharePct: 16.2,
    cumulativeSharePct: 94.0,
    confidence: "estimated",
    fill: "#f43f5e",
    note: "Trustee depletion ~2035 (carried)",
  },
  {
    id: "di",
    label: "Disability Insurance",
    short: "DI",
    value: 170,
    unit: "bn",
    sharePct: 6.0,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#14b8a6",
  },
];

export const TRUST_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 54.3, equalPct: 25 },
  { rank: 2, label: "Top-2", sharePct: 77.8, equalPct: 50 },
  { rank: 3, label: "Top-3", sharePct: 94.0, equalPct: 75 },
  { rank: 4, label: "All", sharePct: 100, equalPct: 100 },
];

/** Off-balance / credit-guarantee outstanding stocks (late-Aug). */
export const OFF_BALANCE_SHARES: ShareRow[] = [
  {
    id: "fdic",
    label: "FDIC-insured deposits (systemic backstop stock)",
    short: "FDIC DI",
    value: 11.0,
    unit: "tn",
    sharePct: 45.8,
    cumulativeSharePct: 45.8,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "gse-mbs",
    label: "Fannie/Freddie guaranteed MBS outstanding",
    short: "GSE MBS",
    value: 8.55,
    unit: "tn",
    sharePct: 35.6,
    cumulativeSharePct: 81.5,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    id: "fha-va",
    label: "FHA + VA mortgage insurance exposure",
    short: "FHA/VA",
    value: 2.32,
    unit: "tn",
    sharePct: 9.7,
    cumulativeSharePct: 91.1,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "student",
    label: "Federal Direct Student Loan portfolio",
    short: "Student loans",
    value: 1.74,
    unit: "tn",
    sharePct: 7.3,
    cumulativeSharePct: 98.4,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "pbgc",
    label: "PBGC insured pension liabilities (risk stock)",
    short: "PBGC",
    value: 0.39,
    unit: "tn",
    sharePct: 1.6,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#64748b",
  },
];

export const OFF_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 45.8, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 81.5, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 91.1, equalPct: 60 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

/** Editorial annual-flow layers — where levers live, not a unified scorecard. */
export const LAYER_SHARES: ShareRow[] = [
  {
    id: "tax-code",
    label: "Tax expenditures (JCT late-summer refresh)",
    short: "Tax code",
    value: 2570,
    unit: "bn",
    sharePct: 29.6,
    cumulativeSharePct: 29.6,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    id: "trust-mandatory",
    label: "SS + Medicare outlays (approx)",
    short: "Trust / SS+Med",
    value: 2450,
    unit: "bn",
    sharePct: 28.2,
    cumulativeSharePct: 57.9,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "discretionary",
    label: "All discretionary (defense + nondefense)",
    short: "Discretionary",
    value: 1745,
    unit: "bn",
    sharePct: 20.1,
    cumulativeSharePct: 78.0,
    confidence: "estimated",
    fill: "#64748b",
  },
  {
    id: "net-interest",
    label: "Net interest",
    short: "Net interest",
    value: 1180,
    unit: "bn",
    sharePct: 13.6,
    cumulativeSharePct: 91.6,
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    id: "medicaid-other",
    label: "Medicaid + other health mandatory (federal share)",
    short: "Medicaid+",
    value: 730,
    unit: "bn",
    sharePct: 8.4,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#f43f5e",
  },
];

export const LAYER_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 29.6, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 57.9, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 78.0, equalPct: 60 },
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
    priorTop1Pct: HEADLINE.teTop1PriorPct,
    priorTop3Pct: HEADLINE.teTop3PriorPct,
    priorHhi: HEADLINE.teHhiPrior,
    top1Label: HEADLINE.teTop1Label,
    unitNote: "Share of JCT $2.57T late-summer refresh",
    fill: "#f59e0b",
  },
  {
    lens: "trust" as LensId,
    label: "Trust-fund outlays",
    top1Pct: HEADLINE.trustTop1Pct,
    top3Pct: HEADLINE.trustTop3Pct,
    hhi: HEADLINE.trustHhi,
    priorTop1Pct: HEADLINE.trustTop1PriorPct,
    priorTop3Pct: HEADLINE.trustTop3PriorPct,
    priorHhi: HEADLINE.trustHhiPrior,
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
    priorTop1Pct: HEADLINE.offTop1PriorPct,
    priorTop3Pct: HEADLINE.offTop3PriorPct,
    priorHhi: HEADLINE.offHhiPrior,
    top1Label: HEADLINE.offTop1Label,
    unitNote: "Share of ~$24.0T credit/guarantee stock",
    fill: "#8b5cf6",
  },
  {
    lens: "layers" as LensId,
    label: "Plumbing layers",
    top1Pct: HEADLINE.layerTop1Pct,
    top3Pct: HEADLINE.layerTop3Pct,
    hhi: HEADLINE.layerHhi,
    priorTop1Pct: HEADLINE.layerTop1PriorPct,
    priorTop3Pct: HEADLINE.layerTop3PriorPct,
    priorHhi: HEADLINE.layerHhiPrior,
    top1Label: HEADLINE.layerTop1Label,
    unitNote: "Share of editorial annual-flow map",
    fill: "#f43f5e",
  },
];

/** Vintage slope: 2026 concentration → Q3 → Aug 202608. */
export const VINTAGE_SLOPE = [
  {
    vintage: "2026 conc.",
    teTop1: 15.4,
    teTop3: 36.8,
    trustTop1: 54.5,
    offTop1: 47.0,
    layerTop1: 29.4,
  },
  {
    vintage: "Q3 2026",
    teTop1: 15.8,
    teTop3: 37.6,
    trustTop1: 54.3,
    offTop1: 46.1,
    layerTop1: 29.5,
  },
  {
    vintage: "Aug 202608",
    teTop1: 15.9,
    teTop3: 37.8,
    trustTop1: 54.3,
    offTop1: 45.8,
    layerTop1: 29.6,
  },
];

/** Trust-fund crossover: dedicated revenue vs cost (bn) + depletion year. */
export const TRUST_CROSSOVER = [
  {
    id: "oasi",
    short: "OASI",
    dedicatedRevBn: 1255,
    annualCostBn: 1540,
    gapBn: -285,
    reservesTn: 2.35,
    depletionYear: 2032,
    status: "exhausting" as const,
  },
  {
    id: "di",
    short: "DI",
    dedicatedRevBn: 178,
    annualCostBn: 170,
    gapBn: 8,
    reservesTn: 0.138,
    depletionYear: 2097,
    status: "solvent-long" as const,
  },
  {
    id: "hi",
    short: "HI",
    dedicatedRevBn: 420,
    annualCostBn: 460,
    gapBn: -40,
    reservesTn: 0.185,
    depletionYear: 2035,
    status: "exhausting" as const,
  },
  {
    id: "smi",
    short: "SMI",
    dedicatedRevBn: 665,
    annualCostBn: 665,
    gapBn: 0,
    reservesTn: 0.132,
    depletionYear: null as number | null,
    status: "premium-financed" as const,
  },
];

/** Visibility × leverage scatter for off-balance vehicles. */
export const LEVERAGE_SCATTER = [
  {
    id: "gse-mbs",
    short: "GSE MBS",
    stockTn: 8.55,
    budgetVisibility: 18,
    policyLeverage: 91,
    fill: "#8b5cf6",
  },
  {
    id: "student",
    short: "Student loans",
    stockTn: 1.74,
    budgetVisibility: 42,
    policyLeverage: 73,
    fill: "#14b8a6",
  },
  {
    id: "fdic",
    short: "FDIC DI",
    stockTn: 11.0,
    budgetVisibility: 12,
    policyLeverage: 95,
    fill: "#0ea5e9",
  },
  {
    id: "fha",
    short: "FHA/VA",
    stockTn: 2.32,
    budgetVisibility: 28,
    policyLeverage: 70,
    fill: "#f59e0b",
  },
  {
    id: "pbgc",
    short: "PBGC",
    stockTn: 0.39,
    budgetVisibility: 22,
    policyLeverage: 55,
    fill: "#64748b",
  },
];

/** TE family rollup inside disclosed top-10 (bn). */
export const TE_FAMILY_STACK = [
  { family: "Retirement", bn: 408, fill: "#0ea5e9" },
  { family: "Capital", bn: 288 + 84, fill: "#8b5cf6" },
  { family: "Health", bn: 276 + 121, fill: "#f43f5e" },
  { family: "Income support", bn: 141 + 73, fill: "#14b8a6" },
  { family: "Business / charity / other", bn: 85 + 86 + 72, fill: "#64748b" },
];

/** Prior (Q3) vs newest (Aug) Top-1 delta by lens (pp). */
export const TOP1_DELTA_BARS = [
  {
    lens: "Tax exp.",
    priorPct: HEADLINE.teTop1PriorPct,
    newestPct: HEADLINE.teTop1Pct,
    deltaPp: +(HEADLINE.teTop1Pct - HEADLINE.teTop1PriorPct).toFixed(1),
    fill: "#f59e0b",
  },
  {
    lens: "Trust",
    priorPct: HEADLINE.trustTop1PriorPct,
    newestPct: HEADLINE.trustTop1Pct,
    deltaPp: +(HEADLINE.trustTop1Pct - HEADLINE.trustTop1PriorPct).toFixed(1),
    fill: "#0ea5e9",
  },
  {
    lens: "Off-balance",
    priorPct: HEADLINE.offTop1PriorPct,
    newestPct: HEADLINE.offTop1Pct,
    deltaPp: +(HEADLINE.offTop1Pct - HEADLINE.offTop1PriorPct).toFixed(1),
    fill: "#8b5cf6",
  },
  {
    lens: "Layers",
    priorPct: HEADLINE.layerTop1PriorPct,
    newestPct: HEADLINE.layerTop1Pct,
    deltaPp: +(HEADLINE.layerTop1Pct - HEADLINE.layerTop1PriorPct).toFixed(1),
    fill: "#f43f5e",
  },
];

export const HHI_BANDS = [
  { band: "Unconcentrated", max: 1500, fill: "#94a3b8" },
  { band: "Moderate", max: 2500, fill: "#f59e0b" },
  { band: "High", max: 10000, fill: "#f43f5e" },
];

export const SOURCES = [
  "Joint Committee on Taxation tax expenditure estimates (late-summer 202608 refresh / FY2027–28 path), via CRFB",
  "CRFB — JCT aggregate restatement (~$2.57T) and top-line rankings",
  "Prior Q3 concentration print — fiscal-plumbing-concentration-2026q3 (JCT ~$2.51T meters)",
  "Baseline concentration print — fiscal-plumbing-concentration-2026 (JCT ~$2.3T meters)",
  "SSA / Medicare Trustees Reports 2026 (carried depletion years; rounded costs and reserves)",
  "FHFA / ED / FDIC late-Aug 2026 stock figures for GSE MBS, Direct Loans, insured deposits (rounded)",
  "CBO / Treasury late-August 2026 baseline — net interest framing (~$1.18T)",
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
  return `$${n.toFixed(2)}T`;
}

export function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number) {
  return n.toLocaleString("en-US");
}

export function fmtSignedPp(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} pp`;
}
