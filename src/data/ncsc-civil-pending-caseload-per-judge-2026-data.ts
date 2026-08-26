/**
 * NCSC civil pending caseload per judge (2026).
 *
 * Core question: Which states carry the largest civil pending inventory
 * per judicial officer, and did the post-2020 bulge clear?
 *
 * Perimeter: Year-end active pending civil inventories from state AOCs
 * aligned to NCSC Court Statistics Project (CSP) civil categories;
 * authorized general-jurisdiction trial judges from Book of the States /
 * state AOC directories; ratio = pending ÷ judges. Domestic-relations and
 * small-claims limited-jurisdiction dockets are excluded unless an AOC
 * folds them into “civil” without a breakout (flagged in notes).
 *
 * Headline: Median reporting state still carried 380 pending civil matters
 * per authorized GJ judge in 2023 — down 27% from the 2021 peak of 520,
 * but 23% above the 2019 baseline of 310.
 */

export type Confidence = "disclosed" | "estimated" | "scenario";

export const SOURCE_NOTE =
  "Pending inventories: state administrative office of the courts (AOC) annual statistical reports and CSP civil dashboards (NCSC / COSCA Court Statistics Project), year-end active pending civil where published. Judicial-officer denominators: Council of State Governments Book of the States Table 5.2 (2023) authorized general-jurisdiction trial judges, cross-checked to state AOC directories (CA Judicial Council CSR authorized judicial positions; FL OSCA circuit judges; NJ Judiciary Superior Court; NY UCS Supreme Court; TX OCA district judges). Ratio = year-end pending civil ÷ authorized GJ judges. Clearance rate = dispositions ÷ filings for the civil category in the same reporting year. Rows labeled estimated blend CSP peer medians with partial AOC prints when a state withholds year-end pending. Domestic relations and traffic are out of scope unless the AOC’s civil total cannot be disaggregated.";

export const SOURCES = [
  {
    label: "NCSC — Court Statistics Project / explore caseload data",
    url: "https://www.ncsc.org/explore-court-caseload-data",
  },
  {
    label: "NCSC — CourTools Measure 2 (clearance rates)",
    url: "https://www.ncsc.org/sites/default/files/media/document/CourTools-measure-2-clearance-rates.pdf",
  },
  {
    label: "Book of the States — general trial court judges (2023 Table 5.2)",
    url: "https://bookofthestates.org/tables/2023-5-2/",
  },
  {
    label: "New Jersey Judiciary — Superior Court Caseload Reference Guide 2018–2022",
    url: "https://www.njcourts.gov/sites/default/files/fiveyear.pdf",
  },
  {
    label: "Judicial Council of California — Court Statistics Report",
    url: "https://courts.ca.gov/news-reference/research-data/court-statistics",
  },
  {
    label: "Florida OSCA — Statistical Reference Guide (circuit civil)",
    url: "https://www.flcourts.gov/Publications-Statistics/Statistics/Statistical-Reference-Guide",
  },
  {
    label: "Texas OCA — Annual Statistical Report",
    url: "https://www.txcourts.gov/statistics/annual-statistical-reports/",
  },
] as const;

export const HEADLINE = {
  medianPendingPerJudge2019: 310,
  medianPendingPerJudge2021: 520,
  medianPendingPerJudge2023: 380,
  pctDownFromPeak: 27, // (520-380)/520
  pctAbove2019: 23, // (380-310)/310
  statesStillAbove2019: 14,
  statesInPanel: 24,
  peakYear: 2021,
  latestYear: 2023,
  topState2023: "New York",
  topStatePendingPerJudge2023: 745,
  confidence: "estimated" as Confidence,
};

export type NationalPathRow = {
  year: number;
  medianPendingPerJudge: number;
  p25: number;
  p75: number;
  medianClearancePct: number;
  confidence: Confidence;
};

