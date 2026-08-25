/**
 * US farmland values: cropland and pasture by USDA NASS region (2026 desk cut).
 *
 * Core question: Where are cropland and pasture values rising fastest, and how
 * closely do farm incomes and interest rates track those moves?
 *
 * Perimeter: USDA NASS Land Values 2025 Summary (Aug 2025) regional and national
 * $/acre for farm real estate, cropland, and pasture (48 contiguous states);
 * USDA ERS net farm income (nominal $B, forecast-tagged where noted); Kansas City
 * Fed / FRED-style average interest rate on non-real-estate farm loans (%).
 *
 * Headline: Northern Plains pasture rose 7.6% in 2025 — the fastest regional
 * pasture gain — while Lake States cropland led at +7.3%; U.S. cropland hit
 * $5,830/acre (+4.7%) and pasture $1,920 (+4.9%).
 */

export type Confidence = "disclosed" | "estimated" | "forecast";

export const SOURCE_NOTE =
  "USDA NASS Land Values 2025 Summary (Aug 2025): regional and U.S. average farm real estate, cropland, and pasture values per acre for the 48 contiguous states; state weights follow the Census of Agriculture cropland/pasture acreage. Historical U.S. chart series 2011–2020 taken from the same summary charts (desk-read). USDA ERS Farm Sector Income Forecast (nominal net farm income, $B). Average interest rate on non-real-estate farm loans: Kansas City Fed Agricultural Credit Survey / FRED bank farm-loan rate path (desk annual averages). YoY %, cropland–pasture premiums, and income/rate co-movement indexes are desk calculations — not NASS-published elasticities.";

export const SOURCES = [
  {
    label: "USDA NASS — Land Values 2025 Summary",
    url: "https://www.nass.usda.gov/Publications/Todays_Reports/reports/land0825.pdf",
  },
  {
    label: "USDA NASS — Agricultural Land Values (ESMIS release)",
    url: "https://esmis.nal.usda.gov/publication/agricultural-land-values/2025-08-01",
  },
  {
    label: "USDA ERS — Farmland Value",
    url: "https://www.ers.usda.gov/topics/farm-economy/land-use-land-value-tenure/farmland-value",
  },
  {
    label: "USDA ERS — Farm Sector Income Forecast",
    url: "https://www.ers.usda.gov/topics/farm-economy/farm-sector-income-finances/farm-sector-income-forecast",
  },
  {
    label: "Kansas City Fed — Agricultural Credit Survey",
    url: "https://www.kansascityfed.org/agriculture/ag-credit-survey/",
  },
] as const;

export const HEADLINE = {
  usCropland2025: 5830,
  usCroplandYoyPct: 4.7,
  usPasture2025: 1920,
  usPastureYoyPct: 4.9,
  usFarmRealEstate2025: 4350,
  usFarmRealEstateYoyPct: 4.3,
  /** Fastest regional pasture YoY, 2024→2025 */
  fastestPastureRegion: "Northern Plains",
  fastestPastureYoyPct: 7.6,
  /** Fastest regional cropland YoY, 2024→2025 */
  fastestCroplandRegion: "Lake States",
  fastestCroplandYoyPct: 7.3,
  confidence: "disclosed" as Confidence,
};

export type RegionId =
  | "Northeast"
  | "Lake States"
  | "Corn Belt"
  | "Northern Plains"
  | "Appalachian"
  | "Southeast"
  | "Delta States"
  | "Southern Plains"
  | "Mountain"
  | "Pacific";

export type RegionRow = {
  region: RegionId;
  farmRe2025: number;
  farmReYoyPct: number;
  cropland2025: number;
  croplandYoyPct: number;
  pasture2025: number;
  pastureYoyPct: number;
  cropland2024: number;
  pasture2024: number;
  cropland2021: number;
  pasture2021: number;
  confidence: Confidence;
};

