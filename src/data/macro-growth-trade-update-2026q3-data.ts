/**
 * Growth, trade & prices — Q3 2026 hard-data vintage check.
 * Benchmarks the IMF WEO Update July 2026 baseline against
 * CPB World Trade Monitor (through May), BEA Q2 advance GDP/PCE,
 * Eurostat Q2 flash, NBS China Q2, and BOK Korea Q2.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Q3 vintage check: IMF July 2026 WEO Update baseline vs CPB World Trade Monitor (May print, released 24 Jul), BEA GDP advance Q2 2026 (30 Jul), Eurostat GDP flash Q2 (14 Aug), NBS China Q2, BOK Korea Q2. Merchandise MoM ≠ IMF goods+services annual volume.";

export const SOURCES = [
  {
    label: "IMF World Economic Outlook Update, July 2026",
    url: "https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026",
  },
  {
    label: "CPB World Trade Monitor, May 2026",
    url: "https://www.cpb.nl/en/world-trade-monitor/cpb-world-trade-monitor-may-2026",
  },
  {
    label: "BEA GDP Advance Estimate, Q2 2026",
    url: "https://www.bea.gov/news/2026/gdp-advance-estimate-2nd-quarter-2026",
  },
  {
    label: "Eurostat GDP flash estimate, Q2 2026",
    url: "https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-14082026-ap",
  },
  {
    label: "NBS China GDP, H1 / Q2 2026",
    url: "https://www.stats.gov.cn/english/PressRelease/202607/t20260715_1964120.html",
  },
  {
    label: "Bank of Korea GDP advance, Q2 2026",
    url: "https://www.koreaherald.com/article/10817255",
  },
];

/** Headline meters for the Q3 hard-data check */
export const HEADLINE = {
  cpbMayMom: 1.0,
  cpbAprMom: 0.7,
  cpbMarMom: -2.1,
  /** Cumulative Mar–May MoM chain (approx): (1+m1)*(1+m2)*(1+m3)-1 */
  cpbMarMayCum: -0.4,
  usGdpQ2Saar: 1.5,
  usGdpQ1Saar: 2.1,
  usPceQ2Saar: 5.1,
  usPceQ1Saar: 4.6,
  usCorePceQ2Saar: 3.4,
  usCorePceQ1Saar: 4.4,
  usPurchasesPriceQ2: 5.7,
  eaGdpQ2Qoq: 0.4,
  eaGdpQ1Qoq: 0.0,
  eaGdpQ2Yoy: 1.0,
  chinaGdpQ2Yoy: 4.3,
  chinaGdpQ1Yoy: 5.0,
  chinaGdpQ2Qoq: 0.9,
  koreaGdpQ2Qoq: 0.6,
  koreaGdpQ2Yoy: 3.7,
  imfWorldGdp2026: 3.0,
  imfWorldTrade2026: 3.5,
  imfWorldCpi2026: 4.7,
  imfUsGdp2026: 2.3,
  imfUsCpi2026: 3.6,
  imfEaGdp2026: 0.9,
  imfChinaGdp2026: 4.6,
  imfKoreaGdp2026: 2.6,
  oilJulAssumption: 89.27,
};

/** Tracking score: hard data vs July IMF annual path (illustrative) */
export type TriadTrack = {
  meter: "gdp" | "trade" | "cpi";
  label: string;
  julyPath: number;
  hardSignal: number;
  unit: string;
  signalLabel: string;
  gapPp: number;
  tilt: "hotter" | "cooler" | "firmer" | "softer" | "aligned";
};

export const TRIAD_TRACK: TriadTrack[] = [
  {
    meter: "trade",
    label: "World trade",
    julyPath: 3.5,
    hardSignal: 1.0,
    unit: "%",
    signalLabel: "CPB May MoM",
    gapPp: 1.0,
    tilt: "firmer",
  },
  {
    meter: "gdp",
    label: "US growth (proxy)",
    julyPath: 2.3,
    hardSignal: 1.5,
    unit: "%",
    signalLabel: "BEA Q2 SAAR",
    gapPp: -0.8,
    tilt: "softer",
  },
  {
    meter: "cpi",
    label: "US prices (proxy)",
    julyPath: 3.6,
    hardSignal: 5.1,
    unit: "%",
    signalLabel: "PCE Q2 SAAR",
    gapPp: 1.5,
    tilt: "hotter",
  },
];

/** CPB monthly merchandise volume path through May */
export type CpbMonth = {
  id: string;
  label: string;
  month: string;
  mom: number;
  note?: string;
  phase: "pre-shock" | "shock" | "rebound";
};

