/**
 * Measurement & science — vintage update (Aug 2026).
 * Prior post: measurement-science-research-2026 (2022 GERD / pubs vintage).
 * New vintage: NSF/NSB State of U.S. Science & Engineering 2026
 * (Indicators 2026 Discovery summary) — 2024 GERD year + 2024 pubs.
 *
 * Core delta: China overtakes the US on PPP GERD share (30% vs 29%);
 * US+China rises 57% → 59%; China pubs 27% → 31%.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "Vintage delta: prior research post used NSF Discovery / Indicators 2024–25 framing for 2022 GERD (PPP) and 2022 S&E publication shares. This update uses NSF/NSB State of U.S. Science & Engineering 2026 (Indicators 2026 Discovery summary) for 2024 worldwide R&D (~$3.48T) and 2024 publication shares. OECD MSTI March/April 2026 feeds the international GERD tables. Mid-path share years between disclosed anchors are estimated. Do not mix domestic NCSES US R&D totals with OECD-comparable GERD.";

export const SOURCES = [
  {
    label: "NSF/NSB — State of U.S. Science and Engineering 2026",
    url: "https://www.ncses.nsf.gov/pubs/nsbsep20261",
  },
  {
    label: "NSF NCSES — Discovery: R&D and publications (prior 2022 vintage)",
    url: "https://ncses.nsf.gov/pubs/nsb20257/global-r-d-and-international-comparisons-2",
  },
  {
    label: "OECD Main Science and Technology Indicators",
    url: "https://www.oecd.org/en/data/datasets/main-science-and-technology-indicators.html",
  },
] as const;

/** Headline meters — 2024 print and Δ vs prior 2022 research post */
export const HEADLINE = {
  globalGerd2024Tn: 3.48,
  globalGerd2022Tn: 3.1,
  globalGerdDeltaTn: 0.38,
  usShare2024Pct: 29,
  chinaShare2024Pct: 30,
  usChinaShare2024Pct: 59,
  usShare2022Pct: 30,
  chinaShare2022Pct: 27,
  usChinaShare2022Pct: 57,
  usChinaDeltaPp: 2,
  chinaOvertake: true,
  top5DisclosedShare2024Pct: 76,
  eu27Share2024Pct: 18,
  eu27Gerd2024Bn: 612,
  usGerd2024Bn: 1009,
  chinaGerd2024Bn: 1028,
  usGerd2022Bn: 923.2,
  chinaGerd2022Bn: 811.9,
  japanGerd2024Bn: 234,
  germanyGerd2024Bn: 193,
  koreaGerd2024Bn: 162,
  chinaPubs2024Pct: 31,
  usPubs2024Pct: 12,
  indiaPubs2024Pct: 7,
  chinaPubs2022Pct: 27,
  usPubs2022Pct: 14,
  top3PubsShare2024Pct: 50,
  worldPubs2024M: 3.5,
  usIntensity2024Pct: 3.4,
  chinaIntensity2024Pct: 2.7,
  koreaIntensity2024Pct: 5.1,
  japanIntensity2024Pct: 3.6,
  taiwanIntensity2024Pct: 4.1,
  germanyIntensity2024Pct: 3.1,
  eu27Intensity2024Pct: 2.1,
  usHcaShare2022Pct: 1.7,
  chinaHcaShare2022Pct: 1.3,
  eu27HcaShare2022Pct: 1.3,
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

/** Share path anchors — 2000/2010/2022 from prior post; 2024 from State of S&E 2026. */
export type GerdShareRow = {
  year: number;
  usa: number;
  chn: number;
  eu27: number;
  jpn: number;
  kor: number;
  confidence: Confidence;
};

export const GERD_SHARE_PATH: GerdShareRow[] = [
  { year: 2000, usa: 39, chn: 5, eu27: 25, jpn: 14, kor: 2.5, confidence: "disclosed" },
  { year: 2010, usa: 31, chn: 15, eu27: 22, jpn: 11, kor: 3.8, confidence: "disclosed" },
  { year: 2022, usa: 30, chn: 27, eu27: 18, jpn: 6.5, kor: 4.5, confidence: "disclosed" },
  { year: 2024, usa: 29, chn: 30, eu27: 18, jpn: 6.7, kor: 4.7, confidence: "disclosed" },
];

/** Prior (2022) vs new (2024) GERD volumes — PPP $bn where disclosed. */
export type VintageVolumeRow = {
  id: EconomyId;
  label: string;
  short: string;
  color: string;
  gerd2022Bn: number | null;
  gerd2024Bn: number | null;
  share2022Pct: number | null;
  share2024Pct: number | null;
  intensity2022Pct: number | null;
  intensity2024Pct: number | null;
  confidence: Confidence;
  note: string;
};

export const VINTAGE_VOLUMES: VintageVolumeRow[] = [
  {
    id: "chn",
    label: "China",
    short: "China",
    color: "#f43f5e",
    gerd2022Bn: 811.9,
    gerd2024Bn: 1028,
    share2022Pct: 27,
    share2024Pct: 30,
    intensity2022Pct: 2.6,
    intensity2024Pct: 2.7,
    confidence: "disclosed",
    note: "Overtakes US on PPP GERD share in 2024",
  },
  {
    id: "usa",
    label: "United States",
    short: "US",
    color: "#0ea5e9",
    gerd2022Bn: 923.2,
    gerd2024Bn: 1009,
    share2022Pct: 30,
    share2024Pct: 29,
    intensity2022Pct: 3.6,
    intensity2024Pct: 3.4,
    confidence: "disclosed",
    note: "Still #2 on PPP dollars; intensity eases 3.6→3.4",
  },
  {
    id: "eu27",
    label: "EU-27",
    short: "EU-27",
    color: "#8b5cf6",
    gerd2022Bn: null,
    gerd2024Bn: 612,
    share2022Pct: 18,
    share2024Pct: 18,
    intensity2022Pct: 2.1,
    intensity2024Pct: 2.1,
    confidence: "disclosed",
    note: "Share flat at 18%; third behind CN and US",
  },
  {
    id: "jpn",
    label: "Japan",
    short: "Japan",
    color: "#14b8a6",
    gerd2022Bn: 200.8,
    gerd2024Bn: 234,
    share2022Pct: 6.5,
    share2024Pct: 6.7,
    intensity2022Pct: 3.4,
    intensity2024Pct: 3.6,
    confidence: "disclosed",
    note: "Dollar stack up; intensity rises to 3.6%",
  },
  {
    id: "deu",
    label: "Germany",
    short: "Germany",
    color: "#f59e0b",
    gerd2022Bn: 174.9,
    gerd2024Bn: 193,
    share2022Pct: 5.6,
    share2024Pct: 5.5,
    intensity2022Pct: 3.1,
    intensity2024Pct: 3.1,
    confidence: "disclosed",
    note: "Absolute GERD up; share roughly flat",
  },
  {
    id: "kor",
    label: "South Korea",
    short: "Korea",
    color: "#6366f1",
    gerd2022Bn: 139.0,
    gerd2024Bn: 162,
    share2022Pct: 4.5,
    share2024Pct: 4.7,
    intensity2022Pct: 5.2,
    intensity2024Pct: 5.1,
    confidence: "disclosed",
    note: "Still intensity leader among large performers",
  },
];

/** Share deltas (pp) for ranked Δ chart — 2022 → 2024. */
export type ShareDeltaRow = {
  id: EconomyId;
  label: string;
  short: string;
  color: string;
  deltaPp: number;
  priorPct: number;
  newPct: number;
  confidence: Confidence;
};

export const SHARE_DELTAS: ShareDeltaRow[] = [
  {
    id: "chn",
    label: "China",
    short: "China",
    color: "#f43f5e",
    deltaPp: 3,
    priorPct: 27,
    newPct: 30,
    confidence: "disclosed",
  },
  {
    id: "kor",
    label: "South Korea",
    short: "Korea",
    color: "#6366f1",
    deltaPp: 0.2,
    priorPct: 4.5,
    newPct: 4.7,
    confidence: "disclosed",
  },
  {
    id: "jpn",
    label: "Japan",
    short: "Japan",
    color: "#14b8a6",
    deltaPp: 0.2,
    priorPct: 6.5,
    newPct: 6.7,
    confidence: "disclosed",
  },
  {
    id: "eu27",
    label: "EU-27",
    short: "EU-27",
    color: "#8b5cf6",
    deltaPp: 0,
    priorPct: 18,
    newPct: 18,
    confidence: "disclosed",
  },
  {
    id: "deu",
    label: "Germany",
    short: "Germany",
    color: "#f59e0b",
    deltaPp: -0.1,
    priorPct: 5.6,
    newPct: 5.5,
    confidence: "disclosed",
  },
  {
    id: "usa",
    label: "United States",
    short: "US",
    color: "#0ea5e9",
    deltaPp: -1,
    priorPct: 30,
    newPct: 29,
    confidence: "disclosed",
  },
];

/** Publication share vintage: 2022 research post → 2024 State of S&E. */
export type PubVintageRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  share2022Pct: number;
  share2024Pct: number;
  deltaPp: number;
  confidence: Confidence;
};

