/**
 * Airline fares CPI vs U.S. Gulf Coast jet-fuel spot prices (2019–2026).
 *
 * Core question: How closely has BLS airline fares CPI followed EIA U.S.
 * Gulf Coast kerosene-type jet-fuel prices since 2019?
 *
 * Method: Rebase CUUR0000SETG01 (airline fares, NSA) and MJFUELUSGULF /
 * EER_EPJK_PF4_RGC_DPG (Gulf Coast jet fuel $/gal) to 2019 calendar-year
 * averages = 100. Gap = fare index − fuel index (pp). Pass-through ratio =
 * fare ÷ fuel × 100 (2019 = 100). Oct 2025 airfare CPI cell missing
 * (appropriations lapse). Confidence: disclosed BLS/EIA levels; indexes,
 * gaps, and Pearson correlations derived.
 */

export const SOURCE_NOTE =
  "BLS CPI-U airline fares (CUUR0000SETG01, NSA); EIA U.S. Gulf Coast kerosene-type jet fuel spot FOB (EER_EPJK_PF4_RGC_DPG / FRED MJFUELUSGULF). Rebased to 2019 averages = 100. Oct 2025 airfare CPI unpublished. Confidence: disclosed levels; derived indexes/gaps/correlations.";

export const SOURCES = [
  {
    label: "BLS — CPI-U airline fares (CUUR0000SETG01)",
    url: "https://data.bls.gov/timeseries/CUUR0000SETG01",
  },
  {
    label: "EIA — U.S. Gulf Coast jet fuel spot ($/gal)",
    url: "https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=EER_EPJK_PF4_RGC_DPG&f=M",
  },
  {
    label: "FRED — MJFUELUSGULF (EIA Gulf Coast jet fuel)",
    url: "https://fred.stlouisfed.org/series/MJFUELUSGULF",
  },
  {
    label: "BTS — Air Travel Consumer Report",
    url: "https://www.transportation.gov/individuals/aviation-consumer-protection/air-travel-consumer-reports",
  },
  {
    label: "BLS — Consumer Price Index overview",
    url: "https://www.bls.gov/cpi/",
  },
] as const;

export const HEADLINE = {
  "latestLabel": "2026-07",
  "fareIdx": 117.2,
  "fuelIdx": 181.2,
  "fuelUsd": 3.403,
  "gapPp": -64,
  "passThrough": 64.7,
  "corr": 0.724,
  "peakFuelIdx": 219.4,
  "peakFuelLabel": "2022-06",
  "peakFuelUsd": 4.12,
  "peakFareIdx": 129.9,
  "peakFareLabel": "2022-05",
  "maxGapPp": 44.3,
  "maxGapLabel": "2020-04",
  "minGapPp": -96.5,
  "minGapLabel": "2022-04",
  "troughFuelUsd": 0.606,
  "troughFuelLabel": "2020-04",
  "farePctSince2019": 17.2,
  "fuelPctSince2019": 81.2,
  "bases": {
    "fare2019": 265.401,
    "fuel2019": 1.878
  },
  "bestLag": {
    "lag": 1,
    "corr": 0.774,
    "n": 89
  }
} as const;

export type SeriesId = "fares" | "fuel";

export const SERIES_META: Record<
  SeriesId,
  { label: string; short: string; color: string; id: string }
> = {
  fares: {
    label: "Airline fares CPI",
    short: "Fares",
    color: "#38bdf8",
    id: "CUUR0000SETG01",
  },
  fuel: {
    label: "Gulf Coast jet fuel",
    short: "Jet fuel",
    color: "#f59e0b",
    id: "EER_EPJK_PF4_RGC_DPG",
  },
};

export type MonthRow = {
  label: string;
  year: number;
  month: number;
  fare: number;
  fuelUsd: number;
  fareIdx: number;
  fuelIdx: number;
  gap: number;
  passThrough: number;
};

