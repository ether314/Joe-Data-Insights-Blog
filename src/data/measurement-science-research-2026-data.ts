/**
 * Global R&D funding + S&E publication concentration.
 * Primary sources: NSF/NSB Science & Engineering Indicators (Discovery / Publications);
 * OECD MSTI GERD; WIPO Global Innovation Index R&D blog (2023 current-$ cross-check).
 * Shares use PPP-converted GERD where noted. Do not mix WIPO current-$ ranks with NSF PPP shares.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "NSF National Center for Science and Engineering Statistics / National Science Board, Science & Engineering Indicators — Discovery: R&D Activity and Research Publications (NSB-2025-7 / related Indicators chapters) and Publications Output. OECD Main Science and Technology Indicators (GERD, PPP). WIPO GII end-of-year R&D blog for 2023 current-USD cross-check only. Publication shares are fractional-count peer-reviewed S&E articles (Scopus-based NSF framing). GERD shares are of the OECD-coverage global total (~$3.1T PPP in 2022). Mid-path years between disclosed anchors are labeled estimated.";

export const SOURCES = [
  {
    label: "NSF NCSES — Discovery: R&D and publications",
    url: "https://ncses.nsf.gov/pubs/nsb20257/global-r-d-and-international-comparisons-2",
  },
  {
    label: "NSF — State of U.S. Science and Engineering 2024 (publications)",
    url: "https://ncses.nsf.gov/pubs/nsb20243/translation-u-s-and-global-science-technology-and-innovation-capabilities",
  },
  {
    label: "OECD Main Science and Technology Indicators",
    url: "https://www.oecd.org/en/data/datasets/main-science-and-technology-indicators.html",
  },
  {
    label: "WIPO — Global R&D near USD 3 trillion (2023)",
    url: "https://www.wipo.int/en/web/global-innovation-index/w/blogs/2024/end-of-year-edition",
  },
] as const;

export const HEADLINE = {
  globalGerd2022Tn: 3.1,
  usShare2022Pct: 30,
  chinaShare2022Pct: 27,
  usChinaShare2022Pct: 57,
  top8Share2022Pct: 82,
  eu27Share2022Pct: 18,
  usShare2000Pct: 39,
  chinaShare2000Pct: 5,
  chinaPubs2022Pct: 27,
  usPubs2022Pct: 14,
  top6PubsShare2022Pct: 56,
  pubsOvertakeYear: 2016,
  israelIntensityPct: 6.0,
  koreaIntensityPct: 5.2,
  usIntensityPct: 3.6,
  chinaIntensityPct: 2.6,
  usGerd2022Bn: 923.2,
  chinaGerd2022Bn: 811.9,
  japanGerd2022Bn: 200.8,
  germanyGerd2022Bn: 174.9,
  koreaGerd2022Bn: 139.0,
  ukGerd2022Bn: 102.6,
  franceGerd2022Bn: 85.2,
  taiwanGerd2022Bn: 64.0,
} as const;

export type EconomyId =
  | "usa"
  | "chn"
  | "eu27"
  | "jpn"
  | "deu"
  | "kor"
  | "gbr"
  | "fra"
  | "twn"
  | "ind"
  | "row";

export const ECONOMY_META: Record<
  EconomyId,
  { label: string; short: string; color: string }
> = {
  usa: { label: "United States", short: "US", color: "#0ea5e9" },
  chn: { label: "China", short: "China", color: "#f43f5e" },
  eu27: { label: "EU-27", short: "EU-27", color: "#8b5cf6" },
  jpn: { label: "Japan", short: "Japan", color: "#14b8a6" },
  deu: { label: "Germany", short: "Germany", color: "#f59e0b" },
  kor: { label: "South Korea", short: "Korea", color: "#6366f1" },
  gbr: { label: "United Kingdom", short: "UK", color: "#ec4899" },
  fra: { label: "France", short: "France", color: "#84cc16" },
  twn: { label: "Taiwan", short: "Taiwan", color: "#06b6d4" },
  ind: { label: "India", short: "India", color: "#fb923c" },
  row: { label: "Rest of world", short: "RoW", color: "#94a3b8" },
};

/** Global GERD share path (% of OECD-coverage world). Anchors disclosed; intermediates estimated. */
export type GerdShareRow = {
  year: number;
  usa: number;
  chn: number;
  eu27: number;
  jpn: number;
  kor: number;
  row: number;
  confidence: Confidence;
};

