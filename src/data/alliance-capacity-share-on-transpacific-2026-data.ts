/**
 * Alliance capacity share on the transpacific (2026).
 *
 * Core question: How concentrated is scheduled TEU capacity among alliances
 * on the Asia–North America trades after the Feb 2025 reshuffle
 * (2M → Gemini; THE Alliance → Premier; MSC standalone)?
 *
 * Perimeter: Alphaliner deployed-fleet snapshot on dedicated Far East–
 * North America loops (USWC + USEC), early-2026 vintage. Alliance shares
 * are VSA / cooperation buckets (Ocean, Premier, Gemini) plus MSC as a
 * standalone network; carrier TEU ranks are fleet-deployed capacity on
 * the trade, not global fleet share. UNCTAD RMT supplies structural
 * fleet-growth / schedule-reliability context — not the share ladder.
 *
 * Headline: Ocean Alliance alone holds 35.3% of scheduled transpacific
 * TEU; the three alliances still control 73.7% (vs 74.6% a year earlier).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Alliance and carrier TEU shares: Alphaliner early-2026 deployed-capacity census on Asia–North America loops (≈5.2 Mteu across 532 ships; −3.2% YoY vs Jan 2025 / 554 ships). Ocean Alliance 35.3%, Premier Alliance 21.4%, Gemini Cooperation 17% (≈884,500 teu), MSC standalone ≈16%; three-alliance tip 73.7% vs 74.6% with nine alliance carriers in Jan 2025. Carrier YoY moves (ONE +10.3%, MSC +11.7%, Hapag-Lloyd +24.3%, CMA CGM −15.2%, Maersk −24.3%, Yang Ming −30%) from the same Alphaliner restatement as reported by Loadstar / Ship & Bunker / Global Maritime Hub. Coast splits (NAWC / NAEC) carried from Sea-Intelligence March 2025 alliance-share press note and desk-smoothed into early-2026 levels. UNCTAD Review of Maritime Transport: global containership delivery and schedule-reliability backdrop only. Shares are schedule/deployed capacity — not loaded TEU or revenue.";

export const SOURCES = [
  {
    label: "Alphaliner — Asia–North America deployed capacity",
    url: "https://alphaliner.axsmarine.com/",
  },
  {
    label: "The Loadstar — post-CNY transpacific capacity shuffle",
    url: "https://theloadstar.com/post-cny-demand-looks-weak-after-transpacific-capacity-shuffle/",
  },
  {
    label: "Sea-Intelligence — alliance market-share shift",
    url: "https://sea-intelligence.com/press-room/308-shift-in-alliance-market-shares",
  },
  {
    label: "UNCTAD — Review of Maritime Transport",
    url: "https://unctad.org/topic/transport-and-trade-logistics/review-of-maritime-transport",
  },
] as const;

/** Headline punchline — top-alliance TEU share */
export const HEADLINE = {
  /** Ocean Alliance share of scheduled Asia–NA TEU (early 2026) */
  oceanSharePct: 35.3,
  /** Premier Alliance share */
  premierSharePct: 21.4,
  /** Gemini Cooperation share */
  geminiSharePct: 17,
  /** Gemini absolute TEU (Alphaliner) */
  geminiTeu: 884_500,
  /** MSC standalone share */
  mscSharePct: 16,
  /** Three-alliance combined share (Ocean + Premier + Gemini) */
  top3AlliancePct: 73.7,
  /** Same tip one year earlier (Jan 2025; nine alliance carriers) */
  top3AlliancePriorPct: 74.6,
  /** Total scheduled capacity Mteu */
  totalMteu: 5.2,
  /** Ships on dedicated FE–NA loops */
  shipCount: 532,
  /** YoY capacity change % */
  yoyCapacityPct: -3.2,
  confidence: "disclosed" as Confidence,
};

export const VIZ_MARKERS = [
  "Top-alliance TEU share",
  "Alliance ladder · Asia–NA",
  "Coast split · NAWC / NAEC",
  "Carrier YoY Δ",
  "Concentration path",
] as const;

export type AllianceId =
  | "ocean"
  | "premier"
  | "gemini"
  | "msc"
  | "other"
  | "the_alliance"
  | "two_m";

