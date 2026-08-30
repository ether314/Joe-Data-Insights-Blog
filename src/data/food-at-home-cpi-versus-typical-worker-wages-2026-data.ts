/**
 * Food-at-home CPI vs median usual weekly earnings (2019–2026).
 *
 * Core question: How far has BLS food-at-home CPI run ahead of median
 * usual weekly earnings since 2019?
 *
 * Method: Rebase CUUR0000SAF11 (food at home), CUUR0000SEFV (food away
 * from home), and CUUR0000SA0 (all-items CPI-U) to 2019 calendar-year
 * averages = 100. Wage anchor is BLS CPS LES1252881500 — seasonally
 * adjusted median usual weekly earnings of full-time wage and salary
 * workers — rebased to its 2019 quarterly average. Gap = food index −
 * wage index (pp). Burden = food ÷ wages × 100 (2019 = 100). Average
 * price (APU) eggs, milk, and bread for shelf-price color. Confidence:
 * disclosed BLS levels; indexes and ratios derived.
 */

export const SOURCE_NOTE =
  "BLS CPI-U food at home (CUUR0000SAF11), food away from home (CUUR0000SEFV), all-items (CUUR0000SA0); CPS median usual weekly earnings LES1252881500 (SA); APU eggs/milk/bread. Rebased to 2019 averages = 100. Confidence: disclosed BLS levels; derived indexes/gaps.";

export const SOURCES = [
  { label: "BLS — CPI-U food at home (CUUR0000SAF11)", url: "https://data.bls.gov/timeseries/CUUR0000SAF11" },
  { label: "BLS — CPI-U food away from home (CUUR0000SEFV)", url: "https://data.bls.gov/timeseries/CUUR0000SEFV" },
  { label: "BLS — CPS median usual weekly earnings (LES1252881500)", url: "https://data.bls.gov/timeseries/LES1252881500" },
  { label: "BLS — CPI-U all items (CUUR0000SA0)", url: "https://data.bls.gov/timeseries/CUUR0000SA0" },
  { label: "BLS — Average price data (APU)", url: "https://www.bls.gov/cpi/factsheets/average-prices.htm" },
] as const;

export const HEADLINE = {
  "foodIdx": 132.8,
  "wageIdx": 137.2,
  "awayIdx": 138.8,
  "allIdx": 130.7,
  "gapPp": -4.3,
  "burden": 96.8,
  "latestQuarter": "2026Q02",
  "latestMonth": "2026-07",
  "latestFoodMonthIdx": 133,
  "wageUsd": 1258,
  "foodPctSince2019": 32.8,
  "wagePctSince2019": 37.2,
  "awayPctSince2019": 38.8,
  "peakGapPp": 5.6,
  "peakGapLabel": "2022Q04",
  "troughGapPp": -5.1,
  "troughGapLabel": "2020Q02",
  "peakYoyPct": 13.5,
  "peakYoyLabel": "2022-08",
  "eggsPeakUsd": 6.227,
  "eggsPeakLabel": "2025-03",
  "eggsLatestUsd": 2.189,
  "milkLatestUsd": 4.313,
  "breadLatestUsd": 1.82,
  "meatsIdx": 140.4,
  "fruitsIdx": 139,
  "dairyIdx": 122.8,
  "cerealsIdx": 133.7,
  "bases": {
    "food2019": 241.774,
    "away2019": 284.41,
    "cpi2019": 255.657,
    "wage2019": 917,
    "eggs2019": 1.396,
    "milk2019": 3.036,
    "bread2019": 1.298
  }
} as const;

export type SeriesId = "food" | "away" | "wages" | "allItems";

export const SERIES_META: Record<
  SeriesId,
  { label: string; short: string; color: string; bls: string }
> = {
  food: { label: "Food-at-home CPI", short: "Food at home", color: "#c2410c", bls: "CUUR0000SAF11" },
  away: { label: "Food-away CPI", short: "Food away", color: "#a16207", bls: "CUUR0000SEFV" },
  wages: { label: "Median weekly earnings", short: "Wages", color: "#0f766e", bls: "LES1252881500" },
  allItems: { label: "All-items CPI-U", short: "All items", color: "#64748b", bls: "CUUR0000SA0" },
};

export type QuarterRow = {
  label: string;
  year: number;
  q: string;
  foodIdx: number;
  wageIdx: number;
  awayIdx: number;
  allIdx: number;
  gapPp: number;
  burden: number;
  wageUsd: number;
  rawFood: number;
};

export const QUARTERS: QuarterRow[] = [
  {
    "label": "2019Q01",
    "year": 2019,
    "q": "Q01",
    "foodIdx": 100.1,
    "wageIdx": 98,
    "awayIdx": 98.9,
    "allIdx": 98.9,
    "gapPp": 2.1,
    "burden": 102.1,
    "wageUsd": 899,
    "rawFood": 241.998
  },
  {
    "label": "2019Q02",
    "year": 2019,
    "q": "Q02",
    "foodIdx": 100,
    "wageIdx": 99.7,
    "awayIdx": 99.7,
    "allIdx": 100.1,
    "gapPp": 0.3,
    "burden": 100.3,
    "wageUsd": 914,
    "rawFood": 241.81
  },
  {
    "label": "2019Q03",
    "year": 2019,
    "q": "Q03",
    "foodIdx": 99.8,
    "wageIdx": 100.4,
    "awayIdx": 100.4,
    "allIdx": 100.4,
    "gapPp": -0.6,
    "burden": 99.4,
    "wageUsd": 921,
    "rawFood": 241.352
  },
  {
    "label": "2019Q04",
    "year": 2019,
    "q": "Q04",
    "foodIdx": 100.1,
    "wageIdx": 101.9,
    "awayIdx": 101,
    "allIdx": 100.6,
    "gapPp": -1.8,
    "burden": 98.2,
    "wageUsd": 934,
    "rawFood": 241.939
  },
  {
    "label": "2020Q01",
    "year": 2020,
    "q": "Q01",
    "foodIdx": 101,
    "wageIdx": 103.7,
    "awayIdx": 101.9,
    "allIdx": 101,
    "gapPp": -2.7,
    "burden": 97.4,
    "wageUsd": 951,
    "rawFood": 244.109
  },
  {
    "label": "2020Q02",
    "year": 2020,
    "q": "Q02",
    "foodIdx": 104.9,
    "wageIdx": 109.9,
    "awayIdx": 102.6,
    "allIdx": 100.5,
    "gapPp": -5.1,
    "burden": 95.4,
    "wageUsd": 1008,
    "rawFood": 253.529
  },
  {
    "label": "2020Q03",
    "year": 2020,
    "q": "Q03",
    "foodIdx": 104.3,
    "wageIdx": 108.5,
    "awayIdx": 104,
    "allIdx": 101.6,
    "gapPp": -4.2,
    "burden": 96.1,
    "wageUsd": 995,
    "rawFood": 252.095
  },
  {
    "label": "2020Q04",
    "year": 2020,
    "q": "Q04",
    "foodIdx": 103.9,
    "wageIdx": 107.2,
    "awayIdx": 105,
    "allIdx": 101.8,
    "gapPp": -3.3,
    "burden": 96.9,
    "wageUsd": 983,
    "rawFood": 251.199
  },
  {
    "label": "2021Q01",
    "year": 2021,
    "q": "Q01",
    "foodIdx": 104.5,
    "wageIdx": 107.3,
    "awayIdx": 105.7,
    "allIdx": 102.9,
    "gapPp": -2.8,
    "burden": 97.4,
    "wageUsd": 984,
    "rawFood": 252.685
  },
  {
    "label": "2021Q02",
    "year": 2021,
    "q": "Q02",
    "foodIdx": 105.8,
    "wageIdx": 108.6,
    "awayIdx": 106.8,
    "allIdx": 105.3,
    "gapPp": -2.8,
    "burden": 97.4,
    "wageUsd": 996,
    "rawFood": 255.896
  },
  {
    "label": "2021Q03",
    "year": 2021,
    "q": "Q03",
    "foodIdx": 107.8,
    "wageIdx": 109.3,
    "awayIdx": 108.8,
    "allIdx": 107,
    "gapPp": -1.5,
    "burden": 98.6,
    "wageUsd": 1002,
    "rawFood": 260.514
  },
  {
    "label": "2021Q04",
    "year": 2021,
    "q": "Q04",
    "foodIdx": 110.2,
    "wageIdx": 109.9,
    "awayIdx": 110.9,
    "allIdx": 108.7,
    "gapPp": 0.3,
    "burden": 100.3,
    "wageUsd": 1008,
    "rawFood": 266.472
  },
  {
    "label": "2022Q01",
    "year": 2022,
    "q": "Q01",
    "foodIdx": 113.6,
    "wageIdx": 112.6,
    "awayIdx": 112.8,
    "allIdx": 111.1,
    "gapPp": 0.9,
    "burden": 100.8,
    "wageUsd": 1033,
    "rawFood": 274.63
  },
  {
    "label": "2022Q02",
    "year": 2022,
    "q": "Q02",
    "foodIdx": 118.2,
    "wageIdx": 114.3,
    "awayIdx": 114.7,
    "allIdx": 114.4,
    "gapPp": 3.9,
    "burden": 103.4,
    "wageUsd": 1048,
    "rawFood": 285.666
  },
  {
    "label": "2022Q03",
    "year": 2022,
    "q": "Q03",
    "foodIdx": 122,
    "wageIdx": 116.8,
    "awayIdx": 117.5,
    "allIdx": 115.9,
    "gapPp": 5.2,
    "burden": 104.4,
    "wageUsd": 1071,
    "rawFood": 294.917
  },
  {
    "label": "2022Q04",
    "year": 2022,
    "q": "Q04",
    "foodIdx": 123.5,
    "wageIdx": 117.9,
    "awayIdx": 120.3,
    "allIdx": 116.4,
    "gapPp": 5.6,
    "burden": 104.8,
    "wageUsd": 1081,
    "rawFood": 298.591
  },
  {
    "label": "2023Q01",
    "year": 2023,
    "q": "Q01",
    "foodIdx": 124.9,
    "wageIdx": 119.6,
    "awayIdx": 122.3,
    "allIdx": 117.6,
    "gapPp": 5.3,
    "burden": 104.4,
    "wageUsd": 1097,
    "rawFood": 301.945
  },
  {
    "label": "2023Q02",
    "year": 2023,
    "q": "Q02",
    "foodIdx": 125.1,
    "wageIdx": 120.8,
    "awayIdx": 124,
    "allIdx": 119,
    "gapPp": 4.2,
    "burden": 103.5,
    "wageUsd": 1108,
    "rawFood": 302.399
  },
  {
    "label": "2023Q03",
    "year": 2023,
    "q": "Q03",
    "foodIdx": 125.6,
    "wageIdx": 122,
    "awayIdx": 125.2,
    "allIdx": 120,
    "gapPp": 3.6,
    "burden": 102.9,
    "wageUsd": 1119,
    "rawFood": 303.699
  },
  {
    "label": "2023Q04",
    "year": 2023,
    "q": "Q04",
    "foodIdx": 125.6,
    "wageIdx": 124.2,
    "awayIdx": 126.7,
    "allIdx": 120.1,
    "gapPp": 1.4,
    "burden": 101.1,
    "wageUsd": 1139,
    "rawFood": 303.672
  },
  {
    "label": "2024Q01",
    "year": 2024,
    "q": "Q01",
    "foodIdx": 126.3,
    "wageIdx": 123.9,
    "awayIdx": 127.9,
    "allIdx": 121.4,
    "gapPp": 2.4,
    "burden": 101.9,
    "wageUsd": 1136,
    "rawFood": 305.311
  },
  {
    "label": "2024Q02",
    "year": 2024,
    "q": "Q02",
    "foodIdx": 126.4,
    "wageIdx": 125.5,
    "awayIdx": 129.1,
    "allIdx": 122.8,
    "gapPp": 0.9,
    "burden": 100.7,
    "wageUsd": 1151,
    "rawFood": 305.713
  },
  {
    "label": "2024Q03",
    "year": 2024,
    "q": "Q03",
    "foodIdx": 127,
    "wageIdx": 127.2,
    "awayIdx": 130.3,
    "allIdx": 123.2,
    "gapPp": -0.2,
    "burden": 99.8,
    "wageUsd": 1166,
    "rawFood": 306.937
  },
  {
    "label": "2024Q04",
    "year": 2024,
    "q": "Q04",
    "foodIdx": 127.5,
    "wageIdx": 129.2,
    "awayIdx": 131.3,
    "allIdx": 123.4,
    "gapPp": -1.8,
    "burden": 98.6,
    "wageUsd": 1185,
    "rawFood": 308.184
  },
  {
    "label": "2025Q01",
    "year": 2025,
    "q": "Q01",
    "foodIdx": 128.9,
    "wageIdx": 130,
    "awayIdx": 132.5,
    "allIdx": 124.7,
    "gapPp": -1.1,
    "burden": 99.2,
    "wageUsd": 1192,
    "rawFood": 311.678
  },
  {
    "label": "2025Q02",
    "year": 2025,
    "q": "Q02",
    "foodIdx": 129.2,
    "wageIdx": 131.4,
    "awayIdx": 134.1,
    "allIdx": 125.8,
    "gapPp": -2.2,
    "burden": 98.3,
    "wageUsd": 1205,
    "rawFood": 312.453
  },
  {
    "label": "2025Q03",
    "year": 2025,
    "q": "Q03",
    "foodIdx": 130.1,
    "wageIdx": 132.5,
    "awayIdx": 135.3,
    "allIdx": 126.7,
    "gapPp": -2.4,
    "burden": 98.2,
    "wageUsd": 1215,
    "rawFood": 314.638
  },
  {
    "label": "2026Q01",
    "year": 2026,
    "q": "Q01",
    "foodIdx": 131.7,
    "wageIdx": 134.5,
    "awayIdx": 137.7,
    "allIdx": 128.1,
    "gapPp": -2.8,
    "burden": 97.9,
    "wageUsd": 1233,
    "rawFood": 318.361
  },
  {
    "label": "2026Q02",
    "year": 2026,
    "q": "Q02",
    "foodIdx": 132.8,
    "wageIdx": 137.2,
    "awayIdx": 138.8,
    "allIdx": 130.7,
    "gapPp": -4.3,
    "burden": 96.8,
    "wageUsd": 1258,
    "rawFood": 321.179
  }
];

export type MonthRow = {
  label: string;
  foodIdx: number;
  allIdx: number | null;
  awayIdx: number | null;
  eggsUsd: number | null;
  milkUsd: number | null;
  breadUsd: number | null;
  eggsIdx: number | null;
  milkIdx: number | null;
  breadIdx: number | null;
  rawFood: number;
};

