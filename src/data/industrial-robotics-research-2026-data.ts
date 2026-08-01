/**
 * IFR World Robotics 2025 — industrial robot installations, stock, industry mix, forecast.
 * Angle: where physical factory automation is scaling (flow + region + industry), not density stock alone.
 */

export const SOURCE_NOTE =
  "Annual installations, operational stock, industry mix, and 2025–2028 forecast from International Federation of Robotics (IFR) World Robotics 2025 (released 25 Sep 2025). Country and region figures are IFR-disclosed unless marked estimated. Forecast years after 2025 interpolate IFR’s path to surpass 700,000 units by 2028 (~10% average growth narrative).";

export const IFR_URL =
  "https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years";
export const IFR_EXEC_URL =
  "https://ifr.org/img/worldrobotics/Executive_Summary_WR_2025_Industrial_Robots.pdf";
export const IFR_CHINA_URL =
  "https://ifr.org/downloads/press_docs/2025-09-25-IFR_press_release_China_in_English.pdf";

export type Confidence = "disclosed" | "estimated";

export type GlobalInstall = {
  year: number;
  units: number;
  confidence: Confidence;
  forecast?: boolean;
};

/** Global annual installations — IFR WR series + WR 2025 forecast */
export const GLOBAL_INSTALLATIONS: GlobalInstall[] = [
  { year: 2018, units: 422_271, confidence: "disclosed" },
  { year: 2019, units: 373_000, confidence: "estimated" },
  { year: 2020, units: 383_545, confidence: "disclosed" },
  { year: 2021, units: 517_385, confidence: "disclosed" },
  { year: 2022, units: 552_946, confidence: "disclosed" },
  { year: 2023, units: 541_302, confidence: "disclosed" },
  { year: 2024, units: 542_076, confidence: "disclosed" },
  { year: 2025, units: 575_000, confidence: "disclosed", forecast: true },
  { year: 2026, units: 620_000, confidence: "estimated", forecast: true },
  { year: 2027, units: 660_000, confidence: "estimated", forecast: true },
  { year: 2028, units: 710_000, confidence: "estimated", forecast: true },
];

export type RegionInstall = {
  year: number;
  asia: number;
  europe: number;
  americas: number;
  confidence: Confidence;
  forecast?: boolean;
};

/** Regional annual installations — 2024 disclosed; earlier years IFR/press rounded; 2025 Asia disclosed ~435k */
export const REGION_SERIES: RegionInstall[] = [
  {
    year: 2021,
    asia: 380_911,
    europe: 84_000,
    americas: 52_000,
    confidence: "estimated",
  },
  {
    year: 2022,
    asia: 404_000,
    europe: 84_000,
    americas: 56_000,
    confidence: "estimated",
  },
  {
    year: 2023,
    asia: 382_000,
    europe: 92_393,
    americas: 55_389,
    confidence: "estimated",
  },
  {
    year: 2024,
    asia: 401_665,
    europe: 85_006,
    americas: 50_077,
    confidence: "disclosed",
  },
  {
    year: 2025,
    asia: 435_000,
    europe: 88_000,
    americas: 52_000,
    confidence: "estimated",
    forecast: true,
  },
];

export type MarketInstall = {
  market: string;
  shortLabel: string;
  iso: string;
  region: "Asia" | "Europe" | "Americas";
  units2024: number;
  yoyPct: number | null;
  stock2024: number | null;
  density2024: number | null;
  confidence: Confidence;
};

/** Top markets 2024 — IFR WR 2025 */
export const MARKETS_2024: MarketInstall[] = [
  {
    market: "China",
    shortLabel: "China",
    iso: "CN",
    region: "Asia",
    units2024: 295_000,
    yoyPct: 7,
    stock2024: 2_027_000,
    density2024: 567,
    confidence: "disclosed",
  },
  {
    market: "Japan",
    shortLabel: "Japan",
    iso: "JP",
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
    iso: "US",
    region: "Americas",
    units2024: 34_200,
    yoyPct: -9,
    stock2024: 391_757,
    density2024: null,
    confidence: "disclosed",
  },
  {
    market: "Korea, Republic of",
    shortLabel: "South Korea",
    iso: "KR",
    region: "Asia",
    units2024: 30_596,
    yoyPct: -3,
    stock2024: 391_757,
    density2024: 1220,
    confidence: "disclosed",
  },
  {
    market: "Germany",
    shortLabel: "Germany",
    iso: "DE",
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
    iso: "IN",
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
    iso: "IT",
    region: "Europe",
    units2024: 8_783,
    yoyPct: -16,
    stock2024: null,
    density2024: null,
    confidence: "disclosed",
  },
  {
    market: "Spain",
    shortLabel: "Spain",
    iso: "ES",
    region: "Europe",
    units2024: 5_100,
    yoyPct: null,
    stock2024: null,
    density2024: null,
    confidence: "disclosed",
  },
  {
    market: "France",
    shortLabel: "France",
    iso: "FR",
    region: "Europe",
    units2024: 4_900,
    yoyPct: -24,
    stock2024: null,
    density2024: null,
    confidence: "disclosed",
  },
  {
    market: "Mexico",
    shortLabel: "Mexico",
    iso: "MX",
    region: "Americas",
    units2024: 5_800,
    yoyPct: null,
    stock2024: null,
    density2024: null,
    confidence: "estimated",
  },
];

