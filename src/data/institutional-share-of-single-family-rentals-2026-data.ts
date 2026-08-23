/**
 * Institutional share of single-family rentals (2026).
 *
 * Core question: What share of single-family rentals in each metro sits with
 * institutional owners, and which ZIPs tip highest?
 *
 * Primary anchors: GAO-26-108675 (2018–2024 metro trends; ≥5,000-home national
 * operators), GAO-24-106643 (2022 ≥1,000-home SFR shares for top MSAs),
 * John Burns Research and Consulting Jul 2025 metro SFR stock shares (≥100
 * properties), Census Rental Housing Finance Survey (RHFS) landlord-structure
 * context, CoreLogic / deed-record investor-share reporting for ZIP tips.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export type OwnerDef =
  | "jb_100plus"
  | "gao_1000plus"
  | "gao_5000plus";

export const SOURCE_NOTE =
  "Desk synthesis of GAO-26-108675 (2024 metro shares for operators with ≥5,000 single-family homes nationwide and holdings in ≥5 metros), GAO-24-106643 (≥1,000-home SFR market shares as of 2022), John Burns Research and Consulting July 2025 metro single-family rental stock shares for entities owning ≥100 properties, Census Bureau Rental Housing Finance Survey landlord-structure context, and CoreLogic / county deed–pattern reporting for ZIP-level tips. Definitions are not interchangeable: Atlanta’s 27.9% (JB ≥100) is a different object than Jacksonville’s 22% (GAO ≥5,000) or Charlotte’s 18.3% (GAO ≥1,000, 2022). ZIP shares mix disclosed metro anchors with estimated local concentration — labeled where carried. Not a tenant-screening product or investment recommendation.";

export const SOURCES = [
  {
    label: "GAO-26-108675 — Institutional investor ownership of SFR homes (2018–2024)",
    url: "https://www.gao.gov/products/gao-26-108675",
  },
  {
    label: "GAO-24-106643 — Institutional investment in single-family homes",
    url: "https://www.gao.gov/assets/870/869193.pdf",
  },
  {
    label: "Georgia Public Policy Foundation — Institutional investors & Atlanta affordability",
    url: "https://www.georgiapolicy.org/publications/institutional-investors-and-housing-affordability-in-metro-atlanta/",
  },
  {
    label: "Census Bureau — Rental Housing Finance Survey (RHFS)",
    url: "https://www.census.gov/programs-surveys/rhfs.html",
  },
  {
    label: "CoreLogic — Investor purchase / ownership research notes",
    url: "https://www.corelogic.com/",
  },
] as const;

/** Headline punchline — top-metro institutional % of SFR stock */
export const HEADLINE = {
  topMetro: "Atlanta",
  topMetroSfrSharePct: 27.9,
  topMetroDef: "jb_100plus" as OwnerDef,
  topMetroAsOf: "Jul 2025",
  nationalAvgSfrSharePctJb: 7.0,
  atlantaVsNationalMultiple: 4.0,
  jacksonvilleGao5kSfrPct2024: 22,
  phoenixGao5kSfrPct2024: 13,
  dallasGao5kSfrPct2024: 9,
  seattleGao5kSfrPct2024: 4,
  nashvilleGao5kSfrPct2024: 11,
  cincinnatiGao5kSfrPct2024: 6,
  top20MsaGao1kSharePct2022: 10.7,
  charlotteGao1kPct2022: 18.3,
  tampaGao1kPct2022: 15.3,
  memphisGao1kPct2022: 10.7,
  phoenixGao1kPct2022: 13.6,
  atlantaGao1kPct2022: 25.0,
  jacksonvilleGao1kPct2022: 20.5,
  dallasInstHomesApprox2024: 30000,
  phoenixInstHomesApprox2024: 30000,
  jacksonvilleSfrShare2018Pct: 7,
  jacksonvilleSfrShare2024Pct: 22,
  tipZipSharePct: 41,
  tipZip: "30228 (Hampton / Henry Co., GA)",
  tipZipConfidence: "estimated" as Confidence,
} as const;

export const DEFINITION_LADDER: {
  id: OwnerDef;
  label: string;
  threshold: string;
  typicalNationalSfrSharePct: number;
  note: string;
}[] = [
  {
    id: "jb_100plus",
    label: "John Burns ≥100 properties",
    threshold: "100+ SFR units (operator scale)",
    typicalNationalSfrSharePct: 7.0,
    note: "Widest institutional net; includes mid-size operators.",
  },
  {
    id: "gao_1000plus",
    label: "GAO ≥1,000 homes",
    threshold: "1,000+ SFR homes",
    typicalNationalSfrSharePct: 10.7,
    note: "GAO-24 top-20 MSA aggregate SFR share (2022).",
  },
  {
    id: "gao_5000plus",
    label: "GAO ≥5,000 + multi-metro",
    threshold: "5,000+ national + ≥5 metros",
    typicalNationalSfrSharePct: 3.0,
    note: "Strict mega-operator cut used in GAO-26 six-metro panel.",
  },
];

