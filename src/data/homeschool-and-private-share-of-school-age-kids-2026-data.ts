/**
 * Homeschool + private share of school-age kids vs public enrollment drop.
 * Desk join of NCES CCD/PSS/NHES, Census ACS/SAIPE school-age, and
 * Census Household Pulse / state homeschool filings (where available).
 *
 * Confidence: disclosed = published NCES/Census figure; estimated = desk
 * interpolation/bridge across survey vintages; carried = held from prior
 * disclosed year pending next PSS/NHES release.
 */

export const SLUG = "homeschool-and-private-share-of-school-age-kids-2026";

export const VIZ_MARKERS = [
  "Non-public share of school-age",
  "Private vs home paths",
  "Headcounts (millions)",
] as const;

export const SOURCE_NOTE =
  "NCES CCD public enrollment; NCES Private School Universe Survey (PSS); NCES NHES 2019 homeschool rate; Census Household Pulse (2020–23) and selected state homeschool filings for post-2019 home estimates; Census ACS/SAIPE ages 5–17. Desk bridge across survey vintages — not an official NCES series.";

export type Confidence = "disclosed" | "estimated" | "carried";

export type RegionId = "Northeast" | "Midwest" | "South" | "West";

/** Headline stats for cards + QA */
export const HEADLINE = {
  publicDropM: 1.3,
  publicDropPct: -2.5,
  schoolAgeDropM: 0.48,
  demographyShareOfDropPct: 37,
  nonPublicShare2019: 11.4,
  nonPublicShare2023: 14.1,
  nonPublicSharePp: 2.7,
  privateShare2019: 8.7,
  privateShare2023: 8.9,
  homeShare2019: 2.7,
  homeShare2023: 5.2,
  homeGainM: 1.35,
  privateGainM: 0.05,
} as const;

/**
 * National path, fall school years.
 * schoolAgeM = Census/SAIPE ages 5–17 (millions).
 * publicM = NCES CCD preK–12 public (50 states + DC).
 * privateM = NCES PSS K–12 (even years estimated between odd-year PSS).
 * homeM = NHES 2019 disclosed; Pulse/state desk bridge afterward.
 * nonPublicShare = (private + home) / schoolAge * 100.
 */
export const NATIONAL_PATH: {
  year: number;
  schoolAgeM: number;
  publicM: number;
  privateM: number;
  homeM: number;
  publicShare: number;
  privateShare: number;
  homeShare: number;
  nonPublicShare: number;
  confidence: Confidence;
}[] = [
  {
    year: 2016,
    schoolAgeM: 53.95,
    publicM: 50.62,
    privateM: 4.85,
    homeM: 1.69,
    publicShare: 93.8,
    privateShare: 9.0,
    homeShare: 3.1,
    nonPublicShare: 12.1,
    confidence: "estimated",
  },
  {
    year: 2017,
    schoolAgeM: 54.02,
    publicM: 50.69,
    privateM: 4.78,
    homeM: 1.62,
    publicShare: 93.8,
    privateShare: 8.8,
    homeShare: 3.0,
    nonPublicShare: 11.8,
    confidence: "estimated",
  },
  {
    year: 2018,
    schoolAgeM: 54.08,
    publicM: 50.74,
    privateM: 4.72,
    homeM: 1.55,
    publicShare: 93.8,
    privateShare: 8.7,
    homeShare: 2.9,
    nonPublicShare: 11.6,
    confidence: "estimated",
  },
  {
    year: 2019,
    schoolAgeM: 54.12,
    publicM: 50.8,
    privateM: 4.7,
    homeM: 1.46,
    publicShare: 93.9,
    privateShare: 8.7,
    homeShare: 2.7,
    nonPublicShare: 11.4,
    confidence: "disclosed",
  },
  {
    year: 2020,
    schoolAgeM: 53.95,
    publicM: 49.4,
    privateM: 4.72,
    homeM: 2.55,
    publicShare: 91.6,
    privateShare: 8.7,
    homeShare: 4.7,
    nonPublicShare: 13.5,
    confidence: "estimated",
  },
  {
    year: 2021,
    schoolAgeM: 53.82,
    publicM: 49.4,
    privateM: 4.7,
    homeM: 2.9,
    publicShare: 91.8,
    privateShare: 8.7,
    homeShare: 5.4,
    nonPublicShare: 14.1,
    confidence: "disclosed",
  },
  {
    year: 2022,
    schoolAgeM: 53.72,
    publicM: 49.6,
    privateM: 4.73,
    homeM: 2.85,
    publicShare: 92.3,
    privateShare: 8.8,
    homeShare: 5.3,
    nonPublicShare: 14.1,
    confidence: "estimated",
  },
  {
    year: 2023,
    schoolAgeM: 53.64,
    publicM: 49.5,
    privateM: 4.75,
    homeM: 2.81,
    publicShare: 92.3,
    privateShare: 8.9,
    homeShare: 5.2,
    nonPublicShare: 14.1,
    confidence: "estimated",
  },
];

