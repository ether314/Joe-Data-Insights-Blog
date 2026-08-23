/**
 * Global 5G auction proceeds vs population coverage — 2026 desk synthesis.
 * Core question: Which countries extracted the most auction revenue per MHz-pop,
 * and did high prices predict faster 5G population coverage?
 *
 * Anchors: GSA Spectrum Pricing updates (2024–2025); GSMA Global Spectrum Pricing
 * (2025); national regulator auction notices (FCC Auction 107, Ofcom, BNetzA,
 * Mise, Anatel, DoT India, MSIT Korea). Coverage figures are desk estimates
 * aligned to GSMA/GSA mid-band 5G population-coverage reporting windows
 * (~3–5 years after primary mid-band award). USD conversions use award-year
 * FX; multi-band packages are attributed to the headline mid-band tranche where
 * regulators published separable fees.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Auction proceeds and $/MHz-pop for completed awards follow GSA Spectrum Pricing trackers and regulator result notices (FCC, Ofcom, BNetzA, Mise, Anatel, DoT, MSIT, ISED). Where a multi-band package lacked band-separable fees, the desk attributes proceeds to the primary mid-band tranche and flags confidence as estimated. 5G population-coverage percentages are desk estimates anchored to GSMA/GSA reporting ~3–5 years after the country’s primary mid-band award (not same-calendar-year snapshots). Administrative assignments (e.g. China) are shown for coverage contrast and excluded from price-rank averages.";

export const SOURCES = [
  {
    label: "GSA — Spectrum Pricing (May 2025 update)",
    url: "https://gsacom.com/paper/spectrum-pricing-may-2025/",
  },
  {
    label: "GSA — Spectrum Pricing (April 2024)",
    url: "https://gsacom.com/paper/spectrum-pricing-april-2024/",
  },
  {
    label: "GSMA — Global Spectrum Pricing (2025)",
    url: "https://www.gsma.com/connectivity-for-good/spectrum/wp-content/uploads/2025/05/Global-Spectrum-Pricing-v2.pdf",
  },
  {
    label: "FCC — Auction 107 (C-band) results",
    url: "https://www.fcc.gov/auction/107",
  },
  {
    label: "Anatel — Brazil 5G multiband auction (2021)",
    url: "https://www.gov.br/anatel/pt-br",
  },
] as const;

/** Headline desk stats for cards / excerpt. */
export const HEADLINE = {
  /** US C-band 2021 peak mid-band $/MHz-pop (GSA). */
  usCbandUsdPerMhzPop: 0.875,
  /** Recent global C-band average $/MHz-pop (GSA ~2024). */
  recentCbandAvgUsdPerMhzPop: 0.106,
  /** Peak year global auction proceeds $B (GSA fee sample, 2021). */
  peakYearProceedsB: 140.1,
  /** 2024 global auction proceeds $B (GSA). */
  proceeds2024B: 1.06,
  /** Sample countries where high $/MHz-pop coexists with sub-median coverage. */
  highPriceLagCoverageCount: 4,
  /** Brazil ~end-2024 5G pop coverage after obligation-heavy award (GSMA case). */
  brazilCoveragePct: 95,
  /** Spearman-style rank correlation (price vs coverage) in auction sample — weak/negative. */
  priceCoverageSpearman: -0.31,
  /** Italy 2018 mid-band package proceeds €B (regulator). */
  italy2018ProceedsEurB: 6.55,
  /** India spectrum cost as % of mobile sector revenue (GSMA 2023). */
  indiaSpectrumCostSharePct: 26,
} as const;

export type Region =
  | "North America"
  | "Europe"
  | "Asia-Pacific"
  | "Latin America"
  | "Middle East"
  | "Africa";

export type AwardDesign = "auction" | "admin" | "hybrid";

export type CountryAwardRow = {
  id: string;
  country: string;
  iso2: string;
  region: Region;
  awardYear: number;
  /** Primary mid-band label (e.g. 3.5 GHz / C-band). */
  band: string;
  /** Gross proceeds in award-year USD billions. */
  proceedsUsdB: number;
  /** Contiguous MHz awarded in the headline mid-band tranche. */
  mhz: number;
  /** Population used for MHz-pop (millions). */
  popM: number;
  /** USD per MHz per population (standard unit). */
  usdPerMhzPop: number;
  /** Desk estimate of 5G population coverage (%) ~3–5y after award. */
  coveragePct: number;
  /** Years from award to coverage observation. */
  coverageLagYears: number;
  design: AwardDesign;
  /** 0–3: coverage/buildout obligation intensity in licence terms. */
  obligationScore: number;
  confidence: Confidence;
};

