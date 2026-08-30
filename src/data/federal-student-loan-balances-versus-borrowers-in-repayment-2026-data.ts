/**
 * Federal student loan balances versus borrowers in repayment — 2026 desk.
 *
 * Core question: What share of outstanding Direct Loan / ED-managed dollars
 * sits with borrowers currently in repayment versus forbearance, deferment,
 * default, or in-school/grace statuses?
 *
 * Primary anchors: FSA Data Center quarterly portfolio summaries through
 * March 31, 2026 (GENERAL-26-38); prior-quarter prints for Dec 2025 and
 * June 2025; NY Fed Consumer Credit Panel household student-loan stock;
 * CBO student-loan baseline for fiscal context.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Federally managed portfolio (Direct Loans + ED-held FFEL/Perkins): FSA GENERAL-26-38 through March 31, 2026 — $1.64T across 40.9M recipient accounts. Current repayment or delinquency: 17.2M recipients (42%) holding $633B (39%). Forbearance: 8.4M recipients (~20%) / $485B. Deferment: 3.6M (9%) / $157B. Default: ~9M / $220B (>13%). In-school + grace balances: >8% of outstanding. Active-repayment 31+ delinquency: 20% of recipients / 15.5% of dollars among those expected to pay. IDR: 13M borrowers (44% of repayment-plan population) holding $784B (62% of ED-serviced repayment-plan dollars). Recipient counts are loan-status based and can double-count multi-status borrowers. NY Fed CCP student-loan stock (~$1.66T) includes private loans and is not status-partitioned the same way. Residual 'other' balances are desk-carried so status dollars sum to the disclosed portfolio.";

export const SOURCES = [
  {
    label:
      "FSA — Updated Reports to FSA Data Center (GENERAL-26-38, data through Mar 31, 2026)",
    url: "https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-06-23/federal-student-aid-posts-updated-reports-fsa-data-center",
  },
  {
    label:
      "FSA — Updated Reports to FSA Data Center (GENERAL-26-15, data through Dec 31, 2025)",
    url: "https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-03-13/federal-student-aid-posts-updated-reports-fsa-data-center",
  },
  {
    label:
      "FSA — Updated Reports to FSA Data Center (GENERAL-25-xx, data through Jun 30, 2025)",
    url: "https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2025-08-21/federal-student-aid-posts-updated-reports-fsa-data-center",
  },
  {
    label: "FSA Data Center — Portfolio by Loan Status",
    url: "https://studentaid.gov/data-center",
  },
  {
    label: "NY Fed — Quarterly Report on Household Debt and Credit",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "CBO — Student Loan Programs baseline / budget options",
    url: "https://www.cbo.gov/topics/education",
  },
] as const;

export const VIZ_MARKERS = [
  "39% of ED-managed dollars in repayment",
  "Forbearance $485B · Mar 2026",
  "Active-repay 31+ delinq 15.5%",
] as const;

/** Headline punchline — March 2026 federally managed portfolio */
export const HEADLINE = {
  /** Total federal student loan portfolio ($T) */
  totalPortfolioT: 1.7,
  /** Total federal recipients (millions) */
  totalRecipientsM: 42.6,
  /** Federally managed portfolio ($T) */
  managedPortfolioT: 1.64,
  /** Managed recipient accounts (millions) */
  managedRecipientsM: 40.9,
  /** Direct Loan share of outstanding (%) */
  directLoanSharePct: 90,
  /** Dollars in current repayment or delinquency ($B) */
  repaymentBalanceBn: 633,
  /** Share of managed dollars in repayment/delinquency (%) */
  repaymentDollarSharePct: 39,
  /** Recipients with ≥1 loan in repayment/delinquency (millions) */
  repaymentRecipientsM: 17.2,
  /** Share of managed recipients in repayment/delinquency (%) */
  repaymentRecipientSharePct: 42,
  /** Forbearance balance ($B) */
  forbearanceBn: 485,
  /** Forbearance recipients (millions) */
  forbearanceRecipientsM: 8.4,
  /** Deferment balance ($B) */
  defermentBn: 157,
  /** Deferment recipients (millions) */
  defermentRecipientsM: 3.6,
  /** Default balance ($B) */
  defaultBn: 220,
  /** Default borrowers (millions) */
  defaultBorrowersM: 9,
  /** Default share of managed dollars (%) */
  defaultDollarSharePct: 13.4,
  /** In-school + grace share of balances (%) */
  inSchoolGraceSharePct: 8,
  /** Active-repayment 31+ delinquency by recipients (%) */
  activeDelinqRecipientPct: 20,
  /** Active-repayment 31+ delinquency by dollars (%) */
  activeDelinqDollarPct: 15.5,
  /** Late-stage delinquency recipients at risk of default (millions) */
  lateStageDelinqM: 1.4,
  /** IDR enrolled borrowers (millions) */
  idrBorrowersM: 13,
  /** IDR share of repayment-plan population (%) */
  idrBorrowerSharePct: 44,
  /** IDR balances ($B) */
  idrBalanceBn: 784,
  /** IDR share of repayment-plan dollars (%) */
  idrDollarSharePct: 62,
  /** Pre-pause forbearance Feb 2020 ($B) */
  forbearancePrePauseBn: 133,
  /** Peak forbearance Jun 2023 ($B) */
  forbearancePeakBn: 1140,
  /** NY Fed CCP student-loan stock approx ($T) */
  nyFedStudentStockT: 1.66,
} as const;

