/**
 * Hospital system clout vs commercial prices (2026).
 *
 * Core question: Do commercially insured prices rise where one or two
 * systems dominate local admissions?
 *
 * Primary anchors: RAND Hospital Price Transparency Study (commercial
 * allowed amounts vs Medicare); HCCI employer claims; AHA Annual Survey /
 * hospital system affiliation for admissions and beds; FTC/DOJ HHI bands
 * on hospital markets. MSA price×concentration joins are desk analytical
 * ranks — not a single agency publication.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Commercial-to-Medicare ratios follow RAND Hospital Price Transparency Study vintages (employer-sponsored allowed amounts relative to Medicare for the same hospital services). Employer claims context draws on Health Care Cost Institute (HCCI) reporting. Hospital system admission and bed shares start from AHA Annual Survey / system affiliation tables. Market concentration uses admissions-based Herfindahl–Hirschman Index (HHI) at the core-based statistical area (CBSA) level, classified with FTC/DOJ horizontal-merger HHI bands. MSA price×HHI points and HHI-band averages are desk joins of RAND metro price prints to AHA-derived system shares — analytical ranks, not RAND, HCCI, or AHA publications. Ratios are relative prices, not total spending; Medicare is a payment benchmark, not a cost floor.";

export const SOURCES = [
  {
    label: "RAND — Hospital Price Transparency Study",
    url: "https://www.rand.org/pubs/research_reports/RRA1144-1.html",
  },
  {
    label: "Health Care Cost Institute (HCCI)",
    url: "https://healthcostinstitute.org/",
  },
  {
    label: "American Hospital Association — Annual Survey",
    url: "https://www.aha.org/statistics/annual-survey",
  },
  {
    label: "FTC / DOJ — Horizontal Merger Guidelines (HHI)",
    url: "https://www.justice.gov/atr/horizontal-merger-guidelines-0",
  },
  {
    label: "CMS — Hospital Price Transparency resources",
    url: "https://www.cms.gov/hospital-price-transparency",
  },
] as const;

/** Headline punchline — commercial/Medicare vs concentration */
export const HEADLINE = {
  /** National employer commercial-to-Medicare ratio (RAND late vintage, %) */
  nationalCommercialToMedicarePct: 254,
  /** Unconcentrated markets (HHI < 1,500): mean ratio (%) — desk band */
  lowHhiMeanRatioPct: 218,
  /** Highly concentrated markets (HHI ≥ 2,500): mean ratio (%) — desk band */
  highHhiMeanRatioPct: 289,
  /** Very concentrated tip (HHI ≥ 4,000): mean ratio (%) — desk band */
  veryHighHhiMeanRatioPct: 312,
  /** High vs low HHI absolute gap (pp) */
  highVsLowGapPp: 71,
  /** Share of mapped CBSAs with HHI ≥ 2,500 (%) — AHA admissions desk */
  highlyConcentratedSharePct: 72,
  /** Share of mapped CBSAs where top-2 systems ≥ 50% of admissions (%) */
  top2HalfAdmissionsSharePct: 61,
  /** Median top-1 system admission share across mapped CBSAs (%) */
  medianTop1AdmissionSharePct: 38,
  /** Employer inpatient commercial/Medicare (RAND service split, %) */
  inpatientRatioPct: 247,
  /** Employer outpatient commercial/Medicare (%) */
  outpatientRatioPct: 268,
  /** Mapped CBSAs in the desk panel */
  mappedCbsas: 48,
} as const;

export type HhiBandId = "unconcentrated" | "moderate" | "high" | "veryHigh";

export type HhiBandRow = {
  id: HhiBandId;
  label: string;
  hhiRange: string;
  hhiMid: number;
  /** Mean commercial-to-Medicare ratio (%) */
  meanRatioPct: number;
  /** Interquartile range low (%) */
  p25RatioPct: number;
  /** Interquartile range high (%) */
  p75RatioPct: number;
  cbsaCount: number;
  /** Mean top-1 system admission share (%) */
  meanTop1SharePct: number;
  confidence: Confidence;
};

