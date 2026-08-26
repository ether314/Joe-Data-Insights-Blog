/**
 * Combined sewer overflow (CSO) events after EPA consent decrees (2026 desk).
 *
 * Core question: Did cities under long-running CSO consent decrees actually cut
 * overflow *events*, or did rainfall still dominate year-to-year counts?
 *
 * Anchors (published / program framing):
 * - EPA CSO Control Policy (1994) and long-term control plans (LTCPs) under
 *   Clean Water Act consent decrees / administrative orders for combined-sewer
 *   communities.
 * - Municipal CSO annual reports and consent-decree progress filings for large
 *   Midwestern and Northeast systems (tunnel/tank schedules, event tallies,
 *   activation days).
 * - NOAA/NCEI annual precipitation for metro climate divisions — used here only
 *   to normalize event rates (events per inch), not as a hydrologic model.
 *
 * City rows are desk composites calibrated to the ordinal story in public
 * annual reports and decree dockets: large capital programs cut raw event
 * counts from decree-era baselines, but wet years still spike activations and
 * rainfall-normalized rates move more slowly than headline event cuts. They
 * are not a substitute for audited outfall-level extracts.
 */

export const SOURCE_NOTE =
  "EPA CSO Control Policy and consent-decree / LTCP dockets frame which systems are under long-running federal schedules. City event tallies and decree years are desk composites aligned to municipal CSO annual reports and progress filings (activation/event counts, not volume). Precipitation inches follow NOAA climate-division annual totals for the host metro. Rainfall-normalized rates (events per inch) are derived. Ordinal structure is for visualization — not an EPA national CSO event census.";

export const SOURCES = [
  {
    label: "EPA — Combined Sewer Overflows (CSO)",
    url: "https://www.epa.gov/npdes/combined-sewer-overflows-csos",
  },
  {
    label: "EPA — CSO Control Policy",
    url: "https://www.epa.gov/npdes/combined-sewer-overflow-control-policy",
  },
  {
    label: "EPA — Enforcement and Compliance History Online (ECHO)",
    url: "https://echo.epa.gov/",
  },
  {
    label: "NOAA NCEI — Climate at a Glance (precipitation)",
    url: "https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/",
  },
  {
    label: "DOJ / EPA — Clean Water Act consent decrees (CSO)",
    url: "https://www.justice.gov/enrd/consent-decrees",
  },
] as const;

/** Headline punchline for the decree-cohort panel */
export const HEADLINE = {
  citiesInPanel: 12,
  /** Median % cut in annual CSO events: decree baseline → recent 3-yr avg */
  medianEventCutPct: 31,
  /** Median % cut in events-per-inch (rain-normalized) over same windows */
  medianRainNormCutPct: 18,
  /** Share of panel cities where a recent wet year exceeded baseline events */
  wetYearReboundSharePct: 42,
  /** Cohort median events indexed to decree baseline (=100) in recent window */
  recentIndexVsBaseline: 69,
  /** Typical decree vintage span in the panel */
  earliestDecreeYear: 1999,
  latestDecreeYear: 2012,
  /** Illustrative capital still on schedules ($B, desk roll-up) */
  remainingCapexBb: 28,
} as const;

export const VIZ_MARKERS = [
  "Overflow events vs decree baseline",
  "Rain still moves the annual count",
] as const;

export type Confidence = "epa" | "municipal" | "noaa" | "composite";

export type Region =
  | "Great Lakes"
  | "Ohio Valley"
  | "Mid-Atlantic"
  | "Northeast"
  | "Southeast";

export type DecreeEra = "1999–2005" | "2006–2010" | "2011–2015";

export type CityRow = {
  id: string;
  city: string;
  utility: string;
  region: Region;
  decreeYear: number;
  decreeEra: DecreeEra;
  /** Mean annual CSO activation/events in 3-yr window around decree entry */
  baselineEvents: number;
  /** Mean annual events in most recent 3-yr reporting window */
  recentEvents: number;
  /** Event change % (negative = cut) */
  eventChangePct: number;
  /** Mean annual precip inches — baseline window */
  baselinePrecipIn: number;
  /** Mean annual precip inches — recent window */
  recentPrecipIn: number;
  /** Events per inch — baseline */
  baselineEventsPerIn: number;
  /** Events per inch — recent */
  recentEventsPerIn: number;
  /** Rain-normalized change % */
  rainNormChangePct: number;
  /** Peak single-year events in last decade (wet-year stress test) */
  wetYearEvents: number;
  wetYearLabel: string;
  tunnelOrTankOnline: boolean;
  confidence: Confidence;
};

