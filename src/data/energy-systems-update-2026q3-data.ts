/**
 * Energy systems — Q3 2026 vintage update.
 * Prior theme post: energy-systems-update-2026 (EI Statistical Review 2026 /
 * 2025 calendar year — TES 602 EJ, fossils 86.2% of primary, solar>wind in
 * power shares, US LNG +27%, batteries 302 GW).
 * Newest official vintages: Ember Global Electricity Review 2026 (2025 power
 * census) + IEA World Energy Investment 2026 (2026e capital flows amid Middle
 * East security shock).
 *
 * Core delta: renewables overtake coal in the electricity mix (33.8% vs 33.0%);
 * clean investment ~$2.2T ≈ 1.8× fossils $1.2T; total energy investment $3.4T (+5%).
 */

export type Confidence = "disclosed" | "estimated" | "secondary";

export const SOURCE_NOTE =
  "Q3 vintage delta vs energy-systems-update-2026 (Energy Institute Statistical Review of World Energy 2026 / 2025 year). Electricity mix, demand-growth attribution, and fossil-generation halt from Ember Global Electricity Review 2026. Capital flows (total / clean / fossil / oil / gas / LNG / renewable power / nuclear) from IEA World Energy Investment 2026. Primary-energy shares (fossils 86.2% of TES) remain the prior EI print — do not average primary and electricity denominators. Investment figures are 2026e MER dollars; Ember shares are generation TWh shares.";

export const SOURCES = [
  {
    label: "IEA — World Energy Investment 2026",
    url: "https://www.iea.org/reports/world-energy-investment-2026",
  },
  {
    label: "IEA — Middle East conflict reshapes investment plans (2026 news)",
    url: "https://www.iea.org/news/impacts-of-middle-east-conflict-set-to-reshape-energy-investment-plans-as-disruptions-put-focus-on-security",
  },
  {
    label: "Ember — Global Electricity Review 2026",
    url: "https://ember-energy.org/latest-insights/global-electricity-review-2026/",
  },
  {
    label: "Prior theme update — EI Statistical Review 2026 vintage",
    url: "/blog/energy-systems-update-2026",
  },
  {
    label: "Theme research — energy systems ledger",
    url: "/blog/energy-systems-research-2026",
  },
] as const;

/** Headline meters — Q3 print and Δ vs prior EI update */
export const HEADLINE = {
  priorVintage: "EI Statistical Review 2026 (2025 year)",
  newPowerVintage: "Ember Global Electricity Review 2026",
  newCapexVintage: "IEA World Energy Investment 2026",
  /** Ember power-mix milestone */
  renewPowerSharePct: 33.8,
  coalPowerSharePct: 33.0,
  renewOvertakeCoalPp: 0.8,
  renewPowerTwh: 10730,
  coalPowerTwh: 10476,
  /** Clean met all demand growth */
  demandGrowthTwh: 849,
  demandGrowthPct: 2.8,
  lowCarbonGrowthTwh: 887,
  fossilGenDeltaTwh: -38,
  fossilGenDeltaPct: -0.2,
  solarDemandGrowthSharePct: 75,
  windSolarDemandGrowthSharePct: 99,
  /** Solar path */
  solarGenTwh: 2778,
  solarGenGrowthTwh: 636,
  solarGenGrowthPct: 30,
  solarOvertakesWind: true,
  solarVsNuclear2026: "both solar & wind expected to overtake nuclear in 2026",
  /** Prior EI anchors carried for dual-ledger contrast */
  priorTesEj: 602,
  priorTesGrowthPct: 1.7,
  priorFossilPrimaryPct: 86.2,
  priorRenewPrimaryPct: 5.9,
  priorSolarPowerSharePct: 8.7,
  priorWindPowerSharePct: 8.4,
  priorNuclearPowerSharePct: 8.8,
  priorUsLngExportGrowthPct: 27,
  priorBatteryGw: 302,
  priorBatteryGrowthPct: 66,
  priorEnergyCo2GrowthPct: 1.1,
  /** IEA WEI 2026 capital */
  totalInv2026Tn: 3.4,
  totalInvGrowthPct: 5,
  cleanInv2026Tn: 2.2,
  fossilInv2026Tn: 1.2,
  cleanToFossilRatio: 1.83,
  cleanInvSharePct: 65,
  oilInv2026Bn: 500,
  oilInvThirdYearDecline: true,
  oilInvDeltaPct: -3,
  gasInv2026Bn: 330,
  gasInvDecadeHigh: true,
  gasInvGrowthPct: 10,
  coalSupplyInvHighestSince: 2012,
  renewPowerInvBn: 665,
  solarInvBn: 365,
  windInvBn: 200,
  hydroInvBn: 75,
  renewShareOfPowerGenInvPct: 70,
  nuclearInvBn: 80,
  nuclearGwUnderConstruction: 80,
  nuclearCountriesUc: 15,
  lngFid2025Bcm: 100,
  lngFidCapexBn: 80,
  lngUsShareOfFidPct: 90,
  lngInvDoubles2026: true,
  lngUcOutsideGulfBcm: 230,
  lngIncremental2026Bcm: 40,
  gasFiredOrdersGw2025: 130,
  gasFiredPowerInv2026Bn: 120,
  lockedInShareOf2026InvPct: 75,
  chinaCleanMfgSharePct: 75,
  chinaBatterySupplyChainPct: 80,
  chinaPvWaferPct: 95,
} as const;

