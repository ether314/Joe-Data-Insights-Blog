/**
 * Platform earnings swings and household reliance (2026).
 *
 * Core question: How much does month-to-month gig-platform income swing,
 * and for what share of participants is it the majority of earnings?
 *
 * Primary anchors:
 * - JPMorgan Chase Institute "Paychecks, Paydays, and the Online Platform
 *   Economy" (2016) — MoM income volatility + labor/capital reliance
 * - JPMCI "The Online Platform Economy through the Pandemic" (2021) —
 *   participation path, sector medians, income-share medians
 * - Fed SHED 2024 (Economic Well-Being of U.S. Households, May 2025) —
 *   gig activity, main-job share, consistency / ends-meet attitudes
 * - BLS Contingent Worker Supplement (May 2017 electronically mediated;
 *   July 2023 contingent main-job share) — perimeter context
 *
 * Headline: Labor-platform participants were active only 56% of months;
 * in active months platform earnings averaged $533 (33% of total income).
 * As of Sept 2015, 25% of active labor participants relied on platforms for
 * >75% of income — the majority-reliance tail — while median pandemic-era
 * drivers earned ~10% of family income from transport platforms.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Month-to-month income volatility, labor/capital platform earnings, activity rates, and reliance shares: JPMorgan Chase Institute, Paychecks, Paydays, and the Online Platform Economy (Oct 2012–Sep 2015 Chase sample). Pandemic-era monthly vs trailing-year participation, sector medians, and platform income shares: JPMCI, The Online Platform Economy through the Pandemic (Apr 2018–Jun 2021). Gig activity, main-job share, consistency wish, and ends-meet reliance: Board of Governors of the Federal Reserve System, Survey of Household Economics and Decisionmaking (SHED) 2024 / Report on the Economic Well-Being of U.S. Households in 2024 (May 2025). Contingent / electronically mediated perimeter: BLS Contingent Worker Supplement (May 2017 electronically mediated; July 2023 contingent main-job). Desk interpolations of JPMCI chart paths are labeled estimated; point estimates cited in prose match disclosed report text.";

export const SOURCES = [
  {
    label: "JPMCI — Paychecks, Paydays, and the Online Platform Economy",
    url: "https://www.jpmorganchase.com/institute/all-topics/labor-markets-and-workforce/report-paychecks-paydays-and-the-online-platform-economy",
  },
  {
    label: "JPMCI — Online Platform Economy through the Pandemic",
    url: "https://www.jpmorganchase.com/institute/all-topics/labor-markets-and-workforce/online-platform-economy-through-the-pandemic",
  },
  {
    label: "Fed — SHED / Economic Well-Being 2024 (gig work)",
    url: "https://www.federalreserve.gov/publications/2025-economic-well-being-of-us-households-in-2024-employment-and-gig-work.htm",
  },
  {
    label: "BLS — Contingent and Alternative Employment (July 2023)",
    url: "https://www.bls.gov/news.release/archives/conemp_11082024.htm",
  },
  {
    label: "BLS — Electronically mediated employment FAQs (May 2017 CWS)",
    url: "https://www.bls.gov/cps/electronically-mediated-employment-faqs.htm",
  },
] as const;

export const VIZ_MARKERS = [
  "Month-over-month platform earnings swing",
  "Labor active months vs reliance tail",
  "Household reliance · majority paycheck?",
] as const;

export const HEADLINE = {
  /** Labor platform: share of months active after first participation */
  laborActiveMonthsPct: 56,
  /** Capital platform: share of months active */
  capitalActiveMonthsPct: 32,
  /** Avg monthly labor platform earnings in active months ($) */
  laborAvgActiveEarn: 533,
  /** Labor platform share of total income in active months (%) */
  laborShareOfIncomePct: 33,
  /** Avg monthly capital platform earnings in active months ($) */
  capitalAvgActiveEarn: 314,
  /** Capital platform share of total income in active months (%) */
  capitalShareOfIncomePct: 20,
  /** Active labor participants with platform >75% of income (Sep 2015) */
  laborRelianceGt75Pct: 25,
  /** Active labor participants with platform >25% of income (Sep 2015) */
  laborRelianceGt25Pct: 46,
  /** Active capital participants with platform >75% of income (Sep 2015) */
  capitalRelianceGt75Pct: 17,
  /** Median driver platform share of family income (~2019–21, JPMCI) */
  medianDriverSharePct: 10,
  /** Peak monthly OPE participation early 2020 (%) */
  peakMonthlyParticipationPct: 2.5,
  /** April 2020 monthly participation trough (%) */
  covidTroughMonthlyPct: 1.9,
  /** MoM participation drop at pandemic onset (%) */
  covidParticipationDropPct: 25,
  /** Trailing-year participation near Jan 2020 (%) */
  trailingYearParticipationPct: 7.5,
  /** Driver April 2020 median revenue drop among actives (%) */
  driverApr2020RevenueDropPct: 40,
  /** Fed SHED 2024: any gig activity prior month (%) */
  shedAnyGigPct: 20,
  /** Fed SHED 2024: platform short-term tasks (%) */
  shedPlatformTasksPct: 4,
  /** Fed SHED: gig is main job among gig adults (%) */
  shedMainJobPct: 21,
  /** Fed SHED: without gig would have trouble making ends meet (%) */
  shedEndsMeetPct: 31,
  /** Fed SHED: platform taskers wishing pay more consistent (%) */
  shedWishConsistentPlatformPct: 61,
  /** Population MoM: share with >30% total-income change (JPMCI 2016) */
  popMomGt30Pct: 55,
  /** Population avg absolute MoM total-income change (%) */
  popMomAvgAbsPct: 40,
  confidence: "disclosed" as Confidence,
} as const;

