/**
 * CMS PBJ hours per resident day versus the federal floor (2026).
 *
 * Core question: What share of certified nursing homes still sit below
 * the CMS staffing HPRD standard in the latest PBJ quarter?
 *
 * Primary anchors: CMS Payroll-Based Journal (PBJ) daily nurse staffing
 * public use files / Care Compare provider staffing fields; ASPE May 2024
 * nurse-staffing estimates relative to CMS-3442-F floors; MedPAC SNF
 * payment-adequacy chapters for RN HPRD context. The 3.48 / 0.55 / 2.45
 * HPRD floors are the April 2024 final-rule numerical standards (later
 * repealed as enforceable minimums in Dec 2025) — used here as the
 * published federal benchmark against which PBJ hours are scored.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Facility HPRD and national/state averages follow CMS Payroll-Based " +
  "Journal (PBJ) nurse staffing submissions as published in Care Compare " +
  "provider files and summarized for Q4 2024 (14,573 reporting homes; " +
  "national total nurse staff 3.75 HPRD; 64.4% of providers ≥ 3.48 HPRD). " +
  "Share-below-floor figures for the RN (0.55) and nurse-aide (2.45) " +
  "component standards, and ownership / size / urban-rural splits, follow " +
  "ASPE’s May 2024 Care Compare brief (N≈14,413). MedPAC’s March 2026 SNF " +
  "chapter supplies case-mix-adjusted median RN HPRD context. State " +
  "below-floor shares for the 3.48 total standard are desk estimates " +
  "calibrated to each state’s mean total nurse HPRD and the national " +
  "35.6% below-floor rate — not a CMS state table. The numerical floors " +
  "are those in CMS-3442-F (Apr 2024); CMS repealed those numerical " +
  "minimums in Dec 2025 while leaving enhanced facility-assessment " +
  "language in place.";

export const SOURCES = [
  {
    label: "CMS — Payroll-Based Journal staffing data",
    url: "https://www.cms.gov/medicare/quality/nursing-home-improvement/staffing-data-submission",
  },
  {
    label: "CMS — Minimum staffing standards final rule (CMS-3442-F)",
    url: "https://www.cms.gov/newsroom/fact-sheets/medicare-and-medicaid-programs-minimum-staffing-standards-long-term-care-facilities-and-medicaid-0",
  },
  {
    label: "ASPE — Nurse staffing estimates, May 2024",
    url: "https://aspe.hhs.gov/sites/default/files/documents/8e343af705b07063ad7effcc84ba370a/nurse-staffing-estimates-us-nhs.pdf",
  },
  {
    label: "MedPAC — SNF payment adequacy (March 2026 Ch. 7)",
    url: "https://www.medpac.gov/wp-content/uploads/2026/03/Mar26_Ch7_MedPAC_Report_To_Congress_SEC.pdf",
  },
  {
    label: "LTCCC / NursingHome411 — Q4 2024 PBJ state summary",
    url: "https://nursinghome411.org/data/staffing/staffing-q4-2024/",
  },
] as const;

export const VIZ_MARKERS = [
  "Share below HPRD floor",
  "Floor gap by staff type",
  "Mean HPRD vs floor line",
] as const;

/** Headline punchline — share of homes below the 3.48 total HPRD floor */
export const HEADLINE = {
  /** Homes reporting PBJ in Q4 2024 */
  reportingHomes: 14573,
  /** National mean total nurse staff HPRD (Q4 2024) */
  meanTotalHprd: 3.75,
  /** National mean RN HPRD (Q4 2024, incl. admin/DON in LTCCC total RN) */
  meanRnHprd: 0.61,
  /** Share of providers at or above 3.48 total HPRD (Q4 2024) */
  atOrAbove348Pct: 64.4,
  /** Share still below the 3.48 floor — core answer */
  below348Pct: 35.6,
  /** Homes implied below floor (rounded) */
  homesBelowFloor: 5190,
  /** ASPE May 2024: share below NA 2.45 HPRD */
  belowNaPct: 70,
  /** ASPE May 2024: share below RN 0.55 HPRD */
  belowRnPct: 50,
  /** ASPE May 2024: share below total 3.48 (earlier vintage) */
  aspeBelow348Pct: 41,
  /** For-profit share below total 3.48 (ASPE: 100−52) */
  forProfitBelow348Pct: 48,
  /** Nonprofit share below total 3.48 (ASPE: 100−80) */
  nonprofitBelow348Pct: 20,
  /** Federal total floor */
  floorTotal: 3.48,
  /** Federal RN floor */
  floorRn: 0.55,
  /** Federal nurse-aide floor */
  floorNa: 2.45,
  /** MedPAC 2024 median case-mix-adjusted RN HPRD */
  medpacMedianRn: 0.5,
  /** MDS daily average census (millions), Q4 2024 */
  mdsCensusM: 1.23,
} as const;

