/**
 * Measurement & science — August 2026 (202608) concentration / market-share lens.
 *
 * Core question: How concentrated is this system at the top of the distribution?
 * (Where is progress funded and published — is it concentrating?)
 *
 * Aug vintage complements the 2026 + Q3 concentration prints by asking whether the
 * *first post-2024 China domestic flow year* and NSF Translation patent meters
 * change Top-1 / Top-3 geometry:
 * (1) carried PPP GERD knife-edge (CN 29.4% / US 29.1%; Top-3 65.2%),
 * (2) China 2025 ¥ flow +8.1% / intensity 2.80% as tempo (not world-share),
 * (3) CET priority-patent field concentration (AI ~75% Top-1),
 * (4) USPTO utility vs CET volume disagreement,
 * (5) KTI VA Top-1 still US (28%) while China mfg VA concentrates,
 * while retaining pubs / non-OECD as secondary perimeters.
 *
 * Primary sources: China NBS 2025 Statistical Communiqué; NSF/NSB State of S&E
 * 2026 + Indicators Translation; OECD/AAAS 2024 GERD restatement (carried);
 * prior theme concentration + Aug update.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "August 202608 concentration lens. Carried PPP GERD shares: OECD/AAAS 2024 (China 29.4% / US 29.1%; Top-3 65.2%; US+China 58.5%). Newest flow: China NBS 2025 domestic R&D ¥3.9262T (+8.1%), intensity 2.80%, basic research 7.08% — NOT OECD-comparable world shares; do not splice into PPP. CET AI priority patent families ~75% China (NSF Translation); USPTO utility applicant share still US-led ~47%. Pubs: NSF Indicators 2024 (CN 31% / US 12% / India 7%; top-3 = 50%). KTI VA: US 28% / China 25% / EU-27 18%. Non-OECD R&D: China 92.3%. HHI is analytical on stated buckets (0–10,000).";

export const SOURCES = [
  {
    label: "China NBS — 2025 Statistical Communiqué (R&D section)",
    url: "https://www.stats.gov.cn/english/",
  },
  {
    label: "NSF/NSB — State of U.S. Science and Engineering 2026",
    url: "https://www.ncses.nsf.gov/pubs/nsbsep20261",
  },
  {
    label: "AAAS — Global R&D Update 2026 (9 Jun 2026)",
    url: "https://www.aaas.org/sites/default/files/2026-06/AAAS%20Global%20RD%20Update%202026.pdf",
  },
  {
    label: "Q3 concentration lens — converter restatement",
    url: "/blog/measurement-science-concentration-2026q3",
  },
  {
    label: "August theme update — China 2025 flow + CET",
    url: "/blog/measurement-science-update-202608",
  },
] as const;

export const PRIOR_CONCENTRATION_PATH =
  "/blog/measurement-science-concentration-2026";
export const PRIOR_Q3_CONC_PATH =
  "/blog/measurement-science-concentration-2026q3";
export const PRIOR_AUG_UPDATE_PATH = "/blog/measurement-science-update-202608";
export const PRIOR_RESEARCH_PATH = "/blog/measurement-science-research-2026";

/** Headline punchline — Top-1 / Top-3 under Aug flow-year lens */
export const HEADLINE = {
  /** Carried GERD PPP 2024 — OECD/AAAS knife-edge */
  gerdTop1Pct: 29.4,
  gerdTop1Label: "China",
  gerdTop3Pct: 65.2,
  gerdTop3Labels: "China + US + Japan",
  gerdUsChinaPct: 58.5,
  gerdUsPct: 29.1,
  gerdJapanPct: 6.7,
  gerdGapPp: 0.3,
  gerdWorldTn: 3.48,
  gerdHhi: 1890,

  /** China 2025 domestic flow (yuan ledger — not world share) */
  china2025GerdTnYuan: 3.9262,
  china2025YoyPct: 8.1,
  china2025IntensityPct: 2.8,
  china2024IntensityOecdPct: 2.7,
  us2024IntensityPct: 3.4,
  intensityGapPp: 0.6,
  basicResearchSharePct: 7.08,
  basicResearchYoyPct: 11.1,
  planMinAnnualGerdGrowthPct: 7,

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
  cetHhi: 5820,

  /** USPTO utility patents — US still leads applicant share */
  usptoUtilityPatentsK: 326,
  usptoUsApplicantSharePct: 47,
  usptoTop1Label: "United States",

  /** KTI world value-added */
  ktiTop1Pct: 28,
  ktiTop1Label: "United States",
  ktiTop3Pct: 71,
  ktiChinaPct: 25,
  ktiEuPct: 18,
  ktiWorldTn: 11.7,
  ktiHhi: 1780,
  ktiCnMfgTn: 2.4,
  ktiUsServicesSharePct: 43,

  /** Non-OECD */
  nonOecdChinaPct: 92.3,
  nonOecdHhi: 8540,

  equalFiveHhi: 2000,
} as const;

