/**
 * Deceased-donor kidney discard versus offer filters (OPTN / SRTR / CMS).
 *
 * Core question: Did kidney discard rates fall as offer filters and allocation
 * changed, or did high-KDPI organs still go unused?
 *
 * Perimeter:
 * - OPTN/SRTR Annual Data Report (Kidney) nonuse = recovered for transplant but
 *   not transplanted. Primary years: 2012–2024 where disclosed.
 * - Kidney Donor Profile Index (KDPI) bands as published in ADR figures / text.
 * - Offer Filters: national voluntary release January 2022 (OPTN); default /
 *   model-enabled filters phase beginning late 2024 (UNOS/OPTN policy work).
 * - Allocation context: KAS (Dec 2014), KAS250 250-nm circle (Mar 2021).
 * - CMS transplant Conditions for Coverage / organ procurement payment context
 *   framed only as policy pressure on utilization — not a separate numeric series.
 *
 * Headline: Overall nonuse rose to 29.3% in 2024; KDPI ≥85% nonuse ~69.5%
 * (stable near 70% since 2022) despite offer-filter tools.
 */

export type Confidence = "disclosed" | "estimated" | "scenario";

export type KdpiBand = "0-20" | "21-34" | "35-84" | "85-100";
export type EraFilter =
  | "all"
  | "pre-kas250"
  | "post-kas250"
  | "offer-filters";
export type BandFilter = "all" | KdpiBand;

export const SOURCE_NOTE =
  "Nonuse rates and KDPI-band utilization: OPTN/SRTR Annual Data Report — Kidney (2021–2024 chapters; nonuse = kidneys recovered for transplant but not transplanted). KAS250 discard shift: Mohan et al., Kidney International Reports / related OPTN analyses of pre- vs post-March 2021 broader sharing. Offer Filters: OPTN concept papers and UNOS releases on national voluntary release (Jan 2022), program adoption (~60% with ≥1 filter), and default/model-enabled filters (late 2024). Candidate high-KDPI acceptance willingness: OPTN/SRTR ADR waitlist figures. CMS transplant Conditions for Coverage and OPO payment reforms cited as utilization pressure only. KDPI band series for intermediate years interpolate between disclosed ADR anchors and are labeled estimated where not printed as a single-year rate.";

export const SOURCES = [
  {
    label: "OPTN/SRTR 2024 Annual Data Report — Kidney",
    url: "https://srtr.hrsa.gov/adr/2024/Kidney/",
  },
  {
    label: "OPTN/SRTR 2023 Annual Data Report — Kidney",
    url: "https://srtr.hrsa.gov/adr/2023/Kidney/",
  },
  {
    label: "OPTN — Optimizing Usage of Kidney Offer Filters (concept)",
    url: "https://www.hrsa.gov/optn/policies-bylaws/public-comment/optimizing-usage-of-kidney-offer-filters",
  },
  {
    label: "UNOS — Offer Filters / acceptance-rate policy release",
    url: "https://unos.org/media-resources/releases/new-policy-aims-to-speed-kidney-acceptance-rates-increase-transplants/",
  },
] as const;

export const HEADLINE = {
  /** SRTR ADR 2024 — overall nonuse */
  overallNonuse2024Pct: 29.3,
  overallNonuse2012Pct: 18.7,
  overallNonuse2021Pct: 24.6,
  overallNonuse2022Pct: 26.6,
  overallNonuse2023Pct: 27.9,
  /** SRTR ADR — KDPI ≥85% nonuse */
  highKdpiNonuse2021Pct: 66.6,
  highKdpiNonuse2023Pct: 72.5,
  highKdpiNonuse2024Pct: 69.5,
  /** UNOS — programs with ≥1 kidney offer filter */
  programsWithFilterPct: 60,
  /** Offer filters national release year */
  offerFiltersLaunchYear: 2022,
  /** DDKT count adult+ context (ADR 2023 high watermark cited in prose) */
  ddkts2023: 21303,
  confidence: "disclosed" as Confidence,
};

export const ANALYTICS = {
  /** Percentage-point rise overall nonuse 2012→2024 */
  overallRisePp: 10.6,
  /** High-KDPI nonuse still ~2.4× overall in 2024 */
  highVsOverallRatio2024: 2.37,
  /** Pre vs post KAS250 overall discard (Mohan et al.) */
  preKas250DiscardPct: 21,
  postKas250DiscardPct: 25,
  lowKdpiDiscardStablePct: 3,
  /** Candidate willingness high-KDPI, age 65+ (ADR 2024) */
  willingHighKdpi65PlusPct: 63.7,
  willingHighKdpi50to64Pct: 47.8,
  /** DCD nonuse 2024 */
  dcdNonuse2024Pct: 36.4,
  biopsiedNonuse2024Pct: 40.8,
  nonBiopsiedNonuse2024Pct: 6.4,
};

