/**
 * AI power & grid — late-Aug 202608 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (Can electricity and grid build-out keep pace with AI load?)
 *
 * Vintage delta vs ai-power-grid-concentration-2026q3:
 * 1. IEA regional stock ladder (Top-1 45% / Top-3 85%) — carried (still no new census)
 * 2. Gartner 2026 electricity composition (US 36% of 565 TWh) — carried
 * 3. NEW path meters — IEA Electricity Mid-Year Update 2026 (US demand +1.8%/2026,
 *    services H1 +3%; price geography) + LBNL Queued Up 2026 (US active 2,061 GW,
 *    −10% y/y; gas queue +86% to 253 GW)
 * 4. Dual-ledger 2030 gap (IEA ~950 vs Gartner >1,200) — carried path meter
 *
 * Primary sources: IEA Energy and AI regional shares (carried); Gartner 10 Jun 2026
 * (carried); IEA Electricity Mid-Year Update 2026; LBNL Queued Up 2026 Edition;
 * prior theme posts (concentration-2026, concentration-2026q3, update-202608).
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "restated";

export const SOURCE_NOTE =
  "Late-Aug 202608 concentration lens vs Q3 print. IEA regional Top-1/Top-3 stock shares (US 45% / US+China+Europe 85%), growth US+China ~80%, cluster intensity, and Gartner US 36% of 565 TWh are carried — no superseding IEA period census. Mid-Year Update 2026 supplies US demand-path meters (+1.8% 2026 / +3% 2027; services H1 +3%) and wholesale price geography. LBNL Queued Up 2026 restates US active interconnection at 2,061 GW (−10% y/y) with gas in queue +86% to 253 GW. Dual-ledger 2030 gap (~250 TWh) remains a path meter, not a share rewrite. Confidence tags separate disclosed Aug meters from carried share ladders.";

export const SOURCES = [
  {
    label: "Q3 concentration print",
    url: "/blog/ai-power-grid-concentration-2026q3",
  },
  {
    label: "Prior concentration print",
    url: "/blog/ai-power-grid-concentration-2026",
  },
  {
    label: "August Mid-Year vintage",
    url: "/blog/ai-power-grid-update-202608",
  },
  {
    label: "Q3 Gartner + Electricity update",
    url: "/blog/ai-power-grid-update-2026q3",
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
    label: "IEA — Electricity Mid-Year Update 2026",
    url: "https://www.iea.org/reports/electricity-mid-year-update-2026",
  },
  {
    label: "LBNL — Queued Up: 2026 Edition",
    url: "https://emp.lbl.gov/queues",
  },
  {
    label: "Gartner — DC electricity +26% in 2026 (10 Jun 2026, carried)",
    url: "https://www.gartner.com/en/newsroom/press-releases/2026-06-10-gartner-says-data-center-electricity-demand-to-grow-26-percent-in-2026",
  },
] as const;

export const PRIOR_Q3_CONC_PATH = "/blog/ai-power-grid-concentration-2026q3";
export const PRIOR_CONCENTRATION_PATH = "/blog/ai-power-grid-concentration-2026";
export const PRIOR_AUG_PATH = "/blog/ai-power-grid-update-202608";
export const PRIOR_Q3_UPDATE_PATH = "/blog/ai-power-grid-update-2026q3";
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
  /** Gartner 2026 composition — carried perimeter */
  gartnerUsShare2026Pct: 36,
  gartnerUsTwh2026: 204,
  gartnerWorldTwh2026: 565,
  gartnerYoy2026Pct: 26.4,
  gartnerAiServerShare2026Pct: 31,
  gartnerUsAiDedicatedTwh2026: 68,
  usShareDeltaPpVsIea: -9,
  /** Growth concentration — carried */
  usChinaGrowthSharePct: 80,
  usGrowthDeltaTwh: 240,
  chinaGrowthDeltaTwh: 175,
  europeGrowthDeltaTwh: 45,
  usDcShareOfGrowthPct: 50,
  usDemandAdd5yrTwh: 420,
  /** Dual ledger — carried */
  ieaCentral2030Twh: 950,
  gartner2030Twh: 1200,
  dualLedgerGapTwh: 250,
  dcTwh2024: 415,
  dcShare2024Pct: 1.5,
  /** Clusters / local — carried */
  usFiveClusterSharePct: 50,
  novaGlobalCapacitySharePct: 13,
  novaItLoadGw: 4.9,
  irelandDcSharePct: 20,
  virginiaDcSharePct: 25,
  usStatesOver10Pct: 6,
  /** Aug Mid-Year path meters */
  usYoy2026Pct: 1.8,
  usYoy2027Pct: 3.0,
  usServicesH1YoyPct: 3.0,
  usH1TotalYoyPct: 1.0,
  worldYoy2026Pct: 3.6,
  worldYoy2027Pct: 3.8,
  euJapanQ2PriceYoyPct: 30,
  usQ2PriceYoyPct: 0,
  /** LBNL Queued Up 2026 — Aug restatement */
  usActiveTotalGw: 2061,
  usActiveGenGw: 1312,
  usActiveStorageGw: 749,
  usQueueYoyPct: -10,
  usGasQueueGw: 253,
  usGasQueueYoyPct: 86,
  usSolarQueueGw: 773,
  usSolarQueueYoyPct: -19,
  usWindQueueGw: 220,
  usWindQueueYoyPct: -19,
  usStorageQueueYoyPct: -16,
  usIaBacklogGw: 549,
  usMedianIrToCodYears: 5.5,
  usCompletionRatePct: 13,
  /** Pace / worldwide */
  globalQueueStalledGw: 2500,
  unlockTotalGwLow: 1200,
  unlockTotalGwHigh: 1600,
  delayRiskPct: 20,
  queueMedianYearsPrior: 5,
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
  | "usQueue";

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
    note: "Still no new IEA period census — stock ladder flat",
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
    confidence: "carried",
    note: "Different perimeter than IEA stock — not a rewrite",
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
    note: "Growth tip carried; Mid-Year adds US demand-path clocks",
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
    note: "Local brownout politics unchanged by Aug path meters",
  },
  {
    id: "usQueue",
    label: "US interconnection (LBNL)",
    top1Pct: 37.5,
    top1Label: "Solar of active",
    top3Pct: 60.5,
    top3Labels: "Solar + storage + gas",
    priorTop1Pct: 0,
    priorTop3Pct: 0,
    deltaTop1Pp: 0,
    extraMetric: "Active / YoY",
    extraValue: `${HEADLINE.usActiveTotalGw} GW / ${HEADLINE.usQueueYoyPct}%`,
    color: "#8b5cf6",
    confidence: "disclosed",
    note: "Aug tip: gas +86% while total queue −10%",
  },
];

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
    confidence: "carried",
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
    confidence: "carried",
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
  q3: number;
  aug: number;
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
    q3: 45,
    aug: 45,
    unit: "%",
    delta: 0,
    direction: "flat",
    note: "IEA ladder still carried",
    confidence: "carried",
  },
  {
    id: "top3",
    metric: "Top-3 stock share",
    q3: 85,
    aug: 85,
    unit: "%",
    delta: 0,
    direction: "flat",
    note: "IEA ladder still carried",
    confidence: "carried",
  },
  {
    id: "usQueue",
    metric: "US active interconnection",
    q3: 1312,
    aug: 2061,
    unit: "GW",
    delta: 749,
    direction: "scope",
    note: "Gen-only proxy → gen+storage Queued Up 2026",
    confidence: "disclosed",
  },
  {
    id: "gasQueue",
    metric: "US gas in queue",
    q3: 136,
    aug: 253,
    unit: "GW",
    delta: 117,
    direction: "up",
    note: "+86% y/y — AI firm-power bid into queues",
    confidence: "disclosed",
  },
  {
    id: "medianYears",
    metric: "US median IR→COD",
    q3: 5,
    aug: 5.5,
    unit: "yr",
    delta: 0.5,
    direction: "up",
    note: "LBNL Queued Up 2026 restatement",
    confidence: "disclosed",
  },
  {
    id: "usDemand",
    metric: "US demand growth 2026",
    q3: 2.0,
    aug: 1.8,
    unit: "%",
    delta: -0.2,
    direction: "down",
    note: "Mid-Year soft H1; DC still main driver",
    confidence: "disclosed",
  },
  {
    id: "gap",
    metric: "2030 dual-ledger gap",
    q3: 250,
    aug: 250,
    unit: "TWh",
    delta: 0,
    direction: "flat",
    note: "IEA ~950 vs Gartner >1,200 carried",
    confidence: "carried",
  },
];

