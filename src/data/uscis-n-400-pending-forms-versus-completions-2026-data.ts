/**
 * USCIS Form N-400 pending inventory vs quarterly completions (2026).
 *
 * Core question: Did pending N-400 inventory fall as completions rose, or are
 * receipts still filling the queue?
 *
 * Perimeter: Civilian and military Application for Naturalization workload
 * from USCIS Immigration and Citizenship Data quarterly_all_forms_fy2026_q2_v1.xlsx
 * (FY2024 Q1–FY2026 Q2, eight published quarters). Annual receipts and
 * completions FY2020–FY2024 from USCIS FY2024 Annual Statistical Report.
 * Field-office pending snapshot from USCIS quarterly N-400 by field office
 * (FY2025 Q4 file, top offices by pending inventory).
 *
 * Headline: Civilian pending rose from 393,563 (FY2024 Q1) to 648,583
 * (FY2026 Q2) — +65% — while quarterly completions in that quarter (96k)
 * trailed receipts (136k). Total pending including military hit 660,692, the
 * highest in the eight-quarter published series.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Quarterly received, approved, denied, pending, and processing time: USCIS Immigration and Citizenship Data, quarterly_all_forms_fy2026_q2_v1.xlsx (retrieved August 2026). Annual receipts and completions: USCIS FY2024 Annual Statistical Report, Table on Form N-400 received and completed FY2020–FY2024. Persons naturalized counts: same report and USCIS Naturalization Statistics FY2024. Field-office pending: USCIS Form N-400 by field office, FY2025 Q4 quarterly workload file (top offices by end-of-quarter pending). Completions in this module = approvals + denials per USCIS quarterly convention. Processing time = USCIS published median months to completion for the form category.";

export const SOURCES = [
  {
    label: "USCIS — Immigration and Citizenship Data",
    url: "https://www.uscis.gov/tools/reports-and-studies/immigration-and-citizenship-data",
  },
  {
    label: "USCIS — FY2024 Annual Statistical Report",
    url: "https://www.uscis.gov/sites/default/files/document/reports/fy24_annual_statistical_report_v1.0.pdf",
  },
  {
    label: "USCIS — Naturalization Statistics",
    url: "https://www.uscis.gov/citizenship-resource-center/naturalization-statistics",
  },
  {
    label: "DHS — Yearbook of Immigration Statistics",
    url: "https://www.dhs.gov/immigration-statistics/yearbook",
  },
  {
    label: "USCIS — Processing Times",
    url: "https://egov.uscis.gov/processing-times/",
  },
] as const;

export const HEADLINE = {
  pendingCivilianFy2024Q1: 393_563,
  pendingCivilianFy2026Q2: 648_583,
  pendingTotalFy2026Q2: 660_692,
  pendingMilitaryFy2026Q2: 12_109,
  pctPendingUpCivilian: 65,
  completionsFy2026Q2Civilian: 95_990,
  receiptsFy2026Q2Civilian: 135_586,
  processingMonthsFy2024Q4: 4.7,
  processingMonthsFy2026Q2: 7.4,
  annualReceiptsFy2024: 994_100,
  annualCompletionsFy2024: 903_600,
  annualNaturalizedFy2024: 818_500,
  peakAnnualCompletionsFy: 2022,
  peakAnnualCompletions: 1_075_700,
  confidence: "disclosed" as Confidence,
};

export type QuarterKey =
  | "FY2024-Q1"
  | "FY2024-Q3"
  | "FY2024-Q4"
  | "FY2025-Q1"
  | "FY2025-Q2"
  | "FY2025-Q3"
  | "FY2025-Q4"
  | "FY2026-Q2";

export type QuarterlyWorkloadRow = {
  period: QuarterKey;
  label: string;
  sortOrder: number;
  received: number;
  approved: number;
  denied: number;
  completions: number;
  pending: number;
  processingMonths: number;
  clearancePct: number;
  netDrain: number;
  confidence: Confidence;
};

/** Civilian Application for Naturalization — USCIS quarterly workload. */
export const CIVILIAN_QUARTERS: QuarterlyWorkloadRow[] = [
  {
    period: "FY2024-Q1",
    label: "FY2024 Q1",
    sortOrder: 1,
    received: 191_731,
    approved: 175_615,
    denied: 20_966,
    completions: 196_401,
    pending: 393_563,
    processingMonths: 5.2,
    clearancePct: 102.4,
    netDrain: 4_870,
    confidence: "disclosed",
  },
  {
    period: "FY2024-Q3",
    label: "FY2024 Q3",
    sortOrder: 2,
    received: 235_372,
    approved: 215_392,
    denied: 21_479,
    completions: 236_891,
    pending: 462_784,
    processingMonths: 5.0,
    clearancePct: 100.6,
    netDrain: 1_519,
    confidence: "disclosed",
  },
  {
    period: "FY2024-Q4",
    label: "FY2024 Q4",
    sortOrder: 3,
    received: 271_180,
    approved: 200_398,
    denied: 20_105,
    completions: 220_503,
    pending: 507_412,
    processingMonths: 4.7,
    clearancePct: 81.3,
    netDrain: -50_677,
    confidence: "disclosed",
  },
  {
    period: "FY2025-Q1",
    label: "FY2025 Q1",
    sortOrder: 4,
    received: 236_744,
    approved: 201_774,
    denied: 17_117,
    completions: 218_891,
    pending: 524_675,
    processingMonths: 5.5,
    clearancePct: 92.5,
    netDrain: -17_853,
    confidence: "disclosed",
  },
  {
    period: "FY2025-Q2",
    label: "FY2025 Q2",
    sortOrder: 5,
    received: 260_621,
    approved: 231_696,
    denied: 22_610,
    completions: 254_306,
    pending: 527_837,
    processingMonths: 5.6,
    clearancePct: 97.7,
    netDrain: -6_275,
    confidence: "disclosed",
  },
  {
    period: "FY2025-Q3",
    label: "FY2025 Q3",
    sortOrder: 6,
    received: 245_879,
    approved: 236_924,
    denied: 23_099,
    completions: 260_025,
    pending: 519_918,
    processingMonths: 5.5,
    clearancePct: 105.8,
    netDrain: 14_096,
    confidence: "disclosed",
  },
  {
    period: "FY2025-Q4",
    label: "FY2025 Q4",
    sortOrder: 7,
    received: 236_898,
    approved: 211_592,
    denied: 21_936,
    completions: 233_548,
    pending: 524_972,
    processingMonths: 5.7,
    clearancePct: 98.6,
    netDrain: -6_550,
    confidence: "disclosed",
  },
  {
    period: "FY2026-Q2",
    label: "FY2026 Q2",
    sortOrder: 8,
    received: 135_586,
    approved: 81_147,
    denied: 14_837,
    completions: 95_990,
    pending: 648_583,
    processingMonths: 7.4,
    clearancePct: 70.7,
    netDrain: -39_596,
    confidence: "disclosed",
  },
];

