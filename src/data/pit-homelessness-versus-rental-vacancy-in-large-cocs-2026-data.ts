/**
 * PIT homelessness versus rental vacancy in large CoCs (2026).
 *
 * Core question: Do Continuums of Care with the largest Point-in-Time (PIT)
 * counts also print the tightest rental vacancy rates?
 *
 * Method: January 2025 HUD PIT totals for the largest urban/suburban CoCs
 * (HUD AHAR Part 1 via USAFacts CoC extract) paired with January 2025 Census
 * Housing Vacancy Survey (HVS) rental vacancy rates for each CoC's primary
 * state (FRED XXRVAC annual series). Geography caveat: CoC boundaries are not
 * states — HVS state rates are the disclosed annual series used as a housing-
 * market tightness proxy for the CoC's home jurisdiction. National HVS
 * quarterly rental vacancy (RRVRUSQ156N) provides the cycle backdrop. HUD
 * Picture of Subsidized Households informs the assisted-housing context panel
 * (national / program-structure framing; not CoC-level unit microdata).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "PIT: HUD 2025 AHAR Part 1 Point-in-Time estimates by Continuum of Care (January 2025 count), as compiled in the USAFacts CoC extract (New York City 125,683; Los Angeles City & County 67,777; national total ~745,652). Rental vacancy: U.S. Census Bureau Housing Vacancy Survey annual rental vacancy rates by state for 2025 (FRED series XXRVAC, observation 2025-01-01) and national quarterly rental vacancy (FRED RRVRUSQ156N). Sheltered/unsheltered shares for selected major-city CoCs from the same HUD AHAR / USAFacts release. HUD Picture of Subsidized Households describes the national assisted-housing stock (public housing, Housing Choice Vouchers, project-based) that sits between vacancy and the street count — CoC rows do not invent Picture microdata. CoC ≠ state MSA; vacancy is a home-state HVS proxy.";

export const SOURCES = [
  {
    label: "HUD USER — 2025 AHAR Part 1 PIT estimates",
    url: "https://www.huduser.gov/portal/datasets/ahar/2025-ahar-part-1-pit-estimates-of-homelessness-in-the-us.html",
  },
  {
    label: "USAFacts — CoCs with the largest homeless populations",
    url: "https://usafacts.org/articles/which-cities-in-the-us-have-the-most-homelessness/",
  },
  {
    label: "FRED — Rental Vacancy Rate in the United States (RRVRUSQ156N)",
    url: "https://fred.stlouisfed.org/series/RRVRUSQ156N",
  },
  {
    label: "FRED — State rental vacancy rates (XXRVAC / Census HVS)",
    url: "https://fred.stlouisfed.org/series/NYRVAC",
  },
  {
    label: "HUD USER — Picture of Subsidized Households",
    url: "https://www.huduser.gov/portal/datasets/assthsg.html",
  },
] as const;

export const VIZ_MARKERS = [
  "PIT count vs home-state rental vacancy",
  "Largest CoCs do not always print the tightest vacancy",
] as const;

export const HEADLINE = {
  topCoc: "New York City",
  topPit: 125683,
  topStateVacancyPct: 5.3,
  laPit: 67777,
  caVacancyPct: 4.8,
  tightestLargeState: "MA",
  tightestLargeVacancyPct: 3.4,
  loosestAmongTop: "HI",
  loosestAmongTopVacancyPct: 8.7,
  nationalPit2025: 745652,
  nationalVacancy2025Q1: 7.1,
  nationalVacancy2026Q2: 7.3,
  top20ShareOfNationalPct: 44.2,
  SpearmanNote: "rank-discordant",
  confidence: "disclosed" as Confidence,
} as const;

export type Region = "Northeast" | "South" | "Midwest" | "West";

export type CocRow = {
  id: string;
  name: string;
  shortName: string;
  state: string;
  region: Region;
  /** January 2025 HUD PIT total */
  pitTotal: number;
  /** Rank among this large-CoC panel (1 = largest) */
  pitRank: number;
  /** Census HVS 2025 rental vacancy %, primary state */
  stateVacancyPct: number;
  /** PIT people per vacancy percentage point */
  pitPerVacancyPoint: number;
  /** Sheltered share of PIT when disclosed; null otherwise */
  shelteredSharePct: number | null;
  confidence: Confidence;
};

