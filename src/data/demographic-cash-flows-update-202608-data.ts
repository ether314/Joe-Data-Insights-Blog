/**
 * Demographic cash flows — August 2026 (202608) vintage update.
 * Second look at Banxico’s June 2026 remittance bulletin after the Q3 H1-rebound
 * post: trailing-twelve softness, real purchasing-power erosion, state mix,
 * and seasonally adjusted MoM fade — while OECD host pensions stay on path.
 *
 * Core question: What changed vs demographic-cash-flows-update-2026q3, and how
 * do age + migration still show up once T12M and real terms qualify the rebound?
 */

export type Confidence = "disclosed" | "estimated" | "constructed";

export const SOURCE_NOTE =
  "Aug 202608 vintage delta vs demographic-cash-flows-update-2026q3: Banxico Ingresos y Egresos por Remesas (junio 2026) T12M Jul’25–Jun’26 incomes $63.389B (−0.1% YoY), T12M remittance-account surplus $62.166B, SA June MoM incomes −2.4%; BBVA Research (3 Aug 2026) real remittance purchasing power −8.3% in June, five consecutive YoY growth months, Guanajuato H1 $2.705B / CDMX +27.3%; H1 $30.759B (+3.1%) and OECD PaG 2025 OECD-32 8.8%→10.0% by 2050 retained from Q3 anchors.";

export const SOURCES = [
  {
    label: "Banxico — Remesas junio 2026 (T12M $63.39B)",
    href: "https://www.banxico.org.mx/publicaciones-y-prensa/remesas/%7BD61BA269-E1F5-F27F-B347-CE8949A9C573%7D.pdf",
  },
  {
    label: "BBVA Research — Five months of growth through June",
    href: "https://www.bbvaresearch.com/en/publicaciones/mexico-through-june-remittances-mark-5-months-of-growth/",
  },
  {
    label: "Monex — Remesas resilientes; T12M −0.1%",
    href: "https://www.monex.com.mx/portal/download/reportes/260803%20Mex%20Remesas.pdf",
  },
  {
    label: "OECD Pensions at a Glance 2025 — long-term path",
    href: "https://www.oecd.org/en/publications/2025/11/pensions-at-a-glance-2025_76510fe4/full-report/long-term-projections-of-public-pension-expenditure_af4ed734.html",
  },
  {
    label: "Prior Q3 theme update — H1 rebound",
    href: "/blog/demographic-cash-flows-update-2026q3",
  },
] as const;

/** Shareable headline deltas versus the Q3 H1-rebound post. */
export const HEADLINE = {
  mexicoT12mBn: 63.389,
  mexicoT12mYoyPct: -0.1,
  mexicoT12mPriorBn: 63.171,
  mexicoT12mSurplusBn: 62.166,
  mexicoT12mSoftMonths: 13,
  mexicoRealJuneYoyPct: -8.3,
  mexicoJune2026Bn: 5.472,
  mexicoJuneYoyPct: 4.2,
  mexicoJuneSaMomPct: -2.4,
  mexicoJuneAvgTicketUsd: 422,
  mexicoJuneAvgTicketYoyPct: 3.9,
  mexicoJuneOpsM: 13.0,
  mexicoJuneOpsYoyPct: 0.3,
  mexicoH1_2026Bn: 30.759,
  mexicoH1YoyPct: 3.1,
  mexicoH1AvgTicketUsd: 405,
  mexicoH1TxnYoyPct: -1.8,
  mexicoFy2025Bn: 61.791,
  mexicoFy2025YoyPct: -4.6,
  mexicoCashShareH1Pct: 46.7,
  mexicoDepositShareH1Pct: 53.3,
  mexicoCashH1Bn: 14.26,
  mexicoDepositH1Bn: 16.255,
  consecutiveYoYGrowthMonths: 5,
  guanajuatoH1Bn: 2.705,
  cdmxH1GrowthPct: 27.3,
  oecd32_2023_24Pct: 8.8,
  oecd32_2050Pct: 10.0,
  oecd32DeltaPp: 1.2,
  italyPensionGdpPct: 16,
  brief41Lmic2024eBn: 685,
  usComplianceRuleMonth: "Sep 2026",
  /** Nominal H1 rebound vs real June erosion swing */
  nominalVsRealSwingPp: 11.4,
} as const;

export type VintageRow = {
  id: string;
  metric: string;
  prior: string;
  priorNum: number | null;
  neu: string;
  newNum: number | null;
  delta: string;
  unit: "bn" | "pct" | "pp" | "text" | "usd";
  confidence: Confidence;
  note: string;
};

