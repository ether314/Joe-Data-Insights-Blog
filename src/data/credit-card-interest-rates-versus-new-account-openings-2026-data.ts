/**
 * Credit-card interest rates versus new-account openings — 2026 desk.
 *
 * Core question: Did commercial-bank credit-card APRs stay elevated while the
 * pace of new revolving accounts slowed?
 *
 * Primary anchors: Federal Reserve G.19 commercial-bank card APRs
 * (TERMCBCCALLNS / TERMCBCCINTNS); Philadelphia Fed FR Y-14M large-bank
 * originations (RCCCONUMACT account counts, RCCCOORG credit-limit dollars,
 * RCCCOACTPCTSCORELT660 sub-660 share); NY Fed CCP revolving stock context;
 * CFPB Consumer Credit Card Market Report (2025) for market structure.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "G.19 commercial-bank interest rates on credit-card plans (all accounts and accounts assessed interest) are quarterly survey prints published by the Federal Reserve Board and mirrored on FRED as TERMCBCCALLNS / TERMCBCCINTNS — latest all-accounts APR 20.94% (May 2026 / 2026 Q2). Large-bank new-account counts and original credit-limit dollars are Philadelphia Fed FR Y-14M aggregates (RCCCONUMACT, RCCCOORG); the Y-14M panel covers BHCs/IHCs/covered SLHCs with ≥$100B assets that meet card-portfolio materiality thresholds, not the entire U.S. card market. Sub-660 origination share is RCCCOACTPCTSCORELT660. NY Fed Consumer Credit Panel revolving balances (~$1.26T as of 2026 Q2) provide stock context, not a parallel origination census. CFPB market reports supply purchase-volume and open-account structure. Y-14M history revises when the reporting panel changes.";

export const SOURCES = [
  {
    label: "Federal Reserve — G.19 Consumer Credit (terms of credit)",
    url: "https://www.federalreserve.gov/releases/g19/current/default.htm",
  },
  {
    label: "FRED — Commercial bank interest rate, all credit-card accounts (TERMCBCCALLNS)",
    url: "https://fred.stlouisfed.org/series/TERMCBCCALLNS",
  },
  {
    label: "FRED — Commercial bank interest rate, accounts assessed interest (TERMCBCCINTNS)",
    url: "https://fred.stlouisfed.org/series/TERMCBCCINTNS",
  },
  {
    label: "Philadelphia Fed — Large Bank Credit Card and Mortgage Data (FR Y-14M)",
    url: "https://www.philadelphiafed.org/surveys-and-data/large-bank-credit-card-and-mortgage-data",
  },
  {
    label: "FRED — Large-bank new credit-card accounts (RCCCONUMACT)",
    url: "https://fred.stlouisfed.org/series/RCCCONUMACT",
  },
  {
    label: "FRED — Large-bank new credit-card origination dollars (RCCCOORG)",
    url: "https://fred.stlouisfed.org/series/RCCCOORG",
  },
  {
    label: "NY Fed — Quarterly Report on Household Debt and Credit",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "CFPB — The Consumer Credit Card Market (2025 report)",
    url: "https://www.consumerfinance.gov/data-research/research-reports/consumer-credit-card-market-report/",
  },
] as const;

export const VIZ_MARKERS = [
  "All-accounts APR 20.94%",
  "New accounts 17% below 2022 peak",
  "Sub-660 share trough 15.6%",
] as const;

/** Headline punchline — G.19 May 2026 + Y-14M 2026 Q1 */
export const HEADLINE = {
  /** Latest all-accounts commercial-bank card APR (%) */
  latestAprAllPct: 20.94,
  /** Latest assessed-interest APR (%) */
  latestAprAssessedPct: 22.15,
  /** Peak all-accounts APR (%) — 2024 Q3 */
  peakAprAllPct: 21.76,
  /** Peak assessed-interest APR (%) — 2024 Q3 */
  peakAprAssessedPct: 23.37,
  /** Pre-tightening trough all-accounts APR (%) — 2021 Q4 */
  troughAprAllPct: 14.51,
  /** Percentage-point lift, trough → latest */
  aprLiftPp: 6.43,
  /** Percentage-point lift, trough → peak */
  aprPeakLiftPp: 7.25,
  /** Peak quarterly new accounts (millions) — 2022 Q3 */
  peakNewAccountsM: 20.86,
  /** Latest quarterly new accounts (millions) — 2026 Q1 */
  latestNewAccountsM: 17.12,
  /** Share below peak (%) */
  accountsBelowPeakPct: 17.9,
  /** Softest post-2021 quarterly new accounts (millions) — 2025 Q1 */
  softestNewAccountsM: 15.4,
  /** Calendar-year new accounts 2022 (millions) */
  annualAccounts2022M: 79.22,
  /** Calendar-year new accounts 2023 (millions) */
  annualAccounts2023M: 77.53,
  /** Calendar-year new accounts 2024 (millions) */
  annualAccounts2024M: 68.86,
  /** Calendar-year new accounts 2025 (millions) */
  annualAccounts2025M: 69.61,
  /** Peak quarterly credit-limit originations ($B) — 2023 Q2 */
  peakLimitOrigBn: 114.77,
  /** Latest quarterly credit-limit originations ($B) — 2026 Q1 */
  latestLimitOrigBn: 105.53,
  /** Sub-660 share of new accounts trough (%) — 2024 Q3 */
  sub660TroughPct: 15.59,
  /** Sub-660 share latest (%) — 2026 Q1 */
  sub660LatestPct: 19.15,
  /** Sub-660 share late-2021 peak (%) — 2021 Q4 */
  sub660PeakPct: 25.15,
  /** NY Fed CCP credit-card stock ($T) — 2026 Q2 */
  nyFedCardStockT: 1.26,
  /** Average original limit implied at peak accounts quarter ($k) */
  avgLimitAtPeakAccountsK: 5.06,
  /** Average original limit implied latest ($k) */
  avgLimitLatestK: 6.16,
} as const;

