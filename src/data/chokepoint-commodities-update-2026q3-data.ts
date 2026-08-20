/**
 * Chokepoint commodities — Q3 2026 vintage update.
 * Prior theme print: USGS MCS 2026 v1.3 (May 2026 / 2025e) as used in
 * chokepoint-commodities-update-2026 (secondary IEA/research midstream carries).
 * Newest official midstream/security vintage: IEA Global Critical Minerals
 * Outlook 2026 (refining concentration, smelter stress, investment, export-control risk).
 *
 * Core question: What physical inputs does the economy assume will always be
 * available — and where did the newest print move the thin spots?
 */

export const SOURCE_NOTE =
  "Q3 vintage delta vs prior update (USGS MCS 2026 v1.3 / May 2026 secondary midstream carries): IEA Global Critical Minerals Outlook 2026 refining concentration, copper-smelter stress, investment YoY, and export-control downstream-risk estimates. Mine shares for copper/graphite/cobalt/lithium remain MCS 2026 anchors unless noted. IEA and USGS definitions differ — treat cross-agency Δ as directional, not identical accounting.";

export const IEA_GCMO_2026_URL =
  "https://www.iea.org/reports/global-critical-minerals-outlook-2026/executive-summary";

export const IEA_NEWS_URL =
  "https://www.iea.org/news/supply-concentration-export-restrictions-and-declining-investment-put-critical-mineral-security-at-risk";

export const USGS_MCS_2026_URL =
  "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026.pdf";

export const SOURCES = [
  {
    label: "IEA — Global Critical Minerals Outlook 2026 (executive summary)",
    url: IEA_GCMO_2026_URL,
  },
  {
    label: "IEA — Supply concentration & export restrictions (2026 news)",
    url: IEA_NEWS_URL,
  },
  {
    label: "USGS — Mineral Commodity Summaries 2026 (v1.3 prior print)",
    url: USGS_MCS_2026_URL,
  },
  {
    label: "Prior theme update — MCS 2026 vintage delta",
    url: "/blog/chokepoint-commodities-update-2026",
  },
  {
    label: "Theme research — chokepoint commodities ledger",
    url: "/blog/chokepoint-commodities-research-2026",
  },
] as const;

/** Headline Q3 deltas vs prior MCS update / secondary carries */
export const HEADLINE = {
  priorVintage: "MCS 2026 update / secondary midstream",
  newVintage: "IEA GCMO 2026",
  /** Ex-REE average top refining-country share */
  avgRefinePriorPct: 70,
  avgRefineNewPct: 72,
  avgRefineDeltaPp: 2,
  avgRefinePriorYear: 2023,
  avgRefineNewYear: 2025,
  /** Rare-earth refining / separation top supplier */
  reeRefinePriorPct: 90,
  reeRefineNewPct: 85,
  reeRefineDeltaPp: -5,
  reeRefine2035PathPct: 70,
  /** China copper smelting capacity share path */
  cuSmeltCapacity2005Pct: 15,
  cuSmeltCapacity2025Pct: 50,
  cuSmeltGrowthFromChinaPct: 90,
  /** Utilisation 2025 */
  cuUtilOutsideChinaPct: 70,
  cuUtilChinaPct: 85,
  /** TC/RC annual settle */
  cuTcRc2026UsdPerT: 0,
  /** Copper 2035 project-pipeline deficit (IEA) */
  cuDeficit2035PriorPct: 30,
  cuDeficit2035NewPct: 25,
  cuDeficitDeltaPp: -5,
  /** Lithium chemicals top-1 (prior secondary → IEA 2026 narrative) */
  liChemPriorPct: 65,
  liChemNewPct: 70,
  liChemDeltaPp: 5,
  /** Cobalt refine (prior MCS carry → IEA ~75%) */
  coRefinePriorPct: 76,
  coRefineNewPct: 75,
  coRefineDeltaPp: -1,
  /** Graphite anode / battery-grade processing */
  graphiteAnodePriorPct: 90,
  graphiteAnodeNewPct: 90,
  graphiteAnodeDeltaPp: 0,
  graphiteDownstreamRiskUsdBn: 300,
  reeDownstreamRiskUsdTn: 6.5,
  /** Investment */
  investmentYoYPct: -9,
  batteryMetalsCapexYoYPct: -20,
  lithiumCapexYoYPct: -40,
  copperCapexYoYPct: 8,
  publicFinanceUsdBn: 65,
  publicFinanceVs2023Mult: 4,
  /** Recycling concentration */
  batteryPretreatmentChinaPct: 75,
  batteryRecoveryChinaPct: 90,
  /** Price stress (Europe vs China domestic multiples) */
  galliumEuropePriceMultiple: 5,
  hreeEuropePriceMultiple: 5,
  germaniumEuropePriceMultiple: 3,
  tungstenPriceMultipleVsTrough: 6,
} as const;