export const GERD_SHARE_PATH: GerdShareRow[] = [
  { year: 2000, usa: 39, chn: 5, eu27: 25, jpn: 14, kor: 2.5, row: 14.5, confidence: "disclosed" },
  { year: 2005, usa: 35, chn: 10, eu27: 24, jpn: 13, kor: 3.2, row: 14.8, confidence: "estimated" },
  { year: 2010, usa: 31, chn: 15, eu27: 22, jpn: 11, kor: 3.8, row: 17.2, confidence: "disclosed" },
  { year: 2015, usa: 30, chn: 21, eu27: 20, jpn: 9, kor: 4.2, row: 15.8, confidence: "estimated" },
  { year: 2018, usa: 30, chn: 24, eu27: 19, jpn: 8, kor: 4.5, row: 14.5, confidence: "estimated" },
  { year: 2020, usa: 30, chn: 25, eu27: 19, jpn: 7.5, kor: 4.6, row: 13.9, confidence: "estimated" },
  { year: 2022, usa: 30, chn: 27, eu27: 18, jpn: 6.5, kor: 4.5, row: 14.0, confidence: "disclosed" },
];

/** Top individual R&D performers — 2022 GERD, current PPP $bn (NSF/OECD). */
export type GerdVolumeRow = {
  id: EconomyId;
  gerdBn: number;
  sharePct: number;
  intensityPct: number | null;
  confidence: Confidence;
};

export const GERD_VOLUMES_2022: GerdVolumeRow[] = [
  { id: "usa", gerdBn: 923.2, sharePct: 30, intensityPct: 3.6, confidence: "disclosed" },
  { id: "chn", gerdBn: 811.9, sharePct: 27, intensityPct: 2.6, confidence: "disclosed" },
  { id: "jpn", gerdBn: 200.8, sharePct: 6.5, intensityPct: 3.4, confidence: "disclosed" },
  { id: "deu", gerdBn: 174.9, sharePct: 5.6, intensityPct: 3.1, confidence: "disclosed" },
  { id: "kor", gerdBn: 139.0, sharePct: 4.5, intensityPct: 5.2, confidence: "disclosed" },
  { id: "gbr", gerdBn: 102.6, sharePct: 3.3, intensityPct: null, confidence: "disclosed" },
  { id: "fra", gerdBn: 85.2, sharePct: 2.7, intensityPct: null, confidence: "disclosed" },
  { id: "twn", gerdBn: 64.0, sharePct: 2.1, intensityPct: 4.0, confidence: "disclosed" },
];

/** S&E publication share path (% of world fractional counts). */
export type PubShareRow = {
  year: number;
  chn: number;
  usa: number;
  ind: number;
  deu: number;
  gbr: number;
  jpn: number;
  confidence: Confidence;
};

export const PUB_SHARE_PATH: PubShareRow[] = [
  { year: 2003, chn: 7, usa: 27, ind: 2, deu: 6, gbr: 6, jpn: 8, confidence: "estimated" },
  { year: 2008, chn: 12, usa: 24, ind: 3, deu: 5.5, gbr: 5.5, jpn: 6.5, confidence: "estimated" },
  { year: 2012, chn: 16, usa: 20, ind: 4, deu: 4.5, gbr: 4.5, jpn: 5, confidence: "estimated" },
  { year: 2016, chn: 20, usa: 17, ind: 4.5, deu: 4, gbr: 4, jpn: 4, confidence: "estimated" },
  { year: 2018, chn: 22, usa: 16, ind: 5, deu: 3.5, gbr: 3.5, jpn: 3.5, confidence: "estimated" },
  { year: 2020, chn: 24, usa: 15, ind: 5.5, deu: 3.2, gbr: 3.2, jpn: 3.2, confidence: "estimated" },
  { year: 2022, chn: 27, usa: 14, ind: 6, deu: 3, gbr: 3, jpn: 3, confidence: "disclosed" },
];

/** Publication volume ranks for bump chart (1 = most articles). */
export type PubRankRow = {
  year: number;
  chn: number;
  usa: number;
  ind: number;
  deu: number;
  gbr: number;
  jpn: number;
  confidence: Confidence;
};

export const PUB_RANK_PATH: PubRankRow[] = [
  { year: 2003, usa: 1, jpn: 2, deu: 3, gbr: 4, chn: 5, ind: 6, confidence: "estimated" },
  { year: 2008, usa: 1, chn: 2, jpn: 3, deu: 4, gbr: 5, ind: 6, confidence: "estimated" },
  { year: 2012, usa: 1, chn: 2, jpn: 3, deu: 4, gbr: 5, ind: 6, confidence: "estimated" },
  { year: 2016, chn: 1, usa: 2, jpn: 3, deu: 4, gbr: 5, ind: 6, confidence: "disclosed" },
  { year: 2018, chn: 1, usa: 2, ind: 3, deu: 4, gbr: 5, jpn: 6, confidence: "estimated" },
  { year: 2020, chn: 1, usa: 2, ind: 3, deu: 4, gbr: 5, jpn: 6, confidence: "disclosed" },
  { year: 2022, chn: 1, usa: 2, ind: 3, deu: 4, gbr: 5, jpn: 6, confidence: "disclosed" },
];

