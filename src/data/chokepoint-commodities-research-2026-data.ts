/**
 * Chokepoint commodities research 2026 — cross-mineral concentration ledger.
 * Primary: USGS Mineral Commodity Summaries 2025 (2024 estimates).
 * Secondary: IEA Critical Minerals Outlook 2025 (processing shares, labeled).
 */

export const SOURCE_NOTE =
  "Mine, refine, and reserve shares from USGS Mineral Commodity Summaries 2025 (January 2025); 2024 figures are USGS estimates (e). US net import reliance from USGS MCS 2025. Battery and semiconductor processing shares from IEA Global Critical Minerals Outlook 2025 are labeled secondary. Phosphate fertilizer export shares from The Fertilizer Institute / IFPRI corridor work (2025). Helium producer shares from USGS MCS 2025 helium chapter. Shares may not sum to 100% because USGS publishes rounded country and world totals.";

export const USGS_MCS_URL =
  "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025.pdf";

export const IEA_OUTLOOK_URL =
  "https://www.iea.org/reports/global-critical-minerals-outlook-2025";

export type Stage = "mine" | "midstream" | "export";
export type Sector =
  | "batteries"
  | "semiconductors"
  | "fertilizers"
  | "industrial-gases"
  | "structural"
  | "magnets";

export type Confidence = "disclosed" | "estimated" | "secondary";

export type CommodityRow = {
  id: string;
  label: string;
  shortLabel: string;
  stage: Stage;
  sectors: Sector[];
  /** Leading producer / processor share of world (%) */
  top1SharePct: number;
  top1Label: string;
  top1Iso: string;
  top3SharePct: number;
  top3Labels: string;
  /** Approximate HHI on country shares (0–10,000) */
  hhi: number;
  /** USGS US net import reliance (%) — 100 = fully import-dependent */
  usNetImportReliancePct: number;
  /** 1–5 narrative substitutability (1 = hard to substitute in near term) */
  substitutionDifficulty: number;
  unit: string;
  year: number;
  confidence: Confidence;
  note?: string;
  relatedSlug?: string;
};

/** Cross-commodity concentration table used by the dashboard and prose */
export const COMMODITIES: CommodityRow[] = [
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
    unit: "% of world refined output",
    year: 2024,
    confidence: "estimated",
    note: "USGS: China dominates primary refined gallium; US reliance 100%",
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
    unit: "% of world mine tons",
    year: 2024,
    confidence: "estimated",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    note: "USGS MCS 2025: China 1.27 Mt of 1.60 Mt world",
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
    unit: "% of battery-grade anode capacity (IEA)",
    year: 2024,
    confidence: "secondary",
    note: "IEA Critical Minerals Outlook 2025 processing concentration",
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
    unit: "% of world REO mine",
    year: 2024,
    confidence: "estimated",
    relatedSlug: "rare-earth-mine-concentration-2024",
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
    unit: "% of separation capacity (IEA/USGS narrative)",
    year: 2024,
    confidence: "secondary",
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
    unit: "% of world mine cobalt",
    year: 2024,
    confidence: "estimated",
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
    unit: "% of world refined cobalt",
    year: 2024,
    confidence: "estimated",
    note: "Mine in DRC; refine in China — classic stage flip",
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
    unit: "% of world mine tungsten",
    year: 2024,
    confidence: "estimated",
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
    unit: "% of world mine antimony",
    year: 2024,
    confidence: "estimated",
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
    unit: "% of world refined germanium",
    year: 2024,
    confidence: "estimated",
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
    unit: "% of world mine nickel",
    year: 2024,
    confidence: "estimated",
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
    unit: "% of world lithium mine (LCE basis)",
    year: 2024,
    confidence: "estimated",
    note: "More plural than graphite/cobalt at the pit — midstream still China-heavy",
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
    unit: "% of lithium chemical capacity (IEA)",
    year: 2024,
    confidence: "secondary",
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
    unit: "% of world mine copper",
    year: 2024,
    confidence: "estimated",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
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
    unit: "% of world refined copper",
    year: 2024,
    confidence: "estimated",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "China mines ~8% but refines ~44% — midstream chokepoint",
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
    unit: "% of world phosphate-rock mine",
    year: 2024,
    confidence: "estimated",
    relatedSlug: "phosphate-rock-supply-concentration-2024",
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
    unit: "% of processed phosphate fertilizer exports",
    year: 2024,
    confidence: "estimated",
    relatedSlug: "phosphate-fertilizer-export-dependence-2026",
    note: "Food-system chokepoint is export licenses more than rock tons",
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
    unit: "% of world helium production",
    year: 2024,
    confidence: "estimated",
    relatedSlug: "global-helium-supply-concentration-2024",
    note: "Two-country industrial-gas bottleneck (US + Qatar)",
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
    unit: "% of world mine platinum",
    year: 2024,
    confidence: "estimated",
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
    unit: "% of world mine palladium",
    year: 2024,
    confidence: "estimated",
  },
];

export type ProducerPresence = {
  iso: string;
  country: string;
  shortLabel: string;
  /** Count of commodities in COMMODITIES where this country is top1 */
  top1Count: number;
  /** Average top1 share across those commodities */
  avgTop1SharePct: number;
  commodityIds: string[];
};

