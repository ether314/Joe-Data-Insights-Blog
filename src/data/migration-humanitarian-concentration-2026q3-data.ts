/**
 * Migration & humanitarian burden — Q3 2026 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (Who bears migration and humanitarian costs vs narratives?)
 *
 * Complements the 2026 concentration print (tip geometry) and Q3/Aug vintage
 * updates (what moved) with a stickiness cut: coverage healed +16 pp while
 * FTS Top-1 / Top-3 shares, host Top-3, and LMIC hosting stayed put — so the
 * narrative meter moved without redistributing who owns cash or people tips.
 *
 * Primary anchors (disclosed roundings; see SOURCE_NOTE):
 * - OCHA FTS 2026 donor ranking (US $2.83B = 23.1%; Top-3 ~44.7%)
 * - GHO May MYR → Aug monitoring coverage path (24.4% → 40.4%)
 * - UNHCR Global Trends 2025 host stocks / LMIC shares (carried)
 * - UNHCR Global Appeal 2026 budget ($8.505B) + early-pledge (~18%)
 * - Prior concentration: /blog/migration-humanitarian-concentration-2026
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "constructed";

export const SOURCE_NOTE =
  "Q3 concentration lens after May MYR → Aug FTS coverage heal (+16 pp) and the 2026 concentration print. FTS donor Top-1/Top-3/Top-10 shares: OCHA FTS 2026 ranking (US $2.83B = 23.1% of tracked funding; Top-3 ~44.7%) — tip flat vs the concentration print while coverage moved. GHO requirements universe: Aug 2026 monitoring ($34.87B ask; $14.08B funded; 40.4% coverage) vs May MYR ($33.66B / $8.21B / 24.4%). Host country stocks and LMIC/LDC shares carried from UNHCR Global Trends 2025 until Mid-Year Trends 2026. UNHCR 2026 needs budget $8.505B and early-pledge ~18% from Global Appeal / operational messaging. Heal-attribution pp slices and at-risk cut shares are constructed editorial decompositions — not an official HHI filing. HHI values are analytical indexes on stated bucket shares (0–10,000). Do not average donor cash shares with host people shares or with coverage %.";

export const PRIOR_CONCENTRATION_PATH =
  "/blog/migration-humanitarian-concentration-2026";
export const PRIOR_RESEARCH_PATH = "/blog/migration-humanitarian-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/migration-humanitarian-update-2026";
export const PRIOR_Q3_PATH = "/blog/migration-humanitarian-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/migration-humanitarian-update-202608";
export const RELATED_HOST_PATH = "/blog/global-refugee-hosting-burden-2024";
export const RELATED_ODA_PATH = "/blog/oecd-dac-oda-first-drop-2024";

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
    label: "Prior concentration lens (2026)",
    url: PRIOR_CONCENTRATION_PATH,
  },
  {
    label: "August donor unpack",
    url: PRIOR_AUG_PATH,
  },
] as const;

/** Headline punchline — tip stickiness under a healed coverage narrative */
export const HEADLINE = {
  /** FTS donor cash — tip flat vs 2026 concentration print */
  donorTop1Pct: 23.1,
  donorTop1Label: "United States",
  donorTop1Bn: 2.831,
  donorTop3Pct: 44.7,
  donorTop3Bn: 5.471,
  donorTop5Pct: 56.7,
  donorTop10Pct: 81.5,
  donorTrackedBn: 12.26,
  donorHhi: 1332,
  donorTop1DeltaPp: 0,
  donorTop3DeltaPp: 0,

  /** Refugee / OPNIIP host concentration (end-2025 vintage stocks) */
  hostTop1Pct: 6.6,
  hostTop1Label: "Colombia",
  hostTop1M: 2.8,
  hostTop3Pct: 18.5,
  hostTop3M: 7.9,
  hostTop5Pct: 27.0,
  hostUniverseM: 42.7,
  hostHhi: 612,
  hostTop3DeltaPp: 0,

  /** GHO appeal requirement concentration */
  appealTop1Pct: 12.0,
  appealTop1Label: "Sudan / regional",
  appealTop1Bn: 4.2,
  appealTop3Pct: 28.9,
  appealTop3Bn: 10.1,
  appealUniverseBn: 34.87,
  appealHhi: 748,

  /** Income-group hosting (people stock) */
  incomeTop1Pct: 33,
  incomeTop1Label: "Upper-middle income",
  incomeTop3Pct: 80,
  incomeLmicPct: 68,
  incomeLdcPct: 26,
  incomeHhi: 2711,
  incomeLmicDeltaPp: 0,

  /** Coverage narrative — the meter that moved */
  ghoCoverageMayPct: 24.4,
  ghoCoverageAugPct: 40.4,
  ghoCoverageDeltaPp: 16.0,
  ghoGapMayBn: 25.45,
  ghoGapAugBn: 20.79,
  ghoReqAugBn: 34.87,
  ghoFundedAugBn: 14.08,

  /** UNHCR agency tip */
  unhcrBudget2026Bn: 8.505,
  unhcrBudgetDeltaPct: -19.8,
  unhcrEarlyPledgePct: 18,
  unhcrPriorFundedPct: 37,
  unhcrEarlyDeltaPp: -19,
  atRiskCutsM: 11.6,

  /** Context */
  displacedM: 117.8,
  /** Constructed: share of +16pp heal attributed to Top-3 FTS donors */
  healTop3SharePct: 77,
  scissorsPp: 25.2,
} as const;

