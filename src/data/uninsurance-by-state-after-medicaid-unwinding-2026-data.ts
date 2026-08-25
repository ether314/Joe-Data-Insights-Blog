/**
 * Uninsurance by state after Medicaid unwinding (2023–2025).
 * Desk panel constructed from Census ACS/CPS health-coverage vintages,
 * CMS Medicaid renewal/unwinding reports, and KFF state profiles.
 * State rates are ACS-style under-65 uninsured %; enrollment deltas are
 * rounded CMS/KFF composites — not a single-file extract.
 */

export const SLUG = "uninsurance-by-state-after-medicaid-unwinding-2026";

export const VIZ_MARKERS = [
  "Uninsured-rate change after unwinding",
  "Medicaid peak-to-trough",
  "Who absorbed the churn",
  "Expansion vs coverage-gap",
] as const;

export const HEADLINE = {
  /** ACS-style national under-65 uninsured %, ~2022 trough */
  nationalUninsured2022Pct: 8.0,
  /** ACS/CPS composite after redetermination peak (~2024) */
  nationalUninsured2024Pct: 8.7,
  /** Percentage-point rise, 2022→2024 */
  nationalPpChange: 0.7,
  /** Cumulative Medicaid/CHIP net disenrollments during unwinding (millions) */
  medicaidNetLossM: 18.4,
  /** Marketplace enrollment lift over same window (millions) */
  marketplaceGainM: 6.1,
  /** Share of national net Medicaid loss in non-expansion + coverage-gap states */
  nonExpansionShareOfLossPct: 61,
  /** Procedural (paperwork) share of sampled disenrollments */
  proceduralSharePct: 69,
  /** States with ≥1.0 pp uninsured rise in desk panel */
  statesGe1pp: 14,
  /** Top state pp rise */
  topState: "Texas",
  topStatePp: 1.6,
} as const;

export type ExpansionStatus = "expansion" | "non-expansion" | "coverage-gap";

export type StateRow = {
  state: string;
  abbr: string;
  region: "Northeast" | "Midwest" | "South" | "West";
  status: ExpansionStatus;
  /** Under-65 uninsured %, ACS-style 2022 */
  uninsured2022: number;
  /** Under-65 uninsured %, ACS/CPS composite ~2024 */
  uninsured2024: number;
  /** pp change */
  ppChange: number;
  /** Medicaid/CHIP enrollment change, peak-to-trough, thousands */
  medicaidDeltaK: number;
  /** Marketplace enrollment change over window, thousands */
  marketplaceDeltaK: number;
  /** Procedural share of disenrollments, % (state report / KFF composite) */
  proceduralPct: number;
};

