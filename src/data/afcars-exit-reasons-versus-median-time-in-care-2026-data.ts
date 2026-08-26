/**
 * AFCARS exit reasons versus median months in care — FY2019–FY2023 desk synthesis.
 * Core question: Did the mix of reunification, adoption, and emancipation shift
 * as median months in care moved after FY2019?
 *
 * Anchors: Children's Bureau AFCARS Reports #27–#30 (FY2019–FY2022 preliminary
 * estimates); FY2023 AFCARS Dashboard printable (No. 31, as of May 1, 2025).
 * FY2023 detailed exit tables follow AFCARS 2020 reporting rules and exclude
 * Washington and Wyoming at the May 2025 snapshot. Estimated medians labeled.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Exit-reason shares and median months in care for FY2019–FY2022 follow Children's Bureau AFCARS Reports #27–#30 (preliminary estimates as published). FY2023 exit counts and reason shares follow the FY2023 AFCARS Dashboard printable (No. 31, submissions as of May 1, 2025) under AFCARS 2020 definitions; WA and WY were not in that detailed snapshot. FY2023 national median months for exits is desk-estimated from the published time-in-care distribution (cumulative share crosses 50% near 1.5 years). Volume totals in Numbers at a Glance may differ slightly from report-specific exit Ns because of resubmissions.";

export const SOURCES = [
  {
    label: "Children's Bureau — AFCARS Report #27 (FY2019)",
    url: "https://acf.gov/sites/default/files/documents/cb/afcarsreport27.pdf",
  },
  {
    label: "Children's Bureau — AFCARS Report #28 (FY2020)",
    url: "https://acf.gov/sites/default/files/documents/cb/afcarsreport28.pdf",
  },
  {
    label: "Children's Bureau — AFCARS Report #29 (FY2021)",
    url: "https://acf.gov/cb/report/afcars-report-29",
  },
  {
    label: "Children's Bureau — AFCARS Report #30 (FY2022)",
    url: "https://acf.gov/sites/default/files/documents/cb/afcars-report-30.pdf",
  },
  {
    label: "Children's Bureau — FY2023 AFCARS Dashboard printable (No. 31)",
    url: "https://acf.gov/sites/default/files/documents/cb/2023-afcars-dashboard-printable.pdf",
  },
  {
    label: "ACF — AFCARS data & statistics hub",
    url: "https://acf.gov/cb/research-data-technology/statistics-research/afcars",
  },
] as const;

/** Headline story beats for cards / excerpt */
export const HEADLINE = {
  fy2019MedianMonths: 15.5,
  fy2022MedianMonths: 17.5,
  fy2023MedianMonthsEst: 18.0,
  medianRiseFy19To22Months: 2.0,
  reunificationShareFy2019Pct: 47,
  reunificationShareFy2023Pct: 44,
  reunificationDropPp: 3,
  adoptionShareFy2019Pct: 26,
  adoptionShareFy2023Pct: 27,
  emancipationShareFy2019Pct: 8,
  emancipationShareFy2022Pct: 9,
  emancipationShareFy2023Pct: 8,
  exitsFy2019: 248_669,
  exitsFy2023Glance: 184_095,
  exitsDeclinePctApprox: 26,
} as const;

export type ExitReasonId =
  | "reunification"
  | "livingWithRelative"
  | "adoption"
  | "emancipation"
  | "guardianship"
  | "other";

export const EXIT_REASON_LABELS: Record<ExitReasonId, string> = {
  reunification: "Reunification",
  livingWithRelative: "Living with relative(s)",
  adoption: "Adoption",
  emancipation: "Emancipation",
  guardianship: "Guardianship",
  other: "Other / transfer / runaway / death",
};

export const EXIT_REASON_COLORS: Record<ExitReasonId, string> = {
  reunification: "#0ea5e9",
  livingWithRelative: "#14b8a6",
  adoption: "#f59e0b",
  emancipation: "#f43f5e",
  guardianship: "#8b5cf6",
  other: "#64748b",
};

export type AnnualExitRow = {
  fy: number;
  label: string;
  exits: number;
  medianMonths: number;
  meanMonths: number | null;
  reunificationPct: number;
  livingWithRelativePct: number;
  adoptionPct: number;
  emancipationPct: number;
  guardianshipPct: number;
  otherPct: number;
  reunificationN: number;
  livingWithRelativeN: number;
  adoptionN: number;
  emancipationN: number;
  guardianshipN: number;
  otherN: number;
  reportingRegime: "legacy" | "afcars2020";
  medianConfidence: Confidence;
  note?: string;
};

