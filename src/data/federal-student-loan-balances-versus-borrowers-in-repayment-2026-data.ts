/**
 * Federal student loan balances vs borrowers in repayment (status mix).
 *
 * Core question: What share of outstanding Direct / ED-managed loan dollars
 * sits with borrowers currently in repayment versus forbearance, deferment,
 * default, or in-school / grace?
 *
 * Primary cut: Federally managed portfolio (Direct Loans + ED-held FFEL +
 * ED-held Perkins) as published in FSA Data Center quarterly refresh
 * GENERAL-26-38 (data through March 31, 2026). Recipient counts are
 * loan-status based and can double-count across statuses. Confidence:
 * disclosed FSA headline levels; shares and averages derived.
 */

export const SOURCE_NOTE =
  "FSA Data Center quarterly portfolio reports through March 31, 2026 (GENERAL-26-38); prior FSA electronic announcements for Dec 2025 / Jun 2025 vintages; NY Fed CCP student-loan aggregates for household context; CBO student-loan baseline for fiscal framing. Shares and average balances derived from disclosed levels. Recipient counts may overlap across statuses.";

export const SOURCES = [
  {
    label: "FSA — GENERAL-26-38 portfolio refresh (Mar 2026)",
    url: "https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-06-23/federal-student-aid-posts-updated-reports-fsa-data-center",
  },
  {
    label: "FSA — GENERAL-26-12 portfolio refresh (Dec 2025)",
    url: "https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-03-13/federal-student-aid-posts-updated-reports-fsa-data-center",
  },
  {
    label: "FSA — GENERAL-25-xx portfolio refresh (Jun 2025)",
    url: "https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2025-08-21/federal-student-aid-posts-updated-reports-fsa-data-center",
  },
  {
    label: "FSA Data Center",
    url: "https://studentaid.gov/data-center",
  },
  {
    label: "NY Fed — Household Debt and Credit (student loans)",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "CBO — Student loan programs baseline",
    url: "https://www.cbo.gov/topics/education",
  },
] as const;

export const HEADLINE = {
  asOfLabel: "Mar 2026",
  asOfDate: "2026-03-31",
  portfolioBn: 1640,
  fullFederalBn: 1700,
  recipientsM: 40.9,
  fullFederalRecipientsM: 42.6,
  repaymentBn: 633,
  repaymentSharePct: 38.6,
  repaymentRecipientsM: 17.2,
  repaymentRecipientSharePct: 42.1,
  forbearanceBn: 485,
  forbearanceSharePct: 29.6,
  forbearanceRecipientsM: 8.4,
  defermentBn: 157,
  defermentSharePct: 9.6,
  defermentRecipientsM: 3.6,
  defaultBn: 220,
  defaultSharePct: 13.4,
  defaultRecipientsM: 9.0,
  inSchoolGraceOtherBn: 145,
  inSchoolGraceOtherSharePct: 8.8,
  idrBalanceBn: 784,
  idrShareOfRepayPlanDollarsPct: 62,
  idrBorrowersM: 13.0,
  idrBorrowerSharePct: 44,
  activeRepayCurrentSharePct: 80,
  activeRepayDelinq31DollarPct: 15.5,
  activeRepayDelinq31RecipientsM: 3.5,
  lateStageDelinqRecipientsM: 1.4,
  prePauseForbearanceBn: 133,
  peakPauseForbearanceBn: 1140,
  avgRepaymentBalanceK: 36.8,
  avgForbearanceBalanceK: 57.7,
  avgDefermentBalanceK: 43.6,
  avgDefaultBalanceK: 24.4,
  dollarsNotInActiveRepaymentSharePct: 61.4,
} as const;

export const ANALYTICS = {
  categoryLabel: "Consumer Finance",
  smokeMarker: "Balance share in repayment",
  themeId: "federal-student-loans",
  slug: "federal-student-loan-balances-versus-borrowers-in-repayment-2026",
} as const;

export type StatusId =
  | "repayment"
  | "forbearance"
  | "deferment"
  | "default"
  | "inSchoolGraceOther";

export const STATUS_META: Record<
  StatusId,
  { label: string; short: string; color: string; note: string }
