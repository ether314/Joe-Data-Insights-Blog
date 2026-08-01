/**
 * US federal tax expenditure catalog — JCT FY2026 aggregates + Treasury headline items.
 * Focus: size vs GDP and instrument mix (exclusions, credits, preferential rates, deductions).
 * Do not sum line items as a repeal score — interactions matter.
 */

export type Instrument =
  | "exclusion"
  | "credit"
  | "preferential_rate"
  | "deduction"
  | "deferral";

export type Confidence = "disclosed" | "estimated";

export type CatalogItem = {
  id: string;
  label: string;
  shortLabel: string;
  fy2026Bn: number;
  instrument: Instrument;
  family: string;
  refundable: boolean;
  source: "jct" | "treasury";
  confidence: Confidence;
};

export type GdpSharePoint = {
  year: number;
  pctGdp: number;
  totalTn: number | null;
  confidence: Confidence;
  note?: string;
};

export type InstrumentMixPoint = {
  year: number;
  exclusionPct: number;
  creditPct: number;
  preferentialPct: number;
  deductionPct: number;
  otherPct: number;
  confidence: Confidence;
};

export type BudgetYardstick = {
  id: string;
  label: string;
  fy2026Bn: number;
  kind: "tax-code" | "outlay" | "revenue";
};

/** JCT aggregate (CRFB summary of JCT, Feb 2026). */
export const JCT_AGGREGATE = {
  fy2025Tn: 2.2,
  fy2026Tn: 2.3,
  fy2025_2029Tn: 11.7,
  top10Bn: 1434,
};

/**
 * Nominal GDP yardsticks for % of GDP framing (CBO/BEA round numbers).
 * Used only to convert disclosed $ aggregates into share-of-GDP charts.
 */
export const GDP_YARDSTICK = {
  fy2025Tn: 29.0,
  fy2026Tn: 30.1,
  fy2029Tn: 33.5,
};

export const HEADLINE = {
  jctFy2026Tn: JCT_AGGREGATE.fy2026Tn,
  jctFy2026PctGdp: (JCT_AGGREGATE.fy2026Tn / GDP_YARDSTICK.fy2026Tn) * 100,
  jctFy2025Tn: JCT_AGGREGATE.fy2025Tn,
  jctFy2025PctGdp: (JCT_AGGREGATE.fy2025Tn / GDP_YARDSTICK.fy2025Tn) * 100,
  top10Bn: JCT_AGGREGATE.top10Bn,
  top10ShareApprox: JCT_AGGREGATE.top10Bn / (JCT_AGGREGATE.fy2026Tn * 1000),
  creditsTopBn: 128 + 105 + 67, // CTC + ACA + EITC from JCT top-10
  urbanPeakPct2017: 8.5,
  urbanTroughPct2024: 6.0,
  urbanReboundPct2029: 7.6,
};

/**
 * Tax expenditures as % of GDP.
 * 2017 / 2024–25 / 2029 anchors: Urban Institute “Trends in Tax Expenditures” update.
 * 2025–26 $ totals: JCT via CRFB; % GDP = JCT $ / GDP yardstick.
 */
export const PCT_GDP_SERIES: GdpSharePoint[] = [
  { year: 2015, pctGdp: 7.8, totalTn: null, confidence: "estimated", note: "Urban-style path" },
  { year: 2016, pctGdp: 8.1, totalTn: null, confidence: "estimated" },
  { year: 2017, pctGdp: 8.5, totalTn: null, confidence: "disclosed", note: "Urban Institute peak" },
  { year: 2018, pctGdp: 7.4, totalTn: null, confidence: "estimated", note: "TCJA phase-in" },
  { year: 2019, pctGdp: 6.8, totalTn: null, confidence: "estimated" },
  { year: 2020, pctGdp: 7.2, totalTn: null, confidence: "estimated", note: "COVID relief credits" },
  { year: 2021, pctGdp: 7.5, totalTn: null, confidence: "estimated" },
  { year: 2022, pctGdp: 6.6, totalTn: null, confidence: "estimated" },
  { year: 2023, pctGdp: 6.2, totalTn: null, confidence: "estimated" },
  { year: 2024, pctGdp: 6.0, totalTn: null, confidence: "disclosed", note: "Urban trough ~6%" },
  {
    year: 2025,
    pctGdp: HEADLINE.jctFy2025PctGdp,
    totalTn: JCT_AGGREGATE.fy2025Tn,
    confidence: "disclosed",
    note: "JCT $2.2T / GDP yardstick",
  },
  {
    year: 2026,
    pctGdp: HEADLINE.jctFy2026PctGdp,
    totalTn: JCT_AGGREGATE.fy2026Tn,
    confidence: "disclosed",
    note: "JCT $2.3T / GDP yardstick",
  },
  { year: 2027, pctGdp: 7.3, totalTn: null, confidence: "estimated" },
  { year: 2028, pctGdp: 7.5, totalTn: null, confidence: "estimated" },
  {
    year: 2029,
    pctGdp: HEADLINE.urbanReboundPct2029,
    totalTn: null,
    confidence: "disclosed",
    note: "Urban rebound if TCJA individual provisions expire under then-current law framing",
  },
];

