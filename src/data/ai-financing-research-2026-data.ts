/**
 * AI financing research 2026 — how the hyperscaler build-out is funded
 * across investment-grade bonds, broader credit channels, and public equity / ETF flows.
 *
 * Primary: Goldman Sachs credit strategy (Amanda Lynam et al., mid-2026), FactSet
 * hyperscaler external-financing note (Jul 2026), Reuters/LSEG deal tallies via CNA,
 * BofA / MUFG deal context, FactSet / ETF.com thematic flow summaries.
 */

export const SOURCE_NOTE =
  "Hyperscaler cohort = Amazon, Alphabet, Meta, Microsoft, Oracle unless noted. Bond totals are global IG-rated corporate issuance (Goldman) or disclosed USD/EUR deals (Reuters/LSEG). Capex is company gross PP&E guidance / GS IR hyperscaler scope — not all-in AI infrastructure. ETF flows are net creations, not AUM. Confidence tags distinguish disclosed deal/flow prints from research forecasts.";

export type Confidence = "disclosed" | "estimated" | "forecast";

export type FinancingYear = {
  year: number;
  igBondIssuanceBn: number;
  capexBn: number;
  debtShareOfCapexPct: number;
  ocfBn: number | null;
  label: string;
  confidence: Confidence;
};

/** Goldman credit strategy path + FactSet LTM debt-share bridge */
export const FINANCING_PATH: FinancingYear[] = [
  {
    year: 2024,
    igBondIssuanceBn: 45,
    capexBn: 280,
    debtShareOfCapexPct: 9,
    ocfBn: 420,
    label: "Pre-wave (FactSet incremental debt ~9% of capex)",
    confidence: "estimated",
  },
  {
    year: 2025,
    igBondIssuanceBn: 108,
    capexBn: 405,
    debtShareOfCapexPct: 26,
    ocfBn: 520,
    label: "First AI bond wave",
    confidence: "disclosed",
  },
  {
    year: 2026,
    igBondIssuanceBn: 250,
    capexBn: 750,
    debtShareOfCapexPct: 33,
    ocfBn: 778,
    label: "GS full-year forecast (YTD ~$194B by early Jul)",
    confidence: "forecast",
  },
  {
    year: 2027,
    igBondIssuanceBn: 400,
    capexBn: 1140,
    debtShareOfCapexPct: 35,
    ocfBn: null,
    label: "GS base — debt still ~⅓ of capex",
    confidence: "forecast",
  },
];

export type FundingChannel = {
  id: string;
  label: string;
  share2025Pct: number;
  share2026Pct: number;
  share2027Pct: number;
  color: string;
  note: string;
};

/** Approximate funding mix of hyperscaler AI infrastructure spend (illustrative research synthesis) */
export const FUNDING_CHANNELS: FundingChannel[] = [
  {
    id: "ocf",
    label: "Operating cash flow",
    share2025Pct: 62,
    share2026Pct: 52,
    share2027Pct: 48,
    color: "#0ea5e9",
    note: "Still the majority — but no longer covers the full stack after buybacks",
  },
  {
    id: "ig-bonds",
    label: "IG corporate bonds",
    share2025Pct: 26,
    share2026Pct: 33,
    share2027Pct: 35,
    color: "#10b981",
    note: "Goldman debt-funded share of capex",
  },
  {
    id: "equity",
    label: "Equity issuance",
    share2025Pct: 2,
    share2026Pct: 8,
    share2027Pct: 7,
    color: "#8b5cf6",
    note: "Alphabet ~$85B June 2026 raise; Oracle equity slice of FY27 plan",
  },
  {
    id: "structured",
    label: "Leases / ABS / project / private credit",
    share2025Pct: 10,
    share2026Pct: 7,
    share2027Pct: 10,
    color: "#f59e0b",
    note: "Growing off-index channels as IG supply saturates",
  },
];

export type MajorDeal = {
  issuer: string;
  month: string;
  amountBn: number;
  currency: "USD" | "EUR";
  type: "IG bond" | "Equity";
  confidence: Confidence;
};

