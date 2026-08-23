/**
 * US share of global source plasma for fractionation (2026).
 *
 * Core question: What share of source plasma for fractionation is collected
 * in the US, and how dependent are EU patients on those liters?
 *
 * Primary anchors: PPTA (US ~70% of plasma for therapies; EU PDMP feedstock
 * ~38% US-origin); Marketing Research Bureau / Hotchko IPFA 2022 (2019 world
 * ~69M L, US-dominant; 2020 dip to ~59M L); Jaworski 2025 center/liter roll-up
 * (1,247 US centers; 62.5M L US collections ≈68% of global); EU Commission /
 * EDQM / Vox Sanguinis self-sufficiency framing (~3.8–5M L EU deficit; 4–5M L
 * US plasma into EU therapies); FDA-licensed center growth post-2020.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "US collection share of plasma for fractionation is a desk synthesis of PPTA, Marketing Research Bureau (IPFA/EBA 2022), EU Commission/EDQM self-sufficiency reporting, and independent center/liter tallies through 2025. Headline US share ≈68–72% of global source plasma used for plasma-derived medicinal products (PDMPs). EU PDMP manufacturing feedstock is ~38% US-origin plasma (PPTA). Absolute liters (US 62.5M in 2025; world ~92M desk total) and per-capita rates blend disclosed national figures with carried shares where agencies publish percentages without full liter tables. HHI on regional buckets is analytical (0–10,000). Not a clinical dosing guide.";

export const SOURCES = [
  {
    label: "PPTA — EU dependence on US plasma for PDMP manufacturing (~38%)",
    url: "https://www.pptaglobal.org/material/perverse-consequences-of-systemic-stockpiling-of-plasma-derived-medicinal-products-in-europe",
  },
  {
    label: "PPTA — about the industry (1,100+ centers; EU commercial collectors)",
    url: "https://www.pptaglobal.org/about-ppta",
  },
  {
    label: "Hotchko / Marketing Research Bureau — IPFA/EBA plasma flows (Mar 2022)",
    url: "https://ipfa.nl/wp-content/uploads/2021/11/Hotchko-MRB-IPFA-EBA-Mar-2022-Redacted.pdf",
  },
  {
    label: "Vox Sanguinis — Europe needs ~2M extra donors; ~40% US dependence",
    url: "https://doi.org/10.1111/vox.13540",
  },
  {
    label: "FDA — blood & plasma establishment guidance / licensed centers",
    url: "https://www.fda.gov/vaccines-blood-biologics/blood-blood-products",
  },
] as const;

/** Headline punchline */
export const HEADLINE = {
  usGlobalSharePct: 68,
  usGlobalShareRangeHighPct: 72,
  usLiters2025M: 62.5,
  worldLiters2025M: 92,
  usCenters2025: 1247,
  euUsImportSharePct: 38,
  euDomesticFourPct: 38,
  euOtherDomesticPct: 24,
  euDeficitML: 4.2,
  euPatientsPdmpK: 300,
  usLitersPer1k2019: 163,
  compensatingFiveSharePct: 90,
  usExportShareOfUsLitersPct: 48,
  pandemicDipPct: 14.5,
} as const;

/** Regional share of global source plasma (desk buckets, 2025) */
export type RegionId = "us" | "eu4" | "eu_other" | "china" | "canzuk" | "row";

export const REGION_SHARES: {
  id: RegionId;
  label: string;
  sharePct: number;
  litersM: number;
  confidence: Confidence;
  compensated: boolean;
}[] = [
  {
    id: "us",
    label: "United States",
    sharePct: 68,
    litersM: 62.5,
    confidence: "estimated",
    compensated: true,
  },
  {
    id: "eu4",
    label: "EU-4 commercial (DE/AT/CZ/HU)",
    sharePct: 9,
    litersM: 8.3,
    confidence: "estimated",
    compensated: true,
  },
  {
    id: "eu_other",
    label: "Other EU / EEA VNRD",
    sharePct: 5,
    litersM: 4.6,
    confidence: "carried",
    compensated: false,
  },
  {
    id: "china",
    label: "China",
    sharePct: 8,
    litersM: 7.4,
    confidence: "carried",
    compensated: false,
  },
  {
    id: "canzuk",
    label: "CANZUK (mostly deficit)",
    sharePct: 3,
    litersM: 2.8,
    confidence: "carried",
    compensated: false,
  },
  {
    id: "row",
    label: "Rest of world",
    sharePct: 7,
    litersM: 6.4,
    confidence: "carried",
    compensated: false,
  },
];

