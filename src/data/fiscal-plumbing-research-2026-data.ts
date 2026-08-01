/**
 * US federal tax expenditures — Treasury FY2026 headline items vs JCT FY2026 ranking.
 * Sources disclosed in SOURCE_NOTE. Do not sum tax-expenditure line items.
 */

export type ScopeId = "jct" | "treasury";

export type TaxExpenditureRow = {
  id: string;
  label: string;
  shortLabel: string;
  fy2026Bn: number;
  scope: ScopeId;
  family:
    | "health"
    | "retirement"
    | "capital"
    | "income-support"
    | "housing"
    | "charity"
    | "business"
    | "other";
  disclosed: true;
};

/** JCT FY2026 largest tax expenditures (via CRFB summary of JCT, Feb 2026). */
export const JCT_TOP10: TaxExpenditureRow[] = [
  {
    id: "jct-pensions",
    label: "Exclusion for retirement savings and pension contributions",
    shortLabel: "Pensions / retirement",
    fy2026Bn: 355,
    scope: "jct",
    family: "retirement",
    disclosed: true,
  },
  {
    id: "jct-cg-div",
    label: "Lower rates for dividends and long-term capital gains",
    shortLabel: "CG + dividends rates",
    fy2026Bn: 252,
    scope: "jct",
    family: "capital",
    disclosed: true,
  },
  {
    id: "jct-esi",
    label: "Exclusion for employer-sponsored health insurance",
    shortLabel: "Employer health",
    fy2026Bn: 240,
    scope: "jct",
    family: "health",
    disclosed: true,
  },
  {
    id: "jct-ctc",
    label: "Child Tax Credit and credit for other dependents",
    shortLabel: "Child / dependent credits",
    fy2026Bn: 128,
    scope: "jct",
    family: "income-support",
    disclosed: true,
  },
  {
    id: "jct-aca",
    label: "ACA health insurance subsidies",
    shortLabel: "ACA subsidies",
    fy2026Bn: 105,
    scope: "jct",
    family: "health",
    disclosed: true,
  },
  {
    id: "jct-charity",
    label: "Charitable contributions deduction",
    shortLabel: "Charitable deduction",
    fy2026Bn: 78,
    scope: "jct",
    family: "charity",
    disclosed: true,
  },
  {
    id: "jct-199a",
    label: "Pass-through business income deduction",
    shortLabel: "Pass-through (§199A)",
    fy2026Bn: 76,
    scope: "jct",
    family: "business",
    disclosed: true,
  },
  {
    id: "jct-stepup",
    label: "Stepped-up basis for capital gains at death",
    shortLabel: "Step-up at death",
    fy2026Bn: 73,
    scope: "jct",
    family: "capital",
    disclosed: true,
  },
  {
    id: "jct-eitc",
    label: "Earned Income Tax Credit",
    shortLabel: "EITC",
    fy2026Bn: 67,
    scope: "jct",
    family: "income-support",
    disclosed: true,
  },
  {
    id: "jct-salt",
    label: "State and local tax deduction",
    shortLabel: "SALT deduction",
    fy2026Bn: 60,
    scope: "jct",
    family: "other",
    disclosed: true,
  },
];

/**
 * Treasury Office of Tax Analysis — published FY2026 FAQ “largest tax expenditures”
 * (partial list; not a full ranking). Values are Treasury’s own FY2026 estimates.
 */
export const TREASURY_HEADLINES: TaxExpenditureRow[] = [
  {
    id: "treas-esi",
    label: "Exclusion of employer contributions for medical insurance premiums and medical care",
    shortLabel: "Employer health (Treasury)",
    fy2026Bn: 296,
    scope: "treasury",
    family: "health",
    disclosed: true,
  },
  {
    id: "treas-imputed",
    label: "Exclusion of net imputed rental income",
    shortLabel: "Imputed rent",
    fy2026Bn: 157,
    scope: "treasury",
    family: "housing",
    disclosed: true,
  },
  {
    id: "treas-dc",
    label: "Defined contribution employer plans",
    shortLabel: "DC employer plans",
    fy2026Bn: 156,
    scope: "treasury",
    family: "retirement",
    disclosed: true,
  },
  {
    id: "treas-cg",
    label: "Capital gains (except agriculture, timber, iron ore, and coal)",
    shortLabel: "Capital gains (narrow)",
    fy2026Bn: 135,
    scope: "treasury",
    family: "capital",
    disclosed: true,
  },
];

