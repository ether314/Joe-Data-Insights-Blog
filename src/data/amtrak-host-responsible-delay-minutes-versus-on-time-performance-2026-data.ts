/**
 * Amtrak host-responsible delay minutes versus on-time performance (2026).
 *
 * Core question: What share of delay minutes on state-supported and
 * long-distance trains is charged to host railroads versus Amtrak?
 *
 * Primary anchors: FRA Quarterly Report on the Performance and Service
 * Quality of Intercity Passenger Train Operations (FY24 Q3, FY25 Q1,
 * FY25 Q3 Figure 6 delay responsibility stacks; Customer OTP by service
 * line); Amtrak Host Railroad Report Card 2024; Amtrak monthly Host
 * Railroad Reports (route × host delay minutes per 10k train-miles);
 * Amtrak Office of Inspector General preference / OTP audits for
 * context. Host shares and route scatter values are desk calculations
 * from disclosed FRA stacks and published Amtrak host tables — not a
 * substitute for live FRA Excel metric files.
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "Service-line delay minutes per 10,000 train-miles by responsibility " +
  "(Amtrak / host railroad / third party) follow FRA Quarterly Report " +
  "Figure 6 stacks for FY 2024 Q3, FY 2025 Q1, and FY 2025 Q3. Customer " +
  "OTP uses the FRA 15-minute (Acela 10-minute) customer standard from " +
  "the same quarterly reports. Class I host grades and the 900 " +
  "host-minutes ≈ 80% OTP rule of thumb are from Amtrak’s 2024 Host " +
  "Railroad Report Card. Route-level host delay minutes per 10k " +
  "train-miles are desk-compiled from Amtrak monthly Host Railroad " +
  "Reports (Dec 2024 window where cited). Host-share percentages are " +
  "desk ratios of host minutes ÷ (Amtrak + host + third-party) stacks. " +
  "Figures illustrate the public FRA/Amtrak pattern — not live dispatch.";

export const SOURCES = [
  {
    label: "FRA — Intercity passenger rail service quality & performance",
    url: "https://railroads.dot.gov/rail-network-development/passenger-rail/amtrak/intercity-passenger-rail-service-quality-and",
  },
  {
    label: "FRA — FY25 Q3 Performance and Service Quality Report (PDF)",
    url: "https://railroads.dot.gov/sites/fra.dot.gov/files/2025-09/FY25-Q3-Performance-Service-Quality-Report_PDFa.pdf",
  },
  {
    label: "Amtrak — 2024 Host Railroad Report Card",
    url: "https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/HostRailroadReports/Amtrak-2024-Host-Railroad-Report-Card.pdf",
  },
  {
    label: "Amtrak — Freight delays & on-time performance",
    url: "https://www.amtrak.com/on-time-performance",
  },
  {
    label: "Amtrak OIG — reports & audits (passenger preference / OTP)",
    url: "https://amtrakog.gov/",
  },
] as const;

export const VIZ_MARKERS = [
  "Host share vs endpoint OTP",
  "Responsibility stacked minutes",
  "Class I host report-card ladder",
] as const;

export const REFERENCE_QUARTER = "FY2025 Q3";
export const OTP_STANDARD_PCT = 80;
/** Amtrak rule of thumb: ~900 host-responsible min/10k ≈ 80% customer OTP */
export const HOST_MINUTES_OTP80_THRESHOLD = 900;

export type ServiceLineId = "long-distance" | "state-supported" | "nec";
export type ResponsibilityId = "amtrak" | "host" | "third-party";
export type HostId = "cpkc" | "cn" | "ns" | "bnsf" | "csx" | "up";

export type ServiceLineStack = {
  id: ServiceLineId;
  label: string;
  short: string;
  quarter: string;
  amtrakMin10k: number;
  hostMin10k: number;
  thirdPartyMin10k: number;
  customerOtpPct: number;
  confidence: Confidence;
};

