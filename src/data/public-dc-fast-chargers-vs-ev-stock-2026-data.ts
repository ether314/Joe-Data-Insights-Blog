/**
 * Public DC fast chargers vs EV / BEV stock (2026).
 *
 * Core question: Which countries have the worst public DC-fast chargers
 * per battery-electric vehicle, and is the gap closing?
 *
 * Primary anchors: IEA Global EV Outlook 2025 & 2026 (charging chapters);
 * US DOE Alternative Fuels Data Center (AFDC) public DC Fast ports;
 * EAFO / country submissions as cited by IEA.
 *
 * IEA power bands: slow ≤22 kW; fast >22–150 kW; ultra-fast ≥150 kW.
 * “DCFC” here = public fast + ultra-fast ports (DC-class corridor/hub stock).
 * US AFDC “DC Fast” ports are used for the US series where noted.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Ratios blend IEA Global EV Outlook 2025–2026 public charging stock and electric light-duty vehicle (LDV) fleet figures (country submissions, EV Volumes, EAFO, US AFDC, BNEF) with DOE AFDC public DC Fast port counts for the United States. IEA classifies chargers as slow (≤22 kW), fast (>22–150 kW), and ultra-fast (≥150 kW); DCFC in this desk equals public fast + ultra-fast ports unless AFDC DC Fast is labeled. Where official BEV-only stock is not published beside DCFC stock, BEV counts are estimated from IEA electric-LDV totals and reported BEV shares and flagged estimated/carried. kW-per-EV uses IEA’s published capacity assumptions. Highway-coverage and home-charging context are IEA narrative indicators, not station-level utilization. Analytical ranks (BEVs per DCFC) are desk maths — not a utilization or queue-time model.";

export const SOURCES = [
  {
    label: "IEA — Global EV Outlook 2025 (electric vehicle charging)",
    url: "https://www.iea.org/reports/global-ev-outlook-2025/electric-vehicle-charging",
  },
  {
    label: "IEA — Global EV Outlook 2026 (electric vehicle charging)",
    url: "https://www.iea.org/reports/global-ev-outlook-2026/electric-vehicle-charging-chap-6-and-10",
  },
  {
    label:
      "IEA chart — electric LDVs per public charging point & kW per EV (2025)",
    url: "https://www.iea.org/data-and-statistics/charts/number-of-electric-light-duty-vehicles-per-public-charging-point-and-kilowatt-per-electric-light-duty-vehicle-2025",
  },
  {
    label: "US DOE AFDC — Alternative Fueling Station Locator / trends",
    url: "https://afdc.energy.gov/fuels/electricity-infrastructure-trends",
  },
  {
    label: "US DOE AFDC — station counts by state (electric ports)",
    url: "https://afdc.energy.gov/stations/states",
  },
] as const;

/** Headline punchline — BEVs (or electric LDV proxy) per public DCFC */
export const HEADLINE = {
  /** US electric LDVs per public charging point (all speeds), end-2025 — IEA */
  usEvsPerPublicCharger2025: 33,
  /** Global electric LDVs per public charging point, end-2025 — IEA */
  worldEvsPerPublicCharger2025: 11,
  /** Korea electric LDVs per public charging point, end-2025 — IEA */
  koreaEvsPerPublicCharger2025: 2.1,
  /** China public fast+ultra-fast ports, end-2025 (M) — IEA */
  chinaDcfcMillion2025: 2.2,
  /** US public fast+ultra-fast ports, end-2025 — IEA */
  usDcfc2025: 70_000,
  /** AFDC public DC Fast ports, ~Jan 2026 */
  usAfdcDcFastPortsJan2026: 67_916,
  /** AFDC public DC Fast ports, mid-Dec 2024 */
  usAfdcDcFastPortsDec2024: 50_428,
  /** Global public charging points, end-2025 (M) — IEA */
  worldPublicChargersMillion2025: 7.0,
  /** Global public kW per electric LDV, end-2025 — IEA */
  worldKwPerEv2025: 4.5,
  /** US public kW per electric LDV, end-2025 — IEA */
  usKwPerEv2025: 1.5,
  /** Korea public kW per electric LDV, end-2025 — IEA */
  koreaKwPerEv2025: 9.0,
  /**
   * Desk: US BEV stock (~4.0M end-2025 est.) / AFDC DCFC ports (~68k) ≈ 59
   * BEVs per public DC Fast port — worst among large markets in this panel.
   */
  usBevsPerAfdcDcfc2025: 59,
  /** Desk: Korea BEV-heavy stock / fast+ultra ports ≈ 8 BEVs per DCFC */
  koreaBevsPerDcfc2025: 8,
  /** US vs Korea multiple on BEV-per-DCFC (59/8) */
  usVsKoreaBevPerDcfcMultiple: 7.4,
} as const;

