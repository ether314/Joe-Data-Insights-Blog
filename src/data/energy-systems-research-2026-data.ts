/**
 * Energy systems research 2026 — how countries source, mix, and trade energy.
 * Primary: Energy Institute Statistical Review of World Energy 2025 (2024 data);
 *   Eurostat energy-import-dependency (EU aggregate); Ember / OWID electricity shares.
 * Secondary: GIIGNL / IEA for LNG trade shares; BP/EI historical continuity where noted.
 */

export const SOURCE_NOTE =
  "Primary energy and fossil trade shares from Energy Institute Statistical Review of World Energy 2025 (2024 calendar year). Electricity generation shares aligned with Ember / Our World in Data 2024 country extracts used elsewhere on this site. EU energy import dependency from Eurostat (2023 latest full release; labeled). LNG export shares from GIIGNL Annual Report 2025 / IEA gas market notes (2024 trade year). Country shares are rounded; primary-energy and electricity mixes are different denominators and must not be averaged.";

export const EI_REVIEW_URL =
  "https://www.energyinst.org/statistical-review";

export const EUROSTAT_IMPORT_URL =
  "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Energy_imports_dependency";

export type Region =
  | "North America"
  | "Europe"
  | "Asia-Pacific"
  | "Middle East"
  | "Latin America"
  | "Eurasia"
  | "Africa"
  | "Global";

export type TradeStance = "net-importer" | "balanced" | "net-exporter";

export type Confidence = "disclosed" | "estimated" | "secondary";

/** Country ledger: primary mix + electricity fossil share + import dependence */
export type CountryEnergyRow = {
  id: string;
  label: string;
  shortLabel: string;
  iso: string;
  region: Region;
  /** Total primary energy supply, EJ (approx EI 2024) */
  primaryEj: number;
  oilSharePct: number;
  gasSharePct: number;
  coalSharePct: number;
  nuclearSharePct: number;
  hydroSharePct: number;
  otherRenewSharePct: number;
  /** Electricity generation fossil share (%) — Ember/OWID 2024 */
  elecFossilSharePct: number;
  elecRenewSharePct: number;
  elecNuclearSharePct: number;
  /** Net energy import dependence: imports / gross available energy (%). Negative ≈ net exporter */
  importDependencePct: number;
  tradeStance: TradeStance;
  confidence: Confidence;
  note?: string;
};

export type FuelTradeRow = {
  id: string;
  fuel: "oil" | "lng" | "coal" | "pipeline-gas";
  label: string;
  top1Label: string;
  top1SharePct: number;
  top3Labels: string;
  top3SharePct: number;
  unit: string;
  year: number;
  confidence: Confidence;
  relatedSlug?: string;
  note?: string;
};

export type MixSourceKey =
  | "oil"
  | "gas"
  | "coal"
  | "nuclear"
  | "hydro"
  | "otherRenew";

export const MIX_COLORS: Record<MixSourceKey, string> = {
  oil: "#92400e",
  gas: "#f59e0b",
  coal: "#374151",
  nuclear: "#7c3aed",
  hydro: "#0284c7",
  otherRenew: "#22c55e",
};

export const MIX_ORDER: MixSourceKey[] = [
  "oil",
  "gas",
  "coal",
  "nuclear",
  "hydro",
  "otherRenew",
];

export const MIX_LABELS: Record<MixSourceKey, string> = {
  oil: "Oil",
  gas: "Gas",
  coal: "Coal",
  nuclear: "Nuclear",
  hydro: "Hydro",
  otherRenew: "Other renewables",
};

/**
 * Selected large systems — primary shares approximate EI SR 2025 (2024).
 * Import dependence: Eurostat for EU; national energy balances / IEA for others (rounded).
 */