export const PUB_VINTAGE: PubVintageRow[] = [
  {
    id: "chn",
    label: "China",
    short: "China",
    color: "#f43f5e",
    share2022Pct: 27,
    share2024Pct: 31,
    deltaPp: 4,
    confidence: "disclosed",
  },
  {
    id: "usa",
    label: "United States",
    short: "US",
    color: "#0ea5e9",
    share2022Pct: 14,
    share2024Pct: 12,
    deltaPp: -2,
    confidence: "disclosed",
  },
  {
    id: "ind",
    label: "India",
    short: "India",
    color: "#fb923c",
    share2022Pct: 6,
    share2024Pct: 7,
    deltaPp: 1,
    confidence: "disclosed",
  },
];

/** Concentration meters — prior vs new. */
export type ConcentrationMeter = {
  label: string;
  prior: string;
  neu: string;
  delta: string;
  detail: string;
};

export const CONCENTRATION_METERS: ConcentrationMeter[] = [
  {
    label: "US + China GERD share",
    prior: "57%",
    neu: "59%",
    delta: "+2 pp",
    detail: "2022 → 2024 PPP share of OECD-coverage world",
  },
  {
    label: "China GERD share",
    prior: "27%",
    neu: "30%",
    delta: "+3 pp",
    detail: "Overtakes US (29%) on PPP dollars",
  },
  {
    label: "US GERD share",
    prior: "30%",
    neu: "29%",
    delta: "−1 pp",
    detail: "Still near-peer; absolute stack still ~$1.0T",
  },
  {
    label: "Global GERD (PPP)",
    prior: "~$3.1T",
    neu: "$3.48T",
    delta: "+$0.38T",
    detail: "OECD-coverage worldwide total",
  },
  {
    label: "China S&E pubs share",
    prior: "27%",
    neu: "31%",
    delta: "+4 pp",
    detail: "Fractional-count peer-reviewed articles",
  },
  {
    label: "US S&E pubs share",
    prior: "14%",
    neu: "12%",
    delta: "−2 pp",
    detail: "Volume peak was 2021; modest path since",
  },
  {
    label: "Top publication producers",
    prior: "Top-6 >50%",
    neu: "Top-3 = 50%",
    delta: "tighter",
    detail: "CN+US+IN alone now half of world output",
  },
  {
    label: "EU-27 GERD share",
    prior: "18%",
    neu: "18%",
    delta: "flat",
    detail: "$612B in 2024; third behind CN and US",
  },
];

