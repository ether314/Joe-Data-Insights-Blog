/**
 * AI capex & spend — geography lens (2026).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * How large is AI infrastructure spending in dollars and scenarios?
 *
 * Complements absolute-dollar updates (Jul→Aug20 path to ~$858B Big-5) and
 * concentration (top-1/top-3/HHI among hyperscalers) with regional facility
 * shares, US metro ladders, scenario geography, and interconnect risk.
 *
 * Primary sources:
 * - Late-Aug 202608 Big-5 midpoints (~$858B gross; AI slice ~$644B @ 75%)
 * - GS Global Institute Tracking Trillions (all-in AI infra scenarios)
 * - Synergy Research / CBRE / JLL-style DC market capacity geography (desk roll-up)
 * - Company campus / interconnect announcements (NoVA, Texas, Midwest, Ireland, Nordics, APAC)
 */

export type Confidence = "disclosed" | "estimated" | "desk" | "scenario";

export const SOURCE_NOTE =
  "Geography lens on late-Aug 202608 Big-5 gross midpoints (~$858B; AI-attributed ≈75% → ~$644B). Regional and US-metro shares are desk reconstructions from disclosed campus / interconnect tips plus Synergy-style capacity geography — not company-reported geographic segment breakouts. Scenario rows use GS GI all-in AI infra vs hyperscaler gross perimeters. Interconnect-risk scores are ordinal desk ranks, not ISO queue extracts. Confidence tags separate disclosed company totals from geographic roll-ups.";

export const PRIOR_RESEARCH_PATH = "/blog/ai-capex-spend-research-2026";
export const PRIOR_CONCENTRATION_PATH = "/blog/ai-capex-spend-concentration-2026";
export const PRIOR_AUG608_PATH = "/blog/ai-capex-spend-concentration-202608";
export const PRIOR_UPDATE_PATH = "/blog/ai-capex-spend-update-202608";
export const PRIOR_Q3_PATH = "/blog/ai-capex-spend-update-2026q3";
export const INTENSITY_PATH = "/blog/ai-capex-intensity-update-2026";