export type PerimeterId =
  | "gerd"
  | "pubs"
  | "cet"
  | "kti"
  | "uspto"
  | "nonOecd";

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
    confidence: "carried",
    note: "OECD/AAAS 2024 — knife-edge; Aug adds ¥ flow, not new PPP shares",
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
    hhi: HEADLINE.cetHhi,
    color: "#8b5cf6",
    confidence: "disclosed",
    note: "NSF Translation — Aug volume extreme",
  },
  {
    id: "uspto",
    label: "USPTO utility applicants",
    top1Pct: HEADLINE.usptoUsApplicantSharePct,
    top1Label: HEADLINE.usptoTop1Label,
    top3Pct: 72,
    top3Labels: "US + Japan + Korea (est.)",
    hhi: 2680,
    color: "#0ea5e9",
    confidence: "estimated",
    note: "US still Top-1 on domestic utility grants (~326k)",
  },
  {
    id: "kti",
    label: "KTI value-added",
    top1Pct: HEADLINE.ktiTop1Pct,
    top1Label: HEADLINE.ktiTop1Label,
    top3Pct: HEADLINE.ktiTop3Pct,
    top3Labels: "US + China + EU-27",
    hhi: HEADLINE.ktiHhi,
    color: "#14b8a6",
    confidence: "disclosed",
    note: "Near-duopoly; US Top-1 on VA; China mfg tip",
  },
  {
    id: "nonOecd",
    label: "Non-OECD R&D ledger",
    top1Pct: HEADLINE.nonOecdChinaPct,
    top1Label: "China",
    top3Pct: 97,
    top3Labels: "China + residual non-OECD",
    hhi: HEADLINE.nonOecdHhi,
    color: "#6366f1",
    confidence: "carried",
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
    confidence: "carried",
  },
  {
    rank: 2,
    id: "usa",
    name: "United States",
    short: "US",
    sharePct: 29.1,
    cumulativePct: 58.5,
    color: "#0ea5e9",
    confidence: "carried",
  },
  {
    rank: 3,
    id: "jpn",
    name: "Japan",
    short: "Japan",
    sharePct: 6.7,
    cumulativePct: 65.2,
    color: "#14b8a6",
    confidence: "carried",
  },
  {
    rank: 4,
    id: "deu",
    name: "Germany",
    short: "Germany",
    sharePct: 5.5,
    cumulativePct: 70.7,
    color: "#f59e0b",
    confidence: "carried",
  },
  {
    rank: 5,
    id: "kor",
    name: "South Korea",
    short: "Korea",
    sharePct: 4.7,
    cumulativePct: 75.4,
    color: "#6366f1",
    confidence: "carried",
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

export const CET_LADDER: LadderRow[] = [
  {
    rank: 1,
    id: "chn",
    name: "China",
    short: "China",
    sharePct: 75,
    cumulativePct: 75,
    color: "#f43f5e",
    confidence: "disclosed",
    note: "AI priority patent families",
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

export const USPTO_LADDER: LadderRow[] = [
  {
    rank: 1,
    id: "usa",
    name: "United States",
    short: "US",
    sharePct: 47,
    cumulativePct: 47,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    rank: 2,
    id: "jpn",
    name: "Japan",
    short: "Japan",
    sharePct: 15,
    cumulativePct: 62,
    color: "#14b8a6",
    confidence: "estimated",
  },
  {
    rank: 3,
    id: "kor",
    name: "South Korea",
    short: "Korea",
    sharePct: 10,
    cumulativePct: 72,
    color: "#6366f1",
    confidence: "estimated",
  },
  {
    rank: 4,
    id: "chn",
    name: "China",
    short: "China",
    sharePct: 8,
    cumulativePct: 80,
    color: "#f43f5e",
    confidence: "estimated",
  },
  {
    rank: 5,
    id: "row",
    name: "Rest of world",
    short: "RoW",
    sharePct: 20,
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
    confidence: "carried",
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

export const CET_CURVE: CurvePoint[] = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 75, equalPct: 25 },
  { rank: 2, label: "Top-2", sharePct: 87, equalPct: 50 },
  { rank: 3, label: "Top-3", sharePct: 92, equalPct: 75 },
  { rank: 4, label: "All", sharePct: 100, equalPct: 100 },
];

export const KTI_CURVE: CurvePoint[] = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 28, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 53, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 71, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 78, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export const USPTO_CURVE: CurvePoint[] = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 47, equalPct: 20 },
  { rank: 2, label: "Top-2", sharePct: 62, equalPct: 40 },
  { rank: 3, label: "Top-3", sharePct: 72, equalPct: 60 },
  { rank: 4, label: "Top-4", sharePct: 80, equalPct: 80 },
  { rank: 5, label: "All", sharePct: 100, equalPct: 100 },
];

export const NON_OECD_CURVE: CurvePoint[] = [
  { rank: 0, label: "0", sharePct: 0, equalPct: 0 },
  { rank: 1, label: "Top-1", sharePct: 92.3, equalPct: 33.3 },
  { rank: 2, label: "Top-2", sharePct: 97, equalPct: 66.7 },
  { rank: 3, label: "All", sharePct: 100, equalPct: 100 },
];

/** CET field concentration — China volume share by technology */
export type CetFieldRow = {
  id: string;
  label: string;
  short: string;
  chinaSharePct: number;
  usLeadsCitations: boolean;
  color: string;
  confidence: Confidence;
};

export const CET_FIELDS: CetFieldRow[] = [
  {
    id: "ai",
    label: "Artificial intelligence",
    short: "AI",
    chinaSharePct: 75,
    usLeadsCitations: true,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "qist",
    label: "Quantum information",
    short: "QIST",
    chinaSharePct: 48,
    usLeadsCitations: true,
    color: "#8b5cf6",
    confidence: "estimated",
  },
  {
    id: "semi",
    label: "Semiconductors",
    short: "Semi",
    chinaSharePct: 42,
    usLeadsCitations: true,
    color: "#6366f1",
    confidence: "estimated",
  },
  {
    id: "nuclear",
    label: "Advanced nuclear",
    short: "Nuclear",
    chinaSharePct: 40,
    usLeadsCitations: true,
    color: "#f59e0b",
    confidence: "estimated",
  },
  {
    id: "biotech",
    label: "Biotechnology",
    short: "Biotech",
    chinaSharePct: 38,
    usLeadsCitations: true,
    color: "#14b8a6",
    confidence: "estimated",
  },
];

/** Dual-ledger intensity — US Top-1 vs China closing */
export type IntensityRow = {
  year: number;
  chinaPct: number;
  usPct: number | null;
  gapPp: number | null;
  chinaConfidence: Confidence;
  note?: string;
};

export const INTENSITY_PATH: IntensityRow[] = [
  {
    year: 2020,
    chinaPct: 2.4,
    usPct: 3.4,
    gapPp: 1.0,
    chinaConfidence: "estimated",
  },
  {
    year: 2021,
    chinaPct: 2.44,
    usPct: 3.4,
    gapPp: 0.96,
    chinaConfidence: "estimated",
  },
  {
    year: 2022,
    chinaPct: 2.55,
    usPct: 3.5,
    gapPp: 0.95,
    chinaConfidence: "estimated",
  },
  {
    year: 2023,
    chinaPct: 2.65,
    usPct: 3.4,
    gapPp: 0.75,
    chinaConfidence: "estimated",
  },
  {
    year: 2024,
    chinaPct: 2.7,
    usPct: 3.4,
    gapPp: 0.7,
    chinaConfidence: "disclosed",
    note: "OECD-comparable China intensity",
  },
  {
    year: 2025,
    chinaPct: 2.8,
    usPct: null,
    gapPp: 0.6,
    chinaConfidence: "disclosed",
    note: "China NBS domestic; gap vs carried US 3.4%",
  },
];

/** China domestic flow concentration signals (yuan ledger) */
export type FlowSignalRow = {
  id: string;
  label: string;
  short: string;
  value: number;
  unit: "tnYuan" | "pct" | "pp";
  prior: number;
  delta: number;
  color: string;
  confidence: Confidence;
};

export const FLOW_SIGNALS: FlowSignalRow[] = [
  {
    id: "gerd",
    label: "Domestic R&D (¥ tn)",
    short: "GERD ¥",
    value: 3.9262,
    unit: "tnYuan",
    prior: 3.632,
    delta: 8.1,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "intensity",
    label: "Intensity (GERD/GDP)",
    short: "Intensity",
    value: 2.8,
    unit: "pct",
    prior: 2.7,
    delta: 0.1,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "basic",
    label: "Basic research share",
    short: "Basic %",
    value: 7.08,
    unit: "pct",
    prior: 6.9,
    delta: 0.18,
    color: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    id: "gap",
    label: "Intensity gap to US",
    short: "Gap",
    value: 0.6,
    unit: "pp",
    prior: 0.7,
    delta: -0.1,
    color: "#14b8a6",
    confidence: "estimated",
  },
];

/** Patent ledger disagreement — CET volume vs USPTO applicants */
export type PatentLedgerRow = {
  id: string;
  label: string;
  short: string;
  top1Pct: number;
  top1Label: string;
  top3Pct: number;
  hhi: number;
  color: string;
  confidence: Confidence;
};

export const PATENT_LEDGERS: PatentLedgerRow[] = [
  {
    id: "cetAi",
    label: "CET AI priority families",
    short: "CET AI",
    top1Pct: 75,
    top1Label: "China",
    top3Pct: 92,
    hhi: 5820,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "cetSemi",
    label: "CET semiconductor families",
    short: "CET Semi",
    top1Pct: 42,
    top1Label: "China",
    top3Pct: 78,
    hhi: 2480,
    color: "#6366f1",
    confidence: "estimated",
  },
  {
    id: "uspto",
    label: "USPTO utility applicants",
    short: "USPTO",
    top1Pct: 47,
    top1Label: "United States",
    top3Pct: 72,
    hhi: 2680,
    color: "#0ea5e9",
    confidence: "estimated",
  },
];

/** KTI split — manufacturing tip vs services share */
export type KtiSplitRow = {
  id: string;
  label: string;
  short: string;
  usSharePct: number;
  chinaSharePct: number;
  color: string;
  confidence: Confidence;
  note: string;
};

export const KTI_SPLITS: KtiSplitRow[] = [
  {
    id: "total",
    label: "Total KTI value-added",
    short: "Total VA",
    usSharePct: 28,
    chinaSharePct: 25,
    color: "#14b8a6",
    confidence: "disclosed",
    note: "US still Top-1 on world KTI VA (~$11.7T)",
  },
  {
    id: "mfg",
    label: "KTI manufacturing tip",
    short: "Mfg",
    usSharePct: 18,
    chinaSharePct: 35,
    color: "#f43f5e",
    confidence: "estimated",
    note: "China mfg VA tip (~$2.4T) concentrates production",
  },
  {
    id: "services",
    label: "KTI services",
    short: "Services",
    usSharePct: 43,
    chinaSharePct: 12,
    color: "#0ea5e9",
    confidence: "estimated",
    note: "US services share keeps aggregate Top-1",
  },
];

/** Volume × impact scatter — pubs share vs HCA rate */
export type VolumeImpactRow = {
  id: string;
  label: string;
  short: string;
  pubSharePct: number;
  hcaRatePct: number;
  gerdSharePct: number | null;
  color: string;
  confidence: Confidence;
};

export const VOLUME_IMPACT: VolumeImpactRow[] = [
  {
    id: "chn",
    label: "China",
    short: "China",
    pubSharePct: 31,
    hcaRatePct: 1.3,
    gerdSharePct: 29.4,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "usa",
    label: "United States",
    short: "US",
    pubSharePct: 12,
    hcaRatePct: 1.7,
    gerdSharePct: 29.1,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "ind",
    label: "India",
    short: "India",
    pubSharePct: 7,
    hcaRatePct: 0.9,
    gerdSharePct: null,
    color: "#fb923c",
    confidence: "estimated",
  },
  {
    id: "deu",
    label: "Germany",
    short: "Germany",
    pubSharePct: 3,
    hcaRatePct: 1.5,
    gerdSharePct: 5.5,
    color: "#f59e0b",
    confidence: "estimated",
  },
  {
    id: "gbr",
    label: "United Kingdom",
    short: "UK",
    pubSharePct: 3,
    hcaRatePct: 1.6,
    gerdSharePct: null,
    color: "#ec4899",
    confidence: "estimated",
  },
  {
    id: "jpn",
    label: "Japan",
    short: "Japan",
    pubSharePct: 4,
    hcaRatePct: 1.2,
    gerdSharePct: 6.7,
    color: "#14b8a6",
    confidence: "estimated",
  },
];

/** Vintage slope — research → 2026 conc → Q3 → Aug */
export type VintageRow = {
  id: string;
  label: string;
  short: string;
  gerdTop1Pct: number;
  gerdTop3Pct: number;
  gapPp: number;
  cetAiTop1Pct: number;
  color: string;
};

export const VINTAGE_SLOPE: VintageRow[] = [
  {
    id: "research",
    label: "Research 2026 (rounded)",
    short: "Research",
    gerdTop1Pct: 30,
    gerdTop3Pct: 65,
    gapPp: 1.0,
    cetAiTop1Pct: 70,
    color: "#94a3b8",
  },
  {
    id: "conc2026",
    label: "Concentration 2026",
    short: "Conc '26",
    gerdTop1Pct: 30,
    gerdTop3Pct: 65,
    gapPp: 1.0,
    cetAiTop1Pct: 75,
    color: "#f59e0b",
  },
  {
    id: "q3",
    label: "Q3 concentration",
    short: "Q3",
    gerdTop1Pct: 29.4,
    gerdTop3Pct: 65.2,
    gapPp: 0.3,
    cetAiTop1Pct: 75,
    color: "#8b5cf6",
  },
  {
    id: "aug",
    label: "Aug 202608 lens",
    short: "Aug",
    gerdTop1Pct: 29.4,
    gerdTop3Pct: 65.2,
    gapPp: 0.3,
    cetAiTop1Pct: 75,
    color: "#f43f5e",
  },
];

export const HHI_BY_LENS = SCOREBOARD.map((r) => ({
  id: r.id,
  label: r.label,
  short: r.label
    .replace(" (PPP)", "")
    .replace(" priority patents", "")
    .replace(" applicants", "")
    .replace(" ledger", "")
    .replace(" volume", ""),
  hhi: r.hhi,
  top1Pct: r.top1Pct,
  color: r.color,
}));

export function ladderFor(id: PerimeterId): LadderRow[] {
  switch (id) {
    case "gerd":
      return GERD_LADDER;
    case "pubs":
      return PUB_LADDER;
    case "cet":
      return CET_LADDER;
    case "kti":
      return KTI_LADDER;
    case "uspto":
      return USPTO_LADDER;
    case "nonOecd":
      return NON_OECD_LADDER;
  }
}

export function curveFor(id: PerimeterId): CurvePoint[] {
  switch (id) {
    case "gerd":
      return GERD_CURVE;
    case "pubs":
      return PUB_CURVE;
    case "cet":
      return CET_CURVE;
    case "kti":
      return KTI_CURVE;
    case "uspto":
      return USPTO_CURVE;
    case "nonOecd":
      return NON_OECD_CURVE;
  }
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtTn(n: number, digits = 2): string {
  return `¥${n.toFixed(digits)}T`;
}
