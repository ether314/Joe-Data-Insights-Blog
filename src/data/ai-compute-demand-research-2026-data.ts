/**
 * AI compute demand — ownership (H100e), geography, and power capacity.
 *
 * Core question: Who processes how much compute and where is it located?
 *
 * Primary anchors: Epoch AI Chip Owners / hyperscaler share (Q4 2025);
 * Gartner data-center power capacity & consumption (2025–2030);
 * secondary regional AI capacity shares from industry trackers.
 *
 * Ownership ≠ usage. Frontier labs (OpenAI, Anthropic, xAI) rent most
 * capacity from hyperscalers; token volume (separate post) can diverge
 * from chip ownership when open-weight / China API routing is large.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Epoch AI Chip Owners hub (H100-equivalent ownership through Q4 2025); Gartner Forecast: Data Center Power Capacity and Consumption, Worldwide, 2024–2030 (1Q26); regional AI capacity shares from industry trackers citing Gartner/IDC/LBNL. Ownership shares for non-Google entities below the Big-5 aggregate are staff-aligned estimates that sum to Epoch’s disclosed 71% hyperscaler total.";

export const SOURCES = [
  {
    label: "Epoch AI — Five hyperscalers own over two-thirds of global AI compute",
    url: "https://epoch.ai/data-insights/hyperscalers-control-most-compute",
  },
  {
    label: "Epoch AI — Google custom TPUs / AI compute ownership",
    url: "https://epoch.ai/data-insights/google-custom-tpus-ai-compute",
  },
  {
    label: "Epoch AI — How much AI compute do frontier labs use?",
    url: "https://epoch.ai/gradient-updates/frontier-labs-dont-use-most-ai-compute",
  },
  {
    label: "Gartner — Data center electricity & power capacity forecast (via MarketScreener, June 2026)",
    url: "https://www.marketscreener.com/news/gartner-says-data-center-electricity-consumption-to-grow-26-in-2026-ce7f5cd8db81f421",
  },
];

export const HEADLINE = {
  /** Epoch: Amazon+Google+Meta+Microsoft+Oracle share of world AI compute, Q4 2025 */
  hyperscalerShareQ4_2025Pct: 71,
  /** Epoch: same group, Q1 2024 */
  hyperscalerShareQ1_2024Pct: 63,
  /** Epoch: Google alone ≈ one quarter of global cumulative AI compute */
  googleSharePct: 25,
  /** Epoch narrative: China aggregate ownership ≈ 5% */
  chinaOwnerSharePct: 5,
  /** Google cumulative H100-equivalents (millions), Q4 2025 */
  googleH100eMillions: 5.0,
  /** Implied world stock ≈ Google / 0.25 */
  worldH100eMillions: 20.0,
  /** Gartner: global DC power capacity */
  dcCapacityGw2025: 104,
  dcCapacityGw2026: 132,
  dcCapacityGw2030: 290,
  /** Gartner: AI-optimised servers share of DC power consumption, 2026 */
  aiServerShareOfDcPower2026Pct: 31,
  /** Gartner: DC electricity TWh */
  dcTwh2025: 447,
  dcTwh2026: 565,
  /** Industry tracker synthesis: US share of global AI DC capacity by power draw */
  usAiDcCapacitySharePct: 45,
  /** Capacity growth 2025→2026 */
  capacityGrowth2026Pct: 27,
};

export type OwnerId =
  | "google"
  | "microsoft"
  | "amazon"
  | "meta"
  | "oracle"
  | "china-aggregate"
  | "other-clouds"
  | "rest";

export type OwnerRow = {
  id: OwnerId;
  label: string;
  sharePct: number;
  h100eMillions: number;
  group: "hyperscaler" | "china" | "other";
  confidence: Confidence;
  note: string;
  color: string;
};

/**
 * Ownership shares as of Q4 2025.
 * Google 25% and Big-5 aggregate 71% are Epoch-disclosed anchors.
 * Microsoft / Amazon / Oracle / Meta split of the residual 46 pp is estimated
 * to sum exactly to 71% (Meta ~10% per Epoch narrative).
 */
