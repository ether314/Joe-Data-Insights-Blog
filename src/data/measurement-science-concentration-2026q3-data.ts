/**
 * Measurement & science — Q3 2026 concentration / market-share lens.
 *
 * Core question: How concentrated is this system at the top of the distribution?
 * (Where is progress funded and published — is it concentrating?)
 *
 * Q3 vintage complements the 2026 concentration print by asking whether the
 * OECD/AAAS converter restatement *changed* top-of-distribution meters:
 * (1) PPP vs alt-PPP vs EXR frame concentration,
 * (2) business BERD vs government sector splits,
 * (3) non-OECD ledger extreme (China 92.3%),
 * (4) vintage slope of Top-1 / Top-3 / HHI from NSF rounded → AAAS finer shares,
 * while retaining pubs / CET / KTI as secondary perimeters.
 *
 * Primary sources: OECD MSTI Mar/Apr 2026; AAAS Global R&D Update 2026 (9 Jun);
 * NSF/NSB State of S&E 2026; prior theme concentration + Q3/Aug updates.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Q3 concentration lens. GERD PPP shares: OECD/AAAS March–June 2026 restatement of 2024 (China 29.4% / US 29.1%; US+China 58.5%). Converter frames: China vs US ≈102% at headline PPP, 90–95% under alternate PPP sensitivity, ~50% at market exchange rates. Business BERD gap +$100B China vs US (constant 2020 PPP); US government-sector lead +$19B. Non-OECD R&D: China 92.3%. Pubs: NSF Indicators 2024 (CN 31% / US 12% / India 7%; top-3 = 50%). CET AI priority patent families: NSF Translation (~75% China). KTI VA: NSF State of S&E 2026 (US 28% / China 25% / EU-27 18%). HHI is analytical on stated buckets (0–10,000). Do not splice China NBS yuan GERD into PPP world shares.";

export const SOURCES = [
  {
    label: "OECD — MSTI March 2026 statistical release",
    url: "https://www.oecd.org/en/data/insights/statistical-releases/2026/03/oecd-overall-rd-growth-stable-government-rd-budgets-decline-and-reorient-towards-defence.html",
  },
  {
    label: "AAAS — Global R&D Update 2026 (9 Jun 2026)",
    url: "https://www.aaas.org/sites/default/files/2026-06/AAAS%20Global%20RD%20Update%202026.pdf",
  },
  {
    label: "NSF/NSB — State of U.S. Science and Engineering 2026",
    url: "https://www.ncses.nsf.gov/pubs/nsbsep20261",
  },
  {
    label: "Prior concentration lens (2026)",
    url: "/blog/measurement-science-concentration-2026",
  },
  {
    label: "Q3 theme update — OECD/AAAS restatement",
    url: "/blog/measurement-science-update-2026q3",
  },
] as const;

export const PRIOR_CONCENTRATION_PATH =
  "/blog/measurement-science-concentration-2026";
export const PRIOR_RESEARCH_PATH = "/blog/measurement-science-research-2026";
export const PRIOR_Q3_PATH = "/blog/measurement-science-update-2026q3";
export const PRIOR_AUG608_PATH = "/blog/measurement-science-update-202608";
export const PRIOR_AUG_PATH = "/blog/measurement-science-update-2026";

/** Headline punchline — Top-1 / Top-3 under Q3 converter restatement */
export const HEADLINE = {
  /** GERD PPP 2024 — OECD/AAAS knife-edge */
  gerdTop1Pct: 29.4,
  gerdTop1Label: "China",
  gerdTop3Pct: 65.2,
  gerdTop3Labels: "China + US + Japan",
  gerdUsChinaPct: 58.5,
  gerdUsPct: 29.1,
  gerdJapanPct: 6.7,
  gerdGapPp: 0.3,
  gerdPriorGapPp: 1.0,
  gerdWorldTn: 3.48,
  gerdHhi: 1890,
  gerdPriorTop1Pct: 30,
  gerdPriorUsPct: 29,
  gerdPriorUsChinaPct: 59,
  gerdPriorHhi: 1920,

  /** Converter frames — China GERD as % of US */
  chinaVsUsPppPct: 102,
  chinaVsUsAltPppLowPct: 90,
  chinaVsUsAltPppHighPct: 95,
  chinaVsUsExrPct: 50,

  /** Sector concentration */
  businessBerdGapBn: 100,
  govtUsLeadBn: 19,
  nonOecdChinaPct: 92.3,
  oecdBusinessFundSharePct: 64,
  oecdGovFundSharePct: 23,

  /** S&E publication volume 2024 */
  pubsTop1Pct: 31,
  pubsTop1Label: "China",
  pubsTop3Pct: 50,
  pubsTop3Labels: "China + US + India",
  pubsUsPct: 12,
  pubsIndiaPct: 7,
  pubsHhi: 1320,

  /** CET AI priority patent families */
  cetAiTop1Pct: 75,
  cetAiTop1Label: "China",
  cetAiTop3Pct: 92,
  cetSemiChinaPct: 42,
  cetQistChinaPct: 48,

  /** KTI world value-added */
  ktiTop1Pct: 28,
  ktiTop1Label: "United States",
  ktiTop3Pct: 71,
  ktiChinaPct: 25,
  ktiEuPct: 18,
  ktiWorldTn: 11.7,
  ktiHhi: 1780,

  equalFiveHhi: 2000,
} as const;

