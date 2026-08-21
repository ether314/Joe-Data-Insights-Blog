/**
 * Migration & humanitarian burden — vintage update (Global Trends 2025).
 * Core question: What changed vs the research print (end-2024 / GHO 2025 Oct)
 * once UNHCR Global Trends 2025 and GHO 2026 mid-year prints land?
 *
 * Primary sources:
 * - UNHCR Global Trends 2025 (end-2025 stocks; data as of 1 May 2026)
 * - UNHCR Global Report 2025 (budget / funds available)
 * - OCHA GHO 2026 Mid-Year Review (FTS as of 31 May 2026)
 * - Prior research vintage: /blog/migration-humanitarian-research-2026
 */

export type Confidence = "disclosed" | "estimated";

export const PRIOR_POST_PATH = "/blog/migration-humanitarian-research-2026";
export const REFUGEE_HOST_PATH = "/blog/global-refugee-hosting-burden-2024";
export const ODA_PATH = "/blog/oecd-dac-oda-first-drop-2024";

export const SOURCE_NOTE =
  "Vintage delta vs research print (end-2024 Global Trends + GHO 2025 Oct FTS). New stock: UNHCR Global Trends 2025 (end-2025; received as of 1 May 2026). UNHCR budget/available: Global Report 2025. GHO 2026 Mid-Year Review: people in need / requirements / FTS coverage as of 31 May 2026. Host rankings and income-group shares from Global Trends 2025. Return and resettlement flows from the same report. Prior-print figures mirrored from migration-humanitarian-research-2026 for side-by-side deltas.";

export const SOURCES = [
  {
    label: "UNHCR — Global Trends 2025",
    url: "https://www.unhcr.org/global-trends",
  },
  {
    label: "UNHCR — Global Report 2025",
    url: "https://www.unhcr.org/publications/global-report-2025",
  },
  {
    label: "OCHA — GHO 2026 Mid-Year Review",
    url: "https://humanitarianaction.info/document/mid-year-review-global-humanitarian-overview-delivering-people-crisis-against-odds",
  },
  {
    label: "Prior research vintage",
    url: PRIOR_POST_PATH,
  },
] as const;

/** Prior research print (end-2024 / GHO 2025 Oct) vs newest official vintage. */
export const HEADLINE = {
  displacedPriorM: 123.2,
  displacedNewM: 117.8,
  displacedDeltaM: -5.4,
  displacedDeltaPct: -4.4,
  idpPriorM: 73.5,
  idpNewM: 68.7,
  idpDeltaM: -4.8,
  refugeesPlusPriorM: 42.7,
  refugeesPlusNewM: 41.6,
  asylumPriorM: 8.4,
  asylumNewM: 9.0,
  asylumDeltaM: 0.6,
  lmicHostPriorPct: 73,
  lmicHostNewPct: 68,
  lmicHostDeltaPp: -5,
  ldcHostPriorPct: 23,
  ldcHostNewPct: 26,
  ldcHostDeltaPp: 3,
  neighbourHostPriorPct: 67,
  neighbourHostNewPct: 65,
  highIncomeHostPriorPct: 27,
  highIncomeHostNewPct: 29,
  unhcrFunded2024Pct: 48,
  unhcrFunded2025Pct: 37,
  unhcrBudget2025Bn: 10.604,
  unhcrAvailable2025Bn: 3.932,
  unhcrGap2025Pct: 63,
  unhcrSpendDeltaPct: -22,
  ghoCoveragePriorPct: 23.4,
  ghoCoverageNewPct: 24.4,
  ghoReqPriorBn: 45.37,
  ghoReqNewBn: 33.66,
  ghoReqDeltaPct: -25.8,
  ghoFundedPriorBn: 10.61,
  ghoFundedNewBn: 8.21,
  ghoPinPriorM: 300,
  ghoPinNewM: 252.1,
  ghoTargetNewM: 143.2,
  returnsTotalM: 14.7,
  returnsYoyPct: 50,
  refugeeReturnsM: 4.4,
  idpReturnsM: 10.3,
  resettlementArrivals: 81_800,
  resettlementNeedM: 2.9,
  resettlementHalved: true,
  oneInN: 70,
} as const;

