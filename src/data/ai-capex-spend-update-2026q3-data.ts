/**
 * AI capex & spend totals — Q3 2026 vintage update (late Aug 2026).
 * Compares the Aug 2026 post-Q2 print (Big-5 midpoints ~$802.5B) against the
 * newest mid-Q3 desk vintage after Street catch-up and early-Q3 infra commentary.
 * Figures USD billions; scopes intentionally labeled.
 */

export const SOURCE_NOTE =
  "Q3 vintage delta: Aug 2026 post-Q2 print (Big-5 midpoints ~$802.5B) vs late-Aug / mid-Q3 desk synthesis. Amazon ~$230B, Alphabet $205–215 mid $210B, Meta $140–150 mid $145B, Microsoft ~$175B CY (lease reclass still in force), Oracle ~$75B net of prepayments. Big-5 midpoints sum ~$835B (+$32.5B / +4.0% vs Aug). Street ~$820B; CreditSights ~$830B. AI-attributed factor ≈75% of gross (CreditSights convention).";

export const SOURCES = [
  {
    label: "Axis Intelligence Research AI Capex Tracker (Aug 2026 mid-Q3 refresh)",
    url: "https://axis-intelligence.com/ai-capex-tracker/",
  },
  {
    label: "Prior vintage — AI capex spend update (Aug post-Q2)",
    url: "/blog/ai-capex-spend-update-2026",
  },
  {
    label: "Theme baseline — AI capex spend research",
    url: "/blog/ai-capex-spend-research-2026",
  },
  {
    label: "Goldman Sachs Global Institute — Tracking Trillions",
    url: "https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out",
  },
] as const;

export const HEADLINE = {
  /** Aug post-Q2 Big-5 midpoints */
  priorBig5: 802.5,
  /** Mid-Q3 desk Big-5 midpoints */
  newBig5: 835,
  deltaBn: 32.5,
  deltaPct: 4.0,
  /** Like-for-like if MSFT CY stay ~$190B (lease reclass only) */
  economicNewBig5: 850,
  economicDeltaBn: 47.5,
  priorBig4: 732.5,
  newBig4: 760,
  big4DeltaBn: 27.5,
  aiShareOfGross: 0.75,
  priorAiSlice: 602,
  newAiSlice: 626,
  streetPrior2026: 790,
  streetNew2026: 820,
  creditPrior2026: 800,
  creditNew2026: 830,
  gsGi2026: 765,
  gsIr2026Prior: 780,
  gsIr2026New: 800,
  gsIr2027Base: 1140,
  gsIr2027Bull: 1400,
  yoy2025: 344,
  yoyGrowthPct: 143,
  /** Jul research → Aug → Q3 cumulative path */
  julBig5: 760,
  augBig5: 802.5,
  q3Big5: 835,
  julToQ3DeltaBn: 75,
  julToQ3DeltaPct: 9.9,
} as const;

export const HYPERSCALERS = [
  "Amazon",
  "Microsoft",
  "Alphabet",
  "Meta",
  "Oracle",
] as const;

export type Hyperscaler = (typeof HYPERSCALERS)[number];

export const COMPANY_COLORS: Record<Hyperscaler, string> = {
  Amazon: "#ff9900",
  Microsoft: "#00a4ef",
  Alphabet: "#34a853",
  Meta: "#0668e1",
  Oracle: "#f80000",
};

export type Confidence = "guidance" | "midpoint" | "call" | "net-of-prepay" | "desk";

export type VintageCompany = {
  company: Hyperscaler;
  priorBn: number;
  newBn: number;
  priorLabel: string;
  newLabel: string;
  confidence: Confidence;
  note: string;
  fill: string;
};

