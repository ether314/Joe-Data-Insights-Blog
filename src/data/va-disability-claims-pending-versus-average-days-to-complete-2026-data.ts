/**
 * VA disability rating claims: pending inventory vs average days to complete.
 * Core question: How many rating claims remain pending, and did average days
 * to complete fall after the PACT Act surge?
 *
 * Anchors: VBA Monday Morning Workload Reports (MMWR) Rating Bundle —
 * USA All Missions Total; Transformation national inventory; VA press on
 * FY2024–FY2025 completions; VA OIG backlog statement (June 2023).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Pending inventory, backlog (>125 days), average days pending (ADP), and average days to complete (ADC) are taken from VBA Monday Morning Workload Report workbooks — Rating Bundle, Station of Jurisdiction, USA – All Missions Total. End-product mix uses the Transformation national view. FY completion totals follow VA press releases. Pre-PACT context cites VA OIG’s June 2023 backlog statement. Early-month ADC MTD can be noisy when few claims have completed in the month; prefer ADC FYTD for fiscal-year pace and mid/late-month ADC MTD for point-in-time speed.";

export const SOURCES = [
  {
    label: "VBA — Detailed Claims Data (MMWR hub)",
    url: "https://www.benefits.va.gov/reports/detailed_claims_data.asp",
  },
  {
    label: "VBA — MMWR walkthrough (metric definitions)",
    url: "https://benefits.va.gov/REPORTS/mmwr/mmwr-walkthru-sep2023-0921-mlc.pdf",
  },
  {
    label: "VA News — FY2025 completions & backlog reduction (Nov 18, 2025)",
    url: "https://news.va.gov/press-room/va-reduces-backlog-of-veterans-waiting-for-va-benefits-by-57/",
  },
  {
    label: "VA News — Secretary press conference (Nov 29, 2023)",
    url: "https://news.va.gov/press-room/secva-press-conference-11-29-2023/",
  },
  {
    label: "VA OIG — Compensation and Pension Benefits Claims Backlog (Jun 2023)",
    url: "https://www.vaoig.gov/sites/default/files/reports/2023-06/VAOIG-23-01362-130.pdf",
  },
  {
    label: "VA — Annual Benefits Report hub",
    url: "https://www.benefits.va.gov/REPORTS/abr/",
  },
] as const;

/** Headline beats for cards / excerpt */
export const HEADLINE = {
  peakPending: 1_098_487,
  peakPendingDate: "2023-10-07",
  peakBacklog: 417_855,
  peakBacklogDate: "2024-01-06",
  latestPending: 632_774,
  latestBacklog: 71_364,
  latestDate: "2026-08-22",
  latestAdcFytd: 76.21,
  latestAdcMtd: 68.62,
  latestAdp: 62.91,
  pendingDropFromPeakPct: 42.4,
  backlogDropFromPeakPct: 82.9,
  fy2024CompletionsM: 2.49,
  fy2025Completions: 3_001_734,
  prePactAdcJan2023Fytd: 129.87,
  peakAdcMtd: 158.58,
  peakAdcMtdDate: "2024-01-06",
} as const;

export type SnapshotRow = {
  date: string;
  label: string;
  pending: number;
  backlog: number;
  backlogSharePct: number;
  adp: number;
  adcMtd: number;
  adcFytd: number;
  completedMtd: number;
  completedFytd: number;
  phase: "pre-surge" | "surge" | "recovery" | "post-recovery";
  confidence: Confidence;
  note?: string;
};

/**
 * Rating Bundle USA – All Missions Total from published MMWR workbooks.
 * ADC MTD / FYTD are VBA’s published averages for claims completed in-month / FYTD.
 */