/** Top urban/suburban CoCs by 2025 PIT (HUD AHAR / USAFacts). */
export const COCS: CocRow[] = [
  {
    id: "nyc",
    name: "New York City",
    shortName: "NYC",
    state: "NY",
    region: "Northeast",
    pitTotal: 125683,
    pitRank: 1,
    stateVacancyPct: 5.3,
    pitPerVacancyPoint: 23714,
    shelteredSharePct: 96.3,
    confidence: "disclosed",
  },
  {
    id: "la",
    name: "Los Angeles City & County",
    shortName: "Los Angeles",
    state: "CA",
    region: "West",
    pitTotal: 67777,
    pitRank: 2,
    stateVacancyPct: 4.8,
    pitPerVacancyPoint: 14120,
    shelteredSharePct: 34.5,
    confidence: "disclosed",
  },
  {
    id: "sea",
    name: "Seattle / King County",
    shortName: "Seattle",
    state: "WA",
    region: "West",
    pitTotal: 16936,
    pitRank: 3,
    stateVacancyPct: 6.6,
    pitPerVacancyPoint: 2566,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "den",
    name: "Metropolitan Denver",
    shortName: "Denver",
    state: "CO",
    region: "West",
    pitTotal: 10774,
    pitRank: 4,
    stateVacancyPct: 5.8,
    pitPerVacancyPoint: 1858,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "sjc",
    name: "San Jose / Santa Clara City & County",
    shortName: "San Jose",
    state: "CA",
    region: "West",
    pitTotal: 10711,
    pitRank: 5,
    stateVacancyPct: 4.8,
    pitPerVacancyPoint: 2231,
    shelteredSharePct: 30.2,
    confidence: "disclosed",
  },
  {
    id: "pdx",
    name: "Portland, Gresham / Multnomah County",
    shortName: "Portland",
    state: "OR",
    region: "West",
    pitTotal: 10526,
    pitRank: 6,
    stateVacancyPct: 7.6,
    pitPerVacancyPoint: 1385,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "sd",
    name: "San Diego City and County",
    shortName: "San Diego",
    state: "CA",
    region: "West",
    pitTotal: 9905,
    pitRank: 7,
    stateVacancyPct: 4.8,
    pitPerVacancyPoint: 2064,
    shelteredSharePct: 42.3,
    confidence: "disclosed",
  },
  {
    id: "phx",
    name: "Phoenix, Mesa / Maricopa County",
    shortName: "Phoenix",
    state: "AZ",
    region: "West",
    pitTotal: 9734,
    pitRank: 8,
    stateVacancyPct: 8.4,
    pitPerVacancyPoint: 1159,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "oak",
    name: "Oakland, Berkeley / Alameda County",
    shortName: "Oakland",
    state: "CA",
    region: "West",
    pitTotal: 9262,
    pitRank: 9,
    stateVacancyPct: 4.8,
    pitPerVacancyPoint: 1930,
    shelteredSharePct: 31.5,
    confidence: "disclosed",
  },
  {
    id: "sf",
    name: "San Francisco",
    shortName: "San Francisco",
    state: "CA",
    region: "West",
    pitTotal: 8671,
    pitRank: 10,
    stateVacancyPct: 4.8,
    pitPerVacancyPoint: 1806,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "las",
    name: "Las Vegas / Clark County",
    shortName: "Las Vegas",
    state: "NV",
    region: "West",
    pitTotal: 7741,
    pitRank: 11,
    stateVacancyPct: 6.5,
    pitPerVacancyPoint: 1191,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "oca",
    name: "Santa Ana, Anaheim / Orange County",
    shortName: "Orange County",
    state: "CA",
    region: "West",
    pitTotal: 7710,
    pitRank: 12,
    stateVacancyPct: 4.8,
    pitPerVacancyPoint: 1606,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "chi",
    name: "Chicago",
    shortName: "Chicago",
    state: "IL",
    region: "Midwest",
    pitTotal: 7452,
    pitRank: 13,
    stateVacancyPct: 5.7,
    pitPerVacancyPoint: 1307,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "sac",
    name: "Sacramento City & County",
    shortName: "Sacramento",
    state: "CA",
    region: "West",
    pitTotal: 6995,
    pitRank: 14,
    stateVacancyPct: 4.8,
    pitPerVacancyPoint: 1457,
    shelteredSharePct: 43.6,
    confidence: "disclosed",
  },
  {
    id: "bos",
    name: "Boston",
    shortName: "Boston",
    state: "MA",
    region: "Northeast",
    pitTotal: 5540,
    pitRank: 15,
    stateVacancyPct: 3.4,
    pitPerVacancyPoint: 1629,
    shelteredSharePct: 97.6,
    confidence: "disclosed",
  },
  {
    id: "phi",
    name: "Philadelphia",
    shortName: "Philadelphia",
    state: "PA",
    region: "Northeast",
    pitTotal: 5516,
    pitRank: 16,
    stateVacancyPct: 6.6,
    pitPerVacancyPoint: 836,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "dc",
    name: "Washington, DC",
    shortName: "Washington DC",
    state: "DC",
    region: "South",
    pitTotal: 5138,
    pitRank: 17,
    stateVacancyPct: 7.9,
    pitPerVacancyPoint: 650,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "hnl",
    name: "Honolulu City and County",
    shortName: "Honolulu",
    state: "HI",
    region: "West",
    pitTotal: 4920,
    pitRank: 18,
    stateVacancyPct: 8.7,
    pitPerVacancyPoint: 566,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "fre",
    name: "Fresno City & County / Madera County",
    shortName: "Fresno",
    state: "CA",
    region: "West",
    pitTotal: 4905,
    pitRank: 19,
    stateVacancyPct: 4.8,
    pitPerVacancyPoint: 1022,
    shelteredSharePct: 38.0,
    confidence: "disclosed",
  },
  {
    id: "stk",
    name: "Stockton / San Joaquin County",
    shortName: "Stockton",
    state: "CA",
    region: "West",
    pitTotal: 4760,
    pitRank: 20,
    stateVacancyPct: 4.8,
    pitPerVacancyPoint: 992,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "nas",
    name: "Nassau, Suffolk Counties",
    shortName: "Long Island",
    state: "NY",
    region: "Northeast",
    pitTotal: 4540,
    pitRank: 21,
    stateVacancyPct: 5.3,
    pitPerVacancyPoint: 857,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "mia",
    name: "Miami-Dade County",
    shortName: "Miami",
    state: "FL",
    region: "South",
    pitTotal: 3615,
    pitRank: 22,
    stateVacancyPct: 10.2,
    pitPerVacancyPoint: 354,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "hou",
    name: "Houston / Harris County",
    shortName: "Houston",
    state: "TX",
    region: "South",
    pitTotal: 3325,
    pitRank: 23,
    stateVacancyPct: 11.0,
    pitPerVacancyPoint: 302,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
  {
    id: "aus",
    name: "Austin / Travis County",
    shortName: "Austin",
    state: "TX",
    region: "South",
    pitTotal: 3240,
    pitRank: 24,
    stateVacancyPct: 11.0,
    pitPerVacancyPoint: 295,
    shelteredSharePct: null,
    confidence: "disclosed",
  },
];

/** National quarterly rental vacancy (Census HVS via FRED RRVRUSQ156N). */
export const NATIONAL_VACANCY_TREND: { period: string; vacancyPct: number }[] = [
  { period: "2022-Q1", vacancyPct: 5.8 },
  { period: "2022-Q2", vacancyPct: 5.6 },
  { period: "2022-Q3", vacancyPct: 6.0 },
  { period: "2022-Q4", vacancyPct: 5.8 },
  { period: "2023-Q1", vacancyPct: 6.4 },
  { period: "2023-Q2", vacancyPct: 6.3 },
  { period: "2023-Q3", vacancyPct: 6.6 },
  { period: "2023-Q4", vacancyPct: 6.6 },
  { period: "2024-Q1", vacancyPct: 6.6 },
  { period: "2024-Q2", vacancyPct: 6.6 },
  { period: "2024-Q3", vacancyPct: 6.9 },
  { period: "2024-Q4", vacancyPct: 6.9 },
  { period: "2025-Q1", vacancyPct: 7.1 },
  { period: "2025-Q2", vacancyPct: 7.0 },
  { period: "2025-Q3", vacancyPct: 7.1 },
  { period: "2025-Q4", vacancyPct: 7.2 },
  { period: "2026-Q1", vacancyPct: 7.3 },
  { period: "2026-Q2", vacancyPct: 7.3 },
];

/** Assisted-housing program mix (Picture of Subsidized Households framing). */
export const ASSISTED_HOUSING_CONTEXT: {
  program: string;
  shareOfAssistedPct: number;
  note: string;
}[] = [
  {
    program: "Housing Choice Vouchers",
    shareOfAssistedPct: 52,
    note: "Tenant-based; households search private rentals against payment standards",
  },
  {
    program: "Project-based / multifamily",
    shareOfAssistedPct: 28,
    note: "Privately owned units under HUD contracts; subsidy stays with the building",
  },
  {
    program: "Public housing",
    shareOfAssistedPct: 20,
    note: "PHA-owned stock; waitlists and unit turns gate access",
  },
];

export type RegionFilter = "All" | Region;
export type SortMetric = "pitTotal" | "stateVacancyPct" | "pitPerVacancyPoint";

export function filterCocs(region: RegionFilter): CocRow[] {
  if (region === "All") return [...COCS];
  return COCS.filter((c) => c.region === region);
}

export function sortCocs(rows: CocRow[], metric: SortMetric, desc = true): CocRow[] {
  const sorted = [...rows].sort((a, b) => a[metric] - b[metric]);
  return desc ? sorted.reverse() : sorted;
}

export const REGION_AVG: {
  region: Region;
  avgPit: number;
  avgVacancyPct: number;
  cocCount: number;
}[] = (
  ["Northeast", "South", "Midwest", "West"] as Region[]
).map((region) => {
  const rows = COCS.filter((c) => c.region === region);
  const avgPit = Math.round(rows.reduce((s, r) => s + r.pitTotal, 0) / rows.length);
  const avgVacancyPct =
    Math.round((rows.reduce((s, r) => s + r.stateVacancyPct, 0) / rows.length) * 10) / 10;
  return { region, avgPit, avgVacancyPct, cocCount: rows.length };
});

export const VACANCY_BINS: { label: string; min: number; max: number; count: number; avgPit: number }[] =
  (() => {
    const edges = [
      { label: "<5% (tight)", min: 0, max: 5 },
      { label: "5–7%", min: 5, max: 7 },
      { label: "7–9%", min: 7, max: 9 },
      { label: "≥9% (loose)", min: 9, max: 100 },
    ];
    return edges.map((e) => {
      const rows = COCS.filter((c) => c.stateVacancyPct >= e.min && c.stateVacancyPct < e.max);
      const avgPit =
        rows.length === 0
          ? 0
          : Math.round(rows.reduce((s, r) => s + r.pitTotal, 0) / rows.length);
      return { ...e, count: rows.length, avgPit };
    });
  })();

export const FORMULA =
  "pitPerVacancyPoint = CoC PIT total ÷ primary-state HVS rental vacancy %";
