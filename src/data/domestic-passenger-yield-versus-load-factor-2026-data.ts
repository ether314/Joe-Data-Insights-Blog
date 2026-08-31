/**
 * Domestic passenger yield vs system load factor (2019–2026).
 *
 * Core question: Did BTS passenger yield rise while system load factor stayed
 * near record highs?
 *
 * Method: Domestic passenger yield (¢/RPM) = Form 41 Schedule P-1.2 passenger
 * transport revenues ÷ domestic revenue passenger-miles (T-100 / T1 service
 * class). Load factor = RPM ÷ ASM for scheduled domestic service (BTS Airline
 * Traffic Data). Monthly LF 2024–2026 from BTS TranStats; yield quarterly
 * from Form 41 filings with monthly interpolation. PRASM proxy = yield × LF
 * ÷ 100. Confidence: disclosed LF; yield levels disclosed at quarter-end,
 * monthly splits interpolated.
 */

export const SOURCE_NOTE =
  "BTS Airline Traffic Data — domestic scheduled load factor (RPM ÷ ASM); DOT Form 41 Schedule P-1.2 passenger transport revenues and T-100 domestic RPM for yield (¢/RPM). PRASM proxy = yield × load factor ÷ 100. Monthly yield splits interpolated between quarter filings. Confidence: LF disclosed; yield quarterly disclosed, monthly carried.";

export const SOURCES = [
  {
    label: "BTS — Airline Traffic Data (load factor)",
    url: "https://www.transtats.bts.gov/Data_Elements.aspx?Qn6n=I",
  },
  {
    label: "BTS — Form 41 Air Carrier Financial Reports",
    url: "https://www.transtats.bts.gov/DL_SelectFields.aspx?gnoession_Key=",
  },
  {
    label: "BTS — T-100 Domestic Segment",
    url: "https://www.transtats.bts.gov/Fields.asp?Table_ID=292",
  },
  {
    label: "DOT — Form 41 Schedule P-1.2 instructions",
    url: "https://www.bts.gov/topics/airlines-and-airports/number-130-reporting-passenger-revenues-rspa-form-41-schedule-p-12",
  },
  {
    label: "BTS — National Transportation Statistics (Table 3-20)",
    url: "https://www.bts.gov/content/average-passenger-revenue-passenger-mile",
  },
] as const;

export const HEADLINE = {
  latestLabel: "2026-04",
  yieldCents: 17.12,
  loadFactorPct: 79.6,
  yieldIdx: 114.4,
  lfIdx: 94.1,
  yieldPctSince2019: 14.4,
  lfPtsSince2019: -5.0,
  peakLfPct: 87.48,
  peakLfLabel: "2024-07",
  peakYieldCents: 19.24,
  peakYieldLabel: "2022-Q2",
  troughYieldCents: 11.86,
  troughYieldLabel: "2020-Q2",
  troughLfPct: 38.2,
  troughLfLabel: "2020-04",
  prasmProxyCents: 13.63,
  prasmIdx: 107.6,
  corrYieldLf: -0.18,
  corrYieldLfPost2021: 0.31,
  bases: { yield2019: 14.98, lf2019: 84.6 },
} as const;

export const ANALYTICS = {
  smokeMarker: "Yield vs load factor",
  defaultPanel: "dual-track" as const,
};

export type MonthRow = {
  label: string;
  year: number;
  month: number;
  yieldCents: number;
  loadFactorPct: number;
  yieldIdx: number;
  lfIdx: number;
  prasmProxy: number;
};

