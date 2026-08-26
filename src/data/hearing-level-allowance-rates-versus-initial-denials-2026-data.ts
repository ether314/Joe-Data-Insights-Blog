/**
 * Hearing-level (ALJ / hearing-or-above) allowance rates versus initial DDS allowances.
 *
 * Core question: How far do hearing-level allowance rates still sit above initial
 * DDS allowances, and did that gap narrow?
 *
 * Perimeter:
 * - Application-year medical allowance rates at initial vs hearing-or-above from
 *   SSA Annual Statistical Report on the DI Program (DI ASR) 2024 Tables 61 & 63
 *   (all disabled beneficiaries). Mature cohorts FY2008–FY2020 preferred; later
 *   filing years still have pending hearing decisions.
 * - Reconsideration rates from DI ASR Table 62 for the stage ladder.
 * - FY ALJ decisional allowance rates from SSA OIG, GAO, and compiled OHO
 *   public disposition summaries (Atticus aggregation of ALJ public-use files).
 * - FY2024 DDS initial / reconsideration SAOR rates (national + regions) from
 *   SSA State Agency Operations Report tables republished by NOSSCR.
 *
 * Headline: Application-year gap (hearing − initial) fell from 29.7 pp (2008
 * cohort) to ~13–14 pp (2016–2018), then edged back toward 17 pp (2020). FY2024
 * operational gap ≈ 19.7 pp (ALJ ~58% vs DDS initial 38.3%).
 */

export type Confidence = "disclosed" | "estimated" | "scenario";

export const SOURCE_NOTE =
  "Initial and hearing-or-above medical allowance rates by year of application: SSA Annual Statistical Report on the Social Security Disability Insurance Program, 2024, Tables 61 and 63 (all disabled beneficiaries); reconsideration: Table 62. Rates for recent filing years remain incomplete because hearing decisions are still pending. FY ALJ decisional allowance rates: SSA OIG A-12-11-01138 (FY2010), A-12-17-50247 (FY2015), OIG 032404 (FY2023 national average 57%); CBPP summary of SSA ALJ data (FY2008–FY2014 path); GAO-18-37; Atticus compilation of SSA OHO ALJ public disposition files (FY2018–FY2024). FY2024 DDS initial and reconsideration allowance rates by region: SSA SAOR tables (ORDP/ODP/ODSSI, Nov 1 2024) via NOSSCR. Gap = hearing-level rate − initial DDS rate (percentage points).";

export const SOURCES = [
  {
    label: "SSA DI ASR 2024 — Outcomes of Applications (Tables 60–63)",
    url: "https://www.ssa.gov/policy/docs/statcomps/di_asr/2024/sect04.html",
  },
  {
    label: "SSA OIG — Oversight of ALJ Workload Trends (A-12-11-01138)",
    url: "https://oig-files.ssa.gov/audits/full/A-12-11-01138_0.pdf",
  },
  {
    label: "SSA OIG — ALJ Allowance Rates, Quality, and Length of Service (A-12-17-50247)",
    url: "https://oig-files.ssa.gov/audits/full/A-12-17-50247.pdf",
  },
  {
    label: "SSA OIG — ALJs with Highest and Lowest Allowance Rates (032404)",
    url: "https://oig.ssa.gov/assets/uploads/032404.pdf",
  },
  {
    label: "GAO-18-37 — Accuracy and Consistency of Hearings Decisions",
    url: "https://www.gao.gov/assets/690/689209.pdf",
  },
  {
    label: "SSA OHO — Public Use / Archived Disposition Data Files",
    url: "https://www.ssa.gov/appeals/publicusefiles.html",
  },
  {
    label: "SSA SAOR FY2024 Initial & Reconsideration Allowance Rates (via NOSSCR)",
    url: "https://nosscr.org/wp-content/uploads/2024/12/FY2024-Allowance-Rates.pdf",
  },
] as const;

