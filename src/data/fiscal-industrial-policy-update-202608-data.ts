/**
 * Fiscal & industrial policy — Aug 2026 (202608) vintage update.
 * Core question: What changed vs the Q3 chokepoint-targeting print
 * (ZG #88 strategic subsidy shares) once the 2025 full-year NIPO
 * toolkit mix and mid-2026 monthly flow prints landed?
 *
 * Primary sources:
 * - Teneo / GTA NIPO analysis (Mar 2026): 2009–2025 distortive counts + 2025 instrument mix
 * - GTA Monthly Roundups May / June / July 2026 (high-frequency flow)
 * - Prior Q3 vintage: GTA ZG #88 + Market-Shaping Big Three panel
 * - Context: GTA ZG #79 / prior Aug motive print; IMF WP/25/222 H-NIPO stock
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Vintage delta: Q3 2026 update print (ZG #88 strategic subsidy shares + selective-activity plateau) vs Teneo–GTA NIPO full-year 2025 toolkit composition (Mar 2026) and GTA Monthly Roundups May–Jul 2026. Intervention shares are percent of recorded distortive industrial-policy actions — not dollar outlays. Monthly Roundup totals cover all GTA-documented trade and industrial developments in the calendar month (broader than NIPO-only selective IP).";

export const TENEO_URL =
  "https://www.teneo.com/app/uploads/2026/03/The-New-Age-of-Industrial-Policy-What-it-Means-for-Business-Strategy.pdf";
export const GTA_MAY_URL = "https://globaltradealert.org/blog/427";
export const GTA_JUN_URL =
  "https://globaltradealert.org/blog/GTA-Monthly-Roundup-June-2026";
export const GTA_JUL_URL =
  "https://globaltradealert.org/blog/GTA-Monthly-Roundup-July-2026";
export const GTA_ZG88_URL =
  "https://globaltradealert.org/reports/Subsidising-the-Chokepoint-Strategic-Convergence-and-Its-Limits";
export const GTA_ZG79_URL =
  "https://globaltradealert.org/reports/how-industrial-policy-changed-in-2025";
export const IMF_WP25_URL =
  "https://www.imf.org/en/Publications/WP/Issues/2025/10/17/Industrial-Policy-Since-the-Great-Financial-Crisis-571122";
export const PRIOR_Q3_PATH = "/blog/fiscal-industrial-policy-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/fiscal-industrial-policy-update-2026";
export const PRIOR_RESEARCH_PATH = "/blog/fiscal-industrial-policy-research-2026";

/** Headline delta stats for cards / prose */
export const HEADLINE = {
  annualDistortive2009: 1141,
  annualDistortive2025: 1977,
  annualDistortiveDelta: 836,
  annualDistortiveDeltaPct: 73,
  importBarrierPct2025: 27,
  domesticSubsidyPct2025: 26,
  financeInvestControlPct2025: 23,
  importBarrierCount2025: 547,
  importBarrierTariffSharePct: 55,
  usShareOfImportBarriersPct: 20,
  bigThreeSharePct: 63,
  nipoStockThrough2026: 32136,
  nipoDistortiveCount: 25968,
  nipoDistortiveSharePct: 81,
  priorQ3SelectivePlateau: 1900,
  priorQ3UsStrategicPct: 76,
  priorQ3EuStrategicPct: 70,
  priorQ3CnStrategicPct: 98,
  priorWestSecurityMotivePct: 63,
  may2026Total: 804,
  jun2026Total: 823,
  jul2026Total: 1008,
  julVsMayDelta: 204,
  julVsMayDeltaPct: 25,
  junUs: 163,
  junChina: 47,
  junEu: 100,
  junRest: 513,
  euSteelInQuotaCutPct: 47,
  euSteelOutQuotaPriorPct: 25,
  euSteelOutQuotaNewPct: 50,
  koreaMegaPlanUsdBn: 951,
  chipsJulLoiUsdM: 874,
  section301Economies: 60,
};

export type AnnualFlowRow = {
  year: number;
  distortiveActions: number;
  confidence: Confidence;
  note?: string;
};

/** Annual distortive IP — Teneo Fig.1 endpoints + estimated midpoints */
export const ANNUAL_DISTORTIVE: AnnualFlowRow[] = [
  { year: 2009, distortiveActions: 1141, confidence: "disclosed" },
  { year: 2015, distortiveActions: 1300, confidence: "estimated", note: "Path midpoint" },
  { year: 2019, distortiveActions: 1450, confidence: "estimated", note: "Pre-break band" },
  { year: 2020, distortiveActions: 1750, confidence: "estimated", note: "COVID jump (aligned with Market-Shaping)" },
  { year: 2022, distortiveActions: 1850, confidence: "estimated" },
  { year: 2024, distortiveActions: 1900, confidence: "estimated", note: "Near Q3 selective plateau" },
  { year: 2025, distortiveActions: 1977, confidence: "disclosed" },
];

