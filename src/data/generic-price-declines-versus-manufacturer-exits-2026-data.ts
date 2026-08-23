/**
 * Generic price declines versus manufacturer exits (2026).
 *
 * Core question: Did sustained generic price erosion precede manufacturer
 * exits and the shortages that followed?
 *
 * Perimeter: SSR Health–style multi-source generic price indexes (oral solids
 * and sterile injectables, WAC/NADAC blended where disclosed); FDA Drug
 * Shortages Database active/resolved counts; Orange Book / NDC discontinuation
 * and ANDA holder exit proxies; FDA Drug Shortages Task Force / root-cause
 * report attribution shares. Analytical composites for desk use — not a
 * substitute for invoice audits or product-level ANDA dockets.
 *
 * Headline: Price decline vs exit lag — after the 2015–2019 oral-solid index
 * fell ~62% peak-to-trough, manufacturer exits peaked ~6–8 quarters later;
 * sterile injectable shortages rose hardest where price floors were thinnest.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Generic price indexes: SSR Health–style multi-source composites of oral-solid and sterile-injectable list/net proxies (WAC where disclosed; NADAC/ASP blended for reimbursement-facing series), indexed to 2012=100. Manufacturer exits: annual counts of ANDA-holder market withdrawals and NDC discontinuations for multi-source generics (Orange Book / FDA listing proxies; estimated for mid-year interpolations). Shortages: FDA Drug Shortages Database active listings at year-end plus newly reported events. Root-cause shares: FDA Drug Shortages Task Force / agency root-cause report attribution categories (quality, economic, demand surge, other), carried forward where annual updates lag. Series are desk composites, not product-level invoice or ANDA docket reconstructions.";

export const SOURCES = [
  {
    label: "SSR Health — US brand and generic pricing",
    url: "https://www.ssrhealth.com/",
  },
  {
    label: "FDA — Drug Shortages Database",
    url: "https://www.accessdata.fda.gov/scripts/drugshortages/",
  },
  {
    label: "FDA — Drug Shortages Task Force / root causes",
    url: "https://www.fda.gov/drugs/drug-safety-and-availability/drug-shortages",
  },
  {
    label: "FDA — Orange Book (Approved Drug Products)",
    url: "https://www.fda.gov/drugs/drug-approvals-and-databases/approved-drug-products-therapeutic-equivalence-evaluations-orange-book",
  },
  {
    label: "CMS — NADAC (National Average Drug Acquisition Cost)",
    url: "https://www.medicaid.gov/medicaid/prescription-drugs/pharmacy-pricing/index.html",
  },
] as const;

/** Headline punchline — Price decline vs exit lag */
export const HEADLINE = {
  /** Oral-solid generic index peak-to-trough decline 2015→2019 (%) */
  oralSolidDropPct: 62,
  /** Oral-solid index at 2012=100 peak (2014) */
  oralSolidPeak: 108,
  /** Oral-solid index trough (2019) */
  oralSolidTrough: 41,
  /** Oral-solid index mid-2026 */
  oralSolid2026: 48,
  /** Sterile injectable index peak-to-trough 2014→2020 (%) */
  injectableDropPct: 44,
  /** Injectable index mid-2026 (2012=100) */
  injectable2026: 58,
  /** Peak annual manufacturer exits (ANDA holder withdrawals + NDC disc.) */
  exitsPeakYear: 2021,
  /** Peak annual exit count */
  exitsPeakCount: 1840,
  /** Exit count in 2015 (pre-trough) */
  exits2015: 720,
  /** Approx. lag from price trough to exit peak (quarters) */
  lagQuarters: 7,
  /** FDA active shortage listings year-end 2019 */
  shortages2019: 118,
  /** FDA active shortage listings year-end 2023 */
  shortages2023: 168,
  /** Share of shortage root causes classified economic (%) */
  economicRootSharePct: 38,
  /** Share classified quality/manufacturing (%) */
  qualityRootSharePct: 42,
  /** Correlation: oral-solid index vs exits, lagged 6–8Q */
  priceExitCorrLag: -0.78,
  confidence: "carried" as Confidence,
};

export const VIZ_MARKERS = [
  "Price decline vs exit lag",
  "SSR indexes · FDA exits · shortage tape",
] as const;

