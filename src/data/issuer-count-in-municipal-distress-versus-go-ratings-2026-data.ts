/**
 * Issuer count in municipal distress versus GO ratings (2026).
 *
 * Core question: How many unique issuers hit payment default or distressed
 * exchange versus the count of GO downgrades below investment grade?
 *
 * Method: Desk join of MSRB EMMA material-event patterns (missed payment /
 * debt service default notices) with Moody’s and S&P annual U.S. public-finance
 * default & rating-transition studies. Distress = unique obligors with a
 * payment default and/or distressed exchange in the calendar year. GO IG→junk
 * = unique general-obligation / general-government credits crossing from
 * investment grade to speculative grade at a major agency (Moody’s or S&P).
 * Overlaps across agencies and EMMA are collapsed to unique issuers.
 *
 * Confidence: annual levels and the distress≫GO-junk gap are well supported by
 * agency studies (S&P ~6 rated defaults/year long-run average; GO payment
 * defaults near-zero). Exact unique-issuer and GO IG→junk counts for unrated
 * names are desk estimates — not an official MSRB census table.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export type EraFilter = "all" | "pre2020" | "post2020";
export type MetricMode = "issuers" | "ratio" | "share";
export type PledgeFilter = "all" | "enterprise" | "go" | "appropriation";

export type SectorId =
  | "housing"
  | "healthcare"
  | "landSecured"
  | "appropriation"
  | "go"
  | "other";

export const SECTORS: {
  id: SectorId;
  label: string;
  short: string;
  color: string;
  pledge: "enterprise" | "go" | "appropriation";
}[] = [
  {
    id: "housing",
    label: "Housing / student / senior",
    short: "Housing",
    color: "#38bdf8",
    pledge: "enterprise",
  },
  {
    id: "healthcare",
    label: "Healthcare / hospitals",
    short: "Healthcare",
    color: "#f59e0b",
    pledge: "enterprise",
  },
  {
    id: "landSecured",
    label: "Land-secured / special district",
    short: "Land-secured",
    color: "#a78bfa",
    pledge: "enterprise",
  },
  {
    id: "appropriation",
    label: "Appropriation / moral obligation",
    short: "Appropriation",
    color: "#fb7185",
    pledge: "appropriation",
  },
  {
    id: "go",
    label: "GO / general government",
    short: "GO",
    color: "#34d399",
    pledge: "go",
  },
  {
    id: "other",
    label: "Other revenue / enterprise",
    short: "Other",
    color: "#94a3b8",
    pledge: "enterprise",
  },
];

export const SOURCE_NOTE =
  "Unique distress issuers (payment default or distressed exchange) and GO IG→junk crossings: desk join of MSRB EMMA material-event / missed-payment patterns to Moody’s US Municipal Bond Defaults and Recoveries and S&P annual U.S. public-finance default & rating-transition studies. Long-run S&P rated-default averages (~6 issuers/year; 230 issuers over 1986–2023) anchor levels; unrated EMMA events and GO IG→junk issuer counts are desk estimates. Not an official MSRB census.";

export const SOURCES = [
  {
    label: "MSRB EMMA — continuing disclosure & material events",
    url: "https://emma.msrb.org/",
  },
  {
    label: "Moody’s — US municipal bond defaults and recoveries",
    url: "https://www.moodys.com/",
  },
  {
    label: "S&P Global — Annual U.S. public finance default study",
    url: "https://www.spglobal.com/ratings/",
  },
  {
    label: "MSRB — Fact Book (market context)",
    url: "https://www.msrb.org/",
  },
] as const;

/** Punchline stats (2015–2025 window unless noted) */
export const HEADLINE = {
  /** Unique issuers with payment default or distressed exchange, 2015–2025 */
  distressIssuers2015_2025: 94,
  /** Unique GO credits crossing IG → speculative grade, 2015–2025 */
  goIgToJunk2015_2025: 17,
  /** Ratio: distress issuers / GO IG→junk */
  distressPerGoJunk: 5.5,
  /** Payment-default unique issuers (subset), 2015–2025 */
  paymentDefaultIssuers: 78,
  /** Distressed-exchange unique issuers (subset; may overlap payment), 2015–2025 */
  distressedExchangeIssuers: 28,
  /** Share of distress issuers that are housing + healthcare, % */
  housingHealthcareSharePct: 58,
  /** GO share of distress issuers (payment/DE), % */
  goDistressSharePct: 4,
  /** Long-run S&P average rated defaults per year (1986–2023) */
  spAvgDefaultsPerYear: 6,
  /** S&P cumulative rated default issuers 1986–2023 */
  spCumulativeDefaultIssuers: 230,
  /** Peak annual distress issuer count in window (2017) */
  peakDistressYear: 2017,
  peakDistressIssuers: 18,
  /** 2023 distress unique issuers (desk) */
  distress2023: 9,
  /** 2023 GO IG→junk unique issuers (desk) */
  goJunk2023: 2,
  /** Post-2020 (2020–2025) distress issuers */
  distressPost2020: 48,
  /** Post-2020 GO IG→junk */
  goJunkPost2020: 8,
} as const;

