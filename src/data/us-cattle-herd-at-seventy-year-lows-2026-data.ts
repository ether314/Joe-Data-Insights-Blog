/**
 * US cattle herd at seventy-year lows (2026).
 *
 * Core question: How does drought-driven herd liquidation map onto retail
 * beef prices, and when does rebuilding begin?
 *
 * Primary anchors: USDA NASS Cattle (Jan 1, 2026 release); USDA ERS cattle &
 * beef statistics / Livestock Outlook framing; USDA AMS boxed-beef cutout
 * annual averages (desk-carried where noted); drought-share of inventory from
 * Drought Monitor / extension summaries labeled estimated.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "January 1 inventory classes follow USDA NASS Cattle (released Jan 30, 2026). Longer herd path uses NASS historical Jan-1 all-cattle and beef-cow series (rounded). All-fresh beef retail ($/lb) follows USDA ERS Cattle & Beef statistics through 2024; 2025–26 retail and Choice cutout ($/cwt) are desk-carried annual averages from AMS boxed-beef and ERS Livestock Outlook framing — not a substitute for daily LM_XB403 prints. Drought share of cattle inventory and heifer-retention timing cues are estimated from Drought Monitor / extension summaries. Rebuild timing is analytical, not a USDA forecast. Not a trading guide.";

export const SOURCES = [
  {
    label: "USDA NASS — Cattle (Jan 1, 2026; released Jan 30, 2026)",
    url: "https://www.nass.usda.gov/Newsroom/2026/01-30-2026.php",
  },
  {
    label: "USDA ERS — Cattle & Beef statistics",
    url: "https://ers.usda.gov/topics/animal-products/cattle-beef/statistics-information",
  },
  {
    label: "USDA ERS — Livestock, Dairy, and Poultry Outlook",
    url: "https://www.ers.usda.gov/publications/pub-details?pubid=108834",
  },
  {
    label: "USDA AMS — National Daily Boxed Beef Cutout (LM_XB403)",
    url: "https://www.ams.usda.gov/market-news/livestock-poultry-grain",
  },
  {
    label: "U.S. Drought Monitor — cattle inventory exposure summaries",
    url: "https://droughtmonitor.unl.edu/",
  },
] as const;

/** Headline punchline — herd size vs cutout / retail */
export const HEADLINE = {
  allCattle2026M: 86.2,
  allCattle2025M: 86.5,
  allCattlePeak1975M: 132.0,
  lastAbove100MYear: 1997,
  lowestSinceYear: 1951,
  beefCows2026M: 27.6,
  beefCows2025M: 27.9,
  beefCowsLowestSinceYear: 1961,
  milkCows2026M: 9.57,
  calfCrop2025M: 32.9,
  cattleOnFeed2026M: 13.8,
  beefReplacementHeifers2026M: 4.71,
  beefReplacementHeifersYoYPct: 1.0,
  beefCowSlaughterDropPriorYearPct: 18,
  droughtCattleSharePct: 34,
  choiceCutout2025AvgUsdCwt: 328,
  choiceCutout2026YtdUsdCwt: 355,
  allFreshRetail2024UsdLb: 8.01,
  allFreshRetail2025CarriedUsdLb: 8.55,
  fedSteer2025PeakUsdCwt: 243,
  contractionYears: 7,
  cycleYearsRunning: 13,
} as const;

export type SeriesMode = "allCattle" | "beefCows";
export type PriceMode = "cutout" | "retail";

