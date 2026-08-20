/**
 * Commercial aircraft final-assembly geography 2026 — site-level assembly-line share.
 * Angle: how concentrated large-jet handovers are by *site*, not OEM duopoly headlines.
 *
 * Deliveries: FlightGlobal / Cirium year wraps + OEM 2025 disclosures.
 * Site attribution: OEM line disclosures + ASCEND/Cirium site-capacity context;
 * narrowbody splits are estimated where OEMs do not publish per-FAL delivery tallies.
 */

export const SOURCE_NOTE =
  "Calendar-2025 commercial deliveries from FlightGlobal / Cirium year wraps and OEM disclosures (Airbus 793, Boeing 600, COMAC C919 15). Embraer E-Jet commercial handovers (~140) are shown as a regional-jet comparator, not in the large-jet concentration core. Site shares for multi-FAL programs (esp. A320 family) are estimated from disclosed line counts, rate targets, and public ramp notes — not audited per-gate tallies. Widebody sites (787 Charleston; 777/767 Everett; A330/A350 Toulouse) track program deliveries more closely.";

export const SOURCES = [
  "FlightGlobal — Airbus vs Boeing 2025 orders and deliveries wrap (Jan 2026)",
  "Cirium / ASCEND — commercial fleet & production monitoring (2025–26)",
  "Airbus — Production / FAL network (Toulouse, Hamburg, Tianjin, Mobile; A320 rate path)",
  "Boeing — Commercial production sites (Renton 737, Everett widebody, Charleston 787)",
  "ITIF / COMAC briefings — C919 2025 delivery print (Shanghai FAL)",
  "Embraer — E-Jet E2 final assembly (São José dos Campos)",
] as const;

export type OemId = "airbus" | "boeing" | "comac" | "embraer";
export type JetClass = "narrowbody" | "widebody" | "regional";
export type Confidence = "program-tied" | "line-estimated" | "disclosed-site";

export type AssemblySite = {
  id: string;
  site: string;
  short: string;
  oem: OemId;
  oemLabel: string;
  country: string;
  region: "Europe" | "North America" | "Asia" | "South America";
  programs: string;
  jetClass: JetClass;
  /** Estimated or program-tied 2025 commercial deliveries from this FAL campus */
  deliveries2025: number;
  falLines: number;
  confidence: Confidence;
  color: string;
  lat: number;
  lon: number;
};

/**
 * Site-attributed 2025 commercial deliveries (large-jet core + Embraer comparator).
 * A320 family (~607) split across Hamburg / Toulouse / Tianjin / Mobile by disclosed
 * line weight and ramp notes; A220 (~93) attributed to Mobile; A330/A350 to Toulouse.
 * Boeing program deliveries map 1:1 to primary FAL campuses.
 */