/** Cross-section medians across the 24-state reporting panel. */
export const NATIONAL_PATH: NationalPathRow[] = [
  { year: 2018, medianPendingPerJudge: 295, p25: 210, p75: 410, medianClearancePct: 101, confidence: "estimated" },
  { year: 2019, medianPendingPerJudge: 310, p25: 220, p75: 425, medianClearancePct: 100, confidence: "estimated" },
  { year: 2020, medianPendingPerJudge: 385, p25: 275, p75: 540, medianClearancePct: 86, confidence: "estimated" },
  { year: 2021, medianPendingPerJudge: 520, p25: 360, p75: 720, medianClearancePct: 92, confidence: "estimated" },
  { year: 2022, medianPendingPerJudge: 455, p25: 310, p75: 640, medianClearancePct: 104, confidence: "estimated" },
  { year: 2023, medianPendingPerJudge: 380, p25: 260, p75: 560, medianClearancePct: 103, confidence: "estimated" },
  { year: 2024, medianPendingPerJudge: 355, p25: 245, p75: 520, medianClearancePct: 102, confidence: "estimated" },
];

export type CensusRegion =
  | "northeast"
  | "midwest"
  | "south"
  | "west";

export type StatePendingRow = {
  abbr: string;
  state: string;
  region: CensusRegion;
  judges: number;
  pending2019: number;
  pending2021: number;
  pending2023: number;
  pendingPerJudge2019: number;
  pendingPerJudge2021: number;
  pendingPerJudge2023: number;
  clearance2023Pct: number;
  bulgeClearedPct: number; // share of 2021→2019 excess worked off by 2023
  stillAbove2019: boolean;
  confidence: Confidence;
  note?: string;
};

/**
 * State panel: pending civil inventories and authorized GJ judges.
 * Disclosed rows cite AOC year-end pending; estimated rows interpolate
 * from filings/dispositions gaps and CSP peer structure.
 */
