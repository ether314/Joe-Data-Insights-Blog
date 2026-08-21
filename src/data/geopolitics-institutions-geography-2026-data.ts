/**
 * Institutions & governance — geography lens (regional / country shares).
 * Core question: Where does formal authority sit geographically?
 *
 * Complements concentration (Top-k/HHI) and research (vote-vs-GDP gaps by member).
 *
 * Primary sources:
 * - IMF Members' Quotas and Voting Power (post-16th GRQ relative shares)
 * - World Bank IBRD Voting Power
 * - UN Charter Art. 23 / Art. 27 (UNSC composition & veto)
 * - WEO PPP GDP anchors for representation-gap panels
 */

export type Confidence = "disclosed" | "estimated" | "analytical";
export type Region =
  | "Americas"
  | "Europe"
  | "Asia-Pacific"
  | "Africa"
  | "Middle East"
  | "Other";

export const SOURCE_NOTE =
  "IMF and IBRD voting shares from official member quota/subscription tables (relative shares post-16th General Review design). UNSC permanent seats and veto follow UN Charter. GDP (PPP) shares are WEO anchors used for gap panels — rounded to 0.1 pp. Regional aggregates re-bucket disclosed country rows among tracked majors plus an analytical residual; they are not official IMF constituency totals. Geography answers *where* authority sits — pair with concentration posts for Top-k / HHI.";

export const IMF_QUOTAS_URL =
  "https://www.imf.org/en/About/executive-board/members-quotas";
export const IBRD_VOTES_URL =
  "https://www.worldbank.org/en/about/leadership/votingpowers";
export const UNSC_URL = "https://www.un.org/securitycouncil/";

/** Headline meters for cards and post lede */
export const HEADLINE = {
  /** Asia-Pac majors: IMF vote vs PPP GDP gap */
  asiaPacImfVotePct: 18.9,
  asiaPacGdpPppPct: 35.8,
  asiaPacGapPp: -16.9,
  europeImfVotePct: 22.6,
  europeGdpPppPct: 13.4,
  europeGapPp: 9.2,
  americasImfVotePct: 22.7,
  americasGdpPppPct: 21.1,
  /** Europe P5 seats / 5 */
  europeP5Seats: 3,
  europeP5SharePct: 60,
  /** Africa + Middle East permanent seats */
  africaMeP5Seats: 0,
  /** Russia share of 2018–2024 veto uses (illustrative stack) */
  russiaVetoSharePct: 61,
  /** US share of IMF votes (Americas tip) */
  usImfSharePct: 16.5,
  usAmericasTipPct: 72.7,
  imfSpecialMajorityPct: 85,
  imfBlockThresholdPct: 15,
} as const;

const FILL = {
  Americas: "#0ea5e9",
  Europe: "#8b5cf6",
  "Asia-Pacific": "#f59e0b",
  Africa: "#f43f5e",
  "Middle East": "#14b8a6",
  Other: "#64748b",
  US: "#38bdf8",
  JP: "#fbbf24",
  CN: "#fb7185",
  DE: "#a78bfa",
  FR: "#2dd4bf",
  UK: "#94a3b8",
  IN: "#fb923c",
  RU: "#e11d48",
  BR: "#22c55e",
  IT: "#c4b5fd",
} as const;

export type RegionShare = {
  id: string;
  region: Region;
  label: string;
  short: string;
  imfVotePct: number;
  ibrdVotePct: number;
  gdpPppPct: number;
  gapImfPp: number;
  membersNote: string;
  confidence: Confidence;
  fill: string;
};

/**
 * Regional vote / GDP geography among tracked majors + residual.
 * Gap = IMF vote % − PPP GDP % (positive = over-weighted on votes).
 */
