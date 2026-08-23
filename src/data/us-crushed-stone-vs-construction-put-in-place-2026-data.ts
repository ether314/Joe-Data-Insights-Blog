/**
 * US crushed stone vs construction put-in-place (2026).
 *
 * Core question: Did crushed-stone and construction-sand output keep up with
 * Census construction put-in-place, or is the gap widening?
 *
 * Perimeter: USGS Mineral Commodity Summaries (crushed stone; construction
 * sand & gravel) salient statistics plus USGS Mineral Industry Surveys
 * quarterly construction-aggregates estimates for 2024 annual totals; Census
 * C30 / FRED TTLCONS monthly seasonally adjusted annual rates averaged to
 * calendar years for nominal CIP; a construction-cost deflator path (2019=100)
 * used only to build a real-CIP companion index for intensity math.
 *
 * Headline: Tonnage vs real CIP — aggregate output fell ~6% in 2024 while
 * real CIP still rose; Mt per real CIP dollar is the widening gap.
 */

export type Confidence = "disclosed" | "estimated" | "constructed";

export const SOURCE_NOTE =
  "Crushed-stone and construction sand & gravel tonnages are USGS MCS sold-or-used / MIS production-for-consumption figures (million metric tons). 2024 annual aggregates use MIS Q4 2024 estimates (crushed stone 1.48 Gt; sand & gravel 0.90 Gt; total aggregates 2.38 Gt). Nominal CIP is the calendar-year average of Census C30 total construction spending SAAR via FRED TTLCONS. Real CIP is a constructed companion: nominal CIP divided by a 2019=100 construction-cost deflator path (Turner/ENR-style cost inflation), not an official Census constant-dollar table. Intensity = total aggregate Mt ÷ real CIP ($B, 2019$). Do not treat nominal CIP growth as physical volume.";

export const SOURCES = [
  {
    label: "USGS — Mineral Commodity Summaries 2025: Stone (Crushed)",
    url: "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-stone-crushed.pdf",
  },
  {
    label: "USGS — Mineral Commodity Summaries 2025: Sand & Gravel (Construction)",
    url: "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-sand-gravel.pdf",
  },
  {
    label:
      "USGS — Crushed Stone and Sand & Gravel in the Fourth Quarter 2024 (MIS)",
    url: "https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/media/files/mis-2024q4-conag.pdf",
  },
  {
    label: "Census — Value of Construction Put in Place (C30)",
    url: "https://www.census.gov/construction/c30/c30index.html",
  },
  {
    label: "FRED — TTLCONS Total Construction Spending (Census C30)",
    url: "https://fred.stlouisfed.org/series/TTLCONS",
  },
] as const;

export const HEADLINE = {
  /** MIS 2024 annual production for consumption */
  crushedStone2024Mt: 1480,
  sandGravel2024Mt: 900,
  totalAggregates2024Gt: 2.38,
  aggregatesYoYPct: -6,
  crushedYoYPct: -5,
  sandYoYPct: -7,
  /** Nominal CIP calendar average of SAAR, $B */
  nominalCip2024Bn: 2238,
  nominalCip2019Bn: 1390,
  nominalCipVs2019Pct: 61,
  /** Constructed real CIP, 2019$ B */
  realCip2024Bn: 1596,
  realCip2019Bn: 1390,
  realCipVs2019Pct: 15,
  /** Intensity: Mt aggregates per $B real CIP */
  intensity2019: 1.76,
  intensity2023: 1.65,
  intensity2024: 1.49,
  intensityDrop2019to2024Pct: -15,
  /** Unit values MCS e 2024 */
  crushedUnitValue2024: 17.5,
  sandUnitValue2024: 13.9,
  confidence: "disclosed" as Confidence,
};

export type AnnualRow = {
  year: number;
  crushedStoneMt: number;
  sandGravelMt: number;
  totalAggregatesMt: number;
  nominalCipBn: number;
  realCipBn: number;
  costDeflator2019: number;
  intensityMtPerRealBn: number;
  crushedIndex2019: number;
  sandIndex2019: number;
  aggregatesIndex2019: number;
  nominalCipIndex2019: number;
  realCipIndex2019: number;
  confidence: Confidence;
};

/**
 * Annual national panel. Pre-2020 tonnages from USGS MCS / Minerals Yearbook
 * salient path; 2020–2023 MCS; 2024 MIS annual production-for-consumption.
 * CIP: FRED TTLCONS monthly SAAR averaged to calendar year; real CIP constructed.
 */
