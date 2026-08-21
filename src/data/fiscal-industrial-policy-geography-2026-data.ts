/**
 * Fiscal & industrial policy — geography lens (2026).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 *
 * Complements concentration (top-k / HHI) and research/update vintages with
 * regional share maps: stock counts, package dollars, US subnational awards,
 * and sector×region intensity.
 *
 * Primary sources:
 * - Teneo / GTA NIPO (Mar 2026): Big Three ~63% of cumulative industrial-policy stock
 * - IMF WP/24/1 + WP/25/222 H-NIPO: China+EU+US ~53% historical; ~48% of 2023 census
 * - GTA Monthly Roundup June 2026: US/EU/CN vs rest flow split
 * - CHIPS.gov / Commerce award notices: major US fab & packaging award geography
 * - Statutory package headlines: CHIPS, IRA, EU Chips/IPCEI, Big Fund III, JP/KR
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Regional stock shares roll jurisdiction buckets into continents using Teneo Big Three (~63%) plus estimated Japan/Korea/RoW splits from the theme concentration ledger. Package USD figures are statutory appropriations, mobilisation targets, state-aid approvals, or tax-credit scores — not outlays-to-date. US state award shares are estimated from public CHIPS/IRA megaproject notices (facility geography), not a full Commerce disbursement census. June 2026 flow from GTA Monthly Roundup. Sector×region intensities are estimated allocations of strategic / dual-use subsidy themes (GTA ZG #88 + NIPO sector coding).";

export const TENEO_URL =
  "https://www.teneo.com/app/uploads/2026/03/The-New-Age-of-Industrial-Policy-What-it-Means-for-Business-Strategy.pdf";
export const IMF_WP24_URL =
  "https://www.imf.org/en/publications/wp/issues/2023/12/23/the-return-of-industrial-policy-in-data-542828";
export const IMF_WP25_URL =
  "https://www.imf.org/en/Publications/WP/Issues/2025/10/17/Industrial-Policy-Since-the-Great-Financial-Crisis-571122";
export const GTA_ZG88_URL =
  "https://globaltradealert.org/reports/Subsidising-the-Chokepoint-Strategic-Convergence-and-Its-Limits";
export const GTA_JUN_URL =
  "https://globaltradealert.org/blog/GTA-Monthly-Roundup-June-2026";
export const GTA_NIPO_URL =
  "https://globaltradealert.org/reports/new-industrial-policy-observatory-nipo";
export const CHIPS_GOV_URL = "https://www.chips.gov/";

export const PRIOR_RESEARCH_PATH = "/blog/fiscal-industrial-policy-research-2026";
export const PRIOR_CONCENTRATION_PATH =
  "/blog/fiscal-industrial-policy-concentration-2026";
export const PRIOR_AUG608_PATH = "/blog/fiscal-industrial-policy-update-202608";
export const PRIOR_Q3_PATH = "/blog/fiscal-industrial-policy-update-2026q3";

export const HEADLINE = {
  /** East Asia share of cumulative stock counts (China + JP + KR est.) */
  eastAsiaStockSharePct: 33,
  /** Europe (EU+MS) stock share */
  europeStockSharePct: 18,
  /** North America (US-led) stock share */
  northAmericaStockSharePct: 21,
  /** Top-3 regions on stock counts */
  top3RegionStockSharePct: 72,
  /** Package $: North America share of major war-chest universe */
  northAmericaPackageSharePct: 71.4,
  /** Top-3 regions on package dollars (NA + Europe + East Asia) */
  top3RegionPackageSharePct: 97,
  packageUniverseUsdBn: 626,
  /** US subnational: top-3 states share of tracked CHIPS megaproject awards */
  usTop3StateAwardSharePct: 58,
  usTop3StatesLabel: "AZ · TX · NY",
  usTrackedAwardsUsdBn: 39.2,
  /** June 2026 flow — RoW still majority */
  juneRowSharePct: 62,
  juneTop3BlocSharePct: 38,
  juneTotal: 823,
  /** Sector geography: semiconductors East Asia intensity */
  semisEastAsiaIntensityPct: 41,
  cleanEnergyNorthAmericaIntensityPct: 48,
} as const;

export type RegionShare = {
  region: string;
  short: string;
  stockSharePct: number;
  packageSharePct: number;
  packageUsdBn: number;
  juneFlowSharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Four-region roll-up of industrial-policy geography.
 * Stock: China+JP+KR → East Asia; EU+MS → Europe; US → N. America; residual → RoW.
 * Package $: US → N. America; EU → Europe; CN+JP+KR → East Asia.
 */
export const REGION_SHARES: RegionShare[] = [
  {
    region: "East Asia",
    short: "E. Asia",
    stockSharePct: 33,
    packageSharePct: 14.7,
    packageUsdBn: 92,
    juneFlowSharePct: 8,
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

/** Jurisdiction points for region×$ scatter and country ladder */
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

/**
 * Tracked US CHIPS Act megaproject award geography (facility / preliminary notices).
 * Shares of a ~$39.2B tracked award tip — not the full $39B+ Commerce pipeline census.
 */
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

export type SectorRegionIntensity = {
  sector: string;
  short: string;
  eastAsiaPct: number;
  northAmericaPct: number;
  europePct: number;
  rowPct: number;
};

/**
 * Estimated regional intensity of strategic industrial-policy attention by sector.
 * Rows sum to ~100 within each sector (share of that sector's IP geography).
 */
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

/** June 2026 Monthly Roundup — geography of one month's tape */
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
    what: "Where the latest month's tape prints",
  },
  {
    meter: "US CHIPS megaproject awards",
    short: "US states",
    topRegion: "Arizona",
    topSharePct: 21.7,
    top3SharePct: 58,
    what: "Where US fab dollars land subnationally",
  },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtUsdBn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}B`;
}

export function regionByStock(): RegionShare[] {
  return [...REGION_SHARES].sort((a, b) => b.stockSharePct - a.stockSharePct);
}

export function regionByPackage(): RegionShare[] {
  return [...REGION_SHARES].sort((a, b) => b.packageSharePct - a.packageSharePct);
}

export function jurisdictionScatter() {
  return JURISDICTION_GEO.map((j) => ({
    ...j,
    x: j.stockSharePct,
    y: j.packageSharePct,
    z: Math.max(j.packageUsdBn, 4),
  }));
}

export function sectorStackedFor(region: "eastAsia" | "northAmerica" | "europe" | "row") {
  const key =
    region === "eastAsia"
      ? "eastAsiaPct"
      : region === "northAmerica"
        ? "northAmericaPct"
        : region === "europe"
          ? "europePct"
          : "rowPct";
  return SECTOR_REGION.map((s) => ({
    sector: s.short,
    full: s.sector,
    value: s[key],
  }));
}
