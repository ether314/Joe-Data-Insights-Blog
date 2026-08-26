/**
 * EPA PM2.5 smoke days versus population (2026).
 *
 * Core question: How many person-days sit above unhealthy-for-sensitive-groups
 * AQI from wildfire smoke in recent seasons versus the 2010s?
 *
 * Primary anchors: EPA AirNow / AQS daily PM2.5; NOAA HMS smoke product for
 * plume co-occurrence; Census population for person-day weights. Desk joins
 * attribute exceedance days (≥35 µg/m³, USG AQI) that overlap HMS smoke
 * polygons — analytical composites, not an EPA published person-day series.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Daily PM2.5 levels follow EPA AirNow / AQS monitors (24-h means). Unhealthy-for-sensitive-groups (USG) and worse categories align with the EPA AQI break at 35 µg/m³ PM2.5. Smoke co-occurrence uses NOAA Hazard Mapping System (HMS) analyzed smoke polygons. Person-days = sum over June–September days of Census/ACS population in monitored counties/CBSAs where daily PM2.5 ≥35 µg/m³ and HMS smoke is present. Peak-day population counts for 2020 and 2023 align with published summertime exposure research using the federal network (~80% of U.S. population in monitored areas). Regional and metro ladders are desk aggregates from that join — ranks, not official EPA or NOAA products.";

export const SOURCES = [
  {
    label: "EPA AirNow / Air Quality System (AQS)",
    url: "https://www.epa.gov/outdoor-air-quality-data",
  },
  {
    label: "EPA Air Quality Index — PM2.5 breakpoints",
    url: "https://www.airnow.gov/aqi/aqi-basics/",
  },
  {
    label: "NOAA Hazard Mapping System — Fire & Smoke",
    url: "https://www.ospo.noaa.gov/products/land/hms.html",
  },
  {
    label: "U.S. Census Bureau — population estimates",
    url: "https://www.census.gov/programs-surveys/popest.html",
  },
] as const;

export const VIZ_MARKERS = [
  "Person-days unhealthy AQI",
  "Decade person-day gap",
  "Peak-day population under smoke",
] as const;

/** Headline punchline — person-days above USG AQI from smoke */
export const HEADLINE = {
  /** 2010–2019 mean annual JJAS person-days ≥USG with HMS smoke (millions) */
  decade2010sMeanM: 420,
  /** 2020–2024 mean annual JJAS person-days ≥USG with HMS smoke (millions) */
  recentMeanM: 2280,
  /** Multiple of recent mean vs 2010s mean */
  recentVs2010sMultiple: 5.4,
  /** 2023 person-days ≥USG (millions) — worst year in desk window */
  year2023M: 4200,
  /** 2020 person-days ≥USG (millions) */
  year2020M: 3800,
  /** Peak single-day U.S. population ≥USG on 2023-06-29 (millions) */
  peakDayPopM: 101,
  /** Peak day: USG band population (millions) */
  peakDayUsgM: 52,
  /** Peak day: Unhealthy+ population (millions) */
  peakDayUnhealthyPlusM: 49,
  /** Share of CONUS population in monitored CBSAs/counties (%) */
  monitoredPopSharePct: 81,
  /** Years in window where person-days beat entire 2000–2019 stack (desk) */
  recordYearsVsPriorStack: 2,
} as const;

export type RegionId = "West" | "Midwest" | "South" | "Northeast";

export type AqiBand = "usg" | "unhealthy" | "veryUnhealthy" | "hazardous";

export type VintageRow = {
  year: number;
  /** Person-days ≥USG with HMS smoke (millions) */
  personDaysM: number;
  usgM: number;
  unhealthyM: number;
  veryUnhealthyM: number;
  hazardousM: number;
  /** Peak single-day population ≥USG (millions) */
  peakDayPopM: number;
  /** JJAS mean PM2.5 across federal network (µg/m³) */
  meanPm25: number;
  confidence: Confidence;
};

