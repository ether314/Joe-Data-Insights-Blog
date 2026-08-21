/**
 * Growth, trade & prices — August 2026 monthly vintage.
 * Updates the Q3 hard-data check with BLS July CPI, BEA June PCE YoY,
 * and Eurostat July HICP — while CPB trade and BEA GDP second estimate
 * remain pending (25–26 Aug).
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Aug 202608 vintage vs Q3 hard-data check: BLS CPI July (12 Aug), BEA Personal Income & Outlays June (PCE YoY), Eurostat HICP July (19 Aug). CPB June WTM due 25 Aug; BEA Q2 second estimate 26 Aug. Monthly YoY ≠ Q2 PCE SAAR.";

export const SOURCES = [
  {
    label: "BLS Consumer Price Index, July 2026",
    url: "https://www.bls.gov/news.release/archives/cpi_08122026.htm",
  },
  {
    label: "BEA Personal Income and Outlays, June 2026",
    url: "https://www.bea.gov/news/2026/personal-income-and-outlays-june-2026",
  },
  {
    label: "Eurostat HICP, July 2026",
    url: "https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-19082026-ap",
  },
  {
    label: "IMF World Economic Outlook Update, July 2026",
    url: "https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026",
  },
  {
    label: "CPB World Trade Monitor, May 2026 (held)",
    url: "https://www.cpb.nl/en/world-trade-monitor/cpb-world-trade-monitor-may-2026",
  },
  {
    label: "BEA GDP Advance Estimate, Q2 2026 (held)",
    url: "https://www.bea.gov/news/2026/gdp-advance-estimate-2nd-quarter-2026",
  },
];

/** Headline meters for the August monthly vintage */
export const HEADLINE = {
  usCpiJulYoy: 3.4,
  usCpiJunYoy: 3.5,
  usCpiJulMom: 0.1,
  usCpiJunMom: -0.4,
  usCpiCoreJulYoy: 2.5,
  usCpiCoreJunYoy: 2.6,
  usCpiEnergyJulYoy: 14.7,
  usPceJunYoy: 3.7,
  usPceMayYoy: 4.1,
  usPceJunMom: -0.1,
  usCorePceJunYoy: 3.3,
  usCorePceMayYoy: 3.4,
  eaHicpJulYoy: 2.9,
  eaHicpJunYoy: 2.8,
  eaHicpJulMom: 0.2,
  eaEnergyJulYoy: 10.3,
  eaCoreJulYoy: 2.5,
  /** Still held from Q3 desk */
  cpbMayMom: 1.0,
  cpbAprMom: 0.7,
  cpbMarMom: -2.1,
  usGdpQ2Saar: 1.5,
  usPceQ2Saar: 5.1,
  imfWorldGdp2026: 3.0,
  imfWorldTrade2026: 3.5,
  imfWorldCpi2026: 4.7,
  imfUsGdp2026: 2.3,
  imfUsCpi2026: 3.6,
  imfEaGdp2026: 0.9,
  oilJulAssumption: 89.27,
  /** Vintage deltas vs prior theme post (Q3) */
  cpiDeltaVsJunPp: -0.1,
  pceDeltaVsMayPp: -0.4,
  /** Gap: July CPI YoY vs IMF US CPI 2026f */
  cpiVsImfGapPp: -0.2,
  /** Gap: Q2 PCE SAAR vs June PCE YoY (unit mismatch — illustrative) */
  saarVsYoySpreadPp: 1.4,
};

/** What moved since the Q3 hard-data post */
export type VintageDelta = {
  id: string;
  meter: "gdp" | "trade" | "cpi";
  label: string;
  q3Signal: string;
  augSignal: string;
  deltaLabel: string;
  deltaPp: number | null;
  status: "updated" | "held" | "pending";
  tilt: "cooler" | "hotter" | "firmer" | "softer" | "unchanged" | "awaiting";
};