/** Time series: US liters + estimated global share */
export const COLLECTION_PATH: {
  year: number;
  usLitersM: number;
  worldLitersM: number;
  usSharePct: number;
  usCenters: number;
  confidence: Confidence;
}[] = [
  { year: 2017, usLitersM: 42, worldLitersM: 62, usSharePct: 68, usCenters: 680, confidence: "carried" },
  { year: 2018, usLitersM: 48, worldLitersM: 68, usSharePct: 71, usCenters: 750, confidence: "carried" },
  { year: 2019, usLitersM: 53, worldLitersM: 69, usSharePct: 77, usCenters: 850, confidence: "estimated" },
  { year: 2020, usLitersM: 45, worldLitersM: 59, usSharePct: 76, usCenters: 950, confidence: "estimated" },
  { year: 2021, usLitersM: 49, worldLitersM: 68, usSharePct: 72, usCenters: 1050, confidence: "estimated" },
  { year: 2022, usLitersM: 53, worldLitersM: 76, usSharePct: 70, usCenters: 1120, confidence: "estimated" },
  { year: 2023, usLitersM: 56, worldLitersM: 82, usSharePct: 68, usCenters: 1180, confidence: "estimated" },
  { year: 2024, usLitersM: 57.6, worldLitersM: 86, usSharePct: 67, usCenters: 1210, confidence: "estimated" },
  { year: 2025, usLitersM: 62.5, worldLitersM: 92, usSharePct: 68, usCenters: 1247, confidence: "estimated" },
];

/** EU plasma for PDMP manufacturing — origin mix */
export const EU_ORIGIN_MIX: {
  id: string;
  label: string;
  sharePct: number;
  note: string;
}[] = [
  {
    id: "eu4",
    label: "EU-4 compensated collectors",
    sharePct: 38,
    note: "Germany, Austria, Czechia, Hungary — commercial plasmapheresis",
  },
  {
    id: "us",
    label: "United States imports",
    sharePct: 38,
    note: "Source plasma / intermediates entering EU fractionation or finished PDMP",
  },
  {
    id: "eu_other",
    label: "Other EU domestic (mostly VNRD)",
    sharePct: 24,
    note: "23 Member States without commercial compensated collections",
  },
];

/** Collection intensity — liters per 1,000 residents (anchor years ~2017–2019, carried) */
export const INTENSITY_ROWS: {
  id: string;
  label: string;
  litersPer1k: number;
  compensated: boolean;
  region: "US" | "EU" | "Other";
  confidence: Confidence;
}[] = [
  { id: "us", label: "United States", litersPer1k: 163, compensated: true, region: "US", confidence: "disclosed" },
  { id: "cz", label: "Czechia", litersPer1k: 65, compensated: true, region: "EU", confidence: "disclosed" },
  { id: "de", label: "Germany", litersPer1k: 40, compensated: true, region: "EU", confidence: "disclosed" },
  { id: "at", label: "Austria", litersPer1k: 38, compensated: true, region: "EU", confidence: "estimated" },
  { id: "hu", label: "Hungary", litersPer1k: 35, compensated: true, region: "EU", confidence: "estimated" },
  { id: "au", label: "Australia", litersPer1k: 29, compensated: false, region: "Other", confidence: "disclosed" },
  { id: "nl", label: "Netherlands", litersPer1k: 18, compensated: false, region: "EU", confidence: "disclosed" },
  { id: "nz", label: "New Zealand", litersPer1k: 14, compensated: false, region: "Other", confidence: "disclosed" },
  { id: "ca", label: "Canada", litersPer1k: 10.3, compensated: false, region: "Other", confidence: "estimated" },
  { id: "uk", label: "United Kingdom", litersPer1k: 2, compensated: false, region: "Other", confidence: "carried" },
];

/** Self-reliance vs import dependence (immunoglobulin / PDMP feedstock framing) */
export const DEPENDENCY_ROWS: {
  id: string;
  label: string;
  selfReliancePct: number;
  usImportPct: number;
  patientsNote: string;
}[] = [
  { id: "us", label: "United States", selfReliancePct: 100, usImportPct: 0, patientsNote: "Net exporter of plasma for fractionation" },
  { id: "de", label: "Germany", selfReliancePct: 85, usImportPct: 8, patientsNote: "EU-4 surplus contributor" },
  { id: "au", label: "Australia", selfReliancePct: 55, usImportPct: 40, patientsNote: "Strong VNRD; still imports" },
  { id: "fr", label: "France", selfReliancePct: 50, usImportPct: 35, patientsNote: "Public model; structural gap" },
  { id: "it", label: "Italy", selfReliancePct: 45, usImportPct: 40, patientsNote: "Recovered + source mix" },
  { id: "es", label: "Spain", selfReliancePct: 40, usImportPct: 45, patientsNote: "Rising Ig demand" },
  { id: "ca", label: "Canada", selfReliancePct: 20, usImportPct: 80, patientsNote: "CBS target ~30% Ig sufficiency" },
  { id: "uk", label: "United Kingdom", selfReliancePct: 5, usImportPct: 90, patientsNote: "Post-vCJD fractionation restart limited" },
];

