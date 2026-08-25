/**
 * Job-switcher wage premium across cohorts (2026).
 *
 * Core question: How wide is the job-switcher wage premium now, and in which
 * industries has switching stopped paying?
 *
 * Method: National switcher and stayer medians are Atlanta Fed Wage Growth
 * Tracker 12-month moving averages (FRBATLWGT12MMUMHWGJSW /
 * FRBATLWGT12MMUMHWGJST). Premium = switcher − stayer (pp). Industry and
 * education/age cohort premiums are desk composites: Tracker industry wage-
 * growth ranks + JOLTS quit rates (JTSQUR) + ADP Pay Insights industry wage
 * growth used to allocate the national premium across cohorts. Quarters are
 * end-of-quarter month prints. Confidence tags mark disclosed vs modeled.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "National switcher/stayer medians: Atlanta Fed Wage Growth Tracker 12-month unweighted median hourly wage growth (FRED FRBATLWGT12MMUMHWGJSW, FRBATLWGT12MMUMHWGJST). Premium = switcher − stayer in percentage points. JOLTS total nonfarm quit rate (JTSQUR) is the churn backdrop. Industry and age/education cohort premiums are desk composites that allocate the national premium using Tracker industry wage-growth ranks, JOLTS industry quit rates, and ADP Pay Insights industry wage-growth differentials — not published Tracker micro cuts. Confidence: national series disclosed; cohort splits modeled.";

export const SOURCES = [
  {
    label: "Atlanta Fed — Wage Growth Tracker",
    url: "https://www.atlantafed.org/research-and-data/data/wage-growth-tracker",
  },
  {
    label: "FRED — Job switcher median wage growth (FRBATLWGT12MMUMHWGJSW)",
    url: "https://fred.stlouisfed.org/series/FRBATLWGT12MMUMHWGJSW",
  },
  {
    label: "FRED — Job stayer median wage growth (FRBATLWGT12MMUMHWGJST)",
    url: "https://fred.stlouisfed.org/series/FRBATLWGT12MMUMHWGJST",
  },
  {
    label: "BLS — JOLTS quit rate, total nonfarm (JTSQUR)",
    url: "https://fred.stlouisfed.org/series/JTSQUR",
  },
  {
    label: "ADP — Pay Insights / workforce wage reports",
    url: "https://adp.com/resources/adp-research-institute",
  },
] as const;

/** National punchline (Tracker-anchored; latest ≈ mid-2026) */
export const HEADLINE = {
  /** Latest switcher − stayer premium, pp */
  latestPremiumPp: 0.8,
  /** Latest switcher median YoY, % */
  latestSwitcherPct: 4.4,
  /** Latest stayer median YoY, % */
  latestStayerPct: 3.6,
  /** Latest overall Tracker, % */
  latestOverallPct: 3.8,
  /** Peak premium in Great Resignation window, pp */
  peakPremiumPp: 2.6,
  /** Peak premium month label */
  peakMonth: "2022-03",
  /** Month when premium hit ~0 (May 2025 print window) */
  zeroPremiumMonth: "2025-05",
  /** Compression from peak to latest, pp */
  compressionFromPeakPp: 1.8,
  /** Industries in panel with premium ≤ 0 at latest */
  industriesStoppedPaying: 4,
  /** Industries still paying ≥ 1.0 pp */
  industriesStillPaying: 4,
  /** JOLTS quit rate at premium peak (~%), level */
  joltsQuitsAtPeak: 3.0,
  /** JOLTS quit rate at latest (~%), level */
  joltsQuitsLatest: 1.9,
  latestMonth: "2026-07",
  confidence: "disclosed" as Confidence,
};

export type Month = string;

/** Quarterly / monthly national path (selected months; disclosed anchors + interpolated) */
export type NationalPoint = {
  month: Month;
  label: string;
  switcherPct: number;
  stayerPct: number;
  premiumPp: number;
  joltsQuitPct: number;
  confidence: Confidence;
};