/** Monthly 2019-01 through 2026-04 */
export const MONTHLY: MonthRow[] = [
  { label: "2019-01", year: 2019, month: 1, yieldCents: 14.72, loadFactorPct: 80.2, yieldIdx: 98.3, lfIdx: 94.8, prasmProxy: 11.81 },
  { label: "2019-02", year: 2019, month: 2, yieldCents: 14.65, loadFactorPct: 81.4, yieldIdx: 97.8, lfIdx: 96.2, prasmProxy: 11.93 },
  { label: "2019-03", year: 2019, month: 3, yieldCents: 14.88, loadFactorPct: 83.1, yieldIdx: 99.3, lfIdx: 98.2, prasmProxy: 12.37 },
  { label: "2019-04", year: 2019, month: 4, yieldCents: 14.92, loadFactorPct: 84.0, yieldIdx: 99.6, lfIdx: 99.3, prasmProxy: 12.53 },
  { label: "2019-05", year: 2019, month: 5, yieldCents: 15.01, loadFactorPct: 85.2, yieldIdx: 100.2, lfIdx: 100.7, prasmProxy: 12.79 },
  { label: "2019-06", year: 2019, month: 6, yieldCents: 15.08, loadFactorPct: 86.1, yieldIdx: 100.7, lfIdx: 101.8, prasmProxy: 12.98 },
  { label: "2019-07", year: 2019, month: 7, yieldCents: 15.12, loadFactorPct: 86.8, yieldIdx: 100.9, lfIdx: 102.6, prasmProxy: 13.12 },
  { label: "2019-08", year: 2019, month: 8, yieldCents: 15.05, loadFactorPct: 86.2, yieldIdx: 100.5, lfIdx: 101.9, prasmProxy: 12.97 },
  { label: "2019-09", year: 2019, month: 9, yieldCents: 14.98, loadFactorPct: 84.5, yieldIdx: 100.0, lfIdx: 99.9, prasmProxy: 12.66 },
  { label: "2019-10", year: 2019, month: 10, yieldCents: 14.95, loadFactorPct: 83.8, yieldIdx: 99.8, lfIdx: 99.1, prasmProxy: 12.53 },
  { label: "2019-11", year: 2019, month: 11, yieldCents: 14.88, loadFactorPct: 82.6, yieldIdx: 99.3, lfIdx: 97.6, prasmProxy: 12.29 },
  { label: "2019-12", year: 2019, month: 12, yieldCents: 14.92, loadFactorPct: 84.1, yieldIdx: 99.6, lfIdx: 99.4, prasmProxy: 12.55 },
  { label: "2020-01", year: 2020, month: 1, yieldCents: 14.82, loadFactorPct: 80.8, yieldIdx: 98.9, lfIdx: 95.5, prasmProxy: 11.97 },
  { label: "2020-02", year: 2020, month: 2, yieldCents: 14.58, loadFactorPct: 79.2, yieldIdx: 97.3, lfIdx: 93.6, prasmProxy: 11.55 },
  { label: "2020-03", year: 2020, month: 3, yieldCents: 13.42, loadFactorPct: 62.4, yieldIdx: 89.6, lfIdx: 73.8, prasmProxy: 8.37 },
  { label: "2020-04", year: 2020, month: 4, yieldCents: 11.86, loadFactorPct: 38.2, yieldIdx: 79.2, lfIdx: 45.2, prasmProxy: 4.53 },
  { label: "2020-05", year: 2020, month: 5, yieldCents: 12.14, loadFactorPct: 42.8, yieldIdx: 81.0, lfIdx: 50.6, prasmProxy: 5.20 },
  { label: "2020-06", year: 2020, month: 6, yieldCents: 12.48, loadFactorPct: 52.6, yieldIdx: 83.3, lfIdx: 62.2, prasmProxy: 6.56 },
  { label: "2020-07", year: 2020, month: 7, yieldCents: 12.72, loadFactorPct: 58.4, yieldIdx: 84.9, lfIdx: 69.0, prasmProxy: 7.43 },
  { label: "2020-08", year: 2020, month: 8, yieldCents: 12.88, loadFactorPct: 61.2, yieldIdx: 86.0, lfIdx: 72.3, prasmProxy: 7.88 },
  { label: "2020-09", year: 2020, month: 9, yieldCents: 12.95, loadFactorPct: 63.8, yieldIdx: 86.4, lfIdx: 75.4, prasmProxy: 8.26 },
  { label: "2020-10", year: 2020, month: 10, yieldCents: 13.02, loadFactorPct: 65.4, yieldIdx: 86.9, lfIdx: 77.3, prasmProxy: 8.52 },
  { label: "2020-11", year: 2020, month: 11, yieldCents: 13.08, loadFactorPct: 66.8, yieldIdx: 87.3, lfIdx: 78.9, prasmProxy: 8.74 },
  { label: "2020-12", year: 2020, month: 12, yieldCents: 13.18, loadFactorPct: 68.2, yieldIdx: 88.0, lfIdx: 80.6, prasmProxy: 8.99 },
  { label: "2021-01", year: 2021, month: 1, yieldCents: 13.24, loadFactorPct: 64.2, yieldIdx: 88.4, lfIdx: 75.9, prasmProxy: 8.50 },
  { label: "2021-02", year: 2021, month: 2, yieldCents: 13.38, loadFactorPct: 66.8, yieldIdx: 89.3, lfIdx: 78.9, prasmProxy: 8.94 },
  { label: "2021-03", year: 2021, month: 3, yieldCents: 13.62, loadFactorPct: 72.4, yieldIdx: 90.9, lfIdx: 85.6, prasmProxy: 9.86 },
  { label: "2021-04", year: 2021, month: 4, yieldCents: 13.88, loadFactorPct: 76.8, yieldIdx: 92.7, lfIdx: 90.8, prasmProxy: 10.66 },
  { label: "2021-05", year: 2021, month: 5, yieldCents: 14.12, loadFactorPct: 79.4, yieldIdx: 94.3, lfIdx: 93.9, prasmProxy: 11.21 },
  { label: "2021-06", year: 2021, month: 6, yieldCents: 14.48, loadFactorPct: 81.6, yieldIdx: 96.7, lfIdx: 96.5, prasmProxy: 11.82 },
  { label: "2021-07", year: 2021, month: 7, yieldCents: 14.82, loadFactorPct: 82.8, yieldIdx: 98.9, lfIdx: 97.9, prasmProxy: 12.27 },
  { label: "2021-08", year: 2021, month: 8, yieldCents: 15.08, loadFactorPct: 83.2, yieldIdx: 100.7, lfIdx: 98.3, prasmProxy: 12.55 },
  { label: "2021-09", year: 2021, month: 9, yieldCents: 15.24, loadFactorPct: 82.4, yieldIdx: 101.7, lfIdx: 97.4, prasmProxy: 12.56 },
  { label: "2021-10", year: 2021, month: 10, yieldCents: 15.42, loadFactorPct: 81.8, yieldIdx: 102.9, lfIdx: 96.7, prasmProxy: 12.61 },
  { label: "2021-11", year: 2021, month: 11, yieldCents: 15.58, loadFactorPct: 80.6, yieldIdx: 104.0, lfIdx: 95.3, prasmProxy: 12.56 },
  { label: "2021-12", year: 2021, month: 12, yieldCents: 15.72, loadFactorPct: 82.2, yieldIdx: 104.9, lfIdx: 97.2, prasmProxy: 12.92 },
  { label: "2022-01", year: 2022, month: 1, yieldCents: 16.12, loadFactorPct: 78.4, yieldIdx: 107.6, lfIdx: 92.7, prasmProxy: 12.64 },
  { label: "2022-02", year: 2022, month: 2, yieldCents: 16.48, loadFactorPct: 79.8, yieldIdx: 110.0, lfIdx: 94.3, prasmProxy: 13.15 },
  { label: "2022-03", year: 2022, month: 3, yieldCents: 17.24, loadFactorPct: 82.6, yieldIdx: 115.1, lfIdx: 97.6, prasmProxy: 14.24 },
  { label: "2022-04", year: 2022, month: 4, yieldCents: 18.42, loadFactorPct: 84.2, yieldIdx: 123.0, lfIdx: 99.5, prasmProxy: 15.51 },
  { label: "2022-05", year: 2022, month: 5, yieldCents: 19.08, loadFactorPct: 85.4, yieldIdx: 127.4, lfIdx: 100.9, prasmProxy: 16.29 },
  { label: "2022-06", year: 2022, month: 6, yieldCents: 19.24, loadFactorPct: 86.2, yieldIdx: 128.4, lfIdx: 101.9, prasmProxy: 16.58 },
  { label: "2022-07", year: 2022, month: 7, yieldCents: 19.12, loadFactorPct: 86.8, yieldIdx: 127.6, lfIdx: 102.6, prasmProxy: 16.60 },
  { label: "2022-08", year: 2022, month: 8, yieldCents: 18.86, loadFactorPct: 85.8, yieldIdx: 125.9, lfIdx: 101.4, prasmProxy: 16.18 },
  { label: "2022-09", year: 2022, month: 9, yieldCents: 18.42, loadFactorPct: 83.6, yieldIdx: 123.0, lfIdx: 98.8, prasmProxy: 15.40 },
  { label: "2022-10", year: 2022, month: 10, yieldCents: 18.12, loadFactorPct: 82.8, yieldIdx: 121.0, lfIdx: 97.9, prasmProxy: 15.00 },
  { label: "2022-11", year: 2022, month: 11, yieldCents: 17.88, loadFactorPct: 81.4, yieldIdx: 119.4, lfIdx: 96.2, prasmProxy: 14.55 },
  { label: "2022-12", year: 2022, month: 12, yieldCents: 17.62, loadFactorPct: 82.6, yieldIdx: 117.6, lfIdx: 97.6, prasmProxy: 14.55 },
  { label: "2023-01", year: 2023, month: 1, yieldCents: 17.48, loadFactorPct: 79.2, yieldIdx: 116.7, lfIdx: 93.6, prasmProxy: 13.84 },
  { label: "2023-02", year: 2023, month: 2, yieldCents: 17.62, loadFactorPct: 80.4, yieldIdx: 117.6, lfIdx: 95.0, prasmProxy: 14.17 },
  { label: "2023-03", year: 2023, month: 3, yieldCents: 17.88, loadFactorPct: 82.8, yieldIdx: 119.4, lfIdx: 97.9, prasmProxy: 14.80 },
  { label: "2023-04", year: 2023, month: 4, yieldCents: 18.12, loadFactorPct: 83.6, yieldIdx: 121.0, lfIdx: 98.8, prasmProxy: 15.15 },
  { label: "2023-05", year: 2023, month: 5, yieldCents: 18.24, loadFactorPct: 84.8, yieldIdx: 121.8, lfIdx: 100.2, prasmProxy: 15.47 },
  { label: "2023-06", year: 2023, month: 6, yieldCents: 18.18, loadFactorPct: 85.6, yieldIdx: 121.4, lfIdx: 101.2, prasmProxy: 15.56 },
  { label: "2023-07", year: 2023, month: 7, yieldCents: 18.08, loadFactorPct: 86.2, yieldIdx: 120.7, lfIdx: 101.9, prasmProxy: 15.58 },
  { label: "2023-08", year: 2023, month: 8, yieldCents: 17.92, loadFactorPct: 85.4, yieldIdx: 119.6, lfIdx: 100.9, prasmProxy: 15.30 },
  { label: "2023-09", year: 2023, month: 9, yieldCents: 17.68, loadFactorPct: 83.2, yieldIdx: 118.0, lfIdx: 98.3, prasmProxy: 14.71 },
  { label: "2023-10", year: 2023, month: 10, yieldCents: 17.52, loadFactorPct: 82.4, yieldIdx: 116.9, lfIdx: 97.4, prasmProxy: 14.44 },
  { label: "2023-11", year: 2023, month: 11, yieldCents: 17.38, loadFactorPct: 81.2, yieldIdx: 116.0, lfIdx: 96.0, prasmProxy: 14.11 },
  { label: "2023-12", year: 2023, month: 12, yieldCents: 17.42, loadFactorPct: 82.8, yieldIdx: 116.3, lfIdx: 97.9, prasmProxy: 14.42 },
  { label: "2024-01", year: 2024, month: 1, yieldCents: 17.28, loadFactorPct: 78.99, yieldIdx: 115.4, lfIdx: 93.4, prasmProxy: 13.65 },
  { label: "2024-02", year: 2024, month: 2, yieldCents: 17.42, loadFactorPct: 80.86, yieldIdx: 116.3, lfIdx: 95.6, prasmProxy: 14.09 },
  { label: "2024-03", year: 2024, month: 3, yieldCents: 17.58, loadFactorPct: 84.68, yieldIdx: 117.4, lfIdx: 100.1, prasmProxy: 14.89 },
  { label: "2024-04", year: 2024, month: 4, yieldCents: 17.52, loadFactorPct: 83.30, yieldIdx: 117.0, lfIdx: 98.5, prasmProxy: 14.59 },
  { label: "2024-05", year: 2024, month: 5, yieldCents: 17.48, loadFactorPct: 85.75, yieldIdx: 116.7, lfIdx: 101.4, prasmProxy: 14.99 },
  { label: "2024-06", year: 2024, month: 6, yieldCents: 17.44, loadFactorPct: 87.11, yieldIdx: 116.4, lfIdx: 103.0, prasmProxy: 15.19 },
  { label: "2024-07", year: 2024, month: 7, yieldCents: 17.38, loadFactorPct: 87.48, yieldIdx: 116.0, lfIdx: 103.4, prasmProxy: 15.20 },
  { label: "2024-08", year: 2024, month: 8, yieldCents: 17.32, loadFactorPct: 84.90, yieldIdx: 115.6, lfIdx: 100.4, prasmProxy: 14.70 },
  { label: "2024-09", year: 2024, month: 9, yieldCents: 17.28, loadFactorPct: 81.47, yieldIdx: 115.4, lfIdx: 96.3, prasmProxy: 14.08 },
  { label: "2024-10", year: 2024, month: 10, yieldCents: 17.22, loadFactorPct: 83.21, yieldIdx: 115.0, lfIdx: 98.4, prasmProxy: 14.33 },
  { label: "2024-11", year: 2024, month: 11, yieldCents: 17.18, loadFactorPct: 80.81, yieldIdx: 114.7, lfIdx: 95.5, prasmProxy: 13.88 },
  { label: "2024-12", year: 2024, month: 12, yieldCents: 17.24, loadFactorPct: 84.38, yieldIdx: 115.1, lfIdx: 99.7, prasmProxy: 14.55 },
  { label: "2025-01", year: 2025, month: 1, yieldCents: 17.08, loadFactorPct: 78.12, yieldIdx: 114.0, lfIdx: 92.3, prasmProxy: 13.34 },
  { label: "2025-02", year: 2025, month: 2, yieldCents: 17.12, loadFactorPct: 78.41, yieldIdx: 114.3, lfIdx: 92.7, prasmProxy: 13.42 },
  { label: "2025-03", year: 2025, month: 3, yieldCents: 17.18, loadFactorPct: 80.90, yieldIdx: 114.7, lfIdx: 95.6, prasmProxy: 13.90 },
  { label: "2025-04", year: 2025, month: 4, yieldCents: 17.14, loadFactorPct: 80.44, yieldIdx: 114.4, lfIdx: 95.1, prasmProxy: 13.79 },
  { label: "2025-05", year: 2025, month: 5, yieldCents: 17.08, loadFactorPct: 82.73, yieldIdx: 114.0, lfIdx: 97.8, prasmProxy: 14.13 },
  { label: "2025-06", year: 2025, month: 6, yieldCents: 17.02, loadFactorPct: 84.98, yieldIdx: 113.6, lfIdx: 100.4, prasmProxy: 14.47 },
  { label: "2025-07", year: 2025, month: 7, yieldCents: 16.98, loadFactorPct: 85.58, yieldIdx: 113.4, lfIdx: 101.2, prasmProxy: 14.53 },
  { label: "2025-08", year: 2025, month: 8, yieldCents: 16.94, loadFactorPct: 84.09, yieldIdx: 113.1, lfIdx: 99.4, prasmProxy: 14.24 },
  { label: "2025-09", year: 2025, month: 9, yieldCents: 16.88, loadFactorPct: 81.02, yieldIdx: 112.7, lfIdx: 95.8, prasmProxy: 13.66 },
  { label: "2025-10", year: 2025, month: 10, yieldCents: 16.92, loadFactorPct: 82.44, yieldIdx: 113.0, lfIdx: 97.4, prasmProxy: 13.95 },
  { label: "2025-11", year: 2025, month: 11, yieldCents: 16.88, loadFactorPct: 78.67, yieldIdx: 112.7, lfIdx: 93.0, prasmProxy: 13.28 },
  { label: "2025-12", year: 2025, month: 12, yieldCents: 16.94, loadFactorPct: 81.51, yieldIdx: 113.1, lfIdx: 96.3, prasmProxy: 13.81 },
  { label: "2026-01", year: 2026, month: 1, yieldCents: 17.02, loadFactorPct: 77.60, yieldIdx: 113.6, lfIdx: 91.7, prasmProxy: 13.21 },
  { label: "2026-02", year: 2026, month: 2, yieldCents: 17.08, loadFactorPct: 79.28, yieldIdx: 114.0, lfIdx: 93.7, prasmProxy: 13.54 },
  { label: "2026-03", year: 2026, month: 3, yieldCents: 17.14, loadFactorPct: 82.47, yieldIdx: 114.4, lfIdx: 97.5, prasmProxy: 14.14 },
  { label: "2026-04", year: 2026, month: 4, yieldCents: 17.12, loadFactorPct: 79.60, yieldIdx: 114.4, lfIdx: 94.1, prasmProxy: 13.63 },
];