export type SegmentId = "oral-solid" | "injectable" | "combined";
export type TherapeuticClass =
  | "anti-infectives"
  | "cardiovascular"
  | "CNS"
  | "oncology-supportive"
  | "anesthetics"
  | "other";

export interface AnnualTapeRow {
  year: number;
  /** Oral solid generic price index, 2012=100 */
  oralSolidIndex: number;
  /** Sterile injectable generic price index, 2012=100 */
  injectableIndex: number;
  /** Combined multi-source generic index, 2012=100 */
  combinedIndex: number;
  /** Manufacturer exits (ANDA withdrawals + NDC discontinuations) */
  exits: number;
  /** FDA active shortage listings at year-end */
  shortagesActive: number;
  /** Newly reported shortage events during year */
  shortagesNew: number;
  /** Median manufacturers per multi-source oral solid NDC family */
  medianMfrOral: number;
  /** Median manufacturers per multi-source injectable NDC family */
  medianMfrInj: number;
}

/** Annual tape 2012–2026 */
export const ANNUAL_TAPE: AnnualTapeRow[] = [
  { year: 2012, oralSolidIndex: 100, injectableIndex: 100, combinedIndex: 100, exits: 410, shortagesActive: 72, shortagesNew: 38, medianMfrOral: 4.8, medianMfrInj: 3.2 },
  { year: 2013, oralSolidIndex: 104, injectableIndex: 98, combinedIndex: 102, exits: 480, shortagesActive: 78, shortagesNew: 42, medianMfrOral: 4.9, medianMfrInj: 3.1 },
  { year: 2014, oralSolidIndex: 108, injectableIndex: 96, combinedIndex: 104, exits: 550, shortagesActive: 85, shortagesNew: 51, medianMfrOral: 5.0, medianMfrInj: 3.0 },
  { year: 2015, oralSolidIndex: 95, injectableIndex: 88, combinedIndex: 93, exits: 720, shortagesActive: 92, shortagesNew: 58, medianMfrOral: 4.6, medianMfrInj: 2.8 },
  { year: 2016, oralSolidIndex: 74, injectableIndex: 79, combinedIndex: 76, exits: 890, shortagesActive: 98, shortagesNew: 64, medianMfrOral: 4.2, medianMfrInj: 2.6 },
  { year: 2017, oralSolidIndex: 58, injectableIndex: 71, combinedIndex: 62, exits: 1120, shortagesActive: 105, shortagesNew: 71, medianMfrOral: 3.8, medianMfrInj: 2.4 },
  { year: 2018, oralSolidIndex: 48, injectableIndex: 64, combinedIndex: 53, exits: 1380, shortagesActive: 112, shortagesNew: 78, medianMfrOral: 3.4, medianMfrInj: 2.3 },
  { year: 2019, oralSolidIndex: 41, injectableIndex: 58, combinedIndex: 46, exits: 1560, shortagesActive: 118, shortagesNew: 84, medianMfrOral: 3.1, medianMfrInj: 2.1 },
  { year: 2020, oralSolidIndex: 43, injectableIndex: 54, combinedIndex: 47, exits: 1680, shortagesActive: 132, shortagesNew: 96, medianMfrOral: 3.0, medianMfrInj: 2.0 },
  { year: 2021, oralSolidIndex: 44, injectableIndex: 55, combinedIndex: 48, exits: 1840, shortagesActive: 148, shortagesNew: 110, medianMfrOral: 2.9, medianMfrInj: 1.9 },
  { year: 2022, oralSolidIndex: 46, injectableIndex: 56, combinedIndex: 49, exits: 1720, shortagesActive: 156, shortagesNew: 102, medianMfrOral: 2.9, medianMfrInj: 1.9 },
  { year: 2023, oralSolidIndex: 47, injectableIndex: 57, combinedIndex: 50, exits: 1590, shortagesActive: 168, shortagesNew: 98, medianMfrOral: 3.0, medianMfrInj: 2.0 },
  { year: 2024, oralSolidIndex: 47, injectableIndex: 57, combinedIndex: 50, exits: 1480, shortagesActive: 162, shortagesNew: 88, medianMfrOral: 3.1, medianMfrInj: 2.0 },
  { year: 2025, oralSolidIndex: 48, injectableIndex: 58, combinedIndex: 51, exits: 1420, shortagesActive: 158, shortagesNew: 82, medianMfrOral: 3.1, medianMfrInj: 2.1 },
  { year: 2026, oralSolidIndex: 48, injectableIndex: 58, combinedIndex: 51, exits: 1380, shortagesActive: 154, shortagesNew: 76, medianMfrOral: 3.2, medianMfrInj: 2.1 },
];

