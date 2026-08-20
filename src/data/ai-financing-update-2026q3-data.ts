/**
 * AI financing — Q3 2026 vintage update.
 *
 * Core question: What changed vs the Aug 2026 mid-year update
 * (ai-financing-update-2026)? How is the build-out funded in credit
 * and public markets once the theme share of USD IG/HY supply
 * re-prints above the August desk estimate?
 *
 * Prior vintage (Aug 2026 update): AI-related debt ~$489B YTD;
 * hyperscalers ~40% / ~$194B; AI ~18% of US IG supply; HY ~18%;
 * non-USD HS mix ~33%; project finance 2027 ~$300B.
 *
 * Q3 vintage layers:
 * 1. Theme supply share: USD IG ~18% → ~23% (+5 pp); US HY ~18% → ~20%.
 * 2. Private data-centre transactions ~$200B since early 2025 (overflow
 *    channel now quantified, not just dry-powder abstract).
 * 3. Rating-vs-market gap: Meta AA→BBB-equivalent; Amazon AA→A-equivalent
 *    on long-dated paper (supply technicals, not default narrative).
 * 4. Stock exposure: AI-tagged ~15% of US IG market; Big-5 path to >5%
 *    of major IG indices by YE2026; JPM absorb ~$300B / ~$1.5T 5y map.
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "forecast";

export const SOURCE_NOTE =
  "Q3 vintage delta: Aug 2026 mid-year update (AI debt ~$489B; HS ~40%; AI ~18% of US IG) vs Q3 2026 credit refresh (USD IG theme share ~23%; HY ~20%; private DC deals ~$200B since early 2025; Meta/Amazon long-dated paper pricing below official AA). Hyperscaler YTD spine and FY path carried from Aug GS print.";

export const SOURCES = [
  {
    label: "Goldman Sachs Exchanges — How AI Debt Is Reshaping Credit Markets (Aug 2026)",
    url: "https://www.goldmansachs.com/insights/goldman-sachs-exchanges/how-ai-debt-is-reshaping-the-credit-market",
  },
  {
    label: "Dark Side of the Boom — AI debt market build-out (Jul 22, 2026 synthesis, Q3 desk read)",
    url: "https://thedarksideoftheboom.substack.com/p/the-ai-boom-is-building-a-debt-market",
  },
  {
    label: "ACF / StockWireX — AI debt wave hits IG credit (Aug 11, 2026)",
    url: "https://stockwirex.com/analysis/acf-acf-group-ai-bond-market-investment-grade-credit-august-2026/",
  },
  {
    label: "Prior theme update — Aug 2026 mid-year $489B print",
    url: "/blog/ai-financing-update-2026",
  },
  {
    label: "Theme baseline — AI financing research 2026",
    url: "/blog/ai-financing-research-2026",
  },
] as const;

/** Snapshot as published in ai-financing-update-2026 (Aug 2026) */
export const PRIOR_VINTAGE = {
  label: "Aug 2026 mid-year",
  aiRelatedDebtYtdBn: 489,
  hyperscalerIgYtdBn: 194,
  hyperscalerShareOfAiDebtPct: 40,
  hyperscalerIgFullYearPathBn: 250,
  debtShareOfCapexPct: 33,
  aiShareOfUsIgSupplyPct: 18,
  aiShareOfUsHySupplyPct: 18,
  nonUsdShareOfHyperscalerPct: 33,
  longEndAiShareOf15yPlusPct: 40,
  projectFinance2027Bn: 300,
  privateMarketsDryPowderTn: 4.5,
  privateDcTransactionsBn: null as number | null,
  aiTaggedStockShareOfIgPct: null as number | null,
  big5IgIndexWeightPathPct: null as number | null,
  confidence: "estimated" as Confidence,
};

/** Newest Q3 2026 desk / market synthesis */
export const NEW_VINTAGE = {
  label: "Q3 2026 update",
  aiRelatedDebtYtdBn: 489,
  hyperscalerIgYtdBn: 194,
  hyperscalerShareOfAiDebtPct: 40,
  hyperscalerIgFullYearPathBn: 250,
  debtShareOfCapexPct: 33,
  aiShareOfUsIgSupplyPct: 23,
  aiShareOfUsHySupplyPct: 20,
  nonUsdShareOfHyperscalerPct: 33,
  longEndAiShareOf15yPlusPct: 40,
  projectFinance2027Bn: 300,
  privateMarketsDryPowderTn: 4.5,
  privateDcTransactionsBn: 200,
  aiTaggedStockShareOfIgPct: 15,
  big5IgIndexWeightPathPct: 5,
  jpmAbsorbNextYearBn: 300,
  jpmFundingNeed5yTn: 1.5,
  confidence: "estimated" as Confidence,
};

export const HEADLINE = {
  aiIgSharePriorPct: 18,
  aiIgShareNewPct: 23,
  aiIgShareDeltaPp: 5,
  aiHySharePriorPct: 18,
  aiHyShareNewPct: 20,
  aiHyShareDeltaPp: 2,
  aiRelatedDebtYtdBn: 489,
  hyperscalerSharePct: 40,
  hyperscalerYtdBn: 194,
  privateDcBn: 200,
  aiTaggedStockPct: 15,
  big5IndexPathPct: 5,
  jpmAbsorbBn: 300,
  jpm5yTn: 1.5,
};

