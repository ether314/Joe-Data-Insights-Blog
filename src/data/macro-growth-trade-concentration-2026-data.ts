/**
 * Growth, trade & prices — concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * How are economies growing, trading, and experiencing price dynamics?
 *
 * Complements April WEO research (triad path), July Update, Q3 hard-data, and
 * August CPI/PCE vintage with top-1 / top-3 shares across PPP GDP stock,
 * contribution to world growth, merchandise trade-growth contribution, and
 * goods-export value shares — plus a price-dispersion cross-check.
 *
 * Primary sources (carried from theme vintages):
 * - IMF World Economic Outlook April 2026 + July 2026 Update (PPP weights, GDP, CPI)
 * - WTO Global Trade Outlook and Statistics March 2026 (merch volume contributions; export values)
 * - CPB / BLS / BEA / Eurostat hard-data posts for price-path context (not re-ranked here)
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "PPP GDP stock and growth-contribution shares use IMF WEO April 2026 PPP weights and country growth (staff-aligned where country PPP weights are not fully disclosed in Table 1.1). Merchandise trade-growth contribution shares follow WTO GTOS March 2026 regional decomposition of 2025 volume growth (Asia 3.2 pp / 71% disclosed). Goods-export value shares use WTO 2025 merchandise export values vs ~$26.3T world merch exports. CPI ladder uses WEO/BLS/Eurostat prints carried from theme posts; price “top-k” is a burden ladder (elevated CPI), not an additive market share. Confidence tags separate disclosed WTO/IMF prints from analytical residual buckets.";

export const PRIOR_RESEARCH_PATH = "/blog/macro-growth-trade-research-2026";
export const PRIOR_JULY_PATH = "/blog/macro-growth-trade-update-2026";
export const PRIOR_Q3_PATH = "/blog/macro-growth-trade-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/macro-growth-trade-update-202608";
export const CHINA_US_INDIA_PATH = "/blog/china-us-india-gdp-30-years";

export const HEADLINE = {
  /** PPP GDP stock inside world economy (~2025) */
  top1PppSharePct: 19,
  top1PppLabel: "China",
  top3PppSharePct: 42,
  top3PppLabel: "China · US · India",
  top5PppSharePct: 53,
  pppHhi: 780,
  worldGdpPpp2025: 3.4,
  worldGdpPpp2026: 3.1,
  /** Contribution to world PPP growth (2025 outturn weights × growth) */
  top1GrowthContribPct: 32,
  top1GrowthContribLabel: "China",
  top3GrowthContribPct: 55,
  top3GrowthContribLabel: "China · India · US",
  /** Regional merchandise trade-volume growth contribution (WTO 2025) */
  top1TradeGrowthSharePct: 71,
  top1TradeGrowthLabel: "Asia",
  top1TradeGrowthPp: 3.2,
  top3TradeGrowthSharePct: 97,
  merchVolume2025: 4.6,
  merchValueTn2025: 26.26,
  /** Goods export value market share (2025) */
  top1ExportSharePct: 14,
  top1ExportLabel: "China",
  top3ExportSharePct: 29,
  top3ExportLabel: "China · US · Germany",
  servicesValueTn2025: 9.56,
  /** Price-dispersion context */
  worldCpi2025: 4.1,
  worldCpi2026: 4.4,
  usCpiJulYoy: 3.4,
  eaHicpJulYoy: 2.9,
  chinaCpi2025: 0.2,
  elevatedCpiGdpSharePct: 38,
  imfTradeGs2026: 2.8,
  asiaImport2026f: 3.3,
} as const;