export const MONTHLY: MonthRow[] = [
  {
    "label": "2019-01",
    "year": 2019,
    "month": 1,
    "fare": 248.433,
    "fuelUsd": 1.784,
    "fareIdx": 93.6,
    "fuelIdx": 95,
    "gap": -1.4,
    "passThrough": 98.5
  },
  {
    "label": "2019-02",
    "year": 2019,
    "month": 2,
    "fare": 259.049,
    "fuelUsd": 1.914,
    "fareIdx": 97.6,
    "fuelIdx": 101.9,
    "gap": -4.3,
    "passThrough": 95.7
  },
  {
    "label": "2019-03",
    "year": 2019,
    "month": 3,
    "fare": 259.698,
    "fuelUsd": 1.902,
    "fareIdx": 97.9,
    "fuelIdx": 101.3,
    "gap": -3.4,
    "passThrough": 96.6
  },
  {
    "label": "2019-04",
    "year": 2019,
    "month": 4,
    "fare": 268.767,
    "fuelUsd": 1.977,
    "fareIdx": 101.3,
    "fuelIdx": 105.3,
    "gap": -4,
    "passThrough": 96.2
  },
  {
    "label": "2019-05",
    "year": 2019,
    "month": 5,
    "fare": 283.275,
    "fuelUsd": 1.972,
    "fareIdx": 106.7,
    "fuelIdx": 105,
    "gap": 1.7,
    "passThrough": 101.6
  },
  {
    "label": "2019-06",
    "year": 2019,
    "month": 6,
    "fare": 283.001,
    "fuelUsd": 1.817,
    "fareIdx": 106.6,
    "fuelIdx": 96.8,
    "gap": 9.9,
    "passThrough": 110.2
  },
  {
    "label": "2019-07",
    "year": 2019,
    "month": 7,
    "fare": 268.314,
    "fuelUsd": 1.913,
    "fareIdx": 101.1,
    "fuelIdx": 101.9,
    "gap": -0.8,
    "passThrough": 99.2
  },
  {
    "label": "2019-08",
    "year": 2019,
    "month": 8,
    "fare": 259.849,
    "fuelUsd": 1.8,
    "fareIdx": 97.9,
    "fuelIdx": 95.9,
    "gap": 2,
    "passThrough": 102.1
  },
  {
    "label": "2019-09",
    "year": 2019,
    "month": 9,
    "fare": 263.149,
    "fuelUsd": 1.874,
    "fareIdx": 99.2,
    "fuelIdx": 99.8,
    "gap": -0.7,
    "passThrough": 99.3
  },
  {
    "label": "2019-10",
    "year": 2019,
    "month": 10,
    "fare": 269.871,
    "fuelUsd": 1.861,
    "fareIdx": 101.7,
    "fuelIdx": 99.1,
    "gap": 2.6,
    "passThrough": 102.6
  },
  {
    "label": "2019-11",
    "year": 2019,
    "month": 11,
    "fare": 268.994,
    "fuelUsd": 1.824,
    "fareIdx": 101.4,
    "fuelIdx": 97.1,
    "gap": 4.2,
    "passThrough": 104.3
  },
  {
    "label": "2019-12",
    "year": 2019,
    "month": 12,
    "fare": 252.411,
    "fuelUsd": 1.893,
    "fareIdx": 95.1,
    "fuelIdx": 100.8,
    "gap": -5.7,
    "passThrough": 94.3
  },
  {
    "label": "2020-01",
    "year": 2020,
    "month": 1,
    "fare": 255.2,
    "fuelUsd": 1.77,
    "fareIdx": 96.2,
    "fuelIdx": 94.3,
    "gap": 1.9,
    "passThrough": 102
  },
  {
    "label": "2020-02",
    "year": 2020,
    "month": 2,
    "fare": 265.142,
    "fuelUsd": 1.509,
    "fareIdx": 99.9,
    "fuelIdx": 80.4,
    "gap": 19.5,
    "passThrough": 124.3
  },
  {
    "label": "2020-03",
    "year": 2020,
    "month": 3,
    "fare": 232.113,
    "fuelUsd": 0.953,
    "fareIdx": 87.5,
    "fuelIdx": 50.8,
    "gap": 36.7,
    "passThrough": 172.3
  },
  {
    "label": "2020-04",
    "year": 2020,
    "month": 4,
    "fare": 203.342,
    "fuelUsd": 0.606,
    "fareIdx": 76.6,
    "fuelIdx": 32.3,
    "gap": 44.3,
    "passThrough": 237.4
  },
  {
    "label": "2020-05",
    "year": 2020,
    "month": 5,
    "fare": 201.649,
    "fuelUsd": 0.686,
    "fareIdx": 76,
    "fuelIdx": 36.5,
    "gap": 39.4,
    "passThrough": 208
  },
  {
    "label": "2020-06",
    "year": 2020,
    "month": 6,
    "fare": 206.066,
    "fuelUsd": 0.983,
    "fareIdx": 77.6,
    "fuelIdx": 52.4,
    "gap": 25.3,
    "passThrough": 148.3
  },
  {
    "label": "2020-07",
    "year": 2020,
    "month": 7,
    "fare": 204.785,
    "fuelUsd": 1.084,
    "fareIdx": 77.2,
    "fuelIdx": 57.7,
    "gap": 19.4,
    "passThrough": 133.6
  },
  {
    "label": "2020-08",
    "year": 2020,
    "month": 8,
    "fare": 199.496,
    "fuelUsd": 1.112,
    "fareIdx": 75.2,
    "fuelIdx": 59.2,
    "gap": 15.9,
    "passThrough": 126.9
  },
  {
    "label": "2020-09",
    "year": 2020,
    "month": 9,
    "fare": 197.424,
    "fuelUsd": 1.006,
    "fareIdx": 74.4,
    "fuelIdx": 53.6,
    "gap": 20.8,
    "passThrough": 138.8
  },
  {
    "label": "2020-10",
    "year": 2020,
    "month": 10,
    "fare": 215.993,
    "fuelUsd": 1.047,
    "fareIdx": 81.4,
    "fuelIdx": 55.8,
    "gap": 25.6,
    "passThrough": 145.9
  },
  {
    "label": "2020-11",
    "year": 2020,
    "month": 11,
    "fare": 223.36,
    "fuelUsd": 1.133,
    "fareIdx": 84.2,
    "fuelIdx": 60.3,
    "gap": 23.8,
    "passThrough": 139.5
  },
  {
    "label": "2020-12",
    "year": 2020,
    "month": 12,
    "fare": 205.983,
    "fuelUsd": 1.324,
    "fareIdx": 77.6,
    "fuelIdx": 70.5,
    "gap": 7.1,
    "passThrough": 110.1
  },
  {
    "label": "2021-01",
    "year": 2021,
    "month": 1,
    "fare": 200.825,
    "fuelUsd": 1.42,
    "fareIdx": 75.7,
    "fuelIdx": 75.6,
    "gap": 0,
    "passThrough": 100.1
  },
  {
    "label": "2021-02",
    "year": 2021,
    "month": 2,
    "fare": 197.204,
    "fuelUsd": 1.601,
    "fareIdx": 74.3,
    "fuelIdx": 85.3,
    "gap": -11,
    "passThrough": 87.1
  },
  {
    "label": "2021-03",
    "year": 2021,
    "month": 3,
    "fare": 197.134,
    "fuelUsd": 1.661,
    "fareIdx": 74.3,
    "fuelIdx": 88.5,
    "gap": -14.2,
    "passThrough": 84
  },
  {
    "label": "2021-04",
    "year": 2021,
    "month": 4,
    "fare": 222.953,
    "fuelUsd": 1.669,
    "fareIdx": 84,
    "fuelIdx": 88.9,
    "gap": -4.9,
    "passThrough": 94.5
  },
  {
    "label": "2021-05",
    "year": 2021,
    "month": 5,
    "fare": 250.209,
    "fuelUsd": 1.752,
    "fareIdx": 94.3,
    "fuelIdx": 93.3,
    "gap": 1,
    "passThrough": 101
  },
  {
    "label": "2021-06",
    "year": 2021,
    "month": 6,
    "fare": 256.684,
    "fuelUsd": 1.857,
    "fareIdx": 96.7,
    "fuelIdx": 98.9,
    "gap": -2.2,
    "passThrough": 97.8
  },
  {
    "label": "2021-07",
    "year": 2021,
    "month": 7,
    "fare": 243.613,
    "fuelUsd": 1.887,
    "fareIdx": 91.8,
    "fuelIdx": 100.5,
    "gap": -8.7,
    "passThrough": 91.3
  },
  {
    "label": "2021-08",
    "year": 2021,
    "month": 8,
    "fare": 212.882,
    "fuelUsd": 1.817,
    "fareIdx": 80.2,
    "fuelIdx": 96.8,
    "gap": -16.6,
    "passThrough": 82.9
  },
  {
    "label": "2021-09",
    "year": 2021,
    "month": 9,
    "fare": 198.975,
    "fuelUsd": 2.003,
    "fareIdx": 75,
    "fuelIdx": 106.7,
    "gap": -31.7,
    "passThrough": 70.3
  },
  {
    "label": "2021-10",
    "year": 2021,
    "month": 10,
    "fare": 205.994,
    "fuelUsd": 2.296,
    "fareIdx": 77.6,
    "fuelIdx": 122.3,
    "gap": -44.7,
    "passThrough": 63.5
  },
  {
    "label": "2021-11",
    "year": 2021,
    "month": 11,
    "fare": 215.159,
    "fuelUsd": 2.193,
    "fareIdx": 81.1,
    "fuelIdx": 116.8,
    "gap": -35.7,
    "passThrough": 69.4
  },
  {
    "label": "2021-12",
    "year": 2021,
    "month": 12,
    "fare": 208.954,
    "fuelUsd": 2.095,
    "fareIdx": 78.7,
    "fuelIdx": 111.6,
    "gap": -32.8,
    "passThrough": 70.6
  },
  {
    "label": "2022-01",
    "year": 2022,
    "month": 1,
    "fare": 210.762,
    "fuelUsd": 2.446,
    "fareIdx": 79.4,
    "fuelIdx": 130.3,
    "gap": -50.9,
    "passThrough": 61
  },
  {
    "label": "2022-02",
    "year": 2022,
    "month": 2,
    "fare": 222.227,
    "fuelUsd": 2.682,
    "fareIdx": 83.7,
    "fuelIdx": 142.8,
    "gap": -59.1,
    "passThrough": 58.6
  },
  {
    "label": "2022-03",
    "year": 2022,
    "month": 3,
    "fare": 243.689,
    "fuelUsd": 3.495,
    "fareIdx": 91.8,
    "fuelIdx": 186.1,
    "gap": -94.3,
    "passThrough": 49.3
  },
  {
    "label": "2022-04",
    "year": 2022,
    "month": 4,
    "fare": 297.143,
    "fuelUsd": 3.914,
    "fareIdx": 112,
    "fuelIdx": 208.5,
    "gap": -96.5,
    "passThrough": 53.7
  },
  {
    "label": "2022-05",
    "year": 2022,
    "month": 5,
    "fare": 344.853,
    "fuelUsd": 3.902,
    "fareIdx": 129.9,
    "fuelIdx": 207.8,
    "gap": -77.9,
    "passThrough": 62.5
  },
  {
    "label": "2022-06",
    "year": 2022,
    "month": 6,
    "fare": 344.101,
    "fuelUsd": 4.12,
    "fareIdx": 129.7,
    "fuelIdx": 219.4,
    "gap": -89.8,
    "passThrough": 59.1
  },
  {
    "label": "2022-07",
    "year": 2022,
    "month": 7,
    "fare": 311.205,
    "fuelUsd": 3.478,
    "fareIdx": 117.3,
    "fuelIdx": 185.2,
    "gap": -68,
    "passThrough": 63.3
  },
  {
    "label": "2022-08",
    "year": 2022,
    "month": 8,
    "fare": 283.911,
    "fuelUsd": 3.339,
    "fareIdx": 107,
    "fuelIdx": 177.8,
    "gap": -70.9,
    "passThrough": 60.2
  },
  {
    "label": "2022-09",
    "year": 2022,
    "month": 9,
    "fare": 284.313,
    "fuelUsd": 3.262,
    "fareIdx": 107.1,
    "fuelIdx": 173.7,
    "gap": -66.6,
    "passThrough": 61.7
  },
  {
    "label": "2022-10",
    "year": 2022,
    "month": 10,
    "fare": 294.34,
    "fuelUsd": 3.715,
    "fareIdx": 110.9,
    "fuelIdx": 197.9,
    "gap": -87,
    "passThrough": 56.1
  },
  {
    "label": "2022-11",
    "year": 2022,
    "month": 11,
    "fare": 292.656,
    "fuelUsd": 3.16,
    "fareIdx": 110.3,
    "fuelIdx": 168.3,
    "gap": -58,
    "passThrough": 65.5
  },
  {
    "label": "2022-12",
    "year": 2022,
    "month": 12,
    "fare": 268.519,
    "fuelUsd": 2.897,
    "fareIdx": 101.2,
    "fuelIdx": 154.3,
    "gap": -53.1,
    "passThrough": 65.6
  },
  {
    "label": "2023-01",
    "year": 2023,
    "month": 1,
    "fare": 264.629,
    "fuelUsd": 3.542,
    "fareIdx": 99.7,
    "fuelIdx": 188.6,
    "gap": -88.9,
    "passThrough": 52.9
  },
  {
    "label": "2023-02",
    "year": 2023,
    "month": 2,
    "fare": 281.216,
    "fuelUsd": 2.79,
    "fareIdx": 106,
    "fuelIdx": 148.6,
    "gap": -42.6,
    "passThrough": 71.3
  },
  {
    "label": "2023-03",
    "year": 2023,
    "month": 3,
    "fare": 286.814,
    "fuelUsd": 2.679,
    "fareIdx": 108.1,
    "fuelIdx": 142.7,
    "gap": -34.6,
    "passThrough": 75.7
  },
  {
    "label": "2023-04",
    "year": 2023,
    "month": 4,
    "fare": 294.55,
    "fuelUsd": 2.374,
    "fareIdx": 111,
    "fuelIdx": 126.4,
    "gap": -15.5,
    "passThrough": 87.8
  },
  {
    "label": "2023-05",
    "year": 2023,
    "month": 5,
    "fare": 298.489,
    "fuelUsd": 2.173,
    "fareIdx": 112.5,
    "fuelIdx": 115.7,
    "gap": -3.3,
    "passThrough": 97.2
  },
  {
    "label": "2023-06",
    "year": 2023,
    "month": 6,
    "fare": 279.224,
    "fuelUsd": 2.25,
    "fareIdx": 105.2,
    "fuelIdx": 119.8,
    "gap": -14.6,
    "passThrough": 87.8
  },
  {
    "label": "2023-07",
    "year": 2023,
    "month": 7,
    "fare": 253.345,
    "fuelUsd": 2.488,
    "fareIdx": 95.5,
    "fuelIdx": 132.5,
    "gap": -37.1,
    "passThrough": 72
  },
  {
    "label": "2023-08",
    "year": 2023,
    "month": 8,
    "fare": 246.185,
    "fuelUsd": 2.989,
    "fareIdx": 92.8,
    "fuelIdx": 159.2,
    "gap": -66.4,
    "passThrough": 58.3
  },
  {
    "label": "2023-09",
    "year": 2023,
    "month": 9,
    "fare": 246.151,
    "fuelUsd": 3.12,
    "fareIdx": 92.7,
    "fuelIdx": 166.2,
    "gap": -73.4,
    "passThrough": 55.8
  },
  {
    "label": "2023-10",
    "year": 2023,
    "month": 10,
    "fare": 255.48,
    "fuelUsd": 2.881,
    "fareIdx": 96.3,
    "fuelIdx": 153.4,
    "gap": -57.2,
    "passThrough": 62.7
  },
  {
    "label": "2023-11",
    "year": 2023,
    "month": 11,
    "fare": 257.222,
    "fuelUsd": 2.734,
    "fareIdx": 96.9,
    "fuelIdx": 145.6,
    "gap": -48.7,
    "passThrough": 66.6
  },
  {
    "label": "2023-12",
    "year": 2023,
    "month": 12,
    "fare": 243.348,
    "fuelUsd": 2.387,
    "fareIdx": 91.7,
    "fuelIdx": 127.1,
    "gap": -35.4,
    "passThrough": 72.1
  },
  {
    "label": "2024-01",
    "year": 2024,
    "month": 1,
    "fare": 247.606,
    "fuelUsd": 2.585,
    "fareIdx": 93.3,
    "fuelIdx": 137.7,
    "gap": -44.4,
    "passThrough": 67.8
  },
  {
    "label": "2024-02",
    "year": 2024,
    "month": 2,
    "fare": 263.952,
    "fuelUsd": 2.683,
    "fareIdx": 99.5,
    "fuelIdx": 142.9,
    "gap": -43.4,
    "passThrough": 69.6
  },
  {
    "label": "2024-03",
    "year": 2024,
    "month": 3,
    "fare": 266.481,
    "fuelUsd": 2.593,
    "fareIdx": 100.4,
    "fuelIdx": 138.1,
    "gap": -37.7,
    "passThrough": 72.7
  },
  {
    "label": "2024-04",
    "year": 2024,
    "month": 4,
    "fare": 277.45,
    "fuelUsd": 2.605,
    "fareIdx": 104.5,
    "fuelIdx": 138.7,
    "gap": -34.2,
    "passThrough": 75.3
  },
  {
    "label": "2024-05",
    "year": 2024,
    "month": 5,
    "fare": 280.958,
    "fuelUsd": 2.38,
    "fareIdx": 105.9,
    "fuelIdx": 126.8,
    "gap": -20.9,
    "passThrough": 83.5
  },
  {
    "label": "2024-06",
    "year": 2024,
    "month": 6,
    "fare": 265.061,
    "fuelUsd": 2.394,
    "fareIdx": 99.9,
    "fuelIdx": 127.5,
    "gap": -27.6,
    "passThrough": 78.3
  },
  {
    "label": "2024-07",
    "year": 2024,
    "month": 7,
    "fare": 246.222,
    "fuelUsd": 2.419,
    "fareIdx": 92.8,
    "fuelIdx": 128.8,
    "gap": -36.1,
    "passThrough": 72
  },
  {
    "label": "2024-08",
    "year": 2024,
    "month": 8,
    "fare": 243.011,
    "fuelUsd": 2.176,
    "fareIdx": 91.6,
    "fuelIdx": 115.9,
    "gap": -24.3,
    "passThrough": 79
  },
  {
    "label": "2024-09",
    "year": 2024,
    "month": 9,
    "fare": 250.03,
    "fuelUsd": 1.982,
    "fareIdx": 94.2,
    "fuelIdx": 105.6,
    "gap": -11.4,
    "passThrough": 89.2
  },
  {
    "label": "2024-10",
    "year": 2024,
    "month": 10,
    "fare": 265.939,
    "fuelUsd": 2.068,
    "fareIdx": 100.2,
    "fuelIdx": 110.1,
    "gap": -9.9,
    "passThrough": 91
  },
  {
    "label": "2024-11",
    "year": 2024,
    "month": 11,
    "fare": 269.336,
    "fuelUsd": 2.065,
    "fareIdx": 101.5,
    "fuelIdx": 110,
    "gap": -8.5,
    "passThrough": 92.3
  },
  {
    "label": "2024-12",
    "year": 2024,
    "month": 12,
    "fare": 262.556,
    "fuelUsd": 2.097,
    "fareIdx": 98.9,
    "fuelIdx": 111.7,
    "gap": -12.8,
    "passThrough": 88.6
  },
  {
    "label": "2025-01",
    "year": 2025,
    "month": 1,
    "fare": 265.273,
    "fuelUsd": 2.347,
    "fareIdx": 100,
    "fuelIdx": 125,
    "gap": -25,
    "passThrough": 80
  },
  {
    "label": "2025-02",
    "year": 2025,
    "month": 2,
    "fare": 262.136,
    "fuelUsd": 2.264,
    "fareIdx": 98.8,
    "fuelIdx": 120.6,
    "gap": -21.8,
    "passThrough": 81.9
  },
  {
    "label": "2025-03",
    "year": 2025,
    "month": 3,
    "fare": 252.62,
    "fuelUsd": 2.069,
    "fareIdx": 95.2,
    "fuelIdx": 110.2,
    "gap": -15,
    "passThrough": 86.4
  },
  {
    "label": "2025-04",
    "year": 2025,
    "month": 4,
    "fare": 255.592,
    "fuelUsd": 1.976,
    "fareIdx": 96.3,
    "fuelIdx": 105.2,
    "gap": -8.9,
    "passThrough": 91.5
  },
  {
    "label": "2025-05",
    "year": 2025,
    "month": 5,
    "fare": 260.319,
    "fuelUsd": 1.928,
    "fareIdx": 98.1,
    "fuelIdx": 102.7,
    "gap": -4.6,
    "passThrough": 95.5
  },
  {
    "label": "2025-06",
    "year": 2025,
    "month": 6,
    "fare": 255.852,
    "fuelUsd": 2.094,
    "fareIdx": 96.4,
    "fuelIdx": 111.5,
    "gap": -15.1,
    "passThrough": 86.4
  },
  {
    "label": "2025-07",
    "year": 2025,
    "month": 7,
    "fare": 247.859,
    "fuelUsd": 2.244,
    "fareIdx": 93.4,
    "fuelIdx": 119.5,
    "gap": -26.1,
    "passThrough": 78.1
  },
  {
    "label": "2025-08",
    "year": 2025,
    "month": 8,
    "fare": 250.982,
    "fuelUsd": 2.024,
    "fareIdx": 94.6,
    "fuelIdx": 107.8,
    "gap": -13.2,
    "passThrough": 87.7
  },
  {
    "label": "2025-09",
    "year": 2025,
    "month": 9,
    "fare": 258.027,
    "fuelUsd": 2.089,
    "fareIdx": 97.2,
    "fuelIdx": 111.3,
    "gap": -14,
    "passThrough": 87.4
  },
  {
    "label": "2025-11",
    "year": 2025,
    "month": 11,
    "fare": 254.924,
    "fuelUsd": 2.258,
    "fareIdx": 96.1,
    "fuelIdx": 120.3,
    "gap": -24.2,
    "passThrough": 79.9
  },
  {
    "label": "2025-12",
    "year": 2025,
    "month": 12,
    "fare": 253.714,
    "fuelUsd": 1.965,
    "fareIdx": 95.6,
    "fuelIdx": 104.7,
    "gap": -9.1,
    "passThrough": 91.3
  },
  {
    "label": "2026-01",
    "year": 2026,
    "month": 1,
    "fare": 271.19,
    "fuelUsd": 2.031,
    "fareIdx": 102.2,
    "fuelIdx": 108.2,
    "gap": -6,
    "passThrough": 94.5
  },
  {
    "label": "2026-02",
    "year": 2026,
    "month": 2,
    "fare": 280.621,
    "fuelUsd": 2.262,
    "fareIdx": 105.7,
    "fuelIdx": 120.5,
    "gap": -14.7,
    "passThrough": 87.8
  },
  {
    "label": "2026-03",
    "year": 2026,
    "month": 3,
    "fare": 290.226,
    "fuelUsd": 3.697,
    "fareIdx": 109.4,
    "fuelIdx": 196.9,
    "gap": -87.5,
    "passThrough": 55.5
  },
  {
    "label": "2026-04",
    "year": 2026,
    "month": 4,
    "fare": 308.527,
    "fuelUsd": 3.928,
    "fareIdx": 116.2,
    "fuelIdx": 209.2,
    "gap": -93,
    "passThrough": 55.6
  },
  {
    "label": "2026-05",
    "year": 2026,
    "month": 5,
    "fare": 329.824,
    "fuelUsd": 3.943,
    "fareIdx": 124.3,
    "fuelIdx": 210,
    "gap": -85.7,
    "passThrough": 59.2
  },
  {
    "label": "2026-06",
    "year": 2026,
    "month": 6,
    "fare": 323.758,
    "fuelUsd": 3.042,
    "fareIdx": 122,
    "fuelIdx": 162,
    "gap": -40,
    "passThrough": 75.3
  },
  {
    "label": "2026-07",
    "year": 2026,
    "month": 7,
    "fare": 311.176,
    "fuelUsd": 3.403,
    "fareIdx": 117.2,
    "fuelIdx": 181.2,
    "gap": -64,
    "passThrough": 64.7
  }
];