export const COUNTRIES: CountryEnergyRow[] = [
  {
    id: "world",
    label: "World",
    shortLabel: "World",
    iso: "WLD",
    region: "Global",
    primaryEj: 620,
    oilSharePct: 31.5,
    gasSharePct: 23.5,
    coalSharePct: 26.5,
    nuclearSharePct: 4.0,
    hydroSharePct: 6.5,
    otherRenewSharePct: 8.0,
    elecFossilSharePct: 59,
    elecRenewSharePct: 31,
    elecNuclearSharePct: 9,
    importDependencePct: 0,
    tradeStance: "balanced",
    confidence: "estimated",
    note: "World aggregates net to ~0 trade dependence by construction",
  },
  {
    id: "china",
    label: "China",
    shortLabel: "China",
    iso: "CN",
    region: "Asia-Pacific",
    primaryEj: 170,
    oilSharePct: 18,
    gasSharePct: 9,
    coalSharePct: 55,
    nuclearSharePct: 2.5,
    hydroSharePct: 8,
    otherRenewSharePct: 7.5,
    elecFossilSharePct: 63,
    elecRenewSharePct: 32,
    elecNuclearSharePct: 5,
    importDependencePct: 22,
    tradeStance: "net-importer",
    confidence: "estimated",
    note: "Coal-heavy primary; oil/gas import exposure rising",
  },
  {
    id: "us",
    label: "United States",
    shortLabel: "US",
    iso: "US",
    region: "North America",
    primaryEj: 95,
    oilSharePct: 37,
    gasSharePct: 33,
    coalSharePct: 10,
    nuclearSharePct: 8,
    hydroSharePct: 2.5,
    otherRenewSharePct: 9.5,
    elecFossilSharePct: 58,
    elecRenewSharePct: 23,
    elecNuclearSharePct: 18,
    importDependencePct: -8,
    tradeStance: "net-exporter",
    confidence: "estimated",
    note: "Net energy exporter since late 2010s (oil+gas surplus)",
  },
  {
    id: "eu27",
    label: "European Union (27)",
    shortLabel: "EU-27",
    iso: "EU",
    region: "Europe",
    primaryEj: 58,
    oilSharePct: 36,
    gasSharePct: 22,
    coalSharePct: 11,
    nuclearSharePct: 12,
    hydroSharePct: 5,
    otherRenewSharePct: 14,
    elecFossilSharePct: 32,
    elecRenewSharePct: 47,
    elecNuclearSharePct: 23,
    importDependencePct: 58,
    tradeStance: "net-importer",
    confidence: "disclosed",
    note: "Eurostat energy import dependency ~58% (2023)",
  },
  {
    id: "india",
    label: "India",
    shortLabel: "India",
    iso: "IN",
    region: "Asia-Pacific",
    primaryEj: 40,
    oilSharePct: 28,
    gasSharePct: 6,
    coalSharePct: 55,
    nuclearSharePct: 1.5,
    hydroSharePct: 4,
    otherRenewSharePct: 5.5,
    elecFossilSharePct: 75,
    elecRenewSharePct: 22,
    elecNuclearSharePct: 3,
    importDependencePct: 38,
    tradeStance: "net-importer",
    confidence: "estimated",
  },
  {
    id: "japan",
    label: "Japan",
    shortLabel: "Japan",
    iso: "JP",
    region: "Asia-Pacific",
    primaryEj: 17,
    oilSharePct: 38,
    gasSharePct: 22,
    coalSharePct: 26,
    nuclearSharePct: 4,
    hydroSharePct: 4,
    otherRenewSharePct: 6,
    elecFossilSharePct: 68,
    elecRenewSharePct: 24,
    elecNuclearSharePct: 8,
    importDependencePct: 88,
    tradeStance: "net-importer",
    confidence: "estimated",
  },
  {
    id: "korea",
    label: "South Korea",
    shortLabel: "Korea",
    iso: "KR",
    region: "Asia-Pacific",
    primaryEj: 12,
    oilSharePct: 40,
    gasSharePct: 18,
    coalSharePct: 26,
    nuclearSharePct: 12,
    hydroSharePct: 0.5,
    otherRenewSharePct: 3.5,
    elecFossilSharePct: 62,
    elecRenewSharePct: 9,
    elecNuclearSharePct: 29,
    importDependencePct: 82,
    tradeStance: "net-importer",
    confidence: "estimated",
  },
  {
    id: "russia",
    label: "Russia",
    shortLabel: "Russia",
    iso: "RU",
    region: "Eurasia",
    primaryEj: 30,
    oilSharePct: 22,
    gasSharePct: 52,
    coalSharePct: 14,
    nuclearSharePct: 6,
    hydroSharePct: 5.5,
    otherRenewSharePct: 0.5,
    elecFossilSharePct: 60,
    elecRenewSharePct: 18,
    elecNuclearSharePct: 20,
    importDependencePct: -75,
    tradeStance: "net-exporter",
    confidence: "estimated",
  },
  {
    id: "saudi",
    label: "Saudi Arabia",
    shortLabel: "Saudi",
    iso: "SA",
    region: "Middle East",
    primaryEj: 12,
    oilSharePct: 58,
    gasSharePct: 40,
    coalSharePct: 0,
    nuclearSharePct: 0,
    hydroSharePct: 0,
    otherRenewSharePct: 2,
    elecFossilSharePct: 99,
    elecRenewSharePct: 1,
    elecNuclearSharePct: 0,
    importDependencePct: -180,
    tradeStance: "net-exporter",
    confidence: "estimated",
    note: "Large oil export surplus vs domestic TPES",
  },
  {
    id: "brazil",
    label: "Brazil",
    shortLabel: "Brazil",
    iso: "BR",
    region: "Latin America",
    primaryEj: 13,
    oilSharePct: 38,
    gasSharePct: 10,
    coalSharePct: 5,
    nuclearSharePct: 1,
    hydroSharePct: 28,
    otherRenewSharePct: 18,
    elecFossilSharePct: 12,
    elecRenewSharePct: 85,
    elecNuclearSharePct: 2,
    importDependencePct: 8,
    tradeStance: "balanced",
    confidence: "estimated",
  },
  {
    id: "canada",
    label: "Canada",
    shortLabel: "Canada",
    iso: "CA",
    region: "North America",
    primaryEj: 14,
    oilSharePct: 32,
    gasSharePct: 30,
    coalSharePct: 5,
    nuclearSharePct: 6,
    hydroSharePct: 22,
    otherRenewSharePct: 5,
    elecFossilSharePct: 18,
    elecRenewSharePct: 68,
    elecNuclearSharePct: 14,
    importDependencePct: -65,
    tradeStance: "net-exporter",
    confidence: "estimated",
  },
  {
    id: "australia",
    label: "Australia",
    shortLabel: "Australia",
    iso: "AU",
    region: "Asia-Pacific",
    primaryEj: 6,
    oilSharePct: 34,
    gasSharePct: 26,
    coalSharePct: 28,
    nuclearSharePct: 0,
    hydroSharePct: 2,
    otherRenewSharePct: 10,
    elecFossilSharePct: 62,
    elecRenewSharePct: 38,
    elecNuclearSharePct: 0,
    importDependencePct: -140,
    tradeStance: "net-exporter",
    confidence: "estimated",
    note: "Coal + LNG export surplus dwarfs domestic TPES",
  },
  {
    id: "germany",
    label: "Germany",
    shortLabel: "Germany",
    iso: "DE",
    region: "Europe",
    primaryEj: 12,
    oilSharePct: 34,
    gasSharePct: 25,
    coalSharePct: 18,
    nuclearSharePct: 1,
    hydroSharePct: 2,
    otherRenewSharePct: 20,
    elecFossilSharePct: 42,
    elecRenewSharePct: 55,
    elecNuclearSharePct: 0,
    importDependencePct: 65,
    tradeStance: "net-importer",
    confidence: "estimated",
  },
  {
    id: "france",
    label: "France",
    shortLabel: "France",
    iso: "FR",
    region: "Europe",
    primaryEj: 9,
    oilSharePct: 30,
    gasSharePct: 15,
    coalSharePct: 3,
    nuclearSharePct: 36,
    hydroSharePct: 5,
    otherRenewSharePct: 11,
    elecFossilSharePct: 8,
    elecRenewSharePct: 28,
    elecNuclearSharePct: 64,
    importDependencePct: 45,
    tradeStance: "net-importer",
    confidence: "estimated",
    note: "Nuclear cuts electricity fossil share far below primary oil/gas dependence",
  },
  {
    id: "uk",
    label: "United Kingdom",
    shortLabel: "UK",
    iso: "GB",
    region: "Europe",
    primaryEj: 7,
    oilSharePct: 36,
    gasSharePct: 35,
    coalSharePct: 3,
    nuclearSharePct: 7,
    hydroSharePct: 1,
    otherRenewSharePct: 18,
    elecFossilSharePct: 38,
    elecRenewSharePct: 48,
    elecNuclearSharePct: 14,
    importDependencePct: 40,
    tradeStance: "net-importer",
    confidence: "estimated",
  },
  {
    id: "indonesia",
    label: "Indonesia",
    shortLabel: "Indonesia",
    iso: "ID",
    region: "Asia-Pacific",
    primaryEj: 10,
    oilSharePct: 30,
    gasSharePct: 16,
    coalSharePct: 42,
    nuclearSharePct: 0,
    hydroSharePct: 3,
    otherRenewSharePct: 9,
    elecFossilSharePct: 82,
    elecRenewSharePct: 18,
    elecNuclearSharePct: 0,
    importDependencePct: -15,
    tradeStance: "net-exporter",
    confidence: "estimated",
    note: "Coal exporter; oil importer — stance nets slightly export",
  },
];

