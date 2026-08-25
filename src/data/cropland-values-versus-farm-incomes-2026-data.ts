/**
 * Cropland values versus farm incomes (2026).
 *
 * Core question: Which USDA regions saw cropland value growth decouple from
 * net farm income, and how rate-sensitive is the next reappraisal?
 *
 * Perimeter: USDA NASS Land Values 2025 Summary cropland $/acre by farm
 * production region (2021–2025); USDA ERS farm-sector net farm income (NFI)
 * and net cash farm income through the February 5, 2026 forecast; NASS/ERS
 * cropland cash rents for implied current-yield (rent/price) ratios. Regional
 * income pressure indices blend ERS commodity-mix logic with published state
 * NFI paths for crop-heavy districts — labeled estimated where ERS does not
 * publish NASS-region NFI.
 *
 * Headline: U.S. cropland averaged $5,830/acre in 2025 (+4.7% y/y) while
 * national NFI remains ~19% below the 2022 peak even after the 2025 rebound.
 */

export type Confidence = "disclosed" | "estimated" | "scenario";

export const SOURCE_NOTE =
  "Cropland values: USDA NASS Land Values 2025 Summary (August 2025), table of cropland average value per acre by farm production region and United States, 2021–2025. Farm real estate and cash-rent companions from the same release and ERS Farmland Value topic page (August 2025 regional table). National net farm income and net cash farm income: USDA ERS Farm Sector Income Forecast (February 5, 2026) and U.S. farm sector financial indicators 2019–2026F. Regional income-pressure indices are estimated composites — crop-receipt–weighted for Corn Belt / Northern Plains / Lake States, livestock-weighted for Southern Plains / Mountain, specialty/urban-adjacent for Pacific / Northeast — anchored to national ERS receipt paths and published state NFI declines (e.g. Iowa RaFF outlook citing ERS). Rate-sensitivity bands are scenarios applying ±100 bp shifts to implied rent yields, not surveyed transaction caps.";

export const SOURCES = [
  {
    label: "USDA NASS — Land Values 2025 Summary",
    url: "https://www.nass.usda.gov/Publications/Todays_Reports/reports/land0825.pdf",
  },
  {
    label: "USDA NASS — Land Values & Cash Rents highlights (2025)",
    url: "https://www.nass.usda.gov/Publications/Highlights/2025/2025LandValuesCashRents_FINAL.pdf",
  },
  {
    label: "USDA ERS — Farmland value (regional table, 2025)",
    url: "https://www.ers.usda.gov/topics/farm-economy/land-use-land-value-tenure/farmland-value",
  },
  {
    label: "USDA ERS — Farm sector income forecast (Feb 5, 2026)",
    url: "https://www.ers.usda.gov/topics/farm-economy/farm-sector-income-finances/farm-sector-income-forecast",
  },
  {
    label: "USDA ERS — Farm income & wealth statistics data files",
    url: "https://www.ers.usda.gov/data-products/farm-income-and-wealth-statistics/data-files-us-and-state-level-farm-income-and-wealth-statistics",
  },
] as const;

export const HEADLINE = {
  usCropland2025PerAcre: 5830,
  usCropland2024PerAcre: 5570,
  usCroplandYoyPct: 4.7,
  usCroplandSince2021Pct: 34.0, // 5830/4350 - 1
  nfi2022Bn: 188.8,
  nfi2024Bn: 140.7,
  nfi2025Bn: 154.6,
  nfi2026FBn: 153.4,
  nfiVs2022PeakPct: -18.7, // 153.4/188.8 - 1
  usCroplandRent2025: 161,
  usImpliedRentYieldPct: 2.76, // 161/5830
  lakeStatesYoyPct: 7.3,
  deltaStatesValueSince2021Pct: 19.4,
  confidence: "disclosed" as Confidence,
};

/** NASS farm production regions */
export type NassRegionId =
  | "northeast"
  | "lake-states"
  | "corn-belt"
  | "northern-plains"
  | "appalachian"
  | "southeast"
  | "delta-states"
  | "southern-plains"
  | "mountain"
  | "pacific"
  | "united-states";

export type CroplandSeriesRow = {
  regionId: NassRegionId;
  region: string;
  y2021: number;
  y2022: number;
  y2023: number;
  y2024: number;
  y2025: number;
  yoy2425Pct: number;
  since2021Pct: number;
  confidence: Confidence;
};