/** Crosswalk rows where both scopes publish a related concept (different packaging). */
export const SCOPE_SLOPE = [
  {
    concept: "Employer health exclusion",
    treasuryBn: 296,
    jctBn: 240,
    note: "Treasury ESI exclusion vs JCT employer-sponsored health exclusion",
  },
  {
    concept: "Capital gains (narrow vs CG+dividends)",
    treasuryBn: 135,
    jctBn: 252,
    note: "Treasury narrow CG vs JCT preferential rates on CG + dividends",
  },
];

export const JCT_AGGREGATE = {
  fy2025Tn: 2.2,
  fy2026Tn: 2.3,
  fy2025_2029Tn: 11.7,
  top10ShareOfTotalApprox: 1434 / 2300,
};

/** Rough FY2026 budget yardsticks for scale (CBO/CRFB framing; labeled in UI). */
export const BUDGET_YARDSTICKS = [
  { id: "tax-exp-jct", label: "JCT tax expenditures (FY2026)", bn: 2300, kind: "tax-code" as const },
  { id: "ss", label: "Social Security (approx outlays)", bn: 1500, kind: "outlay" as const },
  { id: "discretionary", label: "All discretionary (approx)", bn: 1700, kind: "outlay" as const },
  { id: "medicare-medicaid", label: "Medicare + Medicaid (approx)", bn: 1600, kind: "outlay" as const },
];

export const FAMILY_COLORS: Record<TaxExpenditureRow["family"], string> = {
  health: "#ef4444",
  retirement: "#0ea5e9",
  capital: "#8b5cf6",
  "income-support": "#14b8a6",
  housing: "#f59e0b",
  charity: "#ec4899",
  business: "#6366f1",
  other: "#64748b",
};

export const HEADLINE = {
  jctFy2026Tn: JCT_AGGREGATE.fy2026Tn,
  jctTop10Bn: JCT_TOP10.reduce((s, r) => s + r.fy2026Bn, 0),
  treasuryEsiBn: 296,
  jctEsiBn: 240,
  scopeGapEsiBn: 296 - 240,
};

export const SOURCES = [
  "U.S. Treasury — Tax Expenditures FAQ (FY2026 largest items)",
  "Joint Committee on Taxation tax expenditure estimates (FY2026), as summarized by CRFB (Feb 2026)",
  "CRFB — “JCT Projects Tax Expenditures Will Be $2.3T in 2026”",
];

export const SOURCE_NOTE =
  "JCT aggregate and top-10 ranking: CRFB summary of JCT (Feb 2026). Treasury headline items: Treasury Tax Expenditures FAQ (FY2026 estimates). Tax expenditures interact — do not sum line items as a repeal score. Payroll-tax effects on ESI are excluded from these income-tax estimates.";

export function rankedJctTop10() {
  return [...JCT_TOP10].sort((a, b) => b.fy2026Bn - a.fy2026Bn);
}

export function rankedTreasuryHeadlines() {
  return [...TREASURY_HEADLINES].sort((a, b) => b.fy2026Bn - a.fy2026Bn);
}

export function familyShares(scope: ScopeId) {
  const rows = scope === "jct" ? JCT_TOP10 : TREASURY_HEADLINES;
  const total = rows.reduce((s, r) => s + r.fy2026Bn, 0);
  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(r.family, (map.get(r.family) || 0) + r.fy2026Bn);
  }
  return [...map.entries()]
    .map(([family, bn]) => ({
      family,
      bn,
      sharePct: total > 0 ? (bn / total) * 100 : 0,
    }))
    .sort((a, b) => b.bn - a.bn);
}

export function fmtBn(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}T`;
  return `$${n.toFixed(0)}B`;
}

export function fmtTn(n: number) {
  return `$${n.toFixed(1)}T`;
}