export type StaffMetric = "total" | "rn" | "na";

export type OwnershipId = "for-profit" | "nonprofit" | "government";

export type SizeBand =
  | "0–49"
  | "50–99"
  | "100–149"
  | "150–199"
  | "200+";

export type RegionId =
  | "Northeast"
  | "Midwest"
  | "South"
  | "West";

/** CMS-3442-F numerical floors (HPRD) */
export const FLOORS = {
  total: 3.48,
  rn: 0.55,
  na: 2.45,
  rnHoursPerDayApprox: 24,
} as const;

/** National compliance / gap snapshot by standard */
export const FLOOR_GAP_ROWS: Array<{
  id: StaffMetric | "rn24";
  label: string;
  floor: number;
  unit: "HPRD" | "hrs/day";
  atOrAbovePct: number;
  belowPct: number;
  meanValue: number;
  vintage: string;
  confidence: Confidence;
}> = [
  {
    id: "total",
    label: "Total nurse staff",
    floor: 3.48,
    unit: "HPRD",
    atOrAbovePct: 64.4,
    belowPct: 35.6,
    meanValue: 3.75,
    vintage: "Q4 2024 PBJ",
    confidence: "disclosed",
  },
  {
    id: "rn",
    label: "Registered nurse",
    floor: 0.55,
    unit: "HPRD",
    atOrAbovePct: 50,
    belowPct: 50,
    meanValue: 0.65,
    vintage: "May 2024 ASPE",
    confidence: "disclosed",
  },
  {
    id: "na",
    label: "Nurse aide",
    floor: 2.45,
    unit: "HPRD",
    atOrAbovePct: 30,
    belowPct: 70,
    meanValue: 2.26,
    vintage: "May 2024 ASPE",
    confidence: "disclosed",
  },
  {
    id: "rn24",
    label: "≥24 RN hours / facility-day",
    floor: 24,
    unit: "hrs/day",
    atOrAbovePct: 78,
    belowPct: 22,
    meanValue: 48,
    vintage: "May 2024 ASPE",
    confidence: "disclosed",
  },
];

/** Ownership splits — share at/above each HPRD floor (ASPE May 2024) */
export const OWNERSHIP_COMPLIANCE: Array<{
  ownership: OwnershipId;
  label: string;
  atOrAboveNaPct: number;
  atOrAboveRnPct: number;
  atOrAboveTotalPct: number;
  belowTotalPct: number;
  confidence: Confidence;
}> = [
  {
    ownership: "for-profit",
    label: "For-profit",
    atOrAboveNaPct: 22,
    atOrAboveRnPct: 42,
    atOrAboveTotalPct: 52,
    belowTotalPct: 48,
    confidence: "disclosed",
  },
  {
    ownership: "nonprofit",
    label: "Nonprofit",
    atOrAboveNaPct: 51,
    atOrAboveRnPct: 74,
    atOrAboveTotalPct: 80,
    belowTotalPct: 20,
    confidence: "disclosed",
  },
  {
    ownership: "government",
    label: "Government",
    atOrAboveNaPct: 38,
    atOrAboveRnPct: 58,
    atOrAboveTotalPct: 66,
    belowTotalPct: 34,
    confidence: "estimated",
  },
];

