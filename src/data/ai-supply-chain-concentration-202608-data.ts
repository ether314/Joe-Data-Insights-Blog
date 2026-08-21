/**
 * AI semiconductor supply-chain concentration — August 202608 Mid-Year vintage.
 * Core question: how concentrated is the chip stack at the top after the
 * August Mid-Year back-end cut — especially the dual CoWoS tip (supply vs buyer)
 * and growth concentration in packaging tools vs test equipment?
 *
 * Complements:
 * - /blog/ai-supply-chain-concentration-2026 (mid-window ladder)
 * - /blog/ai-supply-chain-concentration-2026q3 (Q3 tip refresh)
 * - /blog/ai-supply-chain-update-202608 (back-end tool asymmetry)
 *
 * Primary sources: SEMI Mid-Year OEM Forecast / WWSEMS; TrendForce / company
 * disclosures for HBM + CoWoS reservations; prior theme concentration bands.
 */

export type Confidence = "disclosed" | "estimated" | "editorial";

export const SOURCE_NOTE =
  "August 202608 Mid-Year concentration refresh vs the Q3 tip ladder. Layer top-1 / top-3 are public narrative bands (disclosures + trackers), not a SEMI vendor census. Δ columns compare this vintage to the Q3 concentration companion. HHI derived from stated buckets + residual. Tightness scores are editorial (1–10). CoWoS dual tip mixes capacity ownership with NVIDIA reservation share. Segment YoY figures are Mid-Year OEM-forecast growth — concentration of *growth*, not vendor HHI inside each segment.";

export const PRIOR_CONC_PATH = "/blog/ai-supply-chain-concentration-2026";
export const Q3_CONC_PATH = "/blog/ai-supply-chain-concentration-2026q3";
export const RESEARCH_PATH = "/blog/ai-supply-chain-research-2026";
export const Q3_UPDATE_PATH = "/blog/ai-supply-chain-update-2026q3";
export const MIDYEAR_PATH = "/blog/ai-supply-chain-update-202608";
export const PACKAGING_PATH = "/blog/ai-gpu-packaging-memory-bottleneck-2025";

export const SOURCES = [
  {
    label: "SEMI — Mid-Year Total Equipment Forecast (July 2026)",
    url: "https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-sales-forecast-to-reach-a-record-229-billion-dollars-in-2028-semi-reports",
  },
  {
    label: "SEMI — Q1 2026 Equipment Billings",
    url: "https://www.semi.org/en/semi-press-release/semi-reports-global-semiconductor-equipment-billings-increased-14-percent-year-over-year-in-q1-2026",
  },
  {
    label: "Q3 concentration companion",
    url: Q3_CONC_PATH,
  },
  {
    label: "August Mid-Year back-end cut",
    url: MIDYEAR_PATH,
  },
] as const;

export const HEADLINE = {
  euvTop1Pct: 100,
  euvLabel: "ASML",
  foundryLeadTop1Pct: 90,
  foundryLeadLabel: "TSMC",
  foundryLeadTop3Pct: 100,
  /** HBM — holds Q3 tip (SK Hynix) */
  hbmTop1Pct: 55,
  hbmTop1PriorPct: 55,
  hbmLabel: "SK Hynix",
  hbmTop3Pct: 100,
  /** AI GPU — slight further easing */
  gpuTop1Pct: 86,
  gpuTop1PriorPct: 87,
  gpuLabel: "NVIDIA",
  gpuTop3Pct: 97,
  /** CoWoS supply tip eases again on OSAT / rival ramps */
  cowosTop1Pct: 75,
  cowosTop1PriorPct: 76,
  cowosLabel: "TSMC",
  cowosTop3Pct: 93,
  /** Dual tip — buyer share softens toward August update band */
  cowosBuyerTop1Pct: 52,
  cowosBuyerPriorPct: 55,
  cowosCapacityWpm: 140_000,
  cowosGapPct: 20,
  /** Cross-layer meters vs Q3 */
  medianTop1Pct: 70.5,
  medianTop1PriorPct: 71,
  layersTop1Ge70: 5,
  layersTop1Ge70Prior: 5,
  layersTracked: 8,
  stackHhi: 5550,
  stackHhiPrior: 5620,
  /** Mid-Year equipment geography (carried) */
  equipTop3Pct: 78.9,
  equipTop3Label: "China + Taiwan + Korea",
  /** Back-end growth concentration (Aug Mid-Year punchline) */
  testEquipYoyPct: 31,
  assemblyEquipYoyPct: 9.6,
  backendAsymmetryPts: 21.4,
  midYearTotalBn: 165.9,
  dramToolsYoyPct: 39,
  q1BillingsBn: 36.55,
  q1YoyPct: 14,
} as const;

