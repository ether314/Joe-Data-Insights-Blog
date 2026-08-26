/**
 * Jail average daily population (ADP) versus national property-crime rates
 * after 2019.
 *
 * Core question: Did average daily jail population recover with property crime,
 * or stay structurally lower after 2020?
 *
 * Perimeter:
 * - BJS Jail Inmates statistical tables (ASJ / COJ): ADP, midyear confined,
 *   admissions, and jail incarceration rate, midyear 2015–2023.
 * - FBI UCR Summary Reporting System (SRS) property-crime rates through 2020;
 *   BJS/FBI NIBRS Estimation Program national property rates for 2022–2023
 *   (2021 national estimate withheld during the NIBRS transition).
 * - Offense mix (burglary / larceny / motor vehicle theft) from CIUS / NIBRS
 *   national estimates where disclosed.
 * - Vera Institute People in Jail and Prison series for urban–rural refill
 *   differentials (spot estimates, not a census).
 *
 * Headline: 2023 ADP of 664,800 sits ~10.4% below 2019 (741,900), while the
 * 2023 NIBRS-estimated property rate (2,015.2) is only ~4.5% below the 2019
 * SRS rate (2,109.9). Jail ADP recovered partway from its 2021 trough but did
 * not re-lock to the property index.
 */

export type Confidence = "disclosed" | "estimated" | "scenario";

export const SOURCE_NOTE =
  "Jail ADP, midyear confined population, admissions, and incarceration rates: Bureau of Justice Statistics, Jail Inmates in 2023 – Statistical Tables (and prior years in the series), based on the Annual Survey of Jails and 2019 Census of Jails. Property-crime rates 2015–2020: FBI UCR Summary Reporting System estimates (Crime in the United States). Property rates 2022–2023: BJS/FBI NIBRS Estimation Program (Crime Known to Law Enforcement, 2023). 2021 national property estimate is omitted (NIBRS transition coverage insufficient). Motor vehicle theft and burglary sub-rates: FBI CIUS / NIBRS national estimates as republished in BJS and FBI releases. Urban–rural jail refill: Vera Institute of Justice, People in Jail and Prison (2020–2024). Methodology break between SRS and NIBRS Estimation means level comparisons across 2020→2022 are approximate; index charts use 2019=100 within each disclosed series.";

export const SOURCES = [
  {
    label: "BJS — Jail Inmates in 2023 Statistical Tables",
    url: "https://bjs.ojp.gov/library/publications/jail-inmates-2023-statistical-tables",
  },
  {
    label: "BJS — Jail Inmates in 2022 Statistical Tables (PDF)",
    url: "https://bjs.ojp.gov/document/ji22st.pdf",
  },
  {
    label: "BJS — Jail Inmates in 2020 Statistical Tables (PDF)",
    url: "https://bjs.ojp.gov/content/pub/pdf/ji20st.pdf",
  },
  {
    label: "FBI — Crime in the United States 2019 (property crime)",
    url: "https://ucr.fbi.gov/crime-in-the-u.s/2019/crime-in-the-u.s.-2019/topic-pages/property-crime",
  },
  {
    label: "FBI — 2020 Crime Statistics press release",
    url: "https://www.fbi.gov/news/press-releases/fbi-releases-2020-crime-statistics",
  },
  {
    label: "BJS/FBI — Crime Known to Law Enforcement, 2023 (NIBRS Estimation)",
    url: "https://www.ojp.gov/library/publications/crime-known-law-enforcement-2023",
  },
  {
    label: "Vera Institute — People in Jail and Prison in 2022",
    url: "https://www.vera.org/publications/people-in-jail-and-prison-in-2022",
  },
  {
    label: "Vera Institute — People in Jail and Prison (2024 report PDF)",
    url: "https://vera-institute.files.svdcdn.com/production/downloads/publications/People-in-Jail-and-Prison-in-2024-Full-Reportpdf.pdf",
  },
] as const;

export const HEADLINE = {
  adp2019: 741_900,
  adp2021Trough: 618_600,
  adp2023: 664_800,
  adpPctOf2019_2023: 89.6,
  adpShortfallVs2019Pct: 10.4,
  midyear2019: 734_500,
  midyear2020Cliff: 549_100,
  midyear2023: 664_200,
  propertyRate2019: 2109.9,
  propertyRate2020: 1958.2,
  propertyRate2022: 2085.6,
  propertyRate2023: 2015.2,
  propertyPctOf2019_2023: 95.5,
  propertyShortfallVs2019Pct: 4.5,
  /** ADP index minus property index at 2023 (percentage points of 2019 baseline) */
  recoveryGapPp2023: -5.9,
  admissions2019: 10_323_000,
  admissions2023: 7_627_000,
  admissionsPctOf2019_2023: 73.9,
  confidence: "disclosed" as Confidence,
};

