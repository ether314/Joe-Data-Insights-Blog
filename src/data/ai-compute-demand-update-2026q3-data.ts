/**
 * AI compute demand — Q3 2026 vintage update.
 *
 * Core question: What changed vs the Aug 2026 update
 * (ai-compute-demand-update-2026)? Who processes how much compute,
 * and where is it located?
 *
 * New vintage layers (Aug GW/ownership restatement → Q3 site-count +
 * power-composition print):
 * 1. Synergy hyperscale site ledger: 1,360 ops / 803 pipeline sites;
 *    US 580 ops / 437 pipeline; Top-3 cloud = 58% of hyperscale capacity.
 * 2. New campus IT size ≈ 2× current operational average (Synergy).
 * 3. Gartner US electricity slice: US ~204 TWh of 565 TWh world DC power
 *    (36%); dedicated AI DCs ~68 TWh inside the US (~1/3 of US DC power).
 * 4. Token meters carried to a Q3 brand cohort; ownership Big-5 shares
 *    held from Aug explorer restatement (Epoch Q1/Q2 2026 still not
 *    finalized as a period delta).
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "restated";

export const SOURCE_NOTE =
  "Q3 vintage delta: Aug 2026 update (Epoch Chip Owners Explorer Big-5 H100e + Synergy Jul ~45 GW US IT pipeline + inland 33%→53%) vs Q3 2026 site-count print (Synergy hyperscale ops/pipeline site ledger; Top-3 cloud 58% of hyperscale capacity; new campus size ≈2× ops average) + Gartner US electricity composition (204 TWh / 36% of world DC power; ~68 TWh dedicated AI inside the US). Ownership Big-5 shares carried — Epoch Q1/Q2 2026 period print still open.";

export const SOURCES = [
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
    label: "Prior theme update — Aug 2026 explorer / 45 GW pipeline",
    url: "/blog/ai-compute-demand-update-2026",
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

/** Snapshot as published in ai-compute-demand-update-2026 (Aug 2026) */
export const PRIOR_OWNERS: OwnerVintageRow[] = [
  {
    id: "google",
    label: "Google",
    sharePct: 25.0,
    h100eMillions: 5.0,
    confidence: "disclosed",
    color: "#4285f4",
    note: "Aug explorer / Epoch Q4 2025 anchor",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    sharePct: 17.3,
    h100eMillions: 3.45,
    confidence: "restated",
    color: "#00a4ef",
    note: "Aug explorer restatement",
  },
  {
    id: "amazon",
    label: "Amazon",
    sharePct: 12.5,
    h100eMillions: 2.5,
    confidence: "restated",
    color: "#ff9900",
    note: "Aug explorer restatement",
  },
  {
    id: "meta",
    label: "Meta",
    sharePct: 11.3,
    h100eMillions: 2.25,
    confidence: "restated",
    color: "#0668E1",
    note: "Aug explorer restatement",
  },
  {
    id: "oracle",
    label: "Oracle",
    sharePct: 5.3,
    h100eMillions: 1.05,
    confidence: "restated",
    color: "#c74634",
    note: "Aug explorer restatement",
  },
];

/**
 * Q3 2026 ownership print — Big-5 shares carried from Aug explorer.
 * No Epoch Q1/Q2 2026 period finalization yet; deltas are ~0 by design.
 */
export const NEW_OWNERS: OwnerVintageRow[] = PRIOR_OWNERS.map((o) => ({
  ...o,
  confidence: "carried" as Confidence,
  note: `${o.note} → Q3 carry (no new Epoch period print)`,
}));

