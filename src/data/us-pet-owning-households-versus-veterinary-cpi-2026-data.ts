/**
 * US pet-owning households versus veterinary CPI (1997–2026).
 *
 * Core question: What share of households own a dog or cat, and how far
 * has BLS veterinarian-services CPI outrun all-items CPI?
 *
 * Ownership: AVMA Pet Ownership and Demographic Sourcebook waves
 * (public summary tables for 1996–2025). APPA National Pet Owners Survey
 * levels are shown as a parallel, higher estimate (different survey frame).
 * Prices: BLS CPI-U veterinarian services (CUUR0000SS62054, Dec 1997=100)
 * and all-items (CUUR0000SA0, 1982–84=100), annual averages; 2026 is a
 * partial-year composite published by BLS republishers and treated as
 * provisional.
 */

export const SOURCE_NOTE =
  "AVMA Pet Ownership and Demographic Sourcebook public summaries (1996–2025 household shares). APPA National Pet Owners Survey / State of the Industry ownership and spend totals (parallel frame — typically higher than AVMA). BLS CPI-U CUUR0000SS62054 (veterinarian services) and CUUR0000SA0 (all items). Confidence: high on BLS annual CPI; medium-high on AVMA point estimates (opt-in weighted surveys); medium on APPA levels used only for contrast.";

export const SOURCES = [
  {
    label: "AVMA — U.S. pet ownership statistics",
    url: "https://www.avma.org/resources-tools/reports-statistics/us-pet-ownership-statistics",
  },
  {
    label: "AVMA — Pet population continues to increase (2024 forum summary)",
    url: "https://www.avma.org/news/pet-population-continues-increase-while-pet-spending-declines",
  },
  {
    label: "BLS — CPI-U veterinarian services (CUUR0000SS62054)",
    url: "https://data.bls.gov/timeseries/CUUR0000SS62054",
  },
  {
    label: "BLS — CPI-U all items (CUUR0000SA0)",
    url: "https://data.bls.gov/timeseries/CUUR0000SA0",
  },
  {
    label: "APPA — U.S. pet industry reaches $158 billion in 2025",
    url: "https://americanpetproducts.org/news/u.s.-pet-industry-reaches-158-billion-in-2025-poised-for-continued-growth-in-2026",
  },
] as const;

export const HEADLINE = {
  /** AVMA 2025: share of U.S. households owning any pet */
  anyPetHhShare2025: 58.6,
  /** AVMA 2025: dog-owning household share (%) */
  dogHhShare2025: 42.6,
  /** AVMA 2025: cat-owning household share (%) */
  catHhShare2025: 32.6,
  /** AVMA 2025: dog-owning households (millions) */
  dogHhMillions2025: 56.3,
  /** AVMA 2025: cat-owning households (millions) */
  catHhMillions2025: 43.1,
  /** AVMA 2025: owned dogs (millions) */
  dogsMillions2025: 87.3,
  /** AVMA 2025: owned cats (millions) */
  catsMillions2025: 76.3,
  /** AVMA 2025: avg vet spend per dog-owning HH ($/yr) */
  dogVetSpend2025: 598,
  /** AVMA 2025: avg vet spend per cat-owning HH ($/yr) */
  catVetSpend2025: 529,
  /** AVMA dog HH share 1996 (%) */
  dogHhShare1996: 31.6,
  /** AVMA dog HH share 2024 peak in series (%) */
  dogHhShare2024: 45.5,
  /** Vet CPI annual average, 1997 (base) */
  vetCpi1997: 100.0,
  /** Vet CPI annual average, 2019 */
  vetCpi2019: 267.213,
  /** Vet CPI annual average, 2025 */
  vetCpi2025: 393.244,
  /** Vet CPI provisional 2026 composite */
  vetCpi2026: 410.723,
  /** All-items CPI annual average, 1997 */
  allCpi1997: 160.5,
  /** All-items CPI annual average, 2019 */
  allCpi2019: 255.7,
  /** All-items CPI annual average, 2025 */
  allCpi2025: 321.9,
  /** Vet index 1997=100 in 2025 */
  vetIndex1997_2025: 393.2,
  /** All-items index 1997=100 in 2025 */
  allIndex1997_2025: 200.6,
  /** Cumulative outrun: vet − all-items on 1997=100 scale, 2025 */
  gap1997base2025: 192.7,
  /** Vet index 2019=100 in 2025 */
  vetIndex2019_2025: 147.2,
  /** All-items index 2019=100 in 2025 */
  allIndex2019_2025: 125.9,
  /** Gap on 2019=100 scale, 2025 (pp) */
  gap2019base2025: 21.3,
  /** Vet CPI multiple of 1997 level by 2025 */
  vetMultiple1997to2025: 3.93,
  /** All-items multiple of 1997 level by 2025 */
  allMultiple1997to2025: 2.01,
  /** Avg annual vet CPI inflation 1997→2025 (%) */
  vetAvgAnnualPct1997to2025: 5.0,
  /** Avg annual all-items inflation 1997→2025 (%) */
  allAvgAnnualPct1997to2025: 2.5,
  /** APPA 2025 industry spend ($B) */
  appaSpend2025Bn: 158,
  /** APPA 2025 dog HH share (%) — parallel frame */
  appaDogShare2025: 53,
  /** APPA 2025 cat HH share (%) — parallel frame */
  appaCatShare2025: 39,
  latestOwnershipYear: 2025,
  latestCpiYear: 2025,
} as const;

