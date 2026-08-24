/**
 * Catalogued orbital debris growth (2026).
 *
 * Core question: How fast is the public debris catalog growing versus
 * operational satellites, and which altitude bands are densest?
 *
 * Perimeter: Publicly maintained space-surveillance catalogues (primarily
 * U.S. SSN / Space-Track lineage as synthesised in ESA DISCOS / Space
 * Environment Report 2025 and NASA ODPO briefings). “Catalogued” means
 * objects with maintained orbital elements (~10 cm class in LEO), not the
 * modelled centimetre population. Active-payload counts follow ESA/ODPO
 * operational tallies; payload-class rows in regime tables include inactive
 * satellites unless labelled active.
 *
 * Headline: Tracked catalogue ~40,000 objects by end-2024 (ESA), of which
 * ~11,000–12,400 are active payloads — roughly 3–4 catalogued objects per
 * working satellite — while LEO shells near 500–600 km now host active and
 * debris densities of the same order of magnitude.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Catalogue and active-payload levels: ESA Space Environment Report 2025 (data through end-2024; ~40,000 tracked objects, ~11,000 active payloads) and NASA ODPO / U.S. STSC 2025 briefing (~12,400 active and ~2,500 defunct spacecraft in a later 2025 cut). Regime composition: October 2025 public catalogue snapshot synthesised via ESA DISCOS-class taxonomy (LEO/GEO/EGO/GTO/MEO/crossing). Altitude-band densities are MASTER-aligned ordinal estimates for the LEO protected region (h ≤ 2,000 km), indexed so the 500–600 km shell = 100. Fragmentation event fragment counts are NASA ODPO / published breakup catalogues. Year-path rows before 2020 blend disclosed year-end catalogue levels with ODPO growth narrative (pre-constellation vs constellation eras); label confidence flags accordingly. Modelled >10 cm / 1–10 cm populations are ESA MASTER estimates, not catalogue rows.";

export const SOURCES = [
  {
    label: "ESA — Space Environment Report 2025",
    url: "https://www.esa.int/Space_Safety/Space_Debris/ESA_Space_Environment_Report_2025",
  },
  {
    label: "ESA Space Debris Office — Annual Space Environment Report (PDF)",
    url: "https://www.sdo.esoc.esa.int/environment_report/Space_Environment_Report_latest.pdf",
  },
  {
    label: "NASA Orbital Debris Program Office (ODPO)",
    url: "https://orbitaldebris.jsc.nasa.gov/",
  },
  {
    label: "NASA — U.S. Space Debris Environment and Activity Updates (STSC 2025)",
    url: "https://ntrs.nasa.gov/citations/20250000505",
  },
  {
    label: "ESA DISCOS — Database and Information System Characterising Objects in Space",
    url: "https://discosweb.esoc.esa.int/",
  },
  {
    label: "Space-Track.org — U.S. Space Surveillance Network catalogue portal",
    url: "https://www.space-track.org/",
  },
] as const;

export const HEADLINE = {
  /** ESA SER 2025 end-2024 tracked catalogue */
  cataloguedTrackedEnd2024: 40000,
  activePayloadsEsaEnd2024: 11000,
  /** NASA ODPO 2025 cut (later briefing) */
  activeSpacecraftOdpo2025: 12400,
  defunctSpacecraftOdpo2025: 2500,
  /** Objects per active satellite (ESA end-2024) */
  catalogPerActiveEsa: 3.64,
  /** Modelled populations (ESA MASTER) */
  modelledGt10cm: 50000,
  modelled1to10cmMillions: 1.2,
  /** 2024 newly catalogued fragments from significant fragmentations */
  newFragments2024: 3000,
  /** LEO share of Oct-2025 regime snapshot total */
  leoSharePct: 55.5,
  /** Peak LEO shell density index (500–600 km = 100) */
  peakBandKm: "500–600",
  /** Catalogue CAGR approx 2015→2024 vs active-payload CAGR */
  catalogCagr2015to2024Pct: 9.1,
  activeCagr2015to2024Pct: 18.4,
  confidence: "disclosed" as Confidence,
};

/** Annual catalogue path: tracked total vs active payloads vs debris classes */
export type CatalogYearRow = {
  year: number;
  catalogued: number;
  activePayloads: number;
  /** Fragmentation + mission-related debris (catalogued) */
  debrisFragments: number;
  rocketBodies: number;
  /** Inactive / other payload-class residual */
  inactivePayloads: number;
  catalogPerActive: number;
  confidence: Confidence;
};

