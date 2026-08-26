/**
 * NID high-hazard potential dams without emergency action plans (2026 desk).
 *
 * Core question: What share of NID high-hazard potential dams still have no
 * emergency action plan?
 *
 * Anchors (published):
 * - ASCE Infrastructure Report Card — Dams (2025 print): >16,700 high-hazard
 *   potential dams (Aug 2024); ~82% of state-regulated high-hazard dams have an
 *   EAP; more than 11,000 such dams have an EAP on file; ~15% / >2,500 high-
 *   hazard dams in poor or unsatisfactory condition; HHP inventory +20% since
 *   2012; non-federal rehab need $165.2B ($37.4B for non-federal HHP).
 * - CRS R45981 (2019): state-regulated HHP EAP share rose from 35% (1999) to
 *   80% (2018); 2018 federal-owned HHP EAP share 74% vs 80% state-regulated.
 * - FEMA P-608 / ASDSO historical program metrics: ~49% EAP share circa
 *   2004–05 among state-regulated HHP; ASDSO annuals track 75% by 2014.
 * - USACE National Inventory of Dams (NID) + FEMA NDSP: inventory framing for
 *   high / significant / low hazard potential classifications.
 *
 * State and census-division gap rows are desk composites calibrated so the
 * implied national state-regulated gap stays near the published ~18% without
 * an EAP. They preserve ordinal structure for visualization; they are not a
 * substitute for the live NID EAP field extract.
 */

export const SOURCE_NOTE =
  "National EAP coverage (~82% of state-regulated high-hazard potential dams with an EAP; >11,000 dams) and inventory counts (>16,700 HHP as of Aug 2024) follow ASCE Dams 2025 citing ASDSO/NID program metrics. Historical EAP shares (35% in 1999 → 80% in 2018; federal 74% vs state 80% in 2018) follow CRS R45981. Mid-2000s ~49% share follows FEMA P-608. Division and illustrative state gap rows are desk composites scaled to the published national residual (~18% without an EAP) — ordinal exposure structure, not audited NID row extracts.";

export const SOURCES = [
  {
    label: "ASCE — Dams infrastructure report card",
    url: "https://infrastructurereportcard.org/cat-item/dams-infrastructure/",
  },
  {
    label: "USACE — National Inventory of Dams",
    url: "https://nid.sec.usace.army.mil/",
  },
  {
    label: "FEMA — National Inventory of Dams overview",
    url: "https://www.fema.gov/grants/mitigation/learn/dam-safety/national-inventory-dams",
  },
  {
    label: "ASDSO — Dam safety (state programs)",
    url: "https://www.damsafety.org/",
  },
  {
    label: "CRS — Dam Safety Overview and the Federal Role (R45981)",
    url: "https://www.everycrsreport.com/reports/R45981.html",
  },
  {
    label: "FEMA P-608 — Emergency Action Planning for State-Regulated HHP Dams",
    url: "https://damfailures.org/sites/default/files/wp-pdf/Emergency-Action-Planning-for-State-Regulated-High-Hazard-Potential-Dams.pdf",
  },
] as const;

/** Headline punchline for the 2024 reference panel */
export const HEADLINE = {
  /** ASCE Aug 2024 HHP inventory */
  nidHighHazard: 16700,
  /** Implied state-regulated HHP from >11,000 with EAP at ~82% */
  stateRegulatedHhp: 13415,
  stateRegulatedWithEap: 11000,
  stateRegulatedWithoutEap: 2415,
  eapSharePct: 82,
  withoutEapSharePct: 18,
  /** ASCE condition share among HHP */
  poorOrUnsatisfactoryPct: 15,
  poorOrUnsatisfactoryCount: 2500,
  /** Inventory growth since 2012 */
  hhpGrowthSince2012Pct: 20,
  /** 2018 federal vs state EAP shares (CRS) */
  federalEapShare2018Pct: 74,
  stateEapShare2018Pct: 80,
  /** ASDSO rehab need ($B) */
  nonFederalRehabNeedBb: 165.2,
  nonFederalHhpRehabNeedBb: 37.4,
  avgDamAgeYears: 64,
  nidTotalDams: 92000,
} as const;