/** Side-by-side meter deltas for dumbbell / table. */
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
    id: "displaced",
    label: "Forcibly displaced",
    unit: "millions",
    prior: 123.2,
    newest: 117.8,
    delta: -5.4,
    deltaUnit: "abs",
    betterWhen: "down",
    note: "End-2024 → end-2025; first decade decline",
    confidence: "disclosed",
  },
  {
    id: "idp",
    label: "Conflict IDPs (IDMC)",
    unit: "millions",
    prior: 73.5,
    newest: 68.7,
    delta: -4.8,
    deltaUnit: "abs",
    betterWhen: "down",
    note: "Still 58% of forced displacement stock",
    confidence: "disclosed",
  },
  {
    id: "refugees",
    label: "Refugees + UNRWA + OPNIIP",
    unit: "millions",
    prior: 42.7,
    newest: 41.6,
    delta: -1.1,
    deltaUnit: "abs",
    betterWhen: "down",
    note: "−3% YoY; returns + reclassification effects",
    confidence: "disclosed",
  },
  {
    id: "asylum",
    label: "Asylum-seeker stock",
    unit: "millions",
    prior: 8.4,
    newest: 9.0,
    delta: 0.6,
    deltaUnit: "abs",
    betterWhen: "down",
    note: "Backlog grew even as new applications fell mid-year",
    confidence: "disclosed",
  },
  {
    id: "lmic",
    label: "LMIC host share",
    unit: "pct",
    prior: 73,
    newest: 68,
    delta: -5,
    deltaUnit: "pp",
    betterWhen: "neutral",
    note: "Still majority; high-income share +2pp to 29%",
    confidence: "disclosed",
  },
  {
    id: "ldc",
    label: "LDC host share",
    unit: "pct",
    prior: 23,
    newest: 26,
    delta: 3,
    deltaUnit: "pp",
    betterWhen: "neutral",
    note: "9.4M in LDCs (+12% vs end-2024)",
    confidence: "disclosed",
  },
  {
    id: "unhcr",
    label: "UNHCR needs funded",
    unit: "pct",
    prior: 48,
    newest: 37,
    delta: -11,
    deltaUnit: "pp",
    betterWhen: "up",
    note: "2024 → 2025 Global Report; gap 63%",
    confidence: "disclosed",
  },
  {
    id: "gho",
    label: "GHO appeal coverage",
    unit: "pct",
    prior: 23.4,
    newest: 24.4,
    delta: 1.0,
    deltaUnit: "pp",
    betterWhen: "up",
    note: "GHO 2025 Oct vs GHO 2026 May FTS — ask shrank more than coverage rose",
    confidence: "disclosed",
  },
  {
    id: "ghoReq",
    label: "GHO requirements",
    unit: "bn",
    prior: 45.37,
    newest: 33.66,
    delta: -25.8,
    deltaUnit: "pct",
    betterWhen: "neutral",
    note: "Prioritized / stripped-back 2026 ask",
    confidence: "disclosed",
  },
];

/** Displacement path through the new vintage. */
export const DISPLACEMENT_PATH = [
  { year: 2020, displacedM: 82.4, conf: "estimated" as Confidence },
  { year: 2021, displacedM: 89.3, conf: "estimated" as Confidence },
  { year: 2022, displacedM: 108.4, conf: "estimated" as Confidence },
  { year: 2023, displacedM: 117.3, conf: "estimated" as Confidence },
  { year: 2024, displacedM: 123.2, conf: "disclosed" as Confidence },
  { year: 2025, displacedM: 117.8, conf: "disclosed" as Confidence },
];

/** Dual series: stock vs UNHCR funded %. */
export const STOCK_VS_FUNDED = [
  { year: 2020, displacedM: 82.4, fundedPct: 59, fundedConf: "disclosed" as Confidence },
  { year: 2021, displacedM: 89.3, fundedPct: 56, fundedConf: "disclosed" as Confidence },
  { year: 2022, displacedM: 108.4, fundedPct: 56, fundedConf: "estimated" as Confidence },
  { year: 2023, displacedM: 117.3, fundedPct: 52, fundedConf: "disclosed" as Confidence },
  { year: 2024, displacedM: 123.2, fundedPct: 48, fundedConf: "disclosed" as Confidence },
  { year: 2025, displacedM: 117.8, fundedPct: 37, fundedConf: "disclosed" as Confidence },
];

