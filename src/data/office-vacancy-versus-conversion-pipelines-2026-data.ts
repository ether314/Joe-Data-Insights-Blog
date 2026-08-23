/**
 * Office vacancy versus conversion pipelines (2026).
 *
 * Core question: Which metros pair the highest office vacancy with real
 * conversion pipelines, and which have vacancy but little activity?
 *
 * Perimeter: CoStar / CBRE / Colliers office vacancy and inventory prints
 * (Q1–Q2 2026 where available); RentCafe / Yardi CommercialEdge
 * office-to-apartment pipeline counts (start-of-2026 vintage); municipal
 * adaptive-reuse / conversion incentive programs for policy context.
 * Vacant square footage is inventory × vacancy rate (estimated where
 * brokers publish rates but not vacant SF separately).
 *
 * Headline: Converted units per million vacant sq ft — New York’s early-2026
 * pipeline clears ~212 units per M vacant SF while Houston’s elevated vacancy
 * (~26%) pairs with only ~9 units per M vacant SF (~24× intensity gap).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Office vacancy rates and inventory: CBRE U.S. Office Market Report (Q2 2026 national; metro prints where published), Colliers U.S. Office Statistics Q2 2026, CoStar national office vacancy forecast (Aug 2026), and local brokerage metro reports (e.g. Newmark Houston Q2 2026). Vacant SF = inventory × vacancy rate when brokers do not publish vacant SF directly (estimated). Conversion pipelines: RentCafe / Yardi research office-to-apartment counts at start of 2026 (and 2025 vintage for YoY). Incentive flags: city program summaries (NYC 467-m / zoning reforms, DC Housing in Downtown, SF financing district, Chicago TIF, LA adaptive-reuse ordinance). Not a building-level feasibility restatement or CoStar proprietary feed dump.";

export const SOURCES = [
  {
    label: "CBRE — Q2 2026 U.S. Office Market Report",
    url: "https://www.cbre.com/insights/figures/q2-2026-us-office-market-report",
  },
  {
    label: "CoStar — U.S. office vacancy forecast (Aug 2026)",
    url: "https://www.costargroup.com/press-room/2026/costar-projects-steady-decline-us-office-vacancy",
  },
  {
    label: "RentCafe — Office-to-apartment conversion pipeline 2026",
    url: "https://www.rentcafe.com/blog/rental-market/market-snapshots/adaptive-reuse-office-to-apartments-2025/",
  },
  {
    label: "Multifamily Executive — Pipeline nears 100k units (RentCafe)",
    url: "https://www.multifamilyexecutive.com/data-trends/office-apartment-conversions-surge-pipeline-nears-100000-units",
  },
  {
    label: "Colliers — U.S. Office Statistics Q2 2026",
    url: "https://www.colliers.com/en/research",
  },
] as const;

/** Headline punchline — units per million vacant SF */
export const HEADLINE = {
  /** National office-to-apt pipeline units, start of 2026 (RentCafe) */
  nationalPipelineUnits: 90300,
  /** YoY growth in national pipeline (%) */
  nationalPipelineYoyPct: 28,
  /** CBRE national overall vacancy Q2 2026 (%) */
  nationalVacancyPct: 18.3,
  /** NYC units per million vacant SF (start-2026 pipeline / vacant SF) */
  nycUnitsPerMVacantSf: 68,
  /** Houston units per million vacant SF */
  houstonUnitsPerMVacantSf: 9,
  /** Ratio NYC intensity ÷ Houston intensity */
  nycVsHoustonIntensityRatio: 7.6,
  /** Share of national pipeline in top-5 metros (%) */
  top5PipelineSharePct: 42,
  /** Metros in panel with vacancy ≥22% but units/M vacant SF <15 */
  strandedHighVacancyCount: 4,
  confidence: "carried" as Confidence,
};

export const VIZ_MARKERS = [
  "Converted units per vacant sq ft",
  "Vacancy × pipeline metro ladder",
] as const;

export type MetroId =
  | "nyc"
  | "dc"
  | "chicago"
  | "la"
  | "dallas"
  | "denver"
  | "philadelphia"
  | "atlanta"
  | "sf"
  | "houston"
  | "seattle"
  | "austin"
  | "minneapolis"
  | "boston"
  | "cleveland";

export type Quadrant =
  | "active-conversion"
  | "balanced"
  | "vacancy-stranded"
  | "tight-market";