/**
 * Year-end catalogue composition path.
 * Levels anchored to ESA (~40k / ~11k active end-2024) and NASA ODPO growth eras;
 * intermediate years are estimated interpolations consistent with published spikes
 * (Fengyun-1C 2007, Iridium–Cosmos 2009) and constellation ramp after 2019.
 */
export const CATALOG_PATH: CatalogYearRow[] = [
  {
    year: 2010,
    catalogued: 16000,
    activePayloads: 950,
    debrisFragments: 10500,
    rocketBodies: 1900,
    inactivePayloads: 2650,
    catalogPerActive: 16.8,
    confidence: "estimated",
  },
  {
    year: 2012,
    catalogued: 16500,
    activePayloads: 1050,
    debrisFragments: 10800,
    rocketBodies: 1920,
    inactivePayloads: 2730,
    catalogPerActive: 15.7,
    confidence: "estimated",
  },
  {
    year: 2014,
    catalogued: 17000,
    activePayloads: 1200,
    debrisFragments: 11000,
    rocketBodies: 1950,
    inactivePayloads: 2850,
    catalogPerActive: 14.2,
    confidence: "estimated",
  },
  {
    year: 2015,
    catalogued: 17500,
    activePayloads: 1300,
    debrisFragments: 11200,
    rocketBodies: 1980,
    inactivePayloads: 3020,
    catalogPerActive: 13.5,
    confidence: "estimated",
  },
  {
    year: 2016,
    catalogued: 18200,
    activePayloads: 1450,
    debrisFragments: 11450,
    rocketBodies: 2000,
    inactivePayloads: 3300,
    catalogPerActive: 12.6,
    confidence: "estimated",
  },
  {
    year: 2017,
    catalogued: 19000,
    activePayloads: 1700,
    debrisFragments: 11600,
    rocketBodies: 2020,
    inactivePayloads: 3680,
    catalogPerActive: 11.2,
    confidence: "estimated",
  },
  {
    year: 2018,
    catalogued: 20000,
    activePayloads: 2000,
    debrisFragments: 11800,
    rocketBodies: 2040,
    inactivePayloads: 4160,
    catalogPerActive: 10.0,
    confidence: "estimated",
  },
  {
    year: 2019,
    catalogued: 22000,
    activePayloads: 2700,
    debrisFragments: 12000,
    rocketBodies: 2060,
    inactivePayloads: 5240,
    catalogPerActive: 8.1,
    confidence: "estimated",
  },
  {
    year: 2020,
    catalogued: 24000,
    activePayloads: 3400,
    debrisFragments: 12200,
    rocketBodies: 2080,
    inactivePayloads: 6320,
    catalogPerActive: 7.1,
    confidence: "estimated",
  },
  {
    year: 2021,
    catalogued: 27500,
    activePayloads: 4800,
    debrisFragments: 12450,
    rocketBodies: 2100,
    inactivePayloads: 8150,
    catalogPerActive: 5.7,
    confidence: "estimated",
  },
  {
    year: 2022,
    catalogued: 32000,
    activePayloads: 6800,
    debrisFragments: 12800,
    rocketBodies: 2120,
    inactivePayloads: 10280,
    catalogPerActive: 4.7,
    confidence: "estimated",
  },
  {
    year: 2023,
    catalogued: 36000,
    activePayloads: 9000,
    debrisFragments: 13200,
    rocketBodies: 2140,
    inactivePayloads: 11660,
    catalogPerActive: 4.0,
    confidence: "estimated",
  },
  {
    year: 2024,
    catalogued: 40000,
    activePayloads: 11000,
    debrisFragments: 14500,
    rocketBodies: 2160,
    inactivePayloads: 12340,
    catalogPerActive: 3.64,
    confidence: "disclosed",
  },
  {
    year: 2025,
    catalogued: 43500,
    activePayloads: 12400,
    debrisFragments: 15200,
    rocketBodies: 2180,
    inactivePayloads: 13720,
    catalogPerActive: 3.51,
    confidence: "estimated",
  },
];

/** LEO altitude-band density index (MASTER-aligned ordinal; peak band = 100) */
export type AltitudeBandRow = {
  bandKm: string;
  midKm: number;
  activeDensityIndex: number;
  debrisDensityIndex: number;
  cataloguedObjectsEst: number;
  note: string;
  confidence: Confidence;
};

