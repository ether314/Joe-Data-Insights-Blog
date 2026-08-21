/**
 * Industrial robotics concentration — top-1 / top-3 / top-5 install shares,
 * Asia regional dominance, China domestic supplier majority, industry mix.
 * Complements the research (levels) and update (YoY) posts with a distribution lens.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Market, region, stock, industry, and China domestic-supplier shares from IFR World Robotics 2025 (released 25 Sep 2025; 2024 install vintage). Q3 2026 Asia share and world install prelim from IFR Executive Roundtable / US growth releases (Jun 2026). Vendor-rank shares outside China are estimated from public IFR narrative bands; HHI is derived from disclosed top-market shares plus residual.";

export const IFR_WR_URL =
  "https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years";
export const IFR_EXEC_URL =
  "https://ifr.org/img/worldrobotics/Executive_Summary_WR_2025_Industrial_Robots.pdf";
export const IFR_CHINA_URL =
  "https://ifr.org/downloads/press_docs/2025-09-25-IFR_press_release_China_in_English.pdf";
export const IFR_US_2026_URL =
  "https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth";

/** World installations 2024 (IFR WR 2025) */
export const WORLD_UNITS_2024 = 542_076;
export const WORLD_STOCK_2024 = 4_663_773;

export const HEADLINE = {
  /** Top-1 country share of 2024 global installations */
  top1SharePct: 54,
  top1Label: "China",
  top1Units: 295_000,
  /** Top-3: China + Japan + United States */
  top3SharePct: 69,
  top3Units: 373_653,
  /** Top-5: China, Japan, US, Korea, Germany — IFR disclosed */
  top5SharePct: 80,
  top5Units: 431_240,
  asiaShare2024Pct: 74,
  asiaShare2025PrelimPct: 79,
  chinaStockSharePct: 43,
  chinaDomesticSupplierPct: 57,
  chinaDomesticPriorPct: 47,
  electronicsSharePct: 24,
  automotiveSharePct: 23,
  top2IndustrySharePct: 47,
  worldUnits2024: WORLD_UNITS_2024,
  worldUnits2025Prelim: 621_000,
  /** Approximate HHI from top-5 disclosed + residual bucket (0–10,000) */
  marketHhi2024: 3120,
} as const;

export type MarketShare = {
  rank: number;
  market: string;
  short: string;
  region: "Asia" | "Europe" | "Americas";
  units2024: number;
  sharePct: number;
  cumulativeSharePct: number;
  yoyPct: number | null;
  stock2024: number | null;
  confidence: Confidence;
  fill: string;
};

/** Ranked install markets — concentration ladder (IFR WR 2025) */
export const MARKET_SHARES: MarketShare[] = [
  {
    rank: 1,
    market: "China",
    short: "China",
    region: "Asia",
    units2024: 295_000,
    sharePct: 54.4,
    cumulativeSharePct: 54.4,
    yoyPct: 7,
    stock2024: 2_027_000,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    rank: 2,
    market: "Japan",
    short: "Japan",
    region: "Asia",
    units2024: 44_453,
    sharePct: 8.2,
    cumulativeSharePct: 62.6,
    yoyPct: -4,
    stock2024: 450_530,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    rank: 3,
    market: "United States",
    short: "US",
    region: "Americas",
    units2024: 34_200,
    sharePct: 6.3,
    cumulativeSharePct: 68.9,
    yoyPct: -9,
    stock2024: 391_757,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    rank: 4,
    market: "Korea, Republic of",
    short: "Korea",
    region: "Asia",
    units2024: 30_596,
    sharePct: 5.6,
    cumulativeSharePct: 74.6,
    yoyPct: -3,
    stock2024: 391_757,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    rank: 5,
    market: "Germany",
    short: "Germany",
    region: "Europe",
    units2024: 26_982,
    sharePct: 5.0,
    cumulativeSharePct: 79.6,
    yoyPct: -5,
    stock2024: 279_826,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    rank: 6,
    market: "India",
    short: "India",
    region: "Asia",
    units2024: 9_100,
    sharePct: 1.7,
    cumulativeSharePct: 81.2,
    yoyPct: 7,
    stock2024: null,
    confidence: "disclosed",
    fill: "#64748b",
  },
  {
    rank: 7,
    market: "Italy",
    short: "Italy",
    region: "Europe",
    units2024: 8_783,
    sharePct: 1.6,
    cumulativeSharePct: 82.9,
    yoyPct: -16,
    stock2024: null,
    confidence: "disclosed",
    fill: "#94a3b8",
  },
  {
    rank: 8,
    market: "Mexico",
    short: "Mexico",
    region: "Americas",
    units2024: 5_800,
    sharePct: 1.1,
    cumulativeSharePct: 83.9,
    yoyPct: null,
    stock2024: null,
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    rank: 9,
    market: "Spain",
    short: "Spain",
    region: "Europe",
    units2024: 5_100,
    sharePct: 0.9,
    cumulativeSharePct: 84.9,
    yoyPct: null,
    stock2024: null,
    confidence: "disclosed",
    fill: "#cbd5e1",
  },
  {
    rank: 10,
    market: "France",
    short: "France",
    region: "Europe",
    units2024: 4_900,
    sharePct: 0.9,
    cumulativeSharePct: 85.8,
    yoyPct: -24,
    stock2024: null,
    confidence: "disclosed",
    fill: "#e2e8f0",
  },
];

