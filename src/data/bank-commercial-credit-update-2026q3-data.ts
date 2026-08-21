/**
 * Bank & commercial credit — Q3 2026 vintage update.
 * Prior theme post: bank-commercial-credit-update-2026 (Fed SA 2026Q1 loss map).
 * New vintage: July 2026 SLOOS (Q2 conditions, published Aug 3) + Trepp July 2026
 * CMBS delinquency. Fed charge-off/delinquency SA still closes on 2026Q1 (May 19).
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Q3 vintage delta vs bank-commercial-credit-update-2026. Fed SA charge-off and delinquency levels are carried from the May 19, 2026 release through 2026Q1 (no newer quarterly SA print as of Aug 20, 2026). Credit-supply deltas from Federal Reserve July 2026 Senior Loan Officer Opinion Survey (chart data; period 2026:3 = July survey covering 2026Q2). CMBS property-type delinquencies from Trepp July 2026 Delinquency Report (office 11.91%, overall 7.86%, multifamily 7.69%). Prior-post CMBS anchors (office 11.31%, multifamily 6.64%) are the Aug update / FDIC Risk Review framing. Net % = share tightening minus share easing; negative = net easing.";

export const SOURCES = [
  {
    label: "July 2026 SLOOS (Fed)",
    url: "https://www.federalreserve.gov/data/sloos/sloos-202607.htm",
  },
  {
    label: "SLOOS chart data",
    url: "https://www.federalreserve.gov/data/sloos/sloos-202607-chart-data.htm",
  },
  {
    label: "Fed charge-off rates (SA, carried 2026Q1)",
    url: "https://www.federalreserve.gov/releases/Chargeoff/chgallsa.htm",
  },
  {
    label: "Trepp — July 2026 CMBS delinquency",
    url: "https://www.trepp.com/trepptalk/cmbs-delinquency-report-july-2026",
  },
  {
    label: "Prior theme update — Bank & commercial credit",
    url: "/blog/bank-commercial-credit-update-2026",
  },
] as const;

/** Headline meters — Q3 supply/CMBS delta vs Aug update print */
export const HEADLINE = {
  priorAsOf: "Aug update (Fed SA 2026Q1 · estimated SLOOS tighten)",
  newAsOf: "July 2026 SLOOS + Trepp July CMBS",
  fedSaAsOf: "2026Q1 Fed SA (May 19, 2026 — unchanged)",
  sloosCreNfnrNet: -11.3,
  sloosCreNfnrPriorEst: 12,
  sloosCreNfnrDeltaVsPrior: -23.3,
  sloosCreMfNet: -5.7,
  sloosCreCldNet: -3.7,
  sloosCiLargeNet: 0.0,
  sloosCiSmallNet: 1.8,
  sloosCardsTightenNet: 6.7,
  cmbsOfficePrior: 11.31,
  cmbsOfficeNew: 11.91,
  cmbsOfficeDelta: 0.6,
  cmbsMfPrior: 6.64,
  cmbsMfNew: 7.69,
  cmbsMfDelta: 1.05,
  cmbsOverallNew: 7.86,
  cmbsOverallMomBp: 51,
  cardsChargeOff: 3.84,
  creDelinq: 1.56,
  creChargeOff: 0.17,
  creMultiple: 9.2,
  ciChargeOff: 0.59,
} as const;

export type LedgerId =
  | "sloosNfnr"
  | "sloosMf"
  | "cmbsOffice"
  | "cmbsMf"
  | "cardsCharge"
  | "creDelinq"
  | "sloosCi"
  | "sloosCards";

export type VintageMeter = {
  id: LedgerId;
  label: string;
  prior: number;
  neu: number;
  delta: number;
  unit: "netPct" | "pct" | "pp";
  deltaLabel: string;
  direction: "up" | "down" | "flat";
  note: string;
  confidence: Confidence;
};