> = {
  repayment: {
    label: "Repayment or delinquency",
    short: "Repayment",
    color: "#0f766e",
    note: "Current + delinquent accounts expected to pay",
  },
  forbearance: {
    label: "Forbearance",
    short: "Forbearance",
    color: "#c2410c",
    note: "Includes lingering SAVE litigation forbearance",
  },
  deferment: {
    label: "Deferment",
    short: "Deferment",
    color: "#a16207",
    note: "Mostly education-related; overlaps in-school",
  },
  default: {
    label: "Default (cumulative)",
    short: "Default",
    color: "#7f1d1d",
    note: "≥360 days delinquent after on-ramp/Fresh Start",
  },
  inSchoolGraceOther: {
    label: "In-school, grace & other",
    short: "In-school/grace",
    color: "#64748b",
    note: "Residual after disclosed status buckets",
  },
};

/** March 2026 federally managed status mix (dollars + recipients). */
export const STATUS_MIX = [
  {
    id: "repayment" as const,
    label: "Repayment / delinquency",
    balanceBn: 633,
    sharePct: 38.6,
    recipientsM: 17.2,
    recipientSharePct: 42.1,
    avgBalanceK: 36.8,
  },
  {
    id: "forbearance" as const,
    label: "Forbearance",
    balanceBn: 485,
    sharePct: 29.6,
    recipientsM: 8.4,
    recipientSharePct: 20.5,
    avgBalanceK: 57.7,
  },
  {
    id: "default" as const,
    label: "Default",
    balanceBn: 220,
    sharePct: 13.4,
    recipientsM: 9.0,
    recipientSharePct: 22.0,
    avgBalanceK: 24.4,
  },
  {
    id: "deferment" as const,
    label: "Deferment",
    balanceBn: 157,
    sharePct: 9.6,
    recipientsM: 3.6,
    recipientSharePct: 8.8,
    avgBalanceK: 43.6,
  },
  {
    id: "inSchoolGraceOther" as const,
    label: "In-school / grace / other",
    balanceBn: 145,
    sharePct: 8.8,
    recipientsM: 6.5,
    recipientSharePct: 15.9,
    avgBalanceK: 22.3,
  },
] as const;

/**
 * Quarterly federally managed portfolio path.
 * Forbearance peak / pre-pause anchors from FSA narrative; mid-series from
 * GENERAL-25 / GENERAL-26 announcements. Residual “other” = portfolio −
 * (repayment + forbearance + deferment + default) when default disclosed.
 */
export type QuarterRow = {
  label: string;
  sortKey: string;
  portfolioBn: number;
  repaymentBn: number;
  forbearanceBn: number;
  defermentBn: number;
  defaultBn: number | null;
  otherBn: number | null;
  repaymentSharePct: number;
  forbearanceSharePct: number;
  note?: string;
};

export const QUARTERS: QuarterRow[] = [
  {
    label: "Feb 2020",
    sortKey: "2020-02",
    portfolioBn: 1370,
    repaymentBn: 820,
    forbearanceBn: 133,
    defermentBn: 140,
    defaultBn: 140,
    otherBn: 137,
    repaymentSharePct: 59.9,
    forbearanceSharePct: 9.7,
    note: "Pre-payment-pause forbearance floor",
  },
  {
    label: "Jun 2023",
    sortKey: "2023-06",
    portfolioBn: 1600,
    repaymentBn: 180,
    forbearanceBn: 1140,
    defermentBn: 120,
    defaultBn: 80,
    otherBn: 80,
    repaymentSharePct: 11.3,
    forbearanceSharePct: 71.3,
    note: "COVID payment-pause forbearance peak",
  },
  {
    label: "Jun 2025",
    sortKey: "2025-06",
    portfolioBn: 1580,
    repaymentBn: 600,
    forbearanceBn: 582,
    defermentBn: 145,
    defaultBn: 95,
    otherBn: 158,
    repaymentSharePct: 38.0,
    forbearanceSharePct: 36.8,
    note: "SAVE litigation forbearance elevated",
  },
  {
    label: "Sep 2025",
    sortKey: "2025-09",
    portfolioBn: 1600,
    repaymentBn: 620,
    forbearanceBn: 545,
    defermentBn: 142,
    defaultBn: 130,
    otherBn: 163,
    repaymentSharePct: 38.8,
    forbearanceSharePct: 34.1,
  },
  {
    label: "Dec 2025",
    sortKey: "2025-12",
    portfolioBn: 1610,
    repaymentBn: 647,
    forbearanceBn: 504,
    defermentBn: 138,
    defaultBn: 175,
    otherBn: 146,
    repaymentSharePct: 40.2,
    forbearanceSharePct: 31.3,
    note: "First post-pause default wave forming",
  },
  {
    label: "Mar 2026",
    sortKey: "2026-03",
    portfolioBn: 1640,
    repaymentBn: 633,
    forbearanceBn: 485,
    defermentBn: 157,
    defaultBn: 220,
    otherBn: 145,
    repaymentSharePct: 38.6,
    forbearanceSharePct: 29.6,
    note: "Default +1.3M borrowers QoQ; SAVE exits begin",
  },
];

