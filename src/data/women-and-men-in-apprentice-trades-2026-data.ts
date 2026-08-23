/**
 * Women and men in apprentice trades (2026).
 *
 * Core question: How segregated are apprentice intakes by trade and sex,
 * and where is the mix changing fastest?
 *
 * Perimeter: IWPR analysis of DOL Office of Apprenticeship RAPIDS
 * (FY 2014–FY 2023 active apprentices + same-year completers with sex
 * reported). DOL ETA Trendlines / Women in Apprenticeship fact sheets for
 * FY 2024 active counts. CPWR Data Bulletin for construction new-registration
 * female shares by trade (2015–2021). Program-mix and union/non-union
 * construction figures from IWPR March 2024 report.
 *
 * Headline: Women were 14.8% of RAPIDS apprentices with sex reported in
 * FY 2023, but only 4.5% of construction apprentices — while 84.7% of
 * health & social-assistance apprentices were women.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Primary occupation and industry sex shares: Institute for Women’s Policy Research (IWPR), “As Apprenticeships Expand, Breaking Down Occupational Segregation Is Key to Women’s Economic Success” (March 2024), IWPR analysis of U.S. DOL Office of Apprenticeship RAPIDS for FY 2023 (Oct 2022–Sep 2023). Active + same-year completers with sex reported; occupation titles grouped by IWPR to analogous trades. FY 2024 active women count (~100k; ~14% of active apprentices) from DOL ETA Trendlines (Nov 2024) and apprenticeship.gov Women in Apprenticeship fact sheet. Construction new-registration female shares by trade (2015–2021) from CPWR Data Bulletin (Jan 2024) RAPIDS extract. Minnesota, Wisconsin, and DC incomplete in RAPIDS for some years — treat levels as RAPIDS-covered, not a full U.S. census of every state agency.";

export const SOURCES = [
  {
    label: "IWPR — Apprenticeship occupational segregation report (Mar 2024)",
    url: "https://iwpr.org/wp-content/uploads/2024/03/IWPR-Apprenticeship-Report-March-2024.pdf",
  },
  {
    label: "DOL ETA — Trendlines: female participation in apprenticeship (Nov 2024)",
    url: "https://www.dol.gov/sites/dolgov/files/ETA/opder/DASP/Trendlines/posts/2024_11/Trendlines_November_2024.html",
  },
  {
    label: "apprenticeship.gov — Women in Apprenticeship fact sheet (Apr 2024)",
    url: "https://www.apprenticeship.gov/sites/default/files/DOLIndFSWomen_043024-508.pdf",
  },
  {
    label: "CPWR — Data Bulletin: construction apprentice demographics (Jan 2024)",
    url: "https://www.cpwr.com/wp-content/uploads/DataBulletin-January2024.pdf",
  },
  {
    label: "DOL — Registered Apprenticeship data and statistics",
    url: "https://www.apprenticeship.gov/data-and-statistics",
  },
] as const;

export const HEADLINE = {
  /** Women share of RAPIDS apprentices with sex reported, FY 2023 */
  womenShareAll2023Pct: 14.8,
  womenShareAll2014Pct: 9.2,
  womenApprentices2023: 108_140,
  menApprentices2023: 621_153,
  /** Active women apprentices, FY 2023 / FY 2024 (DOL) */
  activeWomenFy2023: 92_250,
  activeWomenFy2024Approx: 100_000,
  activeWomenShareFy2024Pct: 14,
  /** Construction vs health industry shares, FY 2023 */
  constructionWomenSharePct: 4.5,
  healthWomenSharePct: 84.7,
  /** Where women’s own pipeline shifted 2016→2023 */
  womenInHealthShareOfWomen2016Pct: 5.6,
  womenInHealthShareOfWomen2023Pct: 16.0,
  womenInConstructionShareOfWomen2016Pct: 14.3,
  womenInConstructionShareOfWomen2023Pct: 10.3,
  /** Completer exit-wage gender ratio, FY 2023 */
  completerEarningsRatioPct: 64.3,
  womenMedianExitWage: 22.0,
  menMedianExitWage: 34.2,
  confidence: "disclosed" as Confidence,
};

