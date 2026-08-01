/**
 * Global natural graphite mine production concentration — USGS MCS 2025.
 * Units: metric tons (mine output) unless noted. Reserves in metric tons.
 */

export const SOURCE_NOTE =
  "Mine production and reserves from USGS Mineral Commodity Summaries 2025 (January 2025). 2024 figures are USGS estimates (e). Shares use the USGS rounded world total (1.60 Mt in 2024; 1.53 Mt in 2023). US import-source shares are USGS 2020–23 averages. Battery-grade processing concentration cited from IEA Global Critical Minerals Outlook 2025 is labeled separately as secondary.";

export const USGS_MCS_URL =
  "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-graphite.pdf";

export const IEA_OUTLOOK_URL =
  "https://www.iea.org/reports/global-critical-minerals-outlook-2025";

export type Confidence = "disclosed" | "estimated";

export type GraphiteCountry = {
  country: string;
  shortLabel: string;
  iso: string;
  mine2023T: number;
  mine2024T: number;
  reservesT: number | null;
  confidence: Confidence;
  note?: string;
};

/** USGS MCS 2025 world mine production table (natural graphite) */
export const COUNTRIES: GraphiteCountry[] = [
  {
    country: "China",
    shortLabel: "China",
    iso: "CN",
    mine2023T: 1_210_000,
    mine2024T: 1_270_000,
    reservesT: 81_000_000,
    confidence: "estimated",
    note: "~85% flake / ~15% amorphous of Chinese output",
  },
  {
    country: "Madagascar",
    shortLabel: "Madagascar",
    iso: "MG",
    mine2023T: 63_000,
    mine2024T: 89_000,
    reservesT: 27_000_000,
    confidence: "estimated",
  },
  {
    country: "Mozambique",
    shortLabel: "Mozambique",
    iso: "MZ",
    mine2023T: 98_000,
    mine2024T: 75_000,
    reservesT: 25_000_000,
    confidence: "estimated",
  },
  {
    country: "Brazil",
    shortLabel: "Brazil",
    iso: "BR",
    mine2023T: 66_300,
    mine2024T: 68_000,
    reservesT: 74_000_000,
    confidence: "estimated",
    note: "Reserves rival China’s; mine output ~5% of China’s",
  },
  {
    country: "India",
    shortLabel: "India",
    iso: "IN",
    mine2023T: 25_600,
    mine2024T: 27_800,
    reservesT: 8_600_000,
    confidence: "estimated",
  },
  {
    country: "Tanzania",
    shortLabel: "Tanzania",
    iso: "TZ",
    mine2023T: 13_200,
    mine2024T: 25_000,
    reservesT: 18_000_000,
    confidence: "estimated",
    note: "Lindi Jumbo ramp — 40 kt/yr nameplate cited by USGS",
  },
  {
    country: "Canada",
    shortLabel: "Canada",
    iso: "CA",
    mine2023T: 5_470,
    mine2024T: 20_000,
    reservesT: 5_900_000,
    confidence: "estimated",
  },
  {
    country: "Russia",
    shortLabel: "Russia",
    iso: "RU",
    mine2023T: 15_000,
    mine2024T: 20_000,
    reservesT: 14_000_000,
    confidence: "estimated",
  },
  {
    country: "Korea, Republic of",
    shortLabel: "S. Korea",
    iso: "KR",
    mine2023T: 9_620,
    mine2024T: 9_600,
    reservesT: 1_800_000,
    confidence: "estimated",
  },
  {
    country: "Korea, North",
    shortLabel: "N. Korea",
    iso: "KP",
    mine2023T: 8_100,
    mine2024T: 8_100,
    reservesT: 2_000_000,
    confidence: "estimated",
  },
  {
    country: "Norway",
    shortLabel: "Norway",
    iso: "NO",
    mine2023T: 6_480,
    mine2024T: 7_000,
    reservesT: 600_000,
    confidence: "estimated",
  },
  {
    country: "Sri Lanka",
    shortLabel: "Sri Lanka",
    iso: "LK",
    mine2023T: 3_000,
    mine2024T: 3_300,
    reservesT: 1_500_000,
    confidence: "estimated",
  },
  {
    country: "Turkey",
    shortLabel: "Turkey",
    iso: "TR",
    mine2023T: 2_800,
    mine2024T: 3_100,
    reservesT: 6_900_000,
    confidence: "estimated",
  },
  {
    country: "Vietnam",
    shortLabel: "Vietnam",
    iso: "VN",
    mine2023T: 2_500,
    mine2024T: 2_000,
    reservesT: 9_700_000,
    confidence: "estimated",
  },
  {
    country: "Mexico",
    shortLabel: "Mexico",
    iso: "MX",
    mine2023T: 1_300,
    mine2024T: 900,
    reservesT: 3_100_000,
    confidence: "estimated",
  },
  {
    country: "Ukraine",
    shortLabel: "Ukraine",
    iso: "UA",
    mine2023T: 1_670,
    mine2024T: 1_200,
    reservesT: null,
    confidence: "estimated",
  },
  {
    country: "Austria",
    shortLabel: "Austria",
    iso: "AT",
    mine2023T: 500,
    mine2024T: 500,
    reservesT: null,
    confidence: "estimated",
  },
  {
    country: "Germany",
    shortLabel: "Germany",
    iso: "DE",
    mine2023T: 180,
    mine2024T: 170,
    reservesT: null,
    confidence: "estimated",
  },
  {
    country: "United States",
    shortLabel: "United States",
    iso: "US",
    mine2023T: 0,
    mine2024T: 0,
    reservesT: null,
    confidence: "disclosed",
    note: "No domestic mine output; 100% net import reliance",
  },
];

