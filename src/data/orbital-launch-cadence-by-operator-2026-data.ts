/**
 * Orbital launch cadence by operator (2026).
 *
 * Core question: What share of successful orbital launches does a single
 * operator now account for, and how did that shift in five years?
 *
 * Perimeter: Worldwide orbital launch attempts that reached (or were intended
 * for) Earth orbit, calendar years 2020–2025. Counts follow Jonathan McDowell
 * / Space-Track-aligned year-in-review tallies as reported by SpaceNews,
 * BryceTech Year in Review, and Payload Space country scorecards. Starship
 * suborbital/test flights are excluded from the SpaceX orbital tally unless
 * noted. “China” aggregates CASC Long March plus Chinese commercial vehicles
 * (CASC remains the dominant Chinese operator). “Other” is residual.
 *
 * Headline: One operator (SpaceX) flew ~51% of worldwide orbital launches in
 * 2025, up from ~24% in 2020 — roughly a doubling of single-operator share
 * in five years, while absolute world cadence roughly tripled.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Orbital launch counts: SpaceNews analysis of BryceTech / Jonathan McDowell year-in-review data (2020–2025); Payload Space 2025 country scorecard (McDowell, 329 attempts / 321 successes); FAA AST commercial space transportation reports and Aerospace Forecast for U.S.-licensed activity; UCS Satellite Database for on-orbit constellation context (Starlink-driven payload counts). Mass-to-orbit shares are BryceTech / industry year-end estimates (±3 pp). Operator labels treat SpaceX as one commercial operator; Chinese state + commercial vehicles are shown as a China aggregate with a CASC vs commercial split where disclosed. Failures remain in attempt series unless a row is marked successful-only.";

export const SOURCES = [
  {
    label: "SpaceNews — SpaceX, China drive record orbital launches in 2025",
    url: "https://spacenews.com/spacex-china-drive-new-record-for-orbital-launches-in-2025/",
  },
  {
    label: "Payload Space — 2025 orbital launch attempts by country (McDowell)",
    url: "https://payloadspace.com/2025-orbital-launch-attempts-by-country/",
  },
  {
    label: "Jonathan McDowell — planet4589.org space activity reports",
    url: "https://planet4589.org/space/",
  },
  {
    label: "FAA Office of Commercial Space Transportation (AST)",
    url: "https://www.faa.gov/space",
  },
  {
    label: "UCS Satellite Database",
    url: "https://www.ucsusa.org/resources/satellite-database",
  },
  {
    label: "Space-Track.org — catalog / conjunction support (USSF)",
    url: "https://www.space-track.org/",
  },
] as const;

export const HEADLINE = {
  /** SpaceX share of worldwide orbital launches, 2025 vs 2020 */
  spacexShare2025Pct: 50.8,
  spacexShare2020Pct: 24.3,
  shareDeltaPp: 26.5,
  spacexLaunches2025: 165,
  spacexLaunches2020: 26,
  worldLaunches2025: 325,
  worldLaunches2020: 107,
  /** China aggregate attempts 2025 (CASC-led + commercial) */
  chinaLaunches2025: 92,
  chinaShare2025Pct: 28.3,
  /** US + China combined country share 2025 */
  usChinaShare2025Pct: 88,
  /** Mass-to-orbit estimate for SpaceX 2025 */
  spacexMassShare2025Pct: 80,
  rocketLab2025: 18,
  confidence: "disclosed" as Confidence,
};

/** Annual worldwide orbital cadence and leading-operator shares */
export type CadenceYearRow = {
  year: number;
  world: number;
  spacex: number;
  china: number;
  rocketLab: number;
  russia: number;
  other: number;
  spacexSharePct: number;
  chinaSharePct: number;
  confidence: Confidence;
};

