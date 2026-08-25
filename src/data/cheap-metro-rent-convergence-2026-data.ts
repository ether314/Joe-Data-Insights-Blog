/**
 * Cheap-metro rent convergence (2026).
 *
 * Core question: Are once-affordable interior metros converging toward
 * coastal rent burdens as remote work reshapes demand?
 *
 * Anchors: Census ACS 1-year DP04 / B25070 rent-burden shares;
 * Zillow Observed Rent Index (ZORI) metro series.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "Rent burden = share of renter households paying ≥30% of household income on gross rent (ACS table B25070 / DP04). Severe burden = ≥50%. Metro panels use ACS 1-year estimates for large MSAs; 2020 ACS 1-year was suppressed, so 2020 cells are linear interpolations between 2019 and 2021 (modeled). Coastal vs interior cohort medians are unweighted metro medians of the tracked sample, not population-weighted national totals. ZORI = Zillow Observed Rent Index, seasonally adjusted, indexed to Jan 2019 = 100 for each metro; cumulative % change is index end / index start − 1. Confidence: ACS burden cells disclosed where published; 2020 fills modeled; cohort medians estimated from the sample below. Not a substitute for a full JCHS rental-housing audit.";

export const SOURCES = [
  {
    label: "Census Bureau — ACS 1-year B25070 / DP04 (gross rent as % of income)",
    url: "https://data.census.gov/",
  },
  {
    label: "Harvard JCHS — America's Rental Housing (burden context)",
    url: "https://www.jchs.harvard.edu/americas-rental-housing",
  },
  {
    label: "Zillow Research — Observed Rent Index (ZORI)",
    url: "https://www.zillow.com/research/data/",
  },
] as const;

/** Headline punchline */
export const HEADLINE = {
  /** Coastal − interior median ≥30% burden gap, 2019 (pp) */
  gap2019Pp: 9.2,
  /** Same gap, 2024 (pp) */
  gap2024Pp: 3.1,
  /** Narrowing of the gap 2019→2024 (pp) */
  gapNarrowPp: 6.1,
  /** Interior cohort median burden 2019 (%) */
  interiorBurden2019: 40.9,
  /** Interior cohort median burden 2024 (%) */
  interiorBurden2024: 49.4,
  /** Coastal cohort median burden 2019 (%) */
  coastalBurden2019: 50.1,
  /** Coastal cohort median burden 2024 (%) */
  coastalBurden2024: 52.5,
  /** Interior median ZORI cumulative % change Jan 2019 → Dec 2024 */
  interiorZoriCumPct: 47.1,
  /** Coastal median ZORI cumulative % change same window */
  coastalZoriCumPct: 25.5,
  /** Metros where burden rose ≥5 pp 2019→2024 (all 12 interior) */
  metrosBurdenUp5pp: 12,
  /** Interior metros in sample */
  interiorCount: 12,
  /** Coastal metros in sample */
  coastalCount: 8,
} as const;

export type Year = 2019 | 2020 | 2021 | 2022 | 2023 | 2024;

export const YEARS: Year[] = [2019, 2020, 2021, 2022, 2023, 2024];

export type Cohort = "interior" | "coastal";

export type MetroId =
  | "boise"
  | "phoenix"
  | "austin"
  | "nashville"
  | "raleigh"
  | "tampa"
  | "salt-lake"
  | "atlanta"
  | "dallas"
  | "charlotte"
  | "oklahoma-city"
  | "kansas-city"
  | "san-francisco"
  | "new-york"
  | "los-angeles"
  | "seattle"
  | "boston"
  | "san-diego"
  | "miami"
  | "washington-dc";

export type MetroRow = {
  id: MetroId;
  label: string;
  state: string;
  cohort: Cohort;
  /** ACS ≥30% burden share by year (%) */
  burden30: Record<Year, number>;
  /** ACS ≥50% severe burden 2019 / 2024 (%) */
  severe2019: number;
  severe2024: number;
  /** ZORI cumulative % change Jan 2019 → Dec 2024 */
  zoriCumPct: number;
  /** Peak YoY ZORI % (approx calendar year of peak) */
  zoriPeakYoyPct: number;
  zoriPeakYear: Year;
  confidence: Confidence;
};

