/**
 * North America lithium-ion recycling capacity vs EV sales pack-mass.
 *
 * Core question: How do operating plus under-construction hydromet/pyromet
 * input tons compare with annual pack-weight implied by EV sales?
 *
 * Anchors: DOE / Argonne Securing Materials for the U.S. EV Industry (2024);
 * USGS Mineral Commodity Summaries (lithium, cobalt, nickel recycling notes);
 * IEA Global EV Outlook 2025 (electric-car sales, battery demand context);
 * company-disclosed plant capacities (Redwood, Ascend, Cirba, Li-Cycle/Glencore,
 * ABTC, Retriev, and peers). Desk reconstruction — not a plant census.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Operating and under-construction recycling input capacities are desk sums of company announcements and Argonne/DOE order-of-magnitude U.S. baselines (~35 kt operating domestic recovery capacity circa 2023; ~76 kt additional planned in a 2–4 year window in Securing Materials for the U.S. Electric Vehicle Industry). North America adds Canadian pre-process/recovery sites. Pack tons = EV sales × mix-weighted pack mass (US SUV-heavy BEVs ~400–480 kg; PHEVs lighter). Sales lean on IEA GEO 2025 (U.S. 1.6 M electric cars in 2024) plus Canada/Mexico desk add-ons. Pretreatment and black-mass spokes are not double-counted into refining totals. Capacities are nameplate input tons, not recovered cathode-metal tons. Vintage ~2024–2026e.";

export const SOURCES = [
  {
    label: "DOE / Argonne — Securing Materials for the U.S. EV Industry (2024)",
    url: "https://www.energy.gov/eere/vehicles/articles/securing-materials-us-electric-vehicle-industry",
  },
  {
    label: "IEA — Global EV Outlook 2025",
    url: "https://www.iea.org/reports/global-ev-outlook-2025",
  },
  {
    label: "USGS — Mineral Commodity Summaries (Li, Co, Ni)",
    url: "https://www.usgs.gov/centers/national-minerals-information-center/mineral-commodity-summaries",
  },
  {
    label: "Argonne — Tracking flows of EOL battery materials (Batteries 2023)",
    url: "https://www.osti.gov/pages/servlets/purl/2328133",
  },
] as const;

export const VIZ_MARKERS = [
  "Recycling tons vs pack tons",
  "Nameplate supply versus pack tons from EV sales",
  "Operating NA recovery covers only",
] as const;

export const HEADLINE = {
  year: 2025,
  naEvSalesM: 1.85,
  usEvSalesM: 1.6,
  canadaEvSalesM: 0.18,
  mexicoEvSalesM: 0.07,
  avgPackKg: 420,
  packTonsFromSalesKt: 777,
  operatingRecoveryKt: 98,
  underConstructionKt: 140,
  operatingPlusUcKt: 238,
  pretreatmentOperatingKt: 210,
  coverageOperatingPct: 12.6,
  coveragePlusUcPct: 30.6,
  gapOperatingKt: 679,
  gapPlusUcKt: 539,
  argonneUsOperatingKt: 35,
  argonneUsPlannedAddKt: 76,
} as const;

export type CountryId = "usa" | "canada" | "mexico";
export type TechRoute = "hydromet" | "pyromet" | "hybrid" | "pretreatment";
export type PlantStatus = "operating" | "under_construction" | "announced";
export type StatusFilter = "all" | PlantStatus;
export type TechFilter = "all" | TechRoute;
export type CountryFilter = "all" | CountryId;
export type GapLens = "operating" | "plusUc" | "pretreatment";

export type PlantRow = {
  id: string;
  label: string;
  operator: string;
  country: CountryId;
  stateOrProvince: string;
  tech: TechRoute;
  status: PlantStatus;
  /** Nameplate battery / black-mass input capacity, kt/yr */
  capacityKt: number;
  confidence: Confidence;
  notes?: string;
};

/**
 * Representative NA plant book (nameplate input kt/yr).
 * Recovery rows feed the operating / UC totals; pretreatment is tracked
 * separately so spokes are not stacked on hubs.
 */
