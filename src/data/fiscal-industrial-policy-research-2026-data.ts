/**
 * Global fiscal & industrial policy — NIPO / IMF / Global Trade Alert.
 * Core question: How do subsidies, tariffs, and industrial policy reshape economies?
 *
 * Primary sources:
 * - IMF WP/24/1 "The Return of Industrial Policy in Data" (Evenett et al., 2024) — 2023 NIPO snapshot
 * - IMF WP/25/222 "Industrial Policy Since the Great Financial Crisis" (Oct 2025) — H-NIPO 2009–2023
 * - Global Trade Alert ZG #79 "Security First: How Industrial Policy Changed in 2025" (Dec 2025)
 * - Statutory package sizes: US CHIPS Act (P.L. 117-167), EU Chips Act / IPCEI announcements
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Intervention counts and instrument shares from IMF–Global Trade Alert New Industrial Policy Observatory (NIPO) and Historical NIPO (H-NIPO). Package dollar figures are statutory appropriations or official mobilisation targets — not outlays-to-date. Intermediate years on the jurisdiction coverage series are linearly interpolated between disclosed endpoints and peak years; see confidence flags.";

export const IMF_WP24_URL =
  "https://www.imf.org/en/publications/wp/issues/2023/12/23/the-return-of-industrial-policy-in-data-542828";
export const IMF_WP25_URL =
  "https://www.imf.org/en/Publications/WP/Issues/2025/10/17/Industrial-Policy-Since-the-Great-Financial-Crisis-571122";
export const GTA_NIPO_URL =
  "https://globaltradealert.org/reports/new-industrial-policy-observatory-nipo";
export const GTA_2025_URL =
  "https://globaltradealert.org/reports/how-industrial-policy-changed-in-2025";

export const HEADLINE = {
  hNipoInterventions: 34248,
  tradeDistortiveSharePct: 85,
  chinaEuUsSharePct: 53,
  nipo2023Total: 2580,
  nipo2023DistortivePct: 71,
  chinaEuUsShare2023Pct: 48,
  importCoveragePct: 22,
  importMeasuresWithCoverage: 882,
  subsidyJurisdictions2009Pct: 36,
  subsidyJurisdictions2023Pct: 59,
  distortingJurisdictions2009Pct: 56,
  distortingJurisdictions2023Pct: 63,
  distortingPeakPct: 75,
  localization2009Pct: 6,
  localization2023Pct: 12,
  aeSubsidyShare2009Pct: 84,
  aeSubsidyShare2023Pct: 75,
  emdeSubsidyShare2009Pct: 56,
  emdeSubsidyShare2023Pct: 71,
  aeTradeShare2009Pct: 3,
  aeTradeShare2023Pct: 8,
  emdeTradeShare2009Pct: 27,
  emdeTradeShare2023Pct: 18,
  securityExportBarrierPre2020Pct: 7,
  securityExportBarrierPost2020Pct: 22,
  chipsAppropriatedUsdBn: 52.7,
};

/** Extensive margin: share of monitored jurisdictions deploying each instrument class */
export type JurisdictionCoverageRow = {
  year: number;
  distortingPct: number;
  subsidiesPct: number;
  tradePct: number;
  localizationPct: number;
  confidence: Confidence;
  note?: string;
};

export const JURISDICTION_COVERAGE: JurisdictionCoverageRow[] = [
  {
    year: 2009,
    distortingPct: 56,
    subsidiesPct: 36,
    tradePct: 29,
    localizationPct: 6,
    confidence: "disclosed",
    note: "IMF WP/25/222 Fig. 6 endpoints; trade mid of disclosed 26–32% band",
  },
  {
    year: 2012,
    distortingPct: 58,
    subsidiesPct: 40,
    tradePct: 28,
    localizationPct: 7,
    confidence: "estimated",
  },
  {
    year: 2015,
    distortingPct: 59,
    subsidiesPct: 44,
    tradePct: 28,
    localizationPct: 8,
    confidence: "estimated",
  },
  {
    year: 2018,
    distortingPct: 60,
    subsidiesPct: 48,
    tradePct: 29,
    localizationPct: 9,
    confidence: "estimated",
  },
  {
    year: 2020,
    distortingPct: 75,
    subsidiesPct: 72,
    tradePct: 70,
    localizationPct: 10,
    confidence: "disclosed",
    note: "Peak year: distorting share 75%; AE subsidies 100%, AE trade restrictions 74%, EMDE trade 77% (IMF WP/25/222). Blended trade/subsidy shares estimated from AE/EMDE peaks.",
  },
  {
    year: 2022,
    distortingPct: 75,
    subsidiesPct: 65,
    tradePct: 40,
    localizationPct: 11,
    confidence: "disclosed",
    note: "Distorting share again at 75% peak; other series interpolated toward 2023",
  },
  {
    year: 2023,
    distortingPct: 63,
    subsidiesPct: 59,
    tradePct: 29,
    localizationPct: 12,
    confidence: "disclosed",
    note: "IMF WP/25/222 Fig. 6 endpoints; trade mid of 26–32% band",
  },
];

