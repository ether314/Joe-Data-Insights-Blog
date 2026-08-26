/**
 * Small-system PFAS detections versus large utilities (2026).
 *
 * Core question: Are PFAS detections / MCL-exceeding averages clustered in
 * small systems that lack GAC/RO, or in large utilities with industrial
 * watersheds?
 *
 * Headline (EPA UCMR 5 Data Summary, January 2026 cut): among systems with a
 * full set of results at ≥1 location, 15.3% of large PWSs (>10,000 served)
 * had ≥1 sampling-location average above a PFAS NPDWR MCL — roughly double
 * the 7.3% rate for the small (<3,300) sample and well above the 8.6% medium
 * (3,300–10,000) rate. Weighted nationwide estimate: 8.0% of PWSs.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Primary: EPA The Fifth Unregulated Contaminant Monitoring Rule (UCMR 5) Data Summary — January 2026 cut (occurrence results received to date for PWSs with a full set of results at ≥1 sampling location). Size tiers use SDWIS/Fed retail population as of 1 Feb 2021. MCL comparison uses April 2024 PFAS National Primary Drinking Water Regulation levels for PFOA, PFOS, HFPO-DA, PFHxS, PFNA, and the Hazard Index; UCMR averages are for technical assistance only and do not indicate compliance (compliance deadline under the NPDWR remains later). System universe for weighting: CWSs + NTNCWSs in SDWIS/Fed. Treatment-capacity rows are editorial illustrations informed by EPA PFAS NPDWR economic analysis / AWWA treatment surveys and are labeled estimated — UCMR 5 collects optional PFASTreatment codes (GAC, IX, RO, etc.) but published size-tier treatment shares are incomplete in the January 2026 summary. USGS PFAS mapping cited for watershed/source context only, not for the size-tier rates.";

export const SOURCES = [
  {
    label: "EPA — UCMR 5 Data Summary (January 2026)",
    url: "https://www.epa.gov/system/files/documents/2023-08/ucmr5-data-summary_0.pdf",
  },
  {
    label: "EPA — UCMR 5 Data Finder",
    url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule-data-finder",
  },
  {
    label: "EPA — UCMR 5 Fact Sheet",
    url: "https://www.epa.gov/system/files/documents/2022-02/ucmr5-factsheet.pdf",
  },
  {
    label: "EPA — PFAS National Primary Drinking Water Regulation",
    url: "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas",
  },
  {
    label: "USGS — PFAS in the Environment mapping / science pages",
    url: "https://www.usgs.gov/mission-areas/water-resources/science/per-and-polyfluoroalkyl-substances-pfas",
  },
] as const;

export const HEADLINE = {
  /** Large PWS (>10k) share with ≥1 location avg > MCL */
  largeMclSharePct: 15.3,
  largeOverMcl: 632,
  largeWithFullResults: 4_129,
  /** Medium (3.3k–10k) */
  mediumMclSharePct: 8.6,
  mediumOverMcl: 382,
  mediumWithFullResults: 4_427,
  /** Small sample (<3.3k) */
  smallMclSharePct: 7.3,
  smallOverMcl: 50,
  smallWithFullResults: 684,
  /** SDWIS-weighted national estimate */
  weightedNationalMclSharePct: 8.0,
  /** Large vs small rate ratio */
  largeVsSmallRatio: Math.round((15.3 / 7.3) * 10) / 10,
  confidence: "disclosed" as Confidence,
};

export type SizeTierId = "small" | "medium" | "large";

export type SizeTierMclRow = {
  id: SizeTierId;
  label: string;
  popRange: string;
  systemsWithFullResults: number;
  systemsOverMcl: number;
  mclSharePct: number;
  confidence: Confidence;
};

/** Table 4 — UCMR 5 January 2026 Data Summary */
export const SIZE_TIER_MCL: SizeTierMclRow[] = [
  {
    id: "small",
    label: "Small (<3,300)",
    popRange: "<3,300",
    systemsWithFullResults: 684,
    systemsOverMcl: 50,
    mclSharePct: 7.3,
    confidence: "disclosed",
  },
  {
    id: "medium",
    label: "Medium (3.3k–10k)",
    popRange: "3,300–10,000",
    systemsWithFullResults: 4_427,
    systemsOverMcl: 382,
    mclSharePct: 8.6,
    confidence: "disclosed",
  },
  {
    id: "large",
    label: "Large (>10,000)",
    popRange: ">10,000",
    systemsWithFullResults: 4_129,
    systemsOverMcl: 632,
    mclSharePct: 15.3,
    confidence: "disclosed",
  },
];

