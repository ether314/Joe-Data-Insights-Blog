/**
 * AI financing — Q3 2026 concentration / market-share lens (bonds, credit, ETFs).
 * Core question: How concentrated is this system at the top of the distribution?
 * How is the build-out funded in credit and public markets once mid-Q3 issuance
 * continues toward the ~$250B hyperscaler FY path?
 *
 * Complements the Jul research spine, Aug $489B theme perimeter, Q3 supply-share
 * refresh, Aug stock map, and the late-Aug concentration companion with a mid-Q3
 * YTD issuer ladder (~$218B), expanded AI-debt perimeter (~$520B), and private-DC
 * channel weight (~$200B) inside a larger funded-credit stock (~$1.15T).
 *
 * Primary sources (carried + Q3 desk refresh):
 * - Goldman Sachs credit / Exchanges (hyperscaler IG path; AI ~18–23% of US IG)
 * - FactSet / Reuters–LSEG deal tallies (issuer prints, spreads)
 * - Booth / Hepp stock map + Q3 private-DC overflow (~$200B since early 2025)
 * - FactSet / ETF.com thematic flow summary (QQQ vs thematic sleeve)
 */

export type Confidence = "disclosed" | "estimated" | "forecast" | "carried";

export const SOURCE_NOTE =
  "Mid-Q3 2026 concentration vintage. Issuer shares inside the five-name hyperscaler IG YTD (~$218B) are estimated from disclosed Reuters/LSEG deal prints and close to 100%. Theme-stack shares use an expanded AI-related debt perimeter (~$520B; hyperscalers ~42%). IG/HY calendar weights from Q3 desk refresh (~23% / ~20%). Channel-stock shares rebase Booth/Hepp with Q3 private-DC overflow (~$1.15T funded). ETF flow shares from FactSet 2025 thematic summary (QQQ ~$21.7B of ~$43.5B). Confidence tags separate disclosed tallies from research estimates.";

export const PRIOR_RESEARCH_PATH = "/blog/ai-financing-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/ai-financing-update-2026";
export const PRIOR_Q3_PATH = "/blog/ai-financing-update-2026q3";
export const PRIOR_STOCK_PATH = "/blog/ai-financing-update-202608";
export const PRIOR_CONCENTRATION_PATH = "/blog/ai-financing-concentration-2026";

export const HEADLINE = {
  /** Hyperscaler IG issuer ladder (mid-Q3 YTD ~$218B universe) */
  top1IssuerSharePct: 39,
  top1IssuerLabel: "Amazon",
  top3IssuerSharePct: 74,
  top3IssuerLabel: "Amazon · Alphabet · Meta",
  issuerUniverseBn: 218,
  issuerHhi: 2486,
  priorAugIssuerUniverseBn: 194,
  priorAugTop1Pct: 41,
  priorAugTop3Pct: 76,
  /** AI-related debt stack — five-name bloc vs ecosystem */
  hsShareOfAiDebtPct: 42,
  hsDebtBn: 218,
  aiDebtUniverseBn: 520,
  ecosystemBn: 302,
  priorAiDebtBn: 489,
  priorHsSharePct: 40,
  /** Theme weight inside USD credit calendars (Q3) */
  aiIgSupplySharePct: 23,
  aiHySupplySharePct: 20,
  aiIgShare2024Pct: 1,
  aiIgShare2025Pct: 7,
  aiIgShareAugPct: 18,
  /** Funded credit-channel stock (Booth map + Q3 private-DC) */
  top1ChannelSharePct: 47,
  top1ChannelLabel: "HS senior unsecured",
  top3ChannelSharePct: 90,
  fundedStockBn: 1150,
  hsSeniorStockBn: 540,
  privateDcBn: 200,
  privateDcSharePct: 17,
  /** Equity / ETF flow concentration */
  top1EtfSharePct: 50,
  top1EtfLabel: "QQQ",
  thematicEtfFlowsBn: 43.5,
  qqqFlowsBn: 21.7,
  /** FY path */
  hsFyPathBn: 250,
} as const;