export const CPB_MONTHLY: CpbMonth[] = [
  { id: "2026-01", label: "Jan", month: "2026-01", mom: 2.0, phase: "pre-shock" },
  { id: "2026-02", label: "Feb", month: "2026-02", mom: 1.9, phase: "pre-shock" },
  {
    id: "2026-03",
    label: "Mar",
    month: "2026-03",
    mom: -2.1,
    note: "Hormuz / Gulf war shock",
    phase: "shock",
  },
  {
    id: "2026-04",
    label: "Apr",
    month: "2026-04",
    mom: 0.7,
    note: "Inventory + AI electronics rebound",
    phase: "rebound",
  },
  {
    id: "2026-05",
    label: "May",
    month: "2026-05",
    mom: 1.0,
    note: "Second consecutive rebound month",
    phase: "rebound",
  },
];

export const CPB_PHASE_COLORS: Record<CpbMonth["phase"], string> = {
  "pre-shock": "#94a3b8",
  shock: "#f43f5e",
  rebound: "#14b8a6",
};

export type EconomyId =
  | "usa"
  | "eur"
  | "chn"
  | "kor"
  | "jpn"
  | "gbr"
  | "ind"
  | "bra";

export type EconomyQ2 = {
  id: EconomyId;
  name: string;
  short: string;
  region: "Americas" | "Europe" | "Asia";
  q1Print: number;
  q2Print: number;
  q1Unit: "saar" | "qoq" | "yoy";
  q2Unit: "saar" | "qoq" | "yoy";
  /** Comparable annual IMF July baseline for 2026 */
  imf2026: number;
  pricePrint?: number;
  priceLabel?: string;
  priceConfidence: Confidence;
  note?: string;
};

/**
 * Q2 hard prints vs July IMF annual baselines.
 * Units differ by economy — dashboard labels them explicitly.
 */
export const ECONOMIES: EconomyQ2[] = [
  {
    id: "usa",
    name: "United States",
    short: "US",
    region: "Americas",
    q1Print: 2.1,
    q2Print: 1.5,
    q1Unit: "saar",
    q2Unit: "saar",
    imf2026: 2.3,
    pricePrint: 5.1,
    priceLabel: "PCE SAAR",
    priceConfidence: "disclosed",
    note: "Q2 advance; final sales to private domestic +3.9%",
  },
  {
    id: "eur",
    name: "Euro area",
    short: "EA",
    region: "Europe",
    q1Print: 0.0,
    q2Print: 0.4,
    q1Unit: "qoq",
    q2Unit: "qoq",
    imf2026: 0.9,
    priceConfidence: "estimated",
    note: "Flash + second estimate 0.4% QoQ; +1.0% YoY",
  },
  {
    id: "chn",
    name: "China",
    short: "CN",
    region: "Asia",
    q1Print: 5.0,
    q2Print: 4.3,
    q1Unit: "yoy",
    q2Unit: "yoy",
    imf2026: 4.6,
    priceConfidence: "estimated",
    note: "Q2 +0.9% QoQ; H1 +4.7% YoY",
  },
  {
    id: "kor",
    name: "Korea",
    short: "KR",
    region: "Asia",
    q1Print: 3.8,
    q2Print: 3.7,
    q1Unit: "yoy",
    q2Unit: "yoy",
    imf2026: 2.6,
    priceConfidence: "estimated",
    note: "Q2 +0.6% QoQ on export strength; YoY still well above IMF annual",
  },
  {
    id: "jpn",
    name: "Japan",
    short: "JP",
    region: "Asia",
    q1Print: 0.6,
    q2Print: 0.4,
    q1Unit: "qoq",
    q2Unit: "qoq",
    imf2026: 0.6,
    priceConfidence: "estimated",
    note: "Illustrative QoQ path aligned with Cabinet Office flash cadence; treat as estimated",
  },
  {
    id: "gbr",
    name: "United Kingdom",
    short: "UK",
    region: "Europe",
    q1Print: 0.7,
    q2Print: 0.3,
    q1Unit: "qoq",
    q2Unit: "qoq",
    imf2026: 1.0,
    priceConfidence: "estimated",
    note: "ONS-style flash cadence; estimated pending full release set",
  },
  {
    id: "ind",
    name: "India",
    short: "IN",
    region: "Asia",
    q1Print: 7.4,
    q2Print: 6.8,
    q1Unit: "yoy",
    q2Unit: "yoy",
    imf2026: 6.4,
    priceConfidence: "estimated",
    note: "Fiscal-year economy; YoY prints are calendar-quarter approximations",
  },
  {
    id: "bra",
    name: "Brazil",
    short: "BR",
    region: "Americas",
    q1Print: 1.4,
    q2Print: 0.8,
    q1Unit: "qoq",
    q2Unit: "qoq",
    imf2026: 2.4,
    priceConfidence: "estimated",
    note: "IBGE-style sequential prints; estimated pending full national accounts set",
  },
];

