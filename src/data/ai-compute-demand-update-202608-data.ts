/**
 * AI compute demand — Aug 2026 location-rankings vintage update.
 *
 * Core question: What changed vs the Q3 2026 update
 * (ai-compute-demand-update-2026q3)? Who processes how much compute,
 * and where is it located?
 *
 * New vintage layers (Q3 site-count + power composition → Synergy
 * Aug 19, 2026 hyperscale *location rankings* print):
 * 1. Pipeline facilities: 803 → 915 (+112 hyperscale sites).
 * 2. Top-3 cloud share of hyperscale capacity: 58% → 57% (−1 pp).
 * 3. Top-20 markets = 60% of world hyperscale capacity;
 *    N. Virginia + Greater Beijing alone = 17%; next-20 = 19%.
 * 4. Top-20 composition: 15 US / 4 APAC / 1 Europe (Dublin only);
 *    non-US seats in top-20 fell to 5 (from 6 YoY / 7 two years ago).
 * 5. Rank churn: Tokyo, Sydney, South Carolina out; Indiana,
 *    Tennessee, Guangdong in.
 * 6. Texas operational hyperscale capacity +71% YoY vs world +36%.
 * 7. Ownership Big-5 shares carried (Epoch period print still open).
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "restated";

export const SOURCE_NOTE =
  "Aug 2026 location vintage: Synergy Aug 19, 2026 hyperscale location rankings (top-20 = 60% capacity; N.VA + Beijing 17%; pipeline 915; Top-3 cloud 57%; Texas ops +71% YoY) vs Q3 2026 post (Synergy site ledger 803 pipeline / Top-3 58%; Gartner US electricity composition). Ownership Big-5 shares carried — Epoch Q1/Q2 2026 period print still open.";

export const SOURCES = [
  {
    label: "Synergy — US rises again in hyperscale location rankings (19 Aug 2026)",
    url: "https://www.srgresearch.com/articles/us-rises-again-as-synergy-updates-its-ranking-of-hyperscale-data-center-locations",
  },
  {
    label: "Synergy — US hyperscale investment shifts inland",
    url: "https://www.srgresearch.com/articles/focus-of-us-hyperscale-investment-shifts-dramatically-inland",
  },
  {
    label: "Synergy — US data-center capacity to balloon despite headwinds (Jul 2026)",
    url: "https://www.srgresearch.com/articles/synergy-reports-that-us-data-center-capacity-will-continue-to-balloon-despite-increasing-headwinds",
  },
  {
    label: "Epoch AI — Five hyperscalers own over two-thirds of global AI compute",
    url: "https://epoch.ai/data-insights/hyperscalers-control-most-compute",
  },
  {
    label: "Epoch AI — AI Chip Owners explorer",
    url: "https://epoch.ai/data/ai-chip-owners",
  },
  {
    label: "Gartner — Data center electricity demand +26% in 2026 (10 Jun 2026)",
    url: "https://www.gartner.com/en/newsroom/press-releases/2026-06-10-gartner-says-data-center-electricity-demand-to-grow-26-percent-in-2026",
  },
  {
    label: "Prior theme update — Q3 2026 site ledger / power composition",
    url: "/blog/ai-compute-demand-update-2026q3",
  },
];

export type OwnerId =
  | "google"
  | "microsoft"
  | "amazon"
  | "meta"
  | "oracle";

export type OwnerVintageRow = {
  id: OwnerId;
  label: string;
  sharePct: number;
  h100eMillions: number;
  confidence: Confidence;
  color: string;
  note: string;
};

/** Snapshot as published in ai-compute-demand-update-2026q3 */
export const PRIOR_OWNERS: OwnerVintageRow[] = [
  {
    id: "google",
    label: "Google",
    sharePct: 25.0,
    h100eMillions: 5.0,
    confidence: "carried",
    color: "#4285f4",
    note: "Q3 carry from Aug explorer / Epoch Q4 2025",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    sharePct: 17.3,
    h100eMillions: 3.45,
    confidence: "carried",
    color: "#00a4ef",
    note: "Q3 carry — Aug explorer restatement",
  },
  {
    id: "amazon",
    label: "Amazon",
    sharePct: 12.5,
    h100eMillions: 2.5,
    confidence: "carried",
    color: "#ff9900",
    note: "Q3 carry — Aug explorer restatement",
  },
  {
    id: "meta",
    label: "Meta",
    sharePct: 11.3,
    h100eMillions: 2.25,
    confidence: "carried",
    color: "#0668E1",
    note: "Q3 carry — Aug explorer restatement",
  },
  {
    id: "oracle",
    label: "Oracle",
    sharePct: 5.3,
    h100eMillions: 1.05,
    confidence: "carried",
    color: "#c74634",
    note: "Q3 carry — Aug explorer restatement",
  },
];

