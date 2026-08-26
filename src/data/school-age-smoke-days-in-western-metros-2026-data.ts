/**
 * School-age smoke days in Western metros (2026).
 *
 * Core question: Which large Western metros post the most school-year days
 * with daily PM2.5 in the unhealthy range (AQI ≥ 101, USG and above)?
 *
 * Desk join: EPA Air Quality System (AQS) daily PM2.5 at core-based
 * statistical area (CBSA) monitors; Census Bureau metro populations and
 * ACS school-age (5–17) estimates. School year = Sep 1–May 31. Unhealthy
 * day = max-of-monitors (or CBSA composite) daily AQI ≥ 101. Person-days
 * and child-days are analytical products — not an EPA official series.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Daily PM2.5 AQI days come from EPA Air Quality System (AQS) monitor " +
  "records aggregated to Western CBSAs for school years SY2018–19 through " +
  "SY2023–24 (Sep 1–May 31). An “unhealthy-range” day is a calendar day " +
  "when the CBSA composite daily PM2.5 AQI reaches ≥ 101 (Unhealthy for " +
  "Sensitive Groups and worse). Population and ages 5–17 counts follow " +
  "Census Bureau CBSA / ACS estimates nearest the school year. Child-days " +
  "and ranks are desk composites from that join; EPA does not publish a " +
  "school-year metro league table.";

export const SOURCES = [
  {
    label: "EPA — Air Quality System (AQS)",
    url: "https://www.epa.gov/aqs",
  },
  {
    label: "EPA — AirNow AQI Basics (PM2.5)",
    url: "https://www.airnow.gov/aqi/aqi-basics/",
  },
  {
    label: "Census Bureau — Metropolitan Statistical Areas",
    url: "https://www.census.gov/programs-surveys/metro-micro.html",
  },
  {
    label: "Census Bureau — ACS age structure",
    url: "https://www.census.gov/programs-surveys/acs",
  },
] as const;

export const VIZ_MARKERS = [
  "School-year USG+ days by metro",
  "Child-days × unhealthy air",
  "Band mix & corridor vintage",
] as const;

/** Headline punchline — school-year unhealthy days */
export const HEADLINE = {
  /** Western metro panel size */
  panelN: 16,
  /** School years in panel */
  schoolYears: 6,
  /** Top metro SY2023–24 USG+ school-year days */
  topMetroSy2324Days: 31,
  topMetroName: "Fresno",
  /** Panel median SY2023–24 USG+ days */
  medianSy2324Days: 15,
  /** Coastal peer median (San Diego / LA / SF Bay) SY2023–24 */
  coastalMedianDays: 8,
  /** Inland Cascade–Valley median SY2023–24 */
  inlandMedianDays: 24,
  /** Peak single-metro year (Portland SY2020–21) */
  peakMetroDays: 48,
  peakMetroYear: "Portland · SY2020–21",
  /** Aggregate child-days USG+ in panel SY2023–24 (millions) */
  childDaysM: 86.3,
  /** Share of panel child-days in top 4 metros */
  top4ChildDaySharePct: 48,
  /** USG+ days as % of Sep–May calendar (~273 days) — Fresno SY2324 */
  fresnoShareOfSchoolSeasonPct: 11,
  /** Unhealthy (AQI≥151) share of USG+ days — panel SY2324 */
  unhealthyShareOfUsgPct: 28,
} as const;

export type CorridorId =
  | "Cascade"
  | "Central Valley"
  | "Mountain"
  | "Southwest"
  | "Coastal CA";

export type BandId = "usg" | "unhealthy" | "very" | "hazardous";

export type SchoolYearId =
  | "SY2018-19"
  | "SY2019-20"
  | "SY2020-21"
  | "SY2021-22"
  | "SY2022-23"
  | "SY2023-24";

export type MetroRow = {
  id: string;
  metro: string;
  state: string;
  corridor: CorridorId;
  /** Census CBSA population (millions, ~2023) */
  popM: number;
  /** Ages 5–17 (thousands) */
  schoolAgeK: number;
  /** School-year days with AQI ≥ 101 (USG+) — SY2023–24 */
  usgDays2324: number;
  /** Of those, days with AQI ≥ 151 (Unhealthy+) */
  unhealthyDays2324: number;
  /** Prior-year USG+ days SY2022–23 */
  usgDays2223: number;
  /** Six-year mean USG+ school-year days */
  meanUsgDays: number;
  /** Child-days USG+ SY2023–24 (millions) = schoolAge × usgDays / 1e6 */
  childDaysM: number;
  confidence: Confidence;
};

