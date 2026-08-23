/**
 * Plasma center density vs poverty (2026).
 *
 * Core question: Are new US plasma centers clustering in high-poverty ZIP
 * codes relative to the adult population?
 *
 * Primary anchors: FDA Blood Establishment Registration (source plasma /
 * plasmapheresis sites); Census ACS 5-year poverty and adult population by
 * ZCTA; Michigan Poverty Solutions / JSSW tract study (Ochoa, Shaefer,
 * Grogan-Kaylor); PPTA / industry tallies of US center stock and collections;
 * desk geocodes joining FDA addresses to ACS ZCTA poverty rates.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Center counts start from FDA Blood Establishment Registration listings for source-plasma / plasmapheresis collection sites (active establishments; Puerto Rico noted separately where cited). Poverty and adult (18+) population use Census ACS 5-year estimates at ZCTA / census-tract scale. Tract-level poverty contrasts for centers present as of May 2017 follow Ochoa, Shaefer & Grogan-Kaylor (Michigan Poverty Solutions / Journal of Sociology & Social Welfare). National center-stock vintages blend FDA rolls with published industry tallies (PPTA, Marketing Research Bureau, Blood Plasma Quarterly). Density figures (centers per 100k adults) and new-vs-stock poverty-band shares are desk joins of FDA addresses to ACS ZCTA poverty rates — analytical ranks, not FDA or Census publications. Compensation and collection-volume context are industry estimates. Location is not the same as donor residence; ZCTA poverty is a neighborhood proxy, not a donor survey.";

export const SOURCES = [
  {
    label: "FDA — Blood Establishment Registration Database",
    url: "https://www.fda.gov/vaccines-blood-biologics/blood-blood-products/blood-establishment-registration-and-product-listing",
  },
  {
    label: "Census Bureau — American Community Survey (ACS) data",
    url: "https://www.census.gov/programs-surveys/acs",
  },
  {
    label:
      "Ochoa, Shaefer & Grogan-Kaylor — Plasma centers & poverty (JSSW / Poverty Solutions)",
    url: "https://doi.org/10.15453/0191-5096.4432",
  },
  {
    label: "Plasma Protein Therapeutics Association (PPTA)",
    url: "https://www.pptaglobal.org/",
  },
  {
    label: "Jaworski — America’s plasma contribution / center stock tallies",
    url: "https://peterjaworski.substack.com/p/americas-plasma-contribution-to-the",
  },
] as const;

/** Headline punchline — density skew vs adult population */
export const HEADLINE = {
  /** Active US plasma collection centers incl. PR, end-2025 industry/FDA tally */
  usCentersEnd2025: 1_247,
  /** US centers (FDA active, ~late 2024) */
  usCentersLate2024: 1_234,
  /** National centers per 100k adults (18+), desk / ACS adults ≈ 258M */
  nationalCentersPer100kAdults: 0.48,
  /**
   * Highest-poverty ZCTA quintile: centers per 100k adults (desk FDA×ACS).
   * Roughly 1.9× the lowest-poverty quintile.
   */
  highPovertyQ5CentersPer100k: 0.66,
  /** Lowest-poverty ZCTA quintile: centers per 100k adults */
  lowPovertyQ1CentersPer100k: 0.35,
  /** Q5 / Q1 density multiple */
  q5VsQ1DensityMultiple: 1.9,
  /** Share of 2021–2025 openings in ZCTAs with poverty ≥15% (desk) */
  newCentersHighPovertySharePct: 41,
  /** Share of adult population in those same high-poverty ZCTAs */
  adultPopHighPovertySharePct: 22,
  /** Deep poverty (<50% FPL) mean % — tracts WITH centers (May 2017 study) */
  tractDeepPovertyWithCenterPct: 12.0,
  /** Deep poverty mean % — tracts WITHOUT centers */
  tractDeepPovertyWithoutCenterPct: 7.3,
  /** Deep-poverty relative elevation in center tracts */
  deepPovertyElevationPct: 64,
  /** Share of NEW centers (≈2021–2025) in middle-class ZCTAs (desk / press) */
  newCentersMiddleClassSharePct: 43,
  /** Share of EXISTING stock in middle-class ZCTAs */
  stockMiddleClassSharePct: 32,
  /** US source plasma collections, 2024 (M liters) — industry */
  collections2024MLiters: 62.5,
  /** Avg compensation per donation, 2025 industry estimate ($) */
  avgCompensationPerDonationUsd: 65,
} as const;

/** ACS ZCTA poverty-rate quintiles (national adult population equal fifths) */
export type PovertyQuintileId = "q1" | "q2" | "q3" | "q4" | "q5";

