/**
 * Migration & humanitarian burden — concentration / market-share lens (2026).
 * Core question: How concentrated is this system at the top of the distribution?
 * (Who bears migration and humanitarian costs vs narratives?)
 *
 * Complements migration-humanitarian-research-2026 (map of burdens) and the
 * update vintages (what moved) with a distribution cut: Top-1 / Top-3 / HHI
 * across FTS donors, refugee hosts, GHO appeal requirements, and income-group hosting.
 *
 * Primary anchors (disclosed roundings; see SOURCE_NOTE):
 * - OCHA FTS 2026 donor ranking (tracked funding shares)
 * - UNHCR Global Trends 2025 host stocks / LMIC shares (carried)
 * - OCHA GHO 2026 monitoring ask ($34.87B) + plan-level req geometry
 * - Prior August donor unpack: /blog/migration-humanitarian-update-202608
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Concentration lens on migration & humanitarian burden. FTS donor Top-1/Top-3/Top-10 shares: OCHA FTS 2026 ranking (US $2.83B = 23.1% of tracked funding; Top-3 ~44.7%). GHO requirements universe: Aug 2026 monitoring snapshot ($34.87B ask; $14.08B funded; 40.4% coverage). Host country stocks and LMIC/LDC shares carried from UNHCR Global Trends 2025 until Mid-Year Trends 2026. Plan-level requirement shares are estimated mixes against the GHO ask for geometry — not a single official HHI table. HHI values are analytical indexes on the stated bucket shares (0–10,000). Do not average donor cash shares with host people shares.";

export const PRIOR_RESEARCH_PATH = "/blog/migration-humanitarian-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/migration-humanitarian-update-2026";
export const PRIOR_Q3_PATH = "/blog/migration-humanitarian-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/migration-humanitarian-update-202608";
export const RELATED_HOST_PATH = "/blog/global-refugee-hosting-burden-2024";
export const RELATED_ODA_PATH = "/blog/oecd-dac-oda-first-drop-2024";

export const SOURCES = [
  {
    label: "OCHA FTS — 2026 donor ranking",
    url: "https://fts.unocha.org/home/2026/donors/view",
  },
  {
    label: "OCHA — GHO 2026 monitoring",
    url: "https://humanitarianaction.info/overview/2026",
  },
  {
    label: "UNHCR — Global Trends 2025",
    url: "https://www.unhcr.org/global-trends",
  },
  {
    label: "August donor unpack",
    url: PRIOR_AUG_PATH,
  },
  {
    label: "Hosting burden frame",
    url: RELATED_HOST_PATH,
  },
] as const;

export const HEADLINE = {
  /** FTS donor cash concentration */
  donorTop1Pct: 23.1,
  donorTop1Label: "United States",
  donorTop1Bn: 2.831,
  donorTop3Pct: 44.7,
  donorTop3Bn: 5.471,
  donorTop5Pct: 56.7,
  donorTop10Pct: 81.5,
  donorTrackedBn: 12.26,
  donorHhi: 1332,
  /** Refugee / OPNIIP host concentration (end-2025 vintage stocks) */
  hostTop1Pct: 6.6,
  hostTop1Label: "Colombia",
  hostTop1M: 2.8,
  hostTop3Pct: 18.5,
  hostTop3M: 7.9,
  hostTop5Pct: 27.0,
  hostUniverseM: 42.7,
  hostHhi: 612,
  /** GHO appeal requirement concentration */
  appealTop1Pct: 12.0,
  appealTop1Label: "Sudan / regional",
  appealTop1Bn: 4.2,
  appealTop3Pct: 28.9,
  appealTop3Bn: 10.1,
  appealUniverseBn: 34.87,
  appealHhi: 748,
  /** Income-group hosting (people stock) */
  incomeTop1Pct: 33,
  incomeTop1Label: "Upper-middle income",
  incomeTop3Pct: 80,
  incomeLmicPct: 68,
  incomeLdcPct: 26,
  incomeHhi: 2711,
  /** Context meters */
  ghoCoveragePct: 40.4,
  ghoGapBn: 20.79,
  displacedM: 117.8,
  unhcrEarlyPledgePct: 18,
} as const;