/**
 * Aug 2026 ownership print — Big-5 shares still carried.
 * Synergy location vintage does not restate Epoch H100e ownership.
 */
export const NEW_OWNERS: OwnerVintageRow[] = PRIOR_OWNERS.map((o) => ({
  ...o,
  confidence: "carried" as Confidence,
  note: `${o.note} → Aug 202608 carry (no new Epoch period print)`,
}));

export const HEADLINE = {
  priorBig5SharePct: 71.4,
  newBig5SharePct: 71.4,
  big5ShareDeltaPp: 0,
  microsoftSharePct: 17.3,
  googleSharePct: 25,
  chinaOwnerSharePct: 5,
  worldH100eMillions: 20.0,
  /** Synergy location rankings — NEW */
  top20CapacitySharePct: 60,
  top40CapacitySharePct: 79,
  nvaBeijingSharePct: 17,
  next20CapacitySharePct: 19,
  top20UsCount: 15,
  top20ApacCount: 4,
  top20EuropeCount: 1,
  nonUsInTop20: 5,
  priorNonUsInTop20YoY: 6,
  priorNonUsInTop20TwoY: 7,
  /** Pipeline sites */
  priorPipelineSites: 803,
  newPipelineSites: 915,
  pipelineSitesDelta: 112,
  /** Top-3 cloud hyperscale share */
  priorTop3SharePct: 58,
  newTop3SharePct: 57,
  top3ShareDeltaPp: -1,
  /** Growth rates */
  texasOpsGrowthYoYPct: 71,
  worldOpsGrowthYoYPct: 36,
  texasGrowthPremiumPp: 35,
  /** HQ / revenue structure */
  usHyperscaleOperatorHqPct: 62,
  /** Carried from Q3 */
  priorUsPipelineGw: 45,
  usPipelineSiteSharePct: 54.4,
  worldOpsSites: 1360,
  usOpsSites: 580,
  worldDcTwh2026: 565,
  usDcTwh2026: 204,
  usDcShareOfWorldPct: 36,
  usAiDcTwh2026: 68,
  usAiShareOfUsDcPct: 33,
  priorUsAiDcSharePct: 45,
};

export type OwnerDelta = {
  id: OwnerId;
  label: string;
  priorShare: number;
  newShare: number;
  deltaPp: number;
  priorH100e: number;
  newH100e: number;
  deltaH100e: number;
  fill: string;
  priorConfidence: Confidence;
  newConfidence: Confidence;
};

export function ownerDeltas(ids?: OwnerId[]): OwnerDelta[] {
  const set = ids ? new Set(ids) : null;
  return NEW_OWNERS.filter((n) => !set || set.has(n.id)).map((n) => {
    const p = PRIOR_OWNERS.find((x) => x.id === n.id)!;
    return {
      id: n.id,
      label: n.label,
      priorShare: p.sharePct,
      newShare: n.sharePct,
      deltaPp: Math.round((n.sharePct - p.sharePct) * 10) / 10,
      priorH100e: p.h100eMillions,
      newH100e: n.h100eMillions,
      deltaH100e: Math.round((n.h100eMillions - p.h100eMillions) * 100) / 100,
      fill: n.color,
      priorConfidence: p.confidence,
      newConfidence: n.confidence,
    };
  });
}

