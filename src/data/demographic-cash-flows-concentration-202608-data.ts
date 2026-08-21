/**
 * Demographic cash flows — Aug 202608 concentration / market-share lens.
 * Core question: How concentrated is this system at the top once Mexico’s
 * T12M soft print and real purchasing-power hit qualify the Q3 restatement?
 *
 * Complements concentration-2026q3 (Banxico FY restatement) with an Aug vintage:
 * T12M Jul’25–Jun’26 Mexico $63.389B (−0.1% YoY) nudges top-2 share back toward
 * ~9.3% of the $685B LMIC perimeter; real June purchasing power −8.3% splits
 * nominal dollar concentration from household purchasing-power concentration.
 *
 * Primary sources:
 * - World Bank Migration & Development Brief 41 (LMIC remittances ~$685B)
 * - Banxico Ingresos y Egresos por Remesas junio 2026 (T12M $63.389B; H1 $30.759B)
 * - BBVA Research (3 Aug 2026) real remittance purchasing power −8.3% in June
 * - KNOMAD bilateral matrix (US→Mexico corridor print)
 * - UN World Population Prospects 2024 (old-age dependency)
 * - OECD Pensions at a Glance (public pension % GDP)
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Aug 202608 concentration vintage vs concentration-2026q3: recipient perimeter still Brief 41 LMIC ~$685B; Mexico top-2 measured three ways — Brief 41 ~$68B (9.9%), Banxico FY2025 $61.791B (9.0%), Banxico T12M Jun’26 $63.389B (9.3%); H1 2026 $30.759B (+3.1%) retained; BBVA real June purchasing power −8.3% splits nominal share from real household purchasing power; US→Mexico KNOMAD ~$52B retained; GDP-dependence and OECD pension ladders carried. Confidence tags separate disclosed Banxico/Brief 41/OECD/BBVA prints from analytical residuals.";

export const PRIOR_CONCENTRATION_PATH =
  "/blog/demographic-cash-flows-concentration-2026";
export const PRIOR_Q3_CONCENTRATION_PATH =
  "/blog/demographic-cash-flows-concentration-2026q3";
export const PRIOR_RESEARCH_PATH = "/blog/demographic-cash-flows-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/demographic-cash-flows-update-2026";
export const PRIOR_Q3_PATH = "/blog/demographic-cash-flows-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/demographic-cash-flows-update-202608";
export const CORRIDORS_PATH = "/blog/global-remittance-corridors-2026";

export const HEADLINE = {
  /** T12M-qualified recipient ladder inside LMIC remittances (~$685B) */
  top1RecipientSharePct: 19,
  top1RecipientLabel: "India",
  top1RecipientBn: 129,
  top3RecipientSharePct: 35,
  top3RecipientLabel: "India · Mexico · China",
  top3RecipientShareT12mPct: 35.1,
  top3RecipientShareBanxicoPct: 34.9,
  top3RecipientShareBrief41Pct: 36,
  mexicoBrief41Bn: 68,
  mexicoBanxicoFy2025Bn: 61.791,
  mexicoT12mBn: 63.389,
  mexicoT12mYoyPct: -0.1,
  mexicoT12mSharePct: 9.3,
  mexicoBanxicoSharePct: 9.0,
  mexicoBrief41SharePct: 9.9,
  mexicoT12mVsFyDeltaPp: 0.3,
  mexicoShareDeltaVsBrief41Pp: -0.6,
  mexicoRealJuneYoyPct: -8.3,
  mexicoRealImpliedT12mBn: 58.1,
  mexicoRealImpliedSharePct: 8.5,
  top5RecipientSharePct: 46,
  lmicUniverseBn: 685,
  recipientHhiT12m: 605,
  /** Bilateral corridor — matrix vs Banxico FY vs T12M */
  top1CorridorSharePct: 8,
  top1CorridorLabel: "US → Mexico",
  top1CorridorBn: 52,
  top1CorridorBanxicoImpliedBn: 61.8,
  top1CorridorBanxicoImpliedSharePct: 9.0,
  top1CorridorT12mImpliedBn: 63.4,
  top1CorridorT12mImpliedSharePct: 9.3,
  top3CorridorSharePct: 13,
  mexicoH1_2026Bn: 30.759,
  mexicoH1YoyPct: 3.1,
  mexicoH1AnnualizedBn: 61.5,
  mexicoJune2026Bn: 5.472,
  mexicoJuneYoyPct: 4.2,
  mexicoJuneSaMomPct: -2.4,
  /** GDP-dependence concentration */
  top1DependenceGdpPct: 45,
  top1DependenceLabel: "Tajikistan",
  top3DependenceAvgGdpPct: 33,
  /** Host public-pension burden */
  top1PensionGdpPct: 16.3,
  top1PensionLabel: "Italy",
  top3PensionAvgGdpPct: 13.7,
  oecdPensionAvgGdpPct: 8.1,
  italyVsOecdMultiple: 2.0,
  oecd32_2050Pct: 10.0,
  /** Age structure contrast */
  japanOldAgeDep: 54,
  nigeriaOldAgeDep: 6,
  /** Flow compare context */
  fdiCompareBn: 470,
  odaCompareBn: 210,
  /** Compliance / concentration risk */
  usComplianceRuleMonth: "Sep 2026",
} as const;

