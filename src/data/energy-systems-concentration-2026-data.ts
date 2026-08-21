/**
 * Energy systems — concentration lens (Top-1 / Top-3 / HHI).
 * How concentrated is sourcing, mix leadership, and fuel trade at the top?
 * Primary: Energy Institute Statistical Review of World Energy 2025 (2024);
 *   Ember / OWID electricity; Eurostat import dependency; GIIGNL / IEA LNG.
 * Complements research (country mix ledger) and update (vintage delta) posts.
 */

export type Confidence = "disclosed" | "estimated" | "secondary";
export type Lens =
  | "demand"
  | "export"
  | "production"
  | "manufacturing"
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
  "Primary-energy demand shares and fossil trade volumes from Energy Institute Statistical Review of World Energy 2025 (2024 calendar year). Electricity generation shares aligned with Ember / Our World in Data 2024 extracts. EU energy import dependency from Eurostat (2023). LNG export shares from GIIGNL Annual Report 2025 / IEA gas notes. Solar PV manufacturing and battery cell capacity shares from IEA Energy Technology Perspectives / Special Report on Solar PV Global Supply Chains (latest disclosed vintages, labeled secondary). Top-k and HHI are derived from rounded country shares; denominators differ across demand, trade, and manufacturing and must not be averaged.";

export const EI_REVIEW_URL =
  "https://www.energyinst.org/statistical-review";
export const EUROSTAT_IMPORT_URL =
  "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Energy_imports_dependency";
export const IEA_SOLAR_URL =
  "https://www.iea.org/reports/special-report-on-solar-pv-global-supply-chains";

export const HEADLINE = {
  /** China share of world primary energy demand (TPES), 2024 */
  demandTop1Pct: 27.4,
  demandTop1Label: "China",
  /** China + US + India */
  demandTop3Pct: 49.2,
  demandTop3Labels: "China + US + India",
  demandHhi: 1120,
  /** Hardest export market in the fuel ladder */
  exportTop1MaxPct: 35,
  exportTop1MaxLabel: "Indonesia (coal)",
  lngTop3Pct: 61,
  coalExportTop3Pct: 72,
  oilExportTop3Pct: 38,
  /** Clean-tech manufacturing */
  solarModuleTop1Pct: 80,
  batteryCellTop1Pct: 75,
  /** Import exposure extremes */
  japanImportDepPct: 88,
  euImportDepPct: 58,
  lensesTracked: 14,
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
  /** Approximate HHI on leading country shares (0–10,000) */
  hhi: number;
  unit: string;
  year: number;
  confidence: Confidence;
  relatedSlug?: string;
  note?: string;
  fill: string;
};

const CN = "#f43f5e";
const US = "#0ea5e9";
const ME = "#f59e0b";
const SEA = "#14b8a6";
const EU = "#8b5cf6";
const OTHER = "#64748b";