export const MONTHLY: MonthRow[] = [
  {
    "label": "2019-01",
    "foodIdx": 99.8,
    "allIdx": 98.5,
    "awayIdx": 98.6,
    "eggsUsd": 1.554,
    "milkUsd": 2.913,
    "breadUsd": 1.274,
    "eggsIdx": 111.3,
    "milkIdx": 96,
    "breadIdx": 98.2,
    "rawFood": 241.381
  },
  {
    "label": "2019-02",
    "foodIdx": 100.1,
    "allIdx": 98.9,
    "awayIdx": 98.9,
    "eggsUsd": 1.557,
    "milkUsd": 2.9,
    "breadUsd": 1.282,
    "eggsIdx": 111.5,
    "milkIdx": 95.5,
    "breadIdx": 98.8,
    "rawFood": 242.057
  },
  {
    "label": "2019-03",
    "foodIdx": 100.3,
    "allIdx": 99.4,
    "awayIdx": 99.1,
    "eggsUsd": 1.544,
    "milkUsd": 2.944,
    "breadUsd": 1.261,
    "eggsIdx": 110.6,
    "milkIdx": 97,
    "breadIdx": 97.2,
    "rawFood": 242.555
  },
  {
    "label": "2019-04",
    "foodIdx": 100,
    "allIdx": 100,
    "awayIdx": 99.4,
    "eggsUsd": 1.463,
    "milkUsd": 2.98,
    "breadUsd": 1.285,
    "eggsIdx": 104.8,
    "milkIdx": 98.2,
    "breadIdx": 99,
    "rawFood": 241.878
  },
  {
    "label": "2019-05",
    "foodIdx": 100.2,
    "allIdx": 100.2,
    "awayIdx": 99.6,
    "eggsUsd": 1.362,
    "milkUsd": 2.963,
    "breadUsd": 1.289,
    "eggsIdx": 97.6,
    "milkIdx": 97.6,
    "breadIdx": 99.3,
    "rawFood": 242.145
  },
  {
    "label": "2019-06",
    "foodIdx": 99.8,
    "allIdx": 100.2,
    "awayIdx": 100,
    "eggsUsd": 1.203,
    "milkUsd": 3.054,
    "breadUsd": 1.28,
    "eggsIdx": 86.2,
    "milkIdx": 100.6,
    "breadIdx": 98.6,
    "rawFood": 241.407
  },
  {
    "label": "2019-07",
    "foodIdx": 99.8,
    "allIdx": 100.4,
    "awayIdx": 100.2,
    "eggsUsd": 1.243,
    "milkUsd": 3.031,
    "breadUsd": 1.281,
    "eggsIdx": 89.1,
    "milkIdx": 99.8,
    "breadIdx": 98.7,
    "rawFood": 241.359
  },
  {
    "label": "2019-08",
    "foodIdx": 99.7,
    "allIdx": 100.4,
    "awayIdx": 100.4,
    "eggsUsd": 1.219,
    "milkUsd": 3.045,
    "breadUsd": 1.275,
    "eggsIdx": 87.3,
    "milkIdx": 100.3,
    "breadIdx": 98.3,
    "rawFood": 241.153
  },
  {
    "label": "2019-09",
    "foodIdx": 99.9,
    "allIdx": 100.4,
    "awayIdx": 100.6,
    "eggsUsd": 1.383,
    "milkUsd": 3.102,
    "breadUsd": 1.296,
    "eggsIdx": 99.1,
    "milkIdx": 102.2,
    "breadIdx": 99.9,
    "rawFood": 241.543
  },
  {
    "label": "2019-10",
    "foodIdx": 100.2,
    "allIdx": 100.7,
    "awayIdx": 100.8,
    "eggsUsd": 1.282,
    "milkUsd": 3.119,
    "breadUsd": 1.325,
    "eggsIdx": 91.8,
    "milkIdx": 102.7,
    "breadIdx": 102.1,
    "rawFood": 242.34
  },
  {
    "label": "2019-11",
    "foodIdx": 100,
    "allIdx": 100.6,
    "awayIdx": 101,
    "eggsUsd": 1.405,
    "milkUsd": 3.189,
    "breadUsd": 1.361,
    "eggsIdx": 100.7,
    "milkIdx": 105.1,
    "breadIdx": 104.9,
    "rawFood": 241.726
  },
  {
    "label": "2019-12",
    "foodIdx": 100,
    "allIdx": 100.5,
    "awayIdx": 101.3,
    "eggsUsd": 1.535,
    "milkUsd": 3.188,
    "breadUsd": 1.363,
    "eggsIdx": 110,
    "milkIdx": 105,
    "breadIdx": 105,
    "rawFood": 241.75
  },
  {
    "label": "2020-01",
    "foodIdx": 100.6,
    "allIdx": 100.9,
    "awayIdx": 101.7,
    "eggsUsd": 1.461,
    "milkUsd": 3.253,
    "breadUsd": 1.351,
    "eggsIdx": 104.7,
    "milkIdx": 107.2,
    "breadIdx": 104.1,
    "rawFood": 243.11
  },
  {
    "label": "2020-02",
    "foodIdx": 100.9,
    "allIdx": 101.2,
    "awayIdx": 101.9,
    "eggsUsd": 1.449,
    "milkUsd": 3.196,
    "breadUsd": 1.375,
    "eggsIdx": 103.8,
    "milkIdx": 105.3,
    "breadIdx": 106,
    "rawFood": 244.054
  },
  {
    "label": "2020-03",
    "foodIdx": 101.4,
    "allIdx": 101,
    "awayIdx": 102,
    "eggsUsd": 1.525,
    "milkUsd": 3.248,
    "breadUsd": 1.374,
    "eggsIdx": 109.3,
    "milkIdx": 107,
    "breadIdx": 105.9,
    "rawFood": 245.163
  },
  {
    "label": "2020-04",
    "foodIdx": 104.1,
    "allIdx": 100.3,
    "awayIdx": 102.2,
    "eggsUsd": 2.019,
    "milkUsd": 3.267,
    "breadUsd": 1.406,
    "eggsIdx": 144.6,
    "milkIdx": 107.6,
    "breadIdx": 108.3,
    "rawFood": 251.717
  },
  {
    "label": "2020-05",
    "foodIdx": 105,
    "allIdx": 100.3,
    "awayIdx": 102.6,
    "eggsUsd": 1.64,
    "milkUsd": 3.21,
    "breadUsd": 1.412,
    "eggsIdx": 117.5,
    "milkIdx": 105.7,
    "breadIdx": 108.8,
    "rawFood": 253.827
  },
  {
    "label": "2020-06",
    "foodIdx": 105.5,
    "allIdx": 100.8,
    "awayIdx": 103.1,
    "eggsUsd": 1.554,
    "milkUsd": 3.198,
    "breadUsd": 1.474,
    "eggsIdx": 111.3,
    "milkIdx": 105.3,
    "breadIdx": 113.6,
    "rawFood": 255.042
  },
  {
    "label": "2020-07",
    "foodIdx": 104.5,
    "allIdx": 101.3,
    "awayIdx": 103.6,
    "eggsUsd": 1.401,
    "milkUsd": 3.255,
    "breadUsd": 1.485,
    "eggsIdx": 100.4,
    "milkIdx": 107.2,
    "breadIdx": 114.4,
    "rawFood": 252.563
  },
  {
    "label": "2020-08",
    "foodIdx": 104.4,
    "allIdx": 101.7,
    "awayIdx": 103.9,
    "eggsUsd": 1.328,
    "milkUsd": 3.406,
    "breadUsd": 1.495,
    "eggsIdx": 95.1,
    "milkIdx": 112.2,
    "breadIdx": 115.2,
    "rawFood": 252.352
  },
  {
    "label": "2020-09",
    "foodIdx": 104,
    "allIdx": 101.8,
    "awayIdx": 104.5,
    "eggsUsd": 1.353,
    "milkUsd": 3.448,
    "breadUsd": 1.492,
    "eggsIdx": 96.9,
    "milkIdx": 113.6,
    "breadIdx": 115,
    "rawFood": 251.369
  },
  {
    "label": "2020-10",
    "foodIdx": 104.2,
    "allIdx": 101.9,
    "awayIdx": 104.7,
    "eggsUsd": 1.408,
    "milkUsd": 3.38,
    "breadUsd": 1.503,
    "eggsIdx": 100.9,
    "milkIdx": 111.3,
    "breadIdx": 115.8,
    "rawFood": 251.937
  },
  {
    "label": "2020-11",
    "foodIdx": 103.6,
    "allIdx": 101.8,
    "awayIdx": 104.9,
    "eggsUsd": 1.45,
    "milkUsd": 3.425,
    "breadUsd": 1.515,
    "eggsIdx": 103.9,
    "milkIdx": 112.8,
    "breadIdx": 116.7,
    "rawFood": 250.407
  },
  {
    "label": "2020-12",
    "foodIdx": 103.9,
    "allIdx": 101.9,
    "awayIdx": 105.3,
    "eggsUsd": 1.481,
    "milkUsd": 3.535,
    "breadUsd": 1.538,
    "eggsIdx": 106.1,
    "milkIdx": 116.4,
    "breadIdx": 118.5,
    "rawFood": 251.253
  },
  {
    "label": "2021-01",
    "foodIdx": 104.3,
    "allIdx": 102.3,
    "awayIdx": 105.6,
    "eggsUsd": 1.466,
    "milkUsd": 3.468,
    "breadUsd": 1.546,
    "eggsIdx": 105,
    "milkIdx": 114.2,
    "breadIdx": 119.1,
    "rawFood": 252.107
  },
  {
    "label": "2021-02",
    "foodIdx": 104.5,
    "allIdx": 102.9,
    "awayIdx": 105.7,
    "eggsUsd": 1.597,
    "milkUsd": 3.368,
    "breadUsd": 1.537,
    "eggsIdx": 114.4,
    "milkIdx": 110.9,
    "breadIdx": 118.4,
    "rawFood": 252.716
  },
  {
    "label": "2021-03",
    "foodIdx": 104.7,
    "allIdx": 103.6,
    "awayIdx": 105.8,
    "eggsUsd": 1.625,
    "milkUsd": 3.348,
    "breadUsd": 1.526,
    "eggsIdx": 116.4,
    "milkIdx": 110.3,
    "breadIdx": 117.6,
    "rawFood": 253.231
  },
  {
    "label": "2021-04",
    "foodIdx": 105.4,
    "allIdx": 104.5,
    "awayIdx": 106.1,
    "eggsUsd": 1.62,
    "milkUsd": 3.447,
    "breadUsd": 1.51,
    "eggsIdx": 116.1,
    "milkIdx": 113.6,
    "breadIdx": 116.4,
    "rawFood": 254.76
  },
  {
    "label": "2021-05",
    "foodIdx": 105.7,
    "allIdx": 105.3,
    "awayIdx": 106.7,
    "eggsUsd": 1.625,
    "milkUsd": 3.497,
    "breadUsd": 1.511,
    "eggsIdx": 116.4,
    "milkIdx": 115.2,
    "breadIdx": 116.4,
    "rawFood": 255.516
  },
  {
    "label": "2021-06",
    "foodIdx": 106.5,
    "allIdx": 106.3,
    "awayIdx": 107.5,
    "eggsUsd": 1.642,
    "milkUsd": 3.557,
    "breadUsd": 1.51,
    "eggsIdx": 117.6,
    "milkIdx": 117.2,
    "breadIdx": 116.4,
    "rawFood": 257.412
  },
  {
    "label": "2021-07",
    "foodIdx": 107.1,
    "allIdx": 106.8,
    "awayIdx": 108.3,
    "eggsUsd": 1.642,
    "milkUsd": 3.627,
    "breadUsd": 1.491,
    "eggsIdx": 117.6,
    "milkIdx": 119.5,
    "breadIdx": 114.9,
    "rawFood": 259.022
  },
  {
    "label": "2021-08",
    "foodIdx": 107.5,
    "allIdx": 107,
    "awayIdx": 108.8,
    "eggsUsd": 1.709,
    "milkUsd": 3.56,
    "breadUsd": 1.467,
    "eggsIdx": 122.4,
    "milkIdx": 117.3,
    "breadIdx": 113,
    "rawFood": 259.825
  },
  {
    "label": "2021-09",
    "foodIdx": 108.7,
    "allIdx": 107.3,
    "awayIdx": 109.3,
    "eggsUsd": 1.835,
    "milkUsd": 3.585,
    "breadUsd": 1.58,
    "eggsIdx": 131.5,
    "milkIdx": 118.1,
    "breadIdx": 121.8,
    "rawFood": 262.695
  },
  {
    "label": "2021-10",
    "foodIdx": 109.8,
    "allIdx": 108.2,
    "awayIdx": 110.3,
    "eggsUsd": 1.821,
    "milkUsd": 3.663,
    "breadUsd": 1.526,
    "eggsIdx": 130.5,
    "milkIdx": 120.7,
    "breadIdx": 117.6,
    "rawFood": 265.478
  },
  {
    "label": "2021-11",
    "foodIdx": 110.2,
    "allIdx": 108.7,
    "awayIdx": 110.9,
    "eggsUsd": 1.718,
    "milkUsd": 3.671,
    "breadUsd": 1.547,
    "eggsIdx": 123.1,
    "milkIdx": 120.9,
    "breadIdx": 119.2,
    "rawFood": 266.384
  },
  {
    "label": "2021-12",
    "foodIdx": 110.7,
    "allIdx": 109.1,
    "awayIdx": 111.6,
    "eggsUsd": 1.788,
    "milkUsd": 3.743,
    "breadUsd": 1.532,
    "eggsIdx": 128.1,
    "milkIdx": 123.3,
    "breadIdx": 118.1,
    "rawFood": 267.555
  },
  {
    "label": "2022-01",
    "foodIdx": 112,
    "allIdx": 110,
    "awayIdx": 112.3,
    "eggsUsd": 1.929,
    "milkUsd": 3.787,
    "breadUsd": 1.555,
    "eggsIdx": 138.2,
    "milkIdx": 124.8,
    "breadIdx": 119.8,
    "rawFood": 270.711
  },
  {
    "label": "2022-02",
    "foodIdx": 113.6,
    "allIdx": 111,
    "awayIdx": 112.8,
    "eggsUsd": 2.005,
    "milkUsd": 3.875,
    "breadUsd": 1.578,
    "eggsIdx": 143.6,
    "milkIdx": 127.6,
    "breadIdx": 121.6,
    "rawFood": 274.568
  },
  {
    "label": "2022-03",
    "foodIdx": 115.2,
    "allIdx": 112.5,
    "awayIdx": 113.1,
    "eggsUsd": 2.046,
    "milkUsd": 3.917,
    "breadUsd": 1.607,
    "eggsIdx": 146.6,
    "milkIdx": 129,
    "breadIdx": 123.8,
    "rawFood": 278.612
  },
  {
    "label": "2022-04",
    "foodIdx": 116.7,
    "allIdx": 113.1,
    "awayIdx": 113.8,
    "eggsUsd": 2.52,
    "milkUsd": 4.012,
    "breadUsd": 1.612,
    "eggsIdx": 180.5,
    "milkIdx": 132.2,
    "breadIdx": 124.2,
    "rawFood": 282.161
  },
  {
    "label": "2022-05",
    "foodIdx": 118.3,
    "allIdx": 114.3,
    "awayIdx": 114.6,
    "eggsUsd": 2.863,
    "milkUsd": 4.204,
    "breadUsd": 1.606,
    "eggsIdx": 205.1,
    "milkIdx": 138.5,
    "breadIdx": 123.8,
    "rawFood": 285.953
  },
  {
    "label": "2022-06",
    "foodIdx": 119.5,
    "allIdx": 115.9,
    "awayIdx": 115.7,
    "eggsUsd": 2.707,
    "milkUsd": 4.153,
    "breadUsd": 1.691,
    "eggsIdx": 193.9,
    "milkIdx": 136.8,
    "breadIdx": 130.3,
    "rawFood": 288.884
  },
  {
    "label": "2022-07",
    "foodIdx": 121.2,
    "allIdx": 115.9,
    "awayIdx": 116.5,
    "eggsUsd": 2.936,
    "milkUsd": 4.156,
    "breadUsd": 1.715,
    "eggsIdx": 210.3,
    "milkIdx": 136.9,
    "breadIdx": 132.2,
    "rawFood": 292.972
  },
  {
    "label": "2022-08",
    "foodIdx": 122,
    "allIdx": 115.8,
    "awayIdx": 117.5,
    "eggsUsd": 3.116,
    "milkUsd": 4.194,
    "breadUsd": 1.756,
    "eggsIdx": 223.2,
    "milkIdx": 138.2,
    "breadIdx": 135.3,
    "rawFood": 295.007
  },
  {
    "label": "2022-09",
    "foodIdx": 122.7,
    "allIdx": 116.1,
    "awayIdx": 118.6,
    "eggsUsd": 2.902,
    "milkUsd": 4.181,
    "breadUsd": 1.749,
    "eggsIdx": 207.9,
    "milkIdx": 137.7,
    "breadIdx": 134.8,
    "rawFood": 296.771
  },
  {
    "label": "2022-10",
    "foodIdx": 123.4,
    "allIdx": 116.6,
    "awayIdx": 119.7,
    "eggsUsd": 3.419,
    "milkUsd": 4.184,
    "breadUsd": 1.814,
    "eggsIdx": 244.9,
    "milkIdx": 137.8,
    "breadIdx": 139.8,
    "rawFood": 298.401
  },
  {
    "label": "2022-11",
    "foodIdx": 123.4,
    "allIdx": 116.4,
    "awayIdx": 120.3,
    "eggsUsd": 3.589,
    "milkUsd": 4.218,
    "breadUsd": 1.847,
    "eggsIdx": 257.1,
    "milkIdx": 138.9,
    "breadIdx": 142.3,
    "rawFood": 298.284
  },
  {
    "label": "2022-12",
    "foodIdx": 123.7,
    "allIdx": 116.1,
    "awayIdx": 120.8,
    "eggsUsd": 4.25,
    "milkUsd": 4.211,
    "breadUsd": 1.873,
    "eggsIdx": 304.5,
    "milkIdx": 138.7,
    "breadIdx": 144.3,
    "rawFood": 299.089
  },
  {
    "label": "2023-01",
    "foodIdx": 124.7,
    "allIdx": 117,
    "awayIdx": 121.5,
    "eggsUsd": 4.823,
    "milkUsd": 4.204,
    "breadUsd": 1.888,
    "eggsIdx": 345.5,
    "milkIdx": 138.5,
    "breadIdx": 145.5,
    "rawFood": 301.435
  },
  {
    "label": "2023-02",
    "foodIdx": 125.1,
    "allIdx": 117.7,
    "awayIdx": 122.3,
    "eggsUsd": 4.211,
    "milkUsd": 4.163,
    "breadUsd": 1.896,
    "eggsIdx": 301.7,
    "milkIdx": 137.1,
    "breadIdx": 146.1,
    "rawFood": 302.483
  },
  {
    "label": "2023-03",
    "foodIdx": 124.9,
    "allIdx": 118.1,
    "awayIdx": 123,
    "eggsUsd": 3.446,
    "milkUsd": 4.098,
    "breadUsd": 1.936,
    "eggsIdx": 246.9,
    "milkIdx": 135,
    "breadIdx": 149.2,
    "rawFood": 301.918
  },
  {
    "label": "2023-04",
    "foodIdx": 125,
    "allIdx": 118.7,
    "awayIdx": 123.5,
    "eggsUsd": 3.27,
    "milkUsd": 4.042,
    "breadUsd": 1.989,
    "eggsIdx": 234.3,
    "milkIdx": 133.2,
    "breadIdx": 153.3,
    "rawFood": 302.328
  },
  {
    "label": "2023-05",
    "foodIdx": 125.1,
    "allIdx": 119,
    "awayIdx": 124.1,
    "eggsUsd": 2.666,
    "milkUsd": 4.042,
    "breadUsd": 1.951,
    "eggsIdx": 191,
    "milkIdx": 133.2,
    "breadIdx": 150.3,
    "rawFood": 302.535
  },
  {
    "label": "2023-06",
    "foodIdx": 125,
    "allIdx": 119.3,
    "awayIdx": 124.6,
    "eggsUsd": 2.219,
    "milkUsd": 3.985,
    "breadUsd": 1.937,
    "eggsIdx": 159,
    "milkIdx": 131.3,
    "breadIdx": 149.3,
    "rawFood": 302.335
  },
  {
    "label": "2023-07",
    "foodIdx": 125.5,
    "allIdx": 119.6,
    "awayIdx": 124.8,
    "eggsUsd": 2.094,
    "milkUsd": 3.971,
    "breadUsd": 1.98,
    "eggsIdx": 150,
    "milkIdx": 130.8,
    "breadIdx": 152.6,
    "rawFood": 303.455
  },
  {
    "label": "2023-08",
    "foodIdx": 125.6,
    "allIdx": 120.1,
    "awayIdx": 125.2,
    "eggsUsd": 2.043,
    "milkUsd": 3.927,
    "breadUsd": 1.97,
    "eggsIdx": 146.4,
    "milkIdx": 129.4,
    "breadIdx": 151.8,
    "rawFood": 303.716
  },
  {
    "label": "2023-09",
    "foodIdx": 125.7,
    "allIdx": 120.4,
    "awayIdx": 125.7,
    "eggsUsd": 2.065,
    "milkUsd": 3.965,
    "breadUsd": 1.972,
    "eggsIdx": 147.9,
    "milkIdx": 130.6,
    "breadIdx": 152,
    "rawFood": 303.925
  },
  {
    "label": "2023-10",
    "foodIdx": 126.1,
    "allIdx": 120.3,
    "awayIdx": 126.2,
    "eggsUsd": 2.072,
    "milkUsd": 3.927,
    "breadUsd": 2.002,
    "eggsIdx": 148.4,
    "milkIdx": 129.4,
    "breadIdx": 154.3,
    "rawFood": 304.788
  },
  {
    "label": "2023-11",
    "foodIdx": 125.4,
    "allIdx": 120.1,
    "awayIdx": 126.7,
    "eggsUsd": 2.138,
    "milkUsd": 3.997,
    "breadUsd": 1.976,
    "eggsIdx": 153.2,
    "milkIdx": 131.7,
    "breadIdx": 152.3,
    "rawFood": 303.224
  },
  {
    "label": "2023-12",
    "foodIdx": 125.3,
    "allIdx": 120,
    "awayIdx": 127.1,
    "eggsUsd": 2.507,
    "milkUsd": 4.008,
    "breadUsd": 2.024,
    "eggsIdx": 179.6,
    "milkIdx": 132,
    "breadIdx": 156,
    "rawFood": 303.005
  },
  {
    "label": "2024-01",
    "foodIdx": 126.2,
    "allIdx": 120.6,
    "awayIdx": 127.7,
    "eggsUsd": 2.522,
    "milkUsd": 3.958,
    "breadUsd": 2.033,
    "eggsIdx": 180.7,
    "milkIdx": 130.4,
    "breadIdx": 156.7,
    "rawFood": 305.037
  },
  {
    "label": "2024-02",
    "foodIdx": 126.3,
    "allIdx": 121.4,
    "awayIdx": 127.8,
    "eggsUsd": 2.996,
    "milkUsd": 3.94,
    "breadUsd": 2.006,
    "eggsIdx": 214.6,
    "milkIdx": 129.8,
    "breadIdx": 154.6,
    "rawFood": 305.469
  },
  {
    "label": "2024-03",
    "foodIdx": 126.3,
    "allIdx": 122.2,
    "awayIdx": 128.2,
    "eggsUsd": 2.992,
    "milkUsd": 3.893,
    "breadUsd": 1.997,
    "eggsIdx": 214.4,
    "milkIdx": 128.2,
    "breadIdx": 153.9,
    "rawFood": 305.426
  },
  {
    "label": "2024-04",
    "foodIdx": 126.4,
    "allIdx": 122.6,
    "awayIdx": 128.6,
    "eggsUsd": 2.864,
    "milkUsd": 3.868,
    "breadUsd": 1.998,
    "eggsIdx": 205.2,
    "milkIdx": 127.4,
    "breadIdx": 154,
    "rawFood": 305.707
  },
  {
    "label": "2024-05",
    "foodIdx": 126.4,
    "allIdx": 122.8,
    "awayIdx": 129.1,
    "eggsUsd": 2.699,
    "milkUsd": 3.864,
    "breadUsd": 1.971,
    "eggsIdx": 193.4,
    "milkIdx": 127.3,
    "breadIdx": 151.9,
    "rawFood": 305.679
  },
  {
    "label": "2024-06",
    "foodIdx": 126.5,
    "allIdx": 122.9,
    "awayIdx": 129.6,
    "eggsUsd": 2.715,
    "milkUsd": 3.956,
    "breadUsd": 1.973,
    "eggsIdx": 194.5,
    "milkIdx": 130.3,
    "breadIdx": 152,
    "rawFood": 305.752
  },
  {
    "label": "2024-07",
    "foodIdx": 126.8,
    "allIdx": 123,
    "awayIdx": 129.9,
    "eggsUsd": 3.08,
    "milkUsd": 3.983,
    "breadUsd": 1.975,
    "eggsIdx": 220.7,
    "milkIdx": 131.2,
    "breadIdx": 152.2,
    "rawFood": 306.643
  },
  {
    "label": "2024-08",
    "foodIdx": 126.7,
    "allIdx": 123.1,
    "awayIdx": 130.2,
    "eggsUsd": 3.204,
    "milkUsd": 4.044,
    "breadUsd": 1.951,
    "eggsIdx": 229.5,
    "milkIdx": 133.2,
    "breadIdx": 150.3,
    "rawFood": 306.402
  },
  {
    "label": "2024-09",
    "foodIdx": 127.3,
    "allIdx": 123.3,
    "awayIdx": 130.7,
    "eggsUsd": 3.821,
    "milkUsd": 4.021,
    "breadUsd": 1.976,
    "eggsIdx": 273.7,
    "milkIdx": 132.5,
    "breadIdx": 152.3,
    "rawFood": 307.767
  },
  {
    "label": "2024-10",
    "foodIdx": 127.5,
    "allIdx": 123.5,
    "awayIdx": 131,
    "eggsUsd": 3.37,
    "milkUsd": 4.041,
    "breadUsd": 1.937,
    "eggsIdx": 241.4,
    "milkIdx": 133.1,
    "breadIdx": 149.3,
    "rawFood": 308.2
  },
  {
    "label": "2024-11",
    "foodIdx": 127.4,
    "allIdx": 123.4,
    "awayIdx": 131.3,
    "eggsUsd": 3.649,
    "milkUsd": 4.138,
    "breadUsd": 1.916,
    "eggsIdx": 261.4,
    "milkIdx": 136.3,
    "breadIdx": 147.6,
    "rawFood": 307.972
  },
  {
    "label": "2024-12",
    "foodIdx": 127.5,
    "allIdx": 123.4,
    "awayIdx": 131.7,
    "eggsUsd": 4.146,
    "milkUsd": 4.101,
    "breadUsd": 1.912,
    "eggsIdx": 297,
    "milkIdx": 135.1,
    "breadIdx": 147.3,
    "rawFood": 308.38
  },
  {
    "label": "2025-01",
    "foodIdx": 128.6,
    "allIdx": 124.3,
    "awayIdx": 132,
    "eggsUsd": 4.953,
    "milkUsd": 4.025,
    "breadUsd": 1.925,
    "eggsIdx": 354.8,
    "milkIdx": 132.6,
    "breadIdx": 148.3,
    "rawFood": 310.936
  },
  {
    "label": "2025-02",
    "foodIdx": 128.7,
    "allIdx": 124.8,
    "awayIdx": 132.6,
    "eggsUsd": 5.897,
    "milkUsd": 4.026,
    "breadUsd": 1.925,
    "eggsIdx": 422.5,
    "milkIdx": 132.6,
    "breadIdx": 148.3,
    "rawFood": 311.284
  },
  {
    "label": "2025-03",
    "foodIdx": 129.4,
    "allIdx": 125.1,
    "awayIdx": 133,
    "eggsUsd": 6.227,
    "milkUsd": 4.05,
    "breadUsd": 1.88,
    "eggsIdx": 446.1,
    "milkIdx": 133.4,
    "breadIdx": 144.9,
    "rawFood": 312.815
  },
  {
    "label": "2025-04",
    "foodIdx": 129,
    "allIdx": 125.5,
    "awayIdx": 133.6,
    "eggsUsd": 5.122,
    "milkUsd": 4.074,
    "breadUsd": 1.913,
    "eggsIdx": 366.9,
    "milkIdx": 134.2,
    "breadIdx": 147.4,
    "rawFood": 311.84
  },
  {
    "label": "2025-05",
    "foodIdx": 129.2,
    "allIdx": 125.7,
    "awayIdx": 134,
    "eggsUsd": 4.548,
    "milkUsd": 4.022,
    "breadUsd": 1.876,
    "eggsIdx": 325.8,
    "milkIdx": 132.5,
    "breadIdx": 144.6,
    "rawFood": 312.491
  },
  {
    "label": "2025-06",
    "foodIdx": 129.5,
    "allIdx": 126.2,
    "awayIdx": 134.6,
    "eggsUsd": 3.775,
    "milkUsd": 4.029,
    "breadUsd": 1.864,
    "eggsIdx": 270.4,
    "milkIdx": 132.7,
    "breadIdx": 143.6,
    "rawFood": 313.028
  },
  {
    "label": "2025-07",
    "foodIdx": 129.6,
    "allIdx": 126.4,
    "awayIdx": 134.9,
    "eggsUsd": 3.599,
    "milkUsd": 4.162,
    "breadUsd": 1.851,
    "eggsIdx": 257.8,
    "milkIdx": 137.1,
    "breadIdx": 142.6,
    "rawFood": 313.263
  },
  {
    "label": "2025-08",
    "foodIdx": 130.1,
    "allIdx": 126.7,
    "awayIdx": 135.3,
    "eggsUsd": 3.587,
    "milkUsd": 4.171,
    "breadUsd": 1.841,
    "eggsIdx": 257,
    "milkIdx": 137.4,
    "breadIdx": 141.9,
    "rawFood": 314.608
  },
  {
    "label": "2025-09",
    "foodIdx": 130.7,
    "allIdx": 127,
    "awayIdx": 135.5,
    "eggsUsd": 3.488,
    "milkUsd": 4.129,
    "breadUsd": 1.867,
    "eggsIdx": 249.9,
    "milkIdx": 136,
    "breadIdx": 143.9,
    "rawFood": 316.042
  },
  {
    "label": "2025-11",
    "foodIdx": 129.9,
    "allIdx": 126.8,
    "awayIdx": 136.1,
    "eggsUsd": 2.86,
    "milkUsd": 3.997,
    "breadUsd": 1.79,
    "eggsIdx": 204.9,
    "milkIdx": 131.7,
    "breadIdx": 137.9,
    "rawFood": 313.954
  },
  {
    "label": "2025-12",
    "foodIdx": 130.6,
    "allIdx": 126.8,
    "awayIdx": 137.1,
    "eggsUsd": 2.712,
    "milkUsd": 4.047,
    "breadUsd": 1.833,
    "eggsIdx": 194.3,
    "milkIdx": 133.3,
    "breadIdx": 141.3,
    "rawFood": 315.664
  },
  {
    "label": "2026-01",
    "foodIdx": 131.3,
    "allIdx": 127.2,
    "awayIdx": 137.3,
    "eggsUsd": 2.577,
    "milkUsd": 4.1,
    "breadUsd": 1.843,
    "eggsIdx": 184.6,
    "milkIdx": 135.1,
    "breadIdx": 142,
    "rawFood": 317.431
  },
  {
    "label": "2026-02",
    "foodIdx": 131.9,
    "allIdx": 127.8,
    "awayIdx": 137.7,
    "eggsUsd": 2.5,
    "milkUsd": 4.026,
    "breadUsd": 1.85,
    "eggsIdx": 179.1,
    "milkIdx": 132.6,
    "breadIdx": 142.6,
    "rawFood": 318.898
  },
  {
    "label": "2026-03",
    "foodIdx": 131.8,
    "allIdx": 129.2,
    "awayIdx": 138.1,
    "eggsUsd": 2.348,
    "milkUsd": 4.067,
    "breadUsd": 1.808,
    "eggsIdx": 168.2,
    "milkIdx": 134,
    "breadIdx": 139.3,
    "rawFood": 318.755
  },
  {
    "label": "2026-04",
    "foodIdx": 132.7,
    "allIdx": 130.3,
    "awayIdx": 138.4,
    "eggsUsd": 2.25,
    "milkUsd": 4.136,
    "breadUsd": 1.869,
    "eggsIdx": 161.2,
    "milkIdx": 136.2,
    "breadIdx": 144,
    "rawFood": 320.859
  },
  {
    "label": "2026-05",
    "foodIdx": 132.8,
    "allIdx": 131.1,
    "awayIdx": 138.8,
    "eggsUsd": 2.191,
    "milkUsd": 4.217,
    "breadUsd": 1.83,
    "eggsIdx": 157,
    "milkIdx": 138.9,
    "breadIdx": 141,
    "rawFood": 321.047
  },
  {
    "label": "2026-06",
    "foodIdx": 133,
    "allIdx": 130.6,
    "awayIdx": 139.1,
    "eggsUsd": 2.141,
    "milkUsd": 4.317,
    "breadUsd": 1.814,
    "eggsIdx": 153.4,
    "milkIdx": 142.2,
    "breadIdx": 139.8,
    "rawFood": 321.631
  },
  {
    "label": "2026-07",
    "foodIdx": 133,
    "allIdx": 130.6,
    "awayIdx": 139.5,
    "eggsUsd": 2.189,
    "milkUsd": 4.313,
    "breadUsd": 1.82,
    "eggsIdx": 156.8,
    "milkIdx": 142.1,
    "breadIdx": 140.3,
    "rawFood": 321.643
  }
];

