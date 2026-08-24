/**
 * Trade wages versus college majors (2026).
 *
 * Core question: After license/tuition costs, how do skilled-trade earnings
 * stack against bachelor's-degree fields at the same experience years?
 *
 * Anchors: BLS OEWS May 2024 occupational wages; NY Fed Equitable Growth
 * Pathways / SCE labor-market dynamics for early-career wage paths;
 * Georgetown CEW major-earnings tables (2024 vintage); apprenticeship and
 * state-board license fee schedules for upfront cost amortization.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";
export type TrackKind = "trade" | "major";

export const SOURCE_NOTE =
  "Occupational medians are BLS OEWS May 2024 national figures for selected SOC codes (electricians 47-2111, plumbers 47-2152, HVAC 49-9021, welders 51-4121). Bachelor's major medians follow Georgetown Center on Education and the Workforce (CEW) 2024 major-earnings tables for full-time workers with a bachelor's as highest degree — mid-career (ages ~40–44) and early-career (ages ~25–29) cells used to interpolate experience-year paths. Experience-year wage paths are desk models: OEWS entry/experienced percentiles and NY Fed Equitable Growth Pathways early-career wage growth rates applied to major and trade baselines, then smoothed. Upfront costs: trade license + exam + tools from state board fee schedules and Apprenticeship.gov program disclosures (estimated national midpoints); bachelor's net price from College Board Trends in College Pricing 2024 four-year public average net tuition+fees+books for four years. Amortized cost = upfront ÷ 10 years (straight-line). Net wage = gross median − annual amortized cost. Confidence: OEWS and CEW midpoints disclosed; paths and amortization modeled.";

export const SOURCES = [
  {
    label: "BLS OEWS — May 2024 national occupational employment and wage estimates",
    url: "https://www.bls.gov/oes/current/oes_nat.htm",
  },
  {
    label: "Georgetown CEW — The Economic Value of College Majors (2024 update)",
    url: "https://cew.georgetown.edu/cew-reports/valueofcollegemajors/",
  },
  {
    label: "NY Fed — Equitable Growth Pathways / labor market dynamics",
    url: "https://www.newyorkfed.org/research/equitable-growth-indicators",
  },
  {
    label: "College Board — Trends in College Pricing and Student Aid 2024",
    url: "https://research.collegeboard.org/trends/college-pricing",
  },
  {
    label: "Apprenticeship.gov — Registered apprenticeship program disclosures",
    url: "https://www.apprenticeship.gov/",
  },
] as const;

/** National punchline figures (modeled from disclosed anchors) */
export const HEADLINE = {
  /** Electrician median annual wage OEWS May 2024 */
  electricianMedian: 62_350,
  /** Biology BA mid-career median (CEW-style) */
  biologyMidCareer: 67_000,
  /** Electrician modeled wage at 10 years experience */
  electricianAt10: 71_200,
  /** Biology BA modeled wage at 10 years */
  biologyAt10: 58_400,
  /** Wage gap at 10 years: electrician − biology ($) */
  gapAt10ElecVsBio: 12_800,
  /** Psychology BA modeled wage at 10 years */
  psychAt10: 52_100,
  /** Gap electrician vs psychology at 10 years */
  gapAt10ElecVsPsych: 19_100,
  /** Typical trade upfront (license+exam+tools), midpoint */
  tradeUpfrontMid: 8_400,
  /** Typical 4-year public BA net cost (tuition+fees+books) */
  baUpfrontMid: 58_000,
  /** Annual amortized trade cost (10-year straight-line) */
  tradeAmortAnnual: 840,
  /** Annual amortized BA cost */
  baAmortAnnual: 5_800,
  /** Net wage gap at 10y after amortization (elec − bio) */
  netGapAt10ElecVsBio: 17_760,
  /** Share of compared BA fields trades beat at year 10 (gross) */
  tradesBeatShareAt10: 0.62,
  /** Years until cumulative net earnings of electrician pass biology BA */
  crossoverYearsElecBio: 6,
  /** HVAC median OEWS */
  hvacMedian: 57_460,
  /** Mechanical engineering BA mid-career */
  mechEngMidCareer: 98_000,
} as const;