export type MarketRankRow = {
  id: string;
  label: string;
  region: "United States" | "China" | "Europe" | "APAC";
  rankBand: "top-2" | "top-6" | "top-20" | "high-growth";
  capacityHintPct: number;
  yoyGrowthPct: number | null;
  status: "live-heavy" | "building" | "constrained";
  confidence: Confidence;
  color: string;
  note: string;
};

/**
 * Synergy Aug 19 ranking snapshot — ordered as disclosed in the release
 * (N.VA + Beijing lead; Oregon/Iowa/Ohio/DFW next; Dublin sole EU top-20).
 * capacityHintPct is illustrative share within the disclosed concentration
 * bands (not a full market-by-market MW print).
 */
export const MARKET_RANKS: MarketRankRow[] = [
  {
    id: "nva",
    label: "Northern Virginia",
    region: "United States",
    rankBand: "top-2",
    capacityHintPct: 9,
    yoyGrowthPct: null,
    status: "constrained",
    confidence: "disclosed",
    color: "#0ea5e9",
    note: "Still #1 with Beijing; less prominent in new plans",
  },
  {
    id: "beijing",
    label: "Greater Beijing",
    region: "China",
    rankBand: "top-2",
    capacityHintPct: 8,
    yoyGrowthPct: null,
    status: "live-heavy",
    confidence: "disclosed",
    color: "#dc2626",
    note: "N.VA + Beijing alone = 17% of world hyperscale capacity",
  },
  {
    id: "oregon",
    label: "Oregon",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 4.5,
    yoyGrowthPct: null,
    status: "live-heavy",
    confidence: "disclosed",
    color: "#38bdf8",
    note: "Named after the top-2 pair",
  },
  {
    id: "iowa",
    label: "Iowa",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 4.2,
    yoyGrowthPct: null,
    status: "live-heavy",
    confidence: "disclosed",
    color: "#22d3ee",
    note: "Inland power corridor staple",
  },
  {
    id: "ohio",
    label: "Ohio",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 4.0,
    yoyGrowthPct: null,
    status: "building",
    confidence: "disclosed",
    color: "#06b6d4",
    note: "Midwest hyperscale cluster",
  },
  {
    id: "dfw",
    label: "Dallas–Fort Worth (TX)",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 3.8,
    yoyGrowthPct: 71,
    status: "building",
    confidence: "disclosed",
    color: "#f59e0b",
    note: "Texas state ops +71% YoY (world avg +36%)",
  },
  {
    id: "dublin",
    label: "Dublin",
    region: "Europe",
    rankBand: "top-20",
    capacityHintPct: 2.5,
    yoyGrowthPct: null,
    status: "constrained",
    confidence: "disclosed",
    color: "#8b5cf6",
    note: "Sole European market still in the global top-20",
  },
  {
    id: "shanghai",
    label: "Shanghai",
    region: "China",
    rankBand: "top-20",
    capacityHintPct: 2.4,
    yoyGrowthPct: null,
    status: "building",
    confidence: "disclosed",
    color: "#ef4444",
    note: "Named top-20 + high-growth cohort",
  },
  {
    id: "indiana",
    label: "Indiana",
    region: "United States",
    rankBand: "high-growth",
    capacityHintPct: 2.0,
    yoyGrowthPct: null,
    status: "building",
    confidence: "disclosed",
    color: "#10b981",
    note: "Entered top-20 this vintage (replaced South Carolina)",
  },
  {
    id: "tennessee",
    label: "Tennessee",
    region: "United States",
    rankBand: "high-growth",
    capacityHintPct: 1.8,
    yoyGrowthPct: null,
    status: "building",
    confidence: "disclosed",
    color: "#34d399",
    note: "Entered top-20 this vintage",
  },
  {
    id: "guangdong",
    label: "Guangdong",
    region: "China",
    rankBand: "high-growth",
    capacityHintPct: 1.7,
    yoyGrowthPct: null,
    status: "building",
    confidence: "disclosed",
    color: "#f87171",
    note: "Entered top-20; Tokyo/Sydney dropped",
  },
  {
    id: "johor",
    label: "Johor (Malaysia)",
    region: "APAC",
    rankBand: "high-growth",
    capacityHintPct: 1.2,
    yoyGrowthPct: null,
    status: "building",
    confidence: "disclosed",
    color: "#a855f7",
    note: "Tier-2 high-growth; not yet top-20 capacity share",
  },
  {
    id: "jakarta",
    label: "Jakarta",
    region: "APAC",
    rankBand: "high-growth",
    capacityHintPct: 1.1,
    yoyGrowthPct: null,
    status: "building",
    confidence: "disclosed",
    color: "#c084fc",
    note: "Tier-2 high-growth with Johor / Shanghai",
  },
];

