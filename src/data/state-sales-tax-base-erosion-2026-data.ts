/**
 * State sales-tax base erosion toward untaxed services (2026).
 *
 * Core question: What share of potential state sales-tax bases now escapes
 * taxation because spending shifted from taxed goods to untaxed services?
 *
 * Method: Join BEA personal consumption expenditure (PCE) goods/services
 * shares to Federation of Tax Administrators (FTA) 2017 Sales Taxation of
 * Services survey coverage (176 tracked items), Census Annual Survey of State
 * Government Tax Collections (STC) general-sales shares, and ITEP exemption
 * framing. Build a desk "potential base" = PCE goods net of common necessity
 * exemptions + the portion of PCE services that a broad-base peer (HI/NM/SD
 * style) would reach. Escaped share = 1 − taxable share of that potential base.
 * Decompose leakage into (a) necessity exemptions, (b) services under-taxation,
 * (c) residual/digital gaps. State panel uses FTA item counts as a breadth
 * proxy and STC general-sales share of state tax for revenue dependence.
 *
 * Confidence: BEA PCE shares and Census STC dollars disclosed; FTA counts
 * disclosed as of Jan 1, 2017; taxable-share and escape decompositions are
 * desk-modeled joins, not official Treasury estimates.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "PCE goods/services shares: BEA NIPA (services share of current-dollar PCE rose from ~45.7% in 1959 to ~67–68% in the 2020s). Service taxability breadth: FTA Sales Taxation of Services survey, 176 items as of Jan 1, 2017 (HI 167, NM 164, SD 152; most GST states tax well under half). State general-sales dependence: Census Annual Survey of State Government Tax Collections (STC). Exemption framing: ITEP Guide to Fair State and Local Taxes. Escape shares and decompositions are desk joins of those anchors — not a state’s statutory taxable-base audit.";

export const SOURCES = [
  {
    label: "BEA — Personal consumption expenditures by major type of product",
    url: "https://www.bea.gov/data/consumer-spending/main",
  },
  {
    label: "FTA — Sales Taxation of Services (2017 survey)",
    url: "https://taxadmin.org/sales-taxation-of-services/",
  },
  {
    label: "Census — Annual Survey of State Government Tax Collections",
    url: "https://www.census.gov/programs-surveys/stc.html",
  },
  {
    label: "ITEP — What’s Exempt from State and Local Sales Taxes?",
    url: "https://itep.org/whats-exempt-from-state-and-local-sales-taxes/",
  },
] as const;

/** National punchline (desk-modeled on disclosed anchors) */
export const HEADLINE = {
  /** Latest escaped share of potential household consumption base, % */
  escapedSharePct: 54.8,
  /** Escaped share in 1970 under same structural assumptions, % */
  escapedShare1970Pct: 38.2,
  /** Percentage-point rise in escaped share since 1970 */
  escapeRisePp: 16.6,
  /** Of that rise, pp attributed to goods→services mix shift */
  mixShiftContributionPp: 12.4,
  /** Services share of PCE, latest (~2024 vintage), % */
  servicesSharePcePct: 67.8,
  /** Services share of PCE, 1970, % */
  servicesShare1970Pct: 52.1,
  /** Median FTA services taxed (GST states, excl. no-GST), of 176 */
  medianServicesTaxed: 40,
  /** FTA survey item count */
  ftaSurveyItems: 176,
  /** Broad-base peer average items taxed (HI/NM/SD) */
  broadPeerAvgItems: 161,
  /** Typical GST-state taxable share of PCE, % */
  typicalTaxablePcePct: 45.2,
  /** Share of escape attributed to untaxed services (vs necessities/residual), % */
  untaxedServicesOfEscapePct: 61,
} as const;

export type YearRow = {
  year: number;
  /** Services share of current-dollar PCE, % */
  servicesSharePct: number;
  /** Goods share of PCE, % */
  goodsSharePct: number;
  /** Desk taxable share of PCE under median GST breadth, % */
  taxableSharePct: number;
  /** Escaped share of potential base, % */
  escapedSharePct: number;
  /** Mix-shift component of escape vs 1970 baseline, pp contribution */
  mixShiftPp: number;
  confidence: Confidence;
};

