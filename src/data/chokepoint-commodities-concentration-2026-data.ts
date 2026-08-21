/**
 * Chokepoint commodities — concentration lens (Top-1 / Top-3 / HHI).
 * Primary: USGS Mineral Commodity Summaries 2025 (2024e).
 * Secondary: IEA Critical Minerals Outlook 2025 (processing shares, labeled).
 * Complements research (full ledger) and update (vintage delta) posts.
 */

export type Confidence = "disclosed" | "estimated" | "secondary";
export type Stage = "mine" | "midstream" | "export";
export type Sector =
  | "batteries"
  | "semiconductors"
  | "fertilizers"
  | "industrial-gases"
  | "structural"
  | "magnets";

export const SOURCE_NOTE =
  "Mine, refine, and reserve shares from USGS Mineral Commodity Summaries 2025 (January 2025); 2024 figures are USGS estimates (e). Battery and semiconductor processing shares from IEA Global Critical Minerals Outlook 2025 are labeled secondary. Phosphate fertilizer export shares from The Fertilizer Institute / IFPRI corridor work (2025). Helium producer shares from USGS MCS 2025 helium chapter. Top-k ladders and HHI are derived from country shares; shares may not sum to 100% because USGS publishes rounded country and world totals.";

export const USGS_MCS_URL =
  "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025.pdf";
export const IEA_OUTLOOK_URL =
  "https://www.iea.org/reports/global-critical-minerals-outlook-2025";

export type CommodityShare = {
  id: string;
  label: string;
  shortLabel: string;
  stage: Stage;
  sectors: Sector[];
  top1SharePct: number;
  top1Label: string;
  top1Iso: string;
  top3SharePct: number;
  top3Labels: string;
  /** Approximate HHI on country shares (0–10,000) */
  hhi: number;
  usNetImportReliancePct: number;
  substitutionDifficulty: number;
  confidence: Confidence;
  relatedSlug?: string;
  note?: string;
  fill: string;
};

const CN = "#f43f5e";
const OTHER = "#0ea5e9";
const MID = "#f59e0b";
const EXPORT = "#8b5cf6";