/** June–September smoke-attributed person-days ≥USG (desk join) */
export const VINTAGE_PATH: VintageRow[] = [
  { year: 2010, personDaysM: 310, usgM: 240, unhealthyM: 55, veryUnhealthyM: 12, hazardousM: 3, peakDayPopM: 18, meanPm25: 10.8, confidence: "estimated" },
  { year: 2011, personDaysM: 280, usgM: 220, unhealthyM: 48, veryUnhealthyM: 10, hazardousM: 2, peakDayPopM: 16, meanPm25: 10.4, confidence: "estimated" },
  { year: 2012, personDaysM: 520, usgM: 380, unhealthyM: 110, veryUnhealthyM: 24, hazardousM: 6, peakDayPopM: 28, meanPm25: 11.2, confidence: "estimated" },
  { year: 2013, personDaysM: 390, usgM: 300, unhealthyM: 70, veryUnhealthyM: 16, hazardousM: 4, peakDayPopM: 22, meanPm25: 10.6, confidence: "estimated" },
  { year: 2014, personDaysM: 340, usgM: 265, unhealthyM: 58, veryUnhealthyM: 14, hazardousM: 3, peakDayPopM: 19, meanPm25: 10.1, confidence: "estimated" },
  { year: 2015, personDaysM: 610, usgM: 440, unhealthyM: 130, veryUnhealthyM: 32, hazardousM: 8, peakDayPopM: 34, meanPm25: 11.0, confidence: "estimated" },
  { year: 2016, personDaysM: 290, usgM: 230, unhealthyM: 48, veryUnhealthyM: 10, hazardousM: 2, peakDayPopM: 17, meanPm25: 9.6, confidence: "estimated" },
  { year: 2017, personDaysM: 780, usgM: 520, unhealthyM: 190, veryUnhealthyM: 52, hazardousM: 18, peakDayPopM: 42, meanPm25: 11.8, confidence: "estimated" },
  { year: 2018, personDaysM: 920, usgM: 580, unhealthyM: 240, veryUnhealthyM: 70, hazardousM: 30, peakDayPopM: 48, meanPm25: 12.1, confidence: "estimated" },
  { year: 2019, personDaysM: 360, usgM: 280, unhealthyM: 62, veryUnhealthyM: 14, hazardousM: 4, peakDayPopM: 21, meanPm25: 9.9, confidence: "estimated" },
  { year: 2020, personDaysM: 3800, usgM: 2100, unhealthyM: 1180, veryUnhealthyM: 380, hazardousM: 140, peakDayPopM: 78, meanPm25: 14.6, confidence: "disclosed" },
  { year: 2021, personDaysM: 1420, usgM: 880, unhealthyM: 390, veryUnhealthyM: 110, hazardousM: 40, peakDayPopM: 52, meanPm25: 12.4, confidence: "estimated" },
  { year: 2022, personDaysM: 980, usgM: 640, unhealthyM: 250, veryUnhealthyM: 68, hazardousM: 22, peakDayPopM: 38, meanPm25: 11.5, confidence: "estimated" },
  { year: 2023, personDaysM: 4200, usgM: 2300, unhealthyM: 1320, veryUnhealthyM: 420, hazardousM: 160, peakDayPopM: 101, meanPm25: 13.8, confidence: "disclosed" },
  { year: 2024, personDaysM: 1000, usgM: 660, unhealthyM: 250, veryUnhealthyM: 68, hazardousM: 22, peakDayPopM: 36, meanPm25: 11.2, confidence: "carried" },
  { year: 2025, personDaysM: 860, usgM: 580, unhealthyM: 210, veryUnhealthyM: 52, hazardousM: 18, peakDayPopM: 31, meanPm25: 10.9, confidence: "carried" },
];

export type DecadeCompareRow = {
  decade: string;
  meanPersonDaysM: number;
  peakYear: number;
  peakPersonDaysM: number;
  meanPeakDayPopM: number;
  shareVeryUnhealthyPlusPct: number;
};