export interface QuarterRow {
  quarter: string;
  year: number;
  q: number;
  /** All-accounts APR (%); null if G.19 not yet printed for that quarter */
  aprAllPct: number | null;
  /** Assessed-interest APR (%) */
  aprAssessedPct: number | null;
  /** New accounts (millions) */
  newAccountsM: number;
  /** Original credit-limit dollars ($B) */
  limitOrigBn: number;
  /** Share of new accounts with score <660 (%) */
  sub660Pct: number;
  /** Implied average original limit ($k) */
  avgLimitK: number;
  confidence: Confidence;
}

/** Align G.19 mid-quarter print months (Feb/May/Aug/Nov) to calendar quarters. */
export const QUARTERLY: QuarterRow[] = [
  {
    quarter: "2019 Q1",
    year: 2019,
    q: 1,
    aprAllPct: 15.09,
    aprAssessedPct: 16.91,
    newAccountsM: 17.07,
    limitOrigBn: 85.44,
    sub660Pct: 21.39,
    avgLimitK: 5.01,
    confidence: "disclosed",
  },
  {
    quarter: "2019 Q2",
    year: 2019,
    q: 2,
    aprAllPct: 15.13,
    aprAssessedPct: 17.14,
    newAccountsM: 18.91,
    limitOrigBn: 89.76,
    sub660Pct: 23.35,
    avgLimitK: 4.75,
    confidence: "disclosed",
  },
  {
    quarter: "2019 Q3",
    year: 2019,
    q: 3,
    aprAllPct: 15.1,
    aprAssessedPct: 16.97,
    newAccountsM: 19.19,
    limitOrigBn: 89.47,
    sub660Pct: 23.75,
    avgLimitK: 4.66,
    confidence: "disclosed",
  },
  {
    quarter: "2019 Q4",
    year: 2019,
    q: 4,
    aprAllPct: 14.87,
    aprAssessedPct: 16.88,
    newAccountsM: 21.0,
    limitOrigBn: 92.07,
    sub660Pct: 24.4,
    avgLimitK: 4.38,
    confidence: "disclosed",
  },
  {
    quarter: "2020 Q1",
    year: 2020,
    q: 1,
    aprAllPct: 15.09,
    aprAssessedPct: 16.61,
    newAccountsM: 16.45,
    limitOrigBn: 80.74,
    sub660Pct: 22.15,
    avgLimitK: 4.91,
    confidence: "disclosed",
  },
  {
    quarter: "2020 Q2",
    year: 2020,
    q: 2,
    aprAllPct: 14.52,
    aprAssessedPct: 15.78,
    newAccountsM: 9.2,
    limitOrigBn: 39.41,
    sub660Pct: 18.16,
    avgLimitK: 4.28,
    confidence: "disclosed",
  },
  {
    quarter: "2020 Q3",
    year: 2020,
    q: 3,
    aprAllPct: 14.58,
    aprAssessedPct: 16.43,
    newAccountsM: 11.97,
    limitOrigBn: 46.54,
    sub660Pct: 18.11,
    avgLimitK: 3.89,
    confidence: "disclosed",
  },
  {
    quarter: "2020 Q4",
    year: 2020,
    q: 4,
    aprAllPct: 14.65,
    aprAssessedPct: 16.28,
    newAccountsM: 16.11,
    limitOrigBn: 57.96,
    sub660Pct: 23.4,
    avgLimitK: 3.6,
    confidence: "disclosed",
  },
  {
    quarter: "2021 Q1",
    year: 2021,
    q: 1,
    aprAllPct: 14.75,
    aprAssessedPct: 15.91,
    newAccountsM: 14.34,
    limitOrigBn: 57.04,
    sub660Pct: 22.27,
    avgLimitK: 3.98,
    confidence: "disclosed",
  },
  {
    quarter: "2021 Q2",
    year: 2021,
    q: 2,
    aprAllPct: 14.61,
    aprAssessedPct: 16.3,
    newAccountsM: 18.7,
    limitOrigBn: 79.33,
    sub660Pct: 24.78,
    avgLimitK: 4.24,
    confidence: "disclosed",
  },
  {
    quarter: "2021 Q3",
    year: 2021,
    q: 3,
    aprAllPct: 14.54,
    aprAssessedPct: 17.13,
    newAccountsM: 19.38,
    limitOrigBn: 87.31,
    sub660Pct: 24.1,
    avgLimitK: 4.51,
    confidence: "disclosed",
  },
  {
    quarter: "2021 Q4",
    year: 2021,
    q: 4,
    aprAllPct: 14.51,
    aprAssessedPct: 16.44,
    newAccountsM: 20.58,
    limitOrigBn: 93.22,
    sub660Pct: 25.15,
    avgLimitK: 4.53,
    confidence: "disclosed",
  },
  {
    quarter: "2022 Q1",
    year: 2022,
    q: 1,
    aprAllPct: 14.56,
    aprAssessedPct: 16.17,
    newAccountsM: 17.44,
    limitOrigBn: 87.48,
    sub660Pct: 23.08,
    avgLimitK: 5.02,
    confidence: "disclosed",
  },
  {
    quarter: "2022 Q2",
    year: 2022,
    q: 2,
    aprAllPct: 15.13,
    aprAssessedPct: 16.65,
    newAccountsM: 20.35,
    limitOrigBn: 102.02,
    sub660Pct: 23.93,
    avgLimitK: 5.01,
    confidence: "disclosed",
  },
  {
    quarter: "2022 Q3",
    year: 2022,
    q: 3,
    aprAllPct: 16.27,
    aprAssessedPct: 18.43,
    newAccountsM: 20.86,
    limitOrigBn: 105.52,
    sub660Pct: 22.83,
    avgLimitK: 5.06,
    confidence: "disclosed",
  },
  {
    quarter: "2022 Q4",
    year: 2022,
    q: 4,
    aprAllPct: 19.07,
    aprAssessedPct: 20.4,
    newAccountsM: 20.57,
    limitOrigBn: 104.57,
    sub660Pct: 23.36,
    avgLimitK: 5.08,
    confidence: "disclosed",
  },
  {
    quarter: "2023 Q1",
    year: 2023,
    q: 1,
    aprAllPct: 20.09,
    aprAssessedPct: 20.92,
    newAccountsM: 18.17,
    limitOrigBn: 104.85,
    sub660Pct: 20.26,
    avgLimitK: 5.77,
    confidence: "disclosed",
  },
  {
    quarter: "2023 Q2",
    year: 2023,
    q: 2,
    aprAllPct: 20.84,
    aprAssessedPct: 22.16,
    newAccountsM: 19.95,
    limitOrigBn: 114.77,
    sub660Pct: 19.6,
    avgLimitK: 5.75,
    confidence: "disclosed",
  },
  {
    quarter: "2023 Q3",
    year: 2023,
    q: 3,
    aprAllPct: 21.19,
    aprAssessedPct: 22.77,
    newAccountsM: 19.52,
    limitOrigBn: 110.49,
    sub660Pct: 18.23,
    avgLimitK: 5.66,
    confidence: "disclosed",
  },
  {
    quarter: "2023 Q4",
    year: 2023,
    q: 4,
    aprAllPct: 21.47,
    aprAssessedPct: 22.75,
    newAccountsM: 19.89,
    limitOrigBn: 107.07,
    sub660Pct: 18.65,
    avgLimitK: 5.38,
    confidence: "disclosed",
  },
  {
    quarter: "2024 Q1",
    year: 2024,
    q: 1,
    aprAllPct: 21.59,
    aprAssessedPct: 22.63,
    newAccountsM: 16.8,
    limitOrigBn: 102.98,
    sub660Pct: 17.4,
    avgLimitK: 6.13,
    confidence: "disclosed",
  },
  {
    quarter: "2024 Q2",
    year: 2024,
    q: 2,
    aprAllPct: 21.51,
    aprAssessedPct: 22.78,
    newAccountsM: 17.53,
    limitOrigBn: 106.01,
    sub660Pct: 16.68,
    avgLimitK: 6.05,
    confidence: "disclosed",
  },
  {
    quarter: "2024 Q3",
    year: 2024,
    q: 3,
    aprAllPct: 21.76,
    aprAssessedPct: 23.37,
    newAccountsM: 16.93,
    limitOrigBn: 99.57,
    sub660Pct: 15.59,
    avgLimitK: 5.88,
    confidence: "disclosed",
  },
  {
    quarter: "2024 Q4",
    year: 2024,
    q: 4,
    aprAllPct: 21.47,
    aprAssessedPct: 22.8,
    newAccountsM: 17.6,
    limitOrigBn: 100.32,
    sub660Pct: 16.62,
    avgLimitK: 5.7,
    confidence: "disclosed",
  },
  {
    quarter: "2025 Q1",
    year: 2025,
    q: 1,
    aprAllPct: 21.37,
    aprAssessedPct: 21.91,
    newAccountsM: 15.4,
    limitOrigBn: 97.12,
    sub660Pct: 16.06,
    avgLimitK: 6.31,
    confidence: "disclosed",
  },
  {
    quarter: "2025 Q2",
    year: 2025,
    q: 2,
    aprAllPct: 21.16,
    aprAssessedPct: 22.25,
    newAccountsM: 17.54,
    limitOrigBn: 109.35,
    sub660Pct: 16.17,
    avgLimitK: 6.23,
    confidence: "disclosed",
  },
  {
    quarter: "2025 Q3",
    year: 2025,
    q: 3,
    aprAllPct: 21.39,
    aprAssessedPct: 22.83,
    newAccountsM: 17.74,
    limitOrigBn: 106.07,
    sub660Pct: 16.43,
    avgLimitK: 5.98,
    confidence: "disclosed",
  },
  {
    quarter: "2025 Q4",
    year: 2025,
    q: 4,
    aprAllPct: 20.97,
    aprAssessedPct: 22.3,
    newAccountsM: 18.93,
    limitOrigBn: 109.93,
    sub660Pct: 17.77,
    avgLimitK: 5.81,
    confidence: "disclosed",
  },
  {
    quarter: "2026 Q1",
    year: 2026,
    q: 1,
    aprAllPct: 21.0,
    aprAssessedPct: 21.52,
    newAccountsM: 17.12,
    limitOrigBn: 105.53,
    sub660Pct: 19.15,
    avgLimitK: 6.16,
    confidence: "disclosed",
  },
  {
    quarter: "2026 Q2",
    year: 2026,
    q: 2,
    aprAllPct: 20.94,
    aprAssessedPct: 22.15,
    newAccountsM: 17.12,
    limitOrigBn: 105.53,
    sub660Pct: 19.15,
    avgLimitK: 6.16,
    confidence: "carried",
  },
];

