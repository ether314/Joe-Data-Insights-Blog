/**
 * CSO communities versus remaining overflow volume (2026).
 *
 * Core question: How many combined-sewer communities remain, and how many
 * billion gallons still overflow in a typical year?
 *
 * Headline: EPA still counts ~700 CSO communities; the last national overflow
 * volume estimate remains 850 billion gallons/year (2004). CWNS 2022 reports
 * $36.5B in Category V (CSO correction) capital needs.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Primary: EPA Combined Sewer Overflows program pages and National CSO Inventory (ECHO / ICIS-NPDES; ~700 communities with combined systems and CSO discharges, concentrated in the Northeast and Great Lakes; ~90% of outfalls verified by states as of September 2023). Volume benchmark: EPA 2004 national estimate of 850 billion gallons/year of CSO discharges — GAO-23-105285 confirms this remains the last national volume estimate and that more recent national volume data are unavailable. Capital needs: EPA Clean Watersheds Needs Survey (CWNS) 2022 Report to Congress — Category V Combined Sewer Overflow Correction = $36.5 billion of $630.1 billion total reported needs (January 1, 2022 baseline, 20-year horizon). Great Lakes Basin: EPA Great Lakes CSO pages — 166 NPDES permits issued to 158 communities authorizing CSO discharges to the basin. Historical permit frame: EPA Report to Congress on CSO Control Policy (~859 permits / ~9,471 outfalls / ~772 communities circa early-2000s file review). State annual reports: NYSDEC CSO 2024 Annual Report (42 permitted CSS communities; 799 outfalls); Maine DEP CSO 2024 Status Report (statewide discharge ~532.5 MG in 2024 vs ~6.2 BG in 1989). Regional community shares and residual-volume illustrations that are not directly tabulated by EPA are labeled estimated or carried and are for visualization only — they do not replace a new national volume census.";

export const SOURCES = [
  {
    label: "EPA — Combined Sewer Overflows (CSOs)",
    url: "https://www.epa.gov/npdes/combined-sewer-overflows-csos",
  },
  {
    label: "EPA — Where CSO Outfalls Are Located / National Inventory",
    url: "https://www.epa.gov/npdes/where-combined-sewer-overflow-outfalls-are-located",
  },
  {
    label: "EPA ECHO — National CSO Inventory Summary",
    url: "https://echo.epa.gov/tools/data-downloads/cso-inventory-summary",
  },
  {
    label: "GAO-23-105285 — EPA Should Track CSO Control",
    url: "https://www.gao.gov/products/gao-23-105285",
  },
  {
    label: "EPA — Clean Watersheds Needs Survey 2022",
    url: "https://www.epa.gov/cwns/clean-watersheds-needs-survey-cwns-2022-report-and-data",
  },
  {
    label: "EPA — CSOs in the Great Lakes Basin",
    url: "https://www.epa.gov/npdes/combined-sewer-overflows-great-lakes-basin",
  },
  {
    label: "NYSDEC — Combined Sewer Overflows 2024 Annual Report",
    url: "https://dec.ny.gov/sites/default/files/2025-10/cso2024annual.pdf",
  },
  {
    label: "Maine DEP — CSO 2024 Status Report",
    url: "https://www.maine.gov/dep/publications/documents/archive/legislative%20reports/2025/Maine%20CSO%202024%20Status%20Report.pdf",
  },
] as const;

export const HEADLINE = {
  /** EPA current community count (approx.) */
  communitiesRemaining: 700,
  /** Last national annual overflow volume (billion gallons) — EPA 2004 */
  nationalVolumeBgY: 850,
  volumeEstimateYear: 2004,
  /** CWNS 2022 Category V needs, $ billions */
  cwnsCsoNeedsBb: 36.5,
  cwnsTotalNeedsBb: 630.1,
  /** Great Lakes Basin */
  greatLakesCommunities: 158,
  greatLakesPermits: 166,
  /** Historical early-2000s permit frame */
  historicalPermits: 859,
  historicalOutfalls: 9471,
  historicalCommunities: 772,
  /** Population living in CSO communities (GAO paraphrase of ~40M) */
  populationInCsoAreasM: 40,
  confidence: "disclosed" as Confidence,
};