export type InstrumentMixRow = {
  group: "Advanced economies" | "Emerging & developing";
  period: "2009" | "2023";
  subsidiesPct: number;
  tradePct: number;
  localizationPct: number;
  otherPct: number;
  confidence: Confidence;
};

/** Instrument composition within AE / EMDE industrial-policy measures */
export const INSTRUMENT_MIX: InstrumentMixRow[] = [
  {
    group: "Advanced economies",
    period: "2009",
    subsidiesPct: 84,
    tradePct: 3,
    localizationPct: 7,
    otherPct: 6,
    confidence: "disclosed",
  },
  {
    group: "Advanced economies",
    period: "2023",
    subsidiesPct: 75,
    tradePct: 8,
    localizationPct: 8,
    otherPct: 9,
    confidence: "disclosed",
  },
  {
    group: "Emerging & developing",
    period: "2009",
    subsidiesPct: 56,
    tradePct: 27,
    localizationPct: 2,
    otherPct: 15,
    confidence: "disclosed",
  },
  {
    group: "Emerging & developing",
    period: "2023",
    subsidiesPct: 71,
    tradePct: 18,
    localizationPct: 6,
    otherPct: 5,
    confidence: "disclosed",
  },
];

export type NipoLevelRow = {
  level: string;
  shortLabel: string;
  count: number;
  sharePct: number;
  confidence: Confidence;
};

/** 2023 NIPO intervention levels (IMF WP/24/1 Table 2) */
export const NIPO_2023_LEVELS: NipoLevelRow[] = [
  { level: "Plans & strategies", shortLabel: "Plans", count: 98, sharePct: 3.8, confidence: "disclosed" },
  {
    level: "Policies & regulations",
    shortLabel: "Policies",
    count: 1451,
    sharePct: 56.24,
    confidence: "disclosed",
  },
  {
    level: "Firm-specific interventions",
    shortLabel: "Firm awards",
    count: 1031,
    sharePct: 39.96,
    confidence: "disclosed",
  },
];

export type MotiveShiftRow = {
  motive: string;
  pre2020ExportBarrierPct: number;
  post2020ExportBarrierPct: number;
  note: string;
  confidence: Confidence;
};

/** National-security / geopolitics measures: instrument mix shift (IMF WP/25/222) */
export const SECURITY_INSTRUMENT_SHIFT: MotiveShiftRow[] = [
  {
    motive: "Export barriers",
    pre2020ExportBarrierPct: 7,
    post2020ExportBarrierPct: 22,
    note: "Share of national-security / geopolitics measures using export barriers",
    confidence: "disclosed",
  },
  {
    motive: "Import barriers",
    pre2020ExportBarrierPct: 28,
    post2020ExportBarrierPct: 11,
    note: "Share using import barriers",
    confidence: "disclosed",
  },
  {
    motive: "Localization / procurement",
    pre2020ExportBarrierPct: 30,
    post2020ExportBarrierPct: 9,
    note: "Share using localization or public procurement",
    confidence: "disclosed",
  },
  {
    motive: "FDI measures",
    pre2020ExportBarrierPct: 24,
    post2020ExportBarrierPct: 11,
    note: "Share using FDI screening / incentives",
    confidence: "disclosed",
  },
  {
    motive: "Other / unconventional",
    pre2020ExportBarrierPct: 5,
    post2020ExportBarrierPct: 37,
    note: "Rising share of unconventional instruments",
    confidence: "disclosed",
  },
];

export type PackageRow = {
  id: string;
  jurisdiction: string;
  shortLabel: string;
  packageName: string;
  usdBn: number;
  metric: "appropriation" | "mobilisation" | "state-aid" | "tax-credit-estimate";
  year: number;
  sector: string;
  confidence: Confidence;
  note?: string;
};