/** Company midpoints — prior = Aug post-Q2; new = mid-Q3 desk vintage */
export const COMPANY_VINTAGE: VintageCompany[] = [
  {
    company: "Amazon",
    priorBn: 220,
    newBn: 230,
    priorLabel: "Aug post-Q2 ~$220B",
    newLabel: "Mid-Q3 desk ~$230B",
    confidence: "desk",
    note: "Largest absolute raise again (+$10B); AWS infra commentary",
    fill: COMPANY_COLORS.Amazon,
  },
  {
    company: "Microsoft",
    priorBn: 175,
    newBn: 175,
    priorLabel: "Aug ~$175B CY",
    newLabel: "Mid-Q3 ~$175B CY",
    confidence: "call",
    note: "Accounting print flat; lease reclass still the economic story",
    fill: COMPANY_COLORS.Microsoft,
  },
  {
    company: "Alphabet",
    priorBn: 200,
    newBn: 210,
    priorLabel: "Aug $195–205 mid",
    newLabel: "Mid-Q3 $205–215 mid",
    confidence: "midpoint",
    note: "Third raise of the year; street midpoints climb with range",
    fill: COMPANY_COLORS.Alphabet,
  },
  {
    company: "Meta",
    priorBn: 137.5,
    newBn: 145,
    priorLabel: "Aug $130–145 mid",
    newLabel: "Mid-Q3 $140–150 mid",
    confidence: "midpoint",
    note: "Floor and ceiling both stepped; finance-lease principal included",
    fill: COMPANY_COLORS.Meta,
  },
  {
    company: "Oracle",
    priorBn: 70,
    newBn: 75,
    priorLabel: "Aug ~$70B net",
    newLabel: "Mid-Q3 ~$75B net",
    confidence: "net-of-prepay",
    note: "Net of customer prepayments; gross still ~$95–100B neighborhood",
    fill: COMPANY_COLORS.Oracle,
  },
];

export function companyDeltas(active: Hyperscaler[] = [...HYPERSCALERS]) {
  return COMPANY_VINTAGE.filter((r) => active.includes(r.company)).map((r) => ({
    ...r,
    deltaBn: Math.round((r.newBn - r.priorBn) * 10) / 10,
    deltaPct:
      r.priorBn === 0
        ? 0
        : Math.round(((r.newBn - r.priorBn) / r.priorBn) * 1000) / 10,
  }));
}

/** Waterfall steps for Big-5 vintage revision (Aug → Q3) */
export function waterfallSteps(active: Hyperscaler[] = [...HYPERSCALERS]) {
  const deltas = companyDeltas(active);
  const priorSum = Math.round(
    deltas.reduce((s, d) => s + d.priorBn, 0) * 10,
  ) / 10;
  const steps: {
    name: string;
    start: number;
    end: number;
    delta: number;
    fill: string;
    kind: "base" | "delta" | "total";
  }[] = [
    {
      name: "Aug Big-5",
      start: 0,
      end: priorSum,
      delta: priorSum,
      fill: "#64748b",
      kind: "base",
    },
  ];
  let running = priorSum;
  for (const d of deltas) {
    const next = Math.round((running + d.deltaBn) * 10) / 10;
    steps.push({
      name: d.company,
      start: Math.min(running, next),
      end: Math.max(running, next),
      delta: d.deltaBn,
      fill: d.fill,
      kind: "delta",
    });
    running = next;
  }
  steps.push({
    name: "Q3 Big-5",
    start: 0,
    end: running,
    delta: running,
    fill: "#10b981",
    kind: "total",
  });
  return { steps, priorSum, newSum: running };
}

export type ScenarioVintage = {
  id: string;
  house: string;
  scope: string;
  prior2026: number | null;
  new2026: number | null;
  y2027: number | null;
  color: string;
  note: string;
};