export type ShareRow = {
  id: string;
  label: string;
  short: string;
  value: number;
  unit: "bn" | "m" | "pct";
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** OCHA FTS 2026 donor ladder + residual of tracked funding. */
export const DONOR_SHARES: ShareRow[] = [
  {
    id: "us",
    label: "United States",
    short: "US",
    value: 2.831,
    unit: "bn",
    sharePct: 23.1,
    cumulativeSharePct: 23.1,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "ec",
    label: "European Commission",
    short: "EC",
    value: 1.75,
    unit: "bn",
    sharePct: 14.3,
    cumulativeSharePct: 37.4,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    id: "japan",
    label: "Japan",
    short: "Japan",
    value: 0.89,
    unit: "bn",
    sharePct: 7.3,
    cumulativeSharePct: 44.7,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    id: "germany",
    label: "Germany",
    short: "Germany",
    value: 0.774,
    unit: "bn",
    sharePct: 6.3,
    cumulativeSharePct: 51.0,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "sweden",
    label: "Sweden",
    short: "Sweden",
    value: 0.705,
    unit: "bn",
    sharePct: 5.7,
    cumulativeSharePct: 56.7,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    id: "norway",
    label: "Norway",
    short: "Norway",
    value: 0.702,
    unit: "bn",
    sharePct: 5.7,
    cumulativeSharePct: 62.4,
    confidence: "disclosed",
    fill: "#ec4899",
  },
  {
    id: "swiss",
    label: "Switzerland",
    short: "Swiss",
    value: 0.7,
    unit: "bn",
    sharePct: 5.7,
    cumulativeSharePct: 68.1,
    confidence: "disclosed",
    fill: "#6366f1",
  },
  {
    id: "canada",
    label: "Canada",
    short: "Canada",
    value: 0.617,
    unit: "bn",
    sharePct: 5.0,
    cumulativeSharePct: 73.1,
    confidence: "disclosed",
    fill: "#a78bfa",
  },
  {
    id: "uk",
    label: "United Kingdom",
    short: "UK",
    value: 0.599,
    unit: "bn",
    sharePct: 4.9,
    cumulativeSharePct: 78.0,
    confidence: "disclosed",
    fill: "#10b981",
  },
  {
    id: "denmark",
    label: "Denmark",
    short: "Denmark",
    value: 0.433,
    unit: "bn",
    sharePct: 3.5,
    cumulativeSharePct: 81.5,
    confidence: "disclosed",
    fill: "#64748b",
  },
  {
    id: "rest-donors",
    label: "All other tracked FTS donors",
    short: "Rest",
    value: 2.269,
    unit: "bn",
    sharePct: 18.5,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#94a3b8",
    note: "Closes $12.26B tracked after disclosed top-10",
  },
];

export const DONOR_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 23.1, equalPct: 9.1 },
  { rank: 2, label: "Top-2", sharePct: 37.4, equalPct: 18.2 },
  { rank: 3, label: "Top-3", sharePct: 44.7, equalPct: 27.3 },
  { rank: 5, label: "Top-5", sharePct: 56.7, equalPct: 45.5 },
  { rank: 10, label: "Top-10", sharePct: 81.5, equalPct: 90.9 },
  { rank: 11, label: "All", sharePct: 100, equalPct: 100 },
];

/** End-2025 host stocks (refugees + OPNIIP) vs ~42.7M host universe. */
export const HOST_SHARES: ShareRow[] = [
  {
    id: "colombia",
    label: "Colombia",
    short: "Colombia",
    value: 2.8,
    unit: "m",
    sharePct: 6.6,
    cumulativeSharePct: 6.6,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "Largest host; mostly Venezuelans",
  },
  {
    id: "germany",
    label: "Germany",
    short: "Germany",
    value: 2.7,
    unit: "m",
    sharePct: 6.3,
    cumulativeSharePct: 12.9,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    id: "turkiye",
    label: "Türkiye",
    short: "Türkiye",
    value: 2.4,
    unit: "m",
    sharePct: 5.6,
    cumulativeSharePct: 18.5,
    confidence: "disclosed",
    fill: "#f43f5e",
    note: "Syrian returns cut stock vs prior vintage",
  },
  {
    id: "uganda",
    label: "Uganda",
    short: "Uganda",
    value: 1.9,
    unit: "m",
    sharePct: 4.4,
    cumulativeSharePct: 22.9,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    id: "iran",
    label: "Iran",
    short: "Iran",
    value: 1.7,
    unit: "m",
    sharePct: 4.0,
    cumulativeSharePct: 26.9,
    confidence: "disclosed",
    fill: "#f59e0b",
    note: "Afghan returns / policy shock vs prior peak",
  },
  {
    id: "pakistan",
    label: "Pakistan",
    short: "Pakistan",
    value: 1.6,
    unit: "m",
    sharePct: 3.7,
    cumulativeSharePct: 30.6,
    confidence: "carried",
    fill: "#ec4899",
  },
  {
    id: "chad",
    label: "Chad",
    short: "Chad",
    value: 1.2,
    unit: "m",
    sharePct: 2.8,
    cumulativeSharePct: 33.4,
    confidence: "disclosed",
    fill: "#6366f1",
  },
  {
    id: "bangladesh",
    label: "Bangladesh",
    short: "Bangladesh",
    value: 1.1,
    unit: "m",
    sharePct: 2.6,
    cumulativeSharePct: 36.0,
    confidence: "carried",
    fill: "#a78bfa",
  },
  {
    id: "rest-hosts",
    label: "All other host countries",
    short: "Rest",
    value: 27.3,
    unit: "m",
    sharePct: 64.0,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#94a3b8",
    note: "Closes ~42.7M refugee/OPNIIP host universe",
  },
];