export const VIZ_MARKERS = [
  "Pet households vs veterinary CPI",
  "Vet CPI outran all-items by ~193 points on a 1997=100 scale",
] as const;

export type IndexBase = "1997" | "2019";
export type OwnershipFrame = "avma" | "appa";
export type SpeciesFocus = "dog" | "cat" | "both";

export type OwnershipWave = {
  year: number;
  dogShare: number | null;
  catShare: number | null;
  anyPetShare: number | null;
  dogHhMillions: number | null;
  catHhMillions: number | null;
  source: "avma" | "appa";
  note?: string;
};

/** AVMA public wave points (sparse survey years). */
export const OWNERSHIP_AVMA: OwnershipWave[] = [
  {
    year: 1996,
    dogShare: 31.6,
    catShare: 27.3,
    anyPetShare: null,
    dogHhMillions: 31.3,
    catHhMillions: 27.0,
    source: "avma",
    note: "AVMA long-run baseline cited in 2024 forum summary",
  },
  {
    year: 2011,
    dogShare: 36.5,
    catShare: 30.4,
    anyPetShare: null,
    dogHhMillions: null,
    catHhMillions: null,
    source: "avma",
    note: "Interpolated mid-wave from AVMA published trend narrative",
  },
  {
    year: 2016,
    dogShare: 38.4,
    catShare: 25.0,
    anyPetShare: null,
    dogHhMillions: null,
    catHhMillions: null,
    source: "avma",
  },
  {
    year: 2020,
    dogShare: 44.6,
    catShare: 26.0,
    anyPetShare: null,
    dogHhMillions: null,
    catHhMillions: null,
    source: "avma",
  },
  {
    year: 2022,
    dogShare: 44.5,
    catShare: 29.0,
    anyPetShare: null,
    dogHhMillions: null,
    catHhMillions: null,
    source: "avma",
    note: "2022 Sourcebook public roundings",
  },
  {
    year: 2024,
    dogShare: 45.5,
    catShare: 32.1,
    anyPetShare: null,
    dogHhMillions: 59.8,
    catHhMillions: 42.1,
    source: "avma",
  },
  {
    year: 2025,
    dogShare: 42.6,
    catShare: 32.6,
    anyPetShare: 58.6,
    dogHhMillions: 56.3,
    catHhMillions: 43.1,
    source: "avma",
  },
];

/** APPA parallel ownership levels (higher frame; not interchangeable with AVMA). */
export const OWNERSHIP_APPA: OwnershipWave[] = [
  {
    year: 2022,
    dogShare: null,
    catShare: null,
    anyPetShare: 66,
    dogHhMillions: null,
    catHhMillions: null,
    source: "appa",
    note: "APPA 2023–24 National Pet Owners Survey: 66% / 86.9M any-pet HH",
  },
  {
    year: 2024,
    dogShare: 51,
    catShare: null,
    anyPetShare: null,
    dogHhMillions: null,
    catHhMillions: null,
    source: "appa",
  },
  {
    year: 2025,
    dogShare: 53,
    catShare: 39,
    anyPetShare: null,
    dogHhMillions: 71,
    catHhMillions: 53,
    source: "appa",
    note: "APPA State of the Industry 2026; 95M any-pet households",
  },
];

export type CpiAnnual = {
  year: number;
  vetCpi: number;
  allCpi: number;
  /** Vet on 1997=100 (native for vet; all-items rebased) */
  vetIdx1997: number;
  allIdx1997: number;
  gap1997: number;
  /** Both rebased to 2019 annual = 100 */
  vetIdx2019: number;
  allIdx2019: number;
  gap2019: number;
  vetYoyPct: number | null;
  allYoyPct: number | null;
  provisional?: boolean;
};

/** BLS annual averages: vet CUUR0000SS62054; all-items CUUR0000SA0. */
const VET_CPI_RAW: Record<number, number> = {
  1997: 100.0,
  1998: 102.483,
  1999: 106.758,
  2000: 114.908,
  2001: 122.742,
  2002: 129.633,
  2003: 136.45,
  2004: 144.683,
  2005: 153.392,
  2006: 160.117,
  2007: 170.356,
  2008: 181.355,
  2009: 191.211,
  2010: 198.359,
  2011: 208.21,
  2012: 214.238,
  2013: 219.859,
  2014: 227.624,
  2015: 236.187,
  2016: 244.808,
  2017: 250.203,
  2018: 256.594,
  2019: 267.213,
  2020: 277.093,
  2021: 288.769,
  2022: 314.272,
  2023: 343.929,
  2024: 369.383,
  2025: 393.244,
  2026: 410.723,
};

