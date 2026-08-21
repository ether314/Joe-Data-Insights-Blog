/**
 * Heavy industrial capacity — August 2026 vintage update.
 * Prior theme print: /blog/heavy-industrial-capacity-research-2026
 * (UNCTAD RMT 2025 / 2024 GT deliveries; World Steel 2024; 2025 FAL frame).
 *
 * Newest official vintages:
 * - UNCTADstat maritime insights (updated 18 Jun 2026): 2025 GT completions
 * - World Steel Association — Dec 2025 / World Steel in Figures 2026 (2025 crude steel)
 * - Cirium H1 2026 commercial delivery wrap (Airbus/Boeing duo)
 * - Ownership: UNCTADstat beginning-of-2026 beneficial-ownership dwt
 *
 * Core question: What changed in the newest official vintage versus the last
 * post — who still has the yards, dry docks, and heavy fabrication base?
 */

export type Confidence = "disclosed" | "derived" | "estimated" | "held";

export const SOURCE_NOTE =
  "August 2026 vintage vs research post: UNCTADstat maritime insights (18 Jun 2026) for 2025 GT completions and start-2026 ownership; World Steel Association Dec 2025 / WSIF 2026 for 2025 crude steel; Cirium H1 2026 for Airbus/Boeing commercial deliveries. Dry-dock and ultra-heavy forge inventories are held from the research post (no new audited global registry). GT shares and dwt ownership are different units — do not average across sectors.";

export const PRIOR_PATH = "/blog/heavy-industrial-capacity-research-2026";
export const SHIP_PATH = "/blog/global-shipbuilding-gt-delivery-concentration-2026";
export const FAL_PATH = "/blog/commercial-aircraft-final-assembly-geography-2026";
export const FISCAL_PATH = "/blog/fiscal-industrial-policy-update-202608";

export const UNCTAD_INSIGHTS_URL =
  "https://unctadstat.unctad.org/insights/theme/243";
export const WORLDSTEEL_2025_URL =
  "https://worldsteel.org/media/press-releases/2026/december-2025-crude-steel-production-2025-global-crude-steel-production/";
export const CIRIUM_H1_URL =
  "https://www.cirium.com/thoughtcloud/2026-commercial-aircraft-h1-deliveries-close-to-2018-peak/";

export const SOURCES = [
  {
    label: "UNCTADstat — Maritime insights (updated 18 Jun 2026)",
    url: UNCTAD_INSIGHTS_URL,
  },
  {
    label: "World Steel Association — 2025 crude steel totals",
    url: WORLDSTEEL_2025_URL,
  },
  {
    label: "Cirium — H1 2026 commercial aircraft deliveries",
    url: CIRIUM_H1_URL,
  },
  {
    label: "Prior theme research — cross-sector builder base",
    url: PRIOR_PATH,
  },
  {
    label: "Companion — shipbuilding GT concentration",
    url: SHIP_PATH,
  },
  {
    label: "Companion — commercial aircraft FAL geography",
    url: FAL_PATH,
  },
] as const;

