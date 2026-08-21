/**
 * Fiscal & industrial policy — Aug 202608 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 *
 * 202608 vintage complements the Q3 concentration print by folding in (1) the
 * May–Jul GTA monthly flow path from the toolkit update, (2) Jun–Jul ownership /
 * equity stakes as a separate dollar ladder, (3) the disclosed 2025 toolkit mix
 * (import barriers / subsidies / finance controls), and (4) a Korea mega-plan
 * sensitivity that flips package top-1 when the $951B headline is included.
 *
 * Primary sources:
 * - Teneo / GTA NIPO (Mar 2026): Big Three ~63% cumulative stock; 2025 toolkit mix
 * - IMF WP/24/1 + WP/25/222 H-NIPO: China+EU+US ~53% historical; ~48% of 2023 census
 * - GTA ZG #88: strategic / dual-use subsidy shares inside Big Three
 * - GTA Monthly Roundups May / June / July 2026
 * - Statutory package headlines: CHIPS, IRA, EU Chips/IPCEI, Big Fund III, JP/KR
 * - Korea mega-plan headline (~$951B) as alternate package universe sensitivity
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Aug 202608 concentration lens. Count shares: Teneo–GTA cumulative Big Three stock (~63%) and IMF–GTA H-NIPO / 2023 NIPO bloc totals (53% / 48%). Individual jurisdiction splits inside the Big Three are estimated to sum to disclosed bloc totals. Package USD figures are statutory appropriations, mobilisation targets, state-aid approvals, or tax-credit scores — not outlays-to-date. Korea mega-plan (~$951B) is a disclosed headline used only in the alternate package universe; it is not comparable to IRA TE / CHIPS appropriations dollar-for-dollar. Ownership stakes from GTA Jun–Jul 2026 Roundups (equity LOIs / funds). Toolkit mix from Teneo Fig.2 (2025). HHI values are analytical indexes on the stated bucket shares (0–10,000). Strategic subsidy shares from GTA ZG #88.";

export const TENEO_URL =
  "https://www.teneo.com/app/uploads/2026/03/The-New-Age-of-Industrial-Policy-What-it-Means-for-Business-Strategy.pdf";
export const IMF_WP24_URL =
  "https://www.imf.org/en/publications/wp/issues/2023/12/23/the-return-of-industrial-policy-in-data-542828";
export const IMF_WP25_URL =
  "https://www.imf.org/en/Publications/WP/Issues/2025/10/17/Industrial-Policy-Since-the-Great-Financial-Crisis-571122";
export const GTA_ZG88_URL =
  "https://globaltradealert.org/reports/Subsidising-the-Chokepoint-Strategic-Convergence-and-Its-Limits";
export const GTA_MAY_URL = "https://globaltradealert.org/blog/427";
export const GTA_JUN_URL =
  "https://globaltradealert.org/blog/GTA-Monthly-Roundup-June-2026";
export const GTA_JUL_URL =
  "https://globaltradealert.org/blog/GTA-Monthly-Roundup-July-2026";
export const GTA_NIPO_URL =
  "https://globaltradealert.org/reports/new-industrial-policy-observatory-nipo";

export const PRIOR_CONCENTRATION_PATH =
  "/blog/fiscal-industrial-policy-concentration-2026";
export const PRIOR_Q3_CONC_PATH =
  "/blog/fiscal-industrial-policy-concentration-2026q3";
export const PRIOR_RESEARCH_PATH = "/blog/fiscal-industrial-policy-research-2026";
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
  /** Core war-chest universe (excl. Korea mega-plan) */
  top1PackageSharePct: 71,
  top1PackageLabel: "United States",
  top3PackageSharePct: 93,
  packageHhi: 5320,
  packageUniverseUsdBn: 626,
  usPackageUsdBn: 447,
  /** Alternate universe including Korea mega-plan */
  koreaMegaPlanUsdBn: 951,
  altUniverseUsdBn: 1577,
  altTop1SharePct: 60,
  altTop1Label: "Korea mega-plan",
  altTop3SharePct: 89,
  altPackageHhi: 4280,
  /** Ownership / equity stakes Jun–Jul */
  ownershipUniverseUsdBn: 5.21,
  ownershipTop1SharePct: 63,
  ownershipTop1Label: "China subnational funds",
  ownershipTop3SharePct: 90,
  ownershipHhi: 4470,
  chinaOwnershipUsdBn: 3.3,
  /** June flow */
  juneTop1SharePct: 20,
  juneTop1Label: "United States",
  juneTop3SharePct: 38,
  juneRestSharePct: 62,
  juneFlowHhi: 980,
  juneTotal: 823,
  /** May–Jul flow path */
  mayTotal: 804,
  julTotal: 1008,
  julVsMayDeltaPct: 25,
  /** Toolkit 2025 */
  importBarrierSharePct: 27,
  domesticSubsidySharePct: 26,
  financeControlSharePct: 23,
  usImportBarrierSharePct: 20,
  toolkitTop1SharePct: 27,
  toolkitHhi: 2550,
  /** Strategic intensity */
  chinaStrategicPct: 98,
  euStrategicPct: 70,
  usStrategicPct: 76,
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

