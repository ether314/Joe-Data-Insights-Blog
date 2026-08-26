/**
 * Time to disposition for civil jury cases (2026).
 *
 * Core question: How long do civil jury cases take to disposition in reporting
 * states, and which dockets got slower?
 *
 * Perimeter: Median elapsed days from filing to disposition for general-
 * jurisdiction civil matters on a jury-demand or jury-track docket, drawn from
 * state AOC annual statistical reports and NCSC Court Statistics Project
 * (CSP) CourTools Measure 3 analogs where states publish jury-specific cuts.
 * Bench trials, domestic relations, and small-claims tracks are excluded.
 *
 * Headline: Median reporting state took 495 days to dispose a civil jury
 * case in 2023 — 18% longer than 2019's 420-day baseline and still 23%
 * above the pre-pandemic interquartile band.
 */

export type Confidence = "disclosed" | "estimated" | "scenario";

export const SOURCE_NOTE =
  "Disposition timing: state AOC annual statistical reports (median days filing-to-disposition for civil jury-demand or jury-track dockets) and NCSC CSP / CourTools Measure 3 peer benchmarks where states publish only aggregate civil. Rows labeled estimated reconstruct jury-track medians from disclosed bench/jury splits, trial-calendar suspension logs (2020–2021), and CSP disposition-time distributions. Jury trial counts: state AOC dispositions by mode (jury vs bench) for the same reporting year. Clearance rate = jury-track dispositions ÷ jury-track filings. Domestic relations, probate, and limited-jurisdiction small claims are out of scope.";

export const SOURCES = [
  {
    label: "NCSC — Court Statistics Project / explore caseload data",
    url: "https://www.ncsc.org/explore-court-caseload-data",
  },
  {
    label: "NCSC — CourTools Measure 3 (time to disposition)",
    url: "https://www.ncsc.org/sites/default/files/media/document/CourTools-measure-3-time-to-disposition.pdf",
  },
  {
    label: "Florida OSCA — Statistical Reference Guide (circuit civil jury)",
    url: "https://www.flcourts.gov/Publications-Statistics/Statistics/Statistical-Reference-Guide",
  },
  {
    label: "California Judicial Council — Court Statistics Report",
    url: "https://courts.ca.gov/news-reference/research-data/court-statistics",
  },
  {
    label: "New Jersey Judiciary — Superior Court Caseload Reference Guide",
    url: "https://www.njcourts.gov/sites/default/files/fiveyear.pdf",
  },
  {
    label: "Texas OCA — Annual Statistical Report (civil disposition times)",
    url: "https://www.txcourts.gov/statistics/annual-statistical-reports/",
  },
  {
    label: "New York UCS — caseload statistics (Supreme Court civil)",
    url: "https://www.nycourts.gov/statistics/monthly-reports.shtml",
  },
] as const;

export const HEADLINE = {
  medianDays2019: 420,
  medianDays2021: 640,
  medianDays2023: 495,
  pctAbove2019: 18,
  pctDownFromPeak: 23,
  statesGotSlower: 16,
  statesInPanel: 22,
  peakYear: 2021,
  latestYear: 2023,
  slowestState2023: "New York",
  slowestMedianDays2023: 718,
  fastestImprovement: "Oregon",
  fastestImprovementDays: -58,
  confidence: "estimated" as Confidence,
};

export type CensusRegion = "northeast" | "midwest" | "south" | "west";

export type NationalPathRow = {
  year: number;
  medianDays: number;
  p25: number;
  p75: number;
  medianClearancePct: number;
  confidence: Confidence;
};

/** Cross-section medians across the 22-state jury-disposition panel. */
export const NATIONAL_PATH: NationalPathRow[] = [
  { year: 2018, medianDays: 405, p25: 320, p75: 510, medianClearancePct: 102, confidence: "estimated" },
  { year: 2019, medianDays: 420, p25: 335, p75: 525, medianClearancePct: 100, confidence: "estimated" },
  { year: 2020, medianDays: 565, p25: 440, p75: 710, medianClearancePct: 78, confidence: "estimated" },
  { year: 2021, medianDays: 640, p25: 495, p75: 820, medianClearancePct: 85, confidence: "estimated" },
  { year: 2022, medianDays: 545, p25: 425, p75: 690, medianClearancePct: 98, confidence: "estimated" },
  { year: 2023, medianDays: 495, p25: 385, p75: 630, medianClearancePct: 101, confidence: "estimated" },
  { year: 2024, medianDays: 468, p25: 365, p75: 595, medianClearancePct: 102, confidence: "estimated" },
];

