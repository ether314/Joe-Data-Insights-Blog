/**
 * Adaptation economics — August 2026 vintage update.
 * Core question: What changed in the newest official vintage versus the last
 * post on this theme? (Who pays for climate damage and adaptation before
 * policy catches up?)
 *
 * Prior vintage (adaptation-economics-update-2026q3 / OECD May 2026):
 *   OECD adaptation provided/mobilised $34.7B in 2024 (+$1.1B YoY);
 *   AGR 2025 needs $310–365B/yr by 2035; UNEP intl public $26B (2023);
 *   Swiss Re protection gap $424B / resilience ~27%.
 *
 * Newest vintage (MDB Joint Summary Jul 2026 + Swiss Re H1 2026 Aug 11):
 *   MDB adaptation finance in LMICs $35B in 2025 (+31% YoY from ~$26.7B);
 *   LMIC MDB climate finance $103B (+21%); total MDB climate $163B (+19%);
 *   HIC MDB adaptation $7B (already at 2030 projection); 2030 LMIC adapt goal $42B;
 *   Swiss Re H1 insured nat-cat $42B (−54% vs H1 2025 $91B) — benign half ≠ closed gap.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Aug 2026 vintage delta vs Q3 update (OECD May 2026 / $34.7B adaptation 2024): MDB Joint Summary Report (13 Jul 2026) prints LMIC adaptation finance at $35B in 2025 (+31% YoY). Swiss Re Institute H1 2026 (11 Aug) prints insured nat-cat losses at $42B — lowest first half since 2020 — while the $424B protection-gap ledger and AGR needs band remain unchanged.";

export const SOURCES = [
  {
    label: "MDB — 2025 Joint Summary Report on Climate Finance (13 Jul 2026)",
    url: "https://www.eib.org/en/publications/20260117-2025-joint-summary-report-on-mdbs-climate-finance",
  },
  {
    label: "EIB press — MDBs record $163B climate finance in 2025",
    url: "https://www.eib.org/en/press/all/2026-249-multilateral-development-banks-increase-climate-finance-to-record-usd163-billion-in-2025-supporting-climate-resilient-and-sustainable-growth",
  },
  {
    label: "Swiss Re Institute — First-half 2026 insured catastrophe losses (11 Aug 2026)",
    url: "https://www.swissre.com/institute/research/topics-and-risk-dialogues/climate-and-natural-catastrophe-risk/first-half-2026-insured-catastrophe-losses.html",
  },
  {
    label: "Prior theme update — Q3 OECD vintage",
    url: "/blog/adaptation-economics-update-2026q3",
  },
];

/** Headline meters — newest MDB print and Δ vs prior OECD / AGR vintage */
export const HEADLINE = {
  /** AGR 2025 needs band (unchanged stock — no new UNEP needs print) */
  needsLowBn: 310,
  needsHighBn: 365,
  needsMidBn: 337.5,
  /** MDB LMIC adaptation — newest official print (2025 reporting year) */
  mdbLmicAdapt2025Bn: 35,
  /** Implied 2024 from disclosed +31% YoY */
  mdbLmicAdapt2024Bn: 26.7,
  mdbAdaptYoYDeltaBn: 8.3,
  mdbAdaptYoYPct: 31,
  mdbLmicMitig2025Bn: 68,
  mdbLmicMitigYoYPct: 16,
  mdbLmicClimate2025Bn: 103,
  mdbLmicClimateYoYPct: 21,
  mdbLmicPrivateMob2025Bn: 35,
  mdbTotalClimate2025Bn: 163,
  mdbTotalClimateYoYPct: 19,
  mdbHicAdapt2025Bn: 7,
  mdbHicMitig2025Bn: 53,
  mdbHicClimate2025Bn: 60,
  mdbHicPrivateMob2025Bn: 80,
  /** All-economy MDB adaptation (LMIC + HIC) */
  mdbAllAdapt2025Bn: 42,
  /** COP29 2030 projections */
  mdb2030LmicAdaptBn: 42,
  mdb2030LmicClimateBn: 120,
  mdb2030LmicPrivateBn: 65,
  mdb2030HicAdaptBn: 7,
  mdb2030ShortfallLmicAdaptBn: 7,
  /** Prior-post OECD / UNEP anchors */
  oecdAdapt2024Bn: 34.7,
  oecdAdapt2023Bn: 33.6,
  oecdAdaptYoYDeltaBn: 1.1,
  unepFlows2023Bn: 26,
  unepFlows2022Bn: 28,
  /** Gaps vs AGR needs */
  gapVsMdb2025LowBn: 310 - 35,
  gapVsMdb2025HighBn: 365 - 35,
  gapVsOecdLowBn: 310 - 34.7,
  gapVsOecdHighBn: 365 - 34.7,
  gapVsUnepLowBn: 284,
  gapVsUnepHighBn: 339,
  needsVsMdbMultipleLow: 8.9,
  needsVsMdbMultipleHigh: 10.4,
  /** Swiss Re H1 2026 (newest damage print) */
  h1InsuredNatCat2026Bn: 42,
  h1InsuredNatCat2025Bn: 91,
  h1InsuredNatCat10yAvgBn: 50,
  h1InsuredNatCatTrendBn: 66,
  h1InsuredDeltaVsPriorBn: -49,
  h1InsuredPctVsPrior: -54,
  h1InsuredPctVs10y: -16,
  h1EconomicNatCat2026Bn: 100,
  h1EconomicNatCat2025Bn: 152,
  h1EconomicNatCat10yAvgBn: 111,
  h1InsuranceRatio2026Pct: 42,
  h1InsuranceRatio30yAvgPct: 33,
  h1ScsInsured2026Bn: 28,
  h1ScsTrendBn: 36,
  /** Unchanged secondary ledgers */
  protectionGap2025Bn: 424,
  resilienceIndex2025Pct: 27.3,
  insuredFullYear2025Bn: 107,
  cpiAdapt2023Bn: 65,
  cpiAdaptYoYPct: -16,
  frldDeliveredBn: 0.45,
  ncqgBn: 300,
  needsInflatedLowBn: 440,
  needsInflatedHighBn: 520,
  structuralLossGrowthLowPct: 5,
  structuralLossGrowthHighPct: 7,
} as const;

