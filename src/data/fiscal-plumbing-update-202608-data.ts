/**
 * Fiscal plumbing — late-Aug 202608 vintage update vs Q3 refresh.
 * Core question: What changed in the newest official vintage versus
 * fiscal-plumbing-update-2026q3? (budget lines, trust funds, off-balance vehicles)
 *
 * Prior vintage (Q3 newest): JCT fall refresh $2.51T / OASDI~2033 / HI~2035 /
 * GSE MBS ~$8.35T / net interest ~$1.12T / Direct Loans ~$1.70T
 * Newest 202608 print: mid/late-Aug CBO+Treasury framing $1.18T interest /
 * CRFB/JCT late-summer restatement $2.57T / FHFA GSE MBS ~$8.55T /
 * ED Direct Loans ~$1.74T / Trustees clocks still carried
 */

export type Confidence = "disclosed" | "estimated" | "carried";
export type LayerId = "tax-code" | "trust" | "off-balance" | "interest" | "discretionary";

export const PRIOR_PATH = "/blog/fiscal-plumbing-update-2026q3";
export const AUG_PATH = "/blog/fiscal-plumbing-update-2026";
export const RESEARCH_PATH = "/blog/fiscal-plumbing-research-2026";
export const TAX_CATALOG_PATH = "/blog/us-tax-expenditure-catalog-2026";
export const SS_PATH = "/blog/us-social-security-trust-fund-depletion-path-2026";
export const INTEREST_PATH = "/blog/us-net-interest-vs-defense-2025";

export const SOURCE_NOTE =
  "Vintage delta: prior Q3 newest prints (CRFB/JCT fall aggregate $2.51T, carried 2026 Trustees OASDI/HI clocks, late-Q3 FHFA GSE MBS ~$8.35T, CBO late-summer net interest ~$1.12T) vs late-August 202608 official refresh — CBO/Treasury mid-cycle net-interest restatement, CRFB/JCT late-summer tax-expenditure path, FHFA GSE MBS outstanding (Aug round), ED Direct Loan portfolio, FDIC insured-deposit stock. Trust-fund depletion years remain carried from the 2026 Trustees Reports (no mid-year restatement). Tax-expenditure lines interact — do not sum as a joint repeal score. Off-balance stocks are outstanding/exposure, not annual outlays.";

export const SOURCES = [
  "Joint Committee on Taxation tax expenditure estimates (FY2027–28 path), as summarized in CRFB late-summer 2026 refresh",
  "CRFB / prior Q3 baseline — JCT aggregate $2.51T, ESI $268B, pensions $396B",
  "SSA Trustees Report 2026 — OASI / DI / OASDI combined depletion years (carried; no mid-year restatement)",
  "Medicare Trustees Report 2026 — HI (Part A) depletion year (carried); SMI premium-financed framing",
  "FHFA — Fannie/Freddie guaranteed MBS outstanding (late-Aug 2026 round)",
  "U.S. Department of Education — Federal Direct Student Loan portfolio outstanding",
  "CBO / Treasury — late-August 2026 baseline net interest / unified budget yardsticks",
  "FDIC — insured-deposit stock (systemic backstop scale)",
];

