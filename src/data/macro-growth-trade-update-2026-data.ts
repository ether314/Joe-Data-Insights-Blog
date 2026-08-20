/**
 * Growth, trade & prices — vintage update (Aug 2026).
 * Compares IMF WEO April 2026 reference (prior research post) vs
 * IMF WEO Update July 2026 baseline. WTO Mar 2026 merchandise path
 * carried as context; no newer WTO GTOS vintage as of this update.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Vintage delta: IMF WEO April 2026 reference forecast → IMF WEO Update July 2026 baseline (Table 1). World trade = goods+services volume. Oil = IMF average petroleum spot ($/bbl). Country CPI assumptions from Table 1 footnotes where disclosed.";

export const SOURCES = [
  {
    label: "IMF World Economic Outlook Update, July 2026",
    url: "https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026",
  },
  {
    label: "IMF World Economic Outlook, April 2026",
    url: "https://www.imf.org/en/Publications/WEO/Issues/2026/04/14/world-economic-outlook-april-2026",
  },
  {
    label: "WTO Global Trade Outlook and Statistics, March 2026",
    url: "https://www.wto.org/english/res_e/publications_e/trade_outlook26_e.htm",
  },
];

/** Headline meters — July 2026 print and Δ vs April reference */
export const HEADLINE = {
  worldGdp2025: 3.5,
  worldGdp2026: 3.0,
  worldGdp2027: 3.4,
  gdp2026DeltaPp: -0.1,
  gdp2027DeltaPp: 0.2,
  worldTrade2025: 5.0,
  worldTrade2026: 3.5,
  worldTrade2027: 4.3,
  trade2026DeltaPp: 0.7,
  trade2027DeltaPp: 0.5,
  worldCpi2025: 4.1,
  worldCpi2026: 4.7,
  worldCpi2027: 3.9,
  cpi2026DeltaPp: 0.3,
  cpi2027DeltaPp: 0.2,
  oil2026: 89.27,
  oil2027: 78.7,
  oilApr2026: 82.22,
  oilDeltaPctVsApr: 9,
  marketGdp2026: 2.4,
  marketGdp2026DeltaPp: -0.2,
  aeCpi2026: 3.0,
  emCpi2026: 5.8,
  menaGdp2026: -0.5,
  menaGdp2026DeltaPp: -1.6,
  koreaGdp2026: 2.6,
  koreaGdp2026DeltaPp: 0.7,
};

export type MeterId = "gdp" | "trade" | "cpi";

/** Global triad — April reference vs July baseline */
export type VintageMeter = {
  meter: MeterId;
  label: string;
  unit: "%";
  apr2025: number;
  jul2025: number;
  apr2026: number;
  jul2026: number;
  apr2027: number;
  jul2027: number;
  delta2026Pp: number;
  delta2027Pp: number;
};

export const GLOBAL_METERS: VintageMeter[] = [
  {
    meter: "gdp",
    label: "World GDP (PPP)",
    unit: "%",
    apr2025: 3.4,
    jul2025: 3.5,
    apr2026: 3.1,
    jul2026: 3.0,
    apr2027: 3.2,
    jul2027: 3.4,
    delta2026Pp: -0.1,
    delta2027Pp: 0.2,
  },
  {
    meter: "trade",
    label: "World trade volume (G+S)",
    unit: "%",
    apr2025: 5.1,
    jul2025: 5.0,
    apr2026: 2.8,
    jul2026: 3.5,
    apr2027: 3.8,
    jul2027: 4.3,
    delta2026Pp: 0.7,
    delta2027Pp: 0.5,
  },
  {
    meter: "cpi",
    label: "World headline CPI",
    unit: "%",
    apr2025: 4.1,
    jul2025: 4.1,
    apr2026: 4.4,
    jul2026: 4.7,
    apr2027: 3.7,
    jul2027: 3.9,
    delta2026Pp: 0.3,
    delta2027Pp: 0.2,
  },
];

export type EconomyId =
  | "usa"
  | "eur"
  | "chn"
  | "ind"
  | "jpn"
  | "gbr"
  | "bra"
  | "mex"
  | "sau"
  | "kor"
  | "zaf";

export type EconomyVintage = {
  id: EconomyId;
  name: string;
  short: string;
  region: "Americas" | "Europe" | "Asia" | "EM other";
  aprGdp2025: number;
  julGdp2025: number;
  aprGdp2026: number;
  julGdp2026: number;
  aprGdp2027: number;
  julGdp2027: number;
  delta2026Pp: number;
  delta2027Pp: number;
  aprCpi2026?: number;
  julCpi2026?: number;
  cpiConfidence: Confidence;
  note?: string;
};