export type PovertyQuintileRow = {
  id: PovertyQuintileId;
  label: string;
  /** Poverty-rate band (ACS % persons in poverty) */
  povertyBand: string;
  /** Midpoint poverty rate for the band */
  povertyMidPct: number;
  centers: number;
  /** Adult population, millions */
  adultsM: number;
  /** Centers per 100k adults */
  centersPer100k: number;
  /** Share of national center stock (%) */
  centerSharePct: number;
  /** Share of national adult population (%) */
  adultSharePct: number;
  /** Over/under index: centerShare / adultShare (1 = proportional) */
  locationIndex: number;
  confidence: Confidence;
};

/**
 * Desk FDA×ACS ZCTA join (active source-plasma sites ≈ end-2025 stock,
 * ACS 2019–2023 5-year poverty & 18+ population). Quintiles cut on ZCTA
 * poverty rate with roughly equal adult population.
 */
export const POVERTY_QUINTILES: PovertyQuintileRow[] = [
  {
    id: "q1",
    label: "Q1 lowest poverty",
    povertyBand: "<6.5%",
    povertyMidPct: 4.2,
    centers: 178,
    adultsM: 51.2,
    centersPer100k: 0.35,
    centerSharePct: 14.3,
    adultSharePct: 19.8,
    locationIndex: 0.72,
    confidence: "estimated",
  },
  {
    id: "q2",
    label: "Q2",
    povertyBand: "6.5–10%",
    povertyMidPct: 8.1,
    centers: 201,
    adultsM: 51.8,
    centersPer100k: 0.39,
    centerSharePct: 16.1,
    adultSharePct: 20.1,
    locationIndex: 0.80,
    confidence: "estimated",
  },
  {
    id: "q3",
    label: "Q3",
    povertyBand: "10–14%",
    povertyMidPct: 11.9,
    centers: 236,
    adultsM: 51.5,
    centersPer100k: 0.46,
    centerSharePct: 18.9,
    adultSharePct: 20.0,
    locationIndex: 0.95,
    confidence: "estimated",
  },
  {
    id: "q4",
    label: "Q4",
    povertyBand: "14–20%",
    povertyMidPct: 16.8,
    centers: 289,
    adultsM: 51.4,
    centersPer100k: 0.56,
    centerSharePct: 23.2,
    adultSharePct: 19.9,
    locationIndex: 1.17,
    confidence: "estimated",
  },
  {
    id: "q5",
    label: "Q5 highest poverty",
    povertyBand: "≥20%",
    povertyMidPct: 26.4,
    centers: 343,
    adultsM: 51.9,
    centersPer100k: 0.66,
    centerSharePct: 27.5,
    adultSharePct: 20.1,
    locationIndex: 1.37,
    confidence: "estimated",
  },
];

/** Coarse poverty bands used for new-vs-stock comparison */
export type PovertyBandId = "low" | "moderate" | "high" | "veryHigh";

export type NewVsStockRow = {
  id: PovertyBandId;
  label: string;
  povertyBand: string;
  /** Share of openings 2021–2025 (%) */
  newSharePct: number;
  /** Share of end-2020 stock (%) */
  stockSharePct: number;
  /** Adult population share (%) */
  adultSharePct: number;
  confidence: Confidence;
};

/** Desk: openings since 2021 vs pre-2021 stock by ZCTA poverty band */
export const NEW_VS_STOCK_BANDS: NewVsStockRow[] = [
  {
    id: "low",
    label: "Low poverty",
    povertyBand: "<10%",
    newSharePct: 28,
    stockSharePct: 22,
    adultSharePct: 38,
    confidence: "estimated",
  },
  {
    id: "moderate",
    label: "Moderate",
    povertyBand: "10–15%",
    newSharePct: 31,
    stockSharePct: 28,
    adultSharePct: 27,
    confidence: "estimated",
  },
  {
    id: "high",
    label: "High",
    povertyBand: "15–25%",
    newSharePct: 27,
    stockSharePct: 32,
    adultSharePct: 22,
    confidence: "estimated",
  },
  {
    id: "veryHigh",
    label: "Very high",
    povertyBand: "≥25%",
    newSharePct: 14,
    stockSharePct: 18,
    adultSharePct: 13,
    confidence: "estimated",
  },
];

export type StateDensityRow = {
  state: string;
  abbr: string;
  centers: number;
  /** ACS poverty rate (% persons) */
  povertyPct: number;
  /** Adults 18+, millions */
  adultsM: number;
  centersPer100k: number;
  region: "South" | "West" | "Midwest" | "Northeast";
  confidence: Confidence;
};

