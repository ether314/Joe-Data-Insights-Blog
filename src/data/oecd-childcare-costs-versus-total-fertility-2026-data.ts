/**
 * OECD net childcare costs (% of average wage) vs World Bank WDI total fertility.
 *
 * Childcare: OECD TaxBEN / Family Database NCC - dual-earner couple with two
 * children aged 2-3, earnings 100% + 67% of average wage, full-time centre-based
 * care, net cost as % of average wage (2022).
 * Fertility: World Bank WDI SP.DYN.TFRT.IN (2022).
 */

export const HEADLINE = {
  oecdAvgNetCostPctAW: 13,
  sampleN: 33,
  pearsonR: 0.244,
  pearsonRExclOutliers: 0.373,
  lowCostMeanTfr: 1.388,
  highCostMeanTfr: 1.531,
  maxNetCostPctAW: 37,
  maxNetCostCountry: "New Zealand",
  minTfr: 0.778,
  minTfrCountry: "Korea",
  maxTfr: 2.89,
  maxTfrCountry: "Israel",
  year: 2022,
} as const;

export const SOURCES = [
  "OECD TaxBEN / Family Database - Net childcare costs (NCC), dual-earner couple 100%+67% AW, two children aged 2-3, % of average wage, 2022",
  "OECD PF3.4 Childcare support - methodology for fees, benefits, and tax interactions",
  "World Bank World Development Indicators - SP.DYN.TFRT.IN (total fertility rate), 2022",
] as const;

export const SOURCE_NOTE =
  "Net childcare cost is the reduction in family disposable income from purchasing full-time centre-based care for two children (ages 2 and 3), after fee rebates, childcare benefits, and tax changes. Local capital-city fee schedules are used where fees are set locally. Cross-section correlation is not causal: housing, norms, leave policy, and partnership formation also shape TFR.";

export type RegionId =
  | "Anglosphere"
  | "Nordic"
  | "Continental"
  | "Southern Europe"
  | "Central-Eastern"
  | "East Asia"
  | "Other OECD";

export const REGION_META: Record<
  RegionId,
  { label: string; short: string; color: string }
> = {
  Anglosphere: { label: "Anglosphere", short: "ANG", color: "#38bdf8" },
  Nordic: { label: "Nordic", short: "NOR", color: "#34d399" },
  Continental: { label: "Continental Europe", short: "CON", color: "#a78bfa" },
  "Southern Europe": {
    label: "Southern Europe",
    short: "SOU",
    color: "#fbbf24",
  },
  "Central-Eastern": {
    label: "Central & Eastern Europe",
    short: "CEE",
    color: "#fb7185",
  },
  "East Asia": { label: "East Asia", short: "EAS", color: "#f97316" },
  "Other OECD": { label: "Other OECD", short: "OTH", color: "#94a3b8" },
};

export type CountryRow = {
  iso3: string;
  name: string;
  region: RegionId;
  netCostPctAW: number;
  feePctAW: number | null;
  benefitPctAW: number | null;
  taxPctAW: number | null;
  otherPctAW: number | null;
  singleNetCostPctAW: number | null;
  tfr: number;
  tfrYear: number;
};