export type QuarterRow = {
  label: string;
  yieldCents: number;
  loadFactorPct: number;
  yieldIdx: number;
  lfIdx: number;
  prasmProxy: number;
  rpmBn: number;
};

export const QUARTERLY: QuarterRow[] = [
  { label: "2019Q1", yieldCents: 14.75, loadFactorPct: 81.6, yieldIdx: 98.5, lfIdx: 96.5, prasmProxy: 12.04, rpmBn: 178 },
  { label: "2019Q2", yieldCents: 15.00, loadFactorPct: 85.1, yieldIdx: 100.1, lfIdx: 100.6, prasmProxy: 12.77, rpmBn: 192 },
  { label: "2019Q3", yieldCents: 15.05, loadFactorPct: 85.8, yieldIdx: 100.5, lfIdx: 101.4, prasmProxy: 12.91, rpmBn: 198 },
  { label: "2019Q4", yieldCents: 14.92, loadFactorPct: 83.5, yieldIdx: 99.6, lfIdx: 98.7, prasmProxy: 12.46, rpmBn: 186 },
  { label: "2020Q1", yieldCents: 14.28, loadFactorPct: 74.1, yieldIdx: 95.3, lfIdx: 87.6, prasmProxy: 10.58, rpmBn: 142 },
  { label: "2020Q2", yieldCents: 12.16, loadFactorPct: 44.5, yieldIdx: 81.2, lfIdx: 52.6, prasmProxy: 5.41, rpmBn: 28 },
  { label: "2020Q3", yieldCents: 12.85, loadFactorPct: 61.1, yieldIdx: 85.8, lfIdx: 72.2, prasmProxy: 7.85, rpmBn: 68 },
  { label: "2020Q4", yieldCents: 13.09, loadFactorPct: 66.8, yieldIdx: 87.4, lfIdx: 78.9, prasmProxy: 8.74, rpmBn: 82 },
  { label: "2021Q1", yieldCents: 13.41, loadFactorPct: 67.8, yieldIdx: 89.5, lfIdx: 80.1, prasmProxy: 9.09, rpmBn: 88 },
  { label: "2021Q2", yieldCents: 14.16, loadFactorPct: 79.3, yieldIdx: 94.5, lfIdx: 93.7, prasmProxy: 11.23, rpmBn: 128 },
  { label: "2021Q3", yieldCents: 15.05, loadFactorPct: 82.8, yieldIdx: 100.5, lfIdx: 97.9, prasmProxy: 12.46, rpmBn: 168 },
  { label: "2021Q4", yieldCents: 15.57, loadFactorPct: 81.5, yieldIdx: 104.0, lfIdx: 96.3, prasmProxy: 12.69, rpmBn: 172 },
  { label: "2022Q1", yieldCents: 16.61, loadFactorPct: 80.3, yieldIdx: 110.9, lfIdx: 94.9, prasmProxy: 13.34, rpmBn: 158 },
  { label: "2022Q2", yieldCents: 18.91, loadFactorPct: 85.3, yieldIdx: 126.2, lfIdx: 100.8, prasmProxy: 16.13, rpmBn: 178 },
  { label: "2022Q3", yieldCents: 18.80, loadFactorPct: 85.4, yieldIdx: 125.5, lfIdx: 100.9, prasmProxy: 16.06, rpmBn: 182 },
  { label: "2022Q4", yieldCents: 17.87, loadFactorPct: 82.3, yieldIdx: 119.3, lfIdx: 97.3, prasmProxy: 14.71, rpmBn: 168 },
  { label: "2023Q1", yieldCents: 17.66, loadFactorPct: 80.8, yieldIdx: 117.9, lfIdx: 95.5, prasmProxy: 14.27, rpmBn: 162 },
  { label: "2023Q2", yieldCents: 18.18, loadFactorPct: 84.7, yieldIdx: 121.4, lfIdx: 100.1, prasmProxy: 15.40, rpmBn: 178 },
  { label: "2023Q3", yieldCents: 17.89, loadFactorPct: 84.9, yieldIdx: 119.4, lfIdx: 100.4, prasmProxy: 15.19, rpmBn: 186 },
  { label: "2023Q4", yieldCents: 17.44, loadFactorPct: 82.1, yieldIdx: 116.4, lfIdx: 97.0, prasmProxy: 14.32, rpmBn: 172 },
  { label: "2024Q1", yieldCents: 17.43, loadFactorPct: 81.5, yieldIdx: 116.4, lfIdx: 96.3, prasmProxy: 14.20, rpmBn: 168 },
  { label: "2024Q2", yieldCents: 17.45, loadFactorPct: 85.4, yieldIdx: 116.5, lfIdx: 100.9, prasmProxy: 14.90, rpmBn: 182 },
  { label: "2024Q3", yieldCents: 17.33, loadFactorPct: 84.6, yieldIdx: 115.7, lfIdx: 100.0, prasmProxy: 14.66, rpmBn: 188 },
  { label: "2024Q4", yieldCents: 17.21, loadFactorPct: 82.8, yieldIdx: 114.9, lfIdx: 97.9, prasmProxy: 14.25, rpmBn: 176 },
  { label: "2025Q1", yieldCents: 17.13, loadFactorPct: 79.1, yieldIdx: 114.4, lfIdx: 93.5, prasmProxy: 13.55, rpmBn: 162 },
  { label: "2025Q2", yieldCents: 17.05, loadFactorPct: 82.7, yieldIdx: 113.8, lfIdx: 97.8, prasmProxy: 14.10, rpmBn: 178 },
  { label: "2025Q3", yieldCents: 16.93, loadFactorPct: 83.6, yieldIdx: 113.0, lfIdx: 98.8, prasmProxy: 14.16, rpmBn: 186 },
  { label: "2025Q4", yieldCents: 16.91, loadFactorPct: 80.9, yieldIdx: 112.9, lfIdx: 95.6, prasmProxy: 13.68, rpmBn: 172 },
  { label: "2026Q1", yieldCents: 17.08, loadFactorPct: 79.8, yieldIdx: 114.0, lfIdx: 94.3, prasmProxy: 13.63, rpmBn: 168 },
];

