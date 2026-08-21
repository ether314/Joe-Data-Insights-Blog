/**
 * Chokepoint commodities — Q3 2026 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution
 * after IEA GCMO 2026 restated midstream shares against the MCS 2026 mine anchors?
 *
 * Complements:
 * - concentration-2026 (MCS 2025 / secondary midstream Top-1·Top-3·HHI)
 * - update-2026q3 (IEA vintage deltas)
 * - update-202608 (Pink Sheet / spot TC stress)
 *
 * Primary: IEA Global Critical Minerals Outlook 2026; USGS MCS 2026 v1.3 mine anchors.
 */

export type Confidence = "disclosed" | "estimated" | "secondary";
export type Stage = "mine" | "midstream" | "smelter" | "export" | "recycle";
export type Sector =
  | "batteries"
  | "semiconductors"
  | "magnets"
  | "structural"
  | "fertilizers"
  | "recycling";
export type Direction = "tighter" | "easier" | "flat";

export const SOURCE_NOTE =
  "Q3 concentration vintage vs concentration-2026: midstream Top-1/Top-3/HHI restated with IEA Global Critical Minerals Outlook 2026 (avg top refining-country share ex-REE 72%, REE refining 85%, lithium chemicals ~70%, cobalt refine ~75%, graphite anode ≥90%, battery recovery ~90%, China copper smelting capacity ~50%). Mine rows hold USGS MCS 2026 v1.3 anchors where IEA does not restate pits. Top-3 and HHI on country shares are derived/estimated from disclosed Top-1 plus prior theme ladders — shares may not sum to 100%. Cross-agency Δ is directional.";

export const IEA_GCMO_2026_URL =
  "https://www.iea.org/reports/global-critical-minerals-outlook-2026/executive-summary";
export const USGS_MCS_2026_URL =
  "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026.pdf";

export const PRIOR_CONCENTRATION_PATH =
  "/blog/chokepoint-commodities-concentration-2026";
export const PRIOR_RESEARCH_PATH = "/blog/chokepoint-commodities-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/chokepoint-commodities-update-2026";
export const PRIOR_Q3_PATH = "/blog/chokepoint-commodities-update-2026q3";
export const PRIOR_AUG_PATH = "/blog/chokepoint-commodities-update-202608";
export const COPPER_GEO_PATH = "/blog/copper-mine-vs-refinery-geography-2026";
export const GRAPHITE_PATH = "/blog/natural-graphite-mine-concentration-2024";

const CN = "#f43f5e";
const OTHER = "#0ea5e9";
const MID = "#f59e0b";
const SMELT = "#8b5cf6";
const RECYCLE = "#14b8a6";

export type CommodityShare = {
  id: string;
  label: string;
  shortLabel: string;
  stage: Stage;
  sectors: Sector[];
  /** Prior concentration-2026 / secondary carry Top-1 % */
  priorTop1Pct: number;
  /** Q3 restated Top-1 % (IEA GCMO 2026 or MCS 2026 hold) */
  top1SharePct: number;
  top1Label: string;
  top1Iso: string;
  top3SharePct: number;
  top3Labels: string;
  /** Approximate HHI on country shares (0–10,000) */
  hhi: number;
  deltaPp: number;
  direction: Direction;
  usNetImportReliancePct: number;
  substitutionDifficulty: number;
  confidence: Confidence;
  relatedSlug?: string;
  note?: string;
  fill: string;
};

