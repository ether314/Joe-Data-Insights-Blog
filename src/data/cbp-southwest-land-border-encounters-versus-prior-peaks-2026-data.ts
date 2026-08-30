/**
 * CBP southwest land-border encounters versus 2022–2023 peaks.
 * Core question: How do the latest monthly SW border encounter totals
 * compare with the 2022–2023 peak months?
 *
 * Primary comparable series: U.S. Border Patrol SW land-border encounters
 * (Title 8 apprehensions + Title 42 expulsions while active). Full CBP
 * encounters (USBP + OFO) are shown for peak-era context where published.
 *
 * Anchors: CBP Southwest Land Border Encounters; CBP Nationwide Encounters
 * FY2024–FY2026 tables; Pew Research Center compilation of CBP monthly USBP
 * figures; Johnston archive Table 1 (USBP+OFO) through mid-2024.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Monthly Border Patrol (USBP) southwest land-border encounters are taken from CBP nationwide / southwest land-border statistics and the Pew Research Center compilation of those CBP releases (through Dec 2025), with FY2026 months Oct 2025–Jul 2026 from CBP Nationwide Encounters (last modified Aug 14, 2026). Full CBP southwest land-border encounters (USBP + Office of Field Operations) for Oct 2021–Jun 2024 follow the Johnston archive Table 1 compilation of CBP demographic totals; Dec 2023 full-encounter peak is cross-checked against CBP’s Dec 2023 operational update (~302k). Encounters count events, not unique people; some individuals are encountered more than once. Title 42 expulsions ended May 11, 2023. Live CBP extracts remain subject to revision until fiscal-year close.";

export const SOURCES = [
  {
    label: "CBP — Southwest Land Border Encounters",
    url: "https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters",
  },
  {
    label: "CBP — Nationwide Encounters (FY2026 monthly)",
    url: "https://www.cbp.gov/newsroom/stats/nationwide-encounters",
  },
  {
    label: "CBP — Nationwide Encounters FY2024 archive",
    url: "https://www.cbp.gov/newsroom/stats/nationwide-encounters-fy2024",
  },
  {
    label: "CBP — December 2023 monthly operational update",
    url: "https://www.cbp.gov/newsroom/national-media-release/cbp-releases-december-2023-monthly-update",
  },
  {
    label: "Pew Research Center — SW border encounters (Feb 2026)",
    url: "https://www.pewresearch.org/short-reads/2026/02/02/migrant-encounters-at-the-us-mexico-border-are-at-their-lowest-level-in-more-than-50-years/",
  },
  {
    label: "Johnston archive — monthly SW border enforcement tables",
    url: "https://johnstonsarchive.net/policy/border_appreh_stats_monthly.html",
  },
] as const;

export const HEADLINE = {
  peakUsbp: 249_740,
  peakUsbpMonth: "2023-12",
  peakUsbpLabel: "Dec 2023",
  peakTotal: 301_982,
  peakTotalMonth: "2023-12",
  peakTotalLabel: "Dec 2023",
  springPeakUsbp: 224_370,
  springPeakMonth: "2022-05",
  latestUsbp: 9_295,
  latestMonth: "2026-07",
  latestLabel: "Jul 2026",
  latestShareOfPeakPct: 3.7,
  troughUsbp: 4_592,
  troughMonth: "2025-07",
  fy2022Usbp: 2_206_436,
  fy2023Usbp: 2_045_838,
  fy2024Usbp: 1_530_523,
  fy2025Usbp: 237_538,
  fy2026YtdUsbp: 80_882,
  fy2026YtdMonths: 10,
  dropFromPeakPct: 96.3,
  sameMonthJul2022: 181_834,
  sameMonthJul2023: 132_642,
  jul2026VsJul2022Pct: 5.1,
} as const;

export const VIZ_MARKERS = [
  "Monthly SW border encounters vs prior peak",
  "Peak-ratio ribbon",
  "Same-month ladder",
  "USBP vs OFO mix",
  "Fiscal-year stack",
  "Calendar overlay",
] as const;

export type MonthRow = {
  date: string;
  label: string;
  fiscalYear: number;
  monthIndex: number; // 1=Jan … 12=Dec
  usbp: number;
  total?: number;
  phase: "buildup" | "peak" | "easing" | "collapse" | "floor";
  confidence: Confidence;
};

/** Continuous USBP SW series; total (USBP+OFO) where Johnston/CBP published. */
export const MONTHLY: MonthRow[] = [
  { date: "2021-10", label: "Oct 21", fiscalYear: 2022, monthIndex: 10, usbp: 159_113, phase: "buildup", confidence: "disclosed" },
  { date: "2021-11", label: "Nov 21", fiscalYear: 2022, monthIndex: 11, usbp: 167_015, phase: "buildup", confidence: "disclosed" },
  { date: "2021-12", label: "Dec 21", fiscalYear: 2022, monthIndex: 12, usbp: 170_602, phase: "buildup", confidence: "disclosed" },
  { date: "2022-01", label: "Jan 22", fiscalYear: 2022, monthIndex: 1, usbp: 147_877, total: 154_874, phase: "buildup", confidence: "disclosed" },
  { date: "2022-02", label: "Feb 22", fiscalYear: 2022, monthIndex: 2, usbp: 159_170, total: 166_010, phase: "buildup", confidence: "disclosed" },
  { date: "2022-03", label: "Mar 22", fiscalYear: 2022, monthIndex: 3, usbp: 211_181, total: 222_574, phase: "peak", confidence: "disclosed" },
  { date: "2022-04", label: "Apr 22", fiscalYear: 2022, monthIndex: 4, usbp: 203_504, total: 235_785, phase: "peak", confidence: "disclosed" },
  { date: "2022-05", label: "May 22", fiscalYear: 2022, monthIndex: 5, usbp: 224_370, total: 241_136, phase: "peak", confidence: "disclosed" },
  { date: "2022-06", label: "Jun 22", fiscalYear: 2022, monthIndex: 6, usbp: 192_399, total: 207_834, phase: "peak", confidence: "disclosed" },
  { date: "2022-07", label: "Jul 22", fiscalYear: 2022, monthIndex: 7, usbp: 181_834, total: 200_162, phase: "peak", confidence: "disclosed" },
  { date: "2022-08", label: "Aug 22", fiscalYear: 2022, monthIndex: 8, usbp: 181_774, total: 204_087, phase: "peak", confidence: "disclosed" },
  { date: "2022-09", label: "Sep 22", fiscalYear: 2022, monthIndex: 9, usbp: 207_597, total: 227_547, phase: "peak", confidence: "disclosed" },
  { date: "2022-10", label: "Oct 22", fiscalYear: 2023, monthIndex: 10, usbp: 205_134, total: 231_529, phase: "peak", confidence: "disclosed" },
  { date: "2022-11", label: "Nov 22", fiscalYear: 2023, monthIndex: 11, usbp: 207_680, total: 235_173, phase: "peak", confidence: "disclosed" },
  { date: "2022-12", label: "Dec 22", fiscalYear: 2023, monthIndex: 12, usbp: 222_018, total: 252_315, phase: "peak", confidence: "disclosed" },
  { date: "2023-01", label: "Jan 23", fiscalYear: 2023, monthIndex: 1, usbp: 129_513, total: 157_358, phase: "easing", confidence: "disclosed" },
  { date: "2023-02", label: "Feb 23", fiscalYear: 2023, monthIndex: 2, usbp: 130_521, total: 156_630, phase: "easing", confidence: "disclosed" },
  { date: "2023-03", label: "Mar 23", fiscalYear: 2023, monthIndex: 3, usbp: 163_672, total: 193_249, phase: "easing", confidence: "disclosed" },
  { date: "2023-04", label: "Apr 23", fiscalYear: 2023, monthIndex: 4, usbp: 183_921, total: 211_992, phase: "easing", confidence: "disclosed" },
  { date: "2023-05", label: "May 23", fiscalYear: 2023, monthIndex: 5, usbp: 171_382, total: 206_690, phase: "easing", confidence: "disclosed" },
  { date: "2023-06", label: "Jun 23", fiscalYear: 2023, monthIndex: 6, usbp: 99_538, total: 144_556, phase: "easing", confidence: "disclosed" },
  { date: "2023-07", label: "Jul 23", fiscalYear: 2023, monthIndex: 7, usbp: 132_642, total: 183_479, phase: "easing", confidence: "disclosed" },
  { date: "2023-08", label: "Aug 23", fiscalYear: 2023, monthIndex: 8, usbp: 181_054, total: 232_963, phase: "peak", confidence: "disclosed" },
  { date: "2023-09", label: "Sep 23", fiscalYear: 2023, monthIndex: 9, usbp: 218_763, total: 269_735, phase: "peak", confidence: "disclosed" },
  { date: "2023-10", label: "Oct 23", fiscalYear: 2024, monthIndex: 10, usbp: 188_749, total: 240_930, phase: "peak", confidence: "disclosed" },
  { date: "2023-11", label: "Nov 23", fiscalYear: 2024, monthIndex: 11, usbp: 191_106, total: 242_399, phase: "peak", confidence: "disclosed" },
  { date: "2023-12", label: "Dec 23", fiscalYear: 2024, monthIndex: 12, usbp: 249_740, total: 301_982, phase: "peak", confidence: "disclosed" },
  { date: "2024-01", label: "Jan 24", fiscalYear: 2024, monthIndex: 1, usbp: 124_215, total: 176_196, phase: "easing", confidence: "disclosed" },
  { date: "2024-02", label: "Feb 24", fiscalYear: 2024, monthIndex: 2, usbp: 140_641, total: 189_911, phase: "easing", confidence: "disclosed" },
  { date: "2024-03", label: "Mar 24", fiscalYear: 2024, monthIndex: 3, usbp: 137_473, total: 189_359, phase: "easing", confidence: "disclosed" },
  { date: "2024-04", label: "Apr 24", fiscalYear: 2024, monthIndex: 4, usbp: 128_895, total: 179_741, phase: "easing", confidence: "disclosed" },
  { date: "2024-05", label: "May 24", fiscalYear: 2024, monthIndex: 5, usbp: 117_905, total: 170_715, phase: "easing", confidence: "disclosed" },
  { date: "2024-06", label: "Jun 24", fiscalYear: 2024, monthIndex: 6, usbp: 83_532, total: 130_419, phase: "easing", confidence: "disclosed" },
  { date: "2024-07", label: "Jul 24", fiscalYear: 2024, monthIndex: 7, usbp: 56_400, phase: "collapse", confidence: "disclosed" },
  { date: "2024-08", label: "Aug 24", fiscalYear: 2024, monthIndex: 8, usbp: 58_009, phase: "collapse", confidence: "disclosed" },
  { date: "2024-09", label: "Sep 24", fiscalYear: 2024, monthIndex: 9, usbp: 53_858, phase: "collapse", confidence: "disclosed" },
  { date: "2024-10", label: "Oct 24", fiscalYear: 2025, monthIndex: 10, usbp: 56_515, phase: "collapse", confidence: "disclosed" },
  { date: "2024-11", label: "Nov 24", fiscalYear: 2025, monthIndex: 11, usbp: 46_609, phase: "collapse", confidence: "disclosed" },
  { date: "2024-12", label: "Dec 24", fiscalYear: 2025, monthIndex: 12, usbp: 47_320, phase: "collapse", confidence: "disclosed" },
  { date: "2025-01", label: "Jan 25", fiscalYear: 2025, monthIndex: 1, usbp: 29_105, phase: "collapse", confidence: "disclosed" },
  { date: "2025-02", label: "Feb 25", fiscalYear: 2025, monthIndex: 2, usbp: 8_349, phase: "floor", confidence: "disclosed" },
  { date: "2025-03", label: "Mar 25", fiscalYear: 2025, monthIndex: 3, usbp: 7_179, phase: "floor", confidence: "disclosed" },
  { date: "2025-04", label: "Apr 25", fiscalYear: 2025, monthIndex: 4, usbp: 8_376, phase: "floor", confidence: "disclosed" },
  { date: "2025-05", label: "May 25", fiscalYear: 2025, monthIndex: 5, usbp: 8_724, phase: "floor", confidence: "disclosed" },
  { date: "2025-06", label: "Jun 25", fiscalYear: 2025, monthIndex: 6, usbp: 6_066, phase: "floor", confidence: "disclosed" },
  { date: "2025-07", label: "Jul 25", fiscalYear: 2025, monthIndex: 7, usbp: 4_592, phase: "floor", confidence: "disclosed" },
  { date: "2025-08", label: "Aug 25", fiscalYear: 2025, monthIndex: 8, usbp: 6_317, phase: "floor", confidence: "disclosed" },
  { date: "2025-09", label: "Sep 25", fiscalYear: 2025, monthIndex: 9, usbp: 8_386, phase: "floor", confidence: "disclosed" },
  { date: "2025-10", label: "Oct 25", fiscalYear: 2026, monthIndex: 10, usbp: 7_988, phase: "floor", confidence: "disclosed" },
  { date: "2025-11", label: "Nov 25", fiscalYear: 2026, monthIndex: 11, usbp: 7_353, phase: "floor", confidence: "disclosed" },
  { date: "2025-12", label: "Dec 25", fiscalYear: 2026, monthIndex: 12, usbp: 6_476, phase: "floor", confidence: "disclosed" },
  { date: "2026-01", label: "Jan 26", fiscalYear: 2026, monthIndex: 1, usbp: 6_076, phase: "floor", confidence: "disclosed" },
  { date: "2026-02", label: "Feb 26", fiscalYear: 2026, monthIndex: 2, usbp: 6_599, phase: "floor", confidence: "disclosed" },
  { date: "2026-03", label: "Mar 26", fiscalYear: 2026, monthIndex: 3, usbp: 8_269, phase: "floor", confidence: "disclosed" },
  { date: "2026-04", label: "Apr 26", fiscalYear: 2026, monthIndex: 4, usbp: 8_964, phase: "floor", confidence: "disclosed" },
  { date: "2026-05", label: "May 26", fiscalYear: 2026, monthIndex: 5, usbp: 10_007, phase: "floor", confidence: "disclosed" },
  { date: "2026-06", label: "Jun 26", fiscalYear: 2026, monthIndex: 6, usbp: 9_855, phase: "floor", confidence: "disclosed" },
  { date: "2026-07", label: "Jul 26", fiscalYear: 2026, monthIndex: 7, usbp: 9_295, phase: "floor", confidence: "disclosed" },
];