/** Monthly participation path — desk read of JPMCI pandemic Figure 1 */
export type ParticipationRow = {
  yearMonth: string;
  label: string;
  monthlyPct: number;
  trailing12mPct: number;
  confidence: Confidence;
};

export const PARTICIPATION_PATH: ParticipationRow[] = [
  { yearMonth: "2018-04", label: "Apr '18", monthlyPct: 2.0, trailing12mPct: 6.0, confidence: "estimated" },
  { yearMonth: "2018-10", label: "Oct '18", monthlyPct: 2.15, trailing12mPct: 6.4, confidence: "estimated" },
  { yearMonth: "2019-04", label: "Apr '19", monthlyPct: 2.3, trailing12mPct: 6.8, confidence: "estimated" },
  { yearMonth: "2019-10", label: "Oct '19", monthlyPct: 2.4, trailing12mPct: 7.2, confidence: "estimated" },
  { yearMonth: "2020-01", label: "Jan '20", monthlyPct: 2.5, trailing12mPct: 7.5, confidence: "disclosed" },
  { yearMonth: "2020-03", label: "Mar '20", monthlyPct: 2.5, trailing12mPct: 7.6, confidence: "estimated" },
  { yearMonth: "2020-04", label: "Apr '20", monthlyPct: 1.9, trailing12mPct: 7.4, confidence: "disclosed" },
  { yearMonth: "2020-07", label: "Jul '20", monthlyPct: 2.05, trailing12mPct: 7.3, confidence: "estimated" },
  { yearMonth: "2020-10", label: "Oct '20", monthlyPct: 2.15, trailing12mPct: 7.2, confidence: "estimated" },
  { yearMonth: "2021-01", label: "Jan '21", monthlyPct: 2.25, trailing12mPct: 7.3, confidence: "estimated" },
  { yearMonth: "2021-04", label: "Apr '21", monthlyPct: 2.35, trailing12mPct: 7.4, confidence: "estimated" },
  { yearMonth: "2021-06", label: "Jun '21", monthlyPct: 2.45, trailing12mPct: 7.5, confidence: "disclosed" },
];

export type SectorId = "transport" | "nonTransport" | "selling" | "leasing";

export type SectorParticipationRow = {
  yearMonth: string;
  label: string;
  transport: number;
  nonTransport: number;
  selling: number;
  leasing: number;
  confidence: Confidence;
};

/** Desk read of JPMCI pandemic Figure 2 sector participation rates (%) */
export const SECTOR_PARTICIPATION: SectorParticipationRow[] = [
  { yearMonth: "2018-04", label: "Apr '18", transport: 1.3, nonTransport: 0.1, selling: 0.6, leasing: 0.2, confidence: "estimated" },
  { yearMonth: "2019-01", label: "Jan '19", transport: 1.35, nonTransport: 0.1, selling: 0.7, leasing: 0.2, confidence: "estimated" },
  { yearMonth: "2019-10", label: "Oct '19", transport: 1.45, nonTransport: 0.1, selling: 0.8, leasing: 0.2, confidence: "estimated" },
  { yearMonth: "2020-03", label: "Mar '20", transport: 1.5, nonTransport: 0.1, selling: 0.85, leasing: 0.2, confidence: "disclosed" },
  { yearMonth: "2020-04", label: "Apr '20", transport: 0.95, nonTransport: 0.1, selling: 0.88, leasing: 0.1, confidence: "disclosed" },
  { yearMonth: "2020-10", label: "Oct '20", transport: 1.1, nonTransport: 0.1, selling: 0.9, leasing: 0.12, confidence: "estimated" },
  { yearMonth: "2021-06", label: "Jun '21", transport: 1.35, nonTransport: 0.1, selling: 0.9, leasing: 0.2, confidence: "estimated" },
];

