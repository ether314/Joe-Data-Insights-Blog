/**
 * High-propensity business applications vs employer firm formations (2026).
 *
 * Core question: What share of high-propensity business applications since 2020
 * converted into employing firms within ~two to three years, state by state?
 *
 * Method: Census Bureau Business Formation Statistics (BFS) via FRED mirrors.
 * High-propensity applications (HBA, seasonally adjusted monthly) and spliced
 * business formations within eight quarters (BF8Q / SBF8Q, not seasonally
 * adjusted) are summed for application months 2020-01 through 2022-12 — the
 * last full cohort with an observed eight-quarter formation window by mid-2026.
 * Desk metrics: appsPerEmployer = HBA / BF8Q; conversionPct = 100 * BF8Q / HBA.
 * BF8Q counts employer births from the full application pool (not HBA-only),
 * so conversionPct is a formation-intensity proxy relative to HBA volume,
 * not a microdata HBA transition probability. Census CES research cites ~27%
 * HBA→employer within 8 quarters historically; pandemic cohorts print softer.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";
export type Region = "Northeast" | "Midwest" | "South" | "West";

export const SOURCE_NOTE =
  "High-propensity business applications (HBA) and spliced business formations within eight quarters (BF8Q) follow U.S. Census Bureau Business Formation Statistics as published on FRED (BAHBATOTALSA* seasonally adjusted; BFSBF8QTOTALNSA* not seasonally adjusted). State and national cohort sums cover application months 2020-01–2022-12. Apps-per-employer = HBA/BF8Q; conversion proxy = BF8Q/HBA. BF8Q attributes employer births to application month for the full BA pool; it is not an HBA-only micro transition rate. January 2026 BFS annual update restated HBA (internet-sales exclusion) and refreshed formation splices against Business Dynamics Statistics. Confidence: monthly series disclosed via FRED; cohort ratios desk-computed.";

export const SOURCES = [
  {
    label: "Census — Business Formation Statistics",
    url: "https://www.census.gov/econ/bfs/index.html",
  },
  {
    label: "Census — BFS methodology (HBA / BF8Q definitions)",
    url: "https://www.census.gov/econ/bfs/technicaldocumentation/methodology.html",
  },
  {
    label: "FRED — High-propensity business applications (US)",
    url: "https://fred.stlouisfed.org/series/BAHBATOTALSAUS",
  },
  {
    label: "FRED — Business formations within 8 quarters, spliced (US)",
    url: "https://fred.stlouisfed.org/series/BFSBF8QTOTALNSAUS",
  },
  {
    label: "Census CES — Business Applications as Economic Indicators",
    url: "https://www2.census.gov/ces/wp/2021/CES-WP-21-09.pdf",
  },
  {
    label: "Census — Business Dynamics Statistics",
    url: "https://www.census.gov/programs-surveys/bds.html",
  },
] as const;

export const HEADLINE = {
  "usAppsPerEmployer": 4.38,
  "usConversionPct": 22.8,
  "cohortLabel": "2020–2022 application months",
  "lowestAppsState": "SD",
  "lowestAppsPerEmployer": 2.61,
  "highestAppsState": "MS",
  "highestAppsPerEmployer": 7.45,
  "medianAppsPerEmployer": 4.06,
  "statesAbove4": 28,
  "statesBelow3": 10,
  "usHbaCohort": 5101630,
  "usBf8qCohort": 1164486,
  "usBaCohort": 14872416,
  "hbaShareCohortPct": 34.3
} as const;

/** Historical HBA→employer within 8 quarters (Census CES working paper). */
export const CES_HBA_TRANSITION_PCT = 27;

export type StateRow = {
  code: string;
  name: string;
  region: Region;
  hba2020_22: number;
  bf8q2020_22: number;
  appsPerEmployer: number;
  conversionPct: number;
  hba2023: number;
  bf8q2023: number;
  appsPerEmployer2023: number;
  conversionPct2023: number;
};

