/**
 * Chokepoint commodities — August 202608 concentration / market-share lens.
 * Core question: How concentrated is this system at the top of the distribution?
 * What physical inputs does the economy assume will always be available — and
 * where is supply thin once Pink Sheet Jul’26 prices and copper-smelter stress
 * sit beside the Q3 IEA/MCS share ladder?
 *
 * Complements:
 * - concentration-2026q3 (IEA GCMO 2026 midstream Top-1·Top-3·HHI restatement)
 * - update-202608 (Pink Sheet / spot TC stress — price Δ ≠ share Δ)
 * - concentration-2026 / research-2026 / update-2026q3
 *
 * Primary: IEA GCMO 2026 shares (held); USGS MCS 2026 mine anchors (held);
 * World Bank Pink Sheet Aug 4 2026 (July monthly); IEA copper-smelter commentary.
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
export type StressBand = "extreme" | "high" | "elevated" | "quiet";
export type Direction = "tighter" | "easier" | "flat";

export const SOURCE_NOTE =
  "Aug 202608 concentration vintage: share ladder held from concentration-2026q3 (IEA GCMO 2026 midstream + MCS 2026 v1.3 mine anchors). Pink Sheet Aug 4 2026 (July monthly) and IEA copper-smelter follow-through overlay stress meters — price YoY and spot TC/RC are not share restatements. Binding-tip score = Top-1 share × stress weight (analytical). Top-3/HHI on country shares remain derived/estimated where IEA discloses only Top-1. Cross-agency Δ is directional.";

export const IEA_GCMO_2026_URL =
  "https://www.iea.org/reports/global-critical-minerals-outlook-2026/executive-summary";
export const USGS_MCS_2026_URL =
  "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026.pdf";
export const PINK_SHEET_URL =
  "https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Pink-Sheet-August-2026.pdf";
export const IEA_CU_SMELTER_URL =
  "https://www.iea.org/commentaries/copper-prices-have-hit-record-highs-but-smelters-face-mounting-strategic-pressures";

export const PRIOR_Q3_CONC_PATH =
  "/blog/chokepoint-commodities-concentration-2026q3";
export const PRIOR_CONCENTRATION_PATH =
  "/blog/chokepoint-commodities-concentration-2026";
export const PRIOR_AUG_UPDATE_PATH =
  "/blog/chokepoint-commodities-update-202608";
export const PRIOR_Q3_UPDATE_PATH =
  "/blog/chokepoint-commodities-update-2026q3";
export const PRIOR_RESEARCH_PATH = "/blog/chokepoint-commodities-research-2026";
export const COPPER_GEO_PATH = "/blog/copper-mine-vs-refinery-geography-2026";
export const GRAPHITE_PATH = "/blog/natural-graphite-mine-concentration-2024";
export const PHOS_EXPORT_PATH =
  "/blog/phosphate-fertilizer-export-dependence-2026";

const CN = "#f43f5e";
const OTHER = "#0ea5e9";
const MID = "#f59e0b";
const SMELT = "#8b5cf6";
const RECYCLE = "#14b8a6";
const SLATE = "#94a3b8";

export type CommodityShare = {
  id: string;
  label: string;
  shortLabel: string;
  stage: Stage;
  sectors: Sector[];
  /** Q3 concentration Top-1 % (held) */
  top1SharePct: number;
  top1Label: string;
  top1Iso: string;
  top3SharePct: number;
  top3Labels: string;
  hhi: number;
  /** vs concentration-2026 prior ladder (pp) — held from Q3 */
  q3DeltaPp: number;
  direction: Direction;
  usNetImportReliancePct: number;
  substitutionDifficulty: number;
  /** Pink Sheet / smelter stress overlay (null = no Aug price print) */
  priceYoyPct: number | null;
  stressBand: StressBand;
  /** Analytical binding tip: top1 × stressWeight / 100 */
  bindingScore: number;
  confidence: Confidence;
  relatedSlug?: string;
  note?: string;
  fill: string;
};

/** Stress weight for binding score (analytical, not a disclosed index) */
export function stressWeight(band: StressBand): number {
  switch (band) {
    case "extreme":
      return 1.35;
    case "high":
      return 1.15;
    case "elevated":
      return 1.0;
    default:
      return 0.85;
  }
}

