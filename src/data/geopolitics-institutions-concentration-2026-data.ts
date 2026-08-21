/**
 * Institutions & governance — concentration lens (Top-1 / Top-3 / Top-5).
 * Core question: How concentrated is authority at the top of the distribution?
 *
 * Complements research (vote vs GDP gaps) and update (consent clock) posts.
 *
 * Primary sources:
 * - IMF Members' Quotas and Voting Power (post-16th GRQ relative shares)
 * - World Bank IBRD Voting Power
 * - UN Charter Art. 23 / Art. 27 (UNSC composition & veto)
 * - WEO PPP GDP anchors for representation-gap panels
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "IMF and IBRD voting shares from official member quota/subscription tables (relative shares post-16th General Review design). UNSC permanent seats and veto follow UN Charter. GDP (PPP) shares are WEO anchors used for gap panels — rounded to 0.1 pp. Top-k ladders and HHI are derived from disclosed vote shares; residual buckets are analytical.";

export const IMF_QUOTAS_URL =
  "https://www.imf.org/en/About/executive-board/members-quotas";
export const IBRD_VOTES_URL =
  "https://www.worldbank.org/en/about/leadership/votingpowers";
export const UNSC_URL = "https://www.un.org/securitycouncil/";

export const HEADLINE = {
  /** IMF Top-1 vote share */
  imfTop1SharePct: 16.5,
  imfTop1Label: "United States",
  /** IMF Top-3: US + Japan + China */
  imfTop3SharePct: 28.7,
  /** IMF Top-5: + Germany + France/UK (FR+UK tied; use DE+FR as 4–5) */
  imfTop5SharePct: 40.0,
  ibrdTop1SharePct: 15.8,
  ibrdTop3SharePct: 28.5,
  ibrdTop5SharePct: 40.2,
  /** P5 share of UNSC veto power */
  unscVetoTop5SharePct: 100,
  /** P5 seats as share of 15-member Council */
  unscSeatSharePct: 33.3,
  imfSpecialMajorityPct: 85,
  imfBlockThresholdPct: 15,
  usAloneBlocksSpecialMajority: true,
  imfMembers: 190,
  imfChairs: 24,
  /** Approximate HHI from top disclosed + residual (0–10,000 scale) */
  imfVoteHhi: 520,
  chinaGdpPppPct: 18.7,
  usGdpPppPct: 15.5,
  chinaImfGapPp: -12.6,
  usImfGapPp: 1.0,
} as const;

export type VoteShareRow = {
  rank: number;
  id: string;
  name: string;
  short: string;
  region: "Americas" | "Europe" | "Asia-Pacific" | "Africa" | "Middle East";
  imfVotePct: number;
  ibrdVotePct: number;
  gdpPppPct: number;
  cumulativeImfPct: number;
  cumulativeIbrdPct: number;
  unscPermanent: boolean;
  confidence: Confidence;
  fill: string;
};

