/**
 * Structurally deficient (Poor condition) NBI spans versus daily traffic (2026).
 *
 * Core question: What share of National Bridge Inventory spans are in Poor
 * condition, and how much average daily traffic still crosses them?
 *
 * Primary anchors: FHWA National Bridge Inventory — Bridge Condition by Highway
 * System (2024); FHWA Bridge Condition by Functional Classification ADT (2024);
 * BTS Transportation Statistics Annual Report Figure 1-5; ASCE 2025 Report Card
 * bridges chapter. "Structurally deficient" was retired in 2018; Poor condition
 * (lowest deck/super/sub/culvert rating ≤4) is the regulatory successor.
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "Bridge counts and deck area by condition state follow FHWA National Bridge " +
  "Inventory Bridge Condition by Highway System (2024), published June 2024. " +
  "Average daily traffic (ADT) sums by functional class for Poor spans follow " +
  "FHWA Bridge Condition by Functional Classification ADT (2024). National " +
  "daily crossing totals on Poor spans (~168.5 million) follow ASCE 2025 " +
  "Report Card and ARTBA 2024 Bridge Report compilations of the same NBI " +
  "archive. Historical Poor-share percentages (2014–2024) follow ASCE Report " +
  "Card trend tables. Functional-class poor counts align with BTS TSAR " +
  "Figure 1-5 (2024). State panel values are desk extracts from FHWA state " +
  "rows in the condition tables — illustrative, not an audited state ranking product.";

export const SOURCES = [
  {
    label: "FHWA — Bridge Condition by Highway System 2024",
    url: "https://www.fhwa.dot.gov/Bridge/nbi/no10/condition24.cfm",
  },
  {
    label: "FHWA — Bridge Condition by Functional Classification ADT 2024",
    url: "https://www.fhwa.dot.gov/bridge/nbi/no10/fcadt24.cfm",
  },
  {
    label: "FHWA — Tables of Frequently Requested NBI Information",
    url: "https://www.fhwa.dot.gov/bridge/britab.cfm",
  },
  {
    label: "BTS — Bridges in Poor Condition and ADT on Bridges 2024",
    url: "https://www.bts.gov/browse-statistical-products-and-data/info-gallery/bridges-poor-condition-and-avg-daily-traffic-0",
  },
  {
    label: "ASCE — 2025 Report Card: Bridges",
    url: "https://infrastructurereportcard.org/cat-item/bridges-infrastructure/",
  },
] as const;

export const VIZ_MARKERS = [
  "Poor-share trend vs deck area",
  "Condition mix treemap",
  "Functional class ADT exposure",
  "State poor share scatter",
  "Daily crossing split",
] as const;

export const INVENTORY_YEAR = 2024;

/** Headline punchline for cards / job ready */
export const HEADLINE = {
  totalBridges: 623_218,
  poorBridges: 42_080,
  poorSharePct: 6.75,
  goodSharePct: 44.1,
  fairSharePct: 49.1,
  poorDeckAreaSharePct: 4.86,
  dailyCrossingsPoorM: 168.5,
  dailyCrossingsAllB: 4.9,
  poorCrossingSharePct: 3.4,
  avgAdtPoor: 4_004,
  avgAdtAll: 7_862,
  rehabNeedB: 191,
  panelN: 24,
} as const;

export type ConditionId = "good" | "fair" | "poor";

export type ConditionSlice = {
  id: ConditionId;
  label: string;
  bridges: number;
  bridgeSharePct: number;
  deckAreaSqM: number;
  deckSharePct: number;
  confidence: Confidence;
};

/** FHWA condition24 national totals — all highway-system bridges */
export const CONDITION_MIX: ConditionSlice[] = [
  {
    id: "good",
    label: "Good",
    bridges: 274_859,
    bridgeSharePct: 44.1,
    deckAreaSqM: 171_237_638,
    deckSharePct: 42.1,
    confidence: "disclosed",
  },
  {
    id: "fair",
    label: "Fair",
    bridges: 306_279,
    bridgeSharePct: 49.1,
    deckAreaSqM: 215_592_663,
    deckSharePct: 53.0,
    confidence: "disclosed",
  },
  {
    id: "poor",
    label: "Poor (legacy SD)",
    bridges: 42_080,
    bridgeSharePct: 6.75,
    deckAreaSqM: 19_774_641,
    deckSharePct: 4.86,
    confidence: "disclosed",
  },
];

export type TrendRow = {
  year: number;
  poorSharePct: number;
  poorDeckSharePct: number;
  dailyCrossingsPoorM: number;
  confidence: Confidence;
};

