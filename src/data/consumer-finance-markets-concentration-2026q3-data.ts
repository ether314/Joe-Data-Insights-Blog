/**
 * Consumer finance & household balance sheets — Q3 2026 concentration lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (How are households saving, borrowing, and allocating retail money?)
 *
 * Q3 vintage complements the 2026 concentration print by adding (1) HHI across
 * wealth / equity / deposit / revolving / issuer lenses, (2) debt-product
 * concentration inside the NY Fed 2026Q2 stock, (3) a vintage slope of top-1
 * wealth & equity shares, and (4) liquid parking mix (deposits vs MMF) — while
 * keeping DFA-style top-1 / thick-top anchors and Q3 tape context.
 *
 * Primary sources (latest published / carried vintages as of Aug 2026):
 * - Fed Distributional Financial Accounts (DFA) — wealth & asset shares
 * - Fed Survey of Consumer Finances (SCF) cross-checks
 * - NY Fed Household Debt and Credit 2026Q2 — product stocks
 * - ICI Money Market Fund Assets — week-ended Aug 19, 2026
 * - Nilson-style issuer purchase-volume ranks
 * - Theme baselines: concentration-2026 + update-2026q3 + research-2026
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Q3 concentration lens. Net-worth and asset-class percentile shares follow Fed DFA through the latest published 2025–2026 window, rounded for viz; HHI values are analytical indexes on those stated bucket shares (0–10,000). Debt-product shares are disclosed NY Fed 2026Q2 product stocks divided by $18.926T aggregate. Revolving percentile shares remain estimated to sum to G.19 / HHDC revolving. Issuer purchase-volume ranks follow Nilson-style general-purpose tallies. MMF AUM is ICI week-ended Aug 19, 2026 ($8.02T revised); deposits are theme-carried (~$15T). Vintage slope points are DFA-consistent rounds, not a new microdata extract.";

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
    label: "ICI — Money Market Fund Assets",
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
    label: "Q3 theme update",
    url: "/blog/consumer-finance-markets-update-2026q3",
  },
] as const;

export const PRIOR_CONCENTRATION_PATH =
  "/blog/consumer-finance-markets-concentration-2026";
export const PRIOR_RESEARCH_PATH = "/blog/consumer-finance-markets-research-2026";
export const PRIOR_Q3_PATH = "/blog/consumer-finance-markets-update-2026q3";
export const PRIOR_DELINQ_PATH = "/blog/us-household-debt-delinquency-split-2026";
export const PRIOR_MMF_PATH = "/blog/money-market-funds-vs-deposits-2026";
export const PRIOR_APR_PATH = "/blog/us-credit-card-apr-vs-fed-funds-2026";

export const HEADLINE = {
  asOfWealth: "DFA latest published 2025–2026 window",
  asOfDebt: "NY Fed 2026Q2",
  asOfMmf: "ICI week ended Aug 19, 2026 revised",
  /** Net worth — top of distribution */
  top1WealthSharePct: 30.5,
  top1WealthLabel: "Top 1% (wealth)",
  top10WealthSharePct: 67.5,
  bottom50WealthSharePct: 2.5,
  wealthHhi: 3206,
  /** Equities — thickest people-side HHI */
  top1EquitySharePct: 54,
  top10EquitySharePct: 87,
  equityHhi: 4150,
  /** Deposits */
  top1DepositSharePct: 17,
  top10DepositSharePct: 50,
  depositHhi: 3206,
  /** Revolving — inverted people skew, mid HHI */
  top1CardSharePct: 5,
  top10CardSharePct: 24,
  bottom50CardSharePct: 30,
  revolvingHhi: 3402,
  /** Issuer firm concentration */
  top1IssuerSharePct: 22,
  top1IssuerLabel: "Chase",
  top3IssuerSharePct: 52,
  top5IssuerSharePct: 71,
  issuerHhi: 1962,
  issuerUniverseLabel: "General-purpose card purchase volume",
  /** Debt-product concentration (Q3 addition) */
  top1DebtProductSharePct: 70.1,
  top1DebtProductLabel: "Mortgage",
  top3DebtProductSharePct: 87.9,
  debtProductHhi: 5080,
  /** Liquid parking */
  mmfTn: 8.02,
  depositsTn: 14.95,
  mmfShareOfLiquidPct: 34.9,
  depositsShareOfLiquidPct: 65.1,
  /** Aggregate context from Q3 tape */
  householdNetWorthTn: 169,
  totalDebtTn: 18.926,
  revolvingTn: 1.281,
  g19RevolvingTn: 1.351,
  savingJulyPct: 3.1,
  cardAprFundsGapPp: 17.2,
} as const;

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

/** Household net worth by wealth percentile (DFA-style). */
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