/** Policy milestones for timeline panel */
export type PolicyMilestone = {
  year: number;
  month?: number;
  label: string;
  kind: "allocation" | "tooling" | "metrics";
  note: string;
};

export const POLICY_MILESTONES: PolicyMilestone[] = [
  {
    year: 2014,
    month: 12,
    label: "KAS rewrite",
    kind: "allocation",
    note: "Longevity matching and KDPI framework replace ECD binary labels.",
  },
  {
    year: 2021,
    month: 3,
    label: "KAS250 circles",
    kind: "allocation",
    note: "250-nautical-mile priority replaces DSA-first kidney distribution.",
  },
  {
    year: 2022,
    month: 1,
    label: "Offer Filters national",
    kind: "tooling",
    note: "Voluntary bypass rules for offers centers historically refuse.",
  },
  {
    year: 2023,
    month: 1,
    label: "eGFR wait-time credit",
    kind: "allocation",
    note: "Race-inclusive eGFR waiting-time correction for listed candidates.",
  },
  {
    year: 2024,
    month: 10,
    label: "KDPI race/HCV revise",
    kind: "metrics",
    note: "OPTN removes race and HCV from KDPI calculation; utilization TBD.",
  },
  {
    year: 2024,
    month: 11,
    label: "Default model filters",
    kind: "tooling",
    note: "OPTN begins enabling model-suggested filters with program opt-out.",
  },
];

export type OverallNonuseRow = {
  year: number;
  nonusePct: number;
  confidence: Confidence;
  era: "pre-kas250" | "post-kas250" | "offer-filters";
};

/**
 * Overall recovered-not-transplanted rates.
 * Disclosed ADR anchors; intervening years estimated from published trend shape.
 */
export const OVERALL_NONUSE: OverallNonuseRow[] = [
  { year: 2012, nonusePct: 18.7, confidence: "disclosed", era: "pre-kas250" },
  { year: 2013, nonusePct: 18.2, confidence: "disclosed", era: "pre-kas250" },
  { year: 2014, nonusePct: 19.1, confidence: "estimated", era: "pre-kas250" },
  { year: 2015, nonusePct: 19.8, confidence: "estimated", era: "pre-kas250" },
  { year: 2016, nonusePct: 20.0, confidence: "estimated", era: "pre-kas250" },
  { year: 2017, nonusePct: 20.2, confidence: "estimated", era: "pre-kas250" },
  { year: 2018, nonusePct: 20.5, confidence: "estimated", era: "pre-kas250" },
  { year: 2019, nonusePct: 21.0, confidence: "estimated", era: "pre-kas250" },
  { year: 2020, nonusePct: 21.8, confidence: "estimated", era: "pre-kas250" },
  { year: 2021, nonusePct: 24.6, confidence: "disclosed", era: "post-kas250" },
  { year: 2022, nonusePct: 26.6, confidence: "disclosed", era: "offer-filters" },
  { year: 2023, nonusePct: 27.9, confidence: "disclosed", era: "offer-filters" },
  { year: 2024, nonusePct: 29.3, confidence: "disclosed", era: "offer-filters" },
];

export type KdpiBandNonuseRow = {
  year: number;
  band: KdpiBand;
  label: string;
  nonusePct: number;
  confidence: Confidence;
};

/**
 * Nonuse by KDPI band. High band uses disclosed ADR points where available;
 * lower bands use KAS250-era published levels plus ADR-consistent slope.
 */