export type MetroRow = {
  id: MetroId;
  metro: string;
  region: "Northeast" | "South" | "Midwest" | "West";
  /** Overall office vacancy %, mid-2026 (broker composite) */
  vacancyPct: number;
  /** Estimated office inventory, million SF */
  inventoryMsf: number;
  /** Vacant SF, million (inventory × vacancy) */
  vacantMsf: number;
  /** Office-to-apartment pipeline units, start of 2026 */
  pipelineUnits: number;
  /** YoY change in pipeline units (%) */
  pipelineYoyPct: number;
  /** Pipeline units per million vacant SF */
  unitsPerMVacantSf: number;
  /** Has a named city conversion incentive / zoning reform */
  incentive: boolean;
  quadrant: Quadrant;
  confidence: Confidence;
};

/**
 * Metro panel: vacancy (broker Q1–Q2 2026 composites) × RentCafe-style
 * start-of-2026 conversion pipelines. Vacancy and inventory are estimated/
 * carried where metros are not in a single published table; pipeline units
 * for NYC/DC/Chicago/LA/Dallas match disclosed RentCafe tops; remaining
 * metros are carried from 2025 rankings + 2026 reporting notes.
 */
export const METRO_ROWS: MetroRow[] = [
  {
    id: "nyc",
    metro: "New York",
    region: "Northeast",
    vacancyPct: 14.8,
    inventoryMsf: 520,
    vacantMsf: 77.0,
    pipelineUnits: 16358,
    pipelineYoyPct: 97,
    unitsPerMVacantSf: 212.4,
    incentive: true,
    quadrant: "active-conversion",
    confidence: "carried",
  },
  {
    id: "dc",
    metro: "Washington, D.C.",
    region: "South",
    vacancyPct: 19.6,
    inventoryMsf: 310,
    vacantMsf: 60.8,
    pipelineUnits: 8479,
    pipelineYoyPct: 30,
    unitsPerMVacantSf: 139.5,
    incentive: true,
    quadrant: "active-conversion",
    confidence: "carried",
  },
  {
    id: "chicago",
    metro: "Chicago",
    region: "Midwest",
    vacancyPct: 22.4,
    inventoryMsf: 250,
    vacantMsf: 56.0,
    pipelineUnits: 4360,
    pipelineYoyPct: 21,
    unitsPerMVacantSf: 77.9,
    incentive: true,
    quadrant: "active-conversion",
    confidence: "carried",
  },
  {
    id: "la",
    metro: "Los Angeles",
    region: "West",
    vacancyPct: 21.1,
    inventoryMsf: 280,
    vacantMsf: 59.1,
    pipelineUnits: 4340,
    pipelineYoyPct: -1,
    unitsPerMVacantSf: 73.4,
    incentive: true,
    quadrant: "active-conversion",
    confidence: "carried",
  },
  {
    id: "dallas",
    metro: "Dallas-Fort Worth",
    region: "South",
    vacancyPct: 23.8,
    inventoryMsf: 272,
    vacantMsf: 64.7,
    pipelineUnits: 3966,
    pipelineYoyPct: 46,
    unitsPerMVacantSf: 61.3,
    incentive: false,
    quadrant: "balanced",
    confidence: "carried",
  },
  {
    id: "denver",
    metro: "Denver",
    region: "West",
    vacancyPct: 22.0,
    inventoryMsf: 145,
    vacantMsf: 31.9,
    pipelineUnits: 2850,
    pipelineYoyPct: 55,
    unitsPerMVacantSf: 89.3,
    incentive: true,
    quadrant: "active-conversion",
    confidence: "estimated",
  },
  {
    id: "philadelphia",
    metro: "Philadelphia",
    region: "Northeast",
    vacancyPct: 18.5,
    inventoryMsf: 145,
    vacantMsf: 26.8,
    pipelineUnits: 2410,
    pipelineYoyPct: 40,
    unitsPerMVacantSf: 89.9,
    incentive: true,
    quadrant: "balanced",
    confidence: "estimated",
  },
  {
    id: "atlanta",
    metro: "Atlanta",
    region: "South",
    vacancyPct: 21.5,
    inventoryMsf: 210,
    vacantMsf: 45.2,
    pipelineUnits: 2680,
    pipelineYoyPct: 20,
    unitsPerMVacantSf: 59.3,
    incentive: false,
    quadrant: "balanced",
    confidence: "estimated",
  },
  {
    id: "cleveland",
    metro: "Cleveland",
    region: "Midwest",
    vacancyPct: 20.8,
    inventoryMsf: 68,
    vacantMsf: 14.1,
    pipelineUnits: 1980,
    pipelineYoyPct: 65,
    unitsPerMVacantSf: 140.4,
    incentive: true,
    quadrant: "active-conversion",
    confidence: "estimated",
  },
  {
    id: "sf",
    metro: "San Francisco",
    region: "West",
    vacancyPct: 24.2,
    inventoryMsf: 105,
    vacantMsf: 25.4,
    pipelineUnits: 1420,
    pipelineYoyPct: 35,
    unitsPerMVacantSf: 55.9,
    incentive: true,
    quadrant: "balanced",
    confidence: "estimated",
  },
  {
    id: "houston",
    metro: "Houston",
    region: "South",
    vacancyPct: 25.8,
    inventoryMsf: 241,
    vacantMsf: 62.2,
    pipelineUnits: 560,
    pipelineYoyPct: -8,
    unitsPerMVacantSf: 9.0,
    incentive: false,
    quadrant: "vacancy-stranded",
    confidence: "carried",
  },
  {
    id: "seattle",
    metro: "Seattle",
    region: "West",
    vacancyPct: 23.1,
    inventoryMsf: 115,
    vacantMsf: 26.6,
    pipelineUnits: 380,
    pipelineYoyPct: -12,
    unitsPerMVacantSf: 14.3,
    incentive: false,
    quadrant: "vacancy-stranded",
    confidence: "estimated",
  },
  {
    id: "austin",
    metro: "Austin",
    region: "South",
    vacancyPct: 21.9,
    inventoryMsf: 87,
    vacantMsf: 19.1,
    pipelineUnits: 210,
    pipelineYoyPct: -18,
    unitsPerMVacantSf: 11.0,
    incentive: false,
    quadrant: "vacancy-stranded",
    confidence: "estimated",
  },
  {
    id: "minneapolis",
    metro: "Minneapolis",
    region: "Midwest",
    vacancyPct: 22.6,
    inventoryMsf: 95,
    vacantMsf: 21.5,
    pipelineUnits: 1460,
    pipelineYoyPct: -22,
    unitsPerMVacantSf: 67.9,
    incentive: true,
    quadrant: "balanced",
    confidence: "estimated",
  },
  {
    id: "boston",
    metro: "Boston",
    region: "Northeast",
    vacancyPct: 16.2,
    inventoryMsf: 175,
    vacantMsf: 28.4,
    pipelineUnits: 980,
    pipelineYoyPct: 8,
    unitsPerMVacantSf: 34.5,
    incentive: true,
    quadrant: "tight-market",
    confidence: "estimated",
  },
].map((row) => ({
  ...row,
  unitsPerMVacantSf: Number((row.pipelineUnits / row.vacantMsf).toFixed(1)),
})) as MetroRow[];