export type RegionId =
  | "northeast"
  | "great-lakes"
  | "midwest-other"
  | "mid-atlantic"
  | "south"
  | "west";

export type RegionCommunityRow = {
  id: RegionId;
  label: string;
  communities: number;
  sharePct: number;
  /** Illustrative residual volume share of the 850 BG benchmark (estimated) */
  volumeSharePct: number;
  confidence: Confidence;
};

/**
 * Regional community distribution aligned to EPA geography (Northeast + Great
 * Lakes dominate). Counts sum to 700; shares are editorial estimates informed
 * by EPA map language, Great Lakes Basin disclosed 158 communities, and
 * historical Report-to-Congress concentration — not a new EPA census table.
 */
export const REGION_COMMUNITIES: RegionCommunityRow[] = [
  {
    id: "northeast",
    label: "Northeast",
    communities: 210,
    sharePct: 30,
    volumeSharePct: 34,
    confidence: "estimated",
  },
  {
    id: "great-lakes",
    label: "Great Lakes Basin",
    communities: 158,
    sharePct: 22.6,
    volumeSharePct: 28,
    confidence: "disclosed",
  },
  {
    id: "midwest-other",
    label: "Midwest (ex-GL)",
    communities: 145,
    sharePct: 20.7,
    volumeSharePct: 18,
    confidence: "estimated",
  },
  {
    id: "mid-atlantic",
    label: "Mid-Atlantic",
    communities: 110,
    sharePct: 15.7,
    volumeSharePct: 14,
    confidence: "estimated",
  },
  {
    id: "south",
    label: "South",
    communities: 52,
    sharePct: 7.4,
    volumeSharePct: 4,
    confidence: "estimated",
  },
  {
    id: "west",
    label: "West",
    communities: 25,
    sharePct: 3.6,
    volumeSharePct: 2,
    confidence: "estimated",
  },
];

export type TimelineRow = {
  year: number;
  label: string;
  communities: number | null;
  volumeBgY: number | null;
  note: string;
  confidence: Confidence;
};

/** Sparse national milestones — volume after 2004 is intentionally null (no EPA update). */
export const NATIONAL_TIMELINE: TimelineRow[] = [
  {
    year: 1994,
    label: "1994 CSO Control Policy",
    communities: 1100,
    volumeBgY: null,
    note: "EPA CSO Control Policy issued; community counts were higher before LTCPs matured",
    confidence: "estimated",
  },
  {
    year: 2001,
    label: "Early-2000s file review",
    communities: 772,
    volumeBgY: null,
    note: "~859 permits / ~9,471 outfalls covering ~772 communities",
    confidence: "carried",
  },
  {
    year: 2004,
    label: "National volume estimate",
    communities: 750,
    volumeBgY: 850,
    note: "EPA last national CSO volume estimate: 850 billion gallons/year",
    confidence: "disclosed",
  },
  {
    year: 2016,
    label: "Great Lakes Report to Congress",
    communities: 720,
    volumeBgY: null,
    note: "Basin-focused LTCP status; national volume still un-updated",
    confidence: "estimated",
  },
  {
    year: 2023,
    label: "National CSO Inventory (ECHO)",
    communities: 700,
    volumeBgY: null,
    note: "Inventory published May 2023; weekly ICIS-NPDES refresh; ~90% outfalls verified",
    confidence: "disclosed",
  },
  {
    year: 2026,
    label: "Current program frame",
    communities: 700,
    volumeBgY: 850,
    note: "Communities ~700 (EPA); volume still cited via 2004 benchmark pending Phase 2 e-reporting",
    confidence: "carried",
  },
];