export const VIZ_MARKERS = [
  "High-hazard dams lacking an EAP",
  "18% of state-regulated HHP still without an EAP",
] as const;

export type Confidence = "asce" | "crs" | "fema" | "asdso" | "composite";

export type CensusDivision =
  | "New England"
  | "Middle Atlantic"
  | "East North Central"
  | "West North Central"
  | "South Atlantic"
  | "East South Central"
  | "West South Central"
  | "Mountain"
  | "Pacific";

/** National EAP coverage status for state-regulated HHP (2024 ASCE frame) */
export const EAP_STATUS_SPLIT = [
  {
    id: "with-eap",
    label: "With EAP on file",
    dams: HEADLINE.stateRegulatedWithEap,
    sharePct: HEADLINE.eapSharePct,
    color: "#0d9488",
  },
  {
    id: "without-eap",
    label: "No EAP on file",
    dams: HEADLINE.stateRegulatedWithoutEap,
    sharePct: HEADLINE.withoutEapSharePct,
    color: "#e11d48",
  },
] as const;

/** Historical share of state-regulated HHP with an EAP */
export const EAP_COVERAGE_TREND: Array<{
  year: number;
  eapSharePct: number;
  withoutSharePct: number;
  confidence: Confidence;
  note: string;
}> = [
  {
    year: 1999,
    eapSharePct: 35,
    withoutSharePct: 65,
    confidence: "crs",
    note: "CRS R45981 baseline",
  },
  {
    year: 2005,
    eapSharePct: 49,
    withoutSharePct: 51,
    confidence: "fema",
    note: "FEMA P-608 / NID update era",
  },
  {
    year: 2012,
    eapSharePct: 69,
    withoutSharePct: 31,
    confidence: "composite",
    note: "Interpolated between FEMA mid-2000s and ASDSO mid-2010s prints",
  },
  {
    year: 2014,
    eapSharePct: 75,
    withoutSharePct: 25,
    confidence: "asdso",
    note: "ASDSO annual program metrics",
  },
  {
    year: 2017,
    eapSharePct: 77,
    withoutSharePct: 23,
    confidence: "asce",
    note: "ASCE 2021 Dams card prior-year print",
  },
  {
    year: 2018,
    eapSharePct: 80,
    withoutSharePct: 20,
    confidence: "crs",
    note: "CRS R45981 state-regulated share",
  },
  {
    year: 2021,
    eapSharePct: 82,
    withoutSharePct: 18,
    confidence: "asce",
    note: "ASCE prior print (≈2024)",
  },
  {
    year: 2024,
    eapSharePct: 82,
    withoutSharePct: 18,
    confidence: "asce",
    note: "ASCE 2025 Dams card",
  },
];

/** 2018 ownership-regime comparison (CRS) plus 2024 state-regulated print */
export const OWNERSHIP_EAP_COMPARE = [
  {
    id: "federal-2018",
    regime: "Federally owned HHP",
    year: 2018,
    eapSharePct: 74,
    withoutSharePct: 26,
    confidence: "crs" as Confidence,
  },
  {
    id: "state-2018",
    regime: "State-regulated HHP",
    year: 2018,
    eapSharePct: 80,
    withoutSharePct: 20,
    confidence: "crs" as Confidence,
  },
  {
    id: "state-2024",
    regime: "State-regulated HHP",
    year: 2024,
    eapSharePct: 82,
    withoutSharePct: 18,
    confidence: "asce" as Confidence,
  },
];

/**
 * Census-division composites for state-regulated HHP EAP gaps.
 * Counts sum to HEADLINE.stateRegulatedHhp; without-EAP sum ≈ 2415.
 */
