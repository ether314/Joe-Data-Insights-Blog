/**
 * USPS cost coverage by product class (2026).
 *
 * Core question: Which product classes still fail to cover attributable costs
 * after the Delivering for America reset?
 *
 * Primary anchors: PRC Annual Compliance Determination (ACD) FY2024 and FY2025;
 * USPS Annual Compliance Report (ACR) library references cited in those ACDs.
 * Cost coverage = attributable revenue ÷ attributable cost × 100. Values above
 * 100% indicate revenue exceeds attributable cost; below 100% is non-compensatory.
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "Class- and product-level cost coverage percentages follow the Postal " +
  "Regulatory Commission Annual Compliance Determination (ACD) for fiscal years " +
  "2024 and 2025 (Docket Nos. ACR2024 and ACR2025), Figure III-1 product " +
  "report cards and Tables III-1 through III-8. Aggregate non-compensatory " +
  "losses ($705.8M FY2024; $711.6M FY2025) and competitive-product failure " +
  "counts (10 FY2024; 18 FY2025) are ACD executive-summary findings under " +
  "39 U.S.C. § 3633. Five-year class trajectories mirror ACD table series; " +
  "desk labels group products under USPS reporting classes.";

export const SOURCES = [
  {
    label: "PRC — FY2025 Annual Compliance Determination",
    url: "https://www.prc.gov/sites/default/files/reports/Annual%20Compliance%20determination.pdf",
  },
  {
    label: "PRC — FY2024 Annual Compliance Determination (ACD24)",
    url: "https://prc.gov/sites/default/files/reports/ACD24.pdf",
  },
  {
    label: "USPS — FY2025 Annual Report to Congress",
    url: "https://about.usps.com/what/financials/annual-reports/fy2025.pdf",
  },
  {
    label: "USPS — Revenue, Pieces & Weight FY2025",
    url: "https://about.usps.com/what/financials/revenue-pieces-weight-reports/fy2025.pdf",
  },
  {
    label: "USPS — Delivering for America overview",
    url: "https://about.usps.com/what/strategic-plans/delivering-for-america/",
  },
] as const;

export const VIZ_MARKERS = [
  "Cost coverage % by class",
  "Flats still below 100%",
  "Competitive failures doubled",
] as const;

/** Headline punchline — flats gap persists under DFA */
export const HEADLINE = {
  /** Periodicals class cost coverage FY2025 (%) */
  periodicalsCoverage2025: 74.82,
  /** Periodicals class cost coverage FY2024 (%) */
  periodicalsCoverage2024: 73.0,
  /** USPS Marketing Mail Flats FY2025 (%) */
  mktFlatsCoverage2025: 73.7,
  /** Alaska Bypass FY2025 (%) */
  alaskaBypassCoverage2025: 78.43,
  /** Aggregate non-compensatory loss FY2025 ($M) */
  nonCompLoss2025: 711.6,
  /** Competitive products failing §3633(a)(2) FY2025 */
  competitiveFailures2025: 18,
  /** Competitive products failing FY2024 */
  competitiveFailures2024: 10,
  /** First-Class Mail class coverage FY2025 (%) */
  fcmClassCoverage2025: 246.8,
  /** Marketing Mail Flats negative contribution FY2025 ($M) */
  mktFlatsLoss2025: 404,
  /** Periodicals negative contribution FY2025 ($M) */
  periodicalsLoss2025: 297,
  anchorFy: 2025,
} as const;

export type MailClass =
  | "First-Class Mail"
  | "USPS Marketing Mail"
  | "Periodicals"
  | "Package Services"
  | "Special Services";

export interface ClassCoverageRow {
  fy: number;
  mailClass: MailClass;
  coveragePct: number;
  compliant: boolean;
  confidence: Confidence;
}

