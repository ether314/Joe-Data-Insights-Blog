/**
 * AI compute demand — concentration lens (Top-1 / Top-3 / HHI).
 *
 * Core question: How concentrated is this system at the top of the distribution?
 * (Who processes how much compute and where is it located?)
 *
 * Four perimeters:
 * 1. Chip ownership (Epoch H100e / Chip Owners — Aug 202608 carry)
 * 2. Hyperscale cloud capacity + market sites (Synergy Aug 19, 2026)
 * 3. Regional AI DC capacity by power draw (theme synthesis)
 * 4. Token throughput by brand / origin (June 2026 token series)
 *
 * Ownership ≠ usage. Token Top-1 (ByteDance) does not own chips at scale;
 * Google is Top-1 in ownership and #2 in tokens.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Concentration lens across four perimeters. Chip ownership: Epoch AI Chip Owners / hyperscaler share (Q4 2025 anchors; Aug explorer restatement for MSFT/Amazon/Meta/Oracle; Aug 202608 carry — no new Epoch period print). Hyperscale sites/capacity: Synergy Research hyperscale location rankings (19 Aug 2026) and inland site ledger (Q3 pipeline carry). Regional AI DC power-draw shares: industry-tracker synthesis carried from theme research. Token shares: June 2026 slice of major-AI-brands token series (vendor keynotes, China NDA stats, OpenRouter, revenue proxies). Shares within each perimeter sum ≈100%; cross-perimeter comparisons are illustrative, not a single unified market definition.";

export const SOURCES = [
  {
    label: "Epoch AI — Five hyperscalers own over two-thirds of global AI compute",
    url: "https://epoch.ai/data-insights/hyperscalers-control-most-compute",
  },
  {
    label: "Theme research — who owns AI compute",
    url: "/blog/ai-compute-demand-research-2026",
  },
  {
    label: "August location rankings update",
    url: "/blog/ai-compute-demand-update-202608",
  },
  {
    label: "Q3 site-count & Top-3 cloud update",
    url: "/blog/ai-compute-demand-update-2026q3",
  },
  {
    label: "Major AI brands token consumption 2022–2026",
    url: "/blog/major-ai-brands-token-consumption-2022-2026",
  },
  {
    label: "Global AI data-center build tracker",
    url: "/blog/global-ai-data-center-build-tracker",
  },
] as const;

/** Headline punchline — chip ownership Top-1 / Top-3 plus twin site & token tops */
export const HEADLINE = {
  /** Chip ownership — world H100e stock */
  ownerTop1Pct: 25.0,
  ownerTop1Label: "Google",
  ownerTop3Pct: 54.8,
  ownerTop3Labels: "Google + Microsoft + Amazon",
  ownerBig5Pct: 71.4,
  /** Within-Big-5 HHI on world shares renormalized to Big-5 perimeter */
  ownerBig5Hhi: 2421,
  equalFiveHhi: 2000,
  microsoftSharePct: 17.3,
  amazonSharePct: 12.5,
  metaSharePct: 11.3,
  oracleSharePct: 5.3,
  chinaOwnerSharePct: 5.0,
  worldH100eMillions: 20.0,

  /** Hyperscale cloud / market concentration (Synergy Aug 19) */
  cloudTop3Pct: 57,
  cloudTop3PriorPct: 58,
  cloudTop3Labels: "AWS + Azure + Google Cloud",
  marketTop20Pct: 60,
  marketTop40Pct: 79,
  dualHubPct: 17,
  dualHubLabels: "N. Virginia + Greater Beijing",
  pipelineSites: 915,
  top20UsSeats: 15,
  top20TotalSeats: 20,

  /** Regional AI DC capacity by power draw */
  regionTop1Pct: 45,
  regionTop1Label: "United States",
  regionTop3Pct: 77,
  regionTop3Labels: "US + China + Europe",

  /** Token throughput — June 2026 brand series */
  tokenTop1Pct: 29.2,
  tokenTop1Label: "ByteDance (Doubao)",
  tokenTop3Pct: 59.6,
  tokenTop3Labels: "ByteDance + Google + Alibaba",
  tokenChinaOriginPct: 61.8,
  tokenUsOriginPct: 37.7,
  tokenTotalT: 18503,
} as const;

export type PerimeterId = "ownership" | "cloud" | "region" | "tokens";

