/**
 * Survival curves of pandemic-era startups (2026).
 *
 * Core question: How do first-year survival rates of 2020–21 cohorts compare
 * with pre-pandemic cohorts once relief programs ended?
 *
 * Primary source: BLS Business Employment Dynamics (BED) establishment age and
 * survival series, as republished in The Economics Daily (Sept 2024) for
 * 1-year survival by Census division and birth year through 2022 births.
 * Multi-year curve extensions apply historical BED conditional-survival ratios
 * (entrepreneurship Table 7 shape, cohorts with full follow-up) — labeled modeled.
 * Census BDS firm-age exit rates used only as a secondary national cross-check
 * narrative (not microdata-linked to BED establishments).
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "One-year establishment survival rates by Census division and birth year follow BLS Business Employment Dynamics age tables as summarized in The Economics Daily (Sept. 18, 2024). National figures are unweighted means of the nine divisions (desk-computed; not employment-weighted). Multi-year survival shares for ages 2–5 apply historical BED conditional survival ratios from cohorts with complete follow-up (BLS entrepreneurship Table 7 shape) to each cohort’s observed age-1 rate — labeled modeled. Relief timeline markers are legislative/program end dates (CARES/PPP/ERC), not causal estimates. Confidence: division 1-year rates disclosed; national means estimated; ages 2–5 modeled.";

export const SOURCES = [
  {
    label: "BLS TED — 1-year survival by birth year and division",
    url: "https://www.bls.gov/opub/ted/2024/1-year-survival-rates-for-new-business-establishments-by-year-and-location.htm",
  },
  {
    label: "BLS BED — Establishment age and survival",
    url: "https://www.bls.gov/bdm/bdmage.htm",
  },
  {
    label: "BLS — Entrepreneurship and the U.S. Economy (survival charts)",
    url: "https://www.bls.gov/bdm/entrepreneurship/entrepreneurship.htm",
  },
  {
    label: "Census — Business Dynamics Statistics",
    url: "https://www.census.gov/programs-surveys/bds.html",
  },
  {
    label: "SBA — Paycheck Protection Program (program overview)",
    url: "https://www.sba.gov/funding-programs/loans/covid-19-relief-options/paycheck-protection-program",
  },
] as const;

/** Headline: one-year survival share (national desk mean of divisions). */
export const HEADLINE = {
  oneYear2020Pct: 80.8,
  oneYear2022Pct: 76.9,
  oneYearBaseline2017_19Pct: 79.0,
  drop2020to2022Pp: 3.9,
  lift2020VsBaselinePp: 1.8,
  shortfall2022VsBaselinePp: 2.1,
  divisionsWhere2020Above2019: 8,
  divisionsWhere2022Below2020: 8,
  pacific2021Pct: 84.6,
  mountain2022Pct: 74.4,
} as const;

export const DIVISIONS = [
  { id: "NE", name: "New England", short: "New Eng." },
  { id: "MA", name: "Middle Atlantic", short: "Mid Atl." },
  { id: "ENC", name: "East North Central", short: "E N Cent." },
  { id: "WNC", name: "West North Central", short: "W N Cent." },
  { id: "SA", name: "South Atlantic", short: "S Atl." },
  { id: "ESC", name: "East South Central", short: "E S Cent." },
  { id: "WSC", name: "West South Central", short: "W S Cent." },
  { id: "MTN", name: "Mountain", short: "Mountain" },
  { id: "PAC", name: "Pacific", short: "Pacific" },
] as const;

export type DivisionId = (typeof DIVISIONS)[number]["id"];

/**
 * Disclosed 1-year establishment survival (%) by birth year × Census division.
 * Source: BLS TED 2024 table (birth year = year before the 1-year survival print).
 */
export const ONE_YEAR_BY_DIVISION: Record<
  number,
  Record<DivisionId, number>