export type StatusId =
  | "repayment"
  | "forbearance"
  | "deferment"
  | "default"
  | "inSchoolGraceOther";

export interface StatusSlice {
  id: StatusId;
  label: string;
  shortLabel: string;
  /** Outstanding balance ($B) */
  balanceBn: number;
  /** Share of managed portfolio dollars (%) */
  dollarSharePct: number;
  /** Recipient accounts with ≥1 loan in status (millions) */
  recipientsM: number;
  /** Share of managed recipients (%) — may exceed 100 across statuses */
  recipientSharePct: number;
  confidence: Confidence;
  note?: string;
}

/**
 * March 2026 federally managed status mix.
 * "Other" residual carries in-school, grace, bankruptcy, disability so
 * disclosed buckets + residual ≈ $1,640B.
 */
export const STATUS_MARCH_2026: StatusSlice[] = [
  {
    id: "repayment",
    label: "Current repayment or delinquency",
    shortLabel: "Repayment",
    balanceBn: 633,
    dollarSharePct: 39,
    recipientsM: 17.2,
    recipientSharePct: 42,
    confidence: "disclosed",
    note: "Includes current and delinquent accounts expected to pay",
  },
  {
    id: "forbearance",
    label: "Forbearance (incl. residual SAVE)",
    shortLabel: "Forbearance",
    balanceBn: 485,
    dollarSharePct: 29.6,
    recipientsM: 8.4,
    recipientSharePct: 20.5,
    confidence: "disclosed",
    note: "Down from Dec 2025 as SAVE borrowers exit forbearance",
  },
  {
    id: "deferment",
    label: "Deferment",
    shortLabel: "Deferment",
    balanceBn: 157,
    dollarSharePct: 9.6,
    recipientsM: 3.6,
    recipientSharePct: 9,
    confidence: "disclosed",
    note: "Mostly education-related; overlaps with in-school loans",
  },
  {
    id: "default",
    label: "Default (≥360 days)",
    shortLabel: "Default",
    balanceBn: 220,
    dollarSharePct: 13.4,
    recipientsM: 9,
    recipientSharePct: 22,
    confidence: "disclosed",
    note: "+1.3M borrowers vs prior quarter after post-pause default wave",
  },
  {
    id: "inSchoolGraceOther",
    label: "In-school, grace & other nonpayment",
    shortLabel: "In-school/other",
    balanceBn: 145,
    dollarSharePct: 8.8,
    recipientsM: 7, // desk estimate; >14% in-school + 3% grace with overlaps
    recipientSharePct: 17,
    confidence: "estimated",
    note: "Residual so dollars sum to $1.64T; FSA cites >8% in-school+grace alone",
  },
];

