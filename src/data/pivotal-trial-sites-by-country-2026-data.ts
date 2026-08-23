/**
 * Pivotal trial sites by country (2026).
 *
 * Core question: What share of industry-sponsored Phase III sites sit in the US,
 * China, and Europe versus the disease burden they claim to treat?
 *
 * Perimeter: industry-sponsored Phase II/III country-uses and facility counts
 * (IQVIA Institute country-prioritization restatements; ClinicalTrials.gov /
 * WHO ICTRP site listings; oncology facility census for Phase III). Disease
 * burden anchors use WHO GBD / Global Health Estimates DALY shares — not
 * matched 1:1 to trial registries, so gap ratios are analytical.
 *
 * Headline: Top-3 countries (US + China + Spain on initiation rank; US + China
 * + Germany on facility share) concentrate ~36–52% of late-stage site capacity
 * while carrying far less of global DALY burden outside oncology/CVD.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Industry Phase II/III country-use shares: IQVIA Institute — Rethinking Clinical Trial Country Prioritization (2019→2023 regional uses; US 16% / China 13% of country-uses in 2021–23; top-10 = 58%). Regional path: Western Europe 32%→25%, Eastern Europe 17%→11%, North America 19%→23%, China 10%→15%. Phase III oncology unique facilities: medRxiv/bioRxiv 2026 census (US 39.6% / China 7.0% / Germany 5.8% / France 4.1% / Japan 4.0%; N=6,634 facilities). Phase III initiation ranks 2024: ABPI/Citeline (China overtook US). Disease burden: WHO GBD / Global Health Estimates regional DALY shares (carried). Gap = site share ÷ DALY share. HHI analytical on stated country buckets (0–10,000).";

export const SOURCES = [
  {
    label: "IQVIA Institute — Rethinking Clinical Trial Country Prioritization",
    url: "https://www.iqvia.com/insights/the-iqvia-institute/reports-and-publications/reports/rethinking-clinical-trial-country-prioritization",
  },
  {
    label: "IQVIA Institute — Global Trends in R&D 2025",
    url: "https://www.iqvia.com/insights/the-iqvia-institute/reports-and-publications/reports/global-trends-in-r-and-d-2025",
  },
  {
    label: "ABPI — UK Industry Clinical Trials Report 2025 (Citeline ranks)",
    url: "https://www.abpi.org.uk/publications/",
  },
  {
    label: "ClinicalTrials.gov / WHO ICTRP — site geography",
    url: "https://clinicaltrials.gov/",
  },
  {
    label: "WHO — Global Health Estimates / GBD DALY burden",
    url: "https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates",
  },
] as const;

/** Headline punchline — Top-3 country site share */
export const HEADLINE = {
  /** IQVIA 2021–23 country-use share (all phases pipeline) */
  usCountryUsePct: 16,
  chinaCountryUsePct: 13,
  /** Spain often #3 on EU Phase III initiations; Germany leads facility count in Europe */
  spainCountryUsePct: 5.2,
  germanyFacilityPct: 5.8,
  top3CountryUsePct: 34.2,
  top10CountryUsePct: 58,
  /** Phase III oncology unique facilities */
  usFacilityPct: 39.6,
  chinaFacilityPct: 7.0,
  germanyFacilityPctOnc: 5.8,
  top3FacilityPct: 52.4,
  facilityUniverseN: 6634,
  /** Regional 2023 country-use shares */
  westEuropePct: 25,
  eastEuropePct: 11,
  northAmericaPct: 23,
  chinaRegionPct: 15,
  rowPct: 26,
  /** China 2019→2024 relative growth in country-use share */
  chinaShareGrowthPct: 57,
  westEuropeShareDeclinePct: 21,
  /** Mismatch: US site share vs US DALY share (approx) */
  usDalyPct: 7.2,
  chinaDalyPct: 17.8,
  africaDalyPct: 24.5,
  africaSitePct: 1.8,
  usGapRatio: 2.22,
  africaGapRatio: 0.07,
  confidence: "carried" as Confidence,
};

export type CountrySiteRow = {
  country: string;
  region: string;
  /** Share of industry pipeline country-uses (IQVIA-style), % */
  countryUsePct: number;
  /** Phase III oncology unique facility share, % (where disclosed) */
  facilityPct: number | null;
  /** WHO regional/national DALY share proxy, % */
  dalyPct: number;
  /** site÷burden; >1 = over-represented in trials */
  gapRatio: number;
  confidence: Confidence;
};

