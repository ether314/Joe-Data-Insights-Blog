/**
 * Fiscal & industrial policy — Q3 2026 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 *
 * Q3 vintage complements the 2026 concentration print by adding (1) HHI across
 * lenses, (2) sectoral package concentration inside the US war chest, (3) a
 * vintage slope of top-3 shares, and (4) toolkit instrument mix — while keeping
 * the disclosed Big Three stock / package / June-flow anchors.
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
  "Q3 concentration lens. Count shares: Teneo–GTA cumulative Big Three stock (~63%) and IMF–GTA H-NIPO / 2023 NIPO bloc totals (53% / 48%). Individual jurisdiction splits inside the Big Three are estimated to sum to disclosed bloc totals. Package USD figures are statutory appropriations, mobilisation targets, state-aid approvals, or tax-credit scores — not outlays-to-date. Sectoral US splits (IRA TE vs CHIPS) are disclosed package headlines inside the US rollup. HHI values are analytical indexes on the stated bucket shares (0–10,000). Strategic subsidy shares from GTA ZG #88. June 2026 geography from GTA Monthly Roundup.";

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

export const PRIOR_CONCENTRATION_PATH =
  "/blog/fiscal-industrial-policy-concentration-2026";
export const PRIOR_RESEARCH_PATH = "/blog/fiscal-industrial-policy-research-2026";
export const PRIOR_Q3_PATH = "/blog/fiscal-industrial-policy-update-2026q3";
export const PRIOR_AUG608_PATH = "/blog/fiscal-industrial-policy-update-202608";

export const HEADLINE = {
  top3StockSharePct: 63,
  top3StockLabel: "US · EU · China",
  top1StockSharePct: 24,
  top1StockLabel: "China",
  stockHhi: 1846,
  hNipoTop3Pct: 53,
  nipo2023Top3Pct: 48,
  hNipoTotal: 34248,
  nipo2023Total: 2580,
  top1PackageSharePct: 71,
  top1PackageLabel: "United States",
  top3PackageSharePct: 93,
  packageHhi: 5320,
  packageUniverseUsdBn: 626,
  usPackageUsdBn: 447,
  /** US sectoral: IRA TE share of US package rollup */
  usIraShareOfUsPct: 83,
  usChipsShareOfUsPct: 17,
  usIraUsdBn: 370,
  usChipsUsdBn: 76.7,
  chinaStrategicPct: 98,
  euStrategicPct: 70,
  usStrategicPct: 76,
  juneTop1SharePct: 20,
  juneTop1Label: "United States",
  juneTop3SharePct: 38,
  juneRestSharePct: 62,
  juneFlowHhi: 980,
  juneTotal: 823,
  usImportBarrierSharePct: 20,
  importBarrierShareOfToolkitPct: 27,
  subsidyShareOfToolkitPct: 55,
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

/** Cumulative industrial-policy stock shares (count basis). */
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

/** Q3 addition: sectoral concentration inside the US package rollup */
export type SectorSlice = {
  sector: string;
  short: string;
  usdBn: number;
  shareOfUsPct: number;
  shareOfUniversePct: number;
  confidence: Confidence;
  fill: string;
  note: string;
};

export const US_SECTOR_PACKAGES: SectorSlice[] = [
  {
    sector: "IRA clean-energy tax expenditures",
    short: "IRA TE",
    usdBn: 370,
    shareOfUsPct: 82.8,
    shareOfUniversePct: 59.1,
    confidence: "disclosed",
    fill: "#10b981",
    note: "Original IRA clean-energy TE score; dominates US fiscal capacity",
  },
  {
    sector: "CHIPS Act (approp. + ITC)",
    short: "CHIPS",
    usdBn: 76.7,
    shareOfUsPct: 17.2,
    shareOfUniversePct: 12.3,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "$52.7B appropriations + ~$24B ITC",
  },
];

export type HhiLens = {
  lens: string;
  short: string;
  hhi: number;
  top1Pct: number;
  top3Pct: number;
  top1Label: string;
  confidence: Confidence;
  fill: string;
  note: string;
};

/** Analytical HHI on stated bucket shares — Q3 cross-lens concentration meter */
export const HHI_BY_LENS: HhiLens[] = [
  {
    lens: "Major fiscal packages ($)",
    short: "Package $",
    hhi: 5320,
    top1Pct: 71,
    top3Pct: 93,
    top1Label: "United States",
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "Five-jurisdiction war-chest universe",
  },
  {
    lens: "Cumulative stock (counts)",
    short: "Stock counts",
    hhi: 1846,
    top1Pct: 24,
    top3Pct: 63,
    top1Label: "China",
    confidence: "estimated",
    fill: "#f43f5e",
    note: "Six-bucket reconstruction around Teneo 63%",
  },
  {
    lens: "June 2026 monthly flow",
    short: "Jun flow",
    hhi: 980,
    top1Pct: 20,
    top3Pct: 38,
    top1Label: "United States",
    confidence: "disclosed",
    fill: "#f59e0b",
    note: "Four-bloc Roundup geography; RoW 62%",
  },
  {
    lens: "US sectoral packages",
    short: "US sectors",
    hhi: 7130,
    top1Pct: 83,
    top3Pct: 100,
    top1Label: "IRA TE",
    confidence: "disclosed",
    fill: "#10b981",
    note: "Two-slice US rollup: IRA TE vs CHIPS",
  },
];

export type VintageSlope = {
  vintage: string;
  short: string;
  top3Pct: number;
  top1Pct: number;
  yearOrd: number;
  source: string;
  confidence: Confidence;
};

/** Vintage slope of top-3 (and estimated top-1) concentration */
export const VINTAGE_SLOPE: VintageSlope[] = [
  {
    vintage: "H-NIPO 2009–2023",
    short: "H-NIPO",
    top3Pct: 53,
    top1Pct: 20,
    yearOrd: 2023,
    source: "IMF WP/25/222",
    confidence: "estimated",
  },
  {
    vintage: "NIPO 2023 census",
    short: "2023 census",
    top3Pct: 48,
    top1Pct: 18,
    yearOrd: 2023.5,
    source: "IMF WP/24/1",
    confidence: "estimated",
  },
  {
    vintage: "Teneo cumulative stock",
    short: "Teneo stock",
    top3Pct: 63,
    top1Pct: 24,
    yearOrd: 2026,
    source: "Teneo / GTA Mar 2026",
    confidence: "estimated",
  },
  {
    vintage: "June 2026 monthly",
    short: "Jun flow",
    top3Pct: 38,
    top1Pct: 20,
    yearOrd: 2026.5,
    source: "GTA June Roundup",
    confidence: "disclosed",
  },
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

export type ToolkitSlice = {
  instrument: string;
  short: string;
  sharePct: number;
  confidence: Confidence;
  fill: string;
  note: string;
};

/** Approximate 2025 distortive-toolkit instrument mix (theme cross-section) */
export const TOOLKIT_MIX: ToolkitSlice[] = [
  {
    instrument: "Subsidies / state aid",
    short: "Subsidies",
    sharePct: 55,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Dominant industrial-policy instrument in NIPO-style tapes",
  },
  {
    instrument: "Import barriers / tariffs",
    short: "Import barriers",
    sharePct: 27,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "US alone ~20% of 2025 import-barrier actions",
  },
  {
    instrument: "Export controls / other",
    short: "Export / other",
    sharePct: 18,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Residual distortive mix including export measures",
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
    lens: "US sectoral (IRA vs CHIPS)",
    short: "US sectors",
    top1Pct: 83,
    top3Pct: 100,
    top1Label: "IRA TE",
    note: "Inside US package rollup only",
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

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}
