/**
 * Institutions & governance — August 2026 vintage update.
 * Delta vs prior theme post (geopolitics-institutions-update-2026q3 / IMF PP 2026/017
 * as of 29 Apr 2026) using mid-window clock (as of 20 Aug 2026), Diriyah Guiding
 * Principles (PP 2026/013), and World Bank IBRD voting-power stock (as of 30 Jun 2026).
 *
 * Core question: What changed in how power structures allocate authority?
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Aug 2026 vintage delta vs Q3 update (PP 2026/017, 29 Apr 2026): no superseding IMF consent ledger published by 20 Aug 2026; Nov 15 deadline clock compression; Diriyah Guiding Principles (PP 2026/013); IBRD vote stock as of 30 Jun 2026 (WBG Finances, refreshed Aug 18). Relative IMF/IBRD shares still frozen.";

export const SOURCES = [
  {
    label: "IMF Diriyah Guiding Principles on Quota & Governance (PP 2026/013)",
    url: "https://www.imf.org/en/publications/policy-papers/issues/2026/04/30/diriyah-guiding-principles-on-imf-quota-and-governance-reforms-575776",
  },
  {
    label: "IMF Extension of Consent Period — 16th GRQ & NAB Rollback (PP 2026/017)",
    url: "https://www.imf.org/en/publications/policy-papers/issues/2026/05/13/extension-of-the-period-for-consent-to-increase-quotas-under-the-sixteenth-general-review-576053",
  },
  {
    label: "Prior theme update — Q3 institutions vintage",
    url: "/blog/geopolitics-institutions-update-2026q3",
  },
  {
    label: "World Bank IBRD voting powers",
    url: "https://www.worldbank.org/en/about/leadership/votingpowers",
  },
];

/** As-of dates for the August vintage */
export const AS_OF = {
  priorCutOff: "2026-04-29",
  priorLabel: "Apr 29 2026 (Q3 post)",
  clockAsOf: "2026-08-20",
  clockLabel: "Aug 20 2026",
  ibrdAsOf: "2026-06-30",
  consentDeadline: "2026-11-15",
};

/**
 * Prior-post anchors (Apr 29 2026) vs August mid-window print.
 * Consent levels are carried (no superseding PP); the binding delta is the clock.
 */
export const HEADLINE = {
  priorQuotaConsentPct: 76.66,
  quotaConsentPct: 76.66,
  quotaDeltaPp: 0,
  quotaThresholdPct: 85,
  quotaGapPp: -8.34,
  priorQuotaGapPp: -8.34,
  quotaMembersConsented: 149,
  priorQuotaMembersConsented: 149,
  membersDelta: 0,
  quotaMembersPending: 42,
  priorQuotaMembersPending: 42,
  nabConsentPct: 83.9,
  priorNabConsentPct: 83.9,
  nabDeltaPp: 0,
  nabThresholdPct: 90,
  nabGapPp: -6.1,
  nabParticipantsConsented: 38,
  nabParticipantsPending: 2,
  priorDeadline: "2026-11-15",
  consentDeadline: "2026-11-15",
  /** Calendar days from May 8 Board extension to Nov 15 */
  windowDaysTotal: 191,
  /** Days elapsed May 8 → Aug 20 */
  windowDaysElapsed: 104,
  /** Days remaining Aug 20 → Nov 15 */
  daysRemaining: 87,
  windowElapsedPct: 54.5,
  windowRemainingPct: 45.5,
  usConsented: false,
  chinaConsented: true,
  relativeSharesMoved: false,
  newConsentLedger: false,
  diriyahPrinciplesCount: 8,
  diriyahPrinciple8Open: true,
  bbaCreditorsExtended: 39,
  bbaSharePct: 95.92,
  usImfVotePct: 16.5,
  chinaImfVotePct: 6.1,
  chinaGdpGapPp: -12.6,
  usIbrdVotePct: 15.8,
  chinaIbrdVotePct: 5.9,
  ibrdSciSupport: false,
  ibrdBasicVotesPct: 5.55,
};

export type ConsentTrack = "quota" | "nab";