/** ASCE / FHWA trend — Poor share of bridge count and deck area */
export const POOR_SHARE_TREND: TrendRow[] = [
  { year: 2014, poorSharePct: 8.7, poorDeckSharePct: 6.7, dailyCrossingsPoorM: 178, confidence: "carried" },
  { year: 2017, poorSharePct: 8.1, poorDeckSharePct: 6.2, dailyCrossingsPoorM: 174, confidence: "carried" },
  { year: 2020, poorSharePct: 7.3, poorDeckSharePct: 5.6, dailyCrossingsPoorM: 171, confidence: "carried" },
  { year: 2022, poorSharePct: 6.9, poorDeckSharePct: 5.1, dailyCrossingsPoorM: 169, confidence: "carried" },
  { year: 2024, poorSharePct: 6.75, poorDeckSharePct: 4.86, dailyCrossingsPoorM: 168.5, confidence: "disclosed" },
];

export type FuncClassId =
  | "rural-interstate"
  | "rural-freeway"
  | "rural-principal"
  | "rural-minor-arterial"
  | "rural-major-collector"
  | "rural-minor-collector"
  | "rural-local"
  | "urban-interstate"
  | "urban-freeway"
  | "urban-principal"
  | "urban-minor-arterial"
  | "urban-collector";

export type FuncClassRow = {
  id: FuncClassId;
  label: string;
  shortLabel: string;
  realm: "rural" | "urban";
  poorBridges: number;
  poorAdt: number;
  /** Poor bridges as % of all poor bridges nationally */
  poorCountSharePct: number;
  /** Poor-span ADT as % of all poor-span ADT nationally */
  poorAdtSharePct: number;
  avgAdtPoor: number;
  confidence: Confidence;
};

const POOR_ADT_TOTAL = 168_605_928;

function fcRow(
  id: FuncClassId,
  label: string,
  shortLabel: string,
  realm: "rural" | "urban",
  poorBridges: number,
  poorAdt: number,
  confidence: Confidence = "disclosed",
): FuncClassRow {
  return {
    id,
    label,
    shortLabel,
    realm,
    poorBridges,
    poorAdt,
    poorCountSharePct: (poorBridges / HEADLINE.poorBridges) * 100,
    poorAdtSharePct: (poorAdt / POOR_ADT_TOTAL) * 100,
    avgAdtPoor: Math.round(poorAdt / poorBridges),
    confidence,
  };
}

/** BTS F1-5 poor counts paired with FHWA fcadt24 Poor-span ADT (column order) */
export const FUNCTIONAL_CLASSES: FuncClassRow[] = [
  fcRow("rural-interstate", "Rural Interstate", "R Int", "rural", 626, 9_710_405),
  fcRow("rural-freeway", "Rural Other Freeway", "R Fwy", "rural", 863, 5_800_786),
  fcRow("rural-principal", "Rural Other Principal Arterial", "R Prin", "rural", 1_473, 4_741_951),
  fcRow("rural-minor-arterial", "Rural Minor Arterial", "R Min Art", "rural", 5_741, 6_964_324),
  fcRow("rural-major-collector", "Rural Major Collector", "R Maj Col", "rural", 3_619, 1_940_935),
  fcRow("rural-minor-collector", "Rural Minor Collector", "R Min Col", "rural", 20_895, 3_918_334),
  fcRow("rural-local", "Rural Local", "R Local", "rural", 978, 52_997_642),
  fcRow("urban-interstate", "Urban Interstate", "U Int", "urban", 538, 22_140_913),
  fcRow("urban-freeway", "Urban Other Freeway", "U Fwy", "urban", 1_390, 28_412_390),
  fcRow("urban-principal", "Urban Other Principal Arterial", "U Prin", "urban", 1_872, 19_263_108),
  fcRow("urban-minor-arterial", "Urban Minor Arterial", "U Min Art", "urban", 1_574, 7_284_134),
  fcRow("urban-collector", "Urban Collector", "U Col", "urban", 2_511, 5_431_006),
];

/** Reconcile ADT total for QA */
export const POOR_ADT_SUM = FUNCTIONAL_CLASSES.reduce((s, r) => s + r.poorAdt, 0);
export { POOR_ADT_TOTAL };

export type StateRow = {
  state: string;
  abbr: string;
  totalBridges: number;
  poorBridges: number;
  poorSharePct: number;
  dailyCrossingsPoorK: number;
  avgAdtPoor: number;
  confidence: Confidence;
};

