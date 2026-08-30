/**
 * Undergraduate fall enrollment vs high-school graduate / completer cohorts.
 *
 * Core question: How far has NCES fall undergraduate enrollment fallen
 * relative to the size of recent high-school graduating classes?
 *
 * Undergrad headcount: Digest table 303.70 (IPEDS Fall Enrollment), actual
 * through fall 2022. Completer cohorts + immediate college enrollment rates:
 * Digest table 302.10 (CPS October), through 2024. Confidence: published NCES
 * Digest figures; ratio and indexed series derived.
 */

export const SOURCE_NOTE =
  "NCES Digest of Education Statistics table 303.70 (IPEDS fall undergraduate enrollment in degree-granting institutions, actual through fall 2022; later years in that table are projections and are not used here as observed headcount). Digest table 302.10 (CPS October): recent high-school completers ages 16–24 and percent enrolled in college by October (through 2024). Ratio = undergrad headcount ÷ same-year completer count. Indexes rebase 2010 = 100. Completers include diploma and equivalency credentials; they are not identical to public high-school diploma graduates alone.";

export const SOURCES = [
  {
    label: "NCES Digest — table 303.70 (undergrad fall enrollment)",
    url: "https://nces.ed.gov/programs/digest/d23/tables/dt23_303.70.asp",
  },
  {
    label: "NCES Digest — table 302.10 (HS completers + immediate enrollment)",
    url: "https://nces.ed.gov/programs/digest/d25/tables/dt25_302.10.asp",
  },
  {
    label: "NCES Condition of Education — Undergraduate Enrollment",
    url: "https://nces.ed.gov/programs/coe/indicator/cha",
  },
  {
    label: "NCES Condition of Education — Immediate College Enrollment Rate",
    url: "https://nces.ed.gov/programs/coe/indicator/cpa",
  },
  {
    label: "NCES IPEDS Fall Enrollment component",
    url: "https://nces.ed.gov/ipeds/",
  },
] as const;

export const HEADLINE = {
  asOfLabel: "Fall 2022 / CPS 2024",
  peakYear: 2010,
  peakUndergradM: 18.082,
  troughYear: 2022,
  troughUndergradM: 15.397,
  undergradDropFromPeakM: 2.685,
  undergradDropFromPeakPct: 14.8,
  hsCompletersPeakYear: 2012,
  hsCompletersPeakK: 3203,
  hsCompleters2010K: 3160,
  hsCompleters2022K: 2987,
  hsCompleters2024K: 3222,
  hsCompletersChange2010to2022Pct: -5.5,
  ratio2010: 5.72,
  ratio2022: 5.15,
  ratioDropPct: 9.9,
  immediateRate2010Pct: 68.1,
  immediateRate2022Pct: 62.0,
  immediateRate2024Pct: 62.8,
  immediate2yr2010Pct: 26.7,
  immediate2yr2022Pct: 16.9,
  immediate2yr2024Pct: 20.7,
  immediate4yr2010Pct: 41.4,
  immediate4yr2022Pct: 45.1,
  immediate4yr2024Pct: 42.1,
  twoYearUndergrad2010M: 7.684,
  twoYearUndergrad2022M: 4.657,
  twoYearDropPct: 39.4,
  fourYearUndergrad2010M: 10.399,
  fourYearUndergrad2022M: 10.74,
  fourYearChangePct: 3.3,
  /** Counterfactual: 2022 completers × 2010 ratio */
  counterfactual2022M: 17.09,
  enrollmentGapVsCounterfactualM: 1.69,
} as const;

export const ANALYTICS = {
  categoryLabel: "Economics",
  smokeMarker: "Undergrad headcount vs HS graduate cohort",
  themeId: "college-enrollment-nces",
  slug: "undergraduate-enrollment-versus-high-school-graduate-cohorts-2026",
} as const;

/** Paired annual series: IPEDS undergrad (actual) + CPS completers. */
export type CohortYear = {
  year: number;
  undergradM: number;
  twoYearM: number;
  fourYearM: number;
  hsCompletersK: number;
  ratio: number;
  undergradIndex: number;
  completerIndex: number;
  immediateTotalPct: number;
  immediate2yrPct: number;
  immediate4yrPct: number;
};

