/**
 * Measurement & science — Q3 2026 vintage update.
 * Prior post: measurement-science-update-2026 (NSF/NSB State of S&E 2026 —
 * China 30% vs US 29% PPP GERD share; US+China 59%; pubs CN 31% / US 12%).
 * Newest vintage: OECD MSTI March/April 2026 statistical release +
 * AAAS Global R&D Update (9 Jun 2026) synthesizing OECD / WoS / WIPO.
 *
 * Core delta: the PPP “overtake” narrows on finer shares (29.4% vs 29.1%),
 * vanishes under OECD PPP-sensitivity and EXR frames, while concentration
 * deepens in China’s business BERD (+$100B vs US) and non-OECD ledger
 * (China = 92.3% of non-OECD R&D).
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Q3 vintage delta vs prior update (NSF/NSB State of U.S. Science & Engineering 2026 / Indicators Discovery — 2024 GERD year). Newest prints: OECD Main Science and Technology Indicators March/April 2026 release (PPP vs EXR sensitivity; OECD-area growth; GBARD defence reorientation) and AAAS Global R&D Update 2026 (9 Jun 2026) for finer global shares (CN 29.4% / US 29.1%), business-sector BERD gap (+$100B China vs US, constant 2020 PPP), and government-sector lead (US +$19B). Do not mix domestic NCSES US R&D totals with OECD-comparable GERD; PPPs are GDP PPPs, not R&D-specific.";

export const SOURCES = [
  {
    label: "OECD — MSTI March 2026: R&D growth stable; GBARD towards defence",
    url: "https://www.oecd.org/en/data/insights/statistical-releases/2026/03/oecd-overall-rd-growth-stable-government-rd-budgets-decline-and-reorient-towards-defence.html",
  },
  {
    label: "AAAS — Global R&D Update 2026 (9 Jun 2026)",
    url: "https://www.aaas.org/sites/default/files/2026-06/AAAS%20Global%20RD%20Update%202026.pdf",
  },
  {
    label: "Prior theme update — NSF State of S&E 2026 vintage",
    url: "/blog/measurement-science-update-2026",
  },
  {
    label: "NSF/NSB — State of U.S. Science and Engineering 2026",
    url: "https://www.ncses.nsf.gov/pubs/nsbsep20261",
  },
] as const;

/** Headline meters — prior NSF print vs OECD/AAAS Q3 refresh */
export const HEADLINE = {
  priorChinaSharePct: 30,
  priorUsSharePct: 29,
  priorUsChinaSharePct: 59,
  priorGapPp: 1,
  priorGlobalGerdTn: 3.48,
  chinaSharePct: 29.4,
  usSharePct: 29.1,
  usChinaSharePct: 58.5,
  gapPp: 0.3,
  gapDeltaPp: -0.7,
  chinaNonOecdSharePct: 92.3,
  businessBerdGapBn: 100,
  govtUsLeadBn: 19,
  chinaVsUsPppRatioPct: 102,
  chinaVsUsAltPppLowPct: 90,
  chinaVsUsAltPppHighPct: 95,
  chinaVsUsExrPct: 50,
  usGerdGrowthPct: 3.4,
  euGerdGrowthPct: 0.4,
  germanyGerdGrowthPct: -0.4,
  oecdIntensityPct: 2.7,
  oecdBusinessFundSharePct: 64,
  oecdGovFundSharePct: 23,
  oecdBusinessFundTn: 1.45,
  chinaOvertakeFragile: true,
} as const;

export type EconomyId =
  | "usa"
  | "chn"
  | "jpn"
  | "deu"
  | "kor"
  | "eu27"
  | "gbr"
  | "fra"
  | "twn";

export const ECONOMY_META: Record<
  EconomyId,
  { label: string; short: string; color: string }
> = {
  usa: { label: "United States", short: "US", color: "#0ea5e9" },
  chn: { label: "China", short: "China", color: "#f43f5e" },
  jpn: { label: "Japan", short: "Japan", color: "#14b8a6" },
  deu: { label: "Germany", short: "Germany", color: "#f59e0b" },
  kor: { label: "South Korea", short: "Korea", color: "#6366f1" },
  eu27: { label: "EU-27", short: "EU-27", color: "#8b5cf6" },
  gbr: { label: "United Kingdom", short: "UK", color: "#ec4899" },
  fra: { label: "France", short: "France", color: "#84cc16" },
  twn: { label: "Taiwan", short: "Taiwan", color: "#06b6d4" },
};

/** Share restatement: NSF rounded print → AAAS/OECD finer shares */
export type ShareRestateRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  priorPct: number;
  newPct: number;
  deltaPp: number;
  confidence: Confidence;
};