/** Headline vintage deltas — research prior → Aug 2026 print */
export const HEADLINE = {
  priorVintage: "Research 2026 (2024 GT / 2024 steel / 2025 FAL)",
  newVintage: "UNCTAD Jun 2026 + World Steel 2025 + Cirium H1 2026",
  asiaTrioPriorPct: 95.2,
  asiaTrioNewPct: 91.0,
  asiaTrioDeltaPp: -4.2,
  chinaShipGtPriorPct: 54.6,
  /** Scaled within UNCTAD trio using prior relative weights (derived) */
  chinaShipGtNewPct: 52.2,
  chinaShipGtDeltaPp: -2.4,
  koreaShipGtPriorPct: 28.0,
  koreaShipGtNewPct: 26.8,
  japanShipGtPriorPct: 12.6,
  japanShipGtNewPct: 12.0,
  restShipGtPriorPct: 4.8,
  restShipGtNewPct: 9.0,
  chinaSteelPriorPct: 53.8,
  chinaSteelNewPct: 52.0,
  chinaSteelDeltaPp: -1.8,
  chinaSteelMt2025: 960.8,
  chinaSteelMt2024: 1005.1,
  chinaSteelYoyPct: -4.4,
  worldSteelMt2025: 1849.4,
  worldSteelMt2024: 1886.3,
  indiaSteelMt2025: 164.9,
  indiaSteelYoyPct: 10.4,
  indiaSteelSharePct: 8.9,
  greeceOwnMdwt: 397,
  chinaOwnMdwt: 377,
  japanOwnMdwt: 243,
  worldFleetMdwt: 2500,
  greeceOwnSharePct: 15.9,
  chinaOwnSharePct: 15.1,
  chinaOwnPriorPct: 14.4,
  duoH1Deliveries: 649,
  airbusH1SharePct: 54,
  airbusH1Approx: 350,
  boeingH1Approx: 299,
  duoH1YoyVsPriorHalfPct: 14,
  rentonPriorLargeJetPct: 31.7,
  /** ~200 MAX-8 of 649 duo H1 — Renton still ~30% of duo (derived) */
  rentonH1DuoSharePct: 30.8,
  usFalPriorPct: 54.5,
  vlccDockChinaPct: 62,
  ultraHeavyForgeShops: 6,
  usShipBuildSharePct: 0.04,
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

export type VintageMetric = {
  id: string;
  label: string;
  short: string;
  unit: string;
  prior: number;
  neu: number;
  deltaPp: number;
  confidence: Confidence;
  note: string;
  sector: SectorId | "ownership" | "aircraft-duo";
};

/** Scoreboard: prior research print → newest vintage */
export const VINTAGE_DELTAS: VintageMetric[] = [
  {
    id: "asia-trio",
    label: "Asia ship trio (CN+KR+JP GT completions)",
    short: "Asia trio GT",
    unit: "% GT",
    prior: 95.2,
    neu: 91.0,
    deltaPp: -4.2,
    confidence: "disclosed",
    note: "UNCTAD 2025 completions vs research 2024 deliveries",
    sector: "shipbuilding",
  },
  {
    id: "china-ship",
    label: "China merchant shipbuilding share",
    short: "China GT",
    unit: "% GT",
    prior: 54.6,
    neu: 52.2,
    deltaPp: -2.4,
    confidence: "derived",
    note: "Prior relative weight scaled into UNCTAD 91% trio",
    sector: "shipbuilding",
  },
  {
    id: "rest-ship",
    label: "Rest of world shipbuilding (ex Asia trio)",
    short: "Rest GT",
    unit: "% GT",
    prior: 4.8,
    neu: 9.0,
    deltaPp: 4.2,
    confidence: "derived",
    note: "Implied residual after UNCTAD trio print",
    sector: "shipbuilding",
  },
  {
    id: "china-steel",
    label: "China crude steel share",
    short: "China steel",
    unit: "% world",
    prior: 53.8,
    neu: 52.0,
    deltaPp: -1.8,
    confidence: "disclosed",
    note: "960.8 / 1849.4 Mt (World Steel 2025)",
    sector: "crude-steel",
  },
  {
    id: "india-steel",
    label: "India crude steel share",
    short: "India steel",
    unit: "% world",
    prior: 7.9,
    neu: 8.9,
    deltaPp: 1.0,
    confidence: "derived",
    note: "164.9 Mt (+10.4% YoY); prior approx from 149.4/1886",
    sector: "crude-steel",
  },
  {
    id: "china-own",
    label: "China beneficial fleet ownership",
    short: "China own",
    unit: "% dwt",
    prior: 14.4,
    neu: 15.1,
    deltaPp: 0.7,
    confidence: "derived",
    note: "377 Mdwt / 2.5 Bdwt start-2026 vs RMT prior",
    sector: "ownership",
  },
  {
    id: "renton",
    label: "Renton large-jet / duo handover share",
    short: "Renton",
    unit: "%",
    prior: 31.7,
    neu: 30.8,
    deltaPp: -0.9,
    confidence: "estimated",
    note: "Prior = 2025 large-jet pool; new ≈ MAX-8 / duo H1",
    sector: "aircraft-duo",
  },
  {
    id: "airbus-duo",
    label: "Airbus share of Airbus+Boeing H1 deliveries",
    short: "Airbus duo",
    unit: "% duo",
    prior: 56.9,
    neu: 54.0,
    deltaPp: -2.9,
    confidence: "estimated",
    note: "Prior ≈ 793/(793+600) FY2025; new = Cirium H1 54%",
    sector: "aircraft-duo",
  },
  {
    id: "vlcc-docks",
    label: "China VLCC-capable dry-dock inventory",
    short: "CN docks",
    unit: "% tracked",
    prior: 62,
    neu: 62,
    deltaPp: 0,
    confidence: "held",
    note: "No new audited global dock registry since research",
    sector: "dry-docks",
  },
  {
    id: "forges",
    label: "Ultra-heavy RPV-class forge shops",
    short: "Forges",
    unit: "shops",
    prior: 6,
    neu: 6,
    deltaPp: 0,
    confidence: "held",
    note: "Six-shop club unchanged; still zero US RPV-class",
    sector: "ultra-heavy-forge",
  },
];

export type ShipMilestone = {
  year: number;
  label: string;
  chinaPct: number;
  koreaPct: number;
  japanPct: number;
  trioPct: number;
  note: string;
};

/** Long path + new 2025 UNCTAD trio print */
export const SHIP_SHARE_PATH: ShipMilestone[] = [
  {
    year: 1985,
    label: "'85",
    chinaPct: 2,
    koreaPct: 15,
    japanPct: 48,
    trioPct: 65,
    note: "Japan peak-era dominance (illustrative)",
  },
  {
    year: 2000,
    label: "'00",
    chinaPct: 8,
    koreaPct: 32,
    japanPct: 28,
    trioPct: 68,
    note: "Korea ascent",
  },
  {
    year: 2010,
    label: "'10",
    chinaPct: 38,
    koreaPct: 30,
    japanPct: 20,
    trioPct: 88,
    note: "China overtakes Korea",
  },
  {
    year: 2020,
    label: "'20",
    chinaPct: 43,
    koreaPct: 28,
    japanPct: 18,
    trioPct: 89,
    note: "Pre-50% China",
  },
  {
    year: 2023,
    label: "'23",
    chinaPct: 50.7,
    koreaPct: 28.2,
    japanPct: 14.9,
    trioPct: 93.8,
    note: "China clears 50% (RMT)",
  },
  {
    year: 2024,
    label: "'24",
    chinaPct: 54.6,
    koreaPct: 28.0,
    japanPct: 12.6,
    trioPct: 95.2,
    note: "Research prior (RMT 2025)",
  },
  {
    year: 2025,
    label: "'25",
    chinaPct: 52.2,
    koreaPct: 26.8,
    japanPct: 12.0,
    trioPct: 91.0,
    note: "UNCTAD trio 91%; country splits derived",
  },
];

export type SteelRow = {
  id: string;
  label: string;
  short: string;
  mt2024: number;
  mt2025: number;
  yoyPct: number;
  share2024Pct: number;
  share2025Pct: number;
  deltaPp: number;
  color: string;
};

export const STEEL_LEADERS: SteelRow[] = [
  {
    id: "china",
    label: "China",
    short: "China",
    mt2024: 1005.1,
    mt2025: 960.8,
    yoyPct: -4.4,
    share2024Pct: 53.3,
    share2025Pct: 52.0,
    deltaPp: -1.3,
    color: "#ef4444",
  },
  {
    id: "india",
    label: "India",
    short: "India",
    mt2024: 149.4,
    mt2025: 164.9,
    yoyPct: 10.4,
    share2024Pct: 7.9,
    share2025Pct: 8.9,
    deltaPp: 1.0,
    color: "#f59e0b",
  },
  {
    id: "us",
    label: "United States",
    short: "US",
    mt2024: 79.5,
    mt2025: 82.0,
    yoyPct: 3.1,
    share2024Pct: 4.2,
    share2025Pct: 4.4,
    deltaPp: 0.2,
    color: "#3b82f6",
  },
  {
    id: "japan",
    label: "Japan",
    short: "Japan",
    mt2024: 84.0,
    mt2025: 80.7,
    yoyPct: -4.0,
    share2024Pct: 4.5,
    share2025Pct: 4.4,
    deltaPp: -0.1,
    color: "#14b8a6",
  },
  {
    id: "korea",
    label: "Korea",
    short: "Korea",
    mt2024: 63.6,
    mt2025: 61.9,
    yoyPct: -2.8,
    share2024Pct: 3.4,
    share2025Pct: 3.3,
    deltaPp: -0.1,
    color: "#8b5cf6",
  },
  {
    id: "germany",
    label: "Germany",
    short: "Germany",
    mt2024: 37.3,
    mt2025: 34.1,
    yoyPct: -8.6,
    share2024Pct: 2.0,
    share2025Pct: 1.8,
    deltaPp: -0.2,
    color: "#64748b",
  },
];

/** Note: China share2024 here uses 1005.1/1886.3 ≈ 53.3; research cited 53.8 from WSIF vintage — flagged in caveats */

export type OwnBuildPoint = {
  id: string;
  label: string;
  short: string;
  buildSharePct: number;
  ownSharePct: number;
  priorOwnSharePct: number;
  sector: "shipping" | "aviation" | "steel";
  color: string;
  vintageNote: string;
};

export const BUILD_VS_OWN: OwnBuildPoint[] = [
  {
    id: "cn-ship",
    label: "China (shipping)",
    short: "China ship",
    buildSharePct: 52.2,
    ownSharePct: 15.1,
    priorOwnSharePct: 14.4,
    sector: "shipping",
    color: "#ef4444",
    vintageNote: "Build softens; ownership rises toward Greece",
  },
  {
    id: "gr-ship",
    label: "Greece (shipping)",
    short: "Greece",
    buildSharePct: 0.1,
    ownSharePct: 15.9,
    priorOwnSharePct: 16.4,
    sector: "shipping",
    color: "#0ea5e9",
    vintageNote: "Still #1 owner (397 Mdwt); gap to China narrows",
  },
  {
    id: "jp-ship",
    label: "Japan (shipping)",
    short: "Japan ship",
    buildSharePct: 12.0,
    ownSharePct: 9.7,
    priorOwnSharePct: 10.5,
    sector: "shipping",
    color: "#14b8a6",
    vintageNote: "243 Mdwt ownership; build share derived",
  },
  {
    id: "kr-ship",
    label: "Korea (shipping)",
    short: "Korea ship",
    buildSharePct: 26.8,
    ownSharePct: 3.8,
    priorOwnSharePct: 3.8,
    sector: "shipping",
    color: "#3b82f6",
    vintageNote: "Still builds far more than it owns",
  },
  {
    id: "us-ship",
    label: "United States (shipping)",
    short: "US ship",
    buildSharePct: 0.04,
    ownSharePct: 2.1,
    priorOwnSharePct: 2.1,
    sector: "shipping",
    color: "#f59e0b",
    vintageNote: "Commercial GT still ~0; ownership held",
  },
  {
    id: "us-air",
    label: "United States (aviation)",
    short: "US FAL",
    buildSharePct: 46.1,
    ownSharePct: 28,
    priorOwnSharePct: 28,
    sector: "aviation",
    color: "#fbbf24",
    vintageNote: "H1 duo: Boeing ~46% of Airbus+Boeing",
  },
  {
    id: "eu-air",
    label: "Europe (aviation)",
    short: "EU OEM",
    buildSharePct: 54.0,
    ownSharePct: 22,
    priorOwnSharePct: 22,
    sector: "aviation",
    color: "#64748b",
    vintageNote: "Airbus 54% of duo H1 2026",
  },
  {
    id: "cn-steel",
    label: "China (steel)",
    short: "CN steel",
    buildSharePct: 52.0,
    ownSharePct: 51,
    priorOwnSharePct: 52,
    sector: "steel",
    color: "#dc2626",
    vintageNote: "Share down; still near 1:1 with demand",
  },
  {
    id: "in-steel",
    label: "India (steel)",
    short: "IN steel",
    buildSharePct: 8.9,
    ownSharePct: 8.5,
    priorOwnSharePct: 7.5,
    sector: "steel",
    color: "#f59e0b",
    vintageNote: "Fastest large-producer YoY (+10.4%)",
  },
];

export type SectorDeltaBar = {
  sector: SectorId;
  label: string;
  short: string;
  leader: string;
  priorLeaderShare: number;
  newLeaderShare: number;
  deltaPp: number;
  status: "moved" | "held" | "reframed";
  color: string;
};

export const SECTOR_LEADER_DELTAS: SectorDeltaBar[] = [
  {
    sector: "shipbuilding",
    label: "Merchant shipbuilding (Asia trio)",
    short: "Shipyards",
    leader: "Asia trio",
    priorLeaderShare: 95.2,
    newLeaderShare: 91.0,
    deltaPp: -4.2,
    status: "moved",
    color: "#ef4444",
  },
  {
    sector: "crude-steel",
    label: "Crude steel (China)",
    short: "Steel",
    leader: "China",
    priorLeaderShare: 53.8,
    newLeaderShare: 52.0,
    deltaPp: -1.8,
    status: "moved",
    color: "#f97316",
  },
  {
    sector: "aircraft-fal",
    label: "Large-jet duo (Airbus H1 share)",
    short: "Aircraft",
    leader: "Airbus (duo)",
    priorLeaderShare: 56.9,
    newLeaderShare: 54.0,
    deltaPp: -2.9,
    status: "reframed",
    color: "#3b82f6",
  },
  {
    sector: "dry-docks",
    label: "VLCC-capable dry docks (China)",
    short: "Dry docks",
    leader: "China",
    priorLeaderShare: 62,
    newLeaderShare: 62,
    deltaPp: 0,
    status: "held",
    color: "#14b8a6",
  },
  {
    sector: "ultra-heavy-forge",
    label: "RPV-class forge shops (count)",
    short: "Forges",
    leader: "Six-shop club",
    priorLeaderShare: 6,
    newLeaderShare: 6,
    deltaPp: 0,
    status: "held",
    color: "#a78bfa",
  },
];

export type FalH1Row = {
  id: string;
  label: string;
  short: string;
  deliveries: number;
  sharePct: number;
  color: string;
  note: string;
};

/** Cirium H1 2026 duo + program highlights */
export const FAL_H1_2026: FalH1Row[] = [
  {
    id: "airbus",
    label: "Airbus (all FALs)",
    short: "Airbus",
    deliveries: 350,
    sharePct: 54.0,
    color: "#3b82f6",
    note: "Cirium 54% of duo; ~351 disclosed",
  },
  {
    id: "boeing",
    label: "Boeing (all FALs)",
    short: "Boeing",
    deliveries: 299,
    sharePct: 46.0,
    color: "#f59e0b",
    note: "Implied residual of 649 duo total",
  },
  {
    id: "renton-max8",
    label: "Boeing Renton (737-8 Max alone)",
    short: "Renton MAX-8",
    deliveries: 200,
    sharePct: 30.8,
    color: "#ef4444",
    note: "Just shy of 200; still ~31% of duo H1",
  },
  {
    id: "a321",
    label: "Airbus A321neo",
    short: "A321neo",
    deliveries: 167,
    sharePct: 25.7,
    color: "#0ea5e9",
    note: "Second-highest H1 type",
  },
];

export type ForgeShop = {
  id: string;
  name: string;
  short: string;
  country: string;
  region: RegionId;
  status: "held";
  color: string;
};

/** Unchanged six-shop inventory from research post */
export const FORGE_SHOPS: ForgeShop[] = [
  {
    id: "jsw",
    name: "Japan Steel Works (Muroran)",
    short: "JSW",
    country: "Japan",
    region: "japan",
    status: "held",
    color: "#14b8a6",
  },
  {
    id: "doosan",
    name: "Doosan Enerbility (Changwon)",
    short: "Doosan",
    country: "Korea",
    region: "korea",
    status: "held",
    color: "#3b82f6",
  },
  {
    id: "cfhi",
    name: "China First Heavy Industries",
    short: "CFHI",
    country: "China",
    region: "china",
    status: "held",
    color: "#ef4444",
  },
  {
    id: "shanghai",
    name: "Shanghai Electric heavy forge",
    short: "Shanghai",
    country: "China",
    region: "china",
    status: "held",
    color: "#f87171",
  },
  {
    id: "creusot",
    name: "Framatome / Le Creusot",
    short: "Le Creusot",
    country: "France",
    region: "europe",
    status: "held",
    color: "#64748b",
  },
  {
    id: "sheffield",
    name: "Sheffield Forgemasters",
    short: "Sheffield",
    country: "UK",
    region: "europe",
    status: "held",
    color: "#94a3b8",
  },
];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtMt(n: number): string {
  return `${n.toFixed(1)} Mt`;
}