/** Median monthly platform revenue among actives by sector ($) — Figure 6 path */
export type SectorMedianEarnRow = {
  yearMonth: string;
  label: string;
  transport: number;
  nonTransport: number;
  selling: number;
  leasing: number;
  confidence: Confidence;
};

export const SECTOR_MEDIAN_EARN: SectorMedianEarnRow[] = [
  { yearMonth: "2019-01", label: "Jan '19", transport: 480, nonTransport: 500, selling: 100, leasing: 1300, confidence: "estimated" },
  { yearMonth: "2019-07", label: "Jul '19", transport: 470, nonTransport: 510, selling: 100, leasing: 1280, confidence: "estimated" },
  { yearMonth: "2020-01", label: "Jan '20", transport: 460, nonTransport: 500, selling: 100, leasing: 1300, confidence: "estimated" },
  { yearMonth: "2020-04", label: "Apr '20", transport: 280, nonTransport: 480, selling: 105, leasing: 600, confidence: "disclosed" },
  { yearMonth: "2020-07", label: "Jul '20", transport: 450, nonTransport: 500, selling: 100, leasing: 900, confidence: "estimated" },
  { yearMonth: "2021-01", label: "Jan '21", transport: 440, nonTransport: 490, selling: 100, leasing: 1100, confidence: "estimated" },
  { yearMonth: "2021-04", label: "Apr '21", transport: 300, nonTransport: 500, selling: 100, leasing: 1000, confidence: "disclosed" },
  { yearMonth: "2021-06", label: "Jun '21", transport: 420, nonTransport: 500, selling: 100, leasing: 1200, confidence: "estimated" },
];

/** Median platform share of family income by sector (%) — Figure 7 path */
export type SectorShareRow = {
  yearMonth: string;
  label: string;
  transport: number;
  nonTransport: number;
  selling: number;
  leasing: number;
  confidence: Confidence;
};

export const SECTOR_INCOME_SHARE: SectorShareRow[] = [
  { yearMonth: "2019-04", label: "Apr '19", transport: 15, nonTransport: 9, selling: 2, leasing: 17, confidence: "estimated" },
  { yearMonth: "2019-10", label: "Oct '19", transport: 13, nonTransport: 9, selling: 2, leasing: 16, confidence: "estimated" },
  { yearMonth: "2020-01", label: "Jan '20", transport: 12, nonTransport: 9, selling: 2, leasing: 17, confidence: "estimated" },
  { yearMonth: "2020-04", label: "Apr '20", transport: 10, nonTransport: 8, selling: 2, leasing: 9, confidence: "estimated" },
  { yearMonth: "2020-10", label: "Oct '20", transport: 10, nonTransport: 8, selling: 2, leasing: 15, confidence: "estimated" },
  { yearMonth: "2021-04", label: "Apr '21", transport: 10, nonTransport: 7, selling: 2.5, leasing: 18, confidence: "disclosed" },
  { yearMonth: "2021-06", label: "Jun '21", transport: 10, nonTransport: 7, selling: 2, leasing: 20, confidence: "estimated" },
];

/** Reliance bands among active participants — Sep 2015 JPMCI Figures 27–28 */
export type RelianceBand = {
  band: string;
  bandShort: string;
  laborPct: number;
  capitalPct: number;
  confidence: Confidence;
};

export const RELIANCE_BANDS: RelianceBand[] = [
  { band: "<25% of total income", bandShort: "<25%", laborPct: 54, capitalPct: 75, confidence: "estimated" },
  { band: "25–50% of total income", bandShort: "25–50%", laborPct: 12, capitalPct: 5, confidence: "estimated" },
  { band: "50–75% of total income", bandShort: "50–75%", laborPct: 9, capitalPct: 3, confidence: "estimated" },
  { band: ">75% of total income", bandShort: ">75%", laborPct: 25, capitalPct: 17, confidence: "disclosed" },
];

/**
 * Labor vs capital attachment + earnings — disclosed JPMCI 2016 finding 6.
 * "Majority paycheck" proxy = share with >75% reliance among actives.
 */
export type PlatformTypeRow = {
  platform: "Labor platforms" | "Capital platforms";
  activeMonthsPct: number;
  avgEarnActive: number;
  shareOfIncomePct: number;
  relianceGt25Pct: number;
  relianceGt75Pct: number;
  confidence: Confidence;
};

export const PLATFORM_TYPES: PlatformTypeRow[] = [
  {
    platform: "Labor platforms",
    activeMonthsPct: 56,
    avgEarnActive: 533,
    shareOfIncomePct: 33,
    relianceGt25Pct: 46,
    relianceGt75Pct: 25,
    confidence: "disclosed",
  },
  {
    platform: "Capital platforms",
    activeMonthsPct: 32,
    avgEarnActive: 314,
    shareOfIncomePct: 20,
    relianceGt25Pct: 25,
    relianceGt75Pct: 17,
    confidence: "disclosed",
  },
];