/** Jan-1 inventory path (million head). Rounded NASS historical + 2026 print. */
export const HERD_PATH: {
  year: number;
  allCattleM: number;
  beefCowsM: number;
  confidence: Confidence;
  note?: string;
}[] = [
  { year: 1975, allCattleM: 132.0, beefCowsM: 45.7, confidence: "disclosed", note: "Modern peak" },
  { year: 1980, allCattleM: 111.2, beefCowsM: 37.1, confidence: "disclosed" },
  { year: 1985, allCattleM: 109.7, beefCowsM: 35.4, confidence: "disclosed" },
  { year: 1990, allCattleM: 95.8, beefCowsM: 33.2, confidence: "disclosed" },
  { year: 1995, allCattleM: 102.8, beefCowsM: 35.2, confidence: "disclosed" },
  { year: 1997, allCattleM: 101.7, beefCowsM: 34.3, confidence: "disclosed", note: "Last year above 100M" },
  { year: 2000, allCattleM: 98.2, beefCowsM: 33.4, confidence: "disclosed" },
  { year: 2005, allCattleM: 95.4, beefCowsM: 33.1, confidence: "disclosed" },
  { year: 2010, allCattleM: 93.7, beefCowsM: 31.4, confidence: "disclosed" },
  { year: 2014, allCattleM: 88.5, beefCowsM: 29.0, confidence: "disclosed", note: "Cycle trough / restart" },
  { year: 2015, allCattleM: 89.1, beefCowsM: 29.3, confidence: "disclosed" },
  { year: 2016, allCattleM: 91.9, beefCowsM: 30.1, confidence: "disclosed" },
  { year: 2017, allCattleM: 93.6, beefCowsM: 31.2, confidence: "disclosed" },
  { year: 2018, allCattleM: 94.4, beefCowsM: 31.7, confidence: "disclosed" },
  { year: 2019, allCattleM: 94.8, beefCowsM: 31.7, confidence: "disclosed", note: "Recent cycle peak" },
  { year: 2020, allCattleM: 93.8, beefCowsM: 31.3, confidence: "disclosed" },
  { year: 2021, allCattleM: 93.6, beefCowsM: 31.2, confidence: "disclosed" },
  { year: 2022, allCattleM: 91.9, beefCowsM: 30.1, confidence: "disclosed" },
  { year: 2023, allCattleM: 88.8, beefCowsM: 28.9, confidence: "disclosed" },
  { year: 2024, allCattleM: 87.2, beefCowsM: 28.2, confidence: "disclosed" },
  { year: 2025, allCattleM: 86.5, beefCowsM: 27.9, confidence: "disclosed" },
  { year: 2026, allCattleM: 86.2, beefCowsM: 27.6, confidence: "disclosed", note: "75-year low (all cattle)" },
];

/** Annual price + inventory overlay for dual-axis charts. */
export const HERD_VS_PRICE: {
  year: number;
  allCattleM: number;
  beefCowsM: number;
  choiceCutoutUsdCwt: number;
  allFreshRetailUsdLb: number;
  cutoutConfidence: Confidence;
  retailConfidence: Confidence;
}[] = [
  {
    year: 2014,
    allCattleM: 88.5,
    beefCowsM: 29.0,
    choiceCutoutUsdCwt: 248,
    allFreshRetailUsdLb: 5.6,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2015,
    allCattleM: 89.1,
    beefCowsM: 29.3,
    choiceCutoutUsdCwt: 230,
    allFreshRetailUsdLb: 6.04,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2016,
    allCattleM: 91.9,
    beefCowsM: 30.1,
    choiceCutoutUsdCwt: 198,
    allFreshRetailUsdLb: 5.74,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2017,
    allCattleM: 93.6,
    beefCowsM: 31.2,
    choiceCutoutUsdCwt: 208,
    allFreshRetailUsdLb: 5.65,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2018,
    allCattleM: 94.4,
    beefCowsM: 31.7,
    choiceCutoutUsdCwt: 214,
    allFreshRetailUsdLb: 5.69,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2019,
    allCattleM: 94.8,
    beefCowsM: 31.7,
    choiceCutoutUsdCwt: 228,
    allFreshRetailUsdLb: 5.82,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2020,
    allCattleM: 93.8,
    beefCowsM: 31.3,
    choiceCutoutUsdCwt: 232,
    allFreshRetailUsdLb: 6.39,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2021,
    allCattleM: 93.6,
    beefCowsM: 31.2,
    choiceCutoutUsdCwt: 255,
    allFreshRetailUsdLb: 6.95,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2022,
    allCattleM: 91.9,
    beefCowsM: 30.1,
    choiceCutoutUsdCwt: 258,
    allFreshRetailUsdLb: 7.3,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2023,
    allCattleM: 88.8,
    beefCowsM: 28.9,
    choiceCutoutUsdCwt: 285,
    allFreshRetailUsdLb: 7.6,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2024,
    allCattleM: 87.2,
    beefCowsM: 28.2,
    choiceCutoutUsdCwt: 305,
    allFreshRetailUsdLb: 8.01,
    cutoutConfidence: "carried",
    retailConfidence: "disclosed",
  },
  {
    year: 2025,
    allCattleM: 86.5,
    beefCowsM: 27.9,
    choiceCutoutUsdCwt: 328,
    allFreshRetailUsdLb: 8.55,
    cutoutConfidence: "estimated",
    retailConfidence: "estimated",
  },
  {
    year: 2026,
    allCattleM: 86.2,
    beefCowsM: 27.6,
    choiceCutoutUsdCwt: 355,
    allFreshRetailUsdLb: 8.85,
    cutoutConfidence: "estimated",
    retailConfidence: "estimated",
  },
];