export type WindowId = "all" | "peak" | "post" | "fy26";

export const WINDOW_OPTIONS: { id: WindowId; label: string }[] = [
  { id: "all", label: "Oct 21–Jul 26" },
  { id: "peak", label: "Peak era FY22–23" },
  { id: "post", label: "Since Jan 2024" },
  { id: "fy26", label: "FY2026 YTD" },
];

export type MetricId = "usbp" | "total" | "shareOfPeak";

export const METRIC_OPTIONS: { id: MetricId; label: string }[] = [
  { id: "usbp", label: "USBP encounters" },
  { id: "total", label: "USBP + OFO (where avail.)" },
  { id: "shareOfPeak", label: "% of Dec 2023 peak" },
];

export const PHASE_COLORS: Record<MonthRow["phase"], string> = {
  buildup: "#64748b",
  peak: "#b91c1c",
  easing: "#c2410c",
  collapse: "#ca8a04",
  floor: "#0f766e",
};

export function filterMonthly(windowId: WindowId): MonthRow[] {
  switch (windowId) {
    case "peak":
      return MONTHLY.filter((m) => m.date >= "2021-10" && m.date <= "2023-12");
    case "post":
      return MONTHLY.filter((m) => m.date >= "2024-01");
    case "fy26":
      return MONTHLY.filter((m) => m.fiscalYear === 2026);
    default:
      return MONTHLY;
  }
}

