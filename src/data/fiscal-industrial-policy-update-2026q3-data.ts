/**
 * Fiscal & industrial policy — Q3 2026 vintage update.
 * Core question: What changed vs the Aug 2026 update print
 * (GTA ZG #67/#70/#79 motive + green-instrument deltas) once
 * ZG #88 chokepoint targeting and the Big Three 2009–2024 panel landed?
 *
 * Primary sources:
 * - GTA ZG #88 "Subsidising the Chokepoint" (Apr 2026)
 * - GTA "Industrial Policy as Market-Shaping Competition" (CN/EU/US 2009–2024)
 * - Prior update vintage: GTA ZG #67/#70/#79 (early/mid-2025 NIPO briefings)
 * - IMF WP/25/222 (H-NIPO through 2023) for stock context
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Vintage delta: Aug 2026 update print (ZG #67/#70/#79 motive + green-instrument shares) vs GTA ZG #88 (Apr 2026) strategic-subsidy targeting through 2025–26 and the Big Three NIPO panel through Dec 2024. Shares are percent of recorded industrial-policy actions in the stated instrument/geography/window — not dollar outlays. Midpoint estimates used where source text gives ranges (e.g. subsidy-follow rates 60–80%).";

export const GTA_ZG88_URL =
  "https://globaltradealert.org/reports/Subsidising-the-Chokepoint-Strategic-Convergence-and-Its-Limits";
export const GTA_MARKET_URL =
  "https://globaltradealert.org/reports/Industrial-Policy-as-Market-Shaping-Competition";
export const GTA_ZG79_URL =
  "https://globaltradealert.org/reports/how-industrial-policy-changed-in-2025";
export const IMF_WP25_URL =
  "https://www.imf.org/en/Publications/WP/Issues/2025/10/17/Industrial-Policy-Since-the-Great-Financial-Crisis-571122";
export const PRIOR_UPDATE_PATH = "/blog/fiscal-industrial-policy-update-2026";
export const PRIOR_RESEARCH_PATH = "/blog/fiscal-industrial-policy-research-2026";

/** Headline delta stats for cards / prose */
export const HEADLINE = {
  usStrategicPriorPct: 33,
  usStrategicNewPct: 76,
  usStrategicDeltaPp: 43,
  chinaStrategicPriorPct: 85,
  chinaStrategicNewPct: 98,
  chinaStrategicDeltaPp: 13,
  euStrategicPriorPct: 50,
  euStrategicNewPct: 70,
  euStrategicDeltaPp: 20,
  euStrategicPeak2324Pct: 75,
  annualSelectivePre2019: 1100,
  annualSelective202021: 1800,
  annualSelective202224: 1900,
  annualSelectiveDeltaVsPre: 800,
  greenEuUsPre2020Pct: 20,
  greenEuUsNewPct: 50,
  greenEuUsDeltaPp: 30,
  greenChinaEarlyPct: 40,
  subsidyFollowEarlyLowPct: 33,
  subsidyFollowEarlyHighPct: 66,
  subsidyFollowNewLowPct: 60,
  subsidyFollowNewHighPct: 80,
  subsidyFollowMidNewPct: 70,
  exportPersistEarlyPct: 50,
  exportPersistNewLowPct: 80,
  exportPersistNewHighPct: 90,
  exportPersistMidNewPct: 85,
  cnEuSubsidyShareLowPct: 85,
  cnEuSubsidyShareHighPct: 97,
  priorWestSecurityMotivePct: 63,
  priorGreenImportBarrierPct: 48,
  priorGreenSubsidyPct: 32,
};

export type StrategicVintageRow = {
  bloc: "China" | "European Union" | "United States";
  shortLabel: string;
  priorPct: number;
  newPct: number;
  priorWindow: string;
  newWindow: string;
  confidence: Confidence;
  note?: string;
};

