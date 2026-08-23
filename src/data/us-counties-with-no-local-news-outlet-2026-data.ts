/**
 * US counties with no local news outlet (2026).
 *
 * Core question: How many US counties have zero or one local
 * newspaper/digital outlet, and how did that change since 2004/2005?
 *
 * Primary anchors: Northwestern Medill State of Local News 2025
 * (county-by-county outlet census); UNC Hussman Expanding News Deserts
 * historical framing for the 2004–2010s newspaper-access era.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "County outlet counts follow Northwestern Medill Local News Initiative, State of Local News 2025 (county-by-county census of newspapers, standalone digital, network digital with original local reporting, ethnic media, and public broadcasters). Zero-outlet “news desert” and one-outlet county totals are disclosed Medill 2025 figures. Population living in limited-access counties (~50M) is Medill’s all-outlet definition; the separate 37M→88M path is Medill’s newspaper-only 0–1 county population comparison (2005 vs 2025). Watch-list risk (>40% chance of becoming a desert within a decade) is Medill/Spiegel Research Center modeling (249 counties). Rural share uses USDA rural classification as reported by Medill. State limited-access population (GA, TX, NC, MS share) is disclosed. Multi-year desert path points outside Medill annual prints are estimated/carried from prior Medill year reports and UNC Hussman Expanding News Deserts era framing — labeled. Public-broadcast reach shares are Medill signal-contour analysis. Not a directory of every masthead; outlet definitions and county-boundary notes follow Medill methodology.";

export const SOURCES = [
  {
    label: "Medill Local News Initiative — State of Local News 2025",
    url: "https://localnewsinitiative.northwestern.edu/projects/state-of-local-news/2025/report/",
  },
  {
    label: "Medill — State of Local News 2025 PDF",
    url: "https://localnewsinitiative.northwestern.edu/assets/slnp/the_state_of_local_news_2025.pdf",
  },
  {
    label: "Medill press — news deserts hit new high (2025)",
    url: "https://www.medill.northwestern.edu/news/2025/news-deserts-hit-new-high-and-50-million-have-limited-access-to-local-news-study-finds.html",
  },
  {
    label: "UNC Hussman — Expanding News Deserts (project archive)",
    url: "https://www.usnewsdeserts.com/",
  },
] as const;

/** Headline punchline — 0–1 outlet counties */
export const HEADLINE = {
  totalUsCounties: 3144,
  zeroOutletCounties2025: 212,
  zeroOutletCounties2024: 206,
  zeroOutletCounties2005: 150,
  oneOutletCounties2025: 1525,
  oneOutletCounties2024: 1563,
  limitedAccessCounties2025: 1737,
  limitedAccessPopM: 50,
  newspaperZeroOneCounties2005: 1400,
  newspaperZeroOnePop2005M: 37,
  newspaperZeroOnePop2025M: 88,
  ruralShareOfDesertsPct: 80,
  watchListCounties: 249,
  watchListRiskThresholdPct: 40,
  newspapersPer100k2005: 3.0,
  newspapersPer100k2025: 1.6,
  newspapersNetLossSince2005: 3400,
  newspaperClosuresPastYear: 148,
  newspapersRemaining: 5400,
  uniqueOwners2005: 3995,
  uniqueOwners2025: 1900,
  circulation2005M: 120,
  circulation2025M: 38,
  publicStationsTracked: 342,
  publicReachDesertsPrimaryPct: 46,
  publicReachDesertsWithRepeatersPct: 82,
  publicReachOneSourceWithRepeatersPct: 90,
  standaloneDigital2025: 695,
  networkDigitalSites2025: 853,
  outletsTracked: 8000,
  mississippiLimitedAccessSharePct: 72,
  georgiaLimitedAccessPopM: 5.0,
  texasLimitedAccessPopM: 4.0,
  northCarolinaLimitedAccessPopM: 2.9,
  newspaperJobs2024: 91550,
  newspaperJobsLostSince2005: 270000,
  newspaperJobsYoYDeclinePct: 7,
} as const;

export type AccessMetric = "allOutlets" | "newspaperOnly";
export type RegionFilter = "all" | "south" | "midwest" | "west" | "northeast";

