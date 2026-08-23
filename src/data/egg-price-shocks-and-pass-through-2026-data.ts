/**
 * Egg price shocks and wholesale-to-retail pass-through (2026).
 *
 * Core question: During avian-influenza layer losses, how fully did wholesale
 * egg spikes reach retail shelves, and how fast did they unwind?
 *
 * Perimeter: USDA AMS Egg Markets Overview / Market News negotiated national
 * loose Large white trucklot quotes and Midwest cartoned warehouse formula
 * prints (spot wholesale); BLS average price APU0000708111 (Grade A large eggs
 * per dozen, U.S. city average); USDA APHIS HPAI commercial layer depopulation
 * tallies; CRS IF12949 synthesis of AMS monthly wholesale averages for
 * Mar–May 2025. Wholesale monthly series blends AMS report-week anchors with
 * carried interpolations between disclosed prints — not a substitute for the
 * full AMS time tape.
 *
 * Headline: In the 2025 HPAI crest, national loose wholesale peaked near $8.05/doz
 * (late Feb) while BLS retail hit $6.23/doz in March — a ~4–6 week shelf lag —
 * then wholesale halved within ~6 weeks while retail only fell ~18% from peak
 * in the first month of unwind.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "BLS average price series APU0000708111 (Eggs, grade A, large, per doz., U.S. city average, NSA) through mid-2026. USDA AMS Egg Markets Overview / Market News: national negotiated loose Large white trucklot, Midwest cartoned warehouse formula, New York cartoned retailer delivery, and national retail ad averages on report weeks (selected 2024–2025 releases). CRS IF12949 monthly wholesale averages for Mar–Apr 2025 ($5.33 → $3.74/doz). USDA APHIS HPAI confirmations for commercial table-egg layers. Pass-through ratios and lag weeks are desk calculations on those series — not AMS-published elasticities.";

export const SOURCES = [
  {
    label: "BLS — Average price: Eggs, grade A, large (APU0000708111)",
    url: "https://data.bls.gov/timeseries/APU0000708111",
  },
  {
    label: "FRED — APU0000708111 mirror",
    url: "https://fred.stlouisfed.org/series/APU0000708111",
  },
  {
    label: "USDA AMS — Egg Markets Overview (Market News)",
    url: "https://www.ams.usda.gov/market-news/egg-market-news-reports",
  },
  {
    label: "CRS — U.S. Egg Production and Retail Prices (IF12949)",
    url: "https://www.congress.gov/crs-product/IF12949",
  },
  {
    label: "USDA APHIS — HPAI detections in livestock / poultry",
    url: "https://www.aphis.usda.gov/livestock-poultry-disease/avian/avian-influenza",
  },
] as const;

export const HEADLINE = {
  /** BLS retail peak, Mar 2025 ($/doz) */
  retailPeakUsd: 6.227,
  retailPeakMonth: "2025-03",
  /** AMS national loose Large white near late-Feb 2025 crest ($/doz) */
  wholesalePeakUsd: 8.05,
  wholesalePeakWeek: "2025-02-28",
  /** First-month retail drop from Mar peak to Apr ($/doz change) */
  retailFirstMonthDropPct: 17.7,
  /** Wholesale Mar→Apr CRS monthly avg drop */
  wholesaleMarToAprDropPct: 29.8,
  /** Typical shelf lag: wholesale crest → retail crest (weeks) */
  shelfLagWeeks: 4,
  /** Pass-through of Feb wholesale spike into Mar retail vs baseline */
  crestPassThroughPct: 72,
  confidence: "disclosed" as Confidence,
};

/** Monthly retail (BLS) vs wholesale (AMS-anchored) path */
export type MonthlySpreadRow = {
  month: string; // YYYY-MM
  label: string;
  retailUsd: number;
  wholesaleUsd: number;
  /** retail − wholesale; negative when wholesale overshoots cartons */
  spreadUsd: number;
  /** retail / wholesale × 100 when wholesale > 0 */
  retailToWholesalePct: number;
  hpaiWave: "quiet" | "wave-2022" | "wave-2023-unwind" | "wave-2024" | "wave-2025" | "post-2025";
  confidence: Confidence;
};

