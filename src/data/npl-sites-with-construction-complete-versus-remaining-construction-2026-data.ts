/**
 * NPL construction-complete vs remaining construction — FY2019–FY2025 desk synthesis.
 * Core question: What share of current final NPL sites have construction complete,
 * and how many still have unfinished remedial construction?
 *
 * Anchors: EPA Superfund Remedial Annual Accomplishments (FY2019–FY2025);
 * EPA NPL site totals / construction-completion definitions; GAO-25-108408.
 *
 * "On-final CC" = cumulative NPL construction completions minus deleted NPL sites.
 * That residual approximates final sites that have reached the sitewide construction
 * milestone and remain listed. Labelled estimated because EPA does not publish a
 * single table of final-only CC vs not-yet-CC each fiscal year.
 */

export type Confidence = "disclosed" | "estimated" | "derived";

export const SOURCE_NOTE =
  "Final/proposed/deleted NPL counts and annual sitewide construction completions follow EPA Superfund Remedial Annual Accomplishments (FY2019–FY2025). Cumulative NPL construction completions: 1,246 at end FY2024 (EPA); +1 sitewide completion in FY2025 → 1,247. On-final construction-complete counts are desk-derived as cumulative NPL CC minus deleted sites (EPA construction-completion policy includes deleted NPL sites). RAPC = remedial action / remedial construction project completions. GAO-25-108408 supplies program-context for why remaining construction sites can stall.";

export const SOURCES = [
  {
    label: "EPA — Superfund Remedial Annual Accomplishments Metrics FY2025",
    url: "https://www.epa.gov/superfund/superfund-remedial-annual-accomplishments-metrics-fiscal-year-2025",
  },
  {
    label: "EPA — Superfund Remedial Annual Accomplishments Metrics (FY2024 page)",
    url: "https://www.epa.gov/superfund/superfund-remedial-annual-accomplishments-metrics",
  },
  {
    label: "EPA — Previous Superfund Remedial Annual Accomplishments",
    url: "https://www.epa.gov/superfund/previous-superfund-remedial-annual-accomplishments",
  },
  {
    label: "EPA — Construction completion definition & RAPC",
    url: "https://www.epa.gov/superfund/superfund-remedial-action-project-completion-and-construction-completions",
  },
  {
    label: "EPA — Construction Completions at NPL Sites (by state)",
    url: "https://www.epa.gov/superfund/construction-completions-npl-sites-state",
  },
  {
    label: "GAO-25-108408 — Superfund cleanup factors",
    url: "https://www.gao.gov/products/gao-25-108408",
  },
] as const;

/** Headline beats for cards / excerpt */
export const HEADLINE = {
  finalNplFy2025: 1343,
  deletedNplFy2025: 459,
  proposedNplFy2025: 38,
  cumulativeCcNplFy2025: 1247,
  onFinalCcEst: 788,
  remainingConstructionEst: 555,
  onFinalCcSharePct: 58.7,
  remainingSharePct: 41.3,
  sitewideCcFy2025: 1,
  sitewideCcFy2024: 4,
  rapcFy2025: 72,
  newConstructionStartsFy2025: 69,
  ongoingConstructionProjectsFy2025: 546,
  constructionObligationsFy2025UsdM: 766,
  saaActiveRemediation: 51,
  saaConstructionComplete: 18,
} as const;

export const VIZ_MARKERS = [
  "Construction-complete share of final NPL",
  "788 construction-complete vs 555 still building",
  "Sitewide CC pace vs RAPC throughput",
  "On-final CC share held near 59%",
] as const;

export type SnapshotRow = {
  fy: number;
  label: string;
  proposed: number;
  final: number;
  deleted: number;
  cumulativeCcNpl: number;
  cumulativeCcConfidence: Confidence;
  onFinalCcEst: number;
  remainingConstructionEst: number;
  onFinalCcSharePct: number;
  sitewideCcAnnual: number;
  rapcCompleted: number;
  notes: string;
};

/**
 * Annual NPL inventory + construction milestones.
 * Cumulative CC for FY2021–FY2023 back-calculated from FY2020 disclosed 1,221
 * plus disclosed annual sitewide NPL completions (8, 9, 4).
 */