export type QueueTechRow = {
  id: string;
  tech: string;
  short: string;
  gw: number;
  shareOfActivePct: number;
  yoyPct: number;
  fill: string;
  confidence: Confidence;
  note: string;
};

export const US_QUEUE_TECH: QueueTechRow[] = [
  {
    id: "solar",
    tech: "Solar",
    short: "Solar",
    gw: 773,
    shareOfActivePct: 37.5,
    yoyPct: -19,
    fill: "#f59e0b",
    confidence: "disclosed",
    note: "Still Top-1 of active book",
  },
  {
    id: "storage",
    tech: "Storage",
    short: "Storage",
    gw: 749,
    shareOfActivePct: 36.3,
    yoyPct: -16,
    fill: "#14b8a6",
    confidence: "disclosed",
    note: "Near-parity with solar on GW",
  },
  {
    id: "gas",
    tech: "Natural gas",
    short: "Gas",
    gw: 253,
    shareOfActivePct: 12.3,
    yoyPct: 86,
    fill: "#f43f5e",
    confidence: "disclosed",
    note: "Only major tech rising — firm-power bid",
  },
  {
    id: "wind",
    tech: "Wind",
    short: "Wind",
    gw: 220,
    shareOfActivePct: 10.7,
    yoyPct: -19,
    fill: "#0ea5e9",
    confidence: "disclosed",
    note: "Shrinking with solar",
  },
  {
    id: "other",
    tech: "Other gen",
    short: "Other",
    gw: 66,
    shareOfActivePct: 3.2,
    yoyPct: 0,
    fill: "#64748b",
    confidence: "estimated",
    note: "Residual gen after solar/wind/gas",
  },
];

