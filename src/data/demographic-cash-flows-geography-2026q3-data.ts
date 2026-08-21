/**
 * Demographic cash flows — geography lens (Q3 2026).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * How do age and migration show up in money flows?
 *
 * Q3 vintage of the 2026 geography print. Banxico FY2025 $61.791B restates Mexico inside LatAm destination dollars and the US?LatAm corridor bloc; Brief 41 $685B perimeter and host/dependence maps carry. Complements concentration (top-k / HHI)
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
  "Q3 geography vs geography-2026: destination regions re-rolled after Banxico FY2025 Mexico $61.791B (-$6.2B vs Brief 41 ~$68B). LatAm share ~16.3% (was ~17.2%); residual absorbs the delta. Host-bloc and dependence geography largely carried. Regional recipient shares roll Brief 41 LMIC inflows (~$685B, 2024) into World Bank-style destination regions using disclosed country anchors (India/Mexico/China/Philippines/Pakistan/etc.) plus an analytical residual that closes the perimeter. Host-bloc origin shares estimate outbound geography from KNOMAD corridor dollars against the same $685B perimeter (tracked corridors are a lower bound). Dependence×region points use Brief 41 GDP-dependence ranks. Host pension % GDP from OECD Pensions at a Glance. Confidence tags separate disclosed tallies from regional roll-ups.";

export const PRIOR_GEO_PATH = "/blog/demographic-cash-flows-geography-2026";
export const PRIOR_RESEARCH_PATH = "/blog/demographic-cash-flows-research-2026";
export const PRIOR_CONCENTRATION_PATH =
  "/blog/demographic-cash-flows-concentration-2026q3";
export const PRIOR_AUG608_PATH = "/blog/demographic-cash-flows-concentration-202608";
export const PRIOR_BRIEF_GEO_PATH = "/blog/demographic-cash-flows-geography-2026";
export const CORRIDORS_PATH = "/blog/global-remittance-corridors-2026";
export const PRIOR_UPDATE_PATH = "/blog/demographic-cash-flows-update-2026q3";
export const PRIOR_AUG_UPDATE_PATH = "/blog/demographic-cash-flows-update-202608";

export const HEADLINE = {
  /** Destination region with largest LMIC remittance $ share (unchanged) */
  top1RegionSharePct: 26,
  top1RegionLabel: "South Asia",
  top1RegionBn: 180,
  /** Top-3 destination regions after Banxico Mexico restatement */
  top3RegionSharePct: 57,
  top3RegionLabel: "South Asia · LatAm · East Asia & Pacific",
  top3RegionShareBrief41Pct: 58,
  lmicUniverseBn: 685,
  /** LatAm vintage delta — Brief 41 → Banxico FY2025 Mexico */
  latamBrief41SharePct: 17.2,
  latamBanxicoSharePct: 16.3,
  latamShareDeltaPp: -0.9,
  latamBrief41Bn: 118,
  latamBanxicoBn: 111.8,
  mexicoBrief41Bn: 68,
  mexicoBanxicoFy2025Bn: 61.791,
  mexicoH1_2026Bn: 30.759,
  mexicoH1YoyPct: 3.1,
  /** Host origin: US-led share of tracked outbound (carried) */
  usHostSharePct: 31,
  usHostBn: 212,
  top1HostLabel: "United States",
  gccHostSharePct: 14,
  /** Largest corridor bloc — Banxico softens US→LatAm tip */
  top1CorridorBlocSharePct: 11,
  top1CorridorBlocShareBrief41Pct: 12,
  top1CorridorBlocLabel: "US → Latin America",
  top1CorridorBlocBn: 75.8,
  top1CorridorBlocBrief41Bn: 82,
  usMxCorridorBn: 52,
  usMxBanxicoImpliedBn: 61.8,
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
    amountBn: 111.8,
    sharePct: 16.3,
    cumulativeSharePct: 42.6,
    medianOldAgeDep: 12,
    topCountry: "Mexico",
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Banxico FY2025 Mexico $61.791B (−$6.2B vs Brief 41) + CA/Caribbean corridors",
  },
  {
    region: "East Asia & Pacific",
    short: "EAP",
    amountBn: 102,
    sharePct: 14.9,
    cumulativeSharePct: 57.5,
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
    cumulativeSharePct: 67.4,
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
    cumulativeSharePct: 75.3,
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
    cumulativeSharePct: 81.4,
    medianOldAgeDep: 18,
    topCountry: "Ukraine / Tajikistan",
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Small dollars; hosts extreme GDP-dependence cases (TJ)",
  },
  {
    region: "Other / residual LMICs",
    short: "Residual",
    amountBn: 127.2,
    sharePct: 18.6,
    cumulativeSharePct: 100,
    medianOldAgeDep: 12,
    topCountry: "—",
    confidence: "estimated",
    fill: "#64748b",
    note: "Analytical residual; absorbs Banxico Mexico −$6.2B vs Brief 41 perimeter close",
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
    amountBn: 75.8,
    shareOfLmicPct: 11.1,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Banxico MX $61.8B tip + CA corridors; Brief 41 bloc was ~$82B / 12%",
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
    remittanceGdpPct: 3.4,
    amountBn: 61.791,
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
    valuePct: 16.3,
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
    valuePct: 11.1,
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

/** Brief 41 geography → Banxico Q3 restatement deltas (pp / $B) */
export type VintageDelta = {
  id: string;
  label: string;
  short: string;
  meter: string;
  brief41Pct: number;
  banxicoPct: number;
  deltaPp: number;
  fill: string;
};

export const VINTAGE_DELTAS: VintageDelta[] = [
  {
    id: "latam-recv",
    label: "LatAm recipient share",
    short: "LatAm $",
    meter: "Destination region",
    brief41Pct: 17.2,
    banxicoPct: 16.3,
    deltaPp: -0.9,
    fill: "#0ea5e9",
  },
  {
    id: "us-latam",
    label: "US → LatAm corridor",
    short: "US→LatAm",
    meter: "Corridor bloc",
    brief41Pct: 12.0,
    banxicoPct: 11.1,
    deltaPp: -0.9,
    fill: "#0284c7",
  },
  {
    id: "top3-recv",
    label: "Top-3 destination regions",
    short: "Top-3 dest",
    meter: "Destination tip",
    brief41Pct: 58.4,
    banxicoPct: 57.5,
    deltaPp: -0.9,
    fill: "#f59e0b",
  },
  {
    id: "sasia-recv",
    label: "South Asia recipient share",
    short: "S. Asia $",
    meter: "Destination region",
    brief41Pct: 26.3,
    banxicoPct: 26.3,
    deltaPp: 0,
    fill: "#fbbf24",
  },
  {
    id: "us-host",
    label: "US host origin share",
    short: "US host",
    meter: "Host origin",
    brief41Pct: 30.9,
    banxicoPct: 30.9,
    deltaPp: 0,
    fill: "#38bdf8",
  },
  {
    id: "residual",
    label: "Residual LMIC close",
    short: "Residual",
    meter: "Destination residual",
    brief41Pct: 17.7,
    banxicoPct: 18.6,
    deltaPp: 0.9,
    fill: "#64748b",
  },
];

export type VintageSlope = {
  id: string;
  label: string;
  brief41: number;
  banxico: number;
  fill: string;
};

/** Slope chart — Brief 41 vs Banxico Q3 on key geography meters */
export const VINTAGE_SLOPE: VintageSlope[] = [
  { id: "latam", label: "LatAm dest %", brief41: 17.2, banxico: 16.3, fill: "#0ea5e9" },
  { id: "corridor", label: "US→LatAm %", brief41: 12.0, banxico: 11.1, fill: "#0284c7" },
  { id: "top3", label: "Top-3 dest %", brief41: 58.4, banxico: 57.5, fill: "#f59e0b" },
  { id: "mx-gdp", label: "MX remit/GDP", brief41: 3.7, banxico: 3.4, fill: "#38bdf8" },
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

export function vintageDumbbell() {
  return VINTAGE_DELTAS.map((v) => ({
    ...v,
    name: v.short,
  }));
}