/** Cross-stage concentration table — Q3 IEA midstream + MCS mine anchors */
export const COMMODITIES: CommodityShare[] = [
  {
    id: "gallium-refine",
    label: "Gallium (refined)",
    shortLabel: "Gallium",
    stage: "midstream",
    sectors: ["semiconductors"],
    priorTop1Pct: 98,
    top1SharePct: 99,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 99.5,
    top3Labels: "China + Russia + Japan",
    hhi: 9801,
    deltaPp: 1,
    direction: "tighter",
    usNetImportReliancePct: 100,
    substitutionDifficulty: 5,
    confidence: "estimated",
    note: "MCS 2026 still near-monopoly; Europe price multiple ~5× China domestic",
    fill: CN,
  },
  {
    id: "graphite-anode",
    label: "Graphite anode processing",
    shortLabel: "Graphite anode",
    stage: "midstream",
    sectors: ["batteries"],
    priorTop1Pct: 90,
    top1SharePct: 90,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 95,
    top3Labels: "China-led processing chain",
    hhi: 8200,
    deltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 100,
    substitutionDifficulty: 5,
    confidence: "estimated",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    note: "IEA: ≥90% hold; full disruption risks ~$300B/yr downstream outside China",
    fill: CN,
  },
  {
    id: "battery-recovery",
    label: "Battery material-recovery capacity",
    shortLabel: "Batt recovery",
    stage: "recycle",
    sectors: ["recycling", "batteries"],
    priorTop1Pct: 70,
    top1SharePct: 90,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 96,
    top3Labels: "China + EU pilots + Korea",
    hhi: 8200,
    deltaPp: 20,
    direction: "tighter",
    usNetImportReliancePct: 100,
    substitutionDifficulty: 4,
    confidence: "disclosed",
    note: "IEA: secondary supply is also concentrated — ~90% recovery capacity",
    fill: RECYCLE,
  },
  {
    id: "rare-earth-separate",
    label: "Rare-earth refining / separation",
    shortLabel: "REE refine",
    stage: "midstream",
    sectors: ["magnets", "semiconductors"],
    priorTop1Pct: 90,
    top1SharePct: 85,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 96,
    top3Labels: "China + Malaysia + United States",
    hhi: 7400,
    deltaPp: -5,
    direction: "easier",
    usNetImportReliancePct: 80,
    substitutionDifficulty: 5,
    confidence: "disclosed",
    relatedSlug: "rare-earth-mine-concentration-2024",
    note: "IEA: US + Malaysia projects cut top-supplier share; path ~70% by 2035 if delivered",
    fill: CN,
  },
  {
    id: "graphite-mine",
    label: "Natural graphite (mine)",
    shortLabel: "Graphite mine",
    stage: "mine",
    sectors: ["batteries"],
    priorTop1Pct: 79.4,
    top1SharePct: 77.8,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 89,
    top3Labels: "China + Madagascar + Mozambique",
    hhi: 6200,
    deltaPp: -1.6,
    direction: "easier",
    usNetImportReliancePct: 100,
    substitutionDifficulty: 4,
    confidence: "secondary",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    note: "MCS 2026 mine hold; midstream anode risk still the binding tip",
    fill: CN,
  },
  {
    id: "cobalt-refine",
    label: "Cobalt (refined)",
    shortLabel: "Co refine",
    stage: "midstream",
    sectors: ["batteries"],
    priorTop1Pct: 76,
    top1SharePct: 75,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 90,
    top3Labels: "China + Finland + Canada",
    hhi: 5800,
    deltaPp: -1,
    direction: "flat",
    usNetImportReliancePct: 76,
    substitutionDifficulty: 4,
    confidence: "estimated",
    note: "Share roughly flat; IEA flags DRC quota volume risk ≠ share relief",
    fill: CN,
  },
  {
    id: "cobalt-mine",
    label: "Cobalt (mine)",
    shortLabel: "Co mine",
    stage: "mine",
    sectors: ["batteries"],
    priorTop1Pct: 74,
    top1SharePct: 74.2,
    top1Label: "Congo (Kinshasa)",
    top1Iso: "CD",
    top3SharePct: 85,
    top3Labels: "DRC + Indonesia + Russia",
    hhi: 5650,
    deltaPp: 0.2,
    direction: "flat",
    usNetImportReliancePct: 76,
    substitutionDifficulty: 4,
    confidence: "secondary",
    note: "MCS 2026 hold; outlook revised for DRC export-quota gap",
    fill: OTHER,
  },
  {
    id: "avg-refine-ex-ree",
    label: "Avg top refining country (ex-REE)",
    shortLabel: "Avg refine",
    stage: "midstream",
    sectors: ["batteries", "structural"],
    priorTop1Pct: 70,
    top1SharePct: 72,
    top1Label: "China / Indonesia mix",
    top1Iso: "CN",
    top3SharePct: 88,
    top3Labels: "Top refining countries (IEA basket)",
    hhi: 5400,
    deltaPp: 2,
    direction: "tighter",
    usNetImportReliancePct: 60,
    substitutionDifficulty: 4,
    confidence: "disclosed",
    note: "IEA headline: 70% (2023) → 72% (2025) average top refining-country share",
    fill: CN,
  },
  {
    id: "lithium-chem",
    label: "Lithium chemical refining",
    shortLabel: "Li chem",
    stage: "midstream",
    sectors: ["batteries"],
    priorTop1Pct: 65,
    top1SharePct: 70,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 88,
    top3Labels: "China + Chile + Argentina",
    hhi: 5100,
    deltaPp: 5,
    direction: "tighter",
    usNetImportReliancePct: 25,
    substitutionDifficulty: 4,
    confidence: "estimated",
    note: "Prior secondary ~65%; IEA 2026 processing narrative ~70%",
    fill: CN,
  },
  {
    id: "rare-earth-mine",
    label: "Rare earths (mine)",
    shortLabel: "REE mine",
    stage: "mine",
    sectors: ["magnets", "semiconductors"],
    priorTop1Pct: 69,
    top1SharePct: 69,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 88,
    top3Labels: "China + United States + Myanmar",
    hhi: 4900,
    deltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 80,
    substitutionDifficulty: 5,
    confidence: "secondary",
    relatedSlug: "rare-earth-mine-concentration-2024",
    fill: CN,
  },
  {
    id: "nickel-growth",
    label: "Nickel refined-supply growth capture",
    shortLabel: "Ni growth",
    stage: "midstream",
    sectors: ["batteries", "structural"],
    priorTop1Pct: 50,
    top1SharePct: 75,
    top1Label: "Indonesia",
    top1Iso: "ID",
    top3SharePct: 90,
    top3Labels: "Indonesia + China peers",
    hhi: 5800,
    deltaPp: 25,
    direction: "tighter",
    usNetImportReliancePct: 48,
    substitutionDifficulty: 3,
    confidence: "estimated",
    note: "IEA: top refiners captured >75% of refined-supply growth over two years",
    fill: OTHER,
  },
  {
    id: "copper-smelt",
    label: "Copper smelting capacity",
    shortLabel: "Cu smelt",
    stage: "smelter",
    sectors: ["structural", "batteries"],
    priorTop1Pct: 15,
    top1SharePct: 50,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 68,
    top3Labels: "China + Chile + Japan",
    hhi: 2800,
    deltaPp: 35,
    direction: "tighter",
    usNetImportReliancePct: 57,
    substitutionDifficulty: 3,
    confidence: "disclosed",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "2005→2025 path; China >90% of capacity growth; 2026 TC/RC settle $0/t",
    fill: SMELT,
  },
  {
    id: "copper-refine",
    label: "Copper (refined)",
    shortLabel: "Cu refine",
    stage: "midstream",
    sectors: ["structural", "batteries"],
    priorTop1Pct: 44,
    top1SharePct: 50,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 65,
    top3Labels: "China + Chile + DRC",
    hhi: 2700,
    deltaPp: 6,
    direction: "tighter",
    usNetImportReliancePct: 57,
    substitutionDifficulty: 3,
    confidence: "estimated",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "MCS ~48% → IEA just-under-50% framing; US net-import reliance 57%",
    fill: CN,
  },
  {
    id: "lithium-mine",
    label: "Lithium (mine)",
    shortLabel: "Li mine",
    stage: "mine",
    sectors: ["batteries"],
    priorTop1Pct: 37,
    top1SharePct: 37,
    top1Label: "Australia",
    top1Iso: "AU",
    top3SharePct: 78,
    top3Labels: "Australia + Chile + China",
    hhi: 2200,
    deltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 25,
    substitutionDifficulty: 3,
    confidence: "secondary",
    note: "Pit stays plural; chemical midstream is the concentration jump",
    fill: OTHER,
  },
  {
    id: "copper-mine",
    label: "Copper (mine)",
    shortLabel: "Cu mine",
    stage: "mine",
    sectors: ["structural", "batteries"],
    priorTop1Pct: 23,
    top1SharePct: 23,
    top1Label: "Chile",
    top1Iso: "CL",
    top3SharePct: 48,
    top3Labels: "Chile + DRC + Peru",
    hhi: 900,
    deltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 57,
    substitutionDifficulty: 2,
    confidence: "secondary",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Mine map still plural; Q3 tip is smelter fees and midstream capacity",
    fill: OTHER,
  },
  {
    id: "phosphate-fert-export",
    label: "Phosphate fertilizer exports",
    shortLabel: "P fert export",
    stage: "export",
    sectors: ["fertilizers"],
    priorTop1Pct: 28,
    top1SharePct: 28,
    top1Label: "Morocco",
    top1Iso: "MA",
    top3SharePct: 67,
    top3Labels: "Morocco + China + Saudi Arabia",
    hhi: 1800,
    deltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 9,
    substitutionDifficulty: 5,
    confidence: "secondary",
    relatedSlug: "phosphate-fertilizer-export-dependence-2026",
    fill: MID,
  },
];

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0
    ? ((s[mid - 1] ?? 0) + (s[mid] ?? 0)) / 2
    : (s[mid] ?? 0);
}

