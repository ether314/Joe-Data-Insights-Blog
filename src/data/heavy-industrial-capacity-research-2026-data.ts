/**
 * Heavy industrial capacity research 2026 — yards, dry docks, FALs, ultra-heavy forging.
 * Cross-sector builder-base map: who can still fabricate the physical capital stock.
 *
 * Shipbuilding GT shares: UNCTAD RMT 2025 (Clarksons). Aircraft site shares: FlightGlobal /
 * Cirium 2025 wraps + OEM FAL disclosures (aligned with companion posts). Dry-dock and
 * ultra-heavy forge tallies are disclosed-facility counts / industry compilations — not a
 * single audited global registry. Steel production: World Steel Association 2024.
 */

export const SOURCE_NOTE =
  "Merchant-ship GT delivery shares are UNCTAD Review of Maritime Transport 2025 (Clarksons). Large-jet FAL site shares reuse the 2025 attributed-handover frame from our commercial-aircraft geography companion (FlightGlobal / Cirium + OEM disclosures). Dry-dock and ultra-heavy forge counts are facility inventories from industry compilations and OEM/yard disclosures — coverage is incomplete outside the largest yards. Crude-steel production shares are World Steel Association 2024. Figures are not additive across sectors.";

export const SOURCES = [
  "UNCTAD — Review of Maritime Transport 2025 (shipbuilding GT deliveries; ownership)",
  "Clarksons Research — via UNCTAD RMT (orderbook / contracting context)",
  "FlightGlobal / Cirium — 2025 commercial delivery wraps",
  "Airbus / Boeing / COMAC — final-assembly network disclosures",
  "World Steel Association — World Steel in Figures 2025 (2024 production)",
  "Industry compilations — VLCC-capable dry docks; ultra-heavy nuclear forge shops (JSW, Doosan, CFHI, and peers)",
] as const;

export const HEADLINE = {
  chinaShipGtShare2024Pct: 54.6,
  asiaShipTrioShare2024Pct: 95.2,
  rentonLargeJetShare2025Pct: 31.7,
  top3FalShare2025Pct: 66.0,
  usFalShare2025Pct: 54.5,
  chinaSteelShare2024Pct: 53.8,
  vlccDockChinaSharePct: 62,
  ultraHeavyForgeShops: 6,
  usShipBuildShare2024Pct: 0.04,
} as const;

export type RegionId =
  | "china"
  | "korea"
  | "japan"
  | "europe"
  | "north-america"
  | "rest-asia"
  | "rest";

export type SectorId =
  | "shipbuilding"
  | "aircraft-fal"
  | "dry-docks"
  | "ultra-heavy-forge"
  | "crude-steel";

export type RegionRow = {
  id: RegionId;
  label: string;
  short: string;
  color: string;
};

export const REGIONS: RegionRow[] = [
  { id: "china", label: "China", short: "China", color: "#ef4444" },
  { id: "korea", label: "Republic of Korea", short: "Korea", color: "#3b82f6" },
  { id: "japan", label: "Japan", short: "Japan", color: "#14b8a6" },
  { id: "europe", label: "Europe", short: "Europe", color: "#64748b" },
  { id: "north-america", label: "North America", short: "N. America", color: "#f59e0b" },
  { id: "rest-asia", label: "Rest of Asia", short: "Rest Asia", color: "#a78bfa" },
  { id: "rest", label: "Rest of world", short: "Rest", color: "#94a3b8" },
];

/** Builder share (%) of each sector’s primary capacity metric — see SECTOR_META.units */
export type SectorShare = {
  sector: SectorId;
  region: RegionId;
  sharePct: number;
};

export const SECTOR_META: Record<
  SectorId,
  { label: string; short: string; metric: string; year: number }
> = {
  shipbuilding: {
    label: "Merchant shipbuilding (GT deliveries)",
    short: "Shipyards",
    metric: "% of GT delivered",
    year: 2024,
  },
  "aircraft-fal": {
    label: "Large-jet final assembly",
    short: "Aircraft FALs",
    metric: "% of attributed 2025 handovers",
    year: 2025,
  },
  "dry-docks": {
    label: "VLCC-capable dry docks (inventory)",
    short: "Dry docks",
    metric: "% of tracked large docks",
    year: 2025,
  },
  "ultra-heavy-forge": {
    label: "Ultra-heavy nuclear-class forges",
    short: "Heavy forges",
    metric: "% of tracked RPV-class shops",
    year: 2025,
  },
  "crude-steel": {
    label: "Crude steel production",
    short: "Crude steel",
    metric: "% of world crude steel",
    year: 2024,
  },
};

/**
 * Cross-sector regional shares (percent of each sector’s tracked pool).
 * Shipbuilding: UNCTAD RMT 2025. Aircraft: NA = US FALs; Europe = Airbus EU FALs;
 * China = Tianjin + Shanghai. Dry docks / forges: facility-count shares from
 * industry inventories (rounded). Steel: World Steel 2024 production.
 */
