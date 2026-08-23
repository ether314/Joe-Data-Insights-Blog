/**
 * FAO capture vs aquaculture tonnage — regional majority map (SOFIA 2024 / FishStat).
 * Core question: Where does wild capture still dominate edible aquatic-animal supply,
 * and where has aquaculture already taken the majority?
 *
 * Vintage: FAO SOFIA 2024 (reference year 2022 aquatic animals, live-weight Mt).
 * Algae excluded from animal ledgers unless noted. Shares from SOFIA regional tables /
 * projections chapter; tonnages derived from disclosed world total × regional share ×
 * aquaculture share (rounding ±0.2 Mt).
 */

export type Confidence = "disclosed" | "derived" | "projected";
export type Regime = "aqua-majority" | "capture-majority" | "near-parity";

export const SOURCE_NOTE =
  "Aquatic-animal production from FAO The State of World Fisheries and Aquaculture 2024 (SOFIA), reference year 2022, live-weight million tonnes. World totals and aquaculture shares by continent are disclosed; regional capture/aqua tonnages are derived from total × regional share × aquaculture share and may not sum exactly to 185.4 Mt because of rounding. 2032 shares are FAO FishStat outlook projections in SOFIA Part 3. Edible / human-consumption share (57% aquaculture of food-destined volume) is SOFIA-disclosed and differs from raw production share (51%).";

export const SOFIA_2024_URL =
  "https://www.fao.org/publications/home/fao-flagship-publications/the-state-of-world-fisheries-and-aquaculture/en";
export const FISHSTAT_URL = "https://www.fao.org/fishery/en/fishstat";

/** Headline meters for cards, lede, and job ready line */
export const HEADLINE = {
  worldAquaSharePct: 51,
  worldCaptureSharePct: 49,
  worldAquaMt: 94.4,
  worldCaptureMt: 91.0,
  worldTotalMt: 185.4,
  edibleAquaSharePct: 57,
  asiaAquaSharePct: 64,
  northernAmericaAquaSharePct: 11,
  africaAquaSharePct: 18,
  aquaMajorityRegionCount: 1,
  captureMajorityRegionCount: 5,
  crossoverYear: 2022,
  outlook2032AquaSharePct: 54,
} as const;

export type RegionId =
  | "asia"
  | "africa"
  | "europe"
  | "lac"
  | "northern-america"
  | "oceania"
  | "world";

export type RegionRow = {
  id: RegionId;
  label: string;
  shortLabel: string;
  /** Share of world aquatic-animal tonnage, 2022 */
  worldSharePct: number;
  totalMt: number;
  aquaMt: number;
  captureMt: number;
  aquaSharePct: number;
  aquaShare2032Pct: number;
  regime: Regime;
  confidence: Confidence;
  fill: string;
  note?: string;
};

const FILL = {
  aqua: "#0ea5e9",
  capture: "#0369a1",
  asia: "#06b6d4",
  africa: "#f59e0b",
  europe: "#8b5cf6",
  lac: "#34d399",
  northernAmerica: "#64748b",
  oceania: "#f472b6",
  world: "#1e293b",
} as const;

/**
 * Regional aquatic-animal ledgers, 2022.
 * World shares: Asia 70, Europe 9, LAC 9, Africa 7, N. America 3, Oceania 1 (SOFIA).
 * Aqua shares: Asia 64, Africa 18, Europe 20, LAC 25, N. America 11, Oceania 13 (SOFIA Fig. 67).
 */
export const REGION_ROWS: RegionRow[] = [
  {
    id: "asia",
    label: "Asia",
    shortLabel: "Asia",
    worldSharePct: 70,
    totalMt: 129.8,
    aquaMt: 83.1,
    captureMt: 46.7,
    aquaSharePct: 64,
    aquaShare2032Pct: 67,
    regime: "aqua-majority",
    confidence: "derived",
    fill: FILL.asia,
    note: "Only continent where farmed animals already exceed half of regional output. Excluding China, Asia aqua share falls to ~47% (SOFIA).",
  },
  {
    id: "lac",
    label: "Latin America & Caribbean",
    shortLabel: "LAC",
    worldSharePct: 9,
    totalMt: 16.7,
    aquaMt: 4.2,
    captureMt: 12.5,
    aquaSharePct: 25,
    aquaShare2032Pct: 26,
    regime: "capture-majority",
    confidence: "derived",
    fill: FILL.lac,
    note: "Anchoveta and other marine landings keep capture dominant despite Chile/Ecuador farm growth.",
  },
  {
    id: "europe",
    label: "Europe",
    shortLabel: "Europe",
    worldSharePct: 9,
    totalMt: 16.7,
    aquaMt: 3.3,
    captureMt: 13.4,
    aquaSharePct: 20,
    aquaShare2032Pct: 21,
    regime: "capture-majority",
    confidence: "derived",
    fill: FILL.europe,
    note: "Norway salmon is large in value; volume ledger remains capture-heavy across the continent.",
  },
  {
    id: "africa",
    label: "Africa",
    shortLabel: "Africa",
    worldSharePct: 7,
    totalMt: 13.0,
    aquaMt: 2.3,
    captureMt: 10.7,
    aquaSharePct: 18,
    aquaShare2032Pct: 22,
    regime: "capture-majority",
    confidence: "derived",
    fill: FILL.africa,
    note: "Egypt dominates continental farm output; inland capture still critical for food security.",
  },
  {
    id: "northern-america",
    label: "Northern America",
    shortLabel: "N. America",
    worldSharePct: 3,
    totalMt: 5.6,
    aquaMt: 0.6,
    captureMt: 5.0,
    aquaSharePct: 11,
    aquaShare2032Pct: 11,
    regime: "capture-majority",
    confidence: "derived",
    fill: FILL.northernAmerica,
    note: "Lowest aquaculture share among major regions; FAO outlook holds ~11% through 2032.",
  },
  {
    id: "oceania",
    label: "Oceania",
    shortLabel: "Oceania",
    worldSharePct: 1,
    totalMt: 1.9,
    aquaMt: 0.2,
    captureMt: 1.6,
    aquaSharePct: 13,
    aquaShare2032Pct: 15,
    regime: "capture-majority",
    confidence: "derived",
    fill: FILL.oceania,
  },
];

