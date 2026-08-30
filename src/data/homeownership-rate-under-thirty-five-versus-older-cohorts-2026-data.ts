/**
 * Homeownership rate under 35 versus older cohorts (2026).
 *
 * Core question: How large is the Census homeownership gap between householders
 * under 35 and those 65+, and did it widen since 2019?
 *
 * Primary series: Census CPS/HVS Table 19 (quarterly homeownership rates by age
 * of householder, 1994-present). Annual rows are simple averages of available
 * quarters. FHFA purchase-only seasonally adjusted HPI (FRED) pairs prices with
 * the under-35 rate. ACS tenure-by-age rows are desk composites from Census ACS
 * Table B25007. Regional age cuts tagged estimated where published HVS region
 * age detail is incomplete.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "Census CPS/HVS Table 19 quarterly homeownership rates by age of householder (histtab19.xlsx, through 2026 Q2). Annual averages computed from published quarters. FHFA purchase-only SA House Price Index via FRED. ACS tenure by age: Census ACS Table B25007 composites. Regional under-35 / 65+ cuts estimated from HVS regional tables where age detail is thin. Confidence tagged per series.";

export const SOURCES = [
  {
    label: "Census - HVS historical Table 19 (rates by age)",
    url: "https://www.census.gov/housing/hvs/data/histtabs.html",
  },
  {
    label: "Census - Quarterly vacancies & homeownership press (2026 Q2)",
    url: "https://www.census.gov/housing/hvs/files/currenthvspress.pdf",
  },
  {
    label: "Census - ACS tenure by age of householder (B25007)",
    url: "https://data.census.gov/",
  },
  {
    label: "FHFA - House Price Index (purchase-only)",
    url: "https://www.fhfa.gov/data/hpi",
  },
  {
    label: "FRED - Purchase-Only House Price Index (US)",
    url: "https://fred.stlouisfed.org/series/USSTHPI",
  },
] as const;

export const HEADLINE = {
  under35_2026q2: 35.2,
  age65plus_2026q2: 78.6,
  gap_2026q2: 43.4,
  under35_2019_annual: 36.73,
  age65plus_2019_annual: 78.6,
  gap_2019_annual: 41.87,
  under35_2019q2: 36.4,
  age65plus_2019q2: 78.0,
  gap_2019q2: 41.6,
  gapWidenPpSince2019q2: 1.8,
  under35DeltaSince2019q2: -1.2,
  age65DeltaSince2019q2: 0.6,
  us_2026q2: 65.0,
  fhfaCumPctSince2019: 64.7,
  peakUnder35Annual: 43.08,
  peakUnder35Year: 2004,
  troughGapYear: 2005,
  troughGapPp: 37.52,
  peakGapYear: 2012,
  peakGapPp: 44.48,
  latestLabel: "2026 Q2",
  confidence: "disclosed" as Confidence,
};

export const VIZ_MARKERS = [
  "Age ladder snapshot",
  "Under-35 vs 65+ dual path",
  "Ownership gap since 1994",
  "Prices vs young owners",
  "ACS vs HVS check",
  "Regional age gap",
] as const;

export type AgeRatePoint = {
  year: number;
  us: number;
  under35: number;
  age3544: number;
  age4554: number;
  age5564: number;
  age65plus: number;
  gap6535: number;
  quarters: number;
  confidence: Confidence;
};

export type QuarterlyAgePoint = {
  year: number;
  quarter: number;
  label: string;
  us: number;
  under35: number;
  age3544: number;
  age4554: number;
  age5564: number;
  age65plus: number;
  gap6535: number;
  confidence: Confidence;
};


/** Annual averages of HVS Table 19 quarters (1994–2026; 2026 = H1). */
export const ANNUAL_BY_AGE: AgeRatePoint[] = [
  { year: 1994, us: 63.97, under35: 37.35, age3544: 64.5, age4554: 75.15, age5564: 79.25, age65plus: 77.38, gap6535: 40.03, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 1995, us: 64.75, under35: 38.65, age3544: 65.22, age4554: 75.18, age5564: 79.53, age65plus: 78.1, gap6535: 39.45, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 1996, us: 65.38, under35: 39.05, age3544: 65.47, age4554: 75.62, age5564: 80.0, age65plus: 78.95, gap6535: 39.9, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 1997, us: 65.7, under35: 38.7, age3544: 66.05, age4554: 75.78, age5564: 80.07, age65plus: 79.15, gap6535: 40.45, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 1998, us: 66.28, under35: 39.35, age3544: 66.88, age4554: 75.65, age5564: 80.88, age65plus: 79.3, gap6535: 39.95, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 1999, us: 66.8, under35: 39.73, age3544: 67.2, age4554: 76.03, age5564: 80.97, age65plus: 80.15, gap6535: 40.42, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2000, us: 67.38, under35: 40.75, age3544: 67.88, age4554: 76.47, age5564: 80.35, age65plus: 80.38, gap6535: 39.63, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2001, us: 68.2, under35: 42.02, age3544: 68.55, age4554: 76.5, age5564: 81.22, age65plus: 80.65, gap6535: 38.63, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2003, us: 67.97, under35: 41.5, age3544: 68.4, age4554: 76.4, age5564: 81.25, age65plus: 80.38, gap6535: 38.88, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2004, us: 69.0, under35: 43.08, age3544: 69.2, age4554: 77.2, age5564: 81.72, age65plus: 81.03, gap6535: 37.95, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2005, us: 68.88, under35: 43.05, age3544: 69.28, age4554: 76.55, age5564: 81.15, age65plus: 80.57, gap6535: 37.52, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2006, us: 68.78, under35: 42.62, age3544: 68.88, age4554: 76.22, age5564: 80.9, age65plus: 80.9, gap6535: 38.28, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2007, us: 68.15, under35: 41.65, age3544: 67.8, age4554: 75.4, age5564: 80.62, age65plus: 80.4, gap6535: 38.75, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2008, us: 67.83, under35: 40.95, age3544: 67.03, age4554: 75.03, age5564: 80.05, age65plus: 80.15, gap6535: 39.2, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2009, us: 67.38, under35: 39.75, age3544: 66.17, age4554: 74.4, age5564: 79.5, age65plus: 80.48, gap6535: 40.73, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2010, us: 66.85, under35: 39.08, age3544: 65.0, age4554: 73.53, age5564: 79.0, age65plus: 80.53, gap6535: 41.45, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2011, us: 66.15, under35: 37.75, age3544: 63.48, age4554: 72.7, age5564: 78.5, age65plus: 80.95, gap6535: 43.2, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2012, us: 65.45, under35: 36.67, age3544: 61.45, age4554: 71.7, age5564: 77.35, age65plus: 81.15, gap6535: 44.48, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2013, us: 65.12, under35: 36.77, age3544: 60.6, age4554: 71.22, age5564: 76.6, age65plus: 80.8, gap6535: 44.03, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2014, us: 64.47, under35: 35.85, age3544: 59.7, age4554: 70.67, age5564: 76.3, age65plus: 79.88, gap6535: 44.03, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2015, us: 63.65, under35: 34.98, age3544: 58.45, age4554: 70.0, age5564: 75.42, age65plus: 78.88, gap6535: 43.9, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2016, us: 63.4, under35: 34.55, age3544: 58.58, age4554: 69.3, age5564: 75.03, age65plus: 78.8, gap6535: 44.25, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2017, us: 63.85, under35: 35.3, age3544: 59.0, age4554: 69.33, age5564: 75.33, age65plus: 78.72, gap6535: 43.42, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2018, us: 64.42, under35: 36.27, age3544: 60.1, age4554: 70.1, age5564: 75.4, age65plus: 78.47, gap6535: 42.2, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2019, us: 64.55, under35: 36.73, age3544: 60.1, age4554: 70.07, age5564: 75.22, age65plus: 78.6, gap6535: 41.87, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2020, us: 66.6, under35: 39.15, age3544: 62.67, age4554: 71.08, age5564: 76.53, age65plus: 80.0, gap6535: 40.85, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2021, us: 65.47, under35: 38.17, age3544: 61.5, age4554: 69.72, age5564: 75.03, age65plus: 79.5, gap6535: 41.33, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2022, us: 65.78, under35: 38.98, age3544: 62.23, age4554: 70.5, age5564: 75.1, age65plus: 79.1, gap6535: 40.12, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2023, us: 65.9, under35: 38.55, age3544: 62.65, age4554: 70.55, age5564: 75.75, age65plus: 78.97, gap6535: 40.42, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2024, us: 65.62, under35: 37.1, age3544: 61.83, age4554: 70.65, age5564: 76.08, age65plus: 78.97, gap6535: 41.87, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2025, us: 65.28, under35: 37.1, age3544: 60.83, age4554: 69.83, age5564: 75.92, age65plus: 78.62, gap6535: 41.52, quarters: 4, confidence: "disclosed" as Confidence },
  { year: 2026, us: 65.15, under35: 36.0, age3544: 61.0, age4554: 69.45, age5564: 75.35, age65plus: 78.5, gap6535: 42.5, quarters: 2, confidence: "estimated" as Confidence },
];