export const ANNUAL_SNAPSHOTS: SnapshotRow[] = [
  {
    fy: 2019,
    label: "FY2019",
    proposed: 48,
    final: 1333,
    deleted: 424,
    cumulativeCcNpl: 1211,
    cumulativeCcConfidence: "disclosed",
    onFinalCcEst: 787,
    remainingConstructionEst: 546,
    onFinalCcSharePct: 59.0,
    sitewideCcAnnual: 6,
    rapcCompleted: 89,
    notes: "EPA: 1,211 NPL + 8 SAA cumulative CC",
  },
  {
    fy: 2020,
    label: "FY2020",
    proposed: 48,
    final: 1327,
    deleted: 438,
    cumulativeCcNpl: 1221,
    cumulativeCcConfidence: "disclosed",
    onFinalCcEst: 783,
    remainingConstructionEst: 544,
    onFinalCcSharePct: 59.0,
    sitewideCcAnnual: 10,
    rapcCompleted: 91,
    notes: "EPA: 1,221 NPL + 9 SAA; 10 NPL + 1 SAA sitewide in year",
  },
  {
    fy: 2021,
    label: "FY2021",
    proposed: 51,
    final: 1322,
    deleted: 447,
    cumulativeCcNpl: 1229,
    cumulativeCcConfidence: "derived",
    onFinalCcEst: 782,
    remainingConstructionEst: 540,
    onFinalCcSharePct: 59.2,
    sitewideCcAnnual: 8,
    rapcCompleted: 75,
    notes: "Cumulative = FY2020 1,221 + 8 sitewide NPL",
  },
  {
    fy: 2022,
    label: "FY2022",
    proposed: 39,
    final: 1334,
    deleted: 452,
    cumulativeCcNpl: 1238,
    cumulativeCcConfidence: "derived",
    onFinalCcEst: 786,
    remainingConstructionEst: 548,
    onFinalCcSharePct: 58.9,
    sitewideCcAnnual: 9,
    rapcCompleted: 74,
    notes: "Cumulative = prior + 9 sitewide NPL",
  },
  {
    fy: 2023,
    label: "FY2023",
    proposed: 41,
    final: 1336,
    deleted: 456,
    cumulativeCcNpl: 1242,
    cumulativeCcConfidence: "derived",
    onFinalCcEst: 786,
    remainingConstructionEst: 550,
    onFinalCcSharePct: 58.8,
    sitewideCcAnnual: 4,
    rapcCompleted: 69,
    notes: "Cumulative = prior + 4 sitewide NPL",
  },
  {
    fy: 2024,
    label: "FY2024",
    proposed: 42,
    final: 1340,
    deleted: 458,
    cumulativeCcNpl: 1246,
    cumulativeCcConfidence: "disclosed",
    onFinalCcEst: 788,
    remainingConstructionEst: 552,
    onFinalCcSharePct: 58.8,
    sitewideCcAnnual: 4,
    rapcCompleted: 73,
    notes: "EPA discloses 1,246 cumulative NPL CC",
  },
  {
    fy: 2025,
    label: "FY2025",
    proposed: 38,
    final: 1343,
    deleted: 459,
    cumulativeCcNpl: 1247,
    cumulativeCcConfidence: "derived",
    onFinalCcEst: 788,
    remainingConstructionEst: 555,
    onFinalCcSharePct: 58.7,
    sitewideCcAnnual: 1,
    rapcCompleted: 72,
    notes: "FY2024 1,246 + 1 sitewide completion; end-FY inventory from FY2025 report",
  },
];

export type SplitSlice = {
  id: "constructionComplete" | "remainingConstruction";
  label: string;
  sites: number;
  sharePct: number;
  color: string;
};

export const FY2025_SPLIT: SplitSlice[] = [
  {
    id: "constructionComplete",
    label: "Construction complete (still on final NPL)",
    sites: HEADLINE.onFinalCcEst,
    sharePct: HEADLINE.onFinalCcSharePct,
    color: "#0d9488",
  },
  {
    id: "remainingConstruction",
    label: "Remaining construction (not yet sitewide CC)",
    sites: HEADLINE.remainingConstructionEst,
    sharePct: HEADLINE.remainingSharePct,
    color: "#c2410c",
  },
];

export type PipelineBand = {
  id: string;
  label: string;
  value: number;
  unit: "sites" | "projects" | "usdM";
  color: string;
  detail: string;
};