export const OWNERS: OwnerRow[] = [
  {
    id: "google",
    label: "Google",
    sharePct: 25,
    h100eMillions: 5.0,
    group: "hyperscaler",
    confidence: "disclosed",
    note: "Mostly custom TPUs (~4M H100e of ~5M total)",
    color: "#4285f4",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    sharePct: 15,
    h100eMillions: 3.0,
    group: "hyperscaler",
    confidence: "estimated",
    note: "Nvidia-heavy; rents heavily to OpenAI / partners",
    color: "#00a4ef",
  },
  {
    id: "amazon",
    label: "Amazon",
    sharePct: 14,
    h100eMillions: 2.8,
    group: "hyperscaler",
    confidence: "estimated",
    note: "Nvidia + Trainium/Inferentia; Anthropic partner",
    color: "#ff9900",
  },
  {
    id: "meta",
    label: "Meta",
    sharePct: 10,
    h100eMillions: 2.0,
    group: "hyperscaler",
    confidence: "disclosed",
    note: "Owns ~10%; also rents from Google/Oracle/CoreWeave",
    color: "#0668E1",
  },
  {
    id: "oracle",
    label: "Oracle",
    sharePct: 7,
    h100eMillions: 1.4,
    group: "hyperscaler",
    confidence: "estimated",
    note: "Stargate / OpenAI capacity partner",
    color: "#c74634",
  },
  {
    id: "china-aggregate",
    label: "China (all owners)",
    sharePct: 5,
    h100eMillions: 1.0,
    group: "china",
    confidence: "disclosed",
    note: "Huawei-led FLOP/s; ~5% of world ownership",
    color: "#dc2626",
  },
  {
    id: "other-clouds",
    label: "Other clouds / neoclouds",
    sharePct: 14,
    h100eMillions: 2.8,
    group: "other",
    confidence: "estimated",
    note: "CoreWeave, sovereign clouds, specialty GPU hosts",
    color: "#8b5cf6",
  },
  {
    id: "rest",
    label: "Rest of world owners",
    sharePct: 10,
    h100eMillions: 2.0,
    group: "other",
    confidence: "estimated",
    note: "Enterprise, research, smaller regional owners",
    color: "#64748b",
  },
];

export type HyperscalerSharePoint = {
  quarter: string;
  label: string;
  sharePct: number;
  confidence: Confidence;
};

/** Epoch anchors at endpoints; interim quarters interpolated and marked estimated. */
export const HYPERSCALER_SHARE_PATH: HyperscalerSharePoint[] = [
  { quarter: "2024-Q1", label: "Q1'24", sharePct: 63, confidence: "disclosed" },
  { quarter: "2024-Q2", label: "Q2'24", sharePct: 65, confidence: "estimated" },
  { quarter: "2024-Q3", label: "Q3'24", sharePct: 66.5, confidence: "estimated" },
  { quarter: "2024-Q4", label: "Q4'24", sharePct: 68, confidence: "estimated" },
  { quarter: "2025-Q1", label: "Q1'25", sharePct: 69, confidence: "estimated" },
  { quarter: "2025-Q2", label: "Q2'25", sharePct: 70, confidence: "estimated" },
  { quarter: "2025-Q3", label: "Q3'25", sharePct: 70.5, confidence: "estimated" },
  { quarter: "2025-Q4", label: "Q4'25", sharePct: 71, confidence: "disclosed" },
];

export type RegionId =
  | "united-states"
  | "china"
  | "europe"
  | "middle-east"
  | "rest-apac"
  | "latam-other";

export type RegionCapacity = {
  id: RegionId;
  label: string;
  sharePct: number;
  /** Approximate AI-relevant IT capacity, GW, mid-2026 synthesis */
  approxGw: number;
  confidence: Confidence;
  note: string;
  color: string;
};

/**
 * Geographic distribution of AI data-center capacity by power draw.
 * US ~45% is the industry-tracker headline; other regions are residual
 * estimates that sum to 100 and should be read as order-of-magnitude.
 */