export const ASSEMBLY_SITES: AssemblySite[] = [
  {
    id: "rtn",
    site: "Renton, WA",
    short: "Renton",
    oem: "boeing",
    oemLabel: "Boeing",
    country: "United States",
    region: "North America",
    programs: "737 MAX",
    jetClass: "narrowbody",
    deliveries2025: 447,
    falLines: 2,
    confidence: "program-tied",
    color: "#f59e0b",
    lat: 47.5,
    lon: -122.2,
  },
  {
    id: "ham",
    site: "Hamburg",
    short: "Hamburg",
    oem: "airbus",
    oemLabel: "Airbus",
    country: "Germany",
    region: "Europe",
    programs: "A320 family (4 lines)",
    jetClass: "narrowbody",
    deliveries2025: 268,
    falLines: 4,
    confidence: "line-estimated",
    color: "#0ea5e9",
    lat: 53.5,
    lon: 9.8,
  },
  {
    id: "tls",
    site: "Toulouse",
    short: "Toulouse",
    oem: "airbus",
    oemLabel: "Airbus",
    country: "France",
    region: "Europe",
    programs: "A320 family + A330neo + A350",
    jetClass: "narrowbody",
    deliveries2025: 214,
    falLines: 4,
    confidence: "line-estimated",
    color: "#0284c7",
    lat: 43.6,
    lon: 1.4,
  },
  {
    id: "mob",
    site: "Mobile, AL",
    short: "Mobile",
    oem: "airbus",
    oemLabel: "Airbus",
    country: "United States",
    region: "North America",
    programs: "A320 family + A220",
    jetClass: "narrowbody",
    deliveries2025: 168,
    falLines: 2,
    confidence: "line-estimated",
    color: "#38bdf8",
    lat: 30.7,
    lon: -88.0,
  },
  {
    id: "tjn",
    site: "Tianjin",
    short: "Tianjin",
    oem: "airbus",
    oemLabel: "Airbus",
    country: "China",
    region: "Asia",
    programs: "A320 family (2 FALs)",
    jetClass: "narrowbody",
    deliveries2025: 143,
    falLines: 2,
    confidence: "line-estimated",
    color: "#7dd3fc",
    lat: 39.1,
    lon: 117.2,
  },
  {
    id: "chs",
    site: "Charleston, SC",
    short: "Charleston",
    oem: "boeing",
    oemLabel: "Boeing",
    country: "United States",
    region: "North America",
    programs: "787",
    jetClass: "widebody",
    deliveries2025: 88,
    falLines: 2,
    confidence: "program-tied",
    color: "#d97706",
    lat: 32.9,
    lon: -80.0,
  },
  {
    id: "evt",
    site: "Everett, WA",
    short: "Everett",
    oem: "boeing",
    oemLabel: "Boeing",
    country: "United States",
    region: "North America",
    programs: "777F / 767; 777X prep",
    jetClass: "widebody",
    deliveries2025: 65,
    falLines: 2,
    confidence: "program-tied",
    color: "#b45309",
    lat: 47.9,
    lon: -122.3,
  },
  {
    id: "sjc",
    site: "São José dos Campos",
    short: "SJdC",
    oem: "embraer",
    oemLabel: "Embraer",
    country: "Brazil",
    region: "South America",
    programs: "E-Jet E2",
    jetClass: "regional",
    deliveries2025: 140,
    falLines: 1,
    confidence: "disclosed-site",
    color: "#a78bfa",
    lat: -23.2,
    lon: -45.9,
  },
  {
    id: "sha",
    site: "Shanghai",
    short: "Shanghai",
    oem: "comac",
    oemLabel: "COMAC",
    country: "China",
    region: "Asia",
    programs: "C919",
    jetClass: "narrowbody",
    deliveries2025: 15,
    falLines: 1,
    confidence: "disclosed-site",
    color: "#f43f5e",
    lat: 31.2,
    lon: 121.5,
  },
];

/** Large-jet core = exclude regional Embraer from concentration denominators */
export const LARGE_JET_SITES = ASSEMBLY_SITES.filter((s) => s.jetClass !== "regional");

export const LARGE_JET_DELIVERIES = LARGE_JET_SITES.reduce(
  (sum, s) => sum + s.deliveries2025,
  0,
);

export const HEADLINE = {
  largeJetDeliveries: LARGE_JET_DELIVERIES,
  topSiteSharePct: Math.round(
    (1000 * LARGE_JET_SITES[0].deliveries2025) / LARGE_JET_DELIVERIES,
  ) / 10,
  top3SharePct: Math.round(
    (1000 *
      LARGE_JET_SITES.slice(0, 3).reduce((s, r) => s + r.deliveries2025, 0)) /
      LARGE_JET_DELIVERIES,
  ) / 10,
  nonDuopolySharePct: Math.round(
    (1000 *
      LARGE_JET_SITES.filter((s) => s.oem === "comac").reduce(
        (s, r) => s + r.deliveries2025,
        0,
      )) /
      LARGE_JET_DELIVERIES,
  ) / 10,
  usSiteSharePct: Math.round(
    (1000 *
      LARGE_JET_SITES.filter((s) => s.country === "United States").reduce(
        (s, r) => s + r.deliveries2025,
        0,
      )) /
      LARGE_JET_DELIVERIES,
  ) / 10,
  europeSiteSharePct: Math.round(
    (1000 *
      LARGE_JET_SITES.filter((s) => s.region === "Europe").reduce(
        (s, r) => s + r.deliveries2025,
        0,
      )) /
      LARGE_JET_DELIVERIES,
  ) / 10,
  asiaSiteSharePct: Math.round(
    (1000 *
      LARGE_JET_SITES.filter((s) => s.region === "Asia").reduce(
        (s, r) => s + r.deliveries2025,
        0,
      )) /
      LARGE_JET_DELIVERIES,
  ) / 10,
  rentonDeliveries: 447,
  siteCount: LARGE_JET_SITES.length,
  a320RateTarget2027: 75,
} as const;

export function hhi(sites: AssemblySite[]): number {
  const total = sites.reduce((s, r) => s + r.deliveries2025, 0);
  if (total === 0) return 0;
  return Math.round(
    sites.reduce((acc, r) => {
      const share = r.deliveries2025 / total;
      return acc + share * share * 10_000;
    }, 0),
  );
}

export const SITE_HHI = hhi(LARGE_JET_SITES);

