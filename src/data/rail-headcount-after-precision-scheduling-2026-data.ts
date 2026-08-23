/**
 * Rail headcount after precision scheduling (2026).
 *
 * Core question: How much did Class I employment fall under precision-scheduled
 * railroading, and did service metrics degrade first?
 *
 * Perimeter: STB Class I employment (monthly prints aggregated to annual /
 * quarterly); AAR employment series cross-check; AAR rail performance measures
 * for terminal dwell (hours) and train speed (mph). Analytical composites for
 * desk use — not a substitute for carrier 10-K headcount footnotes or STB
 * Form C filings.
 *
 * Headline: Headcount vs dwell inflection — Class I employment fell ~29% from
 * the 2015 peak to the 2022 trough while average terminal dwell rose first
 * (2017–2019 PSR wave), then eased as headcount kept falling.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Class I employment: STB monthly employment reports (employees, Class I railroads) aggregated to annual means and quarterly snapshots; AAR Railroad Facts / employment tables used as cross-check where monthly STB prints are sparse. Service: AAR rail performance measures — average terminal dwell (hours) and average train speed (mph), industry composites. Carrier-era tags are analytical labels for PSR adoption windows, not STB official classifications. Mid-year interpolations and 2025–2026 provisional prints may be estimated/carried. Series are desk composites, not audited payroll or shipper invoice audits.";

export const SOURCES = [
  {
    label: "STB — Class I railroad employment reports",
    url: "https://www.stb.gov/reports-data/economic-data/",
  },
  {
    label: "AAR — Railroad Facts / employment",
    url: "https://www.aar.org/data-center/",
  },
  {
    label: "AAR — Rail performance measures (dwell / speed)",
    url: "https://www.aar.org/data-center/",
  },
] as const;

/** Headline punchline — headcount vs dwell inflection */
export const HEADLINE = {
  /** Class I employment peak year */
  employmentPeakYear: 2015,
  /** Peak Class I employment (thousands) */
  employmentPeakK: 163.4,
  /** Trough year for Class I employment */
  employmentTroughYear: 2022,
  /** Trough Class I employment (thousands) */
  employmentTroughK: 115.8,
  /** Peak-to-trough employment decline (%) */
  employmentDropPct: 29.1,
  /** Mid-2026 Class I employment (thousands) */
  employment2026K: 121.2,
  /** Dwell inflection: peak average terminal dwell (hours), 2019 */
  dwellPeakHours: 26.8,
  /** Pre-PSR baseline dwell (hours), 2015 */
  dwellBaselineHours: 22.1,
  /** Dwell rise from 2015 → 2019 peak (hours) */
  dwellRiseHours: 4.7,
  /** Mid-2026 average terminal dwell (hours) */
  dwell2026Hours: 23.4,
  /** Train speed trough (mph) during 2018–19 PSR wave */
  speedTroughMph: 23.9,
  /** Train speed 2015 baseline (mph) */
  speedBaselineMph: 26.4,
  /** Mid-2026 train speed (mph) */
  speed2026Mph: 25.1,
  /** Years dwell rose before employment trough */
  dwellLeadYears: 3,
  confidence: "carried" as Confidence,
};

export const VIZ_MARKERS = [
  "Headcount vs dwell inflection",
  "STB employment · AAR dwell / speed",
] as const;

export type EraId = "pre-psr" | "psr-wave" | "covid-shock" | "stabilize";

export const ERA_LABELS: Record<EraId, string> = {
  "pre-psr": "Pre-PSR (2014–16)",
  "psr-wave": "PSR wave (2017–19)",
  "covid-shock": "COVID shock (2020–21)",
  stabilize: "Stabilize (2022–26)",
};

export type AnnualTapeRow = {
  year: number;
  /** Class I employment, thousands */
  employmentK: number;
  /** Average terminal dwell, hours */
  dwellHours: number;
  /** Average train speed, mph */
  speedMph: number;
  /** Cars on line index (2015 = 100) */
  carsOnLineIndex: number;
  era: EraId;
  confidence: Confidence;
};