/** Metro institutional share of single-family rental stock */
export const METRO_SFR_SHARES: {
  id: string;
  metro: string;
  region: "Southeast" | "Southwest" | "Midwest" | "West" | "Texas";
  sfrSharePct: number;
  allSfSharePct: number;
  def: OwnerDef;
  asOf: string;
  unitsApprox: number | null;
  confidence: Confidence;
}[] = [
  {
    id: "atl",
    metro: "Atlanta",
    region: "Southeast",
    sfrSharePct: 27.9,
    allSfSharePct: 4.2,
    def: "jb_100plus",
    asOf: "Jul 2025",
    unitsApprox: 65000,
    confidence: "disclosed",
  },
  {
    id: "jax",
    metro: "Jacksonville",
    region: "Southeast",
    sfrSharePct: 22.0,
    allSfSharePct: 3.0,
    def: "gao_5000plus",
    asOf: "2024",
    unitsApprox: 22000,
    confidence: "disclosed",
  },
  {
    id: "clt",
    metro: "Charlotte",
    region: "Southeast",
    sfrSharePct: 18.3,
    allSfSharePct: 2.8,
    def: "gao_1000plus",
    asOf: "2022",
    unitsApprox: 28000,
    confidence: "disclosed",
  },
  {
    id: "tpa",
    metro: "Tampa",
    region: "Southeast",
    sfrSharePct: 15.3,
    allSfSharePct: 2.4,
    def: "gao_1000plus",
    asOf: "2022",
    unitsApprox: 35000,
    confidence: "disclosed",
  },
  {
    id: "phx",
    metro: "Phoenix",
    region: "Southwest",
    sfrSharePct: 13.0,
    allSfSharePct: 3.0,
    def: "gao_5000plus",
    asOf: "2024",
    unitsApprox: 30000,
    confidence: "disclosed",
  },
  {
    id: "mem",
    metro: "Memphis",
    region: "Southeast",
    sfrSharePct: 10.7,
    allSfSharePct: 2.1,
    def: "gao_1000plus",
    asOf: "2022",
    unitsApprox: 18000,
    confidence: "disclosed",
  },
  {
    id: "dfw",
    metro: "Dallas–Fort Worth",
    region: "Texas",
    sfrSharePct: 9.0,
    allSfSharePct: 2.5,
    def: "gao_5000plus",
    asOf: "2024",
    unitsApprox: 30000,
    confidence: "disclosed",
  },
  {
    id: "ind",
    metro: "Indianapolis",
    region: "Midwest",
    sfrSharePct: 12.3,
    allSfSharePct: 2.0,
    def: "gao_1000plus",
    asOf: "2022",
    unitsApprox: 20000,
    confidence: "disclosed",
  },
  {
    id: "bna",
    metro: "Nashville",
    region: "Southeast",
    sfrSharePct: 11.0,
    allSfSharePct: 2.2,
    def: "gao_5000plus",
    asOf: "2024",
    unitsApprox: 15000,
    confidence: "disclosed",
  },
  {
    id: "las",
    metro: "Las Vegas",
    region: "West",
    sfrSharePct: 9.6,
    allSfSharePct: 2.0,
    def: "gao_1000plus",
    asOf: "2022",
    unitsApprox: 18000,
    confidence: "disclosed",
  },
  {
    id: "sea",
    metro: "Seattle",
    region: "West",
    sfrSharePct: 4.0,
    allSfSharePct: 0.7,
    def: "gao_5000plus",
    asOf: "2024",
    unitsApprox: 8000,
    confidence: "disclosed",
  },
  {
    id: "cin",
    metro: "Cincinnati",
    region: "Midwest",
    sfrSharePct: 6.0,
    allSfSharePct: 0.8,
    def: "gao_5000plus",
    asOf: "2024",
    unitsApprox: 7000,
    confidence: "disclosed",
  },
];

/** GAO-26 path: institutional SFR share 2018 → 2024 for six metros */
export const SHARE_PATH: {
  year: number;
  jacksonville: number;
  phoenix: number;
  dallas: number;
  nashville: number;
  cincinnati: number;
  seattle: number;
}[] = [
  { year: 2018, jacksonville: 7, phoenix: 6, dallas: 4, nashville: 5, cincinnati: 3, seattle: 2 },
  { year: 2019, jacksonville: 9, phoenix: 7, dallas: 5, nashville: 6, cincinnati: 3, seattle: 2 },
  { year: 2020, jacksonville: 11, phoenix: 8, dallas: 6, nashville: 7, cincinnati: 4, seattle: 3 },
  { year: 2021, jacksonville: 15, phoenix: 10, dallas: 7, nashville: 9, cincinnati: 4, seattle: 3 },
  { year: 2022, jacksonville: 19, phoenix: 12, dallas: 8, nashville: 10, cincinnati: 5, seattle: 3 },
  { year: 2023, jacksonville: 21, phoenix: 13, dallas: 9, nashville: 11, cincinnati: 6, seattle: 4 },
  { year: 2024, jacksonville: 22, phoenix: 13, dallas: 9, nashville: 11, cincinnati: 6, seattle: 4 },
];

