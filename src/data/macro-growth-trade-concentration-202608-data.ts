/**
 * Growth, trade & prices — August 2026 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * (How are economies growing, trading, and experiencing price dynamics?)
 *
 * Vintage delta vs macro-growth-trade-concentration-2026q3:
 * 1. PPP stock & export-value Top-1/Top-3 — carried (no new WEO/GTOS period print)
 * 2. Growth-contribution base + Q2 sensitivity — carried (China 4.3% YoY, US 1.5% SAAR)
 * 3. Trade-growth regional shares — carried WTO 2025; CPB June WTM still pending (25 Aug)
 * 4. Price burden — August CPI/PCE vintage refresh (US CPI 3.4% / PCE 3.7%; EA 2.9%)
 *
 * Primary sources: IMF WEO Apr/Jul 2026, WTO GTOS Mar 2026, CPB WTM May (held),
 * BEA Q2 advance (held pending 26 Aug second estimate), BLS July CPI, BEA June PCE,
 * Eurostat July HICP, NBS/theme China CPI.
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "restated" | "pending";

export const SOURCE_NOTE =
  "Aug 202608 concentration lens vs concentration-2026q3. PPP GDP stock and goods-export value Top-1/Top-3 carried from IMF WEO April 2026 PPP weights and WTO 2025 merchandise export values. Growth-contribution base ladder (~China 32% / Top-3 55%) and Q2 hard-data sensitivity (China 4.3% YoY, US 1.5% SAAR → Top-1 ~29%) carried — not a new WEO weight table. Merchandise trade-growth regional shares carried from WTO GTOS March 2026 (Asia 3.2 pp / 71%); CPB June WTM due 25 Aug remains pending, so May +1.0% MoM stays the last disclosed flow overlay. Price ladder refreshes BLS July CPI (3.4% YoY), BEA June PCE (3.7% YoY), Eurostat July HICP (2.9%), and theme China CPI (~0.2%). Confidence tags separate disclosed Aug price meters from carried share ladders, Q2 restatements, and pending CPB/GDP second-estimate rows.";

export const SOURCES = [
  { label: "Q3 concentration lens", url: "/blog/macro-growth-trade-concentration-2026q3" },
  { label: "Prior concentration print (2026)", url: "/blog/macro-growth-trade-concentration-2026" },
  { label: "August CPI/PCE vintage", url: "/blog/macro-growth-trade-update-202608" },
  { label: "Q3 hard-data check", url: "/blog/macro-growth-trade-update-2026q3" },
  { label: "July IMF WEO Update", url: "/blog/macro-growth-trade-update-2026" },
  { label: "April research triangle", url: "/blog/macro-growth-trade-research-2026" },
  { label: "China–US–India GDP (30 years)", url: "/blog/china-us-india-gdp-30-years" },
] as const;

export const PRIOR_Q3_CONC_PATH = "/blog/macro-growth-trade-concentration-2026q3";
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
  cpbJuneStatus: "pending",
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
  usCpiJunYoy: 3.5,
  usCpiDeltaPp: -0.1,
  usPceJunYoy: 3.7,
  usPceMayYoy: 4.1,
  usPceDeltaPp: -0.4,
  usPceQ2Saar: 5.1,
  saarVsYoySpreadPp: 1.4,
  eaHicpJulYoy: 2.9,
  eaHicpJunYoy: 2.8,
  eaHicpDeltaPp: 0.1,
  chinaCpi2025: 0.2,
  elevatedCpiGdpSharePct: 38,
  elevatedCpiThreshold: 3.4,
  priceTop1PppSharePct: 19,
  priceTop1Label: "China (near-zero CPI)",
  usPppSharePct: 15,
  worldGdpPpp2025: 3.4,
  worldGdpPpp2026Jul: 3.0,
  imfUsGdp2026: 2.3,
  imfUsCpi2026: 3.6,
  cpiVsImfGapPp: -0.2,
  oilJulAssumption: 89.27,
  /** Scoreboard: carried share architecture vs Aug price-meter refresh */
  shareArchitectureUnchanged: true,
  priceMetersUpdated: true,
  pendingFlowMeters: 2,
} as const;

