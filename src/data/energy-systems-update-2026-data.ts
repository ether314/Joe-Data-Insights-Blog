/**
 * Energy systems — vintage update (Aug 2026).
 * Prior post: energy-systems-research-2026 (EI Statistical Review 2025 / 2024 year).
 * New vintage: Energy Institute Statistical Review of World Energy 2026 (2025 calendar year),
 *   with Ember/Carbon Brief electricity notes and GIIGNL-aligned LNG growth.
 *
 * Core delta: renewables largest TES growth source outside a recession (+3.3 EJ);
 *   TES crosses 600 EJ (+1.7%); fossils still ~86.2% of primary; solar overtakes wind
 *   in the power mix (8.7% vs 8.4%) and nearly matches nuclear (8.8%).
 */

export type Confidence = "disclosed" | "estimated" | "secondary";

export const SOURCE_NOTE =
  "Vintage delta: prior research post used Energy Institute Statistical Review 2025 (2024 calendar year) plus Eurostat import dependence and Ember/OWID electricity shares. This update uses Energy Institute Statistical Review of World Energy 2026 (75th edition; 2025 year) for TES, fuel growth contributions, fossil share, oil/gas/coal demand, power-mix shares, and energy-sector CO₂. US LNG export growth (+27%) and battery capacity (302 GW, +66%) follow EI 2026 highlights. Country oil-import shares (India 86% / China 73% / Europe 75%) are 2025 trade-year disclosures in the same Review. Primary-energy and electricity mixes remain different denominators — do not average them.";

export const SOURCES = [
  {
    label: "Energy Institute — Statistical Review of World Energy 2026",
    url: "https://www.energyinst.org/statistical-review",
  },
  {
    label: "Prior theme baseline — Energy systems research 2026",
    url: "/blog/energy-systems-research-2026",
  },
  {
    label: "Carbon Brief — clean power as largest new energy source 2025",
    url: "https://www.carbonbrief.org/six-charts-show-how-clean-power-was-worlds-largest-source-of-new-energy-in-2025",
  },
] as const;

/** Headline meters — 2025 print and Δ vs prior 2024 research vintage */
export const HEADLINE = {
  tes2025Ej: 602,
  tes2024Ej: 592,
  tesGrowthPct: 1.7,
  tesDeltaEj: 10,
  fossilShare2025Pct: 86.2,
  fossilShare2024Pct: 86.5,
  fossilShareDeltaPp: -0.3,
  renewablesShare2025Pct: 5.9,
  hydroShare2025Pct: 2.7,
  nuclearShare2025Pct: 5.2,
  renewGrowthEj: 3.3,
  oilGrowthEj: 2.5,
  gasGrowthEj: 2.4,
  coalGrowthEj: 1.1,
  nuclearGrowthEj: 0.4,
  hydroGrowthEj: 0.1,
  renewLargestGrowthOutsideRecession: true,
  solarShareOfRenewGrowthPct: 71,
  oilDemand2025Mbpd: 103,
  oilDemandGrowthPct: 1.3,
  oilDemandGrowth2024Pct: 1.1,
  gasDemandGrowthPct: 1.6,
  coalDemandGrowthPct: 0.7,
  elecDemandGrowthPct: 3.0,
  solarGenGrowthPct: 30,
  solarPowerShare2025Pct: 8.7,
  windPowerShare2025Pct: 8.4,
  nuclearPowerShare2025Pct: 8.8,
  solarOvertakesWind: true,
  usLngExportGrowthPct: 27,
  batteryGw2025: 302,
  batteryGrowthPct: 66,
  chinaBatteryGw: 144,
  energyCo2Mt2025: 35806,
  energyCo2GrowthPct: 1.1,
  indiaOilImportSharePct: 86,
  chinaOilImportSharePct: 73,
  europeOilImportSharePct: 75,
  usCoalDemandGrowthPct: 10,
  chinaCoalDemandGrowthPct: 0,
  priorResearchEuImportPct: 58,
  priorResearchJapanImportPct: 88,
  priorResearchLngTop3Pct: 61,
} as const;

