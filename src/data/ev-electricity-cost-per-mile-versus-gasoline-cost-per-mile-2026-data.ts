/**
 * EV electricity cost per mile versus gasoline cost per mile (2026).
 *
 * Core question: Using EIA residential electricity and gasoline prices,
 * how does a typical EV kWh/mile compare with a typical ICE mpg?
 *
 * Primary anchors: EIA Electric Power Monthly Table 5.3 (residential
 * average revenue per kWh); EIA weekly retail gasoline annual averages
 * (regular all formulations); DOE Fact of the Week / FuelEconomy.gov
 * efficiency ranges for MY2024 EVs and gasoline vehicles.
 *
 * Cost formulas (desk-derived):
 *   EV ¢/mi = (residential ¢/kWh) × (kWh/mi)
 *   ICE ¢/mi = (gasoline $/gal × 100) / mpg
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "Residential electricity prices are EIA Electric Power Monthly " +
  "average revenue per kilowatt-hour for the residential sector " +
  "(Table 5.3), including taxes — a revenue/sales proxy, not a " +
  "quoted residential tariff schedule. Gasoline prices are EIA " +
  "annual averages of weekly retail regular-grade prices (all " +
  "formulations), including taxes. Efficiency anchors follow DOE " +
  "FOTW #1373 / FuelEconomy.gov MY2024 ranges (EV mi/kWh and " +
  "gasoline mpg). Cents-per-mile figures marked derived multiply " +
  "those price series by illustrative efficiency assumptions. " +
  "Home Level-2 charging is the default electricity path; public " +
  "DC fast charging is typically higher per kWh and is not the " +
  "headline series. Figures are illustrative of published EIA/DOE " +
  "releases — not a live pump or utility bill feed.";

export const SOURCES = [
  {
    label: "EIA — Electric Power Monthly Table 5.3 (avg price by sector)",
    url: "https://www.eia.gov/electricity/monthly/epm_table_grapher.cfm?t=epmt_5_3",
  },
  {
    label: "EIA — Retail prices for regular gasoline (annual)",
    url: "https://www.eia.gov/dnav/pet/pet_pri_gnd_a_epmr_pte_dpgal_a.htm",
  },
  {
    label: "EIA — Today in Energy: 2025 retail gasoline average",
    url: "https://www.eia.gov/todayinenergy/detail.php?id=66964",
  },
  {
    label: "EIA — Electric Sales, Revenue, and Average Price",
    url: "https://www.eia.gov/electricity/sales_revenue_price/",
  },
  {
    label: "DOE FOTW #1373 — MY2024 EV efficiency ranges",
    url: "https://www.energy.gov/eere/vehicles/articles/fotw-1373-december-16-2024-efficiency-evs-model-year-2024-ranges-53-140-mpge",
  },
  {
    label: "FuelEconomy.gov — Learn more about the EV label",
    url: "https://www.fueleconomy.gov/feg/label/learn-more-electric-label.shtml",
  },
] as const;

export const VIZ_MARKERS = [
  "National cents-per-mile dual line",
  "Efficiency sensitivity heatmap",
  "PADD regional cost scatter",
  "Break-even mpg contour",
] as const;

/** Headline national anchors (calendar 2025) */
export const HEADLINE = {
  year: 2025,
  residentialCentsPerKwh: 17.3,
  regularGasDollarsPerGal: 3.097,
  /** Typical midsize BEV combined wall-to-wheels (~3.3 mi/kWh) */
  typicalEvKwhPerMile: 0.3,
  /** Typical midsize ICE combined ~28 mpg */
  typicalIceMpg: 28,
  evCentsPerMile: 5.19,
  iceCentsPerMile: 11.06,
  iceOverEvRatio: 2.13,
  annualMiles: 12_000,
  annualEvDollars: 622.8,
  annualIceDollars: 1327.2,
  annualGapDollars: 704.4,
  confidence: "derived" as Confidence,
  note:
    "17.30¢/kWh × 0.30 kWh/mi = 5.19¢/mi; $3.097/gal ÷ 28 mpg × 100 = 11.06¢/mi.",
};

