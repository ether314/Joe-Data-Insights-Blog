/**
 * NBI poor / structurally deficient bridges vs average daily traffic (2026 desk).
 *
 * Core question: What share of NBI spans are structurally deficient (poor
 * condition), and how much average daily traffic still crosses them?
 *
 * Terminology: FHWA retired “structurally deficient” after the 2017 Pavement
 * and Bridge Condition Performance Measures rule. Beginning with the 2018
 * archive, the inventory uses Good / Fair / Poor. Poor = any of deck,
 * superstructure, substructure, or culvert rated ≤4. Public reporting and
 * news desks still say “structurally deficient”; this desk treats Poor as
 * the operational successor and labels both.
 *
 * Anchors (published):
 * - FHWA NBI Bridge Condition by Highway System 2024 (6/15/2024 final):
 *   623,218 public highway bridges; 42,080 Poor (6.8%); 274,859 Good;
 *   306,279 Fair. NHS: 147,439 bridges, 4,389 Poor (3.0%).
 * - FHWA NBI Bridge Condition by Functional Classification ADT 2024:
 *   inventory ADT sum ~4.943B; Poor-bridge ADT sum ~168.6M (~3.4% of ADT).
 * - BTS Transportation Statistics Annual Report Fig. 1-5 (Aug 2024 vintage):
 *   poor share of count vs ADT by functional class.
 * - CRS R44459 / R47194: national poor share path ~9.8% (2010) → 9.4%
 *   (2012) → 8.3% (2015) → 7.5% (2019) → 6.8% (2024) → 6.7% (2025).
 *
 * State ADT-on-poor rows use FHWA FCADT 2024 Poor totals summed across
 * functional classes. Illustrative mid-decade ADT shares are desk bridges
 * calibrated to published count shares where ADT tables are not reprinted.
 */

export const SOURCE_NOTE =
  "National bridge counts and Good/Fair/Poor shares follow FHWA National Bridge Inventory Bridge Condition by Highway System 2024 (final as of 6/15/2024). Average daily traffic (ADT) on all bridges and on Poor bridges follows FHWA Bridge Condition by Functional Classification ADT 2024. Functional-class percent-of-count vs percent-of-ADT framing follows BTS TSAR Figure 1-5 (Aug 2024 vintage of the same FHWA tables). Historical poor-share path follows CRS highway-bridge condition briefs citing NBI. FHWA eliminated the label “structurally deficient” beginning with the 2018 archive; Poor condition is the successor metric used throughout this desk.";

export const SOURCES = [
  {
    label: "FHWA — Bridge Condition by Highway System 2024",
    url: "https://www.fhwa.dot.gov/bridge/nbi/no10/condition24.cfm",
  },
  {
    label: "FHWA — Bridge Condition by Functional Classification ADT 2024",
    url: "https://www.fhwa.dot.gov/bridge/nbi/no10/fcadt24.cfm",
  },
  {
    label: "FHWA — Tables of Frequently Requested NBI Information",
    url: "https://www.fhwa.dot.gov/bridge/britab.cfm",
  },
  {
    label: "BTS — Bridges in Poor Condition and Avg Daily Traffic on Bridges 2024",
    url: "https://www.bts.gov/browse-statistical-products-and-data/info-gallery/bridges-poor-condition-and-avg-daily-traffic-0",
  },
  {
    label: "CRS — Highway Bridges: Conditions, Funding Programs, and Issues (R47194)",
    url: "https://www.everycrsreport.com/reports/R47194.html",
  },
] as const;

/** Headline punchline — 2024 NBI final */
export const HEADLINE = {
  totalBridges: 623_218,
  goodBridges: 274_859,
  fairBridges: 306_279,
  poorBridges: 42_080,
  poorSharePct: 6.75,
  goodSharePct: 44.1,
  fairSharePct: 49.15,
  /** Sum of ADT across all NBI spans (vehicles/day on each span, not unique trips) */
  totalAdt: 4_943_428_850,
  poorAdt: 168_605_928,
  poorAdtSharePct: 3.41,
  /** NHS subset */
  nhsBridges: 147_439,
  nhsPoor: 4_389,
  nhsPoorSharePct: 2.98,
  nonNhsBridges: 475_779,
  nonNhsPoor: 37_691,
  nonNhsPoorSharePct: 7.92,
  /** Deck area (sq m) */
  totalDeckSqM: 406_604_942,
  poorDeckSqM: 19_774_641,
  poorDeckSharePct: 4.86,
  /** Urban vs rural poor ADT */
  ruralPoorAdt: 33_076_735,
  urbanPoorAdt: 135_529_193,
  urbanPoorAdtShareOfPoorPct: 80.4,
  /** CRS 2025 print for context */
  poorBridges2025: 41_685,
  poorShare2025Pct: 6.7,
} as const;