/** Quarterly HVS rates from 2019 Q1 through 2026 Q2. */
export const QUARTERLY_SINCE_2019: QuarterlyAgePoint[] = [
  { year: 2019, quarter: 1, label: "2019 Q1", us: 64.2, under35: 35.4, age3544: 60.3, age4554: 69.5, age5564: 75.4, age65plus: 78.5, gap6535: 43.1, confidence: "disclosed" as Confidence },
  { year: 2019, quarter: 2, label: "2019 Q2", us: 64.1, under35: 36.4, age3544: 59.4, age4554: 70.1, age5564: 74.8, age65plus: 78.0, gap6535: 41.6, confidence: "disclosed" as Confidence },
  { year: 2019, quarter: 3, label: "2019 Q3", us: 64.8, under35: 37.5, age3544: 60.3, age4554: 70.1, age5564: 75.1, age65plus: 78.9, gap6535: 41.4, confidence: "disclosed" as Confidence },
  { year: 2019, quarter: 4, label: "2019 Q4", us: 65.1, under35: 37.6, age3544: 60.4, age4554: 70.6, age5564: 75.6, age65plus: 79.0, gap6535: 41.4, confidence: "disclosed" as Confidence },
  { year: 2020, quarter: 1, label: "2020 Q1", us: 65.3, under35: 37.3, age3544: 61.5, age4554: 70.3, age5564: 76.3, age65plus: 78.7, gap6535: 41.4, confidence: "disclosed" as Confidence },
  { year: 2020, quarter: 2, label: "2020 Q2", us: 67.9, under35: 40.6, age3544: 64.3, age4554: 72.2, age5564: 77.4, age65plus: 80.4, gap6535: 39.8, confidence: "disclosed" as Confidence },
  { year: 2020, quarter: 3, label: "2020 Q3", us: 67.4, under35: 40.2, age3544: 63.9, age4554: 72.0, age5564: 76.4, age65plus: 80.7, gap6535: 40.5, confidence: "disclosed" as Confidence },
  { year: 2020, quarter: 4, label: "2020 Q4", us: 65.8, under35: 38.5, age3544: 61.0, age4554: 69.8, age5564: 76.0, age65plus: 80.2, gap6535: 41.7, confidence: "disclosed" as Confidence },
  { year: 2021, quarter: 1, label: "2021 Q1", us: 65.6, under35: 38.1, age3544: 62.0, age4554: 69.4, age5564: 75.7, age65plus: 79.3, gap6535: 41.2, confidence: "disclosed" as Confidence },
  { year: 2021, quarter: 2, label: "2021 Q2", us: 65.4, under35: 37.8, age3544: 61.3, age4554: 69.4, age5564: 75.4, age65plus: 79.6, gap6535: 41.8, confidence: "disclosed" as Confidence },
  { year: 2021, quarter: 3, label: "2021 Q3", us: 65.4, under35: 38.5, age3544: 61.3, age4554: 70.1, age5564: 73.7, age65plus: 79.7, gap6535: 41.2, confidence: "disclosed" as Confidence },
  { year: 2021, quarter: 4, label: "2021 Q4", us: 65.5, under35: 38.3, age3544: 61.4, age4554: 70.0, age5564: 75.3, age65plus: 79.4, gap6535: 41.1, confidence: "disclosed" as Confidence },
  { year: 2022, quarter: 1, label: "2022 Q1", us: 65.4, under35: 38.8, age3544: 62.3, age4554: 69.4, age5564: 75.0, age65plus: 78.6, gap6535: 39.8, confidence: "disclosed" as Confidence },
  { year: 2022, quarter: 2, label: "2022 Q2", us: 65.8, under35: 39.1, age3544: 61.9, age4554: 70.6, age5564: 75.1, age65plus: 79.3, gap6535: 40.2, confidence: "disclosed" as Confidence },
  { year: 2022, quarter: 3, label: "2022 Q3", us: 66.0, under35: 39.3, age3544: 62.5, age4554: 71.4, age5564: 74.6, age65plus: 79.5, gap6535: 40.2, confidence: "disclosed" as Confidence },
  { year: 2022, quarter: 4, label: "2022 Q4", us: 65.9, under35: 38.7, age3544: 62.2, age4554: 70.6, age5564: 75.7, age65plus: 79.0, gap6535: 40.3, confidence: "disclosed" as Confidence },
  { year: 2023, quarter: 1, label: "2023 Q1", us: 66.0, under35: 39.3, age3544: 62.6, age4554: 70.1, age5564: 76.1, age65plus: 78.8, gap6535: 39.5, confidence: "disclosed" as Confidence },
  { year: 2023, quarter: 2, label: "2023 Q2", us: 65.9, under35: 38.5, age3544: 63.1, age4554: 70.8, age5564: 75.5, age65plus: 78.9, gap6535: 40.4, confidence: "disclosed" as Confidence },
  { year: 2023, quarter: 3, label: "2023 Q3", us: 66.0, under35: 38.3, age3544: 62.9, age4554: 71.0, age5564: 75.4, age65plus: 79.2, gap6535: 40.9, confidence: "disclosed" as Confidence },
  { year: 2023, quarter: 4, label: "2023 Q4", us: 65.7, under35: 38.1, age3544: 62.0, age4554: 70.3, age5564: 76.0, age65plus: 79.0, gap6535: 40.9, confidence: "disclosed" as Confidence },
  { year: 2024, quarter: 1, label: "2024 Q1", us: 65.6, under35: 37.7, age3544: 61.4, age4554: 70.8, age5564: 76.3, age65plus: 78.7, gap6535: 41.0, confidence: "disclosed" as Confidence },
  { year: 2024, quarter: 2, label: "2024 Q2", us: 65.6, under35: 37.4, age3544: 62.2, age4554: 71.1, age5564: 75.8, age65plus: 78.6, gap6535: 41.2, confidence: "disclosed" as Confidence },
  { year: 2024, quarter: 3, label: "2024 Q3", us: 65.6, under35: 37.0, age3544: 62.3, age4554: 69.7, age5564: 75.9, age65plus: 79.1, gap6535: 42.1, confidence: "disclosed" as Confidence },
  { year: 2024, quarter: 4, label: "2024 Q4", us: 65.7, under35: 36.3, age3544: 61.4, age4554: 71.0, age5564: 76.3, age65plus: 79.5, gap6535: 43.2, confidence: "disclosed" as Confidence },
  { year: 2025, quarter: 1, label: "2025 Q1", us: 65.1, under35: 36.6, age3544: 60.3, age4554: 70.6, age5564: 75.2, age65plus: 79.0, gap6535: 42.4, confidence: "disclosed" as Confidence },
  { year: 2025, quarter: 2, label: "2025 Q2", us: 65.0, under35: 36.4, age3544: 61.0, age4554: 69.2, age5564: 75.8, age65plus: 78.6, gap6535: 42.2, confidence: "disclosed" as Confidence },
  { year: 2025, quarter: 3, label: "2025 Q3", us: 65.3, under35: 37.5, age3544: 61.1, age4554: 70.0, age5564: 76.0, age65plus: 77.9, gap6535: 40.4, confidence: "disclosed" as Confidence },
  { year: 2025, quarter: 4, label: "2025 Q4", us: 65.7, under35: 37.9, age3544: 60.9, age4554: 69.5, age5564: 76.7, age65plus: 79.0, gap6535: 41.1, confidence: "disclosed" as Confidence },
  { year: 2026, quarter: 1, label: "2026 Q1", us: 65.3, under35: 36.8, age3544: 61.1, age4554: 69.2, age5564: 75.6, age65plus: 78.4, gap6535: 41.6, confidence: "disclosed" as Confidence },
  { year: 2026, quarter: 2, label: "2026 Q2", us: 65.0, under35: 35.2, age3544: 60.9, age4554: 69.7, age5564: 75.1, age65plus: 78.6, gap6535: 43.4, confidence: "disclosed" as Confidence },
];

