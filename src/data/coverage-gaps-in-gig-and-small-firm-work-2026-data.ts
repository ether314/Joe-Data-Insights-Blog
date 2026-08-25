/**
 * Coverage gaps in gig and small-firm work (2026).
 *
 * Core question: How does employer-coverage access differ between gig
 * workers, small-firm employees, and comparable large-firm staff?
 *
 * Perimeter: KFF Employer Health Benefits Survey 2025 (firms with 10+
 * workers; firm-weighted offer rates); AHRQ/Census MEPS-Insurance Component
 * 2024 (private-sector enrollment & offer exposure by firm size); Census
 * CPS ASEC / ACS framing for employment-based coverage levels; Federal
 * Reserve SHED 2024 (gig activity vs non-gig adults — insurance mix and
 * benefit preferences). Firm-size cuts differ across sources; do not stitch
 * into a single time series without noting the cut.
 *
 * Headline: KFF 2025 firm offer rate is 97% at large firms (200+) vs 59%
 * at small firms (10–199) — a 38-point offer-rate gap by firm type.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Firm offer rates: KFF Employer Health Benefits Survey 2025 (sample limited to firms with 10+ workers; small = 10–199, large = 200+; firm-weighted). Worker offer exposure and enrollment: AHRQ MEPS-Insurance Component 2024 private-sector tables (small = <50 employees, large = 50+; Census Bureau field collection). Population employment-based coverage: Census CPS ASEC Health Insurance Coverage in the United States: 2023 (P60-284). Gig vs non-gig insurance mix and benefit wishes: Federal Reserve Board Survey of Household Economics and Decisionmaking (SHED) 2024, Employment and Gig Work chapter. Gig ESI in SHED includes coverage from another job or a spouse’s employer — not platform-provided benefits. Size buckets and survey frames are not interchangeable.";

export const SOURCES = [
  {
    label: "KFF — 2025 Employer Health Benefits Survey",
    url: "https://www.kff.org/health-costs/2025-employer-health-benefits-survey/",
  },
  {
    label: "KFF — Employer-Sponsored Health Insurance 101",
    url: "https://www.kff.org/health-costs/health-policy-101-employer-sponsored-health-insurance/",
  },
  {
    label: "AHRQ — MEPS-IC Research Findings #54 (2008–2024)",
    url: "https://meps.ahrq.gov/data_files/publications/rf54/rf54.shtml",
  },
  {
    label: "Census — Health Insurance Coverage in the United States: 2023 (P60-284)",
    url: "https://www.census.gov/library/publications/2024/demo/p60-284.html",
  },
  {
    label: "Federal Reserve — SHED 2024 Employment and Gig Work",
    url: "https://www.federalreserve.gov/publications/2025-economic-well-being-of-us-households-in-2024-employment-and-gig-work.htm",
  },
] as const;

/** Headline punchline — offer-rate gap by firm type */
export const HEADLINE = {
  /** KFF 2025: firms 200+ offering health benefits (%) */
  largeFirmOfferPct: 97,
  /** KFF 2025: firms 10–199 offering (%) */
  smallFirmOfferPct: 59,
  /** Percentage-point gap (large − small) */
  offerGapPpt: 38,
  /** KFF 2025: firms 10–24 offering (%) */
  microFirmOfferPct: 51,
  /** KFF 2025: share of workers at a firm that offers to someone (%) */
  workersAtOfferingFirmPct: 91,
  /** MEPS-IC 2024: enrollment rate at firms <50 (%) */
  mepsSmallEnrollPct: 26.8,
  /** MEPS-IC 2024: enrollment rate at firms 50+ (%) */
  mepsLargeEnrollPct: 54.3,
  /** SHED 2024: any health insurance among gig workers (%) */
  shedGigAnyInsurancePct: 88,
  /** SHED 2024: any health insurance among non-gig adults (%) */
  shedNonGigAnyInsurancePct: 92,
  confidence: "disclosed" as Confidence,
};

