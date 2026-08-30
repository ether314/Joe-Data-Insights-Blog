/**
 * CDC heat-related deaths versus NOAA / EPA Contiguous U.S. extreme-heat footprint (2026).
 *
 * Core question: Did U.S. heat-related mortality rise as Contiguous U.S. summer
 * days in the extreme upper tail of the temperature distribution became more
 * geographically widespread?
 *
 * Method:
 * - Mortality: CDC WONDER / NVSS multiple-cause heat deaths (ICD-10 P81/P81.0,
 *   T67, X30 as underlying or contributing). Disclosed annual anchors from
 *   Howard et al. JAMA 2024, CDC MMWR QuickStats (1999–2020), and USAFacts
 *   CDC citations for 2021–2022. Remaining years are least-squares estimates
 *   from NWS Storm Data heat fatalities + EPA/NOAA CEI hot-highs share,
 *   rescaled so the 1999–2023 total equals the JAMA published total (21,518).
 * - Extreme heat: EPA Climate Indicators / NOAA CEI Step 1b — percent of
 *   Contiguous U.S. land area with unusually hot summer maximum temperatures
 *   (top decile of the long-term record for June–August). Companion: CEI Step
 *   2b hot summer nights, and NOAA Climate at a Glance Contiguous U.S. summer
 *   (JJA) maximum-temperature anomaly vs 1901–2000.
 * - Context: NWS Natural Hazard Statistics heat fatalities (Storm Data) —
 *   a narrower operational tally than NVSS cause-of-death coding.
 *
 * Snapshot: EPA CEI CSV (June 2024 web update through 2023); NOAA CAG summer
 * Tmax through 2025; NWS 80-year fatality table through 2023; JAMA letter
 * published Aug 2024.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Primary mortality: CDC WONDER / National Vital Statistics System multiple-cause heat deaths (ICD-10 P81 or P81.0, T67, X30). Disclosed year anchors: Howard et al., JAMA 2024 (1999=1,069; 2004=311; 2023=2,325; period total 21,518); CDC MMWR QuickStats Aug 2022 (2020=1,153); USAFacts CDC citations (2018=1,008; 2021=1,600; 2022=1,714). Non-anchor years estimated from NWS Storm Data heat fatalities + EPA/NOAA CEI unusually-hot summer highs share, then rescaled to the JAMA 1999–2023 total. Extreme heat: EPA Climate Change Indicators high/low temperatures Figure 1 (NOAA CEI Steps 1b/2b — % Contiguous U.S. land area with unusually hot summer daily highs/lows). Summer intensity: NOAA NCEI Climate at a Glance Contiguous U.S. June–August maximum temperature anomaly (°F vs 1901–2000). Operational context: NWS Natural Hazard Statistics heat fatalities. CEI uses the historical top decile (not a literal station-day 95th-percentile national average); treat it as the public national extreme-heat footprint series.";

export const SOURCES = [
  {
    label: "CDC WONDER — Multiple Cause of Death",
    url: "https://wonder.cdc.gov/mcd.html",
  },
  {
    label: "Howard et al. — Trends of Heat-Related Deaths in the US, 1999–2023 (JAMA)",
    url: "https://jamanetwork.com/journals/jama/fullarticle/2822854",
  },
  {
    label: "CDC MMWR QuickStats — Deaths Involving Exposure to Excessive Heat, 1999–2020",
    url: "https://www.cdc.gov/mmwr/volumes/71/wr/mm7134a5.htm",
  },
  {
    label: "EPA Climate Indicators — High and Low Temperatures (NOAA CEI)",
    url: "https://www.epa.gov/climate-indicators/climate-change-indicators-high-and-low-temperatures",
  },
  {
    label: "NOAA NCEI — U.S. Climate Extremes Index (CEI)",
    url: "https://www.ncei.noaa.gov/access/monitoring/cei/",
  },
  {
    label: "NOAA NCEI — Climate at a Glance (Contiguous U.S.)",
    url: "https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/",
  },
  {
    label: "NWS — Weather Related Fatality and Injury Statistics",
    url: "https://www.weather.gov/hazstat/",
  },
] as const;

export const VIZ_MARKERS = [
  "Heat deaths vs CONUS hot-summer footprint",
  "Post-2016 mortality acceleration vs CEI extremes",
] as const;

export const HEADLINE = {
  /** Peak CDC-coded heat deaths in window */
  peakYear: 2023,
  peakDeaths: 2325,
  /** Start-of-window disclosed deaths */
  startYear: 1999,
  startDeaths: 1069,
  /** Percent rise peak vs 1999 */
  peakVsStartPct: 117,
  /** JAMA joinpoint year */
  joinpointYear: 2016,
  /** Mean annual deaths 1999–2015 vs 2016–2023 */
  pre2016MeanDeaths: 681,
  post2016MeanDeaths: 1242,
  /** Mean % CONUS with unusually hot summer highs */
  pre2016MeanHotHighPct: 16.2,
  post2016MeanHotHighPct: 25.5,
  /** Period total (JAMA) */
  periodTotalDeaths: 21518,
  /** 2023 NWS Storm Data heat fatalities */
  nws2023Fatalities: 555,
  /** Pearson r (hot-high % vs deaths), full window */
  pearsonHotDeaths: 0.6,
  confidence: "disclosed" as Confidence,
};

