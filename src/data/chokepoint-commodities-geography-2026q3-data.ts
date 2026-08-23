/**
 * Chokepoint commodities — Q3 2026 geography lens (country / regional shares).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 *
 * Vintage vs geography-2026:
 * - Midstream / smelter / recycle shares restated with IEA Global Critical Minerals Outlook 2026
 * - Mine anchors from USGS MCS 2026 v1.3 where IEA does not restate pits
 * - Adds copper smelting + battery-recovery geography; tracks prior→Q3 Top-1 Δ
 *
 * Complements: geography-2026 (MCS 2025 / IEA 2025 map), concentration-2026q3 (Top-k/HHI).
 */

export type Confidence = "disclosed" | "estimated" | "secondary";
export type Stage = "mine" | "midstream" | "smelter" | "recycle";
export type Region =
  | "East Asia"
  | "Southeast Asia"
  | "Africa"
  | "Latin America"
  | "North America"
  | "Europe"
  | "Middle East"
  | "Oceania"
  | "Other";
export type Direction = "tighter" | "easier" | "flat";

export const SOURCE_NOTE =
  "Q3 geography vintage vs geography-2026: mine country shares from USGS Mineral Commodity Summaries 2026 v1.3 where disclosed; midstream, smelter, and battery-recovery shares restated with IEA Global Critical Minerals Outlook 2026 (copper refine/smelt ~50% China, lithium chemicals ~70%, REE separation ~85%, cobalt refine ~75%, graphite anode ≥90%, battery recovery ~90%, gallium ~99%). Regional aggregates re-bucket country rows. Prior→Q3 Δ is directional across agencies — shares may not sum to 100% because of rounding. Geography answers *where* capacity sits; pair with concentration-2026q3 for Top-k / HHI.";

export const USGS_MCS_2026_URL =
  "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026.pdf";
export const IEA_GCMO_2026_URL =
  "https://www.iea.org/reports/global-critical-minerals-outlook-2026/executive-summary";
export const PRIOR_GEO_PATH = "/blog/chokepoint-commodities-geography-2026";
export const PRIOR_CONC_Q3_PATH = "/blog/chokepoint-commodities-concentration-2026q3";
export const PRIOR_RESEARCH_PATH = "/blog/chokepoint-commodities-research-2026";
export const COPPER_GEO_PATH = "/blog/copper-mine-vs-refinery-geography-2026";

/** Headline meters for cards and post lede */
export const HEADLINE = {
  commoditiesMapped: 16,
  chinaTotalTop1Count: 11,
  chinaMidstreamTop1Count: 8,
  chinaMineTop1Count: 3,
  eastAsiaMidstreamTop1Count: 8,
  africaMineTop1Count: 2,
  largestCrossBorderFlipPp: 74,
  largestCrossBorderFlipLabel: "Cobalt (DRC mine → China refine)",
  copperRefineTop1Pct: 50,
  copperRefineDeltaPp: 6,
  lithiumChemTop1Pct: 70,
  lithiumChemDeltaPp: 5,
  reeSeparateTop1Pct: 85,
  reeSeparateDeltaPp: -5,
  pluralMineButChinaMidCount: 4,
} as const;

export type CountryShare = {
  country: string;
  iso: string;
  region: Region;
  sharePct: number;
  fill: string;
};

export type CommodityGeo = {
  id: string;
  label: string;
  shortLabel: string;
  stage: Stage;
  sector: string;
  confidence: Confidence;
  top1SharePct: number;
  /** Prior geography-2026 Top-1 share (same ledger) where comparable */
  priorTop1SharePct: number;
  deltaPp: number;
  direction: Direction;
  top1Label: string;
  top1Region: Region;
  countries: CountryShare[];
  note?: string;
  relatedSlug?: string;
};

const FILL = {
  CN: "#f43f5e",
  ID: "#0ea5e9",
  CD: "#f59e0b",
  ZA: "#a78bfa",
  AU: "#14b8a6",
  CL: "#fb923c",
  US: "#38bdf8",
  RU: "#64748b",
  MA: "#84cc16",
  OTHER: "#94a3b8",
  MY: "#22d3ee",
  PE: "#fbbf24",
  FI: "#2dd4bf",
  SMELT: "#8b5cf6",
  RECYCLE: "#10b981",
} as const;

