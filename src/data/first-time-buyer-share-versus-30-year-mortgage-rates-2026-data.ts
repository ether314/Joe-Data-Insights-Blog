/**
 * First-time buyer share versus 30-year mortgage rates — 2026 desk.
 *
 * Core question: Did NAR/FHFA first-time buyer share fall as Freddie Mac
 * 30-year fixed rates rose above 6%?
 *
 * Anchors: Freddie Mac Primary Mortgage Market Survey (PMMS / FRED
 * MORTGAGE30US); NAR Profile of Home Buyers and Sellers first-time share;
 * NAR REALTORS® Confidence Index monthly first-time buyer share; FHFA
 * purchase-only House Price Index (USSTHPI).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Freddie Mac 30-year fixed contract rates are weekly Primary Mortgage Market Survey prints (FRED MORTGAGE30US); annual and quarterly averages are arithmetic means of weekly observations. NAR first-time buyer share in the annual panel is the Profile of Home Buyers and Sellers primary-residence series (survey window typically July prior year–June report year). Monthly first-time share is the REALTORS® Confidence Index (RCI) existing-home buyer composition series — a different instrument from the Profile and not seasonally adjusted the same way. FHFA purchase-only House Price Index (USSTHPI) is quarterly; year-over-year changes use same-quarter prior-year levels. Rate-regime buckets classify calendar years by whether the Freddie Mac annual average was below 4%, 4–6%, or above 6%. Profile shares are owner-occupant primary residences and exclude investors/vacation homes; RCI monthly prints can differ from Profile annuals because of survey design and cash-buyer mix.";

export const SOURCES = [
  {
    label: "Freddie Mac — Primary Mortgage Market Survey",
    url: "https://www.freddiemac.com/pmms",
  },
  {
    label: "FRED — 30-Year Fixed Rate Mortgage Average (MORTGAGE30US)",
    url: "https://fred.stlouisfed.org/series/MORTGAGE30US",
  },
  {
    label: "NAR — Profile of Home Buyers and Sellers (2025)",
    url: "https://www.nar.realtor/research-and-statistics/research-reports/highlights-from-the-profile-of-home-buyers-and-sellers",
  },
  {
    label: "NAR — First-time buyer share falls to historic low of 21% (Nov 2025)",
    url: "https://www.nar.realtor/press-releases/first-time-home-buyer-share-falls-to-historic-low-of-21-median-age-rises-to-40",
  },
  {
    label: "NAR — REALTORS® Confidence Index",
    url: "https://www.nar.realtor/research-and-statistics/research-reports/realtors-confidence-index",
  },
  {
    label: "FHFA — House Price Index (purchase-only)",
    url: "https://www.fhfa.gov/data/hpi",
  },
  {
    label: "FRED — FHFA House Price Index (USSTHPI)",
    url: "https://fred.stlouisfed.org/series/USSTHPI",
  },
] as const;

export const VIZ_MARKERS = [
  "First-time share 21%",
  "30-year above 6% since late 2022",
  "Median first-time age 40",
] as const;

/** Headline punchline — NAR Profile 2025 + Freddie Mac 2025–2026 */
export const HEADLINE = {
  /** Latest NAR Profile first-time share (%) — 2025 report */
  latestFtbSharePct: 21,
  /** Prior Profile first-time share (%) — 2024 report */
  priorFtbSharePct: 24,
  /** Pre-hike Profile peak (%) — 2021 report */
  peakFtbSharePct: 34,
  /** Historical pre-2008 norm cited by NAR (%) */
  historicalNormPct: 40,
  /** Percentage-point drop, 2021 → 2025 */
  ftbDropPp: 13,
  /** Freddie Mac 2025 annual average 30-year (%) */
  avgRate2025Pct: 6.6,
  /** Freddie Mac 2021 annual average 30-year (%) — trough year */
  avgRate2021Pct: 2.96,
  /** First weekly print above 6% in the hike cycle */
  firstWeekAbove6: "2022-09-15",
  /** Weeks with rate ≥6% from 2022-09 through 2026-08 (approx) */
  weeksAbove6Approx: 200,
  /** Latest weekly 30-year (%) — week of 2026-08-27 */
  latestWeeklyRatePct: 6.66,
  /** 2026 YTD average through late August (%) */
  avgRate2026YtdPct: 6.36,
  /** Median first-time buyer age — 2025 Profile */
  medianFtbAge2025: 40,
  /** Median first-time buyer age — 2021 Profile */
  medianFtbAge2021: 33,
  /** FHFA HPI YoY latest (%) — 2026 Q2 */
  hpiYoyLatestPct: 3.0,
  /** FHFA HPI YoY peak (%) — 2022 Q2 */
  hpiYoyPeakPct: 20.4,
  /** NAR Profile-stated average mortgage rate during 2025 survey window (%) */
  profileSurveyAvgRatePct: 6.69,
} as const;

