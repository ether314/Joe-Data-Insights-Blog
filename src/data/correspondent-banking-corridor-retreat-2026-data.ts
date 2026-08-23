/**
 * Correspondent banking corridor retreat — 2026 desk synthesis.
 * Core question: Where has SWIFT/correspondent connectivity thinned the most,
 * and which corridors now depend on a handful of banks?
 *
 * Anchors: CPMI–SWIFT IBOS relationship/corridor series (2011–2019 published
 * window, carried forward with FSB CBCG framing), BIS Quarterly Review
 * “On the global retreat of correspondent banks” (Mar 2020), FSB Action Plan
 * progress reports on CBR decline. Later-year corridor and concentration
 * figures are desk-estimated extensions labeled confidence: estimated/carried
 * where the public IBOS chartpack has not refreshed at country grain.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Active correspondent (AC) and corridor counts follow CPMI–SWIFT IBOS / FSB CBCG published series through the 2011–2019 window (relationships ≈ −22% cumulative; corridors ≈ −12%). Regional AC declines and currency splits cite BIS QR Mar 2020 and FSB May 2019 progress framing. 2020–2025 corridor thinning, top-correspondent shares, and corridor-level AC ladders are desk-estimated order-of-magnitude extensions consistent with continued volume growth + relationship attrition; they are not a live SWIFT extract. Gini on ACs per corridor (~0.75 in 2018) is disclosed from FSB; later concentration proxies are estimated.";

export const SOURCES = [
  {
    label: "CPMI — Correspondent banking data commentary (May 2019)",
    url: "https://www.bis.org/cpmi/paysysinfo/corr_bank_data/corr_bank_data_commentary_1905.htm",
  },
  {
    label: "CPMI — Decline continues at a slower pace (Aug 2020)",
    url: "https://www.bis.org/cpmi/paysysinfo/corr_bank_data/corr_bank_data_commentary_2008.htm",
  },
  {
    label: "BIS QR — On the global retreat of correspondent banks (Mar 2020)",
    url: "https://www.bis.org/publ/qtrpdf/r_qt2003g.pdf",
  },
  {
    label: "FSB — Action plan progress report on CBR decline (May 2019)",
    url: "https://www.fsb.org/uploads/P290519-1.pdf",
  },
  {
    label: "BIS CPMI — Cross-border payments / correspondent banking hub",
    url: "https://www.bis.org/cpmi/paysysinfo/corr_bank_data.htm",
  },
] as const;

export const HEADLINE = {
  asOfPublished: "CPMI–SWIFT IBOS / FSB through 2019 window",
  asOfDesk: "Desk carry to 2025 corridor lens · Aug 2026",
  /** Cumulative active correspondent decline since 2011 */
  acDeclineSince2011Pct: 22,
  /** Cumulative active corridor decline since 2011 */
  corridorDeclineSince2011Pct: 12,
  /** Global corridors ≈ 10,800 → 9,800 (2011–2018 disclosed); desk ~9,450 by 2025 */
  corridors2011: 10800,
  corridors2018: 9800,
  corridors2025Est: 9450,
  /** FSB Gini on ACs per corridor (constant corridor population), 2018 */
  corridorAcGini2018: 0.75,
  corridorAcGini2025Est: 0.78,
  /** Share of message volume in corridors with ≤5 active correspondents (est.) */
  thinCorridorVolumeSharePct: 18,
  /** Jurisdictions with <20 active relationships (CPMI 2018 disclosed ≈15) */
  jurisdictionsUnder20Ac: 15,
  /** Currency AC decline in 2018 (FSB) */
  usdAcDecline2018Pct: 5.9,
  eurAcDecline2018Pct: 4.6,
  gbpAcDecline2018Pct: 3.0,
  /** Latin America / SIDS cumulative AC declines (BIS/CPMI framing) */
  latamAcDeclinePct: 34,
  sidsAcDeclinePct: 41,
  northAmericaAcDeclinePct: 13,
  /** Headline corridor dependency: median top-3 bank share of ACs in thin corridors */
  thinCorridorTop3SharePct: 71,
} as const;

