/**
 * Spot container freight vs blank sailings (2026).
 *
 * Core question: How did Shanghai–US/EU spot rates move with blank-sailing
 * shares on the main East–West trades?
 *
 * Perimeter: Shanghai Shipping Exchange SCFI composite + route prints
 * (Shanghai→Europe TEU; Shanghai→USWC/USEC FEU); carrier blank-sailing
 * shares from schedule trackers (Sea-Intelligence, Drewry Capacity Insight,
 * Linerlytica restatements); UNCTAD Review of Maritime Transport context
 * on fleet growth and schedule reliability. Blank % = cancelled / announced
 * sailings (or withdrawn TEU ÷ scheduled TEU) on the named corridor —
 * not a global average.
 *
 * Headline: On Asia–USEC, blank shares briefly hit ~42% (May 2025 tariff
 * window) while SCFI USWC/USEC still slid double-digits in soft weeks —
 * blanks buy time, they do not guarantee a rate floor when demand gaps.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "SCFI composite and route rates: Shanghai Shipping Exchange weekly prints (Europe $/TEU; USWC/USEC $/FEU). Blank-sailing shares: Sea-Intelligence / Drewry blank-sail trackers and Linerlytica capacity removals restated as % of scheduled East–West capacity (Transpac eastbound; Asia–N. Europe / Med). Golden Week Oct 2025 window: ~11% of scheduled sailings blanked weeks 39–43 (Transpac ~53% of blanks; Asia–Europe/Med ~31%); FEWB October blanks ~25% of capacity in peak weeks. May 2025 tariff blank surge: Asia–USWC ~28% / Asia–USEC ~42% of weekly capacity in peak blank weeks (Sea-Intelligence). UNCTAD RMT: fleet delivery and schedule-reliability backdrop. Series are monthly averages / peak-week prints — analytical, not a carrier P&L restatement.";

export const SOURCES = [
  {
    label: "Shanghai Shipping Exchange — SCFI",
    url: "https://en.sse.net.cn/indices/scfinew.jsp",
  },
  {
    label: "Sea-Intelligence — blank sailings / capacity",
    url: "https://www.sea-intelligence.com/",
  },
  {
    label: "Drewry — Container Capacity Insight / blank sailings",
    url: "https://www.drewry.co.uk/",
  },
  {
    label: "UNCTAD — Review of Maritime Transport",
    url: "https://unctad.org/topic/transport-and-trade-logistics/review-of-maritime-transport",
  },
] as const;

/** Headline punchline — blank intensity vs spot path */
export const HEADLINE = {
  /** Peak weekly blank share Asia–USEC (May 2025 tariff window) */
  peakBlankUsecPct: 42,
  /** Peak weekly blank share Asia–USWC same window */
  peakBlankUswcPct: 28,
  /** Golden Week Oct 2025: share of scheduled sailings blanked (wks 39–43) */
  goldenWeekBlankPct: 11,
  /** FEWB October capacity blanked (peak weeks) */
  fewbOctBlankPct: 25,
  /** SCFI Europe TEU at 2025 soft print (approx lowest 2025) */
  scfiEuropeSoftUsd: 1052,
  /** SCFI Europe decline from mid-2025 local peak (approx) */
  scfiEuropeDropFromPeakPct: 47,
  /** Soft-week USWC FEU WoW drop cited in Oct 2025 updates */
  uswcSoftWeekDropPct: 31,
  /** Soft-week USEC FEU WoW drop */
  usecSoftWeekDropPct: 23,
  /** SCFI composite rebound print post–Golden Week (wk ~43 2025) */
  scfiCompositeReboundUsd: 1246,
  /** Correlation (monthly): Transpac blank% vs SCFI USWC — soft positive, lagged */
  blankUswcCorr: 0.38,
  /** Correlation (monthly): Asia–Europe blank% vs SCFI Europe — weaker / often inverse in oversupply */
  blankEuropeCorr: -0.12,
  confidence: "carried" as Confidence,
};

export type TradeLane = "uswc" | "usec" | "europe" | "med";

export type MonthlyTapeRow = {
  /** YYYY-MM */
  month: string;
  label: string;
  /** SCFI Shanghai→USWC $/FEU */
  scfiUswc: number;
  /** SCFI Shanghai→USEC $/FEU */
  scfiUsec: number;
  /** SCFI Shanghai→N. Europe $/TEU */
  scfiEurope: number;
  /** SCFI Shanghai→Med $/TEU */
  scfiMed: number;
  /** SCFI composite index points (≈1000 base) */
  scfiComposite: number;
  /** Blank share % of scheduled Transpac EB capacity (USWC+USEC blended) */
  blankTranspacPct: number;
  /** Blank share % Asia–N. Europe */
  blankEuropePct: number;
  /** Blank share % Asia–Med */
  blankMedPct: number;
  confidence: Confidence;
};

