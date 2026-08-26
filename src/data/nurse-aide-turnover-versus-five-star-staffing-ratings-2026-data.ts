/**
 * Nurse-aide–heavy nursing staff turnover versus CMS staffing star ratings (2026).
 *
 * Core question: How tightly does nurse-aide–driven nursing staff turnover line up
 * with CMS Five-Star staffing-domain ratings across states?
 *
 * CMS Care Compare publishes total nursing staff turnover (RN + LPN/LVN + nurse
 * aides) and RN turnover — not a separate aide-only turnover series. Nurse aides
 * supply the majority of nursing hours per resident day nationally (~2.3 of ~3.9
 * HPRD), so the published nursing-staff turnover series is the operational measure
 * of aide-heavy workforce churn. Staffing-domain stars already embed turnover
 * (50 of 380 points) plus case-mix–adjusted HPRD and weekend staffing — so part of
 * the alignment is mechanical by design; the state scatter still shows where
 * markets diverge from the national gradient.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Nursing staff and RN turnover rates follow CMS Care Compare / Provider " +
  "Information fields derived from Payroll-Based Journal (PBJ) submissions " +
  "(12-month turnover windows). Facility-level star-band turnover means and " +
  "top/bottom state turnover ranks draw on published CMS-derived aggregates " +
  "(CareLens 2026 study of the Provider Information file; AARP Nursing Home " +
  "Quality and Safety Dashboard Q2 2026). Nurse aide hours per resident day " +
  "(HPRD) follow Q1 2026 PBJ state rankings (PBJ320 / CMS PBJ PUF). Mean " +
  "staffing-domain star ratings by state are desk composites from CMS " +
  "provider-level staffing ratings joined to the same state panels — not a " +
  "CMS-published state summary table. Correlation and residual ranks are " +
  "analytical constructs. GAO nursing-home staffing reports supply policy " +
  "context, not the numeric panel.";

export const SOURCES = [
  {
    label: "CMS — Payroll-Based Journal (PBJ) staffing data",
    url: "https://www.cms.gov/medicare/quality/nursing-home-improvement/staffing-data-submission",
  },
  {
    label: "CMS — Five-Star Quality Rating System",
    url: "https://www.cms.gov/medicare/health-safety-standards/certification-compliance/five-star-quality-rating-system",
  },
  {
    label: "CMS — Care Compare nursing home staffing enhancements",
    url: "https://www.cms.gov/newsroom/press-releases/cms-enhances-nursing-home-rating-system-staffing-turnover-data",
  },
  {
    label: "AARP — Nursing Home Quality and Safety Dashboard",
    url: "https://www.aarp.org/pri/initiatives/aarp-nursing-home-quality-safety-dashboard/",
  },
  {
    label: "CareLens — Nursing home staff turnover (CMS Provider Information)",
    url: "https://carelens.io/nursing-home-staff-turnover",
  },
  {
    label: "GAO — Nursing home staffing and quality oversight",
    url: "https://www.gao.gov/products/gao-22-103202",
  },
] as const;

export const VIZ_MARKERS = [
  "Turnover vs staffing stars",
  "1★ homes 54.7% vs 5★ 37.5%",
  "State scatter residual map",
  "Aide HPRD vs churn",
] as const;

/** Headline punchline — turnover vs staffing stars */
export const HEADLINE = {
  /** Unweighted mean nursing-staff turnover across reporting homes */
  nationalNursingTurnoverPct: 45.8,
  /** National RN turnover */
  nationalRnTurnoverPct: 42.9,
  /** National mean nurse aide HPRD (AARP ~2.3; PBJ panel ~2.2–2.3) */
  nationalAideHprd: 2.3,
  /** Mean staffing-domain stars (desk, CMS provider join) */
  nationalStaffingStars: 2.92,
  /** Turnover at 1-star overall homes (CareLens / CMS Provider Info) */
  turnoverAt1StarPct: 54.7,
  /** Turnover at 5-star overall homes */
  turnoverAt5StarPct: 37.5,
  /** Spread 1★ − 5★ (pp) */
  starSpreadPp: 17.2,
  /** State-level Pearson r: nursing turnover vs mean staffing stars (desk) */
  stateCorrR: -0.74,
  /** Highest-turnover large state (CareLens) */
  highTurnoverState: "MO",
  highTurnoverPct: 56.1,
  /** Lowest-turnover state among ≥20 homes (CareLens) */
  lowTurnoverState: "HI",
  lowTurnoverPct: 36.4,
  /** Reporting homes in CareLens CMS pull */
  reportingHomes: 13543,
  /** Share of homes with ≥50% nursing turnover */
  shareOverHalfPct: 37.6,
} as const;

