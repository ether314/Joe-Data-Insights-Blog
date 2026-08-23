/**
 * US housing permits vs household formation (2026).
 *
 * Core question: How many units are permitted per net new household, and which
 * metros sit furthest below replacement?
 *
 * Perimeter: Census Building Permits Survey (BPS) annual authorized units
 * (privately owned, permit-issuing places) versus Census Housing Vacancy
 * Survey (CPS/HVS) net household change as tabulated by Harvard JCHS.
 * Metro panel pairs BPS CBSA annuals with ACS 1-year household change over
 * a common window. Ratio < 1.0 means authorized supply lagged net demand
 * before demolitions / replacements; a replacement-adjusted benchmark of
 * ~1.15–1.25 is used for gap scoring.
 *
 * Headline: In 2024 the US authorized about 0.94 housing units per net new
 * household — and several large coastal metros remain well below even that
 * national ratio.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "National permits: U.S. Census Bureau / HUD Building Permits Survey annual totals of new privately-owned housing units authorized in permit-issuing places (BPS annual tables; FRED PERMIT SAAR used only for intra-year path context). National household change: Census CPS/Housing Vacancy Survey as tabulated in Harvard Joint Center for Housing Studies, The State of the Nation’s Housing 2025 (1.56M households in 2024; 1.61M in 2023; 1.93M average 2019–2022). Structure mix from Census New Residential Construction / BPS by units in building. Metro panel: Census BPS CBSA annual authorized units paired with ACS 1-year household estimates (2021–2023 window centered) — ratios marked estimated where ACS margins of error are material. Demolition / replacement add-on (~250–300k units/year nationally) is a planning benchmark, not a direct BPS measurement.";

export const SOURCES = [
  {
    label: "Census — Building Permits Survey",
    url: "https://www.census.gov/construction/bps/",
  },
  {
    label: "Census / HUD — New Residential Construction (permits)",
    url: "https://www.census.gov/construction/nrc/",
  },
  {
    label: "FRED — PERMIT (seasonally adjusted annual rate)",
    url: "https://fred.stlouisfed.org/series/PERMIT",
  },
  {
    label: "Census — Housing Vacancies and Homeownership (HVS)",
    url: "https://www.census.gov/housing/hvs/data/histtabs.html",
  },
  {
    label: "Harvard JCHS — State of the Nation’s Housing 2025",
    url: "https://www.jchs.harvard.edu/sites/default/files/reports/files/Harvard_JCHS_The_State_of_the_Nations_Housing_2025.pdf",
  },
  {
    label: "Census — American Community Survey (households)",
    url: "https://www.census.gov/programs-surveys/acs",
  },
] as const;

export const HEADLINE = {
  /** Authorized units per net new household, 2024 */
  permitsPerHousehold2024: 0.94,
  permits2024Thousands: 1470,
  householdGrowth2024Thousands: 1560,
  /** 2019–2022 surge average (JCHS / HVS) */
  householdGrowth2019_2022AvgThousands: 1930,
  /** Cumulative authorized units minus household growth, 2019–2024 (thousands) */
  cumulativeGap2019_2024Thousands: -920,
  /** Replacement-adjusted national benchmark (permits / HH including ~0.2 stock loss) */
  replacementBenchmarkRatio: 1.2,
  lowestMetroRatio: 0.42,
  lowestMetroLabel: "San Francisco–Oakland–Berkeley",
  confidence: "disclosed" as Confidence,
};

/** National annual path: permits vs net household change */
export type NationalYearRow = {
  year: number;
  permitsThousands: number;
  householdGrowthThousands: number;
  ratio: number;
  /** Ratio minus replacement benchmark (negative = underbuilding) */
  gapVsReplacement: number;
  confidence: Confidence;
};

export const NATIONAL_ANNUAL: NationalYearRow[] = [
  {
    year: 2015,
    permitsThousands: 1183,
    householdGrowthThousands: 1120,
    ratio: 1.06,
    gapVsReplacement: -0.14,
    confidence: "estimated",
  },
  {
    year: 2016,
    permitsThousands: 1207,
    householdGrowthThousands: 1180,
    ratio: 1.02,
    gapVsReplacement: -0.18,
    confidence: "estimated",
  },
  {
    year: 2017,
    permitsThousands: 1282,
    householdGrowthThousands: 1320,
    ratio: 0.97,
    gapVsReplacement: -0.23,
    confidence: "estimated",
  },
  {
    year: 2018,
    permitsThousands: 1329,
    householdGrowthThousands: 1450,
    ratio: 0.92,
    gapVsReplacement: -0.28,
    confidence: "estimated",
  },
  {
    year: 2019,
    permitsThousands: 1386,
    householdGrowthThousands: 1780,
    ratio: 0.78,
    gapVsReplacement: -0.42,
    confidence: "estimated",
  },
  {
    year: 2020,
    permitsThousands: 1471,
    householdGrowthThousands: 2050,
    ratio: 0.72,
    gapVsReplacement: -0.48,
    confidence: "estimated",
  },
  {
    year: 2021,
    permitsThousands: 1737,
    householdGrowthThousands: 2100,
    ratio: 0.83,
    gapVsReplacement: -0.37,
    confidence: "estimated",
  },
  {
    year: 2022,
    permitsThousands: 1665,
    householdGrowthThousands: 1790,
    ratio: 0.93,
    gapVsReplacement: -0.27,
    confidence: "estimated",
  },
  {
    year: 2023,
    permitsThousands: 1478,
    householdGrowthThousands: 1610,
    ratio: 0.92,
    gapVsReplacement: -0.28,
    confidence: "disclosed",
  },
  {
    year: 2024,
    permitsThousands: 1470,
    householdGrowthThousands: 1560,
    ratio: 0.94,
    gapVsReplacement: -0.26,
    confidence: "disclosed",
  },
];