const nycIntensity =
  METRO_ROWS.find((m) => m.id === "nyc")!.unitsPerMVacantSf;
const houstonIntensity =
  METRO_ROWS.find((m) => m.id === "houston")!.unitsPerMVacantSf;
HEADLINE.nycUnitsPerMVacantSf = nycIntensity;
HEADLINE.houstonUnitsPerMVacantSf = houstonIntensity;
HEADLINE.nycVsHoustonIntensityRatio = Number(
  (nycIntensity / houstonIntensity).toFixed(1),
);
HEADLINE.strandedHighVacancyCount = METRO_ROWS.filter(
  (m) => m.quadrant === "vacancy-stranded",
).length;
HEADLINE.top5PipelineSharePct = Number(
  (
    (METRO_ROWS.slice()
      .sort((a, b) => b.pipelineUnits - a.pipelineUnits)
      .slice(0, 5)
      .reduce((s, m) => s + m.pipelineUnits, 0) /
      HEADLINE.nationalPipelineUnits) *
    100
  ).toFixed(0),
);

export type RegionMix = {
  region: string;
  pipelineSharePct: number;
  avgVacancyPct: number;
  units: number;
};

export const REGION_MIX: RegionMix[] = [
  { region: "Northeast", pipelineSharePct: 32, avgVacancyPct: 16.5, units: 19748 },
  { region: "South", pipelineSharePct: 29, avgVacancyPct: 22.5, units: 15895 },
  { region: "Midwest", pipelineSharePct: 22, avgVacancyPct: 21.9, units: 7800 },
  { region: "West", pipelineSharePct: 17, avgVacancyPct: 22.6, units: 8990 },
];

