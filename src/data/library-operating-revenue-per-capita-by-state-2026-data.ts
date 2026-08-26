/**
 * Library operating revenue per capita by state (2026).
 *
 * Core question: How wide is the per-capita operating-revenue gap across
 * states, and did it widen after 2020?
 *
 * Primary source: IMLS Public Libraries Survey (PLS) Benchmarking Table 8 —
 * total operating revenue per capita by source and state, FY 2018–FY 2022.
 * Per-capita denominators are unduplicated legal service area population
 * (POPU_UND) as reported to IMLS / state library agencies (Census-based
 * jurisdiction estimates, not a separate Census vintage join).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "State per-capita operating revenue figures are from the Institute of " +
  "Museum and Library Services (IMLS) Public Libraries Survey Benchmarking " +
  "Table 8 (Total per capita operating revenue of public libraries, by " +
  "source of revenue, by state) for FY 2018–FY 2022, as republished in the " +
  "Library Data Archive benchmarking tables. Totals exclude U.S. territories. " +
  "Per-capita rates use unduplicated legal service area population. Spread " +
  "metrics (max/min ratio, dollar range, P90–P10) and FY 2019→FY 2022 deltas " +
  "are desk calculations from those disclosed state rows.";

export const SOURCES = [
  {
    label: "IMLS — Public Libraries Survey (PLS)",
    url: "https://www.imls.gov/research-evaluation/surveys/public-libraries-survey-pls",
  },
  {
    label: "PLS Benchmarking Table 8 (per-capita operating revenue by state)",
    url: "https://librarydataarchive.com/USGOV/Benchmarks/benchindex.html",
  },
  {
    label: "IMLS — FY 2019 PLS Findings (national $44.88/person anchor)",
    url: "https://www.imls.gov/sites/default/files/2021-08/fy19-pls-results.pdf",
  },
] as const;

export const VIZ_MARKERS = [
  "Revenue per capita spread",
  "State revenue ladder",
  "Source mix by state",
] as const;

/** Headline punchline — gap widened after 2020 */
export const HEADLINE = {
  /** FY 2022 max (DC) */
  max2022: 110.47,
  /** FY 2022 min (Mississippi) */
  min2022: 18.16,
  /** Max/min ratio FY 2022 (51 jurisdictions) */
  ratio2022: 6.08,
  /** Max/min ratio FY 2019 */
  ratio2019: 5.02,
  /** Dollar range FY 2022 */
  range2022: 92.31,
  /** Dollar range FY 2019 */
  range2019: 69.01,
  /** Dollar range FY 2020 (first post-shock year in series) */
  range2020: 77.52,
  /** State mean FY 2022 */
  mean2022: 48.95,
  /** State mean FY 2019 */
  mean2019: 45.22,
  /** National disclosed FY 2019 (IMLS findings) */
  national2019: 44.88,
  /** Top state excl. DC (Ohio) */
  ohio2022: 90.44,
  /** Bottom state (Mississippi) */
  mississippi2022: 18.16,
  /** States with higher per-capita revenue FY 2022 vs FY 2019 */
  statesUp: 45,
  /** States lower */
  statesDown: 6,
  /** P90–P10 spread FY 2022 */
  p90p10_2022: 49.86,
  /** P90–P10 spread FY 2019 */
  p90p10_2019: 43.59,
  stateN: 51,
} as const;

export type RegionId = "Northeast" | "Midwest" | "South" | "West";

export type NationalSpreadYear = {
  fy: number;
  mean: number;
  med: number;
  min: number;
  max: number;
  ratio: number;
  range: number;
  p90p10: number;
  ratioExclDc: number;
  rangeExclDc: number;
};

export type StateRow = {
  state: string;
  abbr: string;
  region: RegionId;
  libs: number;
  total2022: number;
  total2019: number;
  delta: number;
  pctChange: number;
  fed: number;
  stateRev: number;
  local: number;
  other: number;
  localShare: number;
  stateShare: number;
  confidence: Confidence;
};

