/**
 * AI financing — August 202608 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * How is the build-out funded in credit and public markets once the Booth/Hepp
 * stock map (Aug 7 2026) replaces the flow-only perimeter?
 *
 * Complements:
 * - Jul research spine (GS ~$250B / ~33% debt-funded path)
 * - Mid-year $489B theme perimeter + Aug issuer concentration companion
 * - Q3 supply-share / mid-Q3 issuer refresh
 * - Aug 202608 stock-map update (this post’s primary spine)
 *
 * Primary sources:
 * - Chicago Booth Review / Stefan Hepp stock map (Aug 7 2026)
 * - Goldman Sachs credit / Exchanges (IG path; AI ~18–23% of US IG)
 * - FactSet / Reuters–LSEG deal tallies (issuer prints)
 * - FactSet / ETF.com thematic flow summary (QQQ vs thematic sleeve)
 * - S&P uncommenced-lease overhang (~$675B)
 */

export type Confidence = "disclosed" | "estimated" | "forecast" | "carried";

export const SOURCE_NOTE =
  "August 202608 concentration vintage. Channel shares rebase the Booth/Hepp funded map (~$1.065T): HS senior unsecured ~$520B (49%), top-3 channels ~91%. Issuer shares inside the five-name hyperscaler IG YTD (~$194B) are carried from the late-Aug companion (Amazon ~41% / top-3 ~76%). Theme-stack shares use the GS mid-year AI-related debt perimeter (~$489B; hyperscalers ~40%). IG/HY calendar weights carried from Q3 desk (~23% / ~20%). ETF flow shares from FactSet 2025 thematic summary (QQQ ~$21.7B of ~$43.5B). Lease overhang (~$675B) is disclosed (S&P) but excluded from funded totals. Confidence tags separate disclosed tallies from research estimates.";

export const PRIOR_RESEARCH_PATH = "/blog/ai-financing-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/ai-financing-update-2026";
export const PRIOR_Q3_PATH = "/blog/ai-financing-update-2026q3";
export const PRIOR_STOCK_PATH = "/blog/ai-financing-update-202608";
export const PRIOR_CONCENTRATION_PATH = "/blog/ai-financing-concentration-2026";
export const PRIOR_Q3_CONCENTRATION_PATH = "/blog/ai-financing-concentration-2026q3";

export const HEADLINE = {
  /** Primary spine — funded credit-channel stock (Booth map) */
  top1ChannelSharePct: 49,
  top1ChannelLabel: "HS senior unsecured",
  top3ChannelSharePct: 91,
  top3ChannelLabel: "HS IG · Project/DC · Private credit",
  fundedStockBn: 1065,
  hsSeniorStockBn: 520,
  projectDcBn: 250,
  privateCreditBn: 200,
  channelHhi: 3278,
  /** Off-balance overhang (excluded from funded %) */
  uncommencedLeasesBn: 675,
  fundedPlusOverhangBn: 1740,
  leaseShareOfTotalCommitmentPct: 39,
  /** Hyperscaler IG issuer ladder (Aug YTD ~$194B) — carried */
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
  /** Theme weight inside USD credit calendars */
  aiIgSupplySharePct: 23,
  aiHySupplySharePct: 20,
  aiIgShare2024Pct: 1,
  aiIgShare2025Pct: 7,
  aiIgShareAugPct: 18,
  /** Equity / ETF flow concentration */
  top1EtfSharePct: 50,
  top1EtfLabel: "QQQ",
  thematicEtfFlowsBn: 43.5,
  qqqFlowsBn: 21.7,
  /** Stress band (Booth) */
  stressLossLowBn: 60,
  stressLossHighBn: 140,
  /** FY path */
  hsFyPathBn: 250,
  /** GPU tip */
  gpuSecuredBn: 35,
  anthropicSpvBn: 35,
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
 * Aug 2026 YTD hyperscaler IG issuer shares (five-name universe ≈ $194B).
 * Carried from the late-Aug concentration companion — stock-map vintage
 * does not revise the flow issuer ladder.
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
    note: "Mar 2026 USD/EUR megadeals + further YTD notes; #1 global IG issuer",
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
    note: "Long-dated paper still prices below official AA",
  },
  {
    issuer: "Oracle",
    short: "ORCL",
    amountBn: 25.2,
    sharePct: 13,
    cumulativeSharePct: 89,
    confidence: "estimated",
    fill: "#f80000",
    note: "Releveraging path; often prices wider than AA peers",
  },
  {
    issuer: "Microsoft",
    short: "MSFT",
    amountBn: 21.4,
    sharePct: 11,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#00a4ef",
    note: "Smaller IG share — still OCF-heavy relative to peers",
  },
];