export const ANNUAL_CADENCE: CadenceYearRow[] = [
  {
    year: 2020,
    world: 107,
    spacex: 26,
    china: 35,
    rocketLab: 7,
    russia: 12,
    other: 27,
    spacexSharePct: 24.3,
    chinaSharePct: 32.7,
    confidence: "disclosed",
  },
  {
    year: 2021,
    world: 135,
    spacex: 31,
    china: 55,
    rocketLab: 6,
    russia: 25,
    other: 18,
    spacexSharePct: 23.0,
    chinaSharePct: 40.7,
    confidence: "estimated",
  },
  {
    year: 2022,
    world: 186,
    spacex: 61,
    china: 64,
    rocketLab: 9,
    russia: 21,
    other: 31,
    spacexSharePct: 32.8,
    chinaSharePct: 34.4,
    confidence: "estimated",
  },
  {
    year: 2023,
    world: 223,
    spacex: 96,
    china: 67,
    rocketLab: 10,
    russia: 19,
    other: 31,
    spacexSharePct: 43.0,
    chinaSharePct: 30.0,
    confidence: "disclosed",
  },
  {
    year: 2024,
    world: 259,
    spacex: 134,
    china: 68,
    rocketLab: 16,
    russia: 17,
    other: 24,
    spacexSharePct: 51.7,
    chinaSharePct: 26.3,
    confidence: "disclosed",
  },
  {
    year: 2025,
    world: 325,
    spacex: 165,
    china: 92,
    rocketLab: 18,
    russia: 17,
    other: 33,
    spacexSharePct: 50.8,
    chinaSharePct: 28.3,
    confidence: "disclosed",
  },
];

/** Operator ladder — 2025 orbital attempts */
export type OperatorRow = {
  operator: string;
  short: string;
  launches: number;
  sharePct: number;
  massSharePct: number;
  region: "US" | "China" | "Russia" | "Europe" | "Other";
  role: "commercial" | "state" | "mixed";
  confidence: Confidence;
};

export const OPERATOR_2025: OperatorRow[] = [
  {
    operator: "SpaceX",
    short: "SpaceX",
    launches: 165,
    sharePct: 50.8,
    massSharePct: 80,
    region: "US",
    role: "commercial",
    confidence: "disclosed",
  },
  {
    operator: "CASC (Long March family)",
    short: "CASC",
    launches: 79,
    sharePct: 24.3,
    massSharePct: 12,
    region: "China",
    role: "state",
    confidence: "estimated",
  },
  {
    operator: "Chinese commercial (Galactic Energy, CAS Space, LandSpace, ExPace, others)",
    short: "CN commercial",
    launches: 13,
    sharePct: 4.0,
    massSharePct: 1.5,
    region: "China",
    role: "commercial",
    confidence: "estimated",
  },
  {
    operator: "Rocket Lab",
    short: "Rocket Lab",
    launches: 18,
    sharePct: 5.5,
    massSharePct: 0.4,
    region: "US",
    role: "commercial",
    confidence: "disclosed",
  },
  {
    operator: "Roscosmos",
    short: "Roscosmos",
    launches: 17,
    sharePct: 5.2,
    massSharePct: 3.5,
    region: "Russia",
    role: "state",
    confidence: "disclosed",
  },
  {
    operator: "ULA",
    short: "ULA",
    launches: 6,
    sharePct: 1.8,
    massSharePct: 1.2,
    region: "US",
    role: "commercial",
    confidence: "disclosed",
  },
  {
    operator: "ISRO",
    short: "ISRO",
    launches: 5,
    sharePct: 1.5,
    massSharePct: 0.8,
    region: "Other",
    role: "state",
    confidence: "estimated",
  },
  {
    operator: "Arianespace / ESA partners",
    short: "Europe",
    launches: 3,
    sharePct: 0.9,
    massSharePct: 0.6,
    region: "Europe",
    role: "mixed",
    confidence: "estimated",
  },
  {
    operator: "Blue Origin",
    short: "Blue Origin",
    launches: 2,
    sharePct: 0.6,
    massSharePct: 0.3,
    region: "US",
    role: "commercial",
    confidence: "disclosed",
  },
  {
    operator: "All other operators",
    short: "Other",
    launches: 17,
    sharePct: 5.2,
    massSharePct: 0.0,
    region: "Other",
    role: "mixed",
    confidence: "carried",
  },
];

/** Five-year delta — selected operators (2020 → 2025) */
export type DeltaRow = {
  operator: string;
  short: string;
  launches2020: number;
  launches2025: number;
  share2020Pct: number;
  share2025Pct: number;
  deltaPp: number;
  confidence: Confidence;
};