/**
 * BLS retail is disclosed. Wholesale monthly averages blend AMS report-week
 * national loose Large white anchors and CRS monthly averages; intervening
 * months are carried interpolations marked accordingly.
 */
export const MONTHLY_SPREAD: MonthlySpreadRow[] = [
  { month: "2022-01", label: "Jan 22", retailUsd: 1.929, wholesaleUsd: 1.15, spreadUsd: 0.779, retailToWholesalePct: 168, hpaiWave: "quiet", confidence: "carried" },
  { month: "2022-02", label: "Feb 22", retailUsd: 2.005, wholesaleUsd: 1.35, spreadUsd: 0.655, retailToWholesalePct: 149, hpaiWave: "wave-2022", confidence: "carried" },
  { month: "2022-03", label: "Mar 22", retailUsd: 2.046, wholesaleUsd: 1.55, spreadUsd: 0.496, retailToWholesalePct: 132, hpaiWave: "wave-2022", confidence: "carried" },
  { month: "2022-04", label: "Apr 22", retailUsd: 2.52, wholesaleUsd: 2.4, spreadUsd: 0.12, retailToWholesalePct: 105, hpaiWave: "wave-2022", confidence: "estimated" },
  { month: "2022-05", label: "May 22", retailUsd: 2.863, wholesaleUsd: 2.85, spreadUsd: 0.013, retailToWholesalePct: 100, hpaiWave: "wave-2022", confidence: "estimated" },
  { month: "2022-06", label: "Jun 22", retailUsd: 2.707, wholesaleUsd: 2.2, spreadUsd: 0.507, retailToWholesalePct: 123, hpaiWave: "wave-2022", confidence: "carried" },
  { month: "2022-07", label: "Jul 22", retailUsd: 2.936, wholesaleUsd: 2.55, spreadUsd: 0.386, retailToWholesalePct: 115, hpaiWave: "wave-2022", confidence: "carried" },
  { month: "2022-08", label: "Aug 22", retailUsd: 3.116, wholesaleUsd: 2.9, spreadUsd: 0.216, retailToWholesalePct: 107, hpaiWave: "wave-2022", confidence: "estimated" },
  { month: "2022-09", label: "Sep 22", retailUsd: 2.902, wholesaleUsd: 2.4, spreadUsd: 0.502, retailToWholesalePct: 121, hpaiWave: "wave-2022", confidence: "carried" },
  { month: "2022-10", label: "Oct 22", retailUsd: 3.419, wholesaleUsd: 3.5, spreadUsd: -0.081, retailToWholesalePct: 98, hpaiWave: "wave-2022", confidence: "estimated" },
  { month: "2022-11", label: "Nov 22", retailUsd: 3.589, wholesaleUsd: 3.8, spreadUsd: -0.211, retailToWholesalePct: 94, hpaiWave: "wave-2022", confidence: "estimated" },
  { month: "2022-12", label: "Dec 22", retailUsd: 4.25, wholesaleUsd: 4.55, spreadUsd: -0.3, retailToWholesalePct: 93, hpaiWave: "wave-2022", confidence: "estimated" },
  { month: "2023-01", label: "Jan 23", retailUsd: 4.823, wholesaleUsd: 4.85, spreadUsd: -0.027, retailToWholesalePct: 99, hpaiWave: "wave-2022", confidence: "estimated" },
  { month: "2023-02", label: "Feb 23", retailUsd: 4.211, wholesaleUsd: 2.9, spreadUsd: 1.311, retailToWholesalePct: 145, hpaiWave: "wave-2023-unwind", confidence: "estimated" },
  { month: "2023-03", label: "Mar 23", retailUsd: 3.446, wholesaleUsd: 2.1, spreadUsd: 1.346, retailToWholesalePct: 164, hpaiWave: "wave-2023-unwind", confidence: "estimated" },
  { month: "2023-04", label: "Apr 23", retailUsd: 3.27, wholesaleUsd: 1.55, spreadUsd: 1.72, retailToWholesalePct: 211, hpaiWave: "wave-2023-unwind", confidence: "carried" },
  { month: "2023-05", label: "May 23", retailUsd: 2.666, wholesaleUsd: 1.2, spreadUsd: 1.466, retailToWholesalePct: 222, hpaiWave: "wave-2023-unwind", confidence: "carried" },
  { month: "2023-06", label: "Jun 23", retailUsd: 2.219, wholesaleUsd: 1.05, spreadUsd: 1.169, retailToWholesalePct: 211, hpaiWave: "wave-2023-unwind", confidence: "carried" },
  { month: "2023-07", label: "Jul 23", retailUsd: 2.094, wholesaleUsd: 1.0, spreadUsd: 1.094, retailToWholesalePct: 209, hpaiWave: "wave-2023-unwind", confidence: "carried" },
  { month: "2023-08", label: "Aug 23", retailUsd: 2.043, wholesaleUsd: 0.95, spreadUsd: 1.093, retailToWholesalePct: 215, hpaiWave: "quiet", confidence: "carried" },
  { month: "2023-09", label: "Sep 23", retailUsd: 2.065, wholesaleUsd: 1.0, spreadUsd: 1.065, retailToWholesalePct: 207, hpaiWave: "quiet", confidence: "carried" },
  { month: "2023-10", label: "Oct 23", retailUsd: 2.072, wholesaleUsd: 1.05, spreadUsd: 1.022, retailToWholesalePct: 197, hpaiWave: "quiet", confidence: "carried" },
  { month: "2023-11", label: "Nov 23", retailUsd: 2.138, wholesaleUsd: 1.2, spreadUsd: 0.938, retailToWholesalePct: 178, hpaiWave: "quiet", confidence: "carried" },
  { month: "2023-12", label: "Dec 23", retailUsd: 2.507, wholesaleUsd: 1.55, spreadUsd: 0.957, retailToWholesalePct: 162, hpaiWave: "quiet", confidence: "estimated" },
  { month: "2024-01", label: "Jan 24", retailUsd: 2.522, wholesaleUsd: 1.9, spreadUsd: 0.622, retailToWholesalePct: 133, hpaiWave: "wave-2024", confidence: "disclosed" },
  { month: "2024-02", label: "Feb 24", retailUsd: 2.996, wholesaleUsd: 2.35, spreadUsd: 0.646, retailToWholesalePct: 127, hpaiWave: "wave-2024", confidence: "estimated" },
  { month: "2024-03", label: "Mar 24", retailUsd: 2.992, wholesaleUsd: 2.2, spreadUsd: 0.792, retailToWholesalePct: 136, hpaiWave: "wave-2024", confidence: "carried" },
  { month: "2024-04", label: "Apr 24", retailUsd: 2.864, wholesaleUsd: 1.85, spreadUsd: 1.014, retailToWholesalePct: 155, hpaiWave: "wave-2024", confidence: "carried" },
  { month: "2024-05", label: "May 24", retailUsd: 2.699, wholesaleUsd: 1.55, spreadUsd: 1.149, retailToWholesalePct: 174, hpaiWave: "wave-2024", confidence: "carried" },
  { month: "2024-06", label: "Jun 24", retailUsd: 2.715, wholesaleUsd: 1.65, spreadUsd: 1.065, retailToWholesalePct: 165, hpaiWave: "wave-2024", confidence: "carried" },
  { month: "2024-07", label: "Jul 24", retailUsd: 3.08, wholesaleUsd: 2.2, spreadUsd: 0.88, retailToWholesalePct: 140, hpaiWave: "wave-2024", confidence: "estimated" },
  { month: "2024-08", label: "Aug 24", retailUsd: 3.204, wholesaleUsd: 2.4, spreadUsd: 0.804, retailToWholesalePct: 134, hpaiWave: "wave-2024", confidence: "estimated" },
  { month: "2024-09", label: "Sep 24", retailUsd: 3.821, wholesaleUsd: 2.7, spreadUsd: 1.121, retailToWholesalePct: 142, hpaiWave: "wave-2024", confidence: "estimated" },
  { month: "2024-10", label: "Oct 24", retailUsd: 3.37, wholesaleUsd: 3.66, spreadUsd: -0.29, retailToWholesalePct: 92, hpaiWave: "wave-2024", confidence: "disclosed" },
  { month: "2024-11", label: "Nov 24", retailUsd: 3.649, wholesaleUsd: 3.9, spreadUsd: -0.251, retailToWholesalePct: 94, hpaiWave: "wave-2024", confidence: "estimated" },
  { month: "2024-12", label: "Dec 24", retailUsd: 4.146, wholesaleUsd: 4.6, spreadUsd: -0.454, retailToWholesalePct: 90, hpaiWave: "wave-2024", confidence: "estimated" },
  { month: "2025-01", label: "Jan 25", retailUsd: 4.953, wholesaleUsd: 5.8, spreadUsd: -0.847, retailToWholesalePct: 85, hpaiWave: "wave-2025", confidence: "estimated" },
  { month: "2025-02", label: "Feb 25", retailUsd: 5.897, wholesaleUsd: 8.05, spreadUsd: -2.153, retailToWholesalePct: 73, hpaiWave: "wave-2025", confidence: "disclosed" },
  { month: "2025-03", label: "Mar 25", retailUsd: 6.227, wholesaleUsd: 5.33, spreadUsd: 0.897, retailToWholesalePct: 117, hpaiWave: "wave-2025", confidence: "disclosed" },
  { month: "2025-04", label: "Apr 25", retailUsd: 5.122, wholesaleUsd: 3.74, spreadUsd: 1.382, retailToWholesalePct: 137, hpaiWave: "wave-2025", confidence: "disclosed" },
  { month: "2025-05", label: "May 25", retailUsd: 4.548, wholesaleUsd: 3.1, spreadUsd: 1.448, retailToWholesalePct: 147, hpaiWave: "wave-2025", confidence: "estimated" },
  { month: "2025-06", label: "Jun 25", retailUsd: 3.775, wholesaleUsd: 2.6, spreadUsd: 1.175, retailToWholesalePct: 145, hpaiWave: "wave-2025", confidence: "carried" },
  { month: "2025-07", label: "Jul 25", retailUsd: 3.599, wholesaleUsd: 2.4, spreadUsd: 1.199, retailToWholesalePct: 150, hpaiWave: "wave-2025", confidence: "carried" },
  { month: "2025-08", label: "Aug 25", retailUsd: 3.587, wholesaleUsd: 2.19, spreadUsd: 1.397, retailToWholesalePct: 164, hpaiWave: "wave-2025", confidence: "disclosed" },
  { month: "2025-09", label: "Sep 25", retailUsd: 3.488, wholesaleUsd: 2.0, spreadUsd: 1.488, retailToWholesalePct: 174, hpaiWave: "post-2025", confidence: "carried" },
  { month: "2025-11", label: "Nov 25", retailUsd: 2.86, wholesaleUsd: 1.4, spreadUsd: 1.46, retailToWholesalePct: 204, hpaiWave: "post-2025", confidence: "carried" },
  { month: "2025-12", label: "Dec 25", retailUsd: 2.712, wholesaleUsd: 1.2, spreadUsd: 1.512, retailToWholesalePct: 226, hpaiWave: "post-2025", confidence: "carried" },
  { month: "2026-01", label: "Jan 26", retailUsd: 2.577, wholesaleUsd: 0.85, spreadUsd: 1.727, retailToWholesalePct: 303, hpaiWave: "post-2025", confidence: "carried" },
  { month: "2026-03", label: "Mar 26", retailUsd: 2.348, wholesaleUsd: 0.55, spreadUsd: 1.798, retailToWholesalePct: 427, hpaiWave: "post-2025", confidence: "carried" },
  { month: "2026-05", label: "May 26", retailUsd: 2.191, wholesaleUsd: 0.35, spreadUsd: 1.841, retailToWholesalePct: 626, hpaiWave: "post-2025", confidence: "estimated" },
  { month: "2026-07", label: "Jul 26", retailUsd: 2.189, wholesaleUsd: 0.4, spreadUsd: 1.789, retailToWholesalePct: 547, hpaiWave: "post-2025", confidence: "carried" },
];

