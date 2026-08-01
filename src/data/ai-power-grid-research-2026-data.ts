/**
 * IEA Energy and AI — global data-centre electricity demand vs supply mix & grid bottlenecks.
 * Complements the US-centric LBNL/transmission-miles post with a global scenario frame.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Global data-centre electricity from the IEA Energy and AI report (2025) and IEA Key Questions on Energy and AI update. Supply fuel shares are the physical generation mix serving data centres (grid + onsite), not contractual PPAs. US interconnection queue volumes from LBNL Queued Up 2026 (end-2025). Intermediate scenario years between disclosed endpoints are linear interpolations marked estimated.";

export const IEA_ENERGY_AI_URL =
  "https://www.iea.org/reports/energy-and-ai/executive-summary";
export const IEA_DEMAND_URL =
  "https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai";
export const IEA_SUPPLY_URL =
  "https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai";
export const IEA_KEY_QUESTIONS_URL =
  "https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary";
export const LBNL_QUEUE_URL = "https://emp.lbl.gov/queues";

export const HEADLINE = {
  dcTwh2024: 415,
  dcShare2024Pct: 1.5,
  dcTwh2025: 485,
  dcTwh2030Base: 945,
  dcShare2030Pct: 3.0,
  dcTwh2035Base: 1200,
  dcTwh2035LiftOff: 1700,
  dcTwh2035HighEff: 970,
  dcTwh2035Headwinds: 700,
  usShare2024Pct: 45,
  chinaShare2024Pct: 25,
  europeShare2024Pct: 15,
  growthSince2017Pct: 12,
  accelServerCagrPct: 30,
  conventionalServerCagrPct: 9,
  renewablesShareOfIncrementalPct: 50,
  fossilsShareOfIncrementalPct: 40,
  projectsAtDelayRiskPct: 20,
  usFiveClusterSharePct: 50,
  usDevInExistingClustersPct: 50,
  queueGenGw2025: 1312,
  queueStorageGw2025: 749,
  queueMedianYears: 5,
  genForDcTwh2024: 460,
  genForDcTwh2030: 1000,
  smrGwHyperscalerPlans: 20,
  co2PeakMt: 320,
};

/** Scenario paths — disclosed anchors + estimated interpolations */
export type ScenarioId = "base" | "liftOff" | "highEff" | "headwinds";

export type ScenarioPoint = {
  year: number;
  base: number;
  liftOff: number;
  highEff: number;
  headwinds: number;
  confidence: Confidence;
};

export const SCENARIO_PATH: ScenarioPoint[] = [
  {
    year: 2024,
    base: 415,
    liftOff: 415,
    highEff: 415,
    headwinds: 415,
    confidence: "disclosed",
  },
  {
    year: 2025,
    base: 485,
    liftOff: 510,
    highEff: 470,
    headwinds: 460,
    confidence: "estimated",
  },
  {
    year: 2027,
    base: 650,
    liftOff: 780,
    highEff: 600,
    headwinds: 560,
    confidence: "estimated",
  },
  {
    year: 2030,
    base: 945,
    liftOff: 1200,
    highEff: 820,
    headwinds: 680,
    confidence: "estimated",
  },
  {
    year: 2035,
    base: 1200,
    liftOff: 1700,
    highEff: 970,
    headwinds: 700,
    confidence: "disclosed",
  },
];

/** Regional demand — 2024 shares disclosed; 2030 deltas disclosed for major regions */
export type RegionDemand = {
  region: string;
  short: string;
  twh2024: number;
  twh2030: number;
  deltaTwh: number;
  confidence: Confidence;
};

export const REGION_DEMAND: RegionDemand[] = [
  {
    region: "United States",
    short: "United States",
    twh2024: 187,
    twh2030: 427,
    deltaTwh: 240,
    confidence: "disclosed",
  },
  {
    region: "China",
    short: "China",
    twh2024: 104,
    twh2030: 279,
    deltaTwh: 175,
    confidence: "disclosed",
  },
  {
    region: "Europe",
    short: "Europe",
    twh2024: 62,
    twh2030: 107,
    deltaTwh: 45,
    confidence: "disclosed",
  },
  {
    region: "Japan",
    short: "Japan",
    twh2024: 19,
    twh2030: 34,
    deltaTwh: 15,
    confidence: "estimated",
  },
  {
    region: "Rest of world",
    short: "Rest of world",
    twh2024: 43,
    twh2030: 98,
    deltaTwh: 55,
    confidence: "estimated",
  },
];

