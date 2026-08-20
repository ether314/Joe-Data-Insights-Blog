/**
 * AI compute demand — vintage update (Aug 2026).
 *
 * Core question: What changed vs the Jul research post
 * (ai-compute-demand-research-2026)? Who processes how much compute,
 * and where is it located?
 *
 * New vintage layers:
 * 1. Epoch Chip Owners Explorer restatement of Big-5 H100e (individual
 *    owners that were estimated in July now have explorer-aligned levels).
 * 2. Synergy Jul 2026 DC-site pipeline (US ~45 GW IT in pipeline;
 *    inland TX+Midwest pipeline share; hyperscale 48% of world DC capacity).
 * 3. Token-demand divergence (Jun 2026 brand meters) vs ownership pie —
 *    usage geography ≠ ownership geography.
 */

export type Confidence = "disclosed" | "estimated" | "restated";

export const SOURCE_NOTE =
  "Vintage delta: Jul 2026 research print (Epoch Chip Owners Q4 2025 + staff residual splits; US ~45% AI DC capacity) vs Aug 2026 update (Epoch Chip Owners Explorer–aligned Big-5 H100e restatement via Epoch/Network World Apr 2026 coverage; Synergy Jul 2026 US DC pipeline & inland shift; Gartner 1Q26 power path carried forward; Jun 2026 token meters for usage divergence). Ownership ≠ usage.";