/** FRA Figure 6 stacks + matching Customer OTP prints */
export const SERVICE_LINE_STACKS: ServiceLineStack[] = [
  {
    id: "long-distance",
    label: "Long Distance",
    short: "LD",
    quarter: "FY24 Q3",
    amtrakMin10k: 446,
    hostMin10k: 1092,
    thirdPartyMin10k: 412,
    customerOtpPct: 49,
    confidence: "disclosed",
  },
  {
    id: "state-supported",
    label: "State Supported",
    short: "SS",
    quarter: "FY24 Q3",
    amtrakMin10k: 413,
    hostMin10k: 940,
    thirdPartyMin10k: 365,
    customerOtpPct: 77,
    confidence: "disclosed",
  },
  {
    id: "nec",
    label: "Northeast Corridor",
    short: "NEC",
    quarter: "FY24 Q3",
    amtrakMin10k: 435,
    hostMin10k: 633,
    thirdPartyMin10k: 456,
    customerOtpPct: 74,
    confidence: "disclosed",
  },
  {
    id: "long-distance",
    label: "Long Distance",
    short: "LD",
    quarter: "FY25 Q1",
    amtrakMin10k: 454,
    hostMin10k: 987,
    thirdPartyMin10k: 418,
    customerOtpPct: 58,
    confidence: "disclosed",
  },
  {
    id: "state-supported",
    label: "State Supported",
    short: "SS",
    quarter: "FY25 Q1",
    amtrakMin10k: 439,
    hostMin10k: 918,
    thirdPartyMin10k: 324,
    customerOtpPct: 79,
    confidence: "disclosed",
  },
  {
    id: "nec",
    label: "Northeast Corridor",
    short: "NEC",
    quarter: "FY25 Q1",
    amtrakMin10k: 484,
    hostMin10k: 564,
    thirdPartyMin10k: 334,
    customerOtpPct: 73,
    confidence: "disclosed",
  },
  {
    id: "long-distance",
    label: "Long Distance",
    short: "LD",
    quarter: "FY25 Q3",
    amtrakMin10k: 481,
    hostMin10k: 1065,
    thirdPartyMin10k: 430,
    customerOtpPct: 49,
    confidence: "disclosed",
  },
  {
    id: "state-supported",
    label: "State Supported",
    short: "SS",
    quarter: "FY25 Q3",
    amtrakMin10k: 421,
    hostMin10k: 951,
    thirdPartyMin10k: 352,
    customerOtpPct: 78,
    confidence: "disclosed",
  },
  {
    id: "nec",
    label: "Northeast Corridor",
    short: "NEC",
    quarter: "FY25 Q3",
    amtrakMin10k: 444,
    hostMin10k: 676,
    thirdPartyMin10k: 333,
    customerOtpPct: 74,
    confidence: "disclosed",
  },
];

export function totalMin10k(row: ServiceLineStack): number {
  return row.amtrakMin10k + row.hostMin10k + row.thirdPartyMin10k;
}

export function hostSharePct(row: ServiceLineStack): number {
  const t = totalMin10k(row);
  return t === 0 ? 0 : Math.round((1000 * row.hostMin10k) / t) / 10;
}

export function amtrakSharePct(row: ServiceLineStack): number {
  const t = totalMin10k(row);
  return t === 0 ? 0 : Math.round((1000 * row.amtrakMin10k) / t) / 10;
}

export type HostCardRow = {
  id: HostId;
  name: string;
  rank2024: number;
  grade: string;
  gpa4yr: number;
  /** Desk-estimated CY2024 host-responsible min/10k from report-card ladder + monthly prints */
  hostMin10kEst: number;
  ftiDominant: boolean;
  note: string;
  confidence: Confidence;
};