/** Jan 1, 2026 class stack (million head). */
export const CLASS_STACK: {
  id: string;
  label: string;
  mHead: number;
  yoyPct: number;
  confidence: Confidence;
}[] = [
  { id: "beef-cows", label: "Beef cows", mHead: 27.6, yoyPct: -1.0, confidence: "disclosed" },
  { id: "milk-cows", label: "Milk cows", mHead: 9.57, yoyPct: 2.0, confidence: "disclosed" },
  { id: "beef-repl", label: "Beef replacement heifers", mHead: 4.71, yoyPct: 1.0, confidence: "disclosed" },
  { id: "milk-repl", label: "Milk replacement heifers", mHead: 3.9, yoyPct: 0.0, confidence: "disclosed" },
  { id: "other-heifers", label: "Other heifers 500+ lb", mHead: 9.4, yoyPct: -2.0, confidence: "disclosed" },
  { id: "steers", label: "Steers 500+ lb", mHead: 15.6, yoyPct: -1.0, confidence: "disclosed" },
  { id: "on-feed", label: "Cattle on feed", mHead: 13.8, yoyPct: -3.0, confidence: "disclosed" },
  { id: "calf-crop", label: "Calf crop (2025)", mHead: 32.9, yoyPct: -2.0, confidence: "disclosed" },
];

/** Drought exposure path — share of US cattle inventory in drought (%). Estimated. */
export const DROUGHT_PATH: {
  year: number;
  droughtSharePct: number;
  beefCowChangeM: number;
  confidence: Confidence;
}[] = [
  { year: 2018, droughtSharePct: 18, beefCowChangeM: 0.5, confidence: "estimated" },
  { year: 2019, droughtSharePct: 12, beefCowChangeM: 0.0, confidence: "estimated" },
  { year: 2020, droughtSharePct: 22, beefCowChangeM: -0.4, confidence: "estimated" },
  { year: 2021, droughtSharePct: 38, beefCowChangeM: -0.1, confidence: "estimated" },
  { year: 2022, droughtSharePct: 55, beefCowChangeM: -1.1, confidence: "estimated" },
  { year: 2023, droughtSharePct: 48, beefCowChangeM: -1.2, confidence: "estimated" },
  { year: 2024, droughtSharePct: 40, beefCowChangeM: -0.7, confidence: "estimated" },
  { year: 2025, droughtSharePct: 36, beefCowChangeM: -0.3, confidence: "estimated" },
  { year: 2026, droughtSharePct: 34, beefCowChangeM: -0.3, confidence: "estimated" },
];

/** Top cattle states under drought stress (analytical share of national beef cows). */
export const STATE_DROUGHT: {
  state: string;
  beefCowSharePct: number;
  droughtSeverity: "moderate" | "severe" | "extreme";
  pastureStress: number;
  confidence: Confidence;
}[] = [
  { state: "Texas", beefCowSharePct: 13.2, droughtSeverity: "severe", pastureStress: 72, confidence: "estimated" },
  { state: "Oklahoma", beefCowSharePct: 5.8, droughtSeverity: "severe", pastureStress: 68, confidence: "estimated" },
  { state: "Missouri", beefCowSharePct: 5.4, droughtSeverity: "moderate", pastureStress: 55, confidence: "estimated" },
  { state: "Nebraska", beefCowSharePct: 5.1, droughtSeverity: "moderate", pastureStress: 48, confidence: "estimated" },
  { state: "South Dakota", beefCowSharePct: 4.6, droughtSeverity: "moderate", pastureStress: 52, confidence: "estimated" },
  { state: "Kansas", beefCowSharePct: 4.3, droughtSeverity: "severe", pastureStress: 61, confidence: "estimated" },
  { state: "Montana", beefCowSharePct: 3.9, droughtSeverity: "moderate", pastureStress: 44, confidence: "estimated" },
  { state: "Kentucky", beefCowSharePct: 3.5, droughtSeverity: "moderate", pastureStress: 41, confidence: "estimated" },
];

