/**
 * Consumer finance & household balance sheets — August 202608 concentration lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (How are households saving, borrowing, and allocating retail money?)
 *
 * 202608 vintage complements concentration-2026 and concentration-2026q3 by
 * answering what the *official* Aug tape does to the concentration story:
 * (1) top-1 / top-3 scoreboard across people, products, and firms,
 * (2) liquid-parking rebalance after ICI restates MMF to $7.93T (−$92B vs Q3),
 * (3) save-vs-borrow mirror (equity tip vs revolving invert) with G.19 $1.351T,
 * (4) issuer cumulative ladder still ~22% / 52% / 71%,
 * (5) Q3→Aug vintage deltas showing sticky tip shares vs moving cash sleeve.
 *
 * Primary sources (latest published / carried vintages as of Aug 2026):
 * - Fed Distributional Financial Accounts (DFA) — wealth & asset shares
 * - NY Fed Household Debt and Credit 2026Q2 — product stocks
 * - ICI Money Market Fund Assets — week-ended Aug 19, 2026 (Aug 20 release)
 * - Fed G.19 — June revolving $1.351T
 * - Nilson-style issuer purchase-volume ranks
 * - Theme baselines: concentration-2026 + concentration-2026q3 + update-202608
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "August 202608 concentration lens. Net-worth and asset-class percentile shares follow Fed DFA through the latest published 2025–2026 window, rounded for viz. Top-1 / top-3 meters are market-share style reads on those buckets (people), NY Fed 2026Q2 product stocks (liabilities), and Nilson-style purchase volume (issuers). Liquid parking uses ICI week-ended Aug 19, 2026 official total $7.928T vs Q3 theme restatement $8.02T; deposits ~$14.95T are theme-carried. G.19 revolving is June SA $1.351T. Revolving percentile shares remain estimated. Vintage delta rows compare Q3 concentration print vs this Aug tape — tip shares are sticky; the cash sleeve moved.";

export const SOURCES = [
  {
    label: "Fed — Distributional Financial Accounts",
    url: "https://www.federalreserve.gov/releases/z1/dataviz/dfa/",
  },
  {
    label: "NY Fed — Household Debt and Credit, 2026Q2",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "ICI — Money Market Fund Assets (Aug 20 release)",
    url: "https://www.ici.org/research/stats/mmf",
  },
  {
    label: "Fed G.19 — Consumer Credit",
    url: "https://www.federalreserve.gov/releases/g19/current/",
  },
  {
    label: "Prior concentration print",
    url: "/blog/consumer-finance-markets-concentration-2026",
  },
  {
    label: "Q3 concentration lens",
    url: "/blog/consumer-finance-markets-concentration-2026q3",
  },
  {
    label: "August 202608 theme update",
    url: "/blog/consumer-finance-markets-update-202608",
  },
] as const;

export const PRIOR_CONCENTRATION_PATH =
  "/blog/consumer-finance-markets-concentration-2026";
export const PRIOR_Q3_CONCENTRATION_PATH =
  "/blog/consumer-finance-markets-concentration-2026q3";
export const PRIOR_UPDATE_PATH =
  "/blog/consumer-finance-markets-update-202608";
export const PRIOR_Q3_UPDATE_PATH =
  "/blog/consumer-finance-markets-update-2026q3";
export const PRIOR_RESEARCH_PATH = "/blog/consumer-finance-markets-research-2026";
export const PRIOR_DELINQ_PATH = "/blog/us-household-debt-delinquency-split-2026";
export const PRIOR_MMF_PATH = "/blog/money-market-funds-vs-deposits-2026";
export const PRIOR_APR_PATH = "/blog/us-credit-card-apr-vs-fed-funds-2026";

export const HEADLINE = {
  asOfWealth: "DFA latest published 2025–2026 window",
  asOfDebt: "NY Fed 2026Q2",
  asOfMmf: "ICI week ended Aug 19, 2026 (Aug 20 release)",
  asOfRevolving: "G.19 June 2026 SA",
  /** People-side tip */
  top1WealthSharePct: 30.5,
  top3WealthSharePct: 50.0,
  top10WealthSharePct: 67.5,
  bottom50WealthSharePct: 2.5,
  top1EquitySharePct: 54,
  top3EquitySharePct: 72,
  top10EquitySharePct: 87,
  top1DepositSharePct: 17,
  top3DepositSharePct: 38,
  top10DepositSharePct: 50,
  top1CardSharePct: 5,
  top3CardSharePct: 16,
  top10CardSharePct: 24,
  bottom50CardSharePct: 30,
  /** Liability product tip */
  top1DebtProductSharePct: 70.1,
  top1DebtProductLabel: "Mortgage",
  top3DebtProductSharePct: 87.9,
  /** Firm-side tip */
  top1IssuerSharePct: 22,
  top1IssuerLabel: "Chase",
  top3IssuerSharePct: 52,
  top5IssuerSharePct: 71,
  issuerUniverseLabel: "General-purpose card purchase volume",
  /** Liquid parking — Aug official vs Q3 restatement */
  mmfTn: 7.928,
  mmfQ3Tn: 8.02,
  mmfDeltaBn: -92,
  depositsTn: 14.95,
  mmfShareOfLiquidPct: 34.7,
  depositsShareOfLiquidPct: 65.3,
  mmfQ3ShareOfLiquidPct: 34.9,
  /** Aggregate context from Aug tape */
  householdNetWorthTn: 169,
  totalDebtTn: 18.926,
  nyFedCardsTn: 1.281,
  g19RevolvingTn: 1.351,
  savingDisclosedPct: 2.7,
  savingJulyClaimPct: 3.1,
  cardAprFundsGapPp: 17.3,
} as const;

