/**
 * AI power & grid — Q3 2026 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (Can electricity and grid build-out keep pace with AI load?)
 *
 * Vintage delta vs ai-power-grid-concentration-2026:
 * 1. IEA regional stock ladder (Top-1 45% / Top-3 85%) — carried (no new IEA period census)
 * 2. Gartner 2026 electricity composition — US 36% of global DC TWh (different perimeter)
 * 3. Growth + dual-ledger path — US+China ~80% growth carried; IEA ~950 vs Gartner >1,200
 * 4. Grid pace — Electricity 2026 restates worldwide stalled queues >2,500 GW
 *
 * Primary sources: IEA Energy and AI (2025) regional shares; Gartner newsroom 10 Jun 2026;
 * IEA Electricity 2026 (US DC share of demand growth; worldwide queues); LBNL Queued Up;
 * prior theme posts (concentration-2026, update-2026q3, research-2026).
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "restated";

export const SOURCE_NOTE =
  "Q3 concentration lens vs ai-power-grid-concentration-2026. IEA regional Top-1/Top-3 stock shares (US 45% / US+China+Europe 85%), cluster intensity, and US+China growth share (~80%) are carried — no superseding IEA period census. Gartner newsroom 10 Jun 2026 supplies the near-term electricity composition (565 TWh globally; US 204 TWh / 36%) and AI-server power share (31% in 2026). IEA Electricity 2026 restates US data-centre share of demand growth (~50% of a ~420 TWh five-year add) and worldwide stalled connection queues (>2,500 GW). Dual-ledger 2030 gap (IEA central ~950 vs Gartner >1,200) is a path meter, not a share rewrite. Confidence tags separate disclosed Q3 meters from carried share ladders.";

export const SOURCES = [
  {
    label: "Prior concentration print",
    url: "/blog/ai-power-grid-concentration-2026",
  },
  {
    label: "Q3 Gartner + Electricity update",
    url: "/blog/ai-power-grid-update-2026q3",
  },
  {
    label: "August Mid-Year vintage",
    url: "/blog/ai-power-grid-update-202608",
  },
  {
    label: "Key Questions vintage update",
    url: "/blog/ai-power-grid-update-2026",
  },
  {
    label: "IEA global research frame",
    url: "/blog/ai-power-grid-research-2026",
  },
  {
    label: "US data-center power vs grid capacity",
    url: "/blog/us-data-center-power-vs-grid-capacity-2025",
  },
  {
    label: "Gartner — DC electricity +26% in 2026 (10 Jun 2026)",
    url: "https://www.gartner.com/en/newsroom/press-releases/2026-06-10-gartner-says-data-center-electricity-demand-to-grow-26-percent-in-2026",
  },
  {
    label: "IEA — Electricity 2026",
    url: "https://www.iea.org/reports/electricity-2026",
  },
] as const;

export const PRIOR_CONCENTRATION_PATH = "/blog/ai-power-grid-concentration-2026";
export const PRIOR_Q3_PATH = "/blog/ai-power-grid-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/ai-power-grid-update-202608";
export const PRIOR_RESEARCH_PATH = "/blog/ai-power-grid-research-2026";
export const US_GRID_PATH = "/blog/us-data-center-power-vs-grid-capacity-2025";

export const HEADLINE = {
  /** Carried IEA stock ladder (2024 DC electricity) */
  top1SharePct: 45,
  top1Label: "United States",
  top3SharePct: 85,
  top3Label: "US · China · Europe",
  priorTop1SharePct: 45,
  priorTop3SharePct: 85,
  chinaSharePct: 25,
  europeSharePct: 15,
  regionalHhi: 3004,
  /** Gartner 2026 composition — different perimeter */
  gartnerUsShare2026Pct: 36,
  gartnerUsTwh2026: 204,
  gartnerWorldTwh2026: 565,
  gartnerYoy2026Pct: 26.4,
  gartnerAiServerShare2026Pct: 31,
  gartnerUsAiDedicatedTwh2026: 68,
  gartnerUsAiShareOfUsPct: 33,
  usShareDeltaPpVsIea: -9,
  /** Growth concentration */
  usChinaGrowthSharePct: 80,
  usGrowthDeltaTwh: 240,
  chinaGrowthDeltaTwh: 175,
  europeGrowthDeltaTwh: 45,
  /** US demand-growth attribution (Electricity 2026) */
  usDemandAdd5yrTwh: 420,
  usDcShareOfGrowthPct: 50,
  /** Dual ledger */
  ieaCentral2030Twh: 950,
  gartner2030Twh: 1200,
  dualLedgerGapTwh: 250,
  dcTwh2024: 415,
  dcShare2024Pct: 1.5,
  /** Clusters / local */
  usFiveClusterSharePct: 50,
  usPipelineInClustersPct: 50,
  novaGlobalCapacitySharePct: 13,
  novaItLoadGw: 4.9,
  irelandDcSharePct: 20,
  virginiaDcSharePct: 25,
  usStatesOver10Pct: 6,
  /** Grid pace */
  globalQueueStalledGw: 2500,
  unlockTotalGwLow: 1200,
  unlockTotalGwHigh: 1600,
  delayRiskPct: 20,
  queueMedianYears: 5,
  transmissionYearsMid: 6,
  campusYears: 2.5,
  emergingExChinaInternetUsersPct: 50,
  emergingExChinaDcCapacityPct: 10,
} as const;

