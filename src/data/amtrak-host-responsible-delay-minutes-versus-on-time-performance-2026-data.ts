/**
 * Amtrak host-responsible delay minutes versus on-time performance (2026).
 *
 * Core question: What share of delay minutes on state-supported and
 * long-distance trains is charged to host railroads versus Amtrak?
 *
 * Primary anchors: FRA Quarterly Report on the Performance and Service
 * Quality of Intercity Passenger Train Operations (FY2025 Q1 PDF);
 * Amtrak Host Railroad Report Card 2024; Amtrak monthly host railroad
 * reports / on-time performance route tables (CY2024). Host share and
 * scatter correlations are desk calculations from disclosed minutes and
 * customer OTP — not a new FRA index.
 */

export type Confidence = "disclosed" | "derived" | "estimated";

export const SOURCE_NOTE =
  "Delay minutes per 10,000 train-miles by responsibility (Amtrak, host, " +
  "third party) and Class I host delay-code stacks follow FRA's FY2025 Q1 " +
  "Performance and Service Quality Report (Oct–Dec 2024 window). Customer " +
  "on-time performance (OTP) is the share of customers arriving within 15 " +
  "minutes of schedule (10 minutes for Acela), per the Metrics and Minimum " +
  "Standards rule. CY2024 route OTP and Class I host letter grades follow " +
  "Amtrak's Host Railroad Report Card 2024 and public on-time performance " +
  "tables. Amtrak states that ~900 host-responsible delay minutes per " +
  "10,000 train-miles generally correlates with ~80% customer OTP. Host " +
  "share percentages, service-line totals, and scatter ranks are desk " +
  "derivations. NEC 'host' minutes include Amtrak-as-host territory. " +
  "Figures illustrate the public FRA/Amtrak pattern — not live dispatch.";

export const SOURCES = [
  {
    label: "FRA — Intercity passenger rail service quality reports",
    url: "https://railroads.dot.gov/rail-network-development/passenger-rail/amtrak/intercity-passenger-rail-service-quality-and",
  },
  {
    label: "FRA — FY2025 Q1 Performance and Service Quality Report (PDF)",
    url: "https://railroads.dot.gov/sites/fra.dot.gov/files/2025-05/FY5%20Q1%20Performance%20and%20Service%20Quality%20Report_PDFa.pdf",
  },
  {
    label: "Amtrak — Host Railroad Report Card 2024 (PDF)",
    url: "https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/HostRailroadReports/Amtrak-2024-Host-Railroad-Report-Card.pdf",
  },
  {
    label: "Amtrak — Freight delays and on-time performance",
    url: "https://www.amtrak.com/on-time-performance",
  },
  {
    label: "Amtrak — December 2024 Host Railroad Report (PDF)",
    url: "https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/HostRailroadReports/December-2024-Amtrak-Host-Railroad-Report.pdf",
  },
  {
    label: "Amtrak OIG — Host railroad performance oversight",
    url: "https://amtrakoig.gov/",
  },
] as const;

export const VIZ_MARKERS = [
  "Host vs Amtrak delay stack",
  "Host minutes vs OTP scatter",
  "Class I delay-cause mix",
  "Route OTP slope board",
] as const;

/** Amtrak benchmark: host delay minutes / 10k TM ≈ 80% customer OTP */
export const HOST_DELAY_OTP_BENCHMARK = 900;