export type StackLayer = {
  id: string;
  layer: string;
  short: string;
  stage: "upstream" | "midstream" | "downstream";
  top1Label: string;
  top1Pct: number;
  top1PriorPct: number;
  top2Label: string;
  top2Pct: number;
  top3Label: string;
  top3Pct: number;
  top3CumPct: number;
  top3CumPriorPct: number;
  hhi: number;
  hhiPrior: number;
  tightness: number;
  confidence: Confidence;
  fill: string;
  note: string;
};

/** Eight stack layers — Aug Mid-Year refresh ranked by top-1 share. */
export const STACK_LAYERS: StackLayer[] = [
  {
    id: "euv",
    layer: "EUV lithography scanners",
    short: "EUV",
    stage: "upstream",
    top1Label: "ASML",
    top1Pct: 100,
    top1PriorPct: 100,
    top2Label: "—",
    top2Pct: 0,
    top3Label: "—",
    top3Pct: 0,
    top3CumPct: 100,
    top3CumPriorPct: 100,
    hhi: 10000,
    hhiPrior: 10000,
    tightness: 9,
    confidence: "disclosed",
    fill: "#ef4444",
    note: "Sole volume EUV toolmaker; High-NA still ASML — structural ceiling.",
  },
  {
    id: "foundry-lead",
    layer: "Leading-edge foundry (<7 nm)",
    short: "Foundry LE",
    stage: "midstream",
    top1Label: "TSMC",
    top1Pct: 90,
    top1PriorPct: 90,
    top2Label: "Samsung",
    top2Pct: 8,
    top3Label: "Intel Foundry",
    top3Pct: 2,
    top3CumPct: 100,
    top3CumPriorPct: 100,
    hhi: 8168,
    hhiPrior: 8168,
    tightness: 9,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Advanced-node tip unchanged; overall foundry still ~62%.",
  },
  {
    id: "gpu",
    layer: "AI data-center GPU / accel.",
    short: "AI GPU",
    stage: "downstream",
    top1Label: "NVIDIA",
    top1Pct: 86,
    top1PriorPct: 87,
    top2Label: "AMD",
    top2Pct: 9,
    top3Label: "Others",
    top3Pct: 2,
    top3CumPct: 97,
    top3CumPriorPct: 98,
    hhi: 7481,
    hhiPrior: 7642,
    tightness: 8,
    confidence: "estimated",
    fill: "#22c55e",
    note: "−1 pp tip vs Q3; AMD/custom ASICs keep nibbling the ceiling.",
  },
  {
    id: "cowos",
    layer: "CoWoS-class AI packaging",
    short: "CoWoS",
    stage: "midstream",
    top1Label: "TSMC",
    top1Pct: 75,
    top1PriorPct: 76,
    top2Label: "Amkor / ASE",
    top2Pct: 14,
    top3Label: "Samsung",
    top3Pct: 4,
    top3CumPct: 93,
    top3CumPriorPct: 94,
    hhi: 5837,
    hhiPrior: 5986,
    tightness: 10,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Supply tip −1 pp; buyer tip softens to ~52% — dual tip still binds.",
  },
  {
    id: "hbm",
    layer: "HBM (high-bandwidth memory)",
    short: "HBM",
    stage: "midstream",
    top1Label: "SK Hynix",
    top1Pct: 55,
    top1PriorPct: 55,
    top2Label: "Samsung",
    top2Pct: 33,
    top3Label: "Micron",
    top3Pct: 12,
    top3CumPct: 100,
    top3CumPriorPct: 100,
    hhi: 4358,
    hhiPrior: 4358,
    tightness: 9,
    confidence: "estimated",
    fill: "#a855f7",
    note: "Holds Q3 tip; three-player set still equals the market.",
  },
  {
    id: "eda",
    layer: "EDA / design software",
    short: "EDA",
    stage: "upstream",
    top1Label: "Synopsys",
    top1Pct: 42,
    top1PriorPct: 42,
    top2Label: "Cadence",
    top2Pct: 30,
    top3Label: "Siemens EDA",
    top3Pct: 16,
    top3CumPct: 88,
    top3CumPriorPct: 88,
    hhi: 2940,
    hhiPrior: 2940,
    tightness: 6,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Top-2 duopoly (~72%) unchanged this vintage.",
  },
  {
    id: "silicon",
    layer: "300 mm silicon wafers",
    short: "Wafers",
    stage: "upstream",
    top1Label: "Shin-Etsu",
    top1Pct: 30,
    top1PriorPct: 30,
    top2Label: "SUMCO",
    top2Pct: 25,
    top3Label: "GlobalWafers",
    top3Pct: 17,
    top3CumPct: 72,
    top3CumPriorPct: 72,
    hhi: 1894,
    hhiPrior: 1894,
    tightness: 4,
    confidence: "estimated",
    fill: "#64748b",
    note: "Japan + Taiwan suppliers dominate 300 mm — flat vs Q3.",
  },
  {
    id: "wfe",
    layer: "Wafer-fab equipment (WFE)",
    short: "WFE",
    stage: "upstream",
    top1Label: "Applied Materials",
    top1Pct: 22,
    top1PriorPct: 22,
    top2Label: "ASML",
    top2Pct: 20,
    top3Label: "Lam Research",
    top3Pct: 14,
    top3CumPct: 56,
    top3CumPriorPct: 56,
    hhi: 1120,
    hhiPrior: 1120,
    tightness: 5,
    confidence: "estimated",
    fill: "#14b8a6",
    note: "Oligopoly contrast to EUV slice — still the diversified pole.",
  },
];