/**
 * Waterfall decomposition of the 2019→2023 public enrollment change (millions).
 * Order is narrative: start → demography → private uptake → home uptake → residual.
 */
export const DECOMPOSITION: {
  id: string;
  label: string;
  deltaM: number;
  kind: "start" | "down" | "up" | "end";
}[] = [
  { id: "start", label: "Public 2019", deltaM: 50.8, kind: "start" },
  {
    id: "demo",
    label: "Fewer school-age kids",
    deltaM: -0.48,
    kind: "down",
  },
  {
    id: "private",
    label: "Private uptake",
    deltaM: -0.05,
    kind: "down",
  },
  {
    id: "home",
    label: "Homeschool / other non-public",
    deltaM: -0.72,
    kind: "down",
  },
  {
    id: "residual",
    label: "Grade-mix & residual",
    deltaM: -0.05,
    kind: "down",
  },
  { id: "end", label: "Public 2023", deltaM: 49.5, kind: "end" },
];

/** Indexed paths (2019 = 100) for dual-axis comparison */
export const INDEX_PATH = NATIONAL_PATH.map((r) => {
  const base = NATIONAL_PATH.find((x) => x.year === 2019)!;
  return {
    year: r.year,
    schoolAgeIdx: Math.round((r.schoolAgeM / base.schoolAgeM) * 1000) / 10,
    publicIdx: Math.round((r.publicM / base.publicM) * 1000) / 10,
    privateIdx: Math.round((r.privateM / base.privateM) * 1000) / 10,
    homeIdx: Math.round((r.homeM / base.homeM) * 1000) / 10,
    nonPublicShare: r.nonPublicShare,
  };
});

export type StateRow = {
  state: string;
  abbr: string;
  region: RegionId;
  privateShare: number;
  homeShare: number;
  nonPublicShare: number;
  publicPctChange2019_23: number;
  schoolAgePctChange2019_23: number;
  confidence: Confidence;
};

/** Selected states with usable private (PSS) + home (Pulse/state filing) bridges */
export const STATE_PANEL: StateRow[] = [
  {
    state: "North Carolina",
    abbr: "NC",
    region: "South",
    privateShare: 7.8,
    homeShare: 8.9,
    nonPublicShare: 16.7,
    publicPctChange2019_23: -3.1,
    schoolAgePctChange2019_23: 0.4,
    confidence: "estimated",
  },
  {
    state: "Florida",
    abbr: "FL",
    region: "South",
    privateShare: 11.2,
    homeShare: 4.5,
    nonPublicShare: 15.7,
    publicPctChange2019_23: -1.8,
    schoolAgePctChange2019_23: 1.1,
    confidence: "estimated",
  },
  {
    state: "Oregon",
    abbr: "OR",
    region: "West",
    privateShare: 8.1,
    homeShare: 7.2,
    nonPublicShare: 15.3,
    publicPctChange2019_23: -5.4,
    schoolAgePctChange2019_23: -1.9,
    confidence: "estimated",
  },
  {
    state: "Idaho",
    abbr: "ID",
    region: "West",
    privateShare: 6.4,
    homeShare: 8.1,
    nonPublicShare: 14.5,
    publicPctChange2019_23: -2.2,
    schoolAgePctChange2019_23: 2.8,
    confidence: "estimated",
  },
  {
    state: "Virginia",
    abbr: "VA",
    region: "South",
    privateShare: 9.4,
    homeShare: 4.5,
    nonPublicShare: 13.9,
    publicPctChange2019_23: -3.6,
    schoolAgePctChange2019_23: -0.6,
    confidence: "estimated",
  },
  {
    state: "Georgia",
    abbr: "GA",
    region: "South",
    privateShare: 8.6,
    homeShare: 4.7,
    nonPublicShare: 13.3,
    publicPctChange2019_23: -2.4,
    schoolAgePctChange2019_23: 0.8,
    confidence: "estimated",
  },
  {
    state: "Washington",
    abbr: "WA",
    region: "West",
    privateShare: 8.9,
    homeShare: 4.2,
    nonPublicShare: 13.1,
    publicPctChange2019_23: -4.1,
    schoolAgePctChange2019_23: -0.9,
    confidence: "estimated",
  },
  {
    state: "Colorado",
    abbr: "CO",
    region: "West",
    privateShare: 7.1,
    homeShare: 5.8,
    nonPublicShare: 12.9,
    publicPctChange2019_23: -5.2,
    schoolAgePctChange2019_23: -1.4,
    confidence: "estimated",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    region: "Northeast",
    privateShare: 12.4,
    homeShare: 2.3,
    nonPublicShare: 14.7,
    publicPctChange2019_23: -3.8,
    schoolAgePctChange2019_23: -1.6,
    confidence: "estimated",
  },
  {
    state: "New York",
    abbr: "NY",
    region: "Northeast",
    privateShare: 13.8,
    homeShare: 1.9,
    nonPublicShare: 15.7,
    publicPctChange2019_23: -5.1,
    schoolAgePctChange2019_23: -2.4,
    confidence: "estimated",
  },
  {
    state: "Ohio",
    abbr: "OH",
    region: "Midwest",
    privateShare: 10.1,
    homeShare: 2.8,
    nonPublicShare: 12.9,
    publicPctChange2019_23: -2.9,
    schoolAgePctChange2019_23: -1.1,
    confidence: "estimated",
  },
  {
    state: "Michigan",
    abbr: "MI",
    region: "Midwest",
    privateShare: 8.2,
    homeShare: 3.6,
    nonPublicShare: 11.8,
    publicPctChange2019_23: -4.0,
    schoolAgePctChange2019_23: -1.8,
    confidence: "estimated",
  },
  {
    state: "Illinois",
    abbr: "IL",
    region: "Midwest",
    privateShare: 11.6,
    homeShare: 2.4,
    nonPublicShare: 14.0,
    publicPctChange2019_23: -4.6,
    schoolAgePctChange2019_23: -2.2,
    confidence: "estimated",
  },
  {
    state: "Texas",
    abbr: "TX",
    region: "South",
    privateShare: 6.2,
    homeShare: 4.1,
    nonPublicShare: 10.3,
    publicPctChange2019_23: -0.6,
    schoolAgePctChange2019_23: 1.6,
    confidence: "estimated",
  },
  {
    state: "California",
    abbr: "CA",
    region: "West",
    privateShare: 8.4,
    homeShare: 3.9,
    nonPublicShare: 12.3,
    publicPctChange2019_23: -5.6,
    schoolAgePctChange2019_23: -2.8,
    confidence: "estimated",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    region: "Northeast",
    privateShare: 12.1,
    homeShare: 1.2,
    nonPublicShare: 13.3,
    publicPctChange2019_23: -4.2,
    schoolAgePctChange2019_23: -1.7,
    confidence: "estimated",
  },
  {
    state: "Arizona",
    abbr: "AZ",
    region: "West",
    privateShare: 5.9,
    homeShare: 5.1,
    nonPublicShare: 11.0,
    publicPctChange2019_23: -1.4,
    schoolAgePctChange2019_23: 1.9,
    confidence: "estimated",
  },
  {
    state: "Tennessee",
    abbr: "TN",
    region: "South",
    privateShare: 8.0,
    homeShare: 6.1,
    nonPublicShare: 14.1,
    publicPctChange2019_23: -2.0,
    schoolAgePctChange2019_23: 0.6,
    confidence: "estimated",
  },
  {
    state: "Wisconsin",
    abbr: "WI",
    region: "Midwest",
    privateShare: 11.8,
    homeShare: 3.3,
    nonPublicShare: 15.1,
    publicPctChange2019_23: -2.7,
    schoolAgePctChange2019_23: -0.8,
    confidence: "estimated",
  },
  {
    state: "Maine",
    abbr: "ME",
    region: "Northeast",
    privateShare: 8.6,
    homeShare: 6.3,
    nonPublicShare: 14.9,
    publicPctChange2019_23: -4.8,
    schoolAgePctChange2019_23: -2.0,
    confidence: "estimated",
  },
];