/** NASS Land Values 2025 Summary — regional averages, 48 states */
export const REGIONS: RegionRow[] = [
  {
    region: "Northeast",
    farmRe2025: 7300,
    farmReYoyPct: 3.3,
    cropland2025: 7900,
    croplandYoyPct: 2.7,
    pasture2025: 4750,
    pastureYoyPct: 1.7,
    cropland2024: 7690,
    pasture2024: 4670,
    cropland2021: 6540,
    pasture2021: 4020,
    confidence: "disclosed",
  },
  {
    region: "Lake States",
    farmRe2025: 6690,
    farmReYoyPct: 5.7,
    cropland2025: 6940,
    croplandYoyPct: 7.3,
    pasture2025: 2830,
    pastureYoyPct: 3.7,
    cropland2024: 6470,
    pasture2024: 2730,
    cropland2021: 4970,
    pasture2021: 2190,
    confidence: "disclosed",
  },
  {
    region: "Corn Belt",
    farmRe2025: 8250,
    farmReYoyPct: 4.0,
    cropland2025: 8940,
    croplandYoyPct: 4.4,
    pasture2025: 3120,
    pastureYoyPct: 4.0,
    cropland2024: 8560,
    pasture2024: 3000,
    cropland2021: 6730,
    pasture2021: 2510,
    confidence: "disclosed",
  },
  {
    region: "Northern Plains",
    farmRe2025: 3200,
    farmReYoyPct: 4.9,
    cropland2025: 4220,
    croplandYoyPct: 4.5,
    pasture2025: 1560,
    pastureYoyPct: 7.6,
    cropland2024: 4040,
    pasture2024: 1450,
    cropland2021: 2890,
    pasture2021: 1060,
    confidence: "disclosed",
  },
  {
    region: "Appalachian",
    farmRe2025: 5590,
    farmReYoyPct: 5.1,
    cropland2025: 5950,
    croplandYoyPct: 5.1,
    pasture2025: 4680,
    pastureYoyPct: 4.0,
    cropland2024: 5660,
    pasture2024: 4500,
    cropland2021: 4380,
    pasture2021: 3630,
    confidence: "disclosed",
  },
  {
    region: "Southeast",
    farmRe2025: 5750,
    farmReYoyPct: 4.7,
    cropland2025: 5860,
    croplandYoyPct: 3.9,
    pasture2025: 5720,
    pastureYoyPct: 3.8,
    cropland2024: 5640,
    pasture2024: 5510,
    cropland2021: 4390,
    pasture2021: 4410,
    confidence: "disclosed",
  },
  {
    region: "Delta States",
    farmRe2025: 3930,
    farmReYoyPct: 3.1,
    cropland2025: 3750,
    croplandYoyPct: 2.7,
    pasture2025: 3360,
    pastureYoyPct: 3.4,
    cropland2024: 3650,
    pasture2024: 3250,
    cropland2021: 3140,
    pasture2021: 2820,
    confidence: "disclosed",
  },
  {
    region: "Southern Plains",
    farmRe2025: 2880,
    farmReYoyPct: 5.9,
    cropland2025: 2640,
    croplandYoyPct: 5.6,
    pasture2025: 2260,
    pastureYoyPct: 4.6,
    cropland2024: 2500,
    pasture2024: 2160,
    cropland2021: 1960,
    pasture2021: 1690,
    confidence: "disclosed",
  },
  {
    region: "Mountain",
    farmRe2025: 1660,
    farmReYoyPct: 3.8,
    cropland2025: 2800,
    croplandYoyPct: 3.7,
    pasture2025: 946,
    pastureYoyPct: 3.7,
    cropland2024: 2700,
    pasture2024: 912,
    cropland2021: 2210,
    pasture2021: 756,
    confidence: "disclosed",
  },
  {
    region: "Pacific",
    farmRe2025: 8210,
    farmReYoyPct: 2.1,
    cropland2025: 9830,
    croplandYoyPct: 3.3,
    pasture2025: 2450,
    pastureYoyPct: 3.4,
    cropland2024: 9520,
    pasture2024: 2370,
    cropland2021: 8090,
    pasture2021: 1900,
    confidence: "disclosed",
  },
];