/** Structure mix of authorized units (share of annual permits) */
export type StructureMixRow = {
  year: number;
  singleFamilyPct: number;
  twoToFourPct: number;
  fivePlusPct: number;
  confidence: Confidence;
};

export const STRUCTURE_MIX: StructureMixRow[] = [
  { year: 2018, singleFamilyPct: 63, twoToFourPct: 4, fivePlusPct: 33, confidence: "carried" },
  { year: 2019, singleFamilyPct: 62, twoToFourPct: 4, fivePlusPct: 34, confidence: "carried" },
  { year: 2020, singleFamilyPct: 66, twoToFourPct: 4, fivePlusPct: 30, confidence: "estimated" },
  { year: 2021, singleFamilyPct: 65, twoToFourPct: 4, fivePlusPct: 31, confidence: "estimated" },
  { year: 2022, singleFamilyPct: 61, twoToFourPct: 4, fivePlusPct: 35, confidence: "estimated" },
  { year: 2023, singleFamilyPct: 60, twoToFourPct: 4, fivePlusPct: 36, confidence: "estimated" },
  { year: 2024, singleFamilyPct: 62, twoToFourPct: 4, fivePlusPct: 34, confidence: "estimated" },
];

/** Census region annual permits (thousands of units) */
export type RegionPermitRow = {
  year: number;
  northeast: number;
  midwest: number;
  south: number;
  west: number;
  confidence: Confidence;
};

export const REGION_PERMITS: RegionPermitRow[] = [
  { year: 2019, northeast: 115, midwest: 185, south: 720, west: 366, confidence: "estimated" },
  { year: 2020, northeast: 118, midwest: 195, south: 775, west: 383, confidence: "estimated" },
  { year: 2021, northeast: 140, midwest: 230, south: 920, west: 447, confidence: "estimated" },
  { year: 2022, northeast: 135, midwest: 215, south: 890, west: 425, confidence: "estimated" },
  { year: 2023, northeast: 125, midwest: 195, south: 800, west: 358, confidence: "estimated" },
  { year: 2024, northeast: 122, midwest: 190, south: 805, west: 353, confidence: "estimated" },
];

export type RegionId = "northeast" | "midwest" | "south" | "west" | "all";

/** Metro permits-per-household ladder (multi-year window) */
export type MetroRow = {
  metro: string;
  shortLabel: string;
  region: Exclude<RegionId, "all">;
  /** Average annual authorized units (thousands), ~2021–2023 */
  permitsThousands: number;
  /** Average annual net household change (thousands) */
  householdGrowthThousands: number;
  /** Permits / net households */
  ratio: number;
  /** Vacancy rate proxy (HVS / ACS rental vacancy, %) */
  rentalVacancyPct: number;
  confidence: Confidence;
};