export const DIVISION_EAP_GAPS: Array<{
  id: string;
  division: CensusDivision;
  hhpDams: number;
  withEap: number;
  withoutEap: number;
  eapSharePct: number;
  withoutSharePct: number;
  confidence: Confidence;
}> = [
  {
    id: "ne",
    division: "New England",
    hhpDams: 920,
    withEap: 828,
    withoutEap: 92,
    eapSharePct: 90,
    withoutSharePct: 10,
    confidence: "composite",
  },
  {
    id: "ma",
    division: "Middle Atlantic",
    hhpDams: 1480,
    withEap: 1258,
    withoutEap: 222,
    eapSharePct: 85,
    withoutSharePct: 15,
    confidence: "composite",
  },
  {
    id: "enc",
    division: "East North Central",
    hhpDams: 1720,
    withEap: 1376,
    withoutEap: 344,
    eapSharePct: 80,
    withoutSharePct: 20,
    confidence: "composite",
  },
  {
    id: "wnc",
    division: "West North Central",
    hhpDams: 1180,
    withEap: 944,
    withoutEap: 236,
    eapSharePct: 80,
    withoutSharePct: 20,
    confidence: "composite",
  },
  {
    id: "sa",
    division: "South Atlantic",
    hhpDams: 2100,
    withEap: 1680,
    withoutEap: 420,
    eapSharePct: 80,
    withoutSharePct: 20,
    confidence: "composite",
  },
  {
    id: "esc",
    division: "East South Central",
    hhpDams: 1320,
    withEap: 924,
    withoutEap: 396,
    eapSharePct: 70,
    withoutSharePct: 30,
    confidence: "composite",
  },
  {
    id: "wsc",
    division: "West South Central",
    hhpDams: 1680,
    withEap: 1344,
    withoutEap: 336,
    eapSharePct: 80,
    withoutSharePct: 20,
    confidence: "composite",
  },
  {
    id: "mt",
    division: "Mountain",
    hhpDams: 1240,
    withEap: 1054,
    withoutEap: 186,
    eapSharePct: 85,
    withoutSharePct: 15,
    confidence: "composite",
  },
  {
    id: "pac",
    division: "Pacific",
    hhpDams: 1775,
    withEap: 1592,
    withoutEap: 183,
    eapSharePct: 90,
    withoutSharePct: 10,
    confidence: "composite",
  },
];

/**
 * Illustrative state panel (desk composite). Sorted later in the viz by gap.
 * Not an official ASDSO state dashboard reprint.
 */
export const STATE_EAP_PANEL: Array<{
  state: string;
  abbr: string;
  division: CensusDivision;
  hhpDams: number;
  withoutEap: number;
  eapSharePct: number;
  withoutSharePct: number;
  inspectorsPerHhp: number;
  confidence: Confidence;
}> = [
  {
    state: "Alabama",
    abbr: "AL",
    division: "East South Central",
    hhpDams: 280,
    withoutEap: 126,
    eapSharePct: 55,
    withoutSharePct: 45,
    inspectorsPerHhp: 95,
    confidence: "composite",
  },
  {
    state: "Mississippi",
    abbr: "MS",
    division: "East South Central",
    hhpDams: 310,
    withoutEap: 109,
    eapSharePct: 65,
    withoutSharePct: 35,
    inspectorsPerHhp: 72,
    confidence: "composite",
  },
  {
    state: "Missouri",
    abbr: "MO",
    division: "West North Central",
    hhpDams: 420,
    withoutEap: 126,
    eapSharePct: 70,
    withoutSharePct: 30,
    inspectorsPerHhp: 58,
    confidence: "composite",
  },
  {
    state: "Indiana",
    abbr: "IN",
    division: "East North Central",
    hhpDams: 360,
    withoutEap: 90,
    eapSharePct: 75,
    withoutSharePct: 25,
    inspectorsPerHhp: 48,
    confidence: "composite",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    division: "Middle Atlantic",
    hhpDams: 520,
    withoutEap: 104,
    eapSharePct: 80,
    withoutSharePct: 20,
    inspectorsPerHhp: 36,
    confidence: "composite",
  },
  {
    state: "Texas",
    abbr: "TX",
    division: "West South Central",
    hhpDams: 980,
    withoutEap: 196,
    eapSharePct: 80,
    withoutSharePct: 20,
    inspectorsPerHhp: 42,
    confidence: "composite",
  },
  {
    state: "North Carolina",
    abbr: "NC",
    division: "South Atlantic",
    hhpDams: 890,
    withoutEap: 178,
    eapSharePct: 80,
    withoutSharePct: 20,
    inspectorsPerHhp: 40,
    confidence: "composite",
  },
  {
    state: "Michigan",
    abbr: "MI",
    division: "East North Central",
    hhpDams: 410,
    withoutEap: 62,
    eapSharePct: 85,
    withoutSharePct: 15,
    inspectorsPerHhp: 32,
    confidence: "composite",
  },
  {
    state: "Colorado",
    abbr: "CO",
    division: "Mountain",
    hhpDams: 340,
    withoutEap: 34,
    eapSharePct: 90,
    withoutSharePct: 10,
    inspectorsPerHhp: 22,
    confidence: "composite",
  },
  {
    state: "California",
    abbr: "CA",
    division: "Pacific",
    hhpDams: 720,
    withoutEap: 36,
    eapSharePct: 95,
    withoutSharePct: 5,
    inspectorsPerHhp: 18,
    confidence: "composite",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    division: "New England",
    hhpDams: 310,
    withoutEap: 16,
    eapSharePct: 95,
    withoutSharePct: 5,
    inspectorsPerHhp: 14,
    confidence: "composite",
  },
  {
    state: "New Jersey",
    abbr: "NJ",
    division: "Middle Atlantic",
    hhpDams: 240,
    withoutEap: 12,
    eapSharePct: 95,
    withoutSharePct: 5,
    inspectorsPerHhp: 16,
    confidence: "composite",
  },
];