/** Composition end-2025 vs prior research end-2024. */
export const COMPOSITION_DELTA = [
  {
    slice: "Conflict IDPs",
    short: "IDPs",
    priorM: 73.5,
    newM: 68.7,
    deltaM: -4.8,
    confidence: "disclosed" as Confidence,
  },
  {
    slice: "Refugees + OPNIIP + UNRWA",
    short: "Refugees+",
    priorM: 42.7,
    newM: 41.6,
    deltaM: -1.1,
    confidence: "disclosed" as Confidence,
  },
  {
    slice: "Asylum-seekers",
    short: "Asylum",
    priorM: 8.4,
    newM: 9.0,
    deltaM: 0.6,
    confidence: "disclosed" as Confidence,
  },
];

/** Income-group hosting share shift (UNHCR GT). */
export const HOSTING_INCOME_DELTA = [
  {
    group: "Upper-middle",
    priorPct: 37,
    newPct: 33,
    deltaPp: -4,
    confidence: "disclosed" as Confidence,
  },
  {
    group: "High",
    priorPct: 27,
    newPct: 29,
    deltaPp: 2,
    confidence: "disclosed" as Confidence,
  },
  {
    group: "Low",
    priorPct: 19,
    newPct: 18,
    deltaPp: -1,
    confidence: "disclosed" as Confidence,
  },
  {
    group: "Lower-middle",
    priorPct: 17,
    newPct: 17,
    deltaPp: 0,
    confidence: "disclosed" as Confidence,
  },
];

export type RegionLane =
  | "Africa"
  | "MENA"
  | "Europe"
  | "Asia-Pacific"
  | "Americas";

/** Top hosts — prior research print vs end-2025 GT. */
export type HostDeltaRow = {
  country: string;
  short: string;
  region: RegionLane;
  income: "High" | "Upper-middle" | "Lower-middle" | "Low";
  priorHostedM: number;
  newHostedM: number;
  deltaM: number;
  deltaPct: number;
  role: "host-heavy" | "donor-heavy" | "both" | "host-only";
  note: string;
  confidence: Confidence;
};

export const HOST_DELTAS: HostDeltaRow[] = [
  {
    country: "Colombia",
    short: "Colombia",
    region: "Americas",
    income: "Upper-middle",
    priorHostedM: 2.8,
    newHostedM: 2.8,
    deltaM: 0,
    deltaPct: 1,
    role: "host-only",
    note: "Largest host; almost all Venezuelans",
    confidence: "disclosed",
  },
  {
    country: "Germany",
    short: "Germany",
    region: "Europe",
    income: "High",
    priorHostedM: 2.7,
    newHostedM: 2.7,
    deltaM: 0,
    deltaPct: -3,
    role: "both",
    note: "Ukrainians 1.2M; stock −3%",
    confidence: "disclosed",
  },
  {
    country: "Türkiye",
    short: "Türkiye",
    region: "MENA",
    income: "Upper-middle",
    priorHostedM: 2.9,
    newHostedM: 2.4,
    deltaM: -0.5,
    deltaPct: -19,
    role: "host-heavy",
    note: "Syrian returns drove −19%",
    confidence: "disclosed",
  },
  {
    country: "Uganda",
    short: "Uganda",
    region: "Africa",
    income: "Low",
    priorHostedM: 1.8,
    newHostedM: 1.9,
    deltaM: 0.1,
    deltaPct: 6,
    role: "host-only",
    note: "South Sudanese + Congolese inflows",
    confidence: "disclosed",
  },
  {
    country: "Iran",
    short: "Iran",
    region: "MENA",
    income: "Upper-middle",
    priorHostedM: 3.5,
    newHostedM: 1.7,
    deltaM: -1.8,
    deltaPct: -53,
    role: "host-only",
    note: "Afghan returns / policy shock",
    confidence: "disclosed",
  },
  {
    country: "Chad",
    short: "Chad",
    region: "Africa",
    income: "Low",
    priorHostedM: 1.1,
    newHostedM: 1.5,
    deltaM: 0.4,
    deltaPct: 36,
    role: "host-only",
    note: "Sudanese arrivals; 9/10 Sudanese",
    confidence: "disclosed",
  },
  {
    country: "Pakistan",
    short: "Pakistan",
    region: "Asia-Pacific",
    income: "Lower-middle",
    priorHostedM: 1.6,
    newHostedM: 1.3,
    deltaM: -0.3,
    deltaPct: -17,
    role: "host-only",
    note: "Afghan repatriation plan",
    confidence: "disclosed",
  },
];

