/**
 * Pet food & pet-care CPI vs all-items CPI-U (2019–2026).
 *
 * Core question: Did BLS pet-food and pet-care indexes rise faster than
 * all-items CPI after 2019?
 *
 * Method: Rebase CUUR0000SEFV01 (pet food), CUUR0000SEGD03 (other pet
 * services including veterinary), and CUUR0000SA0 (all-items CPI-U) to
 * January 2019 = 100. Parent baskets CUUR0000SEFV and CUUR0000SEGD shown
 * for context. Gaps = series index − all-items index (pp). Confidence:
 * disclosed BLS NSA levels; indexes and gaps derived.
 */

export const SOURCE_NOTE =
  "BLS CPI-U pet food (CUUR0000SEFV01), other pet services incl. veterinary (CUUR0000SEGD03), all-items (CUUR0000SA0); parent pets/products (CUUR0000SEFV) and pet services (CUUR0000SEGD). Rebased to January 2019 = 100. NSA. Confidence: disclosed BLS levels; derived indexes/gaps.";

export const SOURCES = [
  { label: "BLS — CPI-U pet food (CUUR0000SEFV01)", url: "https://data.bls.gov/timeseries/CUUR0000SEFV01" },
  { label: "BLS — CPI-U other pet services incl. veterinary (CUUR0000SEGD03)", url: "https://data.bls.gov/timeseries/CUUR0000SEGD03" },
  { label: "BLS — CPI-U all items (CUUR0000SA0)", url: "https://data.bls.gov/timeseries/CUUR0000SA0" },
  { label: "BLS — CPI-U pets and pet products (CUUR0000SEFV)", url: "https://data.bls.gov/timeseries/CUUR0000SEFV" },
  { label: "BLS — CPI-U pet services incl. veterinary (CUUR0000SEGD)", url: "https://data.bls.gov/timeseries/CUUR0000SEGD" },
] as const;

export const HEADLINE = {
  "latestPeriod": "2026-07",
  "allIdx": 132.66,
  "foodIdx": 141.2,
  "careIdx": 147.56,
  "foodGapPp": 8.54,
  "careGapPp": 14.9,
  "foodPctSince2019": 41.2,
  "carePctSince2019": 47.6,
  "allPctSince2019": 32.7,
  "maxFoodGapPp": 10.27,
  "maxFoodGapLabel": "2025-12",
  "maxCareGapPp": 14.9,
  "maxCareGapLabel": "2026-07",
  "peakFoodYoy": 9.01,
  "peakFoodYoyLabel": "2022-08",
  "peakCareYoy": 10.32,
  "peakCareYoyLabel": "2022-04",
  "peakAllYoy": 9.06,
  "peakAllYoyLabel": "2022-06",
  "monthsFoodLead": 83,
  "monthsCareLead": 85,
  "sampleMonths": 90,
  "latestFoodYoy": 3.43,
  "latestCareYoy": 5.35,
  "latestAllYoy": 3.37,
  "bases": {
    "allJan2019": 251.712,
    "foodJan2019": 173.624,
    "careJan2019": 172.213
  }
} as const;

export type SeriesId = "all" | "food" | "care" | "pets" | "svc";

export const SERIES_META: Record<
  SeriesId,
  { label: string; short: string; color: string; bls: string }
> = {
  all: { label: "All-items CPI-U", short: "All items", color: "#64748b", bls: "CUUR0000SA0" },
  food: { label: "Pet food CPI", short: "Pet food", color: "#c2410c", bls: "CUUR0000SEFV01" },
  care: { label: "Other pet services (incl. veterinary)", short: "Pet care", color: "#0f766e", bls: "CUUR0000SEGD03" },
  pets: { label: "Pets & pet products", short: "Pets/products", color: "#a16207", bls: "CUUR0000SEFV" },
  svc: { label: "Pet services (parent)", short: "Pet services", color: "#7c3aed", bls: "CUUR0000SEGD" },
};

export type MonthRow = {
  period: string;
  year: number;
  month: number;
  all: number;
  food: number;
  care: number;
  pets: number;
  svc: number;
  foodGap: number;
  careGap: number;
  foodBurden: number;
  careBurden: number;
};