export const PLANTS: PlantRow[] = [
  {
    id: "redwood-nv",
    label: "Battery Materials Campus",
    operator: "Redwood Materials",
    country: "usa",
    stateOrProvince: "Nevada",
    tech: "hybrid",
    status: "operating",
    capacityKt: 40,
    confidence: "disclosed",
    notes: "Calciner + hydromet; ramping toward larger campus totals",
  },
  {
    id: "ascend-ga",
    label: "Base 1 Covington",
    operator: "Ascend Elements",
    country: "usa",
    stateOrProvince: "Georgia",
    tech: "hydromet",
    status: "operating",
    capacityKt: 30,
    confidence: "disclosed",
  },
  {
    id: "cirba-oh",
    label: "Lancaster / Ohio hub",
    operator: "Cirba Solutions",
    country: "usa",
    stateOrProvince: "Ohio",
    tech: "hydromet",
    status: "operating",
    capacityKt: 12,
    confidence: "estimated",
  },
  {
    id: "cirba-bc",
    label: "Trail BC",
    operator: "Cirba Solutions",
    country: "canada",
    stateOrProvince: "British Columbia",
    tech: "hydromet",
    status: "operating",
    capacityKt: 8,
    confidence: "estimated",
  },
  {
    id: "retriev-bc",
    label: "Trail / Retriev legacy",
    operator: "Retriev Technologies",
    country: "canada",
    stateOrProvince: "British Columbia",
    tech: "hydromet",
    status: "operating",
    capacityKt: 5,
    confidence: "estimated",
  },
  {
    id: "abtc-nv",
    label: "ABTC recycling plant",
    operator: "American Battery Technology",
    country: "usa",
    stateOrProvince: "Nevada",
    tech: "hydromet",
    status: "operating",
    capacityKt: 3,
    confidence: "estimated",
  },
  {
    id: "licycle-spoke-on",
    label: "Ontario spoke (black mass)",
    operator: "Li-Cycle / Glencore",
    country: "canada",
    stateOrProvince: "Ontario",
    tech: "pretreatment",
    status: "operating",
    capacityKt: 15,
    confidence: "estimated",
  },
  {
    id: "licycle-spoke-az",
    label: "Arizona spoke",
    operator: "Li-Cycle / Glencore",
    country: "usa",
    stateOrProvince: "Arizona",
    tech: "pretreatment",
    status: "operating",
    capacityKt: 10,
    confidence: "estimated",
  },
  {
    id: "licycle-spoke-al",
    label: "Alabama spoke",
    operator: "Li-Cycle / Glencore",
    country: "usa",
    stateOrProvince: "Alabama",
    tech: "pretreatment",
    status: "operating",
    capacityKt: 10,
    confidence: "estimated",
  },
  {
    id: "licycle-spoke-ny",
    label: "New York spoke",
    operator: "Li-Cycle / Glencore",
    country: "usa",
    stateOrProvince: "New York",
    tech: "pretreatment",
    status: "operating",
    capacityKt: 10,
    confidence: "estimated",
  },
  {
    id: "other-us-operating",
    label: "Other US recovery (booked)",
    operator: "Multiple",
    country: "usa",
    stateOrProvince: "Multi-state",
    tech: "hydromet",
    status: "operating",
    capacityKt: 0,
    confidence: "carried",
    notes: "Absorbed into Argonne-aligned residual — see residual-us-op",
  },
  {
    id: "residual-us-op",
    label: "US residual recovery (Argonne align)",
    operator: "Multiple smaller sites",
    country: "usa",
    stateOrProvince: "Multi-state",
    tech: "hydromet",
    status: "operating",
    capacityKt: 0,
    confidence: "carried",
    notes: "Placeholder; operating sum calibrated below",
  },
  {
    id: "ascend-apex-ky",
    label: "Apex 1 Kentucky",
    operator: "Ascend Elements",
    country: "usa",
    stateOrProvince: "Kentucky",
    tech: "hydromet",
    status: "under_construction",
    capacityKt: 50,
    confidence: "estimated",
  },
  {
    id: "redwood-expand-nv",
    label: "Nevada campus expansion",
    operator: "Redwood Materials",
    country: "usa",
    stateOrProvince: "Nevada",
    tech: "hybrid",
    status: "under_construction",
    capacityKt: 40,
    confidence: "estimated",
  },
  {
    id: "abtc-doe-2",
    label: "DOE-backed second plant",
    operator: "American Battery Technology",
    country: "usa",
    stateOrProvince: "TBD / US",
    tech: "hydromet",
    status: "announced",
    capacityKt: 100,
    confidence: "disclosed",
    notes: "DOE grant announcement ~100 kt/yr design — not yet UC steel",
  },
  {
    id: "licycle-rochester",
    label: "Rochester Hub",
    operator: "Li-Cycle / Glencore",
    country: "usa",
    stateOrProvince: "New York",
    tech: "hydromet",
    status: "under_construction",
    capacityKt: 35,
    confidence: "estimated",
    notes: "Hub paused/restart risk — counted as UC nameplate",
  },
  {
    id: "cirba-sc",
    label: "South Carolina plant",
    operator: "Cirba Solutions",
    country: "usa",
    stateOrProvince: "South Carolina",
    tech: "hydromet",
    status: "under_construction",
    capacityKt: 15,
    confidence: "estimated",
  },
  {
    id: "cirba-az",
    label: "Arizona plant",
    operator: "Cirba Solutions",
    country: "usa",
    stateOrProvince: "Arizona",
    tech: "hydromet",
    status: "announced",
    capacityKt: 15,
    confidence: "estimated",
  },
  {
    id: "mexico-announced",
    label: "Mexico recovery (announced book)",
    operator: "Multiple",
    country: "mexico",
    stateOrProvince: "Multi-state",
    tech: "hydromet",
    status: "announced",
    capacityKt: 12,
    confidence: "carried",
  },
  {
    id: "pretreat-other-op",
    label: "Other NA pretreatment",
    operator: "Multiple",
    country: "usa",
    stateOrProvince: "Multi-state",
    tech: "pretreatment",
    status: "operating",
    capacityKt: 165,
    confidence: "estimated",
    notes: "Aligns DOE intermediate-processing ~175 kt reclaim context",
  },
];