/** Core five-jurisdiction war chest (excl. Korea mega-plan). */
export const PACKAGE_SHARES_CORE: PackageJurisdiction[] = [
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
    jurisdiction: "South Korea (K-Chips)",
    short: "Korea K-Chips",
    usdBn: 19,
    sharePct: 3.0,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#f59e0b",
    packages: "K-Chips multi-year tax & support package",
  },
];

/**
 * Alternate package universe: core + Korea mega-plan headline (~$951B).
 * Flips top-1 from US to Korea; used only as sensitivity.
 */
export const PACKAGE_SHARES_ALT: PackageJurisdiction[] = [
  {
    jurisdiction: "South Korea mega-plan",
    short: "Korea mega",
    usdBn: 951,
    sharePct: 60.3,
    cumulativeSharePct: 60.3,
    confidence: "disclosed",
    fill: "#f59e0b",
    packages: "Announced multi-year industrial mega-plan headline (~$951B)",
  },
  {
    jurisdiction: "United States",
    short: "US",
    usdBn: 446.7,
    sharePct: 28.3,
    cumulativeSharePct: 88.6,
    confidence: "disclosed",
    fill: "#0ea5e9",
    packages: "IRA TE + CHIPS approp. + ITC",
  },
  {
    jurisdiction: "European Union",
    short: "EU",
    usdBn: 87,
    sharePct: 5.5,
    cumulativeSharePct: 94.1,
    confidence: "estimated",
    fill: "#8b5cf6",
    packages: "EU Chips + IPCEI",
  },
  {
    jurisdiction: "China",
    short: "China",
    usdBn: 48,
    sharePct: 3.0,
    cumulativeSharePct: 97.1,
    confidence: "estimated",
    fill: "#f43f5e",
    packages: "Big Fund III",
  },
  {
    jurisdiction: "Japan + K-Chips",
    short: "JP+KChips",
    usdBn: 44,
    sharePct: 2.9,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#14b8a6",
    packages: "Japan envelope + prior K-Chips package",
  },
];