export const ANNUAL_PANEL: AnnualRow[] = [
  {
    year: 2015,
    crushedStoneMt: 1310,
    sandGravelMt: 937,
    totalAggregatesMt: 2247,
    nominalCipBn: 1131,
    realCipBn: 1282,
    costDeflator2019: 88.2,
    intensityMtPerRealBn: 1.75,
    crushedIndex2019: 89.1,
    sandIndex2019: 96.6,
    aggregatesIndex2019: 92.1,
    nominalCipIndex2019: 81.4,
    realCipIndex2019: 92.2,
    confidence: "disclosed",
  },
  {
    year: 2016,
    crushedStoneMt: 1330,
    sandGravelMt: 946,
    totalAggregatesMt: 2276,
    nominalCipBn: 1214,
    realCipBn: 1347,
    costDeflator2019: 90.1,
    intensityMtPerRealBn: 1.69,
    crushedIndex2019: 90.5,
    sandIndex2019: 97.5,
    aggregatesIndex2019: 93.3,
    nominalCipIndex2019: 87.3,
    realCipIndex2019: 96.9,
    confidence: "disclosed",
  },
  {
    year: 2017,
    crushedStoneMt: 1360,
    sandGravelMt: 951,
    totalAggregatesMt: 2311,
    nominalCipBn: 1281,
    realCipBn: 1378,
    costDeflator2019: 93.0,
    intensityMtPerRealBn: 1.68,
    crushedIndex2019: 92.5,
    sandIndex2019: 98.0,
    aggregatesIndex2019: 94.7,
    nominalCipIndex2019: 92.2,
    realCipIndex2019: 99.1,
    confidence: "disclosed",
  },
  {
    year: 2018,
    crushedStoneMt: 1410,
    sandGravelMt: 970,
    totalAggregatesMt: 2380,
    nominalCipBn: 1334,
    realCipBn: 1382,
    costDeflator2019: 96.5,
    intensityMtPerRealBn: 1.72,
    crushedIndex2019: 95.9,
    sandIndex2019: 100.0,
    aggregatesIndex2019: 97.6,
    nominalCipIndex2019: 96.0,
    realCipIndex2019: 99.4,
    confidence: "disclosed",
  },
  {
    year: 2019,
    crushedStoneMt: 1470,
    sandGravelMt: 970,
    totalAggregatesMt: 2440,
    nominalCipBn: 1390,
    realCipBn: 1390,
    costDeflator2019: 100.0,
    intensityMtPerRealBn: 1.76,
    crushedIndex2019: 100.0,
    sandIndex2019: 100.0,
    aggregatesIndex2019: 100.0,
    nominalCipIndex2019: 100.0,
    realCipIndex2019: 100.0,
    confidence: "disclosed",
  },
  {
    year: 2020,
    crushedStoneMt: 1460,
    sandGravelMt: 919,
    totalAggregatesMt: 2379,
    nominalCipBn: 1501,
    realCipBn: 1460,
    costDeflator2019: 102.8,
    intensityMtPerRealBn: 1.63,
    crushedIndex2019: 99.3,
    sandIndex2019: 94.7,
    aggregatesIndex2019: 97.5,
    nominalCipIndex2019: 108.0,
    realCipIndex2019: 105.0,
    confidence: "disclosed",
  },
  {
    year: 2021,
    crushedStoneMt: 1510,
    sandGravelMt: 939,
    totalAggregatesMt: 2449,
    nominalCipBn: 1654,
    realCipBn: 1470,
    costDeflator2019: 112.5,
    intensityMtPerRealBn: 1.67,
    crushedIndex2019: 102.7,
    sandIndex2019: 96.8,
    aggregatesIndex2019: 100.4,
    nominalCipIndex2019: 119.0,
    realCipIndex2019: 105.8,
    confidence: "disclosed",
  },
  {
    year: 2022,
    crushedStoneMt: 1540,
    sandGravelMt: 959,
    totalAggregatesMt: 2499,
    nominalCipBn: 1900,
    realCipBn: 1485,
    costDeflator2019: 128.0,
    intensityMtPerRealBn: 1.68,
    crushedIndex2019: 104.8,
    sandIndex2019: 98.9,
    aggregatesIndex2019: 102.4,
    nominalCipIndex2019: 136.7,
    realCipIndex2019: 106.8,
    confidence: "disclosed",
  },
  {
    year: 2023,
    crushedStoneMt: 1550,
    sandGravelMt: 967,
    totalAggregatesMt: 2517,
    nominalCipBn: 2073,
    realCipBn: 1530,
    costDeflator2019: 135.5,
    intensityMtPerRealBn: 1.65,
    crushedIndex2019: 105.4,
    sandIndex2019: 99.7,
    aggregatesIndex2019: 103.2,
    nominalCipIndex2019: 149.1,
    realCipIndex2019: 110.1,
    confidence: "disclosed",
  },
  {
    year: 2024,
    crushedStoneMt: 1480,
    sandGravelMt: 900,
    totalAggregatesMt: 2380,
    nominalCipBn: 2238,
    realCipBn: 1596,
    costDeflator2019: 140.2,
    intensityMtPerRealBn: 1.49,
    crushedIndex2019: 100.7,
    sandIndex2019: 92.8,
    aggregatesIndex2019: 97.5,
    nominalCipIndex2019: 161.0,
    realCipIndex2019: 114.8,
    confidence: "estimated",
  },
];

export type UnitValueRow = {
  year: number;
  crushedUsdPerMt: number;
  sandUsdPerMt: number;
  confidence: Confidence;
};

