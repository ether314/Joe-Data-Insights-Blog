/**
 * Energy systems — late-Aug 202608 concentration / market-share lens.
 *
 * Core question: How concentrated is this system at the top of the distribution?
 * (How do countries source, mix, and trade energy?)
 *
 * Vintage delta vs energy-systems-concentration-2026q3:
 * 1. Electricity / TPES / fuel-export / manufacturing Top-1–Top-3 — carried
 *    (no newer Ember GER or EI period census after the Q3 restatement)
 * 2. Clean-investment geography — carried (IEA WEI 2026e still the capital tape)
 * 3. NEW path meters — IEA Electricity Mid-Year Update 2026 demand path
 *    (3.6% / 3.8%), coal generation rebound (+1.4%) add shares, renewables
 *    share path to 37% / VRE 21%, solar add concentration (~50% China),
 *    wholesale×import shock pricing of the LNG tip
 *
 * Complements energy-systems-update-202608 (level/mix vintage) by asking whether
 * the Mid-Year shock thickened the *top of the distribution* or only re-priced it.
 */

export type Confidence =
  | "disclosed"
  | "estimated"
  | "secondary"
  | "carried"
  | "restated";
export type Lens =
  | "demand"
  | "export"
  | "production"
  | "manufacturing"
  | "investment"
  | "import-exposure"
  | "path";
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
  "Late-Aug 202608 concentration lens vs Q3 print. Ember GER 2026 electricity Top-1/Top-3 (China 33.2% / CN+US+IN 56.5%), TPES tip, fuel-export stacks, solar/battery manufacturing extremes, and IEA WEI clean-investment geography are carried — no superseding period census. IEA Electricity Mid-Year Update 2026 supplies path meters: world demand +3.6%/+3.8%, coal generation +1.4% with Asia-weighted add shares, renewables share path 33%→37% (VRE 17%→21%), solar add ~610 TWh with China ~50% of the increase, and Q2 wholesale YoY split (EU/Japan >+30%, US ~0, AU −45%). Confidence tags separate carried share ladders from disclosed Mid-Year path meters.";

export const SOURCES = [
  {
    label: "Q3 concentration lens",
    url: "/blog/energy-systems-concentration-2026q3",
  },
  {
    label: "Prior concentration print (2026)",
    url: "/blog/energy-systems-concentration-2026",
  },
  {
    label: "August Mid-Year vintage",
    url: "/blog/energy-systems-update-202608",
  },
  {
    label: "Q3 Ember + WEI update",
    url: "/blog/energy-systems-update-2026q3",
  },
  {
    label: "Energy systems research",
    url: "/blog/energy-systems-research-2026",
  },
  {
    label: "IEA — Electricity Mid-Year Update 2026",
    url: "https://www.iea.org/reports/electricity-mid-year-update-2026",
  },
  {
    label: "Ember — Global Electricity Review 2026 (carried)",
    url: "https://ember-energy.org/latest-insights/global-electricity-review-2026/",
  },
  {
    label: "IEA — World Energy Investment 2026 (carried)",
    url: "https://www.iea.org/reports/world-energy-investment-2026",
  },
] as const;

export const PRIOR_Q3_CONC_PATH = "/blog/energy-systems-concentration-2026q3";
export const PRIOR_CONCENTRATION_PATH = "/blog/energy-systems-concentration-2026";
export const PRIOR_RESEARCH_PATH = "/blog/energy-systems-research-2026";
export const PRIOR_Q3_UPDATE_PATH = "/blog/energy-systems-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/energy-systems-update-202608";
export const CHOKEPOINT_PATH = "/blog/chokepoint-commodities-concentration-2026q3";

const CN = "#f43f5e";
const US = "#0ea5e9";
const ME = "#f59e0b";
const SEA = "#14b8a6";
const EU = "#8b5cf6";
const OTHER = "#64748b";

