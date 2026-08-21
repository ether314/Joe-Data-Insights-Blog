/**
 * AI power & grid — Q3 2026 vintage update.
 * Prior theme post: ai-power-grid-update-2026 (IEA Key Questions Apr 2026 —
 *   485 TWh in 2025 → ~950 TWh central 2030; onsite gas 15–27 GW; Gartner 1Q26
 *   as companion GW/TWh meter).
 * Newest official vintages: Gartner newsroom 10 Jun 2026 (2026e electricity
 *   path + AI-server share) + IEA Electricity 2026 (US DC share of demand
 *   growth; worldwide connection queues).
 *
 * Core delta: near-term Gartner path is the headline — +26% to 565 TWh in 2026;
 * dual-ledger 2030 gap widens (IEA ~950 vs Gartner >1,200); global queues
 * restated at >2,500 GW stalled.
 */

export type Confidence = "disclosed" | "estimated" | "secondary" | "carried";

export const SOURCE_NOTE =
  "Q3 vintage delta vs ai-power-grid-update-2026 (IEA Key Questions Apr 2026). Near-term TWh / GW / AI-server share from Gartner newsroom 10 Jun 2026. US demand-growth attribution and worldwide connection-queue stock from IEA Electricity 2026. IEA 2030 central ~950 TWh and onsite-gas / DC-battery meters are carried from Key Questions — do not average IEA and Gartner into one forecast (scopes differ; Gartner 2025 print is 447 TWh vs IEA 485).";

export const SOURCES = [
  {
    label: "Gartner — Data center electricity demand +26% in 2026 (10 Jun 2026)",
    url: "https://www.gartner.com/en/newsroom/press-releases/2026-06-10-gartner-says-data-center-electricity-demand-to-grow-26-percent-in-2026",
  },
  {
    label: "IEA — Electricity 2026",
    url: "https://www.iea.org/reports/electricity-2026",
  },
  {
    label: "IEA — Key Questions on Energy and AI (Apr 2026)",
    url: "https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary",
  },
  {
    label: "Prior theme update — Key Questions vintage",
    url: "/blog/ai-power-grid-update-2026",
  },
] as const;

export const HEADLINE = {
  priorVintage: "IEA Key Questions Apr 2026",
  newPowerVintage: "Gartner newsroom 10 Jun 2026",
  newGridVintage: "IEA Electricity 2026",
  /** Gartner near-term path */
  gartnerTwh2025: 447,
  gartnerTwh2026: 565,
  gartnerTwh2027: 702,
  gartnerTwh2030: 1200,
  yoy2026Pct: 26.4,
  yoy2025Pct: 15.5,
  yoy2027Pct: 24.1,
  capacityGw2025: 104,
  capacityGw2026: 132,
  capacityGw2030: 290,
  capacityYoy2026Pct: 27,
  aiServerShare2025Pct: 20,
  aiServerShare2026Pct: 31,
  aiSurpassesConventionalYear: 2027,
  usTwh2026: 204,
  usShare2026Pct: 36,
  usAiDedicatedTwh2026: 68,
  usAiShareOfUsPct: 33,
  /** Dual-ledger 2030 gap */
  ieaCentral2030Twh: 950,
  gartner2030Twh: 1200,
  dualLedgerGapTwh: 250,
  priorIea2025Twh: 485,
  priorIeaYoy2025Pct: 17,
  /** Grid pace (Electricity 2026) */
  usDemandAdd5yrTwh: 420,
  usDcShareOfGrowthPct: 50,
  globalQueueStalledGw: 2500,
  unlockFlexibleGwLow: 750,
  unlockFlexibleGwHigh: 900,
  unlockGetGwLow: 450,
  unlockGetGwHigh: 700,
  unlockTotalGwLow: 1200,
  unlockTotalGwHigh: 1600,
  /** Carried Key Questions meters */
  onsiteGasGwLow: 15,
  onsiteGasGwHigh: 27,
  dcBatteryGwLow: 20,
  dcBatteryGwHigh: 25,
  delayRiskPct: 20,
  priorUsQueueGenGw: 1312,
} as const;