export type ConsentMeter = {
  track: ConsentTrack;
  label: string;
  priorPct: number;
  consentedPct: number;
  deltaPp: number;
  thresholdPct: number;
  gapPp: number;
  unit: "quota share" | "NAB credit share";
  confidence: Confidence;
};

export const CONSENT_METERS: ConsentMeter[] = [
  {
    track: "quota",
    label: "16th GRQ quota consents",
    priorPct: 76.66,
    consentedPct: 76.66,
    deltaPp: 0,
    thresholdPct: 85,
    gapPp: -8.34,
    unit: "quota share",
    confidence: "disclosed",
  },
  {
    track: "nab",
    label: "NAB rollback consents",
    priorPct: 83.9,
    consentedPct: 83.9,
    deltaPp: 0,
    thresholdPct: 90,
    gapPp: -6.1,
    unit: "NAB credit share",
    confidence: "disclosed",
  },
];

export type VintageDeltaBar = {
  track: ConsentTrack;
  label: string;
  prior: number;
  latest: number;
  threshold: number;
  deltaPp: number;
};

export const VINTAGE_DELTA_BARS: VintageDeltaBar[] = [
  {
    track: "quota",
    label: "Quota",
    prior: 76.66,
    latest: 76.66,
    threshold: 85,
    deltaPp: 0,
  },
  {
    track: "nab",
    label: "NAB",
    prior: 83.9,
    latest: 83.9,
    threshold: 90,
    deltaPp: 0,
  },
];

/** Mid-window clock — primary August delta vs Q3 */
export type ClockPoint = {
  date: string;
  label: string;
  daysRemaining: number | null;
  quotaConsentPct: number | null;
  event: string;
  confidence: Confidence;
};

export const CONSENT_CLOCK: ClockPoint[] = [
  {
    date: "2026-04",
    label: "Apr 29",
    daysRemaining: 200,
    quotaConsentPct: 76.66,
    event: "Q3 vintage — 149 members / 76.66%; staff cut-off",
    confidence: "disclosed",
  },
  {
    date: "2026-05",
    label: "May 8",
    daysRemaining: 191,
    quotaConsentPct: 76.66,
    event: "Board extends consent window to 15 Nov 2026",
    confidence: "disclosed",
  },
  {
    date: "2026-08",
    label: "Aug 20",
    daysRemaining: 87,
    quotaConsentPct: 76.66,
    event: "No superseding consent PP — clock at 87 days",
    confidence: "disclosed",
  },
  {
    date: "2026-11",
    label: "Nov 15",
    daysRemaining: 0,
    quotaConsentPct: null,
    event: "Current consent deadline (still short of 85%)",
    confidence: "disclosed",
  },
];

export type ConsentPathPoint = {
  date: string;
  label: string;
  quotaConsentPct: number | null;
  event: string;
  confidence: Confidence;
};

export const CONSENT_PATH: ConsentPathPoint[] = [
  {
    date: "2023-12",
    label: "Dec 2023",
    quotaConsentPct: 0,
    event: "16th GRQ Resolution 79-1: +50% quotas, shares frozen",
    confidence: "disclosed",
  },
  {
    date: "2025-10",
    label: "Oct 2025",
    quotaConsentPct: 72.78,
    event: "132 members / 72.78%",
    confidence: "disclosed",
  },
  {
    date: "2026-04",
    label: "Apr 2026",
    quotaConsentPct: 76.66,
    event: "Q3 post — 149 members / 76.66%",
    confidence: "disclosed",
  },
  {
    date: "2026-08",
    label: "Aug 2026",
    quotaConsentPct: 76.66,
    event: "Flat vs Apr — no new consent ledger",
    confidence: "disclosed",
  },
  {
    date: "2026-11",
    label: "Nov 2026",
    quotaConsentPct: null,
    event: "Deadline (87 days from Aug 20)",
    confidence: "disclosed",
  },
];

export type Region =
  | "Americas"
  | "Europe"
  | "Asia-Pacific"
  | "Africa"
  | "Middle East"
  | "Other";

export type ShareholderVintage = {
  id: string;
  name: string;
  short: string;
  region: Region;
  quotaSharePct: number;
  imfVotePct: number;
  ibrdVotePct: number;
  gdpPppPct: number;
  imfGapPp: number;
  ibrdGapPp: number;
  consentedPrior: boolean;
  consentedLatest: boolean;
  nabConsented: boolean | null;
  confidence: Confidence;
  note?: string;
};

