/**
 * NPL sites with construction complete versus remaining construction (2026).
 *
 * Core question: What share of current NPL sites have construction complete,
 * and how many still have construction unfinished?
 *
 * Headline (EPA Superfund Remedial Annual Accomplishments, FY2024–FY2025):
 * among 1,343 final NPL sites at end of FY2025, an estimated 788 (~58.7%)
 * have already reached sitewide construction complete while remaining on the
 * list; about 555 (~41.3%) still have unfinished remedial construction.
 */

export type Confidence = "disclosed" | "estimated" | "derived";

export const SOURCE_NOTE =
  "Primary: EPA Superfund Remedial Annual Accomplishments Metrics — Fiscal Year 2025 (NPL counts: 38 proposed / 1,343 final / 459 deleted; FY2025 sitewide construction complete: 1 site; remedial construction projects started 69 / ongoing 546 / completed 72) and Fiscal Year 2024 (cumulative sitewide construction complete: 1,246 NPL sites; annual sitewide CC: 4). Construction-complete sites still on the final NPL are estimated as cumulative CC (1,246 + 1 FY2025 = 1,247) minus deleted sites (459), under the program rule that deletion follows completed cleanup. GAO-25-108408 (March 2025 NPL snapshot: 1,340 active / 41 proposed / 459 deleted) cited for backlog and timeliness context. Sitewide Ready for Anticipated Use (SWRAU) net total 950 is from FY2024 metrics. Project-lead splits and SAA counts are EPA-disclosed; shares of unfinished construction are derived.";

export const SOURCES = [
  {
    label: "EPA — Superfund Remedial Annual Accomplishments Metrics FY2025",
    url: "https://www.epa.gov/superfund/superfund-remedial-annual-accomplishments-metrics-fiscal-year-2025",
  },
  {
    label: "EPA — Superfund Remedial Annual Accomplishments Metrics FY2024",
    url: "https://www.epa.gov/superfund/superfund-remedial-annual-accomplishments-metrics",
  },
  {
    label: "EPA — Previous Superfund Remedial Annual Accomplishments",
    url: "https://www.epa.gov/superfund/previous-superfund-remedial-annual-accomplishments",
  },
  {
    label: "GAO-25-108408 — Superfund: Many Factors Can Affect Cleanup",
    url: "https://www.gao.gov/products/gao-25-108408",
  },
  {
    label: "EPA — Superfund Accomplishments Report Fiscal Year 2025",
    url: "https://www.epa.gov/superfund/superfund-accomplishments-report-fiscal-year-2025",
  },
] as const;

/** End FY2025 NPL book (EPA FY2025 accomplishments) */
export const NPL_BOOK = {
  proposed: 38,
  final: 1_343,
  deleted: 459,
  /** Cumulative sitewide construction complete through FY2024 */
  cumulativeCcFy2024: 1_246,
  /** Sitewide CC added in FY2025 */
  sitewideCcFy2025: 1,
  confidence: "disclosed" as Confidence,
};

/** Derived construction-complete / unfinished split on the final NPL */
export const HEADLINE = {
  finalNpl: NPL_BOOK.final,
  cumulativeCc: NPL_BOOK.cumulativeCcFy2024 + NPL_BOOK.sitewideCcFy2025, // 1,247
  deleted: NPL_BOOK.deleted,
  /** CC sites still listed as final */
  ccOnFinalNpl: NPL_BOOK.cumulativeCcFy2024 + NPL_BOOK.sitewideCcFy2025 - NPL_BOOK.deleted, // 788
  unfinishedOnFinalNpl:
    NPL_BOOK.final -
    (NPL_BOOK.cumulativeCcFy2024 + NPL_BOOK.sitewideCcFy2025 - NPL_BOOK.deleted), // 555
  ccSharePct: Math.round(
    ((NPL_BOOK.cumulativeCcFy2024 + NPL_BOOK.sitewideCcFy2025 - NPL_BOOK.deleted) /
      NPL_BOOK.final) *
      1000,
  ) / 10, // 58.7
  unfinishedSharePct: Math.round(
    ((NPL_BOOK.final -
      (NPL_BOOK.cumulativeCcFy2024 + NPL_BOOK.sitewideCcFy2025 - NPL_BOOK.deleted)) /
      NPL_BOOK.final) *
      1000,
  ) / 10, // 41.3
  confidence: "estimated" as Confidence,
};

export type StatusSliceId =
  | "cc-on-final"
  | "unfinished-final"
  | "deleted"
  | "proposed";

export type StatusSlice = {
  id: StatusSliceId;
  label: string;
  sites: number;
  shareOfUniversePct: number;
  confidence: Confidence;
};

const universe =
  NPL_BOOK.final + NPL_BOOK.deleted + NPL_BOOK.proposed; // 1,840

