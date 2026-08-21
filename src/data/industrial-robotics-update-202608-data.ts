/**
 * Industrial robotics — August 2026 vintage update.
 * Core question: What changed after the IFR April/June 2026 prelim (621k world,
 * US installs +11%) once A3’s Q2 / H1 2026 North American *order* book lands?
 *
 * Primary sources:
 * - A3 Q2 2026 North American robot orders (released ~11 Aug 2026)
 * - A3 FY 2025 North American orders (prior-year book)
 * - Prior theme update: /blog/industrial-robotics-update-2026q3 (IFR prelim)
 *
 * Scope note: A3 reports member-vendor *orders* (bookings), not IFR installations.
 */

export type Confidence = "disclosed" | "derived" | "estimated";

export const SOURCE_NOTE =
  "August 2026 vintage vs prior Q3 IFR prelim: A3 North American robot *orders* (US/Canada/Mexico member vendors), Q2 and H1 2026 released ~11 Aug 2026. Orders ≠ installations; booking-to-bolt lag is typically quarters. Implied ASP = order value ÷ units (derived). Automotive OEM YoY is H1-over-H1 only — A3 did not publish a separate Q2 OEM figure. Final IFR World Robotics 2026 (full 2025 installs) still due 24 Sep 2026.";

export const A3_Q2_URL =
  "https://www.automate.org/robotics/news/robot-orders-increase-in-q2-as-automation-demand-broadens-across-industries";
export const IFR_US_URL =
  "https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth";
export const PRIOR_Q3_PATH = "/blog/industrial-robotics-update-2026q3";
export const PRIOR_YOY_PATH = "/blog/industrial-robotics-update-2026";
export const RESEARCH_PATH = "/blog/industrial-robotics-research-2026";
export const DENSITY_PATH = "/blog/manufacturing-robot-density-ifr-2024";

export const SOURCES = [
  {
    label: "A3 — Robot orders rise in Q2 2026 (Aug 2026)",
    url: A3_Q2_URL,
  },
  {
    label: "IFR — US robot industry returns to double-digit growth (Jun 2026)",
    url: IFR_US_URL,
  },
  {
    label: "Prior theme update — IFR prelim 2025 / Q3 vintage",
    url: PRIOR_Q3_PATH,
  },
  {
    label: "Prior YoY update — WR 2025 flat-year delta",
    url: PRIOR_YOY_PATH,
  },
];

/** Headline delta — prior IFR install rebound vs A3 NA order-book mix */
export const HEADLINE = {
  q2Units: 8_940,
  q2ValueM: 622,
  q2UnitsYoyPct: 4.3,
  q2ValueYoyPct: 21.3,
  q2Asp: 69_575,
  q2AspPriorApprox: 59_830,
  q2AspYoyPct: 16,
  h1Units: 17_995,
  h1ValueM: 1_166,
  h1UnitsYoyPct: 2.0,
  h1ValueYoyPct: 6.6,
  h1Asp: 64_800,
  fy2025Units: 36_766,
  fy2025ValueM: 2_250,
  fy2025UnitsYoyPct: 6.6,
  fy2025ValueYoyPct: 10.1,
  fy2025Asp: 61_200,
  q1UnitsApprox: 9_055,
  q1ValueMApprox: 544,
  q1AspApprox: 60_100,
  autoOemH1YoyPct: -25,
  autoComponentH1YoyPct: 24,
  autoComponentQ2YoyPct: 20,
  semiElectronicsH1YoyPct: 35,
  semiElectronicsQ2YoyPct: 38,
  lifeSciH1YoyPct: 32,
  lifeSciQ2YoyPct: 9,
  foodH1YoyPct: 17,
  foodQ2YoyPct: 18,
  metalsQ2YoyPct: 18,
  plasticsH1YoyPct: 6,
  otherH1YoyPct: 6,
  nonAutoShareQ2Pct: 56,
  cobotQ2Units: 1_137,
  cobotQ2ValueM: 44,
  cobotQ2UnitSharePct: 12.7,
  cobotQ2ValueSharePct: 7.1,
  cobotH1Units: 2_774,
  cobotH1ValueM: 114,
  cobotH1UnitSharePct: 15.4,
  cobotH1ValueSharePct: 9.8,
  cobotFy2025Units: 7_212,
  cobotFy2025ValueM: 241,
  cobotFy2025UnitSharePct: 19.6,
  cobotFy2025ValueSharePct: 10.7,
  valueVsUnitsMultipleQ2: 4.95,
  ifrWorld2025Prelim: 621_000,
  ifrWorldYoyPct: 15,
  ifrUs2025: 38_000,
  ifrUsYoyPct: 11,
  ifrFinalDue: "2026-09-24",
  a3Released: "2026-08-11",
};

