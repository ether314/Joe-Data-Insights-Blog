/**
 * AI financing — August 2026 (202608) vintage update.
 *
 * Core question: What changed vs the Q3 2026 theme update
 * (ai-financing-update-2026q3)? How is the build-out funded once we
 * leave the *flow* perimeter ($489B YTD; IG share 23%) and map the
 * *stock* of credit channels that actually clear PP&E?
 *
 * Prior vintage (Q3 2026): AI-related debt ~$489B YTD; HS ~40%;
 * AI ~23% of USD IG / ~20% HY; private DC deals ~$200B since early 2025;
 * AI-tagged IG stock ~15%; Big-5 path >5% index weight.
 *
 * Aug 202608 vintage (Chicago Booth / Hepp stock map, Aug 7 2026):
 * 1. Funded channel stock: HS senior unsecured ~$520B; project/DC ~$250B;
 *    infra/ABS ~$60B; private credit ~$200B; GPU-secured ~$35B → ~$1.07T.
 * 2. Off-balance overhang: ~$675B signed but not-yet-commenced leases (S&P).
 * 3. Stress: illustrative equity loss $10–14T → credit loss ~$60–140B;
 *    first-loss mainly outside regulated banks.
 * 4. Structure: Anthropic/Apollo–Blackstone ~$35B GPU SPV (Jun 2026).
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "forecast";

export const SOURCE_NOTE =
  "August 202608 vintage delta: Q3 2026 flow print (AI debt ~$489B YTD; USD IG theme share ~23%; private DC ~$200B) vs Chicago Booth Review / Stefan Hepp stock map (Aug 7, 2026) — HS senior unsecured ~$520B; project/DC ~$250B; ABS ~$60B; private credit ~$200B; GPU-secured ~$35B; S&P ~$675B uncommenced leases; stress credit loss ~$60–140B.";

export const SOURCES = [
  {
    label: "Chicago Booth Review — How Worried Should We Be About AI Debt? (Aug 7, 2026)",
    url: "https://www.chicagobooth.edu/review/2026/august/how-worried-should-we-be-about-ai-debt",
  },
  {
    label: "Stefan Hepp — The AI Infrastructure Debt Complex (working paper, Jul 2026)",
    url: "https://www.chicagobooth.edu/review/2026/august/how-worried-should-we-be-about-ai-debt",
  },
  {
    label: "Goldman Sachs Exchanges — How AI Debt Is Reshaping Credit Markets (Aug 2026)",
    url: "https://www.goldmansachs.com/insights/goldman-sachs-exchanges/how-ai-debt-is-reshaping-the-credit-market",
  },
  {
    label: "Prior Q3 theme update — IG share 18%→23%",
    url: "/blog/ai-financing-update-2026q3",
  },
  {
    label: "Prior mid-year update — $489B AI debt perimeter",
    url: "/blog/ai-financing-update-2026",
  },
] as const;

/** Snapshot as published in ai-financing-update-2026q3 */
export const PRIOR_VINTAGE = {
  label: "Q3 2026 update",
  aiRelatedDebtYtdBn: 489,
  hyperscalerIgYtdBn: 194,
  hyperscalerShareOfAiDebtPct: 40,
  hyperscalerIgFullYearPathBn: 250,
  debtShareOfCapexPct: 33,
  aiShareOfUsIgSupplyPct: 23,
  aiShareOfUsHySupplyPct: 20,
  privateDcTransactionsBn: 200,
  aiTaggedStockShareOfIgPct: 15,
  big5IgIndexWeightPathPct: 5,
  projectFinance2027Bn: 300,
  hsSeniorUnsecuredStockBn: null as number | null,
  projectDcFinanceStockBn: null as number | null,
  infraAbsStockBn: null as number | null,
  privateCreditStockBn: null as number | null,
  gpuSecuredBn: null as number | null,
  uncommencedLeasesBn: null as number | null,
  stressCreditLossLowBn: null as number | null,
  stressCreditLossHighBn: null as number | null,
  confidence: "estimated" as Confidence,
};

