/**
 * Employer coverage of GLP-1 weight-loss drugs (2026).
 *
 * Core question: What share of large employers cover anti-obesity
 * medications, and how fast did commercial pharmacy spend tilt toward them?
 *
 * Perimeter: KFF Employer Health Benefits Survey (firms with 200+ workers);
 * Mercer National Survey of Employer-Sponsored Health Plans (500+ / 20,000+);
 * Evernorth Research Institute Pharmacy in Focus / Express Scripts commercial
 * book (weight-management share of drug-spend increase and GLP-1 net trend).
 * Figures are survey shares and PBM trend rates — not national claims census.
 *
 * Headline: Among firms with 5,000+ workers, KFF coverage of GLP-1s for
 * weight loss jumped from 28% (2024) to 43% (2025), while weight-management
 * drugs accounted for 46.8% of the 2024 commercial pharmacy spend increase
 * and 6.7% of total drug costs (Evernorth).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Employer coverage: KFF Employer Health Benefits Survey 2024–2025 (firms offering health benefits; GLP-1 agonists used primarily for weight loss in the largest plan). Mercer National Survey of Employer-Sponsored Health Plans 2023–2024 (coverage of obesity / weight-loss medications among employers with 500+ and 20,000+ workers). Pharmacy trend: Evernorth Research Institute Pharmacy in Focus 2025 (commercial book; weight-management therapies’ contribution to drug-spend increase and share of total drug costs; GLP-1 weight-loss one-year net trend). Diabetes vs obesity coverage contrast is survey-reported near-universal diabetes coverage vs partial obesity coverage — not a claims denominator. Firm-size buckets differ across KFF and Mercer; do not stitch into a single time series without noting the cut.";

export const SOURCES = [
  {
    label: "KFF — 2025 Employer Health Benefits Survey (GLP-1 weight loss)",
    url: "https://www.kff.org/health-costs/annual-family-premiums-for-employer-coverage-rise-6-in-2025-nearing-27000-with-workers-paying-6850-toward-premiums-out-of-their-paychecks/",
  },
  {
    label: "KFF — 2024 Employer Health Benefits Survey",
    url: "https://www.kff.org/health-costs/2024-employer-health-benefits-survey/",
  },
  {
    label: "Peterson-KFF — employer perspectives on GLP-1 cost & coverage",
    url: "https://www.healthsystemtracker.org/brief/perspectives-from-employers-on-the-costs-and-issues-associated-with-covering-glp-1-agonists-for-weight-loss/",
  },
  {
    label: "Mercer — 2024 National Survey of Employer-Sponsored Health Plans",
    url: "https://www.mercer.com/en-us/about/newsroom/employers-enhanced-health-benefits-in-2024-adding-coverage-for-weight-loss-medications-and-ivf-despite-growing-health-cost/",
  },
  {
    label: "Evernorth — Pharmacy in Focus 2025 (GLP-1 conundrum)",
    url: "https://www.evernorth.com/articles/glp-1s-drive-historic-shift-traditional-drug-trend",
  },
] as const;

/** Headline punchline — jumbo-firm coverage jump + Rx spend tilt */
export const HEADLINE = {
  /** KFF 2025: firms with 200+ covering GLP-1 for weight loss (%) */
  kff200PlusCover2025: 19,
  /** KFF 2024: firms with 200+ covering (%) */
  kff200PlusCover2024: 18,
  /** KFF 2025: firms with 5,000+ covering (%) */
  kff5kCover2025: 43,
  /** KFF 2024: firms with 5,000+ covering (%) */
  kff5kCover2024: 28,
  /** Mercer 2024: employers 500+ covering obesity meds (%) */
  mercer500Plus2024: 44,
  /** Mercer 2023: employers 500+ (%) */
  mercer500Plus2023: 41,
  /** Mercer 2024: employers 20,000+ (%) */
  mercer20k2024: 64,
  /** Mercer 2023: employers 20,000+ (%) */
  mercer20k2023: 56,
  /** Evernorth 2024: weight-mgmt share of drug-spend *increase* (%) */
  weightMgmtShareOfIncrease2024: 46.8,
  /** Evernorth 2024: weight-mgmt share of total drug costs (%) */
  weightMgmtShareOfTotal2024: 6.7,
  /** Evernorth: GLP-1 weight-loss one-year net trend 2023 (%) */
  glp1NetTrend2023: 210.2,
  /** Evernorth: GLP-1 weight-loss one-year net trend 2024 (%) */
  glp1NetTrend2024: 148.7,
  /** KFF 2025: share of 5k+ coverers saying cost exceeded expectations (%) */
  costExceededExpectations5k: 59,
  /** KFF 2025: share of 5k+ coverers citing significant Rx spend impact (%) */
  significantRxImpact5k: 66,
  confidence: "disclosed" as Confidence,
};