export const COHORT_YEARS: CohortYear[] = [
  {
    year: 2010,
    undergradM: 18.082,
    twoYearM: 7.684,
    fourYearM: 10.399,
    hsCompletersK: 3160,
    ratio: 5.72,
    undergradIndex: 100,
    completerIndex: 100,
    immediateTotalPct: 68.1,
    immediate2yrPct: 26.7,
    immediate4yrPct: 41.4,
  },
  {
    year: 2011,
    undergradM: 18.077,
    twoYearM: 7.511,
    fourYearM: 10.566,
    hsCompletersK: 3079,
    ratio: 5.87,
    undergradIndex: 100.0,
    completerIndex: 97.4,
    immediateTotalPct: 68.2,
    immediate2yrPct: 25.9,
    immediate4yrPct: 42.3,
  },
  {
    year: 2012,
    undergradM: 17.736,
    twoYearM: 7.168,
    fourYearM: 10.568,
    hsCompletersK: 3203,
    ratio: 5.54,
    undergradIndex: 98.1,
    completerIndex: 101.4,
    immediateTotalPct: 66.2,
    immediate2yrPct: 28.8,
    immediate4yrPct: 37.5,
  },
  {
    year: 2013,
    undergradM: 17.476,
    twoYearM: 6.971,
    fourYearM: 10.506,
    hsCompletersK: 2977,
    ratio: 5.87,
    undergradIndex: 96.6,
    completerIndex: 94.2,
    immediateTotalPct: 65.9,
    immediate2yrPct: 23.8,
    immediate4yrPct: 42.1,
  },
  {
    year: 2014,
    undergradM: 17.294,
    twoYearM: 6.715,
    fourYearM: 10.579,
    hsCompletersK: 2868,
    ratio: 6.03,
    undergradIndex: 95.6,
    completerIndex: 90.8,
    immediateTotalPct: 68.4,
    immediate2yrPct: 24.6,
    immediate4yrPct: 43.7,
  },
  {
    year: 2015,
    undergradM: 17.047,
    twoYearM: 6.499,
    fourYearM: 10.547,
    hsCompletersK: 2965,
    ratio: 5.75,
    undergradIndex: 94.3,
    completerIndex: 93.8,
    immediateTotalPct: 69.2,
    immediate2yrPct: 25.2,
    immediate4yrPct: 44.0,
  },
  {
    year: 2016,
    undergradM: 16.875,
    twoYearM: 6.092,
    fourYearM: 10.782,
    hsCompletersK: 3137,
    ratio: 5.38,
    undergradIndex: 93.3,
    completerIndex: 99.3,
    immediateTotalPct: 69.8,
    immediate2yrPct: 23.7,
    immediate4yrPct: 46.0,
  },
  {
    year: 2017,
    undergradM: 16.773,
    twoYearM: 5.953,
    fourYearM: 10.82,
    hsCompletersK: 2870,
    ratio: 5.84,
    undergradIndex: 92.8,
    completerIndex: 90.8,
    immediateTotalPct: 66.7,
    immediate2yrPct: 22.6,
    immediate4yrPct: 44.2,
  },
  {
    year: 2018,
    undergradM: 16.616,
    twoYearM: 5.753,
    fourYearM: 10.863,
    hsCompletersK: 3212,
    ratio: 5.17,
    undergradIndex: 91.9,
    completerIndex: 101.6,
    immediateTotalPct: 69.1,
    immediate2yrPct: 25.5,
    immediate4yrPct: 43.6,
  },
  {
    year: 2019,
    undergradM: 16.558,
    twoYearM: 5.591,
    fourYearM: 10.967,
    hsCompletersK: 3178,
    ratio: 5.21,
    undergradIndex: 91.6,
    completerIndex: 100.6,
    immediateTotalPct: 66.2,
    immediate2yrPct: 21.8,
    immediate4yrPct: 44.4,
  },
  {
    year: 2020,
    undergradM: 15.885,
    twoYearM: 4.932,
    fourYearM: 10.953,
    hsCompletersK: 3118,
    ratio: 5.09,
    undergradIndex: 87.8,
    completerIndex: 98.7,
    immediateTotalPct: 62.7,
    immediate2yrPct: 19.9,
    immediate4yrPct: 42.8,
  },
  {
    year: 2021,
    undergradM: 15.448,
    twoYearM: 4.684,
    fourYearM: 10.764,
    hsCompletersK: 2731,
    ratio: 5.66,
    undergradIndex: 85.4,
    completerIndex: 86.4,
    immediateTotalPct: 61.8,
    immediate2yrPct: 18.5,
    immediate4yrPct: 43.3,
  },
  {
    year: 2022,
    undergradM: 15.397,
    twoYearM: 4.657,
    fourYearM: 10.74,
    hsCompletersK: 2987,
    ratio: 5.15,
    undergradIndex: 85.2,
    completerIndex: 94.5,
    immediateTotalPct: 62.0,
    immediate2yrPct: 16.9,
    immediate4yrPct: 45.1,
  },
];