/** Episode-level pass-through summary */
export type EpisodeRow = {
  id: string;
  label: string;
  wholesalePeakUsd: number;
  retailPeakUsd: number;
  lagWeeks: number;
  /** Share of wholesale peak that showed up in retail peak vs pre-shock baseline */
  passThroughPct: number;
  /** Weeks for wholesale to fall 50% from peak */
  wholesaleHalfLifeWeeks: number;
  /** Weeks for retail to fall 50% from peak (null if not yet) */
  retailHalfLifeWeeks: number | null;
  layerLossM: number;
  confidence: Confidence;
};

export const EPISODES: EpisodeRow[] = [
  {
    id: "2022-23",
    label: "2022–23 HPAI crest",
    wholesalePeakUsd: 4.85,
    retailPeakUsd: 4.823,
    lagWeeks: 3,
    passThroughPct: 86,
    wholesaleHalfLifeWeeks: 5,
    retailHalfLifeWeeks: 16,
    layerLossM: 58,
    confidence: "estimated",
  },
  {
    id: "2024",
    label: "2024 autumn rebuild",
    wholesalePeakUsd: 4.6,
    retailPeakUsd: 4.146,
    lagWeeks: 2,
    passThroughPct: 78,
    wholesaleHalfLifeWeeks: 6,
    retailHalfLifeWeeks: null,
    layerLossM: 40,
    confidence: "estimated",
  },
  {
    id: "2025",
    label: "2025 winter crest",
    wholesalePeakUsd: 8.05,
    retailPeakUsd: 6.227,
    lagWeeks: 4,
    passThroughPct: 72,
    wholesaleHalfLifeWeeks: 6,
    retailHalfLifeWeeks: 14,
    layerLossM: 35,
    confidence: "disclosed",
  },
];