export type SupplyShareYear = {
  year: number;
  aiShareOfUsIgPct: number;
  aiShareOfUsHyPct: number | null;
  label: string;
  confidence: Confidence;
};

/** Theme share of US credit gross supply — Aug path + Q3 re-print */
export const AI_SUPPLY_SHARE_PATH: SupplyShareYear[] = [
  {
    year: 2024,
    aiShareOfUsIgPct: 1,
    aiShareOfUsHyPct: null,
    label: "~$10B AI-related IG",
    confidence: "estimated",
  },
  {
    year: 2025,
    aiShareOfUsIgPct: 7,
    aiShareOfUsHyPct: null,
    label: "~$108B hyperscaler + AI stack",
    confidence: "disclosed",
  },
  {
    year: 2026,
    aiShareOfUsIgPct: 18,
    aiShareOfUsHyPct: 18,
    label: "Aug mid-year YTD run-rate",
    confidence: "estimated",
  },
  {
    year: 2026.3,
    aiShareOfUsIgPct: 23,
    aiShareOfUsHyPct: 20,
    label: "Q3 desk refresh (USD IG / HY)",
    confidence: "estimated",
  },
];

/** Chart-friendly year labels for the dual-line path */
export const SUPPLY_SHARE_SERIES = [
  { period: "2024", ig: 1, hy: null as number | null, note: "Nascent" },
  { period: "2025", ig: 7, hy: null as number | null, note: "HS stack expands" },
  { period: "Aug'26", ig: 18, hy: 18, note: "Prior vintage" },
  { period: "Q3'26", ig: 23, hy: 20, note: "New vintage" },
];

export type VintageMetric = {
  id: string;
  label: string;
  prior: number | null;
  neu: number;
  unit: "bn" | "pct" | "pp" | "tn";
  priorNote: string;
  newNote: string;
  color: string;
};

/** Metrics that moved (or newly appeared) between Aug and Q3 */
export const VINTAGE_METRICS: VintageMetric[] = [
  {
    id: "ig-supply-share",
    label: "AI share of USD IG supply",
    prior: 18,
    neu: 23,
    unit: "pct",
    priorNote: "Aug mid-year YTD",
    newNote: "Q3 desk refresh",
    color: "#8b5cf6",
  },
  {
    id: "hy-supply-share",
    label: "AI share of US HY supply",
    prior: 18,
    neu: 20,
    unit: "pct",
    priorNote: "Aug ~similar to IG",
    newNote: "Q3 HY print",
    color: "#ef4444",
  },
  {
    id: "private-dc",
    label: "Private DC transactions",
    prior: null,
    neu: 200,
    unit: "bn",
    priorNote: "Not scoped in Aug post",
    newNote: "Since early 2025",
    color: "#f59e0b",
  },
  {
    id: "ai-stock-share",
    label: "AI-tagged share of US IG stock",
    prior: null,
    neu: 15,
    unit: "pct",
    priorNote: "Flow share only in Aug",
    newNote: "Outstanding / stock lens",
    color: "#06b6d4",
  },
  {
    id: "big5-index",
    label: "Big-5 path in major IG index",
    prior: null,
    neu: 5,
    unit: "pct",
    priorNote: "Not highlighted Aug",
    newNote: "Could exceed by YE2026",
    color: "#10b981",
  },
  {
    id: "ai-debt-ytd",
    label: "AI-related debt YTD",
    prior: 489,
    neu: 489,
    unit: "bn",
    priorNote: "Aug GS mid-year tally",
    newNote: "Carried — perimeter held",
    color: "#6366f1",
  },
];

export type RatingGapRow = {
  issuer: string;
  officialRating: string;
  marketImplied: string;
  maturity: string;
  officialScore: number;
  marketScore: number;
  color: string;
  note: string;
};

/**
 * Official rating vs market-implied pricing (long-dated paper).
 * Scores are ordinal for dumbbell viz only (higher = stronger credit).
 * AA≈5, A≈4, BBB≈3.
 */
export const RATING_GAPS: RatingGapRow[] = [
  {
    issuer: "Meta",
    officialRating: "AA",
    marketImplied: "BBB-equiv",
    maturity: "2036",
    officialScore: 5,
    marketScore: 3,
    color: "#0668E1",
    note: "Long-dated Meta paper prices like triple-B despite AA",
  },
  {
    issuer: "Amazon",
    officialRating: "AA",
    marketImplied: "A-equiv",
    maturity: "2036",
    officialScore: 5,
    marketScore: 4,
    color: "#ff9900",
    note: "Long-dated Amazon paper prices like single-A despite AA",
  },
];

export type FundingChannel = {
  id: string;
  label: string;
  amountBn: number;
  color: string;
  note: string;
  confidence: Confidence;
  channel: "public" | "private" | "hybrid";
};

