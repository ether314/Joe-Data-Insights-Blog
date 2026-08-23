/**
 * Cement clinker process CO₂ by country (2026 desk).
 *
 * Core question: What share of global cement *process* CO₂ sits in the
 * top three producers, and did intensity fall or did volume swamp it?
 *
 * Anchors: USGS Mineral Commodity Summaries (cement production by
 * country); IEA cement tracking / industry CO₂ notes; GCCA GNR
 * (Getting the Numbers Right) intensity and clinker-ratio trends;
 * IPCC default process factor ~0.52 t CO₂ / t clinker applied to
 * desk clinker estimates. Process = calcination CO₂ only (not kiln
 * fuel). Country process Mt are analytical reconstructions, not
 * plant-level inventories.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Country cement tonnages lean on USGS Mineral Commodity Summaries (cement). Process CO₂ is reconstructed as estimated clinker × ~0.52 t CO₂/t clinker (IPCC-style calcination factor), cross-checked to Global Carbon Project / Our World in Data cement-process series and IEA industry-process framing. GCCA GNR supplies industry-reported intensity and clinker-to-cementitious trends (member coverage uneven; China coverage historically thin). Figures are desk estimates for 2023e unless noted — not national inventory submissions. Shares and HHI are analytical.";

export const SOURCES = [
  {
    label: "USGS MCS — Cement",
    url: "https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-cement.pdf",
  },
  {
    label: "IEA — Cement tracking / industry CO₂",
    url: "https://www.iea.org/energy-system/industry/cement",
  },
  {
    label: "GCCA — GNR (Getting the Numbers Right)",
    url: "https://gccassociation.org/gnr/",
  },
  {
    label: "GCCA — 25% CO₂ intensity cut since 1990 (2023 GNR)",
    url: "https://gccassociation.org/news/global-cement-industry-reports-25-co2-intensity-reduction-and-calls-for-urgent-government-action-to-accelerate-net-zero-mission/",
  },
  {
    label: "IPCC — mineral industry process emissions (clinker)",
    url: "https://www.ipcc-nggip.iges.or.jp/public/2006gl/pdf/3_Volume3/V3_2_Ch2_Mineral_Industry.pdf",
  },
] as const;

/** Headline punchline — top-3 process CO₂ share */
export const HEADLINE = {
  year: 2023,
  globalProcessMt: 1485,
  top3ProcessMt: 912,
  top3SharePct: 61.4,
  chinaProcessMt: 718,
  indiaProcessMt: 152,
  vietnamProcessMt: 42,
  chinaSharePct: 48.4,
  indiaSharePct: 10.2,
  vietnamSharePct: 2.8,
  gccaIntensityCutPctSince1990: 25,
  gccaClinkerRatioImprovePct: 10.7,
  processShareOfCementCo2Pct: 60,
  intensityIndex1990: 100,
  intensityIndex2023: 75,
  volumeIndex1990: 100,
  volumeIndex2023: 285,
} as const;

export type CountryId =
  | "china"
  | "india"
  | "vietnam"
  | "usa"
  | "indonesia"
  | "turkey"
  | "brazil"
  | "iran"
  | "russia"
  | "japan"
  | "egypt"
  | "korea"
  | "saudi"
  | "mexico"
  | "other";

export type CountryProcessRow = {
  id: CountryId;
  label: string;
  cementMt: number;
  clinkerRatio: number;
  processMt: number;
  intensityKgPerTCement: number;
  confidence: Confidence;
  region: "asia" | "americas" | "emea" | "other";
};

/**
 * 2023e desk table. Cement Mt ≈ USGS-order magnitudes.
 * Process Mt ≈ cement × clinker ratio × 0.52, rounded; China
 * pinned near GCP/OWID cement-process (~718 Mt).
 */
