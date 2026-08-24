/**
 * Subsidy cost per converted apartment (2026).
 *
 * Core question: For cities paying tax abatements or grants for
 * office-to-residential conversions, what is the public cost per delivered
 * unit versus new ground-up construction?
 *
 * Perimeter: NYC Comptroller Fiscal Note 6-2025 (467-m PV tax expenditure /
 * opportunity cost); DC DMPED Housing in Downtown program framing and first
 * conditional awards; Calgary Downtown Office Conversion Program grant rate
 * and completed-project yields; ground-up benchmarks from NYC IBO / HPD-era
 * capital cost and LIHTC equity-per-unit estimates. Figures are present-value
 * or disclosed program framing as labeled — not a full general-equilibrium
 * fiscal score.
 *
 * Headline: NYC’s 467-m pipeline implies ~$386k PV tax expenditure per
 * delivered apartment (~$1.4M opportunity cost per income-restricted unit),
 * versus Calgary’s ~CAD $87k grant per completed home and DC’s ~$4.9k
 * program-framed outlay per projected unit.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "NYC: Office of the New York City Comptroller, Fiscal Note 6-2025, Office-to-Residential Conversions in NYC: Economics and Fiscal Estimates (July 2025) — 467-m tax expenditure $5.6B PV and opportunity cost $5.1B PV on ~14,500 Manhattan-south-of-59th units (~3,600 income-restricted). NYC IBO October 2025 housing-incentive testimony (421-a/485-x FY2025 forgone revenue). Ground-up capital: Step Two Policy synthesis of NYC HPD-era average city-financed unit cost and LIHTC equity capacity (~$195k–$231k/unit). DC: Mayor’s Office / DMPED Housing in Downtown — $41M program cap framed against ~8,400 projected units; first conditional awards (1625 Mass Ave, 1825/1875 Conn Ave, 615 H St). Calgary: City of Calgary Downtown Office Conversion Program — $75/sf grant on office GFA removed; eight completed projects (~925k sf → ~800 homes); 21 incentivized projects (~2.7M sf → 2,667 homes). USD conversions use 0.73 CAD/USD where noted. Not a developer pro-forma or parcel-level appraisal.";

export const SOURCES = [
  {
    label: "NYC Comptroller — Fiscal Note 6-2025 (conversions)",
    url: "https://comptroller.nyc.gov/reports/office-to-residential-conversions-in-nyc-economics-and-fiscal-estimates/",
  },
  {
    label: "NYC Comptroller — FN 6-2025 PDF",
    url: "https://comptroller.nyc.gov/wp-content/uploads/documents/fn_economics_conversions_july.pdf",
  },
  {
    label: "DC Mayor — Housing in Downtown first awards",
    url: "https://mayor.dc.gov/release/mayor-bowser-announces-first-commercial-residential-conversion-projects-receive-support-dc%E2%80%99s",
  },
  {
    label: "DMPED — Housing in Downtown program overview",
    url: "https://dmped.dc.gov/sites/default/files/dc/sites/dmped/page_content/attachments/Housing%20in%20Downtown_DMPED%20March%202024_Launch.pdf",
  },
  {
    label: "City of Calgary — Downtown Office Conversion Program",
    url: "https://www.calgary.ca/development/downtown-office-conversion-program.html",
  },
  {
    label: "Calgary Newsroom — program reopen June 2026",
    url: "https://newsroom.calgary.ca/calgarys-downtown-office-conversion-program-reopens-to-new-opportunities/",
  },
  {
    label: "NYC IBO — housing tax incentives testimony (Oct 2025)",
    url: "https://www.ibo.nyc.gov/assets/ibo/downloads/pdf/housing-and-buildings/2025/2025-october-city-council-testomony-housing-incentives.pdf",
  },
] as const;

/** Headline punchline — public $ per unit */
export const HEADLINE = {
  /** NYC 467-m PV tax expenditure per delivered unit (USD) */
  nycTaxExpenditurePerUnitUsd: 386000,
  /** NYC opportunity cost per income-restricted unit (USD, PV) */
  nycOppCostPerIncomeRestrictedUsd: 1400000,
  /** Calgary completed-cohort grant per home (USD, from CAD) */
  calgaryGrantPerHomeUsd: 63300,
  /** DC program-framed $ per projected unit (USD) */
  dcFramedPerProjectedUnitUsd: 4880,
  /** NYC pipeline units in Comptroller sample */
  nycPipelineUnits: 14500,
  /** Ratio NYC tax-exp/unit ÷ Calgary grant/unit */
  nycVsCalgaryPerUnitRatio: 6.1,
  confidence: "carried" as Confidence,
};