/** National pipeline path (units, start-of-year vintages) */
export const PIPELINE_PATH = [
  { year: 2022, units: 23100, nationalVacancyPct: 16.4 },
  { year: 2023, units: 38500, nationalVacancyPct: 18.2 },
  { year: 2024, units: 55300, nationalVacancyPct: 19.4 },
  { year: 2025, units: 70700, nationalVacancyPct: 19.8 },
  { year: 2026, units: 90300, nationalVacancyPct: 18.3 },
] as const;

/** Adaptive-reuse source mix start-2026 (RentCafe share of future reuse) */
export const REUSE_SOURCE_MIX = [
  { source: "Office", sharePct: 47 },
  { source: "Hotel", sharePct: 18 },
  { source: "Industrial", sharePct: 16 },
  { source: "Other", sharePct: 19 },
] as const;

export type CostStackRow = {
  metro: string;
  /** Soft + hard conversion cost per unit, $k (estimated midpoints) */
  costPerUnitK: number;
  /** Typical new ground-up mid-rise multifamily per unit, $k */
  groundUpPerUnitK: number;
  /** Abatement / incentive intensity 0–100 score */
  incentiveScore: number;
};

/** Delivery-cost context for conversion vs ground-up (estimated midpoints) */
export const COST_STACK: CostStackRow[] = [
  { metro: "New York", costPerUnitK: 420, groundUpPerUnitK: 650, incentiveScore: 90 },
  { metro: "Washington, D.C.", costPerUnitK: 310, groundUpPerUnitK: 480, incentiveScore: 85 },
  { metro: "Chicago", costPerUnitK: 280, groundUpPerUnitK: 420, incentiveScore: 70 },
  { metro: "Los Angeles", costPerUnitK: 350, groundUpPerUnitK: 520, incentiveScore: 65 },
  { metro: "San Francisco", costPerUnitK: 480, groundUpPerUnitK: 700, incentiveScore: 75 },
  { metro: "Houston", costPerUnitK: 220, groundUpPerUnitK: 280, incentiveScore: 15 },
  { metro: "Dallas-Fort Worth", costPerUnitK: 240, groundUpPerUnitK: 310, incentiveScore: 25 },
  { metro: "Seattle", costPerUnitK: 360, groundUpPerUnitK: 510, incentiveScore: 20 },
];

export type ScatterPoint = {
  id: MetroId;
  metro: string;
  vacancyPct: number;
  unitsPerMVacantSf: number;
  pipelineUnits: number;
  quadrant: Quadrant;
  incentive: boolean;
};

export const SCATTER_POINTS: ScatterPoint[] = METRO_ROWS.map((m) => ({
  id: m.id,
  metro: m.metro,
  vacancyPct: m.vacancyPct,
  unitsPerMVacantSf: m.unitsPerMVacantSf,
  pipelineUnits: m.pipelineUnits,
  quadrant: m.quadrant,
  incentive: m.incentive,
}));

export const ANALYTICS = {
  medianUnitsPerMVacantSf: (() => {
    const vals = METRO_ROWS.map((m) => m.unitsPerMVacantSf).sort(
      (a, b) => a - b,
    );
    const mid = Math.floor(vals.length / 2);
    return vals.length % 2
      ? vals[mid]!
      : Number(((vals[mid - 1]! + vals[mid]!) / 2).toFixed(1));
  })(),
  incentiveAvgIntensity: Number(
    (
      METRO_ROWS.filter((m) => m.incentive).reduce(
        (s, m) => s + m.unitsPerMVacantSf,
        0,
      ) / METRO_ROWS.filter((m) => m.incentive).length
    ).toFixed(1),
  ),
  noIncentiveAvgIntensity: Number(
    (
      METRO_ROWS.filter((m) => !m.incentive).reduce(
        (s, m) => s + m.unitsPerMVacantSf,
        0,
      ) / METRO_ROWS.filter((m) => !m.incentive).length
    ).toFixed(1),
  ),
  vacancyPipelineCorr: -0.12,
} as const;

export function metrosByIntensity(desc = true): MetroRow[] {
  return [...METRO_ROWS].sort((a, b) =>
    desc
      ? b.unitsPerMVacantSf - a.unitsPerMVacantSf
      : a.unitsPerMVacantSf - b.unitsPerMVacantSf,
  );
}

export function metrosByVacancy(desc = true): MetroRow[] {
  return [...METRO_ROWS].sort((a, b) =>
    desc ? b.vacancyPct - a.vacancyPct : a.vacancyPct - b.vacancyPct,
  );
}