export const VINTAGE_DELTAS: VintageDelta[] = [
  {
    id: "us-cpi",
    meter: "cpi",
    label: "US CPI YoY",
    q3Signal: "PCE SAAR 5.1% (Q2)",
    augSignal: "CPI 3.4% YoY (Jul)",
    deltaLabel: "−0.1 pp vs Jun CPI",
    deltaPp: -0.1,
    status: "updated",
    tilt: "cooler",
  },
  {
    id: "us-pce",
    meter: "cpi",
    label: "US PCE YoY",
    q3Signal: "PCE SAAR 5.1% (Q2)",
    augSignal: "PCE 3.7% YoY (Jun)",
    deltaLabel: "−0.4 pp vs May YoY",
    deltaPp: -0.4,
    status: "updated",
    tilt: "cooler",
  },
  {
    id: "ea-hicp",
    meter: "cpi",
    label: "EA HICP YoY",
    q3Signal: "Not in Q3 triad",
    augSignal: "HICP 2.9% YoY (Jul)",
    deltaLabel: "+0.1 pp vs Jun",
    deltaPp: 0.1,
    status: "updated",
    tilt: "hotter",
  },
  {
    id: "us-gdp",
    meter: "gdp",
    label: "US GDP SAAR",
    q3Signal: "1.5% Q2 advance",
    augSignal: "1.5% held",
    deltaLabel: "2nd est 26 Aug",
    deltaPp: null,
    status: "pending",
    tilt: "awaiting",
  },
  {
    id: "cpb-trade",
    meter: "trade",
    label: "CPB merchandise",
    q3Signal: "May +1.0% MoM",
    augSignal: "May +1.0% held",
    deltaLabel: "June WTM 25 Aug",
    deltaPp: null,
    status: "held",
    tilt: "unchanged",
  },
];

/** Triad tracking with August price update */
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
    signalLabel: "CPB May MoM (held)",
    gapPp: 1.0,
    tilt: "firmer",
  },
  {
    meter: "gdp",
    label: "US growth (proxy)",
    julyPath: 2.3,
    hardSignal: 1.5,
    unit: "%",
    signalLabel: "BEA Q2 SAAR (held)",
    gapPp: -0.8,
    tilt: "softer",
  },
  {
    meter: "cpi",
    label: "US prices (CPI YoY)",
    julyPath: 3.6,
    hardSignal: 3.4,
    unit: "%",
    signalLabel: "BLS Jul CPI YoY",
    gapPp: -0.2,
    tilt: "cooler",
  },
];

/** Monthly US price path — CPI headline / core + PCE YoY */
export type PriceMonth = {
  id: string;
  label: string;
  month: string;
  cpiYoy: number;
  cpiCoreYoy: number;
  pceYoy: number | null;
  pceCoreYoy: number | null;
  phase: "pre-peak" | "energy-pulse" | "cooling";
};

export const US_PRICE_PATH: PriceMonth[] = [
  {
    id: "2026-02",
    label: "Feb",
    month: "2026-02",
    cpiYoy: 2.8,
    cpiCoreYoy: 3.1,
    pceYoy: 2.9,
    pceCoreYoy: 3.0,
    phase: "pre-peak",
  },
  {
    id: "2026-03",
    label: "Mar",
    month: "2026-03",
    cpiYoy: 3.0,
    cpiCoreYoy: 2.8,
    pceYoy: 3.5,
    pceCoreYoy: 3.2,
    phase: "energy-pulse",
  },
  {
    id: "2026-04",
    label: "Apr",
    month: "2026-04",
    cpiYoy: 3.2,
    cpiCoreYoy: 2.7,
    pceYoy: 3.8,
    pceCoreYoy: 3.3,
    phase: "energy-pulse",
  },
  {
    id: "2026-05",
    label: "May",
    month: "2026-05",
    cpiYoy: 3.3,
    cpiCoreYoy: 2.6,
    pceYoy: 4.1,
    pceCoreYoy: 3.4,
    phase: "energy-pulse",
  },
  {
    id: "2026-06",
    label: "Jun",
    month: "2026-06",
    cpiYoy: 3.5,
    cpiCoreYoy: 2.6,
    pceYoy: 3.7,
    pceCoreYoy: 3.3,
    phase: "cooling",
  },
  {
    id: "2026-07",
    label: "Jul",
    month: "2026-07",
    cpiYoy: 3.4,
    cpiCoreYoy: 2.5,
    pceYoy: null,
    pceCoreYoy: null,
    phase: "cooling",
  },
];