export const LAYER_DELTAS = STACK_LAYERS.map((l) => ({
  id: l.id,
  short: l.short,
  stage: l.stage,
  top1PriorPct: l.top1PriorPct,
  top1Pct: l.top1Pct,
  deltaPp: Number((l.top1Pct - l.top1PriorPct).toFixed(1)),
  hhiPrior: l.hhiPrior,
  hhi: l.hhi,
  hhiDelta: l.hhi - l.hhiPrior,
  fill: l.fill,
}));

export const TOP_K_LADDER = [
  {
    k: 1,
    label: "Top-1",
    euv: 100,
    foundry: 90,
    gpu: 86,
    cowos: 75,
    hbm: 55,
    wfe: 22,
  },
  {
    k: 2,
    label: "Top-2",
    euv: 100,
    foundry: 98,
    gpu: 95,
    cowos: 89,
    hbm: 88,
    wfe: 42,
  },
  {
    k: 3,
    label: "Top-3",
    euv: 100,
    foundry: 100,
    gpu: 97,
    cowos: 93,
    hbm: 100,
    wfe: 56,
  },
] as const;

export type FoundryShare = {
  vendor: string;
  short: string;
  advancedSharePct: number;
  overallSharePct: number;
  fill: string;
};

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
  priorPct: number;
  cumulativePct: number;
  fill: string;
};

export const HBM_SHARES: HbmShare[] = [
  { vendor: "SK Hynix", sharePct: 55, priorPct: 55, cumulativePct: 55, fill: "#a855f7" },
  { vendor: "Samsung", sharePct: 33, priorPct: 33, cumulativePct: 88, fill: "#0ea5e9" },
  { vendor: "Micron", sharePct: 12, priorPct: 12, cumulativePct: 100, fill: "#14b8a6" },
];