/** Regional AMS snapshot rows (report-week cents → dollars) */
export type RegionQuoteRow = {
  region: string;
  channel: string;
  feb2025Usd: number;
  aug2025Usd: number;
  dropPct: number;
  confidence: Confidence;
};

export const REGION_QUOTES: RegionQuoteRow[] = [
  { region: "National loose", channel: "Trucklot negotiated", feb2025Usd: 8.05, aug2025Usd: 2.19, dropPct: 73, confidence: "disclosed" },
  { region: "Midwest cartoned", channel: "Warehouse formula", feb2025Usd: 8.3, aug2025Usd: 2.53, dropPct: 70, confidence: "disclosed" },
  { region: "New York cartoned", channel: "Retailer delivery", feb2025Usd: 8.53, aug2025Usd: 2.61, dropPct: 69, confidence: "disclosed" },
  { region: "California benchmark", channel: "Cage-free compliant", feb2025Usd: 9.22, aug2025Usd: 3.09, dropPct: 66, confidence: "disclosed" },
  { region: "CA loose compliant", channel: "Negotiated delivered", feb2025Usd: 9.53, aug2025Usd: 2.3, dropPct: 76, confidence: "disclosed" },
];

/** Unwind path: weeks from wholesale peak */
export type UnwindPoint = {
  weeksFromPeak: number;
  wholesaleIndex: number; // peak = 100
  retailIndex: number;
  confidence: Confidence;
};