export const HEADLINE = {
  /** DI ASR Table 61/63 all-beneficiaries, application year 2008 */
  gapPp2008: 29.7,
  initialPct2008: 38.7,
  hearingPct2008: 68.4,
  /** Mature mid-series trough around 2016–2018 */
  gapPp2017: 13.3,
  initialPct2017: 36.6,
  hearingPct2017: 49.9,
  gapPp2018: 13.5,
  /** 2020 cohort (still some pending at higher levels) */
  gapPp2020: 17.2,
  initialPct2020: 35.9,
  hearingPct2020: 53.1,
  /** FY operational snapshot */
  aljFy2024Pct: 58,
  ddsInitialFy2024Pct: 38.3,
  reconFy2024Pct: 15.9,
  gapPpFy2024: 19.7,
  aljFy2010Pct: 67,
  aljFy2015Pct: 53.5,
  aljFy2023Pct: 57,
  gapNarrowedFromPeakPp: 16.4, // 29.7 - 13.3
  confidence: "disclosed" as Confidence,
};

export type CohortGapRow = {
  year: number;
  initialPct: number;
  reconPct: number;
  hearingPct: number;
  gapPp: number;
  /** Hearing decisions still incomplete for recent filing years */
  maturity: "mature" | "partial";
  confidence: Confidence;
};

/** DI ASR Tables 61–63 — all disabled beneficiaries, by year of application. */
export const COHORT_GAP: CohortGapRow[] = [
  { year: 2008, initialPct: 38.7, reconPct: 10.8, hearingPct: 68.4, gapPp: 29.7, maturity: "mature", confidence: "disclosed" },
  { year: 2009, initialPct: 38.5, reconPct: 9.9, hearingPct: 64.1, gapPp: 25.6, maturity: "mature", confidence: "disclosed" },
  { year: 2010, initialPct: 36.9, reconPct: 9.0, hearingPct: 59.6, gapPp: 22.7, maturity: "mature", confidence: "disclosed" },
  { year: 2011, initialPct: 35.7, reconPct: 9.0, hearingPct: 55.6, gapPp: 19.9, maturity: "mature", confidence: "disclosed" },
  { year: 2012, initialPct: 35.7, reconPct: 8.7, hearingPct: 52.1, gapPp: 16.4, maturity: "mature", confidence: "disclosed" },
  { year: 2013, initialPct: 35.4, reconPct: 8.3, hearingPct: 49.7, gapPp: 14.3, maturity: "mature", confidence: "disclosed" },
  { year: 2014, initialPct: 35.2, reconPct: 8.7, hearingPct: 49.4, gapPp: 14.2, maturity: "mature", confidence: "disclosed" },
  { year: 2015, initialPct: 35.5, reconPct: 9.5, hearingPct: 49.9, gapPp: 14.4, maturity: "mature", confidence: "disclosed" },
  { year: 2016, initialPct: 35.9, reconPct: 9.8, hearingPct: 49.8, gapPp: 13.9, maturity: "mature", confidence: "disclosed" },
  { year: 2017, initialPct: 36.6, reconPct: 10.0, hearingPct: 49.9, gapPp: 13.3, maturity: "mature", confidence: "disclosed" },
  { year: 2018, initialPct: 37.0, reconPct: 10.8, hearingPct: 50.5, gapPp: 13.5, maturity: "mature", confidence: "disclosed" },
  { year: 2019, initialPct: 36.6, reconPct: 13.3, hearingPct: 51.9, gapPp: 15.3, maturity: "mature", confidence: "disclosed" },
  { year: 2020, initialPct: 35.9, reconPct: 12.9, hearingPct: 53.1, gapPp: 17.2, maturity: "partial", confidence: "disclosed" },
  { year: 2021, initialPct: 36.1, reconPct: 13.9, hearingPct: 57.5, gapPp: 21.4, maturity: "partial", confidence: "estimated" },
];

export type FyAljRow = {
  fy: number;
  aljPct: number;
  /** DDS initial medical rate for context (DI ASR app-year aligned when FY SAOR unavailable) */
  ddsInitialPct: number;
  gapPp: number;
  confidence: Confidence;
  note?: string;
};

