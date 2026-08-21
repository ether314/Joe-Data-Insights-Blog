/**
 * Industrial robotics concentration — Q3 2026 vintage.
 * Core question: how concentrated is the install distribution at the top,
 * and did the IFR April-2026 prelim (621k / +15%) tighten or loosen it?
 *
 * Complements:
 * - /blog/industrial-robotics-concentration-2026 (2024 WR share ladder)
 * - /blog/industrial-robotics-update-2026q3 (install levels / YoY)
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Q3 2026 concentration lens on IFR preliminary 2025 installations (as of April 2026; briefed 24 Jun 2026). World 621k and Asia 79% disclosed; China ~10× US (~380k) is an IFR narrative estimate — country table awaits WR 2026 (24 Sep 2026). Top-3/Top-5 and HHI blend disclosed US units with estimated Japan/Korea/Germany 2025 levels. Prior ladder from IFR WR 2025 (2024 vintage).";

export const IFR_US_URL =
  "https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth";
export const IFR_ROUNDTABLE_URL =
  "https://ifr.org/downloads/press_docs/2026_06_24_IFR_Executive_Roundtable_market_presentation.pdf";
export const IFR_WR2025_URL =
  "https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years";
export const PRIOR_CONC_PATH = "/blog/industrial-robotics-concentration-2026";
export const Q3_UPDATE_PATH = "/blog/industrial-robotics-update-2026q3";
export const RESEARCH_PATH = "/blog/industrial-robotics-research-2026";
export const DENSITY_PATH = "/blog/manufacturing-robot-density-ifr-2024";

export const SOURCES = [
  {
    label: "IFR — US robot industry returns to double-digit growth (Jun 2026)",
    url: IFR_US_URL,
  },
  {
    label: "IFR Executive Roundtable market presentation (24 Jun 2026)",
    url: IFR_ROUNDTABLE_URL,
  },
  {
    label: "Prior concentration companion — 2024 WR ladder",
    url: PRIOR_CONC_PATH,
  },
  {
    label: "Q3 install update — 621k prelim",
    url: Q3_UPDATE_PATH,
  },
  {
    label: "IFR World Robotics 2025 industrial robots release",
    url: IFR_WR2025_URL,
  },
] as const;

export const WORLD_UNITS_2024 = 542_076;
export const WORLD_UNITS_2025 = 621_000;
export const WORLD_DELTA = WORLD_UNITS_2025 - WORLD_UNITS_2024; // 78_924

export const HEADLINE = {
  worldUnits2024: WORLD_UNITS_2024,
  worldUnits2025: WORLD_UNITS_2025,
  worldYoyPct: 15,
  worldDelta: WORLD_DELTA,
  /** Estimated China 2025 (~10× US) */
  top1Share2024Pct: 54,
  top1Share2025Pct: 61.2,
  top1Label: "China",
  top1Units2024: 295_000,
  top1Units2025: 380_000,
  top1DeltaUnits: 85_000,
  /** China alone more than absorbed the world net add */
  top1DeltaVsWorldPct: 108,
  top3Share2024Pct: 69,
  top3Share2025Pct: 74.2,
  top3Labels: "China + Japan + US",
  top5Share2024Pct: 80,
  top5Share2025Pct: 82.9,
  asiaShare2024Pct: 74,
  asiaShare2025Pct: 79,
  europeShare2024Pct: 16,
  europeShare2025Pct: 13,
  americasShare2024Pct: 9,
  americasShare2025Pct: 9,
  usUnits2025: 38_000,
  usShare2025Pct: 6.1,
  usYoyPct: 11,
  marketHhi2024: 3120,
  marketHhi2025: 4161,
  electronicsYoyPct: 25,
  automotiveYoyPct: 10,
  electronicsShare2025Pct: 26,
  automotiveShare2025Pct: 22,
  top2IndustryShare2025Pct: 48,
  finalReportDate: "2026-09-24",
  prelimAsOf: "2026-04",
} as const;

export type VintageKey = "2024" | "2025";

export type MarketShare = {
  rank: number;
  market: string;
  short: string;
  region: "Asia" | "Europe" | "Americas";
  units2024: number;
  units2025: number;
  share2024Pct: number;
  share2025Pct: number;
  yoyPct: number | null;
  confidence: Confidence;
  fill: string;
};