export type FirmSizeBucket =
  | "kff_10_24"
  | "kff_25_49"
  | "kff_50_199"
  | "kff_10_199"
  | "kff_200_999"
  | "kff_1000_plus"
  | "kff_200_plus";

export type OfferLadderRow = {
  bucket: FirmSizeBucket;
  label: string;
  workersLabel: string;
  offerPct: number;
  confidence: Confidence;
};

/** KFF 2025 firm-weighted offer ladder (disclosed chapter 2 cuts). */
export const OFFER_LADDER: OfferLadderRow[] = [
  {
    bucket: "kff_10_24",
    label: "10–24 workers",
    workersLabel: "Micro",
    offerPct: 51,
    confidence: "disclosed",
  },
  {
    bucket: "kff_25_49",
    label: "25–49 workers",
    workersLabel: "Small",
    offerPct: 64,
    confidence: "disclosed",
  },
  {
    bucket: "kff_50_199",
    label: "50–199 workers",
    workersLabel: "Mid-small",
    offerPct: 89,
    confidence: "disclosed",
  },
  {
    bucket: "kff_200_999",
    label: "200–999 workers",
    workersLabel: "Large",
    offerPct: 96,
    confidence: "disclosed",
  },
  {
    bucket: "kff_1000_plus",
    label: "1,000+ workers",
    workersLabel: "Jumbo",
    offerPct: 99,
    confidence: "disclosed",
  },
];

export type OfferGapRow = {
  id: string;
  label: string;
  smallPct: number;
  largePct: number;
  gapPpt: number;
  unit: "firms" | "workers";
  source: "kff" | "meps";
  confidence: Confidence;
};

/** Headline contrasts that survive the different size cuts. */
export const OFFER_GAPS: OfferGapRow[] = [
  {
    id: "kff-firm-offer",
    label: "KFF firm offer (10–199 vs 200+)",
    smallPct: 59,
    largePct: 97,
    gapPpt: 38,
    unit: "firms",
    source: "kff",
    confidence: "disclosed",
  },
  {
    id: "kff-micro-vs-large",
    label: "KFF firm offer (10–24 vs 200+)",
    smallPct: 51,
    largePct: 97,
    gapPpt: 46,
    unit: "firms",
    source: "kff",
    confidence: "disclosed",
  },
  {
    id: "meps-enroll",
    label: "MEPS-IC enrollment (<50 vs 50+)",
    smallPct: 26.8,
    largePct: 54.3,
    gapPpt: 27.5,
    unit: "workers",
    source: "meps",
    confidence: "disclosed",
  },
];

export type CascadeRow = {
  step: string;
  shortLabel: string;
  pct: number;
  note: string;
  confidence: Confidence;
};

/**
 * KFF 2025 coverage cascade among workers at offering firms, then
 * economy-wide share covered by own employer.
 */
export const COVERAGE_CASCADE: CascadeRow[] = [
  {
    step: "Workers at a firm that offers to someone",
    shortLabel: "At offering firm",
    pct: 91,
    note: "All workers, offering + non-offering firms",
    confidence: "disclosed",
  },
  {
    step: "Eligible among workers at offering firms",
    shortLabel: "Eligible",
    pct: 80,
    note: "At firms that offer health benefits",
    confidence: "disclosed",
  },
  {
    step: "Take-up among eligible workers",
    shortLabel: "Take-up",
    pct: 76,
    note: "Eligible workers who enroll",
    confidence: "disclosed",
  },
  {
    step: "Enrolled among workers at offering firms",
    shortLabel: "Enrolled @ offerers",
    pct: 61,
    note: "Product of eligibility × take-up",
    confidence: "disclosed",
  },
  {
    step: "Covered by own employer (all workers)",
    shortLabel: "Own-employer covered",
    pct: 55,
    note: "Offering + non-offering firms combined",
    confidence: "disclosed",
  },
];

export type MepsEnrollmentRow = {
  year: number;
  overallPct: number;
  smallUnder50Pct: number;
  large50PlusPct: number;
  confidence: Confidence;
};