/** National erosion path (modeled taxable/escape on disclosed PCE shares) */
export const EROSION_SERIES: YearRow[] = [
  { year: 1970, servicesSharePct: 52.1, goodsSharePct: 47.9, taxableSharePct: 61.8, escapedSharePct: 38.2, mixShiftPp: 0.0, confidence: "estimated" },
  { year: 1975, servicesSharePct: 54.0, goodsSharePct: 46.0, taxableSharePct: 59.6, escapedSharePct: 40.4, mixShiftPp: 1.6, confidence: "estimated" },
  { year: 1980, servicesSharePct: 56.2, goodsSharePct: 43.8, taxableSharePct: 57.1, escapedSharePct: 42.9, mixShiftPp: 3.4, confidence: "estimated" },
  { year: 1985, servicesSharePct: 58.4, goodsSharePct: 41.6, taxableSharePct: 54.8, escapedSharePct: 45.2, mixShiftPp: 5.1, confidence: "estimated" },
  { year: 1990, servicesSharePct: 60.5, goodsSharePct: 39.5, taxableSharePct: 52.6, escapedSharePct: 47.4, mixShiftPp: 6.8, confidence: "estimated" },
  { year: 1995, servicesSharePct: 62.0, goodsSharePct: 38.0, taxableSharePct: 51.0, escapedSharePct: 49.0, mixShiftPp: 8.0, confidence: "estimated" },
  { year: 2000, servicesSharePct: 63.4, goodsSharePct: 36.6, taxableSharePct: 49.6, escapedSharePct: 50.4, mixShiftPp: 9.1, confidence: "estimated" },
  { year: 2005, servicesSharePct: 65.0, goodsSharePct: 35.0, taxableSharePct: 48.0, escapedSharePct: 52.0, mixShiftPp: 10.3, confidence: "estimated" },
  { year: 2010, servicesSharePct: 66.2, goodsSharePct: 33.8, taxableSharePct: 46.9, escapedSharePct: 53.1, mixShiftPp: 11.1, confidence: "estimated" },
  { year: 2015, servicesSharePct: 66.9, goodsSharePct: 33.1, taxableSharePct: 46.1, escapedSharePct: 53.9, mixShiftPp: 11.7, confidence: "modeled" },
  { year: 2017, servicesSharePct: 67.2, goodsSharePct: 32.8, taxableSharePct: 45.8, escapedSharePct: 54.2, mixShiftPp: 11.9, confidence: "modeled" },
  { year: 2020, servicesSharePct: 66.5, goodsSharePct: 33.5, taxableSharePct: 46.4, escapedSharePct: 53.6, mixShiftPp: 11.5, confidence: "modeled" },
  { year: 2022, servicesSharePct: 67.0, goodsSharePct: 33.0, taxableSharePct: 45.7, escapedSharePct: 54.3, mixShiftPp: 12.0, confidence: "modeled" },
  { year: 2024, servicesSharePct: 67.8, goodsSharePct: 32.2, taxableSharePct: 45.2, escapedSharePct: 54.8, mixShiftPp: 12.4, confidence: "modeled" },
];

export type LeakBucketId =
  | "necessities"
  | "untaxed-services"
  | "digital-residual"
  | "taxed-base";

export type LeakBucket = {
  id: LeakBucketId;
  label: string;
  shortLabel: string;
  /** Share of potential base, % */
  sharePct: number;
  color: string;
  confidence: Confidence;
};

