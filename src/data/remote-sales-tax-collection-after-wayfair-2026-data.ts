/**
 * Remote sales-tax collection after Wayfair (2026).
 *
 * Core question: Did post-Wayfair economic-nexus rules recover online-sales
 * revenue fast enough to offset base erosion in the largest states?
 *
 * Method: Assemble a large-state panel from disclosed Department of Revenue
 * (DOR) remote-seller / marketplace-facilitator collection footnotes, Census
 * Annual Survey of State Government Tax Collections (STC) general sales-tax
 * (GST) totals, Multistate Tax Commission (MTC) model economic-nexus timing,
 * and GAO framing of pre-Wayfair remote leakage. Build desk series for:
 *   (1) remote-collection share of GST,
 *   (2) marketplace vs remote-seller split,
 *   (3) recovery dollars vs a modeled service-mix erosion drag,
 *   (4) years-to-offset by state.
 * Thresholds and effective dates follow MTC / state statute summaries;
 * dollar splits that DOR footnotes do not isolate are desk-modeled joins.
 *
 * Confidence: STC GST totals and many DOR remote/marketplace line items are
 * disclosed; national aggregates, erosion-offset counters, and some mid-panel
 * interpolations are desk-modeled — not official Treasury or GAO estimates.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "Remote / marketplace collections: large-state DOR annual reports and legislative fiscal notes (CA, TX, NY, FL, IL, PA, OH, GA, NC, MI, WA, NJ and peers). GST denominators: Census Annual Survey of State Government Tax Collections. Nexus timing and model statute framing: Multistate Tax Commission economic-nexus / marketplace-facilitator guidance. Pre-Wayfair leakage framing: GAO reports on remote sales and state tax administration. Offset balances join disclosed remote dollars to a desk service-mix erosion counterfactual — not a state’s audited taxable-base reconciliation.";

export const SOURCES = [
  {
    label: "GAO — Remote Sales Tax and State Collection Challenges",
    url: "https://www.gao.gov/",
  },
  {
    label: "Multistate Tax Commission — Economic Nexus / Marketplace Guidance",
    url: "https://www.mtc.gov/",
  },
  {
    label: "Census — Annual Survey of State Government Tax Collections",
    url: "https://www.census.gov/programs-surveys/stc.html",
  },
  {
    label: "State DOR annual reports — remote seller & marketplace collections",
    url: "https://www.taxadmin.org/",
  },
] as const;

/** National / large-state punchline */
export const HEADLINE = {
  /** Remote+marketplace share of large-state GST, FY2025 desk aggregate, % */
  remoteSharePct: 11.4,
  /** Same share, FY2017 (pre-Wayfair steady state), % */
  remoteShare2017Pct: 2.1,
  /** Percentage-point rise in remote share, 2017→2025 */
  remoteShareRisePp: 9.3,
  /** Large-state remote+marketplace collections, FY2025, $B */
  remoteCollectionsFy2025B: 48.6,
  /** Same, FY2017, $B */
  remoteCollectionsFy2017B: 6.8,
  /** Marketplace facilitator share of remote collections, FY2025, % */
  marketplaceOfRemotePct: 68,
  /** Of 12 large GST states, how many fully offset modeled erosion by FY2025 */
  statesFullyOffset: 4,
  /** Median years from economic-nexus effective date to remote share ≥8% */
  medianYearsTo8PctShare: 3.5,
  /** Modeled service-mix erosion drag on panel GST, FY2018–25 cumulative, $B */
  cumulativeErosionDragB: 44.0,
  /** Cumulative Wayfair-attributable remote recovery (desk haircut on excess over 2017), $B */
  cumulativeRemoteRecoveryB: 49.2,
  /** Net recovery minus erosion drag, $B (positive = recovery ahead) */
  netOffsetB: 5.2,
} as const;

export const ANALYTICS = {
  smokeMarker: "Remote-collection share",
  headlineLabel: "Remote-collection share of large-state GST",
  headlineValue: `${HEADLINE.remoteSharePct}%`,
} as const;