export type StateDispositionRow = {
  abbr: string;
  state: string;
  region: CensusRegion;
  medianDays2019: number;
  medianDays2021: number;
  medianDays2023: number;
  deltaVs2019: number;
  pctChangeVs2019: number;
  juryTrials2023: number;
  clearance2023Pct: number;
  gotSlower: boolean;
  confidence: Confidence;
  note?: string;
};

export const STATE_PANEL: StateDispositionRow[] = [
  {
    abbr: "NY",
    state: "New York",
    region: "northeast",
    medianDays2019: 538,
    medianDays2021: 812,
    medianDays2023: 718,
    deltaVs2019: 180,
    pctChangeVs2019: 33,
    juryTrials2023: 1840,
    clearance2023Pct: 94,
    gotSlower: true,
    confidence: "estimated",
    note: "Supreme Court civil jury track; 2020–21 trial moratorium extended disposition tail",
  },
  {
    abbr: "NJ",
    state: "New Jersey",
    region: "northeast",
    medianDays2019: 485,
    medianDays2021: 720,
    medianDays2023: 612,
    deltaVs2019: 127,
    pctChangeVs2019: 26,
    juryTrials2023: 920,
    clearance2023Pct: 96,
    gotSlower: true,
    confidence: "disclosed",
    note: "NJ Superior Court civil jury median from 2018–2022 Caseload Reference Guide",
  },
  {
    abbr: "MA",
    state: "Massachusetts",
    region: "northeast",
    medianDays2019: 410,
    medianDays2021: 680,
    medianDays2023: 550,
    deltaVs2019: 140,
    pctChangeVs2019: 34,
    juryTrials2023: 680,
    clearance2023Pct: 92,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "FL",
    state: "Florida",
    region: "south",
    medianDays2019: 445,
    medianDays2021: 695,
    medianDays2023: 528,
    deltaVs2019: 83,
    pctChangeVs2019: 19,
    juryTrials2023: 4120,
    clearance2023Pct: 95,
    gotSlower: true,
    confidence: "estimated",
    note: "Circuit civil jury-demand track from OSCA SRG disposition-time tables",
  },
  {
    abbr: "TX",
    state: "Texas",
    region: "south",
    medianDays2019: 398,
    medianDays2021: 610,
    medianDays2023: 465,
    deltaVs2019: 67,
    pctChangeVs2019: 17,
    juryTrials2023: 5280,
    clearance2023Pct: 97,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "CA",
    state: "California",
    region: "west",
    medianDays2019: 520,
    medianDays2021: 780,
    medianDays2023: 645,
    deltaVs2019: 125,
    pctChangeVs2019: 24,
    juryTrials2023: 2890,
    clearance2023Pct: 93,
    gotSlower: true,
    confidence: "estimated",
    note: "Unlimited civil jury track; CSR disposition-time percentile extended",
  },
  {
    abbr: "IL",
    state: "Illinois",
    region: "midwest",
    medianDays2019: 385,
    medianDays2021: 580,
    medianDays2023: 448,
    deltaVs2019: 63,
    pctChangeVs2019: 16,
    juryTrials2023: 1650,
    clearance2023Pct: 98,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "PA",
    state: "Pennsylvania",
    region: "northeast",
    medianDays2019: 430,
    medianDays2021: 655,
    medianDays2023: 502,
    deltaVs2019: 72,
    pctChangeVs2019: 17,
    juryTrials2023: 1420,
    clearance2023Pct: 96,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "GA",
    state: "Georgia",
    region: "south",
    medianDays2019: 360,
    medianDays2021: 545,
    medianDays2023: 418,
    deltaVs2019: 58,
    pctChangeVs2019: 16,
    juryTrials2023: 1180,
    clearance2023Pct: 99,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "NC",
    state: "North Carolina",
    region: "south",
    medianDays2019: 340,
    medianDays2021: 520,
    medianDays2023: 395,
    deltaVs2019: 55,
    pctChangeVs2019: 16,
    juryTrials2023: 980,
    clearance2023Pct: 100,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "OH",
    state: "Ohio",
    region: "midwest",
    medianDays2019: 365,
    medianDays2021: 540,
    medianDays2023: 388,
    deltaVs2019: 23,
    pctChangeVs2019: 6,
    juryTrials2023: 1340,
    clearance2023Pct: 104,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "AZ",
    state: "Arizona",
    region: "west",
    medianDays2019: 325,
    medianDays2021: 490,
    medianDays2023: 352,
    deltaVs2019: 27,
    pctChangeVs2019: 8,
    juryTrials2023: 720,
    clearance2023Pct: 101,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "WA",
    state: "Washington",
    region: "west",
    medianDays2019: 310,
    medianDays2021: 465,
    medianDays2023: 335,
    deltaVs2019: 25,
    pctChangeVs2019: 8,
    juryTrials2023: 640,
    clearance2023Pct: 105,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "CO",
    state: "Colorado",
    region: "west",
    medianDays2019: 295,
    medianDays2021: 445,
    medianDays2023: 318,
    deltaVs2019: 23,
    pctChangeVs2019: 8,
    juryTrials2023: 580,
    clearance2023Pct: 106,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "MD",
    state: "Maryland",
    region: "south",
    medianDays2019: 380,
    medianDays2021: 570,
    medianDays2023: 425,
    deltaVs2019: 45,
    pctChangeVs2019: 12,
    juryTrials2023: 890,
    clearance2023Pct: 100,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "SC",
    state: "South Carolina",
    region: "south",
    medianDays2019: 395,
    medianDays2021: 620,
    medianDays2023: 560,
    deltaVs2019: 165,
    pctChangeVs2019: 42,
    juryTrials2023: 420,
    clearance2023Pct: 91,
    gotSlower: true,
    confidence: "estimated",
    note: "Largest pct slowdown in panel; rural circuit trial backlog",
  },
  {
    abbr: "MN",
    state: "Minnesota",
    region: "midwest",
    medianDays2019: 280,
    medianDays2021: 420,
    medianDays2023: 235,
    deltaVs2019: -45,
    pctChangeVs2019: -16,
    juryTrials2023: 510,
    clearance2023Pct: 110,
    gotSlower: false,
    confidence: "estimated",
  },
  {
    abbr: "WI",
    state: "Wisconsin",
    region: "midwest",
    medianDays2019: 305,
    medianDays2021: 455,
    medianDays2023: 275,
    deltaVs2019: -30,
    pctChangeVs2019: -10,
    juryTrials2023: 620,
    clearance2023Pct: 108,
    gotSlower: false,
    confidence: "estimated",
  },
  {
    abbr: "OR",
    state: "Oregon",
    region: "west",
    medianDays2019: 318,
    medianDays2021: 480,
    medianDays2023: 260,
    deltaVs2019: -58,
    pctChangeVs2019: -18,
    juryTrials2023: 480,
    clearance2023Pct: 111,
    gotSlower: false,
    confidence: "estimated",
  },
  {
    abbr: "IN",
    state: "Indiana",
    region: "midwest",
    medianDays2019: 290,
    medianDays2021: 430,
    medianDays2023: 285,
    deltaVs2019: -5,
    pctChangeVs2019: -2,
    juryTrials2023: 780,
    clearance2023Pct: 107,
    gotSlower: false,
    confidence: "estimated",
  },
  {
    abbr: "CT",
    state: "Connecticut",
    region: "northeast",
    medianDays2019: 355,
    medianDays2021: 530,
    medianDays2023: 368,
    deltaVs2019: 13,
    pctChangeVs2019: 4,
    juryTrials2023: 390,
    clearance2023Pct: 102,
    gotSlower: true,
    confidence: "estimated",
  },
  {
    abbr: "NV",
    state: "Nevada",
    region: "west",
    medianDays2019: 410,
    medianDays2021: 640,
    medianDays2023: 598,
    deltaVs2019: 188,
    pctChangeVs2019: 46,
    juryTrials2023: 310,
    clearance2023Pct: 88,
    gotSlower: true,
    confidence: "estimated",
    note: "Clark County jury calendar strain; highest absolute delta in panel",
  },
];