export type IssuerShare = {
  issuer: string;
  short: string;
  amountBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Mid-Q3 2026 YTD hyperscaler IG issuer shares (five-name universe ≈ $218B).
 * Amazon still leads; peer prints into Q3 ease top-1 share vs the Aug ~41% print.
 */
export const ISSUER_SHARES: IssuerShare[] = [
  {
    issuer: "Amazon",
    short: "AMZN",
    amountBn: 85.0,
    sharePct: 39,
    cumulativeSharePct: 39,
    confidence: "estimated",
    fill: "#ff9900",
    note: "Mar 2026 USD/EUR megadeals + further Q3 notes; still #1 global IG issuer",
  },
  {
    issuer: "Alphabet",
    short: "GOOGL",
    amountBn: 43.6,
    sharePct: 20,
    cumulativeSharePct: 59,
    confidence: "estimated",
    fill: "#34a853",
    note: "IG notes only — excludes Jun 2026 ~$85B equity raise",
  },
  {
    issuer: "Meta",
    short: "META",
    amountBn: 32.7,
    sharePct: 15,
    cumulativeSharePct: 74,
    confidence: "estimated",
    fill: "#0668e1",
    note: "Long-dated paper still prices below official AA (Q3 rating-vs-market gap)",
  },
  {
    issuer: "Oracle",
    short: "ORCL",
    amountBn: 30.5,
    sharePct: 14,
    cumulativeSharePct: 88,
    confidence: "estimated",
    fill: "#f80000",
    note: "Releveraging path; often prices wider than AA peers",
  },
  {
    issuer: "Microsoft",
    short: "MSFT",
    amountBn: 26.2,
    sharePct: 12,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#00a4ef",
    note: "Smaller IG share — still OCF-heavy relative to peers",
  },
];

/** Lorenz-style concentration curve for hyperscaler IG issuers */
export const ISSUER_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 39, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 59, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 74, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 88, equalPct: 80 },
  { rank: 5, label: "All-5", sharePct: 100, equalPct: 100 },
];

/** Aug → Q3 top-share path inside the five-name spine */
export const ISSUER_SHARE_PATH = [
  {
    vintage: "Aug mid-year",
    short: "Aug",
    universeBn: 194,
    top1Pct: 41,
    top3Pct: 76,
    hhi: 2468,
  },
  {
    vintage: "Mid-Q3",
    short: "Q3",
    universeBn: 218,
    top1Pct: 39,
    top3Pct: 74,
    hhi: 2486,
  },
  {
    vintage: "FY path (est.)",
    short: "FY",
    universeBn: 250,
    top1Pct: 38,
    top3Pct: 73,
    hhi: 2420,
  },
] as const;

export type DebtStackSlice = {
  id: string;
  label: string;
  short: string;
  amountBn: number;
  sharePct: number;
  confidence: Confidence;
  fill: string;
  note: string;
};

/** Mid-Q3 AI-related debt stack — concentration of the theme perimeter */
export const AI_DEBT_STACK: DebtStackSlice[] = [
  {
    id: "hyperscalers",
    label: "Hyperscaler IG (5 names)",
    short: "HS IG",
    amountBn: 218,
    sharePct: 42,
    confidence: "estimated",
    fill: "#10b981",
    note: "Amazon–Alphabet–Meta–Microsoft–Oracle mid-Q3 YTD spine",
  },
  {
    id: "ecosystem",
    label: "Broader AI ecosystem debt",
    short: "Ecosystem",
    amountBn: 302,
    sharePct: 58,
    confidence: "estimated",
    fill: "#6366f1",
    note: "Utilities, industrials, DC JVs, HY / loans, private-DC overflow",
  },
];

export type SupplyShareYear = {
  year: number;
  label: string;
  aiShareOfUsIgPct: number;
  confidence: Confidence;
};

