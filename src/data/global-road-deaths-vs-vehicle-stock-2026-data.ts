/**
 * Global road deaths vs vehicle stock (2026).
 *
 * Core question: Which countries combine rapid vehicle-stock growth with
 * still-high fatality rates, and where did rates fall as motorization rose?
 *
 * Perimeter: WHO Global Status Report on Road Safety 2023 (GSRRS) — 2021
 * mortality estimates and reported registered-vehicle stocks from country
 * profiles. Deaths-per-100k-vehicles are desk ratios of WHO rate ÷ vehicle
 * rate. Fleet-growth and rate-change fields use WHO regional disclosed
 * aggregates where available; country-level path deltas are estimated from
 * GSRRS decade narrative + IRF/OICA stock growth bands and flagged.
 *
 * Headline: Global deaths per 100k vehicles fell 41% (79 → 47) from 2010–2021
 * while the fleet more than doubled — yet Kenya and Nigeria still exceed
 * 240 deaths per 100k vehicles at low motorization.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export type IncomeGroup = "low" | "lower-middle" | "upper-middle" | "high";

export type WhoRegion =
  | "Africa"
  | "Americas"
  | "Eastern Mediterranean"
  | "Europe"
  | "South-East Asia"
  | "Western Pacific";

/** Archetype from motorization × population fatality rate */
export type SafetyArchetype =
  | "safe-motorized"
  | "unsafe-motorized"
  | "unsafe-low-fleet"
  | "transitioning"
  | "outlier-high-rate";

export const SOURCE_NOTE =
  "WHO Global Status Report on Road Safety 2023 (ISBN 978-92-4-008651-7) and country/territory profiles: 2021 WHO-estimated road traffic fatality rates per 100 000 population and reported total registered vehicles (rate per 100 000 population). Global fleet and deaths-per-100 000-vehicles path (79 → 47, −41%) from GSRRS main report. Desk ratios = (deaths per 100k pop) ÷ (vehicles per 100k pop) × 100 000. Country fleet-growth % and rate-change % marked estimated/carried are not WHO point estimates — they synthesize GSRRS decade direction with IRF/OICA stock bands.";

export const SOURCES = [
  {
    label: "WHO — Global status report on road safety 2023",
    url: "https://www.who.int/publications/i/item/9789240086517",
  },
  {
    label: "WHO — GSRRS 2023 country and territory profiles",
    url: "https://www.who.int/publications/i/item/9789240087712",
  },
  {
    label: "WHO IRIS — GSRRS 2023 full report PDF",
    url: "https://iris.who.int/handle/10665/375016",
  },
] as const;

export const HEADLINE = {
  /** Global deaths per 100 000 vehicles, 2021 (WHO) */
  globalDeathsPer100kVehicles2021: 47,
  /** Same metric, 2010 (WHO) */
  globalDeathsPer100kVehicles2010: 79,
  /** Percent fall in deaths per 100k vehicles, 2010–2021 */
  globalDeathsPer100kVehiclesDropPct: 41,
  /** Global deaths per 100 000 population, 2021 */
  globalDeathsPer100kPop2021: 15,
  /** Absolute deaths (millions), 2021 */
  globalDeathsMillions2021: 1.19,
  /** Percent change in absolute deaths since 2010 */
  globalDeathsChangePct2010: -5,
  /** Reported global motor-vehicle fleet increase since 2010 (%) */
  globalFleetGrowthPctSince2010: 160,
  /** Kenya deaths per 100k vehicles (desk ratio on WHO 2021 profile) */
  kenyaDeathsPer100kVehicles: 353.8,
  /** Nigeria deaths per 100k vehicles */
  nigeriaDeathsPer100kVehicles: 241.7,
  /** Sweden deaths per 100k vehicles */
  swedenDeathsPer100kVehicles: 3.3,
  confidence: "disclosed" as Confidence,
};

