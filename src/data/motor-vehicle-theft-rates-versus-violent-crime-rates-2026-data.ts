/**
 * Motor-vehicle theft rates versus violent crime rates (2026).
 *
 * Core question: Did FBI NIBRS / UCR motor-vehicle theft per 100,000 rise
 * faster than violent crime after 2019, and has it since retreated?
 *
 * Method: Index both national rates to 2019=100 using FBI Crime in the
 * United States / Crime Data Explorer estimated rates (SRS through 2019;
 * NIBRS-transition estimates thereafter). Publish the MV-theft − violent
 * index gap as a divergence score. Supplement with regional rate panels,
 * property-offense mix, and BJS NCVS reporting context. 2021 national
 * estimates are flagged incomplete under the NIBRS transition.
 *
 * Confidence: Pre-2020 CIUS Table 1 rates are disclosed. 2020–2024 rates
 * use FBI nation summaries / CDE estimates and are marked estimated where
 * coverage or methodology shifted. NCVS series are survey estimates.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";
export type Region = "northeast" | "midwest" | "south" | "west" | "national";
export type SeriesFilter = "all" | "post2019" | "peak-window";
export type RegionFilter = "all" | Region;

export const SOURCE_NOTE =
  "National rates: FBI Crime in the United States Table 1 (2009–2019) and FBI UCR / Crime Data Explorer nation estimates (2020–2024), offenses per 100,000 inhabitants. Violent crime = murder, rape (revised), robbery, aggravated assault. Motor vehicle theft is the UCR Part I property offense. 2021 estimates flagged incomplete during the NIBRS transition. Regional and selected-state panels use FBI CDE / NICB rate compilations for illustration of divergence, not a census of all agencies. NCVS reporting shares: BJS Criminal Victimization.";

export const SOURCES = [
  {
    label: "FBI — Crime in the United States Table 1 (historical)",
    url: "https://ucr.fbi.gov/crime-in-the-u.s/2019/crime-in-the-u.s.-2019/tables/table-1",
  },
  {
    label: "FBI Crime Data Explorer",
    url: "https://cde.ucr.cjis.gov/",
  },
  {
    label: "FBI — Motor Vehicle Theft, 2019–2023 (NIBRS special report)",
    url: "https://www.fbi.gov/news/press-releases/fbi-releases-motor-vehicle-theft-2019-2023",
  },
  {
    label: "FBI — 2024 Reported Crimes in the Nation",
    url: "https://www.fbi.gov/news/press-releases/fbi-releases-2024-reported-crimes-in-the-nation-statistics",
  },
  {
    label: "BJS — Criminal Victimization (NCVS)",
    url: "https://bjs.ojp.gov/library/publications/criminal-victimization-2023",
  },
] as const;

/** Headline desk stats — rates per 100k unless noted */
export const HEADLINE = {
  baseYear: 2019,
  peakYear: 2023,
  endYear: 2024,
  mvt2019: 219.9,
  mvt2023: 318.7,
  mvt2024: 258.8,
  violent2019: 366.7,
  violent2023: 363.8,
  violent2024: 347.0,
  mvtDelta2019To2023Pct: 44.9,
  violentDelta2019To2023Pct: -0.8,
  mvtDelta2023To2024Pct: -18.8,
  violentDelta2023To2024Pct: -4.6,
  mvtIndex2023: 144.9,
  violentIndex2023: 99.2,
  mvtIndex2024: 117.7,
  violentIndex2024: 94.6,
  peakGapPoints: 45.7,
  endGapPoints: 23.1,
  stillAbove2019: true,
} as const;

export const ANALYTICS = {
  smokeMarker: "MV theft vs violent index",
  headlineLabel: "MV theft index at 2023 peak (2019=100)",
  headlineValue: String(HEADLINE.mvtIndex2023),
} as const;

export type DualRateRow = {
  year: number;
  mvtRate: number;
  violentRate: number;
  mvtIndex: number;
  violentIndex: number;
  /** MV theft index − violent index (points) */
  gapPoints: number;
  confidence: Confidence;
  note?: string;
};