export type ShareRow = {
  id: string;
  label: string;
  short: string;
  value: number;
  unit: "bn" | "m" | "pct";
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** OCHA FTS 2026 donor ladder + residual of tracked funding. */
export const DONOR_SHARES: ShareRow[] = [
  {
    id: "us",
    label: "United States",
    short: "US",
    value: 2.831,
    unit: "bn",
    sharePct: 23.1,
    cumulativeSharePct: 23.1,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "ec",
    label: "European Commission",
    short: "EC",
    value: 1.75,
    unit: "bn",
    sharePct: 14.3,
    cumulativeSharePct: 37.4,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    id: "japan",
    label: "Japan",
    short: "Japan",
    value: 0.89,
    unit: "bn",
    sharePct: 7.3,
    cumulativeSharePct: 44.7,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    id: "germany",
    label: "Germany",
    short: "Germany",
    value: 0.774,
    unit: "bn",
    sharePct: 6.3,
    cumulativeSharePct: 51.0,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "sweden",
    label: "Sweden",
    short: "Sweden",
    value: 0.705,
    unit: "bn",
    sharePct: 5.7,
    cumulativeSharePct: 56.7,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    id: "norway",
    label: "Norway",
    short: "Norway",
    value: 0.702,
    unit: "bn",
    sharePct: 5.7,
    cumulativeSharePct: 62.4,
    confidence: "disclosed",
    fill: "#ec4899",
  },
  {
    id: "swiss",
    label: "Switzerland",
    short: "Swiss",
    value: 0.7,
    unit: "bn",
    sharePct: 5.7,
    cumulativeSharePct: 68.1,
    confidence: "disclosed",
    fill: "#6366f1",
  },
  {
    id: "canada",
    label: "Canada",
    short: "Canada",
    value: 0.617,
    unit: "bn",
    sharePct: 5.0,
    cumulativeSharePct: 73.1,
    confidence: "disclosed",
    fill: "#a78bfa",
  },
  {
    id: "uk",
    label: "United Kingdom",
    short: "UK",
    value: 0.599,
    unit: "bn",
    sharePct: 4.9,
    cumulativeSharePct: 78.0,
    confidence: "disclosed",
    fill: "#10b981",
  },
  {
    id: "denmark",
    label: "Denmark",
    short: "Denmark",
    value: 0.433,
    unit: "bn",
    sharePct: 3.5,
    cumulativeSharePct: 81.5,
    confidence: "disclosed",
    fill: "#64748b",
  },
  {
    id: "rest-donors",
    label: "All other tracked FTS donors",
    short: "Rest",
    value: 2.269,
    unit: "bn",
    sharePct: 18.5,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#94a3b8",
    note: "Closes $12.26B tracked after disclosed top-10",
  },
];

export const DONOR_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 23.1, equalPct: 9.1 },
  { rank: 2, label: "Top-2", sharePct: 37.4, equalPct: 18.2 },
  { rank: 3, label: "Top-3", sharePct: 44.7, equalPct: 27.3 },
  { rank: 5, label: "Top-5", sharePct: 56.7, equalPct: 45.5 },
  { rank: 10, label: "Top-10", sharePct: 81.5, equalPct: 90.9 },
  { rank: 11, label: "All", sharePct: 100, equalPct: 100 },
];