/** Gartner electricity path — segment stack (TWh) */
export type SegmentId = "conventional" | "ai" | "cooling";

export type SegmentYear = {
  year: number;
  conventional: number;
  ai: number;
  cooling: number;
  total: number;
  growthPct: number | null;
  confidence: Confidence;
};

export const GARTNER_SEGMENTS: SegmentYear[] = [
  {
    year: 2025,
    conventional: 193,
    ai: 95,
    cooling: 159,
    total: 447,
    growthPct: 15.5,
    confidence: "disclosed",
  },
  {
    year: 2026,
    conventional: 195,
    ai: 175,
    cooling: 195,
    total: 565,
    growthPct: 26.4,
    confidence: "disclosed",
  },
  {
    year: 2027,
    conventional: 200,
    ai: 258,
    cooling: 243,
    total: 702,
    growthPct: 24.1,
    confidence: "disclosed",
  },
];

/** Dual ledger — IEA Key Questions central vs Gartner path */
export type DualLedgerPoint = {
  year: number;
  ieaTwh: number | null;
  gartnerTwh: number | null;
  note: string;
  confidence: Confidence;
};

export const DUAL_LEDGER: DualLedgerPoint[] = [
  {
    year: 2025,
    ieaTwh: 485,
    gartnerTwh: 447,
    note: "Scope gap at base year",
    confidence: "disclosed",
  },
  {
    year: 2026,
    ieaTwh: null,
    gartnerTwh: 565,
    note: "Gartner near-term print",
    confidence: "disclosed",
  },
  {
    year: 2027,
    ieaTwh: 680,
    gartnerTwh: 702,
    note: "IEA mid-path estimated",
    confidence: "estimated",
  },
  {
    year: 2030,
    ieaTwh: 950,
    gartnerTwh: 1200,
    note: "+250 TWh dual-ledger gap",
    confidence: "disclosed",
  },
];

/** YoY growth composition — prior IEA vs new Gartner */
export type YoySlice = {
  id: string;
  label: string;
  yoyPct: number;
  note: string;
  ledger: "iea" | "gartner";
  confidence: Confidence;
};

export const YOY_GROWTH: YoySlice[] = [
  {
    id: "iea-2025",
    label: "IEA all DC 2025",
    yoyPct: 17,
    note: "Key Questions: 415 → 485 TWh",
    ledger: "iea",
    confidence: "carried",
  },
  {
    id: "iea-ai-2025",
    label: "IEA AI-focused 2025",
    yoyPct: 50,
    note: "Key Questions composition hinge",
    ledger: "iea",
    confidence: "carried",
  },
  {
    id: "gartner-2025",
    label: "Gartner all DC 2025",
    yoyPct: 15.5,
    note: "447 TWh print (different scope)",
    ledger: "gartner",
    confidence: "disclosed",
  },
  {
    id: "gartner-2026",
    label: "Gartner all DC 2026",
    yoyPct: 26.4,
    note: "447 → 565 TWh — Q3 headline",
    ledger: "gartner",
    confidence: "disclosed",
  },
  {
    id: "gartner-ai-2026",
    label: "Gartner AI servers 2026",
    yoyPct: 84.2,
    note: "95 → 175 TWh segment",
    ledger: "gartner",
    confidence: "disclosed",
  },
  {
    id: "capacity-2026",
    label: "Gartner capacity GW 2026",
    yoyPct: 27,
    note: "104 → 132 GW peak demand",
    ledger: "gartner",
    confidence: "disclosed",
  },
];

/** US composition pie-style rows */
export type UsSlice = {
  id: string;
  label: string;
  twh: number;
  shareOfWorldPct: number | null;
  note: string;
  confidence: Confidence;
};

