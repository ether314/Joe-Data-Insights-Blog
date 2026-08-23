/**
 * Biologically unsustainable marine fish-stock share — FAO SOFIA status series.
 * Core question: What share of assessed stocks are fished at biologically
 * unsustainable levels, and is that share still rising?
 *
 * Primary: FAO SOFIA 2024, stock-status reference year 2021 (long-run panel).
 * Secondary contrast: FAO Review of world marine fishery resources 2025
 * (broader census — not spliced onto the 1974–2021 path).
 */

export type Confidence = "disclosed" | "approx-chart" | "derived";
export type OceanBasin =
  | "all"
  | "atlantic"
  | "pacific"
  | "indian"
  | "mediterranean";

export const SOURCE_NOTE =
  "Stock-status shares from FAO The State of World Fisheries and Aquaculture 2024 (SOFIA), reference year 2021, on FAO’s long-run assessed-stock panel. Unsustainable = overfished (biomass below the level that can produce MSY). Sustainable = maximally sustainably fished + underfished. Area percentages are sustainable-stock shares by FAO Major Fishing Area; unsustainable = 100 − sustainable. Production-weighted landings shares treat larger stocks more heavily than equal-stock counts. The 2025 Review figures (64.5% sustainable / 35.5% overfished on ~2,570 stocks) are a broader census and are not spliced into the 1974–2021 SOFIA path.";

export const VIZ_MARKERS = [
  "Unsustainable stock %",
  "Stock-count path",
  "Area ladder",
  "Composition split",
  "Management contrast",
] as const;

export const HEADLINE = {
  unsustainablePct2021: 37.7,
  sustainablePct2021: 62.3,
  unsustainablePct2019: 35.4,
  unsustainablePct1974: 10,
  deltaPp2019to2021: 2.3,
  deltaPp1974to2021: 27.7,
  landingsWeightedSustainablePct2021: 76.9,
  landingsWeightedUnsustainablePct2021: 23.1,
  maximallySustainablePct2021: 50.5,
  underfishedPct2021: 11.8,
  top10SpeciesSustainablePct: 78.9,
  tunaSustainablePct: 87,
  tunaCatchFromHealthyPct: 99,
} as const;

export const COLORS = {
  unsustainable: "#dc2626",
  sustainable: "#0ea5e9",
  maximally: "#0284c7",
  underfished: "#34d399",
  landings: "#059669",
  grid: "#e2e8f0",
  ink: "#0f172a",
  muted: "#64748b",
} as const;

export type StatusPoint = {
  year: number;
  unsustainablePct: number;
  sustainablePct: number;
  confidence: Confidence;
};

export const GLOBAL_STATUS_PATH: StatusPoint[] = [
  { year: 1974, unsustainablePct: 10.0, sustainablePct: 90.0, confidence: "disclosed" },
  { year: 1980, unsustainablePct: 13.0, sustainablePct: 87.0, confidence: "approx-chart" },
  { year: 1985, unsustainablePct: 18.0, sustainablePct: 82.0, confidence: "approx-chart" },
  { year: 1989, unsustainablePct: 22.0, sustainablePct: 78.0, confidence: "approx-chart" },
  { year: 1995, unsustainablePct: 25.0, sustainablePct: 75.0, confidence: "approx-chart" },
  { year: 2000, unsustainablePct: 27.0, sustainablePct: 73.0, confidence: "approx-chart" },
  { year: 2006, unsustainablePct: 28.0, sustainablePct: 72.0, confidence: "approx-chart" },
  { year: 2009, unsustainablePct: 30.0, sustainablePct: 70.0, confidence: "approx-chart" },
  { year: 2013, unsustainablePct: 31.4, sustainablePct: 68.6, confidence: "disclosed" },
  { year: 2015, unsustainablePct: 33.1, sustainablePct: 66.9, confidence: "disclosed" },
  { year: 2017, unsustainablePct: 34.2, sustainablePct: 65.8, confidence: "disclosed" },
  { year: 2019, unsustainablePct: 35.4, sustainablePct: 64.6, confidence: "disclosed" },
  { year: 2021, unsustainablePct: 37.7, sustainablePct: 62.3, confidence: "disclosed" },
];