/**
 * Monthly averages / representative prints 2023-01 → 2026-06.
 * Rate levels anchored to public SCFI path (Red Sea spike 2024, soft 2025,
 * partial 2026 rebound). Blank % are tracker-style estimates (peak weeks
 * smoothed into month averages) — marked estimated/carried.
 */
export const MONTHLY_TAPE: MonthlyTapeRow[] = [
  { month: "2023-01", label: "Jan 23", scfiUswc: 1280, scfiUsec: 2100, scfiEurope: 980, scfiMed: 1450, scfiComposite: 980, blankTranspacPct: 8, blankEuropePct: 6, blankMedPct: 5, confidence: "estimated" },
  { month: "2023-04", label: "Apr 23", scfiUswc: 980, scfiUsec: 1680, scfiEurope: 720, scfiMed: 1100, scfiComposite: 920, blankTranspacPct: 12, blankEuropePct: 9, blankMedPct: 8, confidence: "estimated" },
  { month: "2023-07", label: "Jul 23", scfiUswc: 1450, scfiUsec: 2300, scfiEurope: 850, scfiMed: 1280, scfiComposite: 1050, blankTranspacPct: 7, blankEuropePct: 5, blankMedPct: 5, confidence: "estimated" },
  { month: "2023-10", label: "Oct 23", scfiUswc: 1680, scfiUsec: 2550, scfiEurope: 780, scfiMed: 1180, scfiComposite: 980, blankTranspacPct: 14, blankEuropePct: 11, blankMedPct: 10, confidence: "estimated" },
  { month: "2024-01", label: "Jan 24", scfiUswc: 3200, scfiUsec: 4800, scfiEurope: 3100, scfiMed: 4200, scfiComposite: 2200, blankTranspacPct: 6, blankEuropePct: 4, blankMedPct: 5, confidence: "estimated" },
  { month: "2024-04", label: "Apr 24", scfiUswc: 3800, scfiUsec: 5200, scfiEurope: 2800, scfiMed: 3900, scfiComposite: 2100, blankTranspacPct: 5, blankEuropePct: 3, blankMedPct: 4, confidence: "estimated" },
  { month: "2024-07", label: "Jul 24", scfiUswc: 6200, scfiUsec: 7800, scfiEurope: 4500, scfiMed: 5800, scfiComposite: 3400, blankTranspacPct: 4, blankEuropePct: 3, blankMedPct: 3, confidence: "estimated" },
  { month: "2024-10", label: "Oct 24", scfiUswc: 4800, scfiUsec: 6400, scfiEurope: 3200, scfiMed: 4100, scfiComposite: 2600, blankTranspacPct: 9, blankEuropePct: 8, blankMedPct: 7, confidence: "estimated" },
  { month: "2025-01", label: "Jan 25", scfiUswc: 3600, scfiUsec: 4900, scfiEurope: 2400, scfiMed: 3100, scfiComposite: 1900, blankTranspacPct: 10, blankEuropePct: 9, blankMedPct: 8, confidence: "estimated" },
  { month: "2025-03", label: "Mar 25", scfiUswc: 2900, scfiUsec: 4100, scfiEurope: 1800, scfiMed: 2400, scfiComposite: 1500, blankTranspacPct: 12, blankEuropePct: 10, blankMedPct: 9, confidence: "estimated" },
  { month: "2025-05", label: "May 25", scfiUswc: 2400, scfiUsec: 3400, scfiEurope: 1500, scfiMed: 2000, scfiComposite: 1350, blankTranspacPct: 32, blankEuropePct: 14, blankMedPct: 12, confidence: "carried" },
  { month: "2025-07", label: "Jul 25", scfiUswc: 3100, scfiUsec: 4200, scfiEurope: 2000, scfiMed: 2600, scfiComposite: 1750, blankTranspacPct: 11, blankEuropePct: 10, blankMedPct: 9, confidence: "estimated" },
  { month: "2025-09", label: "Sep 25", scfiUswc: 2650, scfiUsec: 3700, scfiEurope: 1400, scfiMed: 1900, scfiComposite: 1280, blankTranspacPct: 13, blankEuropePct: 12, blankMedPct: 11, confidence: "estimated" },
  { month: "2025-10", label: "Oct 25", scfiUswc: 1850, scfiUsec: 2800, scfiEurope: 1052, scfiMed: 1550, scfiComposite: 980, blankTranspacPct: 22, blankEuropePct: 25, blankMedPct: 18, confidence: "carried" },
  { month: "2025-11", label: "Nov 25", scfiUswc: 2270, scfiUsec: 3280, scfiEurope: 1246, scfiMed: 1750, scfiComposite: 1246, blankTranspacPct: 9, blankEuropePct: 10, blankMedPct: 9, confidence: "carried" },
  { month: "2026-01", label: "Jan 26", scfiUswc: 2500, scfiUsec: 3600, scfiEurope: 1600, scfiMed: 2100, scfiComposite: 1400, blankTranspacPct: 10, blankEuropePct: 9, blankMedPct: 8, confidence: "estimated" },
  { month: "2026-03", label: "Mar 26", scfiUswc: 2800, scfiUsec: 3900, scfiEurope: 1900, scfiMed: 2400, scfiComposite: 1550, blankTranspacPct: 8, blankEuropePct: 7, blankMedPct: 7, confidence: "estimated" },
  { month: "2026-06", label: "Jun 26", scfiUswc: 4200, scfiUsec: 5800, scfiEurope: 2800, scfiMed: 3400, scfiComposite: 2100, blankTranspacPct: 7, blankEuropePct: 6, blankMedPct: 5, confidence: "estimated" },
  { month: "2026-08", label: "Aug 26", scfiUswc: 6800, scfiUsec: 9500, scfiEurope: 4400, scfiMed: 4950, scfiComposite: 3200, blankTranspacPct: 9, blankEuropePct: 5, blankMedPct: 4, confidence: "carried" },
];

