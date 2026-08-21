/**
 * Measurement & science — August 2026 vintage update (202608).
 * Prior post: measurement-science-update-2026q3 (OECD/AAAS restatement of
 * 2024 GERD — CN 29.4% vs US 29.1%; business BERD +$100B; EXR ~50%).
 * Newest vintage: China NBS / statistical communiqué 2025 domestic R&D
 * (¥3.9262T, +8.1%, intensity 2.80%, basic research 7.08%) + NSF/NSB
 * Indicators 2026 Translation meters (CET priority patents; KTI split).
 *
 * Core delta: first post-2024 *flow year* on the China ledger plus patent
 * concentration that Q3 treated only directionally — progress keeps
 * concentrating even while PPP converter debates stay unresolved.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "August 2026 vintage vs Q3 OECD/AAAS restatement of 2024. Newest prints: China NBS Statistical Communiqué / MOST briefings on 2025 domestic R&D (¥39,262亿, +8.1% YoY, intensity 2.80%, basic research ¥2,778亿 / 7.08%); NSF/NSB State of U.S. Science & Engineering 2026 and Indicators Translation thematic report (CET international priority patent families; USPTO utility patents; KTI manufacturing vs services value added). Domestic China yuan totals are NOT OECD-comparable GERD shares — do not splice into the 29.4/29.1 world-share frame without PPP conversion. US intensity 3.4% and China OECD-comparable 2.7% (2024) remain NSF/OECD international meters.";

export const SOURCES = [
  {
    label: "China NBS — 2025 Statistical Communiqué (R&D section)",
    url: "https://www.stats.gov.cn/english/",
  },
  {
    label: "China.gov — R&D record / innovation push through 2030 (5 Mar 2026)",
    url: "https://english.www.gov.cn/archive/statistics/202603/05/content_WS69a96a44c6d00ca5f9a09933.html",
  },
  {
    label: "NSF/NSB — State of U.S. Science and Engineering 2026",
    url: "https://www.ncses.nsf.gov/pubs/nsbsep20261",
  },
  {
    label: "Prior Q3 theme update — OECD/AAAS 2024 restatement",
    url: "/blog/measurement-science-update-2026q3",
  },
] as const;

/** Headline meters — Q3 2024 restatement → Aug 2025 China flow + NSF CET */
export const HEADLINE = {
  priorChinaSharePct: 29.4,
  priorUsSharePct: 29.1,
  priorGapPp: 0.3,
  priorBusinessBerdGapBn: 100,
  priorExrChinaVsUsPct: 50,
  china2025GerdTnYuan: 3.9262,
  china2025GerdBnYuan: 39262,
  china2025YoyPct: 8.1,
  china2025IntensityPct: 2.8,
  china2024IntensityOecdPct: 2.7,
  us2024IntensityPct: 3.4,
  intensityGapToUsPp: 0.6,
  intensityGapDeltaVs2024Pp: -0.1,
  basicResearchBnYuan: 2778,
  basicResearchSharePct: 7.08,
  basicResearchYoyPct: 11.1,
  basicResearchCrossed7: true,
  planMinAnnualGerdGrowthPct: 7,
  aiPriorityPatentChinaSharePct: 75,
  usptoUtilityPatentsK: 326,
  usptoUsApplicantSharePct: 47,
  ktiWorldTn: 11.7,
  ktiUsSharePct: 28,
  ktiChinaSharePct: 25,
  ktiCnMfgTn: 2.4,
  ktiUsServicesSharePct: 43,
  pubsCnSharePct: 31,
  pubsUsSharePct: 12,
  pubsIndiaSharePct: 7,
} as const;

/** Intensity path — domestic China vs international US / OECD plateau */
export type IntensityRow = {
  year: number;
  chinaPct: number;
  usPct: number | null;
  oecdPct: number | null;
  chinaConfidence: Confidence;
  note?: string;
};

export const INTENSITY_PATH: IntensityRow[] = [
  {
    year: 2020,
    chinaPct: 2.4,
    usPct: 3.4,
    oecdPct: 2.7,
    chinaConfidence: "estimated",
    note: "China domestic path (approx.); OECD intensity plateau begins",
  },
  {
    year: 2021,
    chinaPct: 2.44,
    usPct: 3.4,
    oecdPct: 2.7,
    chinaConfidence: "estimated",
  },
  {
    year: 2022,
    chinaPct: 2.55,
    usPct: 3.5,
    oecdPct: 2.7,
    chinaConfidence: "estimated",
  },
  {
    year: 2023,
    chinaPct: 2.65,
    usPct: 3.4,
    oecdPct: 2.7,
    chinaConfidence: "estimated",
  },
  {
    year: 2024,
    chinaPct: 2.7,
    usPct: 3.4,
    oecdPct: 2.7,
    chinaConfidence: "disclosed",
    note: "OECD-comparable China intensity (Q3 / NSF frame)",
  },
  {
    year: 2025,
    chinaPct: 2.8,
    usPct: null,
    oecdPct: null,
    chinaConfidence: "disclosed",
    note: "China NBS domestic intensity — newest flow year",
  },
];

