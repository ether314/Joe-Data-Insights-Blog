/**
 * Sports-admissions CPI vs median usual weekly earnings (2019–2026).
 *
 * Core question: How far has BLS CPI for admissions to sporting events
 * run ahead of CPS median usual weekly earnings since 2019?
 *
 * Method: Rebase CUUR0000SS62032 (admission to sporting events) and
 * CUUR0000SA0 (all-items CPI-U) to 2019 calendar-year averages = 100.
 * Wage anchor is BLS CPS LES1252881500 — seasonally adjusted median usual
 * weekly earnings of full-time wage and salary workers — also rebased to
 * its 2019 quarterly average. Gap = sports index − wage index (pp).
 * Wage-burden index = sports ÷ wages × 100 (2019 = 100). Mid-2020
 * admissions months are unpublished (venue shutdowns); Oct 2025 CPI is
 * missing (appropriations lapse). Confidence: disclosed BLS levels;
 * indexes and ratios derived.
 */

export const SOURCE_NOTE =
  "BLS CPI-U admission to sporting events (CUUR0000SS62032) and all-items (CUUR0000SA0); CPS median usual weekly earnings LES1252881500 (SA). Rebased to 2019 averages = 100. Jul–Dec 2020 sports-admissions months unpublished; Oct 2025 CPI cell missing. Confidence: disclosed BLS levels; derived indexes/gaps.";

export const SOURCES = [
  {
    label: "BLS — CPI-U admission to sporting events (CUUR0000SS62032)",
    url: "https://data.bls.gov/timeseries/CUUR0000SS62032",
  },
  {
    label: "BLS — CPS median usual weekly earnings (LES1252881500)",
    url: "https://data.bls.gov/timeseries/LES1252881500",
  },
  {
    label: "BLS — CPI-U all items (CUUR0000SA0)",
    url: "https://data.bls.gov/timeseries/CUUR0000SA0",
  },
  {
    label: "BLS — Usual Weekly Earnings overview",
    url: "https://www.bls.gov/cps/earnings.htm",
  },
  {
    label: "BLS — Consumer Price Index overview",
    url: "https://www.bls.gov/cpi/",
  },
] as const;

export const HEADLINE = {
  sportsIndex: 109.9,
  wageIndex: 137.2,
  allItemsIndex: 130.7,
  sportsWageGapPp: -27.3,
  sportsBurden: 80.1,
  latestQuarter: "2026Q2",
  latestWageUsd: 1258,
  sportsPctSince2019: 9.9,
  wagePctSince2019: 37.2,
  peakGapPp: 1,
  peakGapLabel: "2019Q1",
  troughGapPp: -27.5,
  troughGapLabel: "2023Q2",
  peakYoyPct: 25.8,
  peakYoyLabel: "2025-03",
  bases: {
    sports2019: 226.291,
    cpi2019: 255.657,
    wage2019: 917,
  },
} as const;

export type SeriesId = "sports" | "wages" | "allItems";

export const SERIES_META: Record<
  SeriesId,
  { label: string; short: string; color: string; bls: string }
> = {
  sports: {
    label: "Sports-admissions CPI",
    short: "Sports",
    color: "#b45309",
    bls: "CUUR0000SS62032",
  },
  wages: {
    label: "Median weekly earnings",
    short: "Wages",
    color: "#0f766e",
    bls: "LES1252881500",
  },
  allItems: {
    label: "All-items CPI-U",
    short: "All items",
    color: "#64748b",
    bls: "CUUR0000SA0",
  },
};

export type QuarterRow = {
  label: string;
  year: number;
  sports: number;
  allItems: number;
  wages: number;
  wageUsd: number;
  sportsGap: number;
  sportsBurden: number;
};

