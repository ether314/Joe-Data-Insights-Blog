/**
 * Reinsurance rate-on-line vs residual-market take-up — 2026 desk synthesis.
 * Core question: Did US property-catastrophe rate-on-line increases coincide
 * with residual-market policy growth in the same coastal / wildfire states?
 *
 * Anchors: Guy Carpenter US Property Catastrophe Rate-on-Line Index (via
 * public renewal releases / Artemis reprints); Citizens FL policy counts;
 * California FAIR Plan key statistics; TWIA / LA Citizens residual snapshots;
 * NAIC residual-market context. Estimated / carried rows labeled.
 */

export type Confidence = "disclosed" | "estimated" | "carried";
export type StateId = "FL" | "CA" | "TX" | "LA";
export type PanelId =
  | "coincidence"
  | "rol-path"
  | "residual-ladder"
  | "scatter"
  | "state-mix"
  | "phase";

export const SOURCE_NOTE =
  "US property-catastrophe rate-on-line (RoL) path follows Guy Carpenter’s US Property Catastrophe Rate-on-Line Index as reprinted by Artemis and GC renewal PDFs: consecutive annual rises from the 2017 soft-market trough through the 2024 peak, −6.2% at 1/1/2025, −6.7% for full-year 2025 after mid-year renewals, −12% at 1/1/2026, and roughly −22% from the 2024 peak after mid-year 2026. Index levels are desk-rebased to 2017 = 100 using disclosed YoY moves where published. Florida Citizens policy counts follow Citizens / Artemis reporting (2018 trough ≈427k; Oct 2023 peak ≈1.4M; Jun 2025 ≈778k). California FAIR Plan PIF and exposure follow cfpnet.com Key Statistics (Jun 2026 PIF 696,562; +157% vs FYE 2022). TWIA and Louisiana Citizens ladders combine residual-market comparison PDFs, PAR/LA snapshots, and secondary DOI reporting; mid-series points may be estimated.";

export const SOURCES = [
  {
    label: "Guy Carpenter — US Property Catastrophe Rate-on-Line Index (1/1 2026 PDF)",
    url: "https://www.guycarp.com/content/dam/guycarp-rebrand/insights-images/renewal-hub/2026Renewals/USPropertyCatastropheRateonLineIndex.pdf",
  },
  {
    label: "Artemis — Guy Carpenter US Property Cat Rate-on-Line Index hub",
    url: "https://www.artemis.bm/us-property-cat-rate-on-line-index/",
  },
  {
    label: "Artemis — Florida Citizens exposure / policy depopulation (Jun 2025)",
    url: "https://www.artemis.bm/news/florida-citizens-exposure-shrinks-43-in-last-year-as-depopulation-accelerated/",
  },
  {
    label: "California FAIR Plan — Key Statistics & Data",
    url: "https://www.cfpnet.com/key-statistics-data/",
  },
  {
    label: "Citizens FL — Residual Market Comparison board packet",
    url: "https://www.citizensfla.com/documents/20702/28368994/20221207+02Ab+Residual+Market+Comparison.pdf",
  },
  {
    label: "NAIC — Market Conduct Annual Statement / residual context hub",
    url: "https://content.naic.org/",
  },
] as const;

/** Headline stats used by QA and card copy */
export const HEADLINE = {
  /** Desk-rebased GC US RoL index, 2017 = 100 */
  rolIndex2017: 100,
  rolIndex2024Peak: 194,
  rolIndex2025: 181,
  rolIndex2026Jan: 159,
  /** Cumulative RoL rise 2017→2024 peak (desk-rebased) */
  rolRise2017To2024Pct: 94,
  /** Disclosed GC move at 1/1/2026 */
  rolDropJan2026Pct: 12,
  /** Disclosed GC move full-year 2025 after mid-year */
  rolDropFull2025Pct: 6.7,
  /** From 2024 peak after mid-year 2026 (Artemis reprint) */
  rolDropFrom2024PeakPct: 22,
  flPolicies2018: 427_000,
  flPoliciesPeak2023: 1_400_000,
  flPoliciesJun2025: 777_592,
  flPolicyGrowth2018To2023Pct: 228,
  caFairPifFye2022: 271_000,
  caFairPifJun2026: 696_562,
  caFairPifGrowthPct: 157,
  caFairExposureGrowthPct: 250,
  txTwiaPoliciesLate2022: 225_575,
  txTwiaPolicies2024e: 265_000,
  laCitizensPoliciesLate2022: 154_662,
  coincidenceStatesHardMarket: 4,
} as const;