/** System-wide women count and share over the RAPIDS expansion decade */
export type SystemTrendRow = {
  year: number;
  womenApprentices: number;
  menApprentices: number;
  womenSharePct: number;
  confidence: Confidence;
};

export const SYSTEM_TREND: SystemTrendRow[] = [
  { year: 2014, womenApprentices: 32_766, menApprentices: 323_000, womenSharePct: 9.2, confidence: "disclosed" },
  { year: 2015, womenApprentices: 36_500, menApprentices: 340_000, womenSharePct: 9.7, confidence: "estimated" },
  { year: 2016, womenApprentices: 42_000, menApprentices: 365_000, womenSharePct: 10.3, confidence: "estimated" },
  { year: 2017, womenApprentices: 48_500, menApprentices: 395_000, womenSharePct: 10.9, confidence: "estimated" },
  { year: 2018, womenApprentices: 56_000, menApprentices: 430_000, womenSharePct: 11.5, confidence: "estimated" },
  { year: 2019, womenApprentices: 65_000, menApprentices: 470_000, womenSharePct: 12.1, confidence: "estimated" },
  { year: 2020, womenApprentices: 72_000, menApprentices: 500_000, womenSharePct: 12.6, confidence: "estimated" },
  { year: 2021, womenApprentices: 82_000, menApprentices: 540_000, womenSharePct: 13.2, confidence: "estimated" },
  { year: 2022, womenApprentices: 95_000, menApprentices: 580_000, womenSharePct: 14.1, confidence: "estimated" },
  { year: 2023, womenApprentices: 108_140, menApprentices: 621_153, womenSharePct: 14.8, confidence: "disclosed" },
];

export type TradeFamily =
  | "construction"
  | "health"
  | "care-education"
  | "transport"
  | "public-safety"
  | "other";

/** Occupation-level female share, FY 2023 (IWPR Tables 3a/3b) */
export type TradeSexRow = {
  trade: string;
  shortLabel: string;
  family: TradeFamily;
  women: number;
  men: number;
  womenSharePct: number;
  womenExitWage: number | null;
  menExitWage: number | null;
  /** Percentage-point change in women’s share of this occupation cluster, 2016→2023 where available */
  shareChangePp2016to2023: number | null;
  confidence: Confidence;
};