/** MEPS-IC private-sector enrollment rates (all employees in establishments). */
export const MEPS_ENROLLMENT_TREND: MepsEnrollmentRow[] = [
  { year: 2020, overallPct: 49.5, smallUnder50Pct: 27.8, large50PlusPct: 56.1, confidence: "disclosed" },
  { year: 2021, overallPct: 48.0, smallUnder50Pct: 27.1, large50PlusPct: 55.3, confidence: "disclosed" },
  { year: 2022, overallPct: 47.7, smallUnder50Pct: 27.9, large50PlusPct: 55.2, confidence: "disclosed" },
  { year: 2023, overallPct: 46.0, smallUnder50Pct: 26.0, large50PlusPct: 53.1, confidence: "disclosed" },
  { year: 2024, overallPct: 47.1, smallUnder50Pct: 26.8, large50PlusPct: 54.3, confidence: "disclosed" },
];

export type ShedGigSegment =
  | "selling_renting"
  | "short_term_tasks"
  | "platform_tasks"
  | "any_gig"
  | "non_gig";

export type ShedCoverageRow = {
  segment: ShedGigSegment;
  label: string;
  anyInsurancePct: number;
  employerProvidedPct: number;
  medicaidMedicarePct: number;
  wishHealthInsurancePct?: number;
  hasNonGigMainJobPct?: number;
  confidence: Confidence;
};

/** SHED 2024 Table 7-style insurance outcomes by gig activity. */
export const SHED_COVERAGE: ShedCoverageRow[] = [
  {
    segment: "selling_renting",
    label: "Selling / renting",
    anyInsurancePct: 88,
    employerProvidedPct: 54,
    medicaidMedicarePct: 30,
    confidence: "disclosed",
  },
  {
    segment: "short_term_tasks",
    label: "Short-term tasks",
    anyInsurancePct: 86,
    employerProvidedPct: 47,
    medicaidMedicarePct: 35,
    confidence: "disclosed",
  },
  {
    segment: "platform_tasks",
    label: "App / platform tasks",
    anyInsurancePct: 86,
    employerProvidedPct: 45,
    medicaidMedicarePct: 35,
    wishHealthInsurancePct: 42,
    hasNonGigMainJobPct: 41,
    confidence: "disclosed",
  },
  {
    segment: "any_gig",
    label: "Any gig activity",
    anyInsurancePct: 88,
    employerProvidedPct: 53,
    medicaidMedicarePct: 30,
    wishHealthInsurancePct: 28,
    hasNonGigMainJobPct: 51,
    confidence: "disclosed",
  },
  {
    segment: "non_gig",
    label: "No gig activity",
    anyInsurancePct: 92,
    employerProvidedPct: 56,
    medicaidMedicarePct: 37,
    confidence: "disclosed",
  },
];

export type AccessChannelRow = {
  channel: string;
  gigPct: number;
  smallFirmContext: string;
  largeFirmContext: string;
  note: string;
  confidence: Confidence;
};

/**
 * Qualitative access channels — percentages from SHED / KFF where disclosed;
 * narrative contexts for small vs large firm staff.
 */
export const ACCESS_CHANNELS: AccessChannelRow[] = [
  {
    channel: "Own-job ESI offer",
    gigPct: 0,
    smallFirmContext: "Often absent (KFF 51–64% of micro/small firms offer)",
    largeFirmContext: "Near-universal firm offer (96–99%)",
    note: "Gig platforms generally do not sponsor ESI; SHED ESI is usually from another job or spouse.",
    confidence: "estimated",
  },
  {
    channel: "Spouse / other-job ESI",
    gigPct: 53,
    smallFirmContext: "Common fallback when firm does not offer",
    largeFirmContext: "Still used; eligibility & take-up still bind",
    note: "SHED: 53% of gig workers report employer-provided coverage from any employer source.",
    confidence: "disclosed",
  },
  {
    channel: "Medicaid / Medicare",
    gigPct: 30,
    smallFirmContext: "Higher reliance when wages & hours limit ESI",
    largeFirmContext: "Lower relative role among covered staff",
    note: "SHED Medicaid/Medicare share among any-gig adults.",
    confidence: "disclosed",
  },
  {
    channel: "Direct purchase / Marketplace",
    gigPct: 0,
    smallFirmContext: "More common when firm is non-offering",
    largeFirmContext: "Less common when own-employer plan is available",
    note: "CPS ASEC: direct-purchase covered 10.2% of population in 2023; not gig-specific.",
    confidence: "carried",
  },
];

