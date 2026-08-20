/**
 * Adaptation economics — vintage update (AGR 2025 vs research / AGR 2024).
 * Core question: What changed in the newest official vintage versus the last
 * post on this theme? (Who pays for climate damage and adaptation before
 * policy catches up?)
 *
 * Prior vintage: UNEP AGR 2024 (research post) — needs $215–387B/yr this decade,
 * intl public flows $28B (2022), gap $187–359B.
 * Newest vintage: UNEP AGR 2025 “Running on Empty” — needs $310–365B/yr by 2035,
 * flows $26B (2023), gap $284–339B.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Vintage delta: research/AGR 2024 stock ($215–387B needs; $28B flows in 2022; $187–359B gap) → UNEP Adaptation Gap Report 2025 “Running on Empty” ($310–365B needs by 2035; $26B flows in 2023; $284–339B gap). Swiss Re nat-cat protection gap ($424B, 2025) unchanged as secondary ledger.";

export const SOURCES = [
  {
    label: "UNEP Adaptation Gap Report 2025 — Running on Empty",
    url: "https://www.unep.org/resources/adaptation-gap-report-2025",
  },
  {
    label: "UNEP press release — Slow climate adaptation (29 Oct 2025)",
    url: "https://www.unep.org/news-and-stories/press-release/slow-climate-adaptation-threatening-lives-and-economies",
  },
  {
    label: "Prior theme post — Adaptation economics research",
    url: "/blog/adaptation-economics-research-2026",
  },
];

/** Headline meters — newest print and Δ vs research vintage */
export const HEADLINE = {
  /** AGR 2025 needs band (developing countries, by 2035, 2023 prices) */
  needsLowBn: 310,
  needsHighBn: 365,
  needsMidBn: 337.5,
  /** Research / AGR 2024 needs band (this decade) */
  priorNeedsLowBn: 215,
  priorNeedsHighBn: 387,
  priorNeedsMidBn: 301,
  /** Intl public adaptation finance */
  flows2023Bn: 26,
  flows2022Bn: 28,
  flowsYoYDeltaBn: -2,
  flowsYoYPct: -7.1,
  glasgowTargetBn: 40,
  glasgowBaseline2019Bn: 19,
  /** Gaps */
  gapLowBn: 284,
  gapHighBn: 339,
  priorGapLowBn: 187,
  priorGapHighBn: 359,
  needsVsFlowsMultipleLow: 12,
  needsVsFlowsMultipleHigh: 14,
  /** Private adaptation (AGR 2025) */
  privatePotentialBn: 50,
  privateCurrentBn: 5,
  /** Instrument mix 2022–2023 (AGR 2025) */
  concessionalSharePct: 70,
  debtInstrumentSharePct: 58,
  /** NCQG / inflation framing */
  ncqgBn: 300,
  needsInflatedLowBn: 440,
  needsInflatedHighBn: 520,
  /** Secondary Swiss Re ledger (unchanged vs research) */
  protectionGap2025Bn: 424,
  resilienceIndex2025Pct: 27.3,
  /** Planning progress (AGR 2025) */
  countriesWithNapPolicies: 172,
  reportedAdaptationActions: 1600,
} as const;

export type NeedsScenario = "low" | "mid" | "high";

export function needsBn(scenario: NeedsScenario): number {
  if (scenario === "low") return HEADLINE.needsLowBn;
  if (scenario === "high") return HEADLINE.needsHighBn;
  return HEADLINE.needsMidBn;
}

export function priorNeedsBn(scenario: NeedsScenario): number {
  if (scenario === "low") return HEADLINE.priorNeedsLowBn;
  if (scenario === "high") return HEADLINE.priorNeedsHighBn;
  return HEADLINE.priorNeedsMidBn;
}

export function gapBn(scenario: NeedsScenario): number {
  return needsBn(scenario) - HEADLINE.flows2023Bn;
}

export function priorGapBn(scenario: NeedsScenario): number {
  return priorNeedsBn(scenario) - HEADLINE.flows2022Bn;
}