export type RegionId =
  | "Northeast"
  | "Midwest"
  | "South"
  | "West";

export type StateRow = {
  state: string;
  name: string;
  region: RegionId;
  /** Facilities in PBJ / Care Compare panel */
  facilities: number;
  /** Total nursing staff turnover % (includes nurse aides) */
  nursingTurnoverPct: number;
  /** RN turnover % */
  rnTurnoverPct: number;
  /** Mean staffing-domain star rating (1–5), desk composite */
  staffingStars: number;
  /** Nurse aide HPRD (PBJ Q1 2026) */
  aideHprd: number;
  /** Total nurse HPRD */
  totalHprd: number;
  confidence: Confidence;
};

/**
 * State panel: turnover from CareLens/AARP where disclosed; remaining states
 * estimated from CMS-derived regional patterns + HPRD joins. Staffing stars
 * are desk means of CMS staffing-domain ratings.
 */
export const STATE_PANEL: StateRow[] = [
  { state: "AK", name: "Alaska", region: "West", facilities: 15, nursingTurnoverPct: 44.2, rnTurnoverPct: 41.0, staffingStars: 3.55, aideHprd: 3.3, totalHprd: 5.73, confidence: "estimated" },
  { state: "AL", name: "Alabama", region: "South", facilities: 223, nursingTurnoverPct: 47.8, rnTurnoverPct: 45.2, staffingStars: 2.78, aideHprd: 2.46, totalHprd: 3.88, confidence: "estimated" },
  { state: "AR", name: "Arkansas", region: "South", facilities: 203, nursingTurnoverPct: 49.5, rnTurnoverPct: 48.1, staffingStars: 2.62, aideHprd: 2.71, totalHprd: 4.05, confidence: "disclosed" },
  { state: "AZ", name: "Arizona", region: "West", facilities: 139, nursingTurnoverPct: 46.4, rnTurnoverPct: 44.0, staffingStars: 2.85, aideHprd: 2.21, totalHprd: 3.87, confidence: "estimated" },
  { state: "CA", name: "California", region: "West", facilities: 1005, nursingTurnoverPct: 36.7, rnTurnoverPct: 35.1, staffingStars: 3.48, aideHprd: 2.61, totalHprd: 4.36, confidence: "disclosed" },
  { state: "CO", name: "Colorado", region: "West", facilities: 208, nursingTurnoverPct: 48.6, rnTurnoverPct: 46.8, staffingStars: 2.68, aideHprd: 2.14, totalHprd: 3.59, confidence: "estimated" },
  { state: "CT", name: "Connecticut", region: "Northeast", facilities: 184, nursingTurnoverPct: 37.4, rnTurnoverPct: 36.2, staffingStars: 3.32, aideHprd: 2.2, totalHprd: 3.66, confidence: "disclosed" },
  { state: "DC", name: "Dist. of Columbia", region: "South", facilities: 16, nursingTurnoverPct: 35.0, rnTurnoverPct: 33.0, staffingStars: 3.62, aideHprd: 2.51, totalHprd: 4.43, confidence: "disclosed" },
  { state: "DE", name: "Delaware", region: "South", facilities: 41, nursingTurnoverPct: 41.3, rnTurnoverPct: 39.5, staffingStars: 3.12, aideHprd: 2.27, totalHprd: 4.05, confidence: "disclosed" },
  { state: "FL", name: "Florida", region: "South", facilities: 647, nursingTurnoverPct: 41.4, rnTurnoverPct: 39.8, staffingStars: 3.08, aideHprd: 2.29, totalHprd: 3.76, confidence: "disclosed" },
  { state: "GA", name: "Georgia", region: "South", facilities: 349, nursingTurnoverPct: 49.1, rnTurnoverPct: 47.5, staffingStars: 2.58, aideHprd: 2.11, totalHprd: 3.5, confidence: "estimated" },
  { state: "HI", name: "Hawaii", region: "West", facilities: 42, nursingTurnoverPct: 36.4, rnTurnoverPct: 34.8, staffingStars: 3.58, aideHprd: 2.67, totalHprd: 4.63, confidence: "disclosed" },
  { state: "IA", name: "Iowa", region: "Midwest", facilities: 387, nursingTurnoverPct: 46.2, rnTurnoverPct: 43.5, staffingStars: 2.88, aideHprd: 2.53, totalHprd: 3.8, confidence: "estimated" },
  { state: "ID", name: "Idaho", region: "West", facilities: 75, nursingTurnoverPct: 50.3, rnTurnoverPct: 48.0, staffingStars: 2.55, aideHprd: 2.34, totalHprd: 3.9, confidence: "disclosed" },
  { state: "IL", name: "Illinois", region: "Midwest", facilities: 656, nursingTurnoverPct: 48.9, rnTurnoverPct: 46.2, staffingStars: 2.52, aideHprd: 1.97, totalHprd: 3.26, confidence: "estimated" },
  { state: "IN", name: "Indiana", region: "Midwest", facilities: 506, nursingTurnoverPct: 47.5, rnTurnoverPct: 45.0, staffingStars: 2.72, aideHprd: 2.23, totalHprd: 3.63, confidence: "estimated" },
  { state: "KS", name: "Kansas", region: "Midwest", facilities: 292, nursingTurnoverPct: 48.2, rnTurnoverPct: 45.8, staffingStars: 2.7, aideHprd: 2.64, totalHprd: 4.01, confidence: "estimated" },
  { state: "KY", name: "Kentucky", region: "South", facilities: 263, nursingTurnoverPct: 47.0, rnTurnoverPct: 44.5, staffingStars: 2.8, aideHprd: 2.34, totalHprd: 3.85, confidence: "estimated" },
  { state: "LA", name: "Louisiana", region: "South", facilities: 256, nursingTurnoverPct: 48.4, rnTurnoverPct: 46.0, staffingStars: 2.65, aideHprd: 2.25, totalHprd: 3.64, confidence: "estimated" },
  { state: "MA", name: "Massachusetts", region: "Northeast", facilities: 321, nursingTurnoverPct: 38.2, rnTurnoverPct: 36.5, staffingStars: 3.28, aideHprd: 2.22, totalHprd: 3.79, confidence: "disclosed" },
  { state: "MD", name: "Maryland", region: "South", facilities: 213, nursingTurnoverPct: 40.2, rnTurnoverPct: 38.4, staffingStars: 3.15, aideHprd: 2.06, totalHprd: 3.73, confidence: "disclosed" },
  { state: "ME", name: "Maine", region: "Northeast", facilities: 78, nursingTurnoverPct: 43.5, rnTurnoverPct: 41.2, staffingStars: 3.22, aideHprd: 2.84, totalHprd: 4.35, confidence: "estimated" },
  { state: "MI", name: "Michigan", region: "Midwest", facilities: 418, nursingTurnoverPct: 45.5, rnTurnoverPct: 42.8, staffingStars: 2.95, aideHprd: 2.31, totalHprd: 3.95, confidence: "estimated" },
  { state: "MN", name: "Minnesota", region: "Midwest", facilities: 335, nursingTurnoverPct: 42.8, rnTurnoverPct: 40.1, staffingStars: 3.18, aideHprd: 2.52, totalHprd: 4.19, confidence: "estimated" },
  { state: "MO", name: "Missouri", region: "Midwest", facilities: 426, nursingTurnoverPct: 56.1, rnTurnoverPct: 52.4, staffingStars: 2.28, aideHprd: 2.27, totalHprd: 3.34, confidence: "disclosed" },
  { state: "MS", name: "Mississippi", region: "South", facilities: 198, nursingTurnoverPct: 46.8, rnTurnoverPct: 44.2, staffingStars: 2.9, aideHprd: 2.4, totalHprd: 4.09, confidence: "estimated" },
  { state: "MT", name: "Montana", region: "West", facilities: 52, nursingTurnoverPct: 54.8, rnTurnoverPct: 51.2, staffingStars: 2.35, aideHprd: 2.49, totalHprd: 3.91, confidence: "disclosed" },
  { state: "NC", name: "North Carolina", region: "South", facilities: 408, nursingTurnoverPct: 47.2, rnTurnoverPct: 44.8, staffingStars: 2.75, aideHprd: 2.26, totalHprd: 3.65, confidence: "estimated" },
  { state: "ND", name: "North Dakota", region: "Midwest", facilities: 70, nursingTurnoverPct: 43.0, rnTurnoverPct: 39.5, staffingStars: 3.35, aideHprd: 3.11, totalHprd: 4.57, confidence: "estimated" },
  { state: "NE", name: "Nebraska", region: "Midwest", facilities: 175, nursingTurnoverPct: 45.8, rnTurnoverPct: 43.0, staffingStars: 2.92, aideHprd: 2.66, totalHprd: 4.01, confidence: "estimated" },
  { state: "NH", name: "New Hampshire", region: "Northeast", facilities: 72, nursingTurnoverPct: 44.8, rnTurnoverPct: 42.5, staffingStars: 2.98, aideHprd: 2.33, totalHprd: 3.85, confidence: "estimated" },
  { state: "NJ", name: "New Jersey", region: "Northeast", facilities: 333, nursingTurnoverPct: 39.7, rnTurnoverPct: 37.8, staffingStars: 3.2, aideHprd: 2.19, totalHprd: 3.68, confidence: "disclosed" },
  { state: "NM", name: "New Mexico", region: "West", facilities: 64, nursingTurnoverPct: 53.3, rnTurnoverPct: 50.5, staffingStars: 2.4, aideHprd: 2.2, totalHprd: 3.52, confidence: "disclosed" },
  { state: "NV", name: "Nevada", region: "West", facilities: 64, nursingTurnoverPct: 47.6, rnTurnoverPct: 45.5, staffingStars: 2.82, aideHprd: 2.15, totalHprd: 3.88, confidence: "estimated" },
  { state: "NY", name: "New York", region: "Northeast", facilities: 562, nursingTurnoverPct: 40.3, rnTurnoverPct: 38.0, staffingStars: 3.1, aideHprd: 2.16, totalHprd: 3.55, confidence: "disclosed" },
  { state: "OH", name: "Ohio", region: "Midwest", facilities: 917, nursingTurnoverPct: 48.0, rnTurnoverPct: 45.5, staffingStars: 2.7, aideHprd: 2.08, totalHprd: 3.64, confidence: "estimated" },
  { state: "OK", name: "Oklahoma", region: "South", facilities: 230, nursingTurnoverPct: 55.5, rnTurnoverPct: 55.0, staffingStars: 2.22, aideHprd: 2.54, totalHprd: 3.79, confidence: "disclosed" },
  { state: "OR", name: "Oregon", region: "West", facilities: 125, nursingTurnoverPct: 42.0, rnTurnoverPct: 40.5, staffingStars: 3.4, aideHprd: 3.36, totalHprd: 4.91, confidence: "estimated" },
  { state: "PA", name: "Pennsylvania", region: "Northeast", facilities: 644, nursingTurnoverPct: 44.5, rnTurnoverPct: 42.0, staffingStars: 2.95, aideHprd: 2.13, totalHprd: 3.69, confidence: "estimated" },
  { state: "RI", name: "Rhode Island", region: "Northeast", facilities: 65, nursingTurnoverPct: 40.6, rnTurnoverPct: 38.5, staffingStars: 3.18, aideHprd: 2.45, totalHprd: 3.67, confidence: "disclosed" },
  { state: "SC", name: "South Carolina", region: "South", facilities: 186, nursingTurnoverPct: 47.4, rnTurnoverPct: 45.0, staffingStars: 2.72, aideHprd: 2.1, totalHprd: 3.62, confidence: "estimated" },
  { state: "SD", name: "South Dakota", region: "Midwest", facilities: 92, nursingTurnoverPct: 46.5, rnTurnoverPct: 43.8, staffingStars: 2.9, aideHprd: 2.49, totalHprd: 3.76, confidence: "estimated" },
  { state: "TN", name: "Tennessee", region: "South", facilities: 302, nursingTurnoverPct: 48.8, rnTurnoverPct: 46.5, staffingStars: 2.6, aideHprd: 2.11, totalHprd: 3.75, confidence: "estimated" },
  { state: "TX", name: "Texas", region: "South", facilities: 1053, nursingTurnoverPct: 55.3, rnTurnoverPct: 52.8, staffingStars: 2.25, aideHprd: 2.0, totalHprd: 3.33, confidence: "disclosed" },
  { state: "UT", name: "Utah", region: "West", facilities: 86, nursingTurnoverPct: 50.7, rnTurnoverPct: 48.2, staffingStars: 2.5, aideHprd: 2.3, totalHprd: 3.91, confidence: "disclosed" },
  { state: "VA", name: "Virginia", region: "South", facilities: 287, nursingTurnoverPct: 46.0, rnTurnoverPct: 43.5, staffingStars: 2.82, aideHprd: 2.02, totalHprd: 3.58, confidence: "estimated" },
  { state: "VT", name: "Vermont", region: "Northeast", facilities: 31, nursingTurnoverPct: 55.4, rnTurnoverPct: 52.0, staffingStars: 2.48, aideHprd: 2.54, totalHprd: 4.25, confidence: "disclosed" },
  { state: "WA", name: "Washington", region: "West", facilities: 187, nursingTurnoverPct: 43.2, rnTurnoverPct: 41.0, staffingStars: 3.25, aideHprd: 2.53, totalHprd: 4.21, confidence: "estimated" },
  { state: "WI", name: "Wisconsin", region: "Midwest", facilities: 322, nursingTurnoverPct: 44.0, rnTurnoverPct: 41.5, staffingStars: 3.15, aideHprd: 2.57, totalHprd: 4.19, confidence: "estimated" },
  { state: "WV", name: "West Virginia", region: "South", facilities: 122, nursingTurnoverPct: 49.0, rnTurnoverPct: 46.8, staffingStars: 2.55, aideHprd: 2.0, totalHprd: 3.56, confidence: "estimated" },
  { state: "WY", name: "Wyoming", region: "West", facilities: 30, nursingTurnoverPct: 51.8, rnTurnoverPct: 49.0, staffingStars: 2.42, aideHprd: 2.27, totalHprd: 3.61, confidence: "disclosed" },
];