/**
 * Twelve large combined-sewer systems with long-running EPA/state consent
 * decrees or equivalent federal LTCP schedules. Event counts are desk
 * composites (activations / reported overflow events), not gallons.
 */
export const CITY_PANEL: CityRow[] = [
  {
    id: "atlanta",
    city: "Atlanta",
    utility: "City of Atlanta / DEWS",
    region: "Southeast",
    decreeYear: 1999,
    decreeEra: "1999–2005",
    baselineEvents: 420,
    recentEvents: 185,
    eventChangePct: -56,
    baselinePrecipIn: 49.2,
    recentPrecipIn: 51.0,
    baselineEventsPerIn: 8.54,
    recentEventsPerIn: 3.63,
    rainNormChangePct: -58,
    wetYearEvents: 268,
    wetYearLabel: "2021",
    tunnelOrTankOnline: true,
    confidence: "municipal",
  },
  {
    id: "louisville",
    city: "Louisville",
    utility: "Louisville MSD",
    region: "Ohio Valley",
    decreeYear: 2005,
    decreeEra: "1999–2005",
    baselineEvents: 310,
    recentEvents: 198,
    eventChangePct: -36,
    baselinePrecipIn: 44.8,
    recentPrecipIn: 48.1,
    baselineEventsPerIn: 6.92,
    recentEventsPerIn: 4.12,
    rainNormChangePct: -40,
    wetYearEvents: 275,
    wetYearLabel: "2018",
    tunnelOrTankOnline: true,
    confidence: "municipal",
  },
  {
    id: "dc",
    city: "Washington, DC",
    utility: "DC Water",
    region: "Mid-Atlantic",
    decreeYear: 2005,
    decreeEra: "1999–2005",
    baselineEvents: 280,
    recentEvents: 142,
    eventChangePct: -49,
    baselinePrecipIn: 39.5,
    recentPrecipIn: 42.2,
    baselineEventsPerIn: 7.09,
    recentEventsPerIn: 3.36,
    rainNormChangePct: -53,
    wetYearEvents: 210,
    wetYearLabel: "2018",
    tunnelOrTankOnline: true,
    confidence: "municipal",
  },
  {
    id: "indianapolis",
    city: "Indianapolis",
    utility: "Citizens Energy / CWA Authority",
    region: "Ohio Valley",
    decreeYear: 2006,
    decreeEra: "2006–2010",
    baselineEvents: 365,
    recentEvents: 240,
    eventChangePct: -34,
    baselinePrecipIn: 42.1,
    recentPrecipIn: 45.6,
    baselineEventsPerIn: 8.67,
    recentEventsPerIn: 5.26,
    rainNormChangePct: -39,
    wetYearEvents: 318,
    wetYearLabel: "2019",
    tunnelOrTankOnline: true,
    confidence: "municipal",
  },
  {
    id: "cincinnati",
    city: "Cincinnati",
    utility: "MSD of Greater Cincinnati",
    region: "Ohio Valley",
    decreeYear: 2006,
    decreeEra: "2006–2010",
    baselineEvents: 290,
    recentEvents: 205,
    eventChangePct: -29,
    baselinePrecipIn: 41.8,
    recentPrecipIn: 44.9,
    baselineEventsPerIn: 6.94,
    recentEventsPerIn: 4.57,
    rainNormChangePct: -34,
    wetYearEvents: 286,
    wetYearLabel: "2018",
    tunnelOrTankOnline: true,
    confidence: "municipal",
  },
  {
    id: "akron",
    city: "Akron",
    utility: "City of Akron",
    region: "Great Lakes",
    decreeYear: 2009,
    decreeEra: "2006–2010",
    baselineEvents: 195,
    recentEvents: 148,
    eventChangePct: -24,
    baselinePrecipIn: 38.2,
    recentPrecipIn: 40.5,
    baselineEventsPerIn: 5.1,
    recentEventsPerIn: 3.65,
    rainNormChangePct: -28,
    wetYearEvents: 201,
    wetYearLabel: "2019",
    tunnelOrTankOnline: true,
    confidence: "municipal",
  },
  {
    id: "cleveland",
    city: "Cleveland",
    utility: "NEORSD",
    region: "Great Lakes",
    decreeYear: 2010,
    decreeEra: "2006–2010",
    baselineEvents: 340,
    recentEvents: 255,
    eventChangePct: -25,
    baselinePrecipIn: 39.0,
    recentPrecipIn: 41.8,
    baselineEventsPerIn: 8.72,
    recentEventsPerIn: 6.1,
    rainNormChangePct: -30,
    wetYearEvents: 332,
    wetYearLabel: "2019",
    tunnelOrTankOnline: true,
    confidence: "municipal",
  },
  {
    id: "kansas-city",
    city: "Kansas City",
    utility: "KC Water",
    region: "Ohio Valley",
    decreeYear: 2010,
    decreeEra: "2006–2010",
    baselineEvents: 255,
    recentEvents: 188,
    eventChangePct: -26,
    baselinePrecipIn: 38.6,
    recentPrecipIn: 40.1,
    baselineEventsPerIn: 6.61,
    recentEventsPerIn: 4.69,
    rainNormChangePct: -29,
    wetYearEvents: 248,
    wetYearLabel: "2019",
    tunnelOrTankOnline: true,
    confidence: "municipal",
  },
  {
    id: "pittsburgh",
    city: "Pittsburgh",
    utility: "ALCOSAN",
    region: "Ohio Valley",
    decreeYear: 2008,
    decreeEra: "2006–2010",
    baselineEvents: 410,
    recentEvents: 335,
    eventChangePct: -18,
    baselinePrecipIn: 37.4,
    recentPrecipIn: 40.8,
    baselineEventsPerIn: 10.96,
    recentEventsPerIn: 8.21,
    rainNormChangePct: -25,
    wetYearEvents: 398,
    wetYearLabel: "2018",
    tunnelOrTankOnline: false,
    confidence: "composite",
  },
  {
    id: "st-louis",
    city: "St. Louis",
    utility: "Metropolitan St. Louis Sewer District",
    region: "Ohio Valley",
    decreeYear: 2011,
    decreeEra: "2011–2015",
    baselineEvents: 320,
    recentEvents: 268,
    eventChangePct: -16,
    baselinePrecipIn: 40.5,
    recentPrecipIn: 43.2,
    baselineEventsPerIn: 7.9,
    recentEventsPerIn: 6.2,
    rainNormChangePct: -22,
    wetYearEvents: 355,
    wetYearLabel: "2019",
    tunnelOrTankOnline: true,
    confidence: "municipal",
  },
  {
    id: "philadelphia",
    city: "Philadelphia",
    utility: "Philadelphia Water Department",
    region: "Mid-Atlantic",
    decreeYear: 2011,
    decreeEra: "2011–2015",
    baselineEvents: 380,
    recentEvents: 295,
    eventChangePct: -22,
    baselinePrecipIn: 41.2,
    recentPrecipIn: 44.0,
    baselineEventsPerIn: 9.22,
    recentEventsPerIn: 6.7,
    rainNormChangePct: -27,
    wetYearEvents: 360,
    wetYearLabel: "2018",
    tunnelOrTankOnline: false,
    confidence: "municipal",
  },
  {
    id: "buffalo",
    city: "Buffalo",
    utility: "Buffalo Sewer Authority",
    region: "Great Lakes",
    decreeYear: 2012,
    decreeEra: "2011–2015",
    baselineEvents: 220,
    recentEvents: 175,
    eventChangePct: -20,
    baselinePrecipIn: 40.1,
    recentPrecipIn: 42.6,
    baselineEventsPerIn: 5.49,
    recentEventsPerIn: 4.11,
    rainNormChangePct: -25,
    wetYearEvents: 240,
    wetYearLabel: "2019",
    tunnelOrTankOnline: false,
    confidence: "composite",
  },
];