/** Side-by-side vintage meters for dumbbell / delta bars */
export type VintageMeter = {
  id: string;
  label: string;
  shortLabel: string;
  priorBn: number;
  newestBn: number;
  unit: "bn";
  deltaBn: number;
  deltaDirection: "up" | "down" | "flat";
  note: string;
  confidence: Confidence;
};

export const VINTAGE_METERS: VintageMeter[] = [
  {
    id: "needs-mid",
    label: "Adaptation needs (midpoint)",
    shortLabel: "Needs mid",
    priorBn: HEADLINE.priorNeedsMidBn,
    newestBn: HEADLINE.needsMidBn,
    unit: "bn",
    deltaBn: HEADLINE.needsMidBn - HEADLINE.priorNeedsMidBn,
    deltaDirection: "up",
    note: "AGR 2024 decade band mid → AGR 2025 2035 band mid (different horizon)",
    confidence: "disclosed",
  },
  {
    id: "flows",
    label: "Intl public adaptation flows",
    shortLabel: "Flows",
    priorBn: HEADLINE.flows2022Bn,
    newestBn: HEADLINE.flows2023Bn,
    unit: "bn",
    deltaBn: HEADLINE.flowsYoYDeltaBn,
    deltaDirection: "down",
    note: "2022 → 2023; MDB funding drop drove the decline",
    confidence: "disclosed",
  },
  {
    id: "gap-mid",
    label: "Adaptation finance gap (midpoint)",
    shortLabel: "Gap mid",
    priorBn: (HEADLINE.priorGapLowBn + HEADLINE.priorGapHighBn) / 2,
    newestBn: (HEADLINE.gapLowBn + HEADLINE.gapHighBn) / 2,
    unit: "bn",
    deltaBn:
      (HEADLINE.gapLowBn + HEADLINE.gapHighBn) / 2 -
      (HEADLINE.priorGapLowBn + HEADLINE.priorGapHighBn) / 2,
    deltaDirection: "up",
    note: "Needs re-anchored to 2035; flows fell — gap band shifts up",
    confidence: "disclosed",
  },
  {
    id: "glasgow",
    label: "Glasgow doubling target",
    shortLabel: "Glasgow 2×",
    priorBn: HEADLINE.glasgowTargetBn,
    newestBn: HEADLINE.glasgowTargetBn,
    unit: "bn",
    deltaBn: 0,
    deltaDirection: "flat",
    note: "Target unchanged (~$40B by 2025); AGR 2025 says on-trend miss",
    confidence: "disclosed",
  },
];

/** Extended intl public adaptation flow path including 2023 drop */
export type AdaptFlowYear = {
  year: number;
  intlPublicBn: number;
  vintage: "prior" | "new" | "shared";
  note?: string;
};

export const INTL_PUBLIC_ADAPT_FLOWS: AdaptFlowYear[] = [
  { year: 2016, intlPublicBn: 10, vintage: "shared" },
  { year: 2017, intlPublicBn: 11, vintage: "shared" },
  { year: 2018, intlPublicBn: 13, vintage: "shared" },
  {
    year: 2019,
    intlPublicBn: 19,
    vintage: "shared",
    note: "Glasgow Pact baseline",
  },
  { year: 2020, intlPublicBn: 17, vintage: "shared" },
  { year: 2021, intlPublicBn: 22, vintage: "shared" },
  {
    year: 2022,
    intlPublicBn: 28,
    vintage: "prior",
    note: "Research-post peak print",
  },
  {
    year: 2023,
    intlPublicBn: 26,
    vintage: "new",
    note: "AGR 2025 — first YoY drop since 2020",
  },
];

/** Needs band comparison — prior decade vs new 2035 anchor */
export type NeedsBandRow = {
  vintage: "AGR 2024" | "AGR 2025";
  horizon: string;
  lowBn: number;
  highBn: number;
  midBn: number;
  fill: string;
};