const top1Shares = COMMODITIES.map((c) => c.top1SharePct);
const top3Shares = COMMODITIES.map((c) => c.top3SharePct);
const hhiValues = COMMODITIES.map((c) => c.hhi);
const midstream = COMMODITIES.filter(
  (c) => c.stage === "midstream" || c.stage === "smelter" || c.stage === "recycle",
);
const mine = COMMODITIES.filter((c) => c.stage === "mine");

export const HEADLINE = {
  commoditiesTracked: COMMODITIES.length,
  extremeTop1Pct: 99,
  extremeTop1Label: "Gallium (refined) — China",
  medianTop1Pct: Math.round(median(top1Shares) * 10) / 10,
  medianTop3Pct: Math.round(median(top3Shares) * 10) / 10,
  medianHhi: Math.round(median(hhiValues)),
  extremeTop1Count: COMMODITIES.filter((c) => c.top1SharePct >= 70).length,
  extremeTop3Count: COMMODITIES.filter((c) => c.top3SharePct >= 85).length,
  chinaTop1Count: COMMODITIES.filter((c) => c.top1Iso === "CN").length,
  chinaShareOfLeadersPct: Math.round(
    (COMMODITIES.filter((c) => c.top1Iso === "CN").length /
      COMMODITIES.length) *
      100,
  ),
  midstreamMedianTop1Pct: Math.round(median(midstream.map((c) => c.top1SharePct)) * 10) / 10,
  mineMedianTop1Pct: Math.round(median(mine.map((c) => c.top1SharePct)) * 10) / 10,
  highlyConcentratedHhiCount: COMMODITIES.filter((c) => c.hhi >= 2500).length,
  tighterCount: COMMODITIES.filter((c) => c.direction === "tighter").length,
  easierCount: COMMODITIES.filter((c) => c.direction === "easier").length,
  flatCount: COMMODITIES.filter((c) => c.direction === "flat").length,
  /** IEA headline meters */
  avgRefineExReePct: 72,
  avgRefinePriorPct: 70,
  avgRefineDeltaPp: 2,
  reeRefinePct: 85,
  reeRefinePriorPct: 90,
  reePath2035Pct: 70,
  liChemPct: 70,
  graphiteAnodePct: 90,
  cuSmeltPct: 50,
  cuTcRc2026UsdPerT: 0,
  graphiteDownstreamRiskUsdBn: 300,
  reeDownstreamRiskUsdTn: 6.5,
  investmentYoYPct: -9,
  batteryMetalsCapexYoYPct: -20,
  publicFinanceUsdBn: 65,
  /** Prior concentration-2026 comparables */
  priorMedianTop1Pct: 65,
  priorExtremeTop1Count: 8,
  priorChinaTop1Count: 12,
  priorMidstreamMedianTop1Pct: 76,
} as const;