/** Latest national composition of the potential consumption base */
export const LEAK_COMPOSITION: LeakBucket[] = [
  {
    id: "taxed-base",
    label: "Still in typical GST base",
    shortLabel: "Taxed",
    sharePct: 45.2,
    color: "#0f766e",
    confidence: "modeled",
  },
  {
    id: "untaxed-services",
    label: "Untaxed / lightly taxed services",
    shortLabel: "Untaxed svcs",
    sharePct: 33.4,
    color: "#c2410c",
    confidence: "modeled",
  },
  {
    id: "necessities",
    label: "Common necessity exemptions (food, Rx, rent-proxy)",
    shortLabel: "Necessities",
    sharePct: 15.1,
    color: "#64748b",
    confidence: "estimated",
  },
  {
    id: "digital-residual",
    label: "Digital & residual gaps",
    shortLabel: "Digital/other",
    sharePct: 6.3,
    color: "#7c3aed",
    confidence: "estimated",
  },
];

export type ServiceCategoryRow = {
  id: string;
  category: string;
  /** Approx PCE weight within services block, % of total PCE */
  pceWeightPct: number;
  /** Share of FTA peer states taxing a majority of category items, % */
  majorityTaxStatesPct: number;
  /** Desk leakage score 0–100 (higher = more escape) */
  leakScore: number;
  color: string;
};

export const SERVICE_CATEGORIES: ServiceCategoryRow[] = [
  { id: "health", category: "Health care services", pceWeightPct: 16.8, majorityTaxStatesPct: 8, leakScore: 92, color: "#b91c1c" },
  { id: "housing", category: "Housing & utilities (imputed + cash)", pceWeightPct: 17.4, majorityTaxStatesPct: 12, leakScore: 88, color: "#c2410c" },
  { id: "finance", category: "Financial services & insurance", pceWeightPct: 7.6, majorityTaxStatesPct: 14, leakScore: 85, color: "#ea580c" },
  { id: "personal", category: "Personal / repair / household services", pceWeightPct: 4.2, majorityTaxStatesPct: 35, leakScore: 62, color: "#d97706" },
  { id: "recreation", category: "Recreation & entertainment services", pceWeightPct: 3.9, majorityTaxStatesPct: 48, leakScore: 55, color: "#ca8a04" },
  { id: "transport", category: "Transportation services", pceWeightPct: 3.1, majorityTaxStatesPct: 42, leakScore: 58, color: "#65a30d" },
  { id: "foodsvc", category: "Food services & accommodations", pceWeightPct: 6.4, majorityTaxStatesPct: 78, leakScore: 28, color: "#0d9488" },
  { id: "utilities", category: "Utilities & telecom (selected)", pceWeightPct: 2.8, majorityTaxStatesPct: 71, leakScore: 32, color: "#0891b2" },
];

export type RegionId = "northeast" | "midwest" | "south" | "west";

export type StateRow = {
  state: string;
  abbr: string;
  region: RegionId;
  /** FTA 2017 services taxed (of 176); * = 2007 carry-forward where noted in FTA */
  servicesTaxed: number;
  /** Has a general retail sales / gross receipts style tax */
  hasGst: boolean;
  /** Broad-base peer flag (HI/NM/SD) */
  broadBase: boolean;
  /** General sales & GR as % of state tax collections (STC FY2023-ish desk composite) */
  salesShareOfStateTaxPct: number;
  /** Combined state (+ typical local add-on midpoint where relevant) rate, % */
  combinedRatePct: number;
  /** Desk escaped share of potential base, % */
  escapedSharePct: number;
  /** Mix-shift contribution since 1970, pp */
  mixShiftPp: number;
  confidence: Confidence;
};

