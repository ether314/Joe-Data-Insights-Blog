/**
 * Migration & humanitarian burden — August 202608 vintage update.
 * Core question: vs Q3 (May MYR → Aug FTS coverage jump), who actually
 * paid the heal — and do LMIC hosts still carry the people stock?
 *
 * Primary sources:
 * - OCHA FTS 2026 donor ranking (all tracked funding)
 * - OCHA / humanitarianaction.info GHO 2026 monitoring (req/funded/coverage)
 * - UNHCR Global Trends 2025 (end-2025 stocks; Mid-Year Trends 2026 pending)
 * - Prior Q3 update: /blog/migration-humanitarian-update-2026q3
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const PRIOR_POST_PATH = "/blog/migration-humanitarian-update-2026q3";
export const MAY_UPDATE_PATH = "/blog/migration-humanitarian-update-2026";
export const RESEARCH_PATH = "/blog/migration-humanitarian-research-2026";
export const REFUGEE_HOST_PATH = "/blog/global-refugee-hosting-burden-2024";
export const ODA_PATH = "/blog/oecd-dac-oda-first-drop-2024";

export const SOURCE_NOTE =
  "Vintage delta vs migration-humanitarian-update-2026q3 (GHO coverage 40.4% on $14.08B FTS / $34.87B ask; people stock carried at 117.8M). Newest lens: OCHA FTS 2026 donor ranking (US $2.83B = 23.1% of tracked funding; Top-3 ~44.7%). GHO cash meters remain the Aug monitoring snapshot unless noted. Displacement stocks, LMIC/LDC host shares, returns, and resettlement are carried from UNHCR Global Trends 2025 until Mid-Year Trends 2026. Plan-level coverage bands are estimated FTS-style mixes for geometry. Prior-print meters mirrored from the Q3 update for side-by-side deltas.";

export const SOURCES = [
  {
    label: "OCHA FTS — 2026 donor ranking",
    url: "https://fts.unocha.org/home/2026/donors/view",
  },
  {
    label: "OCHA — GHO 2026 monitoring",
    url: "https://humanitarianaction.info/overview/2026",
  },
  {
    label: "UNHCR — Global Trends 2025",
    url: "https://www.unhcr.org/global-trends",
  },
  {
    label: "Prior Q3 vintage",
    url: PRIOR_POST_PATH,
  },
  {
    label: "May MYR update",
    url: MAY_UPDATE_PATH,
  },
] as const;

/** Q3 headline cash vs August donor-unpack vintage. */
export const HEADLINE = {
  displacedPriorM: 117.8,
  displacedNewM: 117.8,
  displacedCarried: true,
  ghoCoveragePriorPct: 40.4,
  ghoCoverageNewPct: 40.4,
  ghoCoverageDeltaPp: 0,
  ghoReqPriorBn: 34.87,
  ghoReqNewBn: 34.87,
  ghoFundedPriorBn: 14.08,
  ghoFundedNewBn: 14.08,
  ghoGapPriorBn: 20.79,
  ghoGapNewBn: 20.79,
  ghoPinPriorM: 252.1,
  ghoPinNewM: 252.1,
  ghoPinCarried: true,
  /** FTS donor concentration — the August delta */
  ftsTop1SharePct: 23.1,
  ftsTop3SharePct: 44.7,
  ftsTop5SharePct: 56.7,
  ftsUsBn: 2.831,
  ftsEcBn: 1.75,
  ftsJapanBn: 0.89,
  ftsTotalTrackedBn: 12.26,
  ftsTop1Donor: "United States",
  /** Host burden carried */
  lmicHostPct: 68,
  ldcHostPct: 26,
  highIncomeHostPct: 29,
  returnsTotalM: 14.7,
  resettlementArrivals: 81_800,
  unhcrBudget2026Bn: 8.505,
  unhcrEarlyPledge2026Pct: 18,
  atRiskCutsM: 11.6,
  /** May→Aug coverage heal still the context */
  mayCoveragePct: 24.4,
  coverageHealPp: 16.0,
  coverageHealFundedDeltaBn: 5.87,
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

/** Side-by-side: Q3 cash headline vs August donor lens. */
export const VINTAGE_METERS: VintageMeter[] = [
  {
    id: "top1",
    label: "FTS Top-1 donor share",
    unit: "pct",
    prior: 0,
    newest: 23.1,
    delta: 23.1,
    deltaUnit: "pp",
    betterWhen: "neutral",
    note: "US $2.83B of tracked 2026 FTS",
    confidence: "disclosed",
  },
  {
    id: "top3",
    label: "FTS Top-3 donor share",
    unit: "pct",
    prior: 0,
    newest: 44.7,
    delta: 44.7,
    deltaUnit: "pp",
    betterWhen: "neutral",
    note: "US + EC + Japan",
    confidence: "disclosed",
  },
  {
    id: "coverage",
    label: "GHO appeal coverage",
    unit: "pct",
    prior: 40.4,
    newest: 40.4,
    delta: 0,
    deltaUnit: "pp",
    betterWhen: "up",
    note: "Flat vs Q3 Aug FTS print",
    confidence: "disclosed",
  },
  {
    id: "gap",
    label: "GHO unfunded gap",
    unit: "bn",
    prior: 20.79,
    newest: 20.79,
    delta: 0,
    deltaUnit: "abs",
    betterWhen: "down",
    note: "Still ~$21B on strip-back ask",
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
    id: "lmic",
    label: "LMIC refugee host share",
    unit: "pct",
    prior: 68,
    newest: 68,
    delta: 0,
    deltaUnit: "pp",
    betterWhen: "neutral",
    note: "Carried — hosts still majority",
    confidence: "carried",
  },
  {
    id: "unhcrEarly",
    label: "UNHCR early-pledge share",
    unit: "pct",
    prior: 18,
    newest: 18,
    delta: 0,
    deltaUnit: "pp",
    betterWhen: "up",
    note: "Carried Global Appeal 2026 pledging",
    confidence: "carried",
  },
  {
    id: "atrisk",
    label: "People at risk from cuts",
    unit: "millions",
    prior: 11.6,
    newest: 11.6,
    delta: 0,
    deltaUnit: "abs",
    betterWhen: "down",
    note: "Carried UNHCR operational flag",
    confidence: "carried",
  },
];

/** FTS 2026 donor ladder (disclosed ranking). */
export const DONOR_LADDER = [
  {
    donor: "United States",
    short: "US",
    fundedM: 2831.4,
    sharePct: 23.1,
    confidence: "disclosed" as Confidence,
  },
  {
    donor: "European Commission",
    short: "EC",
    fundedM: 1749.9,
    sharePct: 14.3,
    confidence: "disclosed" as Confidence,
  },
  {
    donor: "Japan",
    short: "Japan",
    fundedM: 890.3,
    sharePct: 7.3,
    confidence: "disclosed" as Confidence,
  },
  {
    donor: "Germany",
    short: "Germany",
    fundedM: 774.0,
    sharePct: 6.3,
    confidence: "disclosed" as Confidence,
  },
  {
    donor: "Sweden",
    short: "Sweden",
    fundedM: 705.0,
    sharePct: 5.7,
    confidence: "disclosed" as Confidence,
  },
  {
    donor: "Norway",
    short: "Norway",
    fundedM: 702.1,
    sharePct: 5.7,
    confidence: "disclosed" as Confidence,
  },
  {
    donor: "Switzerland",
    short: "Swiss",
    fundedM: 700.2,
    sharePct: 5.7,
    confidence: "disclosed" as Confidence,
  },
  {
    donor: "Canada",
    short: "Canada",
    fundedM: 617.1,
    sharePct: 5.0,
    confidence: "disclosed" as Confidence,
  },
  {
    donor: "United Kingdom",
    short: "UK",
    fundedM: 599.1,
    sharePct: 4.9,
    confidence: "disclosed" as Confidence,
  },
  {
    donor: "Denmark",
    short: "Denmark",
    fundedM: 432.9,
    sharePct: 3.5,
    confidence: "disclosed" as Confidence,
  },
];

/** Cumulative donor concentration curve. */
export const DONOR_CUMULATIVE = [
  { n: 1, sharePct: 23.1, label: "Top-1" },
  { n: 3, sharePct: 44.7, label: "Top-3" },
  { n: 5, sharePct: 56.7, label: "Top-5" },
  { n: 10, sharePct: 81.5, label: "Top-10" },
];

/** Dual ledger: people hosts vs cash donors. */
export const BURDEN_ASYMMETRY = [
  {
    side: "People stock (hosts)",
    meter: "LMIC refugee host share",
    value: 68,
    unit: "pct" as const,
    note: "Carried GT 2025",
    confidence: "carried" as Confidence,
  },
  {
    side: "People stock (hosts)",
    meter: "LDC refugee host share",
    value: 26,
    unit: "pct" as const,
    note: "Carried GT 2025",
    confidence: "carried" as Confidence,
  },
  {
    side: "Cash ledger (donors)",
    meter: "FTS Top-1 share (US)",
    value: 23.1,
    unit: "pct" as const,
    note: "FTS 2026 ranking",
    confidence: "disclosed" as Confidence,
  },
  {
    side: "Cash ledger (donors)",
    meter: "FTS Top-3 share",
    value: 44.7,
    unit: "pct" as const,
    note: "US + EC + Japan",
    confidence: "disclosed" as Confidence,
  },
  {
    side: "Cash ledger (donors)",
    meter: "GHO appeal coverage",
    value: 40.4,
    unit: "pct" as const,
    note: "Aug FTS / GHO ask",
    confidence: "disclosed" as Confidence,
  },
  {
    side: "Cash ledger (donors)",
    meter: "GHO unfunded gap ($B)",
    value: 20.79,
    unit: "bn" as const,
    note: "Still open after heal",
    confidence: "disclosed" as Confidence,
  },
];

/** Intra-year cash path context: May → Aug (carried from Q3). */
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

/** Coverage heal decomposition — who paid the +16pp (editorial). */
export const HEAL_ATTRIBUTION = [
  {
    step: "May coverage",
    value: 24.4,
    kind: "base" as const,
  },
  {
    step: "US-scale donors",
    value: 7.2,
    kind: "up" as const,
    note: "Illustrative share of +16pp heal",
  },
  {
    step: "EC + Japan",
    value: 5.1,
    kind: "up" as const,
    note: "Illustrative share of +16pp heal",
  },
  {
    step: "Other Top-10",
    value: 3.7,
    kind: "up" as const,
    note: "Illustrative residual of heal",
  },
  {
    step: "Aug coverage",
    value: 40.4,
    kind: "end" as const,
  },
];

export type BurdenLane = "hosts" | "donors" | "agency" | "plans";

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
    note: "Carried — majority unchanged",
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
    note: "Carried — poorest hosts elevated",
    confidence: "carried",
  },
  {
    id: "us",
    actor: "United States (FTS)",
    short: "US",
    lane: "donors",
    meter: "Share of tracked FTS",
    prior: 0,
    newest: 23.1,
    unit: "pct",
    delta: 23.1,
    deltaUnit: "pp",
    note: "Largest single donor print",
    confidence: "disclosed",
  },
  {
    id: "top3",
    actor: "FTS Top-3 donors",
    short: "Top-3",
    lane: "donors",
    meter: "Combined share",
    prior: 0,
    newest: 44.7,
    unit: "pct",
    delta: 44.7,
    deltaUnit: "pp",
    note: "US + EC + Japan",
    confidence: "disclosed",
  },
  {
    id: "coverage",
    actor: "GHO donors (coverage)",
    short: "GHO cov.",
    lane: "donors",
    meter: "Appeal coverage",
    prior: 40.4,
    newest: 40.4,
    unit: "pct",
    delta: 0,
    deltaUnit: "pp",
    note: "Flat vs Q3 — heal already booked",
    confidence: "disclosed",
  },
  {
    id: "gap",
    actor: "Unfunded GHO ask",
    short: "GHO gap",
    lane: "donors",
    meter: "Unfunded $",
    prior: 20.79,
    newest: 20.79,
    unit: "bn",
    delta: 0,
    deltaUnit: "abs",
    note: "$21B still open",
    confidence: "disclosed",
  },
  {
    id: "unhcr",
    actor: "UNHCR early pledges",
    short: "UNHCR",
    lane: "agency",
    meter: "Early-pledge share",
    prior: 18,
    newest: 18,
    unit: "pct",
    delta: 0,
    deltaUnit: "pp",
    note: "Carried vs 2025 year-end 37%",
    confidence: "carried",
  },
  {
    id: "atrisk",
    actor: "People at risk from cuts",
    short: "At-risk",
    lane: "agency",
    meter: "Caseload at risk",
    prior: 11.6,
    newest: 11.6,
    unit: "millions",
    delta: 0,
    deltaUnit: "abs",
    note: "Carried operational flag",
    confidence: "carried",
  },
];