export type FirmSizeBucket =
  | "kff_200_999"
  | "kff_1000_4999"
  | "kff_5000_plus"
  | "kff_200_plus"
  | "mercer_500_plus"
  | "mercer_20000_plus";

export type CoverageYearRow = {
  year: number;
  survey: "kff" | "mercer";
  bucket: FirmSizeBucket;
  label: string;
  coverPct: number;
  /** Share answering do not cover when disclosed */
  doNotCoverPct?: number;
  /** Share unsure / don't know when disclosed */
  unsurePct?: number;
  confidence: Confidence;
};

/**
 * Coverage prevalence by survey year and firm-size cut.
 * KFF asks about GLP-1 agonists used primarily for weight loss;
 * Mercer asks about obesity / weight-loss medication coverage.
 */
export const COVERAGE_BY_YEAR: CoverageYearRow[] = [
  {
    year: 2024,
    survey: "kff",
    bucket: "kff_200_plus",
    label: "KFF · 200+ workers",
    coverPct: 18,
    doNotCoverPct: 52,
    unsurePct: 31,
    confidence: "disclosed",
  },
  {
    year: 2025,
    survey: "kff",
    bucket: "kff_200_plus",
    label: "KFF · 200+ workers",
    coverPct: 19,
    doNotCoverPct: 57,
    unsurePct: 24,
    confidence: "disclosed",
  },
  {
    year: 2024,
    survey: "kff",
    bucket: "kff_5000_plus",
    label: "KFF · 5,000+ workers",
    coverPct: 28,
    doNotCoverPct: 64,
    confidence: "disclosed",
  },
  {
    year: 2025,
    survey: "kff",
    bucket: "kff_5000_plus",
    label: "KFF · 5,000+ workers",
    coverPct: 43,
    confidence: "disclosed",
  },
  {
    year: 2024,
    survey: "kff",
    bucket: "kff_1000_4999",
    label: "KFF · 1,000–4,999",
    coverPct: 25,
    confidence: "estimated",
  },
  {
    year: 2023,
    survey: "mercer",
    bucket: "mercer_500_plus",
    label: "Mercer · 500+ workers",
    coverPct: 41,
    confidence: "disclosed",
  },
  {
    year: 2024,
    survey: "mercer",
    bucket: "mercer_500_plus",
    label: "Mercer · 500+ workers",
    coverPct: 44,
    confidence: "disclosed",
  },
  {
    year: 2023,
    survey: "mercer",
    bucket: "mercer_20000_plus",
    label: "Mercer · 20,000+ workers",
    coverPct: 56,
    confidence: "disclosed",
  },
  {
    year: 2024,
    survey: "mercer",
    bucket: "mercer_20000_plus",
    label: "Mercer · 20,000+ workers",
    coverPct: 64,
    confidence: "disclosed",
  },
];

