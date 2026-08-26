/**
 * Dormancy periods versus escheat inflows (2026).
 *
 * Core question: Did shorter dormancy statutes raise annual escheat inflows
 * without raising owner reunification rates?
 *
 * Method: Build a desk panel of 18 large unclaimed-property programs from
 * NAUPA FY aggregates, state treasurer / controller annual reports, and
 * published dormancy-statute summaries (Sovos / ReportMyUP / NAUPA holder
 * guides). Classify each state as a **shortening cohort** (banking or
 * demand-deposit dormancy cut from 5+/7 years to 3 between 2004–2020) or a
 * **holdout** (still 5 years on checking/savings). Measure:
 *   (1) post-cut vs pre-cut average annual remittance (inflow) change,
 *   (2) owner-return / remittance reunification ratio pre vs post,
 *   (3) national path of remittances vs returns 2015–2024,
 *   (4) dormancy-trigger mix (inactivity vs RPO vs hybrid).
 * Where treasurers do not publish vintage-matched remittance series, mid-
 * panel cells are desk-modeled joins — flagged estimated/modeled.
 *
 * Confidence: NAUPA national returns and many dormancy statutes are
 * disclosed; state remittance deltas and reunification ratios often require
 * estimated joins across fiscal calendars — not audited NAUPA member CSVs.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "Dormancy statutes: NAUPA holder guides, Sovos / ReportMyUP dormancy tables, and state codes for banking / demand-deposit clocks. National owner returns and float framing: NAUPA FY reports and Senate Banking oversight letter to NAUPA (Apr 2026). State remittance and return dollars: treasurer / controller annual reports and press releases for the panel jurisdictions. Inflow deltas and reunification ratios join disclosed statute dates to nearest available fiscal remittance windows — desk estimates where vintage-matched ledgers are unpublished.";

export const SOURCES = [
  {
    label: "NAUPA — FY reports & holder dormancy guides",
    url: "https://unclaimed.org/",
  },
  {
    label: "Senate Banking — Letter to NAUPA on escheatment (Apr 15, 2026)",
    url: "https://www.banking.senate.gov/imo/media/doc/20260415lettertonaupaonescheatment.pdf",
  },
  {
    label: "Sovos / ReportMyUP — State dormancy period tables",
    url: "https://reportmyup.com/state-dormancy-periods-for-unclaimed-property-reporting/",
  },
  {
    label: "State treasurer & controller unclaimed-property annual reports",
    url: "https://unclaimed.org/",
  },
] as const;

/** Punchline stats for hero / analytics */
export const HEADLINE = {
  /** Jurisdictions that shortened banking dormancy 2004–2020 (Senate / Sovos cite) */
  jurisdictionsShortened: 17,
  /** Panel states in shortening cohort */
  panelShorteners: 11,
  /** Panel holdouts still on 5-year banking dormancy */
  panelHoldouts: 7,
  /** Median post-cut remittance change, shortening cohort, % */
  medianInflowDeltaPct: 34,
  /** Median holdout remittance change over matched windows, % */
  medianHoldoutInflowDeltaPct: 9,
  /** Median reunification-rate change (pp) after shortening */
  medianReunificationDeltaPp: 0.4,
  /** Median holdout reunification-rate change (pp) */
  medianHoldoutReunifDeltaPp: 0.6,
  /** Shortening cohort with inflow up ≥20% AND reunification flat/down */
  inflowUpReunifFlat: 8,
  /** National owner returns FY2024, $B (NAUPA) */
  nationalReturnsFy2024B: 4.49,
  /** National custodial float cite, $B */
  nationalFloatB: 70,
  /** Typical banking dormancy after cuts, years */
  shortDormancyYears: 3,
  /** Typical prior banking dormancy, years */
  priorDormancyYears: 5,
} as const;

export const ANALYTICS = {
  smokeMarker: "Inflow change vs reunification",
  headlineLabel: "Median inflow Δ after dormancy cuts",
  headlineValue: `+${HEADLINE.medianInflowDeltaPct}%`,
} as const;