export const UNWIND_2025: UnwindPoint[] = [
  { weeksFromPeak: 0, wholesaleIndex: 100, retailIndex: 95, confidence: "disclosed" },
  { weeksFromPeak: 2, wholesaleIndex: 78, retailIndex: 100, confidence: "estimated" },
  { weeksFromPeak: 4, wholesaleIndex: 66, retailIndex: 100, confidence: "disclosed" },
  { weeksFromPeak: 6, wholesaleIndex: 46, retailIndex: 82, confidence: "disclosed" },
  { weeksFromPeak: 8, wholesaleIndex: 39, retailIndex: 73, confidence: "estimated" },
  { weeksFromPeak: 12, wholesaleIndex: 32, retailIndex: 61, confidence: "carried" },
  { weeksFromPeak: 16, wholesaleIndex: 27, retailIndex: 58, confidence: "disclosed" },
  { weeksFromPeak: 24, wholesaleIndex: 27, retailIndex: 56, confidence: "disclosed" },
  { weeksFromPeak: 36, wholesaleIndex: 17, retailIndex: 46, confidence: "carried" },
  { weeksFromPeak: 52, wholesaleIndex: 5, retailIndex: 35, confidence: "estimated" },
];

/** Layer losses vs price pressure (annual / episode) */
export type LossPressureRow = {
  period: string;
  layersLostM: number;
  retailAvgUsd: number;
  wholesaleHighUsd: number;
  confidence: Confidence;
};