export type FuelId =
  | "renewables"
  | "coal"
  | "gas"
  | "oil"
  | "nuclear"
  | "hydro"
  | "solar"
  | "wind";

export const FUEL_META: Record<
  string,
  { label: string; short: string; color: string }
> = {
  renewables: { label: "All renewables", short: "Renew", color: "#22c55e" },
  coal: { label: "Coal", short: "Coal", color: "#374151" },
  gas: { label: "Natural gas", short: "Gas", color: "#f59e0b" },
  oil: { label: "Oil", short: "Oil", color: "#92400e" },
  nuclear: { label: "Nuclear", short: "Nuclear", color: "#7c3aed" },
  hydro: { label: "Hydropower", short: "Hydro", color: "#0284c7" },
  solar: { label: "Solar", short: "Solar", color: "#eab308" },
  wind: { label: "Wind", short: "Wind", color: "#0ea5e9" },
  clean: { label: "Clean (grids+storage+RE+N+eff)", short: "Clean", color: "#14b8a6" },
  fossils: { label: "Oil + gas + coal supply", short: "Fossils", color: "#64748b" },
};

/** Electricity mix — Ember 2025 census vs prior EI power-share framing */
export type PowerMixRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  sharePct: number;
  twh: number | null;
  priorEiSharePct: number | null;
  confidence: Confidence;
  note: string;
};

export const POWER_MIX: PowerMixRow[] = [
  {
    id: "renewables",
    label: "All renewables (Ember)",
    short: "Renew",
    color: "#22c55e",
    sharePct: 33.8,
    twh: 10730,
    priorEiSharePct: null,
    confidence: "disclosed",
    note: "First year renewables > coal in modern power system",
  },
  {
    id: "coal",
    label: "Coal",
    short: "Coal",
    color: "#374151",
    sharePct: 33.0,
    twh: 10476,
    priorEiSharePct: null,
    confidence: "disclosed",
    note: "Below one-third for first time; −63 TWh (−0.6%)",
  },
  {
    id: "solar",
    label: "Solar",
    short: "Solar",
    color: "#eab308",
    sharePct: 8.7,
    twh: 2778,
    priorEiSharePct: 8.7,
    confidence: "disclosed",
    note: "+636 TWh (+30%); matches prior EI power-share print",
  },
  {
    id: "wind",
    label: "Wind",
    short: "Wind",
    color: "#0ea5e9",
    sharePct: 8.4,
    twh: null,
    priorEiSharePct: 8.4,
    confidence: "estimated",
    note: "Still #2 variable RE; solar overtook in 2025",
  },
  {
    id: "nuclear",
    label: "Nuclear",
    short: "Nuclear",
    color: "#7c3aed",
    sharePct: 8.8,
    twh: null,
    priorEiSharePct: 8.8,
    confidence: "estimated",
    note: "Carried from EI; Ember expects solar+wind to overtake in 2026",
  },
];