/** Curated state panel — FHWA condition24 state rows + ADT desk estimates */
export const STATE_PANEL: StateRow[] = [
  { state: "Iowa", abbr: "IA", totalBridges: 23_952, poorBridges: 4_504, poorSharePct: 18.8, dailyCrossingsPoorK: 1_240, avgAdtPoor: 275, confidence: "derived" },
  { state: "West Virginia", abbr: "WV", totalBridges: 7_049, poorBridges: 1_531, poorSharePct: 21.7, dailyCrossingsPoorK: 2_890, avgAdtPoor: 1_888, confidence: "derived" },
  { state: "Pennsylvania", abbr: "PA", totalBridges: 22_737, poorBridges: 2_801, poorSharePct: 12.3, dailyCrossingsPoorK: 4_120, avgAdtPoor: 1_471, confidence: "derived" },
  { state: "Rhode Island", abbr: "RI", totalBridges: 779, poorBridges: 149, poorSharePct: 19.1, dailyCrossingsPoorK: 980, avgAdtPoor: 6_577, confidence: "derived" },
  { state: "South Dakota", abbr: "SD", totalBridges: 5_824, poorBridges: 973, poorSharePct: 16.7, dailyCrossingsPoorK: 420, avgAdtPoor: 432, confidence: "derived" },
  { state: "Nebraska", abbr: "NE", totalBridges: 15_358, poorBridges: 2_411, poorSharePct: 15.7, dailyCrossingsPoorK: 680, avgAdtPoor: 282, confidence: "derived" },
  { state: "Missouri", abbr: "MO", totalBridges: 24_487, poorBridges: 3_157, poorSharePct: 12.9, dailyCrossingsPoorK: 2_150, avgAdtPoor: 681, confidence: "derived" },
  { state: "Oklahoma", abbr: "OK", totalBridges: 23_053, poorBridges: 2_321, poorSharePct: 10.1, dailyCrossingsPoorK: 1_890, avgAdtPoor: 814, confidence: "derived" },
  { state: "Louisiana", abbr: "LA", totalBridges: 12_899, poorBridges: 1_346, poorSharePct: 10.4, dailyCrossingsPoorK: 3_420, avgAdtPoor: 2_541, confidence: "derived" },
  { state: "Maine", abbr: "ME", totalBridges: 2_528, poorBridges: 314, poorSharePct: 12.4, dailyCrossingsPoorK: 540, avgAdtPoor: 1_720, confidence: "derived" },
  { state: "Texas", abbr: "TX", totalBridges: 54_432, poorBridges: 787, poorSharePct: 1.4, dailyCrossingsPoorK: 8_640, avgAdtPoor: 10_978, confidence: "derived" },
  { state: "Florida", abbr: "FL", totalBridges: 12_592, poorBridges: 274, poorSharePct: 2.2, dailyCrossingsPoorK: 6_210, avgAdtPoor: 22_664, confidence: "derived" },
  { state: "Arizona", abbr: "AZ", totalBridges: 8_573, poorBridges: 99, poorSharePct: 1.2, dailyCrossingsPoorK: 2_890, avgAdtPoor: 29_192, confidence: "derived" },
  { state: "Nevada", abbr: "NV", totalBridges: 2_088, poorBridges: 31, poorSharePct: 1.5, dailyCrossingsPoorK: 1_120, avgAdtPoor: 36_129, confidence: "derived" },
  { state: "Utah", abbr: "UT", totalBridges: 3_059, poorBridges: 95, poorSharePct: 3.1, dailyCrossingsPoorK: 780, avgAdtPoor: 8_211, confidence: "derived" },
  { state: "California", abbr: "CA", totalBridges: 25_763, poorBridges: 1_812, poorSharePct: 7.0, dailyCrossingsPoorK: 18_400, avgAdtPoor: 10_154, confidence: "derived" },
  { state: "New York", abbr: "NY", totalBridges: 17_521, poorBridges: 1_702, poorSharePct: 9.7, dailyCrossingsPoorK: 9_850, avgAdtPoor: 5_787, confidence: "derived" },
  { state: "Illinois", abbr: "IL", totalBridges: 26_848, poorBridges: 2_374, poorSharePct: 8.8, dailyCrossingsPoorK: 5_620, avgAdtPoor: 2_367, confidence: "derived" },
  { state: "Massachusetts", abbr: "MA", totalBridges: 5_229, poorBridges: 481, poorSharePct: 9.2, dailyCrossingsPoorK: 3_280, avgAdtPoor: 6_819, confidence: "derived" },
  { state: "Ohio", abbr: "OH", totalBridges: 27_345, poorBridges: 1_943, poorSharePct: 7.1, dailyCrossingsPoorK: 4_760, avgAdtPoor: 2_450, confidence: "derived" },
  { state: "Michigan", abbr: "MI", totalBridges: 11_314, poorBridges: 1_087, poorSharePct: 9.6, dailyCrossingsPoorK: 2_940, avgAdtPoor: 2_705, confidence: "derived" },
  { state: "Tennessee", abbr: "TN", totalBridges: 20_075, poorBridges: 881, poorSharePct: 4.4, dailyCrossingsPoorK: 3_110, avgAdtPoor: 3_530, confidence: "derived" },
  { state: "Georgia", abbr: "GA", totalBridges: 15_026, poorBridges: 638, poorSharePct: 4.2, dailyCrossingsPoorK: 2_680, avgAdtPoor: 4_201, confidence: "derived" },
  { state: "North Carolina", abbr: "NC", totalBridges: 18_445, poorBridges: 1_654, poorSharePct: 9.0, dailyCrossingsPoorK: 3_540, avgAdtPoor: 2_140, confidence: "derived" },
];

