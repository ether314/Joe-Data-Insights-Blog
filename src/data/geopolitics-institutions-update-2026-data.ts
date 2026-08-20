/**
 * Institutions & governance — vintage update (Aug 2026).
 * Compares the research-post stock ledger (IMF/IBRD votes vs GDP; 16th GRQ
 * agreed with relative shares frozen) against the newest official prints:
 * IMF Finance Dept. consent status (as of 29 Oct 2025; deadline extended to
 * 15 May 2026) and World Bank DC2026-0003 2025 Shareholding Review report
 * to Governors (10 Apr 2026).
 *
 * Core question: What changed in how power structures allocate authority?
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Vintage delta: research stock (16th GRQ agreed, relative shares frozen) → IMF Policy Paper 2025/040 consent ledger (29 Oct 2025) + World Bank DC2026-0003 2025 Shareholding Review (10 Apr 2026). Vote/GDP anchors reuse the research post where shares did not move.";

export const SOURCES = [
  {
    label: "IMF Extension of Consent Period — 16th GRQ & NAB Rollback (PP 2025/040)",
    url: "https://www.elibrary.imf.org/view/journals/007/2025/040/article-A001-en.xml",
  },
  {
    label: "World Bank — Report to Governors on the 2025 Shareholding Review (DC2026-0003)",
    url: "https://www.devcommittee.org/content/dam/sites/devcommittee/doc/documents/2026/DC2026-0003.pdf",
  },
  {
    label: "Prior theme post — Institutions & governance research",
    url: "/blog/geopolitics-institutions-research-2026",
  },
];

/** Headline meters — newest print and Δ vs research vintage */
export const HEADLINE = {
  quotaConsentPct: 72.78,
  quotaThresholdPct: 85,
  quotaGapPp: -12.22,
  quotaMembersConsented: 132,
  quotaMembersPending: 59,
  nabConsentPct: 83.9,
  nabThresholdPct: 90,
  nabGapPp: -6.1,
  nabParticipantsConsented: 38,
  consentDeadline: "2026-05-15",
  usConsented: false,
  chinaConsented: true,
  ibrdUnderRepresentedCountries: 45,
  ibrdUnderRepresentedSharePct: 47.5,
  ibrdOverRepresentedCountries: 144,
  ibrdOverRepresentedSharePct: 52.5,
  ibrdSciSupport: false,
  ibrdBasicVotesSupport: false,
  licIbrdVotePct: 2,
  usImfVotePct: 16.5,
  chinaImfVotePct: 6.1,
  chinaGdpGapPp: -12.6,
  relativeSharesMoved: false,
};

export type ConsentTrack = "quota" | "nab";

/** Dual-track consent vs institutional thresholds */
export type ConsentMeter = {
  track: ConsentTrack;
  label: string;
  consentedPct: number;
  thresholdPct: number;
  gapPp: number;
  membersOrParticipants: number;
  unit: "quota share" | "NAB credit share";
  confidence: Confidence;
};

export const CONSENT_METERS: ConsentMeter[] = [
  {
    track: "quota",
    label: "16th GRQ quota consents",
    consentedPct: 72.78,
    thresholdPct: 85,
    gapPp: -12.22,
    membersOrParticipants: 132,
    unit: "quota share",
    confidence: "disclosed",
  },
  {
    track: "nab",
    label: "NAB rollback consents",
    consentedPct: 83.9,
    thresholdPct: 90,
    gapPp: -6.1,
    membersOrParticipants: 38,
    unit: "NAB credit share",
    confidence: "disclosed",
  },
];