/** Amtrak 2024 Host Railroad Report Card ranking + desk delay estimates */
export const HOST_REPORT_CARD: HostCardRow[] = [
  {
    id: "cpkc",
    name: "CPKC",
    rank2024: 1,
    grade: "A",
    gpa4yr: 4.11,
    hostMin10kEst: 610,
    ftiDominant: false,
    note: "Only Class I with an A in 2024; ninth straight top-host award era (CP/CPKC).",
    confidence: "derived",
  },
  {
    id: "cn",
    name: "Canadian National",
    rank2024: 2,
    grade: "B+",
    gpa4yr: 3.31,
    hostMin10kEst: 780,
    ftiDominant: true,
    note: "CN-IC US segments; FRA FY25 Q3 flagged CN-IC among highest host delay intensity.",
    confidence: "derived",
  },
  {
    id: "ns",
    name: "Norfolk Southern",
    rank2024: 3,
    grade: "B+",
    gpa4yr: 2.05,
    hostMin10kEst: 860,
    ftiDominant: true,
    note: "Often lowest Class I host intensity in recent FRA quarters despite mid-pack GPA.",
    confidence: "derived",
  },
  {
    id: "bnsf",
    name: "BNSF",
    rank2024: 4,
    grade: "B",
    gpa4yr: 3.15,
    hostMin10kEst: 980,
    ftiDominant: true,
    note: "Hosts western LD corridors; FTI typically largest host cause code.",
    confidence: "derived",
  },
  {
    id: "csx",
    name: "CSX",
    rank2024: 5,
    grade: "B",
    gpa4yr: 3.08,
    hostMin10kEst: 1040,
    ftiDominant: true,
    note: "Eastern LD + many state corridors; Floridian / Auto Train pressure visible in OTP.",
    confidence: "derived",
  },
  {
    id: "up",
    name: "Union Pacific",
    rank2024: 6,
    grade: "B-",
    gpa4yr: 1.96,
    hostMin10kEst: 1180,
    ftiDominant: true,
    note: "Lowest 2024 grade; FRA quarters repeatedly list UP among highest host min/10k.",
    confidence: "derived",
  },
];

export type RoutePanelRow = {
  id: string;
  route: string;
  serviceLine: Exclude<ServiceLineId, "nec">;
  serviceLabel: string;
  primaryHosts: string;
  /** Customer OTP %, FRA FY25 Q3 Table 4 */
  customerOtpPct: number;
  /** Primary-host delay min/10k, Amtrak Host Railroad Report Dec 2024 window */
  hostMin10k: number;
  topHostCause: string;
  confidence: Confidence;
};

export const ROUTE_PANEL: RoutePanelRow[] = [
  {
    id: "capitol-corridor",
    route: "Capitol Corridor",
    serviceLine: "state-supported",
    serviceLabel: "State Supported",
    primaryHosts: "UP",
    customerOtpPct: 91,
    hostMin10k: 820,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "pere-marquette",
    route: "Pere Marquette",
    serviceLine: "state-supported",
    serviceLabel: "State Supported",
    primaryHosts: "CSX",
    customerOtpPct: 89,
    hostMin10k: 241,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "keystone",
    route: "Keystone",
    serviceLine: "state-supported",
    serviceLabel: "State Supported",
    primaryHosts: "Amtrak / NS",
    customerOtpPct: 88,
    hostMin10k: 420,
    topHostCause: "RTE",
    confidence: "carried",
  },
  {
    id: "pacific-surfliner",
    route: "Pacific Surfliner",
    serviceLine: "state-supported",
    serviceLabel: "State Supported",
    primaryHosts: "BNSF / UP",
    customerOtpPct: 88,
    hostMin10k: 1334,
    topHostCause: "DCS",
    confidence: "derived",
  },
  {
    id: "hiawatha",
    route: "Hiawatha",
    serviceLine: "state-supported",
    serviceLabel: "State Supported",
    primaryHosts: "CPKC",
    customerOtpPct: 85,
    hostMin10k: 182,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "downeaster",
    route: "Downeaster",
    serviceLine: "state-supported",
    serviceLabel: "State Supported",
    primaryHosts: "CSX",
    customerOtpPct: 72,
    hostMin10k: 632,
    topHostCause: "PTI",
    confidence: "derived",
  },
  {
    id: "cascades",
    route: "Cascades",
    serviceLine: "state-supported",
    serviceLabel: "State Supported",
    primaryHosts: "BNSF",
    customerOtpPct: 68,
    hostMin10k: 1180,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "carolinian",
    route: "Carolinian",
    serviceLine: "state-supported",
    serviceLabel: "State Supported",
    primaryHosts: "CSX / NS",
    customerOtpPct: 57,
    hostMin10k: 1234,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "lincoln-missouri",
    route: "Lincoln / Missouri",
    serviceLine: "state-supported",
    serviceLabel: "State Supported",
    primaryHosts: "CN-IC / UP",
    customerOtpPct: 40,
    hostMin10k: 2694,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "heartland-flyer",
    route: "Heartland Flyer",
    serviceLine: "state-supported",
    serviceLabel: "State Supported",
    primaryHosts: "BNSF",
    customerOtpPct: 33,
    hostMin10k: 1746,
    topHostCause: "DSR",
    confidence: "derived",
  },
  {
    id: "lake-shore",
    route: "Lake Shore Limited",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "CSX / NS",
    customerOtpPct: 73,
    hostMin10k: 732,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "crescent",
    route: "Crescent",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "NS / CSX",
    customerOtpPct: 70,
    hostMin10k: 717,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "city-of-new-orleans",
    route: "City of New Orleans",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "CN-IC",
    customerOtpPct: 64,
    hostMin10k: 761,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "coast-starlight",
    route: "Coast Starlight",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "BNSF / UP",
    customerOtpPct: 64,
    hostMin10k: 1084,
    topHostCause: "RTE",
    confidence: "derived",
  },
  {
    id: "empire-builder",
    route: "Empire Builder",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "BNSF / CPKC",
    customerOtpPct: 56,
    hostMin10k: 606,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "sunset-ltd",
    route: "Sunset Limited",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "UP / BNSF",
    customerOtpPct: 56,
    hostMin10k: 807,
    topHostCause: "DSR",
    confidence: "derived",
  },
  {
    id: "california-zephyr",
    route: "California Zephyr",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "BNSF / UP",
    customerOtpPct: 50,
    hostMin10k: 980,
    topHostCause: "FTI",
    confidence: "carried",
  },
  {
    id: "texas-eagle",
    route: "Texas Eagle",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "UP / CN / BNSF",
    customerOtpPct: 46,
    hostMin10k: 2729,
    topHostCause: "DSR",
    confidence: "derived",
  },
  {
    id: "southwest-chief",
    route: "Southwest Chief",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "BNSF",
    customerOtpPct: 38,
    hostMin10k: 710,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "auto-train",
    route: "Auto Train",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "CSX",
    customerOtpPct: 32,
    hostMin10k: 1470,
    topHostCause: "FTI",
    confidence: "derived",
  },
  {
    id: "floridian",
    route: "Floridian",
    serviceLine: "long-distance",
    serviceLabel: "Long Distance",
    primaryHosts: "CSX / NS",
    customerOtpPct: 16,
    hostMin10k: 915,
    topHostCause: "FTI",
    confidence: "derived",
  },
];