/** Fuel-market export / trade concentration */
export const FUEL_TRADES: FuelTradeRow[] = [
  {
    id: "lng-export",
    fuel: "lng",
    label: "LNG exports",
    top1Label: "United States",
    top1SharePct: 22,
    top3Labels: "US + Australia + Qatar",
    top3SharePct: 61,
    unit: "% of global LNG export volumes (2024)",
    year: 2024,
    confidence: "secondary",
    relatedSlug: "lng-export-capacity-us-australia-qatar-2024",
    note: "Triopoly of flexible + contract LNG supply",
  },
  {
    id: "oil-export",
    fuel: "oil",
    label: "Crude oil exports",
    top1Label: "Saudi Arabia",
    top1SharePct: 15,
    top3Labels: "Saudi + Russia + Iraq",
    top3SharePct: 38,
    unit: "% of global crude export volumes (2024e)",
    year: 2024,
    confidence: "estimated",
  },
  {
    id: "coal-export",
    fuel: "coal",
    label: "Hard coal exports",
    top1Label: "Indonesia",
    top1SharePct: 35,
    top3Labels: "Indonesia + Australia + Russia",
    top3SharePct: 72,
    unit: "% of seaborne thermal+coking export tons (2024e)",
    year: 2024,
    confidence: "estimated",
  },
  {
    id: "pipe-gas",
    fuel: "pipeline-gas",
    label: "Pipeline gas exports",
    top1Label: "Russia",
    top1SharePct: 18,
    top3Labels: "Russia + Norway + Canada",
    top3SharePct: 48,
    unit: "% of inter-regional pipeline gas trade (2024e)",
    year: 2024,
    confidence: "estimated",
    note: "Post-2022 European route rewiring; share is volume not revenue",
  },
];