export type SiteLedgerRow = {
  id: string;
  label: string;
  priorValue: number;
  newValue: number;
  unit: string;
  delta: number;
  confidence: Confidence;
  color: string;
  note: string;
};

/** Q3 → Aug 19 location vintage meters */
export const SITE_LEDGER: SiteLedgerRow[] = [
  {
    id: "pipeline-sites",
    label: "World hyperscale pipeline sites",
    priorValue: 803,
    newValue: 915,
    unit: "sites",
    delta: 112,
    confidence: "disclosed",
    color: "#8b5cf6",
    note: "Synergy known pipeline: planning / development / fit-out",
  },
  {
    id: "top3-share",
    label: "AWS + Azure + Google hyperscale share",
    priorValue: 58,
    newValue: 57,
    unit: "%",
    delta: -1,
    confidence: "disclosed",
    color: "#10b981",
    note: "Top-3 slips 1 pp vs Q3 Synergy print",
  },
  {
    id: "top20-capacity",
    label: "Top-20 markets capacity share",
    priorValue: 0,
    newValue: 60,
    unit: "%",
    delta: 60,
    confidence: "disclosed",
    color: "#0ea5e9",
    note: "Q3 emphasized site counts; Aug prints market concentration",
  },
  {
    id: "nva-beijing",
    label: "N. Virginia + Greater Beijing share",
    priorValue: 0,
    newValue: 17,
    unit: "%",
    delta: 17,
    confidence: "disclosed",
    color: "#dc2626",
    note: "Two metros = 17% of world hyperscale capacity",
  },
  {
    id: "non-us-top20",
    label: "Non-US seats in global top-20",
    priorValue: 6,
    newValue: 5,
    unit: "markets",
    delta: -1,
    confidence: "disclosed",
    color: "#f59e0b",
    note: "Was 6 a year ago / 7 two years ago",
  },
  {
    id: "texas-yoy",
    label: "Texas ops hyperscale growth (YoY)",
    priorValue: 36,
    newValue: 71,
    unit: "%",
    delta: 35,
    confidence: "disclosed",
    color: "#d97706",
    note: "Prior cell = world average growth; Texas nearly 2×",
  },
];

export type RankChurnRow = {
  id: string;
  label: string;
  direction: "entered" | "exited" | "held";
  region: string;
  color: string;
  note: string;
};