export type FuelId = "renewables" | "oil" | "gas" | "coal" | "nuclear" | "hydro";

export const FUEL_META: Record<
  FuelId,
  { label: string; short: string; color: string }
> = {
  renewables: { label: "Renewables (ex-hydro)", short: "Renew", color: "#22c55e" },
  oil: { label: "Oil", short: "Oil", color: "#92400e" },
  gas: { label: "Natural gas", short: "Gas", color: "#f59e0b" },
  coal: { label: "Coal", short: "Coal", color: "#374151" },
  nuclear: { label: "Nuclear", short: "Nuclear", color: "#7c3aed" },
  hydro: { label: "Hydropower", short: "Hydro", color: "#0284c7" },
};

/** Absolute EJ contribution to 2025 TES growth (EI 2026). */
export type GrowthRow = {
  id: FuelId;
  label: string;
  short: string;
  color: string;
  deltaEj: number;
  confidence: Confidence;
  note: string;
};

export const TES_GROWTH: GrowthRow[] = [
  {
    id: "renewables",
    label: "Renewables (ex-hydro)",
    short: "Renew",
    color: "#22c55e",
    deltaEj: 3.3,
    confidence: "disclosed",
    note: "Largest TES growth source outside a recession; solar ~71% of renew increment",
  },
  {
    id: "oil",
    label: "Oil",
    short: "Oil",
    color: "#92400e",
    deltaEj: 2.5,
    confidence: "disclosed",
    note: "Demand to 103 mb/d; growth re-accelerated to 1.3% from 1.1% in 2024",
  },
  {
    id: "gas",
    label: "Natural gas",
    short: "Gas",
    color: "#f59e0b",
    deltaEj: 2.4,
    confidence: "disclosed",
    note: "Demand +1.6% YoY; growth concentrated in Europe, Middle East, North America",
  },
  {
    id: "coal",
    label: "Coal",
    short: "Coal",
    color: "#374151",
    deltaEj: 1.1,
    confidence: "disclosed",
    note: "Global +0.7%; China flat, US +10% on gas-to-coal power switching",
  },
  {
    id: "nuclear",
    label: "Nuclear",
    short: "Nuclear",
    color: "#7c3aed",
    deltaEj: 0.4,
    confidence: "disclosed",
    note: "Small absolute add; power share still ~8.8%",
  },
  {
    id: "hydro",
    label: "Hydropower",
    short: "Hydro",
    color: "#0284c7",
    deltaEj: 0.1,
    confidence: "disclosed",
    note: "Near-flat; hydro share of TES ~2.7%",
  },
];

/** Primary mix shares — 2024 research anchors vs 2025 EI print (world). */
export type MixVintageRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  share2024Pct: number;
  share2025Pct: number;
  confidence: Confidence;
  note: string;
};

export const PRIMARY_MIX_VINTAGE: MixVintageRow[] = [
  {
    id: "fossils",
    label: "All fossils (oil+gas+coal)",
    short: "Fossils",
    color: "#64748b",
    share2024Pct: 86.5,
    share2025Pct: 86.2,
    confidence: "disclosed",
    note: "Record-low fossil share of TES; still dominant",
  },
  {
    id: "oil",
    label: "Oil",
    short: "Oil",
    color: "#92400e",
    share2024Pct: 33.4,
    share2025Pct: 33.4,
    confidence: "estimated",
    note: "~201 EJ of ~602 EJ TES; share roughly flat while absolute demand rises",
  },
  {
    id: "coal",
    label: "Coal",
    short: "Coal",
    color: "#374151",
    share2024Pct: 27.8,
    share2025Pct: 27.6,
    confidence: "estimated",
    note: "~166 EJ; China flat, US rebound",
  },
  {
    id: "gas",
    label: "Natural gas",
    short: "Gas",
    color: "#f59e0b",
    share2024Pct: 25.3,
    share2025Pct: 25.1,
    confidence: "estimated",
    note: "~151 EJ; below 10-year average growth",
  },
  {
    id: "renewables",
    label: "Renewables (ex-hydro)",
    short: "Renew",
    color: "#22c55e",
    share2024Pct: 5.4,
    share2025Pct: 5.9,
    confidence: "disclosed",
    note: "Solar 1.7% / wind 1.6% of TES inside this bucket",
  },
  {
    id: "nuclear",
    label: "Nuclear",
    short: "Nuclear",
    color: "#7c3aed",
    share2024Pct: 5.2,
    share2025Pct: 5.2,
    confidence: "disclosed",
    note: "Share flat; absolute +0.4 EJ",
  },
  {
    id: "hydro",
    label: "Hydropower",
    short: "Hydro",
    color: "#0284c7",
    share2024Pct: 2.8,
    share2025Pct: 2.7,
    confidence: "disclosed",
    note: "Share eases as TES grows faster than hydro",
  },
];