export interface AnnualRow {
  year: number;
  newAccountsM: number;
  limitOrigBn: number;
  avgAprAllPct: number;
  avgSub660Pct: number;
  confidence: Confidence;
}

export const ANNUAL: AnnualRow[] = [
  {
    year: 2019,
    newAccountsM: 76.17,
    limitOrigBn: 356.74,
    avgAprAllPct: 15.05,
    avgSub660Pct: 23.22,
    confidence: "disclosed",
  },
  {
    year: 2020,
    newAccountsM: 53.73,
    limitOrigBn: 224.65,
    avgAprAllPct: 14.71,
    avgSub660Pct: 20.46,
    confidence: "disclosed",
  },
  {
    year: 2021,
    newAccountsM: 73.0,
    limitOrigBn: 316.9,
    avgAprAllPct: 14.6,
    avgSub660Pct: 24.08,
    confidence: "disclosed",
  },
  {
    year: 2022,
    newAccountsM: 79.22,
    limitOrigBn: 399.59,
    avgAprAllPct: 16.26,
    avgSub660Pct: 23.3,
    confidence: "disclosed",
  },
  {
    year: 2023,
    newAccountsM: 77.53,
    limitOrigBn: 437.18,
    avgAprAllPct: 20.9,
    avgSub660Pct: 19.19,
    confidence: "disclosed",
  },
  {
    year: 2024,
    newAccountsM: 68.86,
    limitOrigBn: 408.88,
    avgAprAllPct: 21.58,
    avgSub660Pct: 16.57,
    confidence: "disclosed",
  },
  {
    year: 2025,
    newAccountsM: 69.61,
    limitOrigBn: 422.47,
    avgAprAllPct: 21.22,
    avgSub660Pct: 16.61,
    confidence: "disclosed",
  },
];

