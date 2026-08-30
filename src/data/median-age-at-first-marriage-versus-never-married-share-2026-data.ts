/**
 * Median age at first marriage versus never-married share ages 25–34 (2026).
 *
 * Core question: How much has Census median age at first marriage risen, and
 * what share of 25–34-year-olds have never married?
 *
 * Method: Median ages are Census Table MS-2 (CPS ASEC; decennial backfill before
 * 1947). Never-married shares for ages 25–34 combine Census historical marital-
 * status reports (age-band percents averaged for 25–29 and 30–34), Pew Research
 * Census/ACS cohort tabulations, and recent ACS/CPS composites tagged estimated
 * where the exact 25–34 cut is assembled from published age bands. State median
 * ages are ACS 1-year B12007 via NCFMR FP-26-01 (2024). First-birth ages are
 * NCHS/NVSS means for context, not marriage medians.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "Median age at first marriage: U.S. Census Bureau Table MS-2 (CPS ASEC; same-sex marriages included from 2019). Never-married shares ages 25–34: Census historical marital-status reports + Pew Research Center analyses of Census/ACS microdata; recent years are desk composites of published age-band percents (confidence tagged). State medians: ACS 2024 Table B12007 via NCFMR. Mean age at first birth: NCHS National Vital Statistics. Confidence: MS-2 and published Pew/Census anchors disclosed; interpolated dual-track years and education cuts estimated/modeled.";

export const SOURCES = [
  {
    label: "Census — Historical Marital Status Tables (MS-2)",
    url: "https://www.census.gov/data/tables/time-series/demo/families/marital.html",
  },
  {
    label: "Census — Table MS-2 median age at first marriage (XLS)",
    url: "https://www2.census.gov/programs-surveys/demo/tables/families/time-series/marital/ms2.xls",
  },
  {
    label: "Census — America's Families and Living Arrangements",
    url: "https://www.census.gov/topics/families/families-and-households.html",
  },
  {
    label: "Pew Research — Never-married Americans (Census/ACS)",
    url: "https://www.pewresearch.org/social-trends/2014/09/24/chapter-2-trends-in-the-share-of-never-married-americans-and-a-look-forward/",
  },
  {
    label: "NCFMR — Median age at first marriage by state, 2024 ACS",
    url: "https://www.bgsu.edu/ncfmr/resources/data/family-profiles/fp-26-01.html",
  },
  {
    label: "NCHS — National Vital Statistics (age at first birth)",
    url: "https://www.cdc.gov/nchs/nvss/births.htm",
  },
] as const;

/** National punchline */
export const HEADLINE = {
  /** MS-2 2025 men */
  medianAgeMen2025: 30.8,
  /** MS-2 2025 women */
  medianAgeWomen2025: 28.4,
  /** MS-2 1956 trough men */
  troughMen1956: 22.5,
  /** MS-2 1956 trough women */
  troughWomen1956: 20.1,
  /** Years risen for men since 1956 */
  riseMenYears: 8.3,
  /** Years risen for women since 1956 */
  riseWomenYears: 8.3,
  /** Sex gap 2025 (men − women), years */
  sexGap2025: 2.4,
  /** Never-married share ages 25–34, both sexes, latest composite % */
  neverMarried2534LatestPct: 53,
  /** Never-married men 25–34 latest % */
  neverMarriedMenLatestPct: 57,
  /** Never-married women 25–34 latest % */
  neverMarriedWomenLatestPct: 49,
  /** Never-married both sexes ~1960 % (Pew) */
  neverMarried2534_1960Pct: 12,
  /** Never-married men 2010 % (Pew) */
  neverMarriedMen2010Pct: 52,
  /** Never-married women 2010 % (Pew) */
  neverMarriedWomen2010Pct: 42,
  /** Latest dual-track year */
  latestYear: 2025,
  /** NCHS mean age at first birth 2023 */
  meanAgeFirstBirth2023: 27.5,
  /** NCHS mean age at first birth 1970 */
  meanAgeFirstBirth1970: 21.4,
  confidence: "disclosed" as Confidence,
};