/** Rebuild signal ladder — early expansion cues vs still-tight stock. */
export const REBUILD_SIGNALS: {
  id: string;
  label: string;
  value: number;
  unit: string;
  direction: "expansion" | "contraction" | "mixed";
  confidence: Confidence;
  note: string;
}[] = [
  {
    id: "beef-repl-yoy",
    label: "Beef replacement heifers YoY",
    value: 1.0,
    unit: "%",
    direction: "expansion",
    confidence: "disclosed",
    note: "First positive print after multi-year cuts",
  },
  {
    id: "expected-calve",
    label: "Beef heifers expected to calve YoY",
    value: 1.0,
    unit: "%",
    direction: "expansion",
    confidence: "disclosed",
    note: "Retention cue, not yet herd growth",
  },
  {
    id: "beef-cow-yoy",
    label: "Beef cow inventory YoY",
    value: -1.0,
    unit: "%",
    direction: "contraction",
    confidence: "disclosed",
    note: "Still liquidating breeding stock",
  },
  {
    id: "calf-crop-yoy",
    label: "Calf crop YoY",
    value: -2.0,
    unit: "%",
    direction: "contraction",
    confidence: "disclosed",
    note: "Pipeline stays tight into 2027–28 beef",
  },
  {
    id: "cow-slaughter",
    label: "Prior-year beef cow slaughter change",
    value: -18,
    unit: "%",
    direction: "mixed",
    confidence: "carried",
    note: "Slaughter slowed; inventory still edged down",
  },
  {
    id: "on-feed-yoy",
    label: "Cattle on feed YoY",
    value: -3.0,
    unit: "%",
    direction: "contraction",
    confidence: "disclosed",
    note: "Near-term fed supply thinner",
  },
];

/** Farm → wholesale → retail ladder ($ equivalent units noted). */
export const PRICE_LADDER: {
  year: number;
  fedSteerUsdCwt: number;
  choiceCutoutUsdCwt: number;
  allFreshRetailUsdLb: number;
  confidence: Confidence;
}[] = [
  { year: 2019, fedSteerUsdCwt: 117, choiceCutoutUsdCwt: 228, allFreshRetailUsdLb: 5.82, confidence: "carried" },
  { year: 2020, fedSteerUsdCwt: 108, choiceCutoutUsdCwt: 232, allFreshRetailUsdLb: 6.39, confidence: "carried" },
  { year: 2021, fedSteerUsdCwt: 122, choiceCutoutUsdCwt: 255, allFreshRetailUsdLb: 6.95, confidence: "carried" },
  { year: 2022, fedSteerUsdCwt: 138, choiceCutoutUsdCwt: 258, allFreshRetailUsdLb: 7.3, confidence: "carried" },
  { year: 2023, fedSteerUsdCwt: 175, choiceCutoutUsdCwt: 285, allFreshRetailUsdLb: 7.6, confidence: "carried" },
  { year: 2024, fedSteerUsdCwt: 188, choiceCutoutUsdCwt: 305, allFreshRetailUsdLb: 8.01, confidence: "carried" },
  { year: 2025, fedSteerUsdCwt: 230, choiceCutoutUsdCwt: 328, allFreshRetailUsdLb: 8.55, confidence: "estimated" },
  { year: 2026, fedSteerUsdCwt: 238, choiceCutoutUsdCwt: 355, allFreshRetailUsdLb: 8.85, confidence: "estimated" },
];

/** Scatter: inventory vs retail for cycle geometry. */
export const INVENTORY_PRICE_SCATTER = HERD_VS_PRICE.map((r) => ({
  year: r.year,
  herdM: r.allCattleM,
  retail: r.allFreshRetailUsdLb,
  cutout: r.choiceCutoutUsdCwt,
}));

export function fmtM(n: number, digits = 1): string {
  return `${n.toFixed(digits)}M`;
}

export function fmtPct(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtUsd(n: number, digits = 0): string {
  return `$${n.toFixed(digits)}`;
}

export function herdSeries(mode: SeriesMode) {
  return HERD_PATH.map((r) => ({
    year: r.year,
    head: mode === "allCattle" ? r.allCattleM : r.beefCowsM,
    note: r.note,
  }));
}

export function overlaySeries(mode: SeriesMode, price: PriceMode) {
  return HERD_VS_PRICE.map((r) => ({
    year: r.year,
    herd: mode === "allCattle" ? r.allCattleM : r.beefCowsM,
    price: price === "cutout" ? r.choiceCutoutUsdCwt : r.allFreshRetailUsdLb,
  }));
}