/** Dual ledger — primary (EI) vs electricity (Ember) */
export type DualLedgerRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  primarySharePct: number | null;
  elecSharePct: number | null;
  confidence: Confidence;
  note: string;
};

export const DUAL_LEDGER: DualLedgerRow[] = [
  {
    id: "fossils",
    label: "Fossils (oil+gas+coal)",
    short: "Fossils",
    color: "#64748b",
    primarySharePct: 86.2,
    elecSharePct: null,
    confidence: "disclosed",
    note: "EI primary TES share — still dominant stock",
  },
  {
    id: "coal",
    label: "Coal",
    short: "Coal",
    color: "#374151",
    primarySharePct: 27.6,
    elecSharePct: 33.0,
    confidence: "disclosed",
    note: "Larger in power than in primary; now #2 behind all-renewables",
  },
  {
    id: "renew-ex-hydro-primary",
    label: "Renewables ex-hydro (primary)",
    short: "RE ex-H",
    color: "#16a34a",
    primarySharePct: 5.9,
    elecSharePct: null,
    confidence: "disclosed",
    note: "EI primary bucket — not comparable to Ember all-RE",
  },
  {
    id: "renew-all-elec",
    label: "All renewables (electricity)",
    short: "All RE",
    color: "#22c55e",
    primarySharePct: null,
    elecSharePct: 33.8,
    confidence: "disclosed",
    note: "Ember: solar+wind+hydro+other RE overtook coal",
  },
  {
    id: "nuclear",
    label: "Nuclear",
    short: "Nuclear",
    color: "#7c3aed",
    primarySharePct: 5.2,
    elecSharePct: 8.8,
    confidence: "estimated",
    note: "Higher weight in electricity ledger",
  },
  {
    id: "oil",
    label: "Oil",
    short: "Oil",
    color: "#92400e",
    primarySharePct: 33.4,
    elecSharePct: null,
    confidence: "estimated",
    note: "Transport-heavy; tiny in power generation",
  },
];

/** Who met 2025 electricity demand growth (Ember) */
export type DemandAttribRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  twh: number;
  shareOfDemandGrowthPct: number;
  confidence: Confidence;
  note: string;
};

export const DEMAND_ATTRIB: DemandAttribRow[] = [
  {
    id: "solar",
    label: "Solar",
    short: "Solar",
    color: "#eab308",
    twh: 636,
    shareOfDemandGrowthPct: 75,
    confidence: "disclosed",
    note: "Record +30%; China >50% of solar add",
  },
  {
    id: "wind",
    label: "Wind",
    short: "Wind",
    color: "#0ea5e9",
    twh: 205,
    shareOfDemandGrowthPct: 24,
    confidence: "estimated",
    note: "With solar = 99% of demand growth (841 TWh combined)",
  },
  {
    id: "other-clean",
    label: "Nuclear + other low-carbon",
    short: "Other LC",
    color: "#7c3aed",
    twh: 46,
    shareOfDemandGrowthPct: 5,
    confidence: "disclosed",
    note: "Pushes low-carbon total to +887 TWh vs demand +849",
  },
  {
    id: "fossils",
    label: "Fossil generation (net)",
    short: "Fossils",
    color: "#64748b",
    twh: -38,
    shareOfDemandGrowthPct: -4,
    confidence: "disclosed",
    note: "First fall since 2020; China −56 / India −52 TWh",
  },
];

/** IEA 2026e investment stack (USD bn) */
export type CapexRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  bucket: "clean" | "fossil" | "total" | "power" | "fuel";
  usdBn: number;
  priorNote: string;
  yoyPct: number | null;
  confidence: Confidence;
  note: string;
};