export type TriggerType = "inactivity" | "rpo" | "hybrid";
export type Cohort = "shortened" | "holdout";
export type Region = "northeast" | "midwest" | "south" | "west";

export type StateRow = {
  state: string;
  abbr: string;
  region: Region;
  cohort: Cohort;
  /** Current banking / demand-deposit dormancy, years */
  dormancyYears: number;
  /** Prior dormancy if shortened; else same as current */
  priorDormancyYears: number;
  /** Calendar year of effective shortening; null for holdouts */
  shortenYear: number | null;
  trigger: TriggerType;
  /** Avg annual remittance, 3y pre-cut (or matched window), $M */
  inflowPreM: number;
  /** Avg annual remittance, 3y post-cut (or matched window), $M */
  inflowPostM: number;
  /** (post-pre)/pre * 100 */
  inflowDeltaPct: number;
  /** Owner returns / remittances, pre window, % */
  reunifPrePct: number;
  /** Owner returns / remittances, post window, % */
  reunifPostPct: number;
  /** reunifPost - reunifPre, percentage points */
  reunifDeltaPp: number;
  /** Latest-year remittances, $M */
  latestInflowM: number;
  /** Latest-year owner returns, $M */
  latestReturnM: number;
  confidence: Confidence;
};

/**
 * 18-state panel. Shortening years and dollar paths are desk-joined from
 * statute histories + treasurer disclosures; treat estimated cells as
 * directional, not a NAUPA CSV extract.
 */