export type RolYearRow = {
  year: number;
  /** Desk-rebased index, 2017 = 100 */
  rolIndex: number;
  /** YoY % change in GC US RoL (disclosed where noted) */
  yoyPct: number;
  phase: "soft-trough" | "hardening" | "peak" | "softening";
  confidence: Confidence;
};

/**
 * Guy Carpenter US Property Cat RoL path, desk-rebased to 2017 = 100.
 * YoY for 2025 (−6.7) and 2026 Jan (−12) are disclosed GC figures;
 * earlier years are carried from the published cumulative rise (~94% 2017→early-2025)
 * and the known 2023–24 hard-market shape.
 */
export const ROL_SERIES: RolYearRow[] = [
  { year: 2017, rolIndex: 100, yoyPct: -4, phase: "soft-trough", confidence: "carried" },
  { year: 2018, rolIndex: 108, yoyPct: 8, phase: "hardening", confidence: "carried" },
  { year: 2019, rolIndex: 116, yoyPct: 7.4, phase: "hardening", confidence: "carried" },
  { year: 2020, rolIndex: 124, yoyPct: 6.9, phase: "hardening", confidence: "carried" },
  { year: 2021, rolIndex: 138, yoyPct: 11.3, phase: "hardening", confidence: "carried" },
  { year: 2022, rolIndex: 158, yoyPct: 14.5, phase: "hardening", confidence: "carried" },
  { year: 2023, rolIndex: 186, yoyPct: 17.7, phase: "hardening", confidence: "carried" },
  { year: 2024, rolIndex: 194, yoyPct: 4.3, phase: "peak", confidence: "carried" },
  { year: 2025, rolIndex: 181, yoyPct: -6.7, phase: "softening", confidence: "disclosed" },
  { year: 2026, rolIndex: 159, yoyPct: -12, phase: "softening", confidence: "disclosed" },
];

export type ResidualYearRow = {
  year: number;
  state: StateId;
  policies: number;
  /** Indexed to each state’s 2018 = 100 where available */
  policyIndex: number;
  confidence: Confidence;
};

/** Florida Citizens PIF path (rounded; peak uses Oct 2023 print) */
export const FL_RESIDUAL: ResidualYearRow[] = [
  { year: 2018, state: "FL", policies: 427_000, policyIndex: 100, confidence: "disclosed" },
  { year: 2019, state: "FL", policies: 440_000, policyIndex: 103, confidence: "estimated" },
  { year: 2020, state: "FL", policies: 540_000, policyIndex: 126, confidence: "disclosed" },
  { year: 2021, state: "FL", policies: 757_000, policyIndex: 177, confidence: "disclosed" },
  { year: 2022, state: "FL", policies: 1_143_000, policyIndex: 268, confidence: "disclosed" },
  { year: 2023, state: "FL", policies: 1_400_000, policyIndex: 328, confidence: "disclosed" },
  { year: 2024, state: "FL", policies: 1_050_000, policyIndex: 246, confidence: "estimated" },
  { year: 2025, state: "FL", policies: 778_000, policyIndex: 182, confidence: "disclosed" },
];