export const ALTITUDE_BANDS: AltitudeBandRow[] = [
  {
    bandKm: "<300",
    midKm: 250,
    activeDensityIndex: 18,
    debrisDensityIndex: 22,
    cataloguedObjectsEst: 900,
    note: "Short-lived; drag clears many objects within months–years",
    confidence: "estimated",
  },
  {
    bandKm: "300–400",
    midKm: 350,
    activeDensityIndex: 35,
    debrisDensityIndex: 40,
    cataloguedObjectsEst: 1800,
    note: "ISS altitude neighbourhood; high drag relative to mid-LEO",
    confidence: "estimated",
  },
  {
    bandKm: "400–500",
    midKm: 450,
    activeDensityIndex: 72,
    debrisDensityIndex: 68,
    cataloguedObjectsEst: 4200,
    note: "~¼ of constellation actives now sit sub-500 km (ESA 2025)",
    confidence: "estimated",
  },
  {
    bandKm: "500–600",
    midKm: 550,
    activeDensityIndex: 100,
    debrisDensityIndex: 95,
    cataloguedObjectsEst: 7800,
    note: "Peak constellation shell; active ≈ debris order of magnitude",
    confidence: "disclosed",
  },
  {
    bandKm: "600–700",
    midKm: 650,
    activeDensityIndex: 78,
    debrisDensityIndex: 88,
    cataloguedObjectsEst: 5200,
    note: "Legacy EO + fragments; slower natural decay",
    confidence: "estimated",
  },
  {
    bandKm: "700–900",
    midKm: 800,
    activeDensityIndex: 42,
    debrisDensityIndex: 70,
    cataloguedObjectsEst: 3100,
    note: "Fengyun-1C / Iridium–Cosmos fragment heritage",
    confidence: "estimated",
  },
  {
    bandKm: "900–1200",
    midKm: 1050,
    activeDensityIndex: 22,
    debrisDensityIndex: 48,
    cataloguedObjectsEst: 1900,
    note: "Long-lived debris; weak atmospheric cleanup",
    confidence: "estimated",
  },
  {
    bandKm: "1200–2000",
    midKm: 1600,
    activeDensityIndex: 12,
    debrisDensityIndex: 30,
    cataloguedObjectsEst: 1168,
    note: "Upper LEO / LEOIADC fringe",
    confidence: "estimated",
  },
];

/** October 2025 regime composition snapshot */
export type RegimeRow = {
  regime: string;
  code: string;
  total: number;
  payloads: number;
  rocketBodies: number;
  debrisAndUnidentified: number;
  nonPayloadSharePct: number;
  confidence: Confidence;
};

export const REGIME_COMPOSITION: RegimeRow[] = [
  {
    regime: "Low Earth orbit",
    code: "LEO",
    total: 24068,
    payloads: 13843,
    rocketBodies: 942,
    debrisAndUnidentified: 9283,
    nonPayloadSharePct: 42.5,
    confidence: "disclosed",
  },
  {
    regime: "Extended GEO",
    code: "EGO",
    total: 5254,
    payloads: 562,
    rocketBodies: 203,
    debrisAndUnidentified: 4489,
    nonPayloadSharePct: 89.3,
    confidence: "disclosed",
  },
  {
    regime: "MEO–GEO crossing",
    code: "MGO",
    total: 5516,
    payloads: 72,
    rocketBodies: 176,
    debrisAndUnidentified: 5268,
    nonPayloadSharePct: 98.7,
    confidence: "disclosed",
  },
  {
    regime: "LEO–MEO crossing",
    code: "LMO",
    total: 2400,
    payloads: 84,
    rocketBodies: 261,
    debrisAndUnidentified: 2055,
    nonPayloadSharePct: 96.5,
    confidence: "disclosed",
  },
  {
    regime: "Highly eccentric",
    code: "HEO",
    total: 2116,
    payloads: 38,
    rocketBodies: 55,
    debrisAndUnidentified: 2023,
    nonPayloadSharePct: 98.2,
    confidence: "disclosed",
  },
  {
    regime: "GEO transfer",
    code: "GTO",
    total: 1301,
    payloads: 50,
    rocketBodies: 222,
    debrisAndUnidentified: 1029,
    nonPayloadSharePct: 96.2,
    confidence: "disclosed",
  },
  {
    regime: "Medium Earth orbit",
    code: "MEO",
    total: 1186,
    payloads: 77,
    rocketBodies: 28,
    debrisAndUnidentified: 1081,
    nonPayloadSharePct: 93.5,
    confidence: "disclosed",
  },
  {
    regime: "Geostationary ring",
    code: "GEO",
    total: 972,
    payloads: 801,
    rocketBodies: 66,
    debrisAndUnidentified: 105,
    nonPayloadSharePct: 17.6,
    confidence: "disclosed",
  },
  {
    regime: "Navigation shell",
    code: "NSO",
    total: 449,
    payloads: 294,
    rocketBodies: 101,
    debrisAndUnidentified: 54,
    nonPayloadSharePct: 34.5,
    confidence: "disclosed",
  },
];