export const KDPI_BAND_NONUSE: KdpiBandNonuseRow[] = [
  // 2019 approximate pre-KAS250 (Mohan-era levels)
  { year: 2019, band: "0-20", label: "KDPI 0–20", nonusePct: 3.0, confidence: "estimated" },
  { year: 2019, band: "21-34", label: "KDPI 21–34", nonusePct: 8.5, confidence: "estimated" },
  { year: 2019, band: "35-84", label: "KDPI 35–84", nonusePct: 18.0, confidence: "estimated" },
  { year: 2019, band: "85-100", label: "KDPI ≥85", nonusePct: 64.0, confidence: "estimated" },
  // 2021 post-KAS250 / ADR
  { year: 2021, band: "0-20", label: "KDPI 0–20", nonusePct: 3.2, confidence: "estimated" },
  { year: 2021, band: "21-34", label: "KDPI 21–34", nonusePct: 10.0, confidence: "estimated" },
  { year: 2021, band: "35-84", label: "KDPI 35–84", nonusePct: 22.0, confidence: "estimated" },
  { year: 2021, band: "85-100", label: "KDPI ≥85", nonusePct: 66.6, confidence: "disclosed" },
  // 2022
  { year: 2022, band: "0-20", label: "KDPI 0–20", nonusePct: 3.5, confidence: "estimated" },
  { year: 2022, band: "21-34", label: "KDPI 21–34", nonusePct: 11.0, confidence: "estimated" },
  { year: 2022, band: "35-84", label: "KDPI 35–84", nonusePct: 24.0, confidence: "estimated" },
  { year: 2022, band: "85-100", label: "KDPI ≥85", nonusePct: 70.0, confidence: "estimated" },
  // 2023 ADR
  { year: 2023, band: "0-20", label: "KDPI 0–20", nonusePct: 3.8, confidence: "estimated" },
  { year: 2023, band: "21-34", label: "KDPI 21–34", nonusePct: 11.5, confidence: "estimated" },
  { year: 2023, band: "35-84", label: "KDPI 35–84", nonusePct: 25.5, confidence: "estimated" },
  { year: 2023, band: "85-100", label: "KDPI ≥85", nonusePct: 72.5, confidence: "disclosed" },
  // 2024 ADR
  { year: 2024, band: "0-20", label: "KDPI 0–20", nonusePct: 4.0, confidence: "estimated" },
  { year: 2024, band: "21-34", label: "KDPI 21–34", nonusePct: 12.0, confidence: "estimated" },
  { year: 2024, band: "35-84", label: "KDPI 35–84", nonusePct: 26.5, confidence: "estimated" },
  { year: 2024, band: "85-100", label: "KDPI ≥85", nonusePct: 69.5, confidence: "disclosed" },
];

export type OfferFilterAdoptionRow = {
  year: number;
  quarter: string;
  programsWithAnyFilterPct: number;
  confidence: Confidence;
  note: string;
};

/** Adoption path for kidney offer filters (UNOS / OPTN public figures + path). */
export const OFFER_FILTER_ADOPTION: OfferFilterAdoptionRow[] = [
  {
    year: 2022,
    quarter: "2022 Q1",
    programsWithAnyFilterPct: 18,
    confidence: "estimated",
    note: "National voluntary release; early opt-in.",
  },
  {
    year: 2022,
    quarter: "2022 Q4",
    programsWithAnyFilterPct: 35,
    confidence: "estimated",
    note: "Pilot lessons propagating; still minority use.",
  },
  {
    year: 2023,
    quarter: "2023 Q4",
    programsWithAnyFilterPct: 48,
    confidence: "estimated",
    note: "Broader awareness; concept papers push defaults.",
  },
  {
    year: 2024,
    quarter: "2024 H2",
    programsWithAnyFilterPct: 60,
    confidence: "disclosed",
    note: "UNOS: ~60% of kidney programs have ≥1 filter on.",
  },
];

export type DiscardReasonRow = {
  era: "pre-kas250" | "post-kas250";
  reason: string;
  sharePct: number;
  confidence: Confidence;
};

/**
 * Relative shift in discard attribution after KAS250 (list exhaustion rises).
 * Shares are illustrative of published direction of change, not a full ADR table.
 */
export const DISCARD_REASON_SHIFT: DiscardReasonRow[] = [
  {
    era: "pre-kas250",
    reason: "Biopsy / organ quality",
    sharePct: 42,
    confidence: "estimated",
  },
  {
    era: "pre-kas250",
    reason: "No recipient located / list exhausted",
    sharePct: 18,
    confidence: "estimated",
  },
  {
    era: "pre-kas250",
    reason: "Other / operational",
    sharePct: 40,
    confidence: "estimated",
  },
  {
    era: "post-kas250",
    reason: "Biopsy / organ quality",
    sharePct: 36,
    confidence: "estimated",
  },
  {
    era: "post-kas250",
    reason: "No recipient located / list exhausted",
    sharePct: 28,
    confidence: "estimated",
  },
  {
    era: "post-kas250",
    reason: "Other / operational",
    sharePct: 36,
    confidence: "estimated",
  },
];

export type WillingnessRow = {
  year: number;
  ageGroup: "18-34" | "35-49" | "50-64" | "65+";
  willingHighKdpiPct: number;
  confidence: Confidence;
};