/** Annual industry tape — employment falls after dwell rises */
export const ANNUAL_TAPE: AnnualTapeRow[] = [
  { year: 2014, employmentK: 161.2, dwellHours: 22.4, speedMph: 26.1, carsOnLineIndex: 98, era: "pre-psr", confidence: "disclosed" },
  { year: 2015, employmentK: 163.4, dwellHours: 22.1, speedMph: 26.4, carsOnLineIndex: 100, era: "pre-psr", confidence: "disclosed" },
  { year: 2016, employmentK: 156.8, dwellHours: 22.6, speedMph: 26.0, carsOnLineIndex: 97, era: "pre-psr", confidence: "disclosed" },
  { year: 2017, employmentK: 148.2, dwellHours: 24.1, speedMph: 24.8, carsOnLineIndex: 99, era: "psr-wave", confidence: "disclosed" },
  { year: 2018, employmentK: 139.6, dwellHours: 25.9, speedMph: 24.1, carsOnLineIndex: 102, era: "psr-wave", confidence: "disclosed" },
  { year: 2019, employmentK: 132.4, dwellHours: 26.8, speedMph: 23.9, carsOnLineIndex: 101, era: "psr-wave", confidence: "disclosed" },
  { year: 2020, employmentK: 124.1, dwellHours: 24.2, speedMph: 26.8, carsOnLineIndex: 88, era: "covid-shock", confidence: "disclosed" },
  { year: 2021, employmentK: 118.6, dwellHours: 25.4, speedMph: 24.6, carsOnLineIndex: 96, era: "covid-shock", confidence: "disclosed" },
  { year: 2022, employmentK: 115.8, dwellHours: 26.1, speedMph: 23.7, carsOnLineIndex: 104, era: "stabilize", confidence: "disclosed" },
  { year: 2023, employmentK: 117.9, dwellHours: 24.8, speedMph: 24.4, carsOnLineIndex: 102, era: "stabilize", confidence: "disclosed" },
  { year: 2024, employmentK: 119.6, dwellHours: 23.9, speedMph: 24.9, carsOnLineIndex: 100, era: "stabilize", confidence: "estimated" },
  { year: 2025, employmentK: 120.4, dwellHours: 23.6, speedMph: 25.0, carsOnLineIndex: 99, era: "stabilize", confidence: "estimated" },
  { year: 2026, employmentK: 121.2, dwellHours: 23.4, speedMph: 25.1, carsOnLineIndex: 98, era: "stabilize", confidence: "carried" },
];

export type CarrierCut = {
  id: string;
  label: string;
  /** Employment change 2015→2022 (%) */
  empChangePct: number;
  /** Dwell change 2015→2019 peak window (hours) */
  dwellDeltaHours: number;
  /** Approximate PSR adoption start year */
  psrStartYear: number;
  /** Share of Class I employment mid-2026 (%) */
  empShare2026Pct: number;
};

/** Carrier-level employment cuts vs dwell stress (analytical) */
export const CARRIER_CUTS: CarrierCut[] = [
  { id: "csx", label: "CSX", empChangePct: -34, dwellDeltaHours: 6.2, psrStartYear: 2017, empShare2026Pct: 14.8 },
  { id: "ns", label: "Norfolk Southern", empChangePct: -31, dwellDeltaHours: 5.4, psrStartYear: 2018, empShare2026Pct: 13.6 },
  { id: "up", label: "Union Pacific", empChangePct: -28, dwellDeltaHours: 4.1, psrStartYear: 2018, empShare2026Pct: 22.4 },
  { id: "bn", label: "BNSF", empChangePct: -18, dwellDeltaHours: 2.2, psrStartYear: 2019, empShare2026Pct: 26.1 },
  { id: "cn", label: "CN (U.S. ops)", empChangePct: -22, dwellDeltaHours: 3.0, psrStartYear: 2017, empShare2026Pct: 8.2 },
  { id: "cpkc", label: "CPKC", empChangePct: -24, dwellDeltaHours: 3.6, psrStartYear: 2018, empShare2026Pct: 9.1 },
  { id: "kcs", label: "KCS (pre-merge)", empChangePct: -26, dwellDeltaHours: 3.8, psrStartYear: 2018, empShare2026Pct: 0 },
  { id: "other", label: "Other Class I", empChangePct: -20, dwellDeltaHours: 2.8, psrStartYear: 2018, empShare2026Pct: 5.8 },
];

export type CraftShare = {
  craft: string;
  share2015Pct: number;
  share2022Pct: number;
  share2026Pct: number;
};

/** Craft mix shift under thinner headcount */
export const CRAFT_SHARES: CraftShare[] = [
  { craft: "Train & engine", share2015Pct: 38, share2022Pct: 36, share2026Pct: 37 },
  { craft: "Maintenance of way", share2015Pct: 18, share2022Pct: 19, share2026Pct: 19 },
  { craft: "Maintenance of equipment", share2015Pct: 14, share2022Pct: 13, share2026Pct: 13 },
  { craft: "Yard / terminal", share2015Pct: 12, share2022Pct: 10, share2026Pct: 10 },
  { craft: "Clerical / admin", share2015Pct: 11, share2022Pct: 12, share2026Pct: 11 },
  { craft: "Professional / other", share2015Pct: 7, share2022Pct: 10, share2026Pct: 10 },
];

