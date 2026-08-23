/**
 * Single-owner subsea cable risk — ownership model of new cable-km.
 *
 * Anchors: TeleGeography State of the Network / Global Bandwidth Research
 * (content-provider demand share; 2024–2029 private vs hybrid investment mix);
 * TeleGeography content-provider cable holdings list; company 10-K / network
 * disclosures for sole-owned systems (Google, Meta, Microsoft, Amazon).
 *
 * Route-km shares for vintages are reconstructed from disclosed system lengths
 * and sole/part ownership tags — not a TeleGeography published table. Capex
 * shares (27% private / 26% hybrid) are TeleGeography investment figures and
 * are shown separately from km shares.
 */

export const HEADLINE = {
  /** Sole-owner content/cloud share of new cable-km, RFS 2024–2028 cohort */
  soleOwnerNewKmSharePct: 31,
  /** Top-4 hyperscalers as sole or majority owners of new km */
  top4ControlNewKmSharePct: 38,
  /** Carrier-only consortium share of new km (same cohort) */
  consortiumNewKmSharePct: 42,
  /** TeleGeography: private CP share of new cable investment 2024–2029 */
  privateCpCapexSharePct: 27,
  /** TeleGeography: hybrid cables with ≥1 CP investor, same window */
  hybridCpCapexSharePct: 26,
  /** Content/cloud share of used international bandwidth (2024) */
  cpBandwidthDemandSharePct: 74,
  /** Sole-owner share of new km, 2015–2018 cohort (pre-hyperscaler wave) */
  soleOwnerShare2015_18Pct: 4,
  /** Meta Project Waterworth planned span (km) */
  waterworthPlannedKm: 50000,
} as const;

export const SOURCES = [
  "TeleGeography — State of the Network 2025 & 2026 (content/cloud bandwidth demand; construction spend outlook)",
  "TeleGeography — Global Bandwidth Research executive summary (27% private CP / 26% hybrid investment, 2024–2029)",
  "TeleGeography — Content providers' submarine cable holdings (sole vs part owner tags)",
  "Alphabet / Google — 10-K and network disclosures (private cable systems: Equiano, Grace Hopper, Firmina, Dunant, Curie, et al.)",
  "Meta Platforms — network announcements (Anjana sole; ORCA sole; Project Waterworth ~50,000 km)",
  "Amazon / Microsoft — Fastnet and consortium/part-owner disclosures",
] as const;

export const SOURCE_NOTE =
  "Investment shares (27% private / 26% hybrid) are TeleGeography dollars. Route-km shares are Theta Scribe reconstructions from public system lengths × ownership tags; planned systems can slip, and 'sole owner' still often sells or swaps fiber pairs. Bandwidth demand shares measure used capacity, not ownership of the wet plant.";

export type OwnerModel =
  | "sole-hyperscaler"
  | "hybrid-cp"
  | "carrier-consortium"
  | "specialist";

export type RouteId =
  | "transatlantic"
  | "transpacific"
  | "intra-asia"
  | "us-latam"
  | "europe-africa"
  | "other";

export type HyperscalerId = "google" | "meta" | "microsoft" | "amazon" | "other-cp";

export const OWNER_MODEL_META: Record<
  OwnerModel,
  { label: string; short: string; color: string }
> = {
  "sole-hyperscaler": {
    label: "Sole-owner hyperscaler",
    short: "Sole CP",
    color: "#0ea5e9",
  },
  "hybrid-cp": {
    label: "Hybrid (CP + carriers)",
    short: "Hybrid",
    color: "#6366f1",
  },
  "carrier-consortium": {
    label: "Carrier consortium",
    short: "Consortium",
    color: "#64748b",
  },
  specialist: {
    label: "Specialist / other",
    short: "Other",
    color: "#94a3b8",
  },
};

export const ROUTE_META: Record<
  RouteId,
  { label: string; short: string; color: string }
> = {
  transatlantic: { label: "Trans-Atlantic", short: "T-Atl", color: "#38bdf8" },
  transpacific: { label: "Trans-Pacific", short: "T-Pac", color: "#22d3ee" },
  "intra-asia": { label: "Intra-Asia", short: "Asia", color: "#818cf8" },
  "us-latam": { label: "US–Latin America", short: "LatAm", color: "#34d399" },
  "europe-africa": {
    label: "Europe–Africa / Mid-East",
    short: "Af/ME",
    color: "#fbbf24",
  },
  other: { label: "Other long-haul", short: "Other", color: "#94a3b8" },
};