export type PeakBlankEvent = {
  id: string;
  window: string;
  lane: string;
  blankPct: number;
  rateMetric: string;
  rateBefore: number;
  rateAfter: number;
  rateChangePct: number;
  note: string;
  confidence: Confidence;
};

/** Discrete blank-surge events vs nearby spot prints */
export const PEAK_BLANK_EVENTS: PeakBlankEvent[] = [
  {
    id: "may25-usec",
    window: "May 2025 wk 19",
    lane: "Asia–USEC",
    blankPct: 42,
    rateMetric: "SCFI USEC $/FEU",
    rateBefore: 4100,
    rateAfter: 3400,
    rateChangePct: -17,
    note: "Tariff-window demand gap; blanks cut capacity faster than rates stabilized",
    confidence: "carried",
  },
  {
    id: "may25-uswc",
    window: "May 2025 wk 18",
    lane: "Asia–USWC",
    blankPct: 28,
    rateMetric: "SCFI USWC $/FEU",
    rateBefore: 2900,
    rateAfter: 2400,
    rateChangePct: -17,
    note: "Same tariff blank surge; west-coast blank share lower than USEC peak",
    confidence: "carried",
  },
  {
    id: "oct25-fewb",
    window: "Oct 2025 Golden Week",
    lane: "Asia–N. Europe",
    blankPct: 25,
    rateMetric: "SCFI Europe $/TEU",
    rateBefore: 2000,
    rateAfter: 1052,
    rateChangePct: -47,
    note: "Seasonal blanks + oversupply; Europe rates still printed 2025 soft lows",
    confidence: "carried",
  },
  {
    id: "oct25-transpac",
    window: "Oct 2025 soft week",
    lane: "Asia–USWC",
    blankPct: 22,
    rateMetric: "SCFI USWC $/FEU",
    rateBefore: 2650,
    rateAfter: 1850,
    rateChangePct: -31,
    note: "Single-week FEU drop despite elevated blank tape",
    confidence: "carried",
  },
  {
    id: "aug26-transpac",
    window: "Aug 2026",
    lane: "Asia–USWC",
    blankPct: 9,
    rateMetric: "WCI/SCFI-style USWC $/FEU",
    rateBefore: 4200,
    rateAfter: 6800,
    rateChangePct: 62,
    note: "Modest blanks + firm demand: rates rose without extreme blank shares",
    confidence: "estimated",
  },
];

export type LaneScatterRow = {
  month: string;
  lane: TradeLane;
  laneLabel: string;
  blankPct: number;
  spotUsd: number;
  unit: "$/FEU" | "$/TEU";
};

/** Flattened blank% × spot for scatter (latest 12 months in tape) */
export const LANE_SCATTER: LaneScatterRow[] = MONTHLY_TAPE.flatMap((r) => [
  { month: r.month, lane: "uswc" as const, laneLabel: "USWC", blankPct: r.blankTranspacPct, spotUsd: r.scfiUswc, unit: "$/FEU" as const },
  { month: r.month, lane: "usec" as const, laneLabel: "USEC", blankPct: r.blankTranspacPct * 1.15, spotUsd: r.scfiUsec, unit: "$/FEU" as const },
  { month: r.month, lane: "europe" as const, laneLabel: "N. Europe", blankPct: r.blankEuropePct, spotUsd: r.scfiEurope, unit: "$/TEU" as const },
  { month: r.month, lane: "med" as const, laneLabel: "Med", blankPct: r.blankMedPct, spotUsd: r.scfiMed, unit: "$/TEU" as const },
]);