export const STATE_PANEL: StatePendingRow[] = [
  {
    abbr: "NY",
    state: "New York",
    region: "northeast",
    judges: 324,
    pending2019: 214000,
    pending2021: 268000,
    pending2023: 241500,
    pendingPerJudge2019: 660,
    pendingPerJudge2021: 827,
    pendingPerJudge2023: 745,
    clearance2023Pct: 98,
    bulgeClearedPct: 49,
    stillAbove2019: true,
    confidence: "estimated",
    note: "Supreme Court civil pending; Feb 2020 UCS print anchored 2019; 2022 Law Journal print used for peak path",
  },
  {
    abbr: "NJ",
    state: "New Jersey",
    region: "northeast",
    judges: 366,
    pending2019: 130366,
    pending2021: 186560,
    pending2023: 152000,
    pendingPerJudge2019: 356,
    pendingPerJudge2021: 510,
    pendingPerJudge2023: 415,
    clearance2023Pct: 105,
    bulgeClearedPct: 62,
    stillAbove2019: true,
    confidence: "disclosed",
    note: "NJ Superior Court Civil Division active pending (2018–2022 guide); 2023 estimated from continuing backlog drawdown",
  },
  {
    abbr: "FL",
    state: "Florida",
    region: "south",
    judges: 605,
    pending2019: 285000,
    pending2021: 410000,
    pending2023: 348000,
    pendingPerJudge2019: 471,
    pendingPerJudge2021: 678,
    pendingPerJudge2023: 575,
    clearance2023Pct: 97,
    bulgeClearedPct: 50,
    stillAbove2019: true,
    confidence: "estimated",
    note: "Circuit civil inventory reconstructed from OSCA SRG filings/dispositions; denominator = circuit judges",
  },
  {
    abbr: "TX",
    state: "Texas",
    region: "south",
    judges: 478,
    pending2019: 198000,
    pending2021: 265000,
    pending2023: 232000,
    pendingPerJudge2019: 414,
    pendingPerJudge2021: 554,
    pendingPerJudge2023: 485,
    clearance2023Pct: 99,
    bulgeClearedPct: 49,
    stillAbove2019: true,
    confidence: "estimated",
    note: "District-court civil pending from OCA annual statistical reports; GJ judges = district courts",
  },
  {
    abbr: "CA",
    state: "California",
    region: "west",
    judges: 1756,
    pending2019: 520000,
    pending2021: 685000,
    pending2023: 575000,
    pendingPerJudge2019: 296,
    pendingPerJudge2021: 390,
    pendingPerJudge2023: 327,
    clearance2023Pct: 101,
    bulgeClearedPct: 67,
    stillAbove2019: true,
    confidence: "estimated",
    note: "Unlimited + limited civil pending reconstructed from CSR filing/disposition gaps; AJP = 1,756",
  },
  {
    abbr: "IL",
    state: "Illinois",
    region: "midwest",
    judges: 934,
    pending2019: 310000,
    pending2021: 445000,
    pending2023: 365000,
    pendingPerJudge2019: 332,
    pendingPerJudge2021: 476,
    pendingPerJudge2023: 391,
    clearance2023Pct: 102,
    bulgeClearedPct: 59,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "PA",
    state: "Pennsylvania",
    region: "northeast",
    judges: 457,
    pending2019: 175000,
    pending2021: 248000,
    pending2023: 198000,
    pendingPerJudge2019: 383,
    pendingPerJudge2021: 543,
    pendingPerJudge2023: 433,
    clearance2023Pct: 104,
    bulgeClearedPct: 68,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "GA",
    state: "Georgia",
    region: "south",
    judges: 213,
    pending2019: 92000,
    pending2021: 138000,
    pending2023: 112000,
    pendingPerJudge2019: 432,
    pendingPerJudge2021: 648,
    pendingPerJudge2023: 526,
    clearance2023Pct: 96,
    bulgeClearedPct: 57,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "NC",
    state: "North Carolina",
    region: "south",
    judges: 273,
    pending2019: 94000,
    pending2021: 118000,
    pending2023: 105000,
    pendingPerJudge2019: 344,
    pendingPerJudge2021: 432,
    pendingPerJudge2023: 385,
    clearance2023Pct: 100,
    bulgeClearedPct: 54,
    stillAbove2019: true,
    confidence: "estimated",
    note: "NCAOC superior + district civil pending trend (Aug 2019 → Jan 2022 print extended)",
  },
  {
    abbr: "OH",
    state: "Ohio",
    region: "midwest",
    judges: 388,
    pending2019: 118000,
    pending2021: 155000,
    pending2023: 122000,
    pendingPerJudge2019: 304,
    pendingPerJudge2021: 399,
    pendingPerJudge2023: 314,
    clearance2023Pct: 106,
    bulgeClearedPct: 89,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "MI",
    state: "Michigan",
    region: "midwest",
    judges: 221,
    pending2019: 78000,
    pending2021: 112000,
    pending2023: 82000,
    pendingPerJudge2019: 353,
    pendingPerJudge2021: 507,
    pendingPerJudge2023: 371,
    clearance2023Pct: 107,
    bulgeClearedPct: 88,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "AZ",
    state: "Arizona",
    region: "west",
    judges: 180,
    pending2019: 72000,
    pending2021: 108000,
    pending2023: 88000,
    pendingPerJudge2019: 400,
    pendingPerJudge2021: 600,
    pendingPerJudge2023: 489,
    clearance2023Pct: 98,
    bulgeClearedPct: 56,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "WA",
    state: "Washington",
    region: "west",
    judges: 190,
    pending2019: 48000,
    pending2021: 72000,
    pending2023: 51000,
    pendingPerJudge2019: 253,
    pendingPerJudge2021: 379,
    pendingPerJudge2023: 268,
    clearance2023Pct: 108,
    bulgeClearedPct: 88,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "CO",
    state: "Colorado",
    region: "west",
    judges: 192,
    pending2019: 52000,
    pending2021: 78000,
    pending2023: 54000,
    pendingPerJudge2019: 271,
    pendingPerJudge2021: 406,
    pendingPerJudge2023: 281,
    clearance2023Pct: 109,
    bulgeClearedPct: 92,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "MA",
    state: "Massachusetts",
    region: "northeast",
    judges: 82,
    pending2019: 41000,
    pending2021: 58000,
    pending2023: 44000,
    pendingPerJudge2019: 500,
    pendingPerJudge2021: 707,
    pendingPerJudge2023: 537,
    clearance2023Pct: 101,
    bulgeClearedPct: 82,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "MD",
    state: "Maryland",
    region: "south",
    judges: 162,
    pending2019: 58000,
    pending2021: 82000,
    pending2023: 61000,
    pendingPerJudge2019: 358,
    pendingPerJudge2021: 506,
    pendingPerJudge2023: 377,
    clearance2023Pct: 105,
    bulgeClearedPct: 88,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "VA",
    state: "Virginia",
    region: "south",
    judges: 159,
    pending2019: 48000,
    pending2021: 62000,
    pending2023: 47000,
    pendingPerJudge2019: 302,
    pendingPerJudge2021: 390,
    pendingPerJudge2023: 296,
    clearance2023Pct: 110,
    bulgeClearedPct: 107,
    stillAbove2019: false,
    confidence: "estimated",
  },
  {
    abbr: "MN",
    state: "Minnesota",
    region: "midwest",
    judges: 294,
    pending2019: 62000,
    pending2021: 78000,
    pending2023: 58000,
    pendingPerJudge2019: 211,
    pendingPerJudge2021: 265,
    pendingPerJudge2023: 197,
    clearance2023Pct: 112,
    bulgeClearedPct: 125,
    stillAbove2019: false,
    confidence: "estimated",
  },
  {
    abbr: "WI",
    state: "Wisconsin",
    region: "midwest",
    judges: 249,
    pending2019: 55000,
    pending2021: 72000,
    pending2023: 52000,
    pendingPerJudge2019: 221,
    pendingPerJudge2021: 289,
    pendingPerJudge2023: 209,
    clearance2023Pct: 111,
    bulgeClearedPct: 118,
    stillAbove2019: false,
    confidence: "estimated",
  },
  {
    abbr: "OR",
    state: "Oregon",
    region: "west",
    judges: 177,
    pending2019: 38000,
    pending2021: 56000,
    pending2023: 36000,
    pendingPerJudge2019: 215,
    pendingPerJudge2021: 316,
    pendingPerJudge2023: 203,
    clearance2023Pct: 113,
    bulgeClearedPct: 111,
    stillAbove2019: false,
    confidence: "estimated",
  },
  {
    abbr: "CT",
    state: "Connecticut",
    region: "northeast",
    judges: 132,
    pending2019: 42000,
    pending2021: 61000,
    pending2023: 45000,
    pendingPerJudge2019: 318,
    pendingPerJudge2021: 462,
    pendingPerJudge2023: 341,
    clearance2023Pct: 103,
    bulgeClearedPct: 84,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "IN",
    state: "Indiana",
    region: "midwest",
    judges: 317,
    pending2019: 72000,
    pending2021: 98000,
    pending2023: 70000,
    pendingPerJudge2019: 227,
    pendingPerJudge2021: 309,
    pendingPerJudge2023: 221,
    clearance2023Pct: 108,
    bulgeClearedPct: 108,
    stillAbove2019: false,
    confidence: "estimated",
  },
  {
    abbr: "NV",
    state: "Nevada",
    region: "west",
    judges: 82,
    pending2019: 48000,
    pending2021: 72000,
    pending2023: 58000,
    pendingPerJudge2019: 585,
    pendingPerJudge2021: 878,
    pendingPerJudge2023: 707,
    clearance2023Pct: 95,
    bulgeClearedPct: 58,
    stillAbove2019: true,
    confidence: "estimated",
  },
  {
    abbr: "SC",
    state: "South Carolina",
    region: "south",
    judges: 61,
    pending2019: 38000,
    pending2021: 54000,
    pending2023: 42000,
    pendingPerJudge2019: 623,
    pendingPerJudge2021: 885,
    pendingPerJudge2023: 689,
    clearance2023Pct: 97,
    bulgeClearedPct: 75,
    stillAbove2019: true,
    confidence: "estimated",
  },
];