export const QUARTERLY: QuarterRow[] = [
  {
    "label": "2019Q1",
    "year": 2019,
    "sports": 99.1,
    "allItems": 98.9,
    "wages": 98,
    "wageUsd": 899,
    "sportsGap": 1,
    "sportsBurden": 101
  },
  {
    "label": "2019Q2",
    "year": 2019,
    "sports": 100.4,
    "allItems": 100.1,
    "wages": 99.7,
    "wageUsd": 914,
    "sportsGap": 0.7,
    "sportsBurden": 100.8
  },
  {
    "label": "2019Q3",
    "year": 2019,
    "sports": 98.6,
    "allItems": 100.4,
    "wages": 100.4,
    "wageUsd": 921,
    "sportsGap": -1.8,
    "sportsBurden": 98.2
  },
  {
    "label": "2019Q4",
    "year": 2019,
    "sports": 101.9,
    "allItems": 100.6,
    "wages": 101.9,
    "wageUsd": 934,
    "sportsGap": 0.1,
    "sportsBurden": 100.1
  },
  {
    "label": "2020Q1",
    "year": 2020,
    "sports": 102.5,
    "allItems": 101,
    "wages": 103.7,
    "wageUsd": 951,
    "sportsGap": -1.2,
    "sportsBurden": 98.9
  },
  {
    "label": "2020Q2",
    "year": 2020,
    "sports": 106,
    "allItems": 100.5,
    "wages": 109.9,
    "wageUsd": 1008,
    "sportsGap": -3.9,
    "sportsBurden": 96.5
  },
  {
    "label": "2021Q1",
    "year": 2021,
    "sports": 86.3,
    "allItems": 102.9,
    "wages": 107.3,
    "wageUsd": 984,
    "sportsGap": -21,
    "sportsBurden": 80.4
  },
  {
    "label": "2021Q2",
    "year": 2021,
    "sports": 99.7,
    "allItems": 105.3,
    "wages": 108.6,
    "wageUsd": 996,
    "sportsGap": -8.9,
    "sportsBurden": 91.8
  },
  {
    "label": "2021Q3",
    "year": 2021,
    "sports": 100.9,
    "allItems": 107,
    "wages": 109.3,
    "wageUsd": 1002,
    "sportsGap": -8.4,
    "sportsBurden": 92.3
  },
  {
    "label": "2021Q4",
    "year": 2021,
    "sports": 105.8,
    "allItems": 108.7,
    "wages": 109.9,
    "wageUsd": 1008,
    "sportsGap": -4.1,
    "sportsBurden": 96.2
  },
  {
    "label": "2022Q1",
    "year": 2022,
    "sports": 101.3,
    "allItems": 111.1,
    "wages": 112.6,
    "wageUsd": 1033,
    "sportsGap": -11.3,
    "sportsBurden": 90
  },
  {
    "label": "2022Q2",
    "year": 2022,
    "sports": 90.9,
    "allItems": 114.4,
    "wages": 114.3,
    "wageUsd": 1048,
    "sportsGap": -23.3,
    "sportsBurden": 79.6
  },
  {
    "label": "2022Q3",
    "year": 2022,
    "sports": 94.5,
    "allItems": 115.9,
    "wages": 116.8,
    "wageUsd": 1071,
    "sportsGap": -22.3,
    "sportsBurden": 80.9
  },
  {
    "label": "2022Q4",
    "year": 2022,
    "sports": 96.3,
    "allItems": 116.4,
    "wages": 117.9,
    "wageUsd": 1081,
    "sportsGap": -21.6,
    "sportsBurden": 81.7
  },
  {
    "label": "2023Q1",
    "year": 2023,
    "sports": 103.3,
    "allItems": 117.6,
    "wages": 119.6,
    "wageUsd": 1097,
    "sportsGap": -16.3,
    "sportsBurden": 86.4
  },
  {
    "label": "2023Q2",
    "year": 2023,
    "sports": 93.4,
    "allItems": 119,
    "wages": 120.8,
    "wageUsd": 1108,
    "sportsGap": -27.5,
    "sportsBurden": 77.3
  },
  {
    "label": "2023Q3",
    "year": 2023,
    "sports": 103.8,
    "allItems": 120,
    "wages": 122,
    "wageUsd": 1119,
    "sportsGap": -18.2,
    "sportsBurden": 85.1
  },
  {
    "label": "2023Q4",
    "year": 2023,
    "sports": 114.2,
    "allItems": 120.1,
    "wages": 124.2,
    "wageUsd": 1139,
    "sportsGap": -10,
    "sportsBurden": 91.9
  },
  {
    "label": "2024Q1",
    "year": 2024,
    "sports": 113.6,
    "allItems": 121.4,
    "wages": 123.9,
    "wageUsd": 1136,
    "sportsGap": -10.3,
    "sportsBurden": 91.7
  },
  {
    "label": "2024Q2",
    "year": 2024,
    "sports": 109.5,
    "allItems": 122.8,
    "wages": 125.5,
    "wageUsd": 1151,
    "sportsGap": -16,
    "sportsBurden": 87.3
  },
  {
    "label": "2024Q3",
    "year": 2024,
    "sports": 113,
    "allItems": 123.2,
    "wages": 127.2,
    "wageUsd": 1166,
    "sportsGap": -14.2,
    "sportsBurden": 88.8
  },
  {
    "label": "2024Q4",
    "year": 2024,
    "sports": 118.8,
    "allItems": 123.4,
    "wages": 129.2,
    "wageUsd": 1185,
    "sportsGap": -10.4,
    "sportsBurden": 92
  },
  {
    "label": "2025Q1",
    "year": 2025,
    "sports": 130.1,
    "allItems": 124.7,
    "wages": 130,
    "wageUsd": 1192,
    "sportsGap": 0.1,
    "sportsBurden": 100.1
  },
  {
    "label": "2025Q2",
    "year": 2025,
    "sports": 111.2,
    "allItems": 125.8,
    "wages": 131.4,
    "wageUsd": 1205,
    "sportsGap": -20.2,
    "sportsBurden": 84.6
  },
  {
    "label": "2025Q3",
    "year": 2025,
    "sports": 109.6,
    "allItems": 126.7,
    "wages": 132.5,
    "wageUsd": 1215,
    "sportsGap": -22.9,
    "sportsBurden": 82.7
  },
  {
    "label": "2025Q4",
    "year": 2025,
    "sports": 109.5,
    "allItems": 126.8,
    "wages": 133.7,
    "wageUsd": 1226,
    "sportsGap": -24.2,
    "sportsBurden": 81.9
  },
  {
    "label": "2026Q1",
    "year": 2026,
    "sports": 116.3,
    "allItems": 128.1,
    "wages": 134.5,
    "wageUsd": 1233,
    "sportsGap": -18.2,
    "sportsBurden": 86.5
  },
  {
    "label": "2026Q2",
    "year": 2026,
    "sports": 109.9,
    "allItems": 130.7,
    "wages": 137.2,
    "wageUsd": 1258,
    "sportsGap": -27.3,
    "sportsBurden": 80.1
  }
];