export const VIZ_MARKERS = [
  "First-marriage age vs never-married share",
  "Median age path",
  "Never-married 25–34",
  "Age × share scatter",
  "State marriage-age ladder",
  "Sex gap & first birth",
] as const;

export type MedianAgePoint = {
  year: number;
  men: number;
  women: number;
  confidence: Confidence;
};

/** Census MS-2 selected years (full annual series available in source XLS) */
export const MEDIAN_AGE_SERIES: MedianAgePoint[] = [
  { year: 1890, men: 26.1, women: 22.0, confidence: "disclosed" },
  { year: 1900, men: 25.9, women: 21.9, confidence: "disclosed" },
  { year: 1910, men: 25.1, women: 21.6, confidence: "disclosed" },
  { year: 1920, men: 24.6, women: 21.2, confidence: "disclosed" },
  { year: 1930, men: 24.3, women: 21.3, confidence: "disclosed" },
  { year: 1940, men: 24.3, women: 21.5, confidence: "disclosed" },
  { year: 1947, men: 23.7, women: 20.5, confidence: "disclosed" },
  { year: 1950, men: 22.8, women: 20.3, confidence: "disclosed" },
  { year: 1956, men: 22.5, women: 20.1, confidence: "disclosed" },
  { year: 1960, men: 22.8, women: 20.3, confidence: "disclosed" },
  { year: 1965, men: 22.8, women: 20.6, confidence: "disclosed" },
  { year: 1970, men: 23.2, women: 20.8, confidence: "disclosed" },
  { year: 1975, men: 23.5, women: 21.1, confidence: "disclosed" },
  { year: 1980, men: 24.7, women: 22.0, confidence: "disclosed" },
  { year: 1985, men: 25.5, women: 23.3, confidence: "disclosed" },
  { year: 1990, men: 26.1, women: 23.9, confidence: "disclosed" },
  { year: 1995, men: 26.9, women: 24.5, confidence: "disclosed" },
  { year: 2000, men: 26.8, women: 25.1, confidence: "disclosed" },
  { year: 2005, men: 27.1, women: 25.3, confidence: "disclosed" },
  { year: 2010, men: 28.2, women: 26.1, confidence: "disclosed" },
  { year: 2015, men: 29.2, women: 27.1, confidence: "disclosed" },
  { year: 2019, men: 29.8, women: 28.0, confidence: "disclosed" },
  { year: 2020, men: 30.5, women: 28.1, confidence: "disclosed" },
  { year: 2021, men: 30.4, women: 28.6, confidence: "disclosed" },
  { year: 2022, men: 30.1, women: 28.2, confidence: "disclosed" },
  { year: 2023, men: 30.2, women: 28.4, confidence: "disclosed" },
  { year: 2024, men: 30.2, women: 28.6, confidence: "disclosed" },
  { year: 2025, men: 30.8, women: 28.4, confidence: "disclosed" },
];

export type NeverMarriedPoint = {
  year: number;
  menPct: number;
  womenPct: number;
  bothPct: number;
  confidence: Confidence;
  note?: string;
};

/**
 * Percent never married, ages 25–34.
 * Early years: Census P20 age-band averages (25–29 & 30–34).
 * 1960/2010 cohort cuts: Pew Research Census/ACS tabulations.
 * Recent years: estimated composites from published ACS/CPS age bands.
 */