export type DualIndexRow = {
  year: number;
  adp: number;
  midyearConfined: number;
  jailRatePer100k: number;
  admissions: number;
  /** Index of ADP vs 2019 (=100) */
  adpIndex: number;
  /** Index of midyear confined vs 2019 */
  midyearIndex: number;
  /** Property rate per 100k when disclosed; null for 2021 */
  propertyRate: number | null;
  /** Index of property rate vs 2019 when disclosed */
  propertyIndex: number | null;
  propertySource: "srs" | "nibrs-est" | "gap";
  confidence: Confidence;
};

/** BJS Display 1 (JI 2023) + FBI SRS / NIBRS Estimation property rates. */
export const DUAL_INDEX: DualIndexRow[] = [
  {
    year: 2015,
    adp: 719_500,
    midyearConfined: 727_400,
    jailRatePer100k: 227,
    admissions: 10_684_000,
    adpIndex: 97.0,
    midyearIndex: 99.0,
    propertyRate: 2500.5,
    propertyIndex: 118.5,
    propertySource: "srs",
    confidence: "disclosed",
  },
  {
    year: 2016,
    adp: 731_300,
    midyearConfined: 740_700,
    jailRatePer100k: 229,
    admissions: 10_630_000,
    adpIndex: 98.6,
    midyearIndex: 100.8,
    propertyRate: 2371.3,
    propertyIndex: 112.4,
    propertySource: "srs",
    confidence: "disclosed",
  },
  {
    year: 2017,
    adp: 745_600,
    midyearConfined: 745_200,
    jailRatePer100k: 229,
    admissions: 10_570_000,
    adpIndex: 100.5,
    midyearIndex: 101.5,
    propertyRate: 2362.9,
    propertyIndex: 112.0,
    propertySource: "srs",
    confidence: "disclosed",
  },
  {
    year: 2018,
    adp: 737_900,
    midyearConfined: 738_400,
    jailRatePer100k: 226,
    admissions: 10_675_000,
    adpIndex: 99.5,
    midyearIndex: 100.5,
    propertyRate: 2209.8,
    propertyIndex: 104.7,
    propertySource: "srs",
    confidence: "disclosed",
  },
  {
    year: 2019,
    adp: 741_900,
    midyearConfined: 734_500,
    jailRatePer100k: 224,
    admissions: 10_323_000,
    adpIndex: 100,
    midyearIndex: 100,
    propertyRate: 2109.9,
    propertyIndex: 100,
    propertySource: "srs",
    confidence: "disclosed",
  },
  {
    year: 2020,
    adp: 658_200,
    midyearConfined: 549_100,
    jailRatePer100k: 166,
    admissions: 8_653_000,
    adpIndex: 88.7,
    midyearIndex: 74.8,
    propertyRate: 1958.2,
    propertyIndex: 92.8,
    propertySource: "srs",
    confidence: "disclosed",
  },
  {
    year: 2021,
    adp: 618_600,
    midyearConfined: 636_300,
    jailRatePer100k: 192,
    admissions: 6_875_000,
    adpIndex: 83.4,
    midyearIndex: 86.6,
    propertyRate: null,
    propertyIndex: null,
    propertySource: "gap",
    confidence: "disclosed",
  },
  {
    year: 2022,
    adp: 652_500,
    midyearConfined: 663_100,
    jailRatePer100k: 199,
    admissions: 7_331_000,
    adpIndex: 88.0,
    midyearIndex: 90.3,
    propertyRate: 2085.6,
    propertyIndex: 98.8,
    propertySource: "nibrs-est",
    confidence: "estimated",
  },
  {
    year: 2023,
    adp: 664_800,
    midyearConfined: 664_200,
    jailRatePer100k: 198,
    admissions: 7_627_000,
    adpIndex: 89.6,
    midyearIndex: 90.4,
    propertyRate: 2015.2,
    propertyIndex: 95.5,
    propertySource: "nibrs-est",
    confidence: "estimated",
  },
];

export type OffenseMixRow = {
  year: number;
  burglaryRate: number;
  larcenyRate: number;
  mvtRate: number;
  propertyRate: number;
  source: "srs" | "nibrs-est";
  confidence: Confidence;
};

/** Property offense mix — rates per 100,000. */
export const OFFENSE_MIX: OffenseMixRow[] = [
  {
    year: 2018,
    burglaryRate: 376.0,
    larcenyRate: 1594.6,
    mvtRate: 239.2,
    propertyRate: 2209.8,
    source: "srs",
    confidence: "disclosed",
  },
  {
    year: 2019,
    burglaryRate: 340.5,
    larcenyRate: 1549.5,
    mvtRate: 219.9,
    propertyRate: 2109.9,
    source: "srs",
    confidence: "disclosed",
  },
  {
    year: 2020,
    burglaryRate: 314.2,
    larcenyRate: 1398.0,
    mvtRate: 246.0,
    propertyRate: 1958.2,
    source: "srs",
    confidence: "disclosed",
  },
  {
    year: 2022,
    burglaryRate: 269.8,
    larcenyRate: 1401.9,
    mvtRate: 282.7,
    propertyRate: 2085.6,
    source: "nibrs-est",
    confidence: "estimated",
  },
  {
    year: 2023,
    burglaryRate: 250.7,
    larcenyRate: 1348.0,
    mvtRate: 283.9,
    propertyRate: 2015.2,
    source: "nibrs-est",
    confidence: "estimated",
  },
];