export const MONTHLY_YOY = [
  {
    "label": "2020-01",
    "foodYoy": 0.7,
    "foodIdx": 100.6,
    "allIdx": 100.9
  },
  {
    "label": "2020-02",
    "foodYoy": 0.8,
    "foodIdx": 100.9,
    "allIdx": 101.2
  },
  {
    "label": "2020-03",
    "foodYoy": 1.1,
    "foodIdx": 101.4,
    "allIdx": 101
  },
  {
    "label": "2020-04",
    "foodYoy": 4.1,
    "foodIdx": 104.1,
    "allIdx": 100.3
  },
  {
    "label": "2020-05",
    "foodYoy": 4.8,
    "foodIdx": 105,
    "allIdx": 100.3
  },
  {
    "label": "2020-06",
    "foodYoy": 5.6,
    "foodIdx": 105.5,
    "allIdx": 100.8
  },
  {
    "label": "2020-07",
    "foodYoy": 4.6,
    "foodIdx": 104.5,
    "allIdx": 101.3
  },
  {
    "label": "2020-08",
    "foodYoy": 4.6,
    "foodIdx": 104.4,
    "allIdx": 101.7
  },
  {
    "label": "2020-09",
    "foodYoy": 4.1,
    "foodIdx": 104,
    "allIdx": 101.8
  },
  {
    "label": "2020-10",
    "foodYoy": 4,
    "foodIdx": 104.2,
    "allIdx": 101.9
  },
  {
    "label": "2020-11",
    "foodYoy": 3.6,
    "foodIdx": 103.6,
    "allIdx": 101.8
  },
  {
    "label": "2020-12",
    "foodYoy": 3.9,
    "foodIdx": 103.9,
    "allIdx": 101.9
  },
  {
    "label": "2021-01",
    "foodYoy": 3.7,
    "foodIdx": 104.3,
    "allIdx": 102.3
  },
  {
    "label": "2021-02",
    "foodYoy": 3.5,
    "foodIdx": 104.5,
    "allIdx": 102.9
  },
  {
    "label": "2021-03",
    "foodYoy": 3.3,
    "foodIdx": 104.7,
    "allIdx": 103.6
  },
  {
    "label": "2021-04",
    "foodYoy": 1.2,
    "foodIdx": 105.4,
    "allIdx": 104.5
  },
  {
    "label": "2021-05",
    "foodYoy": 0.7,
    "foodIdx": 105.7,
    "allIdx": 105.3
  },
  {
    "label": "2021-06",
    "foodYoy": 0.9,
    "foodIdx": 106.5,
    "allIdx": 106.3
  },
  {
    "label": "2021-07",
    "foodYoy": 2.6,
    "foodIdx": 107.1,
    "allIdx": 106.8
  },
  {
    "label": "2021-08",
    "foodYoy": 3,
    "foodIdx": 107.5,
    "allIdx": 107
  },
  {
    "label": "2021-09",
    "foodYoy": 4.5,
    "foodIdx": 108.7,
    "allIdx": 107.3
  },
  {
    "label": "2021-10",
    "foodYoy": 5.4,
    "foodIdx": 109.8,
    "allIdx": 108.2
  },
  {
    "label": "2021-11",
    "foodYoy": 6.4,
    "foodIdx": 110.2,
    "allIdx": 108.7
  },
  {
    "label": "2021-12",
    "foodYoy": 6.5,
    "foodIdx": 110.7,
    "allIdx": 109.1
  },
  {
    "label": "2022-01",
    "foodYoy": 7.4,
    "foodIdx": 112,
    "allIdx": 110
  },
  {
    "label": "2022-02",
    "foodYoy": 8.6,
    "foodIdx": 113.6,
    "allIdx": 111
  },
  {
    "label": "2022-03",
    "foodYoy": 10,
    "foodIdx": 115.2,
    "allIdx": 112.5
  },
  {
    "label": "2022-04",
    "foodYoy": 10.8,
    "foodIdx": 116.7,
    "allIdx": 113.1
  },
  {
    "label": "2022-05",
    "foodYoy": 11.9,
    "foodIdx": 118.3,
    "allIdx": 114.3
  },
  {
    "label": "2022-06",
    "foodYoy": 12.2,
    "foodIdx": 119.5,
    "allIdx": 115.9
  },
  {
    "label": "2022-07",
    "foodYoy": 13.1,
    "foodIdx": 121.2,
    "allIdx": 115.9
  },
  {
    "label": "2022-08",
    "foodYoy": 13.5,
    "foodIdx": 122,
    "allIdx": 115.8
  },
  {
    "label": "2022-09",
    "foodYoy": 13,
    "foodIdx": 122.7,
    "allIdx": 116.1
  },
  {
    "label": "2022-10",
    "foodYoy": 12.4,
    "foodIdx": 123.4,
    "allIdx": 116.6
  },
  {
    "label": "2022-11",
    "foodYoy": 12,
    "foodIdx": 123.4,
    "allIdx": 116.4
  },
  {
    "label": "2022-12",
    "foodYoy": 11.8,
    "foodIdx": 123.7,
    "allIdx": 116.1
  },
  {
    "label": "2023-01",
    "foodYoy": 11.3,
    "foodIdx": 124.7,
    "allIdx": 117
  },
  {
    "label": "2023-02",
    "foodYoy": 10.2,
    "foodIdx": 125.1,
    "allIdx": 117.7
  },
  {
    "label": "2023-03",
    "foodYoy": 8.4,
    "foodIdx": 124.9,
    "allIdx": 118.1
  },
  {
    "label": "2023-04",
    "foodYoy": 7.1,
    "foodIdx": 125,
    "allIdx": 118.7
  },
  {
    "label": "2023-05",
    "foodYoy": 5.8,
    "foodIdx": 125.1,
    "allIdx": 119
  },
  {
    "label": "2023-06",
    "foodYoy": 4.7,
    "foodIdx": 125,
    "allIdx": 119.3
  },
  {
    "label": "2023-07",
    "foodYoy": 3.6,
    "foodIdx": 125.5,
    "allIdx": 119.6
  },
  {
    "label": "2023-08",
    "foodYoy": 3,
    "foodIdx": 125.6,
    "allIdx": 120.1
  },
  {
    "label": "2023-09",
    "foodYoy": 2.4,
    "foodIdx": 125.7,
    "allIdx": 120.4
  },
  {
    "label": "2023-10",
    "foodYoy": 2.1,
    "foodIdx": 126.1,
    "allIdx": 120.3
  },
  {
    "label": "2023-11",
    "foodYoy": 1.7,
    "foodIdx": 125.4,
    "allIdx": 120.1
  },
  {
    "label": "2023-12",
    "foodYoy": 1.3,
    "foodIdx": 125.3,
    "allIdx": 120
  },
  {
    "label": "2024-01",
    "foodYoy": 1.2,
    "foodIdx": 126.2,
    "allIdx": 120.6
  },
  {
    "label": "2024-02",
    "foodYoy": 1,
    "foodIdx": 126.3,
    "allIdx": 121.4
  },
  {
    "label": "2024-03",
    "foodYoy": 1.2,
    "foodIdx": 126.3,
    "allIdx": 122.2
  },
  {
    "label": "2024-04",
    "foodYoy": 1.1,
    "foodIdx": 126.4,
    "allIdx": 122.6
  },
  {
    "label": "2024-05",
    "foodYoy": 1,
    "foodIdx": 126.4,
    "allIdx": 122.8
  },
  {
    "label": "2024-06",
    "foodYoy": 1.1,
    "foodIdx": 126.5,
    "allIdx": 122.9
  },
  {
    "label": "2024-07",
    "foodYoy": 1.1,
    "foodIdx": 126.8,
    "allIdx": 123
  },
  {
    "label": "2024-08",
    "foodYoy": 0.9,
    "foodIdx": 126.7,
    "allIdx": 123.1
  },
  {
    "label": "2024-09",
    "foodYoy": 1.3,
    "foodIdx": 127.3,
    "allIdx": 123.3
  },
  {
    "label": "2024-10",
    "foodYoy": 1.1,
    "foodIdx": 127.5,
    "allIdx": 123.5
  },
  {
    "label": "2024-11",
    "foodYoy": 1.6,
    "foodIdx": 127.4,
    "allIdx": 123.4
  },
  {
    "label": "2024-12",
    "foodYoy": 1.8,
    "foodIdx": 127.5,
    "allIdx": 123.4
  },
  {
    "label": "2025-01",
    "foodYoy": 1.9,
    "foodIdx": 128.6,
    "allIdx": 124.3
  },
  {
    "label": "2025-02",
    "foodYoy": 1.9,
    "foodIdx": 128.7,
    "allIdx": 124.8
  },
  {
    "label": "2025-03",
    "foodYoy": 2.4,
    "foodIdx": 129.4,
    "allIdx": 125.1
  },
  {
    "label": "2025-04",
    "foodYoy": 2,
    "foodIdx": 129,
    "allIdx": 125.5
  },
  {
    "label": "2025-05",
    "foodYoy": 2.2,
    "foodIdx": 129.2,
    "allIdx": 125.7
  },
  {
    "label": "2025-06",
    "foodYoy": 2.4,
    "foodIdx": 129.5,
    "allIdx": 126.2
  },
  {
    "label": "2025-07",
    "foodYoy": 2.2,
    "foodIdx": 129.6,
    "allIdx": 126.4
  },
  {
    "label": "2025-08",
    "foodYoy": 2.7,
    "foodIdx": 130.1,
    "allIdx": 126.7
  },
  {
    "label": "2025-09",
    "foodYoy": 2.7,
    "foodIdx": 130.7,
    "allIdx": 127
  },
  {
    "label": "2025-11",
    "foodYoy": 1.9,
    "foodIdx": 129.9,
    "allIdx": 126.8
  },
  {
    "label": "2025-12",
    "foodYoy": 2.4,
    "foodIdx": 130.6,
    "allIdx": 126.8
  },
  {
    "label": "2026-01",
    "foodYoy": 2.1,
    "foodIdx": 131.3,
    "allIdx": 127.2
  },
  {
    "label": "2026-02",
    "foodYoy": 2.4,
    "foodIdx": 131.9,
    "allIdx": 127.8
  },
  {
    "label": "2026-03",
    "foodYoy": 1.9,
    "foodIdx": 131.8,
    "allIdx": 129.2
  },
  {
    "label": "2026-04",
    "foodYoy": 2.9,
    "foodIdx": 132.7,
    "allIdx": 130.3
  },
  {
    "label": "2026-05",
    "foodYoy": 2.7,
    "foodIdx": 132.8,
    "allIdx": 131.1
  },
  {
    "label": "2026-06",
    "foodYoy": 2.7,
    "foodIdx": 133,
    "allIdx": 130.6
  },
  {
    "label": "2026-07",
    "foodYoy": 2.7,
    "foodIdx": 133,
    "allIdx": 130.6
  }
] as const;

