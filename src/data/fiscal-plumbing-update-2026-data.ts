/**
 * Fiscal plumbing — Aug 2026 vintage update vs research map.
 * Core question: What changed in the newest official vintage versus
 * fiscal-plumbing-research-2026? (budget lines, trust funds, off-balance vehicles)
 *
 * Prior vintage: JCT FY2026 $2.3T / OASDI ~2034 / HI ~2036 / GSE MBS ~$7.8T
 * Newest print: JCT FY2027 $2.42T path / Trustees 2026 OASDI ~2033 / HI ~2035 /
 *               GSE MBS ~$8.1T / net interest ~$1.05T
 */

export type Confidence = "disclosed" | "estimated";
export type LayerId = "tax-code" | "trust" | "off-balance" | "interest" | "discretionary";

export const PRIOR_PATH = "/blog/fiscal-plumbing-research-2026";
export const TAX_CATALOG_PATH = "/blog/us-tax-expenditure-catalog-2026";
export const SS_PATH = "/blog/us-social-security-trust-fund-depletion-path-2026";

export const SOURCE_NOTE =
  "Vintage delta: prior research map (CRFB summary of JCT FY2026 + mid-2020s Trustees framing + rounded FHFA/ED/FDIC stocks) vs newest official prints — JCT FY2027 tax-expenditure path (CRFB/JCT summer 2026 refresh), 2026 SSA & Medicare Trustees Reports (depletion years), FHFA GSE MBS outstanding mid-2026, ED Direct Loan portfolio, CBO net-interest outlook. Tax-expenditure lines interact — do not sum as a joint repeal score. Off-balance stocks are outstanding/exposure, not annual outlays.";

export const SOURCES = [
  "Joint Committee on Taxation tax expenditure estimates (FY2027 path), as summarized in CRFB summer-2026 refresh",
  "CRFB — prior FY2026 JCT aggregate ($2.3T) used as baseline in fiscal-plumbing-research-2026",
  "SSA Trustees Report 2026 — OASI / DI / OASDI combined depletion years",
  "Medicare Trustees Report 2026 — HI (Part A) depletion year; SMI premium-financed framing",
  "FHFA — Fannie/Freddie guaranteed MBS outstanding (mid-2026 round)",
  "U.S. Department of Education — Federal Direct Student Loan portfolio outstanding",
  "CBO — net interest / unified budget yardsticks (FY2026–27 outlook)",
  "FDIC — insured-deposit stock (systemic backstop scale)",
];

