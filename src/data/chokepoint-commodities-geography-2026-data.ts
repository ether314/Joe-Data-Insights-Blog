/**
 * Chokepoint commodities — geography lens (country / regional shares).
 * Primary: USGS Mineral Commodity Summaries 2025 (2024e country shares).
 * Secondary: IEA Global Critical Minerals Outlook 2025 (processing shares).
 * Complements concentration (Top-k/HHI) and research (full ledger) posts.
 */

export type Confidence = "disclosed" | "estimated" | "secondary";
export type Stage = "mine" | "midstream" | "export";
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

export const SOURCE_NOTE =
  "Country and regional shares from USGS Mineral Commodity Summaries 2025 (January 2025); 2024 figures are USGS estimates (e). Battery and semiconductor midstream processing shares from IEA Global Critical Minerals Outlook 2025 are labeled secondary. Regional aggregates re-bucket USGS country rows; shares may not sum to 100% because USGS publishes rounded country and world totals. Geography answers *where* capacity sits — pair with concentration posts for Top-k / HHI.";

export const USGS_MCS_URL =
  "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025.pdf";
export const IEA_OUTLOOK_URL =
  "https://www.iea.org/reports/global-critical-minerals-outlook-2025";

/** Headline meters for cards and post lede */
export const HEADLINE = {
  commoditiesMapped: 14,
  chinaTotalTop1Count: 9,
  chinaMidstreamTop1Count: 6,
  africaMineTop1Count: 2,
  largestMineToMidFlipPp: 66,
  largestMineToMidFlipLabel: "Cobalt (DRC mine → China refine)",
  eastAsiaMidstreamSharePct: 100,
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
  QA: "#e879f9",
  OTHER: "#94a3b8",
  MY: "#22d3ee",
  PE: "#fbbf24",
  FI: "#2dd4bf",
} as const;