/** Adults willing to accept KDPI ≥85% kidney (ADR waitlist figures / trend). */
export const HIGH_KDPI_WILLINGNESS: WillingnessRow[] = [
  { year: 2019, ageGroup: "18-34", willingHighKdpiPct: 22, confidence: "estimated" },
  { year: 2019, ageGroup: "35-49", willingHighKdpiPct: 32, confidence: "estimated" },
  { year: 2019, ageGroup: "50-64", willingHighKdpiPct: 52, confidence: "estimated" },
  { year: 2019, ageGroup: "65+", willingHighKdpiPct: 68, confidence: "estimated" },
  { year: 2021, ageGroup: "18-34", willingHighKdpiPct: 20, confidence: "estimated" },
  { year: 2021, ageGroup: "35-49", willingHighKdpiPct: 30, confidence: "estimated" },
  { year: 2021, ageGroup: "50-64", willingHighKdpiPct: 50, confidence: "estimated" },
  { year: 2021, ageGroup: "65+", willingHighKdpiPct: 65, confidence: "estimated" },
  { year: 2023, ageGroup: "18-34", willingHighKdpiPct: 18, confidence: "estimated" },
  { year: 2023, ageGroup: "35-49", willingHighKdpiPct: 28, confidence: "estimated" },
  { year: 2023, ageGroup: "50-64", willingHighKdpiPct: 48.4, confidence: "disclosed" },
  { year: 2023, ageGroup: "65+", willingHighKdpiPct: 63.3, confidence: "disclosed" },
  { year: 2024, ageGroup: "18-34", willingHighKdpiPct: 18, confidence: "estimated" },
  { year: 2024, ageGroup: "35-49", willingHighKdpiPct: 28, confidence: "estimated" },
  { year: 2024, ageGroup: "50-64", willingHighKdpiPct: 47.8, confidence: "disclosed" },
  { year: 2024, ageGroup: "65+", willingHighKdpiPct: 63.7, confidence: "disclosed" },
];

export type ComplexityRow = {
  label: string;
  nonusePct: number;
  confidence: Confidence;
};

/** 2024 complexity / process correlates of nonuse (ADR). */
export const COMPLEXITY_NONUSE_2024: ComplexityRow[] = [
  { label: "All recovered kidneys", nonusePct: 29.3, confidence: "disclosed" },
  { label: "KDPI ≥85%", nonusePct: 69.5, confidence: "disclosed" },
  { label: "Donor age ≥65", nonusePct: 68.9, confidence: "disclosed" },
  { label: "Biopsied", nonusePct: 40.8, confidence: "disclosed" },
  { label: "Not biopsied", nonusePct: 6.4, confidence: "disclosed" },
  { label: "DCD donor", nonusePct: 36.4, confidence: "disclosed" },
  { label: "Creatinine ≥1.5", nonusePct: 44.1, confidence: "disclosed" },
];

export type DualSeriesPoint = {
  year: number;
  overallNonusePct: number;
  highKdpiNonusePct: number;
  filterAdoptionPct: number | null;
  confidence: Confidence;
};

/** Combined series for dual-axis panel: discard vs filter uptake. */
export const DISCARD_VS_FILTERS: DualSeriesPoint[] = [
  {
    year: 2019,
    overallNonusePct: 21.0,
    highKdpiNonusePct: 64.0,
    filterAdoptionPct: null,
    confidence: "estimated",
  },
  {
    year: 2020,
    overallNonusePct: 21.8,
    highKdpiNonusePct: 65.0,
    filterAdoptionPct: null,
    confidence: "estimated",
  },
  {
    year: 2021,
    overallNonusePct: 24.6,
    highKdpiNonusePct: 66.6,
    filterAdoptionPct: null,
    confidence: "disclosed",
  },
  {
    year: 2022,
    overallNonusePct: 26.6,
    highKdpiNonusePct: 70.0,
    filterAdoptionPct: 35,
    confidence: "estimated",
  },
  {
    year: 2023,
    overallNonusePct: 27.9,
    highKdpiNonusePct: 72.5,
    filterAdoptionPct: 48,
    confidence: "estimated",
  },
  {
    year: 2024,
    overallNonusePct: 29.3,
    highKdpiNonusePct: 69.5,
    filterAdoptionPct: 60,
    confidence: "disclosed",
  },
];

export function filterOverallByEra(era: EraFilter): OverallNonuseRow[] {
  if (era === "all") return OVERALL_NONUSE;
  if (era === "pre-kas250") {
    return OVERALL_NONUSE.filter((r) => r.year < 2021);
  }
  if (era === "post-kas250") {
    return OVERALL_NONUSE.filter((r) => r.year >= 2021);
  }
  return OVERALL_NONUSE.filter((r) => r.year >= 2022);
}

export function kdpiBandSeries(
  band: BandFilter,
  years?: number[],
): KdpiBandNonuseRow[] {
  let rows = KDPI_BAND_NONUSE;
  if (band !== "all") rows = rows.filter((r) => r.band === band);
  if (years?.length) rows = rows.filter((r) => years.includes(r.year));
  return rows;
}

export function latestBandSnapshot(year = 2024): KdpiBandNonuseRow[] {
  return KDPI_BAND_NONUSE.filter((r) => r.year === year);
}

export function willingnessByYear(year: number): WillingnessRow[] {
  return HIGH_KDPI_WILLINGNESS.filter((r) => r.year === year);
}