export type Coast = "blended" | "nawc" | "naec";

export type AllianceShareRow = {
  id: AllianceId;
  label: string;
  /** Share of scheduled Asia–NA TEU (%) */
  sharePct: number;
  /** Approximate absolute TEU */
  teu: number;
  members: string;
  vintage: "2025-01" | "2025-03" | "2026-01";
  confidence: Confidence;
};

/**
 * Alliance / bloc shares on Asia–NA deployed capacity.
 * Jan 2025 = pre-reshuffle (2M, Ocean, THE Alliance).
 * Mar 2025 = early Gemini / Premier (Sea-Intelligence coast lens, carried).
 * Jan 2026 = Alphaliner disclosed tip.
 */
export const ALLIANCE_SHARES: AllianceShareRow[] = [
  // —— Jan 2025 (pre-reshuffle) ——
  {
    id: "ocean",
    label: "Ocean Alliance",
    sharePct: 36.2,
    teu: 1_945_000,
    members: "CMA CGM · COSCO · Evergreen",
    vintage: "2025-01",
    confidence: "estimated",
  },
  {
    id: "the_alliance",
    label: "THE Alliance",
    sharePct: 21.8,
    teu: 1_171_000,
    members: "ONE · HMM · Yang Ming · Hapag-Lloyd",
    vintage: "2025-01",
    confidence: "estimated",
  },
  {
    id: "two_m",
    label: "2M (Maersk–MSC)",
    sharePct: 16.6,
    teu: 883_200,
    members: "Maersk · MSC",
    vintage: "2025-01",
    confidence: "carried",
  },
  {
    id: "other",
    label: "Other / independents",
    sharePct: 25.4,
    teu: 1_364_000,
    members: "ZIM · niche + extras",
    vintage: "2025-01",
    confidence: "estimated",
  },
  // —— Mar 2025 (early post-reshuffle; coast-blended carry) ——
  {
    id: "ocean",
    label: "Ocean Alliance",
    sharePct: 35.0,
    teu: 1_820_000,
    members: "CMA CGM · COSCO · Evergreen",
    vintage: "2025-03",
    confidence: "carried",
  },
  {
    id: "premier",
    label: "Premier Alliance",
    sharePct: 21.5,
    teu: 1_118_000,
    members: "ONE · HMM · Yang Ming",
    vintage: "2025-03",
    confidence: "carried",
  },
  {
    id: "gemini",
    label: "Gemini Cooperation",
    sharePct: 15.8,
    teu: 821_000,
    members: "Maersk · Hapag-Lloyd",
    vintage: "2025-03",
    confidence: "estimated",
  },
  {
    id: "msc",
    label: "MSC (standalone)",
    sharePct: 14.5,
    teu: 754_000,
    members: "MSC (+ selective VSAs)",
    vintage: "2025-03",
    confidence: "estimated",
  },
  {
    id: "other",
    label: "Other / independents",
    sharePct: 13.2,
    teu: 686_000,
    members: "ZIM · niche loops",
    vintage: "2025-03",
    confidence: "estimated",
  },
  // —— Jan 2026 (Alphaliner) ——
  {
    id: "ocean",
    label: "Ocean Alliance",
    sharePct: 35.3,
    teu: 1_835_600,
    members: "CMA CGM · COSCO · Evergreen",
    vintage: "2026-01",
    confidence: "disclosed",
  },
  {
    id: "premier",
    label: "Premier Alliance",
    sharePct: 21.4,
    teu: 1_112_800,
    members: "ONE · HMM · Yang Ming",
    vintage: "2026-01",
    confidence: "disclosed",
  },
  {
    id: "gemini",
    label: "Gemini Cooperation",
    sharePct: 17.0,
    teu: 884_500,
    members: "Maersk · Hapag-Lloyd",
    vintage: "2026-01",
    confidence: "disclosed",
  },
  {
    id: "msc",
    label: "MSC (standalone)",
    sharePct: 16.0,
    teu: 832_000,
    members: "MSC (+ selective VSAs)",
    vintage: "2026-01",
    confidence: "disclosed",
  },
  {
    id: "other",
    label: "Other / independents",
    sharePct: 10.3,
    teu: 535_100,
    members: "ZIM · niche loops",
    vintage: "2026-01",
    confidence: "estimated",
  },
];