/** Calibrated recovery plants only (exclude pretreatment + zero placeholders) */
export const RECOVERY_PLANTS = PLANTS.filter(
  (p) =>
    p.tech !== "pretreatment" &&
    p.capacityKt > 0 &&
    p.id !== "other-us-operating" &&
    p.id !== "residual-us-op",
);

export type SalesYearRow = {
  year: number;
  usSalesM: number;
  canadaSalesM: number;
  mexicoSalesM: number;
  avgPackKg: number;
  packKt: number;
  operatingKt: number;
  plusUcKt: number;
};

/** Path of pack tons vs capacity build-out */
export const SALES_CAPACITY_PATH: SalesYearRow[] = [
  {
    year: 2022,
    usSalesM: 0.95,
    canadaSalesM: 0.11,
    mexicoSalesM: 0.02,
    avgPackKg: 390,
    packKt: 421,
    operatingKt: 28,
    plusUcKt: 55,
  },
  {
    year: 2023,
    usSalesM: 1.4,
    canadaSalesM: 0.15,
    mexicoSalesM: 0.04,
    avgPackKg: 405,
    packKt: 644,
    operatingKt: 55,
    plusUcKt: 120,
  },
  {
    year: 2024,
    usSalesM: 1.6,
    canadaSalesM: 0.17,
    mexicoSalesM: 0.06,
    avgPackKg: 415,
    packKt: 760,
    operatingKt: 85,
    plusUcKt: 210,
  },
  {
    year: 2025,
    usSalesM: 1.6,
    canadaSalesM: 0.18,
    mexicoSalesM: 0.07,
    avgPackKg: 420,
    packKt: 777,
    operatingKt: 98,
    plusUcKt: 238,
  },
  {
    year: 2026,
    usSalesM: 1.45,
    canadaSalesM: 0.17,
    mexicoSalesM: 0.08,
    avgPackKg: 425,
    packKt: 723,
    operatingKt: 150,
    plusUcKt: 290,
  },
  {
    year: 2027,
    usSalesM: 1.55,
    canadaSalesM: 0.19,
    mexicoSalesM: 0.1,
    avgPackKg: 430,
    packKt: 791,
    operatingKt: 210,
    plusUcKt: 340,
  },
  {
    year: 2028,
    usSalesM: 1.75,
    canadaSalesM: 0.22,
    mexicoSalesM: 0.12,
    avgPackKg: 435,
    packKt: 909,
    operatingKt: 280,
    plusUcKt: 400,
  },
];

export type FeedstockRow = {
  id: string;
  label: string;
  sharePct: number;
  ktAtOperating: number;
  note: string;
};

