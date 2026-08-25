/**
 * Health insurance coverage gaps — Census ACS 2023→2024 (2026 desk).
 *
 * Core question: Where do working-age adults remain uninsured at scale,
 * and which states lost ground during the post-Medicaid-unwinding period?
 *
 * Primary anchors: Census ACSBR-024 (Health Insurance Coverage by State:
 * 2023 and 2024); Census CPS ASEC P60-288 age/demographic context;
 * KFF uninsured profiles + Medicaid expansion status; CMS unwinding
 * continuous-coverage end date (Mar 31, 2023) and 14-month renewal window.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "State working-age (19–64) and all-ages uninsured rates are Census ACS 1-year estimates from ACSBR-024 (Sept 2025), Appendix Tables 2–3. National working-age rate: 11.0% (2023) → 11.3% (2024). Age-band and race/ethnicity working-age rates draw on Census CPS ASEC P60-288 (Health Insurance Coverage in the United States: 2024). Medicaid expansion status as of Jan 1, 2024 follows KFF / ACSBR Appendix Table 1. National Medicaid coverage share (all ages) ACS: 21.3% → 20.5%. Uninsured headcounts for large states are desk estimates = ACS rate × ACS civilian noninstitutionalized population (rounded) — labeled estimated. CMS continuous enrollment ended Mar 31, 2023; states had through June 30, 2024 to complete renewals. ACS measures point-in-time coverage at interview and is not identical to CPS ASEC.";

export const SOURCES = [
  {
    label: "Census — ACSBR-024 Health Insurance Coverage by State 2023–2024",
    url: "https://www.census.gov/library/publications/2025/demo/acsbr-024.html",
  },
  {
    label: "Census — P60-288 Health Insurance Coverage in the United States: 2024",
    url: "https://www.census.gov/library/publications/2025/demo/p60-288.html",
  },
  {
    label: "KFF — Key Facts about the Uninsured Population",
    url: "https://www.kff.org/uninsured/key-facts-about-the-uninsured-population/",
  },
  {
    label: "CMS — Medicaid continuous enrollment / unwinding",
    url: "https://www.medicaid.gov/resources-for-states/coronavirus-covid-19-state-medicaid-chip-guidance/medicaid-and-chip-unwinding",
  },
] as const;

export const VIZ_MARKERS = [
  "Working-age uninsured — Texas 21.6%",
  "State ladder vs national 11.3%",
  "Unwinding delta scatter",
] as const;

/** Headline punchline — ACS working-age (19–64) uninsured */
export const HEADLINE = {
  /** ACS national working-age uninsured 2024 (%) */
  usWorkingAge2024: 11.3,
  /** ACS national working-age uninsured 2023 (%) */
  usWorkingAge2023: 11.0,
  /** Percentage-point change (rounded ACS disclosed) */
  usDeltaPp: 0.3,
  /** ACS all-ages uninsured 2024 (%) */
  usAllAges2024: 8.2,
  /** ACS all-ages uninsured 2023 (%) */
  usAllAges2023: 7.9,
  /** ACS Medicaid coverage share all ages 2024 (%) */
  medicaidShare2024: 20.5,
  /** ACS Medicaid coverage share all ages 2023 (%) */
  medicaidShare2023: 21.3,
  /** Highest working-age rate 2024 — Texas (%) */
  texasRate2024: 21.6,
  /** Lowest working-age rate 2024 — Massachusetts (%) */
  massRate2024: 3.7,
  /** States + DC with significant working-age uninsured increase */
  statesSigIncrease: 18,
  /** States with significant working-age uninsured decrease (CA, MS, NC) */
  statesSigDecrease: 3,
  /** Non-expansion states as of Jan 1, 2024 */
  nonExpansionCount: 10,
  /** Largest pp increase working-age — DC */
  largestJumpPp: 2.2,
  largestJumpState: "District of Columbia",
  /** Largest pp decrease working-age — NC */
  largestDropPp: -1.2,
  largestDropState: "North Carolina",
  /** States where Medicaid coverage fell (all ages ACS) */
  medicaidDeclineStates: 30,
  /** Estimated working-age uninsured in Texas (millions) */
  texasUninsuredM: 4.1,
} as const;