/** Cross-commodity concentration table — same MCS 2025 vintage as research ledger */
export const COMMODITIES: CommodityShare[] = [
  {
    id: "gallium-refine",
    label: "Gallium (refined)",
    shortLabel: "Gallium",
    stage: "midstream",
    sectors: ["semiconductors"],
    top1SharePct: 98,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 99,
    top3Labels: "China + Russia + Japan",
    hhi: 9604,
    usNetImportReliancePct: 100,
    substitutionDifficulty: 5,
    confidence: "estimated",
    note: "USGS: China dominates primary refined gallium",
    fill: CN,
  },
  {
    id: "graphite-anode",
    label: "Graphite anode processing",
    shortLabel: "Graphite anode",
    stage: "midstream",
    sectors: ["batteries"],
    top1SharePct: 90,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 95,
    top3Labels: "China-led processing chain",
    hhi: 8200,
    usNetImportReliancePct: 100,
    substitutionDifficulty: 5,
    confidence: "secondary",
    note: "IEA Critical Minerals Outlook 2025",
    fill: CN,
  },
  {
    id: "rare-earth-separate",
    label: "Rare-earth separation",
    shortLabel: "REE separate",
    stage: "midstream",
    sectors: ["magnets"],
    top1SharePct: 90,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 98,
    top3Labels: "China + Malaysia + elsewhere",
    hhi: 8200,
    usNetImportReliancePct: 80,
    substitutionDifficulty: 5,
    confidence: "secondary",
    fill: CN,
  },
  {
    id: "tungsten-mine",
    label: "Tungsten (mine)",
    shortLabel: "Tungsten",
    stage: "mine",
    sectors: ["structural", "semiconductors"],
    top1SharePct: 83,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 92,
    top3Labels: "China + Vietnam + Russia",
    hhi: 7000,
    usNetImportReliancePct: 50,
    substitutionDifficulty: 4,
    confidence: "estimated",
    fill: CN,
  },
  {
    id: "graphite-mine",
    label: "Natural graphite (mine)",
    shortLabel: "Graphite",
    stage: "mine",
    sectors: ["batteries"],
    top1SharePct: 79.4,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 89.6,
    top3Labels: "China + Madagascar + Mozambique",
    hhi: 6400,
    usNetImportReliancePct: 100,
    substitutionDifficulty: 4,
    confidence: "estimated",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    fill: CN,
  },
  {
    id: "cobalt-refine",
    label: "Cobalt (refined)",
    shortLabel: "Co refine",
    stage: "midstream",
    sectors: ["batteries"],
    top1SharePct: 76,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 90,
    top3Labels: "China + Finland + Canada",
    hhi: 5900,
    usNetImportReliancePct: 76,
    substitutionDifficulty: 4,
    confidence: "estimated",
    note: "Mine in DRC; refine in China — stage flip",
    fill: CN,
  },
  {
    id: "cobalt-mine",
    label: "Cobalt (mine)",
    shortLabel: "Cobalt",
    stage: "mine",
    sectors: ["batteries"],
    top1SharePct: 74,
    top1Label: "Congo (Kinshasa)",
    top1Iso: "CD",
    top3SharePct: 85,
    top3Labels: "DRC + Indonesia + Russia",
    hhi: 5600,
    usNetImportReliancePct: 76,
    substitutionDifficulty: 4,
    confidence: "estimated",
    fill: OTHER,
  },
  {
    id: "platinum-mine",
    label: "Platinum (mine)",
    shortLabel: "Platinum",
    stage: "mine",
    sectors: ["structural"],
    top1SharePct: 71,
    top1Label: "South Africa",
    top1Iso: "ZA",
    top3SharePct: 92,
    top3Labels: "South Africa + Russia + Zimbabwe",
    hhi: 5300,
    usNetImportReliancePct: 79,
    substitutionDifficulty: 4,
    confidence: "estimated",
    fill: MID,
  },
  {
    id: "rare-earth-mine",
    label: "Rare earths (mine)",
    shortLabel: "REE mine",
    stage: "mine",
    sectors: ["magnets", "semiconductors"],
    top1SharePct: 69,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 88,
    top3Labels: "China + United States + Myanmar",
    hhi: 4900,
    usNetImportReliancePct: 80,
    substitutionDifficulty: 5,
    confidence: "estimated",
    relatedSlug: "rare-earth-mine-concentration-2024",
    fill: CN,
  },
  {
    id: "lithium-chem",
    label: "Lithium chemicals",
    shortLabel: "Li chem",
    stage: "midstream",
    sectors: ["batteries"],
    top1SharePct: 65,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 85,
    top3Labels: "China + Chile + Argentina",
    hhi: 4500,
    usNetImportReliancePct: 25,
    substitutionDifficulty: 4,
    confidence: "secondary",
    fill: CN,
  },
  {
    id: "germanium-refine",
    label: "Germanium (refined)",
    shortLabel: "Germanium",
    stage: "midstream",
    sectors: ["semiconductors"],
    top1SharePct: 60,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 85,
    top3Labels: "China + Russia + Belgium",
    hhi: 3900,
    usNetImportReliancePct: 50,
    substitutionDifficulty: 5,
    confidence: "estimated",
    fill: CN,
  },
  {
    id: "nickel-mine",
    label: "Nickel (mine)",
    shortLabel: "Nickel",
    stage: "mine",
    sectors: ["batteries", "structural"],
    top1SharePct: 50,
    top1Label: "Indonesia",
    top1Iso: "ID",
    top3SharePct: 70,
    top3Labels: "Indonesia + Philippines + Russia",
    hhi: 2800,
    usNetImportReliancePct: 48,
    substitutionDifficulty: 3,
    confidence: "estimated",
    fill: OTHER,
  },
  {
    id: "antimony-mine",
    label: "Antimony (mine)",
    shortLabel: "Antimony",
    stage: "mine",
    sectors: ["semiconductors", "structural"],
    top1SharePct: 48,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 78,
    top3Labels: "China + Tajikistan + Russia",
    hhi: 2800,
    usNetImportReliancePct: 85,
    substitutionDifficulty: 4,
    confidence: "estimated",
    fill: CN,
  },
  {
    id: "copper-refine",
    label: "Copper (refined)",
    shortLabel: "Cu refine",
    stage: "midstream",
    sectors: ["structural", "batteries"],
    top1SharePct: 44,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 60,
    top3Labels: "China + Chile + DRC",
    hhi: 2100,
    usNetImportReliancePct: 45,
    substitutionDifficulty: 3,
    confidence: "estimated",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "China mines ~8% but refines ~44%",
    fill: CN,
  },
  {
    id: "phosphate-rock",
    label: "Phosphate rock (mine)",
    shortLabel: "P rock",
    stage: "mine",
    sectors: ["fertilizers"],
    top1SharePct: 41,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 68,
    top3Labels: "China + Morocco + United States",
    hhi: 2100,
    usNetImportReliancePct: 9,
    substitutionDifficulty: 5,
    confidence: "estimated",
    relatedSlug: "phosphate-rock-supply-concentration-2024",
    fill: CN,
  },
  {
    id: "helium",
    label: "Helium (production)",
    shortLabel: "Helium",
    stage: "mine",
    sectors: ["industrial-gases", "semiconductors"],
    top1SharePct: 40,
    top1Label: "United States",
    top1Iso: "US",
    top3SharePct: 85,
    top3Labels: "United States + Qatar + Algeria",
    hhi: 2500,
    usNetImportReliancePct: 0,
    substitutionDifficulty: 5,
    confidence: "estimated",
    relatedSlug: "global-helium-supply-concentration-2024",
    fill: OTHER,
  },
  {
    id: "palladium-mine",
    label: "Palladium (mine)",
    shortLabel: "Palladium",
    stage: "mine",
    sectors: ["structural", "semiconductors"],
    top1SharePct: 40,
    top1Label: "Russia",
    top1Iso: "RU",
    top3SharePct: 85,
    top3Labels: "Russia + South Africa + Canada",
    hhi: 2600,
    usNetImportReliancePct: 37,
    substitutionDifficulty: 4,
    confidence: "estimated",
    fill: MID,
  },
  {
    id: "lithium-mine",
    label: "Lithium (mine)",
    shortLabel: "Lithium",
    stage: "mine",
    sectors: ["batteries"],
    top1SharePct: 37,
    top1Label: "Australia",
    top1Iso: "AU",
    top3SharePct: 78,
    top3Labels: "Australia + Chile + China",
    hhi: 2200,
    usNetImportReliancePct: 25,
    substitutionDifficulty: 3,
    confidence: "estimated",
    note: "More plural at the pit — midstream still China-heavy",
    fill: OTHER,
  },
  {
    id: "phosphate-fert-export",
    label: "Phosphate fertilizer exports",
    shortLabel: "P fert export",
    stage: "export",
    sectors: ["fertilizers"],
    top1SharePct: 28,
    top1Label: "Morocco",
    top1Iso: "MA",
    top3SharePct: 67,
    top3Labels: "Morocco + China + Saudi Arabia",
    hhi: 1800,
    usNetImportReliancePct: 9,
    substitutionDifficulty: 5,
    confidence: "estimated",
    relatedSlug: "phosphate-fertilizer-export-dependence-2026",
    fill: EXPORT,
  },
  {
    id: "copper-mine",
    label: "Copper (mine)",
    shortLabel: "Cu mine",
    stage: "mine",
    sectors: ["structural", "batteries"],
    top1SharePct: 23,
    top1Label: "Chile",
    top1Iso: "CL",
    top3SharePct: 48,
    top3Labels: "Chile + DRC + Peru",
    hhi: 900,
    usNetImportReliancePct: 45,
    substitutionDifficulty: 2,
    confidence: "estimated",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    fill: OTHER,
  },
];

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s[mid] ?? 0;
}