/** Full NPL status universe for pie / stacked views */
export const STATUS_UNIVERSE: StatusSlice[] = [
  {
    id: "cc-on-final",
    label: "Construction complete (still final)",
    sites: HEADLINE.ccOnFinalNpl,
    shareOfUniversePct: Math.round((HEADLINE.ccOnFinalNpl / universe) * 1000) / 10,
    confidence: "estimated",
  },
  {
    id: "unfinished-final",
    label: "Construction unfinished (final)",
    sites: HEADLINE.unfinishedOnFinalNpl,
    shareOfUniversePct:
      Math.round((HEADLINE.unfinishedOnFinalNpl / universe) * 1000) / 10,
    confidence: "estimated",
  },
  {
    id: "deleted",
    label: "Deleted from NPL",
    sites: NPL_BOOK.deleted,
    shareOfUniversePct: Math.round((NPL_BOOK.deleted / universe) * 1000) / 10,
    confidence: "disclosed",
  },
  {
    id: "proposed",
    label: "Proposed for NPL",
    sites: NPL_BOOK.proposed,
    shareOfUniversePct: Math.round((NPL_BOOK.proposed / universe) * 1000) / 10,
    confidence: "disclosed",
  },
];

export type FinalSplitRow = {
  id: "construction-complete" | "construction-unfinished";
  label: string;
  sites: number;
  sharePct: number;
  confidence: Confidence;
};

/** Binary split on current final NPL — the brief’s core answer */
export const FINAL_NPL_SPLIT: FinalSplitRow[] = [
  {
    id: "construction-complete",
    label: "Construction complete",
    sites: HEADLINE.ccOnFinalNpl,
    sharePct: HEADLINE.ccSharePct,
    confidence: "estimated",
  },
  {
    id: "construction-unfinished",
    label: "Construction unfinished",
    sites: HEADLINE.unfinishedOnFinalNpl,
    sharePct: HEADLINE.unfinishedSharePct,
    confidence: "estimated",
  },
];

export type AnnualCcRow = {
  fiscalYear: number;
  sitewideCc: number;
  cumulativeCc: number;
  confidence: Confidence;
};

/**
 * Annual sitewide construction-complete counts + running cumulative.
 * FY2016–FY2019 cumulatives reconstructed from EPA prior-year disclosures;
 * FY2020+ use published cumulative or annual adds.
 */
export const ANNUAL_SITEWIDE_CC: AnnualCcRow[] = [
  { fiscalYear: 2016, sitewideCc: 11, cumulativeCc: 1_188, confidence: "disclosed" },
  { fiscalYear: 2017, sitewideCc: 7, cumulativeCc: 1_195, confidence: "disclosed" },
  { fiscalYear: 2018, sitewideCc: 10, cumulativeCc: 1_205, confidence: "disclosed" },
  { fiscalYear: 2019, sitewideCc: 6, cumulativeCc: 1_211, confidence: "disclosed" },
  { fiscalYear: 2020, sitewideCc: 10, cumulativeCc: 1_221, confidence: "disclosed" },
  { fiscalYear: 2021, sitewideCc: 8, cumulativeCc: 1_229, confidence: "derived" },
  { fiscalYear: 2022, sitewideCc: 9, cumulativeCc: 1_238, confidence: "derived" },
  { fiscalYear: 2023, sitewideCc: 4, cumulativeCc: 1_242, confidence: "derived" },
  { fiscalYear: 2024, sitewideCc: 4, cumulativeCc: 1_246, confidence: "disclosed" },
  { fiscalYear: 2025, sitewideCc: 1, cumulativeCc: 1_247, confidence: "derived" },
];

export type ProjectFlowRow = {
  fiscalYear: number;
  started: number;
  ongoingPrior: number;
  completedProjects: number;
  sitewideCc: number;
  confidence: Confidence;
};

/** Remedial construction project flow vs rare sitewide CC milestone */
export const PROJECT_FLOW: ProjectFlowRow[] = [
  {
    fiscalYear: 2024,
    started: 86,
    ongoingPrior: 550,
    completedProjects: 73,
    sitewideCc: 4,
    confidence: "disclosed",
  },
  {
    fiscalYear: 2025,
    started: 69,
    ongoingPrior: 546,
    completedProjects: 72,
    sitewideCc: 1,
    confidence: "disclosed",
  },
];

export type LeadMixRow = {
  fiscalYear: number;
  government: number;
  prp: number;
  federalFacility: number;
  confidence: Confidence;
};

/** Who started new remedial construction projects */
export const LEAD_MIX: LeadMixRow[] = [
  {
    fiscalYear: 2024,
    government: 49,
    prp: 16,
    federalFacility: 21,
    confidence: "disclosed",
  },
  {
    fiscalYear: 2025,
    government: 27,
    prp: 20,
    federalFacility: 22,
    confidence: "disclosed",
  },
];

export type SaaRow = {
  id: "active-remediation" | "construction-complete";
  label: string;
  sites: number;
  fiscalYear: number;
  confidence: Confidence;
};

/** Superfund Alternative Approach agreements (FY2025) */
export const SAA_STATUS: SaaRow[] = [
  {
    id: "active-remediation",
    label: "SAA — active remediation",
    sites: 51,
    fiscalYear: 2025,
    confidence: "disclosed",
  },
  {
    id: "construction-complete",
    label: "SAA — construction complete",
    sites: 18,
    fiscalYear: 2025,
    confidence: "disclosed",
  },
];

