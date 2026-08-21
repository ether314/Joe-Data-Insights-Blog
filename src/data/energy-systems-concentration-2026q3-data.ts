/**
 * Energy systems — Q3 2026 concentration / market-share lens.
 *
 * Core question: How concentrated is this system at the top of the distribution?
 * (How do countries source, mix, and trade energy?)
 *
 * Complements energy-systems-concentration-2026 (2024 EI share tape) by
 * re-scoring Top-1 / Top-3 / HHI after Ember Global Electricity Review 2026,
 * IEA World Energy Investment 2026, and IEA Electricity Mid-Year Update 2026
 * (Hormuz / LNG shock into wholesale prices and coal rebound).
 */

export type Confidence = "disclosed" | "estimated" | "secondary";
export type Lens =
  | "demand"
  | "export"
  | "production"
  | "manufacturing"
  | "investment"
  | "import-exposure";
export type Region =
  | "North America"
  | "Europe"
  | "Asia-Pacific"
  | "Middle East"
  | "Latin America"
  | "Eurasia"
  | "Africa"
  | "Global";

export const SOURCE_NOTE =
  "Q3 concentration lens after Ember Global Electricity Review 2026 (2025 power census), IEA World Energy Investment 2026 (2026e capital), and IEA Electricity Mid-Year Update 2026 (H1/2026–27 outlook under Hormuz LNG shock). Primary-energy demand shares and fossil trade volumes carry Energy Institute Statistical Review framing (2024/2025 vintages as labeled). Solar PV / battery manufacturing shares remain IEA supply-chain secondary prints. Top-k and HHI are derived from rounded country shares; electricity, primary, trade, and investment denominators must not be averaged.";

export const SOURCES = [
  {
    label: "Ember — Global Electricity Review 2026",
    url: "https://ember-energy.org/latest-insights/global-electricity-review-2026/",
  },
  {
    label: "IEA — World Energy Investment 2026",
    url: "https://www.iea.org/reports/world-energy-investment-2026",
  },
  {
    label: "IEA — Electricity Mid-Year Update 2026",
    url: "https://www.iea.org/reports/electricity-mid-year-update-2026",
  },
  {
    label: "Energy Institute — Statistical Review of World Energy",
    url: "https://www.energyinst.org/statistical-review",
  },
  {
    label: "Prior concentration lens (2026)",
    url: "/blog/energy-systems-concentration-2026",
  },
  {
    label: "Q3 vintage update (Ember + WEI)",
    url: "/blog/energy-systems-update-2026q3",
  },
] as const;

export const PRIOR_CONCENTRATION_PATH =
  "/blog/energy-systems-concentration-2026";
export const PRIOR_RESEARCH_PATH = "/blog/energy-systems-research-2026";
export const PRIOR_Q3_PATH = "/blog/energy-systems-update-2026q3";
export const PRIOR_AUG608_PATH = "/blog/energy-systems-update-202608";

const CN = "#f43f5e";
const US = "#0ea5e9";
const ME = "#f59e0b";
const SEA = "#14b8a6";
const EU = "#8b5cf6";
const OTHER = "#64748b";