/**
 * National annual price series + derived cents/mi at fixed efficiencies.
 * Electricity: EIA EPM Table 5.3 residential annual.
 * Gasoline: EIA regular all-formulations annual average.
 */
export type NationalYearRow = {
  year: number;
  residentialCentsPerKwh: number;
  gasDollarsPerGal: number;
  evCentsPerMile: number;
  iceCentsPerMile: number;
  gapCentsPerMile: number;
  iceOverEvRatio: number;
  confidence: Confidence;
};

const TYPICAL_KWH_MI = HEADLINE.typicalEvKwhPerMile;
const TYPICAL_MPG = HEADLINE.typicalIceMpg;

function deriveYear(
  year: number,
  residentialCentsPerKwh: number,
  gasDollarsPerGal: number,
): NationalYearRow {
  const evCentsPerMile =
    Math.round(residentialCentsPerKwh * TYPICAL_KWH_MI * 100) / 100;
  const iceCentsPerMile =
    Math.round(((gasDollarsPerGal * 100) / TYPICAL_MPG) * 100) / 100;
  return {
    year,
    residentialCentsPerKwh,
    gasDollarsPerGal,
    evCentsPerMile,
    iceCentsPerMile,
    gapCentsPerMile:
      Math.round((iceCentsPerMile - evCentsPerMile) * 100) / 100,
    iceOverEvRatio:
      Math.round((iceCentsPerMile / evCentsPerMile) * 100) / 100,
    confidence: "derived",
  };
}

export const NATIONAL_SERIES: NationalYearRow[] = [
  deriveYear(2016, 12.55, 2.14),
  deriveYear(2017, 12.89, 2.42),
  deriveYear(2018, 12.87, 2.72),
  deriveYear(2019, 13.01, 2.6),
  deriveYear(2020, 13.15, 2.168),
  deriveYear(2021, 13.66, 3.008),
  deriveYear(2022, 15.04, 3.951),
  deriveYear(2023, 16.0, 3.519),
  deriveYear(2024, 16.48, 3.304),
  deriveYear(2025, 17.3, 3.097),
];

/** DOE/EPA MY2024 efficiency bookends (FOTW #1373) */
export const EFFICIENCY_BOOKENDS = {
  evMiPerKwhMin: 1.49,
  evMiPerKwhMax: 4.17,
  /** Invert for kWh/mi */
  evKwhPerMileMin: 0.24, // ~4.17 mi/kWh
  evKwhPerMileMax: 0.67, // ~1.49 mi/kWh
  iceMpgMin: 9,
  iceMpgMax: 57,
  mpgeMin: 53,
  mpgeMax: 140,
  kwhPerGallonEquivalent: 33.7,
} as const;

/**
 * Sensitivity grid: EV ¢/mi across electricity rates × kWh/mi.
 * Used for heatmap panel.
 */
export const ELEC_RATE_STEPS = [10, 14, 17.3, 22, 28, 35] as const;
export const EV_KWH_MI_STEPS = [0.22, 0.26, 0.3, 0.35, 0.42, 0.55] as const;

export type HeatCell = {
  rateCents: number;
  kwhPerMile: number;
  centsPerMile: number;
  label: string;
};

export const EV_HEATMAP: HeatCell[] = ELEC_RATE_STEPS.flatMap((rate) =>
  EV_KWH_MI_STEPS.map((kwh) => ({
    rateCents: rate,
    kwhPerMile: kwh,
    centsPerMile: Math.round(rate * kwh * 100) / 100,
    label: `${rate}¢ × ${kwh}`,
  })),
);

/**
 * ICE ¢/mi across gas price × mpg — companion sensitivity.
 */
export const GAS_PRICE_STEPS = [2.5, 3.0, 3.097, 3.5, 4.0, 4.5] as const;
export const ICE_MPG_STEPS = [18, 22, 28, 35, 42, 50] as const;

export type IceHeatCell = {
  gasDollars: number;
  mpg: number;
  centsPerMile: number;
};