export type CauseSlice = {
  id: string;
  label: string;
  code: string;
  sharePct: number;
  color: string;
};

/** Illustrative Class I host-cause mix (FTI-dominant pattern from FRA Figure 5 notes) */
export const HOST_CAUSE_SLICES: CauseSlice[] = [
  { id: "fti", label: "Freight train interference", code: "FTI", sharePct: 42, color: "#e11d48" },
  { id: "dsr", label: "Slow orders", code: "DSR", sharePct: 22, color: "#f59e0b" },
  { id: "pti", label: "Passenger train interference", code: "PTI", sharePct: 14, color: "#6366f1" },
  { id: "dcs", label: "Signal delays", code: "DCS", sharePct: 10, color: "#0ea5e9" },
  { id: "rte", label: "Routing / miscellaneous", code: "RTE", sharePct: 8, color: "#64748b" },
  { id: "other", label: "Other host codes", code: "OTH", sharePct: 4, color: "#94a3b8" },
];

export type QuarterTrend = {
  quarter: string;
  short: string;
  systemOtpPct: number;
  ldHostSharePct: number;
  ssHostSharePct: number;
  ldOtpPct: number;
  ssOtpPct: number;
};

export function stacksForQuarter(quarter: string): ServiceLineStack[] {
  return SERVICE_LINE_STACKS.filter((r) => r.quarter === quarter);
}

export function latestStacks(): ServiceLineStack[] {
  return stacksForQuarter(REFERENCE_QUARTER);
}

export const QUARTER_TREND: QuarterTrend[] = [
  {
    quarter: "FY24 Q3",
    short: "FY24Q3",
    systemOtpPct: 72,
    ldHostSharePct: hostSharePct(SERVICE_LINE_STACKS[0]),
    ssHostSharePct: hostSharePct(SERVICE_LINE_STACKS[1]),
    ldOtpPct: 49,
    ssOtpPct: 77,
  },
  {
    quarter: "FY25 Q1",
    short: "FY25Q1",
    systemOtpPct: 72,
    ldHostSharePct: hostSharePct(SERVICE_LINE_STACKS[3]),
    ssHostSharePct: hostSharePct(SERVICE_LINE_STACKS[4]),
    ldOtpPct: 58,
    ssOtpPct: 79,
  },
  {
    quarter: "FY25 Q3",
    short: "FY25Q3",
    systemOtpPct: 72,
    ldHostSharePct: hostSharePct(SERVICE_LINE_STACKS[6]),
    ssHostSharePct: hostSharePct(SERVICE_LINE_STACKS[7]),
    ldOtpPct: 49,
    ssOtpPct: 78,
  },
];

