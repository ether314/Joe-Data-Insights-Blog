/**
 * Fiscal & industrial policy — concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 *
 * Complements the H-NIPO research ledger (stock & toolkit) and the 2026 vintage
 * updates (motives, strategic targeting, monthly flow) with top-1 / top-3 shares
 * across counts, fiscal packages, and within-bloc strategic intensity.
 *
 * Primary sources:
 * - Teneo / GTA NIPO (Mar 2026): Big Three ~63% of cumulative industrial-policy stock
 * - IMF WP/24/1 + WP/25/222 H-NIPO: China+EU+US ~53% historical; ~48% of 2023 census
 * - GTA ZG #88: strategic / dual-use subsidy shares inside Big Three
 * - GTA Monthly Roundup June 2026: US/EU/CN vs rest flow split
 * - Statutory package headlines: CHIPS, IRA, EU Chips/IPCEI, Big Fund III, JP/KR
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Count shares: Teneo–GTA cumulative Big Three stock (~63%) and IMF–GTA H-NIPO / 2023 NIPO bloc totals (53% / 48%). Individual jurisdiction count splits inside the Big Three are estimated to sum to disclosed bloc totals. Package USD figures are statutory appropriations, mobilisation targets, state-aid approvals, or tax-credit scores — not outlays-to-date — and are not comparable dollar-for-dollar. Strategic subsidy shares from GTA ZG #88. June 2026 geography from GTA Monthly Roundup.";

export const TENEO_URL =
  "https://www.teneo.com/app/uploads/2026/03/The-New-Age-of-Industrial-Policy-What-it-Means-for-Business-Strategy.pdf";
export const IMF_WP24_URL =
  "https://www.imf.org/en/publications/wp/issues/2023/12/23/the-return-of-industrial-policy-in-data-542828";
export const IMF_WP25_URL =
  "https://www.imf.org/en/Publications/WP/Issues/2025/10/17/Industrial-Policy-Since-the-Great-Financial-Crisis-571122";
export const GTA_ZG88_URL =
  "https://globaltradealert.org/reports/Subsidising-the-Chokepoint-Strategic-Convergence-and-Its-Limits";
export const GTA_JUN_URL =
  "https://globaltradealert.org/blog/GTA-Monthly-Roundup-June-2026";
export const GTA_NIPO_URL =
  "https://globaltradealert.org/reports/new-industrial-policy-observatory-nipo";

export const PRIOR_RESEARCH_PATH = "/blog/fiscal-industrial-policy-research-2026";
export const PRIOR_Q3_PATH = "/blog/fiscal-industrial-policy-update-2026q3";
export const PRIOR_AUG608_PATH = "/blog/fiscal-industrial-policy-update-202608";

export const HEADLINE = {
  /** Teneo cumulative stock — Big Three share */
  top3StockSharePct: 63,
  top3StockLabel: "US · EU · China",
  /** Estimated top-1 count share inside cumulative stock (China-led) */
  top1StockSharePct: 24,
  top1StockLabel: "China",
  /** Approximate HHI on six-bucket stock shares (0–10,000) */
  stockHhi: 1846,
  /** H-NIPO / 2023 NIPO bloc checks */
  hNipoTop3Pct: 53,
  nipo2023Top3Pct: 48,
  hNipoTotal: 34248,
  nipo2023Total: 2580,
  /** Package USD concentration among major war-chest headlines */
  top1PackageSharePct: 71,
  top1PackageLabel: "United States",
  top3PackageSharePct: 93,
  packageUniverseUsdBn: 626,
  usPackageUsdBn: 447,
  /** Strategic / dual-use subsidy intensity inside Big Three (ZG #88) */
  chinaStrategicPct: 98,
  euStrategicPct: 70,
  usStrategicPct: 76,
  /** June 2026 monthly flow — less concentrated than stock */
  juneTop1SharePct: 20,
  juneTop1Label: "United States",
  juneTop3SharePct: 38,
  juneRestSharePct: 62,
  juneTotal: 823,
  /** 2025 import-barrier concentration */
  usImportBarrierSharePct: 20,
  importBarrierShareOfToolkitPct: 27,
} as const;

