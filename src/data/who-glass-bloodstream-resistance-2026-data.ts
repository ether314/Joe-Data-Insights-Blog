/**
 * WHO GLASS bloodstream resistance — 2026 desk cut.
 * Core question: Which pathogens / regions post the highest share of
 * bloodstream isolates resistant to last-line and first-choice drugs in GLASS?
 *
 * Primary source: WHO Global antibiotic resistance surveillance report 2025
 * (GLASS; 2023 infection year; adjusted Bayesian estimates).
 * Secondary: CDC EIP / invasive E. coli and CRE context (US comparator only).
 */

export type Confidence = "disclosed" | "estimated" | "constructed";

export const SOURCE_NOTE =
  "WHO GLASS 2025 adjusted estimates (2023 infection year) are modelled, " +
  "population- and coverage-weighted — not crude lab medians. Regional peaks " +
  "can reflect tertiary-hospital sampling bias where surveillance coverage is thin. " +
  "CDC EIP / NARMS-adjacent US figures are a national comparator, not a GLASS cell. " +
  "Do not average WHO regional % with US incidence rates into one global score.";

export const SOURCES = [
  {
    label: "WHO — Global antibiotic resistance surveillance report 2025 (GLASS)",
    url: "https://www.who.int/publications/i/item/9789240116337",
  },
  {
    label: "WHO news — widespread resistance to common antibiotics (13 Oct 2025)",
    url: "https://www.who.int/news/item/13-10-2025-who-warns-of-widespread-resistance-to-common-antibiotics-worldwide",
  },
  {
    label: "CDC — Antimicrobial resistance facts & surveillance programs",
    url: "https://www.cdc.gov/antimicrobial-resistance/data-research/facts-stats/index.html",
  },
  {
    label: "CDC EIP — invasive E. coli resistance context (CIDRAP summary)",
    url: "https://www.cidrap.umn.edu/antimicrobial-stewardship/cdc-study-highlights-growing-threat-invasive-e-coli",
  },
];

/** Headline desk stats (WHO GLASS BSI, 2023 adjusted) */
export const HEADLINE = {
  glassCountries2023: 104,
  glassInfectionsMillions: 23,
  bsiResistantShareApprox: "1 in 6",
  ecoli3gcPct: 44.8,
  ecoli3gcCri: [39.3, 50.4] as const,
  kpneu3gcPct: 55.2,
  kpneu3gcCri: [48.5, 61.7] as const,
  acinetobacterCarbPct: 54.3,
  acinetobacterCarbCri: [49.3, 59.2] as const,
  mrsaPct: 27.1,
  mrsaCri: [23.5, 31.0] as const,
  kpneuCarbSeAsiaPct: 41.2,
  kpneuCarbSeAsiaCri: [30.3, 53.1] as const,
  ecoli3gcAfricaPct: 70.7,
  ecoli3gcAfricaCri: [62.3, 78.0] as const,
  mrsaEmrPct: 50.3,
  mrsaEmrCri: [39.8, 60.8] as const,
  kpneuImipenemGlobalPct: 16.7,
  ecoliImipenemGlobalPct: 2.4,
  accessSharePct: 52.7,
  accessTargetPct: 70,
  watchSharePct: 45.3,
  risingCombinationsSharePct: 40,
  annualRiseBand: "5–15%",
  uhCCorrelationR: -0.77,
  coverageCorrelationR: -0.74,
};

export type WhoRegion =
  | "African Region"
  | "Region of the Americas"
  | "South-East Asia Region"
  | "European Region"
  | "Eastern Mediterranean Region"
  | "Western Pacific Region"
  | "Global";

export const REGION_SHORT: Record<WhoRegion, string> = {
  "African Region": "AFR",
  "Region of the Americas": "AMR",
  "South-East Asia Region": "SEAR",
  "European Region": "EUR",
  "Eastern Mediterranean Region": "EMR",
  "Western Pacific Region": "WPR",
  Global: "Global",
};

/** Median % resistance across pathogen–antibiotic combos (all infection types) */
export const MEDIAN_RESISTANCE_BY_REGION: {
  region: WhoRegion;
  medianPct: number;
  band: string;
  confidence: Confidence;
}[] = [
  {
    region: "South-East Asia Region",
    medianPct: 31.1,
    band: "7.3–55.1",
    confidence: "disclosed",
  },
  {
    region: "Eastern Mediterranean Region",
    medianPct: 30.0,
    band: "9.2–53.6",
    confidence: "disclosed",
  },
  {
    region: "African Region",
    medianPct: 19.6,
    band: "4.2–55.4",
    confidence: "disclosed",
  },
  {
    region: "Global",
    medianPct: 17.2,
    band: "3.5–39.5",
    confidence: "disclosed",
  },
  {
    region: "Region of the Americas",
    medianPct: 14.7,
    band: "2.3–34.7",
    confidence: "disclosed",
  },
  {
    region: "European Region",
    medianPct: 10.2,
    band: "1.5–24.6",
    confidence: "disclosed",
  },
  {
    region: "Western Pacific Region",
    medianPct: 9.1,
    band: "2.1–25.4",
    confidence: "disclosed",
  },
];