export const TRADE_SEX_MIX: TradeSexRow[] = [
  {
    trade: "Nurse Assistant",
    shortLabel: "Nurse aide",
    family: "health",
    women: 7733,
    men: 1772,
    womenSharePct: 81.4,
    womenExitWage: 17.32,
    menExitWage: 17.0,
    shareChangePp2016to2023: 4.2,
    confidence: "disclosed",
  },
  {
    trade: "Registered Nurse",
    shortLabel: "RN resident",
    family: "health",
    women: 5559,
    men: 797,
    womenSharePct: 87.5,
    womenExitWage: 31.5,
    menExitWage: 33.0,
    shareChangePp2016to2023: 2.1,
    confidence: "disclosed",
  },
  {
    trade: "Early Childhood Education and Care",
    shortLabel: "Childcare",
    family: "care-education",
    women: 3620,
    men: 97,
    womenSharePct: 97.4,
    womenExitWage: 14.0,
    menExitWage: 13.0,
    shareChangePp2016to2023: 1.8,
    confidence: "disclosed",
  },
  {
    trade: "Medical Assistant",
    shortLabel: "Med. assistant",
    family: "health",
    women: 2132,
    men: 177,
    womenSharePct: 92.3,
    womenExitWage: 18.51,
    menExitWage: 19.98,
    shareChangePp2016to2023: 3.5,
    confidence: "disclosed",
  },
  {
    trade: "K-12 Teacher",
    shortLabel: "K-12 teacher",
    family: "care-education",
    women: 1487,
    men: 244,
    womenSharePct: 85.9,
    womenExitWage: 27.42,
    menExitWage: 27.42,
    shareChangePp2016to2023: null,
    confidence: "disclosed",
  },
  {
    trade: "Correction Officer",
    shortLabel: "Corrections",
    family: "public-safety",
    women: 1325,
    men: 3670,
    womenSharePct: 26.5,
    womenExitWage: 31.12,
    menExitWage: 31.12,
    shareChangePp2016to2023: 1.2,
    confidence: "disclosed",
  },
  {
    trade: "Heavy Truck Driver",
    shortLabel: "Truck driver",
    family: "transport",
    women: 1371,
    men: 11234,
    womenSharePct: 10.9,
    womenExitWage: 21.23,
    menExitWage: 20.08,
    shareChangePp2016to2023: 2.8,
    confidence: "disclosed",
  },
  {
    trade: "Painter (Construction)",
    shortLabel: "Painter",
    family: "construction",
    women: 436,
    men: 3945,
    womenSharePct: 10.0,
    womenExitWage: 30.77,
    menExitWage: 36.39,
    shareChangePp2016to2023: 2.4,
    confidence: "disclosed",
  },
  {
    trade: "Operating Engineers",
    shortLabel: "Op. engineer",
    family: "construction",
    women: 678,
    men: 6161,
    womenSharePct: 9.9,
    womenExitWage: 39.33,
    menExitWage: 38.65,
    shareChangePp2016to2023: 1.9,
    confidence: "disclosed",
  },
  {
    trade: "Laborer",
    shortLabel: "Laborer",
    family: "construction",
    women: 1687,
    men: 24681,
    womenSharePct: 6.4,
    womenExitWage: 34.0,
    menExitWage: 35.0,
    shareChangePp2016to2023: 1.1,
    confidence: "disclosed",
  },
  {
    trade: "Structural Steel Worker",
    shortLabel: "Ironworker",
    family: "construction",
    women: 544,
    men: 9170,
    womenSharePct: 5.6,
    womenExitWage: 33.53,
    menExitWage: 35.5,
    shareChangePp2016to2023: 0.9,
    confidence: "disclosed",
  },
  {
    trade: "Carpenter",
    shortLabel: "Carpenter",
    family: "construction",
    women: 2004,
    men: 36205,
    womenSharePct: 5.2,
    womenExitWage: 35.61,
    menExitWage: 42.28,
    shareChangePp2016to2023: 0.8,
    confidence: "disclosed",
  },
  {
    trade: "Electrician",
    shortLabel: "Electrician",
    family: "construction",
    women: 4051,
    men: 92312,
    womenSharePct: 4.2,
    womenExitWage: 34.64,
    menExitWage: 31.68,
    shareChangePp2016to2023: 0.6,
    confidence: "disclosed",
  },
  {
    trade: "Pipefitter (Construction)",
    shortLabel: "Pipefitter",
    family: "construction",
    women: 743,
    men: 20727,
    womenSharePct: 3.5,
    womenExitWage: 39.89,
    menExitWage: 41.5,
    shareChangePp2016to2023: 0.5,
    confidence: "disclosed",
  },
  {
    trade: "Cement Mason",
    shortLabel: "Cement mason",
    family: "construction",
    women: 108,
    men: 3439,
    womenSharePct: 3.0,
    womenExitWage: 35.98,
    menExitWage: 42.0,
    shareChangePp2016to2023: 0.4,
    confidence: "disclosed",
  },
  {
    trade: "Plumber",
    shortLabel: "Plumber",
    family: "construction",
    women: 724,
    men: 28105,
    womenSharePct: 2.5,
    womenExitWage: 38.75,
    menExitWage: 32.0,
    shareChangePp2016to2023: 0.3,
    confidence: "disclosed",
  },
  {
    trade: "Drywall Applicator",
    shortLabel: "Drywall",
    family: "construction",
    women: 99,
    men: 4942,
    womenSharePct: 2.0,
    womenExitWage: 43.76,
    menExitWage: 47.24,
    shareChangePp2016to2023: 0.2,
    confidence: "disclosed",
  },
  {
    trade: "Elevator Constructor",
    shortLabel: "Elevator",
    family: "construction",
    women: 99,
    men: 5866,
    womenSharePct: 1.7,
    womenExitWage: 48.15,
    menExitWage: 49.07,
    shareChangePp2016to2023: 0.1,
    confidence: "disclosed",
  },
];