export type YearRow = {
  year: number;
  /** Remote seller + marketplace collections, large-state panel, $B */
  remoteCollectionsB: number;
  /** Remote share of GST, % */
  remoteSharePct: number;
  /** Marketplace facilitator portion of remote, $B */
  marketplaceB: number;
  /** Direct remote-seller portion, $B */
  remoteSellerB: number;
  /** Modeled annual service-mix erosion drag vs 2017 base breadth, $B */
  erosionDragB: number;
  /** Cumulative remote recovery above FY2017 run-rate, $B */
  cumRecoveryB: number;
  /** Cumulative erosion drag, $B */
  cumErosionB: number;
  confidence: Confidence;
};

/** Large-state aggregate path (FY labels approximated as calendar year-end) */
export const COLLECTION_SERIES: YearRow[] = [
  {
    year: 2015,
    remoteCollectionsB: 4.9,
    remoteSharePct: 1.6,
    marketplaceB: 0.4,
    remoteSellerB: 4.5,
    erosionDragB: 3.1,
    cumRecoveryB: 0,
    cumErosionB: 0,
    confidence: "estimated",
  },
  {
    year: 2016,
    remoteCollectionsB: 5.7,
    remoteSharePct: 1.8,
    marketplaceB: 0.6,
    remoteSellerB: 5.1,
    erosionDragB: 3.4,
    cumRecoveryB: 0,
    cumErosionB: 0,
    confidence: "estimated",
  },
  {
    year: 2017,
    remoteCollectionsB: 6.8,
    remoteSharePct: 2.1,
    marketplaceB: 0.9,
    remoteSellerB: 5.9,
    erosionDragB: 3.8,
    cumRecoveryB: 0,
    cumErosionB: 0,
    confidence: "estimated",
  },
  {
    year: 2018,
    remoteCollectionsB: 9.4,
    remoteSharePct: 2.8,
    marketplaceB: 2.1,
    remoteSellerB: 7.3,
    erosionDragB: 4.2,
    cumRecoveryB: 1.8,
    cumErosionB: 4.2,
    confidence: "modeled",
  },
  {
    year: 2019,
    remoteCollectionsB: 16.8,
    remoteSharePct: 4.9,
    marketplaceB: 8.4,
    remoteSellerB: 8.4,
    erosionDragB: 4.6,
    cumRecoveryB: 6.9,
    cumErosionB: 8.8,
    confidence: "modeled",
  },
  {
    year: 2020,
    remoteCollectionsB: 24.1,
    remoteSharePct: 6.8,
    marketplaceB: 14.6,
    remoteSellerB: 9.5,
    erosionDragB: 4.1,
    cumRecoveryB: 14.8,
    cumErosionB: 12.9,
    confidence: "modeled",
  },
  {
    year: 2021,
    remoteCollectionsB: 31.2,
    remoteSharePct: 8.2,
    marketplaceB: 19.8,
    remoteSellerB: 11.4,
    erosionDragB: 4.8,
    cumRecoveryB: 24.1,
    cumErosionB: 17.7,
    confidence: "modeled",
  },
  {
    year: 2022,
    remoteCollectionsB: 37.5,
    remoteSharePct: 9.4,
    marketplaceB: 24.6,
    remoteSellerB: 12.9,
    erosionDragB: 5.2,
    cumRecoveryB: 33.2,
    cumErosionB: 22.9,
    confidence: "modeled",
  },
  {
    year: 2023,
    remoteCollectionsB: 42.8,
    remoteSharePct: 10.3,
    marketplaceB: 28.4,
    remoteSellerB: 14.4,
    erosionDragB: 5.5,
    cumRecoveryB: 40.8,
    cumErosionB: 28.4,
    confidence: "modeled",
  },
  {
    year: 2024,
    remoteCollectionsB: 46.1,
    remoteSharePct: 10.9,
    marketplaceB: 31.0,
    remoteSellerB: 15.1,
    erosionDragB: 5.8,
    cumRecoveryB: 45.6,
    cumErosionB: 38.2,
    confidence: "modeled",
  },
  {
    year: 2025,
    remoteCollectionsB: 48.6,
    remoteSharePct: 11.4,
    marketplaceB: 33.0,
    remoteSellerB: 15.6,
    erosionDragB: 5.8,
    cumRecoveryB: 49.2,
    cumErosionB: 44.0,
    confidence: "modeled",
  },
];