export const NATIONAL_PATH: NationalPoint[] = [
  { month: "2019-12", label: "2019-12", switcherPct: 4.1, stayerPct: 3.3, premiumPp: 0.8, joltsQuitPct: 2.3, confidence: "estimated" },
  { month: "2020-06", label: "2020-06", switcherPct: 3.2, stayerPct: 2.9, premiumPp: 0.3, joltsQuitPct: 1.8, confidence: "estimated" },
  { month: "2020-12", label: "2020-12", switcherPct: 3.6, stayerPct: 3.0, premiumPp: 0.6, joltsQuitPct: 2.3, confidence: "estimated" },
  { month: "2021-06", label: "2021-06", switcherPct: 5.0, stayerPct: 3.4, premiumPp: 1.6, joltsQuitPct: 2.7, confidence: "estimated" },
  { month: "2021-12", label: "2021-12", switcherPct: 5.9, stayerPct: 3.7, premiumPp: 2.2, joltsQuitPct: 3.0, confidence: "disclosed" },
  { month: "2022-03", label: "2022-03", switcherPct: 6.4, stayerPct: 3.8, premiumPp: 2.6, joltsQuitPct: 3.0, confidence: "disclosed" },
  { month: "2022-06", label: "2022-06", switcherPct: 6.5, stayerPct: 4.1, premiumPp: 2.4, joltsQuitPct: 2.8, confidence: "estimated" },
  { month: "2022-12", label: "2022-12", switcherPct: 6.3, stayerPct: 4.5, premiumPp: 1.8, joltsQuitPct: 2.5, confidence: "estimated" },
  { month: "2023-06", label: "2023-06", switcherPct: 5.8, stayerPct: 4.6, premiumPp: 1.2, joltsQuitPct: 2.4, confidence: "estimated" },
  { month: "2023-12", label: "2023-12", switcherPct: 5.4, stayerPct: 4.5, premiumPp: 0.9, joltsQuitPct: 2.2, confidence: "estimated" },
  { month: "2024-06", label: "2024-06", switcherPct: 5.0, stayerPct: 4.3, premiumPp: 0.7, joltsQuitPct: 2.1, confidence: "estimated" },
  { month: "2024-12", label: "2024-12", switcherPct: 4.7, stayerPct: 4.3, premiumPp: 0.4, joltsQuitPct: 1.9, confidence: "estimated" },
  { month: "2025-05", label: "2025-05", switcherPct: 4.4, stayerPct: 4.4, premiumPp: 0.0, joltsQuitPct: 1.9, confidence: "disclosed" },
  { month: "2025-12", label: "2025-12", switcherPct: 4.2, stayerPct: 3.8, premiumPp: 0.4, joltsQuitPct: 1.8, confidence: "estimated" },
  { month: "2026-03", label: "2026-03", switcherPct: 4.1, stayerPct: 3.6, premiumPp: 0.5, joltsQuitPct: 1.9, confidence: "estimated" },
  { month: "2026-07", label: "2026-07", switcherPct: 4.4, stayerPct: 3.6, premiumPp: 0.8, joltsQuitPct: 1.9, confidence: "disclosed" },
];

export type IndustryId =
  | "leis-hosp"
  | "construction"
  | "retail"
  | "health"
  | "transport"
  | "manufacturing"
  | "education"
  | "finance"
  | "prof-biz"
  | "information";

export type IndustryRow = {
  id: IndustryId;
  label: string;
  short: string;
  /** Latest switcher−stayer premium, pp */
  premiumPp: number;
  /** Peak premium ~2022, pp */
  peakPremiumPp: number;
  /** Premium in May-2025 trough window, pp */
  troughPremiumPp: number;
  /** JOLTS industry quit rate proxy, % */
  quitRatePct: number;
  /** ADP-style industry wage growth YoY, % */
  adpWageYoYPct: number;
  /** True if latest premium ≤ 0 */
  stoppedPaying: boolean;
  confidence: Confidence;
};

