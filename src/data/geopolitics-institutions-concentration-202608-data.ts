/**
 * Institutions & governance — August 202608 concentration lens (Top-1 / Top-3 / HHI).
 *
 * Core question: How concentrated is this system at the top of the distribution?
 * (How do power structures and institutions allocate authority?)
 *
 * Vintage delta vs geopolitics-institutions-concentration-2026q3:
 * 1. Tip still frozen — IMF Top-1 16.5% / Top-3 28.7% / Top-5 40% (no relative-share move)
 * 2. Consent flat mid-window — quota 76.66% (−8.34 pp to 85%); NAB 83.9%; Δ vs Apr = 0 pp
 * 3. Clock compression — 87 days to 15 Nov 2026; 54.5% of extension window elapsed
 * 4. Diriyah Guiding Principles (PP 2026/013) — reform path exists; tip weights unchanged
 * 5. IBRD stock as of 30 Jun 2026 — twin hierarchy confirmed; SCI still without US-scale support
 */

export type Confidence = "disclosed" | "estimated" | "carried" | "restated";

export const SOURCE_NOTE =
  "August 202608 concentration lens. Vote shares: IMF/IBRD official member tables — carried (relative shares frozen pending 16th GRQ effectiveness). Consent: IMF Policy Paper 2026/017 levels carried into mid-window (no superseding consent ledger by 20 Aug 2026); clock as of 20 Aug 2026 → 15 Nov 2026. Diriyah Guiding Principles: PP 2026/013. IBRD voting powers as of 30 Jun 2026 (WBG Finances). UNSC composition/veto: UN Charter; veto-use series from public Security Council documentation. PPP GDP anchors: WEO-style gaps rounded to 0.1 pp. HHI/Lorenz among top ten are analytical derivatives, not Fund-published indices.";

export const SOURCES = [
  {
    label: "Q3 concentration print",
    url: "/blog/geopolitics-institutions-concentration-2026q3",
  },
  {
    label: "August mid-window institutions update",
    url: "/blog/geopolitics-institutions-update-202608",
  },
  {
    label: "2026 concentration print",
    url: "/blog/geopolitics-institutions-concentration-2026",
  },
  {
    label: "Institutions & governance research ledger",
    url: "/blog/geopolitics-institutions-research-2026",
  },
  {
    label: "IMF — Extension of Consent Period (PP 2026/017)",
    url: "https://www.imf.org/en/publications/policy-papers/issues/2026/05/13/extension-of-the-period-for-consent-to-increase-quotas-under-the-sixteenth-general-review-576053",
  },
  {
    label: "IMF — Diriyah Guiding Principles (PP 2026/013)",
    url: "https://www.imf.org/en/publications/policy-papers/issues/2026/04/30/diriyah-guiding-principles-on-imf-quota-and-governance-reforms-575776",
  },
  {
    label: "IMF — Members' Quotas and Voting Power",
    url: "https://www.imf.org/en/About/executive-board/members-quotas",
  },
] as const;

export const AS_OF = {
  priorConcentration: "2026-04-29",
  priorLabel: "Q3 concentration (Apr 2026)",
  clockAsOf: "2026-08-20",
  clockLabel: "Aug 20 2026",
  ibrdAsOf: "2026-06-30",
  consentDeadline: "2026-11-15",
} as const;