/** Ranked IMF vote ladder — concentration distribution */
export const VOTE_SHARES: VoteShareRow[] = [
  {
    rank: 1,
    id: "us",
    name: "United States",
    short: "US",
    region: "Americas",
    imfVotePct: 16.5,
    ibrdVotePct: 15.8,
    gdpPppPct: 15.5,
    cumulativeImfPct: 16.5,
    cumulativeIbrdPct: 15.8,
    unscPermanent: true,
    confidence: "disclosed",
    fill: "#0ea5e9",
  },
  {
    rank: 2,
    id: "jp",
    name: "Japan",
    short: "Japan",
    region: "Asia-Pacific",
    imfVotePct: 6.1,
    ibrdVotePct: 6.8,
    gdpPppPct: 3.7,
    cumulativeImfPct: 22.6,
    cumulativeIbrdPct: 22.6,
    unscPermanent: false,
    confidence: "disclosed",
    fill: "#f59e0b",
  },
  {
    rank: 3,
    id: "cn",
    name: "China",
    short: "China",
    region: "Asia-Pacific",
    imfVotePct: 6.1,
    ibrdVotePct: 5.9,
    gdpPppPct: 18.7,
    cumulativeImfPct: 28.7,
    cumulativeIbrdPct: 28.5,
    unscPermanent: true,
    confidence: "disclosed",
    fill: "#f43f5e",
  },
  {
    rank: 4,
    id: "de",
    name: "Germany",
    short: "Germany",
    region: "Europe",
    imfVotePct: 5.3,
    ibrdVotePct: 4.0,
    gdpPppPct: 3.4,
    cumulativeImfPct: 34.0,
    cumulativeIbrdPct: 32.5,
    unscPermanent: false,
    confidence: "disclosed",
    fill: "#8b5cf6",
  },
  {
    rank: 5,
    id: "fr",
    name: "France",
    short: "France",
    region: "Europe",
    imfVotePct: 4.0,
    ibrdVotePct: 3.8,
    gdpPppPct: 2.4,
    cumulativeImfPct: 38.0,
    cumulativeIbrdPct: 36.3,
    unscPermanent: true,
    confidence: "disclosed",
    fill: "#14b8a6",
  },
  {
    rank: 6,
    id: "uk",
    name: "United Kingdom",
    short: "UK",
    region: "Europe",
    imfVotePct: 4.0,
    ibrdVotePct: 3.8,
    gdpPppPct: 2.3,
    cumulativeImfPct: 42.0,
    cumulativeIbrdPct: 40.1,
    unscPermanent: true,
    confidence: "disclosed",
    fill: "#64748b",
  },
  {
    rank: 7,
    id: "it",
    name: "Italy",
    short: "Italy",
    region: "Europe",
    imfVotePct: 3.0,
    ibrdVotePct: 2.6,
    gdpPppPct: 2.0,
    cumulativeImfPct: 45.0,
    cumulativeIbrdPct: 42.7,
    unscPermanent: false,
    confidence: "disclosed",
    fill: "#a78bfa",
  },
  {
    rank: 8,
    id: "in",
    name: "India",
    short: "India",
    region: "Asia-Pacific",
    imfVotePct: 2.6,
    ibrdVotePct: 3.0,
    gdpPppPct: 7.9,
    cumulativeImfPct: 47.6,
    cumulativeIbrdPct: 45.7,
    unscPermanent: false,
    confidence: "disclosed",
    fill: "#fb923c",
  },
  {
    rank: 9,
    id: "ru",
    name: "Russia",
    short: "Russia",
    region: "Europe",
    imfVotePct: 2.6,
    ibrdVotePct: 2.8,
    gdpPppPct: 3.0,
    cumulativeImfPct: 50.2,
    cumulativeIbrdPct: 48.5,
    unscPermanent: true,
    confidence: "disclosed",
    fill: "#e11d48",
  },
  {
    rank: 10,
    id: "br",
    name: "Brazil",
    short: "Brazil",
    region: "Americas",
    imfVotePct: 2.2,
    ibrdVotePct: 2.1,
    gdpPppPct: 2.4,
    cumulativeImfPct: 52.4,
    cumulativeIbrdPct: 50.6,
    unscPermanent: false,
    confidence: "disclosed",
    fill: "#22c55e",
  },
];

export type TopKLadder = {
  k: number;
  label: string;
  imfSharePct: number;
  ibrdSharePct: number;
  note: string;
};

export const TOP_K_LADDER: TopKLadder[] = [
  {
    k: 1,
    label: "Top-1",
    imfSharePct: 16.5,
    ibrdSharePct: 15.8,
    note: "US alone",
  },
  {
    k: 3,
    label: "Top-3",
    imfSharePct: 28.7,
    ibrdSharePct: 28.5,
    note: "US + Japan + China",
  },
  {
    k: 5,
    label: "Top-5",
    imfSharePct: 40.0,
    ibrdSharePct: 40.2,
    note: "US+JP+CN+DE+FR (IMF); US+JP+CN+DE+UK (IBRD)",
  },
  {
    k: 10,
    label: "Top-10",
    imfSharePct: 52.4,
    ibrdSharePct: 50.6,
    note: "Half of vote weight in ten chairs",
  },
];