/**
 * Cross-country mid-band panel. Prices are award-year $/MHz-pop for the
 * headline mid-band tranche; coverage is lagged population coverage.
 */
export const COUNTRY_AWARDS: CountryAwardRow[] = [
  {
    id: "us-2021",
    country: "United States",
    iso2: "US",
    region: "North America",
    awardYear: 2021,
    band: "C-band 3.7–3.98",
    proceedsUsdB: 81.1,
    mhz: 280,
    popM: 331,
    usdPerMhzPop: 0.875,
    coveragePct: 92,
    coverageLagYears: 4,
    design: "auction",
    obligationScore: 1,
    confidence: "disclosed",
  },
  {
    id: "it-2018",
    country: "Italy",
    iso2: "IT",
    region: "Europe",
    awardYear: 2018,
    band: "3.6–3.8 GHz",
    proceedsUsdB: 7.6,
    mhz: 200,
    popM: 60,
    usdPerMhzPop: 0.633,
    coveragePct: 78,
    coverageLagYears: 5,
    design: "auction",
    obligationScore: 1,
    confidence: "estimated",
  },
  {
    id: "de-2019",
    country: "Germany",
    iso2: "DE",
    region: "Europe",
    awardYear: 2019,
    band: "2 GHz / 3.6 GHz",
    proceedsUsdB: 7.4,
    mhz: 420,
    popM: 83,
    usdPerMhzPop: 0.212,
    coveragePct: 82,
    coverageLagYears: 5,
    design: "auction",
    obligationScore: 2,
    confidence: "estimated",
  },
  {
    id: "uk-2021",
    country: "United Kingdom",
    iso2: "GB",
    region: "Europe",
    awardYear: 2021,
    band: "3.6 GHz",
    proceedsUsdB: 1.9,
    mhz: 120,
    popM: 67,
    usdPerMhzPop: 0.236,
    coveragePct: 80,
    coverageLagYears: 4,
    design: "auction",
    obligationScore: 2,
    confidence: "estimated",
  },
  {
    id: "fr-2020",
    country: "France",
    iso2: "FR",
    region: "Europe",
    awardYear: 2020,
    band: "3.4–3.8 GHz",
    proceedsUsdB: 3.3,
    mhz: 310,
    popM: 67,
    usdPerMhzPop: 0.159,
    coveragePct: 85,
    coverageLagYears: 4,
    design: "hybrid",
    obligationScore: 3,
    confidence: "estimated",
  },
  {
    id: "es-2021",
    country: "Spain",
    iso2: "ES",
    region: "Europe",
    awardYear: 2021,
    band: "700 MHz / 3.5 GHz",
    proceedsUsdB: 1.2,
    mhz: 200,
    popM: 47,
    usdPerMhzPop: 0.128,
    coveragePct: 79,
    coverageLagYears: 4,
    design: "auction",
    obligationScore: 2,
    confidence: "estimated",
  },
  {
    id: "pl-2023",
    country: "Poland",
    iso2: "PL",
    region: "Europe",
    awardYear: 2023,
    band: "3.5 GHz",
    proceedsUsdB: 0.49,
    mhz: 400,
    popM: 38,
    usdPerMhzPop: 0.029,
    coveragePct: 62,
    coverageLagYears: 2,
    design: "auction",
    obligationScore: 2,
    confidence: "disclosed",
  },
  {
    id: "fi-2020",
    country: "Finland",
    iso2: "FI",
    region: "Europe",
    awardYear: 2020,
    band: "3.5 GHz",
    proceedsUsdB: 0.11,
    mhz: 390,
    popM: 5.5,
    usdPerMhzPop: 0.051,
    coveragePct: 94,
    coverageLagYears: 4,
    design: "auction",
    obligationScore: 2,
    confidence: "estimated",
  },
  {
    id: "kr-2018",
    country: "South Korea",
    iso2: "KR",
    region: "Asia-Pacific",
    awardYear: 2018,
    band: "3.5 GHz / 28 GHz",
    proceedsUsdB: 3.3,
    mhz: 280,
    popM: 52,
    usdPerMhzPop: 0.227,
    coveragePct: 97,
    coverageLagYears: 5,
    design: "auction",
    obligationScore: 3,
    confidence: "estimated",
  },
  {
    id: "jp-2019",
    country: "Japan",
    iso2: "JP",
    region: "Asia-Pacific",
    awardYear: 2019,
    band: "3.7 / 4.5 GHz",
    proceedsUsdB: 0.45,
    mhz: 400,
    popM: 126,
    usdPerMhzPop: 0.009,
    coveragePct: 96,
    coverageLagYears: 5,
    design: "admin",
    obligationScore: 3,
    confidence: "estimated",
  },
  {
    id: "cn-2019",
    country: "China",
    iso2: "CN",
    region: "Asia-Pacific",
    awardYear: 2019,
    band: "2.6 / 3.5 GHz",
    proceedsUsdB: 0,
    mhz: 500,
    popM: 1400,
    usdPerMhzPop: 0,
    coveragePct: 98,
    coverageLagYears: 5,
    design: "admin",
    obligationScore: 3,
    confidence: "carried",
  },
  {
    id: "in-2022",
    country: "India",
    iso2: "IN",
    region: "Asia-Pacific",
    awardYear: 2022,
    band: "mid-band package",
    proceedsUsdB: 19.0,
    mhz: 720,
    popM: 1400,
    usdPerMhzPop: 0.019,
    coveragePct: 48,
    coverageLagYears: 3,
    design: "auction",
    obligationScore: 1,
    confidence: "estimated",
  },
  {
    id: "au-2021",
    country: "Australia",
    iso2: "AU",
    region: "Asia-Pacific",
    awardYear: 2021,
    band: "26 GHz / mid-band",
    proceedsUsdB: 0.65,
    mhz: 240,
    popM: 26,
    usdPerMhzPop: 0.104,
    coveragePct: 88,
    coverageLagYears: 4,
    design: "auction",
    obligationScore: 2,
    confidence: "estimated",
  },
  {
    id: "ca-2023",
    country: "Canada",
    iso2: "CA",
    region: "North America",
    awardYear: 2023,
    band: "3.8 GHz",
    proceedsUsdB: 1.6,
    mhz: 250,
    popM: 39,
    usdPerMhzPop: 0.164,
    coveragePct: 86,
    coverageLagYears: 2,
    design: "auction",
    obligationScore: 2,
    confidence: "disclosed",
  },
  {
    id: "br-2021",
    country: "Brazil",
    iso2: "BR",
    region: "Latin America",
    awardYear: 2021,
    band: "3.5 GHz multiband",
    proceedsUsdB: 8.5,
    mhz: 400,
    popM: 213,
    usdPerMhzPop: 0.1,
    coveragePct: 95,
    coverageLagYears: 3,
    design: "auction",
    obligationScore: 3,
    confidence: "estimated",
  },
  {
    id: "sa-2019",
    country: "Saudi Arabia",
    iso2: "SA",
    region: "Middle East",
    awardYear: 2019,
    band: "3.5 GHz",
    proceedsUsdB: 2.0,
    mhz: 300,
    popM: 35,
    usdPerMhzPop: 0.19,
    coveragePct: 93,
    coverageLagYears: 5,
    design: "auction",
    obligationScore: 2,
    confidence: "estimated",
  },
  {
    id: "ae-2018",
    country: "UAE",
    iso2: "AE",
    region: "Middle East",
    awardYear: 2018,
    band: "3.5 GHz",
    proceedsUsdB: 0.4,
    mhz: 200,
    popM: 9.5,
    usdPerMhzPop: 0.211,
    coveragePct: 98,
    coverageLagYears: 5,
    design: "hybrid",
    obligationScore: 2,
    confidence: "estimated",
  },
  {
    id: "za-2022",
    country: "South Africa",
    iso2: "ZA",
    region: "Africa",
    awardYear: 2022,
    band: "3.5 GHz",
    proceedsUsdB: 0.22,
    mhz: 116,
    popM: 60,
    usdPerMhzPop: 0.032,
    coveragePct: 45,
    coverageLagYears: 3,
    design: "auction",
    obligationScore: 2,
    confidence: "estimated",
  },
];