export type PerimeterId = "gerd" | "pubs" | "cet" | "kti" | "nonOecd";

export type ScoreboardRow = {
  id: PerimeterId;
  label: string;
  top1Pct: number;
  top1Label: string;
  top3Pct: number;
  top3Labels: string;
  hhi: number;
  color: string;
  confidence: Confidence;
  note: string;
};

export const SCOREBOARD: ScoreboardRow[] = [
  {
    id: "gerd",
    label: "GERD funding (PPP)",
    top1Pct: HEADLINE.gerdTop1Pct,
    top1Label: HEADLINE.gerdTop1Label,
    top3Pct: HEADLINE.gerdTop3Pct,
    top3Labels: HEADLINE.gerdTop3Labels,
    hhi: HEADLINE.gerdHhi,
    color: "#f43f5e",
    confidence: "disclosed",
    note: "OECD/AAAS 2024 — knife-edge China lead (0.3 pp)",
  },
  {
    id: "pubs",
    label: "S&E publication volume",
    top1Pct: HEADLINE.pubsTop1Pct,
    top1Label: HEADLINE.pubsTop1Label,
    top3Pct: HEADLINE.pubsTop3Pct,
    top3Labels: HEADLINE.pubsTop3Labels,
    hhi: HEADLINE.pubsHhi,
    color: "#f59e0b",
    confidence: "disclosed",
    note: "NSF Indicators 2024 fractional counts",
  },
  {
    id: "cet",
    label: "CET AI priority patents",
    top1Pct: HEADLINE.cetAiTop1Pct,
    top1Label: HEADLINE.cetAiTop1Label,
    top3Pct: HEADLINE.cetAiTop3Pct,
    top3Labels: "China + US + EU-27",
    hhi: 5820,
    color: "#8b5cf6",
    confidence: "disclosed",
    note: "NSF Translation — volume extreme",
  },
  {
    id: "kti",
    label: "KTI value-added",
    top1Pct: HEADLINE.ktiTop1Pct,
    top1Label: HEADLINE.ktiTop1Label,
    top3Pct: HEADLINE.ktiTop3Pct,
    top3Labels: "US + China + EU-27",
    hhi: HEADLINE.ktiHhi,
    color: "#0ea5e9",
    confidence: "disclosed",
    note: "Near-duopoly; US still top-1 on VA",
  },
  {
    id: "nonOecd",
    label: "Non-OECD R&D ledger",
    top1Pct: HEADLINE.nonOecdChinaPct,
    top1Label: "China",
    top3Pct: 97,
    top3Labels: "China + residual non-OECD",
    hhi: 8540,
    color: "#14b8a6",
    confidence: "disclosed",
    note: "AAAS — China = 92.3% of non-OECD R&D",
  },
];

export type LadderRow = {
  rank: number;
  id: string;
  name: string;
  short: string;
  sharePct: number;
  cumulativePct: number;
  color: string;
  confidence: Confidence;
  note?: string;
};

export const GERD_LADDER: LadderRow[] = [
  {
    rank: 1,
    id: "chn",
    name: "China",
    short: "China",
    sharePct: 29.4,
    cumulativePct: 29.4,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    rank: 2,
    id: "usa",
    name: "United States",
    short: "US",
    sharePct: 29.1,
    cumulativePct: 58.5,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    rank: 3,
    id: "jpn",
    name: "Japan",
    short: "Japan",
    sharePct: 6.7,
    cumulativePct: 65.2,
    color: "#14b8a6",
    confidence: "disclosed",
  },
  {
    rank: 4,
    id: "deu",
    name: "Germany",
    short: "Germany",
    sharePct: 5.5,
    cumulativePct: 70.7,
    color: "#f59e0b",
    confidence: "disclosed",
  },
  {
    rank: 5,
    id: "kor",
    name: "South Korea",
    short: "Korea",
    sharePct: 4.7,
    cumulativePct: 75.4,
    color: "#6366f1",
    confidence: "disclosed",
  },
  {
    rank: 6,
    id: "row",
    name: "Rest of world",
    short: "RoW",
    sharePct: 24.6,
    cumulativePct: 100,
    color: "#94a3b8",
    confidence: "estimated",
    note: "Closes universe after top-5 disclosed anchors",
  },
];