/** Mine-stage country ledgers (USGS MCS 2026 anchors) */
export const MINE_GEOGRAPHIES: CommodityGeo[] = [
  {
    id: "cobalt-mine",
    label: "Cobalt (mine)",
    shortLabel: "Cobalt",
    stage: "mine",
    sector: "batteries",
    confidence: "secondary",
    top1SharePct: 74.2,
    priorTop1SharePct: 74,
    deltaPp: 0.2,
    direction: "flat",
    top1Label: "Congo (Kinshasa)",
    top1Region: "Africa",
    note: "Pit stays African; refine still flips to East Asia",
    countries: [
      { country: "Congo (Kinshasa)", iso: "CD", region: "Africa", sharePct: 74.2, fill: FILL.CD },
      { country: "Indonesia", iso: "ID", region: "Southeast Asia", sharePct: 7, fill: FILL.ID },
      { country: "Russia", iso: "RU", region: "Europe", sharePct: 4, fill: FILL.RU },
      { country: "Australia", iso: "AU", region: "Oceania", sharePct: 3, fill: FILL.AU },
      { country: "Other", iso: "XX", region: "Other", sharePct: 11.8, fill: FILL.OTHER },
    ],
  },
  {
    id: "graphite-mine",
    label: "Natural graphite (mine)",
    shortLabel: "Graphite",
    stage: "mine",
    sector: "batteries",
    confidence: "secondary",
    top1SharePct: 77.8,
    priorTop1SharePct: 79.4,
    deltaPp: -1.6,
    direction: "easier",
    top1Label: "China",
    top1Region: "East Asia",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 77.8, fill: FILL.CN },
      { country: "Madagascar", iso: "MG", region: "Africa", sharePct: 5.5, fill: FILL.CD },
      { country: "Mozambique", iso: "MZ", region: "Africa", sharePct: 4.7, fill: FILL.ZA },
      { country: "Brazil", iso: "BR", region: "Latin America", sharePct: 3.2, fill: FILL.CL },
      { country: "Other", iso: "XX", region: "Other", sharePct: 8.8, fill: FILL.OTHER },
    ],
  },
  {
    id: "rare-earth-mine",
    label: "Rare earths (mine)",
    shortLabel: "REE mine",
    stage: "mine",
    sector: "magnets",
    confidence: "secondary",
    top1SharePct: 69,
    priorTop1SharePct: 69,
    deltaPp: 0,
    direction: "flat",
    top1Label: "China",
    top1Region: "East Asia",
    relatedSlug: "rare-earth-mine-concentration-2024",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 69, fill: FILL.CN },
      { country: "United States", iso: "US", region: "North America", sharePct: 12, fill: FILL.US },
      { country: "Myanmar", iso: "MM", region: "Southeast Asia", sharePct: 7, fill: FILL.ID },
      { country: "Australia", iso: "AU", region: "Oceania", sharePct: 5, fill: FILL.AU },
      { country: "Other", iso: "XX", region: "Other", sharePct: 7, fill: FILL.OTHER },
    ],
  },
  {
    id: "nickel-mine",
    label: "Nickel (mine)",
    shortLabel: "Nickel",
    stage: "mine",
    sector: "batteries",
    confidence: "estimated",
    top1SharePct: 50,
    priorTop1SharePct: 50,
    deltaPp: 0,
    direction: "flat",
    top1Label: "Indonesia",
    top1Region: "Southeast Asia",
    note: "Growth capture at refine increasingly Indonesia-led (IEA)",
    countries: [
      { country: "Indonesia", iso: "ID", region: "Southeast Asia", sharePct: 50, fill: FILL.ID },
      { country: "Philippines", iso: "PH", region: "Southeast Asia", sharePct: 11, fill: FILL.MY },
      { country: "Russia", iso: "RU", region: "Europe", sharePct: 9, fill: FILL.RU },
      { country: "New Caledonia", iso: "NC", region: "Oceania", sharePct: 6, fill: FILL.AU },
      { country: "Other", iso: "XX", region: "Other", sharePct: 24, fill: FILL.OTHER },
    ],
  },
  {
    id: "lithium-mine",
    label: "Lithium (mine)",
    shortLabel: "Lithium",
    stage: "mine",
    sector: "batteries",
    confidence: "secondary",
    top1SharePct: 37,
    priorTop1SharePct: 37,
    deltaPp: 0,
    direction: "flat",
    top1Label: "Australia",
    top1Region: "Oceania",
    note: "Pit plural; chemicals tip thickened to ~70% China in Q3",
    countries: [
      { country: "Australia", iso: "AU", region: "Oceania", sharePct: 37, fill: FILL.AU },
      { country: "Chile", iso: "CL", region: "Latin America", sharePct: 24, fill: FILL.CL },
      { country: "China", iso: "CN", region: "East Asia", sharePct: 17, fill: FILL.CN },
      { country: "Argentina", iso: "AR", region: "Latin America", sharePct: 6, fill: FILL.PE },
      { country: "Other", iso: "XX", region: "Other", sharePct: 16, fill: FILL.OTHER },
    ],
  },
  {
    id: "copper-mine",
    label: "Copper (mine)",
    shortLabel: "Cu mine",
    stage: "mine",
    sector: "structural",
    confidence: "secondary",
    top1SharePct: 23,
    priorTop1SharePct: 24,
    deltaPp: -1,
    direction: "flat",
    top1Label: "Chile",
    top1Region: "Latin America",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Chile still leads the pit; China refine/smelt ~50%",
    countries: [
      { country: "Chile", iso: "CL", region: "Latin America", sharePct: 23, fill: FILL.CL },
      { country: "Peru", iso: "PE", region: "Latin America", sharePct: 10, fill: FILL.PE },
      { country: "Congo (Kinshasa)", iso: "CD", region: "Africa", sharePct: 10, fill: FILL.CD },
      { country: "China", iso: "CN", region: "East Asia", sharePct: 8, fill: FILL.CN },
      { country: "United States", iso: "US", region: "North America", sharePct: 5, fill: FILL.US },
      { country: "Other", iso: "XX", region: "Other", sharePct: 44, fill: FILL.OTHER },
    ],
  },
  {
    id: "platinum-mine",
    label: "Platinum (mine)",
    shortLabel: "Platinum",
    stage: "mine",
    sector: "structural",
    confidence: "estimated",
    top1SharePct: 71,
    priorTop1SharePct: 71,
    deltaPp: 0,
    direction: "flat",
    top1Label: "South Africa",
    top1Region: "Africa",
    countries: [
      { country: "South Africa", iso: "ZA", region: "Africa", sharePct: 71, fill: FILL.ZA },
      { country: "Russia", iso: "RU", region: "Europe", sharePct: 12, fill: FILL.RU },
      { country: "Zimbabwe", iso: "ZW", region: "Africa", sharePct: 9, fill: FILL.CD },
      { country: "Other", iso: "XX", region: "Other", sharePct: 8, fill: FILL.OTHER },
    ],
  },
  {
    id: "phosphate-rock",
    label: "Phosphate rock (mine)",
    shortLabel: "P rock",
    stage: "mine",
    sector: "fertilizers",
    confidence: "estimated",
    top1SharePct: 41,
    priorTop1SharePct: 41,
    deltaPp: 0,
    direction: "flat",
    top1Label: "China",
    top1Region: "East Asia",
    relatedSlug: "phosphate-rock-supply-concentration-2024",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 41, fill: FILL.CN },
      { country: "Morocco", iso: "MA", region: "Africa", sharePct: 16, fill: FILL.MA },
      { country: "United States", iso: "US", region: "North America", sharePct: 11, fill: FILL.US },
      { country: "Russia", iso: "RU", region: "Europe", sharePct: 6, fill: FILL.RU },
      { country: "Other", iso: "XX", region: "Other", sharePct: 26, fill: FILL.OTHER },
    ],
  },
];