export type EquipmentRegion = {
  region: string;
  share2025Pct: number;
  billingsBn: number;
  fill: string;
};

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

/** Mid-Year segment path — growth concentration lens (USD bn + YoY). */
export const EQUIPMENT_SEGMENTS = [
  {
    segment: "Total equipment",
    short: "Total",
    levelBn: 165.9,
    yoyPct: 23.2,
    y2028Bn: 229.5,
    fill: "#0ea5e9",
  },
  {
    segment: "Wafer fab equip.",
    short: "WFE",
    levelBn: 143.9,
    yoyPct: 23.1,
    y2028Bn: 200.0,
    fill: "#6366f1",
  },
  {
    segment: "DRAM equipment",
    short: "DRAM",
    levelBn: 38.8,
    yoyPct: 39.0,
    y2028Bn: 56.9,
    fill: "#a855f7",
  },
  {
    segment: "Test equipment",
    short: "Test",
    levelBn: 15.3,
    yoyPct: 31.0,
    y2028Bn: 20.8,
    fill: "#f59e0b",
  },
  {
    segment: "Assembly & packaging",
    short: "A&P",
    levelBn: 6.7,
    yoyPct: 9.6,
    y2028Bn: 8.6,
    fill: "#ef4444",
  },
] as const;

/** Dual CoWoS tip path — supply ownership vs buyer reservation. */
export const COWOS_DUAL_TIP = [
  {
    vintage: "Research Jul",
    capacityWpm: 125_000,
    supplyTipPct: 80,
    buyerTipPct: 55,
    gapPct: 20,
  },
  {
    vintage: "Aug mid",
    capacityWpm: 130_000,
    supplyTipPct: 79,
    buyerTipPct: 52,
    gapPct: 10,
  },
  {
    vintage: "Q3 tracker",
    capacityWpm: 140_000,
    supplyTipPct: 76,
    buyerTipPct: 55,
    gapPct: 20,
  },
  {
    vintage: "Aug Mid-Year",
    capacityWpm: 140_000,
    supplyTipPct: 75,
    buyerTipPct: 52,
    gapPct: 20,
  },
] as const;

/** Back-end asymmetry waterfall (editorial decomposition of growth gap). */
export const BACKEND_ASYMMETRY = [
  { step: "Test YoY", valuePct: 31.0, fill: "#f59e0b" },
  { step: "A&P YoY", valuePct: 9.6, fill: "#ef4444" },
  { step: "Gap (pts)", valuePct: 21.4, fill: "#64748b" },
] as const;

export const SHARE_TIGHTNESS = STACK_LAYERS.map((l) => ({
  id: l.id,
  short: l.short,
  top1Pct: l.top1Pct,
  top1PriorPct: l.top1PriorPct,
  top3CumPct: l.top3CumPct,
  tightness: l.tightness,
  hhi: l.hhi,
  stage: l.stage,
  fill: l.fill,
  deltaPp: Number((l.top1Pct - l.top1PriorPct).toFixed(1)),
}));

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

export const STAGE_AVG = [
  {
    stage: "Upstream",
    id: "upstream",
    top1AvgPct: 48.5,
    top1AvgPriorPct: 48.5,
    fill: "#0ea5e9",
  },
  {
    stage: "Midstream",
    id: "midstream",
    top1AvgPct: 73.3,
    top1AvgPriorPct: 73.7,
    fill: "#f59e0b",
  },
  {
    stage: "Downstream",
    id: "downstream",
    top1AvgPct: 86,
    top1AvgPriorPct: 87,
    fill: "#22c55e",
  },
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

export function fmtDeltaPp(n: number): string {
  if (n > 0) return `+${n.toFixed(0)} pp`;
  if (n < 0) return `${n.toFixed(0)} pp`;
  return "0 pp";
}

export function layersByStage(stage: StackLayer["stage"]): StackLayer[] {
  return STACK_LAYERS.filter((l) => l.stage === stage);
}

export function topLayers(minTop1: number): StackLayer[] {
  return STACK_LAYERS.filter((l) => l.top1Pct >= minTop1);
}