/** Headline — frozen tip + flat consent + compressing clock */
export const HEADLINE = {
  imfTop1Pct: 16.5,
  imfTop1Label: "United States",
  imfTop3Pct: 28.7,
  imfTop3Labels: "US + Japan + China",
  imfTop5Pct: 40.0,
  imfTop10Pct: 52.4,
  ibrdTop1Pct: 15.8,
  ibrdTop3Pct: 28.5,
  ibrdTop5Pct: 40.2,
  imfSpecialMajorityPct: 85,
  imfBlockThresholdPct: 15,
  usAloneBlocks: true,
  imfVoteHhiTop10: 520,
  equalTenHhi: 1000,

  /** Consent vintage (Aug mid-window — flat vs Q3) */
  quotaConsentPct: 76.66,
  priorQuotaConsentPct: 76.66,
  q3QuotaConsentPct: 76.66,
  oct2025QuotaConsentPct: 72.78,
  quotaDeltaPpVsQ3: 0,
  quotaDeltaPpVsOct: 3.88,
  quotaGapPp: -8.34,
  priorQuotaGapPp: -8.34,
  quotaThresholdPct: 85,
  quotaMembersConsented: 149,
  quotaMembersPending: 42,
  nabConsentPct: 83.9,
  nabGapPp: -6.1,
  nabThresholdPct: 90,
  consentDeadline: "2026-11-15",
  usConsented: false,
  chinaConsented: true,
  relativeSharesMoved: false,
  newConsentLedger: false,

  /** Clock compression (Aug-specific) */
  windowDaysTotal: 191,
  windowDaysElapsed: 104,
  daysRemaining: 87,
  windowElapsedPct: 54.5,
  windowRemainingPct: 45.5,

  /** Diriyah / reform path */
  diriyahPrinciplesCount: 8,
  diriyahPrinciple8Open: true,
  tipDilutedByDiriyah: false,

  /** UNSC */
  unscVetoTop5Pct: 100,
  unscSeatSharePct: 33.3,
  unscP5Count: 5,
  unscSeatsTotal: 15,

  /** Gaps */
  chinaGdpPppPct: 18.7,
  usGdpPppPct: 15.5,
  chinaImfGapPp: -12.6,
  usImfGapPp: 1.0,
  japanImfGapPp: 2.4,
  indiaImfGapPp: -5.3,
} as const;

export type PerimeterId = "votes" | "consent" | "clock" | "unsc";

export type ScoreboardRow = {
  id: PerimeterId;
  label: string;
  top1Pct: number;
  top1Label: string;
  top3Pct: number;
  top3Labels: string;
  extraMetric: string;
  extraValue: string;
  priorTop3Pct: number | null;
  color: string;
  confidence: Confidence;
  note: string;
};

export const SCOREBOARD: ScoreboardRow[] = [
  {
    id: "votes",
    label: "IMF voting power",
    top1Pct: HEADLINE.imfTop1Pct,
    top1Label: HEADLINE.imfTop1Label,
    top3Pct: HEADLINE.imfTop3Pct,
    top3Labels: HEADLINE.imfTop3Labels,
    extraMetric: "Top-5 / HHI₁₀",
    extraValue: `${HEADLINE.imfTop5Pct}% · ~${HEADLINE.imfVoteHhiTop10}`,
    priorTop3Pct: 28.7,
    color: "#0ea5e9",
    confidence: "carried",
    note: "Shares frozen — Δ vs Q3 concentration = 0",
  },
  {
    id: "consent",
    label: "Quota consent gate",
    top1Pct: HEADLINE.quotaConsentPct,
    top1Label: "Consented share of quotas",
    top3Pct: HEADLINE.quotaThresholdPct,
    top3Labels: "85% effectiveness threshold",
    extraMetric: "Gap / Δ vs Q3",
    extraValue: `${HEADLINE.quotaGapPp} pp · ${HEADLINE.quotaDeltaPpVsQ3} pp`,
    priorTop3Pct: HEADLINE.priorQuotaConsentPct,
    color: "#f59e0b",
    confidence: "disclosed",
    note: "Flat mid-window; US still pivotal holdout",
  },
  {
    id: "clock",
    label: "Consent-window clock",
    top1Pct: HEADLINE.windowElapsedPct,
    top1Label: "% of extension elapsed",
    top3Pct: HEADLINE.windowRemainingPct,
    top3Labels: "% of window remaining",
    extraMetric: "Days to Nov 15",
    extraValue: `${HEADLINE.daysRemaining} days`,
    priorTop3Pct: null,
    color: "#8b5cf6",
    confidence: "disclosed",
    note: "Optionality compresses around a frozen tip",
  },
  {
    id: "unsc",
    label: "UNSC veto power",
    top1Pct: 20,
    top1Label: "Any single P5",
    top3Pct: 60,
    top3Labels: "Any three P5",
    extraMetric: "Top-5 veto share",
    extraValue: `${HEADLINE.unscVetoTop5Pct}%`,
    priorTop3Pct: 100,
    color: "#f43f5e",
    confidence: "disclosed",
    note: "Binary negative rights — seat share is only 33%",
  },
];

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
  consented16th: boolean | null;
  unscPermanent: boolean;
  confidence: Confidence;
  fill: string;
};

