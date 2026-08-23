/**
 * Construction sand extraction and trade (2026).
 *
 * Core question: Which countries dominate reported sand and gravel
 * extraction, and which city-states are import-dependent for fill?
 *
 * Primary anchors: USGS MCS construction sand & gravel (US disclosed
 * tonnage; world total NA); UNEP sand & sustainability (40–50 Gt/yr
 * aggregates); UEPG Aggregates Europe country sand & gravel tables;
 * MFA literature for China sand use; UN Comtrade / WITS HS 2505.90
 * natural-sand imports (2023).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Extraction and trade figures blend USGS Mineral Commodity Summaries (construction sand & gravel — US disclosed; world total not published), UNEP/GRID sand-and-sustainability estimates (40–50 Gt/yr of sand resources / aggregates), UEPG Aggregates Europe national sand & gravel tables, material-flow analyses for China sand use, and UN Comtrade/WITS HS 2505.90 natural-sand import quantities for 2023. Most countries do not report construction sand & gravel on a USGS-comparable basis; MFA and association totals are therefore labeled estimated/carried. COMTRADE tonnages exclude unreported and illicit flows and can disagree with mirror export statistics. HHI and share maths are analytical (desk). Not a permitting or engineering guide.";

export const SOURCES = [
  {
    label: "USGS MCS 2026 — Sand and Gravel (Construction)",
    url: "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-sand-gravel.pdf",
  },
  {
    label: "UNEP — Sand and Sustainability (40–50 Gt/yr framing)",
    url: "https://unepgrid.ch/en/sand",
  },
  {
    label: "UNEP 2022 — Sand and Sustainability: 10 strategic recommendations",
    url: "https://unepgrid.ch/storage/app/media/Publications/2022sandandsustainabilityreportfinal.pdf",
  },
  {
    label: "Aggregates Europe (UEPG) — national production figures",
    url: "https://www.aggregates-europe.eu/facts-figures/figures/",
  },
  {
    label: "WITS / UN Comtrade — HS 2505.90 natural sand imports 2023",
    url: "https://wits.worldbank.org/trade/comtrade/en/country/All/year/2023/tradeflow/Imports/partner/WLD/product/250590",
  },
] as const;

/** Headline punchline */
export const HEADLINE = {
  unepGlobalGtLow: 40,
  unepGlobalGtHigh: 50,
  unepGlobalGtMid: 45,
  chinaMfaSandMt: 17700,
  chinaShareOfUnepMidPct: 39.3,
  usUsgsMt2025: 870,
  usUsgsMt2024: 880,
  germanySandGravelMt: 211,
  franceSandGravelMt: 97,
  singaporeImportMt2023: 27.4,
  belgiumImportMt2023: 11.6,
  singaporeTop10ImportSharePct: 53.7,
  singaporeVsBeNlUsMt: 16.6,
  singaporeLandGrowthPct: 28,
  singaporeCumImportMt20y: 517,
} as const;

/** Reported / estimated extraction (Mt sand & gravel or sand MFA) */
export type ExtractorId =
  | "china"
  | "india"
  | "us"
  | "germany"
  | "france"
  | "italy"
  | "uk"
  | "poland"
  | "spain"
  | "turkey";