/** Headline deltas vs prior Q3 vintage */
export const HEADLINE = {
  jctPriorTn: 2.51,
  jctNewTn: 2.57,
  jctDeltaTn: 0.06,
  jctDeltaPct: 2.4,
  jctTop10PriorBn: 1586,
  jctTop10NewBn: 1634,
  jctTop10DeltaBn: 48,
  esiPriorJctBn: 268,
  esiNewJctBn: 276,
  esiDeltaBn: 8,
  pensionsPriorBn: 396,
  pensionsNewBn: 408,
  pensionsDeltaBn: 12,
  oasdiPriorYear: 2033,
  oasdiNewYear: 2033,
  oasdiDeltaYears: 0,
  hiPriorYear: 2035,
  hiNewYear: 2035,
  hiDeltaYears: 0,
  gsePriorTn: 8.35,
  gseNewTn: 8.55,
  gseDeltaTn: 0.2,
  gseDeltaPct: 2.4,
  studentPriorTn: 1.7,
  studentNewTn: 1.74,
  studentDeltaTn: 0.04,
  netInterestPriorBn: 1120,
  netInterestNewBn: 1180,
  netInterestDeltaBn: 60,
  discretionaryPriorBn: 1735,
  discretionaryNewBn: 1745,
  discretionaryDeltaBn: 10,
  offBalancePriorTn: 23.55,
  offBalanceNewTn: 24.0,
  scopeGapEsiPriorBn: 49,
  scopeGapEsiNewBn: 47,
  interestVsDiscRatioPrior: 0.65,
  interestVsDiscRatioNew: 0.68,
};

export type DeltaRow = {
  id: string;
  label: string;
  shortLabel: string;
  layer: LayerId;
  prior: number;
  newest: number;
  unit: "bn" | "tn" | "year";
  confidence: Confidence;
  note?: string;
};

/** Diverging vintage deltas — mix of $ and year units normalized in helpers */
export const VINTAGE_DELTAS: DeltaRow[] = [
  {
    id: "jct-agg",
    label: "JCT tax expenditures (aggregate)",
    shortLabel: "JCT tax-exp total",
    layer: "tax-code",
    prior: 2.51,
    newest: 2.57,
    unit: "tn",
    confidence: "disclosed",
    note: "Q3 fall refresh → late-Aug path",
  },
  {
    id: "pensions",
    label: "Pensions / retirement exclusion (JCT top line)",
    shortLabel: "Pensions",
    layer: "tax-code",
    prior: 396,
    newest: 408,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "esi",
    label: "Employer-sponsored health exclusion (JCT)",
    shortLabel: "ESI (JCT)",
    layer: "tax-code",
    prior: 268,
    newest: 276,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "cg-div",
    label: "CG + dividends preferential rates (JCT)",
    shortLabel: "CG + dividends",
    layer: "tax-code",
    prior: 281,
    newest: 290,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "oasdi-year",
    label: "OASDI combined depletion year",
    shortLabel: "OASDI year",
    layer: "trust",
    prior: 2033,
    newest: 2033,
    unit: "year",
    confidence: "carried",
    note: "2026 Trustees — no mid-year restatement",
  },
  {
    id: "hi-year",
    label: "Medicare HI depletion year",
    shortLabel: "HI year",
    layer: "trust",
    prior: 2035,
    newest: 2035,
    unit: "year",
    confidence: "carried",
  },
  {
    id: "oasdi-reserves",
    label: "OASDI combined reserves",
    shortLabel: "OASDI reserves",
    layer: "trust",
    prior: 2.48,
    newest: 2.42,
    unit: "tn",
    confidence: "estimated",
  },
  {
    id: "gse",
    label: "GSE guaranteed MBS outstanding",
    shortLabel: "GSE MBS",
    layer: "off-balance",
    prior: 8.35,
    newest: 8.55,
    unit: "tn",
    confidence: "disclosed",
  },
  {
    id: "student",
    label: "Federal Direct Student Loan portfolio",
    shortLabel: "Student loans",
    layer: "off-balance",
    prior: 1.7,
    newest: 1.74,
    unit: "tn",
    confidence: "disclosed",
  },
  {
    id: "net-interest",
    label: "Net interest (approx outlays)",
    shortLabel: "Net interest",
    layer: "interest",
    prior: 1120,
    newest: 1180,
    unit: "bn",
    confidence: "estimated",
  },
  {
    id: "discretionary",
    label: "All discretionary (approx)",
    shortLabel: "Discretionary",
    layer: "discretionary",
    prior: 1735,
    newest: 1745,
    unit: "bn",
    confidence: "estimated",
  },
];