/** Side-by-side vintage table: Q3 H1 framing → Aug T12M / real lens. */
export const VINTAGE_TABLE: VintageRow[] = [
  {
    id: "t12m",
    metric: "Mexico remittances T12M",
    prior: "H1 +3.1% headline",
    priorNum: 3.1,
    neu: "$63.39B (−0.1% YoY)",
    newNum: -0.1,
    delta: "13th soft T12M month",
    unit: "pct",
    confidence: "disclosed",
    note: "Jul 2025 – Jun 2026 Banxico",
  },
  {
    id: "real-june",
    metric: "Real remittance power (June)",
    prior: "Nominal June +4.2%",
    priorNum: 4.2,
    neu: "−8.3% real YoY",
    newNum: -8.3,
    delta: "FX + inflation bite",
    unit: "pct",
    confidence: "disclosed",
    note: "BBVA Research 3 Aug 2026",
  },
  {
    id: "sa-mom",
    metric: "June SA MoM incomes",
    prior: "YoY streak intact",
    priorNum: null,
    neu: "−2.4% SA MoM",
    newNum: -2.4,
    delta: "2nd SA fade in 2026",
    unit: "pct",
    confidence: "disclosed",
    note: "Banxico seasonally adjusted",
  },
  {
    id: "streak",
    metric: "Consecutive YoY growth months",
    prior: "H1 rebound framed",
    priorNum: null,
    neu: "5 months through June",
    newNum: 5,
    delta: "Feb–Jun streak",
    unit: "text",
    confidence: "disclosed",
    note: "BBVA streak count",
  },
  {
    id: "states",
    metric: "State leaders (H1)",
    prior: "National aggregate only",
    priorNum: null,
    neu: "GTO $2.71B; CDMX +27.3%",
    newNum: 2.705,
    delta: "Concentration + outliers",
    unit: "bn",
    confidence: "disclosed",
    note: "BBVA state ranking",
  },
  {
    id: "oecd-path",
    metric: "OECD-32 public pensions / GDP",
    prior: "8.8% → 10.0% by 2050",
    priorNum: 10.0,
    neu: "Unchanged (PaG 2025)",
    newNum: 10.0,
    delta: "Host ledger still +1.2 pp",
    unit: "pp",
    confidence: "disclosed",
    note: "No newer OECD PaG between updates",
  },
];

/** Trailing-twelve path — disclosed endpoints; middle constructed. */
export type T12mRow = {
  id: string;
  label: string;
  window: string;
  bn: number;
  yoyPct: number | null;
  confidence: Confidence;
};

export const MEXICO_T12M_SERIES: T12mRow[] = [
  {
    id: "t12-fy2024",
    label: "FY 2024",
    window: "Calendar 2024",
    bn: 64.746,
    yoyPct: 2.3,
    confidence: "disclosed",
  },
  {
    id: "t12-fy2025",
    label: "FY 2025",
    window: "Calendar 2025",
    bn: 61.791,
    yoyPct: -4.6,
    confidence: "disclosed",
  },
  {
    id: "t12-may2026",
    label: "T12M May’26",
    window: "Jun’25–May’26",
    bn: 63.171,
    yoyPct: null,
    confidence: "disclosed",
  },
  {
    id: "t12-jun2026",
    label: "T12M Jun’26",
    window: "Jul’25–Jun’26",
    bn: 63.389,
    yoyPct: -0.1,
    confidence: "disclosed",
  },
];

/** Nominal vs real June comparison (BBVA real; Banxico nominal). */
export type RealNominalRow = {
  id: string;
  label: string;
  shortLabel: string;
  pct: number;
  kind: "nominal" | "real" | "sa";
  confidence: Confidence;
};

export const NOMINAL_VS_REAL: RealNominalRow[] = [
  {
    id: "june-yoy",
    label: "June nominal YoY",
    shortLabel: "Nominal YoY",
    pct: 4.2,
    kind: "nominal",
    confidence: "disclosed",
  },
  {
    id: "june-real",
    label: "June real purchasing power YoY",
    shortLabel: "Real YoY",
    pct: -8.3,
    kind: "real",
    confidence: "disclosed",
  },
  {
    id: "june-sa",
    label: "June SA MoM",
    shortLabel: "SA MoM",
    pct: -2.4,
    kind: "sa",
    confidence: "disclosed",
  },
  {
    id: "h1-yoy",
    label: "H1 nominal YoY",
    shortLabel: "H1 YoY",
    pct: 3.1,
    kind: "nominal",
    confidence: "disclosed",
  },
  {
    id: "t12m-yoy",
    label: "T12M nominal YoY",
    shortLabel: "T12M YoY",
    pct: -0.1,
    kind: "nominal",
    confidence: "disclosed",
  },
];