export type CountryRow = {
  iso3: string;
  country: string;
  region: WhoRegion;
  income: IncomeGroup;
  /** WHO estimated deaths per 100 000 population, 2021 */
  deathsPer100kPop: number;
  /** WHO estimated absolute deaths, 2021 */
  deathsAbs: number;
  /** Registered vehicles per 1 000 population (from WHO per-100k ÷ 100) */
  vehiclesPer1000: number;
  /** Desk: deaths per 100 000 registered vehicles */
  deathsPer100kVehicles: number;
  /** Approximate stock growth 2010→2021 (%) */
  fleetGrowthPct: number;
  /** Approximate change in deaths/100k pop 2010→2021 (%) */
  rateChangePct: number;
  /** Share of registered stock that is powered 2/3-wheelers (%); −1 if unknown */
  twoThreeWheelerSharePct: number;
  archetype: SafetyArchetype;
  confidence: Confidence;
  fleetGrowthConfidence: Confidence;
};

/**
 * Country panel — rates and vehicle stocks from WHO GSRRS 2023 profiles.
 * deathsPer100kVehicles is a desk ratio. Fleet growth / rate change flagged.
 */
export const COUNTRY_PANEL: CountryRow[] = [
  {
    iso3: "KEN",
    country: "Kenya",
    region: "Africa",
    income: "lower-middle",
    deathsPer100kPop: 28.2,
    deathsAbs: 14926,
    vehiclesPer1000: 79.7,
    deathsPer100kVehicles: 353.8,
    fleetGrowthPct: 95,
    rateChangePct: 8,
    twoThreeWheelerSharePct: 7,
    archetype: "unsafe-low-fleet",
    confidence: "disclosed",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "NGA",
    country: "Nigeria",
    region: "Africa",
    income: "lower-middle",
    deathsPer100kPop: 17.2,
    deathsAbs: 36722,
    vehiclesPer1000: 71.2,
    deathsPer100kVehicles: 241.7,
    fleetGrowthPct: 110,
    rateChangePct: 5,
    twoThreeWheelerSharePct: -1,
    archetype: "unsafe-low-fleet",
    confidence: "disclosed",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "ZAF",
    country: "South Africa",
    region: "Africa",
    income: "upper-middle",
    deathsPer100kPop: 22.2,
    deathsAbs: 12900,
    vehiclesPer1000: 180.0,
    deathsPer100kVehicles: 123.3,
    fleetGrowthPct: 45,
    rateChangePct: -6,
    twoThreeWheelerSharePct: 3,
    archetype: "unsafe-low-fleet",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "ETH",
    country: "Ethiopia",
    region: "Africa",
    income: "low",
    deathsPer100kPop: 17.7,
    deathsAbs: 21258,
    vehiclesPer1000: 12.0,
    deathsPer100kVehicles: 1475.0,
    fleetGrowthPct: 140,
    rateChangePct: 12,
    twoThreeWheelerSharePct: -1,
    archetype: "unsafe-low-fleet",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "THA",
    country: "Thailand",
    region: "South-East Asia",
    income: "upper-middle",
    deathsPer100kPop: 25.4,
    deathsAbs: 18218,
    vehiclesPer1000: 591.0,
    deathsPer100kVehicles: 43.0,
    fleetGrowthPct: 55,
    rateChangePct: -18,
    twoThreeWheelerSharePct: 52,
    archetype: "outlier-high-rate",
    confidence: "disclosed",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "VNM",
    country: "Viet Nam",
    region: "Western Pacific",
    income: "lower-middle",
    deathsPer100kPop: 17.7,
    deathsAbs: 17229,
    vehiclesPer1000: 773.1,
    deathsPer100kVehicles: 22.9,
    fleetGrowthPct: 120,
    rateChangePct: -22,
    twoThreeWheelerSharePct: 93,
    archetype: "transitioning",
    confidence: "disclosed",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "IND",
    country: "India",
    region: "South-East Asia",
    income: "lower-middle",
    deathsPer100kPop: 15.4,
    deathsAbs: 216618,
    vehiclesPer1000: 231.8,
    deathsPer100kVehicles: 66.4,
    fleetGrowthPct: 130,
    rateChangePct: -8,
    twoThreeWheelerSharePct: 74,
    archetype: "transitioning",
    confidence: "disclosed",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "IDN",
    country: "Indonesia",
    region: "South-East Asia",
    income: "lower-middle",
    deathsPer100kPop: 11.3,
    deathsAbs: 30400,
    vehiclesPer1000: 490.0,
    deathsPer100kVehicles: 23.1,
    fleetGrowthPct: 95,
    rateChangePct: -15,
    twoThreeWheelerSharePct: 85,
    archetype: "transitioning",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "CHN",
    country: "China",
    region: "Western Pacific",
    income: "upper-middle",
    deathsPer100kPop: 17.4,
    deathsAbs: 248099,
    vehiclesPer1000: 277.2,
    deathsPer100kVehicles: 62.8,
    fleetGrowthPct: 145,
    rateChangePct: -12,
    twoThreeWheelerSharePct: 20,
    archetype: "transitioning",
    confidence: "disclosed",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "MYS",
    country: "Malaysia",
    region: "Western Pacific",
    income: "upper-middle",
    deathsPer100kPop: 13.9,
    deathsAbs: 4700,
    vehiclesPer1000: 920.0,
    deathsPer100kVehicles: 15.1,
    fleetGrowthPct: 50,
    rateChangePct: -28,
    twoThreeWheelerSharePct: 45,
    archetype: "transitioning",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "BRA",
    country: "Brazil",
    region: "Americas",
    income: "upper-middle",
    deathsPer100kPop: 15.7,
    deathsAbs: 33586,
    vehiclesPer1000: 520.0,
    deathsPer100kVehicles: 30.2,
    fleetGrowthPct: 48,
    rateChangePct: -20,
    twoThreeWheelerSharePct: 27,
    archetype: "unsafe-motorized",
    confidence: "disclosed",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "MEX",
    country: "Mexico",
    region: "Americas",
    income: "upper-middle",
    deathsPer100kPop: 12.8,
    deathsAbs: 16200,
    vehiclesPer1000: 360.0,
    deathsPer100kVehicles: 35.6,
    fleetGrowthPct: 42,
    rateChangePct: -10,
    twoThreeWheelerSharePct: 8,
    archetype: "unsafe-motorized",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "COL",
    country: "Colombia",
    region: "Americas",
    income: "upper-middle",
    deathsPer100kPop: 16.2,
    deathsAbs: 8300,
    vehiclesPer1000: 280.0,
    deathsPer100kVehicles: 57.9,
    fleetGrowthPct: 70,
    rateChangePct: -5,
    twoThreeWheelerSharePct: 55,
    archetype: "unsafe-motorized",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "USA",
    country: "United States",
    region: "Americas",
    income: "high",
    deathsPer100kPop: 14.2,
    deathsAbs: 47750,
    vehiclesPer1000: 818.8,
    deathsPer100kVehicles: 17.3,
    fleetGrowthPct: 12,
    rateChangePct: 8,
    twoThreeWheelerSharePct: 3,
    archetype: "unsafe-motorized",
    confidence: "disclosed",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "IRN",
    country: "Iran",
    region: "Eastern Mediterranean",
    income: "upper-middle",
    deathsPer100kPop: 21.5,
    deathsAbs: 18900,
    vehiclesPer1000: 340.0,
    deathsPer100kVehicles: 63.2,
    fleetGrowthPct: 55,
    rateChangePct: -15,
    twoThreeWheelerSharePct: 18,
    archetype: "unsafe-motorized",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "SAU",
    country: "Saudi Arabia",
    region: "Eastern Mediterranean",
    income: "high",
    deathsPer100kPop: 27.2,
    deathsAbs: 9600,
    vehiclesPer1000: 380.0,
    deathsPer100kVehicles: 71.6,
    fleetGrowthPct: 40,
    rateChangePct: -25,
    twoThreeWheelerSharePct: 1,
    archetype: "outlier-high-rate",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "RUS",
    country: "Russian Federation",
    region: "Europe",
    income: "upper-middle",
    deathsPer100kPop: 10.6,
    deathsAbs: 15300,
    vehiclesPer1000: 400.0,
    deathsPer100kVehicles: 26.5,
    fleetGrowthPct: 35,
    rateChangePct: -50,
    twoThreeWheelerSharePct: 2,
    archetype: "transitioning",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "POL",
    country: "Poland",
    region: "Europe",
    income: "high",
    deathsPer100kPop: 7.2,
    deathsAbs: 2700,
    vehiclesPer1000: 720.0,
    deathsPer100kVehicles: 10.0,
    fleetGrowthPct: 40,
    rateChangePct: -45,
    twoThreeWheelerSharePct: 5,
    archetype: "safe-motorized",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "DEU",
    country: "Germany",
    region: "Europe",
    income: "high",
    deathsPer100kPop: 3.7,
    deathsAbs: 3100,
    vehiclesPer1000: 680.0,
    deathsPer100kVehicles: 5.4,
    fleetGrowthPct: 15,
    rateChangePct: -35,
    twoThreeWheelerSharePct: 6,
    archetype: "safe-motorized",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "GBR",
    country: "United Kingdom",
    region: "Europe",
    income: "high",
    deathsPer100kPop: 2.4,
    deathsAbs: 1600,
    vehiclesPer1000: 610.0,
    deathsPer100kVehicles: 3.9,
    fleetGrowthPct: 10,
    rateChangePct: -40,
    twoThreeWheelerSharePct: 4,
    archetype: "safe-motorized",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "SWE",
    country: "Sweden",
    region: "Europe",
    income: "high",
    deathsPer100kPop: 2.1,
    deathsAbs: 217,
    vehiclesPer1000: 629.1,
    deathsPer100kVehicles: 3.3,
    fleetGrowthPct: 12,
    rateChangePct: -42,
    twoThreeWheelerSharePct: 6,
    archetype: "safe-motorized",
    confidence: "disclosed",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "NOR",
    country: "Norway",
    region: "Europe",
    income: "high",
    deathsPer100kPop: 1.5,
    deathsAbs: 81,
    vehiclesPer1000: 650.0,
    deathsPer100kVehicles: 2.3,
    fleetGrowthPct: 18,
    rateChangePct: -55,
    twoThreeWheelerSharePct: 5,
    archetype: "safe-motorized",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "JPN",
    country: "Japan",
    region: "Western Pacific",
    income: "high",
    deathsPer100kPop: 2.7,
    deathsAbs: 3304,
    vehiclesPer1000: 659.4,
    deathsPer100kVehicles: 4.1,
    fleetGrowthPct: 5,
    rateChangePct: -52,
    twoThreeWheelerSharePct: 12,
    archetype: "safe-motorized",
    confidence: "disclosed",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "KOR",
    country: "Republic of Korea",
    region: "Western Pacific",
    income: "high",
    deathsPer100kPop: 6.9,
    deathsAbs: 3500,
    vehiclesPer1000: 520.0,
    deathsPer100kVehicles: 13.3,
    fleetGrowthPct: 25,
    rateChangePct: -48,
    twoThreeWheelerSharePct: 8,
    archetype: "safe-motorized",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "AUS",
    country: "Australia",
    region: "Western Pacific",
    income: "high",
    deathsPer100kPop: 4.5,
    deathsAbs: 1150,
    vehiclesPer1000: 780.0,
    deathsPer100kVehicles: 5.8,
    fleetGrowthPct: 20,
    rateChangePct: -30,
    twoThreeWheelerSharePct: 4,
    archetype: "safe-motorized",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
  {
    iso3: "FRA",
    country: "France",
    region: "Europe",
    income: "high",
    deathsPer100kPop: 4.8,
    deathsAbs: 3200,
    vehiclesPer1000: 670.0,
    deathsPer100kVehicles: 7.2,
    fleetGrowthPct: 12,
    rateChangePct: -32,
    twoThreeWheelerSharePct: 5,
    archetype: "safe-motorized",
    confidence: "estimated",
    fleetGrowthConfidence: "estimated",
  },
];

/** WHO regional aggregates (disclosed rates + decade death change) */
export type RegionAgg = {
  region: WhoRegion;
  deathsPer100kPop2021: number;
  deathsChangePct2010: number;
  /** Approximate fleet growth index 2010=100 → 2021 */
  fleetIndex2021: number;
  /** Share of global deaths (approx %) */
  shareOfGlobalDeathsPct: number;
  confidence: Confidence;
};

export const REGION_AGG: RegionAgg[] = [
  {
    region: "Africa",
    deathsPer100kPop2021: 19,
    deathsChangePct2010: 17,
    fleetIndex2021: 220,
    shareOfGlobalDeathsPct: 19,
    confidence: "disclosed",
  },
  {
    region: "Eastern Mediterranean",
    deathsPer100kPop2021: 16,
    deathsChangePct2010: 0.5,
    fleetIndex2021: 190,
    shareOfGlobalDeathsPct: 9,
    confidence: "disclosed",
  },
  {
    region: "South-East Asia",
    deathsPer100kPop2021: 16,
    deathsChangePct2010: -2,
    fleetIndex2021: 260,
    shareOfGlobalDeathsPct: 28,
    confidence: "disclosed",
  },
  {
    region: "Western Pacific",
    deathsPer100kPop2021: 15,
    deathsChangePct2010: -16,
    fleetIndex2021: 240,
    shareOfGlobalDeathsPct: 25,
    confidence: "disclosed",
  },
  {
    region: "Americas",
    deathsPer100kPop2021: 15,
    deathsChangePct2010: -0.1,
    fleetIndex2021: 170,
    shareOfGlobalDeathsPct: 11,
    confidence: "disclosed",
  },
  {
    region: "Europe",
    deathsPer100kPop2021: 7,
    deathsChangePct2010: -36,
    fleetIndex2021: 150,
    shareOfGlobalDeathsPct: 8,
    confidence: "disclosed",
  },
];

/** Income-group burden (WHO disclosed) */
export type IncomeAgg = {
  income: IncomeGroup;
  label: string;
  deathsPer100kPop: number;
  shareOfDeathsPct: number;
  shareOfVehiclesPct: number;
  shareOfPopulationPct: number;
  confidence: Confidence;
};

export const INCOME_AGG: IncomeAgg[] = [
  {
    income: "low",
    label: "Low income",
    deathsPer100kPop: 21,
    shareOfDeathsPct: 13,
    shareOfVehiclesPct: 1,
    shareOfPopulationPct: 9,
    confidence: "disclosed",
  },
  {
    income: "lower-middle",
    label: "Lower-middle",
    deathsPer100kPop: 16,
    shareOfDeathsPct: 44,
    shareOfVehiclesPct: 18,
    shareOfPopulationPct: 40,
    confidence: "estimated",
  },
  {
    income: "upper-middle",
    label: "Upper-middle",
    deathsPer100kPop: 16,
    shareOfDeathsPct: 35,
    shareOfVehiclesPct: 53,
    shareOfPopulationPct: 35,
    confidence: "estimated",
  },
  {
    income: "high",
    label: "High income",
    deathsPer100kPop: 8,
    shareOfDeathsPct: 8,
    shareOfVehiclesPct: 28,
    shareOfPopulationPct: 16,
    confidence: "disclosed",
  },
];

/** Global path: deaths per 100k vehicles vs fleet index */
export type GlobalPathPoint = {
  year: number;
  deathsPer100kVehicles: number;
  fleetIndex: number;
  deathsPer100kPop: number;
  confidence: Confidence;
};

export const GLOBAL_PATH: GlobalPathPoint[] = [
  { year: 2010, deathsPer100kVehicles: 79, fleetIndex: 100, deathsPer100kPop: 18, confidence: "disclosed" },
  { year: 2013, deathsPer100kVehicles: 68, fleetIndex: 125, deathsPer100kPop: 17.2, confidence: "carried" },
  { year: 2016, deathsPer100kVehicles: 58, fleetIndex: 155, deathsPer100kPop: 16.4, confidence: "carried" },
  { year: 2018, deathsPer100kVehicles: 52, fleetIndex: 190, deathsPer100kPop: 15.8, confidence: "carried" },
  { year: 2021, deathsPer100kVehicles: 47, fleetIndex: 260, deathsPer100kPop: 15, confidence: "disclosed" },
];

/** Stylized country motorization paths (vehicles/1000 vs deaths/100k) */
export type PathPoint = {
  country: string;
  iso3: string;
  year: number;
  vehiclesPer1000: number;
  deathsPer100kPop: number;
  confidence: Confidence;
};

export const MOTORIZATION_PATHS: PathPoint[] = [
  { country: "Sweden", iso3: "SWE", year: 2010, vehiclesPer1000: 560, deathsPer100kPop: 3.6, confidence: "estimated" },
  { country: "Sweden", iso3: "SWE", year: 2015, vehiclesPer1000: 595, deathsPer100kPop: 2.7, confidence: "estimated" },
  { country: "Sweden", iso3: "SWE", year: 2021, vehiclesPer1000: 629, deathsPer100kPop: 2.1, confidence: "disclosed" },
  { country: "Japan", iso3: "JPN", year: 2010, vehiclesPer1000: 620, deathsPer100kPop: 5.2, confidence: "estimated" },
  { country: "Japan", iso3: "JPN", year: 2015, vehiclesPer1000: 640, deathsPer100kPop: 3.8, confidence: "estimated" },
  { country: "Japan", iso3: "JPN", year: 2021, vehiclesPer1000: 659, deathsPer100kPop: 2.7, confidence: "disclosed" },
  { country: "India", iso3: "IND", year: 2010, vehiclesPer1000: 95, deathsPer100kPop: 16.8, confidence: "estimated" },
  { country: "India", iso3: "IND", year: 2015, vehiclesPer1000: 155, deathsPer100kPop: 16.0, confidence: "estimated" },
  { country: "India", iso3: "IND", year: 2021, vehiclesPer1000: 232, deathsPer100kPop: 15.4, confidence: "disclosed" },
  { country: "Thailand", iso3: "THA", year: 2010, vehiclesPer1000: 380, deathsPer100kPop: 32.0, confidence: "estimated" },
  { country: "Thailand", iso3: "THA", year: 2015, vehiclesPer1000: 480, deathsPer100kPop: 28.5, confidence: "estimated" },
  { country: "Thailand", iso3: "THA", year: 2021, vehiclesPer1000: 591, deathsPer100kPop: 25.4, confidence: "disclosed" },
  { country: "Viet Nam", iso3: "VNM", year: 2010, vehiclesPer1000: 320, deathsPer100kPop: 24.5, confidence: "estimated" },
  { country: "Viet Nam", iso3: "VNM", year: 2015, vehiclesPer1000: 520, deathsPer100kPop: 21.0, confidence: "estimated" },
  { country: "Viet Nam", iso3: "VNM", year: 2021, vehiclesPer1000: 773, deathsPer100kPop: 17.7, confidence: "disclosed" },
  { country: "Kenya", iso3: "KEN", year: 2010, vehiclesPer1000: 35, deathsPer100kPop: 26.0, confidence: "estimated" },
  { country: "Kenya", iso3: "KEN", year: 2015, vehiclesPer1000: 55, deathsPer100kPop: 27.0, confidence: "estimated" },
  { country: "Kenya", iso3: "KEN", year: 2021, vehiclesPer1000: 80, deathsPer100kPop: 28.2, confidence: "disclosed" },
  { country: "United States", iso3: "USA", year: 2010, vehiclesPer1000: 790, deathsPer100kPop: 11.4, confidence: "estimated" },
  { country: "United States", iso3: "USA", year: 2015, vehiclesPer1000: 805, deathsPer100kPop: 11.3, confidence: "estimated" },
  { country: "United States", iso3: "USA", year: 2021, vehiclesPer1000: 819, deathsPer100kPop: 14.2, confidence: "disclosed" },
  { country: "Nigeria", iso3: "NGA", year: 2010, vehiclesPer1000: 32, deathsPer100kPop: 16.0, confidence: "estimated" },
  { country: "Nigeria", iso3: "NGA", year: 2015, vehiclesPer1000: 48, deathsPer100kPop: 16.5, confidence: "estimated" },
  { country: "Nigeria", iso3: "NGA", year: 2021, vehiclesPer1000: 71, deathsPer100kPop: 17.2, confidence: "disclosed" },
];

/** User-type death shares (WHO disclosed global) */
export type UserMix = {
  user: string;
  sharePct2021: number;
  changeVs2013Pct: number;
  confidence: Confidence;
};

export const USER_MIX: UserMix[] = [
  { user: "4-wheel occupants", sharePct2021: 30, changeVs2013Pct: -19, confidence: "disclosed" },
  { user: "2/3-wheel riders", sharePct2021: 30, changeVs2013Pct: 30, confidence: "disclosed" },
  { user: "Pedestrians", sharePct2021: 23, changeVs2013Pct: 0, confidence: "estimated" },
  { user: "Cyclists", sharePct2021: 6, changeVs2013Pct: 0, confidence: "estimated" },
  { user: "Other / unknown", sharePct2021: 11, changeVs2013Pct: 0, confidence: "estimated" },
];

export function fmtRate(n: number, digits = 1): string {
  return n.toFixed(digits);
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function archetypeLabel(a: SafetyArchetype): string {
  switch (a) {
    case "safe-motorized":
      return "Safe & motorized";
    case "unsafe-motorized":
      return "Motorized, still deadly";
    case "unsafe-low-fleet":
      return "Low fleet, high risk";
    case "transitioning":
      return "Transitioning";
    case "outlier-high-rate":
      return "High-rate outlier";
  }
}