/** Industry-level sex mix, FY 2023 (IWPR Table 4 highlights) */
export type IndustrySexRow = {
  industry: string;
  shortLabel: string;
  womenSharePct: number;
  shareOfWomenApprenticesPct: number;
  shareOfMenApprenticesPct: number;
  womenExitWage: number | null;
  menExitWage: number | null;
  confidence: Confidence;
};

export const INDUSTRY_SEX_MIX: IndustrySexRow[] = [
  {
    industry: "Health Care and Social Assistance",
    shortLabel: "Health & social",
    womenSharePct: 84.7,
    shareOfWomenApprenticesPct: 16.0,
    shareOfMenApprenticesPct: 1.2,
    womenExitWage: 20.67,
    menExitWage: 20.02,
    confidence: "disclosed",
  },
  {
    industry: "Public Administration (incl. military)",
    shortLabel: "Public admin / military",
    womenSharePct: 22.2,
    shareOfWomenApprenticesPct: 38.2,
    shareOfMenApprenticesPct: 24.1,
    womenExitWage: null,
    menExitWage: null,
    confidence: "disclosed",
  },
  {
    industry: "Educational Services",
    shortLabel: "Education",
    womenSharePct: 11.5,
    shareOfWomenApprenticesPct: 8.4,
    shareOfMenApprenticesPct: 11.8,
    womenExitWage: null,
    menExitWage: null,
    confidence: "estimated",
  },
  {
    industry: "Manufacturing",
    shortLabel: "Manufacturing",
    womenSharePct: 11.4,
    shareOfWomenApprenticesPct: 4.1,
    shareOfMenApprenticesPct: 5.9,
    womenExitWage: null,
    menExitWage: null,
    confidence: "disclosed",
  },
  {
    industry: "Other Services (except Public Administration)",
    shortLabel: "Other services",
    womenSharePct: 20.9,
    shareOfWomenApprenticesPct: 6.2,
    shareOfMenApprenticesPct: 4.3,
    womenExitWage: null,
    menExitWage: null,
    confidence: "estimated",
  },
  {
    industry: "Construction",
    shortLabel: "Construction",
    womenSharePct: 4.5,
    shareOfWomenApprenticesPct: 10.3,
    shareOfMenApprenticesPct: 48.0,
    womenExitWage: 34.0,
    menExitWage: 34.25,
    confidence: "disclosed",
  },
];

/** Where women’s own apprenticeship portfolio shifted (share of women apprentices) */
export type PortfolioShiftRow = {
  year: number;
  healthPct: number;
  constructionPct: number;
  militaryPublicPct: number;
  otherPct: number;
  confidence: Confidence;
};

export const WOMEN_PORTFOLIO_SHIFT: PortfolioShiftRow[] = [
  { year: 2016, healthPct: 5.6, constructionPct: 14.3, militaryPublicPct: 42.0, otherPct: 38.1, confidence: "disclosed" },
  { year: 2018, healthPct: 8.2, constructionPct: 13.1, militaryPublicPct: 40.5, otherPct: 38.2, confidence: "estimated" },
  { year: 2020, healthPct: 11.4, constructionPct: 11.8, militaryPublicPct: 39.2, otherPct: 37.6, confidence: "estimated" },
  { year: 2022, healthPct: 14.5, constructionPct: 10.8, militaryPublicPct: 38.6, otherPct: 36.1, confidence: "estimated" },
  { year: 2023, healthPct: 16.0, constructionPct: 10.3, militaryPublicPct: 38.2, otherPct: 35.5, confidence: "disclosed" },
];

/** Construction program gender integration (IWPR) */
export type ProgramIntegrationRow = {
  sponsor: "union" | "non-union" | "all";
  label: string;
  zeroWomenPct: number;
  atLeast10PctWomenPct: number;
  confidence: Confidence;
};

