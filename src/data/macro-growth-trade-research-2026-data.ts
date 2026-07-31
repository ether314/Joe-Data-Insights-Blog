/**
 * Growth, trade & prices — IMF WEO Apr 2026 + WTO Global Trade Outlook Mar 2026.
 * Multi-country GDP / CPI trajectories with merchandise & services trade volumes.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "IMF World Economic Outlook April 2026 reference forecast (PPP growth, CPI, goods+services trade volume) and WTO Global Trade Outlook and Statistics March 2026 (merchandise & commercial services volume). Country CPI assumptions from WEO Table 1.1 notes where disclosed; other CPI rows are staff-aligned estimates marked estimated.";

export const SOURCES = [
  {
    label: "IMF World Economic Outlook, April 2026",
    url: "https://www.imf.org/en/Publications/WEO/Issues/2026/04/14/world-economic-outlook-april-2026",
  },
  {
    label: "WTO Global Trade Outlook and Statistics, March 2026",
    url: "https://www.wto.org/english/res_e/publications_e/trade_outlook26_e.htm",
  },
];

export const HEADLINE = {
  worldGdp2025: 3.4,
  worldGdp2026: 3.1,
  worldGdp2027: 3.2,
  worldGdpMarket2025: 2.9,
  worldCpi2025: 4.1,
  worldCpi2026: 4.4,
  worldCpi2027: 3.7,
  imfTradeGs2025: 5.1,
  imfTradeGs2026: 2.8,
  imfTradeGs2027: 3.8,
  wtoMerch2025: 4.6,
  wtoMerch2026: 1.9,
  wtoMerch2027: 2.6,
  wtoServices2025: 5.3,
  wtoServices2026: 4.8,
  wtoServices2027: 5.1,
  asiaContributionPp2025: 3.2,
  asiaShareOfTradeGrowthPct: 71,
  chinaExportVolume2025: 9.2,
  merchValueTn2025: 26.26,
  servicesValueTn2025: 9.56,
  oilAssumed2026: 82.22,
  usEffectiveTariffPct: 13.5,
};

/** Global triad path — mix of WTO merchandise history + IMF WEO for GDP/CPI/trade GS */
export type GlobalPathPoint = {
  year: number;
  label: string;
  worldGdpPpp: number;
  worldGdpMarket: number;
  worldCpi: number;
  merchVolume: number;
  servicesVolume: number;
  tradeGs: number;
  phase: "pre" | "covid" | "reopen" | "shock" | "outturn" | "forecast";
  confidence: Confidence;
};

export const GLOBAL_PATH: GlobalPathPoint[] = [
  { year: 2019, label: "2019", worldGdpPpp: 2.8, worldGdpMarket: 2.6, worldCpi: 3.5, merchVolume: 0.4, servicesVolume: 4.8, tradeGs: 1.0, phase: "pre", confidence: "estimated" },
  { year: 2020, label: "2020", worldGdpPpp: -2.9, worldGdpMarket: -3.1, worldCpi: 3.2, merchVolume: -5.1, servicesVolume: -18.0, tradeGs: -8.4, phase: "covid", confidence: "estimated" },
  { year: 2021, label: "2021", worldGdpPpp: 6.3, worldGdpMarket: 6.0, worldCpi: 4.7, merchVolume: 9.7, servicesVolume: 15.2, tradeGs: 10.5, phase: "reopen", confidence: "estimated" },
  { year: 2022, label: "2022", worldGdpPpp: 3.5, worldGdpMarket: 3.1, worldCpi: 8.7, merchVolume: 3.0, servicesVolume: 12.1, tradeGs: 5.2, phase: "shock", confidence: "estimated" },
  { year: 2023, label: "2023", worldGdpPpp: 3.3, worldGdpMarket: 2.8, worldCpi: 6.7, merchVolume: -1.1, servicesVolume: 7.8, tradeGs: 0.8, phase: "shock", confidence: "estimated" },
  { year: 2024, label: "2024", worldGdpPpp: 3.3, worldGdpMarket: 2.8, worldCpi: 5.7, merchVolume: 2.9, servicesVolume: 7.8, tradeGs: 3.4, phase: "outturn", confidence: "estimated" },
  { year: 2025, label: "2025", worldGdpPpp: 3.4, worldGdpMarket: 2.9, worldCpi: 4.1, merchVolume: 4.6, servicesVolume: 5.3, tradeGs: 5.1, phase: "outturn", confidence: "disclosed" },
  { year: 2026, label: "2026f", worldGdpPpp: 3.1, worldGdpMarket: 2.6, worldCpi: 4.4, merchVolume: 1.9, servicesVolume: 4.8, tradeGs: 2.8, phase: "forecast", confidence: "disclosed" },
  { year: 2027, label: "2027f", worldGdpPpp: 3.2, worldGdpMarket: 2.6, worldCpi: 3.7, merchVolume: 2.6, servicesVolume: 5.1, tradeGs: 3.8, phase: "forecast", confidence: "disclosed" },
];

