/**
 * Fiscal & industrial policy — Aug 202608 geography lens.
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 *
 * 202608 vintage complements the Q3 geography print by folding in (1) Korea
 * mega-plan sensitivity that flips East Asia’s package-dollar share, (2)
 * ownership / equity-stake geography from Jun–Jul GTA roundups, (3) 2025
 * instrument mix by region (import barriers / subsidies / finance), (4) a
 * North America battery nearshore corridor (US·CA·MX nodes), and (5) the
 * May→Jul monthly flow path with June disclosed bloc shares.
 *
 * Primary sources:
 * - Teneo / GTA NIPO (Mar 2026): Big Three ~63% of cumulative industrial-policy stock
 * - IMF WP/24/1 + WP/25/222 H-NIPO: China+EU+US ~53% historical; ~48% of 2023 census
 * - GTA ZG #88: strategic / dual-use subsidy shares inside Big Three
 * - GTA Monthly Roundups May / June / July 2026
 * - Statutory package headlines: CHIPS, IRA, EU Chips/IPCEI, Big Fund III, JP/KR
 * - Korea mega-plan headline (~$951B) as alternate package-universe sensitivity
 * - CHIPS.gov / Commerce + IRA / USMCA battery corridor notices
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Aug 202608 geography lens. Regional stock shares roll jurisdiction buckets into continents using Teneo Big Three (~63%) plus estimated Japan/Korea/RoW splits. Package USD figures are statutory appropriations, mobilisation targets, state-aid approvals, or tax-credit scores — not outlays-to-date. Korea mega-plan (~$951B) is a disclosed headline used only in the alternate package universe; it is not dollar-for-dollar comparable to IRA TE / CHIPS appropriations. Ownership stakes from GTA Jun–Jul 2026 Roundups (equity LOIs / funds). Toolkit mix from Teneo Fig.2 (2025) rolled to regions. Battery corridor nodes estimated from public IRA / USMCA / provincial notices. June 2026 bloc shares disclosed in GTA Monthly Roundup; May/Jul totals disclosed without matching geography — regional path for those months is editorial.";

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

export const PRIOR_GEO_Q3_PATH =
  "/blog/fiscal-industrial-policy-geography-2026q3";
export const PRIOR_GEO_PATH = "/blog/fiscal-industrial-policy-geography-2026";
export const PRIOR_CONC_608_PATH =
  "/blog/fiscal-industrial-policy-concentration-202608";
export const PRIOR_RESEARCH_PATH = "/blog/fiscal-industrial-policy-research-2026";
export const PRIOR_AUG608_PATH = "/blog/fiscal-industrial-policy-update-202608";

export const HEADLINE = {
  /** Core regional anchors (excl. Korea mega-plan) */
  eastAsiaStockSharePct: 33,
  northAmericaStockSharePct: 21,
  europeStockSharePct: 18,
  rowStockSharePct: 28,
  top3RegionStockSharePct: 72,
  northAmericaPackageSharePct: 71.4,
  eastAsiaPackageSharePct: 14.7,
  top3RegionPackageSharePct: 97,
  packageUniverseUsdBn: 626,
  naMismatchPp: 50.4,
  eastAsiaMismatchPp: -18.3,
  /** Korea mega-plan sensitivity — regional package flip */
  koreaMegaPlanUsdBn: 951,
  altUniverseUsdBn: 1577,
  altEastAsiaPackageSharePct: 66.1,
  altNorthAmericaPackageSharePct: 28.3,
  altNaMismatchPp: 7.3,
  altEastAsiaMismatchPp: 33.1,
  /** Ownership geography */
  ownershipUniverseUsdBn: 5.21,
  chinaOwnershipSharePct: 63,
  ownershipTop3NodeSharePct: 63,
  ownershipTop3Label: "Anhui · Guangdong · Shanghai funds",
  /** Instrument mix (2025 toolkit, regional roll) */
  eastAsiaSubsidySharePct: 48,
  northAmericaBarrierSharePct: 41,
  europeFinanceSharePct: 29,
  /** Battery nearshore corridor */
  batteryCorridorUsdBn: 52,
  batteryTop3NodeSharePct: 54,
  batteryTop3Label: "MI · ON · TX",
  /** June 2026 flow — RoW still majority */
  juneRowSharePct: 62,
  juneTop3BlocSharePct: 38,
  juneTotal: 823,
  mayTotal: 804,
  julTotal: 1008,
  julVsMayDeltaPct: 25,
  /** Regional HHI */
  regionStockHhi: 2658,
  regionPackageHhi: 5460,
  altRegionPackageHhi: 4980,
} as const;

