/**
 * Consumer finance & household balance sheets — concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (How are households saving, borrowing, and allocating retail money?)
 *
 * Complements the research roll-up and 2026 vintage updates (saving flow, NY Fed
 * debt stock, MMF/deposits cash split, APR−funds gap) with top-1 / top-3 and
 * percentile shares across net worth, equities, deposits, and revolving debt —
 * plus a card-issuer purchase-volume concentration check.
 *
 * Primary sources (latest published / carried vintages as of Aug 2026):
 * - Fed Distributional Financial Accounts (DFA) — wealth & asset shares by percentile
 * - Fed Survey of Consumer Finances (SCF) cross-checks for equity / deposit skew
 * - NY Fed Household Debt and Credit — revolving balances (aggregate; percentile shares estimated)
 * - Nilson Report / issuer disclosures — general-purpose card purchase-volume ranks
 * - Theme baselines: consumer-finance-markets-research-2026 + update-202608
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Net-worth and asset-class percentile shares follow Fed Distributional Financial Accounts (DFA) quarterly releases through the latest published 2025–2026 window, rounded for viz. Equity and deposit shares are DFA-consistent; primary-residence real estate is less top-heavy and is shown as a contrast lens. Revolving / credit-card balance shares by wealth percentile are estimated to sum to NY Fed aggregate revolving stock (~$1.28–1.35T in 2026Q2 / G.19 June) and are labeled estimated. Card-issuer purchase-volume ranks follow Nilson-style general-purpose network tallies (top issuers); treat as order-of-magnitude market shares, not Fed supervisory cells. Aggregate household net worth (~$169T) and debt stock (~$18.9T) are carried from the theme research / Q2 HHDC prints.";

export const SOURCES = [
  {
    label: "Fed — Distributional Financial Accounts",
    url: "https://www.federalreserve.gov/releases/z1/dataviz/dfa/",
  },
  {
    label: "Fed — Survey of Consumer Finances",
    url: "https://www.federalreserve.gov/econres/scfindex.htm",
  },
  {
    label: "NY Fed — Household Debt and Credit",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "Fed G.19 — Consumer Credit",
    url: "https://www.federalreserve.gov/releases/g19/current/",
  },
  {
    label: "Theme research roll-up",
    url: "/blog/consumer-finance-markets-research-2026",
  },
  {
    label: "Aug 202608 vintage update",
    url: "/blog/consumer-finance-markets-update-202608",
  },
] as const;

export const PRIOR_RESEARCH_PATH = "/blog/consumer-finance-markets-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/consumer-finance-markets-update-202608";
export const PRIOR_DELINQ_PATH = "/blog/us-household-debt-delinquency-split-2026";
export const PRIOR_MMF_PATH = "/blog/money-market-funds-vs-deposits-2026";
export const PRIOR_APR_PATH = "/blog/us-credit-card-apr-vs-fed-funds-2026";

export const HEADLINE = {
  asOfWealth: "DFA latest published 2025–2026 window",
  asOfDebt: "NY Fed 2026Q2 / G.19 June 2026",
  /** Net worth — top of distribution */
  top1WealthSharePct: 30.5,
  top1WealthLabel: "Top 1% (wealth)",
  top3WealthSharePct: 46, // top 1% + next ~2% of wealth distribution approximated via top 0–3%
  top10WealthSharePct: 67.5,
  bottom50WealthSharePct: 2.5,
  wealthHhiProxy: 2150,
  /** Corporate equities & mutual fund shares — much thicker top */
  top1EquitySharePct: 54,
  top10EquitySharePct: 87,
  bottom50EquitySharePct: 1.0,
  /** Deposits / transaction accounts — milder skew */
  top1DepositSharePct: 17,
  top10DepositSharePct: 50,
  bottom50DepositSharePct: 8,
  /** Revolving balances — middle-heavy (inverse of equities) */
  top1CardSharePct: 5,
  top10CardSharePct: 24,
  middle4090CardSharePct: 46,
  bottom50CardSharePct: 30,
  /** Issuer purchase-volume concentration */
  top1IssuerSharePct: 22,
  top1IssuerLabel: "Chase",
  top3IssuerSharePct: 52,
  top5IssuerSharePct: 71,
  issuerUniverseLabel: "General-purpose card purchase volume",
  /** Aggregate context from theme */
  householdNetWorthTn: 169,
  totalDebtTn: 18.926,
  revolvingTn: 1.351,
  mmfTn: 7.928,
  depositsTn: 14.98,
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