export const MAJOR_DEALS: MajorDeal[] = [
  { issuer: "Meta", month: "Oct 2025", amountBn: 30, currency: "USD", type: "IG bond", confidence: "disclosed" },
  { issuer: "Oracle", month: "Sep 2025", amountBn: 18, currency: "USD", type: "IG bond", confidence: "disclosed" },
  { issuer: "Alphabet", month: "Nov 2025", amountBn: 17.5, currency: "USD", type: "IG bond", confidence: "disclosed" },
  { issuer: "Amazon", month: "Nov 2025", amountBn: 15, currency: "USD", type: "IG bond", confidence: "disclosed" },
  { issuer: "Amazon", month: "Mar 2026", amountBn: 37, currency: "USD", type: "IG bond", confidence: "disclosed" },
  { issuer: "Amazon", month: "Mar 2026", amountBn: 16.8, currency: "EUR", type: "IG bond", confidence: "disclosed" },
  { issuer: "Alphabet", month: "Jun 2026", amountBn: 84.75, currency: "USD", type: "Equity", confidence: "disclosed" },
  { issuer: "Amazon", month: "2026 YTD", amountBn: 25, currency: "USD", type: "IG bond", confidence: "disclosed" },
];

export type SpreadTenor = {
  tenor: string;
  spread2025Bps: number;
  spread2026Bps: number;
};

/** Median new-issue spreads for Amazon / Alphabet / Meta / Oracle (Reuters/LSEG via CNA) */
export const SPREAD_TENORS: SpreadTenor[] = [
  { tenor: "2–4y", spread2025Bps: 30, spread2026Bps: 40 },
  { tenor: "5–7y", spread2025Bps: 50, spread2026Bps: 60 },
  { tenor: "20y+", spread2025Bps: 108.5, spread2026Bps: 118 },
];

export type EtfChannel = {
  ticker: string;
  name: string;
  flows2025Bn: number;
  role: "broad_proxy" | "thematic" | "semiconductor" | "sector";
  color: string;
  confidence: Confidence;
};

/** Equity-market side of AI financing — investor flow into public AI proxies */
export const ETF_CHANNELS: EtfChannel[] = [
  {
    ticker: "THEMATIC",
    name: "All US thematic ETFs",
    flows2025Bn: 43.5,
    role: "sector",
    color: "#6366f1",
    confidence: "disclosed",
  },
  {
    ticker: "QQQ",
    name: "Invesco QQQ (Mag 7 proxy)",
    flows2025Bn: 21.7,
    role: "broad_proxy",
    color: "#06b6d4",
    confidence: "disclosed",
  },
  {
    ticker: "SOXX",
    name: "iShares Semiconductor",
    flows2025Bn: 8.5,
    role: "semiconductor",
    color: "#10b981",
    confidence: "estimated",
  },
  {
    ticker: "BOTZ+AIQ",
    name: "Robotics / AI thematics",
    flows2025Bn: 2.0,
    role: "thematic",
    color: "#f59e0b",
    confidence: "estimated",
  },
];

export const HEADLINE = {
  igBonds2026Bn: 250,
  igBonds2027Bn: 400,
  debtShare2026Pct: 33,
  debtShare2027Pct: 35,
  capex2026Bn: 750,
  ocf2026Bn: 778,
  ytd2026Bn: 194,
  fullYear2025Bn: 108,
  ytdVsFull2025Multiple: 1.79,
  techIgIndexWeightPct: 10,
  alphabetEquityBn: 84.75,
  thematicEtfFlows2025Bn: 43.5,
  bondsTradingWiderPct: 86, // 78 of 91
};

export const ISSUER_COLORS: Record<string, string> = {
  Amazon: "#ff9900",
  Alphabet: "#34a853",
  Meta: "#0668e1",
  Microsoft: "#00a4ef",
  Oracle: "#f80000",
};

export function fmtBn(n: number): string {
  if (Math.abs(n) >= 100) return `$${n.toFixed(0)}B`;
  return `$${n.toFixed(1)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fundingMixForYear(year: 2025 | 2026 | 2027) {
  const key =
    year === 2025 ? "share2025Pct" : year === 2026 ? "share2026Pct" : "share2027Pct";
  return FUNDING_CHANNELS.map((c) => ({
    id: c.id,
    name: c.label,
    value: c[key],
    fill: c.color,
    note: c.note,
  }));
}

export const SOURCES = [
  {
    label: "Goldman Sachs — hyperscaler debt share of AI capex (via Yahoo Finance)",
    url: "https://finance.yahoo.com/markets/article/big-tech-will-fund-more-than-a-third-of-its-ai-investments-with-debt-in-2027-goldman-sachs-predicts-145136150.html",
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
    label: "MUFG — Financing the AI supercycle (Dec 2025)",
    url: "https://www.mufgamericas.com/sites/default/files/document/2025-12/AI_Chart_Weekly_12_19_Financing_the_AI_Supercycle.pdf",
  },
  {
    label: "FactSet — US ETF thematic flow summary 2025",
    url: "https://insight.factset.com/u.s.-etf-summary-december-and-full-year-2025-results",
  },
] as const;