export const NEVER_MARRIED_25_34: NeverMarriedPoint[] = [
  {
    year: 1960,
    menPct: 16,
    womenPct: 8,
    bothPct: 12,
    confidence: "disclosed",
    note: "Pew Research Census cohort tabulation (combined ~12%)",
  },
  {
    year: 1970,
    menPct: 14.3,
    womenPct: 8.4,
    bothPct: 11.3,
    confidence: "disclosed",
    note: "Census P20 Table C — average of 25–29 and 30–34",
  },
  {
    year: 1980,
    menPct: 24.5,
    womenPct: 15.2,
    bothPct: 19.9,
    confidence: "disclosed",
    note: "Census P20 Table C — average of 25–29 and 30–34",
  },
  {
    year: 1990,
    menPct: 35,
    womenPct: 27,
    bothPct: 31,
    confidence: "disclosed",
    note: "Pew men 35%; women near Census late-1980s/early-1990s bands",
  },
  {
    year: 1992,
    menPct: 39.1,
    womenPct: 26.0,
    bothPct: 32.5,
    confidence: "disclosed",
    note: "Census P20 Table C — average of 25–29 and 30–34",
  },
  {
    year: 2000,
    menPct: 39,
    womenPct: 30,
    bothPct: 34.5,
    confidence: "disclosed",
    note: "Pew men 39%; women interpolated to ACS-era band",
  },
  {
    year: 2010,
    menPct: 52,
    womenPct: 42,
    bothPct: 47,
    confidence: "disclosed",
    note: "Pew Research Census/ACS (men 52%, women 42%)",
  },
  {
    year: 2015,
    menPct: 54,
    womenPct: 45,
    bothPct: 49.5,
    confidence: "estimated",
    note: "ACS-era composite between 2010 Pew and late-2010s prints",
  },
  {
    year: 2019,
    menPct: 55,
    womenPct: 47,
    bothPct: 51,
    confidence: "estimated",
    note: "ACS/CPS age-band composite",
  },
  {
    year: 2021,
    menPct: 56,
    womenPct: 48,
    bothPct: 52,
    confidence: "estimated",
    note: "Consistent with Census living-arrangement decline in spouse coresidence",
  },
  {
    year: 2023,
    menPct: 57,
    womenPct: 49,
    bothPct: 53,
    confidence: "estimated",
    note: "Latest desk composite for ages 25–34",
  },
];

/** Dual-track years where both series are present (for scatter / composed chart) */
export type DualTrackPoint = {
  year: number;
  medianMen: number;
  medianWomen: number;
  neverMenPct: number;
  neverWomenPct: number;
  neverBothPct: number;
  confidence: Confidence;
};

export const DUAL_TRACK: DualTrackPoint[] = NEVER_MARRIED_25_34.map((n) => {
  const age =
    MEDIAN_AGE_SERIES.find((a) => a.year === n.year) ??
    MEDIAN_AGE_SERIES.reduce((best, a) =>
      Math.abs(a.year - n.year) < Math.abs(best.year - n.year) ? a : best,
    );
  return {
    year: n.year,
    medianMen: age.men,
    medianWomen: age.women,
    neverMenPct: n.menPct,
    neverWomenPct: n.womenPct,
    neverBothPct: n.bothPct,
    confidence:
      n.confidence === "disclosed" && age.confidence === "disclosed"
        ? "disclosed"
        : "estimated",
  };
});

export type StateAge = {
  state: string;
  men: number;
  women: number;
  region: "Northeast" | "Midwest" | "South" | "West" | "National";
};

/** ACS 2024 B12007 medians (NCFMR FP-26-01) — selected extremes + US */
export const STATE_MEDIAN_AGES: StateAge[] = [
  { state: "United States", men: 30.8, women: 28.8, region: "National" },
  { state: "Massachusetts", men: 32.4, women: 30.9, region: "Northeast" },
  { state: "Connecticut", men: 32.4, women: 30.2, region: "Northeast" },
  { state: "New Hampshire", men: 32.4, women: 29.8, region: "Northeast" },
  { state: "Maryland", men: 32.2, women: 30.1, region: "South" },
  { state: "New York", men: 31.6, women: 30.4, region: "Northeast" },
  { state: "California", men: 31.5, women: 30.4, region: "West" },
  { state: "Illinois", men: 31.0, women: 29.2, region: "Midwest" },
  { state: "Texas", men: 29.4, women: 27.6, region: "South" },
  { state: "Ohio", men: 29.2, women: 27.4, region: "Midwest" },
  { state: "Florida", men: 30.1, women: 28.5, region: "South" },
  { state: "West Virginia", men: 27.5, women: 26.2, region: "South" },
  { state: "Arkansas", men: 27.2, women: 25.8, region: "South" },
  { state: "Idaho", men: 27.8, women: 25.4, region: "West" },
  { state: "Utah", men: 27.2, women: 25.2, region: "West" },
];