function binding(top1: number, band: StressBand): number {
  return Math.round(top1 * stressWeight(band) * 10) / 10;
}

/**
 * Cross-stage concentration table — Q3 shares held + Aug stress overlay.
 * priceYoyPct from Pink Sheet Jul’26 vs 2025 annual where mapped; null otherwise.
 */
export const COMMODITIES: CommodityShare[] = [
  {
    id: "gallium-refine",
    label: "Gallium (refined)",
    shortLabel: "Gallium",
    stage: "midstream",
    sectors: ["semiconductors"],
    top1SharePct: 99,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 99.5,
    top3Labels: "China + Russia + Japan",
    hhi: 9801,
    q3DeltaPp: 1,
    direction: "tighter",
    usNetImportReliancePct: 100,
    substitutionDifficulty: 5,
    priceYoyPct: null,
    stressBand: "extreme",
    bindingScore: binding(99, "extreme"),
    confidence: "estimated",
    note: "Near-monopoly tip; no Pink Sheet print — stress is substitution / Europe price multiple",
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
    q3DeltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 100,
    substitutionDifficulty: 5,
    priceYoyPct: null,
    stressBand: "extreme",
    bindingScore: binding(90, "extreme"),
    confidence: "estimated",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    note: "IEA ≥90% hold; ~$300B/yr downstream disruption framing outside China",
    fill: CN,
  },
  {
    id: "battery-recovery",
    label: "Battery material-recovery capacity",
    shortLabel: "Batt recovery",
    stage: "recycle",
    sectors: ["recycling", "batteries"],
    top1SharePct: 90,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 96,
    top3Labels: "China + EU pilots + Korea",
    hhi: 8200,
    q3DeltaPp: 20,
    direction: "tighter",
    usNetImportReliancePct: 100,
    substitutionDifficulty: 4,
    priceYoyPct: null,
    stressBand: "high",
    bindingScore: binding(90, "high"),
    confidence: "disclosed",
    note: "Secondary supply is also concentrated — recovery capacity ~90%",
    fill: RECYCLE,
  },
  {
    id: "rare-earth-separate",
    label: "Rare-earth refining / separation",
    shortLabel: "REE refine",
    stage: "midstream",
    sectors: ["magnets", "semiconductors"],
    top1SharePct: 85,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 96,
    top3Labels: "China + Malaysia + United States",
    hhi: 7400,
    q3DeltaPp: -5,
    direction: "easier",
    usNetImportReliancePct: 80,
    substitutionDifficulty: 5,
    priceYoyPct: null,
    stressBand: "extreme",
    bindingScore: binding(85, "extreme"),
    confidence: "disclosed",
    relatedSlug: "rare-earth-mine-concentration-2024",
    note: "Q3 eased 5 pp on US/Malaysia projects; tip still extreme; IEA ~$6.5T full-chain disruption framing",
    fill: CN,
  },
  {
    id: "graphite-mine",
    label: "Natural graphite (mine)",
    shortLabel: "Graphite mine",
    stage: "mine",
    sectors: ["batteries"],
    top1SharePct: 77.8,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 89,
    top3Labels: "China + Madagascar + Mozambique",
    hhi: 6200,
    q3DeltaPp: -1.6,
    direction: "easier",
    usNetImportReliancePct: 100,
    substitutionDifficulty: 4,
    priceYoyPct: null,
    stressBand: "high",
    bindingScore: binding(77.8, "high"),
    confidence: "secondary",
    relatedSlug: "natural-graphite-mine-concentration-2024",
    note: "Mine eases slightly; anode midstream remains the binding tip",
    fill: CN,
  },
  {
    id: "cobalt-refine",
    label: "Cobalt (refined)",
    shortLabel: "Co refine",
    stage: "midstream",
    sectors: ["batteries"],
    top1SharePct: 75,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 90,
    top3Labels: "China + Finland + Canada",
    hhi: 5800,
    q3DeltaPp: -1,
    direction: "flat",
    usNetImportReliancePct: 76,
    substitutionDifficulty: 4,
    priceYoyPct: null,
    stressBand: "high",
    bindingScore: binding(75, "high"),
    confidence: "estimated",
    note: "Share flat; DRC quota risk is volume, not share relief",
    fill: CN,
  },
  {
    id: "nickel-growth",
    label: "Nickel refined-supply growth capture",
    shortLabel: "Ni growth",
    stage: "midstream",
    sectors: ["batteries", "structural"],
    top1SharePct: 75,
    top1Label: "Indonesia",
    top1Iso: "ID",
    top3SharePct: 90,
    top3Labels: "Indonesia + China peers",
    hhi: 5800,
    q3DeltaPp: 25,
    direction: "tighter",
    usNetImportReliancePct: 48,
    substitutionDifficulty: 3,
    priceYoyPct: 9.8,
    stressBand: "elevated",
    bindingScore: binding(75, "elevated"),
    confidence: "estimated",
    note: "Pink Sheet Ni +9.8% YoY but −11.5% from May; growth-capture share still the tip story",
    fill: OTHER,
  },
  {
    id: "cobalt-mine",
    label: "Cobalt (mine)",
    shortLabel: "Co mine",
    stage: "mine",
    sectors: ["batteries"],
    top1SharePct: 74.2,
    top1Label: "Congo (Kinshasa)",
    top1Iso: "CD",
    top3SharePct: 85,
    top3Labels: "DRC + Indonesia + Russia",
    hhi: 5650,
    q3DeltaPp: 0.2,
    direction: "flat",
    usNetImportReliancePct: 76,
    substitutionDifficulty: 4,
    priceYoyPct: null,
    stressBand: "high",
    bindingScore: binding(74.2, "high"),
    confidence: "secondary",
    fill: OTHER,
  },
  {
    id: "avg-refine-ex-ree",
    label: "Avg top refining country (ex-REE)",
    shortLabel: "Avg refine",
    stage: "midstream",
    sectors: ["batteries", "structural"],
    top1SharePct: 72,
    top1Label: "China / Indonesia mix",
    top1Iso: "CN",
    top3SharePct: 88,
    top3Labels: "Top refining countries (IEA basket)",
    hhi: 5400,
    q3DeltaPp: 2,
    direction: "tighter",
    usNetImportReliancePct: 60,
    substitutionDifficulty: 4,
    priceYoyPct: 25.2,
    stressBand: "high",
    bindingScore: binding(72, "high"),
    confidence: "disclosed",
    note: "IEA headline 72% paired with metals index +25.2% YoY — share tip + basket stress",
    fill: CN,
  },
  {
    id: "lithium-chem",
    label: "Lithium chemical refining",
    shortLabel: "Li chem",
    stage: "midstream",
    sectors: ["batteries"],
    top1SharePct: 70,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 88,
    top3Labels: "China + Chile + Argentina",
    hhi: 5100,
    q3DeltaPp: 5,
    direction: "tighter",
    usNetImportReliancePct: 25,
    substitutionDifficulty: 4,
    priceYoyPct: null,
    stressBand: "elevated",
    bindingScore: binding(70, "elevated"),
    confidence: "estimated",
    note: "Capex −40% YoY (IEA) while chemical share tightened — thin future relief",
    fill: CN,
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
    q3DeltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 80,
    substitutionDifficulty: 5,
    priceYoyPct: null,
    stressBand: "high",
    bindingScore: binding(69, "high"),
    confidence: "secondary",
    relatedSlug: "rare-earth-mine-concentration-2024",
    fill: CN,
  },
  {
    id: "copper-smelt",
    label: "Copper smelting capacity",
    shortLabel: "Cu smelt",
    stage: "smelter",
    sectors: ["structural", "batteries"],
    top1SharePct: 50,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 68,
    top3Labels: "China + Chile + Japan",
    hhi: 2800,
    q3DeltaPp: 35,
    direction: "tighter",
    usNetImportReliancePct: 57,
    substitutionDifficulty: 3,
    priceYoyPct: 36.2,
    stressBand: "extreme",
    bindingScore: binding(50, "extreme"),
    confidence: "disclosed",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "50% capacity + Cu +36% YoY + spot TC ~−$90/t + 10% China cut plan — Aug binding midstream tip",
    fill: SMELT,
  },
  {
    id: "copper-refine",
    label: "Copper (refined)",
    shortLabel: "Cu refine",
    stage: "midstream",
    sectors: ["structural", "batteries"],
    top1SharePct: 50,
    top1Label: "China",
    top1Iso: "CN",
    top3SharePct: 65,
    top3Labels: "China + Chile + DRC",
    hhi: 2700,
    q3DeltaPp: 6,
    direction: "tighter",
    usNetImportReliancePct: 57,
    substitutionDifficulty: 3,
    priceYoyPct: 36.2,
    stressBand: "extreme",
    bindingScore: binding(50, "extreme"),
    confidence: "estimated",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    fill: CN,
  },
  {
    id: "tin-solder",
    label: "Tin (solder / electronics gate)",
    shortLabel: "Tin",
    stage: "midstream",
    sectors: ["semiconductors", "structural"],
    top1SharePct: 48,
    top1Label: "China (refine approx.)",
    top1Iso: "CN",
    top3SharePct: 72,
    top3Labels: "China + Indonesia + Peru chain",
    hhi: 2600,
    q3DeltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 75,
    substitutionDifficulty: 4,
    priceYoyPct: 55.5,
    stressBand: "extreme",
    bindingScore: binding(48, "extreme"),
    confidence: "estimated",
    note: "Largest Pink Sheet base-metal YoY (+55.5%) — price stress outruns disclosed share tip",
    fill: MID,
  },
  {
    id: "lithium-mine",
    label: "Lithium (mine)",
    shortLabel: "Li mine",
    stage: "mine",
    sectors: ["batteries"],
    top1SharePct: 37,
    top1Label: "Australia",
    top1Iso: "AU",
    top3SharePct: 78,
    top3Labels: "Australia + Chile + China",
    hhi: 2200,
    q3DeltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 25,
    substitutionDifficulty: 3,
    priceYoyPct: null,
    stressBand: "quiet",
    bindingScore: binding(37, "quiet"),
    confidence: "secondary",
    note: "Pit plural; chemical midstream is the concentration jump",
    fill: OTHER,
  },
  {
    id: "aluminum-smelt",
    label: "Aluminum (primary / price gate)",
    shortLabel: "Aluminum",
    stage: "smelter",
    sectors: ["structural"],
    top1SharePct: 58,
    top1Label: "China (approx. primary)",
    top1Iso: "CN",
    top3SharePct: 72,
    top3Labels: "China + Russia + India",
    hhi: 3600,
    q3DeltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 14,
    substitutionDifficulty: 2,
    priceYoyPct: 20.1,
    stressBand: "high",
    bindingScore: binding(58, "high"),
    confidence: "estimated",
    note: "Pink Sheet Al +20.1% YoY after May peak cooled — structural metal stress",
    fill: SMELT,
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
    q3DeltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 9,
    substitutionDifficulty: 5,
    priceYoyPct: 14.0,
    stressBand: "elevated",
    bindingScore: binding(28, "elevated"),
    confidence: "secondary",
    relatedSlug: "phosphate-fertilizer-export-dependence-2026",
    note: "Export top-1 modest; DAP +14% / rock +11.5% show food-system stress on thin gates",
    fill: MID,
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
    q3DeltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 57,
    substitutionDifficulty: 2,
    priceYoyPct: 36.2,
    stressBand: "extreme",
    bindingScore: binding(23, "extreme"),
    confidence: "secondary",
    relatedSlug: "copper-mine-vs-refinery-geography-2026",
    note: "Mine still plural (top-1 23%) while cathode +36% and smelter tip bind — classic stage flip",
    fill: OTHER,
  },
  {
    id: "zinc-metal",
    label: "Zinc (metal price gate)",
    shortLabel: "Zinc",
    stage: "midstream",
    sectors: ["structural"],
    top1SharePct: 35,
    top1Label: "China (approx.)",
    top1Iso: "CN",
    top3SharePct: 55,
    top3Labels: "China + Australia + Peru",
    hhi: 1600,
    q3DeltaPp: 0,
    direction: "flat",
    usNetImportReliancePct: 55,
    substitutionDifficulty: 2,
    priceYoyPct: 25.5,
    stressBand: "high",
    bindingScore: binding(35, "high"),
    confidence: "estimated",
    note: "Pink Sheet Zn +25.5% YoY — galvanizing / structural stress with moderate share tip",
    fill: SLATE,
  },
];