/** End-2025 host stocks (refugees + OPNIIP) vs ~42.7M host universe. */
export const HOST_SHARES: ShareRow[] = [
  {
    id: "colombia",
    label: "Colombia",
    short: "Colombia",
    value: 2.8,
    unit: "m",
    sharePct: 6.6,
    cumulativeSharePct: 6.6,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "germany",
    label: "Germany",
    short: "Germany",
    value: 2.7,
    unit: "m",
    sharePct: 6.3,
    cumulativeSharePct: 12.9,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    id: "turkiye",
    label: "Türkiye",
    short: "Türkiye",
    value: 2.4,
    unit: "m",
    sharePct: 5.6,
    cumulativeSharePct: 18.5,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    id: "uganda",
    label: "Uganda",
    short: "Uganda",
    value: 1.9,
    unit: "m",
    sharePct: 4.4,
    cumulativeSharePct: 22.9,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "iran",
    label: "Iran",
    short: "Iran",
    value: 1.7,
    unit: "m",
    sharePct: 4.0,
    cumulativeSharePct: 26.9,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    id: "pakistan",
    label: "Pakistan",
    short: "Pakistan",
    value: 1.6,
    unit: "m",
    sharePct: 3.7,
    cumulativeSharePct: 30.6,
    confidence: "carried",
    fill: "#ec4899",
  },
  {
    id: "chad",
    label: "Chad",
    short: "Chad",
    value: 1.2,
    unit: "m",
    sharePct: 2.8,
    cumulativeSharePct: 33.4,
    confidence: "disclosed",
    fill: "#6366f1",
  },
  {
    id: "bangladesh",
    label: "Bangladesh",
    short: "Bangladesh",
    value: 1.1,
    unit: "m",
    sharePct: 2.6,
    cumulativeSharePct: 36.0,
    confidence: "carried",
    fill: "#a78bfa",
  },
  {
    id: "rest-hosts",
    label: "All other host countries",
    short: "Rest",
    value: 27.3,
    unit: "m",
    sharePct: 64.0,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#94a3b8",
  },
];

/** GHO plan requirement shares vs $34.87B ask (estimated plan geometry). */
export const APPEAL_SHARES: ShareRow[] = [
  {
    id: "sudan",
    label: "Sudan / regional",
    short: "Sudan",
    value: 4.2,
    unit: "bn",
    sharePct: 12.0,
    cumulativeSharePct: 12.0,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "ukraine",
    label: "Ukraine / regional",
    short: "Ukraine",
    value: 3.1,
    unit: "bn",
    sharePct: 8.9,
    cumulativeSharePct: 20.9,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    id: "opt",
    label: "oPt / regional",
    short: "oPt",
    value: 2.8,
    unit: "bn",
    sharePct: 8.0,
    cumulativeSharePct: 28.9,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    id: "drc",
    label: "DRC / regional",
    short: "DRC",
    value: 2.6,
    unit: "bn",
    sharePct: 7.5,
    cumulativeSharePct: 36.4,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "syria",
    label: "Syria / regional",
    short: "Syria",
    value: 2.4,
    unit: "bn",
    sharePct: 6.9,
    cumulativeSharePct: 43.3,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "afghan",
    label: "Afghanistan",
    short: "Afghanistan",
    value: 2.1,
    unit: "bn",
    sharePct: 6.0,
    cumulativeSharePct: 49.3,
    confidence: "estimated",
    fill: "#ec4899",
  },
  {
    id: "sahel",
    label: "Sahel / multi",
    short: "Sahel",
    value: 1.8,
    unit: "bn",
    sharePct: 5.2,
    cumulativeSharePct: 54.5,
    confidence: "estimated",
    fill: "#6366f1",
  },
  {
    id: "horn",
    label: "Horn of Africa",
    short: "Horn",
    value: 1.6,
    unit: "bn",
    sharePct: 4.6,
    cumulativeSharePct: 59.1,
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    id: "rest-appeals",
    label: "All other GHO plans",
    short: "Rest",
    value: 14.27,
    unit: "bn",
    sharePct: 40.9,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#94a3b8",
  },
];