export type ScoreboardRow = {
  id: PerimeterId;
  label: string;
  top1Pct: number;
  top1Label: string;
  top3Pct: number;
  top3Labels: string;
  extraMetric: string;
  extraValue: string;
  color: string;
  confidence: Confidence;
  note: string;
};

export const SCOREBOARD: ScoreboardRow[] = [
  {
    id: "ownership",
    label: "Chip ownership (H100e)",
    top1Pct: HEADLINE.ownerTop1Pct,
    top1Label: HEADLINE.ownerTop1Label,
    top3Pct: HEADLINE.ownerTop3Pct,
    top3Labels: HEADLINE.ownerTop3Labels,
    extraMetric: "Big-5 share",
    extraValue: `${HEADLINE.ownerBig5Pct}%`,
    color: "#4285f4",
    confidence: "carried",
    note: "Epoch Q4 2025 + Aug explorer restatement; Aug 202608 carry",
  },
  {
    id: "cloud",
    label: "Hyperscale capacity (cloud)",
    top1Pct: HEADLINE.dualHubPct,
    top1Label: HEADLINE.dualHubLabels,
    top3Pct: HEADLINE.cloudTop3Pct,
    top3Labels: HEADLINE.cloudTop3Labels,
    extraMetric: "Top-20 markets",
    extraValue: `${HEADLINE.marketTop20Pct}%`,
    color: "#f59e0b",
    confidence: "disclosed",
    note: "Synergy Aug 19, 2026 — Top-3 cloud 57%; dual-hub print is N.VA+Beijing",
  },
  {
    id: "region",
    label: "AI DC capacity (region)",
    top1Pct: HEADLINE.regionTop1Pct,
    top1Label: HEADLINE.regionTop1Label,
    top3Pct: HEADLINE.regionTop3Pct,
    top3Labels: HEADLINE.regionTop3Labels,
    extraMetric: "US pipeline sites",
    extraValue: "~54% of 915",
    color: "#0ea5e9",
    confidence: "estimated",
    note: "Power-draw synthesis; US ~45% of global AI-relevant DC capacity",
  },
  {
    id: "tokens",
    label: "Token throughput (brand)",
    top1Pct: HEADLINE.tokenTop1Pct,
    top1Label: HEADLINE.tokenTop1Label,
    top3Pct: HEADLINE.tokenTop3Pct,
    top3Labels: HEADLINE.tokenTop3Labels,
    extraMetric: "China-origin share",
    extraValue: `${HEADLINE.tokenChinaOriginPct}%`,
    color: "#f43f5e",
    confidence: "estimated",
    note: "June 2026 major-brands series; ownership ≠ routed token share",
  },
];

export type OwnerId =
  | "google"
  | "microsoft"
  | "amazon"
  | "meta"
  | "oracle"
  | "china-aggregate"
  | "other-clouds"
  | "rest";

export type OwnerRow = {
  id: OwnerId;
  label: string;
  sharePct: number;
  h100eMillions: number;
  group: "hyperscaler" | "china" | "other";
  confidence: Confidence;
  color: string;
  note: string;
};

/**
 * World ownership ladder — Big-5 sum to 71.4%; residual split estimated
 * to match theme research (China 5%, other clouds 14%, rest 9.6%).
 */
export const OWNERS: OwnerRow[] = [
  {
    id: "google",
    label: "Google",
    sharePct: 25.0,
    h100eMillions: 5.0,
    group: "hyperscaler",
    confidence: "carried",
    color: "#4285f4",
    note: "Mostly custom TPUs; Top-1 ownership",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    sharePct: 17.3,
    h100eMillions: 3.45,
    group: "hyperscaler",
    confidence: "carried",
    color: "#00a4ef",
    note: "Aug explorer restatement (+2.3 pp vs Jul residual)",
  },
  {
    id: "amazon",
    label: "Amazon",
    sharePct: 12.5,
    h100eMillions: 2.5,
    group: "hyperscaler",
    confidence: "carried",
    color: "#ff9900",
    note: "Nvidia + Trainium; Anthropic partner capacity",
  },
  {
    id: "meta",
    label: "Meta",
    sharePct: 11.3,
    h100eMillions: 2.25,
    group: "hyperscaler",
    confidence: "carried",
    color: "#0668E1",
    note: "Owns for Llama / Meta AI; also rents",
  },
  {
    id: "oracle",
    label: "Oracle",
    sharePct: 5.3,
    h100eMillions: 1.05,
    group: "hyperscaler",
    confidence: "carried",
    color: "#c74634",
    note: "Stargate / OpenAI capacity partner",
  },
  {
    id: "china-aggregate",
    label: "China (all owners)",
    sharePct: 5.0,
    h100eMillions: 1.0,
    group: "china",
    confidence: "carried",
    color: "#dc2626",
    note: "Huawei-led FLOP/s; ~5% of world ownership",
  },
  {
    id: "other-clouds",
    label: "Other clouds / neoclouds",
    sharePct: 14.0,
    h100eMillions: 2.8,
    group: "other",
    confidence: "estimated",
    color: "#8b5cf6",
    note: "CoreWeave, sovereign clouds, specialty GPU hosts",
  },
  {
    id: "rest",
    label: "Rest of world owners",
    sharePct: 9.6,
    h100eMillions: 1.92,
    group: "other",
    confidence: "estimated",
    color: "#64748b",
    note: "Enterprise, research, smaller regional owners",
  },
];