export const STATES: StateRow[] = [
  {
    "code": "MS",
    "name": "Mississippi",
    "region": "South",
    "hba2020_22": 54150,
    "bf8q2020_22": 7265,
    "appsPerEmployer": 7.45,
    "conversionPct": 13.4,
    "hba2023": 16861,
    "bf8q2023": 2514,
    "appsPerEmployer2023": 6.71,
    "conversionPct2023": 14.9
  },
  {
    "code": "LA",
    "name": "Louisiana",
    "region": "South",
    "hba2020_22": 76232,
    "bf8q2020_22": 11563,
    "appsPerEmployer": 6.59,
    "conversionPct": 15.2,
    "hba2023": 23995,
    "bf8q2023": 3668,
    "appsPerEmployer2023": 6.54,
    "conversionPct2023": 15.3
  },
  {
    "code": "DE",
    "name": "Delaware",
    "region": "South",
    "hba2020_22": 40882,
    "bf8q2020_22": 6251,
    "appsPerEmployer": 6.54,
    "conversionPct": 15.3,
    "hba2023": 18538,
    "bf8q2023": 2889,
    "appsPerEmployer2023": 6.42,
    "conversionPct2023": 15.6
  },
  {
    "code": "GA",
    "name": "Georgia",
    "region": "South",
    "hba2020_22": 256323,
    "bf8q2020_22": 41333,
    "appsPerEmployer": 6.2,
    "conversionPct": 16.1,
    "hba2023": 85713,
    "bf8q2023": 14453,
    "appsPerEmployer2023": 5.93,
    "conversionPct2023": 16.9
  },
  {
    "code": "DC",
    "name": "District of Columbia",
    "region": "South",
    "hba2020_22": 13110,
    "bf8q2020_22": 2202,
    "appsPerEmployer": 5.95,
    "conversionPct": 16.8,
    "hba2023": 4437,
    "bf8q2023": 779,
    "appsPerEmployer2023": 5.7,
    "conversionPct2023": 17.6
  },
  {
    "code": "MD",
    "name": "Maryland",
    "region": "South",
    "hba2020_22": 95152,
    "bf8q2020_22": 16053,
    "appsPerEmployer": 5.93,
    "conversionPct": 16.9,
    "hba2023": 32332,
    "bf8q2023": 5537,
    "appsPerEmployer2023": 5.84,
    "conversionPct2023": 17.1
  },
  {
    "code": "FL",
    "name": "Florida",
    "region": "South",
    "hba2020_22": 636745,
    "bf8q2020_22": 110613,
    "appsPerEmployer": 5.76,
    "conversionPct": 17.4,
    "hba2023": 236012,
    "bf8q2023": 41403,
    "appsPerEmployer2023": 5.7,
    "conversionPct2023": 17.5
  },
  {
    "code": "WY",
    "name": "Wyoming",
    "region": "West",
    "hba2020_22": 28871,
    "bf8q2020_22": 5174,
    "appsPerEmployer": 5.58,
    "conversionPct": 17.9,
    "hba2023": 14214,
    "bf8q2023": 2755,
    "appsPerEmployer2023": 5.16,
    "conversionPct2023": 19.4
  },
  {
    "code": "IL",
    "name": "Illinois",
    "region": "Midwest",
    "hba2020_22": 206889,
    "bf8q2020_22": 37323,
    "appsPerEmployer": 5.54,
    "conversionPct": 18,
    "hba2023": 66746,
    "bf8q2023": 12954,
    "appsPerEmployer2023": 5.15,
    "conversionPct2023": 19.4
  },
  {
    "code": "HI",
    "name": "Hawaii",
    "region": "West",
    "hba2020_22": 17751,
    "bf8q2020_22": 3413,
    "appsPerEmployer": 5.2,
    "conversionPct": 19.2,
    "hba2023": 6138,
    "bf8q2023": 1161,
    "appsPerEmployer2023": 5.29,
    "conversionPct2023": 18.9
  },
  {
    "code": "MI",
    "name": "Michigan",
    "region": "Midwest",
    "hba2020_22": 128654,
    "bf8q2020_22": 25015,
    "appsPerEmployer": 5.14,
    "conversionPct": 19.4,
    "hba2023": 44560,
    "bf8q2023": 9001,
    "appsPerEmployer2023": 4.95,
    "conversionPct2023": 20.2
  },
  {
    "code": "NY",
    "name": "New York",
    "region": "Northeast",
    "hba2020_22": 362138,
    "bf8q2020_22": 71992,
    "appsPerEmployer": 5.03,
    "conversionPct": 19.9,
    "hba2023": 133268,
    "bf8q2023": 27175,
    "appsPerEmployer2023": 4.9,
    "conversionPct2023": 20.4
  },
  {
    "code": "OH",
    "name": "Ohio",
    "region": "Midwest",
    "hba2020_22": 128433,
    "bf8q2020_22": 25570,
    "appsPerEmployer": 5.02,
    "conversionPct": 19.9,
    "hba2023": 44299,
    "bf8q2023": 9161,
    "appsPerEmployer2023": 4.84,
    "conversionPct2023": 20.7
  },
  {
    "code": "AL",
    "name": "Alabama",
    "region": "South",
    "hba2020_22": 61411,
    "bf8q2020_22": 13447,
    "appsPerEmployer": 4.57,
    "conversionPct": 21.9,
    "hba2023": 21460,
    "bf8q2023": 4878,
    "appsPerEmployer2023": 4.4,
    "conversionPct2023": 22.7
  },
  {
    "code": "TN",
    "name": "Tennessee",
    "region": "South",
    "hba2020_22": 92404,
    "bf8q2020_22": 20597,
    "appsPerEmployer": 4.49,
    "conversionPct": 22.3,
    "hba2023": 33682,
    "bf8q2023": 7709,
    "appsPerEmployer2023": 4.37,
    "conversionPct2023": 22.9
  },
  {
    "code": "PA",
    "name": "Pennsylvania",
    "region": "Northeast",
    "hba2020_22": 137326,
    "bf8q2020_22": 31161,
    "appsPerEmployer": 4.41,
    "conversionPct": 22.7,
    "hba2023": 49725,
    "bf8q2023": 11545,
    "appsPerEmployer2023": 4.31,
    "conversionPct2023": 23.2
  },
  {
    "code": "NJ",
    "name": "New Jersey",
    "region": "Northeast",
    "hba2020_22": 137637,
    "bf8q2020_22": 31438,
    "appsPerEmployer": 4.38,
    "conversionPct": 22.8,
    "hba2023": 48909,
    "bf8q2023": 11294,
    "appsPerEmployer2023": 4.33,
    "conversionPct2023": 23.1
  },
  {
    "code": "SC",
    "name": "South Carolina",
    "region": "South",
    "hba2020_22": 74897,
    "bf8q2020_22": 17189,
    "appsPerEmployer": 4.36,
    "conversionPct": 23,
    "hba2023": 27518,
    "bf8q2023": 6296,
    "appsPerEmployer2023": 4.37,
    "conversionPct2023": 22.9
  },
  {
    "code": "OK",
    "name": "Oklahoma",
    "region": "South",
    "hba2020_22": 51404,
    "bf8q2020_22": 11955,
    "appsPerEmployer": 4.3,
    "conversionPct": 23.3,
    "hba2023": 19127,
    "bf8q2023": 4412,
    "appsPerEmployer2023": 4.34,
    "conversionPct2023": 23.1
  },
  {
    "code": "VA",
    "name": "Virginia",
    "region": "South",
    "hba2020_22": 111540,
    "bf8q2020_22": 26094,
    "appsPerEmployer": 4.27,
    "conversionPct": 23.4,
    "hba2023": 41715,
    "bf8q2023": 9494,
    "appsPerEmployer2023": 4.39,
    "conversionPct2023": 22.8
  },
  {
    "code": "IN",
    "name": "Indiana",
    "region": "Midwest",
    "hba2020_22": 77867,
    "bf8q2020_22": 18507,
    "appsPerEmployer": 4.21,
    "conversionPct": 23.8,
    "hba2023": 30364,
    "bf8q2023": 7146,
    "appsPerEmployer2023": 4.25,
    "conversionPct2023": 23.5
  },
  {
    "code": "AR",
    "name": "Arkansas",
    "region": "South",
    "hba2020_22": 37435,
    "bf8q2020_22": 8956,
    "appsPerEmployer": 4.18,
    "conversionPct": 23.9,
    "hba2023": 13059,
    "bf8q2023": 3173,
    "appsPerEmployer2023": 4.12,
    "conversionPct2023": 24.3
  },
  {
    "code": "CO",
    "name": "Colorado",
    "region": "West",
    "hba2020_22": 108379,
    "bf8q2020_22": 26105,
    "appsPerEmployer": 4.15,
    "conversionPct": 24.1,
    "hba2023": 47398,
    "bf8q2023": 9830,
    "appsPerEmployer2023": 4.82,
    "conversionPct2023": 20.7
  },
  {
    "code": "CT",
    "name": "Connecticut",
    "region": "Northeast",
    "hba2020_22": 39146,
    "bf8q2020_22": 9512,
    "appsPerEmployer": 4.12,
    "conversionPct": 24.3,
    "hba2023": 14560,
    "bf8q2023": 3553,
    "appsPerEmployer2023": 4.1,
    "conversionPct2023": 24.4
  },
  {
    "code": "NM",
    "name": "New Mexico",
    "region": "West",
    "hba2020_22": 22574,
    "bf8q2020_22": 5566,
    "appsPerEmployer": 4.06,
    "conversionPct": 24.7,
    "hba2023": 10006,
    "bf8q2023": 2193,
    "appsPerEmployer2023": 4.56,
    "conversionPct2023": 21.9
  },
  {
    "code": "NC",
    "name": "North Carolina",
    "region": "South",
    "hba2020_22": 152869,
    "bf8q2020_22": 37637,
    "appsPerEmployer": 4.06,
    "conversionPct": 24.6,
    "hba2023": 55033,
    "bf8q2023": 13937,
    "appsPerEmployer2023": 3.95,
    "conversionPct2023": 25.3
  },
  {
    "code": "TX",
    "name": "Texas",
    "region": "South",
    "hba2020_22": 443710,
    "bf8q2020_22": 109978,
    "appsPerEmployer": 4.03,
    "conversionPct": 24.8,
    "hba2023": 162224,
    "bf8q2023": 41538,
    "appsPerEmployer2023": 3.91,
    "conversionPct2023": 25.6
  },
  {
    "code": "KY",
    "name": "Kentucky",
    "region": "South",
    "hba2020_22": 41810,
    "bf8q2020_22": 10399,
    "appsPerEmployer": 4.02,
    "conversionPct": 24.9,
    "hba2023": 17488,
    "bf8q2023": 4263,
    "appsPerEmployer2023": 4.1,
    "conversionPct2023": 24.4
  },
  {
    "code": "AZ",
    "name": "Arizona",
    "region": "West",
    "hba2020_22": 100985,
    "bf8q2020_22": 25538,
    "appsPerEmployer": 3.95,
    "conversionPct": 25.3,
    "hba2023": 38964,
    "bf8q2023": 9930,
    "appsPerEmployer2023": 3.92,
    "conversionPct2023": 25.5
  },
  {
    "code": "WV",
    "name": "West Virginia",
    "region": "South",
    "hba2020_22": 13067,
    "bf8q2020_22": 3328,
    "appsPerEmployer": 3.93,
    "conversionPct": 25.5,
    "hba2023": 5035,
    "bf8q2023": 1239,
    "appsPerEmployer2023": 4.06,
    "conversionPct2023": 24.6
  },
  {
    "code": "WI",
    "name": "Wisconsin",
    "region": "Midwest",
    "hba2020_22": 58223,
    "bf8q2020_22": 14867,
    "appsPerEmployer": 3.92,
    "conversionPct": 25.5,
    "hba2023": 20662,
    "bf8q2023": 5298,
    "appsPerEmployer2023": 3.9,
    "conversionPct2023": 25.6
  },
  {
    "code": "NV",
    "name": "Nevada",
    "region": "West",
    "hba2020_22": 56417,
    "bf8q2020_22": 14949,
    "appsPerEmployer": 3.77,
    "conversionPct": 26.5,
    "hba2023": 20965,
    "bf8q2023": 5578,
    "appsPerEmployer2023": 3.76,
    "conversionPct2023": 26.6
  },
  {
    "code": "MO",
    "name": "Missouri",
    "region": "Midwest",
    "hba2020_22": 74803,
    "bf8q2020_22": 19885,
    "appsPerEmployer": 3.76,
    "conversionPct": 26.6,
    "hba2023": 28283,
    "bf8q2023": 7257,
    "appsPerEmployer2023": 3.9,
    "conversionPct2023": 25.7
  },
  {
    "code": "MN",
    "name": "Minnesota",
    "region": "Midwest",
    "hba2020_22": 62257,
    "bf8q2020_22": 16585,
    "appsPerEmployer": 3.75,
    "conversionPct": 26.6,
    "hba2023": 22922,
    "bf8q2023": 6127,
    "appsPerEmployer2023": 3.74,
    "conversionPct2023": 26.7
  },
  {
    "code": "CA",
    "name": "California",
    "region": "West",
    "hba2020_22": 625214,
    "bf8q2020_22": 170727,
    "appsPerEmployer": 3.66,
    "conversionPct": 27.3,
    "hba2023": 225953,
    "bf8q2023": 62846,
    "appsPerEmployer2023": 3.6,
    "conversionPct2023": 27.8
  },
  {
    "code": "MA",
    "name": "Massachusetts",
    "region": "Northeast",
    "hba2020_22": 83467,
    "bf8q2020_22": 23628,
    "appsPerEmployer": 3.53,
    "conversionPct": 28.3,
    "hba2023": 30091,
    "bf8q2023": 8641,
    "appsPerEmployer2023": 3.48,
    "conversionPct2023": 28.7
  },
  {
    "code": "KS",
    "name": "Kansas",
    "region": "Midwest",
    "hba2020_22": 30777,
    "bf8q2020_22": 8778,
    "appsPerEmployer": 3.51,
    "conversionPct": 28.5,
    "hba2023": 11145,
    "bf8q2023": 3158,
    "appsPerEmployer2023": 3.53,
    "conversionPct2023": 28.3
  },
  {
    "code": "VT",
    "name": "Vermont",
    "region": "Northeast",
    "hba2020_22": 7488,
    "bf8q2020_22": 2275,
    "appsPerEmployer": 3.29,
    "conversionPct": 30.4,
    "hba2023": 2604,
    "bf8q2023": 794,
    "appsPerEmployer2023": 3.28,
    "conversionPct2023": 30.5
  },
  {
    "code": "IA",
    "name": "Iowa",
    "region": "Midwest",
    "hba2020_22": 27450,
    "bf8q2020_22": 8714,
    "appsPerEmployer": 3.15,
    "conversionPct": 31.7,
    "hba2023": 10285,
    "bf8q2023": 3276,
    "appsPerEmployer2023": 3.14,
    "conversionPct2023": 31.9
  },
  {
    "code": "AK",
    "name": "Alaska",
    "region": "West",
    "hba2020_22": 8710,
    "bf8q2020_22": 2873,
    "appsPerEmployer": 3.03,
    "conversionPct": 33,
    "hba2023": 2979,
    "bf8q2023": 1003,
    "appsPerEmployer2023": 2.97,
    "conversionPct2023": 33.7
  },
  {
    "code": "UT",
    "name": "Utah",
    "region": "West",
    "hba2020_22": 56125,
    "bf8q2020_22": 18615,
    "appsPerEmployer": 3.02,
    "conversionPct": 33.2,
    "hba2023": 21188,
    "bf8q2023": 7028,
    "appsPerEmployer2023": 3.01,
    "conversionPct2023": 33.2
  },
  {
    "code": "MT",
    "name": "Montana",
    "region": "West",
    "hba2020_22": 18269,
    "bf8q2020_22": 6248,
    "appsPerEmployer": 2.92,
    "conversionPct": 34.2,
    "hba2023": 6960,
    "bf8q2023": 2337,
    "appsPerEmployer2023": 2.98,
    "conversionPct2023": 33.6
  },
  {
    "code": "WA",
    "name": "Washington",
    "region": "West",
    "hba2020_22": 89479,
    "bf8q2020_22": 30674,
    "appsPerEmployer": 2.92,
    "conversionPct": 34.3,
    "hba2023": 32527,
    "bf8q2023": 11126,
    "appsPerEmployer2023": 2.92,
    "conversionPct2023": 34.2
  },
  {
    "code": "OR",
    "name": "Oregon",
    "region": "West",
    "hba2020_22": 49412,
    "bf8q2020_22": 17052,
    "appsPerEmployer": 2.9,
    "conversionPct": 34.5,
    "hba2023": 17748,
    "bf8q2023": 5943,
    "appsPerEmployer2023": 2.99,
    "conversionPct2023": 33.5
  },
  {
    "code": "RI",
    "name": "Rhode Island",
    "region": "Northeast",
    "hba2020_22": 11022,
    "bf8q2020_22": 3867,
    "appsPerEmployer": 2.85,
    "conversionPct": 35.1,
    "hba2023": 3992,
    "bf8q2023": 1402,
    "appsPerEmployer2023": 2.85,
    "conversionPct2023": 35.1
  },
  {
    "code": "NH",
    "name": "New Hampshire",
    "region": "Northeast",
    "hba2020_22": 12814,
    "bf8q2020_22": 4523,
    "appsPerEmployer": 2.83,
    "conversionPct": 35.3,
    "hba2023": 5049,
    "bf8q2023": 1699,
    "appsPerEmployer2023": 2.97,
    "conversionPct2023": 33.7
  },
  {
    "code": "NE",
    "name": "Nebraska",
    "region": "Midwest",
    "hba2020_22": 18793,
    "bf8q2020_22": 6662,
    "appsPerEmployer": 2.82,
    "conversionPct": 35.4,
    "hba2023": 7109,
    "bf8q2023": 2489,
    "appsPerEmployer2023": 2.86,
    "conversionPct2023": 35
  },
  {
    "code": "ID",
    "name": "Idaho",
    "region": "West",
    "hba2020_22": 29083,
    "bf8q2020_22": 10565,
    "appsPerEmployer": 2.75,
    "conversionPct": 36.3,
    "hba2023": 10427,
    "bf8q2023": 3738,
    "appsPerEmployer2023": 2.79,
    "conversionPct2023": 35.8
  },
  {
    "code": "ME",
    "name": "Maine",
    "region": "Northeast",
    "hba2020_22": 14487,
    "bf8q2020_22": 5428,
    "appsPerEmployer": 2.67,
    "conversionPct": 37.5,
    "hba2023": 5414,
    "bf8q2023": 1955,
    "appsPerEmployer2023": 2.77,
    "conversionPct2023": 36.1
  },
  {
    "code": "ND",
    "name": "North Dakota",
    "region": "Midwest",
    "hba2020_22": 7758,
    "bf8q2020_22": 2905,
    "appsPerEmployer": 2.67,
    "conversionPct": 37.4,
    "hba2023": 3102,
    "bf8q2023": 1097,
    "appsPerEmployer2023": 2.83,
    "conversionPct2023": 35.4
  },
  {
    "code": "SD",
    "name": "South Dakota",
    "region": "Midwest",
    "hba2020_22": 9791,
    "bf8q2020_22": 3746,
    "appsPerEmployer": 2.61,
    "conversionPct": 38.3,
    "hba2023": 3757,
    "bf8q2023": 1415,
    "appsPerEmployer2023": 2.66,
    "conversionPct2023": 37.7
  }
];