/** Consent coloring carried from Apr 2026 Annex I; IBRD votes from research/WBG stock. */
export const SHAREHOLDERS: ShareholderVintage[] = [
  {
    id: "us",
    name: "United States",
    short: "US",
    region: "Americas",
    quotaSharePct: 17.4,
    imfVotePct: 16.5,
    ibrdVotePct: 15.8,
    gdpPppPct: 15.5,
    imfGapPp: 1.0,
    ibrdGapPp: 0.3,
    consentedPrior: false,
    consentedLatest: false,
    nabConsented: false,
    confidence: "estimated",
    note: "Still absent; ~17% quota > remaining 8.34 pp gap",
  },
  {
    id: "jp",
    name: "Japan",
    short: "JP",
    region: "Asia-Pacific",
    quotaSharePct: 6.47,
    imfVotePct: 6.1,
    ibrdVotePct: 6.8,
    gdpPppPct: 3.7,
    imfGapPp: 2.4,
    ibrdGapPp: 3.1,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "cn",
    name: "China",
    short: "CN",
    region: "Asia-Pacific",
    quotaSharePct: 6.4,
    imfVotePct: 6.1,
    ibrdVotePct: 5.9,
    gdpPppPct: 18.7,
    imfGapPp: -12.6,
    ibrdGapPp: -12.8,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "de",
    name: "Germany",
    short: "DE",
    region: "Europe",
    quotaSharePct: 5.59,
    imfVotePct: 5.3,
    ibrdVotePct: 4.0,
    gdpPppPct: 3.4,
    imfGapPp: 1.9,
    ibrdGapPp: 0.6,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "fr",
    name: "France",
    short: "FR",
    region: "Europe",
    quotaSharePct: 4.23,
    imfVotePct: 4.0,
    ibrdVotePct: 3.8,
    gdpPppPct: 2.4,
    imfGapPp: 1.6,
    ibrdGapPp: 1.4,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "uk",
    name: "United Kingdom",
    short: "UK",
    region: "Europe",
    quotaSharePct: 4.23,
    imfVotePct: 4.0,
    ibrdVotePct: 3.8,
    gdpPppPct: 2.3,
    imfGapPp: 1.7,
    ibrdGapPp: 1.5,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "it",
    name: "Italy",
    short: "IT",
    region: "Europe",
    quotaSharePct: 3.16,
    imfVotePct: 3.0,
    ibrdVotePct: 2.6,
    gdpPppPct: 1.9,
    imfGapPp: 1.1,
    ibrdGapPp: 0.7,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "in",
    name: "India",
    short: "IN",
    region: "Asia-Pacific",
    quotaSharePct: 2.75,
    imfVotePct: 2.6,
    ibrdVotePct: 3.0,
    gdpPppPct: 7.9,
    imfGapPp: -5.3,
    ibrdGapPp: -4.9,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "ru",
    name: "Russian Federation",
    short: "RU",
    region: "Europe",
    quotaSharePct: 2.71,
    imfVotePct: 2.6,
    ibrdVotePct: 2.8,
    gdpPppPct: 2.9,
    imfGapPp: -0.3,
    ibrdGapPp: -0.1,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "br",
    name: "Brazil",
    short: "BR",
    region: "Americas",
    quotaSharePct: 2.32,
    imfVotePct: 2.2,
    ibrdVotePct: 2.1,
    gdpPppPct: 2.4,
    imfGapPp: -0.2,
    ibrdGapPp: -0.3,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "ca",
    name: "Canada",
    short: "CA",
    region: "Americas",
    quotaSharePct: 2.31,
    imfVotePct: 2.2,
    ibrdVotePct: 2.5,
    gdpPppPct: 1.4,
    imfGapPp: 0.8,
    ibrdGapPp: 1.1,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "sa",
    name: "Saudi Arabia",
    short: "SA",
    region: "Middle East",
    quotaSharePct: 2.1,
    imfVotePct: 2.0,
    ibrdVotePct: 2.9,
    gdpPppPct: 1.3,
    imfGapPp: 0.7,
    ibrdGapPp: 1.6,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "kr",
    name: "Korea, Rep.",
    short: "KR",
    region: "Asia-Pacific",
    quotaSharePct: 1.8,
    imfVotePct: 1.8,
    ibrdVotePct: 1.6,
    gdpPppPct: 1.8,
    imfGapPp: 0.0,
    ibrdGapPp: -0.2,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "id",
    name: "Indonesia",
    short: "ID",
    region: "Asia-Pacific",
    quotaSharePct: 0.98,
    imfVotePct: 1.0,
    ibrdVotePct: 1.0,
    gdpPppPct: 2.6,
    imfGapPp: -1.6,
    ibrdGapPp: -1.6,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: null,
    confidence: "disclosed",
  },
];