/**
 * National children exiting foster care during the federal fiscal year.
 * Percents are published discharge-reason shares (may not sum to 100 after rounding).
 * `other` rolls transfer, runaway, death, and residual missing into one residual.
 */
export const ANNUAL_EXITS: AnnualExitRow[] = [
  {
    fy: 2019,
    label: "FY2019",
    exits: 248_669,
    medianMonths: 15.5,
    meanMonths: 20.0,
    reunificationPct: 47,
    livingWithRelativePct: 6,
    adoptionPct: 26,
    emancipationPct: 8,
    guardianshipPct: 11,
    otherPct: 2,
    reunificationN: 117_010,
    livingWithRelativeN: 15_422,
    adoptionN: 64_415,
    emancipationN: 20_445,
    guardianshipN: 26_103,
    otherN: 2_726 + 608 + 385,
    reportingRegime: "legacy",
    medianConfidence: "disclosed",
  },
  {
    fy: 2020,
    label: "FY2020",
    exits: 224_396,
    medianMonths: 15.9,
    meanMonths: 20.5,
    reunificationPct: 48,
    livingWithRelativePct: 6,
    adoptionPct: 25,
    emancipationPct: 9,
    guardianshipPct: 10,
    otherPct: 2,
    reunificationN: 107_333,
    livingWithRelativeN: 12_463,
    adoptionN: 56_568,
    emancipationN: 20_010,
    guardianshipN: 23_160,
    otherN: 2_263 + 528 + 360,
    reportingRegime: "legacy",
    medianConfidence: "disclosed",
    note: "First full pandemic federal fiscal year; entries and exits both fell sharply.",
  },
  {
    fy: 2021,
    label: "FY2021",
    exits: 214_971,
    medianMonths: 17.5,
    meanMonths: null,
    reunificationPct: 47,
    livingWithRelativePct: 6,
    adoptionPct: 25,
    emancipationPct: 9,
    guardianshipPct: 12,
    otherPct: 1,
    reunificationN: 100_004,
    livingWithRelativeN: 12_531,
    adoptionN: 53_546,
    emancipationN: 19_130,
    guardianshipN: 25_023,
    otherN: 2_290 + 552 + 368,
    reportingRegime: "legacy",
    medianConfidence: "disclosed",
  },
  {
    fy: 2022,
    label: "FY2022",
    exits: 201_372,
    medianMonths: 17.5,
    meanMonths: 22.6,
    reunificationPct: 46,
    livingWithRelativePct: 6,
    adoptionPct: 27,
    emancipationPct: 9,
    guardianshipPct: 11,
    otherPct: 1,
    reunificationN: 91_115,
    livingWithRelativeN: 11_132,
    adoptionN: 52_985,
    emancipationN: 18_538,
    guardianshipN: 22_842,
    otherN: 2_198 + 462 + 420,
    reportingRegime: "legacy",
    medianConfidence: "disclosed",
  },
  {
    fy: 2023,
    label: "FY2023",
    exits: 184_095,
    medianMonths: 18.0,
    meanMonths: null,
    reunificationPct: 44,
    livingWithRelativePct: 7,
    adoptionPct: 27,
    emancipationPct: 8,
    guardianshipPct: 10,
    otherPct: 4,
    reunificationN: 80_857,
    livingWithRelativeN: 13_037,
    adoptionN: 50_193,
    emancipationN: 15_590,
    guardianshipN: 19_329,
    otherN: 2_058 + 660 + 427 + 1_944,
    reportingRegime: "afcars2020",
    medianConfidence: "estimated",
    note: "AFCARS 2020 definitions; WA/WY absent from detailed May 2025 snapshot. Median estimated from time-in-care buckets.",
  },
];

/** Glance volume ladder (dashboard printable Numbers at a Glance). */
export type GlanceVolumeRow = {
  fy: number;
  entered: number;
  inCareSep30: number;
  exited: number;
  adoptionExits: number;
};

export const GLANCE_VOLUMES: GlanceVolumeRow[] = [
  { fy: 2019, entered: 252_198, inCareSep30: 425_974, exited: 250_024, adoptionExits: 64_238 },
  { fy: 2020, entered: 216_450, inCareSep30: 407_332, exited: 223_918, adoptionExits: 56_372 },
  { fy: 2021, entered: 206_867, inCareSep30: 391_641, exited: 214_542, adoptionExits: 53_343 },
  { fy: 2022, entered: 186_602, inCareSep30: 368_530, exited: 201_372, adoptionExits: 52_985 },
  { fy: 2023, entered: 175_283, inCareSep30: 343_077, exited: 184_095, adoptionExits: 50_193 },
];

