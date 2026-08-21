/**
 * Growth, trade & prices — Q3 2026 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (How are economies growing, trading, and experiencing price dynamics?)
 *
 * Vintage delta vs macro-growth-trade-concentration-2026:
 * 1. PPP stock & export-value Top-1/Top-3 — carried (no new WEO/GTOS period print)
 * 2. Growth-contribution sensitivity — Q2 hard-data run-rate (China 4.3% YoY, US 1.5% SAAR)
 * 3. Trade-growth regional shares — carried WTO 2025; CPB May rebound as flow overlay
 * 4. Price burden — Aug CPI/PCE vintage (US 3.4% YoY, EA 2.9%, China ~0.2%)
 *
 * Primary sources: IMF WEO Apr/Jul 2026, WTO GTOS Mar 2026, CPB WTM May,
 * BEA Q2 advance, NBS/Eurostat/BOK Q2, BLS July CPI, BEA June PCE, Eurostat July HICP.
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "restated";

export const SOURCE_NOTE =
  "Q3 concentration lens vs concentration-2026. PPP GDP stock and goods-export value Top-1/Top-3 carried from IMF WEO April 2026 PPP weights and WTO 2025 merchandise export values (no new period census). Growth-contribution base ladder carried (~China 32% / Top-3 55%); Q2 hard-data sensitivity restates China at 4.3% YoY and US at 1.5% SAAR as an illustrative run-rate — not a new WEO weight table. Merchandise trade-growth regional shares carried from WTO GTOS March 2026 (Asia 3.2 pp / 71%); CPB May +1.0% MoM is a flow overlay, not a re-rank of 2025 contribution shares. Price ladder uses BLS July CPI, Eurostat July HICP, and theme China CPI prints. Confidence tags separate disclosed hard-data meters from carried share ladders and analytical residuals.";

export const SOURCES = [
  { label: "Prior concentration print (2026)", url: "/blog/macro-growth-trade-concentration-2026" },
  { label: "Q3 hard-data check", url: "/blog/macro-growth-trade-update-2026q3" },
  { label: "August CPI/PCE vintage", url: "/blog/macro-growth-trade-update-202608" },
  { label: "July IMF WEO Update", url: "/blog/macro-growth-trade-update-2026" },
  { label: "April research triangle", url: "/blog/macro-growth-trade-research-2026" },
  { label: "China–US–India GDP (30 years)", url: "/blog/china-us-india-gdp-30-years" },
] as const;

export const PRIOR_CONCENTRATION_PATH = "/blog/macro-growth-trade-concentration-2026";
export const PRIOR_RESEARCH_PATH = "/blog/macro-growth-trade-research-2026";
export const PRIOR_JULY_PATH = "/blog/macro-growth-trade-update-2026";
export const PRIOR_Q3_PATH = "/blog/macro-growth-trade-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/macro-growth-trade-update-202608";
export const CHINA_US_INDIA_PATH = "/blog/china-us-india-gdp-30-years";

export const HEADLINE = {
  top1PppSharePct: 19,
  top1PppLabel: "China",
  top3PppSharePct: 42,
  top3PppLabel: "China · US · India",
  top5PppSharePct: 53,
  pppHhi: 780,
  priorTop1PppSharePct: 19,
  priorTop3PppSharePct: 42,
  top1GrowthContribPct: 32,
  top1GrowthContribLabel: "China",
  top3GrowthContribPct: 55,
  top3GrowthContribLabel: "China · India · US",
  q2SensTop1GrowthPct: 29,
  q2SensTop3GrowthPct: 52,
  q2SensTop1DeltaPp: -3,
  q2SensTop3DeltaPp: -3,
  chinaGdpQ2Yoy: 4.3,
  chinaGdpQ1Yoy: 5.0,
  usGdpQ2Saar: 1.5,
  usGdpQ1Saar: 2.1,
  indiaGdpProxy: 7.6,
  top1TradeGrowthSharePct: 71,
  top1TradeGrowthLabel: "Asia",
  top1TradeGrowthPp: 3.2,
  top3TradeGrowthSharePct: 97,
  merchVolume2025: 4.6,
  merchValueTn2025: 26.26,
  cpbMayMom: 1.0,
  cpbAprMom: 0.7,
  cpbMarMom: -2.1,
  cpbMarMayCum: -0.4,
  imfTradeGs2026: 3.5,
  asiaImport2026f: 3.3,
  top1ExportSharePct: 14,
  top1ExportLabel: "China",
  top3ExportSharePct: 29,
  top3ExportLabel: "China · US · Germany",
  servicesValueTn2025: 9.56,
  worldCpi2025: 4.1,
  worldCpi2026: 4.7,
  usCpiJulYoy: 3.4,
  usPceJunYoy: 3.7,
  usPceQ2Saar: 5.1,
  eaHicpJulYoy: 2.9,
  chinaCpi2025: 0.2,
  elevatedCpiGdpSharePct: 38,
  priceTop1PppSharePct: 19,
  priceTop1Label: "China (near-zero CPI)",
  usPppSharePct: 15,
  worldGdpPpp2025: 3.4,
  worldGdpPpp2026Jul: 3.0,
  imfUsGdp2026: 2.3,
  imfUsCpi2026: 3.6,
  oilJulAssumption: 89.27,
} as const;

export type PerimeterId = "ppp" | "growth" | "trade" | "exports" | "prices";

export type ScoreboardRow = {
  id: PerimeterId;
  label: string;
  top1Pct: number;
  top1Label: string;
  top3Pct: number;
  top3Labels: string;
  priorTop1Pct: number;
  priorTop3Pct: number;
  deltaTop1Pp: number;
  extraMetric: string;
  extraValue: string;
  color: string;
  confidence: Confidence;
  note: string;
};

export const SCOREBOARD: ScoreboardRow[] = [
  {
    id: "ppp",
    label: "PPP GDP stock",
    top1Pct: HEADLINE.top1PppSharePct,
    top1Label: HEADLINE.top1PppLabel,
    top3Pct: HEADLINE.top3PppSharePct,
    top3Labels: HEADLINE.top3PppLabel,
    priorTop1Pct: HEADLINE.priorTop1PppSharePct,
    priorTop3Pct: HEADLINE.priorTop3PppSharePct,
    deltaTop1Pp: 0,
    extraMetric: "Top-5 / HHI",
    extraValue: `${HEADLINE.top5PppSharePct}% · ${HEADLINE.pppHhi}`,
    color: "#ef4444",
    confidence: "carried",
    note: "No new WEO PPP census — stock ladder unchanged",
  },
  {
    id: "growth",
    label: "Growth contribution",
    top1Pct: HEADLINE.top1GrowthContribPct,
    top1Label: HEADLINE.top1GrowthContribLabel,
    top3Pct: HEADLINE.top3GrowthContribPct,
    top3Labels: HEADLINE.top3GrowthContribLabel,
    priorTop1Pct: 32,
    priorTop3Pct: 55,
    deltaTop1Pp: 0,
    extraMetric: "Q2 sens. Top-1",
    extraValue: `${HEADLINE.q2SensTop1GrowthPct}% (${HEADLINE.q2SensTop1DeltaPp} pp)`,
    color: "#f59e0b",
    confidence: "carried",
    note: "Base ladder carried; Q2 run-rate is sensitivity only",
  },
  {
    id: "trade",
    label: "Trade-growth contrib.",
    top1Pct: HEADLINE.top1TradeGrowthSharePct,
    top1Label: HEADLINE.top1TradeGrowthLabel,
    top3Pct: HEADLINE.top3TradeGrowthSharePct,
    top3Labels: "Asia · Europe · N. America",
    priorTop1Pct: 71,
    priorTop3Pct: 97,
    deltaTop1Pp: 0,
    extraMetric: "CPB May MoM",
    extraValue: `+${HEADLINE.cpbMayMom}%`,
    color: "#0ea5e9",
    confidence: "disclosed",
    note: "WTO 2025 regional shares carried; CPB is flow overlay",
  },
  {
    id: "exports",
    label: "Export value share",
    top1Pct: HEADLINE.top1ExportSharePct,
    top1Label: HEADLINE.top1ExportLabel,
    top3Pct: HEADLINE.top3ExportSharePct,
    top3Labels: HEADLINE.top3ExportLabel,
    priorTop1Pct: 14,
    priorTop3Pct: 29,
    deltaTop1Pp: 0,
    extraMetric: "World merch $Tn",
    extraValue: `$${HEADLINE.merchValueTn2025}T`,
    color: "#10b981",
    confidence: "carried",
    note: "WTO 2025 export-value shares — no new GTOS vintage",
  },
  {
    id: "prices",
    label: "Price burden geometry",
    top1Pct: HEADLINE.usPppSharePct,
    top1Label: "US (elevated CPI weight)",
    top3Pct: HEADLINE.elevatedCpiGdpSharePct,
    top3Labels: "Elevated-CPI GDP share",
    priorTop1Pct: 15,
    priorTop3Pct: 38,
    deltaTop1Pp: 0,
    extraMetric: "US CPI / PCE",
    extraValue: `${HEADLINE.usCpiJulYoy}% / ${HEADLINE.usPceJunYoy}%`,
    color: "#8b5cf6",
    confidence: "disclosed",
    note: "Aug vintage YoY; not an additive market-share portfolio",
  },
];

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

export const PPP_STOCK_SHARES: ShareRow[] = [
  { rank: 1, id: "chn", label: "China", short: "CN", sharePct: 18.9, cumulativeSharePct: 18.9, secondary: 5.0, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#ef4444", note: "Largest PPP weight; soft domestic CPI" },
  { rank: 2, id: "usa", label: "United States", short: "US", sharePct: 15.2, cumulativeSharePct: 34.1, secondary: 2.1, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#0ea5e9" },
  { rank: 3, id: "ind", label: "India", short: "IN", sharePct: 8.1, cumulativeSharePct: 42.2, secondary: 7.6, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#f59e0b" },
  { rank: 4, id: "jpn", label: "Japan", short: "JP", sharePct: 3.7, cumulativeSharePct: 45.9, secondary: 1.2, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#8b5cf6" },
  { rank: 5, id: "deu", label: "Germany", short: "DE", sharePct: 3.3, cumulativeSharePct: 49.2, secondary: 0.2, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#10b981" },
  { rank: 6, id: "rus", label: "Russia", short: "RU", sharePct: 2.9, cumulativeSharePct: 52.1, secondary: 1.5, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#64748b" },
  { rank: 7, id: "idn", label: "Indonesia", short: "ID", sharePct: 2.6, cumulativeSharePct: 54.7, secondary: 4.9, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#14b8a6" },
  { rank: 8, id: "bra", label: "Brazil", short: "BR", sharePct: 2.4, cumulativeSharePct: 57.1, secondary: 2.3, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#a855f7" },
  { rank: 9, id: "residual", label: "All other economies", short: "ROW", sharePct: 42.9, cumulativeSharePct: 100, secondary: 2.6, secondaryLabel: "implied GDP %", confidence: "estimated", fill: "#94a3b8", note: "Analytical residual closing the PPP perimeter" },
];

export const GROWTH_CONTRIB_SHARES: ShareRow[] = [
  { rank: 1, id: "chn", label: "China", short: "CN", sharePct: 31.8, cumulativeSharePct: 31.8, secondary: 5.0, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#ef4444", note: "~1/3 of world PPP growth from one economy" },
  { rank: 2, id: "ind", label: "India", short: "IN", sharePct: 14.6, cumulativeSharePct: 46.4, secondary: 7.6, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#f59e0b" },
  { rank: 3, id: "usa", label: "United States", short: "US", sharePct: 9.1, cumulativeSharePct: 55.5, secondary: 2.1, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#0ea5e9" },
  { rank: 4, id: "idn", label: "Indonesia", short: "ID", sharePct: 3.8, cumulativeSharePct: 59.3, secondary: 4.9, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#14b8a6" },
  { rank: 5, id: "bra", label: "Brazil", short: "BR", sharePct: 1.6, cumulativeSharePct: 60.9, secondary: 2.3, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#a855f7" },
  { rank: 6, id: "jpn", label: "Japan", short: "JP", sharePct: 1.3, cumulativeSharePct: 62.2, secondary: 1.2, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#8b5cf6" },
  { rank: 7, id: "mex", label: "Mexico", short: "MX", sharePct: 0.4, cumulativeSharePct: 62.6, secondary: 0.6, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#06b6d4" },
  { rank: 8, id: "eur", label: "Euro area (agg.)", short: "EA", sharePct: 5.8, cumulativeSharePct: 68.4, secondary: 1.4, secondaryLabel: "GDP 2025 %", confidence: "carried", fill: "#6366f1", note: "Aggregated EA contribution; not a single sovereign" },
  { rank: 9, id: "residual", label: "All other economies", short: "ROW", sharePct: 31.6, cumulativeSharePct: 100, secondary: 2.8, secondaryLabel: "implied GDP %", confidence: "estimated", fill: "#94a3b8" },
];

export const GROWTH_CONTRIB_Q2_SENS: ShareRow[] = [
  { rank: 1, id: "chn", label: "China", short: "CN", sharePct: 28.6, cumulativeSharePct: 28.6, secondary: 4.3, secondaryLabel: "Q2 YoY %", confidence: "restated", fill: "#ef4444", note: "Q2 4.3% YoY vs 5.0% annual weight in base ladder" },
  { rank: 2, id: "ind", label: "India", short: "IN", sharePct: 15.2, cumulativeSharePct: 43.8, secondary: 7.6, secondaryLabel: "GDP proxy %", confidence: "estimated", fill: "#f59e0b" },
  { rank: 3, id: "usa", label: "United States", short: "US", sharePct: 7.8, cumulativeSharePct: 51.6, secondary: 1.5, secondaryLabel: "Q2 SAAR %", confidence: "restated", fill: "#0ea5e9", note: "1.5% SAAR vs 2.1% 2025 weight — softer US impulse" },
  { rank: 4, id: "idn", label: "Indonesia", short: "ID", sharePct: 4.0, cumulativeSharePct: 55.6, secondary: 4.9, secondaryLabel: "GDP 2025 %", confidence: "estimated", fill: "#14b8a6" },
  { rank: 5, id: "eur", label: "Euro area (agg.)", short: "EA", sharePct: 6.2, cumulativeSharePct: 61.8, secondary: 1.6, secondaryLabel: "Q2 ann. %", confidence: "estimated", fill: "#6366f1", note: "EA Q2 +0.4% QoQ ≈ ~1.6% annualised" },
  { rank: 6, id: "bra", label: "Brazil", short: "BR", sharePct: 1.7, cumulativeSharePct: 63.5, secondary: 2.3, secondaryLabel: "GDP 2025 %", confidence: "estimated", fill: "#a855f7" },
  { rank: 7, id: "jpn", label: "Japan", short: "JP", sharePct: 1.4, cumulativeSharePct: 64.9, secondary: 1.2, secondaryLabel: "GDP 2025 %", confidence: "estimated", fill: "#8b5cf6" },
  { rank: 8, id: "kor", label: "Korea", short: "KR", sharePct: 0.9, cumulativeSharePct: 65.8, secondary: 3.7, secondaryLabel: "Q2 YoY %", confidence: "disclosed", fill: "#06b6d4", note: "BOK Q2 +3.7% YoY hard print" },
  { rank: 9, id: "residual", label: "All other economies", short: "ROW", sharePct: 34.2, cumulativeSharePct: 100, secondary: 2.9, secondaryLabel: "implied %", confidence: "estimated", fill: "#94a3b8" },
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

export const TRADE_GROWTH_SHARES: RegionTradeShare[] = [
  { rank: 1, id: "asia", label: "Asia", short: "Asia", pp2025: 3.2, sharePct: 71, cumulativeSharePct: 71, merchImport2026f: 3.3, confidence: "disclosed", fill: "#f59e0b" },
  { rank: 2, id: "europe", label: "Europe", short: "Europe", pp2025: 0.7, sharePct: 15, cumulativeSharePct: 86, merchImport2026f: 1.2, confidence: "estimated", fill: "#8b5cf6" },
  { rank: 3, id: "namerica", label: "North America", short: "N. Am.", pp2025: 0.5, sharePct: 11, cumulativeSharePct: 97, merchImport2026f: 1.5, confidence: "estimated", fill: "#0ea5e9" },
  { rank: 4, id: "row", label: "Rest of world", short: "ROW", pp2025: 0.2, sharePct: 4, cumulativeSharePct: 100, merchImport2026f: 2.8, confidence: "estimated", fill: "#94a3b8" },
];

export const EXPORT_VALUE_SHARES: ShareRow[] = [
  { rank: 1, id: "chn", label: "China", short: "CN", sharePct: 14.2, cumulativeSharePct: 14.2, secondary: 9.2, secondaryLabel: "export vol. 2025 %", confidence: "carried", fill: "#ef4444" },
  { rank: 2, id: "usa", label: "United States", short: "US", sharePct: 8.1, cumulativeSharePct: 22.3, secondary: 2.4, secondaryLabel: "export vol. 2025 %", confidence: "carried", fill: "#0ea5e9" },
  { rank: 3, id: "deu", label: "Germany", short: "DE", sharePct: 6.7, cumulativeSharePct: 29.0, secondary: 0.8, secondaryLabel: "export vol. 2025 %", confidence: "carried", fill: "#10b981" },
  { rank: 4, id: "nld", label: "Netherlands", short: "NL", sharePct: 3.6, cumulativeSharePct: 32.6, secondary: 1.1, secondaryLabel: "export vol. 2025 %", confidence: "carried", fill: "#f59e0b", note: "Re-export hub inflates value share" },
  { rank: 5, id: "jpn", label: "Japan", short: "JP", sharePct: 3.3, cumulativeSharePct: 35.9, secondary: 1.5, secondaryLabel: "export vol. 2025 %", confidence: "carried", fill: "#8b5cf6" },
  { rank: 6, id: "kor", label: "Korea", short: "KR", sharePct: 2.9, cumulativeSharePct: 38.8, secondary: 4.1, secondaryLabel: "export vol. 2025 %", confidence: "carried", fill: "#14b8a6" },
  { rank: 7, id: "ita", label: "Italy", short: "IT", sharePct: 2.6, cumulativeSharePct: 41.4, secondary: 0.6, secondaryLabel: "export vol. 2025 %", confidence: "carried", fill: "#a855f7" },
  { rank: 8, id: "fra", label: "France", short: "FR", sharePct: 2.4, cumulativeSharePct: 43.8, secondary: 0.9, secondaryLabel: "export vol. 2025 %", confidence: "carried", fill: "#6366f1" },
  { rank: 9, id: "residual", label: "All other exporters", short: "ROW", sharePct: 56.2, cumulativeSharePct: 100, secondary: 3.8, secondaryLabel: "implied vol. %", confidence: "estimated", fill: "#94a3b8" },
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

export const PRICE_LADDER: PriceRow[] = [
  { rank: 1, id: "bra", label: "Brazil", short: "BR", cpiYoy: 4.8, gdp2025: 2.3, pppSharePct: 2.4, confidence: "estimated", fill: "#a855f7" },
  { rank: 2, id: "ind", label: "India", short: "IN", cpiYoy: 4.6, gdp2025: 7.6, pppSharePct: 8.1, confidence: "estimated", fill: "#f59e0b" },
  { rank: 3, id: "zaf", label: "South Africa", short: "ZA", cpiYoy: 4.4, gdp2025: 1.1, pppSharePct: 0.6, confidence: "estimated", fill: "#14b8a6" },
  { rank: 4, id: "mex", label: "Mexico", short: "MX", cpiYoy: 4.0, gdp2025: 0.6, pppSharePct: 1.8, confidence: "estimated", fill: "#06b6d4" },
  { rank: 5, id: "usa", label: "United States", short: "US", cpiYoy: 3.4, gdp2025: 2.1, pppSharePct: 15.2, confidence: "disclosed", fill: "#0ea5e9", note: "BLS July 2026 CPI YoY; June PCE 3.7% YoY" },
  { rank: 6, id: "gbr", label: "United Kingdom", short: "UK", cpiYoy: 3.4, gdp2025: 1.3, pppSharePct: 2.2, confidence: "estimated", fill: "#6366f1" },
  { rank: 7, id: "jpn", label: "Japan", short: "JP", cpiYoy: 2.9, gdp2025: 1.2, pppSharePct: 3.7, confidence: "disclosed", fill: "#8b5cf6" },
  { rank: 8, id: "eur", label: "Euro area", short: "EA", cpiYoy: 2.9, gdp2025: 1.4, pppSharePct: 11.0, confidence: "disclosed", fill: "#64748b", note: "Eurostat July HICP YoY" },
  { rank: 9, id: "chn", label: "China", short: "CN", cpiYoy: 0.2, gdp2025: 5.0, pppSharePct: 18.9, confidence: "estimated", fill: "#ef4444", note: "Near-zero CPI while leading growth contribution" },
];

export type VintageDelta = {
  id: string;
  label: string;
  priorPct: number;
  q3Pct: number;
  deltaPp: number;
  unit: string;
  fill: string;
  note: string;
};

export const VINTAGE_DELTAS: VintageDelta[] = [
  { id: "ppp-top1", label: "PPP Top-1 (China)", priorPct: 19, q3Pct: 19, deltaPp: 0, unit: "% stock", fill: "#ef4444", note: "Carried — no new PPP census" },
  { id: "growth-top1", label: "Growth Top-1 base", priorPct: 32, q3Pct: 32, deltaPp: 0, unit: "% contrib", fill: "#f59e0b", note: "Base ladder unchanged" },
  { id: "growth-q2", label: "Growth Top-1 Q2 sens.", priorPct: 32, q3Pct: 29, deltaPp: -3, unit: "% contrib", fill: "#f97316", note: "China Q2 slowdown sensitivity" },
  { id: "trade-top1", label: "Trade-growth Top-1", priorPct: 71, q3Pct: 71, deltaPp: 0, unit: "% vol growth", fill: "#0ea5e9", note: "WTO Asia share carried" },
  { id: "export-top3", label: "Export Top-3", priorPct: 29, q3Pct: 29, deltaPp: 0, unit: "% value", fill: "#10b981", note: "CN·US·DE carried" },
  { id: "elevated-cpi", label: "Elevated-CPI GDP share", priorPct: 38, q3Pct: 38, deltaPp: 0, unit: "% PPP", fill: "#8b5cf6", note: "Aug prints refresh levels, not share perimeter" },
];

export type HardDataMeter = {
  id: string;
  label: string;
  julyPath: number;
  hardSignal: number;
  unit: string;
  signalLabel: string;
  tilt: "hotter" | "cooler" | "firmer" | "softer" | "aligned";
  fill: string;
};

export const HARD_DATA_METERS: HardDataMeter[] = [
  { id: "trade", label: "World trade (CPB)", julyPath: 3.5, hardSignal: 1.0, unit: "%", signalLabel: "May MoM", tilt: "firmer", fill: "#0ea5e9" },
  { id: "us-gdp", label: "US growth", julyPath: 2.3, hardSignal: 1.5, unit: "%", signalLabel: "Q2 SAAR", tilt: "softer", fill: "#64748b" },
  { id: "china-gdp", label: "China growth", julyPath: 4.6, hardSignal: 4.3, unit: "%", signalLabel: "Q2 YoY", tilt: "softer", fill: "#ef4444" },
  { id: "us-cpi", label: "US CPI YoY", julyPath: 3.6, hardSignal: 3.4, unit: "%", signalLabel: "July print", tilt: "cooler", fill: "#8b5cf6" },
  { id: "us-pce-saar", label: "US PCE SAAR", julyPath: 3.6, hardSignal: 5.1, unit: "%", signalLabel: "Q2 SAAR", tilt: "hotter", fill: "#a855f7" },
];

export type CpbPoint = { month: string; mom: number; label: string };

export const CPB_PATH: CpbPoint[] = [
  { month: "Mar", mom: -2.1, label: "Mar −2.1%" },
  { month: "Apr", mom: 0.7, label: "Apr +0.7%" },
  { month: "May", mom: 1.0, label: "May +1.0%" },
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
  { id: "ppp", label: "PPP GDP stock", top1Pct: 19, top3Pct: 42, top1Name: "China", unit: "% of world PPP", fill: "#ef4444" },
  { id: "growth", label: "Growth contribution", top1Pct: 32, top3Pct: 55, top1Name: "China", unit: "% of world PPP growth", fill: "#f59e0b" },
  { id: "growth-q2", label: "Growth (Q2 sens.)", top1Pct: 29, top3Pct: 52, top1Name: "China", unit: "% run-rate contrib", fill: "#f97316" },
  { id: "trade", label: "Trade-growth contrib.", top1Pct: 71, top3Pct: 97, top1Name: "Asia", unit: "% of merch vol. growth", fill: "#0ea5e9" },
  { id: "exports", label: "Export value share", top1Pct: 14, top3Pct: 29, top1Name: "China", unit: "% of merch exports", fill: "#10b981" },
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
export const GROWTH_Q2_CONCENTRATION_CURVE = buildCurve(GROWTH_CONTRIB_Q2_SENS, 40);
export const TRADE_CONCENTRATION_CURVE = buildCurve(
  TRADE_GROWTH_SHARES.map((r) => ({ short: r.short, cumulativeSharePct: r.cumulativeSharePct })),
  4,
);
export const EXPORT_CONCENTRATION_CURVE = buildCurve(EXPORT_VALUE_SHARES, 50);

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
  { year: 2026, label: "2026f Jul", worldGdp: 3.0, merchVolume: 3.5, worldCpi: 4.7, isForecast: true },
];

export function namedShares(rows: ShareRow[]): ShareRow[] {
  return rows.filter((r) => r.id !== "residual");
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtTn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}T`;
}