export type EconomyId =
  | "usa"
  | "eur"
  | "chn"
  | "ind"
  | "jpn"
  | "gbr"
  | "bra"
  | "mex"
  | "sau"
  | "zaf";

export type EconomyRow = {
  id: EconomyId;
  name: string;
  short: string;
  region: "Americas" | "Europe" | "Asia" | "EM other";
  gdp2025: number;
  gdp2026: number;
  gdp2027: number;
  cpi2025: number;
  cpi2026: number;
  cpi2027: number;
  cpiConfidence: Confidence;
  note?: string;
};

/** IMF WEO Apr 2026 Table 1.1 GDP; CPI: footnote 7 for US/EA/JP; others estimated from WEO narrative */
export const ECONOMIES: EconomyRow[] = [
  { id: "usa", name: "United States", short: "US", region: "Americas", gdp2025: 2.1, gdp2026: 2.3, gdp2027: 2.1, cpi2025: 2.7, cpi2026: 3.2, cpi2027: 2.1, cpiConfidence: "disclosed", note: "WEO assumed US CPI 3.2% / 2.1% in 2026–27" },
  { id: "eur", name: "Euro area", short: "EA", region: "Europe", gdp2025: 1.4, gdp2026: 1.1, gdp2027: 1.2, cpi2025: 2.4, cpi2026: 2.6, cpi2027: 2.2, cpiConfidence: "disclosed", note: "WEO assumed EA CPI 2.6% / 2.2%" },
  { id: "chn", name: "China", short: "CN", region: "Asia", gdp2025: 5.0, gdp2026: 4.4, gdp2027: 4.0, cpi2025: 0.2, cpi2026: 0.8, cpi2027: 1.4, cpiConfidence: "estimated", note: "Low inflation; WEO flags domestic lag vs export strength" },
  { id: "ind", name: "India", short: "IN", region: "Asia", gdp2025: 7.6, gdp2026: 6.5, gdp2027: 6.5, cpi2025: 4.6, cpi2026: 4.2, cpi2027: 4.0, cpiConfidence: "estimated", note: "Fiscal-year GDP basis per WEO note 3" },
  { id: "jpn", name: "Japan", short: "JP", region: "Asia", gdp2025: 1.2, gdp2026: 0.7, gdp2027: 0.6, cpi2025: 2.9, cpi2026: 2.2, cpi2027: 2.3, cpiConfidence: "disclosed", note: "WEO assumed JP CPI 2.2% / 2.3%" },
  { id: "gbr", name: "United Kingdom", short: "UK", region: "Europe", gdp2025: 1.3, gdp2026: 0.8, gdp2027: 1.3, cpi2025: 3.4, cpi2026: 2.8, cpi2027: 2.3, cpiConfidence: "estimated" },
  { id: "bra", name: "Brazil", short: "BR", region: "Americas", gdp2025: 2.3, gdp2026: 1.9, gdp2027: 2.0, cpi2025: 4.8, cpi2026: 4.3, cpi2027: 3.6, cpiConfidence: "estimated" },
  { id: "mex", name: "Mexico", short: "MX", region: "Americas", gdp2025: 0.6, gdp2026: 1.6, gdp2027: 2.2, cpi2025: 4.0, cpi2026: 3.5, cpi2027: 3.1, cpiConfidence: "estimated" },
  { id: "sau", name: "Saudi Arabia", short: "SA", region: "EM other", gdp2025: 4.5, gdp2026: 3.1, gdp2027: 4.5, cpi2025: 1.8, cpi2026: 2.4, cpi2027: 2.2, cpiConfidence: "estimated", note: "Large 2026 growth downgrade vs Jan Update (−1.4 pp)" },
  { id: "zaf", name: "South Africa", short: "ZA", region: "EM other", gdp2025: 1.1, gdp2026: 1.0, gdp2027: 1.3, cpi2025: 4.4, cpi2026: 4.1, cpi2027: 3.8, cpiConfidence: "estimated" },
];