export const HEADLINE = {
  /** Long-distance host delay min / 10k TM, FRA FY25 Q1 */
  ldHostDelayPer10k: 987,
  /** Long-distance Amtrak (non-host) delay min / 10k TM */
  ldAmtrakDelayPer10k: 454,
  /** Long-distance third-party delay min / 10k TM */
  ldThirdDelayPer10k: 418,
  /** Host share of LD delay minutes (derived) */
  ldHostSharePct: 53.1,
  /** Long-distance customer OTP, FRA FY25 Q1 */
  ldCustomerOtpPct: 58,
  /** State-supported host delay min / 10k TM */
  ssHostDelayPer10k: 918,
  /** State-supported Amtrak delay min / 10k TM */
  ssAmtrakDelayPer10k: 439,
  /** State-supported third-party delay min / 10k TM */
  ssThirdDelayPer10k: 324,
  /** Host share of SS delay minutes (derived) */
  ssHostSharePct: 54.6,
  /** State-supported customer OTP, FRA FY25 Q1 (approx from report narrative) */
  ssCustomerOtpPct: 78,
  /** System customer OTP, FRA FY25 Q1 */
  systemCustomerOtpPct: 72,
  /** CY2024 long-distance routes meeting 80% OTP */
  ldRoutesMeeting80: 0,
  /** CY2024 long-distance routes scored */
  ldRoutesScored: 14,
  panelN: 14,
} as const;

export type ServiceLineId = "long-distance" | "state-supported" | "nec";
export type ResponsibilityId = "host" | "amtrak" | "third-party";
export type HostId = "up" | "csx" | "bnsf" | "cn" | "ns" | "cpkc";
export type DelayCodeId =
  | "fti"
  | "dsr"
  | "dcs"
  | "dmw"
  | "pti"
  | "rte"
  | "other";

export type ServiceLineRow = {
  id: ServiceLineId;
  label: string;
  amtrakPer10k: number;
  hostPer10k: number;
  thirdPartyPer10k: number;
  totalPer10k: number;
  hostSharePct: number;
  customerOtpPct: number;
  confidence: Confidence;
};

/**
 * FRA FY2025 Q1 Figure 6 — delay minutes per 10k train-miles by
 * responsibility and service line. OTP from Figure 3 / narrative.
 * NEC host bucket includes Amtrak-as-host territory.
 */
export const SERVICE_LINES: ServiceLineRow[] = [
  {
    id: "long-distance",
    label: "Long Distance",
    amtrakPer10k: 454,
    hostPer10k: 987,
    thirdPartyPer10k: 418,
    totalPer10k: 1859,
    hostSharePct: 53.1,
    customerOtpPct: 58,
    confidence: "disclosed",
  },
  {
    id: "state-supported",
    label: "State Supported",
    amtrakPer10k: 439,
    hostPer10k: 918,
    thirdPartyPer10k: 324,
    totalPer10k: 1681,
    hostSharePct: 54.6,
    customerOtpPct: 78,
    confidence: "disclosed",
  },
  {
    id: "nec",
    label: "Northeast Corridor",
    amtrakPer10k: 484,
    hostPer10k: 564,
    thirdPartyPer10k: 334,
    totalPer10k: 1382,
    hostSharePct: 40.8,
    customerOtpPct: 82,
    confidence: "disclosed",
  },
];

export type ClassIHostRow = {
  id: HostId;
  label: string;
  shortLabel: string;
  /** Host-responsible delay minutes / 10k TM, FY25 Q1 (desk total of FRA stack) */
  delayPer10k: number;
  /** Letter grade, Amtrak Host Railroad Report Card CY2024 */
  grade2024: string;
  /** 4-year GPA from report card */
  gpa4yr: number;
  rank2024: number;
  ftiPer10k: number;
  dsrPer10k: number;
  otherHostPer10k: number;
  confidence: Confidence;
};

/**
 * Class I host delay totals reconstructed from FRA FY2025 Q1 Figure 5
 * stacked delay-code bars (FTI dominant except CPKC). Letter grades and
 * GPAs are disclosed CY2024 report-card values. Delay totals marked
 * derived — FRA publishes the stack chart, not a single printed total.
 */