export const SNAPSHOTS: SnapshotRow[] = [
  {
    date: "2023-01-07",
    label: "Jan 2023",
    pending: 709_131,
    backlog: 200_456,
    backlogSharePct: 28.3,
    adp: 109.44,
    adcMtd: 140.8,
    adcFytd: 129.87,
    completedMtd: 25_007,
    completedFytd: 451_788,
    phase: "pre-surge",
    confidence: "disclosed",
    note: "PACT Act claims processing ramping; inventory already elevated vs pre-COVID norms.",
  },
  {
    date: "2023-09-30",
    label: "Sep 2023",
    pending: 1_091_853,
    backlog: 303_307,
    backlogSharePct: 27.8,
    adp: 103.31,
    adcMtd: 133.18,
    adcFytd: 130.41,
    completedMtd: 175_601,
    completedFytd: 1_981_854,
    phase: "surge",
    confidence: "disclosed",
    note: "Inventory near million+ as PACT Act filings surged into FY2023 close.",
  },
  {
    date: "2023-10-07",
    label: "Oct 7 2023",
    pending: 1_098_487,
    backlog: 306_747,
    backlogSharePct: 27.9,
    adp: 104.38,
    adcMtd: 140.15,
    adcFytd: 140.15,
    completedMtd: 41_552,
    completedFytd: 41_552,
    phase: "surge",
    confidence: "disclosed",
    note: "Series peak for pending rating-bundle inventory in this desk cut.",
  },
  {
    date: "2023-10-28",
    label: "Oct 28 2023",
    pending: 1_094_619,
    backlog: 297_534,
    backlogSharePct: 27.2,
    adp: 107.74,
    adcMtd: 151.39,
    adcFytd: 151.39,
    completedMtd: 169_911,
    completedFytd: 169_911,
    phase: "surge",
    confidence: "disclosed",
  },
  {
    date: "2023-11-25",
    label: "Nov 2023",
    pending: 1_081_910,
    backlog: 313_028,
    backlogSharePct: 28.9,
    adp: 114.39,
    adcMtd: 146.6,
    adcFytd: 148.62,
    completedMtd: 149_615,
    completedFytd: 337_601,
    phase: "surge",
    confidence: "disclosed",
  },
  {
    date: "2023-12-23",
    label: "Dec 2023",
    pending: 1_052_504,
    backlog: 391_445,
    backlogSharePct: 37.2,
    adp: 118.28,
    adcMtd: 148.42,
    adcFytd: 148.97,
    completedMtd: 156_543,
    completedFytd: 532_470,
    phase: "surge",
    confidence: "disclosed",
    note: "Inventory easing while backlog share jumped as claims aged past 125 days.",
  },
  {
    date: "2024-01-06",
    label: "Jan 2024",
    pending: 1_048_765,
    backlog: 417_855,
    backlogSharePct: 39.8,
    adp: 122.44,
    adcMtd: 158.58,
    adcFytd: 149.85,
    completedMtd: 37_701,
    completedFytd: 602_548,
    phase: "surge",
    confidence: "disclosed",
    note: "Backlog peak in this series; ADC MTD early-month (thin completion base).",
  },
  {
    date: "2024-07-06",
    label: "Jul 2024",
    pending: 973_183,
    backlog: 274_151,
    backlogSharePct: 28.2,
    adp: 111.34,
    adcMtd: 147.01,
    adcFytd: 152.9,
    completedMtd: 39_038,
    completedFytd: 1_891_127,
    phase: "recovery",
    confidence: "disclosed",
  },
  {
    date: "2024-12-28",
    label: "Dec 2024",
    pending: 950_453,
    backlog: 256_486,
    backlogSharePct: 27.0,
    adp: 104.43,
    adcMtd: 139.83,
    adcFytd: 139.89,
    completedMtd: 188_584,
    completedFytd: 627_576,
    phase: "recovery",
    confidence: "disclosed",
    note: "FYTD completions reset each Oct 1; Dec FYTD is early FY2025.",
  },
  {
    date: "2025-01-18",
    label: "Jan 2025",
    pending: 956_215,
    backlog: 252_406,
    backlogSharePct: 26.4,
    adp: 104.5,
    adcMtd: 148.77,
    adcFytd: 141.5,
    completedMtd: 114_133,
    completedFytd: 759_030,
    phase: "recovery",
    confidence: "disclosed",
  },
  {
    date: "2025-07-05",
    label: "Jul 2025",
    pending: 741_577,
    backlog: 184_186,
    backlogSharePct: 24.8,
    adp: 95.51,
    adcMtd: 100.4,
    adcFytd: 130.43,
    completedMtd: 42_791,
    completedFytd: 2_188_062,
    phase: "recovery",
    confidence: "disclosed",
  },
  {
    date: "2025-09-27",
    label: "Sep 2025",
    pending: 634_240,
    backlog: 134_048,
    backlogSharePct: 21.1,
    adp: 86.4,
    adcMtd: 88.27,
    adcFytd: 120.95,
    completedMtd: 250_677,
    completedFytd: 2_974_067,
    phase: "recovery",
    confidence: "disclosed",
    note: "Near FY2025 close; VA later reported 3.00M FY completions.",
  },
  {
    date: "2026-01-03",
    label: "Jan 2026",
    pending: 576_253,
    backlog: 105_830,
    backlogSharePct: 18.4,
    adp: 84.07,
    adcMtd: 91.47,
    adcFytd: 83.6,
    completedMtd: 9_621,
    completedFytd: 759_320,
    phase: "post-recovery",
    confidence: "disclosed",
  },
  {
    date: "2026-08-01",
    label: "Aug 1 2026",
    pending: 611_453,
    backlog: 70_529,
    backlogSharePct: 11.5,
    adp: 63.88,
    adcMtd: 47.69,
    adcFytd: 76.75,
    completedMtd: 239,
    completedFytd: 2_581_807,
    phase: "post-recovery",
    confidence: "disclosed",
    note: "Very early August ADC MTD (thin base); FYTD ADC is the stabler speed read.",
  },
  {
    date: "2026-08-22",
    label: "Aug 22 2026",
    pending: 632_774,
    backlog: 71_364,
    backlogSharePct: 11.3,
    adp: 62.91,
    adcMtd: 68.62,
    adcFytd: 76.21,
    completedMtd: 186_609,
    completedFytd: 2_768_177,
    phase: "post-recovery",
    confidence: "disclosed",
    note: "Latest workbook in this cut; inventory up modestly from January trough while backlog stayed near decade-low share.",
  },
];

