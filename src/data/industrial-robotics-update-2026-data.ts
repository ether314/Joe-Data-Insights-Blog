/**
 * Industrial robotics — vintage update (Aug 2026).
 * Core question: What changed vs the research print (IFR WR 2025 flow geography)
 * once we isolate YoY deltas, density/stock, cobots, and decade industry mix?
 *
 * Primary sources:
 * - IFR World Robotics 2025 Industrial Robots (released 25 Sep 2025)
 * - IFR press release + executive summary (installations, stock, density, cobots)
 * - Prior research vintage: /blog/industrial-robotics-research-2026
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Vintage delta vs research print: IFR World Robotics 2025 (2024 installations + stock + density + cobots). YoY % are IFR-disclosed market/region changes 2023→2024. Density is robots per 10,000 manufacturing employees (2024). Cobot series from IFR WR 2025 collaborative-robot chapter / press graphs. Decade industry shares compare 2014 vs 2024 IFR narrative.";

export const IFR_URL =
  "https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years";
export const IFR_EXEC_URL =
  "https://ifr.org/img/worldrobotics/Executive_Summary_WR_2025_Industrial_Robots.pdf";
export const PRIOR_POST_PATH = "/blog/industrial-robotics-research-2026";
export const DENSITY_POST_PATH = "/blog/manufacturing-robot-density-ifr-2024";

/** Headline delta stats for cards / prose */
export const HEADLINE = {
  worldUnits2024: 542_076,
  worldUnits2023: 541_302,
  worldYoyPct: 0.1,
  worldStock2024: 4_663_773,
  worldStockYoyPct: 9,
  asiaSharePct: 74,
  asiaUnits2024: 401_665,
  asiaYoyPct: 5,
  europeUnits2024: 85_006,
  europeYoyPct: -8,
  americasUnits2024: 50_077,
  americasYoyPct: -10,
  chinaUnits2024: 295_045,
  chinaYoyPct: 7,
  chinaSharePct: 54,
  chinaDomesticPct2014: 28,
  chinaDomesticPct2024: 57,
  chinaDomesticDeltaPp: 29,
  usUnits2024: 34_204,
  usYoyPct: -9,
  japanUnits2024: 44_453,
  japanYoyPct: -4,
  germanyUnits2024: 26_982,
  germanyYoyPct: -5,
  indiaUnits2024: 9_100,
  indiaYoyPct: 7,
  densityWorld2024: 177,
  densityAsia2024: 204,
  densityEurope2024: 148,
  densityAmericas2024: 131,
  densityAsiaCagr2019_24: 12,
  densityEuropeCagr2019_24: 7,
  densityAmericasCagr2019_24: 6,
  densityKorea2024: 1220,
  densitySingapore2024: 818,
  densityGermany2024: 449,
  densityJapan2024: 446,
  densityChina2024: 567,
  cobots2024: 64_500,
  cobotsYoyPct: 12,
  cobotSharePct2024: 12,
  cobots2020Approx: 30_000,
  generalIndustryShare2014: 36,
  generalIndustryShare2024: 53,
  autoShare2014: 43,
  autoShare2024: 23,
  electronicsShare2014: 21,
  electronicsShare2024: 24,
  forecast2025: 575_000,
  forecast2028: 710_000,
  forecast2025YoyPct: 6,
};

export type MarketYoy = {
  market: string;
  shortLabel: string;
  region: "Asia" | "Europe" | "Americas";
  units2024: number;
  yoyPct: number;
  stock2024: number | null;
  density2024: number | null;
  confidence: Confidence;
};

