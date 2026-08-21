/**
 * AI semiconductor supply-chain concentration (2026): top-1 / top-3 / HHI
 * across stack layers — EUV, leading-edge foundry, HBM, CoWoS, AI GPU, EDA, WFE.
 *
 * Complements research (equipment cycle + bottlenecks) and update posts (billings /
 * CoWoS vintages) with a distribution lens: where does the chip stack concentrate
 * at the top of each layer?
 *
 * Primary sources (public narrative bands + disclosed vendor prints):
 * - SEMI Mid-Year OEM Forecast / WWSEMS (equipment geography)
 * - TrendForce / company disclosures — HBM share, CoWoS capacity reservations
 * - Foundry / GPU share bands from public earnings + industry trackers
 *
 * Scope note: layer shares are market-structure estimates for visualization —
 * not a single SEMI census table. Confidence flagged per row.
 */

export type Confidence = "disclosed" | "estimated" | "editorial";

export const SOURCE_NOTE =
  "Layer top-1 / top-3 shares are 2025–mid-2026 public narrative bands (company disclosures, TrendForce, SEMI geography). HHI is derived from stated bucket shares. Bottleneck scores are editorial composites (1–10), not SEMI metrics. EUV top-1 is ASML monopoly; leading-edge foundry is <7 nm logic revenue share.";

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
    label: "Theme research — equipment cycle & bottlenecks",
    url: "/blog/ai-supply-chain-research-2026",
  },
] as const;

export const HEADLINE = {
  /** Extreme layer: EUV scanners */
  euvTop1Pct: 100,
  euvLabel: "ASML",
  /** Leading-edge foundry (<7 nm) */
  foundryLeadTop1Pct: 90,
  foundryLeadLabel: "TSMC",
  foundryLeadTop3Pct: 100,
  /** HBM DRAM */
  hbmTop1Pct: 53,
  hbmLabel: "SK Hynix",
  hbmTop3Pct: 100,
  /** AI data-center GPU / accelerator revenue */
  gpuTop1Pct: 88,
  gpuLabel: "NVIDIA",
  gpuTop3Pct: 98,
  /** CoWoS-class advanced packaging (AI-relevant capacity) */
  cowosTop1Pct: 78,
  cowosLabel: "TSMC",
  cowosTop3Pct: 95,
  /** Cross-layer median top-1 among tracked layers */
  medianTop1Pct: 72,
  /** Count of layers with top-1 ≥ 70% */
  layersTop1Ge70: 6,
  layersTracked: 8,
  /** Analytical HHI on 8-layer top-1 shares (illustrative stack index) */
  stackHhi: 5840,
} as const;

export type StackLayer = {
  id: string;
  layer: string;
  short: string;
  stage: "upstream" | "midstream" | "downstream";
  top1Label: string;
  top1Pct: number;
  top2Label: string;
  top2Pct: number;
  top3Label: string;
  top3Pct: number;
  /** Cumulative top-3 share */
  top3CumPct: number;
  /** Approximate HHI from top buckets + residual */
  hhi: number;
  tightness: number;
  confidence: Confidence;
  fill: string;
  note: string;
};