export type TaxLineDelta = {
  id: string;
  shortLabel: string;
  family: string;
  priorBn: number;
  newBn: number;
  confidence: Confidence;
};

/** JCT top lines — Q3 vintage vs late-Aug refresh */
export const JCT_LINE_DELTAS: TaxLineDelta[] = [
  { id: "pensions", shortLabel: "Pensions / retirement", family: "retirement", priorBn: 396, newBn: 408, confidence: "disclosed" },
  { id: "cg", shortLabel: "CG + dividends rates", family: "capital", priorBn: 281, newBn: 290, confidence: "disclosed" },
  { id: "esi", shortLabel: "Employer health", family: "health", priorBn: 268, newBn: 276, confidence: "disclosed" },
  { id: "ctc", shortLabel: "Child / dependent credits", family: "income-support", priorBn: 138, newBn: 142, confidence: "disclosed" },
  { id: "aca", shortLabel: "ACA subsidies", family: "health", priorBn: 118, newBn: 122, confidence: "disclosed" },
  { id: "charity", shortLabel: "Charitable deduction", family: "charity", priorBn: 84, newBn: 86, confidence: "estimated" },
  { id: "199a", shortLabel: "Pass-through (§199A)", family: "business", priorBn: 83, newBn: 86, confidence: "estimated" },
  { id: "stepup", shortLabel: "Step-up at death", family: "capital", priorBn: 82, newBn: 85, confidence: "estimated" },
  { id: "eitc", shortLabel: "EITC", family: "income-support", priorBn: 71, newBn: 73, confidence: "estimated" },
  { id: "salt", shortLabel: "SALT deduction", family: "other", priorBn: 65, newBn: 66, confidence: "disclosed" },
];

export type TrustDelta = {
  id: string;
  shortLabel: string;
  label: string;
  priorDepletion: number | null;
  newDepletion: number | null;
  priorReservesTn: number;
  newReservesTn: number;
  status: "exhausting" | "solvent-long" | "premium-financed";
  confidence: Confidence;
};

export const TRUST_DELTAS: TrustDelta[] = [
  {
    id: "oasi",
    shortLabel: "OASI",
    label: "Old-Age & Survivors Insurance",
    priorDepletion: 2032,
    newDepletion: 2032,
    priorReservesTn: 2.38,
    newReservesTn: 2.32,
    status: "exhausting",
    confidence: "carried",
  },
  {
    id: "di",
    shortLabel: "DI",
    label: "Disability Insurance",
    priorDepletion: 2097,
    newDepletion: 2097,
    priorReservesTn: 0.135,
    newReservesTn: 0.13,
    status: "solvent-long",
    confidence: "carried",
  },
  {
    id: "oasdi",
    shortLabel: "OASDI",
    label: "Social Security (combined)",
    priorDepletion: 2033,
    newDepletion: 2033,
    priorReservesTn: 2.48,
    newReservesTn: 2.42,
    status: "exhausting",
    confidence: "carried",
  },
  {
    id: "hi",
    shortLabel: "HI",
    label: "Medicare Hospital Insurance",
    priorDepletion: 2035,
    newDepletion: 2035,
    priorReservesTn: 0.19,
    newReservesTn: 0.18,
    status: "exhausting",
    confidence: "carried",
  },
  {
    id: "smi",
    shortLabel: "SMI",
    label: "Medicare SMI (B+D)",
    priorDepletion: null,
    newDepletion: null,
    priorReservesTn: 0.155,
    newReservesTn: 0.158,
    status: "premium-financed",
    confidence: "estimated",
  },
];