/** Headline punchline — Top-1 / Top-3 under Q3+Aug prints */
export const HEADLINE = {
  /** Primary demand — carried EI framing, China tip */
  demandTop1Pct: 27.6,
  demandTop1Label: "China",
  demandTop3Pct: 49.8,
  demandTop3Labels: "China + US + India",
  demandHhi: 1145,
  priorDemandTop1Pct: 27.4,
  priorDemandTop3Pct: 49.2,
  priorDemandHhi: 1120,

  /** Electricity generation — Ember 2025 census restatement */
  elecTop1Pct: 33.2,
  elecTop1Label: "China",
  elecTop3Pct: 56.5,
  elecTop3Labels: "China + US + India",
  elecHhi: 1520,
  priorElecTop1Pct: 32,
  priorElecTop3Pct: 55,

  /** Hardest export tip */
  exportTop1MaxPct: 36,
  exportTop1MaxLabel: "Indonesia (coal)",
  lngTop1Pct: 24,
  lngTop1Label: "United States",
  lngTop3Pct: 63,
  coalExportTop3Pct: 73,
  oilExportTop3Pct: 38,

  /** Clean-tech manufacturing — still extreme */
  solarModuleTop1Pct: 80,
  batteryCellTop1Pct: 75,
  mfgTop1MaxPct: 80,

  /** Clean investment geography (IEA WEI 2026e) */
  cleanInvTn: 2.2,
  fossilInvTn: 1.2,
  totalInvTn: 3.4,
  cleanInvTop1Pct: 34,
  cleanInvTop1Label: "China",
  cleanInvTop3Pct: 58,
  cleanInvTop3Labels: "China + US + EU",
  cleanInvHhi: 1680,

  /** Demand-growth tip (IEA MYU 2026e) */
  demandGrowth2026Pct: 3.6,
  growthTop1Pct: 42,
  growthTop1Label: "China",
  growthTop3Pct: 68,
  growthTop3Labels: "China + India + US",

  /** Import / wholesale shock exposure */
  japanImportDepPct: 88,
  euImportDepPct: 58,
  euJapanWholesaleYoyPct: 30,
  usWholesaleYoyPct: 0,
  australiaWholesaleYoyPct: -45,

  /** Power mix milestone (not concentration, but context) */
  renewPowerSharePct: 33.8,
  coalPowerSharePct: 33.0,

  lensesTracked: 16,
} as const;

export type ConcentrationRow = {
  id: string;
  label: string;
  shortLabel: string;
  lens: Lens;
  regionHint: Region;
  top1SharePct: number;
  top1Label: string;
  top1Iso: string;
  top3SharePct: number;
  top3Labels: string;
  hhi: number;
  unit: string;
  year: number;
  confidence: Confidence;
  deltaTop1Pp?: number;
  relatedSlug?: string;
  note?: string;
  fill: string;
};