export type ConcPathPoint = {
  vintage: string;
  label: string;
  ownerTop1Pct: number;
  ownerTop3Pct: number;
  ownerBig5Pct: number;
  cloudTop3Pct: number | null;
  confidence: Confidence;
};

/** Multi-vintage concentration path — ownership endpoints disclosed; cloud from Synergy Q3/Aug. */
export const CONCENTRATION_PATH: ConcPathPoint[] = [
  {
    vintage: "2024-Q1",
    label: "Q1'24",
    ownerTop1Pct: 22,
    ownerTop3Pct: 48,
    ownerBig5Pct: 63,
    cloudTop3Pct: null,
    confidence: "estimated",
  },
  {
    vintage: "2024-Q4",
    label: "Q4'24",
    ownerTop1Pct: 23.5,
    ownerTop3Pct: 51,
    ownerBig5Pct: 68,
    cloudTop3Pct: null,
    confidence: "estimated",
  },
  {
    vintage: "2025-Q4",
    label: "Q4'25",
    ownerTop1Pct: 25,
    ownerTop3Pct: 54,
    ownerBig5Pct: 71,
    cloudTop3Pct: null,
    confidence: "disclosed",
  },
  {
    vintage: "2026-Q3",
    label: "Q3'26",
    ownerTop1Pct: 25,
    ownerTop3Pct: 54.8,
    ownerBig5Pct: 71.4,
    cloudTop3Pct: 58,
    confidence: "carried",
  },
  {
    vintage: "2026-08",
    label: "Aug'26",
    ownerTop1Pct: 25,
    ownerTop3Pct: 54.8,
    ownerBig5Pct: 71.4,
    cloudTop3Pct: 57,
    confidence: "carried",
  },
];

export type RegionRow = {
  id: string;
  label: string;
  sharePct: number;
  approxGw: number;
  confidence: Confidence;
  color: string;
  note: string;
};

export const REGIONS: RegionRow[] = [
  {
    id: "united-states",
    label: "United States",
    sharePct: 45,
    approxGw: 18.5,
    confidence: "estimated",
    color: "#0ea5e9",
    note: "~45% of global AI DC capacity by power draw",
  },
  {
    id: "china",
    label: "China",
    sharePct: 18,
    approxGw: 7.4,
    confidence: "estimated",
    color: "#f43f5e",
    note: "High domestic FLOP/s; GPU mix export-control constrained",
  },
  {
    id: "europe",
    label: "Europe",
    sharePct: 14,
    approxGw: 5.8,
    confidence: "estimated",
    color: "#8b5cf6",
    note: "Nordics / Ireland / UK / France; grid & permitting friction",
  },
  {
    id: "middle-east",
    label: "Middle East",
    sharePct: 10,
    approxGw: 4.1,
    confidence: "estimated",
    color: "#f59e0b",
    note: "UAE Stargate, Saudi Humain — announced-heavy",
  },
  {
    id: "rest-apac",
    label: "Rest of Asia-Pacific",
    sharePct: 9,
    approxGw: 3.7,
    confidence: "estimated",
    color: "#14b8a6",
    note: "India, Singapore, Japan, Korea, Australia",
  },
  {
    id: "latam-other",
    label: "LatAm & other",
    sharePct: 4,
    approxGw: 1.6,
    confidence: "estimated",
    color: "#94a3b8",
    note: "Brazil, Mexico, Canada residual outside US total",
  },
];

