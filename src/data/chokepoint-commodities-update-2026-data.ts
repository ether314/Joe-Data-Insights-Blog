/**
 * Chokepoint commodities vintage update (Aug 2026).
 * Compares the theme research print (USGS MCS 2025 / 2024e ledger) against
 * the newest official vintage: USGS Mineral Commodity Summaries 2026 v1.3
 * (May 2026; 2025e world production).
 *
 * Primary: USGS MCS 2026 PDF chapters (gallium, graphite, cobalt, copper,
 * lithium, tungsten, rare earths, antimony). Secondary midstream rows
 * (graphite anode, lithium chemicals, REE separation) carry forward the
 * research/IEA labels — MCS does not restate those processing shares.
 */

export const SOURCE_NOTE =
  "Vintage delta: research baseline = USGS Mineral Commodity Summaries 2025 (2024e shares used in chokepoint-commodities-research-2026) vs update = USGS MCS 2026 version 1.3 (May 2026; 2025e). Top-1 and top-3 shares computed from MCS country and world totals (rounded). US net import reliance from MCS 2026 salient statistics (2025e). Graphite-anode, lithium-chemical, and rare-earth-separation processing shares remain secondary IEA/research labels — not restated in MCS mine tables. Shares may not sum to 100% because USGS publishes rounded country and world totals.";

export const USGS_MCS_2026_URL =
  "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026.pdf";

export const USGS_MCS_2025_URL =
  "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025.pdf";

export const SOURCES = [
  {
    label: "USGS — Mineral Commodity Summaries 2026 (v1.3)",
    url: USGS_MCS_2026_URL,
  },
  {
    label: "USGS — Mineral Commodity Summaries 2025 (research baseline)",
    url: USGS_MCS_2025_URL,
  },
  {
    label: "Theme research — chokepoint commodities ledger",
    url: "/blog/chokepoint-commodities-research-2026",
  },
] as const;

/** Headline vintage deltas vs research print */
export const HEADLINE = {
  priorVintage: "MCS 2025 / 2024e",
  newVintage: "MCS 2026 / 2025e",
  copperRefinePriorPct: 44,
  copperRefineNewPct: 48.3,
  copperRefineDeltaPp: 4.3,
  usCopperReliancePriorPct: 45,
  usCopperRelianceNewPct: 57,
  usCopperRelianceDeltaPp: 12,
  galliumPriorPct: 98,
  galliumNewPct: 99,
  graphiteMinePriorPct: 79.4,
  graphiteMineNewPct: 77.8,
  graphiteMineDeltaPp: -1.6,
  graphiteChinaTonsPriorKt: 1270,
  graphiteChinaTonsNewKt: 1400,
  cobaltDrcPriorPct: 74,
  cobaltDrcNewPct: 74.2,
  lithiumAusPriorPct: 37,
  lithiumAusNewPct: 31.7,
  lithiumChinaMineNewPct: 21.4,
  tungstenChinaPriorPct: 83,
  tungstenChinaNewPct: 78.8,
  stagesAbove70Prior: 8,
  stagesAbove70New: 7,
  chinaTop1StagesPrior: 12,
  chinaTop1StagesNew: 12,
} as const;

export type Stage = "mine" | "midstream" | "export";
export type Sector =
  | "batteries"
  | "semiconductors"
  | "fertilizers"
  | "industrial-gases"
  | "structural"
  | "magnets";

export type Confidence = "disclosed" | "estimated" | "secondary";
export type Direction = "tighter" | "easier" | "flat" | "revised";

export type VintageRow = {
  id: string;
  label: string;
  shortLabel: string;
  stage: Stage;
  sectors: Sector[];
  top1Label: string;
  top1Iso: string;
  /** Research / MCS 2025 baseline top-1 share (%) */
  priorTop1Pct: number;
  /** MCS 2026 / 2025e top-1 share (%) */
  newTop1Pct: number;
  /** new − prior, percentage points */
  deltaPp: number;
  priorTop3Pct: number;
  newTop3Pct: number;
  usReliancePriorPct: number;
  usRelianceNewPct: number;
  direction: Direction;
  unit: string;
  confidence: Confidence;
  note?: string;
  relatedSlug?: string;
};

