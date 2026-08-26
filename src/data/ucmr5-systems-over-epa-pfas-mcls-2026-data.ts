/**
 * UCMR5 systems over EPA PFAS MCLs (2026).
 *
 * Core question: What share of monitored community water systems exceed
 * PFOA/PFOS (and related NPDWR) MCLs in UCMR5, and how concentrated is
 * occurrence by state?
 *
 * Headline: EPA’s January 2026 UCMR 5 Data Summary puts a weighted national
 * estimate of 8.0% of PWSs with one or more sampling-location averages above
 * a PFAS NPDWR MCL — with large systems (~15.3%) roughly double the small-system
 * rate (~7.3%). PFOA and PFOS drive almost all of that footprint.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "National MCL comparisons: EPA Office of Water, The Fifth Unregulated Contaminant Monitoring Rule (UCMR 5) Data Summary: January 2026 (EPA 815-S-26-001), Table 4 — sampling-location averages vs April 2024 PFAS NPDWR MCLs. Figures cover ~9,240 PWSs with full result sets (~95% of expected UCMR 5 reporting). UCMR averages are technical assistance only and do not determine MCL compliance (compliance uses running annual averages of quarterly compliance monitoring; systems have until at least 2029 under the published rule). Contaminant rows can double-count systems that exceed multiple MCLs; unique any-MCL rates are the size-tier and weighted national lines. State occurrence (≥UCMR MRL for any of 29 PFAS): Plain Water Data PFAS Tracker compilation of EPA UCMR 5 occurrence text files (systems tested / systems with ≥1 detection). Detection ≠ MCL exceedance — state panel measures geographic concentration of measurable PFAS presence. Regulatory context: EPA PFAS NPDWR (April 2024); ASDWA PFAS implementation resources; May 2025 EPA announcement of intent to extend PFOA/PFOS compliance timelines and reconsider HFPO-DA, PFHxS, PFNA, and Hazard Index MCLs.";

export const SOURCES = [
  {
    label: "EPA — UCMR 5 Data Summary (January 2026)",
    url: "https://www.epa.gov/system/files/documents/2023-08/ucmr5-data-summary_0.pdf",
  },
  {
    label: "EPA — Fifth Unregulated Contaminant Monitoring Rule",
    url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule",
  },
  {
    label: "EPA — UCMR 5 Data Finder",
    url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule-data-finder",
  },
  {
    label: "EPA — PFAS National Primary Drinking Water Regulation",
    url: "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas",
  },
  {
    label: "ASDWA — PFAS drinking-water resources",
    url: "https://www.asdwa.org/pfas/",
  },
  {
    label: "Plain Water Data — UCMR5 PFAS Tracker (state occurrence)",
    url: "https://plainwaterdata.com/pfas",
  },
] as const;

export const HEADLINE = {
  /** EPA weighted estimate of PWSs nationwide with ≥1 average > any PFAS NPDWR MCL */
  weightedNationalOverMclPct: 8.0,
  largeOverMclPct: 15.3,
  mediumOverMclPct: 8.6,
  smallOverMclPct: 7.3,
  largeOverMclCount: 632,
  largeWithFullResults: 4129,
  mediumOverMclCount: 382,
  mediumWithFullResults: 4427,
  smallOverMclCount: 50,
  smallWithFullResults: 684,
  pwsWithFullResults: 9240,
  samplingLocationsApprox: 24050,
  dataShareOfExpectedPct: 95,
  /** Aggregate PFOS/PFOA rates across size tiers (sum of over-MCL / sum of full sets) */
  pfosOverallOverMclPct: 8.9,
  pfoaOverallOverMclPct: 8.0,
  /** Plain Water / UCMR5: share of tested systems with any PFAS ≥ MRL */
  nationalAnyPfasDetectionPct: 34,
  systemsTestedApprox: 10252,
  systemsWithDetectionApprox: 3528,
  confidence: "disclosed" as Confidence,
};

export type SizeTierRow = {
  size: "Large (>10k)" | "Medium (3.3–10k)" | "Small (<3.3k)" | "Weighted national";
  shortLabel: string;
  overMclPct: number;
  overMclCount: number | null;
  withFullResults: number | null;
  note: string;
  confidence: Confidence;
};

/** Unique PWSs with ≥1 location average above any NPDWR PFAS MCL (Table 4 footer). */
export const SIZE_TIER_OVER_MCL: SizeTierRow[] = [
  {
    size: "Large (>10k)",
    shortLabel: "Large",
    overMclPct: 15.3,
    overMclCount: 632,
    withFullResults: 4129,
    note: "Census of systems serving >10,000",
    confidence: "disclosed",
  },
  {
    size: "Medium (3.3–10k)",
    shortLabel: "Medium",
    overMclPct: 8.6,
    overMclCount: 382,
    withFullResults: 4427,
    note: "All systems serving 3,300–10,000 (UCMR medium)",
    confidence: "disclosed",
  },
  {
    size: "Small (<3.3k)",
    shortLabel: "Small",
    overMclPct: 7.3,
    overMclCount: 50,
    withFullResults: 684,
    note: "Representative sample of systems <3,300",
    confidence: "disclosed",
  },
  {
    size: "Weighted national",
    shortLabel: "National",
    overMclPct: 8.0,
    overMclCount: null,
    withFullResults: null,
    note: "SDWIS-weighted estimate across size classes",
    confidence: "disclosed",
  },
];