/** Rising theme weight inside US IG gross supply */
export const AI_IG_SUPPLY_PATH: SupplyShareYear[] = [
  { year: 2024, label: "~$10B AI-related", aiShareOfUsIgPct: 1, confidence: "estimated" },
  { year: 2025, label: "First AI bond wave", aiShareOfUsIgPct: 7, confidence: "disclosed" },
  { year: 2026, label: "Aug mid-year desk", aiShareOfUsIgPct: 18, confidence: "estimated" },
  { year: 2026.5, label: "Q3 refresh", aiShareOfUsIgPct: 23, confidence: "estimated" },
];

export type ChannelStock = {
  id: string;
  label: string;
  short: string;
  amountBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  note: string;
};

/**
 * Funded AI-infra credit stock (~$1.15T) — channel concentration.
 * HS senior unsecured alone is ~47%; top-3 channels clear ~90%.
 * Private DC (~$200B) is now a quantified overflow sleeve, not dry-powder abstract.
 */
export const CHANNEL_STOCK_SHARES: ChannelStock[] = [
  {
    id: "hs-ig",
    label: "HS senior unsecured (IG)",
    short: "HS IG",
    amountBn: 540,
    sharePct: 47,
    cumulativeSharePct: 47,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Held by funds, insurers, pensions — lowest-risk sleeve",
  },
  {
    id: "project-dc",
    label: "Project / data-centre finance",
    short: "Project",
    amountBn: 260,
    sharePct: 23,
    cumulativeSharePct: 70,
    confidence: "estimated",
    fill: "#10b981",
    note: "Facility-tied; tenant cash-flow underwriting",
  },
  {
    id: "private-credit",
    label: "Private credit + DC overflow",
    short: "Private",
    amountBn: 230,
    sharePct: 20,
    cumulativeSharePct: 90,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Includes ~$200B private DC deals since early 2025 (Q3 quantification)",
  },
  {
    id: "abs",
    label: "Infrastructure / ABS",
    short: "ABS",
    amountBn: 70,
    sharePct: 6,
    cumulativeSharePct: 96,
    confidence: "estimated",
    fill: "#06b6d4",
    note: "Structured / ABS sleeve of the funded map",
  },
  {
    id: "gpu-secured",
    label: "GPU / asset-secured",
    short: "GPU",
    amountBn: 50,
    sharePct: 4,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#ef4444",
    note: "Fast-depreciating collateral sleeve",
  },
];

export const CHANNEL_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 47, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 70, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 90, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 96, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export type EtfFlowShare = {
  ticker: string;
  name: string;
  flowsBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  role: "broad_proxy" | "semiconductor" | "thematic" | "residual";
  confidence: Confidence;
  fill: string;
};

/** 2025 US thematic ETF inflow concentration (FactSet sleeve) */
export const ETF_FLOW_SHARES: EtfFlowShare[] = [
  {
    ticker: "QQQ",
    name: "Invesco QQQ (Mag 7 proxy)",
    flowsBn: 21.7,
    sharePct: 50,
    cumulativeSharePct: 50,
    role: "broad_proxy",
    confidence: "disclosed",
    fill: "#06b6d4",
  },
  {
    ticker: "SOXX",
    name: "iShares Semiconductor",
    flowsBn: 8.5,
    sharePct: 20,
    cumulativeSharePct: 70,
    role: "semiconductor",
    confidence: "estimated",
    fill: "#10b981",
  },
  {
    ticker: "BOTZ+AIQ",
    name: "Robotics / AI thematics",
    flowsBn: 2.0,
    sharePct: 5,
    cumulativeSharePct: 75,
    role: "thematic",
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    ticker: "OTHER",
    name: "Other thematic ETFs",
    flowsBn: 11.3,
    sharePct: 25,
    cumulativeSharePct: 100,
    role: "residual",
    confidence: "estimated",
    fill: "#64748b",
  },
];

export const ETF_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 50, equalPct: 25 },
  { rank: 2, label: "Top-2", sharePct: 70, equalPct: 50 },
  { rank: 3, label: "Top-3", sharePct: 75, equalPct: 75 },
  { rank: 4, label: "All", sharePct: 100, equalPct: 100 },
];

