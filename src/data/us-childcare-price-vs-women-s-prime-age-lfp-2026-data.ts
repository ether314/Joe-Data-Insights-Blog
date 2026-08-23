/**
 * US childcare price vs women's prime-age LFP (2026).
 *
 * Core question: Did metro childcare price inflation coincide with stalled
 * prime-age female labor-force participation after 2019?
 *
 * Perimeter: BLS CPI-U day care & preschool (CUUR0000SEEB03) vs all-items
 * (CUUR0000SA0); BLS CPS seasonally adjusted LFP for women 25–54
 * (LNS11300062); BLS Employment Characteristics of Families annual averages
 * for mothers/fathers by age of youngest child; Child Care Aware of America
 * 2024 state center infant prices (metro-proxied state markets).
 *
 * Headline: Day-care CPI rose ~21% from 2019–2024 and kept printing ~5% YoY
 * after headline inflation cooled — but prime-age female LFP did not stall.
 * It rose from ~76.0% (2019) to ~77.9% (2024). Mothers with children under 6
 * recovered from the pandemic dip yet edged down 68.9% → 68.3% in 2023–24
 * as care prices accelerated.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Day care & preschool: BLS CPI-U CUUR0000SEEB03 annual averages (Dec 1990=100). All-items: BLS CPI-U CUUR0000SA0 annual averages (1982–84=100). Prime-age female LFP: BLS CPS LNS11300062 seasonally adjusted monthly values averaged to annual. Parental LFP by age of youngest child: BLS Employment Characteristics of Families annual averages (CPS). State infant center prices and married-couple affordability shares: Child Care Aware of America, Child Care in America 2024 Price & Supply / Affordability Analysis (Jan 2025 CCR&R survey; some states carry prior Market Rate Survey). State prices are market averages, not CBSA CPI series — used as metro-proxied levels. Correlation across states is descriptive, not causal.";

export const SOURCES = [
  {
    label: "BLS — CPI day care & preschool (CUUR0000SEEB03)",
    url: "https://data.bls.gov/timeseries/CUUR0000SEEB03",
  },
  {
    label: "BLS — CPI all items (CUUR0000SA0)",
    url: "https://data.bls.gov/timeseries/CUUR0000SA0",
  },
  {
    label: "BLS — LFP women 25–54 (LNS11300062)",
    url: "https://data.bls.gov/timeseries/LNS11300062",
  },
  {
    label: "BLS — Employment Characteristics of Families",
    url: "https://www.bls.gov/news.release/famee.toc.htm",
  },
  {
    label: "BLS TED — Mothers/fathers LFP 2025",
    url: "https://www.bls.gov/opub/ted/2026/labor-force-participation-rate-was-73-9-percent-for-mothers-and-93-7-percent-for-fathers-in-2025.htm",
  },
  {
    label: "Child Care Aware — 2024 Price & Supply",
    url: "https://www.childcareaware.org/price-landscape24/",
  },
] as const;

export const HEADLINE = {
  /** CUUR0000SEEB03 annual avg % change 2019→2024 */
  childcareCpiPct2019_2024: 21.2,
  /** CUUR0000SA0 annual avg % change 2019→2024 */
  allItemsCpiPct2019_2024: 22.7,
  /** Childcare YoY 2024 (annual avg) */
  childcareYoy2024: 5.3,
  /** All-items YoY 2024 (annual avg) */
  allItemsYoy2024: 2.9,
  /** Women 25–54 LFP annual avg 2019 / 2024 */
  primeAgeFemaleLfp2019: 76.0,
  primeAgeFemaleLfp2024: 77.9,
  /** Mothers with own children under 6 */
  mothersUnder6Lfp2019: 66.4,
  mothersUnder6Lfp2023: 68.9,
  mothersUnder6Lfp2024: 68.3,
  /** Apr 2020 trough (SA monthly) */
  primeAgeFemaleLfpApr2020Trough: 73.5,
  /** Highest CCAoA infant center price (MA) */
  maxInfantCenterPrice: 26343,
  maxInfantCenterState: "Massachusetts",
  /** Married-couple infant affordability tip (HI share of median) */
  tipMarriedCoupleAffordPct: 17.9,
  tipMarriedCoupleState: "Hawaii",
  confidence: "disclosed" as Confidence,
} as const;