export const HOST_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 6.6, equalPct: 11.1 },
  { rank: 2, label: "Top-2", sharePct: 12.9, equalPct: 22.2 },
  { rank: 3, label: "Top-3", sharePct: 18.5, equalPct: 33.3 },
  { rank: 5, label: "Top-5", sharePct: 26.9, equalPct: 55.6 },
  { rank: 8, label: "Top-8", sharePct: 36.0, equalPct: 88.9 },
  { rank: 9, label: "All", sharePct: 100, equalPct: 100 },
];

/** GHO plan requirement shares vs $34.87B ask (estimated plan geometry). */
export const APPEAL_SHARES: ShareRow[] = [
  {
    id: "sudan",
    label: "Sudan / regional",
    short: "Sudan",
    value: 4.2,
    unit: "bn",
    sharePct: 12.0,
    cumulativeSharePct: 12.0,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "ukraine",
    label: "Ukraine / regional",
    short: "Ukraine",
    value: 3.1,
    unit: "bn",
    sharePct: 8.9,
    cumulativeSharePct: 20.9,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    id: "opt",
    label: "oPt / regional",
    short: "oPt",
    value: 2.8,
    unit: "bn",
    sharePct: 8.0,
    cumulativeSharePct: 28.9,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    id: "drc",
    label: "DRC / regional",
    short: "DRC",
    value: 2.6,
    unit: "bn",
    sharePct: 7.5,
    cumulativeSharePct: 36.4,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "syria",
    label: "Syria / regional",
    short: "Syria",
    value: 2.4,
    unit: "bn",
    sharePct: 6.9,
    cumulativeSharePct: 43.3,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "afghan",
    label: "Afghanistan",
    short: "Afghanistan",
    value: 2.1,
    unit: "bn",
    sharePct: 6.0,
    cumulativeSharePct: 49.3,
    confidence: "estimated",
    fill: "#ec4899",
  },
  {
    id: "sahel",
    label: "Sahel / multi",
    short: "Sahel",
    value: 1.8,
    unit: "bn",
    sharePct: 5.2,
    cumulativeSharePct: 54.5,
    confidence: "estimated",
    fill: "#6366f1",
  },
  {
    id: "horn",
    label: "Horn / multi",
    short: "Horn",
    value: 1.6,
    unit: "bn",
    sharePct: 4.6,
    cumulativeSharePct: 59.1,
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    id: "rest-appeals",
    label: "All other GHO plans / residual ask",
    short: "Rest",
    value: 14.27,
    unit: "bn",
    sharePct: 40.9,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#94a3b8",
    note: "Closes $34.87B GHO requirements",
  },
];

export const APPEAL_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 12.0, equalPct: 11.1 },
  { rank: 2, label: "Top-2", sharePct: 20.9, equalPct: 22.2 },
  { rank: 3, label: "Top-3", sharePct: 28.9, equalPct: 33.3 },
  { rank: 5, label: "Top-5", sharePct: 43.3, equalPct: 55.6 },
  { rank: 8, label: "Top-8", sharePct: 59.1, equalPct: 88.9 },
  { rank: 9, label: "All", sharePct: 100, equalPct: 100 },
];