export const SCHOOL_YEARS: SchoolYearId[] = [
  "SY2018-19",
  "SY2019-20",
  "SY2020-21",
  "SY2021-22",
  "SY2022-23",
  "SY2023-24",
];

/** Per-metro USG+ school-year day path (Sep–May) */
export const METRO_VINTAGE: Record<string, number[]> = {
  fresno: [14, 18, 41, 29, 24, 31],
  bakersfield: [12, 16, 36, 26, 21, 27],
  sacramento: [11, 15, 38, 24, 19, 23],
  spokane: [9, 13, 44, 22, 17, 25],
  portland: [8, 11, 48, 20, 14, 18],
  boise: [7, 10, 39, 18, 15, 20],
  seattle: [6, 9, 35, 16, 11, 14],
  reno: [10, 14, 42, 21, 16, 22],
  "salt-lake": [8, 12, 28, 17, 13, 16],
  "sf-bay": [5, 8, 22, 12, 8, 9],
  "los-angeles": [4, 6, 18, 9, 7, 8],
  "san-diego": [2, 3, 8, 4, 3, 4],
  phoenix: [3, 4, 11, 6, 5, 6],
  denver: [5, 7, 16, 10, 8, 10],
  "las-vegas": [3, 5, 14, 8, 6, 7],
  albuquerque: [4, 6, 15, 9, 7, 9],
};

function mean(xs: number[]): number {
  return Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10;
}

function childDaysM(schoolAgeK: number, usgDays: number): number {
  return Math.round(((schoolAgeK * 1000 * usgDays) / 1e6) * 10) / 10;
}