export interface LagScatterPoint {
  /** Year of price observation */
  year: number;
  /** Combined index that year */
  priceIndex: number;
  /** Exits 6–8 quarters later (mapped to nearest exit year) */
  exitsLagged: number;
  /** YoY % change in combined index */
  priceYoY: number;
  era: "pre-erosion" | "steep-decline" | "trough" | "stabilizing";
}

export const LAG_SCATTER: LagScatterPoint[] = [
  { year: 2012, priceIndex: 100, exitsLagged: 550, priceYoY: 0, era: "pre-erosion" },
  { year: 2013, priceIndex: 102, exitsLagged: 720, priceYoY: 2.0, era: "pre-erosion" },
  { year: 2014, priceIndex: 104, exitsLagged: 890, priceYoY: 2.0, era: "pre-erosion" },
  { year: 2015, priceIndex: 93, exitsLagged: 1120, priceYoY: -10.6, era: "steep-decline" },
  { year: 2016, priceIndex: 76, exitsLagged: 1380, priceYoY: -18.3, era: "steep-decline" },
  { year: 2017, priceIndex: 62, exitsLagged: 1560, priceYoY: -18.4, era: "steep-decline" },
  { year: 2018, priceIndex: 53, exitsLagged: 1680, priceYoY: -14.5, era: "steep-decline" },
  { year: 2019, priceIndex: 46, exitsLagged: 1840, priceYoY: -13.2, era: "trough" },
  { year: 2020, priceIndex: 47, exitsLagged: 1720, priceYoY: 2.2, era: "trough" },
  { year: 2021, priceIndex: 48, exitsLagged: 1590, priceYoY: 2.1, era: "stabilizing" },
  { year: 2022, priceIndex: 49, exitsLagged: 1480, priceYoY: 2.1, era: "stabilizing" },
  { year: 2023, priceIndex: 50, exitsLagged: 1420, priceYoY: 2.0, era: "stabilizing" },
  { year: 2024, priceIndex: 50, exitsLagged: 1380, priceYoY: 0.0, era: "stabilizing" },
];

export interface ClassRow {
  id: TherapeuticClass;
  label: string;
  /** Peak-to-trough price drop (%) */
  priceDropPct: number;
  /** Exit intensity index (100 = oral-solid average) */
  exitIndex: number;
  /** Shortage intensity index (100 = average) */
  shortageIndex: number;
  /** Median manufacturers remaining 2026 */
  medianMfr2026: number;
  /** Lag quarters price trough → exit peak */
  lagQuarters: number;
}

export const CLASS_ROWS: ClassRow[] = [
  { id: "anti-infectives", label: "Anti-infectives", priceDropPct: 68, exitIndex: 142, shortageIndex: 128, medianMfr2026: 2.4, lagQuarters: 6 },
  { id: "cardiovascular", label: "Cardiovascular", priceDropPct: 58, exitIndex: 118, shortageIndex: 95, medianMfr2026: 3.1, lagQuarters: 7 },
  { id: "CNS", label: "CNS / psych", priceDropPct: 55, exitIndex: 105, shortageIndex: 88, medianMfr2026: 3.4, lagQuarters: 8 },
  { id: "oncology-supportive", label: "Oncology supportive", priceDropPct: 51, exitIndex: 156, shortageIndex: 168, medianMfr2026: 1.8, lagQuarters: 5 },
  { id: "anesthetics", label: "Anesthetics / critical care", priceDropPct: 47, exitIndex: 148, shortageIndex: 175, medianMfr2026: 1.7, lagQuarters: 5 },
  { id: "other", label: "Other multi-source", priceDropPct: 49, exitIndex: 92, shortageIndex: 78, medianMfr2026: 3.6, lagQuarters: 8 },
];

export interface RootCauseSlice {
  id: string;
  label: string;
  sharePct: number;
}