export const HEADLINE = {
  countriesTracked: COUNTRIES.filter((c) => c.id !== "world").length,
  euImportDependencePct: 58,
  japanImportDependencePct: 88,
  usNetExporter: true,
  lngTop3SharePct: 61,
  chinaCoalPrimaryPct: 55,
  franceElecNuclearPct: 64,
  worldElecFossilPct: 59,
};

export function fossilPrimaryShare(row: CountryEnergyRow): number {
  return row.oilSharePct + row.gasSharePct + row.coalSharePct;
}

export function lowCarbonPrimaryShare(row: CountryEnergyRow): number {
  return row.nuclearSharePct + row.hydroSharePct + row.otherRenewSharePct;
}

export function filterCountries(opts: {
  region?: Region | "all";
  stance?: TradeStance | "all";
  excludeWorld?: boolean;
}): CountryEnergyRow[] {
  const {
    region = "all",
    stance = "all",
    excludeWorld = true,
  } = opts;
  return COUNTRIES.filter((c) => {
    if (excludeWorld && c.id === "world") return false;
    if (region !== "all" && c.region !== region) return false;
    if (stance !== "all" && c.tradeStance !== stance) return false;
    return true;
  });
}

export function stackedMixRows(
  rows: CountryEnergyRow[],
): Array<Record<string, string | number>> {
  return rows.map((c) => ({
    id: c.id,
    label: c.shortLabel,
    oil: c.oilSharePct,
    gas: c.gasSharePct,
    coal: c.coalSharePct,
    nuclear: c.nuclearSharePct,
    hydro: c.hydroSharePct,
    otherRenew: c.otherRenewSharePct,
    fossil: fossilPrimaryShare(c),
    importDep: c.importDependencePct,
  }));
}

/** Primary fossil % vs electricity fossil % — slope / paired comparison */
export function primaryVsElecSlopes(rows: CountryEnergyRow[]) {
  return rows.map((c) => ({
    id: c.id,
    label: c.shortLabel,
    primaryFossil: Math.round(fossilPrimaryShare(c) * 10) / 10,
    elecFossil: c.elecFossilSharePct,
    delta: Math.round((c.elecFossilSharePct - fossilPrimaryShare(c)) * 10) / 10,
  }));
}

export function importScatter(rows: CountryEnergyRow[]) {
  return rows.map((c) => ({
    id: c.id,
    label: c.shortLabel,
    region: c.region,
    importDep: c.importDependencePct,
    fossilPrimary: Math.round(fossilPrimaryShare(c) * 10) / 10,
    primaryEj: c.primaryEj,
    stance: c.tradeStance,
  }));
}

export function rankedByImport(rows: CountryEnergyRow[]) {
  return [...rows].sort(
    (a, b) => b.importDependencePct - a.importDependencePct,
  );
}

export function fmtPct(n: number, digits = 0): string {
  const sign = n > 0 && n < 0.05 ? "" : n > 0 ? "" : "";
  void sign;
  return `${n.toFixed(digits)}%`;
}

export function fmtImportDep(n: number): string {
  if (n < 0) return `${n.toFixed(0)}% (net export)`;
  return `${n.toFixed(0)}%`;
}

export function fmtEj(n: number): string {
  return `${n.toFixed(0)} EJ`;
}
