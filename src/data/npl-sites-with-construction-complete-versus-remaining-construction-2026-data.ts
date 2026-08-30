/**
 * NPL sites with construction complete versus remaining construction (2026).
 *
 * Core question: What share of current NPL sites have construction complete,
 * and how many still have construction unfinished?
 *
 * Headline: ~59% of final NPL sites are construction-complete; ~555 still unfinished.
 */

export type Confidence = "disclosed" | "derived" | "estimated";

export const SOURCE_NOTE =
  "Primary: EPA Superfund Remedial Annual Accomplishments Metrics FY 2025 (end-of-year NPL counts: 38 proposed / 1,343 final / 459 deleted; FY 2025 site-wide construction completion at 1 site; 72 remedial construction projects completed; 69 new projects started; oversight at 546 prior-year projects; $766M construction/post-construction obligations). Cumulative NPL construction-complete stock through FY 2024: 1,246 sites (EPA FY 2024 metrics); FY 2025 adds one disclosed site-wide completion → carried cumulative 1,247. Remaining-construction estimate on the final NPL = final sites minus (cumulative construction-complete minus deleted), treating deleted sites as a subset of the cumulative construction-complete stock — a desk derivation, not an EPA published split table. Pipeline context: remedial construction project completions (multi-OU) vs site-wide construction completion; Superfund Alternative Approach (SAA) 51 active + 18 construction-complete. Historical annual site-wide completions from EPA prior-year accomplishment metrics (FY 2015–FY 2025). Protection milestones: human exposures under control 1,505; groundwater migration controlled 1,191 (FY 2025). GAO-25-108408 (Mar 2025 statement): ~1,340 active NPL sites; cleanup timelines shaped by complexity, PRP availability, and resources; IIJA $3.5B Superfund remedial infusion. GAO-15-812: nonfederal NPL construction completions declined sharply FY 1999–2013. IIJA FY 2024 Report to Congress: ~$3.2B net obligated at 185 NPL sites through FY 2024.";

export const SOURCES = [
  {
    label: "EPA — Superfund Remedial Annual Accomplishments Metrics FY 2025",
    url: "https://www.epa.gov/superfund/superfund-remedial-annual-accomplishments-metrics-fiscal-year-2025",
  },
  {
    label: "EPA — Superfund Remedial Annual Accomplishments Metrics (prior years)",
    url: "https://www.epa.gov/superfund/previous-superfund-remedial-annual-accomplishments",
  },
  {
    label: "EPA — Construction Completions at NPL Sites (by number)",
    url: "https://www.epa.gov/superfund/construction-completions-national-priorities-list-npl-sites-number",
  },
  {
    label: "GAO-25-108408 — Superfund: Many Factors Can Affect Cleanup",
    url: "https://www.gao.gov/products/gao-25-108408",
  },
  {
    label: "GAO-15-812 — Superfund Funding and Cleanup Trends",
    url: "https://www.gao.gov/products/gao-15-812",
  },
  {
    label: "EPA — FY 2024 IIJA Superfund Remedial Report to Congress",
    url: "https://semspub.epa.gov/work/HQ/100003693.pdf",
  },
] as const;

/** End of FY 2025 NPL roster (EPA disclosed). */
export const NPL_ROSTER = {
  fiscalYear: 2025,
  proposed: 38,
  final: 1343,
  deleted: 459,
  /** proposed + final (sites still formally listed or proposed) */
  get listedOrProposed() {
    return this.proposed + this.final;
  },
  confidence: "disclosed" as Confidence,
};

/**
 * Cumulative site-wide construction completions at NPL sites.
 * FY 2024 stock disclosed; FY 2025 stock = prior + one disclosed annual completion.
 */
export const CUMULATIVE_CC = {
  endFy2024: 1246,
  fy2025Annual: 1,
  endFy2025: 1247,
  confidenceEndFy2024: "disclosed" as Confidence,
  confidenceEndFy2025: "derived" as Confidence,
};

/**
 * Split of the *current final* NPL into construction-complete vs remaining construction.
 * Assumes deleted sites ⊆ cumulative construction-complete stock.
 */
export const FINAL_NPL_SPLIT = {
  finalSites: NPL_ROSTER.final,
  deleted: NPL_ROSTER.deleted,
  cumulativeCc: CUMULATIVE_CC.endFy2025,
  /** Construction-complete sites still on the final NPL */
  constructionCompleteOnFinal: CUMULATIVE_CC.endFy2025 - NPL_ROSTER.deleted, // 788
  /** Final NPL sites that have not yet reached site-wide construction completion */
  remainingConstruction: NPL_ROSTER.final - (CUMULATIVE_CC.endFy2025 - NPL_ROSTER.deleted), // 555
  get constructionCompleteSharePct() {
    return (100 * this.constructionCompleteOnFinal) / this.finalSites;
  },
  get remainingSharePct() {
    return (100 * this.remainingConstruction) / this.finalSites;
  },
  confidence: "derived" as Confidence,
};

