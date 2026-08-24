/**
 * Social housing stock share in OECD (2026).
 *
 * Core question: Which OECD countries still have a material social-rental
 * stock, and how fast is that share shrinking?
 *
 * Perimeter: OECD Affordable Housing Database indicator PH4.2 — social rental
 * dwellings as % of total dwellings (QuASH 2023/2021/2019/2016 and national
 * statistical supplements). Latest observation is 2022 or the most recent
 * QuASH year available per country. Trend pairs ~2010 vs latest share.
 *
 * Headline: Social rental dwellings average ~7.1% of the OECD housing stock;
 * only the Netherlands, Austria, and Denmark still clear 20%.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export type SizeBand =
  | "large"
  | "moderate"
  | "small"
  | "minimal"
  | "aggregate";

export type TrendBand =
  | "sharp-decline"
  | "moderate-decline"
  | "small-decline"
  | "stable-or-up"
  | "no-pair";

export const SOURCE_NOTE =
  "OECD Affordable Housing Database, indicator PH4.2 Social rental housing stock (last updated 24/11/2025). Shares are social rental dwellings as % of total dwellings from QuASH 2023/2021/2019/2016 plus national supplements (Korea KOSIS; New Zealand HUD; Italy Federcasa / Tax Revenue Agency via OECD–Bank of Italy; Brussels IBSA for Belgium). Netherlands figures estimate below-market rentals including housing-association and private below-market units. US figures include public housing, Section 202/811, and LIHTC income-restricted units (preliminary). Canada excludes Québec SHQ units. UK series is England dwelling stock. Absolute unit counts from Table PH4.2.A1. Provider mix from Figure PH4.2.2 (shares of the social stock, not of total dwellings).";

export const SOURCES = [
  {
    label: "OECD Affordable Housing Database — PH4.2",
    url: "https://www.oecd.org/en/data/datasets/oecd-affordable-housing-database.html",
  },
  {
    label: "OECD PH4.2 PDF (definitions & caveats)",
    url: "https://webfs.oecd.org/els-com/Affordable_Housing_Database/PH4-2-Social-rental-housing-stock.pdf",
  },
  {
    label: "OECD PH4.2 Excel (Figures + Annex A1)",
    url: "https://webfs.oecd.org/els-com/Affordable_Housing_Database/PH4-2-Social-rental-housing-stock.xlsx",
  },
  {
    label: "OECD — Social housing policy brief (2020)",
    url: "https://www.oecd.org/content/dam/oecd/en/publications/reports/2020/10/social-housing-a-key-part-of-past-and-future-housing-policy_ef96d6d9/5b54f96b-en.pdf",
  },
] as const;

export const HEADLINE = {
  oecdAverageSharePct: 7.07,
  euAverageSharePct: 7.99,
  socialDwellingsMillionsApprox: 28,
  countriesAbove20: 3,
  countriesDeclineOf25WithPair: 18,
  countriesWithPair: 25,
  largestShareCountry: "Netherlands",
  largestSharePct: 34.07,
  sharpestDeclineCountry: "Poland",
  sharpestDeclinePp: -3.44,
  confidence: "disclosed" as Confidence,
};

export type CountryStockRow = {
  id: string;
  country: string;
  iso3: string;
  /** Latest social rental share of total dwellings (%) */
  shareLatestPct: number;
  yearLatest: number | null;
  /** ~2010 social rental share (%) when disclosed */
  shareAround2010Pct: number | null;
  yearAround2010: number | null;
  /** Percentage-point change (latest − ~2010) */
  changePp: number | null;
  socialDwellingsLatest: number | null;
  socialDwellingsAround2010: number | null;
  sizeBand: SizeBand;
  trendBand: TrendBand;
  confidence: Confidence;
  note?: string;
};

function sizeBand(share: number, isAgg: boolean): SizeBand {
  if (isAgg) return "aggregate";
  if (share >= 20) return "large";
  if (share >= 10) return "moderate";
  if (share >= 2) return "small";
  return "minimal";
}