export type CoastSplitRow = {
  coast: "nawc" | "naec";
  label: string;
  oceanPct: number;
  premierPct: number;
  geminiPct: number;
  mscPct: number;
  otherPct: number;
  confidence: Confidence;
};

/** Sea-Intelligence-style coast lens (Mar 2025) carried toward early-2026 shape */
export const COAST_SPLIT: CoastSplitRow[] = [
  {
    coast: "nawc",
    label: "Asia → NA West Coast",
    oceanPct: 35.0,
    premierPct: 22.0,
    geminiPct: 14.5,
    mscPct: 15.5,
    otherPct: 13.0,
    confidence: "carried",
  },
  {
    coast: "naec",
    label: "Asia → NA East Coast",
    oceanPct: 34.5,
    premierPct: 18.2,
    geminiPct: 18.0,
    mscPct: 17.5,
    otherPct: 11.8,
    confidence: "carried",
  },
];

export type CarrierRow = {
  carrier: string;
  alliance: string;
  allianceId: AllianceId | "independent";
  /** Estimated / disclosed share of Asia–NA deployed TEU (%) */
  sharePct: number;
  teu: number;
  /** YoY change in deployed capacity (%) */
  yoyPct: number;
  rank: number;
  confidence: Confidence;
};

/**
 * Carrier ladder on Asia–NA (early 2026). Top three fleets Cosco / ONE /
 * Evergreen per Alphaliner; YoY % disclosed where cited; absolute TEU
 * estimated to sum near the 5.2 Mteu perimeter.
 */
export const CARRIER_LADDER: CarrierRow[] = [
  {
    carrier: "COSCO Shipping Group",
    alliance: "Ocean",
    allianceId: "ocean",
    sharePct: 16.8,
    teu: 873_600,
    yoyPct: 2.1,
    rank: 1,
    confidence: "estimated",
  },
  {
    carrier: "MSC",
    alliance: "Standalone",
    allianceId: "msc",
    sharePct: 16.0,
    teu: 832_000,
    yoyPct: 11.7,
    rank: 2,
    confidence: "disclosed",
  },
  {
    carrier: "ONE",
    alliance: "Premier",
    allianceId: "premier",
    sharePct: 11.6,
    teu: 603_200,
    yoyPct: 10.3,
    rank: 3,
    confidence: "carried",
  },
  {
    carrier: "Evergreen",
    alliance: "Ocean",
    allianceId: "ocean",
    sharePct: 10.4,
    teu: 540_800,
    yoyPct: 1.4,
    rank: 4,
    confidence: "estimated",
  },
  {
    carrier: "Maersk",
    alliance: "Gemini",
    allianceId: "gemini",
    sharePct: 9.2,
    teu: 478_400,
    yoyPct: -24.3,
    rank: 5,
    confidence: "carried",
  },
  {
    carrier: "CMA CGM",
    alliance: "Ocean",
    allianceId: "ocean",
    sharePct: 8.1,
    teu: 421_200,
    yoyPct: -15.2,
    rank: 6,
    confidence: "carried",
  },
  {
    carrier: "Hapag-Lloyd",
    alliance: "Gemini",
    allianceId: "gemini",
    sharePct: 7.8,
    teu: 405_600,
    yoyPct: 24.3,
    rank: 7,
    confidence: "carried",
  },
  {
    carrier: "HMM",
    alliance: "Premier",
    allianceId: "premier",
    sharePct: 5.8,
    teu: 301_600,
    yoyPct: -4.5,
    rank: 8,
    confidence: "estimated",
  },
  {
    carrier: "Yang Ming",
    alliance: "Premier",
    allianceId: "premier",
    sharePct: 4.0,
    teu: 208_000,
    yoyPct: -30.0,
    rank: 9,
    confidence: "carried",
  },
  {
    carrier: "ZIM + other",
    alliance: "Independent",
    allianceId: "independent",
    sharePct: 10.3,
    teu: 535_600,
    yoyPct: -1.8,
    rank: 10,
    confidence: "estimated",
  },
];