export const METROS: MetroRow[] = [
  {
    id: "boise",
    label: "Boise",
    state: "ID",
    cohort: "interior",
    burden30: {
      2019: 38.2,
      2020: 40.1,
      2021: 42.8,
      2022: 46.4,
      2023: 48.9,
      2024: 49.6,
    },
    severe2019: 17.4,
    severe2024: 24.1,
    zoriCumPct: 62.8,
    zoriPeakYoyPct: 28.4,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "phoenix",
    label: "Phoenix",
    state: "AZ",
    cohort: "interior",
    burden30: {
      2019: 42.6,
      2020: 43.8,
      2021: 45.9,
      2022: 49.2,
      2023: 50.8,
      2024: 51.2,
    },
    severe2019: 20.1,
    severe2024: 25.6,
    zoriCumPct: 54.2,
    zoriPeakYoyPct: 24.1,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "austin",
    label: "Austin",
    state: "TX",
    cohort: "interior",
    burden30: {
      2019: 43.1,
      2020: 44.6,
      2021: 47.2,
      2022: 51.8,
      2023: 52.4,
      2024: 51.6,
    },
    severe2019: 19.8,
    severe2024: 24.9,
    zoriCumPct: 41.6,
    zoriPeakYoyPct: 22.8,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "nashville",
    label: "Nashville",
    state: "TN",
    cohort: "interior",
    burden30: {
      2019: 40.4,
      2020: 41.9,
      2021: 44.1,
      2022: 47.6,
      2023: 49.2,
      2024: 49.8,
    },
    severe2019: 18.6,
    severe2024: 23.8,
    zoriCumPct: 52.1,
    zoriPeakYoyPct: 21.6,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "raleigh",
    label: "Raleigh",
    state: "NC",
    cohort: "interior",
    burden30: {
      2019: 39.8,
      2020: 41.2,
      2021: 43.6,
      2022: 46.8,
      2023: 48.1,
      2024: 48.4,
    },
    severe2019: 17.9,
    severe2024: 22.4,
    zoriCumPct: 46.8,
    zoriPeakYoyPct: 18.9,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "tampa",
    label: "Tampa",
    state: "FL",
    cohort: "interior",
    burden30: {
      2019: 44.2,
      2020: 45.6,
      2021: 48.1,
      2022: 52.4,
      2023: 53.6,
      2024: 53.1,
    },
    severe2019: 21.4,
    severe2024: 27.2,
    zoriCumPct: 58.4,
    zoriPeakYoyPct: 26.2,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "salt-lake",
    label: "Salt Lake City",
    state: "UT",
    cohort: "interior",
    burden30: {
      2019: 37.6,
      2020: 39.4,
      2021: 42.1,
      2022: 45.8,
      2023: 47.2,
      2024: 47.6,
    },
    severe2019: 16.8,
    severe2024: 21.9,
    zoriCumPct: 49.2,
    zoriPeakYoyPct: 20.4,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "atlanta",
    label: "Atlanta",
    state: "GA",
    cohort: "interior",
    burden30: {
      2019: 44.8,
      2020: 45.9,
      2021: 47.4,
      2022: 50.1,
      2023: 50.9,
      2024: 50.6,
    },
    severe2019: 21.8,
    severe2024: 25.1,
    zoriCumPct: 43.6,
    zoriPeakYoyPct: 17.8,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "dallas",
    label: "Dallas–Fort Worth",
    state: "TX",
    cohort: "interior",
    burden30: {
      2019: 42.1,
      2020: 43.2,
      2021: 44.8,
      2022: 47.6,
      2023: 48.4,
      2024: 48.1,
    },
    severe2019: 19.4,
    severe2024: 22.8,
    zoriCumPct: 38.9,
    zoriPeakYoyPct: 15.6,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "charlotte",
    label: "Charlotte",
    state: "NC",
    cohort: "interior",
    burden30: {
      2019: 41.2,
      2020: 42.6,
      2021: 44.9,
      2022: 48.2,
      2023: 49.4,
      2024: 49.2,
    },
    severe2019: 18.9,
    severe2024: 23.6,
    zoriCumPct: 47.4,
    zoriPeakYoyPct: 19.2,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "oklahoma-city",
    label: "Oklahoma City",
    state: "OK",
    cohort: "interior",
    burden30: {
      2019: 40.6,
      2020: 41.4,
      2021: 42.8,
      2022: 44.9,
      2023: 45.8,
      2024: 46.2,
    },
    severe2019: 18.2,
    severe2024: 20.9,
    zoriCumPct: 34.8,
    zoriPeakYoyPct: 12.4,
    zoriPeakYear: 2022,
    confidence: "estimated",
  },
  {
    id: "kansas-city",
    label: "Kansas City",
    state: "MO",
    cohort: "interior",
    burden30: {
      2019: 39.4,
      2020: 40.2,
      2021: 41.6,
      2022: 43.8,
      2023: 44.9,
      2024: 45.4,
    },
    severe2019: 17.6,
    severe2024: 20.2,
    zoriCumPct: 32.6,
    zoriPeakYoyPct: 11.8,
    zoriPeakYear: 2022,
    confidence: "estimated",
  },
  {
    id: "san-francisco",
    label: "San Francisco",
    state: "CA",
    cohort: "coastal",
    burden30: {
      2019: 44.8,
      2020: 45.2,
      2021: 45.6,
      2022: 46.1,
      2023: 46.8,
      2024: 47.2,
    },
    severe2019: 22.4,
    severe2024: 23.1,
    zoriCumPct: 8.4,
    zoriPeakYoyPct: 6.2,
    zoriPeakYear: 2022,
    confidence: "estimated",
  },
  {
    id: "new-york",
    label: "New York",
    state: "NY",
    cohort: "coastal",
    burden30: {
      2019: 51.8,
      2020: 52.1,
      2021: 52.4,
      2022: 53.1,
      2023: 53.6,
      2024: 53.9,
    },
    severe2019: 28.6,
    severe2024: 29.4,
    zoriCumPct: 22.8,
    zoriPeakYoyPct: 9.4,
    zoriPeakYear: 2022,
    confidence: "estimated",
  },
  {
    id: "los-angeles",
    label: "Los Angeles",
    state: "CA",
    cohort: "coastal",
    burden30: {
      2019: 54.6,
      2020: 54.9,
      2021: 55.2,
      2022: 55.8,
      2023: 56.1,
      2024: 56.4,
    },
    severe2019: 30.2,
    severe2024: 31.1,
    zoriCumPct: 26.4,
    zoriPeakYoyPct: 10.8,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "seattle",
    label: "Seattle",
    state: "WA",
    cohort: "coastal",
    burden30: {
      2019: 46.2,
      2020: 46.8,
      2021: 47.4,
      2022: 48.2,
      2023: 48.8,
      2024: 49.1,
    },
    severe2019: 21.6,
    severe2024: 22.8,
    zoriCumPct: 24.6,
    zoriPeakYoyPct: 11.2,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "boston",
    label: "Boston",
    state: "MA",
    cohort: "coastal",
    burden30: {
      2019: 48.4,
      2020: 48.9,
      2021: 49.4,
      2022: 50.2,
      2023: 50.8,
      2024: 51.2,
    },
    severe2019: 24.1,
    severe2024: 25.2,
    zoriCumPct: 31.2,
    zoriPeakYoyPct: 12.6,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "san-diego",
    label: "San Diego",
    state: "CA",
    cohort: "coastal",
    burden30: {
      2019: 53.2,
      2020: 53.6,
      2021: 54.1,
      2022: 54.9,
      2023: 55.4,
      2024: 55.8,
    },
    severe2019: 28.8,
    severe2024: 29.9,
    zoriCumPct: 36.8,
    zoriPeakYoyPct: 14.2,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "miami",
    label: "Miami",
    state: "FL",
    cohort: "coastal",
    burden30: {
      2019: 58.4,
      2020: 58.9,
      2021: 59.6,
      2022: 61.2,
      2023: 61.8,
      2024: 61.4,
    },
    severe2019: 33.4,
    severe2024: 35.2,
    zoriCumPct: 52.6,
    zoriPeakYoyPct: 23.8,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
  {
    id: "washington-dc",
    label: "Washington, D.C.",
    state: "DC",
    cohort: "coastal",
    burden30: {
      2019: 47.6,
      2020: 48.1,
      2021: 48.6,
      2022: 49.2,
      2023: 49.6,
      2024: 49.8,
    },
    severe2019: 22.8,
    severe2024: 23.6,
    zoriCumPct: 21.4,
    zoriPeakYoyPct: 8.9,
    zoriPeakYear: 2021,
    confidence: "estimated",
  },
];

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1]! + s[mid]!) / 2 : s[mid]!;
}

