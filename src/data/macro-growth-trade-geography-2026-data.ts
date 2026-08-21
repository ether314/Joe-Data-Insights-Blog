/**
 * Growth, trade & prices — geography lens (2026).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * How are economies growing, trading, and experiencing price dynamics?
 *
 * Complements concentration (top-k / HHI) and research/update vintages with
 * regional share maps: PPP stock, growth contribution, merchandise trade-growth,
 * export-value corridors, and CPI-regime geography.
 *
 * Primary sources (carried from theme vintages):
 * - IMF World Economic Outlook April 2026 + July 2026 Update (PPP weights, GDP, CPI)
 * - WTO Global Trade Outlook and Statistics March 2026 (merch volume contributions; export values)
 * - BLS / BEA / Eurostat hard-data posts for price-path context
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Regional PPP stock and growth-contribution shares roll IMF WEO April 2026 country weights × growth into continental buckets (staff-aligned where Table 1.1 omits full PPP weights). Merchandise trade-growth geography follows WTO GTOS March 2026 regional decomposition of 2025 volume growth (Asia 3.2 pp / 71% disclosed). Goods-export value geography uses WTO 2025 merchandise export values vs ~$26.3T world. CPI regimes mix WEO/BLS/Eurostat prints carried from theme posts; elevated-CPI GDP share is a burden perimeter, not an additive market share. Confidence tags separate disclosed WTO/IMF prints from analytical residual buckets.";

export const PRIOR_RESEARCH_PATH = "/blog/macro-growth-trade-research-2026";
export const PRIOR_JULY_PATH = "/blog/macro-growth-trade-update-2026";
export const PRIOR_Q3_PATH = "/blog/macro-growth-trade-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/macro-growth-trade-update-202608";
export const PRIOR_CONC_PATH = "/blog/macro-growth-trade-concentration-2026";
export const PRIOR_CONC_Q3_PATH = "/blog/macro-growth-trade-concentration-2026q3";
export const CHINA_US_INDIA_PATH = "/blog/china-us-india-gdp-30-years";

export const HEADLINE = {
  /** Asia share of world PPP GDP stock (~2025) */
  asiaPppSharePct: 40,
  /** Asia share of 2025 world PPP growth contribution */
  asiaGrowthContribPct: 54,
  /** Asia share of merchandise trade-volume growth (WTO 2025) */
  asiaTradeGrowthSharePct: 71,
  asiaTradeGrowthPp: 3.2,
  /** North America PPP stock (US-dominated) */
  nAmericaPppSharePct: 18,
  nAmericaGrowthContribPct: 10,
  /** Europe PPP + growth */
  europePppSharePct: 17,
  europeGrowthContribPct: 8,
  /** Top region on growth contribution */
  topRegionGrowthLabel: "Asia",
  topRegionGrowthPct: 54,
  /** Top-3 regions on growth contribution (Asia + N.Am + Europe) */
  top3RegionGrowthPct: 72,
  /** Goods export value: East Asia corridor share */
  eastAsiaExportSharePct: 24,
  top3ExportRegionPct: 58,
  merchValueTn2025: 26.26,
  worldGdpPpp2025: 3.4,
  worldGdpPpp2026: 3.1,
  worldCpi2025: 4.1,
  worldCpi2026: 4.4,
  /** Elevated CPI burden by geography */
  elevatedCpiGdpSharePct: 38,
  asiaElevatedShareOfElevatedPct: 28,
  nAmericaElevatedShareOfElevatedPct: 42,
  chinaCpi2025: 0.2,
  usCpiJulYoy: 3.4,
  eaHicpJulYoy: 2.9,
  imfTradeGs2026: 2.8,
  asiaImport2026f: 3.3,
} as const;