/** Disclosed NASS cropland $/acre by region */
export const CROPLAND_BY_REGION: CroplandSeriesRow[] = [
  {
    regionId: "northeast",
    region: "Northeast",
    y2021: 6540,
    y2022: 7160,
    y2023: 7530,
    y2024: 7690,
    y2025: 7900,
    yoy2425Pct: 2.7,
    since2021Pct: 20.8,
    confidence: "disclosed",
  },
  {
    regionId: "lake-states",
    region: "Lake States",
    y2021: 4970,
    y2022: 5680,
    y2023: 6210,
    y2024: 6470,
    y2025: 6940,
    yoy2425Pct: 7.3,
    since2021Pct: 39.6,
    confidence: "disclosed",
  },
  {
    regionId: "corn-belt",
    region: "Corn Belt",
    y2021: 6730,
    y2022: 7660,
    y2023: 8190,
    y2024: 8560,
    y2025: 8940,
    yoy2425Pct: 4.4,
    since2021Pct: 32.8,
    confidence: "disclosed",
  },
  {
    regionId: "northern-plains",
    region: "Northern Plains",
    y2021: 2890,
    y2022: 3400,
    y2023: 3790,
    y2024: 4040,
    y2025: 4220,
    yoy2425Pct: 4.5,
    since2021Pct: 46.0,
    confidence: "disclosed",
  },
  {
    regionId: "appalachian",
    region: "Appalachian",
    y2021: 4380,
    y2022: 4840,
    y2023: 5220,
    y2024: 5660,
    y2025: 5950,
    yoy2425Pct: 5.1,
    since2021Pct: 35.8,
    confidence: "disclosed",
  },
  {
    regionId: "southeast",
    region: "Southeast",
    y2021: 4390,
    y2022: 4830,
    y2023: 5260,
    y2024: 5640,
    y2025: 5860,
    yoy2425Pct: 3.9,
    since2021Pct: 33.5,
    confidence: "disclosed",
  },
  {
    regionId: "delta-states",
    region: "Delta States",
    y2021: 3140,
    y2022: 3390,
    y2023: 3510,
    y2024: 3650,
    y2025: 3750,
    yoy2425Pct: 2.7,
    since2021Pct: 19.4,
    confidence: "disclosed",
  },
  {
    regionId: "southern-plains",
    region: "Southern Plains",
    y2021: 1960,
    y2022: 2240,
    y2023: 2390,
    y2024: 2500,
    y2025: 2640,
    yoy2425Pct: 5.6,
    since2021Pct: 34.7,
    confidence: "disclosed",
  },
  {
    regionId: "mountain",
    region: "Mountain",
    y2021: 2210,
    y2022: 2480,
    y2023: 2610,
    y2024: 2700,
    y2025: 2800,
    yoy2425Pct: 3.7,
    since2021Pct: 26.7,
    confidence: "disclosed",
  },
  {
    regionId: "pacific",
    region: "Pacific",
    y2021: 8090,
    y2022: 9060,
    y2023: 9540,
    y2024: 9520,
    y2025: 9830,
    yoy2425Pct: 3.3,
    since2021Pct: 21.5,
    confidence: "disclosed",
  },
  {
    regionId: "united-states",
    region: "United States",
    y2021: 4350,
    y2022: 4940,
    y2023: 5320,
    y2024: 5570,
    y2025: 5830,
    yoy2425Pct: 4.7,
    since2021Pct: 34.0,
    confidence: "disclosed",
  },
];

export type NationalPathRow = {
  year: number;
  croplandPerAcre: number | null;
  nfiBn: number;
  ncfiBn: number;
  croplandIndex: number | null;
  nfiIndex: number;
  note?: string;
  confidence: Confidence;
};