/** Midstream / smelter / recycle country ledgers (IEA GCMO 2026) */
export const MIDSTREAM_GEOGRAPHIES: CommodityGeo[] = [
  {
    id: "gallium-refine",
    label: "Gallium (refined)",
    shortLabel: "Gallium",
    stage: "midstream",
    sector: "semiconductors",
    confidence: "estimated",
    top1SharePct: 99,
    priorTop1SharePct: 98,
    deltaPp: 1,
    direction: "tighter",
    top1Label: "China",
    top1Region: "East Asia",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 99, fill: FILL.CN },
      { country: "Other", iso: "XX", region: "Other", sharePct: 1, fill: FILL.OTHER },
    ],
  },
  {
    id: "graphite-anode",
    label: "Graphite anode processing",
    shortLabel: "Graphite anode",
    stage: "midstream",
    sector: "batteries",
    confidence: "estimated",
    top1SharePct: 90,
    priorTop1SharePct: 90,
    deltaPp: 0,
    direction: "flat",
    top1Label: "China",
    top1Region: "East Asia",
    note: "IEA GCMO 2026 ≥90% hold",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 90, fill: FILL.CN },
      { country: "Other", iso: "XX", region: "Other", sharePct: 10, fill: FILL.OTHER },
    ],
  },
  {
    id: "rare-earth-separate",
    label: "Rare-earth separation",
    shortLabel: "REE separate",
    stage: "midstream",
    sector: "magnets",
    confidence: "disclosed",
    top1SharePct: 85,
    priorTop1SharePct: 90,
    deltaPp: -5,
    direction: "easier",
    top1Label: "China",
    top1Region: "East Asia",
    note: "US + Malaysia projects cut top-supplier share vs prior 90%",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 85, fill: FILL.CN },
      { country: "Malaysia", iso: "MY", region: "Southeast Asia", sharePct: 7, fill: FILL.MY },
      { country: "United States", iso: "US", region: "North America", sharePct: 4, fill: FILL.US },
      { country: "Other", iso: "XX", region: "Other", sharePct: 4, fill: FILL.OTHER },
    ],
  },
  {
    id: "cobalt-refine",
    label: "Cobalt (refined)",
    shortLabel: "Co refine",
    stage: "midstream",
    sector: "batteries",
    confidence: "estimated",
    top1SharePct: 75,
    priorTop1SharePct: 76,
    deltaPp: -1,
    direction: "flat",
    top1Label: "China",
    top1Region: "East Asia",
    note: "Mine in DRC (~74%); refine in China (~75%) — classic continent flip",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 75, fill: FILL.CN },
      { country: "Finland", iso: "FI", region: "Europe", sharePct: 9, fill: FILL.FI },
      { country: "Canada", iso: "CA", region: "North America", sharePct: 5, fill: FILL.US },
      { country: "Other", iso: "XX", region: "Other", sharePct: 11, fill: FILL.OTHER },
    ],
  },
  {
    id: "lithium-chem",
    label: "Lithium chemicals",
    shortLabel: "Li chem",
    stage: "midstream",
    sector: "batteries",
    confidence: "estimated",
    top1SharePct: 70,
    priorTop1SharePct: 65,
    deltaPp: 5,
    direction: "tighter",
    top1Label: "China",
    top1Region: "East Asia",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 70, fill: FILL.CN },
      { country: "Chile", iso: "CL", region: "Latin America", sharePct: 11, fill: FILL.CL },
      { country: "Argentina", iso: "AR", region: "Latin America", sharePct: 7, fill: FILL.PE },
      { country: "Other", iso: "XX", region: "Other", sharePct: 12, fill: FILL.OTHER },
    ],
  },
  {
    id: "copper-refine",
    label: "Copper (refined)",
    shortLabel: "Cu refine",
    stage: "midstream",
    sector: "structural",
    confidence: "estimated",
    top1SharePct: 50,
    priorTop1SharePct: 44,
    deltaPp: 6,
    direction: "tighter",
    top1Label: "China",
    top1Region: "East Asia",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Q3 thickening: China mines ~8% but refines ~50%",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 50, fill: FILL.CN },
      { country: "Chile", iso: "CL", region: "Latin America", sharePct: 8, fill: FILL.CL },
      { country: "Congo (Kinshasa)", iso: "CD", region: "Africa", sharePct: 7, fill: FILL.CD },
      { country: "Japan", iso: "JP", region: "East Asia", sharePct: 5, fill: FILL.MY },
      { country: "Other", iso: "XX", region: "Other", sharePct: 30, fill: FILL.OTHER },
    ],
  },
  {
    id: "copper-smelt",
    label: "Copper smelting capacity",
    shortLabel: "Cu smelt",
    stage: "smelter",
    sector: "structural",
    confidence: "disclosed",
    top1SharePct: 50,
    priorTop1SharePct: 15,
    deltaPp: 35,
    direction: "tighter",
    top1Label: "China",
    top1Region: "East Asia",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "IEA: China >90% of capacity growth 2005–2025; TC/RC stress in 2026",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 50, fill: FILL.SMELT },
      { country: "Chile", iso: "CL", region: "Latin America", sharePct: 10, fill: FILL.CL },
      { country: "Japan", iso: "JP", region: "East Asia", sharePct: 8, fill: FILL.MY },
      { country: "Other", iso: "XX", region: "Other", sharePct: 32, fill: FILL.OTHER },
    ],
  },
  {
    id: "battery-recovery",
    label: "Battery material recovery",
    shortLabel: "Batt recovery",
    stage: "recycle",
    sector: "recycling",
    confidence: "disclosed",
    top1SharePct: 90,
    priorTop1SharePct: 70,
    deltaPp: 20,
    direction: "tighter",
    top1Label: "China",
    top1Region: "East Asia",
    note: "IEA: secondary supply is also geographically concentrated",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 90, fill: FILL.RECYCLE },
      { country: "EU pilots", iso: "EU", region: "Europe", sharePct: 4, fill: FILL.FI },
      { country: "Korea", iso: "KR", region: "East Asia", sharePct: 3, fill: FILL.MY },
      { country: "Other", iso: "XX", region: "Other", sharePct: 3, fill: FILL.OTHER },
    ],
  },
];