/** WTO regional contribution to 2025 merchandise trade volume growth (pp of 4.6) */
export type RegionContribution = {
  region: string;
  short: string;
  pp2025: number;
  sharePct: number;
  merchImport2026f: number;
  confidence: Confidence;
};

export const REGION_CONTRIBUTIONS: RegionContribution[] = [
  { region: "Asia", short: "Asia", pp2025: 3.2, sharePct: 71, merchImport2026f: 3.3, confidence: "disclosed" },
  { region: "Europe", short: "Europe", pp2025: 0.7, sharePct: 15, merchImport2026f: 1.2, confidence: "estimated" },
  { region: "North America", short: "N. America", pp2025: 0.5, sharePct: 11, merchImport2026f: 1.5, confidence: "estimated" },
  { region: "Rest of world", short: "ROW", pp2025: 0.2, sharePct: 4, merchImport2026f: 2.8, confidence: "estimated" },
];

/** Goods vs services volume growth path (WTO) */
export type TradeModeRow = {
  year: number;
  label: string;
  merchandise: number;
  services: number;
  combinedApprox: number;
  gdpMarket: number;
  isForecast: boolean;
};

export const TRADE_MODE_PATH: TradeModeRow[] = [
  { year: 2023, label: "2023", merchandise: -1.1, services: 7.8, combinedApprox: 1.5, gdpMarket: 2.8, isForecast: false },
  { year: 2024, label: "2024", merchandise: 2.9, services: 7.8, combinedApprox: 4.0, gdpMarket: 2.8, isForecast: false },
  { year: 2025, label: "2025", merchandise: 4.6, services: 5.3, combinedApprox: 4.7, gdpMarket: 2.9, isForecast: false },
  { year: 2026, label: "2026f", merchandise: 1.9, services: 4.8, combinedApprox: 2.7, gdpMarket: 2.8, isForecast: true },
  { year: 2027, label: "2027f", merchandise: 2.6, services: 5.1, combinedApprox: 3.3, gdpMarket: 2.8, isForecast: true },
];

/** Multi-year GDP path for trajectory panel (selected economies) */
export type GdpPoint = {
  year: number;
  usa: number;
  eur: number;
  chn: number;
  ind: number;
  jpn: number;
};

export const GDP_TRAJECTORIES: GdpPoint[] = [
  { year: 2022, usa: 2.5, eur: 3.5, chn: 3.0, ind: 7.0, jpn: 1.0 },
  { year: 2023, usa: 2.9, eur: 0.5, chn: 5.2, ind: 8.2, jpn: 1.7 },
  { year: 2024, usa: 2.8, eur: 0.9, chn: 4.8, ind: 6.5, jpn: 0.1 },
  { year: 2025, usa: 2.1, eur: 1.4, chn: 5.0, ind: 7.6, jpn: 1.2 },
  { year: 2026, usa: 2.3, eur: 1.1, chn: 4.4, ind: 6.5, jpn: 0.7 },
  { year: 2027, usa: 2.1, eur: 1.2, chn: 4.0, ind: 6.5, jpn: 0.6 },
];

export const REGION_COLORS: Record<string, string> = {
  Americas: "#0ea5e9",
  Europe: "#8b5cf6",
  Asia: "#f59e0b",
  "EM other": "#14b8a6",
};

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  return `${n.toFixed(digits)} pp`;
}

export function rankedContributions(): RegionContribution[] {
  return [...REGION_CONTRIBUTIONS].sort((a, b) => b.pp2025 - a.pp2025);
}

export function economiesForYear(year: 2025 | 2026): Array<
  EconomyRow & { gdp: number; cpi: number }
> {
  return ECONOMIES.map((e) => ({
    ...e,
    gdp: year === 2025 ? e.gdp2025 : e.gdp2026,
    cpi: year === 2025 ? e.cpi2025 : e.cpi2026,
  }));
}