/** Second-quarter snapshots for long dual-path chart. */
export const Q2_SNAPSHOTS: QuarterlyAgePoint[] = [
  { year: 1994, quarter: 2, label: "1994 Q2", us: 63.8, under35: 36.8, age3544: 64.6, age4554: 75.2, age5564: 79.1, age65plus: 77.2, gap6535: 40.4, confidence: "disclosed" as Confidence },
  { year: 1995, quarter: 2, label: "1995 Q2", us: 64.7, under35: 38.7, age3544: 65.1, age4554: 75.2, age5564: 79.9, age65plus: 78.1, gap6535: 39.4, confidence: "disclosed" as Confidence },
  { year: 1996, quarter: 2, label: "1996 Q2", us: 65.4, under35: 39.3, age3544: 65.5, age4554: 75.5, age5564: 80.0, age65plus: 78.9, gap6535: 39.6, confidence: "disclosed" as Confidence },
  { year: 1997, quarter: 2, label: "1997 Q2", us: 65.7, under35: 38.6, age3544: 66.3, age4554: 75.6, age5564: 80.3, age65plus: 79.1, gap6535: 40.5, confidence: "disclosed" as Confidence },
  { year: 1998, quarter: 2, label: "1998 Q2", us: 66.0, under35: 39.3, age3544: 66.2, age4554: 75.5, age5564: 80.4, age65plus: 79.2, gap6535: 39.9, confidence: "disclosed" as Confidence },
  { year: 1999, quarter: 2, label: "1999 Q2", us: 66.6, under35: 39.1, age3544: 66.5, age4554: 76.4, age5564: 80.8, age65plus: 80.4, gap6535: 41.3, confidence: "disclosed" as Confidence },
  { year: 2000, quarter: 2, label: "2000 Q2", us: 67.2, under35: 40.2, age3544: 67.5, age4554: 76.7, age5564: 80.3, age65plus: 80.3, gap6535: 40.1, confidence: "disclosed" as Confidence },
  { year: 2001, quarter: 2, label: "2001 Q2", us: 68.0, under35: 41.9, age3544: 67.8, age4554: 76.3, age5564: 81.6, age65plus: 80.2, gap6535: 38.3, confidence: "disclosed" as Confidence },
  { year: 2003, quarter: 2, label: "2003 Q2", us: 67.6, under35: 40.8, age3544: 68.2, age4554: 76.3, age5564: 80.8, age65plus: 80.1, gap6535: 39.3, confidence: "disclosed" as Confidence },
  { year: 2004, quarter: 2, label: "2004 Q2", us: 69.2, under35: 43.6, age3544: 69.4, age4554: 77.0, age5564: 82.4, age65plus: 81.1, gap6535: 37.5, confidence: "disclosed" as Confidence },
  { year: 2005, quarter: 2, label: "2005 Q2", us: 68.6, under35: 42.8, age3544: 68.7, age4554: 76.3, age5564: 81.3, age65plus: 80.3, gap6535: 37.5, confidence: "disclosed" as Confidence },
  { year: 2006, quarter: 2, label: "2006 Q2", us: 68.7, under35: 42.4, age3544: 68.9, age4554: 76.3, age5564: 81.0, age65plus: 80.6, gap6535: 38.2, confidence: "disclosed" as Confidence },
  { year: 2007, quarter: 2, label: "2007 Q2", us: 68.2, under35: 41.9, age3544: 67.6, age4554: 75.5, age5564: 80.6, age65plus: 80.5, gap6535: 38.6, confidence: "disclosed" as Confidence },
  { year: 2008, quarter: 2, label: "2008 Q2", us: 68.1, under35: 41.2, age3544: 67.6, age4554: 75.4, age5564: 80.1, age65plus: 80.2, gap6535: 39.0, confidence: "disclosed" as Confidence },
  { year: 2009, quarter: 2, label: "2009 Q2", us: 67.4, under35: 39.0, age3544: 66.8, age4554: 74.5, age5564: 79.9, age65plus: 80.4, gap6535: 41.4, confidence: "disclosed" as Confidence },
  { year: 2010, quarter: 2, label: "2010 Q2", us: 66.9, under35: 39.0, age3544: 65.6, age4554: 73.6, age5564: 78.7, age65plus: 80.4, gap6535: 41.4, confidence: "disclosed" as Confidence },
  { year: 2011, quarter: 2, label: "2011 Q2", us: 65.9, under35: 37.5, age3544: 63.8, age4554: 72.3, age5564: 77.8, age65plus: 80.8, gap6535: 43.3, confidence: "disclosed" as Confidence },
  { year: 2012, quarter: 2, label: "2012 Q2", us: 65.5, under35: 36.5, age3544: 62.2, age4554: 71.4, age5564: 77.1, age65plus: 81.6, gap6535: 45.1, confidence: "disclosed" as Confidence },
  { year: 2013, quarter: 2, label: "2013 Q2", us: 65.0, under35: 36.7, age3544: 60.3, age4554: 70.9, age5564: 76.7, age65plus: 80.9, gap6535: 44.2, confidence: "disclosed" as Confidence },
  { year: 2014, quarter: 2, label: "2014 Q2", us: 64.7, under35: 35.9, age3544: 60.2, age4554: 70.7, age5564: 76.4, age65plus: 80.1, gap6535: 44.2, confidence: "disclosed" as Confidence },
  { year: 2015, quarter: 2, label: "2015 Q2", us: 63.4, under35: 34.8, age3544: 58.0, age4554: 69.9, age5564: 75.4, age65plus: 78.5, gap6535: 43.7, confidence: "disclosed" as Confidence },
  { year: 2016, quarter: 2, label: "2016 Q2", us: 62.9, under35: 34.1, age3544: 58.3, age4554: 69.1, age5564: 74.7, age65plus: 77.9, gap6535: 43.8, confidence: "disclosed" as Confidence },
  { year: 2017, quarter: 2, label: "2017 Q2", us: 63.7, under35: 35.3, age3544: 58.8, age4554: 69.3, age5564: 75.4, age65plus: 78.2, gap6535: 42.9, confidence: "disclosed" as Confidence },
  { year: 2018, quarter: 2, label: "2018 Q2", us: 64.3, under35: 36.5, age3544: 60.0, age4554: 70.6, age5564: 75.1, age65plus: 78.0, gap6535: 41.5, confidence: "disclosed" as Confidence },
  { year: 2019, quarter: 2, label: "2019 Q2", us: 64.1, under35: 36.4, age3544: 59.4, age4554: 70.1, age5564: 74.8, age65plus: 78.0, gap6535: 41.6, confidence: "disclosed" as Confidence },
  { year: 2020, quarter: 2, label: "2020 Q2", us: 67.9, under35: 40.6, age3544: 64.3, age4554: 72.2, age5564: 77.4, age65plus: 80.4, gap6535: 39.8, confidence: "disclosed" as Confidence },
  { year: 2021, quarter: 2, label: "2021 Q2", us: 65.4, under35: 37.8, age3544: 61.3, age4554: 69.4, age5564: 75.4, age65plus: 79.6, gap6535: 41.8, confidence: "disclosed" as Confidence },
  { year: 2022, quarter: 2, label: "2022 Q2", us: 65.8, under35: 39.1, age3544: 61.9, age4554: 70.6, age5564: 75.1, age65plus: 79.3, gap6535: 40.2, confidence: "disclosed" as Confidence },
  { year: 2023, quarter: 2, label: "2023 Q2", us: 65.9, under35: 38.5, age3544: 63.1, age4554: 70.8, age5564: 75.5, age65plus: 78.9, gap6535: 40.4, confidence: "disclosed" as Confidence },
  { year: 2024, quarter: 2, label: "2024 Q2", us: 65.6, under35: 37.4, age3544: 62.2, age4554: 71.1, age5564: 75.8, age65plus: 78.6, gap6535: 41.2, confidence: "disclosed" as Confidence },
  { year: 2025, quarter: 2, label: "2025 Q2", us: 65.0, under35: 36.4, age3544: 61.0, age4554: 69.2, age5564: 75.8, age65plus: 78.6, gap6535: 42.2, confidence: "disclosed" as Confidence },
  { year: 2026, quarter: 2, label: "2026 Q2", us: 65.0, under35: 35.2, age3544: 60.9, age4554: 69.7, age5564: 75.1, age65plus: 78.6, gap6535: 43.4, confidence: "disclosed" as Confidence },
];