export const HEADLINE = {
  constructionCompleteOnFinal: FINAL_NPL_SPLIT.constructionCompleteOnFinal,
  remainingConstruction: FINAL_NPL_SPLIT.remainingConstruction,
  constructionCompleteSharePct: Math.round(FINAL_NPL_SPLIT.constructionCompleteSharePct * 10) / 10,
  finalNpl: NPL_ROSTER.final,
  cumulativeCc: CUMULATIVE_CC.endFy2025,
  deleted: NPL_ROSTER.deleted,
  fy2025SiteWideCc: 1,
  fy2025ProjectCompletions: 72,
  confidence: "derived" as Confidence,
};

export const SAA_STATUS = [
  {
    id: "active",
    label: "SAA active remediation",
    sites: 51,
    confidence: "disclosed" as Confidence,
  },
  {
    id: "cc",
    label: "SAA construction complete",
    sites: 18,
    confidence: "disclosed" as Confidence,
  },
] as const;

/** Funnel / stacked stages for the cleanup pipeline (FY 2025). */
export const PIPELINE_STAGES = [
  {
    id: "final-npl",
    label: "Final NPL sites",
    value: 1343,
    note: "End FY 2025 roster",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "cc-on-final",
    label: "Construction complete (on final NPL)",
    value: FINAL_NPL_SPLIT.constructionCompleteOnFinal,
    note: "Cumulative CC − deleted",
    confidence: "derived" as Confidence,
  },
  {
    id: "remaining",
    label: "Remaining construction",
    value: FINAL_NPL_SPLIT.remainingConstruction,
    note: "Final − CC-on-final",
    confidence: "derived" as Confidence,
  },
  {
    id: "project-complete-fy",
    label: "Remedial projects completed (FY25)",
    value: 72,
    note: "Multi-OU project completions — not site-wide",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "sitewide-cc-fy",
    label: "Site-wide construction complete (FY25)",
    value: 1,
    note: "Entire-site physical construction done",
    confidence: "disclosed" as Confidence,
  },
] as const;

/**
 * Annual site-wide NPL construction completions (EPA accomplishment metrics).
 * Cumulative stocks where disclosed; annual counts from year text.
 */
export const ANNUAL_SITEWIDE_CC: Array<{
  fiscalYear: number;
  annualCc: number;
  cumulativeCc: number | null;
  projectCompletions: number | null;
  confidence: Confidence;
}> = [
  { fiscalYear: 2015, annualCc: 13, cumulativeCc: 1177, projectCompletions: null, confidence: "disclosed" },
  { fiscalYear: 2016, annualCc: 11, cumulativeCc: 1188, projectCompletions: null, confidence: "disclosed" },
  { fiscalYear: 2017, annualCc: 7, cumulativeCc: 1195, projectCompletions: null, confidence: "disclosed" },
  { fiscalYear: 2018, annualCc: 10, cumulativeCc: 1205, projectCompletions: null, confidence: "estimated" },
  { fiscalYear: 2019, annualCc: 6, cumulativeCc: 1211, projectCompletions: null, confidence: "disclosed" },
  { fiscalYear: 2020, annualCc: 10, cumulativeCc: 1221, projectCompletions: null, confidence: "disclosed" },
  { fiscalYear: 2021, annualCc: 8, cumulativeCc: 1229, projectCompletions: 75, confidence: "derived" },
  { fiscalYear: 2022, annualCc: 9, cumulativeCc: 1238, projectCompletions: 74, confidence: "disclosed" },
  { fiscalYear: 2023, annualCc: 4, cumulativeCc: 1242, projectCompletions: 69, confidence: "derived" },
  { fiscalYear: 2024, annualCc: 4, cumulativeCc: 1246, projectCompletions: 73, confidence: "disclosed" },
  { fiscalYear: 2025, annualCc: 1, cumulativeCc: 1247, projectCompletions: 72, confidence: "derived" },
];

/** Project starts vs oversight vs completions (recent FY). */
export const CONSTRUCTION_ACTIVITY: Array<{
  fiscalYear: number;
  starts: number;
  priorYearOversight: number | null;
  projectCompletions: number;
  siteWideCc: number;
  constructionObligatedM: number | null;
  confidence: Confidence;
}> = [
  {
    fiscalYear: 2021,
    starts: 0,
    priorYearOversight: null,
    projectCompletions: 75,
    siteWideCc: 8,
    constructionObligatedM: 392,
    confidence: "disclosed",
  },
  {
    fiscalYear: 2022,
    starts: 115,
    priorYearOversight: 501,
    projectCompletions: 74,
    siteWideCc: 9,
    constructionObligatedM: null,
    confidence: "disclosed",
  },
  {
    fiscalYear: 2023,
    starts: 0,
    priorYearOversight: null,
    projectCompletions: 69,
    siteWideCc: 4,
    constructionObligatedM: 1250,
    confidence: "disclosed",
  },
  {
    fiscalYear: 2024,
    starts: 86,
    priorYearOversight: null,
    projectCompletions: 73,
    siteWideCc: 4,
    constructionObligatedM: null,
    confidence: "disclosed",
  },
  {
    fiscalYear: 2025,
    starts: 69,
    priorYearOversight: 546,
    projectCompletions: 72,
    siteWideCc: 1,
    constructionObligatedM: 766,
    confidence: "disclosed",
  },
];