export const OPERATOR_DELTA: DeltaRow[] = [
  {
    operator: "SpaceX",
    short: "SpaceX",
    launches2020: 26,
    launches2025: 165,
    share2020Pct: 24.3,
    share2025Pct: 50.8,
    deltaPp: 26.5,
    confidence: "disclosed",
  },
  {
    operator: "China (all vehicles)",
    short: "China",
    launches2020: 35,
    launches2025: 92,
    share2020Pct: 32.7,
    share2025Pct: 28.3,
    deltaPp: -4.4,
    confidence: "disclosed",
  },
  {
    operator: "Rocket Lab",
    short: "Rocket Lab",
    launches2020: 7,
    launches2025: 18,
    share2020Pct: 6.5,
    share2025Pct: 5.5,
    deltaPp: -1.0,
    confidence: "disclosed",
  },
  {
    operator: "Roscosmos",
    short: "Roscosmos",
    launches2020: 12,
    launches2025: 17,
    share2020Pct: 11.2,
    share2025Pct: 5.2,
    deltaPp: -6.0,
    confidence: "estimated",
  },
  {
    operator: "ULA",
    short: "ULA",
    launches2020: 6,
    launches2025: 6,
    share2020Pct: 5.6,
    share2025Pct: 1.8,
    deltaPp: -3.8,
    confidence: "estimated",
  },
  {
    operator: "Arianespace / Europe",
    short: "Europe",
    launches2020: 10,
    launches2025: 3,
    share2020Pct: 9.3,
    share2025Pct: 0.9,
    deltaPp: -8.4,
    confidence: "estimated",
  },
];

/** Launch-count share vs mass-to-orbit share (2025) */
export type MassCadenceRow = {
  operator: string;
  short: string;
  launchSharePct: number;
  massSharePct: number;
  launches: number;
  confidence: Confidence;
};

export const MASS_VS_CADENCE: MassCadenceRow[] = [
  {
    operator: "SpaceX",
    short: "SpaceX",
    launchSharePct: 50.8,
    massSharePct: 80,
    launches: 165,
    confidence: "estimated",
  },
  {
    operator: "CASC",
    short: "CASC",
    launchSharePct: 24.3,
    massSharePct: 12,
    launches: 79,
    confidence: "estimated",
  },
  {
    operator: "Roscosmos",
    short: "Roscosmos",
    launchSharePct: 5.2,
    massSharePct: 3.5,
    launches: 17,
    confidence: "estimated",
  },
  {
    operator: "Rocket Lab",
    short: "Rocket Lab",
    launchSharePct: 5.5,
    massSharePct: 0.4,
    launches: 18,
    confidence: "estimated",
  },
  {
    operator: "ULA",
    short: "ULA",
    launchSharePct: 1.8,
    massSharePct: 1.2,
    launches: 6,
    confidence: "estimated",
  },
  {
    operator: "Europe",
    short: "Europe",
    launchSharePct: 0.9,
    massSharePct: 0.6,
    launches: 3,
    confidence: "estimated",
  },
];

/** US FAA-licensed / US-operator orbital mix, 2025 */
export type UsOperatorRow = {
  operator: string;
  launches: number;
  usSharePct: number;
  confidence: Confidence;
};

export const US_OPERATOR_MIX_2025: UsOperatorRow[] = [
  { operator: "SpaceX", launches: 165, usSharePct: 85.5, confidence: "disclosed" },
  { operator: "Rocket Lab (NZ + US pads)", launches: 18, usSharePct: 9.3, confidence: "disclosed" },
  { operator: "ULA", launches: 6, usSharePct: 3.1, confidence: "disclosed" },
  { operator: "Blue Origin", launches: 2, usSharePct: 1.0, confidence: "disclosed" },
  { operator: "Other US (Firefly, Northrop, etc.)", launches: 2, usSharePct: 1.0, confidence: "estimated" },
];

/** Stacked mix for area chart — share of world by bloc */
export type BlocMixRow = {
  year: number;
  spacex: number;
  china: number;
  russia: number;
  rocketLab: number;
  rest: number;
};

export const BLOC_MIX: BlocMixRow[] = ANNUAL_CADENCE.map((r) => ({
  year: r.year,
  spacex: r.spacex,
  china: r.china,
  russia: r.russia,
  rocketLab: r.rocketLab,
  rest: r.other,
}));

export const ANALYTICS = {
  worldGrowthMultiple: +(HEADLINE.worldLaunches2025 / HEADLINE.worldLaunches2020).toFixed(2),
  spacexGrowthMultiple: +(HEADLINE.spacexLaunches2025 / HEADLINE.spacexLaunches2020).toFixed(2),
  /** pp SpaceX gained while China lost share despite rising absolute launches */
  spacexGainVsChinaShareLossPp: +(HEADLINE.shareDeltaPp + 4.4).toFixed(1),
  topOperatorShare2025Pct: HEADLINE.spacexShare2025Pct,
  top2OperatorsShare2025Pct: +(50.8 + 24.3).toFixed(1),
  cadenceDaysPerLaunch2025: +(365 / HEADLINE.spacexLaunches2025).toFixed(2),
};
