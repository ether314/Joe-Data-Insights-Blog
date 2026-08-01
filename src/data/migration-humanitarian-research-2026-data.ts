/**
 * Migration & humanitarian burden — who hosts people vs who funds the response.
 * Primary sources: UNHCR Global Trends 2024 (Jun 2025), UNHCR Global Report 2024/2025,
 * OCHA Global Humanitarian Overview 2025 (Oct update, FTS).
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "UNHCR Global Trends 2024 (end-2024 stocks; published Jun 2025); UNHCR Global Report 2024 & 2025 (budget, funds available, donor contributions); OCHA Global Humanitarian Overview 2025 October Update (FTS as of 31 Oct 2025 for global totals; HNRP/FA coverage as of end-Sep 2025). Host country stocks are refugees + people in need of international protection where Global Trends discloses them. Income-group hosting shares from UNHCR. GHO regional coverage from OCHA Oct 2025 snapshot.";

export const SOURCES = [
  {
    label: "UNHCR — Global Trends 2024",
    url: "https://www.unhcr.org/global-trends-report-2024",
  },
  {
    label: "UNHCR — Global Report 2024",
    url: "https://www.unhcr.org/publications/global-report-2024",
  },
  {
    label: "UNHCR — Global Report 2025",
    url: "https://www.unhcr.org/publications/global-report",
  },
  {
    label: "OCHA — GHO 2025 October Update (ReliefWeb)",
    url: "https://reliefweb.int/report/world/global-humanitarian-overview-2025-october-update-snapshot-31-october-2025",
  },
  {
    label: "UNHCR — Top government/EU donors 2024",
    url: "https://www.unhcr.org/us/about-unhcr/our-partners/governments",
  },
] as const;

export const HEADLINE = {
  displacedEnd2024M: 123.2,
  displacedApr2025M: 122.1,
  idpConflictM: 73.5,
  refugeesPlusOtherM: 42.7,
  asylumSeekersM: 8.4,
  lmicHostPct: 73,
  ldcHostPct: 23,
  neighbourHostPct: 67,
  unhcrBudget2024Bn: 10.785,
  unhcrAvailable2024Bn: 5.178,
  unhcrGap2024Pct: 52,
  unhcrFunded2024Pct: 48,
  unhcrBudget2025Bn: 10.604,
  unhcrAvailable2025Bn: 3.932,
  unhcrGap2025Pct: 63,
  unhcrFunded2025Pct: 37,
  ghoNeed2025M: 300,
  ghoTarget2025M: 181,
  ghoReq2025Bn: 45.37,
  ghoFunded2025Bn: 10.61,
  ghoCoverage2025Pct: 23.4,
  totalHumFunding2025Bn: 18.64,
  totalHumFundingYoYPct: -26,
  usDonor2024Bn: 2.056,
  sudanDisplacedM: 14.3,
  inDonorRefugeeOdaBn: 27.8,
} as const;

/** Forced displacement stock composition at end-2024 (millions). */
export const DISPLACEMENT_COMPOSITION = [
  {
    slice: "Conflict IDPs (IDMC)",
    short: "IDPs",
    millions: 73.5,
    note: "Internally displaced by conflict/violence — majority of forced displacement",
    confidence: "disclosed" as Confidence,
  },
  {
    slice: "Refugees & others needing protection",
    short: "Refugees+",
    millions: 42.7,
    note: "31M UNHCR-mandate refugees + 5.9M other OPNIIP + 5.9M Palestine refugees (UNRWA)",
    confidence: "disclosed" as Confidence,
  },
  {
    slice: "Asylum-seekers",
    short: "Asylum",
    millions: 8.4,
    note: "Pending individual asylum claims — record stock",
    confidence: "disclosed" as Confidence,
  },
];