export type RegionId = "South" | "Midwest" | "West" | "Northeast";

export type ExpansionStatus = "expanded" | "non-expansion";

export type StateGapRow = {
  state: string;
  abbr: string;
  region: RegionId;
  expansion: ExpansionStatus;
  rate2023: number;
  rate2024: number;
  deltaPp: number;
  /** ACS 90% significance on working-age change */
  significant: boolean;
  /** Estimated working-age uninsured population (millions) */
  uninsuredM: number;
  confidence: Confidence;
};

/**
 * ACSBR-024 Appendix Table 3 — uninsured adults aged 19–64, 2023–2024.
 * uninsuredM = desk estimate from ACS rate × working-age civ. noninst. pop.
 */
export const STATE_GAPS: StateGapRow[] = [
  { state: "Alabama", abbr: "AL", region: "South", expansion: "non-expansion", rate2023: 12.9, rate2024: 12.3, deltaPp: -0.6, significant: false, uninsuredM: 0.37, confidence: "disclosed" },
  { state: "Alaska", abbr: "AK", region: "West", expansion: "expanded", rate2023: 14.1, rate2024: 14.5, deltaPp: 0.4, significant: false, uninsuredM: 0.06, confidence: "disclosed" },
  { state: "Arizona", abbr: "AZ", region: "West", expansion: "expanded", rate2023: 13.5, rate2024: 13.8, deltaPp: 0.3, significant: false, uninsuredM: 0.58, confidence: "disclosed" },
  { state: "Arkansas", abbr: "AR", region: "South", expansion: "expanded", rate2023: 12.4, rate2024: 12.9, deltaPp: 0.5, significant: false, uninsuredM: 0.23, confidence: "disclosed" },
  { state: "California", abbr: "CA", region: "West", expansion: "expanded", rate2023: 9.0, rate2024: 8.4, deltaPp: -0.7, significant: true, uninsuredM: 2.05, confidence: "disclosed" },
  { state: "Colorado", abbr: "CO", region: "West", expansion: "expanded", rate2023: 9.2, rate2024: 10.5, deltaPp: 1.2, significant: true, uninsuredM: 0.38, confidence: "disclosed" },
  { state: "Connecticut", abbr: "CT", region: "Northeast", expansion: "expanded", rate2023: 8.1, rate2024: 8.6, deltaPp: 0.5, significant: false, uninsuredM: 0.18, confidence: "disclosed" },
  { state: "Delaware", abbr: "DE", region: "South", expansion: "expanded", rate2023: 9.3, rate2024: 9.6, deltaPp: 0.3, significant: false, uninsuredM: 0.06, confidence: "disclosed" },
  { state: "District of Columbia", abbr: "DC", region: "South", expansion: "expanded", rate2023: 3.5, rate2024: 5.7, deltaPp: 2.2, significant: true, uninsuredM: 0.03, confidence: "disclosed" },
  { state: "Florida", abbr: "FL", region: "South", expansion: "non-expansion", rate2023: 15.5, rate2024: 15.5, deltaPp: 0.0, significant: false, uninsuredM: 1.95, confidence: "disclosed" },
  { state: "Georgia", abbr: "GA", region: "South", expansion: "non-expansion", rate2023: 16.1, rate2024: 16.5, deltaPp: 0.4, significant: false, uninsuredM: 1.05, confidence: "disclosed" },
  { state: "Hawaii", abbr: "HI", region: "West", expansion: "expanded", rate2023: 4.4, rate2024: 4.9, deltaPp: 0.5, significant: false, uninsuredM: 0.04, confidence: "disclosed" },
  { state: "Idaho", abbr: "ID", region: "West", expansion: "expanded", rate2023: 12.4, rate2024: 12.3, deltaPp: -0.1, significant: false, uninsuredM: 0.14, confidence: "disclosed" },
  { state: "Illinois", abbr: "IL", region: "Midwest", expansion: "expanded", rate2023: 8.8, rate2024: 9.9, deltaPp: 1.0, significant: true, uninsuredM: 0.74, confidence: "disclosed" },
  { state: "Indiana", abbr: "IN", region: "Midwest", expansion: "expanded", rate2023: 9.1, rate2024: 10.1, deltaPp: 1.0, significant: true, uninsuredM: 0.40, confidence: "disclosed" },
  { state: "Iowa", abbr: "IA", region: "Midwest", expansion: "expanded", rate2023: 7.1, rate2024: 7.7, deltaPp: 0.6, significant: true, uninsuredM: 0.14, confidence: "disclosed" },
  { state: "Kansas", abbr: "KS", region: "Midwest", expansion: "non-expansion", rate2023: 11.9, rate2024: 11.7, deltaPp: -0.2, significant: false, uninsuredM: 0.20, confidence: "disclosed" },
  { state: "Kentucky", abbr: "KY", region: "South", expansion: "expanded", rate2023: 7.7, rate2024: 9.5, deltaPp: 1.8, significant: true, uninsuredM: 0.25, confidence: "disclosed" },
  { state: "Louisiana", abbr: "LA", region: "South", expansion: "expanded", rate2023: 10.0, rate2024: 11.5, deltaPp: 1.6, significant: true, uninsuredM: 0.31, confidence: "disclosed" },
  { state: "Maine", abbr: "ME", region: "Northeast", expansion: "expanded", rate2023: 8.6, rate2024: 7.9, deltaPp: -0.6, significant: false, uninsuredM: 0.06, confidence: "disclosed" },
  { state: "Maryland", abbr: "MD", region: "South", expansion: "expanded", rate2023: 8.5, rate2024: 8.5, deltaPp: 0.0, significant: false, uninsuredM: 0.32, confidence: "disclosed" },
  { state: "Massachusetts", abbr: "MA", region: "Northeast", expansion: "expanded", rate2023: 3.5, rate2024: 3.7, deltaPp: 0.2, significant: false, uninsuredM: 0.16, confidence: "disclosed" },
  { state: "Michigan", abbr: "MI", region: "Midwest", expansion: "expanded", rate2023: 6.4, rate2024: 7.2, deltaPp: 0.8, significant: true, uninsuredM: 0.42, confidence: "disclosed" },
  { state: "Minnesota", abbr: "MN", region: "Midwest", expansion: "expanded", rate2023: 5.7, rate2024: 7.0, deltaPp: 1.4, significant: true, uninsuredM: 0.24, confidence: "disclosed" },
  { state: "Mississippi", abbr: "MS", region: "South", expansion: "non-expansion", rate2023: 15.2, rate2024: 14.2, deltaPp: -0.9, significant: true, uninsuredM: 0.24, confidence: "disclosed" },
  { state: "Missouri", abbr: "MO", region: "Midwest", expansion: "expanded", rate2023: 10.6, rate2024: 10.5, deltaPp: -0.1, significant: false, uninsuredM: 0.38, confidence: "disclosed" },
  { state: "Montana", abbr: "MT", region: "West", expansion: "expanded", rate2023: 11.9, rate2024: 12.2, deltaPp: 0.3, significant: false, uninsuredM: 0.08, confidence: "disclosed" },
  { state: "Nebraska", abbr: "NE", region: "Midwest", expansion: "expanded", rate2023: 8.8, rate2024: 9.8, deltaPp: 1.0, significant: true, uninsuredM: 0.11, confidence: "disclosed" },
  { state: "Nevada", abbr: "NV", region: "West", expansion: "expanded", rate2023: 14.6, rate2024: 15.5, deltaPp: 0.9, significant: false, uninsuredM: 0.30, confidence: "disclosed" },
  { state: "New Hampshire", abbr: "NH", region: "Northeast", expansion: "expanded", rate2023: 6.7, rate2024: 6.5, deltaPp: -0.2, significant: false, uninsuredM: 0.05, confidence: "disclosed" },
  { state: "New Jersey", abbr: "NJ", region: "Northeast", expansion: "expanded", rate2023: 10.2, rate2024: 10.8, deltaPp: 0.7, significant: true, uninsuredM: 0.58, confidence: "disclosed" },
  { state: "New Mexico", abbr: "NM", region: "West", expansion: "expanded", rate2023: 13.3, rate2024: 14.9, deltaPp: 1.7, significant: true, uninsuredM: 0.18, confidence: "disclosed" },
  { state: "New York", abbr: "NY", region: "Northeast", expansion: "expanded", rate2023: 6.8, rate2024: 7.0, deltaPp: 0.2, significant: false, uninsuredM: 0.82, confidence: "disclosed" },
  { state: "North Carolina", abbr: "NC", region: "South", expansion: "expanded", rate2023: 13.3, rate2024: 12.1, deltaPp: -1.2, significant: true, uninsuredM: 0.78, confidence: "disclosed" },
  { state: "North Dakota", abbr: "ND", region: "Midwest", expansion: "expanded", rate2023: 6.1, rate2024: 7.4, deltaPp: 1.3, significant: true, uninsuredM: 0.03, confidence: "disclosed" },
  { state: "Ohio", abbr: "OH", region: "Midwest", expansion: "expanded", rate2023: 8.4, rate2024: 9.1, deltaPp: 0.7, significant: true, uninsuredM: 0.62, confidence: "disclosed" },
  { state: "Oklahoma", abbr: "OK", region: "South", expansion: "expanded", rate2023: 16.1, rate2024: 15.9, deltaPp: -0.2, significant: false, uninsuredM: 0.38, confidence: "disclosed" },
  { state: "Oregon", abbr: "OR", region: "West", expansion: "expanded", rate2023: 8.0, rate2024: 7.6, deltaPp: -0.4, significant: false, uninsuredM: 0.19, confidence: "disclosed" },
  { state: "Pennsylvania", abbr: "PA", region: "Northeast", expansion: "expanded", rate2023: 7.1, rate2024: 7.8, deltaPp: 0.7, significant: true, uninsuredM: 0.58, confidence: "disclosed" },
  { state: "Rhode Island", abbr: "RI", region: "Northeast", expansion: "expanded", rate2023: 6.1, rate2024: 6.3, deltaPp: 0.2, significant: false, uninsuredM: 0.04, confidence: "disclosed" },
  { state: "South Carolina", abbr: "SC", region: "South", expansion: "non-expansion", rate2023: 13.2, rate2024: 13.1, deltaPp: -0.1, significant: false, uninsuredM: 0.40, confidence: "disclosed" },
  { state: "South Dakota", abbr: "SD", region: "Midwest", expansion: "expanded", rate2023: 11.3, rate2024: 10.6, deltaPp: -0.7, significant: false, uninsuredM: 0.05, confidence: "disclosed" },
  { state: "Tennessee", abbr: "TN", region: "South", expansion: "non-expansion", rate2023: 13.3, rate2024: 13.6, deltaPp: 0.3, significant: false, uninsuredM: 0.56, confidence: "disclosed" },
  { state: "Texas", abbr: "TX", region: "South", expansion: "non-expansion", rate2023: 21.7, rate2024: 21.6, deltaPp: -0.1, significant: false, uninsuredM: 4.10, confidence: "disclosed" },
  { state: "Utah", abbr: "UT", region: "West", expansion: "expanded", rate2023: 10.1, rate2024: 10.7, deltaPp: 0.5, significant: false, uninsuredM: 0.22, confidence: "disclosed" },
  { state: "Vermont", abbr: "VT", region: "Northeast", expansion: "expanded", rate2023: 5.0, rate2024: 6.3, deltaPp: 1.3, significant: true, uninsuredM: 0.02, confidence: "disclosed" },
  { state: "Virginia", abbr: "VA", region: "South", expansion: "expanded", rate2023: 8.7, rate2024: 9.5, deltaPp: 0.7, significant: true, uninsuredM: 0.50, confidence: "disclosed" },
  { state: "Washington", abbr: "WA", region: "West", expansion: "expanded", rate2023: 8.9, rate2024: 9.2, deltaPp: 0.3, significant: false, uninsuredM: 0.43, confidence: "disclosed" },
  { state: "West Virginia", abbr: "WV", region: "South", expansion: "expanded", rate2023: 9.1, rate2024: 9.0, deltaPp: -0.2, significant: false, uninsuredM: 0.09, confidence: "disclosed" },
  { state: "Wisconsin", abbr: "WI", region: "Midwest", expansion: "non-expansion", rate2023: 6.6, rate2024: 7.3, deltaPp: 0.7, significant: true, uninsuredM: 0.26, confidence: "disclosed" },
  { state: "Wyoming", abbr: "WY", region: "West", expansion: "non-expansion", rate2023: 15.6, rate2024: 14.2, deltaPp: -1.4, significant: false, uninsuredM: 0.05, confidence: "disclosed" },
];

