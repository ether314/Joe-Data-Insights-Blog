/**
 * AI power & grid concentration — regional top-1/top-3 shares, cluster intensity,
 * and grid-pace mismatch. Complements the global IEA scenario post with a
 * distribution / market-share lens.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Regional electricity shares and growth deltas from IEA Energy and AI (2025). Local grid intensity (Ireland, Virginia, six US states) from the same report. US five-cluster capacity share and pipeline-in-cluster share are IEA narrative figures. Absolute cluster IT-load gigawatts for Northern Virginia anchored to Cushman & Wakefield / JLARC public estimates (~4.9 GW operating); other named IEA clusters are ranked and scaled estimates marked estimated. US interconnection medians from LBNL Queued Up 2026.";

export const IEA_ENERGY_AI_URL =
  "https://www.iea.org/reports/energy-and-ai/executive-summary";
export const IEA_DEMAND_URL =
  "https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai";
export const IEA_CLUSTER_CHART_URL =
  "https://www.iea.org/data-and-statistics/charts/top-ten-data-centre-markets-by-installed-capacity-versus-share-of-capacity-under-development-2024";
export const LBNL_QUEUE_URL = "https://emp.lbl.gov/queues";
export const JLARC_URL = "https://jlarc.virginia.gov/pdfs/reports/Rpt598-2.pdf";

export const HEADLINE = {
  /** Top-1 country share of global DC electricity, 2024 */
  top1Share2024Pct: 45,
  top1Label: "United States",
  /** Top-3 regional share (US + China + Europe) */
  top3Share2024Pct: 85,
  chinaShare2024Pct: 25,
  europeShare2024Pct: 15,
  /** Approximate regional HHI from five-bucket shares (0–10,000 scale) */
  regionalHhi2024: 3004,
  /** US + China share of 2024→2030 demand growth */
  usChinaGrowthSharePct: 80,
  usGrowthDeltaTwh: 240,
  chinaGrowthDeltaTwh: 175,
  europeGrowthDeltaTwh: 45,
  /** US capacity concentration */
  usFiveClusterSharePct: 50,
  usPipelineInClustersPct: 50,
  /** Local intensity */
  irelandDcSharePct: 20,
  virginiaDcSharePct: 25,
  usStatesOver10Pct: 6,
  novaGlobalCapacitySharePct: 13,
  novaItLoadGw: 4.9,
  /** Grid pace */
  projectsAtDelayRiskPct: 20,
  transmissionYearsMin: 4,
  transmissionYearsMax: 8,
  queueMedianYears: 5,
  /** Global context */
  dcTwh2024: 415,
  dcShare2024Pct: 1.5,
  dcTwh2030Base: 945,
  dcShare2030Pct: 3.0,
  emergingExChinaInternetUsersPct: 50,
  emergingExChinaDcCapacityPct: 10,
} as const;

/** Regional electricity demand shares — concentration ladder */
export type RegionShare = {
  region: string;
  short: string;
  share2024Pct: number;
  twh2024: number;
  twh2030: number;
  deltaTwh: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
};

export const REGION_SHARES: RegionShare[] = [
  {
    region: "United States",
    short: "US",
    share2024Pct: 45,
    twh2024: 187,
    twh2030: 427,
    deltaTwh: 240,
    cumulativeSharePct: 45,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    region: "China",
    short: "China",
    share2024Pct: 25,
    twh2024: 104,
    twh2030: 279,
    deltaTwh: 175,
    cumulativeSharePct: 70,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    region: "Europe",
    short: "Europe",
    share2024Pct: 15,
    twh2024: 62,
    twh2030: 107,
    deltaTwh: 45,
    cumulativeSharePct: 85,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    region: "Japan",
    short: "Japan",
    share2024Pct: 4.6,
    twh2024: 19,
    twh2030: 34,
    deltaTwh: 15,
    cumulativeSharePct: 89.6,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    region: "Rest of world",
    short: "RoW",
    share2024Pct: 10.4,
    twh2024: 43,
    twh2030: 98,
    deltaTwh: 55,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#64748b",
  },
];

/** Cumulative concentration curve points for Lorenz-style chart */
export const CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 45, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 70, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 85, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 89.6, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

/** Local electricity intensity — where concentration bites the grid */
export type LocalIntensity = {
  market: string;
  short: string;
  dcShareOfElectricityPct: number;
  note: string;
  confidence: Confidence;
  fill: string;
};