/** Condition × preparedness cross-tab (illustrative overlay on ASCE 15% poor) */
export const CONDITION_PREPAREDNESS = [
  {
    id: "poor-no-eap",
    condition: "Poor / unsatisfactory",
    preparedness: "No EAP",
    dams: 450,
    shareOfHhpPct: 2.7,
  },
  {
    id: "poor-with-eap",
    condition: "Poor / unsatisfactory",
    preparedness: "EAP on file",
    dams: 2050,
    shareOfHhpPct: 12.3,
  },
  {
    id: "fair-no-eap",
    condition: "Fair / satisfactory / not rated",
    preparedness: "No EAP",
    dams: 1965,
    shareOfHhpPct: 11.8,
  },
  {
    id: "fair-with-eap",
    condition: "Fair / satisfactory / not rated",
    preparedness: "EAP on file",
    dams: 12235,
    shareOfHhpPct: 73.3,
  },
] as const;

/** Inventory growth context vs EAP coverage plateau */
export const INVENTORY_VS_COVERAGE = [
  {
    year: 2012,
    hhpIndex: 100,
    eapSharePct: 69,
    note: "ASCE: HHP inventory baseline before +20% growth",
  },
  {
    year: 2018,
    hhpIndex: 112,
    eapSharePct: 80,
    note: "Coverage still climbing; inventory expanding",
  },
  {
    year: 2021,
    hhpIndex: 116,
    eapSharePct: 82,
    note: "Coverage near plateau",
  },
  {
    year: 2024,
    hhpIndex: 120,
    eapSharePct: 82,
    note: "ASCE: HHP +20% since 2012; EAP share flat vs 2021",
  },
] as const;

export function fmtCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function divisionWithoutShare(division: CensusDivision | "all"): number {
  if (division === "all") return HEADLINE.withoutEapSharePct;
  const row = DIVISION_EAP_GAPS.find((d) => d.division === division);
  return row?.withoutSharePct ?? HEADLINE.withoutEapSharePct;
}

export function filteredStates(division: CensusDivision | "all") {
  if (division === "all") return STATE_EAP_PANEL;
  return STATE_EAP_PANEL.filter((s) => s.division === division);
}

export function stateScatterRows(division: CensusDivision | "all") {
  return filteredStates(division).map((s) => ({
    ...s,
    x: s.hhpDams,
    y: s.withoutSharePct,
    z: s.withoutEap,
  }));
}