export type NationalPathRow = {
  year: number;
  farmReUsd: number;
  croplandUsd: number;
  pastureUsd: number;
  croplandYoyPct: number | null;
  pastureYoyPct: number | null;
  nfiBillionUsd: number;
  nfiFlag: "actual" | "forecast";
  farmLoanRatePct: number;
  confidence: Confidence;
};

/**
 * U.S. national path: NASS chart/table levels + ERS NFI + KC Fed farm loan rates.
 * NFI 2025–2026 tagged forecast; loan rates are desk annual averages.
 */
export const NATIONAL_PATH: NationalPathRow[] = [
  {
    year: 2015,
    farmReUsd: 3030,
    croplandUsd: 4100,
    pastureUsd: 1310,
    croplandYoyPct: 0.2,
    pastureYoyPct: 1.6,
    nfiBillionUsd: 81.4,
    nfiFlag: "actual",
    farmLoanRatePct: 4.0,
    confidence: "estimated",
  },
  {
    year: 2016,
    farmReUsd: 3100,
    croplandUsd: 4040,
    pastureUsd: 1320,
    croplandYoyPct: -1.5,
    pastureYoyPct: 0.8,
    nfiBillionUsd: 61.5,
    nfiFlag: "actual",
    farmLoanRatePct: 3.8,
    confidence: "estimated",
  },
  {
    year: 2017,
    farmReUsd: 3140,
    croplandUsd: 4030,
    pastureUsd: 1330,
    croplandYoyPct: -0.2,
    pastureYoyPct: 0.8,
    nfiBillionUsd: 75.5,
    nfiFlag: "actual",
    farmLoanRatePct: 4.2,
    confidence: "estimated",
  },
  {
    year: 2018,
    farmReUsd: 3130,
    croplandUsd: 4050,
    pastureUsd: 1370,
    croplandYoyPct: 0.5,
    pastureYoyPct: 3.0,
    nfiBillionUsd: 84.0,
    nfiFlag: "actual",
    farmLoanRatePct: 5.1,
    confidence: "estimated",
  },
  {
    year: 2019,
    farmReUsd: 3140,
    croplandUsd: 4080,
    pastureUsd: 1390,
    croplandYoyPct: 0.7,
    pastureYoyPct: 1.5,
    nfiBillionUsd: 93.1,
    nfiFlag: "actual",
    farmLoanRatePct: 5.4,
    confidence: "estimated",
  },
  {
    year: 2020,
    farmReUsd: 3160,
    croplandUsd: 4060,
    pastureUsd: 1400,
    croplandYoyPct: -0.5,
    pastureYoyPct: 0.7,
    nfiBillionUsd: 122.7,
    nfiFlag: "actual",
    farmLoanRatePct: 4.0,
    confidence: "estimated",
  },
  {
    year: 2021,
    farmReUsd: 3330,
    croplandUsd: 4350,
    pastureUsd: 1470,
    croplandYoyPct: 7.1,
    pastureYoyPct: 5.0,
    nfiBillionUsd: 145.5,
    nfiFlag: "actual",
    farmLoanRatePct: 3.8,
    confidence: "disclosed",
  },
  {
    year: 2022,
    farmReUsd: 3720,
    croplandUsd: 4940,
    pastureUsd: 1630,
    croplandYoyPct: 13.6,
    pastureYoyPct: 10.9,
    nfiBillionUsd: 186.0,
    nfiFlag: "actual",
    farmLoanRatePct: 5.5,
    confidence: "disclosed",
  },
  {
    year: 2023,
    farmReUsd: 3970,
    croplandUsd: 5320,
    pastureUsd: 1740,
    croplandYoyPct: 7.7,
    pastureYoyPct: 6.7,
    nfiBillionUsd: 141.0,
    nfiFlag: "actual",
    farmLoanRatePct: 8.0,
    confidence: "disclosed",
  },
  {
    year: 2024,
    farmReUsd: 4170,
    croplandUsd: 5570,
    pastureUsd: 1830,
    croplandYoyPct: 4.7,
    pastureYoyPct: 5.2,
    nfiBillionUsd: 139.0,
    nfiFlag: "actual",
    farmLoanRatePct: 8.2,
    confidence: "disclosed",
  },
  {
    year: 2025,
    farmReUsd: 4350,
    croplandUsd: 5830,
    pastureUsd: 1920,
    croplandYoyPct: 4.7,
    pastureYoyPct: 4.9,
    nfiBillionUsd: 180.0,
    nfiFlag: "forecast",
    farmLoanRatePct: 7.8,
    confidence: "disclosed",
  },
];

