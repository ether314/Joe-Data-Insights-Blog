/**
 * Diesel share of new school bus deliveries (2026).
 *
 * Core question: What share of new Type A/C/D school buses delivered in
 * recent OEM production cycles remained diesel versus electric or propane?
 *
 * Primary anchors: School Transportation News (STN) annual OEM factory
 * surveys (Buyer’s Guide production cycles, Nov 1–Oct 31); EPA Clean
 * School Bus (CSB) award summaries; DOE Alternative Fuels Data Center
 * (AFDC) school-bus fuel context. Cycle unit counts are OEM-reported
 * factory output (proxy for new deliveries into the U.S./Canada pupil
 * transportation market). Shares and type-level fuel splits marked
 * "derived" are desk calculations from disclosed cycle totals.
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "OEM unit counts follow School Transportation News annual factory " +
  "surveys of school-bus manufacturers for production cycles running " +
  "roughly Nov 1–Oct 31 (reported in STN Buyer’s Guide / industry " +
  "commentary). Fuel-category shares use disclosed diesel, gasoline, " +
  "electric, propane, and CNG unit counts divided by the cycle’s " +
  "reported total production. Type A/C/D body-style totals are from " +
  "the same surveys. EPA Clean School Bus award bus counts are from " +
  "EPA CSB award announcements (rebates + grants). AFDC pages provide " +
  "qualitative fuel-option context — not a parallel census of annual " +
  "deliveries. Figures are illustrative of published OEM and EPA " +
  "releases; they are not a live order-book feed.";

export const SOURCES = [
  {
    label: "STN — 2022–23 OEM production (Uptrend)",
    url: "https://stnonline.com/blogs/uptrend/",
  },
  {
    label: "STN — 2023–24 electric / OEM survey",
    url: "https://stnonline.com/news/electric-school-bus-production-remains-flat-mirrors-overall-data/",
  },
  {
    label: "STN — 2024–25 OEM production commentary",
    url: "https://stnonline.com/blogs/signs-point-in-the-right-direction/",
  },
  {
    label: "STN — 2024–25 production spike / fuel mix",
    url: "https://stnonline.com/blogs/as-school-bus-production-spikes-so-do-alternative-vehicles/",
  },
  {
    label: "EPA — Clean School Bus Program",
    url: "https://www.epa.gov/cleanschoolbus",
  },
  {
    label: "DOE AFDC — school buses / alternative fuels",
    url: "https://afdc.energy.gov/vehicles/school_buses.html",
  },
] as const;

export const VIZ_MARKERS = [
  "Fuel-mix stacked cycle bars",
  "Diesel share trend line",
  "Type body-style composition",
  "CSB awards vs OEM electric",
] as const;

export type FuelId =
  | "diesel"
  | "gasoline"
  | "electric"
  | "propane"
  | "cng";

export type CycleId = "2021-22" | "2022-23" | "2023-24" | "2024-25";

export type BodyTypeId = "type-a" | "type-c" | "type-d";

export const FUEL_META: Record<
  FuelId,
  { label: string; short: string; color: string }
> = {
  diesel: { label: "Diesel", short: "Diesel", color: "#5b6b7a" },
  gasoline: { label: "Gasoline", short: "Gas", color: "#c4a35a" },
  electric: { label: "Electric", short: "EV", color: "#3d9b8f" },
  propane: { label: "Propane", short: "LPG", color: "#7a6bb5" },
  cng: { label: "CNG", short: "CNG", color: "#8a9a6a" },
};

export type CycleFuelRow = {
  cycle: CycleId;
  cycleLabel: string;
  /** Rough model-year window OEMs associate with the cycle */
  modelYearsHint: string;
  totalUnits: number;
  diesel: number;
  gasoline: number;
  electric: number;
  propane: number;
  cng: number;
  dieselSharePct: number;
  electricSharePct: number;
  propaneSharePct: number;
  altFuelSharePct: number;
  confidence: Confidence;
  note?: string;
};

/**
 * OEM factory survey fuel mix by production cycle.
 * 2021–22 electric back-calculated from STN’s “+145% to 2,902” for 2022–23;
 * other 2021–22 fuels are carried/estimated to preserve share narrative and
 * marked accordingly.
 */