export type RegionRetreat = {
  id: string;
  label: string;
  short: string;
  /** Cumulative AC decline 2011→latest published / carried */
  acDeclinePct: number;
  corridorDeclinePct: number;
  /** Remaining corridors index (2011 = 100) */
  corridorIndex2025: number;
  volumeIndex2025: number;
  fill: string;
  confidence: Confidence;
};

/** Regional retreat — declines anchored to BIS/CPMI regional bands; indices estimated */
export const REGION_RETREAT: RegionRetreat[] = [
  {
    id: "latam",
    label: "Latin America & Caribbean",
    short: "LatAm",
    acDeclinePct: 34,
    corridorDeclinePct: 18,
    corridorIndex2025: 78,
    volumeIndex2025: 128,
    fill: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "oceania",
    label: "Oceania (incl. Pacific SIDS)",
    short: "Oceania",
    acDeclinePct: 32,
    corridorDeclinePct: 16,
    corridorIndex2025: 80,
    volumeIndex2025: 118,
    fill: "#f59e0b",
    confidence: "disclosed",
  },
  {
    id: "africa",
    label: "Africa",
    short: "Africa",
    acDeclinePct: 28,
    corridorDeclinePct: 14,
    corridorIndex2025: 84,
    volumeIndex2025: 135,
    fill: "#ea580c",
    confidence: "carried",
  },
  {
    id: "e-europe",
    label: "Eastern Europe",
    short: "E. Europe",
    acDeclinePct: 24,
    corridorDeclinePct: 11,
    corridorIndex2025: 87,
    volumeIndex2025: 122,
    fill: "#8b5cf6",
    confidence: "carried",
  },
  {
    id: "asia",
    label: "Asia",
    short: "Asia",
    acDeclinePct: 20,
    corridorDeclinePct: 9,
    corridorIndex2025: 90,
    volumeIndex2025: 148,
    fill: "#0ea5e9",
    confidence: "carried",
  },
  {
    id: "w-europe",
    label: "Western Europe",
    short: "W. Europe",
    acDeclinePct: 18,
    corridorDeclinePct: 8,
    corridorIndex2025: 91,
    volumeIndex2025: 112,
    fill: "#64748b",
    confidence: "estimated",
  },
  {
    id: "n-america",
    label: "Northern America",
    short: "N. America",
    acDeclinePct: 13,
    corridorDeclinePct: 5,
    corridorIndex2025: 95,
    volumeIndex2025: 125,
    fill: "#10b981",
    confidence: "disclosed",
  },
];

export type GlobalSeriesPoint = {
  year: number;
  acIndex: number;
  corridorIndex: number;
  volumeIndex: number;
  confidence: Confidence;
};

/** 2011 = 100 for AC / corridor / message volume */
export const GLOBAL_SERIES: GlobalSeriesPoint[] = [
  { year: 2011, acIndex: 100, corridorIndex: 100, volumeIndex: 100, confidence: "disclosed" },
  { year: 2013, acIndex: 94, corridorIndex: 97, volumeIndex: 108, confidence: "disclosed" },
  { year: 2015, acIndex: 88, corridorIndex: 94, volumeIndex: 118, confidence: "disclosed" },
  { year: 2017, acIndex: 83, corridorIndex: 91, volumeIndex: 128, confidence: "disclosed" },
  { year: 2018, acIndex: 80, corridorIndex: 90, volumeIndex: 134, confidence: "disclosed" },
  { year: 2019, acIndex: 78, corridorIndex: 88, volumeIndex: 140, confidence: "disclosed" },
  { year: 2021, acIndex: 76, corridorIndex: 87, volumeIndex: 148, confidence: "estimated" },
  { year: 2023, acIndex: 74, corridorIndex: 86, volumeIndex: 158, confidence: "estimated" },
  { year: 2025, acIndex: 72, corridorIndex: 87.5, volumeIndex: 168, confidence: "estimated" },
];

