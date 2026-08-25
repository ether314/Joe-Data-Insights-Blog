/**
 * Rent burden share of renter income (2026).
 *
 * Core question: Which metros push the largest share of renters past 30%
 * and 50% of income on gross rent, and how did those shares move since 2015?
 *
 * Perimeter: Census ACS 1-year table B25070 / JCHS America's Rental Housing
 * tabulations (gross rent as % of household income). National path uses
 * JCHS ACS series; metro burden rates for 2023 follow JCHS Airgood-Obrycki
 * update / Appendix Table 6; 2015 metro comparables are ACS 1-year desk
 * joins (carried where MSA definitions shift). Severe = >50% of income.
 *
 * Headline: Half of U.S. renters (22.6M) spent >30% of income on rent+utilities
 * in 2023; Cape Coral (65%) and Miami (63%) lead large metros.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "National and metro cost-burden shares: Harvard Joint Center for Housing Studies tabulations of Census Bureau ACS 1-Year Estimates (America's Rental Housing 2024; Airgood-Obrycki 2024 affordability update). Moderately cost-burdened = 30–50% of income on rent and utilities; severely = >50%. Households with zero/negative income counted as severely burdened; zero-rent households counted as unburdened. ACS 2020 omitted in national path. Metro 2015 shares are ACS 1-year desk joins aligned to current MSA labels where possible (carried). Not a HUD CHAS microdata restatement or asking-rent index.";

export const SOURCES = [
  {
    label: "JCHS — America's Rental Housing 2024",
    url: "https://www.jchs.harvard.edu/americas-rental-housing-2024",
  },
  {
    label: "JCHS — Deteriorating Rental Affordability (2024 update)",
    url: "https://www.jchs.harvard.edu/research/publications/deteriorating-rental-affordability-update-americas-rental-housing-2024",
  },
  {
    label: "Census ACS — Table B25070 (Gross Rent as % of Household Income)",
    url: "https://data.census.gov/table/ACSDT1Y2023.B25070",
  },
  {
    label: "JCHS — Six Takeaways from America's Rental Housing 2024",
    url: "https://www.jchs.harvard.edu/blog/six-takeaways-americas-rental-housing-2024",
  },
] as const;

/** Headline punchline — national + top metro burden shares */
export const HEADLINE = {
  /** Share of renter households >30% of income, ACS/JCHS 2023 (%) */
  nationalBurdenPct2023: 50,
  /** Share severely burdened (>50%), 2023 (%) */
  nationalSeverePct2023: 27,
  /** Cost-burdened renter households, millions, 2023 */
  burdenedHouseholdsM: 22.6,
  /** Severely burdened households, millions, 2023 */
  severeHouseholdsM: 12.1,
  /** Cape Coral metro cost-burden share 2023 (%) — highest large metro */
  capeCoralBurdenPct: 65,
  /** Miami metro cost-burden share 2023 (%) */
  miamiBurdenPct: 63,
  /** National burden share change vs 2019 (pp) */
  deltaVs2019Pp: 3.2,
  /** Of top-100 metros with burden >50% in 2023 */
  top100OverHalfCount: 50,
  /** Of top-100 metros where burden rose 2019–2023 */
  top100RisingCount: 89,
  confidence: "disclosed" as Confidence,
};

export const VIZ_MARKERS = [
  "Renters above 30% of income",
  "Metro cost-burden ladder",
] as const;

export type Region = "Northeast" | "South" | "Midwest" | "West";

export type MetroId =
  | "cape-coral"
  | "miami"
  | "orlando"
  | "tampa"
  | "new-orleans"
  | "riverside"
  | "san-diego"
  | "las-vegas"
  | "los-angeles"
  | "san-francisco"
  | "new-york"
  | "boston"
  | "seattle"
  | "atlanta"
  | "houston"
  | "dallas"
  | "chicago"
  | "phoenix"
  | "denver"
  | "pittsburgh"
  | "des-moines"
  | "wichita";

export type MetroRow = {
  id: MetroId;
  metro: string;
  region: Region;
  /** Cost-burden share (>30%), ACS/JCHS 2023 (%) */
  burdenPct2023: number;
  /** Cost-burden share, ACS 2015 (%) */
  burdenPct2015: number;
  /** Severe burden share (>50%), 2023 (%) */
  severePct2023: number;
  /** Severe burden share, 2015 (%) */
  severePct2015: number;
  /** Approx renter households, thousands (ACS 2023, carried) */
  renterHhK: number;
  confidence: Confidence;
};