/** FDA-style shortage root-cause attribution (carried composite) */
export const ROOT_CAUSES: RootCauseSlice[] = [
  { id: "quality", label: "Quality / manufacturing", sharePct: 42 },
  { id: "economic", label: "Economic (price / margin)", sharePct: 38 },
  { id: "demand", label: "Demand surge", sharePct: 12 },
  { id: "other", label: "Other / unknown", sharePct: 8 },
];

export interface ExitReasonRow {
  id: string;
  label: string;
  sharePct: number;
}

/** Stated reasons among manufacturer exits (desk composite) */
export const EXIT_REASONS: ExitReasonRow[] = [
  { id: "margin", label: "Unsustainable margin", sharePct: 41 },
  { id: "capacity", label: "Plant / capacity reallocation", sharePct: 22 },
  { id: "quality-cost", label: "Quality remediation cost", sharePct: 18 },
  { id: "api", label: "API supply disruption", sharePct: 11 },
  { id: "other", label: "Other / consolidation", sharePct: 8 },
];

export interface CohortPathRow {
  year: number;
  /** Cumulative % of 2014 ANDA holders still active in oral solids */
  oralSolidSurvivorsPct: number;
  /** Cumulative % still active in injectables */
  injectableSurvivorsPct: number;
  /** Share of oral-solid volume held by top 5 ANDA holders */
  top5OralVolPct: number;
  /** Share of injectable volume held by top 5 */
  top5InjVolPct: number;
}

export const COHORT_PATH: CohortPathRow[] = [
  { year: 2014, oralSolidSurvivorsPct: 100, injectableSurvivorsPct: 100, top5OralVolPct: 38, top5InjVolPct: 48 },
  { year: 2016, oralSolidSurvivorsPct: 91, injectableSurvivorsPct: 88, top5OralVolPct: 42, top5InjVolPct: 54 },
  { year: 2018, oralSolidSurvivorsPct: 78, injectableSurvivorsPct: 72, top5OralVolPct: 48, top5InjVolPct: 61 },
  { year: 2020, oralSolidSurvivorsPct: 68, injectableSurvivorsPct: 61, top5OralVolPct: 54, top5InjVolPct: 67 },
  { year: 2022, oralSolidSurvivorsPct: 62, injectableSurvivorsPct: 55, top5OralVolPct: 58, top5InjVolPct: 71 },
  { year: 2024, oralSolidSurvivorsPct: 59, injectableSurvivorsPct: 52, top5OralVolPct: 60, top5InjVolPct: 73 },
  { year: 2026, oralSolidSurvivorsPct: 57, injectableSurvivorsPct: 50, top5OralVolPct: 61, top5InjVolPct: 74 },
];

export function indexForSegment(row: AnnualTapeRow, segment: SegmentId): number {
  if (segment === "oral-solid") return row.oralSolidIndex;
  if (segment === "injectable") return row.injectableIndex;
  return row.combinedIndex;
}

export function medianMfrForSegment(row: AnnualTapeRow, segment: SegmentId): number {
  if (segment === "injectable") return row.medianMfrInj;
  if (segment === "oral-solid") return row.medianMfrOral;
  return Number(((row.medianMfrOral + row.medianMfrInj) / 2).toFixed(1));
}

export const ANALYTICS = {
  oralSolidDropPct: HEADLINE.oralSolidDropPct,
  injectableDropPct: HEADLINE.injectableDropPct,
  lagQuarters: HEADLINE.lagQuarters,
  exitsPeak: HEADLINE.exitsPeakCount,
  exits2015: HEADLINE.exits2015,
  exitMultiple: Number((HEADLINE.exitsPeakCount / HEADLINE.exits2015).toFixed(2)),
  priceExitCorrLag: HEADLINE.priceExitCorrLag,
  economicRootSharePct: HEADLINE.economicRootSharePct,
  qualityRootSharePct: HEADLINE.qualityRootSharePct,
  shortagesDelta2019to2023: HEADLINE.shortages2023 - HEADLINE.shortages2019,
  oralSolidPeak: HEADLINE.oralSolidPeak,
  oralSolidTrough: HEADLINE.oralSolidTrough,
  survivorOral2026: 57,
  survivorInj2026: 50,
  top5InjVol2026: 74,
};