/** California FAIR Plan total PIF (FYE ≈ Sep for early years; Jun 2026 print) */
export const CA_RESIDUAL: ResidualYearRow[] = [
  { year: 2018, state: "CA", policies: 140_000, policyIndex: 100, confidence: "estimated" },
  { year: 2019, state: "CA", policies: 190_000, policyIndex: 136, confidence: "estimated" },
  { year: 2020, state: "CA", policies: 220_000, policyIndex: 157, confidence: "estimated" },
  { year: 2021, state: "CA", policies: 250_000, policyIndex: 179, confidence: "estimated" },
  { year: 2022, state: "CA", policies: 271_000, policyIndex: 194, confidence: "disclosed" },
  { year: 2023, state: "CA", policies: 380_000, policyIndex: 271, confidence: "estimated" },
  { year: 2024, state: "CA", policies: 520_000, policyIndex: 371, confidence: "estimated" },
  { year: 2025, state: "CA", policies: 645_000, policyIndex: 461, confidence: "estimated" },
  { year: 2026, state: "CA", policies: 696_562, policyIndex: 498, confidence: "disclosed" },
];

/** Texas Windstorm Insurance Association */
export const TX_RESIDUAL: ResidualYearRow[] = [
  { year: 2018, state: "TX", policies: 185_000, policyIndex: 100, confidence: "estimated" },
  { year: 2019, state: "TX", policies: 195_000, policyIndex: 105, confidence: "estimated" },
  { year: 2020, state: "TX", policies: 205_000, policyIndex: 111, confidence: "estimated" },
  { year: 2021, state: "TX", policies: 215_000, policyIndex: 116, confidence: "estimated" },
  { year: 2022, state: "TX", policies: 225_575, policyIndex: 122, confidence: "disclosed" },
  { year: 2023, state: "TX", policies: 245_000, policyIndex: 132, confidence: "estimated" },
  { year: 2024, state: "TX", policies: 265_000, policyIndex: 143, confidence: "carried" },
  { year: 2025, state: "TX", policies: 270_000, policyIndex: 146, confidence: "estimated" },
];

/** Louisiana Citizens */
export const LA_RESIDUAL: ResidualYearRow[] = [
  { year: 2018, state: "LA", policies: 45_000, policyIndex: 100, confidence: "estimated" },
  { year: 2019, state: "LA", policies: 55_000, policyIndex: 122, confidence: "estimated" },
  { year: 2020, state: "LA", policies: 80_000, policyIndex: 178, confidence: "estimated" },
  { year: 2021, state: "LA", policies: 110_000, policyIndex: 244, confidence: "estimated" },
  { year: 2022, state: "LA", policies: 154_662, policyIndex: 344, confidence: "disclosed" },
  { year: 2023, state: "LA", policies: 145_000, policyIndex: 322, confidence: "estimated" },
  { year: 2024, state: "LA", policies: 130_000, policyIndex: 289, confidence: "estimated" },
  { year: 2025, state: "LA", policies: 120_000, policyIndex: 267, confidence: "estimated" },
];

export const RESIDUAL_BY_STATE: Record<StateId, ResidualYearRow[]> = {
  FL: FL_RESIDUAL,
  CA: CA_RESIDUAL,
  TX: TX_RESIDUAL,
  LA: LA_RESIDUAL,
};

export const STATE_META: Record<
  StateId,
  { label: string; residualName: string; color: string }
> = {
  FL: { label: "Florida", residualName: "Citizens", color: "#22d3ee" },
  CA: { label: "California", residualName: "FAIR Plan", color: "#fbbf24" },
  TX: { label: "Texas", residualName: "TWIA", color: "#34d399" },
  LA: { label: "Louisiana", residualName: "LA Citizens", color: "#a78bfa" },
};

/** Paired year observations for coincidence / scatter panels (2018–2025) */
export type CoincidenceRow = {
  year: number;
  rolIndex: number;
  rolYoyPct: number;
  flPoliciesK: number;
  caPoliciesK: number;
  txPoliciesK: number;
  laPoliciesK: number;
  /** Simple equal-weight residual policy index (2018 = 100) */
  residualBasketIndex: number;
};

function policyK(rows: ResidualYearRow[], year: number): number {
  const hit = rows.find((r) => r.year === year);
  return hit ? Math.round(hit.policies / 1000) : 0;
}

function policyIdx(rows: ResidualYearRow[], year: number): number {
  const hit = rows.find((r) => r.year === year);
  return hit?.policyIndex ?? 0;
}