/** Ranked IMF vote ladder — concentration distribution (carried shares) */
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
    consented16th: false,
    unscPermanent: true,
    confidence: "carried",
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
    consented16th: true,
    unscPermanent: false,
    confidence: "carried",
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
    consented16th: true,
    unscPermanent: true,
    confidence: "carried",
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
    consented16th: true,
    unscPermanent: false,
    confidence: "carried",
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
    consented16th: true,
    unscPermanent: true,
    confidence: "carried",
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
    consented16th: true,
    unscPermanent: true,
    confidence: "carried",
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
    consented16th: true,
    unscPermanent: false,
    confidence: "carried",
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
    consented16th: true,
    unscPermanent: false,
    confidence: "carried",
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
    consented16th: null,
    unscPermanent: true,
    confidence: "carried",
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
    consented16th: true,
    unscPermanent: false,
    confidence: "carried",
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
    note: "US alone — pivotal consent holdout + solo 15% blocker",
  },
  {
    k: 3,
    label: "Top-3",
    imfSharePct: 28.7,
    ibrdSharePct: 28.5,
    note: "US + Japan + China (CN consented; US has not)",
  },
  {
    k: 5,
    label: "Top-5",
    imfSharePct: 40.0,
    ibrdSharePct: 40.2,
    note: "Clears 40% — still needs 85% for hardest votes",
  },
  {
    k: 10,
    label: "Top-10",
    imfSharePct: 52.4,
    ibrdSharePct: 50.6,
    note: "Half of vote weight in ten chairs",
  },
];

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
  hhiProxy: number;
  decisionRule: string;
  powerNote: string;
  fill: string;
};

export const INSTITUTION_COMPARE: InstitutionCompare[] = [
  {
    id: "imf",
    institution: "IMF (voting power)",
    short: "IMF",
    top1Pct: 16.5,
    top3Pct: 28.7,
    top5Pct: 40.0,
    hhiProxy: 520,
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
    hhiProxy: 490,
    decisionRule: "75% SCI / 85% amendment",
    powerNote: "Jun 2026 stock; SCI still without US-scale support",
    fill: "#14b8a6",
  },
  {
    id: "unsc-veto",
    institution: "UNSC veto power",
    short: "UNSC veto",
    top1Pct: 20,
    top3Pct: 60,
    top5Pct: 100,
    hhiProxy: 2000,
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
    hhiProxy: 667,
    decisionRule: "9/15 affirmative + no P5 veto",
    powerNote: "P5 = 33% of seats, 100% of vetoes",
    fill: "#8b5cf6",
  },
];

export type ConsentMeter = {
  id: string;
  label: string;
  short: string;
  priorPct: number;
  consentedPct: number;
  deltaPp: number;
  thresholdPct: number;
  gapPp: number;
  fill: string;
  confidence: Confidence;
};