export const COUNTRIES: CountryRow[] = [
  {
    iso3: "NZL",
    name: "New Zealand",
    region: "Anglosphere" as RegionId,
    netCostPctAW: 37,
    feePctAW: 50,
    benefitPctAW: -14,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 11,
    tfr: 1.67,
    tfrYear: 2022
  },
  {
    iso3: "USA",
    name: "United States",
    region: "Anglosphere" as RegionId,
    netCostPctAW: 32,
    feePctAW: 34,
    benefitPctAW: 0,
    taxPctAW: -2,
    otherPctAW: 0,
    singleNetCostPctAW: 32,
    tfr: 1.657,
    tfrYear: 2022
  },
  {
    iso3: "CAN",
    name: "Canada",
    region: "Anglosphere" as RegionId,
    netCostPctAW: 30,
    feePctAW: 37,
    benefitPctAW: 0,
    taxPctAW: -6,
    otherPctAW: -1,
    singleNetCostPctAW: -2,
    tfr: 1.34,
    tfrYear: 2022
  },
  {
    iso3: "IRL",
    name: "Ireland",
    region: "Anglosphere" as RegionId,
    netCostPctAW: 29,
    feePctAW: 36,
    benefitPctAW: -7,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 19,
    tfr: 1.51,
    tfrYear: 2022
  },
  {
    iso3: "GBR",
    name: "United Kingdom",
    region: "Anglosphere" as RegionId,
    netCostPctAW: 23,
    feePctAW: 50,
    benefitPctAW: -26,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 5,
    tfr: 1.56,
    tfrYear: 2022
  },
  {
    iso3: "AUS",
    name: "Australia",
    region: "Anglosphere" as RegionId,
    netCostPctAW: 22,
    feePctAW: 49,
    benefitPctAW: -27,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 7,
    tfr: 1.63,
    tfrYear: 2022
  },
  {
    iso3: "NLD",
    name: "Netherlands",
    region: "Continental" as RegionId,
    netCostPctAW: 21,
    feePctAW: 63,
    benefitPctAW: -42,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 8,
    tfr: 1.49,
    tfrYear: 2022
  },
  {
    iso3: "CHE",
    name: "Switzerland",
    region: "Continental" as RegionId,
    netCostPctAW: 20,
    feePctAW: 60,
    benefitPctAW: -35,
    taxPctAW: -5,
    otherPctAW: 0,
    singleNetCostPctAW: 5,
    tfr: 1.39,
    tfrYear: 2022
  },
  {
    iso3: "CZE",
    name: "Czechia",
    region: "Central-Eastern" as RegionId,
    netCostPctAW: 17,
    feePctAW: 10,
    benefitPctAW: 0,
    taxPctAW: -7,
    otherPctAW: 13,
    singleNetCostPctAW: 20,
    tfr: 1.64,
    tfrYear: 2022
  },
  {
    iso3: "BEL",
    name: "Belgium",
    region: "Continental" as RegionId,
    netCostPctAW: 16,
    feePctAW: 18,
    benefitPctAW: -3,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 5,
    tfr: 1.53,
    tfrYear: 2022
  },
  {
    iso3: "FIN",
    name: "Finland",
    region: "Nordic" as RegionId,
    netCostPctAW: 15,
    feePctAW: 14,
    benefitPctAW: -4,
    taxPctAW: -4,
    otherPctAW: 10,
    singleNetCostPctAW: 3,
    tfr: 1.32,
    tfrYear: 2022
  },
  {
    iso3: "ISR",
    name: "Israel",
    region: "Other OECD" as RegionId,
    netCostPctAW: 14,
    feePctAW: 14,
    benefitPctAW: 0,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 9,
    tfr: 2.89,
    tfrYear: 2022
  },
  {
    iso3: "FRA",
    name: "France",
    region: "Continental" as RegionId,
    netCostPctAW: 12,
    feePctAW: 18,
    benefitPctAW: -4,
    taxPctAW: -3,
    otherPctAW: 0,
    singleNetCostPctAW: 3,
    tfr: 1.78,
    tfrYear: 2022
  },
  {
    iso3: "SVK",
    name: "Slovak Republic",
    region: "Central-Eastern" as RegionId,
    netCostPctAW: 12,
    feePctAW: 12,
    benefitPctAW: 0,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 12,
    tfr: 1.57,
    tfrYear: 2022
  },
  {
    iso3: "DNK",
    name: "Denmark",
    region: "Nordic" as RegionId,
    netCostPctAW: 11,
    feePctAW: 13,
    benefitPctAW: -2,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 1,
    tfr: 1.55,
    tfrYear: 2022
  },
  {
    iso3: "JPN",
    name: "Japan",
    region: "East Asia" as RegionId,
    netCostPctAW: 11,
    feePctAW: 26,
    benefitPctAW: -15,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 1,
    tfr: 1.26,
    tfrYear: 2022
  },
  {
    iso3: "GRC",
    name: "Greece",
    region: "Southern Europe" as RegionId,
    netCostPctAW: 9,
    feePctAW: 43,
    benefitPctAW: -35,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 0,
    tfr: 1.32,
    tfrYear: 2022
  },
  {
    iso3: "SVN",
    name: "Slovenia",
    region: "Central-Eastern" as RegionId,
    netCostPctAW: 9,
    feePctAW: 46,
    benefitPctAW: -37,
    taxPctAW: 0,
    otherPctAW: 1,
    singleNetCostPctAW: 8,
    tfr: 1.55,
    tfrYear: 2022
  },
  {
    iso3: "ESP",
    name: "Spain",
    region: "Southern Europe" as RegionId,
    netCostPctAW: 9,
    feePctAW: 9,
    benefitPctAW: 0,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 9,
    tfr: 1.16,
    tfrYear: 2022
  },
  {
    iso3: "LTU",
    name: "Lithuania",
    region: "Central-Eastern" as RegionId,
    netCostPctAW: 8,
    feePctAW: 8,
    benefitPctAW: 0,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 5,
    tfr: 1.27,
    tfrYear: 2022
  },
  {
    iso3: "LUX",
    name: "Luxembourg",
    region: "Continental" as RegionId,
    netCostPctAW: 8,
    feePctAW: 44,
    benefitPctAW: -33,
    taxPctAW: -3,
    otherPctAW: 0,
    singleNetCostPctAW: 0,
    tfr: 1.31,
    tfrYear: 2022
  },
  {
    iso3: "NOR",
    name: "Norway",
    region: "Nordic" as RegionId,
    netCostPctAW: 8,
    feePctAW: 10,
    benefitPctAW: -2,
    taxPctAW: -1,
    otherPctAW: 0,
    singleNetCostPctAW: 1,
    tfr: 1.41,
    tfrYear: 2022
  },
  {
    iso3: "POL",
    name: "Poland",
    region: "Central-Eastern" as RegionId,
    netCostPctAW: 8,
    feePctAW: 11,
    benefitPctAW: -3,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 8,
    tfr: 1.29,
    tfrYear: 2022
  },
  {
    iso3: "HUN",
    name: "Hungary",
    region: "Central-Eastern" as RegionId,
    netCostPctAW: 7,
    feePctAW: 7,
    benefitPctAW: 0,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 7,
    tfr: 1.57,
    tfrYear: 2022
  },
  {
    iso3: "ISL",
    name: "Iceland",
    region: "Nordic" as RegionId,
    netCostPctAW: 5,
    feePctAW: 7,
    benefitPctAW: -1,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 4,
    tfr: 1.589,
    tfrYear: 2022
  },
  {
    iso3: "KOR",
    name: "Korea",
    region: "East Asia" as RegionId,
    netCostPctAW: 5,
    feePctAW: 16,
    benefitPctAW: -16,
    taxPctAW: 0,
    otherPctAW: 5,
    singleNetCostPctAW: 5,
    tfr: 0.778,
    tfrYear: 2022
  },
  {
    iso3: "PRT",
    name: "Portugal",
    region: "Southern Europe" as RegionId,
    netCostPctAW: 5,
    feePctAW: 28,
    benefitPctAW: -21,
    taxPctAW: -2,
    otherPctAW: 0,
    singleNetCostPctAW: 0,
    tfr: 1.43,
    tfrYear: 2022
  },
  {
    iso3: "SWE",
    name: "Sweden",
    region: "Nordic" as RegionId,
    netCostPctAW: 5,
    feePctAW: 8,
    benefitPctAW: -3,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 3,
    tfr: 1.53,
    tfrYear: 2022
  },
  {
    iso3: "EST",
    name: "Estonia",
    region: "Central-Eastern" as RegionId,
    netCostPctAW: 4,
    feePctAW: 9,
    benefitPctAW: -5,
    taxPctAW: -1,
    otherPctAW: 0,
    singleNetCostPctAW: 0,
    tfr: 1.41,
    tfrYear: 2022
  },
  {
    iso3: "AUT",
    name: "Austria",
    region: "Continental" as RegionId,
    netCostPctAW: 3,
    feePctAW: 3,
    benefitPctAW: 0,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 3,
    tfr: 1.41,
    tfrYear: 2022
  },
  {
    iso3: "DEU",
    name: "Germany",
    region: "Continental" as RegionId,
    netCostPctAW: 1,
    feePctAW: 1,
    benefitPctAW: 0,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 1,
    tfr: 1.455,
    tfrYear: 2022
  },
  {
    iso3: "ITA",
    name: "Italy",
    region: "Southern Europe" as RegionId,
    netCostPctAW: 0,
    feePctAW: 40,
    benefitPctAW: -40,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 0,
    tfr: 1.24,
    tfrYear: 2022
  },
  {
    iso3: "LVA",
    name: "Latvia",
    region: "Central-Eastern" as RegionId,
    netCostPctAW: 0,
    feePctAW: 6,
    benefitPctAW: -6,
    taxPctAW: 0,
    otherPctAW: 0,
    singleNetCostPctAW: 0,
    tfr: 1.47,
    tfrYear: 2022
  }
];