/** Mine-stage country ledgers (USGS MCS 2025 / 2024e) */
export const MINE_GEOGRAPHIES: CommodityGeo[] = [
  {
    id: "cobalt-mine",
    label: "Cobalt (mine)",
    shortLabel: "Cobalt",
    stage: "mine",
    sector: "batteries",
    confidence: "estimated",
    top1SharePct: 74,
    top1Label: "Congo (Kinshasa)",
    top1Region: "Africa",
    note: "Pit geography is African; refine flips to East Asia",
    countries: [
      { country: "Congo (Kinshasa)", iso: "CD", region: "Africa", sharePct: 74, fill: FILL.CD },
      { country: "Indonesia", iso: "ID", region: "Southeast Asia", sharePct: 7, fill: FILL.ID },
      { country: "Russia", iso: "RU", region: "Europe", sharePct: 4, fill: FILL.RU },
      { country: "Australia", iso: "AU", region: "Oceania", sharePct: 3, fill: FILL.AU },
      { country: "Other", iso: "XX", region: "Other", sharePct: 12, fill: FILL.OTHER },
    ],
  },
  {
    id: "graphite-mine",
    label: "Natural graphite (mine)",
    shortLabel: "Graphite",
    stage: "mine",
    sector: "batteries",
    confidence: "estimated",
    top1SharePct: 79.4,
    top1Label: "China",
    top1Region: "East Asia",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 79.4, fill: FILL.CN },
      { country: "Madagascar", iso: "MG", region: "Africa", sharePct: 5.5, fill: FILL.CD },
      { country: "Mozambique", iso: "MZ", region: "Africa", sharePct: 4.7, fill: FILL.ZA },
      { country: "Brazil", iso: "BR", region: "Latin America", sharePct: 3.2, fill: FILL.CL },
      { country: "Other", iso: "XX", region: "Other", sharePct: 7.2, fill: FILL.OTHER },
    ],
  },
  {
    id: "rare-earth-mine",
    label: "Rare earths (mine)",
    shortLabel: "REE mine",
    stage: "mine",
    sector: "magnets",
    confidence: "estimated",
    top1SharePct: 69,
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
    top1Label: "Indonesia",
    top1Region: "Southeast Asia",
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
    confidence: "estimated",
    top1SharePct: 37,
    top1Label: "Australia",
    top1Region: "Oceania",
    note: "More plural at the pit — chemicals still China-led",
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
    confidence: "estimated",
    top1SharePct: 24,
    top1Label: "Chile",
    top1Region: "Latin America",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Chile leads the pit; China leads the refinery",
    countries: [
      { country: "Chile", iso: "CL", region: "Latin America", sharePct: 24, fill: FILL.CL },
      { country: "Peru", iso: "PE", region: "Latin America", sharePct: 10, fill: FILL.PE },
      { country: "Congo (Kinshasa)", iso: "CD", region: "Africa", sharePct: 10, fill: FILL.CD },
      { country: "China", iso: "CN", region: "East Asia", sharePct: 8, fill: FILL.CN },
      { country: "United States", iso: "US", region: "North America", sharePct: 5, fill: FILL.US },
      { country: "Other", iso: "XX", region: "Other", sharePct: 43, fill: FILL.OTHER },
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

/** Midstream / refine / processing country ledgers */
export const MIDSTREAM_GEOGRAPHIES: CommodityGeo[] = [
  {
    id: "gallium-refine",
    label: "Gallium (refined)",
    shortLabel: "Gallium",
    stage: "midstream",
    sector: "semiconductors",
    confidence: "estimated",
    top1SharePct: 98,
    top1Label: "China",
    top1Region: "East Asia",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 98, fill: FILL.CN },
      { country: "Russia", iso: "RU", region: "Europe", sharePct: 1, fill: FILL.RU },
      { country: "Other", iso: "XX", region: "Other", sharePct: 1, fill: FILL.OTHER },
    ],
  },
  {
    id: "graphite-anode",
    label: "Graphite anode processing",
    shortLabel: "Graphite anode",
    stage: "midstream",
    sector: "batteries",
    confidence: "secondary",
    top1SharePct: 90,
    top1Label: "China",
    top1Region: "East Asia",
    note: "IEA Critical Minerals Outlook 2025",
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
    confidence: "secondary",
    top1SharePct: 90,
    top1Label: "China",
    top1Region: "East Asia",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 90, fill: FILL.CN },
      { country: "Malaysia", iso: "MY", region: "Southeast Asia", sharePct: 5, fill: FILL.MY },
      { country: "Other", iso: "XX", region: "Other", sharePct: 5, fill: FILL.OTHER },
    ],
  },
  {
    id: "cobalt-refine",
    label: "Cobalt (refined)",
    shortLabel: "Co refine",
    stage: "midstream",
    sector: "batteries",
    confidence: "estimated",
    top1SharePct: 76,
    top1Label: "China",
    top1Region: "East Asia",
    note: "Mine in DRC (~74%); refine in China (~76%) — classic stage flip",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 76, fill: FILL.CN },
      { country: "Finland", iso: "FI", region: "Europe", sharePct: 9, fill: FILL.FI },
      { country: "Canada", iso: "CA", region: "North America", sharePct: 5, fill: FILL.US },
      { country: "Other", iso: "XX", region: "Other", sharePct: 10, fill: FILL.OTHER },
    ],
  },
  {
    id: "lithium-chem",
    label: "Lithium chemicals",
    shortLabel: "Li chem",
    stage: "midstream",
    sector: "batteries",
    confidence: "secondary",
    top1SharePct: 65,
    top1Label: "China",
    top1Region: "East Asia",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 65, fill: FILL.CN },
      { country: "Chile", iso: "CL", region: "Latin America", sharePct: 12, fill: FILL.CL },
      { country: "Argentina", iso: "AR", region: "Latin America", sharePct: 8, fill: FILL.PE },
      { country: "Other", iso: "XX", region: "Other", sharePct: 15, fill: FILL.OTHER },
    ],
  },
  {
    id: "copper-refine",
    label: "Copper (refined)",
    shortLabel: "Cu refine",
    stage: "midstream",
    sector: "structural",
    confidence: "estimated",
    top1SharePct: 44,
    top1Label: "China",
    top1Region: "East Asia",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "China mines ~8% but refines ~44%",
    countries: [
      { country: "China", iso: "CN", region: "East Asia", sharePct: 44, fill: FILL.CN },
      { country: "Chile", iso: "CL", region: "Latin America", sharePct: 9, fill: FILL.CL },
      { country: "Congo (Kinshasa)", iso: "CD", region: "Africa", sharePct: 7, fill: FILL.CD },
      { country: "Japan", iso: "JP", region: "East Asia", sharePct: 5, fill: FILL.MY },
      { country: "Other", iso: "XX", region: "Other", sharePct: 35, fill: FILL.OTHER },
    ],
  },
];