export const MONTHLY: MonthRow[] = [
  {
    "period": "2019-01",
    "year": 2019,
    "month": 1,
    "all": 100,
    "food": 100,
    "care": 100,
    "pets": 100,
    "svc": 100,
    "foodGap": 0,
    "careGap": 0,
    "foodBurden": 100,
    "careBurden": 100
  },
  {
    "period": "2019-02",
    "year": 2019,
    "month": 2,
    "all": 100.42,
    "food": 100.3,
    "care": 100.41,
    "pets": 100.35,
    "svc": 100.72,
    "foodGap": -0.12,
    "careGap": -0.01,
    "foodBurden": 99.88,
    "careBurden": 99.99
  },
  {
    "period": "2019-03",
    "year": 2019,
    "month": 3,
    "all": 100.99,
    "food": 100.44,
    "care": 101.16,
    "pets": 100.54,
    "svc": 100.22,
    "foodGap": -0.55,
    "careGap": 0.17,
    "foodBurden": 99.46,
    "careBurden": 100.17
  },
  {
    "period": "2019-04",
    "year": 2019,
    "month": 4,
    "all": 101.52,
    "food": 100.84,
    "care": 101.47,
    "pets": 100.86,
    "svc": 99.96,
    "foodGap": -0.68,
    "careGap": -0.05,
    "foodBurden": 99.33,
    "careBurden": 99.95
  },
  {
    "period": "2019-05",
    "year": 2019,
    "month": 5,
    "all": 101.74,
    "food": 101.09,
    "care": 101.73,
    "pets": 101.07,
    "svc": 100.45,
    "foodGap": -0.65,
    "careGap": -0.01,
    "foodBurden": 99.36,
    "careBurden": 99.99
  },
  {
    "period": "2019-06",
    "year": 2019,
    "month": 6,
    "all": 101.76,
    "food": 101.65,
    "care": 102.12,
    "pets": 101.4,
    "svc": 100.5,
    "foodGap": -0.11,
    "careGap": 0.36,
    "foodBurden": 99.89,
    "careBurden": 100.35
  },
  {
    "period": "2019-07",
    "year": 2019,
    "month": 7,
    "all": 101.93,
    "food": 101.85,
    "care": 102.3,
    "pets": 101.61,
    "svc": 100.93,
    "foodGap": -0.08,
    "careGap": 0.37,
    "foodBurden": 99.92,
    "careBurden": 100.36
  },
  {
    "period": "2019-08",
    "year": 2019,
    "month": 8,
    "all": 101.93,
    "food": 102.1,
    "care": 102.56,
    "pets": 101.83,
    "svc": 100.95,
    "foodGap": 0.17,
    "careGap": 0.63,
    "foodBurden": 100.17,
    "careBurden": 100.62
  },
  {
    "period": "2019-09",
    "year": 2019,
    "month": 9,
    "all": 102.01,
    "food": 102.37,
    "care": 103.07,
    "pets": 102.09,
    "svc": 101.06,
    "foodGap": 0.36,
    "careGap": 1.06,
    "foodBurden": 100.35,
    "careBurden": 101.04
  },
  {
    "period": "2019-10",
    "year": 2019,
    "month": 10,
    "all": 102.24,
    "food": 102.59,
    "care": 103.21,
    "pets": 102.29,
    "svc": 101.16,
    "foodGap": 0.35,
    "careGap": 0.97,
    "foodBurden": 100.34,
    "careBurden": 100.95
  },
  {
    "period": "2019-11",
    "year": 2019,
    "month": 11,
    "all": 102.18,
    "food": 102.86,
    "care": 103.29,
    "pets": 102.45,
    "svc": 101.1,
    "foodGap": 0.68,
    "careGap": 1.11,
    "foodBurden": 100.67,
    "careBurden": 101.09
  },
  {
    "period": "2019-12",
    "year": 2019,
    "month": 12,
    "all": 102.09,
    "food": 103.09,
    "care": 103.66,
    "pets": 102.75,
    "svc": 101.54,
    "foodGap": 1,
    "careGap": 1.57,
    "foodBurden": 100.98,
    "careBurden": 101.54
  },
  {
    "period": "2020-01",
    "year": 2020,
    "month": 1,
    "all": 102.49,
    "food": 103.45,
    "care": 103.97,
    "pets": 103.12,
    "svc": 102.11,
    "foodGap": 0.96,
    "careGap": 1.48,
    "foodBurden": 100.94,
    "careBurden": 101.44
  },
  {
    "period": "2020-02",
    "year": 2020,
    "month": 2,
    "all": 102.77,
    "food": 103.68,
    "care": 104.4,
    "pets": 103.35,
    "svc": 102.37,
    "foodGap": 0.91,
    "careGap": 1.63,
    "foodBurden": 100.89,
    "careBurden": 101.59
  },
  {
    "period": "2020-03",
    "year": 2020,
    "month": 3,
    "all": 102.54,
    "food": 103.64,
    "care": 104.51,
    "pets": 103.51,
    "svc": 102.67,
    "foodGap": 1.1,
    "careGap": 1.97,
    "foodBurden": 101.07,
    "careBurden": 101.92
  },
  {
    "period": "2020-04",
    "year": 2020,
    "month": 4,
    "all": 101.86,
    "food": 103.3,
    "care": 104.44,
    "pets": 103.66,
    "svc": 102.49,
    "foodGap": 1.44,
    "careGap": 2.58,
    "foodBurden": 101.41,
    "careBurden": 102.53
  },
  {
    "period": "2020-05",
    "year": 2020,
    "month": 5,
    "all": 101.86,
    "food": 103.51,
    "care": 104.28,
    "pets": 104.04,
    "svc": 102.52,
    "foodGap": 1.65,
    "careGap": 2.42,
    "foodBurden": 101.62,
    "careBurden": 102.38
  },
  {
    "period": "2020-06",
    "year": 2020,
    "month": 6,
    "all": 102.42,
    "food": 104.41,
    "care": 104.35,
    "pets": 104.58,
    "svc": 102.56,
    "foodGap": 1.99,
    "careGap": 1.93,
    "foodBurden": 101.94,
    "careBurden": 101.88
  },
  {
    "period": "2020-07",
    "year": 2020,
    "month": 7,
    "all": 102.94,
    "food": 104.84,
    "care": 104.41,
    "pets": 105.07,
    "svc": 102.49,
    "foodGap": 1.9,
    "careGap": 1.47,
    "foodBurden": 101.85,
    "careBurden": 101.43
  },
  {
    "period": "2020-08",
    "year": 2020,
    "month": 8,
    "all": 103.26,
    "food": 104.92,
    "care": 104.53,
    "pets": 105.37,
    "svc": 102.61,
    "foodGap": 1.66,
    "careGap": 1.27,
    "foodBurden": 101.61,
    "careBurden": 101.23
  },
  {
    "period": "2020-09",
    "year": 2020,
    "month": 9,
    "all": 103.4,
    "food": 105.19,
    "care": 105.01,
    "pets": 105.96,
    "svc": 102.84,
    "foodGap": 1.79,
    "careGap": 1.61,
    "foodBurden": 101.73,
    "careBurden": 101.56
  },
  {
    "period": "2020-10",
    "year": 2020,
    "month": 10,
    "all": 103.45,
    "food": 105.5,
    "care": 104.86,
    "pets": 106.25,
    "svc": 102.44,
    "foodGap": 2.05,
    "careGap": 1.41,
    "foodBurden": 101.98,
    "careBurden": 101.36
  },
  {
    "period": "2020-11",
    "year": 2020,
    "month": 11,
    "all": 103.38,
    "food": 105.86,
    "care": 105.18,
    "pets": 106.37,
    "svc": 101.8,
    "foodGap": 2.48,
    "careGap": 1.8,
    "foodBurden": 102.4,
    "careBurden": 101.74
  },
  {
    "period": "2020-12",
    "year": 2020,
    "month": 12,
    "all": 103.48,
    "food": 106.16,
    "care": 105.57,
    "pets": 106.77,
    "svc": 102.63,
    "foodGap": 2.68,
    "careGap": 2.09,
    "foodBurden": 102.59,
    "careBurden": 102.02
  },
  {
    "period": "2021-01",
    "year": 2021,
    "month": 1,
    "all": 103.92,
    "food": 106.42,
    "care": 106.36,
    "pets": 107.13,
    "svc": 101.6,
    "foodGap": 2.5,
    "careGap": 2.44,
    "foodBurden": 102.41,
    "careBurden": 102.35
  },
  {
    "period": "2021-02",
    "year": 2021,
    "month": 2,
    "all": 104.49,
    "food": 106.7,
    "care": 106.41,
    "pets": 107.19,
    "svc": 102.24,
    "foodGap": 2.21,
    "careGap": 1.92,
    "foodBurden": 102.12,
    "careBurden": 101.84
  },
  {
    "period": "2021-03",
    "year": 2021,
    "month": 3,
    "all": 105.23,
    "food": 106.96,
    "care": 106.31,
    "pets": 107.32,
    "svc": 103.49,
    "foodGap": 1.73,
    "careGap": 1.08,
    "foodBurden": 101.64,
    "careBurden": 101.03
  },
  {
    "period": "2021-04",
    "year": 2021,
    "month": 4,
    "all": 106.1,
    "food": 107.17,
    "care": 106.73,
    "pets": 107.65,
    "svc": 103.53,
    "foodGap": 1.07,
    "careGap": 0.63,
    "foodBurden": 101.01,
    "careBurden": 100.59
  },
  {
    "period": "2021-05",
    "year": 2021,
    "month": 5,
    "all": 106.95,
    "food": 107.79,
    "care": 107.14,
    "pets": 108.24,
    "svc": 103.73,
    "foodGap": 0.84,
    "careGap": 0.19,
    "foodBurden": 100.79,
    "careBurden": 100.18
  },
  {
    "period": "2021-06",
    "year": 2021,
    "month": 6,
    "all": 107.94,
    "food": 108.71,
    "care": 107.93,
    "pets": 109.01,
    "svc": 103.88,
    "foodGap": 0.77,
    "careGap": -0.01,
    "foodBurden": 100.71,
    "careBurden": 99.99
  },
  {
    "period": "2021-07",
    "year": 2021,
    "month": 7,
    "all": 108.46,
    "food": 109.35,
    "care": 108.98,
    "pets": 109.86,
    "svc": 104.39,
    "foodGap": 0.89,
    "careGap": 0.52,
    "foodBurden": 100.82,
    "careBurden": 100.48
  },
  {
    "period": "2021-08",
    "year": 2021,
    "month": 8,
    "all": 108.68,
    "food": 110.05,
    "care": 111.14,
    "pets": 110.33,
    "svc": 104.76,
    "foodGap": 1.37,
    "careGap": 2.46,
    "foodBurden": 101.26,
    "careBurden": 102.26
  },
  {
    "period": "2021-09",
    "year": 2021,
    "month": 9,
    "all": 108.98,
    "food": 110.7,
    "care": 111.35,
    "pets": 110.92,
    "svc": 105.24,
    "foodGap": 1.72,
    "careGap": 2.37,
    "foodBurden": 101.58,
    "careBurden": 102.17
  },
  {
    "period": "2021-10",
    "year": 2021,
    "month": 10,
    "all": 109.88,
    "food": 111.74,
    "care": 112.11,
    "pets": 111.85,
    "svc": 106.4,
    "foodGap": 1.86,
    "careGap": 2.23,
    "foodBurden": 101.69,
    "careBurden": 102.03
  },
  {
    "period": "2021-11",
    "year": 2021,
    "month": 11,
    "all": 110.42,
    "food": 112.24,
    "care": 113.12,
    "pets": 112.52,
    "svc": 106.44,
    "foodGap": 1.82,
    "careGap": 2.7,
    "foodBurden": 101.65,
    "careBurden": 102.45
  },
  {
    "period": "2021-12",
    "year": 2021,
    "month": 12,
    "all": 110.76,
    "food": 113.15,
    "care": 114.49,
    "pets": 113.19,
    "svc": 107.2,
    "foodGap": 2.39,
    "careGap": 3.73,
    "foodBurden": 102.16,
    "careBurden": 103.37
  },
  {
    "period": "2022-01",
    "year": 2022,
    "month": 1,
    "all": 111.69,
    "food": 113.93,
    "care": 115.42,
    "pets": 113.94,
    "svc": 107.66,
    "foodGap": 2.24,
    "careGap": 3.73,
    "foodBurden": 102.01,
    "careBurden": 103.34
  },
  {
    "period": "2022-02",
    "year": 2022,
    "month": 2,
    "all": 112.71,
    "food": 114.66,
    "care": 116.48,
    "pets": 114.44,
    "svc": 109,
    "foodGap": 1.95,
    "careGap": 3.77,
    "foodBurden": 101.73,
    "careBurden": 103.34
  },
  {
    "period": "2022-03",
    "year": 2022,
    "month": 3,
    "all": 114.22,
    "food": 115.48,
    "care": 117.26,
    "pets": 114.73,
    "svc": 110.09,
    "foodGap": 1.26,
    "careGap": 3.04,
    "foodBurden": 101.1,
    "careBurden": 102.66
  },
  {
    "period": "2022-04",
    "year": 2022,
    "month": 4,
    "all": 114.86,
    "food": 116.54,
    "care": 117.74,
    "pets": 115.4,
    "svc": 110.73,
    "foodGap": 1.68,
    "careGap": 2.88,
    "foodBurden": 101.46,
    "careBurden": 102.51
  },
  {
    "period": "2022-05",
    "year": 2022,
    "month": 5,
    "all": 116.12,
    "food": 117.47,
    "care": 118,
    "pets": 116.25,
    "svc": 110.61,
    "foodGap": 1.35,
    "careGap": 1.88,
    "foodBurden": 101.16,
    "careBurden": 101.62
  },
  {
    "period": "2022-06",
    "year": 2022,
    "month": 6,
    "all": 117.72,
    "food": 118.41,
    "care": 118.97,
    "pets": 117.35,
    "svc": 111.15,
    "foodGap": 0.69,
    "careGap": 1.25,
    "foodBurden": 100.59,
    "careBurden": 101.06
  },
  {
    "period": "2022-07",
    "year": 2022,
    "month": 7,
    "all": 117.7,
    "food": 119.07,
    "care": 119.92,
    "pets": 118.18,
    "svc": 111.73,
    "foodGap": 1.37,
    "careGap": 2.22,
    "foodBurden": 101.16,
    "careBurden": 101.89
  },
  {
    "period": "2022-08",
    "year": 2022,
    "month": 8,
    "all": 117.66,
    "food": 119.97,
    "care": 119.98,
    "pets": 119.2,
    "svc": 111.81,
    "foodGap": 2.31,
    "careGap": 2.32,
    "foodBurden": 101.96,
    "careBurden": 101.97
  },
  {
    "period": "2022-09",
    "year": 2022,
    "month": 9,
    "all": 117.92,
    "food": 120.5,
    "care": 119.2,
    "pets": 120.33,
    "svc": 112.1,
    "foodGap": 2.58,
    "careGap": 1.28,
    "foodBurden": 102.19,
    "careBurden": 101.09
  },
  {
    "period": "2022-10",
    "year": 2022,
    "month": 10,
    "all": 118.39,
    "food": 121.77,
    "care": 120.17,
    "pets": 121.45,
    "svc": 112.63,
    "foodGap": 3.38,
    "careGap": 1.78,
    "foodBurden": 102.85,
    "careBurden": 101.5
  },
  {
    "period": "2022-11",
    "year": 2022,
    "month": 11,
    "all": 118.27,
    "food": 122.3,
    "care": 122.09,
    "pets": 122.07,
    "svc": 113.12,
    "foodGap": 4.03,
    "careGap": 3.82,
    "foodBurden": 103.41,
    "careBurden": 103.23
  },
  {
    "period": "2022-12",
    "year": 2022,
    "month": 12,
    "all": 117.91,
    "food": 122.46,
    "care": 122.63,
    "pets": 122.53,
    "svc": 112.64,
    "foodGap": 4.55,
    "careGap": 4.72,
    "foodBurden": 103.86,
    "careBurden": 104
  },
  {
    "period": "2023-01",
    "year": 2023,
    "month": 1,
    "all": 118.85,
    "food": 123.14,
    "care": 123.28,
    "pets": 123.29,
    "svc": 113.51,
    "foodGap": 4.29,
    "careGap": 4.43,
    "foodBurden": 103.61,
    "careBurden": 103.73
  },
  {
    "period": "2023-02",
    "year": 2023,
    "month": 2,
    "all": 119.52,
    "food": 123.83,
    "care": 124.37,
    "pets": 124.07,
    "svc": 115.06,
    "foodGap": 4.31,
    "careGap": 4.85,
    "foodBurden": 103.61,
    "careBurden": 104.06
  },
  {
    "period": "2023-03",
    "year": 2023,
    "month": 3,
    "all": 119.91,
    "food": 124.73,
    "care": 124.68,
    "pets": 124.81,
    "svc": 115.86,
    "foodGap": 4.82,
    "careGap": 4.77,
    "foodBurden": 104.02,
    "careBurden": 103.98
  },
  {
    "period": "2023-04",
    "year": 2023,
    "month": 4,
    "all": 120.52,
    "food": 124.9,
    "care": 125.29,
    "pets": 125.27,
    "svc": 118.62,
    "foodGap": 4.38,
    "careGap": 4.77,
    "foodBurden": 103.63,
    "careBurden": 103.96
  },
  {
    "period": "2023-05",
    "year": 2023,
    "month": 5,
    "all": 120.82,
    "food": 125.41,
    "care": 126.59,
    "pets": 125.86,
    "svc": 119.44,
    "foodGap": 4.59,
    "careGap": 5.77,
    "foodBurden": 103.8,
    "careBurden": 104.78
  },
  {
    "period": "2023-06",
    "year": 2023,
    "month": 6,
    "all": 121.21,
    "food": 125.73,
    "care": 126.08,
    "pets": 126.34,
    "svc": 119.6,
    "foodGap": 4.52,
    "careGap": 4.87,
    "foodBurden": 103.73,
    "careBurden": 104.02
  },
  {
    "period": "2023-07",
    "year": 2023,
    "month": 7,
    "all": 121.44,
    "food": 125.94,
    "care": 126.28,
    "pets": 126.56,
    "svc": 118.98,
    "foodGap": 4.5,
    "careGap": 4.84,
    "foodBurden": 103.71,
    "careBurden": 103.99
  },
  {
    "period": "2023-08",
    "year": 2023,
    "month": 8,
    "all": 121.98,
    "food": 126.19,
    "care": 127.02,
    "pets": 127,
    "svc": 120.06,
    "foodGap": 4.21,
    "careGap": 5.04,
    "foodBurden": 103.45,
    "careBurden": 104.13
  },
  {
    "period": "2023-09",
    "year": 2023,
    "month": 9,
    "all": 122.28,
    "food": 126.66,
    "care": 127.18,
    "pets": 127.5,
    "svc": 121.38,
    "foodGap": 4.38,
    "careGap": 4.9,
    "foodBurden": 103.58,
    "careBurden": 104.01
  },
  {
    "period": "2023-10",
    "year": 2023,
    "month": 10,
    "all": 122.23,
    "food": 127.04,
    "care": 127.57,
    "pets": 127.98,
    "svc": 121.54,
    "foodGap": 4.81,
    "careGap": 5.34,
    "foodBurden": 103.94,
    "careBurden": 104.37
  },
  {
    "period": "2023-11",
    "year": 2023,
    "month": 11,
    "all": 121.99,
    "food": 127.62,
    "care": 128.44,
    "pets": 128.53,
    "svc": 121.86,
    "foodGap": 5.63,
    "careGap": 6.45,
    "foodBurden": 104.62,
    "careBurden": 105.29
  },
  {
    "period": "2023-12",
    "year": 2023,
    "month": 12,
    "all": 121.86,
    "food": 127.96,
    "care": 128.98,
    "pets": 128.95,
    "svc": 122.02,
    "foodGap": 6.1,
    "careGap": 7.12,
    "foodBurden": 105.01,
    "careBurden": 105.84
  },
  {
    "period": "2024-01",
    "year": 2024,
    "month": 1,
    "all": 122.53,
    "food": 128.43,
    "care": 129.88,
    "pets": 129.56,
    "svc": 123.43,
    "foodGap": 5.9,
    "careGap": 7.35,
    "foodBurden": 104.82,
    "careBurden": 106
  },
  {
    "period": "2024-02",
    "year": 2024,
    "month": 2,
    "all": 123.29,
    "food": 128.52,
    "care": 130.23,
    "pets": 129.68,
    "svc": 121.86,
    "foodGap": 5.23,
    "careGap": 6.94,
    "foodBurden": 104.24,
    "careBurden": 105.63
  },
  {
    "period": "2024-03",
    "year": 2024,
    "month": 3,
    "all": 124.08,
    "food": 128.78,
    "care": 130.12,
    "pets": 130.02,
    "svc": 123.39,
    "foodGap": 4.7,
    "careGap": 6.04,
    "foodBurden": 103.79,
    "careBurden": 104.87
  },
  {
    "period": "2024-04",
    "year": 2024,
    "month": 4,
    "all": 124.57,
    "food": 129.18,
    "care": 132.37,
    "pets": 130.47,
    "svc": 124.56,
    "foodGap": 4.61,
    "careGap": 7.8,
    "foodBurden": 103.7,
    "careBurden": 106.26
  },
  {
    "period": "2024-05",
    "year": 2024,
    "month": 5,
    "all": 124.77,
    "food": 129.76,
    "care": 132.66,
    "pets": 130.93,
    "svc": 123.69,
    "foodGap": 4.99,
    "careGap": 7.89,
    "foodBurden": 104,
    "careBurden": 106.32
  },
  {
    "period": "2024-06",
    "year": 2024,
    "month": 6,
    "all": 124.82,
    "food": 130.6,
    "care": 133.05,
    "pets": 131.47,
    "svc": 125.11,
    "foodGap": 5.78,
    "careGap": 8.23,
    "foodBurden": 104.63,
    "careBurden": 106.59
  },
  {
    "period": "2024-07",
    "year": 2024,
    "month": 7,
    "all": 124.96,
    "food": 130.75,
    "care": 133.45,
    "pets": 131.74,
    "svc": 125.59,
    "foodGap": 5.79,
    "careGap": 8.49,
    "foodBurden": 104.63,
    "careBurden": 106.79
  },
  {
    "period": "2024-08",
    "year": 2024,
    "month": 8,
    "all": 125.06,
    "food": 131.02,
    "care": 134.21,
    "pets": 132.09,
    "svc": 125.52,
    "foodGap": 5.96,
    "careGap": 9.15,
    "foodBurden": 104.77,
    "careBurden": 107.32
  },
  {
    "period": "2024-09",
    "year": 2024,
    "month": 9,
    "all": 125.26,
    "food": 131.54,
    "care": 134.46,
    "pets": 132.54,
    "svc": 125.73,
    "foodGap": 6.28,
    "careGap": 9.2,
    "foodBurden": 105.01,
    "careBurden": 107.34
  },
  {
    "period": "2024-10",
    "year": 2024,
    "month": 10,
    "all": 125.41,
    "food": 131.8,
    "care": 134.85,
    "pets": 132.85,
    "svc": 126.11,
    "foodGap": 6.39,
    "careGap": 9.44,
    "foodBurden": 105.1,
    "careBurden": 107.53
  },
  {
    "period": "2024-11",
    "year": 2024,
    "month": 11,
    "all": 125.34,
    "food": 132.21,
    "care": 135.4,
    "pets": 133.22,
    "svc": 126.39,
    "foodGap": 6.87,
    "careGap": 10.06,
    "foodBurden": 105.48,
    "careBurden": 108.03
  },
  {
    "period": "2024-12",
    "year": 2024,
    "month": 12,
    "all": 125.38,
    "food": 132.52,
    "care": 135.5,
    "pets": 133.62,
    "svc": 125.72,
    "foodGap": 7.14,
    "careGap": 10.12,
    "foodBurden": 105.69,
    "careBurden": 108.07
  },
  {
    "period": "2025-01",
    "year": 2025,
    "month": 1,
    "all": 126.2,
    "food": 132.7,
    "care": 135.76,
    "pets": 133.94,
    "svc": 124.25,
    "foodGap": 6.5,
    "careGap": 9.56,
    "foodBurden": 105.15,
    "careBurden": 107.58
  },
  {
    "period": "2025-02",
    "year": 2025,
    "month": 2,
    "all": 126.76,
    "food": 133.22,
    "care": 136.45,
    "pets": 134.46,
    "svc": 125.82,
    "foodGap": 6.46,
    "careGap": 9.69,
    "foodBurden": 105.1,
    "careBurden": 107.64
  },
  {
    "period": "2025-03",
    "year": 2025,
    "month": 3,
    "all": 127.05,
    "food": 134,
    "care": 136.48,
    "pets": 134.95,
    "svc": 129.14,
    "foodGap": 6.95,
    "careGap": 9.43,
    "foodBurden": 105.47,
    "careBurden": 107.42
  },
  {
    "period": "2025-04",
    "year": 2025,
    "month": 4,
    "all": 127.45,
    "food": 134.76,
    "care": 136.75,
    "pets": 135.54,
    "svc": 129.57,
    "foodGap": 7.31,
    "careGap": 9.3,
    "foodBurden": 105.74,
    "careBurden": 107.3
  },
  {
    "period": "2025-05",
    "year": 2025,
    "month": 5,
    "all": 127.71,
    "food": 135.2,
    "care": 137.42,
    "pets": 135.97,
    "svc": 129.99,
    "foodGap": 7.49,
    "careGap": 9.71,
    "foodBurden": 105.86,
    "careBurden": 107.6
  },
  {
    "period": "2025-06",
    "year": 2025,
    "month": 6,
    "all": 128.15,
    "food": 135.89,
    "care": 139.6,
    "pets": 136.51,
    "svc": 130.8,
    "foodGap": 7.74,
    "careGap": 11.45,
    "foodBurden": 106.04,
    "careBurden": 108.93
  },
  {
    "period": "2025-07",
    "year": 2025,
    "month": 7,
    "all": 128.34,
    "food": 136.52,
    "care": 140.07,
    "pets": 136.89,
    "svc": 131.89,
    "foodGap": 8.18,
    "careGap": 11.73,
    "foodBurden": 106.37,
    "careBurden": 109.14
  },
  {
    "period": "2025-08",
    "year": 2025,
    "month": 8,
    "all": 128.71,
    "food": 137,
    "care": 140.63,
    "pets": 137.28,
    "svc": 131.7,
    "foodGap": 8.29,
    "careGap": 11.92,
    "foodBurden": 106.44,
    "careBurden": 109.26
  },
  {
    "period": "2025-09",
    "year": 2025,
    "month": 9,
    "all": 129.04,
    "food": 137.04,
    "care": 141.05,
    "pets": 137.47,
    "svc": 131.24,
    "foodGap": 8,
    "careGap": 12.01,
    "foodBurden": 106.2,
    "careBurden": 109.31
  },
  {
    "period": "2025-11",
    "year": 2025,
    "month": 11,
    "all": 128.77,
    "food": 137.87,
    "care": 141.27,
    "pets": 138.1,
    "svc": 132.63,
    "foodGap": 9.1,
    "careGap": 12.5,
    "foodBurden": 107.07,
    "careBurden": 109.71
  },
  {
    "period": "2025-12",
    "year": 2025,
    "month": 12,
    "all": 128.74,
    "food": 139.01,
    "care": 141.73,
    "pets": 139.06,
    "svc": 131.54,
    "foodGap": 10.27,
    "careGap": 12.99,
    "foodBurden": 107.98,
    "careBurden": 110.09
  },
  {
    "period": "2026-01",
    "year": 2026,
    "month": 1,
    "all": 129.22,
    "food": 138.97,
    "care": 143.58,
    "pets": 139.26,
    "svc": 134.61,
    "foodGap": 9.75,
    "careGap": 14.36,
    "foodBurden": 107.55,
    "careBurden": 111.11
  },
  {
    "period": "2026-02",
    "year": 2026,
    "month": 2,
    "all": 129.82,
    "food": 139.34,
    "care": 144.24,
    "pets": 139.71,
    "svc": 133.95,
    "foodGap": 9.52,
    "careGap": 14.42,
    "foodBurden": 107.33,
    "careBurden": 111.11
  },
  {
    "period": "2026-03",
    "year": 2026,
    "month": 3,
    "all": 131.19,
    "food": 139.76,
    "care": 144.68,
    "pets": 140.04,
    "svc": 132.27,
    "foodGap": 8.57,
    "careGap": 13.49,
    "foodBurden": 106.53,
    "careBurden": 110.28
  },
  {
    "period": "2026-04",
    "year": 2026,
    "month": 4,
    "all": 132.3,
    "food": 139.92,
    "care": 146.07,
    "pets": 140.36,
    "svc": 135.66,
    "foodGap": 7.62,
    "careGap": 13.77,
    "foodBurden": 105.76,
    "careBurden": 110.41
  },
  {
    "period": "2026-05",
    "year": 2026,
    "month": 5,
    "all": 133.14,
    "food": 140.33,
    "care": 146.21,
    "pets": 140.78,
    "svc": 138.46,
    "foodGap": 7.19,
    "careGap": 13.07,
    "foodBurden": 105.4,
    "careBurden": 109.82
  },
  {
    "period": "2026-06",
    "year": 2026,
    "month": 6,
    "all": 132.67,
    "food": 140.9,
    "care": 147.01,
    "pets": 141.11,
    "svc": 138.32,
    "foodGap": 8.23,
    "careGap": 14.34,
    "foodBurden": 106.2,
    "careBurden": 110.81
  },
  {
    "period": "2026-07",
    "year": 2026,
    "month": 7,
    "all": 132.66,
    "food": 141.2,
    "care": 147.56,
    "pets": 141.54,
    "svc": 137.88,
    "foodGap": 8.54,
    "careGap": 14.9,
    "foodBurden": 106.44,
    "careBurden": 111.23
  }
];