/** Prior = Q3 Apr print; current = Aug mid-window (flat) */
export const CONSENT_METERS: ConsentMeter[] = [
  {
    id: "quota",
    label: "16th GRQ quota consents",
    short: "Quota",
    priorPct: 76.66,
    consentedPct: 76.66,
    deltaPp: 0,
    thresholdPct: 85,
    gapPp: -8.34,
    fill: "#f59e0b",
    confidence: "disclosed",
  },
  {
    id: "nab",
    label: "NAB rollback consents",
    short: "NAB",
    priorPct: 83.9,
    consentedPct: 83.9,
    deltaPp: 0,
    thresholdPct: 90,
    gapPp: -6.1,
    fill: "#0ea5e9",
    confidence: "disclosed",
  },
];

export type ConsentPathPoint = {
  vintage: string;
  label: string;
  quotaPct: number;
  nabPct: number;
  threshold: number;
  daysToGate: number | null;
};

/** Consent path — Oct 2025 → Apr Q3 → Aug mid → Nov gate */
export const CONSENT_PATH: ConsentPathPoint[] = [
  {
    vintage: "2025-10",
    label: "Oct 2025",
    quotaPct: 72.78,
    nabPct: 83.9,
    threshold: 85,
    daysToGate: null,
  },
  {
    vintage: "2026-04",
    label: "Apr 2026",
    quotaPct: 76.66,
    nabPct: 83.9,
    threshold: 85,
    daysToGate: 191,
  },
  {
    vintage: "2026-08",
    label: "Aug mid",
    quotaPct: 76.66,
    nabPct: 83.9,
    threshold: 85,
    daysToGate: 87,
  },
  {
    vintage: "2026-11",
    label: "Nov gate",
    quotaPct: 76.66,
    nabPct: 83.9,
    threshold: 85,
    daysToGate: 0,
  },
];

export type DeltaDumbbell = {
  id: string;
  label: string;
  prior: number;
  current: number;
  deltaPp: number;
  unit: string;
  fill: string;
  note: string;
};

/** Q3 → August mid-window deltas (tip flat; clock is the mover) */
export const CONCENTRATION_DELTAS: DeltaDumbbell[] = [
  {
    id: "imf-top1",
    label: "IMF Top-1 share",
    prior: 16.5,
    current: 16.5,
    deltaPp: 0,
    unit: "%",
    fill: "#0ea5e9",
    note: "Frozen — relative shares unmoved since Q3",
  },
  {
    id: "imf-top3",
    label: "IMF Top-3 share",
    prior: 28.7,
    current: 28.7,
    deltaPp: 0,
    unit: "%",
    fill: "#14b8a6",
    note: "Frozen — US+JP+CN still 28.7%",
  },
  {
    id: "quota-consent",
    label: "Quota consent %",
    prior: 76.66,
    current: 76.66,
    deltaPp: 0,
    unit: "%",
    fill: "#f59e0b",
    note: "Flat mid-window — no new consent ledger",
  },
  {
    id: "days-remaining",
    label: "Days to Nov 15",
    prior: 191,
    current: 87,
    deltaPp: -104,
    unit: "days",
    fill: "#8b5cf6",
    note: "Clock compression is the August story",
  },
  {
    id: "window-elapsed",
    label: "Window elapsed %",
    prior: 0,
    current: 54.5,
    deltaPp: 54.5,
    unit: "%",
    fill: "#f43f5e",
    note: "Over half the extension already spent",
  },
];

export type BlockingPower = {
  id: string;
  label: string;
  short: string;
  votePct: number;
  canBlockAlone: boolean;
  consentedMajorWeight: boolean | null;
  note: string;
  fill: string;
};