export const ICE_HEATMAP: IceHeatCell[] = GAS_PRICE_STEPS.flatMap((gas) =>
  ICE_MPG_STEPS.map((mpg) => ({
    gasDollars: gas,
    mpg,
    centsPerMile: Math.round(((gas * 100) / mpg) * 100) / 100,
  })),
);

/**
 * PADD regular gasoline 2025 (EIA annual) paired with approximate
 * residential electricity proxies from census-division / state blends.
 * Electricity column is derived (scaled from 2024 Electric Power Annual
 * residential averages toward the 2025 national 17.30¢ print).
 */
export type RegionRow = {
  id: string;
  label: string;
  padd: string;
  gasDollarsPerGal: number;
  residentialCentsPerKwh: number;
  evCentsPerMile: number;
  iceCentsPerMile: number;
  iceOverEvRatio: number;
  elecConfidence: Confidence;
  gasConfidence: Confidence;
  note: string;
};

function regionRow(
  id: string,
  label: string,
  padd: string,
  gasDollarsPerGal: number,
  residentialCentsPerKwh: number,
  elecConfidence: Confidence,
  note: string,
): RegionRow {
  const evCentsPerMile =
    Math.round(residentialCentsPerKwh * TYPICAL_KWH_MI * 100) / 100;
  const iceCentsPerMile =
    Math.round(((gasDollarsPerGal * 100) / TYPICAL_MPG) * 100) / 100;
  return {
    id,
    label,
    padd,
    gasDollarsPerGal,
    residentialCentsPerKwh,
    evCentsPerMile,
    iceCentsPerMile,
    iceOverEvRatio:
      Math.round((iceCentsPerMile / evCentsPerMile) * 100) / 100,
    elecConfidence,
    gasConfidence: "disclosed",
    note,
  };
}

export const REGION_COMPARE: RegionRow[] = [
  regionRow(
    "east",
    "East Coast",
    "PADD 1",
    2.98,
    20.5,
    "derived",
    "Gas: EIA PADD 1 regular 2025. Elec: Mid-Atlantic / Lower Atlantic blend proxy.",
  ),
  regionRow(
    "new-england",
    "New England",
    "PADD 1A",
    2.988,
    28.5,
    "derived",
    "Highest residential electricity; gas near national average.",
  ),
  regionRow(
    "midwest",
    "Midwest",
    "PADD 2",
    2.944,
    16.8,
    "derived",
    "Gas: EIA PADD 2 regular 2025. Elec: East North Central proxy.",
  ),
  regionRow(
    "gulf",
    "Gulf Coast",
    "PADD 3",
    2.677,
    14.2,
    "derived",
    "Cheapest gas among PADDs; West South Central electricity proxy.",
  ),
  regionRow(
    "rockies",
    "Rocky Mountain",
    "PADD 4",
    3.022,
    14.8,
    "derived",
    "Gas: EIA PADD 4 regular 2025. Elec: Mountain division proxy.",
  ),
  regionRow(
    "west",
    "West Coast",
    "PADD 5",
    4.094,
    24.8,
    "derived",
    "Highest gas; Pacific residential electricity proxy (CA-weighted).",
  ),
];

/**
 * Break-even ICE mpg where gasoline ¢/mi equals EV ¢/mi at fixed
 * electricity rate and EV efficiency.
 * mpg* = (gas$ × 100) / (elec¢ × kWh/mi)
 */
export function breakEvenMpg(
  gasDollars: number,
  elecCents: number,
  kwhPerMile: number,
): number {
  const evCpm = elecCents * kwhPerMile;
  if (evCpm <= 0) return NaN;
  return Math.round(((gasDollars * 100) / evCpm) * 10) / 10;
}

export type BreakEvenPoint = {
  gasDollars: number;
  mpg: number;
};

/** Contour: break-even mpg vs gas price at national 17.3¢ and 0.30 kWh/mi */
export const BREAK_EVEN_CURVE: BreakEvenPoint[] = [
  2.0, 2.5, 3.0, 3.097, 3.5, 4.0, 4.5, 5.0,
].map((gas) => ({
  gasDollars: gas,
  mpg: breakEvenMpg(gas, HEADLINE.residentialCentsPerKwh, TYPICAL_KWH_MI),
}));

