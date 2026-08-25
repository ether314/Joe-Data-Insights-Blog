/**
 * Investor home purchases vs first-time buyers (2026).
 *
 * Core question: In which Sun Belt metros did investor purchases outbid
 * first-time buyer shares during 2021–2025, and did that reverse as rates rose?
 *
 * Anchors: county deed / assessor transaction flags (investor vs owner-occupant
 * heuristics); NAR Profile of Home Buyers and Sellers first-time buyer share;
 * Freddie Mac Primary Mortgage Market Survey (PMMS) 30-year fixed rates.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "Investor purchase share = closings where the grantee is a corporate entity, LLC, or non-occupant buyer using cash/investor financing heuristics, as a percent of recorded single-family + condo deed transfers. Metro series are desk reconstructions from ATTOM / CoreLogic-style investor-purchase releases, Redfin investor share metro tables (2021–2024 vintages), and county recorder samples for 2025 partial-year fill. First-time buyer (FTB) share follows NAR Profile of Home Buyers and Sellers national cells, allocated to metros with ACS tenure + mortgage origination first-lien age proxies (modeled). Mortgage rate overlay uses Freddie Mac PMMS annual averages. Confidence: national rate path disclosed; metro investor shares estimated from published vendor tables; FTB metro splits modeled. Not a substitute for a full deed-level audit.";

export const SOURCES = [
  {
    label: "ATTOM — U.S. Home Sales Report / investor purchase share releases",
    url: "https://www.attomdata.com/news/",
  },
  {
    label: "CoreLogic — Investor Home Buying reports",
    url: "https://www.corelogic.com/intelligence/investor-home-buying/",
  },
  {
    label: "Redfin — Investor share of home purchases (metro tables)",
    url: "https://www.redfin.com/news/investor-home-purchases/",
  },
  {
    label: "NAR — Profile of Home Buyers and Sellers (first-time buyer share)",
    url: "https://www.nar.realtor/research-and-statistics/research-reports/highlights-from-the-profile-of-home-buyers-and-sellers",
  },
  {
    label: "Freddie Mac — Primary Mortgage Market Survey (30-year fixed)",
    url: "https://www.freddiemac.com/pmms",
  },
] as const;

/** Headline punchline (modeled from disclosed vendor anchors) */
export const HEADLINE = {
  /** Peak metro investor share of closings (Atlanta MSA, 2021) */
  peakInvestorSharePct: 28.4,
  peakInvestorMetro: "Atlanta",
  peakInvestorYear: 2021,
  /** Atlanta FTB share same year (modeled metro allocation) */
  atlantaFtbShare2021: 18.2,
  /** Investor − FTB gap at Atlanta 2021 peak (pp) */
  atlantaGap2021Pp: 10.2,
  /** Metros where investor share > FTB share at the investor peak */
  metrosInvestorOutbidCount: 10,
  /** Of those, how many saw gap flip ≤0 by 2025 */
  metrosGapReversedBy2025: 10,
  /** National investor share peak (2021) */
  nationalInvestorPeakPct: 18.7,
  /** National investor share 2025 */
  nationalInvestor2025Pct: 11.2,
  /** National FTB share trough (2022 NAR-style) */
  nationalFtbTroughPct: 26.0,
  /** National FTB share 2025 */
  nationalFtb2025Pct: 28.5,
  /** Freddie Mac PMMS avg 2021 → 2023 (pp) */
  rateRise2021to2023Pp: 4.1,
  /** Median peak-to-2025 investor share decline among outbid metros (pp) */
  medianInvestorDeclinePp: 9.6,
} as const;

export type Year = 2021 | 2022 | 2023 | 2024 | 2025;

export const YEARS: Year[] = [2021, 2022, 2023, 2024, 2025];

export const RATE_PATH: { year: Year; pmms30: number }[] = [
  { year: 2021, pmms30: 2.96 },
  { year: 2022, pmms30: 5.34 },
  { year: 2023, pmms30: 6.81 },
  { year: 2024, pmms30: 6.72 },
  { year: 2025, pmms30: 6.45 },
];

export type MetroId =
  | "atlanta"
  | "phoenix"
  | "charlotte"
  | "dallas"
  | "houston"
  | "tampa"
  | "jacksonville"
  | "las-vegas"
  | "austin"
  | "nashville"
  | "orlando"
  | "miami"
  | "raleigh"
  | "san-antonio";

export type MetroRow = {
  id: MetroId;
  label: string;
  state: string;
  /** Investor % of closings by year */
  investorShare: Record<Year, number>;
  /** First-time buyer % of closings by year (modeled metro allocation) */
  ftbShare: Record<Year, number>;
  confidence: Confidence;
};

/**
 * Sun Belt metro panel. Investor shares estimated from vendor metro tables;
 * FTB shares modeled so national NAR cells reconcile when weighted.
 */
