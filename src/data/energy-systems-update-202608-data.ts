/**
 * Energy systems — August 2026 vintage update.
 * Prior theme post: energy-systems-update-2026q3 (Ember GER 2026 electricity
 * census + IEA WEI 2026 capital — renewables 33.8% > coal 33.0%; fossil gen
 * −0.2%; clean inv $2.2T vs fossils $1.2T).
 * Newest official vintage: IEA Electricity Mid-Year Update 2026 (Jul 2026) —
 * H1 2026 actuals + 2026/2027 forecasts under Strait of Hormuz / LNG shock.
 *
 * Core delta: demand accelerates to 3.6% (2026) / 3.8% (2027); renewables
 * widen lead (33%→37% by 2027) while coal generation rebounds +1.4% on
 * gas-to-coal switching; gas-fired flat; power CO₂ +1% then plateau; wholesale
 * prices diverge by LNG exposure.
 */

export type Confidence = "disclosed" | "estimated" | "secondary";

export const SOURCE_NOTE =
  "August 2026 vintage delta vs energy-systems-update-2026q3 (Ember Global Electricity Review 2026 + IEA World Energy Investment 2026). Demand growth, fuel-generation outlooks, renewables/coal/VRE shares, solar TWh adds, regional demand, wholesale price YoY, and power-sector CO₂ from IEA Electricity Mid-Year Update 2026. Primary-energy TES (fossils 86.2%) and IEA WEI capital ($3.4T / clean $2.2T) remain prior prints — this post is the electricity mid-year forecast rewrite, not a new Statistical Review. 2026–2027 figures are IEA forecasts; H1 2026 regional meters are disclosed mid-year prints.";

export const SOURCES = [
  {
    label: "IEA — Electricity Mid-Year Update 2026",
    url: "https://www.iea.org/reports/electricity-mid-year-update-2026",
  },
  {
    label: "IEA — Global electricity demand growth set to accelerate (news)",
    url: "https://www.iea.org/news/global-electricity-demand-growth-set-to-accelerate-as-power-systems-adjust-to-recent-shocks",
  },
  {
    label: "Prior theme update — Ember GER + IEA WEI Q3 vintage",
    url: "/blog/energy-systems-update-2026q3",
  },
  {
    label: "Prior EI Statistical Review update",
    url: "/blog/energy-systems-update-2026",
  },
  {
    label: "Theme research — energy systems ledger",
    url: "/blog/energy-systems-research-2026",
  },
] as const;

/** Headline meters — IEA MYU vs prior Ember/WEI update */
export const HEADLINE = {
  priorVintage: "Ember GER 2026 + IEA WEI 2026 (Q3 post)",
  newVintage: "IEA Electricity Mid-Year Update 2026",
  /** Demand path */
  demandGrowth2025Pct: 3.0,
  demandGrowth2026Pct: 3.6,
  demandGrowth2027Pct: 3.8,
  demandTwh2025: 28_600,
  demandTwh2027: 30_700,
  /** Renewables vs coal outlook */
  renewShare2025Pct: 33,
  renewShare2027Pct: 37,
  renewGenGrowth2026Pct: 8,
  renewGenGrowth2027Pct: 9,
  vreShare2025Pct: 17,
  vreShare2027Pct: 21,
  coalGenGrowth2026Pct: 1.4,
  coalGenGrowth2027Pct: -0.8,
  gasGen2026: "flat",
  gasGenNote: "Third flat year in past ten",
  nuclearGrowth2027Pct: 4,
  /** Solar */
  solarAdd2026Twh: 610,
  solarGrowth2026Pct: 23,
  solarOvertakesWind2026: true,
  priorEmberSolarAddTwh: 636,
  /** Emissions */
  powerCo2Growth2026Pct: 1.0,
  powerCo2Growth2027: "flat",
  /** Prior Ember census anchors */
  priorRenewSharePct: 33.8,
  priorCoalSharePct: 33.0,
  priorFossilGenDeltaPct: -0.2,
  priorCleanMetAllGrowth: true,
  /** Prior capital / primary carried */
  priorCleanInvTn: 2.2,
  priorFossilInvTn: 1.2,
  priorTesFossilPct: 86.2,
  /** Hormuz / LNG shock */
  lngSupplyLossPct: 20,
  /** Regional demand 2026e */
  chinaDemand2026Pct: 5.5,
  chinaDemand2025Pct: 5.2,
  indiaDemand2026Pct: 7.0,
  indiaDemand2025Pct: 1.6,
  usDemand2026Pct: 1.8,
  usDemand2027Pct: 3.0,
  euDemand2026Pct: 2.0,
  /** Wholesale Q2 2026 YoY */
  euJapanWholesaleYoyPct: 30,
  usWholesaleYoyPct: 0,
  indiaWholesaleYoyPct: 10,
  australiaWholesaleYoyPct: -45,
  /** India peak */
  indiaPeakGw: 270.8,
  indiaSolarDayPeakSharePct: 22,
} as const;

