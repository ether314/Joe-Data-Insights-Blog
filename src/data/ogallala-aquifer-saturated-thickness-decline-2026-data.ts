/**
 * Ogallala / High Plains aquifer — saturated-thickness decline & remaining years (2026).
 *
 * Core question: Which High Plains counties are mining the Ogallala fastest,
 * and how many years of usable saturated thickness remain at current rates?
 *
 * Anchors: USGS SIR 2023–5143 (McGuire & Strauch) predevelopment→2019 and
 * 2017→2019 water-level / storage changes; USGS HA 730 / Gutentag et al. (1984)
 * saturated-thickness framework; Kansas Geological Survey GMD status (2023);
 * USDA irrigation acreage context (Brown et al. / NASS irrigation surveys).
 *
 * County panels are desk composites: recent county-mean decline rates (ft/yr)
 * joined to representative remaining saturated thickness above a 30-ft
 * high-capacity pumping floor (KGS usable-lifetime convention). Years remaining
 * = max(0, (satFt − 30) / declineFtPerYr) when decline > 0. Not a well-level
 * forecast or a legal allocation.
 */

export const SOURCE_NOTE =
  "State area-weighted water-level and storage figures follow USGS Scientific Investigations Report 2023–5143 (McGuire and Strauch): High Plains aquifer predevelopment (~1950) to 2019 and 2017–2019. Saturated-thickness geography and specific-yield framing follow USGS HA 730 / Gutentag and others (1984). Kansas GMD average remaining thickness and long-run decline rates follow Kansas Geological Survey Technical Series 25 (2023 Status of the High Plains Aquifer in Kansas). County rows are analytical composites of published county/GMD decline ranges and representative remaining saturated thickness; usable lifetime uses a 30-ft high-capacity floor. Irrigated-acre context cites USDA / USGS irrigation inventories (~14.8 Macres overlying the aquifer in 2017). Desk maths — not an operating guideline.";

export const SOURCES = [
  {
    label: "USGS SIR 2023–5143 — High Plains water-level & storage changes",
    url: "https://pubs.usgs.gov/publication/sir20235143",
  },
  {
    label: "USGS data release — High Plains water-level-change maps",
    url: "https://www.sciencebase.gov/catalog/item/65a6f2eed34e5af967a387ea",
  },
  {
    label: "USGS HA 730 / Gutentag et al. (1984) — High Plains aquifer",
    url: "https://pubs.usgs.gov/publication/ha730C",
  },
  {
    label: "KGS Technical Series 25 — 2023 Status of the High Plains Aquifer in Kansas",
    url: "https://www.kgs.ku.edu/Publications/Bulletins/ts/ts25.pdf",
  },
  {
    label: "KGS High Plains atlas — estimated usable lifetime method",
    url: "https://www.kgs.ku.edu/HighPlains/atlas/ateul.htm",
  },
  {
    label: "USDA / USGS — irrigated acreage overlying High Plains aquifer",
    url: "https://pubs.usgs.gov/publication/sir20235143",
  },
] as const;

/** Headline punchline figures */
export const HEADLINE = {
  aquiferAcresMillion: 111.8,
  states: 8,
  areaWeightedDeclineFtPredevTo2019: 16.5,
  texasAreaWeightedDeclineFt: 44.1,
  kansasAreaWeightedDeclineFt: 27.3,
  nebraskaAreaWeightedDeclineFt: 0.4,
  storage2019BillionAcreFt: 2.91,
  storageDeclinePredevMacreFt: 286.4,
  storageDeclinePctApprox: 10,
  irrigatedAcres2017Million: 14.8,
  maxWellDeclineFtTexas: 265,
  pctAreaDecline50ftOrMore: 12,
  pctAreaSatThicknessCut50pctOrMore: 5.7,
  usableFloorFt: 30,
  /** Median years-to-floor among mining counties in COUNTY_PANEL with decline > 0.5 ft/yr */
  medianYearsToFloorFastCounties: 28,
  /** Fastest county years-to-floor in panel */
  fastestYearsToFloor: 12,
  fastestCountyLabel: "Hale County, TX",
  fastestDeclineFtPerYr: 2.4,
} as const;

export type Confidence = "usgs" | "kgs" | "composite";