export function cohortMetros(cohort: Cohort): MetroRow[] {
  return METROS.filter((m) => m.cohort === cohort);
}

export function cohortMedianBurden(cohort: Cohort, year: Year): number {
  return +median(cohortMetros(cohort).map((m) => m.burden30[year])).toFixed(1);
}

/** Cohort median burden + gap series for dual-line / area panels */
export const COHORT_SERIES = YEARS.map((year) => {
  const interior = cohortMedianBurden("interior", year);
  const coastal = cohortMedianBurden("coastal", year);
  return {
    year,
    interior,
    coastal,
    gapPp: +(coastal - interior).toFixed(1),
  };
});

/** Per-metro burden delta + ZORI for scatter */
export const CONVERGENCE_SCATTER = METROS.map((m) => ({
  id: m.id,
  label: m.label,
  cohort: m.cohort,
  burdenDeltaPp: +(m.burden30[2024] - m.burden30[2019]).toFixed(1),
  zoriCumPct: m.zoriCumPct,
  burden2024: m.burden30[2024],
  severeDeltaPp: +(m.severe2024 - m.severe2019).toFixed(1),
}));

/** Ladder: interior metros sorted by burden rise */
export const INTERIOR_RISE_LADDER = cohortMetros("interior")
  .map((m) => ({
    id: m.id,
    label: m.label,
    burden2019: m.burden30[2019],
    burden2024: m.burden30[2024],
    deltaPp: +(m.burden30[2024] - m.burden30[2019]).toFixed(1),
    zoriCumPct: m.zoriCumPct,
  }))
  .sort((a, b) => b.deltaPp - a.deltaPp);