export type AnnualRow = {
  year: number;
  /** CDC multiple-cause heat deaths (disclosed or estimated; see confidence) */
  heatDeaths: number;
  /** NWS Storm Data heat fatalities (disclosed) */
  nwsHeatFatalities: number;
  /** % CONUS land area with unusually hot summer daily highs (CEI 1b) */
  hotHighPct: number;
  /** % CONUS land area with unusually hot summer daily lows (CEI 2b) */
  hotLowPct: number;
  /** Contiguous U.S. JJA Tmax anomaly °F vs 1901–2000 */
  summerTmaxAnomF: number;
  /** Heat deaths per percentage-point of hot-high footprint */
  deathsPerHotPct: number;
  confidence: Confidence;
};

/** Annual dual series — EPA CEI + NOAA CAG disclosed; CDC deaths mixed confidence */
export const ANNUAL: AnnualRow[] = [
  { year: 1999, heatDeaths: 1069, nwsHeatFatalities: 502, hotHighPct: 4.8, hotLowPct: 3.4, summerTmaxAnomF: 0.01, deathsPerHotPct: 222.7, confidence: "disclosed" },
  { year: 2000, heatDeaths: 693, nwsHeatFatalities: 158, hotHighPct: 13.7, hotLowPct: 5.0, summerTmaxAnomF: 0.89, deathsPerHotPct: 50.6, confidence: "estimated" },
  { year: 2001, heatDeaths: 643, nwsHeatFatalities: 166, hotHighPct: 9.0, hotLowPct: 10.5, summerTmaxAnomF: 1.13, deathsPerHotPct: 71.4, confidence: "estimated" },
  { year: 2002, heatDeaths: 900, nwsHeatFatalities: 167, hotHighPct: 27.6, hotLowPct: 25.9, summerTmaxAnomF: 1.85, deathsPerHotPct: 32.6, confidence: "estimated" },
  { year: 2003, heatDeaths: 611, nwsHeatFatalities: 36, hotHighPct: 24.8, hotLowPct: 22.5, summerTmaxAnomF: 1.16, deathsPerHotPct: 24.6, confidence: "estimated" },
  { year: 2004, heatDeaths: 311, nwsHeatFatalities: 6, hotHighPct: 1.4, hotLowPct: 4.9, summerTmaxAnomF: -1.65, deathsPerHotPct: 222.1, confidence: "disclosed" },
  { year: 2005, heatDeaths: 624, nwsHeatFatalities: 158, hotHighPct: 8.7, hotLowPct: 27.1, summerTmaxAnomF: 0.93, deathsPerHotPct: 71.7, confidence: "estimated" },
  { year: 2006, heatDeaths: 1062, nwsHeatFatalities: 253, hotHighPct: 27.4, hotLowPct: 28.3, summerTmaxAnomF: 2.22, deathsPerHotPct: 38.8, confidence: "estimated" },
  { year: 2007, heatDeaths: 796, nwsHeatFatalities: 105, hotHighPct: 28.6, hotLowPct: 29.0, summerTmaxAnomF: 1.56, deathsPerHotPct: 27.8, confidence: "estimated" },
  { year: 2008, heatDeaths: 386, nwsHeatFatalities: 71, hotHighPct: 3.5, hotLowPct: 2.7, summerTmaxAnomF: 0.49, deathsPerHotPct: 110.3, confidence: "estimated" },
  { year: 2009, heatDeaths: 336, nwsHeatFatalities: 45, hotHighPct: 3.5, hotLowPct: 4.9, summerTmaxAnomF: -0.88, deathsPerHotPct: 96.0, confidence: "estimated" },
  { year: 2010, heatDeaths: 668, nwsHeatFatalities: 138, hotHighPct: 14.7, hotLowPct: 53.3, summerTmaxAnomF: 1.08, deathsPerHotPct: 45.4, confidence: "estimated" },
  { year: 2011, heatDeaths: 1084, nwsHeatFatalities: 206, hotHighPct: 35.6, hotLowPct: 53.8, summerTmaxAnomF: 2.27, deathsPerHotPct: 30.4, confidence: "estimated" },
  { year: 2012, heatDeaths: 1136, nwsHeatFatalities: 156, hotHighPct: 46.3, hotLowPct: 25.2, summerTmaxAnomF: 2.79, deathsPerHotPct: 24.5, confidence: "estimated" },
  { year: 2013, heatDeaths: 544, nwsHeatFatalities: 92, hotHighPct: 12.1, hotLowPct: 29.9, summerTmaxAnomF: 0.55, deathsPerHotPct: 45.0, confidence: "estimated" },
  { year: 2014, heatDeaths: 279, nwsHeatFatalities: 20, hotHighPct: 2.8, hotLowPct: 14.2, summerTmaxAnomF: -0.44, deathsPerHotPct: 99.6, confidence: "estimated" },
  { year: 2015, heatDeaths: 438, nwsHeatFatalities: 45, hotHighPct: 10.9, hotLowPct: 33.0, summerTmaxAnomF: 0.75, deathsPerHotPct: 40.2, confidence: "estimated" },
  { year: 2016, heatDeaths: 714, nwsHeatFatalities: 94, hotHighPct: 24.2, hotLowPct: 49.4, summerTmaxAnomF: 1.83, deathsPerHotPct: 29.5, confidence: "estimated" },
  { year: 2017, heatDeaths: 741, nwsHeatFatalities: 107, hotHighPct: 24.4, hotLowPct: 29.9, summerTmaxAnomF: 0.98, deathsPerHotPct: 30.4, confidence: "estimated" },
  { year: 2018, heatDeaths: 1008, nwsHeatFatalities: 108, hotHighPct: 23.5, hotLowPct: 57.4, summerTmaxAnomF: 1.74, deathsPerHotPct: 42.9, confidence: "disclosed" },
  { year: 2019, heatDeaths: 683, nwsHeatFatalities: 187, hotHighPct: 9.0, hotLowPct: 15.4, summerTmaxAnomF: 0.51, deathsPerHotPct: 75.9, confidence: "estimated" },
  { year: 2020, heatDeaths: 1153, nwsHeatFatalities: 350, hotHighPct: 32.1, hotLowPct: 46.2, summerTmaxAnomF: 2.06, deathsPerHotPct: 35.9, confidence: "disclosed" },
  { year: 2021, heatDeaths: 1600, nwsHeatFatalities: 375, hotHighPct: 41.4, hotLowPct: 69.3, summerTmaxAnomF: 2.14, deathsPerHotPct: 38.6, confidence: "disclosed" },
  { year: 2022, heatDeaths: 1714, nwsHeatFatalities: 383, hotHighPct: 28.0, hotLowPct: 65.7, summerTmaxAnomF: 2.27, deathsPerHotPct: 61.2, confidence: "disclosed" },
  { year: 2023, heatDeaths: 2325, nwsHeatFatalities: 555, hotHighPct: 21.4, hotLowPct: 33.0, summerTmaxAnomF: 1.39, deathsPerHotPct: 108.6, confidence: "disclosed" },
];