export type AnnualRow = {
  year: number;
  /** NAR Profile first-time buyer share of primary-residence buyers (%) */
  ftbSharePct: number;
  /** Freddie Mac annual-average 30-year fixed (%) */
  rateAvgPct: number;
  /** Median age of first-time buyers (years); null when not cited for that report */
  medianFtbAge: number | null;
  /** FHFA purchase-only HPI Q4 index level */
  hpiQ4: number;
  /** FHFA HPI Q4 year-over-year (%) */
  hpiYoyPct: number;
  /** True when calendar-year Freddie Mac average ≥ 6% */
  rateAbove6: boolean;
  confidence: Confidence;
};

/**
 * Annual crosswalk: NAR Profile report year × Freddie Mac calendar-year average.
 * Profile survey windows straddle mid-years; rate is calendar-year mean of weekly PMMS.
 */
export const ANNUAL: AnnualRow[] = [
  {
    year: 2015,
    ftbSharePct: 32,
    rateAvgPct: 3.85,
    medianFtbAge: 31,
    hpiQ4: 362.2,
    hpiYoyPct: 5.0,
    rateAbove6: false,
    confidence: "disclosed",
  },
  {
    year: 2016,
    ftbSharePct: 35,
    rateAvgPct: 3.65,
    medianFtbAge: 32,
    hpiQ4: 381.92,
    hpiYoyPct: 5.4,
    rateAbove6: false,
    confidence: "disclosed",
  },
  {
    year: 2017,
    ftbSharePct: 34,
    rateAvgPct: 3.99,
    medianFtbAge: 32,
    hpiQ4: 402.55,
    hpiYoyPct: 5.4,
    rateAbove6: false,
    confidence: "disclosed",
  },
  {
    year: 2018,
    ftbSharePct: 33,
    rateAvgPct: 4.54,
    medianFtbAge: 32,
    hpiQ4: 422.16,
    hpiYoyPct: 4.9,
    rateAbove6: false,
    confidence: "disclosed",
  },
  {
    year: 2019,
    ftbSharePct: 33,
    rateAvgPct: 3.94,
    medianFtbAge: 33,
    hpiQ4: 443.49,
    hpiYoyPct: 5.1,
    rateAbove6: false,
    confidence: "disclosed",
  },
  {
    year: 2020,
    ftbSharePct: 31,
    rateAvgPct: 3.11,
    medianFtbAge: 33,
    hpiQ4: 471.28,
    hpiYoyPct: 6.3,
    rateAbove6: false,
    confidence: "disclosed",
  },
  {
    year: 2021,
    ftbSharePct: 34,
    rateAvgPct: 2.96,
    medianFtbAge: 33,
    hpiQ4: 556.16,
    hpiYoyPct: 18.0,
    rateAbove6: false,
    confidence: "disclosed",
  },
  {
    year: 2022,
    ftbSharePct: 26,
    rateAvgPct: 5.34,
    medianFtbAge: 36,
    hpiQ4: 616.15,
    hpiYoyPct: 10.8,
    rateAbove6: false,
    confidence: "disclosed",
  },
  {
    year: 2023,
    ftbSharePct: 32,
    rateAvgPct: 6.81,
    medianFtbAge: 35,
    hpiQ4: 648.4,
    hpiYoyPct: 5.2,
    rateAbove6: true,
    confidence: "disclosed",
  },
  {
    year: 2024,
    ftbSharePct: 24,
    rateAvgPct: 6.72,
    medianFtbAge: 38,
    hpiQ4: 683.47,
    hpiYoyPct: 5.4,
    rateAbove6: true,
    confidence: "disclosed",
  },
  {
    year: 2025,
    ftbSharePct: 21,
    rateAvgPct: 6.6,
    medianFtbAge: 40,
    hpiQ4: 707.22,
    hpiYoyPct: 3.5,
    rateAbove6: true,
    confidence: "disclosed",
  },
];

export type QuarterlyRow = {
  label: string;
  year: number;
  quarter: number;
  /** Freddie Mac quarterly-average 30-year fixed (%) */
  rateAvgPct: number;
  /** FHFA purchase-only HPI index */
  hpiIndex: number;
  /** FHFA HPI same-quarter year-over-year (%) */
  hpiYoyPct: number;
  rateAbove6: boolean;
  confidence: Confidence;
};

