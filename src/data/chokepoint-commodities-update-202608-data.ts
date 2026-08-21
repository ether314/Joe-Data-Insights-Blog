/**
 * Chokepoint commodities — August 2026 vintage update.
 * Prior theme print: IEA GCMO  midstream scoreboard
 * (chokepoint-commodities-update-2026q3).
 * Newest official price / stress vintage: World Bank Pink Sheet
 * (August 4, 2026 release; July 2026 monthly) plus IEA copper-smelter
 * follow-through (spot TC/RC deepening, China cut / capacity halt).
 *
 * Core question: What physical inputs does the economy assume will always be
 * available — and where did the newest price vintage move the thin spots?
 */

export const SOURCE_NOTE =
  "August 2026 vintage delta vs Q3 IEA GCMO print: World Bank Pink Sheet (Aug 4, 2026; July monthly prices) for copper/nickel/aluminum/tin/zinc and fertilizer rock/potash/DAP; IEA copper-smelter commentary + industry settle for spot TC/RC path and China smelter cut / halted planned capacity. MCS 2026 mine shares and IEA refine % holds are anchors, not restated. Price Δ ≠ share Δ — treat as stress meters on the same chokepoints.";

export const PINK_SHEET_URL =
  "https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Pink-Sheet-August-2026.pdf";

export const IEA_GCMO_2026_URL =
  "https://www.iea.org/reports/global-critical-minerals-outlook-2026/executive-summary";

export const IEA_CU_SMELTER_URL =
  "https://www.iea.org/commentaries/copper-prices-have-hit-record-highs-but-smelters-face-mounting-strategic-pressures";

export const USGS_MCS_2026_URL =
  "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026.pdf";

export const SOURCES = [
  {
    label: "World Bank — Pink Sheet August 2026 (July monthly)",
    url: PINK_SHEET_URL,
  },
  {
    label: "IEA — Copper prices & smelter strategic pressures",
    url: IEA_CU_SMELTER_URL,
  },
  {
    label: "IEA — Global Critical Minerals Outlook 2026 (Q3 prior)",
    url: IEA_GCMO_2026_URL,
  },
  {
    label: "USGS — Mineral Commodity Summaries 2026 (mine anchors)",
    url: USGS_MCS_2026_URL,
  },
  {
    label: "Prior Q3 theme update — IEA GCMO midstream delta",
    url: "/blog/chokepoint-commodities-update-2026q3",
  },
  {
    label: "MCS 2026 theme update — mine/refine scoreboard",
    url: "/blog/chokepoint-commodities-update-2026",
  },
] as const;

/** Headline Aug deltas: Pink Sheet July 2026 vs 2025 annual / Q3 narrative */
export const HEADLINE = {
  priorVintage: "IEA GCMO 2026 / Q3 midstream",
  newVintage: "Pink Sheet Aug 2026 (Jul monthly)",
  /** Copper LME $/mt */
  cu2025AnnualUsd: 9947,
  cu2026Q1Usd: 12831,
  cu2026JulUsd: 13543,
  cuYoyPct: 36.2,
  cuVsQ1Pct: 5.5,
  /** Metals & minerals index 2010=100 */
  metalsIdx2025: 112.2,
  metalsIdx2026Q1: 137.1,
  metalsIdx2026May: 148.8,
  metalsIdx2026Jul: 140.5,
  metalsIdxYoyPct: 25.2,
  metalsIdxVsMayPct: -5.6,
  /** Nickel $/mt */
  ni2025AnnualUsd: 15162,
  ni2026MayUsd: 18806,
  ni2026JulUsd: 16651,
  niYoyPct: 9.8,
  niVsMayPct: -11.5,
  /** Aluminum $/mt */
  al2025AnnualUsd: 2632,
  al2026MayUsd: 3666,
  al2026JulUsd: 3161,
  alYoyPct: 20.1,
  /** Tin $/mt — largest base-metal YoY in Pink Sheet set */
  sn2025AnnualUsd: 34059,
  sn2026JulUsd: 52971,
  snYoyPct: 55.5,
  /** Phosphate rock $/mt — fertilizer chokepoint */
  phos2025AnnualUsd: 152.5,
  phos2026JulUsd: 170.0,
  phosYoyPct: 11.5,
  /** Smelter stress deepening vs Q3 $0/t benchmark */
  cuTcRc2026BenchmarkUsd: 0,
  cuTcRcSpotMar2026Usd: -90,
  chinaSmelterCut2026Pct: 10,
  chinaSmelterCutKt: 961,
  chinaHaltedPlannedMt: 2.0,
  /** Held Q3 concentration anchors (not restated) */
  avgRefineExReePct: 72,
  cuSmeltCapacityPct: 50,
  reeRefinePct: 85,
} as const;