/** Return flows that drove the stock decline (millions). */
export const RETURN_FLOWS = [
  {
    country: "DR Congo",
    short: "DRC",
    region: "Africa" as RegionLane,
    totalM: 3.6,
    kind: "mostly IDP" as const,
    confidence: "disclosed" as Confidence,
  },
  {
    country: "Sudan",
    short: "Sudan",
    region: "Africa" as RegionLane,
    totalM: 3.6,
    kind: "mixed" as const,
    confidence: "disclosed" as Confidence,
  },
  {
    country: "Syria",
    short: "Syria",
    region: "MENA" as RegionLane,
    totalM: 3.3,
    kind: "mixed" as const,
    confidence: "disclosed" as Confidence,
  },
  {
    country: "Afghanistan",
    short: "Afghanistan",
    region: "Asia-Pacific" as RegionLane,
    totalM: 2.0,
    kind: "mostly refugee" as const,
    confidence: "disclosed" as Confidence,
  },
  {
    country: "Ukraine",
    short: "Ukraine",
    region: "Europe" as RegionLane,
    totalM: 0.72,
    kind: "mixed" as const,
    confidence: "disclosed" as Confidence,
  },
  {
    country: "Myanmar",
    short: "Myanmar",
    region: "Asia-Pacific" as RegionLane,
    totalM: 0.42,
    kind: "mostly IDP" as const,
    confidence: "disclosed" as Confidence,
  },
];

/** Solutions channel: returns up, resettlement collapsed. */
export const SOLUTIONS_CHANNELS = [
  {
    channel: "Refugee + IDP returns",
    short: "Returns",
    valueM: 14.7,
    priorNote: "+50% vs 2024",
    confidence: "disclosed" as Confidence,
  },
  {
    channel: "Of which refugee returns",
    short: "Ref. returns",
    valueM: 4.4,
    priorNote: "90%+ to AFG/SYR/SDN",
    confidence: "disclosed" as Confidence,
  },
  {
    channel: "Resettlement / sponsorship arrivals",
    short: "Resettle",
    valueM: 0.082,
    priorNote: "Halved vs 2024 peak",
    confidence: "disclosed" as Confidence,
  },
  {
    channel: "Resettlement need (UNHCR)",
    short: "Need",
    valueM: 2.9,
    priorNote: "Arrivals ≈ 3% of need",
    confidence: "disclosed" as Confidence,
  },
];

/** GHO ask vs funded — prior Oct print vs 2026 May mid-year. */
export const GHO_LEDGER = [
  {
    label: "Requirements",
    priorBn: 45.37,
    newBn: 33.66,
    unit: "bn" as const,
  },
  {
    label: "Funded (FTS)",
    priorBn: 10.61,
    newBn: 8.21,
    unit: "bn" as const,
  },
  {
    label: "Coverage %",
    priorBn: 23.4,
    newBn: 24.4,
    unit: "pct" as const,
  },
];

export function fmtBn(n: number, digits = 1): string {
  if (n >= 1) return `$${n.toFixed(digits)}B`;
  return `$${(n * 1000).toFixed(0)}M`;
}

export function fmtM(n: number, digits = 1): string {
  return `${n.toFixed(digits)}M`;
}

export function fmtPct(n: number, digits = 0): string {
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