/** Power-mix vintage — solar overtakes wind. */
export type PowerShareRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  share2024Pct: number | null;
  share2025Pct: number;
  confidence: Confidence;
  note: string;
};

export const POWER_SHARE_VINTAGE: PowerShareRow[] = [
  {
    id: "nuclear",
    label: "Nuclear",
    short: "Nuclear",
    color: "#7c3aed",
    share2024Pct: 9.0,
    share2025Pct: 8.8,
    confidence: "estimated",
    note: "Still largest of the three low-carbon peers by a hair",
  },
  {
    id: "solar",
    label: "Solar",
    short: "Solar",
    color: "#eab308",
    share2024Pct: 6.9,
    share2025Pct: 8.7,
    confidence: "disclosed",
    note: "+30% generation; overtakes wind for the first time",
  },
  {
    id: "wind",
    label: "Wind",
    short: "Wind",
    color: "#0ea5e9",
    share2024Pct: 8.2,
    share2025Pct: 8.4,
    confidence: "estimated",
    note: "Still growing; lost the #1 variable-renewable slot to solar",
  },
];

/** TES path anchors — prior research world ~620 EJ (different rounding); EI path below. */
export type TesPathRow = {
  year: number;
  tesEj: number;
  fossilSharePct: number;
  renewSharePct: number;
  confidence: Confidence;
};

export const TES_PATH: TesPathRow[] = [
  { year: 2015, tesEj: 550, fossilSharePct: 86.0, renewSharePct: 2.8, confidence: "estimated" },
  { year: 2019, tesEj: 580, fossilSharePct: 84.3, renewSharePct: 4.0, confidence: "estimated" },
  { year: 2022, tesEj: 585, fossilSharePct: 82.0, renewSharePct: 4.7, confidence: "estimated" },
  { year: 2024, tesEj: 592, fossilSharePct: 86.5, renewSharePct: 5.4, confidence: "disclosed" },
  { year: 2025, tesEj: 602, fossilSharePct: 86.2, renewSharePct: 5.9, confidence: "disclosed" },
];

/** Trade / security exposures highlighted in EI 2026. */
export type TradeExposureRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  meter: "oil-import" | "gas-import" | "lng-export-growth" | "coal-demand";
  valuePct: number;
  priorPct: number | null;
  confidence: Confidence;
  note: string;
};

