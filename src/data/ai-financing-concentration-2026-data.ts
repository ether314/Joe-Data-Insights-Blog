/**
 * AI financing — concentration / market-share lens (bonds, credit, ETFs).
 * Core question: How concentrated is this system at the top of the distribution?
 * How is the build-out funded in credit and public markets?
 *
 * Complements the Jul research spine, Aug $489B theme perimeter, Q3 supply-share
 * refresh, and Aug stock map with top-1 / top-3 shares across issuer bonds,
 * AI debt stack, IG calendar weight, channel stock, and ETF flow concentration.
 *
 * Primary sources (carried from theme vintages):
 * - Goldman Sachs credit / Exchanges (hyperscaler IG path; AI ~18–23% of US IG)
 * - FactSet / Reuters–LSEG deal tallies (issuer prints, spreads)
 * - Booth / Hepp stock map (HS senior ~$520B of ~$1.065T funded credit)
 * - FactSet / ETF.com thematic flow summary (QQQ vs thematic sleeve)
 */

export type Confidence = "disclosed" | "estimated" | "forecast" | "carried";

export const SOURCE_NOTE =
  "Issuer shares inside the five-name hyperscaler IG YTD (~$194B) are estimated from disclosed Reuters/LSEG deal prints and close to 100%. Theme-stack shares use GS mid-year AI-related debt (~$489B; hyperscalers ~40%). IG/HY calendar weights from Q3 desk refresh (~23% / ~20%). Channel-stock shares from Booth/Hepp Aug map (~$1.065T funded). ETF flow shares from FactSet 2025 thematic summary (QQQ ~$21.7B of ~$43.5B). Confidence tags separate disclosed tallies from research estimates.";

export const PRIOR_RESEARCH_PATH = "/blog/ai-financing-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/ai-financing-update-2026";
export const PRIOR_Q3_PATH = "/blog/ai-financing-update-2026q3";
export const PRIOR_STOCK_PATH = "/blog/ai-financing-update-202608";

export const HEADLINE = {
  /** Hyperscaler IG issuer ladder (2026 YTD ~$194B universe) */
  top1IssuerSharePct: 41,
  top1IssuerLabel: "Amazon",
  top3IssuerSharePct: 76,
  top3IssuerLabel: "Amazon · Alphabet · Meta",
  issuerUniverseBn: 194,
  issuerHhi: 2468,
  /** AI-related debt stack — five-name bloc vs ecosystem */
  hsShareOfAiDebtPct: 40,
  hsDebtBn: 194,
  aiDebtUniverseBn: 489,
  ecosystemBn: 295,
  /** Theme weight inside USD credit calendars (Q3) */
  aiIgSupplySharePct: 23,
  aiHySupplySharePct: 20,
  aiIgShare2024Pct: 1,
  aiIgShare2025Pct: 7,
  aiIgShareAugPct: 18,
  /** Funded credit-channel stock (Booth map) */
  top1ChannelSharePct: 49,
  top1ChannelLabel: "HS senior unsecured",
  top3ChannelSharePct: 91,
  fundedStockBn: 1065,
  hsSeniorStockBn: 520,
  /** Equity / ETF flow concentration */
  top1EtfSharePct: 50,
  top1EtfLabel: "QQQ",
  thematicEtfFlowsBn: 43.5,
  qqqFlowsBn: 21.7,
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
 * 2026 YTD hyperscaler IG issuer shares (five-name universe ≈ $194B).
 * Amazon leads on disclosed multi-tranche USD/EUR prints; remaining split
 * estimated to close the Goldman YTD spine.
 */
export const ISSUER_SHARES: IssuerShare[] = [
  {
    issuer: "Amazon",
    short: "AMZN",
    amountBn: 79.5,
    sharePct: 41,
    cumulativeSharePct: 41,
    confidence: "estimated",
    fill: "#ff9900",
    note: "Mar 2026 USD/EUR megadeals + further YTD notes; #1 global IG issuer rank in 2026 desk prints",
  },
  {
    issuer: "Alphabet",
    short: "GOOGL",
    amountBn: 38.8,
    sharePct: 20,
    cumulativeSharePct: 61,
    confidence: "estimated",
    fill: "#34a853",
    note: "IG notes only — excludes Jun 2026 ~$85B equity raise",
  },
  {
    issuer: "Meta",
    short: "META",
    amountBn: 29.1,
    sharePct: 15,
    cumulativeSharePct: 76,
    confidence: "estimated",
    fill: "#0668e1",
  },
  {
    issuer: "Oracle",
    short: "ORCL",
    amountBn: 27.2,
    sharePct: 14,
    cumulativeSharePct: 90,
    confidence: "estimated",
    fill: "#f80000",
    note: "Releveraging path; often prices wider than AA peers",
  },
  {
    issuer: "Microsoft",
    short: "MSFT",
    amountBn: 19.4,
    sharePct: 10,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#00a4ef",
    note: "Smaller IG share — still OCF-heavy relative to peers",
  },
];

/** Lorenz-style concentration curve for hyperscaler IG issuers */
export const ISSUER_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 41, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 61, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 76, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 90, equalPct: 80 },
  { rank: 5, label: "All-5", sharePct: 100, equalPct: 100 },
];

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