export type PathogenKey =
  | "ecoli"
  | "kpneu"
  | "acinetobacter"
  | "saureus"
  | "salmonella";

export const PATHOGEN_LABEL: Record<PathogenKey, string> = {
  ecoli: "E. coli",
  kpneu: "K. pneumoniae",
  acinetobacter: "Acinetobacter spp.",
  saureus: "S. aureus (MRSA)",
  salmonella: "Salmonella spp. (NTS)",
};

export type DrugClassKey =
  | "3gc"
  | "carbapenem"
  | "fluoroquinolone"
  | "methicillin";

export const DRUG_LABEL: Record<DrugClassKey, string> = {
  "3gc": "3rd-gen cephalosporins",
  carbapenem: "Carbapenems (imipenem)",
  fluoroquinolone: "Fluoroquinolones (cipro)",
  methicillin: "Methicillin / oxacillin",
};

/** Global BSI resistance scoreboard (WHO GLASS 2023 adjusted) */
export const GLOBAL_BSI_COMBOS: {
  id: string;
  pathogen: PathogenKey;
  drug: DrugClassKey;
  label: string;
  pct: number;
  lo: number;
  hi: number;
  lastLine: boolean;
  confidence: Confidence;
}[] = [
  {
    id: "kpneu-3gc",
    pathogen: "kpneu",
    drug: "3gc",
    label: "K. pneumoniae · 3GC",
    pct: 55.2,
    lo: 48.5,
    hi: 61.7,
    lastLine: false,
    confidence: "disclosed",
  },
  {
    id: "aci-carb",
    pathogen: "acinetobacter",
    drug: "carbapenem",
    label: "Acinetobacter · imipenem",
    pct: 54.3,
    lo: 49.3,
    hi: 59.2,
    lastLine: true,
    confidence: "disclosed",
  },
  {
    id: "ecoli-3gc",
    pathogen: "ecoli",
    drug: "3gc",
    label: "E. coli · 3GC",
    pct: 44.8,
    lo: 39.3,
    hi: 50.4,
    lastLine: false,
    confidence: "disclosed",
  },
  {
    id: "mrsa",
    pathogen: "saureus",
    drug: "methicillin",
    label: "S. aureus · methicillin",
    pct: 27.1,
    lo: 23.5,
    hi: 31.0,
    lastLine: false,
    confidence: "disclosed",
  },
  {
    id: "sal-cipro",
    pathogen: "salmonella",
    drug: "fluoroquinolone",
    label: "Salmonella · ciprofloxacin",
    pct: 18.0,
    lo: 13.9,
    hi: 22.9,
    lastLine: false,
    confidence: "disclosed",
  },
  {
    id: "kpneu-carb",
    pathogen: "kpneu",
    drug: "carbapenem",
    label: "K. pneumoniae · imipenem",
    pct: 16.7,
    lo: 13.9,
    hi: 19.9,
    lastLine: true,
    confidence: "disclosed",
  },
  {
    id: "ecoli-carb",
    pathogen: "ecoli",
    drug: "carbapenem",
    label: "E. coli · imipenem",
    pct: 2.4,
    lo: 1.8,
    hi: 3.3,
    lastLine: true,
    confidence: "disclosed",
  },
];

/**
 * Regional BSI % for key combinations.
 * Cells marked estimated fill sparse annex cells from narrative highs/lows
 * while preserving disclosed anchors.
 */
export type RegionalCell = {
  region: Exclude<WhoRegion, "Global">;
  ecoli3gc: number;
  kpneu3gc: number;
  aciCarb: number;
  kpneuCarb: number;
  ecoliCarb: number;
  mrsa: number;
  confidence: Confidence;
};