export interface StatusVintage {
  period: string;
  sortKey: string;
  managedBn: number;
  repaymentBn: number;
  repaymentDollarSharePct: number;
  repaymentRecipientsM: number;
  forbearanceBn: number;
  forbearanceRecipientsM: number;
  defermentBn: number;
  defaultBn: number;
  defaultBorrowersM: number;
  activeDelinqDollarPct: number | null;
  confidence: Confidence;
}

/** Quarterly path for the repayment-share question */
export const STATUS_VINTAGE: StatusVintage[] = [
  {
    period: "Jun 2025",
    sortKey: "2025-06",
    managedBn: 1580,
    repaymentBn: 620, // ~half of recipients; dollars desk-carried near half of managed
    repaymentDollarSharePct: 39,
    repaymentRecipientsM: 18.3,
    forbearanceBn: 582,
    forbearanceRecipientsM: 10.3,
    defermentBn: 145,
    defaultBn: 150, // pre-wave estimate carried
    defaultBorrowersM: 5.2,
    activeDelinqDollarPct: null,
    confidence: "estimated",
  },
  {
    period: "Sep 2025",
    sortKey: "2025-09",
    managedBn: 1600,
    repaymentBn: 630,
    repaymentDollarSharePct: 39,
    repaymentRecipientsM: 17.8,
    forbearanceBn: 545,
    forbearanceRecipientsM: 9.8,
    defermentBn: 140,
    defaultBn: 160,
    defaultBorrowersM: 5.2,
    activeDelinqDollarPct: null,
    confidence: "estimated",
  },
  {
    period: "Dec 2025",
    sortKey: "2025-12",
    managedBn: 1610,
    repaymentBn: 647,
    repaymentDollarSharePct: 40,
    repaymentRecipientsM: 18.4,
    forbearanceBn: 504,
    forbearanceRecipientsM: 8.8,
    defermentBn: 138,
    defaultBn: 180,
    defaultBorrowersM: 7.7,
    activeDelinqDollarPct: 18.6,
    confidence: "disclosed",
  },
  {
    period: "Mar 2026",
    sortKey: "2026-03",
    managedBn: 1640,
    repaymentBn: 633,
    repaymentDollarSharePct: 39,
    repaymentRecipientsM: 17.2,
    forbearanceBn: 485,
    forbearanceRecipientsM: 8.4,
    defermentBn: 157,
    defaultBn: 220,
    defaultBorrowersM: 9,
    activeDelinqDollarPct: 15.5,
    confidence: "disclosed",
  },
];

export interface ForbearanceAnchor {
  period: string;
  sortKey: string;
  balanceBn: number;
  label: string;
  confidence: Confidence;
}

export const FORBEARANCE_PATH: ForbearanceAnchor[] = [
  {
    period: "Feb 2020",
    sortKey: "2020-02",
    balanceBn: 133,
    label: "Pre-pause baseline",
    confidence: "disclosed",
  },
  {
    period: "Jun 2023",
    sortKey: "2023-06",
    balanceBn: 1140,
    label: "Payment-pause peak",
    confidence: "disclosed",
  },
  {
    period: "Jun 2025",
    sortKey: "2025-06",
    balanceBn: 582,
    label: "SAVE litigation peak",
    confidence: "disclosed",
  },
  {
    period: "Sep 2025",
    sortKey: "2025-09",
    balanceBn: 545,
    label: "Post-SAVE unwind start",
    confidence: "disclosed",
  },
  {
    period: "Dec 2025",
    sortKey: "2025-12",
    balanceBn: 504,
    label: "6.5M still in SAVE forbearance",
    confidence: "disclosed",
  },
  {
    period: "Mar 2026",
    sortKey: "2026-03",
    balanceBn: 485,
    label: "SAVE exits continue",
    confidence: "disclosed",
  },
];

export interface ActiveRepaySplit {
  id: "current" | "delinq31toLate" | "lateStage";
  label: string;
  recipientSharePct: number;
  dollarSharePct: number;
  recipientsM: number;
}