export type GapStackPoint = {
  id: string;
  label: string;
  closedPp: number;
  remainingPp: number;
  consentedPct: number;
};

export const GAP_STACK: GapStackPoint[] = [
  {
    id: "oct2025",
    label: "Oct 2025",
    closedPp: 72.78,
    remainingPp: 12.22,
    consentedPct: 72.78,
  },
  {
    id: "apr2026",
    label: "Apr 2026",
    closedPp: 76.66,
    remainingPp: 8.34,
    consentedPct: 76.66,
  },
  {
    id: "aug2026",
    label: "Aug 2026",
    closedPp: 76.66,
    remainingPp: 8.34,
    consentedPct: 76.66,
  },
];

/** Diriyah Guiding Principles (PP 2026/013) — August framework panel */
export type DiriyahPrinciple = {
  id: string;
  num: number;
  short: string;
  status: "anchored" | "open" | "partial";
  score: number; // 0–100 for viz
  note: string;
};

export const DIRIYAH_PRINCIPLES: DiriyahPrinciple[] = [
  {
    id: "p1",
    num: 1,
    short: "Quota-based GFSN center",
    status: "anchored",
    score: 85,
    note: "Fund still describes itself as adequately resourced via NAB/BBA bridges",
  },
  {
    id: "p2",
    num: 2,
    short: "Voice = rights + responsibilities",
    status: "partial",
    score: 55,
    note: "Large-share consent gaps keep effectiveness incomplete",
  },
  {
    id: "p3",
    num: 3,
    short: "Legitimacy & effectiveness",
    status: "partial",
    score: 50,
    note: "Representation gaps persist while 16th GRQ shares stay frozen",
  },
  {
    id: "p4",
    num: 4,
    short: "Pragmatic & inclusive process",
    status: "anchored",
    score: 70,
    note: "Board keeps extending windows inside IMF bodies",
  },
  {
    id: "p5",
    num: 5,
    short: "Formula + gap reduction",
    status: "open",
    score: 25,
    note: "16th GRQ was equiproportional; 17th formula work still ahead",
  },
  {
    id: "p6",
    num: 6,
    short: "Board/IMFC regional balance",
    status: "anchored",
    score: 65,
    note: "2025 Board/IMFC named as baseline reference",
  },
  {
    id: "p7",
    num: 7,
    short: "Open MD selection",
    status: "anchored",
    score: 60,
    note: "Process principle stated; not the August binding constraint",
  },
  {
    id: "p8",
    num: 8,
    short: "Implement completed reforms",
    status: "open",
    score: 15,
    note: "16th GRQ +50% still not effective — Principle 8 is the August punchline",
  },
];

export type AuthorityLayer = {
  id: string;
  label: string;
  institution: "IMF" | "IBRD" | "Framework";
  priorStatus: string;
  updateStatus: string;
  moved: boolean;
  deltaNote: string;
  confidence: Confidence;
};