export const HEADLINE = {
  priorVintage: "Q3 IEA/MCS concentration ladder",
  newVintage: "Aug Pink Sheet + smelter stress overlay",
  /** Extreme tip */
  top1ExtremePct: 99,
  top1ExtremeLabel: "Gallium refine — China",
  top3ExtremePct: 99.5,
  /** IEA basket headline */
  avgRefineExReePct: 72,
  avgRefineTop3Pct: 88,
  avgRefineHhi: 5400,
  /** Median Top-1 across table */
  medianTop1Pct: 70,
  /** Rows with Top-1 ≥ 70% */
  tip70Count: 10,
  tip70Of: 19,
  /** Aug binding copper story */
  cuMineTop1Pct: 23,
  cuSmeltTop1Pct: 50,
  cuPriceYoyPct: 36.2,
  cuSpotTcUsd: -90,
  chinaSmelterCutPct: 10,
  /** Pink Sheet extremes */
  tinYoyPct: 55.5,
  metalsIdxYoyPct: 25.2,
  /** Binding score leaders */
  bindingTop1Score: binding(99, "extreme"),
  bindingTop1Label: "Gallium",
  cuSmeltBindingScore: binding(50, "extreme"),
  /** Stress×share: rows with top1≥50 and priceYoy≥20 */
  hotIntersectCount: 4,
} as const;