/** Mid-year AI-related debt stack — concentration of the theme perimeter */
export const AI_DEBT_STACK: DebtStackSlice[] = [
  {
    id: "hyperscalers",
    label: "Hyperscaler IG (5 names)",
    short: "HS IG",
    amountBn: 194,
    sharePct: 40,
    confidence: "disclosed",
    fill: "#10b981",
    note: "Amazon–Alphabet–Meta–Microsoft–Oracle YTD spine",
  },
  {
    id: "ecosystem",
    label: "Broader AI ecosystem debt",
    short: "Ecosystem",
    amountBn: 295,
    sharePct: 60,
    confidence: "estimated",
    fill: "#6366f1",
    note: "Utilities, industrials, DC JVs, HY / loans tied to the build",
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
 * Funded AI-infra credit stock (~$1.065T) — channel concentration.
 * HS senior unsecured alone is ~49%; top-3 channels clear ~91%.
 */
export const CHANNEL_STOCK_SHARES: ChannelStock[] = [
  {
    id: "hs-ig",
    label: "HS senior unsecured (IG)",
    short: "HS IG",
    amountBn: 520,
    sharePct: 49,
    cumulativeSharePct: 49,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Held by funds, insurers, pensions — lowest-risk sleeve",
  },
  {
    id: "project-dc",
    label: "Project / data-centre finance",
    short: "Project",
    amountBn: 250,
    sharePct: 23,
    cumulativeSharePct: 72,
    confidence: "estimated",
    fill: "#10b981",
    note: "Facility-tied; tenant cash-flow underwriting",
  },
  {
    id: "private-credit",
    label: "Private credit (est.)",
    short: "Private",
    amountBn: 200,
    sharePct: 19,
    cumulativeSharePct: 91,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Hard to observe; overlaps Q3 DC deal tallies",
  },
  {
    id: "abs",
    label: "Infrastructure / ABS",
    short: "ABS",
    amountBn: 60,
    sharePct: 6,
    cumulativeSharePct: 97,
    confidence: "estimated",
    fill: "#06b6d4",
    note: "Structured / ABS sleeve of the funded map",
  },
  {
    id: "gpu-secured",
    label: "GPU / asset-secured",
    short: "GPU",
    amountBn: 35,
    sharePct: 3,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#ef4444",
    note: "Fast-depreciating collateral sleeve",
  },
];

export const CHANNEL_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 49, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 72, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 91, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 97, equalPct: 80 },
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

/** Cross-lens concentration comparison */
export const LENS_COMPARE: LensCompare[] = [
  {
    lens: "Hyperscaler IG issuers (YTD)",
    short: "HS issuers",
    top1Pct: 41,
    top3Pct: 76,
    top1Label: "Amazon",
    note: "Inside five-name ~$194B universe",
    confidence: "estimated",
  },
  {
    lens: "AI debt theme stack",
    short: "AI debt",
    top1Pct: 40,
    top3Pct: 40,
    top1Label: "HS five-name bloc",
    note: "Bloc share of ~$489B; ecosystem is the long tail",
    confidence: "disclosed",
  },
  {
    lens: "Funded credit channels",
    short: "Channels",
    top1Pct: 49,
    top3Pct: 91,
    top1Label: "HS senior IG",
    note: "Booth/Hepp ~$1.065T funded stock",
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
] as const;

export function fmtPct(n: number, d = 0): string {
  return `${n.toFixed(d)}%`;
}

export function fmtBn(n: number): string {
  return n >= 100 ? `$${n.toFixed(0)}B` : `$${n.toFixed(1)}B`;
}
