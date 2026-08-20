/**
 * Fiscal & industrial policy — vintage update (Aug 2026).
 * Core question: What changed vs the Jul 2026 research print
 * (H-NIPO 2009–2023 / NIPO 2023) once GTA’s 2025 NIPO briefings landed?
 *
 * Primary sources:
 * - GTA ZG #79 "Security First: How Industrial Policy Changed in 2025" (Dec 2025)
 * - GTA ZG #70 "Evolution of Western Industrial Policy" (Jul 2025)
 * - GTA ZG #67 "Losing the Green Edge" (Jun 2025)
 * - Prior research vintage: IMF WP/24/1 + WP/25/222 (NIPO / H-NIPO through 2023)
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Vintage delta: Jul 2026 research print (H-NIPO 2009–2023 endpoints + 2023 NIPO census) vs GTA NIPO early/mid-2025 briefings (ZG #67, #70, #79). Motive and instrument shares are percent of recorded industrial-policy interventions in the stated geography and window — not dollar outlays. H1 activity counts are calendar Jan–Jun windows; full-year 2025 remains subject to reporting lags.";

export const GTA_ZG79_URL =
  "https://globaltradealert.org/reports/how-industrial-policy-changed-in-2025";
export const GTA_ZG70_URL =
  "https://globaltradealert.org/reports/The-Evolution-of-Western-Industrial-Policy";
export const GTA_ZG67_URL =
  "https://globaltradealert.org/reports/Losing-The-Green-Edge-Industrial-Policy-Shifts";
export const IMF_WP25_URL =
  "https://www.imf.org/en/Publications/WP/Issues/2025/10/17/Industrial-Policy-Since-the-Great-Financial-Crisis-571122";
export const PRIOR_POST_PATH = "/blog/fiscal-industrial-policy-research-2026";

/** Headline delta stats for cards / prose */
export const HEADLINE = {
  westSecurityMotivePriorPct: 26,
  westSecurityMotiveNewPct: 63,
  westSecurityMotiveDeltaPp: 37,
  westClimateMotivePriorPct: 29,
  westClimateMotiveNewPct: 12,
  westClimateMotiveDeltaPp: -17,
  greenSubsidySharePriorPct: 68,
  greenSubsidyShareNewPct: 32,
  greenImportBarrierPriorPct: 4,
  greenImportBarrierNewPct: 48,
  greenImportBarrierDeltaPp: 44,
  h1GreenMeasures2024: 62,
  h1GreenMeasures2025: 34,
  h1GreenMeasuresDeltaPct: -45,
  h1TotalMeasures2024: 802,
  h1TotalMeasures2025: 763,
  h1TotalMeasuresDeltaPct: -5,
  westGeoSecurityH1_2025Pct: 54,
  westGeoSecurity2023_24Pct: 22,
  westClimateH1_2025Pct: 15,
  westCompetitivenessH1_2025Pct: 20,
  euSecurityMotivePriorPct: 17,
  euSecurityMotiveNewPct: 34,
  euClimateMotivePriorPct: 42,
  euClimateMotiveNewPct: 25,
  euGreenSubsidy2025Pct: 64,
  euGreenSubsidyPriorPct: 80,
  usSecurityShare2024_25Pct: 50,
  nonWestGreenMotivePriorPct: 13,
  nonWestGreenMotiveNewPct: 20,
  priorNipo2023Total: 2580,
  priorSubsidyJurisdiction2009Pct: 36,
  priorSubsidyJurisdiction2023Pct: 59,
};

export type MotiveVintageRow = {
  motive: string;
  shortLabel: string;
  priorPct: number;
  newPct: number;
  geography: "G7+KR+AU" | "EU" | "Western (H1)" | "Non-Western";
  confidence: Confidence;
  note?: string;
};