const top1Shares = COMMODITIES.map((c) => c.top1SharePct);
const top3Shares = COMMODITIES.map((c) => c.top3SharePct);
const hhiValues = COMMODITIES.map((c) => c.hhi);

export const HEADLINE = {
  commoditiesTracked: COMMODITIES.length,
  /** Top-1 share of the most concentrated stage (gallium refined) */
  extremeTop1Pct: 98,
  extremeTop1Label: "Gallium (refined) — China",
  /** Median Top-1 across all tracked stages */
  medianTop1Pct: median(top1Shares),
  medianTop3Pct: median(top3Shares),
  /** Stages with Top-1 ≥ 70% */
  extremeTop1Count: COMMODITIES.filter((c) => c.top1SharePct >= 70).length,
  /** Stages with Top-3 ≥ 85% */
  extremeTop3Count: COMMODITIES.filter((c) => c.top3SharePct >= 85).length,
  chinaTop1Count: COMMODITIES.filter((c) => c.top1Iso === "CN").length,
  chinaShareOfLeadersPct: Math.round(
    (COMMODITIES.filter((c) => c.top1Iso === "CN").length /
      COMMODITIES.length) *
      100,
  ),
  midstreamMedianTop1Pct: median(
    COMMODITIES.filter((c) => c.stage === "midstream").map(
      (c) => c.top1SharePct,
    ),
  ),
  mineMedianTop1Pct: median(
    COMMODITIES.filter((c) => c.stage === "mine").map((c) => c.top1SharePct),
  ),
  medianHhi: median(hhiValues),
  highlyConcentratedHhiCount: COMMODITIES.filter((c) => c.hhi >= 2500).length,
  copperMineTop1Pct: 23,
  copperRefineTop1Pct: 44,
  graphiteMineTop1Pct: 79.4,
  graphiteAnodeTop1Pct: 90,
} as const;