/** Cash vs deposit payout mix (H1 2026 Banxico). */
export type PayoutRow = {
  id: string;
  label: string;
  bn: number;
  sharePct: number;
  confidence: Confidence;
};

export const PAYOUT_MIX: PayoutRow[] = [
  {
    id: "deposit",
    label: "Deposit to account",
    bn: 16.255,
    sharePct: 53.3,
    confidence: "disclosed",
  },
  {
    id: "cash",
    label: "Cash pickup",
    bn: 14.26,
    sharePct: 46.7,
    confidence: "disclosed",
  },
];

/** Top remittance-receiving states (H1 2026) — BBVA disclosed leaders + constructed peers. */
export type StateRow = {
  id: string;
  label: string;
  bn: number;
  yoyPct: number | null;
  confidence: Confidence;
};

export const STATE_LEADERS: StateRow[] = [
  {
    id: "gto",
    label: "Guanajuato",
    bn: 2.705,
    yoyPct: 4.1,
    confidence: "disclosed",
  },
  {
    id: "jal",
    label: "Jalisco",
    bn: 2.48,
    yoyPct: 2.8,
    confidence: "constructed",
  },
  {
    id: "mich",
    label: "Michoacán",
    bn: 2.35,
    yoyPct: 1.9,
    confidence: "constructed",
  },
  {
    id: "mex",
    label: "Estado de México",
    bn: 1.92,
    yoyPct: 5.2,
    confidence: "constructed",
  },
  {
    id: "cdmx",
    label: "Mexico City",
    bn: 1.15,
    yoyPct: 27.3,
    confidence: "disclosed",
  },
  {
    id: "nl",
    label: "Nuevo León",
    bn: 0.98,
    yoyPct: 6.0,
    confidence: "constructed",
  },
];

/** Q3 → Aug 202608 dumbbell: rebound qualified by T12M + real. */
export type DumbbellRow = {
  id: string;
  label: string;
  priorVal: number;
  newVal: number;
  delta: number;
  unit: "pct" | "bn" | "pp";
  confidence: Confidence;
};

export const FLOW_DUMBBELL: DumbbellRow[] = [
  {
    id: "h1-to-t12m",
    label: "Growth lens (H1 → T12M)",
    priorVal: 3.1,
    newVal: -0.1,
    delta: -3.2,
    unit: "pct",
    confidence: "disclosed",
  },
  {
    id: "nominal-to-real",
    label: "June nominal → real",
    priorVal: 4.2,
    newVal: -8.3,
    delta: -12.5,
    unit: "pct",
    confidence: "disclosed",
  },
  {
    id: "t12m-level",
    label: "T12M dollars (May→Jun)",
    priorVal: 63.171,
    newVal: 63.389,
    delta: 0.218,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "gdp-share",
    label: "MX remit / GDP (est.)",
    priorVal: 3.5,
    newVal: 3.5,
    delta: 0,
    unit: "pp",
    confidence: "estimated",
  },
];

/** Host pension path unchanged — still the multi-decade ledger. */
export type PensionPathPoint = {
  year: number;
  oecd32: number;
  italy: number | null;
  japan: number | null;
  unitedStates: number | null;
  confidence: Confidence;
};

export const PENSION_PATH: PensionPathPoint[] = [
  {
    year: 2023,
    oecd32: 8.8,
    italy: 16.0,
    japan: 9.3,
    unitedStates: 7.1,
    confidence: "disclosed",
  },
  {
    year: 2030,
    oecd32: 9.2,
    italy: 16.3,
    japan: 9.6,
    unitedStates: 7.5,
    confidence: "estimated",
  },
  {
    year: 2040,
    oecd32: 9.6,
    italy: 16.6,
    japan: 10.0,
    unitedStates: 8.0,
    confidence: "estimated",
  },
  {
    year: 2050,
    oecd32: 10.0,
    italy: 15.5,
    japan: 10.4,
    unitedStates: 8.4,
    confidence: "disclosed",
  },
];

/** Dual-speed ledger: private remittance pulse vs public pension grind. */
export type DualSpeedRow = {
  id: string;
  label: string;
  remittancePulsePct: number | null;
  pensionGdpPct: number | null;
  oldAgeDependency: number;
  role: "aging-host" | "remittance-origin" | "bridge";
};

