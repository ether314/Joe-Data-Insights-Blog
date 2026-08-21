/**
 * Growth, trade & prices — Q3 2026 geography lens.
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * How are economies growing, trading, and experiencing price dynamics?
 *
 * Q3 vintage complements geography-2026 by adding (1) stock–growth mismatch by
 * region, (2) Q2 hard-data growth-contribution sensitivity (China 4.3% YoY,
 * US 1.5% SAAR), (3) CPB Mar–May merchandise flow path as a trade-geography
 * overlay, (4) July CPI/PCE price-regime refresh, and (5) a vintage slope of
 * regional meters vs the prior geography print.
 *
 * Primary sources:
 * - IMF WEO April 2026 + July 2026 Update (PPP weights, GDP, CPI paths)
 * - WTO Global Trade Outlook and Statistics March 2026 (merch volume corridors)
 * - CPB World Trade Monitor May 2026 (MoM flow overlay)
 * - BEA Q2 advance, NBS China Q2, Eurostat Q2 flash, BOK Korea Q2
 * - BLS July CPI, BEA June PCE, Eurostat July HICP
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "sensitivity";

export const SOURCE_NOTE =
  "Q3 geography lens vs geography-2026. Regional PPP stock and WTO 2025 trade-growth corridors are carried (no new WEO/GTOS period census). Growth-contribution base shares carried; Q2 hard-data sensitivity restates China at 4.3% YoY and US at 1.5% SAAR as an illustrative run-rate that softens Asia’s growth share (~54%→~51%) — not a new WEO weight table. mismatchPp = growthContrib − pppShare. CPB Mar–May MoM is a flow overlay, not a re-rank of 2025 contribution shares. Price regimes refresh with BLS July CPI, Eurostat July HICP, and theme China CPI prints. Confidence tags separate disclosed hard-data meters from carried share ladders and analytical residuals.";

export const PRIOR_GEO_PATH = "/blog/macro-growth-trade-geography-2026";
export const PRIOR_RESEARCH_PATH = "/blog/macro-growth-trade-research-2026";
export const PRIOR_JULY_PATH = "/blog/macro-growth-trade-update-2026";
export const PRIOR_Q3_PATH = "/blog/macro-growth-trade-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/macro-growth-trade-update-202608";
export const PRIOR_CONC_PATH = "/blog/macro-growth-trade-concentration-2026";
export const PRIOR_CONC_Q3_PATH = "/blog/macro-growth-trade-concentration-2026q3";
export const CHINA_US_INDIA_PATH = "/blog/china-us-india-gdp-30-years";

export const HEADLINE = {
  /** Carried Asia geography anchors */
  asiaPppSharePct: 40,
  asiaGrowthContribPct: 54,
  asiaTradeGrowthSharePct: 71,
  asiaTradeGrowthPp: 3.2,
  /** Q2 sensitivity — Asia growth share softens */
  asiaGrowthSensPct: 51,
  asiaGrowthSensDeltaPp: -3,
  chinaGrowthBasePct: 32,
  chinaGrowthSensPct: 29,
  chinaGrowthSensDeltaPp: -3,
  chinaGdpQ2Yoy: 4.3,
  chinaGdpQ1Yoy: 5.0,
  usGdpQ2Saar: 1.5,
  usGdpQ1Saar: 2.1,
  indiaGdpProxy: 7.6,
  /** Largest stock–growth mismatch (Asia growth − PPP) */
  asiaMismatchPp: 13.9,
  nAmericaMismatchPp: -8.3,
  europeMismatchPp: -8.9,
  /** North America / Europe stock */
  nAmericaPppSharePct: 18,
  nAmericaGrowthContribPct: 10,
  europePppSharePct: 17,
  europeGrowthContribPct: 8,
  topRegionGrowthLabel: "Asia",
  topRegionGrowthPct: 54,
  top3RegionGrowthPct: 72,
  eastAsiaExportSharePct: 24,
  top3ExportRegionPct: 58,
  merchValueTn2025: 26.26,
  merchVolume2025: 4.6,
  worldGdpPpp2025: 3.4,
  worldGdpPpp2026: 3.0,
  worldCpi2025: 4.1,
  worldCpi2026: 4.7,
  elevatedCpiGdpSharePct: 38,
  asiaElevatedShareOfElevatedPct: 28,
  nAmericaElevatedShareOfElevatedPct: 42,
  chinaCpi2025: 0.2,
  usCpiJulYoy: 3.4,
  usPceJunYoy: 3.7,
  eaHicpJulYoy: 2.9,
  imfTradeGs2026: 3.5,
  asiaImport2026f: 3.3,
  /** CPB flow overlay */
  cpbMayMom: 1.0,
  cpbAprMom: 0.7,
  cpbMarMom: -2.1,
  cpbMarMayCum: -0.4,
  /** Price soft-growth paradox */
  softCpiGdpSharePct: 22,
  softCpiGrowthContribPct: 34,
} as const;