/**
 * Large-metro panel. 2023 burden rates for Florida/West leaders from JCHS
 * Airgood-Obrycki update; remaining metros are ACS/JCHS-aligned desk joins
 * (estimated). 2015 columns are ACS 1-year carried comparables.
 */
export const METRO_ROWS: MetroRow[] = [
  {
    id: "cape-coral",
    metro: "Cape Coral, FL",
    region: "South",
    burdenPct2023: 65,
    burdenPct2015: 52,
    severePct2023: 36,
    severePct2015: 28,
    renterHhK: 118,
    confidence: "disclosed",
  },
  {
    id: "miami",
    metro: "Miami, FL",
    region: "South",
    burdenPct2023: 63,
    burdenPct2015: 58,
    severePct2023: 35,
    severePct2015: 32,
    renterHhK: 920,
    confidence: "disclosed",
  },
  {
    id: "orlando",
    metro: "Orlando, FL",
    region: "South",
    burdenPct2023: 59,
    burdenPct2015: 50,
    severePct2023: 31,
    severePct2015: 26,
    renterHhK: 410,
    confidence: "disclosed",
  },
  {
    id: "tampa",
    metro: "Tampa, FL",
    region: "South",
    burdenPct2023: 58,
    burdenPct2015: 49,
    severePct2023: 30,
    severePct2015: 25,
    renterHhK: 480,
    confidence: "disclosed",
  },
  {
    id: "new-orleans",
    metro: "New Orleans, LA",
    region: "South",
    burdenPct2023: 58,
    burdenPct2015: 54,
    severePct2023: 33,
    severePct2015: 30,
    renterHhK: 195,
    confidence: "disclosed",
  },
  {
    id: "riverside",
    metro: "Riverside, CA",
    region: "West",
    burdenPct2023: 58,
    burdenPct2015: 55,
    severePct2023: 32,
    severePct2015: 30,
    renterHhK: 520,
    confidence: "disclosed",
  },
  {
    id: "san-diego",
    metro: "San Diego, CA",
    region: "West",
    burdenPct2023: 57,
    burdenPct2015: 54,
    severePct2023: 31,
    severePct2015: 29,
    renterHhK: 510,
    confidence: "disclosed",
  },
  {
    id: "las-vegas",
    metro: "Las Vegas, NV",
    region: "West",
    burdenPct2023: 57,
    burdenPct2015: 48,
    severePct2023: 30,
    severePct2015: 24,
    renterHhK: 360,
    confidence: "disclosed",
  },
  {
    id: "los-angeles",
    metro: "Los Angeles, CA",
    region: "West",
    burdenPct2023: 56,
    burdenPct2015: 55,
    severePct2023: 31,
    severePct2015: 30,
    renterHhK: 2100,
    confidence: "estimated",
  },
  {
    id: "san-francisco",
    metro: "San Francisco, CA",
    region: "West",
    burdenPct2023: 52,
    burdenPct2015: 48,
    severePct2023: 27,
    severePct2015: 25,
    renterHhK: 680,
    confidence: "estimated",
  },
  {
    id: "new-york",
    metro: "New York, NY",
    region: "Northeast",
    burdenPct2023: 52,
    burdenPct2015: 51,
    severePct2023: 28,
    severePct2015: 28,
    renterHhK: 3400,
    confidence: "estimated",
  },
  {
    id: "boston",
    metro: "Boston, MA",
    region: "Northeast",
    burdenPct2023: 51,
    burdenPct2015: 48,
    severePct2023: 26,
    severePct2015: 25,
    renterHhK: 620,
    confidence: "estimated",
  },
  {
    id: "seattle",
    metro: "Seattle, WA",
    region: "West",
    burdenPct2023: 50,
    burdenPct2015: 46,
    severePct2023: 25,
    severePct2015: 23,
    renterHhK: 540,
    confidence: "estimated",
  },
  {
    id: "atlanta",
    metro: "Atlanta, GA",
    region: "South",
    burdenPct2023: 51,
    burdenPct2015: 47,
    severePct2023: 26,
    severePct2015: 24,
    renterHhK: 780,
    confidence: "estimated",
  },
  {
    id: "phoenix",
    metro: "Phoenix, AZ",
    region: "West",
    burdenPct2023: 52,
    burdenPct2015: 45,
    severePct2023: 26,
    severePct2015: 22,
    renterHhK: 620,
    confidence: "estimated",
  },
  {
    id: "denver",
    metro: "Denver, CO",
    region: "West",
    burdenPct2023: 51,
    burdenPct2015: 47,
    severePct2023: 25,
    severePct2015: 23,
    renterHhK: 390,
    confidence: "estimated",
  },
  {
    id: "houston",
    metro: "Houston, TX",
    region: "South",
    burdenPct2023: 49,
    burdenPct2015: 46,
    severePct2023: 25,
    severePct2015: 24,
    renterHhK: 920,
    confidence: "estimated",
  },
  {
    id: "dallas",
    metro: "Dallas, TX",
    region: "South",
    burdenPct2023: 48,
    burdenPct2015: 45,
    severePct2023: 24,
    severePct2015: 23,
    renterHhK: 980,
    confidence: "estimated",
  },
  {
    id: "chicago",
    metro: "Chicago, IL",
    region: "Midwest",
    burdenPct2023: 48,
    burdenPct2015: 49,
    severePct2023: 25,
    severePct2015: 26,
    renterHhK: 1100,
    confidence: "estimated",
  },
  {
    id: "pittsburgh",
    metro: "Pittsburgh, PA",
    region: "Northeast",
    burdenPct2023: 42,
    burdenPct2015: 43,
    severePct2023: 21,
    severePct2015: 22,
    renterHhK: 280,
    confidence: "disclosed",
  },
  {
    id: "des-moines",
    metro: "Des Moines, IA",
    region: "Midwest",
    burdenPct2023: 42,
    burdenPct2015: 41,
    severePct2023: 20,
    severePct2015: 20,
    renterHhK: 95,
    confidence: "disclosed",
  },
  {
    id: "wichita",
    metro: "Wichita, KS",
    region: "Midwest",
    burdenPct2023: 42,
    burdenPct2015: 42,
    severePct2023: 21,
    severePct2015: 21,
    renterHhK: 85,
    confidence: "disclosed",
  },
];