/** National dual series — rates per 100k; indexes rebased to 2019 */
export const DUAL_SERIES: DualRateRow[] = [
  {
    year: 2009,
    mvtRate: 261.4,
    violentRate: 431.9,
    mvtIndex: 118.9,
    violentIndex: 117.8,
    gapPoints: 1.1,
    confidence: "disclosed",
  },
  {
    year: 2010,
    mvtRate: 245.0,
    violentRate: 404.5,
    mvtIndex: 111.4,
    violentIndex: 110.3,
    gapPoints: 1.1,
    confidence: "disclosed",
  },
  {
    year: 2011,
    mvtRate: 232.2,
    violentRate: 387.1,
    mvtIndex: 105.6,
    violentIndex: 105.6,
    gapPoints: 0.0,
    confidence: "disclosed",
  },
  {
    year: 2012,
    mvtRate: 230.3,
    violentRate: 387.8,
    mvtIndex: 104.7,
    violentIndex: 105.8,
    gapPoints: -1.1,
    confidence: "disclosed",
  },
  {
    year: 2013,
    mvtRate: 222.8,
    violentRate: 369.1,
    mvtIndex: 101.3,
    violentIndex: 100.7,
    gapPoints: 0.6,
    confidence: "disclosed",
  },
  {
    year: 2014,
    mvtRate: 217.5,
    violentRate: 361.6,
    mvtIndex: 98.9,
    violentIndex: 98.6,
    gapPoints: 0.3,
    confidence: "disclosed",
  },
  {
    year: 2015,
    mvtRate: 222.2,
    violentRate: 373.7,
    mvtIndex: 101.0,
    violentIndex: 101.9,
    gapPoints: -0.9,
    confidence: "disclosed",
  },
  {
    year: 2016,
    mvtRate: 237.3,
    violentRate: 386.6,
    mvtIndex: 107.9,
    violentIndex: 105.4,
    gapPoints: 2.5,
    confidence: "disclosed",
  },
  {
    year: 2017,
    mvtRate: 237.7,
    violentRate: 383.8,
    mvtIndex: 108.1,
    violentIndex: 104.7,
    gapPoints: 3.4,
    confidence: "disclosed",
  },
  {
    year: 2018,
    mvtRate: 230.2,
    violentRate: 370.4,
    mvtIndex: 104.7,
    violentIndex: 101.0,
    gapPoints: 3.7,
    confidence: "disclosed",
  },
  {
    year: 2019,
    mvtRate: 219.9,
    violentRate: 366.7,
    mvtIndex: 100.0,
    violentIndex: 100.0,
    gapPoints: 0.0,
    confidence: "disclosed",
  },
  {
    year: 2020,
    mvtRate: 248.1,
    violentRate: 398.5,
    mvtIndex: 112.8,
    violentIndex: 108.7,
    gapPoints: 4.1,
    confidence: "estimated",
    note: "Pandemic year; SRS/NIBRS mix",
  },
  {
    year: 2021,
    mvtRate: 241.5,
    violentRate: 387.0,
    mvtIndex: 109.8,
    violentIndex: 105.5,
    gapPoints: 4.3,
    confidence: "estimated",
    note: "NIBRS transition — incomplete national coverage",
  },
  {
    year: 2022,
    mvtRate: 284.5,
    violentRate: 377.1,
    mvtIndex: 129.4,
    violentIndex: 102.8,
    gapPoints: 26.6,
    confidence: "estimated",
  },
  {
    year: 2023,
    mvtRate: 318.7,
    violentRate: 363.8,
    mvtIndex: 144.9,
    violentIndex: 99.2,
    gapPoints: 45.7,
    confidence: "estimated",
  },
  {
    year: 2024,
    mvtRate: 258.8,
    violentRate: 347.0,
    mvtIndex: 117.7,
    violentIndex: 94.6,
    gapPoints: 23.1,
    confidence: "estimated",
    note: "FBI: MV theft −18.6% volume; violent −4.5%",
  },
];

export type OffenseMixRow = {
  year: number;
  burglaryRate: number;
  larcenyRate: number;
  mvtRate: number;
  confidence: Confidence;
};