export function shareOfPeak(usbp: number): number {
  return Math.round((usbp / HEADLINE.peakUsbp) * 1000) / 10;
}

export function fmtInt(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

/** Dual series for composed chart: USBP + share of peak. */
export function dualPeakSeries(windowId: WindowId) {
  return filterMonthly(windowId).map((m) => ({
    label: m.label,
    date: m.date,
    usbp: m.usbp,
    usbpK: Math.round(m.usbp / 1000),
    total: m.total ?? null,
    totalK: m.total != null ? Math.round(m.total / 1000) : null,
    shareOfPeakPct: shareOfPeak(m.usbp),
    phase: m.phase,
    fill: PHASE_COLORS[m.phase],
  }));
}

/** Same calendar month: latest vs 2022 and 2023 peaks. */
export const SAME_MONTH_LADDER = (() => {
  const months = [
    { mi: 1, name: "Jan" },
    { mi: 2, name: "Feb" },
    { mi: 3, name: "Mar" },
    { mi: 4, name: "Apr" },
    { mi: 5, name: "May" },
    { mi: 6, name: "Jun" },
    { mi: 7, name: "Jul" },
    { mi: 8, name: "Aug" },
    { mi: 9, name: "Sep" },
    { mi: 10, name: "Oct" },
    { mi: 11, name: "Nov" },
    { mi: 12, name: "Dec" },
  ];
  return months.map(({ mi, name }) => {
    const y22 = MONTHLY.find((m) => m.date.startsWith("2022") && m.monthIndex === mi);
    const y23 = MONTHLY.find((m) => m.date.startsWith("2023") && m.monthIndex === mi);
    const y26 = MONTHLY.find((m) => m.date.startsWith("2026") && m.monthIndex === mi);
    const y25 = MONTHLY.find((m) => m.date.startsWith("2025") && m.monthIndex === mi);
    const latest = y26 ?? y25;
    const peak = Math.max(y22?.usbp ?? 0, y23?.usbp ?? 0);
    return {
      month: name,
      monthIndex: mi,
      y2022: y22?.usbp ?? null,
      y2023: y23?.usbp ?? null,
      latest: latest?.usbp ?? null,
      latestLabel: latest?.label ?? "—",
      peak,
      shareOfPeakPct: latest && peak ? shareOfPeak(latest.usbp) : null,
    };
  });
})();

/** Peak-month component mix: USBP vs OFO (total − USBP). */
export const PEAK_MIX = [
  {
    id: "may22",
    label: "May 2022",
    usbp: 224_370,
    ofo: 241_136 - 224_370,
    total: 241_136,
  },
  {
    id: "dec22",
    label: "Dec 2022",
    usbp: 222_018,
    ofo: 252_315 - 222_018,
    total: 252_315,
  },
  {
    id: "sep23",
    label: "Sep 2023",
    usbp: 218_763,
    ofo: 269_735 - 218_763,
    total: 269_735,
  },
  {
    id: "dec23",
    label: "Dec 2023",
    usbp: 249_740,
    ofo: 301_982 - 249_740,
    total: 301_982,
  },
  {
    id: "jul26",
    label: "Jul 2026*",
    usbp: 9_295,
    ofo: null as number | null,
    total: null as number | null,
    note: "USBP only; OFO not broken out on FY2026 nationwide table",
  },
] as const;

export const PEAK_MIX_PIE = [
  { name: "USBP (between POEs)", value: 249_740, fill: "#0f172a" },
  { name: "OFO (at ports)", value: 301_982 - 249_740, fill: "#38bdf8" },
] as const;

export type FyRow = {
  fy: string;
  usbp: number;
  note: string;
  complete: boolean;
};

export const FY_TOTALS: FyRow[] = [
  { fy: "FY2022", usbp: 2_206_436, note: "Record USBP fiscal year", complete: true },
  { fy: "FY2023", usbp: 2_045_838, note: "Second consecutive 2M+ year", complete: true },
  { fy: "FY2024", usbp: 1_530_523, note: "Still above pre-2021 norms", complete: true },
  { fy: "FY2025", usbp: 237_538, note: "Lowest since FY1970 (Pew/CBP)", complete: true },
  { fy: "FY2026 YTD", usbp: 80_882, note: "Oct 2025–Jul 2026 (10 months)", complete: false },
];

/** Calendar-month overlay: peak-year path vs latest floor year. */
export function calendarOverlay() {
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names.map((name, i) => {
    const mi = i + 1;
    const y22 = MONTHLY.find((m) => m.date.startsWith("2022") && m.monthIndex === mi)?.usbp ?? null;
    const y23 = MONTHLY.find((m) => m.date.startsWith("2023") && m.monthIndex === mi)?.usbp ?? null;
    const y26 = MONTHLY.find((m) => m.date.startsWith("2026") && m.monthIndex === mi)?.usbp ?? null;
    return { month: name, y2022: y22, y2023: y23, y2026: y26 };
  });
}

/** Comparison table rows for prose. */
export const COMPARISON_TABLE = [
  {
    month: "Dec 2023 (peak)",
    usbp: 249_740,
    total: 301_982,
    shareOfPeak: "100%",
    note: "Highest USBP month in modern CBP tables",
  },
  {
    month: "May 2022 (spring peak)",
    usbp: 224_370,
    total: 241_136,
    shareOfPeak: "89.8%",
    note: "Title 42 still in force",
  },
  {
    month: "Sep 2023",
    usbp: 218_763,
    total: 269_735,
    shareOfPeak: "87.6%",
    note: "Post–Title 42 autumn surge",
  },
  {
    month: "Jul 2022",
    usbp: 181_834,
    total: 200_162,
    shareOfPeak: "72.8%",
    note: "Same calendar month, peak era",
  },
  {
    month: "Jul 2023",
    usbp: 132_642,
    total: 183_479,
    shareOfPeak: "53.1%",
    note: "Same calendar month, mid-easing",
  },
  {
    month: "Jul 2026 (latest)",
    usbp: 9_295,
    total: null as number | null,
    shareOfPeak: "3.7%",
    note: "CBP Nationwide FY2026 table",
  },
] as const;

/** Early FY2021–22 totals for Oct–Dec used above — verify Oct 2021 totals from Johnston if present. */
export function validateHeadlineInvariants(): boolean {
  const peak = MONTHLY.find((m) => m.date === "2023-12");
  const latest = MONTHLY.find((m) => m.date === "2026-07");
  if (!peak || !latest) return false;
  if (peak.usbp !== HEADLINE.peakUsbp) return false;
  if (latest.usbp !== HEADLINE.latestUsbp) return false;
  const share = (latest.usbp / peak.usbp) * 100;
  return Math.abs(share - HEADLINE.latestShareOfPeakPct) < 0.15;
}