export type RegionId = "world" | "china" | "india" | "us" | "eu" | "se_asia";

/** Demand growth path by year */
export type DemandPathRow = {
  year: number;
  growthPct: number;
  twh: number | null;
  confidence: Confidence;
  note: string;
};

export const DEMAND_PATH: DemandPathRow[] = [
  {
    year: 2025,
    growthPct: 3.0,
    twh: 28_600,
    confidence: "disclosed",
    note: "Prior Ember/IEA base year; Ember printed ~2.8% elec demand growth",
  },
  {
    year: 2026,
    growthPct: 3.6,
    twh: null,
    confidence: "disclosed",
    note: "IEA MYU: accelerates despite Hormuz cost shock",
  },
  {
    year: 2027,
    growthPct: 3.8,
    twh: 30_700,
    confidence: "disclosed",
    note: "IEA MYU: >30 000 TWh; structural electrification + data centres",
  },
];

/** Regional demand growth — prior year vs 2026e */
export type RegionDemandRow = {
  id: RegionId;
  label: string;
  short: string;
  color: string;
  growth2025Pct: number;
  growth2026Pct: number;
  growth2027Pct: number | null;
  confidence: Confidence;
  note: string;
};

export const REGION_DEMAND: RegionDemandRow[] = [
  {
    id: "china",
    label: "China",
    short: "China",
    color: "#dc2626",
    growth2025Pct: 5.2,
    growth2026Pct: 5.5,
    growth2027Pct: null,
    confidence: "disclosed",
    note: "H1 2026 +5.3%; NEV / data centres / EV charging",
  },
  {
    id: "india",
    label: "India",
    short: "India",
    color: "#ea580c",
    growth2025Pct: 1.6,
    growth2026Pct: 7.0,
    growth2027Pct: 6.0,
    confidence: "disclosed",
    note: "Rebound from early-monsoon 2025; H1 ~6%; peak 270.8 GW",
  },
  {
    id: "us",
    label: "United States",
    short: "US",
    color: "#2563eb",
    growth2025Pct: 2.6,
    growth2026Pct: 1.8,
    growth2027Pct: 3.0,
    confidence: "disclosed",
    note: "Data centres + AC + industry; milder winter weighed on H1",
  },
  {
    id: "eu",
    label: "European Union",
    short: "EU",
    color: "#7c3aed",
    growth2025Pct: 1.0,
    growth2026Pct: 2.0,
    growth2027Pct: null,
    confidence: "disclosed",
    note: "H1 >2%; heating + heatwaves + EV electrification",
  },
  {
    id: "world",
    label: "World",
    short: "World",
    color: "#0f172a",
    growth2025Pct: 3.0,
    growth2026Pct: 3.6,
    growth2027Pct: 3.8,
    confidence: "disclosed",
    note: "Headline MYU path",
  },
];

