/**
 * Migration & humanitarian burden — 2026Q3 vintage update.
 * Core question: What changed vs update-2026 (GT end-2025 + GHO MYR 31 May)
 * once late-summer FTS and UNHCR Global Appeal 2026 prints land?
 *
 * Primary sources:
 * - OCHA / humanitarianaction.info GHO 2026 monitoring (requirements $34.87B, funding $14.08B)
 * - OCHA GHO 2026 Mid-Year Review (31 May 2026) — prior vintage
 * - UNHCR Global Trends 2025 (end-2025 stocks; carried — Mid-Year Trends not yet out)
 * - UNHCR Global Appeal 2026 (budget $8.505B; planning figure 136M)
 * - Prior update: /blog/migration-humanitarian-update-2026
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const PRIOR_POST_PATH = "/blog/migration-humanitarian-update-2026";
export const RESEARCH_PATH = "/blog/migration-humanitarian-research-2026";
export const REFUGEE_HOST_PATH = "/blog/global-refugee-hosting-burden-2024";
export const ODA_PATH = "/blog/oecd-dac-oda-first-drop-2024";

export const SOURCE_NOTE =
  "Vintage delta vs update-2026 (UNHCR Global Trends 2025 end-2025 stocks + GHO 2026 Mid-Year Review FTS as of 31 May 2026). Newest cash ledger: OCHA GHO 2026 monitoring snapshot on humanitarianaction.info (requirements $34.87B, funding $14.08B; coverage derived). Displacement stocks and host shares are carried from Global Trends 2025 until Mid-Year Trends (Oct/Nov). UNHCR 2026 budget and planning figures from Global Appeal 2026; early-pledge share and at-risk caseload from UNHCR mid-year operational messaging. Prior-print meters mirrored from migration-humanitarian-update-2026 for side-by-side deltas.";

export const SOURCES = [
  {
    label: "OCHA — GHO 2026 monitoring (FTS)",
    url: "https://humanitarianaction.info/overview/2026",
  },
  {
    label: "OCHA — GHO 2026 Mid-Year Review",
    url: "https://humanitarianaction.info/document/mid-year-review-global-humanitarian-overview-delivering-people-crisis-against-odds",
  },
  {
    label: "UNHCR — Global Trends 2025",
    url: "https://www.unhcr.org/global-trends",
  },
  {
    label: "UNHCR — Global Appeal 2026",
    url: "https://www.unhcr.org/publications/global-appeal-2026",
  },
  {
    label: "Prior update vintage",
    url: PRIOR_POST_PATH,
  },
] as const;

/** Prior update-2026 (May MYR) vs newest Q3 official vintage. */
export const HEADLINE = {
  displacedPriorM: 117.8,
  displacedNewM: 117.8,
  displacedDeltaM: 0,
  displacedCarried: true,
  ghoCoveragePriorPct: 24.4,
  ghoCoverageNewPct: 40.4,
  ghoCoverageDeltaPp: 16.0,
  ghoReqPriorBn: 33.66,
  ghoReqNewBn: 34.87,
  ghoReqDeltaBn: 1.21,
  ghoReqDeltaPct: 3.6,
  ghoFundedPriorBn: 8.21,
  ghoFundedNewBn: 14.08,
  ghoFundedDeltaBn: 5.87,
  ghoGapPriorBn: 25.45,
  ghoGapNewBn: 20.79,
  ghoGapDeltaBn: -4.66,
  ghoPinPriorM: 252.1,
  ghoPinNewM: 252.1,
  ghoPinCarried: true,
  ghoTargetPriorM: 143.2,
  ghoTargetNewM: 143.2,
  ghoPrioritizedPriorM: 88.7,
  unhcrBudget2025Bn: 10.604,
  unhcrBudget2026Bn: 8.505,
  unhcrBudgetDeltaPct: -19.8,
  unhcrFunded2025Pct: 37,
  unhcrEarlyPledge2026Pct: 18,
  unhcrPeople2026M: 136,
  atRiskCutsM: 11.6,
  lmicHostPct: 68,
  ldcHostPct: 26,
  highIncomeHostPct: 29,
  returnsTotalM: 14.7,
  resettlementArrivals: 81_800,
  oneInN: 70,
} as const;