/**
 * Approximate instrument-mix shares of the summed catalog (editorial packaging of JCT/Treasury
 * families — for composition viz, not an official JCT table).
 */
export const INSTRUMENT_MIX: InstrumentMixPoint[] = [
  {
    year: 2017,
    exclusionPct: 48,
    creditPct: 12,
    preferentialPct: 18,
    deductionPct: 16,
    otherPct: 6,
    confidence: "estimated",
  },
  {
    year: 2020,
    exclusionPct: 44,
    creditPct: 22,
    preferentialPct: 16,
    deductionPct: 13,
    otherPct: 5,
    confidence: "estimated",
  },
  {
    year: 2024,
    exclusionPct: 46,
    creditPct: 18,
    preferentialPct: 17,
    deductionPct: 14,
    otherPct: 5,
    confidence: "estimated",
  },
  {
    year: 2026,
    exclusionPct: 44,
    creditPct: 21,
    preferentialPct: 17,
    deductionPct: 13,
    otherPct: 5,
    confidence: "estimated",
  },
];

/** JCT FY2026 largest items (CRFB summary) — catalog core. */
export const JCT_CATALOG: CatalogItem[] = [
  {
    id: "jct-pensions",
    label: "Exclusion for retirement savings and pension contributions",
    shortLabel: "Pensions / retirement",
    fy2026Bn: 355,
    instrument: "exclusion",
    family: "Retirement",
    refundable: false,
    source: "jct",
    confidence: "disclosed",
  },
  {
    id: "jct-cg-div",
    label: "Lower rates for dividends and long-term capital gains",
    shortLabel: "CG + dividends rates",
    fy2026Bn: 252,
    instrument: "preferential_rate",
    family: "Capital income",
    refundable: false,
    source: "jct",
    confidence: "disclosed",
  },
  {
    id: "jct-esi",
    label: "Exclusion for employer-sponsored health insurance",
    shortLabel: "Employer health",
    fy2026Bn: 240,
    instrument: "exclusion",
    family: "Health",
    refundable: false,
    source: "jct",
    confidence: "disclosed",
  },
  {
    id: "jct-ctc",
    label: "Child Tax Credit and credit for other dependents",
    shortLabel: "Child / dependent credits",
    fy2026Bn: 128,
    instrument: "credit",
    family: "Income support",
    refundable: true,
    source: "jct",
    confidence: "disclosed",
  },
  {
    id: "jct-aca",
    label: "ACA health insurance subsidies",
    shortLabel: "ACA subsidies",
    fy2026Bn: 105,
    instrument: "credit",
    family: "Health",
    refundable: true,
    source: "jct",
    confidence: "disclosed",
  },
  {
    id: "jct-charity",
    label: "Charitable contributions deduction",
    shortLabel: "Charitable deduction",
    fy2026Bn: 78,
    instrument: "deduction",
    family: "Charity",
    refundable: false,
    source: "jct",
    confidence: "disclosed",
  },
  {
    id: "jct-199a",
    label: "Pass-through business income deduction (§199A)",
    shortLabel: "Pass-through (§199A)",
    fy2026Bn: 76,
    instrument: "deduction",
    family: "Business",
    refundable: false,
    source: "jct",
    confidence: "disclosed",
  },
  {
    id: "jct-stepup",
    label: "Stepped-up basis for capital gains at death",
    shortLabel: "Step-up at death",
    fy2026Bn: 73,
    instrument: "deferral",
    family: "Capital income",
    refundable: false,
    source: "jct",
    confidence: "disclosed",
  },
  {
    id: "jct-eitc",
    label: "Earned Income Tax Credit",
    shortLabel: "EITC",
    fy2026Bn: 67,
    instrument: "credit",
    family: "Income support",
    refundable: true,
    source: "jct",
    confidence: "disclosed",
  },
  {
    id: "jct-salt",
    label: "State and local tax deduction",
    shortLabel: "SALT deduction",
    fy2026Bn: 60,
    instrument: "deduction",
    family: "State/local",
    refundable: false,
    source: "jct",
    confidence: "disclosed",
  },
];