export const COUNTRY_PROCESS_2023: CountryProcessRow[] = [
  {
    id: "china",
    label: "China",
    cementMt: 2030,
    clinkerRatio: 0.68,
    processMt: 718,
    intensityKgPerTCement: 354,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "india",
    label: "India",
    cementMt: 395,
    clinkerRatio: 0.74,
    processMt: 152,
    intensityKgPerTCement: 385,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "vietnam",
    label: "Vietnam",
    cementMt: 98,
    clinkerRatio: 0.82,
    processMt: 42,
    intensityKgPerTCement: 429,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "usa",
    label: "United States",
    cementMt: 92,
    clinkerRatio: 0.88,
    processMt: 42,
    intensityKgPerTCement: 457,
    confidence: "estimated",
    region: "americas",
  },
  {
    id: "indonesia",
    label: "Indonesia",
    cementMt: 68,
    clinkerRatio: 0.8,
    processMt: 28,
    intensityKgPerTCement: 412,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "turkey",
    label: "Türkiye",
    cementMt: 78,
    clinkerRatio: 0.82,
    processMt: 33,
    intensityKgPerTCement: 423,
    confidence: "estimated",
    region: "emea",
  },
  {
    id: "brazil",
    label: "Brazil",
    cementMt: 62,
    clinkerRatio: 0.72,
    processMt: 23,
    intensityKgPerTCement: 371,
    confidence: "estimated",
    region: "americas",
  },
  {
    id: "iran",
    label: "Iran",
    cementMt: 62,
    clinkerRatio: 0.9,
    processMt: 29,
    intensityKgPerTCement: 468,
    confidence: "carried",
    region: "emea",
  },
  {
    id: "russia",
    label: "Russia",
    cementMt: 55,
    clinkerRatio: 0.85,
    processMt: 24,
    intensityKgPerTCement: 436,
    confidence: "carried",
    region: "emea",
  },
  {
    id: "japan",
    label: "Japan",
    cementMt: 48,
    clinkerRatio: 0.8,
    processMt: 20,
    intensityKgPerTCement: 417,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "egypt",
    label: "Egypt",
    cementMt: 52,
    clinkerRatio: 0.86,
    processMt: 23,
    intensityKgPerTCement: 442,
    confidence: "estimated",
    region: "emea",
  },
  {
    id: "korea",
    label: "South Korea",
    cementMt: 48,
    clinkerRatio: 0.84,
    processMt: 21,
    intensityKgPerTCement: 438,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "saudi",
    label: "Saudi Arabia",
    cementMt: 55,
    clinkerRatio: 0.88,
    processMt: 25,
    intensityKgPerTCement: 455,
    confidence: "estimated",
    region: "emea",
  },
  {
    id: "mexico",
    label: "Mexico",
    cementMt: 42,
    clinkerRatio: 0.82,
    processMt: 18,
    intensityKgPerTCement: 429,
    confidence: "estimated",
    region: "americas",
  },
  {
    id: "other",
    label: "Rest of world",
    cementMt: 720,
    clinkerRatio: 0.78,
    processMt: 287,
    intensityKgPerTCement: 399,
    confidence: "carried",
    region: "other",
  },
];

/** Cumulative share ladder for concentration panel */
export const SHARE_LADDER = [
  { rank: 1, label: "China only", sharePct: 48.4 },
  { rank: 2, label: "Top 2 (+ India)", sharePct: 58.6 },
  { rank: 3, label: "Top 3 (+ Vietnam)", sharePct: 61.4 },
  { rank: 5, label: "Top 5", sharePct: 68.8 },
  { rank: 10, label: "Top 10", sharePct: 80.2 },
] as const;

/** Intensity vs volume indices (1990 = 100) — GCCA intensity + USGS-order volume */
export const INTENSITY_VS_VOLUME = [
  { year: 1990, intensityIndex: 100, volumeIndex: 100, processMtIndex: 100 },
  { year: 2000, intensityIndex: 94, volumeIndex: 145, processMtIndex: 136 },
  { year: 2005, intensityIndex: 90, volumeIndex: 195, processMtIndex: 176 },
  { year: 2010, intensityIndex: 86, volumeIndex: 255, processMtIndex: 219 },
  { year: 2015, intensityIndex: 82, volumeIndex: 295, processMtIndex: 242 },
  { year: 2019, intensityIndex: 79, volumeIndex: 310, processMtIndex: 245 },
  { year: 2021, intensityIndex: 77, volumeIndex: 305, processMtIndex: 235 },
  { year: 2023, intensityIndex: 75, volumeIndex: 285, processMtIndex: 214 },
] as const;

/** Regional process CO₂ shares (2023e) */
export const REGION_PROCESS = [
  { id: "asia", label: "Asia-Pacific", processMt: 981, sharePct: 66.1 },
  { id: "emea", label: "Europe / ME / Africa", processMt: 134, sharePct: 9.0 },
  { id: "americas", label: "Americas", processMt: 83, sharePct: 5.6 },
  { id: "other", label: "Other / residual", processMt: 287, sharePct: 19.3 },
] as const;