export type RegionRow = {
  region: string;
  short: string;
  pppSharePct: number;
  growthContribPct: number;
  tradeGrowthSharePct: number;
  tradeGrowthPp: number;
  exportSharePct: number;
  medianCpi: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Six-region roll-up of growth / trade / price geography.
 * Asia = E/S/SE Asia ex-ME; N. America = US+CA+MX; Europe = EU+UK+CH+NO;
 * LatAm = S+Central America ex-MX; MENA; SSA+Oceania residual → RoW split.
 */
export const REGION_SHARES: RegionRow[] = [
  {
    region: "Asia",
    short: "Asia",
    pppSharePct: 40.2,
    growthContribPct: 54.1,
    tradeGrowthSharePct: 71,
    tradeGrowthPp: 3.2,
    exportSharePct: 32.4,
    medianCpi: 1.8,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "CN+IN+JP+ID+KR+ASEAN core; trade-growth share WTO-disclosed",
  },
  {
    region: "North America",
    short: "N. Am.",
    pppSharePct: 18.1,
    growthContribPct: 9.8,
    tradeGrowthSharePct: 11,
    tradeGrowthPp: 0.5,
    exportSharePct: 11.6,
    medianCpi: 3.3,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "US ~15% PPP stock; MX nearshoring lifts export corridor",
  },
  {
    region: "Europe",
    short: "Europe",
    pppSharePct: 16.8,
    growthContribPct: 7.9,
    tradeGrowthSharePct: 15,
    tradeGrowthPp: 0.7,
    exportSharePct: 28.2,
    medianCpi: 2.6,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "High export-value share vs low growth contribution",
  },
  {
    region: "Latin America",
    short: "LatAm",
    pppSharePct: 6.4,
    growthContribPct: 4.2,
    tradeGrowthSharePct: 1.5,
    tradeGrowthPp: 0.07,
    exportSharePct: 5.1,
    medianCpi: 4.5,
    confidence: "estimated",
    fill: "#a855f7",
    note: "BR+AR+CL+CO+PE; elevated CPI vs modest trade-growth share",
  },
  {
    region: "MENA",
    short: "MENA",
    pppSharePct: 5.1,
    growthContribPct: 3.4,
    tradeGrowthSharePct: 1.2,
    tradeGrowthPp: 0.05,
    exportSharePct: 6.8,
    medianCpi: 5.2,
    confidence: "estimated",
    fill: "#14b8a6",
    note: "Energy exporters inflate export $ vs volume contribution",
  },
  {
    region: "Rest of world",
    short: "ROW",
    pppSharePct: 13.4,
    growthContribPct: 20.6,
    tradeGrowthSharePct: 0.3,
    tradeGrowthPp: 0.08,
    exportSharePct: 15.9,
    medianCpi: 6.1,
    confidence: "estimated",
    fill: "#94a3b8",
    note: "SSA + Oceania + residual CIS; growth residual closes perimeter",
  },
];

export type CountryGeo = {
  id: string;
  label: string;
  short: string;
  region: string;
  pppSharePct: number;
  growthContribPct: number;
  exportSharePct: number;
  gdp2025: number;
  cpiYoy: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Country markers for growth × CPI scatter (bubble = PPP share) */
export const COUNTRY_GEO: CountryGeo[] = [
  {
    id: "chn",
    label: "China",
    short: "CN",
    region: "Asia",
    pppSharePct: 18.9,
    growthContribPct: 31.8,
    exportSharePct: 14.2,
    gdp2025: 5.0,
    cpiYoy: 0.2,
    confidence: "estimated",
    fill: "#ef4444",
    note: "Growth engine with near-zero CPI",
  },
  {
    id: "usa",
    label: "United States",
    short: "US",
    region: "North America",
    pppSharePct: 15.2,
    growthContribPct: 9.1,
    exportSharePct: 8.1,
    gdp2025: 2.1,
    cpiYoy: 3.4,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "ind",
    label: "India",
    short: "IN",
    region: "Asia",
    pppSharePct: 8.1,
    growthContribPct: 14.6,
    exportSharePct: 2.1,
    gdp2025: 7.6,
    cpiYoy: 4.6,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "jpn",
    label: "Japan",
    short: "JP",
    region: "Asia",
    pppSharePct: 3.7,
    growthContribPct: 1.3,
    exportSharePct: 3.3,
    gdp2025: 1.2,
    cpiYoy: 2.8,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    id: "deu",
    label: "Germany",
    short: "DE",
    region: "Europe",
    pppSharePct: 3.3,
    growthContribPct: 0.2,
    exportSharePct: 6.7,
    gdp2025: 0.2,
    cpiYoy: 2.4,
    confidence: "estimated",
    fill: "#10b981",
  },
  {
    id: "idn",
    label: "Indonesia",
    short: "ID",
    region: "Asia",
    pppSharePct: 2.6,
    growthContribPct: 3.8,
    exportSharePct: 1.1,
    gdp2025: 4.9,
    cpiYoy: 2.1,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "bra",
    label: "Brazil",
    short: "BR",
    region: "Latin America",
    pppSharePct: 2.4,
    growthContribPct: 1.6,
    exportSharePct: 1.4,
    gdp2025: 2.3,
    cpiYoy: 4.8,
    confidence: "estimated",
    fill: "#a855f7",
  },
  {
    id: "gbr",
    label: "United Kingdom",
    short: "UK",
    region: "Europe",
    pppSharePct: 2.3,
    growthContribPct: 0.9,
    exportSharePct: 2.0,
    gdp2025: 1.1,
    cpiYoy: 3.1,
    confidence: "estimated",
    fill: "#6366f1",
  },
  {
    id: "fra",
    label: "France",
    short: "FR",
    region: "Europe",
    pppSharePct: 2.2,
    growthContribPct: 0.7,
    exportSharePct: 2.4,
    gdp2025: 0.9,
    cpiYoy: 2.2,
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    id: "mex",
    label: "Mexico",
    short: "MX",
    region: "North America",
    pppSharePct: 1.8,
    growthContribPct: 0.4,
    exportSharePct: 2.2,
    gdp2025: 0.6,
    cpiYoy: 4.1,
    confidence: "estimated",
    fill: "#06b6d4",
  },
  {
    id: "kor",
    label: "Korea",
    short: "KR",
    region: "Asia",
    pppSharePct: 1.7,
    growthContribPct: 0.9,
    exportSharePct: 2.9,
    gdp2025: 1.8,
    cpiYoy: 2.3,
    confidence: "estimated",
    fill: "#f97316",
  },
  {
    id: "tur",
    label: "Türkiye",
    short: "TR",
    region: "MENA",
    pppSharePct: 1.6,
    growthContribPct: 1.1,
    exportSharePct: 1.0,
    gdp2025: 2.8,
    cpiYoy: 35.0,
    confidence: "estimated",
    fill: "#e11d48",
    note: "Outlier CPI; excluded from median regime charts",
  },
];

export type TradeCorridor = {
  id: string;
  label: string;
  short: string;
  pp2025: number;
  sharePct: number;
  merchImport2026f: number;
  exportValueSharePct: number;
  confidence: Confidence;
  fill: string;
};

/** WTO regional merch volume-growth corridors + export $ overlay */
export const TRADE_CORRIDORS: TradeCorridor[] = [
  {
    id: "asia",
    label: "Asia",
    short: "Asia",
    pp2025: 3.2,
    sharePct: 71,
    merchImport2026f: 3.3,
    exportValueSharePct: 32.4,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    id: "europe",
    label: "Europe",
    short: "Europe",
    pp2025: 0.7,
    sharePct: 15,
    merchImport2026f: 1.2,
    exportValueSharePct: 28.2,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    id: "namerica",
    label: "North America",
    short: "N. Am.",
    pp2025: 0.5,
    sharePct: 11,
    merchImport2026f: 1.5,
    exportValueSharePct: 11.6,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "row",
    label: "Rest of world",
    short: "ROW",
    pp2025: 0.2,
    sharePct: 3,
    merchImport2026f: 2.8,
    exportValueSharePct: 27.8,
    confidence: "estimated",
    fill: "#94a3b8",
  },
];

export type PriceRegime = {
  regime: string;
  short: string;
  cpiBand: string;
  gdpSharePct: number;
  growthContribPct: number;
  regionHint: string;
  fill: string;
  confidence: Confidence;
};

/** Price-regime geography — share of world PPP GDP in each CPI band */
export const PRICE_REGIMES: PriceRegime[] = [
  {
    regime: "Near-zero / soft",
    short: "Soft",
    cpiBand: "< 1.5%",
    gdpSharePct: 22,
    growthContribPct: 34,
    regionHint: "China-led Asia",
    fill: "#10b981",
    confidence: "estimated",
  },
  {
    regime: "Target-adjacent",
    short: "Target",
    cpiBand: "1.5–3.0%",
    gdpSharePct: 28,
    growthContribPct: 18,
    regionHint: "EA / JP / KR",
    fill: "#0ea5e9",
    confidence: "estimated",
  },
  {
    regime: "Elevated",
    short: "Elevated",
    cpiBand: "3.0–6.0%",
    gdpSharePct: 38,
    growthContribPct: 28,
    regionHint: "US · IN · LatAm core",
    fill: "#f59e0b",
    confidence: "estimated",
  },
  {
    regime: "High / outlier",
    short: "High",
    cpiBand: "> 6%",
    gdpSharePct: 12,
    growthContribPct: 20,
    regionHint: "TR · select EM / SSA",
    fill: "#ef4444",
    confidence: "estimated",
  },
];

export type MeterRow = {
  id: string;
  label: string;
  metric: string;
  asia: number;
  nAmerica: number;
  europe: number;
  other: number;
  unit: string;
};

/** Side-by-side regional meters for dashboard compare panel */
export const REGION_METERS: MeterRow[] = [
  {
    id: "ppp",
    label: "PPP stock",
    metric: "ppp",
    asia: 40.2,
    nAmerica: 18.1,
    europe: 16.8,
    other: 24.9,
    unit: "% of world",
  },
  {
    id: "growth",
    label: "Growth contrib.",
    metric: "growth",
    asia: 54.1,
    nAmerica: 9.8,
    europe: 7.9,
    other: 28.2,
    unit: "% of world Δ",
  },
  {
    id: "trade",
    label: "Trade-growth",
    metric: "trade",
    asia: 71,
    nAmerica: 11,
    europe: 15,
    other: 3,
    unit: "% of vol. Δ",
  },
  {
    id: "export",
    label: "Export value",
    metric: "export",
    asia: 32.4,
    nAmerica: 11.6,
    europe: 28.2,
    other: 27.8,
    unit: "% of $26T",
  },
];

export type AsiaSplit = {
  id: string;
  label: string;
  short: string;
  growthContribPct: number;
  pppSharePct: number;
  exportSharePct: number;
  fill: string;
};

/** Asia internal geography — who drives the regional growth engine */
export const ASIA_SPLIT: AsiaSplit[] = [
  {
    id: "chn",
    label: "China",
    short: "CN",
    growthContribPct: 31.8,
    pppSharePct: 18.9,
    exportSharePct: 14.2,
    fill: "#ef4444",
  },
  {
    id: "ind",
    label: "India",
    short: "IN",
    growthContribPct: 14.6,
    pppSharePct: 8.1,
    exportSharePct: 2.1,
    fill: "#f59e0b",
  },
  {
    id: "asean",
    label: "ASEAN-5+",
    short: "ASEAN",
    growthContribPct: 5.2,
    pppSharePct: 5.8,
    exportSharePct: 5.4,
    fill: "#14b8a6",
  },
  {
    id: "jpk",
    label: "Japan + Korea",
    short: "JP+KR",
    growthContribPct: 2.2,
    pppSharePct: 5.4,
    exportSharePct: 6.2,
    fill: "#8b5cf6",
  },
  {
    id: "asia_other",
    label: "Other Asia",
    short: "Other",
    growthContribPct: 0.3,
    pppSharePct: 2.0,
    exportSharePct: 4.5,
    fill: "#94a3b8",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  return `${n.toFixed(digits)} pp`;
}

export function countryScatter(
  excludeOutliers = true,
): { x: number; y: number; z: number; name: string; fill: string; region: string }[] {
  return COUNTRY_GEO.filter((c) => !excludeOutliers || c.cpiYoy < 15).map((c) => ({
    x: c.cpiYoy,
    y: c.growthContribPct,
    z: c.pppSharePct,
    name: c.short,
    fill: c.fill,
    region: c.region,
  }));
}

export function regionMetricValue(
  row: RegionRow,
  metric: "ppp" | "growth" | "trade" | "export",
): number {
  if (metric === "ppp") return row.pppSharePct;
  if (metric === "growth") return row.growthContribPct;
  if (metric === "trade") return row.tradeGrowthSharePct;
  return row.exportSharePct;
}