/** Substitute vs supplement — months with vs without platform earnings */
export type SubSupplementRow = {
  platform: "Labor" | "Capital";
  nonPlatformIncomeDeltaPct: number;
  platformContributionPct: number;
  totalIncomeDeltaPct: number;
  note: string;
  confidence: Confidence;
};

export const SUB_SUPPLEMENT: SubSupplementRow[] = [
  {
    platform: "Labor",
    nonPlatformIncomeDeltaPct: -14,
    platformContributionPct: 15,
    totalIncomeDeltaPct: 0.3,
    note: "Substitutes for non-platform shortfall",
    confidence: "disclosed",
  },
  {
    platform: "Capital",
    nonPlatformIncomeDeltaPct: -1,
    platformContributionPct: 7,
    totalIncomeDeltaPct: 7,
    note: "Supplements existing income",
    confidence: "disclosed",
  },
];

/** Fed SHED 2024 attitude / reliance bars among gig adults (or as noted) */
export type ShedAttitudeRow = {
  metric: string;
  metricShort: string;
  anyGigPct: number;
  shortTermPct: number;
  platformPct: number;
  sellingRentPct: number;
  confidence: Confidence;
};

export const SHED_ATTITUDES: ShedAttitudeRow[] = [
  {
    metric: "Wish pay was more consistent",
    metricShort: "Wish pay consistent",
    anyGigPct: 49,
    shortTermPct: 54,
    platformPct: 61,
    sellingRentPct: 46,
    confidence: "disclosed",
  },
  {
    metric: "Without it, trouble making ends meet",
    metricShort: "Ends-meet reliance",
    anyGigPct: 31,
    shortTermPct: 43,
    platformPct: 41,
    sellingRentPct: 27,
    confidence: "disclosed",
  },
  {
    metric: "Lets me work flexible hours",
    metricShort: "Flexibility",
    anyGigPct: 55,
    shortTermPct: 70,
    platformPct: 78,
    sellingRentPct: 48,
    confidence: "disclosed",
  },
  {
    metric: "Gives work-life balance",
    metricShort: "Work-life balance",
    anyGigPct: 35,
    shortTermPct: 46,
    platformPct: 52,
    sellingRentPct: 29,
    confidence: "disclosed",
  },
];

/** Fed SHED participation mix (% of all adults) */
export type ShedMixRow = {
  activity: string;
  pctOfAdults: number;
  confidence: Confidence;
};

export const SHED_MIX: ShedMixRow[] = [
  { activity: "Any gig activity", pctOfAdults: 20, confidence: "disclosed" },
  { activity: "Selling items", pctOfAdults: 13, confidence: "disclosed" },
  { activity: "Any short-term tasks", pctOfAdults: 9, confidence: "disclosed" },
  { activity: "Platform / app tasks", pctOfAdults: 4, confidence: "disclosed" },
  { activity: "Short-term rentals", pctOfAdults: 2, confidence: "disclosed" },
];

/** Implied MoM earnings swing: active vs inactive months for labor participants */
export type SwingScenarioRow = {
  scenario: string;
  monthA: number;
  monthB: number;
  absSwingPct: number;
  note: string;
  confidence: Confidence;
};

export const SWING_SCENARIOS: SwingScenarioRow[] = [
  {
    scenario: "Labor: active → idle month",
    monthA: 533,
    monthB: 0,
    absSwingPct: 100,
    note: "Active only 56% of months — idle months are $0 platform",
    confidence: "disclosed",
  },
  {
    scenario: "Capital: active → idle month",
    monthA: 314,
    monthB: 0,
    absSwingPct: 100,
    note: "Active only 32% of months",
    confidence: "disclosed",
  },
  {
    scenario: "Driver Apr '20 among actives",
    monthA: 460,
    monthB: 280,
    absSwingPct: 39,
    note: "~40% revenue drop for still-active drivers",
    confidence: "disclosed",
  },
  {
    scenario: "Typical W-2 MoM labor change",
    monthA: 100,
    monthB: 80,
    absSwingPct: 20,
    note: "~20% of income across quintiles (JPMCI labor force)",
    confidence: "disclosed",
  },
];

export const ANALYTICS = {
  /** Gap: trailing-year vs monthly participation at peak (pp) */
  trailingVsMonthlyGapPp: 5.0,
  /** Labor majority-reliance tail vs capital (pp) */
  majorityRelianceGapPp: 8,
  /** Labor active-months minus capital (pp) */
  activeMonthsGapPp: 24,
  /** Labor income share in active months minus median driver share (pp) */
  activeVsMedianShareGapPp: 23,
} as const;