/** Alias used by QA scripts */
export const GLOBAL_STATUS_PATH_ALIAS = GLOBAL_STATUS_PATH;

export type CompositionSlice = {
  id: "overfished" | "maximally" | "underfished";
  label: string;
  pct: number;
  fill: string;
};

export const COMPOSITION_2021: CompositionSlice[] = [
  {
    id: "overfished",
    label: "Overfished (unsustainable)",
    pct: 37.7,
    fill: COLORS.unsustainable,
  },
  {
    id: "maximally",
    label: "Maximally sustainably fished",
    pct: 50.5,
    fill: COLORS.maximally,
  },
  {
    id: "underfished",
    label: "Underfished",
    pct: 11.8,
    fill: COLORS.underfished,
  },
];

export type AreaRow = {
  areaCode: number;
  label: string;
  shortLabel: string;
  basin: Exclude<OceanBasin, "all">;
  sustainablePct: number;
  unsustainablePct: number;
  note?: string;
};

export const AREA_ROWS: AreaRow[] = [
  {
    areaCode: 77,
    label: "Eastern Central Pacific",
    shortLabel: "E Central Pacific",
    basin: "pacific",
    sustainablePct: 84.2,
    unsustainablePct: 15.8,
  },
  {
    areaCode: 27,
    label: "Northeast Atlantic",
    shortLabel: "NE Atlantic",
    basin: "atlantic",
    sustainablePct: 79.4,
    unsustainablePct: 20.6,
  },
  {
    areaCode: 67,
    label: "Northeast Pacific",
    shortLabel: "NE Pacific",
    basin: "pacific",
    sustainablePct: 76.5,
    unsustainablePct: 23.5,
  },
  {
    areaCode: 81,
    label: "Southwest Pacific",
    shortLabel: "SW Pacific",
    basin: "pacific",
    sustainablePct: 75.9,
    unsustainablePct: 24.1,
  },
  {
    areaCode: 71,
    label: "Western Central Pacific",
    shortLabel: "W Central Pacific",
    basin: "pacific",
    sustainablePct: 65.2,
    unsustainablePct: 34.8,
  },
  {
    areaCode: 21,
    label: "Northwest Atlantic",
    shortLabel: "NW Atlantic",
    basin: "atlantic",
    sustainablePct: 64.3,
    unsustainablePct: 35.7,
  },
  {
    areaCode: 57,
    label: "Eastern Indian Ocean",
    shortLabel: "E Indian Ocean",
    basin: "indian",
    sustainablePct: 63.5,
    unsustainablePct: 36.5,
  },
  {
    areaCode: 51,
    label: "Western Indian Ocean",
    shortLabel: "W Indian Ocean",
    basin: "indian",
    sustainablePct: 62.5,
    unsustainablePct: 37.5,
  },
  {
    areaCode: 47,
    label: "Southeast Atlantic",
    shortLabel: "SE Atlantic",
    basin: "atlantic",
    sustainablePct: 59.5,
    unsustainablePct: 40.5,
  },
  {
    areaCode: 41,
    label: "Southwest Atlantic",
    shortLabel: "SW Atlantic",
    basin: "atlantic",
    sustainablePct: 58.8,
    unsustainablePct: 41.2,
  },
  {
    areaCode: 31,
    label: "Western Central Atlantic",
    shortLabel: "W Central Atlantic",
    basin: "atlantic",
    sustainablePct: 58.0,
    unsustainablePct: 42.0,
  },
  {
    areaCode: 34,
    label: "Eastern Central Atlantic",
    shortLabel: "E Central Atlantic",
    basin: "atlantic",
    sustainablePct: 48.7,
    unsustainablePct: 51.3,
  },
  {
    areaCode: 61,
    label: "Northwest Pacific",
    shortLabel: "NW Pacific",
    basin: "pacific",
    sustainablePct: 44.0,
    unsustainablePct: 56.0,
  },
  {
    areaCode: 37,
    label: "Mediterranean and Black Sea",
    shortLabel: "Med + Black Sea",
    basin: "mediterranean",
    sustainablePct: 37.5,
    unsustainablePct: 62.5,
  },
  {
    areaCode: 87,
    label: "Southeast Pacific",
    shortLabel: "SE Pacific",
    basin: "pacific",
    sustainablePct: 33.3,
    unsustainablePct: 66.7,
    note: "~83% of area landings still from sustainable stocks (anchoveta weight)",
  },
];