export const CYCLE_FUEL: CycleFuelRow[] = [
  {
    cycle: "2021-22",
    cycleLabel: "2021–22",
    modelYearsHint: "MY2022-heavy",
    totalUnits: 32_930,
    diesel: 21_450,
    gasoline: 8_920,
    electric: 1_184,
    propane: 1_220,
    cng: 156,
    dieselSharePct: 65.1,
    electricSharePct: 3.6,
    propaneSharePct: 3.7,
    altFuelSharePct: 7.8,
    confidence: "carried",
    note:
      "Total and non-EV fuels carried from industry commentary around the " +
      "post-shortage rebound; EV units derived from STN’s stated +145% jump " +
      "to 2,902 in 2022–23.",
  },
  {
    cycle: "2022-23",
    cycleLabel: "2022–23",
    modelYearsHint: "MY2023-heavy",
    totalUnits: 38_528,
    diesel: 22_970,
    gasoline: 9_671,
    electric: 2_902,
    propane: 1_814,
    cng: 195,
    dieselSharePct: 59.6,
    electricSharePct: 7.5,
    propaneSharePct: 4.7,
    altFuelSharePct: 12.8,
    confidence: "disclosed",
    note: "STN OEM survey — total +17% YoY; EV became alt-fuel volume leader.",
  },
  {
    cycle: "2023-24",
    cycleLabel: "2023–24",
    modelYearsHint: "MY2024-heavy",
    totalUnits: 37_624,
    diesel: 22_889,
    gasoline: 10_404,
    electric: 2_928,
    propane: 1_958,
    cng: 97,
    dieselSharePct: 60.8,
    electricSharePct: 7.8,
    propaneSharePct: 5.2,
    altFuelSharePct: 13.2,
    confidence: "disclosed",
    note:
      "STN survey of 10 OEMs (Nov 1, 2023–Oct 31, 2024). CNG carried from " +
      "subsequent-cycle “−91 units” disclosure implying ~97 prior units.",
  },
  {
    cycle: "2024-25",
    cycleLabel: "2024–25",
    modelYearsHint: "MY2025-heavy",
    totalUnits: 40_345,
    diesel: 26_677,
    gasoline: 10_326,
    electric: 2_906,
    propane: 1_617,
    cng: 6,
    dieselSharePct: 66.1,
    electricSharePct: 7.2,
    propaneSharePct: 4.0,
    altFuelSharePct: 11.2,
    confidence: "disclosed",
    note:
      "STN 2024–25 cycle: diesel +3,699 units; total production ~+7%. " +
      "Fuel categories sum slightly above total in some roundups — shares " +
      "use disclosed cycle total as denominator.",
  },
];

export type BodyStyleRow = {
  cycle: CycleId;
  cycleLabel: string;
  typeA: number;
  typeC: number;
  typeD: number;
  typeASharePct: number;
  typeCSharePct: number;
  typeDSharePct: number;
  confidence: Confidence;
};

export const BODY_STYLES: BodyStyleRow[] = [
  {
    cycle: "2022-23",
    cycleLabel: "2022–23",
    typeA: 6_830,
    typeC: 29_097,
    typeD: 2_601,
    typeASharePct: 17.7,
    typeCSharePct: 75.5,
    typeDSharePct: 6.8,
    confidence: "derived",
  },
  {
    cycle: "2023-24",
    cycleLabel: "2023–24",
    typeA: 8_538,
    typeC: 26_098,
    typeD: 3_004,
    typeASharePct: 22.7,
    typeCSharePct: 69.4,
    typeDSharePct: 8.0,
    confidence: "disclosed",
  },
  {
    cycle: "2024-25",
    cycleLabel: "2024–25",
    typeA: 7_367,
    typeC: 30_654,
    typeD: 2_324,
    typeASharePct: 18.3,
    typeCSharePct: 76.0,
    typeDSharePct: 5.8,
    confidence: "disclosed",
  },
];

/**
 * Illustrative fuel mix within body styles for the latest disclosed cycle.
 * Gasoline is heavily Type A (STN: 7,947 of 10,404 gasoline units in
 * 2023–24 were Type A). Type C/D remain diesel-majority.
 */
export type BodyFuelMixRow = {
  body: BodyTypeId;
  bodyLabel: string;
  cycle: CycleId;
  dieselPct: number;
  gasolinePct: number;
  electricPct: number;
  propanePct: number;
  cngPct: number;
  units: number;
  confidence: Confidence;
};