export const EXTRACTORS: {
  id: ExtractorId;
  label: string;
  mt: number;
  metric: "sand_mfa" | "sand_gravel" | "usgs_construction_sg";
  confidence: Confidence;
  note: string;
}[] = [
  {
    id: "china",
    label: "China",
    mt: 17700,
    metric: "sand_mfa",
    confidence: "estimated",
    note: "MFA sand-use literature (~17.7 Gt); not USGS MCS world table",
  },
  {
    id: "india",
    label: "India",
    mt: 2500,
    metric: "sand_mfa",
    confidence: "carried",
    note: "Desk share of Asia aggregates demand; wide uncertainty band",
  },
  {
    id: "us",
    label: "United States",
    mt: 870,
    metric: "usgs_construction_sg",
    confidence: "disclosed",
    note: "USGS MCS 2026e construction sand & gravel sold/used",
  },
  {
    id: "germany",
    label: "Germany",
    mt: 211,
    metric: "sand_gravel",
    confidence: "disclosed",
    note: "UEPG Aggregates Europe sand & gravel (recent table vintage)",
  },
  {
    id: "france",
    label: "France",
    mt: 97,
    metric: "sand_gravel",
    confidence: "disclosed",
    note: "UEPG sand & gravel",
  },
  {
    id: "italy",
    label: "Italy",
    mt: 64,
    metric: "sand_gravel",
    confidence: "disclosed",
    note: "UEPG sand & gravel",
  },
  {
    id: "uk",
    label: "United Kingdom",
    mt: 58,
    metric: "sand_gravel",
    confidence: "estimated",
    note: "UEPG-adjacent desk; marine + land sand & gravel mix",
  },
  {
    id: "poland",
    label: "Poland",
    mt: 55,
    metric: "sand_gravel",
    confidence: "estimated",
    note: "UEPG-region desk carry",
  },
  {
    id: "spain",
    label: "Spain",
    mt: 42,
    metric: "sand_gravel",
    confidence: "estimated",
    note: "UEPG-region desk carry",
  },
  {
    id: "turkey",
    label: "Türkiye",
    mt: 80,
    metric: "sand_gravel",
    confidence: "carried",
    note: "Association/desk; large crushed-rock share outside this column",
  },
];

/** US MCS construction sand & gravel path (Mt) */
export const US_MCS_PATH: { year: number; mt: number; confidence: Confidence }[] = [
  { year: 2021, mt: 939, confidence: "disclosed" },
  { year: 2022, mt: 959, confidence: "disclosed" },
  { year: 2023, mt: 967, confidence: "disclosed" },
  { year: 2024, mt: 880, confidence: "estimated" },
  { year: 2025, mt: 870, confidence: "estimated" },
];

/** US end-use mix MCS 2025e (%) */
export const US_END_USE: { id: string; label: string; sharePct: number }[] = [
  { id: "pcc", label: "Portland cement concrete", sharePct: 42 },
  { id: "road", label: "Road base & coverings", sharePct: 20 },
  { id: "fill", label: "Construction fill", sharePct: 12 },
  { id: "asphalt", label: "Asphaltic / bituminous", sharePct: 9 },
  { id: "other", label: "Other / misc.", sharePct: 17 },
];

/** COMTRADE / WITS HS 2505.90 natural sand imports 2023 */
export type ImporterId =
  | "sg"
  | "be"
  | "nl"
  | "us"
  | "th"
  | "fr"
  | "cn"
  | "ch"
  | "lu"
  | "de"
  | "hk"
  | "mo"
  | "mv"
  | "mt"
  | "bh";

export const IMPORTERS_2023: {
  id: ImporterId;
  label: string;
  mt: number | null;
  valueMusd: number;
  cityState: boolean;
  confidence: Confidence;
}[] = [
  { id: "sg", label: "Singapore", mt: 27.43, valueMusd: 184.1, cityState: true, confidence: "disclosed" },
  { id: "be", label: "Belgium", mt: 11.58, valueMusd: 129.1, cityState: false, confidence: "disclosed" },
  { id: "nl", label: "Netherlands", mt: 2.96, valueMusd: 94.6, cityState: false, confidence: "disclosed" },
  { id: "us", label: "United States", mt: 1.99, valueMusd: 58.1, cityState: false, confidence: "disclosed" },
  { id: "th", label: "Thailand", mt: 1.64, valueMusd: 3.4, cityState: false, confidence: "disclosed" },
  { id: "fr", label: "France", mt: 1.23, valueMusd: 26.0, cityState: false, confidence: "disclosed" },
  { id: "cn", label: "China", mt: 1.2, valueMusd: 23.1, cityState: false, confidence: "disclosed" },
  { id: "ch", label: "Switzerland", mt: 1.11, valueMusd: 27.0, cityState: false, confidence: "disclosed" },
  { id: "lu", label: "Luxembourg", mt: 0.93, valueMusd: 15.8, cityState: true, confidence: "disclosed" },
  { id: "de", label: "Germany", mt: 0.91, valueMusd: 20.2, cityState: false, confidence: "disclosed" },
  { id: "hk", label: "Hong Kong", mt: 0.31, valueMusd: 5.9, cityState: true, confidence: "disclosed" },
  { id: "mo", label: "Macao", mt: 0.31, valueMusd: 5.1, cityState: true, confidence: "disclosed" },
  { id: "mv", label: "Maldives", mt: 0.19, valueMusd: 6.2, cityState: true, confidence: "disclosed" },
  { id: "mt", label: "Malta", mt: 0.002, valueMusd: 0.4, cityState: true, confidence: "disclosed" },
  { id: "bh", label: "Bahrain", mt: null, valueMusd: 5.2, cityState: true, confidence: "carried" },
];

