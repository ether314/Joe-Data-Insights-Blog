/**
 * AI compute demand — Q3 2026 concentration lens (Top-1 / Top-3 / HHI).
 *
 * Core question: How concentrated is this system at the top of the distribution?
 * (Who processes how much compute and where is it located?)
 *
 * Vintage delta vs ai-compute-demand-concentration-2026:
 * 1. Chip ownership — carried (Google 25% / Top-3 54.8% / Big-5 71.4%)
 * 2. Hyperscale cloud Top-3 — Q3 Synergy site print 58% (Aug was 57%)
 * 3. Site ledger — 1,360 ops / 803 pipeline; US 580 / 437 (54% of pipeline seats)
 * 4. Token cohort — Q3 brand mix; Google leads tokens (~27%) vs prior ByteDance Top-1
 * 5. Gartner US electricity — US 36% of world DC TWh; ~68 TWh dedicated AI inside US
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "restated";

export const SOURCE_NOTE =
  "Q3 concentration lens on four perimeters. Chip ownership: Epoch Chip Owners / Aug explorer Big-5 H100e — carried (no new Epoch period print). Hyperscale sites/capacity: Synergy Q3 hyperscale ops/pipeline ledger (1,360 ops / 803 pipeline; Top-3 cloud 58%) vs Aug 19 location rankings (Top-3 57%; dual-hub 17%). Regional AI DC power-draw shares: theme synthesis carried (~US 45%). Token shares: Q3 brand cohort (vendor keynotes, China NDA stats, OpenRouter, revenue proxies) — Google leads tokens in this cohort; prior June series had ByteDance Top-1. Gartner US electricity composition (204 TWh / 36% of world DC). Shares within each perimeter sum ≈100%; cross-perimeter comparisons are illustrative.";

export const SOURCES = [
  {
    label: "Prior concentration print (2026)",
    url: "/blog/ai-compute-demand-concentration-2026",
  },
  {
    label: "Q3 site-count & Top-3 cloud update",
    url: "/blog/ai-compute-demand-update-2026q3",
  },
  {
    label: "August location rankings update",
    url: "/blog/ai-compute-demand-update-202608",
  },
  {
    label: "Theme research — who owns AI compute",
    url: "/blog/ai-compute-demand-research-2026",
  },
  {
    label: "Epoch AI — hyperscalers control most compute",
    url: "https://epoch.ai/data-insights/hyperscalers-control-most-compute",
  },
  {
    label: "Gartner — DC electricity demand +26% in 2026",
    url: "https://www.gartner.com/en/newsroom/press-releases/2026-06-10-gartner-says-data-center-electricity-demand-to-grow-26-percent-in-2026",
  },
] as const;

/** Headline punchline — Q3 Top-1 / Top-3 across ownership, sites, tokens */
export const HEADLINE = {
  /** Chip ownership — carried world H100e stock */
  ownerTop1Pct: 25.0,
  ownerTop1Label: "Google",
  ownerTop3Pct: 54.8,
  ownerTop3Labels: "Google + Microsoft + Amazon",
  ownerBig5Pct: 71.4,
  ownerBig5Hhi: 2421,
  equalFiveHhi: 2000,
  microsoftSharePct: 17.3,
  amazonSharePct: 12.5,
  metaSharePct: 11.3,
  oracleSharePct: 5.3,
  chinaOwnerSharePct: 5.0,
  worldH100eMillions: 20.0,

  /** Hyperscale cloud — Q3 Synergy print */
  cloudTop3Pct: 58,
  cloudTop3PriorPct: 57,
  cloudTop3DeltaPp: 1,
  cloudTop3Labels: "AWS + Azure + Google Cloud",
  dualHubPct: 17,
  dualHubLabels: "N. Virginia + Greater Beijing",
  marketTop20Pct: 60,
  marketTop40Pct: 79,
  top20UsSeats: 15,
  top20TotalSeats: 20,

  /** Site ledger concentration (Q3 Synergy hyperscale-only) */
  worldOpsSites: 1360,
  usOpsSites: 580,
  usOpsSiteSharePct: 42.6,
  worldPipelineSites: 803,
  usPipelineSites: 437,
  usPipelineSiteSharePct: 54.4,
  newCampusSizeMultiple: 2,
  priorPipelineSitesAug: 915,

  /** Regional AI DC capacity by power draw (carried) */
  regionTop1Pct: 45,
  regionTop1Label: "United States",
  regionTop3Pct: 77,
  regionTop3Labels: "US + China + Europe",

  /** Gartner US electricity composition */
  worldDcTwh2026: 565,
  usDcTwh2026: 204,
  usDcShareOfWorldPct: 36,
  usAiDcTwh2026: 68,
  usAiShareOfUsDcPct: 33,

  /** Token throughput — Q3 brand cohort */
  tokenTop1Pct: 27,
  tokenTop1Label: "Google",
  tokenTop3Pct: 63,
  tokenTop3Labels: "Google + ByteDance + OpenAI",
  tokenPriorTop1Pct: 29.2,
  tokenPriorTop1Label: "ByteDance",
  tokenChinaOriginPct: 33,
  tokenUsOriginPct: 56,
} as const;