export const SHARE_RESTATE: ShareRestateRow[] = [
  {
    id: "chn",
    label: "China",
    short: "China",
    color: "#f43f5e",
    priorPct: 30,
    newPct: 29.4,
    deltaPp: -0.6,
    confidence: "disclosed",
  },
  {
    id: "usa",
    label: "United States",
    short: "US",
    color: "#0ea5e9",
    priorPct: 29,
    newPct: 29.1,
    deltaPp: 0.1,
    confidence: "disclosed",
  },
  {
    id: "duo",
    label: "US + China",
    short: "US+CN",
    color: "#64748b",
    priorPct: 59,
    newPct: 58.5,
    deltaPp: -0.5,
    confidence: "disclosed",
  },
];

/** Measurement-frame ladder: same 2024 GERD, different converters */
export type MeasureFrameRow = {
  id: string;
  label: string;
  chinaVsUsPct: number;
  overtake: boolean;
  detail: string;
  confidence: Confidence;
};

export const MEASURE_FRAMES: MeasureFrameRow[] = [
  {
    id: "nsf-ppp",
    label: "NSF State of S&E PPP (prior)",
    chinaVsUsPct: 102,
    overtake: true,
    detail: "CN $1.028T / US $1.009T → ~102%; rounded shares 30% vs 29%",
    confidence: "disclosed",
  },
  {
    id: "oecd-2024-ppp",
    label: "OECD 2024 current PPP",
    chinaVsUsPct: 102,
    overtake: true,
    detail: "Both cross ~$1T in 2024 prices; China edges ahead",
    confidence: "disclosed",
  },
  {
    id: "alt-ppp",
    label: "OECD alternate PPP sensitivity",
    chinaVsUsPct: 92.5,
    overtake: false,
    detail: "If 4 yuan ≈ $1 R&D input (vs ~3.5 latest PPP), China ~90–95% of US",
    confidence: "estimated",
  },
  {
    id: "exr",
    label: "Market exchange rates",
    chinaVsUsPct: 50,
    overtake: false,
    detail: "China ~50% of US in 2024 EXR terms (up from 44% in 2014)",
    confidence: "disclosed",
  },
];

/** Sectoral BERD / government gap — AAAS on OECD 2024 */
export type SectorGapRow = {
  id: string;
  label: string;
  chinaLeadBn: number;
  detail: string;
  confidence: Confidence;
  color: string;
};

export const SECTOR_GAPS: SectorGapRow[] = [
  {
    id: "business",
    label: "Business / private BERD",
    chinaLeadBn: 100,
    detail: "China outspent US by ~$100B (const 2020 PPP)",
    confidence: "disclosed",
    color: "#f43f5e",
  },
  {
    id: "government",
    label: "Government sector",
    chinaLeadBn: -19,
    detail: "US still leads China by ~$19B in government R&D",
    confidence: "disclosed",
    color: "#0ea5e9",
  },
];

/** OECD-area real GERD growth 2024 (selected) */
export type GrowthRow = {
  id: string;
  label: string;
  short: string;
  growthPct: number;
  color: string;
  confidence: Confidence;
};

export const OECD_GROWTH: GrowthRow[] = [
  {
    id: "usa",
    label: "United States",
    short: "US",
    growthPct: 3.4,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "eu27",
    label: "European Union",
    short: "EU",
    growthPct: 0.4,
    color: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    id: "deu",
    label: "Germany",
    short: "Germany",
    growthPct: -0.4,
    color: "#f59e0b",
    confidence: "disclosed",
  },
  {
    id: "jpn",
    label: "Japan",
    short: "Japan",
    growthPct: 5.2,
    color: "#14b8a6",
    confidence: "estimated",
  },
  {
    id: "kor",
    label: "South Korea",
    short: "Korea",
    growthPct: 5.5,
    color: "#6366f1",
    confidence: "estimated",
  },
];

/** Concentration meters — prior NSF vs Q3 OECD/AAAS */
export type ConcentrationMeter = {
  label: string;
  prior: string;
  neu: string;
  delta: string;
  detail: string;
};