/** Dual-vintage depletion path — clocks carried; reserve draw continues */
export const DEPLETION_PATH = [
  { year: 2025, priorOasdi: 2.62, newOasdi: 2.58, priorHi: 0.215, newHi: 0.21 },
  { year: 2027, priorOasdi: 2.18, newOasdi: 2.1, priorHi: 0.17, newHi: 0.16 },
  { year: 2029, priorOasdi: 1.65, newOasdi: 1.55, priorHi: 0.13, newHi: 0.12 },
  { year: 2031, priorOasdi: 0.95, newOasdi: 0.88, priorHi: 0.08, newHi: 0.07 },
  { year: 2033, priorOasdi: 0.0, newOasdi: 0.0, priorHi: 0.035, newHi: 0.03 },
  { year: 2034, priorOasdi: 0.0, newOasdi: 0.0, priorHi: 0.018, newHi: 0.015 },
  { year: 2035, priorOasdi: 0.0, newOasdi: 0.0, priorHi: 0.0, newHi: 0.0 },
];

export type OffBalanceDelta = {
  id: string;
  shortLabel: string;
  label: string;
  lever: string;
  priorTn: number;
  newTn: number;
  budgetVisibility: number;
  policyLeverage: number;
  confidence: Confidence;
};

export const OFF_BALANCE_DELTAS: OffBalanceDelta[] = [
  {
    id: "gse-mbs",
    shortLabel: "GSE MBS",
    label: "Fannie/Freddie guaranteed MBS",
    lever: "housing-credit",
    priorTn: 8.35,
    newTn: 8.55,
    budgetVisibility: 18,
    policyLeverage: 91,
    confidence: "disclosed",
  },
  {
    id: "student-loans",
    shortLabel: "Student loans",
    label: "Federal Direct Student Loans",
    lever: "education-credit",
    priorTn: 1.7,
    newTn: 1.74,
    budgetVisibility: 43,
    policyLeverage: 73,
    confidence: "disclosed",
  },
  {
    id: "fdic",
    shortLabel: "FDIC DI",
    label: "FDIC-insured deposits",
    lever: "deposit-insurance",
    priorTn: 10.85,
    newTn: 10.95,
    budgetVisibility: 12,
    policyLeverage: 95,
    confidence: "estimated",
  },
  {
    id: "fha",
    shortLabel: "FHA/VA",
    label: "FHA + VA mortgage insurance",
    lever: "housing-credit",
    priorTn: 2.28,
    newTn: 2.35,
    budgetVisibility: 28,
    policyLeverage: 71,
    confidence: "estimated",
  },
  {
    id: "pbgc",
    shortLabel: "PBGC",
    label: "PBGC insured pension risk",
    lever: "pension-guarantee",
    priorTn: 0.37,
    newTn: 0.41,
    budgetVisibility: 22,
    policyLeverage: 56,
    confidence: "estimated",
  },
];

/** Layer composition — prior vs newest (editorial map, $B) */
export const LAYER_COMPOSITION = [
  { id: "tax-code", label: "Tax expenditures (JCT)", priorBn: 2510, newBn: 2570 },
  { id: "trust-mandatory", label: "SS + Medicare outlays", priorBn: 2410, newBn: 2480 },
  { id: "medicaid-other", label: "Medicaid + other health", priorBn: 720, newBn: 745 },
  { id: "net-interest", label: "Net interest", priorBn: 1120, newBn: 1180 },
  { id: "discretionary", label: "All discretionary", priorBn: 1735, newBn: 1745 },
];

/** Interest vs discretionary race — FY path (editorial, $B) */
export const INTEREST_VS_DISC_PATH = [
  { fy: "FY24", interestBn: 890, discBn: 1680 },
  { fy: "FY25", interestBn: 950, discBn: 1700 },
  { fy: "FY26", interestBn: 1050, discBn: 1720 },
  { fy: "FY27 Q3", interestBn: 1120, discBn: 1735 },
  { fy: "FY27 Aug", interestBn: 1180, discBn: 1745 },
];