export const WORLD_MINE_2023 = 1_530_000;
export const WORLD_MINE_2024 = 1_600_000;
export const WORLD_RESERVES = 290_000_000;

export const HEADLINE = {
  chinaShare2024Pct: 79.4, // 1.27 / 1.60
  chinaTons2024: 1_270_000,
  top3Share2024Pct: 89.6, // CN+MG+MZ
  worldTons2024: WORLD_MINE_2024,
  usMineTons: 0,
  usNetImportReliancePct: 100,
  brazilReservesSharePct: 25.5, // 74/290
  brazilMineSharePct: 4.3, // 68k/1.6M
  madagascarDeltaTons: 26_000, // 89k - 63k
};

/** USGS US import sources for natural graphite, 2020–23 average */
export const US_IMPORT_SOURCES = [
  { source: "China", sharePct: 43, note: "Includes Hong Kong" },
  { source: "Canada", sharePct: 13 },
  { source: "Mexico", sharePct: 13 },
  { source: "Mozambique", sharePct: 13 },
  { source: "Other", sharePct: 18 },
].sort((a, b) => b.sharePct - a.sharePct);

export const US_SALIENT = {
  imports2024T: 60_000,
  imports2023T: 73_500,
  apparentConsumption2024T: 52_000,
  apparentConsumption2023T: 65_700,
  flakeImportUnitValue2024: 1_070,
  netImportReliancePct: 100,
};

export const SOURCES = [
  {
    label: "USGS Mineral Commodity Summaries 2025 — Graphite (Natural)",
    url: USGS_MCS_URL,
  },
  {
    label: "IEA Global Critical Minerals Outlook 2025 (processing concentration)",
    url: IEA_OUTLOOK_URL,
  },
];

export function mineShare2024(c: GraphiteCountry): number {
  return (c.mine2024T / WORLD_MINE_2024) * 100;
}

export function mineShare2023(c: GraphiteCountry): number {
  return (c.mine2023T / WORLD_MINE_2023) * 100;
}

export function reservesShare(c: GraphiteCountry): number | null {
  if (c.reservesT == null) return null;
  return (c.reservesT / WORLD_RESERVES) * 100;
}

export function productionIntensity(
  c: GraphiteCountry,
): number | null {
  if (c.reservesT == null || c.reservesT === 0) return null;
  return (c.mine2024T / c.reservesT) * 1000; // tons mined per 1000 tons reserves
}

export function fmtTons(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} Mt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} kt`;
  return `${n}`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

/** Ranked producers with output > 0, highest → lowest */
export function rankedProducers2024(): GraphiteCountry[] {
  return COUNTRIES.filter((c) => c.mine2024T > 0).sort(
    (a, b) => b.mine2024T - a.mine2024T,
  );
}

export function topMovers(): GraphiteCountry[] {
  return [...COUNTRIES]
    .filter((c) => c.mine2024T > 0 || c.mine2023T > 0)
    .sort(
      (a, b) =>
        Math.abs(b.mine2024T - b.mine2023T) -
        Math.abs(a.mine2024T - a.mine2023T),
    )
    .slice(0, 10);
}