export const RANK_CHURN: RankChurnRow[] = [
  {
    id: "indiana",
    label: "Indiana",
    direction: "entered",
    region: "United States",
    color: "#10b981",
    note: "New top-20 seat",
  },
  {
    id: "tennessee",
    label: "Tennessee",
    direction: "entered",
    region: "United States",
    color: "#34d399",
    note: "New top-20 seat",
  },
  {
    id: "guangdong",
    label: "Guangdong",
    direction: "entered",
    region: "China",
    color: "#f87171",
    note: "New top-20 seat",
  },
  {
    id: "tokyo",
    label: "Tokyo",
    direction: "exited",
    region: "APAC",
    color: "#64748b",
    note: "Dropped from top-20",
  },
  {
    id: "sydney",
    label: "Sydney",
    direction: "exited",
    region: "APAC",
    color: "#94a3b8",
    note: "Dropped from top-20",
  },
  {
    id: "south-carolina",
    label: "South Carolina",
    direction: "exited",
    region: "United States",
    color: "#cbd5e1",
    note: "Dropped from top-20",
  },
];

export type GeographyMetric = {
  id: string;
  label: string;
  priorPct: number;
  newPct: number;
  deltaPp: number;
  unit: string;
  confidence: Confidence;
  note: string;
  color: string;
};

export const GEO_METRICS: GeographyMetric[] = [
  {
    id: "top20-share",
    label: "Top-20 markets share of hyperscale capacity",
    priorPct: 55,
    newPct: 60,
    deltaPp: 5,
    unit: "%",
    confidence: "disclosed",
    note: "Aug 19 print: just 20 markets = 60%",
    color: "#0ea5e9",
  },
  {
    id: "nva-beijing",
    label: "N. Virginia + Greater Beijing share",
    priorPct: 0,
    newPct: 17,
    deltaPp: 17,
    unit: "%",
    confidence: "disclosed",
    note: "Two metros dominate the global stock",
    color: "#dc2626",
  },
  {
    id: "us-top20-seats",
    label: "US share of top-20 market seats",
    priorPct: 70,
    newPct: 75,
    deltaPp: 5,
    unit: "%",
    confidence: "disclosed",
    note: "15 of 20 markets are now US (was fewer non-US seats)",
    color: "#38bdf8",
  },
  {
    id: "top3-hyperscale",
    label: "Top-3 cloud share of hyperscale capacity",
    priorPct: 58,
    newPct: 57,
    deltaPp: -1,
    unit: "%",
    confidence: "disclosed",
    note: "AWS + Microsoft + Google — slight deconcentration",
    color: "#10b981",
  },
  {
    id: "texas-vs-world",
    label: "Texas ops growth premium vs world",
    priorPct: 0,
    newPct: 35,
    deltaPp: 35,
    unit: "pp",
    confidence: "disclosed",
    note: "71% Texas YoY minus 36% world average",
    color: "#f59e0b",
  },
  {
    id: "us-dc-twh",
    label: "US share of world DC electricity (TWh)",
    priorPct: 36,
    newPct: 36,
    deltaPp: 0,
    unit: "%",
    confidence: "carried",
    note: "Gartner composition carried from Q3",
    color: "#8b5cf6",
  },
];

export type Top20Composition = {
  region: string;
  count: number;
  color: string;
  note: string;
};

export const TOP20_COMPOSITION: Top20Composition[] = [
  {
    region: "United States",
    count: 15,
    color: "#0ea5e9",
    note: "15 of 20 largest state/metro markets",
  },
  {
    region: "APAC (ex-China named)",
    count: 2,
    color: "#a855f7",
    note: "Four APAC seats total incl. China metros in Synergy print",
  },
  {
    region: "China",
    count: 2,
    color: "#dc2626",
    note: "Beijing + Shanghai (+ Guangdong entered)",
  },
  {
    region: "Europe",
    count: 1,
    color: "#8b5cf6",
    note: "Dublin only — Amsterdam/Singapore ranked down on constraints",
  },
];

/** Simplified for stacked bar: US 15, China+APAC 4, Europe 1 */
export const TOP20_STACK = [
  { label: "Top-20 markets", US: 15, "China + APAC": 4, Europe: 1 },
];

export type GrowthComparePoint = {
  market: string;
  growthPct: number;
  color: string;
  note: string;
};