export type MarketId =
  | "us"
  | "uk"
  | "brazil"
  | "thailand"
  | "mexico"
  | "norway"
  | "germany"
  | "france"
  | "netherlands"
  | "china"
  | "eu"
  | "korea"
  | "india"
  | "japan";

export type MarketRow = {
  id: MarketId;
  label: string;
  region: "Americas" | "Europe" | "Asia-Pacific" | "Emerging";
  /** Battery-electric LDV stock, thousands */
  bevStockK: number;
  /** Public DC-class ports (fast + ultra-fast), thousands */
  dcfcK: number;
  /** BEVs per public DCFC port */
  bevsPerDcfc: number;
  /** Electric LDVs per public charging point (all speeds) — IEA */
  evsPerPublicCharger: number;
  /** Public charging capacity kW per electric LDV — IEA */
  kwPerEv: number;
  /** Home-charging access context (qualitative) */
  homeAccess: "high" | "medium" | "low";
  year: 2025;
  confidence: Confidence;
  note: string;
};

/**
 * End-2025 cross-section. BEV stock and DCFC where not directly published
 * are estimated from IEA electric-LDV / fast+ultra stock and market BEV shares.
 */
export const MARKETS_2025: MarketRow[] = [
  {
    id: "us",
    label: "United States",
    region: "Americas",
    bevStockK: 4000,
    dcfcK: 68,
    bevsPerDcfc: 59,
    evsPerPublicCharger: 33,
    kwPerEv: 1.5,
    homeAccess: "high",
    year: 2025,
    confidence: "estimated",
    note: "IEA: 33 EVs/public point, ~70k fast+ultra; AFDC ~68k DC Fast ports (Jan 2026). BEV stock desk estimate from electric LDV stock.",
  },
  {
    id: "uk",
    label: "United Kingdom",
    region: "Europe",
    bevStockK: 1100,
    dcfcK: 22,
    bevsPerDcfc: 50,
    evsPerPublicCharger: 18,
    kwPerEv: 1.8,
    homeAccess: "high",
    year: 2025,
    confidence: "estimated",
    note: "IEA: public points ~116k end-2025; UK historically leaner on public points vs Germany given higher home access.",
  },
  {
    id: "brazil",
    label: "Brazil",
    region: "Emerging",
    bevStockK: 180,
    dcfcK: 3.5,
    bevsPerDcfc: 51,
    evsPerPublicCharger: 24,
    kwPerEv: 1.0,
    homeAccess: "medium",
    year: 2025,
    confidence: "estimated",
    note: "IEA: EVs per public point rose 17→24 as stock +80% outpaced +35% charger growth; PHEV share ~55% of electric LDVs.",
  },
  {
    id: "thailand",
    label: "Thailand",
    region: "Emerging",
    bevStockK: 220,
    dcfcK: 7.2,
    bevsPerDcfc: 31,
    evsPerPublicCharger: 30,
    kwPerEv: 2.2,
    homeAccess: "medium",
    year: 2025,
    confidence: "estimated",
    note: "IEA: EVs per public charger 19→30; ~12k public chargers, fast ~60% of stock.",
  },
  {
    id: "mexico",
    label: "Mexico",
    region: "Emerging",
    bevStockK: 95,
    dcfcK: 1.4,
    bevsPerDcfc: 68,
    evsPerPublicCharger: 28,
    kwPerEv: 1.1,
    homeAccess: "medium",
    year: 2025,
    confidence: "estimated",
    note: "IEA: electric LDV stock more than doubled; public points +<25% to ~4k — coverage deteriorated sharply.",
  },
  {
    id: "norway",
    label: "Norway",
    region: "Europe",
    bevStockK: 750,
    dcfcK: 12,
    bevsPerDcfc: 63,
    evsPerPublicCharger: 28,
    kwPerEv: 1.6,
    homeAccess: "high",
    year: 2025,
    confidence: "estimated",
    note: "Mature BEV fleet; IEA notes ~90% home charging access and highway-dense fast stock (~20% of points on highways).",
  },
  {
    id: "germany",
    label: "Germany",
    region: "Europe",
    bevStockK: 1600,
    dcfcK: 45,
    bevsPerDcfc: 36,
    evsPerPublicCharger: 12,
    kwPerEv: 2.4,
    homeAccess: "medium",
    year: 2025,
    confidence: "estimated",
    note: "IEA: ~196k public points end-2025; higher apartment share vs UK raises public-AC need alongside DCFC.",
  },
  {
    id: "france",
    label: "France",
    region: "Europe",
    bevStockK: 1200,
    dcfcK: 40,
    bevsPerDcfc: 30,
    evsPerPublicCharger: 11,
    kwPerEv: 2.5,
    homeAccess: "medium",
    year: 2025,
    confidence: "estimated",
    note: "Strong ultra-fast push (Charge France path toward 40k ultra-fast by 2028 per IEA 2025).",
  },
  {
    id: "netherlands",
    label: "Netherlands",
    region: "Europe",
    bevStockK: 450,
    dcfcK: 8,
    bevsPerDcfc: 56,
    evsPerPublicCharger: 8,
    kwPerEv: 3.5,
    homeAccess: "medium",
    year: 2025,
    confidence: "estimated",
    note: "Europe’s largest public point stock (~210k) is AC-heavy; DCFC density still middling vs BEV fleet.",
  },
  {
    id: "china",
    label: "China",
    region: "Asia-Pacific",
    bevStockK: 28_000,
    dcfcK: 2200,
    bevsPerDcfc: 13,
    evsPerPublicCharger: 10,
    kwPerEv: 6.0,
    homeAccess: "low",
    year: 2025,
    confidence: "estimated",
    note: "IEA: 4.7M public points; fast+ultra 2.2M; ~10 EVs/public point; ~6 kW/EV — densest major-market DC build.",
  },
  {
    id: "eu",
    label: "European Union",
    region: "Europe",
    bevStockK: 7500,
    dcfcK: 180,
    bevsPerDcfc: 42,
    evsPerPublicCharger: 11,
    kwPerEv: 3.0,
    homeAccess: "medium",
    year: 2025,
    confidence: "estimated",
    note: "IEA: ~11 EVs/public point; ~3 kW/EV; AFIR corridor mandates for ≥150 kW every 60 km on TEN-T core.",
  },
  {
    id: "korea",
    label: "Korea",
    region: "Asia-Pacific",
    bevStockK: 420,
    dcfcK: 51,
    bevsPerDcfc: 8,
    evsPerPublicCharger: 2.1,
    kwPerEv: 9.0,
    homeAccess: "medium",
    year: 2025,
    confidence: "estimated",
    note: "IEA: just over 2 EVs/public point; >9 kW/EV — best capacity coverage in the panel; fast stock 47k→51k.",
  },
  {
    id: "india",
    label: "India",
    region: "Emerging",
    bevStockK: 550,
    dcfcK: 18,
    bevsPerDcfc: 31,
    evsPerPublicCharger: 8,
    kwPerEv: 2.8,
    homeAccess: "low",
    year: 2025,
    confidence: "estimated",
    note: "IEA: ~88k public points end-2025 (+15%); oil-marketing companies built ~8k fast points under FAME II.",
  },
  {
    id: "japan",
    label: "Japan",
    region: "Asia-Pacific",
    bevStockK: 280,
    dcfcK: 12,
    bevsPerDcfc: 23,
    evsPerPublicCharger: 9,
    kwPerEv: 3.2,
    homeAccess: "medium",
    year: 2025,
    confidence: "carried",
    note: "Carried from IEA regional framing; CHAdeMO/legacy fast stock still material vs BEV fleet size.",
  },
];