export type PeriodId = "Q2" | "H1" | "FY2025";

export type BookRow = {
  period: PeriodId;
  label: string;
  units: number;
  valueM: number;
  unitsYoyPct: number | null;
  valueYoyPct: number | null;
  asp: number;
  confidence: Confidence;
  note: string;
};

/** North American order book — units, value, implied ASP */
export const ORDER_BOOK: BookRow[] = [
  {
    period: "FY2025",
    label: "FY 2025",
    units: 36_766,
    valueM: 2_250,
    unitsYoyPct: 6.6,
    valueYoyPct: 10.1,
    asp: 61_200,
    confidence: "disclosed",
    note: "Full-year A3 North America orders",
  },
  {
    period: "H1",
    label: "H1 2026",
    units: 17_995,
    valueM: 1_166,
    unitsYoyPct: 2.0,
    valueYoyPct: 6.6,
    asp: 64_800,
    confidence: "disclosed",
    note: "First-half totals; ASP derived",
  },
  {
    period: "Q2",
    label: "Q2 2026",
    units: 8_940,
    valueM: 622,
    unitsYoyPct: 4.3,
    valueYoyPct: 21.3,
    asp: 69_575,
    confidence: "disclosed",
    note: "Units + value disclosed; ASP derived",
  },
];

export type AspPoint = {
  id: string;
  label: string;
  asp: number;
  units: number;
  valueM: number;
  kind: "fy" | "q1-derived" | "h1" | "q2";
  confidence: Confidence;
};

/** ASP path — price-mix step change is a Q2 event */
export const ASP_PATH: AspPoint[] = [
  {
    id: "fy2025",
    label: "FY '25",
    asp: 61_200,
    units: 36_766,
    valueM: 2_250,
    kind: "fy",
    confidence: "derived",
  },
  {
    id: "q1",
    label: "Q1 '26≈",
    asp: 60_100,
    units: 9_055,
    valueM: 544,
    kind: "q1-derived",
    confidence: "derived",
  },
  {
    id: "h1",
    label: "H1 '26",
    asp: 64_800,
    units: 17_995,
    valueM: 1_166,
    kind: "h1",
    confidence: "derived",
  },
  {
    id: "q2",
    label: "Q2 '26",
    asp: 69_575,
    units: 8_940,
    valueM: 622,
    kind: "q2",
    confidence: "derived",
  },
];

export type IndustryYoy = {
  industry: string;
  shortLabel: string;
  group: "auto" | "general" | "tech";
  q2YoyPct: number | null;
  h1YoyPct: number | null;
  confidence: Confidence;
  note?: string;
};