/** Intensity leaders — 2024 State of S&E print (Israel not restated in summary). */
export type IntensityRow = {
  id: string;
  label: string;
  short: string;
  intensity2022Pct: number | null;
  intensity2024Pct: number;
  color: string;
  confidence: Confidence;
};

export const INTENSITY_LEADERS: IntensityRow[] = [
  {
    id: "kor",
    label: "South Korea",
    short: "Korea",
    intensity2022Pct: 5.2,
    intensity2024Pct: 5.1,
    color: "#6366f1",
    confidence: "disclosed",
  },
  {
    id: "twn",
    label: "Taiwan",
    short: "Taiwan",
    intensity2022Pct: 4.0,
    intensity2024Pct: 4.1,
    color: "#06b6d4",
    confidence: "disclosed",
  },
  {
    id: "jpn",
    label: "Japan",
    short: "Japan",
    intensity2022Pct: 3.4,
    intensity2024Pct: 3.6,
    color: "#14b8a6",
    confidence: "disclosed",
  },
  {
    id: "usa",
    label: "United States",
    short: "US",
    intensity2022Pct: 3.6,
    intensity2024Pct: 3.4,
    color: "#0ea5e9",
    confidence: "disclosed",
  },
  {
    id: "deu",
    label: "Germany",
    short: "Germany",
    intensity2022Pct: 3.1,
    intensity2024Pct: 3.1,
    color: "#f59e0b",
    confidence: "disclosed",
  },
  {
    id: "chn",
    label: "China",
    short: "China",
    intensity2022Pct: 2.6,
    intensity2024Pct: 2.7,
    color: "#f43f5e",
    confidence: "disclosed",
  },
  {
    id: "eu27",
    label: "EU-27",
    short: "EU-27",
    intensity2022Pct: 2.1,
    intensity2024Pct: 2.1,
    color: "#8b5cf6",
    confidence: "disclosed",
  },
];