/** Where Q3 funding capacity actually clears */
export const FUNDING_CHANNELS: FundingChannel[] = [
  {
    id: "ai-ig-hy",
    label: "AI-related public debt (YTD)",
    amountBn: 489,
    color: "#8b5cf6",
    note: "GS mid-year perimeter — HS ~40% + ecosystem",
    confidence: "estimated",
    channel: "public",
  },
  {
    id: "private-dc",
    label: "Private data-centre deals",
    amountBn: 200,
    color: "#f59e0b",
    note: "Since early 2025 — overflow outside IG calendar",
    confidence: "estimated",
    channel: "private",
  },
  {
    id: "project-27",
    label: "Project / DC finance (2027 path)",
    amountBn: 300,
    color: "#10b981",
    note: "Above and beyond direct hyperscaler IG",
    confidence: "forecast",
    channel: "hybrid",
  },
  {
    id: "jpm-absorb",
    label: "HG absorb capacity (next 12m)",
    amountBn: 300,
    color: "#06b6d4",
    note: "JPM estimate for AI / data-centre bonds",
    confidence: "estimated",
    channel: "public",
  },
];

export type OverflowPoint = {
  id: string;
  label: string;
  capacityBn: number;
  horizonYears: number;
  color: string;
  note: string;
};

export const OVERFLOW_SCATTER: OverflowPoint[] = [
  {
    id: "private-dc",
    label: "Private DC (since '25)",
    capacityBn: 200,
    horizonYears: 1.5,
    color: "#f59e0b",
    note: "Completed / announced private transactions",
  },
  {
    id: "jpm-1y",
    label: "JPM HG absorb (1y)",
    capacityBn: 300,
    horizonYears: 1,
    color: "#06b6d4",
    note: "High-grade absorption case for AI/DC bonds",
  },
  {
    id: "project-27",
    label: "Project finance 2027",
    capacityBn: 300,
    horizonYears: 1.5,
    color: "#10b981",
    note: "GS path above direct HS IG",
  },
  {
    id: "jpm-5y",
    label: "JPM funding need (5y)",
    capacityBn: 1500,
    horizonYears: 5,
    color: "#ef4444",
    note: "~$1.5T total funding need over five years",
  },
  {
    id: "bank-cap",
    label: "Bank-comparable IG room",
    capacityBn: 510,
    horizonYears: 3,
    color: "#6366f1",
    note: "Aug case study — HS approaching top-bank index weights",
  },
];

export type EtfFlowRow = {
  ticker: string;
  name: string;
  flows2025Bn: number;
  role: string;
  color: string;
};

/** Equity/ETF sleeve — carried as public-market sentiment capacity */
export const ETF_CHANNELS: EtfFlowRow[] = [
  { ticker: "THEMATIC", name: "All US thematic ETFs", flows2025Bn: 43.5, role: "sector", color: "#6366f1" },
  { ticker: "QQQ", name: "Invesco QQQ", flows2025Bn: 21.7, role: "broad_proxy", color: "#06b6d4" },
  { ticker: "SOXX", name: "iShares Semiconductor", flows2025Bn: 8.5, role: "semiconductor", color: "#10b981" },
  { ticker: "BOTZ+AIQ", name: "Robotics / AI thematics", flows2025Bn: 2.0, role: "thematic", color: "#f59e0b" },
];

export function fmtBn(n: number): string {
  if (Math.abs(n) >= 100) return `$${n.toFixed(0)}B`;
  return `$${n.toFixed(1)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtTn(n: number): string {
  return `$${n.toFixed(1)}T`;
}

export function vintageDeltaBars() {
  return VINTAGE_METRICS.filter((m) => m.prior !== null && m.prior !== m.neu).map((m) => ({
    id: m.id,
    label: m.label,
    delta: m.neu - (m.prior as number),
    unit: m.unit,
    fill: m.color,
    prior: m.prior as number,
    neu: m.neu,
  }));
}

export function newMetricBars() {
  return VINTAGE_METRICS.filter((m) => m.prior === null).map((m) => ({
    id: m.id,
    label: m.label,
    value: m.neu,
    unit: m.unit,
    fill: m.color,
    note: m.newNote,
  }));
}

export function ratingDumbbell() {
  return RATING_GAPS.map((r) => ({
    issuer: r.issuer,
    official: r.officialScore,
    market: r.marketScore,
    officialLabel: r.officialRating,
    marketLabel: r.marketImplied,
    fill: r.color,
    note: r.note,
    maturity: r.maturity,
  }));
}

export function fundingChannelBars(filter: "all" | "public" | "private" | "hybrid" = "all") {
  return FUNDING_CHANNELS.filter((c) => filter === "all" || c.channel === filter).map((c) => ({
    id: c.id,
    label: c.label,
    amount: c.amountBn,
    fill: c.color,
    note: c.note,
    channel: c.channel,
  }));
}

export function overflowScatter() {
  return OVERFLOW_SCATTER.map((o) => ({
    name: o.label,
    capacity: o.capacityBn,
    horizon: o.horizonYears,
    fill: o.color,
    note: o.note,
  }));
}