const latestLd = SERVICE_LINE_STACKS[6];
const latestSs = SERVICE_LINE_STACKS[7];

export const HEADLINE = {
  quarter: REFERENCE_QUARTER,
  systemOtpPct: 72,
  ldOtpPct: latestLd.customerOtpPct,
  ssOtpPct: latestSs.customerOtpPct,
  ldHostMin10k: latestLd.hostMin10k,
  ssHostMin10k: latestSs.hostMin10k,
  ldAmtrakMin10k: latestLd.amtrakMin10k,
  ssAmtrakMin10k: latestSs.amtrakMin10k,
  ldHostSharePct: hostSharePct(latestLd),
  ssHostSharePct: hostSharePct(latestSs),
  ldTotalMin10k: totalMin10k(latestLd),
  ssTotalMin10k: totalMin10k(latestSs),
  otpStandardPct: OTP_STANDARD_PCT,
  hostMinutesThreshold: HOST_MINUTES_OTP80_THRESHOLD,
  ftiDelayMinutes2024: 850_000,
  topHostGrade: "A",
  topHostName: "CPKC",
  bottomHostGrade: "B-",
  bottomHostName: "Union Pacific",
  routePanelN: ROUTE_PANEL.length,
  hostCardN: HOST_REPORT_CARD.length,
};

export type DetailRow = {
  route: string;
  serviceLabel: string;
  primaryHosts: string;
  customerOtpPct: number;
  hostMin10k: number;
  topHostCause: string;
  aboveThreshold: boolean;
  confidence: Confidence;
};

export const DETAIL_TABLE: DetailRow[] = [...ROUTE_PANEL]
  .sort((a, b) => a.customerOtpPct - b.customerOtpPct)
  .map((r) => ({
    route: r.route,
    serviceLabel: r.serviceLabel,
    primaryHosts: r.primaryHosts,
    customerOtpPct: r.customerOtpPct,
    hostMin10k: r.hostMin10k,
    topHostCause: r.topHostCause,
    aboveThreshold: r.hostMin10k > HOST_MINUTES_OTP80_THRESHOLD,
    confidence: r.confidence,
  }));

export function filterRoutes(
  service: ServiceLineId | "all",
  otpBand: "all" | "pass" | "fail",
): RoutePanelRow[] {
  return ROUTE_PANEL.filter((r) => {
    if (service !== "all" && service !== "nec" && r.serviceLine !== service) {
      return false;
    }
    if (service === "nec") return false;
    if (otpBand === "pass" && r.customerOtpPct < OTP_STANDARD_PCT) return false;
    if (otpBand === "fail" && r.customerOtpPct >= OTP_STANDARD_PCT) return false;
    return true;
  });
}

export function responsibilityBars(quarter: string): Array<{
  service: string;
  short: string;
  amtrak: number;
  host: number;
  thirdParty: number;
  hostSharePct: number;
  otpPct: number;
}> {
  return stacksForQuarter(quarter).map((r) => ({
    service: r.label,
    short: r.short,
    amtrak: r.amtrakMin10k,
    host: r.hostMin10k,
    thirdParty: r.thirdPartyMin10k,
    hostSharePct: hostSharePct(r),
    otpPct: r.customerOtpPct,
  }));
}

export function scatterPoints(
  service: ServiceLineId | "all",
  otpBand: "all" | "pass" | "fail",
): Array<{
  id: string;
  route: string;
  short: string;
  hostMin10k: number;
  otpPct: number;
  serviceLine: string;
  color: string;
}> {
  const colors: Record<string, string> = {
    "long-distance": "#e11d48",
    "state-supported": "#0ea5e9",
  };
  return filterRoutes(service, otpBand).map((r) => ({
    id: r.id,
    route: r.route,
    short: r.route.length > 14 ? `${r.route.slice(0, 12)}…` : r.route,
    hostMin10k: r.hostMin10k,
    otpPct: r.customerOtpPct,
    serviceLine: r.serviceLabel,
    color: colors[r.serviceLine],
  }));
}
