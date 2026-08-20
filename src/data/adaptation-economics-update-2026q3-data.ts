/**
 * Adaptation economics — Q3 2026 vintage update.
 * Core question: What changed in the newest official vintage versus the last
 * post on this theme? (Who pays for climate damage and adaptation before
 * policy catches up?)
 *
 * Prior vintage (adaptation-economics-update-2026 / UNEP AGR 2025):
 *   needs $310–365B/yr by 2035; UNEP intl public flows $26B (2023);
 *   gap $284–339B; Glasgow on-trend miss; Swiss Re protection gap $424B.
 *
 * Newest vintage (OECD May 2026 + CPI GLCF 2025 + Swiss Re sigma 1/2026 + FRLD):
 *   OECD adaptation provided/mobilised $34.7B in 2024 (+$1.1B YoY from $33.6B);
 *   public adaptation $31.7B — still ~$5.8B short of Glasgow doubling in 2025;
 *   CPI tracked global adaptation $65B in 2023 (−16% YoY); FRLD ~$0.45B delivered.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Q3 vintage delta vs prior update (UNEP AGR 2025 / $26B intl public in 2023): OECD Climate Finance 2013–2024 (May 2026) prints adaptation provided/mobilised at $34.7B in 2024 (+$1.1B YoY). CPI GLCF 2025 tracks global adaptation at $65B (−16%). Swiss Re sigma 1/2026 keeps the $424B protection-gap ledger; FRLD capitalization remains sub-billion.";

export const SOURCES = [
  {
    label: "OECD — Climate Finance Provided and Mobilised 2013–2024 (May 2026)",
    url: "https://www.oecd.org/en/publications/climate-finance-provided-and-mobilised-by-developed-countries-in-2013-2024_ab5eb9ad-en.html",
  },
  {
    label: "OECD press — USD 100B goal exceeded third consecutive year (21 May 2026)",
    url: "https://www.oecd.org/en/about/news/press-releases/2026/05/developed-countries-exceed-usd-100-billion-climate-finance-goal-for-third-consecutive-year.html",
  },
  {
    label: "CPI — Global Landscape of Climate Finance 2025",
    url: "https://www.climatepolicyinitiative.org/publication/global-landscape-of-climate-finance-2025/",
  },
  {
    label: "Swiss Re sigma 1/2026 — Natural catastrophes in 2025",
    url: "https://www.swissre.com/institute/research/sigma-research/sigma-2026-01-natcat-2025-wildfire-storm-risk.html",
  },
  {
    label: "Prior theme update — Adaptation economics (AGR 2025)",
    url: "/blog/adaptation-economics-update-2026",
  },
];

/** Headline meters — newest OECD print and Δ vs prior AGR / UNEP vintage */
export const HEADLINE = {
  /** AGR 2025 needs band (unchanged stock — no new UNEP needs print) */
  needsLowBn: 310,
  needsHighBn: 365,
  needsMidBn: 337.5,
  /** OECD adaptation provided & mobilised */
  oecdAdapt2024Bn: 34.7,
  oecdAdapt2023Bn: 33.6,
  oecdAdapt2022Bn: 32.4,
  oecdAdaptYoYDeltaBn: 1.1,
  oecdAdaptYoYPct: 3.3,
  oecdPublicAdapt2024Bn: 31.7,
  oecdPublicAdapt2023Bn: 30.6,
  oecdPrivateAdapt2024Bn: 3.0,
  /** Prior-post UNEP intl public print (AGR 2025) */
  unepFlows2023Bn: 26,
  unepFlows2022Bn: 28,
  /** Gaps vs AGR needs mid */
  gapVsOecd2024LowBn: 310 - 34.7,
  gapVsOecd2024HighBn: 365 - 34.7,
  gapVsUnepLowBn: 284,
  gapVsUnepHighBn: 339,
  needsVsOecdMultipleLow: 8.9,
  needsVsOecdMultipleHigh: 10.5,
  /** Glasgow doubling (OECD public baseline) */
  glasgow2019PublicBn: 18.8,
  glasgowDoubleTargetBn: 37.6,
  glasgowShortfall2025Bn: 5.8,
  /** Total climate finance stack (OECD) */
  totalClimate2023Bn: 132.8,
  totalClimate2024Bn: 136.7,
  adaptSharePct2024: 25,
  /** CPI landscape */
  cpiAdapt2023Bn: 65,
  cpiAdaptYoYPct: -16,
  cpiDualBenefit2023Bn: 58,
  cpiGreenBondAdapt2023Bn: 18,
  cpiGlobalClimate2023Tn: 1.9,
  cpiEmdeNeeds2030Bn: 222,
  /** FRLD capitalization (Apr 2026 board cycle) */
  frldPledgedMn: 822,
  frldDeliveredMn: 449,
  frldDeliveredBn: 0.45,
  frldRequestsMn: 166,
  /** Swiss Re secondary ledger */
  protectionGap2025Bn: 424,
  resilienceIndex2025Pct: 27.3,
  insuredLosses2025Bn: 107,
  insuredTrend2025Bn: 140,
  insuredTrend2026Bn: 148,
  peakYear2026Bn: 320,
  emergingUninsuredPctLow: 80,
  emergingUninsuredPctHigh: 90,
  /** Instrument mix — OECD public climate finance 2024 */
  loanSharePublic2024Pct: 67,
  grantSharePublic2024Pct: 29,
  /** COP30 / NCQG framing carried from prior + OECD note */
  ncqgBn: 300,
  needsInflatedLowBn: 440,
  needsInflatedHighBn: 520,
  cop30TripleAdaptBy2035: true,
} as const;

