/**
 * Summer heat deaths in Sun Belt metros versus national trend (2026).
 *
 * Core question: Which large Sun Belt metros account for the largest share
 * of recent CDC heat-coded deaths?
 *
 * Anchors: CDC WONDER multiple-cause / excessive natural heat compilations
 * (ICD-10 X30, T67, P81.0 where noted); JAMA 2024 national trend through
 * 2023; MMWR / USAFacts annual totals; Climate Crisis 247 county and metro
 * aggregations of WONDER for 2018–2023/2024; Census CBSA population
 * estimates; NOAA U.S. Climate Normals summer means. Local medical-examiner
 * “heat-associated” tallies (e.g. Maricopa) are cited only as a caveat —
 * they are broader than WONDER ICD coding and are not mixed into shares.
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "Metro death counts are CDC WONDER compilations of heat-coded deaths " +
  "(excessive natural heat / heat-related ICD-10 X30, T67, and related " +
  "codes as reported in secondary county and CBSA aggregations for " +
  "2018–2023). National annual totals follow JAMA (1999–2023 research " +
  "letter), MMWR QuickStats (2021), and USAFacts CDC extracts (2018, " +
  "2022). Population is Census vintage CBSA / principal-county estimates. " +
  "Summer climate context uses NOAA 1991–2020 Climate Normals. Shares are " +
  "desk ratios of metro deaths ÷ national period total — illustrative of " +
  "the coded geography, not excess all-cause heat mortality.";

export const SOURCES = [
  {
    label: "CDC WONDER — Multiple Cause of Death",
    url: "https://wonder.cdc.gov/mcd.html",
  },
  {
    label: "JAMA — Trends of Heat-Related Deaths in the US, 1999–2023",
    url: "https://jamanetwork.com/journals/jama/fullarticle/2822854",
  },
  {
    label: "MMWR QuickStats — Heat deaths by state, 2021",
    url: "https://www.cdc.gov/mmwr/volumes/72/wr/mm7235a7.htm",
  },
  {
    label: "USAFacts — How many people die from extreme heat in the US?",
    url: "https://usafacts.org/articles/how-many-people-die-from-extreme-heat-in-the-us/",
  },
  {
    label: "NOAA — U.S. Climate Normals",
    url: "https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals",
  },
  {
    label: "Census — Metropolitan and micropolitan population",
    url: "https://www.census.gov/programs-surveys/metro-micro.html",
  },
] as const;

export const VIZ_MARKERS = [
  "Metro share of heat-coded deaths",
  "National heat-death trend",
  "Rate vs summer normals scatter",
  "Sun Belt stack vs rest of U.S.",
] as const;

export const WINDOW_LABEL = "2018–2023";
export const SLUG =
  "summer-heat-deaths-in-sun-belt-metros-versus-national-trend-2026";

/** National heat-related deaths (underlying or contributing), CDC WONDER. */
export type NationalYear = {
  year: number;
  deaths: number;
  aamrPer100k: number | null;
  confidence: Confidence;
  note?: string;
};

export const NATIONAL_SERIES: NationalYear[] = [
  {
    year: 2016,
    deaths: 692,
    aamrPer100k: 0.19,
    confidence: "derived",
    note: "Joinpoint hinge year cited in JAMA 2024 trend discussion",
  },
  {
    year: 2017,
    deaths: 763,
    aamrPer100k: 0.21,
    confidence: "derived",
  },
  {
    year: 2018,
    deaths: 1008,
    aamrPer100k: 0.28,
    confidence: "disclosed",
    note: "USAFacts / CDC extract",
  },
  {
    year: 2019,
    deaths: 905,
    aamrPer100k: 0.25,
    confidence: "derived",
  },
  {
    year: 2020,
    deaths: 1175,
    aamrPer100k: 0.32,
    confidence: "derived",
  },
  {
    year: 2021,
    deaths: 1600,
    aamrPer100k: 0.4,
    confidence: "disclosed",
    note: "MMWR QuickStats total",
  },
  {
    year: 2022,
    deaths: 1714,
    aamrPer100k: 0.46,
    confidence: "disclosed",
    note: "USAFacts provisional CDC",
  },
  {
    year: 2023,
    deaths: 2325,
    aamrPer100k: 0.62,
    confidence: "disclosed",
    note: "JAMA 2024 research letter",
  },
];

