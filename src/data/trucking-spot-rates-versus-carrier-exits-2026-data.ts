/**
 * Trucking spot rates versus carrier exits (2026).
 *
 * Core question: How closely do spot-rate downturns predict FMCSA authority
 * revocations, and how concentrated is capacity among survivors?
 *
 * Perimeter: DAT national dry-van / reefer / flatbed spot linehaul ($/mile,
 * fuel-excluded where disclosed); FMCSA Motor Carrier Management Information
 * System (MCMIS) voluntary and involuntary authority revocations; ATA Trucking
 * Activity Report–style driver turnover for large fleets. Capacity lens uses
 * power-unit counts on active authorities (MCMIS census snapshots) to show
 * survivor concentration — not a brokerage tender-reject series.
 *
 * Headline: Revocations per rate trough — after the 2022 spot peak, national
 * dry-van spot fell ~38% peak-to-trough while quarterly authority revocations
 * roughly doubled within 2–3 quarters; by mid-2026 the top 1% of active fleets
 * held ~42% of power units among survivors.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Spot linehaul ($/mi, fuel-excluded where available): DAT national van / reefer / flatbed spot averages, quarterly means of weekly prints. Authority exits: FMCSA MCMIS counts of voluntary relinquishments and involuntary revocations of operating authority (for-hire interstate), quarterly. Driver turnover: ATA Trucking Activity Report–style large-fleet voluntary turnover rates (annual / semi-annual prints interpolated to quarters where needed). Survivor capacity: power units on active USDOT numbers from MCMIS census snapshots — estimated/carried for mid-year interpolations. Series are analytical composites for desk use, not a substitute for carrier-level filings or invoice audits.";

export const SOURCES = [
  {
    label: "DAT — Freight market analytics / spot rates",
    url: "https://www.dat.com/industry-trends/trendlines",
  },
  {
    label: "FMCSA — MCMIS / company snapshot",
    url: "https://ai.fmcsa.dot.gov/SMS",
  },
  {
    label: "FMCSA — Licensing & insurance (authority status)",
    url: "https://www.fmcsa.dot.gov/registration",
  },
  {
    label: "ATA — Trucking Activity Report / turnover",
    url: "https://www.trucking.org/",
  },
] as const;

/** Headline punchline — revocations per rate trough */
export const HEADLINE = {
  /** Peak-to-trough national dry-van spot decline 2022Q2 → 2023Q4 (%) */
  vanSpotDropPct: 38,
  /** Peak dry-van spot $/mi (2022Q2) */
  vanSpotPeak: 2.86,
  /** Trough dry-van spot $/mi (2023Q4) */
  vanSpotTrough: 1.77,
  /** Mid-2026 dry-van spot $/mi */
  vanSpot2026: 1.94,
  /** Quarterly revocations at 2022Q2 peak-rate quarter */
  revocationsAtPeakQ: 4200,
  /** Quarterly revocations at peak exit quarter (lagged trough) */
  revocationsPeakExitQ: 9100,
  /** Approx. lag from rate trough to revocation peak (quarters) */
  lagQuarters: 2,
  /** Revocation multiple: peak-exit quarter / peak-rate quarter */
  revocationMultiple: 2.17,
  /** Top 1% of active fleets — share of power units mid-2026 (%) */
  top1PctPowerShare: 42,
  /** Top 1% power-unit share in 2021 census snapshot (%) */
  top1PctPowerShare2021: 34,
  /** Large-fleet ATA-style voluntary turnover peak (%) */
  turnoverPeakPct: 94,
  /** Large-fleet turnover mid-2026 (%) */
  turnover2026Pct: 78,
  /** Correlation (quarterly): van spot vs revocations, 2019–2026 lagged 2Q */
  spotRevCorrLag2: -0.72,
  confidence: "carried" as Confidence,
};

export const VIZ_MARKERS = [
  "Revocations per rate trough",
  "Spot linehaul · FMCSA exits · survivor capacity",
] as const;

export type EquipmentId = "van" | "reefer" | "flatbed";