export type VintageRow = {
  year: number;
  /** ACS national working-age (19–64) uninsured % */
  workingAgePct: number;
  /** ACS national all-ages uninsured % */
  allAgesPct: number;
  /** ACS Medicaid share all ages % */
  medicaidPct: number;
  note: string;
  confidence: Confidence;
};

/** National ACS path through continuous enrollment and unwinding */
export const NATIONAL_VINTAGE: VintageRow[] = [
  { year: 2019, workingAgePct: 12.9, allAgesPct: 9.2, medicaidPct: 19.8, note: "Pre-pandemic ACS", confidence: "carried" },
  { year: 2020, workingAgePct: 12.5, allAgesPct: 8.6, medicaidPct: 20.4, note: "Pandemic onset", confidence: "carried" },
  { year: 2021, workingAgePct: 11.6, allAgesPct: 8.3, medicaidPct: 21.0, note: "Continuous enrollment in force", confidence: "carried" },
  { year: 2022, workingAgePct: 11.2, allAgesPct: 8.0, medicaidPct: 21.2, note: "Coverage floor years", confidence: "carried" },
  { year: 2023, workingAgePct: 11.0, allAgesPct: 7.9, medicaidPct: 21.3, note: "Unwinding begins Apr 2023", confidence: "disclosed" },
  { year: 2024, workingAgePct: 11.3, allAgesPct: 8.2, medicaidPct: 20.5, note: "First full post-unwinding ACS year", confidence: "disclosed" },
];