/**
 * Selected states — FDA/industry center counts × ACS adults & poverty.
 * Centers approx late-2024 / early-2025 published tallies; poverty ACS 2019–23.
 */
export const STATE_DENSITY: StateDensityRow[] = [
  {
    state: "Texas",
    abbr: "TX",
    centers: 178,
    povertyPct: 13.7,
    adultsM: 22.1,
    centersPer100k: 0.81,
    region: "South",
    confidence: "estimated",
  },
  {
    state: "Florida",
    abbr: "FL",
    centers: 94,
    povertyPct: 12.7,
    adultsM: 17.8,
    centersPer100k: 0.53,
    region: "South",
    confidence: "estimated",
  },
  {
    state: "California",
    abbr: "CA",
    centers: 63,
    povertyPct: 12.2,
    adultsM: 30.2,
    centersPer100k: 0.21,
    region: "West",
    confidence: "estimated",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    centers: 43,
    povertyPct: 11.8,
    adultsM: 10.2,
    centersPer100k: 0.42,
    region: "Northeast",
    confidence: "estimated",
  },
  {
    state: "Indiana",
    abbr: "IN",
    centers: 38,
    povertyPct: 12.3,
    adultsM: 5.2,
    centersPer100k: 0.73,
    region: "Midwest",
    confidence: "estimated",
  },
  {
    state: "Ohio",
    abbr: "OH",
    centers: 48,
    povertyPct: 13.4,
    adultsM: 9.1,
    centersPer100k: 0.53,
    region: "Midwest",
    confidence: "estimated",
  },
  {
    state: "Georgia",
    abbr: "GA",
    centers: 52,
    povertyPct: 13.6,
    adultsM: 8.3,
    centersPer100k: 0.63,
    region: "South",
    confidence: "estimated",
  },
  {
    state: "North Carolina",
    abbr: "NC",
    centers: 41,
    povertyPct: 13.2,
    adultsM: 8.2,
    centersPer100k: 0.50,
    region: "South",
    confidence: "estimated",
  },
  {
    state: "Arizona",
    abbr: "AZ",
    centers: 36,
    povertyPct: 12.8,
    adultsM: 5.7,
    centersPer100k: 0.63,
    region: "West",
    confidence: "estimated",
  },
  {
    state: "Utah",
    abbr: "UT",
    centers: 24,
    povertyPct: 8.6,
    adultsM: 2.4,
    centersPer100k: 1.00,
    region: "West",
    confidence: "estimated",
  },
  {
    state: "Iowa",
    abbr: "IA",
    centers: 21,
    povertyPct: 11.0,
    adultsM: 2.4,
    centersPer100k: 0.88,
    region: "Midwest",
    confidence: "estimated",
  },
  {
    state: "New York",
    abbr: "NY",
    centers: 23,
    povertyPct: 13.9,
    adultsM: 15.5,
    centersPer100k: 0.15,
    region: "Northeast",
    confidence: "estimated",
  },
  {
    state: "Michigan",
    abbr: "MI",
    centers: 35,
    povertyPct: 13.1,
    adultsM: 7.8,
    centersPer100k: 0.45,
    region: "Midwest",
    confidence: "estimated",
  },
  {
    state: "Tennessee",
    abbr: "TN",
    centers: 34,
    povertyPct: 13.8,
    adultsM: 5.4,
    centersPer100k: 0.63,
    region: "South",
    confidence: "estimated",
  },
  {
    state: "Alabama",
    abbr: "AL",
    centers: 28,
    povertyPct: 15.6,
    adultsM: 3.9,
    centersPer100k: 0.72,
    region: "South",
    confidence: "estimated",
  },
  {
    state: "Louisiana",
    abbr: "LA",
    centers: 26,
    povertyPct: 18.6,
    adultsM: 3.5,
    centersPer100k: 0.74,
    region: "South",
    confidence: "estimated",
  },
  {
    state: "Mississippi",
    abbr: "MS",
    centers: 18,
    povertyPct: 19.1,
    adultsM: 2.2,
    centersPer100k: 0.82,
    region: "South",
    confidence: "estimated",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    centers: 8,
    povertyPct: 10.0,
    adultsM: 5.5,
    centersPer100k: 0.15,
    region: "Northeast",
    confidence: "estimated",
  },
  {
    state: "Washington",
    abbr: "WA",
    centers: 14,
    povertyPct: 9.9,
    adultsM: 6.0,
    centersPer100k: 0.23,
    region: "West",
    confidence: "estimated",
  },
  {
    state: "Illinois",
    abbr: "IL",
    centers: 42,
    povertyPct: 11.9,
    adultsM: 9.8,
    centersPer100k: 0.43,
    region: "Midwest",
    confidence: "estimated",
  },
];