/** Facility-level turnover by overall CMS star (CareLens / Provider Info) */
export const STAR_BAND_TURNOVER = [
  { stars: 1, label: "1★", homes: 2635, nursingTurnoverPct: 54.7, rnTurnoverPct: 56.0 },
  { stars: 2, label: "2★", homes: 2755, nursingTurnoverPct: 48.4, rnTurnoverPct: 48.5 },
  { stars: 3, label: "3★", homes: 2635, nursingTurnoverPct: 45.7, rnTurnoverPct: 43.8 },
  { stars: 4, label: "4★", homes: 2580, nursingTurnoverPct: 42.9, rnTurnoverPct: 38.2 },
  { stars: 5, label: "5★", homes: 2850, nursingTurnoverPct: 37.5, rnTurnoverPct: 31.3 },
] as const;

/** Ownership split (CareLens / CMS Provider Info) */
export const OWNERSHIP_TURNOVER = [
  { ownership: "For-profit", homes: 10107, nursingTurnoverPct: 47.1, rnTurnoverPct: 45.1 },
  { ownership: "Government", homes: 819, nursingTurnoverPct: 44.3, rnTurnoverPct: 38.1 },
  { ownership: "Nonprofit", homes: 2617, nursingTurnoverPct: 41.2, rnTurnoverPct: 36.2 },
] as const;

