/**
 * Measurement & science — geography lens (2026).
 *
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * (Where is progress funded and published — is it concentrating?)
 *
 * Complements Top-k concentration prints (2026 / Q3 / Aug 202608) with country
 * and regional share maps across four perimeters that disagree on who sits first:
 * (1) GERD PPP funding — China 29.4% / US 29.1% knife-edge,
 * (2) S&E publication volume — China 31% / US 12% / India 7%,
 * (3) CET AI priority patents — China ~75%,
 * (4) KTI value-added — US 28% / China 25% / EU-27 18%,
 * plus regional blocs, share paths, intensity×share scatter, and funding-vs-output gaps.
 *
 * Primary sources: OECD/AAAS 2024 GERD restatement; NSF/NSB Indicators + State of
 * S&E 2026 + Translation; China NBS 2025 Communiqué (domestic flow aside);
 * prior theme concentration + Aug update.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Geography lens on measurement & science. Carried PPP GERD shares: OECD/AAAS 2024 (China 29.4% / US 29.1%; Top-3 65.2%; US+China 58.5%; world ~$3.48T PPP). Pubs: NSF Indicators 2024 fractional counts (CN 31% / US 12% / India 7%). CET AI priority patent families ~75% China (NSF Translation). KTI VA: US 28% / China 25% / EU-27 18% of ~$11.7T. Regional blocs and intensity×share points are desk aggregations of disclosed country anchors — not a single OECD choropleth filing. China 2025 ¥3.9262T domestic GERD is a national flow aside, not a world-share splice. HHI is analytical on stated buckets (0–10,000).";

export const SOURCES = [
  {
    label: "AAAS — Global R&D Update 2026 (9 Jun 2026)",
    url: "https://www.aaas.org/sites/default/files/2026-06/AAAS%20Global%20RD%20Update%202026.pdf",
  },
  {
    label: "NSF/NSB — State of U.S. Science and Engineering 2026",
    url: "https://www.ncses.nsf.gov/pubs/nsbsep20261",
  },
  {
    label: "China NBS — 2025 Statistical Communiqué (R&D section)",
    url: "https://www.stats.gov.cn/english/",
  },
  {
    label: "Aug 202608 concentration companion",
    url: "/blog/measurement-science-concentration-202608",
  },
  {
    label: "August theme update — China 2025 flow + CET",
    url: "/blog/measurement-science-update-202608",
  },
] as const;

export const PRIOR_CONC_PATH = "/blog/measurement-science-concentration-2026";
export const PRIOR_Q3_CONC_PATH =
  "/blog/measurement-science-concentration-2026q3";
export const PRIOR_AUG_CONC_PATH =
  "/blog/measurement-science-concentration-202608";
export const PRIOR_AUG_UPDATE_PATH = "/blog/measurement-science-update-202608";
export const PRIOR_RESEARCH_PATH = "/blog/measurement-science-research-2026";

/** Headline punchline — multi-map geography */
export const HEADLINE = {
  gerdWorldTn: 3.48,
  gerdTop1Pct: 29.4,
  gerdTop1Label: "China",
  gerdUsPct: 29.1,
  gerdTop3Pct: 65.2,
  gerdUsChinaPct: 58.5,
  gerdGapPp: 0.3,
  gerdHhi: 1890,

  pubsTop1Pct: 31,
  pubsTop1Label: "China",
  pubsUsPct: 12,
  pubsIndiaPct: 7,
  pubsTop3Pct: 50,
  pubsHhi: 1320,

  cetAiTop1Pct: 75,
  cetAiTop1Label: "China",
  cetAiTop3Pct: 92,
  cetHhi: 5820,

  usptoUsApplicantSharePct: 47,
  usptoTop1Label: "United States",

  ktiWorldTn: 11.7,
  ktiTop1Pct: 28,
  ktiTop1Label: "United States",
  ktiChinaPct: 25,
  ktiEuPct: 18,
  ktiTop3Pct: 71,
  ktiHhi: 1780,

  /** Regional GERD bloc shares (desk roll-up of country anchors) */
  eastAsiaGerdPct: 40.8,
  northAmericaGerdPct: 31.5,
  europeGerdPct: 18.2,
  rowGerdPct: 9.5,

  /** China 2025 domestic flow aside */
  china2025GerdTnYuan: 3.9262,
  china2025YoyPct: 8.1,
  china2025IntensityPct: 2.8,
  us2024IntensityPct: 3.4,

  /** Funding vs pubs gap (China pubs − China GERD) */
  chinaPubsMinusGerdPp: 1.6,
  usPubsMinusGerdPp: -17.1,
} as const;