/** Lorenz / cumulative curve points (equal-split diagonal for comparison) */
export const CONCENTRATION_CURVE = MARKET_SHARES.map((m, i) => ({
  rank: m.rank,
  market: m.short,
  cumulativeSharePct: m.cumulativeSharePct,
  equalSharePct: Number((((i + 1) / MARKET_SHARES.length) * 100).toFixed(1)),
  sharePct: m.sharePct,
}));

export type RegionShare = {
  region: string;
  short: string;
  units2024: number;
  share2024Pct: number;
  share2025PrelimPct: number | null;
  yoyPct: number | null;
  fill: string;
  confidence: Confidence;
};

export const REGION_SHARES: RegionShare[] = [
  {
    region: "Asia",
    short: "Asia",
    units2024: 401_665,
    share2024Pct: 74,
    share2025PrelimPct: 79,
    yoyPct: 5,
    fill: "#f59e0b",
    confidence: "disclosed",
  },
  {
    region: "Europe",
    short: "Europe",
    units2024: 85_006,
    share2024Pct: 16,
    share2025PrelimPct: 13,
    yoyPct: -8,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    region: "Americas",
    short: "Americas",
    units2024: 50_077,
    share2024Pct: 9,
    share2025PrelimPct: 8,
    yoyPct: -10,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
];

/** China domestic vs foreign supplier share over time */
export const CHINA_SUPPLIER_SERIES = [
  { year: 2014, domesticPct: 28, foreignPct: 72, confidence: "estimated" as Confidence },
  { year: 2020, domesticPct: 35, foreignPct: 65, confidence: "estimated" as Confidence },
  { year: 2022, domesticPct: 40, foreignPct: 60, confidence: "estimated" as Confidence },
  { year: 2023, domesticPct: 47, foreignPct: 53, confidence: "disclosed" as Confidence },
  { year: 2024, domesticPct: 57, foreignPct: 43, confidence: "disclosed" as Confidence },
];

export type IndustryShare = {
  industry: string;
  short: string;
  units2024: number;
  sharePct: number;
  yoyPct: number | null;
  chinaUnits: number | null;
  chinaGlobalSharePct: number | null;
  fill: string;
  confidence: Confidence;
};

export const INDUSTRY_SHARES: IndustryShare[] = [
  {
    industry: "Electrical / electronics",
    short: "Electronics",
    units2024: 128_899,
    sharePct: 24,
    yoyPct: 2.5,
    chinaUnits: 83_000,
    chinaGlobalSharePct: 64,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    industry: "Automotive",
    short: "Automotive",
    units2024: 126_088,
    sharePct: 23,
    yoyPct: -6.9,
    chinaUnits: 57_200,
    chinaGlobalSharePct: 45,
    fill: "#f43f5e",
    confidence: "disclosed",
  },
  {
    industry: "Metal & machinery",
    short: "Metal/mach.",
    units2024: Math.round(WORLD_UNITS_2024 * 0.16),
    sharePct: 16,
    yoyPct: null,
    chinaUnits: 54_600,
    chinaGlobalSharePct: null,
    fill: "#f59e0b",
    confidence: "disclosed",
  },
  {
    industry: "Plastic & chemical",
    short: "Plastic/chem.",
    units2024: Math.round(WORLD_UNITS_2024 * 0.05),
    sharePct: 5,
    yoyPct: null,
    chinaUnits: null,
    chinaGlobalSharePct: null,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    industry: "Food & beverage",
    short: "Food/bev.",
    units2024: Math.round(WORLD_UNITS_2024 * 0.04),
    sharePct: 4,
    yoyPct: null,
    chinaUnits: null,
    chinaGlobalSharePct: null,
    fill: "#14b8a6",
    confidence: "disclosed",
  },
  {
    industry: "Other / unspecified",
    short: "Other",
    units2024: Math.round(WORLD_UNITS_2024 * 0.28),
    sharePct: 28,
    yoyPct: null,
    chinaUnits: null,
    chinaGlobalSharePct: null,
    fill: "#64748b",
    confidence: "estimated",
  },
];

/** Stock concentration — operational robots by top markets */
export type StockShare = {
  market: string;
  short: string;
  stock2024: number;
  sharePct: number;
  fill: string;
};

export const STOCK_SHARES: StockShare[] = [
  { market: "China", short: "China", stock2024: 2_027_190, sharePct: 43.5, fill: "#f43f5e" },
  { market: "Japan", short: "Japan", stock2024: 450_530, sharePct: 9.7, fill: "#f59e0b" },
  { market: "United States", short: "US", stock2024: 391_757, sharePct: 8.4, fill: "#0ea5e9" },
  { market: "Korea", short: "Korea", stock2024: 391_757, sharePct: 8.4, fill: "#8b5cf6" },
  { market: "Germany", short: "Germany", stock2024: 279_826, sharePct: 6.0, fill: "#14b8a6" },
  {
    market: "Rest of world",
    short: "ROW",
    stock2024: WORLD_STOCK_2024 - 2_027_190 - 450_530 - 391_757 - 391_757 - 279_826,
    sharePct: 24.0,
    fill: "#94a3b8",
  },
];

/** Top-k share summary for ladder / KPI strip */
export const TOP_K_LADDER = [
  { k: 1, label: "Top-1", sharePct: HEADLINE.top1SharePct, units: HEADLINE.top1Units, note: "China alone" },
  { k: 3, label: "Top-3", sharePct: HEADLINE.top3SharePct, units: HEADLINE.top3Units, note: "CN + JP + US" },
  { k: 5, label: "Top-5", sharePct: HEADLINE.top5SharePct, units: HEADLINE.top5Units, note: "+ KR + DE" },
];

/** Scatter: share vs YoY — who is concentrated *and* still growing */
export type ShareGrowthPoint = {
  market: string;
  short: string;
  sharePct: number;
  yoyPct: number;
  units: number;
  region: string;
  fill: string;
};

export const SHARE_GROWTH_SCATTER: ShareGrowthPoint[] = MARKET_SHARES.filter(
  (m) => m.yoyPct != null,
).map((m) => ({
  market: m.market,
  short: m.short,
  sharePct: m.sharePct,
  yoyPct: m.yoyPct as number,
  units: m.units2024,
  region: m.region,
  fill: m.fill,
}));

/** Vintage bridge: 2024 WR → 2025 prelim concentration */
export const VINTAGE_BRIDGE = [
  {
    meter: "World installs",
    wr2024: WORLD_UNITS_2024,
    prelim2025: 621_000,
    unit: "units",
    confidence: "disclosed" as Confidence,
  },
  {
    meter: "Asia share",
    wr2024: 74,
    prelim2025: 79,
    unit: "pct",
    confidence: "disclosed" as Confidence,
  },
  {
    meter: "Europe share",
    wr2024: 16,
    prelim2025: 13,
    unit: "pct",
    confidence: "estimated" as Confidence,
  },
  {
    meter: "Americas share",
    wr2024: 9,
    prelim2025: 8,
    unit: "pct",
    confidence: "estimated" as Confidence,
  },
];

export const SOURCES = [
  { label: "IFR World Robotics 2025 release", url: IFR_WR_URL },
  { label: "IFR WR 2025 Executive Summary", url: IFR_EXEC_URL },
  { label: "IFR China press release (25 Sep 2025)", url: IFR_CHINA_URL },
  { label: "IFR US double-digit growth (Jun 2026)", url: IFR_US_2026_URL },
] as const;

export function fmtUnits(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}
