/**
 * Industrial robotics concentration — August 202608 vintage.
 * Core question: How concentrated is physical automation at the top of the
 * distribution — and did A3’s Aug-2026 NA order book loosen the tip while
 * IFR’s install ladder stayed China-heavy?
 *
 * Dual ledger:
 * - IFR world *installs* (2025 prelim held from Q3 concentration) — Top-1 / Top-3
 * - A3 North American *orders* (Q2/H1 2026, ~11 Aug 2026) — industry / cobot mix
 *
 * Complements:
 * - /blog/industrial-robotics-concentration-2026q3 (install Top-1·Top-3·HHI)
 * - /blog/industrial-robotics-update-202608 (A3 order book levels / YoY)
 * - /blog/industrial-robotics-concentration-2026 (2024 WR ladder)
 */

export type Confidence = "disclosed" | "estimated" | "derived";

export const SOURCE_NOTE =
  "Aug 202608 dual-ledger concentration: IFR world install Top-1/Top-3/HHI held from Q3 concentration (621k prelim, Asia 79%, China ~10× US narrative). A3 North American robot *orders* (US/Canada/Mexico member vendors) Q2 & H1 2026 released ~11 Aug 2026 overlay industry and cobot mix — orders ≠ installations. Binding tip score = install Top-1 × stress weight (analytical). Final WR 2026 country table still due 24 Sep 2026.";

export const A3_Q2_URL =
  "https://www.automate.org/robotics/news/robot-orders-increase-in-q2-as-automation-demand-broadens-across-industries";
export const IFR_US_URL =
  "https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth";
export const IFR_ROUNDTABLE_URL =
  "https://ifr.org/downloads/press_docs/2026_06_24_IFR_Executive_Roundtable_market_presentation.pdf";
export const Q3_CONC_PATH = "/blog/industrial-robotics-concentration-2026q3";
export const PRIOR_CONC_PATH = "/blog/industrial-robotics-concentration-2026";
export const AUG_UPDATE_PATH = "/blog/industrial-robotics-update-202608";
export const Q3_UPDATE_PATH = "/blog/industrial-robotics-update-2026q3";
export const RESEARCH_PATH = "/blog/industrial-robotics-research-2026";
export const DENSITY_PATH = "/blog/manufacturing-robot-density-ifr-2024";

export const SOURCES = [
  {
    label: "A3 — Robot orders rise in Q2 2026 (Aug 2026)",
    url: A3_Q2_URL,
  },
  {
    label: "IFR — US robot industry returns to double-digit growth (Jun 2026)",
    url: IFR_US_URL,
  },
  {
    label: "Q3 concentration companion — install Top-1 / Top-3",
    url: Q3_CONC_PATH,
  },
  {
    label: "August A3 order-book update",
    url: AUG_UPDATE_PATH,
  },
  {
    label: "Prior concentration — 2024 WR ladder",
    url: PRIOR_CONC_PATH,
  },
] as const;

export const WORLD_UNITS_2024 = 542_076;
export const WORLD_UNITS_2025 = 621_000;

/** Headline dual-ledger scoreboard */
export const HEADLINE = {
  /** IFR install tip (held) */
  worldUnits2025: WORLD_UNITS_2025,
  worldYoyPct: 15,
  top1Share2024Pct: 54,
  top1Share2025Pct: 61.2,
  top1Label: "China",
  top1Units2025: 380_000,
  top3Share2024Pct: 69,
  top3Share2025Pct: 74.2,
  top3Labels: "China + Japan + US",
  top5Share2025Pct: 82.9,
  asiaShare2025Pct: 79,
  marketHhi2024: 3120,
  marketHhi2025: 4161,
  top1DeltaVsWorldPct: 108,
  usUnits2025: 38_000,
  usShare2025Pct: 6.1,
  /** A3 NA order tip (Aug overlay) */
  naNonAutoShareQ2Pct: 56,
  naAutoShareQ2Pct: 44,
  naQ2Units: 8_940,
  naQ2ValueM: 622,
  naQ2UnitsYoyPct: 4.3,
  naQ2ValueYoyPct: 21.3,
  naSemiElectroQ2YoyPct: 38,
  naAutoOemH1YoyPct: -25,
  naAutoCompH1YoyPct: 24,
  cobotQ2UnitSharePct: 12.7,
  cobotH1UnitSharePct: 15.4,
  cobotFy2025UnitSharePct: 19.6,
  /** Analytical: install tip still extreme; NA order tip mid */
  installBindingScore: 82.6,
  naOrderBindingScore: 44.0,
  finalReportDate: "2026-09-24",
  a3Released: "2026-08-11",
  prelimAsOf: "2026-04",
} as const;

export type LedgerKey = "install" | "na-orders";
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

/** Ranked IFR install markets — held from Q3 concentration */
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
    share2024Pct: 80,
    share2025Pct: HEADLINE.top5Share2025Pct,
    note: "+ KR + DE",
  },
];

/** Dual-ledger tip comparison for Aug overlay */
export const DUAL_LEDGER_TIPS = [
  {
    id: "install-top1",
    ledger: "IFR installs",
    metric: "Top-1 share",
    valuePct: HEADLINE.top1Share2025Pct,
    label: "China",
    fill: "#f43f5e",
    confidence: "estimated" as Confidence,
  },
  {
    id: "install-top3",
    ledger: "IFR installs",
    metric: "Top-3 share",
    valuePct: HEADLINE.top3Share2025Pct,
    label: "CN+JP+US",
    fill: "#fb7185",
    confidence: "estimated" as Confidence,
  },
  {
    id: "na-auto",
    ledger: "A3 NA orders",
    metric: "Auto bloc Q2",
    valuePct: HEADLINE.naAutoShareQ2Pct,
    label: "OEM + component",
    fill: "#0ea5e9",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "na-nonauto",
    ledger: "A3 NA orders",
    metric: "Non-auto Q2",
    valuePct: HEADLINE.naNonAutoShareQ2Pct,
    label: "General + tech",
    fill: "#14b8a6",
    confidence: "disclosed" as Confidence,
  },
];