/** Lorenz-style cumulative IMF vote vs equal-member split */
export type ConcentrationPoint = {
  rank: number;
  label: string;
  cumulativeVotePct: number;
  equalSplitPct: number;
};

export const CONCENTRATION_CURVE: ConcentrationPoint[] = [
  { rank: 0, label: "0", cumulativeVotePct: 0, equalSplitPct: 0 },
  { rank: 1, label: "1", cumulativeVotePct: 16.5, equalSplitPct: 10 },
  { rank: 2, label: "2", cumulativeVotePct: 22.6, equalSplitPct: 20 },
  { rank: 3, label: "3", cumulativeVotePct: 28.7, equalSplitPct: 30 },
  { rank: 4, label: "4", cumulativeVotePct: 34.0, equalSplitPct: 40 },
  { rank: 5, label: "5", cumulativeVotePct: 38.0, equalSplitPct: 50 },
  { rank: 6, label: "6", cumulativeVotePct: 42.0, equalSplitPct: 60 },
  { rank: 7, label: "7", cumulativeVotePct: 45.0, equalSplitPct: 70 },
  { rank: 8, label: "8", cumulativeVotePct: 47.6, equalSplitPct: 80 },
  { rank: 9, label: "9", cumulativeVotePct: 50.2, equalSplitPct: 90 },
  { rank: 10, label: "10", cumulativeVotePct: 52.4, equalSplitPct: 100 },
];

export type InstitutionCompare = {
  id: string;
  institution: string;
  short: string;
  top1Pct: number;
  top3Pct: number;
  top5Pct: number;
  decisionRule: string;
  powerNote: string;
  fill: string;
};

/** Cross-institution concentration comparison */
export const INSTITUTION_COMPARE: InstitutionCompare[] = [
  {
    id: "imf",
    institution: "IMF (voting power)",
    short: "IMF",
    top1Pct: 16.5,
    top3Pct: 28.7,
    top5Pct: 40.0,
    decisionRule: "85% special majority",
    powerNote: "US alone above 15% blocking threshold",
    fill: "#0ea5e9",
  },
  {
    id: "ibrd",
    institution: "World Bank IBRD",
    short: "IBRD",
    top1Pct: 15.8,
    top3Pct: 28.5,
    top5Pct: 40.2,
    decisionRule: "75% SCI / 85% amendment",
    powerNote: "Share hierarchy frozen post-2018 SCI talks",
    fill: "#14b8a6",
  },
  {
    id: "unsc-veto",
    institution: "UNSC veto power",
    short: "UNSC veto",
    top1Pct: 20,
    top3Pct: 60,
    top5Pct: 100,
    decisionRule: "Any P5 negative vote blocks",
    powerNote: "Five states hold 100% of veto authority",
    fill: "#f43f5e",
  },
  {
    id: "unsc-seats",
    institution: "UNSC seats (15)",
    short: "UNSC seats",
    top1Pct: 6.7,
    top3Pct: 20,
    top5Pct: 33.3,
    decisionRule: "9/15 affirmative + no P5 veto",
    powerNote: "P5 = 33% of seats, 100% of vetoes",
    fill: "#8b5cf6",
  },
];

export type RegionBucket = {
  id: string;
  region: string;
  short: string;
  imfVotePct: number;
  gdpPppPct: number;
  fill: string;
};

