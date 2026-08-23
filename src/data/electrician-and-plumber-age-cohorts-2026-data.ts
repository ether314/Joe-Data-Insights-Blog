/**
 * Electrician and plumber age cohorts (2026).
 *
 * Core question: Which states have the oldest electrician/plumber cohorts,
 * and how do their licensure pipelines compare?
 *
 * Anchors: BLS CPS A-11b 2024 age bands (national); BLS OEWS May 2023 state
 * employment (SOC 47-2111, 47-2152); ACS 5-year occupation×age microdata
 * synthesised for state 55+ shares; state contractor-board license issuance
 * and exam pass rates where disclosed.
 */

export type Confidence = "disclosed" | "estimated" | "carried";
export type TradeId = "electrician" | "plumber";
export type Region = "Northeast" | "Midwest" | "South" | "West";

export const SOURCE_NOTE =
  "National age bands are BLS CPS 2024 annual averages (Table A-11b) for Electricians and Plumbers/pipefitters/steamfitters — disclosed counts in thousands. State employment is May 2023 OEWS (47-2111, 47-2152), carried where later state cells were not re-scraped. State share aged 55+ is an ACS 2019–2023 PUMS-style synthesis: regional age structure applied to OEWS stocks, then reweighted toward disclosed contractor-board age or census PUMS cells for ME, VT, WV, NH, FL, TX, CA, NY, PA, MI. New licenses / year and first-time exam pass rates come from state board annual reports or contractor-license dashboards where published (FL DBPR, CA CSLB, TX TDLR, NY DOS, MI LARA, PA L&I anchors); remaining states estimated from OEWS employment × national license-churn proxies. Pipeline pressure = (55+ employment) / new licenses — analytical, not a regulator product. Median ages at state level are desk interpolations from share55 and national CPS medians.";

export const SOURCES = [
  {
    label: "BLS CPS — Employed persons by detailed occupation and age (A-11b, 2024)",
    url: "https://www.bls.gov/cps/data/aa2024/cpsaat11b.htm",
  },
  {
    label: "BLS OEWS — Electricians (47-2111) geographic profile",
    url: "https://www.bls.gov/oes/current/oes472111.htm",
  },
  {
    label: "BLS OEWS — Plumbers, Pipefitters, and Steamfitters (47-2152)",
    url: "https://www.bls.gov/oes/current/oes472152.htm",
  },
  {
    label: "Census ACS PUMS — occupation by age (2019–2023 5-year)",
    url: "https://www.census.gov/programs-surveys/acs/microdata.html",
  },
  {
    label: "Florida DBPR — Construction Industry Licensing Board reports",
    url: "https://www.myfloridalicense.com/DBPR/construction-industry/",
  },
  {
    label: "California CSLB — Licensing statistics",
    url: "https://www.cslb.ca.gov/",
  },
  {
    label: "Texas TDLR — Electrical & plumbing license data",
    url: "https://www.tdlr.texas.gov/",
  },
] as const;

/** National punchline figures */
export const HEADLINE = {
  /** CPS electricians total employed (thousands) */
  elecTotalK: 992,
  /** CPS plumbers total employed (thousands) */
  plumbTotalK: 636,
  /** Electrician share 55+ (%) */
  elecShare55: 18.4,
  /** Plumber share 55+ (%) */
  plumbShare55: 20.4,
  /** Electrician median age */
  elecMedianAge: 39.6,
  /** Plumber median age */
  plumbMedianAge: 40.1,
  /** Electricians aged 55–64 (thousands) */
  elec55to64K: 136,
  /** Electricians 65+ (thousands) */
  elec65plusK: 47,
  /** Plumbers 55–64 (thousands) */
  plumb55to64K: 101,
  /** Plumbers 65+ (thousands) */
  plumb65plusK: 29,
  /** Oldest electrician state share55 (ME) */
  oldestElecShare55: 27.8,
  /** Oldest plumber state share55 (WV) */
  oldestPlumbShare55: 28.4,
  /** Youngest electrician large-state share55 (TX) */
  youngestLargeElecShare55: 14.2,
  /** States with electrician share55 ≥ 24% */
  elecHotStates: 8,
  /** States with plumber share55 ≥ 24% */
  plumbHotStates: 11,
  /** National new electrician licenses / year (desk) */
  elecNewLicenses: 38_400,
  /** National new plumber licenses / year (desk) */
  plumbNewLicenses: 24_100,
  /** Median state electrician pipeline pressure (55+ / new licenses) */
  elecMedianPressure: 4.2,
  /** Median state plumber pipeline pressure */
  plumbMedianPressure: 4.8,
  /** National electrician exam pass rate proxy (%) */
  elecPassRate: 62,
  /** National plumber exam pass rate proxy (%) */
  plumbPassRate: 58,
} as const;

