/**
 * Institutions & governance — Q3 2026 vintage update.
 * Delta vs prior theme post (geopolitics-institutions-update-2026 / IMF PP 2025/040
 * as of 29 Oct 2025) using IMF Policy Paper 2026/017 (staff cut-off 29 Apr 2026;
 * Board approved 8 May 2026; deadline extended to 15 Nov 2026).
 *
 * Core question: What changed in how power structures allocate authority?
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Q3 vintage delta vs prior update (PP 2025/040, 29 Oct 2025): IMF Policy Paper 2026/017 consent ledger (29 Apr 2026) + Nov 15 2026 deadline extension. Relative IMF vote shares still frozen; World Bank SCI stance carried from DC2026-0003.";

export const SOURCES = [
  {
    label: "IMF Extension of Consent Period — 16th GRQ & NAB Rollback (PP 2026/017)",
    url: "https://www.imf.org/en/publications/policy-papers/issues/2026/05/13/extension-of-the-period-for-consent-to-increase-quotas-under-the-sixteenth-general-review-576053",
  },
  {
    label: "Prior theme update — Institutions vintage (PP 2025/040)",
    url: "/blog/geopolitics-institutions-update-2026",
  },
  {
    label: "Institutions & governance research ledger",
    url: "/blog/geopolitics-institutions-research-2026",
  },
];

/** Prior-post anchors (Oct 29 2025) vs newest print (Apr 29 2026) */
export const HEADLINE = {
  priorQuotaConsentPct: 72.78,
  quotaConsentPct: 76.66,
  quotaDeltaPp: 3.88,
  quotaThresholdPct: 85,
  quotaGapPp: -8.34,
  priorQuotaGapPp: -12.22,
  quotaMembersConsented: 149,
  priorQuotaMembersConsented: 132,
  membersDelta: 17,
  quotaMembersPending: 42,
  priorQuotaMembersPending: 59,
  nabConsentPct: 83.9,
  priorNabConsentPct: 83.9,
  nabDeltaPp: 0,
  nabThresholdPct: 90,
  nabGapPp: -6.1,
  nabParticipantsConsented: 38,
  nabParticipantsPending: 2,
  priorDeadline: "2026-05-15",
  consentDeadline: "2026-11-15",
  usConsented: false,
  chinaConsented: true,
  relativeSharesMoved: false,
  bbaCreditorsExtended: 39,
  bbaSharePct: 95.92,
  bbaPendingCreditors: 3,
  usImfVotePct: 16.5,
  chinaImfVotePct: 6.1,
  chinaGdpGapPp: -12.6,
  ibrdSciSupport: false,
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
    priorPct: 72.78,
    consentedPct: 76.66,
    deltaPp: 3.88,
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

/** Dual-vintage shortfall bars for waterfall / grouped comparison */
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
    prior: 72.78,
    latest: 76.66,
    threshold: 85,
    deltaPp: 3.88,
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
    event: "Prior post vintage — 132 members / 72.78%",
    confidence: "disclosed",
  },
  {
    date: "2025-11",
    label: "Nov 2025",
    quotaConsentPct: 72.78,
    event: "Deadline extended to 15 May 2026",
    confidence: "disclosed",
  },
  {
    date: "2026-04",
    label: "Apr 2026",
    quotaConsentPct: 76.66,
    event: "149 members / 76.66% — +3.88 pp vs Oct print",
    confidence: "disclosed",
  },
  {
    date: "2026-05",
    label: "May 2026",
    quotaConsentPct: 76.66,
    event: "Board extends consent window to 15 Nov 2026",
    confidence: "disclosed",
  },
  {
    date: "2026-11",
    label: "Nov 2026",
    quotaConsentPct: null,
    event: "Current consent deadline (still short of 85%)",
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
  gdpPppPct: number;
  imfGapPp: number;
  consentedPrior: boolean;
  consentedLatest: boolean;
  nabConsented: boolean | null;
  confidence: Confidence;
  note?: string;
};

/**
 * Consent coloring uses Apr 2026 Annex I. US remains off the list.
 * Prior consent flags mirror the Oct 2025 update post where known.
 */