export const ANNUAL = [
  {
    "year": 2017,
    "hba": 1263479,
    "bf8q": 353768,
    "ba": 3197455,
    "appsPerEmployer": 3.57,
    "conversionPct": 28,
    "hbaSharePct": 39.5
  },
  {
    "year": 2018,
    "hba": 1334218,
    "bf8q": 368863,
    "ba": 3498607,
    "appsPerEmployer": 3.62,
    "conversionPct": 27.6,
    "hbaSharePct": 38.1
  },
  {
    "year": 2019,
    "hba": 1322307,
    "bf8q": 357062,
    "ba": 3517607,
    "appsPerEmployer": 3.7,
    "conversionPct": 27,
    "hbaSharePct": 37.6
  },
  {
    "year": 2020,
    "hba": 1522500,
    "bf8q": 348058,
    "ba": 4379813,
    "appsPerEmployer": 4.37,
    "conversionPct": 22.9,
    "hbaSharePct": 34.8
  },
  {
    "year": 2021,
    "hba": 1847560,
    "bf8q": 403072,
    "ba": 5408801,
    "appsPerEmployer": 4.58,
    "conversionPct": 21.8,
    "hbaSharePct": 34.2
  },
  {
    "year": 2022,
    "hba": 1731570,
    "bf8q": 413356,
    "ba": 5083802,
    "appsPerEmployer": 4.19,
    "conversionPct": 23.9,
    "hbaSharePct": 34.1
  },
  {
    "year": 2023,
    "hba": 1856542,
    "bf8q": 430087,
    "ba": 5489174,
    "appsPerEmployer": 4.32,
    "conversionPct": 23.2,
    "hbaSharePct": 33.8
  },
  {
    "year": 2024,
    "hba": 1720175,
    "bf8q": 408437,
    "ba": 5246630,
    "appsPerEmployer": 4.21,
    "conversionPct": 23.7,
    "hbaSharePct": 32.8
  },
  {
    "year": 2025,
    "hba": 1687544,
    "bf8q": 427056,
    "ba": 5636988,
    "appsPerEmployer": 3.95,
    "conversionPct": 25.3,
    "hbaSharePct": 29.9
  }
] as const;

