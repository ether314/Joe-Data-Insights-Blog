/**
 * AI power & grid — vintage update (Aug 2026).
 * Prior theme baseline: ai-power-grid-research-2026 (IEA Energy and AI, Apr 2025
 *   frames: 415 TWh → ~945 TWh Base 2030; delay risk ~20%; CO₂ peak ~320 Mt).
 * Newest official vintage: IEA Key Questions on Energy and AI (Apr 2026) —
 *   485 TWh in 2025 (+17% y/y); AI-focused +50% in 2025; central path 485→950 TWh
 *   by 2030; AI-focused load triples; near-term bottlenecks cut aggressive upside
 *   while post-2030 upside rises; onsite gas 15–27 GW; DC batteries 20–25 GW;
 *   emissions ~350 Mt by 2035. Gartner 1Q26 capacity path used as companion GW meter.
 */

export type Confidence = "disclosed" | "estimated" | "secondary";

export const SOURCE_NOTE =
  "Vintage delta: Jul research post used IEA Energy and AI (Apr 2025) Base Case (~415 TWh in 2024 → ~945 TWh in 2030) plus LBNL Queued Up 2026. This update promotes IEA Key Questions on Energy and AI (Apr 2026): confirmed 485 TWh in 2025, AI-focused +50% y/y, central path ~950 TWh by 2030, near-term bottleneck downshift / post-2030 upside, onsite gas 15–27 GW, DC batteries 20–25 GW, and ~350 Mt CO₂ by 2035. Gartner 1Q26 GW/TWh path is a companion capacity meter (not IEA). Physical mix ≠ contractual PPAs.";

export const SOURCES = [
  {
    label: "IEA — Key Questions on Energy and AI (Apr 2026)",
    url: "https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary",
  },
  {
    label: "IEA — Energy and AI (Apr 2025)",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
  },
  {
    label: "Prior theme baseline — AI power-grid research 2026",
    url: "/blog/ai-power-grid-research-2026",
  },
  {
    label: "Gartner — Data Center Power Capacity and Consumption, Worldwide (1Q26)",
    url: "https://www.gartner.com/",
  },
] as const;

export const HEADLINE = {
  priorBase2030Twh: 945,
  newCentral2030Twh: 950,
  base2030DeltaTwh: 5,
  dcTwh2024: 415,
  dcTwh2025: 485,
  yoy2025Pct: 17,
  aiFocusedYoy2025Pct: 50,
  aiFocusedTripleBy2030: true,
  nearTermAggressiveDownshift: true,
  post2030Upside: true,
  delayRiskPct: 20,
  onsiteGasGwLow: 15,
  onsiteGasGwHigh: 27,
  onsiteGasMidGw: 21,
  dcBatteryGwLow: 20,
  dcBatteryGwHigh: 25,
  dcBatteryMidGw: 22.5,
  gasTurbineOrderSurgePct: 70,
  rackHouseholds2027: 65,
  aiServerDensityMult2020to2025: 11,
  aiServerDensityMultTo2027: 4,
  emissions2035Mt: 350,
  priorCo2PeakMt: 320,
  emissionsDeltaMt: 30,
  techCapex2025Bn: 400,
  techCapex2026JumpPct: 75,
  aiFactoryCapacityTripled18mo: true,
  gartnerGw2025: 104,
  gartnerGw2026: 132,
  gartnerGw2027: 165,
  gartnerGw2030: 290,
  gartnerTwh2026: 565,
  gartnerTwh2027: 702,
  aiServerShare2026Pct: 31,
  usQueueGenGw2025: 1312,
  queueMedianYears: 5,
} as const;

/** Demand path — prior research Base vs new Key Questions central */
export type DemandPathPoint = {
  year: number;
  priorBase: number | null;
  newCentral: number | null;
  confidence: Confidence;
};

export const DEMAND_PATH: DemandPathPoint[] = [
  { year: 2024, priorBase: 415, newCentral: 415, confidence: "disclosed" },
  { year: 2025, priorBase: 485, newCentral: 485, confidence: "disclosed" },
  { year: 2027, priorBase: 650, newCentral: 680, confidence: "estimated" },
  { year: 2030, priorBase: 945, newCentral: 950, confidence: "disclosed" },
  { year: 2035, priorBase: 1200, newCentral: 1300, confidence: "estimated" },
];

/** YoY growth composition — overall DC vs AI-focused (2025 vintage) */
export type GrowthSlice = {
  id: string;
  label: string;
  yoyPct: number;
  note: string;
  confidence: Confidence;
};

