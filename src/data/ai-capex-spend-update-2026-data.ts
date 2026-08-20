/**
 * AI capex & spend totals — vintage update (Aug 2026).
 * Compares the Jul 2026 research print (Q1’26 guidance midpoints) against
 * the newest official vintage after Q2’26 earnings (late Jul 2026).
 * Figures USD billions; scopes intentionally labeled.
 */

export const SOURCE_NOTE =
  "Vintage delta: Jul 2026 research print (Q1’26 guidance midpoints → Big-5 ~$760B) vs Aug 2026 update after Q2’26 earnings. Amazon ~$220B, Alphabet $195–205B mid $200B, Meta $130–145B mid $137.5B, Microsoft ~$175B CY (lease reclass, not a build cut), Oracle ~$70B net of customer prepayments. Big-5 midpoints sum ~$803B (+$43B / +5.6%). Q2’26 Big-4 capex absorption ≈99% of OCF (Axis). AI-attributed factor ≈75% of gross (CreditSights convention).";

export const SOURCES = [
  {
    label: "Company Q2 2026 earnings guidance (AMZN, GOOGL, META, MSFT, ORCL)",
    url: "https://axis-intelligence.com/ai-capex-tracker/",
  },
  {
    label: "Prior theme baseline — AI capex spend research",
    url: "/blog/ai-capex-spend-research-2026",
  },
  {
    label: "Goldman Sachs Global Institute — Tracking Trillions",
    url: "https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out",
  },
] as const;