/** Property offense mix (rates per 100k) — burglary fell while MVT rose */
export const OFFENSE_MIX: OffenseMixRow[] = [
  {
    year: 2015,
    burglaryRate: 494.7,
    larcenyRate: 1783.6,
    mvtRate: 222.2,
    confidence: "disclosed",
  },
  {
    year: 2017,
    burglaryRate: 429.7,
    larcenyRate: 1695.5,
    mvtRate: 237.7,
    confidence: "disclosed",
  },
  {
    year: 2019,
    burglaryRate: 340.5,
    larcenyRate: 1549.5,
    mvtRate: 219.9,
    confidence: "disclosed",
  },
  {
    year: 2020,
    burglaryRate: 314.0,
    larcenyRate: 1398.0,
    mvtRate: 248.1,
    confidence: "estimated",
  },
  {
    year: 2022,
    burglaryRate: 270.0,
    larcenyRate: 1400.0,
    mvtRate: 284.5,
    confidence: "estimated",
  },
  {
    year: 2023,
    burglaryRate: 250.0,
    larcenyRate: 1380.0,
    mvtRate: 318.7,
    confidence: "estimated",
  },
  {
    year: 2024,
    burglaryRate: 230.0,
    larcenyRate: 1280.0,
    mvtRate: 258.8,
    confidence: "estimated",
  },
];

export type RegionRow = {
  region: Exclude<Region, "national">;
  label: string;
  mvt2019: number;
  mvt2023: number;
  mvt2024: number;
  violent2019: number;
  violent2023: number;
  violent2024: number;
  mvtDelta2019To2023Pct: number;
  violentDelta2019To2023Pct: number;
  confidence: Confidence;
};

/** Census-region composite rates (desk synthesis from FBI regional tables) */
export const REGION_PANEL: RegionRow[] = [
  {
    region: "northeast",
    label: "Northeast",
    mvt2019: 125.0,
    mvt2023: 175.0,
    mvt2024: 148.0,
    violent2019: 285.0,
    violent2023: 290.0,
    violent2024: 275.0,
    mvtDelta2019To2023Pct: 40.0,
    violentDelta2019To2023Pct: 1.8,
    confidence: "estimated",
  },
  {
    region: "midwest",
    label: "Midwest",
    mvt2019: 195.0,
    mvt2023: 290.0,
    mvt2024: 235.0,
    violent2019: 340.0,
    violent2023: 335.0,
    violent2024: 318.0,
    mvtDelta2019To2023Pct: 48.7,
    violentDelta2019To2023Pct: -1.5,
    confidence: "estimated",
  },
  {
    region: "south",
    label: "South",
    mvt2019: 230.0,
    mvt2023: 340.0,
    mvt2024: 280.0,
    violent2019: 400.0,
    violent2023: 390.0,
    violent2024: 370.0,
    mvtDelta2019To2023Pct: 47.8,
    violentDelta2019To2023Pct: -2.5,
    confidence: "estimated",
  },
  {
    region: "west",
    label: "West",
    mvt2019: 310.0,
    mvt2023: 480.0,
    mvt2024: 365.0,
    violent2019: 390.0,
    violent2023: 385.0,
    violent2024: 365.0,
    mvtDelta2019To2023Pct: 54.8,
    violentDelta2019To2023Pct: -1.3,
    confidence: "estimated",
  },
];

export type StateRow = {
  state: string;
  abbr: string;
  region: Exclude<Region, "national">;
  mvt2019: number;
  mvt2023: number;
  mvt2024: number;
  violent2019: number;
  violent2023: number;
  mvtDeltaPct: number;
  violentDeltaPct: number;
  /** MV theft Δpp − violent Δpp (percentage-point spread of % changes) */
  divergenceSpread: number;
  confidence: Confidence;
};

/**
 * Selected high-signal states — rates per 100k from FBI/NICB compilations.
 * Not a complete 50-state census; used for scatter / ranking panels.
 */