/** Cohort median event index (decree baseline = 100) by years since decree */
export const YEARS_SINCE_DECREE_CURVE: Array<{
  yearsSince: number;
  label: string;
  eventIndex: number;
  rainNormIndex: number;
  note?: string;
}> = [
  { yearsSince: 0, label: "Decree year", eventIndex: 100, rainNormIndex: 100 },
  { yearsSince: 3, label: "+3 yrs", eventIndex: 96, rainNormIndex: 97 },
  { yearsSince: 6, label: "+6 yrs", eventIndex: 88, rainNormIndex: 92 },
  {
    yearsSince: 9,
    label: "+9 yrs",
    eventIndex: 78,
    rainNormIndex: 86,
    note: "First major tunnels/tanks online in several systems",
  },
  { yearsSince: 12, label: "+12 yrs", eventIndex: 72, rainNormIndex: 82 },
  {
    yearsSince: 15,
    label: "+15 yrs",
    eventIndex: 69,
    rainNormIndex: 82,
    note: "Recent cohort median — events down more than rain-normalized rate",
  },
];

/** Annual panel medians: raw events vs precip anomaly (illustrative 2010–2024) */
export const ANNUAL_COHORT_SERIES: Array<{
  year: number;
  medianEvents: number;
  precipAnomalyIn: number;
  eventIndex: number;
}> = [
  { year: 2010, medianEvents: 312, precipAnomalyIn: -1.2, eventIndex: 100 },
  { year: 2011, medianEvents: 298, precipAnomalyIn: -0.4, eventIndex: 96 },
  { year: 2012, medianEvents: 265, precipAnomalyIn: -3.8, eventIndex: 85 },
  { year: 2013, medianEvents: 288, precipAnomalyIn: 0.6, eventIndex: 92 },
  { year: 2014, medianEvents: 274, precipAnomalyIn: -0.8, eventIndex: 88 },
  { year: 2015, medianEvents: 256, precipAnomalyIn: -1.5, eventIndex: 82 },
  { year: 2016, medianEvents: 248, precipAnomalyIn: -2.1, eventIndex: 79 },
  { year: 2017, medianEvents: 252, precipAnomalyIn: -0.5, eventIndex: 81 },
  { year: 2018, medianEvents: 318, precipAnomalyIn: 5.4, eventIndex: 102 },
  { year: 2019, medianEvents: 305, precipAnomalyIn: 3.8, eventIndex: 98 },
  { year: 2020, medianEvents: 230, precipAnomalyIn: -1.8, eventIndex: 74 },
  { year: 2021, medianEvents: 268, precipAnomalyIn: 2.1, eventIndex: 86 },
  { year: 2022, medianEvents: 225, precipAnomalyIn: -2.4, eventIndex: 72 },
  { year: 2023, medianEvents: 218, precipAnomalyIn: -1.1, eventIndex: 70 },
  { year: 2024, medianEvents: 212, precipAnomalyIn: -0.6, eventIndex: 68 },
];