/** Research-house annual scenarios — Aug vs mid-Q3 where available */
export const SCENARIO_VINTAGE: ScenarioVintage[] = [
  {
    id: "big5",
    house: "Big-5 guidance midpoints",
    scope: "Hyperscaler gross (midpoints)",
    prior2026: 802.5,
    new2026: 835,
    y2027: 960,
    color: "#10b981",
    note: "Company stack; MSFT lease caveat applies",
  },
  {
    id: "street",
    house: "Street consensus",
    scope: "Hyperscaler gross",
    prior2026: 790,
    new2026: 820,
    y2027: 990,
    color: "#64748b",
    note: "Consensus still catching the Q2 + mid-Q3 raises",
  },
  {
    id: "creditsights",
    house: "CreditSights / credit desks",
    scope: "Hyperscaler gross",
    prior2026: 800,
    new2026: 830,
    y2027: null,
    color: "#f59e0b",
    note: "Credit-desk aggregate after mid-August refresh",
  },
  {
    id: "gs-gi",
    house: "GS Global Institute",
    scope: "All-in AI infra (compute + DC + power)",
    prior2026: 765,
    new2026: 765,
    y2027: 1011,
    color: "#06b6d4",
    note: "Tracking Trillions baseline still unchanged at annual layer",
  },
  {
    id: "gs-ir-base",
    house: "GS Investment Research (base)",
    scope: "Hyperscaler gross",
    prior2026: 780,
    new2026: 800,
    y2027: 1140,
    color: "#3b82f6",
    note: "2026 IR path edged up; 2027 base still ~$1.14T",
  },
  {
    id: "gs-ir-bull",
    house: "GS Investment Research (bull)",
    scope: "Hyperscaler gross",
    prior2026: null,
    new2026: null,
    y2027: 1400,
    color: "#8b5cf6",
    note: "Bull path if demand stays ahead of supply into 2H27",
  },
];

export type LayerYear = {
  year: string;
  compute: number;
  dataCenters: number;
  power: number;
  total: number;
};

/** GS GI all-in layers — carry-forward baseline */
export const GS_GI_LAYERS: LayerYear[] = [
  { year: "2026", compute: 494, dataCenters: 232, power: 39, total: 765 },
  { year: "2027", compute: 661, dataCenters: 300, power: 50, total: 1011 },
  { year: "2028", compute: 808, dataCenters: 353, power: 59, total: 1220 },
  { year: "2029", compute: 934, dataCenters: 393, power: 65, total: 1392 },
  { year: "2030", compute: 1073, dataCenters: 433, power: 72, total: 1579 },
  { year: "2031", compute: 1127, dataCenters: 436, power: 73, total: 1636 },
];

export type RevisionPoint = {
  vintage: string;
  big5: number;
  street: number;
  credit: number;
  gsIr: number;
  label: string;
};

/** Cumulative revision path: Jul research → Aug post-Q2 → mid-Q3 */
export const REVISION_PATH: RevisionPoint[] = [
  {
    vintage: "Jul research",
    big5: 760,
    street: 725,
    credit: 750,
    gsIr: 750,
    label: "Q1’26 guidance midpoints",
  },
  {
    vintage: "Aug post-Q2",
    big5: 802.5,
    street: 790,
    credit: 800,
    gsIr: 780,
    label: "After Q2’26 earnings week",
  },
  {
    vintage: "Mid-Q3 desk",
    big5: 835,
    street: 820,
    credit: 830,
    gsIr: 800,
    label: "Late-Aug Street / desk catch-up",
  },
];

export type YoYRow = {
  year: string;
  amazon: number;
  microsoft: number;
  alphabet: number;
  meta: number;
  oracle: number;
  total: number;
  vintage: "actual" | "jul-guide" | "aug-guide" | "q3-guide" | "consensus";
};

/** Stack continuity: actuals + triple 2026 vintages + 2027E */
export const YOY_STACK: YoYRow[] = [
  {
    year: "2024",
    amazon: 75,
    microsoft: 56,
    alphabet: 52,
    meta: 39,
    oracle: 9,
    total: 231,
    vintage: "actual",
  },
  {
    year: "2025",
    amazon: 104,
    microsoft: 80,
    alphabet: 80,
    meta: 60,
    oracle: 20,
    total: 344,
    vintage: "actual",
  },
  {
    year: "2026 Jul",
    amazon: 200,
    microsoft: 190,
    alphabet: 185,
    meta: 135,
    oracle: 50,
    total: 760,
    vintage: "jul-guide",
  },
  {
    year: "2026 Aug",
    amazon: 220,
    microsoft: 175,
    alphabet: 200,
    meta: 137.5,
    oracle: 70,
    total: 802.5,
    vintage: "aug-guide",
  },
  {
    year: "2026 Q3",
    amazon: 230,
    microsoft: 175,
    alphabet: 210,
    meta: 145,
    oracle: 75,
    total: 835,
    vintage: "q3-guide",
  },
  {
    year: "2027E",
    amazon: 260,
    microsoft: 215,
    alphabet: 240,
    meta: 160,
    oracle: 85,
    total: 960,
    vintage: "consensus",
  },
];

