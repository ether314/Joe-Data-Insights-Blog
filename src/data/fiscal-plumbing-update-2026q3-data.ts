/**
 * Fiscal plumbing — 2026Q3 vintage update vs Aug update-2026.
 * Core question: What changed in the newest official vintage versus
 * fiscal-plumbing-update-2026? (budget lines, trust funds, off-balance vehicles)
 *
 * Prior vintage (update-2026 newest): JCT FY2027 path $2.42T / OASDI ~2033 /
 * HI ~2035 / GSE MBS ~$8.1T / net interest ~$1.05T
 * Newest Q3 print: CRFB/JCT fall refresh $2.51T / Trustees clocks carried /
 * GSE MBS ~$8.35T / CBO late-summer net interest ~$1.12T / Direct Loans ~$1.70T
 */

export type Confidence = "disclosed" | "estimated" | "carried";
export type LayerId = "tax-code" | "trust" | "off-balance" | "interest" | "discretionary";

export const PRIOR_PATH = "/blog/fiscal-plumbing-update-2026";
export const RESEARCH_PATH = "/blog/fiscal-plumbing-research-2026";
export const TAX_CATALOG_PATH = "/blog/us-tax-expenditure-catalog-2026";
export const SS_PATH = "/blog/us-social-security-trust-fund-depletion-path-2026";

export const SOURCE_NOTE =
  "Vintage delta: prior Aug update-2026 newest prints (JCT FY2027 path $2.42T, 2026 Trustees OASDI/HI clocks, mid-2026 FHFA GSE MBS, CBO net-interest framing) vs late-summer / early-fall 2026 official refresh — CRFB/JCT fall tax-expenditure restatement, CBO late-summer baseline net-interest path, FHFA GSE MBS outstanding (late-Q3 round), ED Direct Loan portfolio, FDIC insured-deposit stock. Trust-fund depletion years are carried from the 2026 Trustees Reports (no mid-year restatement). Tax-expenditure lines interact — do not sum as a joint repeal score. Off-balance stocks are outstanding/exposure, not annual outlays.";

export const SOURCES = [
  "Joint Committee on Taxation tax expenditure estimates (FY2027–28 path), as summarized in CRFB fall-2026 refresh",
  "CRFB / prior update-2026 baseline — JCT aggregate $2.42T, ESI $255B, pensions $378B",
  "SSA Trustees Report 2026 — OASI / DI / OASDI combined depletion years (carried; no mid-year restatement)",
  "Medicare Trustees Report 2026 — HI (Part A) depletion year (carried); SMI premium-financed framing",
  "FHFA — Fannie/Freddie guaranteed MBS outstanding (late-Q3 2026 round)",
  "U.S. Department of Education — Federal Direct Student Loan portfolio outstanding",
  "CBO — late-summer 2026 baseline net interest / unified budget yardsticks",
  "FDIC — insured-deposit stock (systemic backstop scale)",
];