/** Headline punchline — carried Top-k + Aug path meters */
export const HEADLINE = {
  /** Carried Ember 2025 electricity stock */
  elecTop1Pct: 33.2,
  elecTop1Label: "China",
  elecTop3Pct: 56.5,
  elecTop3Labels: "China + US + India",
  elecHhi: 1520,
  priorElecTop1Pct: 33.2,
  priorElecTop3Pct: 56.5,
  elecTop1DeltaPp: 0,

  /** Carried primary demand */
  demandTop1Pct: 27.6,
  demandTop1Label: "China",
  demandTop3Pct: 49.8,
  demandTop3Labels: "China + US + India",
  demandHhi: 1145,
  demandTop1DeltaPp: 0,

  /** Hardest export tip — carried */
  exportTop1MaxPct: 36,
  exportTop1MaxLabel: "Indonesia (coal)",
  lngTop1Pct: 24,
  lngTop1Label: "United States",
  lngTop3Pct: 63,
  coalExportTop3Pct: 73,
  lngTop1DeltaPp: 0,

  /** Manufacturing extremes — carried */
  solarModuleTop1Pct: 80,
  batteryCellTop1Pct: 75,
  mfgTop1MaxPct: 80,

  /** Clean investment — carried WEI */
  cleanInvTn: 2.2,
  fossilInvTn: 1.2,
  totalInvTn: 3.4,
  cleanInvTop1Pct: 34,
  cleanInvTop1Label: "China",
  cleanInvTop3Pct: 58,
  cleanInvHhi: 1680,

  /** Aug Mid-Year path meters (NEW) */
  demandGrowth2026Pct: 3.6,
  demandGrowth2027Pct: 3.8,
  worldTwh2025: 28600,
  worldTwh2027e: 30700,
  growthTop1Pct: 42,
  growthTop1Label: "China",
  growthTop3Pct: 68,
  growthTop3Labels: "China + India + US",
  growthTop1DeltaPp: 0,

  coalGenYoyPct: 1.4,
  coalAddTop1Pct: 48,
  coalAddTop1Label: "China",
  coalAddTop3Pct: 78,
  coalAddTop3Labels: "China + India + EU slowdown",

  renewShare2025Pct: 33,
  renewShare2027Pct: 37,
  vreShare2025Pct: 17,
  vreShare2027Pct: 21,
  solarAddTwh2026: 610,
  solarAddTop1Pct: 50,
  solarAddTop1Label: "China",
  solarAddAsiaExChinaPct: 17,

  japanImportDepPct: 88,
  euImportDepPct: 58,
  euJapanWholesaleYoyPct: 30,
  usWholesaleYoyPct: 0,
  australiaWholesaleYoyPct: -45,
  indiaWholesaleYoyPct: 10,

  lensesTracked: 18,
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
  deltaVsQ3Pp?: number;
  relatedSlug?: string;
  note?: string;
  fill: string;
};