/** Stated-motive shares: prior vintage window vs 2025 print */
export const MOTIVE_VINTAGE: MotiveVintageRow[] = [
  {
    motive: "National security / geopolitics",
    shortLabel: "Security",
    priorPct: 26,
    newPct: 63,
    geography: "G7+KR+AU",
    confidence: "disclosed",
    note: "ZG #70 Fig.1: 2023–24 → 2025",
  },
  {
    motive: "Climate mitigation",
    shortLabel: "Climate",
    priorPct: 29,
    newPct: 12,
    geography: "G7+KR+AU",
    confidence: "disclosed",
    note: "ZG #70 Fig.1",
  },
  {
    motive: "National security / geopolitics",
    shortLabel: "Security",
    priorPct: 17,
    newPct: 34,
    geography: "EU",
    confidence: "disclosed",
    note: "ZG #70 EU divergence",
  },
  {
    motive: "Climate mitigation",
    shortLabel: "Climate",
    priorPct: 42,
    newPct: 25,
    geography: "EU",
    confidence: "disclosed",
    note: "ZG #70 EU still climate-heavy vs peers",
  },
  {
    motive: "National security / geopolitics",
    shortLabel: "Security",
    priorPct: 22,
    newPct: 54,
    geography: "Western (H1)",
    confidence: "disclosed",
    note: "ZG #67 Fig.2: 2023–24 → Jan–Jun 2025",
  },
  {
    motive: "Climate mitigation",
    shortLabel: "Climate",
    priorPct: 29,
    newPct: 15,
    geography: "Western (H1)",
    confidence: "estimated",
    note: "ZG #67: climate 15% in H1’25; prior ≈ G7 climate share",
  },
  {
    motive: "Competitiveness",
    shortLabel: "Compete",
    priorPct: 25,
    newPct: 20,
    geography: "Western (H1)",
    confidence: "estimated",
    note: "ZG #67: competitiveness 20% in H1’25; prior mid-20s band",
  },
  {
    motive: "Climate / green",
    shortLabel: "Climate",
    priorPct: 13,
    newPct: 20,
    geography: "Non-Western",
    confidence: "disclosed",
    note: "ZG #67: non-West green motives rose while West fell",
  },
];

export type GreenInstrumentRow = {
  instrument: string;
  shortLabel: string;
  priorPct: number;
  newPct: number;
  confidence: Confidence;
  note?: string;
};

/** Green industrial-measure instrument mix (West) — ZG #70 */
export const GREEN_INSTRUMENT_MIX: GreenInstrumentRow[] = [
  {
    instrument: "Subsidies / state aid",
    shortLabel: "Subsidies",
    priorPct: 68,
    newPct: 32,
    confidence: "disclosed",
    note: "Share of Western green IP measures",
  },
  {
    instrument: "Import barriers",
    shortLabel: "Import barriers",
    priorPct: 4,
    newPct: 48,
    confidence: "disclosed",
    note: "Prior disclosed as ‘under 4%’",
  },
  {
    instrument: "Other / residual",
    shortLabel: "Other",
    priorPct: 28,
    newPct: 20,
    confidence: "estimated",
    note: "Residual so instrument shares sum ≈100; not a separate GTA line",
  },
];

export type EuGreenSubsidyRow = {
  vintage: "2023–24" | "2025";
  euSubsidyPct: number;
  westGreenSubsidyPct: number;
  confidence: Confidence;
};

export const EU_VS_WEST_GREEN_SUBSIDY: EuGreenSubsidyRow[] = [
  { vintage: "2023–24", euSubsidyPct: 80, westGreenSubsidyPct: 68, confidence: "disclosed" },
  { vintage: "2025", euSubsidyPct: 64, westGreenSubsidyPct: 32, confidence: "disclosed" },
];

export type H1ActivityRow = {
  year: 2024 | 2025;
  totalMeasures: number;
  greenMeasures: number;
  greenSharePct: number;
  confidence: Confidence;
};