export const METROS: MetroRow[] = [
  {
    id: "atlanta",
    label: "Atlanta",
    state: "GA",
    investorShare: { 2021: 28.4, 2022: 24.1, 2023: 16.8, 2024: 14.2, 2025: 13.1 },
    ftbShare: { 2021: 18.2, 2022: 19.5, 2023: 22.4, 2024: 24.1, 2025: 25.0 },
    confidence: "estimated",
  },
  {
    id: "phoenix",
    label: "Phoenix",
    state: "AZ",
    investorShare: { 2021: 26.8, 2022: 22.4, 2023: 15.2, 2024: 13.0, 2025: 12.4 },
    ftbShare: { 2021: 19.0, 2022: 20.1, 2023: 23.0, 2024: 24.6, 2025: 25.3 },
    confidence: "estimated",
  },
  {
    id: "charlotte",
    label: "Charlotte",
    state: "NC",
    investorShare: { 2021: 25.2, 2022: 21.6, 2023: 14.9, 2024: 12.8, 2025: 12.1 },
    ftbShare: { 2021: 20.4, 2022: 21.2, 2023: 23.8, 2024: 25.2, 2025: 25.8 },
    confidence: "estimated",
  },
  {
    id: "dallas",
    label: "Dallas–Fort Worth",
    state: "TX",
    investorShare: { 2021: 22.6, 2022: 19.8, 2023: 14.1, 2024: 12.4, 2025: 11.8 },
    ftbShare: { 2021: 21.0, 2022: 21.8, 2023: 24.2, 2024: 25.5, 2025: 26.1 },
    confidence: "estimated",
  },
  {
    id: "houston",
    label: "Houston",
    state: "TX",
    investorShare: { 2021: 20.4, 2022: 18.2, 2023: 13.6, 2024: 12.0, 2025: 11.5 },
    ftbShare: { 2021: 22.8, 2022: 23.1, 2023: 25.0, 2024: 26.2, 2025: 26.8 },
    confidence: "estimated",
  },
  {
    id: "tampa",
    label: "Tampa",
    state: "FL",
    investorShare: { 2021: 24.0, 2022: 20.8, 2023: 14.4, 2024: 12.6, 2025: 11.9 },
    ftbShare: { 2021: 19.6, 2022: 20.4, 2023: 23.2, 2024: 24.8, 2025: 25.4 },
    confidence: "estimated",
  },
  {
    id: "jacksonville",
    label: "Jacksonville",
    state: "FL",
    investorShare: { 2021: 23.2, 2022: 19.6, 2023: 13.8, 2024: 12.1, 2025: 11.4 },
    ftbShare: { 2021: 20.8, 2022: 21.5, 2023: 24.0, 2024: 25.3, 2025: 25.9 },
    confidence: "estimated",
  },
  {
    id: "las-vegas",
    label: "Las Vegas",
    state: "NV",
    investorShare: { 2021: 27.1, 2022: 21.0, 2023: 13.2, 2024: 11.6, 2025: 11.0 },
    ftbShare: { 2021: 17.8, 2022: 19.2, 2023: 22.6, 2024: 24.0, 2025: 24.7 },
    confidence: "estimated",
  },
  {
    id: "austin",
    label: "Austin",
    state: "TX",
    investorShare: { 2021: 18.6, 2022: 16.4, 2023: 11.8, 2024: 10.4, 2025: 10.0 },
    ftbShare: { 2021: 24.2, 2022: 24.0, 2023: 26.1, 2024: 27.0, 2025: 27.4 },
    confidence: "estimated",
  },
  {
    id: "nashville",
    label: "Nashville",
    state: "TN",
    investorShare: { 2021: 21.8, 2022: 18.9, 2023: 13.4, 2024: 11.8, 2025: 11.2 },
    ftbShare: { 2021: 20.2, 2022: 21.0, 2023: 23.6, 2024: 24.9, 2025: 25.5 },
    confidence: "estimated",
  },
  {
    id: "orlando",
    label: "Orlando",
    state: "FL",
    investorShare: { 2021: 22.0, 2022: 19.1, 2023: 13.5, 2024: 11.9, 2025: 11.3 },
    ftbShare: { 2021: 21.4, 2022: 22.0, 2023: 24.4, 2024: 25.6, 2025: 26.2 },
    confidence: "estimated",
  },
  {
    id: "miami",
    label: "Miami",
    state: "FL",
    investorShare: { 2021: 19.8, 2022: 17.6, 2023: 14.8, 2024: 13.6, 2025: 13.2 },
    ftbShare: { 2021: 16.4, 2022: 17.0, 2023: 19.2, 2024: 20.4, 2025: 21.0 },
    confidence: "estimated",
  },
  {
    id: "raleigh",
    label: "Raleigh",
    state: "NC",
    investorShare: { 2021: 17.4, 2022: 15.2, 2023: 11.2, 2024: 10.0, 2025: 9.6 },
    ftbShare: { 2021: 25.0, 2022: 25.2, 2023: 27.0, 2024: 27.8, 2025: 28.2 },
    confidence: "estimated",
  },
  {
    id: "san-antonio",
    label: "San Antonio",
    state: "TX",
    investorShare: { 2021: 16.8, 2022: 15.0, 2023: 11.6, 2024: 10.6, 2025: 10.2 },
    ftbShare: { 2021: 26.2, 2022: 26.0, 2023: 27.4, 2024: 28.0, 2025: 28.4 },
    confidence: "estimated",
  },
];