export type NeedsScenario = "low" | "mid" | "high";

export function needsBn(scenario: NeedsScenario): number {
  if (scenario === "low") return HEADLINE.needsLowBn;
  if (scenario === "high") return HEADLINE.needsHighBn;
  return HEADLINE.needsMidBn;
}

export function gapVsMdbBn(scenario: NeedsScenario): number {
  return needsBn(scenario) - HEADLINE.mdbLmicAdapt2025Bn;
}

export function gapVsOecdBn(scenario: NeedsScenario): number {
  return needsBn(scenario) - HEADLINE.oecdAdapt2024Bn;
}

/** Side-by-side vintage meters */
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
    id: "mdb-adapt",
    label: "MDB LMIC adaptation finance",
    shortLabel: "MDB adapt",
    priorBn: HEADLINE.mdbLmicAdapt2024Bn,
    newestBn: HEADLINE.mdbLmicAdapt2025Bn,
    unit: "bn",
    deltaBn: HEADLINE.mdbAdaptYoYDeltaBn,
    deltaDirection: "up",
    note: "2024 → 2025 MDB print (Jul 2026 report)",
    confidence: "disclosed",
  },
  {
    id: "oecd-vs-mdb",
    label: "OECD adapt 2024 vs MDB LMIC adapt 2025",
    shortLabel: "OECD→MDB",
    priorBn: HEADLINE.oecdAdapt2024Bn,
    newestBn: HEADLINE.mdbLmicAdapt2025Bn,
    unit: "bn",
    deltaBn: HEADLINE.mdbLmicAdapt2025Bn - HEADLINE.oecdAdapt2024Bn,
    deltaDirection: "up",
    note: "Different ledgers — OECD developed-country provided/mobilised vs MDB own-account",
    confidence: "disclosed",
  },
  {
    id: "gap-mid",
    label: "Needs mid − MDB LMIC 2025",
    shortLabel: "Gap mid",
    priorBn: gapVsOecdBn("mid"),
    newestBn: gapVsMdbBn("mid"),
    unit: "bn",
    deltaBn: gapVsMdbBn("mid") - gapVsOecdBn("mid"),
    deltaDirection: "down",
    note: "MDB bounce narrows residual vs OECD 2024 numerator",
    confidence: "disclosed",
  },
  {
    id: "h1-insured",
    label: "Swiss Re H1 insured nat-cat",
    shortLabel: "H1 insured",
    priorBn: HEADLINE.h1InsuredNatCat2025Bn,
    newestBn: HEADLINE.h1InsuredNatCat2026Bn,
    unit: "bn",
    deltaBn: HEADLINE.h1InsuredDeltaVsPriorBn,
    deltaDirection: "down",
    note: "Benign H1 2026 vs catastrophic H1 2025 — not a closed protection gap",
    confidence: "disclosed",
  },
];