export const REGION_CAPACITY: RegionCapacity[] = [
  {
    id: "united-states",
    label: "United States",
    sharePct: 45,
    approxGw: 18.5,
    confidence: "estimated",
    note: "~45% of global AI DC capacity by power draw",
    color: "#0ea5e9",
  },
  {
    id: "china",
    label: "China",
    sharePct: 18,
    approxGw: 7.4,
    confidence: "estimated",
    note: "High FLOP/s domestically; export-control constrained GPU mix",
    color: "#f43f5e",
  },
  {
    id: "europe",
    label: "Europe",
    sharePct: 14,
    approxGw: 5.8,
    confidence: "estimated",
    note: "Nordics / Ireland / UK / France hubs; grid & permitting friction",
    color: "#8b5cf6",
  },
  {
    id: "middle-east",
    label: "Middle East",
    sharePct: 10,
    approxGw: 4.1,
    confidence: "estimated",
    note: "UAE Stargate, Saudi Humain, Qatar expansions — announced-heavy",
    color: "#f59e0b",
  },
  {
    id: "rest-apac",
    label: "Rest of Asia-Pacific",
    sharePct: 9,
    approxGw: 3.7,
    confidence: "estimated",
    note: "India, Singapore, Japan, Korea, Australia build programs",
    color: "#14b8a6",
  },
  {
    id: "latam-other",
    label: "LatAm & other",
    sharePct: 4,
    approxGw: 1.6,
    confidence: "estimated",
    note: "Brazil, Mexico, Canada residual outside US total",
    color: "#94a3b8",
  },
];

export type HubRow = {
  hub: string;
  region: string;
  approxMw: number;
  status: "live-heavy" | "building" | "announced";
  operators: string;
  confidence: Confidence;
};