export type Stage = "price" | "smelter" | "fertilizer" | "midstream" | "mine";
export type Sector =
  | "structural"
  | "batteries"
  | "fertilizers"
  | "semiconductors"
  | "magnets";
export type Confidence = "disclosed" | "estimated" | "secondary";
export type Direction = "tighter" | "easier" | "flat" | "revised";

export type VintageRow = {
  id: string;
  label: string;
  shortLabel: string;
  stage: Stage;
  sectors: Sector[];
  /** Prior print value (share %, $/mt, index, or fee) */
  priorValue: number;
  /** Newest print value */
  newValue: number;
  /** Signed delta — pp for shares, % for prices, $ for fees */
  delta: number;
  deltaUnit: "pp" | "pct" | "usd" | "index";
  direction: Direction;
  unit: string;
  confidence: Confidence;
  note?: string;
  relatedSlug?: string;
};

/** Core August vintage rows — price + stress meters vs Q3 narrative */
export const VINTAGE_ROWS: VintageRow[] = [
  {
    id: "cu-price-yoy",
    label: "Copper LME price (Jul vs 2025 ann.)",
    shortLabel: "Cu price",
    stage: "price",
    sectors: ["structural", "batteries"],
    priorValue: 9947,
    newValue: 13543,
    delta: 36.2,
    deltaUnit: "pct",
    direction: "tighter",
    unit: "$/mt LME",
    confidence: "disclosed",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Pink Sheet July 2026 $13,543 vs 2025 annual $9,947 — record-adjacent cathode while midstream fees stay broken",
  },
  {
    id: "metals-idx-yoy",
    label: "Metals & minerals index (Jul vs 2025)",
    shortLabel: "Metals idx",
    stage: "price",
    sectors: ["structural"],
    priorValue: 112.2,
    newValue: 140.5,
    delta: 25.2,
    deltaUnit: "pct",
    direction: "tighter",
    unit: "index 2010=100",
    confidence: "disclosed",
    note: "July 140.5 vs 2025 annual 112.2; off May peak 148.8 (−5.6%) but still a high-stress print",
  },
  {
    id: "sn-price-yoy",
    label: "Tin LME price (Jul vs 2025 ann.)",
    shortLabel: "Sn price",
    stage: "price",
    sectors: ["semiconductors", "structural"],
    priorValue: 34059,
    newValue: 52971,
    delta: 55.5,
    deltaUnit: "pct",
    direction: "tighter",
    unit: "$/mt LME",
    confidence: "disclosed",
    note: "Largest YoY among Pink Sheet base metals in this print — solder/electronics chokepoint",
  },
  {
    id: "al-price-yoy",
    label: "Aluminum LME price (Jul vs 2025 ann.)",
    shortLabel: "Al price",
    stage: "price",
    sectors: ["structural"],
    priorValue: 2632,
    newValue: 3161,
    delta: 20.1,
    deltaUnit: "pct",
    direction: "tighter",
    unit: "$/mt LME",
    confidence: "disclosed",
    note: "July still +20% vs 2025 annual after May peak $3,666 cooled",
  },
  {
    id: "ni-price-yoy",
    label: "Nickel LME price (Jul vs 2025 ann.)",
    shortLabel: "Ni price",
    stage: "price",
    sectors: ["batteries", "structural"],
    priorValue: 15162,
    newValue: 16651,
    delta: 9.8,
    deltaUnit: "pct",
    direction: "revised",
    unit: "$/mt LME",
    confidence: "disclosed",
    note: "YoY up but −11.5% from May peak — Indonesia midstream growth capture still the Q3 share story",
  },
  {
    id: "phos-rock-yoy",
    label: "Phosphate rock (Jul vs 2025 ann.)",
    shortLabel: "Phos rock",
    stage: "fertilizer",
    sectors: ["fertilizers"],
    priorValue: 152.5,
    newValue: 170.0,
    delta: 11.5,
    deltaUnit: "pct",
    direction: "tighter",
    unit: "$/mt f.o.b. N. Africa",
    confidence: "disclosed",
    relatedSlug: "phosphate-rock-supply-concentration-2024",
    note: "Flat ~$152.5 through most of 2025–early 2026; July break higher on fertilizer chokepoint",
  },
  {
    id: "dap-yoy",
    label: "DAP fertilizer (Jul vs 2025 ann.)",
    shortLabel: "DAP",
    stage: "fertilizer",
    sectors: ["fertilizers"],
    priorValue: 685.2,
    newValue: 781.3,
    delta: 14.0,
    deltaUnit: "pct",
    direction: "tighter",
    unit: "$/mt f.o.b. US Gulf",
    confidence: "disclosed",
    relatedSlug: "phosphate-fertilizer-export-dependence-2026",
    note: "Processed phosphate gate still pricing stress into food systems",
  },
  {
    id: "potash-yoy",
    label: "Potassium chloride (Jul vs 2025 ann.)",
    shortLabel: "Potash",
    stage: "fertilizer",
    sectors: ["fertilizers"],
    priorValue: 347.5,
    newValue: 396.5,
    delta: 14.1,
    deltaUnit: "pct",
    direction: "tighter",
    unit: "$/mt CFR Brazil",
    confidence: "disclosed",
    note: "Potash YoY rise alongside phosphate — fertilizer trio not quiet",
  },
  {
    id: "cu-spot-tcrc",
    label: "Copper spot TC (vs 2026 $0 benchmark)",
    shortLabel: "Spot TC",
    stage: "smelter",
    sectors: ["structural", "batteries"],
    priorValue: 0,
    newValue: -90,
    delta: -90,
    deltaUnit: "usd",
    direction: "tighter",
    unit: "$/t treatment charge",
    confidence: "estimated",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Q3 GCMO printed $0/t annual settle; spot deepened to about −$90/t (Mar 2026 path) — custom smelters pay to process",
  },
  {
    id: "cu-smelt-cut",
    label: "China Cu smelter cut (2026 plan)",
    shortLabel: "CN cut",
    stage: "smelter",
    sectors: ["structural"],
    priorValue: 0,
    newValue: 10,
    delta: 10,
    deltaUnit: "pp",
    direction: "revised",
    unit: "% planned primary cut (~961 kt)",
    confidence: "estimated",
    note: "IEA: top Chinese smelters agreed >10% cut; not enough to rebalance TC/RCs for custom peers outside China",
  },
  {
    id: "cu-halted-cap",
    label: "China halted planned Cu smelt capacity",
    shortLabel: "Halt Mt",
    stage: "smelter",
    sectors: ["structural"],
    priorValue: 0,
    newValue: 2.0,
    delta: 2.0,
    deltaUnit: "usd",
    direction: "revised",
    unit: "Mt planned capacity halted",
    confidence: "estimated",
    note: "~2 Mt of planned new Chinese smelting capacity halted — slows further concentration but does not reopen custom margins",
  },
  {
    id: "avg-refine-hold",
    label: "Avg top refine (ex-REE) — Q3 hold",
    shortLabel: "Avg refine",
    stage: "midstream",
    sectors: ["batteries", "structural"],
    priorValue: 72,
    newValue: 72,
    delta: 0,
    deltaUnit: "pp",
    direction: "flat",
    unit: "% avg top refining-country share",
    confidence: "secondary",
    note: "No newer IEA refine reprint this month — hold GCMO 72% while Pink Sheet prices the stress",
  },
  {
    id: "cu-smelt-share-hold",
    label: "China Cu smelting capacity — Q3 hold",
    shortLabel: "Cu smelt %",
    stage: "smelter",
    sectors: ["structural", "batteries"],
    priorValue: 50,
    newValue: 50,
    delta: 0,
    deltaUnit: "pp",
    direction: "flat",
    unit: "% global smelting capacity",
    confidence: "secondary",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Share hold at ~50%; August move is fee path + cut/halt response, not a new capacity census",
  },
  {
    id: "ree-refine-hold",
    label: "REE refining — Q3 hold",
    shortLabel: "REE refine",
    stage: "midstream",
    sectors: ["magnets", "semiconductors"],
    priorValue: 85,
    newValue: 85,
    delta: 0,
    deltaUnit: "pp",
    direction: "flat",
    unit: "% top supplier refining share",
    confidence: "secondary",
    relatedSlug: "rare-earth-mine-concentration-2024",
    note: "Diversification exception still at 85%; Pink Sheet does not restate REE refine — magnets remain the thin gate",
  },
];

