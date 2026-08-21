/**
 * Fiscal & industrial policy — Q3 2026 geography lens.
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 *
 * Q3 vintage complements the 2026 geography print by adding (1) stock–package
 * mismatch by region, (2) EU IPCEI / Chips Act member geography, (3) May→Jul
 * monthly flow path with June disclosed bloc shares, (4) strategic-subsidy
 * corridor intensity from ZG #88, and (5) a vintage slope of regional meters.
 *
 * Primary sources:
 * - Teneo / GTA NIPO (Mar 2026): Big Three ~63% of cumulative industrial-policy stock
 * - IMF WP/24/1 + WP/25/222 H-NIPO: China+EU+US ~53% historical; ~48% of 2023 census
 * - GTA ZG #88: strategic / dual-use subsidy shares inside Big Three
 * - GTA Monthly Roundups May / June / July 2026
 * - CHIPS.gov / Commerce award notices: major US fab & packaging award geography
 * - EU Chips Act / IPCEI state-aid geography (member participation notices)
 * - Statutory package headlines: CHIPS, IRA, EU Chips/IPCEI, Big Fund III, JP/KR
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Q3 geography lens. Regional stock shares roll jurisdiction buckets into continents using Teneo Big Three (~63%) plus estimated Japan/Korea/RoW splits. Package USD figures are statutory appropriations, mobilisation targets, state-aid approvals, or tax-credit scores — not outlays-to-date. Mismatch pp = package share − stock share. US state award shares are estimated from public CHIPS megaproject notices. EU member IPCEI shares are estimated from Chips Act / IPCEI participation notices inside an EU-bloc package tip — not full member-state industrial-policy outlays. June 2026 bloc shares disclosed in GTA Monthly Roundup; May/Jul totals disclosed without matching geography — regional path for those months is editorial. Strategic corridor intensities estimated from ZG #88 sector coding + NIPO geography.";

export const TENEO_URL =
  "https://www.teneo.com/app/uploads/2026/03/The-New-Age-of-Industrial-Policy-What-it-Means-for-Business-Strategy.pdf";
export const IMF_WP24_URL =
  "https://www.imf.org/en/publications/wp/issues/2023/12/23/the-return-of-industrial-policy-in-data-542828";
export const IMF_WP25_URL =
  "https://www.imf.org/en/Publications/WP/Issues/2025/10/17/Industrial-Policy-Since-the-Great-Financial-Crisis-571122";
export const GTA_ZG88_URL =
  "https://globaltradealert.org/reports/Subsidising-the-Chokepoint-Strategic-Convergence-and-Its-Limits";
export const GTA_MAY_URL =
  "https://globaltradealert.org/blog/GTA-Monthly-Roundup-May-2026";
export const GTA_JUN_URL =
  "https://globaltradealert.org/blog/GTA-Monthly-Roundup-June-2026";
export const GTA_JUL_URL =
  "https://globaltradealert.org/blog/GTA-Monthly-Roundup-July-2026";
export const GTA_NIPO_URL =
  "https://globaltradealert.org/reports/new-industrial-policy-observatory-nipo";
export const CHIPS_GOV_URL = "https://www.chips.gov/";

export const PRIOR_GEO_PATH = "/blog/fiscal-industrial-policy-geography-2026";
export const PRIOR_RESEARCH_PATH = "/blog/fiscal-industrial-policy-research-2026";
export const PRIOR_CONCENTRATION_PATH =
  "/blog/fiscal-industrial-policy-concentration-2026q3";
export const PRIOR_Q3_PATH = "/blog/fiscal-industrial-policy-update-2026q3";
export const PRIOR_AUG608_PATH = "/blog/fiscal-industrial-policy-update-202608";

export const HEADLINE = {
  /** East Asia share of cumulative stock counts (China + JP + KR est.) */
  eastAsiaStockSharePct: 33,
  europeStockSharePct: 18,
  northAmericaStockSharePct: 21,
  rowStockSharePct: 28,
  top3RegionStockSharePct: 72,
  /** Package $: North America share of major war-chest universe */
  northAmericaPackageSharePct: 71.4,
  top3RegionPackageSharePct: 97,
  packageUniverseUsdBn: 626,
  /** Largest stock–package mismatch (NA package − stock) */
  naMismatchPp: 50.4,
  eastAsiaMismatchPp: -18.3,
  /** US subnational: top-3 states share of tracked CHIPS megaproject awards */
  usTop3StateAwardSharePct: 58,
  usTop3StatesLabel: "AZ · TX · NY",
  usTrackedAwardsUsdBn: 39.2,
  /** EU IPCEI tip: top-3 members */
  euTop3MemberSharePct: 61,
  euTop3MembersLabel: "DE · FR · IT",
  euIpceiTipUsdBn: 43,
  /** June 2026 flow — RoW still majority */
  juneRowSharePct: 62,
  juneTop3BlocSharePct: 38,
  juneTotal: 823,
  mayTotal: 804,
  julTotal: 1008,
  julVsMayDeltaPct: 25,
  /** Strategic corridor: Indo-Pacific semis intensity */
  indoPacificSemisPct: 41,
  transatlanticCleanPct: 72,
  /** Regional stock HHI (4-bucket) */
  regionStockHhi: 2658,
  regionPackageHhi: 5460,
} as const;