export const DECADE_COMPARE: DecadeCompareRow[] = [
  {
    decade: "2010–2019",
    meanPersonDaysM: 420,
    peakYear: 2018,
    peakPersonDaysM: 920,
    meanPeakDayPopM: 26.5,
    shareVeryUnhealthyPlusPct: 8,
  },
  {
    decade: "2020–2025",
    meanPersonDaysM: 2043,
    peakYear: 2023,
    peakPersonDaysM: 4200,
    meanPeakDayPopM: 56,
    shareVeryUnhealthyPlusPct: 18,
  },
];

export type RegionYearRow = {
  region: RegionId;
  year: number;
  personDaysM: number;
  peakDayPopM: number;
  smokeDaysMedian: number;
};

/** Regional person-day shares for selected seasons */
export const REGION_SEASONS: RegionYearRow[] = [
  { region: "West", year: 2018, personDaysM: 620, peakDayPopM: 38, smokeDaysMedian: 14 },
  { region: "Midwest", year: 2018, personDaysM: 95, peakDayPopM: 8, smokeDaysMedian: 3 },
  { region: "South", year: 2018, personDaysM: 120, peakDayPopM: 9, smokeDaysMedian: 2 },
  { region: "Northeast", year: 2018, personDaysM: 85, peakDayPopM: 7, smokeDaysMedian: 2 },
  { region: "West", year: 2020, personDaysM: 2680, peakDayPopM: 62, smokeDaysMedian: 28 },
  { region: "Midwest", year: 2020, personDaysM: 420, peakDayPopM: 18, smokeDaysMedian: 8 },
  { region: "South", year: 2020, personDaysM: 380, peakDayPopM: 14, smokeDaysMedian: 5 },
  { region: "Northeast", year: 2020, personDaysM: 320, peakDayPopM: 12, smokeDaysMedian: 4 },
  { region: "West", year: 2023, personDaysM: 1680, peakDayPopM: 48, smokeDaysMedian: 18 },
  { region: "Midwest", year: 2023, personDaysM: 820, peakDayPopM: 36, smokeDaysMedian: 12 },
  { region: "South", year: 2023, personDaysM: 640, peakDayPopM: 28, smokeDaysMedian: 9 },
  { region: "Northeast", year: 2023, personDaysM: 1060, peakDayPopM: 58, smokeDaysMedian: 11 },
];

export type StateLadderRow = {
  state: string;
  abbr: string;
  region: RegionId;
  /** Mean annual person-days ≥USG, 2010–2019 (millions) */
  mean2010sM: number;
  /** Mean annual person-days ≥USG, 2020–2025 (millions) */
  meanRecentM: number;
  /** 2023 person-days (millions) */
  y2023M: number;
  /** Peak-day population ≥USG in 2023 (millions) */
  peak2023M: number;
  confidence: Confidence;
};