export interface ScatterPoint {
  quarter: string;
  year: number;
  aprAllPct: number;
  newAccountsM: number;
  limitOrigBn: number;
  era: "pre-hike" | "tightening" | "elevated";
}

/** Dual-axis scatter fuel — exclude carried 2026 Q2 duplicate accounts. */
export const SCATTER: ScatterPoint[] = QUARTERLY.filter(
  (r) => r.aprAllPct != null && r.confidence === "disclosed",
).map((r) => {
  const apr = r.aprAllPct as number;
  let era: ScatterPoint["era"] = "pre-hike";
  if (apr >= 20) era = "elevated";
  else if (apr >= 15.5) era = "tightening";
  return {
    quarter: r.quarter,
    year: r.year,
    aprAllPct: apr,
    newAccountsM: r.newAccountsM,
    limitOrigBn: r.limitOrigBn,
    era,
  };
});

export interface RegimeSlice {
  id: string;
  label: string;
  start: string;
  end: string;
  avgAprPct: number;
  avgAccountsM: number;
  avgLimitBn: number;
  note: string;
}

export const REGIMES: RegimeSlice[] = [
  {
    id: "pre",
    label: "Pre-hike plateau",
    start: "2019 Q1",
    end: "2022 Q1",
    avgAprPct: 14.8,
    avgAccountsM: 17.0,
    avgLimitBn: 75.9,
    note: "All-accounts APR hovered near 14.5–15.1% while large-bank openings rebuilt from the 2020 collapse.",
  },
  {
    id: "hike",
    label: "APR ascent",
    start: "2022 Q2",
    end: "2023 Q4",
    avgAprPct: 19.15,
    avgAccountsM: 19.9,
    avgLimitBn: 107.0,
    note: "Policy-rate pass-through lifted card APRs ~5–7 pp while account openings stayed near cycle highs.",
  },
  {
    id: "elevated",
    label: "High APR, slower openings",
    start: "2024 Q1",
    end: "2026 Q1",
    avgAprPct: 21.29,
    avgAccountsM: 17.29,
    avgLimitBn: 104.1,
    note: "APRs stayed above 20.9% while quarterly new accounts ran ~13–18% below the 2022 peak.",
  },
];