export const WORLD_ROW: RegionRow = {
  id: "world",
  label: "World",
  shortLabel: "World",
  worldSharePct: 100,
  totalMt: 185.4,
  aquaMt: 94.4,
  captureMt: 91.0,
  aquaSharePct: 51,
  aquaShare2032Pct: 54,
  regime: "aqua-majority",
  confidence: "disclosed",
  fill: FILL.world,
  note: "First year aquaculture aquatic animals surpassed capture (SOFIA 2024).",
};

/** World aquaculture share path (SOFIA narrative milestones + disclosed 2022). */
export type SharePathPoint = {
  year: number;
  aquaSharePct: number;
  confidence: Confidence;
  label?: string;
};

export const WORLD_AQUA_SHARE_PATH: SharePathPoint[] = [
  { year: 1950, aquaSharePct: 4, confidence: "disclosed", label: "4–5% era" },
  { year: 1970, aquaSharePct: 5, confidence: "disclosed" },
  { year: 1980, aquaSharePct: 9, confidence: "derived" },
  { year: 1990, aquaSharePct: 20, confidence: "disclosed" },
  { year: 2000, aquaSharePct: 27, confidence: "derived" },
  { year: 2010, aquaSharePct: 40, confidence: "derived" },
  { year: 2015, aquaSharePct: 44, confidence: "disclosed", label: "2010s ~44%" },
  { year: 2020, aquaSharePct: 49, confidence: "derived" },
  { year: 2022, aquaSharePct: 51, confidence: "disclosed", label: "Crossover" },
  { year: 2032, aquaSharePct: 54, confidence: "projected", label: "FAO outlook" },
];

/** Regional aqua-share path for selected continents (2000 / 2010 / 2022 / 2032). */
export type RegionSharePath = {
  year: number;
  asia: number;
  africa: number;
  europe: number;
  lac: number;
  northernAmerica: number;
  oceania: number;
};

export const REGION_AQUA_SHARE_PATH: RegionSharePath[] = [
  {
    year: 2000,
    asia: 42,
    africa: 8,
    europe: 14,
    lac: 12,
    northernAmerica: 8,
    oceania: 9,
  },
  {
    year: 2010,
    asia: 54,
    africa: 12,
    europe: 17,
    lac: 18,
    northernAmerica: 9,
    oceania: 11,
  },
  {
    year: 2022,
    asia: 64,
    africa: 18,
    europe: 20,
    lac: 25,
    northernAmerica: 11,
    oceania: 13,
  },
  {
    year: 2032,
    asia: 67,
    africa: 22,
    europe: 21,
    lac: 26,
    northernAmerica: 11,
    oceania: 15,
  },
];

export type HabitatSplit = {
  id: string;
  label: string;
  aquaMt: number;
  captureMt: number;
  aquaSharePct: number;
  note: string;
};

/** Marine vs inland habitat split (SOFIA 2022 aquatic animals). */
export const HABITAT_SPLIT: HabitatSplit[] = [
  {
    id: "marine",
    label: "Marine areas",
    aquaMt: 35.6,
    captureMt: 80.0,
    aquaSharePct: 31,
    note: "62% of aquatic animals; capture still 69% of the marine ledger.",
  },
  {
    id: "inland",
    label: "Inland waters",
    aquaMt: 58.8,
    captureMt: 11.3,
    aquaSharePct: 84,
    note: "38% of aquatic animals; inland aquaculture supplies 84% of the inland ledger.",
  },
];