export const ISSUER_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 41, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 61, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 76, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 89, equalPct: 80 },
  { rank: 5, label: "All-5", sharePct: 100, equalPct: 100 },
];

/** Vintage path of issuer Top-1 / Top-3 inside the five-name spine */
export const ISSUER_SHARE_PATH = [
  {
    vintage: "Aug mid-year flow",
    short: "Aug flow",
    universeBn: 194,
    top1Pct: 41,
    top3Pct: 76,
    hhi: 2468,
  },
  {
    vintage: "Mid-Q3 flow",
    short: "Q3 flow",
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

/** AI-related debt stack — concentration of the theme perimeter (~$489B) */
export const AI_DEBT_STACK: DebtStackSlice[] = [
  {
    id: "hyperscalers",
    label: "Hyperscaler IG (5 names)",
    short: "HS IG",
    amountBn: 194,
    sharePct: 40,
    confidence: "estimated",
    fill: "#10b981",
    note: "Amazon–Alphabet–Meta–Microsoft–Oracle Aug YTD spine",
  },
  {
    id: "ecosystem",
    label: "Broader AI ecosystem debt",
    short: "Ecosystem",
    amountBn: 295,
    sharePct: 60,
    confidence: "estimated",
    fill: "#6366f1",
    note: "Utilities, industrials, DC JVs, HY / loans, private overflow",
  },
];

export type SupplyShareYear = {
  year: number;
  label: string;
  aiShareOfUsIgPct: number;
  confidence: Confidence;
};

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
  seniority: "senior" | "hybrid" | "junior";
};

/**
 * Funded AI-infra credit stock (~$1.065T) — channel concentration.
 * HS senior unsecured alone is ~49%; top-3 channels clear ~91%.
 * Primary headline spine for the 202608 concentration vintage.
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
    seniority: "senior",
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
    seniority: "hybrid",
  },
  {
    id: "private-credit",
    label: "Private credit",
    short: "Private",
    amountBn: 200,
    sharePct: 19,
    cumulativeSharePct: 91,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Author estimate; overlaps private DC deals since early 2025",
    seniority: "junior",
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
    seniority: "senior",
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
    note: "Fast-depreciating collateral; Anthropic SPV ~$35B tip",
    seniority: "junior",
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

/**
 * Dual universe: funded stock vs funded + uncommenced lease overhang.
 * Leases are excluded from funded % but dominate total commitment share.
 */
export const COMMITMENT_UNIVERSE = [
  {
    id: "funded",
    label: "Funded credit stock",
    short: "Funded",
    amountBn: 1065,
    sharePct: 61,
    fill: "#8b5cf6",
    note: "Booth five-channel sum",
    confidence: "estimated" as Confidence,
  },
  {
    id: "leases",
    label: "Uncommenced leases (S&P)",
    short: "Leases",
    amountBn: 675,
    sharePct: 39,
    fill: "#6366f1",
    note: "Signed but not commenced — off-balance",
    confidence: "disclosed" as Confidence,
  },
] as const;

export type SeniorityBucket = {
  id: string;
  label: string;
  short: string;
  amountBn: number;
  sharePct: number;
  fill: string;
  note: string;
  firstLossRisk: "low" | "medium" | "high";
};

/** Seniority concentration inside funded stock — where stress lands first */
export const SENIORITY_BUCKETS: SeniorityBucket[] = [
  {
    id: "senior",
    label: "Senior (HS IG + ABS)",
    short: "Senior",
    amountBn: 580,
    sharePct: 54,
    fill: "#8b5cf6",
    note: "Institutional IG + structured senior",
    firstLossRisk: "low",
  },
  {
    id: "hybrid",
    label: "Hybrid (project / DC)",
    short: "Hybrid",
    amountBn: 250,
    sharePct: 23,
    fill: "#10b981",
    note: "Facility-tied; tenant CF underwriting",
    firstLossRisk: "medium",
  },
  {
    id: "junior",
    label: "Junior (private + GPU)",
    short: "Junior",
    amountBn: 235,
    sharePct: 22,
    fill: "#f59e0b",
    note: "First-loss outside regulated banks in stress",
    firstLossRisk: "high",
  },
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

/** Cross-lens concentration — Aug 202608 stock-map vintage */
export const LENS_COMPARE: LensCompare[] = [
  {
    lens: "Funded credit channels",
    short: "Channels",
    top1Pct: 49,
    top3Pct: 91,
    top1Label: "HS senior IG",
    note: "Booth/Hepp ~$1.065T funded stock — primary spine",
    confidence: "estimated",
  },
  {
    lens: "Hyperscaler IG issuers (YTD)",
    short: "HS issuers",
    top1Pct: 41,
    top3Pct: 76,
    top1Label: "Amazon",
    note: "Inside five-name ~$194B Aug YTD universe",
    confidence: "estimated",
  },
  {
    lens: "AI debt theme stack",
    short: "AI debt",
    top1Pct: 40,
    top3Pct: 40,
    top1Label: "HS five-name bloc",
    note: "Bloc share of ~$489B; ecosystem is the long tail",
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
    lens: "Total commitment (funded+leases)",
    short: "Commitment",
    top1Pct: 39,
    top3Pct: 39,
    top1Label: "Uncommenced leases",
    note: "Lease overhang as share of ~$1.74T total — not an issuer ladder",
    confidence: "disclosed",
  },
  {
    lens: "US IG calendar weight",
    short: "IG calendar",
    top1Pct: 23,
    top3Pct: 23,
    top1Label: "AI theme (all names)",
    note: "Q3 theme share of USD IG supply — carried",
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

export type StressIncidence = {
  sleeve: string;
  short: string;
  fundedSharePct: number;
  stressWeight: number;
  lossShareLowPct: number;
  lossShareHighPct: number;
  fill: string;
  note: string;
};

/**
 * Illustrative stress incidence — first-loss weights skew junior even when
 * funded stock is senior-heavy. Not a cite-ready loss allocation.
 */
export const STRESS_INCIDENCE: StressIncidence[] = [
  {
    sleeve: "Senior IG + ABS",
    short: "Senior",
    fundedSharePct: 54,
    stressWeight: 0.25,
    lossShareLowPct: 15,
    lossShareHighPct: 25,
    fill: "#8b5cf6",
    note: "Large stock, low first-loss in Booth framing",
  },
  {
    sleeve: "Project / DC",
    short: "Project",
    fundedSharePct: 23,
    stressWeight: 0.35,
    lossShareLowPct: 30,
    lossShareHighPct: 35,
    fill: "#10b981",
    note: "Tenant CF and facility risk",
  },
  {
    sleeve: "Private + GPU",
    short: "Junior",
    fundedSharePct: 22,
    stressWeight: 0.4,
    lossShareLowPct: 55,
    lossShareHighPct: 40,
    fill: "#f59e0b",
    note: "Thin stock, fat first-loss outside banks",
  },
];

export const SOURCES = [
  {
    label: "Chicago Booth Review — How Worried Should We Be About AI Debt? (Aug 7, 2026)",
    url: "https://www.chicagobooth.edu/review/2026/august/how-worried-should-we-be-about-ai-debt",
  },
  {
    label: "Goldman Sachs Exchanges — How AI Debt Is Reshaping Credit Markets",
    url: "https://www.goldmansachs.com/insights/goldman-sachs-exchanges/how-ai-debt-is-reshaping-the-credit-market",
  },
  {
    label: "FactSet — hyperscalers tap external financing as capex outruns cash flow",
    url: "https://insight.factset.com/hyperscalers-tap-external-financing-as-ai-capex-outruns-cash-flow",
  },
  {
    label: "FactSet — US ETF thematic flow summary 2025",
    url: "https://insight.factset.com/u.s.-etf-summary-december-and-full-year-2025-results",
  },
  {
    label: "Prior theme — Aug 202608 stock-map update",
    url: PRIOR_STOCK_PATH,
  },
  {
    label: "Prior theme — late-Aug concentration companion",
    url: PRIOR_CONCENTRATION_PATH,
  },
  {
    label: "Prior theme — Q3 concentration refresh",
    url: PRIOR_Q3_CONCENTRATION_PATH,
  },
] as const;

export function fmtPct(n: number, d = 0): string {
  return `${n.toFixed(d)}%`;
}

export function fmtBn(n: number): string {
  return n >= 100 ? `$${n.toFixed(0)}B` : `$${n.toFixed(1)}B`;
}