export const LOCAL_INTENSITY: LocalIntensity[] = [
  {
    market: "Virginia (US)",
    short: "Virginia",
    dcShareOfElectricityPct: 25,
    note: "Highest US state share; Northern Virginia is the global hub",
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    market: "Ireland",
    short: "Ireland",
    dcShareOfElectricityPct: 20,
    note: "~20% of metered electricity supply",
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    market: "Six US states (threshold)",
    short: "6 US states",
    dcShareOfElectricityPct: 10,
    note: "Six states already above 10% of electricity supply",
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    market: "Global average",
    short: "World",
    dcShareOfElectricityPct: 1.5,
    note: "415 TWh / world electricity in 2024",
    confidence: "disclosed",
    fill: "#94a3b8",
  },
];

/**
 * Named IEA top clusters (within 100 km). NoVa GW + global share disclosed via
 * Cushman/JLARC; remaining IT loads are estimated ranks consistent with
 * “NoVa more than double Beijing” and IEA named list order.
 */
export type ClusterRow = {
  rank: number;
  cluster: string;
  short: string;
  region: string;
  itLoadGw: number;
  shareOfGlobalPct: number;
  pipelineSharePct: number | null;
  confidence: Confidence;
  fill: string;
};

export const TOP_CLUSTERS: ClusterRow[] = [
  {
    rank: 1,
    cluster: "Northern Virginia",
    short: "N. Virginia",
    region: "United States",
    itLoadGw: 4.9,
    shareOfGlobalPct: 13,
    pipelineSharePct: 35,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    rank: 2,
    cluster: "Beijing",
    short: "Beijing",
    region: "China",
    itLoadGw: 2.2,
    shareOfGlobalPct: 5.8,
    pipelineSharePct: 28,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    rank: 3,
    cluster: "Shanghai",
    short: "Shanghai",
    region: "China",
    itLoadGw: 1.6,
    shareOfGlobalPct: 4.2,
    pipelineSharePct: 40,
    confidence: "estimated",
    fill: "#fb7185",
  },
  {
    rank: 4,
    cluster: "Dallas",
    short: "Dallas",
    region: "United States",
    itLoadGw: 1.4,
    shareOfGlobalPct: 3.7,
    pipelineSharePct: 55,
    confidence: "estimated",
    fill: "#38bdf8",
  },
  {
    rank: 5,
    cluster: "Pearl River Delta",
    short: "PRD",
    region: "China",
    itLoadGw: 1.3,
    shareOfGlobalPct: 3.4,
    pipelineSharePct: 32,
    confidence: "estimated",
    fill: "#e11d48",
  },
  {
    rank: 6,
    cluster: "Singapore",
    short: "Singapore",
    region: "Southeast Asia",
    itLoadGw: 1.1,
    shareOfGlobalPct: 2.9,
    pipelineSharePct: 22,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    rank: 7,
    cluster: "Chicago",
    short: "Chicago",
    region: "United States",
    itLoadGw: 1.0,
    shareOfGlobalPct: 2.6,
    pipelineSharePct: 30,
    confidence: "estimated",
    fill: "#0284c7",
  },
  {
    rank: 8,
    cluster: "Dublin",
    short: "Dublin",
    region: "Europe",
    itLoadGw: 0.9,
    shareOfGlobalPct: 2.4,
    pipelineSharePct: 18,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    rank: 9,
    cluster: "London",
    short: "London",
    region: "Europe",
    itLoadGw: 0.8,
    shareOfGlobalPct: 2.1,
    pipelineSharePct: 25,
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    rank: 10,
    cluster: "Omaha",
    short: "Omaha",
    region: "United States",
    itLoadGw: 0.7,
    shareOfGlobalPct: 1.9,
    pipelineSharePct: 45,
    confidence: "estimated",
    fill: "#0369a1",
  },
];

/** Growth concentration — who captures incremental TWh to 2030 */
export type GrowthSlice = {
  region: string;
  short: string;
  deltaTwh: number;
  shareOfGrowthPct: number;
  fill: string;
  confidence: Confidence;
};

export const GROWTH_SLICES: GrowthSlice[] = [
  {
    region: "United States",
    short: "US",
    deltaTwh: 240,
    shareOfGrowthPct: 45.3,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    region: "China",
    short: "China",
    deltaTwh: 175,
    shareOfGrowthPct: 33.0,
    fill: "#f43f5e",
    confidence: "disclosed",
  },
  {
    region: "Europe",
    short: "Europe",
    deltaTwh: 45,
    shareOfGrowthPct: 8.5,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    region: "Rest of world + Japan",
    short: "RoW+JP",
    deltaTwh: 70,
    shareOfGrowthPct: 13.2,
    fill: "#64748b",
    confidence: "estimated",
  },
];

