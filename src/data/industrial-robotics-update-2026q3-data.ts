/**
 * Industrial robotics — Q3 2026 vintage update.
 * Core question: What changed vs the prior YoY update (IFR WR 2025 / 2024 installs)
 * once IFR’s April 2026 preliminary 2025 results (Automate / Executive Roundtable,
 * June 2026) replace the flat-542k story and the +6% / 575k 2025 forecast?
 *
 * Primary sources:
 * - IFR Executive Roundtable market presentation (24 Jun 2026) — prelim 2025 global
 * - IFR press: US robot industry returns to double-digit growth (18 Jun 2026)
 * - Manufacturing Dive coverage of Automate 2026 IFR briefing
 * - Prior theme update: /blog/industrial-robotics-update-2026
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Q3 vintage delta vs prior update (IFR WR 2025 / 2024 installs + Sep 2025 forecast): IFR preliminary 2025 installations as of April 2026, presented 24 Jun 2026 (Automate / Executive Roundtable). Final World Robotics 2026 due 24 Sep 2026 — figures may revise. Regional absolute units derived from disclosed shares when IFR did not publish exact region totals. China 2025 country total not yet published; IFR estimates ~10× US.";

export const IFR_US_URL =
  "https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth";
export const IFR_ROUNDTABLE_URL =
  "https://ifr.org/downloads/press_docs/2026_06_24_IFR_Executive_Roundtable_market_presentation.pdf";
export const IFR_WR2025_URL =
  "https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years";
export const PRIOR_UPDATE_PATH = "/blog/industrial-robotics-update-2026";
export const RESEARCH_PATH = "/blog/industrial-robotics-research-2026";
export const DENSITY_PATH = "/blog/manufacturing-robot-density-ifr-2024";

export const SOURCES = [
  {
    label: "IFR — US robot industry returns to double-digit growth (Jun 2026)",
    url: IFR_US_URL,
  },
  {
    label: "IFR Executive Roundtable market presentation (24 Jun 2026)",
    url: IFR_ROUNDTABLE_URL,
  },
  {
    label: "Prior theme update — WR 2025 YoY / density / cobot lens",
    url: PRIOR_UPDATE_PATH,
  },
  {
    label: "IFR World Robotics 2025 industrial robots release",
    url: IFR_WR2025_URL,
  },
];

/** Headline delta stats — prior print vs prelim 2025 */
export const HEADLINE = {
  worldUnits2024: 542_076,
  worldUnits2025Prelim: 621_000,
  worldYoyPct: 15,
  priorForecast2025: 575_000,
  priorForecastYoyPct: 6,
  beatForecastUnits: 46_000,
  beatForecastPp: 9,
  asiaShare2024: 74,
  asiaShare2025: 79,
  asiaShareDeltaPp: 5,
  europeShare2024: 16,
  europeShare2025: 13,
  europeShareDeltaPp: -3,
  americasShare2024: 9,
  americasShare2025: 9,
  americasShareDeltaPp: 0,
  usUnits2024: 34_204,
  usUnits2025: 38_000,
  usYoyPct: 11,
  usAuto2025: 13_500,
  usAutoYoyPct: -1,
  mexicoYoyPct: -8,
  canadaYoyPct: 6,
  electronicsYoyPct: 25,
  automotiveYoyPct: 10,
  metalMachineryYoyPct: 11,
  china2024: 295_045,
  chinaEstVsUsMultiple: 10,
  chinaEst2025Approx: 380_000,
  densityWorld: 132,
  densityUs: 307,
  densityUsRank: 8,
  densityUsRankDelta: 2,
  densityKorea: 1220,
  densityGermany: 449,
  densityJapan: 446,
  densityChinaRevised: 166,
  densityChinaPriorPrint: 567,
  densityChinaRankNew: 22,
  finalReportDate: "2026-09-24",
  prelimAsOf: "2026-04",
};

export type RegionId = "Asia" | "Europe" | "Americas";