export type MixSlice = {
  id: string;
  label: string;
  pending: number;
  backlog: number;
  shareOfPendingPct: number;
};

/** Transformation national mix — Aug 22, 2026 Rating Bundle */
export const MIX_AUG_2026: MixSlice[] = [
  {
    id: "original",
    label: "Original entitlement",
    pending: 155_865,
    backlog: 31_834,
    shareOfPendingPct: 24.6,
  },
  {
    id: "supplemental",
    label: "Supplemental entitlement",
    pending: 471_856,
    backlog: 36_620,
    shareOfPendingPct: 74.6,
  },
  {
    id: "diary-other",
    label: "Other / diary (EP 335)",
    pending: 5_053,
    backlog: 2_910,
    shareOfPendingPct: 0.8,
  },
];

/** Peak mix — Oct 28, 2023 Transformation totals */
export const MIX_OCT_2023: MixSlice[] = [
  {
    id: "original",
    label: "Original entitlement",
    pending: 272_476,
    backlog: 86_512,
    shareOfPendingPct: 24.9,
  },
  {
    id: "supplemental",
    label: "Supplemental entitlement",
    pending: 813_057,
    backlog: 203_683,
    shareOfPendingPct: 74.3,
  },
  {
    id: "diary-other",
    label: "Other / diary (EP 335)",
    pending: 9_086,
    backlog: 7_339,
    shareOfPendingPct: 0.8,
  },
];

export type EpRow = {
  ep: string;
  shortLabel: string;
  pendingPeak: number;
  backlogPeak: number;
  backlogSharePeakPct: number;
  pendingLatest: number;
  backlogLatest: number;
  backlogShareLatestPct: number;
};

/**
 * Major end products from Transformation national view:
 * peak = Oct 28, 2023; latest = Aug 22, 2026.
 */
export const EP_BREAKDOWN: EpRow[] = [
  {
    ep: "020",
    shortLabel: "EP 020 increases",
    pendingPeak: 526_939,
    backlogPeak: 124_156,
    backlogSharePeakPct: 23.6,
    pendingLatest: 268_783,
    backlogLatest: 21_934,
    backlogShareLatestPct: 8.2,
  },
  {
    ep: "040",
    shortLabel: "EP 040 AMA supplemental",
    pendingPeak: 268_908,
    backlogPeak: 77_388,
    backlogSharePeakPct: 28.8,
    pendingLatest: 196_725,
    backlogLatest: 14_528,
    backlogShareLatestPct: 7.4,
  },
  {
    ep: "110",
    shortLabel: "EP 110 originals ≤7 issues",
    pendingPeak: 152_410,
    backlogPeak: 42_706,
    backlogSharePeakPct: 28.0,
    pendingLatest: 86_777,
    backlogLatest: 15_089,
    backlogShareLatestPct: 17.4,
  },
  {
    ep: "010",
    shortLabel: "EP 010 originals ≥8 issues",
    pendingPeak: 86_630,
    backlogPeak: 33_174,
    backlogSharePeakPct: 38.3,
    pendingLatest: 58_464,
    backlogLatest: 14_995,
    backlogShareLatestPct: 25.6,
  },
  {
    ep: "140",
    shortLabel: "EP 140 survivors",
    pendingPeak: 22_599,
    backlogPeak: 8_117,
    backlogSharePeakPct: 35.9,
    pendingLatest: 8_818,
    backlogLatest: 1_697,
    backlogShareLatestPct: 19.2,
  },
  {
    ep: "180",
    shortLabel: "EP 180 pension originals",
    pendingPeak: 10_837,
    backlogPeak: 2_515,
    backlogSharePeakPct: 23.2,
    pendingLatest: 1_806,
    backlogLatest: 53,
    backlogShareLatestPct: 2.9,
  },
];