export type DemandPathPoint = {
  year: number;
  worldYoyPct: number;
  usYoyPct: number;
  note: string;
  confidence: Confidence;
};

export const DEMAND_PATH: DemandPathPoint[] = [
  {
    year: 2025,
    worldYoyPct: 3.0,
    usYoyPct: 2.6,
    note: "Mid-Year locked",
    confidence: "disclosed",
  },
  {
    year: 2026,
    worldYoyPct: 3.6,
    usYoyPct: 1.8,
    note: "US soft H1; services/DC still up",
    confidence: "disclosed",
  },
  {
    year: 2027,
    worldYoyPct: 3.8,
    usYoyPct: 3.0,
    note: "Acceleration resumes",
    confidence: "disclosed",
  },
];

export type UsH1Slice = {
  id: string;
  label: string;
  short: string;
  yoyPct: number;
  fill: string;
  confidence: Confidence;
};

export const US_H1_SECTORS: UsH1Slice[] = [
  {
    id: "services",
    label: "Services (incl. DCs)",
    short: "Services",
    yoyPct: 3.0,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "industrial",
    label: "Industrial",
    short: "Industrial",
    yoyPct: 1.0,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    id: "total",
    label: "US total H1",
    short: "Total",
    yoyPct: 1.0,
    fill: "#64748b",
    confidence: "disclosed",
  },
  {
    id: "residential",
    label: "Residential",
    short: "Residential",
    yoyPct: -1.7,
    fill: "#94a3b8",
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
    years: 5.5,
    kind: "grid",
    note: "LBNL Queued Up 2026 — +0.5 yr vs prior print",
    confidence: "disclosed",
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
  kind: "active" | "ia" | "gas" | "stalled";
  fill: string;
  confidence: Confidence;
  note: string;
};

export const QUEUE_METERS: QueueMeter[] = [
  {
    id: "usActive",
    label: "US active gen + storage",
    short: "US active",
    gw: 2061,
    kind: "active",
    fill: "#8b5cf6",
    confidence: "disclosed",
    note: "LBNL Queued Up 2026 (−10% y/y)",
  },
  {
    id: "ia",
    label: "US IA backlog",
    short: "IA backlog",
    gw: 549,
    kind: "ia",
    fill: "#f59e0b",
    confidence: "disclosed",
    note: "Projects with signed interconnection agreements",
  },
  {
    id: "gas",
    label: "US gas in queue",
    short: "Gas queue",
    gw: 253,
    kind: "gas",
    fill: "#f43f5e",
    confidence: "disclosed",
    note: "+86% y/y — firm-power concentration",
  },
  {
    id: "stalled",
    label: "Worldwide stalled connection queues",
    short: "World stalled",
    gw: 2500,
    kind: "stalled",
    fill: "#64748b",
    confidence: "carried",
    note: "IEA Electricity 2026 — carried worldwide stock",
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
    id: "queueTech",
    label: "US queue tech",
    short: "Queue",
    top1Pct: 37.5,
    top3Pct: 86.1,
    fill: "#8b5cf6",
    note: "Solar / solar+storage+gas of active GW",
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

export type PriceShockRow = {
  id: string;
  region: string;
  short: string;
  q2YoyPct: number;
  fill: string;
  note: string;
  confidence: Confidence;
};

export const PRICE_SHOCK: PriceShockRow[] = [
  {
    id: "euJp",
    region: "EU & Japan",
    short: "EU/JP",
    q2YoyPct: 30,
    fill: "#f43f5e",
    note: "Hormuz LNG shock pass-through",
    confidence: "disclosed",
  },
  {
    id: "india",
    region: "India",
    short: "India",
    q2YoyPct: 10,
    fill: "#f59e0b",
    note: "Moderate wholesale lift",
    confidence: "disclosed",
  },
  {
    id: "us",
    region: "United States",
    short: "US",
    q2YoyPct: 0,
    fill: "#0ea5e9",
    note: "Flat — gas not setting marginal price the same way",
    confidence: "disclosed",
  },
  {
    id: "aus",
    region: "Australia",
    short: "AUS",
    q2YoyPct: -45,
    fill: "#14b8a6",
    note: "Renewables-heavy wholesale collapse",
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

export function fmtYr(n: number, digits = 1): string {
  return `${n.toFixed(digits)} yr`;
}