export const TRADE_EXPOSURES: TradeExposureRow[] = [
  {
    id: "india-oil",
    label: "India — oil import share of consumption",
    short: "IN oil",
    color: "#f97316",
    meter: "oil-import",
    valuePct: 86,
    priorPct: null,
    confidence: "disclosed",
    note: "Highest major demand-center oil import share in EI 2026 highlight",
  },
  {
    id: "europe-oil",
    label: "Europe — oil import share of consumption",
    short: "EU oil",
    color: "#6366f1",
    meter: "oil-import",
    valuePct: 75,
    priorPct: null,
    confidence: "disclosed",
    note: "Hormuz / Middle East chokepoint exposure remains structural",
  },
  {
    id: "china-oil",
    label: "China — oil import share of consumption",
    short: "CN oil",
    color: "#f43f5e",
    meter: "oil-import",
    valuePct: 73,
    priorPct: null,
    confidence: "disclosed",
    note: "Still a large absolute importer despite coal-heavy primary mix",
  },
  {
    id: "europe-gas",
    label: "Europe — gas import share of supply",
    short: "EU gas",
    color: "#8b5cf6",
    meter: "gas-import",
    valuePct: 50,
    priorPct: null,
    confidence: "disclosed",
    note: "Roughly half of supply imported (EI 2026)",
  },
  {
    id: "india-gas",
    label: "India — gas import share of supply",
    short: "IN gas",
    color: "#ea580c",
    meter: "gas-import",
    valuePct: 50,
    priorPct: null,
    confidence: "disclosed",
    note: "Same ~half-imported gas dependence as Europe",
  },
  {
    id: "china-gas",
    label: "China — gas import share of supply",
    short: "CN gas",
    color: "#fb7185",
    meter: "gas-import",
    valuePct: 35,
    priorPct: null,
    confidence: "estimated",
    note: "EI: over a third of supply imported",
  },
  {
    id: "us-lng",
    label: "US LNG export volume growth (YoY)",
    short: "US LNG",
    color: "#0ea5e9",
    meter: "lng-export-growth",
    valuePct: 27,
    priorPct: null,
    confidence: "disclosed",
    note: "Reinforces US net-exporter stance from the research post",
  },
  {
    id: "us-coal",
    label: "US coal demand growth (YoY)",
    short: "US coal",
    color: "#475569",
    meter: "coal-demand",
    valuePct: 10,
    priorPct: 0,
    confidence: "disclosed",
    note: "Gas-price spike flipped power-plant economics toward coal",
  },
  {
    id: "china-coal",
    label: "China coal demand growth (YoY)",
    short: "CN coal",
    color: "#1e293b",
    meter: "coal-demand",
    valuePct: 0,
    priorPct: null,
    confidence: "disclosed",
    note: "Flat YoY as solar surged and coking-coal demand softened",
  },
];

/** Country-system deltas vs research post (import stance / mix stress). */
export type SystemDeltaRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  researchMetric: string;
  researchValue: number;
  updateMetric: string;
  updateValue: number;
  unit: string;
  confidence: Confidence;
  note: string;
};

export const SYSTEM_DELTAS: SystemDeltaRow[] = [
  {
    id: "world-tes",
    label: "World total energy supply",
    short: "World TES",
    color: "#0ea5e9",
    researchMetric: "TES 2024e (research)",
    researchValue: 592,
    updateMetric: "TES 2025 (EI 2026)",
    updateValue: 602,
    unit: "EJ",
    confidence: "disclosed",
    note: "+1.7% / ~+10 EJ; first print above 600 EJ",
  },
  {
    id: "world-fossil",
    label: "World fossil share of TES",
    short: "Fossil %",
    color: "#64748b",
    researchMetric: "Fossil share 2024",
    researchValue: 86.5,
    updateMetric: "Fossil share 2025",
    updateValue: 86.2,
    unit: "pp",
    confidence: "disclosed",
    note: "Record-low share; absolute fossil EJ still rose",
  },
  {
    id: "renew-growth",
    label: "Renewables contribution to TES growth",
    short: "Renew Δ",
    color: "#22c55e",
    researchMetric: "Not lead growth source (2024 vintage)",
    researchValue: 0,
    updateMetric: "Renewables ΔEJ 2025",
    updateValue: 3.3,
    unit: "EJ",
    confidence: "disclosed",
    note: "Largest growth source outside a recession",
  },
  {
    id: "solar-power",
    label: "Solar share of world electricity",
    short: "Solar TWh%",
    color: "#eab308",
    researchMetric: "Solar < wind (2024e)",
    researchValue: 6.9,
    updateMetric: "Solar power share 2025",
    updateValue: 8.7,
    unit: "%",
    confidence: "disclosed",
    note: "Overtakes wind (8.4%); nearly matches nuclear (8.8%)",
  },
  {
    id: "us-lng",
    label: "US LNG export growth",
    short: "US LNG",
    color: "#38bdf8",
    researchMetric: "Net exporter stance (stock)",
    researchValue: 0,
    updateMetric: "LNG export YoY growth",
    updateValue: 27,
    unit: "%",
    confidence: "disclosed",
    note: "Flow confirmation of the research post’s US net-exporter ledger",
  },
  {
    id: "eu-import",
    label: "EU energy import dependence (research stock)",
    short: "EU dep.",
    color: "#6366f1",
    researchMetric: "Eurostat import dependence",
    researchValue: 58,
    updateMetric: "Still structural (no new Eurostat flip)",
    updateValue: 58,
    unit: "%",
    confidence: "secondary",
    note: "Update does not replace Eurostat; EI oil import share for Europe is 75%",
  },
];