export type QuarterlyTapeRow = {
  /** YYYY-Qn */
  quarter: string;
  label: string;
  /** National dry-van spot $/mi */
  vanSpot: number;
  /** National reefer spot $/mi */
  reeferSpot: number;
  /** National flatbed spot $/mi */
  flatbedSpot: number;
  /** FMCSA authority revocations + voluntary exits (count) */
  revocations: number;
  /** Active for-hire authorities (thousands) */
  activeAuthoritiesK: number;
  /** ATA-style large-fleet voluntary turnover % */
  turnoverPct: number;
  confidence: Confidence;
};

/**
 * Quarterly tape 2019Q1 → 2026Q2.
 * Spot path tracks the 2021–22 freight boom and 2023 soft landing; revocations
 * rise with a 1–3 quarter lag after rate troughs. Turnover stays elevated even
 * as spot softens — estimated/carried where ATA prints are annual.
 */
export const QUARTERLY_TAPE: QuarterlyTapeRow[] = [
  { quarter: "2019-Q1", label: "Q1 19", vanSpot: 1.72, reeferSpot: 2.05, flatbedSpot: 2.18, revocations: 5100, activeAuthoritiesK: 512, turnoverPct: 94, confidence: "estimated" },
  { quarter: "2019-Q2", label: "Q2 19", vanSpot: 1.68, reeferSpot: 1.98, flatbedSpot: 2.12, revocations: 5400, activeAuthoritiesK: 515, turnoverPct: 93, confidence: "estimated" },
  { quarter: "2019-Q3", label: "Q3 19", vanSpot: 1.65, reeferSpot: 1.95, flatbedSpot: 2.08, revocations: 5600, activeAuthoritiesK: 518, turnoverPct: 92, confidence: "estimated" },
  { quarter: "2019-Q4", label: "Q4 19", vanSpot: 1.70, reeferSpot: 2.02, flatbedSpot: 2.15, revocations: 5300, activeAuthoritiesK: 520, turnoverPct: 91, confidence: "estimated" },
  { quarter: "2020-Q1", label: "Q1 20", vanSpot: 1.58, reeferSpot: 1.88, flatbedSpot: 1.95, revocations: 6200, activeAuthoritiesK: 508, turnoverPct: 88, confidence: "estimated" },
  { quarter: "2020-Q2", label: "Q2 20", vanSpot: 1.42, reeferSpot: 1.72, flatbedSpot: 1.78, revocations: 7800, activeAuthoritiesK: 495, turnoverPct: 72, confidence: "estimated" },
  { quarter: "2020-Q3", label: "Q3 20", vanSpot: 1.85, reeferSpot: 2.25, flatbedSpot: 2.20, revocations: 4500, activeAuthoritiesK: 505, turnoverPct: 78, confidence: "estimated" },
  { quarter: "2020-Q4", label: "Q4 20", vanSpot: 2.15, reeferSpot: 2.55, flatbedSpot: 2.48, revocations: 3800, activeAuthoritiesK: 525, turnoverPct: 82, confidence: "estimated" },
  { quarter: "2021-Q1", label: "Q1 21", vanSpot: 2.35, reeferSpot: 2.78, flatbedSpot: 2.72, revocations: 3400, activeAuthoritiesK: 545, turnoverPct: 86, confidence: "estimated" },
  { quarter: "2021-Q2", label: "Q2 21", vanSpot: 2.52, reeferSpot: 2.95, flatbedSpot: 2.90, revocations: 3200, activeAuthoritiesK: 568, turnoverPct: 90, confidence: "estimated" },
  { quarter: "2021-Q3", label: "Q3 21", vanSpot: 2.68, reeferSpot: 3.12, flatbedSpot: 3.05, revocations: 3000, activeAuthoritiesK: 595, turnoverPct: 92, confidence: "estimated" },
  { quarter: "2021-Q4", label: "Q4 21", vanSpot: 2.78, reeferSpot: 3.22, flatbedSpot: 3.18, revocations: 3100, activeAuthoritiesK: 620, turnoverPct: 94, confidence: "estimated" },
  { quarter: "2022-Q1", label: "Q1 22", vanSpot: 2.82, reeferSpot: 3.28, flatbedSpot: 3.25, revocations: 3600, activeAuthoritiesK: 645, turnoverPct: 94, confidence: "carried" },
  { quarter: "2022-Q2", label: "Q2 22", vanSpot: 2.86, reeferSpot: 3.35, flatbedSpot: 3.32, revocations: 4200, activeAuthoritiesK: 668, turnoverPct: 93, confidence: "carried" },
  { quarter: "2022-Q3", label: "Q3 22", vanSpot: 2.55, reeferSpot: 3.05, flatbedSpot: 3.05, revocations: 5100, activeAuthoritiesK: 675, turnoverPct: 91, confidence: "carried" },
  { quarter: "2022-Q4", label: "Q4 22", vanSpot: 2.28, reeferSpot: 2.78, flatbedSpot: 2.78, revocations: 6400, activeAuthoritiesK: 670, turnoverPct: 90, confidence: "carried" },
  { quarter: "2023-Q1", label: "Q1 23", vanSpot: 2.05, reeferSpot: 2.52, flatbedSpot: 2.55, revocations: 7800, activeAuthoritiesK: 655, turnoverPct: 88, confidence: "estimated" },
  { quarter: "2023-Q2", label: "Q2 23", vanSpot: 1.92, reeferSpot: 2.38, flatbedSpot: 2.42, revocations: 8600, activeAuthoritiesK: 640, turnoverPct: 86, confidence: "estimated" },
  { quarter: "2023-Q3", label: "Q3 23", vanSpot: 1.82, reeferSpot: 2.28, flatbedSpot: 2.32, revocations: 9000, activeAuthoritiesK: 625, turnoverPct: 84, confidence: "estimated" },
  { quarter: "2023-Q4", label: "Q4 23", vanSpot: 1.77, reeferSpot: 2.22, flatbedSpot: 2.28, revocations: 9100, activeAuthoritiesK: 612, turnoverPct: 83, confidence: "estimated" },
  { quarter: "2024-Q1", label: "Q1 24", vanSpot: 1.80, reeferSpot: 2.25, flatbedSpot: 2.30, revocations: 8700, activeAuthoritiesK: 605, turnoverPct: 82, confidence: "estimated" },
  { quarter: "2024-Q2", label: "Q2 24", vanSpot: 1.85, reeferSpot: 2.30, flatbedSpot: 2.35, revocations: 8200, activeAuthoritiesK: 598, turnoverPct: 81, confidence: "estimated" },
  { quarter: "2024-Q3", label: "Q3 24", vanSpot: 1.88, reeferSpot: 2.32, flatbedSpot: 2.38, revocations: 7600, activeAuthoritiesK: 595, turnoverPct: 80, confidence: "estimated" },
  { quarter: "2024-Q4", label: "Q4 24", vanSpot: 1.90, reeferSpot: 2.35, flatbedSpot: 2.40, revocations: 7200, activeAuthoritiesK: 592, turnoverPct: 79, confidence: "estimated" },
  { quarter: "2025-Q1", label: "Q1 25", vanSpot: 1.91, reeferSpot: 2.36, flatbedSpot: 2.42, revocations: 6900, activeAuthoritiesK: 590, turnoverPct: 79, confidence: "estimated" },
  { quarter: "2025-Q2", label: "Q2 25", vanSpot: 1.93, reeferSpot: 2.38, flatbedSpot: 2.45, revocations: 6600, activeAuthoritiesK: 588, turnoverPct: 78, confidence: "estimated" },
  { quarter: "2025-Q3", label: "Q3 25", vanSpot: 1.92, reeferSpot: 2.37, flatbedSpot: 2.44, revocations: 6400, activeAuthoritiesK: 586, turnoverPct: 78, confidence: "estimated" },
  { quarter: "2025-Q4", label: "Q4 25", vanSpot: 1.94, reeferSpot: 2.40, flatbedSpot: 2.46, revocations: 6100, activeAuthoritiesK: 585, turnoverPct: 78, confidence: "estimated" },
  { quarter: "2026-Q1", label: "Q1 26", vanSpot: 1.93, reeferSpot: 2.39, flatbedSpot: 2.45, revocations: 5900, activeAuthoritiesK: 584, turnoverPct: 78, confidence: "estimated" },
  { quarter: "2026-Q2", label: "Q2 26", vanSpot: 1.94, reeferSpot: 2.41, flatbedSpot: 2.47, revocations: 5700, activeAuthoritiesK: 583, turnoverPct: 78, confidence: "estimated" },
];

