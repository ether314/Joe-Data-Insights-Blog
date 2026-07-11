/**
 * Global electricity generation mix by country (2024).
 *
 * Source: Our World in Data — Energy mix (Ember & Energy Institute).
 *   https://ourworldindata.org/grapher/electricity-prod-source-stacked
 *   Raw extract: tmp-owid.csv (OWID energy dataset, downloaded July 2026).
 *
 * Methodology:
 * - Rows filtered to sovereign countries and "World" aggregate for year 2024.
 * - `generationTwh` = total electricity generation in terawatt-hours.
 * - Share columns (`*SharePct`) = percent of national generation by source (0–100).
 *   OWID reports coal, gas, oil, hydro, nuclear, solar, wind individually;
 *   `renewablesSharePct` is OWID's renewables aggregate (includes hydro + solar + wind + biofuels).
 *   `fossilSharePct` and `lowCarbonSharePct` are OWID's pre-computed totals.
 * - Values rounded to three decimal places where OWID provided more precision.
 * - Regions assigned for dashboard grouping (not in source CSV).
 */

export type Region =
  | "North America"
  | "Europe"
  | "Asia-Pacific"
  | "Middle East"
  | "Latin America"
  | "Africa"
  | "Global";

export type ElectricityMixRecord = {
  country: string;
  isoCode: string;
  year: number;
  region: Region;
  generationTwh: number;
  coalSharePct: number;
  gasSharePct: number;
  oilSharePct: number;
  hydroSharePct: number;
  nuclearSharePct: number;
  solarSharePct: number;
  windSharePct: number;
  renewablesSharePct: number;
  fossilSharePct: number;
  lowCarbonSharePct: number;
};

export const DATA_YEAR = 2024;

export const SOURCE_NOTE =
  "Our World in Data (Ember & Energy Institute), 2024 country-level electricity generation shares.";

/** Palette for stacked-bar / donut charts — fossil warm, low-carbon cool */
export const MIX_COLORS = {
  coal: "#374151",
  gas: "#f59e0b",
  oil: "#92400e",
  hydro: "#0284c7",
  nuclear: "#7c3aed",
  solar: "#facc15",
  wind: "#22c55e",
  otherRenewables: "#86efac",
} as const;

export const MIX_SOURCE_ORDER = [
  "coal",
  "gas",
  "oil",
  "hydro",
  "nuclear",
  "solar",
  "wind",
] as const;

export type MixSource = (typeof MIX_SOURCE_ORDER)[number];