export const VIZ_MARKERS = [
  "Public $ per converted unit",
  "Abatement vs grant instrument ladder",
] as const;

export type CityId = "nyc" | "dc" | "calgary-done" | "calgary-pipe";
export type CostMetric =
  | "perDeliveredUnit"
  | "perIncomeRestricted"
  | "perBedroomProxy";
export type Instrument = "taxAbatementPv" | "cashGrant" | "programFraming" | "groundUpCapital";

export interface CityProgramRow {
  id: CityId;
  city: string;
  program: string;
  instrument: Instrument;
  /** Primary public cost per delivered housing unit (USD) */
  costPerDeliveredUnitUsd: number;
  /** Public cost per income-restricted / affordable unit when disclosed */
  costPerIncomeRestrictedUsd: number | null;
  unitsDeliveredOrPipeline: number;
  incomeRestrictedUnits: number | null;
  currencyNote: string;
  confidence: Confidence;
  note: string;
}

/** Cross-city public cost per unit (primary ladder) */
export const CITY_PROGRAMS: CityProgramRow[] = [
  {
    id: "nyc",
    city: "New York",
    program: "467-m AHCC (Manhattan S of 59th sample)",
    instrument: "taxAbatementPv",
    costPerDeliveredUnitUsd: 386000,
    costPerIncomeRestrictedUsd: 1400000,
    unitsDeliveredOrPipeline: 14500,
    incomeRestrictedUnits: 3600,
    currencyNote: "USD present value over ~37 years",
    confidence: "disclosed",
    note: "$5.6B PV tax expenditure ÷ ~14,500 units; opportunity cost $5.1B → $1.4M per IR unit.",
  },
  {
    id: "calgary-done",
    city: "Calgary",
    program: "Downtown Office Conversion (completed cohort)",
    instrument: "cashGrant",
    costPerDeliveredUnitUsd: 63300,
    costPerIncomeRestrictedUsd: null,
    unitsDeliveredOrPipeline: 800,
    incomeRestrictedUnits: null,
    currencyNote: "CAD $75/sf → USD @ 0.73",
    confidence: "estimated",
    note: "925k sf × CAD $75/sf ≈ CAD $69.4M ÷ ~800 completed homes.",
  },
  {
    id: "calgary-pipe",
    city: "Calgary",
    program: "Downtown Office Conversion (21-project pipeline)",
    instrument: "cashGrant",
    costPerDeliveredUnitUsd: 55400,
    costPerIncomeRestrictedUsd: null,
    unitsDeliveredOrPipeline: 2667,
    incomeRestrictedUnits: null,
    currencyNote: "CAD $75/sf → USD @ 0.73",
    confidence: "estimated",
    note: "2.7M sf × CAD $75/sf ≈ CAD $202.5M ÷ 2,667 planned homes (illustrative full take-up).",
  },
  {
    id: "dc",
    city: "Washington, DC",
    program: "Housing in Downtown (program framing)",
    instrument: "programFraming",
    costPerDeliveredUnitUsd: 4880,
    costPerIncomeRestrictedUsd: null,
    unitsDeliveredOrPipeline: 8400,
    incomeRestrictedUnits: null,
    currencyNote: "USD annual abatement authority framing",
    confidence: "carried",
    note: "Mayor/DMPED: $41M investment framed against ~8,400 projected units — not a 20-year PV.",
  },
];