export type VintageMeter = {
  id: string;
  label: string;
  unit: "millions" | "pct" | "bn" | "count";
  prior: number;
  newest: number;
  delta: number;
  deltaUnit: "pp" | "abs" | "pct";
  betterWhen: "down" | "up" | "neutral";
  note: string;
  confidence: Confidence;
};

export const VINTAGE_METERS: VintageMeter[] = [
  {
    id: "coverage",
    label: "GHO appeal coverage",
    unit: "pct",
    prior: 24.4,
    newest: 40.4,
    delta: 16.0,
    deltaUnit: "pp",
    betterWhen: "up",
    note: "May MYR → Aug FTS; largest cash delta",
    confidence: "disclosed",
  },
  {
    id: "funded",
    label: "GHO funded (FTS)",
    unit: "bn",
    prior: 8.21,
    newest: 14.08,
    delta: 5.87,
    deltaUnit: "abs",
    betterWhen: "up",
    note: "+$5.9B booked since 31 May",
    confidence: "disclosed",
  },
  {
    id: "req",
    label: "GHO requirements",
    unit: "bn",
    prior: 33.66,
    newest: 34.87,
    delta: 3.6,
    deltaUnit: "pct",
    betterWhen: "neutral",
    note: "Ask crept up while coverage healed",
    confidence: "disclosed",
  },
  {
    id: "gap",
    label: "GHO unfunded gap",
    unit: "bn",
    prior: 25.45,
    newest: 20.79,
    delta: -4.66,
    deltaUnit: "abs",
    betterWhen: "down",
    note: "Still ~$21B short of the strip-back ask",
    confidence: "disclosed",
  },
  {
    id: "displaced",
    label: "Forcibly displaced",
    unit: "millions",
    prior: 117.8,
    newest: 117.8,
    delta: 0,
    deltaUnit: "abs",
    betterWhen: "down",
    note: "Carried GT 2025; Mid-Year Trends pending",
    confidence: "carried",
  },
  {
    id: "pin",
    label: "GHO people in need",
    unit: "millions",
    prior: 252.1,
    newest: 252.1,
    delta: 0,
    deltaUnit: "abs",
    betterWhen: "down",
    note: "Carried from May MYR print",
    confidence: "carried",
  },
  {
    id: "unhcrBudget",
    label: "UNHCR needs budget",
    unit: "bn",
    prior: 10.604,
    newest: 8.505,
    delta: -19.8,
    deltaUnit: "pct",
    betterWhen: "neutral",
    note: "2025 Global Report → 2026 Global Appeal",
    confidence: "disclosed",
  },
  {
    id: "unhcrEarly",
    label: "UNHCR early-pledge share",
    unit: "pct",
    prior: 37,
    newest: 18,
    delta: -19,
    deltaUnit: "pp",
    betterWhen: "up",
    note: "2025 year-end funded % vs 2026 pledging share",
    confidence: "estimated",
  },
];

/** Intra-year cash path: May MYR → Aug FTS. */
export const GHO_CASH_PATH = [
  {
    label: "May MYR",
    asOf: "31 May 2026",
    reqBn: 33.66,
    fundedBn: 8.21,
    coveragePct: 24.4,
    gapBn: 25.45,
    confidence: "disclosed" as Confidence,
  },
  {
    label: "Aug FTS",
    asOf: "Aug 2026 snapshot",
    reqBn: 34.87,
    fundedBn: 14.08,
    coveragePct: 40.4,
    gapBn: 20.79,
    confidence: "disclosed" as Confidence,
  },
];

/** Waterfall: how coverage rose (pp contributions, editorial decomposition). */
export const COVERAGE_WATERFALL = [
  { step: "May coverage", value: 24.4, kind: "base" as const },
  { step: "+ Funded inflow", value: 16.8, kind: "up" as const },
  { step: "− Ask creep", value: -0.8, kind: "down" as const },
  { step: "Aug coverage", value: 40.4, kind: "end" as const },
];

/** Dual ledger: people stock carried vs cash coverage moving. */
export const STOCK_VS_CASH = [
  {
    vintage: "Research end-2024",
    displacedM: 123.2,
    coveragePct: 23.4,
    note: "GHO 2025 Oct FTS",
    confidence: "disclosed" as Confidence,
  },
  {
    vintage: "Update May MYR",
    displacedM: 117.8,
    coveragePct: 24.4,
    note: "GT 2025 + GHO 31 May",
    confidence: "disclosed" as Confidence,
  },
  {
    vintage: "Q3 Aug FTS",
    displacedM: 117.8,
    coveragePct: 40.4,
    note: "Stock carried; cash moved",
    confidence: "carried" as Confidence,
  },
];