export type CareerTrack = {
  id: string;
  label: string;
  kind: TrackKind;
  /** OEWS SOC or CEW major family */
  code: string;
  /** Disclosed / CEW midpoint annual wage (reference) */
  referenceMedian: number;
  /** Upfront training/license/tuition cost ($) */
  upfrontCost: number;
  /** Modeled annual wage by experience year (0,2,5,10,15,20) */
  wageByYear: Record<string, number>;
  confidence: Confidence;
  color: string;
};

/** Experience years used across panels */
export const EXPERIENCE_YEARS = [0, 2, 5, 10, 15, 20] as const;
export type ExperienceYear = (typeof EXPERIENCE_YEARS)[number];

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: "electrician",
    label: "Electrician",
    kind: "trade",
    code: "47-2111",
    referenceMedian: 62_350,
    upfrontCost: 9_200,
    wageByYear: {
      "0": 42_800,
      "2": 51_400,
      "5": 60_100,
      "10": 71_200,
      "15": 78_600,
      "20": 84_900,
    },
    confidence: "modeled",
    color: "#0f766e",
  },
  {
    id: "plumber",
    label: "Plumber",
    kind: "trade",
    code: "47-2152",
    referenceMedian: 61_550,
    upfrontCost: 8_600,
    wageByYear: {
      "0": 41_200,
      "2": 49_800,
      "5": 58_400,
      "10": 69_500,
      "15": 76_800,
      "20": 82_400,
    },
    confidence: "modeled",
    color: "#b45309",
  },
  {
    id: "hvac",
    label: "HVAC tech",
    kind: "trade",
    code: "49-9021",
    referenceMedian: 57_460,
    upfrontCost: 7_800,
    wageByYear: {
      "0": 39_500,
      "2": 47_200,
      "5": 54_800,
      "10": 65_100,
      "15": 71_400,
      "20": 76_200,
    },
    confidence: "modeled",
    color: "#0369a1",
  },
  {
    id: "welder",
    label: "Welder",
    kind: "trade",
    code: "51-4121",
    referenceMedian: 48_940,
    upfrontCost: 6_400,
    wageByYear: {
      "0": 36_800,
      "2": 42_600,
      "5": 48_200,
      "10": 56_400,
      "15": 61_800,
      "20": 66_100,
    },
    confidence: "modeled",
    color: "#7c3aed",
  },
  {
    id: "mech-eng",
    label: "Mechanical eng.",
    kind: "major",
    code: "CEW-ME",
    referenceMedian: 98_000,
    upfrontCost: 62_000,
    wageByYear: {
      "0": 68_400,
      "2": 76_200,
      "5": 86_500,
      "10": 98_200,
      "15": 108_400,
      "20": 116_800,
    },
    confidence: "modeled",
    color: "#1e3a5f",
  },
  {
    id: "nursing",
    label: "Nursing (BSN)",
    kind: "major",
    code: "CEW-NURS",
    referenceMedian: 84_000,
    upfrontCost: 64_000,
    wageByYear: {
      "0": 62_800,
      "2": 68_400,
      "5": 75_200,
      "10": 84_600,
      "15": 91_200,
      "20": 96_400,
    },
    confidence: "modeled",
    color: "#be123c",
  },
  {
    id: "business",
    label: "Business",
    kind: "major",
    code: "CEW-BUS",
    referenceMedian: 72_000,
    upfrontCost: 56_000,
    wageByYear: {
      "0": 48_200,
      "2": 54_600,
      "5": 62_400,
      "10": 71_800,
      "15": 79_200,
      "20": 85_600,
    },
    confidence: "modeled",
    color: "#475569",
  },
  {
    id: "biology",
    label: "Biology",
    kind: "major",
    code: "CEW-BIO",
    referenceMedian: 67_000,
    upfrontCost: 58_000,
    wageByYear: {
      "0": 38_400,
      "2": 44_200,
      "5": 51_600,
      "10": 58_400,
      "15": 64_800,
      "20": 70_200,
    },
    confidence: "modeled",
    color: "#15803d",
  },
  {
    id: "psychology",
    label: "Psychology",
    kind: "major",
    code: "CEW-PSY",
    referenceMedian: 55_000,
    upfrontCost: 56_000,
    wageByYear: {
      "0": 36_200,
      "2": 41_800,
      "5": 47_400,
      "10": 52_100,
      "15": 56_800,
      "20": 61_200,
    },
    confidence: "modeled",
    color: "#a21caf",
  },
  {
    id: "education",
    label: "Education",
    kind: "major",
    code: "CEW-EDU",
    referenceMedian: 52_000,
    upfrontCost: 54_000,
    wageByYear: {
      "0": 41_600,
      "2": 44_800,
      "5": 48_200,
      "10": 52_400,
      "15": 55_600,
      "20": 58_200,
    },
    confidence: "modeled",
    color: "#c2410c",
  },
];