export type PerimeterId = "gerd" | "pubs" | "cet" | "kti" | "uspto";

export type CountryRow = {
  id: string;
  name: string;
  short: string;
  region: "East Asia" | "North America" | "Europe" | "South Asia" | "RoW";
  gerdSharePct: number;
  pubsSharePct: number;
  cetSharePct: number;
  ktiSharePct: number;
  usptoSharePct: number;
  intensityPct: number;
  fill: string;
  confidence: Confidence;
  note?: string;
};

/**
 * Country geography anchors. Shares are within each perimeter (columns sum ~100
 * after RoW plug). Intensity is GERD/GDP % (OECD / NBS / NSF desk mix).
 */
export const COUNTRY_ROWS: CountryRow[] = [
  {
    id: "chn",
    name: "China",
    short: "China",
    region: "East Asia",
    gerdSharePct: 29.4,
    pubsSharePct: 31,
    cetSharePct: 75,
    ktiSharePct: 25,
    usptoSharePct: 8,
    intensityPct: 2.8,
    fill: "#f43f5e",
    confidence: "carried",
    note: "GERD PPP knife-edge; pubs + CET tip harder",
  },
  {
    id: "usa",
    name: "United States",
    short: "US",
    region: "North America",
    gerdSharePct: 29.1,
    pubsSharePct: 12,
    cetSharePct: 12,
    ktiSharePct: 28,
    usptoSharePct: 47,
    intensityPct: 3.4,
    fill: "#0ea5e9",
    confidence: "carried",
    note: "Still Top-1 on KTI VA + USPTO utility applicants",
  },
  {
    id: "jpn",
    name: "Japan",
    short: "Japan",
    region: "East Asia",
    gerdSharePct: 6.7,
    pubsSharePct: 2.5,
    cetSharePct: 3,
    ktiSharePct: 7,
    usptoSharePct: 12,
    intensityPct: 3.3,
    fill: "#14b8a6",
    confidence: "carried",
  },
  {
    id: "deu",
    name: "Germany",
    short: "Germany",
    region: "Europe",
    gerdSharePct: 5.5,
    pubsSharePct: 3,
    cetSharePct: 2,
    ktiSharePct: 5,
    usptoSharePct: 6,
    intensityPct: 3.1,
    fill: "#f59e0b",
    confidence: "carried",
  },
  {
    id: "kor",
    name: "South Korea",
    short: "Korea",
    region: "East Asia",
    gerdSharePct: 4.7,
    pubsSharePct: 2.2,
    cetSharePct: 2,
    ktiSharePct: 3,
    usptoSharePct: 7,
    intensityPct: 4.9,
    fill: "#6366f1",
    confidence: "carried",
  },
  {
    id: "ind",
    name: "India",
    short: "India",
    region: "South Asia",
    gerdSharePct: 1.8,
    pubsSharePct: 7,
    cetSharePct: 1,
    ktiSharePct: 2,
    usptoSharePct: 2,
    intensityPct: 0.7,
    fill: "#fb923c",
    confidence: "estimated",
    note: "Pubs punch above GERD share",
  },
  {
    id: "gbr",
    name: "United Kingdom",
    short: "UK",
    region: "Europe",
    gerdSharePct: 2.4,
    pubsSharePct: 3,
    cetSharePct: 1.5,
    ktiSharePct: 3,
    usptoSharePct: 3,
    intensityPct: 2.9,
    fill: "#ec4899",
    confidence: "estimated",
  },
  {
    id: "fra",
    name: "France",
    short: "France",
    region: "Europe",
    gerdSharePct: 2.3,
    pubsSharePct: 2.2,
    cetSharePct: 1,
    ktiSharePct: 2.5,
    usptoSharePct: 2,
    intensityPct: 2.3,
    fill: "#a855f7",
    confidence: "estimated",
  },
  {
    id: "row",
    name: "Rest of world",
    short: "RoW",
    region: "RoW",
    gerdSharePct: 18.1,
    pubsSharePct: 37.1,
    cetSharePct: 2.5,
    ktiSharePct: 24.5,
    usptoSharePct: 13,
    intensityPct: 1.1,
    fill: "#94a3b8",
    confidence: "estimated",
    note: "Closing plug after disclosed anchors",
  },
];