export type RegionFlow = {
  region: RegionId;
  units2024: number;
  share2024: number;
  share2025: number;
  units2025Est: number;
  yoyPctEst: number;
  priorYoyPct2024: number;
  confidence: Confidence;
  note: string;
};

/** Region absolutes for 2025 = share × 621k (estimated); 2024 from WR 2025 */
export const REGION_FLOW: RegionFlow[] = [
  {
    region: "Asia",
    units2024: 401_665,
    share2024: 74,
    share2025: 79,
    units2025Est: 490_590,
    yoyPctEst: 22,
    priorYoyPct2024: 5,
    confidence: "estimated",
    note: "Share disclosed 79%; units = 0.79 × 621k",
  },
  {
    region: "Europe",
    units2024: 85_006,
    share2024: 16,
    share2025: 13,
    units2025Est: 80_730,
    yoyPctEst: -5,
    priorYoyPct2024: -8,
    confidence: "estimated",
    note: "Share disclosed 13%; units = 0.13 × 621k",
  },
  {
    region: "Americas",
    units2024: 50_077,
    share2024: 9,
    share2025: 9,
    units2025Est: 55_890,
    yoyPctEst: 12,
    priorYoyPct2024: -10,
    confidence: "estimated",
    note: "Share disclosed 9%; units = 0.09 × 621k",
  },
];

export type MarketRow = {
  market: string;
  shortLabel: string;
  region: RegionId;
  units2024: number | null;
  units2025: number | null;
  yoyPct: number;
  priorYoyPct2024: number | null;
  confidence: Confidence;
  note?: string;
};

export const MARKET_ROWS: MarketRow[] = [
  {
    market: "United States",
    shortLabel: "US",
    region: "Americas",
    units2024: 34_204,
    units2025: 38_000,
    yoyPct: 11,
    priorYoyPct2024: -9,
    confidence: "disclosed",
    note: "Third-best US year after 2018 and 2022",
  },
  {
    market: "Canada",
    shortLabel: "Canada",
    region: "Americas",
    units2024: null,
    units2025: null,
    yoyPct: 6,
    priorYoyPct2024: null,
    confidence: "disclosed",
    note: "Food + electronics drove moderate growth",
  },
  {
    market: "Mexico",
    shortLabel: "Mexico",
    region: "Americas",
    units2024: 5_600,
    units2025: null,
    yoyPct: -8,
    priorYoyPct2024: -4,
    confidence: "disclosed",
    note: "Third straight year of contraction; trade uncertainty",
  },
  {
    market: "China",
    shortLabel: "China",
    region: "Asia",
    units2024: 295_045,
    units2025: 380_000,
    yoyPct: 29,
    priorYoyPct2024: 7,
    confidence: "estimated",
    note: "Country 2025 not published; IFR ~10× US estimate",
  },
];

export type IndustryYoy = {
  industry: string;
  shortLabel: string;
  yoyPct: number;
  scope: "global" | "us";
  units2025Approx: number | null;
  confidence: Confidence;
};

export const INDUSTRY_YOY: IndustryYoy[] = [
  {
    industry: "Electrical / electronics",
    shortLabel: "Electronics",
    yoyPct: 25,
    scope: "global",
    units2025Approx: null,
    confidence: "disclosed",
  },
  {
    industry: "Metal and machinery",
    shortLabel: "Metal/mach.",
    yoyPct: 11,
    scope: "global",
    units2025Approx: null,
    confidence: "disclosed",
  },
  {
    industry: "Automotive",
    shortLabel: "Automotive",
    yoyPct: 10,
    scope: "global",
    units2025Approx: null,
    confidence: "disclosed",
  },
  {
    industry: "US automotive",
    shortLabel: "US auto",
    yoyPct: -1,
    scope: "us",
    units2025Approx: 13_500,
    confidence: "disclosed",
  },
  {
    industry: "US food & beverage",
    shortLabel: "US food",
    yoyPct: 30,
    scope: "us",
    units2025Approx: 3_000,
    confidence: "disclosed",
  },
  {
    industry: "US metal & machinery",
    shortLabel: "US metal",
    yoyPct: -15,
    scope: "us",
    units2025Approx: 3_000,
    confidence: "disclosed",
  },
  {
    industry: "US electrical / electronics",
    shortLabel: "US electro",
    yoyPct: 0,
    scope: "us",
    units2025Approx: 3_000,
    confidence: "disclosed",
  },
  {
    industry: "US non-manufacturing / unspecified",
    shortLabel: "US non-mfg",
    yoyPct: 41,
    scope: "us",
    units2025Approx: null,
    confidence: "disclosed",
  },
];

