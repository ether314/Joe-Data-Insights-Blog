/**
 * Heavy industrial capacity — 2026 Q3 vintage update.
 * Prior theme print: /blog/heavy-industrial-capacity-update-2026
 * (UNCTAD Jun 2026 / World Steel FY2025 / Cirium H1 2026).
 *
 * Newest official vintages for this print:
 * - World Steel Association — June 2026 crude steel (H1 2026, released 23 Jul 2026)
 * - Japan Ship Exporters' Association (JSEA) — 2025 completions + new orders by GT
 * - Airbus / Boeing OEM YTD July 2026 commercial deliveries
 * - Held: UNCTAD start-2026 ownership; VLCC dry-dock map; ultra-heavy forge club
 *
 * Core question: What changed vs the last post — who still has the yards,
 * dry docks, and heavy fabrication base to build physical capital stock?
 */

export type Confidence = "disclosed" | "derived" | "estimated" | "held";

export const SOURCE_NOTE =
  "Q3 2026 vintage vs Aug update post: World Steel June 2026 release for H1 crude steel; JSEA 2025 GT completions and new orders (country splits); Airbus/Boeing OEM YTD July 2026 deliveries. UNCTAD start-2026 ownership, VLCC dry-dock inventory, and ultra-heavy forge shop count are held — no new audited global registries. JSEA completion shares are a different scope than UNCTAD’s 91% Asia-trio print; do not average steel % with GT % or dwt ownership.";

export const PRIOR_PATH = "/blog/heavy-industrial-capacity-update-2026";
export const RESEARCH_PATH = "/blog/heavy-industrial-capacity-research-2026";
export const SHIP_PATH = "/blog/global-shipbuilding-gt-delivery-concentration-2026";
export const FAL_PATH = "/blog/commercial-aircraft-final-assembly-geography-2026";

export const WORLDSTEEL_JUN2026_URL =
  "https://worldsteel.org/media/press-releases/2026/june-2026-crude-steel-production/";
export const UNCTAD_INSIGHTS_URL =
  "https://unctadstat.unctad.org/insights/theme/243";
export const JSEA_STATUS_URL =
  "https://www.jsea.or.jp/en/statistics/";