/** Scoreboard — signed moves vs prior theme update */
export const VINTAGE_METERS: VintageMeter[] = [
  {
    id: "sloosNfnr",
    label: "SLOOS NFNR standards",
    prior: 12,
    neu: -11.3,
    delta: -23.3,
    unit: "netPct",
    deltaLabel: "−23.3 pp vs prior est.",
    direction: "down",
    note: "Prior update estimated net tightening; July survey shows moderate easing",
    confidence: "disclosed",
  },
  {
    id: "sloosMf",
    label: "SLOOS multifamily standards",
    prior: 12,
    neu: -5.7,
    delta: -17.7,
    unit: "netPct",
    deltaLabel: "−17.7 pp vs prior est.",
    direction: "down",
    note: "Modest net easing; large banks led the flip",
    confidence: "disclosed",
  },
  {
    id: "cmbsMf",
    label: "CMBS multifamily delinq",
    prior: 6.64,
    neu: 7.69,
    delta: 1.05,
    unit: "pct",
    deltaLabel: "+1.05 pp",
    direction: "up",
    note: "Trepp July vs prior-post Risk Review anchor",
    confidence: "disclosed",
  },
  {
    id: "cmbsOffice",
    label: "CMBS office delinq",
    prior: 11.31,
    neu: 11.91,
    delta: 0.6,
    unit: "pct",
    deltaLabel: "+0.60 pp",
    direction: "up",
    note: "New all-time-high territory on Trepp office book",
    confidence: "disclosed",
  },
  {
    id: "sloosCards",
    label: "SLOOS card standards",
    prior: 0,
    neu: 6.7,
    delta: 6.7,
    unit: "netPct",
    deltaLabel: "+6.7 net tighten",
    direction: "up",
    note: "Modest net tightening while card charge-offs still cool on Fed SA",
    confidence: "disclosed",
  },
  {
    id: "sloosCi",
    label: "SLOOS C&I standards (lg/med)",
    prior: 8,
    neu: 0.0,
    delta: -8.0,
    unit: "netPct",
    deltaLabel: "0.0 net (unchanged)",
    direction: "flat",
    note: "Basically unchanged; demand stronger for large/middle-market firms",
    confidence: "disclosed",
  },
  {
    id: "cardsCharge",
    label: "Card charge-offs (Fed SA)",
    prior: 3.84,
    neu: 3.84,
    delta: 0,
    unit: "pct",
    deltaLabel: "unchanged vintage",
    direction: "flat",
    note: "Still 2026Q1 SA — no newer Fed charge-off print",
    confidence: "disclosed",
  },
  {
    id: "creDelinq",
    label: "CRE delinquency (Fed SA)",
    prior: 1.56,
    neu: 1.56,
    delta: 0,
    unit: "pct",
    deltaLabel: "unchanged vintage",
    direction: "flat",
    note: "Sticky 1.56% carried; watch next Fed SA for conversion",
    confidence: "disclosed",
  },
];

export type SloosCreRow = {
  label: string;
  sortKey: number;
  cld: number;
  nfnr: number;
  mf: number;
  ciLarge: number;
  cards: number;
  confidence: Confidence;
};