export type PerimeterId = "ppp" | "growth" | "trade" | "exports" | "prices";

export type ScoreboardRow = {
  id: PerimeterId;
  label: string;
  top1Pct: number;
  top1Label: string;
  top3Pct: number;
  top3Labels: string;
  q3Top1Pct: number;
  q3Top3Pct: number;
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
    q3Top1Pct: 19,
    q3Top3Pct: 42,
    deltaTop1Pp: 0,
    extraMetric: "Top-5 / HHI",
    extraValue: `${HEADLINE.top5PppSharePct}% · ${HEADLINE.pppHhi}`,
    color: "#ef4444",
    confidence: "carried",
    note: "No new WEO PPP census — stock ladder unchanged vs Q3",
  },
  {
    id: "growth",
    label: "Growth contribution",
    top1Pct: HEADLINE.top1GrowthContribPct,
    top1Label: HEADLINE.top1GrowthContribLabel,
    top3Pct: HEADLINE.top3GrowthContribPct,
    top3Labels: HEADLINE.top3GrowthContribLabel,
    q3Top1Pct: 32,
    q3Top3Pct: 55,
    deltaTop1Pp: 0,
    extraMetric: "Q2 sens. Top-1",
    extraValue: `${HEADLINE.q2SensTop1GrowthPct}% (${HEADLINE.q2SensTop1DeltaPp} pp)`,
    color: "#f59e0b",
    confidence: "carried",
    note: "Base + Q2 sensitivity carried; GDP second estimate pending 26 Aug",
  },
  {
    id: "trade",
    label: "Trade-growth contrib.",
    top1Pct: HEADLINE.top1TradeGrowthSharePct,
    top1Label: HEADLINE.top1TradeGrowthLabel,
    top3Pct: HEADLINE.top3TradeGrowthSharePct,
    top3Labels: "Asia · Europe · N. America",
    q3Top1Pct: 71,
    q3Top3Pct: 97,
    deltaTop1Pp: 0,
    extraMetric: "CPB June",
    extraValue: "pending 25 Aug",
    color: "#0ea5e9",
    confidence: "pending",
    note: "WTO 2025 Asia 71% carried; May +1.0% MoM last disclosed flow",
  },
  {
    id: "exports",
    label: "Export value share",
    top1Pct: HEADLINE.top1ExportSharePct,
    top1Label: HEADLINE.top1ExportLabel,
    top3Pct: HEADLINE.top3ExportSharePct,
    top3Labels: HEADLINE.top3ExportLabel,
    q3Top1Pct: 14,
    q3Top3Pct: 29,
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
    q3Top1Pct: 15,
    q3Top3Pct: 38,
    deltaTop1Pp: 0,
    extraMetric: "US CPI / PCE",
    extraValue: `${HEADLINE.usCpiJulYoy}% / ${HEADLINE.usPceJunYoy}%`,
    color: "#8b5cf6",
    confidence: "disclosed",
    note: "Aug vintage refreshes YoY meters; share perimeter still ~38%",
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
  { rank: 5, id: "usa", label: "United States", short: "US", cpiYoy: 3.4, gdp2025: 2.1, pppSharePct: 15.2, confidence: "disclosed", fill: "#0ea5e9", note: "BLS July 2026 CPI YoY (−0.1 pp vs Jun); June PCE 3.7% YoY" },
  { rank: 6, id: "gbr", label: "United Kingdom", short: "UK", cpiYoy: 3.4, gdp2025: 1.3, pppSharePct: 2.2, confidence: "estimated", fill: "#6366f1" },
  { rank: 7, id: "jpn", label: "Japan", short: "JP", cpiYoy: 2.9, gdp2025: 1.2, pppSharePct: 3.7, confidence: "disclosed", fill: "#8b5cf6" },
  { rank: 8, id: "eur", label: "Euro area", short: "EA", cpiYoy: 2.9, gdp2025: 1.4, pppSharePct: 11.0, confidence: "disclosed", fill: "#64748b", note: "Eurostat July HICP YoY (+0.1 pp vs Jun)" },
  { rank: 9, id: "chn", label: "China", short: "CN", cpiYoy: 0.2, gdp2025: 5.0, pppSharePct: 18.9, confidence: "estimated", fill: "#ef4444", note: "Near-zero CPI while leading growth contribution" },
];