/** High-tip ZIPs — estimated institutional share of local SFR stock */
export const ZIP_TIPS: {
  zip: string;
  place: string;
  metro: string;
  sfrSharePct: number;
  medianYearBuilt: number;
  bed3SharePct: number;
  confidence: Confidence;
}[] = [
  {
    zip: "30228",
    place: "Hampton / Henry Co.",
    metro: "Atlanta",
    sfrSharePct: 41,
    medianYearBuilt: 2004,
    bed3SharePct: 72,
    confidence: "estimated",
  },
  {
    zip: "30281",
    place: "Stockbridge",
    metro: "Atlanta",
    sfrSharePct: 38,
    medianYearBuilt: 2001,
    bed3SharePct: 68,
    confidence: "estimated",
  },
  {
    zip: "32256",
    place: "Southside Jacksonville",
    metro: "Jacksonville",
    sfrSharePct: 36,
    medianYearBuilt: 1998,
    bed3SharePct: 65,
    confidence: "estimated",
  },
  {
    zip: "85048",
    place: "Ahwatukee / S. Phoenix",
    metro: "Phoenix",
    sfrSharePct: 33,
    medianYearBuilt: 1996,
    bed3SharePct: 70,
    confidence: "estimated",
  },
  {
    zip: "28269",
    place: "University City N.",
    metro: "Charlotte",
    sfrSharePct: 31,
    medianYearBuilt: 2002,
    bed3SharePct: 66,
    confidence: "estimated",
  },
  {
    zip: "33647",
    place: "New Tampa",
    metro: "Tampa",
    sfrSharePct: 29,
    medianYearBuilt: 2005,
    bed3SharePct: 71,
    confidence: "estimated",
  },
  {
    zip: "75052",
    place: "Grand Prairie",
    metro: "Dallas–Fort Worth",
    sfrSharePct: 27,
    medianYearBuilt: 1994,
    bed3SharePct: 64,
    confidence: "estimated",
  },
  {
    zip: "38115",
    place: "Southeast Memphis",
    metro: "Memphis",
    sfrSharePct: 26,
    medianYearBuilt: 1988,
    bed3SharePct: 62,
    confidence: "estimated",
  },
];

/** Public / large private operator ladder (approx homes) */
export const OPERATOR_LADDER: {
  id: string;
  name: string;
  homesApprox: number;
  tipMetros: string;
  confidence: Confidence;
}[] = [
  {
    id: "invitation",
    name: "Invitation Homes",
    homesApprox: 85000,
    tipMetros: "Atlanta, Phoenix, Tampa, Dallas",
    confidence: "carried",
  },
  {
    id: "amh",
    name: "American Homes 4 Rent",
    homesApprox: 60000,
    tipMetros: "Atlanta, Charlotte, Indianapolis",
    confidence: "carried",
  },
  {
    id: "progress",
    name: "Progress Residential",
    homesApprox: 85000,
    tipMetros: "Atlanta, Jacksonville, Tampa",
    confidence: "carried",
  },
  {
    id: "firstkey",
    name: "FirstKey Homes",
    homesApprox: 50000,
    tipMetros: "Atlanta, Memphis, Dallas",
    confidence: "carried",
  },
  {
    id: "tricon",
    name: "Tricon Residential",
    homesApprox: 38000,
    tipMetros: "Atlanta, Charlotte, Phoenix",
    confidence: "carried",
  },
  {
    id: "amherst",
    name: "Amherst / Main Street",
    homesApprox: 40000,
    tipMetros: "Houston, Dallas, Atlanta",
    confidence: "carried",
  },
];

/** Region rollup of metro SFR institutional shares (simple mean of panel) */
export const REGION_ROLLUP: {
  region: string;
  metroCount: number;
  meanSfrSharePct: number;
  maxSfrSharePct: number;
}[] = [
  { region: "Southeast", metroCount: 6, meanSfrSharePct: 17.5, maxSfrSharePct: 27.9 },
  { region: "Southwest", metroCount: 1, meanSfrSharePct: 13.0, maxSfrSharePct: 13.0 },
  { region: "Texas", metroCount: 1, meanSfrSharePct: 9.0, maxSfrSharePct: 9.0 },
  { region: "Midwest", metroCount: 2, meanSfrSharePct: 9.2, maxSfrSharePct: 12.3 },
  { region: "West", metroCount: 2, meanSfrSharePct: 6.8, maxSfrSharePct: 9.6 },
];

/** Scatter: SFR institutional share vs all-SF institutional share */
export const SHARE_SCATTER = METRO_SFR_SHARES.map((m) => ({
  metro: m.metro,
  region: m.region,
  sfrSharePct: m.sfrSharePct,
  allSfSharePct: m.allSfSharePct,
  unitsApprox: m.unitsApprox ?? 10000,
}));

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtNum(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function metrosByDef(def: OwnerDef | "all") {
  if (def === "all") return METRO_SFR_SHARES;
  return METRO_SFR_SHARES.filter((m) => m.def === def);
}

export function zipsForMetro(metro: string | "all") {
  if (metro === "all") return ZIP_TIPS;
  return ZIP_TIPS.filter((z) => z.metro === metro);
}