/** Income-group hosting shares (carried GT 2025). */
export const INCOME_SHARES: ShareRow[] = [
  {
    id: "umi",
    label: "Upper-middle income hosts",
    short: "Upper-middle",
    value: 33,
    unit: "pct",
    sharePct: 33,
    cumulativeSharePct: 33,
    confidence: "carried",
    fill: "#0ea5e9",
  },
  {
    id: "hi",
    label: "High income hosts",
    short: "High",
    value: 29,
    unit: "pct",
    sharePct: 29,
    cumulativeSharePct: 62,
    confidence: "carried",
    fill: "#8b5cf6",
  },
  {
    id: "li",
    label: "Low income hosts",
    short: "Low",
    value: 18,
    unit: "pct",
    sharePct: 18,
    cumulativeSharePct: 80,
    confidence: "carried",
    fill: "#f43f5e",
  },
  {
    id: "lmi",
    label: "Lower-middle income hosts",
    short: "Lower-middle",
    value: 17,
    unit: "pct",
    sharePct: 17,
    cumulativeSharePct: 97,
    confidence: "carried",
    fill: "#14b8a6",
    note: "Rounding remainder treated as residual mix",
  },
  {
    id: "residual",
    label: "Rounding / other",
    short: "Other",
    value: 3,
    unit: "pct",
    sharePct: 3,
    cumulativeSharePct: 100,
    confidence: "estimated",
    fill: "#94a3b8",
  },
];

export const INCOME_CONCENTRATION_CURVE = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 33, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 62, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 80, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 97, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export type LensId = "donors" | "hosts" | "appeals" | "income";

export const LENS_COMPARE = [
  {
    lens: "donors" as LensId,
    label: "FTS donors (cash)",
    top1Pct: HEADLINE.donorTop1Pct,
    top3Pct: HEADLINE.donorTop3Pct,
    hhi: HEADLINE.donorHhi,
    top1Label: HEADLINE.donorTop1Label,
    unitNote: "Share of $12.26B tracked FTS",
    fill: "#0ea5e9",
  },
  {
    lens: "hosts" as LensId,
    label: "Refugee hosts (people)",
    top1Pct: HEADLINE.hostTop1Pct,
    top3Pct: HEADLINE.hostTop3Pct,
    hhi: HEADLINE.hostHhi,
    top1Label: HEADLINE.hostTop1Label,
    unitNote: "Share of ~42.7M host universe",
    fill: "#f43f5e",
  },
  {
    lens: "appeals" as LensId,
    label: "GHO appeal asks",
    top1Pct: HEADLINE.appealTop1Pct,
    top3Pct: HEADLINE.appealTop3Pct,
    hhi: HEADLINE.appealHhi,
    top1Label: HEADLINE.appealTop1Label,
    unitNote: "Share of $34.87B GHO requirements",
    fill: "#f59e0b",
  },
  {
    lens: "income" as LensId,
    label: "Host income groups",
    top1Pct: HEADLINE.incomeTop1Pct,
    top3Pct: HEADLINE.incomeTop3Pct,
    hhi: HEADLINE.incomeHhi,
    top1Label: HEADLINE.incomeTop1Label,
    unitNote: "Share of refugee host stock by income",
    fill: "#8b5cf6",
  },
];

/** Dual ledger: cash concentration vs people concentration. */
export const BURDEN_ASYMMETRY = [
  {
    id: "donor-top1",
    side: "Cash (donors)",
    meter: "FTS Top-1 share",
    value: 23.1,
    unit: "pct" as const,
    note: "US of tracked FTS",
    confidence: "disclosed" as Confidence,
    fill: "#0ea5e9",
  },
  {
    id: "donor-top3",
    side: "Cash (donors)",
    meter: "FTS Top-3 share",
    value: 44.7,
    unit: "pct" as const,
    note: "US + EC + Japan",
    confidence: "disclosed" as Confidence,
    fill: "#38bdf8",
  },
  {
    id: "host-top3",
    side: "People (hosts)",
    meter: "Host Top-3 share",
    value: 18.5,
    unit: "pct" as const,
    note: "Colombia + Germany + Türkiye",
    confidence: "disclosed" as Confidence,
    fill: "#f43f5e",
  },
  {
    id: "lmic",
    side: "People (hosts)",
    meter: "LMIC host share",
    value: 68,
    unit: "pct" as const,
    note: "Carried GT 2025",
    confidence: "carried" as Confidence,
    fill: "#fb7185",
  },
  {
    id: "coverage",
    side: "Narrative meter",
    meter: "GHO coverage",
    value: 40.4,
    unit: "pct" as const,
    note: "Aug FTS heal print",
    confidence: "disclosed" as Confidence,
    fill: "#94a3b8",
  },
  {
    id: "gap",
    side: "Narrative meter",
    meter: "GHO gap ($B)",
    value: 20.79,
    unit: "bn" as const,
    note: "Still open after heal",
    confidence: "disclosed" as Confidence,
    fill: "#64748b",
  },
];