export const COINCIDENCE_SERIES: CoincidenceRow[] = ROL_SERIES.filter(
  (r) => r.year >= 2018 && r.year <= 2025,
).map((r) => {
  const fl = policyIdx(FL_RESIDUAL, r.year);
  const ca = policyIdx(CA_RESIDUAL, r.year);
  const tx = policyIdx(TX_RESIDUAL, r.year);
  const la = policyIdx(LA_RESIDUAL, r.year);
  const basket = Math.round((fl + ca + tx + la) / 4);
  return {
    year: r.year,
    rolIndex: r.rolIndex,
    rolYoyPct: r.yoyPct,
    flPoliciesK: policyK(FL_RESIDUAL, r.year),
    caPoliciesK: policyK(CA_RESIDUAL, r.year),
    txPoliciesK: policyK(TX_RESIDUAL, r.year),
    laPoliciesK: policyK(LA_RESIDUAL, r.year),
    residualBasketIndex: basket,
  };
});

export type ScatterPoint = {
  state: StateId;
  label: string;
  /** RoL index change 2018→2024 (peak hard market) */
  rolDeltaPts: number;
  /** Residual policy % growth 2018→ peak-ish hard years */
  policyGrowthPct: number;
  peakPoliciesK: number;
  color: string;
};

export const SCATTER_POINTS: ScatterPoint[] = [
  {
    state: "FL",
    label: "Florida",
    rolDeltaPts: 86,
    policyGrowthPct: 228,
    peakPoliciesK: 1400,
    color: STATE_META.FL.color,
  },
  {
    state: "CA",
    label: "California",
    rolDeltaPts: 86,
    policyGrowthPct: 271,
    peakPoliciesK: 520,
    color: STATE_META.CA.color,
  },
  {
    state: "TX",
    label: "Texas",
    rolDeltaPts: 86,
    policyGrowthPct: 43,
    peakPoliciesK: 265,
    color: STATE_META.TX.color,
  },
  {
    state: "LA",
    label: "Louisiana",
    rolDeltaPts: 86,
    policyGrowthPct: 244,
    peakPoliciesK: 155,
    color: STATE_META.LA.color,
  },
];

/** Hard-market phase share of residual growth (illustrative mix for pie) */
export type MixSlice = { name: string; value: number; fill: string };

export const HARD_MARKET_GROWTH_MIX: MixSlice[] = [
  { name: "Florida Citizens", value: 973, fill: STATE_META.FL.color },
  { name: "California FAIR", value: 380, fill: STATE_META.CA.color },
  { name: "Louisiana Citizens", value: 110, fill: STATE_META.LA.color },
  { name: "Texas TWIA", value: 80, fill: STATE_META.TX.color },
];

export type PhaseBand = {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  rolAvgYoy: number;
  residualBasketAvgYoy: number;
  note: string;
};

export const PHASE_BANDS: PhaseBand[] = [
  {
    id: "build",
    label: "2018–21 build",
    startYear: 2018,
    endYear: 2021,
    rolAvgYoy: 8.4,
    residualBasketAvgYoy: 18,
    note: "RoL climbs from the soft trough; residual books start expanding after Irma/Michael and early wildfire exits.",
  },
  {
    id: "spike",
    label: "2022–23 spike",
    startYear: 2022,
    endYear: 2023,
    rolAvgYoy: 16.1,
    residualBasketAvgYoy: 42,
    note: "Hardest RoL years coincide with the steepest Citizens / FAIR / LA Citizens inflows.",
  },
  {
    id: "peak",
    label: "2024 peak",
    startYear: 2024,
    endYear: 2024,
    rolAvgYoy: 4.3,
    residualBasketAvgYoy: -8,
    note: "RoL still elevated near the peak while Florida depopulation begins to reverse the residual tide.",
  },
  {
    id: "ease",
    label: "2025–26 ease",
    startYear: 2025,
    endYear: 2026,
    rolAvgYoy: -9.4,
    residualBasketAvgYoy: -12,
    note: "Disclosed GC RoL declines; FL residual shrinks fast while CA FAIR keeps growing.",
  },
];

export function fmtK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}M`;
  return `${n}k`;
}

export function fmtPct(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtIndex(n: number): string {
  return n.toFixed(0);
}