export type WeightLensPoint = {
  year: number;
  lens: "stock-count" | "landings-weighted";
  sustainablePct: number;
  unsustainablePct: number;
  confidence: Confidence;
};

export const WEIGHT_LENS: WeightLensPoint[] = [
  { year: 2017, lens: "stock-count", sustainablePct: 65.8, unsustainablePct: 34.2, confidence: "disclosed" },
  { year: 2019, lens: "stock-count", sustainablePct: 64.6, unsustainablePct: 35.4, confidence: "disclosed" },
  { year: 2021, lens: "stock-count", sustainablePct: 62.3, unsustainablePct: 37.7, confidence: "disclosed" },
  { year: 2017, lens: "landings-weighted", sustainablePct: 78.7, unsustainablePct: 21.3, confidence: "derived" },
  { year: 2019, lens: "landings-weighted", sustainablePct: 82.5, unsustainablePct: 17.5, confidence: "derived" },
  { year: 2021, lens: "landings-weighted", sustainablePct: 76.9, unsustainablePct: 23.1, confidence: "disclosed" },
];

export type BenchmarkRow = {
  id: string;
  label: string;
  sustainablePct: number;
  unsustainablePct: number;
  fill: string;
  note?: string;
};

export const BENCHMARK_ROWS: BenchmarkRow[] = [
  {
    id: "world",
    label: "All assessed stocks",
    sustainablePct: 62.3,
    unsustainablePct: 37.7,
    fill: "#64748b",
  },
  {
    id: "top10",
    label: "Ten largest-landing species",
    sustainablePct: 78.9,
    unsustainablePct: 21.1,
    fill: "#0ea5e9",
  },
  {
    id: "tuna",
    label: "Major commercial tunas",
    sustainablePct: 87.0,
    unsustainablePct: 13.0,
    fill: "#0369a1",
  },
  {
    id: "landings-wt",
    label: "Landings-weighted world",
    sustainablePct: 76.9,
    unsustainablePct: 23.1,
    fill: "#34d399",
  },
];

export type CensusContrast = {
  id: string;
  label: string;
  stocksAssessed: number | string;
  sustainablePct: number;
  unsustainablePct: number;
  landingsWeightedSustainablePct: number;
  note: string;
};

export const CENSUS_CONTRAST: CensusContrast[] = [
  {
    id: "sofia-2021",
    label: "SOFIA panel (2021)",
    stocksAssessed: "~445",
    sustainablePct: 62.3,
    unsustainablePct: 37.7,
    landingsWeightedSustainablePct: 76.9,
    note: "Fixed long-run panel for SDG 14.4 continuity",
  },
  {
    id: "review-2025",
    label: "Marine resources review (2025)",
    stocksAssessed: 2570,
    sustainablePct: 64.5,
    unsustainablePct: 35.5,
    landingsWeightedSustainablePct: 77.2,
    note: "Broader stock census; not spliced onto 1974–2021 path",
  },
];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function areasForBasin(basin: OceanBasin): AreaRow[] {
  if (basin === "all") return AREA_ROWS;
  return AREA_ROWS.filter((r) => r.basin === basin);
}

export function sortedAreas(
  rows: AreaRow[],
  metric: "unsustainable" | "sustainable",
  order: "desc" | "asc" = "desc",
): AreaRow[] {
  const key = metric === "unsustainable" ? "unsustainablePct" : "sustainablePct";
  return [...rows].sort((a, b) =>
    order === "desc" ? b[key] - a[key] : a[key] - b[key],
  );
}

export function pathForMetric(
  metric: "unsustainable" | "sustainable",
): { year: number; value: number; confidence: Confidence }[] {
  return GLOBAL_STATUS_PATH.map((p) => ({
    year: p.year,
    value: metric === "unsustainable" ? p.unsustainablePct : p.sustainablePct,
    confidence: p.confidence,
  }));
}