export type RegionBloc = {
  id: string;
  region: string;
  short: string;
  gerdSharePct: number;
  pubsSharePct: number;
  cetSharePct: number;
  ktiSharePct: number;
  gerdTn: number;
  fill: string;
  confidence: Confidence;
  note?: string;
};

/** Regional geography — desk roll-up of country anchors into blocs */
export const REGION_BLOCS: RegionBloc[] = [
  {
    id: "eas",
    region: "East Asia",
    short: "E. Asia",
    gerdSharePct: 40.8,
    pubsSharePct: 35.7,
    cetSharePct: 80,
    ktiSharePct: 35,
    gerdTn: 1.42,
    fill: "#f43f5e",
    confidence: "estimated",
    note: "China + Japan + Korea tip; CET extreme",
  },
  {
    id: "nam",
    region: "North America",
    short: "N. America",
    gerdSharePct: 31.5,
    pubsSharePct: 13.5,
    cetSharePct: 13,
    ktiSharePct: 30,
    gerdTn: 1.1,
    fill: "#0ea5e9",
    confidence: "estimated",
    note: "US-dominated; still KTI Tip-1 country",
  },
  {
    id: "eur",
    region: "Europe",
    short: "Europe",
    gerdSharePct: 18.2,
    pubsSharePct: 14.5,
    cetSharePct: 5,
    ktiSharePct: 22,
    gerdTn: 0.63,
    fill: "#8b5cf6",
    confidence: "estimated",
    note: "EU-27 + UK; plural but thinner tip",
  },
  {
    id: "sas",
    region: "South Asia",
    short: "S. Asia",
    gerdSharePct: 2.0,
    pubsSharePct: 7.5,
    cetSharePct: 1.2,
    ktiSharePct: 2.5,
    gerdTn: 0.07,
    fill: "#fb923c",
    confidence: "estimated",
    note: "India pubs punch above GERD",
  },
  {
    id: "row",
    region: "Rest of world",
    short: "RoW",
    gerdSharePct: 7.5,
    pubsSharePct: 28.8,
    cetSharePct: 0.8,
    ktiSharePct: 10.5,
    gerdTn: 0.26,
    fill: "#94a3b8",
    confidence: "estimated",
  },
];

export type SharePathPoint = {
  year: number;
  chinaGerdPct: number;
  usGerdPct: number;
  chinaPubsPct: number;
  usPubsPct: number;
  eastAsiaGerdPct: number;
  northAmericaGerdPct: number;
};

/** Carried / estimated share path — geography thickening over time */
export const SHARE_PATH: SharePathPoint[] = [
  {
    year: 2010,
    chinaGerdPct: 14.2,
    usGerdPct: 32.8,
    chinaPubsPct: 12,
    usPubsPct: 22,
    eastAsiaGerdPct: 26,
    northAmericaGerdPct: 36,
  },
  {
    year: 2014,
    chinaGerdPct: 19.8,
    usGerdPct: 31.2,
    chinaPubsPct: 18,
    usPubsPct: 18,
    eastAsiaGerdPct: 31,
    northAmericaGerdPct: 34,
  },
  {
    year: 2018,
    chinaGerdPct: 24.5,
    usGerdPct: 30.0,
    chinaPubsPct: 24,
    usPubsPct: 15,
    eastAsiaGerdPct: 36,
    northAmericaGerdPct: 33,
  },
  {
    year: 2022,
    chinaGerdPct: 27.8,
    usGerdPct: 29.4,
    chinaPubsPct: 28,
    usPubsPct: 13,
    eastAsiaGerdPct: 39,
    northAmericaGerdPct: 32,
  },
  {
    year: 2024,
    chinaGerdPct: 29.4,
    usGerdPct: 29.1,
    chinaPubsPct: 31,
    usPubsPct: 12,
    eastAsiaGerdPct: 40.8,
    northAmericaGerdPct: 31.5,
  },
];

export type MeterRow = {
  id: PerimeterId;
  label: string;
  top1Pct: number;
  top1Label: string;
  top3Pct: number;
  top3Labels: string;
  hhi: number;
  fill: string;
  confidence: Confidence;
  note: string;
};

