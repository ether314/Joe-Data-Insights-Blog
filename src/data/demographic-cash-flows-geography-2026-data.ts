/**
 * Demographic cash flows — geography lens (2026).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * How do age and migration show up in money flows?
 *
 * Complements concentration (top-k / HHI), Banxico vintages, and corridor plumbing
 * with regional recipient shares, host-bloc origin geography, corridor blocs,
 * dependence×region scatter, and host pension-age geography.
 *
 * Primary sources:
 * - World Bank Migration & Development Brief 41 (LMIC remittances ~$685B; recipients)
 * - KNOMAD bilateral matrix (corridor dollars)
 * - UN World Population Prospects 2024 (old-age dependency)
 * - OECD Pensions at a Glance (public pension % GDP)
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Regional recipient shares roll Brief 41 LMIC inflows (~$685B, 2024) into World Bank-style destination regions using disclosed country anchors (India/Mexico/China/Philippines/Pakistan/etc.) plus an analytical residual that closes the perimeter. Host-bloc origin shares estimate outbound geography from KNOMAD corridor dollars against the same $685B perimeter (tracked corridors are a lower bound). Dependence×region points use Brief 41 GDP-dependence ranks. Host pension % GDP from OECD Pensions at a Glance. Confidence tags separate disclosed tallies from regional roll-ups.";

export const PRIOR_RESEARCH_PATH = "/blog/demographic-cash-flows-research-2026";
export const PRIOR_CONCENTRATION_PATH =
  "/blog/demographic-cash-flows-concentration-2026";
export const PRIOR_AUG608_PATH = "/blog/demographic-cash-flows-concentration-202608";
export const PRIOR_Q3_PATH = "/blog/demographic-cash-flows-concentration-2026q3";
export const CORRIDORS_PATH = "/blog/global-remittance-corridors-2026";
export const PRIOR_UPDATE_PATH = "/blog/demographic-cash-flows-update-202608";

export const HEADLINE = {
  /** Destination region with largest LMIC remittance $ share */
  top1RegionSharePct: 26,
  top1RegionLabel: "South Asia",
  top1RegionBn: 180,
  /** Top-3 destination regions */
  top3RegionSharePct: 58,
  top3RegionLabel: "South Asia · LatAm · East Asia & Pacific",
  lmicUniverseBn: 685,
  /** Host origin: US-led North America share of tracked outbound */
  usHostSharePct: 31,
  usHostBn: 212,
  top1HostLabel: "United States",
  /** GCC host bloc */
  gccHostSharePct: 14,
  /** Largest corridor bloc share of $685B */
  top1CorridorBlocSharePct: 12,
  top1CorridorBlocLabel: "US → Latin America",
  top1CorridorBlocBn: 82,
  /** Extreme dependence still Central Asia / LatAm, not dollar giants */
  top1DependenceGdpPct: 45,
  top1DependenceLabel: "Tajikistan",
  top1DependenceRegion: "Europe & Central Asia",
  /** Age contrast: host Europe vs young remittance destinations */
  europePensionGdpPct: 12.1,
  japanOldAgeDep: 54,
  southAsiaOldAgeDep: 9,
  italyPensionGdpPct: 16.3,
  oecdPensionAvgGdpPct: 8.1,
} as const;

