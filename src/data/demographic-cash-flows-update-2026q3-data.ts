/**
 * Demographic cash flows — Q3 2026 vintage update.
 * Compares the Aug 2026 Banxico-2025 update post against Banxico’s June 2026
 * remittance bulletin (H1 2026 rebound) while carrying OECD PaG 2025 host
 * pension path as the still-grinding public ledger.
 *
 * Core question: What changed vs demographic-cash-flows-update-2026, and how
 * do age + migration still show up in money flows after Mexico’s streak break?
 */

export type Confidence = "disclosed" | "estimated" | "constructed";

export const SOURCE_NOTE =
  "Q3 vintage delta vs demographic-cash-flows-update-2026: Banxico Ingresos y Egresos por Remesas (junio 2026) for Mexico H1 2026 $30.759B (+3.1% YoY), June $5.472B (+4.2%), avg ticket $405 (+5%), transactions −1.8%; prior update’s Banxico full-year 2025 −4.6% / $61.791B and OECD PaG 2025 OECD-32 8.8%→10.0% by 2050 retained as host-ledger anchors; Brief 41 LMIC $685B held where no newer World Bank brief restates.";

export const SOURCES = [
  {
    label: "Banxico — Remesas junio 2026 (H1 $30.76B)",
    href: "https://www.banxico.org.mx/publicaciones-y-prensa/remesas/%7BD61BA269-E1F5-F27F-B347-CE8949A9C573%7D.pdf",
  },
  {
    label: "Mexico News Daily — Remittances rebound H1 2026",
    href: "https://mexiconewsdaily.com/news/mexico-remittances-rebound-2026/",
  },
  {
    label: "Mexico Business News — H1 remittances +3.1%",
    href: "https://mexicobusiness.news/finance/news/mexico-remittances-surge-31-us3076-billion-1h26",
  },
  {
    label: "OECD Pensions at a Glance 2025 — long-term path",
    href: "https://www.oecd.org/en/publications/2025/11/pensions-at-a-glance-2025_76510fe4/full-report/long-term-projections-of-public-pension-expenditure_af4ed734.html",
  },
  {
    label: "Prior theme update — Banxico 2025 vintage",
    href: "/blog/demographic-cash-flows-update-2026",
  },
] as const;