/** Major-economy GDP path — July Table 1 / Annex vs April research print */
export const ECONOMIES: EconomyVintage[] = [
  {
    id: "usa",
    name: "United States",
    short: "US",
    region: "Americas",
    aprGdp2025: 2.1,
    julGdp2025: 2.1,
    aprGdp2026: 2.3,
    julGdp2026: 2.3,
    aprGdp2027: 2.1,
    julGdp2027: 2.2,
    delta2026Pp: 0.0,
    delta2027Pp: 0.1,
    aprCpi2026: 3.2,
    julCpi2026: 3.6,
    cpiConfidence: "disclosed",
    note: "US CPI assumption 3.6% / 2.4% in 2026–27 (Apr: 3.2 / 2.1)",
  },
  {
    id: "eur",
    name: "Euro area",
    short: "EA",
    region: "Europe",
    aprGdp2025: 1.4,
    julGdp2025: 1.4,
    aprGdp2026: 1.1,
    julGdp2026: 0.9,
    aprGdp2027: 1.2,
    julGdp2027: 1.2,
    delta2026Pp: -0.2,
    delta2027Pp: 0.0,
    aprCpi2026: 2.6,
    julCpi2026: 2.9,
    cpiConfidence: "disclosed",
    note: "EA CPI assumption 2.9% / 2.3%; Q1 Ireland drag + energy",
  },
  {
    id: "chn",
    name: "China",
    short: "CN",
    region: "Asia",
    aprGdp2025: 5.0,
    julGdp2025: 5.0,
    aprGdp2026: 4.4,
    julGdp2026: 4.6,
    aprGdp2027: 4.0,
    julGdp2027: 4.1,
    delta2026Pp: 0.2,
    delta2027Pp: 0.1,
    cpiConfidence: "estimated",
    note: "Tech/export strength offsets oil drag; domestic demand still soft",
  },
  {
    id: "ind",
    name: "India",
    short: "IN",
    region: "Asia",
    aprGdp2025: 7.6,
    julGdp2025: 7.7,
    aprGdp2026: 6.5,
    julGdp2026: 6.4,
    aprGdp2027: 6.5,
    julGdp2027: 6.7,
    delta2026Pp: -0.1,
    delta2027Pp: 0.2,
    cpiConfidence: "estimated",
    note: "Fiscal-year basis per WEO note",
  },
  {
    id: "jpn",
    name: "Japan",
    short: "JP",
    region: "Asia",
    aprGdp2025: 1.2,
    julGdp2025: 1.1,
    aprGdp2026: 0.7,
    julGdp2026: 0.6,
    aprGdp2027: 0.6,
    julGdp2027: 0.7,
    delta2026Pp: -0.1,
    delta2027Pp: 0.1,
    aprCpi2026: 2.2,
    julCpi2026: 2.3,
    cpiConfidence: "disclosed",
  },
  {
    id: "gbr",
    name: "United Kingdom",
    short: "UK",
    region: "Europe",
    aprGdp2025: 1.3,
    julGdp2025: 1.4,
    aprGdp2026: 0.8,
    julGdp2026: 1.0,
    aprGdp2027: 1.3,
    julGdp2027: 1.3,
    delta2026Pp: 0.2,
    delta2027Pp: 0.0,
    cpiConfidence: "estimated",
  },
  {
    id: "bra",
    name: "Brazil",
    short: "BR",
    region: "Americas",
    aprGdp2025: 2.3,
    julGdp2025: 2.3,
    aprGdp2026: 1.9,
    julGdp2026: 2.4,
    aprGdp2027: 2.0,
    julGdp2027: 2.2,
    delta2026Pp: 0.5,
    delta2027Pp: 0.2,
    cpiConfidence: "estimated",
    note: "Largest upgrade among major LatAm prints (+0.5 pp)",
  },
  {
    id: "mex",
    name: "Mexico",
    short: "MX",
    region: "Americas",
    aprGdp2025: 0.6,
    julGdp2025: 0.5,
    aprGdp2026: 1.6,
    julGdp2026: 1.2,
    aprGdp2027: 2.2,
    julGdp2027: 1.9,
    delta2026Pp: -0.4,
    delta2027Pp: -0.3,
    cpiConfidence: "estimated",
  },
  {
    id: "sau",
    name: "Saudi Arabia",
    short: "SA",
    region: "EM other",
    aprGdp2025: 4.5,
    julGdp2025: 4.6,
    aprGdp2026: 3.1,
    julGdp2026: 1.7,
    aprGdp2027: 4.5,
    julGdp2027: 5.5,
    delta2026Pp: -1.4,
    delta2027Pp: 1.0,
    cpiConfidence: "estimated",
    note: "Hormuz timeline longer → deeper 2026, larger 2027 rebound",
  },
  {
    id: "kor",
    name: "Korea",
    short: "KR",
    region: "Asia",
    aprGdp2025: 1.1,
    julGdp2025: 1.1,
    aprGdp2026: 1.9,
    julGdp2026: 2.6,
    aprGdp2027: 2.1,
    julGdp2027: 2.5,
    delta2026Pp: 0.7,
    delta2027Pp: 0.4,
    cpiConfidence: "estimated",
    note: "AI hardware / semiconductor export boom; top-4 AI exporter",
  },
  {
    id: "zaf",
    name: "South Africa",
    short: "ZA",
    region: "EM other",
    aprGdp2025: 1.1,
    julGdp2025: 1.1,
    aprGdp2026: 1.0,
    julGdp2026: 1.1,
    aprGdp2027: 1.3,
    julGdp2027: 1.3,
    delta2026Pp: 0.1,
    delta2027Pp: 0.0,
    cpiConfidence: "estimated",
  },
];