export type RegionShare = {
  region: string;
  short: string;
  stockSharePct: number;
  packageSharePct: number;
  packageUsdBn: number;
  juneFlowSharePct: number;
  mismatchPp: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Four-region roll-up of industrial-policy geography.
 * Stock: China+JP+KR → East Asia; EU+MS → Europe; US → N. America; residual → RoW.
 * Package $: US → N. America; EU → Europe; CN+JP+KR → East Asia.
 * mismatchPp = packageSharePct − stockSharePct.
 */
export const REGION_SHARES: RegionShare[] = [
  {
    region: "East Asia",
    short: "E. Asia",
    stockSharePct: 33,
    packageSharePct: 14.7,
    packageUsdBn: 92,
    juneFlowSharePct: 8,
    mismatchPp: -18.3,
    confidence: "estimated",
    fill: "#f43f5e",
    note: "China (~24%) + Japan (~5%) + Korea (~4%) on count stock; Big Fund III + JP/KR packages on $",
  },
  {
    region: "North America",
    short: "N. America",
    stockSharePct: 21,
    packageSharePct: 71.4,
    packageUsdBn: 446.7,
    juneFlowSharePct: 20,
    mismatchPp: 50.4,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "US-dominated; IRA TE + CHIPS appropriations/ITC dominate package dollars",
  },
  {
    region: "Europe",
    short: "Europe",
    stockSharePct: 18,
    packageSharePct: 13.9,
    packageUsdBn: 87,
    juneFlowSharePct: 12,
    mismatchPp: -4.1,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "EU + member states as one bloc (Teneo Big Three framing)",
  },
  {
    region: "Rest of world",
    short: "RoW",
    stockSharePct: 28,
    packageSharePct: 0,
    packageUsdBn: 0,
    juneFlowSharePct: 62,
    mismatchPp: -28,
    confidence: "estimated",
    fill: "#64748b",
    note: "Closes stock after Big Three + JP/KR; dominates June monthly flow counts",
  },
];

export type JurisdictionGeo = {
  jurisdiction: string;
  short: string;
  region: string;
  stockSharePct: number;
  packageUsdBn: number;
  packageSharePct: number;
  confidence: Confidence;
  fill: string;
};

export const JURISDICTION_GEO: JurisdictionGeo[] = [
  {
    jurisdiction: "China",
    short: "China",
    region: "East Asia",
    stockSharePct: 24,
    packageUsdBn: 48,
    packageSharePct: 7.7,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    jurisdiction: "United States",
    short: "US",
    region: "North America",
    stockSharePct: 21,
    packageUsdBn: 446.7,
    packageSharePct: 71.4,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    jurisdiction: "European Union + MS",
    short: "EU",
    region: "Europe",
    stockSharePct: 18,
    packageUsdBn: 87,
    packageSharePct: 13.9,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    jurisdiction: "Japan",
    short: "Japan",
    region: "East Asia",
    stockSharePct: 5,
    packageUsdBn: 25,
    packageSharePct: 4.0,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    jurisdiction: "South Korea",
    short: "Korea",
    region: "East Asia",
    stockSharePct: 4,
    packageUsdBn: 19,
    packageSharePct: 3.0,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    jurisdiction: "Rest of world",
    short: "RoW",
    region: "Rest of world",
    stockSharePct: 28,
    packageUsdBn: 0,
    packageSharePct: 0,
    confidence: "estimated",
    fill: "#64748b",
  },
];

export type UsStateAward = {
  state: string;
  short: string;
  awardUsdBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  projects: string;
  confidence: Confidence;
  fill: string;
};

export const US_STATE_AWARDS: UsStateAward[] = [
  {
    state: "Arizona",
    short: "AZ",
    awardUsdBn: 8.5,
    sharePct: 21.7,
    cumulativeSharePct: 21.7,
    projects: "TSMC Phoenix fabs; related packaging notices",
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    state: "Texas",
    short: "TX",
    awardUsdBn: 8.0,
    sharePct: 20.4,
    cumulativeSharePct: 42.1,
    projects: "Samsung Taylor; Texas Instruments Sherman corridor",
    confidence: "estimated",
    fill: "#38bdf8",
  },
  {
    state: "New York",
    short: "NY",
    awardUsdBn: 6.2,
    sharePct: 15.8,
    cumulativeSharePct: 57.9,
    projects: "Micron Clay / Central NY memory campus",
    confidence: "estimated",
    fill: "#818cf8",
  },
  {
    state: "Ohio",
    short: "OH",
    awardUsdBn: 3.9,
    sharePct: 9.9,
    cumulativeSharePct: 67.8,
    projects: "Intel New Albany / Licking County",
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    state: "Oregon",
    short: "OR",
    awardUsdBn: 3.2,
    sharePct: 8.2,
    cumulativeSharePct: 76.0,
    projects: "Intel Ronler / Hillsboro expansion notices",
    confidence: "estimated",
    fill: "#c084fc",
  },
  {
    state: "Other tracked states",
    short: "Other",
    awardUsdBn: 9.4,
    sharePct: 24.0,
    cumulativeSharePct: 100,
    projects: "ID, NM, IN, NC, and smaller packaging / supplier awards",
    confidence: "estimated",
    fill: "#64748b",
  },
];

/** EU Chips Act / IPCEI participation tip inside ~$43B tracked EU package geography */
export type EuMemberShare = {
  member: string;
  short: string;
  sharePct: number;
  tipUsdBn: number;
  cumulativeSharePct: number;
  focus: string;
  confidence: Confidence;
  fill: string;
};

export const EU_MEMBER_SHARES: EuMemberShare[] = [
  {
    member: "Germany",
    short: "DE",
    sharePct: 28,
    tipUsdBn: 12.0,
    cumulativeSharePct: 28,
    focus: "Intel Magdeburg corridor; Infineon / auto-chip IPCEI",
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    member: "France",
    short: "FR",
    sharePct: 18,
    tipUsdBn: 7.7,
    cumulativeSharePct: 46,
    focus: "STMicro / GlobalFoundries Crolles; battery IPCEI nodes",
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    member: "Italy",
    short: "IT",
    sharePct: 15,
    tipUsdBn: 6.5,
    cumulativeSharePct: 61,
    focus: "STMicro Catania / Agrate; automotive semiconductor IPCEI",
    confidence: "estimated",
    fill: "#c4b5fd",
  },
  {
    member: "Netherlands",
    short: "NL",
    sharePct: 9,
    tipUsdBn: 3.9,
    cumulativeSharePct: 70,
    focus: "ASML ecosystem + NXP / packaging notices",
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    member: "Spain",
    short: "ES",
    sharePct: 7,
    tipUsdBn: 3.0,
    cumulativeSharePct: 77,
    focus: "Power electronics / battery IPCEI participation",
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    member: "Other EU members",
    short: "Other",
    sharePct: 23,
    tipUsdBn: 9.9,
    cumulativeSharePct: 100,
    focus: "IE, BE, AT, PL, and smaller Chips Act / IPCEI participants",
    confidence: "estimated",
    fill: "#64748b",
  },
];

export type SectorRegionIntensity = {
  sector: string;
  short: string;
  eastAsiaPct: number;
  northAmericaPct: number;
  europePct: number;
  rowPct: number;
};

export const SECTOR_REGION: SectorRegionIntensity[] = [
  {
    sector: "Semiconductors & advanced packaging",
    short: "Semis",
    eastAsiaPct: 41,
    northAmericaPct: 32,
    europePct: 18,
    rowPct: 9,
  },
  {
    sector: "Clean energy & grid",
    short: "Clean energy",
    eastAsiaPct: 22,
    northAmericaPct: 48,
    europePct: 24,
    rowPct: 6,
  },
  {
    sector: "EVs & batteries",
    short: "EV / battery",
    eastAsiaPct: 38,
    northAmericaPct: 28,
    europePct: 26,
    rowPct: 8,
  },
  {
    sector: "Dual-use / advanced tech",
    short: "Dual-use",
    eastAsiaPct: 36,
    northAmericaPct: 34,
    europePct: 22,
    rowPct: 8,
  },
  {
    sector: "Critical minerals processing",
    short: "Minerals",
    eastAsiaPct: 44,
    northAmericaPct: 18,
    europePct: 16,
    rowPct: 22,
  },
];

export type FlowBloc = {
  bloc: string;
  short: string;
  region: string;
  interventions: number;
  sharePct: number;
  confidence: Confidence;
  fill: string;
};

export const JUNE_FLOW: FlowBloc[] = [
  {
    bloc: "United States",
    short: "US",
    region: "North America",
    interventions: 163,
    sharePct: 20,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    bloc: "European Union + MS",
    short: "EU",
    region: "Europe",
    interventions: 100,
    sharePct: 12,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    bloc: "China",
    short: "China",
    region: "East Asia",
    interventions: 47,
    sharePct: 6,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    bloc: "Rest of world",
    short: "RoW",
    region: "Rest of world",
    interventions: 513,
    sharePct: 62,
    confidence: "disclosed",
    fill: "#64748b",
  },
];

/** May→Jul monthly totals + June disclosed geography path (editorial for May/Jul shares) */
export type MonthlyFlowPath = {
  month: string;
  total: number;
  usSharePct: number;
  euSharePct: number;
  chinaSharePct: number;
  rowSharePct: number;
  confidence: Confidence;
};

export const MONTHLY_FLOW_PATH: MonthlyFlowPath[] = [
  {
    month: "May 2026",
    total: 804,
    usSharePct: 18,
    euSharePct: 11,
    chinaSharePct: 7,
    rowSharePct: 64,
    confidence: "estimated",
  },
  {
    month: "June 2026",
    total: 823,
    usSharePct: 20,
    euSharePct: 12,
    chinaSharePct: 6,
    rowSharePct: 62,
    confidence: "disclosed",
  },
  {
    month: "July 2026",
    total: 1008,
    usSharePct: 19,
    euSharePct: 13,
    chinaSharePct: 5,
    rowSharePct: 63,
    confidence: "estimated",
  },
];

export type CorridorIntensity = {
  corridor: string;
  short: string;
  semisPct: number;
  cleanPct: number;
  dualUsePct: number;
  mineralsPct: number;
  fill: string;
};

/** Strategic-theme intensity by policy corridor (rows ≈ share of that theme’s geography) */
export const CORRIDOR_INTENSITY: CorridorIntensity[] = [
  {
    corridor: "Indo-Pacific (CN·JP·KR + allies)",
    short: "Indo-Pacific",
    semisPct: 41,
    cleanPct: 22,
    dualUsePct: 36,
    mineralsPct: 44,
    fill: "#f43f5e",
  },
  {
    corridor: "Transatlantic (US·EU)",
    short: "Transatlantic",
    semisPct: 50,
    cleanPct: 72,
    dualUsePct: 56,
    mineralsPct: 34,
    fill: "#0ea5e9",
  },
  {
    corridor: "Rest of world",
    short: "RoW",
    semisPct: 9,
    cleanPct: 6,
    dualUsePct: 8,
    mineralsPct: 22,
    fill: "#64748b",
  },
];

export type VintageSlope = {
  vintage: string;
  eastAsiaStockPct: number;
  naPackagePct: number;
  juneRowPct: number;
  usTop3StatePct: number;
};

/** Desk meters across research → geography 2026 → Q3 geography */
export const VINTAGE_SLOPE: VintageSlope[] = [
  {
    vintage: "Research 2026",
    eastAsiaStockPct: 32,
    naPackagePct: 70,
    juneRowPct: 60,
    usTop3StatePct: 55,
  },
  {
    vintage: "Geography 2026",
    eastAsiaStockPct: 33,
    naPackagePct: 71.4,
    juneRowPct: 62,
    usTop3StatePct: 58,
  },
  {
    vintage: "Geography Q3",
    eastAsiaStockPct: 33,
    naPackagePct: 71.4,
    juneRowPct: 62,
    usTop3StatePct: 58,
  },
];

export type MeterCompare = {
  meter: string;
  short: string;
  topRegion: string;
  topSharePct: number;
  top3SharePct: number;
  what: string;
};

export const METER_COMPARE: MeterCompare[] = [
  {
    meter: "Cumulative stock (counts)",
    short: "Stock",
    topRegion: "East Asia",
    topSharePct: 33,
    top3SharePct: 72,
    what: "Where interventions accumulate",
  },
  {
    meter: "Major fiscal packages ($)",
    short: "Packages",
    topRegion: "North America",
    topSharePct: 71.4,
    top3SharePct: 97,
    what: "Where war-chest capacity sits",
  },
  {
    meter: "June 2026 monthly flow",
    short: "June flow",
    topRegion: "Rest of world",
    topSharePct: 62,
    top3SharePct: 38,
    what: "Where the latest disclosed month prints",
  },
  {
    meter: "US CHIPS megaproject awards",
    short: "US states",
    topRegion: "Arizona",
    topSharePct: 21.7,
    top3SharePct: 58,
    what: "Where US fab dollars land subnationally",
  },
  {
    meter: "EU IPCEI / Chips tip",
    short: "EU members",
    topRegion: "Germany",
    topSharePct: 28,
    top3SharePct: 61,
    what: "Where EU package geography concentrates",
  },
];

export const SOURCES = [
  { label: "Teneo / GTA NIPO — New Age of Industrial Policy", url: TENEO_URL },
  { label: "IMF WP/24/1 — Return of industrial policy", url: IMF_WP24_URL },
  { label: "IMF WP/25/222 — H-NIPO since GFC", url: IMF_WP25_URL },
  { label: "GTA ZG #88 — Subsidising the Chokepoint", url: GTA_ZG88_URL },
  { label: "GTA Monthly Roundup — May 2026", url: GTA_MAY_URL },
  { label: "GTA Monthly Roundup — June 2026", url: GTA_JUN_URL },
  { label: "GTA Monthly Roundup — July 2026", url: GTA_JUL_URL },
  { label: "CHIPS.gov award notices", url: CHIPS_GOV_URL },
] as const;

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtUsdBn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function jurisdictionScatter() {
  return JURISDICTION_GEO.map((j) => ({
    ...j,
    x: j.stockSharePct,
    y: j.packageSharePct,
    z: Math.max(j.packageUsdBn, 4),
  }));
}

export function mismatchBars() {
  return [...REGION_SHARES].sort((a, b) => b.mismatchPp - a.mismatchPp);
}
