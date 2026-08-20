/**
 * Institutions & governance — multilateral voting power vs economic weight.
 * Core question: How do power structures and institutions allocate authority?
 *
 * Primary sources:
 * - IMF Quota and Voting Shares (Members' Quotas and Voting Power; 16th General Review)
 * - World Bank IBRD Subscriptions and Voting Power
 * - UN Charter Art. 23 / Art. 27 (Security Council composition & veto)
 * - IMF Annual Report / Factsheet on special majorities (85% for major decisions)
 * - World Bank / IMF PPP GDP shares (WEO) for representation gap calculations
 *
 * Confidence: quota/vote shares marked "disclosed"; GDP and population shares
 * for gap panels use WEO/UN latest-available anchors and are flagged where rounded.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "IMF and IBRD voting shares from official member quota/subscription tables (post-16th General Review relative shares). UNSC structure follows UN Charter. GDP (PPP) and population shares are WEO/UN anchors used to compute representation gaps — rounded to 0.1 pp. Special-majority thresholds (85% IMF; 85% IBRD amendment) are institutional rules, not annual statistics.";

export const IMF_QUOTAS_URL =
  "https://www.imf.org/en/About/executive-board/members-quotas";
export const IBRD_VOTES_URL =
  "https://www.worldbank.org/en/about/leadership/votingpowers";
export const UNSC_URL = "https://www.un.org/securitycouncil/";

export const HEADLINE = {
  imfUsVotePct: 16.5,
  imfChinaVotePct: 6.1,
  imfSpecialMajorityPct: 85,
  imfUsBlockAlone: true,
  ibrdUsVotePct: 15.8,
  unscPermanentSeats: 5,
  unscElectedSeats: 10,
  imfChairs: 24,
  imfMembers: 190,
  top5ImfVotePct: 40.0,
  chinaGdpPppPct: 18.7,
  usGdpPppPct: 15.5,
  chinaImfGapPp: -12.6,
  usImfGapPp: 1.0,
};

/** Country-level authority across institutions */
export type InstitutionMember = {
  id: string;
  name: string;
  region: "Americas" | "Europe" | "Asia-Pacific" | "Africa" | "Middle East" | "Other";
  imfVotePct: number;
  ibrdVotePct: number;
  gdpPppPct: number;
  populationPct: number;
  unscPermanent: boolean;
  confidence: Confidence;
  note?: string;
};

/**
 * Vote shares approximate official tables after the 16th General Review's
 * equiproportional increase (relative shares largely unchanged). GDP/pop
 * anchors ~2024 WEO/UN; gaps are editorial derived fields.
 */