export type SizeLadderRow = {
  id: string;
  label: string;
  workers: string;
  coverPct: number;
  year: number;
  survey: "kff" | "mercer";
  note: string;
  confidence: Confidence;
};

/** Cross-section size ladder (latest disclosed cut per survey) */
export const SIZE_LADDER: SizeLadderRow[] = [
  {
    id: "kff200",
    label: "Large firms (KFF)",
    workers: "200+",
    coverPct: 19,
    year: 2025,
    survey: "kff",
    note: "GLP-1 for weight loss in largest plan",
    confidence: "disclosed",
  },
  {
    id: "kff1k",
    label: "Mid-large (KFF 2024)",
    workers: "1,000+",
    coverPct: 25,
    year: 2024,
    survey: "kff",
    note: "2024 EHBS; one-in-four among 1,000+",
    confidence: "disclosed",
  },
  {
    id: "kff5k",
    label: "Jumbo (KFF)",
    workers: "5,000+",
    coverPct: 43,
    year: 2025,
    survey: "kff",
    note: "Up from 28% in 2024",
    confidence: "disclosed",
  },
  {
    id: "mercer500",
    label: "Large (Mercer)",
    workers: "500+",
    coverPct: 44,
    year: 2024,
    survey: "mercer",
    note: "Obesity / weight-loss meds",
    confidence: "disclosed",
  },
  {
    id: "mercer20k",
    label: "Mega (Mercer)",
    workers: "20,000+",
    coverPct: 64,
    year: 2024,
    survey: "mercer",
    note: "Up from 56% in 2023",
    confidence: "disclosed",
  },
];

export type CostImpactRow = {
  id: string;
  label: string;
  firmSize: string;
  pct: number;
  metric: "significant_rx_impact" | "cost_exceeded" | "conditions" | "very_likely_add";
  year: number;
  confidence: Confidence;
};

/** Cost / utilization-management signals among covering (or non-covering) firms */
export const COST_IMPACT: CostImpactRow[] = [
  {
    id: "sig_impact_5k_2025",
    label: "Significant impact on Rx spend",
    firmSize: "5,000+",
    pct: 66,
    metric: "significant_rx_impact",
    year: 2025,
    confidence: "disclosed",
  },
  {
    id: "exceeded_5k_2025",
    label: "Cost exceeded expectations",
    firmSize: "5,000+",
    pct: 59,
    metric: "cost_exceeded",
    year: 2025,
    confidence: "disclosed",
  },
  {
    id: "sig_impact_1k_2025",
    label: "Use higher than expected",
    firmSize: "1,000–4,999",
    pct: 44,
    metric: "cost_exceeded",
    year: 2025,
    confidence: "disclosed",
  },
  {
    id: "conditions_2025",
    label: "Require lifestyle / clinician step",
    firmSize: "200+ coverers",
    pct: 34,
    metric: "conditions",
    year: 2025,
    confidence: "disclosed",
  },
  {
    id: "conditions_2024",
    label: "Any condition / requirement (2024)",
    firmSize: "200+ coverers",
    pct: 53,
    metric: "conditions",
    year: 2024,
    confidence: "disclosed",
  },
  {
    id: "very_likely_2025",
    label: "Very likely to add coverage next year",
    firmSize: "200+ non-coverers",
    pct: 1,
    metric: "very_likely_add",
    year: 2025,
    confidence: "disclosed",
  },
  {
    id: "very_likely_2024",
    label: "Very likely to add (2024)",
    firmSize: "200+ non-coverers",
    pct: 3,
    metric: "very_likely_add",
    year: 2024,
    confidence: "disclosed",
  },
];

export type PharmacyTrendRow = {
  year: number;
  /** Commercial total drug trend (%) */
  totalDrugTrendPct: number;
  /** GLP-1 weight-loss one-year net trend (%) — Evernorth */
  glp1WeightLossNetTrendPct: number | null;
  /** Weight-mgmt share of total drug costs (%) when disclosed */
  weightMgmtShareOfTotalPct: number | null;
  /** Weight-mgmt share of spend *increase* (%) when disclosed */
  weightMgmtShareOfIncreasePct: number | null;
  confidence: Confidence;
};

