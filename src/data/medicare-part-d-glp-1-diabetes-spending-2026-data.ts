/**
 * Medicare Part D GLP-1 diabetes spending (2026).
 *
 * Core question: How much of Part D drug spending now sits in GLP-1
 * diabetes indications, and which plans carry it?
 *
 * Perimeter: CMS Medicare Part D Prescribers / Drug Spending Dashboard
 * aggregates for diabetes-indicated GLP-1 receptor agonists (semaglutide,
 * tirzepatide, dulaglutide, liraglutide, exenatide, lixisenatide) in data
 * year 2024; KFF analysis of CMS Part D claims 2019–2024; HHS OIG data
 * brief on selected diabetes drugs 2019–2023; MedPAC July 2025 Data Book
 * Sec. 10 for PDP / MA–PD / LIS / EGWP enrollment structure. Gross
 * point-of-sale cost unless noted; rebates are confidential at drug level.
 *
 * Headline: Diabetes-indicated GLP-1s cost Part D $24.57B in 2024 —
 * 10.8% of program drug cost on ~1.3% of claims.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Gross Part D drug cost for diabetes-indicated GLP-1 receptor agonists from CMS Medicare Part D Prescribers / Drug Spending aggregates (data year 2024; class ≈ Ozempic, Mounjaro, Trulicity, Rybelsus + residual older agents). Program totals ~$226.74B drug cost / ~1.48B claims. Brand ladder and cost-per-claim are CMS-derived disclosed figures. Enrollee and claims growth paths follow KFF’s CMS claims analysis (2019–2024) and HHS OIG A-05-24-00015 for selected diabetes drugs through 2023. MedPAC July 2025 Data Book Sec. 10 supplies PDP / MA–PD / LIS / EGWP enrollment shares; plan-type GLP-1 spend allocation is a desk estimate that weights those shares by LIS concentration and diabetes prevalence proxies — not a CMS drug×plan-type public table. Net spend assumes MedPAC-style ≥50% diabetic-therapy rebates (KFF illustration). Weight-loss-only products (Wegovy, Zepbound) remain largely outside Part D by statute and are excluded from the diabetes headline.";

export const SOURCES = [
  {
    label: "CMS — Medicare Part D Drug Spending Dashboard / Prescribers PUF",
    url: "https://www.cms.gov/Research-Statistics-Data-and-Systems/Statistics-Trends-and-Reports/Information-on-Prescription-Drugs/MedicarePartD",
  },
  {
    label: "KFF — Recent Trends in GLP-1 Use and Spending in Medicare (Jan 2026)",
    url: "https://www.kff.org/medicare/recent-trends-in-glp-1-use-and-spending-in-medicare/",
  },
  {
    label: "HHS OIG — Part D spending for 10 selected diabetes drugs (A-05-24-00015)",
    url: "https://oig.hhs.gov/documents/audit/10207/A-05-24-00015.pdf",
  },
  {
    label: "MedPAC — July 2025 Data Book, Section 10 (Prescription drugs)",
    url: "https://www.medpac.gov/wp-content/uploads/2025/07/July2025_MedPAC_DataBook_Sec10_SEC.pdf",
  },
] as const;

/** Headline punchline — diabetes GLP-1 share of Part D gross drug cost */
export const HEADLINE = {
  /** CMS 2024: diabetes-indicated GLP-1 class gross drug cost ($B) */
  glp1GrossCost2024B: 24.57,
  /** CMS 2024: Part D total drug cost ($B) */
  partDTotalCost2024B: 226.74,
  /** CMS 2024: GLP-1 share of Part D drug cost (%) */
  glp1CostSharePct: 10.8,
  /** CMS 2024: GLP-1 claims (millions) */
  glp1ClaimsM: 19.6,
  /** CMS 2024: GLP-1 share of Part D claims (%) */
  glp1ClaimSharePct: 1.3,
  /** CMS 2024: avg cost per GLP-1 claim ($) */
  glp1CostPerClaim: 1254,
  /** CMS 2024: program avg cost per claim ($) */
  programCostPerClaim: 153,
  /** CMS 2024: Ozempic gross cost ($B) */
  ozempicCost2024B: 12.38,
  /** CMS 2024: four-brand share of class (%) */
  top4BrandSharePct: 98.9,
  /** KFF: broader GLP-1 gross spend 2024 ($B) */
  kffGrossGlp12024B: 27.5,
  /** KFF/MedPAC illustration: net after ~50% rebate ($B) */
  netSpendIllustrative2024B: 14,
  /** MedPAC 2024: non-EGWP MA–PD enrollment share (%) */
  maPdEnrollmentSharePct: 60,
  confidence: "disclosed" as Confidence,
};