/** Top markets — YoY is the update lens (research post ranked levels) */
export const MARKET_YOY: MarketYoy[] = [
  {
    market: "China",
    shortLabel: "China",
    region: "Asia",
    units2024: 295_045,
    yoyPct: 7,
    stock2024: 2_027_000,
    density2024: 567,
    confidence: "disclosed",
  },
  {
    market: "Japan",
    shortLabel: "Japan",
    region: "Asia",
    units2024: 44_453,
    yoyPct: -4,
    stock2024: 450_530,
    density2024: 446,
    confidence: "disclosed",
  },
  {
    market: "United States",
    shortLabel: "United States",
    region: "Americas",
    units2024: 34_204,
    yoyPct: -9,
    stock2024: 391_757,
    density2024: null,
    confidence: "disclosed",
  },
  {
    market: "Korea, Republic of",
    shortLabel: "South Korea",
    region: "Asia",
    units2024: 30_596,
    yoyPct: -3,
    stock2024: 391_757,
    density2024: 1_220,
    confidence: "disclosed",
  },
  {
    market: "Germany",
    shortLabel: "Germany",
    region: "Europe",
    units2024: 26_982,
    yoyPct: -5,
    stock2024: 279_826,
    density2024: 449,
    confidence: "disclosed",
  },
  {
    market: "India",
    shortLabel: "India",
    region: "Asia",
    units2024: 9_100,
    yoyPct: 7,
    stock2024: null,
    density2024: null,
    confidence: "disclosed",
  },
  {
    market: "Italy",
    shortLabel: "Italy",
    region: "Europe",
    units2024: 8_783,
    yoyPct: -16,
    stock2024: null,
    density2024: null,
    confidence: "disclosed",
  },
  {
    market: "Mexico",
    shortLabel: "Mexico",
    region: "Americas",
    units2024: 5_600,
    yoyPct: -4,
    stock2024: null,
    density2024: null,
    confidence: "disclosed",
  },
  {
    market: "Spain",
    shortLabel: "Spain",
    region: "Europe",
    units2024: 5_100,
    yoyPct: 0,
    stock2024: null,
    density2024: null,
    confidence: "estimated",
  },
  {
    market: "France",
    shortLabel: "France",
    region: "Europe",
    units2024: 4_900,
    yoyPct: -24,
    stock2024: null,
    density2024: null,
    confidence: "disclosed",
  },
  {
    market: "Canada",
    shortLabel: "Canada",
    region: "Americas",
    units2024: 3_800,
    yoyPct: -12,
    stock2024: null,
    density2024: null,
    confidence: "disclosed",
  },
  {
    market: "United Kingdom",
    shortLabel: "UK",
    region: "Europe",
    units2024: 2_500,
    yoyPct: -35,
    stock2024: null,
    density2024: null,
    confidence: "disclosed",
  },
];

export type RegionYoy = {
  region: string;
  shortLabel: string;
  units2024: number;
  sharePct: number;
  yoyPct: number;
  density2024: number;
  densityCagr2019_24: number;
  color: string;
  confidence: Confidence;
};