export type YoyRow = {
  label: string;
  year: number;
  month: number;
  fareYoy: number;
  fuelYoy: number;
};

export const MONTHLY_YOY: YoyRow[] = [
  {
    "label": "2020-01",
    "year": 2020,
    "month": 1,
    "fareYoy": 2.7,
    "fuelYoy": -0.8
  },
  {
    "label": "2020-02",
    "year": 2020,
    "month": 2,
    "fareYoy": 2.4,
    "fuelYoy": -21.2
  },
  {
    "label": "2020-03",
    "year": 2020,
    "month": 3,
    "fareYoy": -10.6,
    "fuelYoy": -49.9
  },
  {
    "label": "2020-04",
    "year": 2020,
    "month": 4,
    "fareYoy": -24.3,
    "fuelYoy": -69.3
  },
  {
    "label": "2020-05",
    "year": 2020,
    "month": 5,
    "fareYoy": -28.8,
    "fuelYoy": -65.2
  },
  {
    "label": "2020-06",
    "year": 2020,
    "month": 6,
    "fareYoy": -27.2,
    "fuelYoy": -45.9
  },
  {
    "label": "2020-07",
    "year": 2020,
    "month": 7,
    "fareYoy": -23.7,
    "fuelYoy": -43.3
  },
  {
    "label": "2020-08",
    "year": 2020,
    "month": 8,
    "fareYoy": -23.2,
    "fuelYoy": -38.2
  },
  {
    "label": "2020-09",
    "year": 2020,
    "month": 9,
    "fareYoy": -25,
    "fuelYoy": -46.3
  },
  {
    "label": "2020-10",
    "year": 2020,
    "month": 10,
    "fareYoy": -20,
    "fuelYoy": -43.7
  },
  {
    "label": "2020-11",
    "year": 2020,
    "month": 11,
    "fareYoy": -17,
    "fuelYoy": -37.9
  },
  {
    "label": "2020-12",
    "year": 2020,
    "month": 12,
    "fareYoy": -18.4,
    "fuelYoy": -30.1
  },
  {
    "label": "2021-01",
    "year": 2021,
    "month": 1,
    "fareYoy": -21.3,
    "fuelYoy": -19.8
  },
  {
    "label": "2021-02",
    "year": 2021,
    "month": 2,
    "fareYoy": -25.6,
    "fuelYoy": 6.1
  },
  {
    "label": "2021-03",
    "year": 2021,
    "month": 3,
    "fareYoy": -15.1,
    "fuelYoy": 74.3
  },
  {
    "label": "2021-04",
    "year": 2021,
    "month": 4,
    "fareYoy": 9.6,
    "fuelYoy": 175.4
  },
  {
    "label": "2021-05",
    "year": 2021,
    "month": 5,
    "fareYoy": 24.1,
    "fuelYoy": 155.4
  },
  {
    "label": "2021-06",
    "year": 2021,
    "month": 6,
    "fareYoy": 24.6,
    "fuelYoy": 88.9
  },
  {
    "label": "2021-07",
    "year": 2021,
    "month": 7,
    "fareYoy": 19,
    "fuelYoy": 74.1
  },
  {
    "label": "2021-08",
    "year": 2021,
    "month": 8,
    "fareYoy": 6.7,
    "fuelYoy": 63.4
  },
  {
    "label": "2021-09",
    "year": 2021,
    "month": 9,
    "fareYoy": 0.8,
    "fuelYoy": 99.1
  },
  {
    "label": "2021-10",
    "year": 2021,
    "month": 10,
    "fareYoy": -4.6,
    "fuelYoy": 119.3
  },
  {
    "label": "2021-11",
    "year": 2021,
    "month": 11,
    "fareYoy": -3.7,
    "fuelYoy": 93.6
  },
  {
    "label": "2021-12",
    "year": 2021,
    "month": 12,
    "fareYoy": 1.4,
    "fuelYoy": 58.2
  },
  {
    "label": "2022-01",
    "year": 2022,
    "month": 1,
    "fareYoy": 4.9,
    "fuelYoy": 72.3
  },
  {
    "label": "2022-02",
    "year": 2022,
    "month": 2,
    "fareYoy": 12.7,
    "fuelYoy": 67.5
  },
  {
    "label": "2022-03",
    "year": 2022,
    "month": 3,
    "fareYoy": 23.6,
    "fuelYoy": 110.4
  },
  {
    "label": "2022-04",
    "year": 2022,
    "month": 4,
    "fareYoy": 33.3,
    "fuelYoy": 134.5
  },
  {
    "label": "2022-05",
    "year": 2022,
    "month": 5,
    "fareYoy": 37.8,
    "fuelYoy": 122.7
  },
  {
    "label": "2022-06",
    "year": 2022,
    "month": 6,
    "fareYoy": 34.1,
    "fuelYoy": 121.9
  },
  {
    "label": "2022-07",
    "year": 2022,
    "month": 7,
    "fareYoy": 27.7,
    "fuelYoy": 84.3
  },
  {
    "label": "2022-08",
    "year": 2022,
    "month": 8,
    "fareYoy": 33.4,
    "fuelYoy": 83.8
  },
  {
    "label": "2022-09",
    "year": 2022,
    "month": 9,
    "fareYoy": 42.9,
    "fuelYoy": 62.9
  },
  {
    "label": "2022-10",
    "year": 2022,
    "month": 10,
    "fareYoy": 42.9,
    "fuelYoy": 61.8
  },
  {
    "label": "2022-11",
    "year": 2022,
    "month": 11,
    "fareYoy": 36,
    "fuelYoy": 44.1
  },
  {
    "label": "2022-12",
    "year": 2022,
    "month": 12,
    "fareYoy": 28.5,
    "fuelYoy": 38.3
  },
  {
    "label": "2023-01",
    "year": 2023,
    "month": 1,
    "fareYoy": 25.6,
    "fuelYoy": 44.8
  },
  {
    "label": "2023-02",
    "year": 2023,
    "month": 2,
    "fareYoy": 26.5,
    "fuelYoy": 4
  },
  {
    "label": "2023-03",
    "year": 2023,
    "month": 3,
    "fareYoy": 17.7,
    "fuelYoy": -23.3
  },
  {
    "label": "2023-04",
    "year": 2023,
    "month": 4,
    "fareYoy": -0.9,
    "fuelYoy": -39.3
  },
  {
    "label": "2023-05",
    "year": 2023,
    "month": 5,
    "fareYoy": -13.4,
    "fuelYoy": -44.3
  },
  {
    "label": "2023-06",
    "year": 2023,
    "month": 6,
    "fareYoy": -18.9,
    "fuelYoy": -45.4
  },
  {
    "label": "2023-07",
    "year": 2023,
    "month": 7,
    "fareYoy": -18.6,
    "fuelYoy": -28.5
  },
  {
    "label": "2023-08",
    "year": 2023,
    "month": 8,
    "fareYoy": -13.3,
    "fuelYoy": -10.5
  },
  {
    "label": "2023-09",
    "year": 2023,
    "month": 9,
    "fareYoy": -13.4,
    "fuelYoy": -4.4
  },
  {
    "label": "2023-10",
    "year": 2023,
    "month": 10,
    "fareYoy": -13.2,
    "fuelYoy": -22.4
  },
  {
    "label": "2023-11",
    "year": 2023,
    "month": 11,
    "fareYoy": -12.1,
    "fuelYoy": -13.5
  },
  {
    "label": "2023-12",
    "year": 2023,
    "month": 12,
    "fareYoy": -9.4,
    "fuelYoy": -17.6
  },
  {
    "label": "2024-01",
    "year": 2024,
    "month": 1,
    "fareYoy": -6.4,
    "fuelYoy": -27
  },
  {
    "label": "2024-02",
    "year": 2024,
    "month": 2,
    "fareYoy": -6.1,
    "fuelYoy": -3.8
  },
  {
    "label": "2024-03",
    "year": 2024,
    "month": 3,
    "fareYoy": -7.1,
    "fuelYoy": -3.2
  },
  {
    "label": "2024-04",
    "year": 2024,
    "month": 4,
    "fareYoy": -5.8,
    "fuelYoy": 9.7
  },
  {
    "label": "2024-05",
    "year": 2024,
    "month": 5,
    "fareYoy": -5.9,
    "fuelYoy": 9.5
  },
  {
    "label": "2024-06",
    "year": 2024,
    "month": 6,
    "fareYoy": -5.1,
    "fuelYoy": 6.4
  },
  {
    "label": "2024-07",
    "year": 2024,
    "month": 7,
    "fareYoy": -2.8,
    "fuelYoy": -2.8
  },
  {
    "label": "2024-08",
    "year": 2024,
    "month": 8,
    "fareYoy": -1.3,
    "fuelYoy": -27.2
  },
  {
    "label": "2024-09",
    "year": 2024,
    "month": 9,
    "fareYoy": 1.6,
    "fuelYoy": -36.5
  },
  {
    "label": "2024-10",
    "year": 2024,
    "month": 10,
    "fareYoy": 4.1,
    "fuelYoy": -28.2
  },
  {
    "label": "2024-11",
    "year": 2024,
    "month": 11,
    "fareYoy": 4.7,
    "fuelYoy": -24.5
  },
  {
    "label": "2024-12",
    "year": 2024,
    "month": 12,
    "fareYoy": 7.9,
    "fuelYoy": -12.1
  },
  {
    "label": "2025-01",
    "year": 2025,
    "month": 1,
    "fareYoy": 7.1,
    "fuelYoy": -9.2
  },
  {
    "label": "2025-02",
    "year": 2025,
    "month": 2,
    "fareYoy": -0.7,
    "fuelYoy": -15.6
  },
  {
    "label": "2025-03",
    "year": 2025,
    "month": 3,
    "fareYoy": -5.2,
    "fuelYoy": -20.2
  },
  {
    "label": "2025-04",
    "year": 2025,
    "month": 4,
    "fareYoy": -7.9,
    "fuelYoy": -24.1
  },
  {
    "label": "2025-05",
    "year": 2025,
    "month": 5,
    "fareYoy": -7.3,
    "fuelYoy": -19
  },
  {
    "label": "2025-06",
    "year": 2025,
    "month": 6,
    "fareYoy": -3.5,
    "fuelYoy": -12.5
  },
  {
    "label": "2025-07",
    "year": 2025,
    "month": 7,
    "fareYoy": 0.7,
    "fuelYoy": -7.2
  },
  {
    "label": "2025-08",
    "year": 2025,
    "month": 8,
    "fareYoy": 3.3,
    "fuelYoy": -7
  },
  {
    "label": "2025-09",
    "year": 2025,
    "month": 9,
    "fareYoy": 3.2,
    "fuelYoy": 5.4
  },
  {
    "label": "2025-11",
    "year": 2025,
    "month": 11,
    "fareYoy": -5.4,
    "fuelYoy": 9.3
  },
  {
    "label": "2025-12",
    "year": 2025,
    "month": 12,
    "fareYoy": -3.4,
    "fuelYoy": -6.3
  },
  {
    "label": "2026-01",
    "year": 2026,
    "month": 1,
    "fareYoy": 2.2,
    "fuelYoy": -13.5
  },
  {
    "label": "2026-02",
    "year": 2026,
    "month": 2,
    "fareYoy": 7.1,
    "fuelYoy": -0.1
  },
  {
    "label": "2026-03",
    "year": 2026,
    "month": 3,
    "fareYoy": 14.9,
    "fuelYoy": 78.7
  },
  {
    "label": "2026-04",
    "year": 2026,
    "month": 4,
    "fareYoy": 20.7,
    "fuelYoy": 98.8
  },
  {
    "label": "2026-05",
    "year": 2026,
    "month": 5,
    "fareYoy": 26.7,
    "fuelYoy": 104.5
  },
  {
    "label": "2026-06",
    "year": 2026,
    "month": 6,
    "fareYoy": 26.5,
    "fuelYoy": 45.3
  },
  {
    "label": "2026-07",
    "year": 2026,
    "month": 7,
    "fareYoy": 25.5,
    "fuelYoy": 51.6
  }
];