/** City-state / micro-polity fill dependence scorecard */
export const CITY_STATE_DEPENDENCE: {
  id: string;
  label: string;
  importMt2023: number | null;
  landReclaimPressure: "extreme" | "high" | "moderate";
  domesticPitAccess: "none" | "scarce" | "limited";
  dependenceScore: number;
  note: string;
}[] = [
  {
    id: "sg",
    label: "Singapore",
    importMt2023: 27.43,
    landReclaimPressure: "extreme",
    domesticPitAccess: "none",
    dependenceScore: 98,
    note: "~28% land-area growth since independence; 517 Mt cumulative sand imports (20y UNEP-era tally)",
  },
  {
    id: "mo",
    label: "Macao",
    importMt2023: 0.31,
    landReclaimPressure: "high",
    domesticPitAccess: "none",
    dependenceScore: 92,
    note: "Dense peninsula/islands; reclamation fill almost entirely imported",
  },
  {
    id: "hk",
    label: "Hong Kong",
    importMt2023: 0.31,
    landReclaimPressure: "high",
    domesticPitAccess: "scarce",
    dependenceScore: 88,
    note: "Historic marine fill + cross-border aggregate logistics",
  },
  {
    id: "mv",
    label: "Maldives",
    importMt2023: 0.19,
    landReclaimPressure: "extreme",
    domesticPitAccess: "scarce",
    dependenceScore: 90,
    note: "Atoll geology; imported fill for islands and coastal protection",
  },
  {
    id: "bh",
    label: "Bahrain",
    importMt2023: null,
    landReclaimPressure: "high",
    domesticPitAccess: "scarce",
    dependenceScore: 85,
    note: "Gulf reclamation city-state; COMTRADE qty often incomplete",
  },
  {
    id: "lu",
    label: "Luxembourg",
    importMt2023: 0.93,
    landReclaimPressure: "moderate",
    domesticPitAccess: "limited",
    dependenceScore: 70,
    note: "Small landlocked market; high per-area import intensity vs neighbors",
  },
  {
    id: "mt",
    label: "Malta",
    importMt2023: 0.002,
    landReclaimPressure: "moderate",
    domesticPitAccess: "scarce",
    dependenceScore: 78,
    note: "Island limestone geology; limited natural sand pits",
  },
];

/** Singapore partner mix 2023 (HS 2505.90) */
export const SINGAPORE_PARTNERS: {
  id: string;
  label: string;
  mt: number;
  sharePct: number;
}[] = [
  { id: "my", label: "Malaysia", mt: 27.43, sharePct: 99.98 },
  { id: "ph", label: "Philippines", mt: 0.00045, sharePct: 0.002 },
  { id: "other", label: "Other", mt: 0.00001, sharePct: 0.018 },
];

/** Regional UNEP-style demand buckets (Gt, desk shares of mid 45 Gt) */
export const REGION_DEMAND: {
  id: string;
  label: string;
  gt: number;
  sharePct: number;
  confidence: Confidence;
}[] = [
  { id: "china", label: "China", gt: 17.7, sharePct: 39.3, confidence: "estimated" },
  { id: "india", label: "India", gt: 4.5, sharePct: 10.0, confidence: "carried" },
  { id: "rest_asia", label: "Rest of Asia-Pacific", gt: 8.0, sharePct: 17.8, confidence: "carried" },
  { id: "europe", label: "Europe (UEPG sphere)", gt: 3.0, sharePct: 6.7, confidence: "estimated" },
  { id: "namerica", label: "North America", gt: 2.5, sharePct: 5.6, confidence: "estimated" },
  { id: "row", label: "Rest of world", gt: 9.3, sharePct: 20.6, confidence: "carried" },
];