export const ALL_GEOGRAPHIES: CommodityGeo[] = [
  ...MINE_GEOGRAPHIES,
  ...MIDSTREAM_GEOGRAPHIES,
];

/** Mine → midstream geographic flips (same metal, different stage Top-1) */
export type StageFlip = {
  id: string;
  metal: string;
  mineTop1: string;
  mineTop1Region: Region;
  mineSharePct: number;
  midTop1: string;
  midTop1Region: Region;
  midSharePct: number;
  flipPp: number;
  fill: string;
};

export const STAGE_FLIPS: StageFlip[] = [
  {
    id: "cobalt",
    metal: "Cobalt",
    mineTop1: "Congo (Kinshasa)",
    mineTop1Region: "Africa",
    mineSharePct: 74,
    midTop1: "China",
    midTop1Region: "East Asia",
    midSharePct: 76,
    flipPp: 66,
    fill: FILL.CD,
  },
  {
    id: "copper",
    metal: "Copper",
    mineTop1: "Chile",
    mineTop1Region: "Latin America",
    mineSharePct: 24,
    midTop1: "China",
    midTop1Region: "East Asia",
    midSharePct: 44,
    flipPp: 36,
    fill: FILL.CL,
  },
  {
    id: "lithium",
    metal: "Lithium",
    mineTop1: "Australia",
    mineTop1Region: "Oceania",
    mineSharePct: 37,
    midTop1: "China",
    midTop1Region: "East Asia",
    midSharePct: 65,
    flipPp: 28,
    fill: FILL.AU,
  },
  {
    id: "rare-earths",
    metal: "Rare earths",
    mineTop1: "China",
    mineTop1Region: "East Asia",
    mineSharePct: 69,
    midTop1: "China",
    midTop1Region: "East Asia",
    midSharePct: 90,
    flipPp: 21,
    fill: FILL.CN,
  },
  {
    id: "graphite",
    metal: "Graphite",
    mineTop1: "China",
    mineTop1Region: "East Asia",
    mineSharePct: 79.4,
    midTop1: "China",
    midTop1Region: "East Asia",
    midSharePct: 90,
    flipPp: 10.6,
    fill: FILL.CN,
  },
];

/** Regional share of Top-1 seats across mapped commodities (by stage) */
export type RegionSeat = {
  region: Region;
  mineTop1Seats: number;
  midTop1Seats: number;
  fill: string;
};

export const REGION_TOP1_SEATS: RegionSeat[] = [
  { region: "East Asia", mineTop1Seats: 3, midTop1Seats: 6, fill: FILL.CN },
  { region: "Africa", mineTop1Seats: 2, midTop1Seats: 0, fill: FILL.CD },
  { region: "Southeast Asia", mineTop1Seats: 1, midTop1Seats: 0, fill: FILL.ID },
  { region: "Latin America", mineTop1Seats: 1, midTop1Seats: 0, fill: FILL.CL },
  { region: "Oceania", mineTop1Seats: 1, midTop1Seats: 0, fill: FILL.AU },
  { region: "Europe", mineTop1Seats: 0, midTop1Seats: 0, fill: FILL.RU },
  { region: "North America", mineTop1Seats: 0, midTop1Seats: 0, fill: FILL.US },
  { region: "Middle East", mineTop1Seats: 0, midTop1Seats: 0, fill: FILL.QA },
];

/** Country exposure: how many mapped Top-1 seats each country holds */
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
    midTop1Count: 6,
    totalTop1Count: 9,
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

/** Aggregate regional production share for a commodity */
export function regionShares(geo: CommodityGeo): { region: Region; sharePct: number; fill: string }[] {
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
    .map(([region, v]) => ({ region, sharePct: Math.round(v.sharePct * 10) / 10, fill: v.fill }))
    .sort((a, b) => b.sharePct - a.sharePct);
}

/** Scatter points: for paired metals, mine Top-1 share vs mid Top-1 share */
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

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function getCommodityById(id: string): CommodityGeo | undefined {
  return ALL_GEOGRAPHIES.find((g) => g.id === id);
}