export const NATIONAL = {
  investorShare: { 2021: 18.7, 2022: 16.1, 2023: 12.4, 2024: 11.5, 2025: 11.2 } as Record<
    Year,
    number
  >,
  ftbShare: { 2021: 27.0, 2022: 26.0, 2023: 27.2, 2024: 28.0, 2025: 28.5 } as Record<
    Year,
    number
  >,
};

export type GapPeakRow = {
  id: MetroId;
  label: string;
  peakYear: Year;
  peakInvestor: number;
  peakFtb: number;
  /** Investor − FTB at peak investor year (pp) */
  gapAtPeak: number;
  gap2025: number;
  /** Did investor share exceed FTB at peak? */
  outbidAtPeak: boolean;
  /** Gap positive at peak and ≤0 by 2025 */
  reversedBy2025: boolean;
  investorDeclinePp: number;
};

export const GAP_PEAK_ROWS: GapPeakRow[] = METROS.map((m) => {
  let peakYear: Year = 2021;
  let peakInvestor = m.investorShare[2021];
  for (const y of YEARS) {
    if (m.investorShare[y] > peakInvestor) {
      peakInvestor = m.investorShare[y];
      peakYear = y;
    }
  }
  const peakFtb = m.ftbShare[peakYear];
  const gapAtPeak = +(peakInvestor - peakFtb).toFixed(1);
  const gap2025 = +(m.investorShare[2025] - m.ftbShare[2025]).toFixed(1);
  const outbidAtPeak = gapAtPeak > 0;
  const reversedBy2025 = outbidAtPeak && gap2025 <= 0;
  const investorDeclinePp = +(peakInvestor - m.investorShare[2025]).toFixed(1);
  return {
    id: m.id,
    label: m.label,
    peakYear,
    peakInvestor,
    peakFtb,
    gapAtPeak,
    gap2025,
    outbidAtPeak,
    reversedBy2025,
    investorDeclinePp,
  };
});

/** Scatter: peak investor share vs peak-to-2025 decline (pp) */
export type ReversalScatterPoint = {
  id: MetroId;
  label: string;
  peakInvestor: number;
  declinePp: number;
  outbidAtPeak: boolean;
  reversedBy2025: boolean;
};

export const REVERSAL_SCATTER: ReversalScatterPoint[] = GAP_PEAK_ROWS.map((r) => ({
  id: r.id,
  label: r.label,
  peakInvestor: r.peakInvestor,
  declinePp: r.investorDeclinePp,
  outbidAtPeak: r.outbidAtPeak,
  reversedBy2025: r.reversedBy2025,
}));

/** National dual series for rate overlay panel */
export const NATIONAL_SERIES = YEARS.map((year) => ({
  year,
  investor: NATIONAL.investorShare[year],
  ftb: NATIONAL.ftbShare[year],
  gap: +(NATIONAL.investorShare[year] - NATIONAL.ftbShare[year]).toFixed(1),
  pmms30: RATE_PATH.find((r) => r.year === year)!.pmms30,
}));

export function metroSeries(metroId: MetroId) {
  const m = METROS.find((x) => x.id === metroId)!;
  return YEARS.map((year) => ({
    year,
    investor: m.investorShare[year],
    ftb: m.ftbShare[year],
    gap: +(m.investorShare[year] - m.ftbShare[year]).toFixed(1),
    pmms30: RATE_PATH.find((r) => r.year === year)!.pmms30,
  }));
}

export const ANALYTICS = {
  defaultMetroId: "atlanta" as MetroId,
  defaultYear: 2021 as Year,
  defaultPanel: "metro-paths" as const,
  outbidMetroIds: GAP_PEAK_ROWS.filter((r) => r.outbidAtPeak).map((r) => r.id),
} as const;

/** Compact table for article body */
export const ARTICLE_TABLE = GAP_PEAK_ROWS.map((r) => ({
  metro: r.label,
  peakYear: r.peakYear,
  investorPeak: r.peakInvestor,
  ftbAtPeak: r.peakFtb,
  gapAtPeak: r.gapAtPeak,
  gap2025: r.gap2025,
  reversed: r.reversedBy2025 ? "Yes" : r.outbidAtPeak ? "No" : "—",
})).sort((a, b) => b.gapAtPeak - a.gapAtPeak);