export const DUAL_SPEED: DualSpeedRow[] = [
  {
    id: "italy",
    label: "Italy",
    remittancePulsePct: 0.5,
    pensionGdpPct: 16,
    oldAgeDependency: 40,
    role: "aging-host",
  },
  {
    id: "japan",
    label: "Japan",
    remittancePulsePct: 0.1,
    pensionGdpPct: 9.3,
    oldAgeDependency: 54,
    role: "aging-host",
  },
  {
    id: "united-states",
    label: "US",
    remittancePulsePct: 0.03,
    pensionGdpPct: 7.1,
    oldAgeDependency: 29,
    role: "bridge",
  },
  {
    id: "mexico",
    label: "Mexico",
    remittancePulsePct: 3.5,
    pensionGdpPct: 3.1,
    oldAgeDependency: 13,
    role: "remittance-origin",
  },
  {
    id: "guatemala",
    label: "Guatemala",
    remittancePulsePct: 19,
    pensionGdpPct: null,
    oldAgeDependency: 8,
    role: "remittance-origin",
  },
  {
    id: "india",
    label: "India",
    remittancePulsePct: 3.4,
    pensionGdpPct: null,
    oldAgeDependency: 11,
    role: "remittance-origin",
  },
];

/** Age × remittance scatter — Mexico prior (H1 lens) vs new (T12M/real lens). */
export type ScatterPoint = {
  id: string;
  label: string;
  oldAgeDependency: number;
  remittanceGdpPct: number;
  role: "aging-host" | "remittance-origin" | "bridge";
  vintage: "prior" | "new";
  confidence: Confidence;
};

export const SCATTER_POINTS: ScatterPoint[] = [
  {
    id: "japan",
    label: "Japan",
    oldAgeDependency: 54,
    remittanceGdpPct: 0.1,
    role: "aging-host",
    vintage: "new",
    confidence: "disclosed",
  },
  {
    id: "italy",
    label: "Italy",
    oldAgeDependency: 40,
    remittanceGdpPct: 0.5,
    role: "aging-host",
    vintage: "new",
    confidence: "disclosed",
  },
  {
    id: "germany",
    label: "Germany",
    oldAgeDependency: 37,
    remittanceGdpPct: 0.5,
    role: "aging-host",
    vintage: "new",
    confidence: "disclosed",
  },
  {
    id: "united-states",
    label: "US",
    oldAgeDependency: 29,
    remittanceGdpPct: 0.03,
    role: "bridge",
    vintage: "new",
    confidence: "disclosed",
  },
  {
    id: "mexico-prior",
    label: "Mexico (H1 run-rate)",
    oldAgeDependency: 13,
    remittanceGdpPct: 3.5,
    role: "remittance-origin",
    vintage: "prior",
    confidence: "estimated",
  },
  {
    id: "mexico-new",
    label: "Mexico (T12M soft)",
    oldAgeDependency: 13,
    remittanceGdpPct: 3.45,
    role: "remittance-origin",
    vintage: "new",
    confidence: "estimated",
  },
  {
    id: "india",
    label: "India",
    oldAgeDependency: 11,
    remittanceGdpPct: 3.4,
    role: "remittance-origin",
    vintage: "new",
    confidence: "estimated",
  },
  {
    id: "philippines",
    label: "Philippines",
    oldAgeDependency: 9,
    remittanceGdpPct: 8.5,
    role: "remittance-origin",
    vintage: "new",
    confidence: "estimated",
  },
  {
    id: "guatemala",
    label: "Guatemala",
    oldAgeDependency: 8,
    remittanceGdpPct: 19,
    role: "remittance-origin",
    vintage: "new",
    confidence: "estimated",
  },
  {
    id: "tajikistan",
    label: "Tajikistan",
    oldAgeDependency: 7,
    remittanceGdpPct: 45,
    role: "remittance-origin",
    vintage: "new",
    confidence: "disclosed",
  },
];

export const ROLE_COLORS = {
  "aging-host": "#0f766e",
  "remittance-origin": "#ea580c",
  bridge: "#2563eb",
} as const;

/** Growth regime including T12M soft landing after H1 rebound. */
export type RegimeRow = {
  id: string;
  label: string;
  growthPct: number;
  dollarsBn: number;
  regime: "decline" | "rebound" | "soft" | "peak";
  confidence: Confidence;
};

export const GROWTH_REGIME: RegimeRow[] = [
  {
    id: "fy-2024",
    label: "FY 2024",
    growthPct: 2.3,
    dollarsBn: 64.746,
    regime: "peak",
    confidence: "disclosed",
  },
  {
    id: "fy-2025",
    label: "FY 2025",
    growthPct: -4.6,
    dollarsBn: 61.791,
    regime: "decline",
    confidence: "disclosed",
  },
  {
    id: "h1-2026",
    label: "H1 2026",
    growthPct: 3.1,
    dollarsBn: 30.759,
    regime: "rebound",
    confidence: "disclosed",
  },
  {
    id: "t12m-jun",
    label: "T12M Jun’26",
    growthPct: -0.1,
    dollarsBn: 63.389,
    regime: "soft",
    confidence: "disclosed",
  },
];

export function fmtBn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}