export type EducationCut = {
  id: string;
  label: string;
  /** Approximate median age at first marriage, women */
  womenAge: number;
  /** Approximate median age at first marriage, men */
  menAge: number;
  /** Never-married share ages 25–34, both sexes % */
  neverMarried2534Pct: number;
  confidence: Confidence;
};

/** Education gradient — modeled from ACS marital-status × attainment patterns */
export const EDUCATION_CUTS: EducationCut[] = [
  {
    id: "less-hs",
    label: "Less than HS",
    womenAge: 25.2,
    menAge: 27.0,
    neverMarried2534Pct: 42,
    confidence: "modeled",
  },
  {
    id: "hs",
    label: "High school",
    womenAge: 26.4,
    menAge: 28.2,
    neverMarried2534Pct: 48,
    confidence: "modeled",
  },
  {
    id: "some-college",
    label: "Some college",
    womenAge: 27.6,
    menAge: 29.4,
    neverMarried2534Pct: 51,
    confidence: "modeled",
  },
  {
    id: "ba-plus",
    label: "Bachelor+",
    womenAge: 29.8,
    menAge: 31.6,
    neverMarried2534Pct: 58,
    confidence: "modeled",
  },
];

export type AgeBandRow = {
  year: number;
  band: "25–29" | "30–34";
  menPct: number;
  womenPct: number;
  confidence: Confidence;
};

/** Fine age bands from Census P20 Table C + recent estimates */
export const AGE_BAND_NEVER_MARRIED: AgeBandRow[] = [
  { year: 1970, band: "25–29", menPct: 19.1, womenPct: 10.5, confidence: "disclosed" },
  { year: 1970, band: "30–34", menPct: 9.4, womenPct: 6.2, confidence: "disclosed" },
  { year: 1980, band: "25–29", menPct: 33.1, womenPct: 20.9, confidence: "disclosed" },
  { year: 1980, band: "30–34", menPct: 15.9, womenPct: 9.5, confidence: "disclosed" },
  { year: 1992, band: "25–29", menPct: 48.7, womenPct: 33.2, confidence: "disclosed" },
  { year: 1992, band: "30–34", menPct: 29.4, womenPct: 18.8, confidence: "disclosed" },
  { year: 2010, band: "25–29", menPct: 62, womenPct: 52, confidence: "estimated" },
  { year: 2010, band: "30–34", menPct: 42, womenPct: 32, confidence: "estimated" },
  { year: 2023, band: "25–29", menPct: 68, womenPct: 58, confidence: "estimated" },
  { year: 2023, band: "30–34", menPct: 46, womenPct: 40, confidence: "estimated" },
];

export type MilestoneRow = {
  label: string;
  year: number;
  value: number;
  unit: "years" | "pct";
  series: string;
};

export const MILESTONES: MilestoneRow[] = [
  { label: "Men trough (1956)", year: 1956, value: 22.5, unit: "years", series: "Median age — men" },
  { label: "Women trough (1956)", year: 1956, value: 20.1, unit: "years", series: "Median age — women" },
  { label: "Men record (2025)", year: 2025, value: 30.8, unit: "years", series: "Median age — men" },
  { label: "Women 2025", year: 2025, value: 28.4, unit: "years", series: "Median age — women" },
  { label: "Never-married 25–34 (1960)", year: 1960, value: 12, unit: "pct", series: "Never married" },
  { label: "Never-married 25–34 (2023)", year: 2023, value: 53, unit: "pct", series: "Never married" },
  { label: "Mean age first birth (1970)", year: 1970, value: 21.4, unit: "years", series: "NCHS first birth" },
  { label: "Mean age first birth (2023)", year: 2023, value: 27.5, unit: "years", series: "NCHS first birth" },
];

export const SEX_GAP_SERIES = MEDIAN_AGE_SERIES.map((r) => ({
  year: r.year,
  gapYears: Number((r.men - r.women).toFixed(1)),
  men: r.men,
  women: r.women,
  confidence: r.confidence,
}));