export const SUMMARY_TABLE = [
  {
    metric: "All-accounts APR (G.19)",
    trough2021: "14.51%",
    peak2024: "21.76%",
    latest: "20.94%",
  },
  {
    metric: "Assessed-interest APR",
    trough2021: "16.44%",
    peak2024: "23.37%",
    latest: "22.15%",
  },
  {
    metric: "Large-bank new accounts / qtr",
    trough2021: "20.58M (Q4)",
    peak2024: "20.86M (2022 Q3)",
    latest: "17.12M (2026 Q1)",
  },
  {
    metric: "Credit-limit originations / qtr",
    trough2021: "$93.2B (Q4)",
    peak2024: "$114.8B (2023 Q2)",
    latest: "$105.5B (2026 Q1)",
  },
  {
    metric: "Sub-660 share of new accounts",
    trough2021: "25.2% (Q4)",
    peak2024: "15.6% (2024 Q3)",
    latest: "19.2% (2026 Q1)",
  },
  {
    metric: "Calendar-year new accounts",
    trough2021: "73.0M (2021)",
    peak2024: "79.2M (2022)",
    latest: "69.6M (2025)",
  },
] as const;

export function fmtPct(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtM(n: number, digits = 2): string {
  return `${n.toFixed(digits)}M`;
}

export function fmtBn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}B`;
}

export function filterFromYear(rows: QuarterRow[], fromYear: number): QuarterRow[] {
  return rows.filter((r) => r.year >= fromYear);
}