/** Staffing-domain point budget (CMS Five-Star Technical Users’ Guide) */
export const STAFFING_POINT_BUDGET = [
  { component: "Case-mix total nurse HPRD", maxPoints: 100, sharePct: 26.3 },
  { component: "Case-mix RN HPRD", maxPoints: 100, sharePct: 26.3 },
  { component: "Weekend total nurse HPRD", maxPoints: 50, sharePct: 13.2 },
  { component: "Total nursing turnover", maxPoints: 50, sharePct: 13.2 },
  { component: "RN turnover", maxPoints: 50, sharePct: 13.2 },
  { component: "Administrator turnover", maxPoints: 30, sharePct: 7.9 },
] as const;

export type RegionAgg = {
  region: RegionId;
  facilities: number;
  nursingTurnoverPct: number;
  staffingStars: number;
  aideHprd: number;
};

export const REGION_AGG: RegionAgg[] = (() => {
  const regions: RegionId[] = ["Northeast", "Midwest", "South", "West"];
  return regions.map((region) => {
    const rows = STATE_PANEL.filter((r) => r.region === region);
    const fac = rows.reduce((s, r) => s + r.facilities, 0);
    const w = (fn: (r: StateRow) => number) =>
      rows.reduce((s, r) => s + fn(r) * r.facilities, 0) / fac;
    return {
      region,
      facilities: fac,
      nursingTurnoverPct: Math.round(w((r) => r.nursingTurnoverPct) * 10) / 10,
      staffingStars: Math.round(w((r) => r.staffingStars) * 100) / 100,
      aideHprd: Math.round(w((r) => r.aideHprd) * 100) / 100,
    };
  });
})();