export type HhiLens = {
  id: string;
  label: string;
  short: string;
  hhi: number;
  top1Pct: number;
  thickTopPct: number;
  thickTopLabel: string;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Analytical HHI on stated bucket shares — Q3 primary panel. */
export const HHI_BY_LENS: HhiLens[] = [
  {
    id: "equities",
    label: "Corporate equities & funds",
    short: "Equities",
    hhi: 4150,
    top1Pct: 54,
    thickTopPct: 87,
    thickTopLabel: "Top 10%",
    confidence: "disclosed",
    fill: "#8b5cf6",
    note: "Thickest people-side concentration",
  },
  {
    id: "debtProducts",
    label: "Debt products (NY Fed stock)",
    short: "Debt products",
    hhi: 5080,
    top1Pct: 70.1,
    thickTopPct: 87.9,
    thickTopLabel: "Top 3 products",
    confidence: "disclosed",
    fill: "#f43f5e",
    note: "Mortgage dominates the liability stack",
  },
  {
    id: "revolving",
    label: "Revolving by wealth percentile",
    short: "Revolving",
    hhi: 3402,
    top1Pct: 5,
    thickTopPct: 24,
    thickTopLabel: "Top 10%",
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Middle/bottom-heavy — inverted people skew",
  },
  {
    id: "wealth",
    label: "Net worth",
    short: "Net worth",
    hhi: 3206,
    top1Pct: 30.5,
    thickTopPct: 67.5,
    thickTopLabel: "Top 10%",
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "deposits",
    label: "Deposits & cash-like",
    short: "Deposits",
    hhi: 3206,
    top1Pct: 17,
    thickTopPct: 50,
    thickTopLabel: "Top 10%",
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "issuers",
    label: "Card issuers (purchase $)",
    short: "Issuers",
    hhi: 1962,
    top1Pct: 22,
    thickTopPct: 52,
    thickTopLabel: "Top 3",
    confidence: "estimated",
    fill: "#64748b",
    note: "Firm-side — moderate vs equity people skew",
  },
];

export type AssetLensRow = {
  lens: string;
  label: string;
  top1Pct: number;
  top10Pct: number;
  bottom50Pct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

export const ASSET_LENS: AssetLensRow[] = [
  {
    lens: "netWorth",
    label: "Net worth",
    top1Pct: 30.5,
    top10Pct: 67.5,
    bottom50Pct: 2.5,
    confidence: "disclosed",
    fill: "#f43f5e",
    note: "DFA household net worth",
  },
  {
    lens: "equities",
    label: "Corporate equities & funds",
    top1Pct: 54,
    top10Pct: 87,
    bottom50Pct: 1.0,
    confidence: "disclosed",
    fill: "#8b5cf6",
    note: "Most top-heavy major asset",
  },
  {
    lens: "deposits",
    label: "Deposits & cash-like",
    top1Pct: 17,
    top10Pct: 50,
    bottom50Pct: 8,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    lens: "realEstate",
    label: "Real estate",
    top1Pct: 13,
    top10Pct: 45,
    bottom50Pct: 11,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    lens: "revolving",
    label: "Revolving / card balances",
    top1Pct: 5,
    top10Pct: 24,
    bottom50Pct: 30,
    confidence: "estimated",
    fill: "#f59e0b",
  },
];

export type PercentileShare = {
  bucket: string;
  short: string;
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
};

export const EQUITY_SHARES: PercentileShare[] = [
  {
    bucket: "Top 1%",
    short: "Top 1%",
    sharePct: 54,
    cumulativeSharePct: 54,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    bucket: "90th–99th",
    short: "90–99%",
    sharePct: 33,
    cumulativeSharePct: 87,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    bucket: "50th–90th",
    short: "50–90%",
    sharePct: 12,
    cumulativeSharePct: 99,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    bucket: "Bottom 50%",
    short: "Bottom 50%",
    sharePct: 1,
    cumulativeSharePct: 100,
    confidence: "disclosed",
    fill: "#64748b",
  },
];

export const DEPOSIT_SHARES: PercentileShare[] = [
  {
    bucket: "Top 1%",
    short: "Top 1%",
    sharePct: 17,
    cumulativeSharePct: 17,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    bucket: "90th–99th",
    short: "90–99%",
    sharePct: 33,
    cumulativeSharePct: 50,
    confidence: "disclosed",
    fill: "#38bdf8",
  },
  {
    bucket: "50th–90th",
    short: "50–90%",
    sharePct: 42,
    cumulativeSharePct: 92,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    bucket: "Bottom 50%",
    short: "Bottom 50%",
    sharePct: 8,
    cumulativeSharePct: 100,
    confidence: "disclosed",
    fill: "#64748b",
  },
];

export const REVOLVING_SHARES: PercentileShare[] = [
  {
    bucket: "Top 1%",
    short: "Top 1%",
    sharePct: 5,
    cumulativeSharePct: 5,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    bucket: "90th–99th",
    short: "90–99%",
    sharePct: 19,
    cumulativeSharePct: 24,
    confidence: "estimated",
    fill: "#fb923c",
  },
  {
    bucket: "50th–90th",
    short: "50–90%",
    sharePct: 46,
    cumulativeSharePct: 70,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    bucket: "Bottom 50%",
    short: "Bottom 50%",
    sharePct: 30,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#64748b",
  },
];

export type DebtProduct = {
  product: string;
  short: string;
  sharePct: number;
  stockTn: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
};

/** NY Fed 2026Q2 product stocks — liability-side concentration. */
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

export const DEBT_PRODUCT_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 70.1, equalPct: 16.7 },
  { rank: 2, label: "Top-2", sharePct: 79.1, equalPct: 33.3 },
  { rank: 3, label: "Top-3", sharePct: 87.9, equalPct: 50 },
  { rank: 6, label: "All", sharePct: 100, equalPct: 100 },
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

export type VintagePoint = {
  year: string;
  top1WealthPct: number;
  top10WealthPct: number;
  top1EquityPct: number;
  top10EquityPct: number;
  confidence: Confidence;
};

/** DFA-consistent vintage slope — Q3 panel. */
export const VINTAGE_SLOPE: VintagePoint[] = [
  {
    year: "2019",
    top1WealthPct: 29.0,
    top10WealthPct: 66.0,
    top1EquityPct: 51,
    top10EquityPct: 85,
    confidence: "estimated",
  },
  {
    year: "2021",
    top1WealthPct: 31.0,
    top10WealthPct: 68.0,
    top1EquityPct: 54,
    top10EquityPct: 87,
    confidence: "estimated",
  },
  {
    year: "2023",
    top1WealthPct: 30.2,
    top10WealthPct: 67.0,
    top1EquityPct: 53,
    top10EquityPct: 86,
    confidence: "estimated",
  },
  {
    year: "2025–26",
    top1WealthPct: 30.5,
    top10WealthPct: 67.5,
    top1EquityPct: 54,
    top10EquityPct: 87,
    confidence: "disclosed",
  },
];

export type LiquidSlice = {
  id: string;
  label: string;
  short: string;
  tn: number;
  sharePct: number;
  confidence: Confidence;
  fill: string;
};

export const LIQUID_PARKING: LiquidSlice[] = [
  {
    id: "deposits",
    label: "Deposits (theme-carried)",
    short: "Deposits",
    tn: 14.95,
    sharePct: 65.1,
    confidence: "carried",
    fill: "#0ea5e9",
  },
  {
    id: "mmf",
    label: "Money market funds (ICI)",
    short: "MMF",
    tn: 8.02,
    sharePct: 34.9,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
];

export type LensCompare = {
  id: string;
  label: string;
  top1Pct: number;
  thickTopPct: number;
  note: string;
};

export const LENS_COMPARE: LensCompare[] = [
  {
    id: "wealth",
    label: "Net worth",
    top1Pct: 30.5,
    thickTopPct: 67.5,
    note: "Top-1 / top-10",
  },
  {
    id: "equities",
    label: "Equities",
    top1Pct: 54,
    thickTopPct: 87,
    note: "Most concentrated asset",
  },
  {
    id: "deposits",
    label: "Deposits",
    top1Pct: 17,
    thickTopPct: 50,
    note: "Milder cash skew",
  },
  {
    id: "revolving",
    label: "Revolving",
    top1Pct: 5,
    thickTopPct: 24,
    note: "Inverted people skew",
  },
  {
    id: "debtProducts",
    label: "Debt products",
    top1Pct: 70.1,
    thickTopPct: 87.9,
    note: "Mortgage / top-3 products",
  },
  {
    id: "issuers",
    label: "Card issuers",
    top1Pct: 22,
    thickTopPct: 52,
    note: "Top-1 / top-3 firms",
  },
];

export type VintageCheck = {
  id: string;
  label: string;
  value: string;
  source: string;
  confidence: Confidence;
};

export const VINTAGE_CHECKS: VintageCheck[] = [
  {
    id: "nw",
    label: "Household net worth",
    value: "~$169T",
    source: "Z.1 / theme research",
    confidence: "carried",
  },
  {
    id: "debt",
    label: "NY Fed HH debt",
    value: "$18.926T",
    source: "HHDC 2026Q2",
    confidence: "disclosed",
  },
  {
    id: "mortgage",
    label: "Mortgage share of debt",
    value: "70.1%",
    source: "HHDC 2026Q2",
    confidence: "disclosed",
  },
  {
    id: "mmf",
    label: "ICI MMF AUM",
    value: "$8.02T",
    source: "Week ended Aug 19 revised",
    confidence: "disclosed",
  },
  {
    id: "save",
    label: "July PSAVERT",
    value: "3.1%",
    source: "BEA / FRED",
    confidence: "disclosed",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtTn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}T`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}