export const PUB_LADDER: LadderRow[] = [
  {
    rank: 1,
    id: "chn",
    name: "China",
    short: "China",
    sharePct: 31,
    cumulativePct: 31,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    rank: 2,
    id: "usa",
    name: "United States",
    short: "US",
    sharePct: 12,
    cumulativePct: 43,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    rank: 3,
    id: "ind",
    name: "India",
    short: "India",
    sharePct: 7,
    cumulativePct: 50,
    color: "#fb923c",
    confidence: "disclosed",
  },
  {
    rank: 4,
    id: "deu",
    name: "Germany",
    short: "Germany",
    sharePct: 3,
    cumulativePct: 53,
    color: "#f59e0b",
    confidence: "estimated",
  },
  {
    rank: 5,
    id: "gbr",
    name: "United Kingdom",
    short: "UK",
    sharePct: 3,
    cumulativePct: 56,
    color: "#ec4899",
    confidence: "estimated",
  },
  {
    rank: 6,
    id: "row",
    name: "Rest of world",
    short: "RoW",
    sharePct: 44,
    cumulativePct: 100,
    color: "#94a3b8",
    confidence: "estimated",
  },
];

export const KTI_LADDER: LadderRow[] = [
  {
    rank: 1,
    id: "usa",
    name: "United States",
    short: "US",
    sharePct: 28,
    cumulativePct: 28,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    rank: 2,
    id: "chn",
    name: "China",
    short: "China",
    sharePct: 25,
    cumulativePct: 53,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    rank: 3,
    id: "eu27",
    name: "EU-27",
    short: "EU-27",
    sharePct: 18,
    cumulativePct: 71,
    color: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    rank: 4,
    id: "jpn",
    name: "Japan",
    short: "Japan",
    sharePct: 7,
    cumulativePct: 78,
    color: "#14b8a6",
    confidence: "estimated",
  },
  {
    rank: 5,
    id: "row",
    name: "Rest of world",
    short: "RoW",
    sharePct: 22,
    cumulativePct: 100,
    color: "#94a3b8",
    confidence: "estimated",
  },
];

export const NON_OECD_LADDER: LadderRow[] = [
  {
    rank: 1,
    id: "chn",
    name: "China",
    short: "China",
    sharePct: 92.3,
    cumulativePct: 92.3,
    color: "#f43f5e",
    confidence: "disclosed",
    note: "AAAS — dominates non-OECD ledger",
  },
  {
    rank: 2,
    id: "ind",
    name: "India + others",
    short: "India+",
    sharePct: 4.7,
    cumulativePct: 97,
    color: "#fb923c",
    confidence: "estimated",
  },
  {
    rank: 3,
    id: "row",
    name: "Residual non-OECD",
    short: "Rest",
    sharePct: 3,
    cumulativePct: 100,
    color: "#94a3b8",
    confidence: "estimated",
  },
];

export type CurvePoint = {
  rank: number;
  label: string;
  sharePct: number;
  equalPct: number;
};

export const GERD_CURVE: CurvePoint[] = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 29.4, equalPct: 16.7 },
  { rank: 2, label: "Top-2", sharePct: 58.5, equalPct: 33.3 },
  { rank: 3, label: "Top-3", sharePct: 65.2, equalPct: 50 },
  { rank: 4, label: "Top-4", sharePct: 70.7, equalPct: 66.7 },
  { rank: 5, label: "Top-5", sharePct: 75.4, equalPct: 83.3 },
  { rank: 6, label: "All", sharePct: 100, equalPct: 100 },
];

export const PUB_CURVE: CurvePoint[] = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 31, equalPct: 16.7 },
  { rank: 2, label: "Top-2", sharePct: 43, equalPct: 33.3 },
  { rank: 3, label: "Top-3", sharePct: 50, equalPct: 50 },
  { rank: 4, label: "Top-4", sharePct: 53, equalPct: 66.7 },
  { rank: 5, label: "Top-5", sharePct: 56, equalPct: 83.3 },
  { rank: 6, label: "All", sharePct: 100, equalPct: 100 },
];