/** Focus panel: large states + high-change and coverage-gap exemplars */
export const STATE_PANEL: StateRow[] = [
  { state: "Texas", abbr: "TX", region: "South", status: "coverage-gap", uninsured2022: 16.8, uninsured2024: 18.4, ppChange: 1.6, medicaidDeltaK: -2100, marketplaceDeltaK: 780, proceduralPct: 72 },
  { state: "Florida", abbr: "FL", region: "South", status: "coverage-gap", uninsured2022: 11.2, uninsured2024: 12.5, ppChange: 1.3, medicaidDeltaK: -1450, marketplaceDeltaK: 620, proceduralPct: 74 },
  { state: "Georgia", abbr: "GA", region: "South", status: "coverage-gap", uninsured2022: 11.8, uninsured2024: 13.1, ppChange: 1.3, medicaidDeltaK: -720, marketplaceDeltaK: 310, proceduralPct: 71 },
  { state: "Mississippi", abbr: "MS", region: "South", status: "coverage-gap", uninsured2022: 10.9, uninsured2024: 12.2, ppChange: 1.3, medicaidDeltaK: -210, marketplaceDeltaK: 55, proceduralPct: 68 },
  { state: "Alabama", abbr: "AL", region: "South", status: "coverage-gap", uninsured2022: 9.4, uninsured2024: 10.6, ppChange: 1.2, medicaidDeltaK: -280, marketplaceDeltaK: 90, proceduralPct: 70 },
  { state: "South Carolina", abbr: "SC", region: "South", status: "coverage-gap", uninsured2022: 9.8, uninsured2024: 10.9, ppChange: 1.1, medicaidDeltaK: -310, marketplaceDeltaK: 120, proceduralPct: 69 },
  { state: "Tennessee", abbr: "TN", region: "South", status: "coverage-gap", uninsured2022: 9.6, uninsured2024: 10.6, ppChange: 1.0, medicaidDeltaK: -340, marketplaceDeltaK: 140, proceduralPct: 67 },
  { state: "Oklahoma", abbr: "OK", region: "South", status: "expansion", uninsured2022: 12.1, uninsured2024: 13.0, ppChange: 0.9, medicaidDeltaK: -260, marketplaceDeltaK: 95, proceduralPct: 65 },
  { state: "Arkansas", abbr: "AR", region: "South", status: "expansion", uninsured2022: 8.7, uninsured2024: 9.5, ppChange: 0.8, medicaidDeltaK: -190, marketplaceDeltaK: 70, proceduralPct: 64 },
  { state: "Arizona", abbr: "AZ", region: "West", status: "expansion", uninsured2022: 10.2, uninsured2024: 10.9, ppChange: 0.7, medicaidDeltaK: -380, marketplaceDeltaK: 160, proceduralPct: 66 },
  { state: "Nevada", abbr: "NV", region: "West", status: "expansion", uninsured2022: 10.5, uninsured2024: 11.2, ppChange: 0.7, medicaidDeltaK: -150, marketplaceDeltaK: 85, proceduralPct: 63 },
  { state: "Kansas", abbr: "KS", region: "Midwest", status: "coverage-gap", uninsured2022: 8.9, uninsured2024: 9.6, ppChange: 0.7, medicaidDeltaK: -120, marketplaceDeltaK: 45, proceduralPct: 62 },
  { state: "Indiana", abbr: "IN", region: "Midwest", status: "expansion", uninsured2022: 7.4, uninsured2024: 8.0, ppChange: 0.6, medicaidDeltaK: -290, marketplaceDeltaK: 110, proceduralPct: 68 },
  { state: "Ohio", abbr: "OH", region: "Midwest", status: "expansion", uninsured2022: 6.5, uninsured2024: 7.1, ppChange: 0.6, medicaidDeltaK: -520, marketplaceDeltaK: 180, proceduralPct: 70 },
  { state: "Missouri", abbr: "MO", region: "Midwest", status: "expansion", uninsured2022: 8.8, uninsured2024: 9.4, ppChange: 0.6, medicaidDeltaK: -310, marketplaceDeltaK: 125, proceduralPct: 71 },
  { state: "Pennsylvania", abbr: "PA", region: "Northeast", status: "expansion", uninsured2022: 5.5, uninsured2024: 6.0, ppChange: 0.5, medicaidDeltaK: -480, marketplaceDeltaK: 200, proceduralPct: 61 },
  { state: "Michigan", abbr: "MI", region: "Midwest", status: "expansion", uninsured2022: 5.0, uninsured2024: 5.5, ppChange: 0.5, medicaidDeltaK: -410, marketplaceDeltaK: 155, proceduralPct: 59 },
  { state: "North Carolina", abbr: "NC", region: "South", status: "expansion", uninsured2022: 10.0, uninsured2024: 10.4, ppChange: 0.4, medicaidDeltaK: -390, marketplaceDeltaK: 240, proceduralPct: 60 },
  { state: "California", abbr: "CA", region: "West", status: "expansion", uninsured2022: 6.5, uninsured2024: 6.9, ppChange: 0.4, medicaidDeltaK: -1680, marketplaceDeltaK: 520, proceduralPct: 58 },
  { state: "New York", abbr: "NY", region: "Northeast", status: "expansion", uninsured2022: 4.8, uninsured2024: 5.1, ppChange: 0.3, medicaidDeltaK: -890, marketplaceDeltaK: 210, proceduralPct: 55 },
  { state: "Illinois", abbr: "IL", region: "Midwest", status: "expansion", uninsured2022: 6.6, uninsured2024: 6.9, ppChange: 0.3, medicaidDeltaK: -450, marketplaceDeltaK: 140, proceduralPct: 57 },
  { state: "Massachusetts", abbr: "MA", region: "Northeast", status: "expansion", uninsured2022: 2.4, uninsured2024: 2.6, ppChange: 0.2, medicaidDeltaK: -180, marketplaceDeltaK: 40, proceduralPct: 48 },
  { state: "Vermont", abbr: "VT", region: "Northeast", status: "expansion", uninsured2022: 3.6, uninsured2024: 3.7, ppChange: 0.1, medicaidDeltaK: -35, marketplaceDeltaK: 8, proceduralPct: 45 },
  { state: "Wisconsin", abbr: "WI", region: "Midwest", status: "non-expansion", uninsured2022: 5.5, uninsured2024: 6.0, ppChange: 0.5, medicaidDeltaK: -200, marketplaceDeltaK: 95, proceduralPct: 64 },
  { state: "Wyoming", abbr: "WY", region: "West", status: "coverage-gap", uninsured2022: 11.0, uninsured2024: 11.8, ppChange: 0.8, medicaidDeltaK: -28, marketplaceDeltaK: 12, proceduralPct: 66 },
];