export const TOP_K_LADDER = [
  {
    k: 1,
    label: "Top-1 ≥ 70%",
    count: HEADLINE.extremeTop1Count,
    sharePct: Math.round(
      (HEADLINE.extremeTop1Count / HEADLINE.commoditiesTracked) * 100,
    ),
    example: "Gallium 99%, graphite anode 90%, battery recovery 90%",
  },
  {
    k: 3,
    label: "Top-3 ≥ 85%",
    count: HEADLINE.extremeTop3Count,
    sharePct: Math.round(
      (HEADLINE.extremeTop3Count / HEADLINE.commoditiesTracked) * 100,
    ),
    example: "Most midstream stages clear 85%+ Top-3",
  },
  {
    k: 0,
    label: "HHI ≥ 2,500",
    count: HEADLINE.highlyConcentratedHhiCount,
    sharePct: Math.round(
      (HEADLINE.highlyConcentratedHhiCount / HEADLINE.commoditiesTracked) * 100,
    ),
    example: "Analytical country-share HHI on disclosed Top-1 ladders",
  },
] as const;

/** Vintage delta bars — prior concentration print → Q3 restatement */
export const VINTAGE_DELTA = COMMODITIES.map((c) => ({
  id: c.id,
  shortLabel: c.shortLabel,
  prior: c.priorTop1Pct,
  q3: c.top1SharePct,
  deltaPp: c.deltaPp,
  direction: c.direction,
  stage: c.stage,
  fill: c.fill,
})).sort((a, b) => Math.abs(b.deltaPp) - Math.abs(a.deltaPp));