export const NATIONAL_PERIOD_DEATHS = NATIONAL_SERIES.filter(
  (r) => r.year >= 2018 && r.year <= 2023,
).reduce((s, r) => s + r.deaths, 0);

export type Belt = "sun-belt" | "other";

export type MetroRow = {
  id: string;
  metro: string;
  short: string;
  state: string;
  belt: Belt;
  /** Principal-county / CBSA-compiled WONDER heat deaths, 2018–2023 */
  deaths: number;
  /** Mid-window population (thousands) */
  popThousands: number;
  /** Crude deaths per 100k residents over the 6-year window */
  ratePer100kWindow: number;
  /** NOAA normals Jun–Aug mean daily high °F (station / metro proxy) */
  summerHighF: number;
  /** Share of national 2018–2023 heat-coded deaths (%) */
  shareOfNationalPct: number;
  largeMetro: boolean;
  confidence: Confidence;
  geographyNote: string;
};

/**
 * Primary-county / CBSA compilations of CDC WONDER excessive-heat deaths,
 * 2018–2023. Large Sun Belt metros are the analytic focus; high-rate
 * desert micropolitans and a Pacific Northwest spike metro are retained
 * for rate-versus-share contrast.
 */
export const METRO_PANEL: MetroRow[] = (
  [
  {
    id: "phoenix",
    metro: "Phoenix–Mesa–Chandler, AZ",
    short: "Phoenix",
    state: "AZ",
    belt: "sun-belt",
    deaths: 648,
    popThousands: 4492,
    ratePer100kWindow: 2.4,
    summerHighF: 105.2,
    shareOfNationalPct: 0,
    largeMetro: true,
    confidence: "disclosed",
    geographyNote: "Maricopa County WONDER total (CBSA core)",
  },
  {
    id: "las-vegas",
    metro: "Las Vegas–Henderson–Paradise, NV",
    short: "Las Vegas",
    state: "NV",
    belt: "sun-belt",
    deaths: 391,
    popThousands: 2294,
    ratePer100kWindow: 2.8,
    summerHighF: 102.2,
    shareOfNationalPct: 0,
    largeMetro: true,
    confidence: "disclosed",
    geographyNote: "Clark County WONDER total",
  },
  {
    id: "lake-havasu",
    metro: "Lake Havasu City–Kingman, AZ",
    short: "L. Havasu",
    state: "AZ",
    belt: "sun-belt",
    deaths: 239,
    popThousands: 217,
    ratePer100kWindow: 18.4,
    summerHighF: 107.5,
    shareOfNationalPct: 0,
    largeMetro: false,
    confidence: "disclosed",
    geographyNote: "Mohave County — high rate, smaller population",
  },
  {
    id: "dfw",
    metro: "Dallas–Fort Worth–Arlington, TX",
    short: "Dallas–FW",
    state: "TX",
    belt: "sun-belt",
    deaths: 149,
    popThousands: 4739,
    ratePer100kWindow: 0.52,
    summerHighF: 95.0,
    shareOfNationalPct: 0,
    largeMetro: true,
    confidence: "derived",
    geographyNote: "Dallas + Tarrant counties (principal pair)",
  },
  {
    id: "tucson",
    metro: "Tucson, AZ",
    short: "Tucson",
    state: "AZ",
    belt: "sun-belt",
    deaths: 113,
    popThousands: 1050,
    ratePer100kWindow: 1.8,
    summerHighF: 100.0,
    shareOfNationalPct: 0,
    largeMetro: true,
    confidence: "disclosed",
    geographyNote: "Pima County WONDER total",
  },
  {
    id: "houston",
    metro: "Houston–The Woodlands–Sugar Land, TX",
    short: "Houston",
    state: "TX",
    belt: "sun-belt",
    deaths: 89,
    popThousands: 4759,
    ratePer100kWindow: 0.31,
    summerHighF: 94.0,
    shareOfNationalPct: 0,
    largeMetro: true,
    confidence: "disclosed",
    geographyNote: "Harris County (CBSA core) — humid coding lag",
  },
  {
    id: "portland",
    metro: "Portland–Vancouver–Hillsboro, OR–WA",
    short: "Portland",
    state: "OR",
    belt: "other",
    deaths: 85,
    popThousands: 804,
    ratePer100kWindow: 1.8,
    summerHighF: 79.5,
    shareOfNationalPct: 0,
    largeMetro: true,
    confidence: "disclosed",
    geographyNote: "Multnomah County — 2021 PNW heat dome imprint",
  },
  {
    id: "yuma",
    metro: "Yuma, AZ",
    short: "Yuma",
    state: "AZ",
    belt: "sun-belt",
    deaths: 66,
    popThousands: 208,
    ratePer100kWindow: 5.2,
    summerHighF: 105.4,
    shareOfNationalPct: 0,
    largeMetro: false,
    confidence: "disclosed",
    geographyNote: "Yuma County",
  },
  {
    id: "riverside",
    metro: "Riverside–San Bernardino–Ontario, CA",
    short: "Inland Emp.",
    state: "CA",
    belt: "sun-belt",
    deaths: 66,
    popThousands: 2450,
    ratePer100kWindow: 0.45,
    summerHighF: 95.0,
    shareOfNationalPct: 0,
    largeMetro: true,
    confidence: "disclosed",
    geographyNote: "Riverside County (San Bernardino not in top-10 list)",
  },
  {
    id: "miami",
    metro: "Miami–Fort Lauderdale–Pompano Beach, FL",
    short: "Miami",
    state: "FL",
    belt: "sun-belt",
    deaths: 42,
    popThousands: 6139,
    ratePer100kWindow: 0.11,
    summerHighF: 91.0,
    shareOfNationalPct: 0,
    largeMetro: true,
    confidence: "derived",
    geographyNote:
      "Scaled from FL statewide heat-coded pattern; humid undercount risk",
  },
  {
    id: "atlanta",
    metro: "Atlanta–Sandy Springs–Alpharetta, GA",
    short: "Atlanta",
    state: "GA",
    belt: "sun-belt",
    deaths: 28,
    popThousands: 6142,
    ratePer100kWindow: 0.08,
    summerHighF: 89.0,
    shareOfNationalPct: 0,
    largeMetro: true,
    confidence: "derived",
    geographyNote: "Sparse WONDER cell; illustrative large humid metro",
  },
  {
    id: "san-antonio",
    metro: "San Antonio–New Braunfels, TX",
    short: "San Antonio",
    state: "TX",
    belt: "sun-belt",
    deaths: 38,
    popThousands: 2602,
    ratePer100kWindow: 0.24,
    summerHighF: 95.0,
    shareOfNationalPct: 0,
    largeMetro: true,
    confidence: "derived",
    geographyNote: "Bexar-centered estimate from TX heat-coded geography",
  },
] as MetroRow[]
).map((row) => ({
  ...row,
  shareOfNationalPct: Number(
    ((row.deaths / NATIONAL_PERIOD_DEATHS) * 100).toFixed(2),
  ),
}));