export const INCOME_SHARES: ShareRow[] = [
  {
    id: "umi",
    label: "Upper-middle income",
    short: "UMI",
    value: 33,
    unit: "pct",
    sharePct: 33,
    cumulativeSharePct: 33,
    confidence: "carried",
    fill: "#0ea5e9",
  },
  {
    id: "hi",
    label: "High income",
    short: "HI",
    value: 29,
    unit: "pct",
    sharePct: 29,
    cumulativeSharePct: 62,
    confidence: "carried",
    fill: "#8b5cf6",
  },
  {
    id: "lmi",
    label: "Lower-middle income",
    short: "LMI",
    value: 18,
    unit: "pct",
    sharePct: 18,
    cumulativeSharePct: 80,
    confidence: "carried",
    fill: "#f43f5e",
  },
  {
    id: "li",
    label: "Low income",
    short: "LI",
    value: 20,
    unit: "pct",
    sharePct: 20,
    cumulativeSharePct: 100,
    confidence: "carried",
    fill: "#f59e0b",
  },
];

export type LensId = "donors" | "hosts" | "appeals" | "income";

export const LENS_COMPARE = [
  {
    id: "donors" as LensId,
    label: "FTS donors",
    top1Pct: HEADLINE.donorTop1Pct,
    top1Label: HEADLINE.donorTop1Label,
    top3Pct: HEADLINE.donorTop3Pct,
    hhi: HEADLINE.donorHhi,
    deltaTop1Pp: HEADLINE.donorTop1DeltaPp,
    unitNote: "of ~$12.3B tracked FTS",
    fill: "#0ea5e9",
  },
  {
    id: "hosts" as LensId,
    label: "Refugee hosts",
    top1Pct: HEADLINE.hostTop1Pct,
    top1Label: HEADLINE.hostTop1Label,
    top3Pct: HEADLINE.hostTop3Pct,
    hhi: HEADLINE.hostHhi,
    deltaTop1Pp: 0,
    unitNote: "of ~42.7M host universe",
    fill: "#f43f5e",
  },
  {
    id: "appeals" as LensId,
    label: "GHO appeals",
    top1Pct: HEADLINE.appealTop1Pct,
    top1Label: HEADLINE.appealTop1Label,
    top3Pct: HEADLINE.appealTop3Pct,
    hhi: HEADLINE.appealHhi,
    deltaTop1Pp: 0,
    unitNote: "of $34.87B requirements",
    fill: "#f59e0b",
  },
  {
    id: "income" as LensId,
    label: "Host income groups",
    top1Pct: HEADLINE.incomeTop1Pct,
    top1Label: HEADLINE.incomeTop1Label,
    top3Pct: HEADLINE.incomeTop3Pct,
    hhi: HEADLINE.incomeHhi,
    deltaTop1Pp: 0,
    unitNote: "of refugee host stock",
    fill: "#8b5cf6",
  },
];

export const HHI_BANDS = [
  { id: "donors", label: "FTS donors", hhi: 1332, band: "moderate", fill: "#0ea5e9" },
  { id: "hosts", label: "Host countries", hhi: 612, band: "unconcentrated", fill: "#f43f5e" },
  { id: "appeals", label: "GHO appeals", hhi: 748, band: "unconcentrated", fill: "#f59e0b" },
  { id: "income", label: "Income groups", hhi: 2711, band: "high", fill: "#8b5cf6" },
];

export function hhiBand(hhi: number): string {
  if (hhi < 1500) return "unconcentrated";
  if (hhi < 2500) return "moderate";
  return "high";
}

export function sharesForLens(lens: LensId): ShareRow[] {
  switch (lens) {
    case "donors":
      return DONOR_SHARES;
    case "hosts":
      return HOST_SHARES;
    case "appeals":
      return APPEAL_SHARES;
    case "income":
      return INCOME_SHARES;
  }
}

/** Vintage slope: tip meters across research → concentration → Q3/Aug. */
export const VINTAGE_SLOPE = [
  {
    vintage: "Research 2026",
    donorTop1Pct: 22.5,
    donorTop3Pct: 43.0,
    hostTop3Pct: 19.0,
    incomeLmicPct: 69,
    coveragePct: 22.0,
    note: "Early-year framing (rounded)",
  },
  {
    vintage: "Conc. 2026",
    donorTop1Pct: 23.1,
    donorTop3Pct: 44.7,
    hostTop3Pct: 18.5,
    incomeLmicPct: 68,
    coveragePct: 40.4,
    note: "Concentration print lock",
  },
  {
    vintage: "Q3 / Aug",
    donorTop1Pct: 23.1,
    donorTop3Pct: 44.7,
    hostTop3Pct: 18.5,
    incomeLmicPct: 68,
    coveragePct: 40.4,
    note: "Tip flat; coverage already at Aug",
  },
];