export const VIZ_MARKERS = [
  "6.8% of NBI spans are Poor / structurally deficient",
  "168.6M ADT still crosses those Poor spans",
] as const;

export type Confidence = "fhwa" | "bts" | "crs" | "composite";

export type FunctionalClassId =
  | "r-interstate"
  | "r-other-principal"
  | "r-minor-arterial"
  | "r-major-collector"
  | "r-minor-collector"
  | "r-local"
  | "u-interstate"
  | "u-freeway"
  | "u-other-principal"
  | "u-minor-arterial"
  | "u-collector"
  | "u-local";

/** National Good / Fair / Poor inventory split (2024) */
export const CONDITION_SPLIT = [
  {
    id: "good",
    label: "Good",
    bridges: HEADLINE.goodBridges,
    sharePct: HEADLINE.goodSharePct,
    color: "#0d9488",
  },
  {
    id: "fair",
    label: "Fair",
    bridges: HEADLINE.fairBridges,
    sharePct: HEADLINE.fairSharePct,
    color: "#d97706",
  },
  {
    id: "poor",
    label: "Poor (structurally deficient successor)",
    bridges: HEADLINE.poorBridges,
    sharePct: HEADLINE.poorSharePct,
    color: "#e11d48",
  },
] as const;

/** Count share vs ADT share — the core mismatch */
export const COUNT_VS_ADT = [
  {
    metric: "Share of bridge count",
    poorPct: HEADLINE.poorSharePct,
    nonPoorPct: 100 - HEADLINE.poorSharePct,
  },
  {
    metric: "Share of inventory ADT",
    poorPct: HEADLINE.poorAdtSharePct,
    nonPoorPct: 100 - HEADLINE.poorAdtSharePct,
  },
  {
    metric: "Share of deck area",
    poorPct: HEADLINE.poorDeckSharePct,
    nonPoorPct: 100 - HEADLINE.poorDeckSharePct,
  },
] as const;

/** Highway system: NHS vs non-NHS poor intensity */
export const HIGHWAY_SYSTEM = [
  {
    id: "nhs",
    label: "National Highway System",
    bridges: HEADLINE.nhsBridges,
    poor: HEADLINE.nhsPoor,
    poorSharePct: HEADLINE.nhsPoorSharePct,
  },
  {
    id: "non-nhs",
    label: "Non-NHS",
    bridges: HEADLINE.nonNhsBridges,
    poor: HEADLINE.nonNhsPoor,
    poorSharePct: HEADLINE.nonNhsPoorSharePct,
  },
  {
    id: "all",
    label: "All public highway bridges",
    bridges: HEADLINE.totalBridges,
    poor: HEADLINE.poorBridges,
    poorSharePct: HEADLINE.poorSharePct,
  },
] as const;

/**
 * Functional class: Poor ADT totals (FHWA FCADT 2024) and BTS-style % of
 * class ADT / desk-aligned % of class count where published.
 */
export const FUNCTIONAL_CLASS: Array<{
  id: FunctionalClassId;
  label: string;
  setting: "Rural" | "Urban";
  poorAdt: number;
  allAdt: number;
  poorAdtSharePct: number;
  /** BTS Fig 1-5 / FHWA FC count share of class that is Poor */
  poorCountSharePct: number;
  confidence: Confidence;
}> = [
  {
    id: "r-interstate",
    label: "Rural Interstate",
    setting: "Rural",
    poorAdt: 9_710_405,
    allAdt: 423_075_701,
    poorAdtSharePct: 2.3,
    poorCountSharePct: 2.61,
    confidence: "fhwa",
  },
  {
    id: "r-other-principal",
    label: "Rural other principal arterial",
    setting: "Rural",
    poorAdt: 5_800_786,
    allAdt: 263_000_926,
    poorAdtSharePct: 2.21,
    poorCountSharePct: 3.16,
    confidence: "fhwa",
  },
  {
    id: "r-minor-arterial",
    label: "Rural minor arterial",
    setting: "Rural",
    poorAdt: 4_741_951,
    allAdt: 133_183_409,
    poorAdtSharePct: 3.56,
    poorCountSharePct: 6.88,
    confidence: "bts",
  },
  {
    id: "r-major-collector",
    label: "Rural major collector",
    setting: "Rural",
    poorAdt: 6_964_324,
    allAdt: 125_472_493,
    poorAdtSharePct: 5.55,
    poorCountSharePct: 10.46,
    confidence: "bts",
  },
  {
    id: "r-minor-collector",
    label: "Rural minor collector",
    setting: "Rural",
    poorAdt: 1_940_935,
    allAdt: 30_483_498,
    poorAdtSharePct: 6.37,
    poorCountSharePct: 7.66,
    confidence: "bts",
  },
  {
    id: "r-local",
    label: "Rural local",
    setting: "Rural",
    poorAdt: 3_918_334,
    allAdt: 56_982_665,
    poorAdtSharePct: 6.88,
    poorCountSharePct: 10.5,
    confidence: "composite",
  },
  {
    id: "u-interstate",
    label: "Urban Interstate",
    setting: "Urban",
    poorAdt: 52_997_642,
    allAdt: 1_817_956_144,
    poorAdtSharePct: 2.92,
    poorCountSharePct: 2.8,
    confidence: "bts",
  },
  {
    id: "u-freeway",
    label: "Urban other freeway / expressway",
    setting: "Urban",
    poorAdt: 22_140_913,
    allAdt: 844_608_047,
    poorAdtSharePct: 2.62,
    poorCountSharePct: 3.55,
    confidence: "bts",
  },
  {
    id: "u-other-principal",
    label: "Urban other principal arterial",
    setting: "Urban",
    poorAdt: 28_412_390,
    allAdt: 606_093_461,
    poorAdtSharePct: 4.69,
    poorCountSharePct: 5.59,
    confidence: "bts",
  },
  {
    id: "u-minor-arterial",
    label: "Urban minor arterial",
    setting: "Urban",
    poorAdt: 19_263_108,
    allAdt: 379_126_200,
    poorAdtSharePct: 5.08,
    poorCountSharePct: 6.54,
    confidence: "bts",
  },
  {
    id: "u-collector",
    label: "Urban collector",
    setting: "Urban",
    poorAdt: 7_284_134,
    allAdt: 158_622_122,
    poorAdtSharePct: 4.59,
    poorCountSharePct: 4.68,
    confidence: "bts",
  },
  {
    id: "u-local",
    label: "Urban local",
    setting: "Urban",
    poorAdt: 5_431_006,
    allAdt: 104_824_184,
    poorAdtSharePct: 5.18,
    poorCountSharePct: 6.9,
    confidence: "composite",
  },
];