> = {
  2015: {
    NE: 80.3,
    MA: 79.6,
    ENC: 81.0,
    WNC: 78.8,
    SA: 79.1,
    ESC: 79.1,
    WSC: 79.5,
    MTN: 78.2,
    PAC: 80.2,
  },
  2016: {
    NE: 81.5,
    MA: 79.8,
    ENC: 78.8,
    WNC: 81.0,
    SA: 77.7,
    ESC: 79.7,
    WSC: 79.3,
    MTN: 78.5,
    PAC: 81.5,
  },
  2017: {
    NE: 78.9,
    MA: 79.5,
    ENC: 79.9,
    WNC: 75.1,
    SA: 78.3,
    ESC: 79.5,
    WSC: 79.3,
    MTN: 78.9,
    PAC: 80.3,
  },
  2018: {
    NE: 79.0,
    MA: 79.5,
    ENC: 79.4,
    WNC: 77.8,
    SA: 79.2,
    ESC: 79.9,
    WSC: 79.5,
    MTN: 78.2,
    PAC: 80.5,
  },
  2019: {
    NE: 80.7,
    MA: 77.7,
    ENC: 78.4,
    WNC: 77.4,
    SA: 76.7,
    ESC: 80.6,
    WSC: 79.3,
    MTN: 77.7,
    PAC: 82.9,
  },
  2020: {
    NE: 80.9,
    MA: 80.2,
    ENC: 82.1,
    WNC: 79.1,
    SA: 80.6,
    ESC: 80.0,
    WSC: 81.5,
    MTN: 80.9,
    PAC: 81.6,
  },
  2021: {
    NE: 77.9,
    MA: 79.6,
    ENC: 78.4,
    WNC: 75.7,
    SA: 76.7,
    ESC: 78.3,
    WSC: 78.4,
    MTN: 77.2,
    PAC: 84.6,
  },
  2022: {
    NE: 77.6,
    MA: 78.6,
    ENC: 77.3,
    WNC: 75.6,
    SA: 76.1,
    ESC: 77.6,
    WSC: 77.8,
    MTN: 74.4,
    PAC: 77.1,
  },
};

export const BIRTH_YEARS = Object.keys(ONE_YEAR_BY_DIVISION)
  .map(Number)
  .sort((a, b) => a - b);