export type PerimeterId =
  | "stock"
  | "gartner"
  | "growth"
  | "local"
  | "queues";

export type ScoreboardRow = {
  id: PerimeterId;
  label: string;
  top1Pct: number;
  top1Label: string;
  top3Pct: number;
  top3Labels: string;
  priorTop1Pct: number;
  priorTop3Pct: number;
  deltaTop1Pp: number;
  extraMetric: string;
  extraValue: string;
  color: string;
  confidence: Confidence;
  note: string;
};

export const SCOREBOARD: ScoreboardRow[] = [
  {
    id: "stock",
    label: "IEA DC electricity stock",
    top1Pct: HEADLINE.top1SharePct,
    top1Label: HEADLINE.top1Label,
    top3Pct: HEADLINE.top3SharePct,
    top3Labels: HEADLINE.top3Label,
    priorTop1Pct: HEADLINE.priorTop1SharePct,
    priorTop3Pct: HEADLINE.priorTop3SharePct,
    deltaTop1Pp: 0,
    extraMetric: "Regional HHI",
    extraValue: `~${HEADLINE.regionalHhi}`,
    color: "#0ea5e9",
    confidence: "carried",
    note: "No new IEA period census — stock ladder unchanged",
  },
  {
    id: "gartner",
    label: "Gartner 2026 DC TWh",
    top1Pct: HEADLINE.gartnerUsShare2026Pct,
    top1Label: "United States",
    top3Pct: 0,
    top3Labels: "n/a (US cut only)",
    priorTop1Pct: HEADLINE.top1SharePct,
    priorTop3Pct: HEADLINE.top3SharePct,
    deltaTop1Pp: HEADLINE.usShareDeltaPpVsIea,
    extraMetric: "US TWh / world",
    extraValue: `${HEADLINE.gartnerUsTwh2026} / ${HEADLINE.gartnerWorldTwh2026}`,
    color: "#f59e0b",
    confidence: "disclosed",
    note: "Different perimeter than IEA AI/DC stock — not a rewrite",
  },
  {
    id: "growth",
    label: "Growth to 2030 (IEA)",
    top1Pct: 45.3,
    top1Label: "United States",
    top3Pct: HEADLINE.usChinaGrowthSharePct,
    top3Labels: "US + China (~80%)",
    priorTop1Pct: 45.3,
    priorTop3Pct: HEADLINE.usChinaGrowthSharePct,
    deltaTop1Pp: 0,
    extraMetric: "US DC of US growth",
    extraValue: `${HEADLINE.usDcShareOfGrowthPct}% of ~${HEADLINE.usDemandAdd5yrTwh} TWh`,
    color: "#f43f5e",
    confidence: "carried",
    note: "US+China growth share carried; Electricity 2026 adds US attribution",
  },
  {
    id: "local",
    label: "Local intensity",
    top1Pct: HEADLINE.virginiaDcSharePct,
    top1Label: "Virginia",
    top3Pct: HEADLINE.irelandDcSharePct,
    top3Labels: "Ireland (national)",
    priorTop1Pct: HEADLINE.virginiaDcSharePct,
    priorTop3Pct: HEADLINE.irelandDcSharePct,
    deltaTop1Pp: 0,
    extraMetric: "US states >10%",
    extraValue: `${HEADLINE.usStatesOver10Pct}`,
    color: "#14b8a6",
    confidence: "carried",
    note: "Local brownout politics unchanged by Q3 path meters",
  },
  {
    id: "queues",
    label: "Grid queue stock",
    top1Pct: 0,
    top1Label: "Worldwide stalled",
    top3Pct: 0,
    top3Labels: "Unlock band",
    priorTop1Pct: 0,
    priorTop3Pct: 0,
    deltaTop1Pp: 0,
    extraMetric: "Stalled / unlock",
    extraValue: `>${HEADLINE.globalQueueStalledGw} / ${HEADLINE.unlockTotalGwLow}–${HEADLINE.unlockTotalGwHigh} GW`,
    color: "#8b5cf6",
    confidence: "restated",
    note: "Electricity 2026 restates queue stock — concentration of delay risk",
  },
];