export const ALL_GEOGRAPHIES: CommodityGeo[] = [
  ...MINE_GEOGRAPHIES,
  ...MIDSTREAM_GEOGRAPHIES,
];

/** Mine → mid geographic flips (paired metals) */
export type StageFlip = {
  id: string;
  metal: string;
  mineTop1: string;
  mineTop1Region: Region;
  mineSharePct: number;
  midTop1: string;
  midTop1Region: Region;
  midSharePct: number;
  /** Cross-border: mine tip size; same-country: mid−mine thickening */
  flipPp: number;
  crossBorder: boolean;
  fill: string;
  deltaMidPp: number;
};

export const STAGE_FLIPS: StageFlip[] = [
  {
    id: "cobalt",
    metal: "Cobalt",
    mineTop1: "Congo (Kinshasa)",
    mineTop1Region: "Africa",
    mineSharePct: 74.2,
    midTop1: "China",
    midTop1Region: "East Asia",
    midSharePct: 75,
    flipPp: 74,
    crossBorder: true,
    fill: FILL.CD,
    deltaMidPp: -1,
  },
  {
    id: "copper",
    metal: "Copper",
    mineTop1: "Chile",
    mineTop1Region: "Latin America",
    mineSharePct: 23,
    midTop1: "China",
    midTop1Region: "East Asia",
    midSharePct: 50,
    flipPp: 23,
    crossBorder: true,
    fill: FILL.CL,
    deltaMidPp: 6,
  },
  {
    id: "lithium",
    metal: "Lithium",
    mineTop1: "Australia",
    mineTop1Region: "Oceania",
    mineSharePct: 37,
    midTop1: "China",
    midTop1Region: "East Asia",
    midSharePct: 70,
    flipPp: 37,
    crossBorder: true,
    fill: FILL.AU,
    deltaMidPp: 5,
  },
  {
    id: "rare-earths",
    metal: "Rare earths",
    mineTop1: "China",
    mineTop1Region: "East Asia",
    mineSharePct: 69,
    midTop1: "China",
    midTop1Region: "East Asia",
    midSharePct: 85,
    flipPp: 16,
    crossBorder: false,
    fill: FILL.CN,
    deltaMidPp: -5,
  },
  {
    id: "graphite",
    metal: "Graphite",
    mineTop1: "China",
    mineTop1Region: "East Asia",
    mineSharePct: 77.8,
    midTop1: "China",
    midTop1Region: "East Asia",
    midSharePct: 90,
    flipPp: 12.2,
    crossBorder: false,
    fill: FILL.CN,
    deltaMidPp: 0,
  },
];