export type YoyRow = {
  period: string;
  year: number;
  month: number;
  all: number;
  food: number;
  care: number;
};

export const MONTHLY_YOY: YoyRow[] = [
  {
    "period": "2020-01",
    "year": 2020,
    "month": 1,
    "all": 2.49,
    "food": 3.45,
    "care": 3.97
  },
  {
    "period": "2020-02",
    "year": 2020,
    "month": 2,
    "all": 2.34,
    "food": 3.37,
    "care": 3.97
  },
  {
    "period": "2020-03",
    "year": 2020,
    "month": 3,
    "all": 1.53,
    "food": 3.19,
    "care": 3.31
  },
  {
    "period": "2020-04",
    "year": 2020,
    "month": 4,
    "all": 0.33,
    "food": 2.44,
    "care": 2.93
  },
  {
    "period": "2020-05",
    "year": 2020,
    "month": 5,
    "all": 0.12,
    "food": 2.39,
    "care": 2.51
  },
  {
    "period": "2020-06",
    "year": 2020,
    "month": 6,
    "all": 0.65,
    "food": 2.72,
    "care": 2.18
  },
  {
    "period": "2020-07",
    "year": 2020,
    "month": 7,
    "all": 0.99,
    "food": 2.94,
    "care": 2.06
  },
  {
    "period": "2020-08",
    "year": 2020,
    "month": 8,
    "all": 1.3,
    "food": 2.76,
    "care": 1.92
  },
  {
    "period": "2020-09",
    "year": 2020,
    "month": 9,
    "all": 1.36,
    "food": 2.75,
    "care": 1.88
  },
  {
    "period": "2020-10",
    "year": 2020,
    "month": 10,
    "all": 1.18,
    "food": 2.84,
    "care": 1.6
  },
  {
    "period": "2020-11",
    "year": 2020,
    "month": 11,
    "all": 1.17,
    "food": 2.92,
    "care": 1.83
  },
  {
    "period": "2020-12",
    "year": 2020,
    "month": 12,
    "all": 1.36,
    "food": 2.98,
    "care": 1.84
  },
  {
    "period": "2021-01",
    "year": 2021,
    "month": 1,
    "all": 1.4,
    "food": 2.87,
    "care": 2.3
  },
  {
    "period": "2021-02",
    "year": 2021,
    "month": 2,
    "all": 1.67,
    "food": 2.91,
    "care": 1.93
  },
  {
    "period": "2021-03",
    "year": 2021,
    "month": 3,
    "all": 2.62,
    "food": 3.2,
    "care": 1.72
  },
  {
    "period": "2021-04",
    "year": 2021,
    "month": 4,
    "all": 4.16,
    "food": 3.75,
    "care": 2.19
  },
  {
    "period": "2021-05",
    "year": 2021,
    "month": 5,
    "all": 5,
    "food": 4.13,
    "care": 2.74
  },
  {
    "period": "2021-06",
    "year": 2021,
    "month": 6,
    "all": 5.39,
    "food": 4.12,
    "care": 3.43
  },
  {
    "period": "2021-07",
    "year": 2021,
    "month": 7,
    "all": 5.36,
    "food": 4.3,
    "care": 4.38
  },
  {
    "period": "2021-08",
    "year": 2021,
    "month": 8,
    "all": 5.25,
    "food": 4.89,
    "care": 6.32
  },
  {
    "period": "2021-09",
    "year": 2021,
    "month": 9,
    "all": 5.4,
    "food": 5.24,
    "care": 6.04
  },
  {
    "period": "2021-10",
    "year": 2021,
    "month": 10,
    "all": 6.22,
    "food": 5.91,
    "care": 6.91
  },
  {
    "period": "2021-11",
    "year": 2021,
    "month": 11,
    "all": 6.81,
    "food": 6.03,
    "care": 7.55
  },
  {
    "period": "2021-12",
    "year": 2021,
    "month": 12,
    "all": 7.04,
    "food": 6.58,
    "care": 8.45
  },
  {
    "period": "2022-01",
    "year": 2022,
    "month": 1,
    "all": 7.48,
    "food": 7.06,
    "care": 8.52
  },
  {
    "period": "2022-02",
    "year": 2022,
    "month": 2,
    "all": 7.87,
    "food": 7.46,
    "care": 9.46
  },
  {
    "period": "2022-03",
    "year": 2022,
    "month": 3,
    "all": 8.54,
    "food": 7.97,
    "care": 10.3
  },
  {
    "period": "2022-04",
    "year": 2022,
    "month": 4,
    "all": 8.26,
    "food": 8.74,
    "care": 10.32
  },
  {
    "period": "2022-05",
    "year": 2022,
    "month": 5,
    "all": 8.57,
    "food": 8.98,
    "care": 10.14
  },
  {
    "period": "2022-06",
    "year": 2022,
    "month": 6,
    "all": 9.06,
    "food": 8.92,
    "care": 10.23
  },
  {
    "period": "2022-07",
    "year": 2022,
    "month": 7,
    "all": 8.52,
    "food": 8.89,
    "care": 10.04
  },
  {
    "period": "2022-08",
    "year": 2022,
    "month": 8,
    "all": 8.26,
    "food": 9.01,
    "care": 7.95
  },
  {
    "period": "2022-09",
    "year": 2022,
    "month": 9,
    "all": 8.2,
    "food": 8.85,
    "care": 7.05
  },
  {
    "period": "2022-10",
    "year": 2022,
    "month": 10,
    "all": 7.74,
    "food": 8.98,
    "care": 7.19
  },
  {
    "period": "2022-11",
    "year": 2022,
    "month": 11,
    "all": 7.11,
    "food": 8.96,
    "care": 7.93
  },
  {
    "period": "2022-12",
    "year": 2022,
    "month": 12,
    "all": 6.46,
    "food": 8.23,
    "care": 7.11
  },
  {
    "period": "2023-01",
    "year": 2023,
    "month": 1,
    "all": 6.41,
    "food": 8.08,
    "care": 6.81
  },
  {
    "period": "2023-02",
    "year": 2023,
    "month": 2,
    "all": 6.04,
    "food": 8,
    "care": 6.77
  },
  {
    "period": "2023-03",
    "year": 2023,
    "month": 3,
    "all": 4.98,
    "food": 8.01,
    "care": 6.33
  },
  {
    "period": "2023-04",
    "year": 2023,
    "month": 4,
    "all": 4.93,
    "food": 7.17,
    "care": 6.41
  },
  {
    "period": "2023-05",
    "year": 2023,
    "month": 5,
    "all": 4.05,
    "food": 6.76,
    "care": 7.28
  },
  {
    "period": "2023-06",
    "year": 2023,
    "month": 6,
    "all": 2.96,
    "food": 6.18,
    "care": 5.98
  },
  {
    "period": "2023-07",
    "year": 2023,
    "month": 7,
    "all": 3.18,
    "food": 5.77,
    "care": 5.3
  },
  {
    "period": "2023-08",
    "year": 2023,
    "month": 8,
    "all": 3.67,
    "food": 5.18,
    "care": 5.87
  },
  {
    "period": "2023-09",
    "year": 2023,
    "month": 9,
    "all": 3.7,
    "food": 5.11,
    "care": 6.69
  },
  {
    "period": "2023-10",
    "year": 2023,
    "month": 10,
    "all": 3.24,
    "food": 4.33,
    "care": 6.16
  },
  {
    "period": "2023-11",
    "year": 2023,
    "month": 11,
    "all": 3.15,
    "food": 4.35,
    "care": 5.2
  },
  {
    "period": "2023-12",
    "year": 2023,
    "month": 12,
    "all": 3.35,
    "food": 4.49,
    "care": 5.18
  },
  {
    "period": "2024-01",
    "year": 2024,
    "month": 1,
    "all": 3.1,
    "food": 4.3,
    "care": 5.35
  },
  {
    "period": "2024-02",
    "year": 2024,
    "month": 2,
    "all": 3.15,
    "food": 3.79,
    "care": 4.71
  },
  {
    "period": "2024-03",
    "year": 2024,
    "month": 3,
    "all": 3.48,
    "food": 3.25,
    "care": 4.36
  },
  {
    "period": "2024-04",
    "year": 2024,
    "month": 4,
    "all": 3.36,
    "food": 3.43,
    "care": 5.65
  },
  {
    "period": "2024-05",
    "year": 2024,
    "month": 5,
    "all": 3.27,
    "food": 3.47,
    "care": 4.8
  },
  {
    "period": "2024-06",
    "year": 2024,
    "month": 6,
    "all": 2.98,
    "food": 3.87,
    "care": 5.53
  },
  {
    "period": "2024-07",
    "year": 2024,
    "month": 7,
    "all": 2.9,
    "food": 3.82,
    "care": 5.68
  },
  {
    "period": "2024-08",
    "year": 2024,
    "month": 8,
    "all": 2.53,
    "food": 3.83,
    "care": 5.66
  },
  {
    "period": "2024-09",
    "year": 2024,
    "month": 9,
    "all": 2.44,
    "food": 3.85,
    "care": 5.72
  },
  {
    "period": "2024-10",
    "year": 2024,
    "month": 10,
    "all": 2.6,
    "food": 3.75,
    "care": 5.71
  },
  {
    "period": "2024-11",
    "year": 2024,
    "month": 11,
    "all": 2.75,
    "food": 3.6,
    "care": 5.42
  },
  {
    "period": "2024-12",
    "year": 2024,
    "month": 12,
    "all": 2.89,
    "food": 3.56,
    "care": 5.06
  },
  {
    "period": "2025-01",
    "year": 2025,
    "month": 1,
    "all": 3,
    "food": 3.32,
    "care": 4.53
  },
  {
    "period": "2025-02",
    "year": 2025,
    "month": 2,
    "all": 2.81,
    "food": 3.66,
    "care": 4.78
  },
  {
    "period": "2025-03",
    "year": 2025,
    "month": 3,
    "all": 2.39,
    "food": 4.05,
    "care": 4.89
  },
  {
    "period": "2025-04",
    "year": 2025,
    "month": 4,
    "all": 2.31,
    "food": 4.32,
    "care": 3.31
  },
  {
    "period": "2025-05",
    "year": 2025,
    "month": 5,
    "all": 2.36,
    "food": 4.19,
    "care": 3.59
  },
  {
    "period": "2025-06",
    "year": 2025,
    "month": 6,
    "all": 2.67,
    "food": 4.05,
    "care": 4.92
  },
  {
    "period": "2025-07",
    "year": 2025,
    "month": 7,
    "all": 2.7,
    "food": 4.41,
    "care": 4.96
  },
  {
    "period": "2025-08",
    "year": 2025,
    "month": 8,
    "all": 2.92,
    "food": 4.56,
    "care": 4.78
  },
  {
    "period": "2025-09",
    "year": 2025,
    "month": 9,
    "all": 3.02,
    "food": 4.18,
    "care": 4.9
  },
  {
    "period": "2025-11",
    "year": 2025,
    "month": 11,
    "all": 2.74,
    "food": 4.28,
    "care": 4.34
  },
  {
    "period": "2025-12",
    "year": 2025,
    "month": 12,
    "all": 2.68,
    "food": 4.9,
    "care": 4.6
  },
  {
    "period": "2026-01",
    "year": 2026,
    "month": 1,
    "all": 2.39,
    "food": 4.72,
    "care": 5.76
  },
  {
    "period": "2026-02",
    "year": 2026,
    "month": 2,
    "all": 2.41,
    "food": 4.59,
    "care": 5.71
  },
  {
    "period": "2026-03",
    "year": 2026,
    "month": 3,
    "all": 3.26,
    "food": 4.3,
    "care": 6.01
  },
  {
    "period": "2026-04",
    "year": 2026,
    "month": 4,
    "all": 3.81,
    "food": 3.83,
    "care": 6.82
  },
  {
    "period": "2026-05",
    "year": 2026,
    "month": 5,
    "all": 4.25,
    "food": 3.79,
    "care": 6.4
  },
  {
    "period": "2026-06",
    "year": 2026,
    "month": 6,
    "all": 3.53,
    "food": 3.69,
    "care": 5.31
  },
  {
    "period": "2026-07",
    "year": 2026,
    "month": 7,
    "all": 3.37,
    "food": 3.43,
    "care": 5.35
  }
];