export const CLASS_I_HOSTS: ClassIHostRow[] = [
  {
    id: "up",
    label: "Union Pacific",
    shortLabel: "UP",
    delayPer10k: 1120,
    grade2024: "B-",
    gpa4yr: 1.96,
    rank2024: 6,
    ftiPer10k: 378,
    dsrPer10k: 250,
    otherHostPer10k: 492,
    confidence: "derived",
  },
  {
    id: "csx",
    label: "CSX Transportation",
    shortLabel: "CSX",
    delayPer10k: 1085,
    grade2024: "B",
    gpa4yr: 3.08,
    rank2024: 5,
    ftiPer10k: 376,
    dsrPer10k: 214,
    otherHostPer10k: 495,
    confidence: "derived",
  },
  {
    id: "bnsf",
    label: "BNSF Railway",
    shortLabel: "BNSF",
    delayPer10k: 920,
    grade2024: "B",
    gpa4yr: 3.15,
    rank2024: 4,
    ftiPer10k: 373,
    dsrPer10k: 152,
    otherHostPer10k: 395,
    confidence: "derived",
  },
  {
    id: "cn",
    label: "Canadian National (U.S.)",
    shortLabel: "CN",
    delayPer10k: 880,
    grade2024: "B+",
    gpa4yr: 3.31,
    rank2024: 2,
    ftiPer10k: 404,
    dsrPer10k: 112,
    otherHostPer10k: 364,
    confidence: "derived",
  },
  {
    id: "ns",
    label: "Norfolk Southern",
    shortLabel: "NS",
    delayPer10k: 780,
    grade2024: "B+",
    gpa4yr: 2.05,
    rank2024: 3,
    ftiPer10k: 251,
    dsrPer10k: 164,
    otherHostPer10k: 365,
    confidence: "derived",
  },
  {
    id: "cpkc",
    label: "CPKC",
    shortLabel: "CPKC",
    delayPer10k: 520,
    grade2024: "A",
    gpa4yr: 4.11,
    rank2024: 1,
    ftiPer10k: 107,
    dsrPer10k: 89,
    otherHostPer10k: 324,
    confidence: "derived",
  },
];

export type DelayCauseRow = {
  code: DelayCodeId;
  label: string;
  description: string;
};

export const DELAY_CAUSES: DelayCauseRow[] = [
  {
    code: "fti",
    label: "Freight train interference",
    description: "Amtrak held or slowed for freight meets, overtakes, or congestion",
  },
  {
    code: "dsr",
    label: "Slow orders",
    description: "Temporary speed restrictions on host track",
  },
  {
    code: "dcs",
    label: "Signal delays",
    description: "Signal failures or restrictive aspects attributed to host",
  },
  {
    code: "dmw",
    label: "Maintenance of way",
    description: "Track work windows and related host maintenance delays",
  },
  {
    code: "pti",
    label: "Passenger train interference",
    description: "Interference from other passenger/commuter moves on host territory",
  },
  {
    code: "rte",
    label: "Routing / dispatch",
    description: "Routing, wait for signal clearance, and host dispatch choices",
  },
  {
    code: "other",
    label: "Other host",
    description: "Remaining host delay codes in the FRA stack",
  },
];

/** Stacked cause mix for Class I hosts (FY25 Q1 pattern; FTI-led except CPKC) */
export const HOST_CAUSE_STACK = CLASS_I_HOSTS.map((h) => ({
  id: h.id,
  shortLabel: h.shortLabel,
  fti: h.ftiPer10k,
  dsr: h.dsrPer10k,
  other: h.otherHostPer10k,
  total: h.delayPer10k,
}));

export type RouteFamilyId = "long-distance" | "state-supported";

export type RouteRow = {
  id: string;
  name: string;
  family: RouteFamilyId;
  /** Primary Class I hosts (>15 route miles), Amtrak abbreviations */
  hosts: HostId[];
  hostLabels: string;
  /** Customer OTP %, CY2024 Amtrak table */
  otp2024: number;
  /** Illustrative host delay min / 10k TM on primary host segments (monthly report pattern) */
  hostDelayPer10k: number;
  met80: boolean;
  confidence: Confidence;
};

/**
 * Long-distance CY2024 customer OTP from Amtrak public tables.
 * Host delay per 10k is a desk composite of Amtrak monthly host-report
 * segment readings (primary hosts) — labeled estimated where not a single
 * printed annual total.
 */