export const KTI_CURVE: CurvePoint[] = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 28, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 53, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 71, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 78, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export const NON_OECD_CURVE: CurvePoint[] = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 92.3, equalPct: 33.3 },
  { rank: 2, label: "Top-2", sharePct: 97, equalPct: 66.7 },
  { rank: 3, label: "All", sharePct: 100, equalPct: 100 },
];

/** Converter-frame concentration — China GERD as % of US under each meter */
export type ConverterFrame = {
  id: string;
  label: string;
  short: string;
  chinaVsUsPct: number;
  worldTop1StillChina: boolean;
  concentrationRead: string;
  color: string;
  confidence: Confidence;
};

export const CONVERTER_FRAMES: ConverterFrame[] = [
  {
    id: "ppp",
    label: "Headline PPP (OECD/AAAS)",
    short: "PPP",
    chinaVsUsPct: 102,
    worldTop1StillChina: true,
    concentrationRead: "Knife-edge world top-1; US+China 58.5%",
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "altPpp",
    label: "Alternate PPP sensitivity",
    short: "Alt PPP",
    chinaVsUsPct: 92.5,
    worldTop1StillChina: false,
    concentrationRead: "US remains ahead; overtake vanishes",
    color: "#f59e0b",
    confidence: "estimated",
  },
  {
    id: "exr",
    label: "Market exchange rates",
    short: "EXR",
    chinaVsUsPct: 50,
    worldTop1StillChina: false,
    concentrationRead: "China ~half US; US clear top-1",
    color: "#0ea5e9",
    confidence: "disclosed",
  },
];

/** Sector split — who funds the concentration */
export type SectorSplitRow = {
  id: string;
  label: string;
  short: string;
  chinaLeadBn: number;
  usLeadBn: number;
  netChinaMinusUsBn: number;
  color: string;
  confidence: Confidence;
  note: string;
};

export const SECTOR_SPLITS: SectorSplitRow[] = [
  {
    id: "business",
    label: "Business BERD",
    short: "Business",
    chinaLeadBn: 100,
    usLeadBn: 0,
    netChinaMinusUsBn: 100,
    color: "#f43f5e",
    confidence: "disclosed",
    note: "Constant 2020 PPP — China business lead explains knife-edge",
  },
  {
    id: "government",
    label: "Government R&D",
    short: "Govt",
    chinaLeadBn: 0,
    usLeadBn: 19,
    netChinaMinusUsBn: -19,
    color: "#0ea5e9",
    confidence: "disclosed",
    note: "US still leads government-sector R&D dollars",
  },
];

/** Vintage slope — NSF rounded → AAAS finer shares */
export type VintagePoint = {
  vintage: string;
  short: string;
  chinaPct: number;
  usPct: number;
  usChinaPct: number;
  gapPp: number;
  top3Pct: number;
  hhi: number;
};

export const VINTAGE_SLOPE: VintagePoint[] = [
  {
    vintage: "NSF State of S&E 2026 (rounded)",
    short: "NSF",
    chinaPct: 30,
    usPct: 29,
    usChinaPct: 59,
    gapPp: 1.0,
    top3Pct: 66,
    hhi: 1920,
  },
  {
    vintage: "OECD/AAAS Q3 restatement",
    short: "Q3 AAAS",
    chinaPct: 29.4,
    usPct: 29.1,
    usChinaPct: 58.5,
    gapPp: 0.3,
    top3Pct: 65.2,
    hhi: 1890,
  },
];

/** CET field concentration — China share by critical-tech family */
export type CetFieldRow = {
  id: string;
  label: string;
  short: string;
  chinaSharePct: number;
  color: string;
  confidence: Confidence;
};

export const CET_FIELDS: CetFieldRow[] = [
  {
    id: "ai",
    label: "Artificial intelligence",
    short: "AI",
    chinaSharePct: 75,
    color: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    id: "qist",
    label: "Quantum / IST",
    short: "QIST",
    chinaSharePct: 48,
    color: "#6366f1",
    confidence: "disclosed",
  },
  {
    id: "semi",
    label: "Semiconductors",
    short: "Semi",
    chinaSharePct: 42,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "biotech",
    label: "Biotechnology",
    short: "Bio",
    chinaSharePct: 35,
    color: "#14b8a6",
    confidence: "estimated",
  },
];

/** Volume × impact scatter anchors */
export type VolumeImpactRow = {
  id: string;
  name: string;
  short: string;
  pubSharePct: number;
  hcaRatePct: number;
  gerdSharePct: number | null;
  color: string;
};