/** Scatter: centers (proxy capacity) vs collection intensity */
export const CAPACITY_SCATTER: {
  id: string;
  label: string;
  centers: number;
  litersPer1k: number;
  shareOfGlobalPct: number;
  compensated: boolean;
}[] = [
  { id: "us", label: "United States", centers: 1247, litersPer1k: 163, shareOfGlobalPct: 68, compensated: true },
  { id: "eu4", label: "EU-4 commercial", centers: 190, litersPer1k: 45, shareOfGlobalPct: 9, compensated: true },
  { id: "cn", label: "China", centers: 120, litersPer1k: 5, shareOfGlobalPct: 8, compensated: false },
  { id: "au", label: "Australia", centers: 45, litersPer1k: 29, shareOfGlobalPct: 1.2, compensated: false },
  { id: "ca", label: "Canada", centers: 25, litersPer1k: 10, shareOfGlobalPct: 0.8, compensated: false },
  { id: "uk", label: "United Kingdom", centers: 8, litersPer1k: 2, shareOfGlobalPct: 0.2, compensated: false },
];

/** EU deficit path — liters short of Ig self-sufficiency framing */
export const EU_DEFICIT_PATH: {
  year: number;
  deficitML: number;
  usCoverSharePct: number;
}[] = [
  { year: 2011, deficitML: -0.5, usCoverSharePct: 5 },
  { year: 2014, deficitML: 1.2, usCoverSharePct: 16 },
  { year: 2017, deficitML: 2.4, usCoverSharePct: 24 },
  { year: 2019, deficitML: 3.5, usCoverSharePct: 35 },
  { year: 2021, deficitML: 3.8, usCoverSharePct: 38 },
  { year: 2023, deficitML: 4.0, usCoverSharePct: 38 },
  { year: 2025, deficitML: 4.2, usCoverSharePct: 38 },
];

/** Reference table for prose */
export const REFERENCE_TABLE: {
  metric: string;
  value: string;
  source: string;
}[] = [
  { metric: "US share of global source plasma (2025 desk)", value: "~68%", source: "Jaworski / MRB synthesis" },
  { metric: "US source plasma collected (2025)", value: "62.5 million L", source: "Industry center/liter tally" },
  { metric: "FDA-licensed US plasma centers (end-2025)", value: "1,247", source: "Center registry roll-up" },
  { metric: "EU PDMP feedstock from US plasma", value: "~38%", source: "PPTA" },
  { metric: "EU-4 commercial share of EU PDMP plasma", value: "~38%", source: "Niskanen / PPTA framing" },
  { metric: "Other EU domestic share of EU PDMP plasma", value: "~24%", source: "Niskanen / PPTA framing" },
  { metric: "EU structural deficit (approx.)", value: "3.8–5 million L", source: "Vox Sanguinis / EDQM" },
  { metric: "US collection rate (2019)", value: "163 L / 1,000 residents", source: "EDQM / Jaworski" },
  { metric: "Compensating five countries' global therapy plasma", value: "~90%", source: "Niskanen Center" },
  { metric: "2020 world collection dip vs 2019", value: "−14.5%", source: "MRB / Hotchko IPFA" },
];

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtLitersM(n: number, digits = 1): string {
  return `${n.toFixed(digits)}M L`;
}

export function regionPie() {
  return REGION_SHARES.map((r) => ({
    name: r.label,
    value: r.sharePct,
    litersM: r.litersM,
    compensated: r.compensated,
  }));
}

export function euOriginPie() {
  return EU_ORIGIN_MIX.map((r) => ({
    name: r.label,
    value: r.sharePct,
  }));
}

export function intensityBars(filter: "all" | "EU" | "compensated" | "vnr") {
  return INTENSITY_ROWS.filter((r) => {
    if (filter === "all") return true;
    if (filter === "EU") return r.region === "EU" || r.id === "us";
    if (filter === "compensated") return r.compensated;
    return !r.compensated;
  }).map((r) => ({
    name: r.label,
    litersPer1k: r.litersPer1k,
    compensated: r.compensated,
    fill: r.compensated ? "#0f766e" : "#64748b",
  }));
}

export function dependencyScatter() {
  return DEPENDENCY_ROWS.map((r) => ({
    name: r.label,
    x: r.selfReliancePct,
    y: r.usImportPct,
    z: Math.max(8, 100 - r.selfReliancePct),
  }));
}

export function collectionComposed() {
  return COLLECTION_PATH.map((r) => ({
    year: String(r.year),
    usLitersM: r.usLitersM,
    worldLitersM: r.worldLitersM,
    usSharePct: r.usSharePct,
    usCenters: r.usCenters,
  }));
}

export function euDeficitSeries() {
  return EU_DEFICIT_PATH.map((r) => ({
    year: String(r.year),
    deficitML: r.deficitML,
    usCoverSharePct: r.usCoverSharePct,
  }));
}

/** Analytical HHI on regional share buckets */
export function regionHhi(): number {
  return Math.round(
    REGION_SHARES.reduce((s, r) => s + r.sharePct * r.sharePct, 0),
  );
}