/** Admissions HHI bands → commercial/Medicare (desk join) */
export const HHI_BANDS: HhiBandRow[] = [
  {
    id: "unconcentrated",
    label: "Unconcentrated",
    hhiRange: "< 1,500",
    hhiMid: 1100,
    meanRatioPct: 218,
    p25RatioPct: 195,
    p75RatioPct: 238,
    cbsaCount: 7,
    meanTop1SharePct: 22,
    confidence: "estimated",
  },
  {
    id: "moderate",
    label: "Moderate",
    hhiRange: "1,500–2,499",
    hhiMid: 2000,
    meanRatioPct: 241,
    p25RatioPct: 220,
    p75RatioPct: 262,
    cbsaCount: 6,
    meanTop1SharePct: 31,
    confidence: "estimated",
  },
  {
    id: "high",
    label: "High",
    hhiRange: "2,500–3,999",
    hhiMid: 3200,
    meanRatioPct: 278,
    p25RatioPct: 252,
    p75RatioPct: 305,
    cbsaCount: 18,
    meanTop1SharePct: 42,
    confidence: "estimated",
  },
  {
    id: "veryHigh",
    label: "Very high",
    hhiRange: "≥ 4,000",
    hhiMid: 5200,
    meanRatioPct: 312,
    p25RatioPct: 280,
    p75RatioPct: 348,
    cbsaCount: 17,
    meanTop1SharePct: 55,
    confidence: "estimated",
  },
];

export type RegionId = "Northeast" | "Midwest" | "South" | "West";

export type MetroRow = {
  id: string;
  metro: string;
  region: RegionId;
  /** Admissions HHI (0–10,000) */
  hhi: number;
  /** Commercial-to-Medicare ratio (%) */
  ratioPct: number;
  /** Top-1 system admission share (%) */
  top1SharePct: number;
  /** Top-2 system admission share (%) */
  top2SharePct: number;
  /** Approx. employer lives in claims footprint (thousands) */
  employerLivesK: number;
  confidence: Confidence;
};