/** Headline deltas vs prior Aug update-2026 vintage */
export const HEADLINE = {
  jctPriorTn: 2.42,
  jctNewTn: 2.51,
  jctDeltaTn: 0.09,
  jctDeltaPct: 3.7,
  jctTop10PriorBn: 1518,
  jctTop10NewBn: 1586,
  jctTop10DeltaBn: 68,
  esiPriorJctBn: 255,
  esiNewJctBn: 268,
  esiDeltaBn: 13,
  pensionsPriorBn: 378,
  pensionsNewBn: 396,
  pensionsDeltaBn: 18,
  oasdiPriorYear: 2033,
  oasdiNewYear: 2033,
  oasdiDeltaYears: 0,
  hiPriorYear: 2035,
  hiNewYear: 2035,
  hiDeltaYears: 0,
  gsePriorTn: 8.1,
  gseNewTn: 8.35,
  gseDeltaTn: 0.25,
  gseDeltaPct: 3.1,
  studentPriorTn: 1.65,
  studentNewTn: 1.7,
  studentDeltaTn: 0.05,
  netInterestPriorBn: 1050,
  netInterestNewBn: 1120,
  netInterestDeltaBn: 70,
  discretionaryPriorBn: 1720,
  discretionaryNewBn: 1735,
  discretionaryDeltaBn: 15,
  offBalancePriorTn: 23.0,
  offBalanceNewTn: 23.55,
  scopeGapEsiPriorBn: 52,
  scopeGapEsiNewBn: 49,
  interestVsDiscRatioPrior: 0.61,
  interestVsDiscRatioNew: 0.65,
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
    prior: 2.42,
    newest: 2.51,
    unit: "tn",
    confidence: "disclosed",
    note: "FY2027 path → fall refresh",
  },
  {
    id: "pensions",
    label: "Pensions / retirement exclusion (JCT top line)",
    shortLabel: "Pensions",
    layer: "tax-code",
    prior: 378,
    newest: 396,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "esi",
    label: "Employer-sponsored health exclusion (JCT)",
    shortLabel: "ESI (JCT)",
    layer: "tax-code",
    prior: 255,
    newest: 268,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "cg-div",
    label: "CG + dividends preferential rates (JCT)",
    shortLabel: "CG + dividends",
    layer: "tax-code",
    prior: 268,
    newest: 281,
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
    prior: 2.55,
    newest: 2.48,
    unit: "tn",
    confidence: "estimated",
  },
  {
    id: "gse",
    label: "GSE guaranteed MBS outstanding",
    shortLabel: "GSE MBS",
    layer: "off-balance",
    prior: 8.1,
    newest: 8.35,
    unit: "tn",
    confidence: "disclosed",
  },
  {
    id: "student",
    label: "Federal Direct Student Loan portfolio",
    shortLabel: "Student loans",
    layer: "off-balance",
    prior: 1.65,
    newest: 1.7,
    unit: "tn",
    confidence: "disclosed",
  },
  {
    id: "net-interest",
    label: "Net interest (approx outlays)",
    shortLabel: "Net interest",
    layer: "interest",
    prior: 1050,
    newest: 1120,
    unit: "bn",
    confidence: "estimated",
  },
  {
    id: "discretionary",
    label: "All discretionary (approx)",
    shortLabel: "Discretionary",
    layer: "discretionary",
    prior: 1720,
    newest: 1735,
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

/** JCT top lines — Aug update vintage vs fall refresh */
export const JCT_LINE_DELTAS: TaxLineDelta[] = [
  { id: "pensions", shortLabel: "Pensions / retirement", family: "retirement", priorBn: 378, newBn: 396, confidence: "disclosed" },
  { id: "cg", shortLabel: "CG + dividends rates", family: "capital", priorBn: 268, newBn: 281, confidence: "disclosed" },
  { id: "esi", shortLabel: "Employer health", family: "health", priorBn: 255, newBn: 268, confidence: "disclosed" },
  { id: "ctc", shortLabel: "Child / dependent credits", family: "income-support", priorBn: 132, newBn: 138, confidence: "disclosed" },
  { id: "aca", shortLabel: "ACA subsidies", family: "health", priorBn: 112, newBn: 118, confidence: "disclosed" },
  { id: "charity", shortLabel: "Charitable deduction", family: "charity", priorBn: 81, newBn: 84, confidence: "estimated" },
  { id: "199a", shortLabel: "Pass-through (§199A)", family: "business", priorBn: 79, newBn: 83, confidence: "estimated" },
  { id: "stepup", shortLabel: "Step-up at death", family: "capital", priorBn: 77, newBn: 82, confidence: "estimated" },
  { id: "eitc", shortLabel: "EITC", family: "income-support", priorBn: 69, newBn: 71, confidence: "estimated" },
  { id: "salt", shortLabel: "SALT deduction", family: "other", priorBn: 67, newBn: 65, confidence: "disclosed" },
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
    priorReservesTn: 2.45,
    newReservesTn: 2.38,
    status: "exhausting",
    confidence: "carried",
  },
  {
    id: "di",
    shortLabel: "DI",
    label: "Disability Insurance",
    priorDepletion: 2097,
    newDepletion: 2097,
    priorReservesTn: 0.14,
    newReservesTn: 0.135,
    status: "solvent-long",
    confidence: "carried",
  },
  {
    id: "oasdi",
    shortLabel: "OASDI",
    label: "Social Security (combined)",
    priorDepletion: 2033,
    newDepletion: 2033,
    priorReservesTn: 2.55,
    newReservesTn: 2.48,
    status: "exhausting",
    confidence: "carried",
  },
  {
    id: "hi",
    shortLabel: "HI",
    label: "Medicare Hospital Insurance",
    priorDepletion: 2035,
    newDepletion: 2035,
    priorReservesTn: 0.2,
    newReservesTn: 0.19,
    status: "exhausting",
    confidence: "carried",
  },
  {
    id: "smi",
    shortLabel: "SMI",
    label: "Medicare SMI (B+D)",
    priorDepletion: null,
    newDepletion: null,
    priorReservesTn: 0.15,
    newReservesTn: 0.155,
    status: "premium-financed",
    confidence: "estimated",
  },
];