/** 2024 physical supply mix serving data centres */
export type FuelShare = {
  fuel: string;
  sharePct: number;
  fill: string;
  confidence: Confidence;
};

export const SUPPLY_MIX_2024: FuelShare[] = [
  { fuel: "Coal", sharePct: 30, fill: "#64748b", confidence: "disclosed" },
  { fuel: "Renewables", sharePct: 27, fill: "#0d9488", confidence: "disclosed" },
  { fuel: "Natural gas", sharePct: 26, fill: "#f59e0b", confidence: "disclosed" },
  { fuel: "Nuclear", sharePct: 15, fill: "#6366f1", confidence: "disclosed" },
  { fuel: "Other", sharePct: 2, fill: "#94a3b8", confidence: "estimated" },
];

/** Share of incremental DC electricity demand met by each source to 2030 (Base Case) */
export const INCREMENTAL_SUPPLY: FuelShare[] = [
  {
    fuel: "Renewables",
    sharePct: 50,
    fill: "#0d9488",
    confidence: "disclosed",
  },
  {
    fuel: "Natural gas + coal",
    sharePct: 40,
    fill: "#f59e0b",
    confidence: "disclosed",
  },
  {
    fuel: "Nuclear & other",
    sharePct: 10,
    fill: "#6366f1",
    confidence: "estimated",
  },
];

/** Contributors to net increase in global DC electricity (Base Case narrative shares) */
export type GrowthDriver = {
  driver: string;
  shareOfIncreasePct: number;
  fill: string;
  confidence: Confidence;
};

export const GROWTH_DRIVERS: GrowthDriver[] = [
  {
    driver: "Accelerated servers (AI)",
    shareOfIncreasePct: 48,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    driver: "Cooling & site infrastructure",
    shareOfIncreasePct: 20,
    fill: "#f59e0b",
    confidence: "disclosed",
  },
  {
    driver: "Conventional servers",
    shareOfIncreasePct: 20,
    fill: "#64748b",
    confidence: "disclosed",
  },
  {
    driver: "Other IT (storage, network)",
    shareOfIncreasePct: 12,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
];

export type BottleneckMetric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  note: string;
  confidence: Confidence;
};

export const BOTTLENECKS: BottleneckMetric[] = [
  {
    id: "delayRisk",
    label: "Planned DC projects at delay risk",
    value: 20,
    unit: "%",
    note: "IEA — unless grid risks are addressed",
    confidence: "disclosed",
  },
  {
    id: "usClusters",
    label: "US DC capacity in five clusters",
    value: 50,
    unit: "%",
    note: "Nearly half of US data-centre capacity",
    confidence: "disclosed",
  },
  {
    id: "usDevClusters",
    label: "US pipeline in existing large clusters",
    value: 50,
    unit: "%",
    note: "Raises local bottleneck risk",
    confidence: "disclosed",
  },
  {
    id: "queueYears",
    label: "US median IR→COD (2025 builds)",
    value: 5,
    unit: " years",
    note: "LBNL Queued Up 2026",
    confidence: "disclosed",
  },
];

export const QUEUE_STACK = [
  { label: "Generation in queue", gw: 1312, fill: "#0ea5e9" },
  { label: "Storage in queue", gw: 749, fill: "#8b5cf6" },
].sort((a, b) => b.gw - a.gw);

export function fmtTwh(n: number, digits = 0): string {
  return `${n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })} TWh`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtGw(n: number): string {
  return `${n.toLocaleString()} GW`;
}

export const SOURCES = [
  { label: "IEA — Energy and AI (executive summary)", url: IEA_ENERGY_AI_URL },
  { label: "IEA — Energy demand from AI", url: IEA_DEMAND_URL },
  { label: "IEA — Energy supply for AI", url: IEA_SUPPLY_URL },
  {
    label: "IEA — Key Questions on Energy and AI",
    url: IEA_KEY_QUESTIONS_URL,
  },
  { label: "LBNL — Queued Up interconnection data", url: LBNL_QUEUE_URL },
] as const;