/** Protection / reuse milestones vs construction stock (FY 2025 end where noted). */
export const MILESTONE_COMPARE = [
  {
    id: "cum-cc",
    label: "Cumulative construction complete (NPL)",
    value: CUMULATIVE_CC.endFy2025,
    confidence: "derived" as Confidence,
  },
  {
    id: "heuc",
    label: "Human exposures under control",
    value: 1505,
    confidence: "disclosed" as Confidence,
  },
  {
    id: "gmi",
    label: "Groundwater migration under control",
    value: 1191,
    confidence: "disclosed" as Confidence,
  },
  {
    id: "swrau",
    label: "Sitewide Ready for Anticipated Use (FY24 net)",
    value: 950,
    confidence: "disclosed" as Confidence,
  },
  {
    id: "deleted",
    label: "Deleted from NPL",
    value: 459,
    confidence: "disclosed" as Confidence,
  },
] as const;

export type ViewMode = "final-split" | "pipeline" | "annual" | "activity" | "milestones" | "saa";

export const VIEW_OPTIONS: Array<{ id: ViewMode; label: string }> = [
  { id: "final-split", label: "Final NPL split" },
  { id: "pipeline", label: "Pipeline funnel" },
  { id: "annual", label: "Annual site-wide CC" },
  { id: "activity", label: "Project activity" },
  { id: "milestones", label: "Protection milestones" },
  { id: "saa", label: "SAA status" },
];

export type DenominatorMode = "final" | "cumulative-ever" | "listed-plus-proposed";

export const DENOMINATOR_OPTIONS: Array<{ id: DenominatorMode; label: string }> = [
  { id: "final", label: "Final NPL only" },
  { id: "cumulative-ever", label: "Cumulative ever-listed frame" },
  { id: "listed-plus-proposed", label: "Final + proposed" },
];

/** Share under alternate denominators (for control). */
export function shareUnderDenominator(mode: DenominatorMode): {
  complete: number;
  remaining: number;
  completePct: number;
  denom: number;
  note: string;
} {
  const completeOnFinal = FINAL_NPL_SPLIT.constructionCompleteOnFinal;
  const remaining = FINAL_NPL_SPLIT.remainingConstruction;
  if (mode === "final") {
    return {
      complete: completeOnFinal,
      remaining,
      completePct: FINAL_NPL_SPLIT.constructionCompleteSharePct,
      denom: NPL_ROSTER.final,
      note: "CC still on final NPL ÷ final NPL sites",
    };
  }
  if (mode === "listed-plus-proposed") {
    const denom = NPL_ROSTER.final + NPL_ROSTER.proposed;
    return {
      complete: completeOnFinal,
      remaining: remaining + NPL_ROSTER.proposed,
      completePct: (100 * completeOnFinal) / denom,
      denom,
      note: "Treats proposed sites as not yet construction-complete",
    };
  }
  // cumulative-ever: cumulative CC / (final + deleted) — classic EPA "of NPL sites" framing
  const denom = NPL_ROSTER.final + NPL_ROSTER.deleted;
  return {
    complete: CUMULATIVE_CC.endFy2025,
    remaining: denom - CUMULATIVE_CC.endFy2025,
    completePct: (100 * CUMULATIVE_CC.endFy2025) / denom,
    denom,
    note: "Cumulative CC ÷ (final + deleted); remaining can be negative if CC > final+deleted due to definition drift — clipped in viz",
  };
}

export const IIJA_CONTEXT = {
  authorizationBb: 3.5,
  obligatedThroughFy2024Bb: 3.2,
  sitesFundedThroughFy2024: 185,
  fy2025ConstructionObligatedM: 766,
  confidence: "disclosed" as Confidence,
} as const;

/** Donut / stacked bar rows for the headline split. */
export const SPLIT_ROWS = [
  {
    id: "cc",
    label: "Construction complete",
    sites: FINAL_NPL_SPLIT.constructionCompleteOnFinal,
    fill: "#0f766e",
  },
  {
    id: "remaining",
    label: "Remaining construction",
    sites: FINAL_NPL_SPLIT.remainingConstruction,
    fill: "#c2410c",
  },
] as const;
