/**
 * Newspaper employment vs hedge-fund ownership — 2026 desk synthesis.
 * Core question: Did newsroom employment fall faster in counties where the
 * remaining paper is hedge-fund owned?
 *
 * Anchors: BLS QCEW / OEWS newspaper publishing (NAICS 511110); Medill Local
 * News Initiative State of Local News 2024–2025 ownership + employment tables;
 * investment-owner newsroom cuts from peer-reviewed acquisition studies.
 * County panels blend disclosed QCEW cells with ownership tags; estimated rows
 * are labeled.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export type OwnerBucket =
  | "hedge_pe"
  | "public_chain"
  | "private_chain"
  | "independent";

export const SOURCE_NOTE =
  "National newspaper employment follows BLS newspaper-publishing series as summarized in Medill State of Local News (2024–2025): ~91,550 industry jobs in 2024 (−7% YoY) and >270,000 jobs lost since 2005 (>75%). Ownership buckets follow Medill chain classifications plus desk tags for hedge/PE-linked owners (e.g. Alden/MediaNews-Tribune, PE-backed regional chains). County employment changes use BLS QCEW newspaper NAICS where publishable; suppressed cells are desk-modeled from state shares and outlet counts. Acquisition cut magnitudes (~14% relative newsroom reduction) follow published investment-owner studies; they are not BLS microdata.";

export const SOURCES = [
  {
    label: "Medill Local News Initiative — State of Local News 2025",
    url: "https://localnewsinitiative.northwestern.edu/projects/state-of-local-news/2025/report/",
  },
  {
    label: "Medill Local News Initiative — State of Local News 2024",
    url: "https://localnewsinitiative.northwestern.edu/projects/state-of-local-news/2024/report/",
  },
  {
    label: "BLS — Newspaper publishers employment (NAICS 511110)",
    url: "https://www.bls.gov/iag/tgs/iag511.htm",
  },
  {
    label: "Annals of the AAPSS — Investment ownership & reporting capacity",
    url: "https://doi.org/10.1177/00027162231211426",
  },
  {
    label: "NBER — Local journalism under private equity ownership (w29743)",
    url: "https://www.nber.org/papers/w29743",
  },
] as const;

export const HEADLINE = {
  industryJobs2024: 91_550,
  industryJobsDeclineYoYPct: 7,
  jobsLostSince2005: 270_000,
  jobsLostSince2005Pct: 75,
  hedgeCountyMedianDecline2012_24Pct: 62,
  independentCountyMedianDecline2012_24Pct: 41,
  hedgeVsIndepGapPp: 21,
  acquisitionRelativeCutPct: 14,
  singleSourceCounties: 1525,
  newsDesertCounties: 212,
} as const;

export type NationalYearRow = {
  year: number;
  industryJobsK: number;
  newsroomJobsK: number;
  confidence: Confidence;
};

/** Industry + newsroom ladders; newsroom ≈ editors+reporters share of total. */
export const NATIONAL_EMPLOYMENT: NationalYearRow[] = [
  { year: 2005, industryJobsK: 365, newsroomJobsK: 74, confidence: "disclosed" },
  { year: 2008, industryJobsK: 327, newsroomJobsK: 66, confidence: "estimated" },
  { year: 2012, industryJobsK: 230, newsroomJobsK: 48, confidence: "estimated" },
  { year: 2016, industryJobsK: 173, newsroomJobsK: 38, confidence: "estimated" },
  { year: 2019, industryJobsK: 138, newsroomJobsK: 32, confidence: "estimated" },
  { year: 2021, industryJobsK: 118, newsroomJobsK: 28, confidence: "estimated" },
  { year: 2022, industryJobsK: 106, newsroomJobsK: 26, confidence: "estimated" },
  { year: 2023, industryJobsK: 98.96, newsroomJobsK: 24.5, confidence: "disclosed" },
  { year: 2024, industryJobsK: 91.55, newsroomJobsK: 22.8, confidence: "disclosed" },
];

export type OwnerCohortRow = {
  id: OwnerBucket;
  label: string;
  short: string;
  color: string;
  /** Median % decline in county newspaper employment, 2012→2024 */
  medianDeclinePct: number;
  /** P25–P75 interquartile range of county declines */
  p25DeclinePct: number;
  p75DeclinePct: number;
  countyN: number;
  shareOfSinglePaperCountiesPct: number;
  confidence: Confidence;
};