/** Cross-lens scoreboard — carried stock + Aug path tips */
export const CONCENTRATION_ROWS: ConcentrationRow[] = [
  {
    id: "elec-gen",
    label: "Electricity generation (stock)",
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
    relatedSlug: "energy-systems-concentration-2026q3",
    note: "Ember GER 2026 — carried; no newer census",
    fill: CN,
  },
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
    fill: CN,
  },
  {
    id: "elec-growth",
    label: "Electricity demand growth (2026e)",
    shortLabel: "Demand growth",
    lens: "path",
    regionHint: "Global",
    top1SharePct: 42,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 68,
    top3Labels: "China + India + US",
    hhi: 2280,
    unit: "% of world TWh add",
    year: 2026,
    confidence: "restated",
    deltaVsQ3Pp: 0,
    relatedSlug: "energy-systems-update-202608",
    note: "MYU path 3.6%/3.8%; volume tip unchanged vs Q3 lens",
    fill: CN,
  },
  {
    id: "coal-add",
    label: "Coal generation add (2026e)",
    shortLabel: "Coal rebound",
    lens: "path",
    regionHint: "Asia-Pacific",
    top1SharePct: 48,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 78,
    top3Labels: "China + India + residual",
    hhi: 2860,
    unit: "% of global coal TWh add",
    year: 2026,
    confidence: "estimated",
    deltaVsQ3Pp: 48,
    relatedSlug: "energy-systems-update-202608",
    note: "NEW: who owns the +1.4% coal rebound",
    fill: CN,
  },
  {
    id: "solar-add",
    label: "Solar generation add (2026e)",
    shortLabel: "Solar add",
    lens: "path",
    regionHint: "Asia-Pacific",
    top1SharePct: 50,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 72,
    top3Labels: "China + India + other Asia",
    hhi: 2920,
    unit: "% of ~610 TWh solar add",
    year: 2026,
    confidence: "estimated",
    deltaVsQ3Pp: 50,
    note: "NEW path tip — China ~half of solar increase",
    fill: CN,
  },
  {
    id: "coal-consume",
    label: "Coal consumption (stock)",
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
    fill: CN,
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
    relatedSlug: "energy-systems-update-202608",
    note: "Share carried; Mid-Year prices the tip into wholesale",
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
    note: "Still extreme — Mid-Year does not diversify manufacturing",
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
    relatedSlug: "energy-systems-update-2026q3",
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
    confidence: "carried",
    deltaVsQ3Pp: 0,
    fill: US,
  },
  {
    id: "wholesale-shock",
    label: "Wholesale shock (import-exposed)",
    shortLabel: "Wholesale tip",
    lens: "import-exposure",
    regionHint: "Global",
    top1SharePct: 30,
    top1Label: "EU/Japan YoY",
    top1Iso: "EU",
    top3SharePct: 58,
    top3Labels: "EU/JP + Korea + India",
    hhi: 1720,
    unit: "import-exposed wholesale YoY cluster",
    year: 2026,
    confidence: "disclosed",
    deltaVsQ3Pp: 0,
    relatedSlug: "energy-systems-update-202608",
    note: "Prices the carried LNG tip — not a share rewrite",
    fill: EU,
  },
];

/** Vintage deltas Q3 → Aug (pp or qualitative) */
export const VINTAGE_DELTAS = [
  {
    id: "elecTop1",
    label: "Elec Top-1",
    q3: 33.2,
    aug: 33.2,
    delta: 0,
    unit: "pp",
    direction: "flat" as const,
    fill: CN,
  },
  {
    id: "elecTop3",
    label: "Elec Top-3",
    q3: 56.5,
    aug: 56.5,
    delta: 0,
    unit: "pp",
    direction: "flat" as const,
    fill: CN,
  },
  {
    id: "lngTop1",
    label: "LNG Top-1",
    q3: 24,
    aug: 24,
    delta: 0,
    unit: "pp",
    direction: "flat" as const,
    fill: US,
  },
  {
    id: "solarMfg",
    label: "Solar mfg Top-1",
    q3: 80,
    aug: 80,
    delta: 0,
    unit: "pp",
    direction: "flat" as const,
    fill: CN,
  },
  {
    id: "growthTop1",
    label: "Growth-add Top-1",
    q3: 42,
    aug: 42,
    delta: 0,
    unit: "pp",
    direction: "flat" as const,
    fill: CN,
  },
  {
    id: "coalAdd",
    label: "Coal-add Top-1",
    q3: 0,
    aug: 48,
    delta: 48,
    unit: "pp",
    direction: "up" as const,
    fill: ME,
  },
  {
    id: "solarAdd",
    label: "Solar-add Top-1",
    q3: 0,
    aug: 50,
    delta: 50,
    unit: "pp",
    direction: "up" as const,
    fill: SEA,
  },
  {
    id: "demandPath",
    label: "Demand path 2026e",
    q3: 3.6,
    aug: 3.6,
    delta: 0,
    unit: "pp growth",
    direction: "flat" as const,
    fill: OTHER,
  },
];