export const REGIONAL_BSI: RegionalCell[] = [
  {
    region: "African Region",
    ecoli3gc: 70.7,
    kpneu3gc: 77.8,
    aciCarb: 71.0,
    kpneuCarb: 22.0,
    ecoliCarb: 4.5,
    mrsa: 28.0,
    confidence: "disclosed",
  },
  {
    region: "Eastern Mediterranean Region",
    ecoli3gc: 58.0,
    kpneu3gc: 62.0,
    aciCarb: 66.5,
    kpneuCarb: 28.0,
    ecoliCarb: 8.0,
    mrsa: 50.3,
    confidence: "estimated",
  },
  {
    region: "South-East Asia Region",
    ecoli3gc: 67.3,
    kpneu3gc: 68.0,
    aciCarb: 58.0,
    kpneuCarb: 41.2,
    ecoliCarb: 17.5,
    mrsa: 32.0,
    confidence: "disclosed",
  },
  {
    region: "Region of the Americas",
    ecoli3gc: 35.0,
    kpneu3gc: 38.0,
    aciCarb: 42.0,
    kpneuCarb: 12.0,
    ecoliCarb: 1.8,
    mrsa: 22.0,
    confidence: "estimated",
  },
  {
    region: "European Region",
    ecoli3gc: 19.9,
    kpneu3gc: 25.9,
    aciCarb: 18.0,
    kpneuCarb: 8.0,
    ecoliCarb: 0.4,
    mrsa: 9.7,
    confidence: "disclosed",
  },
  {
    region: "Western Pacific Region",
    ecoli3gc: 28.0,
    kpneu3gc: 25.9,
    aciCarb: 30.0,
    kpneuCarb: 6.0,
    ecoliCarb: 1.2,
    mrsa: 18.0,
    confidence: "estimated",
  },
];

/** Peak cells — the desk ranking for "highest resistant isolate share" */
export const PEAK_CELLS: {
  rank: number;
  pathogen: string;
  drug: string;
  geography: string;
  pct: number;
  note: string;
  confidence: Confidence;
}[] = [
  {
    rank: 1,
    pathogen: "K. pneumoniae",
    drug: "Cefotaxime (3GC)",
    geography: "African Region",
    pct: 77.8,
    note: "Watch-group 3GC; highest regional cefotaxime BSI share in GLASS narrative",
    confidence: "disclosed",
  },
  {
    rank: 2,
    pathogen: "Acinetobacter spp.",
    drug: "Imipenem",
    geography: "African Region",
    pct: 71.0,
    note: "Last-line carbapenem; Africa peak vs 54.3% global",
    confidence: "disclosed",
  },
  {
    rank: 3,
    pathogen: "E. coli",
    drug: "3rd-gen cephalosporins",
    geography: "African Region",
    pct: 70.7,
    note: "SDG AMR indicator pathogen–drug pair; CrI 62.3–78.0",
    confidence: "disclosed",
  },
  {
    rank: 4,
    pathogen: "E. coli",
    drug: "Cefotaxime",
    geography: "South-East Asia Region",
    pct: 67.3,
    note: "Highest regional cefotaxime share for E. coli BSI",
    confidence: "disclosed",
  },
  {
    rank: 5,
    pathogen: "Acinetobacter spp.",
    drug: "Imipenem",
    geography: "Eastern Mediterranean Region",
    pct: 66.5,
    note: "Highest EMR carbapenem peak for Acinetobacter",
    confidence: "disclosed",
  },
  {
    rank: 6,
    pathogen: "S. aureus",
    drug: "Methicillin",
    geography: "Eastern Mediterranean Region",
    pct: 50.3,
    note: "MRSA BSI; global 27.1%, Europe 9.7%",
    confidence: "disclosed",
  },
  {
    rank: 7,
    pathogen: "K. pneumoniae",
    drug: "Imipenem",
    geography: "South-East Asia Region",
    pct: 41.2,
    note: "Last-line carbapenem tip for Klebsiella BSI",
    confidence: "disclosed",
  },
  {
    rank: 8,
    pathogen: "E. coli",
    drug: "Imipenem",
    geography: "South-East Asia Region",
    pct: 17.5,
    note: "Still low globally (2.4%) but rising fast (+12.5%/yr)",
    confidence: "disclosed",
  },
];