export const REGION_YOY: RegionYoy[] = [
  {
    region: "Asia",
    shortLabel: "Asia",
    units2024: 401_665,
    sharePct: 74,
    yoyPct: 5,
    density2024: 204,
    densityCagr2019_24: 12,
    color: "#f59e0b",
    confidence: "disclosed",
  },
  {
    region: "Europe",
    shortLabel: "Europe",
    units2024: 85_006,
    sharePct: 16,
    yoyPct: -8,
    density2024: 148,
    densityCagr2019_24: 7,
    color: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    region: "Americas",
    shortLabel: "Americas",
    units2024: 50_077,
    sharePct: 9,
    yoyPct: -10,
    density2024: 131,
    densityCagr2019_24: 6,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
];

export type DensityLeader = {
  market: string;
  shortLabel: string;
  density2024: number;
  region: "Asia" | "Europe" | "Americas";
  confidence: Confidence;
};

export const DENSITY_LEADERS: DensityLeader[] = [
  { market: "Korea, Republic of", shortLabel: "South Korea", density2024: 1220, region: "Asia", confidence: "disclosed" },
  { market: "Singapore", shortLabel: "Singapore", density2024: 818, region: "Asia", confidence: "disclosed" },
  { market: "China", shortLabel: "China", density2024: 567, region: "Asia", confidence: "disclosed" },
  { market: "Germany", shortLabel: "Germany", density2024: 449, region: "Europe", confidence: "disclosed" },
  { market: "Japan", shortLabel: "Japan", density2024: 446, region: "Asia", confidence: "disclosed" },
  { market: "Sweden", shortLabel: "Sweden", density2024: 377, region: "Europe", confidence: "disclosed" },
  { market: "Denmark", shortLabel: "Denmark", density2024: 329, region: "Europe", confidence: "disclosed" },
  { market: "Slovenia", shortLabel: "Slovenia", density2024: 315, region: "Europe", confidence: "disclosed" },
];

export type DecadeShare = {
  segment: string;
  shortLabel: string;
  share2014: number;
  share2024: number;
  confidence: Confidence;
};

/** Decade reweight — general industry absorbs auto’s lost share */
export const DECADE_INDUSTRY_SHARE: DecadeShare[] = [
  {
    segment: "General industries (ex-auto)",
    shortLabel: "General ind.",
    share2014: 36,
    share2024: 53,
    confidence: "disclosed",
  },
  {
    segment: "Automotive",
    shortLabel: "Automotive",
    share2014: 43,
    share2024: 23,
    confidence: "disclosed",
  },
  {
    segment: "Electrical / electronics",
    shortLabel: "Electronics",
    share2014: 21,
    share2024: 24,
    confidence: "disclosed",
  },
];

export type CobotYear = {
  year: number;
  units: number;
  sharePct: number | null;
  confidence: Confidence;
};

/** Collaborative robots — IFR WR 2025 (+12% to 64.5k; ~12% of installs) */
export const COBOT_SERIES: CobotYear[] = [
  { year: 2020, units: 30_000, sharePct: null, confidence: "estimated" },
  { year: 2021, units: 38_000, sharePct: null, confidence: "estimated" },
  { year: 2022, units: 48_000, sharePct: null, confidence: "estimated" },
  { year: 2023, units: 57_600, sharePct: 11, confidence: "estimated" },
  { year: 2024, units: 64_500, sharePct: 12, confidence: "disclosed" },
];

export type FlowVsStock = {
  year: number;
  installations: number;
  stockM: number;
  installYoyPct: number | null;
  stockYoyPct: number | null;
  confidence: Confidence;
  forecast?: boolean;
};

/** Flow plateau vs stock compounding — research printed levels; update prints deltas */
export const FLOW_VS_STOCK: FlowVsStock[] = [
  { year: 2021, installations: 517_385, stockM: 3.5, installYoyPct: 35, stockYoyPct: 13, confidence: "estimated" },
  { year: 2022, installations: 552_946, stockM: 3.9, installYoyPct: 7, stockYoyPct: 12, confidence: "estimated" },
  { year: 2023, installations: 541_302, stockM: 4.28, installYoyPct: -2, stockYoyPct: 10, confidence: "estimated" },
  { year: 2024, installations: 542_076, stockM: 4.664, installYoyPct: 0.1, stockYoyPct: 9, confidence: "disclosed" },
  { year: 2025, installations: 575_000, stockM: 5.05, installYoyPct: 6, stockYoyPct: 8, confidence: "estimated", forecast: true },
];

export type ChinaSupplier = {
  year: number;
  domesticPct: number;
  confidence: Confidence;
};

export const CHINA_SUPPLIER_SHARE: ChinaSupplier[] = [
  { year: 2014, domesticPct: 28, confidence: "estimated" },
  { year: 2020, domesticPct: 35, confidence: "estimated" },
  { year: 2022, domesticPct: 40, confidence: "estimated" },
  { year: 2023, domesticPct: 47, confidence: "disclosed" },
  { year: 2024, domesticPct: 57, confidence: "disclosed" },
];

export type DeltaBarRow = {
  id: string;
  label: string;
  group: "Markets" | "Regions" | "Structure";
  delta: number;
  priorValue: number;
  newValue: number;
  priorLabel: string;
  newLabel: string;
  unit: "pp" | "%" | "units";
  confidence: Confidence;
};

export const DELTA_BARS: DeltaBarRow[] = [
  {
    id: "uk-yoy",
    label: "UK installations YoY",
    group: "Markets",
    delta: -35,
    priorValue: 3800,
    newValue: 2500,
    priorLabel: "2023",
    newLabel: "2024",
    unit: "%",
    confidence: "disclosed",
  },
  {
    id: "fr-yoy",
    label: "France installations YoY",
    group: "Markets",
    delta: -24,
    priorValue: 6447,
    newValue: 4900,
    priorLabel: "2023e",
    newLabel: "2024",
    unit: "%",
    confidence: "estimated",
  },
  {
    id: "it-yoy",
    label: "Italy installations YoY",
    group: "Markets",
    delta: -16,
    priorValue: 10_456,
    newValue: 8783,
    priorLabel: "2023e",
    newLabel: "2024",
    unit: "%",
    confidence: "estimated",
  },
  {
    id: "ca-yoy",
    label: "Canada installations YoY",
    group: "Markets",
    delta: -12,
    priorValue: 4318,
    newValue: 3800,
    priorLabel: "2023e",
    newLabel: "2024",
    unit: "%",
    confidence: "estimated",
  },
  {
    id: "americas-yoy",
    label: "Americas region YoY",
    group: "Regions",
    delta: -10,
    priorValue: 55_641,
    newValue: 50_077,
    priorLabel: "2023",
    newLabel: "2024",
    unit: "%",
    confidence: "disclosed",
  },
  {
    id: "us-yoy",
    label: "US installations YoY",
    group: "Markets",
    delta: -9,
    priorValue: 37_587,
    newValue: 34_204,
    priorLabel: "2023e",
    newLabel: "2024",
    unit: "%",
    confidence: "estimated",
  },
  {
    id: "europe-yoy",
    label: "Europe region YoY",
    group: "Regions",
    delta: -8,
    priorValue: 92_393,
    newValue: 85_006,
    priorLabel: "2023",
    newLabel: "2024",
    unit: "%",
    confidence: "disclosed",
  },
  {
    id: "de-yoy",
    label: "Germany installations YoY",
    group: "Markets",
    delta: -5,
    priorValue: 28_402,
    newValue: 26_982,
    priorLabel: "2023e",
    newLabel: "2024",
    unit: "%",
    confidence: "estimated",
  },
  {
    id: "jp-yoy",
    label: "Japan installations YoY",
    group: "Markets",
    delta: -4,
    priorValue: 46_305,
    newValue: 44_453,
    priorLabel: "2023e",
    newLabel: "2024",
    unit: "%",
    confidence: "estimated",
  },
  {
    id: "asia-yoy",
    label: "Asia region YoY",
    group: "Regions",
    delta: 5,
    priorValue: 382_538,
    newValue: 401_665,
    priorLabel: "2023e",
    newLabel: "2024",
    unit: "%",
    confidence: "estimated",
  },
  {
    id: "cn-yoy",
    label: "China installations YoY",
    group: "Markets",
    delta: 7,
    priorValue: 275_743,
    newValue: 295_045,
    priorLabel: "2023e",
    newLabel: "2024",
    unit: "%",
    confidence: "estimated",
  },
  {
    id: "in-yoy",
    label: "India installations YoY",
    group: "Markets",
    delta: 7,
    priorValue: 8505,
    newValue: 9100,
    priorLabel: "2023e",
    newLabel: "2024",
    unit: "%",
    confidence: "estimated",
  },
  {
    id: "cobot-yoy",
    label: "Cobot installations YoY",
    group: "Structure",
    delta: 12,
    priorValue: 57_600,
    newValue: 64_500,
    priorLabel: "2023e",
    newLabel: "2024",
    unit: "%",
    confidence: "disclosed",
  },
  {
    id: "stock-yoy",
    label: "World operational stock YoY",
    group: "Structure",
    delta: 9,
    priorValue: 4.28,
    newValue: 4.664,
    priorLabel: "2023 (M)",
    newLabel: "2024 (M)",
    unit: "%",
    confidence: "disclosed",
  },
  {
    id: "cn-domestic",
    label: "China domestic supplier share",
    group: "Structure",
    delta: 29,
    priorValue: 28,
    newValue: 57,
    priorLabel: "2014 %",
    newLabel: "2024 %",
    unit: "pp",
    confidence: "disclosed",
  },
  {
    id: "general-ind",
    label: "General industry share (decade)",
    group: "Structure",
    delta: 17,
    priorValue: 36,
    newValue: 53,
    priorLabel: "2014 %",
    newLabel: "2024 %",
    unit: "pp",
    confidence: "disclosed",
  },
  {
    id: "auto-share",
    label: "Automotive share (decade)",
    group: "Structure",
    delta: -20,
    priorValue: 43,
    newValue: 23,
    priorLabel: "2014 %",
    newLabel: "2024 %",
    unit: "pp",
    confidence: "disclosed",
  },
];

export const SOURCES = [
  { label: "IFR World Robotics 2025 — global release", url: IFR_URL },
  { label: "IFR WR 2025 Executive Summary (PDF)", url: IFR_EXEC_URL },
  { label: "Prior research vintage", url: PRIOR_POST_PATH },
];

export function marketsFor(region: MarketYoy["region"] | "All"): MarketYoy[] {
  if (region === "All") return [...MARKET_YOY];
  return MARKET_YOY.filter((m) => m.region === region);
}

export function deltasFor(group: DeltaBarRow["group"] | "All"): DeltaBarRow[] {
  if (group === "All") return [...DELTA_BARS];
  return DELTA_BARS.filter((d) => d.group === group);
}

export function fmtUnits(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1)}k`;
  return n.toLocaleString("en-US");
}

export function fmtPct(n: number, d = 0): string {
  return `${n.toFixed(d)}%`;
}

export function fmtPp(n: number, d = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(d)} pp`;
}

export function fmtYoy(n: number, d = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(d)}%`;
}