export type JurisdictionShare = {
  jurisdiction: string;
  short: string;
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Cumulative industrial-policy stock shares (count basis).
 * Big Three sum to Teneo ~63%; China/EU/US split estimated; Japan/Korea estimated;
 * Rest closes to 100%.
 */
export const STOCK_SHARES: JurisdictionShare[] = [
  {
    jurisdiction: "China",
    short: "China",
    sharePct: 24,
    cumulativeSharePct: 24,
    confidence: "estimated",
    fill: "#f43f5e",
    note: "Largest single jurisdiction in most NIPO vintages; split estimated inside 63% Big Three",
  },
  {
    jurisdiction: "United States",
    short: "US",
    sharePct: 21,
    cumulativeSharePct: 45,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    jurisdiction: "European Union + MS",
    short: "EU",
    sharePct: 18,
    cumulativeSharePct: 63,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "EU + member states treated as one bloc to match Teneo Big Three",
  },
  {
    jurisdiction: "Japan",
    short: "Japan",
    sharePct: 5,
    cumulativeSharePct: 68,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    jurisdiction: "South Korea",
    short: "Korea",
    sharePct: 4,
    cumulativeSharePct: 72,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    jurisdiction: "Rest of world",
    short: "RoW",
    sharePct: 28,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#64748b",
    note: "Closes universe after disclosed Big Three 63%",
  },
];

/** Lorenz-style concentration curve for stock counts */
export const STOCK_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 24, equalPct: 16.7 },
  { rank: 2, label: "Top-2", sharePct: 45, equalPct: 33.3 },
  { rank: 3, label: "Top-3", sharePct: 63, equalPct: 50 },
  { rank: 4, label: "Top-4", sharePct: 68, equalPct: 66.7 },
  { rank: 5, label: "Top-5", sharePct: 72, equalPct: 83.3 },
  { rank: 6, label: "All", sharePct: 100, equalPct: 100 },
];

export type PackageJurisdiction = {
  jurisdiction: string;
  short: string;
  usdBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  packages: string;
};

/** Major fiscal-package war chests rolled up by jurisdiction */
export const PACKAGE_SHARES: PackageJurisdiction[] = [
  {
    jurisdiction: "United States",
    short: "US",
    usdBn: 446.7,
    sharePct: 71.4,
    cumulativeSharePct: 71.4,
    confidence: "disclosed",
    fill: "#0ea5e9",
    packages: "IRA clean-energy TE (~$370B) + CHIPS appropriations ($52.7B) + CHIPS ITC (~$24B)",
  },
  {
    jurisdiction: "European Union",
    short: "EU",
    usdBn: 87,
    sharePct: 13.9,
    cumulativeSharePct: 85.3,
    confidence: "estimated",
    fill: "#8b5cf6",
    packages: "EU Chips mobilisation (~$47B) + IPCEI state aid (~$40B)",
  },
  {
    jurisdiction: "China",
    short: "China",
    usdBn: 48,
    sharePct: 7.7,
    cumulativeSharePct: 93.0,
    confidence: "estimated",
    fill: "#f43f5e",
    packages: "National IC Big Fund III (~$48B reported raise)",
  },
  {
    jurisdiction: "Japan",
    short: "Japan",
    usdBn: 25,
    sharePct: 4.0,
    cumulativeSharePct: 97.0,
    confidence: "estimated",
    fill: "#14b8a6",
    packages: "Semiconductor / economic-security support envelope",
  },
  {
    jurisdiction: "South Korea",
    short: "Korea",
    usdBn: 19,
    sharePct: 3.0,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#f59e0b",
    packages: "K-Chips multi-year tax & support package",
  },
];

export const PACKAGE_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 71.4, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 85.3, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 93.0, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 97.0, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export type StrategicIntensity = {
  bloc: string;
  short: string;
  earlyPct: number;
  latePct: number;
  deltaPp: number;
  confidence: Confidence;
  fill: string;
};