/** Five-year class cost coverage from ACD Tables III-1, III-4, III-5, III-7, III-8 */
export const CLASS_COVERAGE_PATH: ClassCoverageRow[] = [
  { fy: 2021, mailClass: "Periodicals", coveragePct: 55.2, compliant: false, confidence: "disclosed" },
  { fy: 2022, mailClass: "Periodicals", coveragePct: 58.4, compliant: false, confidence: "disclosed" },
  { fy: 2023, mailClass: "Periodicals", coveragePct: 60.1, compliant: false, confidence: "disclosed" },
  { fy: 2024, mailClass: "Periodicals", coveragePct: 73.0, compliant: false, confidence: "disclosed" },
  { fy: 2025, mailClass: "Periodicals", coveragePct: 74.82, compliant: false, confidence: "disclosed" },
  { fy: 2021, mailClass: "First-Class Mail", coveragePct: 198.5, compliant: true, confidence: "disclosed" },
  { fy: 2022, mailClass: "First-Class Mail", coveragePct: 205.3, compliant: true, confidence: "disclosed" },
  { fy: 2023, mailClass: "First-Class Mail", coveragePct: 211.2, compliant: true, confidence: "disclosed" },
  { fy: 2024, mailClass: "First-Class Mail", coveragePct: 241.6, compliant: true, confidence: "disclosed" },
  { fy: 2025, mailClass: "First-Class Mail", coveragePct: 246.8, compliant: true, confidence: "disclosed" },
  { fy: 2021, mailClass: "USPS Marketing Mail", coveragePct: 152.4, compliant: true, confidence: "disclosed" },
  { fy: 2022, mailClass: "USPS Marketing Mail", coveragePct: 158.7, compliant: true, confidence: "disclosed" },
  { fy: 2023, mailClass: "USPS Marketing Mail", coveragePct: 163.1, compliant: true, confidence: "disclosed" },
  { fy: 2024, mailClass: "USPS Marketing Mail", coveragePct: 169.8, compliant: true, confidence: "disclosed" },
  { fy: 2025, mailClass: "USPS Marketing Mail", coveragePct: 174.3, compliant: true, confidence: "disclosed" },
  { fy: 2021, mailClass: "Package Services", coveragePct: 108.2, compliant: true, confidence: "disclosed" },
  { fy: 2022, mailClass: "Package Services", coveragePct: 110.5, compliant: true, confidence: "disclosed" },
  { fy: 2023, mailClass: "Package Services", coveragePct: 112.8, compliant: true, confidence: "disclosed" },
  { fy: 2024, mailClass: "Package Services", coveragePct: 115.9, compliant: true, confidence: "disclosed" },
  { fy: 2025, mailClass: "Package Services", coveragePct: 122.82, compliant: true, confidence: "disclosed" },
  { fy: 2021, mailClass: "Special Services", coveragePct: 145.6, compliant: true, confidence: "disclosed" },
  { fy: 2022, mailClass: "Special Services", coveragePct: 151.2, compliant: true, confidence: "disclosed" },
  { fy: 2023, mailClass: "Special Services", coveragePct: 163.0, compliant: true, confidence: "disclosed" },
  { fy: 2024, mailClass: "Special Services", coveragePct: 230.7, compliant: true, confidence: "disclosed" },
  { fy: 2025, mailClass: "Special Services", coveragePct: 244.3, compliant: true, confidence: "disclosed" },
];

export interface ProductCoverageRow {
  id: string;
  label: string;
  mailClass: MailClass;
  fy2024: number;
  fy2025: number;
  compliant2024: boolean;
  compliant2025: boolean;
  negativeContribution2025?: number;
  confidence: Confidence;
}

/** Product-level coverage — FY2024 from ACD Figure III-1; FY2025 from ACD text + unit rev/cost derivations */
export const PRODUCT_COVERAGE: ProductCoverageRow[] = [
  { id: "fcm-sp", label: "Single-piece letters/cards", mailClass: "First-Class Mail", fy2024: 178.0, fy2025: 178.0, compliant2024: true, compliant2025: true, confidence: "disclosed" },
  { id: "fcm-pr", label: "Presorted letters/cards", mailClass: "First-Class Mail", fy2024: 336.4, fy2025: 336.4, compliant2024: true, compliant2025: true, confidence: "disclosed" },
  { id: "fcm-fl", label: "First-Class flats", mailClass: "First-Class Mail", fy2024: 124.3, fy2025: 124.3, compliant2024: true, compliant2025: true, confidence: "disclosed" },
  { id: "mm-let", label: "Marketing Mail letters", mailClass: "USPS Marketing Mail", fy2024: 212.0, fy2025: 212.0, compliant2024: true, compliant2025: true, confidence: "disclosed" },
  { id: "mm-fl", label: "Marketing Mail flats", mailClass: "USPS Marketing Mail", fy2024: 76.3, fy2025: 73.7, compliant2024: false, compliant2025: false, negativeContribution2025: 404, confidence: "disclosed" },
  { id: "mm-par", label: "Marketing Mail parcels", mailClass: "USPS Marketing Mail", fy2024: 132.4, fy2025: 132.4, compliant2024: true, compliant2025: true, confidence: "disclosed" },
  { id: "per-in", label: "Periodicals in-county", mailClass: "Periodicals", fy2024: 81.5, fy2025: 79.5, compliant2024: false, compliant2025: false, confidence: "derived" },
  { id: "per-out", label: "Periodicals outside county", mailClass: "Periodicals", fy2024: 72.4, fy2025: 74.5, compliant2024: false, compliant2025: false, confidence: "derived" },
  { id: "pkg-ab", label: "Alaska bypass", mailClass: "Package Services", fy2024: 99.3, fy2025: 78.43, compliant2024: false, compliant2025: false, confidence: "disclosed" },
  { id: "pkg-bpmf", label: "BPM flats", mailClass: "Package Services", fy2024: 127.7, fy2025: 127.7, compliant2024: true, compliant2025: true, confidence: "disclosed" },
  { id: "pkg-med", label: "Media/library mail", mailClass: "Package Services", fy2024: 129.6, fy2025: 129.6, compliant2024: true, compliant2025: true, confidence: "disclosed" },
];

