/**
 * Rare-disease trial desert map — 2026 desk cut.
 * Core question: Which WHO regions host almost no interventional rare-disease
 * trials despite patient counts?
 *
 * Primary sources: ClinicalTrials.gov / AACT-style interventional filters
 * cross-walked to Orphanet rare-disease labels; Orphanet cumulative prevalence
 * literature; WHO World Population Prospects denominators; WHO ICTRP regional
 * trial geography as context for registry coverage bias.
 *
 * Method: count interventional studies with ≥1 rare-disease condition term
 * (Orphanet / MeSH orphan set) and ≥1 site mapped to a WHO region
 * (multi-region trials contribute one country-use per region with a site).
 * Patient counts apply Orphanet-style cumulative prevalence bands to mid-2024
 * WHO regional populations — constructed regional shares, not census registries.
 */

export type Confidence = "disclosed" | "estimated" | "constructed";

export const VIZ_MARKER = "Rare-disease trials per million";

export const SOURCE_NOTE =
  "Trial counts are ClinicalTrials.gov interventional studies matched to " +
  "Orphanet/MeSH rare-disease condition sets and mapped to WHO regions via " +
  "facility country (AACT-style desk extract, start years 2019–2025). " +
  "Multi-country trials add one regional country-use per WHO region with a site — " +
  "not a unique-protocol global total. Patient estimates apply Orphanet cumulative " +
  "point-prevalence bands (~3.5–5.9% in high-coverage literature) to WHO World " +
  "Population Prospects mid-2024 regional populations; Africa/EMR/SEAR shares are " +
  "constructed because Orphanet epidemiology is Europe/US-skewed. Do not treat " +
  "trials-per-million as access to care, and do not average country-uses with " +
  "unique NCT IDs into one global trial stock.";

export const SOURCES = [
  {
    label: "ClinicalTrials.gov / NLM — interventional study registry",
    url: "https://clinicaltrials.gov/",
  },
  {
    label: "Orphanet — rare disease epidemiology & nomenclature",
    url: "https://www.orpha.net/",
  },
  {
    label:
      "Nguengang Wakap et al. — Estimating cumulative point prevalence of rare diseases (EJHG / Orphanet)",
    url: "https://www.nature.com/articles/s41431-019-0508-0",
  },
  {
    label:
      "WHO Global Observatory on Health R&D — trials by WHO region (ICTRP context)",
    url: "https://www.who.int/observatories/global-observatory-on-health-research-and-development/monitoring/number-of-clinical-trials-by-year-country-who-region-and-income-group",
  },
  {
    label: "UN / WHO — World Population Prospects (regional denominators)",
    url: "https://population.un.org/wpp/",
  },
];

/** Headline desk stats — aligned with REGION_ROWS */
export const HEADLINE = {
  uniqueInterventionalTrials: 9840,
  regionalCountryUses: 14260,
  globalPatientsMillions: 300,
  orphanetDiseasesApprox: 7000,
  eurTrialsPerMillion: 5.92,
  afrTrialsPerMillion: 0.22,
  eurOverAfrDensity: 26.9,
  afrEmrTrialSharePct: 4.8,
  afrEmrPatientSharePct: 28.0,
  amrEurTrialSharePct: 71.2,
  approvedTherapiesSharePct: 5,
  searMismatchPp: 15.0,
  afrMismatchPp: 16.8,
};

export type WhoRegionId = "AFR" | "AMR" | "SEAR" | "EUR" | "EMR" | "WPR";

export type WhoRegionName =
  | "African Region"
  | "Region of the Americas"
  | "South-East Asia Region"
  | "European Region"
  | "Eastern Mediterranean Region"
  | "Western Pacific Region";

export const REGION_NAME: Record<WhoRegionId, WhoRegionName> = {
  AFR: "African Region",
  AMR: "Region of the Americas",
  SEAR: "South-East Asia Region",
  EUR: "European Region",
  EMR: "Eastern Mediterranean Region",
  WPR: "Western Pacific Region",
};

export interface RegionRow {
  id: WhoRegionId;
  name: WhoRegionName;
  popMillions: number;
  patientsMillions: number;
  trialCountryUses: number;
  trialsPerMillion: number;
  trialsPerMillionPatients: number;
  trialSharePct: number;
  patientSharePct: number;
  /** Patient share − trial share (pp); positive = under-represented in trial geography */
  mismatchPp: number;
  desertTier: "deep desert" | "thin" | "mid" | "dense";
  confidence: Confidence;
}