export const MEMBERS: InstitutionMember[] = [
  {
    id: "us",
    name: "United States",
    region: "Americas",
    imfVotePct: 16.5,
    ibrdVotePct: 15.8,
    gdpPppPct: 15.5,
    populationPct: 4.2,
    unscPermanent: true,
    confidence: "disclosed",
    note: "Alone above the 15% threshold that blocks 85% special majorities at the IMF",
  },
  {
    id: "jp",
    name: "Japan",
    region: "Asia-Pacific",
    imfVotePct: 6.1,
    ibrdVotePct: 6.8,
    gdpPppPct: 3.7,
    populationPct: 1.5,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "cn",
    name: "China",
    region: "Asia-Pacific",
    imfVotePct: 6.1,
    ibrdVotePct: 5.9,
    gdpPppPct: 18.7,
    populationPct: 17.7,
    unscPermanent: true,
    confidence: "disclosed",
    note: "Largest PPP economy; still ~tied with Japan on IMF votes",
  },
  {
    id: "de",
    name: "Germany",
    region: "Europe",
    imfVotePct: 5.3,
    ibrdVotePct: 4.0,
    gdpPppPct: 3.4,
    populationPct: 1.0,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "fr",
    name: "France",
    region: "Europe",
    imfVotePct: 4.0,
    ibrdVotePct: 3.8,
    gdpPppPct: 2.4,
    populationPct: 0.8,
    unscPermanent: true,
    confidence: "disclosed",
  },
  {
    id: "uk",
    name: "United Kingdom",
    region: "Europe",
    imfVotePct: 4.0,
    ibrdVotePct: 3.8,
    gdpPppPct: 2.3,
    populationPct: 0.8,
    unscPermanent: true,
    confidence: "disclosed",
  },
  {
    id: "it",
    name: "Italy",
    region: "Europe",
    imfVotePct: 3.0,
    ibrdVotePct: 2.6,
    gdpPppPct: 2.0,
    populationPct: 0.7,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "in",
    name: "India",
    region: "Asia-Pacific",
    imfVotePct: 2.6,
    ibrdVotePct: 3.0,
    gdpPppPct: 7.9,
    populationPct: 17.8,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "ru",
    name: "Russia",
    region: "Europe",
    imfVotePct: 2.6,
    ibrdVotePct: 2.8,
    gdpPppPct: 3.0,
    populationPct: 1.8,
    unscPermanent: true,
    confidence: "disclosed",
  },
  {
    id: "br",
    name: "Brazil",
    region: "Americas",
    imfVotePct: 2.2,
    ibrdVotePct: 2.1,
    gdpPppPct: 2.4,
    populationPct: 2.7,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "ca",
    name: "Canada",
    region: "Americas",
    imfVotePct: 2.2,
    ibrdVotePct: 2.9,
    gdpPppPct: 1.4,
    populationPct: 0.5,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "sa",
    name: "Saudi Arabia",
    region: "Middle East",
    imfVotePct: 2.0,
    ibrdVotePct: 2.5,
    gdpPppPct: 1.2,
    populationPct: 0.5,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "es",
    name: "Spain",
    region: "Europe",
    imfVotePct: 1.9,
    ibrdVotePct: 1.8,
    gdpPppPct: 1.5,
    populationPct: 0.6,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "mx",
    name: "Mexico",
    region: "Americas",
    imfVotePct: 1.8,
    ibrdVotePct: 1.5,
    gdpPppPct: 1.8,
    populationPct: 1.6,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "nl",
    name: "Netherlands",
    region: "Europe",
    imfVotePct: 1.8,
    ibrdVotePct: 1.9,
    gdpPppPct: 0.8,
    populationPct: 0.2,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "kr",
    name: "Korea, Rep.",
    region: "Asia-Pacific",
    imfVotePct: 1.8,
    ibrdVotePct: 1.6,
    gdpPppPct: 1.8,
    populationPct: 0.6,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "au",
    name: "Australia",
    region: "Asia-Pacific",
    imfVotePct: 1.3,
    ibrdVotePct: 1.4,
    gdpPppPct: 1.1,
    populationPct: 0.3,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "id",
    name: "Indonesia",
    region: "Asia-Pacific",
    imfVotePct: 1.0,
    ibrdVotePct: 1.0,
    gdpPppPct: 2.6,
    populationPct: 3.4,
    unscPermanent: false,
    confidence: "disclosed",
  },
  {
    id: "tr",
    name: "Türkiye",
    region: "Middle East",
    imfVotePct: 0.9,
    ibrdVotePct: 1.1,
    gdpPppPct: 2.1,
    populationPct: 1.1,
    unscPermanent: false,
    confidence: "estimated",
  },
  {
    id: "za",
    name: "South Africa",
    region: "Africa",
    imfVotePct: 0.6,
    ibrdVotePct: 0.8,
    gdpPppPct: 0.6,
    populationPct: 0.8,
    unscPermanent: false,
    confidence: "estimated",
  },
];

export type AuthorityLayer = {
  id: string;
  label: string;
  institution: string;
  seatsOrChairs: number;
  membersCovered: number;
  decisionRule: string;
  powerNote: string;
  weight: number;
};

