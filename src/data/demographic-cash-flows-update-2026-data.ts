/**
 * Demographic cash flows — vintage update (Aug 2026).
 * Compares the Aug 2026 research print (World Bank Migration & Development
 * Brief 41 / Dec 2024 remittance estimates + OECD PaG prior levels) against
 * the newest official prints: Banxico full-year 2025 remittances, BBVA LAC
 * corridor growth, and OECD Pensions at a Glance 2025 long-term path.
 *
 * Core question: What changed in the newest vintage vs the last theme post,
 * and how do age + migration still show up in money flows?
 */

export type Confidence = "disclosed" | "estimated" | "restated";

export const SOURCE_NOTE =
  "Vintage delta vs demographic-cash-flows-research-2026 (Brief 41): Banxico Dec 2025 remittance bulletin for Mexico 2024–2025 dollars; BBVA Research Migration Observatory (Feb 2026) for LAC ex-Mexico growth rates; OECD Pensions at a Glance 2025 for OECD-32 public-pension % GDP path (8.8% → 10.0% by 2050) and Italy ~16% level; Brief 41 retained for LMIC aggregate anchors where no newer World Bank brief has restated the 2024e $685B print.";

export const SOURCES = [
  {
    label: "Banxico — Remittance incomes Dec 2025 (full-year $61.8B)",
    href: "https://www.banxico.org.mx/publicaciones-y-prensa/remesas/%7BED06F2CB-06BA-2EC6-D145-73FF4579BADA%7D.pdf",
  },
  {
    label: "BBVA Research — Mexico remittances −4.6% in 2025",
    href: "https://www.bbvaresearch.com/en/publicaciones/mexico-11-consecutive-years-of-remittance-growth-end-falling-46-in-2025/",
  },
  {
    label: "OECD Pensions at a Glance 2025 — public expenditure",
    href: "https://www.oecd.org/en/publications/2025/11/pensions-at-a-glance-2025_76510fe4/full-report/public-expenditure-on-pensions_ddc9a2dd.html",
  },
  {
    label: "OECD PaG 2025 — long-term pension projections",
    href: "https://www.oecd.org/en/publications/2025/11/pensions-at-a-glance-2025_76510fe4/full-report/long-term-projections-of-public-pension-expenditure_af4ed734.html",
  },
  {
    label: "World Bank People Move — Brief 41 (prior vintage)",
    href: "https://blogs.worldbank.org/en/peoplemove/in-2024--remittance-flows-to-low--and-middle-income-countries-ar",
  },
] as const;

/** Shareable headline deltas versus the research post. */
export const HEADLINE = {
  mexico2024BanxicoBn: 64.746,
  mexico2025BanxicoBn: 61.791,
  mexicoYoyPct: -4.6,
  mexicoBrief41_2024eBn: 68,
  mexicoRestateVsBriefBn: -3.25,
  mexicoDeltaVs2024Bn: -2.955,
  mexicoGdpSharePriorPct: 3.7,
  mexicoGdpShare2025Pct: 3.4,
  lacExMexicoAvgGrowthPct: 16,
  hondurasYoyPct: 25.3,
  guatemalaYoyPct: 18.7,
  elSalvadorYoyPct: 17.8,
  colombiaYoyPct: 10.6,
  dominicanRepYoyPct: 10.3,
  oecdPensionLatestPct: 8.1,
  oecd32_2023_24Pct: 8.8,
  oecd32_2050Pct: 10.0,
  oecd32DeltaPp: 1.2,
  italyPensionGdpPct: 16,
  brief41Lmic2024eBn: 685,
  brief41Growth2024Pct: 5.8,
  indiaInflowBn: 129,
  growthStreakYearsBroken: 11,
} as const;

export type VintageRow = {
  id: string;
  metric: string;
  prior: string;
  priorNum: number | null;
  neu: string;
  newNum: number | null;
  delta: string;
  unit: "bn" | "pct" | "pp" | "text";
  confidence: Confidence;
  note: string;
};