export type QuarterRow = {
  label: string;
  year: number;
  fareIdx: number;
  fuelIdx: number;
  fuelUsd: number;
  gap: number;
  passThrough: number;
};

export const QUARTERLY: QuarterRow[] = [
  {
    "label": "2019Q1",
    "year": 2019,
    "fareIdx": 96.4,
    "fuelIdx": 99.4,
    "fuelUsd": 1.867,
    "gap": -3,
    "passThrough": 97
  },
  {
    "label": "2019Q2",
    "year": 2019,
    "fareIdx": 104.9,
    "fuelIdx": 102.4,
    "fuelUsd": 1.922,
    "gap": 2.5,
    "passThrough": 102.4
  },
  {
    "label": "2019Q3",
    "year": 2019,
    "fareIdx": 99.4,
    "fuelIdx": 99.2,
    "fuelUsd": 1.862,
    "gap": 0.2,
    "passThrough": 100.2
  },
  {
    "label": "2019Q4",
    "year": 2019,
    "fareIdx": 99.4,
    "fuelIdx": 99,
    "fuelUsd": 1.859,
    "gap": 0.4,
    "passThrough": 100.4
  },
  {
    "label": "2020Q1",
    "year": 2020,
    "fareIdx": 94.5,
    "fuelIdx": 75.2,
    "fuelUsd": 1.411,
    "gap": 19.3,
    "passThrough": 125.7
  },
  {
    "label": "2020Q2",
    "year": 2020,
    "fareIdx": 76.7,
    "fuelIdx": 40.4,
    "fuelUsd": 0.758,
    "gap": 36.3,
    "passThrough": 189.9
  },
  {
    "label": "2020Q3",
    "year": 2020,
    "fareIdx": 75.6,
    "fuelIdx": 56.8,
    "fuelUsd": 1.067,
    "gap": 18.8,
    "passThrough": 133.1
  },
  {
    "label": "2020Q4",
    "year": 2020,
    "fareIdx": 81.1,
    "fuelIdx": 62.2,
    "fuelUsd": 1.168,
    "gap": 18.9,
    "passThrough": 130.4
  },
  {
    "label": "2021Q1",
    "year": 2021,
    "fareIdx": 74.8,
    "fuelIdx": 83.1,
    "fuelUsd": 1.561,
    "gap": -8.3,
    "passThrough": 90
  },
  {
    "label": "2021Q2",
    "year": 2021,
    "fareIdx": 91.7,
    "fuelIdx": 93.7,
    "fuelUsd": 1.759,
    "gap": -2,
    "passThrough": 97.9
  },
  {
    "label": "2021Q3",
    "year": 2021,
    "fareIdx": 82.3,
    "fuelIdx": 101.3,
    "fuelUsd": 1.902,
    "gap": -19,
    "passThrough": 81.2
  },
  {
    "label": "2021Q4",
    "year": 2021,
    "fareIdx": 79.1,
    "fuelIdx": 116.9,
    "fuelUsd": 2.195,
    "gap": -37.8,
    "passThrough": 67.7
  },
  {
    "label": "2022Q1",
    "year": 2022,
    "fareIdx": 85,
    "fuelIdx": 153.1,
    "fuelUsd": 2.874,
    "gap": -68.1,
    "passThrough": 55.5
  },
  {
    "label": "2022Q2",
    "year": 2022,
    "fareIdx": 123.9,
    "fuelIdx": 211.9,
    "fuelUsd": 3.979,
    "gap": -88,
    "passThrough": 58.5
  },
  {
    "label": "2022Q3",
    "year": 2022,
    "fareIdx": 110.5,
    "fuelIdx": 178.9,
    "fuelUsd": 3.36,
    "gap": -68.4,
    "passThrough": 61.8
  },
  {
    "label": "2022Q4",
    "year": 2022,
    "fareIdx": 107.5,
    "fuelIdx": 173.5,
    "fuelUsd": 3.257,
    "gap": -66,
    "passThrough": 62
  },
  {
    "label": "2023Q1",
    "year": 2023,
    "fareIdx": 104.6,
    "fuelIdx": 160,
    "fuelUsd": 3.004,
    "gap": -55.4,
    "passThrough": 65.4
  },
  {
    "label": "2023Q2",
    "year": 2023,
    "fareIdx": 109.6,
    "fuelIdx": 120.6,
    "fuelUsd": 2.266,
    "gap": -11,
    "passThrough": 90.9
  },
  {
    "label": "2023Q3",
    "year": 2023,
    "fareIdx": 93.7,
    "fuelIdx": 152.6,
    "fuelUsd": 2.866,
    "gap": -58.9,
    "passThrough": 61.4
  },
  {
    "label": "2023Q4",
    "year": 2023,
    "fareIdx": 95,
    "fuelIdx": 142,
    "fuelUsd": 2.667,
    "gap": -47,
    "passThrough": 66.9
  },
  {
    "label": "2024Q1",
    "year": 2024,
    "fareIdx": 97.7,
    "fuelIdx": 139.6,
    "fuelUsd": 2.62,
    "gap": -41.9,
    "passThrough": 70
  },
  {
    "label": "2024Q2",
    "year": 2024,
    "fareIdx": 103.4,
    "fuelIdx": 131,
    "fuelUsd": 2.46,
    "gap": -27.6,
    "passThrough": 78.9
  },
  {
    "label": "2024Q3",
    "year": 2024,
    "fareIdx": 92.9,
    "fuelIdx": 116.8,
    "fuelUsd": 2.192,
    "gap": -23.9,
    "passThrough": 79.5
  },
  {
    "label": "2024Q4",
    "year": 2024,
    "fareIdx": 100.2,
    "fuelIdx": 110.6,
    "fuelUsd": 2.077,
    "gap": -10.4,
    "passThrough": 90.6
  },
  {
    "label": "2025Q1",
    "year": 2025,
    "fareIdx": 98,
    "fuelIdx": 118.6,
    "fuelUsd": 2.227,
    "gap": -20.6,
    "passThrough": 82.6
  },
  {
    "label": "2025Q2",
    "year": 2025,
    "fareIdx": 96.9,
    "fuelIdx": 106.5,
    "fuelUsd": 1.999,
    "gap": -9.6,
    "passThrough": 91
  },
  {
    "label": "2025Q3",
    "year": 2025,
    "fareIdx": 95.1,
    "fuelIdx": 112.9,
    "fuelUsd": 2.119,
    "gap": -17.8,
    "passThrough": 84.2
  },
  {
    "label": "2025Q4",
    "year": 2025,
    "fareIdx": 95.9,
    "fuelIdx": 112.5,
    "fuelUsd": 2.112,
    "gap": -16.6,
    "passThrough": 85.2
  },
  {
    "label": "2026Q1",
    "year": 2026,
    "fareIdx": 105.8,
    "fuelIdx": 141.9,
    "fuelUsd": 2.663,
    "gap": -36.1,
    "passThrough": 74.6
  },
  {
    "label": "2026Q2",
    "year": 2026,
    "fareIdx": 120.8,
    "fuelIdx": 193.7,
    "fuelUsd": 3.638,
    "gap": -72.9,
    "passThrough": 62.4
  },
  {
    "label": "2026Q3",
    "year": 2026,
    "fareIdx": 117.2,
    "fuelIdx": 181.2,
    "fuelUsd": 3.403,
    "gap": -64,
    "passThrough": 64.7
  }
];