/** Top-k share ladder across the commodity set (share of stages above threshold) */
export const TOP_K_LADDER = [
  {
    k: 1,
    label: "Top-1 ≥ 70%",
    count: HEADLINE.extremeTop1Count,
    sharePct: Math.round(
      (HEADLINE.extremeTop1Count / HEADLINE.commoditiesTracked) * 100,
    ),
    example: "Gallium 98%, graphite anode 90%, tungsten 83%",
  },
  {
    k: 3,
    label: "Top-3 ≥ 85%",
    count: HEADLINE.extremeTop3Count,
    sharePct: Math.round(
      (HEADLINE.extremeTop3Count / HEADLINE.commoditiesTracked) * 100,
    ),
    example: "REE separate 98%, platinum 92%, Co refine 90%",
  },
  {
    k: "hhi",
    label: "HHI ≥ 2,500",
    count: HEADLINE.highlyConcentratedHhiCount,
    sharePct: Math.round(
      (HEADLINE.highlyConcentratedHhiCount / HEADLINE.commoditiesTracked) * 100,
    ),
    example: "Antitrust-high band on country shares",
  },
] as const;

/**
 * Lorenz-style cumulative: rank commodities by Top-1 descending,
 * plot cumulative share of “concentration mass” vs equal line.
 * Each commodity contributes its top1SharePct; cumulative is normalized to 100.
 */
export const CONCENTRATION_CURVE = (() => {
  const ranked = [...COMMODITIES].sort(
    (a, b) => b.top1SharePct - a.top1SharePct,
  );
  const total = ranked.reduce((s, c) => s + c.top1SharePct, 0);
  let cum = 0;
  return ranked.map((c, i) => {
    cum += c.top1SharePct;
    const pctOfStages = ((i + 1) / ranked.length) * 100;
    return {
      rank: i + 1,
      shortLabel: c.shortLabel,
      top1SharePct: c.top1SharePct,
      cumulativeMassPct: Math.round((cum / total) * 1000) / 10,
      equalLinePct: Math.round(pctOfStages * 10) / 10,
      stage: c.stage,
      top1Label: c.top1Label,
    };
  });
})();

export type StageSplit = {
  family: string;
  mineTop1Pct: number;
  midstreamTop1Pct: number;
  mineLeader: string;
  midstreamLeader: string;
  deltaPp: number;
  flip: boolean;
};

/** Mine → midstream concentration flips (same families as research) */
export const STAGE_SPLITS: StageSplit[] = [
  {
    family: "Graphite",
    mineTop1Pct: 79.4,
    midstreamTop1Pct: 90,
    mineLeader: "China",
    midstreamLeader: "China",
    deltaPp: 10.6,
    flip: false,
  },
  {
    family: "Rare earths",
    mineTop1Pct: 69,
    midstreamTop1Pct: 90,
    mineLeader: "China",
    midstreamLeader: "China",
    deltaPp: 21,
    flip: false,
  },
  {
    family: "Cobalt",
    mineTop1Pct: 74,
    midstreamTop1Pct: 76,
    mineLeader: "DRC",
    midstreamLeader: "China",
    deltaPp: 2,
    flip: true,
  },
  {
    family: "Lithium",
    mineTop1Pct: 37,
    midstreamTop1Pct: 65,
    mineLeader: "Australia",
    midstreamLeader: "China",
    deltaPp: 28,
    flip: true,
  },
  {
    family: "Copper",
    mineTop1Pct: 23,
    midstreamTop1Pct: 44,
    mineLeader: "Chile",
    midstreamLeader: "China",
    deltaPp: 21,
    flip: true,
  },
];