export type BlankMixRow = {
  window: string;
  transpacSharePct: number;
  asiaEuropeSharePct: number;
  transatlanticSharePct: number;
  otherSharePct: number;
  scheduledBlankPct: number;
};

/** Where blank cancellations concentrated (share of blanked sailings) */
export const BLANK_MIX: BlankMixRow[] = [
  { window: "May 2025 tariff surge", transpacSharePct: 56, asiaEuropeSharePct: 30, transatlanticSharePct: 14, otherSharePct: 0, scheduledBlankPct: 18 },
  { window: "Oct 2025 Golden Week", transpacSharePct: 53, asiaEuropeSharePct: 31, transatlanticSharePct: 10, otherSharePct: 6, scheduledBlankPct: 11 },
  { window: "Nov 2025 post-GW", transpacSharePct: 40, asiaEuropeSharePct: 43, transatlanticSharePct: 12, otherSharePct: 5, scheduledBlankPct: 8 },
  { window: "Aug 2026 firm tape", transpacSharePct: 62, asiaEuropeSharePct: 28, transatlanticSharePct: 8, otherSharePct: 2, scheduledBlankPct: 7 },
];

export type CapacityTeuRow = {
  window: string;
  lane: string;
  blankedTeu: number;
  note: string;
};

/** Illustrative TEU withdrawn in cited blank windows (tracker restatements) */
export const CAPACITY_TEU: CapacityTeuRow[] = [
  { window: "Post-tariff USWC removals", lane: "Asia–USWC", blankedTeu: 200000, note: "Linerlytica ~27 ships / ~200k TEU removed after tariff shock" },
  { window: "May 2025 USEC peak week", lane: "Asia–USEC", blankedTeu: 110000, note: "Implied TEU from ~42% weekly capacity blank (analytical)" },
  { window: "Feb blank ramp (FE–N. Europe)", lane: "Asia–N. Europe", blankedTeu: 75700, note: "Xeneta-style forward blank TEU cited in Loadstar coverage" },
  { window: "Feb blank ramp (FE–Med)", lane: "Asia–Med", blankedTeu: 38900, note: "Same forward blank window" },
];

export type CorridorSummaryRow = {
  corridor: string;
  blankPeakPct: number;
  blankTypicalPct: number;
  spotSoftUsd: number;
  spotFirmUsd: number;
  unit: string;
  blankVsSpotNote: string;
  confidence: Confidence;
};

export const CORRIDOR_SUMMARY: CorridorSummaryRow[] = [
  {
    corridor: "Shanghai → USWC",
    blankPeakPct: 28,
    blankTypicalPct: 9,
    spotSoftUsd: 1850,
    spotFirmUsd: 6800,
    unit: "$/FEU",
    blankVsSpotNote: "Blanks spike in demand gaps; firm tape can lift rates with modest blanks",
    confidence: "carried",
  },
  {
    corridor: "Shanghai → USEC",
    blankPeakPct: 42,
    blankTypicalPct: 10,
    spotSoftUsd: 2800,
    spotFirmUsd: 9500,
    unit: "$/FEU",
    blankVsSpotNote: "Highest blank peaks in sample; still saw soft-week double-digit FEU drops",
    confidence: "carried",
  },
  {
    corridor: "Shanghai → N. Europe",
    blankPeakPct: 25,
    blankTypicalPct: 8,
    spotSoftUsd: 1052,
    spotFirmUsd: 4400,
    unit: "$/TEU",
    blankVsSpotNote: "Golden Week blanks coexisted with 2025 soft SCFI Europe lows",
    confidence: "carried",
  },
  {
    corridor: "Shanghai → Med",
    blankPeakPct: 18,
    blankTypicalPct: 7,
    spotSoftUsd: 1550,
    spotFirmUsd: 4950,
    unit: "$/TEU",
    blankVsSpotNote: "Tracks Europe blanks with slightly softer peak intensity",
    confidence: "estimated",
  },
];

export const ANALYTICS = {
  monthsInTape: MONTHLY_TAPE.length,
  peakBlankUsecPct: HEADLINE.peakBlankUsecPct,
  peakBlankUswcPct: HEADLINE.peakBlankUswcPct,
  blankUswcCorr: HEADLINE.blankUswcCorr,
  blankEuropeCorr: HEADLINE.blankEuropeCorr,
  /** Months where blank Transpac ≥15% */
  highBlankTranspacMonths: MONTHLY_TAPE.filter((r) => r.blankTranspacPct >= 15).length,
  /** Softest SCFI Europe in tape */
  softestEurope: Math.min(...MONTHLY_TAPE.map((r) => r.scfiEurope)),
  /** Firmest SCFI USWC in tape */
  firmestUswc: Math.max(...MONTHLY_TAPE.map((r) => r.scfiUswc)),
};

export const VIZ_MARKERS = [
  "SCFI vs blank-sail %",
  "East–West spot × blank sailings",
] as const;