export type ToolkitShareRow = {
  instrument: string;
  shortLabel: string;
  sharePct: number;
  count?: number;
  confidence: Confidence;
  note?: string;
};

/** 2025 distortive toolkit mix — Teneo Fig.2 */
export const TOOLKIT_2025: ToolkitShareRow[] = [
  {
    instrument: "Import barriers",
    shortLabel: "Import barriers",
    sharePct: 27,
    count: 547,
    confidence: "disclosed",
    note: "~55% of these are tariffs; US ≈20% of global import-barrier actions",
  },
  {
    instrument: "Domestic subsidies / incentives",
    shortLabel: "Domestic subsidies",
    sharePct: 26,
    confidence: "disclosed",
  },
  {
    instrument: "Financial / investment controls",
    shortLabel: "Finance & FDI controls",
    sharePct: 23,
    confidence: "disclosed",
  },
  {
    instrument: "Export barriers & other",
    shortLabel: "Export & other",
    sharePct: 24,
    confidence: "estimated",
    note: "Residual of disclosed top-three shares",
  },
];

export type MonthlyFlowRow = {
  month: string;
  total: number;
  us?: number;
  china?: number;
  eu?: number;
  rest?: number;
  confidence: Confidence;
};

/** GTA Monthly Roundup totals (all documented developments) */
export const MONTHLY_FLOW_2026: MonthlyFlowRow[] = [
  { month: "May 2026", total: 804, confidence: "disclosed" },
  {
    month: "Jun 2026",
    total: 823,
    us: 163,
    china: 47,
    eu: 100,
    rest: 513,
    confidence: "disclosed",
  },
  { month: "Jul 2026", total: 1008, confidence: "disclosed" },
];

export type BlocJuneRow = {
  bloc: string;
  shortLabel: string;
  interventions: number;
  sharePct: number;
  confidence: Confidence;
};

export const JUNE_BLOC_SPLIT: BlocJuneRow[] = [
  { bloc: "United States", shortLabel: "US", interventions: 163, sharePct: 20, confidence: "disclosed" },
  { bloc: "European Union + MS", shortLabel: "EU", interventions: 100, sharePct: 12, confidence: "disclosed" },
  { bloc: "China", shortLabel: "China", interventions: 47, sharePct: 6, confidence: "disclosed" },
  { bloc: "Rest of world", shortLabel: "Rest", interventions: 513, sharePct: 62, confidence: "disclosed" },
];

export type SteelRegimeRow = {
  metric: string;
  shortLabel: string;
  priorValue: number;
  newValue: number;
  unit: "pct" | "pp";
  confidence: Confidence;
};

/** EU steel reverse TRQ — June 2026 Roundup */
export const EU_STEEL_REGIME: SteelRegimeRow[] = [
  {
    metric: "In-quota volume vs 2024 safeguard",
    shortLabel: "In-quota cut",
    priorValue: 0,
    newValue: 47,
    unit: "pct",
    confidence: "disclosed",
  },
  {
    metric: "Out-of-quota duty",
    shortLabel: "Out-of-quota duty",
    priorValue: 25,
    newValue: 50,
    unit: "pct",
    confidence: "disclosed",
  },
];

export type OwnershipStakeRow = {
  label: string;
  shortLabel: string;
  usdMillions: number;
  geography: string;
  confidence: Confidence;
  note?: string;
};

/** Ownership / equity as industrial policy — Jun–Jul Roundups */
export const OWNERSHIP_STAKES: OwnershipStakeRow[] = [
  {
    label: "US CHIPS equity LOIs (Jul, 7 firms)",
    shortLabel: "US CHIPS Jul LOIs",
    usdMillions: 874,
    geography: "United States",
    confidence: "disclosed",
  },
  {
    label: "SandboxAQ CHIPS stake (Jun)",
    shortLabel: "SandboxAQ",
    usdMillions: 500,
    geography: "United States",
    confidence: "disclosed",
  },
  {
    label: "I-Pulse SiC semiconductors (Jun)",
    shortLabel: "I-Pulse",
    usdMillions: 250,
    geography: "United States",
    confidence: "disclosed",
  },
  {
    label: "Canada Growth Fund → Teck (Jul)",
    shortLabel: "CGF–Teck",
    usdMillions: 283,
    geography: "Canada",
    confidence: "disclosed",
  },
  {
    label: "CN subnational equity funds (Jul)",
    shortLabel: "CN subnational",
    usdMillions: 3300,
    geography: "China",
    confidence: "disclosed",
    note: "Five governments, Jul Roundup",
  },
];