/** Headline deltas vs prior research post */
export const HEADLINE = {
  jctPriorTn: 2.3,
  jctNewTn: 2.42,
  jctDeltaTn: 0.12,
  jctDeltaPct: 5.2,
  jctTop10PriorBn: 1434,
  jctTop10NewBn: 1518,
  jctTop10DeltaBn: 84,
  esiPriorJctBn: 240,
  esiNewJctBn: 255,
  esiDeltaBn: 15,
  pensionsPriorBn: 355,
  pensionsNewBn: 378,
  pensionsDeltaBn: 23,
  oasdiPriorYear: 2034,
  oasdiNewYear: 2033,
  oasdiDeltaYears: -1,
  hiPriorYear: 2036,
  hiNewYear: 2035,
  hiDeltaYears: -1,
  gsePriorTn: 7.8,
  gseNewTn: 8.1,
  gseDeltaTn: 0.3,
  gseDeltaPct: 3.8,
  studentPriorTn: 1.6,
  studentNewTn: 1.65,
  netInterestPriorBn: 970,
  netInterestNewBn: 1050,
  netInterestDeltaBn: 80,
  discretionaryPriorBn: 1700,
  discretionaryNewBn: 1720,
  offBalancePriorTn: 22.35,
  offBalanceNewTn: 23.0,
  scopeGapEsiPriorBn: 56,
  scopeGapEsiNewBn: 52,
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
    prior: 2.3,
    newest: 2.42,
    unit: "tn",
    confidence: "disclosed",
    note: "FY2026 → FY2027 path",
  },
  {
    id: "pensions",
    label: "Pensions / retirement exclusion (JCT top line)",
    shortLabel: "Pensions",
    layer: "tax-code",
    prior: 355,
    newest: 378,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "esi",
    label: "Employer-sponsored health exclusion (JCT)",
    shortLabel: "ESI (JCT)",
    layer: "tax-code",
    prior: 240,
    newest: 255,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "cg-div",
    label: "CG + dividends preferential rates (JCT)",
    shortLabel: "CG + dividends",
    layer: "tax-code",
    prior: 252,
    newest: 268,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "oasdi-year",
    label: "OASDI combined depletion year",
    shortLabel: "OASDI year",
    layer: "trust",
    prior: 2034,
    newest: 2033,
    unit: "year",
    confidence: "disclosed",
    note: "2026 Trustees vs mid-2020s framing",
  },
  {
    id: "hi-year",
    label: "Medicare HI depletion year",
    shortLabel: "HI year",
    layer: "trust",
    prior: 2036,
    newest: 2035,
    unit: "year",
    confidence: "disclosed",
  },
  {
    id: "oasdi-reserves",
    label: "OASDI combined reserves",
    shortLabel: "OASDI reserves",
    layer: "trust",
    prior: 2.7,
    newest: 2.55,
    unit: "tn",
    confidence: "estimated",
  },
  {
    id: "gse",
    label: "GSE guaranteed MBS outstanding",
    shortLabel: "GSE MBS",
    layer: "off-balance",
    prior: 7.8,
    newest: 8.1,
    unit: "tn",
    confidence: "disclosed",
  },
  {
    id: "student",
    label: "Federal Direct Student Loan portfolio",
    shortLabel: "Student loans",
    layer: "off-balance",
    prior: 1.6,
    newest: 1.65,
    unit: "tn",
    confidence: "disclosed",
  },
  {
    id: "net-interest",
    label: "Net interest (approx outlays)",
    shortLabel: "Net interest",
    layer: "interest",
    prior: 970,
    newest: 1050,
    unit: "bn",
    confidence: "estimated",
  },
  {
    id: "discretionary",
    label: "All discretionary (approx)",
    shortLabel: "Discretionary",
    layer: "discretionary",
    prior: 1700,
    newest: 1720,
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

/** JCT top lines — prior research vintage vs FY2027 path */
export const JCT_LINE_DELTAS: TaxLineDelta[] = [
  { id: "pensions", shortLabel: "Pensions / retirement", family: "retirement", priorBn: 355, newBn: 378, confidence: "disclosed" },
  { id: "cg", shortLabel: "CG + dividends rates", family: "capital", priorBn: 252, newBn: 268, confidence: "disclosed" },
  { id: "esi", shortLabel: "Employer health", family: "health", priorBn: 240, newBn: 255, confidence: "disclosed" },
  { id: "ctc", shortLabel: "Child / dependent credits", family: "income-support", priorBn: 128, newBn: 132, confidence: "disclosed" },
  { id: "aca", shortLabel: "ACA subsidies", family: "health", priorBn: 105, newBn: 112, confidence: "disclosed" },
  { id: "charity", shortLabel: "Charitable deduction", family: "charity", priorBn: 78, newBn: 81, confidence: "estimated" },
  { id: "199a", shortLabel: "Pass-through (§199A)", family: "business", priorBn: 76, newBn: 79, confidence: "estimated" },
  { id: "stepup", shortLabel: "Step-up at death", family: "capital", priorBn: 73, newBn: 77, confidence: "estimated" },
  { id: "eitc", shortLabel: "EITC", family: "income-support", priorBn: 67, newBn: 69, confidence: "estimated" },
  { id: "salt", shortLabel: "SALT deduction", family: "other", priorBn: 60, newBn: 67, confidence: "disclosed" },
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
};

export const TRUST_DELTAS: TrustDelta[] = [
  {
    id: "oasi",
    shortLabel: "OASI",
    label: "Old-Age & Survivors Insurance",
    priorDepletion: 2033,
    newDepletion: 2032,
    priorReservesTn: 2.6,
    newReservesTn: 2.45,
    status: "exhausting",
  },
  {
    id: "di",
    shortLabel: "DI",
    label: "Disability Insurance",
    priorDepletion: 2098,
    newDepletion: 2097,
    priorReservesTn: 0.15,
    newReservesTn: 0.14,
    status: "solvent-long",
  },
  {
    id: "oasdi",
    shortLabel: "OASDI",
    label: "Social Security (combined)",
    priorDepletion: 2034,
    newDepletion: 2033,
    priorReservesTn: 2.7,
    newReservesTn: 2.55,
    status: "exhausting",
  },
  {
    id: "hi",
    shortLabel: "HI",
    label: "Medicare Hospital Insurance",
    priorDepletion: 2036,
    newDepletion: 2035,
    priorReservesTn: 0.23,
    newReservesTn: 0.2,
    status: "exhausting",
  },
  {
    id: "smi",
    shortLabel: "SMI",
    label: "Medicare SMI (B+D)",
    priorDepletion: null,
    newDepletion: null,
    priorReservesTn: 0.14,
    newReservesTn: 0.15,
    status: "premium-financed",
  },
];

/** Dual-vintage depletion path (illustrative from Trustees clocks) */
export const DEPLETION_PATH = [
  { year: 2025, priorOasdi: 2.7, newOasdi: 2.65, priorHi: 0.23, newHi: 0.22 },
  { year: 2027, priorOasdi: 2.4, newOasdi: 2.25, priorHi: 0.2, newHi: 0.18 },
  { year: 2029, priorOasdi: 2.0, newOasdi: 1.75, priorHi: 0.16, newHi: 0.14 },
  { year: 2031, priorOasdi: 1.4, newOasdi: 1.05, priorHi: 0.11, newHi: 0.09 },
  { year: 2033, priorOasdi: 0.6, newOasdi: 0.0, priorHi: 0.06, newHi: 0.04 },
  { year: 2034, priorOasdi: 0.0, newOasdi: 0.0, priorHi: 0.04, newHi: 0.02 },
  { year: 2035, priorOasdi: 0.0, newOasdi: 0.0, priorHi: 0.02, newHi: 0.0 },
  { year: 2036, priorOasdi: 0.0, newOasdi: 0.0, priorHi: 0.0, newHi: 0.0 },
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
    priorTn: 7.8,
    newTn: 8.1,
    budgetVisibility: 18,
    policyLeverage: 90,
    confidence: "disclosed",
  },
  {
    id: "student-loans",
    shortLabel: "Student loans",
    label: "Federal Direct Student Loans",
    lever: "education-credit",
    priorTn: 1.6,
    newTn: 1.65,
    budgetVisibility: 42,
    policyLeverage: 72,
    confidence: "disclosed",
  },
  {
    id: "fdic",
    shortLabel: "FDIC DI",
    label: "FDIC-insured deposits",
    lever: "deposit-insurance",
    priorTn: 10.5,
    newTn: 10.7,
    budgetVisibility: 12,
    policyLeverage: 95,
    confidence: "estimated",
  },
  {
    id: "fha",
    shortLabel: "FHA/VA",
    label: "FHA + VA mortgage insurance",
    lever: "housing-credit",
    priorTn: 2.1,
    newTn: 2.2,
    budgetVisibility: 28,
    policyLeverage: 70,
    confidence: "estimated",
  },
  {
    id: "pbgc",
    shortLabel: "PBGC",
    label: "PBGC insured pension risk",
    lever: "pension-guarantee",
    priorTn: 0.35,
    newTn: 0.35,
    budgetVisibility: 22,
    policyLeverage: 55,
    confidence: "estimated",
  },
];

/** Layer composition — prior vs newest (editorial map, $B) */
export const LAYER_COMPOSITION = [
  { id: "tax-code", label: "Tax expenditures (JCT)", priorBn: 2300, newBn: 2420 },
  { id: "trust-mandatory", label: "SS + Medicare outlays", priorBn: 2200, newBn: 2320 },
  { id: "medicaid-other", label: "Medicaid + other health", priorBn: 650, newBn: 690 },
  { id: "net-interest", label: "Net interest", priorBn: 970, newBn: 1050 },
  { id: "discretionary", label: "All discretionary", priorBn: 1700, newBn: 1720 },
];

/** ESI packaging gap: Treasury vs JCT */
export const SCOPE_GAP = [
  { vintage: "Prior (FY2026)", treasuryBn: 296, jctBn: 240, gapBn: 56 },
  { vintage: "Newest (FY2027)", treasuryBn: 307, jctBn: 255, gapBn: 52 },
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
  if (n === 0) return "unchanged";
  return n > 0 ? `+${n} yr` : `${n} yr`;
}
