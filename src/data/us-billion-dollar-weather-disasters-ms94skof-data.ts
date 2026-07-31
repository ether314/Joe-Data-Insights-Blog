/**
 * US billion-dollar weather & climate disasters — NOAA NCEI / Climate.gov (CPI to 2024$).
 * Theme: adaptation-economics. Core question: is normalized disaster cost accelerating?
 */

export const SOURCE_NOTE =
  "NOAA NCEI Billion-Dollar Weather and Climate Disasters. Event costs CPI-adjusted to 2024 dollars (Climate.gov / NCEI January 2025 update). GDP shares divide disclosed NOAA costs by BEA nominal GDP midpoints — our normalization, not an NCEI field.";

export const NOAA_URL = "https://www.ncei.noaa.gov/access/billions/";
export const CLIMATE_GOV_URL =
  "https://www.climate.gov/news-features/blogs/beyond-data/2024-active-year-us-billion-dollar-weather-and-climate-disasters";
export const BEA_GDP_URL = "https://www.bea.gov/data/gdp/gross-domestic-product";

export type Confidence = "disclosed" | "estimated";

export type DecadeRow = {
  period: string;
  sort: number;
  events: number;
  eventsPerYear: number;
  costBn: number;
  costPerYearBn: number;
  deaths: number;
  gdpMidBn: number;
  costShareGdpPct: number;
  /** Indexed cost/year with 1980s = 100 */
  costIndex1980s: number;
  confidence: Confidence;
  gdpConfidence: Confidence;
};

/** NCEI US decade summary (CPI to 2024$) + BEA GDP midpoints */
export const DECADES: DecadeRow[] = [
  {
    period: "1980s",
    sort: 1985,
    events: 33,
    eventsPerYear: 3.3,
    costBn: 219.8,
    costPerYearBn: 22.0,
    deaths: 3017,
    gdpMidBn: 4346,
    costShareGdpPct: 0.51,
    costIndex1980s: 100,
    confidence: "disclosed",
    gdpConfidence: "estimated",
  },
  {
    period: "1990s",
    sort: 1995,
    events: 57,
    eventsPerYear: 5.7,
    costBn: 335.3,
    costPerYearBn: 33.5,
    deaths: 3075,
    gdpMidBn: 7640,
    costShareGdpPct: 0.44,
    costIndex1980s: 152,
    confidence: "disclosed",
    gdpConfidence: "estimated",
  },
  {
    period: "2000s",
    sort: 2005,
    events: 67,
    eventsPerYear: 6.7,
    costBn: 621.6,
    costPerYearBn: 62.2,
    deaths: 3102,
    gdpMidBn: 13094,
    costShareGdpPct: 0.48,
    costIndex1980s: 283,
    confidence: "disclosed",
    gdpConfidence: "estimated",
  },
  {
    period: "2010s",
    sort: 2015,
    events: 131,
    eventsPerYear: 13.1,
    costBn: 994.7,
    costPerYearBn: 99.5,
    deaths: 5227,
    gdpMidBn: 18238,
    costShareGdpPct: 0.55,
    costIndex1980s: 452,
    confidence: "disclosed",
    gdpConfidence: "estimated",
  },
  {
    period: "2020–24",
    sort: 2022,
    events: 115,
    eventsPerYear: 23.0,
    costBn: 746.7,
    costPerYearBn: 149.3,
    deaths: 2520,
    gdpMidBn: 25744,
    costShareGdpPct: 0.58,
    costIndex1980s: 679,
    confidence: "disclosed",
    gdpConfidence: "estimated",
  },
];

/** Waterfall steps: base → increments → current annual average */
export const COST_WATERFALL = [
  { step: "1980s base", type: "base" as const, value: 22.0, running: 22.0 },
  { step: "+1990s", type: "up" as const, value: 11.5, running: 33.5 },
  { step: "+2000s", type: "up" as const, value: 28.7, running: 62.2 },
  { step: "+2010s", type: "up" as const, value: 37.3, running: 99.5 },
  { step: "+2020–24", type: "up" as const, value: 49.8, running: 149.3 },
  { step: "Now", type: "total" as const, value: 149.3, running: 149.3 },
];

