/**
 * AI semiconductor supply-chain — geography lens (2026).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * (Where are upstream/downstream bottlenecks in the chip stack?)
 *
 * Complements concentration (vendor top-1 / HHI by layer) and update vintages
 * (CoWoS capacity, Mid-Year equipment dollars) with regional / country share maps:
 * tool-install geography, stack-layer production seats, stage flips, and risk seats.
 *
 * Primary sources:
 * - SEMI WWSEMS 2025 equipment billings by region
 * - SEMI Mid-Year OEM Forecast (July 2026) + Q1 2026 billings
 * - Theme concentration / research / CoWoS trackers (layer geography carries)
 * - TrendForce / company disclosures — HBM, CoWoS, foundry location bands
 */

export type Confidence = "disclosed" | "estimated" | "editorial";

export const SOURCE_NOTE =
  "Equipment region shares are SEMI 2025 WWSEMS billings (disclosed). Stack-layer country seats and stage flips are editorial geography carries from theme concentration bands (foundry LE, CoWoS, HBM, EUV, GPU HQ) — not a single SEMI census. Risk scores (1–10) are desk composites of single-country tip × replaceability, not insurance ratings. Cross-map comparisons (tool install vs wafer seat vs design HQ) are illustrative; shares within each map sum ≈100%.";

export const PRIOR_RESEARCH_PATH = "/blog/ai-supply-chain-research-2026";
export const PRIOR_CONCENTRATION_PATH =
  "/blog/ai-supply-chain-concentration-2026";
export const PRIOR_AUG608_PATH = "/blog/ai-supply-chain-concentration-202608";
export const PRIOR_Q3_CONC_PATH =
  "/blog/ai-supply-chain-concentration-2026q3";
export const PRIOR_UPDATE_PATH = "/blog/ai-supply-chain-update-202608";
export const PRIOR_Q3_PATH = "/blog/ai-supply-chain-update-2026q3";
export const PACKAGING_PATH = "/blog/ai-gpu-packaging-memory-bottleneck-2025";

export const SOURCES = [
  {
    label: "SEMI — Mid-Year Total Equipment Forecast (July 2026)",
    url: "https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-sales-forecast-to-reach-a-record-229-billion-dollars-in-2028-semi-reports",
  },
  {
    label: "SEMI — 2025 Equipment Billings",
    url: "https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025",
  },
  {
    label: "Theme concentration — layer top-1 / HHI",
    url: PRIOR_CONCENTRATION_PATH,
  },
  {
    label: "Theme research — equipment cycle & bottlenecks",
    url: PRIOR_RESEARCH_PATH,
  },
  {
    label: "Q3 CoWoS tracker",
    url: PRIOR_Q3_PATH,
  },
] as const;

export const HEADLINE = {
  /** Equipment install geography (SEMI 2025 WWSEMS) */
  equipTop1Pct: 36.5,
  equipTop1Label: "China",
  equipTop3Pct: 78.9,
  equipTop3Label: "China + Taiwan + Korea",
  equipTotalBn2025: 135.1,
  taiwanEquipPct: 23.3,
  koreaEquipPct: 19.1,

  /** Stack bottleneck geography — production / capacity seats */
  taiwanFoundryLePct: 90,
  taiwanCowosPct: 78,
  koreaHbmPct: 53,
  netherlandsEuvPct: 100,
  usGpuHqPct: 88,

  /** Dual-map disagreement */
  eastAsiaEquipPct: 78.9,
  eastAsiaAdvancedSeatPct: 84,
  usDesignHqSeatPct: 55,

  /** Risk seats */
  taiwanDualGateLayers: 2,
  layersWithTop1Ge70: 5,
  singleCountryGates: 4,
} as const;

export type EquipRegion = {
  id: string;
  region: string;
  short: string;
  sharePct: number;
  billingsBn: number;
  cumulativePct: number;
  yoyHintPct: number | null;
  role: string;
  confidence: Confidence;
  fill: string;
};