/** FY2023 exit time-in-care distribution (dashboard printable). */
export type DurationBucket = {
  id: string;
  label: string;
  pct: number;
  n: number;
  /** Approximate midpoint months for chart ordering / median estimate */
  midMonths: number;
};

export const FY2023_DURATION_BUCKETS: DurationBucket[] = [
  { id: "lt8d", label: "< 8 days", pct: 4, n: 6_633, midMonths: 0.1 },
  { id: "8to30d", label: "8–30 days", pct: 3, n: 5_166, midMonths: 0.6 },
  { id: "31to182d", label: "31–182 days", pct: 12, n: 22_734, midMonths: 3.5 },
  { id: "183to365d", label: "183–365 days", pct: 16, n: 29_399, midMonths: 9 },
  { id: "1to15y", label: "1–1.5 years", pct: 16, n: 28_924, midMonths: 15 },
  { id: "15to2y", label: "1.5–2 years", pct: 13, n: 23_493, midMonths: 21 },
  { id: "2to3y", label: "2–3 years", pct: 17, n: 30_470, midMonths: 30 },
  { id: "gt3y", label: "> 3 years", pct: 20, n: 37_276, midMonths: 42 },
];

/** Cohort-style median months to permanency exit (Children's Bureau brief, entries FY2015–2017 followed 5 years). */
export type PermanencyPaceRow = {
  exitType: string;
  medianMonths: number;
  shareOfPermanentExitsPct: number;
};

export const PERMANENCY_PACE: PermanencyPaceRow[] = [
  { exitType: "Reunification", medianMonths: 7, shareOfPermanentExitsPct: 56 },
  { exitType: "Relative / guardianship", medianMonths: 12, shareOfPermanentExitsPct: 19 },
  { exitType: "Adoption", medianMonths: 27, shareOfPermanentExitsPct: 25 },
  { exitType: "All permanent exits", medianMonths: 12, shareOfPermanentExitsPct: 100 },
];

export type MixFocusId =
  | "reunification"
  | "adoption"
  | "emancipation"
  | "guardianship"
  | "livingWithRelative";

export const MIX_FOCUS_OPTIONS: { id: MixFocusId; label: string }[] = [
  { id: "reunification", label: "Reunification share" },
  { id: "adoption", label: "Adoption share" },
  { id: "emancipation", label: "Emancipation share" },
  { id: "guardianship", label: "Guardianship share" },
  { id: "livingWithRelative", label: "Living with relative(s)" },
];

export function mixShareFor(row: AnnualExitRow, focus: MixFocusId): number {
  switch (focus) {
    case "reunification":
      return row.reunificationPct;
    case "adoption":
      return row.adoptionPct;
    case "emancipation":
      return row.emancipationPct;
    case "guardianship":
      return row.guardianshipPct;
    case "livingWithRelative":
      return row.livingWithRelativePct;
  }
}

export function stackedMixRows(years: number[] = ANNUAL_EXITS.map((r) => r.fy)) {
  return ANNUAL_EXITS.filter((r) => years.includes(r.fy)).map((r) => ({
    fy: r.fy,
    label: r.label,
    reunification: r.reunificationPct,
    livingWithRelative: r.livingWithRelativePct,
    adoption: r.adoptionPct,
    emancipation: r.emancipationPct,
    guardianship: r.guardianshipPct,
    other: r.otherPct,
    medianMonths: r.medianMonths,
  }));
}

export function dualAxisSeries(focus: MixFocusId) {
  return ANNUAL_EXITS.map((r) => ({
    fy: r.fy,
    label: r.label,
    mixSharePct: mixShareFor(r, focus),
    medianMonths: r.medianMonths,
    medianConfidence: r.medianConfidence,
    exits: r.exits,
  }));
}

export function scatterExitVsMedian(focus: MixFocusId) {
  return ANNUAL_EXITS.map((r) => ({
    fy: r.fy,
    label: r.label,
    x: r.medianMonths,
    y: mixShareFor(r, focus),
    exits: r.exits,
    regime: r.reportingRegime,
  }));
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtMonths(n: number, digits = 1): string {
  return `${n.toFixed(digits)} mo`;
}

export function fmtInt(n: number): string {
  return n.toLocaleString("en-US");
}

/** Smoke / QA markers surfaced in the dashboard UI */
export const VIZ_MARKERS = [
  "Exit mix vs median months",
  "Median exit stay 15.5→17.5 months (FY19–FY22)",
  "Stacked discharge-reason shares",
  "Mix share vs median scatter",
  "FY2023 time-in-care buckets",
  "Permanency pace by exit type",
] as const;
