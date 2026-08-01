/**
 * Commercial aircraft final-assembly geography — Airbus / Boeing / COMAC / Embraer.
 * Site counts from manufacturer disclosures; 2025 deliveries from FlightGlobal year wrap.
 */

export const HEADLINE = {
  airbusFalCount: 12,
  airbusLocations: 5,
  boeingUsOnlySites: 3,
  airbusDeliveries2025: 793,
  boeingDeliveries2025: 600,
  comacC919Deliveries2025: 15,
  a320RateTarget2027: 75,
  duopolyDeliveries: 1393,
} as const;

export const SOURCES = [
  "Airbus — Production / Life cycle of an aircraft (12 FALs at five locations)",
  "Airbus — Ramping up A320 Family production (Oct 2025 Mobile & Tianjin second FALs)",
  "FlightGlobal — Airbus vs Boeing 2025 orders and deliveries wrap (Jan 2026)",
  "Boeing — Commercial production sites (Renton 737, Everett widebody/737 expansion, Charleston 787)",
  "ITIF — COMAC briefing (Jun 2026): C919 2025 deliveries; Airbus China FAL context",
  "Embraer — E-Jet E2 final assembly (São José dos Campos, Brazil)",
] as const;

export const SOURCE_NOTE =
  "Final-assembly-line (FAL) counts are manufacturer-disclosed facility tallies, not identical to annual deliveries. A single campus can host multiple FALs. Delivery totals are calendar-2025 commercial handovers (FlightGlobal). Embraer appears on the site map only — FY delivery print not used in ranked OEM bars.";

export type OemId = "airbus" | "boeing" | "comac" | "embraer";

export const OEM_DELIVERIES_2025 = [
  { oem: "Airbus", id: "airbus" as OemId, deliveries: 793, color: "#0ea5e9" },
  { oem: "Boeing", id: "boeing" as OemId, deliveries: 600, color: "#f59e0b" },
  { oem: "COMAC C919", id: "comac" as OemId, deliveries: 15, color: "#f43f5e" },
].sort((a, b) => b.deliveries - a.deliveries);

export const AIRBUS_2025_BY_FAMILY = [
  { family: "A320neo family", deliveries: 607 },
  { family: "A220", deliveries: 93 },
  { family: "A350", deliveries: 57 },
  { family: "A330neo", deliveries: 36 },
].sort((a, b) => b.deliveries - a.deliveries);

export const BOEING_2025_BY_FAMILY = [
  { family: "737 MAX", deliveries: 447 },
  { family: "787", deliveries: 88 },
  { family: "777F", deliveries: 35 },
  { family: "767", deliveries: 30 },
  { family: "777X", deliveries: 0 },
].sort((a, b) => b.deliveries - a.deliveries);

export type FalSite = {
  id: string;
  oem: OemId;
  city: string;
  country: string;
  region: "Europe" | "North America" | "Asia" | "South America";
  falLines: number;
  programs: string;
  lat: number;
  lon: number;
};

export const FAL_SITES: FalSite[] = [
  {
    id: "tls",
    oem: "airbus",
    city: "Toulouse",
    country: "France",
    region: "Europe",
    falLines: 4,
    programs: "A320 family (incl. Lagardère), A330, A350",
    lat: 43.6,
    lon: 1.4,
  },
  {
    id: "ham",
    oem: "airbus",
    city: "Hamburg",
    country: "Germany",
    region: "Europe",
    falLines: 4,
    programs: "A320 family (4 lines)",
    lat: 53.5,
    lon: 9.8,
  },
  {
    id: "tjn",
    oem: "airbus",
    city: "Tianjin",
    country: "China",
    region: "Asia",
    falLines: 2,
    programs: "A320 family (2nd FAL inaugurated Oct 2025)",
    lat: 39.1,
    lon: 117.2,
  },
  {
    id: "mob",
    oem: "airbus",
    city: "Mobile",
    country: "United States",
    region: "North America",
    falLines: 2,
    programs: "A320 family + A220 (2nd A320 FAL Oct 2025)",
    lat: 30.7,
    lon: -88.0,
  },
  {
    id: "rtn",
    oem: "boeing",
    city: "Renton",
    country: "United States",
    region: "North America",
    falLines: 2,
    programs: "737 MAX",
    lat: 47.5,
    lon: -122.2,
  },
  {
    id: "evt",
    oem: "boeing",
    city: "Everett",
    country: "United States",
    region: "North America",
    falLines: 2,
    programs: "777 / 777X; 737 expansion line",
    lat: 47.9,
    lon: -122.3,
  },
  {
    id: "chs",
    oem: "boeing",
    city: "Charleston",
    country: "United States",
    region: "North America",
    falLines: 2,
    programs: "787 (consolidated from Everett)",
    lat: 32.9,
    lon: -80.0,
  },
  {
    id: "sha",
    oem: "comac",
    city: "Shanghai",
    country: "China",
    region: "Asia",
    falLines: 1,
    programs: "C919 final assembly",
    lat: 31.2,
    lon: 121.5,
  },
  {
    id: "sjc",
    oem: "embraer",
    city: "São José dos Campos",
    country: "Brazil",
    region: "South America",
    falLines: 1,
    programs: "E-Jet E2",
    lat: -23.2,
    lon: -45.9,
  },
];

export const FAL_BY_COUNTRY = (() => {
  const map = new Map<string, { country: string; lines: number }>();
  for (const s of FAL_SITES) {
    const row = map.get(s.country) ?? { country: s.country, lines: 0 };
    row.lines += s.falLines;
    map.set(s.country, row);
  }
  return [...map.values()].sort((a, b) => b.lines - a.lines);
})();

export const FAL_BY_REGION = (() => {
  const map = new Map<string, number>();
  for (const s of FAL_SITES) {
    map.set(s.region, (map.get(s.region) ?? 0) + s.falLines);
  }
  return [...map.entries()]
    .map(([region, lines]) => ({ region, lines }))
    .sort((a, b) => b.lines - a.lines);
})();

/** Airbus A320 Family monthly capability path — 2027 target disclosed; prior years approx. ramp waypoints. */
export const A320_RATE_PATH = [
  { label: "2023", rate: 50, quality: "approx" as const },
  { label: "2024", rate: 55, quality: "approx" as const },
  { label: "2025", rate: 60, quality: "approx" as const },
  { label: "2027 tgt", rate: 75, quality: "disclosed" as const },
];

export function rankedFalSites() {
  return [...FAL_SITES].sort((a, b) => b.falLines - a.falLines || a.city.localeCompare(b.city));
}

export function fmtN(n: number) {
  return n.toLocaleString("en-US");
}

export function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}