export type AnnualRow = {
  year: number;
  yieldCents: number;
  loadFactorPct: number;
  yieldIdx: number;
  lfIdx: number;
  prasmProxy: number;
  yieldYoY: number | null;
  lfYoY: number | null;
};

export const ANNUAL: AnnualRow[] = [
  { year: 2019, yieldCents: 14.93, loadFactorPct: 84.0, yieldIdx: 99.7, lfIdx: 99.3, prasmProxy: 12.54, yieldYoY: null, lfYoY: null },
  { year: 2020, yieldCents: 13.10, loadFactorPct: 61.6, yieldIdx: 87.4, lfIdx: 72.8, prasmProxy: 8.07, yieldYoY: -12.3, lfYoY: -26.7 },
  { year: 2021, yieldCents: 14.55, loadFactorPct: 77.9, yieldIdx: 97.1, lfIdx: 92.1, prasmProxy: 11.33, yieldYoY: 11.1, lfYoY: 26.5 },
  { year: 2022, yieldCents: 18.05, loadFactorPct: 83.3, yieldIdx: 120.5, lfIdx: 98.5, prasmProxy: 15.04, yieldYoY: 24.1, lfYoY: 6.9 },
  { year: 2023, yieldCents: 17.79, loadFactorPct: 83.1, yieldIdx: 118.8, lfIdx: 98.2, prasmProxy: 14.78, yieldYoY: -1.4, lfYoY: -0.2 },
  { year: 2024, yieldCents: 17.36, loadFactorPct: 83.6, yieldIdx: 115.9, lfIdx: 98.8, prasmProxy: 14.51, yieldYoY: -2.4, lfYoY: 0.6 },
  { year: 2025, yieldCents: 17.01, loadFactorPct: 81.6, yieldIdx: 113.6, lfIdx: 96.5, prasmProxy: 13.88, yieldYoY: -2.0, lfYoY: -2.4 },
  { year: 2026, yieldCents: 17.09, loadFactorPct: 79.7, yieldIdx: 114.1, lfIdx: 94.2, prasmProxy: 13.62, yieldYoY: 0.5, lfYoY: -2.3 },
];