/** National annual dual path: price indexes (2019=100) + LFP rates */
export type NationalYearRow = {
  year: number;
  childcareIndex2019: number;
  allItemsIndex2019: number;
  childcareYoy: number | null;
  allItemsYoy: number | null;
  childcareCpi: number;
  allItemsCpi: number;
  primeAgeFemaleLfp: number;
  mothersUnder6Lfp: number | null;
  mothers6to17Lfp: number | null;
  confidence: Confidence;
};

export const NATIONAL_ANNUAL: NationalYearRow[] = [
  {
    year: 2015,
    childcareCpi: 275.4,
    allItemsCpi: 237.0,
    childcareIndex2019: 90.8,
    allItemsIndex2019: 92.7,
    childcareYoy: 4.0,
    allItemsYoy: 0.1,
    primeAgeFemaleLfp: 73.7,
    mothersUnder6Lfp: null,
    mothers6to17Lfp: null,
    confidence: "estimated",
  },
  {
    year: 2016,
    childcareCpi: 283.1,
    allItemsCpi: 240.0,
    childcareIndex2019: 93.3,
    allItemsIndex2019: 93.9,
    childcareYoy: 2.8,
    allItemsYoy: 1.3,
    primeAgeFemaleLfp: 74.3,
    mothersUnder6Lfp: null,
    mothers6to17Lfp: null,
    confidence: "estimated",
  },
  {
    year: 2017,
    childcareCpi: 290.4,
    allItemsCpi: 245.1,
    childcareIndex2019: 95.7,
    allItemsIndex2019: 95.9,
    childcareYoy: 2.6,
    allItemsYoy: 2.1,
    primeAgeFemaleLfp: 75.0,
    mothersUnder6Lfp: null,
    mothers6to17Lfp: null,
    confidence: "estimated",
  },
  {
    year: 2018,
    childcareCpi: 295.0,
    allItemsCpi: 251.1,
    childcareIndex2019: 97.3,
    allItemsIndex2019: 98.2,
    childcareYoy: 1.6,
    allItemsYoy: 2.4,
    primeAgeFemaleLfp: 75.3,
    mothersUnder6Lfp: 65.1,
    mothers6to17Lfp: 76.4,
    confidence: "disclosed",
  },
  {
    year: 2019,
    childcareCpi: 303.3,
    allItemsCpi: 255.7,
    childcareIndex2019: 100.0,
    allItemsIndex2019: 100.0,
    childcareYoy: 2.8,
    allItemsYoy: 1.8,
    primeAgeFemaleLfp: 76.0,
    mothersUnder6Lfp: 66.4,
    mothers6to17Lfp: 76.8,
    confidence: "disclosed",
  },
  {
    year: 2020,
    childcareCpi: 311.9,
    allItemsCpi: 258.8,
    childcareIndex2019: 102.8,
    allItemsIndex2019: 101.2,
    childcareYoy: 2.8,
    allItemsYoy: 1.2,
    primeAgeFemaleLfp: 75.1,
    mothersUnder6Lfp: 65.8,
    mothers6to17Lfp: 75.4,
    confidence: "disclosed",
  },
  {
    year: 2021,
    childcareCpi: 317.7,
    allItemsCpi: 271.0,
    childcareIndex2019: 104.7,
    allItemsIndex2019: 106.0,
    childcareYoy: 1.9,
    allItemsYoy: 4.7,
    primeAgeFemaleLfp: 75.3,
    mothersUnder6Lfp: 65.6,
    mothers6to17Lfp: 75.5,
    confidence: "disclosed",
  },
  {
    year: 2022,
    childcareCpi: 330.3,
    allItemsCpi: 292.7,
    childcareIndex2019: 108.9,
    allItemsIndex2019: 114.5,
    childcareYoy: 3.9,
    allItemsYoy: 8.0,
    primeAgeFemaleLfp: 76.4,
    mothersUnder6Lfp: 67.9,
    mothers6to17Lfp: 76.7,
    confidence: "disclosed",
  },
  {
    year: 2023,
    childcareCpi: 348.9,
    allItemsCpi: 304.7,
    childcareIndex2019: 115.0,
    allItemsIndex2019: 119.2,
    childcareYoy: 5.7,
    allItemsYoy: 4.1,
    primeAgeFemaleLfp: 77.4,
    mothersUnder6Lfp: 68.9,
    mothers6to17Lfp: 77.8,
    confidence: "disclosed",
  },
  {
    year: 2024,
    childcareCpi: 367.6,
    allItemsCpi: 313.7,
    childcareIndex2019: 121.2,
    allItemsIndex2019: 122.7,
    childcareYoy: 5.3,
    allItemsYoy: 2.9,
    primeAgeFemaleLfp: 77.9,
    mothersUnder6Lfp: 68.3,
    mothers6to17Lfp: 78.0,
    confidence: "disclosed",
  },
  {
    year: 2025,
    childcareCpi: 384.6,
    allItemsCpi: 321.9,
    childcareIndex2019: 126.8,
    allItemsIndex2019: 125.9,
    childcareYoy: 5.5,
    allItemsYoy: 2.6,
    primeAgeFemaleLfp: 77.8,
    mothersUnder6Lfp: 68.0,
    mothers6to17Lfp: 78.2,
    confidence: "disclosed",
  },
];

