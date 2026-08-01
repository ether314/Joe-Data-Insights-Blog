/**
 * IRENA Renewable Capacity Statistics 2025 — 2024 additions & stocks.
 * Source: IRENA Renewable Capacity Highlights (26 Mar 2025) + press release.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "IRENA Renewable Capacity Highlights 2025 (26 Mar 2025) and IRENA press release “Record-Breaking Annual Growth in Renewable Power Capacity.” Stocks and 2024 net additions are disclosed. Hydropower stock excludes pure pumped storage (142 GW additional). China / Asia / Africa regional figures from the same highlights. COP28 tripling-path scenarios are IRENA’s published arithmetic, not our forecasts.";

export const SOURCES = [
  {
    label: "IRENA — Renewable Capacity Highlights 2025",
    url: "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Mar/IRENA_DAT_RE_Capacity_Highlights_2025.pdf",
  },
  {
    label: "IRENA press release — record renewable capacity growth",
    url: "https://www.irena.org/News/pressreleases/2025/Mar/Record-Breaking-Annual-Growth-in-Renewable-Power-Capacity",
  },
] as const;

export const HEADLINE = {
  stockGw: 4448,
  additionsGw: 585,
  growthPct: 15.1,
  solarAddGw: 452,
  solarShareOfAddsPct: 77.3,
  windAddGw: 113,
  solarWindSharePct: 96.6,
  renewShareOfAllExpansionPct: 92.5,
  priorRenewSharePct: 85.8,
  chinaAddGw: 373.6,
  chinaShareOfAddsPct: 63.9,
  asiaAddGw: 421.5,
  asiaShareOfAddsPct: 72.0,
  africaAddGw: 4.2,
  africaShareOfAddsPct: 0.7,
  stockRenewSharePct: 46.4,
  priorStockRenewSharePct: 43.1,
  tripleTargetTw: 11.174,
  path2024RateTw: 10.4,
  shortfallTw: 0.8,
} as const;

export type TechAdd = {
  tech: string;
  short: string;
  addGw: number;
  stockGw: number;
  growthPct: number;
  confidence: Confidence;
};

export const TECH_2024: TechAdd[] = (
  [
    { tech: "Solar", short: "Solar", addGw: 452, stockGw: 1865, growthPct: 32.2, confidence: "disclosed" },
    { tech: "Wind", short: "Wind", addGw: 113, stockGw: 1133, growthPct: 11.1, confidence: "disclosed" },
    { tech: "Hydropower (excl. pure pumped)", short: "Hydro", addGw: 15.0, stockGw: 1283, growthPct: 1.2, confidence: "disclosed" },
    { tech: "Bioenergy", short: "Bio", addGw: 4.6, stockGw: 151, growthPct: 3.2, confidence: "disclosed" },
    { tech: "Geothermal", short: "Geo", addGw: 0.4, stockGw: 15, growthPct: 2.5, confidence: "disclosed" },
    { tech: "Marine", short: "Marine", addGw: 0, stockGw: 0.5, growthPct: 0, confidence: "disclosed" },
  ] as TechAdd[]
).sort((a, b) => b.addGw - a.addGw);

export type RegionRow = {
  region: string;
  short: string;
  stockGw: number;
  sharePct: number;
  addGw: number;
  growthPct: number;
  confidence: Confidence;
};

export const REGIONS_2024: RegionRow[] = (
  [
    { region: "Asia", short: "Asia", stockGw: 2382, sharePct: 53.6, addGw: 421.5, growthPct: 21.5, confidence: "disclosed" },
    { region: "Europe", short: "Europe", stockGw: 849, sharePct: 19.1, addGw: 70.1, growthPct: 9.0, confidence: "disclosed" },
    { region: "North America", short: "N. America", stockGw: 573, sharePct: 12.9, addGw: 45.9, growthPct: 8.7, confidence: "disclosed" },
    { region: "South America", short: "S. America", stockGw: 313, sharePct: 7.0, addGw: 22.5, growthPct: 7.8, confidence: "disclosed" },
    { region: "Eurasia", short: "Eurasia", stockGw: 131, sharePct: 2.9, addGw: 8.3, growthPct: 6.8, confidence: "disclosed" },
    { region: "Oceania", short: "Oceania", stockGw: 74, sharePct: 1.7, addGw: 8.7, growthPct: 13.3, confidence: "disclosed" },
    { region: "Africa", short: "Africa", stockGw: 67, sharePct: 1.5, addGw: 4.2, growthPct: 6.7, confidence: "disclosed" },
    { region: "Middle East", short: "Mid. East", stockGw: 40, sharePct: 0.9, addGw: 3.3, growthPct: 9.0, confidence: "disclosed" },
    { region: "Central America & Caribbean", short: "C. Am./Carib.", stockGw: 19, sharePct: 0.4, addGw: 0.6, growthPct: 3.2, confidence: "disclosed" },
  ] as RegionRow[]
).sort((a, b) => b.addGw - a.addGw);

export const SOLAR_LEADERS = (
  [
    { country: "China", addGw: 278.0, confidence: "disclosed" as Confidence },
    { country: "United States", addGw: 38.3, confidence: "disclosed" as Confidence },
    { country: "India", addGw: 24.5, confidence: "disclosed" as Confidence },
    { country: "Brazil", addGw: 15.2, confidence: "disclosed" as Confidence },
    { country: "Germany", addGw: 15.1, confidence: "disclosed" as Confidence },
    { country: "South Korea", addGw: 3.1, confidence: "disclosed" as Confidence },
  ]
).sort((a, b) => b.addGw - a.addGw);

export const BLOC_ADDS = [
  { label: "China (Asia detail)", addGw: 373.6, shareOfGlobalAddsPct: 63.9 },
  { label: "Rest of Asia", addGw: 47.9, shareOfGlobalAddsPct: 8.2 },
  { label: "Europe", addGw: 70.1, shareOfGlobalAddsPct: 12.0 },
  { label: "North America", addGw: 45.9, shareOfGlobalAddsPct: 7.8 },
  { label: "Rest of world", addGw: 47.5, shareOfGlobalAddsPct: 8.1 },
].sort((a, b) => b.addGw - a.addGw);

/** Stock composition shares for end-2024 (disclosed %). */
export const STOCK_SHARES = [
  { tech: "Solar", pct: 42, gw: 1865 },
  { tech: "Hydropower", pct: 29, gw: 1283 },
  { tech: "Wind", pct: 25, gw: 1133 },
  { tech: "Other renewables", pct: 4, gw: 167 },
].sort((a, b) => b.pct - a.pct);

/** Renewable share of total power capacity expansion — disclosed endpoints + estimated mid path. */
export const RENEW_SHARE_PATH = [
  { year: 2018, renewSharePct: 65, confidence: "estimated" as Confidence },
  { year: 2020, renewSharePct: 72, confidence: "estimated" as Confidence },
  { year: 2022, renewSharePct: 80, confidence: "estimated" as Confidence },
  { year: 2023, renewSharePct: 85.8, confidence: "disclosed" as Confidence },
  { year: 2024, renewSharePct: 92.5, confidence: "disclosed" as Confidence },
];

export const TRIPLE_PATHS = [
  { label: "COP28 target 2030", tw: 11.17 },
  { label: "If 2024 growth persists", tw: 10.4 },
  { label: "If 2018–23 CAGR persists", tw: 8.0 },
  { label: "End-2024 stock", tw: 4.45 },
].sort((a, b) => b.tw - a.tw);

export function fmtGw(n: number, digits = 0): string {
  if (n >= 100 && digits === 0) return `${Math.round(n)} GW`;
  return `${n.toFixed(digits)} GW`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtTw(n: number): string {
  return `${n.toFixed(n >= 10 ? 1 : 2)} TW`;
}