/** Selected AI-relevant metro / campus hubs (IT MW order-of-magnitude). */
export const HUBS: HubRow[] = [
  {
    hub: "Northern Virginia",
    region: "United States",
    approxMw: 3500,
    status: "live-heavy",
    operators: "AWS, Azure, Google, colo",
    confidence: "estimated",
  },
  {
    hub: "Texas (Abilene / DFW / El Paso)",
    region: "United States",
    approxMw: 4200,
    status: "building",
    operators: "OpenAI/Oracle Stargate, Crusoe, Meta",
    confidence: "estimated",
  },
  {
    hub: "US Midwest (WI / IN / OH / LA)",
    region: "United States",
    approxMw: 9800,
    status: "building",
    operators: "Microsoft Fairwater, AWS Rainier, Meta Hyperion/Prometheus",
    confidence: "estimated",
  },
  {
    hub: "Memphis / Mississippi (xAI)",
    region: "United States",
    approxMw: 2000,
    status: "live-heavy",
    operators: "xAI Colossus",
    confidence: "estimated",
  },
  {
    hub: "Ireland / Nordics / UK",
    region: "Europe",
    approxMw: 2200,
    status: "live-heavy",
    operators: "Hyperscalers + Nscale Norway",
    confidence: "estimated",
  },
  {
    hub: "Abu Dhabi / Riyadh / NEOM",
    region: "Middle East",
    approxMw: 5500,
    status: "announced",
    operators: "G42/OpenAI Stargate UAE, Humain, DataVolt",
    confidence: "estimated",
  },
  {
    hub: "India (Vizag / Jamnagar)",
    region: "Rest of Asia-Pacific",
    approxMw: 2600,
    status: "building",
    operators: "Google, Reliance",
    confidence: "estimated",
  },
  {
    hub: "Eastern China AI clusters",
    region: "China",
    approxMw: 5000,
    status: "live-heavy",
    operators: "Alibaba, ByteDance, Tencent, Huawei clouds",
    confidence: "estimated",
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
  { year: 2024, capacityGw: 85, twh: null, aiSharePct: null, confidence: "estimated" },
  { year: 2025, capacityGw: 104, twh: 447, aiSharePct: 24, confidence: "disclosed" },
  { year: 2026, capacityGw: 132, twh: 565, aiSharePct: 31, confidence: "disclosed" },
  { year: 2027, capacityGw: 165, twh: 702, aiSharePct: 38, confidence: "estimated" },
  { year: 2030, capacityGw: 290, twh: 1200, aiSharePct: 48, confidence: "disclosed" },
];

export type WorkloadSplit = {
  year: number;
  trainingPct: number;
  inferencePct: number;
  confidence: Confidence;
  note: string;
};

/** Training vs inference share of AI compute volume (not ownership). */
export const WORKLOAD_SPLIT: WorkloadSplit[] = [
  {
    year: 2023,
    trainingPct: 67,
    inferencePct: 33,
    confidence: "estimated",
    note: "Training-dominated early GenAI cycle",
  },
  {
    year: 2024,
    trainingPct: 55,
    inferencePct: 45,
    confidence: "estimated",
    note: "Chat & API inference ramps",
  },
  {
    year: 2025,
    trainingPct: 50,
    inferencePct: 50,
    confidence: "estimated",
    note: "Rough parity by volume",
  },
  {
    year: 2026,
    trainingPct: 33,
    inferencePct: 67,
    confidence: "estimated",
    note: "Inference / agentic workloads take majority",
  },
];

export type LabUseRow = {
  id: string;
  label: string;
  /** Approximate operational AI compute access, H100e millions, end-2025 */
  h100eMillions: number;
  ownsMostly: boolean;
  confidence: Confidence;
  note: string;
  color: string;
};

/**
 * Usage (access) vs ownership distinction — Epoch frontier-lab analysis.
 * OpenAI ~1.7M H100e via power disclosure; Anthropic >1M; xAI Colossus-known.
 */
export const LAB_USE: LabUseRow[] = [
  {
    id: "openai",
    label: "OpenAI (rented)",
    h100eMillions: 1.7,
    ownsMostly: false,
    confidence: "disclosed",
    note: "Power-capacity disclosure → ~1.7M H100e; MSFT/Oracle/CoreWeave",
    color: "#10b981",
  },
  {
    id: "anthropic",
    label: "Anthropic (rented)",
    h100eMillions: 1.1,
    ownsMostly: false,
    confidence: "estimated",
    note: "Likely >1M H100e; Google + Amazon partners",
    color: "#d97706",
  },
  {
    id: "xai",
    label: "xAI (owned campus)",
    h100eMillions: 1.0,
    ownsMostly: true,
    confidence: "estimated",
    note: "Colossus Memphis / Southaven — owned-heavy",
    color: "#64748b",
  },
  {
    id: "google-deepmind",
    label: "Google DeepMind (parent pool)",
    h100eMillions: 2.5,
    ownsMostly: true,
    confidence: "estimated",
    note: "~half of Google pool as first-pass frontier allocation",
    color: "#4285f4",
  },
  {
    id: "meta-msl",
    label: "Meta Superintelligence (parent pool)",
    h100eMillions: 1.0,
    ownsMostly: true,
    confidence: "estimated",
    note: "Less than Meta’s owned total; cloud deals ramping",
    color: "#0668E1",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtGw(n: number): string {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })} GW`;
}

export function fmtH100e(n: number): string {
  if (n >= 1) return `${n.toFixed(1)}M H100e`;
  return `${(n * 1000).toFixed(0)}k H100e`;
}

export function rankedOwners(): OwnerRow[] {
  return [...OWNERS].sort((a, b) => b.sharePct - a.sharePct);
}

export function rankedRegions(): RegionCapacity[] {
  return [...REGION_CAPACITY].sort((a, b) => b.sharePct - a.sharePct);
}

export function rankedHubs(regionFilter: "all" | string = "all"): HubRow[] {
  const rows =
    regionFilter === "all" ? HUBS : HUBS.filter((h) => h.region === regionFilter);
  return [...rows].sort((a, b) => b.approxMw - a.approxMw);
}

export function hyperscalerOwners(): OwnerRow[] {
  return OWNERS.filter((o) => o.group === "hyperscaler");
}
