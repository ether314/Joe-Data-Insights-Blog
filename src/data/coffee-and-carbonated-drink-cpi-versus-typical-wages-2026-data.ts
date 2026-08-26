/**
 * Coffee & carbonated-drink CPI vs median usual weekly earnings (2019–2026).
 *
 * Core question: How far have BLS coffee and carbonated-beverage CPIs run
 * ahead of CPS median weekly earnings since 2019?
 *
 * Method: Index each series to its 2019 average = 100. Coffee =
 * CUUR0000SEFP01 (CPI-U coffee), carbonated drinks = CUUR0000SEFW01,
 * all-items CPI-U = CUUR0000SA0, wages = LES1252881500 (CPS median usual
 * weekly earnings, full-time wage & salary workers). Quarterly CPI uses
 * available months in the quarter (Oct 2025 missing due to appropriations
 * lapse — Q4'25 uses Nov–Dec only where wages are also published).
 * Relative "wage burden" = beverage index / wage index × 100 (2019 = 100).
 */

export const SOURCE_NOTE =
  "BLS CPI-U item indexes CUUR0000SEFP01 (coffee) and CUUR0000SEFW01 (carbonated drinks); all-items CUUR0000SA0 for context. Wage anchor is BLS CPS LES1252881500 — median usual weekly earnings of full-time wage and salary workers (not seasonally adjusted). All series rebased to 2019 calendar-year average = 100. October 2025 CPI cells are missing (appropriations lapse); quarterly averages use remaining months. Confidence: disclosed BLS levels; index math and wage-burden ratios derived.";

export const SOURCES = [
  {
    label: "BLS — CPI-U coffee (CUUR0000SEFP01)",
    url: "https://data.bls.gov/timeseries/CUUR0000SEFP01",
  },
  {
    label: "BLS — CPI-U carbonated drinks (CUUR0000SEFW01)",
    url: "https://data.bls.gov/timeseries/CUUR0000SEFW01",
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
    label: "BLS — Consumer Price Index overview",
    url: "https://www.bls.gov/cpi/",
  },
] as const;

export const HEADLINE = {
  /** Latest coffee index (2019 avg = 100), 2026Q2 */
  coffeeIndex: 156.3,
  /** Latest carbonated-drink index */
  sodaIndex: 123.9,
  /** Latest median weekly earnings index */
  wageIndex: 137.2,
  /** Latest all-items CPI index */
  allItemsIndex: 130.7,
  /** Coffee − wage index gap, pp */
  coffeeWageGapPp: 19.1,
  /** Soda − wage index gap, pp (negative = soda cheaper vs wages) */
  sodaWageGapPp: -13.3,
  /** Coffee wage-burden index (coffee/wages×100), 2019=100 */
  coffeeBurden: 113.9,
  /** Soda wage-burden index */
  sodaBurden: 90.3,
  /** Peak coffee YoY % (monthly index) */
  coffeePeakYoyPct: 20.8,
  coffeePeakYoyLabel: "2025-08",
  latestQuarter: "2026Q2",
  latestWageUsd: 1258,
  /** Coffee % rise since 2019 avg */
  coffeePctSince2019: 56.3,
  sodaPctSince2019: 23.9,
  wagePctSince2019: 37.2,
  bases: {
    coffee2019: 193.237,
    soda2019: 230.114,
    cpi2019: 255.657,
    wage2019: 917,
  },
} as const;

export type SeriesId = "coffee" | "soda" | "wages" | "allItems";

export const SERIES_META: Record<
  SeriesId,
  { label: string; short: string; color: string; bls: string }