export type AnnualRow = {
  year: number;
  fareIdx: number;
  fuelIdx: number;
  fuelUsd: number;
  gap: number;
  passThrough: number;
  months: number;
  partial?: boolean;
};

export const ANNUAL: AnnualRow[] = [
  {
    "year": 2019,
    "fareIdx": 100,
    "fuelIdx": 100,
    "fuelUsd": 1.878,
    "gap": 0,
    "passThrough": 100,
    "months": 12
  },
  {
    "year": 2020,
    "fareIdx": 82,
    "fuelIdx": 58.6,
    "fuelUsd": 1.101,
    "gap": 23.4,
    "passThrough": 139.9,
    "months": 12
  },
  {
    "year": 2021,
    "fareIdx": 82,
    "fuelIdx": 98.8,
    "fuelUsd": 1.854,
    "gap": -16.8,
    "passThrough": 83,
    "months": 12
  },
  {
    "year": 2022,
    "fareIdx": 106.7,
    "fuelIdx": 179.3,
    "fuelUsd": 3.368,
    "gap": -72.6,
    "passThrough": 59.5,
    "months": 12
  },
  {
    "year": 2023,
    "fareIdx": 100.7,
    "fuelIdx": 143.8,
    "fuelUsd": 2.701,
    "gap": -43.1,
    "passThrough": 70,
    "months": 12
  },
  {
    "year": 2024,
    "fareIdx": 98.6,
    "fuelIdx": 124.5,
    "fuelUsd": 2.337,
    "gap": -25.9,
    "passThrough": 79.2,
    "months": 12
  },
  {
    "year": 2025,
    "fareIdx": 96.5,
    "fuelIdx": 112.6,
    "fuelUsd": 2.114,
    "gap": -16.1,
    "passThrough": 85.7,
    "months": 11
  },
  {
    "year": 2026,
    "fareIdx": 113.9,
    "fuelIdx": 169.7,
    "fuelUsd": 3.187,
    "gap": -55.8,
    "passThrough": 67.1,
    "months": 7,
    "partial": true
  }
];