/** OEM rollup of large-jet deliveries */
export const OEM_ROLLUP = (() => {
  const map = new Map<
    OemId,
    { oem: string; id: OemId; deliveries: number; color: string }
  >();
  for (const s of LARGE_JET_SITES) {
    const row = map.get(s.oem) ?? {
      oem: s.oemLabel,
      id: s.oem,
      deliveries: 0,
      color: s.color,
    };
    row.deliveries += s.deliveries2025;
    map.set(s.oem, row);
  }
  return [...map.values()].sort((a, b) => b.deliveries - a.deliveries);
})();

export const REGION_ROLLUP = (() => {
  const map = new Map<string, number>();
  for (const s of LARGE_JET_SITES) {
    map.set(s.region, (map.get(s.region) ?? 0) + s.deliveries2025);
  }
  return [...map.entries()]
    .map(([region, deliveries]) => ({ region, deliveries }))
    .sort((a, b) => b.deliveries - a.deliveries);
})();

export const CLASS_ROLLUP = (() => {
  const map = new Map<string, number>();
  for (const s of LARGE_JET_SITES) {
    map.set(s.jetClass, (map.get(s.jetClass) ?? 0) + s.deliveries2025);
  }
  return [...map.entries()]
    .map(([jetClass, deliveries]) => ({ jetClass, deliveries }))
    .sort((a, b) => b.deliveries - a.deliveries);
})();

/** Narrowbody-only site ranking (excludes widebody campuses) */
export const NARROWBODY_SITES = LARGE_JET_SITES.filter(
  (s) => s.jetClass === "narrowbody",
).sort((a, b) => b.deliveries2025 - a.deliveries2025);

export const NARROWBODY_TOTAL = NARROWBODY_SITES.reduce(
  (s, r) => s + r.deliveries2025,
  0,
);

/** Cumulative concentration curve (Lorenz-style) for large-jet sites */
export const CONCENTRATION_CURVE = (() => {
  const sorted = [...LARGE_JET_SITES].sort(
    (a, b) => b.deliveries2025 - a.deliveries2025,
  );
  let cum = 0;
  return sorted.map((s, i) => {
    cum += s.deliveries2025;
    return {
      rank: i + 1,
      site: s.short,
      deliveries: s.deliveries2025,
      cumSharePct: Math.round((1000 * cum) / LARGE_JET_DELIVERIES) / 10,
      equalSharePct: Math.round((1000 * (i + 1)) / sorted.length) / 10,
    };
  });
})();

/** Airbus A320 family monthly rate path — disclosed 2027 target + ramp waypoints */
export const A320_RATE_PATH = [
  { year: "2023", rate: 50, quality: "approx" as const },
  { year: "2024", rate: 55, quality: "approx" as const },
  { year: "2025", rate: 60, quality: "approx" as const },
  { year: "2026e", rate: 67, quality: "approx" as const },
  { year: "2027 tgt", rate: 75, quality: "disclosed" as const },
];

/** Dual framing: OEM share vs top-site share (same delivery pool) */
export const DUAL_FRAMING = [
  { frame: "OEM: Airbus", sharePct: Math.round((1000 * 793) / LARGE_JET_DELIVERIES) / 10 },
  { frame: "OEM: Boeing", sharePct: Math.round((1000 * 600) / LARGE_JET_DELIVERIES) / 10 },
  { frame: "OEM: COMAC", sharePct: HEADLINE.nonDuopolySharePct },
  { frame: "Site: Renton", sharePct: HEADLINE.topSiteSharePct },
  {
    frame: "Site: top 3",
    sharePct: HEADLINE.top3SharePct,
  },
  { frame: "Region: US FALs", sharePct: HEADLINE.usSiteSharePct },
];

/** Scatter: fal lines vs deliveries (throughput per campus) */
export function siteThroughput(sites: AssemblySite[] = LARGE_JET_SITES) {
  return sites.map((s) => ({
    ...s,
    perLine: Math.round(s.deliveries2025 / Math.max(1, s.falLines)),
  }));
}

export function rankedSites(
  opts: {
    includeRegional?: boolean;
    oem?: OemId | "all";
    jetClass?: JetClass | "all";
  } = {},
) {
  const { includeRegional = false, oem = "all", jetClass = "all" } = opts;
  return ASSEMBLY_SITES.filter((s) => {
    if (!includeRegional && s.jetClass === "regional") return false;
    if (oem !== "all" && s.oem !== oem) return false;
    if (jetClass !== "all" && s.jetClass !== jetClass) return false;
    return true;
  }).sort((a, b) => b.deliveries2025 - a.deliveries2025);
}

export function fmtN(n: number) {
  return n.toLocaleString("en-US");
}

export function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}