/** MDB LMIC adaptation path toward 2030 goal */
export type MdbAdaptYear = {
  year: number;
  adaptBn: number;
  vintage: "prior" | "new" | "shared" | "target";
  note?: string;
};

export const MDB_ADAPT_PATH: MdbAdaptYear[] = [
  {
    year: 2024,
    adaptBn: HEADLINE.mdbLmicAdapt2024Bn,
    vintage: "prior",
    note: "Implied from +31% YoY disclosure",
  },
  {
    year: 2025,
    adaptBn: HEADLINE.mdbLmicAdapt2025Bn,
    vintage: "new",
    note: "MDB Joint Summary Jul 2026 — newest official print",
  },
  {
    year: 2030,
    adaptBn: HEADLINE.mdb2030LmicAdaptBn,
    vintage: "target",
    note: "COP29 collective projection for LMIC adaptation",
  },
];

/** Dual-ledger comparison across vintages */
export type LedgerRow = {
  id: string;
  label: string;
  shortLabel: string;
  bn: number;
  color: string;
  note: string;
  kind: "need" | "flow" | "gap" | "damage" | "target";
};

export const LEDGER_COMPARE: LedgerRow[] = [
  {
    id: "needs-mid",
    label: "AGR 2025 needs midpoint (by 2035)",
    shortLabel: "Needs mid",
    bn: HEADLINE.needsMidBn,
    color: "#f43f5e",
    note: "Unchanged stock — no new UNEP needs vintage",
    kind: "need",
  },
  {
    id: "mdb-2025",
    label: "MDB LMIC adaptation 2025",
    shortLabel: "MDB '25",
    bn: HEADLINE.mdbLmicAdapt2025Bn,
    color: "#0ea5e9",
    note: "+$8.3B / +31% YoY",
    kind: "flow",
  },
  {
    id: "oecd-2024",
    label: "OECD adaptation 2024 (prior post)",
    shortLabel: "OECD '24",
    bn: HEADLINE.oecdAdapt2024Bn,
    color: "#14b8a6",
    note: "Q3 headline numerator",
    kind: "flow",
  },
  {
    id: "mdb-2030",
    label: "MDB 2030 LMIC adaptation goal",
    shortLabel: "MDB '30",
    bn: HEADLINE.mdb2030LmicAdaptBn,
    color: "#a78bfa",
    note: "Still $7B short of goal",
    kind: "target",
  },
  {
    id: "h1-econ",
    label: "Swiss Re H1 2026 economic nat-cat",
    shortLabel: "H1 econ",
    bn: HEADLINE.h1EconomicNatCat2026Bn,
    color: "#f59e0b",
    note: "−34% vs H1 2025; insurance ratio 42%",
    kind: "damage",
  },
  {
    id: "protection-gap",
    label: "Swiss Re nat-cat protection gap 2025",
    shortLabel: "Prot. gap",
    bn: HEADLINE.protectionGap2025Bn,
    color: "#64748b",
    note: "Resilience index still ~27%",
    kind: "damage",
  },
];