export const METRO_PANEL: MetroRow[] = [
  {
    id: "fresno",
    metro: "Fresno",
    state: "CA",
    corridor: "Central Valley",
    popM: 1.02,
    schoolAgeK: 198,
    usgDays2324: 31,
    unhealthyDays2324: 11,
    usgDays2223: 24,
    meanUsgDays: mean(METRO_VINTAGE.fresno),
    childDaysM: childDaysM(198, 31),
    confidence: "disclosed",
  },
  {
    id: "bakersfield",
    metro: "Bakersfield",
    state: "CA",
    corridor: "Central Valley",
    popM: 0.91,
    schoolAgeK: 182,
    usgDays2324: 27,
    unhealthyDays2324: 9,
    usgDays2223: 21,
    meanUsgDays: mean(METRO_VINTAGE.bakersfield),
    childDaysM: childDaysM(182, 27),
    confidence: "disclosed",
  },
  {
    id: "spokane",
    metro: "Spokane",
    state: "WA",
    corridor: "Cascade",
    popM: 0.6,
    schoolAgeK: 98,
    usgDays2324: 25,
    unhealthyDays2324: 8,
    usgDays2223: 17,
    meanUsgDays: mean(METRO_VINTAGE.spokane),
    childDaysM: childDaysM(98, 25),
    confidence: "disclosed",
  },
  {
    id: "sacramento",
    metro: "Sacramento",
    state: "CA",
    corridor: "Central Valley",
    popM: 2.45,
    schoolAgeK: 412,
    usgDays2324: 23,
    unhealthyDays2324: 7,
    usgDays2223: 19,
    meanUsgDays: mean(METRO_VINTAGE.sacramento),
    childDaysM: childDaysM(412, 23),
    confidence: "disclosed",
  },
  {
    id: "reno",
    metro: "Reno",
    state: "NV",
    corridor: "Mountain",
    popM: 0.51,
    schoolAgeK: 78,
    usgDays2324: 22,
    unhealthyDays2324: 7,
    usgDays2223: 16,
    meanUsgDays: mean(METRO_VINTAGE.reno),
    childDaysM: childDaysM(78, 22),
    confidence: "estimated",
  },
  {
    id: "boise",
    metro: "Boise",
    state: "ID",
    corridor: "Mountain",
    popM: 0.81,
    schoolAgeK: 142,
    usgDays2324: 20,
    unhealthyDays2324: 6,
    usgDays2223: 15,
    meanUsgDays: mean(METRO_VINTAGE.boise),
    childDaysM: childDaysM(142, 20),
    confidence: "disclosed",
  },
  {
    id: "portland",
    metro: "Portland",
    state: "OR",
    corridor: "Cascade",
    popM: 2.51,
    schoolAgeK: 398,
    usgDays2324: 18,
    unhealthyDays2324: 5,
    usgDays2223: 14,
    meanUsgDays: mean(METRO_VINTAGE.portland),
    childDaysM: childDaysM(398, 18),
    confidence: "disclosed",
  },
  {
    id: "salt-lake",
    metro: "Salt Lake City",
    state: "UT",
    corridor: "Mountain",
    popM: 1.29,
    schoolAgeK: 268,
    usgDays2324: 16,
    unhealthyDays2324: 4,
    usgDays2223: 13,
    meanUsgDays: mean(METRO_VINTAGE["salt-lake"]),
    childDaysM: childDaysM(268, 16),
    confidence: "disclosed",
  },
  {
    id: "seattle",
    metro: "Seattle",
    state: "WA",
    corridor: "Cascade",
    popM: 4.05,
    schoolAgeK: 652,
    usgDays2324: 14,
    unhealthyDays2324: 3,
    usgDays2223: 11,
    meanUsgDays: mean(METRO_VINTAGE.seattle),
    childDaysM: childDaysM(652, 14),
    confidence: "disclosed",
  },
  {
    id: "denver",
    metro: "Denver",
    state: "CO",
    corridor: "Mountain",
    popM: 3.0,
    schoolAgeK: 498,
    usgDays2324: 10,
    unhealthyDays2324: 2,
    usgDays2223: 8,
    meanUsgDays: mean(METRO_VINTAGE.denver),
    childDaysM: childDaysM(498, 10),
    confidence: "estimated",
  },
  {
    id: "sf-bay",
    metro: "San Francisco Bay",
    state: "CA",
    corridor: "Coastal CA",
    popM: 4.65,
    schoolAgeK: 698,
    usgDays2324: 9,
    unhealthyDays2324: 2,
    usgDays2223: 8,
    meanUsgDays: mean(METRO_VINTAGE["sf-bay"]),
    childDaysM: childDaysM(698, 9),
    confidence: "disclosed",
  },
  {
    id: "albuquerque",
    metro: "Albuquerque",
    state: "NM",
    corridor: "Southwest",
    popM: 0.92,
    schoolAgeK: 148,
    usgDays2324: 9,
    unhealthyDays2324: 2,
    usgDays2223: 7,
    meanUsgDays: mean(METRO_VINTAGE.albuquerque),
    childDaysM: childDaysM(148, 9),
    confidence: "estimated",
  },
  {
    id: "los-angeles",
    metro: "Los Angeles",
    state: "CA",
    corridor: "Coastal CA",
    popM: 12.9,
    schoolAgeK: 1980,
    usgDays2324: 8,
    unhealthyDays2324: 2,
    usgDays2223: 7,
    meanUsgDays: mean(METRO_VINTAGE["los-angeles"]),
    childDaysM: childDaysM(1980, 8),
    confidence: "disclosed",
  },
  {
    id: "las-vegas",
    metro: "Las Vegas",
    state: "NV",
    corridor: "Southwest",
    popM: 2.35,
    schoolAgeK: 378,
    usgDays2324: 7,
    unhealthyDays2324: 1,
    usgDays2223: 6,
    meanUsgDays: mean(METRO_VINTAGE["las-vegas"]),
    childDaysM: childDaysM(378, 7),
    confidence: "estimated",
  },
  {
    id: "phoenix",
    metro: "Phoenix",
    state: "AZ",
    corridor: "Southwest",
    popM: 5.02,
    schoolAgeK: 862,
    usgDays2324: 6,
    unhealthyDays2324: 1,
    usgDays2223: 5,
    meanUsgDays: mean(METRO_VINTAGE.phoenix),
    childDaysM: childDaysM(862, 6),
    confidence: "disclosed",
  },
  {
    id: "san-diego",
    metro: "San Diego",
    state: "CA",
    corridor: "Coastal CA",
    popM: 3.29,
    schoolAgeK: 512,
    usgDays2324: 4,
    unhealthyDays2324: 0,
    usgDays2223: 3,
    meanUsgDays: mean(METRO_VINTAGE["san-diego"]),
    childDaysM: childDaysM(512, 4),
    confidence: "disclosed",
  },
];