/** Fuel generation outlook — growth rates 2026 / 2027 */
export type FuelOutlookRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  growth2026Pct: number;
  growth2027Pct: number;
  share2025Pct: number | null;
  share2027Pct: number | null;
  confidence: Confidence;
  note: string;
};

export const FUEL_OUTLOOK: FuelOutlookRow[] = [
  {
    id: "renewables",
    label: "All renewables",
    short: "Renew",
    color: "#22c55e",
    growth2026Pct: 8,
    growth2027Pct: 9,
    share2025Pct: 33,
    share2027Pct: 37,
    confidence: "disclosed",
    note: "Overtakes coal as #1 source in 2026; widens through 2027",
  },
  {
    id: "vre",
    label: "Solar + wind (VRE)",
    short: "VRE",
    color: "#14b8a6",
    growth2026Pct: 15,
    growth2027Pct: 14,
    share2025Pct: 17,
    share2027Pct: 21,
    confidence: "estimated",
    note: "Share path disclosed; growth rates derived from share expansion",
  },
  {
    id: "solar",
    label: "Solar PV",
    short: "Solar",
    color: "#eab308",
    growth2026Pct: 23,
    growth2027Pct: 17,
    share2025Pct: null,
    share2027Pct: null,
    confidence: "disclosed",
    note: "+610 TWh in 2026; overtakes wind as #2 renewable after hydro",
  },
  {
    id: "coal",
    label: "Coal",
    short: "Coal",
    color: "#374151",
    growth2026Pct: 1.4,
    growth2027Pct: -0.8,
    share2025Pct: 33,
    share2027Pct: null,
    confidence: "disclosed",
    note: "Rebound on gas-to-coal switching; slight decline 2027e",
  },
  {
    id: "gas",
    label: "Natural gas",
    short: "Gas",
    color: "#f59e0b",
    growth2026Pct: 0,
    growth2027Pct: 3.5,
    share2025Pct: null,
    share2027Pct: null,
    confidence: "disclosed",
    note: "Flat 2026 (3rd flat year / 10); rebound 2027 if geopolitics ease",
  },
  {
    id: "nuclear",
    label: "Nuclear",
    short: "Nuclear",
    color: "#7c3aed",
    growth2026Pct: 1.5,
    growth2027Pct: 4.2,
    share2025Pct: null,
    share2027Pct: null,
    confidence: "estimated",
    note: "Slower 2026 (delays/outages); >4% in 2027 (China/India adds)",
  },
];

/** Vintage delta table rows — prior Ember census vs IEA MYU rewrite */
export type VintageDeltaRow = {
  id: string;
  meter: string;
  prior: string;
  newest: string;
  delta: string;
  lens: "demand" | "mix" | "fossil" | "price" | "emissions";
};