/** Plan coverage vs people-in-need — estimated geometry. */
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

/** Host income mix — carried GT 2025. */
export const HOSTING_INCOME = [
  { group: "Upper-middle", pct: 33, confidence: "carried" as Confidence },
  { group: "High", pct: 29, confidence: "carried" as Confidence },
  { group: "Low", pct: 18, confidence: "carried" as Confidence },
  { group: "Lower-middle", pct: 17, confidence: "carried" as Confidence },
];

/** Stock vs cash timeline across theme posts. */
export const STOCK_VS_CASH = [
  {
    vintage: "Research end-2024",
    displacedM: 123.2,
    coveragePct: 23.4,
    top1DonorPct: null as number | null,
    note: "GHO 2025 Oct FTS",
    confidence: "disclosed" as Confidence,
  },
  {
    vintage: "May MYR 2026",
    displacedM: 117.8,
    coveragePct: 24.4,
    top1DonorPct: null as number | null,
    note: "GT 2025 + GHO 31 May",
    confidence: "disclosed" as Confidence,
  },
  {
    vintage: "Q3 Aug FTS",
    displacedM: 117.8,
    coveragePct: 40.4,
    top1DonorPct: null as number | null,
    note: "Coverage heal booked",
    confidence: "disclosed" as Confidence,
  },
  {
    vintage: "Aug 202608",
    displacedM: 117.8,
    coveragePct: 40.4,
    top1DonorPct: 23.1,
    note: "Donor Top-1 unpack",
    confidence: "disclosed" as Confidence,
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