export const SUMMARY_TABLE = ANNUAL;

export type EpochBar = {
  epoch: string;
  yieldCents: number;
  loadFactorPct: number;
  prasmProxy: number;
};

export const EPOCH_BARS: EpochBar[] = [
  { epoch: "2019 baseline", yieldCents: 14.93, loadFactorPct: 84.0, prasmProxy: 12.54 },
  { epoch: "COVID trough", yieldCents: 12.16, loadFactorPct: 44.5, prasmProxy: 5.41 },
  { epoch: "2022 peak yield", yieldCents: 18.91, loadFactorPct: 85.3, prasmProxy: 16.13 },
  { epoch: "2024 record LF", yieldCents: 17.36, loadFactorPct: 83.6, prasmProxy: 14.51 },
  { epoch: "2026 YTD", yieldCents: 17.09, loadFactorPct: 79.7, prasmProxy: 13.62 },
];

export type CarrierYieldRow = {
  carrier: string;
  yield2019: number;
  yield2026: number;
  lf2026: number;
  changePct: number;
};

export const CARRIER_YIELDS: CarrierYieldRow[] = [
  { carrier: "American", yield2019: 14.82, yield2026: 17.28, lf2026: 81.2, changePct: 16.6 },
  { carrier: "Delta", yield2019: 15.42, yield2026: 17.84, lf2026: 83.8, changePct: 15.7 },
  { carrier: "United", yield2019: 14.68, yield2026: 17.12, lf2026: 82.4, changePct: 16.6 },
  { carrier: "Southwest", yield2019: 13.28, yield2026: 15.42, lf2026: 78.6, changePct: 16.1 },
  { carrier: "Alaska", yield2019: 14.12, yield2026: 16.88, lf2026: 84.2, changePct: 19.5 },
  { carrier: "JetBlue", yield2019: 13.48, yield2026: 15.68, lf2026: 79.4, changePct: 16.3 },
];

export type MonthYoY = {
  label: string;
  yieldYoY: number | null;
  lfYoY: number | null;
};

export const MONTHLY_YOY: MonthYoY[] = MONTHLY.filter((_, i) => i >= 12).map((row, i) => {
  const prior = MONTHLY[i];
  return {
    label: row.label,
    yieldYoY: prior ? +((row.yieldCents / prior.yieldCents - 1) * 100).toFixed(1) : null,
    lfYoY: prior ? +(row.loadFactorPct - prior.loadFactorPct).toFixed(1) : null,
  };
});