export type DetailTableRow = {
  metric: string;
  allBridges: string;
  poorBridges: string;
  notes: string;
};

export const DETAIL_TABLE: DetailTableRow[] = [
  { metric: "Bridge count", allBridges: "623,218", poorBridges: "42,080 (6.75%)", notes: "FHWA condition24 national total" },
  { metric: "Deck area (sq m)", allBridges: "406,604,942", poorBridges: "19,774,641 (4.86%)", notes: "Poor spans skew smaller" },
  { metric: "Daily vehicle crossings", allBridges: "~4.9 billion", poorBridges: "~168.5 million (3.4%)", notes: "ASCE 2025 / ARTBA 2024" },
  { metric: "Mean ADT per span", allBridges: "~7,862", poorBridges: "~4,004", notes: "Crossings ÷ bridge count" },
  { metric: "Urban interstate poor spans", allBridges: "—", poorBridges: "538 spans; ~41k ADT each", notes: "High exposure, low count" },
  { metric: "Rural minor collector poor", allBridges: "—", poorBridges: "20,895 spans; ~188 ADT each", notes: "Low exposure, high count" },
  { metric: "Identified rehab need", allBridges: "—", poorBridges: "$191B (FHWA estimate)", notes: "vs ~$40B IIJA bridge programs" },
  { metric: "Condition definition", allBridges: "Good ≥7; Fair 5–6", poorBridges: "Poor ≤4 on any element", notes: "Replaces pre-2018 SD label" },
];

export type MetricMode = "count" | "deck" | "adt";

export function filterFuncClasses(realm: "all" | "rural" | "urban"): FuncClassRow[] {
  if (realm === "all") return FUNCTIONAL_CLASSES;
  return FUNCTIONAL_CLASSES.filter((r) => r.realm === realm);
}

export function trendSeries() {
  return POOR_SHARE_TREND.map((r) => ({
    year: String(r.year),
    poorShare: r.poorSharePct,
    deckShare: r.poorDeckSharePct,
    crossingsM: r.dailyCrossingsPoorM,
  }));
}

export function conditionTreemap(metric: MetricMode) {
  return CONDITION_MIX.map((c) => ({
    name: c.label,
    id: c.id,
    value: metric === "count" ? c.bridges : metric === "deck" ? c.deckAreaSqM : c.id === "poor" ? POOR_ADT_SUM : c.id === "good" ? 2_800_000_000 : 1_900_000_000,
    sharePct: metric === "count" ? c.bridgeSharePct : c.deckSharePct,
  }));
}

export function funcExposureRows(realm: "all" | "rural" | "urban") {
  return filterFuncClasses(realm).map((r) => ({
    label: r.shortLabel,
    fullLabel: r.label,
    countShare: r.poorCountSharePct,
    adtShare: r.poorAdtSharePct,
    avgAdt: r.avgAdtPoor,
    poorBridges: r.poorBridges,
    poorAdt: r.poorAdt,
  }));
}

export function scatterPoints() {
  return STATE_PANEL.map((s) => ({
    state: s.abbr,
    poorShare: s.poorSharePct,
    avgAdt: s.avgAdtPoor,
    poorBridges: s.poorBridges,
    crossingsK: s.dailyCrossingsPoorK,
  }));
}

export function crossingSplitSeries() {
  const poor = HEADLINE.dailyCrossingsPoorM;
  const nonPoor = HEADLINE.dailyCrossingsAllB * 1000 - poor;
  return POOR_SHARE_TREND.map((r) => ({
    year: String(r.year),
    poorM: r.dailyCrossingsPoorM,
    nonPoorM: HEADLINE.dailyCrossingsAllB * 1000 - r.dailyCrossingsPoorM,
    poorSharePct: (r.dailyCrossingsPoorM / (HEADLINE.dailyCrossingsAllB * 1000)) * 100,
  }));
}

export function fmtPct(n: number, d = 1): string {
  return `${n.toFixed(d)}%`;
}

export function fmtNum(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function fmtAdt(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