export type BrandId =
  | "ozempic"
  | "mounjaro"
  | "trulicity"
  | "rybelsus"
  | "other";

export interface BrandRow {
  id: BrandId;
  brand: string;
  generic: string;
  costB: number;
  claimsM: number;
  costPerClaim: number;
  costShareOfClassPct: number;
  confidence: Confidence;
}

/** CMS 2024 diabetes-indicated brand ladder (Fonteum/CMS PUF aggregates) */
export const BRAND_LADDER: BrandRow[] = [
  {
    id: "ozempic",
    brand: "Ozempic",
    generic: "Semaglutide",
    costB: 12.38,
    claimsM: 9.93,
    costPerClaim: 1246,
    costShareOfClassPct: 50.4,
    confidence: "disclosed",
  },
  {
    id: "mounjaro",
    brand: "Mounjaro",
    generic: "Tirzepatide",
    costB: 5.83,
    claimsM: 4.69,
    costPerClaim: 1241,
    costShareOfClassPct: 23.7,
    confidence: "disclosed",
  },
  {
    id: "trulicity",
    brand: "Trulicity",
    generic: "Dulaglutide",
    costB: 4.79,
    claimsM: 3.82,
    costPerClaim: 1254,
    costShareOfClassPct: 19.5,
    confidence: "disclosed",
  },
  {
    id: "rybelsus",
    brand: "Rybelsus",
    generic: "Semaglutide (oral)",
    costB: 1.31,
    claimsM: 0.9,
    costPerClaim: 1455,
    costShareOfClassPct: 5.3,
    confidence: "disclosed",
  },
  {
    id: "other",
    brand: "Other GLP-1s",
    generic: "Liraglutide / exenatide / etc.",
    costB: 0.26,
    claimsM: 0.26,
    costPerClaim: 1000,
    costShareOfClassPct: 1.1,
    confidence: "estimated",
  },
];

export interface SharePathRow {
  year: number;
  /** Diabetes-focus class gross cost ($B); 2024 = CMS headline; earlier years carried from KFF/OIG path */
  grossCostB: number;
  /** Share of Part D drug cost (%); 2024 disclosed, earlier estimated against program growth */
  costSharePct: number;
  /** GLP-1 claims (millions); KFF path */
  claimsM: number;
  confidence: Confidence;
}

/**
 * Class spend path. 2024 CMS diabetes headline; 2019–2023 anchored to
 * KFF five-fold growth into the broader 2024 class and OIG Ozempic prints.
 */
export const SHARE_PATH: SharePathRow[] = [
  { year: 2019, grossCostB: 4.9, costSharePct: 3.1, claimsM: 4.8, confidence: "estimated" },
  { year: 2020, grossCostB: 6.8, costSharePct: 4.0, claimsM: 6.2, confidence: "estimated" },
  { year: 2021, grossCostB: 9.4, costSharePct: 5.2, claimsM: 8.5, confidence: "estimated" },
  { year: 2022, grossCostB: 13.2, costSharePct: 6.6, claimsM: 11.0, confidence: "carried" },
  { year: 2023, grossCostB: 18.6, costSharePct: 8.5, claimsM: 15.4, confidence: "carried" },
  { year: 2024, grossCostB: 24.57, costSharePct: 10.8, claimsM: 19.6, confidence: "disclosed" },
];

export interface EnrolleeRow {
  year: number;
  ozempicEnrolleesK: number;
  mounjaroEnrolleesK: number | null;
  confidence: Confidence;
}

/** KFF CMS enrollee counts (thousands) */
export const ENROLLEE_PATH: EnrolleeRow[] = [
  { year: 2019, ozempicEnrolleesK: 142, mounjaroEnrolleesK: null, confidence: "disclosed" },
  { year: 2020, ozempicEnrolleesK: 280, mounjaroEnrolleesK: null, confidence: "estimated" },
  { year: 2021, ozempicEnrolleesK: 520, mounjaroEnrolleesK: null, confidence: "estimated" },
  { year: 2022, ozempicEnrolleesK: 900, mounjaroEnrolleesK: 54, confidence: "disclosed" },
  { year: 2023, ozempicEnrolleesK: 1465, mounjaroEnrolleesK: 420, confidence: "carried" },
  { year: 2024, ozempicEnrolleesK: 2000, mounjaroEnrolleesK: 980, confidence: "disclosed" },
];