/** US dual path — growth vs prices */
export const US_DUAL_PATH = [
  { quarter: "2025Q4", label: "25Q4", gdpSaar: 0.5, pceSaar: 2.4, corePceSaar: 2.6 },
  { quarter: "2026Q1", label: "26Q1", gdpSaar: 2.1, pceSaar: 4.6, corePceSaar: 4.4 },
  { quarter: "2026Q2", label: "26Q2", gdpSaar: 1.5, pceSaar: 5.1, corePceSaar: 3.4 },
];

/** Forecast-vs-print gaps for major economies (Q2 print − IMF annual, rough) */
export type GapRow = {
  id: EconomyId;
  short: string;
  name: string;
  region: EconomyQ2["region"];
  print: number;
  imprintUnit: string;
  imf: number;
  /** Signed gap: positive = print hotter/firmer than annual path */
  gapPp: number;
  fill: string;
};

export function economyGaps(): GapRow[] {
  return ECONOMIES.map((e) => {
    const print =
      e.q2Unit === "saar"
        ? e.q2Print
        : e.q2Unit === "yoy"
          ? e.q2Print
          : Number((e.q2Print * 4).toFixed(1)); // crude annualised QoQ
    const imprintUnit =
      e.q2Unit === "saar" ? "SAAR" : e.q2Unit === "yoy" ? "YoY" : "QoQ×4";
    return {
      id: e.id,
      short: e.short,
      name: e.name,
      region: e.region,
      print,
      imprintUnit,
      imf: e.imf2026,
      gapPp: Number((print - e.imf2026).toFixed(1)),
      fill: ECONOMY_COLORS[e.id],
    };
  }).sort((a, b) => b.gapPp - a.gapPp);
}

/** Growth × price scatter points (disclosed where available) */
export type ScatterPoint = {
  id: EconomyId;
  short: string;
  name: string;
  growth: number;
  growthLabel: string;
  price: number;
  priceLabel: string;
  fill: string;
  confidence: Confidence;
};

export function growthPriceScatter(): ScatterPoint[] {
  return ECONOMIES.filter((e) => e.pricePrint != null).map((e) => ({
    id: e.id,
    short: e.short,
    name: e.name,
    growth: e.q2Print,
    growthLabel: e.q2Unit.toUpperCase(),
    price: e.pricePrint!,
    priceLabel: e.priceLabel ?? "CPI",
    fill: ECONOMY_COLORS[e.id],
    confidence: e.priceConfidence,
  }));
}

/** Oil / price bridge — July IMF assumption vs Q2 US purchase-price impulse */
export const PRICE_BRIDGE = [
  { label: "IMF oil 2026f", value: 89.27, unit: "$/bbl", kind: "oil" as const },
  { label: "US PCE Q2", value: 5.1, unit: "% SAAR", kind: "pce" as const },
  { label: "US core PCE Q2", value: 3.4, unit: "% SAAR", kind: "core" as const },
  { label: "Purchases deflator Q2", value: 5.7, unit: "% SAAR", kind: "def" as const },
];

export const REGION_COLORS: Record<EconomyQ2["region"], string> = {
  Americas: "#0ea5e9",
  Europe: "#8b5cf6",
  Asia: "#f59e0b",
};

export const ECONOMY_COLORS: Record<EconomyId, string> = {
  usa: "#0ea5e9",
  eur: "#8b5cf6",
  chn: "#f43f5e",
  kor: "#06b6d4",
  jpn: "#14b8a6",
  gbr: "#6366f1",
  ind: "#f59e0b",
  bra: "#22c55e",
};

export const METER_COLORS = {
  gdp: "#0ea5e9",
  trade: "#14b8a6",
  cpi: "#f59e0b",
};

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function cpbCumulative(fromIdx = 2): number {
  // product of (1+mom/100) from Mar onward by default
  const slice = CPB_MONTHLY.slice(fromIdx);
  const factor = slice.reduce((acc, m) => acc * (1 + m.mom / 100), 1);
  return Number(((factor - 1) * 100).toFixed(1));
}