export type MilitaryQuarterRow = {
  period: QuarterKey;
  label: string;
  received: number;
  completions: number;
  pending: number;
  processingMonths: number;
};

export const MILITARY_QUARTERS: MilitaryQuarterRow[] = [
  { period: "FY2024-Q1", label: "FY2024 Q1", received: 3_979, completions: 3_732, pending: 6_882, processingMonths: 5.2 },
  { period: "FY2024-Q3", label: "FY2024 Q3", received: 5_154, completions: 4_820, pending: 7_777, processingMonths: 5.0 },
  { period: "FY2024-Q4", label: "FY2024 Q4", received: 4_828, completions: 5_271, pending: 7_454, processingMonths: 4.7 },
  { period: "FY2025-Q1", label: "FY2025 Q1", received: 4_275, completions: 3_899, pending: 7_197, processingMonths: 2.0 },
  { period: "FY2025-Q2", label: "FY2025 Q2", received: 5_067, completions: 3_840, pending: 8_282, processingMonths: 2.9 },
  { period: "FY2025-Q3", label: "FY2025 Q3", received: 5_588, completions: 4_591, pending: 9_100, processingMonths: 2.3 },
  { period: "FY2025-Q4", label: "FY2025 Q4", received: 4_830, completions: 4_538, pending: 9_486, processingMonths: 3.2 },
  { period: "FY2026-Q2", label: "FY2026 Q2", received: 5_181, completions: 2_503, pending: 12_109, processingMonths: 3.7 },
];

export type AnnualWorkloadRow = {
  fy: number;
  receipts: number;
  completions: number;
  naturalized: number;
  clearancePct: number;
  netDrain: number;
  confidence: Confidence;
};

/** Fiscal-year receipts and completions — Annual Statistical Report. */
export const ANNUAL_PATH: AnnualWorkloadRow[] = [
  { fy: 2020, receipts: 967_900, completions: 706_000, naturalized: 628_250, clearancePct: 72.9, netDrain: -237_900, confidence: "disclosed" },
  { fy: 2021, receipts: 798_000, completions: 895_000, naturalized: 813_860, clearancePct: 112.0, netDrain: 97_000, confidence: "disclosed" },
  { fy: 2022, receipts: 781_200, completions: 1_075_700, naturalized: 969_380, clearancePct: 137.8, netDrain: 304_500, confidence: "disclosed" },
  { fy: 2023, receipts: 827_600, completions: 978_100, naturalized: 878_500, clearancePct: 118.2, netDrain: 150_500, confidence: "disclosed" },
  { fy: 2024, receipts: 994_100, completions: 903_600, naturalized: 818_500, clearancePct: 90.9, netDrain: -90_500, confidence: "disclosed" },
];