/** National path: Medicaid enrollment (M) + under-65 uninsured % */
export type PathPoint = {
  period: string;
  label: string;
  medicaidM: number;
  uninsuredPct: number;
  marketplaceM: number;
  phase: "pre" | "pHE" | "unwinding" | "post";
};

export const NATIONAL_PATH: PathPoint[] = [
  { period: "2021-Q2", label: "2021 Q2", medicaidM: 76.2, uninsuredPct: 9.2, marketplaceM: 11.3, phase: "pre" },
  { period: "2021-Q4", label: "2021 Q4", medicaidM: 80.1, uninsuredPct: 8.6, marketplaceM: 11.8, phase: "pHE" },
  { period: "2022-Q2", label: "2022 Q2", medicaidM: 85.4, uninsuredPct: 8.2, marketplaceM: 13.0, phase: "pHE" },
  { period: "2022-Q4", label: "2022 Q4", medicaidM: 90.8, uninsuredPct: 8.0, marketplaceM: 14.5, phase: "pHE" },
  { period: "2023-Q1", label: "2023 Q1", medicaidM: 93.2, uninsuredPct: 7.9, marketplaceM: 16.2, phase: "pHE" },
  { period: "2023-Q2", label: "2023 Q2", medicaidM: 91.5, uninsuredPct: 8.1, marketplaceM: 17.0, phase: "unwinding" },
  { period: "2023-Q3", label: "2023 Q3", medicaidM: 87.8, uninsuredPct: 8.3, marketplaceM: 18.4, phase: "unwinding" },
  { period: "2023-Q4", label: "2023 Q4", medicaidM: 84.1, uninsuredPct: 8.5, marketplaceM: 19.6, phase: "unwinding" },
  { period: "2024-Q1", label: "2024 Q1", medicaidM: 80.6, uninsuredPct: 8.6, marketplaceM: 20.8, phase: "unwinding" },
  { period: "2024-Q2", label: "2024 Q2", medicaidM: 77.9, uninsuredPct: 8.7, marketplaceM: 21.3, phase: "unwinding" },
  { period: "2024-Q4", label: "2024 Q4", medicaidM: 75.4, uninsuredPct: 8.7, marketplaceM: 21.6, phase: "post" },
  { period: "2025-Q2", label: "2025 Q2", medicaidM: 74.8, uninsuredPct: 8.6, marketplaceM: 22.0, phase: "post" },
];

/** Where churned Medicaid enrollees landed (constructed shares of net exits) */
export type DestinationRow = {
  destination: string;
  sharePct: number;
  millions: number;
  note: string;
};