/** Share of subsidy IP covering dual-use / advanced tech — ZG #88 */
export const STRATEGIC_INTENSITY: StrategicIntensity[] = [
  {
    bloc: "China",
    short: "China",
    earlyPct: 85,
    latePct: 98,
    deltaPp: 13,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    bloc: "United States",
    short: "US",
    earlyPct: 33,
    latePct: 76,
    deltaPp: 43,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    bloc: "European Union",
    short: "EU",
    earlyPct: 50,
    latePct: 70,
    deltaPp: 20,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
];

export type FlowBloc = {
  bloc: string;
  short: string;
  interventions: number;
  sharePct: number;
  confidence: Confidence;
  fill: string;
};

/** June 2026 Monthly Roundup — all GTA developments that month */
export const JUNE_FLOW: FlowBloc[] = [
  {
    bloc: "United States",
    short: "US",
    interventions: 163,
    sharePct: 20,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    bloc: "European Union + MS",
    short: "EU",
    interventions: 100,
    sharePct: 12,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    bloc: "China",
    short: "China",
    interventions: 47,
    sharePct: 6,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    bloc: "Rest of world",
    short: "RoW",
    interventions: 513,
    sharePct: 62,
    confidence: "disclosed",
    fill: "#64748b",
  },
];

export type LensCompare = {
  lens: string;
  short: string;
  top1Pct: number;
  top3Pct: number;
  top1Label: string;
  note: string;
  confidence: Confidence;
};

/** Cross-lens concentration comparison for scatter / dumbbell */
export const LENS_COMPARE: LensCompare[] = [
  {
    lens: "Cumulative stock (counts)",
    short: "Stock counts",
    top1Pct: 24,
    top3Pct: 63,
    top1Label: "China",
    note: "Teneo Big Three 63%; top-1 estimated",
    confidence: "estimated",
  },
  {
    lens: "H-NIPO historical (IMF)",
    short: "H-NIPO",
    top1Pct: 20,
    top3Pct: 53,
    top1Label: "China (est.)",
    note: "Disclosed top-3 53%; top-1 estimated",
    confidence: "estimated",
  },
  {
    lens: "2023 NIPO census",
    short: "2023 census",
    top1Pct: 18,
    top3Pct: 48,
    top1Label: "China (est.)",
    note: "Disclosed top-3 48%",
    confidence: "estimated",
  },
  {
    lens: "Major fiscal packages ($)",
    short: "Package $",
    top1Pct: 71,
    top3Pct: 93,
    top1Label: "United States",
    note: "Among CHIPS/IRA/EU/CN/JP/KR headlines",
    confidence: "disclosed",
  },
  {
    lens: "June 2026 monthly flow",
    short: "Jun flow",
    top1Pct: 20,
    top3Pct: 38,
    top1Label: "United States",
    note: "GTA Roundup; RoW still 62%",
    confidence: "disclosed",
  },
];

export type BarrierShare = {
  actor: string;
  short: string;
  sharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** 2025 import-barrier action shares (toolkit context) */
export const IMPORT_BARRIER_SHARES: BarrierShare[] = [
  {
    actor: "United States",
    short: "US",
    sharePct: 20,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "~20% of global import-barrier actions in 2025 distortive mix",
  },
  {
    actor: "Other jurisdictions",
    short: "Other",
    sharePct: 80,
    confidence: "estimated",
    fill: "#64748b",
    note: "Residual of disclosed US share",
  },
];

export type VintageCheck = {
  vintage: string;
  metric: string;
  top3Pct: number;
  source: string;
  confidence: Confidence;
};

export const VINTAGE_CHECKS: VintageCheck[] = [
  {
    vintage: "H-NIPO 2009–2023",
    metric: "China + EU + US share of interventions",
    top3Pct: 53,
    source: "IMF WP/25/222",
    confidence: "disclosed",
  },
  {
    vintage: "NIPO 2023 census",
    metric: "China + EU + US share of 2,580 measures",
    top3Pct: 48,
    source: "IMF WP/24/1",
    confidence: "disclosed",
  },
  {
    vintage: "Teneo cumulative stock",
    metric: "Big Three share of cumulative IPs",
    top3Pct: 63,
    source: "Teneo / GTA Mar 2026",
    confidence: "disclosed",
  },
  {
    vintage: "June 2026 monthly",
    metric: "US + EU + CN share of Roundup tape",
    top3Pct: 38,
    source: "GTA June Roundup",
    confidence: "disclosed",
  },
];

export const SOURCES = [
  { label: "Teneo — New Age of Industrial Policy (Mar 2026)", url: TENEO_URL },
  { label: "IMF WP/24/1 — Return of Industrial Policy in Data", url: IMF_WP24_URL },
  { label: "IMF WP/25/222 — Industrial Policy Since the GFC", url: IMF_WP25_URL },
  { label: "GTA ZG #88 — Subsidising the Chokepoint", url: GTA_ZG88_URL },
  { label: "GTA Monthly Roundup — June 2026", url: GTA_JUN_URL },
  { label: "Global Trade Alert — NIPO", url: GTA_NIPO_URL },
];

export function fmtPct(n: number, d = 0): string {
  return `${n.toFixed(d)}%`;
}

export function fmtBn(n: number): string {
  return n >= 100 ? `$${n.toFixed(0)}B` : `$${n.toFixed(1)}B`;
}

export function fmtInt(n: number): string {
  return n.toLocaleString("en-US");
}