/** Among active-repayment accounts only (excludes forbearance/deferment/etc.) */
export const ACTIVE_REPAY_SPLIT: ActiveRepaySplit[] = [
  {
    id: "current",
    label: "Current (<31 days)",
    recipientSharePct: 80,
    dollarSharePct: 84.5,
    recipientsM: 13.7, // ~80% of active-repay pool; desk from 20% delinq of ~17.2M
  },
  {
    id: "delinq31toLate",
    label: "31+ days delinquent (not late-stage)",
    recipientSharePct: 12,
    dollarSharePct: 9,
    recipientsM: 2.1,
  },
  {
    id: "lateStage",
    label: "Late-stage (default risk ≤6 mo)",
    recipientSharePct: 8,
    dollarSharePct: 6.5,
    recipientsM: 1.4,
  },
];

export interface IdrVintage {
  period: string;
  sortKey: string;
  borrowersM: number;
  borrowerSharePct: number;
  balanceBn: number;
  dollarSharePct: number;
  confidence: Confidence;
}

export const IDR_VINTAGE: IdrVintage[] = [
  {
    period: "Dec 2024",
    sortKey: "2024-12",
    borrowersM: 12.2,
    borrowerSharePct: 40,
    balanceBn: 732,
    dollarSharePct: 56,
    confidence: "estimated",
  },
  {
    period: "Mar 2025",
    sortKey: "2025-03",
    borrowersM: 12.4,
    borrowerSharePct: 41,
    balanceBn: 728,
    dollarSharePct: 55,
    confidence: "disclosed",
  },
  {
    period: "Dec 2025",
    sortKey: "2025-12",
    borrowersM: 12.9,
    borrowerSharePct: 42,
    balanceBn: 770,
    dollarSharePct: 60,
    confidence: "disclosed",
  },
  {
    period: "Mar 2026",
    sortKey: "2026-03",
    borrowersM: 13,
    borrowerSharePct: 44,
    balanceBn: 784,
    dollarSharePct: 62,
    confidence: "disclosed",
  },
];

export interface RecipientDollarRow {
  status: string;
  recipientsM: number;
  recipientSharePct: number;
  balanceBn: number;
  dollarSharePct: number;
  /** Dollars per recipient ($k) */
  avgBalanceK: number;
}

export const RECIPIENT_VS_DOLLAR: RecipientDollarRow[] = STATUS_MARCH_2026.map(
  (s) => ({
    status: s.shortLabel,
    recipientsM: s.recipientsM,
    recipientSharePct: s.recipientSharePct,
    balanceBn: s.balanceBn,
    dollarSharePct: s.dollarSharePct,
    avgBalanceK: Math.round((s.balanceBn * 1000) / s.recipientsM),
  }),
);

export const COMPARISON_TABLE = [
  {
    metric: "Managed portfolio",
    mar2026: "$1.64T",
    dec2025: "$1.61T",
    jun2025: "$1.58T",
  },
  {
    metric: "Repayment / delinquency $",
    mar2026: "$633B (39%)",
    dec2025: "$647B (40%)",
    jun2025: "~$620B (est.)",
  },
  {
    metric: "Forbearance $",
    mar2026: "$485B",
    dec2025: "$504B",
    jun2025: "$582B",
  },
  {
    metric: "Deferment $",
    mar2026: "$157B",
    dec2025: "$138B",
    jun2025: "~$145B",
  },
  {
    metric: "Default $",
    mar2026: "$220B (~9M)",
    dec2025: "$180B (7.7M)",
    jun2025: "pre-wave",
  },
  {
    metric: "Active-repay 31+ delinq (by $)",
    mar2026: "15.5%",
    dec2025: "18.6%",
    jun2025: "n/a",
  },
  {
    metric: "IDR share of plan $",
    mar2026: "62% ($784B)",
    dec2025: "60% ($770B)",
    jun2025: "55% (Mar '25)",
  },
] as const;

export function fmtBn(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}T`;
  return `$${n.toFixed(0)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtM(n: number): string {
  return `${n.toFixed(1)}M`;
}