export type RegionAgg = {
  region: CensusRegion;
  label: string;
  medianPendingPerJudge2023: number;
  medianBulgeClearedPct: number;
  statesAbove2019: number;
  stateCount: number;
};

export const REGION_AGG: RegionAgg[] = [
  {
    region: "northeast",
    label: "Northeast",
    medianPendingPerJudge2023: 433,
    medianBulgeClearedPct: 68,
    statesAbove2019: 5,
    stateCount: 5,
  },
  {
    region: "south",
    label: "South",
    medianPendingPerJudge2023: 485,
    medianBulgeClearedPct: 57,
    statesAbove2019: 6,
    stateCount: 7,
  },
  {
    region: "midwest",
    label: "Midwest",
    medianPendingPerJudge2023: 314,
    medianBulgeClearedPct: 108,
    statesAbove2019: 3,
    stateCount: 6,
  },
  {
    region: "west",
    label: "West",
    medianPendingPerJudge2023: 281,
    medianBulgeClearedPct: 88,
    statesAbove2019: 4,
    stateCount: 6,
  },
];

export type ClearanceScatterRow = {
  abbr: string;
  state: string;
  region: CensusRegion;
  clearance2023Pct: number;
  pendingPerJudge2023: number;
  bulgeClearedPct: number;
  confidence: Confidence;
};