export type MarketRow = {
  id: string;
  label: string;
  region: string;
  rankBand: "dual-hub" | "top-6" | "top-20" | "high-growth";
  capacityHintPct: number;
  yoyGrowthPct: number | null;
  color: string;
  note: string;
};

/** Synergy Aug 19 ranking snapshot — capacity hints illustrative within disclosed bands. */
export const MARKETS: MarketRow[] = [
  {
    id: "nva",
    label: "Northern Virginia",
    region: "United States",
    rankBand: "dual-hub",
    capacityHintPct: 9,
    yoyGrowthPct: 28,
    color: "#0ea5e9",
    note: "Largest live hyperscale metro; part of 17% dual-hub with Beijing",
  },
  {
    id: "beijing",
    label: "Greater Beijing",
    region: "China",
    rankBand: "dual-hub",
    capacityHintPct: 8,
    yoyGrowthPct: 32,
    color: "#f43f5e",
    note: "Pairs with N.VA for Synergy’s 17% dual-hub print",
  },
  {
    id: "oregon",
    label: "Oregon",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 5,
    yoyGrowthPct: 35,
    color: "#38bdf8",
    note: "Hyperscale West Coast corridor",
  },
  {
    id: "iowa",
    label: "Iowa",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 4.5,
    yoyGrowthPct: 40,
    color: "#0284c7",
    note: "Midwest ops node in top-6 band",
  },
  {
    id: "ohio",
    label: "Ohio",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 4,
    yoyGrowthPct: 42,
    color: "#0369a1",
    note: "Midwest build corridor",
  },
  {
    id: "dfw",
    label: "Dallas–Fort Worth",
    region: "United States",
    rankBand: "top-6",
    capacityHintPct: 4,
    yoyGrowthPct: 55,
    color: "#f59e0b",
    note: "Texas ops growth premium vs world",
  },
  {
    id: "dublin",
    label: "Dublin",
    region: "Europe",
    rankBand: "top-20",
    capacityHintPct: 2.5,
    yoyGrowthPct: 18,
    color: "#8b5cf6",
    note: "Sole EU seat in Synergy top-20",
  },
  {
    id: "texas-ops",
    label: "Texas (ops aggregate)",
    region: "United States",
    rankBand: "high-growth",
    capacityHintPct: 3.5,
    yoyGrowthPct: 71,
    color: "#ea580c",
    note: "+71% YoY ops vs +36% world average",
  },
];

export type TokenBrandRow = {
  id: string;
  label: string;
  origin: "United States" | "China" | "Other";
  sharePct: number;
  tokensT: number;
  color: string;
  note: string;
};

/** Top brand ladder — June 2026 token series (T tokens/mo). */
export const TOKEN_BRANDS: TokenBrandRow[] = [
  {
    id: "bytedance",
    label: "ByteDance",
    origin: "China",
    sharePct: 29.2,
    tokensT: 5400,
    color: "#f43f5e",
    note: "Doubao + TikTok AI surfaces — Top-1 tokens, tiny ownership",
  },
  {
    id: "google",
    label: "Google",
    origin: "United States",
    sharePct: 19.0,
    tokensT: 3520,
    color: "#4285f4",
    note: "Owns ~25% of chips; #2 in tokens",
  },
  {
    id: "alibaba",
    label: "Alibaba (Qwen)",
    origin: "China",
    sharePct: 11.3,
    tokensT: 2100,
    color: "#ff6a00",
    note: "Qwen MaaS + app surfaces",
  },
  {
    id: "openai",
    label: "OpenAI",
    origin: "United States",
    sharePct: 9.2,
    tokensT: 1700,
    color: "#10b981",
    note: "Token share without disclosed chip ownership",
  },
  {
    id: "zhipu",
    label: "Zhipu / Z.ai",
    origin: "China",
    sharePct: 5.1,
    tokensT: 950,
    color: "#14b8a6",
    note: "GLM MaaS — supply-constrained",
  },
  {
    id: "tencent",
    label: "Tencent",
    origin: "China",
    sharePct: 3.8,
    tokensT: 700,
    color: "#12b7f5",
    note: "Hunyuan surfaces",
  },
  {
    id: "rest",
    label: "All other brands",
    origin: "Other",
    sharePct: 22.4,
    tokensT: 4133,
    color: "#64748b",
    note: "Residual of June 2026 major-brands series",
  },
];

