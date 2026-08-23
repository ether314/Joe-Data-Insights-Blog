/**
 * US generic sterile injectable shortages (2026).
 *
 * Core question: What share of active US drug shortages are sterile
 * injectables, and how many manufacturing sites stand between patients
 * and empty shelves?
 *
 * Primary anchors: USP Annual Drug Shortages Report (end-2025 / published
 * Jun 2026) — 75 active shortages, 71% sterile injectable; ASHP / University
 * of Utah Drug Information Service Q2 2026 — 227 active molecule-level
 * shortages; FDA Drug Shortages database (presentation-level); USP Medicine
 * Supply Map / Vulnerable Medicines List (KSM concentration, injectable
 * share of vulnerability); Pfizer/FDA Rocky Mount disclosures (~8% of US
 * hospital sterile injectable volume from one site).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Desk synthesis of USP 2026 Annual Drug Shortages Report (FDA CDER shortage list mapped through USP Medicine Supply Map as of 31 Dec 2025), ASHP/University of Utah Drug Information Service quarterly shortage tallies through Q2 2026, FDA Drug Shortages presentation-level registry summaries, USP 2025 Vulnerable Medicines List (KSM module), and public FDA/Pfizer disclosures on Rocky Mount sterile-injectable capacity. USP molecule-level counts (75 active; 71% injectable) are not interchangeable with ASHP molecule-level counts (~227) or FDA NDC/presentation-level entries. Manufacturer entry counts and site-redundancy buckets mix disclosed registry tallies with analytical share estimates — labeled where carried. Not a clinical allocation guide.";

export const SOURCES = [
  {
    label: "USP — 2026 Annual Drug Shortages Report (71% sterile injectables)",
    url: "https://www.usp.org/news/usp-2026-annual-drug-shortages-report-rising-discontinuations-supply-chain-risk",
  },
  {
    label: "USP Medicine Supply Map",
    url: "https://www.usp.org/supply-chain/medicine-supply-map",
  },
  {
    label: "ASHP / University of Utah — National drug shortages statistics",
    url: "https://www.ashp.org/drug-shortages/shortage-resources/drug-shortages-statistics",
  },
  {
    label: "FDA — Drug Shortages database",
    url: "https://www.accessdata.fda.gov/scripts/drugshortages/default.cfm",
  },
  {
    label: "FDA — Rocky Mount sterile injectable supply update (Jul 2023)",
    url: "https://www.fda.gov/news-events/press-announcements/fda-provides-update-regarding-storm-damage-pfizer-facility-north-carolina",
  },
] as const;

/** Headline punchline — injectable share of active USP-mapped shortages */
export const HEADLINE = {
  injectableSharePct: 71,
  oralSolidSharePct: 16,
  otherFormSharePct: 13,
  uspActiveEnd2025: 75,
  uspInjectablesApprox: 53,
  ashpActiveQ2_2026: 227,
  ashpActiveQ1_2026: 223,
  ashpActiveEnd2025: 216,
  ashpPeakQ1_2024: 323,
  avgDurationYears: 5.3,
  avgDurationYears2024: 4.3,
  avgDurationYears2019: 2.0,
  shareShortOver3YearsPct: 64,
  shareShortOver5YearsPct: 39,
  newShortages2025: 4,
  discontinuations2025: 170,
  discontinuationsYoYPct: 60,
  soleSourceNew2026Pct: 48,
  ksmSingleCountryShortagePct: 44,
  vmlInjectableSharePct: 63,
  vmlSingleCountryKsmPct: 48,
  rockyMountUsHospitalSiPct: 8,
  pfizerUsHospitalSiSharePct: 33,
  top3MfrActiveEntries: 423,
  hospiraActiveEntries: 166,
  freseniusActiveEntries: 160,
  hikmaActiveEntries: 97,
  usInjectableVolumeSharePct: 47,
  usInjectableShortageVolumeSharePct: 57,
  indiaInjectableVolumeSharePct: 16,
  indiaInjectableShortageVolumeSharePct: 26,
  euInjectableVolumeSharePct: 20,
  euInjectableShortageVolumeSharePct: 5,
} as const;

/** Dosage-form mix of USP-mapped active shortages (end-2025) */
export const DOSAGE_FORM_MIX: {
  id: string;
  label: string;
  sharePct: number;
  countApprox: number;
  confidence: Confidence;
}[] = [
  {
    id: "sterile_injectable",
    label: "Sterile injectable",
    sharePct: 71,
    countApprox: 53,
    confidence: "disclosed",
  },
  {
    id: "oral_solid",
    label: "Oral solid",
    sharePct: 16,
    countApprox: 12,
    confidence: "disclosed",
  },
  {
    id: "other",
    label: "Other forms",
    sharePct: 13,
    countApprox: 10,
    confidence: "disclosed",
  },
];