export const BLOCKING_POWER: BlockingPower[] = [
  {
    id: "us",
    label: "United States",
    short: "US",
    votePct: 16.5,
    canBlockAlone: true,
    consentedMajorWeight: false,
    note: "Sole solo blocker + pivotal consent holdout",
    fill: "#0ea5e9",
  },
  {
    id: "jp-cn",
    label: "Japan + China",
    short: "JP+CN",
    votePct: 12.2,
    canBlockAlone: false,
    consentedMajorWeight: true,
    note: "Both consented; still short of 15% block",
    fill: "#f59e0b",
  },
  {
    id: "eu5",
    label: "DE+FR+UK+IT+ES",
    short: "EU-5",
    votePct: 18.2,
    canBlockAlone: true,
    consentedMajorWeight: true,
    note: "Bloc clears block line; mostly consented",
    fill: "#8b5cf6",
  },
  {
    id: "brics",
    label: "CN+IN+BR+RU+ZA",
    short: "EM-5",
    votePct: 14.1,
    canBlockAlone: false,
    consentedMajorWeight: true,
    note: "Just shy of solo block; needs mid-weight partner",
    fill: "#f43f5e",
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
    region: "Middle East & Africa",
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

export const VETO_SERIES: VetoYear[] = [
  { year: 2018, us: 1, ru: 4, cn: 1, uk: 0, fr: 0, total: 6 },
  { year: 2019, us: 1, ru: 3, cn: 1, uk: 0, fr: 0, total: 5 },
  { year: 2020, us: 1, ru: 3, cn: 1, uk: 0, fr: 0, total: 5 },
  { year: 2021, us: 1, ru: 2, cn: 1, uk: 0, fr: 0, total: 4 },
  { year: 2022, us: 0, ru: 3, cn: 1, uk: 0, fr: 0, total: 4 },
  { year: 2023, us: 0, ru: 2, cn: 1, uk: 0, fr: 0, total: 3 },
  { year: 2024, us: 2, ru: 3, cn: 1, uk: 0, fr: 0, total: 6 },
];

export type HhiLens = {
  id: string;
  label: string;
  short: string;
  hhi: number;
  top1Pct: number;
  top3Pct: number;
  fill: string;
  note: string;
};

export const HHI_BY_LENS: HhiLens[] = [
  {
    id: "unsc-veto",
    label: "UNSC veto (equal P5)",
    short: "Veto",
    hhi: 2000,
    top1Pct: 20,
    top3Pct: 60,
    fill: "#f43f5e",
    note: "Five equal veto rights → HHI 2,000",
  },
  {
    id: "unsc-seats",
    label: "UNSC seats (P5 as bloc)",
    short: "Seats",
    hhi: 1111,
    top1Pct: 33.3,
    top3Pct: 33.3,
    fill: "#8b5cf6",
    note: "P5 seat bloc vs ten elected seats",
  },
  {
    id: "imf-top10",
    label: "IMF top-10 vote ladder",
    short: "IMF₁₀",
    hhi: 520,
    top1Pct: 16.5,
    top3Pct: 28.7,
    fill: "#0ea5e9",
    note: "Derived from disclosed top-10 + residual",
  },
  {
    id: "ibrd-top10",
    label: "IBRD top-10 vote ladder",
    short: "IBRD₁₀",
    hhi: 490,
    top1Pct: 15.8,
    top3Pct: 28.5,
    fill: "#14b8a6",
    note: "Jun 2026 twin hierarchy, slightly flatter tip",
  },
];

/** Diriyah principle → concentration implication (Aug overlay) */
export type DiriyahRow = {
  id: string;
  principle: number;
  title: string;
  tipImpact: "none" | "conditional" | "open";
  note: string;
};

export const DIRIYAH_ROWS: DiriyahRow[] = [
  {
    id: "p1",
    principle: 1,
    title: "Adequacy of quota resources",
    tipImpact: "none",
    note: "Size of Fund ≠ redistribution of Top-1/Top-3",
  },
  {
    id: "p5",
    principle: 5,
    title: "Realignment toward economic weight",
    tipImpact: "conditional",
    note: "Would need a 17th GRQ formula that actually moves shares",
  },
  {
    id: "p8",
    principle: 8,
    title: "Voice / representation open issues",
    tipImpact: "open",
    note: "Still open; does not dilute the 16.5% tip today",
  },
];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} pp`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtDays(n: number): string {
  return `${n}d`;
}
