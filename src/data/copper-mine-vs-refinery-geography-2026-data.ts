/**
 * Copper mine vs refinery geography — USGS Mineral Commodity Summaries 2025.
 * Units: thousand metric tons (kt) copper content unless noted.
 * World refinery > world mine because secondary (scrap) refining is included.
 */

export const SOURCE_NOTE =
  "Mine production, refinery production, and reserves from USGS Mineral Commodity Summaries 2025 (January 2025), Copper chapter. 2024 figures are USGS estimates (e). Shares use USGS rounded world totals (mine 23,000 kt; refinery 27,000 kt; reserves 980,000 kt). Refinery totals include primary and secondary refined copper. US import-source shares are USGS 2020–23 averages for refined copper.";

export const USGS_MCS_URL =
  "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-copper.pdf";

export type Confidence = "disclosed" | "estimated";

export type CopperCountry = {
  country: string;
  shortLabel: string;
  iso: string;
  mine2023Kt: number;
  mine2024Kt: number;
  refine2023Kt: number;
  refine2024Kt: number;
  reservesKt: number | null;
  confidence: Confidence;
  note?: string;
};

/** USGS MCS 2025 world mine and refinery production table (copper) */
export const COUNTRIES: CopperCountry[] = [
  {
    country: "Chile",
    shortLabel: "Chile",
    iso: "CL",
    mine2023Kt: 5_250,
    mine2024Kt: 5_300,
    refine2023Kt: 2_080,
    refine2024Kt: 1_900,
    reservesKt: 190_000,
    confidence: "estimated",
    note: "World’s largest miner; refined output far below mine tons",
  },
  {
    country: "Congo (Kinshasa)",
    shortLabel: "DRC",
    iso: "CD",
    mine2023Kt: 2_930,
    mine2024Kt: 3_300,
    refine2023Kt: 2_170,
    refine2024Kt: 2_500,
    reservesKt: 80_000,
    confidence: "estimated",
    note: "Fastest large mine ramp 2023→2024",
  },
  {
    country: "Peru",
    shortLabel: "Peru",
    iso: "PE",
    mine2023Kt: 2_760,
    mine2024Kt: 2_600,
    refine2023Kt: 403,
    refine2024Kt: 390,
    reservesKt: 100_000,
    confidence: "estimated",
    note: "Classic concentrate-export miner",
  },
  {
    country: "China",
    shortLabel: "China",
    iso: "CN",
    mine2023Kt: 1_820,
    mine2024Kt: 1_800,
    refine2023Kt: 12_000,
    refine2024Kt: 12_000,
    reservesKt: 41_000,
    confidence: "estimated",
    note: "Refinery giant; imports concentrates and scrap",
  },
  {
    country: "United States",
    shortLabel: "United States",
    iso: "US",
    mine2023Kt: 1_130,
    mine2024Kt: 1_100,
    refine2023Kt: 882,
    refine2024Kt: 890,
    reservesKt: 47_000,
    confidence: "estimated",
  },
  {
    country: "Indonesia",
    shortLabel: "Indonesia",
    iso: "ID",
    mine2023Kt: 907,
    mine2024Kt: 1_100,
    refine2023Kt: 225,
    refine2024Kt: 350,
    reservesKt: 21_000,
    confidence: "estimated",
    note: "Mine and refine both rising; still a net concentrate exporter",
  },
  {
    country: "Russia",
    shortLabel: "Russia",
    iso: "RU",
    mine2023Kt: 890,
    mine2024Kt: 930,
    refine2023Kt: 1_000,
    refine2024Kt: 960,
    reservesKt: 80_000,
    confidence: "estimated",
  },
  {
    country: "Australia",
    shortLabel: "Australia",
    iso: "AU",
    mine2023Kt: 778,
    mine2024Kt: 800,
    refine2023Kt: 442,
    refine2024Kt: 460,
    reservesKt: 100_000,
    confidence: "estimated",
  },
  {
    country: "Kazakhstan",
    shortLabel: "Kazakhstan",
    iso: "KZ",
    mine2023Kt: 740,
    mine2024Kt: 740,
    refine2023Kt: 458,
    refine2024Kt: 470,
    reservesKt: 20_000,
    confidence: "estimated",
  },
  {
    country: "Mexico",
    shortLabel: "Mexico",
    iso: "MX",
    mine2023Kt: 699,
    mine2024Kt: 700,
    refine2023Kt: 509,
    refine2024Kt: 350,
    reservesKt: 53_000,
    confidence: "estimated",
    note: "2024 refine drop vs stable mine",
  },
  {
    country: "Zambia",
    shortLabel: "Zambia",
    iso: "ZM",
    mine2023Kt: 712,
    mine2024Kt: 680,
    refine2023Kt: 222,
    refine2024Kt: 170,
    reservesKt: 21_000,
    confidence: "estimated",
  },
  {
    country: "Canada",
    shortLabel: "Canada",
    iso: "CA",
    mine2023Kt: 500,
    mine2024Kt: 450,
    refine2023Kt: 315,
    refine2024Kt: 320,
    reservesKt: 8_300,
    confidence: "estimated",
  },
  {
    country: "Poland",
    shortLabel: "Poland",
    iso: "PL",
    mine2023Kt: 395,
    mine2024Kt: 410,
    refine2023Kt: 592,
    refine2024Kt: 590,
    reservesKt: 34_000,
    confidence: "estimated",
  },
  {
    country: "India",
    shortLabel: "India",
    iso: "IN",
    mine2023Kt: 27,
    mine2024Kt: 30,
    refine2023Kt: 509,
    refine2024Kt: 510,
    reservesKt: 2_200,
    confidence: "estimated",
    note: "Tiny mine, mid-tier refiner",
  },
  {
    country: "Japan",
    shortLabel: "Japan",
    iso: "JP",
    mine2023Kt: 0,
    mine2024Kt: 0,
    refine2023Kt: 1_490,
    refine2024Kt: 1_600,
    reservesKt: null,
    confidence: "estimated",
    note: "Zero mine; imports concentrates for smelting",
  },
  {
    country: "Germany",
    shortLabel: "Germany",
    iso: "DE",
    mine2023Kt: 0,
    mine2024Kt: 0,
    refine2023Kt: 609,
    refine2024Kt: 630,
    reservesKt: null,
    confidence: "estimated",
  },
  {
    country: "Korea, Republic of",
    shortLabel: "S. Korea",
    iso: "KR",
    mine2023Kt: 0,
    mine2024Kt: 0,
    refine2023Kt: 604,
    refine2024Kt: 620,
    reservesKt: null,
    confidence: "estimated",
  },
];