/** Dual series: forced displacement stock vs UNHCR needs funded %. */
export const DISPLACEMENT_VS_FUNDING = [
  {
    year: 2020,
    displacedM: 82.4,
    displacedConf: "estimated" as Confidence,
    unhcrFundedPct: 59,
    unhcrFundedConf: "disclosed" as Confidence,
    note: "Displacement approx. from UNHCR decade path; funded % Global Report 2024",
  },
  {
    year: 2021,
    displacedM: 89.3,
    displacedConf: "estimated" as Confidence,
    unhcrFundedPct: 56,
    unhcrFundedConf: "disclosed" as Confidence,
    note: "Funded % Global Report 2024 chart series",
  },
  {
    year: 2022,
    displacedM: 108.4,
    displacedConf: "estimated" as Confidence,
    unhcrFundedPct: 56,
    unhcrFundedConf: "estimated" as Confidence,
    note: "Ukraine/Sudan surge year; funded % interpolated from GR chart",
  },
  {
    year: 2023,
    displacedM: 117.3,
    displacedConf: "estimated" as Confidence,
    unhcrFundedPct: 52,
    unhcrFundedConf: "disclosed" as Confidence,
    note: "48% funding gap → ~52% funded (Global Report 2024)",
  },
  {
    year: 2024,
    displacedM: 123.2,
    displacedConf: "disclosed" as Confidence,
    unhcrFundedPct: 48,
    unhcrFundedConf: "disclosed" as Confidence,
    note: "Global Trends end-2024; Global Report 2024 funds available / budget",
  },
  {
    year: 2025,
    displacedM: 122.1,
    displacedConf: "disclosed" as Confidence,
    unhcrFundedPct: 37,
    unhcrFundedConf: "disclosed" as Confidence,
    note: "Apr 2025 nowcast (Global Trends update); Global Report 2025 funded share",
  },
];

export type RegionLane =
  | "Africa"
  | "MENA"
  | "Europe"
  | "Asia-Pacific"
  | "Americas"
  | "Global";

export type AppealKind = "HNRP" | "Flash" | "Regional RRP";

/** Major 2025 appeal funding status (end-Sep 2025 FTS via OCHA GHO Oct update). */
export type AppealRow = {
  name: string;
  short: string;
  region: RegionLane;
  kind: AppealKind;
  peopleInNeedM: number;
  peopleTargetedM: number;
  reqBn: number;
  fundedBn: number;
  fundedPct: number;
  confidence: Confidence;
};

export const APPEALS_2025: AppealRow[] = [
  { name: "Sudan HNRP", short: "Sudan", region: "Africa", kind: "HNRP", peopleInNeedM: 30.4, peopleTargetedM: 20.9, reqBn: 4.2, fundedBn: 1.1, fundedPct: 27, confidence: "disclosed" },
  { name: "OPT Flash Appeal", short: "OPT", region: "MENA", kind: "Flash", peopleInNeedM: 3.3, peopleTargetedM: 3.0, reqBn: 4.1, fundedBn: 1.4, fundedPct: 35, confidence: "disclosed" },
  { name: "Syria Flash Appeal", short: "Syria FA", region: "MENA", kind: "Flash", peopleInNeedM: 16.5, peopleTargetedM: 10.3, reqBn: 3.2, fundedBn: 0.635, fundedPct: 20, confidence: "disclosed" },
  { name: "Ukraine HNRP", short: "Ukraine", region: "Europe", kind: "HNRP", peopleInNeedM: 12.7, peopleTargetedM: 6.0, reqBn: 2.6, fundedBn: 1.2, fundedPct: 45, confidence: "disclosed" },
  { name: "DR Congo HNRP", short: "DRC", region: "Africa", kind: "HNRP", peopleInNeedM: 21.2, peopleTargetedM: 11.0, reqBn: 2.5, fundedBn: 0.419, fundedPct: 17, confidence: "disclosed" },
  { name: "Yemen HNRP", short: "Yemen", region: "MENA", kind: "HNRP", peopleInNeedM: 19.5, peopleTargetedM: 10.5, reqBn: 2.5, fundedBn: 0.535, fundedPct: 22, confidence: "disclosed" },
  { name: "Afghanistan HNRP", short: "Afghanistan", region: "Asia-Pacific", kind: "HNRP", peopleInNeedM: 22.9, peopleTargetedM: 16.8, reqBn: 2.4, fundedBn: 0.849, fundedPct: 35, confidence: "disclosed" },
  { name: "South Sudan HNRP", short: "S. Sudan", region: "Africa", kind: "HNRP", peopleInNeedM: 9.3, peopleTargetedM: 5.4, reqBn: 1.7, fundedBn: 0.521, fundedPct: 31, confidence: "disclosed" },
  { name: "Chad HNRP", short: "Chad", region: "Africa", kind: "HNRP", peopleInNeedM: 7.0, peopleTargetedM: 5.5, reqBn: 1.5, fundedBn: 0.312, fundedPct: 21, confidence: "disclosed" },
  { name: "Somalia HNRP", short: "Somalia", region: "Africa", kind: "HNRP", peopleInNeedM: 6.0, peopleTargetedM: 4.6, reqBn: 1.4, fundedBn: 0.309, fundedPct: 22, confidence: "disclosed" },
  { name: "Myanmar HNRP", short: "Myanmar", region: "Asia-Pacific", kind: "HNRP", peopleInNeedM: 19.9, peopleTargetedM: 5.5, reqBn: 1.1, fundedBn: 0.154, fundedPct: 14, confidence: "disclosed" },
  { name: "Haiti HNRP", short: "Haiti", region: "Americas", kind: "HNRP", peopleInNeedM: 6.0, peopleTargetedM: 3.9, reqBn: 0.908, fundedBn: 0.135, fundedPct: 15, confidence: "disclosed" },
  { name: "Syria Regional RRP", short: "Syria RRP", region: "MENA", kind: "Regional RRP", peopleInNeedM: 17.1, peopleTargetedM: 11.5, reqBn: 4.7, fundedBn: 0.412, fundedPct: 9, confidence: "disclosed" },
  { name: "Sudan Regional RRP", short: "Sudan RRP", region: "Africa", kind: "Regional RRP", peopleInNeedM: 2.4, peopleTargetedM: 2.4, reqBn: 1.8, fundedBn: 0.094, fundedPct: 15, confidence: "disclosed" },
  { name: "Afghanistan Regional RRP", short: "Afghan RRP", region: "Asia-Pacific", kind: "Regional RRP", peopleInNeedM: 6.9, peopleTargetedM: 6.9, reqBn: 0.622, fundedBn: 0.059, fundedPct: 10, confidence: "disclosed" },
  { name: "Ukraine Regional RRP", short: "Ukraine RRP", region: "Europe", kind: "Regional RRP", peopleInNeedM: 2.1, peopleTargetedM: 2.1, reqBn: 0.69, fundedBn: 0.063, fundedPct: 9, confidence: "disclosed" },
];