/** Monthly / quarterly price path for line charts (Pink Sheet Aug 2026) */
export type PricePathPoint = {
  period: string;
  sort: number;
  copper: number;
  nickel: number;
  aluminum: number;
  tin: number;
  zinc: number;
  metalsIdx: number;
};

export const PRICE_PATH: PricePathPoint[] = [
  {
    period: "2023",
    sort: 1,
    copper: 8490,
    nickel: 21521,
    aluminum: 2256,
    tin: 25938,
    zinc: 2653,
    metalsIdx: 104.0,
  },
  {
    period: "2024",
    sort: 2,
    copper: 9142,
    nickel: 16814,
    aluminum: 2419,
    tin: 30066,
    zinc: 2776,
    metalsIdx: 106.7,
  },
  {
    period: "2025",
    sort: 3,
    copper: 9947,
    nickel: 15162,
    aluminum: 2632,
    tin: 34059,
    zinc: 2868,
    metalsIdx: 112.2,
  },
  {
    period: "2025 Q4",
    sort: 4,
    copper: 11112,
    nickel: 14882,
    aluminum: 2829,
    tin: 38065,
    zinc: 3166,
    metalsIdx: 121.8,
  },
  {
    period: "2026 Q1",
    sort: 5,
    copper: 12831,
    nickel: 17339,
    aluminum: 3193,
    tin: 48519,
    zinc: 3240,
    metalsIdx: 137.1,
  },
  {
    period: "2026 Q2",
    sort: 6,
    copper: 13349,
    nickel: 18119,
    aluminum: 3568,
    tin: 51802,
    zinc: 3462,
    metalsIdx: 145.7,
  },
  {
    period: "May",
    sort: 7,
    copper: 13543,
    nickel: 18806,
    aluminum: 3666,
    tin: 53563,
    zinc: 3482,
    metalsIdx: 148.8,
  },
  {
    period: "Jun",
    sort: 8,
    copper: 13552,
    nickel: 17588,
    aluminum: 3439,
    tin: 53037,
    zinc: 3539,
    metalsIdx: 144.6,
  },
  {
    period: "Jul",
    sort: 9,
    copper: 13543,
    nickel: 16651,
    aluminum: 3161,
    tin: 52971,
    zinc: 3599,
    metalsIdx: 140.5,
  },
];