/** NYC Comptroller geography split */
export const NYC_GEO_SPLIT = [
  {
    zone: "Lower Manhattan",
    taxExpenditurePvM: 3100,
    opportunityCostPvM: 3800,
    oppCostPerIrUnitM: 1.8,
    oppCostPerIrBedroomM: 2.1,
  },
  {
    zone: "Rest of Manhattan S of 59th",
    taxExpenditurePvM: 2500,
    opportunityCostPvM: 1400,
    oppCostPerIrUnitM: 0.9,
    oppCostPerIrBedroomM: 1.1,
  },
  {
    zone: "Sample total",
    taxExpenditurePvM: 5600,
    opportunityCostPvM: 5100,
    oppCostPerIrUnitM: 1.4,
    oppCostPerIrBedroomM: 1.7,
  },
] as const;

/** Project-level NYC anchors (Comptroller case studies) */
export const NYC_PROJECT_ANCHORS = [
  {
    project: "25 Water Street",
    totalUnits: 1320,
    incomeRestrictedUnits: 330,
    opportunityCostPvM: 538,
    taxBenefitPvM: 434,
    costPerIrUnitM: 1.6,
    costPerTotalUnitK: 408,
    confidence: "disclosed" as Confidence,
  },
  {
    project: "Manhattan sample (avg)",
    totalUnits: 14500,
    incomeRestrictedUnits: 3600,
    opportunityCostPvM: 5100,
    taxBenefitPvM: 5600,
    costPerIrUnitM: 1.4,
    costPerTotalUnitK: 386,
    confidence: "disclosed" as Confidence,
  },
] as const;

/** Conversion public cost vs ground-up public cost benchmarks (USD) */
export const CONVERSION_VS_GROUNDUP = [
  {
    id: "nyc-467m-per-unit",
    label: "NYC 467-m tax exp. / delivered unit",
    pathway: "conversion" as const,
    publicCostUsd: 386000,
    unitBasis: "all units in sample",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "nyc-467m-per-ir",
    label: "NYC 467-m opp. cost / IR unit",
    pathway: "conversion" as const,
    publicCostUsd: 1400000,
    unitBasis: "income-restricted only",
    confidence: "disclosed" as Confidence,
  },
  {
    id: "calgary-grant",
    label: "Calgary grant / completed home",
    pathway: "conversion" as const,
    publicCostUsd: 63300,
    unitBasis: "all completed homes",
    confidence: "estimated" as Confidence,
  },
  {
    id: "dc-framed",
    label: "DC HID framed $ / projected unit",
    pathway: "conversion" as const,
    publicCostUsd: 4880,
    unitBasis: "program projection",
    confidence: "carried" as Confidence,
  },
  {
    id: "lihtc-4pct",
    label: "NYC 4% LIHTC equity / affordable unit",
    pathway: "groundUp" as const,
    publicCostUsd: 231000,
    unitBasis: "affordable unit capital",
    confidence: "estimated" as Confidence,
  },
  {
    id: "lihtc-9pct",
    label: "NYC 9% LIHTC equity / affordable unit",
    pathway: "groundUp" as const,
    publicCostUsd: 195000,
    unitBasis: "affordable unit capital",
    confidence: "estimated" as Confidence,
  },
  {
    id: "nyc-city-financed",
    label: "NYC city-financed affordable unit (avg)",
    pathway: "groundUp" as const,
    publicCostUsd: 714000,
    unitBasis: "deep subsidy capital cost",
    confidence: "carried" as Confidence,
  },
] as const;

/** Instrument mechanics — how the public dollar is paid */
export const INSTRUMENT_MECHANICS = [
  {
    city: "New York",
    instrument: "Property tax exemption (467-m)",
    durationYears: 35,
    paymentTiming: "Forgone revenue over decades",
    affordabilityHook: "25% units income-restricted @ ~80% AMI avg",
    maxDepthNote: "90% abatement Manhattan S of 96th; 65% elsewhere",
  },
  {
    city: "Washington, DC",
    instrument: "Competitive 20-yr tax abatement (HID)",
    durationYears: 20,
    paymentTiming: "Annual abatement within FY caps",
    affordabilityHook: "10% @ 60% MFI or 18% @ 80% MFI",
    maxDepthNote: "FY24–26 cap $2.5M/yr; FY28 $41M",
  },
  {
    city: "Calgary",
    instrument: "Cash grant on office GFA removed",
    durationYears: 0,
    paymentTiming: "Upfront / milestone grant",
    affordabilityHook: "No statutory IR set-aside (market + non-market streams)",
    maxDepthNote: "CAD $75/sf residential; ~CAD $15M per-property cap",
  },
] as const;