/** China domestic flow: 2024 → 2025 (yuan ledger) */
export type ChinaFlowRow = {
  id: string;
  label: string;
  short: string;
  prior: number;
  neu: number;
  unit: "tnYuan" | "pct" | "bnYuan";
  yoyPct: number | null;
  color: string;
  confidence: Confidence;
};

export const CHINA_FLOW: ChinaFlowRow[] = [
  {
    id: "gerd",
    label: "Domestic R&D expenditure",
    short: "GERD ¥",
    prior: 3.632,
    neu: 3.9262,
    unit: "tnYuan",
    yoyPct: 8.1,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "intensity",
    label: "R&D intensity (GERD/GDP)",
    short: "Intensity",
    prior: 2.7,
    neu: 2.8,
    unit: "pct",
    yoyPct: null,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "basic",
    label: "Basic research expenditure",
    short: "Basic ¥",
    prior: 2500,
    neu: 2778,
    unit: "bnYuan",
    yoyPct: 11.1,
    color: "#8b5cf6",
    confidence: "estimated",
  },
  {
    id: "basicShare",
    label: "Basic research share of R&D",
    short: "Basic %",
    prior: 6.9,
    neu: 7.08,
    unit: "pct",
    yoyPct: null,
    color: "#14b8a6",
    confidence: "estimated",
  },
];

/** Composition — experimental / applied / basic (illustrative from 7.08% basic) */
export type CompositionRow = {
  id: string;
  label: string;
  share2024Pct: number;
  share2025Pct: number;
  color: string;
  confidence: Confidence;
};

export const COMPOSITION: CompositionRow[] = [
  {
    id: "experimental",
    label: "Experimental development",
    share2024Pct: 82.5,
    share2025Pct: 82.0,
    color: "#f43f5e",
    confidence: "estimated",
  },
  {
    id: "applied",
    label: "Applied research",
    share2024Pct: 10.6,
    share2025Pct: 10.92,
    color: "#f59e0b",
    confidence: "estimated",
  },
  {
    id: "basic",
    label: "Basic research",
    share2024Pct: 6.9,
    share2025Pct: 7.08,
    color: "#8b5cf6",
    confidence: "disclosed",
  },
];

/** CET international priority patent families — China volume share 2024 (NSF) */
export type CetPatentRow = {
  id: string;
  label: string;
  short: string;
  chinaSharePct: number;
  usLeadsCitations: boolean;
  color: string;
  confidence: Confidence;
};

export const CET_PATENTS: CetPatentRow[] = [
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
    id: "semi",
    label: "Semiconductors",
    short: "Semi",
    chinaSharePct: 42,
    usLeadsCitations: true,
    color: "#6366f1",
    confidence: "estimated",
  },
  {
    id: "qist",
    label: "Quantum information science",
    short: "QIST",
    chinaSharePct: 48,
    usLeadsCitations: true,
    color: "#8b5cf6",
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
  {
    id: "nuclear",
    label: "Advanced nuclear",
    short: "Nuclear",
    chinaSharePct: 40,
    usLeadsCitations: true,
    color: "#f59e0b",
    confidence: "estimated",
  },
];

/** Volume vs impact scoreboard — Q3 → Aug NSF Translation */
export type ScoreboardRow = {
  id: string;
  label: string;
  volumeLeader: "China" | "United States";
  impactLeader: "China" | "United States" | "Split";
  priorQ3: string;
  neuAug: string;
  color: string;
};

export const SCOREBOARD: ScoreboardRow[] = [
  {
    id: "gerd",
    label: "GERD dollars (PPP 2024)",
    volumeLeader: "China",
    impactLeader: "Split",
    priorQ3: "CN 29.4% vs US 29.1% (knife-edge)",
    neuAug: "Still unresolved converters; China 2025 ¥ flow +8.1%",
    color: "#f43f5e",
  },
  {
    id: "intensity",
    label: "R&D intensity",
    volumeLeader: "United States",
    impactLeader: "United States",
    priorQ3: "US 3.4% / CN ~2.7% / OECD 2.7%",
    neuAug: "China domestic intensity 2.80% — gap to US ~0.6 pp",
    color: "#0ea5e9",
  },
  {
    id: "basic",
    label: "Basic research share (China)",
    volumeLeader: "China",
    impactLeader: "Split",
    priorQ3: "Not in Q3 GERD restatement",
    neuAug: "7.08% of China R&D — first print above 7%",
    color: "#8b5cf6",
  },
  {
    id: "cet-patents",
    label: "CET priority patents (volume)",
    volumeLeader: "China",
    impactLeader: "United States",
    priorQ3: "AAAS: PCT #1 since ~2012; ICT ~3×",
    neuAug: "China leads AI / QIST / biotech / semi / nuclear families; AI ~75%",
    color: "#f43f5e",
  },
  {
    id: "kti",
    label: "KTI value added",
    volumeLeader: "United States",
    impactLeader: "Split",
    priorQ3: "Not broken out in Q3",
    neuAug: "US 28% / CN 25% world; CN mfg $2.4T; US services 43%",
    color: "#14b8a6",
  },
  {
    id: "pubs",
    label: "S&E publication volume",
    volumeLeader: "China",
    impactLeader: "United States",
    priorQ3: "CN 31% / US 12% / India 7%",
    neuAug: "Same 2024 Indicators print; HCA edge still US",
    color: "#f59e0b",
  },
];