export type MonthlyRow = {
  label: string;
  year: number;
  month: number;
  sports: number;
  allItems: number;
};

export const MONTHLY: MonthlyRow[] = [
  {
    "label": "2019-01",
    "year": 2019,
    "month": 1,
    "sports": 102.3,
    "allItems": 98.5
  },
  {
    "label": "2019-02",
    "year": 2019,
    "month": 2,
    "sports": 94.9,
    "allItems": 98.9
  },
  {
    "label": "2019-03",
    "year": 2019,
    "month": 3,
    "sports": 99.9,
    "allItems": 99.4
  },
  {
    "label": "2019-04",
    "year": 2019,
    "month": 4,
    "sports": 102.6,
    "allItems": 100
  },
  {
    "label": "2019-05",
    "year": 2019,
    "month": 5,
    "sports": 99.4,
    "allItems": 100.2
  },
  {
    "label": "2019-06",
    "year": 2019,
    "month": 6,
    "sports": 99.2,
    "allItems": 100.2
  },
  {
    "label": "2019-07",
    "year": 2019,
    "month": 7,
    "sports": 98.5,
    "allItems": 100.4
  },
  {
    "label": "2019-08",
    "year": 2019,
    "month": 8,
    "sports": 99.4,
    "allItems": 100.4
  },
  {
    "label": "2019-09",
    "year": 2019,
    "month": 9,
    "sports": 97.8,
    "allItems": 100.4
  },
  {
    "label": "2019-10",
    "year": 2019,
    "month": 10,
    "sports": 98.9,
    "allItems": 100.7
  },
  {
    "label": "2019-11",
    "year": 2019,
    "month": 11,
    "sports": 102.6,
    "allItems": 100.6
  },
  {
    "label": "2019-12",
    "year": 2019,
    "month": 12,
    "sports": 104.2,
    "allItems": 100.5
  },
  {
    "label": "2020-01",
    "year": 2020,
    "month": 1,
    "sports": 104.6,
    "allItems": 100.9
  },
  {
    "label": "2020-02",
    "year": 2020,
    "month": 2,
    "sports": 100.4,
    "allItems": 101.2
  },
  {
    "label": "2020-03",
    "year": 2020,
    "month": 3,
    "sports": 102.6,
    "allItems": 101
  },
  {
    "label": "2020-04",
    "year": 2020,
    "month": 4,
    "sports": 105.3,
    "allItems": 100.3
  },
  {
    "label": "2020-05",
    "year": 2020,
    "month": 5,
    "sports": 106.6,
    "allItems": 100.3
  },
  {
    "label": "2020-06",
    "year": 2020,
    "month": 6,
    "sports": 106.3,
    "allItems": 100.8
  },
  {
    "label": "2021-01",
    "year": 2021,
    "month": 1,
    "sports": 82.2,
    "allItems": 102.3
  },
  {
    "label": "2021-02",
    "year": 2021,
    "month": 2,
    "sports": 86.3,
    "allItems": 102.9
  },
  {
    "label": "2021-03",
    "year": 2021,
    "month": 3,
    "sports": 90.3,
    "allItems": 103.6
  },
  {
    "label": "2021-04",
    "year": 2021,
    "month": 4,
    "sports": 99.5,
    "allItems": 104.5
  },
  {
    "label": "2021-05",
    "year": 2021,
    "month": 5,
    "sports": 100.9,
    "allItems": 105.3
  },
  {
    "label": "2021-06",
    "year": 2021,
    "month": 6,
    "sports": 98.6,
    "allItems": 106.3
  },
  {
    "label": "2021-07",
    "year": 2021,
    "month": 7,
    "sports": 99.9,
    "allItems": 106.8
  },
  {
    "label": "2021-08",
    "year": 2021,
    "month": 8,
    "sports": 101.2,
    "allItems": 107
  },
  {
    "label": "2021-09",
    "year": 2021,
    "month": 9,
    "sports": 101.4,
    "allItems": 107.3
  },
  {
    "label": "2021-10",
    "year": 2021,
    "month": 10,
    "sports": 109.8,
    "allItems": 108.2
  },
  {
    "label": "2021-11",
    "year": 2021,
    "month": 11,
    "sports": 104.6,
    "allItems": 108.7
  },
  {
    "label": "2021-12",
    "year": 2021,
    "month": 12,
    "sports": 103,
    "allItems": 109.1
  },
  {
    "label": "2022-01",
    "year": 2022,
    "month": 1,
    "sports": 101.5,
    "allItems": 110
  },
  {
    "label": "2022-02",
    "year": 2022,
    "month": 2,
    "sports": 104.3,
    "allItems": 111
  },
  {
    "label": "2022-03",
    "year": 2022,
    "month": 3,
    "sports": 98.2,
    "allItems": 112.5
  },
  {
    "label": "2022-04",
    "year": 2022,
    "month": 4,
    "sports": 90.1,
    "allItems": 113.1
  },
  {
    "label": "2022-05",
    "year": 2022,
    "month": 5,
    "sports": 90,
    "allItems": 114.3
  },
  {
    "label": "2022-06",
    "year": 2022,
    "month": 6,
    "sports": 92.7,
    "allItems": 115.9
  },
  {
    "label": "2022-07",
    "year": 2022,
    "month": 7,
    "sports": 97.2,
    "allItems": 115.9
  },
  {
    "label": "2022-08",
    "year": 2022,
    "month": 8,
    "sports": 94.5,
    "allItems": 115.8
  },
  {
    "label": "2022-09",
    "year": 2022,
    "month": 9,
    "sports": 91.8,
    "allItems": 116.1
  },
  {
    "label": "2022-10",
    "year": 2022,
    "month": 10,
    "sports": 90.3,
    "allItems": 116.6
  },
  {
    "label": "2022-11",
    "year": 2022,
    "month": 11,
    "sports": 97.1,
    "allItems": 116.4
  },
  {
    "label": "2022-12",
    "year": 2022,
    "month": 12,
    "sports": 101.4,
    "allItems": 116.1
  },
  {
    "label": "2023-01",
    "year": 2023,
    "month": 1,
    "sports": 101.8,
    "allItems": 117
  },
  {
    "label": "2023-02",
    "year": 2023,
    "month": 2,
    "sports": 106.1,
    "allItems": 117.7
  },
  {
    "label": "2023-03",
    "year": 2023,
    "month": 3,
    "sports": 102,
    "allItems": 118.1
  },
  {
    "label": "2023-04",
    "year": 2023,
    "month": 4,
    "sports": 94,
    "allItems": 118.7
  },
  {
    "label": "2023-05",
    "year": 2023,
    "month": 5,
    "sports": 90.6,
    "allItems": 119
  },
  {
    "label": "2023-06",
    "year": 2023,
    "month": 6,
    "sports": 95.5,
    "allItems": 119.3
  },
  {
    "label": "2023-07",
    "year": 2023,
    "month": 7,
    "sports": 101.1,
    "allItems": 119.6
  },
  {
    "label": "2023-08",
    "year": 2023,
    "month": 8,
    "sports": 101.3,
    "allItems": 120.1
  },
  {
    "label": "2023-09",
    "year": 2023,
    "month": 9,
    "sports": 109.1,
    "allItems": 120.4
  },
  {
    "label": "2023-10",
    "year": 2023,
    "month": 10,
    "sports": 113,
    "allItems": 120.3
  },
  {
    "label": "2023-11",
    "year": 2023,
    "month": 11,
    "sports": 113,
    "allItems": 120.1
  },
  {
    "label": "2023-12",
    "year": 2023,
    "month": 12,
    "sports": 116.6,
    "allItems": 120
  },
  {
    "label": "2024-01",
    "year": 2024,
    "month": 1,
    "sports": 115.6,
    "allItems": 120.6
  },
  {
    "label": "2024-02",
    "year": 2024,
    "month": 2,
    "sports": 117.8,
    "allItems": 121.4
  },
  {
    "label": "2024-03",
    "year": 2024,
    "month": 3,
    "sports": 107.4,
    "allItems": 122.2
  },
  {
    "label": "2024-04",
    "year": 2024,
    "month": 4,
    "sports": 108.5,
    "allItems": 122.6
  },
  {
    "label": "2024-05",
    "year": 2024,
    "month": 5,
    "sports": 110.2,
    "allItems": 122.8
  },
  {
    "label": "2024-06",
    "year": 2024,
    "month": 6,
    "sports": 109.9,
    "allItems": 122.9
  },
  {
    "label": "2024-07",
    "year": 2024,
    "month": 7,
    "sports": 110,
    "allItems": 123
  },
  {
    "label": "2024-08",
    "year": 2024,
    "month": 8,
    "sports": 108.5,
    "allItems": 123.1
  },
  {
    "label": "2024-09",
    "year": 2024,
    "month": 9,
    "sports": 120.3,
    "allItems": 123.3
  },
  {
    "label": "2024-10",
    "year": 2024,
    "month": 10,
    "sports": 120.8,
    "allItems": 123.5
  },
  {
    "label": "2024-11",
    "year": 2024,
    "month": 11,
    "sports": 117.5,
    "allItems": 123.4
  },
  {
    "label": "2024-12",
    "year": 2024,
    "month": 12,
    "sports": 118.1,
    "allItems": 123.4
  },
  {
    "label": "2025-01",
    "year": 2025,
    "month": 1,
    "sports": 123.2,
    "allItems": 124.3
  },
  {
    "label": "2025-02",
    "year": 2025,
    "month": 2,
    "sports": 132,
    "allItems": 124.8
  },
  {
    "label": "2025-03",
    "year": 2025,
    "month": 3,
    "sports": 135.1,
    "allItems": 125.1
  },
  {
    "label": "2025-04",
    "year": 2025,
    "month": 4,
    "sports": 118.6,
    "allItems": 125.5
  },
  {
    "label": "2025-05",
    "year": 2025,
    "month": 5,
    "sports": 108.4,
    "allItems": 125.7
  },
  {
    "label": "2025-06",
    "year": 2025,
    "month": 6,
    "sports": 106.8,
    "allItems": 126.2
  },
  {
    "label": "2025-07",
    "year": 2025,
    "month": 7,
    "sports": 108.8,
    "allItems": 126.4
  },
  {
    "label": "2025-08",
    "year": 2025,
    "month": 8,
    "sports": 108,
    "allItems": 126.7
  },
  {
    "label": "2025-09",
    "year": 2025,
    "month": 9,
    "sports": 112,
    "allItems": 127
  },
  {
    "label": "2025-12",
    "year": 2025,
    "month": 12,
    "sports": 109.5,
    "allItems": 126.8
  },
  {
    "label": "2026-01",
    "year": 2026,
    "month": 1,
    "sports": 115.4,
    "allItems": 127.2
  },
  {
    "label": "2026-02",
    "year": 2026,
    "month": 2,
    "sports": 122.9,
    "allItems": 127.8
  },
  {
    "label": "2026-03",
    "year": 2026,
    "month": 3,
    "sports": 110.5,
    "allItems": 129.2
  },
  {
    "label": "2026-04",
    "year": 2026,
    "month": 4,
    "sports": 106.7,
    "allItems": 130.3
  },
  {
    "label": "2026-05",
    "year": 2026,
    "month": 5,
    "sports": 109.7,
    "allItems": 131.1
  },
  {
    "label": "2026-06",
    "year": 2026,
    "month": 6,
    "sports": 113.3,
    "allItems": 130.6
  },
  {
    "label": "2026-07",
    "year": 2026,
    "month": 7,
    "sports": 111,
    "allItems": 130.6
  }
];