export const METER_COMPARE: MeterRow[] = [
  {
    id: "gerd",
    label: "GERD funding (PPP)",
    top1Pct: HEADLINE.gerdTop1Pct,
    top1Label: HEADLINE.gerdTop1Label,
    top3Pct: HEADLINE.gerdTop3Pct,
    top3Labels: "China + US + Japan",
    hhi: HEADLINE.gerdHhi,
    fill: "#f43f5e",
    confidence: "carried",
    note: "Knife-edge Top-1; East Asia bloc ~41%",
  },
  {
    id: "pubs",
    label: "S&E publication volume",
    top1Pct: HEADLINE.pubsTop1Pct,
    top1Label: HEADLINE.pubsTop1Label,
    top3Pct: HEADLINE.pubsTop3Pct,
    top3Labels: "China + US + India",
    hhi: HEADLINE.pubsHhi,
    fill: "#f59e0b",
    confidence: "disclosed",
    note: "China tip harder than GERD; India in Top-3",
  },
  {
    id: "cet",
    label: "CET AI priority patents",
    top1Pct: HEADLINE.cetAiTop1Pct,
    top1Label: HEADLINE.cetAiTop1Label,
    top3Pct: HEADLINE.cetAiTop3Pct,
    top3Labels: "China + US + EU-27",
    hhi: HEADLINE.cetHhi,
    fill: "#8b5cf6",
    confidence: "disclosed",
    note: "Geography extreme — East Asia ~80%",
  },
  {
    id: "kti",
    label: "KTI value-added",
    top1Pct: HEADLINE.ktiTop1Pct,
    top1Label: HEADLINE.ktiTop1Label,
    top3Pct: HEADLINE.ktiTop3Pct,
    top3Labels: "US + China + EU-27",
    hhi: HEADLINE.ktiHhi,
    fill: "#14b8a6",
    confidence: "disclosed",
    note: "US still Top-1 country on VA",
  },
  {
    id: "uspto",
    label: "USPTO utility applicants",
    top1Pct: HEADLINE.usptoUsApplicantSharePct,
    top1Label: HEADLINE.usptoTop1Label,
    top3Pct: 72,
    top3Labels: "US + Japan + Korea",
    hhi: 2680,
    fill: "#0ea5e9",
    confidence: "estimated",
    note: "Domestic utility grants still US-led",
  },
];

export type GapRow = {
  country: string;
  short: string;
  gerdSharePct: number;
  outputSharePct: number;
  gapPp: number;
  outputLens: string;
  fill: string;
};

/** Funding vs output geography mismatch (output − GERD share) */
export const FUNDING_OUTPUT_GAPS: GapRow[] = [
  {
    country: "China",
    short: "China",
    gerdSharePct: 29.4,
    outputSharePct: 31,
    gapPp: 1.6,
    outputLens: "Pubs",
    fill: "#f43f5e",
  },
  {
    country: "United States",
    short: "US",
    gerdSharePct: 29.1,
    outputSharePct: 12,
    gapPp: -17.1,
    outputLens: "Pubs",
    fill: "#0ea5e9",
  },
  {
    country: "India",
    short: "India",
    gerdSharePct: 1.8,
    outputSharePct: 7,
    gapPp: 5.2,
    outputLens: "Pubs",
    fill: "#fb923c",
  },
  {
    country: "China (CET)",
    short: "CN CET",
    gerdSharePct: 29.4,
    outputSharePct: 75,
    gapPp: 45.6,
    outputLens: "CET AI",
    fill: "#8b5cf6",
  },
  {
    country: "United States (KTI)",
    short: "US KTI",
    gerdSharePct: 29.1,
    outputSharePct: 28,
    gapPp: -1.1,
    outputLens: "KTI VA",
    fill: "#14b8a6",
  },
  {
    country: "United States (USPTO)",
    short: "US PTO",
    gerdSharePct: 29.1,
    outputSharePct: 47,
    gapPp: 17.9,
    outputLens: "USPTO",
    fill: "#06b6d4",
  },
];

export type UsStateRow = {
  id: string;
  state: string;
  short: string;
  sharePct: number;
  gerdBn: number;
  intensityPct: number;
  fill: string;
  confidence: Confidence;
};

/**
 * Inside-US R&D geography tip (NSF / NCSES-style state shares of US BERD+HERD
 * desk roll-up). Shares of US domestic R&D, not world GERD.
 */