/** FY2025 construction pipeline bands — mix of site and project metrics */
export const FY2025_PIPELINE: PipelineBand[] = [
  {
    id: "remaining",
    label: "Final NPL still building",
    value: 555,
    unit: "sites",
    color: "#c2410c",
    detail: "Estimated final sites without sitewide construction completion",
  },
  {
    id: "onFinalCc",
    label: "Final NPL construction complete",
    value: 788,
    unit: "sites",
    color: "#0d9488",
    detail: "Estimated final sites past the sitewide CC milestone",
  },
  {
    id: "ongoingProjects",
    label: "Ongoing remedial construction projects",
    value: 546,
    unit: "projects",
    color: "#0369a1",
    detail: "Projects started in prior years still under construction/oversight",
  },
  {
    id: "newStarts",
    label: "New remedial construction starts",
    value: 69,
    unit: "projects",
    color: "#7c3aed",
    detail: "27 government + 20 PRP + 22 federal-facility led",
  },
  {
    id: "rapcDone",
    label: "Remedial construction projects completed",
    value: 72,
    unit: "projects",
    color: "#15803d",
    detail: "Discrete RAPC completions — many sites need several before sitewide CC",
  },
  {
    id: "sitewideCc",
    label: "Sitewide construction completions",
    value: 1,
    unit: "sites",
    color: "#0f766e",
    detail: "Entire-site physical construction finished in FY2025",
  },
];

export type LeadMixRow = {
  id: "government" | "prp" | "federalFacility";
  label: string;
  starts: number;
  color: string;
};

export const FY2025_NEW_START_LEAD: LeadMixRow[] = [
  { id: "government", label: "Government-led", starts: 27, color: "#0369a1" },
  { id: "prp", label: "PRP-led", starts: 20, color: "#ca8a04" },
  { id: "federalFacility", label: "Federal facility-led", starts: 22, color: "#7c3aed" },
];

export type SaaRow = {
  id: "active" | "cc";
  label: string;
  sites: number;
  color: string;
};

export const SAA_STATUS: SaaRow[] = [
  {
    id: "active",
    label: "SAA still in active remediation",
    sites: 51,
    color: "#ea580c",
  },
  {
    id: "cc",
    label: "SAA construction complete",
    sites: 18,
    color: "#0d9488",
  },
];

export type MilestoneLadderRow = {
  stage: string;
  count: number;
  kind: "inventory" | "milestone" | "exit";
  color: string;
};

/** FY2025 ladder from listing through deletion */
export const FY2025_MILESTONE_LADDER: MilestoneLadderRow[] = [
  { stage: "Proposed NPL", count: 38, kind: "inventory", color: "#94a3b8" },
  { stage: "Final NPL", count: 1343, kind: "inventory", color: "#475569" },
  {
    stage: "Final · remaining construction",
    count: 555,
    kind: "milestone",
    color: "#c2410c",
  },
  {
    stage: "Final · construction complete",
    count: 788,
    kind: "milestone",
    color: "#0d9488",
  },
  { stage: "Deleted from NPL (cumulative)", count: 459, kind: "exit", color: "#15803d" },
];

export type DualAxisRow = {
  fy: number;
  label: string;
  sitewideCc: number;
  rapc: number;
  remainingEst: number;
  ccSharePct: number;
};

export function dualAxisSeries(fromFy = 2019): DualAxisRow[] {
  return ANNUAL_SNAPSHOTS.filter((r) => r.fy >= fromFy).map((r) => ({
    fy: r.fy,
    label: r.label,
    sitewideCc: r.sitewideCcAnnual,
    rapc: r.rapcCompleted,
    remainingEst: r.remainingConstructionEst,
    ccSharePct: r.onFinalCcSharePct,
  }));
}

export function stackedSplitRows(fromFy = 2019) {
  return ANNUAL_SNAPSHOTS.filter((r) => r.fy >= fromFy).map((r) => ({
    fy: r.fy,
    label: r.label,
    constructionComplete: r.onFinalCcEst,
    remainingConstruction: r.remainingConstructionEst,
    ccSharePct: r.onFinalCcSharePct,
  }));
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtUsdM(n: number): string {
  return `$${n.toLocaleString("en-US")}M`;
}