export type ForecastPathPoint = {
  year: number;
  label: string;
  actualOrPrelim: number | null;
  priorForecast: number | null;
  kind: "actual" | "prior-forecast" | "prelim";
};

/** Path: history → prior Sep-2025 forecast → April-2026 prelim beat */
export const FORECAST_PATH: ForecastPathPoint[] = [
  {
    year: 2021,
    label: "2021",
    actualOrPrelim: 517_000,
    priorForecast: null,
    kind: "actual",
  },
  {
    year: 2022,
    label: "2022",
    actualOrPrelim: 552_946,
    priorForecast: null,
    kind: "actual",
  },
  {
    year: 2023,
    label: "2023",
    actualOrPrelim: 541_302,
    priorForecast: null,
    kind: "actual",
  },
  {
    year: 2024,
    label: "2024",
    actualOrPrelim: 542_076,
    priorForecast: null,
    kind: "actual",
  },
  {
    year: 2025,
    label: "2025e→p",
    actualOrPrelim: 621_000,
    priorForecast: 575_000,
    kind: "prelim",
  },
];

export type ShareShift = {
  region: RegionId;
  share2024: number;
  share2025: number;
  deltaPp: number;
};

export const SHARE_SHIFT: ShareShift[] = [
  { region: "Asia", share2024: 74, share2025: 79, deltaPp: 5 },
  { region: "Europe", share2024: 16, share2025: 13, deltaPp: -3 },
  { region: "Americas", share2024: 9, share2025: 9, deltaPp: 0 },
];

export type DensityRank = {
  market: string;
  shortLabel: string;
  density: number;
  rank: number | null;
  note: string;
  confidence: Confidence;
};

export const DENSITY_RANKS: DensityRank[] = [
  {
    market: "South Korea",
    shortLabel: "Korea",
    density: 1220,
    rank: 1,
    note: "Still the density ceiling",
    confidence: "disclosed",
  },
  {
    market: "Germany",
    shortLabel: "Germany",
    density: 449,
    rank: 2,
    note: "Europe’s intensity leader",
    confidence: "disclosed",
  },
  {
    market: "Japan",
    shortLabel: "Japan",
    density: 446,
    rank: 3,
    note: "Near Germany on intensity",
    confidence: "disclosed",
  },
  {
    market: "United States",
    shortLabel: "US",
    density: 307,
    rank: 8,
    note: "Up two ranks vs prior year",
    confidence: "disclosed",
  },
  {
    market: "China (revised employee base)",
    shortLabel: "China*",
    density: 166,
    rank: 22,
    note: "Methodology shift vs prior print’s 567 / top-tier rank",
    confidence: "disclosed",
  },
  {
    market: "World average",
    shortLabel: "World",
    density: 132,
    rank: null,
    note: "Global manufacturing intensity",
    confidence: "disclosed",
  },
];

export type DeltaBarRow = {
  id: string;
  label: string;
  group: "world" | "region" | "market" | "industry" | "forecast";
  priorValue: number;
  newValue: number;
  delta: number;
  unit: "pct" | "pp" | "units" | "k-units";
  priorLabel: string;
  newLabel: string;
  confidence: Confidence;
};