export type ShareRow = {
  rank: number;
  id: string;
  label: string;
  short: string;
  sharePct: number;
  cumulativeSharePct: number;
  secondary: number;
  secondaryLabel: string;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * World PPP GDP stock shares (~2025 weights). Residual closes the perimeter.
 */
export const PPP_STOCK_SHARES: ShareRow[] = [
  {
    rank: 1,
    id: "chn",
    label: "China",
    short: "CN",
    sharePct: 18.9,
    cumulativeSharePct: 18.9,
    secondary: 5.0,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#ef4444",
    note: "Largest PPP weight; export strength vs soft domestic CPI",
  },
  {
    rank: 2,
    id: "usa",
    label: "United States",
    short: "US",
    sharePct: 15.2,
    cumulativeSharePct: 34.1,
    secondary: 2.1,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    rank: 3,
    id: "ind",
    label: "India",
    short: "IN",
    sharePct: 8.1,
    cumulativeSharePct: 42.2,
    secondary: 7.6,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Fiscal-year GDP basis per WEO note 3",
  },
  {
    rank: 4,
    id: "jpn",
    label: "Japan",
    short: "JP",
    sharePct: 3.7,
    cumulativeSharePct: 45.9,
    secondary: 1.2,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    rank: 5,
    id: "deu",
    label: "Germany",
    short: "DE",
    sharePct: 3.3,
    cumulativeSharePct: 49.2,
    secondary: 0.2,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#10b981",
  },
  {
    rank: 6,
    id: "rus",
    label: "Russia",
    short: "RU",
    sharePct: 2.9,
    cumulativeSharePct: 52.1,
    secondary: 1.5,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#64748b",
  },
  {
    rank: 7,
    id: "idn",
    label: "Indonesia",
    short: "ID",
    sharePct: 2.6,
    cumulativeSharePct: 54.7,
    secondary: 4.9,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    rank: 8,
    id: "bra",
    label: "Brazil",
    short: "BR",
    sharePct: 2.4,
    cumulativeSharePct: 57.1,
    secondary: 2.3,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#a855f7",
  },
  {
    rank: 9,
    id: "residual",
    label: "All other economies",
    short: "ROW",
    sharePct: 42.9,
    cumulativeSharePct: 100,
    secondary: 2.6,
    secondaryLabel: "implied GDP %",
    confidence: "estimated",
    fill: "#94a3b8",
    note: "Analytical residual closing the PPP perimeter",
  },
];

/**
 * Share of 2025 world PPP GDP growth attributable to each economy
 * (weight × growth / world growth). Residual closes to 100%.
 */
export const GROWTH_CONTRIB_SHARES: ShareRow[] = [
  {
    rank: 1,
    id: "chn",
    label: "China",
    short: "CN",
    sharePct: 31.8,
    cumulativeSharePct: 31.8,
    secondary: 5.0,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#ef4444",
    note: "~1/3 of world PPP growth from one economy",
  },
  {
    rank: 2,
    id: "ind",
    label: "India",
    short: "IN",
    sharePct: 14.6,
    cumulativeSharePct: 46.4,
    secondary: 7.6,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    rank: 3,
    id: "usa",
    label: "United States",
    short: "US",
    sharePct: 9.1,
    cumulativeSharePct: 55.5,
    secondary: 2.1,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    rank: 4,
    id: "idn",
    label: "Indonesia",
    short: "ID",
    sharePct: 3.8,
    cumulativeSharePct: 59.3,
    secondary: 4.9,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    rank: 5,
    id: "bra",
    label: "Brazil",
    short: "BR",
    sharePct: 1.6,
    cumulativeSharePct: 60.9,
    secondary: 2.3,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#a855f7",
  },
  {
    rank: 6,
    id: "jpn",
    label: "Japan",
    short: "JP",
    sharePct: 1.3,
    cumulativeSharePct: 62.2,
    secondary: 1.2,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    rank: 7,
    id: "mex",
    label: "Mexico",
    short: "MX",
    sharePct: 0.4,
    cumulativeSharePct: 62.6,
    secondary: 0.6,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#06b6d4",
  },
  {
    rank: 8,
    id: "eur",
    label: "Euro area (agg.)",
    short: "EA",
    sharePct: 5.8,
    cumulativeSharePct: 68.4,
    secondary: 1.4,
    secondaryLabel: "GDP 2025 %",
    confidence: "estimated",
    fill: "#6366f1",
    note: "Aggregated EA contribution; not a single sovereign",
  },
  {
    rank: 9,
    id: "residual",
    label: "All other economies",
    short: "ROW",
    sharePct: 31.6,
    cumulativeSharePct: 100,
    secondary: 2.8,
    secondaryLabel: "implied GDP %",
    confidence: "estimated",
    fill: "#94a3b8",
  },
];

export type RegionTradeShare = {
  rank: number;
  id: string;
  label: string;
  short: string;
  pp2025: number;
  sharePct: number;
  cumulativeSharePct: number;
  merchImport2026f: number;
  confidence: Confidence;
  fill: string;
};

/** WTO regional contribution to 2025 merchandise trade volume growth */
export const TRADE_GROWTH_SHARES: RegionTradeShare[] = [
  {
    rank: 1,
    id: "asia",
    label: "Asia",
    short: "Asia",
    pp2025: 3.2,
    sharePct: 71,
    cumulativeSharePct: 71,
    merchImport2026f: 3.3,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    rank: 2,
    id: "europe",
    label: "Europe",
    short: "Europe",
    pp2025: 0.7,
    sharePct: 15,
    cumulativeSharePct: 86,
    merchImport2026f: 1.2,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    rank: 3,
    id: "namerica",
    label: "North America",
    short: "N. Am.",
    pp2025: 0.5,
    sharePct: 11,
    cumulativeSharePct: 97,
    merchImport2026f: 1.5,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    rank: 4,
    id: "row",
    label: "Rest of world",
    short: "ROW",
    pp2025: 0.2,
    sharePct: 4,
    cumulativeSharePct: 100,
    merchImport2026f: 2.8,
    confidence: "estimated",
    fill: "#94a3b8",
  },
];

/**
 * Merchandise export value market shares (2025, vs ~$26.3T world).
 */
export const EXPORT_VALUE_SHARES: ShareRow[] = [
  {
    rank: 1,
    id: "chn",
    label: "China",
    short: "CN",
    sharePct: 14.2,
    cumulativeSharePct: 14.2,
    secondary: 9.2,
    secondaryLabel: "export vol. 2025 %",
    confidence: "estimated",
    fill: "#ef4444",
    note: "WTO narrative: China export volume +9.2% in 2025",
  },
  {
    rank: 2,
    id: "usa",
    label: "United States",
    short: "US",
    sharePct: 8.1,
    cumulativeSharePct: 22.3,
    secondary: 2.4,
    secondaryLabel: "export vol. 2025 %",
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    rank: 3,
    id: "deu",
    label: "Germany",
    short: "DE",
    sharePct: 6.7,
    cumulativeSharePct: 29.0,
    secondary: 0.8,
    secondaryLabel: "export vol. 2025 %",
    confidence: "estimated",
    fill: "#10b981",
  },
  {
    rank: 4,
    id: "nld",
    label: "Netherlands",
    short: "NL",
    sharePct: 3.6,
    cumulativeSharePct: 32.6,
    secondary: 1.1,
    secondaryLabel: "export vol. 2025 %",
    confidence: "estimated",
    fill: "#f59e0b",
    note: "Re-export hub inflates value share vs domestic origin",
  },
  {
    rank: 5,
    id: "jpn",
    label: "Japan",
    short: "JP",
    sharePct: 3.3,
    cumulativeSharePct: 35.9,
    secondary: 1.5,
    secondaryLabel: "export vol. 2025 %",
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    rank: 6,
    id: "kor",
    label: "Korea",
    short: "KR",
    sharePct: 2.9,
    cumulativeSharePct: 38.8,
    secondary: 4.1,
    secondaryLabel: "export vol. 2025 %",
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    rank: 7,
    id: "ita",
    label: "Italy",
    short: "IT",
    sharePct: 2.6,
    cumulativeSharePct: 41.4,
    secondary: 0.6,
    secondaryLabel: "export vol. 2025 %",
    confidence: "estimated",
    fill: "#a855f7",
  },
  {
    rank: 8,
    id: "fra",
    label: "France",
    short: "FR",
    sharePct: 2.4,
    cumulativeSharePct: 43.8,
    secondary: 0.9,
    secondaryLabel: "export vol. 2025 %",
    confidence: "estimated",
    fill: "#6366f1",
  },
  {
    rank: 9,
    id: "residual",
    label: "All other exporters",
    short: "ROW",
    sharePct: 56.2,
    cumulativeSharePct: 100,
    secondary: 3.8,
    secondaryLabel: "implied vol. %",
    confidence: "estimated",
    fill: "#94a3b8",
  },
];

export type PriceRow = {
  rank: number;
  id: string;
  label: string;
  short: string;
  cpiYoy: number;
  gdp2025: number;
  pppSharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Cross-section of CPI vs growth — price dispersion, not a closed share portfolio */
export const PRICE_LADDER: PriceRow[] = [
  {
    rank: 1,
    id: "bra",
    label: "Brazil",
    short: "BR",
    cpiYoy: 4.8,
    gdp2025: 2.3,
    pppSharePct: 2.4,
    confidence: "estimated",
    fill: "#a855f7",
  },
  {
    rank: 2,
    id: "ind",
    label: "India",
    short: "IN",
    cpiYoy: 4.6,
    gdp2025: 7.6,
    pppSharePct: 8.1,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    rank: 3,
    id: "zaf",
    label: "South Africa",
    short: "ZA",
    cpiYoy: 4.4,
    gdp2025: 1.1,
    pppSharePct: 0.6,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    rank: 4,
    id: "mex",
    label: "Mexico",
    short: "MX",
    cpiYoy: 4.0,
    gdp2025: 0.6,
    pppSharePct: 1.8,
    confidence: "estimated",
    fill: "#06b6d4",
  },
  {
    rank: 5,
    id: "gbr",
    label: "United Kingdom",
    short: "UK",
    cpiYoy: 3.4,
    gdp2025: 1.3,
    pppSharePct: 2.2,
    confidence: "estimated",
    fill: "#6366f1",
    note: "Matches Aug US CPI YoY print level, different path",
  },
  {
    rank: 6,
    id: "usa",
    label: "United States",
    short: "US",
    cpiYoy: 3.4,
    gdp2025: 2.1,
    pppSharePct: 15.2,
    confidence: "disclosed",
    fill: "#0ea5e9",
    note: "BLS July 2026 CPI YoY (Aug vintage)",
  },
  {
    rank: 7,
    id: "jpn",
    label: "Japan",
    short: "JP",
    cpiYoy: 2.9,
    gdp2025: 1.2,
    pppSharePct: 3.7,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    rank: 8,
    id: "eur",
    label: "Euro area",
    short: "EA",
    cpiYoy: 2.9,
    gdp2025: 1.4,
    pppSharePct: 11.0,
    confidence: "disclosed",
    fill: "#64748b",
    note: "Eurostat July HICP YoY",
  },
  {
    rank: 9,
    id: "chn",
    label: "China",
    short: "CN",
    cpiYoy: 0.2,
    gdp2025: 5.0,
    pppSharePct: 18.9,
    confidence: "estimated",
    fill: "#ef4444",
    note: "Near-zero CPI while leading growth contribution",
  },
];

export type LensCompare = {
  id: string;
  label: string;
  top1Pct: number;
  top3Pct: number;
  top1Name: string;
  unit: string;
  fill: string;
};

export const LENS_COMPARE: LensCompare[] = [
  {
    id: "ppp",
    label: "PPP GDP stock",
    top1Pct: 19,
    top3Pct: 42,
    top1Name: "China",
    unit: "% of world PPP",
    fill: "#ef4444",
  },
  {
    id: "growth",
    label: "Growth contribution",
    top1Pct: 32,
    top3Pct: 55,
    top1Name: "China",
    unit: "% of world PPP growth",
    fill: "#f59e0b",
  },
  {
    id: "trade",
    label: "Trade-growth contrib.",
    top1Pct: 71,
    top3Pct: 97,
    top1Name: "Asia",
    unit: "% of merch vol. growth",
    fill: "#0ea5e9",
  },
  {
    id: "exports",
    label: "Export value share",
    top1Pct: 14,
    top3Pct: 29,
    top1Name: "China",
    unit: "% of merch exports",
    fill: "#10b981",
  },
];

export type ConcentrationCurvePoint = {
  k: number;
  label: string;
  cumulativeSharePct: number;
  equalSharePct: number;
};

function buildCurve(
  shares: { short: string; cumulativeSharePct: number }[],
  nUniverse: number,
): ConcentrationCurvePoint[] {
  const named = shares.filter((s) => s.short !== "ROW");
  return [
    { k: 0, label: "0", cumulativeSharePct: 0, equalSharePct: 0 },
    ...named.map((s, i) => ({
      k: i + 1,
      label: s.short,
      cumulativeSharePct: s.cumulativeSharePct,
      equalSharePct: ((i + 1) / nUniverse) * 100,
    })),
  ];
}

export const PPP_CONCENTRATION_CURVE = buildCurve(PPP_STOCK_SHARES, 40);
export const GROWTH_CONCENTRATION_CURVE = buildCurve(GROWTH_CONTRIB_SHARES, 40);
export const TRADE_CONCENTRATION_CURVE = buildCurve(
  TRADE_GROWTH_SHARES.map((r) => ({
    short: r.short,
    cumulativeSharePct: r.cumulativeSharePct,
  })),
  4,
);
export const EXPORT_CONCENTRATION_CURVE = buildCurve(EXPORT_VALUE_SHARES, 50);

/** Triad path for context panel (GDP / trade / CPI) */
export type TriadPoint = {
  year: number;
  label: string;
  worldGdp: number;
  merchVolume: number;
  worldCpi: number;
  isForecast: boolean;
};

export const TRIAD_PATH: TriadPoint[] = [
  { year: 2023, label: "2023", worldGdp: 3.3, merchVolume: -1.1, worldCpi: 6.7, isForecast: false },
  { year: 2024, label: "2024", worldGdp: 3.3, merchVolume: 2.9, worldCpi: 5.7, isForecast: false },
  { year: 2025, label: "2025", worldGdp: 3.4, merchVolume: 4.6, worldCpi: 4.1, isForecast: false },
  { year: 2026, label: "2026f", worldGdp: 3.1, merchVolume: 1.9, worldCpi: 4.4, isForecast: true },
  { year: 2027, label: "2027f", worldGdp: 3.2, merchVolume: 2.6, worldCpi: 3.7, isForecast: true },
];

export function namedShares(rows: ShareRow[]): ShareRow[] {
  return rows.filter((r) => r.id !== "residual");
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  return `${n.toFixed(digits)} pp`;
}

export function fmtTn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}T`;
}