/** Top-k ladder for Aug view — Top-1 held, Top-3 held, binding score */
export const TOP_K_LADDER = COMMODITIES.map((c) => ({
  id: c.id,
  shortLabel: c.shortLabel,
  stage: c.stage,
  top1: c.top1SharePct,
  top3: c.top3SharePct,
  hhi: c.hhi,
  binding: c.bindingScore,
  stressBand: c.stressBand,
  priceYoyPct: c.priceYoyPct,
  fill: c.fill,
})).sort((a, b) => b.top1 - a.top1);

/** Stage flip pairs: mine vs midstream/smelter for same metal */
export const STAGE_FLIPS = [
  {
    id: "copper",
    label: "Copper",
    mineTop1: 23,
    mineLabel: "Chile mine",
    plantTop1: 50,
    plantLabel: "China smelt",
    gapPp: 27,
    priceYoyPct: 36.2,
    note: "Plural pits → concentrated smelters + record cathode",
    fill: SMELT,
  },
  {
    id: "graphite",
    label: "Graphite",
    mineTop1: 77.8,
    mineLabel: "China mine",
    plantTop1: 90,
    plantLabel: "China anode",
    gapPp: 12.2,
    priceYoyPct: null as number | null,
    note: "Mine already concentrated; anode tip still hotter",
    fill: CN,
  },
  {
    id: "lithium",
    label: "Lithium",
    mineTop1: 37,
    mineLabel: "Australia mine",
    plantTop1: 70,
    plantLabel: "China chem",
    gapPp: 33,
    priceYoyPct: null as number | null,
    note: "Biggest stage gap in the battery stack",
    fill: OTHER,
  },
  {
    id: "cobalt",
    label: "Cobalt",
    mineTop1: 74.2,
    mineLabel: "DRC mine",
    plantTop1: 75,
    plantLabel: "China refine",
    gapPp: 0.8,
    priceYoyPct: null as number | null,
    note: "Both ends concentrated — little stage relief",
    fill: OTHER,
  },
  {
    id: "ree",
    label: "Rare earths",
    mineTop1: 69,
    mineLabel: "China mine",
    plantTop1: 85,
    plantLabel: "China separate",
    gapPp: 16,
    priceYoyPct: null as number | null,
    note: "Separation tip above pit tip",
    fill: CN,
  },
];