export type CwnsCategoryRow = {
  id: string;
  label: string;
  needsBb: number;
  isCso: boolean;
};

/** Selected CWNS 2022 categories ($ billions) for context around Category V. */
export const CWNS_CATEGORIES: CwnsCategoryRow[] = [
  { id: "conveyance", label: "Conveyance repair + new", needsBb: 151.1, isCso: false },
  { id: "stormwater", label: "Stormwater management", needsBb: 115.3, isCso: false },
  { id: "nps", label: "Nonpoint source control", needsBb: 94.4, isCso: false },
  { id: "advanced", label: "Advanced wastewater treatment", needsBb: 83.6, isCso: false },
  { id: "decentralized", label: "Decentralized systems", needsBb: 74.7, isCso: false },
  { id: "secondary", label: "Secondary treatment", needsBb: 66.6, isCso: false },
  { id: "cso", label: "CSO correction (Cat. V)", needsBb: 36.5, isCso: true },
  { id: "reuse", label: "Water reuse", needsBb: 7.7, isCso: false },
];

export type StateBenchmarkRow = {
  id: string;
  label: string;
  metric: string;
  value: number;
  unit: string;
  compareValue?: number;
  compareLabel?: string;
  note: string;
  confidence: Confidence;
};

/** Disclosed state / basin benchmarks — volume units vary; used in dual-scale panels. */
export const STATE_BENCHMARKS: StateBenchmarkRow[] = [
  {
    id: "gl-communities",
    label: "Great Lakes Basin",
    metric: "CSO communities",
    value: 158,
    unit: "communities",
    note: "166 NPDES permits authorizing basin CSO discharges",
    confidence: "disclosed",
  },
  {
    id: "ny-communities",
    label: "New York",
    metric: "Permitted CSS communities",
    value: 42,
    unit: "communities",
    compareValue: 799,
    compareLabel: "outfalls",
    note: "NYSDEC 2024: 42 communities; NYC/Buffalo/Syracuse/Albany hold ~74% of outfalls",
    confidence: "disclosed",
  },
  {
    id: "me-volume-2024",
    label: "Maine 2024",
    metric: "Statewide CSO volume",
    value: 0.5325,
    unit: "BG",
    compareValue: 6.2,
    compareLabel: "1989 BG",
    note: "~532.5 MG in 2024 vs ~6.2 BG in 1989 (~91% reduction)",
    confidence: "disclosed",
  },
  {
    id: "oh-gl-permits",
    label: "Ohio (GL Basin)",
    metric: "CSO permits in basin",
    value: 42,
    unit: "permits",
    note: "EPA Great Lakes Basin–Ohio tabulation",
    confidence: "disclosed",
  },
  {
    id: "in-gl-permits",
    label: "Indiana (GL Basin)",
    metric: "CSO permits in basin",
    value: 22,
    unit: "permits",
    note: "EPA Great Lakes Basin–Indiana tabulation",
    confidence: "disclosed",
  },
];

export type DualAxisRow = {
  region: string;
  communities: number;
  /** Billion gallons — share of 850 BG benchmark × region volumeSharePct */
  residualVolumeBg: number;
  needsIllustrativeBb: number;
  confidence: Confidence;
};

/** Dual-axis: communities vs residual volume attribution vs illustrative needs share. */
export const DUAL_AXIS: DualAxisRow[] = REGION_COMMUNITIES.map((r) => ({
  region: r.label,
  communities: r.communities,
  residualVolumeBg: Math.round(850 * (r.volumeSharePct / 100) * 10) / 10,
  needsIllustrativeBb:
    Math.round(36.5 * (r.communities / 700) * 10) / 10,
  confidence: r.confidence,
}));

export type VolumeScenarioId = "2004-benchmark" | "modest-cut" | "deep-cut" | "maine-pace";