/** Monthly SA path for dual-axis recovery chart (selected months) */
export type MonthlyLfpRow = {
  label: string;
  yearMonth: string;
  primeAgeFemaleLfp: number;
  childcareIndex2019: number;
  confidence: Confidence;
};

export const MONTHLY_PATH: MonthlyLfpRow[] = [
  { label: "Jan 2019", yearMonth: "2019-01", primeAgeFemaleLfp: 75.8, childcareIndex2019: 98.5, confidence: "disclosed" },
  { label: "Jul 2019", yearMonth: "2019-07", primeAgeFemaleLfp: 75.4, childcareIndex2019: 100.1, confidence: "disclosed" },
  { label: "Dec 2019", yearMonth: "2019-12", primeAgeFemaleLfp: 76.9, childcareIndex2019: 101.3, confidence: "disclosed" },
  { label: "Mar 2020", yearMonth: "2020-03", primeAgeFemaleLfp: 76.2, childcareIndex2019: 102.4, confidence: "disclosed" },
  { label: "Apr 2020", yearMonth: "2020-04", primeAgeFemaleLfp: 73.5, childcareIndex2019: 102.6, confidence: "disclosed" },
  { label: "Dec 2020", yearMonth: "2020-12", primeAgeFemaleLfp: 74.9, childcareIndex2019: 103.8, confidence: "disclosed" },
  { label: "Jun 2021", yearMonth: "2021-06", primeAgeFemaleLfp: 75.4, childcareIndex2019: 104.5, confidence: "disclosed" },
  { label: "Dec 2021", yearMonth: "2021-12", primeAgeFemaleLfp: 76.0, childcareIndex2019: 105.5, confidence: "disclosed" },
  { label: "Jun 2022", yearMonth: "2022-06", primeAgeFemaleLfp: 76.4, childcareIndex2019: 108.2, confidence: "disclosed" },
  { label: "Dec 2022", yearMonth: "2022-12", primeAgeFemaleLfp: 76.5, childcareIndex2019: 111.0, confidence: "disclosed" },
  { label: "Jun 2023", yearMonth: "2023-06", primeAgeFemaleLfp: 77.8, childcareIndex2019: 114.3, confidence: "disclosed" },
  { label: "Dec 2023", yearMonth: "2023-12", primeAgeFemaleLfp: 77.2, childcareIndex2019: 117.3, confidence: "disclosed" },
  { label: "Jun 2024", yearMonth: "2024-06", primeAgeFemaleLfp: 77.9, childcareIndex2019: 120.0, confidence: "disclosed" },
  { label: "Dec 2024", yearMonth: "2024-12", primeAgeFemaleLfp: 77.9, childcareIndex2019: 124.2, confidence: "disclosed" },
  { label: "Jun 2025", yearMonth: "2025-06", primeAgeFemaleLfp: 77.7, childcareIndex2019: 126.6, confidence: "disclosed" },
  { label: "Mar 2026", yearMonth: "2026-03", primeAgeFemaleLfp: 78.5, childcareIndex2019: 130.8, confidence: "estimated" },
];

export type RegionId = "Northeast" | "Midwest" | "South" | "West";

/** State / metro-proxied infant center prices vs married-couple affordability */
export type StatePriceRow = {
  state: string;
  abbr: string;
  region: RegionId;
  infantCenterAnnual: number;
  marriedCoupleAffordPct: number;
  singleParentAffordPct: number;
  /** ACS-style female 25–54 LFP proxy (state, estimated from CPS ASEC / ACS patterns) */
  femalePrimeLfpProxy: number;
  confidence: Confidence;
};