/** Zero-outlet desert path (counties). Medill annual where noted. */
export const DESERT_PATH: {
  year: number;
  zeroCounties: number;
  oneCounties: number | null;
  confidence: Confidence;
  note?: string;
}[] = [
  {
    year: 2005,
    zeroCounties: 150,
    oneCounties: null,
    confidence: "disclosed",
    note: "Medill: just over 150 lacked a local source",
  },
  {
    year: 2010,
    zeroCounties: 165,
    oneCounties: null,
    confidence: "estimated",
    note: "UNC/Medill-era interpolation",
  },
  {
    year: 2016,
    zeroCounties: 180,
    oneCounties: null,
    confidence: "estimated",
    note: "Expanding News Deserts era",
  },
  {
    year: 2020,
    zeroCounties: 195,
    oneCounties: null,
    confidence: "estimated",
  },
  {
    year: 2022,
    zeroCounties: 200,
    oneCounties: null,
    confidence: "carried",
  },
  {
    year: 2023,
    zeroCounties: 204,
    oneCounties: null,
    confidence: "disclosed",
    note: "Prior Medill print (2024 report baseline)",
  },
  {
    year: 2024,
    zeroCounties: 206,
    oneCounties: 1563,
    confidence: "disclosed",
    note: "Medill 2025: prior-year baseline",
  },
  {
    year: 2025,
    zeroCounties: 212,
    oneCounties: 1525,
    confidence: "disclosed",
    note: "Medill State of Local News 2025",
  },
];

/** Newspaper-only 0–1 county population (Medill twenty-year comparison). */
export const NEWSPAPER_ACCESS_POP: {
  year: number;
  popM: number;
  counties: number;
  confidence: Confidence;
}[] = [
  { year: 2005, popM: 37, counties: 1400, confidence: "disclosed" },
  { year: 2025, popM: 88, counties: 1737, confidence: "estimated" },
];

/**
 * State limited-access population (people in zero- or one-source counties).
 * Top disclosed states + estimated peers for regional controls.
 */