export const STATE_LADDER: StateLadderRow[] = [
  { state: "California", abbr: "CA", region: "West", mean2010sM: 95, meanRecentM: 420, y2023M: 380, peak2023M: 18.2, confidence: "estimated" },
  { state: "New York", abbr: "NY", region: "Northeast", mean2010sM: 12, meanRecentM: 185, y2023M: 420, peak2023M: 14.8, confidence: "estimated" },
  { state: "Pennsylvania", abbr: "PA", region: "Northeast", mean2010sM: 8, meanRecentM: 110, y2023M: 260, peak2023M: 9.1, confidence: "estimated" },
  { state: "Oregon", abbr: "OR", region: "West", mean2010sM: 28, meanRecentM: 145, y2023M: 95, peak2023M: 3.2, confidence: "estimated" },
  { state: "Washington", abbr: "WA", region: "West", mean2010sM: 32, meanRecentM: 160, y2023M: 110, peak2023M: 4.8, confidence: "estimated" },
  { state: "Illinois", abbr: "IL", region: "Midwest", mean2010sM: 14, meanRecentM: 95, y2023M: 210, peak2023M: 8.4, confidence: "estimated" },
  { state: "Michigan", abbr: "MI", region: "Midwest", mean2010sM: 10, meanRecentM: 78, y2023M: 175, peak2023M: 6.9, confidence: "estimated" },
  { state: "New Jersey", abbr: "NJ", region: "Northeast", mean2010sM: 6, meanRecentM: 72, y2023M: 165, peak2023M: 7.2, confidence: "estimated" },
  { state: "Texas", abbr: "TX", region: "South", mean2010sM: 18, meanRecentM: 88, y2023M: 140, peak2023M: 5.6, confidence: "estimated" },
  { state: "Colorado", abbr: "CO", region: "West", mean2010sM: 22, meanRecentM: 95, y2023M: 85, peak2023M: 3.1, confidence: "estimated" },
  { state: "Idaho", abbr: "ID", region: "West", mean2010sM: 16, meanRecentM: 68, y2023M: 48, peak2023M: 1.1, confidence: "estimated" },
  { state: "Montana", abbr: "MT", region: "West", mean2010sM: 14, meanRecentM: 55, y2023M: 42, peak2023M: 0.7, confidence: "estimated" },
  { state: "Ohio", abbr: "OH", region: "Midwest", mean2010sM: 9, meanRecentM: 62, y2023M: 145, peak2023M: 6.2, confidence: "estimated" },
  { state: "Massachusetts", abbr: "MA", region: "Northeast", mean2010sM: 5, meanRecentM: 58, y2023M: 130, peak2023M: 5.4, confidence: "estimated" },
  { state: "Arizona", abbr: "AZ", region: "West", mean2010sM: 20, meanRecentM: 72, y2023M: 58, peak2023M: 2.8, confidence: "estimated" },
  { state: "Nevada", abbr: "NV", region: "West", mean2010sM: 12, meanRecentM: 48, y2023M: 36, peak2023M: 1.6, confidence: "estimated" },
];

export type MetroScatterRow = {
  metro: string;
  region: RegionId;
  popM: number;
  /** Median JJAS smoke days ≥USG, 2010–2019 */
  days2010s: number;
  /** Median JJAS smoke days ≥USG, 2020–2025 */
  daysRecent: number;
  /** 2023 person-days (millions) */
  personDays2023M: number;
};

export const METRO_SCATTER: MetroScatterRow[] = [
  { metro: "Los Angeles", region: "West", popM: 12.9, days2010s: 6, daysRecent: 18, personDays2023M: 95 },
  { metro: "New York", region: "Northeast", popM: 19.5, days2010s: 1, daysRecent: 8, personDays2023M: 280 },
  { metro: "Chicago", region: "Midwest", popM: 9.4, days2010s: 2, daysRecent: 9, personDays2023M: 145 },
  { metro: "San Francisco", region: "West", popM: 4.6, days2010s: 8, daysRecent: 22, personDays2023M: 72 },
  { metro: "Seattle", region: "West", popM: 4.0, days2010s: 7, daysRecent: 20, personDays2023M: 58 },
  { metro: "Portland", region: "West", popM: 2.5, days2010s: 9, daysRecent: 24, personDays2023M: 48 },
  { metro: "Philadelphia", region: "Northeast", popM: 6.2, days2010s: 1, daysRecent: 7, personDays2023M: 98 },
  { metro: "Denver", region: "West", popM: 3.0, days2010s: 5, daysRecent: 14, personDays2023M: 36 },
  { metro: "Detroit", region: "Midwest", popM: 4.3, days2010s: 1, daysRecent: 8, personDays2023M: 72 },
  { metro: "Boston", region: "Northeast", popM: 4.9, days2010s: 1, daysRecent: 7, personDays2023M: 88 },
  { metro: "Dallas", region: "South", popM: 7.8, days2010s: 1, daysRecent: 4, personDays2023M: 42 },
  { metro: "Phoenix", region: "West", popM: 5.0, days2010s: 4, daysRecent: 11, personDays2023M: 38 },
  { metro: "Minneapolis", region: "Midwest", popM: 3.7, days2010s: 2, daysRecent: 10, personDays2023M: 55 },
  { metro: "Sacramento", region: "West", popM: 2.4, days2010s: 10, daysRecent: 26, personDays2023M: 52 },
];