export type ProducerRow = {
  id: string;
  country: string;
  regionId: RegionId;
  worldSharePct: number;
  /** Rough aqua share of that country’s aquatic-animal output (FishStat-informed estimates). */
  aquaSharePct: number;
  regime: Regime;
  confidence: Confidence;
  fill: string;
};

export const TOP_PRODUCERS: ProducerRow[] = [
  {
    id: "chn",
    country: "China",
    regionId: "asia",
    worldSharePct: 36,
    aquaSharePct: 78,
    regime: "aqua-majority",
    confidence: "derived",
    fill: "#f43f5e",
  },
  {
    id: "ind",
    country: "India",
    regionId: "asia",
    worldSharePct: 8,
    aquaSharePct: 72,
    regime: "aqua-majority",
    confidence: "derived",
    fill: "#f59e0b",
  },
  {
    id: "idn",
    country: "Indonesia",
    regionId: "asia",
    worldSharePct: 7,
    aquaSharePct: 55,
    regime: "aqua-majority",
    confidence: "derived",
    fill: "#0ea5e9",
  },
  {
    id: "vnm",
    country: "Viet Nam",
    regionId: "asia",
    worldSharePct: 5,
    aquaSharePct: 68,
    regime: "aqua-majority",
    confidence: "derived",
    fill: "#14b8a6",
  },
  {
    id: "per",
    country: "Peru",
    regionId: "lac",
    worldSharePct: 3,
    aquaSharePct: 5,
    regime: "capture-majority",
    confidence: "derived",
    fill: "#a78bfa",
  },
  {
    id: "usa",
    country: "United States",
    regionId: "northern-america",
    worldSharePct: 2.4,
    aquaSharePct: 12,
    regime: "capture-majority",
    confidence: "derived",
    fill: "#38bdf8",
  },
  {
    id: "rus",
    country: "Russian Federation",
    regionId: "europe",
    worldSharePct: 2.6,
    aquaSharePct: 8,
    regime: "capture-majority",
    confidence: "derived",
    fill: "#64748b",
  },
  {
    id: "nor",
    country: "Norway",
    regionId: "europe",
    worldSharePct: 1.5,
    aquaSharePct: 70,
    regime: "aqua-majority",
    confidence: "derived",
    fill: "#22d3ee",
  },
];

export type SpeciesMix = {
  id: string;
  label: string;
  shareOfAquaGrowthPct: number;
  fill: string;
};

/** Composition of 2020→2022 aquaculture animal increase (SOFIA). */
export const AQUA_GROWTH_MIX: SpeciesMix[] = [
  { id: "finfish", label: "Finfish", shareOfAquaGrowthPct: 58.1, fill: "#0ea5e9" },
  {
    id: "crustaceans",
    label: "Crustaceans",
    shareOfAquaGrowthPct: 24.6,
    fill: "#f59e0b",
  },
  { id: "molluscs", label: "Molluscs", shareOfAquaGrowthPct: 15.6, fill: "#34d399" },
  { id: "other", label: "Other", shareOfAquaGrowthPct: 1.7, fill: "#94a3b8" },
];

export const COLORS = FILL;

export function fmtMt(n: number, digits = 1): string {
  return `${n.toFixed(digits)} Mt`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function regimeLabel(r: Regime): string {
  if (r === "aqua-majority") return "Aquaculture majority";
  if (r === "capture-majority") return "Capture majority";
  return "Near parity";
}

export function stackedRegionBars(rows: RegionRow[] = REGION_ROWS) {
  return rows.map((r) => ({
    id: r.id,
    label: r.shortLabel,
    aquaMt: r.aquaMt,
    captureMt: r.captureMt,
    totalMt: r.totalMt,
    aquaSharePct: r.aquaSharePct,
    regime: r.regime,
    fill: r.fill,
  }));
}

export function aquaShareCompare(
  rows: RegionRow[] = REGION_ROWS,
  includeWorld = true,
) {
  const base = includeWorld ? [WORLD_ROW, ...rows] : rows;
  return base.map((r) => ({
    id: r.id,
    label: r.shortLabel,
    aquaShare2022: r.aquaSharePct,
    aquaShare2032: r.aquaShare2032Pct,
    deltaPp: +(r.aquaShare2032Pct - r.aquaSharePct).toFixed(1),
    fill: r.fill,
  }));
}

export function habitatStacked() {
  return HABITAT_SPLIT.map((h) => ({
    id: h.id,
    label: h.label,
    aquaMt: h.aquaMt,
    captureMt: h.captureMt,
    aquaSharePct: h.aquaSharePct,
  }));
}

export function producerScatter(rows: ProducerRow[] = TOP_PRODUCERS) {
  return rows.map((p) => ({
    id: p.id,
    country: p.country,
    worldSharePct: p.worldSharePct,
    aquaSharePct: p.aquaSharePct,
    regime: p.regime,
    fill: p.fill,
    z: Math.max(40, p.worldSharePct * 12),
  }));
}