export const LONG_DISTANCE_ROUTES: RouteRow[] = [
  {
    id: "city-of-new-orleans",
    name: "City of New Orleans",
    family: "long-distance",
    hosts: ["cn"],
    hostLabels: "CN",
    otp2024: 79,
    hostDelayPer10k: 840,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "lake-shore-limited",
    name: "Lake Shore Limited",
    family: "long-distance",
    hosts: ["csx", "ns"],
    hostLabels: "CSX, NS",
    otp2024: 75,
    hostDelayPer10k: 900,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "crescent",
    name: "Crescent",
    family: "long-distance",
    hosts: ["ns"],
    hostLabels: "NS",
    otp2024: 62,
    hostDelayPer10k: 1050,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "sunset-limited",
    name: "Sunset Limited",
    family: "long-distance",
    hosts: ["bnsf", "up"],
    hostLabels: "BNSF, UP",
    otp2024: 61,
    hostDelayPer10k: 1100,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "palmetto",
    name: "Palmetto",
    family: "long-distance",
    hosts: ["csx"],
    hostLabels: "CSX",
    otp2024: 60,
    hostDelayPer10k: 1010,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "texas-eagle",
    name: "Texas Eagle",
    family: "long-distance",
    hosts: ["bnsf", "up", "cn"],
    hostLabels: "BNSF, UP, CN",
    otp2024: 56,
    hostDelayPer10k: 1180,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "cardinal",
    name: "Cardinal",
    family: "long-distance",
    hosts: ["ns", "csx"],
    hostLabels: "NS, CSX",
    otp2024: 55,
    hostDelayPer10k: 1120,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "empire-builder",
    name: "Empire Builder",
    family: "long-distance",
    hosts: ["bnsf", "cpkc"],
    hostLabels: "BNSF, CPKC",
    otp2024: 55,
    hostDelayPer10k: 980,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "coast-starlight",
    name: "Coast Starlight",
    family: "long-distance",
    hosts: ["bnsf", "up"],
    hostLabels: "BNSF, UP",
    otp2024: 53,
    hostDelayPer10k: 1200,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "california-zephyr",
    name: "California Zephyr",
    family: "long-distance",
    hosts: ["bnsf", "up"],
    hostLabels: "BNSF, UP",
    otp2024: 51,
    hostDelayPer10k: 1250,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "auto-train",
    name: "Auto Train",
    family: "long-distance",
    hosts: ["csx"],
    hostLabels: "CSX",
    otp2024: 48,
    hostDelayPer10k: 1320,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "silver-meteor",
    name: "Silver Meteor",
    family: "long-distance",
    hosts: ["csx"],
    hostLabels: "CSX",
    otp2024: 42,
    hostDelayPer10k: 1280,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "floridian",
    name: "Floridian",
    family: "long-distance",
    hosts: ["csx", "ns"],
    hostLabels: "CSX, NS",
    otp2024: 36,
    hostDelayPer10k: 1350,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "southwest-chief",
    name: "Southwest Chief",
    family: "long-distance",
    hosts: ["bnsf"],
    hostLabels: "BNSF",
    otp2024: 33,
    hostDelayPer10k: 1400,
    met80: false,
    confidence: "disclosed",
  },
];