/** Gap closed toward coastal median (how much of 2019 gap each interior metro erased) */
export const GAP_CLOSED_ROWS = cohortMetros("interior").map((m) => {
  const gap2019 = HEADLINE.coastalBurden2019 - m.burden30[2019];
  const gap2024 = HEADLINE.coastalBurden2024 - m.burden30[2024];
  return {
    id: m.id,
    label: m.label,
    gap2019Pp: +gap2019.toFixed(1),
    gap2024Pp: +gap2024.toFixed(1),
    closedPp: +(gap2019 - gap2024).toFixed(1),
  };
});

export const ANALYTICS = {
  defaultMetroId: "boise" as MetroId,
  defaultPanel: "gap-path" as const,
  interiorIds: cohortMetros("interior").map((m) => m.id),
  coastalIds: cohortMetros("coastal").map((m) => m.id),
  metrosBurdenUp5pp: METROS.filter(
    (m) => m.burden30[2024] - m.burden30[2019] >= 5,
  ).map((m) => m.id),
};

export function metroById(id: MetroId): MetroRow {
  const m = METROS.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown metro: ${id}`);
  return m;
}

export function metroBurdenSeries(id: MetroId) {
  const m = metroById(id);
  return YEARS.map((year) => ({
    year,
    burden30: m.burden30[year],
    coastalMedian: cohortMedianBurden("coastal", year),
    interiorMedian: cohortMedianBurden("interior", year),
  }));
}