/** Cross-lens concentration table — Top-1 / Top-3 / HHI */
export const CONCENTRATION_ROWS: ConcentrationRow[] = [
  {
    id: "tpes-demand",
    label: "Primary energy demand (TPES)",
    shortLabel: "TPES demand",
    lens: "demand",
    regionHint: "Global",
    top1SharePct: 27.4,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 49.2,
    top3Labels: "China + US + India",
    hhi: 1120,
    unit: "% of world TPES (EJ)",
    year: 2024,
    confidence: "estimated",
    relatedSlug: "energy-systems-research-2026",
    note: "China ~170 EJ / world ~620 EJ",
    fill: CN,
  },
  {
    id: "coal-consume",
    label: "Coal consumption",
    shortLabel: "Coal use",
    lens: "demand",
    regionHint: "Asia-Pacific",
    top1SharePct: 56,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 74,
    top3Labels: "China + India + US",
    hhi: 3400,
    unit: "% of world coal demand",
    year: 2024,
    confidence: "estimated",
    note: "Asia dominates thermal + metallurgical demand",
    fill: CN,
  },
  {
    id: "elec-gen",
    label: "Electricity generation",
    shortLabel: "Power gen",
    lens: "demand",
    regionHint: "Global",
    top1SharePct: 32,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 55,
    top3Labels: "China + US + India",
    hhi: 1450,
    unit: "% of world TWh",
    year: 2024,
    confidence: "estimated",
    relatedSlug: "global-electricity-generation-mix-2024",
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
    top3SharePct: 40,
    top3Labels: "US + China + India",
    hhi: 780,
    unit: "% of world oil demand",
    year: 2024,
    confidence: "estimated",
    fill: US,
  },
  {
    id: "coal-export",
    label: "Hard coal exports",
    shortLabel: "Coal export",
    lens: "export",
    regionHint: "Asia-Pacific",
    top1SharePct: 35,
    top1Label: "Indonesia",
    top1Iso: "ID",
    top3SharePct: 72,
    top3Labels: "Indonesia + Australia + Russia",
    hhi: 2100,
    unit: "% of seaborne export tons",
    year: 2024,
    confidence: "estimated",
    fill: SEA,
  },
  {
    id: "lng-export",
    label: "LNG exports",
    shortLabel: "LNG export",
    lens: "export",
    regionHint: "Global",
    top1SharePct: 22,
    top1Label: "United States",
    top1Iso: "US",
    top3SharePct: 61,
    top3Labels: "US + Australia + Qatar",
    hhi: 1480,
    unit: "% of LNG export volumes",
    year: 2024,
    confidence: "secondary",
    relatedSlug: "lng-export-capacity-us-australia-qatar-2024",
    note: "Flexible + long-contract triopoly",
    fill: US,
  },
  {
    id: "pipe-gas",
    label: "Pipeline gas exports",
    shortLabel: "Pipe gas",
    lens: "export",
    regionHint: "Eurasia",
    top1SharePct: 18,
    top1Label: "Russia",
    top1Iso: "RU",
    top3SharePct: 48,
    top3Labels: "Russia + Norway + Canada",
    hhi: 920,
    unit: "% of inter-regional pipe trade",
    year: 2024,
    confidence: "estimated",
    note: "Post-2022 European route rewiring",
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
    year: 2024,
    confidence: "estimated",
    fill: ME,
  },
  {
    id: "oil-produce",
    label: "Crude oil production",
    shortLabel: "Oil produce",
    lens: "production",
    regionHint: "Global",
    top1SharePct: 13,
    top1Label: "United States",
    top1Iso: "US",
    top3SharePct: 36,
    top3Labels: "US + Saudi + Russia",
    hhi: 620,
    unit: "% of world crude output",
    year: 2024,
    confidence: "estimated",
    fill: US,
  },
  {
    id: "gas-produce",
    label: "Natural gas production",
    shortLabel: "Gas produce",
    lens: "production",
    regionHint: "Global",
    top1SharePct: 25,
    top1Label: "United States",
    top1Iso: "US",
    top3SharePct: 48,
    top3Labels: "US + Russia + Iran",
    hhi: 980,
    unit: "% of world gas output",
    year: 2024,
    confidence: "estimated",
    fill: US,
  },
  {
    id: "coal-produce",
    label: "Coal production",
    shortLabel: "Coal produce",
    lens: "production",
    regionHint: "Asia-Pacific",
    top1SharePct: 51,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 72,
    top3Labels: "China + India + Indonesia",
    hhi: 2900,
    unit: "% of world coal output",
    year: 2024,
    confidence: "estimated",
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
    year: 2024,
    confidence: "secondary",
    note: "IEA solar PV supply-chain report",
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
    year: 2024,
    confidence: "secondary",
    relatedSlug: "chokepoint-commodities-concentration-2026",
    fill: CN,
  },
  {
    id: "nuclear-cap",
    label: "Nuclear generating capacity",
    shortLabel: "Nuclear GW",
    lens: "production",
    regionHint: "Global",
    top1SharePct: 24,
    top1Label: "United States",
    top1Iso: "US",
    top3SharePct: 52,
    top3Labels: "US + France + China",
    hhi: 1100,
    unit: "% of operable nuclear GW",
    year: 2024,
    confidence: "estimated",
    fill: US,
  },
];