/** brief41 | banxico FY | t12m Jun’26 trailing twelve */
export type VintageId = "brief41" | "banxico" | "t12m";

export type RecipientShare = {
  rank: number;
  id: string;
  label: string;
  short: string;
  amountBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  remittanceGdpPct: number | null;
  oldAgeDependency: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Banxico FY2025-restated LMIC recipient ladder vs $685B Brief 41 universe.
 * Mexico uses Banxico FY2025 $61.791B; residual closes the perimeter.
 */
export const RECIPIENT_SHARES_BANXICO: RecipientShare[] = [
  {
    rank: 1,
    id: "india",
    label: "India",
    short: "India",
    amountBn: 129,
    sharePct: 18.8,
    cumulativeSharePct: 18.8,
    remittanceGdpPct: 3.4,
    oldAgeDependency: 11,
    confidence: "disclosed",
    fill: "#f59e0b",
    note: "Unchanged Brief 41 top-1 anchor",
  },
  {
    rank: 2,
    id: "mexico",
    label: "Mexico",
    short: "Mexico",
    amountBn: 61.8,
    sharePct: 9.0,
    cumulativeSharePct: 27.8,
    remittanceGdpPct: 3.5,
    oldAgeDependency: 13,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "Banxico FY2025 $61.791B (−0.9 pp vs Brief 41)",
  },
  {
    rank: 3,
    id: "china",
    label: "China",
    short: "China",
    amountBn: 48,
    sharePct: 7.0,
    cumulativeSharePct: 34.9,
    remittanceGdpPct: 0.3,
    oldAgeDependency: 21,
    confidence: "disclosed",
    fill: "#ef4444",
  },
  {
    rank: 4,
    id: "philippines",
    label: "Philippines",
    short: "PH",
    amountBn: 40,
    sharePct: 5.8,
    cumulativeSharePct: 40.7,
    remittanceGdpPct: 8.5,
    oldAgeDependency: 9,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    rank: 5,
    id: "pakistan",
    label: "Pakistan",
    short: "PK",
    amountBn: 33,
    sharePct: 4.8,
    cumulativeSharePct: 45.5,
    remittanceGdpPct: 8.0,
    oldAgeDependency: 8,
    confidence: "disclosed",
    fill: "#10b981",
  },
  {
    rank: 6,
    id: "nigeria",
    label: "Nigeria",
    short: "NG",
    amountBn: 21,
    sharePct: 3.1,
    cumulativeSharePct: 48.6,
    remittanceGdpPct: 4.0,
    oldAgeDependency: 6,
    confidence: "estimated",
    fill: "#f97316",
  },
  {
    rank: 7,
    id: "egypt",
    label: "Egypt",
    short: "EG",
    amountBn: 19,
    sharePct: 2.8,
    cumulativeSharePct: 51.4,
    remittanceGdpPct: 5.5,
    oldAgeDependency: 9,
    confidence: "estimated",
    fill: "#06b6d4",
  },
  {
    rank: 8,
    id: "bangladesh",
    label: "Bangladesh",
    short: "BD",
    amountBn: 18,
    sharePct: 2.6,
    cumulativeSharePct: 54.0,
    remittanceGdpPct: 5.2,
    oldAgeDependency: 8,
    confidence: "estimated",
    fill: "#84cc16",
  },
  {
    rank: 9,
    id: "residual",
    label: "All other LMICs",
    short: "Rest",
    amountBn: 315.2,
    sharePct: 46.0,
    cumulativeSharePct: 100,
    remittanceGdpPct: null,
    oldAgeDependency: 12,
    confidence: "estimated",
    fill: "#64748b",
    note: "Analytical residual after Banxico FY Mexico restatement",
  },
];

/**
 * Aug T12M ladder: Mexico uses Banxico T12M Jul’25–Jun’26 $63.389B (−0.1% YoY).
 * +0.3 pp vs FY2025 share; still −0.6 pp vs Brief 41 estimate.
 */
export const RECIPIENT_SHARES_T12M: RecipientShare[] = [
  {
    rank: 1,
    id: "india",
    label: "India",
    short: "India",
    amountBn: 129,
    sharePct: 18.8,
    cumulativeSharePct: 18.8,
    remittanceGdpPct: 3.4,
    oldAgeDependency: 11,
    confidence: "disclosed",
    fill: "#f59e0b",
    note: "Unchanged Brief 41 top-1 anchor",
  },
  {
    rank: 2,
    id: "mexico",
    label: "Mexico",
    short: "Mexico",
    amountBn: 63.4,
    sharePct: 9.3,
    cumulativeSharePct: 28.1,
    remittanceGdpPct: 3.5,
    oldAgeDependency: 13,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "Banxico T12M Jun’26 $63.389B (−0.1% YoY; +0.3 pp vs FY share)",
  },
  {
    rank: 3,
    id: "china",
    label: "China",
    short: "China",
    amountBn: 48,
    sharePct: 7.0,
    cumulativeSharePct: 35.1,
    remittanceGdpPct: 0.3,
    oldAgeDependency: 21,
    confidence: "disclosed",
    fill: "#ef4444",
  },
  {
    rank: 4,
    id: "philippines",
    label: "Philippines",
    short: "PH",
    amountBn: 40,
    sharePct: 5.8,
    cumulativeSharePct: 40.9,
    remittanceGdpPct: 8.5,
    oldAgeDependency: 9,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    rank: 5,
    id: "pakistan",
    label: "Pakistan",
    short: "PK",
    amountBn: 33,
    sharePct: 4.8,
    cumulativeSharePct: 45.7,
    remittanceGdpPct: 8.0,
    oldAgeDependency: 8,
    confidence: "disclosed",
    fill: "#10b981",
  },
  {
    rank: 6,
    id: "nigeria",
    label: "Nigeria",
    short: "NG",
    amountBn: 21,
    sharePct: 3.1,
    cumulativeSharePct: 48.8,
    remittanceGdpPct: 4.0,
    oldAgeDependency: 6,
    confidence: "estimated",
    fill: "#f97316",
  },
  {
    rank: 7,
    id: "egypt",
    label: "Egypt",
    short: "EG",
    amountBn: 19,
    sharePct: 2.8,
    cumulativeSharePct: 51.6,
    remittanceGdpPct: 5.5,
    oldAgeDependency: 9,
    confidence: "estimated",
    fill: "#06b6d4",
  },
  {
    rank: 8,
    id: "bangladesh",
    label: "Bangladesh",
    short: "BD",
    amountBn: 18,
    sharePct: 2.6,
    cumulativeSharePct: 54.2,
    remittanceGdpPct: 5.2,
    oldAgeDependency: 8,
    confidence: "estimated",
    fill: "#84cc16",
  },
  {
    rank: 9,
    id: "residual",
    label: "All other LMICs",
    short: "Rest",
    amountBn: 313.6,
    sharePct: 45.8,
    cumulativeSharePct: 100,
    remittanceGdpPct: null,
    oldAgeDependency: 12,
    confidence: "estimated",
    fill: "#64748b",
    note: "Analytical residual after T12M Mexico print",
  },
];

/** Brief 41 static ladder (carried) — for vintage delta toggles */
export const RECIPIENT_SHARES_BRIEF41: RecipientShare[] = [
  {
    rank: 1,
    id: "india",
    label: "India",
    short: "India",
    amountBn: 129,
    sharePct: 18.8,
    cumulativeSharePct: 18.8,
    remittanceGdpPct: 3.4,
    oldAgeDependency: 11,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    rank: 2,
    id: "mexico",
    label: "Mexico",
    short: "Mexico",
    amountBn: 68,
    sharePct: 9.9,
    cumulativeSharePct: 28.8,
    remittanceGdpPct: 3.7,
    oldAgeDependency: 13,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    rank: 3,
    id: "china",
    label: "China",
    short: "China",
    amountBn: 48,
    sharePct: 7.0,
    cumulativeSharePct: 35.8,
    remittanceGdpPct: 0.3,
    oldAgeDependency: 21,
    confidence: "disclosed",
    fill: "#ef4444",
  },
  {
    rank: 4,
    id: "philippines",
    label: "Philippines",
    short: "PH",
    amountBn: 40,
    sharePct: 5.8,
    cumulativeSharePct: 41.6,
    remittanceGdpPct: 8.5,
    oldAgeDependency: 9,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    rank: 5,
    id: "pakistan",
    label: "Pakistan",
    short: "PK",
    amountBn: 33,
    sharePct: 4.8,
    cumulativeSharePct: 46.4,
    remittanceGdpPct: 8.0,
    oldAgeDependency: 8,
    confidence: "disclosed",
    fill: "#10b981",
  },
  {
    rank: 6,
    id: "nigeria",
    label: "Nigeria",
    short: "NG",
    amountBn: 21,
    sharePct: 3.1,
    cumulativeSharePct: 49.5,
    remittanceGdpPct: 4.0,
    oldAgeDependency: 6,
    confidence: "estimated",
    fill: "#f97316",
  },
  {
    rank: 7,
    id: "egypt",
    label: "Egypt",
    short: "EG",
    amountBn: 19,
    sharePct: 2.8,
    cumulativeSharePct: 52.3,
    remittanceGdpPct: 5.5,
    oldAgeDependency: 9,
    confidence: "estimated",
    fill: "#06b6d4",
  },
  {
    rank: 8,
    id: "bangladesh",
    label: "Bangladesh",
    short: "BD",
    amountBn: 18,
    sharePct: 2.6,
    cumulativeSharePct: 54.9,
    remittanceGdpPct: 5.2,
    oldAgeDependency: 8,
    confidence: "estimated",
    fill: "#84cc16",
  },
  {
    rank: 9,
    id: "residual",
    label: "All other LMICs",
    short: "Rest",
    amountBn: 309,
    sharePct: 45.1,
    cumulativeSharePct: 100,
    remittanceGdpPct: null,
    oldAgeDependency: 12,
    confidence: "estimated",
    fill: "#64748b",
  },
];

export type CorridorShare = {
  rank: number;
  id: string;
  from: string;
  to: string;
  label: string;
  amountBn: number;
  shareOfLmicPct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Ranked bilateral corridors — matrix dollars vs $685B perimeter */
export const CORRIDOR_SHARES: CorridorShare[] = [
  {
    rank: 1,
    id: "us-mx",
    from: "United States",
    to: "Mexico",
    label: "US → Mexico",
    amountBn: 52,
    shareOfLmicPct: 7.6,
    cumulativeSharePct: 7.6,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "KNOMAD matrix print; Banxico T12M Mexico total implies ~$63.4B pipe reference",
  },
  {
    rank: 2,
    id: "uae-in",
    from: "UAE",
    to: "India",
    label: "UAE → India",
    amountBn: 20,
    shareOfLmicPct: 2.9,
    cumulativeSharePct: 10.5,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    rank: 3,
    id: "us-ph",
    from: "United States",
    to: "Philippines",
    label: "US → Philippines",
    amountBn: 15,
    shareOfLmicPct: 2.2,
    cumulativeSharePct: 12.7,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    rank: 4,
    id: "sa-in",
    from: "Saudi Arabia",
    to: "India",
    label: "Saudi → India",
    amountBn: 13,
    shareOfLmicPct: 1.9,
    cumulativeSharePct: 14.6,
    confidence: "disclosed",
    fill: "#10b981",
  },
  {
    rank: 5,
    id: "us-in",
    from: "United States",
    to: "India",
    label: "US → India",
    amountBn: 12,
    shareOfLmicPct: 1.8,
    cumulativeSharePct: 16.4,
    confidence: "estimated",
    fill: "#ef4444",
  },
  {
    rank: 6,
    id: "us-gt",
    from: "United States",
    to: "Guatemala",
    label: "US → Guatemala",
    amountBn: 10,
    shareOfLmicPct: 1.5,
    cumulativeSharePct: 17.8,
    confidence: "estimated",
    fill: "#f97316",
  },
  {
    rank: 7,
    id: "uk-in",
    from: "United Kingdom",
    to: "India",
    label: "UK → India",
    amountBn: 5,
    shareOfLmicPct: 0.7,
    cumulativeSharePct: 18.5,
    confidence: "estimated",
    fill: "#06b6d4",
  },
  {
    rank: 8,
    id: "ru-tj",
    from: "Russia",
    to: "Tajikistan",
    label: "Russia → Tajikistan",
    amountBn: 3.5,
    shareOfLmicPct: 0.5,
    cumulativeSharePct: 19.0,
    confidence: "estimated",
    fill: "#84cc16",
    note: "Small dollars; extreme destination GDP share",
  },
];

/** Corridor pressure: matrix vs Banxico FY vs T12M vs H1 annualized */
export const CORRIDOR_VINTAGE_DELTA = [
  {
    id: "matrix",
    label: "KNOMAD US→MX",
    amountBn: 52,
    sharePct: 7.6,
    fill: "#64748b",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "banxico-fy",
    label: "Banxico MX FY2025",
    amountBn: 61.8,
    sharePct: 9.0,
    fill: "#0ea5e9",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "t12m",
    label: "Banxico T12M Jun’26",
    amountBn: 63.4,
    sharePct: 9.3,
    fill: "#38bdf8",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "h1-ann",
    label: "H1’26 annualized",
    amountBn: 61.5,
    sharePct: 9.0,
    fill: "#f59e0b",
    confidence: "estimated" as Confidence,
  },
  {
    id: "real-implied",
    label: "Real-adj. T12M (illustrative)",
    amountBn: 58.1,
    sharePct: 8.5,
    fill: "#ef4444",
    confidence: "estimated" as Confidence,
  },
];

export type DependenceRow = {
  rank: number;
  id: string;
  label: string;
  short: string;
  remittanceGdpPct: number;
  amountBn: number;
  oldAgeDependency: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

export const DEPENDENCE_SHARES: DependenceRow[] = [
  {
    rank: 1,
    id: "tajikistan",
    label: "Tajikistan",
    short: "TJ",
    remittanceGdpPct: 45,
    amountBn: 5.5,
    oldAgeDependency: 7,
    confidence: "disclosed",
    fill: "#ef4444",
  },
  {
    rank: 2,
    id: "nicaragua",
    label: "Nicaragua",
    short: "NI",
    remittanceGdpPct: 27,
    amountBn: 5,
    oldAgeDependency: 10,
    confidence: "disclosed",
    fill: "#f97316",
  },
  {
    rank: 3,
    id: "lebanon",
    label: "Lebanon",
    short: "LB",
    remittanceGdpPct: 27,
    amountBn: 6.7,
    oldAgeDependency: 16,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    rank: 4,
    id: "philippines",
    label: "Philippines",
    short: "PH",
    remittanceGdpPct: 8.5,
    amountBn: 40,
    oldAgeDependency: 9,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    rank: 5,
    id: "pakistan",
    label: "Pakistan",
    short: "PK",
    remittanceGdpPct: 8.0,
    amountBn: 33,
    oldAgeDependency: 8,
    confidence: "disclosed",
    fill: "#10b981",
  },
  {
    rank: 6,
    id: "egypt",
    label: "Egypt",
    short: "EG",
    remittanceGdpPct: 5.5,
    amountBn: 19,
    oldAgeDependency: 9,
    confidence: "estimated",
    fill: "#06b6d4",
  },
  {
    rank: 7,
    id: "bangladesh",
    label: "Bangladesh",
    short: "BD",
    remittanceGdpPct: 5.2,
    amountBn: 18,
    oldAgeDependency: 8,
    confidence: "estimated",
    fill: "#84cc16",
  },
  {
    rank: 8,
    id: "mexico",
    label: "Mexico",
    short: "MX",
    remittanceGdpPct: 3.5,
    amountBn: 63.4,
    oldAgeDependency: 13,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "Banxico T12M dollars; moderate GDP share",
  },
];

export type PensionBurdenRow = {
  rank: number;
  id: string;
  label: string;
  short: string;
  pensionGdpPct: number;
  oldAgeDependency: number;
  remittanceGdpPct: number | null;
  confidence: Confidence;
  fill: string;
};

export const PENSION_BURDENS: PensionBurdenRow[] = [
  {
    rank: 1,
    id: "italy",
    label: "Italy",
    short: "IT",
    pensionGdpPct: 16.3,
    oldAgeDependency: 40,
    remittanceGdpPct: 0.5,
    confidence: "disclosed",
    fill: "#0f766e",
  },
  {
    rank: 2,
    id: "france",
    label: "France",
    short: "FR",
    pensionGdpPct: 14.5,
    oldAgeDependency: 37,
    remittanceGdpPct: 0.9,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    rank: 3,
    id: "germany",
    label: "Germany",
    short: "DE",
    pensionGdpPct: 10.4,
    oldAgeDependency: 37,
    remittanceGdpPct: 0.5,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    rank: 4,
    id: "japan",
    label: "Japan",
    short: "JP",
    pensionGdpPct: 9.3,
    oldAgeDependency: 54,
    remittanceGdpPct: 0.1,
    confidence: "disclosed",
    fill: "#ef4444",
  },
  {
    rank: 5,
    id: "united-states",
    label: "United States",
    short: "US",
    pensionGdpPct: 7.1,
    oldAgeDependency: 29,
    remittanceGdpPct: 0.03,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    rank: 6,
    id: "united-kingdom",
    label: "United Kingdom",
    short: "UK",
    pensionGdpPct: 5.2,
    oldAgeDependency: 32,
    remittanceGdpPct: 0.1,
    confidence: "estimated",
    fill: "#10b981",
  },
  {
    rank: 7,
    id: "mexico",
    label: "Mexico",
    short: "MX",
    pensionGdpPct: 3.1,
    oldAgeDependency: 13,
    remittanceGdpPct: 3.5,
    confidence: "disclosed",
    fill: "#f97316",
  },
];

export type ConcentrationCurvePoint = {
  rank: number;
  label: string;
  cumulativeSharePct: number;
  equalSharePct: number;
};

function buildCurve(
  shares: number[],
  labels: string[],
): ConcentrationCurvePoint[] {
  const n = shares.length;
  let cum = 0;
  return shares.map((s, i) => {
    cum += s;
    return {
      rank: i + 1,
      label: labels[i] ?? `Rank ${i + 1}`,
      cumulativeSharePct: Math.round(cum * 10) / 10,
      equalSharePct: Math.round(((i + 1) / n) * 1000) / 10,
    };
  });
}

export const RECIPIENT_CURVE_BANXICO = buildCurve(
  [18.8, 9.0, 7.0, 5.8, 4.8, 3.1, 2.8, 2.6],
  ["India", "Mexico", "China", "PH", "PK", "NG", "EG", "BD"],
);

export const RECIPIENT_CURVE_T12M = buildCurve(
  [18.8, 9.3, 7.0, 5.8, 4.8, 3.1, 2.8, 2.6],
  ["India", "Mexico", "China", "PH", "PK", "NG", "EG", "BD"],
);

export const RECIPIENT_CURVE_BRIEF41 = buildCurve(
  [18.8, 9.9, 7.0, 5.8, 4.8, 3.1, 2.8, 2.6],
  ["India", "Mexico", "China", "PH", "PK", "NG", "EG", "BD"],
);

export const CORRIDOR_CONCENTRATION_CURVE = buildCurve(
  CORRIDOR_SHARES.map((c) => c.shareOfLmicPct),
  CORRIDOR_SHARES.map((c) => c.label),
);

export const DEPENDENCE_CONCENTRATION_CURVE = buildCurve(
  DEPENDENCE_SHARES.map((d) => d.remittanceGdpPct),
  DEPENDENCE_SHARES.map((d) => d.short),
);

/** Vintage delta: Brief 41 → Banxico FY → T12M on top-k shares */
export const VINTAGE_DELTA_ROWS = [
  {
    id: "top1",
    label: "Top-1 (India)",
    brief41Pct: 18.8,
    banxicoPct: 18.8,
    t12mPct: 18.8,
    deltaPp: 0,
    fill: "#f59e0b",
  },
  {
    id: "mexico",
    label: "Mexico (top-2)",
    brief41Pct: 9.9,
    banxicoPct: 9.0,
    t12mPct: 9.3,
    deltaPp: -0.6,
    fill: "#0ea5e9",
  },
  {
    id: "top3",
    label: "Top-3 recipients",
    brief41Pct: 35.8,
    banxicoPct: 34.9,
    t12mPct: 35.1,
    deltaPp: -0.7,
    fill: "#ef4444",
  },
  {
    id: "top5",
    label: "Top-5 recipients",
    brief41Pct: 46.4,
    banxicoPct: 45.5,
    t12mPct: 45.7,
    deltaPp: -0.7,
    fill: "#8b5cf6",
  },
  {
    id: "corridor",
    label: "US→MX vs perimeter",
    brief41Pct: 7.6,
    banxicoPct: 9.0,
    t12mPct: 9.3,
    deltaPp: 1.7,
    fill: "#10b981",
  },
];

/** Nominal vs real purchasing-power meters for Mexico share of $685B */
export const NOMINAL_VS_REAL = [
  {
    id: "brief41",
    label: "Brief 41 estimate",
    sharePct: 9.9,
    amountBn: 68,
    fill: "#64748b",
    confidence: "carried" as Confidence,
  },
  {
    id: "fy",
    label: "Banxico FY2025",
    sharePct: 9.0,
    amountBn: 61.8,
    fill: "#0ea5e9",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "t12m",
    label: "T12M nominal",
    sharePct: 9.3,
    amountBn: 63.4,
    fill: "#38bdf8",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "real",
    label: "Real-adj. (illustrative)",
    sharePct: 8.5,
    amountBn: 58.1,
    fill: "#ef4444",
    confidence: "estimated" as Confidence,
  },
];

/** Mexico share path across concentration vintages */
export const MEXICO_SHARE_PATH = [
  { vintage: "Brief 41", sharePct: 9.9, amountBn: 68, fill: "#64748b" },
  { vintage: "FY2025", sharePct: 9.0, amountBn: 61.8, fill: "#0ea5e9" },
  { vintage: "H1’26 ann.", sharePct: 9.0, amountBn: 61.5, fill: "#f59e0b" },
  { vintage: "T12M Jun’26", sharePct: 9.3, amountBn: 63.4, fill: "#38bdf8" },
  {
    vintage: "Real-adj.",
    sharePct: 8.5,
    amountBn: 58.1,
    fill: "#ef4444",
  },
];

export type LensCompareRow = {
  id: string;
  label: string;
  short: string;
  top1Pct: number;
  top3Pct: number;
  universeLabel: string;
  fill: string;
};

export const LENS_COMPARE: LensCompareRow[] = [
  {
    id: "recipients",
    label: "Recipient dollars (T12M MX)",
    short: "Recipients",
    top1Pct: 19,
    top3Pct: 35,
    universeLabel: "$685B LMIC · MX T12M",
    fill: "#f59e0b",
  },
  {
    id: "corridors",
    label: "Bilateral corridors",
    short: "Corridors",
    top1Pct: 8,
    top3Pct: 13,
    universeLabel: "Matrix $ vs $685B (lower bound)",
    fill: "#0ea5e9",
  },
  {
    id: "corridor-t12m",
    label: "US→MX T12M-implied",
    short: "MX T12M pipe",
    top1Pct: 9.3,
    top3Pct: 9.3,
    universeLabel: "Banxico T12M / $685B",
    fill: "#38bdf8",
  },
  {
    id: "real-mx",
    label: "MX real-adj. share",
    short: "Real MX",
    top1Pct: 8.5,
    top3Pct: 8.5,
    universeLabel: "Illustrative −8.3% real hit",
    fill: "#ef4444",
  },
  {
    id: "dependence",
    label: "GDP dependence",
    short: "Dependence",
    top1Pct: 45,
    top3Pct: 33,
    universeLabel: "Top-1 GDP% / top-3 avg",
    fill: "#f97316",
  },
  {
    id: "pensions",
    label: "Host pensions",
    short: "Pensions",
    top1Pct: 16.3,
    top3Pct: 13.7,
    universeLabel: "Top-1 GDP% / top-3 avg",
    fill: "#0f766e",
  },
];

export type DualLedgerPoint = {
  id: string;
  label: string;
  short: string;
  oldAgeDependency: number;
  remittanceGdpPct: number;
  amountBn: number;
  role: "aging-host" | "remittance-origin" | "bridge";
  fill: string;
};

export const DUAL_LEDGER: DualLedgerPoint[] = [
  {
    id: "japan",
    label: "Japan",
    short: "JP",
    oldAgeDependency: 54,
    remittanceGdpPct: 0.1,
    amountBn: 5,
    role: "aging-host",
    fill: "#0f766e",
  },
  {
    id: "italy",
    label: "Italy",
    short: "IT",
    oldAgeDependency: 40,
    remittanceGdpPct: 0.5,
    amountBn: 11,
    role: "aging-host",
    fill: "#0ea5e9",
  },
  {
    id: "germany",
    label: "Germany",
    short: "DE",
    oldAgeDependency: 37,
    remittanceGdpPct: 0.5,
    amountBn: 20,
    role: "aging-host",
    fill: "#06b6d4",
  },
  {
    id: "united-states",
    label: "United States",
    short: "US",
    oldAgeDependency: 29,
    remittanceGdpPct: 0.03,
    amountBn: 7,
    role: "bridge",
    fill: "#8b5cf6",
  },
  {
    id: "china",
    label: "China",
    short: "CN",
    oldAgeDependency: 21,
    remittanceGdpPct: 0.3,
    amountBn: 48,
    role: "bridge",
    fill: "#ef4444",
  },
  {
    id: "mexico",
    label: "Mexico",
    short: "MX",
    oldAgeDependency: 13,
    remittanceGdpPct: 3.5,
    amountBn: 63.4,
    role: "remittance-origin",
    fill: "#0ea5e9",
  },
  {
    id: "india",
    label: "India",
    short: "IN",
    oldAgeDependency: 11,
    remittanceGdpPct: 3.4,
    amountBn: 129,
    role: "remittance-origin",
    fill: "#f59e0b",
  },
  {
    id: "philippines",
    label: "Philippines",
    short: "PH",
    oldAgeDependency: 9,
    remittanceGdpPct: 8.5,
    amountBn: 40,
    role: "remittance-origin",
    fill: "#8b5cf6",
  },
  {
    id: "pakistan",
    label: "Pakistan",
    short: "PK",
    oldAgeDependency: 8,
    remittanceGdpPct: 8.0,
    amountBn: 33,
    role: "remittance-origin",
    fill: "#10b981",
  },
  {
    id: "nigeria",
    label: "Nigeria",
    short: "NG",
    oldAgeDependency: 6,
    remittanceGdpPct: 4.0,
    amountBn: 21,
    role: "remittance-origin",
    fill: "#f97316",
  },
  {
    id: "tajikistan",
    label: "Tajikistan",
    short: "TJ",
    oldAgeDependency: 7,
    remittanceGdpPct: 45,
    amountBn: 5.5,
    role: "remittance-origin",
    fill: "#ef4444",
  },
  {
    id: "lebanon",
    label: "Lebanon",
    short: "LB",
    oldAgeDependency: 16,
    remittanceGdpPct: 27,
    amountBn: 6.7,
    role: "remittance-origin",
    fill: "#f59e0b",
  },
];

/** Top-3 vs residual composition for donut — T12M Mexico default */
export const TOP3_COMPOSITION = [
  { id: "india", label: "India", sharePct: 18.8, fill: "#f59e0b" },
  { id: "mexico", label: "Mexico (T12M)", sharePct: 9.3, fill: "#0ea5e9" },
  { id: "china", label: "China", sharePct: 7.0, fill: "#ef4444" },
  { id: "rest", label: "All other LMICs", sharePct: 64.9, fill: "#64748b" },
];

export const H1_REBOUND_SERIES = [
  { period: "H1’24", bn: 31.34, fill: "#64748b" },
  { period: "H1’25", bn: 29.84, fill: "#f97316" },
  { period: "H1’26", bn: 30.76, fill: "#0ea5e9" },
];

/** Dual pulse: H1 rebound vs T12M soft vs real hit */
export const DUAL_PULSE_SERIES = [
  {
    id: "h1",
    label: "H1’26 YoY",
    valuePct: 3.1,
    fill: "#0ea5e9",
    note: "Rebound headline",
  },
  {
    id: "t12m",
    label: "T12M YoY",
    valuePct: -0.1,
    fill: "#f59e0b",
    note: "Soft twelve-month",
  },
  {
    id: "real",
    label: "Real June YoY",
    valuePct: -8.3,
    fill: "#ef4444",
    note: "Purchasing-power hit",
  },
  {
    id: "june",
    label: "June YoY",
    valuePct: 4.2,
    fill: "#10b981",
    note: "Monthly nominal",
  },
];

export const SHARE_TABLE = [
  {
    lens: "Recipient $ (T12M MX)",
    top1: "India",
    top1Share: "19%",
    top3: "India · Mexico · China",
    top3Share: "35%",
    universe: "$685B LMIC · MX $63.4B T12M",
    confidence: "disclosed" as Confidence,
  },
  {
    lens: "Recipient $ (Banxico FY)",
    top1: "India",
    top1Share: "19%",
    top3: "India · Mexico · China",
    top3Share: "35%",
    universe: "$685B · MX $61.8B FY2025",
    confidence: "disclosed" as Confidence,
  },
  {
    lens: "Recipient $ (Brief 41)",
    top1: "India",
    top1Share: "19%",
    top3: "India · Mexico · China",
    top3Share: "36%",
    universe: "$685B · MX ~$68B estimate",
    confidence: "carried" as Confidence,
  },
  {
    lens: "US→MX corridor (matrix)",
    top1: "US → Mexico",
    top1Share: "8%",
    top3: "US→MX · UAE→IN · US→PH",
    top3Share: "13%",
    universe: "Share of $685B perimeter",
    confidence: "disclosed" as Confidence,
  },
  {
    lens: "US→MX (T12M-implied)",
    top1: "Mexico total ≈ pipe",
    top1Share: "9.3%",
    top3: "—",
    top3Share: "—",
    universe: "Banxico T12M / $685B",
    confidence: "estimated" as Confidence,
  },
  {
    lens: "MX real-adj. share",
    top1: "Illustrative −8.3%",
    top1Share: "8.5%",
    top3: "—",
    top3Share: "—",
    universe: "T12M × June real hit (not official)",
    confidence: "estimated" as Confidence,
  },
  {
    lens: "GDP dependence",
    top1: "Tajikistan",
    top1Share: "45% of GDP",
    top3: "TJ · NI · LB (avg)",
    top3Share: "~33% of GDP",
    universe: "Brief 41 dependence table",
    confidence: "disclosed" as Confidence,
  },
  {
    lens: "Host public pensions",
    top1: "Italy",
    top1Share: "16.3% of GDP",
    top3: "IT · FR · DE (avg)",
    top3Share: "~13.7% of GDP",
    universe: "OECD Pensions at a Glance",
    confidence: "disclosed" as Confidence,
  },
] as const;

export function fmtBn(n: number, digits = 0): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function recipientShares(vintage: VintageId): RecipientShare[] {
  if (vintage === "t12m") return RECIPIENT_SHARES_T12M;
  if (vintage === "banxico") return RECIPIENT_SHARES_BANXICO;
  return RECIPIENT_SHARES_BRIEF41;
}

export function recipientCurve(vintage: VintageId): ConcentrationCurvePoint[] {
  if (vintage === "t12m") return RECIPIENT_CURVE_T12M;
  if (vintage === "banxico") return RECIPIENT_CURVE_BANXICO;
  return RECIPIENT_CURVE_BRIEF41;
}

export function namedRecipients(vintage: VintageId): RecipientShare[] {
  return recipientShares(vintage).filter((r) => r.id !== "residual");
}