/**
 * Household net worth by wealth percentile (DFA-style).
 * Shares sum to 100%; $Tn scaled to ~$169T aggregate.
 */
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
    note: "DFA top wealth percentile — equities + private business heavy",
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
    note: "Upper-middle / near-top; housing + retirement accounts matter",
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
    note: "Primary residence is the dominant asset for much of this band",
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
    note: "Thin net worth after consumer + student debt offsets",
  },
];

/** Lorenz-style concentration curve for net worth */
export const WEALTH_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top 1%", sharePct: 30.5, equalPct: 1 },
  { rank: 10, label: "Top 10%", sharePct: 67.5, equalPct: 10 },
  { rank: 50, label: "Top 50%", sharePct: 97.5, equalPct: 50 },
  { rank: 100, label: "All", sharePct: 100, equalPct: 100 },
];

export type AssetLensId = "netWorth" | "equities" | "deposits" | "realEstate" | "revolving";

export type AssetLensRow = {
  lens: AssetLensId;
  label: string;
  top1Pct: number;
  top10Pct: number;
  bottom50Pct: number;
  confidence: Confidence;
  fill: string;
  note: string;
};

/** Cross-asset concentration comparison — same percentile cuts, different ledgers */
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
    note: "Most top-heavy major asset class",
  },
  {
    lens: "deposits",
    label: "Deposits & cash-like",
    top1Pct: 17,
    top10Pct: 50,
    bottom50Pct: 8,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "Milder skew than equities; still top-10 heavy",
  },
  {
    lens: "realEstate",
    label: "Real estate (primary + other)",
    top1Pct: 13,
    top10Pct: 45,
    bottom50Pct: 11,
    confidence: "disclosed",
    fill: "#14b8a6",
    note: "Least top-heavy among major assets",
  },
  {
    lens: "revolving",
    label: "Revolving / card balances",
    top1Pct: 5,
    top10Pct: 24,
    bottom50Pct: 30,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Middle- and bottom-heavy — inverse of equities",
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

/** Equity ownership ladder (DFA-style) */
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

/** Deposit / cash-like ownership ladder */
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

/** Estimated revolving balance shares by wealth percentile */
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

export type IssuerShare = {
  issuer: string;
  short: string;
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
};

/** General-purpose card purchase-volume ranks (Nilson-style) */
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

export const ISSUER_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 22, equalPct: 16.7 },
  { rank: 2, label: "Top-2", sharePct: 38, equalPct: 33.3 },
  { rank: 3, label: "Top-3", sharePct: 52, equalPct: 50 },
  { rank: 5, label: "Top-5", sharePct: 71, equalPct: 83.3 },
  { rank: 6, label: "All", sharePct: 100, equalPct: 100 },
];

export type LensCompare = {
  id: string;
  label: string;
  top1Pct: number;
  top3Pct: number;
  note: string;
};

/**
 * Scatter of top-1 vs top-3 (or top-10 for wealth lenses where "top-3 people" ≈ not a natural cut).
 * For wealth/equity we use top-1 vs top-10 as the practical "thick top" pair;
 * for issuers we use literal top-1 / top-3 firm shares.
 */
export const LENS_COMPARE: LensCompare[] = [
  {
    id: "wealth",
    label: "Net worth (top-1 / top-10)",
    top1Pct: 30.5,
    top3Pct: 67.5,
    note: "DFA wealth — top-10 used as thick-top peer",
  },
  {
    id: "equities",
    label: "Equities (top-1 / top-10)",
    top1Pct: 54,
    top3Pct: 87,
    note: "Most concentrated household asset",
  },
  {
    id: "deposits",
    label: "Deposits (top-1 / top-10)",
    top1Pct: 17,
    top3Pct: 50,
    note: "Cash parking — milder than equities",
  },
  {
    id: "revolving",
    label: "Revolving (top-1 / top-10)",
    top1Pct: 5,
    top3Pct: 24,
    note: "Borrowing side — inverted skew",
  },
  {
    id: "issuers",
    label: "Card issuers (top-1 / top-3)",
    top1Pct: 22,
    top3Pct: 52,
    note: "Purchase-volume firm concentration",
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
    id: "rev",
    label: "G.19 revolving",
    value: "$1.351T",
    source: "June 2026 SA",
    confidence: "disclosed",
  },
  {
    id: "mmf",
    label: "ICI MMF AUM",
    value: "$7.928T",
    source: "Week ended Aug 19",
    confidence: "disclosed",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtTn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}T`;
}