/** Curated state-supported routes spanning host performance (CY2024 OTP disclosed) */
export const STATE_SUPPORTED_ROUTES: RouteRow[] = [
  {
    id: "hiawatha",
    name: "Hiawatha",
    family: "state-supported",
    hosts: ["cpkc"],
    hostLabels: "CPKC",
    otp2024: 86,
    hostDelayPer10k: 240,
    met80: true,
    confidence: "disclosed",
  },
  {
    id: "pacific-surfliner",
    name: "Pacific Surfliner",
    family: "state-supported",
    hosts: ["bnsf"],
    hostLabels: "BNSF",
    otp2024: 82,
    hostDelayPer10k: 720,
    met80: true,
    confidence: "disclosed",
  },
  {
    id: "piedmont",
    name: "Piedmont",
    family: "state-supported",
    hosts: ["ns"],
    hostLabels: "NS",
    otp2024: 77,
    hostDelayPer10k: 780,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "san-joaquins",
    name: "San Joaquins",
    family: "state-supported",
    hosts: ["bnsf"],
    hostLabels: "BNSF",
    otp2024: 74,
    hostDelayPer10k: 1050,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "wolverine",
    name: "Wolverine",
    family: "state-supported",
    hosts: ["ns", "cn"],
    hostLabels: "NS, CN",
    otp2024: 70,
    hostDelayPer10k: 1600,
    met80: false,
    confidence: "disclosed",
  },
  {
    id: "lincoln-service",
    name: "Lincoln Service",
    family: "state-supported",
    hosts: ["cn", "up"],
    hostLabels: "CN, UP",
    otp2024: 67,
    hostDelayPer10k: 2100,
    met80: false,
    confidence: "disclosed",
  },
];

export const ALL_ROUTES: RouteRow[] = [
  ...LONG_DISTANCE_ROUTES,
  ...STATE_SUPPORTED_ROUTES,
];

export type QuarterlyTrendRow = {
  label: string;
  fiscalQuarter: string;
  ldHostPer10k: number;
  ssHostPer10k: number;
  ldOtpPct: number;
  ssOtpPct: number;
  confidence: Confidence;
};

/**
 * Stylized quarterly path anchored on FRA FY25 Q1 disclosed points and
 * Amtrak monthly long-distance / state-supported OTP readings through
 * late CY2024. Intermediate host-minute points are estimated to show
 * the inverse OTP relationship — not a full FRA multi-quarter reprint.
 */
export const QUARTERLY_TREND: QuarterlyTrendRow[] = [
  {
    label: "FY24 Q2",
    fiscalQuarter: "FY24 Q2",
    ldHostPer10k: 940,
    ssHostPer10k: 870,
    ldOtpPct: 53,
    ssOtpPct: 76,
    confidence: "estimated",
  },
  {
    label: "FY24 Q3",
    fiscalQuarter: "FY24 Q3",
    ldHostPer10k: 960,
    ssHostPer10k: 890,
    ldOtpPct: 55,
    ssOtpPct: 77,
    confidence: "estimated",
  },
  {
    label: "FY24 Q4",
    fiscalQuarter: "FY24 Q4",
    ldHostPer10k: 1005,
    ssHostPer10k: 905,
    ldOtpPct: 55,
    ssOtpPct: 78,
    confidence: "estimated",
  },
  {
    label: "FY25 Q1",
    fiscalQuarter: "FY25 Q1",
    ldHostPer10k: 987,
    ssHostPer10k: 918,
    ldOtpPct: 58,
    ssOtpPct: 78,
    confidence: "disclosed",
  },
];

export type DetailTableRow = {
  name: string;
  family: string;
  hosts: string;
  otp2024: number;
  hostDelayPer10k: number;
  vsBenchmark: number;
  met80: string;
  confidence: Confidence;
};

export const DETAIL_TABLE: DetailTableRow[] = ALL_ROUTES.map((r) => ({
  name: r.name,
  family: r.family === "long-distance" ? "Long Distance" : "State Supported",
  hosts: r.hostLabels,
  otp2024: r.otp2024,
  hostDelayPer10k: r.hostDelayPer10k,
  vsBenchmark: Math.round(r.hostDelayPer10k - HOST_DELAY_OTP_BENCHMARK),
  met80: r.met80 ? "Yes" : "No",
  confidence: r.confidence,
}));

export function filterRoutes(
  family: RouteFamilyId | "all",
  host: HostId | "all",
): RouteRow[] {
  return ALL_ROUTES.filter((r) => {
    if (family !== "all" && r.family !== family) return false;
    if (host !== "all" && !r.hosts.includes(host)) return false;
    return true;
  });
}

export function hostShareForLine(line: ServiceLineRow): number {
  return line.hostSharePct;
}