/** SEMI 2025 WWSEMS regional equipment billings — sum ≈100%, $135.1B perimeter. */
export const EQUIPMENT_REGIONS: EquipRegion[] = [
  {
    id: "china",
    region: "China",
    short: "China",
    sharePct: 36.5,
    billingsBn: 49.3,
    cumulativePct: 36.5,
    yoyHintPct: 8,
    role: "Mature + trailing-edge install weight; export-control filter",
    confidence: "disclosed",
    fill: "#ef4444",
  },
  {
    id: "taiwan",
    region: "Taiwan",
    short: "Taiwan",
    sharePct: 23.3,
    billingsBn: 31.5,
    cumulativePct: 59.8,
    yoyHintPct: 24,
    role: "AI-install signature — leading-edge + CoWoS tools",
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "korea",
    region: "Korea",
    short: "Korea",
    sharePct: 19.1,
    billingsBn: 25.8,
    cumulativePct: 78.9,
    yoyHintPct: 16,
    role: "HBM / DRAM tool pull; memory-cycle overweight",
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    id: "n-america",
    region: "N. America",
    short: "N.Am",
    sharePct: 8.1,
    billingsBn: 10.9,
    cumulativePct: 87.0,
    yoyHintPct: 12,
    role: "CHIPS-era fabs + IDM; still thin vs Asia tip",
    confidence: "disclosed",
    fill: "#22c55e",
  },
  {
    id: "japan",
    region: "Japan",
    short: "Japan",
    sharePct: 7.0,
    billingsBn: 9.5,
    cumulativePct: 94.0,
    yoyHintPct: 5,
    role: "Materials + mature logic; wafer/chemicals adjacency",
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    id: "europe",
    region: "Europe",
    short: "Europe",
    sharePct: 2.1,
    billingsBn: 2.9,
    cumulativePct: 96.1,
    yoyHintPct: 3,
    role: "Thin install share; EUV IP sits in NL HQ, not EU fabs",
    confidence: "disclosed",
    fill: "#64748b",
  },
  {
    id: "row",
    region: "Rest of World",
    short: "RoW",
    sharePct: 3.9,
    billingsBn: 5.2,
    cumulativePct: 100,
    yoyHintPct: null,
    role: "SEA + other install residual",
    confidence: "disclosed",
    fill: "#94a3b8",
  },
];

export type StackGeoLayer = {
  id: string;
  layer: string;
  short: string;
  stage: "upstream" | "midstream" | "downstream";
  top1Country: string;
  top1SharePct: number;
  top2Country: string;
  top2SharePct: number;
  top3Country: string;
  top3SharePct: number;
  top3CumPct: number;
  riskScore: number;
  confidence: Confidence;
  fill: string;
  note: string;
};

/**
 * Geographic tip of each stack layer (production / capacity / HQ seat).
 * Complements vendor concentration: same tip, mapped to countries.
 */
export const STACK_GEO_LAYERS: StackGeoLayer[] = [
  {
    id: "euv",
    layer: "EUV lithography scanners",
    short: "EUV",
    stage: "upstream",
    top1Country: "Netherlands",
    top1SharePct: 100,
    top2Country: "—",
    top2SharePct: 0,
    top3Country: "—",
    top3SharePct: 0,
    top3CumPct: 100,
    riskScore: 10,
    confidence: "disclosed",
    fill: "#ef4444",
    note: "ASML sole volume EUV; tool IP in NL, installs mostly in Asia fabs.",
  },
  {
    id: "foundry-le",
    layer: "Leading-edge foundry (<7 nm)",
    short: "Foundry LE",
    stage: "midstream",
    top1Country: "Taiwan",
    top1SharePct: 90,
    top2Country: "Korea",
    top2SharePct: 8,
    top3Country: "United States",
    top3SharePct: 2,
    top3CumPct: 100,
    riskScore: 10,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "TSMC advanced-node revenue geography; not mature foundry.",
  },
  {
    id: "cowos",
    layer: "CoWoS-class AI packaging",
    short: "CoWoS",
    stage: "midstream",
    top1Country: "Taiwan",
    top1SharePct: 78,
    top2Country: "United States",
    top2SharePct: 12,
    top3Country: "Korea",
    top3SharePct: 5,
    top3CumPct: 95,
    riskScore: 10,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "TSMC CoWoS tip; OSAT / Amkor US+SEA and Samsung fill residual.",
  },
  {
    id: "gpu",
    layer: "AI data-center GPU / accel.",
    short: "AI GPU",
    stage: "downstream",
    top1Country: "United States",
    top1SharePct: 88,
    top2Country: "United States",
    top2SharePct: 7,
    top3Country: "Other",
    top3SharePct: 3,
    top3CumPct: 98,
    riskScore: 7,
    confidence: "estimated",
    fill: "#22c55e",
    note: "Design / revenue HQ geography (NVIDIA+AMD US); wafers still Asia-fabbed.",
  },
  {
    id: "hbm",
    layer: "HBM (high-bandwidth memory)",
    short: "HBM",
    stage: "midstream",
    top1Country: "Korea",
    top1SharePct: 88,
    top2Country: "United States",
    top2SharePct: 12,
    top3Country: "—",
    top3SharePct: 0,
    top3CumPct: 100,
    riskScore: 9,
    confidence: "estimated",
    fill: "#a855f7",
    note: "SK Hynix + Samsung Korea ~88%; Micron US ~12% — three-player, two-country.",
  },
  {
    id: "eda",
    layer: "EDA / design software",
    short: "EDA",
    stage: "upstream",
    top1Country: "United States",
    top1SharePct: 72,
    top2Country: "Germany",
    top2SharePct: 16,
    top3Country: "Other",
    top3SharePct: 12,
    top3CumPct: 100,
    riskScore: 6,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Synopsys + Cadence US duopoly; Siemens EDA Germany.",
  },
  {
    id: "wafers",
    layer: "300 mm silicon wafers",
    short: "Wafers",
    stage: "upstream",
    top1Country: "Japan",
    top1SharePct: 56,
    top2Country: "Taiwan",
    top2SharePct: 22,
    top3Country: "Germany",
    top3SharePct: 12,
    top3CumPct: 90,
    riskScore: 7,
    confidence: "estimated",
    fill: "#14b8a6",
    note: "Shin-Etsu / SUMCO Japan tip; GlobalWafers Taiwan; Siltronic DE.",
  },
  {
    id: "wfe",
    layer: "Wafer-fab equipment OEMs",
    short: "WFE OEMs",
    stage: "upstream",
    top1Country: "United States",
    top1SharePct: 42,
    top2Country: "Netherlands",
    top2SharePct: 28,
    top3Country: "Japan",
    top3SharePct: 20,
    top3CumPct: 90,
    riskScore: 5,
    confidence: "estimated",
    fill: "#64748b",
    note: "Applied / Lam / KLA US; ASML NL; Tokyo Electron JP — OEM HQ ≠ install geo.",
  },
];