/** Newest Aug 202608 Booth / Hepp stock map */
export const NEW_VINTAGE = {
  label: "Aug 202608 stock map",
  aiRelatedDebtYtdBn: 489,
  hyperscalerIgYtdBn: 194,
  hyperscalerShareOfAiDebtPct: 40,
  hyperscalerIgFullYearPathBn: 250,
  debtShareOfCapexPct: 33,
  aiShareOfUsIgSupplyPct: 23,
  aiShareOfUsHySupplyPct: 20,
  privateDcTransactionsBn: 200,
  aiTaggedStockShareOfIgPct: 15,
  big5IgIndexWeightPathPct: 5,
  projectFinance2027Bn: 300,
  hsSeniorUnsecuredStockBn: 520,
  projectDcFinanceStockBn: 250,
  infraAbsStockBn: 60,
  privateCreditStockBn: 200,
  gpuSecuredBn: 35,
  uncommencedLeasesBn: 675,
  stressCreditLossLowBn: 60,
  stressCreditLossHighBn: 140,
  anthropicSpvBn: 35,
  hsBondIssuance2025Bn: 120,
  hsBondIssuanceAvg2020_24Bn: 28,
  equityStressLowTn: 10,
  equityStressHighTn: 14,
  confidence: "estimated" as Confidence,
};

export const HEADLINE = {
  fundedStockTotalBn: 1065, // 520+250+60+200+35
  uncommencedLeasesBn: 675,
  stressLossLowBn: 60,
  stressLossHighBn: 140,
  priorFlowPerimeterBn: 489,
  stockVsFlowMultiple: 2.2, // 1065/489
  hsSeniorStockBn: 520,
  projectDcStockBn: 250,
  gpuSecuredBn: 35,
  anthropicSpvBn: 35,
  aiIgSharePct: 23,
  priorLabel: "Q3 2026 flow print",
  newLabel: "Aug 202608 stock map",
};

export type ChannelStock = {
  id: string;
  label: string;
  amountBn: number;
  color: string;
  note: string;
  confidence: Confidence;
  layer: "funded" | "overhang" | "stress";
  seniority: "senior" | "hybrid" | "junior" | "off_balance";
};