export const REGION_SHARES: RegionShare[] = [
  {
    id: "americas",
    region: "Americas",
    label: "Americas (US+BR+CA+MX tip)",
    short: "Americas",
    imfVotePct: 22.7,
    ibrdVotePct: 21.5,
    gdpPppPct: 21.1,
    gapImfPp: 1.6,
    membersNote: "US alone ~16.5 pp of Fund votes",
    confidence: "analytical",
    fill: FILL.Americas,
  },
  {
    id: "europe",
    region: "Europe",
    label: "Europe (DE+FR+UK+IT+ES+NL+RU tip)",
    short: "Europe",
    imfVotePct: 22.6,
    ibrdVotePct: 21.8,
    gdpPppPct: 13.4,
    gapImfPp: 9.2,
    membersNote: "Largest positive vote−GDP gap among majors",
    confidence: "analytical",
    fill: FILL.Europe,
  },
  {
    id: "asia",
    region: "Asia-Pacific",
    label: "Asia-Pacific (JP+CN+IN+KR+AU+ID tip)",
    short: "Asia-Pac",
    imfVotePct: 18.9,
    ibrdVotePct: 20.4,
    gdpPppPct: 35.8,
    gapImfPp: -16.9,
    membersNote: "Largest negative vote−GDP gap among majors",
    confidence: "analytical",
    fill: FILL["Asia-Pacific"],
  },
  {
    id: "me-af",
    region: "Middle East",
    label: "Middle East & Africa tip",
    short: "ME+Afr",
    imfVotePct: 3.5,
    ibrdVotePct: 3.8,
    gdpPppPct: 3.9,
    gapImfPp: -0.4,
    membersNote: "Thin tip; zero UNSC permanent seats",
    confidence: "analytical",
    fill: FILL["Middle East"],
  },
  {
    id: "rest",
    region: "Other",
    label: "Rest of membership",
    short: "Rest",
    imfVotePct: 32.3,
    ibrdVotePct: 32.5,
    gdpPppPct: 25.8,
    gapImfPp: 6.5,
    membersNote: "Multi-chair residual — not a single polity",
    confidence: "analytical",
    fill: FILL.Other,
  },
];

export type CountryGeo = {
  id: string;
  name: string;
  short: string;
  region: Region;
  imfVotePct: number;
  ibrdVotePct: number;
  gdpPppPct: number;
  gapImfPp: number;
  unscPermanent: boolean;
  confidence: Confidence;
  fill: string;
};

/** Ranked country geography for share bars and scatter */
export const COUNTRY_GEO: CountryGeo[] = [
  {
    id: "us",
    name: "United States",
    short: "US",
    region: "Americas",
    imfVotePct: 16.5,
    ibrdVotePct: 15.8,
    gdpPppPct: 15.5,
    gapImfPp: 1.0,
    unscPermanent: true,
    confidence: "disclosed",
    fill: FILL.US,
  },
  {
    id: "jp",
    name: "Japan",
    short: "Japan",
    region: "Asia-Pacific",
    imfVotePct: 6.1,
    ibrdVotePct: 6.8,
    gdpPppPct: 3.7,
    gapImfPp: 2.4,
    unscPermanent: false,
    confidence: "disclosed",
    fill: FILL.JP,
  },
  {
    id: "cn",
    name: "China",
    short: "China",
    region: "Asia-Pacific",
    imfVotePct: 6.1,
    ibrdVotePct: 5.9,
    gdpPppPct: 18.7,
    gapImfPp: -12.6,
    unscPermanent: true,
    confidence: "disclosed",
    fill: FILL.CN,
  },
  {
    id: "de",
    name: "Germany",
    short: "Germany",
    region: "Europe",
    imfVotePct: 5.3,
    ibrdVotePct: 4.0,
    gdpPppPct: 3.4,
    gapImfPp: 1.9,
    unscPermanent: false,
    confidence: "disclosed",
    fill: FILL.DE,
  },
  {
    id: "fr",
    name: "France",
    short: "France",
    region: "Europe",
    imfVotePct: 4.0,
    ibrdVotePct: 3.8,
    gdpPppPct: 2.4,
    gapImfPp: 1.6,
    unscPermanent: true,
    confidence: "disclosed",
    fill: FILL.FR,
  },
  {
    id: "uk",
    name: "United Kingdom",
    short: "UK",
    region: "Europe",
    imfVotePct: 4.0,
    ibrdVotePct: 3.8,
    gdpPppPct: 2.3,
    gapImfPp: 1.7,
    unscPermanent: true,
    confidence: "disclosed",
    fill: FILL.UK,
  },
  {
    id: "it",
    name: "Italy",
    short: "Italy",
    region: "Europe",
    imfVotePct: 3.0,
    ibrdVotePct: 2.6,
    gdpPppPct: 2.0,
    gapImfPp: 1.0,
    unscPermanent: false,
    confidence: "disclosed",
    fill: FILL.IT,
  },
  {
    id: "in",
    name: "India",
    short: "India",
    region: "Asia-Pacific",
    imfVotePct: 2.6,
    ibrdVotePct: 3.0,
    gdpPppPct: 7.9,
    gapImfPp: -5.3,
    unscPermanent: false,
    confidence: "disclosed",
    fill: FILL.IN,
  },
  {
    id: "ru",
    name: "Russia",
    short: "Russia",
    region: "Europe",
    imfVotePct: 2.6,
    ibrdVotePct: 2.8,
    gdpPppPct: 3.0,
    gapImfPp: -0.4,
    unscPermanent: true,
    confidence: "disclosed",
    fill: FILL.RU,
  },
  {
    id: "br",
    name: "Brazil",
    short: "Brazil",
    region: "Americas",
    imfVotePct: 2.2,
    ibrdVotePct: 2.1,
    gdpPppPct: 2.4,
    gapImfPp: -0.2,
    unscPermanent: false,
    confidence: "disclosed",
    fill: FILL.BR,
  },
];