/** Dual national path: cropland $/acre vs NFI (index 2021 = 100) */
export const NATIONAL_PATH: NationalPathRow[] = [
  {
    year: 2021,
    croplandPerAcre: 4350,
    nfiBn: 135.0,
    ncfiBn: 148.0,
    croplandIndex: 100,
    nfiIndex: 100,
    confidence: "disclosed",
  },
  {
    year: 2022,
    croplandPerAcre: 4940,
    nfiBn: 188.8,
    ncfiBn: 199.0,
    croplandIndex: 113.6,
    nfiIndex: 139.9,
    confidence: "disclosed",
  },
  {
    year: 2023,
    croplandPerAcre: 5320,
    nfiBn: 155.1,
    ncfiBn: 162.0,
    croplandIndex: 122.3,
    nfiIndex: 114.9,
    confidence: "disclosed",
  },
  {
    year: 2024,
    croplandPerAcre: 5570,
    nfiBn: 140.7,
    ncfiBn: 146.0,
    croplandIndex: 128.0,
    nfiIndex: 104.2,
    confidence: "disclosed",
  },
  {
    year: 2025,
    croplandPerAcre: 5830,
    nfiBn: 154.6,
    ncfiBn: 153.9,
    croplandIndex: 134.0,
    nfiIndex: 114.5,
    note: "NFI estimate; cropland from Aug 2025 NASS",
    confidence: "disclosed",
  },
  {
    year: 2026,
    croplandPerAcre: null,
    nfiBn: 153.4,
    ncfiBn: 158.5,
    croplandIndex: null,
    nfiIndex: 113.6,
    note: "ERS Feb 2026 forecast; cropland survey not yet published",
    confidence: "disclosed",
  },
];

export type DecoupleRow = {
  regionId: NassRegionId;
  region: string;
  croplandSince2021Pct: number;
  /** Estimated regional NFI / NCFI pressure index change 2021→2024 (peak-to-trough aware) */
  incomePressurePct: number;
  /** cropland growth minus income path — positive = value outran income */
  gapPp: number;
  specialization: "row-crop" | "mixed" | "cattle" | "specialty-urban";
  rent2025: number;
  value2025: number;
  yieldPct: number;
  confidence: Confidence;
};

/**
 * Regional decoupling scatter.
 * Income pressure: estimated % change in regional farm profitability proxy
 * from 2021 through 2024 (crop districts deeply negative; cattle/specialty milder).
 */
export const DECOUPLE_SCATTER: DecoupleRow[] = [
  {
    regionId: "northern-plains",
    region: "Northern Plains",
    croplandSince2021Pct: 46.0,
    incomePressurePct: -28,
    gapPp: 74.0,
    specialization: "row-crop",
    rent2025: 123,
    value2025: 4220,
    yieldPct: 2.91,
    confidence: "estimated",
  },
  {
    regionId: "lake-states",
    region: "Lake States",
    croplandSince2021Pct: 39.6,
    incomePressurePct: -22,
    gapPp: 61.6,
    specialization: "row-crop",
    rent2025: 183,
    value2025: 6940,
    yieldPct: 2.64,
    confidence: "estimated",
  },
  {
    regionId: "appalachian",
    region: "Appalachian",
    croplandSince2021Pct: 35.8,
    incomePressurePct: -12,
    gapPp: 47.8,
    specialization: "mixed",
    rent2025: 117,
    value2025: 5950,
    yieldPct: 1.97,
    confidence: "estimated",
  },
  {
    regionId: "southern-plains",
    region: "Southern Plains",
    croplandSince2021Pct: 34.7,
    incomePressurePct: 8,
    gapPp: 26.7,
    specialization: "cattle",
    rent2025: 46,
    value2025: 2640,
    yieldPct: 1.74,
    confidence: "estimated",
  },
  {
    regionId: "southeast",
    region: "Southeast",
    croplandSince2021Pct: 33.5,
    incomePressurePct: -8,
    gapPp: 41.5,
    specialization: "mixed",
    rent2025: 109,
    value2025: 5860,
    yieldPct: 1.86,
    confidence: "estimated",
  },
  {
    regionId: "corn-belt",
    region: "Corn Belt",
    croplandSince2021Pct: 32.8,
    incomePressurePct: -32,
    gapPp: 64.8,
    specialization: "row-crop",
    rent2025: 240,
    value2025: 8940,
    yieldPct: 2.68,
    confidence: "estimated",
  },
  {
    regionId: "mountain",
    region: "Mountain",
    croplandSince2021Pct: 26.7,
    incomePressurePct: 2,
    gapPp: 24.7,
    specialization: "cattle",
    rent2025: 106,
    value2025: 2800,
    yieldPct: 3.79,
    confidence: "estimated",
  },
  {
    regionId: "pacific",
    region: "Pacific",
    croplandSince2021Pct: 21.5,
    incomePressurePct: -6,
    gapPp: 27.5,
    specialization: "specialty-urban",
    rent2025: 281,
    value2025: 9830,
    yieldPct: 2.86,
    confidence: "estimated",
  },
  {
    regionId: "northeast",
    region: "Northeast",
    croplandSince2021Pct: 20.8,
    incomePressurePct: -4,
    gapPp: 24.8,
    specialization: "specialty-urban",
    rent2025: 102,
    value2025: 7900,
    yieldPct: 1.29,
    confidence: "estimated",
  },
  {
    regionId: "delta-states",
    region: "Delta States",
    croplandSince2021Pct: 19.4,
    incomePressurePct: -18,
    gapPp: 37.4,
    specialization: "row-crop",
    rent2025: 134,
    value2025: 3750,
    yieldPct: 3.57,
    confidence: "estimated",
  },
];