/** Regional share of Top-1 seats across mapped commodities (by stage family) */
export type RegionSeat = {
  region: Region;
  mineTop1Seats: number;
  midTop1Seats: number;
  fill: string;
};

export const REGION_TOP1_SEATS: RegionSeat[] = [
  { region: "East Asia", mineTop1Seats: 3, midTop1Seats: 8, fill: FILL.CN },
  { region: "Africa", mineTop1Seats: 2, midTop1Seats: 0, fill: FILL.CD },
  { region: "Southeast Asia", mineTop1Seats: 1, midTop1Seats: 0, fill: FILL.ID },
  { region: "Latin America", mineTop1Seats: 1, midTop1Seats: 0, fill: FILL.CL },
  { region: "Oceania", mineTop1Seats: 1, midTop1Seats: 0, fill: FILL.AU },
  { region: "Europe", mineTop1Seats: 0, midTop1Seats: 0, fill: FILL.RU },
  { region: "North America", mineTop1Seats: 0, midTop1Seats: 0, fill: FILL.US },
  { region: "Middle East", mineTop1Seats: 0, midTop1Seats: 0, fill: FILL.MA },
];

export type CountryHub = {
  country: string;
  iso: string;
  region: Region;
  mineTop1Count: number;
  midTop1Count: number;
  totalTop1Count: number;
  fill: string;
};