export const REGION_SUMMARY: {
  region: RegionId;
  avgNonPublic: number;
  avgHome: number;
  avgPrivate: number;
  avgPublicPct: number;
  avgSchoolAgePct: number;
}[] = (
  ["Northeast", "Midwest", "South", "West"] as RegionId[]
).map((region) => {
  const rows = STATE_PANEL.filter((s) => s.region === region);
  const n = rows.length;
  const avg = (fn: (s: StateRow) => number) =>
    Math.round((rows.reduce((a, s) => a + fn(s), 0) / n) * 10) / 10;
  return {
    region,
    avgNonPublic: avg((s) => s.nonPublicShare),
    avgHome: avg((s) => s.homeShare),
    avgPrivate: avg((s) => s.privateShare),
    avgPublicPct: avg((s) => s.publicPctChange2019_23),
    avgSchoolAgePct: avg((s) => s.schoolAgePctChange2019_23),
  };
});

/** Attribution pie: shares of the 1.3M public drop */
export const DROP_ATTRIBUTION: {
  id: string;
  label: string;
  million: number;
  pct: number;
  fill: string;
}[] = [
  {
    id: "demo",
    label: "Fewer school-age children",
    million: 0.48,
    pct: 37,
    fill: "#64748b",
  },
  {
    id: "home",
    label: "Homeschool / other non-public",
    million: 0.72,
    pct: 55,
    fill: "#0d9488",
  },
  {
    id: "private",
    label: "Private school uptake",
    million: 0.05,
    pct: 4,
    fill: "#4f46e5",
  },
  {
    id: "residual",
    label: "Grade-mix & residual",
    million: 0.05,
    pct: 4,
    fill: "#d97706",
  },
];

export function fmtM(n: number, digits = 1): string {
  return `${n.toFixed(digits)}M`;
}

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function statesByRegion(region: RegionId | "all"): StateRow[] {
  if (region === "all") return [...STATE_PANEL];
  return STATE_PANEL.filter((s) => s.region === region);
}

export function pathFromYear(minYear: number) {
  return NATIONAL_PATH.filter((r) => r.year >= minYear);
}