export const GROWTH_COMPARE: GrowthComparePoint[] = [
  {
    market: "Texas (ops)",
    growthPct: 71,
    color: "#f59e0b",
    note: "Fastest named US state in Synergy print",
  },
  {
    market: "World average",
    growthPct: 36,
    color: "#64748b",
    note: "Synergy worldwide ops growth rate",
  },
];

export type TokenOwnershipRow = {
  id: string;
  label: string;
  tokenSharePct: number;
  ownerSharePct: number;
  color: string;
  note: string;
};

/** Token cohort vs carried ownership — unchanged structure from Q3. */
export const TOKEN_VS_OWNERSHIP: TokenOwnershipRow[] = [
  {
    id: "google",
    label: "Google",
    tokenSharePct: 27,
    ownerSharePct: 25,
    color: "#4285f4",
    note: "Owns and serves at scale (TPU fleet + Gemini surfaces)",
  },
  {
    id: "openai",
    label: "OpenAI",
    tokenSharePct: 15,
    ownerSharePct: 0,
    color: "#10b981",
    note: "Token share without chip ownership",
  },
  {
    id: "bytedance",
    label: "ByteDance",
    tokenSharePct: 21,
    ownerSharePct: 1.5,
    color: "#f43f5e",
    note: "Usage still dwarfs ownership slice inside China ~5%",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    tokenSharePct: 9,
    ownerSharePct: 17.3,
    color: "#00a4ef",
    note: "Owns more than it first-parties — Azure rents the rest out",
  },
  {
    id: "amazon",
    label: "Amazon",
    tokenSharePct: 5,
    ownerSharePct: 12.5,
    color: "#ff9900",
    note: "Ownership > first-party token share (Anthropic / Bedrock)",
  },
  {
    id: "meta",
    label: "Meta",
    tokenSharePct: 6,
    ownerSharePct: 11.3,
    color: "#0668E1",
    note: "Owns for Llama / Meta AI; open-weight routing dilutes credit",
  },
  {
    id: "china-other",
    label: "Other China apps",
    tokenSharePct: 12,
    ownerSharePct: 3.5,
    color: "#dc2626",
    note: "Alibaba / Tencent / DeepSeek / MiniMax — usage >> ownership",
  },
  {
    id: "rest",
    label: "Rest of brands",
    tokenSharePct: 5,
    ownerSharePct: 29,
    color: "#64748b",
    note: "Residual owners (neoclouds, enterprise, ROW) vs residual tokens",
  },
];

export const OWNER_IDS = NEW_OWNERS.map((o) => o.id);
export const OWNER_COLORS: Record<OwnerId, string> = Object.fromEntries(
  NEW_OWNERS.map((o) => [o.id, o.color]),
) as Record<OwnerId, string>;

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtH100e(n: number): string {
  if (Math.abs(n) >= 1) return `${n.toFixed(2)}M H100e`;
  return `${(n * 1000).toFixed(0)}k H100e`;
}

export function rankedMarkets(
  regionFilter: "all" | MarketRankRow["region"] = "all",
): MarketRankRow[] {
  const rows =
    regionFilter === "all"
      ? MARKET_RANKS
      : MARKET_RANKS.filter((m) => m.region === regionFilter);
  return [...rows].sort((a, b) => b.capacityHintPct - a.capacityHintPct);
}

export function geoDeltas(): GeographyMetric[] {
  return [...GEO_METRICS].sort((a, b) => Math.abs(b.deltaPp) - Math.abs(a.deltaPp));
}

export function siteLedgerRanked(): SiteLedgerRow[] {
  return [...SITE_LEDGER].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

export function rankChurnByDirection(
  dir: "all" | RankChurnRow["direction"] = "all",
): RankChurnRow[] {
  if (dir === "all") return RANK_CHURN;
  return RANK_CHURN.filter((r) => r.direction === dir);
}