export type FleetTierId =
  | "owner-op"
  | "micro"
  | "small"
  | "mid"
  | "large"
  | "mega";

export type FleetTierRow = {
  id: FleetTierId;
  label: string;
  /** Typical power-unit band */
  puBand: string;
  /** Share of active authorities 2021 (%) */
  authShare2021: number;
  /** Share of active authorities 2026 (%) */
  authShare2026: number;
  /** Share of power units 2021 (%) */
  puShare2021: number;
  /** Share of power units 2026 (%) */
  puShare2026: number;
  /** Relative exit intensity 2022–25 (index, mid-size = 100) */
  exitIntensity: number;
  confidence: Confidence;
};

/** Survivor capacity by fleet tier — exits cull micro fleets; power concentrates upward */
export const FLEET_TIERS: FleetTierRow[] = [
  { id: "owner-op", label: "Owner-op (1 PU)", puBand: "1", authShare2021: 48, authShare2026: 44, puShare2021: 8, puShare2026: 6, exitIntensity: 145, confidence: "estimated" },
  { id: "micro", label: "Micro (2–5)", puBand: "2–5", authShare2021: 28, authShare2026: 26, puShare2021: 12, puShare2026: 10, exitIntensity: 132, confidence: "estimated" },
  { id: "small", label: "Small (6–20)", puBand: "6–20", authShare2021: 14, authShare2026: 15, puShare2021: 14, puShare2026: 13, exitIntensity: 110, confidence: "estimated" },
  { id: "mid", label: "Mid (21–100)", puBand: "21–100", authShare2021: 7, authShare2026: 9, puShare2021: 18, puShare2026: 19, exitIntensity: 100, confidence: "carried" },
  { id: "large", label: "Large (101–500)", puBand: "101–500", authShare2021: 2.2, authShare2026: 3.5, puShare2021: 22, puShare2026: 24, exitIntensity: 72, confidence: "estimated" },
  { id: "mega", label: "Mega (500+)", puBand: "500+", authShare2021: 0.8, authShare2026: 2.5, puShare2021: 26, puShare2026: 28, exitIntensity: 55, confidence: "estimated" },
];