/** SLOOS path — Fed chart-data period labels (:3 = July survey) */
export const SLOOS_CRE_PATH: SloosCreRow[] = [
  { label: "24Q3", sortKey: 2024.5, cld: 23.8, nfnr: 20.6, mf: 22.2, ciLarge: 7.9, cards: 20.0, confidence: "disclosed" },
  { label: "24Q4", sortKey: 2024.75, cld: 14.8, nfnr: 16.4, mf: 19.7, ciLarge: 0.0, cards: 18.4, confidence: "disclosed" },
  { label: "25Q1", sortKey: 2025.0, cld: 9.5, nfnr: 8.1, mf: 3.2, ciLarge: 6.2, cards: 9.4, confidence: "disclosed" },
  { label: "25Q2", sortKey: 2025.25, cld: 11.1, nfnr: 10.9, mf: 1.6, ciLarge: 18.5, cards: 5.6, confidence: "disclosed" },
  { label: "25Q3", sortKey: 2025.5, cld: 9.7, nfnr: 11.5, mf: 4.8, ciLarge: 9.5, cards: 10.4, confidence: "disclosed" },
  { label: "25Q4", sortKey: 2025.75, cld: 6.6, nfnr: 3.3, mf: 1.6, ciLarge: 6.5, cards: 4.2, confidence: "disclosed" },
  { label: "26Q1", sortKey: 2026.0, cld: 1.8, nfnr: -3.6, mf: -5.5, ciLarge: 5.3, cards: 0.0, confidence: "disclosed" },
  { label: "26Q2", sortKey: 2026.25, cld: 4.9, nfnr: -3.3, mf: 0.0, ciLarge: 8.1, cards: 2.0, confidence: "disclosed" },
  { label: "26Q3", sortKey: 2026.5, cld: -3.7, nfnr: -11.3, mf: -5.7, ciLarge: 0.0, cards: 6.7, confidence: "disclosed" },
];

export type CmbsProperty = {
  id: string;
  label: string;
  short: string;
  prior: number;
  neu: number;
  delta: number;
  momBp: number | null;
  confidence: Confidence;
};

/** CMBS property-type dumbbell — prior post → Trepp July 2026 */
export const CMBS_PROPERTIES: CmbsProperty[] = [
  {
    id: "office",
    label: "Office",
    short: "Office",
    prior: 11.31,
    neu: 11.91,
    delta: 0.6,
    momBp: 34,
    confidence: "disclosed",
  },
  {
    id: "multifamily",
    label: "Multifamily",
    short: "Multifamily",
    prior: 6.64,
    neu: 7.69,
    delta: 1.05,
    momBp: 46,
    confidence: "disclosed",
  },
  {
    id: "overall",
    label: "All CMBS",
    short: "Overall",
    prior: 7.35,
    neu: 7.86,
    delta: 0.51,
    momBp: 51,
    confidence: "estimated",
  },
  {
    id: "lodging",
    label: "Lodging",
    short: "Lodging",
    prior: 5.22,
    neu: 5.35,
    delta: 0.13,
    momBp: 13,
    confidence: "estimated",
  },
];

/** Carried Fed SA quarterly path (same print as prior update) */
export const FED_SA_PATH: {
  quarter: string;
  label: string;
  sortKey: number;
  creDelinq: number;
  creChargeOff: number;
  cardsDelinq: number;
  cardsChargeOff: number;
  ciChargeOff: number;
  confidence: Confidence;
}[] = [
  { quarter: "2024Q4", label: "24Q4", sortKey: 2024.75, creDelinq: 1.56, creChargeOff: 0.25, cardsDelinq: 3.08, cardsChargeOff: 4.56, ciChargeOff: 0.52, confidence: "disclosed" },
  { quarter: "2025Q1", label: "25Q1", sortKey: 2025.0, creDelinq: 1.57, creChargeOff: 0.22, cardsDelinq: 3.06, cardsChargeOff: 4.46, ciChargeOff: 0.55, confidence: "disclosed" },
  { quarter: "2025Q2", label: "25Q2", sortKey: 2025.25, creDelinq: 1.57, creChargeOff: 0.18, cardsDelinq: 3.04, cardsChargeOff: 4.21, ciChargeOff: 0.58, confidence: "disclosed" },
  { quarter: "2025Q3", label: "25Q3", sortKey: 2025.5, creDelinq: 1.58, creChargeOff: 0.16, cardsDelinq: 2.98, cardsChargeOff: 4.14, ciChargeOff: 0.57, confidence: "estimated" },
  { quarter: "2025Q4", label: "25Q4", sortKey: 2025.75, creDelinq: 1.58, creChargeOff: 0.14, cardsDelinq: 2.94, cardsChargeOff: 4.07, ciChargeOff: 0.56, confidence: "disclosed" },
  { quarter: "2026Q1", label: "26Q1", sortKey: 2026.0, creDelinq: 1.56, creChargeOff: 0.17, cardsDelinq: 2.92, cardsChargeOff: 3.84, ciChargeOff: 0.59, confidence: "disclosed" },
];