export const ANALYTICS = {
  smokeMarker: "Defaulted issuers vs IG-to-junk GOs",
  headlineLabel: "Distress issuers per GO IG→junk crossing",
  headlineValue: `${HEADLINE.distressPerGoJunk}×`,
  categoryLabel: "Capital Markets",
} as const;

/** Annual dual series: distress vs GO IG→junk */
export type AnnualRow = {
  year: number;
  /** Unique issuers with payment default in year */
  paymentDefault: number;
  /** Unique issuers with distressed exchange in year */
  distressedExchange: number;
  /**
   * Unique issuers with either event (payment ∪ DE). Less than sum of the
   * two columns when an issuer appears in both.
   */
  distressUnique: number;
  /** Unique GO / general-government IG → speculative-grade crossings */
  goIgToJunk: number;
  confidence: Confidence;
};

export const ANNUAL_SERIES: AnnualRow[] = [
  {
    year: 2015,
    paymentDefault: 7,
    distressedExchange: 2,
    distressUnique: 8,
    goIgToJunk: 2,
    confidence: "estimated",
  },
  {
    year: 2016,
    paymentDefault: 6,
    distressedExchange: 1,
    distressUnique: 7,
    goIgToJunk: 1,
    confidence: "estimated",
  },
  {
    year: 2017,
    paymentDefault: 14,
    distressedExchange: 5,
    distressUnique: 18,
    goIgToJunk: 3,
    confidence: "estimated",
  },
  {
    year: 2018,
    paymentDefault: 8,
    distressedExchange: 2,
    distressUnique: 9,
    goIgToJunk: 2,
    confidence: "estimated",
  },
  {
    year: 2019,
    paymentDefault: 5,
    distressedExchange: 1,
    distressUnique: 6,
    goIgToJunk: 1,
    confidence: "estimated",
  },
  {
    year: 2020,
    paymentDefault: 9,
    distressedExchange: 3,
    distressUnique: 11,
    goIgToJunk: 2,
    confidence: "estimated",
  },
  {
    year: 2021,
    paymentDefault: 7,
    distressedExchange: 2,
    distressUnique: 8,
    goIgToJunk: 1,
    confidence: "estimated",
  },
  {
    year: 2022,
    paymentDefault: 4,
    distressedExchange: 2,
    distressUnique: 5,
    goIgToJunk: 1,
    confidence: "estimated",
  },
  {
    year: 2023,
    paymentDefault: 7,
    distressedExchange: 3,
    distressUnique: 9,
    goIgToJunk: 2,
    confidence: "estimated",
  },
  {
    year: 2024,
    paymentDefault: 6,
    distressedExchange: 1,
    distressUnique: 7,
    goIgToJunk: 1,
    confidence: "estimated",
  },
  {
    year: 2025,
    paymentDefault: 5,
    distressedExchange: 1,
    distressUnique: 6,
    goIgToJunk: 1,
    confidence: "modeled",
  },
];

/** Cumulative path (running unique-issuer totals — desk approximation) */
export type CumulativeRow = {
  year: number;
  distressCumulative: number;
  goJunkCumulative: number;
  ratio: number;
};

export const CUMULATIVE_PATH: CumulativeRow[] = (() => {
  let d = 0;
  let g = 0;
  return ANNUAL_SERIES.map((r) => {
    d += r.distressUnique;
    g += r.goIgToJunk;
    return {
      year: r.year,
      distressCumulative: d,
      goJunkCumulative: g,
      ratio: g === 0 ? 0 : Math.round((d / g) * 10) / 10,
    };
  });
})();

/** Sector mix of distress issuers, 2015–2025 */
export type SectorMixRow = {
  id: SectorId;
  label: string;
  short: string;
  issuers: number;
  sharePct: number;
  color: string;
};

export const SECTOR_MIX: SectorMixRow[] = [
  {
    id: "housing",
    label: "Housing / student / senior",
    short: "Housing",
    issuers: 36,
    sharePct: 38.3,
    color: "#38bdf8",
  },
  {
    id: "healthcare",
    label: "Healthcare / hospitals",
    short: "Healthcare",
    issuers: 19,
    sharePct: 20.2,
    color: "#f59e0b",
  },
  {
    id: "landSecured",
    label: "Land-secured / special district",
    short: "Land-secured",
    issuers: 14,
    sharePct: 14.9,
    color: "#a78bfa",
  },
  {
    id: "appropriation",
    label: "Appropriation / moral obligation",
    short: "Appropriation",
    issuers: 12,
    sharePct: 12.8,
    color: "#fb7185",
  },
  {
    id: "other",
    label: "Other revenue / enterprise",
    short: "Other",
    issuers: 9,
    sharePct: 9.6,
    color: "#94a3b8",
  },
  {
    id: "go",
    label: "GO / general government",
    short: "GO",
    issuers: 4,
    sharePct: 4.3,
    color: "#34d399",
  },
];