/** Quarterly mortgage-rate / house-price path — Freddie Mac + FHFA */
export const QUARTERLY: QuarterlyRow[] = [
  { label: "2019 Q1", year: 2019, quarter: 1, rateAvgPct: 4.37, hpiIndex: 426.9, hpiYoyPct: 4.6, rateAbove6: false, confidence: "disclosed" },
  { label: "2019 Q2", year: 2019, quarter: 2, rateAvgPct: 4.01, hpiIndex: 434.06, hpiYoyPct: 4.4, rateAbove6: false, confidence: "disclosed" },
  { label: "2019 Q3", year: 2019, quarter: 3, rateAvgPct: 3.66, hpiIndex: 439.59, hpiYoyPct: 4.5, rateAbove6: false, confidence: "disclosed" },
  { label: "2019 Q4", year: 2019, quarter: 4, rateAvgPct: 3.7, hpiIndex: 443.49, hpiYoyPct: 5.1, rateAbove6: false, confidence: "disclosed" },
  { label: "2020 Q1", year: 2020, quarter: 1, rateAvgPct: 3.52, hpiIndex: 448.64, hpiYoyPct: 5.1, rateAbove6: false, confidence: "disclosed" },
  { label: "2020 Q2", year: 2020, quarter: 2, rateAvgPct: 3.24, hpiIndex: 453.17, hpiYoyPct: 4.4, rateAbove6: false, confidence: "disclosed" },
  { label: "2020 Q3", year: 2020, quarter: 3, rateAvgPct: 2.95, hpiIndex: 461.18, hpiYoyPct: 4.9, rateAbove6: false, confidence: "disclosed" },
  { label: "2020 Q4", year: 2020, quarter: 4, rateAvgPct: 2.76, hpiIndex: 471.28, hpiYoyPct: 6.3, rateAbove6: false, confidence: "disclosed" },
  { label: "2021 Q1", year: 2021, quarter: 1, rateAvgPct: 2.88, hpiIndex: 482.7, hpiYoyPct: 7.6, rateAbove6: false, confidence: "disclosed" },
  { label: "2021 Q2", year: 2021, quarter: 2, rateAvgPct: 3.0, hpiIndex: 509.5, hpiYoyPct: 12.4, rateAbove6: false, confidence: "disclosed" },
  { label: "2021 Q3", year: 2021, quarter: 3, rateAvgPct: 2.87, hpiIndex: 537.83, hpiYoyPct: 16.6, rateAbove6: false, confidence: "disclosed" },
  { label: "2021 Q4", year: 2021, quarter: 4, rateAvgPct: 3.08, hpiIndex: 556.16, hpiYoyPct: 18.0, rateAbove6: false, confidence: "disclosed" },
  { label: "2022 Q1", year: 2022, quarter: 1, rateAvgPct: 3.82, hpiIndex: 576.39, hpiYoyPct: 19.4, rateAbove6: false, confidence: "disclosed" },
  { label: "2022 Q2", year: 2022, quarter: 2, rateAvgPct: 5.27, hpiIndex: 613.46, hpiYoyPct: 20.4, rateAbove6: false, confidence: "disclosed" },
  { label: "2022 Q3", year: 2022, quarter: 3, rateAvgPct: 5.62, hpiIndex: 622.86, hpiYoyPct: 15.8, rateAbove6: false, confidence: "disclosed" },
  { label: "2022 Q4", year: 2022, quarter: 4, rateAvgPct: 6.66, hpiIndex: 616.15, hpiYoyPct: 10.8, rateAbove6: true, confidence: "disclosed" },
  { label: "2023 Q1", year: 2023, quarter: 1, rateAvgPct: 6.37, hpiIndex: 619.69, hpiYoyPct: 7.5, rateAbove6: true, confidence: "disclosed" },
  { label: "2023 Q2", year: 2023, quarter: 2, rateAvgPct: 6.51, hpiIndex: 637.85, hpiYoyPct: 4.0, rateAbove6: true, confidence: "disclosed" },
  { label: "2023 Q3", year: 2023, quarter: 3, rateAvgPct: 7.04, hpiIndex: 648.28, hpiYoyPct: 4.1, rateAbove6: true, confidence: "disclosed" },
  { label: "2023 Q4", year: 2023, quarter: 4, rateAvgPct: 7.3, hpiIndex: 648.4, hpiYoyPct: 5.2, rateAbove6: true, confidence: "disclosed" },
  { label: "2024 Q1", year: 2024, quarter: 1, rateAvgPct: 6.75, hpiIndex: 657.59, hpiYoyPct: 6.1, rateAbove6: true, confidence: "disclosed" },
  { label: "2024 Q2", year: 2024, quarter: 2, rateAvgPct: 7.0, hpiIndex: 673.16, hpiYoyPct: 5.5, rateAbove6: true, confidence: "disclosed" },
  { label: "2024 Q3", year: 2024, quarter: 3, rateAvgPct: 6.51, hpiIndex: 679.81, hpiYoyPct: 4.9, rateAbove6: true, confidence: "disclosed" },
  { label: "2024 Q4", year: 2024, quarter: 4, rateAvgPct: 6.63, hpiIndex: 683.47, hpiYoyPct: 5.4, rateAbove6: true, confidence: "disclosed" },
  { label: "2025 Q1", year: 2025, quarter: 1, rateAvgPct: 6.83, hpiIndex: 688.42, hpiYoyPct: 4.7, rateAbove6: true, confidence: "disclosed" },
  { label: "2025 Q2", year: 2025, quarter: 2, rateAvgPct: 6.79, hpiIndex: 698.69, hpiYoyPct: 3.8, rateAbove6: true, confidence: "disclosed" },
  { label: "2025 Q3", year: 2025, quarter: 3, rateAvgPct: 6.57, hpiIndex: 703.04, hpiYoyPct: 3.4, rateAbove6: true, confidence: "disclosed" },
  { label: "2025 Q4", year: 2025, quarter: 4, rateAvgPct: 6.23, hpiIndex: 707.22, hpiYoyPct: 3.5, rateAbove6: true, confidence: "disclosed" },
  { label: "2026 Q1", year: 2026, quarter: 1, rateAvgPct: 6.11, hpiIndex: 712.2, hpiYoyPct: 3.5, rateAbove6: true, confidence: "disclosed" },
  { label: "2026 Q2", year: 2026, quarter: 2, rateAvgPct: 6.41, hpiIndex: 719.87, hpiYoyPct: 3.0, rateAbove6: true, confidence: "disclosed" },
  { label: "2026 Q3", year: 2026, quarter: 3, rateAvgPct: 6.6, hpiIndex: 719.87, hpiYoyPct: 3.0, rateAbove6: true, confidence: "carried" },
];