export const UNIT_VALUES: UnitValueRow[] = [
  { year: 2020, crushedUsdPerMt: 12.69, sandUsdPerMt: 9.95, confidence: "disclosed" },
  { year: 2021, crushedUsdPerMt: 13.26, sandUsdPerMt: 10.52, confidence: "disclosed" },
  { year: 2022, crushedUsdPerMt: 14.31, sandUsdPerMt: 11.35, confidence: "disclosed" },
  { year: 2023, crushedUsdPerMt: 15.86, sandUsdPerMt: 12.54, confidence: "disclosed" },
  { year: 2024, crushedUsdPerMt: 17.5, sandUsdPerMt: 13.9, confidence: "estimated" },
];

export type UseMixRow = {
  use: string;
  sharePct: number;
  note: string;
};

/** USGS MCS 2025 crushed-stone end-use shares (2024e). */
export const CRUSHED_USE_MIX: UseMixRow[] = [
  {
    use: "Construction aggregate (roads + other)",
    sharePct: 72,
    note: "Mostly road construction and maintenance",
  },
  { use: "Cement manufacturing", sharePct: 17, note: "Feedstock, not pavement tonnage" },
  { use: "Lime manufacturing", sharePct: 6, note: "Industrial / chemical" },
  { use: "Agriculture", sharePct: 1, note: "Ag lime and related" },
  { use: "Other chemical / specialty", sharePct: 4, note: "Misc. chemical and specialty" },
];

export type DivisionRow = {
  division: string;
  region: "Northeast" | "Midwest" | "South" | "West";
  crushed2024Mt: number;
  sharePct: number;
  yoyPct: number;
  confidence: Confidence;
};

/** MIS Q4 2024 table 1 — crushed stone 1st–4th qtr 2024 (Mt). */
export const DIVISION_CRUSHED_2024: DivisionRow[] = [
  {
    division: "New England",
    region: "Northeast",
    crushed2024Mt: 41.2,
    sharePct: 2.8,
    yoyPct: 1.0,
    confidence: "estimated",
  },
  {
    division: "Middle Atlantic",
    region: "Northeast",
    crushed2024Mt: 146,
    sharePct: 9.9,
    yoyPct: -2.0,
    confidence: "estimated",
  },
  {
    division: "East North Central",
    region: "Midwest",
    crushed2024Mt: 231,
    sharePct: 15.6,
    yoyPct: -6.1,
    confidence: "estimated",
  },
  {
    division: "West North Central",
    region: "Midwest",
    crushed2024Mt: 143,
    sharePct: 9.7,
    yoyPct: -12.8,
    confidence: "estimated",
  },
  {
    division: "South Atlantic",
    region: "South",
    crushed2024Mt: 341,
    sharePct: 23.0,
    yoyPct: -3.9,
    confidence: "estimated",
  },
  {
    division: "East South Central",
    region: "South",
    crushed2024Mt: 149,
    sharePct: 10.1,
    yoyPct: -6.9,
    confidence: "estimated",
  },
  {
    division: "West South Central",
    region: "South",
    crushed2024Mt: 268,
    sharePct: 18.1,
    yoyPct: -4.3,
    confidence: "estimated",
  },
  {
    division: "Mountain",
    region: "West",
    crushed2024Mt: 64.9,
    sharePct: 4.4,
    yoyPct: -10.5,
    confidence: "estimated",
  },
  {
    division: "Pacific",
    region: "West",
    crushed2024Mt: 80.8,
    sharePct: 5.5,
    yoyPct: -0.4,
    confidence: "estimated",
  },
];

export type GapPoint = {
  year: number;
  aggregatesIndex: number;
  realCipIndex: number;
  gapPts: number;
};

/** Indexed gap: real CIP index minus aggregates index (2019=100). Widening = CIP outruns tons. */
export const INDEX_GAP: GapPoint[] = ANNUAL_PANEL.map((r) => ({
  year: r.year,
  aggregatesIndex: r.aggregatesIndex2019,
  realCipIndex: r.realCipIndex2019,
  gapPts: Math.round((r.realCipIndex2019 - r.aggregatesIndex2019) * 10) / 10,
}));

export type IntensityPoint = {
  year: number;
  intensity: number;
  crushedMt: number;
  sandMt: number;
};

export const INTENSITY_PATH: IntensityPoint[] = ANNUAL_PANEL.map((r) => ({
  year: r.year,
  intensity: r.intensityMtPerRealBn,
  crushedMt: r.crushedStoneMt,
  sandMt: r.sandGravelMt,
}));


export const ANALYTICS = {
  story:
    "From 2019 to 2024, nominal Census CIP rose ~61% while constructed real CIP rose ~15%. USGS aggregate tonnage ended 2024 ~2.5% below 2019 and ~6% below 2023. Intensity (Mt per $B real CIP) fell from 1.76 to 1.49 — tonnage did not keep pace with real put-in-place.",
  caveats: [
    "Real CIP here is constructed with a cost deflator, not Census’s published constant-dollar VIP tables.",
    "USGS MIS 2024 annuals are sample-survey estimates and can revise when Minerals Yearbook finals land.",
    "Not all crushed stone is pavement aggregate (~72% construction aggregate; cement/lime claim the rest).",
    "CIP dollars mix residential, nonresidential, and public work with very different aggregate intensities.",
  ],
};