export const CAPEX_STACK: CapexRow[] = [
  {
    id: "total",
    label: "Total energy investment",
    short: "Total",
    color: "#0f172a",
    bucket: "total",
    usdBn: 3400,
    priorNote: "IEA 2026e",
    yoyPct: 5,
    confidence: "disclosed",
    note: "~75% of 2026e spend locked in before Middle East shock",
  },
  {
    id: "clean",
    label: "Clean (RE+N+grids+storage+eff+elec)",
    short: "Clean",
    color: "#14b8a6",
    bucket: "clean",
    usdBn: 2200,
    priorNote: "~65% of total",
    yoyPct: 7,
    confidence: "disclosed",
    note: "Almost 2× fossil supply investment",
  },
  {
    id: "fossils",
    label: "Oil + gas + coal supply",
    short: "Fossils",
    color: "#64748b",
    bucket: "fossil",
    usdBn: 1200,
    priorNote: "~35% of total",
    yoyPct: null,
    confidence: "disclosed",
    note: "Gas up; oil down third year; coal supply highest since 2012",
  },
  {
    id: "oil",
    label: "Oil supply",
    short: "Oil",
    color: "#92400e",
    bucket: "fuel",
    usdBn: 500,
    priorNote: "Third consecutive decline",
    yoyPct: -3,
    confidence: "disclosed",
    note: "Below $500B; capital discipline despite price spike",
  },
  {
    id: "gas",
    label: "Natural gas supply",
    short: "Gas",
    color: "#f59e0b",
    bucket: "fuel",
    usdBn: 330,
    priorNote: "Highest in a decade",
    yoyPct: 10,
    confidence: "disclosed",
    note: "LNG FIDs + US demand; decade-high fuel spend",
  },
  {
    id: "renew-power",
    label: "Renewable power projects",
    short: "RE power",
    color: "#22c55e",
    bucket: "power",
    usdBn: 665,
    priorNote: "70% of power-gen investment",
    yoyPct: null,
    confidence: "disclosed",
    note: "YoY soft since 2024 on cost deflation + China policy",
  },
  {
    id: "solar",
    label: "Solar power",
    short: "Solar",
    color: "#eab308",
    bucket: "power",
    usdBn: 365,
    priorNote: "~$1B / day",
    yoyPct: null,
    confidence: "disclosed",
    note: "Largest single clean-power line item",
  },
  {
    id: "wind",
    label: "Wind power",
    short: "Wind",
    color: "#0ea5e9",
    bucket: "power",
    usdBn: 200,
    priorNote: "Behind solar",
    yoyPct: null,
    confidence: "disclosed",
    note: "Second renewable power slice",
  },
  {
    id: "nuclear",
    label: "Nuclear",
    short: "Nuclear",
    color: "#7c3aed",
    bucket: "power",
    usdBn: 80,
    priorNote: "~80 GW UC / 15 countries",
    yoyPct: null,
    confidence: "disclosed",
    note: "Resurgence continues; security + firm power narrative",
  },
  {
    id: "gas-power",
    label: "Gas-fired power",
    short: "Gas Pwr",
    color: "#fb923c",
    bucket: "power",
    usdBn: 120,
    priorNote: "Orders 130 GW in 2025",
    yoyPct: null,
    confidence: "disclosed",
    note: "25-year high orders; US data-centre demand a driver",
  },
];

/** Trade / security companions — prior EI exposures + IEA LNG / mfg */
export type TradeRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  meter: "oil-import" | "lng" | "manufacturing" | "security";
  value: number;
  unit: string;
  priorValue: number | null;
  confidence: Confidence;
  note: string;
};