export const ANNUAL = [
  {
    "year": 2019,
    "foodIdx": 100,
    "wageIdx": 100,
    "allIdx": 100,
    "awayIdx": 100,
    "gapPp": 0,
    "wageUsd": 917,
    "months": 12
  },
  {
    "year": 2020,
    "foodIdx": 103.5,
    "wageIdx": 107.3,
    "allIdx": 101.2,
    "awayIdx": 103.4,
    "gapPp": -3.8,
    "wageUsd": 984,
    "months": 12
  },
  {
    "year": 2021,
    "foodIdx": 107.1,
    "wageIdx": 108.8,
    "allIdx": 106,
    "awayIdx": 108,
    "gapPp": -1.7,
    "wageUsd": 998,
    "months": 12
  },
  {
    "year": 2022,
    "foodIdx": 119.3,
    "wageIdx": 115.4,
    "allIdx": 114.5,
    "awayIdx": 116.3,
    "gapPp": 3.9,
    "wageUsd": 1058,
    "months": 12
  },
  {
    "year": 2023,
    "foodIdx": 125.3,
    "wageIdx": 121.6,
    "allIdx": 119.2,
    "awayIdx": 124.6,
    "gapPp": 3.7,
    "wageUsd": 1116,
    "months": 12
  },
  {
    "year": 2024,
    "foodIdx": 126.8,
    "wageIdx": 126.5,
    "allIdx": 122.7,
    "awayIdx": 129.7,
    "gapPp": 0.3,
    "wageUsd": 1160,
    "months": 12
  },
  {
    "year": 2025,
    "foodIdx": 129.6,
    "wageIdx": 131.3,
    "allIdx": 125.9,
    "awayIdx": 134.4,
    "gapPp": -1.7,
    "wageUsd": 1204,
    "months": 11
  },
  {
    "year": 2026,
    "foodIdx": 132.4,
    "wageIdx": 135.8,
    "allIdx": 129.5,
    "awayIdx": 138.4,
    "gapPp": -3.4,
    "wageUsd": 1246,
    "months": 7
  }
] as const;