/** ASHP active shortage path + USP injectable share anchors */
export const SHORTAGE_PATH: {
  period: string;
  year: number;
  quarter: number | null;
  ashpActive: number;
  uspActive: number | null;
  injectableSharePct: number;
  confidence: Confidence;
}[] = [
  { period: "2019", year: 2019, quarter: null, ashpActive: 186, uspActive: null, injectableSharePct: 62, confidence: "carried" },
  { period: "2020", year: 2020, quarter: null, ashpActive: 214, uspActive: null, injectableSharePct: 64, confidence: "carried" },
  { period: "2021", year: 2021, quarter: null, ashpActive: 250, uspActive: null, injectableSharePct: 65, confidence: "carried" },
  { period: "2022", year: 2022, quarter: null, ashpActive: 295, uspActive: null, injectableSharePct: 66, confidence: "carried" },
  { period: "2023", year: 2023, quarter: null, ashpActive: 309, uspActive: null, injectableSharePct: 67, confidence: "estimated" },
  { period: "2024 Q1", year: 2024, quarter: 1, ashpActive: 323, uspActive: null, injectableSharePct: 68, confidence: "estimated" },
  { period: "2024 YE", year: 2024, quarter: 4, ashpActive: 270, uspActive: 98, injectableSharePct: 69, confidence: "estimated" },
  { period: "2025 YE", year: 2025, quarter: 4, ashpActive: 216, uspActive: 75, injectableSharePct: 71, confidence: "disclosed" },
  { period: "2026 Q1", year: 2026, quarter: 1, ashpActive: 223, uspActive: null, injectableSharePct: 71, confidence: "estimated" },
  { period: "2026 Q2", year: 2026, quarter: 2, ashpActive: 227, uspActive: null, injectableSharePct: 71, confidence: "estimated" },
];

/** Duration bands among USP-mapped active shortages (end-2025) */
export const DURATION_BANDS: {
  id: string;
  label: string;
  sharePct: number;
  confidence: Confidence;
}[] = [
  { id: "under3", label: "< 3 years", sharePct: 36, confidence: "disclosed" },
  { id: "3to5", label: "3–5 years", sharePct: 25, confidence: "estimated" },
  { id: "over5", label: "> 5 years", sharePct: 39, confidence: "disclosed" },
];

/**
 * Analytical ANDA/site redundancy for new 2026 shortages.
 * ASHP: 48% of new 2026 shortages are sole-source (single manufacturer).
 * Remaining split estimated between dual- and multi-source — labeled carried.
 */
export const SITE_REDUNDANCY: {
  id: string;
  label: string;
  sitesLabel: string;
  sharePct: number;
  confidence: Confidence;
}[] = [
  {
    id: "sole",
    label: "Sole-source",
    sitesLabel: "1 manufacturer",
    sharePct: 48,
    confidence: "disclosed",
  },
  {
    id: "dual",
    label: "Dual-source",
    sitesLabel: "2 manufacturers",
    sharePct: 27,
    confidence: "carried",
  },
  {
    id: "multi",
    label: "Multi-source",
    sitesLabel: "3+ manufacturers",
    sharePct: 25,
    confidence: "carried",
  },
];

/** Top manufacturers by active FDA presentation-level shortage entries */
export const MANUFACTURER_LADDER: {
  id: string;
  label: string;
  activeEntries: number;
  shareOfTopLadderPct: number;
  note: string;
  confidence: Confidence;
}[] = [
  {
    id: "hospira",
    label: "Hospira (Pfizer)",
    activeEntries: 166,
    shareOfTopLadderPct: 39,
    note: "Rocky Mount ~8% of US hospital sterile injectables",
    confidence: "estimated",
  },
  {
    id: "fresenius",
    label: "Fresenius Kabi",
    activeEntries: 160,
    shareOfTopLadderPct: 38,
    note: "Hospital injectables & clinical nutrition",
    confidence: "estimated",
  },
  {
    id: "hikma",
    label: "Hikma USA",
    activeEntries: 97,
    shareOfTopLadderPct: 23,
    note: "Generic injectables portfolio",
    confidence: "estimated",
  },
];