export type EraRow = {
  era: string;
  years: string;
  meanDeaths: number;
  meanHotHighPct: number;
  meanHotLowPct: number;
  meanTmaxAnomF: number;
  meanNwsFatalities: number;
  totalDeaths: number;
};

export const ERA_COMPARE: EraRow[] = [
  {
    era: "Pre-joinpoint",
    years: "1999–2015",
    meanDeaths: 681,
    meanHotHighPct: 16.2,
    meanHotLowPct: 21.9,
    meanTmaxAnomF: 0.85,
    meanNwsFatalities: 137,
    totalDeaths: 11580,
  },
  {
    era: "Post-joinpoint",
    years: "2016–2023",
    meanDeaths: 1242,
    meanHotHighPct: 25.5,
    meanHotLowPct: 45.8,
    meanTmaxAnomF: 1.62,
    meanNwsFatalities: 270,
    totalDeaths: 9938,
  },
];

/** Rolling 5-year means for smoother dual-trend view */
export type RollingRow = {
  endYear: number;
  deaths5yr: number;
  hotHigh5yr: number;
  hotLow5yr: number;
};

export const ROLLING_5YR: RollingRow[] = (() => {
  const out: RollingRow[] = [];
  for (let i = 4; i < ANNUAL.length; i++) {
    const slice = ANNUAL.slice(i - 4, i + 1);
    out.push({
      endYear: ANNUAL[i].year,
      deaths5yr: Math.round(slice.reduce((s, r) => s + r.heatDeaths, 0) / 5),
      hotHigh5yr: Math.round((slice.reduce((s, r) => s + r.hotHighPct, 0) / 5) * 10) / 10,
      hotLow5yr: Math.round((slice.reduce((s, r) => s + r.hotLowPct, 0) / 5) * 10) / 10,
    });
  }
  return out;
})();

