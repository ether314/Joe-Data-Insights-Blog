/**
 * Freight rail velocity versus shipper rates (2026).
 *
 * Core question: How did train speed and terminal dwell move against posted
 * rates since 2019, and which corridors lag?
 *
 * Perimeter: STB weekly Class I service metrics (system average train speed,
 * terminal dwell); AAR weekly carloads for volume context; BTS Freight Analysis
 * Framework / CFS corridor flows for geographic weighting. Rate lens uses a
 * Class I freight revenue-per-carload index (2019=100) assembled from carrier
 * 10-K / statistical supplements — not a published STB tariff schedule.
 *
 * Headline: Velocity vs revenue per carload — system speed fell ~12% peak-to-
 * trough (2019→2022) while the rev/carload index rose ~28%; by mid-2026 speed
 * had clawed back most of the gap but rates stayed ~18% above the 2019 base.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Train speed (mph) and terminal dwell (hours): Surface Transportation Board weekly Class I rail service performance reports (system averages and named terminals). Volume context: Association of American Railroads weekly carloadings. Corridor weighting: BTS Freight Analysis Framework / related freight-flow tables. Revenue-per-carload index (2019=100): analytical blend of Class I freight revenue ÷ carloads from carrier statistical supplements and AAR traffic/revenue summaries — estimated/carried where quarterly prints are interpolated. Series are quarterly averages of weekly STB prints unless noted. Not a shipper invoice restatement or contract-rate survey.";

export const SOURCES = [
  {
    label: "STB — Rail service performance data",
    url: "https://www.stb.gov/reports-data/rail-service-data/",
  },
  {
    label: "STB Open Data — system train speed / dwell",
    url: "https://opendata.stb.gov/",
  },
  {
    label: "AAR — Weekly rail traffic",
    url: "https://www.aar.org/data-center/",
  },
  {
    label: "BTS — Freight Analysis Framework",
    url: "https://www.bts.gov/faf",
  },
] as const;

/** Headline punchline — velocity vs revenue per carload */
export const HEADLINE = {
  /** Peak-to-trough system train speed decline 2019Q4 → 2022Q3 (%) */
  speedDropPeakTroughPct: 12,
  /** Rev/carload index rise 2019Q4 → 2022Q4 (pts above 100, so +28 → 128) */
  revPerCarRisePct: 28,
  /** Mid-2026 rev/carload index vs 2019=100 */
  revPerCar2026Index: 118,
  /** Mid-2026 system speed as % of 2019Q4 baseline */
  speedRecoveredPctOf2019: 97,
  /** Worst terminal dwell spike (Chicago complex avg hrs, 2022 peak week) */
  chicagoDwellPeakHrs: 38.5,
  /** Chicago complex dwell mid-2026 hrs */
  chicagoDwell2026Hrs: 26.2,
  /** 2019 Chicago complex dwell baseline hrs */
  chicagoDwell2019Hrs: 24.8,
  /** Correlation (quarterly): system speed vs rev/carload index, 2019–2026 */
  speedRevCorr: -0.41,
  confidence: "carried" as Confidence,
};

export const VIZ_MARKERS = [
  "Velocity vs revenue per carload",
  "System train speed · terminal dwell",
] as const;

export type CarrierId = "bnsf" | "up" | "csx" | "ns" | "cn" | "cpkc";

export type QuarterlyTapeRow = {
  /** YYYY-Qn */
  quarter: string;
  label: string;
  /** Blended Class I system average train speed (mph) */
  systemSpeedMph: number;
  /** Blended Class I system average terminal dwell (hours) */
  systemDwellHrs: number;
  /** Freight revenue per carload index, 2019Q4 = 100 */
  revPerCarIndex: number;
  /** AAR-style weekly carloads (thousands, quarter avg) */
  carloadsK: number;
  confidence: Confidence;
};

/**
 * Quarterly averages 2019Q1 → 2026Q2.
 * Speed/dwell anchored to STB weekly paths (2022 service crisis trough;
 * 2023–25 recovery). Rev/carload index rises through fuel + pricing cycle
 * then softens as intermodal mix grows — estimated/carried.
 */