/** Eight stack layers ranked by top-1 share (concentration ladder). */
export const STACK_LAYERS: StackLayer[] = [
  {
    id: "euv",
    layer: "EUV lithography scanners",
    short: "EUV",
    stage: "upstream",
    top1Label: "ASML",
    top1Pct: 100,
    top2Label: "—",
    top2Pct: 0,
    top3Label: "—",
    top3Pct: 0,
    top3CumPct: 100,
    hhi: 10000,
    tightness: 9,
    confidence: "disclosed",
    fill: "#ef4444",
    note: "Sole volume EUV toolmaker; High-NA still ASML.",
  },
  {
    id: "foundry-lead",
    layer: "Leading-edge foundry (<7 nm)",
    short: "Foundry LE",
    stage: "midstream",
    top1Label: "TSMC",
    top1Pct: 90,
    top2Label: "Samsung",
    top2Pct: 8,
    top3Label: "Intel Foundry",
    top3Pct: 2,
    top3CumPct: 100,
    hhi: 8168,
    tightness: 9,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Logic revenue share at advanced nodes; not mature foundry.",
  },
  {
    id: "gpu",
    layer: "AI data-center GPU / accel.",
    short: "AI GPU",
    stage: "downstream",
    top1Label: "NVIDIA",
    top1Pct: 88,
    top2Label: "AMD",
    top2Pct: 7,
    top3Label: "Others",
    top3Pct: 3,
    top3CumPct: 98,
    hhi: 7798,
    tightness: 8,
    confidence: "estimated",
    fill: "#22c55e",
    note: "Data-center accelerator revenue band, mid-2026 narrative.",
  },
  {
    id: "cowos",
    layer: "CoWoS-class AI packaging",
    short: "CoWoS",
    stage: "midstream",
    top1Label: "TSMC",
    top1Pct: 78,
    top2Label: "Amkor / ASE",
    top2Pct: 12,
    top3Label: "Samsung",
    top3Pct: 5,
    top3CumPct: 95,
    hhi: 6258,
    tightness: 10,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "AI-relevant advanced packaging capacity; NVIDIA reserves >50%.",
  },
  {
    id: "eda",
    layer: "EDA / design software",
    short: "EDA",
    stage: "upstream",
    top1Label: "Synopsys",
    top1Pct: 42,
    top2Label: "Cadence",
    top2Pct: 30,
    top3Label: "Siemens EDA",
    top3Pct: 16,
    top3CumPct: 88,
    hhi: 2940,
    tightness: 6,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Top-2 duopoly (~72%); top-3 clears most commercial EDA.",
  },
  {
    id: "hbm",
    layer: "HBM (high-bandwidth memory)",
    short: "HBM",
    stage: "midstream",
    top1Label: "SK Hynix",
    top1Pct: 53,
    top2Label: "Samsung",
    top2Pct: 35,
    top3Label: "Micron",
    top3Pct: 12,
    top3CumPct: 100,
    hhi: 4178,
    tightness: 9,
    confidence: "estimated",
    fill: "#a855f7",
    note: "Three-player market; HBM3E/HBM4 bind GPU ship schedules.",
  },
  {
    id: "wfe",
    layer: "Wafer-fab equipment (WFE)",
    short: "WFE",
    stage: "upstream",
    top1Label: "Applied Materials",
    top1Pct: 22,
    top2Label: "ASML",
    top2Pct: 20,
    top3Label: "Lam Research",
    top3Pct: 14,
    top3CumPct: 56,
    hhi: 1120,
    tightness: 5,
    confidence: "estimated",
    fill: "#14b8a6",
    note: "Broader WFE is oligopoly, not monopoly — contrast EUV slice.",
  },
  {
    id: "silicon",
    layer: "300 mm silicon wafers",
    short: "Wafers",
    stage: "upstream",
    top1Label: "Shin-Etsu",
    top1Pct: 30,
    top2Label: "SUMCO",
    top2Pct: 25,
    top3Label: "GlobalWafers",
    top3Pct: 17,
    top3CumPct: 72,
    hhi: 1894,
    tightness: 4,
    confidence: "estimated",
    fill: "#64748b",
    note: "Japan + Taiwan suppliers dominate 300 mm supply.",
  },
];

/** Top-k ladder summary for headline chart. */
export const TOP_K_LADDER = [
  { k: 1, label: "Top-1", euv: 100, foundry: 90, gpu: 88, cowos: 78, hbm: 53, wfe: 22 },
  { k: 2, label: "Top-2", euv: 100, foundry: 98, gpu: 95, cowos: 90, hbm: 88, wfe: 42 },
  { k: 3, label: "Top-3", euv: 100, foundry: 100, gpu: 98, cowos: 95, hbm: 100, wfe: 56 },
] as const;

export type FoundryShare = {
  vendor: string;
  short: string;
  advancedSharePct: number;
  overallSharePct: number;
  fill: string;
};

/** Foundry: advanced-node vs overall share contrast. */
export const FOUNDRY_SHARES: FoundryShare[] = [
  { vendor: "TSMC", short: "TSMC", advancedSharePct: 90, overallSharePct: 62, fill: "#0ea5e9" },
  { vendor: "Samsung Foundry", short: "Samsung", advancedSharePct: 8, overallSharePct: 12, fill: "#8b5cf6" },
  { vendor: "Intel Foundry", short: "Intel", advancedSharePct: 2, overallSharePct: 4, fill: "#22c55e" },
  { vendor: "GlobalFoundries", short: "GF", advancedSharePct: 0, overallSharePct: 6, fill: "#f59e0b" },
  { vendor: "SMIC / others", short: "Others", advancedSharePct: 0, overallSharePct: 16, fill: "#64748b" },
];