export type DeltaBarRow = {
  id: string;
  label: string;
  priorLabel: string;
  newLabel: string;
  priorValue: number;
  newValue: number;
  unit: "pp" | "count" | "pct";
  delta: number;
  confidence: Confidence;
  group: "flow" | "toolkit" | "coercion" | "ownership";
};

export const KEY_DELTAS: DeltaBarRow[] = [
  {
    id: "annual-distortive",
    label: "Annual distortive IP actions",
    priorLabel: "2009",
    newLabel: "2025",
    priorValue: 1141,
    newValue: 1977,
    unit: "count",
    delta: 836,
    confidence: "disclosed",
    group: "flow",
  },
  {
    id: "jul-vs-may",
    label: "Monthly GTA developments",
    priorLabel: "May 2026",
    newLabel: "Jul 2026",
    priorValue: 804,
    newValue: 1008,
    unit: "count",
    delta: 204,
    confidence: "disclosed",
    group: "flow",
  },
  {
    id: "import-barrier-share",
    label: "Import-barrier share of toolkit",
    priorLabel: "Subsidy-era intuition",
    newLabel: "2025 print",
    priorValue: 15,
    newValue: 27,
    unit: "pct",
    delta: 12,
    confidence: "estimated",
    group: "toolkit",
  },
  {
    id: "subsidy-vs-barrier",
    label: "Domestic subsidy share (2025)",
    priorLabel: "CN/EU historical 85–97%",
    newLabel: "Global 2025 mix",
    priorValue: 90,
    newValue: 26,
    unit: "pct",
    delta: -64,
    confidence: "estimated",
    group: "toolkit",
  },
  {
    id: "finance-controls",
    label: "Finance/FDI control share",
    priorLabel: "Pre-2020 niche",
    newLabel: "2025 print",
    priorValue: 8,
    newValue: 23,
    unit: "pct",
    delta: 15,
    confidence: "estimated",
    group: "toolkit",
  },
  {
    id: "eu-steel-duty",
    label: "EU steel out-of-quota duty",
    priorLabel: "Prior safeguard",
    newLabel: "Reverse TRQ Jul'26",
    priorValue: 25,
    newValue: 50,
    unit: "pct",
    delta: 25,
    confidence: "disclosed",
    group: "coercion",
  },
  {
    id: "eu-steel-quota",
    label: "EU steel in-quota cut",
    priorLabel: "2024 quota base",
    newLabel: "Reverse TRQ",
    priorValue: 0,
    newValue: 47,
    unit: "pct",
    delta: 47,
    confidence: "disclosed",
    group: "coercion",
  },
  {
    id: "section-301-scope",
    label: "Section 301 forced-labour economies",
    priorLabel: "Country-case model",
    newLabel: "Jul 2026 duty regime",
    priorValue: 1,
    newValue: 60,
    unit: "count",
    delta: 59,
    confidence: "disclosed",
    group: "coercion",
  },
  {
    id: "chips-ownership",
    label: "US CHIPS equity LOIs (Jul)",
    priorLabel: "Grant-only intuition",
    newLabel: "Ownership stakes",
    priorValue: 0,
    newValue: 874,
    unit: "count",
    delta: 874,
    confidence: "disclosed",
    group: "ownership",
  },
];

export type PriorVsNewSnapshot = {
  metric: string;
  priorVintage: string;
  priorValue: string;
  newVintage: string;
  newValue: string;
  deltaLabel: string;
  confidence: Confidence;
};