/** Historical poor-share path (CRS / NBI) with illustrative ADT share bridges */
export const POOR_TREND: Array<{
  year: number;
  poorSharePct: number;
  poorCount: number | null;
  /** Share of inventory ADT on Poor spans; null = not in that vintage table */
  poorAdtSharePct: number | null;
  confidence: Confidence;
  note: string;
}> = [
  {
    year: 2010,
    poorSharePct: 9.8,
    poorCount: null,
    poorAdtSharePct: 5.2,
    confidence: "crs",
    note: "CRS R44459 count share; ADT share desk-bridged",
  },
  {
    year: 2012,
    poorSharePct: 9.4,
    poorCount: 57_049,
    poorAdtSharePct: 4.9,
    confidence: "crs",
    note: "CRS R47194 Table 1",
  },
  {
    year: 2015,
    poorSharePct: 8.3,
    poorCount: null,
    poorAdtSharePct: 4.4,
    confidence: "crs",
    note: "CRS R44459",
  },
  {
    year: 2018,
    poorSharePct: 7.6,
    poorCount: null,
    poorAdtSharePct: 4.0,
    confidence: "crs",
    note: "First full Poor-label archive year",
  },
  {
    year: 2019,
    poorSharePct: 7.5,
    poorCount: null,
    poorAdtSharePct: 3.9,
    confidence: "crs",
    note: "CRS R44459",
  },
  {
    year: 2020,
    poorSharePct: 7.3,
    poorCount: null,
    poorAdtSharePct: 3.7,
    confidence: "composite",
    note: "Interpolated between CRS 2019 and FHWA 2024",
  },
  {
    year: 2024,
    poorSharePct: 6.75,
    poorCount: 42_080,
    poorAdtSharePct: 3.41,
    confidence: "fhwa",
    note: "FHWA condition24 + fcadt24",
  },
  {
    year: 2025,
    poorSharePct: 6.7,
    poorCount: 41_685,
    poorAdtSharePct: null,
    confidence: "crs",
    note: "CRS R47194 2025 print; ADT table not yet paired here",
  },
];

/** Rural vs urban traffic still on Poor spans */
export const RURAL_URBAN_POOR_ADT = [
  {
    id: "rural",
    label: "Rural Poor ADT",
    adt: HEADLINE.ruralPoorAdt,
    shareOfPoorAdtPct: 19.6,
    color: "#0284c7",
  },
  {
    id: "urban",
    label: "Urban Poor ADT",
    adt: HEADLINE.urbanPoorAdt,
    shareOfPoorAdtPct: HEADLINE.urbanPoorAdtShareOfPoorPct,
    color: "#e11d48",
  },
] as const;

export type StateRow = {
  state: string;
  abbr: string;
  bridges: number;
  poor: number;
  poorSharePct: number;
  /** Sum of Poor ADT across FC (FHWA fcadt24) */
  poorAdt: number;
  region: "Northeast" | "Midwest" | "South" | "West" | "Territory";
};