export type AnnualRow = {
  year: number;
  all: number;
  food: number;
  care: number;
  foodGap: number;
  careGap: number;
  months: number;
};

export const ANNUAL: AnnualRow[] = [
  {
    "year": 2019,
    "all": 101.57,
    "food": 101.6,
    "care": 102.08,
    "foodGap": 0.03,
    "careGap": 0.51,
    "months": 12
  },
  {
    "year": 2020,
    "all": 102.82,
    "food": 104.54,
    "care": 104.63,
    "foodGap": 1.72,
    "careGap": 1.81,
    "months": 12
  },
  {
    "year": 2021,
    "all": 107.65,
    "food": 109.25,
    "care": 109.34,
    "foodGap": 1.6,
    "careGap": 1.69,
    "months": 12
  },
  {
    "year": 2022,
    "all": 116.26,
    "food": 118.55,
    "care": 118.99,
    "foodGap": 2.29,
    "careGap": 2.73,
    "months": 12
  },
  {
    "year": 2023,
    "all": 121.05,
    "food": 125.76,
    "care": 126.31,
    "foodGap": 4.71,
    "careGap": 5.26,
    "months": 12
  },
  {
    "year": 2024,
    "all": 124.62,
    "food": 130.43,
    "care": 133.02,
    "foodGap": 5.81,
    "careGap": 8.4,
    "months": 12
  },
  {
    "year": 2025,
    "all": 127.9,
    "food": 135.75,
    "care": 138.84,
    "foodGap": 7.85,
    "careGap": 10.94,
    "months": 11
  },
  {
    "year": 2026,
    "all": 131.57,
    "food": 140.06,
    "care": 145.62,
    "foodGap": 8.49,
    "careGap": 14.05,
    "months": 7
  }
];