export type Stage = "mine" | "midstream" | "smelter" | "policy";
export type Sector =
  | "batteries"
  | "semiconductors"
  | "magnets"
  | "structural"
  | "fertilizers"
  | "recycling";

export type Confidence = "disclosed" | "estimated" | "secondary";
export type Direction = "tighter" | "easier" | "flat" | "revised";

export type VintageRow = {
  id: string;
  label: string;
  shortLabel: string;
  stage: Stage;
  sectors: Sector[];
  top1Label: string;
  /** Prior print / secondary carry (%) */
  priorTop1Pct: number;
  /** IEA GCMO 2026 / newest (%) */
  newTop1Pct: number;
  deltaPp: number;
  direction: Direction;
  unit: string;
  confidence: Confidence;
  note?: string;
  relatedSlug?: string;
};

/** Core midstream / concentration rows with measurable Q3 vintage deltas */
export const VINTAGE_ROWS: VintageRow[] = [
  {
    id: "avg-refine-ex-ree",
    label: "Avg top refining country (ex-REE)",
    shortLabel: "Avg refine",
    stage: "midstream",
    sectors: ["batteries", "structural"],
    top1Label: "China / Indonesia mix",
    priorTop1Pct: 70,
    newTop1Pct: 72,
    deltaPp: 2,
    direction: "tighter",
    unit: "% avg top refining-country share (IEA; 2023→2025)",
    confidence: "disclosed",
    note: "IEA: excluding rare earths, average top refining-country share rose to 72% in 2025 from 70% in 2023",
  },
  {
    id: "ree-refine",
    label: "Rare-earth refining / separation",
    shortLabel: "REE refine",
    stage: "midstream",
    sectors: ["magnets", "semiconductors"],
    top1Label: "China",
    priorTop1Pct: 90,
    newTop1Pct: 85,
    deltaPp: -5,
    direction: "easier",
    unit: "% top supplier refining share",
    confidence: "disclosed",
    relatedSlug: "rare-earth-mine-concentration-2024",
    note: "US + Malaysia projects cut top-supplier share from >90% (2023) to 85% (2025); path ~70% by 2035 if announced projects deliver",
  },
  {
    id: "copper-smelt-capacity",
    label: "Copper smelting capacity (China)",
    shortLabel: "Cu smelt",
    stage: "smelter",
    sectors: ["structural", "batteries"],
    top1Label: "China",
    priorTop1Pct: 15,
    newTop1Pct: 50,
    deltaPp: 35,
    direction: "tighter",
    unit: "% global copper smelting capacity (2005→2025 path)",
    confidence: "disclosed",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "China >90% of global copper-smelting capacity growth since 2005; MCS refine share ~48% sits inside this smelter story",
  },
  {
    id: "copper-refine-mcs",
    label: "Copper refining (MCS vs IEA)",
    shortLabel: "Cu refine",
    stage: "midstream",
    sectors: ["structural", "batteries"],
    top1Label: "China",
    priorTop1Pct: 48.3,
    newTop1Pct: 50,
    deltaPp: 1.7,
    direction: "tighter",
    unit: "% world refined copper (MCS 2026 → IEA ~just-under-50%)",
    confidence: "estimated",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Prior update MCS 2026 China refine ~48.3%; IEA GCMO 2026 frames China just under ~50% of global copper refining",
  },
  {
    id: "lithium-chem",
    label: "Lithium chemical refining",
    shortLabel: "Li chem",
    stage: "midstream",
    sectors: ["batteries"],
    top1Label: "China",
    priorTop1Pct: 65,
    newTop1Pct: 70,
    deltaPp: 5,
    direction: "tighter",
    unit: "% lithium chemical / refining capacity",
    confidence: "estimated",
    note: "Prior secondary carry ~65%; IEA 2026 processing narrative ~70% China lithium refining",
  },
  {
    id: "cobalt-refine",
    label: "Cobalt refining",
    shortLabel: "Co refine",
    stage: "midstream",
    sectors: ["batteries"],
    top1Label: "China",
    priorTop1Pct: 76,
    newTop1Pct: 75,
    deltaPp: -1,
    direction: "flat",
    unit: "% refined cobalt",
    confidence: "estimated",
    note: "Share roughly flat; IEA flags a new cobalt supply-gap risk from DRC export quotas — volume risk ≠ share relief",
  },
  {
    id: "graphite-anode",
    label: "Battery-grade graphite anode",
    shortLabel: "Graphite anode",
    stage: "midstream",
    sectors: ["batteries"],
    top1Label: "China",
    priorTop1Pct: 90,
    newTop1Pct: 90,
    deltaPp: 0,
    direction: "flat",
    unit: "% battery-grade anode / processing",
    confidence: "estimated",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    note: "Share still ≥90%; IEA: virtually all recent graphite supply growth from the dominant supplier; full trade disruption risks ~$300B/yr downstream outside China",
  },
  {
    id: "nickel-refine-growth",
    label: "Nickel refined-supply growth capture",
    shortLabel: "Ni growth",
    stage: "midstream",
    sectors: ["batteries", "structural"],
    top1Label: "Indonesia",
    priorTop1Pct: 50,
    newTop1Pct: 75,
    deltaPp: 25,
    direction: "tighter",
    unit: "% of recent refined-supply growth from top refiners (ID Ni + CN peers)",
    confidence: "estimated",
    note: "IEA: top refiners (Indonesia for nickel; China for other energy minerals) captured >75% of refined-supply growth over two years",
  },
  {
    id: "battery-recycle-recovery",
    label: "Battery material-recovery capacity",
    shortLabel: "Batt recycle",
    stage: "midstream",
    sectors: ["recycling", "batteries"],
    top1Label: "China",
    priorTop1Pct: 70,
    newTop1Pct: 90,
    deltaPp: 20,
    direction: "tighter",
    unit: "% global material-recovery capacity",
    confidence: "disclosed",
    note: "IEA: China >75% pre-treatment and ~90% material-recovery capacity — secondary supply is also concentrated",
  },
  {
    id: "graphite-mine-mcs",
    label: "Natural graphite mine (MCS anchor)",
    shortLabel: "Graphite mine",
    stage: "mine",
    sectors: ["batteries"],
    top1Label: "China",
    priorTop1Pct: 77.8,
    newTop1Pct: 77.8,
    deltaPp: 0,
    direction: "flat",
    unit: "% world mine tons (MCS 2026 hold)",
    confidence: "secondary",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    note: "No newer USGS MIS vintage (posting paused); hold MCS 2026 mine share while midstream risk narrative tightens",
  },
  {
    id: "cobalt-mine-mcs",
    label: "Cobalt mine (MCS + DRC quota risk)",
    shortLabel: "Co mine",
    stage: "mine",
    sectors: ["batteries"],
    top1Label: "Congo (Kinshasa)",
    priorTop1Pct: 74.2,
    newTop1Pct: 74.2,
    deltaPp: 0,
    direction: "revised",
    unit: "% world mine cobalt (share flat; outlook revised)",
    confidence: "secondary",
    note: "Share still ~74% DRC; IEA revises decade outlook — new cobalt supply gap from DRC export quota",
  },
  {
    id: "copper-mine-mcs",
    label: "Copper mine (MCS anchor)",
    shortLabel: "Cu mine",
    stage: "mine",
    sectors: ["structural", "batteries"],
    top1Label: "Chile",
    priorTop1Pct: 23,
    newTop1Pct: 23,
    deltaPp: 0,
    direction: "flat",
    unit: "% world mine copper",
    confidence: "secondary",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Mine map still plural; Q3 stress is smelter fees/utilisation and midstream capacity, not Chilean pit share",
  },
];

