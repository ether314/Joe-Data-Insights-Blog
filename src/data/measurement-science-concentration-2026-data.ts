/**
 * Measurement & science — concentration lens (Top-1 / Top-3 / HHI).
 *
 * Core question: How concentrated is this system at the top of the distribution?
 * (Where is progress funded and published — is it concentrating?)
 *
 * Four perimeters:
 * 1. GERD funding (PPP world share — OECD/AAAS 2024 restatement)
 * 2. S&E publication volume (NSF Indicators 2024 articles)
 * 3. CET priority patent families (NSF Translation — AI extreme)
 * 4. KTI value-added (NSF State of S&E 2026)
 *
 * Complements research (2022 stock), August NSF update, Q3 OECD restatement,
 * and Aug 202608 China domestic flow + CET meters.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Concentration lens across four perimeters. GERD shares: OECD/AAAS March–June 2026 restatement of 2024 PPP GERD (China 29.4% / US 29.1%); NSF/NSB State of S&E 2026 world total ~$3.48T. Publication shares: NSF Indicators 2024 fractional-count S&E articles (China 31% / US 12% / India 7%; top-3 = 50%). CET international priority patent families: NSF Indicators Translation thematic report (China AI ~75% volume). KTI value-added: NSF State of S&E 2026 (US 28% / China 25% / EU-27 18% of ~$11.7T). HCA rates are share-of-own-articles in top 1% cited — not world HCA market shares. Mid-rank GERD and CET non-AI fields carry estimated residuals. Do not splice China NBS yuan GERD into PPP world shares.";

export const SOURCES = [
  {
    label: "NSF/NSB — State of U.S. Science and Engineering 2026",
    url: "https://www.ncses.nsf.gov/pubs/nsbsep20261",
  },
  {
    label: "OECD Main Science and Technology Indicators",
    url: "https://www.oecd.org/en/data/datasets/main-science-and-technology-indicators.html",
  },
  {
    label: "August theme update — China flow + CET patents",
    url: "/blog/measurement-science-update-202608",
  },
  {
    label: "Q3 theme update — OECD/AAAS 2024 restatement",
    url: "/blog/measurement-science-update-2026q3",
  },
  {
    label: "2022 research ledger",
    url: "/blog/measurement-science-research-2026",
  },
] as const;

export const PRIOR_RESEARCH_PATH = "/blog/measurement-science-research-2026";
export const PRIOR_AUG_PATH = "/blog/measurement-science-update-2026";
export const PRIOR_Q3_PATH = "/blog/measurement-science-update-2026q3";
export const PRIOR_AUG608_PATH = "/blog/measurement-science-update-202608";

/** Headline punchline — Top-1 / Top-3 across perimeters */
export const HEADLINE = {
  /** GERD PPP 2024 — OECD/AAAS knife-edge */
  gerdTop1Pct: 29.4,
  gerdTop1Label: "China",
  gerdTop3Pct: 65.2,
  gerdTop3Labels: "China + US + Japan",
  gerdUsChinaPct: 58.5,
  gerdUsPct: 29.1,
  gerdJapanPct: 6.7,
  gerdWorldTn: 3.48,
  gerdHhi: 1890,

  /** S&E publication volume 2024 */
  pubsTop1Pct: 31,
  pubsTop1Label: "China",
  pubsTop3Pct: 50,
  pubsTop3Labels: "China + US + India",
  pubsUsPct: 12,
  pubsIndiaPct: 7,
  pubsWorldM: 3.5,
  pubsHhi: 1320,

  /** CET AI priority patent families 2024 */
  cetAiTop1Pct: 75,
  cetAiTop1Label: "China",
  cetAiTop3Pct: 92,
  cetAiTop3Labels: "China + US + EU-27",
  cetSemiChinaPct: 42,
  cetQistChinaPct: 48,

  /** KTI world value-added */
  ktiTop1Pct: 28,
  ktiTop1Label: "United States",
  ktiTop3Pct: 71,
  ktiTop3Labels: "US + China + EU-27",
  ktiChinaPct: 25,
  ktiEuPct: 18,
  ktiWorldTn: 11.7,

  /** HCA rate contrast (not world share) */
  usHcaRatePct: 1.7,
  chinaHcaRatePct: 1.3,
  equalFiveHhi: 2000,
} as const;

export type PerimeterId = "gerd" | "pubs" | "cet" | "kti";