export const INDUSTRIES: IndustryRow[] = [
  { id: "leis-hosp", label: "Leisure & hospitality", short: "Leisure", premiumPp: 1.9, peakPremiumPp: 3.8, troughPremiumPp: 0.6, quitRatePct: 3.6, adpWageYoYPct: 4.8, stoppedPaying: false, confidence: "modeled" },
  { id: "construction", label: "Construction", short: "Constr.", premiumPp: 1.5, peakPremiumPp: 3.2, troughPremiumPp: 0.4, quitRatePct: 2.4, adpWageYoYPct: 4.5, stoppedPaying: false, confidence: "modeled" },
  { id: "retail", label: "Retail trade", short: "Retail", premiumPp: 1.2, peakPremiumPp: 3.0, troughPremiumPp: 0.3, quitRatePct: 2.8, adpWageYoYPct: 4.1, stoppedPaying: false, confidence: "modeled" },
  { id: "health", label: "Health care & social assist.", short: "Health", premiumPp: 1.1, peakPremiumPp: 2.8, troughPremiumPp: 0.5, quitRatePct: 2.2, adpWageYoYPct: 4.0, stoppedPaying: false, confidence: "modeled" },
  { id: "transport", label: "Transportation & warehousing", short: "Transp.", premiumPp: 0.7, peakPremiumPp: 2.9, troughPremiumPp: 0.1, quitRatePct: 2.5, adpWageYoYPct: 3.7, stoppedPaying: false, confidence: "modeled" },
  { id: "manufacturing", label: "Manufacturing", short: "Mfg", premiumPp: 0.3, peakPremiumPp: 2.1, troughPremiumPp: -0.1, quitRatePct: 1.5, adpWageYoYPct: 3.4, stoppedPaying: false, confidence: "modeled" },
  { id: "education", label: "Educational services", short: "Educ.", premiumPp: 0.0, peakPremiumPp: 1.6, troughPremiumPp: -0.2, quitRatePct: 1.4, adpWageYoYPct: 3.2, stoppedPaying: true, confidence: "modeled" },
  { id: "finance", label: "Finance & insurance", short: "Finance", premiumPp: -0.2, peakPremiumPp: 1.8, troughPremiumPp: -0.5, quitRatePct: 1.2, adpWageYoYPct: 3.1, stoppedPaying: true, confidence: "modeled" },
  { id: "prof-biz", label: "Professional & business svcs", short: "ProfBiz", premiumPp: -0.4, peakPremiumPp: 2.4, troughPremiumPp: -0.6, quitRatePct: 2.0, adpWageYoYPct: 3.0, stoppedPaying: true, confidence: "modeled" },
  { id: "information", label: "Information (incl. tech)", short: "Info/Tech", premiumPp: -0.8, peakPremiumPp: 2.7, troughPremiumPp: -1.1, quitRatePct: 1.3, adpWageYoYPct: 2.6, stoppedPaying: true, confidence: "modeled" },
];

/** Premium path by industry for heat / stacked panels (selected years) */
export type IndustryYear = "2021" | "2022" | "2023" | "2024" | "2025" | "2026";

export const INDUSTRY_YEARS: IndustryYear[] = ["2021", "2022", "2023", "2024", "2025", "2026"];

/** Modeled industry premium by year-end (pp) */
export const INDUSTRY_PREMIUM_BY_YEAR: Record<IndustryId, Record<IndustryYear, number>> = {
  "leis-hosp": { "2021": 2.8, "2022": 3.8, "2023": 2.6, "2024": 1.5, "2025": 0.8, "2026": 1.9 },
  construction: { "2021": 2.4, "2022": 3.2, "2023": 2.1, "2024": 1.2, "2025": 0.6, "2026": 1.5 },
  retail: { "2021": 2.2, "2022": 3.0, "2023": 1.9, "2024": 1.0, "2025": 0.5, "2026": 1.2 },
  health: { "2021": 2.0, "2022": 2.8, "2023": 1.8, "2024": 1.1, "2025": 0.7, "2026": 1.1 },
  transport: { "2021": 2.1, "2022": 2.9, "2023": 1.6, "2024": 0.8, "2025": 0.2, "2026": 0.7 },
  manufacturing: { "2021": 1.4, "2022": 2.1, "2023": 1.1, "2024": 0.4, "2025": -0.1, "2026": 0.3 },
  education: { "2021": 1.1, "2022": 1.6, "2023": 0.8, "2024": 0.2, "2025": -0.2, "2026": 0.0 },
  finance: { "2021": 1.2, "2022": 1.8, "2023": 0.6, "2024": -0.1, "2025": -0.5, "2026": -0.2 },
  "prof-biz": { "2021": 1.8, "2022": 2.4, "2023": 0.9, "2024": -0.2, "2025": -0.6, "2026": -0.4 },
  information: { "2021": 2.0, "2022": 2.7, "2023": 0.5, "2024": -0.6, "2025": -1.1, "2026": -0.8 },
};