export const SUMMARY_TABLE = [
  {
    "year": "2019",
    "fareIdx": 100,
    "fuelIdx": 100,
    "fuelUsd": 1.878,
    "gapPp": 0,
    "passThrough": 100
  },
  {
    "year": "2020",
    "fareIdx": 82,
    "fuelIdx": 58.6,
    "fuelUsd": 1.101,
    "gapPp": 23.4,
    "passThrough": 139.9
  },
  {
    "year": "2021",
    "fareIdx": 82,
    "fuelIdx": 98.8,
    "fuelUsd": 1.854,
    "gapPp": -16.8,
    "passThrough": 83
  },
  {
    "year": "2022",
    "fareIdx": 106.7,
    "fuelIdx": 179.3,
    "fuelUsd": 3.368,
    "gapPp": -72.6,
    "passThrough": 59.5
  },
  {
    "year": "2023",
    "fareIdx": 100.7,
    "fuelIdx": 143.8,
    "fuelUsd": 2.701,
    "gapPp": -43.1,
    "passThrough": 70
  },
  {
    "year": "2024",
    "fareIdx": 98.6,
    "fuelIdx": 124.5,
    "fuelUsd": 2.337,
    "gapPp": -25.9,
    "passThrough": 79.2
  },
  {
    "year": "2025",
    "fareIdx": 96.5,
    "fuelIdx": 112.6,
    "fuelUsd": 2.114,
    "gapPp": -16.1,
    "passThrough": 85.7
  },
  {
    "year": "2026 YTD",
    "fareIdx": 113.9,
    "fuelIdx": 169.7,
    "fuelUsd": 3.187,
    "gapPp": -55.8,
    "passThrough": 67.1
  }
] as const;