/** Core ledger stages with measurable MCS vintage deltas */
export const VINTAGE_ROWS: VintageRow[] = [
  {
    id: "gallium-refine",
    label: "Gallium (refined / primary)",
    shortLabel: "Gallium",
    stage: "midstream",
    sectors: ["semiconductors"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 98,
    newTop1Pct: 99,
    deltaPp: 1,
    priorTop3Pct: 99,
    newTop3Pct: 100,
    usReliancePriorPct: 100,
    usRelianceNewPct: 100,
    direction: "tighter",
    unit: "% of world primary low-purity gallium",
    confidence: "estimated",
    note: "MCS 2026: China ~99% of worldwide primary low-purity gallium; US reliance still 100%",
  },
  {
    id: "graphite-mine",
    label: "Natural graphite (mine)",
    shortLabel: "Graphite",
    stage: "mine",
    sectors: ["batteries"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 79.4,
    newTop1Pct: 77.8,
    deltaPp: -1.6,
    priorTop3Pct: 89.6,
    newTop3Pct: 86.1,
    usReliancePriorPct: 100,
    usRelianceNewPct: 100,
    direction: "easier",
    unit: "% of world mine tons",
    confidence: "estimated",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    note: "China tons rose 1.27→1.40 Mt; world rose faster (1.55→1.80 Mt) on Tanzania/Mozambique — share eases slightly",
  },
  {
    id: "graphite-anode",
    label: "Graphite anode processing",
    shortLabel: "Graphite anode",
    stage: "midstream",
    sectors: ["batteries"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 90,
    newTop1Pct: 90,
    deltaPp: 0,
    priorTop3Pct: 95,
    newTop3Pct: 95,
    usReliancePriorPct: 100,
    usRelianceNewPct: 100,
    direction: "flat",
    unit: "% of battery-grade anode capacity (IEA secondary)",
    confidence: "secondary",
    note: "Processing share not restated in MCS 2026 — carry-forward from research/IEA",
  },
  {
    id: "rare-earth-mine",
    label: "Rare earths (mine)",
    shortLabel: "REE mine",
    stage: "mine",
    sectors: ["magnets", "semiconductors"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 69,
    newTop1Pct: 69.2,
    deltaPp: 0.2,
    priorTop3Pct: 88,
    newTop3Pct: 87.4,
    usReliancePriorPct: 80,
    usRelianceNewPct: 80,
    direction: "flat",
    unit: "% of world REO mine",
    confidence: "estimated",
    relatedSlug: "rare-earth-mine-concentration-2024",
    note: "China 270 kt of 390 kt world (2025e); 2025 export-control cycle did not shrink mine share",
  },
  {
    id: "rare-earth-separate",
    label: "Rare-earth separation",
    shortLabel: "REE separate",
    stage: "midstream",
    sectors: ["magnets"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 90,
    newTop1Pct: 90,
    deltaPp: 0,
    priorTop3Pct: 98,
    newTop3Pct: 98,
    usReliancePriorPct: 80,
    usRelianceNewPct: 80,
    direction: "flat",
    unit: "% of separation capacity (IEA/USGS narrative)",
    confidence: "secondary",
  },
  {
    id: "cobalt-mine",
    label: "Cobalt (mine)",
    shortLabel: "Cobalt",
    stage: "mine",
    sectors: ["batteries"],
    top1Label: "Congo (Kinshasa)",
    top1Iso: "CD",
    priorTop1Pct: 74,
    newTop1Pct: 74.2,
    deltaPp: 0.2,
    priorTop3Pct: 85,
    newTop3Pct: 90.9,
    usReliancePriorPct: 76,
    usRelianceNewPct: 76,
    direction: "flat",
    unit: "% of world mine cobalt",
    confidence: "estimated",
    note: "DRC 230 kt of 310 kt; Indonesia rose to 44 kt (14%) — top-3 tightened via #2 growth",
  },
  {
    id: "cobalt-refine",
    label: "Cobalt (refined)",
    shortLabel: "Co refine",
    stage: "midstream",
    sectors: ["batteries"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 76,
    newTop1Pct: 76,
    deltaPp: 0,
    priorTop3Pct: 90,
    newTop3Pct: 90,
    usReliancePriorPct: 76,
    usRelianceNewPct: 76,
    direction: "flat",
    unit: "% of world refined cobalt",
    confidence: "estimated",
    note: "MCS 2026 narrative: China remains world-leading refined cobalt producer — quantitative refine table not fully restated; carry-forward with flat flag",
  },
  {
    id: "tungsten-mine",
    label: "Tungsten (mine)",
    shortLabel: "Tungsten",
    stage: "mine",
    sectors: ["structural", "semiconductors"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 83,
    newTop1Pct: 78.8,
    deltaPp: -4.2,
    priorTop3Pct: 92,
    newTop3Pct: 85.2,
    usReliancePriorPct: 50,
    usRelianceNewPct: 50,
    direction: "easier",
    unit: "% of world mine tungsten",
    confidence: "estimated",
    note: "Kazakhstan Boguty start (2.4 kt) diluted China share; China tons flat at 67 kt",
  },
  {
    id: "antimony-mine",
    label: "Antimony (mine)",
    shortLabel: "Antimony",
    stage: "mine",
    sectors: ["semiconductors", "structural"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 48,
    newTop1Pct: 36.4,
    deltaPp: -11.6,
    priorTop3Pct: 78,
    newTop3Pct: 85.5,
    usReliancePriorPct: 86,
    usRelianceNewPct: 91,
    direction: "revised",
    unit: "% of world mine antimony",
    confidence: "estimated",
    note: "MCS 2026 revises 2024 world totals up and Russia still large; China share falls on paper while US reliance rises to 91% after export bans",
  },
  {
    id: "lithium-mine",
    label: "Lithium (mine)",
    shortLabel: "Lithium",
    stage: "mine",
    sectors: ["batteries"],
    top1Label: "Australia",
    top1Iso: "AU",
    priorTop1Pct: 37,
    newTop1Pct: 31.7,
    deltaPp: -5.3,
    priorTop3Pct: 78,
    newTop3Pct: 72.4,
    usReliancePriorPct: 25,
    usRelianceNewPct: 50,
    direction: "easier",
    unit: "% of world lithium mine (Li content; ex-US)",
    confidence: "estimated",
    note: "World ex-US jumped 222→290 kt (+31%); Australia still #1 but share diluted; China mine 62 kt (~21%)",
  },
  {
    id: "lithium-chem",
    label: "Lithium chemicals",
    shortLabel: "Li chem",
    stage: "midstream",
    sectors: ["batteries"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 65,
    newTop1Pct: 65,
    deltaPp: 0,
    priorTop3Pct: 85,
    newTop3Pct: 85,
    usReliancePriorPct: 25,
    usRelianceNewPct: 50,
    direction: "flat",
    unit: "% of lithium chemical capacity (IEA secondary)",
    confidence: "secondary",
  },
  {
    id: "copper-mine",
    label: "Copper (mine)",
    shortLabel: "Cu mine",
    stage: "mine",
    sectors: ["structural", "batteries"],
    top1Label: "Chile",
    top1Iso: "CL",
    priorTop1Pct: 23,
    newTop1Pct: 23,
    deltaPp: 0,
    priorTop3Pct: 48,
    newTop3Pct: 48.7,
    usReliancePriorPct: 45,
    usRelianceNewPct: 57,
    direction: "flat",
    unit: "% of world mine copper",
    confidence: "estimated",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Chile 5.3 of 23 Mt — mine map still plural; US reliance spike is a refine/import story",
  },
  {
    id: "copper-refine",
    label: "Copper (refined)",
    shortLabel: "Cu refine",
    stage: "midstream",
    sectors: ["structural", "batteries"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 44,
    newTop1Pct: 48.3,
    deltaPp: 4.3,
    priorTop3Pct: 60,
    newTop3Pct: 63.8,
    usReliancePriorPct: 45,
    usRelianceNewPct: 57,
    direction: "tighter",
    unit: "% of world refined copper",
    confidence: "estimated",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "China refine 12.4→14.0 Mt while world 27.6→29.0 Mt — largest tightening delta in the ledger",
  },
  {
    id: "nickel-mine",
    label: "Nickel (mine)",
    shortLabel: "Nickel",
    stage: "mine",
    sectors: ["batteries", "structural"],
    top1Label: "Indonesia",
    top1Iso: "ID",
    priorTop1Pct: 50,
    newTop1Pct: 50,
    deltaPp: 0,
    priorTop3Pct: 70,
    newTop3Pct: 70,
    usReliancePriorPct: 48,
    usRelianceNewPct: 48,
    direction: "flat",
    unit: "% of world mine nickel",
    confidence: "estimated",
    note: "Carry-forward pending full MCS nickel country table reconciliation in this update cut",
  },
  {
    id: "phosphate-rock",
    label: "Phosphate rock (mine)",
    shortLabel: "P rock",
    stage: "mine",
    sectors: ["fertilizers"],
    top1Label: "China",
    top1Iso: "CN",
    priorTop1Pct: 41,
    newTop1Pct: 41,
    deltaPp: 0,
    priorTop3Pct: 68,
    newTop3Pct: 68,
    usReliancePriorPct: 9,
    usRelianceNewPct: 9,
    direction: "flat",
    unit: "% of world phosphate-rock mine",
    confidence: "estimated",
    relatedSlug: "phosphate-rock-supply-concentration-2024",
  },
  {
    id: "helium",
    label: "Helium (production)",
    shortLabel: "Helium",
    stage: "mine",
    sectors: ["industrial-gases", "semiconductors"],
    top1Label: "United States",
    top1Iso: "US",
    priorTop1Pct: 40,
    newTop1Pct: 40,
    deltaPp: 0,
    priorTop3Pct: 85,
    newTop3Pct: 85,
    usReliancePriorPct: 0,
    usRelianceNewPct: 0,
    direction: "flat",
    unit: "% of world helium production",
    confidence: "estimated",
    relatedSlug: "global-helium-supply-concentration-2024",
    note: "US remains net exporter (reliance E); global thin-market structure unchanged",
  },
];

export type DeltaBucket = {
  id: Direction;
  label: string;
  count: number;
  color: string;
};

export function deltaBuckets(): DeltaBucket[] {
  const counts: Record<Direction, number> = {
    tighter: 0,
    easier: 0,
    flat: 0,
    revised: 0,
  };
  for (const r of VINTAGE_ROWS) counts[r.direction] += 1;
  return [
    { id: "tighter", label: "Tighter", count: counts.tighter, color: "#ea580c" },
    { id: "easier", label: "Easier", count: counts.easier, color: "#14b8a6" },
    { id: "flat", label: "Flat", count: counts.flat, color: "#64748b" },
    { id: "revised", label: "Revised", count: counts.revised, color: "#a78bfa" },
  ];
}

export type RelianceSpike = {
  id: string;
  shortLabel: string;
  priorPct: number;
  newPct: number;
  deltaPp: number;
};

export function relianceSpikes(minAbsDelta = 3): RelianceSpike[] {
  return VINTAGE_ROWS.filter(
    (r) => Math.abs(r.usRelianceNewPct - r.usReliancePriorPct) >= minAbsDelta,
  )
    .map((r) => ({
      id: r.id,
      shortLabel: r.shortLabel,
      priorPct: r.usReliancePriorPct,
      newPct: r.usRelianceNewPct,
      deltaPp: r.usRelianceNewPct - r.usReliancePriorPct,
    }))
    .sort((a, b) => Math.abs(b.deltaPp) - Math.abs(a.deltaPp));
}

export type StageFlipDelta = {
  family: string;
  minePrior: number;
  mineNew: number;
  midPrior: number;
  midNew: number;
  mineLeader: string;
  midLeader: string;
};

export const STAGE_FLIP_DELTAS: StageFlipDelta[] = [
  {
    family: "Graphite",
    minePrior: 79.4,
    mineNew: 77.8,
    midPrior: 90,
    midNew: 90,
    mineLeader: "China",
    midLeader: "China",
  },
  {
    family: "Rare earths",
    minePrior: 69,
    mineNew: 69.2,
    midPrior: 90,
    midNew: 90,
    mineLeader: "China",
    midLeader: "China",
  },
  {
    family: "Cobalt",
    minePrior: 74,
    mineNew: 74.2,
    midPrior: 76,
    midNew: 76,
    mineLeader: "DRC",
    midLeader: "China",
  },
  {
    family: "Lithium",
    minePrior: 37,
    mineNew: 31.7,
    midPrior: 65,
    midNew: 65,
    mineLeader: "Australia",
    midLeader: "China",
  },
  {
    family: "Copper",
    minePrior: 23,
    mineNew: 23,
    midPrior: 44,
    midNew: 48.3,
    mineLeader: "Chile",
    midLeader: "China",
  },
];

export function rankedByAbsDelta(rows = VINTAGE_ROWS): VintageRow[] {
  return [...rows].sort((a, b) => Math.abs(b.deltaPp) - Math.abs(a.deltaPp));
}

export function filterVintage(
  rows: VintageRow[],
  opts: { stage?: Stage | "all"; direction?: Direction | "all"; sector?: Sector | "all" },
): VintageRow[] {
  return rows.filter((r) => {
    if (opts.stage && opts.stage !== "all" && r.stage !== opts.stage) return false;
    if (opts.direction && opts.direction !== "all" && r.direction !== opts.direction)
      return false;
    if (opts.sector && opts.sector !== "all" && !r.sectors.includes(opts.sector))
      return false;
    return true;
  });
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}