export type VintageDelta = {
  id: string;
  label: string;
  q3Pct: number;
  augPct: number;
  deltaPp: number;
  unit: string;
  fill: string;
  note: string;
};

/** Q3 → Aug restatement of concentration / price meters */
export const VINTAGE_DELTAS: VintageDelta[] = [
  { id: "ppp-top1", label: "PPP Top-1 (China)", q3Pct: 19, augPct: 19, deltaPp: 0, unit: "% stock", fill: "#ef4444", note: "Carried — no new PPP census" },
  { id: "growth-top1", label: "Growth Top-1 base", q3Pct: 32, augPct: 32, deltaPp: 0, unit: "% contrib", fill: "#f59e0b", note: "Base ladder unchanged" },
  { id: "growth-q2", label: "Growth Top-1 Q2 sens.", q3Pct: 29, augPct: 29, deltaPp: 0, unit: "% contrib", fill: "#f97316", note: "Held pending GDP second estimate" },
  { id: "trade-top1", label: "Trade-growth Top-1", q3Pct: 71, augPct: 71, deltaPp: 0, unit: "% vol growth", fill: "#0ea5e9", note: "WTO Asia share carried; CPB June pending" },
  { id: "export-top3", label: "Export Top-3", q3Pct: 29, augPct: 29, deltaPp: 0, unit: "% value", fill: "#10b981", note: "CN·US·DE carried" },
  { id: "us-cpi", label: "US CPI YoY", q3Pct: 3.4, augPct: 3.4, deltaPp: 0, unit: "% YoY", fill: "#8b5cf6", note: "Same July print; −0.1 pp vs June is the MoM cooling" },
  { id: "us-pce", label: "US PCE YoY", q3Pct: 3.7, augPct: 3.7, deltaPp: 0, unit: "% YoY", fill: "#a855f7", note: "June print held; −0.4 pp vs May" },
  { id: "elevated-cpi", label: "Elevated-CPI GDP share", q3Pct: 38, augPct: 38, deltaPp: 0, unit: "% PPP", fill: "#6366f1", note: "Threshold still ~3.4%; US stays inside elevated band" },
];

export type PriceCoolingPoint = {
  id: string;
  label: string;
  priorYoy: number;
  latestYoy: number;
  deltaPp: number;
  fill: string;
  tilt: "cooler" | "hotter" | "unchanged";
};

export const PRICE_COOLING_PATH: PriceCoolingPoint[] = [
  { id: "us-cpi", label: "US CPI", priorYoy: 3.5, latestYoy: 3.4, deltaPp: -0.1, fill: "#0ea5e9", tilt: "cooler" },
  { id: "us-pce", label: "US PCE", priorYoy: 4.1, latestYoy: 3.7, deltaPp: -0.4, fill: "#8b5cf6", tilt: "cooler" },
  { id: "us-core-pce", label: "US core PCE", priorYoy: 3.4, latestYoy: 3.3, deltaPp: -0.1, fill: "#a855f7", tilt: "cooler" },
  { id: "ea-hicp", label: "EA HICP", priorYoy: 2.8, latestYoy: 2.9, deltaPp: 0.1, fill: "#64748b", tilt: "hotter" },
  { id: "china-cpi", label: "China CPI", priorYoy: 0.2, latestYoy: 0.2, deltaPp: 0, fill: "#ef4444", tilt: "unchanged" },
];