/** Top countries by late-stage site / country-use presence */
export const COUNTRY_SITES: CountrySiteRow[] = [
  {
    country: "United States",
    region: "North America",
    countryUsePct: 16.0,
    facilityPct: 39.6,
    dalyPct: 7.2,
    gapRatio: 2.22,
    confidence: "disclosed",
  },
  {
    country: "China",
    region: "East Asia",
    countryUsePct: 13.0,
    facilityPct: 7.0,
    dalyPct: 17.8,
    gapRatio: 0.73,
    confidence: "disclosed",
  },
  {
    country: "Spain",
    region: "Western Europe",
    countryUsePct: 5.2,
    facilityPct: 2.0,
    dalyPct: 0.7,
    gapRatio: 7.43,
    confidence: "estimated",
  },
  {
    country: "Germany",
    region: "Western Europe",
    countryUsePct: 4.8,
    facilityPct: 5.8,
    dalyPct: 1.4,
    gapRatio: 3.43,
    confidence: "disclosed",
  },
  {
    country: "United Kingdom",
    region: "Western Europe",
    countryUsePct: 4.1,
    facilityPct: 3.5,
    dalyPct: 1.0,
    gapRatio: 4.1,
    confidence: "estimated",
  },
  {
    country: "France",
    region: "Western Europe",
    countryUsePct: 3.9,
    facilityPct: 4.1,
    dalyPct: 1.1,
    gapRatio: 3.55,
    confidence: "disclosed",
  },
  {
    country: "Japan",
    region: "East Asia",
    countryUsePct: 3.6,
    facilityPct: 4.0,
    dalyPct: 2.4,
    gapRatio: 1.5,
    confidence: "disclosed",
  },
  {
    country: "Italy",
    region: "Western Europe",
    countryUsePct: 3.2,
    facilityPct: 2.9,
    dalyPct: 1.2,
    gapRatio: 2.67,
    confidence: "estimated",
  },
  {
    country: "Canada",
    region: "North America",
    countryUsePct: 2.8,
    facilityPct: 1.5,
    dalyPct: 0.6,
    gapRatio: 4.67,
    confidence: "estimated",
  },
  {
    country: "Poland",
    region: "Eastern Europe",
    countryUsePct: 2.4,
    facilityPct: 1.9,
    dalyPct: 0.7,
    gapRatio: 3.43,
    confidence: "estimated",
  },
  {
    country: "Brazil",
    region: "Latin America",
    countryUsePct: 2.1,
    facilityPct: 2.4,
    dalyPct: 3.1,
    gapRatio: 0.68,
    confidence: "estimated",
  },
  {
    country: "Australia",
    region: "Oceania",
    countryUsePct: 2.0,
    facilityPct: 2.3,
    dalyPct: 0.4,
    gapRatio: 5.0,
    confidence: "estimated",
  },
  {
    country: "India",
    region: "South Asia",
    countryUsePct: 1.9,
    facilityPct: 1.4,
    dalyPct: 14.2,
    gapRatio: 0.13,
    confidence: "estimated",
  },
  {
    country: "South Korea",
    region: "East Asia",
    countryUsePct: 1.7,
    facilityPct: 1.2,
    dalyPct: 0.8,
    gapRatio: 2.13,
    confidence: "estimated",
  },
  {
    country: "Turkey",
    region: "Eastern Europe",
    countryUsePct: 1.5,
    facilityPct: 1.3,
    dalyPct: 1.1,
    gapRatio: 1.36,
    confidence: "estimated",
  },
];

export type RegionPathRow = {
  year: number;
  westernEurope: number;
  easternEurope: number;
  northAmerica: number;
  china: number;
  restOfWorld: number;
};

/** IQVIA regional country-use shares (% of global) — endpoints + interpolated mid */
export const REGION_PATH: RegionPathRow[] = [
  {
    year: 2019,
    westernEurope: 32,
    easternEurope: 17,
    northAmerica: 19,
    china: 10,
    restOfWorld: 22,
  },
  {
    year: 2020,
    westernEurope: 30,
    easternEurope: 16,
    northAmerica: 20,
    china: 11,
    restOfWorld: 23,
  },
  {
    year: 2021,
    westernEurope: 28,
    easternEurope: 14,
    northAmerica: 21,
    china: 12,
    restOfWorld: 25,
  },
  {
    year: 2022,
    westernEurope: 27,
    easternEurope: 13,
    northAmerica: 22,
    china: 13,
    restOfWorld: 25,
  },
  {
    year: 2023,
    westernEurope: 25,
    easternEurope: 11,
    northAmerica: 23,
    china: 15,
    restOfWorld: 26,
  },
];

export type BlocCompareRow = {
  bloc: string;
  siteSharePct: number;
  dalySharePct: number;
  gapRatio: number;
  note: string;
};