export type ContaminantMclRow = {
  contaminant: string;
  mclLabel: string;
  mclUgL: number | null;
  largePct: number;
  mediumPct: number;
  smallPct: number;
  largeCount: number;
  mediumCount: number;
  smallCount: number;
  overallPct: number;
  confidence: Confidence;
};

export const CONTAMINANT_OVER_MCL: ContaminantMclRow[] = [
  {
    contaminant: "PFOS",
    mclLabel: "4.0 ppt",
    mclUgL: 0.004,
    largePct: 12.0,
    mediumPct: 6.4,
    smallPct: 6.0,
    largeCount: 497,
    mediumCount: 282,
    smallCount: 41,
    overallPct: 8.9,
    confidence: "disclosed",
  },
  {
    contaminant: "PFOA",
    mclLabel: "4.0 ppt",
    mclUgL: 0.004,
    largePct: 10.9,
    mediumPct: 5.7,
    smallPct: 4.4,
    largeCount: 452,
    mediumCount: 253,
    smallCount: 30,
    overallPct: 8.0,
    confidence: "disclosed",
  },
  {
    contaminant: "PFHxS",
    mclLabel: "10 ppt",
    mclUgL: 0.01,
    largePct: 1.0,
    mediumPct: 0.5,
    smallPct: 0.6,
    largeCount: 40,
    mediumCount: 20,
    smallCount: 4,
    overallPct: 0.7,
    confidence: "disclosed",
  },
  {
    contaminant: "Hazard Index",
    mclLabel: "HI = 1",
    mclUgL: null,
    largePct: 1.1,
    mediumPct: 0.6,
    smallPct: 0.6,
    largeCount: 44,
    mediumCount: 25,
    smallCount: 4,
    overallPct: 0.8,
    confidence: "disclosed",
  },
  {
    contaminant: "PFNA",
    mclLabel: "10 ppt",
    mclUgL: 0.01,
    largePct: 0.1,
    mediumPct: 0.1,
    smallPct: 0.0,
    largeCount: 3,
    mediumCount: 6,
    smallCount: 0,
    overallPct: 0.1,
    confidence: "disclosed",
  },
  {
    contaminant: "HFPO-DA (GenX)",
    mclLabel: "10 ppt",
    mclUgL: 0.01,
    largePct: 0.05,
    mediumPct: 0.02,
    smallPct: 0.0,
    largeCount: 2,
    mediumCount: 1,
    smallCount: 0,
    overallPct: 0.03,
    confidence: "disclosed",
  },
];

export type CoOccurrenceRow = {
  minUniquePfas: number;
  samplingLocations: number;
  uniquePws: number;
};

/** Table 5 — locations / PWSs with N or more unique PFAS ≥ MRL (Jan 2026). */
export const CO_OCCURRENCE: CoOccurrenceRow[] = [
  { minUniquePfas: 1, samplingLocations: 6408, uniquePws: 3539 },
  { minUniquePfas: 2, samplingLocations: 4225, uniquePws: 2376 },
  { minUniquePfas: 3, samplingLocations: 3137, uniquePws: 1842 },
  { minUniquePfas: 4, samplingLocations: 2289, uniquePws: 1405 },
  { minUniquePfas: 5, samplingLocations: 1597, uniquePws: 992 },
  { minUniquePfas: 6, samplingLocations: 1083, uniquePws: 687 },
  { minUniquePfas: 7, samplingLocations: 671, uniquePws: 427 },
  { minUniquePfas: 8, samplingLocations: 336, uniquePws: 222 },
  { minUniquePfas: 9, samplingLocations: 89, uniquePws: 68 },
  { minUniquePfas: 10, samplingLocations: 21, uniquePws: 18 },
];

/** Share of locations with ≥1 PFAS ≥ MRL that also have ≥2 (EPA narrative: 66%). */
export const CO_OCCURRENCE_MIXTURE_SHARE_PCT = 66;

export type StateOccurrenceRow = {
  state: string;
  abbr: string;
  tested: number;
  detected: number;
  detectionRatePct: number;
  confidence: Confidence;
};

/**
 * State systems with ≥1 PFAS ≥ UCMR MRL (Plain Water Data / EPA UCMR5 files).
 * Top and bottom tails for concentration storytelling; full top-20 by rate among
 * states with ≥50 systems tested.
 */