/** Regional / exposure-group revision to cumulative 2026–27 growth (pp) — narrative Figure 4 groups */
export type ExposureRevision = {
  group: string;
  short: string;
  cumDeltaPp: number;
  kind: "tech" | "energy-x" | "energy-m" | "war";
};

export const EXPOSURE_REVISIONS: ExposureRevision[] = [
  { group: "Top 4 AI hardware exporters", short: "AI HW", cumDeltaPp: 1.2, kind: "tech" },
  { group: "Energy-exporting EMDEs (ex-MENA)", short: "EM energy X", cumDeltaPp: 0.6, kind: "energy-x" },
  { group: "Energy-exporting AEs", short: "AE energy X", cumDeltaPp: 0.3, kind: "energy-x" },
  { group: "Energy-importing EMDEs", short: "EM energy M", cumDeltaPp: -0.4, kind: "energy-m" },
  { group: "Energy-importing AEs", short: "AE energy M", cumDeltaPp: -0.7, kind: "energy-m" },
  { group: "MENA (conflict zone)", short: "MENA", cumDeltaPp: -2.4, kind: "war" },
];

export const EXPOSURE_COLORS: Record<ExposureRevision["kind"], string> = {
  tech: "#0ea5e9",
  "energy-x": "#14b8a6",
  "energy-m": "#f59e0b",
  war: "#f43f5e",
};

/** Dual-vintage path for composed triad chart */
export type PathPoint = {
  year: number;
  label: string;
  aprGdp: number | null;
  julGdp: number | null;
  aprTrade: number | null;
  julTrade: number | null;
  aprCpi: number | null;
  julCpi: number | null;
  phase: "outturn" | "forecast";
};

export const DUAL_PATH: PathPoint[] = [
  {
    year: 2024,
    label: "2024",
    aprGdp: 3.3,
    julGdp: 3.5,
    aprTrade: 3.4,
    julTrade: 3.7,
    aprCpi: 5.7,
    julCpi: 5.8,
    phase: "outturn",
  },
  {
    year: 2025,
    label: "2025",
    aprGdp: 3.4,
    julGdp: 3.5,
    aprTrade: 5.1,
    julTrade: 5.0,
    aprCpi: 4.1,
    julCpi: 4.1,
    phase: "outturn",
  },
  {
    year: 2026,
    label: "2026f",
    aprGdp: 3.1,
    julGdp: 3.0,
    aprTrade: 2.8,
    julTrade: 3.5,
    aprCpi: 4.4,
    julCpi: 4.7,
    phase: "forecast",
  },
  {
    year: 2027,
    label: "2027f",
    aprGdp: 3.2,
    julGdp: 3.4,
    aprTrade: 3.8,
    julTrade: 4.3,
    aprCpi: 3.7,
    julCpi: 3.9,
    phase: "forecast",
  },
];

/** Oil assumption bridge */
export const OIL_BRIDGE = [
  { label: "Apr reference", usd: 82.22, vintage: "apr" as const },
  { label: "Jul baseline", usd: 89.27, vintage: "jul" as const },
  { label: "2027 futures", usd: 78.7, vintage: "jul27" as const },
];

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function economyDeltas(ids?: EconomyId[]) {
  const rows = ids ? ECONOMIES.filter((e) => ids.includes(e.id)) : ECONOMIES;
  return rows
    .map((e) => ({
      id: e.id,
      name: e.name,
      short: e.short,
      delta2026Pp: e.delta2026Pp,
      delta2027Pp: e.delta2027Pp,
      apr: e.aprGdp2026,
      jul: e.julGdp2026,
      region: e.region,
    }))
    .sort((a, b) => b.delta2026Pp - a.delta2026Pp);
}

export function meterDeltas() {
  return GLOBAL_METERS.map((m) => ({
    meter: m.meter,
    label: m.label,
    delta2026Pp: m.delta2026Pp,
    delta2027Pp: m.delta2027Pp,
    apr2026: m.apr2026,
    jul2026: m.jul2026,
  }));
}

export const REGION_COLORS: Record<EconomyVintage["region"], string> = {
  Americas: "#0ea5e9",
  Europe: "#8b5cf6",
  Asia: "#f59e0b",
  "EM other": "#14b8a6",
};

export const ECONOMY_COLORS: Record<EconomyId, string> = {
  usa: "#0ea5e9",
  eur: "#8b5cf6",
  chn: "#f43f5e",
  ind: "#f59e0b",
  jpn: "#14b8a6",
  gbr: "#6366f1",
  bra: "#22c55e",
  mex: "#ec4899",
  sau: "#a855f7",
  kor: "#06b6d4",
  zaf: "#84cc16",
};