/** Highly cited article (HCA) index — relative citation impact (world baseline = 1.0). */
export type HcaRow = {
  id: EconomyId;
  hcaIndex: number;
  pubShare2022Pct: number;
  note: string;
  confidence: Confidence;
};

export const HCA_CONTRAST: HcaRow[] = [
  { id: "gbr", hcaIndex: 2.2, pubShare2022Pct: 3, note: "Highest HCA among large producers (~2020)", confidence: "disclosed" },
  { id: "usa", hcaIndex: 1.7, pubShare2022Pct: 14, note: "Still ~1.7× world baseline after mild decline", confidence: "disclosed" },
  { id: "deu", hcaIndex: 1.7, pubShare2022Pct: 3, note: "Similar HCA to US", confidence: "disclosed" },
  { id: "jpn", hcaIndex: 1.1, pubShare2022Pct: 3, note: "Near world average impact", confidence: "estimated" },
  { id: "chn", hcaIndex: 1.0, pubShare2022Pct: 27, note: "Volume leader; impact near baseline and rising", confidence: "estimated" },
  { id: "ind", hcaIndex: 0.8, pubShare2022Pct: 6, note: "Fast volume growth; impact still below baseline", confidence: "estimated" },
];

/** R&D intensity leaders (GERD / GDP %). */
export type IntensityRow = {
  id: string;
  label: string;
  short: string;
  intensityPct: number;
  color: string;
  confidence: Confidence;
};

export const INTENSITY_LEADERS: IntensityRow[] = [
  { id: "isr", label: "Israel", short: "Israel", intensityPct: 6.0, color: "#0ea5e9", confidence: "disclosed" },
  { id: "kor", label: "South Korea", short: "Korea", intensityPct: 5.2, color: "#6366f1", confidence: "disclosed" },
  { id: "twn", label: "Taiwan", short: "Taiwan", intensityPct: 4.0, color: "#06b6d4", confidence: "disclosed" },
  { id: "usa", label: "United States", short: "US", intensityPct: 3.6, color: "#0ea5e9", confidence: "disclosed" },
  { id: "jpn", label: "Japan", short: "Japan", intensityPct: 3.4, color: "#14b8a6", confidence: "disclosed" },
  { id: "deu", label: "Germany", short: "Germany", intensityPct: 3.1, color: "#f59e0b", confidence: "disclosed" },
  { id: "chn", label: "China", short: "China", intensityPct: 2.6, color: "#f43f5e", confidence: "disclosed" },
  { id: "eu27", label: "EU-27", short: "EU-27", intensityPct: 2.1, color: "#8b5cf6", confidence: "disclosed" },
];

/** Concentration meters for table / KPI strip. */
export const CONCENTRATION_METERS = [
  { label: "US + China GERD share (2022)", value: "57%", detail: "30% + 27% of OECD-coverage world" },
  { label: "Top-8 GERD share (2022)", value: "82%", detail: "US, China, Japan, DE, KR, UK, FR, Taiwan" },
  { label: "Top-6 publication share (2022)", value: ">50%", detail: "CN 27%, US 14%, IN 6%, DE/UK/JP ~3% each" },
  { label: "US GERD share change", value: "39% → 30%", detail: "2000 → 2022" },
  { label: "China GERD share change", value: "~5% → 27%", detail: "2000 → 2022" },
  { label: "Publication volume lead flip", value: "2016", detail: "China overtakes US in S&E article count" },
] as const;

export const STREAM_KEYS: Array<keyof Omit<GerdShareRow, "year" | "confidence">> = [
  "usa",
  "chn",
  "eu27",
  "jpn",
  "kor",
  "row",
];

export const PUB_KEYS: Array<keyof Omit<PubShareRow, "year" | "confidence">> = [
  "chn",
  "usa",
  "ind",
  "deu",
  "gbr",
  "jpn",
];

export function rankedGerdVolumes(): GerdVolumeRow[] {
  return [...GERD_VOLUMES_2022].sort((a, b) => b.gerdBn - a.gerdBn);
}

export function rankedIntensity(): IntensityRow[] {
  return [...INTENSITY_LEADERS].sort((a, b) => b.intensityPct - a.intensityPct);
}

export function fmtBn(n: number, digits = 0): string {
  if (n >= 100) return `$${n.toFixed(digits)}B`;
  return `$${n.toFixed(1)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtTn(n: number): string {
  return `$${n.toFixed(1)}T`;
}