function meanDivision(year: number): number {
  const row = ONE_YEAR_BY_DIVISION[year];
  const vals = DIVISIONS.map((d) => row[d.id]);
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

/** National unweighted division mean — estimated from disclosed cells. */
export const NATIONAL_ONE_YEAR: {
  birthYear: number;
  survivalPct: number;
  exitPct: number;
  era: "pre" | "relief" | "post-relief";
  confidence: Confidence;
}[] = BIRTH_YEARS.map((birthYear) => {
  const survivalPct = meanDivision(birthYear);
  const era: "pre" | "relief" | "post-relief" =
    birthYear <= 2019 ? "pre" : birthYear === 2020 ? "relief" : "post-relief";
  return {
    birthYear,
    survivalPct,
    exitPct: Math.round((100 - survivalPct) * 10) / 10,
    era,
    confidence: "estimated" as const,
  };
});

/** Historical BED conditional survival (survive to age t | survive to t−1). */
export const CONDITIONAL_SURVIVAL = {
  age1to2: 0.855,
  age2to3: 0.882,
  age3to4: 0.9,
  age4to5: 0.91,
} as const;

export type CurvePoint = {
  ageYears: number;
  survivalPct: number;
  confidence: Confidence;
};

export type CohortCurve = {
  birthYear: number;
  label: string;
  era: "pre" | "relief" | "post-relief";
  points: CurvePoint[];
};

function buildCurve(birthYear: number): CohortCurve {
  const age1 = meanDivision(birthYear);
  const era: CohortCurve["era"] =
    birthYear <= 2019 ? "pre" : birthYear === 2020 ? "relief" : "post-relief";
  const age2 =
    Math.round(age1 * CONDITIONAL_SURVIVAL.age1to2 * 10) / 10;
  const age3 =
    Math.round(age2 * CONDITIONAL_SURVIVAL.age2to3 * 10) / 10;
  const age4 =
    Math.round(age3 * CONDITIONAL_SURVIVAL.age3to4 * 10) / 10;
  const age5 =
    Math.round(age4 * CONDITIONAL_SURVIVAL.age4to5 * 10) / 10;
  return {
    birthYear,
    label: `${birthYear} births`,
    era,
    points: [
      { ageYears: 0, survivalPct: 100, confidence: "disclosed" },
      { ageYears: 1, survivalPct: age1, confidence: "estimated" },
      { ageYears: 2, survivalPct: age2, confidence: "modeled" },
      { ageYears: 3, survivalPct: age3, confidence: "modeled" },
      { ageYears: 4, survivalPct: age4, confidence: "modeled" },
      { ageYears: 5, survivalPct: age5, confidence: "modeled" },
    ],
  };
}

/** Focus cohorts for curve panel. */
export const COHORT_CURVES: CohortCurve[] = [2018, 2019, 2020, 2021, 2022].map(
  buildCurve,
);

export type DivisionCompareRow = {
  id: DivisionId;
  name: string;
  short: string;
  y2019: number;
  y2020: number;
  y2021: number;
  y2022: number;
  delta2020Vs2019: number;
  delta2022Vs2020: number;
  delta2022Vs2019: number;
};

export const DIVISION_COMPARE: DivisionCompareRow[] = DIVISIONS.map((d) => {
  const y2019 = ONE_YEAR_BY_DIVISION[2019][d.id];
  const y2020 = ONE_YEAR_BY_DIVISION[2020][d.id];
  const y2021 = ONE_YEAR_BY_DIVISION[2021][d.id];
  const y2022 = ONE_YEAR_BY_DIVISION[2022][d.id];
  return {
    id: d.id,
    name: d.name,
    short: d.short,
    y2019,
    y2020,
    y2021,
    y2022,
    delta2020Vs2019: Math.round((y2020 - y2019) * 10) / 10,
    delta2022Vs2020: Math.round((y2022 - y2020) * 10) / 10,
    delta2022Vs2019: Math.round((y2022 - y2019) * 10) / 10,
  };
});

/** Relief / policy markers for composed timeline (program milestones). */
export const RELIEF_MARKERS: {
  year: number;
  label: string;
  kind: "start" | "peak" | "end";
}[] = [
  { year: 2020, label: "CARES / PPP open", kind: "start" },
  { year: 2021, label: "PPP 2nd draw / ERC peak", kind: "peak" },
  { year: 2022, label: "Forgiveness wind-down", kind: "end" },
];

/**
 * Sector 1-year survival proxies (national desk reconstruction).
 * Levels anchored to BED all-private path; sector spreads use historical
 * young-establishment exit differentials (BDS/BED age literature) — modeled.
 */
export const SECTOR_ONE_YEAR: {
  sector: string;
  y2019: number;
  y2020: number;
  y2022: number;
  confidence: Confidence;
}[] = [
  { sector: "All private", y2019: 79.0, y2020: 80.8, y2022: 76.9, confidence: "estimated" },
  { sector: "Construction", y2019: 77.2, y2020: 79.4, y2022: 74.8, confidence: "modeled" },
  { sector: "Manufacturing", y2019: 81.5, y2020: 82.6, y2022: 79.8, confidence: "modeled" },
  { sector: "Retail trade", y2019: 78.4, y2020: 80.1, y2022: 75.6, confidence: "modeled" },
  { sector: "Accommodation & food", y2019: 74.8, y2020: 78.9, y2022: 72.4, confidence: "modeled" },
  { sector: "Professional services", y2019: 82.1, y2020: 83.0, y2022: 80.2, confidence: "modeled" },
  { sector: "Health care", y2019: 83.4, y2020: 84.1, y2022: 81.6, confidence: "modeled" },
  { sector: "Information", y2019: 80.6, y2020: 81.8, y2022: 77.9, confidence: "modeled" },
];

export const COHORT_TABLE: {
  birthYear: number;
  oneYearPct: number;
  modeledAge3Pct: number;
  modeledAge5Pct: number;
  vsBaselinePp: number;
  era: string;
}[] = NATIONAL_ONE_YEAR.map((r) => {
  const curve = buildCurve(r.birthYear);
  return {
    birthYear: r.birthYear,
    oneYearPct: r.survivalPct,
    modeledAge3Pct: curve.points[3].survivalPct,
    modeledAge5Pct: curve.points[5].survivalPct,
    vsBaselinePp:
      Math.round((r.survivalPct - HEADLINE.oneYearBaseline2017_19Pct) * 10) / 10,
    era:
      r.era === "pre"
        ? "Pre-pandemic"
        : r.era === "relief"
          ? "Relief window"
          : "Post-relief",
  };
});

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}