export type DecileBucket = {
  bucket: string;
  yearCount: number;
  meanDeaths: number;
  meanHotHighPct: number;
  label: string;
};

/** Years binned by hot-high footprint terciles */
export const HOT_TERCILES: DecileBucket[] = (() => {
  const sorted = [...ANNUAL].sort((a, b) => a.hotHighPct - b.hotHighPct);
  const n = sorted.length;
  const cuts = [sorted.slice(0, 8), sorted.slice(8, 17), sorted.slice(17)];
  const labels = ["Cooler footprint", "Middle footprint", "Hottest footprint"];
  return cuts.map((slice, i) => ({
    bucket: `T${i + 1}`,
    yearCount: slice.length,
    meanDeaths: Math.round(slice.reduce((s, r) => s + r.heatDeaths, 0) / slice.length),
    meanHotHighPct: Math.round((slice.reduce((s, r) => s + r.hotHighPct, 0) / slice.length) * 10) / 10,
    label: labels[i],
  }));
})();

export type AgencyGapRow = {
  year: number;
  cdcDeaths: number;
  nwsFatalities: number;
  gap: number;
  nwsSharePct: number;
};

export const AGENCY_GAP: AgencyGapRow[] = ANNUAL.filter((r) =>
  [1999, 2006, 2011, 2018, 2020, 2021, 2022, 2023].includes(r.year),
).map((r) => ({
  year: r.year,
  cdcDeaths: r.heatDeaths,
  nwsFatalities: r.nwsHeatFatalities,
  gap: r.heatDeaths - r.nwsHeatFatalities,
  nwsSharePct: Math.round((r.nwsHeatFatalities / r.heatDeaths) * 1000) / 10,
}));

export function filterAnnual(yearMin: number, yearMax: number): AnnualRow[] {
  return ANNUAL.filter((r) => r.year >= yearMin && r.year <= yearMax);
}

export const themeId = "heat-related-deaths-cdc";