export type HhiBand = {
  id: string;
  label: string;
  min: number;
  max: number;
  count: number;
  fill: string;
};

export const HHI_BANDS: HhiBand[] = (() => {
  const bands: Omit<HhiBand, "count">[] = [
    { id: "extreme", label: "≥ 5,000 (extreme)", min: 5000, max: 10000, fill: "#f43f5e" },
    { id: "high", label: "2,500–4,999 (high)", min: 2500, max: 4999, fill: "#f59e0b" },
    { id: "moderate", label: "1,500–2,499 (moderate)", min: 1500, max: 2499, fill: "#0ea5e9" },
    { id: "plural", label: "< 1,500 (more plural)", min: 0, max: 1499, fill: "#14b8a6" },
  ];
  return bands.map((b) => ({
    ...b,
    count: COMMODITIES.filter((c) => c.hhi >= b.min && c.hhi <= b.max).length,
  }));
})();

export type ProducerPresence = {
  iso: string;
  country: string;
  top1Count: number;
  avgTop1SharePct: number;
  medianTop1SharePct: number;
  fill: string;
};

export function producerScoreboard(): ProducerPresence[] {
  const map = new Map<string, { country: string; shares: number[]; fill: string }>();
  for (const c of COMMODITIES) {
    const cur = map.get(c.top1Iso) ?? {
      country: c.top1Label,
      shares: [],
      fill: c.fill,
    };
    cur.shares.push(c.top1SharePct);
    map.set(c.top1Iso, cur);
  }
  return [...map.entries()]
    .map(([iso, v]) => ({
      iso,
      country: v.country,
      top1Count: v.shares.length,
      avgTop1SharePct:
        Math.round(
          (v.shares.reduce((a, b) => a + b, 0) / v.shares.length) * 10,
        ) / 10,
      medianTop1SharePct: median(v.shares),
      fill: v.fill,
    }))
    .sort(
      (a, b) =>
        b.top1Count - a.top1Count || b.avgTop1SharePct - a.avgTop1SharePct,
    );
}

export type SectorExposure = {
  sector: Sector;
  label: string;
  medianTop1Pct: number;
  maxTop1Pct: number;
  maxLabel: string;
  commodityCount: number;
  fill: string;
};

const SECTOR_META: Record<
  Sector,
  { label: string; fill: string }
> = {
  batteries: { label: "Batteries & EVs", fill: "#f43f5e" },
  semiconductors: { label: "Semiconductors", fill: "#8b5cf6" },
  fertilizers: { label: "Fertilizers / food", fill: "#14b8a6" },
  "industrial-gases": { label: "Industrial gases", fill: "#0ea5e9" },
  structural: { label: "Structural metals", fill: "#f59e0b" },
  magnets: { label: "Permanent magnets", fill: "#ec4899" },
};

export function sectorExposures(): SectorExposure[] {
  return (Object.keys(SECTOR_META) as Sector[])
    .map((sector) => {
      const rows = COMMODITIES.filter((c) => c.sectors.includes(sector));
      const max = rows.reduce((a, b) =>
        b.top1SharePct > a.top1SharePct ? b : a,
      );
      return {
        sector,
        label: SECTOR_META[sector].label,
        medianTop1Pct: median(rows.map((r) => r.top1SharePct)),
        maxTop1Pct: max.top1SharePct,
        maxLabel: max.shortLabel,
        commodityCount: rows.length,
        fill: SECTOR_META[sector].fill,
      };
    })
    .sort((a, b) => b.medianTop1Pct - a.medianTop1Pct);
}

/** Scatter: Top-1 share × US net import reliance */
export const RELIANCE_SCATTER = COMMODITIES.map((c) => ({
  id: c.id,
  shortLabel: c.shortLabel,
  x: c.top1SharePct,
  y: c.usNetImportReliancePct,
  z: Math.max(40, Math.sqrt(c.hhi) / 2),
  stage: c.stage,
  top1Label: c.top1Label,
  hhi: c.hhi,
  fill: c.fill,
}));

export function filterCommodities(opts: {
  stage?: Stage | "all";
  sector?: Sector | "all";
}): CommodityShare[] {
  return COMMODITIES.filter((c) => {
    if (opts.stage && opts.stage !== "all" && c.stage !== opts.stage)
      return false;
    if (opts.sector && opts.sector !== "all" && !c.sectors.includes(opts.sector))
      return false;
    return true;
  });
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}