/** Dual-vintage depletion path — clocks carried; reserve draw continues */
export const DEPLETION_PATH = [
  { year: 2025, priorOasdi: 2.65, newOasdi: 2.62, priorHi: 0.22, newHi: 0.215 },
  { year: 2027, priorOasdi: 2.25, newOasdi: 2.18, priorHi: 0.18, newHi: 0.17 },
  { year: 2029, priorOasdi: 1.75, newOasdi: 1.65, priorHi: 0.14, newHi: 0.13 },
  { year: 2031, priorOasdi: 1.05, newOasdi: 0.95, priorHi: 0.09, newHi: 0.08 },
  { year: 2033, priorOasdi: 0.0, newOasdi: 0.0, priorHi: 0.04, newHi: 0.035 },
  { year: 2034, priorOasdi: 0.0, newOasdi: 0.0, priorHi: 0.02, newHi: 0.018 },
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
    priorTn: 8.1,
    newTn: 8.35,
    budgetVisibility: 18,
    policyLeverage: 90,
    confidence: "disclosed",
  },
  {
    id: "student-loans",
    shortLabel: "Student loans",
    label: "Federal Direct Student Loans",
    lever: "education-credit",
    priorTn: 1.65,
    newTn: 1.7,
    budgetVisibility: 42,
    policyLeverage: 72,
    confidence: "disclosed",
  },
  {
    id: "fdic",
    shortLabel: "FDIC DI",
    label: "FDIC-insured deposits",
    lever: "deposit-insurance",
    priorTn: 10.7,
    newTn: 10.85,
    budgetVisibility: 12,
    policyLeverage: 95,
    confidence: "estimated",
  },
  {
    id: "fha",
    shortLabel: "FHA/VA",
    label: "FHA + VA mortgage insurance",
    lever: "housing-credit",
    priorTn: 2.2,
    newTn: 2.28,
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
    newTn: 0.37,
    budgetVisibility: 22,
    policyLeverage: 55,
    confidence: "estimated",
  },
];

/** Layer composition — prior vs newest (editorial map, $B) */
export const LAYER_COMPOSITION = [
  { id: "tax-code", label: "Tax expenditures (JCT)", priorBn: 2420, newBn: 2510 },
  { id: "trust-mandatory", label: "SS + Medicare outlays", priorBn: 2320, newBn: 2410 },
  { id: "medicaid-other", label: "Medicaid + other health", priorBn: 690, newBn: 720 },
  { id: "net-interest", label: "Net interest", priorBn: 1050, newBn: 1120 },
  { id: "discretionary", label: "All discretionary", priorBn: 1720, newBn: 1735 },
];

/** Interest vs discretionary race — FY path (editorial, $B) */
export const INTEREST_VS_DISC_PATH = [
  { fy: "FY24", interestBn: 890, discBn: 1680 },
  { fy: "FY25", interestBn: 950, discBn: 1700 },
  { fy: "FY26", interestBn: 1050, discBn: 1720 },
  { fy: "FY27", interestBn: 1120, discBn: 1735 },
];

/** JCT aggregate waterfall contribution to +$90B */
export const JCT_WATERFALL = [
  { id: "prior", label: "Prior $2.42T", valueBn: 2420, type: "base" as const },
  { id: "pensions", label: "Pensions", valueBn: 18, type: "up" as const },
  { id: "esi", label: "ESI", valueBn: 13, type: "up" as const },
  { id: "cg", label: "CG + div", valueBn: 13, type: "up" as const },
  { id: "health-other", label: "ACA + other health", valueBn: 12, type: "up" as const },
  { id: "income", label: "CTC / EITC", valueBn: 8, type: "up" as const },
  { id: "salt", label: "SALT", valueBn: -2, type: "down" as const },
  { id: "residual", label: "Other / residual", valueBn: 28, type: "up" as const },
  { id: "newest", label: "Newest $2.51T", valueBn: 2510, type: "total" as const },
];

/** ESI packaging gap: Treasury vs JCT */
export const SCOPE_GAP = [
  { vintage: "Aug update (FY2027)", treasuryBn: 307, jctBn: 255, gapBn: 52 },
  { vintage: "Q3 fall refresh", treasuryBn: 317, jctBn: 268, gapBn: 49 },
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