export type StageFlip = {
  stage: "upstream" | "midstream" | "downstream";
  label: string;
  top1Region: string;
  top1SharePct: number;
  top2Region: string;
  top2SharePct: number;
  eastAsiaSharePct: number;
  fill: string;
  note: string;
};

/** Average geographic tip by stack stage — where bottlenecks sit on the map. */
export const STAGE_FLIPS: StageFlip[] = [
  {
    stage: "upstream",
    label: "Upstream (tools / materials / EDA)",
    top1Region: "United States + NL + Japan",
    top1SharePct: 58,
    top2Region: "Taiwan / other Asia",
    top2SharePct: 22,
    eastAsiaSharePct: 28,
    fill: "#0ea5e9",
    note: "OEM / IP HQ heavy in US-NL-JP; installs still Asia.",
  },
  {
    stage: "midstream",
    label: "Midstream (foundry / HBM / CoWoS)",
    top1Region: "Taiwan",
    top1SharePct: 56,
    top2Region: "Korea",
    top2SharePct: 32,
    eastAsiaSharePct: 92,
    fill: "#f59e0b",
    note: "Taiwan dual-gates foundry LE + CoWoS; Korea owns HBM tip.",
  },
  {
    stage: "downstream",
    label: "Downstream (AI GPU design / revenue)",
    top1Region: "United States",
    top1SharePct: 88,
    top2Region: "Other",
    top2SharePct: 12,
    eastAsiaSharePct: 5,
    fill: "#22c55e",
    note: "Design HQ is US-heavy; silicon still fabbed in East Asia.",
  },
];

export type CountryRiskSeat = {
  id: string;
  country: string;
  short: string;
  layersGated: number;
  peakSharePct: number;
  peakLayer: string;
  riskScore: number;
  equipSharePct: number | null;
  fill: string;
  note: string;
};

/** Countries that gate ≥1 critical layer — risk geography, not tool-dollar geography. */
export const COUNTRY_RISK_SEATS: CountryRiskSeat[] = [
  {
    id: "taiwan",
    country: "Taiwan",
    short: "TW",
    layersGated: 2,
    peakSharePct: 90,
    peakLayer: "Foundry LE",
    riskScore: 10,
    equipSharePct: 23.3,
    fill: "#0ea5e9",
    note: "Dual gate: leading-edge foundry (~90%) + CoWoS (~78%).",
  },
  {
    id: "netherlands",
    country: "Netherlands",
    short: "NL",
    layersGated: 1,
    peakSharePct: 100,
    peakLayer: "EUV",
    riskScore: 10,
    equipSharePct: null,
    fill: "#ef4444",
    note: "Sole EUV OEM seat; Europe install share only ~2%.",
  },
  {
    id: "korea",
    country: "Korea",
    short: "KR",
    layersGated: 1,
    peakSharePct: 88,
    peakLayer: "HBM",
    riskScore: 9,
    equipSharePct: 19.1,
    fill: "#8b5cf6",
    note: "SK Hynix + Samsung clear most HBM; memory-cycle install weight.",
  },
  {
    id: "united-states",
    country: "United States",
    short: "US",
    layersGated: 2,
    peakSharePct: 88,
    peakLayer: "AI GPU HQ",
    riskScore: 7,
    equipSharePct: 8.1,
    fill: "#22c55e",
    note: "GPU design + EDA tip; thin on advanced wafer seats.",
  },
  {
    id: "japan",
    country: "Japan",
    short: "JP",
    layersGated: 1,
    peakSharePct: 56,
    peakLayer: "Wafers",
    riskScore: 7,
    equipSharePct: 7.0,
    fill: "#f59e0b",
    note: "300 mm wafer tip; materials adjacency, not AI packaging.",
  },
  {
    id: "china",
    country: "China",
    short: "CN",
    layersGated: 0,
    peakSharePct: 36.5,
    peakLayer: "Equip install",
    riskScore: 6,
    equipSharePct: 36.5,
    fill: "#f43f5e",
    note: "Largest tool-install share; not the leading-edge / CoWoS / EUV tip.",
  },
];