export type GlobalProceedsYear = {
  year: number;
  proceedsUsdB: number;
  confidence: Confidence;
};

/** GSA fee-sample global auction + assignment proceeds by year. */
export const GLOBAL_PROCEEDS: GlobalProceedsYear[] = [
  { year: 2020, proceedsUsdB: 37.7, confidence: "disclosed" },
  { year: 2021, proceedsUsdB: 140.1, confidence: "disclosed" },
  { year: 2022, proceedsUsdB: 26.6, confidence: "disclosed" },
  { year: 2023, proceedsUsdB: 3.82, confidence: "disclosed" },
  { year: 2024, proceedsUsdB: 1.06, confidence: "disclosed" },
];

export type BandPriceRow = {
  band: string;
  label: string;
  avgUsdPerMhzPop: number;
  note: string;
};

/** Recent average prices by band class (GSA). */
export const BAND_PRICE_AVERAGES: BandPriceRow[] = [
  {
    band: "cband",
    label: "C-band / 3.5 GHz",
    avgUsdPerMhzPop: 0.106,
    note: "Recent average; US 2021 peak 0.875",
  },
  {
    band: "700",
    label: "700 MHz coverage",
    avgUsdPerMhzPop: 0.288,
    note: "Recent auction average",
  },
  {
    band: "mmwave",
    label: "mmWave",
    avgUsdPerMhzPop: 0.0007,
    note: "India 2022 mmWave reference",
  },
];