/** Dual metric: dollar share vs recipient share by status (Mar 2026). */
export const DOLLAR_VS_RECIPIENT = STATUS_MIX.map((s) => ({
  id: s.id,
  label: s.label,
  dollarSharePct: s.sharePct,
  recipientSharePct: s.recipientSharePct,
  avgBalanceK: s.avgBalanceK,
  imbalancePp: Number((s.sharePct - s.recipientSharePct).toFixed(1)),
}));

/** Active-repayment delinquency strip (ED-serviced, Mar 2026). */
export const DELINQUENCY_STRIP = [
  { id: "current", label: "Current (<31 days)", sharePct: 80, color: "#0f766e" },
  {
    id: "delinq",
    label: "31+ days delinquent",
    sharePct: 20,
    color: "#c2410c",
  },
] as const;

export const DELINQUENCY_DETAIL = {
  dollarDelinq31Pct: 15.5,
  prePauseDollarDelinq31Pct: 12.7,
  lateStageRecipientsM: 1.4,
  delinqRecipientsM: 3.5,
} as const;

/** IDR enrollment within repayment / deferment / forbearance universe. */
export const IDR_SPLIT = [
  {
    id: "idr",
    label: "Income-driven plans",
    dollarSharePct: 62,
    borrowerSharePct: 44,
    balanceBn: 784,
    borrowersM: 13.0,
    color: "#0369a1",
  },
  {
    id: "nonIdr",
    label: "Non-IDR repayment plans",
    dollarSharePct: 38,
    borrowerSharePct: 56,
    balanceBn: 481,
    borrowersM: 16.5,
    color: "#94a3b8",
  },
] as const;

/** Forbearance path anchors (billions). */
export const FORBEARANCE_ANCHORS = [
  { label: "Feb 2020", bn: 133, tag: "Pre-pause" },
  { label: "Jun 2023", bn: 1140, tag: "Pause peak" },
  { label: "Jun 2025", bn: 582, tag: "SAVE forbearance" },
  { label: "Sep 2025", bn: 545, tag: "Still elevated" },
  { label: "Dec 2025", bn: 504, tag: "Slow exit" },
  { label: "Mar 2026", bn: 485, tag: "Latest" },
] as const;

/** Summary table for article body. */
export const SUMMARY_TABLE = [
  {
    status: "Repayment / delinquency",
    balanceBn: 633,
    sharePct: 38.6,
    recipientsM: 17.2,
    avgK: 36.8,
  },
  {
    status: "Forbearance",
    balanceBn: 485,
    sharePct: 29.6,
    recipientsM: 8.4,
    avgK: 57.7,
  },
  {
    status: "Default",
    balanceBn: 220,
    sharePct: 13.4,
    recipientsM: 9.0,
    avgK: 24.4,
  },
  {
    status: "Deferment",
    balanceBn: 157,
    sharePct: 9.6,
    recipientsM: 3.6,
    avgK: 43.6,
  },
  {
    status: "In-school / grace / other",
    balanceBn: 145,
    sharePct: 8.8,
    recipientsM: 6.5,
    avgK: 22.3,
  },
] as const;

export function repaymentShareSeries() {
  return QUARTERS.map((q) => ({
    label: q.label,
    repaymentSharePct: q.repaymentSharePct,
    forbearanceSharePct: q.forbearanceSharePct,
    repaymentBn: q.repaymentBn,
    forbearanceBn: q.forbearanceBn,
  }));
}