export type SortKey =
  | "turnover"
  | "stars"
  | "aide"
  | "residual";

export type RegionFilter = "All" | RegionId;

export const REGION_OPTIONS: RegionFilter[] = [
  "All",
  "Northeast",
  "Midwest",
  "South",
  "West",
];

/** Residual = actual staffing stars − predicted from national turnover gradient */
function predictedStars(turnoverPct: number): number {
  // Linear fit anchored near national mean (45.8% → ~2.92★)
  return 2.92 - 0.055 * (turnoverPct - 45.8);
}

export function stateResidual(row: StateRow): number {
  return Math.round((row.staffingStars - predictedStars(row.nursingTurnoverPct)) * 100) / 100;
}

export function filterStates(
  region: RegionFilter,
  sort: SortKey,
): (StateRow & { residual: number })[] {
  const rows = STATE_PANEL.filter(
    (r) => region === "All" || r.region === region,
  ).map((r) => ({ ...r, residual: stateResidual(r) }));
  const sorted = [...rows];
  sorted.sort((a, b) => {
    if (sort === "turnover") return b.nursingTurnoverPct - a.nursingTurnoverPct;
    if (sort === "stars") return b.staffingStars - a.staffingStars;
    if (sort === "aide") return b.aideHprd - a.aideHprd;
    return a.residual - b.residual; // most under-rated first
  });
  return sorted;
}