/** Where the Aug stock map says financed capacity actually sits */
export const CHANNEL_STOCK: ChannelStock[] = [
  {
    id: "hs-ig",
    label: "HS senior unsecured (IG)",
    amountBn: 520,
    color: "#8b5cf6",
    note: "Held by funds, insurers, pensions — lowest-risk sleeve",
    confidence: "estimated",
    layer: "funded",
    seniority: "senior",
  },
  {
    id: "project-dc",
    label: "Project / data-centre finance",
    amountBn: 250,
    color: "#10b981",
    note: "Facility-tied; shorter maturities; tenant cash flows",
    confidence: "estimated",
    layer: "funded",
    seniority: "hybrid",
  },
  {
    id: "abs",
    label: "Infrastructure / ABS",
    amountBn: 60,
    color: "#06b6d4",
    note: "Structured / ABS sleeve of the map",
    confidence: "estimated",
    layer: "funded",
    seniority: "senior",
  },
  {
    id: "private-credit",
    label: "Private credit (est.)",
    amountBn: 200,
    color: "#f59e0b",
    note: "Author estimate — hard to observe; overlaps Q3 DC deals",
    confidence: "estimated",
    layer: "funded",
    seniority: "junior",
  },
  {
    id: "gpu-secured",
    label: "GPU / asset-secured",
    amountBn: 35,
    color: "#ef4444",
    note: "Specialist compute; chips as collateral; fast depreciation",
    confidence: "estimated",
    layer: "funded",
    seniority: "junior",
  },
  {
    id: "leases",
    label: "Uncommenced leases (S&P)",
    amountBn: 675,
    color: "#6366f1",
    note: "Signed but not commenced — excluded from funded totals",
    confidence: "disclosed",
    layer: "overhang",
    seniority: "off_balance",
  },
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

/** Metrics that moved (or newly appeared) between Q3 and Aug stock map */
export const VINTAGE_METRICS: VintageMetric[] = [
  {
    id: "funded-stock",
    label: "Funded AI-infra credit stock",
    prior: null,
    neu: 1065,
    unit: "bn",
    priorNote: "Flow lens only in Q3",
    newNote: "Five-channel Booth map sum",
    color: "#8b5cf6",
  },
  {
    id: "hs-stock",
    label: "HS senior unsecured stock",
    prior: null,
    neu: 520,
    unit: "bn",
    priorNote: "Q3 tracked YTD flow ($194B)",
    newNote: "Outstanding held by institutions",
    color: "#a78bfa",
  },
  {
    id: "project-stock",
    label: "Project / DC finance stock",
    prior: null,
    neu: 250,
    unit: "bn",
    priorNote: "Q3 had 2027 path ~$300B",
    newNote: "Outstanding facility finance",
    color: "#10b981",
  },
  {
    id: "leases",
    label: "Uncommenced lease overhang",
    prior: null,
    neu: 675,
    unit: "bn",
    priorNote: "Not in Q3 dashboard",
    newNote: "S&P signed-but-not-commenced",
    color: "#6366f1",
  },
  {
    id: "gpu",
    label: "GPU-secured specialist debt",
    prior: null,
    neu: 35,
    unit: "bn",
    priorNote: "Not scoped Q3",
    newNote: "Chips as collateral",
    color: "#ef4444",
  },
  {
    id: "stress-high",
    label: "Stress credit-loss high",
    prior: null,
    neu: 140,
    unit: "bn",
    priorNote: "No loss band in Q3",
    newNote: "Booth severe re-rating case",
    color: "#f97316",
  },
  {
    id: "flow-perimeter",
    label: "AI-related debt YTD (flow)",
    prior: 489,
    neu: 489,
    unit: "bn",
    priorNote: "Q3 / Aug GS mid-year",
    newNote: "Carried — perimeter held",
    color: "#64748b",
  },
  {
    id: "ig-share",
    label: "AI share of USD IG supply",
    prior: 23,
    neu: 23,
    unit: "pct",
    priorNote: "Q3 desk refresh",
    newNote: "Carried — stock map is additive",
    color: "#94a3b8",
  },
];

export type StressPoint = {
  id: string;
  label: string;
  equityLossTn: number;
  creditLossBn: number;
  color: string;
  note: string;
};

/** Equity shock → credit loss mapping (illustrative) */
export const STRESS_SCATTER: StressPoint[] = [
  {
    id: "low",
    label: "Mild re-rating",
    equityLossTn: 10,
    creditLossBn: 60,
    color: "#fbbf24",
    note: "Lower end of Booth band",
  },
  {
    id: "mid",
    label: "Mid case",
    equityLossTn: 12,
    creditLossBn: 100,
    color: "#f97316",
    note: "Interpolated mid of published band",
  },
  {
    id: "high",
    label: "Severe re-rating",
    equityLossTn: 14,
    creditLossBn: 140,
    color: "#ef4444",
    note: "Upper end — first-loss outside banks",
  },
];

export type IssuancePathRow = {
  period: string;
  hsIssuanceBn: number;
  note: string;
  confidence: Confidence;
};

/** Hyperscaler bond issuance path (Booth frame) */
export const HS_ISSUANCE_PATH: IssuancePathRow[] = [
  {
    period: "2020–24 avg",
    hsIssuanceBn: 28,
    note: "Pre-AI-scale annual average",
    confidence: "estimated",
  },
  {
    period: "2025",
    hsIssuanceBn: 120,
    note: "~4× the prior five-year average",
    confidence: "estimated",
  },
  {
    period: "H1'26",
    hsIssuanceBn: 194,
    note: "Already above full-year 2025 (GS/LSEG)",
    confidence: "disclosed",
  },
  {
    period: "FY'26 path",
    hsIssuanceBn: 250,
    note: "GS ~33% of capex path",
    confidence: "forecast",
  },
];

export type StructureDeal = {
  id: string;
  label: string;
  amountBn: number;
  structure: string;
  color: string;
  note: string;
};

/** Named structures that illustrate off-balance / collateralised funding */
export const STRUCTURE_DEALS: StructureDeal[] = [
  {
    id: "anthropic-spv",
    label: "Anthropic compute SPV",
    amountBn: 35,
    structure: "Apollo–Blackstone SPV + Broadcom residual",
    color: "#8b5cf6",
    note: "Debt buys chips; Anthropic leases; Broadcom covers shortfall",
  },
  {
    id: "gpu-book",
    label: "GPU-secured specialists",
    amountBn: 35,
    structure: "Asset-backed compute loans",
    color: "#ef4444",
    note: "Chips pledged; 2–3 year tech cycle risk",
  },
  {
    id: "nvidia-coreweave",
    label: "Nvidia–CoreWeave residual",
    amountBn: 6.3,
    structure: "Vendor capacity takeout",
    color: "#10b981",
    note: "Sep 2025 — supplier underwrites own hardware residual",
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

export type LossBearer = {
  id: string;
  label: string;
  sharePct: number;
  color: string;
  note: string;
};

/** Where first-loss sits under Booth stress (directional shares for viz) */
export const LOSS_BEARERS: LossBearer[] = [
  {
    id: "pc-lps",
    label: "Private-credit LPs",
    sharePct: 45,
    color: "#f59e0b",
    note: "Pensions, endowments in dedicated AI infra credit",
  },
  {
    id: "pe-insurers",
    label: "PE-owned insurance platforms",
    sharePct: 25,
    color: "#8b5cf6",
    note: "Junior / hybrid sleeves",
  },
  {
    id: "bdc",
    label: "BDC / retail vehicles",
    sharePct: 15,
    color: "#ef4444",
    note: "Smaller but visible sleeve",
  },
  {
    id: "senior-holders",
    label: "Senior ABS / banks (MTM)",
    sharePct: 15,
    color: "#06b6d4",
    note: "Lower realized loss; mark-to-market still bites",
  },
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

export function fundedChannelBars(filter: "all" | "funded" | "overhang" = "all") {
  return CHANNEL_STOCK.filter((c) => filter === "all" || c.layer === filter).map((c) => ({
    id: c.id,
    label: c.label,
    amount: c.amountBn,
    fill: c.color,
    note: c.note,
    layer: c.layer,
    seniority: c.seniority,
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

export function carriedMetricBars() {
  return VINTAGE_METRICS.filter((m) => m.prior !== null).map((m) => ({
    id: m.id,
    label: m.label,
    prior: m.prior as number,
    neu: m.neu,
    unit: m.unit,
    fill: m.color,
  }));
}

export function stressScatter() {
  return STRESS_SCATTER.map((s) => ({
    name: s.label,
    equity: s.equityLossTn,
    credit: s.creditLossBn,
    fill: s.color,
    note: s.note,
  }));
}

export function issuancePathBars() {
  return HS_ISSUANCE_PATH.map((r) => ({
    period: r.period,
    amount: r.hsIssuanceBn,
    note: r.note,
  }));
}

export function structureBars() {
  return STRUCTURE_DEALS.map((d) => ({
    id: d.id,
    label: d.label,
    amount: d.amountBn,
    fill: d.color,
    structure: d.structure,
    note: d.note,
  }));
}

export function lossBearerPie() {
  return LOSS_BEARERS.map((b) => ({
    id: b.id,
    name: b.label,
    value: b.sharePct,
    fill: b.color,
    note: b.note,
  }));
}

export function flowVsStockCompare() {
  return [
    {
      id: "flow",
      label: "Q3 flow perimeter",
      amount: HEADLINE.priorFlowPerimeterBn,
      fill: "#94a3b8",
      note: "AI-related debt YTD (GS mid-year)",
    },
    {
      id: "stock",
      label: "Aug funded stock",
      amount: HEADLINE.fundedStockTotalBn,
      fill: "#8b5cf6",
      note: "Five-channel Booth map",
    },
    {
      id: "leases",
      label: "Lease overhang",
      amount: HEADLINE.uncommencedLeasesBn,
      fill: "#6366f1",
      note: "Signed, not commenced (S&P)",
    },
  ];
}