/** Time series: electric LDVs per public charging point (all speeds) — gap metric */
export type RatioPathPoint = {
  year: number;
  us: number;
  china: number;
  eu: number;
  korea: number;
  world: number;
};

export const EVS_PER_CHARGER_PATH: RatioPathPoint[] = [
  { year: 2020, us: 19, china: 9, eu: 12, korea: 3.5, world: 10 },
  { year: 2021, us: 21, china: 9.5, eu: 12.5, korea: 3.2, world: 10.5 },
  { year: 2022, us: 24, china: 10, eu: 13, korea: 2.8, world: 11 },
  { year: 2023, us: 27, china: 10, eu: 14.5, korea: 2.5, world: 11.5 },
  { year: 2024, us: 30, china: 10, eu: 13, korea: 2.3, world: 11 },
  { year: 2025, us: 33, china: 10, eu: 11, korea: 2.1, world: 11 },
];

/** DC-class port stock path (thousands) */
export type DcfcPathPoint = {
  year: number;
  chinaK: number;
  usK: number;
  euFastPlusUltraK: number;
  koreaK: number;
};

export const DCFC_STOCK_PATH: DcfcPathPoint[] = [
  { year: 2022, chinaK: 760, usK: 28, euFastPlusUltraK: 70, koreaK: 28 },
  { year: 2023, chinaK: 1200, usK: 40, euFastPlusUltraK: 100, koreaK: 34 },
  { year: 2024, chinaK: 1600, usK: 52, euFastPlusUltraK: 148, koreaK: 47 },
  { year: 2025, chinaK: 2200, usK: 70, euFastPlusUltraK: 190, koreaK: 51 },
];