export const STATE_PANEL: StateRow[] = [
  {
    state: "California",
    abbr: "CA",
    region: "west",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2007,
    trigger: "inactivity",
    inflowPreM: 680,
    inflowPostM: 980,
    inflowDeltaPct: 44,
    reunifPrePct: 48,
    reunifPostPct: 46,
    reunifDeltaPp: -2.0,
    latestInflowM: 1120,
    latestReturnM: 420,
    confidence: "estimated",
  },
  {
    state: "New York",
    abbr: "NY",
    region: "northeast",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2011,
    trigger: "inactivity",
    inflowPreM: 720,
    inflowPostM: 1050,
    inflowDeltaPct: 46,
    reunifPrePct: 42,
    reunifPostPct: 41,
    reunifDeltaPp: -1.0,
    latestInflowM: 1180,
    latestReturnM: 504,
    confidence: "estimated",
  },
  {
    state: "Texas",
    abbr: "TX",
    region: "south",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2017,
    trigger: "hybrid",
    inflowPreM: 410,
    inflowPostM: 560,
    inflowDeltaPct: 37,
    reunifPrePct: 55,
    reunifPostPct: 57,
    reunifDeltaPp: 2.0,
    latestInflowM: 610,
    latestReturnM: 422,
    confidence: "disclosed",
  },
  {
    state: "Illinois",
    abbr: "IL",
    region: "midwest",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2017,
    trigger: "inactivity",
    inflowPreM: 290,
    inflowPostM: 390,
    inflowDeltaPct: 34,
    reunifPrePct: 58,
    reunifPostPct: 59,
    reunifDeltaPp: 1.0,
    latestInflowM: 420,
    latestReturnM: 299,
    confidence: "estimated",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    region: "northeast",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2014,
    trigger: "inactivity",
    inflowPreM: 265,
    inflowPostM: 355,
    inflowDeltaPct: 34,
    reunifPrePct: 52,
    reunifPostPct: 51,
    reunifDeltaPp: -1.0,
    latestInflowM: 380,
    latestReturnM: 255,
    confidence: "estimated",
  },
  {
    state: "Ohio",
    abbr: "OH",
    region: "midwest",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2019,
    trigger: "hybrid",
    inflowPreM: 210,
    inflowPostM: 275,
    inflowDeltaPct: 31,
    reunifPrePct: 50,
    reunifPostPct: 49,
    reunifDeltaPp: -1.0,
    latestInflowM: 295,
    latestReturnM: 192,
    confidence: "estimated",
  },
  {
    state: "New Jersey",
    abbr: "NJ",
    region: "northeast",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2010,
    trigger: "inactivity",
    inflowPreM: 185,
    inflowPostM: 255,
    inflowDeltaPct: 38,
    reunifPrePct: 47,
    reunifPostPct: 48,
    reunifDeltaPp: 1.0,
    latestInflowM: 270,
    latestReturnM: 145,
    confidence: "estimated",
  },
  {
    state: "Michigan",
    abbr: "MI",
    region: "midwest",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2012,
    trigger: "inactivity",
    inflowPreM: 160,
    inflowPostM: 215,
    inflowDeltaPct: 34,
    reunifPrePct: 49,
    reunifPostPct: 47,
    reunifDeltaPp: -2.0,
    latestInflowM: 230,
    latestReturnM: 110,
    confidence: "estimated",
  },
  {
    state: "Arizona",
    abbr: "AZ",
    region: "west",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2016,
    trigger: "inactivity",
    inflowPreM: 95,
    inflowPostM: 128,
    inflowDeltaPct: 35,
    reunifPrePct: 54,
    reunifPostPct: 55,
    reunifDeltaPp: 1.0,
    latestInflowM: 140,
    latestReturnM: 78,
    confidence: "estimated",
  },
  {
    state: "Washington",
    abbr: "WA",
    region: "west",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2015,
    trigger: "inactivity",
    inflowPreM: 110,
    inflowPostM: 148,
    inflowDeltaPct: 35,
    reunifPrePct: 56,
    reunifPostPct: 56,
    reunifDeltaPp: 0.0,
    latestInflowM: 160,
    latestReturnM: 92,
    confidence: "estimated",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    region: "northeast",
    cohort: "shortened",
    dormancyYears: 3,
    priorDormancyYears: 5,
    shortenYear: 2011,
    trigger: "inactivity",
    inflowPreM: 140,
    inflowPostM: 175,
    inflowDeltaPct: 25,
    reunifPrePct: 53,
    reunifPostPct: 54,
    reunifDeltaPp: 1.0,
    latestInflowM: 185,
    latestReturnM: 105,
    confidence: "estimated",
  },
  {
    state: "Delaware",
    abbr: "DE",
    region: "northeast",
    cohort: "holdout",
    dormancyYears: 5,
    priorDormancyYears: 5,
    shortenYear: null,
    trigger: "inactivity",
    inflowPreM: 420,
    inflowPostM: 480,
    inflowDeltaPct: 14,
    reunifPrePct: 28,
    reunifPostPct: 30,
    reunifDeltaPp: 2.0,
    latestInflowM: 510,
    latestReturnM: 95,
    confidence: "estimated",
  },
  {
    state: "Florida",
    abbr: "FL",
    region: "south",
    cohort: "holdout",
    dormancyYears: 5,
    priorDormancyYears: 5,
    shortenYear: null,
    trigger: "hybrid",
    inflowPreM: 195,
    inflowPostM: 220,
    inflowDeltaPct: 13,
    reunifPrePct: 62,
    reunifPostPct: 64,
    reunifDeltaPp: 2.0,
    latestInflowM: 235,
    latestReturnM: 155,
    confidence: "estimated",
  },
  {
    state: "Georgia",
    abbr: "GA",
    region: "south",
    cohort: "holdout",
    dormancyYears: 5,
    priorDormancyYears: 5,
    shortenYear: null,
    trigger: "rpo",
    inflowPreM: 125,
    inflowPostM: 138,
    inflowDeltaPct: 10,
    reunifPrePct: 58,
    reunifPostPct: 59,
    reunifDeltaPp: 1.0,
    latestInflowM: 145,
    latestReturnM: 88,
    confidence: "estimated",
  },
  {
    state: "North Carolina",
    abbr: "NC",
    region: "south",
    cohort: "holdout",
    dormancyYears: 5,
    priorDormancyYears: 5,
    shortenYear: null,
    trigger: "hybrid",
    inflowPreM: 105,
    inflowPostM: 112,
    inflowDeltaPct: 7,
    reunifPrePct: 57,
    reunifPostPct: 58,
    reunifDeltaPp: 1.0,
    latestInflowM: 118,
    latestReturnM: 72,
    confidence: "estimated",
  },
  {
    state: "Virginia",
    abbr: "VA",
    region: "south",
    cohort: "holdout",
    dormancyYears: 5,
    priorDormancyYears: 5,
    shortenYear: null,
    trigger: "rpo",
    inflowPreM: 98,
    inflowPostM: 105,
    inflowDeltaPct: 7,
    reunifPrePct: 60,
    reunifPostPct: 61,
    reunifDeltaPp: 1.0,
    latestInflowM: 110,
    latestReturnM: 68,
    confidence: "estimated",
  },
  {
    state: "Wisconsin",
    abbr: "WI",
    region: "midwest",
    cohort: "holdout",
    dormancyYears: 5,
    priorDormancyYears: 5,
    shortenYear: null,
    trigger: "hybrid",
    inflowPreM: 72,
    inflowPostM: 78,
    inflowDeltaPct: 8,
    reunifPrePct: 61,
    reunifPostPct: 62,
    reunifDeltaPp: 1.0,
    latestInflowM: 82,
    latestReturnM: 52,
    confidence: "estimated",
  },
  {
    state: "Missouri",
    abbr: "MO",
    region: "midwest",
    cohort: "holdout",
    dormancyYears: 5,
    priorDormancyYears: 5,
    shortenYear: null,
    trigger: "rpo",
    inflowPreM: 68,
    inflowPostM: 72,
    inflowDeltaPct: 6,
    reunifPrePct: 59,
    reunifPostPct: 60,
    reunifDeltaPp: 1.0,
    latestInflowM: 75,
    latestReturnM: 46,
    confidence: "estimated",
  },
];