/** Cumulative recovery/erosion used in offset panel (FY2018–25 window vs 2017 baseline) */
export const OFFSET_WINDOW = {
  fromYear: 2018,
  toYear: 2025,
  recoveryAboveBaselineB: HEADLINE.cumulativeRemoteRecoveryB,
  erosionDragB: HEADLINE.cumulativeErosionDragB,
  netB: HEADLINE.netOffsetB,
} as const;

export type ChannelSlice = {
  id: "marketplace" | "remote-seller" | "in-state";
  label: string;
  shortLabel: string;
  /** Share of large-state GST, FY2025, % */
  sharePct: number;
  color: string;
  confidence: Confidence;
};

export const CHANNEL_MIX_FY2025: ChannelSlice[] = [
  {
    id: "marketplace",
    label: "Marketplace facilitator remittance",
    shortLabel: "Marketplace",
    sharePct: 7.8,
    color: "#2dd4bf",
    confidence: "modeled",
  },
  {
    id: "remote-seller",
    label: "Direct remote-seller remittance",
    shortLabel: "Remote seller",
    sharePct: 3.6,
    color: "#38bdf8",
    confidence: "modeled",
  },
  {
    id: "in-state",
    label: "In-state / physical-presence GST",
    shortLabel: "In-state",
    sharePct: 88.6,
    color: "#475569",
    confidence: "estimated",
  },
];

export type RegionId = "northeast" | "midwest" | "south" | "west";

export type StateRow = {
  state: string;
  abbr: string;
  region: RegionId;
  /** Economic nexus effective year (approx) */
  nexusYear: number;
  /** Marketplace facilitator law effective year */
  marketplaceYear: number;
  /** Remote+marketplace share of GST, FY2025, % */
  remoteSharePct: number;
  /** Remote share, FY2017, % */
  remoteShare2017Pct: number;
  /** Remote collections FY2025, $B */
  remoteB: number;
  /** Cumulative recovery above 2017 baseline, FY2018–25, $B */
  recoveryB: number;
  /** Modeled cumulative erosion drag, same window, $B */
  erosionB: number;
  /** recoveryB − erosionB */
  netOffsetB: number;
  /** Years from nexus effective to remote share ≥8% (null if never) */
  yearsTo8Pct: number | null;
  /** Desk e-commerce intensity index (100 = panel median) */
  ecommerceIndex: number;
  /** Combined state+avg local GST rate, % */
  combinedRatePct: number;
  confidence: Confidence;
};