/** Size-band means and share at/above total floor (ASPE-informed) */
export const SIZE_BAND_ROWS: Array<{
  band: SizeBand;
  meanTotalHprd: number;
  meanRnHprd: number;
  meanNaHprd: number;
  atOrAboveTotalPct: number;
  belowTotalPct: number;
  confidence: Confidence;
}> = [
  {
    band: "0–49",
    meanTotalHprd: 4.35,
    meanRnHprd: 0.92,
    meanNaHprd: 2.55,
    atOrAboveTotalPct: 79,
    belowTotalPct: 21,
    confidence: "disclosed",
  },
  {
    band: "50–99",
    meanTotalHprd: 3.95,
    meanRnHprd: 0.72,
    meanNaHprd: 2.35,
    atOrAboveTotalPct: 68,
    belowTotalPct: 32,
    confidence: "estimated",
  },
  {
    band: "100–149",
    meanTotalHprd: 3.7,
    meanRnHprd: 0.6,
    meanNaHprd: 2.2,
    atOrAboveTotalPct: 55,
    belowTotalPct: 45,
    confidence: "estimated",
  },
  {
    band: "150–199",
    meanTotalHprd: 3.55,
    meanRnHprd: 0.55,
    meanNaHprd: 2.1,
    atOrAboveTotalPct: 48,
    belowTotalPct: 52,
    confidence: "estimated",
  },
  {
    band: "200+",
    meanTotalHprd: 3.45,
    meanRnHprd: 0.52,
    meanNaHprd: 2.05,
    atOrAboveTotalPct: 44,
    belowTotalPct: 56,
    confidence: "estimated",
  },
];

/** Urban vs rural (ASPE May 2024) */
export const URBAN_RURAL: Array<{
  id: "urban" | "rural";
  label: string;
  atOrAboveNaPct: number;
  atOrAboveRnPct: number;
  atOrAboveTotalPct: number;
  atOrAboveRn24Pct: number;
  belowTotalPct: number;
  confidence: Confidence;
}> = [
  {
    id: "urban",
    label: "Urban",
    atOrAboveNaPct: 28,
    atOrAboveRnPct: 49,
    atOrAboveTotalPct: 61,
    atOrAboveRn24Pct: 82,
    belowTotalPct: 39,
    confidence: "disclosed",
  },
  {
    id: "rural",
    label: "Rural",
    atOrAboveNaPct: 34,
    atOrAboveRnPct: 52,
    atOrAboveTotalPct: 55,
    atOrAboveRn24Pct: 68,
    belowTotalPct: 45,
    confidence: "disclosed",
  },
];

/**
 * Quarterly path of share at/above 3.48 (LTCCC national summaries).
 * Q4 2024 disclosed; earlier quarters carried/estimated from adjacent prints.
 */
export const QUARTERLY_PATH: Array<{
  quarter: string;
  meanTotalHprd: number;
  atOrAbove348Pct: number;
  below348Pct: number;
  confidence: Confidence;
}> = [
  { quarter: "Q1 2023", meanTotalHprd: 3.62, atOrAbove348Pct: 56.8, below348Pct: 43.2, confidence: "estimated" },
  { quarter: "Q2 2023", meanTotalHprd: 3.65, atOrAbove348Pct: 58.1, below348Pct: 41.9, confidence: "estimated" },
  { quarter: "Q3 2023", meanTotalHprd: 3.68, atOrAbove348Pct: 59.4, below348Pct: 40.6, confidence: "estimated" },
  { quarter: "Q4 2023", meanTotalHprd: 3.7, atOrAbove348Pct: 60.5, below348Pct: 39.5, confidence: "estimated" },
  { quarter: "Q1 2024", meanTotalHprd: 3.71, atOrAbove348Pct: 61.2, below348Pct: 38.8, confidence: "estimated" },
  { quarter: "Q2 2024", meanTotalHprd: 3.72, atOrAbove348Pct: 62.0, below348Pct: 38.0, confidence: "carried" },
  { quarter: "Q3 2024", meanTotalHprd: 3.73, atOrAbove348Pct: 63.4, below348Pct: 36.6, confidence: "disclosed" },
  { quarter: "Q4 2024", meanTotalHprd: 3.75, atOrAbove348Pct: 64.4, below348Pct: 35.6, confidence: "disclosed" },
];