export type TokenVsOwnerRow = {
  id: string;
  label: string;
  tokenSharePct: number;
  ownerSharePct: number;
  color: string;
  note: string;
};

/** Divergence scatter — token share vs chip ownership share. */
export const TOKEN_VS_OWNERSHIP: TokenVsOwnerRow[] = [
  {
    id: "google",
    label: "Google",
    tokenSharePct: 19.0,
    ownerSharePct: 25.0,
    color: "#4285f4",
    note: "Owns and serves at scale",
  },
  {
    id: "bytedance",
    label: "ByteDance",
    tokenSharePct: 29.2,
    ownerSharePct: 1.5,
    color: "#f43f5e",
    note: "Usage dwarfs ownership inside China ~5%",
  },
  {
    id: "openai",
    label: "OpenAI",
    tokenSharePct: 9.2,
    ownerSharePct: 0,
    color: "#10b981",
    note: "Rents Microsoft / Oracle / others",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    tokenSharePct: 2.9,
    ownerSharePct: 17.3,
    color: "#00a4ef",
    note: "Owns more than first-party tokens — Azure rents out",
  },
  {
    id: "amazon",
    label: "Amazon",
    tokenSharePct: 1.7,
    ownerSharePct: 12.5,
    color: "#ff9900",
    note: "Ownership >> Bedrock first-party token share",
  },
  {
    id: "alibaba",
    label: "Alibaba",
    tokenSharePct: 11.3,
    ownerSharePct: 1.2,
    color: "#ff6a00",
    note: "Qwen tokens vs thin ownership slice",
  },
  {
    id: "meta",
    label: "Meta",
    tokenSharePct: 1.4,
    ownerSharePct: 11.3,
    color: "#0668E1",
    note: "Owns for Llama; open-weight routing dilutes credit",
  },
];

export type CloudSlice = {
  id: string;
  label: string;
  sharePct: number;
  color: string;
  note: string;
};

/** Hyperscale capacity — Top-3 vs rest (Synergy Aug 19). */
export const CLOUD_SLICES: CloudSlice[] = [
  {
    id: "top3",
    label: "AWS + Azure + Google",
    sharePct: 57,
    color: "#f59e0b",
    note: "Top-3 cloud share of hyperscale capacity (−1 pp vs Q3)",
  },
  {
    id: "rest",
    label: "All other hyperscale",
    sharePct: 43,
    color: "#64748b",
    note: "Oracle, Meta, neoclouds, regional operators, colo AI",
  },
];

export type MarketBand = {
  id: string;
  label: string;
  sharePct: number;
  color: string;
  note: string;
};

export const MARKET_BANDS: MarketBand[] = [
  {
    id: "dual-hub",
    label: "N.VA + Beijing",
    sharePct: 17,
    color: "#ea580c",
    note: "Two metros = 17% of hyperscale capacity",
  },
  {
    id: "next-18",
    label: "Rest of top-20",
    sharePct: 43,
    color: "#0ea5e9",
    note: "Top-20 total 60%; US holds 15 of 20 seats",
  },
  {
    id: "next-20",
    label: "Markets 21–40",
    sharePct: 19,
    color: "#8b5cf6",
    note: "Top-40 = 79%",
  },
  {
    id: "tail",
    label: "Outside top-40",
    sharePct: 21,
    color: "#94a3b8",
    note: "Long tail of secondary metros",
  },
];

/** Helpers */
export function ownerLadderSorted(): OwnerRow[] {
  return [...OWNERS].sort((a, b) => b.sharePct - a.sharePct);
}

export function concentrationCurve(shares: number[]): { rank: number; cumPct: number; equalPct: number }[] {
  const sorted = [...shares].sort((a, b) => b - a);
  let cum = 0;
  const n = sorted.length;
  return sorted.map((s, i) => {
    cum += s;
    return {
      rank: i + 1,
      cumPct: Math.round(cum * 10) / 10,
      equalPct: Math.round(((i + 1) / n) * 1000) / 10,
    };
  });
}

export function ownerCurve() {
  return concentrationCurve(OWNERS.map((o) => o.sharePct));
}

export function regionCurve() {
  return concentrationCurve(REGIONS.map((r) => r.sharePct));
}

export function tokenCurve() {
  return concentrationCurve(TOKEN_BRANDS.map((t) => t.sharePct));
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtT(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k T`;
  return `${n.toFixed(0)} T`;
}