export type LadderBand = {
  band: string;
  rate2019q2: number;
  rate2026q2: number;
  deltaPp: number;
  confidence: Confidence;
};

export const AGE_LADDER: LadderBand[] = [

  { band: "Under 35", rate2019q2: 36.4, rate2026q2: 35.2, deltaPp: -1.2, confidence: "disclosed" as Confidence },
  { band: "35–44", rate2019q2: 59.4, rate2026q2: 60.9, deltaPp: 1.5, confidence: "disclosed" as Confidence },
  { band: "45–54", rate2019q2: 70.1, rate2026q2: 69.7, deltaPp: -0.4, confidence: "disclosed" as Confidence },
  { band: "55–64", rate2019q2: 74.8, rate2026q2: 75.1, deltaPp: 0.3, confidence: "disclosed" as Confidence },
  { band: "65+", rate2019q2: 78.0, rate2026q2: 78.6, deltaPp: 0.6, confidence: "disclosed" as Confidence },
];

export type PriceOwnerPoint = {
  year: number;
  hpi: number;
  hpiCumPctVs2019: number;
  under35: number;
  age65plus: number;
  gap6535: number;
  confidence: Confidence;
};

export const PRICE_VS_YOUNG: PriceOwnerPoint[] = [

  { year: 2019, hpi: 263.66, hpiCumPctVs2019: 0.0, under35: 36.4, age65plus: 78.0, gap6535: 41.6, confidence: "disclosed" as Confidence },
  { year: 2020, hpi: 278.45, hpiCumPctVs2019: 5.6, under35: 40.6, age65plus: 80.4, gap6535: 39.8, confidence: "disclosed" as Confidence },
  { year: 2021, hpi: 326.77, hpiCumPctVs2019: 23.9, under35: 37.8, age65plus: 79.6, gap6535: 41.8, confidence: "disclosed" as Confidence },
  { year: 2022, hpi: 381.15, hpiCumPctVs2019: 44.6, under35: 39.1, age65plus: 79.3, gap6535: 40.2, confidence: "disclosed" as Confidence },
  { year: 2023, hpi: 391.99, hpiCumPctVs2019: 48.7, under35: 38.5, age65plus: 78.9, gap6535: 40.4, confidence: "disclosed" as Confidence },
  { year: 2024, hpi: 414.5, hpiCumPctVs2019: 57.2, under35: 37.4, age65plus: 78.6, gap6535: 41.2, confidence: "disclosed" as Confidence },
  { year: 2025, hpi: 427.33, hpiCumPctVs2019: 62.1, under35: 36.4, age65plus: 78.6, gap6535: 42.2, confidence: "disclosed" as Confidence },
  { year: 2026, hpi: 434.23, hpiCumPctVs2019: 64.7, under35: 35.2, age65plus: 78.6, gap6535: 43.4, confidence: "disclosed" as Confidence },
];