export const LAG_CORR = [
  {
    "lag": 0,
    "corr": 0.724,
    "n": 90
  },
  {
    "lag": 1,
    "corr": 0.774,
    "n": 89
  },
  {
    "lag": 2,
    "corr": 0.757,
    "n": 88
  },
  {
    "lag": 3,
    "corr": 0.695,
    "n": 87
  },
  {
    "lag": 4,
    "corr": 0.626,
    "n": 86
  },
  {
    "lag": 5,
    "corr": 0.566,
    "n": 85
  },
  {
    "lag": 6,
    "corr": 0.539,
    "n": 84
  }
] as const;

export const EPOCH_BARS = [
  {
    "epoch": "Pre-COVID\n2019",
    "fareIdx": 100,
    "fuelIdx": 100
  },
  {
    "epoch": "Collapse\n2020",
    "fareIdx": 82,
    "fuelIdx": 58.6
  },
  {
    "epoch": "Reopen\n2021",
    "fareIdx": 82,
    "fuelIdx": 98.8
  },
  {
    "epoch": "Fuel spike\n2022",
    "fareIdx": 106.7,
    "fuelIdx": 179.3
  },
  {
    "epoch": "Normalize\n2023–24",
    "fareIdx": 99.7,
    "fuelIdx": 134.2
  },
  {
    "epoch": "2026 YTD",
    "fareIdx": 113.9,
    "fuelIdx": 169.7
  }
] as const;

export const ANALYTICS = {
  smokeMarker: "Airfare index vs jet fuel",
  defaultPanel: "dual-track" as const,
  latestLabel: HEADLINE.latestLabel,
  corr: HEADLINE.corr,
};