export const SUMMARY_TABLE = [
  {
    "year": 2019,
    "foodIdx": 100,
    "wageIdx": 100,
    "awayIdx": 100,
    "allIdx": 100,
    "gapPp": 0,
    "wageUsd": 917
  },
  {
    "year": 2020,
    "foodIdx": 103.5,
    "wageIdx": 107.3,
    "awayIdx": 103.4,
    "allIdx": 101.2,
    "gapPp": -3.8,
    "wageUsd": 984
  },
  {
    "year": 2021,
    "foodIdx": 107.1,
    "wageIdx": 108.8,
    "awayIdx": 108,
    "allIdx": 106,
    "gapPp": -1.7,
    "wageUsd": 998
  },
  {
    "year": 2022,
    "foodIdx": 119.3,
    "wageIdx": 115.4,
    "awayIdx": 116.3,
    "allIdx": 114.5,
    "gapPp": 3.9,
    "wageUsd": 1058
  },
  {
    "year": 2023,
    "foodIdx": 125.3,
    "wageIdx": 121.6,
    "awayIdx": 124.6,
    "allIdx": 119.2,
    "gapPp": 3.7,
    "wageUsd": 1116
  },
  {
    "year": 2024,
    "foodIdx": 126.8,
    "wageIdx": 126.5,
    "awayIdx": 129.7,
    "allIdx": 122.7,
    "gapPp": 0.3,
    "wageUsd": 1160
  },
  {
    "year": 2025,
    "foodIdx": 129.6,
    "wageIdx": 131.3,
    "awayIdx": 134.4,
    "allIdx": 125.9,
    "gapPp": -1.7,
    "wageUsd": 1204
  },
  {
    "year": 2026,
    "foodIdx": 132.4,
    "wageIdx": 135.8,
    "awayIdx": 138.4,
    "allIdx": 129.5,
    "gapPp": -3.4,
    "wageUsd": 1246
  }
] as const;

export const EPOCH_BARS = [
  {
    "id": "pre",
    "label": "2019–20",
    "start": "2019Q1",
    "end": "2020Q4",
    "foodIdx": 103.5,
    "wageIdx": 107.3,
    "awayIdx": 103.4,
    "allIdx": 101.2,
    "gapPp": -3.8
  },
  {
    "id": "reopen",
    "label": "2021",
    "start": "2021Q1",
    "end": "2021Q4",
    "foodIdx": null,
    "wageIdx": null,
    "awayIdx": null,
    "allIdx": null,
    "gapPp": null
  },
  {
    "id": "spike",
    "label": "2022–23 spike",
    "start": "2022Q1",
    "end": "2023Q4",
    "foodIdx": 125.3,
    "wageIdx": 121.6,
    "awayIdx": 124.5,
    "allIdx": 119.2,
    "gapPp": 3.6
  },
  {
    "id": "catchup",
    "label": "2024–26 catch-up",
    "start": "2024Q1",
    "end": "2026Q2",
    "foodIdx": 130.5,
    "wageIdx": 133.1,
    "awayIdx": 135.7,
    "allIdx": 127.2,
    "gapPp": -2.6
  }
] as const;

export const CATEGORY_LATEST = [
  {
    "id": "cereals",
    "label": "Cereals & bakery",
    "color": "#b45309",
    "idx": 133.7,
    "pct": 33.7
  },
  {
    "id": "meats",
    "label": "Meats, poultry, fish & eggs",
    "color": "#be123c",
    "idx": 140.4,
    "pct": 40.4
  },
  {
    "id": "dairy",
    "label": "Dairy & related",
    "color": "#0369a1",
    "idx": 122.8,
    "pct": 22.8
  },
  {
    "id": "fruits",
    "label": "Fruits & vegetables",
    "color": "#15803d",
    "idx": 139,
    "pct": 39
  },
  {
    "id": "nonalc",
    "label": "Nonalcoholic beverages",
    "color": "#7c3aed",
    "idx": 134.4,
    "pct": 34.4
  },
  {
    "id": "other",
    "label": "Other food at home",
    "color": "#64748b",
    "idx": 119.3,
    "pct": 19.3
  }
] as const;