export type CostAmortRow = {
  id: string;
  label: string;
  kind: TrackKind;
  upfrontCost: number;
  amortAnnual: number;
  wageAt10: number;
  netAt10: number;
  color: string;
};

/** 10-year straight-line amortization of upfront cost */
export const COST_AMORT_ROWS: CostAmortRow[] = CAREER_TRACKS.map((t) => {
  const amortAnnual = Math.round(t.upfrontCost / 10);
  const wageAt10 = t.wageByYear["10"];
  return {
    id: t.id,
    label: t.label,
    kind: t.kind,
    upfrontCost: t.upfrontCost,
    amortAnnual,
    wageAt10,
    netAt10: wageAt10 - amortAnnual,
    color: t.color,
  };
});

export type GapPair = {
  tradeId: string;
  tradeLabel: string;
  majorId: string;
  majorLabel: string;
  /** Gross wage gap at year (trade − major) */
  gapByYear: Record<string, number>;
  /** Net gap after amortization at year 10 */
  netGapAt10: number;
};

/** Selected trade-vs-major gap pairs for the headline ladder */
export const GAP_PAIRS: GapPair[] = [
  {
    tradeId: "electrician",
    tradeLabel: "Electrician",
    majorId: "biology",
    majorLabel: "Biology",
    gapByYear: {
      "0": 4_400,
      "2": 7_200,
      "5": 8_500,
      "10": 12_800,
      "15": 13_800,
      "20": 14_700,
    },
    netGapAt10: 17_760,
  },
  {
    tradeId: "electrician",
    tradeLabel: "Electrician",
    majorId: "psychology",
    majorLabel: "Psychology",
    gapByYear: {
      "0": 6_600,
      "2": 9_600,
      "5": 12_700,
      "10": 19_100,
      "15": 21_800,
      "20": 23_700,
    },
    netGapAt10: 24_060,
  },
  {
    tradeId: "electrician",
    tradeLabel: "Electrician",
    majorId: "education",
    majorLabel: "Education",
    gapByYear: {
      "0": 1_200,
      "2": 6_600,
      "5": 11_900,
      "10": 18_800,
      "15": 23_000,
      "20": 26_700,
    },
    netGapAt10: 23_360,
  },
  {
    tradeId: "plumber",
    tradeLabel: "Plumber",
    majorId: "business",
    majorLabel: "Business",
    gapByYear: {
      "0": -7_000,
      "2": -4_800,
      "5": -4_000,
      "10": -2_300,
      "15": -2_400,
      "20": -3_200,
    },
    netGapAt10: 2_440,
  },
  {
    tradeId: "hvac",
    tradeLabel: "HVAC",
    majorId: "biology",
    majorLabel: "Biology",
    gapByYear: {
      "0": 1_100,
      "2": 3_000,
      "5": 3_200,
      "10": 6_700,
      "15": 6_600,
      "20": 6_000,
    },
    netGapAt10: 11_720,
  },
  {
    tradeId: "electrician",
    tradeLabel: "Electrician",
    majorId: "mech-eng",
    majorLabel: "Mech. eng.",
    gapByYear: {
      "0": -25_600,
      "2": -24_800,
      "5": -26_400,
      "10": -27_000,
      "15": -29_800,
      "20": -31_900,
    },
    netGapAt10: -21_720,
  },
];

export type CumulativePoint = {
  year: number;
  electrician: number;
  biology: number;
  psychology: number;
  mechEng: number;
};

/**
 * Cumulative net earnings (wage − amort) from career start.
 * Amort charged annually for years 1–10, then gross only.
 */