export type SmelterStressRow = {
  id: string;
  label: string;
  outsideChina: number;
  china: number;
  unit: string;
  note: string;
};

export const SMELTER_STRESS: SmelterStressRow[] = [
  {
    id: "utilisation-2025",
    label: "Cu smelter utilisation (2025)",
    outsideChina: 70,
    china: 85,
    unit: "% utilisation",
    note: "Outside-China utilisation fell below ~70% while China stayed ~85%",
  },
  {
    id: "capacity-share",
    label: "Cu smelting capacity share",
    outsideChina: 50,
    china: 50,
    unit: "% global capacity (2025)",
    note: "China capacity share ~50% by 2025 vs ~15% in 2005",
  },
];

export type InvestmentDelta = {
  id: string;
  label: string;
  yoyPct: number;
  direction: Direction;
  note: string;
};

export const INVESTMENT_DELTAS: InvestmentDelta[] = [
  {
    id: "all-critical",
    label: "Critical mineral investment",
    yoyPct: -9,
    direction: "revised",
    note: "Ended multi-year growth streak in 2025",
  },
  {
    id: "battery-metals",
    label: "Battery-metals capex",
    yoyPct: -20,
    direction: "tighter",
    note: "Largest pullback in over a decade",
  },
  {
    id: "lithium",
    label: "Lithium company investment",
    yoyPct: -40,
    direction: "tighter",
    note: "Sharpest commodity-class cut",
  },
  {
    id: "copper",
    label: "Copper-focused spending",
    yoyPct: 8,
    direction: "easier",
    note: "Only major class still adding capital",
  },
  {
    id: "exploration",
    label: "Exploration spending",
    yoyPct: -10,
    direction: "tighter",
    note: "Li/Ni exploration ~−45%; Asia-Pacific +20% exception",
  },
];