export type AgeBand = {
  band: string;
  electricianK: number;
  plumberK: number;
  electricianPct: number;
  plumberPct: number;
};

/** CPS A-11b 2024 — disclosed (thousands → %) */
export const NATIONAL_AGE_BANDS: AgeBand[] = [
  {
    band: "16–19",
    electricianK: 21,
    plumberK: 17,
    electricianPct: 2.1,
    plumberPct: 2.7,
  },
  {
    band: "20–24",
    electricianK: 132,
    plumberK: 67,
    electricianPct: 13.3,
    plumberPct: 10.5,
  },
  {
    band: "25–34",
    electricianK: 258,
    plumberK: 158,
    electricianPct: 26.0,
    plumberPct: 24.8,
  },
  {
    band: "35–44",
    electricianK: 223,
    plumberK: 154,
    electricianPct: 22.5,
    plumberPct: 24.2,
  },
  {
    band: "45–54",
    electricianK: 176,
    plumberK: 111,
    electricianPct: 17.7,
    plumberPct: 17.5,
  },
  {
    band: "55–64",
    electricianK: 136,
    plumberK: 101,
    electricianPct: 13.7,
    plumberPct: 15.9,
  },
  {
    band: "65+",
    electricianK: 47,
    plumberK: 29,
    electricianPct: 4.7,
    plumberPct: 4.6,
  },
];

export type StateCohortRow = {
  state: string;
  abbr: string;
  region: Region;
  trade: TradeId;
  /** OEWS employment */
  employment: number;
  /** Share of employment aged 55+ (%) */
  share55: number;
  /** Desk median age */
  medianAge: number;
  /** New licenses issued (latest disclosed / estimated year) */
  newLicenses: number;
  /** First-time exam pass rate (%) */
  examPassRate: number;
  /** Typical apprenticeship years to journeyman */
  apprenticeYears: number;
  /** Pipeline pressure: 55+ headcount / new licenses */
  pipelinePressure: number;
  confidence: Confidence;
  note?: string;
};

function pressure(employment: number, share55: number, newLicenses: number): number {
  if (newLicenses <= 0) return 99;
  const nearRetire = (employment * share55) / 100;
  return Math.round((nearRetire / newLicenses) * 10) / 10;
}

/**
 * Top employment states + aging outliers. OEWS employment disclosed;
 * share55 / license fields marked per-row.
 */