export const SOURCES = [
  {
    label: "Epoch AI — Five hyperscalers own over two-thirds of global AI compute",
    url: "https://epoch.ai/data-insights/hyperscalers-control-most-compute",
  },
  {
    label: "Epoch AI — AI Chip Owners explorer",
    url: "https://epoch.ai/data/ai-chip-owners",
  },
  {
    label: "Network World — Google owns the most AI compute (Epoch explorer levels)",
    url: "https://www.networkworld.com/article/4156949/google-owns-the-most-ai-compute-and-it-built-it-its-way.html",
  },
  {
    label: "Synergy — US data-center capacity to double despite headwinds (Jul 2026)",
    url: "https://www.srgresearch.com/articles/synergy-reports-that-us-data-center-capacity-will-continue-to-balloon-despite-increasing-headwinds",
  },
  {
    label: "Synergy — US hyperscale investment shifts inland",
    url: "https://www.srgresearch.com/articles/focus-of-us-hyperscale-investment-shifts-dramatically-inland",
  },
  {
    label: "Gartner — Data center electricity & power capacity (1Q26 / Jun 2026 release)",
    url: "https://www.gartner.com/en/newsroom/press-releases/2026-06-10-gartner-says-data-center-electricity-demand-to-grow-26-percent-in-2026",
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

/** Snapshot as published in ai-compute-demand-research-2026 (Jul 2026) */
export const PRIOR_OWNERS: OwnerVintageRow[] = [
  {
    id: "google",
    label: "Google",
    sharePct: 25,
    h100eMillions: 5.0,
    confidence: "disclosed",
    color: "#4285f4",
    note: "Epoch Q4 2025 anchor",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    sharePct: 15,
    h100eMillions: 3.0,
    confidence: "estimated",
    color: "#00a4ef",
    note: "Staff residual of Big-5 71%",
  },
  {
    id: "amazon",
    label: "Amazon",
    sharePct: 14,
    h100eMillions: 2.8,
    confidence: "estimated",
    color: "#ff9900",
    note: "Staff residual of Big-5 71%",
  },
  {
    id: "meta",
    label: "Meta",
    sharePct: 10,
    h100eMillions: 2.0,
    confidence: "disclosed",
    color: "#0668E1",
    note: "Epoch narrative ~10%",
  },
  {
    id: "oracle",
    label: "Oracle",
    sharePct: 7,
    h100eMillions: 1.4,
    confidence: "estimated",
    color: "#c74634",
    note: "Staff residual of Big-5 71%",
  },
];

/**
 * Newest explorer-aligned vintage (Aug 2026 update).
 * Absolute H100e from Epoch Chip Owners Explorer coverage; shares use
 * the same ~20M world stock implied by Google ≈ 25% / 5.0M.
 */
export const NEW_OWNERS: OwnerVintageRow[] = [
  {
    id: "google",
    label: "Google",
    sharePct: 25.0,
    h100eMillions: 5.0,
    confidence: "disclosed",
    color: "#4285f4",
    note: "Still ~25%; ~4M of 5M from custom TPUs",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    sharePct: 17.3,
    h100eMillions: 3.45,
    confidence: "restated",
    color: "#00a4ef",
    note: "Explorer: just under 3.5M H100e (mostly Nvidia)",
  },
  {
    id: "amazon",
    label: "Amazon",
    sharePct: 12.5,
    h100eMillions: 2.5,
    confidence: "restated",
    color: "#ff9900",
    note: "Explorer: ~2.5M; Nvidia + Trainium/AMD mix",
  },
  {
    id: "meta",
    label: "Meta",
    sharePct: 11.3,
    h100eMillions: 2.25,
    confidence: "restated",
    color: "#0668E1",
    note: "Explorer: ~2.25M; Nvidia + AMD",
  },
  {
    id: "oracle",
    label: "Oracle",
    sharePct: 5.3,
    h100eMillions: 1.05,
    confidence: "restated",
    color: "#c74634",
    note: "Explorer: just over 1.0M H100e (Nvidia-heavy)",
  },
];

export const HEADLINE = {
  priorBig5SharePct: 71,
  newBig5SharePct: 71.4,
  big5ShareDeltaPp: 0.4,
  microsoftShareDeltaPp: 2.3,
  microsoftH100eDeltaM: 0.45,
  googleSharePct: 25,
  chinaOwnerSharePct: 5,
  worldH100eMillions: 20.0,
  /** Synergy Jul 2026 */
  usPipelineGw: 45,
  usPipelineShareOfWorldPct: 50,
  worldPipelineSites: 1500,
  usPipelineCompanies: 74,
  hyperscaleShareOfWorldDcPct: 48,
  hyperscaleOwnBuiltSharePct: 60,
  usHyperscaleShareOfWorldPct: 55,
  /** Inland shift (Synergy end-2025 operational / pipeline) */
  txMidwestOpsSharePct: 33,
  txMidwestPipelineSharePct: 53,
  inlandPipelineDeltaPp: 20,
  /** Gartner path (carried; 2027 now featured) */
  dcCapacityGw2025: 104,
  dcCapacityGw2026: 132,
  dcCapacityGw2027: 165,
  dcTwh2025: 447,
  dcTwh2026: 565,
  dcTwh2027: 702,
  aiServerShare2026Pct: 31,
  capacityGrowth2026Pct: 27,
  /** Prior theme US AI-capacity share (power draw) */
  priorUsAiDcSharePct: 45,
  /** Synergy: US remains well over half of world operational DC capacity */
  newUsOpsDcShareFloorPct: 50,
  usOpsShareDeltaPp: 5,
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
 * Hub IT-MW vintage: prior = Jul research panel; new = Aug revision
 * incorporating Synergy inland-pipeline intensity (TX / Midwest up).
 */
export const HUB_DELTAS: HubDelta[] = [
  {
    hub: "US Midwest (WI / IN / OH / LA / MI / MO)",
    region: "United States",
    priorMw: 9800,
    newMw: 12500,
    deltaMw: 2700,
    status: "building",
    operators: "Microsoft Fairwater, AWS Rainier, Meta Hyperion/Prometheus, Google/CoreWeave",
    confidence: "estimated",
    note: "Largest upward revision — inland pipeline share 33%→53%",
  },
  {
    hub: "Texas (Abilene / DFW / El Paso)",
    region: "United States",
    priorMw: 4200,
    newMw: 5800,
    deltaMw: 1600,
    status: "building",
    operators: "OpenAI/Oracle Stargate, Crusoe, Meta, neoclouds",
    confidence: "estimated",
    note: "Synergy: Texas is the single largest state in the US pipeline",
  },
  {
    hub: "Northern Virginia",
    region: "United States",
    priorMw: 3500,
    newMw: 3600,
    deltaMw: 100,
    status: "live-heavy",
    operators: "AWS, Azure, Google, colo",
    confidence: "estimated",
    note: "Still the densest live hub; growth rate lagging inland",
  },
  {
    hub: "Memphis / Mississippi (xAI)",
    region: "United States",
    priorMw: 2000,
    newMw: 2400,
    deltaMw: 400,
    status: "live-heavy",
    operators: "xAI Colossus 1–2",
    confidence: "estimated",
    note: "Owned-heavy campus; Epoch ~550k H100e on Colossus stack",
  },
  {
    hub: "Ireland / Nordics / UK",
    region: "Europe",
    priorMw: 2200,
    newMw: 2400,
    deltaMw: 200,
    status: "live-heavy",
    operators: "Hyperscalers + Nscale Norway",
    confidence: "estimated",
    note: "Permitting / power-price friction caps upside",
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
    note: "Announced MW held flat — energisation still the open question",
  },
  {
    hub: "India (Vizag / Jamnagar)",
    region: "Rest of Asia-Pacific",
    priorMw: 2600,
    newMw: 3100,
    deltaMw: 500,
    status: "building",
    operators: "Google, Reliance",
    confidence: "estimated",
    note: "Modest upward revision on announced IT load",
  },
  {
    hub: "Eastern China AI clusters",
    region: "China",
    priorMw: 5000,
    newMw: 5400,
    deltaMw: 400,
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

/** Geography concentration metrics — vintage delta. */
export const GEO_METRICS: GeographyMetric[] = [
  {
    id: "us-ai-capacity",
    label: "US share of AI DC capacity (power)",
    priorPct: 45,
    newPct: 45,
    deltaPp: 0,
    unit: "%",
    confidence: "estimated",
    note: "Prior theme headline held; Synergy ops share is a different meter",
    color: "#0ea5e9",
  },
  {
    id: "us-ops-dc",
    label: "US share of world operational DC capacity",
    priorPct: 45,
    newPct: 52,
    deltaPp: 7,
    unit: "%",
    confidence: "estimated",
    note: "Synergy: US remains well over half; mid-point of ‘well over 50%’ band",
    color: "#38bdf8",
  },
  {
    id: "us-hyperscale",
    label: "US share of world hyperscale capacity",
    priorPct: 52,
    newPct: 55,
    deltaPp: 3,
    unit: "%",
    confidence: "disclosed",
    note: "Synergy: 55% now vs 52% three years prior",
    color: "#0284c7",
  },
  {
    id: "tx-midwest-ops",
    label: "TX + Midwest share of US hyperscale (ops)",
    priorPct: 33,
    newPct: 33,
    deltaPp: 0,
    unit: "%",
    confidence: "disclosed",
    note: "End-2025 operational baseline (Synergy inland)",
    color: "#f59e0b",
  },
  {
    id: "tx-midwest-pipe",
    label: "TX + Midwest share of US hyperscale (pipeline)",
    priorPct: 33,
    newPct: 53,
    deltaPp: 20,
    unit: "%",
    confidence: "disclosed",
    note: "Same inland corridor jumps +20 pp in the pipeline",
    color: "#d97706",
  },
  {
    id: "hyperscale-world",
    label: "Hyperscale share of all world DC capacity",
    priorPct: 40,
    newPct: 48,
    deltaPp: 8,
    unit: "%",
    confidence: "disclosed",
    note: "Synergy end-2025: hyperscale 48%; on-prem 32%",
    color: "#8b5cf6",
  },
];

export type PowerPathPoint = {
  year: number;
  capacityGw: number;
  twh: number | null;
  aiSharePct: number | null;
  confidence: Confidence;
};

export const POWER_PATH: PowerPathPoint[] = [
  { year: 2025, capacityGw: 104, twh: 447, aiSharePct: 24, confidence: "disclosed" },
  { year: 2026, capacityGw: 132, twh: 565, aiSharePct: 31, confidence: "disclosed" },
  { year: 2027, capacityGw: 165, twh: 702, aiSharePct: 38, confidence: "estimated" },
  { year: 2030, capacityGw: 290, twh: 1200, aiSharePct: 48, confidence: "disclosed" },
];

export type TokenOwnershipRow = {
  id: string;
  label: string;
  /** Jun 2026 brand token share of tracked cohort (illustrative) */
  tokenSharePct: number;
  /** Ownership share of world AI compute (Big-5 / China) */
  ownerSharePct: number;
  color: string;
  note: string;
};

/**
 * Usage vs ownership divergence — token meters from the theme's token post
 * (Jun 2026) versus Epoch ownership shares.
 */
export const TOKEN_VS_OWNERSHIP: TokenOwnershipRow[] = [
  {
    id: "google",
    label: "Google",
    tokenSharePct: 28,
    ownerSharePct: 25,
    color: "#4285f4",
    note: "Owns and serves at scale (TPU fleet + Gemini surfaces)",
  },
  {
    id: "openai",
    label: "OpenAI",
    tokenSharePct: 14,
    ownerSharePct: 0,
    color: "#10b981",
    note: "Huge token volume; almost no chip ownership (rents MSFT/Oracle/CW)",
  },
  {
    id: "bytedance",
    label: "ByteDance",
    tokenSharePct: 22,
    ownerSharePct: 1.5,
    color: "#f43f5e",
    note: "FORCE Jun 2026 token meter dwarfs ownership slice inside China ~5%",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    tokenSharePct: 8,
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
    note: "Ownership > first-party token share (Anthropic / Bedrock tenants)",
  },
  {
    id: "meta",
    label: "Meta",
    tokenSharePct: 6,
    ownerSharePct: 11.3,
    color: "#0668E1",
    note: "Owns for Llama / Meta AI; open-weight routing dilutes token credit",
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

export type PipelineBar = {
  label: string;
  value: number;
  unit: string;
  color: string;
  note: string;
};

export const PIPELINE_STATS: PipelineBar[] = [
  {
    label: "US pipeline IT capacity",
    value: 45,
    unit: "GW",
    color: "#0ea5e9",
    note: "Synergy Jul 2026 known pipeline",
  },
  {
    label: "World large-DC pipeline sites",
    value: 1500,
    unit: "sites",
    color: "#8b5cf6",
    note: "~half of sites are in the US",
  },
  {
    label: "US expanding companies",
    value: 74,
    unit: "firms",
    color: "#f59e0b",
    note: "7 hyperscalers + 67 other large builders",
  },
  {
    label: "Hyperscale share of world DC",
    value: 48,
    unit: "%",
    color: "#10b981",
    note: "End-2025 Synergy; on path to 67% by 2031",
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