export type ScoreboardRow = {
  id: string;
  label: string;
  short: string;
  top1Pct: number;
  top3Pct: number;
  thickTopPct: number;
  thickTopLabel: string;
  axis: "people" | "product" | "firm";
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Primary Aug scoreboard — top-1 / top-3 (or thick-top) across ledgers. */
export const TOP_SHARE_SCOREBOARD: ScoreboardRow[] = [
  {
    id: "equities",
    label: "Corporate equities & funds",
    short: "Equities",
    top1Pct: 54,
    top3Pct: 72,
    thickTopPct: 87,
    thickTopLabel: "Top 10%",
    axis: "people",
    confidence: "disclosed",
    fill: "#8b5cf6",
    note: "Thickest people-side tip",
  },
  {
    id: "debtProducts",
    label: "Debt products (NY Fed stock)",
    short: "Debt products",
    top1Pct: 70.1,
    top3Pct: 87.9,
    thickTopPct: 87.9,
    thickTopLabel: "Top 3 products",
    axis: "product",
    confidence: "disclosed",
    fill: "#f43f5e",
    note: "Mortgage alone is the liability top-1",
  },
  {
    id: "wealth",
    label: "Net worth",
    short: "Net worth",
    top1Pct: 30.5,
    top3Pct: 50,
    thickTopPct: 67.5,
    thickTopLabel: "Top 10%",
    axis: "people",
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "deposits",
    label: "Deposits & cash-like",
    short: "Deposits",
    top1Pct: 17,
    top3Pct: 38,
    thickTopPct: 50,
    thickTopLabel: "Top 10%",
    axis: "people",
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "issuers",
    label: "Card issuers (purchase $)",
    short: "Issuers",
    top1Pct: 22,
    top3Pct: 52,
    thickTopPct: 52,
    thickTopLabel: "Top 3",
    axis: "firm",
    confidence: "estimated",
    fill: "#64748b",
    note: "Firm-side — moderate vs equity people skew",
  },
  {
    id: "revolving",
    label: "Revolving by wealth percentile",
    short: "Revolving",
    top1Pct: 5,
    top3Pct: 16,
    thickTopPct: 24,
    thickTopLabel: "Top 10%",
    axis: "people",
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Inverted — bottom 50% holds ~30%",
  },
];

export type WealthBucket = {
  id: string;
  label: string;
  short: string;
  sharePct: number;
  cumulativeSharePct: number;
  netWorthTn: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

export const WEALTH_SHARES: WealthBucket[] = [
  {
    id: "top1",
    label: "Top 1%",
    short: "Top 1%",
    sharePct: 30.5,
    cumulativeSharePct: 30.5,
    netWorthTn: 51.5,
    confidence: "disclosed",
    fill: "#f43f5e",
    note: "Equities + private business heavy",
  },
  {
    id: "p90_99",
    label: "90th–99th",
    short: "90–99%",
    sharePct: 37.0,
    cumulativeSharePct: 67.5,
    netWorthTn: 62.5,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "p50_90",
    label: "50th–90th",
    short: "50–90%",
    sharePct: 30.0,
    cumulativeSharePct: 97.5,
    netWorthTn: 50.7,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "bottom50",
    label: "Bottom 50%",
    short: "Bottom 50%",
    sharePct: 2.5,
    cumulativeSharePct: 100,
    netWorthTn: 4.2,
    confidence: "disclosed",
    fill: "#64748b",
  },
];

export const WEALTH_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top 1%", sharePct: 30.5, equalPct: 1 },
  { rank: 10, label: "Top 10%", sharePct: 67.5, equalPct: 10 },
  { rank: 50, label: "Top 50%", sharePct: 97.5, equalPct: 50 },
  { rank: 100, label: "All", sharePct: 100, equalPct: 100 },
];

export type MirrorRow = {
  bucket: string;
  short: string;
  equitySharePct: number;
  revolvingSharePct: number;
  depositSharePct: number;
  confidence: Confidence;
  fill: string;
};

/** Save-vs-borrow mirror by wealth percentile. */
export const SAVE_BORROW_MIRROR: MirrorRow[] = [
  {
    bucket: "Top 1%",
    short: "Top 1%",
    equitySharePct: 54,
    revolvingSharePct: 5,
    depositSharePct: 17,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    bucket: "90th–99th",
    short: "90–99%",
    equitySharePct: 33,
    revolvingSharePct: 19,
    depositSharePct: 33,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    bucket: "50th–90th",
    short: "50–90%",
    equitySharePct: 12,
    revolvingSharePct: 46,
    depositSharePct: 42,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    bucket: "Bottom 50%",
    short: "Bottom 50%",
    equitySharePct: 1,
    revolvingSharePct: 30,
    depositSharePct: 8,
    confidence: "estimated",
    fill: "#f59e0b",
  },
];

export type ScatterPoint = {
  id: string;
  label: string;
  top1Pct: number;
  thickTopPct: number;
  axis: "people" | "product" | "firm";
  fill: string;
};

export const TIP_SCATTER: ScatterPoint[] = TOP_SHARE_SCOREBOARD.map((r) => ({
  id: r.id,
  label: r.short,
  top1Pct: r.top1Pct,
  thickTopPct: r.thickTopPct,
  axis: r.axis,
  fill: r.fill,
}));

export type DebtProduct = {
  product: string;
  short: string;
  sharePct: number;
  stockTn: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
};

export const DEBT_PRODUCTS: DebtProduct[] = [
  {
    product: "Mortgage",
    short: "Mortgage",
    sharePct: 70.1,
    stockTn: 13.268,
    cumulativeSharePct: 70.1,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    product: "Auto loan",
    short: "Auto",
    sharePct: 9.0,
    stockTn: 1.702,
    cumulativeSharePct: 79.1,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    product: "Student loan",
    short: "Student",
    sharePct: 8.8,
    stockTn: 1.661,
    cumulativeSharePct: 87.9,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    product: "Credit card",
    short: "Card",
    sharePct: 6.8,
    stockTn: 1.281,
    cumulativeSharePct: 94.7,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    product: "HELOC",
    short: "HELOC",
    sharePct: 2.4,
    stockTn: 0.458,
    cumulativeSharePct: 97.1,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    product: "Other",
    short: "Other",
    sharePct: 2.9,
    stockTn: 0.556,
    cumulativeSharePct: 100,
    confidence: "disclosed",
    fill: "#64748b",
  },
];

export type IssuerShare = {
  issuer: string;
  short: string;
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
};

export const ISSUER_SHARES: IssuerShare[] = [
  {
    issuer: "JPMorgan Chase",
    short: "Chase",
    sharePct: 22,
    cumulativeSharePct: 22,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    issuer: "American Express",
    short: "Amex",
    sharePct: 16,
    cumulativeSharePct: 38,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    issuer: "Citibank",
    short: "Citi",
    sharePct: 14,
    cumulativeSharePct: 52,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    issuer: "Capital One",
    short: "Cap One",
    sharePct: 11,
    cumulativeSharePct: 63,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    issuer: "Bank of America",
    short: "BofA",
    sharePct: 8,
    cumulativeSharePct: 71,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    issuer: "All other issuers",
    short: "Other",
    sharePct: 29,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#64748b",
  },
];

export const ISSUER_CUMULATIVE = [
  { k: 0, label: "0", sharePct: 0 },
  { k: 1, label: "Top 1", sharePct: 22 },
  { k: 3, label: "Top 3", sharePct: 52 },
  { k: 5, label: "Top 5", sharePct: 71 },
  { k: 6, label: "All", sharePct: 100 },
];

export type LiquidSlice = {
  id: string;
  label: string;
  short: string;
  tn: number;
  sharePct: number;
  fill: string;
  confidence: Confidence;
};

export const LIQUID_PARKING_AUG: LiquidSlice[] = [
  {
    id: "deposits",
    label: "Deposits (theme-carried)",
    short: "Deposits",
    tn: 14.95,
    sharePct: 65.3,
    fill: "#0ea5e9",
    confidence: "carried",
  },
  {
    id: "mmf",
    label: "Money market funds (ICI official)",
    short: "MMF",
    tn: 7.928,
    sharePct: 34.7,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
];

export type LiquidPathPoint = {
  week: string;
  label: string;
  mmfTn: number;
  depositsTn: number;
  mmfSharePct: number;
  note?: string;
};

/** Short path into the Aug official correction. */
export const LIQUID_PATH: LiquidPathPoint[] = [
  {
    week: "q3-theme",
    label: "Q3 theme",
    mmfTn: 8.02,
    depositsTn: 14.95,
    mmfSharePct: 34.9,
    note: "Restated claim",
  },
  {
    week: "aug12",
    label: "Aug 12 wk",
    mmfTn: 7.928,
    depositsTn: 14.95,
    mmfSharePct: 34.7,
  },
  {
    week: "aug19",
    label: "Aug 19 wk",
    mmfTn: 7.928,
    depositsTn: 14.95,
    mmfSharePct: 34.7,
    note: "Official Aug 20 release",
  },
];

export type VintageDelta = {
  id: string;
  label: string;
  short: string;
  q3Value: number;
  augValue: number;
  unit: "pct" | "tn" | "pp";
  moved: boolean;
  fill: string;
  note?: string;
};

/** Q3 → Aug: tip shares sticky; cash sleeve moved. */
export const VINTAGE_DELTAS: VintageDelta[] = [
  {
    id: "top1Equity",
    label: "Top-1 equity share",
    short: "Top-1 equity",
    q3Value: 54,
    augValue: 54,
    unit: "pct",
    moved: false,
    fill: "#8b5cf6",
  },
  {
    id: "top1Wealth",
    label: "Top-1 wealth share",
    short: "Top-1 wealth",
    q3Value: 30.5,
    augValue: 30.5,
    unit: "pct",
    moved: false,
    fill: "#0ea5e9",
  },
  {
    id: "top3Issuer",
    label: "Top-3 issuer purchase $",
    short: "Top-3 issuers",
    q3Value: 52,
    augValue: 52,
    unit: "pct",
    moved: false,
    fill: "#64748b",
  },
  {
    id: "mortgageShare",
    label: "Mortgage of HH debt",
    short: "Mortgage %",
    q3Value: 70.1,
    augValue: 70.1,
    unit: "pct",
    moved: false,
    fill: "#f43f5e",
  },
  {
    id: "mmfTn",
    label: "MMF AUM",
    short: "MMF $T",
    q3Value: 8.02,
    augValue: 7.928,
    unit: "tn",
    moved: true,
    fill: "#a855f7",
    note: "−$92B official correction",
  },
  {
    id: "mmfShare",
    label: "MMF share of liquid pair",
    short: "MMF liquid %",
    q3Value: 34.9,
    augValue: 34.7,
    unit: "pct",
    moved: true,
    fill: "#c084fc",
  },
  {
    id: "g19Rev",
    label: "G.19 revolving",
    short: "G.19 rev $T",
    q3Value: 1.281,
    augValue: 1.351,
    unit: "tn",
    moved: true,
    fill: "#f59e0b",
    note: "NY Fed cards vs G.19 concept bridge",
  },
  {
    id: "saving",
    label: "Personal saving rate",
    short: "PSAVERT",
    q3Value: 3.1,
    augValue: 2.7,
    unit: "pct",
    moved: true,
    fill: "#14b8a6",
    note: "July claim vs June disclosed on FRED",
  },
];

export type DebtStressSleeve = {
  product: string;
  short: string;
  debtSharePct: number;
  stressMetric: string;
  stressPct: number;
  fill: string;
};

/** Product share vs stress clock — why aggregates mislead. */
export const DEBT_STRESS_SLEEVES: DebtStressSleeve[] = [
  {
    product: "Mortgage",
    short: "Mortgage",
    debtSharePct: 70.1,
    stressMetric: "Serious transition",
    stressPct: 1.6,
    fill: "#0ea5e9",
  },
  {
    product: "Student loan",
    short: "Student",
    debtSharePct: 8.8,
    stressMetric: "90+ stock",
    stressPct: 10.6,
    fill: "#8b5cf6",
  },
  {
    product: "Credit card",
    short: "Card",
    debtSharePct: 6.8,
    stressMetric: "90+ / early transition",
    stressPct: 8.9,
    fill: "#f59e0b",
  },
  {
    product: "Auto loan",
    short: "Auto",
    debtSharePct: 9.0,
    stressMetric: "90+ stock",
    stressPct: 5.1,
    fill: "#14b8a6",
  },
];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtTn(n: number, digits = 2): string {
  return `$${n.toFixed(digits)}T`;
}

export function fmtBn(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(0)}B`;
}

export function deltaPct(q3: number, aug: number): number {
  return Math.round((aug - q3) * 1000) / 1000;
}
