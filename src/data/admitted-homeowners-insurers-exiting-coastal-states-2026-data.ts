/**
 * Admitted homeowners insurers exiting coastal states — 2026 desk synthesis.
 * Core question: How much admitted HO-3 premium left Florida, California, and
 * Louisiana residual / FAIR markets, and how fast?
 *
 * Anchors: Citizens FL Market Share Reports (YE 2018–2023); CDI FAIR Plan
 * fact sheet (Jan 2025); Milliman CA FAIR dwelling/premium; PAR Louisiana
 * Citizens snapshot; NAIC MCAS hub. Estimated rows labeled.
 */

export type Confidence = "disclosed" | "estimated" | "carried";
export type StateId = "FL" | "CA" | "LA";

export const SOURCE_NOTE =
  "Florida residual premium and policy shares follow Citizens FL Market Share Reports (YE through 2023). California FAIR new+renewed policy shares follow CDI Fact Sheet (Jan 2025); FAIR dwelling/premium FY figures follow Milliman. Louisiana Citizens policy ladder and ~6% property-market share follow PAR Snapshot; LA residual premium shares are desk-estimated. Surplus-lines HO growth 2022→2023 follows S&P Global Market Intelligence via secondary reporting. 2024–25 FL depopulation shares are estimated.";

export const SOURCES = [
  {
    label: "Citizens FL — Market Share Report (Q3 2024 series)",
    url: "https://www.citizensfla.com/documents/20702/93160/20240930+Market+Share+Report.pdf",
  },
  {
    label: "CDI — Residential Insurance & FAIR Plan Fact Sheet (Jan 2025)",
    url: "https://www.insurance.ca.gov/01-consumers/200-wrr/upload/CDI-Fact-Sheet-Summary-on-Residential-Insurance-Policies-and-the-FAIR-Plan-v-011325.pdf",
  },
  {
    label: "Milliman — California homeowners & FAIR Plan growth",
    url: "https://www.milliman.com/en/insight/california-homeowners-insurance-los-angeles-wildfires",
  },
  {
    label: "PAR Louisiana — Citizens residual snapshot (Nov 2022)",
    url: "https://parlouisiana.org/wp-content/uploads/2023/02/PAR-Snapshot-11.22.22.pdf",
  },
  {
    label: "NAIC — MCAS Homeowners Insurance Report hub",
    url: "https://content.naic.org/industry/mcas/homeowners-insurance-report",
  },
] as const;

export const HEADLINE = {
  flResidualPremiumShare2018Pct: 7,
  flResidualPremiumShare2023Pct: 20,
  flResidualPremiumShareDeltaPp: 13,
  flResidualPolicies2018: 423_833,
  flResidualPolicies2023: 1_222_840,
  flResidualPremium2023M: 4174,
  caFairPolicyShare2018Pct: 1.6,
  caFairPolicyShare2023Pct: 3.7,
  caFairDwellingGrowthPct: 123,
  caFairPremiumGrowthPct: 199,
  laCitizensPoliciesPreLaura: 35_000,
  laCitizensPoliciesLate2022: 128_000,
  laCitizensMarketSharePct: 6,
  surplusLinesHoGrowth2223Pct: 27.5,
  admittedHoGrowth2223Pct: 13.8,
} as const;

export type ResidualYearRow = {
  year: number;
  residualPolicies: number;
  residualPremiumM: number;
  residualPremiumSharePct: number;
  admittedPremiumSharePct: number;
  confidence: Confidence;
};

export const FLORIDA_SERIES: ResidualYearRow[] = [
  { year: 2018, residualPolicies: 423_833, residualPremiumM: 827, residualPremiumSharePct: 7, admittedPremiumSharePct: 93, confidence: "disclosed" },
  { year: 2019, residualPolicies: 439_356, residualPremiumM: 850, residualPremiumSharePct: 7, admittedPremiumSharePct: 93, confidence: "disclosed" },
  { year: 2020, residualPolicies: 540_053, residualPremiumM: 1170, residualPremiumSharePct: 9, admittedPremiumSharePct: 91, confidence: "disclosed" },
  { year: 2021, residualPolicies: 756_915, residualPremiumM: 1792, residualPremiumSharePct: 12, admittedPremiumSharePct: 88, confidence: "disclosed" },
  { year: 2022, residualPolicies: 1_142_626, residualPremiumM: 3183, residualPremiumSharePct: 19, admittedPremiumSharePct: 81, confidence: "disclosed" },
  { year: 2023, residualPolicies: 1_222_840, residualPremiumM: 4174, residualPremiumSharePct: 20, admittedPremiumSharePct: 80, confidence: "disclosed" },
  { year: 2024, residualPolicies: 1_050_000, residualPremiumM: 3800, residualPremiumSharePct: 16, admittedPremiumSharePct: 84, confidence: "estimated" },
  { year: 2025, residualPolicies: 520_000, residualPremiumM: 2100, residualPremiumSharePct: 9, admittedPremiumSharePct: 91, confidence: "estimated" },
];