export const STATE_COHORTS: StateCohortRow[] = [
  // —— Electricians ——
  {
    state: "Maine",
    abbr: "ME",
    region: "Northeast",
    trade: "electrician",
    employment: 3_420,
    share55: 27.8,
    medianAge: 46.2,
    newLicenses: 95,
    examPassRate: 58,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
    note: "ACS PUMS + state board age cut — oldest electrician cohort in sample",
  },
  {
    state: "Vermont",
    abbr: "VT",
    region: "Northeast",
    trade: "electrician",
    employment: 1_680,
    share55: 26.9,
    medianAge: 45.8,
    newLicenses: 48,
    examPassRate: 61,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
  },
  {
    state: "West Virginia",
    abbr: "WV",
    region: "South",
    trade: "electrician",
    employment: 2_910,
    share55: 26.4,
    medianAge: 45.4,
    newLicenses: 72,
    examPassRate: 55,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
  },
  {
    state: "New Hampshire",
    abbr: "NH",
    region: "Northeast",
    trade: "electrician",
    employment: 3_050,
    share55: 25.6,
    medianAge: 44.9,
    newLicenses: 88,
    examPassRate: 63,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Rhode Island",
    abbr: "RI",
    region: "Northeast",
    trade: "electrician",
    employment: 2_240,
    share55: 24.8,
    medianAge: 44.4,
    newLicenses: 70,
    examPassRate: 60,
    apprenticeYears: 5,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Connecticut",
    abbr: "CT",
    region: "Northeast",
    trade: "electrician",
    employment: 7_820,
    share55: 24.1,
    medianAge: 44.0,
    newLicenses: 210,
    examPassRate: 59,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    region: "Northeast",
    trade: "electrician",
    employment: 21_200,
    share55: 23.2,
    medianAge: 43.5,
    newLicenses: 620,
    examPassRate: 64,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
    note: "PA L&I apprentice + license tables reweight ACS share",
  },
  {
    state: "Michigan",
    abbr: "MI",
    region: "Midwest",
    trade: "electrician",
    employment: 18_400,
    share55: 22.6,
    medianAge: 43.1,
    newLicenses: 580,
    examPassRate: 66,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
  },
  {
    state: "Ohio",
    abbr: "OH",
    region: "Midwest",
    trade: "electrician",
    employment: 24_430,
    share55: 22.1,
    medianAge: 42.8,
    newLicenses: 710,
    examPassRate: 65,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "New York",
    abbr: "NY",
    region: "Northeast",
    trade: "electrician",
    employment: 40_670,
    share55: 21.8,
    medianAge: 42.6,
    newLicenses: 1_050,
    examPassRate: 57,
    apprenticeYears: 5,
    pipelinePressure: 0,
    confidence: "disclosed",
    note: "NY DOS / NYC DOB license volume; exam gate tighter than South peers",
  },
  {
    state: "Illinois",
    abbr: "IL",
    region: "Midwest",
    trade: "electrician",
    employment: 21_890,
    share55: 21.4,
    medianAge: 42.3,
    newLicenses: 640,
    examPassRate: 63,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    region: "Northeast",
    trade: "electrician",
    employment: 14_100,
    share55: 21.0,
    medianAge: 42.1,
    newLicenses: 420,
    examPassRate: 61,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Wisconsin",
    abbr: "WI",
    region: "Midwest",
    trade: "electrician",
    employment: 12_400,
    share55: 20.8,
    medianAge: 41.9,
    newLicenses: 390,
    examPassRate: 68,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "New Jersey",
    abbr: "NJ",
    region: "Northeast",
    trade: "electrician",
    employment: 14_200,
    share55: 20.2,
    medianAge: 41.5,
    newLicenses: 410,
    examPassRate: 58,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Washington",
    abbr: "WA",
    region: "West",
    trade: "electrician",
    employment: 18_820,
    share55: 19.1,
    medianAge: 40.8,
    newLicenses: 720,
    examPassRate: 70,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "California",
    abbr: "CA",
    region: "West",
    trade: "electrician",
    employment: 72_880,
    share55: 17.6,
    medianAge: 39.8,
    newLicenses: 2_850,
    examPassRate: 54,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
    note: "CSLB C-10 issuance; large stock, mid-pack age",
  },
  {
    state: "Virginia",
    abbr: "VA",
    region: "South",
    trade: "electrician",
    employment: 15_600,
    share55: 17.2,
    medianAge: 39.5,
    newLicenses: 580,
    examPassRate: 64,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "North Carolina",
    abbr: "NC",
    region: "South",
    trade: "electrician",
    employment: 16_900,
    share55: 16.4,
    medianAge: 38.9,
    newLicenses: 710,
    examPassRate: 67,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Georgia",
    abbr: "GA",
    region: "South",
    trade: "electrician",
    employment: 17_800,
    share55: 15.8,
    medianAge: 38.5,
    newLicenses: 780,
    examPassRate: 66,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Florida",
    abbr: "FL",
    region: "South",
    trade: "electrician",
    employment: 46_600,
    share55: 15.1,
    medianAge: 38.0,
    newLicenses: 2_120,
    examPassRate: 69,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
    note: "DBPR electrical contractor + journeyman issuance; young relative to Northeast",
  },
  {
    state: "Arizona",
    abbr: "AZ",
    region: "West",
    trade: "electrician",
    employment: 14_500,
    share55: 14.8,
    medianAge: 37.8,
    newLicenses: 640,
    examPassRate: 65,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Texas",
    abbr: "TX",
    region: "South",
    trade: "electrician",
    employment: 70_580,
    share55: 14.2,
    medianAge: 37.4,
    newLicenses: 3_200,
    examPassRate: 71,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
    note: "TDLR electrical license volume — youngest large-state cohort",
  },
  {
    state: "Colorado",
    abbr: "CO",
    region: "West",
    trade: "electrician",
    employment: 12_100,
    share55: 14.0,
    medianAge: 37.2,
    newLicenses: 520,
    examPassRate: 68,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Utah",
    abbr: "UT",
    region: "West",
    trade: "electrician",
    employment: 8_200,
    share55: 12.6,
    medianAge: 36.1,
    newLicenses: 410,
    examPassRate: 72,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },

  // —— Plumbers ——
  {
    state: "West Virginia",
    abbr: "WV",
    region: "South",
    trade: "plumber",
    employment: 1_820,
    share55: 28.4,
    medianAge: 46.8,
    newLicenses: 42,
    examPassRate: 52,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
    note: "Oldest plumber cohort in sample",
  },
  {
    state: "Maine",
    abbr: "ME",
    region: "Northeast",
    trade: "plumber",
    employment: 2_140,
    share55: 27.2,
    medianAge: 46.1,
    newLicenses: 58,
    examPassRate: 56,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
  },
  {
    state: "Vermont",
    abbr: "VT",
    region: "Northeast",
    trade: "plumber",
    employment: 1_050,
    share55: 26.8,
    medianAge: 45.9,
    newLicenses: 28,
    examPassRate: 58,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
  },
  {
    state: "New Hampshire",
    abbr: "NH",
    region: "Northeast",
    trade: "plumber",
    employment: 1_980,
    share55: 25.9,
    medianAge: 45.3,
    newLicenses: 55,
    examPassRate: 60,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Rhode Island",
    abbr: "RI",
    region: "Northeast",
    trade: "plumber",
    employment: 1_460,
    share55: 25.1,
    medianAge: 44.8,
    newLicenses: 42,
    examPassRate: 55,
    apprenticeYears: 5,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Connecticut",
    abbr: "CT",
    region: "Northeast",
    trade: "plumber",
    employment: 5_120,
    share55: 24.6,
    medianAge: 44.5,
    newLicenses: 140,
    examPassRate: 57,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    region: "Northeast",
    trade: "plumber",
    employment: 13_800,
    share55: 24.0,
    medianAge: 44.1,
    newLicenses: 380,
    examPassRate: 61,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
  },
  {
    state: "Michigan",
    abbr: "MI",
    region: "Midwest",
    trade: "plumber",
    employment: 11_200,
    share55: 23.4,
    medianAge: 43.7,
    newLicenses: 340,
    examPassRate: 63,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
  },
  {
    state: "Ohio",
    abbr: "OH",
    region: "Midwest",
    trade: "plumber",
    employment: 14_600,
    share55: 22.8,
    medianAge: 43.3,
    newLicenses: 420,
    examPassRate: 62,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "New York",
    abbr: "NY",
    region: "Northeast",
    trade: "plumber",
    employment: 24_500,
    share55: 22.4,
    medianAge: 43.0,
    newLicenses: 620,
    examPassRate: 54,
    apprenticeYears: 5,
    pipelinePressure: 0,
    confidence: "disclosed",
  },
  {
    state: "Illinois",
    abbr: "IL",
    region: "Midwest",
    trade: "plumber",
    employment: 13_400,
    share55: 22.0,
    medianAge: 42.7,
    newLicenses: 390,
    examPassRate: 60,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    region: "Northeast",
    trade: "plumber",
    employment: 9_800,
    share55: 21.6,
    medianAge: 42.4,
    newLicenses: 280,
    examPassRate: 58,
    apprenticeYears: 5,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Wisconsin",
    abbr: "WI",
    region: "Midwest",
    trade: "plumber",
    employment: 8_100,
    share55: 21.2,
    medianAge: 42.1,
    newLicenses: 250,
    examPassRate: 65,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "New Jersey",
    abbr: "NJ",
    region: "Northeast",
    trade: "plumber",
    employment: 9_200,
    share55: 20.8,
    medianAge: 41.8,
    newLicenses: 260,
    examPassRate: 56,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Washington",
    abbr: "WA",
    region: "West",
    trade: "plumber",
    employment: 11_600,
    share55: 19.6,
    medianAge: 41.0,
    newLicenses: 420,
    examPassRate: 67,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "California",
    abbr: "CA",
    region: "West",
    trade: "plumber",
    employment: 48_200,
    share55: 18.8,
    medianAge: 40.4,
    newLicenses: 1_680,
    examPassRate: 52,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
    note: "CSLB C-36; pass rate among lowest large states",
  },
  {
    state: "Virginia",
    abbr: "VA",
    region: "South",
    trade: "plumber",
    employment: 10_400,
    share55: 18.2,
    medianAge: 40.0,
    newLicenses: 360,
    examPassRate: 61,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "North Carolina",
    abbr: "NC",
    region: "South",
    trade: "plumber",
    employment: 11_800,
    share55: 17.4,
    medianAge: 39.4,
    newLicenses: 450,
    examPassRate: 64,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Georgia",
    abbr: "GA",
    region: "South",
    trade: "plumber",
    employment: 12_200,
    share55: 16.8,
    medianAge: 39.0,
    newLicenses: 490,
    examPassRate: 63,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Florida",
    abbr: "FL",
    region: "South",
    trade: "plumber",
    employment: 28_400,
    share55: 16.2,
    medianAge: 38.6,
    newLicenses: 1_240,
    examPassRate: 66,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
  },
  {
    state: "Arizona",
    abbr: "AZ",
    region: "West",
    trade: "plumber",
    employment: 9_600,
    share55: 15.6,
    medianAge: 38.2,
    newLicenses: 400,
    examPassRate: 62,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Texas",
    abbr: "TX",
    region: "South",
    trade: "plumber",
    employment: 42_800,
    share55: 15.0,
    medianAge: 37.8,
    newLicenses: 1_920,
    examPassRate: 68,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "disclosed",
  },
  {
    state: "Colorado",
    abbr: "CO",
    region: "West",
    trade: "plumber",
    employment: 8_400,
    share55: 14.6,
    medianAge: 37.5,
    newLicenses: 340,
    examPassRate: 65,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
  {
    state: "Utah",
    abbr: "UT",
    region: "West",
    trade: "plumber",
    employment: 5_600,
    share55: 13.2,
    medianAge: 36.4,
    newLicenses: 280,
    examPassRate: 70,
    apprenticeYears: 4,
    pipelinePressure: 0,
    confidence: "estimated",
  },
].map((row) => ({
  ...row,
  pipelinePressure: pressure(row.employment, row.share55, row.newLicenses),
})) as StateCohortRow[];

export type RegionAgeRow = {
  region: Region;
  electricianShare55: number;
  plumberShare55: number;
  electricianEmployment: number;
  plumberEmployment: number;
  electricianPassRate: number;
  plumberPassRate: number;
};

/** Employment-weighted regional rollups from STATE_COHORTS */
export const REGION_ROLLUP: RegionAgeRow[] = (
  ["Northeast", "Midwest", "South", "West"] as Region[]
).map((region) => {
  const elec = STATE_COHORTS.filter((r) => r.region === region && r.trade === "electrician");
  const plumb = STATE_COHORTS.filter((r) => r.region === region && r.trade === "plumber");
  const eEmp = elec.reduce((s, r) => s + r.employment, 0);
  const pEmp = plumb.reduce((s, r) => s + r.employment, 0);
  const eShare =
    eEmp > 0
      ? elec.reduce((s, r) => s + r.share55 * r.employment, 0) / eEmp
      : 0;
  const pShare =
    pEmp > 0
      ? plumb.reduce((s, r) => s + r.share55 * r.employment, 0) / pEmp
      : 0;
  const ePass =
    eEmp > 0
      ? elec.reduce((s, r) => s + r.examPassRate * r.employment, 0) / eEmp
      : 0;
  const pPass =
    pEmp > 0
      ? plumb.reduce((s, r) => s + r.examPassRate * r.employment, 0) / pEmp
      : 0;
  return {
    region,
    electricianShare55: Math.round(eShare * 10) / 10,
    plumberShare55: Math.round(pShare * 10) / 10,
    electricianEmployment: eEmp,
    plumberEmployment: pEmp,
    electricianPassRate: Math.round(ePass),
    plumberPassRate: Math.round(pPass),
  };
});

/** License issuance path — national desk totals by year */
export const LICENSE_TREND = [
  { year: 2018, electrician: 31_200, plumber: 19_800 },
  { year: 2019, electrician: 32_800, plumber: 20_600 },
  { year: 2020, electrician: 28_400, plumber: 17_900 },
  { year: 2021, electrician: 34_100, plumber: 21_200 },
  { year: 2022, electrician: 36_200, plumber: 22_400 },
  { year: 2023, electrician: 37_500, plumber: 23_200 },
  { year: 2024, electrician: 38_400, plumber: 24_100 },
] as const;

export type PipelineScatterPoint = {
  abbr: string;
  state: string;
  trade: TradeId;
  share55: number;
  pipelinePressure: number;
  examPassRate: number;
  employment: number;
  region: Region;
};

export const PIPELINE_SCATTER: PipelineScatterPoint[] = STATE_COHORTS.map((r) => ({
  abbr: r.abbr,
  state: r.state,
  trade: r.trade,
  share55: r.share55,
  pipelinePressure: r.pipelinePressure,
  examPassRate: r.examPassRate,
  employment: r.employment,
  region: r.region,
}));

export const ANALYTICS = {
  elecShare55: HEADLINE.elecShare55,
  plumbShare55: HEADLINE.plumbShare55,
  shareGapPp: Math.round((HEADLINE.plumbShare55 - HEADLINE.elecShare55) * 10) / 10,
  oldestElec: "Maine",
  oldestElecShare55: HEADLINE.oldestElecShare55,
  oldestPlumb: "West Virginia",
  oldestPlumbShare55: HEADLINE.oldestPlumbShare55,
  youngestLargeElec: "Texas",
  youngestLargeElecShare55: HEADLINE.youngestLargeElecShare55,
  northeastElecShare55: REGION_ROLLUP.find((r) => r.region === "Northeast")!
    .electricianShare55,
  southElecShare55: REGION_ROLLUP.find((r) => r.region === "South")!.electricianShare55,
  regionGapPp:
    Math.round(
      (REGION_ROLLUP.find((r) => r.region === "Northeast")!.electricianShare55 -
        REGION_ROLLUP.find((r) => r.region === "South")!.electricianShare55) *
        10
    ) / 10,
  highPressureElecStates: STATE_COHORTS.filter(
    (r) => r.trade === "electrician" && r.pipelinePressure >= 6
  ).length,
  highPressurePlumbStates: STATE_COHORTS.filter(
    (r) => r.trade === "plumber" && r.pipelinePressure >= 6
  ).length,
  sampleStates: STATE_COHORTS.filter((r) => r.trade === "electrician").length,
} as const;

export function cohortsForTrade(trade: TradeId): StateCohortRow[] {
  return STATE_COHORTS.filter((r) => r.trade === trade);
}

export function topAgingStates(trade: TradeId, n = 10): StateCohortRow[] {
  return [...cohortsForTrade(trade)].sort((a, b) => b.share55 - a.share55).slice(0, n);
}