/** Shareable headline deltas versus the Aug 2026 update post. */
export const HEADLINE = {
  mexicoH1_2026Bn: 30.759,
  mexicoH1_2025Bn: 29.842,
  mexicoH1YoyPct: 3.1,
  mexicoH1DeltaBn: 0.917,
  mexicoJune2026Bn: 5.472,
  mexicoJuneYoyPct: 4.2,
  mexicoAvgTicketH1_2026Usd: 405,
  mexicoAvgTicketH1_2025Usd: 386,
  mexicoAvgTicketYoyPct: 5.0,
  mexicoTxnH1_2026M: 75.97,
  mexicoTxnYoyPct: -1.8,
  mexicoElectronicSharePct: 99.2,
  mexicoFy2025Bn: 61.791,
  mexicoFy2025YoyPct: -4.6,
  mexicoFy2024Bn: 64.746,
  mexicoH1_2024Bn: 31.34,
  mexicoGdpShareH1EstPct: 3.5,
  mexicoGdpSharePriorPct: 3.4,
  oecd32_2023_24Pct: 8.8,
  oecd32_2050Pct: 10.0,
  oecd32DeltaPp: 1.2,
  italyPensionGdpPct: 16,
  brief41Lmic2024eBn: 685,
  usComplianceRuleMonth: "Sep 2026",
  reboundVsDeclineSwingPp: 7.7,
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

/** Side-by-side vintage table: Aug update → Banxico June 2026. */
export const VINTAGE_TABLE: VintageRow[] = [
  {
    id: "mx-growth",
    metric: "Mexico remittance growth",
    prior: "−4.6% FY 2025",
    priorNum: -4.6,
    neu: "+3.1% H1 2026",
    newNum: 3.1,
    delta: "+7.7 pp swing",
    unit: "pp",
    confidence: "disclosed",
    note: "Full-year decline → H1 rebound",
  },
  {
    id: "mx-h1",
    metric: "Mexico remittances H1",
    prior: "$29.84B (H1 2025)",
    priorNum: 29.842,
    neu: "$30.76B (H1 2026)",
    newNum: 30.759,
    delta: "+$0.92B / +3.1%",
    unit: "bn",
    confidence: "disclosed",
    note: "2nd-highest H1 on record (behind 2024)",
  },
  {
    id: "mx-june",
    metric: "Mexico remittances June",
    prior: "FY path cooling",
    priorNum: null,
    neu: "$5.47B (+4.2% YoY)",
    newNum: 5.472,
    delta: "2nd straight >$5B month",
    unit: "bn",
    confidence: "disclosed",
    note: "Banxico June 2026 bulletin",
  },
  {
    id: "mx-ticket",
    metric: "Average remittance (H1)",
    prior: "$386 (H1 2025)",
    priorNum: 386,
    neu: "$405 (H1 2026)",
    newNum: 405,
    delta: "+5.0% YoY",
    unit: "usd",
    confidence: "disclosed",
    note: "Highest H1 avg in ≥10 years",
  },
  {
    id: "mx-txn",
    metric: "Remittance transactions (H1)",
    prior: "Volume soft in 2025",
    priorNum: null,
    neu: "75.97M (−1.8% YoY)",
    newNum: 75.97,
    delta: "Fewer wires, larger tickets",
    unit: "pct",
    confidence: "disclosed",
    note: "Decomposition of the rebound",
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

/** Half-year Mexico remittance levels for rebound framing. */
export type H1Row = {
  id: string;
  label: string;
  year: number;
  bn: number;
  yoyPct: number | null;
  confidence: Confidence;
};

export const MEXICO_H1_SERIES: H1Row[] = [
  {
    id: "h1-2024",
    label: "H1 2024",
    year: 2024,
    bn: 31.34,
    yoyPct: null,
    confidence: "disclosed",
  },
  {
    id: "h1-2025",
    label: "H1 2025",
    year: 2025,
    bn: 29.842,
    yoyPct: -4.8,
    confidence: "disclosed",
  },
  {
    id: "h1-2026",
    label: "H1 2026",
    year: 2026,
    bn: 30.759,
    yoyPct: 3.1,
    confidence: "disclosed",
  },
];

/** Monthly path — June disclosed; other months constructed to match Banxico H1 totals. */
export type MonthRow = {
  month: string;
  monthIdx: number;
  bn2025: number;
  bn2026: number;
  yoyPct: number;
  confidence: Confidence;
};

export const MEXICO_MONTHLY_H1: MonthRow[] = [
  {
    month: "Jan",
    monthIdx: 1,
    bn2025: 4.55,
    bn2026: 4.68,
    yoyPct: 2.9,
    confidence: "constructed",
  },
  {
    month: "Feb",
    monthIdx: 2,
    bn2025: 4.58,
    bn2026: 4.75,
    yoyPct: 3.7,
    confidence: "constructed",
  },
  {
    month: "Mar",
    monthIdx: 3,
    bn2025: 4.9,
    bn2026: 5.05,
    yoyPct: 3.1,
    confidence: "constructed",
  },
  {
    month: "Apr",
    monthIdx: 4,
    bn2025: 5.0,
    bn2026: 5.09,
    yoyPct: 1.8,
    confidence: "constructed",
  },
  {
    month: "May",
    monthIdx: 5,
    bn2025: 5.56,
    bn2026: 5.717,
    yoyPct: 2.8,
    confidence: "constructed",
  },
  {
    month: "Jun",
    monthIdx: 6,
    bn2025: 5.252,
    bn2026: 5.472,
    yoyPct: 4.2,
    confidence: "disclosed",
  },
];

/** Ticket-size vs transaction-count decomposition of the H1 rebound. */
export type DecompRow = {
  id: string;
  label: string;
  shortLabel: string;
  prior: number;
  neu: number;
  yoyPct: number;
  unit: "usd" | "m" | "bn";
  confidence: Confidence;
};

export const REBOUND_DECOMP: DecompRow[] = [
  {
    id: "dollars",
    label: "H1 remittance dollars ($B)",
    shortLabel: "Dollars",
    prior: 29.842,
    neu: 30.759,
    yoyPct: 3.1,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "ticket",
    label: "Average remittance (USD)",
    shortLabel: "Ticket $",
    prior: 386,
    neu: 405,
    yoyPct: 5.0,
    unit: "usd",
    confidence: "disclosed",
  },
  {
    id: "txn",
    label: "Transactions (millions)",
    shortLabel: "Txns",
    prior: 77.36,
    neu: 75.97,
    yoyPct: -1.8,
    unit: "m",
    confidence: "disclosed",
  },
];

/** Prior→new dumbbell for key vintage metrics (Aug update → Q3). */
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
    id: "growth-swing",
    label: "Mexico growth (FY25 → H1’26)",
    priorVal: -4.6,
    newVal: 3.1,
    delta: 7.7,
    unit: "pct",
    confidence: "disclosed",
  },
  {
    id: "h1-dollars",
    label: "Mexico H1 dollars",
    priorVal: 29.842,
    newVal: 30.759,
    delta: 0.917,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "vs-peak-h1",
    label: "H1 vs peak (2024)",
    priorVal: 31.34,
    newVal: 30.759,
    delta: -0.581,
    unit: "bn",
    confidence: "disclosed",
  },
  {
    id: "gdp-share",
    label: "MX remit / GDP (est.)",
    priorVal: 3.4,
    newVal: 3.5,
    delta: 0.1,
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

/** Age × remittance scatter with Mexico prior (FY25) → new (H1’26 est.) shift. */
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
    label: "Mexico (FY 2025)",
    oldAgeDependency: 13,
    remittanceGdpPct: 3.4,
    role: "remittance-origin",
    vintage: "prior",
    confidence: "estimated",
  },
  {
    id: "mexico-new",
    label: "Mexico (H1 2026 est.)",
    oldAgeDependency: 13,
    remittanceGdpPct: 3.5,
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

/** Full-year vs H1 growth regime for composed chart. */
export type RegimeRow = {
  id: string;
  label: string;
  growthPct: number;
  dollarsBn: number;
  regime: "decline" | "rebound" | "peak";
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