/** Hierarchy of formal authority layers (for org-style panel) */
export const AUTHORITY_LAYERS: AuthorityLayer[] = [
  {
    id: "unsc-p5",
    label: "UNSC permanent five",
    institution: "UN Security Council",
    seatsOrChairs: 5,
    membersCovered: 5,
    decisionRule: "Any P5 veto blocks substantive resolutions",
    powerNote: "Absolute negative power on Chapter VII enforcement",
    weight: 100,
  },
  {
    id: "unsc-e10",
    label: "UNSC elected ten",
    institution: "UN Security Council",
    seatsOrChairs: 10,
    membersCovered: 10,
    decisionRule: "2-year terms; no veto",
    powerNote: "Needed for 9/15 affirmative votes; cannot override a P5 veto",
    weight: 55,
  },
  {
    id: "imf-us",
    label: "IMF single-country veto tier",
    institution: "IMF",
    seatsOrChairs: 1,
    membersCovered: 1,
    decisionRule: "85% special majority for major decisions",
    powerNote: "US vote share alone exceeds the 15% blocking minority",
    weight: 90,
  },
  {
    id: "imf-board",
    label: "IMF Executive Board chairs",
    institution: "IMF",
    seatsOrChairs: 24,
    membersCovered: 190,
    decisionRule: "Weighted voting by quota; most chairs are multi-country",
    powerNote: "190 members compressed into 24 directors",
    weight: 70,
  },
  {
    id: "ibrd-board",
    label: "IBRD Executive Directors",
    institution: "World Bank (IBRD)",
    seatsOrChairs: 25,
    membersCovered: 189,
    decisionRule: "Weighted voting by capital subscriptions",
    powerNote: "US remains the largest single shareholder",
    weight: 65,
  },
  {
    id: "unga",
    label: "UN General Assembly",
    institution: "UNGA",
    seatsOrChairs: 193,
    membersCovered: 193,
    decisionRule: "One country, one vote (most resolutions)",
    powerNote: "Equal formal votes; weak enforcement relative to UNSC/IMF",
    weight: 25,
  },
];

export type QuotaReformPoint = {
  year: number;
  label: string;
  usVotePct: number;
  chinaVotePct: number;
  emdeVotePct: number;
  event: string;
  confidence: Confidence;
};

/** Stylized reform path — relative shares from IMF narrative milestones */
export const QUOTA_REFORM_PATH: QuotaReformPoint[] = [
  {
    year: 1990,
    label: "1990",
    usVotePct: 19.1,
    chinaVotePct: 2.5,
    emdeVotePct: 34,
    event: "Pre-emerging-market rise",
    confidence: "estimated",
  },
  {
    year: 2001,
    label: "2001",
    usVotePct: 17.4,
    chinaVotePct: 3.0,
    emdeVotePct: 36,
    event: "China joins WTO era",
    confidence: "estimated",
  },
  {
    year: 2008,
    label: "2008",
    usVotePct: 16.8,
    chinaVotePct: 3.8,
    emdeVotePct: 39,
    event: "Ad hoc voice reforms begin",
    confidence: "estimated",
  },
  {
    year: 2010,
    label: "2010",
    usVotePct: 16.5,
    chinaVotePct: 6.1,
    emdeVotePct: 42,
    event: "14th General Review agreed (shifted ~6pp to EM)",
    confidence: "disclosed",
  },
  {
    year: 2016,
    label: "2016",
    usVotePct: 16.5,
    chinaVotePct: 6.1,
    emdeVotePct: 44,
    event: "14th Review enters into force (US ratification lag)",
    confidence: "disclosed",
  },
  {
    year: 2023,
    label: "2023",
    usVotePct: 16.5,
    chinaVotePct: 6.1,
    emdeVotePct: 44,
    event: "16th Review: +50% quotas, shares unchanged",
    confidence: "disclosed",
  },
  {
    year: 2025,
    label: "2025",
    usVotePct: 16.5,
    chinaVotePct: 6.1,
    emdeVotePct: 44,
    event: "Relative shares still frozen pending realignment talks",
    confidence: "disclosed",
  },
];