> = {
  coffee: {
    label: "Coffee CPI",
    short: "Coffee",
    color: "#92400e",
    bls: "CUUR0000SEFP01",
  },
  soda: {
    label: "Carbonated drinks CPI",
    short: "Soda",
    color: "#0e7490",
    bls: "CUUR0000SEFW01",
  },
  wages: {
    label: "Median weekly earnings",
    short: "Wages",
    color: "#166534",
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
  coffee: number;
  soda: number;
  allItems: number;
  wages: number;
  wageUsd: number;
  coffeeGap: number;
  sodaGap: number;
  coffeeBurden: number;
  sodaBurden: number;
};

/** Quarterly indexes, 2019 avg = 100 */
export const QUARTERLY: QuarterRow[] = [
  {
    "label": "2019Q1",
    "year": 2019,
    "coffee": 100.2,
    "soda": 99.8,
    "allItems": 98.9,
    "wages": 98,
    "wageUsd": 899,
    "coffeeGap": 2.2,
    "sodaGap": 1.8,
    "coffeeBurden": 102.2,
    "sodaBurden": 101.8
  },
  {
    "label": "2019Q2",
    "year": 2019,
    "coffee": 100.6,
    "soda": 99.6,
    "allItems": 100.1,
    "wages": 99.7,
    "wageUsd": 914,
    "coffeeGap": 0.9,
    "sodaGap": -0.1,
    "coffeeBurden": 100.9,
    "sodaBurden": 99.9
  },
  {
    "label": "2019Q3",
    "year": 2019,
    "coffee": 100.4,
    "soda": 99.9,
    "allItems": 100.4,
    "wages": 100.4,
    "wageUsd": 921,
    "coffeeGap": -0.1,
    "sodaGap": -0.6,
    "coffeeBurden": 100,
    "sodaBurden": 99.5
  },
  {
    "label": "2019Q4",
    "year": 2019,
    "coffee": 98.9,
    "soda": 100.7,
    "allItems": 100.6,
    "wages": 101.9,
    "wageUsd": 934,
    "coffeeGap": -3,
    "sodaGap": -1.2,
    "coffeeBurden": 97.1,
    "sodaBurden": 98.8
  },
  {
    "label": "2020Q1",
    "year": 2020,
    "coffee": 99.5,
    "soda": 102.3,
    "allItems": 101,
    "wages": 103.7,
    "wageUsd": 951,
    "coffeeGap": -4.2,
    "sodaGap": -1.4,
    "coffeeBurden": 95.9,
    "sodaBurden": 98.6
  },
  {
    "label": "2020Q2",
    "year": 2020,
    "coffee": 101.5,
    "soda": 104.2,
    "allItems": 100.5,
    "wages": 109.9,
    "wageUsd": 1008,
    "coffeeGap": -8.4,
    "sodaGap": -5.8,
    "coffeeBurden": 92.4,
    "sodaBurden": 94.8
  },
  {
    "label": "2020Q3",
    "year": 2020,
    "coffee": 100.9,
    "soda": 103.3,
    "allItems": 101.6,
    "wages": 108.5,
    "wageUsd": 995,
    "coffeeGap": -7.6,
    "sodaGap": -5.2,
    "coffeeBurden": 93,
    "sodaBurden": 95.2
  },
  {
    "label": "2020Q4",
    "year": 2020,
    "coffee": 100,
    "soda": 104.1,
    "allItems": 101.8,
    "wages": 107.2,
    "wageUsd": 983,
    "coffeeGap": -7.2,
    "sodaGap": -3.1,
    "coffeeBurden": 93.3,
    "sodaBurden": 97.1
  },
  {
    "label": "2021Q1",
    "year": 2021,
    "coffee": 101.2,
    "soda": 104.3,
    "allItems": 102.9,
    "wages": 107.3,
    "wageUsd": 984,
    "coffeeGap": -6.1,
    "sodaGap": -3,
    "coffeeBurden": 94.3,
    "sodaBurden": 97.2
  },
  {
    "label": "2021Q2",
    "year": 2021,
    "coffee": 102.1,
    "soda": 104.9,
    "allItems": 105.3,
    "wages": 108.6,
    "wageUsd": 996,
    "coffeeGap": -6.5,
    "sodaGap": -3.7,
    "coffeeBurden": 94,
    "sodaBurden": 96.6
  },
  {
    "label": "2021Q3",
    "year": 2021,
    "coffee": 103.1,
    "soda": 106,
    "allItems": 107,
    "wages": 109.3,
    "wageUsd": 1002,
    "coffeeGap": -6.2,
    "sodaGap": -3.3,
    "coffeeBurden": 94.3,
    "sodaBurden": 97
  },
  {
    "label": "2021Q4",
    "year": 2021,
    "coffee": 106.1,
    "soda": 105.9,
    "allItems": 108.7,
    "wages": 109.9,
    "wageUsd": 1008,
    "coffeeGap": -3.8,
    "sodaGap": -4,
    "coffeeBurden": 96.5,
    "sodaBurden": 96.4
  },
  {
    "label": "2022Q1",
    "year": 2022,
    "coffee": 111.4,
    "soda": 107.7,
    "allItems": 111.1,
    "wages": 112.6,
    "wageUsd": 1033,
    "coffeeGap": -1.3,
    "sodaGap": -5,
    "coffeeBurden": 98.9,
    "sodaBurden": 95.6
  },
  {
    "label": "2022Q2",
    "year": 2022,
    "coffee": 117.3,
    "soda": 109.8,
    "allItems": 114.4,
    "wages": 114.3,
    "wageUsd": 1048,
    "coffeeGap": 3,
    "sodaGap": -4.5,
    "coffeeBurden": 102.6,
    "sodaBurden": 96.1
  },
  {
    "label": "2022Q3",
    "year": 2022,
    "coffee": 121.5,
    "soda": 111,
    "allItems": 115.9,
    "wages": 116.8,
    "wageUsd": 1071,
    "coffeeGap": 4.7,
    "sodaGap": -5.8,
    "coffeeBurden": 104,
    "sodaBurden": 95
  },
  {
    "label": "2022Q4",
    "year": 2022,
    "coffee": 121.5,
    "soda": 113.7,
    "allItems": 116.4,
    "wages": 117.9,
    "wageUsd": 1081,
    "coffeeGap": 3.6,
    "sodaGap": -4.2,
    "coffeeBurden": 103.1,
    "sodaBurden": 96.4
  },
  {
    "label": "2023Q1",
    "year": 2023,
    "coffee": 124.2,
    "soda": 115.6,
    "allItems": 117.6,
    "wages": 119.6,
    "wageUsd": 1097,
    "coffeeGap": 4.6,
    "sodaGap": -4.1,
    "coffeeBurden": 103.8,
    "sodaBurden": 96.7
  },
  {
    "label": "2023Q2",
    "year": 2023,
    "coffee": 123,
    "soda": 116.2,
    "allItems": 119,
    "wages": 120.8,
    "wageUsd": 1108,
    "coffeeGap": 2.2,
    "sodaGap": -4.7,
    "coffeeBurden": 101.8,
    "sodaBurden": 96.2
  },
  {
    "label": "2023Q3",
    "year": 2023,
    "coffee": 122.9,
    "soda": 115.9,
    "allItems": 120,
    "wages": 122,
    "wageUsd": 1119,
    "coffeeGap": 0.9,
    "sodaGap": -6.2,
    "coffeeBurden": 100.7,
    "sodaBurden": 95
  },
  {
    "label": "2023Q4",
    "year": 2023,
    "coffee": 121,
    "soda": 117.3,
    "allItems": 120.1,
    "wages": 124.2,
    "wageUsd": 1139,
    "coffeeGap": -3.2,
    "sodaGap": -7,
    "coffeeBurden": 97.4,
    "sodaBurden": 94.4
  },
  {
    "label": "2024Q1",
    "year": 2024,
    "coffee": 121.5,
    "soda": 118.6,
    "allItems": 121.4,
    "wages": 123.9,
    "wageUsd": 1136,
    "coffeeGap": -2.4,
    "sodaGap": -5.3,
    "coffeeBurden": 98.1,
    "sodaBurden": 95.7
  },
  {
    "label": "2024Q2",
    "year": 2024,
    "coffee": 120.6,
    "soda": 119.7,
    "allItems": 122.8,
    "wages": 125.5,
    "wageUsd": 1151,
    "coffeeGap": -5,
    "sodaGap": -5.8,
    "coffeeBurden": 96.1,
    "sodaBurden": 95.4
  },
  {
    "label": "2024Q3",
    "year": 2024,
    "coffee": 121.4,
    "soda": 120.2,
    "allItems": 123.2,
    "wages": 127.2,
    "wageUsd": 1166,
    "coffeeGap": -5.7,
    "sodaGap": -7,
    "coffeeBurden": 95.4,
    "sodaBurden": 94.5
  },
  {
    "label": "2024Q4",
    "year": 2024,
    "coffee": 123.2,
    "soda": 120.3,
    "allItems": 123.4,
    "wages": 129.2,
    "wageUsd": 1185,
    "coffeeGap": -6,
    "sodaGap": -9,
    "coffeeBurden": 95.4,
    "sodaBurden": 93.1
  },
  {
    "label": "2025Q1",
    "year": 2025,
    "coffee": 127.9,
    "soda": 120.6,
    "allItems": 124.7,
    "wages": 130,
    "wageUsd": 1192,
    "coffeeGap": -2.1,
    "sodaGap": -9.3,
    "coffeeBurden": 98.4,
    "sodaBurden": 92.8
  },
  {
    "label": "2025Q2",
    "year": 2025,
    "coffee": 134.4,
    "soda": 120.7,
    "allItems": 125.8,
    "wages": 131.4,
    "wageUsd": 1205,
    "coffeeGap": 3,
    "sodaGap": -10.8,
    "coffeeBurden": 102.3,
    "sodaBurden": 91.9
  },
  {
    "label": "2025Q3",
    "year": 2025,
    "coffee": 143.4,
    "soda": 121.1,
    "allItems": 126.7,
    "wages": 132.5,
    "wageUsd": 1215,
    "coffeeGap": 10.9,
    "sodaGap": -11.4,
    "coffeeBurden": 108.2,
    "sodaBurden": 91.4
  },
  {
    "label": "2026Q1",
    "year": 2026,
    "coffee": 151.5,
    "soda": 122.7,
    "allItems": 128.1,
    "wages": 134.5,
    "wageUsd": 1233,
    "coffeeGap": 17,
    "sodaGap": -11.8,
    "coffeeBurden": 112.6,
    "sodaBurden": 91.2
  },
  {
    "label": "2026Q2",
    "year": 2026,
    "coffee": 156.3,
    "soda": 123.9,
    "allItems": 130.7,
    "wages": 137.2,
    "wageUsd": 1258,
    "coffeeGap": 19.1,
    "sodaGap": -13.3,
    "coffeeBurden": 113.9,
    "sodaBurden": 90.3
  }
];

export type MonthlyRow = {
  label: string;
  coffee: number;
  soda: number;
  allItems: number;
};

/** Monthly beverage + all-items indexes (wages are quarterly only) */
export const MONTHLY: MonthlyRow[] = [
  {
    "label": "2019-01",
    "coffee": 100.3,
    "soda": 99.8,
    "allItems": 98.5
  },
  {
    "label": "2019-02",
    "coffee": 100.2,
    "soda": 100.1,
    "allItems": 98.9
  },
  {
    "label": "2019-03",
    "coffee": 100.2,
    "soda": 99.6,
    "allItems": 99.4
  },
  {
    "label": "2019-04",
    "coffee": 100,
    "soda": 99.4,
    "allItems": 100
  },
  {
    "label": "2019-05",
    "coffee": 100.2,
    "soda": 99.6,
    "allItems": 100.2
  },
  {
    "label": "2019-06",
    "coffee": 101.4,
    "soda": 99.7,
    "allItems": 100.2
  },
  {
    "label": "2019-07",
    "coffee": 100.3,
    "soda": 100,
    "allItems": 100.4
  },
  {
    "label": "2019-08",
    "coffee": 101.1,
    "soda": 99.9,
    "allItems": 100.4
  },
  {
    "label": "2019-09",
    "coffee": 99.7,
    "soda": 99.7,
    "allItems": 100.4
  },
  {
    "label": "2019-10",
    "coffee": 99.3,
    "soda": 100.7,
    "allItems": 100.7
  },
  {
    "label": "2019-11",
    "coffee": 99.7,
    "soda": 100.5,
    "allItems": 100.6
  },
  {
    "label": "2019-12",
    "coffee": 97.6,
    "soda": 100.9,
    "allItems": 100.5
  },
  {
    "label": "2020-01",
    "coffee": 98.8,
    "soda": 101.7,
    "allItems": 100.9
  },
  {
    "label": "2020-02",
    "coffee": 99.4,
    "soda": 102.2,
    "allItems": 101.2
  },
  {
    "label": "2020-03",
    "coffee": 100.4,
    "soda": 102.9,
    "allItems": 101
  },
  {
    "label": "2020-04",
    "coffee": 101.5,
    "soda": 104.5,
    "allItems": 100.3
  },
  {
    "label": "2020-05",
    "coffee": 100.8,
    "soda": 104.4,
    "allItems": 100.3
  },
  {
    "label": "2020-06",
    "coffee": 102.3,
    "soda": 103.6,
    "allItems": 100.8
  },
  {
    "label": "2020-07",
    "coffee": 101,
    "soda": 103.7,
    "allItems": 101.3
  },
  {
    "label": "2020-08",
    "coffee": 101.3,
    "soda": 103.2,
    "allItems": 101.7
  },
  {
    "label": "2020-09",
    "coffee": 100.5,
    "soda": 103,
    "allItems": 101.8
  },
  {
    "label": "2020-10",
    "coffee": 101.5,
    "soda": 103.6,
    "allItems": 101.9
  },
  {
    "label": "2020-11",
    "coffee": 98.5,
    "soda": 104.7,
    "allItems": 101.8
  },
  {
    "label": "2020-12",
    "coffee": 99.9,
    "soda": 103.9,
    "allItems": 101.9
  },
  {
    "label": "2021-01",
    "coffee": 101.3,
    "soda": 103.9,
    "allItems": 102.3
  },
  {
    "label": "2021-02",
    "coffee": 101.2,
    "soda": 104.2,
    "allItems": 102.9
  },
  {
    "label": "2021-03",
    "coffee": 101,
    "soda": 104.9,
    "allItems": 103.6
  },
  {
    "label": "2021-04",
    "coffee": 101.4,
    "soda": 104.1,
    "allItems": 104.5
  },
  {
    "label": "2021-05",
    "coffee": 102.2,
    "soda": 104.8,
    "allItems": 105.3
  },
  {
    "label": "2021-06",
    "coffee": 102.8,
    "soda": 105.8,
    "allItems": 106.3
  },
  {
    "label": "2021-07",
    "coffee": 101.6,
    "soda": 105.9,
    "allItems": 106.8
  },
  {
    "label": "2021-08",
    "coffee": 103.3,
    "soda": 105.9,
    "allItems": 107
  },
  {
    "label": "2021-09",
    "coffee": 104.4,
    "soda": 106.2,
    "allItems": 107.3
  },
  {
    "label": "2021-10",
    "coffee": 106.2,
    "soda": 105.7,
    "allItems": 108.2
  },
  {
    "label": "2021-11",
    "coffee": 105.9,
    "soda": 105.9,
    "allItems": 108.7
  },
  {
    "label": "2021-12",
    "coffee": 106.1,
    "soda": 106,
    "allItems": 109.1
  },
  {
    "label": "2022-01",
    "coffee": 110.1,
    "soda": 105.8,
    "allItems": 110
  },
  {
    "label": "2022-02",
    "coffee": 111.8,
    "soda": 108.1,
    "allItems": 111
  },
  {
    "label": "2022-03",
    "coffee": 112.4,
    "soda": 109.2,
    "allItems": 112.5
  },
  {
    "label": "2022-04",
    "coffee": 115.1,
    "soda": 109.3,
    "allItems": 113.1
  },
  {
    "label": "2022-05",
    "coffee": 117.9,
    "soda": 109.6,
    "allItems": 114.3
  },
  {
    "label": "2022-06",
    "coffee": 119,
    "soda": 110.4,
    "allItems": 115.9
  },
  {
    "label": "2022-07",
    "coffee": 122.2,
    "soda": 110.8,
    "allItems": 115.9
  },
  {
    "label": "2022-08",
    "coffee": 121.4,
    "soda": 111.1,
    "allItems": 115.8
  },
  {
    "label": "2022-09",
    "coffee": 120.8,
    "soda": 111,
    "allItems": 116.1
  },
  {
    "label": "2022-10",
    "coffee": 121.9,
    "soda": 112.1,
    "allItems": 116.6
  },
  {
    "label": "2022-11",
    "coffee": 121.3,
    "soda": 114.1,
    "allItems": 116.4
  },
  {
    "label": "2022-12",
    "coffee": 121.3,
    "soda": 115,
    "allItems": 116.1
  },
  {
    "label": "2023-01",
    "coffee": 124.1,
    "soda": 115.3,
    "allItems": 117
  },
  {
    "label": "2023-02",
    "coffee": 124.5,
    "soda": 115.6,
    "allItems": 117.7
  },
  {
    "label": "2023-03",
    "coffee": 123.9,
    "soda": 115.8,
    "allItems": 118.1
  },
  {
    "label": "2023-04",
    "coffee": 122.7,
    "soda": 115.8,
    "allItems": 118.7
  },
  {
    "label": "2023-05",
    "coffee": 123.5,
    "soda": 116.2,
    "allItems": 119
  },
  {
    "label": "2023-06",
    "coffee": 122.9,
    "soda": 116.4,
    "allItems": 119.3
  },
  {
    "label": "2023-07",
    "coffee": 123.4,
    "soda": 115.6,
    "allItems": 119.6
  },
  {
    "label": "2023-08",
    "coffee": 122.6,
    "soda": 115.8,
    "allItems": 120.1
  },
  {
    "label": "2023-09",
    "coffee": 122.7,
    "soda": 116.2,
    "allItems": 120.4
  },
  {
    "label": "2023-10",
    "coffee": 122.4,
    "soda": 117.4,
    "allItems": 120.3
  },
  {
    "label": "2023-11",
    "coffee": 121.2,
    "soda": 117.2,
    "allItems": 120.1
  },
  {
    "label": "2023-12",
    "coffee": 119.4,
    "soda": 117.3,
    "allItems": 120
  },
  {
    "label": "2024-01",
    "coffee": 122.4,
    "soda": 118.1,
    "allItems": 120.6
  },
  {
    "label": "2024-02",
    "coffee": 121,
    "soda": 119,
    "allItems": 121.4
  },
  {
    "label": "2024-03",
    "coffee": 121.2,
    "soda": 118.8,
    "allItems": 122.2
  },
  {
    "label": "2024-04",
    "coffee": 120.3,
    "soda": 119.3,
    "allItems": 122.6
  },
  {
    "label": "2024-05",
    "coffee": 120.4,
    "soda": 119.8,
    "allItems": 122.8
  },
  {
    "label": "2024-06",
    "coffee": 121,
    "soda": 120,
    "allItems": 122.9
  },
  {
    "label": "2024-07",
    "coffee": 122.9,
    "soda": 120.2,
    "allItems": 123
  },
  {
    "label": "2024-08",
    "coffee": 120,
    "soda": 119.9,
    "allItems": 123.1
  },
  {
    "label": "2024-09",
    "coffee": 121.5,
    "soda": 120.3,
    "allItems": 123.3
  },
  {
    "label": "2024-10",
    "coffee": 122.3,
    "soda": 120.4,
    "allItems": 123.5
  },
  {
    "label": "2024-11",
    "coffee": 123.5,
    "soda": 120.2,
    "allItems": 123.4
  },
  {
    "label": "2024-12",
    "coffee": 123.9,
    "soda": 120.2,
    "allItems": 123.4
  },
  {
    "label": "2025-01",
    "coffee": 126.2,
    "soda": 120.2,
    "allItems": 124.3
  },
  {
    "label": "2025-02",
    "coffee": 128.2,
    "soda": 120.9,
    "allItems": 124.8
  },
  {
    "label": "2025-03",
    "coffee": 129.3,
    "soda": 120.9,
    "allItems": 125.1
  },
  {
    "label": "2025-04",
    "coffee": 131.9,
    "soda": 121,
    "allItems": 125.5
  },
  {
    "label": "2025-05",
    "coffee": 134.2,
    "soda": 120.6,
    "allItems": 125.7
  },
  {
    "label": "2025-06",
    "coffee": 137.1,
    "soda": 120.4,
    "allItems": 126.2
  },
  {
    "label": "2025-07",
    "coffee": 140.7,
    "soda": 120.6,
    "allItems": 126.4
  },
  {
    "label": "2025-08",
    "coffee": 145,
    "soda": 121.3,
    "allItems": 126.7
  },
  {
    "label": "2025-09",
    "coffee": 144.5,
    "soda": 121.5,
    "allItems": 127
  },
  {
    "label": "2025-11",
    "coffee": 146.7,
    "soda": 122.2,
    "allItems": 126.8
  },
  {
    "label": "2025-12",
    "coffee": 148.4,
    "soda": 121.7,
    "allItems": 126.8
  },
  {
    "label": "2026-01",
    "coffee": 149.3,
    "soda": 122.2,
    "allItems": 127.2
  },
  {
    "label": "2026-02",
    "coffee": 151.8,
    "soda": 122.7,
    "allItems": 127.8
  },
  {
    "label": "2026-03",
    "coffee": 153.4,
    "soda": 123.2,
    "allItems": 129.2
  },
  {
    "label": "2026-04",
    "coffee": 156.2,
    "soda": 123.7,
    "allItems": 130.3
  },
  {
    "label": "2026-05",
    "coffee": 157.7,
    "soda": 124,
    "allItems": 131.1
  },
  {
    "label": "2026-06",
    "coffee": 154.8,
    "soda": 124.1,
    "allItems": 130.6
  },
  {
    "label": "2026-07",
    "coffee": 155.2,
    "soda": 123.9,
    "allItems": 130.6
  }
];

export type YoyRow = {
  label: string;
  coffeeYoY: number;
  sodaYoY: number;
  allYoY: number;
};

export const MONTHLY_YOY: YoyRow[] = [
  {
    "label": "2020-01",
    "coffeeYoY": -1.5,
    "sodaYoY": 1.9,
    "allYoY": 2.4
  },
  {
    "label": "2020-02",
    "coffeeYoY": -0.8,
    "sodaYoY": 2.1,
    "allYoY": 2.3
  },
  {
    "label": "2020-03",
    "coffeeYoY": 0.2,
    "sodaYoY": 3.3,
    "allYoY": 1.6
  },
  {
    "label": "2020-04",
    "coffeeYoY": 1.5,
    "sodaYoY": 5.1,
    "allYoY": 0.3
  },
  {
    "label": "2020-05",
    "coffeeYoY": 0.6,
    "sodaYoY": 4.8,
    "allYoY": 0.1
  },
  {
    "label": "2020-06",
    "coffeeYoY": 0.9,
    "sodaYoY": 3.9,
    "allYoY": 0.6
  },
  {
    "label": "2020-07",
    "coffeeYoY": 0.7,
    "sodaYoY": 3.7,
    "allYoY": 0.9
  },
  {
    "label": "2020-08",
    "coffeeYoY": 0.2,
    "sodaYoY": 3.3,
    "allYoY": 1.3
  },
  {
    "label": "2020-09",
    "coffeeYoY": 0.8,
    "sodaYoY": 3.3,
    "allYoY": 1.4
  },
  {
    "label": "2020-10",
    "coffeeYoY": 2.2,
    "sodaYoY": 2.9,
    "allYoY": 1.2
  },
  {
    "label": "2020-11",
    "coffeeYoY": -1.2,
    "sodaYoY": 4.2,
    "allYoY": 1.2
  },
  {
    "label": "2020-12",
    "coffeeYoY": 2.4,
    "sodaYoY": 3,
    "allYoY": 1.4
  },
  {
    "label": "2021-01",
    "coffeeYoY": 2.5,
    "sodaYoY": 2.2,
    "allYoY": 1.4
  },
  {
    "label": "2021-02",
    "coffeeYoY": 1.8,
    "sodaYoY": 2,
    "allYoY": 1.7
  },
  {
    "label": "2021-03",
    "coffeeYoY": 0.6,
    "sodaYoY": 1.9,
    "allYoY": 2.6
  },
  {
    "label": "2021-04",
    "coffeeYoY": -0.1,
    "sodaYoY": -0.4,
    "allYoY": 4.2
  },
  {
    "label": "2021-05",
    "coffeeYoY": 1.4,
    "sodaYoY": 0.4,
    "allYoY": 5
  },
  {
    "label": "2021-06",
    "coffeeYoY": 0.5,
    "sodaYoY": 2.1,
    "allYoY": 5.5
  },
  {
    "label": "2021-07",
    "coffeeYoY": 0.6,
    "sodaYoY": 2.1,
    "allYoY": 5.4
  },
  {
    "label": "2021-08",
    "coffeeYoY": 2,
    "sodaYoY": 2.6,
    "allYoY": 5.2
  },
  {
    "label": "2021-09",
    "coffeeYoY": 3.9,
    "sodaYoY": 3.1,
    "allYoY": 5.4
  },
  {
    "label": "2021-10",
    "coffeeYoY": 4.6,
    "sodaYoY": 2,
    "allYoY": 6.2
  },
  {
    "label": "2021-11",
    "coffeeYoY": 7.5,
    "sodaYoY": 1.1,
    "allYoY": 6.8
  },
  {
    "label": "2021-12",
    "coffeeYoY": 6.2,
    "sodaYoY": 2,
    "allYoY": 7.1
  },
  {
    "label": "2022-01",
    "coffeeYoY": 8.7,
    "sodaYoY": 1.8,
    "allYoY": 7.5
  },
  {
    "label": "2022-02",
    "coffeeYoY": 10.5,
    "sodaYoY": 3.7,
    "allYoY": 7.9
  },
  {
    "label": "2022-03",
    "coffeeYoY": 11.3,
    "sodaYoY": 4.1,
    "allYoY": 8.6
  },
  {
    "label": "2022-04",
    "coffeeYoY": 13.5,
    "sodaYoY": 5,
    "allYoY": 8.2
  },
  {
    "label": "2022-05",
    "coffeeYoY": 15.4,
    "sodaYoY": 4.6,
    "allYoY": 8.5
  },
  {
    "label": "2022-06",
    "coffeeYoY": 15.8,
    "sodaYoY": 4.3,
    "allYoY": 9
  },
  {
    "label": "2022-07",
    "coffeeYoY": 20.3,
    "sodaYoY": 4.6,
    "allYoY": 8.5
  },
  {
    "label": "2022-08",
    "coffeeYoY": 17.5,
    "sodaYoY": 4.9,
    "allYoY": 8.2
  },
  {
    "label": "2022-09",
    "coffeeYoY": 15.7,
    "sodaYoY": 4.5,
    "allYoY": 8.2
  },
  {
    "label": "2022-10",
    "coffeeYoY": 14.8,
    "sodaYoY": 6.1,
    "allYoY": 7.8
  },
  {
    "label": "2022-11",
    "coffeeYoY": 14.5,
    "sodaYoY": 7.7,
    "allYoY": 7.1
  },
  {
    "label": "2022-12",
    "coffeeYoY": 14.3,
    "sodaYoY": 8.5,
    "allYoY": 6.4
  },
  {
    "label": "2023-01",
    "coffeeYoY": 12.7,
    "sodaYoY": 9,
    "allYoY": 6.4
  },
  {
    "label": "2023-02",
    "coffeeYoY": 11.4,
    "sodaYoY": 6.9,
    "allYoY": 6
  },
  {
    "label": "2023-03",
    "coffeeYoY": 10.2,
    "sodaYoY": 6,
    "allYoY": 5
  },
  {
    "label": "2023-04",
    "coffeeYoY": 6.6,
    "sodaYoY": 5.9,
    "allYoY": 5
  },
  {
    "label": "2023-05",
    "coffeeYoY": 4.7,
    "sodaYoY": 6,
    "allYoY": 4.1
  },
  {
    "label": "2023-06",
    "coffeeYoY": 3.3,
    "sodaYoY": 5.4,
    "allYoY": 2.9
  },
  {
    "label": "2023-07",
    "coffeeYoY": 1,
    "sodaYoY": 4.3,
    "allYoY": 3.2
  },
  {
    "label": "2023-08",
    "coffeeYoY": 1,
    "sodaYoY": 4.2,
    "allYoY": 3.7
  },
  {
    "label": "2023-09",
    "coffeeYoY": 1.6,
    "sodaYoY": 4.7,
    "allYoY": 3.7
  },
  {
    "label": "2023-10",
    "coffeeYoY": 0.4,
    "sodaYoY": 4.7,
    "allYoY": 3.2
  },
  {
    "label": "2023-11",
    "coffeeYoY": -0.1,
    "sodaYoY": 2.7,
    "allYoY": 3.2
  },
  {
    "label": "2023-12",
    "coffeeYoY": -1.6,
    "sodaYoY": 2,
    "allYoY": 3.4
  },
  {
    "label": "2024-01",
    "coffeeYoY": -1.4,
    "sodaYoY": 2.4,
    "allYoY": 3.1
  },
  {
    "label": "2024-02",
    "coffeeYoY": -2.8,
    "sodaYoY": 2.9,
    "allYoY": 3.1
  },
  {
    "label": "2024-03",
    "coffeeYoY": -2.2,
    "sodaYoY": 2.6,
    "allYoY": 3.5
  },
  {
    "label": "2024-04",
    "coffeeYoY": -2,
    "sodaYoY": 3,
    "allYoY": 3.3
  },
  {
    "label": "2024-05",
    "coffeeYoY": -2.5,
    "sodaYoY": 3.1,
    "allYoY": 3.2
  },
  {
    "label": "2024-06",
    "coffeeYoY": -1.5,
    "sodaYoY": 3.1,
    "allYoY": 3
  },
  {
    "label": "2024-07",
    "coffeeYoY": -0.4,
    "sodaYoY": 4,
    "allYoY": 2.8
  },
  {
    "label": "2024-08",
    "coffeeYoY": -2.1,
    "sodaYoY": 3.5,
    "allYoY": 2.5
  },
  {
    "label": "2024-09",
    "coffeeYoY": -1,
    "sodaYoY": 3.5,
    "allYoY": 2.4
  },
  {
    "label": "2024-10",
    "coffeeYoY": -0.1,
    "sodaYoY": 2.6,
    "allYoY": 2.7
  },
  {
    "label": "2024-11",
    "coffeeYoY": 1.9,
    "sodaYoY": 2.6,
    "allYoY": 2.7
  },
  {
    "label": "2024-12",
    "coffeeYoY": 3.8,
    "sodaYoY": 2.5,
    "allYoY": 2.8
  },
  {
    "label": "2025-01",
    "coffeeYoY": 3.1,
    "sodaYoY": 1.8,
    "allYoY": 3.1
  },
  {
    "label": "2025-02",
    "coffeeYoY": 6,
    "sodaYoY": 1.6,
    "allYoY": 2.8
  },
  {
    "label": "2025-03",
    "coffeeYoY": 6.7,
    "sodaYoY": 1.8,
    "allYoY": 2.4
  },
  {
    "label": "2025-04",
    "coffeeYoY": 9.6,
    "sodaYoY": 1.4,
    "allYoY": 2.4
  },
  {
    "label": "2025-05",
    "coffeeYoY": 11.5,
    "sodaYoY": 0.7,
    "allYoY": 2.4
  },
  {
    "label": "2025-06",
    "coffeeYoY": 13.3,
    "sodaYoY": 0.3,
    "allYoY": 2.7
  },
  {
    "label": "2025-07",
    "coffeeYoY": 14.5,
    "sodaYoY": 0.3,
    "allYoY": 2.8
  },
  {
    "label": "2025-08",
    "coffeeYoY": 20.8,
    "sodaYoY": 1.2,
    "allYoY": 2.9
  },
  {
    "label": "2025-09",
    "coffeeYoY": 18.9,
    "sodaYoY": 1,
    "allYoY": 3
  },
  {
    "label": "2025-11",
    "coffeeYoY": 18.8,
    "sodaYoY": 1.7,
    "allYoY": 2.8
  },
  {
    "label": "2025-12",
    "coffeeYoY": 19.8,
    "sodaYoY": 1.2,
    "allYoY": 2.8
  },
  {
    "label": "2026-01",
    "coffeeYoY": 18.3,
    "sodaYoY": 1.7,
    "allYoY": 2.3
  },
  {
    "label": "2026-02",
    "coffeeYoY": 18.4,
    "sodaYoY": 1.5,
    "allYoY": 2.4
  },
  {
    "label": "2026-03",
    "coffeeYoY": 18.6,
    "sodaYoY": 1.9,
    "allYoY": 3.3
  },
  {
    "label": "2026-04",
    "coffeeYoY": 18.4,
    "sodaYoY": 2.2,
    "allYoY": 3.8
  },
  {
    "label": "2026-05",
    "coffeeYoY": 17.5,
    "sodaYoY": 2.8,
    "allYoY": 4.3
  },
  {
    "label": "2026-06",
    "coffeeYoY": 12.9,
    "sodaYoY": 3.1,
    "allYoY": 3.5
  },
  {
    "label": "2026-07",
    "coffeeYoY": 10.3,
    "sodaYoY": 2.7,
    "allYoY": 3.3
  }
];

export type AnnualRow = {
  year: number;
  coffee: number;
  soda: number;
  wages: number;
  allItems: number;
  coffeeGap: number;
  sodaGap: number;
  coffeeBurden: number;
  sodaBurden: number;
  n: number;
};

export const ANNUAL: AnnualRow[] = [
  {
    "year": 2019,
    "coffee": 100,
    "soda": 100,
    "wages": 100,
    "allItems": 100,
    "coffeeGap": 0,
    "sodaGap": 0,
    "coffeeBurden": 100,
    "sodaBurden": 100,
    "n": 4
  },
  {
    "year": 2020,
    "coffee": 100.5,
    "soda": 103.5,
    "wages": 107.3,
    "allItems": 101.2,
    "coffeeGap": -6.9,
    "sodaGap": -3.9,
    "coffeeBurden": 93.7,
    "sodaBurden": 96.5,
    "n": 4
  },
  {
    "year": 2021,
    "coffee": 103.1,
    "soda": 105.3,
    "wages": 108.8,
    "allItems": 106,
    "coffeeGap": -5.7,
    "sodaGap": -3.5,
    "coffeeBurden": 94.8,
    "sodaBurden": 96.8,
    "n": 4
  },
  {
    "year": 2022,
    "coffee": 117.9,
    "soda": 110.5,
    "wages": 115.4,
    "allItems": 114.4,
    "coffeeGap": 2.5,
    "sodaGap": -4.9,
    "coffeeBurden": 102.2,
    "sodaBurden": 95.8,
    "n": 4
  },
  {
    "year": 2023,
    "coffee": 122.8,
    "soda": 116.3,
    "wages": 121.6,
    "allItems": 119.2,
    "coffeeGap": 1.1,
    "sodaGap": -5.5,
    "coffeeBurden": 101,
    "sodaBurden": 95.6,
    "n": 4
  },
  {
    "year": 2024,
    "coffee": 121.7,
    "soda": 119.7,
    "wages": 126.5,
    "allItems": 122.7,
    "coffeeGap": -4.8,
    "sodaGap": -6.8,
    "coffeeBurden": 96.2,
    "sodaBurden": 94.6,
    "n": 4
  },
  {
    "year": 2025,
    "coffee": 135.2,
    "soda": 120.8,
    "wages": 131.3,
    "allItems": 125.7,
    "coffeeGap": 3.9,
    "sodaGap": -10.5,
    "coffeeBurden": 103,
    "sodaBurden": 92,
    "n": 3
  },
  {
    "year": 2026,
    "coffee": 153.9,
    "soda": 123.3,
    "wages": 135.8,
    "allItems": 129.4,
    "coffeeGap": 18.1,
    "sodaGap": -12.6,
    "coffeeBurden": 113.3,
    "sodaBurden": 90.8,
    "n": 2
  }
];

/** Summary table for the article */
export const SUMMARY_TABLE = ANNUAL.map((r) => ({
  year: String(r.year),
  coffee: r.coffee,
  soda: r.soda,
  wages: r.wages,
  allItems: r.allItems,
  coffeeGap: r.coffeeGap,
  coffeeBurden: r.coffeeBurden,
}));

export const ANALYTICS = {
  defaultPanel: "index-race" as const,
  defaultFocus: "coffee" as SeriesId,
  latestLabel: HEADLINE.latestQuarter,
  smokeMarker: "Coffee vs wage index race",
};