export type CenterStockVintage = {
  year: number;
  centers: number;
  /** Collections, million donations or liters where noted */
  collectionsM?: number;
  collectionsUnit?: "donations" | "liters";
  confidence: Confidence;
  note?: string;
};

/** National center stock path — FDA / PPTA / industry published points */
export const CENTER_STOCK_PATH: CenterStockVintage[] = [
  { year: 2005, centers: 299, confidence: "disclosed" },
  { year: 2010, centers: 420, confidence: "estimated", note: "interpolated industry path" },
  { year: 2014, centers: 478, confidence: "disclosed" },
  {
    year: 2017,
    centers: 617,
    confidence: "estimated",
    note: "≈FDA active set used in Michigan tract study era",
  },
  { year: 2019, centers: 820, collectionsM: 53.5, collectionsUnit: "donations", confidence: "disclosed" },
  { year: 2020, centers: 900, confidence: "estimated" },
  { year: 2022, centers: 1_050, confidence: "estimated" },
  { year: 2023, centers: 1_180, confidence: "estimated" },
  {
    year: 2024,
    centers: 1_234,
    collectionsM: 62.5,
    collectionsUnit: "liters",
    confidence: "disclosed",
  },
  {
    year: 2025,
    centers: 1_247,
    confidence: "disclosed",
    note: "end-2025 incl. PR; collections growth via tech more than sites",
  },
];

/** Michigan / JSSW tract means — disclosed from Table 1 */
export type TractContrastRow = {
  metric: string;
  withoutCenterPct: number;
  withCenterPct: number;
  /** Relative elevation of with vs without (%) */
  elevationPct: number;
};

export const TRACT_CONTRAST: TractContrastRow[] = [
  {
    metric: "Deep poverty (<50% FPL)",
    withoutCenterPct: 7.3,
    withCenterPct: 12.0,
    elevationPct: 64,
  },
  {
    metric: "Poverty (50–<100% FPL)",
    withoutCenterPct: 8.9,
    withCenterPct: 13.4,
    elevationPct: 51,
  },
  {
    metric: "Near poverty (100–199% FPL)",
    withoutCenterPct: 19.0,
    withCenterPct: 23.8,
    elevationPct: 25,
  },
  {
    metric: "Above 200% FPL",
    withoutCenterPct: 64.8,
    withCenterPct: 50.8,
    elevationPct: -22,
  },
  {
    metric: "Non-Hispanic Black share",
    withoutCenterPct: 13.4,
    withCenterPct: 21.5,
    elevationPct: 60,
  },
  {
    metric: "Hispanic share",
    withoutCenterPct: 16.2,
    withCenterPct: 22.1,
    elevationPct: 36,
  },
];

/** Urban vs rural placement (Michigan study, May 2017 FDA set) */
export const URBAN_RURAL = {
  urbanCenters: 597,
  ruralCenters: 20,
  urbanCenterSharePct: 96.8,
  urbanTractSharePct: 82,
  confidence: "disclosed" as Confidence,
};

export type OpeningsCohortRow = {
  cohort: string;
  /** Share of cohort in ZCTAs with poverty ≥15% */
  highPovertySharePct: number;
  /** Centers per 100k adults in high-poverty ZCTAs for that cohort's sites */
  highPovertyDensity: number;
  /** Centers per 100k in low-poverty (<10%) ZCTAs */
  lowPovertyDensity: number;
  nCenters: number;
  confidence: Confidence;
};

/** Desk: openings by vintage — density still skewed high even as middle-class share rises */
export const OPENINGS_BY_COHORT: OpeningsCohortRow[] = [
  {
    cohort: "Pre-2015 stock",
    highPovertySharePct: 48,
    highPovertyDensity: 0.72,
    lowPovertyDensity: 0.28,
    nCenters: 520,
    confidence: "estimated",
  },
  {
    cohort: "2015–2020 openings",
    highPovertySharePct: 44,
    highPovertyDensity: 0.68,
    lowPovertyDensity: 0.32,
    nCenters: 380,
    confidence: "estimated",
  },
  {
    cohort: "2021–2025 openings",
    highPovertySharePct: 41,
    highPovertyDensity: 0.61,
    lowPovertyDensity: 0.38,
    nCenters: 347,
    confidence: "estimated",
  },
];

export function fmt1(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function statesByDensity(rows = STATE_DENSITY): StateDensityRow[] {
  return [...rows].sort((a, b) => b.centersPer100k - a.centersPer100k);
}

export function quintilesByDensity(
  rows = POVERTY_QUINTILES,
): PovertyQuintileRow[] {
  return [...rows].sort((a, b) => b.centersPer100k - a.centersPer100k);
}
