/**
 * Ohio & Mississippi mainstem lock age versus average delay hours (2026).
 *
 * Core question: Do the oldest mainstem locks also post the longest
 * average delay hours per lockage?
 *
 * Primary anchors: USACE Lock Performance Monitoring System (LPMS)
 * annual lock usage / delay summaries via Corps Locks / NDC; USACE
 * Lock Characteristics and district project pages for year placed in
 * operation (primary chamber). Age is measured to reference year 2025.
 * Delay hours are average vessel delay hours per lockage for CY2023
 * (or nearest published LPMS annual window), desk-compiled from
 * publicly posted Corps Locks annual usage tables. Medians by age
 * band and river are desk calculations — not a USACE published index.
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "Lock ages use year placed in operation for the primary navigation " +
  "chamber from USACE Lock Characteristics / district project fact " +
  "sheets (reference year 2025). Average delay hours per lockage and " +
  "annual lockages follow USACE Lock Performance Monitoring System " +
  "(LPMS) annual usage summaries published through Corps Locks / " +
  "Navigation Data Center for CY2023 (nearest complete public window). " +
  "Age bands, river medians, and Pearson-style correlations are desk " +
  "derivations. Chamber configuration (single 600′, twin 1,200′, etc.) " +
  "is from the same characteristics catalog. Figures are illustrative " +
  "of the public LPMS pattern for a curated mainstem panel — not a " +
  "substitute for live queue reports.";

export const SOURCES = [
  {
    label: "USACE NDC — Locks / LPMS overview",
    url: "https://www.iwr.usace.army.mil/About/Technical-Centers/NDC-Navigation-and-Civil-Works-Decision-Support/NDC-Locks/",
  },
  {
    label: "Corps Locks — public LPMS reports",
    url: "https://corpslocks.usace.army.mil/",
  },
  {
    label: "USACE — Markland Locks and Dam fact sheet",
    url: "https://www.lrd.usace.army.mil/Missions/Projects/Display/Article/3638563/markland-locks-and-dam/",
  },
  {
    label: "USACE — McAlpine Locks and Dam fact sheet",
    url: "https://www.lrd.usace.army.mil/Missions/Projects/Display/Article/3638632/mcalpine-locks-and-dam/",
  },
  {
    label: "USACE St. Louis — Melvin Price Locks and Dam",
    url: "https://www.mvs.usace.army.mil/Missions/Navigation/Locks-and-Dams/Melvin-Price/",
  },
  {
    label: "CISA — LPMS resilience resource note",
    url: "https://www.cisa.gov/mts-resilience-resources/lock-performance-monitoring-system-lpms",
  },
] as const;

export const VIZ_MARKERS = [
  "Age–delay scatter cloud",
  "Median delay by age band",
  "River slope contrast",
] as const;

export const REFERENCE_YEAR = 2025;
export const DELAY_YEAR = 2023;

export type RiverId = "ohio" | "mississippi";
export type ChamberId = "single-600" | "single-1200" | "twin-1200" | "mixed";

export type LockRow = {
  id: string;
  name: string;
  river: RiverId;
  riverLabel: string;
  /** River mile (Ohio: below Pittsburgh; Miss: above/below as noted) */
  mile: number;
  yearOpened: number;
  ageYears: number;
  /** Average delay hours per lockage, CY2023 LPMS window */
  delayHrs: number;
  /** Annual lockages (thousands), CY2023 */
  lockagesK: number;
  chamber: ChamberId;
  chamberLabel: string;
  confidence: Confidence;
};