export const SECTOR_SHARES: SectorShare[] = [
  // Shipbuilding GT 2024
  { sector: "shipbuilding", region: "china", sharePct: 54.6 },
  { sector: "shipbuilding", region: "korea", sharePct: 28.0 },
  { sector: "shipbuilding", region: "japan", sharePct: 12.6 },
  { sector: "shipbuilding", region: "rest-asia", sharePct: 1.9 },
  { sector: "shipbuilding", region: "europe", sharePct: 0.9 },
  { sector: "shipbuilding", region: "north-america", sharePct: 0.04 },
  { sector: "shipbuilding", region: "rest", sharePct: 2.0 },
  // Large-jet FAL 2025 (NA ≈ US campuses; Asia rest folded into china for Tianjin/Shanghai)
  { sector: "aircraft-fal", region: "north-america", sharePct: 54.5 },
  { sector: "aircraft-fal", region: "europe", sharePct: 34.2 },
  { sector: "aircraft-fal", region: "china", sharePct: 11.2 },
  { sector: "aircraft-fal", region: "korea", sharePct: 0 },
  { sector: "aircraft-fal", region: "japan", sharePct: 0 },
  { sector: "aircraft-fal", region: "rest-asia", sharePct: 0 },
  { sector: "aircraft-fal", region: "rest", sharePct: 0.1 },
  // VLCC-capable dry docks (tracked inventory shares)
  { sector: "dry-docks", region: "china", sharePct: 62 },
  { sector: "dry-docks", region: "korea", sharePct: 18 },
  { sector: "dry-docks", region: "japan", sharePct: 8 },
  { sector: "dry-docks", region: "europe", sharePct: 5 },
  { sector: "dry-docks", region: "rest-asia", sharePct: 4 },
  { sector: "dry-docks", region: "north-america", sharePct: 2 },
  { sector: "dry-docks", region: "rest", sharePct: 1 },
  // Ultra-heavy forge shops (equal-weight across 6 tracked RPV-class facilities)
  { sector: "ultra-heavy-forge", region: "japan", sharePct: 33.3 },
  { sector: "ultra-heavy-forge", region: "korea", sharePct: 16.7 },
  { sector: "ultra-heavy-forge", region: "china", sharePct: 33.3 },
  { sector: "ultra-heavy-forge", region: "europe", sharePct: 16.7 },
  { sector: "ultra-heavy-forge", region: "north-america", sharePct: 0 },
  { sector: "ultra-heavy-forge", region: "rest-asia", sharePct: 0 },
  { sector: "ultra-heavy-forge", region: "rest", sharePct: 0 },
  // Crude steel 2024
  { sector: "crude-steel", region: "china", sharePct: 53.8 },
  { sector: "crude-steel", region: "europe", sharePct: 7.5 },
  { sector: "crude-steel", region: "japan", sharePct: 4.6 },
  { sector: "crude-steel", region: "korea", sharePct: 3.5 },
  { sector: "crude-steel", region: "north-america", sharePct: 5.4 },
  { sector: "crude-steel", region: "rest-asia", sharePct: 12.2 },
  { sector: "crude-steel", region: "rest", sharePct: 13.0 },
];

export type BuildOwnPoint = {
  id: string;
  label: string;
  short: string;
  /** Share of physical build capacity in primary sector (ship GT or aircraft FAL) */
  buildSharePct: number;
  /** Share of fleet / airline ownership or steel demand proxy */
  ownSharePct: number;
  sector: "shipping" | "aviation" | "steel";
  color: string;
};