export const TRADE_ROWS: TradeRow[] = [
  {
    id: "india-oil",
    label: "India oil import share",
    short: "IN oil",
    color: "#f97316",
    meter: "oil-import",
    value: 86,
    unit: "% of consumption",
    priorValue: 86,
    confidence: "disclosed",
    note: "Carried from EI 2026; Hormuz shock raises cost of exposure",
  },
  {
    id: "europe-oil",
    label: "Europe oil import share",
    short: "EU oil",
    color: "#6366f1",
    meter: "oil-import",
    value: 75,
    unit: "% of consumption",
    priorValue: 75,
    confidence: "disclosed",
    note: "EI carry; IEA flags import-saving role of RE + efficiency",
  },
  {
    id: "china-oil",
    label: "China oil import share",
    short: "CN oil",
    color: "#f43f5e",
    meter: "oil-import",
    value: 73,
    unit: "% of consumption",
    priorValue: 73,
    confidence: "disclosed",
    note: "EI carry; China took ~$110B of import-bill savings path",
  },
  {
    id: "lng-fid-2025",
    label: "LNG FID capacity 2025",
    short: "LNG FID",
    color: "#0ea5e9",
    meter: "lng",
    value: 100,
    unit: "bcm sanctioned",
    priorValue: null,
    confidence: "disclosed",
    note: "Record year; ~90% of sanctioned projects in the US",
  },
  {
    id: "lng-uc-ex-gulf",
    label: "LNG UC outside Persian Gulf",
    short: "LNG UC",
    color: "#0284c7",
    meter: "lng",
    value: 230,
    unit: "bcm under construction",
    priorValue: null,
    confidence: "disclosed",
    note: "IEA: LNG investment more than doubles in 2026e vs 2025",
  },
  {
    id: "lng-add-2026",
    label: "Incremental LNG supply 2026e",
    short: "LNG +26",
    color: "#38bdf8",
    meter: "lng",
    value: 40,
    unit: "bcm",
    priorValue: 45,
    confidence: "estimated",
    note: "Cut from ~45 bcm as Qatar NFE train slips >1 year",
  },
  {
    id: "us-lng-growth",
    label: "US LNG export growth (prior EI)",
    short: "US LNG",
    color: "#2563eb",
    meter: "lng",
    value: 27,
    unit: "% YoY (2025)",
    priorValue: 27,
    confidence: "disclosed",
    note: "EI 2026 flow; IEA FID wave extends the US export lead",
  },
  {
    id: "cn-clean-mfg",
    label: "China clean-energy manufacturing",
    short: "CN mfg",
    color: "#14b8a6",
    meter: "manufacturing",
    value: 75,
    unit: "% of clean mfg investment 2025",
    priorValue: null,
    confidence: "disclosed",
    note: "80% Li-ion supply-chain capacity; 95% PV wafers",
  },
  {
    id: "locked-in",
    label: "2026 investment already locked in",
    short: "Locked",
    color: "#a855f7",
    meter: "security",
    value: 75,
    unit: "% of anticipated 2026 spend",
    priorValue: null,
    confidence: "disclosed",
    note: "IEA: most 2026e flows decided before Middle East conflict",
  },
];

/** Capex path anchors for dual-axis path panel */
export type CapexPathRow = {
  year: number;
  totalTn: number;
  cleanTn: number;
  fossilTn: number;
  confidence: Confidence;
};

export const CAPEX_PATH: CapexPathRow[] = [
  { year: 2022, totalTn: 2.7, cleanTn: 1.5, fossilTn: 1.2, confidence: "estimated" },
  { year: 2023, totalTn: 2.9, cleanTn: 1.8, fossilTn: 1.1, confidence: "estimated" },
  { year: 2024, totalTn: 3.1, cleanTn: 2.0, fossilTn: 1.1, confidence: "estimated" },
  { year: 2025, totalTn: 3.24, cleanTn: 2.05, fossilTn: 1.19, confidence: "estimated" },
  { year: 2026, totalTn: 3.4, cleanTn: 2.2, fossilTn: 1.2, confidence: "disclosed" },
];

/** Companion meters — batteries / CO₂ / orders */
export type CompanionRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  x: number;
  y: number;
  z: number;
  xLabel: string;
  yLabel: string;
  confidence: Confidence;
  note: string;
};

export const COMPANIONS: CompanionRow[] = [
  {
    id: "batteries",
    label: "Battery capacity (EI prior)",
    short: "Batt",
    color: "#22c55e",
    x: 302,
    y: 66,
    z: 144,
    xLabel: "GW installed 2025",
    yLabel: "YoY % growth",
    confidence: "disclosed",
    note: "Prior EI: 302 GW (+66%); China 144 GW — Ember: storage shifts 14% of new solar",
  },
  {
    id: "co2",
    label: "Energy CO₂ (EI prior)",
    short: "CO₂",
    color: "#ef4444",
    x: 35.8,
    y: 1.1,
    z: 40,
    xLabel: "Gt CO₂ (2025)",
    yLabel: "YoY % growth",
    confidence: "disclosed",
    note: "Prior EI: still +1.1% even as power fossils flat in Ember",
  },
  {
    id: "gas-orders",
    label: "Gas-fired plant orders",
    short: "Gas ord",
    color: "#f59e0b",
    x: 130,
    y: 120,
    z: 50,
    xLabel: "GW ordered 2025",
    yLabel: "USD bn inv 2026e",
    confidence: "disclosed",
    note: "25-year high orders; US data centres + Middle East dominate books",
  },
  {
    id: "nuclear-uc",
    label: "Nuclear under construction",
    short: "Nuc UC",
    color: "#7c3aed",
    x: 80,
    y: 80,
    z: 15,
    xLabel: "GW under construction",
    yLabel: "USD bn inv 2026e",
    confidence: "disclosed",
    note: "~80 GW across 15 countries; >$80B annual nuclear investment",
  },
];