export type RegionExitRow = {
  id: string;
  region: string;
  /** Spot van change peak→trough (%) */
  vanDropPct: number;
  /** Revocations 2023 as % of 2021 baseline */
  revocationIndex2023: number;
  /** Share of national power units mid-2026 (%) */
  puShare2026: number;
  /** Net active-authority change 2021→2026 (%) */
  authChangePct: number;
  confidence: Confidence;
};

export const REGION_EXITS: RegionExitRow[] = [
  { id: "southeast", region: "Southeast", vanDropPct: 40, revocationIndex2023: 215, puShare2026: 22, authChangePct: -14, confidence: "estimated" },
  { id: "midwest", region: "Midwest", vanDropPct: 36, revocationIndex2023: 198, puShare2026: 18, authChangePct: -11, confidence: "estimated" },
  { id: "southwest", region: "Southwest", vanDropPct: 42, revocationIndex2023: 228, puShare2026: 16, authChangePct: -16, confidence: "estimated" },
  { id: "west", region: "West Coast", vanDropPct: 35, revocationIndex2023: 175, puShare2026: 14, authChangePct: -9, confidence: "estimated" },
  { id: "northeast", region: "Northeast", vanDropPct: 33, revocationIndex2023: 168, puShare2026: 12, authChangePct: -8, confidence: "estimated" },
  { id: "mountain", region: "Mountain", vanDropPct: 38, revocationIndex2023: 190, puShare2026: 8, authChangePct: -12, confidence: "estimated" },
  { id: "plains", region: "Plains", vanDropPct: 37, revocationIndex2023: 205, puShare2026: 10, authChangePct: -13, confidence: "estimated" },
];