/** May → Aug narrative vs tip stickiness dual path. */
export const STICKINESS_PATH = [
  {
    label: "May MYR",
    coveragePct: 24.4,
    donorTop1Pct: 23.1,
    donorTop3Pct: 44.7,
    hostTop3Pct: 18.5,
    lmicPct: 68,
    gapBn: 25.45,
  },
  {
    label: "Aug FTS",
    coveragePct: 40.4,
    donorTop1Pct: 23.1,
    donorTop3Pct: 44.7,
    hostTop3Pct: 18.5,
    lmicPct: 68,
    gapBn: 20.79,
  },
];

/** Constructed heal attribution — who paid the +16 pp (editorial). */
export const HEAL_ATTRIBUTION = [
  { id: "base", label: "May coverage", value: 24.4, kind: "base" as const, fill: "#94a3b8" },
  {
    id: "us",
    label: "US-scale donors",
    value: 7.2,
    kind: "up" as const,
    fill: "#0ea5e9",
    note: "Illustrative share of +16pp",
  },
  {
    id: "ecjp",
    label: "EC + Japan",
    value: 5.1,
    kind: "up" as const,
    fill: "#8b5cf6",
    note: "Illustrative share of +16pp",
  },
  {
    id: "top10",
    label: "Other Top-10",
    value: 3.7,
    kind: "up" as const,
    fill: "#14b8a6",
    note: "Illustrative share of +16pp",
  },
  {
    id: "rest",
    label: "Rest of FTS",
    value: 0.8,
    kind: "up" as const,
    fill: "#f59e0b",
    note: "Illustrative share of +16pp",
  },
  {
    id: "creep",
    label: "Ask creep",
    value: -0.8,
    kind: "down" as const,
    fill: "#f43f5e",
  },
  { id: "end", label: "Aug coverage", value: 40.4, kind: "end" as const, fill: "#10b981" },
];

/** Share of +16pp heal by donor cluster (constructed; sums ~100%). */
export const HEAL_SHARE_PIE = [
  { id: "us", label: "US-scale", sharePct: 45, fill: "#0ea5e9" },
  { id: "ecjp", label: "EC + Japan", sharePct: 32, fill: "#8b5cf6" },
  { id: "top10", label: "Other Top-10", sharePct: 23, fill: "#14b8a6" },
  { id: "rest", label: "Rest of FTS", sharePct: 5, fill: "#f59e0b" },
  { id: "creep", label: "Ask creep (offset)", sharePct: -5, fill: "#f43f5e" },
];

/** Burden scissors: cash tip vs people tip vs coverage narrative. */
export const SCISSORS = [
  {
    id: "donor-t1",
    label: "FTS Top-1",
    value: 23.1,
    side: "cash" as const,
    fill: "#0ea5e9",
  },
  {
    id: "donor-t3",
    label: "FTS Top-3",
    value: 44.7,
    side: "cash" as const,
    fill: "#38bdf8",
  },
  {
    id: "host-t3",
    label: "Host Top-3",
    value: 18.5,
    side: "people" as const,
    fill: "#f43f5e",
  },
  {
    id: "lmic",
    label: "LMIC hosts",
    value: 68,
    side: "people" as const,
    fill: "#fb7185",
  },
  {
    id: "cov",
    label: "GHO coverage",
    value: 40.4,
    side: "narrative" as const,
    fill: "#f59e0b",
  },
  {
    id: "early",
    label: "UNHCR early pledge",
    value: 18,
    side: "narrative" as const,
    fill: "#a78bfa",
  },
];

/** UNHCR agency concentration / scarcity meters. */
export const UNHCR_TIP = [
  {
    id: "budget26",
    label: "2026 needs budget",
    value: 8.505,
    unit: "bn" as const,
    sharePct: 100,
    fill: "#0ea5e9",
    note: "Global Appeal 2026",
  },
  {
    id: "budget25",
    label: "2025 needs (prior)",
    value: 10.604,
    unit: "bn" as const,
    sharePct: 124.7,
    fill: "#94a3b8",
    note: "−19.8% YoY strip-back",
  },
  {
    id: "early",
    label: "Early-pledge share",
    value: 18,
    unit: "pct" as const,
    sharePct: 18,
    fill: "#f43f5e",
    note: "vs 37% year-end 2025 funded",
  },
  {
    id: "atrisk",
    label: "At-risk from cuts",
    value: 11.6,
    unit: "m" as const,
    sharePct: 8.5,
    fill: "#f59e0b",
    note: "of ~136M planning figure",
  },
];