export const HEADLINE = {
  /** Late-Aug 202608 Big-5 midpoints */
  big5GrossBn: 858,
  aiShareOfGross: 0.75,
  aiSliceBn: 644,
  /** Top region share of Big-5 facility geography */
  top1RegionSharePct: 58,
  top1RegionLabel: "United States",
  top1RegionBn: 498,
  /** Top-3 regions */
  top3RegionSharePct: 92,
  top3RegionLabel: "US · Europe · Asia-Pacific",
  top3RegionBn: 789,
  /** Largest US metro share of global Big-5 */
  top1MetroSharePct: 11,
  top1MetroLabel: "Northern Virginia",
  top1MetroBn: 94,
  /** US share of Big-5 */
  usSharePct: 58,
  europeSharePct: 18,
  apacSharePct: 16,
  /** GS GI 2026 all-in AI infra (Tracking Trillions) */
  gsGi2026Bn: 765,
  gsGiUsSharePct: 52,
  /** Interconnect risk tip (desk ordinal) */
  topRiskMetro: "Northern Virginia",
  topRiskScore: 92,
  /** Jul→Aug20 cumulative raise still US-heavy */
  julToAug20DeltaBn: 98,
  usRaiseSharePct: 62,
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
 * Facility-geography roll-up of late-Aug Big-5 gross (~$858B).
 * Anchors: US campus densification (NoVA/TX/Midwest), Europe (IE/Nordics/DE/NL),
 * APAC (JP/SG/IN/AU), MEA (UAE/SA), LatAm residual.
 */
export const REGION_ROWS: RegionRow[] = [
  {
    region: "United States",
    short: "US",
    amountBn: 498,
    sharePct: 58.0,
    cumulativeSharePct: 58.0,
    aiSliceBn: 374,
    topMetro: "Northern Virginia",
    confidence: "estimated",
    fill: "#3b82f6",
    note: "NoVA + Texas + Midwest power corridors dominate disclosed campus tips",
  },
  {
    region: "Europe",
    short: "Europe",
    amountBn: 154,
    sharePct: 18.0,
    cumulativeSharePct: 76.0,
    aiSliceBn: 116,
    topMetro: "Ireland / Dublin",
    confidence: "estimated",
    fill: "#06b6d4",
    note: "Ireland + Nordics + Frankfurt / NL interconnect clusters",
  },
  {
    region: "Asia-Pacific",
    short: "APAC",
    amountBn: 137,
    sharePct: 16.0,
    cumulativeSharePct: 92.0,
    aiSliceBn: 103,
    topMetro: "Tokyo / Osaka",
    confidence: "estimated",
    fill: "#22c55e",
    note: "Japan, Singapore, India, Australia capacity ramps",
  },
  {
    region: "Middle East & Africa",
    short: "MEA",
    amountBn: 34,
    sharePct: 4.0,
    cumulativeSharePct: 96.0,
    aiSliceBn: 26,
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
    amountBn: 18,
    sharePct: 2.0,
    cumulativeSharePct: 100.0,
    aiSliceBn: 12,
    topMetro: "—",
    confidence: "desk",
    fill: "#64748b",
    note: "Closes the $858B perimeter; not a geographic claim",
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

/** US metro / corridor ladder — shares of US slice (~$498B) and global Big-5. */
export const US_METROS: UsMetro[] = [
  {
    id: "nova",
    label: "Northern Virginia",
    short: "NoVA",
    amountBn: 94,
    shareOfUsPct: 18.9,
    shareOfGlobalPct: 11.0,
    powerRisk: 92,
    growthYoYPct: 28,
    confidence: "estimated",
    fill: "#2563eb",
    note: "Largest disclosed hyperscaler campus densification tip",
  },
  {
    id: "texas",
    label: "Texas (Dallas / Central)",
    short: "Texas",
    amountBn: 72,
    shareOfUsPct: 14.5,
    shareOfGlobalPct: 8.4,
    powerRisk: 78,
    growthYoYPct: 41,
    confidence: "estimated",
    fill: "#f97316",
  },
  {
    id: "midwest",
    label: "Midwest (OH / IA / IL)",
    short: "Midwest",
    amountBn: 68,
    shareOfUsPct: 13.7,
    shareOfGlobalPct: 7.9,
    powerRisk: 71,
    growthYoYPct: 48,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Power-available corridors pulling share from coastal tips",
  },
  {
    id: "pnw",
    label: "Pacific Northwest",
    short: "PNW",
    amountBn: 48,
    shareOfUsPct: 9.6,
    shareOfGlobalPct: 5.6,
    powerRisk: 64,
    growthYoYPct: 18,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "southwest",
    label: "Southwest (AZ / NV)",
    short: "SW",
    amountBn: 44,
    shareOfUsPct: 8.8,
    shareOfGlobalPct: 5.1,
    powerRisk: 81,
    growthYoYPct: 36,
    confidence: "estimated",
    fill: "#eab308",
  },
  {
    id: "southeast",
    label: "Southeast (GA / Carolinas)",
    short: "SE",
    amountBn: 40,
    shareOfUsPct: 8.0,
    shareOfGlobalPct: 4.7,
    powerRisk: 58,
    growthYoYPct: 33,
    confidence: "estimated",
    fill: "#84cc16",
  },
  {
    id: "other-us",
    label: "Other US",
    short: "Other",
    amountBn: 132,
    shareOfUsPct: 26.5,
    shareOfGlobalPct: 15.4,
    powerRisk: 45,
    growthYoYPct: 22,
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

/** Gross Big-5 path by region (USD bn) — directional desk geography. */
export const REGION_BY_YEAR: YearRegion[] = [
  { year: "2024", US: 134, Europe: 42, APAC: 38, MEA: 6, LatAm: 4, Residual: 7 },
  { year: "2025", US: 205, Europe: 62, APAC: 55, MEA: 12, LatAm: 7, Residual: 9 },
  { year: "2026", US: 498, Europe: 154, APAC: 137, MEA: 34, LatAm: 17, Residual: 18 },
  { year: "2027", US: 580, Europe: 185, APAC: 175, MEA: 48, LatAm: 22, Residual: 20 },
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
    house: "Big-5 midpoints (Aug20)",
    scope: "Hyperscaler gross capex",
    totalBn: 858,
    usSharePct: 58,
    europeSharePct: 18,
    apacSharePct: 16,
    otherSharePct: 8,
    color: "#3b82f6",
    confidence: "estimated",
    note: "Late-Aug 202608 facility geography on company midpoints",
  },
  {
    id: "big5-ai",
    house: "Big-5 AI slice",
    scope: "AI-attributed (~75% of gross)",
    totalBn: 644,
    usSharePct: 58,
    europeSharePct: 18,
    apacSharePct: 16,
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
    usSharePct: 56,
    europeSharePct: 19,
    apacSharePct: 17,
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
    shareOfGlobalPct: 11.0,
    powerRisk: 92,
    amountBn: 94,
    fill: "#2563eb",
  },
  {
    id: "texas",
    label: "Texas",
    short: "TX",
    region: "US",
    shareOfGlobalPct: 8.4,
    powerRisk: 78,
    amountBn: 72,
    fill: "#f97316",
  },
  {
    id: "midwest",
    label: "Midwest",
    short: "MW",
    region: "US",
    shareOfGlobalPct: 7.9,
    powerRisk: 71,
    amountBn: 68,
    fill: "#0ea5e9",
  },
  {
    id: "dublin",
    label: "Ireland / Dublin",
    short: "IE",
    region: "Europe",
    shareOfGlobalPct: 5.2,
    powerRisk: 88,
    amountBn: 45,
    fill: "#06b6d4",
  },
  {
    id: "nordics",
    label: "Nordics",
    short: "NO/SE",
    region: "Europe",
    shareOfGlobalPct: 4.1,
    powerRisk: 42,
    amountBn: 35,
    fill: "#14b8a6",
  },
  {
    id: "frankfurt",
    label: "Frankfurt / NL",
    short: "DE/NL",
    region: "Europe",
    shareOfGlobalPct: 3.8,
    powerRisk: 74,
    amountBn: 33,
    fill: "#22d3ee",
  },
  {
    id: "tokyo",
    label: "Tokyo / Osaka",
    short: "JP",
    region: "APAC",
    shareOfGlobalPct: 4.8,
    powerRisk: 66,
    amountBn: 41,
    fill: "#22c55e",
  },
  {
    id: "singapore",
    label: "Singapore",
    short: "SG",
    region: "APAC",
    shareOfGlobalPct: 3.3,
    powerRisk: 85,
    amountBn: 28,
    fill: "#4ade80",
  },
  {
    id: "india",
    label: "India (HYD / MUM)",
    short: "IN",
    region: "APAC",
    shareOfGlobalPct: 2.9,
    powerRisk: 55,
    amountBn: 25,
    fill: "#86efac",
  },
  {
    id: "uae",
    label: "UAE",
    short: "AE",
    region: "MEA",
    shareOfGlobalPct: 2.2,
    powerRisk: 48,
    amountBn: 19,
    fill: "#f59e0b",
  },
  {
    id: "southwest",
    label: "AZ / NV",
    short: "SW",
    region: "US",
    shareOfGlobalPct: 5.1,
    powerRisk: 81,
    amountBn: 44,
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
    label: "US share of Jul→Aug20 raise",
    valuePct: HEADLINE.usRaiseSharePct,
    sublabel: `of +$${HEADLINE.julToAug20DeltaBn}B cumulative`,
    fill: "#f59e0b",
  },
];

export const SOURCES = [
  {
    label: "Late-Aug 202608 spend update",
    url: PRIOR_UPDATE_PATH,
  },
  {
    label: "Aug concentration companion",
    url: PRIOR_AUG608_PATH,
  },
  {
    label: "Theme baseline — AI capex spend research",
    url: PRIOR_RESEARCH_PATH,
  },
  {
    label: "Concentration lens (Big-5)",
    url: PRIOR_CONCENTRATION_PATH,
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