export type NeedsScenario = "low" | "mid" | "high";

export function needsBn(scenario: NeedsScenario): number {
  if (scenario === "low") return HEADLINE.needsLowBn;
  if (scenario === "high") return HEADLINE.needsHighBn;
  return HEADLINE.needsMidBn;
}

export function gapVsOecdBn(scenario: NeedsScenario): number {
  return needsBn(scenario) - HEADLINE.oecdAdapt2024Bn;
}

export function gapVsUnepBn(scenario: NeedsScenario): number {
  return needsBn(scenario) - HEADLINE.unepFlows2023Bn;
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
    id: "oecd-adapt",
    label: "OECD adaptation provided/mobilised",
    shortLabel: "OECD adapt",
    priorBn: HEADLINE.oecdAdapt2023Bn,
    newestBn: HEADLINE.oecdAdapt2024Bn,
    unit: "bn",
    deltaBn: HEADLINE.oecdAdaptYoYDeltaBn,
    deltaDirection: "up",
    note: "2023 → 2024 OECD print (May 2026)",
    confidence: "disclosed",
  },
  {
    id: "unep-vs-oecd",
    label: "UNEP intl public (2023) vs OECD adapt (2024)",
    shortLabel: "UNEP→OECD",
    priorBn: HEADLINE.unepFlows2023Bn,
    newestBn: HEADLINE.oecdAdapt2024Bn,
    unit: "bn",
    deltaBn: HEADLINE.oecdAdapt2024Bn - HEADLINE.unepFlows2023Bn,
    deltaDirection: "up",
    note: "Different methodologies — OECD is broader (public + mobilised private)",
    confidence: "disclosed",
  },
  {
    id: "gap-mid",
    label: "Needs mid − OECD 2024 flows",
    shortLabel: "Gap mid",
    priorBn: (HEADLINE.gapVsUnepLowBn + HEADLINE.gapVsUnepHighBn) / 2,
    newestBn: gapVsOecdBn("mid"),
    unit: "bn",
    deltaBn:
      gapVsOecdBn("mid") -
      (HEADLINE.gapVsUnepLowBn + HEADLINE.gapVsUnepHighBn) / 2,
    deltaDirection: "down",
    note: "Broader OECD numerator shrinks residual vs UNEP-only gap",
    confidence: "disclosed",
  },
  {
    id: "glasgow-shortfall",
    label: "Glasgow doubling shortfall (public)",
    shortLabel: "Glasgow Δ",
    priorBn: HEADLINE.glasgowShortfall2025Bn + 2,
    newestBn: HEADLINE.glasgowShortfall2025Bn,
    unit: "bn",
    deltaBn: -2,
    deltaDirection: "down",
    note: "Still ~$5.8B public short of 2× 2019 OECD baseline in 2025",
    confidence: "disclosed",
  },
];

/** OECD adaptation flow path including newest 2024 print */
export type AdaptFlowYear = {
  year: number;
  oecdAdaptBn: number;
  vintage: "prior" | "new" | "shared";
  note?: string;
};

export const OECD_ADAPT_FLOWS: AdaptFlowYear[] = [
  { year: 2016, oecdAdaptBn: 10.1, vintage: "shared" },
  { year: 2019, oecdAdaptBn: 18.8, vintage: "shared", note: "Glasgow public baseline" },
  {
    year: 2022,
    oecdAdaptBn: HEADLINE.oecdAdapt2022Bn,
    vintage: "shared",
    note: "First $100B climate-finance goal year",
  },
  {
    year: 2023,
    oecdAdaptBn: HEADLINE.oecdAdapt2023Bn,
    vintage: "prior",
    note: "Prior-post year; UNEP intl public was $26B",
  },
  {
    year: 2024,
    oecdAdaptBn: HEADLINE.oecdAdapt2024Bn,
    vintage: "new",
    note: "OECD May 2026 — newest official print",
  },
];