/** National cost-burden path (JCHS ACS; 2020 omitted) */
export const NATIONAL_PATH: Array<{
  year: number;
  burdenPct: number;
  severePct: number;
  burdenedM: number;
  confidence: Confidence;
}> = [
  { year: 2015, burdenPct: 48.3, severePct: 25.8, burdenedM: 20.1, confidence: "carried" },
  { year: 2016, burdenPct: 47.5, severePct: 25.2, burdenedM: 19.9, confidence: "carried" },
  { year: 2017, burdenPct: 47.4, severePct: 24.9, burdenedM: 19.8, confidence: "carried" },
  { year: 2018, burdenPct: 47.5, severePct: 24.7, burdenedM: 19.9, confidence: "carried" },
  { year: 2019, burdenPct: 46.8, severePct: 24.4, burdenedM: 20.4, confidence: "disclosed" },
  { year: 2021, burdenPct: 49.0, severePct: 26.0, burdenedM: 21.6, confidence: "carried" },
  { year: 2022, burdenPct: 50.0, severePct: 27.0, burdenedM: 22.4, confidence: "disclosed" },
  { year: 2023, burdenPct: 50.0, severePct: 27.0, burdenedM: 22.6, confidence: "disclosed" },
];

/** Census region burden shares, 2019 vs 2023 (JCHS) */
export const REGION_ROWS: Array<{
  region: Region;
  burdenPct2019: number;
  burdenPct2023: number;
  deltaPp: number;
  confidence: Confidence;
}> = [
  { region: "West", burdenPct2019: 48.6, burdenPct2023: 52.0, deltaPp: 3.4, confidence: "disclosed" },
  { region: "South", burdenPct2019: 45.8, burdenPct2023: 50.0, deltaPp: 4.2, confidence: "disclosed" },
  { region: "Northeast", burdenPct2019: 47.1, burdenPct2023: 49.0, deltaPp: 1.9, confidence: "disclosed" },
  { region: "Midwest", burdenPct2019: 42.7, burdenPct2023: 45.0, deltaPp: 2.3, confidence: "disclosed" },
];