export const QUARTERLY = [
  {
    "q": "2019Q1",
    "hba": 325122,
    "bf8q": 102393,
    "appsPerEmployer": 3.18,
    "conversionPct": 31.5
  },
  {
    "q": "2019Q2",
    "hba": 331803,
    "bf8q": 93075,
    "appsPerEmployer": 3.56,
    "conversionPct": 28.1
  },
  {
    "q": "2019Q3",
    "hba": 327271,
    "bf8q": 82311,
    "appsPerEmployer": 3.98,
    "conversionPct": 25.2
  },
  {
    "q": "2019Q4",
    "hba": 338111,
    "bf8q": 79283,
    "appsPerEmployer": 4.26,
    "conversionPct": 23.4
  },
  {
    "q": "2020Q1",
    "hba": 318093,
    "bf8q": 94709,
    "appsPerEmployer": 3.36,
    "conversionPct": 29.8
  },
  {
    "q": "2020Q2",
    "hba": 307017,
    "bf8q": 72166,
    "appsPerEmployer": 4.25,
    "conversionPct": 23.5
  },
  {
    "q": "2020Q3",
    "hba": 499747,
    "bf8q": 101996,
    "appsPerEmployer": 4.9,
    "conversionPct": 20.4
  },
  {
    "q": "2020Q4",
    "hba": 397643,
    "bf8q": 79187,
    "appsPerEmployer": 5.02,
    "conversionPct": 19.9
  },
  {
    "q": "2021Q1",
    "hba": 471026,
    "bf8q": 117907,
    "appsPerEmployer": 3.99,
    "conversionPct": 25
  },
  {
    "q": "2021Q2",
    "hba": 491138,
    "bf8q": 105198,
    "appsPerEmployer": 4.67,
    "conversionPct": 21.4
  },
  {
    "q": "2021Q3",
    "hba": 443056,
    "bf8q": 93177,
    "appsPerEmployer": 4.75,
    "conversionPct": 21
  },
  {
    "q": "2021Q4",
    "hba": 442340,
    "bf8q": 86790,
    "appsPerEmployer": 5.1,
    "conversionPct": 19.6
  },
  {
    "q": "2022Q1",
    "hba": 426337,
    "bf8q": 121220,
    "appsPerEmployer": 3.52,
    "conversionPct": 28.4
  },
  {
    "q": "2022Q2",
    "hba": 432426,
    "bf8q": 105199,
    "appsPerEmployer": 4.11,
    "conversionPct": 24.3
  },
  {
    "q": "2022Q3",
    "hba": 437069,
    "bf8q": 95871,
    "appsPerEmployer": 4.56,
    "conversionPct": 21.9
  },
  {
    "q": "2022Q4",
    "hba": 435738,
    "bf8q": 91066,
    "appsPerEmployer": 4.78,
    "conversionPct": 20.9
  },
  {
    "q": "2023Q1",
    "hba": 456087,
    "bf8q": 128047,
    "appsPerEmployer": 3.56,
    "conversionPct": 28.1
  },
  {
    "q": "2023Q2",
    "hba": 455813,
    "bf8q": 109265,
    "appsPerEmployer": 4.17,
    "conversionPct": 24
  },
  {
    "q": "2023Q3",
    "hba": 475010,
    "bf8q": 100040,
    "appsPerEmployer": 4.75,
    "conversionPct": 21.1
  },
  {
    "q": "2023Q4",
    "hba": 469632,
    "bf8q": 92735,
    "appsPerEmployer": 5.06,
    "conversionPct": 19.7
  },
  {
    "q": "2024Q1",
    "hba": 441700,
    "bf8q": 121406,
    "appsPerEmployer": 3.64,
    "conversionPct": 27.5
  },
  {
    "q": "2024Q2",
    "hba": 421820,
    "bf8q": 102393,
    "appsPerEmployer": 4.12,
    "conversionPct": 24.3
  },
  {
    "q": "2024Q3",
    "hba": 426717,
    "bf8q": 94426,
    "appsPerEmployer": 4.52,
    "conversionPct": 22.1
  },
  {
    "q": "2024Q4",
    "hba": 429938,
    "bf8q": 90212,
    "appsPerEmployer": 4.77,
    "conversionPct": 21
  },
  {
    "q": "2025Q1",
    "hba": 409219,
    "bf8q": 113815,
    "appsPerEmployer": 3.6,
    "conversionPct": 27.8
  },
  {
    "q": "2025Q2",
    "hba": 426688,
    "bf8q": 105601,
    "appsPerEmployer": 4.04,
    "conversionPct": 24.7
  },
  {
    "q": "2025Q3",
    "hba": 428786,
    "bf8q": 98980,
    "appsPerEmployer": 4.33,
    "conversionPct": 23.1
  },
  {
    "q": "2025Q4",
    "hba": 422851,
    "bf8q": 108660,
    "appsPerEmployer": 3.89,
    "conversionPct": 25.7
  },
  {
    "q": "2026Q1",
    "hba": 439349,
    "bf8q": 130429,
    "appsPerEmployer": 3.37,
    "conversionPct": 29.7
  },
  {
    "q": "2026Q2",
    "hba": 443901,
    "bf8q": 122012,
    "appsPerEmployer": 3.64,
    "conversionPct": 27.5
  }
] as const;