export const INDUSTRY_YOY: IndustryYoy[] = [
  {
    industry: "Automotive OEM",
    shortLabel: "Auto OEM",
    group: "auto",
    q2YoyPct: null,
    h1YoyPct: -25,
    confidence: "disclosed",
    note: "H1-only disclosure; no separate Q2 OEM figure",
  },
  {
    industry: "Automotive component",
    shortLabel: "Auto comp.",
    group: "auto",
    q2YoyPct: 20,
    h1YoyPct: 24,
    confidence: "disclosed",
    note: "Supply base buying while assemblers pause",
  },
  {
    industry: "Semi & electronics / photonics",
    shortLabel: "Semi/electro",
    group: "tech",
    q2YoyPct: 38,
    h1YoyPct: 35,
    confidence: "disclosed",
  },
  {
    industry: "Life sciences / pharma / biomed",
    shortLabel: "Life sci.",
    group: "tech",
    q2YoyPct: 9,
    h1YoyPct: 32,
    confidence: "disclosed",
    note: "H1 surge decelerated inside Q2",
  },
  {
    industry: "Food & consumer goods",
    shortLabel: "Food/CG",
    group: "general",
    q2YoyPct: 18,
    h1YoyPct: 17,
    confidence: "disclosed",
  },
  {
    industry: "Metals",
    shortLabel: "Metals",
    group: "general",
    q2YoyPct: 18,
    h1YoyPct: null,
    confidence: "disclosed",
    note: "Q2 disclosed; H1 not broken out in release",
  },
  {
    industry: "Plastics & rubber",
    shortLabel: "Plastics",
    group: "general",
    q2YoyPct: null,
    h1YoyPct: 6,
    confidence: "disclosed",
  },
  {
    industry: "All other industries",
    shortLabel: "Other",
    group: "general",
    q2YoyPct: null,
    h1YoyPct: 6,
    confidence: "disclosed",
  },
];

export type CobotShare = {
  period: string;
  unitSharePct: number;
  valueSharePct: number;
  units: number;
  valueM: number;
  confidence: Confidence;
};

export const COBOT_SHARE: CobotShare[] = [
  {
    period: "FY 2025",
    unitSharePct: 19.6,
    valueSharePct: 10.7,
    units: 7_212,
    valueM: 241,
    confidence: "disclosed",
  },
  {
    period: "H1 2026",
    unitSharePct: 15.4,
    valueSharePct: 9.8,
    units: 2_774,
    valueM: 114,
    confidence: "disclosed",
  },
  {
    period: "Q2 2026",
    unitSharePct: 12.7,
    valueSharePct: 7.1,
    units: 1_137,
    valueM: 44,
    confidence: "disclosed",
  },
];

export type VintageDelta = {
  id: string;
  label: string;
  group: "bridge" | "mix" | "price" | "sector";
  priorValue: number;
  newValue: number;
  delta: number;
  unit: "pct" | "pp" | "usd" | "units";
  priorLabel: string;
  newLabel: string;
  confidence: Confidence;
};