/** OCHA GHO regional coverage (Oct 2025). */
export const GHO_REGIONS = [
  { region: "Eastern Europe", coveragePct: 45, reqSharePct: 6, fundSharePct: 11, confidence: "disclosed" as Confidence },
  { region: "Asia and the Pacific", coveragePct: 31, reqSharePct: 9, fundSharePct: 12, confidence: "disclosed" as Confidence },
  { region: "West & Central Africa", coveragePct: 24, reqSharePct: 21, fundSharePct: 20, confidence: "estimated" as Confidence },
  { region: "Southern & Eastern Africa", coveragePct: 22, reqSharePct: 22, fundSharePct: 23, confidence: "estimated" as Confidence },
  { region: "Middle East & N. Africa", coveragePct: 27, reqSharePct: 23, fundSharePct: 26, confidence: "estimated" as Confidence },
  { region: "Latin America & Caribbean", coveragePct: 16, reqSharePct: 5, fundSharePct: 3, confidence: "disclosed" as Confidence },
  { region: "Regional refugee plans", coveragePct: 14, reqSharePct: 14, fundSharePct: 9, confidence: "disclosed" as Confidence },
];

export type IncomeGroup = "High" | "Upper-middle" | "Lower-middle" | "Low";

/** Host countries — people hosted (refugees + OPNIIP) vs UNHCR cash contribution where applicable. */
export type HostDonorRow = {
  country: string;
  short: string;
  hostedM: number;
  hostedMetric: "opniip" | "mandate_only";
  income: IncomeGroup;
  region: RegionLane;
  unhcrDonorBn: number | null;
  role: "host-heavy" | "donor-heavy" | "both" | "host-only";
  confidence: Confidence;
};