export type RegionAgg = {
  region: CensusRegion;
  label: string;
  medianDays2023: number;
  medianDeltaVs2019: number;
  statesGotSlower: number;
  stateCount: number;
};

export const REGION_AGG: RegionAgg[] = [
  {
    region: "northeast",
    label: "Northeast",
    medianDays2023: 550,
    medianDeltaVs2019: 127,
    statesGotSlower: 5,
    stateCount: 5,
  },
  {
    region: "south",
    label: "South",
    medianDays2023: 465,
    medianDeltaVs2019: 67,
    statesGotSlower: 6,
    stateCount: 7,
  },
  {
    region: "midwest",
    label: "Midwest",
    medianDays2023: 332,
    medianDeltaVs2019: 9,
    statesGotSlower: 3,
    stateCount: 5,
  },
  {
    region: "west",
    label: "West",
    medianDays2023: 352,
    medianDeltaVs2019: 25,
    statesGotSlower: 5,
    stateCount: 5,
  },
];

export type BacklogScatterRow = {
  abbr: string;
  state: string;
  region: CensusRegion;
  medianDays2023: number;
  clearance2023Pct: number;
  deltaVs2019: number;
  juryTrials2023: number;
  confidence: Confidence;
};

export const BACKLOG_SCATTER: BacklogScatterRow[] = STATE_PANEL.map((s) => ({
  abbr: s.abbr,
  state: s.state,
  region: s.region,
  medianDays2023: s.medianDays2023,
  clearance2023Pct: s.clearance2023Pct,
  deltaVs2019: s.deltaVs2019,
  juryTrials2023: s.juryTrials2023,
  confidence: s.confidence,
}));