export const YOY_GROWTH: GrowthSlice[] = [
  {
    id: "all-dc",
    label: "All data centres",
    yoyPct: 17,
    note: "415 → 485 TWh (2024→2025)",
    confidence: "disclosed",
  },
  {
    id: "ai-focused",
    label: "AI-focused data centres",
    yoyPct: 50,
    note: "Grew ~3× faster than sector average",
    confidence: "disclosed",
  },
  {
    id: "non-ai",
    label: "Conventional / other DC (est.)",
    yoyPct: 8,
    note: "Residual implied by sector mix",
    confidence: "estimated",
  },
];

/** Scenario framing shift — near-term vs long-term */
export type ScenarioShift = {
  horizon: string;
  priorStance: string;
  newStance: string;
  deltaLabel: string;
  direction: "down" | "up" | "flat";
  score: number;
};

export const SCENARIO_SHIFT: ScenarioShift[] = [
  {
    horizon: "Near-term (to 2030)",
    priorStance: "Lift-Off still in play",
    newStance: "Aggressive upside less likely",
    deltaLabel: "Bottlenecks bite",
    direction: "down",
    score: -2,
  },
  {
    horizon: "Central path 2030",
    priorStance: "~945 TWh Base",
    newStance: "~950 TWh central",
    deltaLabel: "+5 TWh (~flat)",
    direction: "flat",
    score: 0.2,
  },
  {
    horizon: "AI-focused load",
    priorStance: "Fastest growth driver",
    newStance: "Triples 2025→2030",
    deltaLabel: "Composition hinge",
    direction: "up",
    score: 3,
  },
  {
    horizon: "Post-2030",
    priorStance: "Fan 700–1,700 TWh",
    newStance: "Higher upside case raised",
    deltaLabel: "Bottleneck relief + agentic AI",
    direction: "up",
    score: 2,
  },
];

/** Bottleneck / grid-response panel */
export type BottleneckRow = {
  id: string;
  metric: string;
  prior: string;
  neu: string;
  delta: string;
  unit: string;
  valuePrior: number;
  valueNew: number;
  confidence: Confidence;
};

export const BOTTLENECK_ROWS: BottleneckRow[] = [
  {
    id: "delay-risk",
    metric: "Projects at grid-delay risk",
    prior: "~20%",
    neu: "~20% (still binding)",
    delta: "0 pp — still the clock",
    unit: "%",
    valuePrior: 20,
    valueNew: 20,
    confidence: "disclosed",
  },
  {
    id: "onsite-gas",
    metric: "Onsite gas for DCs by 2030",
    prior: "Narrative / local workaround",
    neu: "15–27 GW (mostly US)",
    delta: "+21 GW mid (new meter)",
    unit: "GW",
    valuePrior: 0,
    valueNew: 21,
    confidence: "disclosed",
  },
  {
    id: "dc-batteries",
    metric: "Batteries inside data centres",
    prior: "Flexibility underexplored",
    neu: "20–25 GW by 2030",
    delta: "+22.5 GW mid (new meter)",
    unit: "GW",
    valuePrior: 0,
    valueNew: 22.5,
    confidence: "disclosed",
  },
  {
    id: "turbine-orders",
    metric: "Gas turbine order surge (2025)",
    prior: "Supply-chain tight",
    neu: "+70% orders in 2025",
    delta: "+70 pp order growth",
    unit: "%",
    valuePrior: 0,
    valueNew: 70,
    confidence: "disclosed",
  },
  {
    id: "queue-gen",
    metric: "US active generation in queues",
    prior: "1,312 GW (end-2025)",
    neu: "1,312 GW (unchanged vintage)",
    delta: "0 — still congestion signal",
    unit: "GW",
    valuePrior: 1312,
    valueNew: 1312,
    confidence: "secondary",
  },
  {
    id: "median-ir",
    metric: "US median IR → COD",
    prior: ">5 years",
    neu: ">5 years",
    delta: "0 — campus clocks still lose",
    unit: "years",
    valuePrior: 5,
    valueNew: 5,
    confidence: "secondary",
  },
];

/** Power-density path (AI server rack intensity index) */
export type DensityPoint = {
  year: number;
  index: number;
  householdsEquiv: number | null;
  confidence: Confidence;
};

export const DENSITY_PATH: DensityPoint[] = [
  { year: 2020, index: 1, householdsEquiv: null, confidence: "disclosed" },
  { year: 2025, index: 11, householdsEquiv: null, confidence: "disclosed" },
  { year: 2027, index: 44, householdsEquiv: 65, confidence: "disclosed" },
];