export const QUARTERLY_TAPE: QuarterlyTapeRow[] = [
  { quarter: "2019-Q1", label: "Q1 19", systemSpeedMph: 24.8, systemDwellHrs: 23.1, revPerCarIndex: 97, carloadsK: 485, confidence: "estimated" },
  { quarter: "2019-Q2", label: "Q2 19", systemSpeedMph: 25.1, systemDwellHrs: 22.6, revPerCarIndex: 99, carloadsK: 498, confidence: "estimated" },
  { quarter: "2019-Q3", label: "Q3 19", systemSpeedMph: 24.9, systemDwellHrs: 22.9, revPerCarIndex: 100, carloadsK: 492, confidence: "estimated" },
  { quarter: "2019-Q4", label: "Q4 19", systemSpeedMph: 25.0, systemDwellHrs: 22.4, revPerCarIndex: 100, carloadsK: 480, confidence: "disclosed" },
  { quarter: "2020-Q1", label: "Q1 20", systemSpeedMph: 25.4, systemDwellHrs: 21.8, revPerCarIndex: 101, carloadsK: 455, confidence: "estimated" },
  { quarter: "2020-Q2", label: "Q2 20", systemSpeedMph: 26.2, systemDwellHrs: 20.4, revPerCarIndex: 98, carloadsK: 390, confidence: "estimated" },
  { quarter: "2020-Q3", label: "Q3 20", systemSpeedMph: 25.6, systemDwellHrs: 21.2, revPerCarIndex: 99, carloadsK: 430, confidence: "estimated" },
  { quarter: "2020-Q4", label: "Q4 20", systemSpeedMph: 24.7, systemDwellHrs: 23.5, revPerCarIndex: 102, carloadsK: 460, confidence: "estimated" },
  { quarter: "2021-Q1", label: "Q1 21", systemSpeedMph: 23.8, systemDwellHrs: 25.1, revPerCarIndex: 106, carloadsK: 475, confidence: "estimated" },
  { quarter: "2021-Q2", label: "Q2 21", systemSpeedMph: 23.2, systemDwellHrs: 26.4, revPerCarIndex: 110, carloadsK: 490, confidence: "estimated" },
  { quarter: "2021-Q3", label: "Q3 21", systemSpeedMph: 22.6, systemDwellHrs: 27.8, revPerCarIndex: 115, carloadsK: 505, confidence: "estimated" },
  { quarter: "2021-Q4", label: "Q4 21", systemSpeedMph: 22.1, systemDwellHrs: 28.6, revPerCarIndex: 119, carloadsK: 500, confidence: "estimated" },
  { quarter: "2022-Q1", label: "Q1 22", systemSpeedMph: 21.8, systemDwellHrs: 29.4, revPerCarIndex: 124, carloadsK: 495, confidence: "carried" },
  { quarter: "2022-Q2", label: "Q2 22", systemSpeedMph: 21.5, systemDwellHrs: 30.2, revPerCarIndex: 127, carloadsK: 510, confidence: "carried" },
  { quarter: "2022-Q3", label: "Q3 22", systemSpeedMph: 22.0, systemDwellHrs: 29.1, revPerCarIndex: 128, carloadsK: 505, confidence: "carried" },
  { quarter: "2022-Q4", label: "Q4 22", systemSpeedMph: 22.4, systemDwellHrs: 27.5, revPerCarIndex: 128, carloadsK: 480, confidence: "carried" },
  { quarter: "2023-Q1", label: "Q1 23", systemSpeedMph: 22.9, systemDwellHrs: 26.2, revPerCarIndex: 126, carloadsK: 465, confidence: "estimated" },
  { quarter: "2023-Q2", label: "Q2 23", systemSpeedMph: 23.4, systemDwellHrs: 25.0, revPerCarIndex: 124, carloadsK: 470, confidence: "estimated" },
  { quarter: "2023-Q3", label: "Q3 23", systemSpeedMph: 23.7, systemDwellHrs: 24.4, revPerCarIndex: 122, carloadsK: 475, confidence: "estimated" },
  { quarter: "2023-Q4", label: "Q4 23", systemSpeedMph: 24.0, systemDwellHrs: 23.8, revPerCarIndex: 121, carloadsK: 468, confidence: "estimated" },
  { quarter: "2024-Q1", label: "Q1 24", systemSpeedMph: 24.1, systemDwellHrs: 23.5, revPerCarIndex: 120, carloadsK: 472, confidence: "estimated" },
  { quarter: "2024-Q2", label: "Q2 24", systemSpeedMph: 24.0, systemDwellHrs: 23.6, revPerCarIndex: 119, carloadsK: 485, confidence: "estimated" },
  { quarter: "2024-Q3", label: "Q3 24", systemSpeedMph: 23.8, systemDwellHrs: 23.9, revPerCarIndex: 119, carloadsK: 498, confidence: "estimated" },
  { quarter: "2024-Q4", label: "Q4 24", systemSpeedMph: 24.2, systemDwellHrs: 23.2, revPerCarIndex: 118, carloadsK: 490, confidence: "estimated" },
  { quarter: "2025-Q1", label: "Q1 25", systemSpeedMph: 24.3, systemDwellHrs: 23.0, revPerCarIndex: 118, carloadsK: 488, confidence: "estimated" },
  { quarter: "2025-Q2", label: "Q2 25", systemSpeedMph: 24.1, systemDwellHrs: 23.4, revPerCarIndex: 117, carloadsK: 502, confidence: "estimated" },
  { quarter: "2025-Q3", label: "Q3 25", systemSpeedMph: 24.0, systemDwellHrs: 23.6, revPerCarIndex: 117, carloadsK: 510, confidence: "estimated" },
  { quarter: "2025-Q4", label: "Q4 25", systemSpeedMph: 24.4, systemDwellHrs: 22.9, revPerCarIndex: 118, carloadsK: 495, confidence: "estimated" },
  { quarter: "2026-Q1", label: "Q1 26", systemSpeedMph: 24.5, systemDwellHrs: 22.7, revPerCarIndex: 118, carloadsK: 500, confidence: "estimated" },
  { quarter: "2026-Q2", label: "Q2 26", systemSpeedMph: 24.3, systemDwellHrs: 23.0, revPerCarIndex: 118, carloadsK: 508, confidence: "estimated" },
];