/** DC first conditional award cohort */
export const DC_FIRST_AWARDS = [
  {
    address: "1625 Massachusetts Ave NW",
    units: 157,
    affordableUnits: 15,
    officeSf: 114000,
  },
  {
    address: "1825 & 1875 Connecticut Ave NW",
    units: 525,
    affordableUnits: 69,
    officeSf: 1080000,
  },
  {
    address: "615 H Street NW",
    units: 72,
    affordableUnits: 8,
    officeSf: null as number | null,
  },
] as const;

export const DC_FIRST_AWARDS_TOTAL = {
  units: 754,
  affordableUnits: 92,
  programCapM: 41,
  projectedProgramUnits: 8400,
};

/** Calgary yield: office SF removed per home */
export const CALGARY_YIELD = {
  completedSf: 925000,
  completedHomes: 800,
  sfPerHome: 1156,
  grantCadPerSf: 75,
  pipelineSf: 2700000,
  pipelineHomes: 2667,
  taxUpliftCadM: 14,
  privateLeverageRatio: 4,
};

/** Abatement / grant schedule depth for viz (indexed) */
export const ABATEMENT_SCHEDULE = [
  { year: 0, nycExemptPct: 100, dcActive: 1, calgaryGrantPct: 100 },
  { year: 5, nycExemptPct: 90, dcActive: 1, calgaryGrantPct: 0 },
  { year: 10, nycExemptPct: 90, dcActive: 1, calgaryGrantPct: 0 },
  { year: 15, nycExemptPct: 90, dcActive: 1, calgaryGrantPct: 0 },
  { year: 20, nycExemptPct: 90, dcActive: 1, calgaryGrantPct: 0 },
  { year: 25, nycExemptPct: 90, dcActive: 0, calgaryGrantPct: 0 },
  { year: 26, nycExemptPct: 80, dcActive: 0, calgaryGrantPct: 0 },
  { year: 27, nycExemptPct: 60, dcActive: 0, calgaryGrantPct: 0 },
  { year: 28, nycExemptPct: 40, dcActive: 0, calgaryGrantPct: 0 },
  { year: 29, nycExemptPct: 20, dcActive: 0, calgaryGrantPct: 0 },
  { year: 30, nycExemptPct: 0, dcActive: 0, calgaryGrantPct: 0 },
  { year: 35, nycExemptPct: 0, dcActive: 0, calgaryGrantPct: 0 },
] as const;

/** Scatter: public cost vs units (for bubble / scatter panel) */
export const COST_UNIT_SCATTER = [
  {
    id: "nyc",
    city: "New York",
    publicCostPerUnitUsd: 386000,
    units: 14500,
    instrument: "Tax abatement PV",
  },
  {
    id: "calgary-done",
    city: "Calgary (done)",
    publicCostPerUnitUsd: 63300,
    units: 800,
    instrument: "Cash grant",
  },
  {
    id: "calgary-pipe",
    city: "Calgary (pipe)",
    publicCostPerUnitUsd: 55400,
    units: 2667,
    instrument: "Cash grant",
  },
  {
    id: "dc",
    city: "Washington, DC",
    publicCostPerUnitUsd: 4880,
    units: 8400,
    instrument: "Program framing",
  },
] as const;

/** Metric toggle options for dashboard */
export const METRIC_OPTIONS: { id: CostMetric; label: string }[] = [
  { id: "perDeliveredUnit", label: "Per delivered unit" },
  { id: "perIncomeRestricted", label: "Per income-restricted unit" },
  { id: "perBedroomProxy", label: "Per IR bedroom (NYC)" },
];

export function formatUsdCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}