export type ContaminantBySizeRow = {
  contaminant: string;
  mclUgL: number;
  largeOverPct: number;
  mediumOverPct: number;
  smallOverPct: number;
  largeN: number;
  mediumN: number;
  smallN: number;
  confidence: Confidence;
};

/** Individual MCL exceedance shares by size (Table 4) */
export const CONTAMINANT_BY_SIZE: ContaminantBySizeRow[] = [
  {
    contaminant: "PFOS",
    mclUgL: 0.004,
    largeOverPct: 12.0,
    mediumOverPct: 6.4,
    smallOverPct: 6.0,
    largeN: 497,
    mediumN: 282,
    smallN: 41,
    confidence: "disclosed",
  },
  {
    contaminant: "PFOA",
    mclUgL: 0.004,
    largeOverPct: 10.9,
    mediumOverPct: 5.7,
    smallOverPct: 4.4,
    largeN: 452,
    mediumN: 253,
    smallN: 30,
    confidence: "disclosed",
  },
  {
    contaminant: "PFHxS",
    mclUgL: 0.01,
    largeOverPct: 1.0,
    mediumOverPct: 0.5,
    smallOverPct: 0.6,
    largeN: 40,
    mediumN: 20,
    smallN: 4,
    confidence: "disclosed",
  },
  {
    contaminant: "HFPO-DA",
    mclUgL: 0.01,
    largeOverPct: 0.05,
    mediumOverPct: 0.02,
    smallOverPct: 0.0,
    largeN: 2,
    mediumN: 1,
    smallN: 0,
    confidence: "disclosed",
  },
  {
    contaminant: "PFNA",
    mclUgL: 0.01,
    largeOverPct: 0.07,
    mediumOverPct: 0.1,
    smallOverPct: 0.0,
    largeN: 3,
    mediumN: 6,
    smallN: 0,
    confidence: "disclosed",
  },
];

/**
 * Population vs system exposure framing.
 * System counts with full results are disclosed; population shares are
 * editorial estimates that map SDWIS size structure onto UCMR tiers.
 */
export type ExposureFrameRow = {
  id: SizeTierId;
  label: string;
  shareOfUcmrSystemsPct: number;
  shareOfUsPopServedPct: number;
  mclSharePct: number;
  confidence: Confidence;
};

export const EXPOSURE_FRAME: ExposureFrameRow[] = [
  {
    id: "small",
    label: "Small",
    shareOfUcmrSystemsPct: Math.round((684 / (684 + 4427 + 4129)) * 1000) / 10,
    shareOfUsPopServedPct: 8,
    mclSharePct: 7.3,
    confidence: "estimated",
  },
  {
    id: "medium",
    label: "Medium",
    shareOfUcmrSystemsPct: Math.round((4427 / (684 + 4427 + 4129)) * 1000) / 10,
    shareOfUsPopServedPct: 12,
    mclSharePct: 8.6,
    confidence: "estimated",
  },
  {
    id: "large",
    label: "Large",
    shareOfUcmrSystemsPct: Math.round((4129 / (684 + 4427 + 4129)) * 1000) / 10,
    shareOfUsPopServedPct: 80,
    mclSharePct: 15.3,
    confidence: "estimated",
  },
];

/**
 * Treatment readiness by size — estimated share of systems with GAC, IX,
 * or RO already installed for organic/emerging contaminants (not UCMR census).
 * Used to contrast detection clustering vs treatment capacity.
 */
export type TreatmentGapRow = {
  id: SizeTierId;
  label: string;
  mclSharePct: number;
  /** Estimated share with GAC / IX / RO capable of PFAS removal */
  advancedTreatmentSharePct: number;
  /** Implied untreated share among systems over MCL (editorial) */
  treatmentGapIndex: number;
  confidence: Confidence;
};