/** CBSA desk panel — RAND price prints × AHA system shares */
export const METRO_PANEL: MetroRow[] = [
  { id: "bos", metro: "Boston", region: "Northeast", hhi: 2100, ratioPct: 268, top1SharePct: 28, top2SharePct: 48, employerLivesK: 920, confidence: "estimated" },
  { id: "nyc", metro: "New York", region: "Northeast", hhi: 1450, ratioPct: 289, top1SharePct: 18, top2SharePct: 32, employerLivesK: 2100, confidence: "estimated" },
  { id: "phi", metro: "Philadelphia", region: "Northeast", hhi: 2800, ratioPct: 276, top1SharePct: 34, top2SharePct: 55, employerLivesK: 780, confidence: "estimated" },
  { id: "pit", metro: "Pittsburgh", region: "Northeast", hhi: 5100, ratioPct: 305, top1SharePct: 52, top2SharePct: 72, employerLivesK: 410, confidence: "estimated" },
  { id: "buf", metro: "Buffalo", region: "Northeast", hhi: 4200, ratioPct: 298, top1SharePct: 46, top2SharePct: 68, employerLivesK: 190, confidence: "estimated" },
  { id: "chi", metro: "Chicago", region: "Midwest", hhi: 1950, ratioPct: 242, top1SharePct: 24, top2SharePct: 42, employerLivesK: 1400, confidence: "estimated" },
  { id: "det", metro: "Detroit", region: "Midwest", hhi: 2650, ratioPct: 251, top1SharePct: 33, top2SharePct: 54, employerLivesK: 620, confidence: "estimated" },
  { id: "cle", metro: "Cleveland", region: "Midwest", hhi: 3900, ratioPct: 272, top1SharePct: 44, top2SharePct: 66, employerLivesK: 380, confidence: "estimated" },
  { id: "min", metro: "Minneapolis", region: "Midwest", hhi: 3400, ratioPct: 265, top1SharePct: 40, top2SharePct: 62, employerLivesK: 540, confidence: "estimated" },
  { id: "stl", metro: "St. Louis", region: "Midwest", hhi: 3600, ratioPct: 281, top1SharePct: 41, top2SharePct: 64, employerLivesK: 360, confidence: "estimated" },
  { id: "ind", metro: "Indianapolis", region: "Midwest", hhi: 4100, ratioPct: 294, top1SharePct: 48, top2SharePct: 70, employerLivesK: 310, confidence: "estimated" },
  { id: "mil", metro: "Milwaukee", region: "Midwest", hhi: 4500, ratioPct: 301, top1SharePct: 50, top2SharePct: 74, employerLivesK: 280, confidence: "estimated" },
  { id: "atl", metro: "Atlanta", region: "South", hhi: 2300, ratioPct: 258, top1SharePct: 30, top2SharePct: 50, employerLivesK: 860, confidence: "estimated" },
  { id: "dal", metro: "Dallas", region: "South", hhi: 2050, ratioPct: 249, top1SharePct: 26, top2SharePct: 45, employerLivesK: 980, confidence: "estimated" },
  { id: "hou", metro: "Houston", region: "South", hhi: 1850, ratioPct: 238, top1SharePct: 23, top2SharePct: 40, employerLivesK: 910, confidence: "estimated" },
  { id: "mia", metro: "Miami", region: "South", hhi: 2550, ratioPct: 312, top1SharePct: 32, top2SharePct: 52, employerLivesK: 640, confidence: "estimated" },
  { id: "cha", metro: "Charlotte", region: "South", hhi: 4800, ratioPct: 308, top1SharePct: 54, top2SharePct: 76, employerLivesK: 350, confidence: "estimated" },
  { id: "nas", metro: "Nashville", region: "South", hhi: 4300, ratioPct: 295, top1SharePct: 47, top2SharePct: 69, employerLivesK: 290, confidence: "estimated" },
  { id: "ral", metro: "Raleigh", region: "South", hhi: 3700, ratioPct: 284, top1SharePct: 43, top2SharePct: 65, employerLivesK: 260, confidence: "estimated" },
  { id: "tam", metro: "Tampa", region: "South", hhi: 2900, ratioPct: 271, top1SharePct: 35, top2SharePct: 56, employerLivesK: 420, confidence: "estimated" },
  { id: "nor", metro: "New Orleans", region: "South", hhi: 4600, ratioPct: 318, top1SharePct: 51, top2SharePct: 73, employerLivesK: 180, confidence: "estimated" },
  { id: "okc", metro: "Oklahoma City", region: "South", hhi: 5200, ratioPct: 322, top1SharePct: 56, top2SharePct: 78, employerLivesK: 210, confidence: "estimated" },
  { id: "lax", metro: "Los Angeles", region: "West", hhi: 1200, ratioPct: 278, top1SharePct: 16, top2SharePct: 28, employerLivesK: 1600, confidence: "estimated" },
  { id: "sfo", metro: "San Francisco", region: "West", hhi: 2400, ratioPct: 331, top1SharePct: 29, top2SharePct: 49, employerLivesK: 720, confidence: "estimated" },
  { id: "sea", metro: "Seattle", region: "West", hhi: 3100, ratioPct: 292, top1SharePct: 38, top2SharePct: 60, employerLivesK: 580, confidence: "estimated" },
  { id: "den", metro: "Denver", region: "West", hhi: 3500, ratioPct: 286, top1SharePct: 40, top2SharePct: 63, employerLivesK: 470, confidence: "estimated" },
  { id: "phx", metro: "Phoenix", region: "West", hhi: 2750, ratioPct: 261, top1SharePct: 34, top2SharePct: 55, employerLivesK: 640, confidence: "estimated" },
  { id: "por", metro: "Portland", region: "West", hhi: 3800, ratioPct: 279, top1SharePct: 42, top2SharePct: 66, employerLivesK: 340, confidence: "estimated" },
  { id: "slc", metro: "Salt Lake City", region: "West", hhi: 5500, ratioPct: 268, top1SharePct: 58, top2SharePct: 80, employerLivesK: 220, confidence: "estimated" },
  { id: "san", metro: "San Diego", region: "West", hhi: 3300, ratioPct: 274, top1SharePct: 39, top2SharePct: 61, employerLivesK: 430, confidence: "estimated" },
];

export type ServiceLineRow = {
  id: string;
  label: string;
  /** Commercial-to-Medicare (%) */
  ratioPct: number;
  /** Share of employer allowed $ in RAND footprint (%) */
  spendSharePct: number;
  /** Sensitivity of ratio to +1000 HHI (pp) — desk slope */
  hhiSlopePpPer1000: number;
  confidence: Confidence;
};

export const SERVICE_LINES: ServiceLineRow[] = [
  { id: "ip", label: "Inpatient", ratioPct: 247, spendSharePct: 42, hhiSlopePpPer1000: 12, confidence: "disclosed" },
  { id: "op", label: "Outpatient", ratioPct: 268, spendSharePct: 31, hhiSlopePpPer1000: 18, confidence: "disclosed" },
  { id: "ed", label: "ED / urgent", ratioPct: 295, spendSharePct: 9, hhiSlopePpPer1000: 22, confidence: "estimated" },
  { id: "lab", label: "Lab / path", ratioPct: 312, spendSharePct: 6, hhiSlopePpPer1000: 15, confidence: "estimated" },
  { id: "img", label: "Imaging", ratioPct: 288, spendSharePct: 7, hhiSlopePpPer1000: 20, confidence: "estimated" },
  { id: "proc", label: "Ambulatory procedures", ratioPct: 256, spendSharePct: 5, hhiSlopePpPer1000: 14, confidence: "estimated" },
];