export const OWNER_COHORTS: OwnerCohortRow[] = [
  {
    id: "hedge_pe",
    label: "Hedge / PE-linked remaining paper",
    short: "Hedge/PE",
    color: "#e11d48",
    medianDeclinePct: 62,
    p25DeclinePct: 48,
    p75DeclinePct: 74,
    countyN: 318,
    shareOfSinglePaperCountiesPct: 21,
    confidence: "modeled",
  },
  {
    id: "public_chain",
    label: "Publicly traded chain (non-PE majority)",
    short: "Public chain",
    color: "#f59e0b",
    medianDeclinePct: 54,
    p25DeclinePct: 41,
    p75DeclinePct: 65,
    countyN: 412,
    shareOfSinglePaperCountiesPct: 27,
    confidence: "modeled",
  },
  {
    id: "private_chain",
    label: "Private regional chain",
    short: "Private chain",
    color: "#0ea5e9",
    medianDeclinePct: 47,
    p25DeclinePct: 34,
    p75DeclinePct: 58,
    countyN: 356,
    shareOfSinglePaperCountiesPct: 23,
    confidence: "modeled",
  },
  {
    id: "independent",
    label: "Independent / family / nonprofit",
    short: "Independent",
    color: "#10b981",
    medianDeclinePct: 41,
    p25DeclinePct: 28,
    p75DeclinePct: 52,
    countyN: 439,
    shareOfSinglePaperCountiesPct: 29,
    confidence: "modeled",
  },
];

export type CountyPanelRow = {
  id: string;
  county: string;
  state: string;
  region: RegionId;
  ownerBucket: OwnerBucket;
  ownerName: string;
  jobs2012: number;
  jobs2024: number;
  declinePct: number;
  remainingOutletType: "daily" | "weekly" | "hybrid";
  confidence: Confidence;
};

export type RegionId = "Northeast" | "Midwest" | "South" | "West";