export type MonthlyYoyRow = {
  label: string;
  year: number;
  sportsYoy: number;
  allItemsYoy: number;
};

export const MONTHLY_YOY: MonthlyYoyRow[] = [
  {
    "label": "2020-01",
    "year": 2020,
    "sportsYoy": 2.3,
    "allItemsYoy": 2.5
  },
  {
    "label": "2020-02",
    "year": 2020,
    "sportsYoy": 5.8,
    "allItemsYoy": 2.3
  },
  {
    "label": "2020-03",
    "year": 2020,
    "sportsYoy": 2.7,
    "allItemsYoy": 1.5
  },
  {
    "label": "2020-04",
    "year": 2020,
    "sportsYoy": 2.6,
    "allItemsYoy": 0.3
  },
  {
    "label": "2020-05",
    "year": 2020,
    "sportsYoy": 7.2,
    "allItemsYoy": 0.1
  },
  {
    "label": "2020-06",
    "year": 2020,
    "sportsYoy": 7.1,
    "allItemsYoy": 0.6
  },
  {
    "label": "2021-01",
    "year": 2021,
    "sportsYoy": -21.4,
    "allItemsYoy": 1.4
  },
  {
    "label": "2021-02",
    "year": 2021,
    "sportsYoy": -14.1,
    "allItemsYoy": 1.7
  },
  {
    "label": "2021-03",
    "year": 2021,
    "sportsYoy": -11.9,
    "allItemsYoy": 2.6
  },
  {
    "label": "2021-04",
    "year": 2021,
    "sportsYoy": -5.5,
    "allItemsYoy": 4.2
  },
  {
    "label": "2021-05",
    "year": 2021,
    "sportsYoy": -5.3,
    "allItemsYoy": 5
  },
  {
    "label": "2021-06",
    "year": 2021,
    "sportsYoy": -7.2,
    "allItemsYoy": 5.4
  },
  {
    "label": "2022-01",
    "year": 2022,
    "sportsYoy": 23.5,
    "allItemsYoy": 7.5
  },
  {
    "label": "2022-02",
    "year": 2022,
    "sportsYoy": 20.9,
    "allItemsYoy": 7.9
  },
  {
    "label": "2022-03",
    "year": 2022,
    "sportsYoy": 8.7,
    "allItemsYoy": 8.5
  },
  {
    "label": "2022-04",
    "year": 2022,
    "sportsYoy": -9.4,
    "allItemsYoy": 8.3
  },
  {
    "label": "2022-05",
    "year": 2022,
    "sportsYoy": -10.8,
    "allItemsYoy": 8.6
  },
  {
    "label": "2022-06",
    "year": 2022,
    "sportsYoy": -6.1,
    "allItemsYoy": 9.1
  },
  {
    "label": "2022-07",
    "year": 2022,
    "sportsYoy": -2.7,
    "allItemsYoy": 8.5
  },
  {
    "label": "2022-08",
    "year": 2022,
    "sportsYoy": -6.7,
    "allItemsYoy": 8.3
  },
  {
    "label": "2022-09",
    "year": 2022,
    "sportsYoy": -9.5,
    "allItemsYoy": 8.2
  },
  {
    "label": "2022-10",
    "year": 2022,
    "sportsYoy": -17.7,
    "allItemsYoy": 7.7
  },
  {
    "label": "2022-11",
    "year": 2022,
    "sportsYoy": -7.2,
    "allItemsYoy": 7.1
  },
  {
    "label": "2022-12",
    "year": 2022,
    "sportsYoy": -1.5,
    "allItemsYoy": 6.5
  },
  {
    "label": "2023-01",
    "year": 2023,
    "sportsYoy": 0.3,
    "allItemsYoy": 6.4
  },
  {
    "label": "2023-02",
    "year": 2023,
    "sportsYoy": 1.8,
    "allItemsYoy": 6
  },
  {
    "label": "2023-03",
    "year": 2023,
    "sportsYoy": 3.9,
    "allItemsYoy": 5
  },
  {
    "label": "2023-04",
    "year": 2023,
    "sportsYoy": 4.4,
    "allItemsYoy": 4.9
  },
  {
    "label": "2023-05",
    "year": 2023,
    "sportsYoy": 0.6,
    "allItemsYoy": 4
  },
  {
    "label": "2023-06",
    "year": 2023,
    "sportsYoy": 3.1,
    "allItemsYoy": 3
  },
  {
    "label": "2023-07",
    "year": 2023,
    "sportsYoy": 4,
    "allItemsYoy": 3.2
  },
  {
    "label": "2023-08",
    "year": 2023,
    "sportsYoy": 7.2,
    "allItemsYoy": 3.7
  },
  {
    "label": "2023-09",
    "year": 2023,
    "sportsYoy": 18.9,
    "allItemsYoy": 3.7
  },
  {
    "label": "2023-10",
    "year": 2023,
    "sportsYoy": 25.1,
    "allItemsYoy": 3.2
  },
  {
    "label": "2023-11",
    "year": 2023,
    "sportsYoy": 16.4,
    "allItemsYoy": 3.1
  },
  {
    "label": "2023-12",
    "year": 2023,
    "sportsYoy": 14.9,
    "allItemsYoy": 3.4
  },
  {
    "label": "2024-01",
    "year": 2024,
    "sportsYoy": 13.5,
    "allItemsYoy": 3.1
  },
  {
    "label": "2024-02",
    "year": 2024,
    "sportsYoy": 11,
    "allItemsYoy": 3.2
  },
  {
    "label": "2024-03",
    "year": 2024,
    "sportsYoy": 5.2,
    "allItemsYoy": 3.5
  },
  {
    "label": "2024-04",
    "year": 2024,
    "sportsYoy": 15.4,
    "allItemsYoy": 3.4
  },
  {
    "label": "2024-05",
    "year": 2024,
    "sportsYoy": 21.7,
    "allItemsYoy": 3.3
  },
  {
    "label": "2024-06",
    "year": 2024,
    "sportsYoy": 15.1,
    "allItemsYoy": 3
  },
  {
    "label": "2024-07",
    "year": 2024,
    "sportsYoy": 8.8,
    "allItemsYoy": 2.9
  },
  {
    "label": "2024-08",
    "year": 2024,
    "sportsYoy": 7.2,
    "allItemsYoy": 2.5
  },
  {
    "label": "2024-09",
    "year": 2024,
    "sportsYoy": 10.3,
    "allItemsYoy": 2.4
  },
  {
    "label": "2024-10",
    "year": 2024,
    "sportsYoy": 6.9,
    "allItemsYoy": 2.6
  },
  {
    "label": "2024-11",
    "year": 2024,
    "sportsYoy": 4,
    "allItemsYoy": 2.7
  },
  {
    "label": "2024-12",
    "year": 2024,
    "sportsYoy": 1.3,
    "allItemsYoy": 2.9
  },
  {
    "label": "2025-01",
    "year": 2025,
    "sportsYoy": 6.5,
    "allItemsYoy": 3
  },
  {
    "label": "2025-02",
    "year": 2025,
    "sportsYoy": 12,
    "allItemsYoy": 2.8
  },
  {
    "label": "2025-03",
    "year": 2025,
    "sportsYoy": 25.8,
    "allItemsYoy": 2.4
  },
  {
    "label": "2025-04",
    "year": 2025,
    "sportsYoy": 9.3,
    "allItemsYoy": 2.3
  },
  {
    "label": "2025-05",
    "year": 2025,
    "sportsYoy": -1.6,
    "allItemsYoy": 2.4
  },
  {
    "label": "2025-06",
    "year": 2025,
    "sportsYoy": -2.9,
    "allItemsYoy": 2.7
  },
  {
    "label": "2025-07",
    "year": 2025,
    "sportsYoy": -1.1,
    "allItemsYoy": 2.7
  },
  {
    "label": "2025-08",
    "year": 2025,
    "sportsYoy": -0.5,
    "allItemsYoy": 2.9
  },
  {
    "label": "2025-09",
    "year": 2025,
    "sportsYoy": -6.9,
    "allItemsYoy": 3
  },
  {
    "label": "2025-12",
    "year": 2025,
    "sportsYoy": -7.3,
    "allItemsYoy": 2.7
  },
  {
    "label": "2026-01",
    "year": 2026,
    "sportsYoy": -6.3,
    "allItemsYoy": 2.4
  },
  {
    "label": "2026-02",
    "year": 2026,
    "sportsYoy": -6.9,
    "allItemsYoy": 2.4
  },
  {
    "label": "2026-03",
    "year": 2026,
    "sportsYoy": -18.2,
    "allItemsYoy": 3.3
  },
  {
    "label": "2026-04",
    "year": 2026,
    "sportsYoy": -10,
    "allItemsYoy": 3.8
  },
  {
    "label": "2026-05",
    "year": 2026,
    "sportsYoy": 1.3,
    "allItemsYoy": 4.2
  },
  {
    "label": "2026-06",
    "year": 2026,
    "sportsYoy": 6.2,
    "allItemsYoy": 3.5
  },
  {
    "label": "2026-07",
    "year": 2026,
    "sportsYoy": 2.1,
    "allItemsYoy": 3.4
  }
];