export const VINTAGE_DELTA: VintageDeltaRow[] = [
  {
    id: "demand",
    meter: "World elec demand growth",
    prior: "Ember ~2.8% / IEA base 3% (2025)",
    newest: "3.6% (2026e) · 3.8% (2027e)",
    delta: "+0.6 / +0.8 pp vs 2025",
    lens: "demand",
  },
  {
    id: "demand-twh",
    meter: "World elec consumption",
    prior: "28 600 TWh (2025)",
    newest: "30 700 TWh (2027e)",
    delta: "+2 100 TWh in two years",
    lens: "demand",
  },
  {
    id: "re-coal",
    meter: "Renewables vs coal (power)",
    prior: "Ember 2025: 33.8% > 33.0%",
    newest: "RE #1 in 2026; share 33%→37% by 2027",
    delta: "Lead widens +4 pp",
    lens: "mix",
  },
  {
    id: "vre",
    meter: "VRE (solar+wind) share",
    prior: "Not a Q3 headline meter",
    newest: "17% (2025) → 21% (2027e)",
    delta: "+4 pp VRE",
    lens: "mix",
  },
  {
    id: "coal-gen",
    meter: "Coal generation YoY",
    prior: "Ember 2025: −0.6% (−63 TWh)",
    newest: "IEA 2026e: +1.4%",
    delta: "Rebound on gas→coal",
    lens: "fossil",
  },
  {
    id: "fossil-halt",
    meter: "Fossil generation story",
    prior: "Ember: fossils −0.2%; clean met all growth",
    newest: "Coal up; gas flat; CO₂ power +1%",
    delta: "Security shock rewrites 2026",
    lens: "fossil",
  },
  {
    id: "solar",
    meter: "Solar annual add",
    prior: "Ember 2025: +636 TWh (+30%)",
    newest: "IEA 2026e: +610 TWh (+23%)",
    delta: "Near-record repeat",
    lens: "mix",
  },
  {
    id: "co2",
    meter: "Power-sector CO₂",
    prior: "EI energy CO₂ +1.1% (broader)",
    newest: "Elec CO₂ +1% (2026e) · flat 2027e",
    delta: "Coal rebound shows in stack",
    lens: "emissions",
  },
  {
    id: "price",
    meter: "Wholesale power (Q2 2026)",
    prior: "Not in Q3 Ember/WEI post",
    newest: "EU/Japan >+30% · US ~0 · AU −45%",
    delta: "LNG exposure split",
    lens: "price",
  },
];

/** Wholesale price YoY — Q2 2026 */
export type WholesaleRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  yoyPct: number;
  lngExposure: "high" | "medium" | "low" | "buffered";
  confidence: Confidence;
  note: string;
};

export const WHOLESALE: WholesaleRow[] = [
  {
    id: "eu",
    label: "European Union",
    short: "EU",
    color: "#7c3aed",
    yoyPct: 30,
    lngExposure: "high",
    confidence: "disclosed",
    note: "Q2 spot average >+30% YoY with Japan",
  },
  {
    id: "japan",
    label: "Japan",
    short: "Japan",
    color: "#db2777",
    yoyPct: 30,
    lngExposure: "high",
    confidence: "disclosed",
    note: "LNG-linked power costs spiked with Hormuz",
  },
  {
    id: "india",
    label: "India",
    short: "India",
    color: "#ea580c",
    yoyPct: 10,
    lngExposure: "low",
    confidence: "disclosed",
    note: "LNG minor in power mix; <+10%",
  },
  {
    id: "us",
    label: "United States",
    short: "US",
    color: "#2563eb",
    yoyPct: 0,
    lngExposure: "buffered",
    confidence: "disclosed",
    note: "Q2 wholesale largely unchanged YoY",
  },
  {
    id: "australia",
    label: "Australia",
    short: "AU",
    color: "#16a34a",
    yoyPct: -45,
    lngExposure: "buffered",
    confidence: "disclosed",
    note: "Strong RE + batteries cut peak gas reliance",
  },
];

/** Share path — renewables / VRE / coal framing */
export type SharePathRow = {
  year: number;
  renewPct: number;
  vrePct: number;
  coalNearParity: boolean;
  note: string;
};

export const SHARE_PATH: SharePathRow[] = [
  {
    year: 2025,
    renewPct: 33,
    vrePct: 17,
    coalNearParity: true,
    note: "Near parity with coal; Ember refined to 33.8% vs 33.0%",
  },
  {
    year: 2026,
    renewPct: 35,
    vrePct: 19,
    coalNearParity: false,
    note: "IEA: renewables become #1 source (interpolated mid-path)",
  },
  {
    year: 2027,
    renewPct: 37,
    vrePct: 21,
    coalNearParity: false,
    note: "Disclosed end-point shares",
  },
];

/** Negative-price / flexibility companions */
export type FlexRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  negPriceShareH1_2026Pct: number;
  negPriceSharePriorPct: number | null;
  x: number;
  y: number;
  z: number;
  confidence: Confidence;
  note: string;
};