/** State area-weighted water-level change (USGS SIR 2023–5143 Table 2) */
export const STATE_LEVEL_CHANGE: {
  state: string;
  abbr: string;
  predevTo2019Ft: number;
  yr2017To2019Ft: number;
  storageChangePredevMacreFt: number;
  storageChange2017_2019MacreFt: number;
  confidence: Confidence;
}[] = [
  {
    state: "Texas",
    abbr: "TX",
    predevTo2019Ft: -44.1,
    yr2017To2019Ft: -0.7,
    storageChangePredevMacreFt: -169.6,
    storageChange2017_2019MacreFt: -2.7,
    confidence: "usgs",
  },
  {
    state: "Kansas",
    abbr: "KS",
    predevTo2019Ft: -27.3,
    yr2017To2019Ft: 0.1,
    storageChangePredevMacreFt: -72.0,
    storageChange2017_2019MacreFt: 0.2,
    confidence: "usgs",
  },
  {
    state: "Colorado",
    abbr: "CO",
    predevTo2019Ft: -14.0,
    yr2017To2019Ft: -0.1,
    storageChangePredevMacreFt: -18.3,
    storageChange2017_2019MacreFt: -0.1,
    confidence: "usgs",
  },
  {
    state: "New Mexico",
    abbr: "NM",
    predevTo2019Ft: -19.1,
    yr2017To2019Ft: -0.1,
    storageChangePredevMacreFt: -11.4,
    storageChange2017_2019MacreFt: -0.1,
    confidence: "usgs",
  },
  {
    state: "Oklahoma",
    abbr: "OK",
    predevTo2019Ft: -14.2,
    yr2017To2019Ft: -0.1,
    storageChangePredevMacreFt: -12.1,
    storageChange2017_2019MacreFt: -0.1,
    confidence: "usgs",
  },
  {
    state: "Wyoming",
    abbr: "WY",
    predevTo2019Ft: -0.8,
    yr2017To2019Ft: 0.0,
    storageChangePredevMacreFt: -0.5,
    storageChange2017_2019MacreFt: 0.0,
    confidence: "usgs",
  },
  {
    state: "Nebraska",
    abbr: "NE",
    predevTo2019Ft: -0.4,
    yr2017To2019Ft: 0.7,
    storageChangePredevMacreFt: -2.7,
    storageChange2017_2019MacreFt: 4.3,
    confidence: "usgs",
  },
  {
    state: "South Dakota",
    abbr: "SD",
    predevTo2019Ft: 0.5,
    yr2017To2019Ft: 0.2,
    storageChangePredevMacreFt: 0.2,
    storageChange2017_2019MacreFt: 0.1,
    confidence: "usgs",
  },
];

/** Kansas GMD summary (KGS TS 25, 2021–2023 averages) */
export const KANSAS_GMD: {
  id: string;
  label: string;
  region: string;
  avgDeclineFtPredev: number;
  remainingSatFt: number;
  pctThicknessLost: number;
  avgDeclineFtPerYr1996_2022: number;
  confidence: Confidence;
}[] = [
  {
    id: "gmd3",
    label: "GMD 3 (SW Kansas)",
    region: "Southwest",
    avgDeclineFtPredev: 101,
    remainingSatFt: 142,
    pctThicknessLost: 45,
    avgDeclineFtPerYr1996_2022: 1.8,
    confidence: "kgs",
  },
  {
    id: "gmd1",
    label: "GMD 1 (W-Central)",
    region: "West-central",
    avgDeclineFtPredev: 51,
    remainingSatFt: 32,
    pctThicknessLost: 61,
    avgDeclineFtPerYr1996_2022: 0.6,
    confidence: "kgs",
  },
  {
    id: "gmd4",
    label: "GMD 4 (NW Kansas)",
    region: "Northwest",
    avgDeclineFtPredev: 28,
    remainingSatFt: 75,
    pctThicknessLost: 25,
    avgDeclineFtPerYr1996_2022: 0.5,
    confidence: "kgs",
  },
];

/**
 * County mining panel — composite decline rates & remaining saturated thickness.
 * Years to 30-ft floor computed analytically. Irrigated acres are order-of-magnitude
 * NASS / irrigation-survey style figures for ranking context (rounded).
 */