/** Closing-the-gap levers after MDB update */
export type GapLever = {
  id: string;
  label: string;
  shortLabel: string;
  bn: number;
  kind: "flow" | "target" | "potential" | "need" | "damage";
  color: string;
  note: string;
};

export const GAP_LEVERS: GapLever[] = [
  {
    id: "mdb-2025",
    label: "MDB LMIC adaptation 2025",
    shortLabel: "MDB '25",
    bn: HEADLINE.mdbLmicAdapt2025Bn,
    kind: "flow",
    color: "#14b8a6",
    note: "+31% YoY",
  },
  {
    id: "oecd-2024",
    label: "OECD adaptation 2024",
    shortLabel: "OECD '24",
    bn: HEADLINE.oecdAdapt2024Bn,
    kind: "flow",
    color: "#0ea5e9",
    note: "Prior-post official print",
  },
  {
    id: "mdb-2030",
    label: "MDB 2030 LMIC adapt goal",
    shortLabel: "MDB '30",
    bn: HEADLINE.mdb2030LmicAdaptBn,
    kind: "target",
    color: "#a78bfa",
    note: "$7B remaining climb",
  },
  {
    id: "mdb-private",
    label: "MDB LMIC private mobilisation 2025",
    shortLabel: "Priv mob",
    bn: HEADLINE.mdbLmicPrivateMob2025Bn,
    kind: "potential",
    color: "#f59e0b",
    note: "Equals adaptation print; 2030 goal $65B",
  },
  {
    id: "needs-low",
    label: "AGR needs low (2035)",
    shortLabel: "Needs low",
    bn: HEADLINE.needsLowBn,
    kind: "need",
    color: "#f43f5e",
    note: "~8.9× MDB 2025",
  },
  {
    id: "needs-high",
    label: "AGR needs high (2035)",
    shortLabel: "Needs high",
    bn: HEADLINE.needsHighBn,
    kind: "need",
    color: "#e11d48",
    note: "~10.4× MDB 2025",
  },
  {
    id: "h1-econ",
    label: "H1 2026 economic nat-cat",
    shortLabel: "H1 econ",
    bn: HEADLINE.h1EconomicNatCat2026Bn,
    kind: "damage",
    color: "#64748b",
    note: "One half-year of damage ≈ 3× MDB adapt",
  },
];

/** LMIC MDB climate mix 2025 */
export type MixSlice = {
  id: string;
  label: string;
  bn: number;
  sharePct: number;
  color: string;
};

export const LMIC_CLIMATE_MIX: MixSlice[] = [
  {
    id: "mitigation",
    label: "Mitigation",
    bn: HEADLINE.mdbLmicMitig2025Bn,
    sharePct: Math.round(
      (HEADLINE.mdbLmicMitig2025Bn / HEADLINE.mdbLmicClimate2025Bn) * 100,
    ),
    color: "#0ea5e9",
  },
  {
    id: "adaptation",
    label: "Adaptation",
    bn: HEADLINE.mdbLmicAdapt2025Bn,
    sharePct: Math.round(
      (HEADLINE.mdbLmicAdapt2025Bn / HEADLINE.mdbLmicClimate2025Bn) * 100,
    ),
    color: "#14b8a6",
  },
];