/** What fills recycling lines today (scrap dominates early EV life) */
export const FEEDSTOCK_MIX: FeedstockRow[] = [
  {
    id: "scrap",
    label: "Cell / pack manufacturing scrap",
    sharePct: 58,
    ktAtOperating: 57,
    note: "Gigafactory scrap still the primary commercial feedstock",
  },
  {
    id: "consumer",
    label: "Consumer electronics EOL",
    sharePct: 18,
    ktAtOperating: 18,
    note: "Phones, laptops, tools — shorter lives than EV packs",
  },
  {
    id: "ev-eol",
    label: "EV / hybrid pack EOL",
    sharePct: 14,
    ktAtOperating: 14,
    note: "Still thin vs new pack placements; rises after 2028–30",
  },
  {
    id: "stationary",
    label: "Stationary / other LIB",
    sharePct: 6,
    ktAtOperating: 6,
    note: "ESS and specialty packs",
  },
  {
    id: "export-import",
    label: "Cross-border black mass / trade",
    sharePct: 4,
    ktAtOperating: 4,
    note: "Net trade residual; direction shifts with NA hubs",
  },
];

export type GapBarRow = {
  id: GapLens | "pack";
  label: string;
  kt: number;
  kind: "demand" | "supply";
};

export const GAP_BARS: GapBarRow[] = [
  { id: "pack", label: "Pack tons from NA EV sales", kt: 777, kind: "demand" },
  { id: "operating", label: "Operating recovery capacity", kt: 98, kind: "supply" },
  {
    id: "plusUc",
    label: "Operating + under construction",
    kt: 238,
    kind: "supply",
  },
  {
    id: "pretreatment",
    label: "Pretreatment / intermediate (operating)",
    kt: 210,
    kind: "supply",
  },
];

export type CountrySummary = {
  id: CountryId;
  label: string;
  evSalesM: number;
  packKt: number;
  operatingKt: number;
  plusUcKt: number;
  coverageOpPct: number;
  coverageUcPct: number;
};

export const COUNTRY_SUMMARY: CountrySummary[] = [
  {
    id: "usa",
    label: "United States",
    evSalesM: 1.6,
    packKt: 672,
    operatingKt: 85,
    plusUcKt: 225,
    coverageOpPct: 12.6,
    coverageUcPct: 33.5,
  },
  {
    id: "canada",
    label: "Canada",
    evSalesM: 0.18,
    packKt: 76,
    operatingKt: 13,
    plusUcKt: 13,
    coverageOpPct: 17.1,
    coverageUcPct: 17.1,
  },
  {
    id: "mexico",
    label: "Mexico",
    evSalesM: 0.07,
    packKt: 29,
    operatingKt: 0,
    plusUcKt: 0,
    coverageOpPct: 0,
    coverageUcPct: 0,
  },
];

export type TechMixRow = {
  tech: TechRoute;
  label: string;
  operatingKt: number;
  ucKt: number;
};

export const TECH_MIX: TechMixRow[] = [
  { tech: "hydromet", label: "Hydromet recovery", operatingKt: 58, ucKt: 100 },
  { tech: "hybrid", label: "Hybrid (thermal + hydro)", operatingKt: 40, ucKt: 40 },
  { tech: "pyromet", label: "Pyromet-led", operatingKt: 0, ucKt: 0 },
  {
    tech: "pretreatment",
    label: "Pretreatment / black mass",
    operatingKt: 210,
    ucKt: 25,
  },
];

export function fmtKt(n: number, digits = 0): string {
  return `${n.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })} kt`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtM(n: number, digits = 2): string {
  return `${n.toFixed(digits)} M`;
}

export function plantsFiltered(
  status: StatusFilter,
  tech: TechFilter,
  country: CountryFilter,
): PlantRow[] {
  return RECOVERY_PLANTS.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (tech !== "all" && p.tech !== tech) return false;
    if (country !== "all" && p.country !== country) return false;
    return true;
  }).sort((a, b) => b.capacityKt - a.capacityKt);
}

export function coverageForLens(lens: GapLens): {
  supplyKt: number;
  packKt: number;
  coveragePct: number;
  gapKt: number;
} {
  const packKt = HEADLINE.packTonsFromSalesKt;
  const supplyKt =
    lens === "operating"
      ? HEADLINE.operatingRecoveryKt
      : lens === "plusUc"
        ? HEADLINE.operatingPlusUcKt
        : HEADLINE.pretreatmentOperatingKt;
  return {
    supplyKt,
    packKt,
    coveragePct: (supplyKt / packKt) * 100,
    gapKt: packKt - supplyKt,
  };
}

export function pathCoveragePct(row: SalesYearRow, lens: GapLens): number {
  const supply = lens === "operating" ? row.operatingKt : row.plusUcKt;
  return (supply / row.packKt) * 100;
}