function trendBand(change: number | null): TrendBand {
  if (change == null) return "no-pair";
  if (change <= -2) return "sharp-decline";
  if (change <= -0.25) return "moderate-decline";
  if (change < 0) return "small-decline";
  return "stable-or-up";
}

/** Country panel — OECD PH4.2 Figure 1 + Annex A1 (rounded for display). */
export const COUNTRY_STOCK: CountryStockRow[] = [
  {
    id: "nld",
    country: "Netherlands",
    iso3: "NLD",
    shareLatestPct: 34.07,
    yearLatest: 2021,
    shareAround2010Pct: 38.3,
    yearAround2010: 2012,
    changePp: -4.23,
    socialDwellingsLatest: 2_714_000,
    socialDwellingsAround2010: 2_829_000,
    sizeBand: "large",
    trendBand: "sharp-decline",
    confidence: "disclosed",
    note: "Includes housing-association and private below-market rentals.",
  },
  {
    id: "aut",
    country: "Austria",
    iso3: "AUT",
    shareLatestPct: 23.6,
    yearLatest: 2019,
    shareAround2010Pct: 24.0,
    yearAround2010: 2010,
    changePp: -0.4,
    socialDwellingsLatest: 930_866,
    socialDwellingsAround2010: 869_200,
    sizeBand: "large",
    trendBand: "moderate-decline",
    confidence: "disclosed",
    note: "Main-residence dwellings only.",
  },
  {
    id: "dnk",
    country: "Denmark",
    iso3: "DNK",
    shareLatestPct: 21.33,
    yearLatest: 2022,
    shareAround2010Pct: 21.78,
    yearAround2010: 2010,
    changePp: -0.44,
    socialDwellingsLatest: 640_000,
    socialDwellingsAround2010: 588_000,
    sizeBand: "large",
    trendBand: "moderate-decline",
    confidence: "disclosed",
  },
  {
    id: "gbr",
    country: "United Kingdom (England)",
    iso3: "GBR",
    shareLatestPct: 16.36,
    yearLatest: 2022,
    shareAround2010Pct: 17.37,
    yearAround2010: 2010,
    changePp: -1.0,
    socialDwellingsLatest: 4_117_228,
    socialDwellingsAround2010: 3_966_453,
    sizeBand: "moderate",
    trendBand: "moderate-decline",
    confidence: "disclosed",
    note: "England dwelling stock; Right to Buy shifts tenure to ownership.",
  },
  {
    id: "fra",
    country: "France",
    iso3: "FRA",
    shareLatestPct: 14.01,
    yearLatest: 2018,
    shareAround2010Pct: 13.54,
    yearAround2010: 2012,
    changePp: 0.47,
    socialDwellingsLatest: 5_089_000,
    socialDwellingsAround2010: 4_558_000,
    sizeBand: "moderate",
    trendBand: "stable-or-up",
    confidence: "disclosed",
  },
  {
    id: "irl",
    country: "Ireland",
    iso3: "IRL",
    shareLatestPct: 12.7,
    yearLatest: 2016,
    shareAround2010Pct: 12.72,
    yearAround2010: 2010,
    changePp: -0.03,
    socialDwellingsLatest: 254_380,
    socialDwellingsAround2010: 253_800,
    sizeBand: "moderate",
    trendBand: "small-decline",
    confidence: "disclosed",
    note: "Traditional stock; leased private units complicate the boundary.",
  },
  {
    id: "isl",
    country: "Iceland",
    iso3: "ISL",
    shareLatestPct: 11.1,
    yearLatest: 2016,
    shareAround2010Pct: 8.64,
    yearAround2010: 2010,
    changePp: 2.46,
    socialDwellingsLatest: 15_600,
    socialDwellingsAround2010: 11_300,
    sizeBand: "moderate",
    trendBand: "stable-or-up",
    confidence: "disclosed",
    note: "May include some student / family reduced-rent units.",
  },
  {
    id: "fin",
    country: "Finland",
    iso3: "FIN",
    shareLatestPct: 10.94,
    yearLatest: 2021,
    shareAround2010Pct: 13.25,
    yearAround2010: 2010,
    changePp: -2.31,
    socialDwellingsLatest: 348_642,
    socialDwellingsAround2010: 371_865,
    sizeBand: "moderate",
    trendBand: "sharp-decline",
    confidence: "disclosed",
  },
  {
    id: "kor",
    country: "Korea",
    iso3: "KOR",
    shareLatestPct: 8.9,
    yearLatest: 2018,
    shareAround2010Pct: 6.3,
    yearAround2010: 2010,
    changePp: 2.6,
    socialDwellingsLatest: 1_570_242,
    socialDwellingsAround2010: 924_455,
    sizeBand: "small",
    trendBand: "stable-or-up",
    confidence: "disclosed",
  },
  {
    id: "che",
    country: "Switzerland",
    iso3: "CHE",
    shareLatestPct: 8.0,
    yearLatest: 2013,
    shareAround2010Pct: 8.0,
    yearAround2010: 2013,
    changePp: null,
    socialDwellingsLatest: 104_155,
    socialDwellingsAround2010: 104_155,
    sizeBand: "small",
    trendBand: "no-pair",
    confidence: "carried",
    note: "Single-year observation in the OECD release.",
  },
  {
    id: "pol",
    country: "Poland",
    iso3: "POL",
    shareLatestPct: 6.65,
    yearLatest: 2020,
    shareAround2010Pct: 10.09,
    yearAround2010: 2009,
    changePp: -3.44,
    socialDwellingsLatest: 1_020_659,
    socialDwellingsAround2010: 1_358_723,
    sizeBand: "small",
    trendBand: "sharp-decline",
    confidence: "disclosed",
  },
  {
    id: "svn",
    country: "Slovenia",
    iso3: "SVN",
    shareLatestPct: 4.67,
    yearLatest: 2018,
    shareAround2010Pct: 5.37,
    yearAround2010: 2011,
    changePp: -0.7,
    socialDwellingsLatest: 39_800,
    socialDwellingsAround2010: 45_400,
    sizeBand: "small",
    trendBand: "moderate-decline",
    confidence: "disclosed",
  },
  {
    id: "bel",
    country: "Belgium",
    iso3: "BEL",
    shareLatestPct: 4.17,
    yearLatest: 2018,
    shareAround2010Pct: 4.28,
    yearAround2010: 2010,
    changePp: -0.11,
    socialDwellingsLatest: 309_896,
    socialDwellingsAround2010: 295_309,
    sizeBand: "small",
    trendBand: "small-decline",
    confidence: "disclosed",
  },
  {
    id: "nor",
    country: "Norway",
    iso3: "NOR",
    shareLatestPct: 4.1,
    yearLatest: 2022,
    shareAround2010Pct: 4.61,
    yearAround2010: 2011,
    changePp: -0.51,
    socialDwellingsLatest: 110_531,
    socialDwellingsAround2010: 101_670,
    sizeBand: "small",
    trendBand: "moderate-decline",
    confidence: "disclosed",
    note: "Municipal stock only (~75% of social housing).",
  },
  {
    id: "nzl",
    country: "New Zealand",
    iso3: "NZL",
    shareLatestPct: 3.81,
    yearLatest: 2020,
    shareAround2010Pct: 3.93,
    yearAround2010: 2011,
    changePp: -0.12,
    socialDwellingsLatest: 73_520,
    socialDwellingsAround2010: 67_600,
    sizeBand: "small",
    trendBand: "small-decline",
    confidence: "disclosed",
    note: "Central-government funded places; excludes local-authority stock.",
  },
  {
    id: "usa",
    country: "United States",
    iso3: "USA",
    shareLatestPct: 3.62,
    yearLatest: 2019,
    shareAround2010Pct: 3.37,
    yearAround2010: 2010,
    changePp: 0.25,
    socialDwellingsLatest: 4_975_117,
    socialDwellingsAround2010: 4_458_614,
    sizeBand: "small",
    trendBand: "stable-or-up",
    confidence: "estimated",
    note: "Includes LIHTC; preliminary OECD correspondence with HUD.",
  },
  {
    id: "cze",
    country: "Czechia",
    iso3: "CZE",
    shareLatestPct: 3.62,
    yearLatest: 2021,
    shareAround2010Pct: null,
    yearAround2010: null,
    changePp: null,
    socialDwellingsLatest: 193_152,
    socialDwellingsAround2010: null,
    sizeBand: "small",
    trendBand: "no-pair",
    confidence: "disclosed",
    note: "Central-government dwellings only in Annex A1.",
  },
  {
    id: "can",
    country: "Canada",
    iso3: "CAN",
    shareLatestPct: 3.47,
    yearLatest: 2022,
    shareAround2010Pct: null,
    yearAround2010: null,
    changePp: null,
    socialDwellingsLatest: 565_420,
    socialDwellingsAround2010: null,
    sizeBand: "small",
    trendBand: "no-pair",
    confidence: "disclosed",
    note: "Excludes Québec SHQ-managed units.",
  },
  {
    id: "aus",
    country: "Australia",
    iso3: "AUS",
    shareLatestPct: 3.23,
    yearLatest: 2021,
    shareAround2010Pct: 4.42,
    yearAround2010: 2010,
    changePp: -1.19,
    socialDwellingsLatest: 352_142,
    socialDwellingsAround2010: 403_708,
    sizeBand: "small",
    trendBand: "moderate-decline",
    confidence: "disclosed",
  },
  {
    id: "jpn",
    country: "Japan",
    iso3: "JPN",
    shareLatestPct: 3.08,
    yearLatest: 2018,
    shareAround2010Pct: 3.23,
    yearAround2010: 2013,
    changePp: -0.15,
    socialDwellingsLatest: 1_922_300,
    socialDwellingsAround2010: 1_958_600,
    sizeBand: "small",
    trendBand: "small-decline",
    confidence: "disclosed",
  },
  {
    id: "hun",
    country: "Hungary",
    iso3: "HUN",
    shareLatestPct: 2.65,
    yearLatest: 2018,
    shareAround2010Pct: 3.0,
    yearAround2010: 2011,
    changePp: -0.35,
    socialDwellingsLatest: 117_930,
    socialDwellingsAround2010: 132_285,
    sizeBand: "small",
    trendBand: "moderate-decline",
    confidence: "disclosed",
  },
  {
    id: "deu",
    country: "Germany",
    iso3: "DEU",
    shareLatestPct: 2.56,
    yearLatest: 2021,
    shareAround2010Pct: 3.68,
    yearAround2010: 2011,
    changePp: -1.12,
    socialDwellingsLatest: 1_101_506,
    socialDwellingsAround2010: 1_490_700,
    sizeBand: "small",
    trendBand: "moderate-decline",
    confidence: "disclosed",
    note: "Time-limited social status; stock exits to market rent.",
  },
  {
    id: "svk",
    country: "Slovak Republic",
    iso3: "SVK",
    shareLatestPct: 2.5,
    yearLatest: 2021,
    shareAround2010Pct: 1.62,
    yearAround2010: 2011,
    changePp: 0.88,
    socialDwellingsLatest: 55_835,
    socialDwellingsAround2010: 32_239,
    sizeBand: "small",
    trendBand: "stable-or-up",
    confidence: "disclosed",
  },
  {
    id: "ita",
    country: "Italy",
    iso3: "ITA",
    shareLatestPct: 2.4,
    yearLatest: 2022,
    shareAround2010Pct: 4.2,
    yearAround2010: 2010,
    changePp: -1.8,
    socialDwellingsLatest: 850_000,
    socialDwellingsAround2010: null,
    sizeBand: "small",
    trendBand: "moderate-decline",
    confidence: "disclosed",
  },
  {
    id: "lva",
    country: "Latvia",
    iso3: "LVA",
    shareLatestPct: 1.89,
    yearLatest: 2016,
    shareAround2010Pct: null,
    yearAround2010: null,
    changePp: null,
    socialDwellingsLatest: 20_183,
    socialDwellingsAround2010: null,
    sizeBand: "minimal",
    trendBand: "no-pair",
    confidence: "disclosed",
  },
  {
    id: "isr",
    country: "Israel",
    iso3: "ISR",
    shareLatestPct: 1.77,
    yearLatest: 2023,
    shareAround2010Pct: null,
    yearAround2010: null,
    changePp: null,
    socialDwellingsLatest: 50_500,
    socialDwellingsAround2010: null,
    sizeBand: "minimal",
    trendBand: "no-pair",
    confidence: "disclosed",
  },
  {
    id: "esp",
    country: "Spain",
    iso3: "ESP",
    shareLatestPct: 1.13,
    yearLatest: 2019,
    shareAround2010Pct: null,
    yearAround2010: null,
    changePp: null,
    socialDwellingsLatest: 290_000,
    socialDwellingsAround2010: null,
    sizeBand: "minimal",
    trendBand: "no-pair",
    confidence: "disclosed",
    note: "May include employer-provided reduced-rent dwellings.",
  },
  {
    id: "est",
    country: "Estonia",
    iso3: "EST",
    shareLatestPct: 1.07,
    yearLatest: 2017,
    shareAround2010Pct: 1.12,
    yearAround2010: 2013,
    changePp: -0.05,
    socialDwellingsLatest: 7_496,
    socialDwellingsAround2010: 7_398,
    sizeBand: "minimal",
    trendBand: "small-decline",
    confidence: "disclosed",
  },
  {
    id: "prt",
    country: "Portugal",
    iso3: "PRT",
    shareLatestPct: 1.06,
    yearLatest: 2021,
    shareAround2010Pct: 2.02,
    yearAround2010: 2011,
    changePp: -0.96,
    socialDwellingsLatest: 63_217,
    socialDwellingsAround2010: 118_334,
    sizeBand: "minimal",
    trendBand: "moderate-decline",
    confidence: "disclosed",
  },
  {
    id: "ltu",
    country: "Lithuania",
    iso3: "LTU",
    shareLatestPct: 0.81,
    yearLatest: 2020,
    shareAround2010Pct: null,
    yearAround2010: null,
    changePp: null,
    socialDwellingsLatest: 12_024,
    socialDwellingsAround2010: null,
    sizeBand: "minimal",
    trendBand: "no-pair",
    confidence: "disclosed",
  },
  {
    id: "col",
    country: "Colombia",
    iso3: "COL",
    shareLatestPct: 0.006,
    yearLatest: 2019,
    shareAround2010Pct: null,
    yearAround2010: null,
    changePp: null,
    socialDwellingsLatest: 916,
    socialDwellingsAround2010: null,
    sizeBand: "minimal",
    trendBand: "no-pair",
    confidence: "disclosed",
    note: "Semillero de propietarios programme units since 2019 only.",
  },
];