/** Treasury OTA FAQ — FY2026 largest published items (partial list). */
export const TREASURY_CATALOG: CatalogItem[] = [
  {
    id: "treas-esi",
    label: "Exclusion of employer contributions for medical insurance premiums and medical care",
    shortLabel: "Employer health (Treasury)",
    fy2026Bn: 296,
    instrument: "exclusion",
    family: "Health",
    refundable: false,
    source: "treasury",
    confidence: "disclosed",
  },
  {
    id: "treas-imputed",
    label: "Exclusion of net imputed rental income",
    shortLabel: "Imputed rent",
    fy2026Bn: 157,
    instrument: "exclusion",
    family: "Housing",
    refundable: false,
    source: "treasury",
    confidence: "disclosed",
  },
  {
    id: "treas-dc",
    label: "Defined contribution employer plans",
    shortLabel: "DC employer plans",
    fy2026Bn: 156,
    instrument: "exclusion",
    family: "Retirement",
    refundable: false,
    source: "treasury",
    confidence: "disclosed",
  },
  {
    id: "treas-cg",
    label: "Capital gains (except agriculture, timber, iron ore, and coal)",
    shortLabel: "Capital gains (narrow)",
    fy2026Bn: 135,
    instrument: "preferential_rate",
    family: "Capital income",
    refundable: false,
    source: "treasury",
    confidence: "disclosed",
  },
];

/** Rough FY2026 scale comparisons (CRFB / CBO framing). */
export const BUDGET_YARDSTICKS: BudgetYardstick[] = [
  { id: "tax-exp", label: "JCT tax expenditures", fy2026Bn: 2300, kind: "tax-code" },
  { id: "discretionary", label: "All discretionary (approx)", fy2026Bn: 1700, kind: "outlay" },
  { id: "health", label: "Medicare + Medicaid (approx)", fy2026Bn: 1600, kind: "outlay" },
  { id: "ss", label: "Social Security (approx)", fy2026Bn: 1500, kind: "outlay" },
  { id: "defense", label: "National defense (approx)", fy2026Bn: 900, kind: "outlay" },
  { id: "corp-tax", label: "Corporate income tax receipts (approx)", fy2026Bn: 550, kind: "revenue" },
];

export const INSTRUMENT_COLORS: Record<Instrument, string> = {
  exclusion: "#0ea5e9",
  credit: "#f59e0b",
  preferential_rate: "#8b5cf6",
  deduction: "#14b8a6",
  deferral: "#64748b",
};

export const INSTRUMENT_LABELS: Record<Instrument, string> = {
  exclusion: "Exclusions",
  credit: "Credits",
  preferential_rate: "Preferential rates",
  deduction: "Deductions",
  deferral: "Deferrals / basis",
};

export const SOURCES = [
  "Joint Committee on Taxation tax expenditure estimates (FY2025–2029), as summarized by CRFB (Feb 2026)",
  "U.S. Treasury Office of Tax Analysis — Tax Expenditures FAQ (FY2026 largest items)",
  "Urban Institute — Trends in Tax Expenditures: An Update (share-of-GDP path)",
  "CRFB — “JCT Projects Tax Expenditures Will Be $2.3T in 2026”",
];

export const SOURCE_NOTE =
  "JCT FY2026 aggregate ($2.3T) and top-10 ranking via CRFB (Feb 2026). Treasury largest items from OTA FY2026 FAQ. Share-of-GDP path mixes Urban Institute disclosed anchors with JCT $/GDP yardsticks for 2025–26. Line items interact — do not sum as a repeal score. Payroll-tax effects on ESI are excluded from these income-tax estimates.";

export function catalogFor(source: "jct" | "treasury"): CatalogItem[] {
  return source === "jct" ? JCT_CATALOG : TREASURY_CATALOG;
}

export function filterCatalog(
  items: CatalogItem[],
  instrument: Instrument | "all",
): CatalogItem[] {
  if (instrument === "all") return [...items].sort((a, b) => b.fy2026Bn - a.fy2026Bn);
  return items.filter((i) => i.instrument === instrument).sort((a, b) => b.fy2026Bn - a.fy2026Bn);
}

export function instrumentTotals(items: CatalogItem[]) {
  const map = new Map<Instrument, number>();
  for (const i of items) {
    map.set(i.instrument, (map.get(i.instrument) || 0) + i.fy2026Bn);
  }
  const total = [...map.values()].reduce((s, n) => s + n, 0);
  return [...map.entries()]
    .map(([instrument, bn]) => ({
      instrument,
      label: INSTRUMENT_LABELS[instrument],
      bn,
      sharePct: total > 0 ? (bn / total) * 100 : 0,
      color: INSTRUMENT_COLORS[instrument],
    }))
    .sort((a, b) => b.bn - a.bn);
}

export function toPctGdp(bn: number, gdpTn = GDP_YARDSTICK.fy2026Tn): number {
  return (bn / 1000 / gdpTn) * 100;
}

export function fmtBn(n: number, digits = 0): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}T`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: digits })}B`;
}

export function fmtTn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}T`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}