/** Ranked install markets — 2024 disclosed + 2025 prelim/estimate blend */
export const MARKET_SHARES: MarketShare[] = [
  {
    rank: 1,
    market: "China",
    short: "China",
    region: "Asia",
    units2024: 295_000,
    units2025: 380_000,
    share2024Pct: 54.4,
    share2025Pct: 61.2,
    yoyPct: 29,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    rank: 2,
    market: "Japan",
    short: "Japan",
    region: "Asia",
    units2024: 44_453,
    units2025: 43_000,
    share2024Pct: 8.2,
    share2025Pct: 6.9,
    yoyPct: -3,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    rank: 3,
    market: "United States",
    short: "US",
    region: "Americas",
    units2024: 34_200,
    units2025: 38_000,
    share2024Pct: 6.3,
    share2025Pct: 6.1,
    yoyPct: 11,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    rank: 4,
    market: "Korea, Republic of",
    short: "Korea",
    region: "Asia",
    units2024: 30_596,
    units2025: 30_000,
    share2024Pct: 5.6,
    share2025Pct: 4.8,
    yoyPct: -2,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    rank: 5,
    market: "Germany",
    short: "Germany",
    region: "Europe",
    units2024: 26_982,
    units2025: 24_000,
    share2024Pct: 5.0,
    share2025Pct: 3.9,
    yoyPct: -11,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    rank: 6,
    market: "India",
    short: "India",
    region: "Asia",
    units2024: 9_100,
    units2025: 10_500,
    share2024Pct: 1.7,
    share2025Pct: 1.7,
    yoyPct: 15,
    confidence: "estimated",
    fill: "#64748b",
  },
  {
    rank: 7,
    market: "Italy",
    short: "Italy",
    region: "Europe",
    units2024: 8_783,
    units2025: 7_800,
    share2024Pct: 1.6,
    share2025Pct: 1.3,
    yoyPct: -11,
    confidence: "estimated",
    fill: "#94a3b8",
  },
  {
    rank: 8,
    market: "Mexico",
    short: "Mexico",
    region: "Americas",
    units2024: 5_800,
    units2025: 5_300,
    share2024Pct: 1.1,
    share2025Pct: 0.9,
    yoyPct: -8,
    confidence: "disclosed",
    fill: "#a78bfa",
  },
];

export const CONCENTRATION_CURVE_2025 = MARKET_SHARES.map((m, i) => {
  const cumulative = MARKET_SHARES.slice(0, i + 1).reduce(
    (s, r) => s + r.share2025Pct,
    0,
  );
  return {
    rank: m.rank,
    market: m.short,
    cumulativeSharePct: Number(cumulative.toFixed(1)),
    equalSharePct: Number((((i + 1) / MARKET_SHARES.length) * 100).toFixed(1)),
    sharePct: m.share2025Pct,
  };
});

export const CONCENTRATION_CURVE_2024 = MARKET_SHARES.map((m, i) => {
  const cumulative = MARKET_SHARES.slice(0, i + 1).reduce(
    (s, r) => s + r.share2024Pct,
    0,
  );
  return {
    rank: m.rank,
    market: m.short,
    cumulativeSharePct: Number(cumulative.toFixed(1)),
    equalSharePct: Number((((i + 1) / MARKET_SHARES.length) * 100).toFixed(1)),
    sharePct: m.share2024Pct,
  };
});

export type RegionShare = {
  region: string;
  short: string;
  units2024: number;
  units2025: number;
  share2024Pct: number;
  share2025Pct: number;
  yoyPct: number;
  fill: string;
  confidence: Confidence;
};