/** Coverage vs need scatter for major plans (req share × coverage). */
export const PLAN_LEVERAGE = [
  {
    id: "sudan",
    short: "Sudan",
    reqSharePct: 12.0,
    coveragePct: 26.2,
    pinM: 30.4,
    fill: "#0ea5e9",
  },
  {
    id: "ukraine",
    short: "Ukraine",
    reqSharePct: 8.9,
    coveragePct: 50.0,
    pinM: 12.7,
    fill: "#8b5cf6",
  },
  {
    id: "opt",
    short: "oPt",
    reqSharePct: 8.0,
    coveragePct: 35.0,
    pinM: 3.3,
    fill: "#f43f5e",
  },
  {
    id: "drc",
    short: "DRC",
    reqSharePct: 7.5,
    coveragePct: 30.0,
    pinM: 21.2,
    fill: "#14b8a6",
  },
  {
    id: "syria",
    short: "Syria",
    reqSharePct: 6.9,
    coveragePct: 30.0,
    pinM: 16.7,
    fill: "#f59e0b",
  },
  {
    id: "afghan",
    short: "Afghanistan",
    reqSharePct: 6.0,
    coveragePct: 30.0,
    pinM: 22.9,
    fill: "#ec4899",
  },
  {
    id: "sahel",
    short: "Sahel",
    reqSharePct: 5.2,
    coveragePct: 25.0,
    pinM: 14.1,
    fill: "#6366f1",
  },
  {
    id: "horn",
    short: "Horn",
    reqSharePct: 4.6,
    coveragePct: 35.0,
    pinM: 18.5,
    fill: "#a78bfa",
  },
];

/** Host vs donor role scatter (people hosted vs FTS/UNHCR cash where known). */
export const ROLE_SCATTER = [
  {
    id: "colombia",
    short: "Colombia",
    hostedM: 2.8,
    donorSharePct: 0.2,
    role: "host-only" as const,
    fill: "#f43f5e",
  },
  {
    id: "germany",
    short: "Germany",
    hostedM: 2.7,
    donorSharePct: 6.3,
    role: "both" as const,
    fill: "#8b5cf6",
  },
  {
    id: "turkiye",
    short: "Türkiye",
    hostedM: 2.4,
    donorSharePct: 0.3,
    role: "host-heavy" as const,
    fill: "#f59e0b",
  },
  {
    id: "uganda",
    short: "Uganda",
    hostedM: 1.9,
    donorSharePct: 0.1,
    role: "host-only" as const,
    fill: "#14b8a6",
  },
  {
    id: "us",
    short: "US",
    hostedM: 0.44,
    donorSharePct: 23.1,
    role: "donor-heavy" as const,
    fill: "#0ea5e9",
  },
  {
    id: "japan",
    short: "Japan",
    hostedM: 0.02,
    donorSharePct: 7.3,
    role: "donor-heavy" as const,
    fill: "#6366f1",
  },
  {
    id: "sweden",
    short: "Sweden",
    hostedM: 0.28,
    donorSharePct: 5.7,
    role: "donor-heavy" as const,
    fill: "#ec4899",
  },
  {
    id: "ec",
    short: "EC",
    hostedM: 0,
    donorSharePct: 14.3,
    role: "donor-heavy" as const,
    fill: "#a78bfa",
  },
];

export const HHI_BANDS = [
  { band: "Unconcentrated", max: 1500, fill: "#94a3b8" },
  { band: "Moderate", max: 2500, fill: "#f59e0b" },
  { band: "High", max: 10000, fill: "#f43f5e" },
];

export function sharesForLens(lens: LensId): ShareRow[] {
  switch (lens) {
    case "donors":
      return DONOR_SHARES;
    case "hosts":
      return HOST_SHARES;
    case "appeals":
      return APPEAL_SHARES;
    case "income":
      return INCOME_SHARES;
  }
}

export function curveForLens(lens: LensId) {
  switch (lens) {
    case "donors":
      return DONOR_CONCENTRATION_CURVE;
    case "hosts":
      return HOST_CONCENTRATION_CURVE;
    case "appeals":
      return APPEAL_CONCENTRATION_CURVE;
    case "income":
      return INCOME_CONCENTRATION_CURVE;
  }
}

export function hhiBand(hhi: number): (typeof HHI_BANDS)[number] {
  return HHI_BANDS.find((b) => hhi <= b.max) ?? HHI_BANDS[HHI_BANDS.length - 1];
}

export function fmtBn(n: number, digits = 2): string {
  if (n >= 1) return `$${n.toFixed(digits)}B`;
  return `$${(n * 1000).toFixed(0)}M`;
}

export function fmtM(n: number, digits = 1): string {
  return `${n.toFixed(digits)}M`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}