/** Carried IEA regional stock shares */
export type RegionShare = {
  region: string;
  short: string;
  sharePct: number;
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
    sharePct: 45,
    twh2024: 187,
    twh2030: 427,
    deltaTwh: 240,
    cumulativeSharePct: 45,
    confidence: "carried",
    fill: "#0ea5e9",
  },
  {
    region: "China",
    short: "China",
    sharePct: 25,
    twh2024: 104,
    twh2030: 279,
    deltaTwh: 175,
    cumulativeSharePct: 70,
    confidence: "carried",
    fill: "#f43f5e",
  },
  {
    region: "Europe",
    short: "Europe",
    sharePct: 15,
    twh2024: 62,
    twh2030: 107,
    deltaTwh: 45,
    cumulativeSharePct: 85,
    confidence: "carried",
    fill: "#8b5cf6",
  },
  {
    region: "Japan",
    short: "Japan",
    sharePct: 4.6,
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
    sharePct: 10.4,
    twh2024: 43,
    twh2030: 98,
    deltaTwh: 55,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#64748b",
  },
];

export const STOCK_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 45, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 70, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 85, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 89.6, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export const GROWTH_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 45.3, equalPct: 25 },
  { rank: 2, label: "Top-2", sharePct: 78.3, equalPct: 50 },
  { rank: 3, label: "Top-3", sharePct: 86.8, equalPct: 75 },
  { rank: 4, label: "All", sharePct: 100, equalPct: 100 },
];

/** Dual-perimeter US share compare */
export type ShareCompareRow = {
  id: string;
  lens: string;
  short: string;
  usSharePct: number;
  year: string;
  perimeter: string;
  confidence: Confidence;
  fill: string;
};