/** Distribution of homes by distance to the 3.48 floor (desk bands) */
export const GAP_BANDS: Array<{
  id: string;
  label: string;
  /** Midpoint HPRD for scatter/axis */
  midHprd: number;
  sharePct: number;
  homes: number;
  confidence: Confidence;
}> = [
  { id: "deep", label: "< 2.80", midHprd: 2.55, sharePct: 8.2, homes: 1195, confidence: "estimated" },
  { id: "low", label: "2.80–3.19", midHprd: 3.0, sharePct: 12.4, homes: 1807, confidence: "estimated" },
  { id: "near-below", label: "3.20–3.47", midHprd: 3.34, sharePct: 15.0, homes: 2186, confidence: "estimated" },
  { id: "at-floor", label: "3.48–3.79", midHprd: 3.64, sharePct: 22.8, homes: 3323, confidence: "estimated" },
  { id: "comfort", label: "3.80–4.49", midHprd: 4.15, sharePct: 26.1, homes: 3804, confidence: "estimated" },
  { id: "high", label: "≥ 4.50", midHprd: 5.1, sharePct: 15.5, homes: 2258, confidence: "estimated" },
];

export type StateRow = {
  state: string;
  region: RegionId;
  /** Average daily MDS census */
  census: number;
  /** Mean total nurse staff HPRD (Q4 2024 LTCCC) */
  meanTotalHprd: number;
  /** Mean RN HPRD where available — desk carry from national RN/total ratio when missing */
  meanRnHprd: number;
  /** Desk estimate: % of providers below 3.48 total HPRD */
  below348Pct: number;
  /** % of providers ≥ 4.1 HPRD (LTCCC disclosed) */
  atOrAbove41Pct: number;
  /** Contract staff share of nurse hours (%) */
  contractPct: number;
  confidence: Confidence;
};

/**
 * State panel — mean HPRD and ≥4.1% from LTCCC Q4 2024;
 * below348Pct estimated from mean vs national distribution.
 */