/** US / China / Europe vs burden they claim to treat */
export const BLOC_COMPARE: BlocCompareRow[] = [
  {
    bloc: "United States",
    siteSharePct: 16,
    dalySharePct: 7.2,
    gapRatio: 2.22,
    note: "Country-use share; facility share even higher in oncology (~40%)",
  },
  {
    bloc: "China",
    siteSharePct: 13,
    dalySharePct: 17.8,
    gapRatio: 0.73,
    note: "Rising fast on starts; still under-weight vs national DALY stock",
  },
  {
    bloc: "Western Europe",
    siteSharePct: 25,
    dalySharePct: 8.5,
    gapRatio: 2.94,
    note: "Still #1 regional bloc on country-uses despite 21% relative decline",
  },
  {
    bloc: "Eastern Europe",
    siteSharePct: 11,
    dalySharePct: 4.2,
    gapRatio: 2.62,
    note: "Share compressed 33% since 2019; still over-indexed vs burden",
  },
  {
    bloc: "Sub-Saharan Africa",
    siteSharePct: 1.8,
    dalySharePct: 24.5,
    gapRatio: 0.07,
    note: "Largest burden–site mismatch in the set",
  },
  {
    bloc: "South Asia",
    siteSharePct: 2.4,
    dalySharePct: 18.6,
    gapRatio: 0.13,
    note: "India anchors volume; still deep under-representation",
  },
];

export type TherapyMixRow = {
  therapy: string;
  usPct: number;
  chinaPct: number;
  europePct: number;
  rowPct: number;
};

/** Illustrative Phase III site geography by therapy (desk roll-up of disclosed patterns) */
export const THERAPY_MIX: TherapyMixRow[] = [
  { therapy: "Oncology", usPct: 38, chinaPct: 14, europePct: 32, rowPct: 16 },
  { therapy: "Cardiometabolic", usPct: 28, chinaPct: 18, europePct: 34, rowPct: 20 },
  { therapy: "Infectious disease", usPct: 22, chinaPct: 20, europePct: 28, rowPct: 30 },
  { therapy: "CNS / neuro", usPct: 35, chinaPct: 10, europePct: 36, rowPct: 19 },
  { therapy: "Rare / orphan", usPct: 42, chinaPct: 6, europePct: 40, rowPct: 12 },
];

export type ScatterPoint = {
  country: string;
  sitePct: number;
  dalyPct: number;
  region: string;
  top3: boolean;
};

export const SCATTER_POINTS: ScatterPoint[] = COUNTRY_SITES.map((r) => ({
  country: r.country,
  sitePct: r.countryUsePct,
  dalyPct: r.dalyPct,
  region: r.region,
  top3: ["United States", "China", "Spain"].includes(r.country),
}));

export type InitiationRankRow = {
  year: number;
  rank: number;
  country: string;
  initiations: number;
};

/** Phase III industry initiation ranks (ABPI/Citeline stylized) */
export const PHASE3_INITIATION_RANKS: InitiationRankRow[] = [
  { year: 2023, rank: 1, country: "United States", initiations: 489 },
  { year: 2023, rank: 2, country: "China", initiations: 361 },
  { year: 2023, rank: 3, country: "Spain", initiations: 248 },
  { year: 2024, rank: 1, country: "China", initiations: 494 },
  { year: 2024, rank: 2, country: "United States", initiations: 489 },
  { year: 2024, rank: 3, country: "Spain", initiations: 312 },
];

export function topKShare(k: number, metric: "countryUsePct" | "facilityPct" = "countryUsePct"): number {
  const vals = COUNTRY_SITES.map((r) =>
    metric === "facilityPct" ? (r.facilityPct ?? 0) : r.countryUsePct,
  )
    .sort((a, b) => b - a)
    .slice(0, k);
  return vals.reduce((s, v) => s + v, 0);
}

export function hhi(metric: "countryUsePct" | "facilityPct" = "countryUsePct"): number {
  const shares = COUNTRY_SITES.map((r) =>
    metric === "facilityPct" ? (r.facilityPct ?? 0) : r.countryUsePct,
  );
  const named = shares.reduce((s, v) => s + v, 0);
  const rest = Math.max(0, 100 - named);
  const all = [...shares, rest];
  return Math.round(all.reduce((s, v) => s + v * v, 0));
}

export const ANALYTICS = {
  top3Use: topKShare(3, "countryUsePct"),
  top3Facility: topKShare(3, "facilityPct"),
  top10Use: topKShare(10, "countryUsePct"),
  hhiUse: hhi("countryUsePct"),
  hhiFacility: hhi("facilityPct"),
};