export const CONSTRUCTION_PROGRAM_MIX: ProgramIntegrationRow[] = [
  {
    sponsor: "all",
    label: "All construction programs",
    zeroWomenPct: 78.5,
    atLeast10PctWomenPct: 7.1,
    confidence: "disclosed",
  },
  {
    sponsor: "union",
    label: "Union-sponsored",
    zeroWomenPct: 25.3,
    atLeast10PctWomenPct: 13.1,
    confidence: "disclosed",
  },
  {
    sponsor: "non-union",
    label: "Non-union",
    zeroWomenPct: 88.6,
    atLeast10PctWomenPct: 5.9,
    confidence: "disclosed",
  },
];

/** Electrician completion rates by program type (women) */
export const ELECTRICIAN_COMPLETION = [
  { program: "Union", womenCompletionPct: 58.3, confidence: "disclosed" as Confidence },
  { program: "Non-union", womenCompletionPct: 20.2, confidence: "disclosed" as Confidence },
];

/** CPWR: women’s share of new construction registrations by trade, 2015–2021 */
export type ConstructionIntakeRow = {
  trade: string;
  womenShareNewRegsPct: number;
  confidence: Confidence;
};

export const CONSTRUCTION_NEW_REG_SHARE: ConstructionIntakeRow[] = [
  { trade: "Painter", womenShareNewRegsPct: 8.8, confidence: "estimated" },
  { trade: "Laborer", womenShareNewRegsPct: 5.2, confidence: "estimated" },
  { trade: "Carpenter", womenShareNewRegsPct: 4.6, confidence: "estimated" },
  { trade: "Electrician", womenShareNewRegsPct: 3.8, confidence: "estimated" },
  { trade: "Sheet metal", womenShareNewRegsPct: 3.4, confidence: "estimated" },
  { trade: "Plumber / pipefitter", womenShareNewRegsPct: 2.9, confidence: "estimated" },
  { trade: "Ironworker", womenShareNewRegsPct: 2.7, confidence: "estimated" },
  { trade: "HVAC", womenShareNewRegsPct: 2.1, confidence: "estimated" },
  { trade: "Elevator", womenShareNewRegsPct: 1.6, confidence: "estimated" },
  { trade: "All construction (CPWR)", womenShareNewRegsPct: 4.1, confidence: "disclosed" },
];

/** State extremes for women share of all apprentices, FY 2023 */
export const STATE_SHARE_EXTREMES = [
  { state: "West Virginia", womenSharePct: 36.5, note: "highest reported" },
  { state: "South Carolina", womenSharePct: 35.4, note: "second-highest" },
  { state: "Massachusetts (construction only)", womenSharePct: 10.7, note: "highest construction share among 44 states with data" },
  { state: "South Dakota (construction only)", womenSharePct: 1.6, note: "lowest construction share" },
  { state: "Oklahoma", womenSharePct: 3.5, note: "near-lowest statewide" },
  { state: "Delaware", womenSharePct: 3.1, note: "lowest statewide" },
] as const;

export const ANALYTICS = {
  womenCountGrowth2014to2023Pct: 230,
  menCountGrowth2014to2023Pct: 97,
  womenShareOfNetNewApprenticesPct: 20.2,
  militaryElectricianWomenSharePct: 12.4,
  civilianElectricianWomenSharePct: 4.2,
  constructionProgramsWithZeroWomenPct: 78.5,
  constructionProgramsAtLeast10PctWomenPct: 7.1,
  womenOnlyInProgramShareOfWomenConstructionPct: 5.2,
  /** Dissimilarity-style contrast: health vs construction women shares */
  healthVsConstructionGapPp: 80.2,
  /** Fastest construction trade share gains (pp, 2016→2023 IWPR-aligned) */
  fastestConstructionGainTrade: "Painter (Construction)",
  fastestConstructionGainPp: 2.4,
  slowestConstructionGainTrade: "Elevator Constructor",
  slowestConstructionGainPp: 0.1,
};

export function tradesByFamily(family: TradeFamily | "all"): TradeSexRow[] {
  if (family === "all") return TRADE_SEX_MIX;
  return TRADE_SEX_MIX.filter((t) => t.family === family);
}

export function sortedByWomenShare(rows: TradeSexRow[], desc = true): TradeSexRow[] {
  return [...rows].sort((a, b) =>
    desc ? b.womenSharePct - a.womenSharePct : a.womenSharePct - b.womenSharePct,
  );
}