export type PendingMeter = {
  id: string;
  label: string;
  heldSignal: string;
  dueDate: string;
  status: "pending" | "held";
  fill: string;
  note: string;
};

export const PENDING_METERS: PendingMeter[] = [
  {
    id: "cpb-june",
    label: "CPB World Trade Monitor",
    heldSignal: "May +1.0% MoM",
    dueDate: "25 Aug",
    status: "pending",
    fill: "#0ea5e9",
    note: "June volume could confirm or fade the Mar–May rebound (−0.4% cum)",
  },
  {
    id: "bea-q2-2nd",
    label: "BEA Q2 GDP second estimate",
    heldSignal: "Advance 1.5% SAAR",
    dueDate: "26 Aug",
    status: "pending",
    fill: "#64748b",
    note: "Revision would restate US growth-contribution sensitivity, not PPP stock",
  },
];

export type DualInflationMeter = {
  id: string;
  label: string;
  yoy: number;
  saarOrImf: number;
  saarLabel: string;
  spreadPp: number;
  fill: string;
};

/** YoY vs SAAR/IMF mismatch — concentration-relevant for US price weight */
export const DUAL_INFLATION: DualInflationMeter[] = [
  { id: "us-cpi-imf", label: "US CPI vs IMF 2026f", yoy: 3.4, saarOrImf: 3.6, saarLabel: "IMF US CPI", spreadPp: -0.2, fill: "#0ea5e9" },
  { id: "us-pce-saar", label: "US PCE YoY vs Q2 SAAR", yoy: 3.7, saarOrImf: 5.1, saarLabel: "Q2 PCE SAAR", spreadPp: 1.4, fill: "#8b5cf6" },
  { id: "ea-hicp", label: "EA HICP (YoY only)", yoy: 2.9, saarOrImf: 2.9, saarLabel: "same unit", spreadPp: 0, fill: "#64748b" },
];

export type HardDataMeter = {
  id: string;
  label: string;
  julyPath: number;
  hardSignal: number;
  unit: string;
  signalLabel: string;
  tilt: "hotter" | "cooler" | "firmer" | "softer" | "aligned" | "pending";
  fill: string;
};

export const HARD_DATA_METERS: HardDataMeter[] = [
  { id: "trade", label: "World trade (CPB)", julyPath: 3.5, hardSignal: 1.0, unit: "%", signalLabel: "May MoM (Jun pending)", tilt: "firmer", fill: "#0ea5e9" },
  { id: "us-gdp", label: "US growth", julyPath: 2.3, hardSignal: 1.5, unit: "%", signalLabel: "Q2 SAAR advance", tilt: "softer", fill: "#64748b" },
  { id: "china-gdp", label: "China growth", julyPath: 4.6, hardSignal: 4.3, unit: "%", signalLabel: "Q2 YoY", tilt: "softer", fill: "#ef4444" },
  { id: "us-cpi", label: "US CPI YoY", julyPath: 3.6, hardSignal: 3.4, unit: "%", signalLabel: "July print", tilt: "cooler", fill: "#8b5cf6" },
  { id: "us-pce-saar", label: "US PCE SAAR", julyPath: 3.6, hardSignal: 5.1, unit: "%", signalLabel: "Q2 SAAR", tilt: "hotter", fill: "#a855f7" },
];

export type CpbPoint = { month: string; mom: number | null; label: string; pending?: boolean };

export const CPB_PATH: CpbPoint[] = [
  { month: "Mar", mom: -2.1, label: "Mar −2.1%" },
  { month: "Apr", mom: 0.7, label: "Apr +0.7%" },
  { month: "May", mom: 1.0, label: "May +1.0%" },
  { month: "Jun", mom: null, label: "Jun pending", pending: true },
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
  { id: "prices", label: "Elevated-CPI GDP", top1Pct: 15, top3Pct: 38, top1Name: "US weight / elevated band", unit: "% PPP at ≥~3.4% CPI", fill: "#8b5cf6" },
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