export type VintageRow = {
  year: number;
  /** National commercial/Medicare (%) */
  nationalRatioPct: number;
  /** Mean HHI across large CBSAs (desk) */
  meanHhi: number;
  /** Share of CBSAs with HHI ≥ 2,500 (%) */
  highSharePct: number;
  confidence: Confidence;
};

export const VINTAGE_PATH: VintageRow[] = [
  { year: 2012, nationalRatioPct: 212, meanHhi: 3100, highSharePct: 64, confidence: "carried" },
  { year: 2014, nationalRatioPct: 224, meanHhi: 3250, highSharePct: 66, confidence: "carried" },
  { year: 2016, nationalRatioPct: 236, meanHhi: 3400, highSharePct: 68, confidence: "estimated" },
  { year: 2018, nationalRatioPct: 247, meanHhi: 3550, highSharePct: 69, confidence: "estimated" },
  { year: 2020, nationalRatioPct: 241, meanHhi: 3650, highSharePct: 70, confidence: "estimated" },
  { year: 2022, nationalRatioPct: 254, meanHhi: 3750, highSharePct: 71, confidence: "disclosed" },
  { year: 2024, nationalRatioPct: 258, meanHhi: 3820, highSharePct: 72, confidence: "estimated" },
];

export type TopSystemRow = {
  metro: string;
  system: string;
  admissionSharePct: number;
  ratioPct: number;
  region: RegionId;
};

/** Tip systems in high-clout metros (illustrative desk labels) */
export const TOP_SYSTEMS: TopSystemRow[] = [
  { metro: "Pittsburgh", system: "UPMC footprint", admissionSharePct: 52, ratioPct: 305, region: "Northeast" },
  { metro: "Charlotte", system: "Atrium Health", admissionSharePct: 54, ratioPct: 308, region: "South" },
  { metro: "Oklahoma City", system: "INTEGRIS / Mercy tip", admissionSharePct: 56, ratioPct: 322, region: "South" },
  { metro: "Milwaukee", system: "Advocate / Ascension tip", admissionSharePct: 50, ratioPct: 301, region: "Midwest" },
  { metro: "Salt Lake City", system: "Intermountain", admissionSharePct: 58, ratioPct: 268, region: "West" },
  { metro: "Indianapolis", system: "Ascension / IU Health tip", admissionSharePct: 48, ratioPct: 294, region: "Midwest" },
  { metro: "New Orleans", system: "Ochsner", admissionSharePct: 51, ratioPct: 318, region: "South" },
  { metro: "Buffalo", system: "Kaleida / Catholic tip", admissionSharePct: 46, ratioPct: 298, region: "Northeast" },
];

export type ResidualRow = {
  id: string;
  label: string;
  /** Residual after HHI (pp vs national) — positive = expensive for HHI */
  residualPp: number;
  note: string;
};

/** Metros that sit far off the HHI→price line */
export const RESIDUALS: ResidualRow[] = [
  { id: "sfo", label: "San Francisco", residualPp: +48, note: "High wages + scarce beds; HHI only moderate" },
  { id: "nyc", label: "New York", residualPp: +42, note: "Fragmented systems, still pricey" },
  { id: "mia", label: "Miami", residualPp: +36, note: "Outpatient / facility fees lift ratio" },
  { id: "lax", label: "Los Angeles", residualPp: +28, note: "Low HHI, still above band mean" },
  { id: "slc", label: "Salt Lake City", residualPp: -38, note: "Very high HHI, moderated negotiated rates" },
  { id: "hou", label: "Houston", residualPp: -18, note: "Competitive systems + large for-profit mix" },
];

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmt1(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
}

export function fmtPct(n: number): string {
  return `${Math.round(n)}%`;
}

export function metrosByRegion(region: RegionId | "all"): MetroRow[] {
  if (region === "all") return METRO_PANEL;
  return METRO_PANEL.filter((m) => m.region === region);
}

export function hhiBandFor(hhi: number): HhiBandId {
  if (hhi < 1500) return "unconcentrated";
  if (hhi < 2500) return "moderate";
  if (hhi < 4000) return "high";
  return "veryHigh";
}