/** Who still pays — residual incidence after MDB bounce + benign H1 */
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
    sharePct: 40,
    deltaNote: "H1 ratio 42% reflects US/EU loss location — not EM coverage",
    color: "#f43f5e",
  },
  {
    id: "sovereigns",
    label: "National & local budgets",
    shortLabel: "Sovereigns",
    sharePct: 27,
    deltaNote: "MDB loans still dominate LMIC adaptation books",
    color: "#0ea5e9",
  },
  {
    id: "insurers",
    label: "Insurers (covered slice)",
    shortLabel: "Insurance",
    sharePct: 20,
    deltaNote: "H1 insured $42B — below $66B trend; structural +5–7%/yr",
    color: "#14b8a6",
  },
  {
    id: "mdb-flows",
    label: "MDB adaptation finance",
    shortLabel: "MDB adapt",
    sharePct: 9,
    deltaNote: "$35B is still <11% of mid-band needs",
    color: "#a78bfa",
  },
  {
    id: "oecd-private",
    label: "OECD-tracked + private residual",
    shortLabel: "OECD/priv",
    sharePct: 4,
    deltaNote: "Prior OECD private adapt ~$3B; FRLD still sub-billion",
    color: "#f59e0b",
  },
];

/** Swiss Re H1 compare rows */
export type H1CompareRow = {
  id: string;
  label: string;
  shortLabel: string;
  h12026Bn: number;
  h12025Bn: number;
  avg10yBn: number;
  color: string;
};

export const H1_COMPARE: H1CompareRow[] = [
  {
    id: "insured-natcat",
    label: "Insured nat-cat losses",
    shortLabel: "Insured",
    h12026Bn: HEADLINE.h1InsuredNatCat2026Bn,
    h12025Bn: HEADLINE.h1InsuredNatCat2025Bn,
    avg10yBn: HEADLINE.h1InsuredNatCat10yAvgBn,
    color: "#0ea5e9",
  },
  {
    id: "economic-natcat",
    label: "Economic nat-cat losses",
    shortLabel: "Economic",
    h12026Bn: HEADLINE.h1EconomicNatCat2026Bn,
    h12025Bn: HEADLINE.h1EconomicNatCat2025Bn,
    avg10yBn: HEADLINE.h1EconomicNatCat10yAvgBn,
    color: "#f43f5e",
  },
  {
    id: "scs",
    label: "Severe convective storms (insured)",
    shortLabel: "SCS",
    h12026Bn: HEADLINE.h1ScsInsured2026Bn,
    h12025Bn: 40,
    avg10yBn: HEADLINE.h1ScsTrendBn,
    color: "#f59e0b",
  },
];

/** Stack arithmetic: MDB vs needs vs NCQG */
export type StackCompareRow = {
  id: string;
  label: string;
  shortLabel: string;
  bn: number;
  color: string;
  note: string;
};

export const STACK_COMPARE: StackCompareRow[] = [
  {
    id: "mdb-total",
    label: "MDB total climate finance 2025",
    shortLabel: "MDB total",
    bn: HEADLINE.mdbTotalClimate2025Bn,
    color: "#64748b",
    note: "+19% YoY across all operations",
  },
  {
    id: "mdb-lmic",
    label: "MDB LMIC climate finance 2025",
    shortLabel: "LMIC CF",
    bn: HEADLINE.mdbLmicClimate2025Bn,
    color: "#0ea5e9",
    note: "+21% YoY; mitigation $68B + adaptation $35B",
  },
  {
    id: "mdb-adapt",
    label: "MDB LMIC adaptation 2025",
    shortLabel: "Adapt",
    bn: HEADLINE.mdbLmicAdapt2025Bn,
    color: "#14b8a6",
    note: "~34% of LMIC climate book",
  },
  {
    id: "ncqg",
    label: "NCQG (mitigation + adaptation, 2035)",
    shortLabel: "NCQG",
    bn: HEADLINE.ncqgBn,
    color: "#a78bfa",
    note: "Dual purpose; no adaptation sub-goal",
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
    metric: "Adaptation flows (official)",
    prior: "OECD provided/mobilised $34.7B (2024)",
    newest: "MDB LMIC adaptation $35B (2025)",
    delta: "+$0.3B ledger / +$8.3B MDB YoY (+31%)",
  },
  {
    metric: "MDB LMIC adaptation path",
    prior: "~$26.7B (2024, implied)",
    newest: "$35B (2025)",
    delta: "+$8.3B (+31%)",
  },
  {
    metric: "MDB LMIC total climate",
    prior: "~$85B (2024, implied from +21%)",
    newest: "$103B (2025)",
    delta: "+$18B (+21%)",
  },
  {
    metric: "Needs band (AGR 2025)",
    prior: "$310–365B / yr by 2035",
    newest: "$310–365B (unchanged)",
    delta: "No new UNEP needs print",
  },
  {
    metric: "Finance gap vs MDB flows",
    prior: "~$275–330B (vs OECD $34.7B)",
    newest: "~$275–330B (vs MDB $35B)",
    delta: "Still ~8.9–10.4× flows",
  },
  {
    metric: "MDB 2030 LMIC adapt goal",
    prior: "$42B target (COP29)",
    newest: "$35B delivered in 2025",
    delta: "$7B remaining climb",
  },
  {
    metric: "H1 insured nat-cat",
    prior: "$91B (H1 2025)",
    newest: "$42B (H1 2026)",
    delta: "−$49B (−54%); −16% vs 10-y avg",
  },
  {
    metric: "Nat-cat protection gap",
    prior: "$424B / resilience ~27%",
    newest: "$424B; H1 ratio 42% (location effect)",
    delta: "Benign half-year ≠ closed gap",
  },
];