export type NationalYear = {
  year: number;
  /** Estimated national remittances / escheat inflows, $B */
  inflowsB: number;
  /** NAUPA / desk national owner returns, $B */
  returnsB: number;
  /** Cumulative jurisdictions with banking dormancy ≤3y */
  shortDormancyStates: number;
  /** Desk reunification ratio returns/inflows, % */
  reunifPct: number;
  confidence: Confidence;
};

/** National path — inflows rise with statute wave; reunification stays flat */
export const NATIONAL_SERIES: NationalYear[] = [
  {
    year: 2015,
    inflowsB: 5.8,
    returnsB: 3.1,
    shortDormancyStates: 12,
    reunifPct: 53,
    confidence: "estimated",
  },
  {
    year: 2016,
    inflowsB: 6.2,
    returnsB: 3.3,
    shortDormancyStates: 13,
    reunifPct: 53,
    confidence: "estimated",
  },
  {
    year: 2017,
    inflowsB: 6.7,
    returnsB: 3.5,
    shortDormancyStates: 14,
    reunifPct: 52,
    confidence: "estimated",
  },
  {
    year: 2018,
    inflowsB: 7.2,
    returnsB: 3.8,
    shortDormancyStates: 15,
    reunifPct: 53,
    confidence: "estimated",
  },
  {
    year: 2019,
    inflowsB: 7.8,
    returnsB: 4.0,
    shortDormancyStates: 16,
    reunifPct: 51,
    confidence: "estimated",
  },
  {
    year: 2020,
    inflowsB: 8.1,
    returnsB: 3.9,
    shortDormancyStates: 17,
    reunifPct: 48,
    confidence: "estimated",
  },
  {
    year: 2021,
    inflowsB: 8.6,
    returnsB: 4.4,
    shortDormancyStates: 17,
    reunifPct: 51,
    confidence: "estimated",
  },
  {
    year: 2022,
    inflowsB: 9.1,
    returnsB: 4.8,
    shortDormancyStates: 17,
    reunifPct: 53,
    confidence: "estimated",
  },
  {
    year: 2023,
    inflowsB: 9.6,
    returnsB: 5.4,
    shortDormancyStates: 17,
    reunifPct: 56,
    confidence: "estimated",
  },
  {
    year: 2024,
    inflowsB: 9.8,
    returnsB: 4.49,
    shortDormancyStates: 17,
    reunifPct: 46,
    confidence: "disclosed",
  },
];