export type RiskDollarRow = {
  id: string;
  label: string;
  shortLabel: string;
  riskUsdBn: number;
  trigger: string;
  confidence: Confidence;
};

export const RISK_DOLLARS: RiskDollarRow[] = [
  {
    id: "ree-downstream",
    label: "Downstream production at risk (expanded REE controls)",
    shortLabel: "REE cascade",
    riskUsdBn: 6500,
    trigger: "Full implementation of Oct 2025 expanded REE measures",
    confidence: "disclosed",
  },
  {
    id: "graphite-downstream",
    label: "Downstream production at risk (battery-grade graphite)",
    shortLabel: "Graphite trade",
    riskUsdBn: 300,
    trigger: "Full disruption of battery-grade graphite trade",
    confidence: "disclosed",
  },
  {
    id: "stockpile-cost",
    label: "Net annual stockpile cost (11 high-risk materials)",
    shortLabel: "Stockpile buffer",
    riskUsdBn: 0.9,
    trigger: "IEA high-risk materials buffer outside dominant supplier",
    confidence: "disclosed",
  },
];

export type SupplyGapRow = {
  id: string;
  label: string;
  priorGapPct: number | null;
  newGapPct: number | null;
  deltaPp: number | null;
  direction: Direction;
  note: string;
};

export const SUPPLY_GAPS: SupplyGapRow[] = [
  {
    id: "copper-2035",
    label: "Copper deficit (2035 pipeline)",
    priorGapPct: 30,
    newGapPct: 25,
    deltaPp: -5,
    direction: "easier",
    note: "Narrowed as DRC/Zambia projects advance — still a deficit",
  },
  {
    id: "lithium-2035",
    label: "Lithium deficit (2035)",
    priorGapPct: null,
    newGapPct: null,
    deltaPp: null,
    direction: "easier",
    note: "IEA: deficits persist through 2035 but outlook improved vs prior Outlook",
  },
  {
    id: "cobalt-quota",
    label: "Cobalt supply gap (new)",
    priorGapPct: 0,
    newGapPct: null,
    deltaPp: null,
    direction: "tighter",
    note: "New projected gap from DRC export quota — policy shock in a ~74% mine monopoly",
  },
];

export type PriceStressRow = {
  id: string;
  label: string;
  multiple: number;
  unit: string;
  note: string;
};

export const PRICE_STRESS: PriceStressRow[] = [
  {
    id: "gallium-eu",
    label: "Gallium (Europe vs China domestic)",
    multiple: 5,
    unit: "× China domestic",
    note: "Export-control price divergence",
  },
  {
    id: "hree-eu",
    label: "Heavy REE Dy/Tb (Europe vs China)",
    multiple: 5,
    unit: "× China domestic",
    note: "April/Oct 2025 control cycle",
  },
  {
    id: "germanium-eu",
    label: "Germanium (Europe vs China)",
    multiple: 3,
    unit: "× China domestic",
    note: "Strategic minor mineral divergence",
  },
  {
    id: "tungsten-rally",
    label: "Tungsten price vs recent trough",
    multiple: 6,
    unit: "× trough",
    note: "Strategic minors rally through 2025–early 2026",
  },
];

export type DeltaBucket = {
  id: Direction;
  label: string;
  count: number;
  color: string;
};

export function deltaBuckets(rows = VINTAGE_ROWS): DeltaBucket[] {
  const counts: Record<Direction, number> = {
    tighter: 0,
    easier: 0,
    flat: 0,
    revised: 0,
  };
  for (const r of rows) counts[r.direction] += 1;
  return [
    { id: "tighter", label: "Tighter", count: counts.tighter, color: "#ea580c" },
    { id: "easier", label: "Easier", count: counts.easier, color: "#14b8a6" },
    { id: "flat", label: "Flat", count: counts.flat, color: "#64748b" },
    { id: "revised", label: "Revised", count: counts.revised, color: "#a78bfa" },
  ];
}

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

export function fmtUsdBn(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}T`;
  if (n >= 1) return `$${n.toFixed(0)}B`;
  return `$${(n * 1000).toFixed(0)}M`;
}