export function fmtTwh(twh: number): string {
  if (twh >= 1000) return `${(twh / 1000).toFixed(2)} PWh`;
  return `${twh.toFixed(1)} TWh`;
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export const ELECTRICITY_MIX: ElectricityMixRecord[] = [
  // ── Global benchmark ──
  {
    country: "World",
    isoCode: "WLD",
    year: 2024,
    region: "Global",
    generationTwh: 30853.34,
    coalSharePct: 34.315,
    gasSharePct: 22.027,
    oilSharePct: 2.779,
    hydroSharePct: 14.322,
    nuclearSharePct: 8.961,
    solarSharePct: 6.906,
    windSharePct: 8.094,
    renewablesSharePct: 31.918,
    fossilSharePct: 59.121,
    lowCarbonSharePct: 40.879,
  },

  // ── North America ──
  {
    country: "United States",
    isoCode: "USA",
    year: 2024,
    region: "North America",
    generationTwh: 4387.26,
    coalSharePct: 14.879,
    gasSharePct: 42.506,
    oilSharePct: 0.691,
    hydroSharePct: 5.387,
    nuclearSharePct: 17.824,
    solarSharePct: 6.91,
    windSharePct: 10.336,
    renewablesSharePct: 24.1,
    fossilSharePct: 58.076,
    lowCarbonSharePct: 41.924,
  },
  {
    country: "Canada",
    isoCode: "CAN",
    year: 2024,
    region: "North America",
    generationTwh: 627.18,
    coalSharePct: 4.165,
    gasSharePct: 15.708,
    oilSharePct: 0.856,
    hydroSharePct: 55.284,
    nuclearSharePct: 13.741,
    solarSharePct: 1.309,
    windSharePct: 7.194,
    renewablesSharePct: 65.53,
    fossilSharePct: 20.729,
    lowCarbonSharePct: 79.271,
  },
  {
    country: "Mexico",
    isoCode: "MEX",
    year: 2024,
    region: "North America",
    generationTwh: 361.28,
    coalSharePct: 5.968,
    gasSharePct: 60.82,
    oilSharePct: 7.886,
    hydroSharePct: 6.53,
    nuclearSharePct: 3.413,
    solarSharePct: 7.626,
    windSharePct: 5.796,
    renewablesSharePct: 21.914,
    fossilSharePct: 74.673,
    lowCarbonSharePct: 25.327,
  },

  // ── Europe ──
  {
    country: "Germany",
    isoCode: "DEU",
    year: 2024,
    region: "Europe",
    generationTwh: 476.87,
    coalSharePct: 21.882,
    gasSharePct: 16.598,
    oilSharePct: 4.074,
    hydroSharePct: 4.909,
    nuclearSharePct: 0,
    solarSharePct: 14.887,
    windSharePct: 27.982,
    renewablesSharePct: 57.445,
    fossilSharePct: 42.555,
    lowCarbonSharePct: 57.445,
  },
  {
    country: "France",
    isoCode: "FRA",
    year: 2024,
    region: "Europe",
    generationTwh: 557.73,
    coalSharePct: 0.307,
    gasSharePct: 3.425,
    oilSharePct: 2.022,
    hydroSharePct: 12.424,
    nuclearSharePct: 68.002,
    solarSharePct: 4.226,
    windSharePct: 7.744,
    renewablesSharePct: 26.244,
    fossilSharePct: 5.754,
    lowCarbonSharePct: 94.246,
  },
  {
    country: "United Kingdom",
    isoCode: "GBR",
    year: 2024,
    region: "Europe",
    generationTwh: 281.33,
    coalSharePct: 0.818,
    gasSharePct: 29.915,
    oilSharePct: 3.281,
    hydroSharePct: 1.962,
    nuclearSharePct: 14.51,
    solarSharePct: 5.531,
    windSharePct: 29.965,
    renewablesSharePct: 51.477,
    fossilSharePct: 34.013,
    lowCarbonSharePct: 65.987,
  },
  {
    country: "Poland",
    isoCode: "POL",
    year: 2024,
    region: "Europe",
    generationTwh: 170.2,
    coalSharePct: 53.502,
    gasSharePct: 12.056,
    oilSharePct: 4.595,
    hydroSharePct: 1.375,
    nuclearSharePct: 0,
    solarSharePct: 8.948,
    windSharePct: 14.595,
    renewablesSharePct: 29.847,
    fossilSharePct: 70.153,
    lowCarbonSharePct: 29.847,
  },
  {
    country: "Norway",
    isoCode: "NOR",
    year: 2024,
    region: "Europe",
    generationTwh: 156.12,
    coalSharePct: 0.019,
    gasSharePct: 1.089,
    oilSharePct: 0.5,
    hydroSharePct: 88.714,
    nuclearSharePct: 0,
    solarSharePct: 0.231,
    windSharePct: 9.288,
    renewablesSharePct: 98.392,
    fossilSharePct: 1.608,
    lowCarbonSharePct: 98.392,
  },
  {
    country: "Sweden",
    isoCode: "SWE",
    year: 2024,
    region: "Europe",
    generationTwh: 172.79,
    coalSharePct: 0,
    gasSharePct: 0.093,
    oilSharePct: 1.256,
    hydroSharePct: 37.682,
    nuclearSharePct: 29.197,
    solarSharePct: 2.112,
    windSharePct: 23.636,
    renewablesSharePct: 69.454,
    fossilSharePct: 1.348,
    lowCarbonSharePct: 98.652,
  },
  {
    country: "Russia",
    isoCode: "RUS",
    year: 2024,
    region: "Europe",
    generationTwh: 1211.32,
    coalSharePct: 18.591,
    gasSharePct: 44.43,
    oilSharePct: 1.042,
    hydroSharePct: 17.365,
    nuclearSharePct: 17.808,
    solarSharePct: 0.234,
    windSharePct: 0.458,
    renewablesSharePct: 18.129,
    fossilSharePct: 64.063,
    lowCarbonSharePct: 35.937,
  },

  // ── Asia-Pacific ──
  {
    country: "China",
    isoCode: "CHN",
    year: 2024,
    region: "Asia-Pacific",
    generationTwh: 10072.6,
    coalSharePct: 58.176,
    gasSharePct: 3.007,
    oilSharePct: 0.757,
    hydroSharePct: 13.447,
    nuclearSharePct: 4.42,
    solarSharePct: 8.281,
    windSharePct: 9.845,
    renewablesSharePct: 33.64,
    fossilSharePct: 61.94,
    lowCarbonSharePct: 38.06,
  },
  {
    country: "India",
    isoCode: "IND",
    year: 2024,
    region: "Asia-Pacific",
    generationTwh: 2057.54,
    coalSharePct: 74.559,
    gasSharePct: 2.776,
    oilSharePct: 0.205,
    hydroSharePct: 7.592,
    nuclearSharePct: 2.659,
    solarSharePct: 6.503,
    windSharePct: 3.964,
    renewablesSharePct: 19.801,
    fossilSharePct: 77.54,
    lowCarbonSharePct: 22.46,
  },
  {
    country: "Japan",
    isoCode: "JPN",
    year: 2024,
    region: "Asia-Pacific",
    generationTwh: 1022.3,
    coalSharePct: 31.87,
    gasSharePct: 33.903,
    oilSharePct: 2.726,
    hydroSharePct: 7.632,
    nuclearSharePct: 8.306,
    solarSharePct: 9.979,
    windSharePct: 1.036,
    renewablesSharePct: 23.195,
    fossilSharePct: 68.499,
    lowCarbonSharePct: 31.501,
  },
  {
    country: "South Korea",
    isoCode: "KOR",
    year: 2024,
    region: "Asia-Pacific",
    generationTwh: 622.03,
    coalSharePct: 30.122,
    gasSharePct: 28.674,
    oilSharePct: 1.28,
    hydroSharePct: 0.693,
    nuclearSharePct: 30.343,
    solarSharePct: 5.262,
    windSharePct: 0.542,
    renewablesSharePct: 9.582,
    fossilSharePct: 60.076,
    lowCarbonSharePct: 39.924,
  },
  {
    country: "Indonesia",
    isoCode: "IDN",
    year: 2024,
    region: "Asia-Pacific",
    generationTwh: 375.111,
    coalSharePct: 60.898,
    gasSharePct: 17.631,
    oilSharePct: 1.898,
    hydroSharePct: 7.061,
    nuclearSharePct: 0,
    solarSharePct: 0.247,
    windSharePct: 0.129,
    renewablesSharePct: 19.287,
    fossilSharePct: 80.427,
    lowCarbonSharePct: 19.287,
  },
  {
    country: "Australia",
    isoCode: "AUS",
    year: 2024,
    region: "Asia-Pacific",
    generationTwh: 279.9,
    coalSharePct: 45.506,
    gasSharePct: 16.995,
    oilSharePct: 2.011,
    hydroSharePct: 4.834,
    nuclearSharePct: 0,
    solarSharePct: 17.806,
    windSharePct: 11.686,
    renewablesSharePct: 35.488,
    fossilSharePct: 64.512,
    lowCarbonSharePct: 35.488,
  },
  {
    country: "Vietnam",
    isoCode: "VNM",
    year: 2024,
    region: "Asia-Pacific",
    generationTwh: 306.33,
    coalSharePct: 48.755,
    gasSharePct: 7.061,
    oilSharePct: 0.036,
    hydroSharePct: 31.287,
    nuclearSharePct: 0,
    solarSharePct: 8.494,
    windSharePct: 4.09,
    renewablesSharePct: 44.148,
    fossilSharePct: 55.852,
    lowCarbonSharePct: 44.148,
  },

  // ── Latin America ──
  {
    country: "Brazil",
    isoCode: "BRA",
    year: 2024,
    region: "Latin America",
    generationTwh: 745.26,
    coalSharePct: 2.1,
    gasSharePct: 6.411,
    oilSharePct: 1.656,
    hydroSharePct: 55.664,
    nuclearSharePct: 2.112,
    solarSharePct: 10.021,
    windSharePct: 14.466,
    renewablesSharePct: 87.721,
    fossilSharePct: 10.167,
    lowCarbonSharePct: 89.833,
  },

  // ── Middle East ──
  {
    country: "Saudi Arabia",
    isoCode: "SAU",
    year: 2024,
    region: "Middle East",
    generationTwh: 454.644,
    coalSharePct: 0,
    gasSharePct: 63.341,
    oilSharePct: 34.498,
    hydroSharePct: 0,
    nuclearSharePct: 0,
    solarSharePct: 1.81,
    windSharePct: 0.35,
    renewablesSharePct: 2.16,
    fossilSharePct: 97.84,
    lowCarbonSharePct: 2.16,
  },

  // ── Africa ──
  {
    country: "South Africa",
    isoCode: "ZAF",
    year: 2024,
    region: "Africa",
    generationTwh: 244.81,
    coalSharePct: 82.096,
    gasSharePct: 0,
    oilSharePct: 1.217,
    hydroSharePct: 0.315,
    nuclearSharePct: 3.497,
    solarSharePct: 8.174,
    windSharePct: 4.534,
    renewablesSharePct: 13.19,
    fossilSharePct: 83.314,
    lowCarbonSharePct: 16.686,
  },
];

export const REGIONS: Region[] = [
  "Global",
  "North America",
  "Europe",
  "Asia-Pacific",
  "Latin America",
  "Middle East",
  "Africa",
];

export function recordsByRegion(region: Region): ElectricityMixRecord[] {
  return ELECTRICITY_MIX.filter((r) => r.region === region);
}

export function recordByIso(isoCode: string): ElectricityMixRecord | undefined {
  return ELECTRICITY_MIX.find((r) => r.isoCode === isoCode);
}

/** Total global generation (TWh) — from World aggregate row */
export const WORLD_GENERATION_TWH =
  ELECTRICITY_MIX.find((r) => r.isoCode === "WLD")?.generationTwh ?? 0;