export const COUNTRY_HUBS: CountryHub[] = [
  {
    country: "China",
    iso: "CN",
    region: "East Asia",
    mineTop1Count: 3,
    midTop1Count: 8,
    totalTop1Count: 11,
    fill: FILL.CN,
  },
  {
    country: "Congo (Kinshasa)",
    iso: "CD",
    region: "Africa",
    mineTop1Count: 1,
    midTop1Count: 0,
    totalTop1Count: 1,
    fill: FILL.CD,
  },
  {
    country: "South Africa",
    iso: "ZA",
    region: "Africa",
    mineTop1Count: 1,
    midTop1Count: 0,
    totalTop1Count: 1,
    fill: FILL.ZA,
  },
  {
    country: "Indonesia",
    iso: "ID",
    region: "Southeast Asia",
    mineTop1Count: 1,
    midTop1Count: 0,
    totalTop1Count: 1,
    fill: FILL.ID,
  },
  {
    country: "Chile",
    iso: "CL",
    region: "Latin America",
    mineTop1Count: 1,
    midTop1Count: 0,
    totalTop1Count: 1,
    fill: FILL.CL,
  },
  {
    country: "Australia",
    iso: "AU",
    region: "Oceania",
    mineTop1Count: 1,
    midTop1Count: 0,
    totalTop1Count: 1,
    fill: FILL.AU,
  },
];

/** Prior→Q3 Top-1 vintage deltas for midstream / paired ledgers */
export type VintageDelta = {
  id: string;
  label: string;
  stage: Stage;
  priorPct: number;
  q3Pct: number;
  deltaPp: number;
  direction: Direction;
  fill: string;
};