export const HEADLINE = {
  priorBig5: 760,
  newBig5: 802.5,
  deltaBn: 42.5,
  deltaPct: 5.6,
  /** Like-for-like if MSFT CY stay ~$190B (lease reclass only) */
  economicNewBig5: 817.5,
  economicDeltaBn: 57.5,
  priorBig4: 710,
  newBig4: 732.5,
  big4DeltaBn: 22.5,
  aiShareOfGross: 0.75,
  priorAiSlice: 570,
  newAiSlice: 602,
  q2CapexBn: 170.1,
  q2OcfBn: 171.7,
  q2AbsorptionPct: 99.0,
  streetPrior2026: 725,
  streetNew2026: 790,
  gsGi2026: 765,
  gsIr2027Base: 1140,
  gsIr2027Bull: 1400,
  yoy2025: 344,
  yoyGrowthPct: 133,
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

export type Confidence = "guidance" | "midpoint" | "call" | "net-of-prepay";

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

/** Company guidance midpoints — prior = Jul research; new = post-Q2’26 */
export const COMPANY_VINTAGE: VintageCompany[] = [
  {
    company: "Amazon",
    priorBn: 200,
    newBn: 220,
    priorLabel: "Q1’26 ~$200B",
    newLabel: "Jul 30 ~$220B",
    confidence: "call",
    note: "Cash capex; largest absolute raise (+$20B)",
    fill: COMPANY_COLORS.Amazon,
  },
  {
    company: "Microsoft",
    priorBn: 190,
    newBn: 175,
    priorLabel: "Q1’26 ~$190B CY",
    newLabel: "Jul 29 ~$175B CY",
    confidence: "call",
    note: "Headline −$15B from lease reclassification, not a spending cut",
    fill: COMPANY_COLORS.Microsoft,
  },
  {
    company: "Alphabet",
    priorBn: 185,
    newBn: 200,
    priorLabel: "Q1’26 $180–190 mid",
    newLabel: "Jul 22 $195–205 mid",
    confidence: "midpoint",
    note: "Second consecutive raise; Intersect / infra cited",
    fill: COMPANY_COLORS.Alphabet,
  },
  {
    company: "Meta",
    priorBn: 135,
    newBn: 137.5,
    priorLabel: "Q1’26 $125–145 mid",
    newLabel: "Jul 29 $130–145 mid",
    confidence: "midpoint",
    note: "Floor raised; includes finance-lease principal",
    fill: COMPANY_COLORS.Meta,
  },
  {
    company: "Oracle",
    priorBn: 50,
    newBn: 70,
    priorLabel: "Q1’26 ~$50B",
    newLabel: "~$70B net (gross ~$90–95B)",
    confidence: "net-of-prepay",
    note: "Net of customer prepayments; gross stack still climbing",
    fill: COMPANY_COLORS.Oracle,
  },
];

export function companyDeltas(active: Hyperscaler[] = [...HYPERSCALERS]) {
  return COMPANY_VINTAGE.filter((r) => active.includes(r.company)).map((r) => ({
    ...r,
    deltaBn: Math.round((r.newBn - r.priorBn) * 10) / 10,
    deltaPct: Math.round(((r.newBn - r.priorBn) / r.priorBn) * 1000) / 10,
  }));
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

/** Research-house annual scenarios — prior vs post-Q2 refresh where available */
export const SCENARIO_VINTAGE: ScenarioVintage[] = [
  {
    id: "big5",
    house: "Big-5 guidance midpoints",
    scope: "Hyperscaler gross (midpoints)",
    prior2026: 760,
    new2026: 802.5,
    y2027: 920,
    color: "#10b981",
    note: "Company stack; MSFT lease caveat applies",
  },
  {
    id: "street",
    house: "Street consensus",
    scope: "Hyperscaler gross",
    prior2026: 725,
    new2026: 790,
    y2027: 960,
    color: "#64748b",
    note: "Consensus climbed with Q2 raises (Reuters / Street blend)",
  },
  {
    id: "creditsights",
    house: "CreditSights / credit desks",
    scope: "Hyperscaler gross",
    prior2026: 750,
    new2026: 800,
    y2027: null,
    color: "#f59e0b",
    note: "Post-earnings aggregate neighborhood",
  },
  {
    id: "gs-gi",
    house: "GS Global Institute",
    scope: "All-in AI infra (compute + DC + power)",
    prior2026: 765,
    new2026: 765,
    y2027: 1011,
    color: "#06b6d4",
    note: "Tracking Trillions baseline unchanged at annual layer",
  },
  {
    id: "gs-ir-base",
    house: "GS Investment Research (base)",
    scope: "Hyperscaler gross",
    prior2026: 750,
    new2026: 780,
    y2027: 1140,
    color: "#3b82f6",
    note: "2027 base still ~$1.14T; 2026 path edged up with guidance",
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

/** GS GI all-in layers — carry-forward baseline (same perimeter as research post) */
export const GS_GI_LAYERS: LayerYear[] = [
  { year: "2026", compute: 494, dataCenters: 232, power: 39, total: 765 },
  { year: "2027", compute: 661, dataCenters: 300, power: 50, total: 1011 },
  { year: "2028", compute: 808, dataCenters: 353, power: 59, total: 1220 },
  { year: "2029", compute: 934, dataCenters: 393, power: 65, total: 1392 },
  { year: "2030", compute: 1073, dataCenters: 433, power: 72, total: 1579 },
  { year: "2031", compute: 1127, dataCenters: 436, power: 73, total: 1636 },
];

export type AbsorptionRow = {
  company: string;
  capexBn: number;
  ocfBn: number;
  absorptionPct: number;
  fill: string;
};

/** Q2’26 Big-4 capex vs operating cash flow (Axis CAR cohort) */
export const Q2_ABSORPTION: AbsorptionRow[] = [
  {
    company: "Alphabet",
    capexBn: 44.9,
    ocfBn: 39.1,
    absorptionPct: 115.0,
    fill: COMPANY_COLORS.Alphabet,
  },
  {
    company: "Amazon",
    capexBn: 53.1,
    ocfBn: 45.4,
    absorptionPct: 116.9,
    fill: COMPANY_COLORS.Amazon,
  },
  {
    company: "Meta",
    capexBn: 31.1,
    ocfBn: 31.9,
    absorptionPct: 97.5,
    fill: COMPANY_COLORS.Meta,
  },
  {
    company: "Microsoft",
    capexBn: 41.0,
    ocfBn: 55.4,
    absorptionPct: 74.0,
    fill: COMPANY_COLORS.Microsoft,
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
  vintage: "actual" | "prior-guide" | "new-guide" | "consensus";
};

/** Stack continuity: 2024–25 actuals, dual 2026 vintages, 2027 consensus path */
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
    year: "2026 prior",
    amazon: 200,
    microsoft: 190,
    alphabet: 185,
    meta: 135,
    oracle: 50,
    total: 760,
    vintage: "prior-guide",
  },
  {
    year: "2026 new",
    amazon: 220,
    microsoft: 175,
    alphabet: 200,
    meta: 137.5,
    oracle: 70,
    total: 802.5,
    vintage: "new-guide",
  },
  {
    year: "2027E",
    amazon: 250,
    microsoft: 210,
    alphabet: 230,
    meta: 150,
    oracle: 80,
    total: 920,
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
    priorBn: 760,
    newBn: 802.5,
    scope: "Five companies, gross / mixed definitions",
  },
  {
    label: "Big-4 Axis midpoints (2026)",
    priorBn: 710,
    newBn: 732.5,
    scope: "AMZN+MSFT+GOOGL+META only",
  },
  {
    label: "Street hyperscaler consensus (2026)",
    priorBn: 725,
    newBn: 790,
    scope: "Hyperscaler gross",
  },
  {
    label: "CreditSights aggregate (2026)",
    priorBn: 750,
    newBn: 800,
    scope: "Hyperscaler gross",
  },
  {
    label: "GS GI all-in AI infra (2026)",
    priorBn: 765,
    newBn: 765,
    scope: "Global compute + DC + power",
  },
  {
    label: "GS IR hyperscaler base (2027)",
    priorBn: 1140,
    newBn: 1140,
    scope: "Hyperscaler gross — unchanged base",
  },
  {
    label: "AI-attributed ~75% of Big-5 (2026)",
    priorBn: 570,
    newBn: 602,
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

export function dumbbellRows(active: Hyperscaler[] = [...HYPERSCALERS]) {
  return companyDeltas(active).map((d) => ({
    company: d.company,
    prior: d.priorBn,
    neu: d.newBn,
    fill: d.fill,
    priorLabel: d.priorLabel,
    newLabel: d.newLabel,
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