export const STATE_LIMITED_ACCESS: {
  state: string;
  region: Exclude<RegionFilter, "all">;
  limitedAccessPopM: number;
  limitedAccessSharePct: number | null;
  confidence: Confidence;
  note?: string;
}[] = [
  {
    state: "Georgia",
    region: "south",
    limitedAccessPopM: 5.0,
    limitedAccessSharePct: null,
    confidence: "disclosed",
    note: "Most residents in 0–1 source counties",
  },
  {
    state: "Texas",
    region: "south",
    limitedAccessPopM: 4.0,
    limitedAccessSharePct: null,
    confidence: "disclosed",
  },
  {
    state: "North Carolina",
    region: "south",
    limitedAccessPopM: 2.9,
    limitedAccessSharePct: null,
    confidence: "disclosed",
  },
  {
    state: "Mississippi",
    region: "south",
    limitedAccessPopM: 2.1,
    limitedAccessSharePct: 72,
    confidence: "estimated",
    note: "Share disclosed (72%); pop estimated from share",
  },
  {
    state: "Alabama",
    region: "south",
    limitedAccessPopM: 1.8,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "Louisiana",
    region: "south",
    limitedAccessPopM: 1.6,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "Tennessee",
    region: "south",
    limitedAccessPopM: 1.5,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "Kentucky",
    region: "south",
    limitedAccessPopM: 1.4,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "Ohio",
    region: "midwest",
    limitedAccessPopM: 2.2,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "Indiana",
    region: "midwest",
    limitedAccessPopM: 1.5,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "Missouri",
    region: "midwest",
    limitedAccessPopM: 1.4,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "Illinois",
    region: "midwest",
    limitedAccessPopM: 1.3,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "California",
    region: "west",
    limitedAccessPopM: 2.0,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "Arizona",
    region: "west",
    limitedAccessPopM: 1.1,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "New Mexico",
    region: "west",
    limitedAccessPopM: 0.7,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "Pennsylvania",
    region: "northeast",
    limitedAccessPopM: 1.6,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "New York",
    region: "northeast",
    limitedAccessPopM: 1.4,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
  {
    state: "Maine",
    region: "northeast",
    limitedAccessPopM: 0.5,
    limitedAccessSharePct: null,
    confidence: "estimated",
  },
];

/** County access stack for 2025 (all-outlet Medill definition). */
export const ACCESS_STACK_2025: {
  band: string;
  counties: number;
  shareOfCountiesPct: number;
  confidence: Confidence;
}[] = [
  {
    band: "Zero outlets (desert)",
    counties: 212,
    shareOfCountiesPct: 6.7,
    confidence: "disclosed",
  },
  {
    band: "One outlet",
    counties: 1525,
    shareOfCountiesPct: 48.5,
    confidence: "disclosed",
  },
  {
    band: "Two or more",
    counties: 1407,
    shareOfCountiesPct: 44.8,
    confidence: "estimated",
  },
];

/** Rural vs urban composition of deserts. */
export const DESERT_RURAL_SPLIT: {
  label: string;
  sharePct: number;
  confidence: Confidence;
}[] = [
  { label: "USDA rural", sharePct: 80, confidence: "disclosed" },
  { label: "Not predominantly rural", sharePct: 20, confidence: "disclosed" },
];

/** Ecosystem mix tracked by Medill 2025. */
export const OUTLET_MIX_2025: {
  type: string;
  count: number;
  confidence: Confidence;
}[] = [
  { type: "Newspapers", count: 5400, confidence: "disclosed" },
  { type: "Network digital", count: 853, confidence: "disclosed" },
  { type: "Standalone digital", count: 695, confidence: "disclosed" },
  { type: "Ethnic / foreign-language", count: 650, confidence: "disclosed" },
  { type: "Public broadcasters", count: 342, confidence: "disclosed" },
];

/** Public broadcast reach into thin-news counties. */
export const PUBLIC_REACH: {
  metric: string;
  primaryPct: number;
  withRepeatersPct: number;
  confidence: Confidence;
}[] = [
  {
    metric: "News deserts",
    primaryPct: 46,
    withRepeatersPct: 82,
    confidence: "disclosed",
  },
  {
    metric: "One-source counties",
    primaryPct: 53,
    withRepeatersPct: 90,
    confidence: "disclosed",
  },
];

/** Newspaper density & ownership collapse (selected years). */
export const NEWSPAPER_STRUCTURE: {
  year: number;
  papersPer100k: number;
  uniqueOwners: number;
  circulationM: number;
  confidence: Confidence;
}[] = [
  {
    year: 2005,
    papersPer100k: 3.0,
    uniqueOwners: 3995,
    circulationM: 120,
    confidence: "disclosed",
  },
  {
    year: 2015,
    papersPer100k: 2.2,
    uniqueOwners: 2800,
    circulationM: 70,
    confidence: "estimated",
  },
  {
    year: 2025,
    papersPer100k: 1.6,
    uniqueOwners: 1900,
    circulationM: 38,
    confidence: "disclosed",
  },
];

/** Watch-list / risk funnel. */
export const RISK_FUNNEL: {
  stage: string;
  counties: number;
  confidence: Confidence;
  note?: string;
}[] = [
  {
    stage: "US counties",
    counties: 3144,
    confidence: "disclosed",
  },
  {
    stage: "One outlet only",
    counties: 1525,
    confidence: "disclosed",
  },
  {
    stage: "Watch list (>40% desert risk / 10y)",
    counties: 249,
    confidence: "disclosed",
    note: "Medill/Spiegel model",
  },
  {
    stage: "Zero outlets now",
    counties: 212,
    confidence: "disclosed",
  },
];

/** Dual metric: all-outlet limited access vs newspaper-only thin counties. */
export const DUAL_METRIC_COMPARE: {
  metric: string;
  year2005: number;
  year2025: number;
  unit: string;
  confidence: Confidence;
}[] = [
  {
    metric: "Zero-outlet counties (all sources)",
    year2005: 150,
    year2025: 212,
    unit: "counties",
    confidence: "disclosed",
  },
  {
    metric: "People in 0–1 newspaper counties",
    year2005: 37,
    year2025: 88,
    unit: "million people",
    confidence: "disclosed",
  },
  {
    metric: "Newspapers per 100k residents",
    year2005: 3.0,
    year2025: 1.6,
    unit: "papers / 100k",
    confidence: "disclosed",
  },
  {
    metric: "Unique newspaper owners",
    year2005: 3995,
    year2025: 1900,
    unit: "owners",
    confidence: "disclosed",
  },
];

export function fmtM(n: number, digits = 1): string {
  return `${n.toFixed(digits)}M`;
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function desertSeries() {
  return DESERT_PATH.map((d) => ({
    year: d.year,
    zero: d.zeroCounties,
    one: d.oneCounties,
    limited:
      d.oneCounties != null ? d.zeroCounties + d.oneCounties : null,
  }));
}

export function statesByRegion(region: RegionFilter) {
  if (region === "all") return [...STATE_LIMITED_ACCESS];
  return STATE_LIMITED_ACCESS.filter((s) => s.region === region);
}

export function dualMetricBars(metric: AccessMetric) {
  if (metric === "newspaperOnly") {
    return [
      { year: "2005", value: 37, label: "Pop in 0–1 newspaper counties (M)" },
      { year: "2025", value: 88, label: "Pop in 0–1 newspaper counties (M)" },
    ];
  }
  return [
    { year: "2005", value: 150, label: "Zero-outlet counties" },
    { year: "2025", value: 212, label: "Zero-outlet counties" },
  ];
}
