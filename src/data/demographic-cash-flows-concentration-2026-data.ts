/**
 * Demographic cash flows — concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * How do age and migration show up in money flows?
 *
 * Complements research (dependency×remittance scatter), Banxico vintage updates,
 * and corridor plumbing with top-1 / top-3 shares across recipient dollars,
 * bilateral corridors, GDP-dependence, and host public-pension burdens.
 *
 * Primary sources (carried from theme vintages):
 * - World Bank Migration & Development Brief 41 (LMIC remittances $685B; recipients)
 * - KNOMAD bilateral matrix (corridor dollars)
 * - UN World Population Prospects 2024 (old-age dependency)
 * - OECD Pensions at a Glance (public pension % GDP)
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Recipient dollar shares use Brief 41 LMIC remittance inflows (~$685B, 2024) as the universe; India/Mexico/China/Philippines/Pakistan prints are disclosed Brief 41 anchors, residual LMIC bucket is analytical. Corridor shares use KNOMAD bilateral matrix dollars against the same $685B perimeter (corridor top-k is therefore a lower bound on true bilateral concentration). GDP-dependence ranks follow Brief 41 dependence table. Host pension % GDP from OECD Pensions at a Glance; Italy 16.3% and OECD-32 avg ~8.1% are disclosed. Confidence tags separate disclosed tallies from research estimates.";

export const PRIOR_RESEARCH_PATH = "/blog/demographic-cash-flows-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/demographic-cash-flows-update-2026";
export const PRIOR_Q3_PATH = "/blog/demographic-cash-flows-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/demographic-cash-flows-update-202608";
export const CORRIDORS_PATH = "/blog/global-remittance-corridors-2026";

export const HEADLINE = {
  /** Recipient dollar ladder inside LMIC remittances (~$685B) */
  top1RecipientSharePct: 19,
  top1RecipientLabel: "India",
  top1RecipientBn: 129,
  top3RecipientSharePct: 36,
  top3RecipientLabel: "India · Mexico · China",
  top5RecipientSharePct: 46,
  lmicUniverseBn: 685,
  recipientHhi: 620,
  /** Bilateral corridor concentration (matrix $ vs $685B perimeter) */
  top1CorridorSharePct: 8,
  top1CorridorLabel: "US → Mexico",
  top1CorridorBn: 52,
  top3CorridorSharePct: 13,
  top3CorridorBn: 87,
  corridorTrackedBn: 130.5,
  /** GDP-dependence concentration (small dollars, extreme shares) */
  top1DependenceGdpPct: 45,
  top1DependenceLabel: "Tajikistan",
  top3DependenceAvgGdpPct: 33,
  /** Host public-pension burden concentration */
  top1PensionGdpPct: 16.3,
  top1PensionLabel: "Italy",
  top3PensionAvgGdpPct: 13.7,
  oecdPensionAvgGdpPct: 8.1,
  italyVsOecdMultiple: 2.0,
  /** Age structure contrast */
  japanOldAgeDep: 54,
  nigeriaOldAgeDep: 6,
  /** Flow compare context */
  fdiCompareBn: 470,
  odaCompareBn: 210,
} as const;

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
 * Top LMIC remittance recipients vs $685B Brief 41 universe.
 * Residual closes the perimeter so cumulative shares land at 100%.
 */
export const RECIPIENT_SHARES: RecipientShare[] = [
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
    note: "Largest absolute recipient; skilled + Gulf corridors",
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
    note: "US→MX corridor dominates; Brief 41 estimate (Banxico later restated)",
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
    note: "Analytical residual closing the $685B perimeter",
  },
];

export type CorridorShare = {
  rank: number;
  id: string;
  from: string;
  to: string;
  label: string;
  amountBn: number;
  /** Share of $685B LMIC perimeter */
  shareOfLmicPct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Ranked bilateral corridors — concentration of pipes, not of recipients */
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
    note: "Largest bilateral corridor worldwide",
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
};