/** First differences in cost/year ($B) — acceleration signal */
export const COST_ACCELERATION = [
  { step: "1980s→90s", deltaCostPerYearBn: 11.5, deltaEventsPerYear: 2.4 },
  { step: "1990s→00s", deltaCostPerYearBn: 28.7, deltaEventsPerYear: 1.0 },
  { step: "2000s→10s", deltaCostPerYearBn: 37.3, deltaEventsPerYear: 6.4 },
  { step: "2010s→20–24", deltaCostPerYearBn: 49.8, deltaEventsPerYear: 9.9 },
];

export type AnnualRow = {
  year: number;
  events: number;
  costBn: number;
  gdpBn: number;
  costShareGdpPct: number;
  /** vs 45-yr avg $64.8B */
  vsLongRunMultiple: number;
  confidence: Confidence;
  gdpConfidence: Confidence;
};

/** Recent annual series (CPI 2024$) — Climate.gov / NCEI */
export const ANNUAL_RECENT: AnnualRow[] = [
  { year: 2014, events: 9, costBn: 45.6, gdpBn: 17527, costShareGdpPct: 0.26, vsLongRunMultiple: 0.7, confidence: "disclosed", gdpConfidence: "estimated" },
  { year: 2015, events: 10, costBn: 39.5, gdpBn: 18238, costShareGdpPct: 0.22, vsLongRunMultiple: 0.61, confidence: "disclosed", gdpConfidence: "estimated" },
  { year: 2016, events: 16, costBn: 72.3, gdpBn: 18745, costShareGdpPct: 0.39, vsLongRunMultiple: 1.12, confidence: "disclosed", gdpConfidence: "estimated" },
  { year: 2017, events: 22, costBn: 395.9, gdpBn: 19543, costShareGdpPct: 2.03, vsLongRunMultiple: 6.11, confidence: "disclosed", gdpConfidence: "estimated" },
  { year: 2018, events: 16, costBn: 67.4, gdpBn: 20656, costShareGdpPct: 0.33, vsLongRunMultiple: 1.04, confidence: "disclosed", gdpConfidence: "estimated" },
  { year: 2019, events: 14, costBn: 64.4, gdpBn: 21521, costShareGdpPct: 0.3, vsLongRunMultiple: 0.99, confidence: "disclosed", gdpConfidence: "estimated" },
  { year: 2020, events: 23, costBn: 113.8, gdpBn: 21323, costShareGdpPct: 0.53, vsLongRunMultiple: 1.76, confidence: "disclosed", gdpConfidence: "estimated" },
  { year: 2021, events: 20, costBn: 162.2, gdpBn: 23594, costShareGdpPct: 0.69, vsLongRunMultiple: 2.5, confidence: "disclosed", gdpConfidence: "estimated" },
  { year: 2022, events: 19, costBn: 183.6, gdpBn: 25744, costShareGdpPct: 0.71, vsLongRunMultiple: 2.83, confidence: "disclosed", gdpConfidence: "estimated" },
  { year: 2023, events: 28, costBn: 110.8, gdpBn: 27361, costShareGdpPct: 0.4, vsLongRunMultiple: 1.71, confidence: "disclosed", gdpConfidence: "estimated" },
  { year: 2024, events: 27, costBn: 182.7, gdpBn: 29200, costShareGdpPct: 0.63, vsLongRunMultiple: 2.82, confidence: "disclosed", gdpConfidence: "estimated" },
];

export const LONG_RUN_AVG_COST_BN = 64.8;
export const FIVE_YEAR_AVG_COST_BN = 149.3;

/** Cumulative hazard cost leaders 1980–2024 (CPI 2024$) */
export const HAZARD_COST_LEADERS = [
  { shortLabel: "Hurricanes", costBn: 1543.2, events: 67, avgCostBn: 23.0, sharePct: 52.9, deaths: 7211 },
  { shortLabel: "Severe storms", costBn: 514.3, events: 203, avgCostBn: 2.5, sharePct: 17.6, deaths: 2145 },
  { shortLabel: "Drought", costBn: 367.5, events: 32, avgCostBn: 11.5, sharePct: 12.6, deaths: 4658 },
  { shortLabel: "Flooding", costBn: 203.0, events: 45, avgCostBn: 4.5, sharePct: 7.0, deaths: 0 },
  { shortLabel: "Wildfire", costBn: 147.9, events: 23, avgCostBn: 6.4, sharePct: 5.1, deaths: 0 },
  { shortLabel: "Winter", costBn: 104.2, events: 24, avgCostBn: 4.3, sharePct: 3.6, deaths: 0 },
].sort((a, b) => b.costBn - a.costBn);