/** Cross-lens concentration table — Top-1 / Top-3 / HHI after Q3 vintages */
export const CONCENTRATION_ROWS: ConcentrationRow[] = [
  {
    id: "tpes-demand",
    label: "Primary energy demand (TPES)",
    shortLabel: "TPES demand",
    lens: "demand",
    regionHint: "Global",
    top1SharePct: 27.6,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 49.8,
    top3Labels: "China + US + India",
    hhi: 1145,
    unit: "% of world TPES (EJ)",
    year: 2025,
    confidence: "estimated",
    deltaTop1Pp: 0.2,
    relatedSlug: "energy-systems-update-2026",
    note: "EI 2025-year framing; tip nudged vs 2024 print",
    fill: CN,
  },
  {
    id: "elec-gen",
    label: "Electricity generation",
    shortLabel: "Power gen",
    lens: "demand",
    regionHint: "Global",
    top1SharePct: 33.2,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 56.5,
    top3Labels: "China + US + India",
    hhi: 1520,
    unit: "% of world TWh",
    year: 2025,
    confidence: "estimated",
    deltaTop1Pp: 1.2,
    relatedSlug: "energy-systems-update-2026q3",
    note: "Ember GER 2026 restatement; China tip thickened",
    fill: CN,
  },
  {
    id: "elec-growth",
    label: "Electricity demand growth (2026e)",
    shortLabel: "Demand growth",
    lens: "demand",
    regionHint: "Global",
    top1SharePct: 42,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 68,
    top3Labels: "China + India + US",
    hhi: 2280,
    unit: "% of world TWh add",
    year: 2026,
    confidence: "estimated",
    relatedSlug: "energy-systems-update-202608",
    note: "IEA MYU: China ~5.5%, India ~7%, US ~1.8% growth",
    fill: CN,
  },
  {
    id: "coal-consume",
    label: "Coal consumption",
    shortLabel: "Coal use",
    lens: "demand",
    regionHint: "Asia-Pacific",
    top1SharePct: 56.5,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 75,
    top3Labels: "China + India + US",
    hhi: 3480,
    unit: "% of world coal demand",
    year: 2025,
    confidence: "estimated",
    deltaTop1Pp: 0.5,
    note: "Asia thermal + metallurgical; coal gen rebound in MYU",
    fill: CN,
  },
  {
    id: "oil-demand",
    label: "Oil demand",
    shortLabel: "Oil demand",
    lens: "demand",
    regionHint: "Global",
    top1SharePct: 16,
    top1Label: "United States",
    top1Iso: "US",
    top3SharePct: 41,
    top3Labels: "US + China + India",
    hhi: 800,
    unit: "% of world oil demand",
    year: 2025,
    confidence: "estimated",
    deltaTop1Pp: 0,
    fill: US,
  },
  {
    id: "coal-export",
    label: "Hard coal exports",
    shortLabel: "Coal export",
    lens: "export",
    regionHint: "Asia-Pacific",
    top1SharePct: 36,
    top1Label: "Indonesia",
    top1Iso: "ID",
    top3SharePct: 73,
    top3Labels: "Indonesia + Australia + Russia",
    hhi: 2180,
    unit: "% of seaborne export tons",
    year: 2025,
    confidence: "estimated",
    deltaTop1Pp: 1,
    fill: SEA,
  },
  {
    id: "lng-export",
    label: "LNG exports",
    shortLabel: "LNG export",
    lens: "export",
    regionHint: "Global",
    top1SharePct: 24,
    top1Label: "United States",
    top1Iso: "US",
    top3SharePct: 63,
    top3Labels: "US + Australia + Qatar",
    hhi: 1580,
    unit: "% of LNG export volumes",
    year: 2025,
    confidence: "secondary",
    deltaTop1Pp: 2,
    relatedSlug: "energy-systems-update-2026",
    note: "US LNG +27% YoY thickened Top-1; Hormuz shock prices the tip",
    fill: US,
  },
  {
    id: "pipe-gas",
    label: "Pipeline gas exports",
    shortLabel: "Pipe gas",
    lens: "export",
    regionHint: "Eurasia",
    top1SharePct: 17,
    top1Label: "Russia",
    top1Iso: "RU",
    top3SharePct: 47,
    top3Labels: "Russia + Norway + Canada",
    hhi: 900,
    unit: "% of inter-regional pipe trade",
    year: 2025,
    confidence: "estimated",
    deltaTop1Pp: -1,
    note: "Post-2022 European route rewiring continues",
    fill: OTHER,
  },
  {
    id: "oil-export",
    label: "Crude oil exports",
    shortLabel: "Oil export",
    lens: "export",
    regionHint: "Middle East",
    top1SharePct: 15,
    top1Label: "Saudi Arabia",
    top1Iso: "SA",
    top3SharePct: 38,
    top3Labels: "Saudi + Russia + Iraq",
    hhi: 680,
    unit: "% of crude export volumes",
    year: 2025,
    confidence: "estimated",
    deltaTop1Pp: 0,
    fill: ME,
  },
  {
    id: "oil-produce",
    label: "Crude oil production",
    shortLabel: "Oil produce",
    lens: "production",
    regionHint: "Global",
    top1SharePct: 13.5,
    top1Label: "United States",
    top1Iso: "US",
    top3SharePct: 36.5,
    top3Labels: "US + Saudi + Russia",
    hhi: 640,
    unit: "% of world crude output",
    year: 2025,
    confidence: "estimated",
    deltaTop1Pp: 0.5,
    fill: US,
  },
  {
    id: "gas-produce",
    label: "Natural gas production",
    shortLabel: "Gas produce",
    lens: "production",
    regionHint: "Global",
    top1SharePct: 25.5,
    top1Label: "United States",
    top1Iso: "US",
    top3SharePct: 48.5,
    top3Labels: "US + Russia + Iran",
    hhi: 1010,
    unit: "% of world gas output",
    year: 2025,
    confidence: "estimated",
    deltaTop1Pp: 0.5,
    fill: US,
  },
  {
    id: "coal-produce",
    label: "Coal production",
    shortLabel: "Coal produce",
    lens: "production",
    regionHint: "Asia-Pacific",
    top1SharePct: 51.5,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 72.5,
    top3Labels: "China + India + Indonesia",
    hhi: 2950,
    unit: "% of world coal output",
    year: 2025,
    confidence: "estimated",
    deltaTop1Pp: 0.5,
    fill: CN,
  },
  {
    id: "solar-module",
    label: "Solar PV module manufacturing",
    shortLabel: "Solar modules",
    lens: "manufacturing",
    regionHint: "Asia-Pacific",
    top1SharePct: 80,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 92,
    top3Labels: "China + Vietnam + Malaysia",
    hhi: 6600,
    unit: "% of module capacity",
    year: 2025,
    confidence: "secondary",
    deltaTop1Pp: 0,
    note: "IEA solar PV supply-chain — still extreme tip",
    fill: CN,
  },
  {
    id: "battery-cell",
    label: "Battery cell manufacturing",
    shortLabel: "Battery cells",
    lens: "manufacturing",
    regionHint: "Asia-Pacific",
    top1SharePct: 75,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 92,
    top3Labels: "China + Korea + Japan",
    hhi: 5800,
    unit: "% of cell capacity",
    year: 2025,
    confidence: "secondary",
    deltaTop1Pp: 0,
    relatedSlug: "chokepoint-commodities-concentration-2026q3",
    fill: CN,
  },
  {
    id: "clean-invest",
    label: "Clean energy investment",
    shortLabel: "Clean capex",
    lens: "investment",
    regionHint: "Global",
    top1SharePct: 34,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 58,
    top3Labels: "China + US + EU",
    hhi: 1680,
    unit: "% of clean $2.2T (2026e)",
    year: 2026,
    confidence: "estimated",
    relatedSlug: "energy-systems-update-2026q3",
    note: "IEA WEI 2026: clean ~1.8× fossils; China still Top-1 geography",
    fill: CN,
  },
  {
    id: "lng-invest",
    label: "LNG supply investment",
    shortLabel: "LNG capex",
    lens: "investment",
    regionHint: "Global",
    top1SharePct: 28,
    top1Label: "United States",
    top1Iso: "US",
    top3SharePct: 55,
    top3Labels: "US + Qatar + Australia",
    hhi: 1420,
    unit: "% of LNG project spend",
    year: 2026,
    confidence: "estimated",
    note: "IEA: LNG investment roughly doubles vs prior cycle",
    fill: US,
  },
];

