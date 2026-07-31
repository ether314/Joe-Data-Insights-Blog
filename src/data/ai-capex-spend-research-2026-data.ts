/**
 * Multi-source AI infrastructure spend totals & scenarios (2024–2031).
 * Synthesizes company guidance, GS Investment Research, GS Global Institute,
 * Street consensus, and McKinsey cumulative frameworks — scopes intentionally distinct.
 */

export const SOURCE_NOTE =
  "Big-5 2024–2025 from company filings / Q4 calls; 2026 midpoints from Q1 2026 guidance (Amazon $200B, Microsoft ~$190B CY, Alphabet $180–190B midpoint $185B, Meta $125–145B midpoint $135B, Oracle ~$50B). CreditSights ~$750B post-earnings aggregate. GS Investment Research hyperscaler base/bull via public reporting (June 2026). GS Global Institute all-in AI infra from Tracking Trillions (April 2026). McKinsey cumulative AI data-center capex scenarios from The Cost of Compute (April 2025). AI-attributed factor ≈75% of gross hyperscaler capex (CreditSights). Figures USD billions; roundings apply.";

export const SOURCES = [
  {
    label: "Goldman Sachs Global Institute — Tracking Trillions",
    url: "https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out",
  },
  {
    label: "McKinsey — The Cost of Compute (April 2025)",
    url: "https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-cost-of-compute-a-7-trillion-dollar-race-to-scale-data-centers",
  },
] as const;