/** State cumulative cost leaders (Climate.gov narrative, ~CPI 2024$) */
export const STATE_COST_LEADERS = [
  { state: "Florida", costBn: 450, note: "Hurricane coast" },
  { state: "Texas", costBn: 436, note: "Most events + hurricanes" },
  { state: "Louisiana", costBn: 314, note: "Gulf surge corridor" },
].sort((a, b) => b.costBn - a.costBn);

export const TOP_EVENTS_2024 = [
  { name: "Hurricane Helene", category: "Tropical cyclone", costBn: 78.7, deaths: 219 },
  { name: "Hurricane Milton", category: "Tropical cyclone", costBn: 34.3, deaths: 32 },
  { name: "Hurricane Beryl", category: "Tropical cyclone", costBn: 7.2, deaths: 46 },
  { name: "May tornado outbreak", category: "Severe storm", costBn: 6.6, deaths: 3 },
];

export const COMPOSITION_2024 = [
  { category: "Severe storms", count: 17, fill: "#10b981" },
  { category: "Tropical cyclones", count: 5, fill: "#0ea5e9" },
  { category: "Winter storms", count: 2, fill: "#64748b" },
  { category: "Flooding", count: 1, fill: "#3b82f6" },
  { category: "Drought / heat", count: 1, fill: "#f59e0b" },
  { category: "Wildfire", count: 1, fill: "#ef4444" },
];

/** Per-capita 5-yr avg disaster cost (Climate.gov, 2024$) */
export const PER_CAPITA = [
  { period: "Early 2000s", costPerCapita: 150 },
  { period: "Late 2010s+", costPerCapita: 400 },
];

export const HEADLINE = {
  events2024: 27,
  cost2024Bn: 182.7,
  fiveYearEventsPerYear: 23.0,
  fiveYearCostPerYearBn: 149.3,
  threeYearCostPerYearBn: 153.9,
  fortyFiveYearEventsPerYear: 9.0,
  fortyFiveYearCostPerYearBn: 64.8,
  cumulativeEvents: 403,
  cumulativeCostTn: 2.915,
  consecutiveYearsOver10: 14,
  eventsPerYear1980s: 3.3,
  costPerYear1980sBn: 22.0,
  frequencyMultipleVs1980s: 7.0,
  costMultipleVs1980s: 6.8,
  gdpShare1980s: 0.51,
  gdpShare2020s: 0.58,
  lastDecadeEvents: 190,
  lastDecadeCostTn: 1.4,
  accelerationLatestDeltaBn: 49.8,
  costIndexNow: 679,
};

export const HAZARD_COLORS: Record<string, string> = {
  Hurricanes: "#0ea5e9",
  "Severe storms": "#10b981",
  Drought: "#f59e0b",
  Flooding: "#3b82f6",
  Wildfire: "#ef4444",
  Winter: "#64748b",
};

/** Dual-index series for normalization panel (1980s = 100 for cost; GDP share indexed to 1980s) */
export const NORMALIZATION_SERIES = DECADES.map((d) => ({
  period: d.period,
  cpiCostIndex: d.costIndex1980s,
  gdpShareIndex: Math.round((d.costShareGdpPct / 0.51) * 100),
  costPerYearBn: d.costPerYearBn,
  costShareGdpPct: d.costShareGdpPct,
}));

export function fmtBn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtTn(n: number): string {
  return `$${n.toFixed(2)}T`;
}

export function fmtPct(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}

export const SOURCES = [
  { label: "NOAA NCEI Billion-Dollar Disasters", url: NOAA_URL },
  { label: "NOAA Climate.gov — 2024 billion-dollar disasters", url: CLIMATE_GOV_URL },
  { label: "BEA — Gross Domestic Product", url: BEA_GDP_URL },
] as const;