/** GDP-dependence ladder — concentration of *reliance*, not of dollars */
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
    id: "nigeria",
    label: "Nigeria",
    short: "NG",
    remittanceGdpPct: 4.0,
    amountBn: 21,
    oldAgeDependency: 6,
    confidence: "estimated",
    fill: "#0ea5e9",
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

/** Host public-pension burden ladder (OECD) */
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
    remittanceGdpPct: 3.7,
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

/** Lorenz-style curves (named entities only — residual excluded from recipient curve) */
export const RECIPIENT_CONCENTRATION_CURVE = buildCurve(
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

export type LensCompareRow = {
  id: string;
  label: string;
  short: string;
  top1Pct: number;
  top3Pct: number;
  universeLabel: string;
  fill: string;
};

/** Cross-lens scatter: top-1 vs top-3 shares */
export const LENS_COMPARE: LensCompareRow[] = [
  {
    id: "recipients",
    label: "Recipient dollars",
    short: "Recipients",
    top1Pct: 19,
    top3Pct: 36,
    universeLabel: "$685B LMIC inflows",
    fill: "#f59e0b",
  },
  {
    id: "corridors",
    label: "Bilateral corridors",
    short: "Corridors",
    top1Pct: 8,
    top3Pct: 13,
    universeLabel: "Share of $685B perimeter",
    fill: "#0ea5e9",
  },
  {
    id: "dependence",
    label: "GDP dependence",
    short: "Dependence",
    top1Pct: 45,
    top3Pct: 33,
    universeLabel: "Top-1 GDP% / top-3 avg GDP%",
    fill: "#ef4444",
  },
  {
    id: "pensions",
    label: "Host pensions",
    short: "Pensions",
    top1Pct: 16.3,
    top3Pct: 13.7,
    universeLabel: "Top-1 GDP% / top-3 avg GDP%",
    fill: "#0f766e",
  },
];

export type FlowCompareRow = {
  id: string;
  label: string;
  bn: number;
  confidence: Confidence;
  fill: string;
};

export const FLOW_COMPARE: FlowCompareRow[] = [
  {
    id: "remit",
    label: "LMIC remittances",
    bn: 685,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    id: "fdi",
    label: "FDI to LMICs",
    bn: 470,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "oda",
    label: "ODA (DAC)",
    bn: 210,
    confidence: "disclosed",
    fill: "#64748b",
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

/** Age × remittance scatter for dual-ledger panel */
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
    remittanceGdpPct: 3.7,
    amountBn: 68,
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

export type ShareTableRow = {
  lens: string;
  top1: string;
  top1Share: string;
  top3: string;
  top3Share: string;
  universe: string;
  confidence: Confidence;
};

export const SHARE_TABLE: ShareTableRow[] = [
  {
    lens: "Recipient dollars",
    top1: "India",
    top1Share: "19%",
    top3: "India · Mexico · China",
    top3Share: "36%",
    universe: "$685B LMIC inflows (Brief 41)",
    confidence: "disclosed",
  },
  {
    lens: "Bilateral corridors",
    top1: "US → Mexico",
    top1Share: "8%",
    top3: "US→MX · UAE→IN · US→PH",
    top3Share: "13%",
    universe: "Share of $685B perimeter",
    confidence: "disclosed",
  },
  {
    lens: "GDP dependence",
    top1: "Tajikistan",
    top1Share: "45% of GDP",
    top3: "TJ · NI · LB (avg)",
    top3Share: "~33% of GDP",
    universe: "Brief 41 dependence table",
    confidence: "disclosed",
  },
  {
    lens: "Host public pensions",
    top1: "Italy",
    top1Share: "16.3% of GDP",
    top3: "IT · FR · DE (avg)",
    top3Share: "~13.7% of GDP",
    universe: "OECD Pensions at a Glance",
    confidence: "disclosed",
  },
];

export function fmtBn(n: number, digits = 0): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

/** Named recipients only (exclude residual bucket) */
export function namedRecipients(): RecipientShare[] {
  return RECIPIENT_SHARES.filter((r) => r.id !== "residual");
}