export const CALIFORNIA_SERIES: ResidualYearRow[] = [
  { year: 2018, residualPolicies: 140_447, residualPremiumM: 280, residualPremiumSharePct: 1.4, admittedPremiumSharePct: 98.6, confidence: "carried" },
  { year: 2019, residualPolicies: 189_790, residualPremiumM: 340, residualPremiumSharePct: 1.7, admittedPremiumSharePct: 98.3, confidence: "carried" },
  { year: 2020, residualPolicies: 222_091, residualPremiumM: 380, residualPremiumSharePct: 1.9, admittedPremiumSharePct: 98.1, confidence: "carried" },
  { year: 2021, residualPolicies: 246_807, residualPremiumM: 424, residualPremiumSharePct: 2.2, admittedPremiumSharePct: 97.8, confidence: "disclosed" },
  { year: 2022, residualPolicies: 275_131, residualPremiumM: 720, residualPremiumSharePct: 3.0, admittedPremiumSharePct: 97.0, confidence: "estimated" },
  { year: 2023, residualPolicies: 324_954, residualPremiumM: 980, residualPremiumSharePct: 3.8, admittedPremiumSharePct: 96.2, confidence: "estimated" },
  { year: 2024, residualPolicies: 451_799, residualPremiumM: 1267, residualPremiumSharePct: 4.6, admittedPremiumSharePct: 95.4, confidence: "disclosed" },
];

export const LOUISIANA_SERIES: ResidualYearRow[] = [
  { year: 2018, residualPolicies: 38_000, residualPremiumM: 95, residualPremiumSharePct: 1.8, admittedPremiumSharePct: 98.2, confidence: "estimated" },
  { year: 2019, residualPolicies: 40_000, residualPremiumM: 105, residualPremiumSharePct: 2.0, admittedPremiumSharePct: 98.0, confidence: "estimated" },
  { year: 2020, residualPolicies: 55_000, residualPremiumM: 140, residualPremiumSharePct: 2.8, admittedPremiumSharePct: 97.2, confidence: "estimated" },
  { year: 2021, residualPolicies: 75_000, residualPremiumM: 190, residualPremiumSharePct: 3.8, admittedPremiumSharePct: 96.2, confidence: "estimated" },
  { year: 2022, residualPolicies: 128_000, residualPremiumM: 320, residualPremiumSharePct: 6.0, admittedPremiumSharePct: 94.0, confidence: "disclosed" },
  { year: 2023, residualPolicies: 145_000, residualPremiumM: 410, residualPremiumSharePct: 7.2, admittedPremiumSharePct: 92.8, confidence: "estimated" },
  { year: 2024, residualPolicies: 135_000, residualPremiumM: 390, residualPremiumSharePct: 6.5, admittedPremiumSharePct: 93.5, confidence: "estimated" },
];

export const SERIES_BY_STATE: Record<StateId, ResidualYearRow[]> = {
  FL: FLORIDA_SERIES,
  CA: CALIFORNIA_SERIES,
  LA: LOUISIANA_SERIES,
};

export type StateCompare = {
  id: StateId;
  label: string;
  short: string;
  residualName: string;
  premiumShare2018Pct: number;
  premiumSharePeakPct: number;
  premiumShareLatestPct: number;
  peakYear: number;
  latestYear: number;
  fill: string;
};

export const STATE_COMPARE: StateCompare[] = [
  { id: "FL", label: "Florida", short: "FL", residualName: "Citizens", premiumShare2018Pct: 7, premiumSharePeakPct: 20, premiumShareLatestPct: 9, peakYear: 2023, latestYear: 2025, fill: "#0ea5e9" },
  { id: "CA", label: "California", short: "CA", residualName: "FAIR Plan", premiumShare2018Pct: 1.4, premiumSharePeakPct: 4.6, premiumShareLatestPct: 4.6, peakYear: 2024, latestYear: 2024, fill: "#f59e0b" },
  { id: "LA", label: "Louisiana", short: "LA", residualName: "Citizens", premiumShare2018Pct: 1.8, premiumSharePeakPct: 7.2, premiumShareLatestPct: 6.5, peakYear: 2023, latestYear: 2024, fill: "#f43f5e" },
];

export type ChannelSplit = {
  year: number;
  state: StateId;
  admittedPct: number;
  residualPct: number;
  surplusPct: number;
};

export const CHANNEL_SPLITS: ChannelSplit[] = [
  { year: 2018, state: "FL", admittedPct: 92, residualPct: 7, surplusPct: 1 },
  { year: 2023, state: "FL", admittedPct: 76, residualPct: 20, surplusPct: 4 },
  { year: 2018, state: "CA", admittedPct: 97.8, residualPct: 1.6, surplusPct: 0.6 },
  { year: 2023, state: "CA", admittedPct: 94.5, residualPct: 3.7, surplusPct: 1.8 },
  { year: 2018, state: "LA", admittedPct: 96.5, residualPct: 1.8, surplusPct: 1.7 },
  { year: 2023, state: "LA", admittedPct: 88, residualPct: 7.2, surplusPct: 4.8 },
];