/** Electricity stock ladder — carried Ember */
export const ELEC_DEMAND_LADDER = [
  { rank: 1, label: "China", sharePct: 33.2, cumulativePct: 33.2, fill: CN },
  { rank: 2, label: "United States", sharePct: 14.8, cumulativePct: 48.0, fill: US },
  { rank: 3, label: "India", sharePct: 8.5, cumulativePct: 56.5, fill: ME },
  { rank: 4, label: "EU-27", sharePct: 7.2, cumulativePct: 63.7, fill: EU },
  { rank: 5, label: "Russia", sharePct: 3.4, cumulativePct: 67.1, fill: OTHER },
  { rank: 6, label: "Rest of world", sharePct: 32.9, cumulativePct: 100, fill: SEA },
];

export const CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 33.2, equalPct: 16.7 },
  { rank: 2, label: "Top-2", sharePct: 48.0, equalPct: 33.3 },
  { rank: 3, label: "Top-3", sharePct: 56.5, equalPct: 50 },
  { rank: 4, label: "Top-5", sharePct: 67.1, equalPct: 83.3 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

/** Growth-add Lorenz twin */
export const GROWTH_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 42, equalPct: 16.7 },
  { rank: 2, label: "Top-2", sharePct: 58, equalPct: 33.3 },
  { rank: 3, label: "Top-3", sharePct: 68, equalPct: 50 },
  { rank: 4, label: "Top-5", sharePct: 85, equalPct: 83.3 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export const GROWTH_ADD_SHARES = [
  { id: "cn", label: "China", sharePct: 42, growthPct: 5.5, fill: CN },
  { id: "in", label: "India", sharePct: 16, growthPct: 7.0, fill: ME },
  { id: "us", label: "United States", sharePct: 10, growthPct: 1.8, fill: US },
  { id: "eu", label: "EU-27", sharePct: 8, growthPct: 2.0, fill: EU },
  { id: "sea", label: "SE Asia", sharePct: 9, growthPct: 5.0, fill: SEA },
  { id: "other", label: "Rest of world", sharePct: 15, growthPct: 2.5, fill: OTHER },
];

/** Coal rebound add shares — NEW Aug path meter */
export const COAL_ADD_SHARES = [
  { id: "cn", label: "China", sharePct: 48, note: "Weak wind + curtailment → util ↑", fill: CN },
  { id: "in", label: "India", sharePct: 22, note: "Rebound from 2025 coal decline", fill: ME },
  { id: "eu", label: "EU-27", sharePct: 8, note: "Decline slows vs Feb forecast", fill: EU },
  { id: "other", label: "Rest of world", sharePct: 22, note: "Gas-to-coal switching pockets", fill: OTHER },
];

/** Solar generation add geography — NEW */
export const SOLAR_ADD_SHARES = [
  { id: "cn", label: "China", sharePct: 50, twh: 305, fill: CN },
  { id: "asia", label: "India + other Asia", sharePct: 17, twh: 104, fill: ME },
  { id: "us", label: "United States", sharePct: 12, twh: 73, fill: US },
  { id: "eu", label: "EU-27", sharePct: 9, twh: 55, fill: EU },
  { id: "other", label: "Rest of world", sharePct: 12, twh: 73, fill: OTHER },
];

/** Demand path — Mid-Year levels */
export const DEMAND_PATH = [
  { year: 2024, growthPct: 4.0, twh: 27800, label: "2024" },
  { year: 2025, growthPct: 3.0, twh: 28600, label: "2025" },
  { year: 2026, growthPct: 3.6, twh: 29630, label: "2026e" },
  { year: 2027, growthPct: 3.8, twh: 30700, label: "2027e" },
];

/** Renewables / VRE / coal share path */
export const MIX_PATH = [
  { year: 2025, renewPct: 33.8, coalPct: 33.0, vrePct: 17, label: "2025 Ember" },
  { year: 2026, renewPct: 35, coalPct: 32.5, vrePct: 19, label: "2026e MYU" },
  { year: 2027, renewPct: 37, coalPct: 31.5, vrePct: 21, label: "2027e MYU" },
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
    deltaTop1Pp: 0,
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
    deltaTop1Pp: 0,
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
    deltaTop1Pp: 0,
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
    confidence: "disclosed",
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
    confidence: "disclosed",
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
    confidence: "disclosed",
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
    confidence: "disclosed",
    fill: SEA,
  },
];