export type YoyDeltaRow = {
  id: string;
  label: string;
  shortLabel: string;
  yoyPct: number;
  priorUsd: number;
  newUsd: number;
  stage: Stage;
  direction: Direction;
};

export const YOY_DELTAS: YoyDeltaRow[] = [
  {
    id: "tin",
    label: "Tin",
    shortLabel: "Sn",
    yoyPct: 55.5,
    priorUsd: 34059,
    newUsd: 52971,
    stage: "price",
    direction: "tighter",
  },
  {
    id: "copper",
    label: "Copper",
    shortLabel: "Cu",
    yoyPct: 36.2,
    priorUsd: 9947,
    newUsd: 13543,
    stage: "price",
    direction: "tighter",
  },
  {
    id: "metals-idx",
    label: "Metals & minerals idx",
    shortLabel: "Metals",
    yoyPct: 25.2,
    priorUsd: 112.2,
    newUsd: 140.5,
    stage: "price",
    direction: "tighter",
  },
  {
    id: "aluminum",
    label: "Aluminum",
    shortLabel: "Al",
    yoyPct: 20.1,
    priorUsd: 2632,
    newUsd: 3161,
    stage: "price",
    direction: "tighter",
  },
  {
    id: "potash",
    label: "Potash (KCl)",
    shortLabel: "KCl",
    yoyPct: 14.1,
    priorUsd: 347.5,
    newUsd: 396.5,
    stage: "fertilizer",
    direction: "tighter",
  },
  {
    id: "dap",
    label: "DAP",
    shortLabel: "DAP",
    yoyPct: 14.0,
    priorUsd: 685.2,
    newUsd: 781.3,
    stage: "fertilizer",
    direction: "tighter",
  },
  {
    id: "phos",
    label: "Phosphate rock",
    shortLabel: "Phos",
    yoyPct: 11.5,
    priorUsd: 152.5,
    newUsd: 170.0,
    stage: "fertilizer",
    direction: "tighter",
  },
  {
    id: "nickel",
    label: "Nickel",
    shortLabel: "Ni",
    yoyPct: 9.8,
    priorUsd: 15162,
    newUsd: 16651,
    stage: "price",
    direction: "revised",
  },
  {
    id: "zinc",
    label: "Zinc",
    shortLabel: "Zn",
    yoyPct: 25.5,
    priorUsd: 2868,
    newUsd: 3599,
    stage: "price",
    direction: "tighter",
  },
];