/** Consent progress path — research “agreed” → latest print */
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
    event: "16th GRQ Resolution 79-1: +50% quotas, shares unchanged",
    confidence: "disclosed",
  },
  {
    date: "2024-11",
    label: "Nov 2024",
    quotaConsentPct: null,
    event: "Consent deadline first extended to May 2025",
    confidence: "disclosed",
  },
  {
    date: "2025-05",
    label: "May 2025",
    quotaConsentPct: null,
    event: "Further extensions; effectiveness still pending",
    confidence: "estimated",
  },
  {
    date: "2025-10",
    label: "Oct 2025",
    quotaConsentPct: 72.78,
    event: "132 members / 72.78% of quotas consented; −12.22 pp short of 85%",
    confidence: "disclosed",
  },
  {
    date: "2025-11",
    label: "Nov 2025",
    quotaConsentPct: 72.78,
    event: "Board extends consent window to 15 May 2026",
    confidence: "disclosed",
  },
  {
    date: "2026-05",
    label: "May 2026",
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

/** Large shareholders — consent status + frozen representation gap */
export type ShareholderVintage = {
  id: string;
  name: string;
  short: string;
  region: Region;
  /** Quota share used in consent denominator (Nov 7 2023 base) */
  quotaSharePct: number;
  imfVotePct: number;
  ibrdVotePct: number;
  gdpPppPct: number;
  imfGapPp: number;
  consentedQuota: boolean;
  consentedNab: boolean | null;
  confidence: Confidence;
  note?: string;
};

/**
 * Quota shares from IMF PP 2025/040 Annex I consented list where disclosed;
 * US and other non-consenters use research-vintage anchors (estimated for
 * exact Nov-2023 quota % when not printed in the consent tables).
 */
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
    consentedQuota: false,
    consentedNab: false,
    confidence: "estimated",
    note: "Not on Oct 2025 consent list; alone larger than the 12.22 pp quota gap",
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
    consentedQuota: true,
    consentedNab: true,
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
    consentedQuota: true,
    consentedNab: true,
    confidence: "disclosed",
    note: "Consented; still deepest PPP under-weight among majors",
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
    consentedQuota: true,
    consentedNab: true,
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
    consentedQuota: true,
    consentedNab: true,
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
    consentedQuota: true,
    consentedNab: true,
    confidence: "disclosed",
  },
  {
    id: "it",
    name: "Italy",
    short: "IT",
    region: "Europe",
    quotaSharePct: 3.17,
    imfVotePct: 3.0,
    ibrdVotePct: 2.5,
    gdpPppPct: 1.9,
    imfGapPp: 1.1,
    consentedQuota: true,
    consentedNab: true,
    confidence: "estimated",
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
    consentedQuota: true,
    consentedNab: true,
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
    consentedQuota: true,
    consentedNab: true,
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
    consentedQuota: true,
    consentedNab: true,
    confidence: "disclosed",
  },
  {
    id: "ca",
    name: "Canada",
    short: "CA",
    region: "Americas",
    quotaSharePct: 2.31,
    imfVotePct: 2.2,
    ibrdVotePct: 2.4,
    gdpPppPct: 1.4,
    imfGapPp: 0.8,
    consentedQuota: true,
    consentedNab: true,
    confidence: "disclosed",
  },
  {
    id: "sa",
    name: "Saudi Arabia",
    short: "SA",
    region: "Middle East",
    quotaSharePct: 2.1,
    imfVotePct: 2.0,
    ibrdVotePct: 2.5,
    gdpPppPct: 1.3,
    imfGapPp: 0.7,
    consentedQuota: true,
    consentedNab: true,
    confidence: "estimated",
  },
  {
    id: "es",
    name: "Spain",
    short: "ES",
    region: "Europe",
    quotaSharePct: 2.0,
    imfVotePct: 1.9,
    ibrdVotePct: 1.8,
    gdpPppPct: 1.5,
    imfGapPp: 0.4,
    consentedQuota: true,
    consentedNab: true,
    confidence: "estimated",
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
    consentedQuota: true,
    consentedNab: true,
    confidence: "estimated",
  },
  {
    id: "au",
    name: "Australia",
    short: "AU",
    region: "Asia-Pacific",
    quotaSharePct: 1.38,
    imfVotePct: 1.3,
    ibrdVotePct: 1.4,
    gdpPppPct: 1.1,
    imfGapPp: 0.2,
    consentedQuota: true,
    consentedNab: true,
    confidence: "disclosed",
  },
  {
    id: "id",
    name: "Indonesia",
    short: "ID",
    region: "Asia-Pacific",
    quotaSharePct: 1.0,
    imfVotePct: 1.0,
    ibrdVotePct: 1.0,
    gdpPppPct: 2.6,
    imfGapPp: -1.6,
    consentedQuota: true,
    consentedNab: null,
    confidence: "estimated",
  },
];

/** World Bank 2025 review — misalignment census */
export type IbrdMisalignBucket = {
  id: "under" | "over";
  label: string;
  countries: number;
  shareholdingPct: number;
  fill: string;
};

export const IBRD_MISALIGN: IbrdMisalignBucket[] = [
  {
    id: "under",
    label: "Under-represented",
    countries: 45,
    shareholdingPct: 47.5,
    fill: "#be123c",
  },
  {
    id: "over",
    label: "Over-represented",
    countries: 144,
    shareholdingPct: 52.5,
    fill: "#0f766e",
  },
];

/** Reform levers — research expectation vs Spring 2026 outcome */
export type ReformLever = {
  id: string;
  label: string;
  institution: "IMF" | "IBRD" | "IFC";
  researchStatus: string;
  updateStatus: string;
  moved: boolean;
  majorityNeededPct: number | null;
  supportEnough: boolean | null;
  confidence: Confidence;
};