/** Finished-dose geography: volume share vs shortage-volume share (injectables) */
export const GEO_INJECTABLE: {
  id: string;
  label: string;
  volumeSharePct: number;
  shortageVolumeSharePct: number;
  confidence: Confidence;
}[] = [
  {
    id: "us",
    label: "United States",
    volumeSharePct: 47,
    shortageVolumeSharePct: 57,
    confidence: "disclosed",
  },
  {
    id: "eu",
    label: "European Union",
    volumeSharePct: 20,
    shortageVolumeSharePct: 5,
    confidence: "disclosed",
  },
  {
    id: "india",
    label: "India",
    volumeSharePct: 16,
    shortageVolumeSharePct: 26,
    confidence: "disclosed",
  },
  {
    id: "row",
    label: "Rest of world",
    volumeSharePct: 17,
    shortageVolumeSharePct: 12,
    confidence: "carried",
  },
];

/** Upstream KSM concentration flags */
export const UPSTREAM_FLAGS: {
  id: string;
  label: string;
  valuePct: number;
  universe: string;
  confidence: Confidence;
}[] = [
  {
    id: "shortage_ksm",
    label: "Shortage drugs with ≥1 single-country KSM",
    valuePct: 44,
    universe: "USP-mapped active shortages",
    confidence: "disclosed",
  },
  {
    id: "vml_ksm",
    label: "Vulnerable list with ≥1 single-country KSM",
    valuePct: 48,
    universe: "USP 2025 Vulnerable Medicines List (n=100)",
    confidence: "disclosed",
  },
  {
    id: "vml_injectable",
    label: "Vulnerable list that are injectables",
    valuePct: 63,
    universe: "USP 2025 Vulnerable Medicines List (n=100)",
    confidence: "disclosed",
  },
  {
    id: "vml_not_short",
    label: "Vulnerable list not currently in shortage",
    valuePct: 70,
    universe: "USP 2025 Vulnerable Medicines List (n=100)",
    confidence: "disclosed",
  },
];

/** Therapeutic / hospital-use stress categories (analytical shares of injectable tip) */
export const THERAPY_STRESS: {
  id: string;
  label: string;
  stressIndex: number;
  note: string;
  confidence: Confidence;
}[] = [
  {
    id: "anesthesia",
    label: "Anesthesia / neuromuscular",
    stressIndex: 92,
    note: "Recurring OR / ICU allocation pressure",
    confidence: "carried",
  },
  {
    id: "chemo",
    label: "Injectable oncology",
    stressIndex: 88,
    note: "Curative regimens sensitive to sole suppliers",
    confidence: "estimated",
  },
  {
    id: "antiinfective",
    label: "Injectable anti-infectives",
    stressIndex: 78,
    note: "Hospital stewardship + thin margins",
    confidence: "carried",
  },
  {
    id: "analgesia",
    label: "Injectable analgesia",
    stressIndex: 74,
    note: "Controlled-substance + sterile fill overlap",
    confidence: "carried",
  },
  {
    id: "contrast",
    label: "Contrast / imaging agents",
    stressIndex: 70,
    note: "~10% of new 2026 shortages (ASHP)",
    confidence: "estimated",
  },
  {
    id: "electrolyte",
    label: "Electrolytes / nutrition",
    stressIndex: 66,
    note: "High-volume hospital staples",
    confidence: "carried",
  },
];

/** Single-site exposure vignettes (disclosed capacity facts) */
export const SITE_EXPOSURE: {
  id: string;
  label: string;
  metricLabel: string;
  value: number;
  unit: string;
  note: string;
  confidence: Confidence;
}[] = [
  {
    id: "rocky_mount",
    label: "Pfizer Rocky Mount, NC",
    metricLabel: "US hospital sterile-injectable volume",
    value: 8,
    unit: "%",
    note: "One plant ≈ 8% of hospital SI supply (FDA/Pfizer 2023)",
    confidence: "disclosed",
  },
  {
    id: "pfizer_si",
    label: "Pfizer SI franchise",
    metricLabel: "US hospital sterile-injectable market",
    value: 33,
    unit: "%",
    note: "Rocky Mount ≈ 25% of Pfizer’s US hospital SI",
    confidence: "disclosed",
  },
  {
    id: "sole_new",
    label: "New 2026 shortages",
    metricLabel: "Sole-source products",
    value: 48,
    unit: "%",
    note: "ASHP: nearly half of new shortages have one maker",
    confidence: "disclosed",
  },
  {
    id: "top3_entries",
    label: "Top-3 SI manufacturers",
    metricLabel: "Active presentation entries (desk sum)",
    value: 423,
    unit: "entries",
    note: "Hospira + Fresenius + Hikma registry concentration",
    confidence: "estimated",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}