export type SmelterResponseRow = {
  id: string;
  label: string;
  shortLabel: string;
  value: number;
  unit: string;
  note: string;
};

export const SMELTER_RESPONSE: SmelterResponseRow[] = [
  {
    id: "benchmark-tcrc",
    label: "2026 annual TC/RC settle",
    shortLabel: "Benchmark TC",
    value: 0,
    unit: "$/t",
    note: "Q3 GCMO headline — lowest annual settle ever",
  },
  {
    id: "spot-tcrc",
    label: "Spot TC path (Mar 2026)",
    shortLabel: "Spot TC",
    value: -90,
    unit: "$/t",
    note: "Deepened below zero — custom smelters pay for concentrate",
  },
  {
    id: "china-cut-pct",
    label: "China planned primary cut",
    shortLabel: "Cut %",
    value: 10,
    unit: "%",
    note: ">10% agreed cut (~961 kt refined foregone if delivered)",
  },
  {
    id: "halted-mt",
    label: "Halted planned capacity",
    shortLabel: "Halt Mt",
    value: 2.0,
    unit: "Mt",
    note: "Government halt on ~2 Mt planned new Chinese smelting",
  },
];

export type FertilizerPathPoint = {
  period: string;
  sort: number;
  phosphateRock: number;
  potash: number;
  dap: number;
};

export const FERTILIZER_PATH: FertilizerPathPoint[] = [
  { period: "2023", sort: 1, phosphateRock: 321.7, potash: 383.2, dap: 550.0 },
  { period: "2024", sort: 2, phosphateRock: 152.5, potash: 295.1, dap: 563.7 },
  { period: "2025", sort: 3, phosphateRock: 152.5, potash: 347.5, dap: 685.2 },
  { period: "2026 Q1", sort: 4, phosphateRock: 152.5, potash: 373.0, dap: 634.7 },
  { period: "2026 Q2", sort: 5, phosphateRock: 154.0, potash: 402.9, dap: 759.5 },
  { period: "May", sort: 6, phosphateRock: 152.5, potash: 405.0, dap: 769.5 },
  { period: "Jun", sort: 7, phosphateRock: 156.9, potash: 402.5, dap: 783.8 },
  { period: "Jul", sort: 8, phosphateRock: 170.0, potash: 396.5, dap: 781.3 },
];

/** Scatter: YoY price stress vs Q3 concentration hold (where available) */
export type StressScatterPoint = {
  id: string;
  label: string;
  yoyPct: number;
  concentrationPct: number;
  stage: Stage;
};

export const STRESS_SCATTER: StressScatterPoint[] = [
  {
    id: "copper",
    label: "Copper",
    yoyPct: 36.2,
    concentrationPct: 50,
    stage: "smelter",
  },
  {
    id: "nickel",
    label: "Nickel",
    yoyPct: 9.8,
    concentrationPct: 75,
    stage: "midstream",
  },
  {
    id: "tin",
    label: "Tin",
    yoyPct: 55.5,
    concentrationPct: 50,
    stage: "price",
  },
  {
    id: "aluminum",
    label: "Aluminum",
    yoyPct: 20.1,
    concentrationPct: 58,
    stage: "price",
  },
  {
    id: "phosphate",
    label: "Phos rock",
    yoyPct: 11.5,
    concentrationPct: 70,
    stage: "fertilizer",
  },
  {
    id: "potash",
    label: "Potash",
    yoyPct: 14.1,
    concentrationPct: 40,
    stage: "fertilizer",
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
  return [...rows].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
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

export function filterYoy(
  rows: YoyDeltaRow[],
  opts: { stage?: Stage | "all"; direction?: Direction | "all" },
): YoyDeltaRow[] {
  return rows.filter((r) => {
    if (opts.stage && opts.stage !== "all" && r.stage !== opts.stage) return false;
    if (opts.direction && opts.direction !== "all" && r.direction !== opts.direction)
      return false;
    return true;
  });
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtUsd(n: number): string {
  if (Math.abs(n) >= 1000) return `$${n.toLocaleString("en-US")}`;
  return `$${n.toFixed(0)}`;
}

export function fmtDelta(row: VintageRow): string {
  if (row.deltaUnit === "pct") return fmtPct(row.delta);
  if (row.deltaUnit === "pp") return fmtPp(row.delta);
  if (row.deltaUnit === "usd") {
    const sign = row.delta > 0 ? "+" : "";
    return `${sign}${row.delta}`;
  }
  return String(row.delta);
}