export interface OzempicOigRow {
  year: number;
  spendB: number;
  enrolleesK: number;
  confidence: Confidence;
}

/** HHS OIG Ozempic Part D spending / enrollees 2019–2023 */
export const OZEMPIC_OIG: OzempicOigRow[] = [
  { year: 2019, spendB: 0.552, enrolleesK: 142, confidence: "disclosed" },
  { year: 2020, spendB: 1.455, enrolleesK: 280, confidence: "disclosed" },
  { year: 2021, spendB: 2.621, enrolleesK: 520, confidence: "disclosed" },
  { year: 2022, spendB: 4.626, enrolleesK: 900, confidence: "disclosed" },
  { year: 2023, spendB: 9.2, enrolleesK: 1465, confidence: "disclosed" },
];

export type PlanBucket = "ma_pd" | "pdp" | "egwp";

export interface PlanCarrierRow {
  id: PlanBucket;
  label: string;
  /** MedPAC enrollment share of relevant Part D base (%) */
  enrollmentSharePct: number;
  /** Desk-estimated share of diabetes GLP-1 gross spend (%) */
  glp1SpendSharePct: number;
  /** Implied GLP-1 gross cost ($B) on $24.57B class */
  glp1CostB: number;
  note: string;
  confidence: Confidence;
}

/**
 * Which plans carry the bill. Enrollment from MedPAC 2024/2025 Data Book;
 * spend shares estimated (MA–PD + LIS intensity > PDP; EGWP thinner).
 */
export const PLAN_CARRIER: PlanCarrierRow[] = [
  {
    id: "ma_pd",
    label: "MA–PD (non-EGWP)",
    enrollmentSharePct: 60,
    glp1SpendSharePct: 64,
    glp1CostB: 15.72,
    note: "60% of non-EGWP Part D enrollment; 67% of LIS in MA–PDs",
    confidence: "estimated",
  },
  {
    id: "pdp",
    label: "Stand-alone PDP",
    enrollmentSharePct: 40,
    glp1SpendSharePct: 28,
    glp1CostB: 6.88,
    note: "40% of non-EGWP enrollment; thinner LIS share",
    confidence: "estimated",
  },
  {
    id: "egwp",
    label: "EGWP (employer)",
    enrollmentSharePct: 17,
    glp1SpendSharePct: 8,
    glp1CostB: 1.97,
    note: "~17% of total Part D enrollment; lower diabetes intensity typical",
    confidence: "estimated",
  },
];

export interface GrossNetRow {
  label: string;
  amountB: number;
  kind: "gross" | "rebate" | "net";
}

/** Gross vs illustrative net (50% rebate assumption per MedPAC/KFF) */
export const GROSS_NET: GrossNetRow[] = [
  { label: "Gross POS (CMS)", amountB: 24.57, kind: "gross" },
  { label: "Illustrative rebates (~50%)", amountB: -12.29, kind: "rebate" },
  { label: "Illustrative net", amountB: 12.29, kind: "net" },
];

export interface IntensityRow {
  metric: string;
  glp1: number;
  program: number;
  unit: string;
}

export const INTENSITY: IntensityRow[] = [
  { metric: "Share of Part D dollars", glp1: 10.8, program: 100, unit: "%" },
  { metric: "Share of Part D claims", glp1: 1.3, program: 100, unit: "%" },
  { metric: "Cost per claim ($)", glp1: 1254, program: 153, unit: "$" },
];

export interface KffMixRow {
  product: string;
  shareOfGrossPct: number;
}

/** KFF 2024 broader GLP-1 gross mix (includes tiny Wegovy share) */
export const KFF_GROSS_MIX: KffMixRow[] = [
  { product: "Ozempic", shareOfGrossPct: 47 },
  { product: "Mounjaro", shareOfGrossPct: 23 },
  { product: "Rybelsus", shareOfGrossPct: 7 },
  { product: "Trulicity + other", shareOfGrossPct: 22 },
  { product: "Wegovy", shareOfGrossPct: 1 },
];

export function fmtB(n: number, digits = 2): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtDollar(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