/** Clinker ratio path — GCCA-style improvement framing */
export const CLINKER_RATIO_PATH = [
  { year: 1990, ratioPct: 83.5, note: "GNR-era reference" },
  { year: 2000, ratioPct: 81.2, note: "Early blending gains" },
  { year: 2010, ratioPct: 77.8, note: "SCM uptake" },
  { year: 2015, ratioPct: 75.4, note: "China blend shift begins" },
  { year: 2020, ratioPct: 74.1, note: "Pandemic trough volume" },
  { year: 2023, ratioPct: 74.6, note: "~10.7% relative cut vs 1990" },
] as const;

/** Scatter: process Mt vs intensity for named producers (excl. other) */
export type ScatterPoint = {
  id: CountryId;
  label: string;
  processMt: number;
  intensityKgPerTCement: number;
  cementMt: number;
};

export function scatterPoints(): ScatterPoint[] {
  return COUNTRY_PROCESS_2023.filter((r) => r.id !== "other").map((r) => ({
    id: r.id,
    label: r.label,
    processMt: r.processMt,
    intensityKgPerTCement: r.intensityKgPerTCement,
    cementMt: r.cementMt,
  }));
}

export type RankLens = "process" | "cement" | "intensity";
export type RegionFilter = "all" | "asia" | "americas" | "emea";

export function rankedCountries(
  lens: RankLens,
  region: RegionFilter,
): CountryProcessRow[] {
  const rows = COUNTRY_PROCESS_2023.filter((r) => {
    if (r.id === "other") return false;
    if (region === "all") return true;
    return r.region === region;
  });
  const sorted = [...rows];
  if (lens === "process") sorted.sort((a, b) => b.processMt - a.processMt);
  else if (lens === "cement") sorted.sort((a, b) => b.cementMt - a.cementMt);
  else sorted.sort((a, b) => b.intensityKgPerTCement - a.intensityKgPerTCement);
  return sorted;
}

export function topNShare(n: number): number {
  const named = COUNTRY_PROCESS_2023.filter((r) => r.id !== "other").sort(
    (a, b) => b.processMt - a.processMt,
  );
  const sum = named.slice(0, n).reduce((s, r) => s + r.processMt, 0);
  return Math.round((1000 * sum) / HEADLINE.globalProcessMt) / 10;
}

export function processHhi(): number {
  const shares = COUNTRY_PROCESS_2023.map(
    (r) => (100 * r.processMt) / HEADLINE.globalProcessMt,
  );
  return Math.round(shares.reduce((s, p) => s + p * p, 0));
}

export function fmtMt(n: number): string {
  if (n >= 100) return `${Math.round(n)} Mt`;
  if (n >= 10) return `${n.toFixed(0)} Mt`;
  return `${n.toFixed(1)} Mt`;
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

/** Smoke / QA visible markers */
export const VIZ_MARKERS = [
  "Heavy materials · clinker process CO₂",
  "Top-3 process CO₂ share",
] as const;

export const SCOREBOARD = [
  {
    metric: "Global process CO₂ (2023e)",
    value: `${HEADLINE.globalProcessMt} Mt`,
    why: "Calcination only; fuel excluded",
  },
  {
    metric: "Top-3 process share",
    value: `${HEADLINE.top3SharePct}%`,
    why: "China + India + Vietnam",
  },
  {
    metric: "China process CO₂",
    value: `${HEADLINE.chinaProcessMt} Mt`,
    why: `${HEADLINE.chinaSharePct}% of world process`,
  },
  {
    metric: "GCCA intensity vs 1990",
    value: `−${HEADLINE.gccaIntensityCutPctSince1990}%`,
    why: "GNR cementitious CO₂/t (member set)",
  },
  {
    metric: "Clinker ratio vs 1990",
    value: `−${HEADLINE.gccaClinkerRatioImprovePct}% rel.`,
    why: "Blending / SCM path in GNR",
  },
  {
    metric: "Process share of cement CO₂",
    value: `~${HEADLINE.processShareOfCementCo2Pct}%`,
    why: "Hard-to-abate chemistry residual",
  },
] as const;