export type AgeBandRow = {
  band: string;
  rate2024: number;
  note: string;
  confidence: Confidence;
};

/** CPS ASEC P60-288 working-age age bands (2024) */
export const AGE_BANDS: AgeBandRow[] = [
  { band: "19–25", rate2024: 14.3, note: "Highest working-age band", confidence: "disclosed" },
  { band: "26–34", rate2024: 12.1, note: "CPS ASEC desk band", confidence: "estimated" },
  { band: "35–44", rate2024: 10.8, note: "Significant YoY decline in CPS", confidence: "disclosed" },
  { band: "45–64", rate2024: 8.8, note: "Lowest working-age band", confidence: "disclosed" },
];

export type DemoRow = {
  group: string;
  rate2024: number;
  deltaNote: string;
  confidence: Confidence;
};

/** CPS ASEC working-age (19–64) by race/ethnicity, 2024 */
export const DEMO_GAPS: DemoRow[] = [
  { group: "Hispanic (any race)", rate2024: 23.0, deltaNote: "About 2× Black; >3× White NH", confidence: "disclosed" },
  { group: "Black", rate2024: 12.3, deltaNote: "+1.2 pp YoY (largest race change)", confidence: "disclosed" },
  { group: "Asian", rate2024: 6.9, deltaNote: "Statistically flat YoY", confidence: "disclosed" },
  { group: "White, non-Hispanic", rate2024: 6.8, deltaNote: "Lowest major group rate", confidence: "disclosed" },
];