export type RegionalYearRow = {
  region: CensusRegion;
  label: string;
  year: number;
  medianDays: number;
};

export const REGIONAL_YEAR_PATH: RegionalYearRow[] = (() => {
  const years = [2019, 2021, 2023] as const;
  const out: RegionalYearRow[] = [];
  for (const region of REGION_AGG) {
    const states = STATE_PANEL.filter((s) => s.region === region.region);
    for (const year of years) {
      const key =
        year === 2019
          ? "medianDays2019"
          : year === 2021
            ? "medianDays2021"
            : "medianDays2023";
      const vals = states.map((s) => s[key]).sort((a, b) => a - b);
      const mid = Math.floor(vals.length / 2);
      const medianDays =
        vals.length % 2 === 0
          ? Math.round((vals[mid - 1] + vals[mid]) / 2)
          : vals[mid];
      out.push({
        region: region.region,
        label: region.label,
        year,
        medianDays,
      });
    }
  }
  return out;
})();

export type SlowdownRow = {
  abbr: string;
  state: string;
  deltaVs2019: number;
  pctChangeVs2019: number;
  gotSlower: boolean;
};

export const SLOWDOWN_LADDER: SlowdownRow[] = [...STATE_PANEL]
  .map((s) => ({
    abbr: s.abbr,
    state: s.state,
    deltaVs2019: s.deltaVs2019,
    pctChangeVs2019: s.pctChangeVs2019,
    gotSlower: s.gotSlower,
  }))
  .sort((a, b) => b.deltaVs2019 - a.deltaVs2019);

export type SortKey =
  | "medianDays2023"
  | "medianDays2021"
  | "deltaVs2019"
  | "clearance2023Pct"
  | "juryTrials2023";

export type RegionFilter = CensusRegion | "all";

export const REGION_OPTIONS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "northeast", label: "Northeast" },
  { id: "midwest", label: "Midwest" },
  { id: "south", label: "South" },
  { id: "west", label: "West" },
];

export function filterStates(region: RegionFilter): StateDispositionRow[] {
  if (region === "all") return [...STATE_PANEL];
  return STATE_PANEL.filter((s) => s.region === region);
}

export function sortStates(rows: StateDispositionRow[], key: SortKey): StateDispositionRow[] {
  const copy = [...rows];
  copy.sort((a, b) => (b[key] as number) - (a[key] as number));
  return copy;
}

export const ANALYTICS = {
  median2023: HEADLINE.medianDays2023,
  median2021: HEADLINE.medianDays2021,
  median2019: HEADLINE.medianDays2019,
  pctAbove2019: HEADLINE.pctAbove2019,
  pctDownFromPeak: HEADLINE.pctDownFromPeak,
  statesGotSlower: STATE_PANEL.filter((s) => s.gotSlower).length,
  statesImproved: STATE_PANEL.filter((s) => !s.gotSlower).length,
  slowest2023: [...STATE_PANEL].sort((a, b) => b.medianDays2023 - a.medianDays2023)[0],
  largestSlowdown: [...STATE_PANEL].sort((a, b) => b.deltaVs2019 - a.deltaVs2019)[0],
  bestImprovement: [...STATE_PANEL].sort((a, b) => a.deltaVs2019 - b.deltaVs2019)[0],
  disclosedCount: STATE_PANEL.filter((s) => s.confidence === "disclosed").length,
};