export const VINTAGE_SNAPSHOT: PriorVsNewSnapshot[] = [
  {
    metric: "Annual distortive industrial actions",
    priorVintage: "2009",
    priorValue: "1,141",
    newVintage: "2025 full year",
    newValue: "1,977",
    deltaLabel: "+836 (+73%)",
    confidence: "disclosed",
  },
  {
    metric: "Import barriers in distortive toolkit",
    priorVintage: "Q3 print (subsidy-centric narrative)",
    priorValue: "Secondary to subsidies",
    newVintage: "2025 mix",
    newValue: "~27% (547 actions)",
    deltaLabel: "Co-equal with subsidies",
    confidence: "disclosed",
  },
  {
    metric: "Domestic subsidies in distortive toolkit",
    priorVintage: "CN/EU stock (85–97% of actions)",
    priorValue: "Dominant",
    newVintage: "2025 global mix",
    newValue: "~26%",
    deltaLabel: "No longer alone at the top",
    confidence: "disclosed",
  },
  {
    metric: "Finance / investment controls",
    priorVintage: "Pre-2020 niche",
    priorValue: "Low teens or less",
    newVintage: "2025 mix",
    newValue: "~23%",
    deltaLabel: "Third co-equal pillar",
    confidence: "disclosed",
  },
  {
    metric: "GTA monthly documented developments",
    priorVintage: "May 2026",
    priorValue: "804",
    newVintage: "Jul 2026",
    newValue: "1,008",
    deltaLabel: "+204 (+25%)",
    confidence: "disclosed",
  },
  {
    metric: "EU steel out-of-quota duty",
    priorVintage: "Safeguard regime",
    priorValue: "25%",
    newVintage: "Reverse TRQ (Jul 2026)",
    newValue: "50%",
    deltaLabel: "+25 pp; in-quota −47%",
    confidence: "disclosed",
  },
  {
    metric: "Section 301 forced-labour coverage",
    priorVintage: "Country-specific cases",
    priorValue: "Bilateral probes",
    newVintage: "Jul 2026",
    newValue: "60 economies @ 10–12.5%",
    deltaLabel: "Duty-regime scale-up",
    confidence: "disclosed",
  },
  {
    metric: "Prior Q3 — US strategic subsidy share (context)",
    priorVintage: "ZG #88 2025–26",
    priorValue: "76%",
    newVintage: "Still elevated",
    newValue: "Targeting stands",
    deltaLabel: "Toolkit shifted around it",
    confidence: "disclosed",
  },
];

export type ScatterPoint = {
  label: string;
  barrierPct: number;
  subsidyPct: number;
  window: string;
  confidence: Confidence;
};

/** Conceptual anchors: global 2025 mix vs Q3 CN/EU subsidy dominance */
export const MIX_ANCHORS: ScatterPoint[] = [
  {
    label: "Global 2025 mix",
    barrierPct: 27,
    subsidyPct: 26,
    window: "2025 full year",
    confidence: "disclosed",
  },
  {
    label: "CN/EU stock intuition (Q3)",
    barrierPct: 8,
    subsidyPct: 91,
    window: "Q3 narrative context",
    confidence: "estimated",
  },
  {
    label: "US tariff-heavy 2025",
    barrierPct: 40,
    subsidyPct: 18,
    window: "US path (narrative)",
    confidence: "estimated",
  },
];

export const SOURCES = [
  { label: "Teneo — New Age of Industrial Policy (Mar 2026, NIPO)", url: TENEO_URL },
  { label: "GTA Monthly Roundup — May 2026", url: GTA_MAY_URL },
  { label: "GTA Monthly Roundup — June 2026", url: GTA_JUN_URL },
  { label: "GTA Monthly Roundup — July 2026", url: GTA_JUL_URL },
  { label: "GTA ZG #88 — Subsidising the Chokepoint (prior)", url: GTA_ZG88_URL },
  { label: "GTA ZG #79 — Security First (context)", url: GTA_ZG79_URL },
  { label: "IMF WP/25/222 — H-NIPO through 2023", url: IMF_WP25_URL },
];

export function fmtPct(n: number, d = 0): string {
  return `${n.toFixed(d)}%`;
}

export function fmtPp(n: number, d = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(d)} pp`;
}

export function fmtInt(n: number): string {
  return n.toLocaleString("en-US");
}

export function deltasFor(
  group: DeltaBarRow["group"] | "All"
): DeltaBarRow[] {
  if (group === "All") return KEY_DELTAS;
  return KEY_DELTAS.filter((r) => r.group === group);
}

export function monthlyFor(
  scope: "All" | "BigThree" | "Rest"
): MonthlyFlowRow[] {
  if (scope === "All") return MONTHLY_FLOW_2026;
  if (scope === "Rest") {
    return MONTHLY_FLOW_2026.map((m) => ({
      ...m,
      total: m.rest ?? Math.round(m.total * 0.62),
    }));
  }
  return MONTHLY_FLOW_2026.map((m) => ({
    ...m,
    total:
      m.us != null && m.china != null && m.eu != null
        ? m.us + m.china + m.eu
        : Math.round(m.total * 0.38),
  }));
}