/** Approximate regional IMF vote vs PPP GDP clusters among tracked majors */
export const REGION_BUCKETS: RegionBucket[] = [
  {
    id: "americas",
    region: "Americas (US+BR+CA+MX)",
    short: "Americas",
    imfVotePct: 22.7,
    gdpPppPct: 21.1,
    fill: "#0ea5e9",
  },
  {
    id: "europe",
    region: "Europe (DE+FR+UK+IT+ES+NL+RU)",
    short: "Europe",
    imfVotePct: 22.6,
    gdpPppPct: 13.4,
    fill: "#8b5cf6",
  },
  {
    id: "asia",
    region: "Asia-Pacific (JP+CN+IN+KR+AU+ID)",
    short: "Asia-Pac",
    imfVotePct: 18.9,
    gdpPppPct: 35.8,
    fill: "#f59e0b",
  },
  {
    id: "me-af",
    region: "Middle East & Africa (SA+TR+ZA+…)",
    short: "ME+Afr",
    imfVotePct: 3.5,
    gdpPppPct: 3.9,
    fill: "#f43f5e",
  },
  {
    id: "rest",
    region: "Rest of membership",
    short: "Rest",
    imfVotePct: 32.3,
    gdpPppPct: 25.8,
    fill: "#64748b",
  },
];

export type GapScatterPoint = {
  id: string;
  name: string;
  short: string;
  imfVotePct: number;
  gdpPppPct: number;
  gapPp: number;
  region: VoteShareRow["region"];
  fill: string;
};

export const GAP_SCATTER: GapScatterPoint[] = VOTE_SHARES.map((m) => ({
  id: m.id,
  name: m.name,
  short: m.short,
  imfVotePct: m.imfVotePct,
  gdpPppPct: m.gdpPppPct,
  gapPp: Math.round((m.imfVotePct - m.gdpPppPct) * 10) / 10,
  region: m.region,
  fill: m.fill,
}));

export type VetoYear = {
  year: number;
  us: number;
  ru: number;
  cn: number;
  uk: number;
  fr: number;
  total: number;
};

/** Recent UNSC veto counts — concentration of negative power in practice */
export const VETO_SERIES: VetoYear[] = [
  { year: 2018, us: 1, ru: 4, cn: 1, uk: 0, fr: 0, total: 6 },
  { year: 2019, us: 1, ru: 3, cn: 1, uk: 0, fr: 0, total: 5 },
  { year: 2020, us: 1, ru: 3, cn: 1, uk: 0, fr: 0, total: 5 },
  { year: 2021, us: 1, ru: 2, cn: 1, uk: 0, fr: 0, total: 4 },
  { year: 2022, us: 0, ru: 3, cn: 1, uk: 0, fr: 0, total: 4 },
  { year: 2023, us: 0, ru: 2, cn: 1, uk: 0, fr: 0, total: 3 },
  { year: 2024, us: 2, ru: 3, cn: 1, uk: 0, fr: 0, total: 6 },
];

export type BlockingPower = {
  id: string;
  label: string;
  votePct: number;
  canBlockAlone: boolean;
  note: string;
  fill: string;
};

/** Who can block an 85% IMF special majority alone or in minimal coalition */
export const BLOCKING_POWER: BlockingPower[] = [
  {
    id: "us",
    label: "United States",
    votePct: 16.5,
    canBlockAlone: true,
    note: "Sole shareholder above 15% block threshold",
    fill: "#0ea5e9",
  },
  {
    id: "jp-cn",
    label: "Japan + China",
    votePct: 12.2,
    canBlockAlone: false,
    note: "Need a third major (~3+ pp) to clear 15%",
    fill: "#f59e0b",
  },
  {
    id: "eu5",
    label: "DE+FR+UK+IT+ES",
    votePct: 18.2,
    canBlockAlone: true,
    note: "European cluster exceeds block threshold as a bloc",
    fill: "#8b5cf6",
  },
  {
    id: "brics",
    label: "CN+IN+BR+RU+ZA",
    votePct: 14.1,
    canBlockAlone: false,
    note: "Just shy of solo block; needs one more mid-weight",
    fill: "#f43f5e",
  },
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