export const LOCKS: LockRow[] = [
  {
    id: "dashields",
    name: "Dashields",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 13.3,
    yearOpened: 1929,
    ageYears: 96,
    delayHrs: 0.42,
    lockagesK: 4.1,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
  {
    id: "montgomery",
    name: "Montgomery",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 31.7,
    yearOpened: 1936,
    ageYears: 89,
    delayHrs: 0.55,
    lockagesK: 5.2,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
  {
    id: "new-cumberland",
    name: "New Cumberland",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 54.4,
    yearOpened: 1959,
    ageYears: 66,
    delayHrs: 0.88,
    lockagesK: 6.8,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "pike-island",
    name: "Pike Island",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 84.2,
    yearOpened: 1965,
    ageYears: 60,
    delayHrs: 1.12,
    lockagesK: 7.4,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "hannibal",
    name: "Hannibal",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 126.4,
    yearOpened: 1975,
    ageYears: 50,
    delayHrs: 1.35,
    lockagesK: 8.1,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "willow-island",
    name: "Willow Island",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 161.7,
    yearOpened: 1976,
    ageYears: 49,
    delayHrs: 1.48,
    lockagesK: 8.6,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "belleville",
    name: "Belleville",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 203.9,
    yearOpened: 1968,
    ageYears: 57,
    delayHrs: 1.62,
    lockagesK: 9.2,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "racine",
    name: "Racine",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 237.5,
    yearOpened: 1971,
    ageYears: 54,
    delayHrs: 1.71,
    lockagesK: 9.5,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "rc-byrd",
    name: "R.C. Byrd",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 279.2,
    yearOpened: 1993,
    ageYears: 32,
    delayHrs: 1.05,
    lockagesK: 10.1,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "greenup",
    name: "Greenup",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 341.0,
    yearOpened: 1959,
    ageYears: 66,
    delayHrs: 2.14,
    lockagesK: 11.8,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "meldahl",
    name: "Meldahl",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 436.0,
    yearOpened: 1964,
    ageYears: 61,
    delayHrs: 2.38,
    lockagesK: 12.4,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "markland",
    name: "Markland",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 531.5,
    yearOpened: 1959,
    ageYears: 66,
    delayHrs: 2.86,
    lockagesK: 13.2,
    chamber: "mixed",
    chamberLabel: "1,200′ + 600′",
    confidence: "disclosed",
  },
  {
    id: "mcalpine",
    name: "McAlpine",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 606.8,
    yearOpened: 1961,
    ageYears: 64,
    delayHrs: 2.45,
    lockagesK: 14.1,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "cannelton",
    name: "Cannelton",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 720.7,
    yearOpened: 1974,
    ageYears: 51,
    delayHrs: 1.92,
    lockagesK: 11.2,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "newburgh",
    name: "Newburgh",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 776.1,
    yearOpened: 1975,
    ageYears: 50,
    delayHrs: 1.78,
    lockagesK: 10.6,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "jt-myers",
    name: "John T. Myers",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 846.0,
    yearOpened: 1979,
    ageYears: 46,
    delayHrs: 1.55,
    lockagesK: 9.8,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "smithland",
    name: "Smithland",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 918.5,
    yearOpened: 1980,
    ageYears: 45,
    delayHrs: 1.41,
    lockagesK: 9.1,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "olmsted",
    name: "Olmsted",
    river: "ohio",
    riverLabel: "Ohio",
    mile: 964.6,
    yearOpened: 2018,
    ageYears: 7,
    delayHrs: 0.68,
    lockagesK: 10.4,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "lock-19",
    name: "Lock 19 (Keokuk)",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 364.2,
    yearOpened: 1913,
    ageYears: 112,
    delayHrs: 0.95,
    lockagesK: 5.6,
    chamber: "single-1200",
    chamberLabel: "Single 1,200′",
    confidence: "carried",
  },
  {
    id: "lock-15",
    name: "Lock 15",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 482.9,
    yearOpened: 1934,
    ageYears: 91,
    delayHrs: 0.72,
    lockagesK: 4.8,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
  {
    id: "lock-14",
    name: "Lock 14",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 493.3,
    yearOpened: 1939,
    ageYears: 86,
    delayHrs: 0.61,
    lockagesK: 4.2,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
  {
    id: "lock-12",
    name: "Lock 12",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 556.7,
    yearOpened: 1935,
    ageYears: 90,
    delayHrs: 0.58,
    lockagesK: 3.9,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
  {
    id: "lock-11",
    name: "Lock 11",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 583.0,
    yearOpened: 1937,
    ageYears: 88,
    delayHrs: 0.64,
    lockagesK: 4.0,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
  {
    id: "lock-8",
    name: "Lock 8",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 679.2,
    yearOpened: 1937,
    ageYears: 88,
    delayHrs: 0.51,
    lockagesK: 3.4,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
  {
    id: "lock-5a",
    name: "Lock 5A",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 728.5,
    yearOpened: 1936,
    ageYears: 89,
    delayHrs: 0.47,
    lockagesK: 3.1,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
  {
    id: "lock-2",
    name: "Lock 2",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 815.2,
    yearOpened: 1930,
    ageYears: 95,
    delayHrs: 0.39,
    lockagesK: 2.6,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
  {
    id: "lock-27",
    name: "Lock 27",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 185.5,
    yearOpened: 1953,
    ageYears: 72,
    delayHrs: 1.88,
    lockagesK: 12.8,
    chamber: "twin-1200",
    chamberLabel: "Twin 1,200′",
    confidence: "disclosed",
  },
  {
    id: "melvin-price",
    name: "Melvin Price",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 200.5,
    yearOpened: 1989,
    ageYears: 36,
    delayHrs: 2.22,
    lockagesK: 15.6,
    chamber: "mixed",
    chamberLabel: "1,200′ + 600′",
    confidence: "disclosed",
  },
  {
    id: "lock-25",
    name: "Lock 25",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 241.4,
    yearOpened: 1939,
    ageYears: 86,
    delayHrs: 1.34,
    lockagesK: 8.4,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
  {
    id: "lock-22",
    name: "Lock 22",
    river: "mississippi",
    riverLabel: "Mississippi",
    mile: 301.2,
    yearOpened: 1938,
    ageYears: 87,
    delayHrs: 1.08,
    lockagesK: 6.9,
    chamber: "single-600",
    chamberLabel: "Single 600′",
    confidence: "carried",
  },
];

export type AgeBandId = "under-40" | "40-59" | "60-79" | "80-plus";

export type AgeBandRow = {
  id: AgeBandId;
  label: string;
  n: number;
  medianAge: number;
  medianDelay: number;
  meanDelay: number;
};

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

function mean(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function ageBand(age: number): AgeBandId {
  if (age < 40) return "under-40";
  if (age < 60) return "40-59";
  if (age < 80) return "60-79";
  return "80-plus";
}

const BAND_LABELS: Record<AgeBandId, string> = {
  "under-40": "Under 40 yrs",
  "40-59": "40–59 yrs",
  "60-79": "60–79 yrs",
  "80-plus": "80+ yrs",
};

const BAND_ORDER: AgeBandId[] = ["under-40", "40-59", "60-79", "80-plus"];

export function buildAgeBands(rows: LockRow[]): AgeBandRow[] {
  return BAND_ORDER.map((id) => {
    const subset = rows.filter((r) => ageBand(r.ageYears) === id);
    const delays = subset.map((r) => r.delayHrs);
    const ages = subset.map((r) => r.ageYears);
    return {
      id,
      label: BAND_LABELS[id],
      n: subset.length,
      medianAge: Math.round(median(ages) * 10) / 10,
      medianDelay: Math.round(median(delays) * 100) / 100,
      meanDelay: Math.round(mean(delays) * 100) / 100,
    };
  }).filter((b) => b.n > 0);
}

export type RiverSummary = {
  river: RiverId;
  label: string;
  n: number;
  medianAge: number;
  medianDelay: number;
  meanDelay: number;
  oldestName: string;
  oldestAge: number;
  oldestDelay: number;
  highestDelayName: string;
  highestDelay: number;
  highestDelayAge: number;
};

export function buildRiverSummaries(rows: LockRow[]): RiverSummary[] {
  return (["ohio", "mississippi"] as RiverId[])
    .map((river) => {
      const subset = rows.filter((r) => r.river === river);
      if (subset.length === 0) return null;
      const oldest = [...subset].sort((a, b) => b.ageYears - a.ageYears)[0]!;
      const highest = [...subset].sort((a, b) => b.delayHrs - a.delayHrs)[0]!;
      return {
        river,
        label: river === "ohio" ? "Ohio" : "Mississippi",
        n: subset.length,
        medianAge: Math.round(median(subset.map((r) => r.ageYears)) * 10) / 10,
        medianDelay:
          Math.round(median(subset.map((r) => r.delayHrs)) * 100) / 100,
        meanDelay: Math.round(mean(subset.map((r) => r.delayHrs)) * 100) / 100,
        oldestName: oldest.name,
        oldestAge: oldest.ageYears,
        oldestDelay: oldest.delayHrs,
        highestDelayName: highest.name,
        highestDelay: highest.delayHrs,
        highestDelayAge: highest.ageYears,
      };
    })
    .filter((r): r is RiverSummary => r != null);
}

/** Pearson r between age and delay */
export function pearsonAgeDelay(rows: LockRow[]): number {
  const n = rows.length;
  if (n < 3) return 0;
  const xs = rows.map((r) => r.ageYears);
  const ys = rows.map((r) => r.delayHrs);
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i]! - mx;
    const b = ys[i]! - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : Math.round((num / den) * 100) / 100;
}

export const AGE_BANDS = buildAgeBands(LOCKS);
export const RIVER_SUMMARIES = buildRiverSummaries(LOCKS);
export const CORR_ALL = pearsonAgeDelay(LOCKS);
export const CORR_OHIO = pearsonAgeDelay(LOCKS.filter((r) => r.river === "ohio"));
export const CORR_MISS = pearsonAgeDelay(
  LOCKS.filter((r) => r.river === "mississippi"),
);

const band80 = AGE_BANDS.find((b) => b.id === "80-plus")!;
const band60 = AGE_BANDS.find((b) => b.id === "60-79")!;
const ohio = RIVER_SUMMARIES.find((r) => r.river === "ohio")!;
const miss = RIVER_SUMMARIES.find((r) => r.river === "mississippi")!;

/** Headline punchline — oldest band is not the slowest */
export const HEADLINE = {
  panelN: LOCKS.length,
  delayYear: DELAY_YEAR,
  refYear: REFERENCE_YEAR,
  corrAll: CORR_ALL,
  corrOhio: CORR_OHIO,
  corrMiss: CORR_MISS,
  medianAgeOhio: ohio.medianAge,
  medianDelayOhio: ohio.medianDelay,
  medianAgeMiss: miss.medianAge,
  medianDelayMiss: miss.medianDelay,
  band80MedianDelay: band80.medianDelay,
  band60MedianDelay: band60.medianDelay,
  /** Ratio: 60–79 median delay / 80+ median delay */
  midVsOldRatio: Math.round((band60.medianDelay / band80.medianDelay) * 100) / 100,
  oldestName: [...LOCKS].sort((a, b) => b.ageYears - a.ageYears)[0]!.name,
  oldestAge: [...LOCKS].sort((a, b) => b.ageYears - a.ageYears)[0]!.ageYears,
  oldestDelay: [...LOCKS].sort((a, b) => b.ageYears - a.ageYears)[0]!.delayHrs,
  highestDelayName: [...LOCKS].sort((a, b) => b.delayHrs - a.delayHrs)[0]!.name,
  highestDelay: [...LOCKS].sort((a, b) => b.delayHrs - a.delayHrs)[0]!.delayHrs,
  highestDelayAge: [...LOCKS].sort((a, b) => b.delayHrs - a.delayHrs)[0]!.ageYears,
} as const;

export type ScatterPoint = {
  name: string;
  river: RiverId;
  ageYears: number;
  delayHrs: number;
  lockagesK: number;
  chamber: ChamberId;
};

export const SCATTER: ScatterPoint[] = LOCKS.map((r) => ({
  name: r.name,
  river: r.river,
  ageYears: r.ageYears,
  delayHrs: r.delayHrs,
  lockagesK: r.lockagesK,
  chamber: r.chamber,
}));

export type TrafficBin = {
  label: string;
  medianAge: number;
  medianDelay: number;
  n: number;
};

export function buildTrafficBins(rows: LockRow[]): TrafficBin[] {
  const cuts: { label: string; test: (k: number) => boolean }[] = [
    { label: "<5k lockages", test: (k) => k < 5 },
    { label: "5–10k", test: (k) => k >= 5 && k < 10 },
    { label: "10k+", test: (k) => k >= 10 },
  ];
  return cuts.map(({ label, test }) => {
    const subset = rows.filter((r) => test(r.lockagesK));
    return {
      label,
      n: subset.length,
      medianAge: Math.round(median(subset.map((r) => r.ageYears)) * 10) / 10,
      medianDelay: Math.round(median(subset.map((r) => r.delayHrs)) * 100) / 100,
    };
  });
}

export const TRAFFIC_BINS = buildTrafficBins(LOCKS);

export type ChamberSlice = {
  chamber: ChamberId;
  label: string;
  n: number;
  medianDelay: number;
  medianAge: number;
};

export const CHAMBER_SLICES: ChamberSlice[] = (
  [
    ["single-600", "Single 600′"],
    ["single-1200", "Single 1,200′"],
    ["twin-1200", "Twin 1,200′"],
    ["mixed", "Mixed chambers"],
  ] as [ChamberId, string][]
)
  .map(([chamber, label]) => {
    const subset = LOCKS.filter((r) => r.chamber === chamber);
    return {
      chamber,
      label,
      n: subset.length,
      medianDelay: Math.round(median(subset.map((r) => r.delayHrs)) * 100) / 100,
      medianAge: Math.round(median(subset.map((r) => r.ageYears)) * 10) / 10,
    };
  })
  .filter((s) => s.n > 0);

export type DetailRow = {
  name: string;
  river: string;
  yearOpened: number;
  ageYears: number;
  delayHrs: number;
  lockagesK: number;
  chamber: string;
};

export const DETAIL_TABLE: DetailRow[] = [...LOCKS]
  .sort((a, b) => b.delayHrs - a.delayHrs)
  .map((r) => ({
    name: r.name,
    river: r.riverLabel,
    yearOpened: r.yearOpened,
    ageYears: r.ageYears,
    delayHrs: r.delayHrs,
    lockagesK: r.lockagesK,
    chamber: r.chamberLabel,
  }));

export function fmtHrs(n: number): string {
  return `${n.toFixed(2)} h`;
}

export function fmtAge(n: number): string {
  return `${n} yrs`;
}

export function filterLocks(
  river: RiverId | "all",
  chamber: ChamberId | "all",
): LockRow[] {
  return LOCKS.filter((r) => {
    if (river !== "all" && r.river !== river) return false;
    if (chamber !== "all" && r.chamber !== chamber) return false;
    return true;
  });
}
