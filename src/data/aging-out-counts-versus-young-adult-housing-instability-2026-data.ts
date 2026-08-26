/**
 * Aging-out (emancipation) exit counts versus NYTD young-adult housing & work outcomes.
 * Core question: How many youth exit without permanency each year, and do NYTD
 * outcomes show housing or employment gaps after exit?
 *
 * AFCARS anchors: Reports #27–#30 (FY2019–FY2022); FY2023/FY2024 AFCARS Dashboard
 * printables. NYTD anchors: Data Brief #8 (Cohort 3, ages 17/19/21 in FFY 2017/2019/2021).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Emancipation exit counts and shares follow Children's Bureau AFCARS Reports #27–#30 (FY2019–FY2022 preliminary estimates) and the FY2023 / FY2024 AFCARS Dashboard printables (No. 31 / No. 32). FY2023 detailed exit tables used AFCARS 2020 rules and excluded WA/WY at the May 2025 snapshot; FY2024 dashboard totals reflect later submissions. NYTD housing, employment, education, and connection rates are weighted national estimates from NYTD Data Brief #8 (Cohort 3). Homelessness at age 17 is lifetime; at ages 19 and 21 it is past-two-years. Emancipation is an AFCARS discharge reason (exit without permanency), not the same population as the NYTD survey cohort.";

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
    label: "Children's Bureau — FY2023 AFCARS Dashboard printable",
    url: "https://acf.gov/sites/default/files/documents/cb/2023-afcars-dashboard-printable.pdf",
  },
  {
    label: "Children's Bureau — FY2024 AFCARS Dashboard printable",
    url: "https://acf.gov/sites/default/files/documents/cb/2024-afcars-dashboard-printable.pdf",
  },
  {
    label: "Children's Bureau — NYTD Data Brief #8 (Cohort 3)",
    url: "https://acf.gov/sites/default/files/documents/cb/national-youth-transition-database-data-brief-8.pdf",
  },
  {
    label: "ACF — NYTD data & statistics hub",
    url: "https://acf.gov/cb/data-research/data-and-statistics-nytd",
  },
] as const;

/** Headline story beats */
export const HEADLINE = {
  emancipationFy2019: 20_445,
  emancipationFy2024: 15_379,
  emancipationDropFy19To24: 5_066,
  emancipationDropPctApprox: 25,
  emancipationShareFy2024Pct: 9,
  totalExitsFy2024: 176_730,
  nytdHomelessAge21Past2YrsPct: 26,
  nytdHomelessBy21AnyWavePct: 44,
  nytdEmployedAge21Pct: 55,
  nytdHsGedAge21Pct: 75,
  nytdAdultConnectionAge21Pct: 87,
  nytdPublicAssistNotInCareAge21Pct: 31,
  nytdNotInCareAge21Pct: 79,
  cohort3EligibleAge17: 24_474,
  cohort3RespondedAge21: 7_780,
} as const;

export type EmancipationYearRow = {
  fy: number;
  label: string;
  exitsTotal: number;
  emancipationN: number;
  emancipationPct: number;
  confidence: Confidence;
  note?: string;
};

/** National emancipation discharges and total exits, FY2019–FY2024 */
export const EMANCIPATION_SERIES: EmancipationYearRow[] = [
  {
    fy: 2019,
    label: "FY2019",
    exitsTotal: 248_669,
    emancipationN: 20_445,
    emancipationPct: 8,
    confidence: "disclosed",
  },
  {
    fy: 2020,
    label: "FY2020",
    exitsTotal: 223_918,
    emancipationN: 20_010,
    emancipationPct: 9,
    confidence: "disclosed",
    note: "Glance exits from later dashboard; emancipation N from Report #28 lineage.",
  },
  {
    fy: 2021,
    label: "FY2021",
    exitsTotal: 214_542,
    emancipationN: 19_130,
    emancipationPct: 9,
    confidence: "disclosed",
  },
  {
    fy: 2022,
    label: "FY2022",
    exitsTotal: 201_372,
    emancipationN: 18_538,
    emancipationPct: 9,
    confidence: "disclosed",
  },
  {
    fy: 2023,
    label: "FY2023",
    exitsTotal: 184_095,
    emancipationN: 15_590,
    emancipationPct: 8,
    confidence: "disclosed",
    note: "FY2023 dashboard (May 2025 snapshot); WA/WY excluded from some detail tables.",
  },
  {
    fy: 2024,
    label: "FY2024",
    exitsTotal: 176_730,
    emancipationN: 15_379,
    emancipationPct: 9,
    confidence: "disclosed",
  },
];

export type NytdAge = 17 | 19 | 21;

export type NytdOutcomeRow = {
  age: NytdAge;
  label: string;
  nRespondents: number;
  employedFullOrPartPct: number;
  employmentRelatedAnyPct: number;
  educationAidPct: number;
  publicAssistanceNotInCarePct: number | null;
  hsDiplomaOrGedPct: number;
  enrolledAttendingPct: number;
  adultConnectionPct: number;
  homelessPct: number;
  homelessWindow: "lifetime" | "past2yrs";
  notInCarePct: number;
  confidence: Confidence;
};