export type GapDumbbell = {
  id: string;
  short: string;
  region: Region;
  votePct: number;
  gdpPct: number;
  gapPp: number;
  fill: string;
};

/** Regional vote↔GDP dumbbells (majors tip, excludes Rest residual for clarity) */
export const REGION_DUMBBELLS: GapDumbbell[] = REGION_SHARES.filter(
  (r) => r.id !== "rest",
).map((r) => ({
  id: r.id,
  short: r.short,
  region: r.region,
  votePct: r.imfVotePct,
  gdpPct: r.gdpPppPct,
  gapPp: r.gapImfPp,
  fill: r.fill,
}));

export type UnscSeatGeo = {
  id: string;
  label: string;
  region: Region;
  permanentSeats: number;
  shareOfP5Pct: number;
  electedTypicalNote: string;
  fill: string;
};

/** Where permanent Council authority sits on the map */
export const UNSC_SEAT_GEO: UnscSeatGeo[] = [
  {
    id: "europe-p5",
    label: "Europe (FR+UK+RU)",
    region: "Europe",
    permanentSeats: 3,
    shareOfP5Pct: 60,
    electedTypicalNote: "Also rotates Western/Eastern Europe elected seats",
    fill: FILL.Europe,
  },
  {
    id: "americas-p5",
    label: "Americas (US)",
    region: "Americas",
    permanentSeats: 1,
    shareOfP5Pct: 20,
    electedTypicalNote: "Latin America & Caribbean elected seats rotate",
    fill: FILL.Americas,
  },
  {
    id: "asia-p5",
    label: "Asia-Pacific (CN)",
    region: "Asia-Pacific",
    permanentSeats: 1,
    shareOfP5Pct: 20,
    electedTypicalNote: "Asia-Pacific elected seats rotate; Japan/India absent from P5",
    fill: FILL["Asia-Pacific"],
  },
  {
    id: "africa-p5",
    label: "Africa",
    region: "Africa",
    permanentSeats: 0,
    shareOfP5Pct: 0,
    electedTypicalNote: "Three elected African seats; zero permanent / veto",
    fill: FILL.Africa,
  },
  {
    id: "me-p5",
    label: "Middle East",
    region: "Middle East",
    permanentSeats: 0,
    shareOfP5Pct: 0,
    electedTypicalNote: "No permanent seat; occasional elected presence",
    fill: FILL["Middle East"],
  },
];

export type VetoPractice = {
  id: string;
  name: string;
  short: string;
  region: Region;
  vetoes2018_2024: number;
  sharePct: number;
  fill: string;
};

/** 2018–2024 illustrative veto-use geography (practice ≠ latent power) */
export const VETO_PRACTICE: VetoPractice[] = [
  {
    id: "ru",
    name: "Russia",
    short: "Russia",
    region: "Europe",
    vetoes2018_2024: 20,
    sharePct: 60.6,
    fill: FILL.RU,
  },
  {
    id: "us",
    name: "United States",
    short: "US",
    region: "Americas",
    vetoes2018_2024: 6,
    sharePct: 18.2,
    fill: FILL.US,
  },
  {
    id: "cn",
    name: "China",
    short: "China",
    region: "Asia-Pacific",
    vetoes2018_2024: 7,
    sharePct: 21.2,
    fill: FILL.CN,
  },
  {
    id: "uk",
    name: "United Kingdom",
    short: "UK",
    region: "Europe",
    vetoes2018_2024: 0,
    sharePct: 0,
    fill: FILL.UK,
  },
  {
    id: "fr",
    name: "France",
    short: "France",
    region: "Europe",
    vetoes2018_2024: 0,
    sharePct: 0,
    fill: FILL.FR,
  },
];