export const STATE_OCCURRENCE: StateOccurrenceRow[] = [
  { state: "New Jersey", abbr: "NJ", tested: 264, detected: 172, detectionRatePct: 65.2, confidence: "estimated" },
  { state: "Connecticut", abbr: "CT", tested: 63, detected: 40, detectionRatePct: 63.5, confidence: "estimated" },
  { state: "Massachusetts", abbr: "MA", tested: 263, detected: 143, detectionRatePct: 54.4, confidence: "estimated" },
  { state: "South Carolina", abbr: "SC", tested: 164, detected: 90, detectionRatePct: 54.9, confidence: "estimated" },
  { state: "Texas", abbr: "TX", tested: 1147, detected: 610, detectionRatePct: 53.2, confidence: "estimated" },
  { state: "Rhode Island", abbr: "RI", tested: 29, detected: 15, detectionRatePct: 51.7, confidence: "estimated" },
  { state: "North Carolina", abbr: "NC", tested: 287, detected: 143, detectionRatePct: 49.8, confidence: "estimated" },
  { state: "Delaware", abbr: "DE", tested: 35, detected: 17, detectionRatePct: 48.6, confidence: "estimated" },
  { state: "Florida", abbr: "FL", tested: 402, detected: 190, detectionRatePct: 47.3, confidence: "estimated" },
  { state: "Pennsylvania", abbr: "PA", tested: 389, detected: 173, detectionRatePct: 44.5, confidence: "estimated" },
  { state: "Minnesota", abbr: "MN", tested: 196, detected: 87, detectionRatePct: 44.4, confidence: "estimated" },
  { state: "Ohio", abbr: "OH", tested: 346, detected: 141, detectionRatePct: 40.8, confidence: "estimated" },
  { state: "Alabama", abbr: "AL", tested: 306, detected: 117, detectionRatePct: 38.2, confidence: "estimated" },
  { state: "California", abbr: "CA", tested: 694, detected: 231, detectionRatePct: 33.3, confidence: "estimated" },
  { state: "New York", abbr: "NY", tested: 332, detected: 98, detectionRatePct: 29.5, confidence: "estimated" },
  { state: "Illinois", abbr: "IL", tested: 487, detected: 123, detectionRatePct: 25.3, confidence: "estimated" },
  { state: "Michigan", abbr: "MI", tested: 318, detected: 44, detectionRatePct: 13.8, confidence: "estimated" },
  { state: "Utah", abbr: "UT", tested: 129, detected: 16, detectionRatePct: 12.4, confidence: "estimated" },
  { state: "Arkansas", abbr: "AR", tested: 172, detected: 10, detectionRatePct: 5.8, confidence: "estimated" },
  { state: "Mississippi", abbr: "MS", tested: 238, detected: 9, detectionRatePct: 3.8, confidence: "estimated" },
  { state: "Hawaii", abbr: "HI", tested: 45, detected: 2, detectionRatePct: 4.4, confidence: "estimated" },
];

/** Concentration of detections: cumulative share among listed high-volume states. */
export type ConcentrationPoint = {
  rank: number;
  label: string;
  cumulativeDetectedSharePct: number;
  cumulativeTestedSharePct: number;
};

export const DETECTION_CONCENTRATION: ConcentrationPoint[] = (() => {
  const ranked = [...STATE_OCCURRENCE]
    .filter((s) => s.tested >= 100)
    .sort((a, b) => b.detected - a.detected);
  const totalDetected = ranked.reduce((s, r) => s + r.detected, 0);
  const totalTested = ranked.reduce((s, r) => s + r.tested, 0);
  let cumDet = 0;
  let cumTest = 0;
  return ranked.slice(0, 12).map((r, i) => {
    cumDet += r.detected;
    cumTest += r.tested;
    return {
      rank: i + 1,
      label: r.abbr,
      cumulativeDetectedSharePct: Math.round((1000 * cumDet) / totalDetected) / 10,
      cumulativeTestedSharePct: Math.round((1000 * cumTest) / totalTested) / 10,
    };
  });
})();

export type MclThresholdRow = {
  compound: string;
  mclPpt: number;
  role: string;
};

export const MCL_THRESHOLDS: MclThresholdRow[] = [
  { compound: "PFOA", mclPpt: 4.0, role: "Individual MCL (April 2024 NPDWR)" },
  { compound: "PFOS", mclPpt: 4.0, role: "Individual MCL (April 2024 NPDWR)" },
  { compound: "PFHxS", mclPpt: 10, role: "Individual MCL; under reconsideration" },
  { compound: "PFNA", mclPpt: 10, role: "Individual MCL; under reconsideration" },
  { compound: "HFPO-DA (GenX)", mclPpt: 10, role: "Individual MCL; under reconsideration" },
  { compound: "Hazard Index", mclPpt: 1, role: "Mixture MCL (unitless HI); under reconsideration" },
];