/** Share of subsidy-based IP actions covering dual-use / advanced tech — ZG #88 Fig.1 */
export const STRATEGIC_SUBSIDY_SHARE: StrategicVintageRow[] = [
  {
    bloc: "China",
    shortLabel: "China",
    priorPct: 85,
    newPct: 98,
    priorWindow: "2009–16",
    newWindow: "2025–26",
    confidence: "disclosed",
    note: "Never fell below 90% after early window",
  },
  {
    bloc: "European Union",
    shortLabel: "EU",
    priorPct: 50,
    newPct: 70,
    priorWindow: "2009–16",
    newWindow: "2025–26",
    confidence: "disclosed",
    note: "Peaked ~75% in 2023–24 before settling at 70%",
  },
  {
    bloc: "United States",
    shortLabel: "US",
    priorPct: 33,
    newPct: 76,
    priorWindow: "2009–16",
    newWindow: "2025–26",
    confidence: "disclosed",
    note: "Sharpest catch-up; ~76% already by 2020–22",
  },
];

export type StrategicPathRow = {
  window: string;
  china: number;
  eu: number;
  us: number;
  confidence: Confidence;
};

/** Path points reconstructed from ZG #88 + Market-Shaping Fact 5 narrative */
export const STRATEGIC_PATH: StrategicPathRow[] = [
  { window: "2009–16", china: 85, eu: 50, us: 33, confidence: "disclosed" },
  { window: "2017–19", china: 92, eu: 48, us: 57, confidence: "estimated" },
  { window: "2020–22", china: 95, eu: 50, us: 76, confidence: "estimated" },
  { window: "2023–24", china: 96, eu: 75, us: 76, confidence: "estimated" },
  { window: "2025–26", china: 98, eu: 70, us: 76, confidence: "disclosed" },
];

export type ActivityRegimeRow = {
  period: string;
  annualActions: number;
  label: string;
  confidence: Confidence;
};

/** Selective industrial actions — Market-Shaping Fact 1 (Big Three panel context) */
export const SELECTIVE_ACTIVITY: ActivityRegimeRow[] = [
  {
    period: "2009–19",
    annualActions: 1100,
    label: "Pre-break mean",
    confidence: "disclosed",
  },
  {
    period: "2020–21",
    annualActions: 1800,
    label: "Post-shock jump",
    confidence: "disclosed",
  },
  {
    period: "2022–24",
    annualActions: 1900,
    label: "High plateau",
    confidence: "disclosed",
  },
];

export type GreenSubsidyShareRow = {
  bloc: "China" | "European Union" | "United States";
  shortLabel: string;
  earlyPct: number;
  latePct: number;
  earlyWindow: string;
  lateWindow: string;
  confidence: Confidence;
  note?: string;
};

/** Low-carbon share of subsidy IP — Market-Shaping Fact 6 */
export const GREEN_SUBSIDY_SHARE: GreenSubsidyShareRow[] = [
  {
    bloc: "China",
    shortLabel: "China",
    earlyPct: 40,
    latePct: 45,
    earlyWindow: "2009–16",
    lateWindow: "2023–24",
    confidence: "estimated",
    note: "Early ~40%; stayed high through 2020s",
  },
  {
    bloc: "European Union",
    shortLabel: "EU",
    earlyPct: 20,
    latePct: 52,
    earlyWindow: "2009–19",
    lateWindow: "2023–24",
    confidence: "estimated",
  },
  {
    bloc: "United States",
    shortLabel: "US",
    earlyPct: 18,
    latePct: 52,
    earlyWindow: "2009–19",
    lateWindow: "2023–24",
    confidence: "estimated",
  },
];

export type FollowRateRow = {
  period: string;
  lowPct: number;
  highPct: number;
  midPct: number;
  confidence: Confidence;
};