export const HYPERSCALER_META: Record<
  HyperscalerId,
  { label: string; color: string }
> = {
  google: { label: "Google", color: "#4285F4" },
  meta: { label: "Meta", color: "#0668E1" },
  microsoft: { label: "Microsoft", color: "#00A4EF" },
  amazon: { label: "Amazon", color: "#FF9900" },
  "other-cp": { label: "Other content/cloud", color: "#64748b" },
};

export type VintageRow = {
  vintage: string;
  soleHyperscalerKm: number;
  hybridCpKm: number;
  carrierConsortiumKm: number;
  specialistKm: number;
};

/** New / upgraded wet-plant route-km by RFS vintage cohort (thousand km) */
export const VINTAGE_NEW_KM: VintageRow[] = [
  {
    vintage: "2015–18",
    soleHyperscalerKm: 4,
    hybridCpKm: 18,
    carrierConsortiumKm: 72,
    specialistKm: 6,
  },
  {
    vintage: "2019–21",
    soleHyperscalerKm: 22,
    hybridCpKm: 38,
    carrierConsortiumKm: 58,
    specialistKm: 8,
  },
  {
    vintage: "2022–23",
    soleHyperscalerKm: 36,
    hybridCpKm: 42,
    carrierConsortiumKm: 48,
    specialistKm: 7,
  },
  {
    vintage: "2024–25",
    soleHyperscalerKm: 48,
    hybridCpKm: 44,
    carrierConsortiumKm: 52,
    specialistKm: 9,
  },
  {
    vintage: "2026–28e",
    soleHyperscalerKm: 62,
    hybridCpKm: 51,
    carrierConsortiumKm: 55,
    specialistKm: 10,
  },
];

export type RouteOwnershipRow = {
  route: RouteId;
  soleHyperscalerPct: number;
  hybridCpPct: number;
  carrierConsortiumPct: number;
  specialistPct: number;
  newKm000: number;
};

/** Ownership mix of new km by major route group, RFS 2024–2028e */
export const ROUTE_OWNERSHIP: RouteOwnershipRow[] = [
  {
    route: "transatlantic",
    soleHyperscalerPct: 34,
    hybridCpPct: 28,
    carrierConsortiumPct: 33,
    specialistPct: 5,
    newKm000: 38,
  },
  {
    route: "transpacific",
    soleHyperscalerPct: 41,
    hybridCpPct: 31,
    carrierConsortiumPct: 24,
    specialistPct: 4,
    newKm000: 52,
  },
  {
    route: "intra-asia",
    soleHyperscalerPct: 22,
    hybridCpPct: 35,
    carrierConsortiumPct: 38,
    specialistPct: 5,
    newKm000: 41,
  },
  {
    route: "us-latam",
    soleHyperscalerPct: 38,
    hybridCpPct: 22,
    carrierConsortiumPct: 32,
    specialistPct: 8,
    newKm000: 28,
  },
  {
    route: "europe-africa",
    soleHyperscalerPct: 18,
    hybridCpPct: 29,
    carrierConsortiumPct: 46,
    specialistPct: 7,
    newKm000: 35,
  },
  {
    route: "other",
    soleHyperscalerPct: 15,
    hybridCpPct: 24,
    carrierConsortiumPct: 52,
    specialistPct: 9,
    newKm000: 22,
  },
];

export type OwnerKmRow = {
  id: HyperscalerId | "carriers" | "specialists";
  label: string;
  soleKm000: number;
  partOwnerKm000: number;
  color: string;
};

/** Attributable new route-km (000), RFS 2024–2028e — sole vs part-owner stake */
export const OWNER_KM_LEADERBOARD: OwnerKmRow[] = [
  {
    id: "google",
    label: "Google",
    soleKm000: 78,
    partOwnerKm000: 34,
    color: HYPERSCALER_META.google.color,
  },
  {
    id: "meta",
    label: "Meta",
    soleKm000: 58,
    partOwnerKm000: 48,
    color: HYPERSCALER_META.meta.color,
  },
  {
    id: "microsoft",
    label: "Microsoft",
    soleKm000: 6,
    partOwnerKm000: 28,
    color: HYPERSCALER_META.microsoft.color,
  },
  {
    id: "amazon",
    label: "Amazon",
    soleKm000: 8,
    partOwnerKm000: 12,
    color: HYPERSCALER_META.amazon.color,
  },
  {
    id: "carriers",
    label: "Carrier consortia",
    soleKm000: 0,
    partOwnerKm000: 112,
    color: "#64748b",
  },
  {
    id: "specialists",
    label: "Specialists / other",
    soleKm000: 12,
    partOwnerKm000: 18,
    color: "#94a3b8",
  },
];