/** Demand ladder — cumulative share of world TPES */
export const DEMAND_LADDER = [
  { rank: 1, label: "China", sharePct: 27.4, cumulativePct: 27.4, ej: 170, fill: CN },
  { rank: 2, label: "United States", sharePct: 15.3, cumulativePct: 42.7, ej: 95, fill: US },
  { rank: 3, label: "India", sharePct: 6.5, cumulativePct: 49.2, ej: 40, fill: ME },
  { rank: 4, label: "Russia", sharePct: 4.8, cumulativePct: 54.0, ej: 30, fill: OTHER },
  { rank: 5, label: "Japan", sharePct: 2.7, cumulativePct: 56.7, ej: 17, fill: SEA },
  { rank: 6, label: "Rest of world", sharePct: 43.3, cumulativePct: 100, ej: 268, fill: EU },
];

export const CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 27.4, equalPct: 16.7 },
  { rank: 2, label: "Top-2", sharePct: 42.7, equalPct: 33.3 },
  { rank: 3, label: "Top-3", sharePct: 49.2, equalPct: 50 },
  { rank: 4, label: "Top-5", sharePct: 56.7, equalPct: 83.3 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
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
  fill: string;
};

export const FUEL_EXPORT_STACK: FuelExportRow[] = [
  {
    id: "coal",
    fuel: "Coal",
    top1Label: "Indonesia",
    top1SharePct: 35,
    top2Label: "Australia",
    top2SharePct: 22,
    top3Label: "Russia",
    top3SharePct: 15,
    top3BlocPct: 72,
    fill: SEA,
  },
  {
    id: "lng",
    fuel: "LNG",
    top1Label: "United States",
    top1SharePct: 22,
    top2Label: "Australia",
    top2SharePct: 20,
    top3Label: "Qatar",
    top3SharePct: 19,
    top3BlocPct: 61,
    fill: US,
  },
  {
    id: "pipe",
    fuel: "Pipe gas",
    top1Label: "Russia",
    top1SharePct: 18,
    top2Label: "Norway",
    top2SharePct: 16,
    top3Label: "Canada",
    top3SharePct: 14,
    top3BlocPct: 48,
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
  primaryEj: number;
  tradeStance: "net-importer" | "balanced" | "net-exporter";
  confidence: Confidence;
  fill: string;
};

/** Import dependence × fossil primary — who is exposed at the top of import risk */
export const IMPORT_EXPOSURE: ImportExposureRow[] = [
  {
    id: "japan",
    label: "Japan",
    shortLabel: "Japan",
    region: "Asia-Pacific",
    importDependencePct: 88,
    fossilPrimaryPct: 86,
    primaryEj: 17,
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
    primaryEj: 58,
    tradeStance: "net-importer",
    confidence: "disclosed",
    fill: EU,
  },
  {
    id: "germany",
    label: "Germany",
    shortLabel: "Germany",
    region: "Europe",
    importDependencePct: 65,
    fossilPrimaryPct: 77,
    primaryEj: 12,
    tradeStance: "net-importer",
    confidence: "estimated",
    fill: EU,
  },
  {
    id: "india",
    label: "India",
    shortLabel: "India",
    region: "Asia-Pacific",
    importDependencePct: 38,
    fossilPrimaryPct: 89,
    primaryEj: 40,
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
    primaryEj: 170,
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
    primaryEj: 95,
    tradeStance: "net-exporter",
    confidence: "estimated",
    fill: US,
  },
  {
    id: "canada",
    label: "Canada",
    shortLabel: "Canada",
    region: "North America",
    importDependencePct: -65,
    fossilPrimaryPct: 67,
    primaryEj: 14,
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
    primaryEj: 12,
    tradeStance: "net-exporter",
    confidence: "estimated",
    fill: ME,
  },
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
  metric: "top1" | "top3" | "hhi",
): ConcentrationRow[] {
  return [...rows].sort((a, b) => {
    const av =
      metric === "top1"
        ? a.top1SharePct
        : metric === "top3"
          ? a.top3SharePct
          : a.hhi;
    const bv =
      metric === "top1"
        ? b.top1SharePct
        : metric === "top3"
          ? b.top3SharePct
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

export const LENS_LABELS: Record<Lens, string> = {
  demand: "Demand",
  export: "Fuel exports",
  production: "Production",
  manufacturing: "Manufacturing",
  "import-exposure": "Import exposure",
};
