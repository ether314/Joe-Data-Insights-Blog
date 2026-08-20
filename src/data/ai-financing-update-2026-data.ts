/**
 * AI financing vintage update (Aug 2026).
 * Compares the Jul 2026 research print (hyperscaler IG spine) against the
 * newest Goldman Sachs credit vintage: broader AI-related debt (~$489B),
 * US IG supply share (~18%), duration concentration, FX mix, and overflow
 * channels (project finance / private markets).
 */

export const SOURCE_NOTE =
  "Vintage delta: Jul 2026 research (hyperscaler IG YTD ~$194B / FY path ~$250B) vs Aug 2026 GS credit refresh (AI-related debt ~$489B YTD mid-year; hyperscalers ~40%; AI ~18% of US IG supply). Spreads and FX mix from GS Exchanges / desk commentary and Reuters/LSEG deal context. Confidence tags separate disclosed tallies from research estimates.";

export type Confidence = "disclosed" | "estimated" | "forecast";

/** Snapshot as published in ai-financing-research-2026 (Jul 2026) */
export const PRIOR_VINTAGE = {
  label: "Jul 2026 research",
  hyperscalerIgYtdBn: 194,
  hyperscalerIgFullYearPathBn: 250,
  debtShareOfCapexPct: 33,
  debtShare2025Pct: 26,
  capex2026Bn: 750,
  ocf2026Bn: 778,
  aiRelatedDebtYtdBn: null as number | null,
  aiShareOfUsIgSupplyPct: null as number | null,
  nonUsdShareOfHyperscalerPct: 14,
  confidence: "disclosed" as Confidence,
};

/** Newest official / desk vintage as of Aug 2026 */
export const NEW_VINTAGE = {
  label: "Aug 2026 update",
  hyperscalerIgYtdBn: 194,
  hyperscalerIgFullYearPathBn: 250,
  debtShareOfCapexPct: 33,
  debtShare2025Pct: 27,
  capex2026Bn: 750,
  ocf2026Bn: 778,
  aiRelatedDebtYtdBn: 489,
  hyperscalerShareOfAiDebtPct: 40,
  ecosystemDebtBn: 295, // 489 − ~194
  aiShareOfUsIgSupplyPct: 18,
  aiShareOfUsIgSupply2025Pct: 7,
  aiShareOfUsIgSupply2024Pct: 1,
  nonUsdShareOfHyperscalerPct: 33,
  longEndAiShareOf15yPlusPct: 40,
  projectFinance2027Bn: 300,
  privateMarketsDryPowderTn: 4.5,
  bankComparableIgCapacityBn: 510,
  confidence: "estimated" as Confidence,
};

export const HEADLINE = {
  aiRelatedDebtYtdBn: 489,
  hyperscalerSharePct: 40,
  hyperscalerYtdBn: 194,
  ecosystemBn: 295,
  aiIgSupplySharePct: 18,
  aiIgSupplySharePriorPct: 7,
  aiIgSupplyShareDeltaPp: 11,
  nonUsdSharePct: 33,
  nonUsdSharePriorPct: 14,
  nonUsdDeltaPp: 19,
  longEndSharePct: 40,
  projectFinance2027Bn: 300,
  aiLeaderSpreadTightBps: 74,
  aiLeaderSpreadWideBps: 148,
};

export type SupplyShareYear = {
  year: number;
  aiShareOfUsIgPct: number;
  label: string;
  confidence: Confidence;
};

/** AI-related share of US IG gross supply (GS desk / Exchanges) */
export const AI_IG_SUPPLY_SHARE: SupplyShareYear[] = [
  { year: 2024, aiShareOfUsIgPct: 1, label: "~$10B AI-related IG", confidence: "estimated" },
  { year: 2025, aiShareOfUsIgPct: 7, label: "~$108B hyperscaler + AI stack", confidence: "disclosed" },
  { year: 2026, aiShareOfUsIgPct: 18, label: "YTD mid-year run-rate", confidence: "estimated" },
];

export type DebtStackSlice = {
  id: string;
  label: string;
  amountBn: number;
  color: string;
  note: string;
  confidence: Confidence;
};

/** Mid-2026 AI-related debt stack — new vintage expansion beyond hyperscalers */
export const AI_DEBT_STACK: DebtStackSlice[] = [
  {
    id: "hyperscalers",
    label: "Hyperscaler IG (5 names)",
    amountBn: 194,
    color: "#10b981",
    note: "Amazon, Alphabet, Meta, Microsoft, Oracle — Jul YTD print carried forward",
    confidence: "disclosed",
  },
  {
    id: "ecosystem",
    label: "Broader AI ecosystem debt",
    amountBn: 295,
    color: "#6366f1",
    note: "Utilities, industrials, data-center JVs, HY / loans tied to the build",
    confidence: "estimated",
  },
];

export type VintageMetric = {
  id: string;
  label: string;
  prior: number | null;
  neu: number;
  unit: "bn" | "pct" | "pp";
  priorNote: string;
  newNote: string;
  color: string;
};