export const REGION_SHARES: RegionShare[] = [
  {
    region: "Asia",
    short: "Asia",
    units2024: 401_665,
    units2025: 490_590,
    share2024Pct: 74,
    share2025Pct: 79,
    yoyPct: 22,
    fill: "#f59e0b",
    confidence: "disclosed",
  },
  {
    region: "Europe",
    short: "Europe",
    units2024: 85_006,
    units2025: 80_730,
    share2024Pct: 16,
    share2025Pct: 13,
    yoyPct: -5,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    region: "Americas",
    short: "Americas",
    units2024: 50_077,
    units2025: 55_890,
    share2024Pct: 9,
    share2025Pct: 9,
    yoyPct: 12,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
];

/** Who captured (or shed) the world net add of ~79k units */
export type DeltaCapture = {
  market: string;
  short: string;
  deltaUnits: number;
  shareOfWorldDeltaPct: number;
  fill: string;
  confidence: Confidence;
};

export const DELTA_CAPTURE: DeltaCapture[] = [
  {
    market: "China",
    short: "China",
    deltaUnits: 85_000,
    shareOfWorldDeltaPct: 108,
    fill: "#f43f5e",
    confidence: "estimated",
  },
  {
    market: "United States",
    short: "US",
    deltaUnits: 3_800,
    shareOfWorldDeltaPct: 4.8,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    market: "India",
    short: "India",
    deltaUnits: 1_400,
    shareOfWorldDeltaPct: 1.8,
    fill: "#64748b",
    confidence: "estimated",
  },
  {
    market: "Japan",
    short: "Japan",
    deltaUnits: -1_453,
    shareOfWorldDeltaPct: -1.8,
    fill: "#f59e0b",
    confidence: "estimated",
  },
  {
    market: "Korea",
    short: "Korea",
    deltaUnits: -596,
    shareOfWorldDeltaPct: -0.8,
    fill: "#8b5cf6",
    confidence: "estimated",
  },
  {
    market: "Germany",
    short: "Germany",
    deltaUnits: -2_982,
    shareOfWorldDeltaPct: -3.8,
    fill: "#14b8a6",
    confidence: "estimated",
  },
  {
    market: "Mexico",
    short: "Mexico",
    deltaUnits: -500,
    shareOfWorldDeltaPct: -0.6,
    fill: "#a78bfa",
    confidence: "disclosed",
  },
];

/** Multi-year top-1 / top-3 / Asia share path */
export const CONCENTRATION_PATH = [
  {
    year: "2022",
    top1Pct: 52,
    top3Pct: 68,
    asiaPct: 73,
    confidence: "estimated" as Confidence,
  },
  {
    year: "2023",
    top1Pct: 51,
    top3Pct: 67,
    asiaPct: 70,
    confidence: "estimated" as Confidence,
  },
  {
    year: "2024",
    top1Pct: 54,
    top3Pct: 69,
    asiaPct: 74,
    confidence: "disclosed" as Confidence,
  },
  {
    year: "2025p",
    top1Pct: 61.2,
    top3Pct: 74.2,
    asiaPct: 79,
    confidence: "estimated" as Confidence,
  },
];

export const TOP_K_LADDER = [
  {
    k: 1,
    label: "Top-1",
    share2024Pct: HEADLINE.top1Share2024Pct,
    share2025Pct: HEADLINE.top1Share2025Pct,
    note: "China alone",
  },
  {
    k: 3,
    label: "Top-3",
    share2024Pct: HEADLINE.top3Share2024Pct,
    share2025Pct: HEADLINE.top3Share2025Pct,
    note: "CN + JP + US",
  },
  {
    k: 5,
    label: "Top-5",
    share2024Pct: HEADLINE.top5Share2024Pct,
    share2025Pct: HEADLINE.top5Share2025Pct,
    note: "+ KR + DE",
  },
];

export type IndustryShare = {
  industry: string;
  short: string;
  share2024Pct: number;
  share2025Pct: number;
  yoyPct: number;
  fill: string;
  confidence: Confidence;
};

/** Industry mix — 2024 WR shares rolled forward with disclosed 2025 YoY */
export const INDUSTRY_SHARES: IndustryShare[] = [
  {
    industry: "Electrical / electronics",
    short: "Electronics",
    share2024Pct: 24,
    share2025Pct: 26,
    yoyPct: 25,
    fill: "#0ea5e9",
    confidence: "estimated",
  },
  {
    industry: "Automotive",
    short: "Automotive",
    share2024Pct: 23,
    share2025Pct: 22,
    yoyPct: 10,
    fill: "#f43f5e",
    confidence: "estimated",
  },
  {
    industry: "Metal & machinery",
    short: "Metal/mach.",
    share2024Pct: 16,
    share2025Pct: 15.5,
    yoyPct: 11,
    fill: "#f59e0b",
    confidence: "estimated",
  },
  {
    industry: "Plastic & chemical",
    short: "Plastic/chem.",
    share2024Pct: 5,
    share2025Pct: 4.8,
    yoyPct: 8,
    fill: "#8b5cf6",
    confidence: "estimated",
  },
  {
    industry: "Food & beverage",
    short: "Food/bev.",
    share2024Pct: 4,
    share2025Pct: 4.2,
    yoyPct: 18,
    fill: "#14b8a6",
    confidence: "estimated",
  },
  {
    industry: "Other / unspecified",
    short: "Other",
    share2024Pct: 28,
    share2025Pct: 27.5,
    yoyPct: 12,
    fill: "#64748b",
    confidence: "estimated",
  },
];

export type ShareGrowthPoint = {
  market: string;
  short: string;
  sharePct: number;
  yoyPct: number;
  units: number;
  region: string;
  fill: string;
};

export const SHARE_GROWTH_SCATTER: ShareGrowthPoint[] = MARKET_SHARES.filter(
  (m) => m.yoyPct != null,
).map((m) => ({
  market: m.market,
  short: m.short,
  sharePct: m.share2025Pct,
  yoyPct: m.yoyPct as number,
  units: m.units2025,
  region: m.region,
  fill: m.fill,
}));

export function fmtUnits(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtSigned(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${fmtUnits(n)}`;
}