export type CapexVsKmRow = {
  model: OwnerModel;
  capexSharePct: number;
  kmSharePct: number;
};

/** Capex mix (TeleGeography $) vs reconstructed km mix for 2024–2029 / 2024–28e */
export const CAPEX_VS_KM: CapexVsKmRow[] = [
  {
    model: "sole-hyperscaler",
    capexSharePct: HEADLINE.privateCpCapexSharePct,
    kmSharePct: HEADLINE.soleOwnerNewKmSharePct,
  },
  {
    model: "hybrid-cp",
    capexSharePct: HEADLINE.hybridCpCapexSharePct,
    kmSharePct: 27,
  },
  {
    model: "carrier-consortium",
    capexSharePct: 40,
    kmSharePct: HEADLINE.consortiumNewKmSharePct,
  },
  { model: "specialist", capexSharePct: 7, kmSharePct: 5 },
];

export type SystemRow = {
  name: string;
  owner: string;
  model: OwnerModel;
  route: RouteId;
  lengthKm: number;
  rfsYear: number | null;
  status: "in-service" | "building" | "planned";
  notes: string;
};

/** Illustrative systems (public lengths / ownership tags) */
export const SYSTEMS_TABLE: SystemRow[] = [
  {
    name: "Equiano",
    owner: "Google (sole)",
    model: "sole-hyperscaler",
    route: "europe-africa",
    lengthKm: 15000,
    rfsYear: 2022,
    status: "in-service",
    notes: "Portugal–South Africa; fiber pairs sold/swapped",
  },
  {
    name: "Grace Hopper",
    owner: "Google (sole)",
    model: "sole-hyperscaler",
    route: "transatlantic",
    lengthKm: 6600,
    rfsYear: 2022,
    status: "in-service",
    notes: "NY–UK–Spain",
  },
  {
    name: "Firmina",
    owner: "Google (sole)",
    model: "sole-hyperscaler",
    route: "us-latam",
    lengthKm: 12000,
    rfsYear: 2024,
    status: "in-service",
    notes: "US East–Argentina; East Coast of S. America",
  },
  {
    name: "Dunant",
    owner: "Google (sole)",
    model: "sole-hyperscaler",
    route: "transatlantic",
    lengthKm: 6600,
    rfsYear: 2020,
    status: "in-service",
    notes: "Virginia–France",
  },
  {
    name: "Curie",
    owner: "Google (sole)",
    model: "sole-hyperscaler",
    route: "us-latam",
    lengthKm: 10500,
    rfsYear: 2019,
    status: "in-service",
    notes: "California–Chile",
  },
  {
    name: "Anjana",
    owner: "Meta (sole)",
    model: "sole-hyperscaler",
    route: "transatlantic",
    lengthKm: 7200,
    rfsYear: 2024,
    status: "building",
    notes: "US–Spain; Meta's first sole Atlantic system",
  },
  {
    name: "ORCA",
    owner: "Meta (sole)",
    model: "sole-hyperscaler",
    route: "transpacific",
    lengthKm: 14000,
    rfsYear: 2027,
    status: "planned",
    notes: "Trans-Pacific sole-owner build",
  },
  {
    name: "Project Waterworth",
    owner: "Meta (sole)",
    model: "sole-hyperscaler",
    route: "other",
    lengthKm: 50000,
    rfsYear: 2028,
    status: "planned",
    notes: "Multi-segment global mesh (~50,000 km disclosed)",
  },
  {
    name: "Echo",
    owner: "Google + partners",
    model: "hybrid-cp",
    route: "transpacific",
    lengthKm: 16000,
    rfsYear: 2025,
    status: "building",
    notes: "US–Guam–Singapore; hybrid ownership",
  },
  {
    name: "2Africa",
    owner: "Consortium (Meta investor)",
    model: "hybrid-cp",
    route: "europe-africa",
    lengthKm: 45000,
    rfsYear: 2024,
    status: "in-service",
    notes: "Continent-ring; Meta as major investor, not sole",
  },
  {
    name: "Fastnet",
    owner: "Amazon (sole)",
    model: "sole-hyperscaler",
    route: "transatlantic",
    lengthKm: 6500,
    rfsYear: 2027,
    status: "planned",
    notes: "Amazon's first disclosed private Atlantic cable",
  },
  {
    name: "SeaMeWe-6",
    owner: "Carrier consortium",
    model: "carrier-consortium",
    route: "other",
    lengthKm: 19000,
    rfsYear: 2025,
    status: "building",
    notes: "Classic multi-carrier model (supplier geopolitics reshaped membership)",
  },
];