export const STATE_PANEL: StateRow[] = [
  {
    state: "Colorado",
    abbr: "CO",
    region: "west",
    mvt2019: 380,
    mvt2023: 583,
    mvt2024: 430,
    violent2019: 381,
    violent2023: 425,
    mvtDeltaPct: 53.4,
    violentDeltaPct: 11.5,
    divergenceSpread: 41.9,
    confidence: "estimated",
  },
  {
    state: "Washington",
    abbr: "WA",
    region: "west",
    mvt2019: 340,
    mvt2023: 554,
    mvt2024: 377,
    violent2019: 294,
    violent2023: 320,
    mvtDeltaPct: 62.9,
    violentDeltaPct: 8.8,
    divergenceSpread: 54.1,
    confidence: "estimated",
  },
  {
    state: "Oregon",
    abbr: "OR",
    region: "west",
    mvt2019: 320,
    mvt2023: 394,
    mvt2024: 276,
    violent2019: 285,
    violent2023: 300,
    mvtDeltaPct: 23.1,
    violentDeltaPct: 5.3,
    divergenceSpread: 17.8,
    confidence: "estimated",
  },
  {
    state: "California",
    abbr: "CA",
    region: "west",
    mvt2019: 380,
    mvt2023: 534,
    mvt2024: 463,
    violent2019: 441,
    violent2023: 440,
    mvtDeltaPct: 40.5,
    violentDeltaPct: -0.2,
    divergenceSpread: 40.7,
    confidence: "estimated",
  },
  {
    state: "Nevada",
    abbr: "NV",
    region: "west",
    mvt2019: 360,
    mvt2023: 573,
    mvt2024: 394,
    violent2019: 494,
    violent2023: 460,
    mvtDeltaPct: 59.2,
    violentDeltaPct: -6.9,
    divergenceSpread: 66.1,
    confidence: "estimated",
  },
  {
    state: "New Mexico",
    abbr: "NM",
    region: "west",
    mvt2019: 380,
    mvt2023: 490,
    mvt2024: 458,
    violent2019: 832,
    violent2023: 780,
    mvtDeltaPct: 28.9,
    violentDeltaPct: -6.3,
    divergenceSpread: 35.2,
    confidence: "estimated",
  },
  {
    state: "Texas",
    abbr: "TX",
    region: "south",
    mvt2019: 250,
    mvt2023: 383,
    mvt2024: 310,
    violent2019: 418,
    violent2023: 400,
    mvtDeltaPct: 53.2,
    violentDeltaPct: -4.3,
    divergenceSpread: 57.5,
    confidence: "estimated",
  },
  {
    state: "Maryland",
    abbr: "MD",
    region: "south",
    mvt2019: 240,
    mvt2023: 428,
    mvt2024: 340,
    violent2019: 454,
    violent2023: 430,
    mvtDeltaPct: 78.3,
    violentDeltaPct: -5.3,
    divergenceSpread: 83.6,
    confidence: "estimated",
  },
  {
    state: "Missouri",
    abbr: "MO",
    region: "midwest",
    mvt2019: 310,
    mvt2023: 420,
    mvt2024: 350,
    violent2019: 495,
    violent2023: 470,
    mvtDeltaPct: 35.5,
    violentDeltaPct: -5.1,
    divergenceSpread: 40.6,
    confidence: "estimated",
  },
  {
    state: "Illinois",
    abbr: "IL",
    region: "midwest",
    mvt2019: 200,
    mvt2023: 280,
    mvt2024: 230,
    violent2019: 415,
    violent2023: 400,
    mvtDeltaPct: 40.0,
    violentDeltaPct: -3.6,
    divergenceSpread: 43.6,
    confidence: "estimated",
  },
  {
    state: "Minnesota",
    abbr: "MN",
    region: "midwest",
    mvt2019: 180,
    mvt2023: 310,
    mvt2024: 240,
    violent2019: 238,
    violent2023: 260,
    mvtDeltaPct: 72.2,
    violentDeltaPct: 9.2,
    divergenceSpread: 63.0,
    confidence: "estimated",
  },
  {
    state: "New York",
    abbr: "NY",
    region: "northeast",
    mvt2019: 90,
    mvt2023: 160,
    mvt2024: 130,
    violent2019: 361,
    violent2023: 370,
    mvtDeltaPct: 77.8,
    violentDeltaPct: 2.5,
    divergenceSpread: 75.3,
    confidence: "estimated",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    region: "northeast",
    mvt2019: 95,
    mvt2023: 140,
    mvt2024: 115,
    violent2019: 328,
    violent2023: 310,
    mvtDeltaPct: 47.4,
    violentDeltaPct: -5.5,
    divergenceSpread: 52.9,
    confidence: "estimated",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    region: "northeast",
    mvt2019: 110,
    mvt2023: 175,
    mvt2024: 145,
    violent2019: 306,
    violent2023: 300,
    mvtDeltaPct: 59.1,
    violentDeltaPct: -2.0,
    divergenceSpread: 61.1,
    confidence: "estimated",
  },
  {
    state: "Florida",
    abbr: "FL",
    region: "south",
    mvt2019: 200,
    mvt2023: 260,
    mvt2024: 220,
    violent2019: 378,
    violent2023: 350,
    mvtDeltaPct: 30.0,
    violentDeltaPct: -7.4,
    divergenceSpread: 37.4,
    confidence: "estimated",
  },
  {
    state: "Georgia",
    abbr: "GA",
    region: "south",
    mvt2019: 280,
    mvt2023: 360,
    mvt2024: 300,
    violent2019: 340,
    violent2023: 330,
    mvtDeltaPct: 28.6,
    violentDeltaPct: -2.9,
    divergenceSpread: 31.5,
    confidence: "estimated",
  },
];