export function fmtBn(n: number, digits = 1): string {
  if (Number.isInteger(n) || Math.abs(n - Math.round(n)) < 0.05) {
    return `$${Math.round(n)}B`;
  }
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtDeltaBn(n: number, digits = 1): string {
  const abs = Math.abs(n);
  const body =
    Number.isInteger(abs) || Math.abs(abs - Math.round(abs)) < 0.05
      ? `${Math.round(abs)}`
      : abs.toFixed(digits);
  if (n > 0) return `+$${body}B`;
  if (n < 0) return `−$${body}B`;
  return `$${body}B`;
}

export function mdbPathWithTarget() {
  return MDB_ADAPT_PATH.map((r) => ({
    year: r.year,
    flows: r.adaptBn,
    target: HEADLINE.mdb2030LmicAdaptBn,
    note: r.note,
    vintage: r.vintage,
  }));
}

export function vintageDumbbell(scenario: NeedsScenario) {
  return [
    {
      metric: "Needs",
      prior: needsBn(scenario),
      newest: needsBn(scenario),
    },
    {
      metric: "Flows",
      prior: HEADLINE.oecdAdapt2024Bn,
      newest: HEADLINE.mdbLmicAdapt2025Bn,
    },
    {
      metric: "Gap",
      prior: gapVsOecdBn(scenario),
      newest: gapVsMdbBn(scenario),
    },
  ];
}

export function leverBars(filter: "all" | "supply" | "demand") {
  if (filter === "supply") {
    return GAP_LEVERS.filter((l) => l.kind !== "need" && l.kind !== "damage");
  }
  if (filter === "demand") {
    return GAP_LEVERS.filter(
      (l) => l.kind === "need" || l.kind === "damage" || l.kind === "flow",
    );
  }
  return GAP_LEVERS;
}

export function ledgerBars(filter: "all" | "flows" | "damage") {
  if (filter === "flows") {
    return LEDGER_COMPARE.filter(
      (l) => l.kind === "flow" || l.kind === "target",
    );
  }
  if (filter === "damage") {
    return LEDGER_COMPARE.filter(
      (l) => l.kind === "need" || l.kind === "damage",
    );
  }
  return LEDGER_COMPARE;
}

export function h1GroupedBars() {
  return H1_COMPARE.map((r) => ({
    name: r.shortLabel,
    full: r.label,
    h12026: r.h12026Bn,
    h12025: r.h12025Bn,
    avg10y: r.avg10yBn,
    fill: r.color,
  }));
}