export type VolumeScenario = {
  id: VolumeScenarioId;
  label: string;
  volumeBgY: number;
  communities: number;
  note: string;
  confidence: Confidence;
};

/**
 * Scenario fan for "what if national volume tracked state-style cuts" —
 * only the 2004 row is an EPA disclosure; others are illustrative.
 */
export const VOLUME_SCENARIOS: VolumeScenario[] = [
  {
    id: "2004-benchmark",
    label: "2004 EPA benchmark",
    volumeBgY: 850,
    communities: 700,
    note: "Last official national annual volume; still cited by GAO/EPA as the reference",
    confidence: "disclosed",
  },
  {
    id: "modest-cut",
    label: "Modest national cut (−25%)",
    volumeBgY: 638,
    communities: 700,
    note: "Illustrative if LTCPs cut a quarter of volume while community count holds",
    confidence: "estimated",
  },
  {
    id: "deep-cut",
    label: "Deep national cut (−50%)",
    volumeBgY: 425,
    communities: 650,
    note: "Illustrative mid-point between Maine-style unit reductions and incomplete separation",
    confidence: "estimated",
  },
  {
    id: "maine-pace",
    label: "If nation matched Maine unit cut (−91%)",
    volumeBgY: 77,
    communities: 500,
    note: "Maine cut ~91% of volume since 1989; national extrapolation is not a forecast",
    confidence: "estimated",
  },
];

export type ScatterPoint = {
  id: string;
  label: string;
  communities: number;
  volumeOrProxyBg: number;
  needsBb: number;
  kind: "region" | "scenario" | "state";
};

export const SCATTER_POINTS: ScatterPoint[] = [
  ...DUAL_AXIS.map((d, i) => ({
    id: REGION_COMMUNITIES[i].id,
    label: d.region,
    communities: d.communities,
    volumeOrProxyBg: d.residualVolumeBg,
    needsBb: d.needsIllustrativeBb,
    kind: "region" as const,
  })),
  {
    id: "national",
    label: "U.S. (2004 vol.)",
    communities: 700,
    volumeOrProxyBg: 850,
    needsBb: 36.5,
    kind: "scenario",
  },
  {
    id: "maine",
    label: "Maine 2024",
    communities: 35,
    volumeOrProxyBg: 0.53,
    needsBb: 0.4,
    kind: "state",
  },
];

export const TABLE_ROWS = [
  {
    metric: "CSO communities (EPA current)",
    value: "~700",
    source: "EPA CSO outfall map / program pages",
    confidence: "disclosed" as Confidence,
  },
  {
    metric: "National overflow volume (typical year)",
    value: "850 billion gallons",
    source: "EPA 2004 estimate; still last national figure (GAO 2023)",
    confidence: "carried" as Confidence,
  },
  {
    metric: "CWNS Category V CSO correction needs",
    value: "$36.5 billion",
    source: "CWNS 2022 Report to Congress",
    confidence: "disclosed" as Confidence,
  },
  {
    metric: "CWNS total clean-water needs",
    value: "$630.1 billion",
    source: "CWNS 2022",
    confidence: "disclosed" as Confidence,
  },
  {
    metric: "Great Lakes Basin CSO communities",
    value: "158 (166 permits)",
    source: "EPA Great Lakes CSO pages",
    confidence: "disclosed" as Confidence,
  },
  {
    metric: "Historical permits / outfalls",
    value: "~859 / ~9,471",
    source: "EPA CSO Control Policy Report to Congress era",
    confidence: "carried" as Confidence,
  },
  {
    metric: "New York permitted CSS communities",
    value: "42 (799 outfalls)",
    source: "NYSDEC CSO 2024 Annual Report",
    confidence: "disclosed" as Confidence,
  },
  {
    metric: "Maine statewide CSO volume 2024",
    value: "~0.53 BG (vs 6.2 BG in 1989)",
    source: "Maine DEP CSO 2024 Status Report",
    confidence: "disclosed" as Confidence,
  },
];