export const MONTHLY = [
  {
    "ym": "2019-01",
    "hba": 102398,
    "bf8q": 40435,
    "ba": 275827,
    "appsPerEmployer": 2.53
  },
  {
    "ym": "2019-02",
    "hba": 111458,
    "bf8q": 30928,
    "ba": 299331,
    "appsPerEmployer": 3.6
  },
  {
    "ym": "2019-03",
    "hba": 111266,
    "bf8q": 31030,
    "ba": 301093,
    "appsPerEmployer": 3.59
  },
  {
    "ym": "2019-04",
    "hba": 111491,
    "bf8q": 29961,
    "ba": 293060,
    "appsPerEmployer": 3.72
  },
  {
    "ym": "2019-05",
    "hba": 109314,
    "bf8q": 35439,
    "ba": 287481,
    "appsPerEmployer": 3.08
  },
  {
    "ym": "2019-06",
    "hba": 110998,
    "bf8q": 27675,
    "ba": 290529,
    "appsPerEmployer": 4.01
  },
  {
    "ym": "2019-07",
    "hba": 106567,
    "bf8q": 24730,
    "ba": 280547,
    "appsPerEmployer": 4.31
  },
  {
    "ym": "2019-08",
    "hba": 110912,
    "bf8q": 33040,
    "ba": 292063,
    "appsPerEmployer": 3.36
  },
  {
    "ym": "2019-09",
    "hba": 109792,
    "bf8q": 24541,
    "ba": 290721,
    "appsPerEmployer": 4.47
  },
  {
    "ym": "2019-10",
    "hba": 110755,
    "bf8q": 31990,
    "ba": 297723,
    "appsPerEmployer": 3.46
  },
  {
    "ym": "2019-11",
    "hba": 110900,
    "bf8q": 23227,
    "ba": 293965,
    "appsPerEmployer": 4.77
  },
  {
    "ym": "2019-12",
    "hba": 116456,
    "bf8q": 24066,
    "ba": 315267,
    "appsPerEmployer": 4.84
  },
  {
    "ym": "2020-01",
    "hba": 105103,
    "bf8q": 39238,
    "ba": 282360,
    "appsPerEmployer": 2.68
  },
  {
    "ym": "2020-02",
    "hba": 115344,
    "bf8q": 30771,
    "ba": 303982,
    "appsPerEmployer": 3.75
  },
  {
    "ym": "2020-03",
    "hba": 97646,
    "bf8q": 24700,
    "ba": 259162,
    "appsPerEmployer": 3.95
  },
  {
    "ym": "2020-04",
    "hba": 79384,
    "bf8q": 22834,
    "ba": 235568,
    "appsPerEmployer": 3.48
  },
  {
    "ym": "2020-05",
    "hba": 99204,
    "bf8q": 22655,
    "ba": 298466,
    "appsPerEmployer": 4.38
  },
  {
    "ym": "2020-06",
    "hba": 128429,
    "bf8q": 26677,
    "ba": 376926,
    "appsPerEmployer": 4.81
  },
  {
    "ym": "2020-07",
    "hba": 184824,
    "bf8q": 35983,
    "ba": 546719,
    "appsPerEmployer": 5.14
  },
  {
    "ym": "2020-08",
    "hba": 165567,
    "bf8q": 30395,
    "ba": 484772,
    "appsPerEmployer": 5.45
  },
  {
    "ym": "2020-09",
    "hba": 149356,
    "bf8q": 35618,
    "ba": 433059,
    "appsPerEmployer": 4.19
  },
  {
    "ym": "2020-10",
    "hba": 141100,
    "bf8q": 28118,
    "ba": 410569,
    "appsPerEmployer": 5.02
  },
  {
    "ym": "2020-11",
    "hba": 138206,
    "bf8q": 24946,
    "ba": 396615,
    "appsPerEmployer": 5.54
  },
  {
    "ym": "2020-12",
    "hba": 118337,
    "bf8q": 26123,
    "ba": 351615,
    "appsPerEmployer": 4.53
  },
  {
    "ym": "2021-01",
    "hba": 167039,
    "bf8q": 41150,
    "ba": 488126,
    "appsPerEmployer": 4.06
  },
  {
    "ym": "2021-02",
    "hba": 148334,
    "bf8q": 33976,
    "ba": 434622,
    "appsPerEmployer": 4.37
  },
  {
    "ym": "2021-03",
    "hba": 155653,
    "bf8q": 42781,
    "ba": 448765,
    "appsPerEmployer": 3.64
  },
  {
    "ym": "2021-04",
    "hba": 168067,
    "bf8q": 33586,
    "ba": 498579,
    "appsPerEmployer": 5
  },
  {
    "ym": "2021-05",
    "hba": 169638,
    "bf8q": 32882,
    "ba": 505645,
    "appsPerEmployer": 5.16
  },
  {
    "ym": "2021-06",
    "hba": 153433,
    "bf8q": 38730,
    "ba": 446232,
    "appsPerEmployer": 3.96
  },
  {
    "ym": "2021-07",
    "hba": 151263,
    "bf8q": 29048,
    "ba": 443113,
    "appsPerEmployer": 5.21
  },
  {
    "ym": "2021-08",
    "hba": 145611,
    "bf8q": 29078,
    "ba": 427748,
    "appsPerEmployer": 5.01
  },
  {
    "ym": "2021-09",
    "hba": 146182,
    "bf8q": 35051,
    "ba": 427508,
    "appsPerEmployer": 4.17
  },
  {
    "ym": "2021-10",
    "hba": 147914,
    "bf8q": 28809,
    "ba": 428017,
    "appsPerEmployer": 5.13
  },
  {
    "ym": "2021-11",
    "hba": 150937,
    "bf8q": 26543,
    "ba": 432545,
    "appsPerEmployer": 5.69
  },
  {
    "ym": "2021-12",
    "hba": 143489,
    "bf8q": 31438,
    "ba": 427901,
    "appsPerEmployer": 4.56
  },
  {
    "ym": "2022-01",
    "hba": 146600,
    "bf8q": 42284,
    "ba": 436674,
    "appsPerEmployer": 3.47
  },
  {
    "ym": "2022-02",
    "hba": 141400,
    "bf8q": 36211,
    "ba": 427960,
    "appsPerEmployer": 3.9
  },
  {
    "ym": "2022-03",
    "hba": 138337,
    "bf8q": 42725,
    "ba": 412246,
    "appsPerEmployer": 3.24
  },
  {
    "ym": "2022-04",
    "hba": 144322,
    "bf8q": 33009,
    "ba": 433663,
    "appsPerEmployer": 4.37
  },
  {
    "ym": "2022-05",
    "hba": 146954,
    "bf8q": 33375,
    "ba": 430119,
    "appsPerEmployer": 4.4
  },
  {
    "ym": "2022-06",
    "hba": 141150,
    "bf8q": 38815,
    "ba": 407753,
    "appsPerEmployer": 3.64
  },
  {
    "ym": "2022-07",
    "hba": 146773,
    "bf8q": 29099,
    "ba": 423929,
    "appsPerEmployer": 5.04
  },
  {
    "ym": "2022-08",
    "hba": 143663,
    "bf8q": 37634,
    "ba": 419560,
    "appsPerEmployer": 3.82
  },
  {
    "ym": "2022-09",
    "hba": 146633,
    "bf8q": 29138,
    "ba": 422293,
    "appsPerEmployer": 5.03
  },
  {
    "ym": "2022-10",
    "hba": 149183,
    "bf8q": 30698,
    "ba": 429432,
    "appsPerEmployer": 4.86
  },
  {
    "ym": "2022-11",
    "hba": 143764,
    "bf8q": 34057,
    "ba": 416428,
    "appsPerEmployer": 4.22
  },
  {
    "ym": "2022-12",
    "hba": 142791,
    "bf8q": 26311,
    "ba": 423745,
    "appsPerEmployer": 5.43
  },
  {
    "ym": "2023-01",
    "hba": 146019,
    "bf8q": 41282,
    "ba": 428614,
    "appsPerEmployer": 3.54
  },
  {
    "ym": "2023-02",
    "hba": 152532,
    "bf8q": 38481,
    "ba": 446842,
    "appsPerEmployer": 3.96
  },
  {
    "ym": "2023-03",
    "hba": 157536,
    "bf8q": 48284,
    "ba": 452843,
    "appsPerEmployer": 3.26
  },
  {
    "ym": "2023-04",
    "hba": 152118,
    "bf8q": 35057,
    "ba": 444715,
    "appsPerEmployer": 4.34
  },
  {
    "ym": "2023-05",
    "hba": 147490,
    "bf8q": 40971,
    "ba": 449234,
    "appsPerEmployer": 3.6
  },
  {
    "ym": "2023-06",
    "hba": 156205,
    "bf8q": 33237,
    "ba": 470793,
    "appsPerEmployer": 4.7
  },
  {
    "ym": "2023-07",
    "hba": 156583,
    "bf8q": 30207,
    "ba": 478273,
    "appsPerEmployer": 5.18
  },
  {
    "ym": "2023-08",
    "hba": 153875,
    "bf8q": 39717,
    "ba": 467208,
    "appsPerEmployer": 3.87
  },
  {
    "ym": "2023-09",
    "hba": 164552,
    "bf8q": 30116,
    "ba": 470317,
    "appsPerEmployer": 5.46
  },
  {
    "ym": "2023-10",
    "hba": 162306,
    "bf8q": 30136,
    "ba": 470393,
    "appsPerEmployer": 5.39
  },
  {
    "ym": "2023-11",
    "hba": 154439,
    "bf8q": 35204,
    "ba": 455805,
    "appsPerEmployer": 4.39
  },
  {
    "ym": "2023-12",
    "hba": 152887,
    "bf8q": 27395,
    "ba": 454137,
    "appsPerEmployer": 5.58
  },
  {
    "ym": "2024-01",
    "hba": 151258,
    "bf8q": 50841,
    "ba": 450041,
    "appsPerEmployer": 2.98
  },
  {
    "ym": "2024-02",
    "hba": 146859,
    "bf8q": 35980,
    "ba": 443944,
    "appsPerEmployer": 4.08
  },
  {
    "ym": "2024-03",
    "hba": 143583,
    "bf8q": 34585,
    "ba": 431289,
    "appsPerEmployer": 4.15
  },
  {
    "ym": "2024-04",
    "hba": 139518,
    "bf8q": 32089,
    "ba": 431531,
    "appsPerEmployer": 4.35
  },
  {
    "ym": "2024-05",
    "hba": 140171,
    "bf8q": 39104,
    "ba": 427923,
    "appsPerEmployer": 3.58
  },
  {
    "ym": "2024-06",
    "hba": 142131,
    "bf8q": 31200,
    "ba": 436016,
    "appsPerEmployer": 4.56
  },
  {
    "ym": "2024-07",
    "hba": 139439,
    "bf8q": 35106,
    "ba": 424927,
    "appsPerEmployer": 3.97
  },
  {
    "ym": "2024-08",
    "hba": 144689,
    "bf8q": 30520,
    "ba": 436267,
    "appsPerEmployer": 4.74
  },
  {
    "ym": "2024-09",
    "hba": 142589,
    "bf8q": 28800,
    "ba": 427221,
    "appsPerEmployer": 4.95
  },
  {
    "ym": "2024-10",
    "hba": 139532,
    "bf8q": 36052,
    "ba": 426875,
    "appsPerEmployer": 3.87
  },
  {
    "ym": "2024-11",
    "hba": 141489,
    "bf8q": 26673,
    "ba": 446146,
    "appsPerEmployer": 5.3
  },
  {
    "ym": "2024-12",
    "hba": 148917,
    "bf8q": 27487,
    "ba": 464450,
    "appsPerEmployer": 5.42
  },
  {
    "ym": "2025-01",
    "hba": 128338,
    "bf8q": 44090,
    "ba": 385618,
    "appsPerEmployer": 2.91
  },
  {
    "ym": "2025-02",
    "hba": 139440,
    "bf8q": 35071,
    "ba": 432820,
    "appsPerEmployer": 3.98
  },
  {
    "ym": "2025-03",
    "hba": 141441,
    "bf8q": 34654,
    "ba": 461056,
    "appsPerEmployer": 4.08
  },
  {
    "ym": "2025-04",
    "hba": 142828,
    "bf8q": 41671,
    "ba": 456024,
    "appsPerEmployer": 3.43
  },
  {
    "ym": "2025-05",
    "hba": 141570,
    "bf8q": 32200,
    "ba": 448815,
    "appsPerEmployer": 4.4
  },
  {
    "ym": "2025-06",
    "hba": 142290,
    "bf8q": 31730,
    "ba": 462692,
    "appsPerEmployer": 4.48
  },
  {
    "ym": "2025-07",
    "hba": 143449,
    "bf8q": 36085,
    "ba": 469274,
    "appsPerEmployer": 3.98
  },
  {
    "ym": "2025-08",
    "hba": 142221,
    "bf8q": 31109,
    "ba": 478074,
    "appsPerEmployer": 4.57
  },
  {
    "ym": "2025-09",
    "hba": 143116,
    "bf8q": 31786,
    "ba": 510794,
    "appsPerEmployer": 4.5
  },
  {
    "ym": "2025-10",
    "hba": 141266,
    "bf8q": 40079,
    "ba": 498416,
    "appsPerEmployer": 3.52
  },
  {
    "ym": "2025-11",
    "hba": 145007,
    "bf8q": 31302,
    "ba": 537266,
    "appsPerEmployer": 4.63
  },
  {
    "ym": "2025-12",
    "hba": 136578,
    "bf8q": 37279,
    "ba": 496139,
    "appsPerEmployer": 3.66
  },
  {
    "ym": "2026-01",
    "hba": 148127,
    "bf8q": 48213,
    "ba": 526115,
    "appsPerEmployer": 3.07
  },
  {
    "ym": "2026-02",
    "hba": 146252,
    "bf8q": 41388,
    "ba": 496121,
    "appsPerEmployer": 3.53
  },
  {
    "ym": "2026-03",
    "hba": 144970,
    "bf8q": 40828,
    "ba": 493792,
    "appsPerEmployer": 3.55
  },
  {
    "ym": "2026-04",
    "hba": 147126,
    "bf8q": 46707,
    "ba": 506807,
    "appsPerEmployer": 3.15
  },
  {
    "ym": "2026-05",
    "hba": 146983,
    "bf8q": 37747,
    "ba": 528929,
    "appsPerEmployer": 3.89
  },
  {
    "ym": "2026-06",
    "hba": 149792,
    "bf8q": 37558,
    "ba": 535690,
    "appsPerEmployer": 3.99
  },
  {
    "ym": "2026-07",
    "hba": 151857,
    "bf8q": 42083,
    "ba": 578926,
    "appsPerEmployer": 3.61
  }
] as const;

export const REGIONS = [
  {
    "region": "South",
    "hba": 2253141,
    "bf8q": 454860,
    "appsPerEmployer": 4.95,
    "conversionPct": 20.2
  },
  {
    "region": "West",
    "hba": 1211269,
    "bf8q": 337499,
    "appsPerEmployer": 3.59,
    "conversionPct": 27.9
  },
  {
    "region": "Midwest",
    "hba": 831695,
    "bf8q": 188557,
    "appsPerEmployer": 4.41,
    "conversionPct": 22.7
  },
  {
    "region": "Northeast",
    "hba": 805525,
    "bf8q": 183824,
    "appsPerEmployer": 4.38,
    "conversionPct": 22.8
  }
] as const;

export const ANALYTICS = {
  defaultPanel: "state-ladder" as const,
  defaultRegion: "All" as const,
  defaultSort: "appsPerEmployer" as const,
  cohortStart: "2020-01",
  cohortEnd: "2022-12",
  fredVintage: "2026-07",
};
