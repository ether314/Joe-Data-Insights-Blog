/**
 * Blast-furnace (BF/BOF) vs electric-arc furnace (EAF) crude steel by country.
 *
 * Core question: What share of crude steel is still blast-furnace route in
 * China/India versus EAF in the US/EU, and what does that mean for residual
 * process emissions?
 *
 * Anchors: worldsteel Steel Statistical Yearbook / World Steel in Figures
 * (crude steel by process / oxygen converter vs EAF); IEA Iron and Steel
 * Tracking and Net Zero Industry pathways (route CO₂ intensities). Country
 * route shares are desk reconstructions aligned to published process splits
 * for ~2023–2024e — not plant-level inventories.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Crude steel tonnages and oxygen-converter / EAF process shares lean on worldsteel World Steel in Figures and Steel Statistical Yearbook process tables. India induction-furnace tonnage is folded into the EAF-family share for route comparison (scrap/secondary melt vs BF/BOF primary). Route CO₂ intensities follow IEA Iron and Steel Tracking / industry Net Zero notes (~2.0–2.3 t CO₂/t for BF-BOF; ~0.4–0.7 t CO₂/t for scrap-EAF on typical grids; DRI-EAF higher). Country residual process Mt = crude × BF share × BF intensity + crude × EAF share × EAF intensity — analytical, not UNFCCC submissions. Vintage ~2023–2024e unless noted.";

export const SOURCES = [
  {
    label: "worldsteel — World Steel in Figures",
    url: "https://worldsteel.org/data/world-steel-in-figures/",
  },
  {
    label: "worldsteel — Steel Statistical Yearbook",
    url: "https://worldsteel.org/data/steel-statistical-yearbook/",
  },
  {
    label: "IEA — Iron and Steel Tracking",
    url: "https://www.iea.org/energy-system/industry/steel",
  },
  {
    label: "IEA — Net Zero Industry / steel pathways",
    url: "https://www.iea.org/reports/iron-and-steel-technology-roadmap",
  },
] as const;

/** Headline punchline — BF share of crude steel in Asia vs EAF peers */
export const HEADLINE = {
  year: 2023,
  globalCrudeMt: 1892,
  globalBfSharePct: 71.2,
  globalEafSharePct: 28.8,
  chinaCrudeMt: 1019,
  chinaBfSharePct: 89.6,
  indiaCrudeMt: 140.2,
  indiaBfSharePct: 54.8,
  usCrudeMt: 81.4,
  usEafSharePct: 69.8,
  eu27CrudeMt: 126.3,
  eu27EafSharePct: 43.6,
  chinaIndiaBfMt: 990,
  chinaIndiaBfShareOfGlobalBfPct: 73.5,
  bfIntensityTPerT: 2.15,
  scrapEafIntensityTPerT: 0.55,
  impliedGlobalProcessGt: 2.85,
} as const;

export type CountryId =
  | "china"
  | "india"
  | "japan"
  | "usa"
  | "russia"
  | "korea"
  | "germany"
  | "turkey"
  | "brazil"
  | "iran"
  | "italy"
  | "vietnam"
  | "taiwan"
  | "mexico"
  | "france"
  | "other";

export type RegionFilter = "all" | "asia" | "americas" | "emea" | "other";

export type RankLens = "bfShare" | "eafShare" | "crude" | "processMt";

export type CountryRouteRow = {
  id: CountryId;
  label: string;
  crudeMt: number;
  /** Oxygen converter / BF-BOF share of crude (%) */
  bfSharePct: number;
  /** EAF (+ IF where material) share of crude (%) */
  eafSharePct: number;
  /** Desk residual process CO₂ Mt at IEA-style route intensities */
  processMt: number;
  intensityTPerT: number;
  confidence: Confidence;
  region: "asia" | "americas" | "emea" | "other";
};

/**
 * 2023–2024e desk table. Crude Mt ≈ worldsteel-order magnitudes.
 * BF share ≈ oxygen-converter share; EAF share ≈ 100 − BF (India IF in EAF family).
 * processMt ≈ crude × (bfShare/100×2.15 + eafShare/100×0.55), rounded.
 */