/** Stage medians for mine → midstream slope */
export const STAGE_SPLITS = [
  {
    stage: "mine" as const,
    label: "Mine",
    medianTop1: HEADLINE.mineMedianTop1Pct,
    count: mine.length,
    fill: OTHER,
  },
  {
    stage: "midstream" as const,
    label: "Midstream+",
    medianTop1: HEADLINE.midstreamMedianTop1Pct,
    count: midstream.length,
    fill: CN,
  },
];

/** Mine→plant leader flips (same metal, different stage) */
export const STAGE_FLIPS = [
  {
    metal: "Copper",
    mineTop1: 23,
    mineLabel: "Chile",
    plantTop1: 50,
    plantLabel: "China",
    plantStage: "Smelt / refine",
  },
  {
    metal: "Lithium",
    mineTop1: 37,
    mineLabel: "Australia",
    plantTop1: 70,
    plantLabel: "China",
    plantStage: "Chemicals",
  },
  {
    metal: "Cobalt",
    mineTop1: 74.2,
    mineLabel: "DRC",
    plantTop1: 75,
    plantLabel: "China",
    plantStage: "Refine",
  },
  {
    metal: "Graphite",
    mineTop1: 77.8,
    mineLabel: "China",
    plantTop1: 90,
    plantLabel: "China",
    plantStage: "Anode",
  },
  {
    metal: "REE",
    mineTop1: 69,
    mineLabel: "China",
    plantTop1: 85,
    plantLabel: "China",
    plantStage: "Separate",
  },
];

/** Approximate Lorenz curve of Top-1 shares across ranked stages */
export const CONCENTRATION_CURVE = (() => {
  const ranked = [...COMMODITIES].sort(
    (a, b) => b.top1SharePct - a.top1SharePct,
  );
  const n = ranked.length;
  const equalStep = 100 / n;
  let cumShare = 0;
  const totalTop1 = ranked.reduce((s, c) => s + c.top1SharePct, 0);
  return [
    { rankSharePct: 0, cumTop1MassPct: 0, equalPct: 0, label: "0" },
    ...ranked.map((c, i) => {
      cumShare += c.top1SharePct;
      return {
        rankSharePct: Math.round(((i + 1) / n) * 1000) / 10,
        cumTop1MassPct: Math.round((cumShare / totalTop1) * 1000) / 10,
        equalPct: Math.round((i + 1) * equalStep * 10) / 10,
        label: c.shortLabel,
      };
    }),
  ];
})();

/** Downstream disruption risk dollars (IEA) */
export const DOWNSTREAM_RISK = [
  {
    id: "graphite",
    label: "Graphite anode disruption",
    shortLabel: "Graphite",
    riskUsdBn: 300,
    top1Pct: 90,
    fill: CN,
  },
  {
    id: "ree",
    label: "REE full-chain disruption",
    shortLabel: "REE",
    riskUsdBn: 6500,
    top1Pct: 85,
    fill: MID,
    note: "IEA ~$6.5T framing for full rare-earth trade disruption path",
  },
];