/** Major industrial-policy fiscal packages (headline statutory / mobilisation figures) */
export const POLICY_PACKAGES: PackageRow[] = [
  {
    id: "us-chips",
    jurisdiction: "United States",
    shortLabel: "US CHIPS $",
    packageName: "CHIPS & Science Act (semiconductor appropriations)",
    usdBn: 52.7,
    metric: "appropriation",
    year: 2022,
    sector: "Semiconductors",
    confidence: "disclosed",
    note: "$39B manufacturing incentives + ~$13B R&D/workforce; excludes 25% ITC",
  },
  {
    id: "us-chips-itc",
    jurisdiction: "United States",
    shortLabel: "US CHIPS ITC",
    packageName: "CHIPS advanced manufacturing ITC (budgeted cost)",
    usdBn: 24,
    metric: "tax-credit-estimate",
    year: 2022,
    sector: "Semiconductors",
    confidence: "disclosed",
    note: "Statutory 25% ITC; PIIE notes realistic budget near $24B with upside toward ~$100B",
  },
  {
    id: "eu-chips",
    jurisdiction: "European Union",
    shortLabel: "EU Chips",
    packageName: "European Chips Act (mobilised investment target)",
    usdBn: 47,
    metric: "mobilisation",
    year: 2023,
    sector: "Semiconductors",
    confidence: "estimated",
    note: "€43B public+private mobilisation target ≈ $47B at 2023 avg EURUSD; not a single EU budget line",
  },
  {
    id: "eu-ipcei",
    jurisdiction: "European Union",
    shortLabel: "EU IPCEI",
    packageName: "IPCEIs (microelectronics, batteries, hydrogen state aid)",
    usdBn: 40,
    metric: "state-aid",
    year: 2024,
    sector: "Strategic tech",
    confidence: "estimated",
    note: "GTA cites >€37B approved state aid across IPCEIs ≈ $40B",
  },
  {
    id: "us-ira-clean",
    jurisdiction: "United States",
    shortLabel: "US IRA",
    packageName: "IRA clean-energy tax expenditures (original score)",
    usdBn: 370,
    metric: "tax-credit-estimate",
    year: 2022,
    sector: "Clean energy / manufacturing",
    confidence: "disclosed",
    note: "Original CBO/JCT-era headline ~$370B; independent estimates of uptake often much higher",
  },
  {
    id: "jp-semi",
    jurisdiction: "Japan",
    shortLabel: "Japan semi",
    packageName: "Semiconductor / economic-security support packages",
    usdBn: 25,
    metric: "appropriation",
    year: 2023,
    sector: "Semiconductors",
    confidence: "estimated",
    note: "Rounded multi-year METI / economic-security semiconductor support; FX-sensitive",
  },
  {
    id: "kr-chips",
    jurisdiction: "South Korea",
    shortLabel: "Korea chips",
    packageName: "K-Chips Act tax & support package (multi-year)",
    usdBn: 19,
    metric: "tax-credit-estimate",
    year: 2023,
    sector: "Semiconductors",
    confidence: "estimated",
    note: "Rounded multi-year tax-credit and support envelope cited in policy trackers",
  },
  {
    id: "cn-bigfund",
    jurisdiction: "China",
    shortLabel: "China Big Fund",
    packageName: "National IC Big Fund III (reported raise)",
    usdBn: 48,
    metric: "appropriation",
    year: 2024,
    sector: "Semiconductors",
    confidence: "estimated",
    note: "~¥344B reported third-phase raise ≈ $48B; equity fund, not a grant line",
  },
];

export type AeEmdeCoverageRow = {
  group: string;
  year: number;
  subsidiesPct: number;
  tradePct: number;
  localizationPct: number;
  confidence: Confidence;
};

export const AE_EMDE_EXTENSIVE: AeEmdeCoverageRow[] = [
  { group: "Advanced economies", year: 2009, subsidiesPct: 81, tradePct: 19, localizationPct: 6, confidence: "disclosed" },
  { group: "Advanced economies", year: 2020, subsidiesPct: 100, tradePct: 74, localizationPct: 12, confidence: "disclosed" },
  { group: "Advanced economies", year: 2023, subsidiesPct: 90, tradePct: 35, localizationPct: 16, confidence: "disclosed" },
  { group: "Emerging & developing", year: 2009, subsidiesPct: 36, tradePct: 57, localizationPct: 18, confidence: "disclosed" },
  { group: "Emerging & developing", year: 2020, subsidiesPct: 66, tradePct: 77, localizationPct: 20, confidence: "estimated" },
  { group: "Emerging & developing", year: 2023, subsidiesPct: 57, tradePct: 57, localizationPct: 23, confidence: "disclosed" },
];

export const SOURCES = [
  { label: "IMF WP/24/1 — Return of Industrial Policy in Data", url: IMF_WP24_URL },
  { label: "IMF WP/25/222 — Industrial Policy Since the GFC", url: IMF_WP25_URL },
  { label: "Global Trade Alert — NIPO", url: GTA_NIPO_URL },
  { label: "GTA ZG #79 — Security First (2025)", url: GTA_2025_URL },
];

export function fmtPct(n: number, d = 0): string {
  return `${n.toFixed(d)}%`;
}

export function fmtBn(n: number): string {
  return n >= 100 ? `$${n.toFixed(0)}B` : `$${n.toFixed(1)}B`;
}

export function fmtInt(n: number): string {
  return n.toLocaleString("en-US");
}