export type ExpansionCompareRow = {
  group: string;
  rate2024: number;
  states: number;
  note: string;
};

/** Desk composite: ACS working-age mean weighted by uninsuredM within expansion status */
export const EXPANSION_COMPARE: ExpansionCompareRow[] = [
  {
    group: "Non-expansion (Jan 2024)",
    rate2024: 16.8,
    states: 10,
    note: "AL, FL, GA, KS, MS, SC, TN, TX, WI, WY — population-weighted desk mean",
  },
  {
    group: "Expansion states + DC",
    rate2024: 9.4,
    states: 41,
    note: "Includes recent expanders NC, SD, OK, MO — population-weighted desk mean",
  },
  {
    group: "United States",
    rate2024: 11.3,
    states: 51,
    note: "ACSBR-024 national working-age rate",
  },
];

export type RegionSummaryRow = {
  region: RegionId;
  meanRate2024: number;
  meanDeltaPp: number;
  statesAboveNational: number;
  topState: string;
  topRate: number;
};

function mean(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export const REGION_SUMMARY: RegionSummaryRow[] = (
  ["South", "Midwest", "West", "Northeast"] as RegionId[]
).map((region) => {
  const rows = STATE_GAPS.filter((s) => s.region === region);
  const top = [...rows].sort((a, b) => b.rate2024 - a.rate2024)[0];
  return {
    region,
    meanRate2024: Math.round(mean(rows.map((r) => r.rate2024)) * 10) / 10,
    meanDeltaPp: Math.round(mean(rows.map((r) => r.deltaPp)) * 10) / 10,
    statesAboveNational: rows.filter((r) => r.rate2024 > HEADLINE.usWorkingAge2024).length,
    topState: top.abbr,
    topRate: top.rate2024,
  };
});

export type CoverageMixRow = {
  year: number;
  privatePct: number;
  publicPct: number;
  uninsuredPct: number;
  medicaidPct: number;
  confidence: Confidence;
};

/** ACS all-ages coverage mix (SHADAC / Census ACS S2701) */
export const COVERAGE_MIX: CoverageMixRow[] = [
  { year: 2023, privatePct: 67.0, publicPct: 37.4, uninsuredPct: 7.9, medicaidPct: 21.3, confidence: "disclosed" },
  { year: 2024, privatePct: 67.2, publicPct: 36.8, uninsuredPct: 8.2, medicaidPct: 20.5, confidence: "disclosed" },
];

export type JumpRow = {
  state: string;
  abbr: string;
  deltaPp: number;
  rate2024: number;
  direction: "up" | "down";
};

/** Largest absolute working-age deltas (significant or notable) */
export const BIGGEST_MOVES: JumpRow[] = [...STATE_GAPS]
  .filter((s) => s.significant || Math.abs(s.deltaPp) >= 1.0)
  .sort((a, b) => Math.abs(b.deltaPp) - Math.abs(a.deltaPp))
  .slice(0, 14)
  .map((s) => ({
    state: s.state,
    abbr: s.abbr,
    deltaPp: s.deltaPp,
    rate2024: s.rate2024,
    direction: s.deltaPp >= 0 ? "up" : "down",
  }));

export function statesByRegion(region: "all" | RegionId): StateGapRow[] {
  if (region === "all") return STATE_GAPS;
  return STATE_GAPS.filter((s) => s.region === region);
}

export function statesByExpansion(
  filter: "all" | ExpansionStatus,
): StateGapRow[] {
  if (filter === "all") return STATE_GAPS;
  return STATE_GAPS.filter((s) => s.expansion === filter);
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtM(n: number): string {
  return `${n.toFixed(2)}M`;
}