export type PerimeterId = "ownership" | "cloud" | "sites" | "tokens";

export type ScoreboardRow = {
  id: PerimeterId;
  label: string;
  top1Pct: number;
  top1Label: string;
  top3Pct: number;
  top3Labels: string;
  extraMetric: string;
  extraValue: string;
  priorTop3Pct: number | null;
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
    extraMetric: "Big-5 / HHI",
    extraValue: `${HEADLINE.ownerBig5Pct}% · ${HEADLINE.ownerBig5Hhi}`,
    priorTop3Pct: 54.8,
    color: "#4285f4",
    confidence: "carried",
    note: "Carried from prior concentration print — no new Epoch period",
  },
  {
    id: "cloud",
    label: "Hyperscale capacity (cloud)",
    top1Pct: HEADLINE.dualHubPct,
    top1Label: HEADLINE.dualHubLabels,
    top3Pct: HEADLINE.cloudTop3Pct,
    top3Labels: HEADLINE.cloudTop3Labels,
    extraMetric: "vs Aug Top-3",
    extraValue: `${HEADLINE.cloudTop3PriorPct}% → ${HEADLINE.cloudTop3Pct}%`,
    priorTop3Pct: HEADLINE.cloudTop3PriorPct,
    color: "#f59e0b",
    confidence: "disclosed",
    note: "Q3 Synergy hyperscale capacity Top-3; dual-hub is N.VA+Beijing",
  },
  {
    id: "sites",
    label: "Pipeline sites (US share)",
    top1Pct: HEADLINE.usPipelineSiteSharePct,
    top1Label: "United States",
    top3Pct: HEADLINE.usOpsSiteSharePct,
    top3Labels: "US ops site share (of world)",
    extraMetric: "US pipeline seats",
    extraValue: `${HEADLINE.usPipelineSites} / ${HEADLINE.worldPipelineSites}`,
    priorTop3Pct: null,
    color: "#0ea5e9",
    confidence: "disclosed",
    note: "Synergy hyperscale-only ledger — not the Aug ~915 large-DC mix",
  },
  {
    id: "tokens",
    label: "Token throughput (brand)",
    top1Pct: HEADLINE.tokenTop1Pct,
    top1Label: HEADLINE.tokenTop1Label,
    top3Pct: HEADLINE.tokenTop3Pct,
    top3Labels: HEADLINE.tokenTop3Labels,
    extraMetric: "Prior Top-1",
    extraValue: `${HEADLINE.tokenPriorTop1Label} ${HEADLINE.tokenPriorTop1Pct}%`,
    priorTop3Pct: 59.6,
    color: "#f43f5e",
    confidence: "estimated",
    note: "Q3 cohort; Google leads tokens — ownership ≠ routed token share",
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

export const OWNERS: OwnerRow[] = [
  {
    id: "google",
    label: "Google",
    sharePct: 25.0,
    h100eMillions: 5.0,
    group: "hyperscaler",
    confidence: "carried",
    color: "#4285f4",
    note: "Mostly custom TPUs; Top-1 ownership (carried)",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    sharePct: 17.3,
    h100eMillions: 3.45,
    group: "hyperscaler",
    confidence: "carried",
    color: "#00a4ef",
    note: "Aug explorer restatement — Q3 carry",
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
  usPipelineSiteSharePct: number | null;
  tokenTop1Pct: number | null;
  confidence: Confidence;
};

/** Multi-vintage concentration path — Q3 adds site + token tip meters */
export const CONCENTRATION_PATH: ConcPathPoint[] = [
  {
    vintage: "2024-Q1",
    label: "Q1'24",
    ownerTop1Pct: 22,
    ownerTop3Pct: 48,
    ownerBig5Pct: 63,
    cloudTop3Pct: null,
    usPipelineSiteSharePct: null,
    tokenTop1Pct: null,
    confidence: "estimated",
  },
  {
    vintage: "2025-Q4",
    label: "Q4'25",
    ownerTop1Pct: 25,
    ownerTop3Pct: 54,
    ownerBig5Pct: 71,
    cloudTop3Pct: null,
    usPipelineSiteSharePct: null,
    tokenTop1Pct: null,
    confidence: "disclosed",
  },
  {
    vintage: "2026-conc",
    label: "Conc'26",
    ownerTop1Pct: 25,
    ownerTop3Pct: 54.8,
    ownerBig5Pct: 71.4,
    cloudTop3Pct: 57,
    usPipelineSiteSharePct: null,
    tokenTop1Pct: 29.2,
    confidence: "carried",
  },
  {
    vintage: "2026-08",
    label: "Aug'26",
    ownerTop1Pct: 25,
    ownerTop3Pct: 54.8,
    ownerBig5Pct: 71.4,
    cloudTop3Pct: 57,
    usPipelineSiteSharePct: null,
    tokenTop1Pct: null,
    confidence: "carried",
  },
  {
    vintage: "2026-Q3",
    label: "Q3'26",
    ownerTop1Pct: 25,
    ownerTop3Pct: 54.8,
    ownerBig5Pct: 71.4,
    cloudTop3Pct: 58,
    usPipelineSiteSharePct: 54.4,
    tokenTop1Pct: 27,
    confidence: "disclosed",
  },
];

export type SiteLedgerRow = {
  id: string;
  label: string;
  opsSites: number;
  pipelineSites: number;
  opsSharePct: number;
  pipelineSharePct: number;
  color: string;
  note: string;
};

/** US vs rest-of-world on Synergy hyperscale-only site ledger */
export const SITE_LEDGER: SiteLedgerRow[] = [
  {
    id: "us",
    label: "United States",
    opsSites: 580,
    pipelineSites: 437,
    opsSharePct: 42.6,
    pipelineSharePct: 54.4,
    color: "#0ea5e9",
    note: "Ops share < pipeline share — US still dominates new seats",
  },
  {
    id: "row",
    label: "Rest of world",
    opsSites: 780,
    pipelineSites: 366,
    opsSharePct: 57.4,
    pipelineSharePct: 45.6,
    color: "#64748b",
    note: "ROW holds more live ops seats; thinner pipeline share",
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

export type CloudSlice = {
  id: string;
  label: string;
  sharePct: number;
  priorSharePct: number;
  color: string;
  note: string;
};

export const CLOUD_SLICES: CloudSlice[] = [
  {
    id: "top3",
    label: "AWS + Azure + Google",
    sharePct: 58,
    priorSharePct: 57,
    color: "#f59e0b",
    note: "Q3 Top-3 cloud share (+1 pp vs Aug ranking print)",
  },
  {
    id: "rest",
    label: "All other hyperscale",
    sharePct: 42,
    priorSharePct: 43,
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

export type TokenBrandRow = {
  id: string;
  label: string;
  origin: "United States" | "China" | "Other";
  sharePct: number;
  priorSharePct: number | null;
  color: string;
  note: string;
};

/** Q3 brand token ladder — Google leads; ByteDance slips vs prior June Top-1 */
export const TOKEN_BRANDS: TokenBrandRow[] = [
  {
    id: "google",
    label: "Google",
    origin: "United States",
    sharePct: 27,
    priorSharePct: 19.0,
    color: "#4285f4",
    note: "Q3 Top-1 tokens; also Top-1 ownership",
  },
  {
    id: "bytedance",
    label: "ByteDance",
    origin: "China",
    sharePct: 21,
    priorSharePct: 29.2,
    color: "#f43f5e",
    note: "Prior Top-1; still #2 — usage >> ownership",
  },
  {
    id: "openai",
    label: "OpenAI",
    origin: "United States",
    sharePct: 15,
    priorSharePct: 9.2,
    color: "#10b981",
    note: "Token share up; still ~0 chip ownership",
  },
  {
    id: "china-other",
    label: "Other China apps",
    origin: "China",
    sharePct: 12,
    priorSharePct: null,
    color: "#dc2626",
    note: "Alibaba / Tencent / DeepSeek / MiniMax aggregate",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    origin: "United States",
    sharePct: 9,
    priorSharePct: 2.9,
    color: "#00a4ef",
    note: "Owns more chips than first-party tokens",
  },
  {
    id: "meta",
    label: "Meta",
    origin: "United States",
    sharePct: 6,
    priorSharePct: 1.4,
    color: "#0668E1",
    note: "Llama / Meta AI; open-weight dilutes credit",
  },
  {
    id: "amazon",
    label: "Amazon",
    origin: "United States",
    sharePct: 5,
    priorSharePct: 1.7,
    color: "#ff9900",
    note: "Bedrock / Anthropic partner path",
  },
  {
    id: "rest",
    label: "All other brands",
    origin: "Other",
    sharePct: 5,
    priorSharePct: 22.4,
    color: "#64748b",
    note: "Residual of Q3 cohort (tighter brand set than June)",
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

export const TOKEN_VS_OWNERSHIP: TokenVsOwnerRow[] = [
  {
    id: "google",
    label: "Google",
    tokenSharePct: 27,
    ownerSharePct: 25.0,
    color: "#4285f4",
    note: "Owns and serves at scale",
  },
  {
    id: "bytedance",
    label: "ByteDance",
    tokenSharePct: 21,
    ownerSharePct: 1.5,
    color: "#f43f5e",
    note: "Usage still dwarfs ownership inside China ~5%",
  },
  {
    id: "openai",
    label: "OpenAI",
    tokenSharePct: 15,
    ownerSharePct: 0,
    color: "#10b981",
    note: "Rents Microsoft / Oracle / others",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    tokenSharePct: 9,
    ownerSharePct: 17.3,
    color: "#00a4ef",
    note: "Owns more than first-party tokens — Azure rents out",
  },
  {
    id: "amazon",
    label: "Amazon",
    tokenSharePct: 5,
    ownerSharePct: 12.5,
    color: "#ff9900",
    note: "Ownership >> Bedrock first-party token share",
  },
  {
    id: "meta",
    label: "Meta",
    tokenSharePct: 6,
    ownerSharePct: 11.3,
    color: "#0668E1",
    note: "Owns for Llama; open-weight routing dilutes credit",
  },
  {
    id: "china-other",
    label: "Other China",
    tokenSharePct: 12,
    ownerSharePct: 3.5,
    color: "#dc2626",
    note: "Alibaba / Tencent / DeepSeek — usage >> ownership",
  },
];

export type ElectricitySlice = {
  id: string;
  label: string;
  twh: number;
  shareOfWorldPct: number;
  color: string;
  note: string;
};

/** Gartner 2026 DC electricity — US concentration meter */
export const ELECTRICITY_SLICES: ElectricitySlice[] = [
  {
    id: "us-ai",
    label: "US dedicated AI DC",
    twh: 68,
    shareOfWorldPct: 12.0,
    color: "#f59e0b",
    note: "~1/3 of US DC power; ~12% of world DC TWh",
  },
  {
    id: "us-other",
    label: "US other DC",
    twh: 136,
    shareOfWorldPct: 24.1,
    color: "#0ea5e9",
    note: "US total 204 TWh − 68 TWh AI slice",
  },
  {
    id: "row",
    label: "Rest of world DC",
    twh: 361,
    shareOfWorldPct: 63.9,
    color: "#64748b",
    note: "World 565 TWh − US 204 TWh",
  },
];

export type DeltaMeter = {
  id: string;
  label: string;
  prior: number;
  current: number;
  unit: string;
  delta: number;
  color: string;
  note: string;
};

/** Aug/prior → Q3 concentration deltas */
export const DELTA_METERS: DeltaMeter[] = [
  {
    id: "cloud-top3",
    label: "Cloud Top-3 share",
    prior: 57,
    current: 58,
    unit: "pp",
    delta: 1,
    color: "#f59e0b",
    note: "Aug ranking → Q3 Synergy capacity print",
  },
  {
    id: "owner-top3",
    label: "Owner Top-3 share",
    prior: 54.8,
    current: 54.8,
    unit: "pp",
    delta: 0,
    color: "#4285f4",
    note: "Carried — Epoch period still open",
  },
  {
    id: "token-top1",
    label: "Token Top-1 share",
    prior: 29.2,
    current: 27,
    unit: "pp",
    delta: -2.2,
    color: "#f43f5e",
    note: "ByteDance 29.2% → Google 27% (cohort change)",
  },
  {
    id: "us-pipeline",
    label: "US pipeline site share",
    prior: 54,
    current: 54.4,
    unit: "pp",
    delta: 0.4,
    color: "#0ea5e9",
    note: "Prior ~54% of 915 mix ≈ Q3 437/803 hyperscale",
  },
];

/** Helpers */
export function ownerLadderSorted(): OwnerRow[] {
  return [...OWNERS].sort((a, b) => b.sharePct - a.sharePct);
}

export function concentrationCurve(
  shares: number[],
): { rank: number; cumPct: number; equalPct: number }[] {
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

export function sitePipelineHhi(): number {
  const shares = SITE_LEDGER.map((s) => s.pipelineSharePct);
  return Math.round(shares.reduce((acc, s) => acc + s * s, 0));
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtSites(n: number): string {
  return n.toLocaleString("en-US");
}