export type ScopeCompare = {
  label: string;
  priorBn: number | null;
  newBn: number | null;
  scope: string;
};

export const SCOPE_COMPARE: ScopeCompare[] = [
  {
    label: "Big-5 guidance midpoints (2026)",
    priorBn: 802.5,
    newBn: 835,
    scope: "Five companies, gross / mixed definitions",
  },
  {
    label: "Big-4 Axis midpoints (2026)",
    priorBn: 732.5,
    newBn: 760,
    scope: "AMZN+MSFT+GOOGL+META only",
  },
  {
    label: "Street hyperscaler consensus (2026)",
    priorBn: 790,
    newBn: 820,
    scope: "Hyperscaler gross",
  },
  {
    label: "CreditSights aggregate (2026)",
    priorBn: 800,
    newBn: 830,
    scope: "Hyperscaler gross",
  },
  {
    label: "GS GI all-in AI infra (2026)",
    priorBn: 765,
    newBn: 765,
    scope: "Global compute + DC + power",
  },
  {
    label: "GS IR hyperscaler path (2026)",
    priorBn: 780,
    newBn: 800,
    scope: "Hyperscaler gross — IR 2026 path",
  },
  {
    label: "GS IR hyperscaler base (2027)",
    priorBn: 1140,
    newBn: 1140,
    scope: "Hyperscaler gross — unchanged base",
  },
  {
    label: "AI-attributed ~75% of Big-5 (2026)",
    priorBn: 602,
    newBn: 626,
    scope: "Convention haircut, not a 10-K line",
  },
];

export function fmtBn(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(2).replace(/\.?0+$/, "")}T`;
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded)
    ? `$${rounded.toLocaleString()}B`
    : `$${rounded.toLocaleString(undefined, { maximumFractionDigits: 1 })}B`;
}

export function fmtDelta(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${fmtBn(n)}`;
}

export function fmtPct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

export function slopeRows(active: Hyperscaler[] = [...HYPERSCALERS]) {
  return companyDeltas(active).map((d) => ({
    company: d.company,
    prior: d.priorBn,
    neu: d.newBn,
    fill: d.fill,
    priorLabel: d.priorLabel,
    newLabel: d.newLabel,
    deltaBn: d.deltaBn,
  }));
}

export function scenarioFan(year: "2026" | "2027") {
  return SCENARIO_VINTAGE.map((s) => {
    if (year === "2026") {
      return {
        id: s.id,
        house: s.house,
        prior: s.prior2026,
        neu: s.new2026,
        color: s.color,
        scope: s.scope,
      };
    }
    return {
      id: s.id,
      house: s.house,
      prior: s.y2027,
      neu: s.y2027,
      color: s.color,
      scope: s.scope,
    };
  }).filter((r) => r.prior != null || r.neu != null);
}

export function yoyStacked(mode: "gross" | "ai") {
  const f = mode === "ai" ? HEADLINE.aiShareOfGross : 1;
  return YOY_STACK.map((r) => ({
    year: r.year,
    Amazon: Math.round(r.amazon * f),
    Microsoft: Math.round(r.microsoft * f),
    Alphabet: Math.round(r.alphabet * f),
    Meta: Math.round(r.meta * f),
    Oracle: Math.round(r.oracle * f),
    total: Math.round(r.total * f),
    vintage: r.vintage,
  }));
}

export function compositionShare(active: Hyperscaler[] = [...HYPERSCALERS]) {
  const rows = COMPANY_VINTAGE.filter((r) => active.includes(r.company));
  const total = rows.reduce((s, r) => s + r.newBn, 0);
  return rows.map((r) => ({
    company: r.company,
    value: r.newBn,
    pct: Math.round((r.newBn / total) * 1000) / 10,
    fill: r.fill,
  }));
}
