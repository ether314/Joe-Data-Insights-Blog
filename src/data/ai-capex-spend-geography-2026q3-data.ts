/**
 * AI capex & spend — geography lens (mid-Q3 2026 vintage).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * How large is AI infrastructure spending in dollars and scenarios?
 *
 * Complements the mid-Q3 absolute-dollar update (~$835B Big-5) and Q3
 * concentration companion with regional facility shares, US metro ladders,
 * scenario geography, and interconnect risk — on the cooler mid-guide tape
 * versus the late-Aug ~$858B geography print.
 *
 * Primary sources:
 * - Mid-Q3 Big-5 midpoints (~$835B gross; AI slice ~$626B @ 75%)
 * - GS Global Institute Tracking Trillions (all-in AI infra scenarios)
 * - Synergy Research / CBRE / JLL-style DC market capacity geography (desk roll-up)
 * - Company campus / interconnect announcements (NoVA, Texas, Midwest, Ireland, Nordics, APAC)
 */

export type Confidence = "disclosed" | "estimated" | "desk" | "scenario";

export const SOURCE_NOTE =
  "Geography lens on mid-Q3 Big-5 gross midpoints (~$835B; AI-attributed ≈75% → ~$626B). Regional and US-metro shares are desk reconstructions from disclosed campus / interconnect tips plus Synergy-style capacity geography — not company-reported geographic segment breakouts. Scenario rows use GS GI all-in AI infra vs hyperscaler gross perimeters. Interconnect-risk scores are ordinal desk ranks, not ISO queue extracts. Confidence tags separate disclosed company totals from geographic roll-ups. Pair with the late-Aug geography companion (~$858B) for the hotter vintage.";

export const PRIOR_RESEARCH_PATH = "/blog/ai-capex-spend-research-2026";
export const PRIOR_CONCENTRATION_PATH = "/blog/ai-capex-spend-concentration-2026q3";
export const PRIOR_AUG608_PATH = "/blog/ai-capex-spend-concentration-202608";
export const PRIOR_UPDATE_PATH = "/blog/ai-capex-spend-update-2026q3";
export const PRIOR_GEO_2026_PATH = "/blog/ai-capex-spend-geography-2026";
export const PRIOR_AUG_UPDATE_PATH = "/blog/ai-capex-spend-update-202608";
export const INTENSITY_PATH = "/blog/ai-capex-intensity-update-2026q3";

export const HEADLINE = {
  /** Mid-Q3 Big-5 midpoints */
  big5GrossBn: 835,
  aiShareOfGross: 0.75,
  aiSliceBn: 626,
  /** Top region share of Big-5 facility geography */
  top1RegionSharePct: 57,
  top1RegionLabel: "United States",
  top1RegionBn: 476,
  /** Top-3 regions */
  top3RegionSharePct: 92,
  top3RegionLabel: "US · Europe · Asia-Pacific",
  top3RegionBn: 768,
  /** Largest US metro share of global Big-5 */
  top1MetroSharePct: 10.8,
  top1MetroLabel: "Northern Virginia",
  top1MetroBn: 90,
  /** US share of Big-5 */
  usSharePct: 57,
  europeSharePct: 18,
  apacSharePct: 17,
  /** GS GI 2026 all-in AI infra (Tracking Trillions) */
  gsGi2026Bn: 765,
  gsGiUsSharePct: 52,
  /** Interconnect risk tip (desk ordinal) */
  topRiskMetro: "Northern Virginia",
  topRiskScore: 91,
  /** Jul→Q3 cumulative raise still US-heavy */
  julToQ3DeltaBn: 75,
  usRaiseSharePct: 60,
  /** Late-Aug companion for vintage delta */
  lateAugGrossBn: 858,
  lateAugUsSharePct: 58,
} as const;