/** Jan–Jun NIPO activity windows — ZG #67 */
export const H1_ACTIVITY: H1ActivityRow[] = [
  {
    year: 2024,
    totalMeasures: 802,
    greenMeasures: 62,
    greenSharePct: 7.7,
    confidence: "disclosed",
  },
  {
    year: 2025,
    totalMeasures: 763,
    greenMeasures: 34,
    greenSharePct: 4.5,
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
  group: "motive" | "instrument" | "activity";
};

export const KEY_DELTAS: DeltaBarRow[] = [
  {
    id: "west-security",
    label: "G7+KR+AU security motive share",
    priorLabel: "2023–24",
    newLabel: "2025",
    priorValue: 26,
    newValue: 63,
    unit: "pct",
    delta: 37,
    confidence: "disclosed",
    group: "motive",
  },
  {
    id: "west-climate",
    label: "G7+KR+AU climate motive share",
    priorLabel: "2023–24",
    newLabel: "2025",
    priorValue: 29,
    newValue: 12,
    unit: "pct",
    delta: -17,
    confidence: "disclosed",
    group: "motive",
  },
  {
    id: "green-subsidy",
    label: "West green measures — subsidy share",
    priorLabel: "2023–24",
    newLabel: "2025",
    priorValue: 68,
    newValue: 32,
    unit: "pct",
    delta: -36,
    confidence: "disclosed",
    group: "instrument",
  },
  {
    id: "green-import",
    label: "West green measures — import barriers",
    priorLabel: "2023–24",
    newLabel: "2025",
    priorValue: 4,
    newValue: 48,
    unit: "pct",
    delta: 44,
    confidence: "disclosed",
    group: "instrument",
  },
  {
    id: "h1-green",
    label: "H1 green-focused measures (count)",
    priorLabel: "H1’24",
    newLabel: "H1’25",
    priorValue: 62,
    newValue: 34,
    unit: "count",
    delta: -28,
    confidence: "disclosed",
    group: "activity",
  },
  {
    id: "h1-total",
    label: "H1 total IP measures (count)",
    priorLabel: "H1’24",
    newLabel: "H1’25",
    priorValue: 802,
    newValue: 763,
    unit: "count",
    delta: -39,
    confidence: "disclosed",
    group: "activity",
  },
  {
    id: "eu-security",
    label: "EU security motive share",
    priorLabel: "2023–24",
    newLabel: "2025",
    priorValue: 17,
    newValue: 34,
    unit: "pct",
    delta: 17,
    confidence: "disclosed",
    group: "motive",
  },
  {
    id: "nonwest-green",
    label: "Non-West green motive share",
    priorLabel: "2023–24",
    newLabel: "2025",
    priorValue: 13,
    newValue: 20,
    unit: "pct",
    delta: 7,
    confidence: "disclosed",
    group: "motive",
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
    metric: "G7+KR+AU security / geopolitics motive",
    priorVintage: "2023–24",
    priorValue: "26%",
    newVintage: "2025",
    newValue: "63%",
    deltaLabel: "+37 pp",
    confidence: "disclosed",
  },
  {
    metric: "G7+KR+AU climate motive",
    priorVintage: "2023–24",
    priorValue: "29%",
    newVintage: "2025",
    newValue: "12%",
    deltaLabel: "−17 pp",
    confidence: "disclosed",
  },
  {
    metric: "West green IP — subsidy share",
    priorVintage: "2023–24",
    priorValue: "68%",
    newVintage: "2025",
    newValue: "32%",
    deltaLabel: "−36 pp",
    confidence: "disclosed",
  },
  {
    metric: "West green IP — import barriers",
    priorVintage: "2023–24",
    priorValue: "<4%",
    newVintage: "2025",
    newValue: "48%",
    deltaLabel: "+44 pp",
    confidence: "disclosed",
  },
  {
    metric: "H1 green-focused measures",
    priorVintage: "H1 2024",
    priorValue: "62",
    newVintage: "H1 2025",
    newValue: "34",
    deltaLabel: "−45%",
    confidence: "disclosed",
  },
  {
    metric: "H1 total IP measures",
    priorVintage: "H1 2024",
    priorValue: "802",
    newVintage: "H1 2025",
    newValue: "763",
    deltaLabel: "−5%",
    confidence: "disclosed",
  },
  {
    metric: "EU green IP still subsidy-based",
    priorVintage: "2023–24",
    priorValue: "80%",
    newVintage: "2025",
    newValue: "64%",
    deltaLabel: "−16 pp (still >> West avg)",
    confidence: "disclosed",
  },
  {
    metric: "US measures citing security / geopolitics",
    priorVintage: "Research print (directional)",
    priorValue: "Rising post-2022",
    newVintage: "2024–25",
    newValue: ">50%",
    deltaLabel: "Majority security-framed",
    confidence: "disclosed",
  },
];

export type ActivityScatterPoint = {
  year: number;
  totalMeasures: number;
  greenMeasures: number;
  label: string;
  confidence: Confidence;
};

/** Dual-vintage scatter anchors (H1 windows) */
export const ACTIVITY_SCATTER: ActivityScatterPoint[] = [
  {
    year: 2024,
    totalMeasures: 802,
    greenMeasures: 62,
    label: "H1’24",
    confidence: "disclosed",
  },
  {
    year: 2025,
    totalMeasures: 763,
    greenMeasures: 34,
    label: "H1’25",
    confidence: "disclosed",
  },
];

export const SOURCES = [
  { label: "GTA ZG #79 — Security First (2025)", url: GTA_ZG79_URL },
  { label: "GTA ZG #70 — Western IP evolution", url: GTA_ZG70_URL },
  { label: "GTA ZG #67 — Losing the Green Edge", url: GTA_ZG67_URL },
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

export function motiveRowsFor(
  geography: MotiveVintageRow["geography"] | "All"
): MotiveVintageRow[] {
  if (geography === "All") return MOTIVE_VINTAGE;
  return MOTIVE_VINTAGE.filter((r) => r.geography === geography);
}

export function deltasFor(
  group: DeltaBarRow["group"] | "All"
): DeltaBarRow[] {
  if (group === "All") return KEY_DELTAS;
  return KEY_DELTAS.filter((r) => r.group === group);
}