export const US_COMPOSITION: UsSlice[] = [
  {
    id: "world",
    label: "World DC electricity 2026",
    twh: 565,
    shareOfWorldPct: 100,
    note: "Gartner global print",
    confidence: "disclosed",
  },
  {
    id: "us",
    label: "United States",
    twh: 204,
    shareOfWorldPct: 36,
    note: "36% of world DC power",
    confidence: "disclosed",
  },
  {
    id: "us-ai",
    label: "US dedicated AI DCs",
    twh: 68,
    shareOfWorldPct: 12,
    note: "~1/3 of US DC electricity",
    confidence: "disclosed",
  },
  {
    id: "us-other",
    label: "US conventional / other DC",
    twh: 136,
    shareOfWorldPct: 24,
    note: "Residual of US total",
    confidence: "estimated",
  },
];

/** Grid / queue meters — Electricity 2026 vs prior LBNL carry */
export type GridMeter = {
  id: string;
  metric: string;
  prior: string;
  neu: string;
  delta: string;
  valuePrior: number;
  valueNew: number;
  unit: string;
  confidence: Confidence;
};

export const GRID_METERS: GridMeter[] = [
  {
    id: "global-queue",
    metric: "Worldwide stalled connection queue",
    prior: "US gen queue 1,312 GW (LBNL)",
    neu: ">2,500 GW stalled globally",
    delta: "Broader IEA queue stock",
    valuePrior: 1312,
    valueNew: 2500,
    unit: "GW",
    confidence: "disclosed",
  },
  {
    id: "us-dc-growth",
    metric: "US DC share of electricity demand growth",
    prior: "Major driver (narrative)",
    neu: "~50% of US growth to 2030",
    delta: "New attribution meter",
    valuePrior: 0,
    valueNew: 50,
    unit: "%",
    confidence: "disclosed",
  },
  {
    id: "us-add",
    metric: "US electricity add (5-yr)",
    prior: "Not quantified in prior update",
    neu: ">420 TWh through 2030",
    delta: "New absolute meter",
    valuePrior: 0,
    valueNew: 420,
    unit: "TWh",
    confidence: "disclosed",
  },
  {
    id: "unlock",
    metric: "Unlockable advanced-stage projects",
    prior: "Reform narrative",
    neu: "1,200–1,600 GW via flex + GETs",
    delta: "New unlock range",
    valuePrior: 0,
    valueNew: 1400,
    unit: "GW",
    confidence: "disclosed",
  },
  {
    id: "delay-risk",
    metric: "Projects at grid-delay risk",
    prior: "~20% (Key Questions)",
    neu: "~20% (carried)",
    delta: "0 — still binding",
    valuePrior: 20,
    valueNew: 20,
    unit: "%",
    confidence: "carried",
  },
  {
    id: "onsite-gas",
    metric: "Onsite gas for DCs by 2030",
    prior: "15–27 GW",
    neu: "15–27 GW (carried)",
    delta: "0 — still the bridge",
    valuePrior: 21,
    valueNew: 21,
    unit: "GW",
    confidence: "carried",
  },
];

/** Capacity path (GW) companion */
export type CapacityPoint = {
  year: number;
  capacityGw: number;
  electricityTwh: number | null;
  aiSharePct: number | null;
  confidence: Confidence;
};

export const CAPACITY_PATH: CapacityPoint[] = [
  {
    year: 2025,
    capacityGw: 104,
    electricityTwh: 447,
    aiSharePct: 20,
    confidence: "disclosed",
  },
  {
    year: 2026,
    capacityGw: 132,
    electricityTwh: 565,
    aiSharePct: 31,
    confidence: "disclosed",
  },
  {
    year: 2027,
    capacityGw: 165,
    electricityTwh: 702,
    aiSharePct: 52,
    confidence: "estimated",
  },
  {
    year: 2030,
    capacityGw: 290,
    electricityTwh: 1200,
    aiSharePct: null,
    confidence: "disclosed",
  },
];

/** Pace mismatch — campus vs wires (refreshed with global queue) */
export type PacePoint = {
  name: string;
  campusYears: number;
  interconnectYears: number;
  cluster: "campus" | "wires" | "fuel" | "unlock";
};