export type RegionRow = {
  region: string;
  short: string;
  amountBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  aiSliceBn: number;
  topMetro: string;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Facility-geography roll-up of mid-Q3 Big-5 gross (~$835B).
 * Slightly softer US tip (~57%) than the late-Aug ~58% print — cooler absolute
 * stack, marginally thicker APAC weight as Japan / India campus tips convert.
 */
export const REGION_ROWS: RegionRow[] = [
  {
    region: "United States",
    short: "US",
    amountBn: 476,
    sharePct: 57.0,
    cumulativeSharePct: 57.0,
    aiSliceBn: 357,
    topMetro: "Northern Virginia",
    confidence: "estimated",
    fill: "#3b82f6",
    note: "NoVA + Texas + Midwest power corridors dominate disclosed campus tips",
  },
  {
    region: "Europe",
    short: "Europe",
    amountBn: 150,
    sharePct: 18.0,
    cumulativeSharePct: 75.0,
    aiSliceBn: 113,
    topMetro: "Ireland / Dublin",
    confidence: "estimated",
    fill: "#06b6d4",
    note: "Ireland + Nordics + Frankfurt / NL interconnect clusters",
  },
  {
    region: "Asia-Pacific",
    short: "APAC",
    amountBn: 142,
    sharePct: 17.0,
    cumulativeSharePct: 92.0,
    aiSliceBn: 107,
    topMetro: "Tokyo / Osaka",
    confidence: "estimated",
    fill: "#22c55e",
    note: "Japan, Singapore, India, Australia capacity ramps — +1 pp vs late-Aug",
  },
  {
    region: "Middle East & Africa",
    short: "MEA",
    amountBn: 33,
    sharePct: 4.0,
    cumulativeSharePct: 96.0,
    aiSliceBn: 25,
    topMetro: "UAE / Abu Dhabi",
    confidence: "desk",
    fill: "#f59e0b",
    note: "UAE + Saudi sovereign AI campus announcements",
  },
  {
    region: "Latin America",
    short: "LatAm",
    amountBn: 17,
    sharePct: 2.0,
    cumulativeSharePct: 98.0,
    aiSliceBn: 13,
    topMetro: "São Paulo",
    confidence: "desk",
    fill: "#a855f7",
    note: "Thin absolute dollars; Brazil as regional tip",
  },
  {
    region: "Residual / unallocated",
    short: "Residual",
    amountBn: 17,
    sharePct: 2.0,
    cumulativeSharePct: 100.0,
    aiSliceBn: 11,
    topMetro: "—",
    confidence: "desk",
    fill: "#64748b",
    note: "Closes the $835B perimeter; not a geographic claim",
  },
];

export type UsMetro = {
  id: string;
  label: string;
  short: string;
  amountBn: number;
  shareOfUsPct: number;
  shareOfGlobalPct: number;
  powerRisk: number;
  growthYoYPct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** US metro / corridor ladder — shares of US slice (~$476B) and global Big-5. */
export const US_METROS: UsMetro[] = [
  {
    id: "nova",
    label: "Northern Virginia",
    short: "NoVA",
    amountBn: 90,
    shareOfUsPct: 18.9,
    shareOfGlobalPct: 10.8,
    powerRisk: 91,
    growthYoYPct: 27,
    confidence: "estimated",
    fill: "#2563eb",
    note: "Largest disclosed hyperscaler campus densification tip",
  },
  {
    id: "texas",
    label: "Texas (Dallas / Central)",
    short: "Texas",
    amountBn: 70,
    shareOfUsPct: 14.7,
    shareOfGlobalPct: 8.4,
    powerRisk: 78,
    growthYoYPct: 42,
    confidence: "estimated",
    fill: "#f97316",
  },
  {
    id: "midwest",
    label: "Midwest (OH / IA / IL)",
    short: "Midwest",
    amountBn: 66,
    shareOfUsPct: 13.9,
    shareOfGlobalPct: 7.9,
    powerRisk: 70,
    growthYoYPct: 49,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Power-available corridors pulling share from coastal tips",
  },
  {
    id: "pnw",
    label: "Pacific Northwest",
    short: "PNW",
    amountBn: 46,
    shareOfUsPct: 9.7,
    shareOfGlobalPct: 5.5,
    powerRisk: 63,
    growthYoYPct: 17,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "southwest",
    label: "Southwest (AZ / NV)",
    short: "SW",
    amountBn: 42,
    shareOfUsPct: 8.8,
    shareOfGlobalPct: 5.0,
    powerRisk: 80,
    growthYoYPct: 37,
    confidence: "estimated",
    fill: "#eab308",
  },
  {
    id: "southeast",
    label: "Southeast (GA / Carolinas)",
    short: "SE",
    amountBn: 38,
    shareOfUsPct: 8.0,
    shareOfGlobalPct: 4.6,
    powerRisk: 57,
    growthYoYPct: 34,
    confidence: "estimated",
    fill: "#84cc16",
  },
  {
    id: "other-us",
    label: "Other US",
    short: "Other",
    amountBn: 124,
    shareOfUsPct: 26.1,
    shareOfGlobalPct: 14.9,
    powerRisk: 44,
    growthYoYPct: 21,
    confidence: "desk",
    fill: "#94a3b8",
    note: "Long tail of secondary markets + unallocated US residual",
  },
];

export type YearRegion = {
  year: string;
  US: number;
  Europe: number;
  APAC: number;
  MEA: number;
  LatAm: number;
  Residual: number;
};

/** Gross Big-5 path by region (USD bn) — directional desk geography; 2026 = mid-Q3. */
export const REGION_BY_YEAR: YearRegion[] = [
  { year: "2024", US: 134, Europe: 42, APAC: 38, MEA: 6, LatAm: 4, Residual: 7 },
  { year: "2025", US: 205, Europe: 62, APAC: 55, MEA: 12, LatAm: 7, Residual: 9 },
  { year: "2026", US: 476, Europe: 150, APAC: 142, MEA: 33, LatAm: 17, Residual: 17 },
  { year: "2027", US: 560, Europe: 182, APAC: 180, MEA: 46, LatAm: 22, Residual: 20 },
];

export type ScenarioGeo = {
  id: string;
  house: string;
  scope: string;
  totalBn: number;
  usSharePct: number;
  europeSharePct: number;
  apacSharePct: number;
  otherSharePct: number;
  color: string;
  confidence: Confidence;
  note: string;
};

/** Scenario geography — do not mix scopes when comparing absolute dollars. */
export const SCENARIO_GEO: ScenarioGeo[] = [
  {
    id: "big5-gross",
    house: "Big-5 midpoints (Q3)",
    scope: "Hyperscaler gross capex",
    totalBn: 835,
    usSharePct: 57,
    europeSharePct: 18,
    apacSharePct: 17,
    otherSharePct: 8,
    color: "#3b82f6",
    confidence: "estimated",
    note: "Mid-Q3 facility geography on company midpoints",
  },
  {
    id: "big5-ai",
    house: "Big-5 AI slice",
    scope: "AI-attributed (~75% of gross)",
    totalBn: 626,
    usSharePct: 57,
    europeSharePct: 18,
    apacSharePct: 17,
    otherSharePct: 8,
    color: "#8b5cf6",
    confidence: "desk",
    note: "Same geography weights × CreditSights AI factor",
  },
  {
    id: "gs-gi",
    house: "GS Global Institute",
    scope: "All-in AI infra (compute + DC + power)",
    totalBn: 765,
    usSharePct: 52,
    europeSharePct: 20,
    apacSharePct: 19,
    otherSharePct: 9,
    color: "#06b6d4",
    confidence: "scenario",
    note: "Tracking Trillions all-in perimeter; slightly less US-skewed",
  },
  {
    id: "gs-ir-2027",
    house: "GS IR 2027 base",
    scope: "Hyperscaler gross capex",
    totalBn: 1140,
    usSharePct: 55,
    europeSharePct: 19,
    apacSharePct: 18,
    otherSharePct: 8,
    color: "#f59e0b",
    confidence: "scenario",
    note: "2027 base path; US share eases as APAC/Europe ramps",
  },
];

export type RiskPoint = {
  id: string;
  label: string;
  short: string;
  region: "US" | "Europe" | "APAC" | "MEA";
  shareOfGlobalPct: number;
  powerRisk: number;
  amountBn: number;
  fill: string;
};

/** Spend share × interconnect risk scatter (bubble ∝ √dollars). */
export const RISK_GEO: RiskPoint[] = [
  {
    id: "nova",
    label: "Northern Virginia",
    short: "NoVA",
    region: "US",
    shareOfGlobalPct: 10.8,
    powerRisk: 91,
    amountBn: 90,
    fill: "#2563eb",
  },
  {
    id: "texas",
    label: "Texas",
    short: "TX",
    region: "US",
    shareOfGlobalPct: 8.4,
    powerRisk: 78,
    amountBn: 70,
    fill: "#f97316",
  },
  {
    id: "midwest",
    label: "Midwest",
    short: "MW",
    region: "US",
    shareOfGlobalPct: 7.9,
    powerRisk: 70,
    amountBn: 66,
    fill: "#0ea5e9",
  },
  {
    id: "dublin",
    label: "Ireland / Dublin",
    short: "IE",
    region: "Europe",
    shareOfGlobalPct: 5.1,
    powerRisk: 87,
    amountBn: 43,
    fill: "#06b6d4",
  },
  {
    id: "nordics",
    label: "Nordics",
    short: "NO/SE",
    region: "Europe",
    shareOfGlobalPct: 4.0,
    powerRisk: 41,
    amountBn: 33,
    fill: "#14b8a6",
  },
  {
    id: "frankfurt",
    label: "Frankfurt / NL",
    short: "DE/NL",
    region: "Europe",
    shareOfGlobalPct: 3.7,
    powerRisk: 73,
    amountBn: 31,
    fill: "#22d3ee",
  },
  {
    id: "tokyo",
    label: "Tokyo / Osaka",
    short: "JP",
    region: "APAC",
    shareOfGlobalPct: 5.0,
    powerRisk: 65,
    amountBn: 42,
    fill: "#22c55e",
  },
  {
    id: "singapore",
    label: "Singapore",
    short: "SG",
    region: "APAC",
    shareOfGlobalPct: 3.4,
    powerRisk: 84,
    amountBn: 28,
    fill: "#4ade80",
  },
  {
    id: "india",
    label: "India (HYD / MUM)",
    short: "IN",
    region: "APAC",
    shareOfGlobalPct: 3.1,
    powerRisk: 54,
    amountBn: 26,
    fill: "#86efac",
  },
  {
    id: "uae",
    label: "UAE",
    short: "AE",
    region: "MEA",
    shareOfGlobalPct: 2.2,
    powerRisk: 47,
    amountBn: 18,
    fill: "#f59e0b",
  },
  {
    id: "southwest",
    label: "AZ / NV",
    short: "SW",
    region: "US",
    shareOfGlobalPct: 5.0,
    powerRisk: 80,
    amountBn: 42,
    fill: "#eab308",
  },
];

export type MeterRow = {
  id: string;
  label: string;
  valuePct: number;
  sublabel: string;
  fill: string;
};

export const METER_COMPARE: MeterRow[] = [
  {
    id: "us-region",
    label: "US region share",
    valuePct: HEADLINE.usSharePct,
    sublabel: `~$${HEADLINE.top1RegionBn}B of $${HEADLINE.big5GrossBn}B`,
    fill: "#3b82f6",
  },
  {
    id: "top3-regions",
    label: "Top-3 regions",
    valuePct: HEADLINE.top3RegionSharePct,
    sublabel: HEADLINE.top3RegionLabel,
    fill: "#06b6d4",
  },
  {
    id: "nova",
    label: "NoVA global share",
    valuePct: HEADLINE.top1MetroSharePct,
    sublabel: `~$${HEADLINE.top1MetroBn}B metro tip`,
    fill: "#8b5cf6",
  },
  {
    id: "us-raise",
    label: "US share of Jul→Q3 raise",
    valuePct: HEADLINE.usRaiseSharePct,
    sublabel: `of +$${HEADLINE.julToQ3DeltaBn}B cumulative`,
    fill: "#f59e0b",
  },
];

export const SOURCES = [
  {
    label: "Mid-Q3 spend update",
    url: PRIOR_UPDATE_PATH,
  },
  {
    label: "Q3 concentration companion",
    url: PRIOR_CONCENTRATION_PATH,
  },
  {
    label: "Late-Aug geography companion",
    url: PRIOR_GEO_2026_PATH,
  },
  {
    label: "Theme baseline — AI capex spend research",
    url: PRIOR_RESEARCH_PATH,
  },
  {
    label: "Goldman Sachs Global Institute — Tracking Trillions",
    url: "https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out",
  },
] as const;

export function fmtUsdBn(n: number): string {
  if (n >= 100) return `$${Math.round(n)}B`;
  if (n >= 10) return `$${n.toFixed(0)}B`;
  return `$${n.toFixed(1)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function regionBars(metric: "dollars" | "share", scope: "gross" | "ai") {
  const rows = REGION_ROWS.filter((r) => r.short !== "Residual");
  return rows
    .map((r) => ({
      ...r,
      value: metric === "share" ? r.sharePct : scope === "ai" ? r.aiSliceBn : r.amountBn,
    }))
    .sort((a, b) => b.value - a.value);
}

export function usMetroBars(metric: "us" | "global" | "growth") {
  return [...US_METROS]
    .filter((m) => m.id !== "other-us")
    .map((m) => ({
      ...m,
      value:
        metric === "us"
          ? m.shareOfUsPct
          : metric === "global"
            ? m.shareOfGlobalPct
            : m.growthYoYPct,
    }))
    .sort((a, b) => b.value - a.value);
}

export function scenarioStacked() {
  return SCENARIO_GEO.map((s) => ({
    name: s.house,
    short: s.id,
    US: Math.round((s.totalBn * s.usSharePct) / 100),
    Europe: Math.round((s.totalBn * s.europeSharePct) / 100),
    APAC: Math.round((s.totalBn * s.apacSharePct) / 100),
    Other: Math.round((s.totalBn * s.otherSharePct) / 100),
    total: s.totalBn,
    color: s.color,
    scope: s.scope,
  }));
}

export function riskScatter(region: "all" | RiskPoint["region"]) {
  return RISK_GEO.filter((p) => region === "all" || p.region === region).map((p) => ({
    ...p,
    z: Math.sqrt(p.amountBn) * 12,
  }));
}