export type MilestoneLadderRow = {
  id: string;
  label: string;
  sites: number;
  note: string;
  confidence: Confidence;
};

/**
 * Pipeline ladder from exposures controlled → construction complete → SWRAU → deleted.
 * Numbers are cumulative program totals (not mutually exclusive stages).
 */
export const MILESTONE_LADDER: MilestoneLadderRow[] = [
  {
    id: "heuc",
    label: "Human exposures under control",
    sites: 1_505,
    note: "End FY2025 cumulative",
    confidence: "disclosed",
  },
  {
    id: "gmc",
    label: "Groundwater migration controlled",
    sites: 1_191,
    note: "End FY2025 cumulative",
    confidence: "disclosed",
  },
  {
    id: "cc",
    label: "Sitewide construction complete",
    sites: HEADLINE.cumulativeCc,
    note: "Through FY2025 (NPL)",
    confidence: "derived",
  },
  {
    id: "swrau",
    label: "Sitewide ready for anticipated use",
    sites: 950,
    note: "Net total end FY2024",
    confidence: "disclosed",
  },
  {
    id: "deleted",
    label: "Deleted from NPL",
    sites: 459,
    note: "End FY2025",
    confidence: "disclosed",
  },
];

export type FundingRow = {
  fiscalYear: number;
  constructionObligatedM: number;
  preConstructionObligatedM: number;
  confidence: Confidence;
};

export const FUNDING: FundingRow[] = [
  {
    fiscalYear: 2024,
    constructionObligatedM: 1_300,
    preConstructionObligatedM: 417,
    confidence: "disclosed",
  },
  {
    fiscalYear: 2025,
    constructionObligatedM: 766,
    preConstructionObligatedM: 308,
    confidence: "disclosed",
  },
];

export type SummaryTableRow = {
  metric: string;
  value: string;
  source: string;
  confidence: Confidence;
};

export const SUMMARY_TABLE: SummaryTableRow[] = [
  {
    metric: "Final NPL sites (end FY2025)",
    value: "1,343",
    source: "EPA FY2025 accomplishments",
    confidence: "disclosed",
  },
  {
    metric: "Cumulative sitewide construction complete",
    value: "1,247",
    source: "EPA FY2024 cumulative 1,246 + FY2025 add 1",
    confidence: "derived",
  },
  {
    metric: "CC sites still on final NPL",
    value: String(HEADLINE.ccOnFinalNpl),
    source: "Cumulative CC − deleted",
    confidence: "estimated",
  },
  {
    metric: "Construction unfinished on final NPL",
    value: String(HEADLINE.unfinishedOnFinalNpl),
    source: "Final − CC-on-final",
    confidence: "estimated",
  },
  {
    metric: "CC share of final NPL",
    value: `${HEADLINE.ccSharePct}%`,
    source: "Derived",
    confidence: "estimated",
  },
  {
    metric: "Unfinished share of final NPL",
    value: `${HEADLINE.unfinishedSharePct}%`,
    source: "Derived",
    confidence: "estimated",
  },
  {
    metric: "Deleted from NPL (cumulative)",
    value: "459",
    source: "EPA FY2025 accomplishments",
    confidence: "disclosed",
  },
  {
    metric: "FY2025 remedial construction projects completed",
    value: "72",
    source: "EPA FY2025 accomplishments",
    confidence: "disclosed",
  },
  {
    metric: "FY2025 sitewide construction complete",
    value: "1",
    source: "EPA FY2025 accomplishments",
    confidence: "disclosed",
  },
  {
    metric: "SWRAU net total (end FY2024)",
    value: "950",
    source: "EPA FY2024 accomplishments",
    confidence: "disclosed",
  },
];

export type UniverseMode = "final-only" | "final-plus-deleted" | "full-book";
export type YearFilter = "all" | "recent" | "fy2025";

export function filterAnnualCc(years: YearFilter): AnnualCcRow[] {
  if (years === "fy2025") return ANNUAL_SITEWIDE_CC.filter((r) => r.fiscalYear === 2025);
  if (years === "recent") return ANNUAL_SITEWIDE_CC.filter((r) => r.fiscalYear >= 2020);
  return ANNUAL_SITEWIDE_CC;
}

export function statusForMode(mode: UniverseMode): StatusSlice[] {
  if (mode === "final-only") {
    return STATUS_UNIVERSE.filter(
      (s) => s.id === "cc-on-final" || s.id === "unfinished-final",
    );
  }
  if (mode === "final-plus-deleted") {
    return STATUS_UNIVERSE.filter((s) => s.id !== "proposed");
  }
  return STATUS_UNIVERSE;
}

export const ANALYTICS = {
  projectsPerSitewideCcFy2025: 72, // 72 project completions for 1 sitewide CC
  projectsPerSitewideCcFy2024: Math.round(73 / 4), // ~18
  unfinishedSites: HEADLINE.unfinishedOnFinalNpl,
  ccSharePct: HEADLINE.ccSharePct,
  saaCcSharePct: Math.round((18 / (51 + 18)) * 1000) / 10, // 26.1
};