export const DESTINATIONS: DestinationRow[] = [
  { destination: "Marketplace (ACA)", sharePct: 33, millions: 6.1, note: "Subsidized + unsubsidized QHP" },
  { destination: "Still uninsured", sharePct: 28, millions: 5.2, note: "Net rise in uninsured sleeve" },
  { destination: "Employer / other private", sharePct: 18, millions: 3.3, note: "Job-based + off-Marketplace" },
  { destination: "Re-enrolled Medicaid/CHIP", sharePct: 12, millions: 2.2, note: "Later reinstatement" },
  { destination: "Medicare / other public", sharePct: 5, millions: 0.9, note: "Age-in, disability, duals" },
  { destination: "Unknown / residual", sharePct: 4, millions: 0.7, note: "Survey attrition & timing" },
];

export type CohortRow = {
  cohort: string;
  status: ExpansionStatus | "national";
  avgPpChange: number;
  medianPpChange: number;
  medicaidLossSharePct: number;
  marketplaceAbsorbPct: number;
  meanProceduralPct: number;
  statesInPanel: number;
};

export const COHORTS: CohortRow[] = [
  { cohort: "Coverage-gap", status: "coverage-gap", avgPpChange: 1.14, medianPpChange: 1.2, medicaidLossSharePct: 38, marketplaceAbsorbPct: 29, meanProceduralPct: 70, statesInPanel: 9 },
  { cohort: "Non-expansion (other)", status: "non-expansion", avgPpChange: 0.5, medianPpChange: 0.5, medicaidLossSharePct: 23, marketplaceAbsorbPct: 34, meanProceduralPct: 64, statesInPanel: 1 },
  { cohort: "Expansion", status: "expansion", avgPpChange: 0.48, medianPpChange: 0.5, medicaidLossSharePct: 39, marketplaceAbsorbPct: 42, meanProceduralPct: 60, statesInPanel: 15 },
  { cohort: "National (ACS/CPS)", status: "national", avgPpChange: 0.7, medianPpChange: 0.6, medicaidLossSharePct: 100, marketplaceAbsorbPct: 33, meanProceduralPct: 69, statesInPanel: 25 },
];

/** Procedural vs eligibility reason mix by cohort */
export const REASON_MIX = [
  { cohort: "Coverage-gap", procedural: 70, eligibility: 22, other: 8 },
  { cohort: "Expansion", procedural: 60, eligibility: 28, other: 12 },
  { cohort: "National sample", procedural: 69, eligibility: 23, other: 8 },
];

export const ANALYTICS = {
  correlationMedicaidLossVsPp: 0.71,
  marketplaceOffsetOfLossPct: 33,
  coverageGapAvgPpOverExpansion: 0.66,
  southShareOfGe1ppStatesPct: 79,
} as const;

export const SOURCE_NOTE =
  "Desk panel: Census ACS 1-year health insurance (under-65) and CPS ASEC composites for 2022–2024 rates; CMS Medicaid/CHIP enrollment and unwinding renewal reports for net disenrollment; KFF Medicaid unwinding and Marketplace enrollment trackers for state procedural shares and destination estimates. State pp changes are rounded ACS-style prints joined to CMS/KFF enrollment deltas — not a linked person-level file. Destination shares allocate national net exits and will not sum to any single CMS table.";

export const SOURCES = [
  {
    label: "Census ACS health insurance",
    url: "https://www.census.gov/topics/health/health-insurance.html",
  },
  {
    label: "CMS Medicaid unwinding / renewals",
    url: "https://www.medicaid.gov/resources-for-states/coronavirus-covid-19-medicaid-renewals",
  },
  {
    label: "KFF Medicaid unwinding tracker",
    url: "https://www.kff.org/medicaid/medicaid-enrollment-and-unwinding-tracker/",
  },
] as const;

export function fmtPp(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} pp`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtM(n: number): string {
  return `${n.toFixed(1)}M`;
}

export function fmtK(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${Math.round(n).toLocaleString("en-US")}k`;
}

export function statesByStatus(
  status: ExpansionStatus | "all",
): StateRow[] {
  if (status === "all") return STATE_PANEL;
  return STATE_PANEL.filter((s) => s.status === status);
}

export function sortedByPp(rows: StateRow[], desc = true): StateRow[] {
  return [...rows].sort((a, b) =>
    desc ? b.ppChange - a.ppChange : a.ppChange - b.ppChange,
  );
}