export type RegionSummary = {
  region: RegionId;
  n: number;
  mean: number;
  med: number;
  min: number;
  max: number;
  ratio: number;
};

export type SpreadPathPoint = {
  fy: number;
  ratio: number;
  range: number;
  p90p10: number;
  mean: number;
};

export const NATIONAL_SPREAD: NationalSpreadYear[] = [
  {
    "fy": 2018,
    "mean": 44.12,
    "med": 42.9,
    "min": 17.12,
    "max": 86.67,
    "ratio": 5.06,
    "range": 69.55,
    "p90p10": 42.85,
    "ratioExclDc": 4.4,
    "rangeExclDc": 58.24
  },
  {
    "fy": 2019,
    "mean": 45.22,
    "med": 43.49,
    "min": 17.18,
    "max": 86.19,
    "ratio": 5.02,
    "range": 69.01,
    "p90p10": 43.59,
    "ratioExclDc": 4.65,
    "rangeExclDc": 62.66
  },
  {
    "fy": 2020,
    "mean": 46.68,
    "med": 45.3,
    "min": 17.29,
    "max": 94.81,
    "ratio": 5.48,
    "range": 77.52,
    "p90p10": 51.14,
    "ratioExclDc": 4.93,
    "rangeExclDc": 67.92
  },
  {
    "fy": 2021,
    "mean": 47.25,
    "med": 46.48,
    "min": 16.93,
    "max": 98.31,
    "ratio": 5.81,
    "range": 81.38,
    "p90p10": 45.62,
    "ratioExclDc": 5.1,
    "rangeExclDc": 69.46
  },
  {
    "fy": 2022,
    "mean": 48.95,
    "med": 47.36,
    "min": 18.16,
    "max": 110.47,
    "ratio": 6.08,
    "range": 92.31,
    "p90p10": 49.86,
    "ratioExclDc": 4.98,
    "rangeExclDc": 72.28
  }
];

export const SPREAD_PATH: SpreadPathPoint[] = [
  {
    "fy": 2018,
    "ratio": 5.06,
    "range": 69.55,
    "p90p10": 42.85,
    "mean": 44.12
  },
  {
    "fy": 2019,
    "ratio": 5.02,
    "range": 69.01,
    "p90p10": 43.59,
    "mean": 45.22
  },
  {
    "fy": 2020,
    "ratio": 5.48,
    "range": 77.52,
    "p90p10": 51.14,
    "mean": 46.68
  },
  {
    "fy": 2021,
    "ratio": 5.81,
    "range": 81.38,
    "p90p10": 45.62,
    "mean": 47.25
  },
  {
    "fy": 2022,
    "ratio": 6.08,
    "range": 92.31,
    "p90p10": 49.86,
    "mean": 48.95
  }
];

export const REGION_SUMMARY_2022: RegionSummary[] = [
  {
    "region": "Northeast",
    "n": 9,
    "mean": 55.47,
    "med": 53.46,
    "min": 32.23,
    "max": 78.01,
    "ratio": 2.42
  },
  {
    "region": "Midwest",
    "n": 12,
    "mean": 56.03,
    "med": 49.34,
    "min": 35.61,
    "max": 90.44,
    "ratio": 2.54
  },
  {
    "region": "South",
    "n": 17,
    "mean": 39.35,
    "med": 35.27,
    "min": 18.16,
    "max": 110.47,
    "ratio": 6.08
  },
  {
    "region": "West",
    "n": 13,
    "mean": 50.43,
    "med": 45.97,
    "min": 26.47,
    "max": 78.89,
    "ratio": 2.98
  }
];