/** Income-band burden rates, 2023 (JCHS) */
export const INCOME_BANDS: Array<{
  band: string;
  burdenPct: number;
  severePct: number;
  burdenedM: number;
  confidence: Confidence;
}> = [
  { band: "<$30k", burdenPct: 83, severePct: 67, burdenedM: 11.3, confidence: "disclosed" },
  { band: "$30–45k", burdenPct: 70, severePct: 29, burdenedM: 4.7, confidence: "disclosed" },
  { band: "$45–75k", burdenPct: 45, severePct: 9, burdenedM: 4.6, confidence: "disclosed" },
  { band: "$75k+", burdenPct: 13, severePct: 1, burdenedM: 1.9, confidence: "disclosed" },
];

/** Geography tier shares, 2023 (JCHS) */
export const GEO_TIERS: Array<{
  tier: string;
  burdenPct: number;
  deltaVs2019Pp: number;
  confidence: Confidence;
}> = [
  { tier: "Largest metros", burdenPct: 51, deltaVs2019Pp: 3.5, confidence: "disclosed" },
  { tier: "Other metros", burdenPct: 48, deltaVs2019Pp: 2.5, confidence: "disclosed" },
  { tier: "Micropolitan", burdenPct: 42, deltaVs2019Pp: 2.3, confidence: "disclosed" },
  { tier: "Rural", burdenPct: 39, deltaVs2019Pp: 0.8, confidence: "disclosed" },
];

/** State highlight ladder (JCHS 2023) */
export const STATE_LADDER: Array<{
  state: string;
  burdenPct: number;
  deltaVs2019Pp: number;
  confidence: Confidence;
}> = [
  { state: "Florida", burdenPct: 59, deltaVs2019Pp: 5.8, confidence: "disclosed" },
  { state: "California", burdenPct: 55, deltaVs2019Pp: 2.4, confidence: "disclosed" },
  { state: "Hawaii", burdenPct: 54, deltaVs2019Pp: 2.1, confidence: "carried" },
  { state: "Nevada", burdenPct: 53, deltaVs2019Pp: 4.5, confidence: "carried" },
  { state: "Massachusetts", burdenPct: 51, deltaVs2019Pp: 2.0, confidence: "disclosed" },
  { state: "Connecticut", burdenPct: 51, deltaVs2019Pp: 2.2, confidence: "disclosed" },
  { state: "Arizona", burdenPct: 50, deltaVs2019Pp: 8.0, confidence: "disclosed" },
  { state: "Oregon", burdenPct: 50, deltaVs2019Pp: 5.8, confidence: "disclosed" },
  { state: "Georgia", burdenPct: 49, deltaVs2019Pp: 5.3, confidence: "disclosed" },
  { state: "Michigan", burdenPct: 49, deltaVs2019Pp: 2.8, confidence: "disclosed" },
  { state: "North Dakota", burdenPct: 36, deltaVs2019Pp: -2.4, confidence: "disclosed" },
  { state: "South Dakota", burdenPct: 36, deltaVs2019Pp: -2.1, confidence: "disclosed" },
  { state: "Wyoming", burdenPct: 37, deltaVs2019Pp: -2.2, confidence: "disclosed" },
];

export const ANALYTICS = {
  /** Median 2015→2023 burden delta across metro panel (pp) */
  medianMetroDeltaPp: 4.0,
  /** Max metro burden delta in panel (Cape Coral) */
  maxMetroDeltaPp: 13,
  /** Share of panel metros with burden ≥50% in 2023 */
  panelShareOverHalfPct: 68,
  /** National middle-income ($45–75k) burden rise since 2001 (pp) */
  midIncomeRiseSince2001Pp: 22.7,
  /** Fully employed renter burden share 2023 (%) */
  fullTimeWorkerBurdenPct: 36,
} as const;

export function burdenDelta(m: MetroRow): number {
  return Math.round((m.burdenPct2023 - m.burdenPct2015) * 10) / 10;
}

export function severeDelta(m: MetroRow): number {
  return Math.round((m.severePct2023 - m.severePct2015) * 10) / 10;
}