export type RegionRecipient = {
  region: string;
  short: string;
  amountBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  medianOldAgeDep: number;
  topCountry: string;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Destination-region roll-up of LMIC remittance inflows vs $685B Brief 41 universe.
 * Anchors: South Asia (IN+PK+BD), EAP (CN+PH), LatAm (MX + estimated peers),
 * MENA (EG+), SSA (NG+), ECA, residual RoW.
 */
export const REGION_RECIPIENTS: RegionRecipient[] = [
  {
    region: "South Asia",
    short: "S. Asia",
    amountBn: 180,
    sharePct: 26.3,
    cumulativeSharePct: 26.3,
    medianOldAgeDep: 9,
    topCountry: "India",
    confidence: "estimated",
    fill: "#f59e0b",
    note: "India $129B + Pakistan $33B + Bangladesh $18B anchors",
  },
  {
    region: "Latin America & Caribbean",
    short: "LatAm",
    amountBn: 118,
    sharePct: 17.2,
    cumulativeSharePct: 43.5,
    medianOldAgeDep: 12,
    topCountry: "Mexico",
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Mexico Brief 41 ~$68B plus Central America / Caribbean corridors",
  },
  {
    region: "East Asia & Pacific",
    short: "EAP",
    amountBn: 102,
    sharePct: 14.9,
    cumulativeSharePct: 58.4,
    medianOldAgeDep: 14,
    topCountry: "China",
    confidence: "estimated",
    fill: "#ef4444",
    note: "China $48B + Philippines $40B plus smaller Pacific / SE Asia flows",
  },
  {
    region: "Middle East & North Africa",
    short: "MENA",
    amountBn: 68,
    sharePct: 9.9,
    cumulativeSharePct: 68.3,
    medianOldAgeDep: 10,
    topCountry: "Egypt",
    confidence: "estimated",
    fill: "#06b6d4",
    note: "Egypt + Levant / Maghreb labour corridors",
  },
  {
    region: "Sub-Saharan Africa",
    short: "SSA",
    amountBn: 54,
    sharePct: 7.9,
    cumulativeSharePct: 76.2,
    medianOldAgeDep: 6,
    topCountry: "Nigeria",
    confidence: "estimated",
    fill: "#f97316",
    note: "Nigeria ~$21B plus West / East Africa corridors",
  },
  {
    region: "Europe & Central Asia",
    short: "ECA",
    amountBn: 42,
    sharePct: 6.1,
    cumulativeSharePct: 82.3,
    medianOldAgeDep: 18,
    topCountry: "Ukraine / Tajikistan",
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Small dollars; hosts extreme GDP-dependence cases (TJ)",
  },
  {
    region: "Other / residual LMICs",
    short: "Residual",
    amountBn: 121,
    sharePct: 17.7,
    cumulativeSharePct: 100,
    medianOldAgeDep: 12,
    topCountry: "—",
    confidence: "estimated",
    fill: "#64748b",
    note: "Analytical residual closing the $685B perimeter",
  },
];

export type HostBloc = {
  bloc: string;
  short: string;
  amountBn: number;
  sharePct: number;
  role: "host" | "bridge";
  medianOldAgeDep: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Estimated host / origin geography of remittance outflows (share of $685B).
 * US + GCC + Europe dominate sending; Russia is a small-dollar / high-dependence pipe.
 */
export const HOST_BLOCS: HostBloc[] = [
  {
    bloc: "United States",
    short: "US",
    amountBn: 212,
    sharePct: 30.9,
    role: "host",
    medianOldAgeDep: 28,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "US→MX, US→PH, US→IN, US→Central America corridors",
  },
  {
    bloc: "GCC (Gulf)",
    short: "GCC",
    amountBn: 96,
    sharePct: 14.0,
    role: "host",
    medianOldAgeDep: 4,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "UAE/Saudi/Qatar → South Asia labour corridors",
  },
  {
    bloc: "Western Europe",
    short: "Europe",
    amountBn: 78,
    sharePct: 11.4,
    role: "host",
    medianOldAgeDep: 36,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "UK/DE/FR/IT → South Asia, Africa, Maghreb",
  },
  {
    bloc: "Russia & CIS hosts",
    short: "RU/CIS",
    amountBn: 22,
    sharePct: 3.2,
    role: "host",
    medianOldAgeDep: 24,
    confidence: "estimated",
    fill: "#84cc16",
    note: "Russia → Central Asia (small $, extreme destination GDP share)",
  },
  {
    bloc: "Other high-income hosts",
    short: "Other HI",
    amountBn: 55,
    sharePct: 8.0,
    role: "host",
    medianOldAgeDep: 30,
    confidence: "estimated",
    fill: "#14b8a6",
    note: "Canada, Australia, East Asian HI hosts, etc.",
  },
  {
    bloc: "Untracked / residual origin",
    short: "Residual",
    amountBn: 222,
    sharePct: 32.4,
    role: "bridge",
    medianOldAgeDep: 14,
    confidence: "estimated",
    fill: "#64748b",
    note: "South–South, informal, and corridors outside the tracked tip",
  },
];

export type CorridorBloc = {
  id: string;
  label: string;
  short: string;
  fromBloc: string;
  toRegion: string;
  amountBn: number;
  shareOfLmicPct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Regional corridor blocs — geography of pipes, not single bilaterals */
export const CORRIDOR_BLOCS: CorridorBloc[] = [
  {
    id: "us-latam",
    label: "US → Latin America",
    short: "US→LatAm",
    fromBloc: "United States",
    toRegion: "Latin America & Caribbean",
    amountBn: 82,
    shareOfLmicPct: 12.0,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Mexico + Central America dominate; US→MX alone ~$52B",
  },
  {
    id: "gcc-sasia",
    label: "GCC → South Asia",
    short: "GCC→S.Asia",
    fromBloc: "GCC (Gulf)",
    toRegion: "South Asia",
    amountBn: 58,
    shareOfLmicPct: 8.5,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "UAE/Saudi → India/Pakistan/Bangladesh labour stacks",
  },
  {
    id: "us-eap",
    label: "US → East Asia & Pacific",
    short: "US→EAP",
    fromBloc: "United States",
    toRegion: "East Asia & Pacific",
    amountBn: 28,
    shareOfLmicPct: 4.1,
    confidence: "estimated",
    fill: "#ef4444",
    note: "US→Philippines tip plus smaller EAP corridors",
  },
  {
    id: "us-sasia",
    label: "US → South Asia",
    short: "US→S.Asia",
    fromBloc: "United States",
    toRegion: "South Asia",
    amountBn: 24,
    shareOfLmicPct: 3.5,
    confidence: "estimated",
    fill: "#f97316",
    note: "Skilled + family corridors to India / Pakistan / BD",
  },
  {
    id: "eu-africa-mena",
    label: "Europe → Africa & MENA",
    short: "EU→Afr/MENA",
    fromBloc: "Western Europe",
    toRegion: "SSA / MENA",
    amountBn: 22,
    shareOfLmicPct: 3.2,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    id: "ru-eca",
    label: "Russia → Central Asia",
    short: "RU→CA",
    fromBloc: "Russia & CIS hosts",
    toRegion: "Europe & Central Asia",
    amountBn: 12,
    shareOfLmicPct: 1.8,
    confidence: "estimated",
    fill: "#84cc16",
    note: "Small perimeter share; Tajikistan-class GDP dependence",
  },
];

export type DependenceGeo = {
  id: string;
  label: string;
  short: string;
  region: string;
  remittanceGdpPct: number;
  amountBn: number;
  oldAgeDependency: number;
  confidence: Confidence;
  fill: string;
};

/** High GDP-dependence economies with region tags — risk geography ≠ dollar geography */
export const DEPENDENCE_GEO: DependenceGeo[] = [
  {
    id: "tajikistan",
    label: "Tajikistan",
    short: "TJ",
    region: "Europe & Central Asia",
    remittanceGdpPct: 45,
    amountBn: 5.5,
    oldAgeDependency: 7,
    confidence: "disclosed",
    fill: "#ef4444",
  },
  {
    id: "nicaragua",
    label: "Nicaragua",
    short: "NI",
    region: "Latin America & Caribbean",
    remittanceGdpPct: 27,
    amountBn: 5,
    oldAgeDependency: 10,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    id: "lebanon",
    label: "Lebanon",
    short: "LB",
    region: "Middle East & North Africa",
    remittanceGdpPct: 27,
    amountBn: 6.7,
    oldAgeDependency: 16,
    confidence: "disclosed",
    fill: "#06b6d4",
  },
  {
    id: "honduras",
    label: "Honduras",
    short: "HN",
    region: "Latin America & Caribbean",
    remittanceGdpPct: 26,
    amountBn: 9,
    oldAgeDependency: 8,
    confidence: "disclosed",
    fill: "#38bdf8",
  },
  {
    id: "el-salvador",
    label: "El Salvador",
    short: "SV",
    region: "Latin America & Caribbean",
    remittanceGdpPct: 24,
    amountBn: 8,
    oldAgeDependency: 12,
    confidence: "estimated",
    fill: "#7dd3fc",
  },
  {
    id: "nepal",
    label: "Nepal",
    short: "NP",
    region: "South Asia",
    remittanceGdpPct: 23,
    amountBn: 11,
    oldAgeDependency: 10,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "samoa",
    label: "Samoa",
    short: "WS",
    region: "East Asia & Pacific",
    remittanceGdpPct: 28,
    amountBn: 0.3,
    oldAgeDependency: 11,
    confidence: "estimated",
    fill: "#ef4444",
  },
  {
    id: "gambia",
    label: "Gambia",
    short: "GM",
    region: "Sub-Saharan Africa",
    remittanceGdpPct: 22,
    amountBn: 0.7,
    oldAgeDependency: 5,
    confidence: "estimated",
    fill: "#f97316",
  },
  {
    id: "philippines",
    label: "Philippines",
    short: "PH",
    region: "East Asia & Pacific",
    remittanceGdpPct: 8.5,
    amountBn: 40,
    oldAgeDependency: 9,
    confidence: "disclosed",
    fill: "#a78bfa",
  },
  {
    id: "india",
    label: "India",
    short: "IN",
    region: "South Asia",
    remittanceGdpPct: 3.4,
    amountBn: 129,
    oldAgeDependency: 11,
    confidence: "disclosed",
    fill: "#fbbf24",
  },
  {
    id: "mexico",
    label: "Mexico",
    short: "MX",
    region: "Latin America & Caribbean",
    remittanceGdpPct: 3.7,
    amountBn: 68,
    oldAgeDependency: 13,
    confidence: "disclosed",
    fill: "#0284c7",
  },
  {
    id: "china",
    label: "China",
    short: "CN",
    region: "East Asia & Pacific",
    remittanceGdpPct: 0.3,
    amountBn: 48,
    oldAgeDependency: 21,
    confidence: "disclosed",
    fill: "#f87171",
  },
];

export type HostAgeBurden = {
  id: string;
  label: string;
  short: string;
  region: string;
  pensionGdpPct: number;
  oldAgeDependency: number;
  outboundRemitRole: "major host" | "moderate host" | "minor";
  confidence: Confidence;
  fill: string;
};

/** Host-side age / pension geography — where aging public balance sheets sit */
export const HOST_AGE_BURDENS: HostAgeBurden[] = [
  {
    id: "italy",
    label: "Italy",
    short: "IT",
    region: "Western Europe",
    pensionGdpPct: 16.3,
    oldAgeDependency: 40,
    outboundRemitRole: "moderate host",
    confidence: "disclosed",
    fill: "#0f766e",
  },
  {
    id: "france",
    label: "France",
    short: "FR",
    region: "Western Europe",
    pensionGdpPct: 14.5,
    oldAgeDependency: 37,
    outboundRemitRole: "moderate host",
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "germany",
    label: "Germany",
    short: "DE",
    region: "Western Europe",
    pensionGdpPct: 10.4,
    oldAgeDependency: 37,
    outboundRemitRole: "major host",
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    id: "japan",
    label: "Japan",
    short: "JP",
    region: "East Asia (HI)",
    pensionGdpPct: 9.4,
    oldAgeDependency: 54,
    outboundRemitRole: "moderate host",
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    id: "united-states",
    label: "United States",
    short: "US",
    region: "North America",
    pensionGdpPct: 7.1,
    oldAgeDependency: 28,
    outboundRemitRole: "major host",
    confidence: "estimated",
    fill: "#38bdf8",
  },
  {
    id: "united-kingdom",
    label: "United Kingdom",
    short: "UK",
    region: "Western Europe",
    pensionGdpPct: 5.8,
    oldAgeDependency: 32,
    outboundRemitRole: "major host",
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    id: "korea",
    label: "South Korea",
    short: "KR",
    region: "East Asia (HI)",
    pensionGdpPct: 3.6,
    oldAgeDependency: 26,
    outboundRemitRole: "moderate host",
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "saudi",
    label: "Saudi Arabia",
    short: "SA",
    region: "GCC",
    pensionGdpPct: 2.2,
    oldAgeDependency: 5,
    outboundRemitRole: "major host",
    confidence: "estimated",
    fill: "#10b981",
  },
];

export type MeterCompare = {
  id: string;
  label: string;
  meter: string;
  valuePct: number;
  fill: string;
};

/** Side-by-side geography meters for the compare strip */
export const METER_COMPARE: MeterCompare[] = [
  {
    id: "sasia-recv",
    label: "South Asia",
    meter: "Recipient $ share",
    valuePct: 26.3,
    fill: "#f59e0b",
  },
  {
    id: "latam-recv",
    label: "LatAm",
    meter: "Recipient $ share",
    valuePct: 17.2,
    fill: "#0ea5e9",
  },
  {
    id: "us-host",
    label: "United States",
    meter: "Host origin share",
    valuePct: 30.9,
    fill: "#38bdf8",
  },
  {
    id: "gcc-host",
    label: "GCC",
    meter: "Host origin share",
    valuePct: 14.0,
    fill: "#fbbf24",
  },
  {
    id: "us-latam",
    label: "US → LatAm",
    meter: "Corridor bloc share",
    valuePct: 12.0,
    fill: "#0284c7",
  },
  {
    id: "tj-dep",
    label: "Tajikistan",
    meter: "Remittance / GDP",
    valuePct: 45,
    fill: "#ef4444",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtUsdBn(n: number, digits = 0): string {
  return `$${n.toFixed(digits)}B`;
}

export function dependenceScatter() {
  return DEPENDENCE_GEO.map((d) => ({
    ...d,
    x: d.remittanceGdpPct,
    y: d.oldAgeDependency,
    z: Math.max(4, Math.sqrt(d.amountBn) * 6),
  }));
}

export function hostAgeScatter() {
  return HOST_AGE_BURDENS.map((h) => ({
    ...h,
    x: h.oldAgeDependency,
    y: h.pensionGdpPct,
    z: h.outboundRemitRole === "major host" ? 140 : h.outboundRemitRole === "moderate host" ? 90 : 50,
  }));
}