export type IndustryInstall = {
  industry: string;
  shortLabel: string;
  units2024: number;
  sharePct: number;
  yoyPct: number | null;
  confidence: Confidence;
};

export const INDUSTRIES_2024: IndustryInstall[] = [
  {
    industry: "Electrical / electronics",
    shortLabel: "Electronics",
    units2024: 128_899,
    sharePct: 24,
    yoyPct: 2.5,
    confidence: "disclosed",
  },
  {
    industry: "Automotive",
    shortLabel: "Automotive",
    units2024: 126_088,
    sharePct: 23,
    yoyPct: -6.9,
    confidence: "disclosed",
  },
  {
    industry: "Metal & machinery",
    shortLabel: "Metal/mach.",
    units2024: Math.round(542_076 * 0.16),
    sharePct: 16,
    yoyPct: null,
    confidence: "disclosed",
  },
  {
    industry: "Plastic & chemical products",
    shortLabel: "Plastic/chem.",
    units2024: Math.round(542_076 * 0.05),
    sharePct: 5,
    yoyPct: null,
    confidence: "disclosed",
  },
  {
    industry: "Food & beverage",
    shortLabel: "Food/bev.",
    units2024: Math.round(542_076 * 0.04),
    sharePct: 4,
    yoyPct: null,
    confidence: "disclosed",
  },
  {
    industry: "Other / unspecified",
    shortLabel: "Other/unspec.",
    units2024: Math.round(542_076 * 0.14),
    sharePct: 14,
    yoyPct: null,
    confidence: "disclosed",
  },
];

/** Electronics vs automotive share switch — IFR narrative + WR 2025 */
export const INDUSTRY_DUEL = [
  { year: 2020, electronicsSharePct: 26, automotiveSharePct: 23, confidence: "estimated" as Confidence },
  { year: 2021, electronicsSharePct: 26, automotiveSharePct: 23, confidence: "disclosed" as Confidence },
  { year: 2022, electronicsSharePct: 25, automotiveSharePct: 24, confidence: "estimated" as Confidence },
  { year: 2023, electronicsSharePct: 23, automotiveSharePct: 25, confidence: "estimated" as Confidence },
  { year: 2024, electronicsSharePct: 24, automotiveSharePct: 23, confidence: "disclosed" as Confidence },
];

export const CHINA_SUPPLIER_SHARE = [
  { year: 2014, domesticPct: 28, confidence: "estimated" as Confidence },
  { year: 2020, domesticPct: 35, confidence: "estimated" as Confidence },
  { year: 2022, domesticPct: 40, confidence: "estimated" as Confidence },
  { year: 2023, domesticPct: 47, confidence: "disclosed" as Confidence },
  { year: 2024, domesticPct: 57, confidence: "disclosed" as Confidence },
];

export const CHINA_INDUSTRY_2024 = [
  { industry: "Electronics", units: 83_000, yoyPct: 7, globalSharePct: 64 },
  { industry: "Automotive", units: 57_200, yoyPct: -12, globalSharePct: 45 },
  { industry: "Metal products", units: 40_000, yoyPct: null, globalSharePct: null },
];

export const REGION_SUMMARY_2024 = [
  { region: "Asia", units: 401_665, sharePct: 74, yoyPct: null, color: "#f59e0b" },
  { region: "Europe", units: 85_006, sharePct: 16, yoyPct: -8, color: "#8b5cf6" },
  { region: "Americas", units: 50_077, sharePct: 9, yoyPct: -10, color: "#0ea5e9" },
];

export const WORLD_INSTALLATIONS_2024 = 542_076;
export const WORLD_STOCK_2024 = 4_663_773;
export const TOP5_UNITS_2024 = 431_240;
export const TOP5_SHARE_PCT = 80;

export const HEADLINE = {
  worldUnits2024: WORLD_INSTALLATIONS_2024,
  asiaSharePct: 74,
  chinaSharePct: 54,
  chinaUnits: 295_000,
  chinaStockM: 2.027,
  worldStockM: 4.664,
  electronicsUnits: 128_899,
  automotiveUnits: 126_088,
  forecast2025: 575_000,
  forecast2028: 710_000,
  chinaDomesticPct: 57,
  top5SharePct: TOP5_SHARE_PCT,
  decadeMultiple: 2,
};

export const SOURCES = [
  { label: "IFR World Robotics 2025 — global release", url: IFR_URL },
  { label: "IFR WR 2025 Executive Summary (PDF)", url: IFR_EXEC_URL },
  { label: "IFR China market release (PDF)", url: IFR_CHINA_URL },
];

export function marketShare(units: number): number {
  return (units / WORLD_INSTALLATIONS_2024) * 100;
}

export function fmtUnits(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1)}k`;
  return n.toLocaleString("en-US");
}

export function fmtPct(n: number, d = 0): string {
  return `${n.toFixed(d)}%`;
}

export function rankedMarkets(): MarketInstall[] {
  return [...MARKETS_2024].sort((a, b) => b.units2024 - a.units2024);
}

export function industriesRanked(): IndustryInstall[] {
  return [...INDUSTRIES_2024].sort((a, b) => b.units2024 - a.units2024);
}