export const NEEDS_BANDS: NeedsBandRow[] = [
  {
    vintage: "AGR 2024",
    horizon: "This decade",
    lowBn: HEADLINE.priorNeedsLowBn,
    highBn: HEADLINE.priorNeedsHighBn,
    midBn: HEADLINE.priorNeedsMidBn,
    fill: "#64748b",
  },
  {
    vintage: "AGR 2025",
    horizon: "By 2035",
    lowBn: HEADLINE.needsLowBn,
    highBn: HEADLINE.needsHighBn,
    midBn: HEADLINE.needsMidBn,
    fill: "#0ea5e9",
  },
];

/** Closing-the-gap levers / shortfalls (AGR 2025 framing) */
export type GapLever = {
  id: string;
  label: string;
  shortLabel: string;
  bn: number;
  kind: "flow" | "target" | "potential" | "need";
  color: string;
  note: string;
};

export const GAP_LEVERS: GapLever[] = [
  {
    id: "current-flows",
    label: "Current intl public flows (2023)",
    shortLabel: "Flows 2023",
    bn: HEADLINE.flows2023Bn,
    kind: "flow",
    color: "#14b8a6",
    note: "Down $2B YoY",
  },
  {
    id: "glasgow",
    label: "Glasgow 2× target (by 2025)",
    shortLabel: "Glasgow",
    bn: HEADLINE.glasgowTargetBn,
    kind: "target",
    color: "#a78bfa",
    note: "On-trend miss per AGR 2025",
  },
  {
    id: "private-potential",
    label: "Realistic private potential",
    shortLabel: "Private pot.",
    bn: HEADLINE.privatePotentialBn,
    kind: "potential",
    color: "#f59e0b",
    note: "vs ~$5B tracked now",
  },
  {
    id: "mdb-2030",
    label: "MDB adaptation target (illustrative 2030)",
    shortLabel: "MDB 2030",
    bn: 49,
    kind: "target",
    color: "#0ea5e9",
    note: "AGR ES delivery path",
  },
  {
    id: "needs-low",
    label: "Needs low (2035)",
    shortLabel: "Needs low",
    bn: HEADLINE.needsLowBn,
    kind: "need",
    color: "#f43f5e",
    note: "12× current flows",
  },
  {
    id: "needs-high",
    label: "Needs high (2035)",
    shortLabel: "Needs high",
    bn: HEADLINE.needsHighBn,
    kind: "need",
    color: "#e11d48",
    note: "14× current flows",
  },
];

/** Who still pays when flows fall — residual incidence (editorial, update framing) */
export type ResidualBearer = {
  id: string;
  label: string;
  shortLabel: string;
  sharePct: number;
  deltaNote: string;
  color: string;
};

export const RESIDUAL_BEARERS: ResidualBearer[] = [
  {
    id: "households",
    label: "Uninsured households & SMEs",
    shortLabel: "Households",
    sharePct: 44,
    deltaNote: "Share rises as public flows stall",
    color: "#f43f5e",
  },
  {
    id: "sovereigns",
    label: "National & local budgets",
    shortLabel: "Sovereigns",
    sharePct: 29,
    deltaNote: "Debt-heavy adaptation instruments amplify fiscal hit",
    color: "#0ea5e9",
  },
  {
    id: "insurers",
    label: "Insurers (covered slice)",
    shortLabel: "Insurance",
    sharePct: 17,
    deltaNote: "Swiss Re resilience still ~27%; $424B protection gap",
    color: "#14b8a6",
  },
  {
    id: "intl-public",
    label: "Intl public adaptation finance",
    shortLabel: "Intl public",
    sharePct: 6,
    deltaNote: "Numerator fell to $26B",
    color: "#a78bfa",
  },
  {
    id: "private",
    label: "Tracked private adaptation",
    shortLabel: "Private",
    sharePct: 4,
    deltaNote: "~$5B now; $50B potential if de-risked",
    color: "#f59e0b",
  },
];

/** Instrument mix for 2022–2023 adaptation flows */
export type InstrumentSlice = {
  id: string;
  label: string;
  sharePct: number;
  color: string;
};