export const PACKAGE_CONCENTRATION_CURVE_CORE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 71.4, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 85.3, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 93.0, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 97.0, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export const PACKAGE_CONCENTRATION_CURVE_ALT = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 60.3, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 88.6, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 94.1, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 97.1, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export type OwnershipStake = {
  label: string;
  short: string;
  usdMillions: number;
  sharePct: number;
  cumulativeSharePct: number;
  geography: string;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Jun–Jul Roundup ownership / equity stakes, ranked by USD. */
export const OWNERSHIP_STAKES: OwnershipStake[] = [
  {
    label: "CN subnational equity funds (Jul)",
    short: "CN subnational",
    usdMillions: 3300,
    sharePct: 63.4,
    cumulativeSharePct: 63.4,
    geography: "China",
    confidence: "disclosed",
    fill: "#f43f5e",
    note: "Five governments, Jul Roundup",
  },
  {
    label: "US CHIPS equity LOIs (Jul, 7 firms)",
    short: "US CHIPS LOIs",
    usdMillions: 874,
    sharePct: 16.8,
    cumulativeSharePct: 80.2,
    geography: "United States",
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    label: "SandboxAQ CHIPS stake (Jun)",
    short: "SandboxAQ",
    usdMillions: 500,
    sharePct: 9.6,
    cumulativeSharePct: 89.8,
    geography: "United States",
    confidence: "disclosed",
    fill: "#38bdf8",
  },
  {
    label: "Canada Growth Fund → Teck (Jul)",
    short: "CGF–Teck",
    usdMillions: 283,
    sharePct: 5.4,
    cumulativeSharePct: 95.2,
    geography: "Canada",
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    label: "I-Pulse SiC semiconductors (Jun)",
    short: "I-Pulse",
    usdMillions: 250,
    sharePct: 4.8,
    cumulativeSharePct: 100,
    geography: "United States",
    confidence: "disclosed",
    fill: "#64748b",
  },
];

export const OWNERSHIP_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 63.4, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 80.2, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 89.8, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 95.2, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
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

export const HHI_BY_LENS: HhiLens[] = [
  {
    lens: "Core fiscal packages ($)",
    short: "Core packages",
    hhi: 5320,
    top1Pct: 71,
    top3Pct: 93,
    top1Label: "United States",
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "Five-jurisdiction war chest excl. Korea mega-plan",
  },
  {
    lens: "Ownership / equity stakes",
    short: "Ownership $",
    hhi: 4470,
    top1Pct: 63,
    top3Pct: 90,
    top1Label: "CN subnational",
    confidence: "disclosed",
    fill: "#f43f5e",
    note: "Jun–Jul Roundup equity LOIs / funds (~$5.2B)",
  },
  {
    lens: "Packages + Korea mega-plan",
    short: "Alt packages",
    hhi: 4280,
    top1Pct: 60,
    top3Pct: 89,
    top1Label: "Korea mega-plan",
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Sensitivity: adds $951B headline to core universe",
  },
  {
    lens: "2025 toolkit instruments",
    short: "Toolkit mix",
    hhi: 2550,
    top1Pct: 27,
    top3Pct: 76,
    top1Label: "Import barriers",
    confidence: "disclosed",
    fill: "#a855f7",
    note: "Four-way mix: barriers / subsidies / finance / export+other",
  },
  {
    lens: "Cumulative stock (counts)",
    short: "Stock counts",
    hhi: 1846,
    top1Pct: 24,
    top3Pct: 63,
    top1Label: "China",
    confidence: "estimated",
    fill: "#64748b",
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
    fill: "#10b981",
    note: "Four-bloc Roundup geography; RoW 62%",
  },
];

export type MonthlyFlowPath = {
  month: string;
  short: string;
  total: number;
  monthOrd: number;
  confidence: Confidence;
  note?: string;
};

export const MONTHLY_FLOW_PATH: MonthlyFlowPath[] = [
  {
    month: "May 2026",
    short: "May",
    total: 804,
    monthOrd: 5,
    confidence: "disclosed",
  },
  {
    month: "June 2026",
    short: "Jun",
    total: 823,
    monthOrd: 6,
    confidence: "disclosed",
    note: "Geography disclosed: US 20% · EU 12% · CN 6% · RoW 62%",
  },
  {
    month: "July 2026",
    short: "Jul",
    total: 1008,
    monthOrd: 7,
    confidence: "disclosed",
    note: "+25% vs May; geography not fully disclosed in Roundup",
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

/** Disclosed 2025 distortive toolkit mix — Teneo Fig.2 */
export const TOOLKIT_MIX: ToolkitSlice[] = [
  {
    instrument: "Import barriers / tariffs",
    short: "Import barriers",
    sharePct: 27,
    confidence: "disclosed",
    fill: "#f59e0b",
    note: "US alone ≈20% of 2025 import-barrier actions; ~55% of barriers are tariffs",
  },
  {
    instrument: "Domestic subsidies / incentives",
    short: "Domestic subsidies",
    sharePct: 26,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "No longer a monopoly instrument in the global mix",
  },
  {
    instrument: "Financial / investment controls",
    short: "Finance & FDI",
    sharePct: 23,
    confidence: "disclosed",
    fill: "#8b5cf6",
    note: "Ownership and FDI screens as industrial policy",
  },
  {
    instrument: "Export barriers & other",
    short: "Export & other",
    sharePct: 24,
    confidence: "estimated",
    fill: "#64748b",
    note: "Residual of disclosed top-three shares",
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
    lens: "Core fiscal packages ($)",
    short: "Core packages",
    top1Pct: 71,
    top3Pct: 93,
    top1Label: "United States",
    note: "CHIPS/IRA/EU/CN/JP/KR headlines",
    confidence: "disclosed",
  },
  {
    lens: "Ownership / equity stakes",
    short: "Ownership",
    top1Pct: 63,
    top3Pct: 90,
    top1Label: "CN subnational",
    note: "Jun–Jul Roundup equity LOIs / funds",
    confidence: "disclosed",
  },
  {
    lens: "Packages + Korea mega-plan",
    short: "Alt packages",
    top1Pct: 60,
    top3Pct: 89,
    top1Label: "Korea mega-plan",
    note: "Sensitivity universe",
    confidence: "estimated",
  },
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
    lens: "2025 toolkit instruments",
    short: "Toolkit",
    top1Pct: 27,
    top3Pct: 76,
    top1Label: "Import barriers",
    note: "Four-way instrument mix",
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

export const VINTAGE_SLOPE = [
  {
    vintage: "H-NIPO 2009–2023",
    short: "H-NIPO",
    top3Pct: 53,
    top1Pct: 20,
    yearOrd: 2023,
    source: "IMF WP/25/222",
    confidence: "estimated" as Confidence,
  },
  {
    vintage: "NIPO 2023 census",
    short: "2023 census",
    top3Pct: 48,
    top1Pct: 18,
    yearOrd: 2023.5,
    source: "IMF WP/24/1",
    confidence: "estimated" as Confidence,
  },
  {
    vintage: "Teneo cumulative stock",
    short: "Teneo stock",
    top3Pct: 63,
    top1Pct: 24,
    yearOrd: 2026,
    source: "Teneo / GTA Mar 2026",
    confidence: "estimated" as Confidence,
  },
  {
    vintage: "June 2026 monthly",
    short: "Jun flow",
    top3Pct: 38,
    top1Pct: 20,
    yearOrd: 2026.5,
    source: "GTA June Roundup",
    confidence: "disclosed" as Confidence,
  },
];

export const SOURCES = [
  { label: "Teneo — New Age of Industrial Policy (Mar 2026)", url: TENEO_URL },
  { label: "IMF WP/24/1 — Return of Industrial Policy in Data", url: IMF_WP24_URL },
  { label: "IMF WP/25/222 — Industrial Policy Since the GFC", url: IMF_WP25_URL },
  { label: "GTA ZG #88 — Subsidising the Chokepoint", url: GTA_ZG88_URL },
  { label: "GTA Monthly Roundup — May 2026", url: GTA_MAY_URL },
  { label: "GTA Monthly Roundup — June 2026", url: GTA_JUN_URL },
  { label: "GTA Monthly Roundup — July 2026", url: GTA_JUL_URL },
  { label: "Global Trade Alert — NIPO", url: GTA_NIPO_URL },
];

export function fmtPct(n: number, d = 0): string {
  return `${n.toFixed(d)}%`;
}

export function fmtBn(n: number): string {
  return n >= 100 ? `$${n.toFixed(0)}B` : `$${n.toFixed(1)}B`;
}

export function fmtM(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}B` : `$${n.toFixed(0)}M`;
}

export function fmtInt(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}