export type MeterCompare = {
  id: string;
  label: string;
  top1Label: string;
  sharePct: number;
  fill: string;
};

/** Five geography meters that disagree — the post’s category-error guardrail. */
export const METER_COMPARE: MeterCompare[] = [
  {
    id: "equip",
    label: "Equipment billings",
    top1Label: "China",
    sharePct: 36.5,
    fill: "#ef4444",
  },
  {
    id: "equip-top3",
    label: "Equip top-3 (CN+TW+KR)",
    top1Label: "East Asia trio",
    sharePct: 78.9,
    fill: "#f97316",
  },
  {
    id: "foundry",
    label: "Leading-edge foundry",
    top1Label: "Taiwan",
    sharePct: 90,
    fill: "#0ea5e9",
  },
  {
    id: "cowos",
    label: "CoWoS packaging",
    top1Label: "Taiwan",
    sharePct: 78,
    fill: "#f59e0b",
  },
  {
    id: "hbm",
    label: "HBM capacity",
    top1Label: "Korea",
    sharePct: 88,
    fill: "#a855f7",
  },
  {
    id: "gpu",
    label: "AI GPU design HQ",
    top1Label: "United States",
    sharePct: 88,
    fill: "#22c55e",
  },
];

/** Editorial 2022→2025 East Asia trio share path (shape check, not new SEMI extract). */
export const EQUIP_PATH = [
  { year: 2022, china: 28, taiwan: 20, korea: 18, other: 34 },
  { year: 2023, china: 32, taiwan: 21, korea: 18, other: 29 },
  { year: 2024, china: 35, taiwan: 22, korea: 19, other: 24 },
  { year: 2025, china: 36.5, taiwan: 23.3, korea: 19.1, other: 21.1 },
] as const;

export type GeoScatterPoint = {
  id: string;
  short: string;
  top1SharePct: number;
  riskScore: number;
  stage: StackGeoLayer["stage"];
  fill: string;
};

export const GEO_SCATTER: GeoScatterPoint[] = STACK_GEO_LAYERS.map((l) => ({
  id: l.id,
  short: l.short,
  top1SharePct: l.top1SharePct,
  riskScore: l.riskScore,
  stage: l.stage,
  fill: l.fill,
}));

export const STAGE_COLORS = {
  upstream: "#0ea5e9",
  midstream: "#f59e0b",
  downstream: "#22c55e",
} as const;

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtBn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}B`;
}

export function equipBars() {
  return EQUIPMENT_REGIONS.map((r) => ({
    region: r.short,
    full: r.region,
    sharePct: r.sharePct,
    billingsBn: r.billingsBn,
    fill: r.fill,
  }));
}

export function equipPie() {
  return EQUIPMENT_REGIONS.map((r) => ({
    name: r.short,
    value: r.sharePct,
    fill: r.fill,
  }));
}

export function stackGeoBars(minTop1 = 0) {
  return STACK_GEO_LAYERS.filter((l) => l.top1SharePct >= minTop1)
    .slice()
    .sort((a, b) => b.top1SharePct - a.top1SharePct)
    .map((l) => ({
      short: l.short,
      layer: l.layer,
      top1Country: l.top1Country,
      top1SharePct: l.top1SharePct,
      top3CumPct: l.top3CumPct,
      riskScore: l.riskScore,
      stage: l.stage,
      fill: l.fill,
    }));
}

export function riskSeatBars() {
  return COUNTRY_RISK_SEATS.slice()
    .sort((a, b) => b.riskScore - a.riskScore || b.peakSharePct - a.peakSharePct)
    .map((c) => ({
      short: c.short,
      country: c.country,
      riskScore: c.riskScore,
      peakSharePct: c.peakSharePct,
      layersGated: c.layersGated,
      fill: c.fill,
    }));
}

export function layersByStage(stage: StackGeoLayer["stage"]) {
  return STACK_GEO_LAYERS.filter((l) => l.stage === stage);
}

export function meterBars() {
  return METER_COMPARE.map((m) => ({
    label: m.label,
    top1: m.top1Label,
    sharePct: m.sharePct,
    fill: m.fill,
  }));
}