const ALL_CPI_RAW: Record<number, number> = {
  1997: 160.5,
  1998: 163.0,
  1999: 166.6,
  2000: 172.2,
  2001: 177.1,
  2002: 179.9,
  2003: 184.0,
  2004: 188.9,
  2005: 195.3,
  2006: 201.6,
  2007: 207.3,
  2008: 215.3,
  2009: 214.5,
  2010: 218.1,
  2011: 224.9,
  2012: 229.6,
  2013: 233.0,
  2014: 236.7,
  2015: 237.0,
  2016: 240.0,
  2017: 245.1,
  2018: 251.1,
  2019: 255.7,
  2020: 258.8,
  2021: 271.0,
  2022: 292.7,
  2023: 304.7,
  2024: 313.7,
  2025: 321.9,
  2026: 334.4,
};

const VET_2019 = VET_CPI_RAW[2019];
const ALL_2019 = ALL_CPI_RAW[2019];
const ALL_1997 = ALL_CPI_RAW[1997];

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const CPI_ANNUAL: CpiAnnual[] = Object.keys(VET_CPI_RAW)
  .map(Number)
  .sort((a, b) => a - b)
  .map((year, i, years) => {
    const vetCpi = VET_CPI_RAW[year];
    const allCpi = ALL_CPI_RAW[year];
    const vetIdx1997 = round1(vetCpi);
    const allIdx1997 = round1((allCpi / ALL_1997) * 100);
    const vetIdx2019 = round1((vetCpi / VET_2019) * 100);
    const allIdx2019 = round1((allCpi / ALL_2019) * 100);
    const prev = i > 0 ? years[i - 1] : null;
    const vetYoyPct =
      prev != null
        ? round2(((vetCpi / VET_CPI_RAW[prev]) - 1) * 100)
        : null;
    const allYoyPct =
      prev != null
        ? round2(((allCpi / ALL_CPI_RAW[prev]) - 1) * 100)
        : null;
    return {
      year,
      vetCpi,
      allCpi,
      vetIdx1997,
      allIdx1997,
      gap1997: round1(vetIdx1997 - allIdx1997),
      vetIdx2019,
      allIdx2019,
      gap2019: round1(vetIdx2019 - allIdx2019),
      vetYoyPct,
      allYoyPct,
      provisional: year === 2026,
    };
  });

/** Species snapshot for 2025 AVMA (bar / radial panels). */
export const SPECIES_2025 = [
  {
    species: "Dogs",
    hhShare: 42.6,
    hhMillions: 56.3,
    animalsMillions: 87.3,
    avgPerHh: 1.6,
    vetSpendPerHh: 598,
  },
  {
    species: "Cats",
    hhShare: 32.6,
    hhMillions: 43.1,
    animalsMillions: 76.3,
    avgPerHh: 1.8,
    vetSpendPerHh: 529,
  },
] as const;

/** Other companion species (AVMA 2025), HH share %. */
export const OTHER_SPECIES_2025 = [
  { species: "Fish", hhShare: 2.6, hhMillions: 3.4 },
  { species: "Reptiles", hhShare: 1.8, hhMillions: 2.4 },
  { species: "Birds", hhShare: 1.6, hhMillions: 2.1 },
  { species: "Small mammals", hhShare: 0.8, hhMillions: 1.1 },
  { species: "Poultry", hhShare: 0.7, hhMillions: 0.9 },
  { species: "Rabbits", hhShare: 0.6, hhMillions: 0.8 },
  { species: "Horses", hhShare: 0.4, hhMillions: 0.5 },
] as const;

/** Decade milestones for slope / annotation panels. */
export const MILESTONES = [
  { year: 1997, label: "CPI series start", vetIdx1997: 100, allIdx1997: 100 },
  { year: 2008, label: "Pre-GFC", vetIdx1997: 181.4, allIdx1997: 134.1 },
  { year: 2019, label: "Pre-pandemic", vetIdx1997: 267.2, allIdx1997: 159.3 },
  { year: 2022, label: "Peak YoY vet jump", vetIdx1997: 314.3, allIdx1997: 182.4 },
  { year: 2025, label: "Latest full year", vetIdx1997: 393.2, allIdx1997: 200.6 },
] as const;

export const ANALYTICS = {
  slug: "us-pet-owning-households-versus-veterinary-cpi-2026",
  smokeMarker: "Pet households vs veterinary CPI",
  defaultPanel: "cpi-race" as const,
  defaultBase: "1997" as IndexBase,
  defaultFrame: "avma" as OwnershipFrame,
};

export function ownershipForFrame(frame: OwnershipFrame): OwnershipWave[] {
  return frame === "appa" ? OWNERSHIP_APPA : OWNERSHIP_AVMA;
}

export function cpiWithBase(base: IndexBase): Array<{
  year: number;
  vet: number;
  all: number;
  gap: number;
  provisional?: boolean;
}> {
  return CPI_ANNUAL.map((r) =>
    base === "1997"
      ? {
          year: r.year,
          vet: r.vetIdx1997,
          all: r.allIdx1997,
          gap: r.gap1997,
          provisional: r.provisional,
        }
      : {
          year: r.year,
          vet: r.vetIdx2019,
          all: r.allIdx2019,
          gap: r.gap2019,
          provisional: r.provisional,
        },
  );
}
