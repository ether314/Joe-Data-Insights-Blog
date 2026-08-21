/**
 * AI compute demand — geography lens (2026).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * (Who processes how much compute and where is it located?)
 *
 * Complements concentration (top-k / HHI across ownership, cloud, region, tokens)
 * and vintage updates (Synergy site ledger / Aug location rankings) with regional
 * capacity shares, metro ladders, token-origin geography, and pipeline growth maps.
 *
 * Primary sources:
 * - Epoch AI Chip Owners / hyperscaler share (Q4 2025 + Aug explorer carry)
 * - Synergy Research hyperscale location rankings (19 Aug 2026) + inland site ledger
 * - Regional AI DC power-draw synthesis (theme research)
 * - June 2026 major-AI-brands token series (origin geography)
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "desk";

export const SOURCE_NOTE =
  "Geography lens across four maps. Regional AI DC capacity: industry-tracker power-draw synthesis (US ~45%). Metro / market capacity: Synergy Aug 19, 2026 (top-20 = 60%; N.VA + Greater Beijing = 17%; pipeline 915). Token origin: June 2026 major-brands series rolled by HQ/origin (China ~61.8%, US ~37.7%). Pipeline growth: Synergy site ledger + Texas ops +71% YoY vs world +36%. Chip ownership HQ shares carried from Epoch — ownership geography ≠ token geography ≠ site geography. Shares within each map sum ≈100%; cross-map comparisons are illustrative.";

export const PRIOR_RESEARCH_PATH = "/blog/ai-compute-demand-research-2026";
export const PRIOR_CONCENTRATION_PATH =
  "/blog/ai-compute-demand-concentration-2026";
export const PRIOR_AUG608_PATH = "/blog/ai-compute-demand-concentration-202608";
export const PRIOR_UPDATE_PATH = "/blog/ai-compute-demand-update-202608";
export const PRIOR_Q3_PATH = "/blog/ai-compute-demand-update-2026q3";
export const TOKEN_POST_PATH = "/blog/major-ai-brands-token-consumption-2022-2026";
export const BUILD_TRACKER_PATH = "/blog/global-ai-data-center-build-tracker";

export const SOURCES = [
  {
    label: "Epoch AI — hyperscalers control most compute",
    url: "https://epoch.ai/data-insights/hyperscalers-control-most-compute",
  },
  {
    label: "Theme research — who owns AI compute",
    url: PRIOR_RESEARCH_PATH,
  },
  {
    label: "August location rankings update",
    url: PRIOR_UPDATE_PATH,
  },
  {
    label: "Concentration lens (top-k / HHI)",
    url: PRIOR_CONCENTRATION_PATH,
  },
  {
    label: "Major AI brands token consumption 2022–2026",
    url: TOKEN_POST_PATH,
  },
  {
    label: "Global AI data-center build tracker",
    url: BUILD_TRACKER_PATH,
  },
] as const;

export const HEADLINE = {
  /** Regional AI DC capacity by power draw */
  top1RegionSharePct: 45,
  top1RegionLabel: "United States",
  top1RegionGw: 18.5,
  top3RegionSharePct: 77,
  top3RegionLabel: "US · China · Europe",
  worldAiDcGw: 41.1,
  chinaRegionSharePct: 18,
  europeRegionSharePct: 14,

  /** Dual-hub + market geography (Synergy Aug 19) */
  dualHubSharePct: 17,
  dualHubLabel: "N. Virginia + Greater Beijing",
  marketTop20Pct: 60,
  marketTop40Pct: 79,
  nvaSharePct: 9,
  beijingSharePct: 8,
  dublinOnlyEuTop20: true,

  /** Token origin geography (June 2026) */
  tokenChinaOriginPct: 61.8,
  tokenUsOriginPct: 37.7,
  tokenOtherOriginPct: 0.5,
  tokenTop1BrandPct: 29.2,
  tokenTop1Brand: "ByteDance (Doubao)",
  tokenTotalT: 18503,

  /** Pipeline / growth geography */
  pipelineSites: 915,
  pipelinePriorSites: 803,
  pipelineDelta: 112,
  usPipelineSharePct: 54,
  texasOpsYoyPct: 71,
  worldOpsYoyPct: 36,
  top20UsSeats: 15,
  top20TotalSeats: 20,

  /** Ownership HQ vs deployment mismatch */
  ownerUsHqSharePct: 71.4,
  ownerChinaSharePct: 5.0,
  ownerBig5Label: "US Big-5 chip ownership",
} as const;