export const HEADLINE = {
  big5_2026: 760, // guidance midpoints sum (200+190+185+135+50)
  creditsights_2026: 750,
  gsGi_2026: 765,
  gsIr_2027_base: 1140,
  gsIr_2027_bull: 1400,
  street_2027: 920,
  mckinsey_base_ai_tn: 5.2,
  mckinsey_total_base_tn: 6.7,
  gsGi_cumulative_tn: 7.6,
  aiShareOfGross: 0.75,
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

export type CapexYear = "2024" | "2025" | "2026" | "2027" | "2028";

/** Gross company capex (USD bn). 2024–2025 actuals/estimates; 2026 guidance midpoints; 2027–2028 directional consensus. */
export const HYPERSCALER_GROSS_BN: Record<CapexYear, Record<Hyperscaler, number>> = {
  "2024": { Amazon: 75, Microsoft: 56, Alphabet: 52, Meta: 39, Oracle: 9 },
  "2025": { Amazon: 104, Microsoft: 80, Alphabet: 80, Meta: 60, Oracle: 20 },
  "2026": { Amazon: 200, Microsoft: 190, Alphabet: 185, Meta: 135, Oracle: 50 },
  "2027": { Amazon: 240, Microsoft: 230, Alphabet: 220, Meta: 145, Oracle: 70 },
  "2028": { Amazon: 280, Microsoft: 270, Alphabet: 250, Meta: 160, Oracle: 90 },
};

export const YEAR_CONFIDENCE: Record<CapexYear, "actual" | "guidance" | "consensus" | "projected"> = {
  "2024": "actual",
  "2025": "actual",
  "2026": "guidance",
  "2027": "consensus",
  "2028": "projected",
};

export function big5Total(year: CapexYear, aiOnly: boolean): number {
  const row = HYPERSCALER_GROSS_BN[year];
  const gross = HYPERSCALERS.reduce((s, c) => s + row[c], 0);
  return aiOnly ? Math.round(gross * HEADLINE.aiShareOfGross) : gross;
}

export function companySeries(aiOnly: boolean): Array<Record<string, string | number>> {
  return (Object.keys(HYPERSCALER_GROSS_BN) as CapexYear[]).map((year) => {
    const row: Record<string, string | number> = { year };
    let total = 0;
    for (const c of HYPERSCALERS) {
      const v = aiOnly
        ? Math.round(HYPERSCALER_GROSS_BN[year][c] * HEADLINE.aiShareOfGross)
        : HYPERSCALER_GROSS_BN[year][c];
      row[c] = v;
      total += v;
    }
    row.total = total;
    return row;
  });
}

export type ResearchScenario = {
  id: string;
  house: string;
  scope: string;
  y2026: number | null;
  y2027: number | null;
  y2028: number | null;
  color: string;
  note: string;
};

/** Annual spend scenarios — do not mix scopes when comparing. */
export const RESEARCH_SCENARIOS: ResearchScenario[] = [
  {
    id: "gs-gi",
    house: "GS Global Institute",
    scope: "All-in AI infra (compute + DC + power)",
    y2026: 765,
    y2027: 1011,
    y2028: 1220,
    color: "#06b6d4",
    note: "Tracking Trillions baseline scenario framework",
  },
  {
    id: "gs-ir-base",
    house: "GS Investment Research (base)",
    scope: "Hyperscaler gross capex",
    y2026: 750,
    y2027: 1140,
    y2028: null,
    color: "#3b82f6",
    note: "Ryan Hammond / IR base case, June 2026",
  },
  {
    id: "gs-ir-bull",
    house: "GS Investment Research (bull)",
    scope: "Hyperscaler gross capex",
    y2026: null,
    y2027: 1400,
    y2028: null,
    color: "#8b5cf6",
    note: "Bull path if demand stays ahead of supply into 2H27",
  },
  {
    id: "street",
    house: "Street consensus",
    scope: "Hyperscaler gross capex",
    y2026: 725,
    y2027: 920,
    y2028: 1060,
    color: "#64748b",
    note: "Pre/post Q1 2026 Street blend; 2028 Dell'Oro-style CAGR path",
  },
  {
    id: "creditsights",
    house: "CreditSights",
    scope: "Hyperscaler gross capex",
    y2026: 750,
    y2027: null,
    y2028: null,
    color: "#f59e0b",
    note: "Raised aggregate after Q1 2026 earnings",
  },
  {
    id: "big5-guide",
    house: "Big-5 company guidance",
    scope: "Hyperscaler gross capex (midpoints)",
    y2026: 760,
    y2027: 905,
    y2028: 1050,
    color: "#10b981",
    note: "Sum of disclosed midpoints / directional consensus by company",
  },
];

export type McKinseyScenario = {
  id: string;
  label: string;
  incrementalGw: number;
  aiCapexTn: number;
  totalCapexTn: number;
  color: string;
};

export const MCKINSEY_SCENARIOS: McKinseyScenario[] = [
  {
    id: "constrained",
    label: "Constrained",
    incrementalGw: 78,
    aiCapexTn: 3.7,
    totalCapexTn: 5.2,
    color: "#94a3b8",
  },
  {
    id: "base",
    label: "Base case",
    incrementalGw: 125,
    aiCapexTn: 5.2,
    totalCapexTn: 6.7,
    color: "#3b82f6",
  },
  {
    id: "accelerated",
    label: "Accelerated",
    incrementalGw: 205,
    aiCapexTn: 7.9,
    totalCapexTn: 9.4,
    color: "#f43f5e",
  },
];

export const GS_GI_LAYERS = [
  { year: "2026", compute: 494, dataCenters: 232, power: 39, total: 765 },
  { year: "2027", compute: 661, dataCenters: 300, power: 50, total: 1011 },
  { year: "2028", compute: 808, dataCenters: 353, power: 59, total: 1220 },
  { year: "2029", compute: 934, dataCenters: 393, power: 65, total: 1392 },
  { year: "2030", compute: 1073, dataCenters: 433, power: 72, total: 1579 },
  { year: "2031", compute: 1127, dataCenters: 436, power: 73, total: 1636 },
] as const;

export const SCOPE_ROWS = [
  {
    label: "Big-5 guidance midpoints (2026)",
    valueBn: 760,
    scope: "Five companies, gross PP&E",
  },
  {
    label: "CreditSights aggregate (2026)",
    valueBn: 750,
    scope: "Hyperscaler gross",
  },
  {
    label: "GS GI all-in AI infra (2026)",
    valueBn: 765,
    scope: "Global compute + DC + power",
  },
  {
    label: "Street hyperscaler consensus (2027)",
    valueBn: 920,
    scope: "Hyperscaler gross",
  },
  {
    label: "GS IR hyperscaler base (2027)",
    valueBn: 1140,
    scope: "Hyperscaler gross",
  },
  {
    label: "GS IR hyperscaler bull (2027)",
    valueBn: 1400,
    scope: "Hyperscaler gross",
  },
  {
    label: "GS GI all-in AI infra (2027)",
    valueBn: 1011,
    scope: "Global compute + DC + power",
  },
] as const;

export function fmtBn(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(2).replace(/\.?0+$/, "")}T`;
  return `$${n.toLocaleString()}B`;
}

export function fmtTn(n: number): string {
  return `$${n.toFixed(1)}T`;
}

export function scenarioValue(
  s: ResearchScenario,
  year: "2026" | "2027" | "2028",
): number | null {
  if (year === "2026") return s.y2026;
  if (year === "2027") return s.y2027;
  return s.y2028;
}