/**
 * FY ALJ decisional rates vs contemporaneous initial DDS rates.
 * Initial column uses DI ASR Table 61 application-year rates for the same
 * calendar year label when SAOR FY prints are unavailable; FY2024 uses SAOR.
 */
export const FY_ALJ_VS_DDS: FyAljRow[] = [
  { fy: 2008, aljPct: 63, ddsInitialPct: 38.7, gapPp: 24.3, confidence: "disclosed", note: "CBPP/SSA ALJ path" },
  { fy: 2009, aljPct: 63, ddsInitialPct: 38.5, gapPp: 24.5, confidence: "disclosed", note: "CBPP/SSA ALJ path" },
  { fy: 2010, aljPct: 67, ddsInitialPct: 36.9, gapPp: 30.1, confidence: "disclosed", note: "OIG A-12-11-01138" },
  { fy: 2011, aljPct: 56, ddsInitialPct: 35.7, gapPp: 20.3, confidence: "estimated", note: "Interpolated between OIG/ACUS prints" },
  { fy: 2012, aljPct: 50, ddsInitialPct: 35.7, gapPp: 14.3, confidence: "estimated", note: "Path toward 2014 trough" },
  { fy: 2013, aljPct: 47, ddsInitialPct: 35.4, gapPp: 11.6, confidence: "estimated", note: "Path toward 2014 trough" },
  { fy: 2014, aljPct: 45, ddsInitialPct: 35.2, gapPp: 9.8, confidence: "disclosed", note: "CBPP/SSA ALJ data" },
  { fy: 2015, aljPct: 53.5, ddsInitialPct: 35.5, gapPp: 18.0, confidence: "disclosed", note: "OIG A-12-17-50247" },
  { fy: 2016, aljPct: 54, ddsInitialPct: 35.9, gapPp: 18.1, confidence: "estimated", note: "GAO/OHO era mid-50s" },
  { fy: 2017, aljPct: 54, ddsInitialPct: 36.6, gapPp: 17.4, confidence: "estimated", note: "GAO/OHO era mid-50s" },
  { fy: 2018, aljPct: 54, ddsInitialPct: 37.0, gapPp: 17.0, confidence: "disclosed", note: "OHO public-file aggregate" },
  { fy: 2019, aljPct: 53, ddsInitialPct: 36.6, gapPp: 16.4, confidence: "disclosed", note: "OHO public-file aggregate" },
  { fy: 2020, aljPct: 54, ddsInitialPct: 35.9, gapPp: 18.1, confidence: "disclosed", note: "OHO public-file aggregate" },
  { fy: 2021, aljPct: 52, ddsInitialPct: 36.1, gapPp: 15.9, confidence: "disclosed", note: "OHO public-file aggregate" },
  { fy: 2022, aljPct: 54, ddsInitialPct: 35.6, gapPp: 18.4, confidence: "disclosed", note: "OHO public-file aggregate" },
  { fy: 2023, aljPct: 57, ddsInitialPct: 37.1, gapPp: 19.9, confidence: "disclosed", note: "OIG 032404 national avg" },
  { fy: 2024, aljPct: 58, ddsInitialPct: 38.3, gapPp: 19.7, confidence: "disclosed", note: "OHO aggregate + SAOR" },
];

export type StageLadderRow = {
  stage: string;
  ratePct: number;
  shortLabel: string;
};

/** FY2024 operational stage ladder (DDS SAOR + ALJ aggregate). */
export const STAGE_LADDER_FY2024: StageLadderRow[] = [
  { stage: "Initial (DDS)", shortLabel: "Initial", ratePct: 38.3 },
  { stage: "Reconsideration", shortLabel: "Recon", ratePct: 15.9 },
  { stage: "Hearing (ALJ)", shortLabel: "Hearing", ratePct: 58.0 },
];

export type RegionFilter = "all" | "northeast" | "south" | "midwest" | "west";