export type ScoreboardRow = {
  id: PerimeterId;
  label: string;
  top1Pct: number;
  top1Label: string;
  top3Pct: number;
  top3Labels: string;
  extraMetric: string;
  extraValue: string;
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
    extraMetric: "US+China",
    extraValue: `${HEADLINE.gerdUsChinaPct}%`,
    color: "#f43f5e",
    confidence: "disclosed",
    note: "OECD/AAAS 2024 restatement — knife-edge China lead",
  },
  {
    id: "pubs",
    label: "S&E publication volume",
    top1Pct: HEADLINE.pubsTop1Pct,
    top1Label: HEADLINE.pubsTop1Label,
    top3Pct: HEADLINE.pubsTop3Pct,
    top3Labels: HEADLINE.pubsTop3Labels,
    extraMetric: "World articles",
    extraValue: `~${HEADLINE.pubsWorldM}M`,
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
    top3Labels: HEADLINE.cetAiTop3Labels,
    extraMetric: "Semi China",
    extraValue: `${HEADLINE.cetSemiChinaPct}%`,
    color: "#8b5cf6",
    confidence: "disclosed",
    note: "NSF Translation — volume extreme; US still leads citations",
  },
  {
    id: "kti",
    label: "KTI value-added",
    top1Pct: HEADLINE.ktiTop1Pct,
    top1Label: HEADLINE.ktiTop1Label,
    top3Pct: HEADLINE.ktiTop3Pct,
    top3Labels: HEADLINE.ktiTop3Labels,
    extraMetric: "World KTI",
    extraValue: `$${HEADLINE.ktiWorldTn}T`,
    color: "#0ea5e9",
    confidence: "disclosed",
    note: "Near-duopoly; China leads mfg, US leads services",
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

/** GERD PPP ladder — 2024 country shares (EU-27 shown as bloc for context in compare panel) */
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
    note: "≈$234B / $3.48T NSF framing",
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

/** Lorenz-style curves vs equal-split benchmark */
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

/** Concentration path — GERD Top-1 / Top-3 / US+China over time */
export type PathRow = {
  year: number;
  top1Pct: number;
  top3Pct: number;
  usChinaPct: number;
  pubsTop1Pct: number;
  pubsTop3Pct: number;
  confidence: Confidence;
};

export const CONCENTRATION_PATH: PathRow[] = [
  {
    year: 2000,
    top1Pct: 39,
    top3Pct: 68,
    usChinaPct: 44,
    pubsTop1Pct: 27,
    pubsTop3Pct: 41,
    confidence: "estimated",
  },
  {
    year: 2010,
    top1Pct: 31,
    top3Pct: 57,
    usChinaPct: 46,
    pubsTop1Pct: 20,
    pubsTop3Pct: 40,
    confidence: "disclosed",
  },
  {
    year: 2016,
    top1Pct: 30,
    top3Pct: 58,
    usChinaPct: 51,
    pubsTop1Pct: 20,
    pubsTop3Pct: 41.5,
    confidence: "estimated",
  },
  {
    year: 2020,
    top1Pct: 30,
    top3Pct: 60,
    usChinaPct: 55,
    pubsTop1Pct: 24,
    pubsTop3Pct: 44.5,
    confidence: "estimated",
  },
  {
    year: 2022,
    top1Pct: 30,
    top3Pct: 63.5,
    usChinaPct: 57,
    pubsTop1Pct: 27,
    pubsTop3Pct: 47,
    confidence: "disclosed",
  },
  {
    year: 2024,
    top1Pct: 29.4,
    top3Pct: 65.2,
    usChinaPct: 58.5,
    pubsTop1Pct: 31,
    pubsTop3Pct: 50,
    confidence: "disclosed",
  },
];

/** CET patent China volume shares by field */
export type CetFieldRow = {
  id: string;
  label: string;
  short: string;
  chinaSharePct: number;
  usCitationLead: boolean;
  color: string;
  confidence: Confidence;
};

export const CET_FIELDS: CetFieldRow[] = [
  {
    id: "ai",
    label: "Artificial intelligence",
    short: "AI",
    chinaSharePct: 75,
    usCitationLead: true,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "qist",
    label: "Quantum information",
    short: "QIST",
    chinaSharePct: 48,
    usCitationLead: true,
    color: "#8b5cf6",
    confidence: "estimated",
  },
  {
    id: "semi",
    label: "Semiconductors",
    short: "Semi",
    chinaSharePct: 42,
    usCitationLead: true,
    color: "#6366f1",
    confidence: "estimated",
  },
  {
    id: "nuclear",
    label: "Advanced nuclear",
    short: "Nuclear",
    chinaSharePct: 40,
    usCitationLead: true,
    color: "#f59e0b",
    confidence: "estimated",
  },
  {
    id: "biotech",
    label: "Biotechnology",
    short: "Biotech",
    chinaSharePct: 38,
    usCitationLead: true,
    color: "#14b8a6",
    confidence: "estimated",
  },
];

/** Illustrative CET AI residual ladder (China disclosed; others estimated to close) */
export const CET_AI_LADDER: LadderRow[] = [
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

/** Volume vs impact scatter — pub share × HCA rate */
export type VolumeImpactRow = {
  id: string;
  name: string;
  short: string;
  pubSharePct: number;
  hcaRatePct: number;
  gerdSharePct: number | null;
  color: string;
  confidence: Confidence;
};

export const VOLUME_IMPACT: VolumeImpactRow[] = [
  {
    id: "usa",
    name: "United States",
    short: "US",
    pubSharePct: 12,
    hcaRatePct: 1.7,
    gerdSharePct: 29.1,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "chn",
    name: "China",
    short: "China",
    pubSharePct: 31,
    hcaRatePct: 1.3,
    gerdSharePct: 29.4,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "ind",
    name: "India",
    short: "India",
    pubSharePct: 7,
    hcaRatePct: 1.1,
    gerdSharePct: null,
    color: "#fb923c",
    confidence: "disclosed",
  },
  {
    id: "deu",
    name: "Germany",
    short: "Germany",
    pubSharePct: 3,
    hcaRatePct: 1.3,
    gerdSharePct: 5.5,
    color: "#f59e0b",
    confidence: "estimated",
  },
  {
    id: "gbr",
    name: "United Kingdom",
    short: "UK",
    pubSharePct: 3,
    hcaRatePct: 1.7,
    gerdSharePct: null,
    color: "#ec4899",
    confidence: "estimated",
  },
  {
    id: "jpn",
    name: "Japan",
    short: "Japan",
    pubSharePct: 3,
    hcaRatePct: 1.1,
    gerdSharePct: 6.7,
    color: "#14b8a6",
    confidence: "estimated",
  },
];

/** Donut slices for selected perimeter top shares */
export type DonutSlice = {
  id: string;
  name: string;
  sharePct: number;
  color: string;
};

export function gerdDonut(): DonutSlice[] {
  return GERD_LADDER.map((r) => ({
    id: r.id,
    name: r.short,
    sharePct: r.sharePct,
    color: r.color,
  }));
}

export function pubsDonut(): DonutSlice[] {
  return PUB_LADDER.map((r) => ({
    id: r.id,
    name: r.short,
    sharePct: r.sharePct,
    color: r.color,
  }));
}

export function cetDonut(): DonutSlice[] {
  return CET_AI_LADDER.map((r) => ({
    id: r.id,
    name: r.short,
    sharePct: r.sharePct,
    color: r.color,
  }));
}

export function ktiDonut(): DonutSlice[] {
  return KTI_LADDER.map((r) => ({
    id: r.id,
    name: r.short,
    sharePct: r.sharePct,
    color: r.color,
  }));
}

export function ladderFor(id: PerimeterId): LadderRow[] {
  switch (id) {
    case "gerd":
      return GERD_LADDER;
    case "pubs":
      return PUB_LADDER;
    case "cet":
      return CET_AI_LADDER;
    case "kti":
      return KTI_LADDER;
  }
}

export function curveFor(id: PerimeterId): CurvePoint[] {
  switch (id) {
    case "gerd":
      return GERD_CURVE;
    case "pubs":
      return PUB_CURVE;
    case "cet":
      return [
        { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
        { rank: 1, label: "Top-1", sharePct: 75, equalPct: 25 },
        { rank: 2, label: "Top-2", sharePct: 87, equalPct: 50 },
        { rank: 3, label: "Top-3", sharePct: 92, equalPct: 75 },
        { rank: 4, label: "All", sharePct: 100, equalPct: 100 },
      ];
    case "kti":
      return KTI_CURVE;
  }
}

export function donutFor(id: PerimeterId): DonutSlice[] {
  switch (id) {
    case "gerd":
      return gerdDonut();
    case "pubs":
      return pubsDonut();
    case "cet":
      return cetDonut();
    case "kti":
      return ktiDonut();
  }
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtTn(n: number): string {
  return `$${n.toFixed(2)}T`;
}