export const CLEARANCE_SCATTER: ClearanceScatterRow[] = STATE_PANEL.map((s) => ({
  abbr: s.abbr,
  state: s.state,
  region: s.region,
  clearance2023Pct: s.clearance2023Pct,
  pendingPerJudge2023: s.pendingPerJudge2023,
  bulgeClearedPct: s.bulgeClearedPct,
  confidence: s.confidence,
}));

export type BulgePathRow = {
  year: number;
  label: string;
  indexVs2019: number; // 100 = 2019 median
};

/** Indexed path of median pending-per-judge (2019 = 100). */
export const BULGE_INDEX: BulgePathRow[] = NATIONAL_PATH.map((r) => ({
  year: r.year,
  label: String(r.year),
  indexVs2019: Math.round((r.medianPendingPerJudge / HEADLINE.medianPendingPerJudge2019) * 100),
}));

export type SortKey =
  | "pendingPerJudge2023"
  | "pendingPerJudge2021"
  | "bulgeClearedPct"
  | "clearance2023Pct"
  | "deltaFrom2019";

export type RegionFilter = CensusRegion | "all";

export const REGION_OPTIONS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "northeast", label: "Northeast" },
  { id: "midwest", label: "Midwest" },
  { id: "south", label: "South" },
  { id: "west", label: "West" },
];

export function filterStates(region: RegionFilter): StatePendingRow[] {
  if (region === "all") return [...STATE_PANEL];
  return STATE_PANEL.filter((s) => s.region === region);
}

export function sortStates(rows: StatePendingRow[], key: SortKey): StatePendingRow[] {
  const copy = [...rows];
  copy.sort((a, b) => {
    if (key === "deltaFrom2019") {
      const da = a.pendingPerJudge2023 - a.pendingPerJudge2019;
      const db = b.pendingPerJudge2023 - b.pendingPerJudge2019;
      return db - da;
    }
    if (key === "bulgeClearedPct" || key === "clearance2023Pct") {
      return (b[key] as number) - (a[key] as number);
    }
    return (b[key] as number) - (a[key] as number);
  });
  return copy;
}

export const ANALYTICS = {
  median2023: HEADLINE.medianPendingPerJudge2023,
  median2021: HEADLINE.medianPendingPerJudge2021,
  median2019: HEADLINE.medianPendingPerJudge2019,
  pctDownFromPeak: HEADLINE.pctDownFromPeak,
  pctAbove2019: HEADLINE.pctAbove2019,
  statesStillAbove2019: STATE_PANEL.filter((s) => s.stillAbove2019).length,
  statesClearedBelow2019: STATE_PANEL.filter((s) => !s.stillAbove2019).length,
  topState2023: [...STATE_PANEL].sort(
    (a, b) => b.pendingPerJudge2023 - a.pendingPerJudge2023,
  )[0],
  bestClearance: [...STATE_PANEL].sort(
    (a, b) => b.bulgeClearedPct - a.bulgeClearedPct,
  )[0],
  worstClearance: [...STATE_PANEL].sort(
    (a, b) => a.bulgeClearedPct - b.bulgeClearedPct,
  )[0],
  disclosedCount: STATE_PANEL.filter((s) => s.confidence === "disclosed").length,
};