export type UnscVetoYear = {
  year: number;
  us: number;
  ru: number;
  cn: number;
  uk: number;
  fr: number;
};

/** Annual veto counts — Security Council Report / UN documentation aggregates */
export const UNSC_VETO_SERIES: UnscVetoYear[] = [
  { year: 2011, us: 1, ru: 1, cn: 0, uk: 0, fr: 0 },
  { year: 2012, us: 0, ru: 2, cn: 0, uk: 0, fr: 0 },
  { year: 2013, us: 0, ru: 1, cn: 0, uk: 0, fr: 0 },
  { year: 2014, us: 0, ru: 1, cn: 0, uk: 0, fr: 0 },
  { year: 2015, us: 0, ru: 2, cn: 0, uk: 0, fr: 0 },
  { year: 2016, us: 0, ru: 2, cn: 0, uk: 0, fr: 0 },
  { year: 2017, us: 1, ru: 4, cn: 1, uk: 0, fr: 0 },
  { year: 2018, us: 1, ru: 4, cn: 1, uk: 0, fr: 0 },
  { year: 2019, us: 1, ru: 3, cn: 1, uk: 0, fr: 0 },
  { year: 2020, us: 1, ru: 3, cn: 1, uk: 0, fr: 0 },
  { year: 2021, us: 1, ru: 2, cn: 1, uk: 0, fr: 0 },
  { year: 2022, us: 0, ru: 3, cn: 1, uk: 0, fr: 0 },
  { year: 2023, us: 0, ru: 2, cn: 1, uk: 0, fr: 0 },
  { year: 2024, us: 2, ru: 3, cn: 1, uk: 0, fr: 0 },
];

export type ChairBucket = {
  id: string;
  label: string;
  chairs: number;
  membersApprox: number;
  voteSharePct: number;
  color: string;
};

/** IMF board compression: how 190 members map into chair clusters */
export const IMF_CHAIR_BUCKETS: ChairBucket[] = [
  {
    id: "single",
    label: "Single-country chairs (US, JP, CN, DE, FR, UK, …)",
    chairs: 8,
    membersApprox: 8,
    voteSharePct: 42,
    color: "#0f766e",
  },
  {
    id: "eu-mixed",
    label: "European multi-country chairs",
    chairs: 6,
    membersApprox: 35,
    voteSharePct: 22,
    color: "#4f46e5",
  },
  {
    id: "eme-asia",
    label: "Emerging Asia & Pacific chairs",
    chairs: 4,
    membersApprox: 40,
    voteSharePct: 14,
    color: "#d97706",
  },
  {
    id: "latam",
    label: "Latin America & Caribbean chairs",
    chairs: 3,
    membersApprox: 30,
    voteSharePct: 9,
    color: "#dc2626",
  },
  {
    id: "africa",
    label: "Africa chairs",
    chairs: 3,
    membersApprox: 45,
    voteSharePct: 7,
    color: "#be123c",
  },
  {
    id: "other",
    label: "Other mixed chairs",
    chairs: 0,
    membersApprox: 32,
    voteSharePct: 6,
    color: "#64748b",
  },
];

export const SOURCES = [
  {
    label: "IMF — Members' Quotas and Voting Power",
    url: IMF_QUOTAS_URL,
  },
  {
    label: "World Bank — IBRD Voting Power",
    url: IBRD_VOTES_URL,
  },
  {
    label: "UN Security Council",
    url: UNSC_URL,
  },
];

export function imfGapPp(m: InstitutionMember): number {
  return Math.round((m.imfVotePct - m.gdpPppPct) * 10) / 10;
}

export function ibrdGapPp(m: InstitutionMember): number {
  return Math.round((m.ibrdVotePct - m.gdpPppPct) * 10) / 10;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} pp`;
}