export const VINTAGE_DELTAS: VintageDelta[] = [
  {
    id: "copper-smelt",
    label: "Cu smelt",
    stage: "smelter",
    priorPct: 15,
    q3Pct: 50,
    deltaPp: 35,
    direction: "tighter",
    fill: FILL.SMELT,
  },
  {
    id: "battery-recovery",
    label: "Batt recovery",
    stage: "recycle",
    priorPct: 70,
    q3Pct: 90,
    deltaPp: 20,
    direction: "tighter",
    fill: FILL.RECYCLE,
  },
  {
    id: "copper-refine",
    label: "Cu refine",
    stage: "midstream",
    priorPct: 44,
    q3Pct: 50,
    deltaPp: 6,
    direction: "tighter",
    fill: FILL.CN,
  },
  {
    id: "lithium-chem",
    label: "Li chem",
    stage: "midstream",
    priorPct: 65,
    q3Pct: 70,
    deltaPp: 5,
    direction: "tighter",
    fill: FILL.CN,
  },
  {
    id: "gallium-refine",
    label: "Gallium",
    stage: "midstream",
    priorPct: 98,
    q3Pct: 99,
    deltaPp: 1,
    direction: "tighter",
    fill: FILL.CN,
  },
  {
    id: "graphite-anode",
    label: "Graphite anode",
    stage: "midstream",
    priorPct: 90,
    q3Pct: 90,
    deltaPp: 0,
    direction: "flat",
    fill: FILL.CN,
  },
  {
    id: "cobalt-refine",
    label: "Co refine",
    stage: "midstream",
    priorPct: 76,
    q3Pct: 75,
    deltaPp: -1,
    direction: "flat",
    fill: FILL.CN,
  },
  {
    id: "graphite-mine",
    label: "Graphite mine",
    stage: "mine",
    priorPct: 79.4,
    q3Pct: 77.8,
    deltaPp: -1.6,
    direction: "easier",
    fill: FILL.CN,
  },
  {
    id: "rare-earth-separate",
    label: "REE separate",
    stage: "midstream",
    priorPct: 90,
    q3Pct: 85,
    deltaPp: -5,
    direction: "easier",
    fill: FILL.CN,
  },
];

/** Aggregate regional production share for a commodity */
export function regionShares(
  geo: CommodityGeo,
): { region: Region; sharePct: number; fill: string }[] {
  const map = new Map<Region, { sharePct: number; fill: string }>();
  for (const c of geo.countries) {
    const prev = map.get(c.region);
    if (prev) {
      prev.sharePct += c.sharePct;
    } else {
      map.set(c.region, { sharePct: c.sharePct, fill: c.fill });
    }
  }
  return [...map.entries()]
    .map(([region, v]) => ({
      region,
      sharePct: Math.round(v.sharePct * 10) / 10,
      fill: v.fill,
    }))
    .sort((a, b) => b.sharePct - a.sharePct);
}

export type GeoScatterPoint = {
  metal: string;
  mineSharePct: number;
  midSharePct: number;
  sameTop1: boolean;
  fill: string;
};

export const GEO_SCATTER: GeoScatterPoint[] = STAGE_FLIPS.map((f) => ({
  metal: f.metal,
  mineSharePct: f.mineSharePct,
  midSharePct: f.midSharePct,
  sameTop1: f.mineTop1 === f.midTop1,
  fill: f.fill,
}));

/** Stacked regional mix rows for selected stage catalog */
export function regionalMixRows(
  geos: CommodityGeo[],
): { id: string; label: string; [region: string]: string | number }[] {
  return geos.map((g) => {
    const shares = regionShares(g);
    const row: { id: string; label: string; [region: string]: string | number } = {
      id: g.id,
      label: g.shortLabel,
    };
    for (const s of shares) {
      row[s.region] = s.sharePct;
    }
    return row;
  });
}

export const REGION_FILL: Record<Region, string> = {
  "East Asia": FILL.CN,
  "Southeast Asia": FILL.ID,
  Africa: FILL.CD,
  "Latin America": FILL.CL,
  "North America": FILL.US,
  Europe: FILL.RU,
  "Middle East": FILL.MA,
  Oceania: FILL.AU,
  Other: FILL.OTHER,
};

export const MIX_REGIONS: Region[] = [
  "East Asia",
  "Southeast Asia",
  "Africa",
  "Latin America",
  "Oceania",
  "North America",
  "Europe",
  "Other",
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function getCommodityById(id: string): CommodityGeo | undefined {
  return ALL_GEOGRAPHIES.find((g) => g.id === id);
}