export type RegionShare = {
  region: string;
  short: string;
  stockSharePct: number;
  packageSharePct: number;
  packageUsdBn: number;
  altPackageSharePct: number;
  altPackageUsdBn: number;
  juneFlowSharePct: number;
  mismatchPp: number;
  altMismatchPp: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Four-region roll-up. Core package $ exclude Korea mega-plan;
 * alt* columns include the $951B headline inside East Asia.
 */
export const REGION_SHARES: RegionShare[] = [
  {
    region: "East Asia",
    short: "E. Asia",
    stockSharePct: 33,
    packageSharePct: 14.7,
    packageUsdBn: 92,
    altPackageSharePct: 66.1,
    altPackageUsdBn: 1043,
    juneFlowSharePct: 8,
    mismatchPp: -18.3,
    altMismatchPp: 33.1,
    confidence: "estimated",
    fill: "#f43f5e",
    note: "China + JP + KR on counts; Big Fund III + JP/KR + Korea mega-plan (alt) on $",
  },
  {
    region: "North America",
    short: "N. America",
    stockSharePct: 21,
    packageSharePct: 71.4,
    packageUsdBn: 446.7,
    altPackageSharePct: 28.3,
    altPackageUsdBn: 446.7,
    juneFlowSharePct: 20,
    mismatchPp: 50.4,
    altMismatchPp: 7.3,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "US-dominated; IRA TE + CHIPS appropriations/ITC dominate core package dollars",
  },
  {
    region: "Europe",
    short: "Europe",
    stockSharePct: 18,
    packageSharePct: 13.9,
    packageUsdBn: 87,
    altPackageSharePct: 5.5,
    altPackageUsdBn: 87,
    juneFlowSharePct: 12,
    mismatchPp: -4.1,
    altMismatchPp: -12.5,
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
    altPackageSharePct: 0,
    altPackageUsdBn: 0,
    juneFlowSharePct: 62,
    mismatchPp: -28,
    altMismatchPp: -28,
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

/** Ownership / equity-stake geography (Jun–Jul GTA; $5.21B tracked universe) */
export type OwnershipNode = {
  node: string;
  short: string;
  region: string;
  stakeUsdBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  focus: string;
  confidence: Confidence;
  fill: string;
};

export const OWNERSHIP_NODES: OwnershipNode[] = [
  {
    node: "Anhui provincial / municipal funds",
    short: "Anhui",
    region: "East Asia",
    stakeUsdBn: 1.45,
    sharePct: 27.8,
    cumulativeSharePct: 27.8,
    focus: "EV / battery equity LOIs; subnational industrial funds",
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    node: "Guangdong industrial funds",
    short: "Guangdong",
    region: "East Asia",
    stakeUsdBn: 1.15,
    sharePct: 22.1,
    cumulativeSharePct: 49.9,
    focus: "Semis + advanced manufacturing equity stakes",
    confidence: "estimated",
    fill: "#fb7185",
  },
  {
    node: "Shanghai / Yangtze fund complex",
    short: "Shanghai",
    region: "East Asia",
    stakeUsdBn: 0.70,
    sharePct: 13.4,
    cumulativeSharePct: 63.3,
    focus: "IC + dual-use tech fund participations",
    confidence: "estimated",
    fill: "#fda4af",
  },
  {
    node: "US DOE / Defense equity & offtake",
    short: "US fed",
    region: "North America",
    stakeUsdBn: 0.55,
    sharePct: 10.6,
    cumulativeSharePct: 73.9,
    focus: "Critical minerals + battery offtake / equity LOIs",
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    node: "EU member IPCEI equity co-invest",
    short: "EU MS",
    region: "Europe",
    stakeUsdBn: 0.48,
    sharePct: 9.2,
    cumulativeSharePct: 83.1,
    focus: "Battery + hydrogen IPCEI equity legs",
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    node: "Other tracked nodes",
    short: "Other",
    region: "Rest of world",
    stakeUsdBn: 0.88,
    sharePct: 16.9,
    cumulativeSharePct: 100,
    focus: "JP/KR funds + RoW development-bank equity",
    confidence: "estimated",
    fill: "#64748b",
  },
];

/** 2025 toolkit instrument mix rolled to regions (shares within region) */
export type InstrumentMix = {
  region: string;
  short: string;
  subsidiesPct: number;
  importBarriersPct: number;
  financeControlsPct: number;
  otherPct: number;
  fill: string;
};

export const INSTRUMENT_MIX: InstrumentMix[] = [
  {
    region: "East Asia",
    short: "E. Asia",
    subsidiesPct: 48,
    importBarriersPct: 22,
    financeControlsPct: 18,
    otherPct: 12,
    fill: "#f43f5e",
  },
  {
    region: "North America",
    short: "N. America",
    subsidiesPct: 34,
    importBarriersPct: 41,
    financeControlsPct: 15,
    otherPct: 10,
    fill: "#0ea5e9",
  },
  {
    region: "Europe",
    short: "Europe",
    subsidiesPct: 38,
    importBarriersPct: 21,
    financeControlsPct: 29,
    otherPct: 12,
    fill: "#8b5cf6",
  },
  {
    region: "Rest of world",
    short: "RoW",
    subsidiesPct: 29,
    importBarriersPct: 36,
    financeControlsPct: 20,
    otherPct: 15,
    fill: "#64748b",
  },
];

/** North America battery / EV nearshore corridor nodes (~$52B tracked tip) */
export type BatteryNode = {
  node: string;
  short: string;
  country: string;
  tipUsdBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  focus: string;
  confidence: Confidence;
  fill: string;
};

export const BATTERY_NODES: BatteryNode[] = [
  {
    node: "Michigan corridor",
    short: "MI",
    country: "US",
    tipUsdBn: 11.2,
    sharePct: 21.5,
    cumulativeSharePct: 21.5,
    focus: "Cell + pack plants; IRA 45X / state stack",
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    node: "Ontario corridor",
    short: "ON",
    country: "Canada",
    tipUsdBn: 9.8,
    sharePct: 18.8,
    cumulativeSharePct: 40.3,
    focus: "Provincial + federal battery incentives; USMCA offtake",
    confidence: "estimated",
    fill: "#38bdf8",
  },
  {
    node: "Texas Gulf / I-35",
    short: "TX",
    country: "US",
    tipUsdBn: 7.1,
    sharePct: 13.7,
    cumulativeSharePct: 54.0,
    focus: "Cell plants + cathode precursor notices",
    confidence: "estimated",
    fill: "#818cf8",
  },
  {
    node: "Quebec / St. Lawrence",
    short: "QC",
    country: "Canada",
    tipUsdBn: 5.4,
    sharePct: 10.4,
    cumulativeSharePct: 64.4,
    focus: "Hydro-linked cell + materials nodes",
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    node: "Nuevo León / Bajío MX",
    short: "NL/MX",
    country: "Mexico",
    tipUsdBn: 4.6,
    sharePct: 8.8,
    cumulativeSharePct: 73.2,
    focus: "Nearshore pack / module + auto OEM co-location",
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    node: "Other US / CA / MX nodes",
    short: "Other",
    country: "NA",
    tipUsdBn: 13.9,
    sharePct: 26.8,
    cumulativeSharePct: 100,
    focus: "GA, TN, KY, SC, BC, and smaller MX states",
    confidence: "estimated",
    fill: "#64748b",
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

/** Korea sensitivity: regional package share before/after mega-plan */
export type SensitivityStep = {
  step: string;
  short: string;
  eastAsiaPct: number;
  northAmericaPct: number;
  europePct: number;
  rowPct: number;
  universeUsdBn: number;
};

export const KOREA_SENSITIVITY: SensitivityStep[] = [
  {
    step: "Core packages (excl. Korea mega)",
    short: "Core",
    eastAsiaPct: 14.7,
    northAmericaPct: 71.4,
    europePct: 13.9,
    rowPct: 0,
    universeUsdBn: 626,
  },
  {
    step: "Alt universe (+$951B Korea mega)",
    short: "Alt",
    eastAsiaPct: 66.1,
    northAmericaPct: 28.3,
    europePct: 5.5,
    rowPct: 0,
    universeUsdBn: 1577,
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
    meter: "Core fiscal packages ($)",
    short: "Packages",
    topRegion: "North America",
    topSharePct: 71.4,
    top3SharePct: 97,
    what: "Where war-chest capacity sits (excl. Korea mega)",
  },
  {
    meter: "Alt packages (+Korea mega)",
    short: "Alt $",
    topRegion: "East Asia",
    topSharePct: 66.1,
    top3SharePct: 100,
    what: "Where capacity sits if $951B headline enters",
  },
  {
    meter: "Ownership / equity stakes",
    short: "Ownership",
    topRegion: "Anhui funds",
    topSharePct: 27.8,
    top3SharePct: 63.3,
    what: "Where Jun–Jul equity LOIs land geographically",
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
    meter: "NA battery nearshore tip",
    short: "Battery",
    topRegion: "Michigan",
    topSharePct: 21.5,
    top3SharePct: 54,
    what: "Where USMCA battery corridor dollars concentrate",
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

export function mismatchBars(useAlt: boolean) {
  return [...REGION_SHARES]
    .map((r) => ({
      ...r,
      activeMismatch: useAlt ? r.altMismatchPp : r.mismatchPp,
      activePackage: useAlt ? r.altPackageSharePct : r.packageSharePct,
    }))
    .sort((a, b) => b.activeMismatch - a.activeMismatch);
}

export function ownershipRegionRollup() {
  const map = new Map<string, number>();
  for (const n of OWNERSHIP_NODES) {
    map.set(n.region, (map.get(n.region) ?? 0) + n.sharePct);
  }
  return [
    { region: "East Asia", short: "E. Asia", sharePct: map.get("East Asia") ?? 0, fill: "#f43f5e" },
    {
      region: "North America",
      short: "N. America",
      sharePct: map.get("North America") ?? 0,
      fill: "#0ea5e9",
    },
    { region: "Europe", short: "Europe", sharePct: map.get("Europe") ?? 0, fill: "#8b5cf6" },
    {
      region: "Rest of world",
      short: "RoW",
      sharePct: map.get("Rest of world") ?? 0,
      fill: "#64748b",
    },
  ];
}