/** Own-vs-build mismatches: ownership demand vs local fabrication base */
export const BUILD_VS_OWN: BuildOwnPoint[] = [
  {
    id: "cn-ship",
    label: "China (shipping)",
    short: "China ship",
    buildSharePct: 54.6,
    ownSharePct: 14.4,
    sector: "shipping",
    color: "#ef4444",
  },
  {
    id: "gr-ship",
    label: "Greece (shipping)",
    short: "Greece",
    buildSharePct: 0.1,
    ownSharePct: 16.4,
    sector: "shipping",
    color: "#0ea5e9",
  },
  {
    id: "jp-ship",
    label: "Japan (shipping)",
    short: "Japan ship",
    buildSharePct: 12.6,
    ownSharePct: 10.5,
    sector: "shipping",
    color: "#14b8a6",
  },
  {
    id: "kr-ship",
    label: "Korea (shipping)",
    short: "Korea ship",
    buildSharePct: 28.0,
    ownSharePct: 3.8,
    sector: "shipping",
    color: "#3b82f6",
  },
  {
    id: "us-ship",
    label: "United States (shipping)",
    short: "US ship",
    buildSharePct: 0.04,
    ownSharePct: 2.1,
    sector: "shipping",
    color: "#f59e0b",
  },
  {
    id: "us-air",
    label: "United States (aviation FAL)",
    short: "US FAL",
    buildSharePct: 54.5,
    ownSharePct: 28,
    sector: "aviation",
    color: "#fbbf24",
  },
  {
    id: "eu-air",
    label: "Europe (aviation FAL)",
    short: "EU FAL",
    buildSharePct: 34.2,
    ownSharePct: 22,
    sector: "aviation",
    color: "#64748b",
  },
  {
    id: "cn-air",
    label: "China (aviation FAL)",
    short: "CN FAL",
    buildSharePct: 11.2,
    ownSharePct: 18,
    sector: "aviation",
    color: "#f87171",
  },
  {
    id: "cn-steel",
    label: "China (steel)",
    short: "CN steel",
    buildSharePct: 53.8,
    ownSharePct: 52,
    sector: "steel",
    color: "#dc2626",
  },
  {
    id: "us-steel",
    label: "United States (steel)",
    short: "US steel",
    buildSharePct: 4.2,
    ownSharePct: 6.5,
    sector: "steel",
    color: "#d97706",
  },
];

export type YardNode = {
  id: string;
  name: string;
  short: string;
  country: string;
  region: RegionId;
  segment: "merchant" | "naval-specialist" | "offshore" | "repair";
  /** Relative capacity index 0–100 within tracked set (not absolute GT) */
  capacityIndex: number;
  largeDryDocks: number;
  color: string;
};

/** Illustrative major yard / dock complexes — capacityIndex is relative, not GT */
export const YARD_NODES: YardNode[] = [
  {
    id: "jiangnan",
    name: "Jiangnan / CSSC complex",
    short: "Jiangnan",
    country: "China",
    region: "china",
    segment: "merchant",
    capacityIndex: 96,
    largeDryDocks: 4,
    color: "#ef4444",
  },
  {
    id: "hd-hyundai",
    name: "HD Hyundai Heavy (Ulsan)",
    short: "HD Hyundai",
    country: "Korea",
    region: "korea",
    segment: "merchant",
    capacityIndex: 92,
    largeDryDocks: 3,
    color: "#3b82f6",
  },
  {
    id: "samsung-gi",
    name: "Samsung Heavy (Geoje)",
    short: "Samsung HI",
    country: "Korea",
    region: "korea",
    segment: "merchant",
    capacityIndex: 88,
    largeDryDocks: 3,
    color: "#2563eb",
  },
  {
    id: "hanwha",
    name: "Hanwha Ocean (Geoje)",
    short: "Hanwha",
    country: "Korea",
    region: "korea",
    segment: "offshore",
    capacityIndex: 78,
    largeDryDocks: 2,
    color: "#1d4ed8",
  },
  {
    id: "imabari",
    name: "Imabari Shipbuilding group",
    short: "Imabari",
    country: "Japan",
    region: "japan",
    segment: "merchant",
    capacityIndex: 72,
    largeDryDocks: 2,
    color: "#14b8a6",
  },
  {
    id: "jmuc",
    name: "Japan Marine United",
    short: "JMUC",
    country: "Japan",
    region: "japan",
    segment: "merchant",
    capacityIndex: 64,
    largeDryDocks: 2,
    color: "#0d9488",
  },
  {
    id: "newport-news",
    name: "Newport News Shipbuilding",
    short: "Newport News",
    country: "United States",
    region: "north-america",
    segment: "naval-specialist",
    capacityIndex: 58,
    largeDryDocks: 2,
    color: "#f59e0b",
  },
  {
    id: "fincantieri",
    name: "Fincantieri (cruise / naval)",
    short: "Fincantieri",
    country: "Italy",
    region: "europe",
    segment: "naval-specialist",
    capacityIndex: 52,
    largeDryDocks: 2,
    color: "#64748b",
  },
  {
    id: "meyer",
    name: "Meyer Werft (cruise)",
    short: "Meyer",
    country: "Germany",
    region: "europe",
    segment: "naval-specialist",
    capacityIndex: 48,
    largeDryDocks: 1,
    color: "#475569",
  },
  {
    id: "philly",
    name: "Philadelphia / US repair yards",
    short: "US repair",
    country: "United States",
    region: "north-america",
    segment: "repair",
    capacityIndex: 28,
    largeDryDocks: 1,
    color: "#b45309",
  },
];

export type ForgeShop = {
  id: string;
  name: string;
  short: string;
  country: string;
  region: RegionId;
  /** Max ingot / RPV-class capability band */
  capability: "rpv-class" | "large-rotor" | "heavy-vessel";
  color: string;
};