/** Commercial pharmacy tilt toward weight-management / GLP-1 */
export const PHARMACY_TREND: PharmacyTrendRow[] = [
  {
    year: 2019,
    totalDrugTrendPct: 2.3,
    glp1WeightLossNetTrendPct: null,
    weightMgmtShareOfTotalPct: null,
    weightMgmtShareOfIncreasePct: null,
    confidence: "disclosed",
  },
  {
    year: 2020,
    totalDrugTrendPct: 1.4,
    glp1WeightLossNetTrendPct: null,
    weightMgmtShareOfTotalPct: null,
    weightMgmtShareOfIncreasePct: null,
    confidence: "estimated",
  },
  {
    year: 2021,
    totalDrugTrendPct: 3.1,
    glp1WeightLossNetTrendPct: null,
    weightMgmtShareOfTotalPct: null,
    weightMgmtShareOfIncreasePct: null,
    confidence: "estimated",
  },
  {
    year: 2022,
    totalDrugTrendPct: 4.2,
    glp1WeightLossNetTrendPct: null,
    weightMgmtShareOfTotalPct: null,
    weightMgmtShareOfIncreasePct: null,
    confidence: "disclosed",
  },
  {
    year: 2023,
    totalDrugTrendPct: 7.9,
    glp1WeightLossNetTrendPct: 210.2,
    weightMgmtShareOfTotalPct: null,
    weightMgmtShareOfIncreasePct: null,
    confidence: "disclosed",
  },
  {
    year: 2024,
    totalDrugTrendPct: 8.9,
    glp1WeightLossNetTrendPct: 148.7,
    weightMgmtShareOfTotalPct: 6.7,
    weightMgmtShareOfIncreasePct: 46.8,
    confidence: "disclosed",
  },
];

export type IndicationContrastRow = {
  id: string;
  label: string;
  coverPct: number;
  note: string;
  confidence: Confidence;
};

/** Near-universal diabetes coverage vs partial obesity coverage */
export const INDICATION_CONTRAST: IndicationContrastRow[] = [
  {
    id: "diabetes",
    label: "GLP-1 for diabetes",
    coverPct: 95,
    note: "Mercer / industry: nearly all large plans cover diabetes indication",
    confidence: "estimated",
  },
  {
    id: "obesity_mercer500",
    label: "Obesity meds · Mercer 500+",
    coverPct: 44,
    note: "2024 National Survey",
    confidence: "disclosed",
  },
  {
    id: "obesity_kff200",
    label: "GLP-1 weight loss · KFF 200+",
    coverPct: 19,
    note: "2025 EHBS largest plan",
    confidence: "disclosed",
  },
  {
    id: "obesity_kff5k",
    label: "GLP-1 weight loss · KFF 5,000+",
    coverPct: 43,
    note: "2025 EHBS",
    confidence: "disclosed",
  },
];

export type SpendCompositionRow = {
  id: string;
  label: string;
  pct: number;
  fill: string;
};

/** 2024 commercial spend-increase composition (Evernorth) */
export const SPEND_INCREASE_SPLIT: SpendCompositionRow[] = [
  {
    id: "weight_mgmt",
    label: "Weight-management therapies",
    pct: 46.8,
    fill: "#0d9488",
  },
  {
    id: "other",
    label: "All other drug classes",
    pct: 53.2,
    fill: "#64748b",
  },
];

export function coverageSeries(
  bucket: FirmSizeBucket,
): CoverageYearRow[] {
  return COVERAGE_BY_YEAR.filter((r) => r.bucket === bucket).sort(
    (a, b) => a.year - b.year,
  );
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmt1(n: number): string {
  return n.toFixed(1);
}