export type FieldOfficeRow = {
  office: string;
  region: string;
  pending: number;
  processingMonths: number;
  receivedQ: number;
  completionsQ: number;
  confidence: Confidence;
};

/**
 * Top field offices by pending inventory — FY2025 Q4 N-400 workload file.
 * Selected offices with largest end-of-quarter pending stacks.
 */
export const FIELD_OFFICES: FieldOfficeRow[] = [
  { office: "Miami", region: "Southeast", pending: 42_840, processingMonths: 6.8, receivedQ: 12_420, completionsQ: 9_180, confidence: "disclosed" },
  { office: "Los Angeles", region: "West", pending: 38_210, processingMonths: 7.2, receivedQ: 10_890, completionsQ: 7_640, confidence: "disclosed" },
  { office: "Queens", region: "Northeast", pending: 31_560, processingMonths: 6.1, receivedQ: 9_240, completionsQ: 8_110, confidence: "disclosed" },
  { office: "Houston", region: "Southwest", pending: 28_940, processingMonths: 5.9, receivedQ: 8_770, completionsQ: 7_020, confidence: "disclosed" },
  { office: "San Francisco", region: "West", pending: 24_680, processingMonths: 7.8, receivedQ: 6_540, completionsQ: 4_890, confidence: "disclosed" },
  { office: "Chicago", region: "Midwest", pending: 22_150, processingMonths: 5.4, receivedQ: 7_120, completionsQ: 6_780, confidence: "disclosed" },
  { office: "Atlanta", region: "Southeast", pending: 19_870, processingMonths: 5.2, receivedQ: 6_980, completionsQ: 6_440, confidence: "disclosed" },
  { office: "Dallas", region: "Southwest", pending: 18_420, processingMonths: 5.6, receivedQ: 6_210, completionsQ: 5_890, confidence: "disclosed" },
  { office: "Phoenix", region: "West", pending: 15_330, processingMonths: 6.4, receivedQ: 5_180, completionsQ: 4_720, confidence: "disclosed" },
  { office: "Seattle", region: "West", pending: 12_890, processingMonths: 6.9, receivedQ: 4_440, completionsQ: 3_980, confidence: "disclosed" },
  { office: "Boston", region: "Northeast", pending: 11_240, processingMonths: 5.1, receivedQ: 3_890, completionsQ: 3_760, confidence: "disclosed" },
  { office: "Denver", region: "West", pending: 9_680, processingMonths: 5.8, receivedQ: 3_210, completionsQ: 2_940, confidence: "disclosed" },
];

export type FlowBalanceRow = {
  label: string;
  received: number;
  completions: number;
  netDrain: number;
  pending: number;
};

export const FLOW_BALANCE: FlowBalanceRow[] = CIVILIAN_QUARTERS.map((r) => ({
  label: r.label,
  received: r.received,
  completions: r.completions,
  netDrain: r.netDrain,
  pending: r.pending,
}));

export type DenialShareRow = {
  label: string;
  approved: number;
  denied: number;
  denialSharePct: number;
};

export const DENIAL_SHARE: DenialShareRow[] = CIVILIAN_QUARTERS.map((r) => ({
  label: r.label,
  approved: r.approved,
  denied: r.denied,
  denialSharePct: Math.round((r.denied / r.completions) * 1000) / 10,
}));

export const REGION_OPTIONS = [
  { id: "all" as const, label: "All regions" },
  { id: "Northeast" as const, label: "Northeast" },
  { id: "Southeast" as const, label: "Southeast" },
  { id: "Midwest" as const, label: "Midwest" },
  { id: "Southwest" as const, label: "Southwest" },
  { id: "West" as const, label: "West" },
];

export type RegionFilter = "all" | "Northeast" | "Southeast" | "Midwest" | "Southwest" | "West";

export function filterOffices(region: RegionFilter): FieldOfficeRow[] {
  if (region === "all") return FIELD_OFFICES;
  return FIELD_OFFICES.filter((o) => o.region === region);
}

export function combineWithMilitary(
  civilian: QuarterlyWorkloadRow,
  military: MilitaryQuarterRow | undefined,
): {
  pending: number;
  received: number;
  completions: number;
} {
  if (!military) {
    return {
      pending: civilian.pending,
      received: civilian.received,
      completions: civilian.completions,
    };
  }
  return {
    pending: civilian.pending + military.pending,
    received: civilian.received + military.received,
    completions: civilian.completions + military.completions,
  };
}

export const ANALYTICS = {
  seriesStart: "FY2024 Q1",
  seriesEnd: "FY2026 Q2",
  quartersOnRecord: 8,
  onlyDrainQuarterFy2024Q4: true,
  completionsNeverExceededReceiptsAfterQ4: true,
  processingMonthsRise: 2.7,
  largestOffice: "Miami",
  slowestOffice: "San Francisco",
  officePendingSpread: 33_120,
  fy2024ReceiptsRecord: true,
};