export const FORGE_SHOPS: ForgeShop[] = [
  {
    id: "jsw",
    name: "Japan Steel Works (Muroran)",
    short: "JSW Muroran",
    country: "Japan",
    region: "japan",
    capability: "rpv-class",
    color: "#14b8a6",
  },
  {
    id: "doosan",
    name: "Doosan Enerbility (Changwon)",
    short: "Doosan",
    country: "Korea",
    region: "korea",
    capability: "rpv-class",
    color: "#3b82f6",
  },
  {
    id: "cfhi",
    name: "China First Heavy Industries",
    short: "CFHI",
    country: "China",
    region: "china",
    capability: "rpv-class",
    color: "#ef4444",
  },
  {
    id: "sec",
    name: "Shanghai Electric heavy forge",
    short: "Shanghai Elec.",
    country: "China",
    region: "china",
    capability: "rpv-class",
    color: "#f87171",
  },
  {
    id: "framatome",
    name: "Framatome / Le Creusot complex",
    short: "Le Creusot",
    country: "France",
    region: "europe",
    capability: "rpv-class",
    color: "#64748b",
  },
  {
    id: "sheffield",
    name: "Sheffield Forgemasters",
    short: "Sheffield",
    country: "United Kingdom",
    region: "europe",
    capability: "heavy-vessel",
    color: "#94a3b8",
  },
];

export type CapacityMilestone = {
  year: number;
  chinaShipPct: number;
  koreaShipPct: number;
  japanShipPct: number;
  note: string;
};

/** Narrative share path for merchant GT (benchmarks, not full annual series) */
export const SHIP_SHARE_MILESTONES: CapacityMilestone[] = [
  { year: 1980, chinaShipPct: 2, koreaShipPct: 5, japanShipPct: 50, note: "Japan peak-era share" },
  { year: 2000, chinaShipPct: 7, koreaShipPct: 30, japanShipPct: 28, note: "Korea ascent" },
  { year: 2010, chinaShipPct: 38, koreaShipPct: 32, japanShipPct: 20, note: "China overtakes" },
  { year: 2016, chinaShipPct: 35, koreaShipPct: 35, japanShipPct: 20, note: "Korea output peak ~35%" },
  { year: 2023, chinaShipPct: 50, koreaShipPct: 28, japanShipPct: 15, note: "China crosses 50%" },
  { year: 2024, chinaShipPct: 54.6, koreaShipPct: 28.0, japanShipPct: 12.6, note: "UNCTAD RMT 2025" },
];

export type FalSiteSlim = {
  id: string;
  site: string;
  short: string;
  region: RegionId;
  deliveries2025: number;
  sharePct: number;
  color: string;
};

/** Large-jet FAL ladder (aligned with companion geography post) */
export const FAL_SITES: FalSiteSlim[] = [
  { id: "rtn", site: "Renton, WA", short: "Renton", region: "north-america", deliveries2025: 447, sharePct: 31.7, color: "#f59e0b" },
  { id: "ham", site: "Hamburg", short: "Hamburg", region: "europe", deliveries2025: 268, sharePct: 19.0, color: "#0ea5e9" },
  { id: "tls", site: "Toulouse", short: "Toulouse", region: "europe", deliveries2025: 214, sharePct: 15.2, color: "#0284c7" },
  { id: "mob", site: "Mobile, AL", short: "Mobile", region: "north-america", deliveries2025: 168, sharePct: 11.9, color: "#fbbf24" },
  { id: "tjn", site: "Tianjin", short: "Tianjin", region: "china", deliveries2025: 143, sharePct: 10.2, color: "#ef4444" },
  { id: "chs", site: "Charleston, SC", short: "Charleston", region: "north-america", deliveries2025: 88, sharePct: 6.3, color: "#d97706" },
  { id: "evt", site: "Everett, WA", short: "Everett", region: "north-america", deliveries2025: 65, sharePct: 4.6, color: "#b45309" },
  { id: "sha", site: "Shanghai", short: "Shanghai", region: "china", deliveries2025: 15, sharePct: 1.1, color: "#f87171" },
];

export function regionLabel(id: RegionId): string {
  return REGIONS.find((r) => r.id === id)?.label ?? id;
}

export function regionColor(id: RegionId): string {
  return REGIONS.find((r) => r.id === id)?.color ?? "#94a3b8";
}

export function sharesForSector(sector: SectorId): Array<SectorShare & { label: string; short: string; color: string }> {
  return SECTOR_SHARES.filter((s) => s.sector === sector)
    .map((s) => {
      const r = REGIONS.find((x) => x.id === s.region)!;
      return { ...s, label: r.label, short: r.short, color: r.color };
    })
    .sort((a, b) => b.sharePct - a.sharePct);
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function topShare(sector: SectorId): { region: RegionId; sharePct: number } {
  const rows = sharesForSector(sector);
  return { region: rows[0].region, sharePct: rows[0].sharePct };
}