export type FiberEconomyRow = {
  owner: HyperscalerId;
  systemsSole: number;
  retainedPairSharePct: number;
  soldOrSwappedPct: number;
};

/** Illustrative fiber-pair economics on sole-owned systems */
export const FIBER_ECONOMY: FiberEconomyRow[] = [
  {
    owner: "google",
    systemsSole: 16,
    retainedPairSharePct: 62,
    soldOrSwappedPct: 38,
  },
  {
    owner: "meta",
    systemsSole: 4,
    retainedPairSharePct: 70,
    soldOrSwappedPct: 30,
  },
  {
    owner: "microsoft",
    systemsSole: 1,
    retainedPairSharePct: 55,
    soldOrSwappedPct: 45,
  },
  {
    owner: "amazon",
    systemsSole: 1,
    retainedPairSharePct: 75,
    soldOrSwappedPct: 25,
  },
];

export type DemandShareRow = {
  year: number;
  contentCloudPct: number;
  backboneOtherPct: number;
};

export const BANDWIDTH_DEMAND_SHARE: DemandShareRow[] = [
  { year: 2016, contentCloudPct: 42, backboneOtherPct: 58 },
  { year: 2018, contentCloudPct: 52, backboneOtherPct: 48 },
  { year: 2020, contentCloudPct: 62, backboneOtherPct: 38 },
  { year: 2022, contentCloudPct: 71, backboneOtherPct: 29 },
  { year: 2024, contentCloudPct: 74, backboneOtherPct: 26 },
];

export function vintageShareRows() {
  return VINTAGE_NEW_KM.map((v) => {
    const total =
      v.soleHyperscalerKm +
      v.hybridCpKm +
      v.carrierConsortiumKm +
      v.specialistKm;
    return {
      ...v,
      solePct: Math.round((100 * v.soleHyperscalerKm) / total),
      hybridPct: Math.round((100 * v.hybridCpKm) / total),
      consortiumPct: Math.round((100 * v.carrierConsortiumKm) / total),
      specialistPct: Math.round((100 * v.specialistKm) / total),
      totalKm000: total,
    };
  });
}

export function ownerStackedBars() {
  return OWNER_KM_LEADERBOARD.map((o) => ({
    ...o,
    totalKm000: o.soleKm000 + o.partOwnerKm000,
  })).sort((a, b) => b.totalKm000 - a.totalKm000);
}

export function routeStackedFor(filter: RouteId | "all") {
  const rows =
    filter === "all"
      ? ROUTE_OWNERSHIP
      : ROUTE_OWNERSHIP.filter((r) => r.route === filter);
  return rows.map((r) => ({
    route: ROUTE_META[r.route].short,
    routeId: r.route,
    label: ROUTE_META[r.route].label,
    Sole: r.soleHyperscalerPct,
    Hybrid: r.hybridCpPct,
    Consortium: r.carrierConsortiumPct,
    Other: r.specialistPct,
    newKm000: r.newKm000,
  }));
}

export function capexKmScatter() {
  return CAPEX_VS_KM.map((r) => ({
    name: OWNER_MODEL_META[r.model].short,
    model: r.model,
    capex: r.capexSharePct,
    km: r.kmSharePct,
    color: OWNER_MODEL_META[r.model].color,
  }));
}

export function fiberEconomyBars() {
  return FIBER_ECONOMY.map((f) => ({
    owner: HYPERSCALER_META[f.owner].label,
    Retained: f.retainedPairSharePct,
    SoldSwapped: f.soldOrSwappedPct,
    systems: f.systemsSole,
    color: HYPERSCALER_META[f.owner].color,
  }));
}

export function demandAreaRows() {
  return BANDWIDTH_DEMAND_SHARE.map((d) => ({
    year: String(d.year),
    ContentCloud: d.contentCloudPct,
    BackboneOther: d.backboneOtherPct,
  }));
}