/** Concentration meters — Q3 prior → Aug newest */
export type ConcentrationMeter = {
  label: string;
  prior: string;
  neu: string;
  delta: string;
  detail: string;
};

export const CONCENTRATION_METERS: ConcentrationMeter[] = [
  {
    label: "China−US PPP share gap (2024)",
    prior: "+0.3 pp (29.4–29.1)",
    neu: "unchanged (no new OECD year)",
    delta: "0 pp restatement",
    detail: "August does not re-litigate the knife-edge overtake",
  },
  {
    label: "China domestic R&D YoY",
    prior: "2024 OECD year only",
    neu: "+8.1% (2025)",
    delta: "new flow year",
    detail: "First post-2024 China ledger print on this theme",
  },
  {
    label: "China R&D intensity",
    prior: "~2.7% (OECD-comparable 2024)",
    neu: "2.80% (NBS 2025)",
    delta: "+0.1 pp",
    detail: "Domestic intensity now above OECD-area plateau",
  },
  {
    label: "Basic research share (China)",
    prior: "not in Q3 panel",
    neu: "7.08%",
    delta: "crosses 7%",
    detail: "Basic ¥ +11.1% YoY — faster than total R&D",
  },
  {
    label: "AI priority patent share (China)",
    prior: "directional PCT lead",
    neu: "~75% (2024)",
    delta: "new CET meter",
    detail: "NSF Translation: volume concentration extreme in AI",
  },
  {
    label: "KTI world value-added",
    prior: "not shown",
    neu: "US 28% / CN 25%",
    delta: "new",
    detail: "Near-duopoly on $11.7T KTI output; split by mfg vs services",
  },
];

/** KTI split rows */
export type KtiRow = {
  id: string;
  label: string;
  short: string;
  value: number;
  unit: "sharePct" | "tnUsd";
  color: string;
  confidence: Confidence;
};

export const KTI_SPLIT: KtiRow[] = [
  {
    id: "us-share",
    label: "US share of world KTI VA",
    short: "US share",
    value: 28,
    unit: "sharePct",
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "cn-share",
    label: "China share of world KTI VA",
    short: "CN share",
    value: 25,
    unit: "sharePct",
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "eu-share",
    label: "EU-27 share of world KTI VA",
    short: "EU share",
    value: 18,
    unit: "sharePct",
    color: "#8b5cf6",
    confidence: "disclosed",
  },
  {
    id: "cn-mfg",
    label: "China KTI manufacturing VA",
    short: "CN mfg",
    value: 2.4,
    unit: "tnUsd",
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "us-svc-share",
    label: "US share of world KTI services",
    short: "US svc",
    value: 43,
    unit: "sharePct",
    color: "#0ea5e9",
    confidence: "disclosed",
  },
];

/** Vintage delta table rows for prose */
export type VintageDeltaRow = {
  meter: string;
  prior: string;
  neu: string;
  delta: string;
};

export const VINTAGE_DELTA_TABLE: VintageDeltaRow[] = [
  {
    meter: "Reference year (China ledger)",
    prior: "2024 OECD/AAAS",
    neu: "2025 NBS domestic",
    delta: "new flow year",
  },
  {
    meter: "China−US PPP world-share gap",
    prior: "+0.3 pp",
    neu: "no new OECD print",
    delta: "frame held",
  },
  {
    meter: "China domestic R&D",
    prior: "n/a in Q3",
    neu: "¥3.9262T",
    delta: "+8.1% YoY",
  },
  {
    meter: "China R&D intensity",
    prior: "~2.7% (2024 OECD)",
    neu: "2.80% (2025 NBS)",
    delta: "+0.1 pp",
  },
  {
    meter: "Basic research share (China)",
    prior: "not shown",
    neu: "7.08%",
    delta: "crosses 7%",
  },
  {
    meter: "Basic research YoY",
    prior: "n/a",
    neu: "+11.1%",
    delta: "outpaces total R&D",
  },
  {
    meter: "AI priority patents (China share)",
    prior: "directional",
    neu: "~75%",
    delta: "new CET meter",
  },
  {
    meter: "World KTI VA (US / CN)",
    prior: "not shown",
    neu: "28% / 25%",
    delta: "near-duopoly",
  },
  {
    meter: "14th→15th FYP R&D growth floor",
    prior: "n/a",
    neu: "≥7% avg / yr",
    delta: "policy lock-in",
  },
];

export function intensityGapToUs(row: IntensityRow): number | null {
  if (row.usPct == null) return null;
  return row.usPct - row.chinaPct;
}

export function rankedCetPatents(): CetPatentRow[] {
  return [...CET_PATENTS].sort((a, b) => b.chinaSharePct - a.chinaSharePct);
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtYuanTn(n: number, digits = 2): string {
  return `¥${n.toFixed(digits)}T`;
}

export function fmtYoy(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}
