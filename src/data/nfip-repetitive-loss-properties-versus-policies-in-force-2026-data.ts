/**
 * NFIP repetitive-loss properties versus policies in force (2026).
 *
 * Core question: What share of NFIP policies and paid losses sit in
 * repetitive-loss properties versus the rest of the book?
 *
 * Headline (GAO-26-109045 / FEMA): unmitigated RL properties ≈ 2.5% of
 * policies in force, yet properties with two or more losses have drawn
 * 48% of NFIP claim dollars (cumulative through Dec 2021).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Primary: GAO-26-109045, Flood Risk Mitigation: Reducing Fiscal Exposure and Improving Affordability (Mar 26, 2026 testimony), citing FEMA figures and GAO-23-105977. Policies in force 4.58M as of Dec 2025; RL properties insured by NFIP 112,640 as of Jan 2026; claim-dollar share (48%) is cumulative NFIP payments to properties with ≥2 losses as of Dec 2021. Unmitigated RL stock series (2009/2018/2026) and mitigation counts (1989–2025) from the same testimony. Historical 1% / 25–30% framing from GAO-10-1063T. State multiple-loss inventory ranks are compiled from FEMA OpenFEMA NFIP Multiple Loss Properties summaries as reported in public inventories and labeled estimated where FEMA does not publish a GAO-style policy-share cut by state. Premium-shortfall and Risk Rating 2.0 surcharge examples are GAO disclosures, not actuarial projections by this desk.";

export const SOURCES = [
  {
    label: "GAO-26-109045 — Flood Risk Mitigation (Mar 2026)",
    url: "https://www.gao.gov/products/gao-26-109045",
  },
  {
    label: "GAO-26-109045 PDF",
    url: "https://www.gao.gov/assets/gao-26-109045.pdf",
  },
  {
    label: "GAO-23-105977 — FEMA rate-setting / NFIP fiscal exposure",
    url: "https://www.gao.gov/products/gao-23-105977",
  },
  {
    label: "FEMA OpenFEMA — NFIP Multiple Loss Properties v1",
    url: "https://www.fema.gov/openfema-data-page/nfip-multiple-loss-properties-v1",
  },
  {
    label: "GAO-10-1063T — NFIP financial & operational issues",
    url: "https://www.gao.gov/assets/gao-10-1063t.pdf",
  },
] as const;

export const VIZ_MARKERS = [
  "RL share of policies and of paid losses",
  "2.5% of policies · 48% of claim dollars",
] as const;

export const HEADLINE = {
  /** Unmitigated RL as share of policies in force */
  rlPolicySharePct: 2.5,
  /** Cumulative claim $ to properties with ≥2 losses (as of Dec 2021) */
  multiLossClaimSharePct: 48,
  /** Policies in force (Dec 2025) */
  policiesInForceM: 4.58,
  policiesInForce: 4_580_000,
  /** RL properties still insured by NFIP (Jan 2026) */
  rlInsuredCount: 112_640,
  /** Implied rest-of-book policy share */
  restPolicySharePct: 97.5,
  restClaimSharePct: 52,
  /** Claim $ per policy-share point (illustrative ratio) */
  claimVsPolicyRatio: Math.round(48 / 2.5),
  confidence: "disclosed" as Confidence,
};

/** Book split: policies vs cumulative claim dollars */
export type BookSplitRow = {
  segment: "repetitive-loss" | "rest-of-book";
  label: string;
  policySharePct: number;
  claimSharePct: number;
  confidence: Confidence;
};

export const BOOK_SPLIT: BookSplitRow[] = [
  {
    segment: "repetitive-loss",
    label: "Repetitive-loss book",
    policySharePct: 2.5,
    claimSharePct: 48,
    confidence: "disclosed",
  },
  {
    segment: "rest-of-book",
    label: "Rest of NFIP book",
    policySharePct: 97.5,
    claimSharePct: 52,
    confidence: "disclosed",
  },
];

/** Unmitigated RL stock over time (GAO fig. 3) */
export type RlStockRow = {
  year: number;
  unmitigatedRl: number;
  confidence: Confidence;
};

export const RL_STOCK: RlStockRow[] = [
  { year: 2009, unmitigatedRl: 131_000, confidence: "disclosed" },
  { year: 2018, unmitigatedRl: 176_000, confidence: "disclosed" },
  { year: 2026, unmitigatedRl: 227_000, confidence: "disclosed" },
];

/** How the insured RL slice sits inside the full unmitigated stock */
export const RL_INSURED_VS_STOCK = {
  unmitigatedStock2026: 227_000,
  nfipInsuredRlJan2026: 112_640,
  mitigatedRl1989to2025: 12_972,
  confidence: "disclosed" as Confidence,
};

/** Mitigation method mix — all FEMA-mitigated properties FY1989–2025 */
export type MitigationMethodRow = {
  method: string;
  count: number;
  sharePct: number;
  confidence: Confidence;
};

export const MITIGATION_METHODS: MitigationMethodRow[] = [
  {
    method: "Acquisition",
    count: 69_415,
    sharePct: 72.5,
    confidence: "disclosed",
  },
  {
    method: "Elevation",
    count: 22_039,
    sharePct: 23.0,
    confidence: "disclosed",
  },
  {
    method: "Relocation / floodproofing / other",
    count: 4_308,
    sharePct: 4.5,
    confidence: "estimated",
  },
];