export type RegionRow = {
  region: string;
  short: string;
  pppSharePct: number;
  growthContribPct: number;
  growthSensPct: number;
  growthSensDeltaPp: number;
  tradeGrowthSharePct: number;
  tradeGrowthPp: number;
  exportSharePct: number;
  mismatchPp: number;
  medianCpi: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Six-region roll-up. mismatchPp = growthContrib − pppShare.
 * growthSensPct = Q2 hard-data illustrative run-rate share.
 */
export const REGION_SHARES: RegionRow[] = [
  {
    region: "Asia",
    short: "Asia",
    pppSharePct: 40.2,
    growthContribPct: 54.1,
    growthSensPct: 50.8,
    growthSensDeltaPp: -3.3,
    tradeGrowthSharePct: 71,
    tradeGrowthPp: 3.2,
    exportSharePct: 32.4,
    mismatchPp: 13.9,
    medianCpi: 1.8,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "CN soft on Q2 YoY pulls Asia growth share ~−3 pp; trade corridor still WTO-disclosed 71%",
  },
  {
    region: "North America",
    short: "N. Am.",
    pppSharePct: 18.1,
    growthContribPct: 9.8,
    growthSensPct: 8.6,
    growthSensDeltaPp: -1.2,
    tradeGrowthSharePct: 11,
    tradeGrowthPp: 0.5,
    exportSharePct: 11.6,
    mismatchPp: -8.3,
    medianCpi: 3.3,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "US 1.5% SAAR softens NA growth share; PPP stock still ~18%",
  },
  {
    region: "Europe",
    short: "Europe",
    pppSharePct: 16.8,
    growthContribPct: 7.9,
    growthSensPct: 8.4,
    growthSensDeltaPp: 0.5,
    tradeGrowthSharePct: 15,
    tradeGrowthPp: 0.7,
    exportSharePct: 28.2,
    mismatchPp: -8.9,
    medianCpi: 2.6,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "EA Q2 +0.4% QoQ lifts sens. share slightly; export $ still thick vs growth",
  },
  {
    region: "Latin America",
    short: "LatAm",
    pppSharePct: 6.4,
    growthContribPct: 4.2,
    growthSensPct: 4.4,
    growthSensDeltaPp: 0.2,
    tradeGrowthSharePct: 1.5,
    tradeGrowthPp: 0.07,
    exportSharePct: 5.1,
    mismatchPp: -2.2,
    medianCpi: 4.5,
    confidence: "estimated",
    fill: "#a855f7",
    note: "Elevated CPI vs thin trade-growth share",
  },
  {
    region: "MENA",
    short: "MENA",
    pppSharePct: 5.1,
    growthContribPct: 3.4,
    growthSensPct: 3.5,
    growthSensDeltaPp: 0.1,
    tradeGrowthSharePct: 1.2,
    tradeGrowthPp: 0.05,
    exportSharePct: 6.8,
    mismatchPp: -1.7,
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
    growthSensPct: 24.3,
    growthSensDeltaPp: 3.7,
    tradeGrowthSharePct: 0.3,
    tradeGrowthPp: 0.08,
    exportSharePct: 15.9,
    mismatchPp: 7.2,
    medianCpi: 6.1,
    confidence: "estimated",
    fill: "#94a3b8",
    note: "Residual closes Q2 sensitivity perimeter as Asia/NA soften",
  },
];

export type CountryGeo = {
  id: string;
  label: string;
  short: string;
  region: string;
  pppSharePct: number;
  growthContribPct: number;
  growthSensPct: number;
  exportSharePct: number;
  gdpPrint: number;
  gdpLabel: string;
  cpiYoy: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Country markers — Q2 GDP print on x where available; bubble = PPP share */
export const COUNTRY_GEO: CountryGeo[] = [
  {
    id: "chn",
    label: "China",
    short: "CN",
    region: "Asia",
    pppSharePct: 18.9,
    growthContribPct: 31.8,
    growthSensPct: 28.6,
    exportSharePct: 14.2,
    gdpPrint: 4.3,
    gdpLabel: "Q2 YoY %",
    cpiYoy: 0.2,
    confidence: "sensitivity",
    fill: "#ef4444",
    note: "Soft YoY vs near-zero CPI — growth engine cools, prices stay soft",
  },
  {
    id: "usa",
    label: "United States",
    short: "US",
    region: "North America",
    pppSharePct: 15.2,
    growthContribPct: 9.1,
    growthSensPct: 7.8,
    exportSharePct: 8.1,
    gdpPrint: 1.5,
    gdpLabel: "Q2 SAAR %",
    cpiYoy: 3.4,
    confidence: "sensitivity",
    fill: "#0ea5e9",
    note: "SAAR soft + elevated CPI — stock thick, growth thin",
  },
  {
    id: "ind",
    label: "India",
    short: "IN",
    region: "Asia",
    pppSharePct: 8.1,
    growthContribPct: 14.6,
    growthSensPct: 15.2,
    exportSharePct: 2.1,
    gdpPrint: 7.6,
    gdpLabel: "proxy %",
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
    growthSensPct: 1.4,
    exportSharePct: 3.3,
    gdpPrint: 1.2,
    gdpLabel: "carried %",
    cpiYoy: 2.8,
    confidence: "carried",
    fill: "#8b5cf6",
  },
  {
    id: "deu",
    label: "Germany",
    short: "DE",
    region: "Europe",
    pppSharePct: 3.3,
    growthContribPct: 0.2,
    growthSensPct: 0.3,
    exportSharePct: 6.7,
    gdpPrint: 0.2,
    gdpLabel: "carried %",
    cpiYoy: 2.4,
    confidence: "carried",
    fill: "#10b981",
  },
  {
    id: "idn",
    label: "Indonesia",
    short: "ID",
    region: "Asia",
    pppSharePct: 2.6,
    growthContribPct: 3.8,
    growthSensPct: 4.0,
    exportSharePct: 1.1,
    gdpPrint: 4.9,
    gdpLabel: "carried %",
    cpiYoy: 2.1,
    confidence: "carried",
    fill: "#14b8a6",
  },
  {
    id: "bra",
    label: "Brazil",
    short: "BR",
    region: "Latin America",
    pppSharePct: 2.4,
    growthContribPct: 1.6,
    growthSensPct: 1.7,
    exportSharePct: 1.4,
    gdpPrint: 2.3,
    gdpLabel: "carried %",
    cpiYoy: 4.8,
    confidence: "carried",
    fill: "#a855f7",
  },
  {
    id: "gbr",
    label: "United Kingdom",
    short: "UK",
    region: "Europe",
    pppSharePct: 2.3,
    growthContribPct: 0.9,
    growthSensPct: 1.0,
    exportSharePct: 2.0,
    gdpPrint: 1.1,
    gdpLabel: "carried %",
    cpiYoy: 3.1,
    confidence: "carried",
    fill: "#6366f1",
  },
  {
    id: "fra",
    label: "France",
    short: "FR",
    region: "Europe",
    pppSharePct: 2.2,
    growthContribPct: 0.7,
    growthSensPct: 0.8,
    exportSharePct: 2.4,
    gdpPrint: 0.9,
    gdpLabel: "carried %",
    cpiYoy: 2.2,
    confidence: "carried",
    fill: "#a78bfa",
  },
  {
    id: "mex",
    label: "Mexico",
    short: "MX",
    region: "North America",
    pppSharePct: 1.8,
    growthContribPct: 0.4,
    growthSensPct: 0.5,
    exportSharePct: 2.2,
    gdpPrint: 0.6,
    gdpLabel: "carried %",
    cpiYoy: 4.1,
    confidence: "carried",
    fill: "#06b6d4",
  },
  {
    id: "kor",
    label: "Korea",
    short: "KR",
    region: "Asia",
    pppSharePct: 1.7,
    growthContribPct: 0.9,
    growthSensPct: 1.1,
    exportSharePct: 2.9,
    gdpPrint: 3.7,
    gdpLabel: "Q2 YoY %",
    cpiYoy: 2.3,
    confidence: "disclosed",
    fill: "#f97316",
    note: "BOK Q2 +3.7% YoY / +0.6% QoQ",
  },
  {
    id: "tur",
    label: "Türkiye",
    short: "TR",
    region: "MENA",
    pppSharePct: 1.6,
    growthContribPct: 1.1,
    growthSensPct: 1.2,
    exportSharePct: 1.0,
    gdpPrint: 2.8,
    gdpLabel: "carried %",
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

/** CPB World Trade Monitor MoM path — flow overlay, not share re-rank */
export const CPB_FLOW_PATH = [
  { month: "Mar 2026", mom: -2.1, cumFromMar: -2.1, note: "Sharp pullback" },
  { month: "Apr 2026", mom: 0.7, cumFromMar: -1.4, note: "Partial rebound" },
  { month: "May 2026", mom: 1.0, cumFromMar: -0.4, note: "Second rebound month" },
] as const;

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

export type AsiaSplit = {
  id: string;
  label: string;
  short: string;
  growthContribPct: number;
  growthSensPct: number;
  pppSharePct: number;
  exportSharePct: number;
  fill: string;
};

export const ASIA_SPLIT: AsiaSplit[] = [
  {
    id: "chn",
    label: "China",
    short: "CN",
    growthContribPct: 31.8,
    growthSensPct: 28.6,
    pppSharePct: 18.9,
    exportSharePct: 14.2,
    fill: "#ef4444",
  },
  {
    id: "ind",
    label: "India",
    short: "IN",
    growthContribPct: 14.6,
    growthSensPct: 15.2,
    pppSharePct: 8.1,
    exportSharePct: 2.1,
    fill: "#f59e0b",
  },
  {
    id: "asean",
    label: "ASEAN-5+",
    short: "ASEAN",
    growthContribPct: 5.2,
    growthSensPct: 5.5,
    pppSharePct: 5.8,
    exportSharePct: 5.4,
    fill: "#14b8a6",
  },
  {
    id: "jpk",
    label: "Japan + Korea",
    short: "JP+KR",
    growthContribPct: 2.2,
    growthSensPct: 2.5,
    pppSharePct: 5.4,
    exportSharePct: 6.2,
    fill: "#8b5cf6",
  },
  {
    id: "asia_other",
    label: "Other Asia",
    short: "Other",
    growthContribPct: 0.3,
    growthSensPct: 0.4,
    pppSharePct: 2.0,
    exportSharePct: 4.5,
    fill: "#94a3b8",
  },
];

export type MeterCompare = {
  id: string;
  label: string;
  asia: number;
  nAmerica: number;
  europe: number;
  other: number;
  unit: string;
  note?: string;
};

export const METER_COMPARE: MeterCompare[] = [
  {
    id: "ppp",
    label: "PPP stock",
    asia: 40.2,
    nAmerica: 18.1,
    europe: 16.8,
    other: 24.9,
    unit: "% of world",
  },
  {
    id: "growth",
    label: "Growth (base)",
    asia: 54.1,
    nAmerica: 9.8,
    europe: 7.9,
    other: 28.2,
    unit: "% of world Δ",
  },
  {
    id: "growthSens",
    label: "Growth (Q2 sens.)",
    asia: 50.8,
    nAmerica: 8.6,
    europe: 8.4,
    other: 32.2,
    unit: "% of world Δ",
    note: "Illustrative Q2 run-rate",
  },
  {
    id: "trade",
    label: "Trade-growth",
    asia: 71,
    nAmerica: 11,
    europe: 15,
    other: 3,
    unit: "% of vol. Δ",
  },
  {
    id: "export",
    label: "Export value",
    asia: 32.4,
    nAmerica: 11.6,
    europe: 28.2,
    other: 27.8,
    unit: "% of $26T",
  },
];

export type VintageSlope = {
  vintage: string;
  asiaGrowthPct: number;
  asiaTradePct: number;
  asiaPppPct: number;
  nAmericaMismatchPp: number;
  softCpiGrowthPct: number;
};

/** Prior geography print → Q3 sensitivity vintage */
export const VINTAGE_SLOPE: VintageSlope[] = [
  {
    vintage: "Geo 2026",
    asiaGrowthPct: 54.1,
    asiaTradePct: 71,
    asiaPppPct: 40.2,
    nAmericaMismatchPp: -8.3,
    softCpiGrowthPct: 34,
  },
  {
    vintage: "Q3 sens.",
    asiaGrowthPct: 50.8,
    asiaTradePct: 71,
    asiaPppPct: 40.2,
    nAmericaMismatchPp: -9.5,
    softCpiGrowthPct: 34,
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function mismatchBars(): { region: string; short: string; mismatchPp: number; fill: string }[] {
  return REGION_SHARES.map((r) => ({
    region: r.region,
    short: r.short,
    mismatchPp: r.mismatchPp,
    fill: r.fill,
  }));
}

export function countryScatter(
  excludeOutliers = true,
): {
  x: number;
  y: number;
  z: number;
  name: string;
  fill: string;
  region: string;
  cpi: number;
}[] {
  return COUNTRY_GEO.filter((c) => !excludeOutliers || c.cpiYoy < 15).map((c) => ({
    x: c.gdpPrint,
    y: c.growthSensPct,
    z: c.pppSharePct,
    name: c.short,
    fill: c.fill,
    region: c.region,
    cpi: c.cpiYoy,
  }));
}

export function regionMetricValue(
  row: RegionRow,
  metric: "ppp" | "growth" | "growthSens" | "trade" | "export" | "mismatch",
): number {
  if (metric === "ppp") return row.pppSharePct;
  if (metric === "growth") return row.growthContribPct;
  if (metric === "growthSens") return row.growthSensPct;
  if (metric === "trade") return row.tradeGrowthSharePct;
  if (metric === "mismatch") return row.mismatchPp;
  return row.exportSharePct;
}