export const STATE_PANEL: StateRow[] = [
  { state: "AK", region: "West", census: 579, meanTotalHprd: 6.16, meanRnHprd: 1.35, below348Pct: 2, atOrAbove41Pct: 100, contractPct: 12.6, confidence: "estimated" },
  { state: "AL", region: "South", census: 21556, meanTotalHprd: 3.87, meanRnHprd: 0.58, below348Pct: 28, atOrAbove41Pct: 37.67, contractPct: 1.08, confidence: "estimated" },
  { state: "AR", region: "South", census: 16452, meanTotalHprd: 4.09, meanRnHprd: 0.55, below348Pct: 22, atOrAbove41Pct: 38.25, contractPct: 1.92, confidence: "estimated" },
  { state: "AZ", region: "West", census: 11554, meanTotalHprd: 4.02, meanRnHprd: 0.72, below348Pct: 24, atOrAbove41Pct: 38.57, contractPct: 3.25, confidence: "estimated" },
  { state: "CA", region: "West", census: 99596, meanTotalHprd: 4.3, meanRnHprd: 0.78, below348Pct: 18, atOrAbove41Pct: 57.31, contractPct: 2.96, confidence: "estimated" },
  { state: "CO", region: "West", census: 14851, meanTotalHprd: 3.67, meanRnHprd: 0.68, below348Pct: 38, atOrAbove41Pct: 27.75, contractPct: 8.28, confidence: "estimated" },
  { state: "CT", region: "Northeast", census: 19581, meanTotalHprd: 3.67, meanRnHprd: 0.62, below348Pct: 39, atOrAbove41Pct: 20.41, contractPct: 5.77, confidence: "estimated" },
  { state: "DE", region: "Northeast", census: 3817, meanTotalHprd: 4.12, meanRnHprd: 0.7, below348Pct: 21, atOrAbove41Pct: 32.56, contractPct: 6.84, confidence: "estimated" },
  { state: "FL", region: "South", census: 73823, meanTotalHprd: 3.78, meanRnHprd: 0.58, below348Pct: 33, atOrAbove41Pct: 20.06, contractPct: 1.8, confidence: "estimated" },
  { state: "GA", region: "South", census: 31070, meanTotalHprd: 3.48, meanRnHprd: 0.48, below348Pct: 52, atOrAbove41Pct: 13.31, contractPct: 3.94, confidence: "estimated" },
  { state: "HI", region: "West", census: 3361, meanTotalHprd: 4.52, meanRnHprd: 0.95, below348Pct: 12, atOrAbove41Pct: 69.05, contractPct: 8.27, confidence: "estimated" },
  { state: "IA", region: "Midwest", census: 20049, meanTotalHprd: 3.8, meanRnHprd: 0.6, below348Pct: 32, atOrAbove41Pct: 26.14, contractPct: 5.71, confidence: "estimated" },
  { state: "ID", region: "West", census: 4314, meanTotalHprd: 3.93, meanRnHprd: 0.72, below348Pct: 27, atOrAbove41Pct: 33.75, contractPct: 6.45, confidence: "estimated" },
  { state: "IL", region: "Midwest", census: 61437, meanTotalHprd: 3.27, meanRnHprd: 0.55, below348Pct: 58, atOrAbove41Pct: 17.11, contractPct: 7.96, confidence: "estimated" },
  { state: "IN", region: "Midwest", census: 35809, meanTotalHprd: 3.64, meanRnHprd: 0.52, below348Pct: 42, atOrAbove41Pct: 16.93, contractPct: 3.72, confidence: "estimated" },
  { state: "KS", region: "Midwest", census: 14879, meanTotalHprd: 3.97, meanRnHprd: 0.58, below348Pct: 26, atOrAbove41Pct: 40.07, contractPct: 5.99, confidence: "estimated" },
  { state: "KY", region: "South", census: 21067, meanTotalHprd: 3.87, meanRnHprd: 0.55, below348Pct: 30, atOrAbove41Pct: 24.15, contractPct: 4.7, confidence: "estimated" },
  { state: "LA", region: "South", census: 23473, meanTotalHprd: 3.69, meanRnHprd: 0.48, below348Pct: 40, atOrAbove41Pct: 16.54, contractPct: 3.83, confidence: "estimated" },
  { state: "MA", region: "Northeast", census: 32662, meanTotalHprd: 3.81, meanRnHprd: 0.68, below348Pct: 31, atOrAbove41Pct: 23.82, contractPct: 7.15, confidence: "estimated" },
  { state: "MD", region: "Northeast", census: 22962, meanTotalHprd: 3.74, meanRnHprd: 0.65, below348Pct: 34, atOrAbove41Pct: 21.92, contractPct: 9.38, confidence: "estimated" },
  { state: "ME", region: "Northeast", census: 4993, meanTotalHprd: 4.33, meanRnHprd: 0.85, below348Pct: 16, atOrAbove41Pct: 61.04, contractPct: 13.23, confidence: "estimated" },
  { state: "MI", region: "Midwest", census: 35010, meanTotalHprd: 3.95, meanRnHprd: 0.62, below348Pct: 27, atOrAbove41Pct: 32.54, contractPct: 2.95, confidence: "estimated" },
  { state: "MN", region: "Midwest", census: 19966, meanTotalHprd: 4.19, meanRnHprd: 0.78, below348Pct: 19, atOrAbove41Pct: 50, contractPct: 6.7, confidence: "estimated" },
  { state: "MO", region: "Midwest", census: 34125, meanTotalHprd: 3.3, meanRnHprd: 0.48, below348Pct: 56, atOrAbove41Pct: 13.71, contractPct: 4.44, confidence: "estimated" },
  { state: "MS", region: "South", census: 14620, meanTotalHprd: 4.06, meanRnHprd: 0.55, below348Pct: 23, atOrAbove41Pct: 44.44, contractPct: 5.31, confidence: "estimated" },
  { state: "MT", region: "West", census: 3220, meanTotalHprd: 3.79, meanRnHprd: 0.7, below348Pct: 31, atOrAbove41Pct: 37.93, contractPct: 13.34, confidence: "estimated" },
  { state: "NC", region: "South", census: 34976, meanTotalHprd: 3.66, meanRnHprd: 0.52, below348Pct: 41, atOrAbove41Pct: 20.73, contractPct: 9.23, confidence: "estimated" },
  { state: "ND", region: "Midwest", census: 4508, meanTotalHprd: 4.57, meanRnHprd: 0.82, below348Pct: 11, atOrAbove41Pct: 71.23, contractPct: 13.26, confidence: "estimated" },
  { state: "NE", region: "Midwest", census: 9637, meanTotalHprd: 4.05, meanRnHprd: 0.65, below348Pct: 24, atOrAbove41Pct: 40.56, contractPct: 9.04, confidence: "estimated" },
  { state: "NH", region: "Northeast", census: 5925, meanTotalHprd: 3.69, meanRnHprd: 0.68, below348Pct: 38, atOrAbove41Pct: 33.78, contractPct: 15.13, confidence: "estimated" },
  { state: "NJ", region: "Northeast", census: 40846, meanTotalHprd: 3.69, meanRnHprd: 0.6, below348Pct: 39, atOrAbove41Pct: 25.65, contractPct: 13.47, confidence: "estimated" },
  { state: "NM", region: "West", census: 5355, meanTotalHprd: 3.36, meanRnHprd: 0.55, below348Pct: 54, atOrAbove41Pct: 19.4, contractPct: 8.49, confidence: "estimated" },
  { state: "NV", region: "West", census: 5912, meanTotalHprd: 3.85, meanRnHprd: 0.65, below348Pct: 29, atOrAbove41Pct: 46.15, contractPct: 4.05, confidence: "estimated" },
  { state: "NY", region: "Northeast", census: 97924, meanTotalHprd: 3.59, meanRnHprd: 0.58, below348Pct: 44, atOrAbove41Pct: 18.12, contractPct: 11.85, confidence: "estimated" },
  { state: "OH", region: "Midwest", census: 66337, meanTotalHprd: 3.64, meanRnHprd: 0.52, below348Pct: 42, atOrAbove41Pct: 19.13, contractPct: 5.27, confidence: "estimated" },
  { state: "OK", region: "South", census: 16395, meanTotalHprd: 3.77, meanRnHprd: 0.5, below348Pct: 34, atOrAbove41Pct: 23.81, contractPct: 2.91, confidence: "estimated" },
  { state: "OR", region: "West", census: 6731, meanTotalHprd: 5.04, meanRnHprd: 0.95, below348Pct: 5, atOrAbove41Pct: 94.44, contractPct: 9.99, confidence: "estimated" },
  { state: "PA", region: "Northeast", census: 66873, meanTotalHprd: 3.73, meanRnHprd: 0.62, below348Pct: 35, atOrAbove41Pct: 29.12, contractPct: 14.14, confidence: "estimated" },
  { state: "RI", region: "Northeast", census: 6775, meanTotalHprd: 3.7, meanRnHprd: 0.65, below348Pct: 37, atOrAbove41Pct: 16.67, contractPct: 5.06, confidence: "estimated" },
  { state: "SC", region: "South", census: 16493, meanTotalHprd: 3.63, meanRnHprd: 0.52, below348Pct: 42, atOrAbove41Pct: 27.87, contractPct: 5.99, confidence: "estimated" },
  { state: "SD", region: "Midwest", census: 4798, meanTotalHprd: 3.77, meanRnHprd: 0.7, below348Pct: 32, atOrAbove41Pct: 23.4, contractPct: 9.49, confidence: "estimated" },
  { state: "TN", region: "South", census: 24722, meanTotalHprd: 3.77, meanRnHprd: 0.52, below348Pct: 34, atOrAbove41Pct: 21.78, contractPct: 4.6, confidence: "estimated" },
  { state: "TX", region: "South", census: 86380, meanTotalHprd: 3.33, meanRnHprd: 0.45, below348Pct: 55, atOrAbove41Pct: 10.14, contractPct: 2.81, confidence: "estimated" },
  { state: "UT", region: "West", census: 5655, meanTotalHprd: 3.89, meanRnHprd: 0.72, below348Pct: 28, atOrAbove41Pct: 30.61, contractPct: 4.32, confidence: "estimated" },
  { state: "VA", region: "South", census: 28245, meanTotalHprd: 3.54, meanRnHprd: 0.55, below348Pct: 46, atOrAbove41Pct: 20.76, contractPct: 5.29, confidence: "estimated" },
  { state: "VT", region: "Northeast", census: 2338, meanTotalHprd: 4.06, meanRnHprd: 0.85, below348Pct: 22, atOrAbove41Pct: 40.63, contractPct: 26.45, confidence: "estimated" },
  { state: "WA", region: "West", census: 13613, meanTotalHprd: 4.29, meanRnHprd: 0.82, below348Pct: 17, atOrAbove41Pct: 56.15, contractPct: 5.9, confidence: "estimated" },
  { state: "WI", region: "Midwest", census: 17471, meanTotalHprd: 4.05, meanRnHprd: 0.72, below348Pct: 24, atOrAbove41Pct: 42.86, contractPct: 10.2, confidence: "estimated" },
  { state: "WV", region: "South", census: 9485, meanTotalHprd: 3.55, meanRnHprd: 0.52, below348Pct: 45, atOrAbove41Pct: 18.85, contractPct: 5.38, confidence: "estimated" },
  { state: "WY", region: "West", census: 1947, meanTotalHprd: 3.7, meanRnHprd: 0.68, below348Pct: 36, atOrAbove41Pct: 27.27, contractPct: 6.71, confidence: "estimated" },
];