export const COUNTRY_ROUTES: CountryRouteRow[] = [
  {
    id: "china",
    label: "China",
    crudeMt: 1019,
    bfSharePct: 89.6,
    eafSharePct: 10.4,
    processMt: 2020,
    intensityTPerT: 1.98,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "india",
    label: "India",
    crudeMt: 140.2,
    bfSharePct: 54.8,
    eafSharePct: 45.2,
    processMt: 200,
    intensityTPerT: 1.43,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "japan",
    label: "Japan",
    crudeMt: 87.0,
    bfSharePct: 74.8,
    eafSharePct: 25.2,
    processMt: 152,
    intensityTPerT: 1.75,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "usa",
    label: "United States",
    crudeMt: 81.4,
    bfSharePct: 30.2,
    eafSharePct: 69.8,
    processMt: 84,
    intensityTPerT: 1.03,
    confidence: "estimated",
    region: "americas",
  },
  {
    id: "russia",
    label: "Russia",
    crudeMt: 75.8,
    bfSharePct: 66.5,
    eafSharePct: 33.5,
    processMt: 122,
    intensityTPerT: 1.61,
    confidence: "carried",
    region: "emea",
  },
  {
    id: "korea",
    label: "South Korea",
    crudeMt: 66.7,
    bfSharePct: 68.9,
    eafSharePct: 31.1,
    processMt: 110,
    intensityTPerT: 1.65,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "germany",
    label: "Germany",
    crudeMt: 35.4,
    bfSharePct: 70.1,
    eafSharePct: 29.9,
    processMt: 59,
    intensityTPerT: 1.67,
    confidence: "estimated",
    region: "emea",
  },
  {
    id: "turkey",
    label: "Türkiye",
    crudeMt: 33.7,
    bfSharePct: 28.4,
    eafSharePct: 71.6,
    processMt: 34,
    intensityTPerT: 1.01,
    confidence: "estimated",
    region: "emea",
  },
  {
    id: "brazil",
    label: "Brazil",
    crudeMt: 31.9,
    bfSharePct: 77.2,
    eafSharePct: 22.8,
    processMt: 57,
    intensityTPerT: 1.79,
    confidence: "estimated",
    region: "americas",
  },
  {
    id: "iran",
    label: "Iran",
    crudeMt: 31.1,
    bfSharePct: 18.5,
    eafSharePct: 81.5,
    processMt: 26,
    intensityTPerT: 0.84,
    confidence: "carried",
    region: "emea",
  },
  {
    id: "italy",
    label: "Italy",
    crudeMt: 21.1,
    bfSharePct: 15.8,
    eafSharePct: 84.2,
    processMt: 17,
    intensityTPerT: 0.81,
    confidence: "estimated",
    region: "emea",
  },
  {
    id: "vietnam",
    label: "Vietnam",
    crudeMt: 19.2,
    bfSharePct: 62.0,
    eafSharePct: 38.0,
    processMt: 30,
    intensityTPerT: 1.54,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "taiwan",
    label: "Taiwan",
    crudeMt: 19.1,
    bfSharePct: 58.5,
    eafSharePct: 41.5,
    processMt: 28,
    intensityTPerT: 1.49,
    confidence: "estimated",
    region: "asia",
  },
  {
    id: "mexico",
    label: "Mexico",
    crudeMt: 18.4,
    bfSharePct: 32.0,
    eafSharePct: 68.0,
    processMt: 19,
    intensityTPerT: 1.06,
    confidence: "estimated",
    region: "americas",
  },
  {
    id: "france",
    label: "France",
    crudeMt: 10.0,
    bfSharePct: 64.5,
    eafSharePct: 35.5,
    processMt: 16,
    intensityTPerT: 1.58,
    confidence: "estimated",
    region: "emea",
  },
];

/** EU-27 aggregate for peer comparison (not in country table). */
export const EU27_AGGREGATE = {
  label: "EU-27",
  crudeMt: 126.3,
  bfSharePct: 56.4,
  eafSharePct: 43.6,
  processMt: 184,
  intensityTPerT: 1.46,
} as const;

/** Peer contrast cards: Asia BF lock-in vs US/EU EAF depth */
export const PEER_CONTRAST = [
  {
    id: "china",
    label: "China",
    bfSharePct: HEADLINE.chinaBfSharePct,
    eafSharePct: 100 - HEADLINE.chinaBfSharePct,
    crudeMt: HEADLINE.chinaCrudeMt,
    role: "bf-heavy" as const,
  },
  {
    id: "india",
    label: "India",
    bfSharePct: HEADLINE.indiaBfSharePct,
    eafSharePct: 100 - HEADLINE.indiaBfSharePct,
    crudeMt: HEADLINE.indiaCrudeMt,
    role: "bf-heavy" as const,
  },
  {
    id: "usa",
    label: "United States",
    bfSharePct: 100 - HEADLINE.usEafSharePct,
    eafSharePct: HEADLINE.usEafSharePct,
    crudeMt: HEADLINE.usCrudeMt,
    role: "eaf-heavy" as const,
  },
  {
    id: "eu27",
    label: "EU-27",
    bfSharePct: 100 - HEADLINE.eu27EafSharePct,
    eafSharePct: HEADLINE.eu27EafSharePct,
    crudeMt: HEADLINE.eu27CrudeMt,
    role: "mixed" as const,
  },
] as const;