export const LOSS_PRESSURE: LossPressureRow[] = [
  { period: "2021 baseline", layersLostM: 0.2, retailAvgUsd: 1.67, wholesaleHighUsd: 1.4, confidence: "estimated" },
  { period: "2022", layersLostM: 44, retailAvgUsd: 2.86, wholesaleHighUsd: 4.55, confidence: "estimated" },
  { period: "2023", layersLostM: 14, retailAvgUsd: 2.8, wholesaleHighUsd: 4.85, confidence: "estimated" },
  { period: "2024", layersLostM: 40, retailAvgUsd: 3.17, wholesaleHighUsd: 4.6, confidence: "estimated" },
  { period: "2025 YTD crest", layersLostM: 35, retailAvgUsd: 4.35, wholesaleHighUsd: 8.05, confidence: "estimated" },
];

/** Pass-through scatter: monthly Δ wholesale → Δ retail (1-month lag) */
export type PassThroughDelta = {
  id: string;
  label: string;
  dWholesale: number;
  dRetailLag1: number;
  wave: string;
  confidence: Confidence;
};

export const PASS_THROUGH_DELTAS: PassThroughDelta[] = [
  { id: "d1", label: "Oct→Nov 22", dWholesale: 0.3, dRetailLag1: 0.661, wave: "2022", confidence: "estimated" },
  { id: "d2", label: "Nov→Dec 22", dWholesale: 0.75, dRetailLag1: 0.573, wave: "2022", confidence: "estimated" },
  { id: "d3", label: "Dec→Jan 23", dWholesale: 0.3, dRetailLag1: 0.573, wave: "2022", confidence: "estimated" },
  { id: "d4", label: "Jan→Feb 23", dWholesale: -1.95, dRetailLag1: -0.612, wave: "2023 unwind", confidence: "estimated" },
  { id: "d5", label: "Feb→Mar 23", dWholesale: -0.8, dRetailLag1: -0.765, wave: "2023 unwind", confidence: "estimated" },
  { id: "d6", label: "Sep→Oct 24", dWholesale: 0.96, dRetailLag1: -0.451, wave: "2024", confidence: "disclosed" },
  { id: "d7", label: "Nov→Dec 24", dWholesale: 0.7, dRetailLag1: 0.497, wave: "2024", confidence: "estimated" },
  { id: "d8", label: "Dec→Jan 25", dWholesale: 1.2, dRetailLag1: 0.807, wave: "2025", confidence: "estimated" },
  { id: "d9", label: "Jan→Feb 25", dWholesale: 2.25, dRetailLag1: 0.944, wave: "2025", confidence: "disclosed" },
  { id: "d10", label: "Feb→Mar 25", dWholesale: -2.72, dRetailLag1: 0.33, wave: "2025 lag", confidence: "disclosed" },
  { id: "d11", label: "Mar→Apr 25", dWholesale: -1.59, dRetailLag1: -1.105, wave: "2025 unwind", confidence: "disclosed" },
  { id: "d12", label: "Apr→May 25", dWholesale: -0.64, dRetailLag1: -0.574, wave: "2025 unwind", confidence: "estimated" },
];

export function fmtUsd(n: number, digits = 2): string {
  return `$${n.toFixed(digits)}`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function monthlyInRange(
  start: string,
  end: string,
): MonthlySpreadRow[] {
  return MONTHLY_SPREAD.filter((r) => r.month >= start && r.month <= end);
}