/** Dual-ledger comparison: UNEP AGR vs OECD vs CPI */
export type LedgerRow = {
  id: string;
  label: string;
  shortLabel: string;
  bn: number;
  color: string;
  note: string;
  kind: "need" | "flow" | "gap" | "damage" | "fund";
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
    id: "oecd-2024",
    label: "OECD adaptation 2024 (provided/mobilised)",
    shortLabel: "OECD '24",
    bn: HEADLINE.oecdAdapt2024Bn,
    color: "#0ea5e9",
    note: "+$1.1B YoY",
    kind: "flow",
  },
  {
    id: "unep-2023",
    label: "UNEP intl public adaptation 2023",
    shortLabel: "UNEP '23",
    bn: HEADLINE.unepFlows2023Bn,
    color: "#64748b",
    note: "Prior-post headline numerator",
    kind: "flow",
  },
  {
    id: "cpi-2023",
    label: "CPI tracked global adaptation 2023",
    shortLabel: "CPI '23",
    bn: HEADLINE.cpiAdapt2023Bn,
    color: "#14b8a6",
    note: "−16% YoY; includes domestic/DFI",
    kind: "flow",
  },
  {
    id: "frld",
    label: "FRLD capital delivered (2026)",
    shortLabel: "FRLD",
    bn: HEADLINE.frldDeliveredBn,
    color: "#a78bfa",
    note: "~$449M paid-in vs $822M pledged",
    kind: "fund",
  },
  {
    id: "protection-gap",
    label: "Swiss Re nat-cat protection gap 2025",
    shortLabel: "Prot. gap",
    bn: HEADLINE.protectionGap2025Bn,
    color: "#f59e0b",
    note: "Resilience index still ~27%",
    kind: "damage",
  },
];

/** Closing-the-gap levers after OECD update */
export type GapLever = {
  id: string;
  label: string;
  shortLabel: string;
  bn: number;
  kind: "flow" | "target" | "potential" | "need" | "fund";
  color: string;
  note: string;
};

export const GAP_LEVERS: GapLever[] = [
  {
    id: "oecd-2024",
    label: "OECD adaptation 2024",
    shortLabel: "OECD '24",
    bn: HEADLINE.oecdAdapt2024Bn,
    kind: "flow",
    color: "#14b8a6",
    note: "+$1.1B YoY",
  },
  {
    id: "glasgow",
    label: "Glasgow 2× public target",
    shortLabel: "Glasgow",
    bn: HEADLINE.glasgowDoubleTargetBn,
    kind: "target",
    color: "#a78bfa",
    note: "Still ~$5.8B short in 2025",
  },
  {
    id: "cpi-tracked",
    label: "CPI tracked adaptation 2023",
    shortLabel: "CPI track",
    bn: HEADLINE.cpiAdapt2023Bn,
    kind: "flow",
    color: "#0ea5e9",
    note: "−16% YoY",
  },
  {
    id: "cpi-emde-needs",
    label: "CPI EMDE adaptation needs (by 2030)",
    shortLabel: "CPI needs",
    bn: HEADLINE.cpiEmdeNeeds2030Bn,
    kind: "need",
    color: "#f59e0b",
    note: "Lower bound; UNEP 2035 band higher",
  },
  {
    id: "frld",
    label: "FRLD delivered capital",
    shortLabel: "FRLD",
    bn: HEADLINE.frldDeliveredBn,
    kind: "fund",
    color: "#64748b",
    note: "Risk of dry-up by 2027",
  },
  {
    id: "needs-low",
    label: "AGR needs low (2035)",
    shortLabel: "Needs low",
    bn: HEADLINE.needsLowBn,
    kind: "need",
    color: "#f43f5e",
    note: "~9× OECD 2024",
  },
  {
    id: "needs-high",
    label: "AGR needs high (2035)",
    shortLabel: "Needs high",
    bn: HEADLINE.needsHighBn,
    kind: "need",
    color: "#e11d48",
    note: "~10.5× OECD 2024",
  },
];