/** Completer + immediate-rate extension beyond last IPEDS actual year. */
export const COMPLETER_EXTENSION = [
  {
    year: 2023,
    hsCompletersK: 3086,
    immediateTotalPct: 61.4,
    immediate2yrPct: 15.6,
    immediate4yrPct: 45.9,
  },
  {
    year: 2024,
    hsCompletersK: 3222,
    immediateTotalPct: 62.8,
    immediate2yrPct: 20.7,
    immediate4yrPct: 42.1,
  },
] as const;

export const LEVEL_SPLIT = [
  {
    id: "twoYear" as const,
    label: "2-year institutions",
    short: "2-year",
    color: "#c2410c",
    peakM: HEADLINE.twoYearUndergrad2010M,
    latestM: HEADLINE.twoYearUndergrad2022M,
    changePct: HEADLINE.twoYearDropPct,
  },
  {
    id: "fourYear" as const,
    label: "4-year institutions",
    short: "4-year",
    color: "#0f766e",
    peakM: HEADLINE.fourYearUndergrad2010M,
    latestM: HEADLINE.fourYearUndergrad2022M,
    changePct: HEADLINE.fourYearChangePct,
  },
];

export const IMMEDIATE_PATH = COHORT_YEARS.map((y) => ({
  year: y.year,
  total: y.immediateTotalPct,
  twoYear: y.immediate2yrPct,
  fourYear: y.immediate4yrPct,
})).concat(
  COMPLETER_EXTENSION.map((y) => ({
    year: y.year,
    total: y.immediateTotalPct,
    twoYear: y.immediate2yrPct,
    fourYear: y.immediate4yrPct,
  })),
);

export const GAP_ANCHORS = [
  {
    id: "peak",
    label: "2010 peak undergrad",
    undergradM: HEADLINE.peakUndergradM,
    note: "IPEDS fall headcount high",
  },
  {
    id: "counterfactual",
    label: "2022 × 2010 ratio",
    undergradM: HEADLINE.counterfactual2022M,
    note: "If 2022 completers still supported 5.72 undergrads each",
  },
  {
    id: "actual",
    label: "2022 actual undergrad",
    undergradM: HEADLINE.troughUndergradM,
    note: "Observed IPEDS fall headcount",
  },
] as const;

export const SUMMARY_TABLE = [
  {
    year: 2010,
    undergradM: 18.082,
    hsCompletersK: 3160,
    ratio: 5.72,
    immediatePct: 68.1,
    twoYearM: 7.684,
    fourYearM: 10.399,
  },
  {
    year: 2015,
    undergradM: 17.047,
    hsCompletersK: 2965,
    ratio: 5.75,
    immediatePct: 69.2,
    twoYearM: 6.499,
    fourYearM: 10.547,
  },
  {
    year: 2019,
    undergradM: 16.558,
    hsCompletersK: 3178,
    ratio: 5.21,
    immediatePct: 66.2,
    twoYearM: 5.591,
    fourYearM: 10.967,
  },
  {
    year: 2020,
    undergradM: 15.885,
    hsCompletersK: 3118,
    ratio: 5.09,
    immediatePct: 62.7,
    twoYearM: 4.932,
    fourYearM: 10.953,
  },
  {
    year: 2021,
    undergradM: 15.448,
    hsCompletersK: 2731,
    ratio: 5.66,
    immediatePct: 61.8,
    twoYearM: 4.684,
    fourYearM: 10.764,
  },
  {
    year: 2022,
    undergradM: 15.397,
    hsCompletersK: 2987,
    ratio: 5.15,
    immediatePct: 62.0,
    twoYearM: 4.657,
    fourYearM: 10.74,
  },
] as const;