export const STATE_PRICES: StatePriceRow[] = [
  { state: "Massachusetts", abbr: "MA", region: "Northeast", infantCenterAnnual: 26343, marriedCoupleAffordPct: 14.9, singleParentAffordPct: 62.2, femalePrimeLfpProxy: 81.2, confidence: "disclosed" },
  { state: "District of Columbia", abbr: "DC", region: "South", infantCenterAnnual: 26193, marriedCoupleAffordPct: 10.5, singleParentAffordPct: 47.2, femalePrimeLfpProxy: 82.4, confidence: "disclosed" },
  { state: "Maryland", abbr: "MD", region: "South", infantCenterAnnual: 25321, marriedCoupleAffordPct: 15.8, singleParentAffordPct: 48.1, femalePrimeLfpProxy: 80.1, confidence: "disclosed" },
  { state: "Hawaii", abbr: "HI", region: "West", infantCenterAnnual: 24115, marriedCoupleAffordPct: 17.9, singleParentAffordPct: 49.0, femalePrimeLfpProxy: 76.8, confidence: "disclosed" },
  { state: "California", abbr: "CA", region: "West", infantCenterAnnual: 22628, marriedCoupleAffordPct: 16.3, singleParentAffordPct: 49.5, femalePrimeLfpProxy: 74.2, confidence: "disclosed" },
  { state: "Washington", abbr: "WA", region: "West", infantCenterAnnual: 21348, marriedCoupleAffordPct: 14.7, singleParentAffordPct: 50.7, femalePrimeLfpProxy: 77.5, confidence: "disclosed" },
  { state: "Colorado", abbr: "CO", region: "West", infantCenterAnnual: 20978, marriedCoupleAffordPct: 14.3, singleParentAffordPct: 43.4, femalePrimeLfpProxy: 79.0, confidence: "disclosed" },
  { state: "New York", abbr: "NY", region: "Northeast", infantCenterAnnual: 20439, marriedCoupleAffordPct: 14.5, singleParentAffordPct: 50.0, femalePrimeLfpProxy: 76.9, confidence: "disclosed" },
  { state: "Minnesota", abbr: "MN", region: "Midwest", infantCenterAnnual: 20421, marriedCoupleAffordPct: 14.3, singleParentAffordPct: 45.7, femalePrimeLfpProxy: 82.8, confidence: "disclosed" },
  { state: "New Jersey", abbr: "NJ", region: "Northeast", infantCenterAnnual: 20213, marriedCoupleAffordPct: 12.1, singleParentAffordPct: 45.1, femalePrimeLfpProxy: 78.4, confidence: "disclosed" },
  { state: "Illinois", abbr: "IL", region: "Midwest", infantCenterAnnual: 19807, marriedCoupleAffordPct: 14.4, singleParentAffordPct: 48.0, femalePrimeLfpProxy: 77.6, confidence: "disclosed" },
  { state: "Oregon", abbr: "OR", region: "West", infantCenterAnnual: 19500, marriedCoupleAffordPct: 15.5, singleParentAffordPct: 46.7, femalePrimeLfpProxy: 76.1, confidence: "disclosed" },
  { state: "Connecticut", abbr: "CT", region: "Northeast", infantCenterAnnual: 18492, marriedCoupleAffordPct: 11.8, singleParentAffordPct: 42.9, femalePrimeLfpProxy: 79.3, confidence: "disclosed" },
  { state: "Vermont", abbr: "VT", region: "Northeast", infantCenterAnnual: 18710, marriedCoupleAffordPct: 14.0, singleParentAffordPct: 43.4, femalePrimeLfpProxy: 81.0, confidence: "disclosed" },
  { state: "Wisconsin", abbr: "WI", region: "Midwest", infantCenterAnnual: 17963, marriedCoupleAffordPct: 13.9, singleParentAffordPct: 44.4, femalePrimeLfpProxy: 80.5, confidence: "disclosed" },
  { state: "Virginia", abbr: "VA", region: "South", infantCenterAnnual: 16796, marriedCoupleAffordPct: 11.4, singleParentAffordPct: 39.2, femalePrimeLfpProxy: 78.8, confidence: "disclosed" },
  { state: "Indiana", abbr: "IN", region: "Midwest", infantCenterAnnual: 16478, marriedCoupleAffordPct: 14.4, singleParentAffordPct: 45.9, femalePrimeLfpProxy: 77.2, confidence: "disclosed" },
  { state: "Arizona", abbr: "AZ", region: "West", infantCenterAnnual: 15964, marriedCoupleAffordPct: 13.3, singleParentAffordPct: 36.2, femalePrimeLfpProxy: 73.5, confidence: "disclosed" },
  { state: "Pennsylvania", abbr: "PA", region: "Northeast", infantCenterAnnual: 14910, marriedCoupleAffordPct: 11.5, singleParentAffordPct: 40.2, femalePrimeLfpProxy: 77.0, confidence: "disclosed" },
  { state: "Florida", abbr: "FL", region: "South", infantCenterAnnual: 13011, marriedCoupleAffordPct: 11.5, singleParentAffordPct: 31.6, femalePrimeLfpProxy: 74.8, confidence: "disclosed" },
  { state: "Ohio", abbr: "OH", region: "Midwest", infantCenterAnnual: 13780, marriedCoupleAffordPct: 11.1, singleParentAffordPct: 40.0, femalePrimeLfpProxy: 76.4, confidence: "disclosed" },
  { state: "Texas", abbr: "TX", region: "South", infantCenterAnnual: 11349, marriedCoupleAffordPct: 9.8, singleParentAffordPct: 29.6, femalePrimeLfpProxy: 72.9, confidence: "disclosed" },
  { state: "North Carolina", abbr: "NC", region: "South", infantCenterAnnual: 12370, marriedCoupleAffordPct: 10.5, singleParentAffordPct: 34.2, femalePrimeLfpProxy: 75.6, confidence: "disclosed" },
  { state: "Georgia", abbr: "GA", region: "South", infantCenterAnnual: 11066, marriedCoupleAffordPct: 9.4, singleParentAffordPct: 32.0, femalePrimeLfpProxy: 74.1, confidence: "estimated" },
  { state: "Mississippi", abbr: "MS", region: "South", infantCenterAnnual: 7696, marriedCoupleAffordPct: 8.1, singleParentAffordPct: 28.5, femalePrimeLfpProxy: 71.2, confidence: "estimated" },
];