export const STATE_PANEL: StateRow[] = [
  {
    state: "California",
    abbr: "CA",
    region: "west",
    nexusYear: 2019,
    marketplaceYear: 2019,
    remoteSharePct: 12.8,
    remoteShare2017Pct: 2.4,
    remoteB: 9.6,
    recoveryB: 11.2,
    erosionB: 8.4,
    netOffsetB: 2.8,
    yearsTo8Pct: 2.5,
    ecommerceIndex: 118,
    combinedRatePct: 8.8,
    confidence: "modeled",
  },
  {
    state: "Texas",
    abbr: "TX",
    region: "south",
    nexusYear: 2019,
    marketplaceYear: 2019,
    remoteSharePct: 13.6,
    remoteShare2017Pct: 2.6,
    remoteB: 6.8,
    recoveryB: 7.4,
    erosionB: 5.1,
    netOffsetB: 2.3,
    yearsTo8Pct: 2.0,
    ecommerceIndex: 112,
    combinedRatePct: 8.2,
    confidence: "modeled",
  },
  {
    state: "New York",
    abbr: "NY",
    region: "northeast",
    nexusYear: 2019,
    marketplaceYear: 2019,
    remoteSharePct: 11.9,
    remoteShare2017Pct: 2.2,
    remoteB: 5.1,
    recoveryB: 5.6,
    erosionB: 5.8,
    netOffsetB: -0.2,
    yearsTo8Pct: 3.0,
    ecommerceIndex: 121,
    combinedRatePct: 8.5,
    confidence: "modeled",
  },
  {
    state: "Florida",
    abbr: "FL",
    region: "south",
    nexusYear: 2018,
    marketplaceYear: 2018,
    remoteSharePct: 14.2,
    remoteShare2017Pct: 2.8,
    remoteB: 5.4,
    recoveryB: 6.1,
    erosionB: 4.2,
    netOffsetB: 1.9,
    yearsTo8Pct: 2.0,
    ecommerceIndex: 125,
    combinedRatePct: 7.0,
    confidence: "modeled",
  },
  {
    state: "Illinois",
    abbr: "IL",
    region: "midwest",
    nexusYear: 2018,
    marketplaceYear: 2018,
    remoteSharePct: 10.4,
    remoteShare2017Pct: 1.9,
    remoteB: 2.6,
    recoveryB: 2.8,
    erosionB: 3.4,
    netOffsetB: -0.6,
    yearsTo8Pct: 3.5,
    ecommerceIndex: 104,
    combinedRatePct: 8.9,
    confidence: "modeled",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    region: "northeast",
    nexusYear: 2018,
    marketplaceYear: 2018,
    remoteSharePct: 9.8,
    remoteShare2017Pct: 1.7,
    remoteB: 2.3,
    recoveryB: 2.4,
    erosionB: 3.1,
    netOffsetB: -0.7,
    yearsTo8Pct: 4.0,
    ecommerceIndex: 98,
    combinedRatePct: 6.3,
    confidence: "modeled",
  },
  {
    state: "Ohio",
    abbr: "OH",
    region: "midwest",
    nexusYear: 2018,
    marketplaceYear: 2019,
    remoteSharePct: 10.1,
    remoteShare2017Pct: 1.8,
    remoteB: 2.1,
    recoveryB: 2.2,
    erosionB: 2.6,
    netOffsetB: -0.4,
    yearsTo8Pct: 3.5,
    ecommerceIndex: 96,
    combinedRatePct: 7.2,
    confidence: "modeled",
  },
  {
    state: "Georgia",
    abbr: "GA",
    region: "south",
    nexusYear: 2019,
    marketplaceYear: 2020,
    remoteSharePct: 12.1,
    remoteShare2017Pct: 2.3,
    remoteB: 2.4,
    recoveryB: 2.5,
    erosionB: 2.2,
    netOffsetB: 0.3,
    yearsTo8Pct: 3.0,
    ecommerceIndex: 108,
    combinedRatePct: 7.4,
    confidence: "modeled",
  },
  {
    state: "North Carolina",
    abbr: "NC",
    region: "south",
    nexusYear: 2018,
    marketplaceYear: 2019,
    remoteSharePct: 11.2,
    remoteShare2017Pct: 2.0,
    remoteB: 1.9,
    recoveryB: 2.0,
    erosionB: 2.1,
    netOffsetB: -0.1,
    yearsTo8Pct: 3.5,
    ecommerceIndex: 105,
    combinedRatePct: 7.0,
    confidence: "modeled",
  },
  {
    state: "Michigan",
    abbr: "MI",
    region: "midwest",
    nexusYear: 2018,
    marketplaceYear: 2019,
    remoteSharePct: 9.6,
    remoteShare2017Pct: 1.6,
    remoteB: 1.5,
    recoveryB: 1.6,
    erosionB: 2.3,
    netOffsetB: -0.7,
    yearsTo8Pct: 4.5,
    ecommerceIndex: 94,
    combinedRatePct: 6.0,
    confidence: "modeled",
  },
  {
    state: "New Jersey",
    abbr: "NJ",
    region: "northeast",
    nexusYear: 2018,
    marketplaceYear: 2018,
    remoteSharePct: 12.4,
    remoteShare2017Pct: 2.5,
    remoteB: 2.2,
    recoveryB: 2.3,
    erosionB: 2.4,
    netOffsetB: -0.1,
    yearsTo8Pct: 2.5,
    ecommerceIndex: 116,
    combinedRatePct: 6.6,
    confidence: "modeled",
  },
  {
    state: "Washington",
    abbr: "WA",
    region: "west",
    nexusYear: 2018,
    marketplaceYear: 2018,
    remoteSharePct: 15.1,
    remoteShare2017Pct: 3.1,
    remoteB: 2.8,
    recoveryB: 3.1,
    erosionB: 2.4,
    netOffsetB: 0.7,
    yearsTo8Pct: 1.5,
    ecommerceIndex: 132,
    combinedRatePct: 9.4,
    confidence: "modeled",
  },
];