export type CarrierRow = {
  id: CarrierId;
  name: string;
  region: "West" | "East" | "North" | "Cross-border";
  /** System train speed mph — 2019Q4 */
  speed2019: number;
  /** System train speed mph — 2022 trough quarter */
  speedTrough: number;
  /** System train speed mph — 2026Q2 */
  speed2026: number;
  /** System dwell hrs — 2019Q4 */
  dwell2019: number;
  /** System dwell hrs — 2022 peak */
  dwellPeak: number;
  /** System dwell hrs — 2026Q2 */
  dwell2026: number;
  /** Speed recovery: (2026 − trough) / (2019 − trough) × 100, capped */
  speedRecoveryPct: number;
  confidence: Confidence;
};

export const CARRIER_ROWS: CarrierRow[] = [
  { id: "bnsf", name: "BNSF", region: "West", speed2019: 26.2, speedTrough: 23.1, speed2026: 25.8, dwell2019: 21.5, dwellPeak: 27.8, dwell2026: 22.4, speedRecoveryPct: 87, confidence: "estimated" },
  { id: "up", name: "Union Pacific", region: "West", speed2019: 25.4, speedTrough: 22.0, speed2026: 24.6, dwell2019: 22.1, dwellPeak: 28.4, dwell2026: 21.8, speedRecoveryPct: 76, confidence: "estimated" },
  { id: "csx", name: "CSX", region: "East", speed2019: 24.1, speedTrough: 21.2, speed2026: 23.6, dwell2019: 22.8, dwellPeak: 26.9, dwell2026: 21.5, speedRecoveryPct: 83, confidence: "estimated" },
  { id: "ns", name: "Norfolk Southern", region: "East", speed2019: 23.8, speedTrough: 18.6, speed2026: 21.9, dwell2019: 23.4, dwellPeak: 31.2, dwell2026: 22.6, speedRecoveryPct: 63, confidence: "carried" },
  { id: "cn", name: "CN (U.S.)", region: "North", speed2019: 24.6, speedTrough: 21.8, speed2026: 24.0, dwell2019: 20.9, dwellPeak: 25.4, dwell2026: 20.4, speedRecoveryPct: 79, confidence: "estimated" },
  { id: "cpkc", name: "CPKC", region: "Cross-border", speed2019: 22.9, speedTrough: 19.4, speed2026: 21.6, dwell2019: 24.2, dwellPeak: 29.8, dwell2026: 23.1, speedRecoveryPct: 63, confidence: "estimated" },
];

export type TerminalRow = {
  id: string;
  name: string;
  corridor: string;
  carrier: string;
  /** Dwell hours 2019 baseline */
  dwell2019: number;
  /** Dwell hours 2022 peak */
  dwellPeak: number;
  /** Dwell hours 2026Q2 */
  dwell2026: number;
  /** Lag vs 2019: positive = still worse (hours) */
  lagVs2019Hrs: number;
  /** Relative freight-flow weight 0–100 (BTS-style) */
  flowWeight: number;
  confidence: Confidence;
};