export const AGGREGATE_SHARES = [
  {
    id: "oecd",
    label: "OECD average",
    sharePct: 7.07,
    sizeBand: "aggregate" as SizeBand,
  },
  {
    id: "eu",
    label: "EU average",
    sharePct: 7.99,
    sizeBand: "aggregate" as SizeBand,
  },
];

export type ProviderMixRow = {
  id: string;
  country: string;
  nationalPct: number;
  regionalPct: number;
  nonprofitPct: number;
  forProfitPct: number;
  otherPct: number;
};

/** Provider shares of the social stock (PH4.2.2), selected countries. */
export const PROVIDER_MIX: ProviderMixRow[] = [
  {
    id: "nld",
    country: "Netherlands",
    nationalPct: 0,
    regionalPct: 0,
    nonprofitPct: 82.1,
    forProfitPct: 17.9,
    otherPct: 0,
  },
  {
    id: "aut",
    country: "Austria",
    nationalPct: 2.7,
    regionalPct: 27.4,
    nonprofitPct: 60.7,
    forProfitPct: 9.1,
    otherPct: 0,
  },
  {
    id: "dnk",
    country: "Denmark",
    nationalPct: 34.7,
    regionalPct: 2.1,
    nonprofitPct: 32.6,
    forProfitPct: 0,
    otherPct: 30.5,
  },
  {
    id: "fra",
    country: "France",
    nationalPct: 0,
    regionalPct: 45.7,
    nonprofitPct: 53.4,
    forProfitPct: 0.9,
    otherPct: 0,
  },
  {
    id: "gbr",
    country: "United Kingdom (England)",
    nationalPct: 0,
    regionalPct: 38.2,
    nonprofitPct: 61.8,
    forProfitPct: 0,
    otherPct: 0,
  },
  {
    id: "fin",
    country: "Finland",
    nationalPct: 0.7,
    regionalPct: 75.7,
    nonprofitPct: 21.4,
    forProfitPct: 2.1,
    otherPct: 0,
  },
  {
    id: "usa",
    country: "United States",
    nationalPct: 0,
    regionalPct: 34.4,
    nonprofitPct: 6.0,
    forProfitPct: 59.6,
    otherPct: 0,
  },
  {
    id: "kor",
    country: "Korea",
    nationalPct: 67.7,
    regionalPct: 16.9,
    nonprofitPct: 0,
    forProfitPct: 12.4,
    otherPct: 0,
  },
  {
    id: "can",
    country: "Canada",
    nationalPct: 53.9,
    regionalPct: 0,
    nonprofitPct: 43.3,
    forProfitPct: 0,
    otherPct: 2.8,
  },
  {
    id: "aus",
    country: "Australia",
    nationalPct: 0,
    regionalPct: 70.9,
    nonprofitPct: 29.1,
    forProfitPct: 0,
    otherPct: 0,
  },
  {
    id: "irl",
    country: "Ireland",
    nationalPct: 0,
    regionalPct: 55.7,
    nonprofitPct: 12.2,
    forProfitPct: 32.0,
    otherPct: 0,
  },
  {
    id: "pol",
    country: "Poland",
    nationalPct: 2.9,
    regionalPct: 79.0,
    nonprofitPct: 10.5,
    forProfitPct: 0,
    otherPct: 7.6,
  },
];