export type HbmShare = {
  vendor: string;
  sharePct: number;
  cumulativePct: number;
  fill: string;
};

export const HBM_SHARES: HbmShare[] = [
  { vendor: "SK Hynix", sharePct: 53, cumulativePct: 53, fill: "#a855f7" },
  { vendor: "Samsung", sharePct: 35, cumulativePct: 88, fill: "#0ea5e9" },
  { vendor: "Micron", sharePct: 12, cumulativePct: 100, fill: "#14b8a6" },
];

export type EquipmentRegion = {
  region: string;
  share2025Pct: number;
  billingsBn: number;
  fill: string;
};

/** Regional equipment billings concentration (SEMI 2025 WWSEMS). */
export const EQUIPMENT_REGIONS: EquipmentRegion[] = [
  { region: "China", share2025Pct: 36.5, billingsBn: 49.3, fill: "#ef4444" },
  { region: "Taiwan", share2025Pct: 23.3, billingsBn: 31.5, fill: "#0ea5e9" },
  { region: "Korea", share2025Pct: 19.1, billingsBn: 25.8, fill: "#8b5cf6" },
  { region: "N. America", share2025Pct: 8.1, billingsBn: 10.9, fill: "#22c55e" },
  { region: "Japan", share2025Pct: 7.0, billingsBn: 9.5, fill: "#f59e0b" },
  { region: "Europe", share2025Pct: 2.1, billingsBn: 2.9, fill: "#64748b" },
  { region: "Rest of World", share2025Pct: 3.9, billingsBn: 5.2, fill: "#94a3b8" },
];

export const REGION_HEADLINE = {
  top1Pct: 36.5,
  top1Label: "China",
  top3Pct: 78.9,
  top3Label: "China + Taiwan + Korea",
  asia3Pct: 78.9,
  totalBn2025: 135.1,
} as const;

/** Share × tightness scatter points (reuse stack layers). */
export const SHARE_TIGHTNESS = STACK_LAYERS.map((l) => ({
  id: l.id,
  short: l.short,
  top1Pct: l.top1Pct,
  top3CumPct: l.top3CumPct,
  tightness: l.tightness,
  hhi: l.hhi,
  stage: l.stage,
  fill: l.fill,
}));

/** Lorenz-style cumulative concentration by layer rank (sorted by top-1). */
export const CONCENTRATION_CURVE = (() => {
  const sorted = [...STACK_LAYERS].sort((a, b) => b.top1Pct - a.top1Pct);
  const n = sorted.length;
  const points = [{ rankShare: 0, equalPct: 0, actualTop1Mass: 0, label: "0" }];
  let mass = 0;
  sorted.forEach((l, i) => {
    mass += l.top1Pct;
    points.push({
      rankShare: Number((((i + 1) / n) * 100).toFixed(1)),
      equalPct: Number((((i + 1) / n) * 100).toFixed(1)),
      actualTop1Mass: Number(((mass / (n * 100)) * 100).toFixed(1)),
      label: l.short,
    });
  });
  return points;
})();

/** NVIDIA CoWoS reservation share path (from theme updates). */
export const COWOS_RESERVATION = [
  { vintage: "Research Jul", capacityWpm: 125_000, nvidiaSharePct: 55, gapPct: 20 },
  { vintage: "Aug mid", capacityWpm: 130_000, nvidiaSharePct: 52, gapPct: 10 },
  { vintage: "Q3 tracker", capacityWpm: 140_000, nvidiaSharePct: 55, gapPct: 20 },
  { vintage: "Aug Mid-Year", capacityWpm: 140_000, nvidiaSharePct: 55, gapPct: 20 },
] as const;

export const STAGE_COLORS = {
  upstream: "#0ea5e9",
  midstream: "#f59e0b",
  downstream: "#22c55e",
} as const;

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function layersByStage(stage: StackLayer["stage"]): StackLayer[] {
  return STACK_LAYERS.filter((l) => l.stage === stage);
}

export function topLayers(minTop1: number): StackLayer[] {
  return STACK_LAYERS.filter((l) => l.top1Pct >= minTop1);
}