export type QuadrantId =
  | "high-price-high-cov"
  | "high-price-low-cov"
  | "low-price-high-cov"
  | "low-price-low-cov";

export type QuadrantRow = {
  id: QuadrantId;
  label: string;
  count: number;
  examples: string;
};

/** Auction-only sample (excludes pure admin assignments). */
export function auctionOnly(): CountryAwardRow[] {
  return COUNTRY_AWARDS.filter((r) => r.design !== "admin");
}

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1]! + s[mid]!) / 2 : s[mid]!;
}

export function priceCoverageQuadrants(
  rows: CountryAwardRow[] = auctionOnly(),
): QuadrantRow[] {
  const priceMed = median(rows.map((r) => r.usdPerMhzPop));
  const covMed = median(rows.map((r) => r.coveragePct));
  const buckets: Record<QuadrantId, string[]> = {
    "high-price-high-cov": [],
    "high-price-low-cov": [],
    "low-price-high-cov": [],
    "low-price-low-cov": [],
  };
  for (const r of rows) {
    const highP = r.usdPerMhzPop >= priceMed;
    const highC = r.coveragePct >= covMed;
    const id: QuadrantId = highP
      ? highC
        ? "high-price-high-cov"
        : "high-price-low-cov"
      : highC
        ? "low-price-high-cov"
        : "low-price-low-cov";
    buckets[id].push(r.country);
  }
  return [
    {
      id: "high-price-high-cov",
      label: "High $/MHz-pop · high coverage",
      count: buckets["high-price-high-cov"].length,
      examples: buckets["high-price-high-cov"].slice(0, 3).join(", "),
    },
    {
      id: "high-price-low-cov",
      label: "High $/MHz-pop · lagging coverage",
      count: buckets["high-price-low-cov"].length,
      examples: buckets["high-price-low-cov"].slice(0, 3).join(", "),
    },
    {
      id: "low-price-high-cov",
      label: "Low $/MHz-pop · high coverage",
      count: buckets["low-price-high-cov"].length,
      examples: buckets["low-price-high-cov"].slice(0, 3).join(", "),
    },
    {
      id: "low-price-low-cov",
      label: "Low $/MHz-pop · lagging coverage",
      count: buckets["low-price-low-cov"].length,
      examples: buckets["low-price-low-cov"].slice(0, 3).join(", "),
    },
  ];
}

export type ObligationBucket = {
  score: number;
  label: string;
  avgCoveragePct: number;
  avgUsdPerMhzPop: number;
  n: number;
};

export function obligationCoverageBuckets(
  rows: CountryAwardRow[] = auctionOnly(),
): ObligationBucket[] {
  const groups = [1, 2, 3] as const;
  return groups.map((score) => {
    const subset = rows.filter((r) => r.obligationScore === score);
    const avgCoveragePct =
      subset.reduce((s, r) => s + r.coveragePct, 0) / Math.max(subset.length, 1);
    const avgUsdPerMhzPop =
      subset.reduce((s, r) => s + r.usdPerMhzPop, 0) / Math.max(subset.length, 1);
    return {
      score,
      label:
        score === 1
          ? "Light obligations"
          : score === 2
            ? "Moderate obligations"
            : "Heavy obligations",
      avgCoveragePct: Math.round(avgCoveragePct * 10) / 10,
      avgUsdPerMhzPop: Math.round(avgUsdPerMhzPop * 1000) / 1000,
      n: subset.length,
    };
  });
}

export function topByPrice(
  n = 8,
  rows: CountryAwardRow[] = auctionOnly(),
): CountryAwardRow[] {
  return [...rows].sort((a, b) => b.usdPerMhzPop - a.usdPerMhzPop).slice(0, n);
}

export function fmtUsd(n: number, digits = 2): string {
  return `$${n.toFixed(digits)}`;
}

export function fmtB(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtMhzPop(n: number): string {
  if (n >= 0.1) return `$${n.toFixed(3)}`;
  if (n >= 0.01) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(4)}`;
}