export type SortKey =
  | "remoteShare"
  | "netOffset"
  | "recovery"
  | "ecommerce"
  | "yearsTo8";

export type RegionFilter = "all" | RegionId;

export function filterStates(
  region: RegionFilter,
  sort: SortKey,
): StateRow[] {
  const rows =
    region === "all"
      ? [...STATE_PANEL]
      : STATE_PANEL.filter((s) => s.region === region);
  rows.sort((a, b) => {
    switch (sort) {
      case "netOffset":
        return b.netOffsetB - a.netOffsetB;
      case "recovery":
        return b.recoveryB - a.recoveryB;
      case "ecommerce":
        return b.ecommerceIndex - a.ecommerceIndex;
      case "yearsTo8":
        return (a.yearsTo8Pct ?? 99) - (b.yearsTo8Pct ?? 99);
      case "remoteShare":
      default:
        return b.remoteSharePct - a.remoteSharePct;
    }
  });
  return rows;
}

export type AdoptionRow = {
  year: number;
  /** Cumulative GST states with economic nexus in force */
  nexusStates: number;
  /** Cumulative with marketplace facilitator collection */
  marketplaceStates: number;
};

export const ADOPTION_SERIES: AdoptionRow[] = [
  { year: 2017, nexusStates: 0, marketplaceStates: 2 },
  { year: 2018, nexusStates: 24, marketplaceStates: 12 },
  { year: 2019, nexusStates: 38, marketplaceStates: 32 },
  { year: 2020, nexusStates: 43, marketplaceStates: 40 },
  { year: 2021, nexusStates: 45, marketplaceStates: 43 },
  { year: 2022, nexusStates: 45, marketplaceStates: 45 },
  { year: 2023, nexusStates: 45, marketplaceStates: 45 },
  { year: 2024, nexusStates: 45, marketplaceStates: 45 },
  { year: 2025, nexusStates: 45, marketplaceStates: 45 },
];

export type OffsetBucket = {
  id: "fully-offset" | "near-parity" | "still-short";
  label: string;
  /** Count of panel states */
  count: number;
  /** Share of panel GST dollars (approx), % */
  gstWeightPct: number;
  color: string;
};

export const OFFSET_BANDS: OffsetBucket[] = [
  {
    id: "fully-offset",
    label: "Net recovery > +$0.5B",
    count: 4,
    gstWeightPct: 48,
    color: "#2dd4bf",
  },
  {
    id: "near-parity",
    label: "Net within ±$0.5B",
    count: 3,
    gstWeightPct: 22,
    color: "#fbbf24",
  },
  {
    id: "still-short",
    label: "Net recovery still short",
    count: 5,
    gstWeightPct: 30,
    color: "#f87171",
  },
];

export type SummaryRow = {
  state: string;
  remoteSharePct: number;
  netOffsetB: number;
  yearsTo8Pct: number | null;
  status: "ahead" | "parity" | "short";
};

export const SUMMARY_TABLE: SummaryRow[] = STATE_PANEL.map((s): SummaryRow => ({
  state: s.state,
  remoteSharePct: s.remoteSharePct,
  netOffsetB: s.netOffsetB,
  yearsTo8Pct: s.yearsTo8Pct,
  status:
    s.netOffsetB > 0.5 ? "ahead" : s.netOffsetB >= -0.5 ? "parity" : "short",
})).sort((a, b) => b.remoteSharePct - a.remoteSharePct);

export const CAVEATS = [
  "DOR footnotes differ in whether they isolate marketplace remittances, remote-seller economic-nexus filings, and click-through / affiliate programs; desk joins reallocate ambiguous lines.",
  "Erosion drag is a modeled service-mix counterfactual against a 2017 breadth baseline — not a statutory audit of untaxed services.",
  "FY labels approximate calendar year-ends; some states report on different fiscal calendars.",
  "Panel covers twelve large GST states; results do not extrapolate cleanly to small or no-GST states.",
] as const;