export type NcvsRow = {
  year: number;
  /** Share of completed MV thefts reported to police (NCVS) */
  reportedPct: number;
  /** UCR MV theft rate index 2019=100 for juxtaposition */
  ucrMvtIndex: number;
  confidence: Confidence;
};

/** High reporting share is why UCR tracks MV theft better than most property crime */
export const NCVS_REPORTING: NcvsRow[] = [
  { year: 2019, reportedPct: 79.5, ucrMvtIndex: 100.0, confidence: "estimated" },
  { year: 2020, reportedPct: 82.0, ucrMvtIndex: 112.8, confidence: "estimated" },
  { year: 2021, reportedPct: 81.0, ucrMvtIndex: 109.8, confidence: "estimated" },
  { year: 2022, reportedPct: 80.9, ucrMvtIndex: 129.4, confidence: "disclosed" },
  { year: 2023, reportedPct: 78.0, ucrMvtIndex: 144.9, confidence: "estimated" },
];

export type VolumeRow = {
  year: number;
  stolen: number;
  confidence: Confidence;
};

/** National stolen-vehicle counts (NICB / FBI offense volume) */
export const VOLUME_SERIES: VolumeRow[] = [
  { year: 2019, stolen: 801_023, confidence: "estimated" },
  { year: 2020, stolen: 880_595, confidence: "estimated" },
  { year: 2021, stolen: 932_329, confidence: "estimated" },
  { year: 2022, stolen: 1_008_756, confidence: "estimated" },
  { year: 2023, stolen: 1_020_729, confidence: "estimated" },
  { year: 2024, stolen: 850_708, confidence: "estimated" },
];

export function filterDualSeries(filter: SeriesFilter): DualRateRow[] {
  if (filter === "post2019") return DUAL_SERIES.filter((r) => r.year >= 2019);
  if (filter === "peak-window") return DUAL_SERIES.filter((r) => r.year >= 2019);
  return DUAL_SERIES;
}

export function filterRegions(filter: RegionFilter): RegionRow[] {
  if (filter === "all" || filter === "national") return REGION_PANEL;
  return REGION_PANEL.filter((r) => r.region === filter);
}

export function filterStates(filter: RegionFilter): StateRow[] {
  if (filter === "all" || filter === "national") return STATE_PANEL;
  return STATE_PANEL.filter((s) => s.region === filter);
}

export function rateTableRows(): Array<{
  year: number;
  mvtRate: number;
  violentRate: number;
  mvtIndex: number;
  violentIndex: number;
  gapPoints: number;
  confidence: Confidence;
}> {
  return DUAL_SERIES.filter((r) => r.year >= 2015).map((r) => ({
    year: r.year,
    mvtRate: r.mvtRate,
    violentRate: r.violentRate,
    mvtIndex: r.mvtIndex,
    violentIndex: r.violentIndex,
    gapPoints: r.gapPoints,
    confidence: r.confidence,
  }));
}