export const PACE_SCATTER: PacePoint[] = [
  { name: "Hyperscale campus", campusYears: 2.5, interconnectYears: 2.5, cluster: "campus" },
  { name: "AI rack density ramp", campusYears: 2, interconnectYears: 3, cluster: "campus" },
  { name: "US IR → COD median", campusYears: 5.5, interconnectYears: 5.5, cluster: "wires" },
  { name: "Global queue stall", campusYears: 6, interconnectYears: 7, cluster: "wires" },
  { name: "Advanced TX build", campusYears: 6, interconnectYears: 6, cluster: "wires" },
  { name: "Onsite gas workaround", campusYears: 3, interconnectYears: 2, cluster: "fuel" },
  { name: "DC battery flex", campusYears: 4, interconnectYears: 3, cluster: "fuel" },
  { name: "Flexible non-firm connect", campusYears: 2.5, interconnectYears: 2, cluster: "unlock" },
  { name: "Grid-enhancing tech", campusYears: 2, interconnectYears: 1.5, cluster: "unlock" },
];

export const CLUSTER_COLORS: Record<PacePoint["cluster"], string> = {
  campus: "#22d3ee",
  wires: "#f59e0b",
  fuel: "#a78bfa",
  unlock: "#34d399",
};

/** Scenario stance shift — prior Key Questions → Q3 Gartner+Electricity */
export type StanceRow = {
  horizon: string;
  priorStance: string;
  newStance: string;
  deltaLabel: string;
  direction: "down" | "up" | "flat" | "split";
  score: number;
};

export const STANCE_SHIFT: StanceRow[] = [
  {
    horizon: "Near-term TWh (2026)",
    priorStance: "Gartner companion only",
    newStance: "+26% to 565 TWh primary",
    deltaLabel: "Promote near-term path",
    direction: "up",
    score: 3,
  },
  {
    horizon: "2030 dual ledger",
    priorStance: "IEA ~950; Gartner GW only",
    newStance: "IEA 950 vs Gartner >1,200",
    deltaLabel: "+250 TWh gap",
    direction: "split",
    score: 2,
  },
  {
    horizon: "AI server share",
    priorStance: "31% in 2026 (companion)",
    newStance: "31% locked; surpass 2027",
    deltaLabel: "Composition hinge restated",
    direction: "up",
    score: 2.5,
  },
  {
    horizon: "Grid queues",
    priorStance: "US 1,312 GW LBNL",
    newStance: ">2,500 GW stalled worldwide",
    deltaLabel: "Global stock restated",
    direction: "up",
    score: 2,
  },
  {
    horizon: "Unlock tools",
    priorStance: "Reform narrative",
    newStance: "1.2–1.6 TW unlockable",
    deltaLabel: "Flex + GETs quantified",
    direction: "up",
    score: 1.5,
  },
  {
    horizon: "Onsite gas / batteries",
    priorStance: "15–27 / 20–25 GW",
    newStance: "Carried — still the bridge",
    deltaLabel: "Flat meters",
    direction: "flat",
    score: 0,
  },
];

export function dualLedgerDumbbell() {
  return DUAL_LEDGER.filter((d) => d.ieaTwh != null || d.gartnerTwh != null).map((d) => ({
    year: String(d.year),
    iea: d.ieaTwh,
    gartner: d.gartnerTwh,
    gap:
      d.ieaTwh != null && d.gartnerTwh != null
        ? d.gartnerTwh - d.ieaTwh
        : null,
  }));
}

export function segmentStack() {
  return GARTNER_SEGMENTS.map((s) => ({
    year: String(s.year),
    conventional: s.conventional,
    ai: s.ai,
    cooling: s.cooling,
    total: s.total,
    growthPct: s.growthPct,
  }));
}

export function fmtTwh(n: number) {
  return `${n.toLocaleString("en-US")} TWh`;
}

export function fmtGw(n: number) {
  return `${n.toLocaleString("en-US")} GW`;
}

export function fmtPct(n: number) {
  return `${Number.isInteger(n) ? n : n.toFixed(1)}%`;
}