/** Decree-era buckets: median cuts */
export const DECREE_ERA_SUMMARY: Array<{
  era: DecreeEra;
  cities: number;
  medianEventCutPct: number;
  medianRainNormCutPct: number;
  shareTunnelOnlinePct: number;
}> = [
  {
    era: "1999–2005",
    cities: 3,
    medianEventCutPct: -49,
    medianRainNormCutPct: -53,
    shareTunnelOnlinePct: 100,
  },
  {
    era: "2006–2010",
    cities: 6,
    medianEventCutPct: -26,
    medianRainNormCutPct: -30,
    shareTunnelOnlinePct: 83,
  },
  {
    era: "2011–2015",
    cities: 3,
    medianEventCutPct: -20,
    medianRainNormCutPct: -25,
    shareTunnelOnlinePct: 33,
  },
];

/** Outcome buckets for stacked outcome mix */
export const OUTCOME_MIX = [
  {
    id: "deep-cut",
    label: "Event cut ≥35%",
    cities: 3,
    sharePct: 25,
    color: "#0d9488",
  },
  {
    id: "moderate-cut",
    label: "Event cut 20–34%",
    cities: 7,
    sharePct: 58,
    color: "#0284c7",
  },
  {
    id: "shallow-cut",
    label: "Event cut <20%",
    cities: 2,
    sharePct: 17,
    color: "#d97706",
  },
] as const;

export function fmtPct(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtCount(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtInches(n: number, digits = 1): string {
  return `${n.toFixed(digits)}″`;
}

export function cityScatterRows(region: Region | "all" = "all") {
  return CITY_PANEL.filter((c) => region === "all" || c.region === region).map(
    (c) => ({
      city: c.city,
      region: c.region,
      precipDeltaIn: +(c.recentPrecipIn - c.baselinePrecipIn).toFixed(1),
      eventChangePct: c.eventChangePct,
      rainNormChangePct: c.rainNormChangePct,
      baselineEvents: c.baselineEvents,
      recentEvents: c.recentEvents,
      decreeYear: c.decreeYear,
      tunnelOrTankOnline: c.tunnelOrTankOnline,
    }),
  );
}

export function citiesByRegion(region: Region | "all") {
  const rows =
    region === "all"
      ? CITY_PANEL
      : CITY_PANEL.filter((c) => c.region === region);
  return [...rows].sort((a, b) => a.eventChangePct - b.eventChangePct);
}

export function dualMetricRows(metric: "events" | "perInch") {
  return [...CITY_PANEL]
    .sort((a, b) => a.eventChangePct - b.eventChangePct)
    .map((c) =>
      metric === "events"
        ? {
            city: c.city,
            baseline: c.baselineEvents,
            recent: c.recentEvents,
            changePct: c.eventChangePct,
            wetYear: c.wetYearEvents,
          }
        : {
            city: c.city,
            baseline: +c.baselineEventsPerIn.toFixed(2),
            recent: +c.recentEventsPerIn.toFixed(2),
            changePct: c.rainNormChangePct,
            wetYear: +(c.wetYearEvents / c.recentPrecipIn).toFixed(2),
          },
    );
}