/** Trade corridor intensity (analytical) */
export const CORRIDORS: {
  id: string;
  from: string;
  to: string;
  intensity: number;
  kind: "fill" | "industrial" | "cross_border";
}[] = [
  { id: "my-sg", from: "Malaysia", to: "Singapore", intensity: 98, kind: "fill" },
  { id: "nl-be", from: "Netherlands", to: "Belgium", intensity: 72, kind: "cross_border" },
  { id: "ca-us", from: "Canada", to: "United States", intensity: 55, kind: "cross_border" },
  { id: "sea-hk", from: "SE Asia", to: "Hong Kong / Macao", intensity: 48, kind: "fill" },
  { id: "gulf", from: "Regional quarries", to: "Bahrain / Gulf islets", intensity: 40, kind: "fill" },
  { id: "eu-marine", from: "North Sea dredging", to: "NL / BE / UK", intensity: 35, kind: "industrial" },
];

export function fmtMt(n: number, digits = 1): string {
  if (n >= 1000) return `${(n / 1000).toFixed(digits)} Gt`;
  return `${n.toFixed(digits)} Mt`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function topDisclosedExtractors(limit = 8) {
  return EXTRACTORS.filter((e) => e.confidence === "disclosed" || e.metric === "usgs_construction_sg")
    .slice()
    .sort((a, b) => b.mt - a.mt)
    .slice(0, limit);
}

export function importerBars(mode: "all" | "city" | "tonnage") {
  let rows = IMPORTERS_2023.filter((r) => r.mt != null) as Array<
    (typeof IMPORTERS_2023)[number] & { mt: number }
  >;
  if (mode === "city") rows = rows.filter((r) => r.cityState);
  rows = rows.slice().sort((a, b) => b.mt - a.mt);
  if (mode === "tonnage") rows = rows.slice(0, 10);
  return rows;
}

export function extractorBars(lens: "all" | "disclosed" | "mfa") {
  let rows = EXTRACTORS.slice();
  if (lens === "disclosed") {
    rows = rows.filter(
      (e) => e.confidence === "disclosed" || e.metric === "usgs_construction_sg",
    );
  } else if (lens === "mfa") {
    rows = rows.filter((e) => e.metric === "sand_mfa" || e.mt >= 800);
  }
  return rows.sort((a, b) => b.mt - a.mt);
}

export function regionHhi(): number {
  const shares = REGION_DEMAND.map((r) => r.sharePct);
  return Math.round(shares.reduce((s, p) => s + p * p, 0));
}

export function singaporeShareOfTop10(): number {
  const top = importerBars("tonnage").slice(0, 10);
  const sum = top.reduce((s, r) => s + r.mt, 0);
  const sg = top.find((r) => r.id === "sg")?.mt ?? 0;
  return sum > 0 ? (sg / sum) * 100 : 0;
}

export function dependenceScatter() {
  return CITY_STATE_DEPENDENCE.map((c) => ({
    id: c.id,
    label: c.label,
    x: c.importMt2023 ?? 0.05,
    y: c.dependenceScore,
    z: c.landReclaimPressure === "extreme" ? 120 : c.landReclaimPressure === "high" ? 80 : 50,
  }));
}

export function usPathComposed() {
  return US_MCS_PATH.map((r) => ({
    year: String(r.year),
    mt: r.mt,
    priceProxy: r.year === 2021 ? 10.52 : r.year === 2022 ? 11.35 : r.year === 2023 ? 12.54 : r.year === 2024 ? 13.9 : 14.5,
  }));
}

export function corridorRadar() {
  return CORRIDORS.map((c) => ({
    corridor: `${c.from.split(" ")[0]}→${c.to.split(" ")[0]}`,
    intensity: c.intensity,
    kind: c.kind,
  }));
}