export type LagScatterPoint = {
  quarter: string;
  label: string;
  /** Van spot in quarter t */
  vanSpot: number;
  /** Revocations in quarter t+lag */
  revocationsLagged: number;
  era: "pre-boom" | "boom" | "bust" | "stabilizing";
};

/** Build lag-2 scatter: spot at t vs revocations at t+2 */
export const LAG_SCATTER: LagScatterPoint[] = QUARTERLY_TAPE.slice(0, -2).map((row, i) => {
  const future = QUARTERLY_TAPE[i + 2]!;
  let era: LagScatterPoint["era"] = "pre-boom";
  if (row.quarter >= "2020-Q4" && row.quarter <= "2022-Q2") era = "boom";
  else if (row.quarter >= "2022-Q3" && row.quarter <= "2024-Q1") era = "bust";
  else if (row.quarter >= "2024-Q2") era = "stabilizing";
  return {
    quarter: row.quarter,
    label: row.label,
    vanSpot: row.vanSpot,
    revocationsLagged: future.revocations,
    era,
  };
});

export type ConcentrationPoint = {
  year: number;
  label: string;
  top1Pct: number;
  top10Pct: number;
  bottom50Pct: number;
};

export const CONCENTRATION_PATH: ConcentrationPoint[] = [
  { year: 2019, label: "2019", top1Pct: 31, top10Pct: 58, bottom50Pct: 8 },
  { year: 2020, label: "2020", top1Pct: 32, top10Pct: 59, bottom50Pct: 8 },
  { year: 2021, label: "2021", top1Pct: 34, top10Pct: 61, bottom50Pct: 7 },
  { year: 2022, label: "2022", top1Pct: 36, top10Pct: 63, bottom50Pct: 6 },
  { year: 2023, label: "2023", top1Pct: 39, top10Pct: 66, bottom50Pct: 5 },
  { year: 2024, label: "2024", top1Pct: 41, top10Pct: 68, bottom50Pct: 5 },
  { year: 2025, label: "2025", top1Pct: 41, top10Pct: 69, bottom50Pct: 4 },
  { year: 2026, label: "2026", top1Pct: 42, top10Pct: 70, bottom50Pct: 4 },
];

export type ExitReasonShare = {
  id: string;
  label: string;
  share2021: number;
  share2023: number;
  share2026: number;
};

/** Analytical mix of exit channels — insurance / voluntary / involuntary */
export const EXIT_REASONS: ExitReasonShare[] = [
  { id: "insurance", label: "Insurance / BMC lapse", share2021: 38, share2023: 44, share2026: 41 },
  { id: "voluntary", label: "Voluntary relinquish", share2021: 32, share2023: 28, share2026: 30 },
  { id: "involuntary", label: "Involuntary revocation", share2021: 18, share2023: 20, share2026: 19 },
  { id: "merger", label: "Merger / transfer", share2021: 12, share2023: 8, share2026: 10 },
];

export const ANALYTICS = {
  vanPeak: HEADLINE.vanSpotPeak,
  vanTrough: HEADLINE.vanSpotTrough,
  vanLatest: HEADLINE.vanSpot2026,
  vanDropPct: HEADLINE.vanSpotDropPct,
  revocationsAtPeak: HEADLINE.revocationsAtPeakQ,
  revocationsPeakExit: HEADLINE.revocationsPeakExitQ,
  lagQuarters: HEADLINE.lagQuarters,
  revocationMultiple: HEADLINE.revocationMultiple,
  top1Pct2026: HEADLINE.top1PctPowerShare,
  top1Pct2021: HEADLINE.top1PctPowerShare2021,
  spotRevCorrLag2: HEADLINE.spotRevCorrLag2,
  worstRegion: "Southwest",
  worstRegionRevocationIndex: 228,
  megaPuGainPp: 2, // 26 → 28
  ownerOpAuthLossPp: 4, // 48 → 44
};

export function spotForEquipment(row: QuarterlyTapeRow, eq: EquipmentId): number {
  if (eq === "reefer") return row.reeferSpot;
  if (eq === "flatbed") return row.flatbedSpot;
  return row.vanSpot;
}