export const CONCENTRATION_METERS: ConcentrationMeter[] = [
  {
    label: "China vs US PPP share gap",
    prior: "+1.0 pp (30–29)",
    neu: "+0.3 pp (29.4–29.1)",
    delta: "−0.7 pp",
    detail: "Overtake still holds on finer AAAS shares — barely",
  },
  {
    label: "US + China GERD share",
    prior: "59%",
    neu: "58.5%",
    delta: "−0.5 pp",
    detail: "Duopoly still ~three-fifths of OECD-coverage world",
  },
  {
    label: "China / non-OECD R&D",
    prior: "n/a in prior post",
    neu: "92.3%",
    delta: "new meter",
    detail: "Non-OECD ledger is almost entirely China",
  },
  {
    label: "Business BERD gap (CN−US)",
    prior: "not broken out",
    neu: "+$100B",
    delta: "new",
    detail: "Constant 2020 PPP; private sector drives the overtake",
  },
  {
    label: "Gov R&D gap (US−CN)",
    prior: "not broken out",
    neu: "+$19B US",
    delta: "new",
    detail: "Public ledger still favors the United States",
  },
  {
    label: "EXR China / US ratio",
    prior: "PPP-only frame",
    neu: "~50%",
    delta: "frame add",
    detail: "Market FX keeps US clearly ahead on dollar bills",
  },
  {
    label: "Alt-PPP China / US",
    prior: "~102%",
    neu: "90–95%",
    delta: "sensitivity",
    detail: "OECD caveat: GDP PPPs are not R&D PPPs",
  },
  {
    label: "OECD R&D intensity",
    prior: "not restated",
    neu: "2.7%",
    delta: "plateau",
    detail: "OECD area intensity flat 2020–2024",
  },
];

/** Funding mix — OECD area 2023 (AAAS Figure 1.2) */
export type FundingMixRow = {
  id: string;
  label: string;
  sharePct: number;
  dollarsTn: number | null;
  color: string;
  confidence: Confidence;
};

export const FUNDING_MIX: FundingMixRow[] = [
  {
    id: "business",
    label: "Business",
    sharePct: 64,
    dollarsTn: 1.45,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "government",
    label: "Government",
    sharePct: 23,
    dollarsTn: null,
    color: "#f59e0b",
    confidence: "disclosed",
  },
  {
    id: "other",
    label: "HE / nonprofit / other",
    sharePct: 13,
    dollarsTn: null,
    color: "#94a3b8",
    confidence: "estimated",
  },
];

/** Long-run sector index growth since 1992 (AAAS Fig 1.3 highlights) */
export type SectorIndexRow = {
  id: string;
  label: string;
  growthPct: number;
  color: string;
  confidence: Confidence;
};

export const SECTOR_INDEX_GROWTH: SectorIndexRow[] = [
  {
    id: "he",
    label: "Higher ed / nonprofit",
    growthPct: 332,
    color: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    id: "business",
    label: "Business financing",
    growthPct: 303,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "government",
    label: "Government financing",
    growthPct: 65,
    color: "#f59e0b",
    confidence: "disclosed",
  },
];

/** Scoreboard: China leads across AAAS metrics (qualitative + share anchors) */
export type ScoreboardRow = {
  id: string;
  label: string;
  leader: "China" | "United States";
  priorNote: string;
  q3Note: string;
  color: string;
};

export const SCOREBOARD: ScoreboardRow[] = [
  {
    id: "gerd",
    label: "GERD dollars (PPP)",
    leader: "China",
    priorNote: "NSF: CN $1.028T > US $1.009T",
    q3Note: "AAAS: CN 29.4% vs US 29.1% world share",
    color: "#f43f5e",
  },
  {
    id: "researchers",
    label: "Researcher FTEs",
    leader: "China",
    priorNote: "Not the prior post’s focus",
    q3Note: "China widens FTE gap through 2024 (AAAS)",
    color: "#f43f5e",
  },
  {
    id: "papers",
    label: "S&E publications",
    leader: "China",
    priorNote: "Prior: CN 31% / US 12% (2024)",
    q3Note: "AAAS: China still volume #1",
    color: "#f43f5e",
  },
  {
    id: "patents",
    label: "PCT patent filings",
    leader: "China",
    priorNote: "Not in prior GERD update",
    q3Note: "#1 since ~2012; ICT ~3× #2 filer",
    color: "#f43f5e",
  },
];

/** EU vs US PPP ratio path (OECD release) */
export type EuUsRatioRow = {
  year: number;
  euVsUsPppPct: number;
  euVsUsExrPct: number;
  confidence: Confidence;
};

export const EU_US_RATIO: EuUsRatioRow[] = [
  { year: 2014, euVsUsPppPct: 70, euVsUsExrPct: 57, confidence: "disclosed" },
  { year: 2024, euVsUsPppPct: 60, euVsUsExrPct: 43, confidence: "disclosed" },
];

export function rankedGrowth(): GrowthRow[] {
  return [...OECD_GROWTH].sort((a, b) => b.growthPct - a.growthPct);
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtBn(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}$${Math.abs(n).toFixed(digits)}B`;
}

export function fmtRatio(n: number): string {
  return `${n.toFixed(0)}% of US`;
}