/** NYTD Cohort 3 weighted outcomes (Data Brief #8) */
export const NYTD_OUTCOMES: NytdOutcomeRow[] = [
  {
    age: 17,
    label: "Age 17",
    nRespondents: 16_254,
    employedFullOrPartPct: 18,
    employmentRelatedAnyPct: 33,
    educationAidPct: 2,
    publicAssistanceNotInCarePct: null,
    hsDiplomaOrGedPct: 5,
    enrolledAttendingPct: 93,
    adultConnectionPct: 93,
    homelessPct: 21,
    homelessWindow: "lifetime",
    notInCarePct: 0,
    confidence: "disclosed",
  },
  {
    age: 19,
    label: "Age 19",
    nRespondents: 8_912,
    employedFullOrPartPct: 45,
    employmentRelatedAnyPct: 58,
    educationAidPct: 20,
    publicAssistanceNotInCarePct: 23,
    hsDiplomaOrGedPct: 59,
    enrolledAttendingPct: 48,
    adultConnectionPct: 89,
    homelessPct: 21,
    homelessWindow: "past2yrs",
    notInCarePct: 61,
    confidence: "disclosed",
  },
  {
    age: 21,
    label: "Age 21",
    nRespondents: 7_780,
    employedFullOrPartPct: 55,
    employmentRelatedAnyPct: 65,
    educationAidPct: 17,
    publicAssistanceNotInCarePct: 31,
    hsDiplomaOrGedPct: 75,
    enrolledAttendingPct: 26,
    adultConnectionPct: 87,
    homelessPct: 26,
    homelessWindow: "past2yrs",
    notInCarePct: 79,
    confidence: "disclosed",
  },
];

/** Cumulative homelessness among youth who completed all three waves */
export const NYTD_CUMULATIVE_HOMELESS = {
  completedAllWavesN: 6_683,
  anyHomelessBy21Pct: 44,
  confidence: "disclosed" as Confidence,
};

export type GapMetricId =
  | "employed"
  | "employmentRelated"
  | "hsGed"
  | "adultConnection"
  | "homeless"
  | "publicAssist";

export const GAP_METRIC_OPTIONS: { id: GapMetricId; label: string }[] = [
  { id: "employed", label: "Employed F/T or P/T" },
  { id: "employmentRelated", label: "Any employment-related" },
  { id: "hsGed", label: "HS diploma / GED+" },
  { id: "adultConnection", label: "Adult connection" },
  { id: "homeless", label: "Homeless experience" },
  { id: "publicAssist", label: "Public assistance (not in care)" },
];

export function nytdMetricPct(row: NytdOutcomeRow, metric: GapMetricId): number | null {
  switch (metric) {
    case "employed":
      return row.employedFullOrPartPct;
    case "employmentRelated":
      return row.employmentRelatedAnyPct;
    case "hsGed":
      return row.hsDiplomaOrGedPct;
    case "adultConnection":
      return row.adultConnectionPct;
    case "homeless":
      return row.homelessPct;
    case "publicAssist":
      return row.publicAssistanceNotInCarePct;
  }
}

/** Paired housing vs work series for dual-line panel */
export function housingVsWorkSeries() {
  return NYTD_OUTCOMES.map((r) => ({
    age: r.age,
    label: r.label,
    employed: r.employedFullOrPartPct,
    homeless: r.homelessPct,
    adultConnection: r.adultConnectionPct,
    hsGed: r.hsDiplomaOrGedPct,
    notInCare: r.notInCarePct,
  }));
}

/** Radar-friendly outcome profile at a selected age */
export function outcomeProfile(age: NytdAge) {
  const row = NYTD_OUTCOMES.find((r) => r.age === age)!;
  return [
    { metric: "Employed", value: row.employedFullOrPartPct },
    { metric: "Any work path", value: row.employmentRelatedAnyPct },
    { metric: "HS/GED+", value: row.hsDiplomaOrGedPct },
    { metric: "Adult support", value: row.adultConnectionPct },
    { metric: "Homeless*", value: row.homelessPct },
    {
      metric: "Public assist†",
      value: row.publicAssistanceNotInCarePct ?? 0,
    },
  ];
}

/**
 * Rough exposure index: recent-year emancipation count × age-21 past-2yr homeless rate.
 * Illustrative only — AFCARS exits ≠ NYTD cohort.
 */
export function housingRiskExposureSeries() {
  const rate = HEADLINE.nytdHomelessAge21Past2YrsPct / 100;
  return EMANCIPATION_SERIES.map((r) => ({
    fy: r.fy,
    label: r.label,
    emancipationN: r.emancipationN,
    illustrativeAtRisk: Math.round(r.emancipationN * rate),
    confidence: "estimated" as Confidence,
  }));
}

export const VIZ_MARKERS = {
  root: "aging-out-housing-2026",
  emancipationPanel: "emancipation-volume-panel",
  housingWorkPanel: "housing-vs-work-panel",
  profilePanel: "nytd-profile-panel",
  exposurePanel: "housing-exposure-panel",
  gapTable: "nytd-gap-table",
} as const;

export function fmtInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}