export type ShortfallRow = {
  year: number;
  label: string;
  adpShortfallPct: number;
  propertyShortfallPct: number | null;
  admissionsShortfallPct: number;
};

/** Percent short of 2019 baseline (positive = still below 2019). */
export const SHORTFALL_VS_2019: ShortfallRow[] = DUAL_INDEX.filter(
  (r) => r.year >= 2019,
).map((r) => ({
  year: r.year,
  label: String(r.year),
  adpShortfallPct: Number((100 - r.adpIndex).toFixed(1)),
  propertyShortfallPct:
    r.propertyIndex == null
      ? null
      : Number((100 - r.propertyIndex).toFixed(1)),
  admissionsShortfallPct: Number(
    (100 - (r.admissions / HEADLINE.admissions2019) * 100).toFixed(1),
  ),
}));

export type GeographyRefillRow = {
  segment: string;
  /** Approximate % change mid-2019 → mid-2020 (Vera) */
  drop2019to2020Pct: number;
  /** Approximate % of 2019 level by fall 2022 / spring 2024 window */
  recoveryShareOf2019: number;
  note: string;
  confidence: Confidence;
};

/**
 * Vera urban–rural differentials (rounded from People in Jail reports).
 * National BJS ADP remains the census-grade series; these are directional.
 */
export const GEOGRAPHY_REFILL: GeographyRefillRow[] = [
  {
    segment: "Large urban",
    drop2019to2020Pct: -28,
    recoveryShareOf2019: 88,
    note: "Steep early drop; refill incomplete vs 2019",
    confidence: "estimated",
  },
  {
    segment: "Suburban",
    drop2019to2020Pct: -22,
    recoveryShareOf2019: 92,
    note: "Partial refill; still below pre-pandemic",
    confidence: "estimated",
  },
  {
    segment: "Small metro",
    drop2019to2020Pct: -20,
    recoveryShareOf2019: 96,
    note: "Closer to prior peak than big cities",
    confidence: "estimated",
  },
  {
    segment: "Rural",
    drop2019to2020Pct: -18,
    recoveryShareOf2019: 102,
    note: "Vera: rural jails nearest or above prior peak",
    confidence: "estimated",
  },
  {
    segment: "National (BJS ADP)",
    drop2019to2020Pct: -11.3,
    recoveryShareOf2019: 89.6,
    note: "ADP path; midyear confined dropped harder in 2020",
    confidence: "disclosed",
  },
];

export type FlowRow = {
  year: number;
  admissionsM: number;
  adpK: number;
  /** Implied average length of stay proxy: ADP / (admissions/365) */
  avgDaysProxy: number;
};

export const FLOW_PROXY: FlowRow[] = DUAL_INDEX.map((r) => ({
  year: r.year,
  admissionsM: Number((r.admissions / 1_000_000).toFixed(2)),
  adpK: Number((r.adp / 1000).toFixed(1)),
  avgDaysProxy: Number(((r.adp / r.admissions) * 365).toFixed(1)),
}));

export const ANALYTICS = {
  baselineYear: 2019,
  troughYear: 2021,
  latestYear: 2023,
  adpRecoveredFromTroughPct: Number(
    (
      ((HEADLINE.adp2023 - HEADLINE.adp2021Trough) /
        (HEADLINE.adp2019 - HEADLINE.adp2021Trough)) *
      100
    ).toFixed(1),
  ),
  midyearCliffPct2020: 25.2,
  mvtIndexVs2019_2023: Number(
    ((283.9 / 219.9) * 100).toFixed(1),
  ),
  burglaryIndexVs2019_2023: Number(((250.7 / 340.5) * 100).toFixed(1)),
};

export type SeriesFilter = "all" | "post2019" | "recovery";
export type GeographyFilter = "all" | "urban-lean" | "rural-lean";

export function filterDualIndex(mode: SeriesFilter): DualIndexRow[] {
  if (mode === "post2019") return DUAL_INDEX.filter((r) => r.year >= 2019);
  if (mode === "recovery") return DUAL_INDEX.filter((r) => r.year >= 2020);
  return DUAL_INDEX;
}

export function filterGeography(mode: GeographyFilter): GeographyRefillRow[] {
  if (mode === "urban-lean")
    return GEOGRAPHY_REFILL.filter((r) =>
      ["Large urban", "Suburban", "National (BJS ADP)"].includes(r.segment),
    );
  if (mode === "rural-lean")
    return GEOGRAPHY_REFILL.filter((r) =>
      ["Small metro", "Rural", "National (BJS ADP)"].includes(r.segment),
    );
  return GEOGRAPHY_REFILL;
}