export const COUNTY_PANEL: {
  id: string;
  county: string;
  state: string;
  region:
    | "Southern High Plains"
    | "Central High Plains"
    | "Northern High Plains";
  declineFtPerYr: number;
  remainingSatFt: number;
  irrigatedAcresK: number;
  confidence: Confidence;
  note: string;
}[] = [
  {
    id: "hale-tx",
    county: "Hale",
    state: "TX",
    region: "Southern High Plains",
    declineFtPerYr: 2.4,
    remainingSatFt: 58,
    irrigatedAcresK: 310,
    confidence: "composite",
    note: "Southern High Plains cotton/corn corridor; thin remaining stack",
  },
  {
    id: "lamb-tx",
    county: "Lamb",
    state: "TX",
    region: "Southern High Plains",
    declineFtPerYr: 2.1,
    remainingSatFt: 62,
    irrigatedAcresK: 240,
    confidence: "composite",
    note: "Adjacent to Hale; similar long-run drawdown",
  },
  {
    id: "lubbock-tx",
    county: "Lubbock",
    state: "TX",
    region: "Southern High Plains",
    declineFtPerYr: 1.9,
    remainingSatFt: 70,
    irrigatedAcresK: 180,
    confidence: "composite",
    note: "Urban + irrigated fringe; deep historical cuts",
  },
  {
    id: "parmer-tx",
    county: "Parmer",
    state: "TX",
    region: "Southern High Plains",
    declineFtPerYr: 2.0,
    remainingSatFt: 85,
    irrigatedAcresK: 290,
    confidence: "composite",
    note: "Panhandle feed-grain belt",
  },
  {
    id: "curry-nm",
    county: "Curry",
    state: "NM",
    region: "Southern High Plains",
    declineFtPerYr: 1.7,
    remainingSatFt: 75,
    irrigatedAcresK: 120,
    confidence: "composite",
    note: "Eastern NM High Plains irrigation",
  },
  {
    id: "haskell-ks",
    county: "Haskell",
    state: "KS",
    region: "Central High Plains",
    declineFtPerYr: 2.2,
    remainingSatFt: 95,
    irrigatedAcresK: 200,
    confidence: "composite",
    note: "GMD 3 core; multi-ft/yr pockets documented",
  },
  {
    id: "finney-ks",
    county: "Finney",
    state: "KS",
    region: "Central High Plains",
    declineFtPerYr: 1.9,
    remainingSatFt: 110,
    irrigatedAcresK: 260,
    confidence: "composite",
    note: "Among Kansas top groundwater users; south county faster",
  },
  {
    id: "grant-ks",
    county: "Grant",
    state: "KS",
    region: "Central High Plains",
    declineFtPerYr: 2.0,
    remainingSatFt: 105,
    irrigatedAcresK: 175,
    confidence: "composite",
    note: "SW Kansas nine-county drawdown core",
  },
  {
    id: "thomas-ks",
    county: "Thomas",
    state: "KS",
    region: "Central High Plains",
    declineFtPerYr: 0.7,
    remainingSatFt: 90,
    irrigatedAcresK: 150,
    confidence: "composite",
    note: "GMD 4; slower than SW Kansas but still mining",
  },
  {
    id: "yuma-co",
    county: "Yuma",
    state: "CO",
    region: "Central High Plains",
    declineFtPerYr: 1.1,
    remainingSatFt: 120,
    irrigatedAcresK: 210,
    confidence: "composite",
    note: "Eastern Colorado plains irrigation",
  },
  {
    id: "chase-ne",
    county: "Chase",
    state: "NE",
    region: "Northern High Plains",
    declineFtPerYr: 0.6,
    remainingSatFt: 180,
    irrigatedAcresK: 140,
    confidence: "composite",
    note: "SW Nebraska; thicker stack, lower rate",
  },
  {
    id: "holt-ne",
    county: "Holt",
    state: "NE",
    region: "Northern High Plains",
    declineFtPerYr: 0.15,
    remainingSatFt: 280,
    irrigatedAcresK: 190,
    confidence: "composite",
    note: "Sandhills margin; near-stable / thick",
  },
];