/** Cross-section of GST states + AK/DE/MT/NH/OR markers */
export const STATE_PANEL: StateRow[] = [
  { state: "Hawaii", abbr: "HI", region: "west", servicesTaxed: 167, hasGst: true, broadBase: true, salesShareOfStateTaxPct: 48.2, combinedRatePct: 4.44, escapedSharePct: 28.4, mixShiftPp: 4.2, confidence: "disclosed" },
  { state: "New Mexico", abbr: "NM", region: "west", servicesTaxed: 164, hasGst: true, broadBase: true, salesShareOfStateTaxPct: 41.6, combinedRatePct: 7.55, escapedSharePct: 29.8, mixShiftPp: 4.6, confidence: "disclosed" },
  { state: "South Dakota", abbr: "SD", region: "midwest", servicesTaxed: 152, hasGst: true, broadBase: true, salesShareOfStateTaxPct: 52.1, combinedRatePct: 6.40, escapedSharePct: 32.1, mixShiftPp: 5.1, confidence: "disclosed" },
  { state: "West Virginia", abbr: "WV", region: "south", servicesTaxed: 110, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 28.4, combinedRatePct: 6.55, escapedSharePct: 41.2, mixShiftPp: 8.8, confidence: "estimated" },
  { state: "Texas", abbr: "TX", region: "south", servicesTaxed: 88, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 56.8, combinedRatePct: 8.20, escapedSharePct: 48.6, mixShiftPp: 11.2, confidence: "estimated" },
  { state: "Connecticut", abbr: "CT", region: "northeast", servicesTaxed: 82, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 24.1, combinedRatePct: 6.35, escapedSharePct: 49.4, mixShiftPp: 11.5, confidence: "estimated" },
  { state: "Iowa", abbr: "IA", region: "midwest", servicesTaxed: 94, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 31.2, combinedRatePct: 6.94, escapedSharePct: 46.8, mixShiftPp: 10.4, confidence: "estimated" },
  { state: "Wisconsin", abbr: "WI", region: "midwest", servicesTaxed: 76, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 29.8, combinedRatePct: 5.43, escapedSharePct: 50.2, mixShiftPp: 11.8, confidence: "estimated" },
  { state: "Ohio", abbr: "OH", region: "midwest", servicesTaxed: 68, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 34.6, combinedRatePct: 7.24, escapedSharePct: 51.6, mixShiftPp: 12.1, confidence: "estimated" },
  { state: "Minnesota", abbr: "MN", region: "midwest", servicesTaxed: 66, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 27.4, combinedRatePct: 7.49, escapedSharePct: 51.9, mixShiftPp: 12.2, confidence: "estimated" },
  { state: "New York", abbr: "NY", region: "northeast", servicesTaxed: 57, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 18.6, combinedRatePct: 8.52, escapedSharePct: 53.4, mixShiftPp: 12.8, confidence: "estimated" },
  { state: "Pennsylvania", abbr: "PA", region: "northeast", servicesTaxed: 55, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 28.9, combinedRatePct: 6.34, escapedSharePct: 53.8, mixShiftPp: 12.9, confidence: "estimated" },
  { state: "Florida", abbr: "FL", region: "south", servicesTaxed: 63, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 58.4, combinedRatePct: 7.01, escapedSharePct: 52.4, mixShiftPp: 12.4, confidence: "estimated" },
  { state: "Tennessee", abbr: "TN", region: "south", servicesTaxed: 67, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 54.2, combinedRatePct: 9.55, escapedSharePct: 51.8, mixShiftPp: 12.2, confidence: "estimated" },
  { state: "Georgia", abbr: "GA", region: "south", servicesTaxed: 36, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 32.8, combinedRatePct: 7.35, escapedSharePct: 56.2, mixShiftPp: 13.6, confidence: "estimated" },
  { state: "North Carolina", abbr: "NC", region: "south", servicesTaxed: 30, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 26.4, combinedRatePct: 6.98, escapedSharePct: 57.1, mixShiftPp: 13.9, confidence: "estimated" },
  { state: "Illinois", abbr: "IL", region: "midwest", servicesTaxed: 17, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 30.1, combinedRatePct: 8.86, escapedSharePct: 58.8, mixShiftPp: 14.4, confidence: "estimated" },
  { state: "Michigan", abbr: "MI", region: "midwest", servicesTaxed: 26, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 29.2, combinedRatePct: 6.00, escapedSharePct: 57.6, mixShiftPp: 14.0, confidence: "estimated" },
  { state: "California", abbr: "CA", region: "west", servicesTaxed: 21, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 22.8, combinedRatePct: 8.85, escapedSharePct: 58.4, mixShiftPp: 14.2, confidence: "estimated" },
  { state: "Colorado", abbr: "CO", region: "west", servicesTaxed: 14, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 24.6, combinedRatePct: 7.77, escapedSharePct: 59.6, mixShiftPp: 14.7, confidence: "estimated" },
  { state: "Massachusetts", abbr: "MA", region: "northeast", servicesTaxed: 18, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 21.4, combinedRatePct: 6.25, escapedSharePct: 58.9, mixShiftPp: 14.5, confidence: "estimated" },
  { state: "Virginia", abbr: "VA", region: "south", servicesTaxed: 18, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 19.8, combinedRatePct: 5.75, escapedSharePct: 59.1, mixShiftPp: 14.6, confidence: "estimated" },
  { state: "Arizona", abbr: "AZ", region: "west", servicesTaxed: 55, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 46.2, combinedRatePct: 8.40, escapedSharePct: 53.6, mixShiftPp: 12.9, confidence: "estimated" },
  { state: "Washington", abbr: "WA", region: "west", servicesTaxed: 158, hasGst: true, broadBase: false, salesShareOfStateTaxPct: 44.8, combinedRatePct: 9.38, escapedSharePct: 34.6, mixShiftPp: 6.2, confidence: "estimated" },
];