export const US_SHARE_COMPARE: ShareCompareRow[] = [
  {
    id: "iea24",
    lens: "IEA DC electricity stock",
    short: "IEA 2024",
    usSharePct: 45,
    year: "2024",
    perimeter: "Global DC electricity (Energy & AI)",
    confidence: "carried",
    fill: "#0ea5e9",
  },
  {
    id: "gartner26",
    lens: "Gartner DC electricity path",
    short: "Gartner 2026",
    usSharePct: 36,
    year: "2026e",
    perimeter: "All data-center electricity (newsroom)",
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    id: "growth",
    lens: "IEA growth to 2030",
    short: "Growth Δ",
    usSharePct: 45.3,
    year: "2024→30",
    perimeter: "Incremental DC TWh (Base Case)",
    confidence: "carried",
    fill: "#f43f5e",
  },
  {
    id: "usGrowth",
    lens: "US demand-growth attribution",
    short: "US growth",
    usSharePct: 50,
    year: "5-yr",
    perimeter: "DC share of US electricity demand add",
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
];

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
    confidence: "carried",
  },
  {
    region: "China",
    short: "China",
    deltaTwh: 175,
    shareOfGrowthPct: 33.0,
    fill: "#f43f5e",
    confidence: "carried",
  },
  {
    region: "Europe",
    short: "Europe",
    deltaTwh: 45,
    shareOfGrowthPct: 8.5,
    fill: "#8b5cf6",
    confidence: "carried",
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

export type DualLedgerPoint = {
  year: number;
  ieaTwh: number | null;
  gartnerTwh: number | null;
  label: string;
};

export const DUAL_LEDGER_PATH: DualLedgerPoint[] = [
  { year: 2024, ieaTwh: 415, gartnerTwh: null, label: "IEA 2024" },
  { year: 2025, ieaTwh: 485, gartnerTwh: 447, label: "2025" },
  { year: 2026, ieaTwh: null, gartnerTwh: 565, label: "Gartner 2026" },
  { year: 2027, ieaTwh: null, gartnerTwh: 702, label: "Gartner 2027" },
  { year: 2030, ieaTwh: 950, gartnerTwh: 1200, label: "2030 dual" },
];

export type VintageDelta = {
  id: string;
  metric: string;
  prior: number;
  q3: number;
  unit: string;
  delta: number;
  direction: "up" | "flat" | "down" | "scope";
  note: string;
  confidence: Confidence;
};

export const VINTAGE_DELTAS: VintageDelta[] = [
  {
    id: "top1",
    metric: "Top-1 stock share",
    prior: 45,
    q3: 45,
    unit: "%",
    delta: 0,
    direction: "flat",
    note: "IEA ladder carried",
    confidence: "carried",
  },
  {
    id: "top3",
    metric: "Top-3 stock share",
    prior: 85,
    q3: 85,
    unit: "%",
    delta: 0,
    direction: "flat",
    note: "IEA ladder carried",
    confidence: "carried",
  },
  {
    id: "usGartner",
    metric: "US share (Gartner perimeter)",
    prior: 45,
    q3: 36,
    unit: "%",
    delta: -9,
    direction: "scope",
    note: "Scope change, not a re-rank of IEA stock",
    confidence: "disclosed",
  },
  {
    id: "worldTwh",
    metric: "Near-term world DC TWh",
    prior: 415,
    q3: 565,
    unit: "TWh",
    delta: 150,
    direction: "up",
    note: "2024 IEA → 2026e Gartner",
    confidence: "disclosed",
  },
  {
    id: "queue",
    metric: "Stalled connection queues",
    prior: 1312,
    q3: 2500,
    unit: "GW",
    delta: 1188,
    direction: "up",
    note: "US queue proxy → worldwide Electricity 2026 stock",
    confidence: "restated",
  },
  {
    id: "gap",
    metric: "2030 dual-ledger gap",
    prior: 0,
    q3: 250,
    unit: "TWh",
    delta: 250,
    direction: "up",
    note: "IEA ~950 vs Gartner >1,200",
    confidence: "disclosed",
  },
];

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
    note: "Highest US state share; Northern Virginia hub",
    confidence: "carried",
    fill: "#0ea5e9",
  },
  {
    market: "Ireland",
    short: "Ireland",
    dcShareOfElectricityPct: 20,
    note: "~20% of metered electricity supply",
    confidence: "carried",
    fill: "#14b8a6",
  },
  {
    market: "Six US states (threshold)",
    short: "6 US states",
    dcShareOfElectricityPct: 10,
    note: "Six states already above 10%",
    confidence: "carried",
    fill: "#f59e0b",
  },
  {
    market: "Global average",
    short: "World",
    dcShareOfElectricityPct: 1.5,
    note: "415 TWh / world electricity in 2024",
    confidence: "carried",
    fill: "#94a3b8",
  },
];

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
    confidence: "carried",
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
];

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
    short: "Campus",
    years: 2.5,
    kind: "demand",
    note: "Typical 2–3 years once power is secured",
    confidence: "estimated",
  },
  {
    id: "aiTrain",
    label: "AI training cluster refresh",
    short: "GPU refresh",
    years: 1.5,
    kind: "demand",
    note: "Accelerator generations outpace grid studies",
    confidence: "estimated",
  },
  {
    id: "queue",
    label: "US median interconnection (IR→COD)",
    short: "Queue median",
    years: 5,
    kind: "grid",
    note: "LBNL Queued Up — projects built in 2025",
    confidence: "carried",
  },
  {
    id: "tx",
    label: "New transmission (advanced economies)",
    short: "Transmission",
    years: 6,
    kind: "grid",
    note: "IEA — typically 4–8 years",
    confidence: "carried",
  },
];