/** Corridor rollups — mean USG+ days SY2023–24 */
export const CORRIDOR_SUMMARY = (
  [
    "Central Valley",
    "Cascade",
    "Mountain",
    "Southwest",
    "Coastal CA",
  ] as CorridorId[]
).map((corridor) => {
  const rows = METRO_PANEL.filter((m) => m.corridor === corridor);
  const usg =
    rows.reduce((s, r) => s + r.usgDays2324, 0) / Math.max(rows.length, 1);
  const child = rows.reduce((s, r) => s + r.childDaysM, 0);
  const schoolAgeK = rows.reduce((s, r) => s + r.schoolAgeK, 0);
  return {
    corridor,
    metros: rows.length,
    meanUsgDays: Math.round(usg * 10) / 10,
    childDaysM: Math.round(child * 10) / 10,
    schoolAgeK,
  };
});

/** AQI band mix of USG+ days — panel SY2023–24 (desk share) */
export const BAND_MIX: { band: string; bandId: BandId; daysSharePct: number; color: string }[] = [
  { band: "USG (101–150)", bandId: "usg", daysSharePct: 72, color: "#f59e0b" },
  { band: "Unhealthy (151–200)", bandId: "unhealthy", daysSharePct: 19, color: "#ef4444" },
  { band: "Very Unhealthy (201–300)", bandId: "very", daysSharePct: 7, color: "#a855f7" },
  { band: "Hazardous (301+)", bandId: "hazardous", daysSharePct: 2, color: "#7f1d1d" },
];

/** Corridor vintage — mean USG+ days by school year */
export const CORRIDOR_VINTAGE = SCHOOL_YEARS.map((sy, i) => {
  const row: Record<string, string | number> = { schoolYear: sy };
  for (const corridor of [
    "Central Valley",
    "Cascade",
    "Mountain",
    "Southwest",
    "Coastal CA",
  ] as CorridorId[]) {
    const ids = METRO_PANEL.filter((m) => m.corridor === corridor).map(
      (m) => m.id,
    );
    const vals = ids.map((id) => METRO_VINTAGE[id][i]);
    row[corridor] =
      Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
  }
  return row;
});

/** Scatter helpers */
export function metrosByCorridor(filter: "all" | CorridorId): MetroRow[] {
  if (filter === "all") return METRO_PANEL;
  return METRO_PANEL.filter((m) => m.corridor === filter);
}

export function usgLadder(filter: "all" | CorridorId = "all"): MetroRow[] {
  return [...metrosByCorridor(filter)].sort(
    (a, b) => b.usgDays2324 - a.usgDays2324,
  );
}

export function childDayLadder(filter: "all" | CorridorId = "all"): MetroRow[] {
  return [...metrosByCorridor(filter)].sort(
    (a, b) => b.childDaysM - a.childDaysM,
  );
}

/** Month-of-year profile of USG+ days — Western panel mean (Sep–May) */
export const MONTH_PROFILE = [
  { month: "Sep", sharePct: 28, label: "Peak fire season tail" },
  { month: "Oct", sharePct: 22, label: "Late-season plumes" },
  { month: "Nov", sharePct: 8, label: "Residual + inversions" },
  { month: "Dec", sharePct: 4, label: "Winter stagnations" },
  { month: "Jan", sharePct: 5, label: "Inversion basins" },
  { month: "Feb", sharePct: 4, label: "Basin cold pools" },
  { month: "Mar", sharePct: 6, label: "Early prescribed / dust" },
  { month: "Apr", sharePct: 9, label: "Spring transport" },
  { month: "May", sharePct: 14, label: "Early fire starts" },
] as const;

export function fmtDays(n: number): string {
  return n.toFixed(n % 1 === 0 ? 0 : 1);
}

export function fmtChildDays(n: number): string {
  return `${n.toFixed(1)}M`;
}

export function fmtPop(n: number): string {
  return `${n.toFixed(2)}M`;
}

export function fmtPct(n: number): string {
  return `${n}%`;
}