export const AUTHORITY_LAYERS: AuthorityLayer[] = [
  {
    id: "consent-ledger",
    label: "16th GRQ consent ledger",
    institution: "IMF",
    priorStatus: "76.66% / 149 members",
    updateStatus: "Still 76.66% / 149 (no new PP)",
    moved: false,
    deltaNote: "0 pp — flat mid-window",
    confidence: "disclosed",
  },
  {
    id: "nab",
    label: "NAB rollback consents",
    institution: "IMF",
    priorStatus: "83.90% (38 participants)",
    updateStatus: "Still 83.90%",
    moved: false,
    deltaNote: "Second gate frozen",
    confidence: "disclosed",
  },
  {
    id: "clock",
    label: "Days to Nov 15 deadline",
    institution: "IMF",
    priorStatus: "~191 days (May 8)",
    updateStatus: "87 days (Aug 20)",
    moved: true,
    deltaNote: "−104 days; 54.5% of window elapsed",
    confidence: "disclosed",
  },
  {
    id: "diriyah",
    label: "Diriyah Principle 8 (implement reforms)",
    institution: "Framework",
    priorStatus: "Not scored in Q3 dashboard",
    updateStatus: "Open — 16th GRQ not effective",
    moved: true,
    deltaNote: "New framework panel vs Q3",
    confidence: "disclosed",
  },
  {
    id: "us",
    label: "US quota / NAB consent",
    institution: "IMF",
    priorStatus: "Not on Apr list",
    updateStatus: "Still not disclosed as consented",
    moved: false,
    deltaNote: "Binding gap intact",
    confidence: "disclosed",
  },
  {
    id: "shares",
    label: "Relative IMF vote shares",
    institution: "IMF",
    priorStatus: "Frozen",
    updateStatus: "Still frozen",
    moved: false,
    deltaNote: "Equiproportional design",
    confidence: "disclosed",
  },
  {
    id: "ibrd-sci",
    label: "IBRD SCI / Basic Votes",
    institution: "IBRD",
    priorStatus: "Insufficient support (DC2026-0003)",
    updateStatus: "Jun 30 vote stock unchanged",
    moved: false,
    deltaNote: "WBG Finances refresh Aug 18",
    confidence: "disclosed",
  },
  {
    id: "bba",
    label: "2020 BBA extensions",
    institution: "IMF",
    priorStatus: "39 creditors / 95.92%",
    updateStatus: "Carried — still the soft bridge",
    moved: false,
    deltaNote: "No new BBA annex in Aug window",
    confidence: "disclosed",
  },
];

/** IBRD top-share concentration for August Bank panel */
export type IbrdShareRow = {
  short: string;
  name: string;
  region: Region;
  votePct: number;
  gdpPppPct: number;
  gapPp: number;
};

export const IBRD_TOP: IbrdShareRow[] = SHAREHOLDERS.map((s) => ({
  short: s.short,
  name: s.name,
  region: s.region,
  votePct: s.ibrdVotePct,
  gdpPppPct: s.gdpPppPct,
  gapPp: s.ibrdGapPp,
})).sort((a, b) => b.votePct - a.votePct);

export type GapDumbbell = {
  id: string;
  short: string;
  name: string;
  region: Region;
  imfGapPp: number;
  ibrdGapPp: number;
  consentedLatest: boolean;
};

export const GAP_DUMBBELLS: GapDumbbell[] = SHAREHOLDERS.map((s) => ({
  id: s.id,
  short: s.short,
  name: s.name,
  region: s.region,
  imfGapPp: s.imfGapPp,
  ibrdGapPp: s.ibrdGapPp,
  consentedLatest: s.consentedLatest,
}));

export const REGION_COLORS: Record<Region, string> = {
  Americas: "#0ea5e9",
  Europe: "#6366f1",
  "Asia-Pacific": "#dc2626",
  Africa: "#d97706",
  "Middle East": "#0f766e",
  Other: "#64748b",
};

export const STATUS_COLORS = {
  anchored: "#0f766e",
  partial: "#d97706",
  open: "#be123c",
} as const;

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function shareholdersByRegion(region: Region | "All") {
  return region === "All"
    ? SHAREHOLDERS
    : SHAREHOLDERS.filter((s) => s.region === region);
}

export function vintageBars(track: "both" | ConsentTrack) {
  if (track === "both") return VINTAGE_DELTA_BARS;
  return VINTAGE_DELTA_BARS.filter((b) => b.track === track);
}

export function ibrdByRegion(region: Region | "All") {
  return region === "All"
    ? IBRD_TOP
    : IBRD_TOP.filter((r) => r.region === region);
}