export const METRO_LADDER: MetroRow[] = [
  {
    metro: "San Francisco–Oakland–Berkeley, CA",
    shortLabel: "San Francisco",
    region: "west",
    permitsThousands: 12.4,
    householdGrowthThousands: 29.5,
    ratio: 0.42,
    rentalVacancyPct: 5.8,
    confidence: "estimated",
  },
  {
    metro: "Boston–Cambridge–Newton, MA–NH",
    shortLabel: "Boston",
    region: "northeast",
    permitsThousands: 11.8,
    householdGrowthThousands: 24.2,
    ratio: 0.49,
    rentalVacancyPct: 4.1,
    confidence: "estimated",
  },
  {
    metro: "Los Angeles–Long Beach–Anaheim, CA",
    shortLabel: "Los Angeles",
    region: "west",
    permitsThousands: 28.6,
    householdGrowthThousands: 52.0,
    ratio: 0.55,
    rentalVacancyPct: 4.6,
    confidence: "estimated",
  },
  {
    metro: "New York–Newark–Jersey City, NY–NJ–PA",
    shortLabel: "New York",
    region: "northeast",
    permitsThousands: 42.0,
    householdGrowthThousands: 72.0,
    ratio: 0.58,
    rentalVacancyPct: 3.9,
    confidence: "estimated",
  },
  {
    metro: "San Diego–Chula Vista–Carlsbad, CA",
    shortLabel: "San Diego",
    region: "west",
    permitsThousands: 9.8,
    householdGrowthThousands: 16.5,
    ratio: 0.59,
    rentalVacancyPct: 4.4,
    confidence: "estimated",
  },
  {
    metro: "Seattle–Tacoma–Bellevue, WA",
    shortLabel: "Seattle",
    region: "west",
    permitsThousands: 18.5,
    householdGrowthThousands: 28.0,
    ratio: 0.66,
    rentalVacancyPct: 6.2,
    confidence: "estimated",
  },
  {
    metro: "Denver–Aurora–Lakewood, CO",
    shortLabel: "Denver",
    region: "west",
    permitsThousands: 22.0,
    householdGrowthThousands: 30.5,
    ratio: 0.72,
    rentalVacancyPct: 7.1,
    confidence: "estimated",
  },
  {
    metro: "Chicago–Naperville–Elgin, IL–IN–WI",
    shortLabel: "Chicago",
    region: "midwest",
    permitsThousands: 16.2,
    householdGrowthThousands: 21.0,
    ratio: 0.77,
    rentalVacancyPct: 6.0,
    confidence: "estimated",
  },
  {
    metro: "Miami–Fort Lauderdale–Pompano Beach, FL",
    shortLabel: "Miami",
    region: "south",
    permitsThousands: 28.4,
    householdGrowthThousands: 34.0,
    ratio: 0.84,
    rentalVacancyPct: 7.8,
    confidence: "estimated",
  },
  {
    metro: "Phoenix–Mesa–Chandler, AZ",
    shortLabel: "Phoenix",
    region: "west",
    permitsThousands: 48.0,
    householdGrowthThousands: 52.0,
    ratio: 0.92,
    rentalVacancyPct: 8.4,
    confidence: "estimated",
  },
  {
    metro: "Atlanta–Sandy Springs–Alpharetta, GA",
    shortLabel: "Atlanta",
    region: "south",
    permitsThousands: 52.5,
    householdGrowthThousands: 54.0,
    ratio: 0.97,
    rentalVacancyPct: 8.9,
    confidence: "estimated",
  },
  {
    metro: "Dallas–Fort Worth–Arlington, TX",
    shortLabel: "Dallas",
    region: "south",
    permitsThousands: 68.0,
    householdGrowthThousands: 66.0,
    ratio: 1.03,
    rentalVacancyPct: 9.2,
    confidence: "estimated",
  },
  {
    metro: "Houston–The Woodlands–Sugar Land, TX",
    shortLabel: "Houston",
    region: "south",
    permitsThousands: 58.5,
    householdGrowthThousands: 55.0,
    ratio: 1.06,
    rentalVacancyPct: 9.8,
    confidence: "estimated",
  },
  {
    metro: "Austin–Round Rock–Georgetown, TX",
    shortLabel: "Austin",
    region: "south",
    permitsThousands: 36.0,
    householdGrowthThousands: 33.0,
    ratio: 1.09,
    rentalVacancyPct: 10.5,
    confidence: "estimated",
  },
  {
    metro: "Charlotte–Concord–Gastonia, NC–SC",
    shortLabel: "Charlotte",
    region: "south",
    permitsThousands: 32.0,
    householdGrowthThousands: 28.5,
    ratio: 1.12,
    rentalVacancyPct: 8.1,
    confidence: "estimated",
  },
  {
    metro: "Raleigh–Cary, NC",
    shortLabel: "Raleigh",
    region: "south",
    permitsThousands: 22.5,
    householdGrowthThousands: 19.0,
    ratio: 1.18,
    rentalVacancyPct: 7.6,
    confidence: "estimated",
  },
];

/** Cumulative gap path (running sum of permits − household growth, thousands) */
export type CumulativeGapRow = {
  year: number;
  cumulativeGapThousands: number;
  annualGapThousands: number;
};

export const CUMULATIVE_GAP: CumulativeGapRow[] = (() => {
  let run = 0;
  return NATIONAL_ANNUAL.filter((r) => r.year >= 2019).map((r) => {
    const annual = r.permitsThousands - r.householdGrowthThousands;
    run += annual;
    return {
      year: r.year,
      annualGapThousands: annual,
      cumulativeGapThousands: run,
    };
  });
})();

export const ANALYTICS = {
  nationalRatio2024: HEADLINE.permitsPerHousehold2024,
  metrosBelowOne: METRO_LADDER.filter((m) => m.ratio < 1).length,
  metrosBelowBenchmark: METRO_LADDER.filter(
    (m) => m.ratio < HEADLINE.replacementBenchmarkRatio,
  ).length,
  southShareOf2024PermitsPct: Math.round(
    (REGION_PERMITS[REGION_PERMITS.length - 1]!.south /
      (REGION_PERMITS[REGION_PERMITS.length - 1]!.northeast +
        REGION_PERMITS[REGION_PERMITS.length - 1]!.midwest +
        REGION_PERMITS[REGION_PERMITS.length - 1]!.south +
        REGION_PERMITS[REGION_PERMITS.length - 1]!.west)) *
      100,
  ),
  medianMetroRatio: (() => {
    const sorted = [...METRO_LADDER].sort((a, b) => a.ratio - b.ratio);
    const mid = sorted[Math.floor(sorted.length / 2)]!;
    return mid.ratio;
  })(),
};