/** Who still pays — residual incidence after modest OECD bounce */
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
    sharePct: 42,
    deltaNote: "Emerging markets still 80–90% uninsured (Swiss Re)",
    color: "#f43f5e",
  },
  {
    id: "sovereigns",
    label: "National & local budgets",
    shortLabel: "Sovereigns",
    sharePct: 28,
    deltaNote: "OECD public climate finance still ~67% loans in 2024",
    color: "#0ea5e9",
  },
  {
    id: "insurers",
    label: "Insurers (covered slice)",
    shortLabel: "Insurance",
    sharePct: 18,
    deltaNote: "2025 insured losses $107B — below $140B trend, gap intact",
    color: "#14b8a6",
  },
  {
    id: "oecd-public",
    label: "OECD-tracked adaptation finance",
    shortLabel: "OECD adapt",
    sharePct: 8,
    deltaNote: "$34.7B is still <10% of mid-band needs",
    color: "#a78bfa",
  },
  {
    id: "frld-private",
    label: "FRLD + tracked private adaptation",
    shortLabel: "FRLD/priv",
    sharePct: 4,
    deltaNote: "FRLD ~$0.45B delivered; OECD private adapt ~$3B",
    color: "#f59e0b",
  },
];

/** Instrument mix — OECD public climate finance 2024 */
export type InstrumentSlice = {
  id: string;
  label: string;
  sharePct: number;
  color: string;
};

export const INSTRUMENT_MIX: InstrumentSlice[] = [
  {
    id: "loans",
    label: "Loans",
    sharePct: HEADLINE.loanSharePublic2024Pct,
    color: "#f43f5e",
  },
  {
    id: "grants",
    label: "Grants",
    sharePct: HEADLINE.grantSharePublic2024Pct,
    color: "#14b8a6",
  },
  {
    id: "equity-other",
    label: "Equity & other",
    sharePct: 100 - HEADLINE.loanSharePublic2024Pct - HEADLINE.grantSharePublic2024Pct,
    color: "#64748b",
  },
];

/** NCQG / stack arithmetic after OECD bounce */
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
    id: "oecd-total-2024",
    label: "OECD total climate finance 2024",
    shortLabel: "Total CF",
    bn: HEADLINE.totalClimate2024Bn,
    color: "#64748b",
    note: "Mitigation + adaptation + cross-cutting",
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
    id: "oecd-adapt-2024",
    label: "OECD adaptation 2024",
    shortLabel: "Adapt '24",
    bn: HEADLINE.oecdAdapt2024Bn,
    color: "#0ea5e9",
    note: "~25% of OECD total climate finance",
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
    prior: "UNEP intl public $26B (2023)",
    newest: "OECD provided/mobilised $34.7B (2024)",
    delta: "+$8.7B ledger / +$1.1B OECD YoY",
  },
  {
    metric: "OECD adaptation path",
    prior: "$33.6B (2023)",
    newest: "$34.7B (2024)",
    delta: "+$1.1B (+3.3%)",
  },
  {
    metric: "Needs band (AGR 2025)",
    prior: "$310–365B / yr by 2035",
    newest: "$310–365B (unchanged)",
    delta: "No new UNEP needs print",
  },
  {
    metric: "Finance gap vs flows",
    prior: "$284–339B (vs UNEP $26B)",
    newest: "~$275–330B (vs OECD $34.7B)",
    delta: "Still ~9–10.5× flows",
  },
  {
    metric: "Glasgow 2× (OECD public)",
    prior: "On-trend miss (AGR)",
    newest: "Need +$5.8B public in 2025",
    delta: "Credibility floor still fails",
  },
  {
    metric: "CPI tracked adaptation",
    prior: "~$64–77B research-era range",
    newest: "$65B in 2023 (−16% YoY)",
    delta: "CDB/DFI drop; green bonds +$7.9B",
  },
  {
    metric: "FRLD capitalization",
    prior: "Not in prior ledger",
    newest: "~$449M delivered / $822M pledged",
    delta: "Dry-up risk by 2027",
  },
  {
    metric: "Nat-cat protection gap",
    prior: "$424B / resilience ~27%",
    newest: "$424B; insured 2025 = $107B",
    delta: "Below-trend year ≠ closed gap",
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
  if (n > 0) return `+${body}B`;
  if (n < 0) return `−${body}B`;
  return `${body}B`;
}

export function flowPathWithTarget() {
  return OECD_ADAPT_FLOWS.map((r) => ({
    year: r.year,
    flows: r.oecdAdaptBn,
    glasgow: HEADLINE.glasgowDoubleTargetBn,
    note: r.note,
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
      prior: HEADLINE.unepFlows2023Bn,
      newest: HEADLINE.oecdAdapt2024Bn,
    },
    {
      metric: "Gap",
      prior: gapVsUnepBn(scenario),
      newest: gapVsOecdBn(scenario),
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

export function ledgerBars(filter: "all" | "flows" | "damage") {
  if (filter === "flows") {
    return LEDGER_COMPARE.filter((l) => l.kind === "flow" || l.kind === "fund");
  }
  if (filter === "damage") {
    return LEDGER_COMPARE.filter((l) => l.kind === "need" || l.kind === "damage");
  }
  return LEDGER_COMPARE;
}