/** Emissions vintage */
export type EmissionsPoint = {
  year: number;
  priorMt: number | null;
  newMt: number | null;
  confidence: Confidence;
};

export const EMISSIONS_PATH: EmissionsPoint[] = [
  { year: 2024, priorMt: 180, newMt: 180, confidence: "estimated" },
  { year: 2030, priorMt: 320, newMt: 330, confidence: "estimated" },
  { year: 2035, priorMt: 300, newMt: 350, confidence: "disclosed" },
];

/** Gartner companion capacity path (GW) + AI server share */
export type GartnerPoint = {
  year: number;
  capacityGw: number;
  electricityTwh: number | null;
  aiServerSharePct: number | null;
  confidence: Confidence;
};

export const GARTNER_PATH: GartnerPoint[] = [
  {
    year: 2025,
    capacityGw: 104,
    electricityTwh: null,
    aiServerSharePct: null,
    confidence: "disclosed",
  },
  {
    year: 2026,
    capacityGw: 132,
    electricityTwh: 565,
    aiServerSharePct: 31,
    confidence: "disclosed",
  },
  {
    year: 2027,
    capacityGw: 165,
    electricityTwh: 702,
    aiServerSharePct: 52,
    confidence: "estimated",
  },
  {
    year: 2030,
    capacityGw: 290,
    electricityTwh: null,
    aiServerSharePct: null,
    confidence: "disclosed",
  },
];

/** Capex / factory momentum (context meters, not electricity) */
export type MomentumRow = {
  id: string;
  label: string;
  value: string;
  numeric: number;
  confidence: Confidence;
};

export const MOMENTUM: MomentumRow[] = [
  {
    id: "capex-2025",
    label: "Large-tech DC / AI capex 2025",
    value: ">$400B",
    numeric: 400,
    confidence: "disclosed",
  },
  {
    id: "capex-2026-jump",
    label: "Expected 2026 capex jump",
    value: "+75%",
    numeric: 75,
    confidence: "disclosed",
  },
  {
    id: "ai-factories",
    label: "AI-factory capacity (18 mo)",
    value: ">3×",
    numeric: 3,
    confidence: "disclosed",
  },
  {
    id: "users",
    label: "Major-provider active users",
    value: "~3× y/y",
    numeric: 3,
    confidence: "disclosed",
  },
];

/** Scatter: pace mismatch — campus build years vs interconnection years */
export type PacePoint = {
  name: string;
  campusYears: number;
  interconnectYears: number;
  cluster: "campus" | "wires" | "fuel";
};

export const PACE_SCATTER: PacePoint[] = [
  { name: "Hyperscale campus", campusYears: 2.5, interconnectYears: 2.5, cluster: "campus" },
  { name: "AI rack density ramp", campusYears: 2, interconnectYears: 3, cluster: "campus" },
  { name: "US IR → COD median", campusYears: 5.5, interconnectYears: 5.5, cluster: "wires" },
  { name: "Advanced TX build", campusYears: 6, interconnectYears: 6, cluster: "wires" },
  { name: "Transformer lead time", campusYears: 3.5, interconnectYears: 3.5, cluster: "wires" },
  { name: "Onsite gas workaround", campusYears: 3, interconnectYears: 2, cluster: "fuel" },
  { name: "SMR (first wave)", campusYears: 8, interconnectYears: 8, cluster: "fuel" },
  { name: "DC battery flex (2030)", campusYears: 4, interconnectYears: 3, cluster: "fuel" },
];

export const CLUSTER_COLORS: Record<PacePoint["cluster"], string> = {
  campus: "#22d3ee",
  wires: "#f59e0b",
  fuel: "#a78bfa",
};

export function demandDumbbell() {
  return DEMAND_PATH.filter((d) => d.priorBase != null && d.newCentral != null).map((d) => ({
    year: String(d.year),
    prior: d.priorBase as number,
    neu: d.newCentral as number,
    delta: (d.newCentral as number) - (d.priorBase as number),
  }));
}

export function bottleneckDeltas() {
  return BOTTLENECK_ROWS.map((r) => ({
    id: r.id,
    metric: r.metric,
    delta: r.valueNew - r.valuePrior,
    valueNew: r.valueNew,
    unit: r.unit,
  }));
}

export function fmtTwh(n: number) {
  return `${n.toLocaleString("en-US")} TWh`;
}

export function fmtGw(n: number) {
  return `${n.toLocaleString("en-US")} GW`;
}

export function fmtPct(n: number) {
  return `${n}%`;
}