/** Detail table for prose — top/bottom and notable residuals */
export const DETAIL_TABLE = [
  { state: "MO", nursingTurnoverPct: 56.1, staffingStars: 2.28, aideHprd: 2.27, note: "Highest large-state churn; thin staffing stars" },
  { state: "OK", nursingTurnoverPct: 55.5, staffingStars: 2.22, aideHprd: 2.54, note: "High churn despite mid-pack aide HPRD" },
  { state: "VT", nursingTurnoverPct: 55.4, staffingStars: 2.48, aideHprd: 2.54, note: "Small market; high contract share + churn" },
  { state: "TX", nursingTurnoverPct: 55.3, staffingStars: 2.25, aideHprd: 2.0, note: "Lowest aide HPRD + near-top turnover" },
  { state: "HI", nursingTurnoverPct: 36.4, staffingStars: 3.58, aideHprd: 2.67, note: "Lowest turnover among ≥20-home states" },
  { state: "CA", nursingTurnoverPct: 36.7, staffingStars: 3.48, aideHprd: 2.61, note: "Large-market stability + above-avg stars" },
  { state: "CT", nursingTurnoverPct: 37.4, staffingStars: 3.32, aideHprd: 2.2, note: "Low churn without top-decile aide hours" },
  { state: "OR", nursingTurnoverPct: 42.0, staffingStars: 3.4, aideHprd: 3.36, note: "Top aide HPRD; stars beat turnover alone" },
] as const;