/** Plan leverage: req share × coverage (bubble ∝ PIN). */
export const PLAN_LEVERAGE = [
  { id: "sudan", short: "Sudan", reqSharePct: 12.0, coveragePct: 28.0, pinM: 30.4, fill: "#0ea5e9" },
  { id: "ukraine", short: "Ukraine", reqSharePct: 8.9, coveragePct: 58.0, pinM: 14.6, fill: "#8b5cf6" },
  { id: "opt", short: "oPt", reqSharePct: 8.0, coveragePct: 42.0, pinM: 3.3, fill: "#f43f5e" },
  { id: "drc", short: "DRC", reqSharePct: 7.5, coveragePct: 32.0, pinM: 25.4, fill: "#14b8a6" },
  { id: "syria", short: "Syria", reqSharePct: 6.9, coveragePct: 36.0, pinM: 16.7, fill: "#f59e0b" },
  { id: "afghan", short: "Afghan.", reqSharePct: 6.0, coveragePct: 30.0, pinM: 23.7, fill: "#ec4899" },
  { id: "sahel", short: "Sahel", reqSharePct: 5.2, coveragePct: 25.0, pinM: 14.1, fill: "#6366f1" },
  { id: "horn", short: "Horn", reqSharePct: 4.6, coveragePct: 35.0, pinM: 18.5, fill: "#a78bfa" },
];

/** Host vs donor role scatter. */
export const ROLE_SCATTER = [
  { id: "colombia", short: "Colombia", hostedM: 2.8, donorSharePct: 0.2, role: "host-only" as const, fill: "#f43f5e" },
  { id: "germany", short: "Germany", hostedM: 2.7, donorSharePct: 6.3, role: "both" as const, fill: "#8b5cf6" },
  { id: "turkiye", short: "Türkiye", hostedM: 2.4, donorSharePct: 0.3, role: "host-heavy" as const, fill: "#f59e0b" },
  { id: "uganda", short: "Uganda", hostedM: 1.9, donorSharePct: 0.1, role: "host-only" as const, fill: "#14b8a6" },
  { id: "us", short: "US", hostedM: 0.44, donorSharePct: 23.1, role: "donor-heavy" as const, fill: "#0ea5e9" },
  { id: "japan", short: "Japan", hostedM: 0.02, donorSharePct: 7.3, role: "donor-heavy" as const, fill: "#6366f1" },
  { id: "sweden", short: "Sweden", hostedM: 0.28, donorSharePct: 5.7, role: "donor-heavy" as const, fill: "#ec4899" },
  { id: "ec", short: "EC", hostedM: 0, donorSharePct: 14.3, role: "donor-only" as const, fill: "#a78bfa" },
];

/** Δ scoreboard vs May / prior concentration framing. */
export const DELTA_SCOREBOARD = [
  {
    meter: "GHO coverage",
    prior: 24.4,
    newest: 40.4,
    deltaPp: 16.0,
    unit: "pct",
    moved: true,
    fill: "#10b981",
  },
  {
    meter: "FTS Top-1 (US)",
    prior: 23.1,
    newest: 23.1,
    deltaPp: 0,
    unit: "pct",
    moved: false,
    fill: "#0ea5e9",
  },
  {
    meter: "FTS Top-3",
    prior: 44.7,
    newest: 44.7,
    deltaPp: 0,
    unit: "pct",
    moved: false,
    fill: "#38bdf8",
  },
  {
    meter: "Host Top-3",
    prior: 18.5,
    newest: 18.5,
    deltaPp: 0,
    unit: "pct",
    moved: false,
    fill: "#f43f5e",
  },
  {
    meter: "LMIC host share",
    prior: 68,
    newest: 68,
    deltaPp: 0,
    unit: "pct",
    moved: false,
    fill: "#fb7185",
  },
  {
    meter: "UNHCR early pledge",
    prior: 37,
    newest: 18,
    deltaPp: -19,
    unit: "pct",
    moved: true,
    fill: "#a78bfa",
  },
];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtBn(n: number, digits = 2): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtM(n: number, digits = 1): string {
  return `${n.toFixed(digits)}M`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}