/** Share of dollar deltas across plumbing layers (for radial / share panels) */
export const DELTA_SHARE = [
  { id: "interest", label: "Net interest", deltaBn: 60, sharePct: 27 },
  { id: "tax-code", label: "JCT tax-exp", deltaBn: 60, sharePct: 27 },
  { id: "trust", label: "SS+Medicare outlays", deltaBn: 70, sharePct: 31 },
  { id: "medicaid", label: "Medicaid + other", deltaBn: 25, sharePct: 11 },
  { id: "disc", label: "Discretionary", deltaBn: 10, sharePct: 4 },
];

/** JCT aggregate waterfall contribution to +$60B */
export const JCT_WATERFALL = [
  { id: "prior", label: "Prior $2.51T", valueBn: 2510, type: "base" as const },
  { id: "pensions", label: "Pensions", valueBn: 12, type: "up" as const },
  { id: "esi", label: "ESI", valueBn: 8, type: "up" as const },
  { id: "cg", label: "CG + div", valueBn: 9, type: "up" as const },
  { id: "health-other", label: "ACA + other health", valueBn: 7, type: "up" as const },
  { id: "income", label: "CTC / EITC", valueBn: 6, type: "up" as const },
  { id: "salt", label: "SALT", valueBn: 1, type: "up" as const },
  { id: "residual", label: "Other / residual", valueBn: 17, type: "up" as const },
  { id: "newest", label: "Newest $2.57T", valueBn: 2570, type: "total" as const },
];

/** ESI packaging gap: Treasury vs JCT */
export const SCOPE_GAP = [
  { vintage: "Q3 fall refresh", treasuryBn: 317, jctBn: 268, gapBn: 49 },
  { vintage: "Late-Aug 202608", treasuryBn: 323, jctBn: 276, gapBn: 47 },
];

export const LAYER_COLORS: Record<LayerId, string> = {
  "tax-code": "#f59e0b",
  trust: "#0ea5e9",
  "off-balance": "#8b5cf6",
  interest: "#a78bfa",
  discretionary: "#64748b",
};

export const FAMILY_COLORS: Record<string, string> = {
  health: "#ef4444",
  retirement: "#0ea5e9",
  capital: "#8b5cf6",
  "income-support": "#14b8a6",
  housing: "#f59e0b",
  charity: "#ec4899",
  business: "#6366f1",
  other: "#64748b",
};

export function deltaSigned(row: DeltaRow): number {
  return row.newest - row.prior;
}

export function deltasFor(layer: LayerId | "All"): DeltaRow[] {
  const rows = layer === "All" ? VINTAGE_DELTAS : VINTAGE_DELTAS.filter((r) => r.layer === layer);
  return [...rows].sort((a, b) => Math.abs(deltaSigned(b)) - Math.abs(deltaSigned(a)));
}

export function jctLinesFor(family: string | "All"): TaxLineDelta[] {
  const rows = family === "All" ? JCT_LINE_DELTAS : JCT_LINE_DELTAS.filter((r) => r.family === family);
  return [...rows].sort((a, b) => b.newBn - a.newBn);
}

export function offBalanceSorted() {
  return [...OFF_BALANCE_DELTAS].sort((a, b) => b.newTn - a.newTn);
}

export function exhaustingTrusts() {
  return TRUST_DELTAS.filter((t) => t.status === "exhausting");
}

export function fmtBn(n: number) {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(2)}T`;
  return `$${n.toFixed(0)}B`;
}

export function fmtTn(n: number) {
  return `$${n.toFixed(2)}T`;
}

export function fmtDeltaBn(n: number) {
  const sign = n > 0 ? "+" : "";
  if (Math.abs(n) >= 1000) return `${sign}$${(n / 1000).toFixed(2)}T`;
  return `${sign}$${n.toFixed(0)}B`;
}

export function fmtYearDelta(n: number) {
  if (n === 0) return "unchanged (carried)";
  return n > 0 ? `+${n} yr` : `${n} yr`;
}