/** UNHCR budget scissors: needs budget vs early funding share. */
export const UNHCR_BUDGET_PATH = [
  {
    year: 2024,
    budgetBn: 10.8,
    fundedPct: 48,
    confidence: "estimated" as Confidence,
  },
  {
    year: 2025,
    budgetBn: 10.604,
    fundedPct: 37,
    confidence: "disclosed" as Confidence,
  },
  {
    year: 2026,
    budgetBn: 8.505,
    fundedPct: 18,
    confidence: "disclosed" as Confidence,
  },
];

export type BurdenLane = "hosts" | "donors" | "agency" | "returnees";

/** Who still bears the burden — Q3 scoreboard. */
export type BurdenRow = {
  id: string;
  actor: string;
  short: string;
  lane: BurdenLane;
  meter: string;
  prior: number;
  newest: number;
  unit: "pct" | "bn" | "millions" | "count";
  delta: number;
  deltaUnit: "pp" | "abs" | "pct";
  note: string;
  confidence: Confidence;
};

export const BURDEN_ROWS: BurdenRow[] = [
  {
    id: "lmic",
    actor: "LMIC host countries",
    short: "LMIC hosts",
    lane: "hosts",
    meter: "Refugee host share",
    prior: 68,
    newest: 68,
    unit: "pct",
    delta: 0,
    deltaUnit: "pp",
    note: "Carried GT 2025; still majority",
    confidence: "carried",
  },
  {
    id: "ldc",
    actor: "Least-developed hosts",
    short: "LDC hosts",
    lane: "hosts",
    meter: "Refugee host share",
    prior: 26,
    newest: 26,
    unit: "pct",
    delta: 0,
    deltaUnit: "pp",
    note: "Carried; poorest hosts still elevated",
    confidence: "carried",
  },
  {
    id: "hi",
    actor: "High-income hosts",
    short: "HI hosts",
    lane: "hosts",
    meter: "Refugee host share",
    prior: 29,
    newest: 29,
    unit: "pct",
    delta: 0,
    deltaUnit: "pp",
    note: "Carried; still under one-third",
    confidence: "carried",
  },
  {
    id: "donors",
    actor: "GHO donors (FTS)",
    short: "GHO donors",
    lane: "donors",
    meter: "Appeal coverage",
    prior: 24.4,
    newest: 40.4,
    unit: "pct",
    delta: 16.0,
    deltaUnit: "pp",
    note: "Largest Q3 move — cash booked",
    confidence: "disclosed",
  },
  {
    id: "gap",
    actor: "Unfunded GHO ask",
    short: "GHO gap",
    lane: "donors",
    meter: "Unfunded $",
    prior: 25.45,
    newest: 20.79,
    unit: "bn",
    delta: -4.66,
    deltaUnit: "abs",
    note: "Gap closed but $21B remains",
    confidence: "disclosed",
  },
  {
    id: "unhcr",
    actor: "UNHCR programme budget",
    short: "UNHCR ask",
    lane: "agency",
    meter: "Needs budget",
    prior: 10.604,
    newest: 8.505,
    unit: "bn",
    delta: -19.8,
    deltaUnit: "pct",
    note: "Strategic cut, not healed needs",
    confidence: "disclosed",
  },
  {
    id: "atrisk",
    actor: "People at risk from cuts",
    short: "At-risk",
    lane: "agency",
    meter: "Caseload at risk",
    prior: 0,
    newest: 11.6,
    unit: "millions",
    delta: 11.6,
    deltaUnit: "abs",
    note: "UNHCR mid-year operational flag",
    confidence: "estimated",
  },
  {
    id: "returns",
    actor: "Return corridors (2025)",
    short: "Returns",
    lane: "returnees",
    meter: "Returns stock",
    prior: 14.7,
    newest: 14.7,
    unit: "millions",
    delta: 0,
    deltaUnit: "abs",
    note: "Carried GT 2025 solutions channel",
    confidence: "carried",
  },
];