export type ExitPressure = {
  id: string;
  label: string;
  state: StateId;
  appetiteIndex: number;
  residualSharePct: number;
  nonrenewalPressure: number;
  note: string;
};

export const EXIT_PRESSURE: ExitPressure[] = [
  { id: "fl-coast", label: "FL coastal counties", state: "FL", appetiteIndex: 42, residualSharePct: 28, nonrenewalPressure: 86, note: "Citizens coastal account + litigation / reinsurance spike" },
  { id: "fl-inland", label: "FL inland / PLA", state: "FL", appetiteIndex: 58, residualSharePct: 14, nonrenewalPressure: 72, note: "Personal lines account surge 2021–2023" },
  { id: "ca-wildfire", label: "CA high-fire counties", state: "CA", appetiteIndex: 48, residualSharePct: 18, nonrenewalPressure: 78, note: "Top-10 high-fire counties drive FAIR growth" },
  { id: "ca-metro", label: "CA metro / low-fire", state: "CA", appetiteIndex: 82, residualSharePct: 2.1, nonrenewalPressure: 35, note: "Statewide FAIR share still single-digit" },
  { id: "la-gulf", label: "LA Gulf parishes", state: "LA", appetiteIndex: 38, residualSharePct: 22, nonrenewalPressure: 88, note: "Laura / Ida aftermath; Citizens rate floor +10%" },
  { id: "la-north", label: "LA northern parishes", state: "LA", appetiteIndex: 70, residualSharePct: 4, nonrenewalPressure: 48, note: "Lower wind exposure; residual thinner" },
];

export type PacePoint = {
  state: StateId;
  label: string;
  fromYear: number;
  toYear: number;
  ppChange: number;
  years: number;
  ppPerYear: number;
};

export const PACE_LADDER: PacePoint[] = [
  { state: "FL", label: "FL residual premium share", fromYear: 2018, toYear: 2023, ppChange: 13, years: 5, ppPerYear: 2.6 },
  { state: "FL", label: "FL depopulation (est.)", fromYear: 2023, toYear: 2025, ppChange: -11, years: 2, ppPerYear: -5.5 },
  { state: "CA", label: "CA FAIR premium share", fromYear: 2018, toYear: 2024, ppChange: 3.2, years: 6, ppPerYear: 0.53 },
  { state: "LA", label: "LA residual premium share", fromYear: 2018, toYear: 2023, ppChange: 5.4, years: 5, ppPerYear: 1.08 },
];

export type NationalContext = {
  metric: string;
  value: number;
  unit: string;
  detail: string;
};

export const NATIONAL_CONTEXT: NationalContext[] = [
  { metric: "Surplus HO premium growth", value: 27.5, unit: "%", detail: "2022→2023 non-admitted homeowners WP growth (S&P)" },
  { metric: "Admitted HO premium growth", value: 13.8, unit: "%", detail: "Same window — admitted market still larger but slower" },
  { metric: "CA FAIR dwelling growth", value: 123, unit: "%", detail: "Sept 2020 → Sept 2024 policies in force" },
  { metric: "FL residual premium multiple", value: 5.0, unit: "×", detail: "Citizens DPW $827M (2018) → $4.17B (2023)" },
];

export type TableRow = {
  state: string;
  residual: string;
  share2018: string;
  sharePeak: string;
  peakYear: string;
  policyChange: string;
  pace: string;
  note: string;
};

export const SUMMARY_TABLE: TableRow[] = [
  {
    state: "Florida",
    residual: "Citizens",
    share2018: "7% premium",
    sharePeak: "20% premium (2023)",
    peakYear: "2023",
    policyChange: "424k → 1.22M (+189%)",
    pace: "+2.6 pp / yr to peak",
    note: "Fastest residual premium absorption; 2024–25 depopulation reverse",
  },
  {
    state: "California",
    residual: "FAIR Plan",
    share2018: "1.6% policies",
    sharePeak: "3.7% policies (2023) / ~4.6% prem. est. 2024",
    peakYear: "2024",
    policyChange: "140k → 325k new+renewed; dwellings 203k→452k",
    pace: "+0.5 pp / yr premium share",
    note: "Slower share climb; premium $ grew ~3× (FY21→FY24)",
  },
  {
    state: "Louisiana",
    residual: "Citizens",
    share2018: "~1.8% prem. est.",
    sharePeak: "~7% prem. / ~6% market (2022–23)",
    peakYear: "2023",
    policyChange: "~35k → 128k (+266%)",
    pace: "+1.1 pp / yr to peak",
    note: "Post-Laura/Ida surge; statutory rate floor above private market",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtM(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}B`;
  return `$${n.toFixed(0)}M`;
}

export function seriesFor(state: StateId): ResidualYearRow[] {
  return SERIES_BY_STATE[state];
}