/**
 * CPI Feb–May path is desk-interpolated to bridge disclosed Jun–Jul BLS
 * and May–Jun BEA PCE; Jun–Jul CPI and May–Jun PCE are disclosed.
 */
export const PRICE_PATH_NOTE =
  "Jun–Jul CPI YoY and May–Jun PCE YoY are disclosed (BLS/BEA). Feb–May CPI YoY path is estimated for chart continuity — treat as illustrative.";

export type EconomyId = "usa" | "eur" | "deu" | "fra" | "esp" | "ita" | "gbr" | "jpn";

export type EconomyPrice = {
  id: EconomyId;
  name: string;
  short: string;
  region: "Americas" | "Europe" | "Asia";
  julYoy: number;
  junYoy: number;
  deltaPp: number;
  measure: string;
  confidence: Confidence;
  growthProxy?: number;
  growthLabel?: string;
};

/** Cross-country July inflation vs June — disclosed EA + US; others estimated */
export const ECONOMY_PRICES: EconomyPrice[] = [
  {
    id: "usa",
    name: "United States",
    short: "US",
    region: "Americas",
    julYoy: 3.4,
    junYoy: 3.5,
    deltaPp: -0.1,
    measure: "CPI",
    confidence: "disclosed",
    growthProxy: 1.5,
    growthLabel: "Q2 SAAR",
  },
  {
    id: "eur",
    name: "Euro area",
    short: "EA",
    region: "Europe",
    julYoy: 2.9,
    junYoy: 2.8,
    deltaPp: 0.1,
    measure: "HICP",
    confidence: "disclosed",
    growthProxy: 0.4,
    growthLabel: "Q2 QoQ",
  },
  {
    id: "deu",
    name: "Germany",
    short: "DE",
    region: "Europe",
    julYoy: 2.8,
    junYoy: 2.4,
    deltaPp: 0.4,
    measure: "HICP",
    confidence: "disclosed",
  },
  {
    id: "fra",
    name: "France",
    short: "FR",
    region: "Europe",
    julYoy: 2.4,
    junYoy: 2.0,
    deltaPp: 0.4,
    measure: "HICP",
    confidence: "disclosed",
  },
  {
    id: "esp",
    name: "Spain",
    short: "ES",
    region: "Europe",
    julYoy: 3.9,
    junYoy: 3.6,
    deltaPp: 0.3,
    measure: "HICP",
    confidence: "disclosed",
  },
  {
    id: "ita",
    name: "Italy",
    short: "IT",
    region: "Europe",
    julYoy: 2.9,
    junYoy: 3.0,
    deltaPp: -0.1,
    measure: "HICP",
    confidence: "disclosed",
  },
  {
    id: "gbr",
    name: "United Kingdom",
    short: "UK",
    region: "Europe",
    julYoy: 3.6,
    junYoy: 3.5,
    deltaPp: 0.1,
    measure: "CPI",
    confidence: "estimated",
  },
  {
    id: "jpn",
    name: "Japan",
    short: "JP",
    region: "Asia",
    julYoy: 2.7,
    junYoy: 2.8,
    deltaPp: -0.1,
    measure: "CPI",
    confidence: "estimated",
  },
];