/** Bank book vs CMBS stress map */
export const STRESS_MAP = [
  { short: "Cards (bank)", delinquency: 2.92, chargeOff: 3.84, book: "bank" },
  { short: "CRE (bank)", delinquency: 1.56, chargeOff: 0.17, book: "bank" },
  { short: "C&I (bank)", delinquency: 1.34, chargeOff: 0.59, book: "bank" },
  { short: "CMBS office", delinquency: 11.91, chargeOff: null, book: "cmbs" },
  { short: "CMBS MF", delinquency: 7.69, chargeOff: null, book: "cmbs" },
  { short: "CMBS all", delinquency: 7.86, chargeOff: null, book: "cmbs" },
] as const;

/** Size-split narrative meters from July SLOOS footnotes */
export const SIZE_SPLIT = [
  { id: "largeNfnr", label: "Large banks · NFNR", note: "Eased standards (all CRE types)", direction: "ease" as const },
  { id: "otherNfnr", label: "Other banks · MF/CLD", note: "Basically unchanged", direction: "flat" as const },
  { id: "foreignCre", label: "Foreign banks · CRE", note: "Moderate net tightening", direction: "tighten" as const },
];

export type ScoreboardRow = {
  signal: string;
  prior: string;
  neu: string;
  delta: string;
  lens: string;
};

export const SCOREBOARD: ScoreboardRow[] = [
  {
    signal: "SLOOS NFNR net % tighten",
    prior: "+12 (est.)",
    neu: "−11.3",
    delta: "Flip to moderate easing",
    lens: "July SLOOS",
  },
  {
    signal: "SLOOS multifamily net %",
    prior: "+12 (est.)",
    neu: "−5.7",
    delta: "Modest easing",
    lens: "July SLOOS",
  },
  {
    signal: "SLOOS CLD net %",
    prior: "Firm",
    neu: "−3.7",
    delta: "Basically unchanged",
    lens: "July SLOOS",
  },
  {
    signal: "SLOOS C&I (large/med)",
    prior: "+8 (est.)",
    neu: "0.0",
    delta: "Unchanged standards",
    lens: "July SLOOS",
  },
  {
    signal: "SLOOS credit cards",
    prior: "—",
    neu: "+6.7",
    delta: "Modest tighten",
    lens: "July SLOOS",
  },
  {
    signal: "CMBS office delinq",
    prior: "11.31%",
    neu: "11.91%",
    delta: "+0.60 pp",
    lens: "Trepp July",
  },
  {
    signal: "CMBS multifamily delinq",
    prior: "6.64%",
    neu: "7.69%",
    delta: "+1.05 pp",
    lens: "Trepp July",
  },
  {
    signal: "CMBS overall delinq",
    prior: "~7.35%",
    neu: "7.86%",
    delta: "+51 bp MoM",
    lens: "Trepp July",
  },
  {
    signal: "Card charge-offs (Fed SA)",
    prior: "3.84%",
    neu: "3.84%",
    delta: "Same vintage",
    lens: "Carried 2026Q1",
  },
  {
    signal: "CRE delinq / charge-off",
    prior: "1.56% / 0.17%",
    neu: "1.56% / 0.17%",
    delta: "~9.2× multiple",
    lens: "Carried 2026Q1",
  },
];

export function meterDeltasSorted(): (VintageMeter & { sortDelta: number })[] {
  return [...VINTAGE_METERS]
    .map((m) => ({ ...m, sortDelta: m.delta }))
    .sort((a, b) => a.sortDelta - b.sortDelta);
}

export function cmbsDeltasSorted() {
  return [...CMBS_PROPERTIES].sort((a, b) => a.delta - b.delta);
}

export function fmtPct(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 2): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtNet(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}`;
}