export type StateSpotlight = {
  state: string;
  region: RegionId;
  landType: "cropland" | "pasture";
  value2025: number;
  yoyPct: number;
  note: string;
  confidence: Confidence;
};

/** State extremes / growth leaders from NASS 2025 Summary */
export const STATE_SPOTLIGHTS: StateSpotlight[] = [
  {
    state: "Utah",
    region: "Mountain",
    landType: "cropland",
    value2025: 5790,
    yoyPct: 9.7,
    note: "Fastest state cropland YoY in 2025",
    confidence: "disclosed",
  },
  {
    state: "Michigan",
    region: "Lake States",
    landType: "cropland",
    value2025: 6350,
    yoyPct: 8.2,
    note: "Lake States cropland leader",
    confidence: "disclosed",
  },
  {
    state: "Tennessee",
    region: "Appalachian",
    landType: "cropland",
    value2025: 6050,
    yoyPct: 7.8,
    note: "Appalachian cropland growth standout",
    confidence: "disclosed",
  },
  {
    state: "North Dakota",
    region: "Northern Plains",
    landType: "pasture",
    value2025: 1140,
    yoyPct: 8.6,
    note: "Fastest state pasture YoY in 2025",
    confidence: "disclosed",
  },
  {
    state: "Kansas",
    region: "Northern Plains",
    landType: "pasture",
    value2025: 2270,
    yoyPct: 8.1,
    note: "Northern Plains pasture surge",
    confidence: "disclosed",
  },
  {
    state: "Nebraska",
    region: "Northern Plains",
    landType: "pasture",
    value2025: 1510,
    yoyPct: 7.9,
    note: "Third-fastest pasture state print",
    confidence: "disclosed",
  },
  {
    state: "Iowa",
    region: "Corn Belt",
    landType: "cropland",
    value2025: 10300,
    yoyPct: 5.1,
    note: "Highest Corn Belt cropland level",
    confidence: "disclosed",
  },
  {
    state: "Rhode Island",
    region: "Northeast",
    landType: "cropland",
    value2025: 32900,
    yoyPct: 0,
    note: "Highest state cropland level (urban fringe); YoY withheld/X",
    confidence: "disclosed",
  },
];

export function croplandPasturePremium(r: RegionRow): number {
  return r.cropland2025 - r.pasture2025;
}

export function croplandPastureRatio(r: RegionRow): number {
  return r.pasture2025 > 0 ? r.cropland2025 / r.pasture2025 : 0;
}

export function pastureMinusCroplandYoy(r: RegionRow): number {
  return r.pastureYoyPct - r.croplandYoyPct;
}

export function fiveYearCroplandCagr(r: RegionRow): number {
  if (r.cropland2021 <= 0) return 0;
  return (Math.pow(r.cropland2025 / r.cropland2021, 1 / 4) - 1) * 100;
}

export function fiveYearPastureCagr(r: RegionRow): number {
  if (r.pasture2021 <= 0) return 0;
  return (Math.pow(r.pasture2025 / r.pasture2021, 1 / 4) - 1) * 100;
}

export function fmtUsd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}