export const COST_BANDS = [
  {
    id: "low" as const,
    label: "Under 8% AW",
    n: 10,
    meanNetCost: 3.5,
    meanTfr: 1.388,
  },
  {
    id: "mid" as const,
    label: "8-19% AW",
    n: 15,
    meanNetCost: 11.1,
    meanTfr: 1.523,
  },
  {
    id: "high" as const,
    label: "20%+ AW",
    n: 8,
    meanNetCost: 26.8,
    meanTfr: 1.531,
  },
];

export const REGION_AGG = [
  {
    region: "Southern Europe" as RegionId,
    n: 4,
    meanNetCost: 5.8,
    meanTfr: 1.288
  },
  {
    region: "East Asia" as RegionId,
    n: 2,
    meanNetCost: 8,
    meanTfr: 1.019
  },
  {
    region: "Central-Eastern" as RegionId,
    n: 8,
    meanNetCost: 8.1,
    meanTfr: 1.471
  },
  {
    region: "Nordic" as RegionId,
    n: 5,
    meanNetCost: 8.8,
    meanTfr: 1.48
  },
  {
    region: "Continental" as RegionId,
    n: 7,
    meanNetCost: 11.6,
    meanTfr: 1.481
  },
  {
    region: "Other OECD" as RegionId,
    n: 1,
    meanNetCost: 14,
    meanTfr: 2.89
  },
  {
    region: "Anglosphere" as RegionId,
    n: 6,
    meanNetCost: 28.8,
    meanTfr: 1.561
  }
];

export const DECOMPOSITION_FOCUS = [
  "NZL",
  "USA",
  "CAN",
  "IRL",
  "GBR",
  "AUS",
  "NLD",
  "ITA",
  "KOR",
  "DEU",
] as const;

export function costBandFor(netCostPctAW: number): "low" | "mid" | "high" {
  if (netCostPctAW < 8) return "low";
  if (netCostPctAW < 20) return "mid";
  return "high";
}

export function countriesByRegion(region: RegionId | "All"): CountryRow[] {
  if (region === "All") return COUNTRIES;
  return COUNTRIES.filter((c) => c.region === region);
}

export function decompositionRows(): {
  name: string;
  iso3: string;
  fee: number;
  benefitAbs: number;
  tax: number;
  other: number;
  net: number;
}[] {
  const set = new Set<string>(DECOMPOSITION_FOCUS);
  return COUNTRIES.filter((c) => set.has(c.iso3)).map((c) => ({
    name: c.name,
    iso3: c.iso3,
    fee: c.feePctAW ?? 0,
    benefitAbs: Math.abs(c.benefitPctAW ?? 0),
    tax: c.taxPctAW ?? 0,
    other: c.otherPctAW ?? 0,
    net: c.netCostPctAW,
  }));
}