/** Vintage delta table for prose */
export type VintageDeltaRow = {
  metric: string;
  priorPrint: string;
  q3Print: string;
  delta: string;
  source: string;
};

export const VINTAGE_TABLE: VintageDeltaRow[] = [
  {
    metric: "World TES / primary fossils",
    priorPrint: "602 EJ · fossils 86.2%",
    q3Print: "Carried (EI still newest primary print)",
    delta: "Stock unchanged",
    source: "EI → EI",
  },
  {
    metric: "Electricity renewables vs coal",
    priorPrint: "Solar 8.7% / wind 8.4% / nuclear 8.8%",
    q3Print: "All-RE 33.8% > coal 33.0%",
    delta: "+0.8 pp RE lead; coal <⅓",
    source: "EI shares → Ember",
  },
  {
    metric: "Who met elec demand growth",
    priorPrint: "Elec demand +3.0% (EI)",
    q3Print: "Solar 75% · wind+solar 99% · fossils −0.2%",
    delta: "Clean met all growth",
    source: "EI → Ember",
  },
  {
    metric: "Total energy investment",
    priorPrint: "Not in prior update",
    q3Print: "$3.4T (+5% YoY)",
    delta: "New capital ledger",
    source: "— → IEA WEI",
  },
  {
    metric: "Clean vs fossil investment",
    priorPrint: "Not in prior update",
    q3Print: "$2.2T vs $1.2T (~1.8×)",
    delta: "Clean ≈ 65% of spend",
    source: "— → IEA WEI",
  },
  {
    metric: "Oil / gas supply investment",
    priorPrint: "US LNG exports +27% (flow)",
    q3Print: "Oil <$500B (−3%) · gas $330B (+10%)",
    delta: "Gas decade-high; oil 3rd decline",
    source: "EI flow → IEA capex",
  },
  {
    metric: "LNG project pipeline",
    priorPrint: "US export growth highlight",
    q3Print: "100 bcm FID 2025 · inv doubles 2026e",
    delta: "~90% of FIDs in US",
    source: "EI → IEA",
  },
  {
    metric: "Battery / storage",
    priorPrint: "302 GW (+66%)",
    q3Print: "Same EI stock; Ember: shifts 14% of new solar",
    delta: "Anytime-solar narrative",
    source: "EI → Ember note",
  },
];

export function fmtTn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}T`;
}

export function fmtBn(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}T` : `$${n}B`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtTwh(n: number): string {
  const abs = Math.abs(n);
  const body = abs >= 1000 ? `${(abs / 1000).toFixed(2)}k` : `${abs}`;
  return n < 0 ? `−${body} TWh` : `${body} TWh`;
}

export function rankedCapex(bucket: CapexRow["bucket"] | "all" = "all"): CapexRow[] {
  const rows =
    bucket === "all" ? CAPEX_STACK.filter((r) => r.id !== "total") : CAPEX_STACK.filter((r) => r.bucket === bucket);
  return [...rows].sort((a, b) => b.usdBn - a.usdBn);
}

export function tradeByMeter(meter: TradeRow["meter"] | "all"): TradeRow[] {
  if (meter === "all") return TRADE_ROWS;
  return TRADE_ROWS.filter((r) => r.meter === meter);
}

export function dualLedgerPairs(): DualLedgerRow[] {
  return DUAL_LEDGER.filter((r) => r.primarySharePct != null || r.elecSharePct != null);
}