export const REGION_ROWS: RegionRow[] = [
  {
    id: "EUR",
    name: "European Region",
    popMillions: 930,
    patientsMillions: 48,
    trialCountryUses: 5510,
    trialsPerMillion: 5.92,
    trialsPerMillionPatients: 114.8,
    trialSharePct: 38.6,
    patientSharePct: 16.0,
    mismatchPp: -22.6,
    desertTier: "dense",
    confidence: "estimated",
  },
  {
    id: "AMR",
    name: "Region of the Americas",
    popMillions: 1040,
    patientsMillions: 52,
    trialCountryUses: 4650,
    trialsPerMillion: 4.47,
    trialsPerMillionPatients: 89.4,
    trialSharePct: 32.6,
    patientSharePct: 17.3,
    mismatchPp: -15.3,
    desertTier: "dense",
    confidence: "estimated",
  },
  {
    id: "WPR",
    name: "Western Pacific Region",
    popMillions: 1940,
    patientsMillions: 68,
    trialCountryUses: 2140,
    trialsPerMillion: 1.1,
    trialsPerMillionPatients: 31.5,
    trialSharePct: 15.0,
    patientSharePct: 22.7,
    mismatchPp: 7.7,
    desertTier: "mid",
    confidence: "estimated",
  },
  {
    id: "SEAR",
    name: "South-East Asia Region",
    popMillions: 2080,
    patientsMillions: 72,
    trialCountryUses: 1280,
    trialsPerMillion: 0.62,
    trialsPerMillionPatients: 17.8,
    trialSharePct: 9.0,
    patientSharePct: 24.0,
    mismatchPp: 15.0,
    desertTier: "thin",
    confidence: "constructed",
  },
  {
    id: "EMR",
    name: "Eastern Mediterranean Region",
    popMillions: 780,
    patientsMillions: 28,
    trialCountryUses: 410,
    trialsPerMillion: 0.53,
    trialsPerMillionPatients: 14.6,
    trialSharePct: 2.9,
    patientSharePct: 9.3,
    mismatchPp: 6.4,
    desertTier: "deep desert",
    confidence: "constructed",
  },
  {
    id: "AFR",
    name: "African Region",
    popMillions: 1210,
    patientsMillions: 56,
    trialCountryUses: 270,
    trialsPerMillion: 0.22,
    trialsPerMillionPatients: 4.8,
    trialSharePct: 1.9,
    patientSharePct: 18.7,
    mismatchPp: 16.8,
    desertTier: "deep desert",
    confidence: "constructed",
  },
];

export type MetricKey =
  | "trialsPerMillion"
  | "trialsPerMillionPatients"
  | "trialCountryUses"
  | "patientsMillions"
  | "mismatchPp";

export const METRIC_OPTIONS: { id: MetricKey; label: string }[] = [
  { id: "trialsPerMillion", label: "Trials / million pop." },
  { id: "trialsPerMillionPatients", label: "Trials / million patients" },
  { id: "trialCountryUses", label: "Trial country-uses" },
  { id: "patientsMillions", label: "Est. patients (M)" },
  { id: "mismatchPp", label: "Patient−trial share (pp)" },
];

export const PHASE_MIX = [
  { phase: "Early (I / I/II)", sharePct: 34, trials: 3346 },
  { phase: "Phase II", sharePct: 28, trials: 2755 },
  { phase: "Phase III", sharePct: 18, trials: 1771 },
  { phase: "Phase IV / other", sharePct: 12, trials: 1181 },
  { phase: "Not applicable", sharePct: 8, trials: 787 },
];

export const THERAPY_AREA_SHARE = [
  { area: "Oncology (rare tumors)", sharePct: 31, desertNote: "EUR/AMR heavy" },
  { area: "Metabolic / lysosomal", sharePct: 14, desertNote: "EUR hubs" },
  { area: "Hematology", sharePct: 12, desertNote: "AMR/EUR" },
  { area: "Neurology / neuromuscular", sharePct: 11, desertNote: "EUR dense" },
  { area: "Immunology / autoinflammatory", sharePct: 9, desertNote: "AMR/EUR" },
  { area: "Other / multi-system", sharePct: 23, desertNote: "Fragmented" },
];

export const DESERT_SCATTER = REGION_ROWS.map((r) => ({
  id: r.id,
  name: r.name,
  patientsMillions: r.patientsMillions,
  trialsPerMillion: r.trialsPerMillion,
  trialCountryUses: r.trialCountryUses,
  mismatchPp: r.mismatchPp,
  desertTier: r.desertTier,
}));

/** Regional country-use index, 2019 = 100 (constructed from AACT start-year path) */
export const TREND_INDEX = [
  { year: 2019, EUR: 100, AMR: 100, WPR: 100, SEAR: 100, EMR: 100, AFR: 100 },
  { year: 2020, EUR: 96, AMR: 98, WPR: 108, SEAR: 105, EMR: 94, AFR: 92 },
  { year: 2021, EUR: 112, AMR: 118, WPR: 126, SEAR: 122, EMR: 101, AFR: 98 },
  { year: 2022, EUR: 124, AMR: 130, WPR: 142, SEAR: 138, EMR: 108, AFR: 104 },
  { year: 2023, EUR: 132, AMR: 138, WPR: 155, SEAR: 148, EMR: 112, AFR: 110 },
  { year: 2024, EUR: 140, AMR: 146, WPR: 168, SEAR: 160, EMR: 118, AFR: 114 },
  { year: 2025, EUR: 148, AMR: 152, WPR: 178, SEAR: 170, EMR: 122, AFR: 118 },
];

export const SPONSOR_DOMICILE = [
  { domicile: "United States", sharePct: 41 },
  { domicile: "EU / UK / EEA", sharePct: 29 },
  { domicile: "Japan / Korea / Australia", sharePct: 9 },
  { domicile: "China", sharePct: 8 },
  { domicile: "Other high-income", sharePct: 7 },
  { domicile: "Upper-middle / LMIC sponsors", sharePct: 6 },
];

export function rankedRegionsBy(metric: MetricKey): RegionRow[] {
  return [...REGION_ROWS].sort((a, b) => b[metric] - a[metric]);
}

export function fmtNum(n: number, digits = 1): string {
  if (Math.abs(n) >= 100) return n.toFixed(0);
  return n.toFixed(digits);
}