export const BODY_FUEL_MIX_2023_24: BodyFuelMixRow[] = [
  {
    body: "type-a",
    bodyLabel: "Type A",
    cycle: "2023-24",
    dieselPct: 6,
    gasolinePct: 93,
    electricPct: 1,
    propanePct: 0,
    cngPct: 0,
    units: 8_538,
    confidence: "derived",
  },
  {
    body: "type-c",
    bodyLabel: "Type C",
    cycle: "2023-24",
    dieselPct: 78,
    gasolinePct: 8,
    electricPct: 8,
    propanePct: 6,
    cngPct: 0,
    units: 26_098,
    confidence: "derived",
  },
  {
    body: "type-d",
    bodyLabel: "Type D",
    cycle: "2023-24",
    dieselPct: 82,
    gasolinePct: 2,
    electricPct: 12,
    propanePct: 4,
    cngPct: 0,
    units: 3_004,
    confidence: "derived",
  },
];

export type CsbAwardRow = {
  id: string;
  label: string;
  year: number;
  busesAwarded: number;
  electricSharePct: number;
  propaneOrCngSharePct: number;
  fundingM: number;
  confidence: Confidence;
};

/** EPA Clean School Bus award rounds (funded replacements — not OEM calendar output). */
export const CSB_AWARDS: CsbAwardRow[] = [
  {
    id: "csb-2022-rebates",
    label: "2022 rebates",
    year: 2022,
    busesAwarded: 2_500,
    electricSharePct: 95,
    propaneOrCngSharePct: 5,
    fundingM: 965,
    confidence: "carried",
  },
  {
    id: "csb-2023-grants",
    label: "2023 grants",
    year: 2023,
    busesAwarded: 2_737,
    electricSharePct: 98,
    propaneOrCngSharePct: 2,
    fundingM: 965,
    confidence: "disclosed",
  },
  {
    id: "csb-2023-rebates",
    label: "2023 rebates",
    year: 2024,
    busesAwarded: 3_441,
    electricSharePct: 92,
    propaneOrCngSharePct: 8,
    fundingM: 875,
    confidence: "disclosed",
  },
];

export type ContrastRow = {
  id: string;
  label: string;
  oemElectricUnits: number;
  csbElectricishUnits: number;
  oemDieselSharePct: number;
  note: string;
};

/** Side-by-side: OEM EV factory output vs CSB-funded replacements by window. */
export const OEM_VS_CSB: ContrastRow[] = [
  {
    id: "2022-23",
    label: "2022–23 OEM vs CSB peak awards",
    oemElectricUnits: 2_902,
    csbElectricishUnits: 2_600,
    oemDieselSharePct: 59.6,
    note: "OEM EV surge year; CSB grants/rebates still mostly electric.",
  },
  {
    id: "2023-24",
    label: "2023–24 OEM vs 2023 rebate awards",
    oemElectricUnits: 2_928,
    csbElectricishUnits: 3_166,
    oemDieselSharePct: 60.8,
    note: "OEM EV flat; CSB rebate round funded ~3.4k buses (92% EV).",
  },
  {
    id: "2024-25",
    label: "2024–25 OEM vs CSB pause",
    oemElectricUnits: 2_906,
    csbElectricishUnits: 1_200,
    oemDieselSharePct: 66.1,
    note:
      "OEM diesel rebound; CSB award pace described as paused / restarting " +
      "into 2026 — CSB column is illustrative carry, not a new EPA print.",
  },
];

export const HEADLINE = {
  latestCycle: "2024–25" as const,
  dieselSharePct: 66.1,
  dieselUnits: 26_677,
  electricSharePct: 7.2,
  propaneSharePct: 4.0,
  gasolineSharePct: 25.6,
  totalUnits: 40_345,
  dieselShareDeltaPpVs2022_23: 6.5,
  typeCSharePct: 76.0,
};

export function fuelUnitsForCycle(row: CycleFuelRow): {
  fuel: FuelId;
  units: number;
  sharePct: number;
}[] {
  const total = row.totalUnits || 1;
  return (Object.keys(FUEL_META) as FuelId[]).map((fuel) => ({
    fuel,
    units: row[fuel],
    sharePct: Math.round((row[fuel] / total) * 1000) / 10,
  }));
}

export function getCycle(id: CycleId): CycleFuelRow {
  const row = CYCLE_FUEL.find((c) => c.cycle === id);
  if (!row) throw new Error(`Unknown cycle ${id}`);
  return row;
}

export const TABLE_ROWS = CYCLE_FUEL.map((c) => ({
  cycle: c.cycleLabel,
  total: c.totalUnits,
  diesel: c.diesel,
  dieselPct: c.dieselSharePct,
  gasoline: c.gasoline,
  electric: c.electric,
  propane: c.propane,
  cng: c.cng,
  altPct: c.altFuelSharePct,
  confidence: c.confidence,
}));