export const CLEAN_INV_SHARES = [
  { id: "cn", label: "China", sharePct: 34, bn: 748, fill: CN },
  { id: "us", label: "United States", sharePct: 14, bn: 308, fill: US },
  { id: "eu", label: "European Union", sharePct: 10, bn: 220, fill: EU },
  { id: "in", label: "India", sharePct: 5, bn: 110, fill: ME },
  { id: "other", label: "Rest of world", sharePct: 37, bn: 814, fill: OTHER },
];

/** Vintage slope including Aug step */
export type VintageSlopeRow = {
  vintage: string;
  short: string;
  demandTop1Pct: number;
  elecTop1Pct: number;
  lngTop1Pct: number;
  solarMfgTop1Pct: number;
  growthTop1Pct: number | null;
  coalAddTop1Pct: number | null;
  note: string;
};

export const VINTAGE_SLOPE: VintageSlopeRow[] = [
  {
    vintage: "Research 2026",
    short: "Research",
    demandTop1Pct: 27.0,
    elecTop1Pct: 31.5,
    lngTop1Pct: 21,
    solarMfgTop1Pct: 80,
    growthTop1Pct: null,
    coalAddTop1Pct: null,
    note: "Country mix ledger baseline",
  },
  {
    vintage: "Concentration 2026",
    short: "Conc 2026",
    demandTop1Pct: 27.4,
    elecTop1Pct: 32,
    lngTop1Pct: 22,
    solarMfgTop1Pct: 80,
    growthTop1Pct: null,
    coalAddTop1Pct: null,
    note: "2024 EI share tape",
  },
  {
    vintage: "Q3 concentration",
    short: "Q3 conc",
    demandTop1Pct: 27.6,
    elecTop1Pct: 33.2,
    lngTop1Pct: 24,
    solarMfgTop1Pct: 80,
    growthTop1Pct: 42,
    coalAddTop1Pct: null,
    note: "Ember + WEI restatement",
  },
  {
    vintage: "Aug 202608 concentration",
    short: "Aug conc",
    demandTop1Pct: 27.6,
    elecTop1Pct: 33.2,
    lngTop1Pct: 24,
    solarMfgTop1Pct: 80,
    growthTop1Pct: 42,
    coalAddTop1Pct: 48,
    note: "MYU path + coal/solar add tips",
  },
];

export const HHI_BANDS = [
  { id: "extreme", label: "Extreme (≥5,000)", min: 5000, fill: CN },
  { id: "high", label: "High (2,500–4,999)", min: 2500, fill: ME },
  { id: "moderate", label: "Moderate (1,500–2,499)", min: 1500, fill: US },
  { id: "plural", label: "Plural (<1,500)", min: 0, fill: SEA },
] as const;

export const LENS_LABELS: Record<Lens, string> = {
  demand: "Demand stock",
  export: "Fuel exports",
  production: "Production",
  manufacturing: "Manufacturing",
  investment: "Investment",
  "import-exposure": "Import shock",
  path: "Aug path meters",
};

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
            ? a.deltaVsQ3Pp ?? 0
            : a.hhi;
    const bv =
      metric === "top1"
        ? b.top1SharePct
        : metric === "top3"
          ? b.top3SharePct
          : metric === "delta"
            ? b.deltaVsQ3Pp ?? 0
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
    "path",
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

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtTwh(n: number): string {
  return `${n.toLocaleString("en-US")} TWh`;
}