export type YieldRow = {
  regionId: NassRegionId;
  region: string;
  value2025: number;
  rent2025: number;
  yieldPct: number;
  /** Scenario: value if yield reverts toward 3.5% (higher rate / tighter credit) */
  valueAt35Yield: number;
  compressionPct: number;
  confidence: Confidence;
};

export const RENT_YIELD_STRESS: YieldRow[] = DECOUPLE_SCATTER.map((r) => {
  const targetYield = 3.5;
  const valueAt35 = Math.round(r.rent2025 / (targetYield / 100));
  const compressionPct = Number(
    (((valueAt35 - r.value2025) / r.value2025) * 100).toFixed(1),
  );
  return {
    regionId: r.regionId,
    region: r.region,
    value2025: r.value2025,
    rent2025: r.rent2025,
    yieldPct: r.yieldPct,
    valueAt35Yield: valueAt35,
    compressionPct,
    confidence: "scenario" as Confidence,
  };
}).sort((a, b) => a.compressionPct - b.compressionPct);

export type RateBandRow = {
  bpShift: number;
  label: string;
  /** Indexed national cropland value (2025 = 100) under simple yield-shift */
  index: number;
  impliedUsValue: number;
  confidence: Confidence;
};

/** Simple national rate-sensitivity: shift implied yield from 2.76% base */
export const RATE_BANDS: RateBandRow[] = [
  {
    bpShift: -100,
    label: "−100 bp",
    index: 156.8,
    impliedUsValue: Math.round(161 / 0.0176),
    confidence: "scenario",
  },
  {
    bpShift: -50,
    label: "−50 bp",
    index: 122.1,
    impliedUsValue: Math.round(161 / 0.0226),
    confidence: "scenario",
  },
  {
    bpShift: 0,
    label: "Base (2.76%)",
    index: 100,
    impliedUsValue: 5830,
    confidence: "disclosed",
  },
  {
    bpShift: 50,
    label: "+50 bp",
    index: 84.7,
    impliedUsValue: Math.round(161 / 0.0326),
    confidence: "scenario",
  },
  {
    bpShift: 100,
    label: "+100 bp",
    index: 73.5,
    impliedUsValue: Math.round(161 / 0.0376),
    confidence: "scenario",
  },
  {
    bpShift: 150,
    label: "+150 bp",
    index: 64.9,
    impliedUsValue: Math.round(161 / 0.0426),
    confidence: "scenario",
  },
];

export type RegionCompareKey = Exclude<NassRegionId, "united-states">;

export const REGION_OPTIONS: { id: RegionCompareKey; label: string }[] = [
  { id: "corn-belt", label: "Corn Belt" },
  { id: "northern-plains", label: "Northern Plains" },
  { id: "lake-states", label: "Lake States" },
  { id: "southern-plains", label: "Southern Plains" },
  { id: "pacific", label: "Pacific" },
  { id: "delta-states", label: "Delta States" },
  { id: "northeast", label: "Northeast" },
  { id: "appalachian", label: "Appalachian" },
  { id: "southeast", label: "Southeast" },
  { id: "mountain", label: "Mountain" },
];

export function regionSeries(regionId: NassRegionId) {
  const row = CROPLAND_BY_REGION.find((r) => r.regionId === regionId);
  if (!row) return [];
  return [
    { year: 2021, value: row.y2021 },
    { year: 2022, value: row.y2022 },
    { year: 2023, value: row.y2023 },
    { year: 2024, value: row.y2024 },
    { year: 2025, value: row.y2025 },
  ];
}

export const ANALYTICS = {
  maxGapRegion: "Northern Plains",
  maxGapPp: 74.0,
  maxYoyRegion: "Lake States",
  maxYoyPct: 7.3,
  tightestYieldRegion: "Northeast",
  tightestYieldPct: 1.29,
  widestYieldRegion: "Mountain",
  widestYieldPct: 3.79,
  cornBeltGapPp: 64.8,
  usYieldPct: 2.76,
  plus100bpImpliedDropPct: 26.5, // 1 - 73.5/100
} as const;