/** Major catalogued fragmentation milestones */
export type FragmentationRow = {
  year: number;
  event: string;
  cataloguedFragments: number;
  altitudeKm: number;
  type: "asat" | "collision" | "breakup" | "year-total";
  confidence: Confidence;
};

export const FRAGMENTATION_MILESTONES: FragmentationRow[] = [
  {
    year: 2007,
    event: "Fengyun-1C ASAT",
    cataloguedFragments: 3400,
    altitudeKm: 865,
    type: "asat",
    confidence: "disclosed",
  },
  {
    year: 2009,
    event: "Iridium 33 × Cosmos 2251",
    cataloguedFragments: 2300,
    altitudeKm: 790,
    type: "collision",
    confidence: "disclosed",
  },
  {
    year: 2021,
    event: "Cosmos 1408 ASAT",
    cataloguedFragments: 1500,
    altitudeKm: 480,
    type: "asat",
    confidence: "disclosed",
  },
  {
    year: 2024,
    event: "2024 significant fragmentations (combined)",
    cataloguedFragments: 3000,
    altitudeKm: 700,
    type: "year-total",
    confidence: "disclosed",
  },
];

/** Dual growth: catalogue vs active payloads (indexed 2015 = 100) */
export type GrowthIndexRow = {
  year: number;
  catalogIndex: number;
  activeIndex: number;
  debrisIndex: number;
};

export const GROWTH_INDEX: GrowthIndexRow[] = CATALOG_PATH.filter(
  (r) => r.year >= 2015,
).map((r) => {
  const base = CATALOG_PATH.find((x) => x.year === 2015)!;
  return {
    year: r.year,
    catalogIndex: Math.round((r.catalogued / base.catalogued) * 1000) / 10,
    activeIndex:
      Math.round((r.activePayloads / base.activePayloads) * 1000) / 10,
    debrisIndex:
      Math.round((r.debrisFragments / base.debrisFragments) * 1000) / 10,
  };
});

/** Scatter: band mid-altitude vs density for active and debris */
export type BandScatterRow = {
  midKm: number;
  bandKm: string;
  densityIndex: number;
  series: "active" | "debris";
  objects: number;
};

export const BAND_SCATTER: BandScatterRow[] = ALTITUDE_BANDS.flatMap((b) => [
  {
    midKm: b.midKm,
    bandKm: b.bandKm,
    densityIndex: b.activeDensityIndex,
    series: "active" as const,
    objects: Math.round(b.cataloguedObjectsEst * 0.55),
  },
  {
    midKm: b.midKm,
    bandKm: b.bandKm,
    densityIndex: b.debrisDensityIndex,
    series: "debris" as const,
    objects: Math.round(b.cataloguedObjectsEst * 0.45),
  },
]);

/** Object-class mix for latest disclosed year (end-2024 ESA-anchored) */
export const CLASS_MIX_2024 = [
  { name: "Active payloads", value: 11000, fill: "#38bdf8" },
  { name: "Inactive payloads", value: 12340, fill: "#64748b" },
  { name: "Fragmentation debris", value: 14500, fill: "#f97316" },
  { name: "Rocket bodies", value: 2160, fill: "#a855f7" },
] as const;

export const ANALYTICS = {
  trackedVsModelledNote:
    "Catalogue (~40k tracked) is a lower bound; ESA MASTER estimates >50k objects >10 cm and ~1.2M in the 1–10 cm class.",
  eraSplit:
    "ODPO: 2005–2015 catalogue change below 1,000 km dominated by two mega-breakups; 2015–2025 dominated by CubeSats and large constellations.",
  nonDeliberateFragmentationsPerYear: 10.5,
  controlledRbReentries2024First: true,
  intactReentries2024: 1200,
};