/** Demand ladder — cumulative share of world electricity TWh (Ember 2025) */
export const ELEC_DEMAND_LADDER = [
  { rank: 1, label: "China", sharePct: 33.2, cumulativePct: 33.2, fill: CN },
  { rank: 2, label: "United States", sharePct: 14.8, cumulativePct: 48.0, fill: US },
  { rank: 3, label: "India", sharePct: 8.5, cumulativePct: 56.5, fill: ME },
  { rank: 4, label: "EU-27", sharePct: 7.2, cumulativePct: 63.7, fill: EU },
  { rank: 5, label: "Russia", sharePct: 3.4, cumulativePct: 67.1, fill: OTHER },
  { rank: 6, label: "Rest of world", sharePct: 32.9, cumulativePct: 100, fill: SEA },
];

/** Primary demand ladder (carried / nudged) */
export const DEMAND_LADDER = [
  { rank: 1, label: "China", sharePct: 27.6, cumulativePct: 27.6, ej: 172, fill: CN },
  { rank: 2, label: "United States", sharePct: 15.2, cumulativePct: 42.8, ej: 95, fill: US },
  { rank: 3, label: "India", sharePct: 7.0, cumulativePct: 49.8, ej: 44, fill: ME },
  { rank: 4, label: "Russia", sharePct: 4.7, cumulativePct: 54.5, ej: 29, fill: OTHER },
  { rank: 5, label: "Japan", sharePct: 2.6, cumulativePct: 57.1, ej: 16, fill: SEA },
  { rank: 6, label: "Rest of world", sharePct: 42.9, cumulativePct: 100, ej: 268, fill: EU },
];