export type QueueMeter = {
  id: string;
  label: string;
  short: string;
  gw: number;
  kind: "stalled" | "unlock" | "risk";
  fill: string;
  confidence: Confidence;
  note: string;
};

export const QUEUE_METERS: QueueMeter[] = [
  {
    id: "stalled",
    label: "Worldwide stalled connection queues",
    short: "Stalled",
    gw: 2500,
    kind: "stalled",
    fill: "#f43f5e",
    confidence: "restated",
    note: "IEA Electricity 2026",
  },
  {
    id: "unlockLow",
    label: "Unlockable with flexibility + GET (low)",
    short: "Unlock lo",
    gw: 1200,
    kind: "unlock",
    fill: "#14b8a6",
    confidence: "disclosed",
    note: "Flexibility + grid-enhancing tech band",
  },
  {
    id: "unlockHigh",
    label: "Unlockable with flexibility + GET (high)",
    short: "Unlock hi",
    gw: 1600,
    kind: "unlock",
    fill: "#0d9488",
    confidence: "disclosed",
    note: "Upper unlock band",
  },
  {
    id: "delay",
    label: "Planned DC projects at delay risk (indexed)",
    short: "Delay risk",
    gw: 20,
    kind: "risk",
    fill: "#f59e0b",
    confidence: "carried",
    note: "~20% of planned projects — % scale, not GW",
  },
];

export type LensCompare = {
  id: string;
  label: string;
  short: string;
  top1Pct: number;
  top3Pct: number;
  fill: string;
  note: string;
};

export const LENS_COMPARE: LensCompare[] = [
  {
    id: "stock",
    label: "IEA stock",
    short: "Stock",
    top1Pct: 45,
    top3Pct: 85,
    fill: "#0ea5e9",
    note: "US / US+China+Europe",
  },
  {
    id: "growth",
    label: "Growth Δ",
    short: "Growth",
    top1Pct: 45.3,
    top3Pct: 78.3,
    fill: "#f43f5e",
    note: "US / US+China of incremental TWh",
  },
  {
    id: "cluster",
    label: "US five-cluster",
    short: "Clusters",
    top1Pct: 13,
    top3Pct: 50,
    fill: "#8b5cf6",
    note: "NoVa global % / five-hub US capacity %",
  },
  {
    id: "local",
    label: "Local intensity",
    short: "Local",
    top1Pct: 25,
    top3Pct: 20,
    fill: "#14b8a6",
    note: "Virginia / Ireland (not additive Top-3)",
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

export function fmtPp(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtGw(n: number, digits = 0): string {
  return `${n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })} GW`;
}