export type BeltStack = {
  year: number;
  sunBeltCore: number;
  restOfUs: number;
  national: number;
  sunBeltSharePct: number;
};

/**
 * Illustrative annual split: Phoenix + Las Vegas + Tucson + DFW + Houston
 * cores scaled to the national series using their fixed period share of
 * cumulative deaths (desk attribution — not year-by-year WONDER extracts).
 */
const CORE_SUN_BELT_IDS = [
  "phoenix",
  "las-vegas",
  "tucson",
  "dfw",
  "houston",
] as const;

const CORE_SUN_BELT_DEATHS = METRO_PANEL.filter((m) =>
  (CORE_SUN_BELT_IDS as readonly string[]).includes(m.id),
).reduce((s, m) => s + m.deaths, 0);

const CORE_SHARE = CORE_SUN_BELT_DEATHS / NATIONAL_PERIOD_DEATHS;

export const BELT_STACK: BeltStack[] = NATIONAL_SERIES.filter(
  (r) => r.year >= 2018,
).map((r) => {
  const sunBeltCore = Math.round(r.deaths * CORE_SHARE);
  const restOfUs = r.deaths - sunBeltCore;
  return {
    year: r.year,
    sunBeltCore,
    restOfUs,
    national: r.deaths,
    sunBeltSharePct: Number((CORE_SHARE * 100).toFixed(1)),
  };
});