export const INSTRUMENT_MIX: InstrumentSlice[] = [
  {
    id: "debt",
    label: "Debt instruments",
    sharePct: HEADLINE.debtInstrumentSharePct,
    color: "#f43f5e",
  },
  {
    id: "non-debt",
    label: "Grants & non-debt",
    sharePct: 100 - HEADLINE.debtInstrumentSharePct,
    color: "#14b8a6",
  },
];

/** NCQG insufficiency framing — adaptation needs vs dual-purpose goal */
export type NcqgCompareRow = {
  id: string;
  label: string;
  shortLabel: string;
  bn: number;
  color: string;
  note: string;
};

export const NCQG_COMPARE: NcqgCompareRow[] = [
  {
    id: "ncqg",
    label: "NCQG (mitigation + adaptation, 2035)",
    shortLabel: "NCQG",
    bn: HEADLINE.ncqgBn,
    color: "#64748b",
    note: "Nominal 2035 dollars; dual purpose",
  },
  {
    id: "needs-2023",
    label: "Adaptation needs (2023 prices)",
    shortLabel: "Needs '23$",
    bn: HEADLINE.needsMidBn,
    color: "#0ea5e9",
    note: "Midpoint of $310–365B",
  },
  {
    id: "needs-inflated",
    label: "Needs if inflated to 2035 (~3%/yr)",
    shortLabel: "Needs '35$",
    bn: (HEADLINE.needsInflatedLowBn + HEADLINE.needsInflatedHighBn) / 2,
    color: "#f43f5e",
    note: "$440–520B band midpoint",
  },
];

/** Delta table rows for prose + viz footer */
export type DeltaTableRow = {
  metric: string;
  prior: string;
  newest: string;
  delta: string;
};

export const DELTA_TABLE: DeltaTableRow[] = [
  {
    metric: "Needs band",
    prior: "$215–387B / yr (decade)",
    newest: "$310–365B / yr (by 2035)",
    delta: "Horizon re-anchored; mid ↑",
  },
  {
    metric: "Intl public flows",
    prior: "$28B (2022)",
    newest: "$26B (2023)",
    delta: "−$2B (−7%)",
  },
  {
    metric: "Finance gap",
    prior: "$187–359B / yr",
    newest: "$284–339B / yr",
    delta: "12–14× flows",
  },
  {
    metric: "Glasgow 2× path",
    prior: "~5% of gap if hit",
    newest: "On-trend miss by 2025",
    delta: "Credibility floor fails",
  },
  {
    metric: "Private adaptation",
    prior: "Under-measured",
    newest: "~$5B now; ~$50B potential",
    delta: "10× upside if de-risked",
  },
  {
    metric: "Nat-cat protection gap",
    prior: "$424B (2025)",
    newest: "$424B (unchanged)",
    delta: "Secondary ledger flat",
  },
];

export function fmtBn(n: number, digits = 0): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtDeltaBn(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(0)}B`;
}

export function flowPathWithTarget() {
  return INTL_PUBLIC_ADAPT_FLOWS.map((r) => ({
    year: r.year,
    flows: r.intlPublicBn,
    glasgow: HEADLINE.glasgowTargetBn,
    note: r.note,
  }));
}

export function vintageDumbbell(scenario: NeedsScenario) {
  return [
    {
      metric: "Needs",
      prior: priorNeedsBn(scenario),
      newest: needsBn(scenario),
    },
    {
      metric: "Flows",
      prior: HEADLINE.flows2022Bn,
      newest: HEADLINE.flows2023Bn,
    },
    {
      metric: "Gap",
      prior: priorGapBn(scenario),
      newest: gapBn(scenario),
    },
  ];
}

export function leverBars(filter: "all" | "supply" | "demand") {
  if (filter === "supply") {
    return GAP_LEVERS.filter((l) => l.kind !== "need");
  }
  if (filter === "demand") {
    return GAP_LEVERS.filter((l) => l.kind === "need" || l.kind === "flow");
  }
  return GAP_LEVERS;
}