export const VOLUME_IMPACT: VolumeImpactRow[] = [
  {
    id: "chn",
    name: "China",
    short: "China",
    pubSharePct: 31,
    hcaRatePct: 1.3,
    gerdSharePct: 29.4,
    color: "#f43f5e",
  },
  {
    id: "usa",
    name: "United States",
    short: "US",
    pubSharePct: 12,
    hcaRatePct: 1.7,
    gerdSharePct: 29.1,
    color: "#0ea5e9",
  },
  {
    id: "ind",
    name: "India",
    short: "India",
    pubSharePct: 7,
    hcaRatePct: 0.9,
    gerdSharePct: null,
    color: "#fb923c",
  },
  {
    id: "deu",
    name: "Germany",
    short: "DE",
    pubSharePct: 3,
    hcaRatePct: 1.5,
    gerdSharePct: 5.5,
    color: "#f59e0b",
  },
  {
    id: "gbr",
    name: "United Kingdom",
    short: "UK",
    pubSharePct: 3,
    hcaRatePct: 1.6,
    gerdSharePct: null,
    color: "#ec4899",
  },
];

/** HHI by lens for compare panel */
export const HHI_BY_LENS = [
  { id: "gerd", label: "GERD PPP", hhi: HEADLINE.gerdHhi, color: "#f43f5e" },
  { id: "pubs", label: "Publications", hhi: HEADLINE.pubsHhi, color: "#f59e0b" },
  { id: "kti", label: "KTI VA", hhi: HEADLINE.ktiHhi, color: "#0ea5e9" },
  { id: "cet", label: "CET AI", hhi: 5820, color: "#8b5cf6" },
  { id: "nonOecd", label: "Non-OECD", hhi: 8540, color: "#14b8a6" },
] as const;

export const CAVEATS = [
  "PPP world shares and China NBS yuan GERD are different meters — never splice ¥3.93T domestic into the 29.4/29.1 frame without conversion.",
  "Alternate PPP sensitivity (90–95% China vs US) and EXR (~50%) reverse the headline overtake; concentration answers are frame-dependent.",
  "HHI values are analytical indexes on disclosed/estimated bucket shares, not official NSF or OECD statistics.",
  "HCA rates are share-of-own-articles in the top 1% cited — not world HCA market shares.",
  "Mid-rank GERD residuals and non-AI CET fields carry estimated shares that close the universe after disclosed anchors.",
  "Business BERD gap (+$100B) is constant-2020 PPP; nominal EXR gaps look different.",
] as const;

export function ladderFor(id: PerimeterId): LadderRow[] {
  switch (id) {
    case "gerd":
      return GERD_LADDER;
    case "pubs":
      return PUB_LADDER;
    case "kti":
      return KTI_LADDER;
    case "nonOecd":
      return NON_OECD_LADDER;
    case "cet":
      return [
        {
          rank: 1,
          id: "chn",
          name: "China",
          short: "China",
          sharePct: 75,
          cumulativePct: 75,
          color: "#f43f5e",
          confidence: "disclosed",
        },
        {
          rank: 2,
          id: "usa",
          name: "United States",
          short: "US",
          sharePct: 12,
          cumulativePct: 87,
          color: "#0ea5e9",
          confidence: "estimated",
        },
        {
          rank: 3,
          id: "eu27",
          name: "EU-27",
          short: "EU-27",
          sharePct: 5,
          cumulativePct: 92,
          color: "#8b5cf6",
          confidence: "estimated",
        },
        {
          rank: 4,
          id: "row",
          name: "Rest of world",
          short: "RoW",
          sharePct: 8,
          cumulativePct: 100,
          color: "#94a3b8",
          confidence: "estimated",
        },
      ];
  }
}

export function curveFor(id: PerimeterId): CurvePoint[] {
  switch (id) {
    case "gerd":
      return GERD_CURVE;
    case "pubs":
      return PUB_CURVE;
    case "kti":
      return KTI_CURVE;
    case "nonOecd":
      return NON_OECD_CURVE;
    case "cet":
      return [
        { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
        { rank: 1, label: "Top-1", sharePct: 75, equalPct: 25 },
        { rank: 2, label: "Top-2", sharePct: 87, equalPct: 50 },
        { rank: 3, label: "Top-3", sharePct: 92, equalPct: 75 },
        { rank: 4, label: "All", sharePct: 100, equalPct: 100 },
      ];
  }
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtBn(n: number): string {
  return `$${n}B`;
}