export type LensCompare = {
  lens: string;
  short: string;
  top1Pct: number;
  top3Pct: number;
  top1Label: string;
  note: string;
  confidence: Confidence;
};

/** Cross-lens concentration comparison — mid-Q3 */
export const LENS_COMPARE: LensCompare[] = [
  {
    lens: "Hyperscaler IG issuers (YTD)",
    short: "HS issuers",
    top1Pct: 39,
    top3Pct: 74,
    top1Label: "Amazon",
    note: "Inside five-name ~$218B mid-Q3 universe",
    confidence: "estimated",
  },
  {
    lens: "AI debt theme stack",
    short: "AI debt",
    top1Pct: 42,
    top3Pct: 42,
    top1Label: "HS five-name bloc",
    note: "Bloc share of ~$520B; ecosystem is the long tail",
    confidence: "estimated",
  },
  {
    lens: "Funded credit channels",
    short: "Channels",
    top1Pct: 47,
    top3Pct: 90,
    top1Label: "HS senior IG",
    note: "Booth/Hepp + Q3 private-DC ~$1.15T funded stock",
    confidence: "estimated",
  },
  {
    lens: "Thematic ETF flows (2025)",
    short: "ETF flows",
    top1Pct: 50,
    top3Pct: 75,
    top1Label: "QQQ",
    note: "FactSet thematic sleeve ~$43.5B",
    confidence: "disclosed",
  },
  {
    lens: "US IG calendar weight",
    short: "IG calendar",
    top1Pct: 23,
    top3Pct: 23,
    top1Label: "AI theme (all names)",
    note: "Q3 theme share of USD IG supply — not an issuer ladder",
    confidence: "estimated",
  },
];

export type HyIgCompare = {
  market: string;
  short: string;
  sharePct: number;
  priorPct: number;
  deltaPp: number;
  fill: string;
};

/** Theme share of USD IG vs HY supply — Q3 vs Aug */
export const THEME_CREDIT_SHARES: HyIgCompare[] = [
  {
    market: "USD investment-grade",
    short: "IG",
    sharePct: 23,
    priorPct: 18,
    deltaPp: 5,
    fill: "#0ea5e9",
  },
  {
    market: "US high-yield",
    short: "HY",
    sharePct: 20,
    priorPct: 18,
    deltaPp: 2,
    fill: "#f43f5e",
  },
];

export const SOURCES = [
  {
    label: "Goldman Sachs Exchanges — How AI Debt Is Reshaping Credit Markets",
    url: "https://www.goldmansachs.com/insights/goldman-sachs-exchanges/how-ai-debt-is-reshaping-the-credit-market",
  },
  {
    label: "FactSet — hyperscalers tap external financing as capex outruns cash flow",
    url: "https://insight.factset.com/hyperscalers-tap-external-financing-as-ai-capex-outruns-cash-flow",
  },
  {
    label: "CNA / Reuters — hyperscaler debt binge, spreads, and YTD issuance",
    url: "https://www.channelnewsasia.com/business/hyperscaler-debt-binge-pushes-yields-up-investor-demand-cools-6286196",
  },
  {
    label: "Chicago Booth / Hepp — AI Infrastructure Debt Complex (stock map)",
    url: "https://www.chicagobooth.edu/review/how-worried-should-we-be-about-ai-debt",
  },
  {
    label: "FactSet — US ETF thematic flow summary 2025",
    url: "https://insight.factset.com/u.s.-etf-summary-december-and-full-year-2025-results",
  },
  {
    label: "Prior theme — AI financing research 2026",
    url: PRIOR_RESEARCH_PATH,
  },
  {
    label: "Prior theme — Q3 financing update",
    url: PRIOR_Q3_PATH,
  },
  {
    label: "Late-Aug concentration companion",
    url: PRIOR_CONCENTRATION_PATH,
  },
] as const;

export function fmtPct(n: number, d = 0): string {
  return `${n.toFixed(d)}%`;
}

export function fmtBn(n: number): string {
  return n >= 100 ? `$${n.toFixed(0)}B` : `$${n.toFixed(1)}B`;
}