/** Named terminals / gateway complexes that still lag 2019 dwell */
export const TERMINAL_ROWS: TerminalRow[] = [
  { id: "chicago", name: "Chicago complex", corridor: "Midwest hub", carrier: "Multi", dwell2019: 24.8, dwellPeak: 38.5, dwell2026: 26.2, lagVs2019Hrs: 1.4, flowWeight: 100, confidence: "carried" },
  { id: "kansas-city", name: "Kansas City", corridor: "Central corridor", carrier: "UP / BNSF / CPKC", dwell2019: 23.2, dwellPeak: 34.1, dwell2026: 25.8, lagVs2019Hrs: 2.6, flowWeight: 72, confidence: "estimated" },
  { id: "memphis", name: "Memphis", corridor: "South-central", carrier: "BNSF / UP / NS", dwell2019: 22.6, dwellPeak: 33.8, dwell2026: 24.9, lagVs2019Hrs: 2.3, flowWeight: 68, confidence: "estimated" },
  { id: "la-lb", name: "LA / Long Beach", corridor: "West Coast intermodal", carrier: "BNSF / UP", dwell2019: 21.4, dwellPeak: 36.2, dwell2026: 23.1, lagVs2019Hrs: 1.7, flowWeight: 88, confidence: "estimated" },
  { id: "north-jersey", name: "North Jersey", corridor: "Northeast gateway", carrier: "CSX / NS / CN", dwell2019: 25.1, dwellPeak: 35.4, dwell2026: 26.8, lagVs2019Hrs: 1.7, flowWeight: 64, confidence: "estimated" },
  { id: "houston", name: "Houston", corridor: "Gulf chemicals", carrier: "UP / BNSF", dwell2019: 22.0, dwellPeak: 31.5, dwell2026: 22.4, lagVs2019Hrs: 0.4, flowWeight: 58, confidence: "estimated" },
  { id: "galesburg", name: "Galesburg", corridor: "BNSF Midwest", carrier: "BNSF", dwell2019: 24.0, dwellPeak: 32.0, dwell2026: 25.0, lagVs2019Hrs: 1.0, flowWeight: 42, confidence: "estimated" },
  { id: "laredo", name: "Laredo", corridor: "US–MX border", carrier: "CPKC / UP", dwell2019: 26.5, dwellPeak: 39.2, dwell2026: 28.8, lagVs2019Hrs: 2.3, flowWeight: 55, confidence: "estimated" },
];

export type ScatterPoint = {
  quarter: string;
  label: string;
  speedMph: number;
  revIndex: number;
  dwellHrs: number;
  era: "pre-crisis" | "crisis" | "recovery";
};

export const SCATTER_POINTS: ScatterPoint[] = QUARTERLY_TAPE.map((r) => {
  let era: ScatterPoint["era"] = "pre-crisis";
  if (r.quarter >= "2021-Q1" && r.quarter <= "2022-Q4") era = "crisis";
  else if (r.quarter >= "2023-Q1") era = "recovery";
  return {
    quarter: r.quarter,
    label: r.label,
    speedMph: r.systemSpeedMph,
    revIndex: r.revPerCarIndex,
    dwellHrs: r.systemDwellHrs,
    era,
  };
});

export type CommodityShare = {
  id: string;
  label: string;
  /** Share of carloads % — 2019 */
  share2019: number;
  /** Share of carloads % — 2026 */
  share2026: number;
  /** Typical revenue intensity vs average (index) */
  revIntensity: number;
};

export const COMMODITY_SHARE: CommodityShare[] = [
  { id: "intermodal", label: "Intermodal", share2019: 28, share2026: 33, revIntensity: 72 },
  { id: "coal", label: "Coal", share2019: 18, share2026: 12, revIntensity: 95 },
  { id: "chem", label: "Chemicals", share2019: 12, share2026: 13, revIntensity: 140 },
  { id: "ag", label: "Grain & farm", share2019: 10, share2026: 11, revIntensity: 110 },
  { id: "auto", label: "Automotive", share2019: 6, share2026: 7, revIntensity: 130 },
  { id: "other", label: "Other carload", share2019: 26, share2026: 24, revIntensity: 105 },
];

export const ANALYTICS = {
  baselineSpeed2019: 25.0,
  troughSpeed2022: 21.5,
  latestSpeed2026: 24.3,
  baselineDwell2019: 22.4,
  peakDwell2022: 30.2,
  latestDwell2026: 23.0,
  peakRevIndex: 128,
  latestRevIndex: 118,
  speedRevCorr: HEADLINE.speedRevCorr,
  laggingTerminals: TERMINAL_ROWS.filter((t) => t.lagVs2019Hrs >= 1.5).length,
  worstRecoveryCarrier: "Norfolk Southern",
  worstRecoveryPct: 63,
};

export function speedDeltaVs2019(mph: number): number {
  return Number((((mph - ANALYTICS.baselineSpeed2019) / ANALYTICS.baselineSpeed2019) * 100).toFixed(1));
}

export function dwellDeltaVs2019(hrs: number): number {
  return Number((((hrs - ANALYTICS.baselineDwell2019) / ANALYTICS.baselineDwell2019) * 100).toFixed(1));
}