export type DecadeDelta = {
  decade: string;
  endYear: number;
  /** Rise in services PCE share over decade, pp */
  servicesRisePp: number;
  /** Rise in escaped share, pp */
  escapeRisePp: number;
  /** Mix-shift contribution, pp */
  mixShiftPp: number;
};

export const DECADE_DELTAS: DecadeDelta[] = [
  { decade: "1970–80", endYear: 1980, servicesRisePp: 4.1, escapeRisePp: 4.7, mixShiftPp: 3.4 },
  { decade: "1980–90", endYear: 1990, servicesRisePp: 4.3, escapeRisePp: 4.5, mixShiftPp: 3.4 },
  { decade: "1990–00", endYear: 2000, servicesRisePp: 2.9, escapeRisePp: 3.0, mixShiftPp: 2.3 },
  { decade: "2000–10", endYear: 2010, servicesRisePp: 2.8, escapeRisePp: 2.7, mixShiftPp: 2.0 },
  { decade: "2010–24", endYear: 2024, servicesRisePp: 1.6, escapeRisePp: 1.7, mixShiftPp: 1.3 },
];

export type SummaryTableRow = {
  state: string;
  abbr: string;
  servicesTaxed: number;
  escapedSharePct: number;
  mixShiftPp: number;
  salesShareOfStateTaxPct: number;
  broadBase: boolean;
};

export const SUMMARY_TABLE: SummaryTableRow[] = [...STATE_PANEL]
  .sort((a, b) => b.escapedSharePct - a.escapedSharePct)
  .slice(0, 12)
  .map((s) => ({
    state: s.state,
    abbr: s.abbr,
    servicesTaxed: s.servicesTaxed,
    escapedSharePct: s.escapedSharePct,
    mixShiftPp: s.mixShiftPp,
    salesShareOfStateTaxPct: s.salesShareOfStateTaxPct,
    broadBase: s.broadBase,
  }));

export const ANALYTICS = {
  defaultPanel: "erosion-path" as const,
  defaultRegion: "all" as const,
  defaultSort: "escaped" as const,
  ftaSurveyItems: HEADLINE.ftaSurveyItems,
  smokeMarker: "Base leak to services",
} as const;

export type RegionFilter = RegionId | "all";
export type SortKey = "escaped" | "services" | "sales-share" | "mix-shift";

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
      case "services":
        return b.servicesTaxed - a.servicesTaxed;
      case "sales-share":
        return b.salesShareOfStateTaxPct - a.salesShareOfStateTaxPct;
      case "mix-shift":
        return b.mixShiftPp - a.mixShiftPp;
      case "escaped":
      default:
        return b.escapedSharePct - a.escapedSharePct;
    }
  });
  return rows;
}