export type ContributionContrastRow = {
  metric: string;
  smallFirmPct: number;
  largeFirmPct: number;
  confidence: Confidence;
};

/** KFF 2025 contribution / part-time offer contrasts among offering firms. */
export const CONTRIBUTION_CONTRASTS: ContributionContrastRow[] = [
  {
    metric: "Offer to part-time workers (offering firms)",
    smallFirmPct: 18,
    largeFirmPct: 27,
    confidence: "disclosed",
  },
  {
    metric: "Workers paying >50% of family premium",
    smallFirmPct: 29,
    largeFirmPct: 5,
    confidence: "disclosed",
  },
  {
    metric: "Employer pays full single premium (covered workers)",
    smallFirmPct: 19,
    largeFirmPct: 7,
    confidence: "disclosed",
  },
];

export type PopulationCoverageRow = {
  measure: string;
  year: number;
  pct: number;
  confidence: Confidence;
};

/** Census CPS ASEC population coverage anchors. */
export const POPULATION_COVERAGE: PopulationCoverageRow[] = [
  {
    measure: "Employment-based coverage (all ages)",
    year: 2023,
    pct: 53.7,
    confidence: "disclosed",
  },
  {
    measure: "Direct-purchase coverage (all ages)",
    year: 2023,
    pct: 10.2,
    confidence: "disclosed",
  },
  {
    measure: "Any health insurance (all ages)",
    year: 2023,
    pct: 92.0,
    confidence: "disclosed",
  },
];

export type WorkerClassRow = {
  classId: string;
  label: string;
  esiAccessProxyPct: number;
  uninsuredProxyPct: number;
  metricNote: string;
  confidence: Confidence;
};

/**
 * Cross-source access proxies for the three worker archetypes in the brief.
 * Not a single ACS crosstab — each figure is labeled to its survey.
 */
export const WORKER_CLASS_ACCESS: WorkerClassRow[] = [
  {
    classId: "gig_platform",
    label: "Platform / app gig (SHED)",
    esiAccessProxyPct: 45,
    uninsuredProxyPct: 14,
    metricNote: "Employer-provided share 45%; any insurance 86% → ~14% without",
    confidence: "disclosed",
  },
  {
    classId: "small_firm",
    label: "Small-firm staff (MEPS <50)",
    esiAccessProxyPct: 26.8,
    uninsuredProxyPct: 0,
    metricNote: "Own-employer enrollment rate among private-sector employees",
    confidence: "disclosed",
  },
  {
    classId: "large_firm",
    label: "Large-firm staff (MEPS 50+)",
    esiAccessProxyPct: 54.3,
    uninsuredProxyPct: 0,
    metricNote: "Own-employer enrollment rate among private-sector employees",
    confidence: "disclosed",
  },
  {
    classId: "any_gig",
    label: "Any gig activity (SHED)",
    esiAccessProxyPct: 53,
    uninsuredProxyPct: 12,
    metricNote: "Employer-provided 53%; any insurance 88%",
    confidence: "disclosed",
  },
  {
    classId: "non_gig",
    label: "Non-gig adults (SHED)",
    esiAccessProxyPct: 56,
    uninsuredProxyPct: 8,
    metricNote: "Employer-provided 56%; any insurance 92%",
    confidence: "disclosed",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPpt(n: number, digits = 0): string {
  return `${n.toFixed(digits)} ppt`;
}