/** Illustrative single-paper counties with ownership tag + employment path. */
export const COUNTY_PANEL: CountyPanelRow[] = [
  { id: "den-co", county: "Denver", state: "CO", region: "West", ownerBucket: "hedge_pe", ownerName: "Alden / MediaNews", jobs2012: 184, jobs2024: 58, declinePct: 68, remainingOutletType: "daily", confidence: "estimated" },
  { id: "lac-ca", county: "Los Angeles (suburban dailies)", state: "CA", region: "West", ownerBucket: "hedge_pe", ownerName: "Alden / MediaNews", jobs2012: 420, jobs2024: 145, declinePct: 65, remainingOutletType: "daily", confidence: "estimated" },
  { id: "balt-md", county: "Baltimore", state: "MD", region: "Northeast", ownerBucket: "hedge_pe", ownerName: "Alden / Tribune path", jobs2012: 210, jobs2024: 72, declinePct: 66, remainingOutletType: "daily", confidence: "estimated" },
  { id: "all-pa", county: "Allentown", state: "PA", region: "Northeast", ownerBucket: "hedge_pe", ownerName: "Alden / MediaNews", jobs2012: 95, jobs2024: 28, declinePct: 71, remainingOutletType: "daily", confidence: "estimated" },
  { id: "stl-mo", county: "St. Louis metro remnant", state: "MO", region: "Midwest", ownerBucket: "hedge_pe", ownerName: "Alden path", jobs2012: 160, jobs2024: 55, declinePct: 66, remainingOutletType: "daily", confidence: "estimated" },
  { id: "wilm-de", county: "New Castle", state: "DE", region: "Northeast", ownerBucket: "hedge_pe", ownerName: "Alden / MediaNews", jobs2012: 112, jobs2024: 23, declinePct: 79, remainingOutletType: "daily", confidence: "estimated" },
  { id: "phx-az", county: "Maricopa remnant weeklies", state: "AZ", region: "West", ownerBucket: "public_chain", ownerName: "Gannett", jobs2012: 280, jobs2024: 118, declinePct: 58, remainingOutletType: "hybrid", confidence: "estimated" },
  { id: "ind-in", county: "Marion", state: "IN", region: "Midwest", ownerBucket: "public_chain", ownerName: "Gannett", jobs2012: 190, jobs2024: 82, declinePct: 57, remainingOutletType: "daily", confidence: "estimated" },
  { id: "roc-ny", county: "Monroe", state: "NY", region: "Northeast", ownerBucket: "public_chain", ownerName: "Gannett", jobs2012: 140, jobs2024: 61, declinePct: 56, remainingOutletType: "daily", confidence: "estimated" },
  { id: "des-ia", county: "Polk", state: "IA", region: "Midwest", ownerBucket: "public_chain", ownerName: "Gannett", jobs2012: 155, jobs2024: 70, declinePct: 55, remainingOutletType: "daily", confidence: "estimated" },
  { id: "lex-ky", county: "Fayette", state: "KY", region: "South", ownerBucket: "private_chain", ownerName: "McClatchy", jobs2012: 120, jobs2024: 58, declinePct: 52, remainingOutletType: "daily", confidence: "estimated" },
  { id: "sac-ca", county: "Sacramento", state: "CA", region: "West", ownerBucket: "private_chain", ownerName: "McClatchy", jobs2012: 210, jobs2024: 105, declinePct: 50, remainingOutletType: "daily", confidence: "estimated" },
  { id: "oma-ne", county: "Douglas", state: "NE", region: "Midwest", ownerBucket: "private_chain", ownerName: "Lee Enterprises", jobs2012: 145, jobs2024: 72, declinePct: 50, remainingOutletType: "daily", confidence: "estimated" },
  { id: "mad-wi", county: "Dane", state: "WI", region: "Midwest", ownerBucket: "private_chain", ownerName: "Lee Enterprises", jobs2012: 130, jobs2024: 68, declinePct: 48, remainingOutletType: "daily", confidence: "estimated" },
  { id: "ben-or", county: "Deschutes", state: "OR", region: "West", ownerBucket: "independent", ownerName: "Local / family", jobs2012: 48, jobs2024: 29, declinePct: 40, remainingOutletType: "daily", confidence: "estimated" },
  { id: "cha-nc", county: "Buncombe", state: "NC", region: "South", ownerBucket: "independent", ownerName: "Local / nonprofit hybrid", jobs2012: 72, jobs2024: 44, declinePct: 39, remainingOutletType: "daily", confidence: "estimated" },
  { id: "boi-id", county: "Ada remnant", state: "ID", region: "West", ownerBucket: "independent", ownerName: "Local ownership", jobs2012: 85, jobs2024: 52, declinePct: 39, remainingOutletType: "daily", confidence: "estimated" },
  { id: "por-me", county: "Cumberland", state: "ME", region: "Northeast", ownerBucket: "independent", ownerName: "Local / family", jobs2012: 90, jobs2024: 55, declinePct: 39, remainingOutletType: "daily", confidence: "estimated" },
  { id: "tus-az", county: "Pima", state: "AZ", region: "West", ownerBucket: "independent", ownerName: "Local ownership", jobs2012: 110, jobs2024: 68, declinePct: 38, remainingOutletType: "daily", confidence: "estimated" },
  { id: "char-vt", county: "Chittenden", state: "VT", region: "Northeast", ownerBucket: "independent", ownerName: "Local / nonprofit", jobs2012: 55, jobs2024: 36, declinePct: 35, remainingOutletType: "daily", confidence: "estimated" },
];

export type AcquisitionEventRow = {
  year: number;
  label: string;
  ownerBucket: OwnerBucket;
  /** Indexed newsroom staff, acquisition year = 100 */
  indexTminus2: number;
  indexT0: number;
  indexTplus2: number;
  indexTplus4: number;
  confidence: Confidence;
};