export const MITIGATION_TOTAL = {
  properties: 95_762,
  hmgpSharePct: 77,
  avgAcquisitionCostK: 136,
  avgElevationCostK: 107,
  confidence: "disclosed" as Confidence,
};

/** Historical GAO framing of the same imbalance */
export type EraCompareRow = {
  era: string;
  source: string;
  policySharePct: number;
  claimSharePct: number;
  note: string;
  confidence: Confidence;
};

export const ERA_COMPARE: EraCompareRow[] = [
  {
    era: "~2010 GAO framing",
    source: "GAO-10-1063T",
    policySharePct: 1,
    claimSharePct: 27.5,
    note: "RL ≈ 1% of policies; 25–30% of claims (midpoint shown)",
    confidence: "disclosed",
  },
  {
    era: "2021–2026 FEMA / GAO",
    source: "GAO-26-109045",
    policySharePct: 2.5,
    claimSharePct: 48,
    note: "Unmitigated RL ≈ 2.5% of policies; 48% of claim $ to ≥2-loss properties",
    confidence: "disclosed",
  },
];

/** State multiple-loss inventory (OpenFEMA-derived public ranks) */
export type StateMlRow = {
  state: string;
  abbr: string;
  multipleLoss: number;
  severeRepetitiveLoss: number;
  confidence: Confidence;
};

export const STATE_MULTIPLE_LOSS: StateMlRow[] = [
  {
    state: "Texas",
    abbr: "TX",
    multipleLoss: 39_177,
    severeRepetitiveLoss: 6_930,
    confidence: "estimated",
  },
  {
    state: "Louisiana",
    abbr: "LA",
    multipleLoss: 38_481,
    severeRepetitiveLoss: 5_411,
    confidence: "estimated",
  },
  {
    state: "Florida",
    abbr: "FL",
    multipleLoss: 33_547,
    severeRepetitiveLoss: 5_402,
    confidence: "estimated",
  },
  {
    state: "New York",
    abbr: "NY",
    multipleLoss: 19_513,
    severeRepetitiveLoss: 2_045,
    confidence: "estimated",
  },
  {
    state: "New Jersey",
    abbr: "NJ",
    multipleLoss: 16_205,
    severeRepetitiveLoss: 3_103,
    confidence: "estimated",
  },
  {
    state: "North Carolina",
    abbr: "NC",
    multipleLoss: 12_265,
    severeRepetitiveLoss: 1_571,
    confidence: "estimated",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    multipleLoss: 9_020,
    severeRepetitiveLoss: 1_291,
    confidence: "estimated",
  },
  {
    state: "Virginia",
    abbr: "VA",
    multipleLoss: 6_623,
    severeRepetitiveLoss: 681,
    confidence: "estimated",
  },
  {
    state: "Mississippi",
    abbr: "MS",
    multipleLoss: 6_024,
    severeRepetitiveLoss: 780,
    confidence: "estimated",
  },
  {
    state: "Alabama",
    abbr: "AL",
    multipleLoss: 5_152,
    severeRepetitiveLoss: 719,
    confidence: "estimated",
  },
];

export const NATIONAL_ML_INVENTORY = {
  multipleLossProperties: 237_250,
  severeRepetitiveLoss: 34_679,
  mitigatedInInventory: 13_086,
  confidence: "estimated" as Confidence,
};

/** Fiscal context rows for the composed panel */
export type FiscalContextRow = {
  label: string;
  value: number;
  unit: "billionUsd" | "pct" | "count";
  confidence: Confidence;
};

export const FISCAL_CONTEXT: FiscalContextRow[] = [
  {
    label: "Treasury borrowing since 2005",
    value: 38.5,
    unit: "billionUsd",
    confidence: "disclosed",
  },
  {
    label: "2023 premium shortfall (GAO est.)",
    value: 2.7,
    unit: "billionUsd",
    confidence: "disclosed",
  },
  {
    label: "Policies still discounted (Dec 2022)",
    value: 66,
    unit: "pct",
    confidence: "disclosed",
  },
  {
    label: "Flood damages 2024 (FEMA)",
    value: 8,
    unit: "billionUsd",
    confidence: "disclosed",
  },
];

/** Dual-axis series for policy share vs claim share through eras */
export type DualEraPoint = {
  label: string;
  policySharePct: number;
  claimSharePct: number;
};

export function dualEraSeries(): DualEraPoint[] {
  return ERA_COMPARE.map((r) => ({
    label: r.era,
    policySharePct: r.policySharePct,
    claimSharePct: r.claimSharePct,
  }));
}

/** Scatter: state ML count vs SRL count */
export type StateScatterPoint = {
  abbr: string;
  multipleLoss: number;
  severeRepetitiveLoss: number;
  srlSharePct: number;
};

export function stateScatter(): StateScatterPoint[] {
  return STATE_MULTIPLE_LOSS.map((s) => ({
    abbr: s.abbr,
    multipleLoss: s.multipleLoss,
    severeRepetitiveLoss: s.severeRepetitiveLoss,
    srlSharePct:
      Math.round((s.severeRepetitiveLoss / s.multipleLoss) * 1000) / 10,
  }));
}

export function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}