/** Metrics that actually moved (or newly appeared) between vintages */
export const VINTAGE_METRICS: VintageMetric[] = [
  {
    id: "ai-debt-ytd",
    label: "AI-related debt YTD",
    prior: null,
    neu: 489,
    unit: "bn",
    priorNote: "Not scoped in Jul post (hyperscaler-only lens)",
    newNote: "GS mid-2026 tally (~$489B)",
    color: "#06b6d4",
  },
  {
    id: "ig-supply-share",
    label: "AI share of US IG supply",
    prior: 7,
    neu: 18,
    unit: "pct",
    priorNote: "2025 calendar share (desk)",
    newNote: "2026 YTD share",
    color: "#8b5cf6",
  },
  {
    id: "non-usd",
    label: "Non-USD hyperscaler supply",
    prior: 14,
    neu: 33,
    unit: "pct",
    priorNote: "2025 FX mix",
    newNote: "2026 YTD FX mix",
    color: "#f59e0b",
  },
  {
    id: "hyperscaler-ytd",
    label: "Hyperscaler IG YTD",
    prior: 194,
    neu: 194,
    unit: "bn",
    priorNote: "Jul 7 LSEG/Reuters print",
    newNote: "Unchanged — still ~40% of AI debt stack",
    color: "#10b981",
  },
  {
    id: "fy-path",
    label: "Hyperscaler FY26 IG path",
    prior: 250,
    neu: 250,
    unit: "bn",
    priorNote: "GS full-year forecast",
    newNote: "Path held; debt share still ~33%",
    color: "#0ea5e9",
  },
];

export type DurationRank = {
  issuer: string;
  rank2025: number;
  rank2026: number;
  color: string;
};

/** Duration weight rank in US IG index (GS desk examples) */
export const DURATION_RANKS: DurationRank[] = [
  { issuer: "Amazon", rank2025: 20, rank2026: 1, color: "#ff9900" },
  { issuer: "Alphabet", rank2025: 86, rank2026: 18, color: "#34a853" },
];

export type SpreadPoint = {
  series: string;
  tightBps: number;
  wideBps: number;
  color: string;
  note: string;
};

export const SPREAD_PATH: SpreadPoint[] = [
  {
    series: "GS AI leader basket (12m)",
    tightBps: 74,
    wideBps: 148,
    color: "#ef4444",
    note: "Desk basket — nearly 2× from tights",
  },
  {
    series: "New-issue 2–4y median",
    tightBps: 30,
    wideBps: 40,
    color: "#06b6d4",
    note: "Amazon / Alphabet / Meta / Oracle medians (Jul Reuters)",
  },
  {
    series: "New-issue 5–7y median",
    tightBps: 50,
    wideBps: 60,
    color: "#8b5cf6",
    note: "Same cohort medians",
  },
  {
    series: "New-issue 20y+ median",
    tightBps: 108.5,
    wideBps: 118,
    color: "#f59e0b",
    note: "Long-end still the sticky bucket",
  },
];

export type OverflowChannel = {
  id: string;
  label: string;
  capacityLabel: string;
  sortValue: number;
  color: string;
  note: string;
};

/** Where supply goes when US IG saturates */
export const OVERFLOW_CHANNELS: OverflowChannel[] = [
  {
    id: "private",
    label: "Private markets dry powder",
    capacityLabel: "$4.5T",
    sortValue: 4500,
    color: "#6366f1",
    note: "Private credit, infra, RE, PE — GS global aggregate",
  },
  {
    id: "bank-cap",
    label: "Hyperscaler→bank IG capacity",
    capacityLabel: "~$510B",
    sortValue: 510,
    color: "#10b981",
    note: "Incremental index-eligible room if names match top bank weights",
  },
  {
    id: "project",
    label: "Project / DC finance (2027)",
    capacityLabel: "~$300B",
    sortValue: 300,
    color: "#f59e0b",
    note: "Above and beyond direct hyperscaler IG",
  },
  {
    id: "fx",
    label: "Non-USD bond markets",
    capacityLabel: "33% of HS supply",
    sortValue: 160,
    color: "#06b6d4",
    note: "CAD, GBP, CHF, EUR, AUD, JPY — already active",
  },
];

export type EtfFlowRow = {
  ticker: string;
  name: string;
  flows2025Bn: number;
  role: string;
  color: string;
};

/** Equity/ETF side carried forward — public-market capacity channel */
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

export function supplyShareSeries() {
  return AI_IG_SUPPLY_SHARE.map((r) => ({
    year: String(r.year),
    share: r.aiShareOfUsIgPct,
    label: r.label,
  }));
}

export function debtStackPie() {
  return AI_DEBT_STACK.map((s) => ({
    name: s.label,
    value: s.amountBn,
    fill: s.color,
    note: s.note,
  }));
}

export function spreadDumbbell() {
  return SPREAD_PATH.map((s) => ({
    series: s.series,
    tight: s.tightBps,
    wide: s.wideBps,
    fill: s.color,
    note: s.note,
  }));
}

export function durationRankChange() {
  return DURATION_RANKS.map((d) => ({
    issuer: d.issuer,
    prior: d.rank2025,
    neu: d.rank2026,
    improvement: d.rank2025 - d.rank2026,
    fill: d.color,
  }));
}

export const SOURCES = [
  {
    label: "Goldman Sachs Exchanges — How AI Debt Is Reshaping Credit Markets (Aug 2026)",
    url: "https://www.goldmansachs.com/insights/goldman-sachs-exchanges/how-ai-debt-is-reshaping-the-credit-market",
  },
  {
    label: "The Global Treasurer — $489B AI debt wave (Aug 18, 2026)",
    url: "https://www.theglobaltreasurer.com/2026/08/18/what-the-489b-ai-debt-wave-means-for-treasury-risk/",
  },
  {
    label: "CNA / Reuters — hyperscaler debt binge, spreads, YTD issuance (Jul 2026)",
    url: "https://www.channelnewsasia.com/business/hyperscaler-debt-binge-pushes-yields-up-investor-demand-cools-6286196",
  },
  {
    label: "Prior theme baseline — AI financing research 2026",
    url: "/blog/ai-financing-research-2026",
  },
] as const;