/** Diverging deltas vs prior theme prints / prior-year order book */
export const VINTAGE_DELTAS: VintageDelta[] = [
  {
    id: "q2-value-vs-units",
    label: "Q2 value YoY vs units YoY",
    group: "price",
    priorValue: 4.3,
    newValue: 21.3,
    delta: 17,
    unit: "pp",
    priorLabel: "Units YoY",
    newLabel: "Value YoY",
    confidence: "disclosed",
  },
  {
    id: "asp-q2-vs-fy",
    label: "Implied ASP (Q2 vs FY '25)",
    group: "price",
    priorValue: 61_200,
    newValue: 69_575,
    delta: 8_375,
    unit: "usd",
    priorLabel: "FY 2025 ASP",
    newLabel: "Q2 2026 ASP",
    confidence: "derived",
  },
  {
    id: "auto-oem-h1",
    label: "Automotive OEM H1 orders",
    group: "sector",
    priorValue: 0,
    newValue: -25,
    delta: -25,
    unit: "pct",
    priorLabel: "H1 2025 baseline",
    newLabel: "H1 2026 YoY",
    confidence: "disclosed",
  },
  {
    id: "auto-comp-h1",
    label: "Automotive component H1",
    group: "sector",
    priorValue: 0,
    newValue: 24,
    delta: 24,
    unit: "pct",
    priorLabel: "H1 2025 baseline",
    newLabel: "H1 2026 YoY",
    confidence: "disclosed",
  },
  {
    id: "semi-q2",
    label: "Semi / electronics Q2",
    group: "sector",
    priorValue: 0,
    newValue: 38,
    delta: 38,
    unit: "pct",
    priorLabel: "Q2 2025 baseline",
    newLabel: "Q2 2026 YoY",
    confidence: "disclosed",
  },
  {
    id: "cobot-unit-share",
    label: "Cobot unit share",
    group: "mix",
    priorValue: 19.6,
    newValue: 12.7,
    delta: -6.9,
    unit: "pp",
    priorLabel: "FY 2025 share",
    newLabel: "Q2 2026 share",
    confidence: "disclosed",
  },
  {
    id: "non-auto-q2",
    label: "Non-auto unit share (Q2)",
    group: "mix",
    priorValue: 50,
    newValue: 56,
    delta: 6,
    unit: "pp",
    priorLabel: "~majority floor",
    newLabel: "Q2 2026 share",
    confidence: "estimated",
  },
  {
    id: "h1-units",
    label: "H1 NA order units YoY",
    group: "bridge",
    priorValue: 6.6,
    newValue: 2.0,
    delta: -4.6,
    unit: "pp",
    priorLabel: "FY 2025 units YoY",
    newLabel: "H1 2026 units YoY",
    confidence: "disclosed",
  },
  {
    id: "vs-ifr-us",
    label: "NA orders vs IFR US installs lens",
    group: "bridge",
    priorValue: 11,
    newValue: 4.3,
    delta: -6.7,
    unit: "pp",
    priorLabel: "IFR US 2025 install YoY",
    newLabel: "A3 Q2 2026 order YoY",
    confidence: "estimated",
  },
];

export type BridgeStep = {
  id: string;
  label: string;
  value: number;
  kind: "start" | "delta" | "end";
};

/** Narrative bridge: IFR US install rebound → A3 Q2 order-book reality */
export const LENS_BRIDGE: BridgeStep[] = [
  { id: "ifr-us", label: "IFR US '25 installs YoY", value: 11, kind: "start" },
  { id: "to-orders", label: "Shift to A3 order lens", value: -6.7, kind: "delta" },
  { id: "q2-units", label: "A3 Q2 '26 units YoY", value: 4.3, kind: "end" },
  { id: "value-gap", label: "Value YoY minus units YoY", value: 17, kind: "delta" },
  { id: "q2-value", label: "A3 Q2 '26 value YoY", value: 21.3, kind: "end" },
];

export type MixSlice = {
  id: string;
  label: string;
  sharePct: number;
  tone: "auto" | "non-auto";
};

export const Q2_MIX: MixSlice[] = [
  { id: "non-auto", label: "Non-automotive", sharePct: 56, tone: "non-auto" },
  { id: "auto", label: "Automotive (OEM + component)", sharePct: 44, tone: "auto" },
];

export const PERIOD_COLORS: Record<PeriodId, string> = {
  FY2025: "#94a3b8",
  H1: "#0f766e",
  Q2: "#be123c",
};

export function fmtUnits(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 10_000) return `${Math.round(n / 1000)}k`;
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString("en-US");
}

export function fmtMoneyM(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}B`;
  return `$${n.toLocaleString("en-US")}M`;
}

export function fmtAsp(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export type DeltaGroup = VintageDelta["group"] | "All";
export type IndustryGroup = IndustryYoy["group"] | "All";
export type MetricMode = "units" | "value" | "asp";

export function deltasFor(group: DeltaGroup): VintageDelta[] {
  if (group === "All") return VINTAGE_DELTAS;
  return VINTAGE_DELTAS.filter((d) => d.group === group);
}

export function industriesFor(group: IndustryGroup): IndustryYoy[] {
  if (group === "All") return INDUSTRY_YOY;
  return INDUSTRY_YOY.filter((i) => i.group === group);
}

export function industryYoyForPeriod(
  row: IndustryYoy,
  period: "Q2" | "H1",
): number | null {
  return period === "Q2" ? row.q2YoyPct : row.h1YoyPct;
}