export type RegionCapacity = {
  id: string;
  region: string;
  short: string;
  sharePct: number;
  approxGw: number;
  cumulativeSharePct: number;
  topMetro: string;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Regional AI DC capacity by power draw — sum ≈100%, ~41 GW perimeter. */
export const REGION_CAPACITY: RegionCapacity[] = [
  {
    id: "united-states",
    region: "United States",
    short: "US",
    sharePct: 45,
    approxGw: 18.5,
    cumulativeSharePct: 45,
    topMetro: "Northern Virginia",
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Industry-tracker headline; densified coastal + inland corridors",
  },
  {
    id: "china",
    region: "China",
    short: "China",
    sharePct: 18,
    approxGw: 7.4,
    cumulativeSharePct: 63,
    topMetro: "Greater Beijing",
    confidence: "estimated",
    fill: "#f43f5e",
    note: "High domestic FLOP/s; GPU mix export-control constrained",
  },
  {
    id: "europe",
    region: "Europe",
    short: "Europe",
    sharePct: 14,
    approxGw: 5.8,
    cumulativeSharePct: 77,
    topMetro: "Dublin",
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Nordics / Ireland / UK / France; grid & permitting friction",
  },
  {
    id: "middle-east",
    region: "Middle East",
    short: "MEA",
    sharePct: 10,
    approxGw: 4.1,
    cumulativeSharePct: 87,
    topMetro: "UAE / Abu Dhabi",
    confidence: "estimated",
    fill: "#f59e0b",
    note: "UAE Stargate, Saudi Humain — announced-heavy",
  },
  {
    id: "rest-apac",
    region: "Rest of Asia-Pacific",
    short: "APAC",
    sharePct: 9,
    approxGw: 3.7,
    cumulativeSharePct: 96,
    topMetro: "Singapore / Tokyo",
    confidence: "estimated",
    fill: "#14b8a6",
    note: "India, Singapore, Japan, Korea, Australia",
  },
  {
    id: "latam-other",
    region: "LatAm & other",
    short: "LatAm+",
    sharePct: 4,
    approxGw: 1.6,
    cumulativeSharePct: 100,
    topMetro: "São Paulo",
    confidence: "estimated",
    fill: "#94a3b8",
    note: "Brazil, Mexico, Canada residual outside US total",
  },
];

export type MetroMarket = {
  id: string;
  label: string;
  short: string;
  region: "United States" | "China" | "Europe" | "Other";
  rankBand: "dual-hub" | "top-6" | "top-20" | "high-growth";
  capacityHintPct: number;
  yoyGrowthPct: number;
  pipelineWeight: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Synergy Aug 19 metro / market snapshot — capacity hints within disclosed bands. */
export const METRO_MARKETS: MetroMarket[] = [
  {
    id: "nva",
    label: "Northern Virginia",
    short: "NoVA",
    region: "United States",
    rankBand: "dual-hub",
    capacityHintPct: 9,
    yoyGrowthPct: 28,
    pipelineWeight: 12,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "Largest live hyperscale metro; part of 17% dual-hub",
  },
  {
    id: "beijing",
    label: "Greater Beijing",
    short: "Beijing",
    region: "China",
    rankBand: "dual-hub",
    capacityHintPct: 8,
    yoyGrowthPct: 32,
    pipelineWeight: 9,
    confidence: "disclosed",
    fill: "#f43f5e",
    note: "Pairs with NoVA for Synergy’s 17% dual-hub print",
  },
  {
    id: "oregon",
    label: "Oregon",
    short: "Oregon",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 5,
    yoyGrowthPct: 35,
    pipelineWeight: 6,
    confidence: "estimated",
    fill: "#38bdf8",
  },
  {
    id: "iowa",
    label: "Iowa",
    short: "Iowa",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 4.5,
    yoyGrowthPct: 40,
    pipelineWeight: 7,
    confidence: "estimated",
    fill: "#0284c7",
  },
  {
    id: "ohio",
    label: "Ohio",
    short: "Ohio",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 4,
    yoyGrowthPct: 42,
    pipelineWeight: 8,
    confidence: "estimated",
    fill: "#0369a1",
  },
  {
    id: "dfw",
    label: "Dallas–Fort Worth",
    short: "DFW",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 4,
    yoyGrowthPct: 55,
    pipelineWeight: 10,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "dublin",
    label: "Dublin",
    short: "Dublin",
    region: "Europe",
    rankBand: "top-20",
    capacityHintPct: 2.5,
    yoyGrowthPct: 18,
    pipelineWeight: 3,
    confidence: "disclosed",
    fill: "#8b5cf6",
    note: "Sole EU seat in Synergy top-20",
  },
  {
    id: "texas-ops",
    label: "Texas (ops aggregate)",
    short: "Texas",
    region: "United States",
    rankBand: "high-growth",
    capacityHintPct: 3.5,
    yoyGrowthPct: 71,
    pipelineWeight: 11,
    confidence: "disclosed",
    fill: "#ea580c",
    note: "+71% YoY ops vs +36% world average",
  },
];

export type TokenOrigin = {
  id: string;
  origin: string;
  short: string;
  sharePct: number;
  tokensT: number;
  topBrand: string;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Token throughput by brand origin — June 2026 major-brands series. */
export const TOKEN_ORIGINS: TokenOrigin[] = [
  {
    id: "china",
    origin: "China",
    short: "China",
    sharePct: 61.8,
    tokensT: 11435,
    topBrand: "ByteDance",
    confidence: "estimated",
    fill: "#f43f5e",
    note: "Doubao + Qwen + GLM + Hunyuan surfaces dominate routed tokens",
  },
  {
    id: "united-states",
    origin: "United States",
    short: "US",
    sharePct: 37.7,
    tokensT: 6976,
    topBrand: "Google",
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Google + OpenAI tip; Microsoft/Amazon first-party smaller",
  },
  {
    id: "other",
    origin: "Other / residual",
    short: "Other",
    sharePct: 0.5,
    tokensT: 92,
    topBrand: "—",
    confidence: "desk",
    fill: "#64748b",
    note: "Closes the June 2026 major-brands perimeter",
  },
];

export type TokenBrandGeo = {
  id: string;
  label: string;
  origin: "United States" | "China" | "Other";
  sharePct: number;
  tokensT: number;
  fill: string;
  note?: string;
};

export const TOKEN_BRANDS_GEO: TokenBrandGeo[] = [
  {
    id: "bytedance",
    label: "ByteDance",
    origin: "China",
    sharePct: 29.2,
    tokensT: 5400,
    fill: "#f43f5e",
  },
  {
    id: "google",
    label: "Google",
    origin: "United States",
    sharePct: 19.0,
    tokensT: 3520,
    fill: "#4285f4",
  },
  {
    id: "alibaba",
    label: "Alibaba (Qwen)",
    origin: "China",
    sharePct: 11.3,
    tokensT: 2100,
    fill: "#ff6a00",
  },
  {
    id: "openai",
    label: "OpenAI",
    origin: "United States",
    sharePct: 9.2,
    tokensT: 1700,
    fill: "#10b981",
  },
  {
    id: "zhipu",
    label: "Zhipu / Z.ai",
    origin: "China",
    sharePct: 5.1,
    tokensT: 950,
    fill: "#14b8a6",
  },
  {
    id: "tencent",
    label: "Tencent",
    origin: "China",
    sharePct: 3.8,
    tokensT: 700,
    fill: "#12b7f5",
  },
  {
    id: "rest",
    label: "All other brands",
    origin: "Other",
    sharePct: 22.4,
    tokensT: 4133,
    fill: "#64748b",
  },
];

export type PipelineRegion = {
  id: string;
  region: string;
  short: string;
  sitesSharePct: number;
  sitesApprox: number;
  liveCapacitySharePct: number;
  opsYoyPct: number | null;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Pipeline geography vs live capacity — US overweight on sites vs already-live share.
 * Sites sum to 915; shares are desk roll-ups from Synergy ledger + theme carry.
 */
export const PIPELINE_REGIONS: PipelineRegion[] = [
  {
    id: "united-states",
    region: "United States",
    short: "US",
    sitesSharePct: 54,
    sitesApprox: 494,
    liveCapacitySharePct: 45,
    opsYoyPct: 42,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "15 of top-20 Synergy seats; Texas ops +71% YoY tip",
  },
  {
    id: "china",
    region: "China",
    short: "China",
    sitesSharePct: 16,
    sitesApprox: 146,
    liveCapacitySharePct: 18,
    opsYoyPct: 34,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    id: "europe",
    region: "Europe",
    short: "Europe",
    sitesSharePct: 12,
    sitesApprox: 110,
    liveCapacitySharePct: 14,
    opsYoyPct: 18,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Dublin sole top-20 EU seat; Nordics / UK / FR building",
  },
  {
    id: "middle-east",
    region: "Middle East",
    short: "MEA",
    sitesSharePct: 9,
    sitesApprox: 82,
    liveCapacitySharePct: 10,
    opsYoyPct: 55,
    confidence: "desk",
    fill: "#f59e0b",
    note: "Announced-heavy; conversion risk above US inland corridors",
  },
  {
    id: "rest-apac",
    region: "Rest of Asia-Pacific",
    short: "APAC",
    sitesSharePct: 7,
    sitesApprox: 64,
    liveCapacitySharePct: 9,
    opsYoyPct: 38,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "latam-other",
    region: "LatAm & other",
    short: "LatAm+",
    sitesSharePct: 2,
    sitesApprox: 19,
    liveCapacitySharePct: 4,
    opsYoyPct: null,
    confidence: "desk",
    fill: "#94a3b8",
  },
];

export type MismatchMeter = {
  id: string;
  label: string;
  map: string;
  topSharePct: number;
  topLabel: string;
  fill: string;
  note: string;
};

/** Family of geography meters — deliberately disagreeing maps. */
export const METER_COMPARE: MismatchMeter[] = [
  {
    id: "capacity",
    label: "AI DC capacity",
    map: "Power-draw region",
    topSharePct: HEADLINE.top1RegionSharePct,
    topLabel: HEADLINE.top1RegionLabel,
    fill: "#0ea5e9",
    note: "US ~45% of global AI-relevant DC capacity",
  },
  {
    id: "dual-hub",
    label: "Dual-hub metros",
    map: "Live hyperscale",
    topSharePct: HEADLINE.dualHubSharePct,
    topLabel: HEADLINE.dualHubLabel,
    fill: "#f59e0b",
    note: "NoVA + Beijing alone = 17% of hyperscale capacity",
  },
  {
    id: "tokens",
    label: "Token origin",
    map: "Brand HQ / origin",
    topSharePct: HEADLINE.tokenChinaOriginPct,
    topLabel: "China",
    fill: "#f43f5e",
    note: "China-origin brands ~61.8% of June 2026 tokens",
  },
  {
    id: "pipeline",
    label: "Pipeline sites",
    map: "Build geography",
    topSharePct: HEADLINE.usPipelineSharePct,
    topLabel: "United States",
    fill: "#38bdf8",
    note: "US ~54% of 915 known hyperscale pipeline sites",
  },
  {
    id: "ownership",
    label: "Chip ownership HQ",
    map: "Owner geography",
    topSharePct: HEADLINE.ownerUsHqSharePct,
    topLabel: "US Big-5",
    fill: "#4285f4",
    note: "US hyperscalers ~71.4% of world H100e stock",
  },
];

export type RegionYearPoint = {
  year: number;
  us: number;
  china: number;
  europe: number;
  mea: number;
  apac: number;
  other: number;
};

/** Editorial capacity-share path (not a new microdata extract). */
export const REGION_BY_YEAR: RegionYearPoint[] = [
  { year: 2022, us: 48, china: 16, europe: 15, mea: 5, apac: 10, other: 6 },
  { year: 2023, us: 47, china: 17, europe: 14, mea: 7, apac: 10, other: 5 },
  { year: 2024, us: 46, china: 17, europe: 14, mea: 8, apac: 10, other: 5 },
  { year: 2025, us: 45, china: 18, europe: 14, mea: 9, apac: 9, other: 5 },
  { year: 2026, us: 45, china: 18, europe: 14, mea: 10, apac: 9, other: 4 },
];

export type OwnerGeoRow = {
  id: string;
  label: string;
  hqRegion: "United States" | "China" | "Other";
  sharePct: number;
  fill: string;
  note?: string;
};

/** Chip ownership by HQ geography — Epoch Big-5 + China aggregate carry. */
export const OWNER_GEO: OwnerGeoRow[] = [
  {
    id: "google",
    label: "Google",
    hqRegion: "United States",
    sharePct: 25.0,
    fill: "#4285f4",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    hqRegion: "United States",
    sharePct: 17.3,
    fill: "#00a4ef",
  },
  {
    id: "amazon",
    label: "Amazon",
    hqRegion: "United States",
    sharePct: 12.5,
    fill: "#ff9900",
  },
  {
    id: "meta",
    label: "Meta",
    hqRegion: "United States",
    sharePct: 11.3,
    fill: "#0668E1",
  },
  {
    id: "oracle",
    label: "Oracle",
    hqRegion: "United States",
    sharePct: 5.3,
    fill: "#f80000",
  },
  {
    id: "china-agg",
    label: "China aggregate",
    hqRegion: "China",
    sharePct: 5.0,
    fill: "#f43f5e",
    note: "Domestic GPU + limited export-control mix",
  },
  {
    id: "rest",
    label: "Other owners",
    hqRegion: "Other",
    sharePct: 23.6,
    fill: "#64748b",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtGw(n: number): string {
  return `${n.toFixed(1)} GW`;
}

export function fmtTokensT(n: number): string {
  return `${n.toLocaleString()}T`;
}

export function regionBars(metric: "share" | "gw") {
  return [...REGION_CAPACITY]
    .map((r) => ({
      ...r,
      value: metric === "gw" ? r.approxGw : r.sharePct,
    }))
    .sort((a, b) => b.value - a.value);
}

export function metroBars(metric: "capacity" | "growth" | "pipeline") {
  return [...METRO_MARKETS]
    .map((m) => ({
      ...m,
      value:
        metric === "capacity"
          ? m.capacityHintPct
          : metric === "growth"
            ? m.yoyGrowthPct
            : m.pipelineWeight,
    }))
    .sort((a, b) => b.value - a.value);
}

export function tokenOriginPie() {
  return TOKEN_ORIGINS.map((t) => ({
    name: t.short,
    value: t.sharePct,
    fill: t.fill,
  }));
}

export function tokenBrandBars(originFilter: "all" | "China" | "United States") {
  let rows = [...TOKEN_BRANDS_GEO].filter((b) => b.id !== "rest");
  if (originFilter !== "all") {
    rows = rows.filter((b) => b.origin === originFilter);
  }
  return rows.sort((a, b) => b.sharePct - a.sharePct);
}

export function pipelineCompare() {
  return PIPELINE_REGIONS.map((p) => ({
    short: p.short,
    sites: p.sitesSharePct,
    live: p.liveCapacitySharePct,
    fill: p.fill,
  }));
}

export function growthScatter(regionFilter: "all" | MetroMarket["region"]) {
  return METRO_MARKETS.filter(
    (m) => regionFilter === "all" || m.region === regionFilter,
  ).map((m) => ({
    ...m,
    x: m.capacityHintPct,
    y: m.yoyGrowthPct,
    z: Math.max(40, m.pipelineWeight * 8),
  }));
}

export function areaPath() {
  return REGION_BY_YEAR.map((r) => ({
    year: String(r.year),
    US: r.us,
    China: r.china,
    Europe: r.europe,
    MEA: r.mea,
    APAC: r.apac,
    Other: r.other,
  }));
}

export function ownerHqRollup() {
  const map = new Map<string, { region: string; sharePct: number; fill: string }>();
  for (const o of OWNER_GEO) {
    const prev = map.get(o.hqRegion);
    if (prev) prev.sharePct += o.sharePct;
    else
      map.set(o.hqRegion, {
        region: o.hqRegion,
        sharePct: o.sharePct,
        fill:
          o.hqRegion === "United States"
            ? "#0ea5e9"
            : o.hqRegion === "China"
              ? "#f43f5e"
              : "#64748b",
      });
  }
  return [...map.values()].sort((a, b) => b.sharePct - a.sharePct);
}