export const TREATMENT_GAP: TreatmentGapRow[] = [
  {
    id: "small",
    label: "Small (<3,300)",
    mclSharePct: 7.3,
    advancedTreatmentSharePct: 8,
    treatmentGapIndex: Math.round(7.3 * (1 - 0.08) * 10) / 10,
    confidence: "estimated",
  },
  {
    id: "medium",
    label: "Medium (3.3k–10k)",
    mclSharePct: 8.6,
    advancedTreatmentSharePct: 18,
    treatmentGapIndex: Math.round(8.6 * (1 - 0.18) * 10) / 10,
    confidence: "estimated",
  },
  {
    id: "large",
    label: "Large (>10,000)",
    mclSharePct: 15.3,
    advancedTreatmentSharePct: 35,
    treatmentGapIndex: Math.round(15.3 * (1 - 0.35) * 10) / 10,
    confidence: "estimated",
  },
];

/** Dual-axis story: detection rate climbs with size; treatment readiness also climbs — but not enough to erase the MCL gap. */
export type DualAxisRow = {
  id: SizeTierId;
  label: string;
  mclSharePct: number;
  advancedTreatmentSharePct: number;
};

export const DUAL_AXIS: DualAxisRow[] = TREATMENT_GAP.map((r) => ({
  id: r.id,
  label: r.label,
  mclSharePct: r.mclSharePct,
  advancedTreatmentSharePct: r.advancedTreatmentSharePct,
}));

/**
 * Illustrative watershed / industrial-pressure proxy by size.
 * Large systems more often draw from mixed surface supplies in industrialized basins.
 */
export type SourcePressureRow = {
  id: SizeTierId;
  label: string;
  surfaceOrMixedSharePct: number;
  groundwaterSharePct: number;
  industrialWatershedProxy: number;
  confidence: Confidence;
};

export const SOURCE_PRESSURE: SourcePressureRow[] = [
  {
    id: "small",
    label: "Small",
    surfaceOrMixedSharePct: 22,
    groundwaterSharePct: 78,
    industrialWatershedProxy: 25,
    confidence: "estimated",
  },
  {
    id: "medium",
    label: "Medium",
    surfaceOrMixedSharePct: 40,
    groundwaterSharePct: 60,
    industrialWatershedProxy: 45,
    confidence: "estimated",
  },
  {
    id: "large",
    label: "Large",
    surfaceOrMixedSharePct: 68,
    groundwaterSharePct: 32,
    industrialWatershedProxy: 78,
    confidence: "estimated",
  },
];

/** Scatter: industrial watershed proxy vs MCL share (bubble ≈ systems with full results) */
export type ScatterRow = {
  id: SizeTierId;
  label: string;
  industrialProxy: number;
  mclSharePct: number;
  systemsWithFullResults: number;
};

export const SIZE_SCATTER: ScatterRow[] = SIZE_TIER_MCL.map((r, i) => ({
  id: r.id,
  label: r.label,
  industrialProxy: SOURCE_PRESSURE[i].industrialWatershedProxy,
  mclSharePct: r.mclSharePct,
  systemsWithFullResults: r.systemsWithFullResults,
}));

export type MonitoringDesignRow = {
  id: SizeTierId;
  label: string;
  design: string;
  approxUniverse: number;
  note: string;
};

/** UCMR 5 monitoring design (fact sheet / AWIA) */
export const MONITORING_DESIGN: MonitoringDesignRow[] = [
  {
    id: "small",
    label: "Small (<3,300)",
    design: "Nationally representative sample",
    approxUniverse: 800,
    note: "Subset of ~60k+ very-small systems; results are sample-weighted carefully",
  },
  {
    id: "medium",
    label: "Medium (3.3k–10k)",
    design: "Census (all systems)",
    approxUniverse: 5_147,
    note: "AWIA expanded UCMR to this tier when appropriations allow",
  },
  {
    id: "large",
    label: "Large (>10,000)",
    design: "Census (all systems)",
    approxUniverse: 4_364,
    note: "Longstanding UCMR large-system universe",
  },
];

export const PANEL_COLORS = {
  small: "#38bdf8",
  medium: "#818cf8",
  large: "#f97316",
  treatment: "#14b8a6",
  muted: "#94a3b8",
  grid: "#e2e8f0",
} as const;