export const TREND_SUMMARY = [
  {
    band: "sharp-decline" as TrendBand,
    label: "Decline > 2 pp",
    count: 3,
    examples: "Netherlands, Finland, Poland",
  },
  {
    band: "moderate-decline" as TrendBand,
    label: "Decline 0.25–2 pp",
    count: 10,
    examples: "Austria, Denmark, UK, Germany, Australia, Italy…",
  },
  {
    band: "small-decline" as TrendBand,
    label: "Decline < 0.25 pp",
    count: 5,
    examples: "Belgium, Ireland, Japan, New Zealand, Estonia",
  },
  {
    band: "stable-or-up" as TrendBand,
    label: "Stable or rising",
    count: 5,
    examples: "France, Iceland, Korea, Slovak Republic, United States",
  },
];

export function countriesWithTrendPair(): CountryStockRow[] {
  return COUNTRY_STOCK.filter((c) => c.changePp != null);
}

export function sortedByShare(
  rows: CountryStockRow[] = COUNTRY_STOCK,
): CountryStockRow[] {
  return [...rows].sort((a, b) => b.shareLatestPct - a.shareLatestPct);
}

export function sortedByDecline(
  rows: CountryStockRow[] = countriesWithTrendPair(),
): CountryStockRow[] {
  return [...rows].sort((a, b) => (a.changePp ?? 0) - (b.changePp ?? 0));
}

/** Re-export helpers for band filters used by the dashboard. */
export const SIZE_BAND_ORDER: SizeBand[] = [
  "large",
  "moderate",
  "small",
  "minimal",
];

/** Visible strings the smoke/QA harness waits for. */
export const VIZ_MARKERS = [
  "Social rental % of dwellings",
  "Share ladder",
  "Decade delta",
  "Provider mix",
  "Stock vs change",
] as const;