export type MonthlyRciRow = {
  label: string;
  year: number;
  month: number;
  /** RCI first-time buyer share of existing-home purchases (%) */
  ftbSharePct: number;
  /** Freddie Mac monthly-average 30-year (%) for same month */
  rateAvgPct: number;
  confidence: Confidence;
};

/**
 * Selected NAR REALTORS® Confidence Index monthly first-time shares
 * paired with same-month Freddie Mac averages (illustrative path through the hike).
 */
export const MONTHLY_RCI: MonthlyRciRow[] = [
  { label: "2021-07", year: 2021, month: 7, ftbSharePct: 31, rateAvgPct: 2.87, confidence: "disclosed" },
  { label: "2021-12", year: 2021, month: 12, ftbSharePct: 30, rateAvgPct: 3.1, confidence: "disclosed" },
  { label: "2022-03", year: 2022, month: 3, ftbSharePct: 29, rateAvgPct: 4.17, confidence: "disclosed" },
  { label: "2022-06", year: 2022, month: 6, ftbSharePct: 28, rateAvgPct: 5.52, confidence: "disclosed" },
  { label: "2022-09", year: 2022, month: 9, ftbSharePct: 26, rateAvgPct: 6.11, confidence: "disclosed" },
  { label: "2022-12", year: 2022, month: 12, ftbSharePct: 27, rateAvgPct: 6.36, confidence: "disclosed" },
  { label: "2023-03", year: 2023, month: 3, ftbSharePct: 28, rateAvgPct: 6.54, confidence: "disclosed" },
  { label: "2023-06", year: 2023, month: 6, ftbSharePct: 29, rateAvgPct: 6.71, confidence: "disclosed" },
  { label: "2023-09", year: 2023, month: 9, ftbSharePct: 28, rateAvgPct: 7.2, confidence: "disclosed" },
  { label: "2023-12", year: 2023, month: 12, ftbSharePct: 27, rateAvgPct: 6.82, confidence: "disclosed" },
  { label: "2024-03", year: 2024, month: 3, ftbSharePct: 26, rateAvgPct: 6.82, confidence: "disclosed" },
  { label: "2024-06", year: 2024, month: 6, ftbSharePct: 25, rateAvgPct: 6.92, confidence: "disclosed" },
  { label: "2024-09", year: 2024, month: 9, ftbSharePct: 26, rateAvgPct: 6.18, confidence: "disclosed" },
  { label: "2024-12", year: 2024, month: 12, ftbSharePct: 27, rateAvgPct: 6.66, confidence: "disclosed" },
  { label: "2025-03", year: 2025, month: 3, ftbSharePct: 28, rateAvgPct: 6.65, confidence: "disclosed" },
  { label: "2025-06", year: 2025, month: 6, ftbSharePct: 29, rateAvgPct: 6.82, confidence: "disclosed" },
  { label: "2025-09", year: 2025, month: 9, ftbSharePct: 30, rateAvgPct: 6.35, confidence: "disclosed" },
  { label: "2025-12", year: 2025, month: 12, ftbSharePct: 31, rateAvgPct: 6.2, confidence: "disclosed" },
  { label: "2026-03", year: 2026, month: 3, ftbSharePct: 32, rateAvgPct: 6.15, confidence: "disclosed" },
  { label: "2026-07", year: 2026, month: 7, ftbSharePct: 33, rateAvgPct: 6.57, confidence: "disclosed" },
];