/** HCA share of publications (top 1% cited) — 2022 articles, State of S&E 2026 framing. */
export type HcaShareRow = {
  id: string;
  label: string;
  short: string;
  color: string;
  hcaSharePct: number;
  pubShare2024Pct: number | null;
  confidence: Confidence;
  note: string;
};

export const HCA_SHARES: HcaShareRow[] = [
  {
    id: "usa",
    label: "United States",
    short: "US",
    color: "#0ea5e9",
    hcaSharePct: 1.7,
    pubShare2024Pct: 12,
    confidence: "disclosed",
    note: "Disproportionate influence vs volume share",
  },
  {
    id: "chn",
    label: "China",
    short: "China",
    color: "#f43f5e",
    hcaSharePct: 1.3,
    pubShare2024Pct: 31,
    confidence: "disclosed",
    note: "Rising each year since 2006; still below US",
  },
  {
    id: "eu27",
    label: "EU-27",
    short: "EU-27",
    color: "#8b5cf6",
    hcaSharePct: 1.3,
    pubShare2024Pct: null,
    confidence: "disclosed",
    note: "Matches China’s HCA share collectively",
  },
  {
    id: "jpn",
    label: "Japan",
    short: "Japan",
    color: "#14b8a6",
    hcaSharePct: 1.1,
    pubShare2024Pct: null,
    confidence: "disclosed",
    note: "Near world 1% baseline",
  },
  {
    id: "ind",
    label: "India",
    short: "India",
    color: "#fb923c",
    hcaSharePct: 1.1,
    pubShare2024Pct: 7,
    confidence: "disclosed",
    note: "Volume rising faster than HCA share",
  },
];

export function rankedShareDeltas(): ShareDeltaRow[] {
  return [...SHARE_DELTAS].sort((a, b) => b.deltaPp - a.deltaPp);
}

export function rankedIntensity(): IntensityRow[] {
  return [...INTENSITY_LEADERS].sort(
    (a, b) => b.intensity2024Pct - a.intensity2024Pct,
  );
}

export function volumeDeltas(): Array<
  VintageVolumeRow & { deltaBn: number; deltaPct: number }
> {
  return VINTAGE_VOLUMES.filter(
    (r) => r.gerd2022Bn != null && r.gerd2024Bn != null,
  ).map((r) => {
    const prior = r.gerd2022Bn as number;
    const neu = r.gerd2024Bn as number;
    return {
      ...r,
      deltaBn: neu - prior,
      deltaPct: ((neu - prior) / prior) * 100,
    };
  });
}

export function fmtBn(n: number, digits = 0): string {
  if (n >= 100) return `$${n.toFixed(digits)}B`;
  return `$${n.toFixed(1)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtTn(n: number): string {
  return `$${n.toFixed(2)}T`;
}