/** US AFDC DC Fast ports path */
export const US_AFDC_DCFC_PATH = [
  { yearLabel: "2023-H1", ports: 32_000 },
  { yearLabel: "2023-H2", ports: 38_000 },
  { yearLabel: "2024-H1", ports: 44_000 },
  { yearLabel: "2024-12", ports: 50_428 },
  { yearLabel: "2025-07", ports: 60_000 },
  { yearLabel: "2026-01", ports: 67_916 },
] as const;

/** Public kW per electric LDV — capacity adequacy */
export const KW_PER_EV_2025 = [
  { id: "korea", label: "Korea", kw: 9.0 },
  { id: "china", label: "China", kw: 6.0 },
  { id: "world", label: "World", kw: 4.5 },
  { id: "netherlands", label: "Netherlands", kw: 3.5 },
  { id: "japan", label: "Japan", kw: 3.2 },
  { id: "eu", label: "EU", kw: 3.0 },
  { id: "india", label: "India", kw: 2.8 },
  { id: "france", label: "France", kw: 2.5 },
  { id: "germany", label: "Germany", kw: 2.4 },
  { id: "thailand", label: "Thailand", kw: 2.2 },
  { id: "uk", label: "United Kingdom", kw: 1.8 },
  { id: "norway", label: "Norway", kw: 1.6 },
  { id: "us", label: "United States", kw: 1.5 },
  { id: "mexico", label: "Mexico", kw: 1.1 },
  { id: "brazil", label: "Brazil", kw: 1.0 },
] as const;

/** Gap-closing: YoY change in EVs per public charger (positive = coverage worsened) */
export const GAP_DELTA_2024_2025 = [
  { id: "mexico", label: "Mexico", delta: 14, direction: "worsened" as const },
  { id: "thailand", label: "Thailand", delta: 11, direction: "worsened" as const },
  { id: "brazil", label: "Brazil", delta: 7, direction: "worsened" as const },
  { id: "us", label: "United States", delta: 3, direction: "worsened" as const },
  { id: "uk", label: "United Kingdom", delta: 2, direction: "worsened" as const },
  { id: "china", label: "China", delta: 0, direction: "stable" as const },
  { id: "korea", label: "Korea", delta: -0.2, direction: "improved" as const },
  { id: "eu", label: "European Union", delta: -2, direction: "improved" as const },
] as const;

/** Charger mix share of public points that are fast+ultra (approx.) */
export const FAST_SHARE_2025 = [
  { id: "china", label: "China", fastSharePct: 47, slowSharePct: 53 },
  { id: "korea", label: "Korea", fastSharePct: 55, slowSharePct: 45 },
  { id: "thailand", label: "Thailand", fastSharePct: 60, slowSharePct: 40 },
  { id: "us", label: "United States", fastSharePct: 30, slowSharePct: 70 },
  { id: "eu", label: "European Union", fastSharePct: 18, slowSharePct: 82 },
  { id: "netherlands", label: "Netherlands", fastSharePct: 8, slowSharePct: 92 },
  { id: "brazil", label: "Brazil", fastSharePct: 22, slowSharePct: 78 },
] as const;

/** Scatter: home access score (1–3) vs BEVs per DCFC */
export const HOME_VS_DCFC_SCATTER = MARKETS_2025.map((m) => ({
  id: m.id,
  label: m.label,
  bevsPerDcfc: m.bevsPerDcfc,
  homeScore: m.homeAccess === "high" ? 3 : m.homeAccess === "medium" ? 2 : 1,
  kwPerEv: m.kwPerEv,
  region: m.region,
}));

export function marketsByBevsPerDcfc(desc = true): MarketRow[] {
  const rows = [...MARKETS_2025];
  rows.sort((a, b) =>
    desc ? b.bevsPerDcfc - a.bevsPerDcfc : a.bevsPerDcfc - b.bevsPerDcfc,
  );
  return rows;
}

export function fmtInt(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export function fmt1(n: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(n);
}

export function fmtRatio(n: number): string {
  return `${fmt1(n)}∶1`;
}