export const DETAIL_TABLE = [...METRO_PANEL].sort(
  (a, b) => b.deaths - a.deaths,
);

export const HEADLINE = {
  window: WINDOW_LABEL,
  nationalPeriodDeaths: NATIONAL_PERIOD_DEATHS,
  national2023: 2325,
  national2018: 1008,
  nationalRisePct: Number(
    (((2325 - 1008) / 1008) * 100).toFixed(0),
  ),
  phoenixDeaths: 648,
  phoenixSharePct: METRO_PANEL.find((m) => m.id === "phoenix")!
    .shareOfNationalPct,
  lasVegasDeaths: 391,
  lasVegasSharePct: METRO_PANEL.find((m) => m.id === "las-vegas")!
    .shareOfNationalPct,
  top2SharePct: Number(
    (
      METRO_PANEL.find((m) => m.id === "phoenix")!.shareOfNationalPct +
      METRO_PANEL.find((m) => m.id === "las-vegas")!.shareOfNationalPct
    ).toFixed(1),
  ),
  coreSunBeltDeaths: CORE_SUN_BELT_DEATHS,
  coreSunBeltSharePct: Number((CORE_SHARE * 100).toFixed(1)),
  lakeHavasuRate: 18.4,
  phoenixRate: 2.4,
  houstonRate: 0.31,
  metroPanelN: METRO_PANEL.length,
  largeMetroN: METRO_PANEL.filter((m) => m.largeMetro).length,
};

export type MetroFilter = "all" | "large" | "sun-belt" | "desert";
export type SortMode = "deaths" | "share" | "rate";

export function filterMetros(
  mode: MetroFilter,
  rows: MetroRow[] = METRO_PANEL,
): MetroRow[] {
  switch (mode) {
    case "large":
      return rows.filter((r) => r.largeMetro);
    case "sun-belt":
      return rows.filter((r) => r.belt === "sun-belt");
    case "desert":
      return rows.filter((r) =>
        ["AZ", "NV", "CA"].includes(r.state) && r.summerHighF >= 100,
      );
    default:
      return rows;
  }
}

export function sortMetros(mode: SortMode, rows: MetroRow[]): MetroRow[] {
  const copy = [...rows];
  switch (mode) {
    case "share":
      return copy.sort((a, b) => b.shareOfNationalPct - a.shareOfNationalPct);
    case "rate":
      return copy.sort((a, b) => b.ratePer100kWindow - a.ratePer100kWindow);
    default:
      return copy.sort((a, b) => b.deaths - a.deaths);
  }
}

export const ANALYTICS = {
  caveatLocalMe:
    "Maricopa County medical-examiner heat-associated deaths (hundreds per recent summer) use a broader case definition than CDC WONDER ICD coding and should not be mixed into national shares.",
  caveatUndercount:
    "Humidity-belt metros (Houston, Miami, Atlanta) show far fewer heat-coded certificates than desert metros; excess all-cause methods imply larger latent burdens.",
  caveatGeography:
    "Several rows are principal-county proxies for CBSAs; peripheral counties can add modest additional deaths.",
};