export const CATEGORY_MONTHLY = {
  "cereals": [
    {
      "label": "2019-01",
      "idx": 99.5,
      "raw": 275.05
    },
    {
      "label": "2019-02",
      "idx": 99.8,
      "raw": 275.996
    },
    {
      "label": "2019-03",
      "idx": 100.3,
      "raw": 277.275
    },
    {
      "label": "2019-04",
      "idx": 100,
      "raw": 276.64
    },
    {
      "label": "2019-05",
      "idx": 100.4,
      "raw": 277.795
    },
    {
      "label": "2019-06",
      "idx": 100.1,
      "raw": 276.891
    },
    {
      "label": "2019-07",
      "idx": 100.3,
      "raw": 277.49
    },
    {
      "label": "2019-08",
      "idx": 100,
      "raw": 276.619
    },
    {
      "label": "2019-09",
      "idx": 100.3,
      "raw": 277.308
    },
    {
      "label": "2019-10",
      "idx": 100,
      "raw": 276.47
    },
    {
      "label": "2019-11",
      "idx": 99.9,
      "raw": 276.166
    },
    {
      "label": "2019-12",
      "idx": 99.4,
      "raw": 275.036
    },
    {
      "label": "2020-01",
      "idx": 99.8,
      "raw": 275.916
    },
    {
      "label": "2020-02",
      "idx": 100,
      "raw": 276.641
    },
    {
      "label": "2020-03",
      "idx": 100.4,
      "raw": 277.646
    },
    {
      "label": "2020-04",
      "idx": 103.1,
      "raw": 285.16
    },
    {
      "label": "2020-05",
      "idx": 103,
      "raw": 284.937
    },
    {
      "label": "2020-06",
      "idx": 103.4,
      "raw": 286.092
    },
    {
      "label": "2020-07",
      "idx": 103.1,
      "raw": 285.204
    },
    {
      "label": "2020-08",
      "idx": 102.9,
      "raw": 284.472
    },
    {
      "label": "2020-09",
      "idx": 102.8,
      "raw": 284.416
    },
    {
      "label": "2020-10",
      "idx": 103,
      "raw": 284.74
    },
    {
      "label": "2020-11",
      "idx": 102.2,
      "raw": 282.782
    },
    {
      "label": "2020-12",
      "idx": 102.6,
      "raw": 283.735
    },
    {
      "label": "2021-01",
      "idx": 102.3,
      "raw": 282.911
    },
    {
      "label": "2021-02",
      "idx": 102.7,
      "raw": 284.095
    },
    {
      "label": "2021-03",
      "idx": 103,
      "raw": 284.746
    },
    {
      "label": "2021-04",
      "idx": 103.2,
      "raw": 285.377
    },
    {
      "label": "2021-05",
      "idx": 103.6,
      "raw": 286.649
    },
    {
      "label": "2021-06",
      "idx": 103.7,
      "raw": 286.761
    },
    {
      "label": "2021-07",
      "idx": 104.7,
      "raw": 289.533
    },
    {
      "label": "2021-08",
      "idx": 104.5,
      "raw": 288.99
    },
    {
      "label": "2021-09",
      "idx": 105.6,
      "raw": 292.069
    },
    {
      "label": "2021-10",
      "idx": 106.5,
      "raw": 294.625
    },
    {
      "label": "2021-11",
      "idx": 107,
      "raw": 295.909
    },
    {
      "label": "2021-12",
      "idx": 107.5,
      "raw": 297.279
    },
    {
      "label": "2022-01",
      "idx": 109.3,
      "raw": 302.242
    },
    {
      "label": "2022-02",
      "idx": 110.7,
      "raw": 306.193
    },
    {
      "label": "2022-03",
      "idx": 112.7,
      "raw": 311.606
    },
    {
      "label": "2022-04",
      "idx": 113.8,
      "raw": 314.787
    },
    {
      "label": "2022-05",
      "idx": 115.7,
      "raw": 319.93
    },
    {
      "label": "2022-06",
      "idx": 118,
      "raw": 326.378
    },
    {
      "label": "2022-07",
      "idx": 120.4,
      "raw": 332.968
    },
    {
      "label": "2022-08",
      "idx": 121.6,
      "raw": 336.399
    },
    {
      "label": "2022-09",
      "idx": 122.7,
      "raw": 339.336
    },
    {
      "label": "2022-10",
      "idx": 123.5,
      "raw": 341.492
    },
    {
      "label": "2022-11",
      "idx": 124.5,
      "raw": 344.393
    },
    {
      "label": "2022-12",
      "idx": 124.8,
      "raw": 345.029
    },
    {
      "label": "2023-01",
      "idx": 126.3,
      "raw": 349.294
    },
    {
      "label": "2023-02",
      "idx": 126.8,
      "raw": 350.772
    },
    {
      "label": "2023-03",
      "idx": 128,
      "raw": 353.866
    },
    {
      "label": "2023-04",
      "idx": 127.9,
      "raw": 353.742
    },
    {
      "label": "2023-05",
      "idx": 128.1,
      "raw": 354.195
    },
    {
      "label": "2023-06",
      "idx": 128.4,
      "raw": 355.074
    },
    {
      "label": "2023-07",
      "idx": 128.9,
      "raw": 356.377
    },
    {
      "label": "2023-08",
      "idx": 128.9,
      "raw": 356.563
    },
    {
      "label": "2023-09",
      "idx": 128.6,
      "raw": 355.576
    },
    {
      "label": "2023-10",
      "idx": 128.6,
      "raw": 355.752
    },
    {
      "label": "2023-11",
      "idx": 128.8,
      "raw": 356.169
    },
    {
      "label": "2023-12",
      "idx": 127.9,
      "raw": 353.844
    },
    {
      "label": "2024-01",
      "idx": 128.2,
      "raw": 354.532
    },
    {
      "label": "2024-02",
      "idx": 129,
      "raw": 356.633
    },
    {
      "label": "2024-03",
      "idx": 128.2,
      "raw": 354.666
    },
    {
      "label": "2024-04",
      "idx": 128.7,
      "raw": 355.852
    },
    {
      "label": "2024-05",
      "idx": 129,
      "raw": 356.758
    },
    {
      "label": "2024-06",
      "idx": 129.1,
      "raw": 356.938
    },
    {
      "label": "2024-07",
      "idx": 128.9,
      "raw": 356.525
    },
    {
      "label": "2024-08",
      "idx": 128.6,
      "raw": 355.652
    },
    {
      "label": "2024-09",
      "idx": 128.8,
      "raw": 356.088
    },
    {
      "label": "2024-10",
      "idx": 129.8,
      "raw": 359.007
    },
    {
      "label": "2024-11",
      "idx": 128.1,
      "raw": 354.371
    },
    {
      "label": "2024-12",
      "idx": 128.9,
      "raw": 356.574
    },
    {
      "label": "2025-01",
      "idx": 128.7,
      "raw": 355.964
    },
    {
      "label": "2025-02",
      "idx": 129.3,
      "raw": 357.627
    },
    {
      "label": "2025-03",
      "idx": 129.6,
      "raw": 358.45
    },
    {
      "label": "2025-04",
      "idx": 128.7,
      "raw": 355.976
    },
    {
      "label": "2025-05",
      "idx": 130.3,
      "raw": 360.325
    },
    {
      "label": "2025-06",
      "idx": 130.2,
      "raw": 360.04
    },
    {
      "label": "2025-07",
      "idx": 130.2,
      "raw": 360.048
    },
    {
      "label": "2025-08",
      "idx": 130.1,
      "raw": 359.74
    },
    {
      "label": "2025-09",
      "idx": 130.9,
      "raw": 361.894
    },
    {
      "label": "2025-11",
      "idx": 130.6,
      "raw": 361.255
    },
    {
      "label": "2025-12",
      "idx": 130.9,
      "raw": 361.984
    },
    {
      "label": "2026-01",
      "idx": 132.6,
      "raw": 366.83
    },
    {
      "label": "2026-02",
      "idx": 132.8,
      "raw": 367.174
    },
    {
      "label": "2026-03",
      "idx": 132.3,
      "raw": 365.909
    },
    {
      "label": "2026-04",
      "idx": 132.1,
      "raw": 365.366
    },
    {
      "label": "2026-05",
      "idx": 132.8,
      "raw": 367.3
    },
    {
      "label": "2026-06",
      "idx": 133.4,
      "raw": 368.8
    },
    {
      "label": "2026-07",
      "idx": 133.7,
      "raw": 369.882
    }
  ],
  "meats": [
    {
      "label": "2019-01",
      "idx": 99.3,
      "raw": 248.169
    },
    {
      "label": "2019-02",
      "idx": 99.5,
      "raw": 248.597
    },
    {
      "label": "2019-03",
      "idx": 99.7,
      "raw": 249.062
    },
    {
      "label": "2019-04",
      "idx": 99.8,
      "raw": 249.203
    },
    {
      "label": "2019-05",
      "idx": 100.2,
      "raw": 250.356
    },
    {
      "label": "2019-06",
      "idx": 99.8,
      "raw": 249.231
    },
    {
      "label": "2019-07",
      "idx": 100.1,
      "raw": 250.033
    },
    {
      "label": "2019-08",
      "idx": 99.8,
      "raw": 249.277
    },
    {
      "label": "2019-09",
      "idx": 100,
      "raw": 249.74
    },
    {
      "label": "2019-10",
      "idx": 100.3,
      "raw": 250.592
    },
    {
      "label": "2019-11",
      "idx": 100.3,
      "raw": 250.491
    },
    {
      "label": "2019-12",
      "idx": 101.2,
      "raw": 252.893
    },
    {
      "label": "2020-01",
      "idx": 101.2,
      "raw": 252.905
    },
    {
      "label": "2020-02",
      "idx": 101.4,
      "raw": 253.396
    },
    {
      "label": "2020-03",
      "idx": 102,
      "raw": 254.724
    },
    {
      "label": "2020-04",
      "idx": 106.6,
      "raw": 266.263
    },
    {
      "label": "2020-05",
      "idx": 110.2,
      "raw": 275.405
    },
    {
      "label": "2020-06",
      "idx": 112.5,
      "raw": 281.139
    },
    {
      "label": "2020-07",
      "idx": 108.5,
      "raw": 271.028
    },
    {
      "label": "2020-08",
      "idx": 106.9,
      "raw": 266.969
    },
    {
      "label": "2020-09",
      "idx": 106.2,
      "raw": 265.386
    },
    {
      "label": "2020-10",
      "idx": 106.4,
      "raw": 265.796
    },
    {
      "label": "2020-11",
      "idx": 106.2,
      "raw": 265.307
    },
    {
      "label": "2020-12",
      "idx": 105.9,
      "raw": 264.475
    },
    {
      "label": "2021-01",
      "idx": 106.5,
      "raw": 265.922
    },
    {
      "label": "2021-02",
      "idx": 106.7,
      "raw": 266.606
    },
    {
      "label": "2021-03",
      "idx": 107.5,
      "raw": 268.457
    },
    {
      "label": "2021-04",
      "idx": 108.7,
      "raw": 271.459
    },
    {
      "label": "2021-05",
      "idx": 110.4,
      "raw": 275.776
    },
    {
      "label": "2021-06",
      "idx": 113.3,
      "raw": 282.993
    },
    {
      "label": "2021-07",
      "idx": 114.9,
      "raw": 286.994
    },
    {
      "label": "2021-08",
      "idx": 115.4,
      "raw": 288.367
    },
    {
      "label": "2021-09",
      "idx": 117.4,
      "raw": 293.217
    },
    {
      "label": "2021-10",
      "idx": 119,
      "raw": 297.377
    },
    {
      "label": "2021-11",
      "idx": 119.8,
      "raw": 299.228
    },
    {
      "label": "2021-12",
      "idx": 119.1,
      "raw": 297.604
    },
    {
      "label": "2022-01",
      "idx": 119.5,
      "raw": 298.441
    },
    {
      "label": "2022-02",
      "idx": 120.6,
      "raw": 301.24
    },
    {
      "label": "2022-03",
      "idx": 122.1,
      "raw": 305.116
    },
    {
      "label": "2022-04",
      "idx": 124.3,
      "raw": 310.399
    },
    {
      "label": "2022-05",
      "idx": 126.1,
      "raw": 314.929
    },
    {
      "label": "2022-06",
      "idx": 126.5,
      "raw": 316.11
    },
    {
      "label": "2022-07",
      "idx": 127.4,
      "raw": 318.141
    },
    {
      "label": "2022-08",
      "idx": 127.6,
      "raw": 318.867
    },
    {
      "label": "2022-09",
      "idx": 127.9,
      "raw": 319.486
    },
    {
      "label": "2022-10",
      "idx": 128.6,
      "raw": 321.271
    },
    {
      "label": "2022-11",
      "idx": 127.9,
      "raw": 319.444
    },
    {
      "label": "2022-12",
      "idx": 128.3,
      "raw": 320.455
    },
    {
      "label": "2023-01",
      "idx": 129.2,
      "raw": 322.737
    },
    {
      "label": "2023-02",
      "idx": 128.8,
      "raw": 321.803
    },
    {
      "label": "2023-03",
      "idx": 127.4,
      "raw": 318.306
    },
    {
      "label": "2023-04",
      "idx": 127.7,
      "raw": 318.996
    },
    {
      "label": "2023-05",
      "idx": 126.5,
      "raw": 315.968
    },
    {
      "label": "2023-06",
      "idx": 126.3,
      "raw": 315.561
    },
    {
      "label": "2023-07",
      "idx": 127.1,
      "raw": 317.445
    },
    {
      "label": "2023-08",
      "idx": 127.7,
      "raw": 318.944
    },
    {
      "label": "2023-09",
      "idx": 128.2,
      "raw": 320.14
    },
    {
      "label": "2023-10",
      "idx": 129.1,
      "raw": 322.536
    },
    {
      "label": "2023-11",
      "idx": 128,
      "raw": 319.86
    },
    {
      "label": "2023-12",
      "idx": 128.2,
      "raw": 320.143
    },
    {
      "label": "2024-01",
      "idx": 128,
      "raw": 319.752
    },
    {
      "label": "2024-02",
      "idx": 128.1,
      "raw": 320.096
    },
    {
      "label": "2024-03",
      "idx": 129.1,
      "raw": 322.589
    },
    {
      "label": "2024-04",
      "idx": 129,
      "raw": 322.323
    },
    {
      "label": "2024-05",
      "idx": 129.5,
      "raw": 323.414
    },
    {
      "label": "2024-06",
      "idx": 129.6,
      "raw": 323.848
    },
    {
      "label": "2024-07",
      "idx": 130.9,
      "raw": 327.013
    },
    {
      "label": "2024-08",
      "idx": 131.7,
      "raw": 329.108
    },
    {
      "label": "2024-09",
      "idx": 133.1,
      "raw": 332.525
    },
    {
      "label": "2024-10",
      "idx": 131.6,
      "raw": 328.743
    },
    {
      "label": "2024-11",
      "idx": 132.9,
      "raw": 331.976
    },
    {
      "label": "2024-12",
      "idx": 133.6,
      "raw": 333.659
    },
    {
      "label": "2025-01",
      "idx": 135.8,
      "raw": 339.169
    },
    {
      "label": "2025-02",
      "idx": 138,
      "raw": 344.781
    },
    {
      "label": "2025-03",
      "idx": 139.4,
      "raw": 348.179
    },
    {
      "label": "2025-04",
      "idx": 138.1,
      "raw": 344.883
    },
    {
      "label": "2025-05",
      "idx": 137.3,
      "raw": 343.032
    },
    {
      "label": "2025-06",
      "idx": 136.9,
      "raw": 342.058
    },
    {
      "label": "2025-07",
      "idx": 137.8,
      "raw": 344.155
    },
    {
      "label": "2025-08",
      "idx": 139.1,
      "raw": 347.509
    },
    {
      "label": "2025-09",
      "idx": 140,
      "raw": 349.716
    },
    {
      "label": "2025-11",
      "idx": 139.1,
      "raw": 347.565
    },
    {
      "label": "2025-12",
      "idx": 138.8,
      "raw": 346.815
    },
    {
      "label": "2026-01",
      "idx": 138.8,
      "raw": 346.613
    },
    {
      "label": "2026-02",
      "idx": 138.6,
      "raw": 346.309
    },
    {
      "label": "2026-03",
      "idx": 138.2,
      "raw": 345.203
    },
    {
      "label": "2026-04",
      "idx": 140.1,
      "raw": 349.965
    },
    {
      "label": "2026-05",
      "idx": 139.8,
      "raw": 349.34
    },
    {
      "label": "2026-06",
      "idx": 140.5,
      "raw": 350.974
    },
    {
      "label": "2026-07",
      "idx": 140.4,
      "raw": 350.612
    }
  ],
  "dairy": [
    {
      "label": "2019-01",
      "idx": 101.2,
      "raw": 304.605
    },
    {
      "label": "2019-02",
      "idx": 101.3,
      "raw": 304.621
    },
    {
      "label": "2019-03",
      "idx": 101.5,
      "raw": 305.399
    },
    {
      "label": "2019-04",
      "idx": 100.9,
      "raw": 303.503
    },
    {
      "label": "2019-05",
      "idx": 100.5,
      "raw": 302.352
    },
    {
      "label": "2019-06",
      "idx": 99.3,
      "raw": 298.611
    },
    {
      "label": "2019-07",
      "idx": 99.5,
      "raw": 299.35
    },
    {
      "label": "2019-08",
      "idx": 99.3,
      "raw": 298.6
    },
    {
      "label": "2019-09",
      "idx": 98.8,
      "raw": 297.309
    },
    {
      "label": "2019-10",
      "idx": 100.2,
      "raw": 301.318
    },
    {
      "label": "2019-11",
      "idx": 98.9,
      "raw": 297.472
    },
    {
      "label": "2019-12",
      "idx": 98.8,
      "raw": 297.105
    },
    {
      "label": "2020-01",
      "idx": 100.3,
      "raw": 301.679
    },
    {
      "label": "2020-02",
      "idx": 99.7,
      "raw": 299.817
    },
    {
      "label": "2020-03",
      "idx": 99.6,
      "raw": 299.641
    },
    {
      "label": "2020-04",
      "idx": 101.3,
      "raw": 304.809
    },
    {
      "label": "2020-05",
      "idx": 102,
      "raw": 306.798
    },
    {
      "label": "2020-06",
      "idx": 101.5,
      "raw": 305.393
    },
    {
      "label": "2020-07",
      "idx": 101.8,
      "raw": 306.123
    },
    {
      "label": "2020-08",
      "idx": 102,
      "raw": 306.754
    },
    {
      "label": "2020-09",
      "idx": 101.8,
      "raw": 306.249
    },
    {
      "label": "2020-10",
      "idx": 102.7,
      "raw": 309.071
    },
    {
      "label": "2020-11",
      "idx": 101.8,
      "raw": 306.311
    },
    {
      "label": "2020-12",
      "idx": 101.9,
      "raw": 306.506
    },
    {
      "label": "2021-01",
      "idx": 103,
      "raw": 309.954
    },
    {
      "label": "2021-02",
      "idx": 103,
      "raw": 309.993
    },
    {
      "label": "2021-03",
      "idx": 103.4,
      "raw": 311.168
    },
    {
      "label": "2021-04",
      "idx": 104.7,
      "raw": 314.973
    },
    {
      "label": "2021-05",
      "idx": 105,
      "raw": 315.748
    },
    {
      "label": "2021-06",
      "idx": 104.8,
      "raw": 315.211
    },
    {
      "label": "2021-07",
      "idx": 104,
      "raw": 312.875
    },
    {
      "label": "2021-08",
      "idx": 104.3,
      "raw": 313.672
    },
    {
      "label": "2021-09",
      "idx": 104.8,
      "raw": 315.428
    },
    {
      "label": "2021-10",
      "idx": 105.8,
      "raw": 318.316
    },
    {
      "label": "2021-11",
      "idx": 105.8,
      "raw": 318.436
    },
    {
      "label": "2021-12",
      "idx": 107,
      "raw": 321.931
    },
    {
      "label": "2022-01",
      "idx": 108.8,
      "raw": 327.451
    },
    {
      "label": "2022-02",
      "idx": 110.9,
      "raw": 333.675
    },
    {
      "label": "2022-03",
      "idx": 112.2,
      "raw": 337.503
    },
    {
      "label": "2022-04",
      "idx": 112.8,
      "raw": 339.385
    },
    {
      "label": "2022-05",
      "idx": 113.5,
      "raw": 341.594
    },
    {
      "label": "2022-06",
      "idx": 113.2,
      "raw": 340.594
    },
    {
      "label": "2022-07",
      "idx": 113.6,
      "raw": 341.839
    },
    {
      "label": "2022-08",
      "idx": 114.1,
      "raw": 343.221
    },
    {
      "label": "2022-09",
      "idx": 115.7,
      "raw": 348.173
    },
    {
      "label": "2022-10",
      "idx": 115.7,
      "raw": 348.021
    },
    {
      "label": "2022-11",
      "idx": 116.2,
      "raw": 349.462
    },
    {
      "label": "2022-12",
      "idx": 116,
      "raw": 349.134
    },
    {
      "label": "2023-01",
      "idx": 116.7,
      "raw": 351.029
    },
    {
      "label": "2023-02",
      "idx": 116.8,
      "raw": 351.249
    },
    {
      "label": "2023-03",
      "idx": 114.9,
      "raw": 345.814
    },
    {
      "label": "2023-04",
      "idx": 115.1,
      "raw": 346.269
    },
    {
      "label": "2023-05",
      "idx": 116.7,
      "raw": 350.986
    },
    {
      "label": "2023-06",
      "idx": 116.6,
      "raw": 350.724
    },
    {
      "label": "2023-07",
      "idx": 116.9,
      "raw": 351.646
    },
    {
      "label": "2023-08",
      "idx": 116.5,
      "raw": 350.428
    },
    {
      "label": "2023-09",
      "idx": 116.7,
      "raw": 351.02
    },
    {
      "label": "2023-10",
      "idx": 117,
      "raw": 351.952
    },
    {
      "label": "2023-11",
      "idx": 116.6,
      "raw": 350.736
    },
    {
      "label": "2023-12",
      "idx": 116.4,
      "raw": 350.25
    },
    {
      "label": "2024-01",
      "idx": 117.9,
      "raw": 354.798
    },
    {
      "label": "2024-02",
      "idx": 117.7,
      "raw": 353.965
    },
    {
      "label": "2024-03",
      "idx": 117.3,
      "raw": 352.841
    },
    {
      "label": "2024-04",
      "idx": 117.1,
      "raw": 352.274
    },
    {
      "label": "2024-05",
      "idx": 117.4,
      "raw": 353.084
    },
    {
      "label": "2024-06",
      "idx": 116,
      "raw": 348.901
    },
    {
      "label": "2024-07",
      "idx": 116.7,
      "raw": 350.962
    },
    {
      "label": "2024-08",
      "idx": 116.2,
      "raw": 349.599
    },
    {
      "label": "2024-09",
      "idx": 117.5,
      "raw": 353.508
    },
    {
      "label": "2024-10",
      "idx": 118.1,
      "raw": 355.292
    },
    {
      "label": "2024-11",
      "idx": 117.9,
      "raw": 354.696
    },
    {
      "label": "2024-12",
      "idx": 117.5,
      "raw": 353.63
    },
    {
      "label": "2025-01",
      "idx": 118.3,
      "raw": 355.837
    },
    {
      "label": "2025-02",
      "idx": 117.4,
      "raw": 353.197
    },
    {
      "label": "2025-03",
      "idx": 116.5,
      "raw": 350.379
    },
    {
      "label": "2025-04",
      "idx": 116.1,
      "raw": 349.187
    },
    {
      "label": "2025-05",
      "idx": 116.8,
      "raw": 351.335
    },
    {
      "label": "2025-06",
      "idx": 116.8,
      "raw": 351.414
    },
    {
      "label": "2025-07",
      "idx": 116.9,
      "raw": 351.764
    },
    {
      "label": "2025-08",
      "idx": 118.4,
      "raw": 356.104
    },
    {
      "label": "2025-09",
      "idx": 119,
      "raw": 358.019
    },
    {
      "label": "2025-11",
      "idx": 118,
      "raw": 355.125
    },
    {
      "label": "2025-12",
      "idx": 118.1,
      "raw": 355.246
    },
    {
      "label": "2026-01",
      "idx": 119.3,
      "raw": 358.84
    },
    {
      "label": "2026-02",
      "idx": 120.5,
      "raw": 362.604
    },
    {
      "label": "2026-03",
      "idx": 121.1,
      "raw": 364.219
    },
    {
      "label": "2026-04",
      "idx": 123.1,
      "raw": 370.431
    },
    {
      "label": "2026-05",
      "idx": 123.9,
      "raw": 372.644
    },
    {
      "label": "2026-06",
      "idx": 123,
      "raw": 370.09
    },
    {
      "label": "2026-07",
      "idx": 122.8,
      "raw": 369.55
    }
  ],
  "fruits": [
    {
      "label": "2019-01",
      "idx": 100.3,
      "raw": 171.354
    },
    {
      "label": "2019-02",
      "idx": 101,
      "raw": 172.488
    },
    {
      "label": "2019-03",
      "idx": 100.7,
      "raw": 172.06
    },
    {
      "label": "2019-04",
      "idx": 99.9,
      "raw": 170.727
    },
    {
      "label": "2019-05",
      "idx": 100.2,
      "raw": 171.26
    },
    {
      "label": "2019-06",
      "idx": 99.6,
      "raw": 170.23
    },
    {
      "label": "2019-07",
      "idx": 99.3,
      "raw": 169.685
    },
    {
      "label": "2019-08",
      "idx": 99.6,
      "raw": 170.067
    },
    {
      "label": "2019-09",
      "idx": 99.9,
      "raw": 170.63
    },
    {
      "label": "2019-10",
      "idx": 100,
      "raw": 170.842
    },
    {
      "label": "2019-11",
      "idx": 99.9,
      "raw": 170.675
    },
    {
      "label": "2019-12",
      "idx": 99.5,
      "raw": 170.006
    },
    {
      "label": "2020-01",
      "idx": 100.9,
      "raw": 172.313
    },
    {
      "label": "2020-02",
      "idx": 101.4,
      "raw": 173.194
    },
    {
      "label": "2020-03",
      "idx": 102.1,
      "raw": 174.454
    },
    {
      "label": "2020-04",
      "idx": 104.9,
      "raw": 179.235
    },
    {
      "label": "2020-05",
      "idx": 104.3,
      "raw": 178.234
    },
    {
      "label": "2020-06",
      "idx": 104.9,
      "raw": 179.19
    },
    {
      "label": "2020-07",
      "idx": 104.3,
      "raw": 178.167
    },
    {
      "label": "2020-08",
      "idx": 104.6,
      "raw": 178.684
    },
    {
      "label": "2020-09",
      "idx": 104.1,
      "raw": 177.848
    },
    {
      "label": "2020-10",
      "idx": 104.4,
      "raw": 178.4
    },
    {
      "label": "2020-11",
      "idx": 102.9,
      "raw": 175.869
    },
    {
      "label": "2020-12",
      "idx": 103.9,
      "raw": 177.539
    },
    {
      "label": "2021-01",
      "idx": 105.2,
      "raw": 179.789
    },
    {
      "label": "2021-02",
      "idx": 105.5,
      "raw": 180.202
    },
    {
      "label": "2021-03",
      "idx": 105.4,
      "raw": 180.018
    },
    {
      "label": "2021-04",
      "idx": 105.1,
      "raw": 179.57
    },
    {
      "label": "2021-05",
      "idx": 104.1,
      "raw": 177.814
    },
    {
      "label": "2021-06",
      "idx": 105.1,
      "raw": 179.527
    },
    {
      "label": "2021-07",
      "idx": 105.4,
      "raw": 180.136
    },
    {
      "label": "2021-08",
      "idx": 106.7,
      "raw": 182.277
    },
    {
      "label": "2021-09",
      "idx": 108,
      "raw": 184.49
    },
    {
      "label": "2021-10",
      "idx": 109.1,
      "raw": 186.387
    },
    {
      "label": "2021-11",
      "idx": 108.4,
      "raw": 185.119
    },
    {
      "label": "2021-12",
      "idx": 109.3,
      "raw": 186.723
    },
    {
      "label": "2022-01",
      "idx": 110.5,
      "raw": 188.719
    },
    {
      "label": "2022-02",
      "idx": 112.5,
      "raw": 192.21
    },
    {
      "label": "2022-03",
      "idx": 113.8,
      "raw": 194.342
    },
    {
      "label": "2022-04",
      "idx": 115.4,
      "raw": 197.138
    },
    {
      "label": "2022-05",
      "idx": 116.6,
      "raw": 199.166
    },
    {
      "label": "2022-06",
      "idx": 117.6,
      "raw": 200.876
    },
    {
      "label": "2022-07",
      "idx": 120,
      "raw": 204.944
    },
    {
      "label": "2022-08",
      "idx": 121,
      "raw": 206.693
    },
    {
      "label": "2022-09",
      "idx": 121.9,
      "raw": 208.332
    },
    {
      "label": "2022-10",
      "idx": 123,
      "raw": 210.121
    },
    {
      "label": "2022-11",
      "idx": 122.6,
      "raw": 209.507
    },
    {
      "label": "2022-12",
      "idx": 123.1,
      "raw": 210.324
    },
    {
      "label": "2023-01",
      "idx": 124.9,
      "raw": 213.359
    },
    {
      "label": "2023-02",
      "idx": 126.4,
      "raw": 215.925
    },
    {
      "label": "2023-03",
      "idx": 126.6,
      "raw": 216.329
    },
    {
      "label": "2023-04",
      "idx": 126.3,
      "raw": 215.833
    },
    {
      "label": "2023-05",
      "idx": 126.7,
      "raw": 216.46
    },
    {
      "label": "2023-06",
      "idx": 126.5,
      "raw": 216.146
    },
    {
      "label": "2023-07",
      "idx": 126.5,
      "raw": 216.056
    },
    {
      "label": "2023-08",
      "idx": 126.8,
      "raw": 216.642
    },
    {
      "label": "2023-09",
      "idx": 126.9,
      "raw": 216.736
    },
    {
      "label": "2023-10",
      "idx": 127,
      "raw": 216.952
    },
    {
      "label": "2023-11",
      "idx": 126.2,
      "raw": 215.604
    },
    {
      "label": "2023-12",
      "idx": 126.4,
      "raw": 215.872
    },
    {
      "label": "2024-01",
      "idx": 129.1,
      "raw": 220.573
    },
    {
      "label": "2024-02",
      "idx": 129.3,
      "raw": 220.956
    },
    {
      "label": "2024-03",
      "idx": 129.6,
      "raw": 221.423
    },
    {
      "label": "2024-04",
      "idx": 129.2,
      "raw": 220.712
    },
    {
      "label": "2024-05",
      "idx": 128.4,
      "raw": 219.354
    },
    {
      "label": "2024-06",
      "idx": 128.4,
      "raw": 219.373
    },
    {
      "label": "2024-07",
      "idx": 128.9,
      "raw": 220.129
    },
    {
      "label": "2024-08",
      "idx": 128.4,
      "raw": 219.381
    },
    {
      "label": "2024-09",
      "idx": 128.5,
      "raw": 219.488
    },
    {
      "label": "2024-10",
      "idx": 129.2,
      "raw": 220.672
    },
    {
      "label": "2024-11",
      "idx": 129.8,
      "raw": 221.735
    },
    {
      "label": "2024-12",
      "idx": 129.2,
      "raw": 220.762
    },
    {
      "label": "2025-01",
      "idx": 132,
      "raw": 225.51
    },
    {
      "label": "2025-02",
      "idx": 132,
      "raw": 225.51
    },
    {
      "label": "2025-03",
      "idx": 132.8,
      "raw": 226.835
    },
    {
      "label": "2025-04",
      "idx": 133.3,
      "raw": 227.738
    },
    {
      "label": "2025-05",
      "idx": 132.4,
      "raw": 226.252
    },
    {
      "label": "2025-06",
      "idx": 134.1,
      "raw": 229.103
    },
    {
      "label": "2025-07",
      "idx": 133.5,
      "raw": 228.011
    },
    {
      "label": "2025-08",
      "idx": 134.3,
      "raw": 229.406
    },
    {
      "label": "2025-09",
      "idx": 135.3,
      "raw": 231.144
    },
    {
      "label": "2025-11",
      "idx": 135.4,
      "raw": 231.235
    },
    {
      "label": "2025-12",
      "idx": 135.8,
      "raw": 232.021
    },
    {
      "label": "2026-01",
      "idx": 138,
      "raw": 235.761
    },
    {
      "label": "2026-02",
      "idx": 139.4,
      "raw": 238.081
    },
    {
      "label": "2026-03",
      "idx": 139,
      "raw": 237.455
    },
    {
      "label": "2026-04",
      "idx": 140.1,
      "raw": 239.417
    },
    {
      "label": "2026-05",
      "idx": 140.2,
      "raw": 239.443
    },
    {
      "label": "2026-06",
      "idx": 138,
      "raw": 235.793
    },
    {
      "label": "2026-07",
      "idx": 139,
      "raw": 237.393
    }
  ],
  "nonalc": [
    {
      "label": "2019-01",
      "idx": 99.5,
      "raw": 210.006
    },
    {
      "label": "2019-02",
      "idx": 100,
      "raw": 211.168
    },
    {
      "label": "2019-03",
      "idx": 100.2,
      "raw": 211.55
    },
    {
      "label": "2019-04",
      "idx": 100,
      "raw": 211.078
    },
    {
      "label": "2019-05",
      "idx": 99.9,
      "raw": 210.815
    },
    {
      "label": "2019-06",
      "idx": 100.5,
      "raw": 212.056
    },
    {
      "label": "2019-07",
      "idx": 99.9,
      "raw": 210.941
    },
    {
      "label": "2019-08",
      "idx": 99.9,
      "raw": 210.841
    },
    {
      "label": "2019-09",
      "idx": 100.2,
      "raw": 211.49
    },
    {
      "label": "2019-10",
      "idx": 100.2,
      "raw": 211.492
    },
    {
      "label": "2019-11",
      "idx": 100.1,
      "raw": 211.25
    },
    {
      "label": "2019-12",
      "idx": 99.7,
      "raw": 210.432
    },
    {
      "label": "2020-01",
      "idx": 99.8,
      "raw": 210.763
    },
    {
      "label": "2020-02",
      "idx": 101,
      "raw": 213.215
    },
    {
      "label": "2020-03",
      "idx": 101.6,
      "raw": 214.565
    },
    {
      "label": "2020-04",
      "idx": 103.9,
      "raw": 219.233
    },
    {
      "label": "2020-05",
      "idx": 103.7,
      "raw": 218.988
    },
    {
      "label": "2020-06",
      "idx": 103.9,
      "raw": 219.311
    },
    {
      "label": "2020-07",
      "idx": 103.9,
      "raw": 219.254
    },
    {
      "label": "2020-08",
      "idx": 104,
      "raw": 219.607
    },
    {
      "label": "2020-09",
      "idx": 103.4,
      "raw": 218.358
    },
    {
      "label": "2020-10",
      "idx": 103.6,
      "raw": 218.758
    },
    {
      "label": "2020-11",
      "idx": 102.9,
      "raw": 217.31
    },
    {
      "label": "2020-12",
      "idx": 103.5,
      "raw": 218.534
    },
    {
      "label": "2021-01",
      "idx": 103.2,
      "raw": 217.824
    },
    {
      "label": "2021-02",
      "idx": 103.8,
      "raw": 219.11
    },
    {
      "label": "2021-03",
      "idx": 103.9,
      "raw": 219.263
    },
    {
      "label": "2021-04",
      "idx": 104.3,
      "raw": 220.143
    },
    {
      "label": "2021-05",
      "idx": 104.1,
      "raw": 219.664
    },
    {
      "label": "2021-06",
      "idx": 104.3,
      "raw": 220.221
    },
    {
      "label": "2021-07",
      "idx": 105.2,
      "raw": 222.116
    },
    {
      "label": "2021-08",
      "idx": 105.6,
      "raw": 222.863
    },
    {
      "label": "2021-09",
      "idx": 106.7,
      "raw": 225.141
    },
    {
      "label": "2021-10",
      "idx": 107.9,
      "raw": 227.701
    },
    {
      "label": "2021-11",
      "idx": 108.8,
      "raw": 229.643
    },
    {
      "label": "2021-12",
      "idx": 109.3,
      "raw": 230.809
    },
    {
      "label": "2022-01",
      "idx": 110.8,
      "raw": 233.956
    },
    {
      "label": "2022-02",
      "idx": 112.3,
      "raw": 237.143
    },
    {
      "label": "2022-03",
      "idx": 114.5,
      "raw": 241.804
    },
    {
      "label": "2022-04",
      "idx": 115.7,
      "raw": 244.282
    },
    {
      "label": "2022-05",
      "idx": 117.2,
      "raw": 247.3
    },
    {
      "label": "2022-06",
      "idx": 119.4,
      "raw": 252.015
    },
    {
      "label": "2022-07",
      "idx": 121.9,
      "raw": 257.295
    },
    {
      "label": "2022-08",
      "idx": 123.2,
      "raw": 259.976
    },
    {
      "label": "2022-09",
      "idx": 123.4,
      "raw": 260.58
    },
    {
      "label": "2022-10",
      "idx": 124.5,
      "raw": 262.814
    },
    {
      "label": "2022-11",
      "idx": 123.9,
      "raw": 261.583
    },
    {
      "label": "2022-12",
      "idx": 124.6,
      "raw": 262.985
    },
    {
      "label": "2023-01",
      "idx": 125.4,
      "raw": 264.746
    },
    {
      "label": "2023-02",
      "idx": 126.3,
      "raw": 266.612
    },
    {
      "label": "2023-03",
      "idx": 127.2,
      "raw": 268.567
    },
    {
      "label": "2023-04",
      "idx": 127.7,
      "raw": 269.657
    },
    {
      "label": "2023-05",
      "idx": 127.9,
      "raw": 269.999
    },
    {
      "label": "2023-06",
      "idx": 127.9,
      "raw": 269.995
    },
    {
      "label": "2023-07",
      "idx": 128.5,
      "raw": 271.276
    },
    {
      "label": "2023-08",
      "idx": 128.7,
      "raw": 271.648
    },
    {
      "label": "2023-09",
      "idx": 128.6,
      "raw": 271.561
    },
    {
      "label": "2023-10",
      "idx": 129,
      "raw": 272.215
    },
    {
      "label": "2023-11",
      "idx": 128,
      "raw": 270.25
    },
    {
      "label": "2023-12",
      "idx": 128,
      "raw": 270.223
    },
    {
      "label": "2024-01",
      "idx": 128.7,
      "raw": 271.6
    },
    {
      "label": "2024-02",
      "idx": 129.2,
      "raw": 272.768
    },
    {
      "label": "2024-03",
      "idx": 129,
      "raw": 272.352
    },
    {
      "label": "2024-04",
      "idx": 129.5,
      "raw": 273.306
    },
    {
      "label": "2024-05",
      "idx": 129.2,
      "raw": 272.796
    },
    {
      "label": "2024-06",
      "idx": 129.9,
      "raw": 274.285
    },
    {
      "label": "2024-07",
      "idx": 129.6,
      "raw": 273.643
    },
    {
      "label": "2024-08",
      "idx": 129.1,
      "raw": 272.612
    },
    {
      "label": "2024-09",
      "idx": 129.2,
      "raw": 272.658
    },
    {
      "label": "2024-10",
      "idx": 129.4,
      "raw": 273.232
    },
    {
      "label": "2024-11",
      "idx": 128.9,
      "raw": 272.027
    },
    {
      "label": "2024-12",
      "idx": 129,
      "raw": 272.362
    },
    {
      "label": "2025-01",
      "idx": 129.7,
      "raw": 273.796
    },
    {
      "label": "2025-02",
      "idx": 129.4,
      "raw": 273.067
    },
    {
      "label": "2025-03",
      "idx": 130.4,
      "raw": 275.216
    },
    {
      "label": "2025-04",
      "idx": 130.4,
      "raw": 275.27
    },
    {
      "label": "2025-05",
      "idx": 131,
      "raw": 276.606
    },
    {
      "label": "2025-06",
      "idx": 131.6,
      "raw": 277.737
    },
    {
      "label": "2025-07",
      "idx": 131.2,
      "raw": 277.002
    },
    {
      "label": "2025-08",
      "idx": 131.1,
      "raw": 276.649
    },
    {
      "label": "2025-09",
      "idx": 131.6,
      "raw": 277.71
    },
    {
      "label": "2025-11",
      "idx": 130.6,
      "raw": 275.668
    },
    {
      "label": "2025-12",
      "idx": 132.6,
      "raw": 279.814
    },
    {
      "label": "2026-01",
      "idx": 132.5,
      "raw": 279.657
    },
    {
      "label": "2026-02",
      "idx": 133.7,
      "raw": 282.185
    },
    {
      "label": "2026-03",
      "idx": 134.1,
      "raw": 283.125
    },
    {
      "label": "2026-04",
      "idx": 133.7,
      "raw": 282.256
    },
    {
      "label": "2026-05",
      "idx": 133.7,
      "raw": 282.209
    },
    {
      "label": "2026-06",
      "idx": 134.7,
      "raw": 284.373
    },
    {
      "label": "2026-07",
      "idx": 134.4,
      "raw": 283.803
    }
  ],
  "other": [
    {
      "label": "2019-01",
      "idx": 99.7,
      "raw": 251.688
    },
    {
      "label": "2019-02",
      "idx": 100,
      "raw": 252.599
    },
    {
      "label": "2019-03",
      "idx": 99.8,
      "raw": 252.087
    },
    {
      "label": "2019-04",
      "idx": 99.7,
      "raw": 251.758
    },
    {
      "label": "2019-05",
      "idx": 99.8,
      "raw": 252.101
    },
    {
      "label": "2019-06",
      "idx": 100,
      "raw": 252.538
    },
    {
      "label": "2019-07",
      "idx": 100.2,
      "raw": 253.129
    },
    {
      "label": "2019-08",
      "idx": 100.3,
      "raw": 253.314
    },
    {
      "label": "2019-09",
      "idx": 100.3,
      "raw": 253.261
    },
    {
      "label": "2019-10",
      "idx": 100.3,
      "raw": 253.207
    },
    {
      "label": "2019-11",
      "idx": 100,
      "raw": 252.463
    },
    {
      "label": "2019-12",
      "idx": 99.9,
      "raw": 252.361
    },
    {
      "label": "2020-01",
      "idx": 100.4,
      "raw": 253.592
    },
    {
      "label": "2020-02",
      "idx": 100.9,
      "raw": 254.831
    },
    {
      "label": "2020-03",
      "idx": 101.2,
      "raw": 255.66
    },
    {
      "label": "2020-04",
      "idx": 101.5,
      "raw": 256.423
    },
    {
      "label": "2020-05",
      "idx": 102,
      "raw": 257.713
    },
    {
      "label": "2020-06",
      "idx": 102.2,
      "raw": 258.033
    },
    {
      "label": "2020-07",
      "idx": 101.7,
      "raw": 256.96
    },
    {
      "label": "2020-08",
      "idx": 102,
      "raw": 257.678
    },
    {
      "label": "2020-09",
      "idx": 102.1,
      "raw": 257.73
    },
    {
      "label": "2020-10",
      "idx": 102.5,
      "raw": 258.936
    },
    {
      "label": "2020-11",
      "idx": 103,
      "raw": 259.995
    },
    {
      "label": "2020-12",
      "idx": 102.7,
      "raw": 259.397
    },
    {
      "label": "2021-01",
      "idx": 102.9,
      "raw": 259.765
    },
    {
      "label": "2021-02",
      "idx": 103,
      "raw": 260.011
    },
    {
      "label": "2021-03",
      "idx": 103.2,
      "raw": 260.652
    },
    {
      "label": "2021-04",
      "idx": 103.5,
      "raw": 261.265
    },
    {
      "label": "2021-05",
      "idx": 103.6,
      "raw": 261.711
    },
    {
      "label": "2021-06",
      "idx": 104.1,
      "raw": 262.913
    },
    {
      "label": "2021-07",
      "idx": 104.2,
      "raw": 263.226
    },
    {
      "label": "2021-08",
      "idx": 104.7,
      "raw": 264.315
    },
    {
      "label": "2021-09",
      "idx": 104.9,
      "raw": 264.98
    },
    {
      "label": "2021-10",
      "idx": 104.8,
      "raw": 264.748
    },
    {
      "label": "2021-11",
      "idx": 104.9,
      "raw": 264.957
    },
    {
      "label": "2021-12",
      "idx": 105.1,
      "raw": 265.41
    },
    {
      "label": "2022-01",
      "idx": 105.6,
      "raw": 266.749
    },
    {
      "label": "2022-02",
      "idx": 106.6,
      "raw": 269.128
    },
    {
      "label": "2022-03",
      "idx": 107.1,
      "raw": 270.352
    },
    {
      "label": "2022-04",
      "idx": 107.5,
      "raw": 271.376
    },
    {
      "label": "2022-05",
      "idx": 107.8,
      "raw": 272.293
    },
    {
      "label": "2022-06",
      "idx": 108.3,
      "raw": 273.537
    },
    {
      "label": "2022-07",
      "idx": 108.6,
      "raw": 274.344
    },
    {
      "label": "2022-08",
      "idx": 109.1,
      "raw": 275.627
    },
    {
      "label": "2022-09",
      "idx": 109.2,
      "raw": 275.81
    },
    {
      "label": "2022-10",
      "idx": 110.1,
      "raw": 278.009
    },
    {
      "label": "2022-11",
      "idx": 110.7,
      "raw": 279.629
    },
    {
      "label": "2022-12",
      "idx": 111.2,
      "raw": 280.755
    },
    {
      "label": "2023-01",
      "idx": 111.8,
      "raw": 282.286
    },
    {
      "label": "2023-02",
      "idx": 111.8,
      "raw": 282.377
    },
    {
      "label": "2023-03",
      "idx": 111.9,
      "raw": 282.588
    },
    {
      "label": "2023-04",
      "idx": 112.4,
      "raw": 283.961
    },
    {
      "label": "2023-05",
      "idx": 113,
      "raw": 285.285
    },
    {
      "label": "2023-06",
      "idx": 113.1,
      "raw": 285.633
    },
    {
      "label": "2023-07",
      "idx": 113.1,
      "raw": 285.58
    },
    {
      "label": "2023-08",
      "idx": 113.2,
      "raw": 285.859
    },
    {
      "label": "2023-09",
      "idx": 113.8,
      "raw": 287.496
    },
    {
      "label": "2023-10",
      "idx": 114.2,
      "raw": 288.303
    },
    {
      "label": "2023-11",
      "idx": 113.9,
      "raw": 287.731
    },
    {
      "label": "2023-12",
      "idx": 114,
      "raw": 287.873
    },
    {
      "label": "2024-01",
      "idx": 114.3,
      "raw": 288.758
    },
    {
      "label": "2024-02",
      "idx": 114.5,
      "raw": 289.22
    },
    {
      "label": "2024-03",
      "idx": 114.6,
      "raw": 289.36
    },
    {
      "label": "2024-04",
      "idx": 114.7,
      "raw": 289.717
    },
    {
      "label": "2024-05",
      "idx": 114.9,
      "raw": 290.094
    },
    {
      "label": "2024-06",
      "idx": 115.2,
      "raw": 290.825
    },
    {
      "label": "2024-07",
      "idx": 115.3,
      "raw": 291.088
    },
    {
      "label": "2024-08",
      "idx": 115.4,
      "raw": 291.432
    },
    {
      "label": "2024-09",
      "idx": 115.5,
      "raw": 291.683
    },
    {
      "label": "2024-10",
      "idx": 116,
      "raw": 292.871
    },
    {
      "label": "2024-11",
      "idx": 116,
      "raw": 292.831
    },
    {
      "label": "2024-12",
      "idx": 115.6,
      "raw": 291.832
    },
    {
      "label": "2025-01",
      "idx": 115.9,
      "raw": 292.771
    },
    {
      "label": "2025-02",
      "idx": 116.5,
      "raw": 294.211
    },
    {
      "label": "2025-03",
      "idx": 116.8,
      "raw": 294.847
    },
    {
      "label": "2025-04",
      "idx": 116.8,
      "raw": 294.88
    },
    {
      "label": "2025-05",
      "idx": 116.6,
      "raw": 294.478
    },
    {
      "label": "2025-06",
      "idx": 116.8,
      "raw": 294.883
    },
    {
      "label": "2025-07",
      "idx": 116.9,
      "raw": 295.176
    },
    {
      "label": "2025-08",
      "idx": 117.6,
      "raw": 296.908
    },
    {
      "label": "2025-09",
      "idx": 117.8,
      "raw": 297.507
    },
    {
      "label": "2025-11",
      "idx": 118.1,
      "raw": 298.31
    },
    {
      "label": "2025-12",
      "idx": 118,
      "raw": 298.085
    },
    {
      "label": "2026-01",
      "idx": 118.2,
      "raw": 298.623
    },
    {
      "label": "2026-02",
      "idx": 118.4,
      "raw": 298.95
    },
    {
      "label": "2026-03",
      "idx": 118.7,
      "raw": 299.718
    },
    {
      "label": "2026-04",
      "idx": 119,
      "raw": 300.555
    },
    {
      "label": "2026-05",
      "idx": 119.1,
      "raw": 300.726
    },
    {
      "label": "2026-06",
      "idx": 119.1,
      "raw": 300.824
    },
    {
      "label": "2026-07",
      "idx": 119.3,
      "raw": 301.367
    }
  ]
} as const;

export const APU_BASKET = [
  {
    "id": "eggs",
    "label": "Grade A eggs (dozen)",
    "color": "#be123c",
    "latestUsd": 2.189,
    "idx": 156.8,
    "peakUsd": 6.227,
    "peakLabel": "2025-03",
    "base2019": 1.396
  },
  {
    "id": "milk",
    "label": "Milk (gallon)",
    "color": "#0369a1",
    "latestUsd": 4.313,
    "idx": 142.1,
    "peakUsd": 4.317,
    "peakLabel": "2026-06",
    "base2019": 3.036
  },
  {
    "id": "bread",
    "label": "White bread (pound)",
    "color": "#b45309",
    "latestUsd": 1.82,
    "idx": 140.3,
    "peakUsd": 2.033,
    "peakLabel": "2024-01",
    "base2019": 1.298
  }
] as const;

export const ANALYTICS = {
  defaultPanel: "dual-track" as const,
  smokeMarker: "Food-at-home index vs wages",
  panelCount: 7,
  chartTypes: ["composed-line", "area", "bar", "scatter"] as const,
};