export const FLEX_BUBBLES: FlexRow[] = [
  {
    id: "south-australia",
    label: "South Australia",
    short: "SA",
    color: "#16a34a",
    negPriceShareH1_2026Pct: 20,
    negPriceSharePriorPct: 20,
    x: 20,
    y: -45,
    z: 40,
    confidence: "disclosed",
    note: "~20% of hours negative (with CA); AU wholesale −45%",
  },
  {
    id: "california",
    label: "California",
    short: "CA",
    color: "#0ea5e9",
    negPriceShareH1_2026Pct: 20,
    negPriceSharePriorPct: 20,
    x: 20,
    y: 5,
    z: 35,
    confidence: "disclosed",
    note: "~20% negative hours H1 2026 ≈ 2025",
  },
  {
    id: "spain",
    label: "Spain",
    short: "ES",
    color: "#eab308",
    negPriceShareH1_2026Pct: 17,
    negPriceSharePriorPct: 10,
    x: 17,
    y: 30,
    z: 30,
    confidence: "disclosed",
    note: "17% H1 2026 vs 10% in 2025",
  },
  {
    id: "nordics",
    label: "Sweden + Finland",
    short: "Nordic",
    color: "#7c3aed",
    negPriceShareH1_2026Pct: 2,
    negPriceSharePriorPct: 6,
    x: 2,
    y: 30,
    z: 25,
    confidence: "disclosed",
    note: "Fell from ~6% to 2% as flexibility rose",
  },
];

/** China fuel detail (disclosed regional growth) */
export type ChinaFuelRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  growth2026Pct: number;
  growth2027Pct: number;
  confidence: Confidence;
};

export const CHINA_FUEL: ChinaFuelRow[] = [
  { id: "solar", label: "Solar PV", short: "Solar", color: "#eab308", growth2026Pct: 27, growth2027Pct: 18, confidence: "disclosed" },
  { id: "wind", label: "Wind", short: "Wind", color: "#0ea5e9", growth2026Pct: 4.5, growth2027Pct: 25, confidence: "disclosed" },
  { id: "hydro", label: "Hydropower", short: "Hydro", color: "#0284c7", growth2026Pct: 5, growth2027Pct: 3, confidence: "estimated" },
  { id: "nuclear", label: "Nuclear", short: "Nuclear", color: "#7c3aed", growth2026Pct: 0.8, growth2027Pct: 6, confidence: "disclosed" },
  { id: "coal", label: "Coal", short: "Coal", color: "#374151", growth2026Pct: 2, growth2027Pct: 0, confidence: "disclosed" },
  { id: "gas", label: "Gas", short: "Gas", color: "#f59e0b", growth2026Pct: -1.5, growth2027Pct: 5, confidence: "disclosed" },
];

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtTwh(n: number): string {
  return `${n.toLocaleString("en-US")} TWh`;
}

export function regionDemandFiltered(
  ids: RegionId[] | "all",
): RegionDemandRow[] {
  if (ids === "all") return REGION_DEMAND;
  return REGION_DEMAND.filter((r) => ids.includes(r.id));
}

export function fuelOutlookFiltered(
  ids: string[] | "all",
): FuelOutlookRow[] {
  if (ids === "all") return FUEL_OUTLOOK;
  return FUEL_OUTLOOK.filter((f) => ids.includes(f.id));
}

export function vintageByLens(
  lens: VintageDeltaRow["lens"] | "all",
): VintageDeltaRow[] {
  if (lens === "all") return VINTAGE_DELTA;
  return VINTAGE_DELTA.filter((r) => r.lens === lens);
}

export function wholesaleByExposure(
  exposure: WholesaleRow["lngExposure"] | "all",
): WholesaleRow[] {
  if (exposure === "all") return WHOLESALE;
  return WHOLESALE.filter((w) => w.lngExposure === exposure);
}