export const CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 33.2, equalPct: 16.7 },
  { rank: 2, label: "Top-2", sharePct: 48.0, equalPct: 33.3 },
  { rank: 3, label: "Top-3", sharePct: 56.5, equalPct: 50 },
  { rank: 4, label: "Top-5", sharePct: 67.1, equalPct: 83.3 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

/** Vintage slope — Top-1 / Top-3 / HHI across theme posts */
export type VintageSlopeRow = {
  vintage: string;
  short: string;
  demandTop1Pct: number;
  demandTop3Pct: number;
  demandHhi: number;
  elecTop1Pct: number;
  lngTop1Pct: number;
  solarMfgTop1Pct: number;
  note: string;
};

export const VINTAGE_SLOPE: VintageSlopeRow[] = [
  {
    vintage: "Research 2026",
    short: "Research",
    demandTop1Pct: 27.0,
    demandTop3Pct: 48.5,
    demandHhi: 1100,
    elecTop1Pct: 31.5,
    lngTop1Pct: 21,
    solarMfgTop1Pct: 80,
    note: "Country mix ledger baseline",
  },
  {
    vintage: "Concentration 2026",
    short: "Conc 2026",
    demandTop1Pct: 27.4,
    demandTop3Pct: 49.2,
    demandHhi: 1120,
    elecTop1Pct: 32,
    lngTop1Pct: 22,
    solarMfgTop1Pct: 80,
    note: "2024 EI share tape",
  },
  {
    vintage: "Q3 concentration",
    short: "Q3 conc",
    demandTop1Pct: 27.6,
    demandTop3Pct: 49.8,
    demandHhi: 1145,
    elecTop1Pct: 33.2,
    lngTop1Pct: 24,
    solarMfgTop1Pct: 80,
    note: "Ember + WEI + MYU restatement",
  },
];

export type FuelExportRow = {
  id: string;
  fuel: string;
  top1Label: string;
  top1SharePct: number;
  top2Label: string;
  top2SharePct: number;
  top3Label: string;
  top3SharePct: number;
  top3BlocPct: number;
  deltaTop1Pp: number;
  fill: string;
};

export const FUEL_EXPORT_STACK: FuelExportRow[] = [
  {
    id: "coal",
    fuel: "Coal",
    top1Label: "Indonesia",
    top1SharePct: 36,
    top2Label: "Australia",
    top2SharePct: 22,
    top3Label: "Russia",
    top3SharePct: 15,
    top3BlocPct: 73,
    deltaTop1Pp: 1,
    fill: SEA,
  },
  {
    id: "lng",
    fuel: "LNG",
    top1Label: "United States",
    top1SharePct: 24,
    top2Label: "Australia",
    top2SharePct: 20,
    top3Label: "Qatar",
    top3SharePct: 19,
    top3BlocPct: 63,
    deltaTop1Pp: 2,
    fill: US,
  },
  {
    id: "pipe",
    fuel: "Pipe gas",
    top1Label: "Russia",
    top1SharePct: 17,
    top2Label: "Norway",
    top2SharePct: 16,
    top3Label: "Canada",
    top3SharePct: 14,
    top3BlocPct: 47,
    deltaTop1Pp: -1,
    fill: OTHER,
  },
  {
    id: "oil",
    fuel: "Crude oil",
    top1Label: "Saudi Arabia",
    top1SharePct: 15,
    top2Label: "Russia",
    top2SharePct: 12,
    top3Label: "Iraq",
    top3SharePct: 11,
    top3BlocPct: 38,
    deltaTop1Pp: 0,
    fill: ME,
  },
];

export type ImportExposureRow = {
  id: string;
  label: string;
  shortLabel: string;
  region: Region;
  importDependencePct: number;
  fossilPrimaryPct: number;
  wholesaleYoyPct: number | null;
  primaryEj: number;
  tradeStance: "net-importer" | "balanced" | "net-exporter";
  confidence: Confidence;
  fill: string;
};

/** Import dependence × fossil primary × wholesale shock (IEA MYU Q2 2026) */
export const IMPORT_EXPOSURE: ImportExposureRow[] = [
  {
    id: "japan",
    label: "Japan",
    shortLabel: "Japan",
    region: "Asia-Pacific",
    importDependencePct: 88,
    fossilPrimaryPct: 86,
    wholesaleYoyPct: 30,
    primaryEj: 16,
    tradeStance: "net-importer",
    confidence: "estimated",
    fill: SEA,
  },
  {
    id: "korea",
    label: "South Korea",
    shortLabel: "Korea",
    region: "Asia-Pacific",
    importDependencePct: 82,
    fossilPrimaryPct: 84,
    wholesaleYoyPct: 28,
    primaryEj: 12,
    tradeStance: "net-importer",
    confidence: "estimated",
    fill: SEA,
  },
  {
    id: "eu27",
    label: "European Union",
    shortLabel: "EU-27",
    region: "Europe",
    importDependencePct: 58,
    fossilPrimaryPct: 69,
    wholesaleYoyPct: 30,
    primaryEj: 58,
    tradeStance: "net-importer",
    confidence: "disclosed",
    fill: EU,
  },
  {
    id: "india",
    label: "India",
    shortLabel: "India",
    region: "Asia-Pacific",
    importDependencePct: 38,
    fossilPrimaryPct: 89,
    wholesaleYoyPct: 10,
    primaryEj: 44,
    tradeStance: "net-importer",
    confidence: "estimated",
    fill: ME,
  },
  {
    id: "china",
    label: "China",
    shortLabel: "China",
    region: "Asia-Pacific",
    importDependencePct: 22,
    fossilPrimaryPct: 82,
    wholesaleYoyPct: 5,
    primaryEj: 172,
    tradeStance: "net-importer",
    confidence: "estimated",
    fill: CN,
  },
  {
    id: "us",
    label: "United States",
    shortLabel: "US",
    region: "North America",
    importDependencePct: -8,
    fossilPrimaryPct: 80,
    wholesaleYoyPct: 0,
    primaryEj: 95,
    tradeStance: "net-exporter",
    confidence: "estimated",
    fill: US,
  },
  {
    id: "australia",
    label: "Australia",
    shortLabel: "Australia",
    region: "Asia-Pacific",
    importDependencePct: -140,
    fossilPrimaryPct: 88,
    wholesaleYoyPct: -45,
    primaryEj: 6,
    tradeStance: "net-exporter",
    confidence: "estimated",
    fill: SEA,
  },
  {
    id: "saudi",
    label: "Saudi Arabia",
    shortLabel: "Saudi",
    region: "Middle East",
    importDependencePct: -180,
    fossilPrimaryPct: 98,
    wholesaleYoyPct: null,
    primaryEj: 12,
    tradeStance: "net-exporter",
    confidence: "estimated",
    fill: ME,
  },
];

/** Clean investment geography shares (IEA WEI 2026e) */
export const CLEAN_INV_SHARES = [
  { id: "cn", label: "China", sharePct: 34, bn: 748, fill: CN },
  { id: "us", label: "United States", sharePct: 14, bn: 308, fill: US },
  { id: "eu", label: "European Union", sharePct: 10, bn: 220, fill: EU },
  { id: "in", label: "India", sharePct: 5, bn: 110, fill: ME },
  { id: "other", label: "Rest of world", sharePct: 37, bn: 814, fill: OTHER },
];

/** Growth add shares — who absorbs the 3.6% demand path */
export const GROWTH_ADD_SHARES = [
  { id: "cn", label: "China", sharePct: 42, growthPct: 5.5, fill: CN },
  { id: "in", label: "India", sharePct: 16, growthPct: 7.0, fill: ME },
  { id: "us", label: "United States", sharePct: 10, growthPct: 1.8, fill: US },
  { id: "eu", label: "EU-27", sharePct: 8, growthPct: 2.0, fill: EU },
  { id: "sea", label: "SE Asia", sharePct: 9, growthPct: 5.0, fill: SEA },
  { id: "other", label: "Rest of world", sharePct: 15, growthPct: 2.5, fill: OTHER },
];

export const HHI_BANDS = [
  { id: "extreme", label: "Extreme (≥5,000)", min: 5000, fill: CN },
  { id: "high", label: "High (2,500–4,999)", min: 2500, fill: ME },
  { id: "moderate", label: "Moderate (1,500–2,499)", min: 1500, fill: US },
  { id: "plural", label: "Plural (<1,500)", min: 0, fill: SEA },
] as const;

export function hhiBand(hhi: number) {
  if (hhi >= 5000) return HHI_BANDS[0];
  if (hhi >= 2500) return HHI_BANDS[1];
  if (hhi >= 1500) return HHI_BANDS[2];
  return HHI_BANDS[3];
}

export function filterRows(opts: {
  lens?: Lens | "all";
  minTop1?: number;
}): ConcentrationRow[] {
  const { lens = "all", minTop1 = 0 } = opts;
  return CONCENTRATION_ROWS.filter((r) => {
    if (lens !== "all" && r.lens !== lens) return false;
    if (r.top1SharePct < minTop1) return false;
    return true;
  });
}

export function sortedByMetric(
  rows: ConcentrationRow[],
  metric: "top1" | "top3" | "hhi" | "delta",
): ConcentrationRow[] {
  return [...rows].sort((a, b) => {
    const av =
      metric === "top1"
        ? a.top1SharePct
        : metric === "top3"
          ? a.top3SharePct
          : metric === "delta"
            ? a.deltaTop1Pp ?? 0
            : a.hhi;
    const bv =
      metric === "top1"
        ? b.top1SharePct
        : metric === "top3"
          ? b.top3SharePct
          : metric === "delta"
            ? b.deltaTop1Pp ?? 0
            : b.hhi;
    return bv - av;
  });
}

export function lensExposures(rows: ConcentrationRow[]) {
  const lenses: Lens[] = [
    "demand",
    "export",
    "production",
    "manufacturing",
    "investment",
    "import-exposure",
  ];
  return lenses
    .map((lens) => {
      const subset = rows.filter((r) => r.lens === lens);
      if (!subset.length) return null;
      const avgTop1 =
        subset.reduce((s, r) => s + r.top1SharePct, 0) / subset.length;
      const maxTop1 = Math.max(...subset.map((r) => r.top1SharePct));
      const avgHhi = subset.reduce((s, r) => s + r.hhi, 0) / subset.length;
      return {
        lens,
        count: subset.length,
        avgTop1: Math.round(avgTop1 * 10) / 10,
        maxTop1,
        avgHhi: Math.round(avgHhi),
      };
    })
    .filter(Boolean) as Array<{
    lens: Lens;
    count: number;
    avgTop1: number;
    maxTop1: number;
    avgHhi: number;
  }>;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtEj(n: number): string {
  return `${n.toFixed(0)} EJ`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export const LENS_LABELS: Record<Lens, string> = {
  demand: "Demand",
  export: "Fuel exports",
  production: "Production",
  manufacturing: "Manufacturing",
  investment: "Investment",
  "import-exposure": "Import exposure",
};