/** Investment vs concentration — diversion of capital while tip stays hot */
export const INVESTMENT_CONTEXT = [
  {
    id: "critical-minerals",
    label: "Critical minerals investment",
    yoyPct: -9,
    note: "IEA aggregate YoY",
  },
  {
    id: "battery-metals",
    label: "Battery metals capex",
    yoyPct: -20,
    note: "Subset pullback",
  },
  {
    id: "lithium",
    label: "Lithium capex",
    yoyPct: -40,
    note: "Deepest cut",
  },
  {
    id: "copper",
    label: "Copper capex",
    yoyPct: 8,
    note: "Only major lift",
  },
  {
    id: "public-finance",
    label: "Public finance support",
    yoyPct: 300,
    note: "~$65B; ~4× vs 2023 (index)",
  },
];

/** Smelter stress meters beside capacity share */
export const SMELTER_STRESS = [
  {
    id: "capacity",
    label: "China capacity share",
    value: 50,
    unit: "%",
    fill: SMELT,
  },
  {
    id: "util-china",
    label: "China utilisation",
    value: 85,
    unit: "%",
    fill: CN,
  },
  {
    id: "util-ex",
    label: "Ex-China utilisation",
    value: 70,
    unit: "%",
    fill: OTHER,
  },
  {
    id: "tcrc",
    label: "2026 TC/RC settle",
    value: 0,
    unit: "$/t",
    fill: MID,
  },
];

export const HHI_BANDS = [
  { id: "extreme", label: "≥ 5,000", min: 5000, fill: CN },
  { id: "high", label: "2,500–4,999", min: 2500, fill: MID },
  { id: "moderate", label: "1,500–2,499", min: 1500, fill: OTHER },
  { id: "plural", label: "< 1,500", min: 0, fill: "#94a3b8" },
];

export function hhiBand(hhi: number): (typeof HHI_BANDS)[number] {
  if (hhi >= 5000) return HHI_BANDS[0]!;
  if (hhi >= 2500) return HHI_BANDS[1]!;
  if (hhi >= 1500) return HHI_BANDS[2]!;
  return HHI_BANDS[3]!;
}

export function filterCommodities(opts: {
  stage?: Stage | "all";
  sector?: Sector | "all";
  direction?: Direction | "all";
}): CommodityShare[] {
  return COMMODITIES.filter((c) => {
    if (opts.stage && opts.stage !== "all" && c.stage !== opts.stage) return false;
    if (
      opts.sector &&
      opts.sector !== "all" &&
      !c.sectors.includes(opts.sector)
    )
      return false;
    if (
      opts.direction &&
      opts.direction !== "all" &&
      c.direction !== opts.direction
    )
      return false;
    return true;
  });
}

export function producerScoreboard(rows: CommodityShare[] = COMMODITIES) {
  const map = new Map<string, { iso: string; label: string; count: number; fill: string }>();
  for (const c of rows) {
    const prev = map.get(c.top1Iso);
    if (prev) prev.count += 1;
    else
      map.set(c.top1Iso, {
        iso: c.top1Iso,
        label: c.top1Label.split(" / ")[0] ?? c.top1Label,
        count: 1,
        fill: c.fill,
      });
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function sectorExposures(rows: CommodityShare[] = COMMODITIES) {
  const sectors: Sector[] = [
    "batteries",
    "semiconductors",
    "magnets",
    "structural",
    "fertilizers",
    "recycling",
  ];
  return sectors.map((sector) => {
    const hit = rows.filter((c) => c.sectors.includes(sector));
    const med =
      hit.length === 0
        ? 0
        : median(hit.map((c) => c.top1SharePct));
    return {
      sector,
      count: hit.length,
      medianTop1: Math.round(med * 10) / 10,
      extremeCount: hit.filter((c) => c.top1SharePct >= 70).length,
    };
  });
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtDelta(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(n % 1 === 0 ? 0 : 1)} pp`;
}

export const SOURCES = [
  {
    label: "IEA — Global Critical Minerals Outlook 2026",
    url: IEA_GCMO_2026_URL,
  },
  {
    label: "USGS — Mineral Commodity Summaries 2026",
    url: USGS_MCS_2026_URL,
  },
  {
    label: "Prior concentration lens (2026)",
    url: PRIOR_CONCENTRATION_PATH,
  },
  {
    label: "Q3 midstream update",
    url: PRIOR_Q3_PATH,
  },
] as const;