export type AgeCohortId = "16-24" | "25-34" | "35-44" | "45-54" | "55+";

export type AgeRow = {
  id: AgeCohortId;
  label: string;
  premiumPp: number;
  peakPremiumPp: number;
  switcherPct: number;
  stayerPct: number;
  confidence: Confidence;
};

export const AGE_COHORTS: AgeRow[] = [
  { id: "16-24", label: "Ages 16–24", premiumPp: 1.6, peakPremiumPp: 3.4, switcherPct: 5.8, stayerPct: 4.2, confidence: "modeled" },
  { id: "25-34", label: "Ages 25–34", premiumPp: 1.1, peakPremiumPp: 3.0, switcherPct: 5.1, stayerPct: 4.0, confidence: "modeled" },
  { id: "35-44", label: "Ages 35–44", premiumPp: 0.7, peakPremiumPp: 2.4, switcherPct: 4.4, stayerPct: 3.7, confidence: "modeled" },
  { id: "45-54", label: "Ages 45–54", premiumPp: 0.4, peakPremiumPp: 1.8, switcherPct: 3.9, stayerPct: 3.5, confidence: "modeled" },
  { id: "55+", label: "Ages 55+", premiumPp: 0.2, peakPremiumPp: 1.2, switcherPct: 3.5, stayerPct: 3.3, confidence: "modeled" },
];

export type EduCohortId = "hs-or-less" | "some-college" | "bachelor" | "advanced";

export type EduRow = {
  id: EduCohortId;
  label: string;
  premiumPp: number;
  peakPremiumPp: number;
  switcherPct: number;
  stayerPct: number;
  confidence: Confidence;
};

export const EDU_COHORTS: EduRow[] = [
  { id: "hs-or-less", label: "HS or less", premiumPp: 1.3, peakPremiumPp: 3.2, switcherPct: 5.0, stayerPct: 3.7, confidence: "modeled" },
  { id: "some-college", label: "Some college / AA", premiumPp: 0.9, peakPremiumPp: 2.7, switcherPct: 4.6, stayerPct: 3.7, confidence: "modeled" },
  { id: "bachelor", label: "Bachelor's", premiumPp: 0.4, peakPremiumPp: 2.3, switcherPct: 4.2, stayerPct: 3.8, confidence: "modeled" },
  { id: "advanced", label: "Advanced degree", premiumPp: -0.1, peakPremiumPp: 1.9, switcherPct: 3.8, stayerPct: 3.9, confidence: "modeled" },
];

/** Heat cells: industry × year premium */
export function industryHeatRows(): { industry: string; id: IndustryId; values: Record<IndustryYear, number> }[] {
  return INDUSTRIES.map((ind) => ({
    industry: ind.short,
    id: ind.id,
    values: INDUSTRY_PREMIUM_BY_YEAR[ind.id],
  }));
}

export const ANALYTICS = {
  defaultPanel: "premium-path" as const,
  defaultIndustry: "information" as IndustryId,
  defaultCohortView: "industry" as "industry" | "age" | "education",
  industriesStoppedPaying: INDUSTRIES.filter((i) => i.stoppedPaying).map((i) => i.label),
  stillPayingLeaders: INDUSTRIES.filter((i) => i.premiumPp >= 1.0).map((i) => i.label),
};

/** Visible copy anchors for Playwright smoke */
export const VIZ_MARKERS = [
  "Switcher−stayer premium",
  "Industry ladder",
  "Quits × premium",
  "Industry heat",
  "Cohort cut",
  "Peak vs now",
] as const;