/** Stacked BF vs EAF Mt for top producers */
export const ROUTE_STACK = COUNTRY_ROUTES.filter((r) =>
  ["china", "india", "japan", "usa", "russia", "korea", "germany", "turkey"].includes(
    r.id,
  ),
).map((r) => ({
  name: r.label,
  bfMt: Math.round((r.crudeMt * r.bfSharePct) / 100),
  eafMt: Math.round((r.crudeMt * r.eafSharePct) / 100),
  bfSharePct: r.bfSharePct,
  eafSharePct: r.eafSharePct,
}));

/** Global route mix donut */
export const GLOBAL_ROUTE_MIX = [
  { name: "BF / BOF", value: HEADLINE.globalBfSharePct, fill: "#b45309" },
  { name: "EAF (+ IF)", value: HEADLINE.globalEafSharePct, fill: "#0e7490" },
] as const;

/** BF share ladder — sorted high → low for viz */
export const BF_SHARE_LADDER = [...COUNTRY_ROUTES]
  .sort((a, b) => b.bfSharePct - a.bfSharePct)
  .map((r) => ({
    name: r.label,
    bfSharePct: r.bfSharePct,
    eafSharePct: r.eafSharePct,
    id: r.id,
  }));

/** Intensity vs volume path — illustrative index since 2010 */
export const INTENSITY_PATH = [
  { year: 2010, globalIntensity: 1.85, bfSharePct: 70.5, eafSharePct: 29.5 },
  { year: 2013, globalIntensity: 1.88, bfSharePct: 71.8, eafSharePct: 28.2 },
  { year: 2016, globalIntensity: 1.86, bfSharePct: 72.4, eafSharePct: 27.6 },
  { year: 2019, globalIntensity: 1.84, bfSharePct: 71.9, eafSharePct: 28.1 },
  { year: 2021, globalIntensity: 1.82, bfSharePct: 71.5, eafSharePct: 28.5 },
  { year: 2023, globalIntensity: 1.78, bfSharePct: 71.2, eafSharePct: 28.8 },
] as const;

/** Scatter: BF share vs residual process intensity */
export function scatterPoints() {
  return COUNTRY_ROUTES.map((r) => ({
    id: r.id,
    label: r.label,
    bfSharePct: r.bfSharePct,
    intensityTPerT: r.intensityTPerT,
    crudeMt: r.crudeMt,
    processMt: r.processMt,
    region: r.region,
  }));
}

export function rankedCountries(lens: RankLens, region: RegionFilter) {
  const rows =
    region === "all"
      ? COUNTRY_ROUTES
      : COUNTRY_ROUTES.filter((r) => r.region === region);
  const sorted = [...rows].sort((a, b) => {
    switch (lens) {
      case "bfShare":
        return b.bfSharePct - a.bfSharePct;
      case "eafShare":
        return b.eafSharePct - a.eafSharePct;
      case "crude":
        return b.crudeMt - a.crudeMt;
      case "processMt":
        return b.processMt - a.processMt;
      default:
        return 0;
    }
  });
  return sorted;
}

export function regionProcessRollup() {
  const buckets: Record<string, { name: string; processMt: number; crudeMt: number }> = {
    asia: { name: "Asia", processMt: 0, crudeMt: 0 },
    americas: { name: "Americas", processMt: 0, crudeMt: 0 },
    emea: { name: "EMEA", processMt: 0, crudeMt: 0 },
  };
  for (const r of COUNTRY_ROUTES) {
    const b = buckets[r.region];
    if (!b) continue;
    b.processMt += r.processMt;
    b.crudeMt += r.crudeMt;
  }
  return Object.values(buckets);
}

/** Weighted BF Mt held by China + India vs rest of panel */
export function chinaIndiaBfDominance() {
  const china = COUNTRY_ROUTES.find((r) => r.id === "china")!;
  const india = COUNTRY_ROUTES.find((r) => r.id === "india")!;
  const chinaIndiaBf =
    (china.crudeMt * china.bfSharePct) / 100 +
    (india.crudeMt * india.bfSharePct) / 100;
  const panelBf = COUNTRY_ROUTES.reduce(
    (s, r) => s + (r.crudeMt * r.bfSharePct) / 100,
    0,
  );
  return {
    chinaIndiaBfMt: Math.round(chinaIndiaBf),
    panelBfMt: Math.round(panelBf),
    sharePct: Math.round((chinaIndiaBf / panelBf) * 1000) / 10,
  };
}

export function fmtMt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(2)} Gt`;
  return `${n.toLocaleString("en-US")} Mt`;
}

export function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}

export function fmtIntensity(n: number) {
  return `${n.toFixed(2)} t/t`;
}

/** Smoke / QA visible markers */
export const VIZ_MARKERS = [
  "Heavy materials · steel route mix",
  "China BF share",
] as const;