export type ConcentrationPoint = {
  vintage: string;
  label: string;
  /** Top-1 alliance / bloc share % */
  top1Pct: number;
  /** Top-3 alliance / bloc share % */
  top3Pct: number;
  /** HHI of alliance/bloc shares (0–10,000) */
  hhi: number;
  allianceCount: number;
  confidence: Confidence;
};

function hhiFromShares(shares: number[]): number {
  return Math.round(shares.reduce((s, x) => s + x * x, 0));
}

export const CONCENTRATION_PATH: ConcentrationPoint[] = [
  {
    vintage: "2025-01",
    label: "Jan 25 · pre-reshuffle",
    top1Pct: 36.2,
    top3Pct: 74.6,
    hhi: hhiFromShares([36.2, 21.8, 16.6, 25.4]),
    allianceCount: 3,
    confidence: "estimated",
  },
  {
    vintage: "2025-03",
    label: "Mar 25 · early Gemini",
    top1Pct: 35.0,
    top3Pct: 72.3,
    hhi: hhiFromShares([35.0, 21.5, 15.8, 14.5, 13.2]),
    allianceCount: 3,
    confidence: "carried",
  },
  {
    vintage: "2026-01",
    label: "Jan 26 · Alphaliner",
    top1Pct: 35.3,
    top3Pct: 73.7,
    hhi: hhiFromShares([35.3, 21.4, 17.0, 16.0, 10.3]),
    allianceCount: 3,
    confidence: "disclosed",
  },
];

export type FleetContextRow = {
  year: number;
  label: string;
  /** Global containership fleet capacity index (2020 = 100), UNCTAD-style */
  fleetIndex: number;
  /** Schedule reliability % (industry tracker carry) */
  reliabilityPct: number;
  confidence: Confidence;
};

/** UNCTAD RMT / industry reliability backdrop — not the share ladder */
export const FLEET_CONTEXT: FleetContextRow[] = [
  { year: 2020, label: "2020", fleetIndex: 100, reliabilityPct: 64, confidence: "carried" },
  { year: 2021, label: "2021", fleetIndex: 104, reliabilityPct: 35, confidence: "carried" },
  { year: 2022, label: "2022", fleetIndex: 108, reliabilityPct: 40, confidence: "carried" },
  { year: 2023, label: "2023", fleetIndex: 114, reliabilityPct: 56, confidence: "carried" },
  { year: 2024, label: "2024", fleetIndex: 122, reliabilityPct: 52, confidence: "carried" },
  { year: 2025, label: "2025", fleetIndex: 130, reliabilityPct: 55, confidence: "estimated" },
  { year: 2026, label: "2026e", fleetIndex: 136, reliabilityPct: 58, confidence: "estimated" },
];

export const ANALYTICS = {
  oceanSharePct: HEADLINE.oceanSharePct,
  top3AlliancePct: HEADLINE.top3AlliancePct,
  top3DeltaPp: Number(
    (HEADLINE.top3AlliancePct - HEADLINE.top3AlliancePriorPct).toFixed(1),
  ),
  geminiVs2mTeuDelta: HEADLINE.geminiTeu - 883_200,
  mscSharePct: HEADLINE.mscSharePct,
  hhi2026: CONCENTRATION_PATH[2].hhi,
  hhi2025: CONCENTRATION_PATH[0].hhi,
  totalMteu: HEADLINE.totalMteu,
  shipCount: HEADLINE.shipCount,
};

export function allianceSharesForVintage(
  vintage: AllianceShareRow["vintage"],
): AllianceShareRow[] {
  return ALLIANCE_SHARES.filter((r) => r.vintage === vintage);
}

export function carriersByAlliance(allianceId: AllianceId | "all"): CarrierRow[] {
  if (allianceId === "all") return [...CARRIER_LADDER].sort((a, b) => a.rank - b.rank);
  return CARRIER_LADDER.filter((c) => c.allianceId === allianceId).sort(
    (a, b) => b.sharePct - a.sharePct,
  );
}