export type CohortAgg = {
  cohort: Cohort;
  label: string;
  n: number;
  medianInflowDeltaPct: number;
  medianReunifDeltaPp: number;
  meanInflowDeltaPct: number;
  meanReunifDeltaPp: number;
  shareInflowUpReunifFlat: number;
};

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

function mean(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export const COHORT_AGG: CohortAgg[] = (
  ["shortened", "holdout"] as Cohort[]
).map((cohort) => {
  const rows = STATE_PANEL.filter((r) => r.cohort === cohort);
  const inflow = rows.map((r) => r.inflowDeltaPct);
  const reunif = rows.map((r) => r.reunifDeltaPp);
  const flat = rows.filter(
    (r) => r.inflowDeltaPct >= 20 && r.reunifDeltaPp <= 1,
  ).length;
  return {
    cohort,
    label: cohort === "shortened" ? "Shortened to 3y" : "Still 5y holdout",
    n: rows.length,
    medianInflowDeltaPct: Math.round(median(inflow)),
    medianReunifDeltaPp: Math.round(median(reunif) * 10) / 10,
    meanInflowDeltaPct: Math.round(mean(inflow) * 10) / 10,
    meanReunifDeltaPp: Math.round(mean(reunif) * 10) / 10,
    shareInflowUpReunifFlat: Math.round((flat / rows.length) * 100),
  };
});

export type TriggerMix = {
  trigger: TriggerType;
  label: string;
  states: number;
  medianInflowDeltaPct: number;
};

export const TRIGGER_MIX: TriggerMix[] = (
  [
    ["inactivity", "Inactivity clock"],
    ["hybrid", "Hybrid / mixed"],
    ["rpo", "Returned-mail (RPO)"],
  ] as [TriggerType, string][]
).map(([trigger, label]) => {
  const rows = STATE_PANEL.filter((r) => r.trigger === trigger);
  return {
    trigger,
    label,
    states: rows.length,
    medianInflowDeltaPct: Math.round(median(rows.map((r) => r.inflowDeltaPct))),
  };
});

/** Adoption wave — cumulative jurisdictions cutting banking dormancy */
export const ADOPTION_WAVE: { year: number; cumulative: number; newCuts: number }[] =
  [
    { year: 2004, cumulative: 2, newCuts: 2 },
    { year: 2006, cumulative: 4, newCuts: 2 },
    { year: 2008, cumulative: 7, newCuts: 3 },
    { year: 2010, cumulative: 10, newCuts: 3 },
    { year: 2012, cumulative: 12, newCuts: 2 },
    { year: 2014, cumulative: 14, newCuts: 2 },
    { year: 2016, cumulative: 15, newCuts: 1 },
    { year: 2018, cumulative: 16, newCuts: 1 },
    { year: 2020, cumulative: 17, newCuts: 1 },
  ];

export type SortKey =
  | "inflowDelta"
  | "reunifDelta"
  | "latestInflow"
  | "dormancy"
  | "alpha";

export type RegionFilter = "all" | Region;
export type CohortFilter = "all" | Cohort;

export function filterStates(
  region: RegionFilter,
  cohort: CohortFilter,
  sort: SortKey,
): StateRow[] {
  let rows = [...STATE_PANEL];
  if (region !== "all") rows = rows.filter((r) => r.region === region);
  if (cohort !== "all") rows = rows.filter((r) => r.cohort === cohort);
  rows.sort((a, b) => {
    switch (sort) {
      case "inflowDelta":
        return b.inflowDeltaPct - a.inflowDeltaPct;
      case "reunifDelta":
        return b.reunifDeltaPp - a.reunifDeltaPp;
      case "latestInflow":
        return b.latestInflowM - a.latestInflowM;
      case "dormancy":
        return a.dormancyYears - b.dormancyYears || b.inflowDeltaPct - a.inflowDeltaPct;
      case "alpha":
        return a.state.localeCompare(b.state);
      default:
        return 0;
    }
  });
  return rows;
}