export type FyCompletionRow = {
  fy: number;
  label: string;
  completionsM: number;
  confidence: Confidence;
  note?: string;
};

export const FY_COMPLETIONS: FyCompletionRow[] = [
  {
    fy: 2023,
    label: "FY2023",
    completionsM: 1.9,
    confidence: "carried",
    note: "VA Secretary Nov 2023 remarks cited ~1.9M prior-year completions.",
  },
  {
    fy: 2024,
    label: "FY2024",
    completionsM: 2.49,
    confidence: "disclosed",
    note: "VA press: prior record broken by FY2025.",
  },
  {
    fy: 2025,
    label: "FY2025",
    completionsM: 3.001734,
    confidence: "disclosed",
    note: "VA press Nov 18, 2025: 3,001,734 compensation & pension claims.",
  },
];

export type PaceFocusId = "pending" | "backlog" | "adc" | "adp";

export const PACE_FOCUS_OPTIONS: { id: PaceFocusId; label: string }[] = [
  { id: "pending", label: "Pending inventory" },
  { id: "backlog", label: "Backlog >125d" },
  { id: "adc", label: "ADC (days)" },
  { id: "adp", label: "ADP (days)" },
];

export type WindowId = "all" | "surge" | "since2025";

export const WINDOW_OPTIONS: { id: WindowId; label: string }[] = [
  { id: "all", label: "Jan 2023 → Aug 2026" },
  { id: "surge", label: "Surge window" },
  { id: "since2025", label: "Since Jan 2025" },
];

export function filterSnapshots(window: WindowId): SnapshotRow[] {
  if (window === "surge") {
    return SNAPSHOTS.filter(
      (s) => s.date >= "2023-09-01" && s.date <= "2024-07-31",
    );
  }
  if (window === "since2025") {
    return SNAPSHOTS.filter((s) => s.date >= "2025-01-01");
  }
  return SNAPSHOTS;
}

export function dualAxisSeries(window: WindowId) {
  return filterSnapshots(window).map((s) => ({
    label: s.label,
    date: s.date,
    pendingK: Math.round(s.pending / 1000),
    backlogK: Math.round(s.backlog / 1000),
    adcMtd: Number(s.adcMtd.toFixed(1)),
    adcFytd: Number(s.adcFytd.toFixed(1)),
    adp: Number(s.adp.toFixed(1)),
    backlogSharePct: s.backlogSharePct,
  }));
}

export function scatterPendingVsAdc(window: WindowId) {
  return filterSnapshots(window).map((s) => ({
    label: s.label,
    pendingK: Math.round(s.pending / 1000),
    adc: Number(s.adcFytd.toFixed(1)),
    backlogSharePct: s.backlogSharePct,
    phase: s.phase,
  }));
}

export function mixCompareRows() {
  return ["original", "supplemental", "diary-other"].map((id) => {
    const a = MIX_OCT_2023.find((m) => m.id === id)!;
    const b = MIX_AUG_2026.find((m) => m.id === id)!;
    return {
      id,
      label: a.label,
      peakPendingK: Math.round(a.pending / 1000),
      latestPendingK: Math.round(b.pending / 1000),
      peakBacklogK: Math.round(a.backlog / 1000),
      latestBacklogK: Math.round(b.backlog / 1000),
    };
  });
}

export function fmtInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function fmtDays(n: number): string {
  return `${n.toFixed(1)} days`;
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export const VIZ_MARKERS = [
  "Pending vs days-to-complete",
  "Peak pending ~1.10M (Oct 2023)",
  "Peak backlog ~418k (Jan 2024)",
  "Aug 22 2026: 633k pending · 71k backlog · ADC FYTD 76d",
] as const;

export const PHASE_COLORS: Record<SnapshotRow["phase"], string> = {
  "pre-surge": "#64748b",
  surge: "#f43f5e",
  recovery: "#f59e0b",
  "post-recovery": "#0ea5e9",
};

export const MIX_COLORS: Record<string, string> = {
  original: "#38bdf8",
  supplemental: "#f59e0b",
  "diary-other": "#94a3b8",
};