export const REFORM_LEVERS: ReformLever[] = [
  {
    id: "imf-16th-effective",
    label: "16th GRQ quota increase effective",
    institution: "IMF",
    researchStatus: "Agreed; relative shares frozen",
    updateStatus: "Still pending — 72.78% consented (−12.22 pp)",
    moved: false,
    majorityNeededPct: 85,
    supportEnough: false,
    confidence: "disclosed",
  },
  {
    id: "imf-nab-rollback",
    label: "NAB rollback effective",
    institution: "IMF",
    researchStatus: "Paired with 16th GRQ",
    updateStatus: "83.90% consented (−6.10 pp vs 90%)",
    moved: false,
    majorityNeededPct: 90,
    supportEnough: false,
    confidence: "disclosed",
  },
  {
    id: "imf-relative-shares",
    label: "IMF relative vote realignment",
    institution: "IMF",
    researchStatus: "Unchanged after equiproportional +50%",
    updateStatus: "Still unchanged — effectiveness itself blocked",
    moved: false,
    majorityNeededPct: null,
    supportEnough: null,
    confidence: "disclosed",
  },
  {
    id: "ibrd-sci",
    label: "IBRD Selective Capital Increase",
    institution: "IBRD",
    researchStatus: "2025 review underway",
    updateStatus: "Insufficient support for SCI (needs 75%)",
    moved: false,
    majorityNeededPct: 75,
    supportEnough: false,
    confidence: "disclosed",
  },
  {
    id: "ibrd-basic-votes",
    label: "IBRD Basic Votes increase",
    institution: "IBRD",
    researchStatus: "Possible voice tool",
    updateStatus: "Support below 85% Articles threshold",
    moved: false,
    majorityNeededPct: 85,
    supportEnough: false,
    confidence: "disclosed",
  },
  {
    id: "ibrd-voice-package",
    label: "Client-voice package (non-share)",
    institution: "IBRD",
    researchStatus: "Not in research ledger",
    updateStatus: "Recommended — VSP + LIC working group + Board capacity",
    moved: true,
    majorityNeededPct: null,
    supportEnough: true,
    confidence: "disclosed",
  },
  {
    id: "ifc-realign",
    label: "IFC shareholding realignment",
    institution: "IFC",
    researchStatus: "Post-2018 IBRD benchmark agreed",
    updateStatus: "Simulations deferred past Apr 2026 subscription deadline",
    moved: false,
    majorityNeededPct: null,
    supportEnough: null,
    confidence: "disclosed",
  },
];

/** Frozen vote−GDP gaps — research = update (shares did not move) */
export type GapDumbbell = {
  id: string;
  short: string;
  name: string;
  region: Region;
  researchGapPp: number;
  updateGapPp: number;
  deltaPp: number;
  consented: boolean;
};

export const GAP_DUMBBELLS: GapDumbbell[] = SHAREHOLDERS.map((s) => ({
  id: s.id,
  short: s.short,
  name: s.name,
  region: s.region,
  researchGapPp: s.imfGapPp,
  updateGapPp: s.imfGapPp,
  deltaPp: 0,
  consented: s.consentedQuota,
}));

/** Voice package items that *did* clear consensus */
export type VoiceItem = {
  id: string;
  label: string;
  domain: "Board" | "Meetings" | "Country";
  status: "advancing" | "deferred";
};

export const VOICE_PACKAGE: VoiceItem[] = [
  { id: "vsp", label: "Expand Voice Secondment Program (+5)", domain: "Board", status: "advancing" },
  { id: "lic-wg", label: "LIC Board working group", domain: "Board", status: "advancing" },
  { id: "ra", label: "Research Analysts for 20+ country chairs", domain: "Board", status: "advancing" },
  { id: "capacity", label: "ED/AED capacity-building profiles", domain: "Board", status: "advancing" },
  { id: "president", label: "Formalize President selection process", domain: "Board", status: "advancing" },
  { id: "dc-access", label: "Stronger client access at Spring/Annual Meetings", domain: "Meetings", status: "advancing" },
  { id: "thinktanks", label: "Global South think-tank partnerships", domain: "Country", status: "advancing" },
  { id: "2nd-aed", label: "Second Alternate ED for largest chairs", domain: "Board", status: "deferred" },
  { id: "all-elected", label: "All-elected Board (no appointed chairs)", domain: "Board", status: "deferred" },
  { id: "ssa26", label: "26th chair for Sub-Saharan Africa", domain: "Board", status: "deferred" },
];

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

export function consentGapBars() {
  return CONSENT_METERS.map((m) => ({
    track: m.track,
    label: m.track === "quota" ? "Quota consents" : "NAB rollback",
    consented: m.consentedPct,
    gap: Math.abs(m.gapPp),
    threshold: m.thresholdPct,
    shortfall: m.gapPp,
  }));
}