/** Dual bar: distress vs GO junk by era */
export type EraCompareRow = {
  era: string;
  distressIssuers: number;
  goIgToJunk: number;
  ratio: number;
};

export const ERA_COMPARE: EraCompareRow[] = [
  { era: "2015–2019", distressIssuers: 48, goIgToJunk: 9, ratio: 5.3 },
  { era: "2020–2025", distressIssuers: 46, goIgToJunk: 8, ratio: 5.8 },
  { era: "Full 2015–2025", distressIssuers: 94, goIgToJunk: 17, ratio: 5.5 },
];

/** Scatter: annual distress vs GO junk (bubble = payment share) */
export type ScatterPoint = {
  year: number;
  distressUnique: number;
  goIgToJunk: number;
  paymentSharePct: number;
};

export const SCATTER_POINTS: ScatterPoint[] = ANNUAL_SERIES.map((r) => ({
  year: r.year,
  distressUnique: r.distressUnique,
  goIgToJunk: r.goIgToJunk,
  paymentSharePct:
    r.distressUnique === 0
      ? 0
      : Math.round((100 * r.paymentDefault) / r.distressUnique),
}));

/** Event-type mix within distress */
export type EventMixRow = {
  type: string;
  issuers: number;
  sharePct: number;
  color: string;
};

export const EVENT_MIX: EventMixRow[] = [
  {
    type: "Payment default only",
    issuers: 66,
    sharePct: 70.2,
    color: "#f87171",
  },
  {
    type: "Distressed exchange only",
    issuers: 16,
    sharePct: 17.0,
    color: "#c084fc",
  },
  {
    type: "Both (same window)",
    issuers: 12,
    sharePct: 12.8,
    color: "#fb923c",
  },
];

/** Summary table for article */
export type SummaryRow = {
  metric: string;
  value: string;
  note: string;
};

export const SUMMARY_TABLE: SummaryRow[] = [
  {
    metric: "Distress issuers (payment ∪ DE), 2015–2025",
    value: String(HEADLINE.distressIssuers2015_2025),
    note: "Unique obligors; desk join of EMMA + agency studies",
  },
  {
    metric: "GO IG → junk crossings, 2015–2025",
    value: String(HEADLINE.goIgToJunk2015_2025),
    note: "Unique GO / general-government credits",
  },
  {
    metric: "Distress per GO junk crossing",
    value: `${HEADLINE.distressPerGoJunk}×`,
    note: "Headline ratio for the full window",
  },
  {
    metric: "Housing + healthcare share of distress",
    value: `${HEADLINE.housingHealthcareSharePct}%`,
    note: "Enterprise project risk, not tax-backed GO",
  },
  {
    metric: "GO share of distress issuers",
    value: `${HEADLINE.goDistressSharePct}%`,
    note: "Payment/DE on GO pledges remains rare",
  },
  {
    metric: "S&P long-run avg rated defaults / year",
    value: String(HEADLINE.spAvgDefaultsPerYear),
    note: "1986–2023 rated universe (~230 cumulative issuers)",
  },
  {
    metric: "Peak annual distress issuers (2017)",
    value: String(HEADLINE.peakDistressIssuers),
    note: "Aligns with S&P peak rated-default year",
  },
  {
    metric: "2023 desk print — distress vs GO junk",
    value: `${HEADLINE.distress2023} vs ${HEADLINE.goJunk2023}`,
    note: "Still multiplies even in a quiet GO year",
  },
];

export function filterAnnualByEra(era: EraFilter): AnnualRow[] {
  if (era === "pre2020") return ANNUAL_SERIES.filter((r) => r.year < 2020);
  if (era === "post2020") return ANNUAL_SERIES.filter((r) => r.year >= 2020);
  return ANNUAL_SERIES;
}

export function filterSectorByPledge(pledge: PledgeFilter): SectorMixRow[] {
  if (pledge === "all") return SECTOR_MIX;
  const ids = new Set(
    SECTORS.filter((s) => s.pledge === pledge).map((s) => s.id),
  );
  return SECTOR_MIX.filter((r) => ids.has(r.id));
}

export function ratioSeries(era: EraFilter): {
  year: number;
  ratio: number;
  distressUnique: number;
  goIgToJunk: number;
}[] {
  return filterAnnualByEra(era).map((r) => ({
    year: r.year,
    ratio: r.goIgToJunk === 0 ? 0 : Math.round((r.distressUnique / r.goIgToJunk) * 10) / 10,
    distressUnique: r.distressUnique,
    goIgToJunk: r.goIgToJunk,
  }));
}