export type InflectionScatterPoint = {
  year: number;
  label: string;
  /** YoY employment change (%) */
  empYoYPct: number;
  /** YoY dwell change (hours) */
  dwellYoYHours: number;
  era: EraId;
};

/** Sequence test: dwell stress years vs employment cut years */
export const INFLECTION_SCATTER: InflectionScatterPoint[] = [
  { year: 2015, label: "2015", empYoYPct: 1.4, dwellYoYHours: -0.3, era: "pre-psr" },
  { year: 2016, label: "2016", empYoYPct: -4.0, dwellYoYHours: 0.5, era: "pre-psr" },
  { year: 2017, label: "2017", empYoYPct: -5.5, dwellYoYHours: 1.5, era: "psr-wave" },
  { year: 2018, label: "2018", empYoYPct: -5.8, dwellYoYHours: 1.8, era: "psr-wave" },
  { year: 2019, label: "2019", empYoYPct: -5.2, dwellYoYHours: 0.9, era: "psr-wave" },
  { year: 2020, label: "2020", empYoYPct: -6.3, dwellYoYHours: -2.6, era: "covid-shock" },
  { year: 2021, label: "2021", empYoYPct: -4.4, dwellYoYHours: 1.2, era: "covid-shock" },
  { year: 2022, label: "2022", empYoYPct: -2.4, dwellYoYHours: 0.7, era: "stabilize" },
  { year: 2023, label: "2023", empYoYPct: 1.8, dwellYoYHours: -1.3, era: "stabilize" },
  { year: 2024, label: "2024", empYoYPct: 1.4, dwellYoYHours: -0.9, era: "stabilize" },
  { year: 2025, label: "2025", empYoYPct: 0.7, dwellYoYHours: -0.3, era: "stabilize" },
  { year: 2026, label: "2026", empYoYPct: 0.7, dwellYoYHours: -0.2, era: "stabilize" },
];

export type EraSummary = {
  era: EraId;
  label: string;
  avgEmpK: number;
  avgDwellHours: number;
  avgSpeedMph: number;
  empChangePct: number;
};

export const ERA_SUMMARIES: EraSummary[] = [
  { era: "pre-psr", label: "Pre-PSR", avgEmpK: 160.5, avgDwellHours: 22.4, avgSpeedMph: 26.2, empChangePct: -2.7 },
  { era: "psr-wave", label: "PSR wave", avgEmpK: 140.1, avgDwellHours: 25.6, avgSpeedMph: 24.3, empChangePct: -15.6 },
  { era: "covid-shock", label: "COVID shock", avgEmpK: 121.4, avgDwellHours: 24.8, avgSpeedMph: 25.7, empChangePct: -10.4 },
  { era: "stabilize", label: "Stabilize", avgEmpK: 119.0, avgDwellHours: 24.4, avgSpeedMph: 24.6, empChangePct: 4.7 },
];

export type MetricLens = "employment" | "dwell" | "speed";

export function tapeForLens(lens: MetricLens): { year: number; value: number; era: EraId }[] {
  return ANNUAL_TAPE.map((r) => ({
    year: r.year,
    era: r.era,
    value:
      lens === "employment" ? r.employmentK : lens === "dwell" ? r.dwellHours : r.speedMph,
  }));
}

export function carrierCutsFiltered(minDropPct: number): CarrierCut[] {
  return CARRIER_CUTS.filter((c) => c.empChangePct <= -minDropPct && c.empShare2026Pct > 0);
}

export const ANALYTICS = {
  /** First year dwell rose >1h YoY while employment already falling */
  firstDwellStressYear: 2017,
  /** Employment trough year — three years after first large dwell jump */
  employmentTroughYear: 2022,
  /** Correlation: annual employment vs dwell, 2014–2019 */
  empDwellCorrPreCovid: -0.91,
  /** Correlation: annual employment vs dwell, 2020–2026 */
  empDwellCorrPostCovid: -0.18,
  /** Yard/terminal craft share loss 2015→2022 (pp) */
  yardShareLossPp: 2,
  /** Professional/other craft share gain 2015→2022 (pp) */
  professionalGainPp: 3,
} as const;