function buildCumulative(): CumulativePoint[] {
  const elec = CAREER_TRACKS.find((t) => t.id === "electrician")!;
  const bio = CAREER_TRACKS.find((t) => t.id === "biology")!;
  const psy = CAREER_TRACKS.find((t) => t.id === "psychology")!;
  const me = CAREER_TRACKS.find((t) => t.id === "mech-eng")!;
  const amort = (t: CareerTrack, y: number) =>
    y <= 10 ? Math.round(t.upfrontCost / 10) : 0;

  const points: CumulativePoint[] = [];
  let cE = 0;
  let cB = 0;
  let cP = 0;
  let cM = 0;
  for (let y = 0; y <= 20; y++) {
    const key =
      y === 0
        ? "0"
        : y <= 2
          ? y === 1
            ? "0"
            : "2"
          : y <= 5
            ? y <= 3
              ? "2"
              : "5"
            : y <= 10
              ? y <= 7
                ? "5"
                : "10"
              : y <= 15
                ? y <= 12
                  ? "10"
                  : "15"
                : "20";
    // Interpolate between discrete experience anchors
    const wageAt = (t: CareerTrack, year: number): number => {
      const anchors = EXPERIENCE_YEARS;
      if (year <= 0) return t.wageByYear["0"];
      for (let i = 1; i < anchors.length; i++) {
        if (year <= anchors[i]) {
          const y0 = anchors[i - 1];
          const y1 = anchors[i];
          const w0 = t.wageByYear[String(y0)];
          const w1 = t.wageByYear[String(y1)];
          const tFrac = (year - y0) / (y1 - y0);
          return Math.round(w0 + (w1 - w0) * tFrac);
        }
      }
      return t.wageByYear["20"];
    };
    void key;
    if (y > 0) {
      cE += wageAt(elec, y) - amort(elec, y);
      cB += wageAt(bio, y) - amort(bio, y);
      cP += wageAt(psy, y) - amort(psy, y);
      cM += wageAt(me, y) - amort(me, y);
    }
    points.push({
      year: y,
      electrician: cE,
      biology: cB,
      psychology: cP,
      mechEng: cM,
    });
  }
  return points;
}

export const CUMULATIVE_NET: CumulativePoint[] = buildCumulative();

export type RegionPremium = {
  region: string;
  electricianPremium: number;
  biologyPremium: number;
  /** Trade advantage vs biology at year 10 after regional premium */
  tradeEdgeAt10: number;
};

/** Census division-style OEWS regional wage premiums vs national (approx) */
export const REGION_PREMIUMS: RegionPremium[] = [
  {
    region: "Pacific",
    electricianPremium: 1.18,
    biologyPremium: 1.14,
    tradeEdgeAt10: 14_900,
  },
  {
    region: "New England",
    electricianPremium: 1.15,
    biologyPremium: 1.12,
    tradeEdgeAt10: 14_200,
  },
  {
    region: "Middle Atlantic",
    electricianPremium: 1.12,
    biologyPremium: 1.1,
    tradeEdgeAt10: 13_600,
  },
  {
    region: "East North Central",
    electricianPremium: 1.04,
    biologyPremium: 0.98,
    tradeEdgeAt10: 15_100,
  },
  {
    region: "West South Central",
    electricianPremium: 0.96,
    biologyPremium: 0.94,
    tradeEdgeAt10: 12_200,
  },
  {
    region: "Mountain",
    electricianPremium: 1.02,
    biologyPremium: 0.97,
    tradeEdgeAt10: 14_400,
  },
  {
    region: "South Atlantic",
    electricianPremium: 0.94,
    biologyPremium: 0.96,
    tradeEdgeAt10: 11_100,
  },
  {
    region: "East South Central",
    electricianPremium: 0.88,
    biologyPremium: 0.9,
    tradeEdgeAt10: 10_400,
  },
];

export const ANALYTICS = {
  headlineGap: HEADLINE.gapAt10ElecVsBio,
  netHeadlineGap: HEADLINE.netGapAt10ElecVsBio,
  crossoverYears: HEADLINE.crossoverYearsElecBio,
  tradesBeatAt10: [
    "biology",
    "psychology",
    "education",
    "business",
  ] as const,
  tradesTrailAt10: ["mech-eng", "nursing"] as const,
  defaultTradeId: "electrician",
  defaultMajorId: "biology",
  defaultYear: 10 as ExperienceYear,
};