export type ScatterPoint = {
  year: number;
  rateAvgPct: number;
  ftbSharePct: number;
  rateAbove6: boolean;
  label: string;
};

export const SCATTER: ScatterPoint[] = ANNUAL.map((r) => ({
  year: r.year,
  rateAvgPct: r.rateAvgPct,
  ftbSharePct: r.ftbSharePct,
  rateAbove6: r.rateAbove6,
  label: String(r.year),
}));

export type RegimeRow = {
  id: string;
  label: string;
  rateBand: string;
  years: string;
  avgFtbSharePct: number;
  avgRatePct: number;
  avgMedianAge: number;
  nYears: number;
};

/** Rate-regime buckets on calendar-year Freddie Mac averages */
export const REGIMES: RegimeRow[] = [
  {
    id: "sub4",
    label: "Sub-4% years",
    rateBand: "< 4%",
    years: "2015–17, 2019–21",
    avgFtbSharePct: 33.1,
    avgRatePct: 3.58,
    avgMedianAge: 32.3,
    nYears: 7,
  },
  {
    id: "mid",
    label: "4–6% years",
    rateBand: "4–6%",
    years: "2018, 2022",
    avgFtbSharePct: 29.5,
    avgRatePct: 4.94,
    avgMedianAge: 34.0,
    nYears: 2,
  },
  {
    id: "above6",
    label: "Above-6% years",
    rateBand: "≥ 6%",
    years: "2023–25",
    avgFtbSharePct: 25.7,
    avgRatePct: 6.71,
    avgMedianAge: 37.7,
    nYears: 3,
  },
];

export type MilestoneRow = {
  id: string;
  when: string;
  title: string;
  detail: string;
};

export const MILESTONES: MilestoneRow[] = [
  {
    id: "trough",
    when: "2021",
    title: "Rate trough + FTB peak",
    detail: "Freddie Mac averaged 2.96%; NAR Profile first-time share hit 34%.",
  },
  {
    id: "cross6",
    when: "Sep 2022",
    title: "30-year crosses 6%",
    detail: "Weekly PMMS prints moved above 6% and stayed elevated into 2026.",
  },
  {
    id: "profile26",
    when: "2022 Profile",
    title: "Share collapses to 26%",
    detail: "First Profile print after the hike onset; median first-time age jumped to 36.",
  },
  {
    id: "rebound23",
    when: "2023 Profile",
    title: "Brief share rebound to 32%",
    detail: "Thin sales volume and less bidding competition briefly lifted the FTB mix.",
  },
  {
    id: "record24",
    when: "2024–25 Profiles",
    title: "Record lows 24% → 21%",
    detail: "Rates stayed above 6%; median first-time age climbed to 38 then 40.",
  },
];

export function filterAnnualFromYear(fromYear: number): AnnualRow[] {
  return ANNUAL.filter((r) => r.year >= fromYear);
}

export function filterQuarterlyFromYear(fromYear: number): QuarterlyRow[] {
  return QUARTERLY.filter((r) => r.year >= fromYear);
}

export function filterMonthlyFromYear(fromYear: number): MonthlyRciRow[] {
  return MONTHLY_RCI.filter((r) => r.year >= fromYear);
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}