/** Selected states spanning high count, high share, and high ADT-on-poor */
export const STATE_PANEL: StateRow[] = [
  {
    state: "Iowa",
    abbr: "IA",
    bridges: 23_719,
    poor: 4_544,
    poorSharePct: 19.16,
    poorAdt: 1_219_770,
    region: "Midwest",
  },
  {
    state: "West Virginia",
    abbr: "WV",
    bridges: 7_348,
    poor: 1_370,
    poorSharePct: 18.64,
    poorAdt: 3_655_838,
    region: "South",
  },
  {
    state: "South Dakota",
    abbr: "SD",
    bridges: 5_887,
    poor: 963,
    poorSharePct: 16.36,
    poorAdt: 274_621,
    region: "Midwest",
  },
  {
    state: "Rhode Island",
    abbr: "RI",
    bridges: 783,
    poor: 119,
    poorSharePct: 15.2,
    poorAdt: 2_255_178,
    region: "Northeast",
  },
  {
    state: "Maine",
    abbr: "ME",
    bridges: 2_518,
    poor: 388,
    poorSharePct: 15.41,
    poorAdt: 1_162_675,
    region: "Northeast",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    bridges: 23_299,
    poor: 2_932,
    poorSharePct: 12.58,
    poorAdt: 10_491_794,
    region: "Northeast",
  },
  {
    state: "Illinois",
    abbr: "IL",
    bridges: 26_928,
    poor: 2_517,
    poorSharePct: 9.35,
    poorAdt: 11_142_194,
    region: "Midwest",
  },
  {
    state: "New York",
    abbr: "NY",
    bridges: 17_642,
    poor: 1_664,
    poorSharePct: 9.43,
    poorAdt: 13_829_195,
    region: "Northeast",
  },
  {
    state: "California",
    abbr: "CA",
    bridges: 25_848,
    poor: 1_527,
    poorSharePct: 5.91,
    poorAdt: 28_723_467,
    region: "West",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    bridges: 5_296,
    poor: 470,
    poorSharePct: 8.87,
    poorAdt: 10_639_704,
    region: "Northeast",
  },
  {
    state: "Louisiana",
    abbr: "LA",
    bridges: 12_698,
    poor: 1_458,
    poorSharePct: 11.48,
    poorAdt: 5_073_761,
    region: "South",
  },
  {
    state: "Missouri",
    abbr: "MO",
    bridges: 24_618,
    poor: 2_203,
    poorSharePct: 8.95,
    poorAdt: 4_349_846,
    region: "Midwest",
  },
  {
    state: "Michigan",
    abbr: "MI",
    bridges: 11_371,
    poor: 1_281,
    poorSharePct: 11.27,
    poorAdt: 6_748_764,
    region: "Midwest",
  },
  {
    state: "Texas",
    abbr: "TX",
    bridges: 56_729,
    poor: 695,
    poorSharePct: 1.22,
    poorAdt: 3_474_857,
    region: "South",
  },
  {
    state: "Florida",
    abbr: "FL",
    bridges: 13_036,
    poor: 364,
    poorSharePct: 2.79,
    poorAdt: 1_998_303,
    region: "South",
  },
  {
    state: "Georgia",
    abbr: "GA",
    bridges: 15_069,
    poor: 240,
    poorSharePct: 1.59,
    poorAdt: 437_128,
    region: "South",
  },
  {
    state: "Arizona",
    abbr: "AZ",
    bridges: 8_573,
    poor: 99,
    poorSharePct: 1.15,
    poorAdt: 304_309,
    region: "West",
  },
  {
    state: "Oklahoma",
    abbr: "OK",
    bridges: 22_917,
    poor: 1_764,
    poorSharePct: 7.7,
    poorAdt: 1_343_107,
    region: "South",
  },
  {
    state: "Washington",
    abbr: "WA",
    bridges: 8_474,
    poor: 462,
    poorSharePct: 5.45,
    poorAdt: 2_894_985,
    region: "West",
  },
  {
    state: "Puerto Rico",
    abbr: "PR",
    bridges: 2_385,
    poor: 332,
    poorSharePct: 13.92,
    poorAdt: 4_429_180,
    region: "Territory",
  },
];

export function fmtCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtAdt(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return fmtCount(n);
}

export function stateScatterRows(region: "All" | StateRow["region"] = "All") {
  return STATE_PANEL.filter((s) => region === "All" || s.region === region).map(
    (s) => ({
      ...s,
      x: s.poorSharePct,
      y: s.poorAdt / 1_000_000,
      z: Math.max(40, Math.sqrt(s.poor) * 4),
    }),
  );
}

export function functionalClassFiltered(
  setting: "All" | "Rural" | "Urban" = "All",
) {
  return FUNCTIONAL_CLASS.filter(
    (r) => setting === "All" || r.setting === setting,
  );
}