export const REGION_SUMMARY_2019: RegionSummary[] = [
  {
    "region": "Northeast",
    "n": 9,
    "mean": 51.21,
    "med": 49.36,
    "min": 23.88,
    "max": 79.65,
    "ratio": 3.34
  },
  {
    "region": "Midwest",
    "n": 12,
    "mean": 52.25,
    "med": 46.84,
    "min": 31.46,
    "max": 79.84,
    "ratio": 2.54
  },
  {
    "region": "South",
    "n": 17,
    "mean": 35.75,
    "med": 32.15,
    "min": 17.18,
    "max": 86.19,
    "ratio": 5.02
  },
  {
    "region": "West",
    "n": 13,
    "mean": 46.96,
    "med": 43.49,
    "min": 28.34,
    "max": 75.53,
    "ratio": 2.67
  }
];

export const STATE_PANEL: StateRow[] = [
  {
    "state": "District of Columbia",
    "abbr": "DC",
    "region": "South",
    "libs": 1,
    "total2022": 110.47,
    "total2019": 86.19,
    "delta": 24.28,
    "pctChange": 28.2,
    "fed": 3.49,
    "stateRev": 0,
    "local": 106.17,
    "other": 0.81,
    "localShare": 96.1,
    "stateShare": 0,
    "confidence": "disclosed"
  },
  {
    "state": "Ohio",
    "abbr": "OH",
    "region": "Midwest",
    "libs": 251,
    "total2022": 90.44,
    "total2019": 79.84,
    "delta": 10.6,
    "pctChange": 13.3,
    "fed": 0.06,
    "stateRev": 43.07,
    "local": 41.41,
    "other": 5.89,
    "localShare": 45.8,
    "stateShare": 47.6,
    "confidence": "disclosed"
  },
  {
    "state": "Illinois",
    "abbr": "IL",
    "region": "Midwest",
    "libs": 623,
    "total2022": 81.48,
    "total2019": 74.92,
    "delta": 6.56,
    "pctChange": 8.8,
    "fed": 0.37,
    "stateRev": 4.51,
    "local": 73.77,
    "other": 2.82,
    "localShare": 90.5,
    "stateShare": 5.5,
    "confidence": "disclosed"
  },
  {
    "state": "Colorado",
    "abbr": "CO",
    "region": "West",
    "libs": 112,
    "total2022": 78.89,
    "total2019": 61.74,
    "delta": 17.15,
    "pctChange": 27.8,
    "fed": 0.49,
    "stateRev": 0.62,
    "local": 73.51,
    "other": 4.28,
    "localShare": 93.2,
    "stateShare": 0.8,
    "confidence": "disclosed"
  },
  {
    "state": "New York",
    "abbr": "NY",
    "region": "Northeast",
    "libs": 755,
    "total2022": 78.01,
    "total2019": 79.65,
    "delta": -1.64,
    "pctChange": -2.1,
    "fed": 0.39,
    "stateRev": 3.07,
    "local": 64.82,
    "other": 9.73,
    "localShare": 83.1,
    "stateShare": 3.9,
    "confidence": "disclosed"
  },
  {
    "state": "Oregon",
    "abbr": "OR",
    "region": "West",
    "libs": 134,
    "total2022": 75.33,
    "total2019": 75.53,
    "delta": -0.2,
    "pctChange": -0.3,
    "fed": 0.47,
    "stateRev": 0.33,
    "local": 71.62,
    "other": 2.91,
    "localShare": 95.1,
    "stateShare": 0.4,
    "confidence": "disclosed"
  },
  {
    "state": "Washington",
    "abbr": "WA",
    "region": "West",
    "libs": 59,
    "total2022": 70.75,
    "total2019": 67.26,
    "delta": 3.49,
    "pctChange": 5.2,
    "fed": 0.33,
    "stateRev": 0.03,
    "local": 67.98,
    "other": 2.41,
    "localShare": 96.1,
    "stateShare": 0,
    "confidence": "disclosed"
  },
  {
    "state": "Indiana",
    "abbr": "IN",
    "region": "Midwest",
    "libs": 236,
    "total2022": 68.19,
    "total2019": 65.18,
    "delta": 3.01,
    "pctChange": 4.6,
    "fed": 0.52,
    "stateRev": 4.35,
    "local": 59.05,
    "other": 4.28,
    "localShare": 86.6,
    "stateShare": 6.4,
    "confidence": "disclosed"
  },
  {
    "state": "Louisiana",
    "abbr": "LA",
    "region": "South",
    "libs": 67,
    "total2022": 66.08,
    "total2019": 60.49,
    "delta": 5.59,
    "pctChange": 9.2,
    "fed": 0.11,
    "stateRev": 1.03,
    "local": 62.38,
    "other": 2.56,
    "localShare": 94.4,
    "stateShare": 1.6,
    "confidence": "disclosed"
  },
  {
    "state": "Kansas",
    "abbr": "KS",
    "region": "Midwest",
    "libs": 318,
    "total2022": 65.1,
    "total2019": 61.13,
    "delta": 3.97,
    "pctChange": 6.5,
    "fed": 0.1,
    "stateRev": 1.91,
    "local": 57.9,
    "other": 5.19,
    "localShare": 88.9,
    "stateShare": 2.9,
    "confidence": "disclosed"
  },
  {
    "state": "Connecticut",
    "abbr": "CT",
    "region": "Northeast",
    "libs": 182,
    "total2022": 64.91,
    "total2019": 61.14,
    "delta": 3.77,
    "pctChange": 6.2,
    "fed": 1.06,
    "stateRev": 0.3,
    "local": 55.23,
    "other": 8.32,
    "localShare": 85.1,
    "stateShare": 0.5,
    "confidence": "disclosed"
  },
  {
    "state": "New Jersey",
    "abbr": "NJ",
    "region": "Northeast",
    "libs": 294,
    "total2022": 62.56,
    "total2019": 58.53,
    "delta": 4.03,
    "pctChange": 6.9,
    "fed": 0.33,
    "stateRev": 0.74,
    "local": 59.68,
    "other": 1.81,
    "localShare": 95.4,
    "stateShare": 1.2,
    "confidence": "disclosed"
  },
  {
    "state": "Wyoming",
    "abbr": "WY",
    "region": "West",
    "libs": 23,
    "total2022": 61.11,
    "total2019": 55.56,
    "delta": 5.55,
    "pctChange": 10,
    "fed": 0.13,
    "stateRev": 0.01,
    "local": 55.6,
    "other": 5.37,
    "localShare": 91,
    "stateShare": 0,
    "confidence": "disclosed"
  },
  {
    "state": "Missouri",
    "abbr": "MO",
    "region": "Midwest",
    "libs": 148,
    "total2022": 59.31,
    "total2019": 55.07,
    "delta": 4.24,
    "pctChange": 7.7,
    "fed": 1.45,
    "stateRev": 0.83,
    "local": 55.19,
    "other": 1.84,
    "localShare": 93.1,
    "stateShare": 1.4,
    "confidence": "disclosed"
  },
  {
    "state": "Rhode Island",
    "abbr": "RI",
    "region": "Northeast",
    "libs": 48,
    "total2022": 54.77,
    "total2019": 52.28,
    "delta": 2.49,
    "pctChange": 4.8,
    "fed": 1.83,
    "stateRev": 8.9,
    "local": 35.48,
    "other": 8.55,
    "localShare": 64.8,
    "stateShare": 16.2,
    "confidence": "disclosed"
  },
  {
    "state": "Massachusetts",
    "abbr": "MA",
    "region": "Northeast",
    "libs": 363,
    "total2022": 53.46,
    "total2019": 49.36,
    "delta": 4.1,
    "pctChange": 8.3,
    "fed": 0.23,
    "stateRev": 2.29,
    "local": 46.43,
    "other": 4.5,
    "localShare": 86.8,
    "stateShare": 4.3,
    "confidence": "disclosed"
  },
  {
    "state": "Maryland",
    "abbr": "MD",
    "region": "South",
    "libs": 25,
    "total2022": 52.94,
    "total2019": 54.16,
    "delta": -1.22,
    "pctChange": -2.3,
    "fed": 0.79,
    "stateRev": 10.13,
    "local": 38.73,
    "other": 3.29,
    "localShare": 73.2,
    "stateShare": 19.1,
    "confidence": "disclosed"
  },
  {
    "state": "New Hampshire",
    "abbr": "NH",
    "region": "Northeast",
    "libs": 215,
    "total2022": 52.5,
    "total2019": 49.32,
    "delta": 3.18,
    "pctChange": 6.4,
    "fed": 0.38,
    "stateRev": 0.01,
    "local": 48.88,
    "other": 3.23,
    "localShare": 93.1,
    "stateShare": 0,
    "confidence": "disclosed"
  },
  {
    "state": "Vermont",
    "abbr": "VT",
    "region": "Northeast",
    "libs": 165,
    "total2022": 52.03,
    "total2019": 44.91,
    "delta": 7.12,
    "pctChange": 15.9,
    "fed": 1.94,
    "stateRev": 0.48,
    "local": 39.31,
    "other": 10.3,
    "localShare": 75.6,
    "stateShare": 0.9,
    "confidence": "disclosed"
  },
  {
    "state": "Alaska",
    "abbr": "AK",
    "region": "West",
    "libs": 53,
    "total2022": 51.74,
    "total2019": 61.8,
    "delta": -10.06,
    "pctChange": -16.3,
    "fed": 1.46,
    "stateRev": 0.93,
    "local": 48.96,
    "other": 0.38,
    "localShare": 94.6,
    "stateShare": 1.8,
    "confidence": "disclosed"
  },
  {
    "state": "Kentucky",
    "abbr": "KY",
    "region": "South",
    "libs": 120,
    "total2022": 51.01,
    "total2019": 47.11,
    "delta": 3.9,
    "pctChange": 8.3,
    "fed": 0.44,
    "stateRev": 0.93,
    "local": 48.06,
    "other": 1.58,
    "localShare": 94.2,
    "stateShare": 1.8,
    "confidence": "disclosed"
  },
  {
    "state": "Michigan",
    "abbr": "MI",
    "region": "Midwest",
    "libs": 396,
    "total2022": 50.89,
    "total2019": 48,
    "delta": 2.89,
    "pctChange": 6,
    "fed": 0.09,
    "stateRev": 1.36,
    "local": 46.82,
    "other": 2.63,
    "localShare": 92,
    "stateShare": 2.7,
    "confidence": "disclosed"
  },
  {
    "state": "California",
    "abbr": "CA",
    "region": "West",
    "libs": 185,
    "total2022": 50.74,
    "total2019": 43.74,
    "delta": 7,
    "pctChange": 16,
    "fed": 0.55,
    "stateRev": 0.76,
    "local": 47.78,
    "other": 1.65,
    "localShare": 94.2,
    "stateShare": 1.5,
    "confidence": "disclosed"
  },
  {
    "state": "Maine",
    "abbr": "ME",
    "region": "Northeast",
    "libs": 234,
    "total2022": 48.75,
    "total2019": 41.82,
    "delta": 6.93,
    "pctChange": 16.6,
    "fed": 0.37,
    "stateRev": 0.31,
    "local": 35.24,
    "other": 12.83,
    "localShare": 72.3,
    "stateShare": 0.6,
    "confidence": "disclosed"
  },
  {
    "state": "Wisconsin",
    "abbr": "WI",
    "region": "Midwest",
    "libs": 381,
    "total2022": 47.79,
    "total2019": 45.69,
    "delta": 2.1,
    "pctChange": 4.6,
    "fed": 0.43,
    "stateRev": 0.74,
    "local": 42.27,
    "other": 4.35,
    "localShare": 88.4,
    "stateShare": 1.5,
    "confidence": "disclosed"
  },
  {
    "state": "Iowa",
    "abbr": "IA",
    "region": "Midwest",
    "libs": 536,
    "total2022": 47.36,
    "total2019": 45.15,
    "delta": 2.21,
    "pctChange": 4.9,
    "fed": 0.19,
    "stateRev": 0.82,
    "local": 43.83,
    "other": 2.53,
    "localShare": 92.5,
    "stateShare": 1.7,
    "confidence": "disclosed"
  },
  {
    "state": "Idaho",
    "abbr": "ID",
    "region": "West",
    "libs": 104,
    "total2022": 45.97,
    "total2019": 43.49,
    "delta": 2.48,
    "pctChange": 5.7,
    "fed": 0.19,
    "stateRev": 1.66,
    "local": 41,
    "other": 3.12,
    "localShare": 89.2,
    "stateShare": 3.6,
    "confidence": "disclosed"
  },
  {
    "state": "Oklahoma",
    "abbr": "OK",
    "region": "South",
    "libs": 121,
    "total2022": 45.63,
    "total2019": 41.15,
    "delta": 4.48,
    "pctChange": 10.9,
    "fed": 0.62,
    "stateRev": 0.57,
    "local": 42.7,
    "other": 1.74,
    "localShare": 93.6,
    "stateShare": 1.2,
    "confidence": "disclosed"
  },
  {
    "state": "Nebraska",
    "abbr": "NE",
    "region": "Midwest",
    "libs": 235,
    "total2022": 45.1,
    "total2019": 40.78,
    "delta": 4.32,
    "pctChange": 10.6,
    "fed": 0.83,
    "stateRev": 0.31,
    "local": 42.36,
    "other": 1.59,
    "localShare": 93.9,
    "stateShare": 0.7,
    "confidence": "disclosed"
  },
  {
    "state": "Utah",
    "abbr": "UT",
    "region": "West",
    "libs": 71,
    "total2022": 44.81,
    "total2019": 41.91,
    "delta": 2.9,
    "pctChange": 6.9,
    "fed": 0.48,
    "stateRev": 0.53,
    "local": 42.65,
    "other": 1.15,
    "localShare": 95.2,
    "stateShare": 1.2,
    "confidence": "disclosed"
  },
  {
    "state": "New Mexico",
    "abbr": "NM",
    "region": "West",
    "libs": 85,
    "total2022": 44.01,
    "total2019": 36.2,
    "delta": 7.81,
    "pctChange": 21.6,
    "fed": 0.28,
    "stateRev": 2.94,
    "local": 33.07,
    "other": 7.72,
    "localShare": 75.1,
    "stateShare": 6.7,
    "confidence": "disclosed"
  },
  {
    "state": "Nevada",
    "abbr": "NV",
    "region": "West",
    "libs": 20,
    "total2022": 41.58,
    "total2019": 34.2,
    "delta": 7.38,
    "pctChange": 21.6,
    "fed": 1,
    "stateRev": 10.74,
    "local": 29.08,
    "other": 0.77,
    "localShare": 69.9,
    "stateShare": 25.8,
    "confidence": "disclosed"
  },
  {
    "state": "Minnesota",
    "abbr": "MN",
    "region": "Midwest",
    "libs": 137,
    "total2022": 41.11,
    "total2019": 43.1,
    "delta": -1.99,
    "pctChange": -4.6,
    "fed": 0.18,
    "stateRev": 1.55,
    "local": 36.3,
    "other": 3.08,
    "localShare": 88.3,
    "stateShare": 3.8,
    "confidence": "disclosed"
  },
  {
    "state": "South Dakota",
    "abbr": "SD",
    "region": "Midwest",
    "libs": 106,
    "total2022": 39.94,
    "total2019": 36.71,
    "delta": 3.23,
    "pctChange": 8.8,
    "fed": 0.53,
    "stateRev": 0.01,
    "local": 37.91,
    "other": 1.48,
    "localShare": 94.9,
    "stateShare": 0,
    "confidence": "disclosed"
  },
  {
    "state": "Arkansas",
    "abbr": "AR",
    "region": "South",
    "libs": 59,
    "total2022": 38.54,
    "total2019": 32.15,
    "delta": 6.39,
    "pctChange": 19.9,
    "fed": 0.16,
    "stateRev": 2.48,
    "local": 32.23,
    "other": 3.67,
    "localShare": 83.6,
    "stateShare": 6.4,
    "confidence": "disclosed"
  },
  {
    "state": "Virginia",
    "abbr": "VA",
    "region": "South",
    "libs": 94,
    "total2022": 37.39,
    "total2019": 36.7,
    "delta": 0.69,
    "pctChange": 1.9,
    "fed": 0.21,
    "stateRev": 2.15,
    "local": 34.82,
    "other": 0.2,
    "localShare": 93.1,
    "stateShare": 5.8,
    "confidence": "disclosed"
  },
  {
    "state": "North Dakota",
    "abbr": "ND",
    "region": "Midwest",
    "libs": 73,
    "total2022": 35.61,
    "total2019": 31.46,
    "delta": 4.15,
    "pctChange": 13.2,
    "fed": 0,
    "stateRev": 1.93,
    "local": 31.91,
    "other": 1.77,
    "localShare": 89.6,
    "stateShare": 5.4,
    "confidence": "disclosed"
  },
  {
    "state": "South Carolina",
    "abbr": "SC",
    "region": "South",
    "libs": 42,
    "total2022": 35.48,
    "total2019": 34.08,
    "delta": 1.4,
    "pctChange": 4.1,
    "fed": 0.29,
    "stateRev": 2.25,
    "local": 32.23,
    "other": 0.71,
    "localShare": 90.8,
    "stateShare": 6.3,
    "confidence": "disclosed"
  },
  {
    "state": "Delaware",
    "abbr": "DE",
    "region": "South",
    "libs": 21,
    "total2022": 35.27,
    "total2019": 32.62,
    "delta": 2.65,
    "pctChange": 8.1,
    "fed": 0.22,
    "stateRev": 5.19,
    "local": 28.05,
    "other": 1.81,
    "localShare": 79.5,
    "stateShare": 14.7,
    "confidence": "disclosed"
  },
  {
    "state": "Florida",
    "abbr": "FL",
    "region": "South",
    "libs": 78,
    "total2022": 33.83,
    "total2019": 32.04,
    "delta": 1.79,
    "pctChange": 5.6,
    "fed": 0.44,
    "stateRev": 0.83,
    "local": 31.87,
    "other": 0.7,
    "localShare": 94.2,
    "stateShare": 2.5,
    "confidence": "disclosed"
  },
  {
    "state": "Montana",
    "abbr": "MT",
    "region": "West",
    "libs": 81,
    "total2022": 32.38,
    "total2019": 31.49,
    "delta": 0.89,
    "pctChange": 2.8,
    "fed": 0.03,
    "stateRev": 0.61,
    "local": 29.84,
    "other": 1.9,
    "localShare": 92.2,
    "stateShare": 1.9,
    "confidence": "disclosed"
  },
  {
    "state": "Pennsylvania",
    "abbr": "PA",
    "region": "Northeast",
    "libs": 445,
    "total2022": 32.23,
    "total2019": 23.88,
    "delta": 8.35,
    "pctChange": 35,
    "fed": 0.59,
    "stateRev": 5.33,
    "local": 21.14,
    "other": 5.17,
    "localShare": 65.6,
    "stateShare": 16.5,
    "confidence": "disclosed"
  },
  {
    "state": "Arizona",
    "abbr": "AZ",
    "region": "West",
    "libs": 89,
    "total2022": 31.87,
    "total2019": 29.22,
    "delta": 2.65,
    "pctChange": 9.1,
    "fed": 0.48,
    "stateRev": 0.31,
    "local": 30.26,
    "other": 0.82,
    "localShare": 94.9,
    "stateShare": 1,
    "confidence": "disclosed"
  },
  {
    "state": "North Carolina",
    "abbr": "NC",
    "region": "South",
    "libs": 84,
    "total2022": 27.1,
    "total2019": 23.8,
    "delta": 3.3,
    "pctChange": 13.9,
    "fed": 0.35,
    "stateRev": 1.38,
    "local": 23.13,
    "other": 2.24,
    "localShare": 85.4,
    "stateShare": 5.1,
    "confidence": "disclosed"
  },
  {
    "state": "Hawaii",
    "abbr": "HI",
    "region": "West",
    "libs": 1,
    "total2022": 26.47,
    "total2019": 28.34,
    "delta": -1.87,
    "pctChange": -6.6,
    "fed": 1.01,
    "stateRev": 24.21,
    "local": 0,
    "other": 1.25,
    "localShare": 0,
    "stateShare": 91.5,
    "confidence": "disclosed"
  },
  {
    "state": "Alabama",
    "abbr": "AL",
    "region": "South",
    "libs": 220,
    "total2022": 25.47,
    "total2019": 23.67,
    "delta": 1.8,
    "pctChange": 7.6,
    "fed": 0.65,
    "stateRev": 1.11,
    "local": 22.04,
    "other": 1.66,
    "localShare": 86.5,
    "stateShare": 4.4,
    "confidence": "disclosed"
  },
  {
    "state": "West Virginia",
    "abbr": "WV",
    "region": "South",
    "libs": 96,
    "total2022": 24.28,
    "total2019": 22.82,
    "delta": 1.46,
    "pctChange": 6.4,
    "fed": 0.2,
    "stateRev": 5.4,
    "local": 16.91,
    "other": 1.77,
    "localShare": 69.6,
    "stateShare": 22.2,
    "confidence": "disclosed"
  },
  {
    "state": "Texas",
    "abbr": "TX",
    "region": "South",
    "libs": 539,
    "total2022": 24.11,
    "total2019": 22.44,
    "delta": 1.67,
    "pctChange": 7.4,
    "fed": 0.16,
    "stateRev": 0,
    "local": 23.18,
    "other": 0.76,
    "localShare": 96.1,
    "stateShare": 0,
    "confidence": "disclosed"
  },
  {
    "state": "Tennessee",
    "abbr": "TN",
    "region": "South",
    "libs": 181,
    "total2022": 22.5,
    "total2019": 21.26,
    "delta": 1.24,
    "pctChange": 5.8,
    "fed": 0.32,
    "stateRev": 0.47,
    "local": 20.74,
    "other": 0.97,
    "localShare": 92.2,
    "stateShare": 2.1,
    "confidence": "disclosed"
  },
  {
    "state": "Georgia",
    "abbr": "GA",
    "region": "South",
    "libs": 60,
    "total2022": 20.77,
    "total2019": 19.88,
    "delta": 0.89,
    "pctChange": 4.5,
    "fed": 0.13,
    "stateRev": 3.35,
    "local": 16.38,
    "other": 0.9,
    "localShare": 78.9,
    "stateShare": 16.1,
    "confidence": "disclosed"
  },
  {
    "state": "Mississippi",
    "abbr": "MS",
    "region": "South",
    "libs": 53,
    "total2022": 18.16,
    "total2019": 17.18,
    "delta": 0.98,
    "pctChange": 5.7,
    "fed": 0.81,
    "stateRev": 2.18,
    "local": 14.15,
    "other": 1.02,
    "localShare": 77.9,
    "stateShare": 12,
    "confidence": "disclosed"
  }
];

/** Ranked ladder for viz (high → low) */
export const REVENUE_LADDER = [...STATE_PANEL].sort(
  (a, b) => b.total2022 - a.total2022,
);

/** Biggest absolute $ gains / losses FY 2019→FY 2022 */
export const DELTA_LEADERS = [...STATE_PANEL]
  .sort((a, b) => b.delta - a.delta)
  .slice(0, 12);

export const DELTA_LAGGARDS = [...STATE_PANEL]
  .sort((a, b) => a.delta - b.delta)
  .slice(0, 8);

if (process.env.NODE_ENV !== "production") {
  const n = STATE_PANEL.length;
  if (n !== 51) console.warn(`[library-op-rev] expected 51 rows, got ${n}`);
}