export const US_STATE_ROWS: UsStateRow[] = [
  {
    id: "ca",
    state: "California",
    short: "CA",
    sharePct: 22,
    gerdBn: 185,
    intensityPct: 4.8,
    fill: "#0ea5e9",
    confidence: "estimated",
  },
  {
    id: "ma",
    state: "Massachusetts",
    short: "MA",
    sharePct: 8,
    gerdBn: 67,
    intensityPct: 6.2,
    fill: "#6366f1",
    confidence: "estimated",
  },
  {
    id: "tx",
    state: "Texas",
    short: "TX",
    sharePct: 7,
    gerdBn: 59,
    intensityPct: 2.1,
    fill: "#f59e0b",
    confidence: "estimated",
  },
  {
    id: "ny",
    state: "New York",
    short: "NY",
    sharePct: 6,
    gerdBn: 50,
    intensityPct: 2.4,
    fill: "#ec4899",
    confidence: "estimated",
  },
  {
    id: "wa",
    state: "Washington",
    short: "WA",
    sharePct: 5.5,
    gerdBn: 46,
    intensityPct: 4.1,
    fill: "#14b8a6",
    confidence: "estimated",
  },
  {
    id: "nj",
    state: "New Jersey",
    short: "NJ",
    sharePct: 4.5,
    gerdBn: 38,
    intensityPct: 3.6,
    fill: "#a855f7",
    confidence: "estimated",
  },
  {
    id: "il",
    state: "Illinois",
    short: "IL",
    sharePct: 4,
    gerdBn: 34,
    intensityPct: 2.3,
    fill: "#22c55e",
    confidence: "estimated",
  },
  {
    id: "row",
    state: "Other states",
    short: "Other",
    sharePct: 43,
    gerdBn: 361,
    intensityPct: 2.0,
    fill: "#94a3b8",
    confidence: "estimated",
  },
];

/* ── helpers ─────────────────────────────────────────────────────── */

export type ShareLens = "gerd" | "pubs" | "cet" | "kti" | "uspto";

export function countryShare(row: CountryRow, lens: ShareLens): number {
  switch (lens) {
    case "gerd":
      return row.gerdSharePct;
    case "pubs":
      return row.pubsSharePct;
    case "cet":
      return row.cetSharePct;
    case "kti":
      return row.ktiSharePct;
    case "uspto":
      return row.usptoSharePct;
  }
}

export function regionShare(row: RegionBloc, lens: ShareLens): number {
  switch (lens) {
    case "gerd":
      return row.gerdSharePct;
    case "pubs":
      return row.pubsSharePct;
    case "cet":
      return row.cetSharePct;
    case "kti":
      return row.ktiSharePct;
    case "uspto":
      return row.ktiSharePct; // USPTO not regionalized; proxy KTI for bloc compare
  }
}

export function countryBars(lens: ShareLens) {
  return COUNTRY_ROWS.filter((r) => r.id !== "row" || lens === "gerd")
    .map((r) => ({
      name: r.short,
      share: countryShare(r, lens),
      fill: r.fill,
      region: r.region,
      intensity: r.intensityPct,
    }))
    .sort((a, b) => b.share - a.share);
}

export function regionBars(lens: ShareLens) {
  return REGION_BLOCS.map((r) => ({
    name: r.short,
    share: regionShare(r, lens),
    fill: r.fill,
    gerdTn: r.gerdTn,
  })).sort((a, b) => b.share - a.share);
}

export function regionPie(lens: ShareLens) {
  return REGION_BLOCS.map((r) => ({
    name: r.short,
    value: regionShare(r, lens),
    fill: r.fill,
  }));
}

export function intensityScatter(regionFilter: string) {
  return COUNTRY_ROWS.filter(
    (r) =>
      r.id !== "row" &&
      (regionFilter === "all" || r.region === regionFilter),
  ).map((r) => ({
    name: r.short,
    intensity: r.intensityPct,
    gerdShare: r.gerdSharePct,
    pubsShare: r.pubsSharePct,
    z: Math.max(r.gerdSharePct, 1),
    fill: r.fill,
    region: r.region,
  }));
}

export function meterBars() {
  return METER_COMPARE.map((m) => ({
    name: m.label.replace(" (PPP)", "").replace(" priority patents", ""),
    top1: m.top1Pct,
    top3: m.top3Pct,
    fill: m.fill,
    tip: m.top1Label,
  }));
}

export function gapBars() {
  return FUNDING_OUTPUT_GAPS.map((g) => ({
    name: g.short,
    gap: g.gapPp,
    fill: g.fill,
    lens: g.outputLens,
  }));
}

export function usStateBars(metric: "share" | "dollars" | "intensity") {
  return US_STATE_ROWS.map((s) => ({
    name: s.short,
    value:
      metric === "share"
        ? s.sharePct
        : metric === "dollars"
          ? s.gerdBn
          : s.intensityPct,
    fill: s.fill,
  }));
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtTn(n: number): string {
  return `$${n.toFixed(2)}T`;
}