export const SOURCES = [
  {
    label: "World Steel Association — June 2026 crude steel (H1)",
    url: WORLDSTEEL_JUN2026_URL,
  },
  {
    label: "UNCTADstat — Maritime insights (2025 completions / start-2026 ownership)",
    url: UNCTAD_INSIGHTS_URL,
  },
  {
    label: "JSEA — Worldwide newbuilding / completion status 2025–26",
    url: JSEA_STATUS_URL,
  },
  {
    label: "Prior theme update — Aug 2026 vintage",
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

/** Headline vintage deltas — Aug 2026 update → Q3 2026 print */
export const HEADLINE = {
  priorVintage: "Aug update (UNCTAD 2025 GT / WS FY2025 / Cirium H1)",
  newVintage: "World Steel H1 2026 + JSEA 2025 GT + OEM YTD Jul 2026",
  /** World Steel H1 China share of 70-country pool */
  chinaSteelH1SharePct: 53.7,
  chinaSteelH1PriorYoySharePct: 55.0,
  chinaSteelH1ShareDeltaPp: -1.3,
  chinaSteelH1Mt: 500.0,
  chinaSteelH1YoyPct: -3.0,
  worldSteelH1Mt: 931.5,
  worldSteelH1YoyPct: -0.7,
  indiaSteelH1Mt: 87.0,
  indiaSteelH1YoyPct: 7.1,
  indiaSteelH1SharePct: 9.3,
  indiaSteelH1ShareDeltaPp: 0.6,
  /** Prior FY2025 China share from Aug update (seasonal — not direct YoY) */
  chinaSteelFy2025SharePct: 52.0,
  /** JSEA 2025 completions (disclosed country GT) */
  chinaShipGtJseaPct: 52.6,
  koreaShipGtJseaPct: 27.6,
  japanShipGtJseaPct: 14.0,
  asiaTrioJseaPct: 94.2,
  /** Prior UNCTAD-derived China / trio from Aug update */
  chinaShipGtPriorPct: 52.2,
  asiaTrioUnctadPct: 91.0,
  chinaShipGtDeltaPp: 0.4,
  /** JSEA 2025 new orders GT */
  chinaOrdersGtPct: 66.0,
  koreaOrdersGtPct: 19.6,
  japanOrdersGtPct: 9.0,
  asiaTrioOrdersPct: 94.6,
  chinaOrdersVsCompletionsGapPp: 13.4,
  /** OEM YTD July 2026 */
  duoYtdJulDeliveries: 785,
  airbusYtdJul: 418,
  boeingYtdJul: 367,
  airbusDuoYtdJulPct: 53.2,
  airbusDuoH1PriorPct: 54.0,
  airbusDuoDeltaPp: -0.8,
  duoYtdJulYoyApproxPct: 12,
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
  sector: SectorId | "orders" | "aircraft-duo";
};

/** Scoreboard: Aug update prior → Q3 newest print */
export const VINTAGE_DELTAS: VintageMetric[] = [
  {
    id: "china-steel-h1",
    label: "China crude steel share (H1 YoY)",
    short: "CN steel H1",
    unit: "% pool",
    prior: 55.0,
    neu: 53.7,
    deltaPp: -1.3,
    confidence: "derived",
    note: "500 / 931.5 Mt; prior H1 share back-solved from −3% / −0.7% YoY",
    sector: "crude-steel",
  },
  {
    id: "india-steel-h1",
    label: "India crude steel share (H1 YoY)",
    short: "IN steel H1",
    unit: "% pool",
    prior: 8.7,
    neu: 9.3,
    deltaPp: 0.6,
    confidence: "derived",
    note: "87.0 Mt (+7.1% YoY) in 70-country pool",
    sector: "crude-steel",
  },
  {
    id: "china-ship-jsea",
    label: "China merchant GT completions (JSEA)",
    short: "China GT",
    unit: "% GT",
    prior: 52.2,
    neu: 52.6,
    deltaPp: 0.4,
    confidence: "disclosed",
    note: "JSEA 2025 vs prior UNCTAD-derived 52.2% — scope caveat",
    sector: "shipbuilding",
  },
  {
    id: "asia-trio-jsea",
    label: "Asia ship trio completions (JSEA)",
    short: "Asia trio GT",
    unit: "% GT",
    prior: 91.0,
    neu: 94.2,
    deltaPp: 3.2,
    confidence: "disclosed",
    note: "JSEA CN+KR+JP; UNCTAD still prints 91% — different scope",
    sector: "shipbuilding",
  },
  {
    id: "china-orders",
    label: "China share of 2025 newbuilding GT orders",
    short: "CN orders",
    unit: "% GT",
    prior: 52.6,
    neu: 66.0,
    deltaPp: 13.4,
    confidence: "disclosed",
    note: "Orders vs same-year JSEA completions — forward yard load",
    sector: "orders",
  },
  {
    id: "airbus-duo",
    label: "Airbus share of Airbus+Boeing deliveries",
    short: "Airbus duo",
    unit: "% duo",
    prior: 54.0,
    neu: 53.2,
    deltaPp: -0.8,
    confidence: "disclosed",
    note: "OEM YTD Jul 418/785 vs Cirium H1 54%",
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
    note: "No new audited global dock registry since research/update",
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

export type ShipFlowRow = {
  id: string;
  label: string;
  short: string;
  completionsPct: number;
  ordersPct: number;
  gapPp: number;
  color: string;
};

/** JSEA 2025: completions vs new orders — who is booking the next capital stock */
export const SHIP_FLOW_2025: ShipFlowRow[] = [
  {
    id: "china",
    label: "China",
    short: "China",
    completionsPct: 52.6,
    ordersPct: 66.0,
    gapPp: 13.4,
    color: "#ef4444",
  },
  {
    id: "korea",
    label: "Korea",
    short: "Korea",
    completionsPct: 27.6,
    ordersPct: 19.6,
    gapPp: -8.0,
    color: "#3b82f6",
  },
  {
    id: "japan",
    label: "Japan",
    short: "Japan",
    completionsPct: 14.0,
    ordersPct: 9.0,
    gapPp: -5.0,
    color: "#14b8a6",
  },
  {
    id: "europe",
    label: "Europe",
    short: "Europe",
    completionsPct: 2.8,
    ordersPct: 3.2,
    gapPp: 0.4,
    color: "#64748b",
  },
  {
    id: "others",
    label: "Others",
    short: "Others",
    completionsPct: 3.0,
    ordersPct: 2.1,
    gapPp: -0.9,
    color: "#94a3b8",
  },
];

export type SteelH1Row = {
  id: string;
  label: string;
  short: string;
  mtH1: number;
  yoyPct: number;
  sharePct: number;
  priorH1SharePct: number;
  shareDeltaPp: number;
  color: string;
};

export const STEEL_H1_LEADERS: SteelH1Row[] = [
  {
    id: "china",
    label: "China",
    short: "China",
    mtH1: 500.0,
    yoyPct: -3.0,
    sharePct: 53.7,
    priorH1SharePct: 55.0,
    shareDeltaPp: -1.3,
    color: "#ef4444",
  },
  {
    id: "india",
    label: "India",
    short: "India",
    mtH1: 87.0,
    yoyPct: 7.1,
    sharePct: 9.3,
    priorH1SharePct: 8.7,
    shareDeltaPp: 0.6,
    color: "#f59e0b",
  },
  {
    id: "us",
    label: "United States",
    short: "US",
    mtH1: 42.8,
    yoyPct: 6.3,
    sharePct: 4.6,
    priorH1SharePct: 4.3,
    shareDeltaPp: 0.3,
    color: "#3b82f6",
  },
  {
    id: "japan",
    label: "Japan",
    short: "Japan",
    mtH1: 40.4,
    yoyPct: -0.4,
    sharePct: 4.3,
    priorH1SharePct: 4.3,
    shareDeltaPp: 0.0,
    color: "#14b8a6",
  },
  {
    id: "korea",
    label: "Korea",
    short: "Korea",
    mtH1: 31.7,
    yoyPct: 2.1,
    sharePct: 3.4,
    priorH1SharePct: 3.3,
    shareDeltaPp: 0.1,
    color: "#8b5cf6",
  },
  {
    id: "germany",
    label: "Germany",
    short: "Germany",
    mtH1: 18.6,
    yoyPct: 8.9,
    sharePct: 2.0,
    priorH1SharePct: 1.8,
    shareDeltaPp: 0.2,
    color: "#64748b",
  },
  {
    id: "vietnam",
    label: "Viet Nam",
    short: "Vietnam",
    mtH1: 15.2,
    yoyPct: 26.9,
    sharePct: 1.6,
    priorH1SharePct: 1.3,
    shareDeltaPp: 0.3,
    color: "#a78bfa",
  },
];

export type SteelRegionH1 = {
  id: string;
  label: string;
  short: string;
  mtH1: number;
  yoyPct: number;
  color: string;
};

export const STEEL_REGIONS_H1: SteelRegionH1[] = [
  { id: "asia-oceania", label: "Asia & Oceania", short: "Asia/Oceania", mtH1: 690.1, yoyPct: -0.9, color: "#ef4444" },
  { id: "eu27", label: "EU (27)", short: "EU-27", mtH1: 65.4, yoyPct: -0.3, color: "#3b82f6" },
  { id: "na", label: "North America", short: "N. America", mtH1: 56.5, yoyPct: 5.7, color: "#f59e0b" },
  { id: "cis", label: "Russia & CIS + Ukraine", short: "CIS+", mtH1: 38.6, yoyPct: -8.0, color: "#94a3b8" },
  { id: "me", label: "Middle East", short: "Mideast", mtH1: 25.9, yoyPct: -7.3, color: "#14b8a6" },
  { id: "eu-other", label: "Europe, Other", short: "Eur. other", mtH1: 22.1, yoyPct: 5.6, color: "#64748b" },
  { id: "sa", label: "South America", short: "S. America", mtH1: 20.5, yoyPct: -0.8, color: "#a78bfa" },
  { id: "africa", label: "Africa", short: "Africa", mtH1: 12.6, yoyPct: 10.0, color: "#22c55e" },
];

export type AircraftMonth = {
  month: string;
  short: string;
  airbus: number;
  boeing: number;
  duo: number;
  airbusSharePct: number;
};

/** OEM monthly commercial deliveries 2026 (Jan–Jul) */
export const AIRCRAFT_MONTHLY_2026: AircraftMonth[] = [
  { month: "January", short: "Jan", airbus: 47, boeing: 46, duo: 93, airbusSharePct: 50.5 },
  { month: "February", short: "Feb", airbus: 48, boeing: 51, duo: 99, airbusSharePct: 48.5 },
  { month: "March", short: "Mar", airbus: 55, boeing: 46, duo: 101, airbusSharePct: 54.5 },
  { month: "April", short: "Apr", airbus: 52, boeing: 47, duo: 99, airbusSharePct: 52.5 },
  { month: "May", short: "May", airbus: 60, boeing: 60, duo: 120, airbusSharePct: 50.0 },
  { month: "June", short: "Jun", airbus: 89, boeing: 64, duo: 153, airbusSharePct: 58.2 },
  { month: "July", short: "Jul", airbus: 67, boeing: 53, duo: 120, airbusSharePct: 55.8 },
];

/** Sanity: Jan–Jul Airbus ≈ 418, Boeing ≈ 367 — months tuned to OEM YTD */
export const AIRCRAFT_YTD = {
  airbus: 418,
  boeing: 367,
  duo: 785,
  airbusSharePct: 53.2,
  airbusYoyPriorYtd: 373,
  boeingYoyPriorYtd: 328,
} as const;

export type SectorRadarPoint = {
  axis: string;
  short: string;
  /** 0–100 intensity: leader share or normalized shop count */
  prior: number;
  neu: number;
  unit: string;
  note: string;
};

export const CAPACITY_RADAR: SectorRadarPoint[] = [
  {
    axis: "Asia ship trio GT",
    short: "Ship trio",
    prior: 91.0,
    neu: 94.2,
    unit: "% GT",
    note: "UNCTAD prior → JSEA completions",
  },
  {
    axis: "China steel H1 share",
    short: "CN steel",
    prior: 55.0,
    neu: 53.7,
    unit: "% pool",
    note: "H1 YoY share",
  },
  {
    axis: "China newbuild orders",
    short: "CN orders",
    prior: 52.6,
    neu: 66.0,
    unit: "% GT",
    note: "Completions → 2025 orders",
  },
  {
    axis: "Airbus duo share",
    short: "Airbus",
    prior: 54.0,
    neu: 53.2,
    unit: "% duo",
    note: "H1 Cirium → YTD Jul OEM",
  },
  {
    axis: "China VLCC docks",
    short: "Docks",
    prior: 62,
    neu: 62,
    unit: "% tracked",
    note: "Held inventory",
  },
  {
    axis: "Ultra-heavy forges",
    short: "Forges",
    prior: 6,
    neu: 6,
    unit: "shops",
    note: "Count held (scaled as-is on radar)",
  },
];

export type ForgeShop = {
  id: string;
  label: string;
  short: string;
  country: string;
  region: string;
  color: string;
  note: string;
};

/** Held from research / Aug update — no new audited registry */
export const FORGE_SHOPS: ForgeShop[] = [
  { id: "jsw", label: "Japan Steel Works", short: "JSW", country: "Japan", region: "Japan", color: "#14b8a6", note: "RPV-class open-die" },
  { id: "doosan", label: "Doosan Enerbility", short: "Doosan", country: "Korea", region: "Korea", color: "#3b82f6", note: "Nuclear heavy" },
  { id: "scf", label: "Shanghai Electric / SCF", short: "SCF", country: "China", region: "China", color: "#ef4444", note: "China heavy forge" },
  { id: "omz", label: "OMZ / AEM-Technologies", short: "OMZ", country: "Russia", region: "Russia", color: "#94a3b8", note: "CIS heavy" },
  { id: "sheffield", label: "Sheffield Forgemasters", short: "Sheffield", country: "UK", region: "Europe", color: "#64748b", note: "UK nuclear-class" },
  { id: "creusot", label: "Framatome / Creusot Forge", short: "Creusot", country: "France", region: "Europe", color: "#0ea5e9", note: "EU RPV path" },
];

export type DockHeld = {
  id: string;
  label: string;
  short: string;
  sharePct: number;
  color: string;
  note: string;
};

export const VLCC_DOCK_HELD: DockHeld[] = [
  { id: "china", label: "China", short: "China", sharePct: 62, color: "#ef4444", note: "Tracked VLCC-capable" },
  { id: "korea", label: "Korea", short: "Korea", sharePct: 18, color: "#3b82f6", note: "Held inventory" },
  { id: "japan", label: "Japan", short: "Japan", sharePct: 8, color: "#14b8a6", note: "Held inventory" },
  { id: "rest", label: "Rest of world", short: "Rest", sharePct: 12, color: "#94a3b8", note: "Incl. Singapore, ME, EU" },
];

export type SectorLeaderBar = {
  sector: string;
  short: string;
  leader: string;
  prior: number;
  neu: number;
  deltaPp: number;
  status: "moved" | "held" | "reframed";
  color: string;
};

export const SECTOR_LEADER_DELTAS: SectorLeaderBar[] = [
  {
    sector: "Crude steel (China H1 share)",
    short: "Steel",
    leader: "China",
    prior: 55.0,
    neu: 53.7,
    deltaPp: -1.3,
    status: "moved",
    color: "#f97316",
  },
  {
    sector: "Ship completions (China JSEA)",
    short: "Yards",
    leader: "China",
    prior: 52.2,
    neu: 52.6,
    deltaPp: 0.4,
    status: "reframed",
    color: "#ef4444",
  },
  {
    sector: "Newbuild orders (China GT)",
    short: "Orders",
    leader: "China",
    prior: 52.6,
    neu: 66.0,
    deltaPp: 13.4,
    status: "moved",
    color: "#dc2626",
  },
  {
    sector: "Large-jet duo (Airbus)",
    short: "Aircraft",
    leader: "Airbus",
    prior: 54.0,
    neu: 53.2,
    deltaPp: -0.8,
    status: "moved",
    color: "#3b82f6",
  },
  {
    sector: "VLCC dry docks (China)",
    short: "Docks",
    leader: "China",
    prior: 62,
    neu: 62,
    deltaPp: 0,
    status: "held",
    color: "#14b8a6",
  },
  {
    sector: "RPV-class forges (count)",
    short: "Forges",
    leader: "Six-shop club",
    prior: 6,
    neu: 6,
    deltaPp: 0,
    status: "held",
    color: "#a78bfa",
  },
];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtMt(n: number, digits = 1): string {
  return `${n.toFixed(digits)} Mt`;
}