export const SHAREHOLDERS: ShareholderVintage[] = [
  {
    id: "us",
    name: "United States",
    short: "US",
    region: "Americas",
    quotaSharePct: 17.4,
    imfVotePct: 16.5,
    gdpPppPct: 15.5,
    imfGapPp: 1.0,
    consentedPrior: false,
    consentedLatest: false,
    nabConsented: false,
    confidence: "estimated",
    note: "Still absent from Apr 2026 consent list; ~17% quota > remaining 8.34 pp gap",
  },
  {
    id: "jp",
    name: "Japan",
    short: "JP",
    region: "Asia-Pacific",
    quotaSharePct: 6.47,
    imfVotePct: 6.1,
    gdpPppPct: 3.7,
    imfGapPp: 2.4,
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
    gdpPppPct: 18.7,
    imfGapPp: -12.6,
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
    gdpPppPct: 3.4,
    imfGapPp: 1.9,
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
    gdpPppPct: 2.4,
    imfGapPp: 1.6,
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
    gdpPppPct: 2.3,
    imfGapPp: 1.7,
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
    gdpPppPct: 1.9,
    imfGapPp: 1.1,
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
    gdpPppPct: 7.9,
    imfGapPp: -5.3,
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
    gdpPppPct: 2.9,
    imfGapPp: -0.3,
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
    gdpPppPct: 2.4,
    imfGapPp: -0.2,
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
    gdpPppPct: 1.4,
    imfGapPp: 0.8,
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
    gdpPppPct: 1.3,
    imfGapPp: 0.7,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "es",
    name: "Spain",
    short: "ES",
    region: "Europe",
    quotaSharePct: 2.0,
    imfVotePct: 1.9,
    gdpPppPct: 1.5,
    imfGapPp: 0.4,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "nl",
    name: "Netherlands",
    short: "NL",
    region: "Europe",
    quotaSharePct: 1.83,
    imfVotePct: 1.8,
    gdpPppPct: 0.7,
    imfGapPp: 1.1,
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
    gdpPppPct: 1.8,
    imfGapPp: 0.0,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "au",
    name: "Australia",
    short: "AU",
    region: "Asia-Pacific",
    quotaSharePct: 1.38,
    imfVotePct: 1.3,
    gdpPppPct: 1.1,
    imfGapPp: 0.2,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "be",
    name: "Belgium",
    short: "BE",
    region: "Europe",
    quotaSharePct: 1.35,
    imfVotePct: 1.3,
    gdpPppPct: 0.5,
    imfGapPp: 0.8,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: true,
    confidence: "disclosed",
  },
  {
    id: "ch",
    name: "Switzerland",
    short: "CH",
    region: "Europe",
    quotaSharePct: 1.21,
    imfVotePct: 1.2,
    gdpPppPct: 0.5,
    imfGapPp: 0.7,
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
    gdpPppPct: 2.6,
    imfGapPp: -1.6,
    consentedPrior: true,
    consentedLatest: true,
    nabConsented: null,
    confidence: "disclosed",
  },
];

/** Gap closed / remaining toward 85% — stacked for area / waterfall */
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
];

/** BBA transitional funding — new Q3 panel */
export type BbaBucket = {
  id: "extended" | "pending";
  label: string;
  creditors: number;
  sharePct: number;
  fill: string;
};

export const BBA_STATUS: BbaBucket[] = [
  {
    id: "extended",
    label: "BBA extensions effective",
    creditors: 39,
    sharePct: 95.92,
    fill: "#0f766e",
  },
  {
    id: "pending",
    label: "Extensions not yet effective",
    creditors: 3,
    sharePct: 4.08,
    fill: "#be123c",
  },
];

export type ReformLever = {
  id: string;
  label: string;
  institution: "IMF" | "IBRD" | "BBA";
  priorStatus: string;
  updateStatus: string;
  moved: boolean;
  deltaNote: string;
  confidence: Confidence;
};

export const REFORM_LEVERS: ReformLever[] = [
  {
    id: "imf-quota-consent",
    label: "16th GRQ quota consent share",
    institution: "IMF",
    priorStatus: "72.78% (−12.22 pp vs 85%)",
    updateStatus: "76.66% (−8.34 pp vs 85%)",
    moved: true,
    deltaNote: "+3.88 pp / +17 members",
    confidence: "disclosed",
  },
  {
    id: "imf-nab",
    label: "NAB rollback consents",
    institution: "IMF",
    priorStatus: "83.90% (−6.10 pp vs 90%)",
    updateStatus: "83.90% (−6.10 pp vs 90%)",
    moved: false,
    deltaNote: "0 pp — same 38 participants",
    confidence: "disclosed",
  },
  {
    id: "imf-deadline",
    label: "Consent deadline",
    institution: "IMF",
    priorStatus: "15 May 2026",
    updateStatus: "15 Nov 2026",
    moved: true,
    deltaNote: "+6 months (Board 8 May 2026)",
    confidence: "disclosed",
  },
  {
    id: "imf-us",
    label: "US quota / NAB consent",
    institution: "IMF",
    priorStatus: "Not on Oct 2025 list",
    updateStatus: "Still not on Apr 2026 list",
    moved: false,
    deltaNote: "Binding gap unchanged",
    confidence: "disclosed",
  },
  {
    id: "imf-shares",
    label: "Relative vote realignment",
    institution: "IMF",
    priorStatus: "Frozen",
    updateStatus: "Still frozen",
    moved: false,
    deltaNote: "Equiproportional design intact",
    confidence: "disclosed",
  },
  {
    id: "bba-bridge",
    label: "2020 BBA term extensions",
    institution: "BBA",
    priorStatus: "Not scored in prior update",
    updateStatus: "39 creditors / 95.92% effective",
    moved: true,
    deltaNote: "Transitional lending capacity bridge",
    confidence: "disclosed",
  },
  {
    id: "ibrd-sci",
    label: "IBRD Selective Capital Increase",
    institution: "IBRD",
    priorStatus: "Insufficient support",
    updateStatus: "Still no SCI (DC2026-0003)",
    moved: false,
    deltaNote: "No new Governors print in Q3 window",
    confidence: "disclosed",
  },
];

export type GapDumbbell = {
  id: string;
  short: string;
  name: string;
  region: Region;
  gapPp: number;
  consentedLatest: boolean;
  newlyConsented: boolean;
};

export const GAP_DUMBBELLS: GapDumbbell[] = SHAREHOLDERS.map((s) => ({
  id: s.id,
  short: s.short,
  name: s.name,
  region: s.region,
  gapPp: s.imfGapPp,
  consentedLatest: s.consentedLatest,
  newlyConsented: !s.consentedPrior && s.consentedLatest,
}));

export const REGION_COLORS: Record<Region, string> = {
  Americas: "#0ea5e9",
  Europe: "#6366f1",
  "Asia-Pacific": "#dc2626",
  Africa: "#d97706",
  "Middle East": "#0f766e",
  Other: "#64748b",
};

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