export type AnnualRow = {
  year: number;
  sports: number;
  allItems: number;
  wages: number;
  wageUsd: number;
  sportsGap: number;
  sportsBurden: number;
  partial: boolean;
  months: number;
};

export const ANNUAL: AnnualRow[] = [
  {
    "year": 2019,
    "sports": 100,
    "allItems": 100,
    "wages": 100,
    "wageUsd": 917,
    "sportsGap": 0,
    "sportsBurden": 100,
    "partial": false,
    "months": 12
  },
  {
    "year": 2020,
    "sports": 104.3,
    "allItems": 101.2,
    "wages": 107.3,
    "wageUsd": 984,
    "sportsGap": -3,
    "sportsBurden": 97.2,
    "partial": true,
    "months": 6
  },
  {
    "year": 2021,
    "sports": 98.1,
    "allItems": 106,
    "wages": 108.8,
    "wageUsd": 998,
    "sportsGap": -10.6,
    "sportsBurden": 90.2,
    "partial": false,
    "months": 12
  },
  {
    "year": 2022,
    "sports": 95.8,
    "allItems": 114.5,
    "wages": 115.4,
    "wageUsd": 1058,
    "sportsGap": -19.6,
    "sportsBurden": 83,
    "partial": false,
    "months": 12
  },
  {
    "year": 2023,
    "sports": 103.7,
    "allItems": 119.2,
    "wages": 121.7,
    "wageUsd": 1116,
    "sportsGap": -18,
    "sportsBurden": 85.2,
    "partial": false,
    "months": 12
  },
  {
    "year": 2024,
    "sports": 113.7,
    "allItems": 122.7,
    "wages": 126.4,
    "wageUsd": 1160,
    "sportsGap": -12.7,
    "sportsBurden": 89.9,
    "partial": false,
    "months": 12
  },
  {
    "year": 2025,
    "sports": 116.2,
    "allItems": 125.9,
    "wages": 131.9,
    "wageUsd": 1210,
    "sportsGap": -15.7,
    "sportsBurden": 88.1,
    "partial": false,
    "months": 10
  },
  {
    "year": 2026,
    "sports": 112.8,
    "allItems": 129.5,
    "wages": 135.8,
    "wageUsd": 1246,
    "sportsGap": -23,
    "sportsBurden": 83.1,
    "partial": true,
    "months": 7
  }
];

export const SUMMARY_TABLE = ANNUAL.map((r) => ({
  year: r.year,
  sportsIndex: r.sports,
  wageIndex: r.wages,
  allItemsIndex: r.allItems,
  gapPp: r.sportsGap,
  burden: r.sportsBurden,
  wageUsd: r.wageUsd,
  note:
    r.partial
      ? r.year === 2020
        ? "H1 only (venues)"
        : r.year === 2026
          ? "YTD through Jul / Q2"
          : "Partial"
      : "Full year",
}));

export const ANALYTICS = {
  smokeMarker: "Ticket index vs paycheck",
  defaultPanel: "index-race" as const,
  slug: "sports-admissions-cpi-versus-median-weekly-earnings-2026",
};