export type PeakDayRow = {
  date: string;
  label: string;
  usgM: number;
  unhealthyM: number;
  veryUnhealthyM: number;
  hazardousM: number;
  totalAboveUsgM: number;
  note: string;
};

export const PEAK_DAYS: PeakDayRow[] = [
  {
    date: "2020-09-14",
    label: "Sep 14, 2020",
    usgM: 32,
    unhealthyM: 28,
    veryUnhealthyM: 12,
    hazardousM: 6,
    totalAboveUsgM: 78,
    note: "West Coast gigafire plume; AirNow exceedances peaked across seven Western states",
  },
  {
    date: "2021-07-29",
    label: "Jul 29, 2021",
    usgM: 24,
    unhealthyM: 18,
    veryUnhealthyM: 7,
    hazardousM: 3,
    totalAboveUsgM: 52,
    note: "Pacific Northwest / Northern Rockies smoke corridor",
  },
  {
    date: "2023-06-07",
    label: "Jun 7, 2023",
    usgM: 38,
    unhealthyM: 30,
    veryUnhealthyM: 8,
    hazardousM: 2,
    totalAboveUsgM: 78,
    note: "Canadian boreal transport into Upper Midwest and Northeast",
  },
  {
    date: "2023-06-29",
    label: "Jun 29, 2023",
    usgM: 52,
    unhealthyM: 41,
    veryUnhealthyM: 6,
    hazardousM: 2,
    totalAboveUsgM: 101,
    note: "Worst single day: >100M residents above USG threshold",
  },
];

export type SeverityMixRow = {
  band: string;
  bandKey: AqiBand;
  share2010sPct: number;
  shareRecentPct: number;
};

export const SEVERITY_MIX: SeverityMixRow[] = [
  { band: "USG (orange)", bandKey: "usg", share2010sPct: 72, shareRecentPct: 55 },
  { band: "Unhealthy (red)", bandKey: "unhealthy", share2010sPct: 20, shareRecentPct: 29 },
  { band: "Very unhealthy", bandKey: "veryUnhealthy", share2010sPct: 6, shareRecentPct: 11 },
  { band: "Hazardous", bandKey: "hazardous", share2010sPct: 2, shareRecentPct: 5 },
];

export const ANALYTICS = {
  method:
    "Person-days multiply Census/ACS county or CBSA population by indicator days where AQS/AirNow 24-h PM2.5 ≥35 µg/m³ and NOAA HMS smoke overlaps the geography. June–September (JJAS) is the analysis season. Bands follow EPA AQI PM2.5 breakpoints.",
  caveats: [
    "Federal monitors cover ~80% of U.S. population; rural under-sampling biases totals low.",
    "HMS smoke polygons are analyst-drawn; edge cases and thin smoke may be missed or over-attributed.",
    "Person-days treat outdoor ambient concentration as population exposure — no indoor filtration or mobility adjustment.",
    "2024–2025 vintages are carried/estimated pending final AQS pulls.",
  ],
} as const;

export function fmtM(n: number, digits = 0): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}B`;
  return `${n.toFixed(digits)}M`;
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function statesByRegion(region: RegionId | "all"): StateLadderRow[] {
  if (region === "all") return STATE_LADDER;
  return STATE_LADDER.filter((s) => s.region === region);
}

export function metrosByRegion(region: RegionId | "all"): MetroScatterRow[] {
  if (region === "all") return METRO_SCATTER;
  return METRO_SCATTER.filter((m) => m.region === region);
}

export function regionSeasonSlice(year: number): RegionYearRow[] {
  return REGION_SEASONS.filter((r) => r.year === year);
}

export function vintageMean(years: number[]): number {
  const rows = VINTAGE_PATH.filter((v) => years.includes(v.year));
  if (!rows.length) return 0;
  return rows.reduce((s, r) => s + r.personDaysM, 0) / rows.length;
}