/** Pink Sheet stress vs held Top-1 — for scatter / bubble */
export const STRESS_SHARE = COMMODITIES.filter(
  (c) => c.priceYoyPct != null
).map((c) => ({
  id: c.id,
  shortLabel: c.shortLabel,
  top1: c.top1SharePct,
  top3: c.top3SharePct,
  priceYoy: c.priceYoyPct as number,
  binding: c.bindingScore,
  stage: c.stage,
  fill: c.fill,
  hhi: c.hhi,
}));

/** Lorenz-style cumulative Top-1 ordering (share concentration curve) */
export const CONCENTRATION_CURVE = (() => {
  const sorted = [...COMMODITIES].sort(
    (a, b) => b.top1SharePct - a.top1SharePct
  );
  const n = sorted.length;
  const equalStep = 100 / n;
  let cumShare = 0;
  const shareSum = sorted.reduce((s, c) => s + c.top1SharePct, 0);
  return [
    { rankPct: 0, cumTop1MassPct: 0, equalPct: 0, label: "0" },
    ...sorted.map((c, i) => {
      cumShare += c.top1SharePct;
      return {
        rankPct: Math.round(((i + 1) / n) * 1000) / 10,
        cumTop1MassPct: Math.round((cumShare / shareSum) * 1000) / 10,
        equalPct: Math.round((i + 1) * equalStep * 10) / 10,
        label: c.shortLabel,
      };
    }),
  ];
})();