/** Illustrative 100-bed facility gap (ASPE Table 1) */
export const ILLUSTRATIVE_100BED = [
  {
    metric: "Nurse aide HPRD",
    floor: 2.45,
    meanAmongBelow: 1.97,
    addPerShift: 2.0,
    nBelow: 271,
  },
  {
    metric: "RN HPRD",
    floor: 0.55,
    meanAmongBelow: 0.38,
    addPerShift: 0.7,
    nBelow: 211,
  },
  {
    metric: "Total nurse HPRD",
    floor: 3.48,
    meanAmongBelow: 3.07,
    addPerShift: 1.7,
    nBelow: 157,
  },
] as const;

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHprd(n: number, digits = 2): string {
  return n.toFixed(digits);
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function statesByRegion(region: RegionId | "all"): StateRow[] {
  if (region === "all") return STATE_PANEL;
  return STATE_PANEL.filter((s) => s.region === region);
}

export function stateLadder(
  metric: "below348Pct" | "meanTotalHprd" | "atOrAbove41Pct",
  region: RegionId | "all" = "all",
  limit = 15,
): StateRow[] {
  const rows = [...statesByRegion(region)];
  rows.sort((a, b) => b[metric] - a[metric]);
  return rows.slice(0, limit);
}

export function regionSummary(): Array<{
  region: RegionId;
  meanTotalHprd: number;
  below348Pct: number;
  census: number;
  states: number;
}> {
  const regions: RegionId[] = ["Northeast", "Midwest", "South", "West"];
  return regions.map((region) => {
    const rows = STATE_PANEL.filter((s) => s.region === region);
    const census = rows.reduce((s, r) => s + r.census, 0);
    const meanTotalHprd =
      rows.reduce((s, r) => s + r.meanTotalHprd * r.census, 0) / census;
    const below348Pct =
      rows.reduce((s, r) => s + r.below348Pct * r.census, 0) / census;
    return {
      region,
      meanTotalHprd: Math.round(meanTotalHprd * 100) / 100,
      below348Pct: Math.round(below348Pct * 10) / 10,
      census,
      states: rows.length,
    };
  });
}