export const DELTA_BARS: DeltaBarRow[] = [
  {
    id: "world-yoy",
    label: "World install YoY",
    group: "world",
    priorValue: 0.1,
    newValue: 15,
    delta: 14.9,
    unit: "pp",
    priorLabel: "2024 YoY",
    newLabel: "2025 prelim YoY",
    confidence: "disclosed",
  },
  {
    id: "forecast-beat",
    label: "2025 vs Sep-25 forecast",
    group: "forecast",
    priorValue: 575_000,
    newValue: 621_000,
    delta: 46_000,
    unit: "units",
    priorLabel: "WR 2025 forecast",
    newLabel: "Prelim 2025",
    confidence: "disclosed",
  },
  {
    id: "asia-share",
    label: "Asia install share",
    group: "region",
    priorValue: 74,
    newValue: 79,
    delta: 5,
    unit: "pp",
    priorLabel: "2024 share",
    newLabel: "2025 share",
    confidence: "disclosed",
  },
  {
    id: "europe-share",
    label: "Europe install share",
    group: "region",
    priorValue: 16,
    newValue: 13,
    delta: -3,
    unit: "pp",
    priorLabel: "2024 share",
    newLabel: "2025 share",
    confidence: "disclosed",
  },
  {
    id: "us-yoy",
    label: "US install YoY",
    group: "market",
    priorValue: -9,
    newValue: 11,
    delta: 20,
    unit: "pp",
    priorLabel: "2024 YoY",
    newLabel: "2025 YoY",
    confidence: "disclosed",
  },
  {
    id: "americas-yoy",
    label: "Americas YoY (est.)",
    group: "region",
    priorValue: -10,
    newValue: 12,
    delta: 22,
    unit: "pp",
    priorLabel: "2024 YoY",
    newLabel: "2025 YoY est.",
    confidence: "estimated",
  },
  {
    id: "europe-yoy",
    label: "Europe YoY (est.)",
    group: "region",
    priorValue: -8,
    newValue: -5,
    delta: 3,
    unit: "pp",
    priorLabel: "2024 YoY",
    newLabel: "2025 YoY est.",
    confidence: "estimated",
  },
  {
    id: "asia-yoy",
    label: "Asia YoY (est.)",
    group: "region",
    priorValue: 5,
    newValue: 22,
    delta: 17,
    unit: "pp",
    priorLabel: "2024 YoY",
    newLabel: "2025 YoY est.",
    confidence: "estimated",
  },
  {
    id: "electronics",
    label: "Global electronics YoY",
    group: "industry",
    priorValue: 2,
    newValue: 25,
    delta: 23,
    unit: "pp",
    priorLabel: "2024 narrative",
    newLabel: "2025 prelim",
    confidence: "disclosed",
  },
  {
    id: "auto-global",
    label: "Global automotive YoY",
    group: "industry",
    priorValue: -8,
    newValue: 10,
    delta: 18,
    unit: "pp",
    priorLabel: "2024 contraction",
    newLabel: "2025 prelim",
    confidence: "estimated",
  },
];

export const REGION_COLORS: Record<RegionId, string> = {
  Asia: "#f59e0b",
  Europe: "#8b5cf6",
  Americas: "#0ea5e9",
};

export function fmtUnits(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 10_000) return `${Math.round(n / 1000)}k`;
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString("en-US");
}

export function fmtPct(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtYoy(n: number): string {
  return fmtPct(n, Number.isInteger(n) ? 0 : 1);
}

export type DeltaGroup = DeltaBarRow["group"] | "All";
export type IndustryScope = IndustryYoy["scope"] | "All";
export type RegionFilter = RegionId | "All";

export function deltasFor(group: DeltaGroup): DeltaBarRow[] {
  if (group === "All") return DELTA_BARS;
  return DELTA_BARS.filter((d) => d.group === group);
}

export function industriesFor(scope: IndustryScope): IndustryYoy[] {
  if (scope === "All") return INDUSTRY_YOY;
  return INDUSTRY_YOY.filter((i) => i.scope === scope);
}

export function marketsFor(region: RegionFilter): MarketRow[] {
  if (region === "All") return MARKET_ROWS;
  return MARKET_ROWS.filter((m) => m.region === region);
}

export function regionsFor(region: RegionFilter): RegionFlow[] {
  if (region === "All") return REGION_FLOW;
  return REGION_FLOW.filter((r) => r.region === region);
}