export type RegionRateRow = {
  region: string;
  regionKey: RegionFilter;
  initialPct: number;
  reconPct: number;
  /** Approximate hearing-office allowance context from national ALJ avg for gap viz */
  gapVsNationalAljPp: number;
};

/** FY2024 SAOR regional initial / recon rates; gap vs national ALJ 58%. */
export const REGION_RATES: RegionRateRow[] = [
  { region: "Boston", regionKey: "northeast", initialPct: 42.4, reconPct: 18.4, gapVsNationalAljPp: 15.6 },
  { region: "New York", regionKey: "northeast", initialPct: 39.1, reconPct: 16.2, gapVsNationalAljPp: 18.9 },
  { region: "Philadelphia", regionKey: "northeast", initialPct: 39.0, reconPct: 15.8, gapVsNationalAljPp: 19.0 },
  { region: "Atlanta", regionKey: "south", initialPct: 35.9, reconPct: 15.3, gapVsNationalAljPp: 22.1 },
  { region: "Chicago", regionKey: "midwest", initialPct: 38.6, reconPct: 14.8, gapVsNationalAljPp: 19.4 },
  { region: "Dallas", regionKey: "south", initialPct: 37.5, reconPct: 16.0, gapVsNationalAljPp: 20.5 },
  { region: "Kansas City", regionKey: "midwest", initialPct: 43.7, reconPct: 15.2, gapVsNationalAljPp: 14.3 },
  { region: "Denver", regionKey: "west", initialPct: 38.5, reconPct: 13.8, gapVsNationalAljPp: 19.5 },
  { region: "San Francisco", regionKey: "west", initialPct: 37.9, reconPct: 19.1, gapVsNationalAljPp: 20.1 },
  { region: "Seattle", regionKey: "west", initialPct: 40.7, reconPct: 15.2, gapVsNationalAljPp: 17.3 },
];

export const REGION_OPTIONS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "northeast", label: "Northeast" },
  { id: "south", label: "South" },
  { id: "midwest", label: "Midwest" },
  { id: "west", label: "West" },
];

export function filterRegions(region: RegionFilter): RegionRateRow[] {
  if (region === "all") return REGION_RATES;
  return REGION_RATES.filter((r) => r.regionKey === region);
}

export type ProgramMixRow = {
  program: string;
  initialPct: number;
  hearingPct: number;
  gapPp: number;
  year: number;
};

/** DI ASR 2018 mature cohort — Social Security-only vs concurrent (Tables 61/63). */
export const PROGRAM_MIX_2018: ProgramMixRow[] = [
  { program: "SS-only", initialPct: 46.0, hearingPct: 58.8, gapPp: 12.8, year: 2018 },
  { program: "Concurrent", initialPct: 24.2, hearingPct: 41.7, gapPp: 17.5, year: 2018 },
  { program: "All programs", initialPct: 37.0, hearingPct: 50.5, gapPp: 13.5, year: 2018 },
];

export type GapScatterRow = {
  year: number;
  initialPct: number;
  hearingPct: number;
  gapPp: number;
  maturity: "mature" | "partial";
};

export const GAP_SCATTER: GapScatterRow[] = COHORT_GAP.map((r) => ({
  year: r.year,
  initialPct: r.initialPct,
  hearingPct: r.hearingPct,
  gapPp: r.gapPp,
  maturity: r.maturity,
}));

export const ANALYTICS = {
  peakGapYear: 2008,
  troughGapYear: 2017,
  peakGapPp: 29.7,
  troughGapPp: 13.3,
  fy2024GapPp: 19.7,
  cohortGapCutPp: 16.4,
  aljDropFy2010to2014: 22, // 67 - 45
  aljReboundFy2014to2024: 13, // 58 - 45
  nationalInitialFy2024: 38.3,
  nationalReconFy2024: 15.9,
  nationalAljFy2024: 58,
};

export function matureCohortsOnly(rows: CohortGapRow[] = COHORT_GAP): CohortGapRow[] {
  return rows.filter((r) => r.maturity === "mature");
}