export type ThinCorridor = {
  id: string;
  label: string;
  short: string;
  region: string;
  /** Active correspondents still messaging in corridor */
  activeCorrespondents: number;
  top1SharePct: number;
  top3SharePct: number;
  /** Message volume share of global sample (est.) */
  volumeSharePct: number;
  /** Cumulative AC decline since 2011 */
  acDeclinePct: number;
  fill: string;
  confidence: Confidence;
};

/** Illustrative thin corridors — AC counts and top shares are desk estimates */
export const THIN_CORRIDORS: ThinCorridor[] = [
  {
    id: "ht-us",
    label: "Haiti → United States",
    short: "HT→US",
    region: "LatAm",
    activeCorrespondents: 4,
    top1SharePct: 48,
    top3SharePct: 92,
    volumeSharePct: 0.4,
    acDeclinePct: 55,
    fill: "#f43f5e",
    confidence: "estimated",
  },
  {
    id: "ws-nz",
    label: "Samoa → New Zealand",
    short: "WS→NZ",
    region: "Oceania",
    activeCorrespondents: 3,
    top1SharePct: 52,
    top3SharePct: 100,
    volumeSharePct: 0.15,
    acDeclinePct: 48,
    fill: "#f59e0b",
    confidence: "estimated",
  },
  {
    id: "sb-au",
    label: "Solomon Islands → Australia",
    short: "SB→AU",
    region: "Oceania",
    activeCorrespondents: 3,
    top1SharePct: 55,
    top3SharePct: 100,
    volumeSharePct: 0.12,
    acDeclinePct: 50,
    fill: "#ea580c",
    confidence: "estimated",
  },
  {
    id: "jm-us",
    label: "Jamaica → United States",
    short: "JM→US",
    region: "LatAm",
    activeCorrespondents: 6,
    top1SharePct: 38,
    top3SharePct: 78,
    volumeSharePct: 0.55,
    acDeclinePct: 42,
    fill: "#e11d48",
    confidence: "estimated",
  },
  {
    id: "ng-uk",
    label: "Nigeria → United Kingdom",
    short: "NG→UK",
    region: "Africa",
    activeCorrespondents: 8,
    top1SharePct: 32,
    top3SharePct: 68,
    volumeSharePct: 1.1,
    acDeclinePct: 36,
    fill: "#c2410c",
    confidence: "estimated",
  },
  {
    id: "ke-ae",
    label: "Kenya → UAE",
    short: "KE→AE",
    region: "Africa",
    activeCorrespondents: 7,
    top1SharePct: 34,
    top3SharePct: 71,
    volumeSharePct: 0.7,
    acDeclinePct: 33,
    fill: "#b45309",
    confidence: "estimated",
  },
  {
    id: "bd-ae",
    label: "Bangladesh → UAE",
    short: "BD→AE",
    region: "Asia",
    activeCorrespondents: 9,
    top1SharePct: 28,
    top3SharePct: 62,
    volumeSharePct: 1.4,
    acDeclinePct: 30,
    fill: "#0ea5e9",
    confidence: "estimated",
  },
  {
    id: "ua-de",
    label: "Ukraine → Germany",
    short: "UA→DE",
    region: "E. Europe",
    activeCorrespondents: 11,
    top1SharePct: 26,
    top3SharePct: 58,
    volumeSharePct: 0.9,
    acDeclinePct: 28,
    fill: "#8b5cf6",
    confidence: "estimated",
  },
];

export type CurrencySplit = {
  id: string;
  label: string;
  short: string;
  decline2018Pct: number;
  shareOfMessagesPct: number;
  fill: string;
  confidence: Confidence;
};