export type HqGeo = {
  id: string;
  institution: string;
  short: string;
  city: string;
  region: Region;
  authorityNote: string;
  fill: string;
};

/** Institutional HQ geography — where the buildings (and boardrooms) sit */
export const HQ_GEOGRAPHY: HqGeo[] = [
  {
    id: "imf",
    institution: "IMF HQ",
    short: "IMF",
    city: "Washington, DC",
    region: "Americas",
    authorityNote: "190 members; 24 chairs; US host + Top-1 vote",
    fill: FILL.Americas,
  },
  {
    id: "ibrd",
    institution: "World Bank Group HQ",
    short: "WBG",
    city: "Washington, DC",
    region: "Americas",
    authorityNote: "Twin Bretton Woods campus; IBRD voice hierarchy",
    fill: "#0284c7",
  },
  {
    id: "un-hq",
    institution: "UN Headquarters",
    short: "UN HQ",
    city: "New York",
    region: "Americas",
    authorityNote: "General Assembly + Secretariat; Council meets here",
    fill: "#0369a1",
  },
  {
    id: "unog",
    institution: "UN Office at Geneva",
    short: "Geneva",
    city: "Geneva",
    region: "Europe",
    authorityNote: "Human rights / disarmament cluster; European diplomatic hub",
    fill: FILL.Europe,
  },
  {
    id: "wto",
    institution: "WTO HQ",
    short: "WTO",
    city: "Geneva",
    region: "Europe",
    authorityNote: "Trade rules campus; consensus geography ≠ Fund votes",
    fill: "#7c3aed",
  },
  {
    id: "adb",
    institution: "Asian Development Bank HQ",
    short: "ADB",
    city: "Manila",
    region: "Asia-Pacific",
    authorityNote: "Regional MDB; Japan-weighted voice vs IMF Asia under-weight",
    fill: FILL["Asia-Pacific"],
  },
];

export type MeterCompare = {
  id: string;
  label: string;
  short: string;
  sharePct: number;
  note: string;
  fill: string;
};

/** Cross-meter regional / country share ladder for compare panel */
export const METER_COMPARE: MeterCompare[] = [
  {
    id: "eu-imf",
    label: "Europe IMF vote (majors tip)",
    short: "EU votes",
    sharePct: 22.6,
    note: "On ~13.4% PPP GDP",
    fill: FILL.Europe,
  },
  {
    id: "am-imf",
    label: "Americas IMF vote (majors tip)",
    short: "AM votes",
    sharePct: 22.7,
    note: "Near GDP parity; US-led",
    fill: FILL.Americas,
  },
  {
    id: "apac-imf",
    label: "Asia-Pac IMF vote (majors tip)",
    short: "AP votes",
    sharePct: 18.9,
    note: "On ~35.8% PPP GDP",
    fill: FILL["Asia-Pacific"],
  },
  {
    id: "eu-p5",
    label: "Europe share of P5 seats",
    short: "EU P5",
    sharePct: 60,
    note: "3 of 5 permanent seats",
    fill: "#a78bfa",
  },
  {
    id: "ru-veto",
    label: "Russia share of 2018–24 vetoes",
    short: "RU veto",
    sharePct: 60.6,
    note: "Practice concentration inside P5",
    fill: FILL.RU,
  },
  {
    id: "us-am",
    label: "US share of Americas IMF tip",
    short: "US/AM",
    sharePct: 72.7,
    note: "16.5 / 22.7 among tip",
    fill: FILL.US,
  },
];

export const REGION_FILTERS: { id: "all" | Region; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "Americas", label: "Americas" },
  { id: "Europe", label: "Europe" },
  { id: "Asia-Pacific", label: "Asia-Pacific" },
  { id: "Africa", label: "Africa" },
  { id: "Middle East", label: "Middle East" },
];

export const SOURCES = [
  { label: "IMF — Members' Quotas and Voting Power", url: IMF_QUOTAS_URL },
  { label: "World Bank — IBRD Voting Power", url: IBRD_VOTES_URL },
  { label: "UN Security Council", url: UNSC_URL },
];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} pp`;
}

export function countriesForRegion(region: "all" | Region): CountryGeo[] {
  if (region === "all") return COUNTRY_GEO;
  return COUNTRY_GEO.filter((c) => c.region === region);
}