export const HOST_DONOR_ROWS: HostDonorRow[] = [
  { country: "Iran", short: "Iran", hostedM: 3.5, hostedMetric: "opniip", income: "Upper-middle", region: "MENA", unhcrDonorBn: null, role: "host-only", confidence: "disclosed" },
  { country: "Türkiye", short: "Türkiye", hostedM: 2.9, hostedMetric: "opniip", income: "Upper-middle", region: "MENA", unhcrDonorBn: null, role: "host-heavy", confidence: "disclosed" },
  { country: "Colombia", short: "Colombia", hostedM: 2.8, hostedMetric: "opniip", income: "Upper-middle", region: "Americas", unhcrDonorBn: null, role: "host-only", confidence: "disclosed" },
  { country: "Germany", short: "Germany", hostedM: 2.7, hostedMetric: "opniip", income: "High", region: "Europe", unhcrDonorBn: 0.333, role: "both", confidence: "disclosed" },
  { country: "Uganda", short: "Uganda", hostedM: 1.8, hostedMetric: "opniip", income: "Low", region: "Africa", unhcrDonorBn: null, role: "host-only", confidence: "disclosed" },
  { country: "Pakistan", short: "Pakistan", hostedM: 1.6, hostedMetric: "opniip", income: "Lower-middle", region: "Asia-Pacific", unhcrDonorBn: null, role: "host-only", confidence: "disclosed" },
  { country: "Chad", short: "Chad", hostedM: 1.1, hostedMetric: "opniip", income: "Low", region: "Africa", unhcrDonorBn: null, role: "host-only", confidence: "disclosed" },
  { country: "Bangladesh", short: "Bangladesh", hostedM: 1.1, hostedMetric: "opniip", income: "Lower-middle", region: "Asia-Pacific", unhcrDonorBn: null, role: "host-only", confidence: "disclosed" },
  { country: "United States", short: "US", hostedM: 0.435, hostedMetric: "mandate_only", income: "High", region: "Americas", unhcrDonorBn: 2.056, role: "donor-heavy", confidence: "disclosed" },
  { country: "Sweden", short: "Sweden", hostedM: 0.28, hostedMetric: "mandate_only", income: "High", region: "Europe", unhcrDonorBn: 0.167, role: "donor-heavy", confidence: "estimated" },
  { country: "France", short: "France", hostedM: 0.66, hostedMetric: "mandate_only", income: "High", region: "Europe", unhcrDonorBn: 0.131, role: "donor-heavy", confidence: "estimated" },
  { country: "Japan", short: "Japan", hostedM: 0.02, hostedMetric: "mandate_only", income: "High", region: "Asia-Pacific", unhcrDonorBn: 0.119, role: "donor-heavy", confidence: "estimated" },
  { country: "Norway", short: "Norway", hostedM: 0.07, hostedMetric: "mandate_only", income: "High", region: "Europe", unhcrDonorBn: 0.127, role: "donor-heavy", confidence: "estimated" },
  { country: "United Kingdom", short: "UK", hostedM: 0.4, hostedMetric: "mandate_only", income: "High", region: "Europe", unhcrDonorBn: 0.112, role: "donor-heavy", confidence: "estimated" },
  { country: "European Union", short: "EU", hostedM: 0, hostedMetric: "mandate_only", income: "High", region: "Europe", unhcrDonorBn: 0.271, role: "donor-heavy", confidence: "disclosed" },
];

/** Top UNHCR government/EU donors 2024 ($bn). */
export const UNHCR_DONORS_2024 = [
  { donor: "United States", short: "US", bn: 2.056, group: "G7" as const },
  { donor: "Germany", short: "DE", bn: 0.333, group: "G7" as const },
  { donor: "European Union", short: "EU", bn: 0.271, group: "Multilateral" as const },
  { donor: "Sweden", short: "SE", bn: 0.167, group: "Nordic" as const },
  { donor: "France", short: "FR", bn: 0.131, group: "G7" as const },
  { donor: "Norway", short: "NO", bn: 0.127, group: "Nordic" as const },
  { donor: "Japan", short: "JP", bn: 0.119, group: "G7" as const },
  { donor: "Denmark", short: "DK", bn: 0.118, group: "Nordic" as const },
  { donor: "United Kingdom", short: "UK", bn: 0.112, group: "G7" as const },
  { donor: "Netherlands", short: "NL", bn: 0.08, group: "Other Europe" as const },
];

/** Income-group share of refugee hosting (UNHCR Global Trends 2024). */
export const HOSTING_BY_INCOME = [
  { group: "Upper-middle", pct: 37, confidence: "disclosed" as Confidence },
  { group: "High", pct: 27, confidence: "disclosed" as Confidence },
  { group: "Low", pct: 19, confidence: "disclosed" as Confidence },
  { group: "Lower-middle", pct: 17, confidence: "disclosed" as Confidence },
];

export function fmtBn(n: number, digits = 1): string {
  if (n >= 1) return `$${n.toFixed(digits)}B`;
  return `$${(n * 1000).toFixed(0)}M`;
}

export function fmtM(n: number, digits = 1): string {
  return `${n.toFixed(digits)}M`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}