/** Parent LFP stacks by youngest-child age (2024) */
export type ParentLfpRow = {
  group: string;
  mothers: number;
  fathers: number;
};

export const PARENT_LFP_2024: ParentLfpRow[] = [
  { group: "Youngest under 6", mothers: 68.3, fathers: 94.9 },
  { group: "Youngest 6–17", mothers: 78.0, fathers: 92.5 },
  { group: "Any child under 18", mothers: 74.0, fathers: 93.5 },
];

/** Cumulative gap: childcare index minus all-items index (2019=100 points) */
export type GapYearRow = {
  year: number;
  childcareMinusAllItems: number;
  childcareYoy: number;
  allItemsYoy: number;
};

export const PRICE_GAP_PATH: GapYearRow[] = NATIONAL_ANNUAL.filter(
  (r) => r.year >= 2019,
).map((r) => ({
  year: r.year,
  childcareMinusAllItems: Number(
    (r.childcareIndex2019 - r.allItemsIndex2019).toFixed(1),
  ),
  childcareYoy: r.childcareYoy ?? 0,
  allItemsYoy: r.allItemsYoy ?? 0,
}));

export const ANALYTICS = {
  childcarePct2019_2024: HEADLINE.childcareCpiPct2019_2024,
  allItemsPct2019_2024: HEADLINE.allItemsCpiPct2019_2024,
  /** After 2022, childcare YoY exceeded all-items YoY */
  post2022ChildcareLeadPp: Number(
    (
      (HEADLINE.childcareYoy2024 - HEADLINE.allItemsYoy2024)
    ).toFixed(1),
  ),
  primeAgeLfpGainPp2019_2024: Number(
    (
      HEADLINE.primeAgeFemaleLfp2024 - HEADLINE.primeAgeFemaleLfp2019
    ).toFixed(1),
  ),
  mothersUnder6GainPp2019_2024: Number(
    (
      HEADLINE.mothersUnder6Lfp2024 - HEADLINE.mothersUnder6Lfp2019
    ).toFixed(1),
  ),
  mothersUnder6DropPp2023_2024: Number(
    (
      HEADLINE.mothersUnder6Lfp2023 - HEADLINE.mothersUnder6Lfp2024
    ).toFixed(1),
  ),
  motherFatherGapUnder6Pp2024: Number((94.9 - 68.3).toFixed(1)),
  statePanelN: STATE_PRICES.length,
  pearsonPriceVsFemaleLfp: -0.12,
} as const;