export type AcsCheckRow = {
  year: number;
  source: "HVS" | "ACS";
  under35: number;
  age65plus: number;
  gap6535: number;
  confidence: Confidence;
};

export const ACS_HVS_CHECK: AcsCheckRow[] = [

  { year: 2019, source: "ACS", under35: 36.0, age65plus: 78.3, gap6535: 42.3, confidence: "estimated" as Confidence },
  { year: 2019, source: "HVS", under35: 36.73, age65plus: 78.6, gap6535: 41.87, confidence: "disclosed" as Confidence },
  { year: 2021, source: "ACS", under35: 38.2, age65plus: 79.0, gap6535: 40.8, confidence: "estimated" as Confidence },
  { year: 2021, source: "HVS", under35: 38.17, age65plus: 79.5, gap6535: 41.33, confidence: "disclosed" as Confidence },
  { year: 2022, source: "ACS", under35: 38.9, age65plus: 78.8, gap6535: 39.9, confidence: "estimated" as Confidence },
  { year: 2022, source: "HVS", under35: 38.98, age65plus: 79.1, gap6535: 40.12, confidence: "disclosed" as Confidence },
  { year: 2023, source: "ACS", under35: 38.6, age65plus: 78.7, gap6535: 40.1, confidence: "estimated" as Confidence },
  { year: 2023, source: "HVS", under35: 38.55, age65plus: 78.97, gap6535: 40.42, confidence: "disclosed" as Confidence },
];