export type RegionShare = {
  region: string;
  short: string;
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
    share2024Pct: 74,
    share2025Pct: 79,
    yoyPct: 22,
    fill: "#f59e0b",
    confidence: "disclosed",
  },
  {
    region: "Europe",
    short: "Europe",
    share2024Pct: 16,
    share2025Pct: 13,
    yoyPct: -5,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    region: "Americas",
    short: "Americas",
    share2024Pct: 9,
    share2025Pct: 9,
    yoyPct: 12,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
];

/** Multi-year install tip path + Aug NA non-auto overlay point */
export const CONCENTRATION_PATH = [
  {
    year: "2022",
    top1Pct: 52,
    top3Pct: 68,
    asiaPct: 73,
    naNonAutoPct: null as number | null,
    confidence: "estimated" as Confidence,
  },
  {
    year: "2023",
    top1Pct: 51,
    top3Pct: 67,
    asiaPct: 70,
    naNonAutoPct: null as number | null,
    confidence: "estimated" as Confidence,
  },
  {
    year: "2024",
    top1Pct: 54,
    top3Pct: 69,
    asiaPct: 74,
    naNonAutoPct: null as number | null,
    confidence: "disclosed" as Confidence,
  },
  {
    year: "2025p",
    top1Pct: 61.2,
    top3Pct: 74.2,
    asiaPct: 79,
    naNonAutoPct: null as number | null,
    confidence: "estimated" as Confidence,
  },
  {
    year: "2026Q2",
    top1Pct: 61.2,
    top3Pct: 74.2,
    asiaPct: 79,
    naNonAutoPct: 56,
    confidence: "derived" as Confidence,
  },
];

export type NaIndustryYoy = {
  industry: string;
  short: string;
  group: "auto" | "general" | "tech";
  q2YoyPct: number | null;
  h1YoyPct: number | null;
  /** Analytical share weight for stacked view (disclosed only for auto/non-auto bloc) */
  blocShareQ2Pct: number | null;
  fill: string;
  confidence: Confidence;
};

export const NA_INDUSTRY_YOY: NaIndustryYoy[] = [
  {
    industry: "Automotive OEM",
    short: "Auto OEM",
    group: "auto",
    q2YoyPct: null,
    h1YoyPct: -25,
    blocShareQ2Pct: null,
    fill: "#f43f5e",
    confidence: "disclosed",
  },
  {
    industry: "Automotive component",
    short: "Auto comp.",
    group: "auto",
    q2YoyPct: 20,
    h1YoyPct: 24,
    blocShareQ2Pct: null,
    fill: "#fb7185",
    confidence: "disclosed",
  },
  {
    industry: "Semi & electronics",
    short: "Semi/electro",
    group: "tech",
    q2YoyPct: 38,
    h1YoyPct: 35,
    blocShareQ2Pct: null,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    industry: "Life sciences",
    short: "Life sci.",
    group: "tech",
    q2YoyPct: 9,
    h1YoyPct: 32,
    blocShareQ2Pct: null,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    industry: "Food & consumer goods",
    short: "Food/CG",
    group: "general",
    q2YoyPct: 18,
    h1YoyPct: 17,
    blocShareQ2Pct: null,
    fill: "#14b8a6",
    confidence: "disclosed",
  },
  {
    industry: "Metals",
    short: "Metals",
    group: "general",
    q2YoyPct: 18,
    h1YoyPct: null,
    blocShareQ2Pct: null,
    fill: "#f59e0b",
    confidence: "disclosed",
  },
];

export const NA_BLOC_SHARES = [
  {
    id: "non-auto",
    label: "Non-automotive",
    sharePct: 56,
    fill: "#14b8a6",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "auto",
    label: "Automotive (OEM + component)",
    sharePct: 44,
    fill: "#0ea5e9",
    confidence: "disclosed" as Confidence,
  },
];

export type CobotPoint = {
  period: string;
  unitSharePct: number;
  valueSharePct: number;
  units: number;
  fill: string;
  confidence: Confidence;
};

export const COBOT_PATH: CobotPoint[] = [
  {
    period: "FY25",
    unitSharePct: 19.6,
    valueSharePct: 10.7,
    units: 7_212,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    period: "H1'26",
    unitSharePct: 15.4,
    valueSharePct: 9.8,
    units: 2_774,
    fill: "#a78bfa",
    confidence: "disclosed",
  },
  {
    period: "Q2'26",
    unitSharePct: 12.7,
    valueSharePct: 7.1,
    units: 1_137,
    fill: "#c4b5fd",
    confidence: "disclosed",
  },
];

/** Share × growth scatter on IFR markets (held) */
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

/** Binding tip meters — analytical, not a disclosed index */
export const BINDING_METERS = [
  {
    id: "install",
    label: "IFR install tip",
    score: HEADLINE.installBindingScore,
    topSharePct: HEADLINE.top1Share2025Pct,
    note: "Top-1 × high stress (China volume gravity)",
    fill: "#f43f5e",
  },
  {
    id: "na-orders",
    label: "A3 NA order tip",
    score: HEADLINE.naOrderBindingScore,
    topSharePct: HEADLINE.naAutoShareQ2Pct,
    note: "Auto bloc share × mid stress (broadening book)",
    fill: "#0ea5e9",
  },
];

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