/** Top crisis plans — illustrative FTS-style share of ask (Q3 editorial mix). */
export const PLAN_COVERAGE = [
  {
    plan: "Sudan / regional",
    short: "Sudan",
    region: "Africa" as const,
    reqBn: 4.2,
    fundedBn: 1.1,
    coveragePct: 26.2,
    pinM: 30.4,
    confidence: "estimated" as Confidence,
  },
  {
    plan: "Ukraine / regional",
    short: "Ukraine",
    region: "Europe" as const,
    reqBn: 3.1,
    fundedBn: 1.55,
    coveragePct: 50.0,
    pinM: 12.7,
    confidence: "estimated" as Confidence,
  },
  {
    plan: "oPt / regional",
    short: "oPt",
    region: "MENA" as const,
    reqBn: 2.8,
    fundedBn: 0.98,
    coveragePct: 35.0,
    pinM: 3.3,
    confidence: "estimated" as Confidence,
  },
  {
    plan: "DRC / regional",
    short: "DRC",
    region: "Africa" as const,
    reqBn: 2.6,
    fundedBn: 0.78,
    coveragePct: 30.0,
    pinM: 21.2,
    confidence: "estimated" as Confidence,
  },
  {
    plan: "Syria / regional",
    short: "Syria",
    region: "MENA" as const,
    reqBn: 2.4,
    fundedBn: 0.72,
    coveragePct: 30.0,
    pinM: 16.7,
    confidence: "estimated" as Confidence,
  },
  {
    plan: "Afghanistan",
    short: "Afghanistan",
    region: "Asia-Pacific" as const,
    reqBn: 2.1,
    fundedBn: 0.63,
    coveragePct: 30.0,
    pinM: 22.9,
    confidence: "estimated" as Confidence,
  },
  {
    plan: "Sahel / multi",
    short: "Sahel",
    region: "Africa" as const,
    reqBn: 1.8,
    fundedBn: 0.45,
    coveragePct: 25.0,
    pinM: 14.1,
    confidence: "estimated" as Confidence,
  },
  {
    plan: "Horn / multi",
    short: "Horn",
    region: "Africa" as const,
    reqBn: 1.6,
    fundedBn: 0.56,
    coveragePct: 35.0,
    pinM: 18.5,
    confidence: "estimated" as Confidence,
  },
];

/** Host income mix — carried GT 2025 shares for burden panel. */
export const HOSTING_INCOME = [
  { group: "Upper-middle", pct: 33, confidence: "carried" as Confidence },
  { group: "High", pct: 29, confidence: "carried" as Confidence },
  { group: "Low", pct: 18, confidence: "carried" as Confidence },
  { group: "Lower-middle", pct: 17, confidence: "carried" as Confidence },
];

/** Solutions channel still skewed to returns (carried). */
export const SOLUTIONS_CHANNELS = [
  {
    channel: "Returns (refugee + IDP)",
    short: "Returns",
    valueM: 14.7,
    note: "Carried GT 2025",
    confidence: "carried" as Confidence,
  },
  {
    channel: "Refugee returns",
    short: "Ref. returns",
    valueM: 4.4,
    note: "Mostly AFG/SYR/SDN",
    confidence: "carried" as Confidence,
  },
  {
    channel: "Resettlement arrivals",
    short: "Resettle",
    valueM: 0.082,
    note: "~3% of 2.9M need",
    confidence: "carried" as Confidence,
  },
  {
    channel: "At-risk from cuts",
    short: "At-risk",
    valueM: 11.6,
    note: "2026 operational flag",
    confidence: "estimated" as Confidence,
  },
];

export function fmtBn(n: number, digits = 1): string {
  if (n >= 1) return `$${n.toFixed(digits)}B`;
  return `$${(n * 1000).toFixed(0)}M`;
}

export function fmtM(n: number, digits = 1): string {
  return `${n.toFixed(digits)}M`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtDelta(
  n: number,
  unit: "pp" | "abs" | "pct",
  digits = 1,
): string {
  const sign = n > 0 ? "+" : "";
  if (unit === "pp") return `${sign}${n.toFixed(digits)}pp`;
  if (unit === "pct") return `${sign}${n.toFixed(digits)}%`;
  return `${sign}${n.toFixed(digits)}`;
}