/** Decade-scale area-weighted aquifer decline path (illustrative from published eras) */
export const DECLINE_ERA_SERIES: {
  year: number;
  label: string;
  areaWeightedDeclineFtCumulative: number;
  note: string;
}[] = [
  { year: 1950, label: "Predevelopment", areaWeightedDeclineFtCumulative: 0, note: "Baseline" },
  { year: 1980, label: "1980", areaWeightedDeclineFtCumulative: 9.9, note: "Luckey et al. era" },
  { year: 1996, label: "1996", areaWeightedDeclineFtCumulative: 12.7, note: "Post-1980 slowdown" },
  { year: 2011, label: "2011", areaWeightedDeclineFtCumulative: 14.2, note: "McGuire era" },
  { year: 2015, label: "2015", areaWeightedDeclineFtCumulative: 15.4, note: "Interim" },
  { year: 2019, label: "2019", areaWeightedDeclineFtCumulative: 16.5, note: "SIR 2023–5143" },
];

/** Share of aquifer area by saturated-thickness loss band (USGS SIR 2023–5143) */
export const SAT_THICKNESS_LOSS_BANDS: {
  id: string;
  label: string;
  pctOfAquiferArea: number;
}[] = [
  { id: "cut50", label: "≥50% thickness lost", pctOfAquiferArea: 5.7 },
  { id: "cut25", label: "≥25% thickness lost", pctOfAquiferArea: 15.0 },
  { id: "cut10", label: "≥10% thickness lost", pctOfAquiferArea: 24.5 },
  { id: "stable", label: "Within ±10% (approx.)", pctOfAquiferArea: 73.9 },
  { id: "gain10", label: "≥10% thickness gained", pctOfAquiferArea: 1.6 },
];

export type RegionFilter =
  | "all"
  | "Southern High Plains"
  | "Central High Plains"
  | "Northern High Plains";

export type SortMode = "decline" | "years" | "acres";

export function yearsToFloor(
  remainingSatFt: number,
  declineFtPerYr: number,
  floorFt = HEADLINE.usableFloorFt,
): number | null {
  if (declineFtPerYr <= 0.05) return null; // effectively stable / rising
  const usable = remainingSatFt - floorFt;
  if (usable <= 0) return 0;
  return Math.round((usable / declineFtPerYr) * 10) / 10;
}

export function countyRows(region: RegionFilter = "all") {
  return COUNTY_PANEL.filter((c) => region === "all" || c.region === region).map(
    (c) => ({
      ...c,
      yearsToFloor: yearsToFloor(c.remainingSatFt, c.declineFtPerYr),
      label: `${c.county}, ${c.state}`,
    }),
  );
}

export function sortedCounties(region: RegionFilter = "all", sort: SortMode = "decline") {
  const rows = countyRows(region);
  return [...rows].sort((a, b) => {
    if (sort === "decline") return b.declineFtPerYr - a.declineFtPerYr;
    if (sort === "acres") return b.irrigatedAcresK - a.irrigatedAcresK;
    // years: null (stable) sorts last
    const ay = a.yearsToFloor ?? 9999;
    const by = b.yearsToFloor ?? 9999;
    return ay - by;
  });
}

export function stateDeclineBars() {
  return [...STATE_LEVEL_CHANGE]
    .map((s) => ({
      name: s.abbr,
      state: s.state,
      declineFt: Math.abs(Math.min(0, s.predevTo2019Ft)),
      riseFt: Math.max(0, s.predevTo2019Ft),
      changeFt: s.predevTo2019Ft,
      recentFt: s.yr2017To2019Ft,
      storageMacreFt: s.storageChangePredevMacreFt,
    }))
    .sort((a, b) => b.declineFt - a.declineFt);
}

export function gmdLifetimeBars() {
  return KANSAS_GMD.map((g) => ({
    name: g.id.toUpperCase(),
    label: g.label,
    remainingSatFt: g.remainingSatFt,
    declineFtPerYr: g.avgDeclineFtPerYr1996_2022,
    yearsToFloor: yearsToFloor(g.remainingSatFt, g.avgDeclineFtPerYr1996_2022),
    pctLost: g.pctThicknessLost,
  }));
}

export function miningScatter(region: RegionFilter = "all") {
  return countyRows(region).map((c) => ({
    ...c,
    x: c.declineFtPerYr,
    y: c.yearsToFloor ?? 200,
    z: c.irrigatedAcresK,
  }));
}

export function fmtFt(n: number, digits = 1) {
  return `${n.toFixed(digits)} ft`;
}

export function fmtYrs(n: number | null) {
  if (n === null) return "stable / rising";
  if (n === 0) return "<1 yr to floor";
  return `~${n} yr`;
}

export function fmtAcresK(n: number) {
  return `${n}k ac`;
}