/** Side-by-side vintage table for prose + KPI strip. */
export const VINTAGE_TABLE: VintageRow[] = [
  {
    id: "mx-2024",
    metric: "Mexico remittances 2024",
    prior: "$68B (Brief 41 e)",
    priorNum: 68,
    neu: "$64.7B (Banxico)",
    newNum: 64.746,
    delta: "−$3.3B restatement",
    unit: "bn",
    confidence: "restated",
    note: "Brief 41 estimate vs Banxico actual",
  },
  {
    id: "mx-2025",
    metric: "Mexico remittances 2025",
    prior: "$64.7B (2024 actual)",
    priorNum: 64.746,
    neu: "$61.8B",
    newNum: 61.791,
    delta: "−4.6% YoY",
    unit: "pct",
    confidence: "disclosed",
    note: "First annual decline in 11 years",
  },
  {
    id: "mx-gdp",
    metric: "Mexico remittances / GDP",
    prior: "3.7%",
    priorNum: 3.7,
    neu: "3.4%",
    newNum: 3.4,
    delta: "−0.3 pp",
    unit: "pp",
    confidence: "estimated",
    note: "Brief 41 share vs 2025 BASE/Banxico narrative",
  },
  {
    id: "lac-ex-mx",
    metric: "LAC ex-Mexico remittance growth",
    prior: "LAC +5.5% (Brief 41 2024e)",
    priorNum: 5.5,
    neu: ">+16% avg (2025)",
    newNum: 16,
    delta: "Divergence vs MX",
    unit: "pct",
    confidence: "estimated",
    note: "BBVA Observatory country prints",
  },
  {
    id: "oecd-path",
    metric: "OECD-32 public pensions / GDP",
    prior: "8.1% latest (level)",
    priorNum: 8.1,
    neu: "8.8% → 10.0% by 2050",
    newNum: 10.0,
    delta: "+1.2 pp path",
    unit: "pp",
    confidence: "disclosed",
    note: "PaG 2025 long-term projection table",
  },
  {
    id: "italy",
    metric: "Italy public pensions / GDP",
    prior: "16.3%",
    priorNum: 16.3,
    neu: "~16%",
    newNum: 16,
    delta: "Still #2 OECD",
    unit: "pct",
    confidence: "disclosed",
    note: "PaG 2025 Italy country note",
  },
];

/** Banxico annual Mexico remittance series (USD bn). */
export type MexicoYear = {
  year: number;
  bn: number;
  yoyPct: number | null;
  confidence: Confidence;
};

export const MEXICO_SERIES: MexicoYear[] = [
  { year: 2019, bn: 36.4, yoyPct: 7.0, confidence: "disclosed" },
  { year: 2020, bn: 40.6, yoyPct: 11.4, confidence: "disclosed" },
  { year: 2021, bn: 51.6, yoyPct: 27.1, confidence: "disclosed" },
  { year: 2022, bn: 58.5, yoyPct: 13.4, confidence: "disclosed" },
  { year: 2023, bn: 63.3, yoyPct: 8.2, confidence: "disclosed" },
  { year: 2024, bn: 64.746, yoyPct: 2.3, confidence: "disclosed" },
  { year: 2025, bn: 61.791, yoyPct: -4.6, confidence: "disclosed" },
];

/** LAC recipient YoY growth — Mexico vs peers (2025). */
export type LacGrowthRow = {
  id: string;
  label: string;
  shortLabel: string;
  yoyPct: number;
  approx2025Bn: number | null;
  priorBriefBn: number | null;
  confidence: Confidence;
};

export const LAC_GROWTH: LacGrowthRow[] = [
  {
    id: "mexico",
    label: "Mexico",
    shortLabel: "MX",
    yoyPct: -4.6,
    approx2025Bn: 61.8,
    priorBriefBn: 68,
    confidence: "disclosed",
  },
  {
    id: "guatemala",
    label: "Guatemala",
    shortLabel: "GT",
    yoyPct: 18.7,
    approx2025Bn: 25.5,
    priorBriefBn: null,
    confidence: "estimated",
  },
  {
    id: "honduras",
    label: "Honduras",
    shortLabel: "HN",
    yoyPct: 25.3,
    approx2025Bn: 12.2,
    priorBriefBn: null,
    confidence: "estimated",
  },
  {
    id: "el-salvador",
    label: "El Salvador",
    shortLabel: "SV",
    yoyPct: 17.8,
    approx2025Bn: null,
    priorBriefBn: null,
    confidence: "estimated",
  },
  {
    id: "colombia",
    label: "Colombia",
    shortLabel: "CO",
    yoyPct: 10.6,
    approx2025Bn: null,
    priorBriefBn: null,
    confidence: "estimated",
  },
  {
    id: "dominican-republic",
    label: "Dominican Republic",
    shortLabel: "DO",
    yoyPct: 10.3,
    approx2025Bn: null,
    priorBriefBn: null,
    confidence: "estimated",
  },
];

/** OECD public pension % GDP path (PaG 2025). */
export type PensionPathPoint = {
  year: number;
  oecd32: number;
  italy: number | null;
  greece: number | null;
  japan: number | null;
  unitedStates: number | null;
  confidence: Confidence;
};