export const ACQUISITION_EVENTS: AcquisitionEventRow[] = [
  { year: 2013, label: "Mid-size Alden/MediaNews wave", ownerBucket: "hedge_pe", indexTminus2: 108, indexT0: 100, indexTplus2: 78, indexTplus4: 62, confidence: "estimated" },
  { year: 2016, label: "Digital First / Alden deepening", ownerBucket: "hedge_pe", indexTminus2: 105, indexT0: 100, indexTplus2: 74, indexTplus4: 58, confidence: "estimated" },
  { year: 2021, label: "Tribune Publishing → Alden", ownerBucket: "hedge_pe", indexTminus2: 104, indexT0: 100, indexTplus2: 76, indexTplus4: 64, confidence: "estimated" },
  { year: 2019, label: "GateHouse → Gannett merge", ownerBucket: "public_chain", indexTminus2: 106, indexT0: 100, indexTplus2: 84, indexTplus4: 72, confidence: "estimated" },
  { year: 2020, label: "McClatchy bankruptcy exit", ownerBucket: "private_chain", indexTminus2: 107, indexT0: 100, indexTplus2: 88, indexTplus4: 78, confidence: "estimated" },
  { year: 2018, label: "Independent local refinance cohort", ownerBucket: "independent", indexTminus2: 103, indexT0: 100, indexTplus2: 94, indexTplus4: 88, confidence: "modeled" },
];

export type RegionOwnerCell = {
  region: RegionId;
  hedgeMedianDeclinePct: number;
  independentMedianDeclinePct: number;
  gapPp: number;
  countyN: number;
};

export const REGION_GAPS: RegionOwnerCell[] = [
  { region: "Northeast", hedgeMedianDeclinePct: 67, independentMedianDeclinePct: 42, gapPp: 25, countyN: 210 },
  { region: "Midwest", hedgeMedianDeclinePct: 60, independentMedianDeclinePct: 40, gapPp: 20, countyN: 380 },
  { region: "South", hedgeMedianDeclinePct: 58, independentMedianDeclinePct: 39, gapPp: 19, countyN: 520 },
  { region: "West", hedgeMedianDeclinePct: 64, independentMedianDeclinePct: 43, gapPp: 21, countyN: 290 },
];

export type OwnershipShareYear = {
  year: number;
  hedgePePaperSharePct: number;
  top10ChainPaperSharePct: number;
  independentPaperSharePct: number;
  confidence: Confidence;
};

/** Rough ownership composition of remaining newspapers (Medill-informed). */
export const OWNERSHIP_SHARE_TREND: OwnershipShareYear[] = [
  { year: 2005, hedgePePaperSharePct: 4, top10ChainPaperSharePct: 18, independentPaperSharePct: 55, confidence: "estimated" },
  { year: 2012, hedgePePaperSharePct: 9, top10ChainPaperSharePct: 22, independentPaperSharePct: 48, confidence: "estimated" },
  { year: 2016, hedgePePaperSharePct: 12, top10ChainPaperSharePct: 24, independentPaperSharePct: 45, confidence: "estimated" },
  { year: 2020, hedgePePaperSharePct: 14, top10ChainPaperSharePct: 26, independentPaperSharePct: 42, confidence: "estimated" },
  { year: 2023, hedgePePaperSharePct: 15, top10ChainPaperSharePct: 25, independentPaperSharePct: 42, confidence: "estimated" },
  { year: 2025, hedgePePaperSharePct: 16, top10ChainPaperSharePct: 25, independentPaperSharePct: 40, confidence: "estimated" },
];

export const OWNER_BUCKET_META: Record<
  OwnerBucket,
  { label: string; short: string; color: string }
> = {
  hedge_pe: { label: "Hedge / PE-linked", short: "Hedge/PE", color: "#e11d48" },
  public_chain: { label: "Public chain", short: "Public", color: "#f59e0b" },
  private_chain: { label: "Private chain", short: "Private", color: "#0ea5e9" },
  independent: { label: "Independent", short: "Indep.", color: "#10b981" },
};

export const REGIONS: RegionId[] = ["Northeast", "Midwest", "South", "West"];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 0): string {
  return `${n.toFixed(digits)} pp`;
}

export function fmtJobs(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
}

export function countiesFor(
  region: RegionId | "All",
  bucket: OwnerBucket | "All",
): CountyPanelRow[] {
  return COUNTY_PANEL.filter((c) => {
    if (region !== "All" && c.region !== region) return false;
    if (bucket !== "All" && c.ownerBucket !== bucket) return false;
    return true;
  });
}

export function cohortById(id: OwnerBucket): OwnerCohortRow {
  return OWNER_COHORTS.find((c) => c.id === id)!;
}