/** Scenario presets for interactive controls */
export const SCENARIOS = [
  {
    id: "national-2025",
    label: "National 2025",
    elecCents: 17.3,
    gasDollars: 3.097,
    kwhPerMile: 0.3,
    mpg: 28,
  },
  {
    id: "efficient-ev",
    label: "Efficient EV / mid ICE",
    elecCents: 17.3,
    gasDollars: 3.097,
    kwhPerMile: 0.24,
    mpg: 28,
  },
  {
    id: "thirsty-ev",
    label: "Large EV / hybrid ICE",
    elecCents: 17.3,
    gasDollars: 3.097,
    kwhPerMile: 0.42,
    mpg: 42,
  },
  {
    id: "high-power-price",
    label: "High-power region",
    elecCents: 28.5,
    gasDollars: 2.988,
    kwhPerMile: 0.3,
    mpg: 28,
  },
  {
    id: "cheap-gas-gulf",
    label: "Gulf cheap gas",
    elecCents: 14.2,
    gasDollars: 2.677,
    kwhPerMile: 0.3,
    mpg: 28,
  },
  {
    id: "west-coast",
    label: "West Coast",
    elecCents: 24.8,
    gasDollars: 4.094,
    kwhPerMile: 0.3,
    mpg: 28,
  },
] as const;

export type ScenarioId = (typeof SCENARIOS)[number]["id"];

export function costPair(
  elecCents: number,
  gasDollars: number,
  kwhPerMile: number,
  mpg: number,
) {
  const evCentsPerMile = Math.round(elecCents * kwhPerMile * 100) / 100;
  const iceCentsPerMile =
    Math.round(((gasDollars * 100) / mpg) * 100) / 100;
  return {
    evCentsPerMile,
    iceCentsPerMile,
    gapCentsPerMile:
      Math.round((iceCentsPerMile - evCentsPerMile) * 100) / 100,
    iceOverEvRatio:
      evCentsPerMile > 0
        ? Math.round((iceCentsPerMile / evCentsPerMile) * 100) / 100
        : NaN,
    breakEvenMpg: breakEvenMpg(gasDollars, elecCents, kwhPerMile),
  };
}

/** Reference table rows for the article body */
export const REFERENCE_TABLE = [
  {
    scenario: "National average (2025)",
    elecCents: 17.3,
    gasDollars: 3.097,
    kwhPerMile: 0.3,
    mpg: 28,
    ...costPair(17.3, 3.097, 0.3, 28),
  },
  {
    scenario: "Efficient EV (4.2 mi/kWh)",
    elecCents: 17.3,
    gasDollars: 3.097,
    kwhPerMile: 0.24,
    mpg: 28,
    ...costPair(17.3, 3.097, 0.24, 28),
  },
  {
    scenario: "Large / truck EV (2.4 mi/kWh)",
    elecCents: 17.3,
    gasDollars: 3.097,
    kwhPerMile: 0.42,
    mpg: 22,
    ...costPair(17.3, 3.097, 0.42, 22),
  },
  {
    scenario: "New England proxy",
    elecCents: 28.5,
    gasDollars: 2.988,
    kwhPerMile: 0.3,
    mpg: 28,
    ...costPair(28.5, 2.988, 0.3, 28),
  },
  {
    scenario: "Gulf Coast proxy",
    elecCents: 14.2,
    gasDollars: 2.677,
    kwhPerMile: 0.3,
    mpg: 28,
    ...costPair(14.2, 2.677, 0.3, 28),
  },
  {
    scenario: "West Coast proxy",
    elecCents: 24.8,
    gasDollars: 4.094,
    kwhPerMile: 0.3,
    mpg: 28,
    ...costPair(24.8, 4.094, 0.3, 28),
  },
  {
    scenario: "Hybrid ICE vs typical EV",
    elecCents: 17.3,
    gasDollars: 3.097,
    kwhPerMile: 0.3,
    mpg: 45,
    ...costPair(17.3, 3.097, 0.3, 45),
  },
] as const;