export type EpochRow = {
  id: string;
  label: string;
  start: string;
  end: string;
  all: number;
  food: number;
  care: number;
  foodGap: number;
  careGap: number;
  n: number;
};

export const EPOCHS: EpochRow[] = [
  {
    "id": "pre",
    "label": "2019–Feb 2020",
    "start": "2019-01",
    "end": "2020-02",
    "all": 101.72,
    "food": 101.88,
    "care": 102.38,
    "foodGap": 0.16,
    "careGap": 0.66,
    "n": 14
  },
  {
    "id": "pandemic",
    "label": "Mar 2020–Dec 2021",
    "start": "2020-03",
    "end": "2021-12",
    "all": 105.47,
    "food": 107.2,
    "care": 107.24,
    "foodGap": 1.72,
    "careGap": 1.76,
    "n": 22
  },
  {
    "id": "spike",
    "label": "2022–2023",
    "start": "2022-01",
    "end": "2023-12",
    "all": 118.66,
    "food": 122.15,
    "care": 122.65,
    "foodGap": 3.5,
    "careGap": 3.99,
    "n": 24
  },
  {
    "id": "post",
    "label": "2024–Jul 2026",
    "start": "2024-01",
    "end": "2026-07",
    "all": 127.45,
    "food": 134.62,
    "care": 138.09,
    "foodGap": 7.18,
    "careGap": 10.64,
    "n": 30
  }
];

export const ANALYTICS = {
  defaultPanel: "triple-track" as const,
  smokeMarker: "Pet-food and pet-care indexes vs all-items",
  question:
    "Did BLS pet-food and pet-care indexes rise faster than all-items CPI after 2019?",
  answer:
    "Yes — as of July 2026, pet food sits at 141.2 and pet care at 147.6 versus all-items at 132.7 (Jan 2019 = 100).",
};