/** Smelter stress panel beside capacity share */
export const SMELTER_STRESS = [
  {
    id: "capacity",
    label: "China Cu capacity share",
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
    id: "tcrc-bench",
    label: "2026 TC/RC settle",
    value: 0,
    unit: "$/t",
    fill: MID,
  },
  {
    id: "tcrc-spot",
    label: "Spot TC (Mar path)",
    value: -90,
    unit: "$/t",
    fill: CN,
  },
  {
    id: "cut",
    label: "China 2026 cut plan",
    value: 10,
    unit: "%",
    fill: MID,
  },
];

/** Price path — metals index + copper for area/line */
export const PRICE_PATH = [
  { period: "2025 ann.", copper: 9947, metalsIdx: 112.2, nickel: 15162 },
  { period: "2026 Q1", copper: 12831, metalsIdx: 137.1, nickel: 16400 },
  { period: "2026 May", copper: 13200, metalsIdx: 148.8, nickel: 18806 },
  { period: "2026 Jul", copper: 13543, metalsIdx: 140.5, nickel: 16651 },
];

/** HHI band counts for donut */
export const HHI_BANDS = [
  { id: "extreme", label: "≥ 5,000", min: 5000, fill: CN },
  { id: "high", label: "2,500–4,999", min: 2500, fill: MID },
  { id: "moderate", label: "1,500–2,499", min: 1500, fill: OTHER },
  { id: "plural", label: "< 1,500", min: 0, fill: SLATE },
];

export function hhiBand(hhi: number): (typeof HHI_BANDS)[number] {
  if (hhi >= 5000) return HHI_BANDS[0]!;
  if (hhi >= 2500) return HHI_BANDS[1]!;
  if (hhi >= 1500) return HHI_BANDS[2]!;
  return HHI_BANDS[3]!;
}

export function hhiBandCounts(rows: CommodityShare[] = COMMODITIES) {
  return HHI_BANDS.map((b) => ({
    ...b,
    count: rows.filter((c) => hhiBand(c.hhi).id === b.id).length,
  }));
}

/** Downstream disruption risk (IEA) — held */
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
  },
];

export function filterCommodities(opts: {
  stage?: Stage | "all";
  sector?: Sector | "all";
  stress?: StressBand | "all";
  minTop1?: number;
}): CommodityShare[] {
  return COMMODITIES.filter((c) => {
    if (opts.stage && opts.stage !== "all" && c.stage !== opts.stage)
      return false;
    if (
      opts.sector &&
      opts.sector !== "all" &&
      !c.sectors.includes(opts.sector)
    )
      return false;
    if (opts.stress && opts.stress !== "all" && c.stressBand !== opts.stress)
      return false;
    if (opts.minTop1 != null && c.top1SharePct < opts.minTop1) return false;
    return true;
  });
}

export function producerScoreboard(rows: CommodityShare[] = COMMODITIES) {
  const map = new Map<
    string,
    { iso: string; label: string; count: number; fill: string }
  >();
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

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1]! + s[mid]!) / 2 : s[mid]!;
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
      hit.length === 0 ? 0 : median(hit.map((c) => c.top1SharePct));
    return {
      sector,
      count: hit.length,
      medianTop1: Math.round(med * 10) / 10,
      extremeCount: hit.filter((c) => c.top1SharePct >= 70).length,
      hotPriceCount: hit.filter(
        (c) => c.priceYoyPct != null && (c.priceYoyPct as number) >= 15
      ).length,
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
    label: "World Bank — Pink Sheet August 2026",
    url: PINK_SHEET_URL,
  },
  {
    label: "IEA — Copper prices & smelter pressures",
    url: IEA_CU_SMELTER_URL,
  },
  {
    label: "Q3 concentration lens",
    url: PRIOR_Q3_CONC_PATH,
  },
  {
    label: "August theme update (price stress)",
    url: PRIOR_AUG_UPDATE_PATH,
  },
] as const;