/** HS6 same-product subsidy follow within 12 months — Market-Shaping Fact 7 */
export const SUBSIDY_FOLLOW_RATES: FollowRateRow[] = [
  {
    period: "2009–16",
    lowPct: 33,
    highPct: 66,
    midPct: 50,
    confidence: "disclosed",
  },
  {
    period: "2017–19",
    lowPct: 45,
    highPct: 70,
    midPct: 58,
    confidence: "estimated",
  },
  {
    period: "2020–22",
    lowPct: 60,
    highPct: 80,
    midPct: 70,
    confidence: "disclosed",
  },
  {
    period: "2023–24",
    lowPct: 60,
    highPct: 80,
    midPct: 70,
    confidence: "disclosed",
  },
];

export type PersistenceRow = {
  instrument: string;
  shortLabel: string;
  earlyPct: number;
  latePct: number;
  earlyWindow: string;
  lateWindow: string;
  confidence: Confidence;
  note?: string;
};

/** 12-month retention — Market-Shaping Fact 10 */
export const INSTRUMENT_PERSISTENCE: PersistenceRow[] = [
  {
    instrument: "Export restrictions",
    shortLabel: "Export controls",
    earlyPct: 50,
    latePct: 85,
    earlyWindow: "2009–19",
    lateWindow: "2023–24",
    confidence: "estimated",
    note: "Late cohort 80–90%+ in CN/US; near-full in EU",
  },
  {
    instrument: "Import barriers",
    shortLabel: "Import barriers",
    earlyPct: 75,
    latePct: 67,
    earlyWindow: "pre-2020 (EU)",
    lateWindow: "post-2020 (EU)",
    confidence: "estimated",
  },
  {
    instrument: "Subsidies / state aid",
    shortLabel: "Subsidies",
    earlyPct: 98,
    latePct: 99,
    earlyWindow: "all cohorts",
    lateWindow: "all cohorts",
    confidence: "disclosed",
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
  group: "strategic" | "activity" | "green" | "interaction";
};

export const KEY_DELTAS: DeltaBarRow[] = [
  {
    id: "us-strategic",
    label: "US strategic subsidy share",
    priorLabel: "2009–16",
    newLabel: "2025–26",
    priorValue: 33,
    newValue: 76,
    unit: "pct",
    delta: 43,
    confidence: "disclosed",
    group: "strategic",
  },
  {
    id: "eu-strategic",
    label: "EU strategic subsidy share",
    priorLabel: "2009–16",
    newLabel: "2025–26",
    priorValue: 50,
    newValue: 70,
    unit: "pct",
    delta: 20,
    confidence: "disclosed",
    group: "strategic",
  },
  {
    id: "cn-strategic",
    label: "China strategic subsidy share",
    priorLabel: "2009–16",
    newLabel: "2025–26",
    priorValue: 85,
    newValue: 98,
    unit: "pct",
    delta: 13,
    confidence: "disclosed",
    group: "strategic",
  },
  {
    id: "selective-level",
    label: "Annual selective IP actions",
    priorLabel: "2009–19 mean",
    newLabel: "2022–24",
    priorValue: 1100,
    newValue: 1900,
    unit: "count",
    delta: 800,
    confidence: "disclosed",
    group: "activity",
  },
  {
    id: "green-west",
    label: "EU/US green subsidy share (band)",
    priorLabel: "2009–19",
    newLabel: "2023–24",
    priorValue: 20,
    newValue: 50,
    unit: "pct",
    delta: 30,
    confidence: "estimated",
    group: "green",
  },
  {
    id: "follow-rate",
    label: "Same-HS6 subsidy follow (12m mid)",
    priorLabel: "2009–16 mid",
    newLabel: "2020–24 mid",
    priorValue: 50,
    newValue: 70,
    unit: "pct",
    delta: 20,
    confidence: "estimated",
    group: "interaction",
  },
  {
    id: "export-persist",
    label: "Export-control 12m retention",
    priorLabel: "2009–19",
    newLabel: "2023–24",
    priorValue: 50,
    newValue: 85,
    unit: "pct",
    delta: 35,
    confidence: "estimated",
    group: "interaction",
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

/** Comparison table for prose / dashboard */
export const VINTAGE_SNAPSHOT: PriorVsNewSnapshot[] = [
  {
    metric: "US strategic / dual-use subsidy share",
    priorVintage: "2009–16",
    priorValue: "33%",
    newVintage: "2025–26",
    newValue: "76%",
    deltaLabel: "+43 pp",
    confidence: "disclosed",
  },
  {
    metric: "EU strategic / dual-use subsidy share",
    priorVintage: "2009–16",
    priorValue: "50%",
    newVintage: "2025–26",
    newValue: "70%",
    deltaLabel: "+20 pp",
    confidence: "disclosed",
  },
  {
    metric: "China strategic / dual-use subsidy share",
    priorVintage: "2009–16",
    priorValue: "85%",
    newVintage: "2025–26",
    newValue: "98%",
    deltaLabel: "+13 pp",
    confidence: "disclosed",
  },
  {
    metric: "Annual selective industrial actions",
    priorVintage: "2009–19 mean",
    priorValue: "~1,100",
    newVintage: "2022–24",
    newValue: "~1,900",
    deltaLabel: "+~800 / yr",
    confidence: "disclosed",
  },
  {
    metric: "EU/US green share of subsidy IP",
    priorVintage: "2009–19",
    priorValue: "≤20%",
    newVintage: "2023–24",
    newValue: ">50%",
    deltaLabel: "+30 pp band",
    confidence: "estimated",
  },
  {
    metric: "Same-product subsidy follow (12 months)",
    priorVintage: "2009–16",
    priorValue: "33–66%",
    newVintage: "2020–24",
    newValue: "60–80%",
    deltaLabel: "Race intensifies",
    confidence: "disclosed",
  },
  {
    metric: "Export-restriction 12-month retention",
    priorVintage: "2009–19",
    priorValue: "~50%",
    newVintage: "2023–24",
    newValue: "80–90%+",
    deltaLabel: "Structural lock-in",
    confidence: "estimated",
  },
  {
    metric: "Prior print — West security motives (context)",
    priorVintage: "Aug 2026 update",
    priorValue: "63%",
    newVintage: "ZG #70/#79",
    newValue: "Still elevated",
    deltaLabel: "Motive shift stands",
    confidence: "disclosed",
  },
];

export type ScatterPoint = {
  bloc: string;
  strategicPct: number;
  greenPct: number;
  window: string;
  confidence: Confidence;
};

/** Late-vintage strategic vs green targeting (scatter anchors) */
export const STRATEGIC_VS_GREEN: ScatterPoint[] = [
  {
    bloc: "China",
    strategicPct: 98,
    greenPct: 45,
    window: "2025–26 / 2023–24",
    confidence: "estimated",
  },
  {
    bloc: "EU",
    strategicPct: 70,
    greenPct: 52,
    window: "2025–26 / 2023–24",
    confidence: "estimated",
  },
  {
    bloc: "US",
    strategicPct: 76,
    greenPct: 52,
    window: "2025–26 / 2023–24",
    confidence: "estimated",
  },
];

export const SOURCES = [
  { label: "GTA ZG #88 — Subsidising the Chokepoint", url: GTA_ZG88_URL },
  {
    label: "GTA — Industrial Policy as Market-Shaping Competition",
    url: GTA_MARKET_URL,
  },
  { label: "GTA ZG #79 — Security First (2025)", url: GTA_ZG79_URL },
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

export function strategicFor(
  bloc: StrategicVintageRow["bloc"] | "All"
): StrategicVintageRow[] {
  if (bloc === "All") return STRATEGIC_SUBSIDY_SHARE;
  return STRATEGIC_SUBSIDY_SHARE.filter((r) => r.bloc === bloc);
}

export function deltasFor(
  group: DeltaBarRow["group"] | "All"
): DeltaBarRow[] {
  if (group === "All") return KEY_DELTAS;
  return KEY_DELTAS.filter((r) => r.group === group);
}