export const HEADLINE = {
  priorBig5SharePct: 71.4,
  newBig5SharePct: 71.4,
  big5ShareDeltaPp: 0,
  microsoftSharePct: 17.3,
  googleSharePct: 25,
  chinaOwnerSharePct: 5,
  worldH100eMillions: 20.0,
  /** Synergy Jul GW print (Aug post) */
  priorUsPipelineGw: 45,
  /** Synergy inland corridor (carried) */
  txMidwestOpsSharePct: 33,
  txMidwestPipelineSharePct: 53,
  inlandPipelineDeltaPp: 20,
  /** NEW — Synergy hyperscale site ledger */
  worldOpsSites: 1360,
  usOpsSites: 580,
  worldPipelineSites: 803,
  usPipelineSites: 437,
  usPipelineSiteSharePct: 54.4,
  top3HyperscaleSharePct: 58,
  newCampusSizeMultiple: 2,
  /** Gartner US electricity composition */
  worldDcTwh2026: 565,
  usDcTwh2026: 204,
  usDcShareOfWorldPct: 36,
  usAiDcTwh2026: 68,
  usAiShareOfUsDcPct: 33,
  aiServerShare2026Pct: 31,
  aiServerTwh2026: 175,
  conventionalTwh2026: 195,
  aiServerTwh2027: 258,
  conventionalTwh2027: 200,
  dcCapacityGw2026: 132,
  dcCapacityGw2027: 165,
  /** Prior theme AI-capacity share */
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

/**
 * Site / concentration ledger — Aug post used GW + inland %;
 * Q3 promotes Synergy's site-count and Top-3 concentration print.
 */
export const SITE_LEDGER: SiteLedgerRow[] = [
  {
    id: "us-pipeline-sites",
    label: "US hyperscale pipeline sites",
    priorValue: 0,
    newValue: 437,
    unit: "sites",
    delta: 437,
    confidence: "disclosed",
    color: "#0ea5e9",
    note: "Aug post emphasized GW; Q3 prints Synergy US pipeline site count",
  },
  {
    id: "world-pipeline-sites",
    label: "World hyperscale pipeline sites",
    priorValue: 1500,
    newValue: 803,
    unit: "sites",
    delta: -697,
    confidence: "disclosed",
    color: "#8b5cf6",
    note: "Aug ‘~1,500 large-DC’ ≠ Synergy’s 803 hyperscale-only pipeline",
  },
  {
    id: "us-ops-sites",
    label: "US hyperscale operational sites",
    priorValue: 0,
    newValue: 580,
    unit: "sites",
    delta: 580,
    confidence: "disclosed",
    color: "#38bdf8",
    note: "580 of 1,360 world hyperscale ops sites are in the US",
  },
  {
    id: "top3-share",
    label: "AWS + Azure + Google hyperscale share",
    priorValue: 0,
    newValue: 58,
    unit: "%",
    delta: 58,
    confidence: "disclosed",
    color: "#10b981",
    note: "Top-3 cloud = 58% of all hyperscale capacity (Synergy)",
  },
  {
    id: "us-pipeline-gw",
    label: "US large-DC IT pipeline (GW)",
    priorValue: 45,
    newValue: 45,
    unit: "GW",
    delta: 0,
    confidence: "carried",
    color: "#f59e0b",
    note: "Jul 23 GW print carried; site count is the new meter",
  },
  {
    id: "campus-size-mult",
    label: "New campus size vs ops average",
    priorValue: 1,
    newValue: 2,
    unit: "×",
    delta: 1,
    confidence: "disclosed",
    color: "#d97706",
    note: "Synergy: next-3y average capacity ≈ 2× current ops average",
  },
];

export type HubDelta = {
  hub: string;
  region: string;
  priorMw: number;
  newMw: number;
  deltaMw: number;
  status: "live-heavy" | "building" | "announced";
  operators: string;
  confidence: Confidence;
  note: string;
};

/**
 * Hub IT-MW: prior = Aug update panel; new = Q3 revision leaning on
 * Synergy named inland markets (Abilene, Mount Pleasant, South Bend,
 * El Paso, Boone County, Kansas City) + Indiana 2.4 GW Amazon add.
 */
export const HUB_DELTAS: HubDelta[] = [
  {
    hub: "US Midwest (WI / IN / OH / MI / MO / KS)",
    region: "United States",
    priorMw: 12500,
    newMw: 15200,
    deltaMw: 2700,
    status: "building",
    operators: "Amazon N. Indiana, Microsoft Fairwater, Meta, Google/CoreWeave",
    confidence: "estimated",
    note: "Q3: Amazon +$15B / ~2.4 GW Indiana + Synergy Midwest named markets",
  },
  {
    hub: "Texas (Abilene / DFW / El Paso / Mount Pleasant)",
    region: "United States",
    priorMw: 5800,
    newMw: 7200,
    deltaMw: 1400,
    status: "building",
    operators: "OpenAI/Oracle Stargate, Crusoe, Meta, neoclouds",
    confidence: "estimated",
    note: "Still #1 state in Synergy pipeline; El Paso / Mount Pleasant named",
  },
  {
    hub: "Northern Virginia",
    region: "United States",
    priorMw: 3600,
    newMw: 3650,
    deltaMw: 50,
    status: "live-heavy",
    operators: "AWS, Azure, Google, colo",
    confidence: "estimated",
    note: "Densest live hub; growth rate still lagging inland",
  },
  {
    hub: "Memphis / Mississippi (xAI)",
    region: "United States",
    priorMw: 2400,
    newMw: 2600,
    deltaMw: 200,
    status: "live-heavy",
    operators: "xAI Colossus 1–2",
    confidence: "estimated",
    note: "Owned-heavy campus; still outside Big-5 ownership pie",
  },
  {
    hub: "Ireland / Nordics / UK",
    region: "Europe",
    priorMw: 2400,
    newMw: 2500,
    deltaMw: 100,
    status: "live-heavy",
    operators: "Hyperscalers + Nscale Norway",
    confidence: "estimated",
    note: "Power-price / permitting friction caps upside",
  },
  {
    hub: "Abu Dhabi / Riyadh / NEOM",
    region: "Middle East",
    priorMw: 5500,
    newMw: 5500,
    deltaMw: 0,
    status: "announced",
    operators: "G42/OpenAI Stargate UAE, Humain, DataVolt",
    confidence: "estimated",
    note: "Announced MW still flat — energisation open",
  },
  {
    hub: "India (Vizag / Jamnagar)",
    region: "Rest of Asia-Pacific",
    priorMw: 3100,
    newMw: 3400,
    deltaMw: 300,
    status: "building",
    operators: "Google, Reliance",
    confidence: "estimated",
    note: "Modest upward revision on announced IT load",
  },
  {
    hub: "Eastern China AI clusters",
    region: "China",
    priorMw: 5400,
    newMw: 5600,
    deltaMw: 200,
    status: "live-heavy",
    operators: "Alibaba, ByteDance, Tencent, Huawei clouds",
    confidence: "estimated",
    note: "Domestic FLOP/s rising; ownership share still ~5%",
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
    id: "us-pipeline-sites",
    label: "US share of hyperscale pipeline sites",
    priorPct: 50,
    newPct: 54.4,
    deltaPp: 4.4,
    unit: "%",
    confidence: "disclosed",
    note: "437 / 803 Synergy hyperscale pipeline sites",
    color: "#0ea5e9",
  },
  {
    id: "us-ops-sites",
    label: "US share of hyperscale ops sites",
    priorPct: 50,
    newPct: 42.6,
    deltaPp: -7.4,
    unit: "%",
    confidence: "disclosed",
    note: "580 / 1,360 — site count ≠ capacity share (US still >50% ops capacity)",
    color: "#38bdf8",
  },
  {
    id: "top3-hyperscale",
    label: "Top-3 cloud share of hyperscale capacity",
    priorPct: 55,
    newPct: 58,
    deltaPp: 3,
    unit: "%",
    confidence: "disclosed",
    note: "AWS + Microsoft + Google (Synergy end-2025 footprint)",
    color: "#10b981",
  },
  {
    id: "tx-midwest-pipe",
    label: "TX + Midwest share of US hyperscale (pipeline)",
    priorPct: 53,
    newPct: 53,
    deltaPp: 0,
    unit: "%",
    confidence: "carried",
    note: "Inland corridor headline unchanged from Aug",
    color: "#d97706",
  },
  {
    id: "us-dc-twh",
    label: "US share of world DC electricity (TWh)",
    priorPct: 36,
    newPct: 36,
    deltaPp: 0,
    unit: "%",
    confidence: "disclosed",
    note: "Gartner: US ~204 of 565 TWh in 2026",
    color: "#8b5cf6",
  },
  {
    id: "us-ai-of-us",
    label: "Dedicated AI share of US DC electricity",
    priorPct: 0,
    newPct: 33,
    deltaPp: 33,
    unit: "%",
    confidence: "disclosed",
    note: "Gartner: ~68 of ~204 TWh US DC power is dedicated AI",
    color: "#a855f7",
  },
];

export type PowerSplitPoint = {
  year: number;
  aiTwh: number;
  conventionalTwh: number;
  coolingTwh: number;
  totalTwh: number;
  capacityGw: number;
  confidence: Confidence;
};

/** Gartner composition path — AI crosses conventional in 2027. */
export const POWER_SPLIT: PowerSplitPoint[] = [
  {
    year: 2025,
    aiTwh: 95,
    conventionalTwh: 193,
    coolingTwh: 159,
    totalTwh: 447,
    capacityGw: 104,
    confidence: "disclosed",
  },
  {
    year: 2026,
    aiTwh: 175,
    conventionalTwh: 195,
    coolingTwh: 195,
    totalTwh: 565,
    capacityGw: 132,
    confidence: "disclosed",
  },
  {
    year: 2027,
    aiTwh: 258,
    conventionalTwh: 200,
    coolingTwh: 243,
    totalTwh: 702,
    capacityGw: 165,
    confidence: "disclosed",
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

/** Q3 token cohort vs Aug-carried ownership shares. */
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
    note: "Token share up slightly; still almost no chip ownership",
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

export type PipelineStack = {
  label: string;
  us: number;
  row: number;
  unit: string;
  note: string;
};

export const PIPELINE_STACK: PipelineStack[] = [
  {
    label: "Operational sites",
    us: 580,
    row: 780,
    unit: "sites",
    note: "1,360 world hyperscale ops (Synergy end-2025)",
  },
  {
    label: "Pipeline sites",
    us: 437,
    row: 366,
    unit: "sites",
    note: "803 world hyperscale pipeline; US 54% of sites",
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

export function fmtMw(n: number): string {
  return `${n.toLocaleString()} MW`;
}

export function rankedHubDeltas(regionFilter: "all" | string = "all"): HubDelta[] {
  const rows =
    regionFilter === "all"
      ? HUB_DELTAS
      : HUB_DELTAS.filter((h) => h.region === regionFilter);
  return [...rows].sort((a, b) => b.deltaMw - a.deltaMw);
}

export function geoDeltas(): GeographyMetric[] {
  return [...GEO_METRICS].sort((a, b) => Math.abs(b.deltaPp) - Math.abs(a.deltaPp));
}

export function siteLedgerRanked(): SiteLedgerRow[] {
  return [...SITE_LEDGER].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}