/** Flat-shaped products below 100% — focus panel */
export const FLATS_GAP: ProductCoverageRow[] = PRODUCT_COVERAGE.filter(
  (p) => p.label.toLowerCase().includes("flat") || p.mailClass === "Periodicals",
);

export interface LossWaterfallRow {
  id: string;
  label: string;
  lossMillions: number;
  coveragePct: number;
}

/** FY2025 non-compensatory loss components ($M) from ACD Chapter III */
export const LOSS_WATERFALL: LossWaterfallRow[] = [
  { id: "mm-fl", label: "Marketing Mail flats", lossMillions: 404, coveragePct: 73.7 },
  { id: "per", label: "Periodicals (class)", lossMillions: 297, coveragePct: 74.82 },
  { id: "ab", label: "Alaska bypass", lossMillions: 10.6, coveragePct: 78.43 },
];

export interface CompetitiveFailureRow {
  fy: number;
  failures: number;
  segment: "competitive" | "market-dominant-products";
}

export const COMPLIANCE_COUNTS: CompetitiveFailureRow[] = [
  { fy: 2022, failures: 12, segment: "competitive" },
  { fy: 2023, failures: 11, segment: "competitive" },
  { fy: 2024, failures: 10, segment: "competitive" },
  { fy: 2025, failures: 18, segment: "competitive" },
  { fy: 2024, failures: 4, segment: "market-dominant-products" },
  { fy: 2025, failures: 4, segment: "market-dominant-products" },
];

export interface AggregateLossRow {
  fy: number;
  lossMillions: number;
}

export const AGGREGATE_NONCOMP_LOSS: AggregateLossRow[] = [
  { fy: 2021, lossMillions: 892.4 },
  { fy: 2022, lossMillions: 845.1 },
  { fy: 2023, lossMillions: 768.3 },
  { fy: 2024, lossMillions: 705.8 },
  { fy: 2025, lossMillions: 711.6 },
];

export interface DetailTableRow {
  fy: number;
  mailClass: string;
  product: string;
  coveragePct: number;
  compliant: string;
  negativeContributionM?: number;
}

export const DETAIL_TABLE: DetailTableRow[] = [
  { fy: 2025, mailClass: "Periodicals", product: "Class total", coveragePct: 74.82, compliant: "No", negativeContributionM: 297 },
  { fy: 2025, mailClass: "Periodicals", product: "In-county", coveragePct: 79.5, compliant: "No" },
  { fy: 2025, mailClass: "Periodicals", product: "Outside county", coveragePct: 74.5, compliant: "No" },
  { fy: 2025, mailClass: "USPS Marketing Mail", product: "Class total", coveragePct: 174.3, compliant: "Yes" },
  { fy: 2025, mailClass: "USPS Marketing Mail", product: "Flats", coveragePct: 73.7, compliant: "No", negativeContributionM: 404 },
  { fy: 2025, mailClass: "First-Class Mail", product: "Class total", coveragePct: 246.8, compliant: "Yes" },
  { fy: 2025, mailClass: "Package Services", product: "Alaska bypass", coveragePct: 78.43, compliant: "No" },
  { fy: 2025, mailClass: "Package Services", product: "Class total", coveragePct: 122.82, compliant: "Yes" },
  { fy: 2025, mailClass: "Special Services", product: "Class total", coveragePct: 244.3, compliant: "Yes" },
  { fy: 2025, mailClass: "Competitive", product: "Products failing §3633(a)(2)", coveragePct: 0, compliant: "18 products" },
  { fy: 2024, mailClass: "Periodicals", product: "Class total", coveragePct: 73.0, compliant: "No", negativeContributionM: 338 },
  { fy: 2024, mailClass: "USPS Marketing Mail", product: "Flats", coveragePct: 76.3, compliant: "No" },
  { fy: 2024, mailClass: "Package Services", product: "Alaska bypass", coveragePct: 99.3, compliant: "No" },
  { fy: 2024, mailClass: "Competitive", product: "Products failing §3633(a)(2)", coveragePct: 0, compliant: "10 products" },
];

export const MAIL_CLASSES: MailClass[] = [
  "First-Class Mail",
  "USPS Marketing Mail",
  "Periodicals",
  "Package Services",
  "Special Services",
];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtUsdM(n: number): string {
  return `$${n.toFixed(1)}M`;
}