/** Emissions / storage companion meters. */
export type CompanionMeter = {
  id: string;
  label: string;
  short: string;
  color: string;
  value: number;
  prior: number | null;
  unit: string;
  growthPct: number | null;
  confidence: Confidence;
  note: string;
};

export const COMPANION_METERS: CompanionMeter[] = [
  {
    id: "co2",
    label: "Energy-sector CO₂",
    short: "CO₂",
    color: "#ef4444",
    value: 35806,
    prior: 35416,
    unit: "Mt",
    growthPct: 1.1,
    confidence: "disclosed",
    note: "US contributed more than a third of the absolute rise",
  },
  {
    id: "battery",
    label: "Installed battery storage",
    short: "Battery",
    color: "#14b8a6",
    value: 302,
    prior: 182,
    unit: "GW",
    growthPct: 66,
    confidence: "disclosed",
    note: "China ~144 GW — just under half of global capacity",
  },
  {
    id: "oil-mbpd",
    label: "World oil demand",
    short: "Oil",
    color: "#92400e",
    value: 103,
    prior: 101.7,
    unit: "mb/d",
    growthPct: 1.3,
    confidence: "disclosed",
    note: "Growth re-accelerated vs 1.1% in 2024",
  },
];

export function rankedGrowth(): GrowthRow[] {
  return [...TES_GROWTH].sort((a, b) => b.deltaEj - a.deltaEj);
}

export function mixShareDeltas() {
  return PRIMARY_MIX_VINTAGE.map((r) => ({
    ...r,
    deltaPp: Math.round((r.share2025Pct - r.share2024Pct) * 10) / 10,
  })).sort((a, b) => a.deltaPp - b.deltaPp);
}

export function powerShareDeltas() {
  return POWER_SHARE_VINTAGE.map((r) => ({
    ...r,
    prior: r.share2024Pct,
    neu: r.share2025Pct,
    deltaPp:
      r.share2024Pct == null
        ? null
        : Math.round((r.share2025Pct - r.share2024Pct) * 10) / 10,
  }));
}

export function tradeByMeter(
  meter: TradeExposureRow["meter"] | "all",
): TradeExposureRow[] {
  const rows =
    meter === "all"
      ? TRADE_EXPOSURES
      : TRADE_EXPOSURES.filter((r) => r.meter === meter);
  return [...rows].sort((a, b) => b.valuePct - a.valuePct);
}

export function systemDumbbells() {
  return SYSTEM_DELTAS.filter((r) => r.unit !== "EJ" || r.id === "world-tes").map(
    (r) => ({
      short: r.short,
      color: r.color,
      prior: r.researchValue,
      neu: r.updateValue,
      delta: Math.round((r.updateValue - r.researchValue) * 10) / 10,
      unit: r.unit,
      label: r.label,
    }),
  );
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtEj(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} EJ`;
}

export function fmtNum(n: number, digits = 0): string {
  return n.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}