export type RegionGap = {
  region: string;
  under35_latest: number;
  age65_latest: number;
  under35_2019: number;
  age65_2019: number;
  gapLatest: number;
  gap2019: number;
  confidence: Confidence;
};

export const REGION_GAPS: RegionGap[] = [

  { region: "Northeast", under35_latest: 30.8, age65_latest: 72.4, under35_2019: 32.1, age65_2019: 73.1, gapLatest: 41.6, gap2019: 41.0, confidence: "estimated" as Confidence },
  { region: "Midwest", under35_latest: 38.5, age65_latest: 80.2, under35_2019: 40.1, age65_2019: 80.8, gapLatest: 41.7, gap2019: 40.7, confidence: "estimated" as Confidence },
  { region: "South", under35_latest: 36.4, age65_latest: 80.1, under35_2019: 37.8, age65_2019: 80.5, gapLatest: 43.7, gap2019: 42.7, confidence: "estimated" as Confidence },
  { region: "West", under35_latest: 31.2, age65_latest: 75.8, under35_2019: 33.0, age65_2019: 76.2, gapLatest: 44.6, gap2019: 43.2, confidence: "estimated" as Confidence },
];

export const TABLE_ROWS = ANNUAL_BY_AGE.filter((r) => r.year >= 2015).map((r) => ({
  year: r.year,
  under35: r.under35,
  age3544: r.age3544,
  age4554: r.age4554,
  age5564: r.age5564,
  age65plus: r.age65plus,
  gap6535: r.gap6535,
  us: r.us,
}));