export const PENSION_PATH: PensionPathPoint[] = [
  {
    year: 2000,
    oecd32: 6.7,
    italy: 13.8,
    greece: 12.0,
    japan: 7.0,
    unitedStates: 5.9,
    confidence: "estimated",
  },
  {
    year: 2023,
    oecd32: 8.8,
    italy: 16.0,
    greece: 16.2,
    japan: 9.3,
    unitedStates: 7.1,
    confidence: "disclosed",
  },
  {
    year: 2030,
    oecd32: 9.2,
    italy: 16.3,
    greece: 15.8,
    japan: 9.6,
    unitedStates: 7.5,
    confidence: "estimated",
  },
  {
    year: 2040,
    oecd32: 9.6,
    italy: 16.6,
    greece: 15.0,
    japan: 10.0,
    unitedStates: 8.0,
    confidence: "estimated",
  },
  {
    year: 2050,
    oecd32: 10.0,
    italy: 15.5,
    greece: 14.2,
    japan: 10.4,
    unitedStates: 8.4,
    confidence: "disclosed",
  },
];

/** Age × remittance scatter with Mexico vintage shift. */
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
    label: "Mexico (Brief 41)",
    oldAgeDependency: 13,
    remittanceGdpPct: 3.7,
    role: "remittance-origin",
    vintage: "prior",
    confidence: "estimated",
  },
  {
    id: "mexico-new",
    label: "Mexico (2025)",
    oldAgeDependency: 13,
    remittanceGdpPct: 3.4,
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
    id: "tajikistan",
    label: "Tajikistan",
    oldAgeDependency: 7,
    remittanceGdpPct: 45,
    role: "remittance-origin",
    vintage: "new",
    confidence: "disclosed",
  },
  {
    id: "nigeria",
    label: "Nigeria",
    oldAgeDependency: 6,
    remittanceGdpPct: 4,
    role: "remittance-origin",
    vintage: "new",
    confidence: "estimated",
  },
];

export const ROLE_COLORS = {
  "aging-host": "#0f766e",
  "remittance-origin": "#ea580c",
  bridge: "#2563eb",
} as const;

/** Prior→new dumbbell for key dollar metrics. */
export type DumbbellRow = {
  id: string;
  label: string;
  priorBn: number;
  newBn: number;
  deltaBn: number;
  confidence: Confidence;
};

export const FLOW_DUMBBELL: DumbbellRow[] = [
  {
    id: "mexico-2024-restate",
    label: "Mexico 2024 (Brief→Banxico)",
    priorBn: 68,
    newBn: 64.746,
    deltaBn: -3.254,
    confidence: "restated",
  },
  {
    id: "mexico-2025-yoy",
    label: "Mexico 2024→2025 (Banxico)",
    priorBn: 64.746,
    newBn: 61.791,
    deltaBn: -2.955,
    confidence: "disclosed",
  },
  {
    id: "guatemala-approx",
    label: "Guatemala ~2024→2025",
    priorBn: 21.5,
    newBn: 25.5,
    deltaBn: 4.0,
    confidence: "estimated",
  },
  {
    id: "honduras-approx",
    label: "Honduras ~2024→2025",
    priorBn: 9.7,
    newBn: 12.2,
    deltaBn: 2.5,
    confidence: "estimated",
  },
];

/** Host-side pension pressure vs remittance dependence (paired bars). */
export type DualLedgerRow = {
  id: string;
  label: string;
  pensionGdpPct: number | null;
  remittanceGdpPct: number | null;
  oldAgeDependency: number;
};

export const DUAL_LEDGER: DualLedgerRow[] = [
  {
    id: "italy",
    label: "Italy",
    pensionGdpPct: 16,
    remittanceGdpPct: 0.5,
    oldAgeDependency: 40,
  },
  {
    id: "greece",
    label: "Greece",
    pensionGdpPct: 16.2,
    remittanceGdpPct: 0.3,
    oldAgeDependency: 39,
  },
  {
    id: "japan",
    label: "Japan",
    pensionGdpPct: 9.3,
    remittanceGdpPct: 0.1,
    oldAgeDependency: 54,
  },
  {
    id: "united-states",
    label: "US",
    pensionGdpPct: 7.1,
    remittanceGdpPct: 0.03,
    oldAgeDependency: 29,
  },
  {
    id: "mexico",
    label: "Mexico",
    pensionGdpPct: 3.1,
    remittanceGdpPct: 3.4,
    oldAgeDependency: 13,
  },
  {
    id: "india",
    label: "India",
    pensionGdpPct: null,
    remittanceGdpPct: 3.4,
    oldAgeDependency: 11,
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