export const CURRENCY_SPLITS: CurrencySplit[] = [
  {
    id: "usd",
    label: "US dollar",
    short: "USD",
    decline2018Pct: 5.9,
    shareOfMessagesPct: 42,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "eur",
    label: "Euro",
    short: "EUR",
    decline2018Pct: 4.6,
    shareOfMessagesPct: 31,
    fill: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    id: "gbp",
    label: "Pound sterling",
    short: "GBP",
    decline2018Pct: 3.0,
    shareOfMessagesPct: 8,
    fill: "#f59e0b",
    confidence: "disclosed",
  },
  {
    id: "other",
    label: "Other currencies",
    short: "Other",
    decline2018Pct: 3.8,
    shareOfMessagesPct: 19,
    fill: "#64748b",
    confidence: "estimated",
  },
];

export type ConcentrationCurvePoint = {
  corridorPct: number;
  acSharePct: number;
  messageSharePct: number;
};

/** Lorenz-style: cumulative share of ACs / messages by corridor rank */
export const CONCENTRATION_CURVE: ConcentrationCurvePoint[] = [
  { corridorPct: 0, acSharePct: 0, messageSharePct: 0 },
  { corridorPct: 10, acSharePct: 2, messageSharePct: 28 },
  { corridorPct: 20, acSharePct: 5, messageSharePct: 45 },
  { corridorPct: 40, acSharePct: 14, messageSharePct: 68 },
  { corridorPct: 60, acSharePct: 28, messageSharePct: 82 },
  { corridorPct: 80, acSharePct: 52, messageSharePct: 92 },
  { corridorPct: 100, acSharePct: 100, messageSharePct: 100 },
];

export type AcBucket = {
  id: string;
  label: string;
  short: string;
  corridorSharePct: number;
  volumeSharePct: number;
  fill: string;
};

/** Corridors by active-correspondent count bucket (desk estimate) */
export const AC_BUCKETS: AcBucket[] = [
  {
    id: "1-3",
    label: "1–3 active correspondents",
    short: "1–3",
    corridorSharePct: 22,
    volumeSharePct: 6,
    fill: "#f43f5e",
  },
  {
    id: "4-5",
    label: "4–5 active correspondents",
    short: "4–5",
    corridorSharePct: 18,
    volumeSharePct: 12,
    fill: "#f59e0b",
  },
  {
    id: "6-10",
    label: "6–10 active correspondents",
    short: "6–10",
    corridorSharePct: 28,
    volumeSharePct: 24,
    fill: "#0ea5e9",
  },
  {
    id: "11plus",
    label: "11+ active correspondents",
    short: "11+",
    corridorSharePct: 32,
    volumeSharePct: 58,
    fill: "#10b981",
  },
];

export type LensCompare = {
  id: string;
  label: string;
  short: string;
  value: number;
  unit: string;
  fill: string;
};

export const LENS_COMPARE: LensCompare[] = [
  {
    id: "ac-decline",
    label: "Global AC decline since 2011",
    short: "AC −%",
    value: HEADLINE.acDeclineSince2011Pct,
    unit: "%",
    fill: "#f43f5e",
  },
  {
    id: "corr-decline",
    label: "Global corridor decline since 2011",
    short: "Corr −%",
    value: HEADLINE.corridorDeclineSince2011Pct,
    unit: "%",
    fill: "#f59e0b",
  },
  {
    id: "thin-vol",
    label: "Volume in ≤5-AC corridors",
    short: "Thin vol",
    value: HEADLINE.thinCorridorVolumeSharePct,
    unit: "%",
    fill: "#8b5cf6",
  },
  {
    id: "top3-thin",
    label: "Median top-3 share in thin corridors",
    short: "Top-3",
    value: HEADLINE.thinCorridorTop3SharePct,
    unit: "%",
    fill: "#0ea5e9",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtIndex(n: number): string {
  return n.toFixed(n % 1 === 0 ? 0 : 1);
}