export function producerScoreboard(): ProducerPresence[] {
  const map = new Map<string, ProducerPresence>();
  for (const c of COMMODITIES) {
    const cur = map.get(c.top1Iso) ?? {
      iso: c.top1Iso,
      country: c.top1Label,
      shortLabel: c.top1Label,
      top1Count: 0,
      avgTop1SharePct: 0,
      commodityIds: [],
    };
    cur.top1Count += 1;
    cur.commodityIds.push(c.id);
    cur.avgTop1SharePct += c.top1SharePct;
    map.set(c.top1Iso, cur);
  }
  return [...map.values()]
    .map((p) => ({
      ...p,
      avgTop1SharePct: p.avgTop1SharePct / p.top1Count,
    }))
    .sort((a, b) => b.top1Count - a.top1Count || b.avgTop1SharePct - a.avgTop1SharePct);
}

export type StageSplit = {
  family: string;
  mineTop1Pct: number;
  midstreamTop1Pct: number;
  mineLeader: string;
  midstreamLeader: string;
};

/** Families with both mine and midstream rows for slope / dumbbell panels */
export const STAGE_SPLITS: StageSplit[] = [
  {
    family: "Graphite",
    mineTop1Pct: 79.4,
    midstreamTop1Pct: 90,
    mineLeader: "China",
    midstreamLeader: "China",
  },
  {
    family: "Rare earths",
    mineTop1Pct: 69,
    midstreamTop1Pct: 90,
    mineLeader: "China",
    midstreamLeader: "China",
  },
  {
    family: "Cobalt",
    mineTop1Pct: 74,
    midstreamTop1Pct: 76,
    mineLeader: "DRC",
    midstreamLeader: "China",
  },
  {
    family: "Lithium",
    mineTop1Pct: 37,
    midstreamTop1Pct: 65,
    mineLeader: "Australia",
    midstreamLeader: "China",
  },
  {
    family: "Copper",
    mineTop1Pct: 23,
    midstreamTop1Pct: 44,
    mineLeader: "Chile",
    midstreamLeader: "China",
  },
];

export type SectorExposure = {
  sector: Sector;
  label: string;
  medianTop1Pct: number;
  maxTop1Pct: number;
  maxLabel: string;
  commodityCount: number;
};

export function sectorExposures(): SectorExposure[] {
  const labels: Record<Sector, string> = {
    batteries: "Batteries & EVs",
    semiconductors: "Semiconductors",
    fertilizers: "Fertilizers / food",
    "industrial-gases": "Industrial gases",
    structural: "Structural metals",
    magnets: "Permanent magnets",
  };
  const sectors = Object.keys(labels) as Sector[];
  return sectors
    .map((sector) => {
      const rows = COMMODITIES.filter((c) => c.sectors.includes(sector));
      const shares = rows.map((r) => r.top1SharePct).sort((a, b) => a - b);
      const max = rows.reduce((a, b) => (b.top1SharePct > a.top1SharePct ? b : a));
      const mid = shares[Math.floor(shares.length / 2)] ?? 0;
      return {
        sector,
        label: labels[sector],
        medianTop1Pct: mid,
        maxTop1Pct: max.top1SharePct,
        maxLabel: max.shortLabel,
        commodityCount: rows.length,
      };
    })
    .sort((a, b) => b.medianTop1Pct - a.medianTop1Pct);
}

export const HEADLINE = {
  commoditiesTracked: COMMODITIES.length,
  chinaTop1Count: COMMODITIES.filter((c) => c.top1Iso === "CN").length,
  extremeTop1Count: COMMODITIES.filter((c) => c.top1SharePct >= 70).length,
  galliumChinaPct: 98,
  graphiteChinaPct: 79.4,
  copperRefineChinaPct: 44,
  copperMineChilePct: 23,
  phosphateExportTop3Pct: 67,
  medianTop1Pct: (() => {
    const s = [...COMMODITIES.map((c) => c.top1SharePct)].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)]!;
  })(),
};

export function filterCommodities(opts: {
  stage?: Stage | "all";
  sector?: Sector | "all";
}): CommodityRow[] {
  return COMMODITIES.filter((c) => {
    if (opts.stage && opts.stage !== "all" && c.stage !== opts.stage) return false;
    if (opts.sector && opts.sector !== "all" && !c.sectors.includes(opts.sector))
      return false;
    return true;
  });
}

export function rankedBy(
  rows: CommodityRow[],
  metric: "top1" | "top3" | "hhi" | "usReliance" | "substitution",
): CommodityRow[] {
  const key =
    metric === "top1"
      ? (c: CommodityRow) => c.top1SharePct
      : metric === "top3"
        ? (c: CommodityRow) => c.top3SharePct
        : metric === "hhi"
          ? (c: CommodityRow) => c.hhi
          : metric === "usReliance"
            ? (c: CommodityRow) => c.usNetImportReliancePct
            : (c: CommodityRow) => c.substitutionDifficulty;
  return [...rows].sort((a, b) => key(b) - key(a));
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}