export const WORLD_MINE_2023 = 22_600;
export const WORLD_MINE_2024 = 23_000;
export const WORLD_REFINE_2023 = 27_000;
export const WORLD_REFINE_2024 = 27_000;
export const WORLD_RESERVES = 980_000;

export const HEADLINE = {
  chinaMineSharePct: 7.8, // 1800/23000
  chinaRefineSharePct: 44.4, // 12000/27000
  chinaRefineOverMineRatio: 5.7, // 44.4/7.8
  chinaRefineMinusMinePp: 36.6, // 44.4 - 7.8
  chileMineSharePct: 23.0, // 5300/23000
  chileRefineSharePct: 7.0, // 1900/27000
  peruMineSharePct: 11.3,
  peruRefineSharePct: 1.4,
  worldMineKt: WORLD_MINE_2024,
  worldRefineKt: WORLD_REFINE_2024,
  top3MineSharePct: 48.7, // CL+CD+PE = 5300+3300+2600 = 11200 / 23000
  top3RefineSharePct: 60.7, // CN+CD+CL = 12000+2500+1900 = 16400 / 27000
};

export const US_SALIENT = {
  mine2024Kt: 1_100,
  refine2024Kt: 890,
  netImportReliancePct: 45,
  apparentConsumption2024Kt: 1_800,
  priceComex2024Cpl: 420,
};

/** USGS US refined copper import sources, 2020–23 average */
export const US_REFINED_IMPORT_SOURCES = [
  { source: "Chile", sharePct: 65 },
  { source: "Canada", sharePct: 17 },
  { source: "Mexico", sharePct: 9 },
  { source: "Peru", sharePct: 6 },
  { source: "Other", sharePct: 3 },
];

export const SOURCES = [
  {
    label: "USGS Mineral Commodity Summaries 2025 — Copper",
    url: USGS_MCS_URL,
  },
];

export function mineShare2024(c: CopperCountry): number {
  return (c.mine2024Kt / WORLD_MINE_2024) * 100;
}

export function refineShare2024(c: CopperCountry): number {
  return (c.refine2024Kt / WORLD_REFINE_2024) * 100;
}

export function mineShare2023(c: CopperCountry): number {
  return (c.mine2023Kt / WORLD_MINE_2023) * 100;
}

export function refineShare2023(c: CopperCountry): number {
  return (c.refine2023Kt / WORLD_REFINE_2023) * 100;
}

/** Refinery share minus mine share (pp). Positive = refine-heavy. */
export function gapPp2024(c: CopperCountry): number {
  return refineShare2024(c) - mineShare2024(c);
}

export function reservesShare(c: CopperCountry): number | null {
  if (c.reservesKt == null) return null;
  return (c.reservesKt / WORLD_RESERVES) * 100;
}

export function fmtKt(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)} Mt`;
  return `${n.toLocaleString()} kt`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function rankedMiners2024(): CopperCountry[] {
  return COUNTRIES.filter((c) => c.mine2024Kt > 0).sort(
    (a, b) => b.mine2024Kt - a.mine2024Kt,
  );
}

export function rankedRefiners2024(): CopperCountry[] {
  return COUNTRIES.filter((c) => c.refine2024Kt > 0).sort(
    (a, b) => b.refine2024Kt - a.refine2024Kt,
  );
}

/** Largest absolute refine−mine share gaps */
export function rankedGaps2024(): CopperCountry[] {
  return [...COUNTRIES]
    .filter((c) => c.mine2024Kt > 0 || c.refine2024Kt > 0)
    .sort((a, b) => Math.abs(gapPp2024(b)) - Math.abs(gapPp2024(a)));
}

export function mineMovers(): CopperCountry[] {
  return [...COUNTRIES]
    .filter((c) => c.mine2024Kt > 0 || c.mine2023Kt > 0)
    .sort(
      (a, b) =>
        Math.abs(b.mine2024Kt - b.mine2023Kt) -
        Math.abs(a.mine2024Kt - a.mine2023Kt),
    )
    .slice(0, 10);
}