/** Energy vs core contribution bridge */
export const PRICE_COMPONENTS = [
  {
    id: "us-energy",
    economy: "US",
    label: "US energy CPI",
    yoy: 14.7,
    kind: "energy" as const,
  },
  {
    id: "us-core",
    economy: "US",
    label: "US core CPI",
    yoy: 2.5,
    kind: "core" as const,
  },
  {
    id: "us-headline",
    economy: "US",
    label: "US headline CPI",
    yoy: 3.4,
    kind: "headline" as const,
  },
  {
    id: "ea-energy",
    economy: "EA",
    label: "EA energy HICP",
    yoy: 10.3,
    kind: "energy" as const,
  },
  {
    id: "ea-core",
    economy: "EA",
    label: "EA core HICP",
    yoy: 2.5,
    kind: "core" as const,
  },
  {
    id: "ea-headline",
    economy: "EA",
    label: "EA headline HICP",
    yoy: 2.9,
    kind: "headline" as const,
  },
];

/** SAAR vs YoY unit bridge — why Q3 and Aug can both be “true” */
export const UNIT_BRIDGE = [
  {
    label: "Q2 PCE SAAR",
    value: 5.1,
    unit: "% SAAR",
    vintage: "Q3 post",
    fill: "#f59e0b",
  },
  {
    label: "Jun PCE YoY",
    value: 3.7,
    unit: "% YoY",
    vintage: "Aug post",
    fill: "#14b8a6",
  },
  {
    label: "Jul CPI YoY",
    value: 3.4,
    unit: "% YoY",
    vintage: "Aug post",
    fill: "#0ea5e9",
  },
  {
    label: "IMF US CPI 2026f",
    value: 3.6,
    unit: "%",
    vintage: "July WEO",
    fill: "#94a3b8",
  },
];

/** Held CPB monthly path (unchanged from Q3) */
export const CPB_MONTHLY = [
  { id: "2026-01", label: "Jan", mom: 2.0, phase: "pre-shock" as const },
  { id: "2026-02", label: "Feb", mom: 1.9, phase: "pre-shock" as const },
  { id: "2026-03", label: "Mar", mom: -2.1, phase: "shock" as const },
  { id: "2026-04", label: "Apr", mom: 0.7, phase: "rebound" as const },
  { id: "2026-05", label: "May", mom: 1.0, phase: "rebound" as const },
  {
    id: "2026-06",
    label: "Jun",
    mom: null as number | null,
    phase: "pending" as const,
  },
];

export const REGION_COLORS: Record<EconomyPrice["region"], string> = {
  Americas: "#0ea5e9",
  Europe: "#8b5cf6",
  Asia: "#f59e0b",
};

export const ECONOMY_COLORS: Record<EconomyId, string> = {
  usa: "#0ea5e9",
  eur: "#8b5cf6",
  deu: "#6366f1",
  fra: "#a78bfa",
  esp: "#f43f5e",
  ita: "#ec4899",
  gbr: "#64748b",
  jpn: "#14b8a6",
};

export const METER_COLORS = {
  gdp: "#0ea5e9",
  trade: "#14b8a6",
  cpi: "#f59e0b",
};

export const PHASE_COLORS: Record<PriceMonth["phase"], string> = {
  "pre-peak": "#94a3b8",
  "energy-pulse": "#f43f5e",
  cooling: "#14b8a6",
};

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function inflationDeltas(): {
  short: string;
  name: string;
  region: EconomyPrice["region"];
  delta: number;
  jul: number;
  jun: number;
  fill: string;
  measure: string;
}[] {
  return ECONOMY_PRICES.map((e) => ({
    short: e.short,
    name: e.name,
    region: e.region,
    delta: e.deltaPp,
    jul: e.julYoy,
    jun: e.junYoy,
    fill: ECONOMY_COLORS[e.id],
    measure: e.measure,
  })).sort((a, b) => b.delta - a.delta);
}

export function growthPriceScatter(): {
  id: EconomyId;
  short: string;
  name: string;
  growth: number;
  growthLabel: string;
  price: number;
  fill: string;
}[] {
  return ECONOMY_PRICES.filter((e) => e.growthProxy != null).map((e) => ({
    id: e.id,
    short: e.short,
    name: e.name,
    growth: e.growthProxy!,
    growthLabel: e.growthLabel ?? "",
    price: e.julYoy,
    fill: ECONOMY_COLORS[e.id],
  }));
}