/** Pace mismatch — demand clocks vs grid clocks */
export type PaceRow = {
  id: string;
  label: string;
  short: string;
  years: number;
  kind: "demand" | "grid";
  note: string;
  confidence: Confidence;
};

export const PACE_CLOCKS: PaceRow[] = [
  {
    id: "campus",
    label: "Hyperscale campus stand-up",
    short: "Campus build",
    years: 2.5,
    kind: "demand",
    note: "Typical 2–3 year construction once power is secured",
    confidence: "estimated",
  },
  {
    id: "aiTrain",
    label: "AI training cluster refresh",
    short: "GPU refresh",
    years: 1.5,
    kind: "demand",
    note: "Accelerator generations outpace grid study cycles",
    confidence: "estimated",
  },
  {
    id: "queue",
    label: "US median interconnection (IR→COD)",
    short: "Queue median",
    years: 5,
    kind: "grid",
    note: "LBNL Queued Up 2026 — projects built in 2025",
    confidence: "disclosed",
  },
  {
    id: "tx",
    label: "New transmission (advanced economies)",
    short: "Transmission",
    years: 6,
    kind: "grid",
    note: "IEA — typically 4–8 years",
    confidence: "disclosed",
  },
  {
    id: "xfmr",
    label: "Transformer / cable lead times (indexed)",
    short: "Equipment",
    years: 3.5,
    kind: "grid",
    note: "Wait times roughly doubled in three years (IEA)",
    confidence: "estimated",
  },
];

/** Concentration scoreboard for table + scatter */
export type ConcMetric = {
  id: string;
  metric: string;
  value: number;
  unit: string;
  benchmark: string;
  severity: "extreme" | "high" | "moderate";
  confidence: Confidence;
};

export const CONC_METRICS: ConcMetric[] = [
  {
    id: "top1",
    metric: "Top-1 country share (DC electricity)",
    value: 45,
    unit: "%",
    benchmark: "US 2024",
    severity: "high",
    confidence: "disclosed",
  },
  {
    id: "top3",
    metric: "Top-3 regional share",
    value: 85,
    unit: "%",
    benchmark: "US + China + Europe",
    severity: "extreme",
    confidence: "disclosed",
  },
  {
    id: "growth",
    metric: "US + China share of growth to 2030",
    value: 80,
    unit: "%",
    benchmark: "~415 TWh incremental",
    severity: "extreme",
    confidence: "disclosed",
  },
  {
    id: "us5",
    metric: "US capacity in five clusters",
    value: 50,
    unit: "%",
    benchmark: "Nearly half of US DC capacity",
    severity: "high",
    confidence: "disclosed",
  },
  {
    id: "pipeline",
    metric: "US pipeline in existing large clusters",
    value: 50,
    unit: "%",
    benchmark: "Reinforces local congestion",
    severity: "high",
    confidence: "disclosed",
  },
  {
    id: "nova",
    metric: "Northern Virginia share of global capacity",
    value: 13,
    unit: "%",
    benchmark: "~4.9 GW operating IT load",
    severity: "high",
    confidence: "disclosed",
  },
  {
    id: "va",
    metric: "Virginia DC share of state electricity",
    value: 25,
    unit: "%",
    benchmark: "vs 1.5% global average",
    severity: "extreme",
    confidence: "disclosed",
  },
  {
    id: "ie",
    metric: "Ireland DC share of metered supply",
    value: 20,
    unit: "%",
    benchmark: "National-scale intensity",
    severity: "extreme",
    confidence: "disclosed",
  },
  {
    id: "delay",
    metric: "Planned projects at grid-delay risk",
    value: 20,
    unit: "%",
    benchmark: "Unless grid risks addressed",
    severity: "high",
    confidence: "disclosed",
  },
  {
    id: "emdev",
    metric: "EMDE ex-China share of DC capacity",
    value: 10,
    unit: "%",
    benchmark: "vs ~50% of internet users",
    severity: "moderate",
    confidence: "disclosed",
  },
];

export function fmtTwh(n: number, digits = 0): string {
  return `${n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })} TWh`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtGw(n: number, digits = 1): string {
  return `${n.toFixed(digits)} GW`;
}

export const SOURCES = [
  { label: "IEA — Energy and AI (executive summary)", url: IEA_ENERGY_AI_URL },
  { label: "IEA — Energy demand from AI", url: IEA_DEMAND_URL },
  {
    label: "IEA — Top ten data-centre markets chart (OMDIA)",
    url: IEA_CLUSTER_CHART_URL,
  },
  { label: "LBNL — Queued Up 2026", url: LBNL_QUEUE_URL },
  {
    label: "Virginia JLARC — data centre market size (NoVa capacity)",
    url: JLARC_URL,
  },
] as const;