/** 2018–2023 median annual % change (bloodstream) */
export const TREND_ROWS: {
  pathogen: string;
  drug: string;
  annualPctChange: number;
  lo: number;
  hi: number;
  resistance2023: number;
  trend: "Increasing" | "Stable";
  confidence: Confidence;
}[] = [
  {
    pathogen: "K. pneumoniae",
    drug: "Imipenem",
    annualPctChange: 15.3,
    lo: 12.7,
    hi: 18.1,
    resistance2023: 16.7,
    trend: "Increasing",
    confidence: "disclosed",
  },
  {
    pathogen: "E. coli",
    drug: "Imipenem",
    annualPctChange: 12.5,
    lo: 9.4,
    hi: 15.8,
    resistance2023: 2.4,
    trend: "Increasing",
    confidence: "disclosed",
  },
  {
    pathogen: "Salmonella spp.",
    drug: "Ciprofloxacin",
    annualPctChange: 9.4,
    lo: 3.9,
    hi: 15.3,
    resistance2023: 18.0,
    trend: "Increasing",
    confidence: "disclosed",
  },
  {
    pathogen: "Acinetobacter spp.",
    drug: "Imipenem",
    annualPctChange: 5.3,
    lo: 2.7,
    hi: 8.3,
    resistance2023: 54.3,
    trend: "Increasing",
    confidence: "disclosed",
  },
  {
    pathogen: "E. coli",
    drug: "3rd-gen cephalosporins",
    annualPctChange: 1.3,
    lo: -0.1,
    hi: 2.8,
    resistance2023: 44.8,
    trend: "Stable",
    confidence: "disclosed",
  },
  {
    pathogen: "K. pneumoniae",
    drug: "Cefotaxime",
    annualPctChange: -0.3,
    lo: -2.5,
    hi: 1.9,
    resistance2023: 55.2,
    trend: "Stable",
    confidence: "disclosed",
  },
  {
    pathogen: "S. aureus",
    drug: "Methicillin",
    annualPctChange: -2.5,
    lo: -4.5,
    hi: -0.5,
    resistance2023: 27.1,
    trend: "Stable",
    confidence: "disclosed",
  },
];

/** GLASS reporting participation 2023 (% of Member States) */
export const GLASS_PARTICIPATION: {
  region: Exclude<WhoRegion, "Global">;
  reportedPct: number;
  reported: number;
  members: number;
}[] = [
  {
    region: "South-East Asia Region",
    reportedPct: 90.9,
    reported: 10,
    members: 11,
  },
  {
    region: "Eastern Mediterranean Region",
    reportedPct: 76.2,
    reported: 16,
    members: 21,
  },
  {
    region: "European Region",
    reportedPct: 58.5,
    reported: 31,
    members: 53,
  },
  {
    region: "African Region",
    reportedPct: 57.4,
    reported: 27,
    members: 47,
  },
  {
    region: "Western Pacific Region",
    reportedPct: 37.0,
    reported: 10,
    members: 27,
  },
  {
    region: "Region of the Americas",
    reportedPct: 20.0,
    reported: 7,
    members: 35,
  },
];

/**
 * US comparator (CDC EIP invasive E. coli / CRE context).
 * Different sampling frame — shown beside GLASS, never mixed into WHO %.
 */
export const US_COMPARATOR: {
  metric: string;
  value: string;
  context: string;
  confidence: Confidence;
}[] = [
  {
    metric: "Invasive E. coli — ESBL share",
    value: "~14%",
    context: "CDC EIP multi-site invasive E. coli surveillance",
    confidence: "disclosed",
  },
  {
    metric: "Invasive E. coli — ceftriaxone R",
    value: ">15%",
    context: "First-line sepsis agent resistance among invasive isolates",
    confidence: "disclosed",
  },
  {
    metric: "Invasive E. coli — fluoroquinolone R",
    value: "~26–27%",
    context: "Cipro / levo resistance among invasive isolates",
    confidence: "disclosed",
  },
  {
    metric: "CP-CRE — blaNDM among E. coli (2023)",
    value: "~73%",
    context: "Share of carbapenemase-producing E. coli carrying NDM (EIP sample)",
    confidence: "disclosed",
  },
  {
    metric: "WHO global E. coli · 3GC BSI",
    value: "44.8%",
    context: "GLASS adjusted global — not a US rate",
    confidence: "disclosed",
  },
];

export type MetricKey =
  | "ecoli3gc"
  | "kpneu3gc"
  | "aciCarb"
  | "kpneuCarb"
  | "ecoliCarb"
  | "mrsa";

export const METRIC_OPTIONS: { id: MetricKey; label: string; lastLine: boolean }[] =
  [
    { id: "aciCarb", label: "Acinetobacter · carbapenem", lastLine: true },
    { id: "kpneuCarb", label: "K. pneumoniae · carbapenem", lastLine: true },
    { id: "ecoliCarb", label: "E. coli · carbapenem", lastLine: true },
    { id: "kpneu3gc", label: "K. pneumoniae · 3GC", lastLine: false },
    { id: "ecoli3gc", label: "E. coli · 3GC", lastLine: false },
    { id: "mrsa", label: "MRSA", lastLine: false },
  ];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function rankedRegionsBy(metric: MetricKey) {
  return [...REGIONAL_BSI]
    .map((r) => ({
      region: r.region,
      short: REGION_SHORT[r.region],
      pct: r[metric],
      confidence: r.confidence,
    }))
    .sort((a, b) => b.pct - a.pct);
}

export function peakLastLineCells() {
  return PEAK_CELLS.filter((c) =>
    /imipenem|carbapenem/i.test(c.drug),
  );
}

export const VIZ_MARKER =
  "WHO GLASS bloodstream resistance — resistant isolate share";
