/**
 * NCES public K–12 enrollment change by state (2019 → 2024).
 *
 * Core question: Which states lost the largest share of public elementary and
 * secondary enrollment from fall 2019 to the latest CCD year (fall 2024)?
 *
 * Primary: NCES Digest of Education Statistics Table 203.20 (CCD State
 * Nonfiscal Survey). Secondary: Census school-age (5–17) resident population
 * via NCES Digest Table 101.40 (2019 vs 2022, in thousands).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Public enrollment counts are NCES Common Core of Data (CCD) State Nonfiscal " +
  "Survey totals published in Digest Table 203.20 (fall 1990–fall 2024; prepared " +
  "March 2026). United States = 50 states + D.C. Footnoted years may include " +
  "imputations for nonreported prekindergarten. School-age (ages 5–17) resident " +
  "population (thousands) is Census Bureau estimates as republished in Digest " +
  "Table 101.40 through 2022. Enrollment–population “gap” points are desk " +
  "differences (enrollment %Δ 2019–24 minus school-age %Δ 2019–22), not an " +
  "NCES published series. Private-school and homeschool shares are outside CCD.";

export const SOURCES = [
  {
    label: "NCES Digest Table 203.20 — enrollment by state (through fall 2024)",
    url: "https://nces.ed.gov/programs/digest/d25/tables/dt25_203.20.asp",
  },
  {
    label: "NCES CCD — State Nonfiscal Survey of Public Elementary/Secondary Education",
    url: "https://nces.ed.gov/ccd/",
  },
  {
    label: "NCES Digest Table 101.40 — total & school-age population by state",
    url: "https://nces.ed.gov/programs/digest/d23/tables/dt23_101.40.asp",
  },
  {
    label: "Census Bureau — Population Estimates Program (school-age inputs)",
    url: "https://www.census.gov/programs-surveys/popest.html",
  },
] as const;

export const VIZ_MARKERS = [
  "Enrollment % change 2019–24",
  "National path since 2019",
  "Enrollment vs school-age gap",
] as const;

/** Headline punchline — deepest state losses vs national −2.8% */
export const HEADLINE = {
  baseYear: 2019,
  latestYear: 2024,
  schoolAgeLatestYear: 2022,
  usEnroll2019: 50_796_445,
  usEnroll2024: 49_387_403,
  usPctChange2019_24: -2.8,
  usSchoolAge2019k: 53_517,
  usSchoolAge2022k: 53_912,
  usSchoolAgePct2019_22: 0.7,
  /** States (incl. DC) with enrollment decline >4% fall 2019–24 */
  statesDownOver4: 21,
  /** States (incl. DC) with enrollment increase fall 2019–24 */
  statesUp: 9,
  /** Deepest loss among 50 states + DC */
  deepestState: "West Virginia",
  deepestPct: -8.1,
  /** Largest gain among 50 states + DC */
  topGainer: "District of Columbia",
  topGainPct: 4.8,
  /** West region % change (Digest region row) */
  westPct: -4.8,
  northeastPct: -4.1,
  midwestPct: -3.1,
  southPct: -0.8,
  stateN: 51,
} as const;

export type RegionId = "Northeast" | "Midwest" | "South" | "West";

export type BandId =
  | "deep-loss" // ≤ −5%
  | "moderate-loss" // (−5, −2]
  | "near-flat" // (−2, 2)
  | "gain"; // ≥ 2%

export type StateRow = {
  state: string;
  abbr: string;
  region: RegionId;
  enroll2019: number;
  enroll2020: number;
  enroll2021: number;
  enroll2022: number;
  enroll2023: number;
  enroll2024: number;
  /** Digest column 17: percent change fall 2019–24 */
  pct2019_24: number;
  /** Digest column 18: percent change fall 2023–24 */
  pct2023_24: number;
  /** School-age pop 2019 (thousands) */
  schoolAge2019k: number;
  /** School-age pop 2022 (thousands) */
  schoolAge2022k: number;
  /** % change school-age 2019–22 */
  schoolAgePct2019_22: number;
  /** enrollment %Δ − school-age %Δ (pp); negative = enrollment fell faster */
  gapPp: number;
  band: BandId;
  confidence: Confidence;
};

function bandOf(pct: number): BandId {
  if (pct <= -5) return "deep-loss";
  if (pct <= -2) return "moderate-loss";
  if (pct < 2) return "near-flat";
  return "gain";
}

function gap(
  enrollPct: number,
  schoolAge2019k: number,
  schoolAge2022k: number,
): { schoolAgePct: number; gapPp: number } {
  const schoolAgePct =
    Math.round(((schoolAge2022k - schoolAge2019k) / schoolAge2019k) * 1000) /
    10;
  const gapPp = Math.round((enrollPct - schoolAgePct) * 10) / 10;
  return { schoolAgePct, gapPp };
}

function row(
  state: string,
  abbr: string,
  region: RegionId,
  enroll: [number, number, number, number, number, number],
  pct2019_24: number,
  pct2023_24: number,
  schoolAge2019k: number,
  schoolAge2022k: number,
): StateRow {
  const { schoolAgePct, gapPp } = gap(
    pct2019_24,
    schoolAge2019k,
    schoolAge2022k,
  );
  return {
    state,
    abbr,
    region,
    enroll2019: enroll[0],
    enroll2020: enroll[1],
    enroll2021: enroll[2],
    enroll2022: enroll[3],
    enroll2023: enroll[4],
    enroll2024: enroll[5],
    pct2019_24,
    pct2023_24,
    schoolAge2019k,
    schoolAge2022k,
    schoolAgePct2019_22: schoolAgePct,
    gapPp,
    band: bandOf(pct2019_24),
    confidence: "disclosed",
  };
}

/** 50 states + D.C. — NCES Digest 203.20 enrollments; 101.40 school-age (k) */
export const STATE_PANEL: StateRow[] = [
  row("Alabama", "AL", "South", [744235, 734559, 748274, 750923, 748650, 751060], 0.9, 0.3, 794, 821),
  row("Alaska", "AK", "West", [132017, 129872, 129944, 130723, 131243, 129876], -1.6, -1.0, 129, 130),
  row("Arizona", "AZ", "West", [1152586, 1111500, 1133284, 1132223, 1117630, 1103894], -4.2, -1.2, 1213, 1194),
  row("Arkansas", "AR", "South", [496927, 486305, 489565, 493130, 484978, 491239], -1.1, 1.3, 513, 517),
  row("California", "CA", "West", [6249005, 6064504, 5959858, 5930473, 5924113, 5897886], -5.6, -0.4, 6511, 6378),
  row("Colorado", "CO", "West", [913223, 883199, 880597, 870871, 865661, 865077], -5.3, -0.1, 927, 907),
  row("Connecticut", "CT", "Northeast", [523590, 509058, 509748, 513513, 512652, 508402], -2.9, -0.8, 545, 549),
  row("Delaware", "DE", "South", [139930, 138092, 139935, 141465, 141842, 142156], 1.6, 0.2, 149, 154),
  row("District of Columbia", "DC", "South", [89878, 89883, 88908, 91001, 92794, 94211], 4.8, 1.5, 83, 85),
  row("Florida", "FL", "South", [2858461, 2791707, 2833186, 2870527, 2872335, 2859600], 0.0, -0.4, 3094, 3190),
  row("Georgia", "GA", "South", [1769657, 1730015, 1740875, 1750972, 1749701, 1744662], -1.4, -0.3, 1851, 1879),
  row("Hawaii", "HI", "West", [181088, 176441, 173178, 170209, 169308, 167071], -7.7, -1.3, 213, 218),
  row("Idaho", "ID", "West", [311096, 307581, 314258, 317555, 316414, 315626], 1.5, -0.2, 333, 350),
  row("Illinois", "IL", "Midwest", [1943117, 1886137, 1868482, 1852242, 1846264, 1842881], -5.2, -0.2, 2072, 2040),
  row("Indiana", "IN", "Midwest", [1051411, 1033964, 1036625, 1036108, 1032723, 1040190], -1.1, 0.7, 1150, 1165),
  row("Iowa", "IA", "Midwest", [517324, 506656, 510661, 511297, 508112, 504292], -2.5, -0.8, 532, 538),
  row("Kansas", "KS", "Midwest", [497963, 481750, 485424, 487978, 483505, 481626], -3.3, -0.4, 515, 515),
  row("Kentucky", "KY", "South", [691996, 658809, 654239, 660029, 657520, 657263], -5.0, 0.0, 731, 742),
  row("Louisiana", "LA", "South", [710439, 693150, 683216, 718145, 708190, 666840], -6.1, -5.8, 787, 782),
  row("Maine", "ME", "Northeast", [180291, 172455, 173215, 173853, 172545, 167309], -7.2, -3.0, 186, 186),
  row("Maryland", "MD", "South", [909404, 882527, 881461, 889960, 890122, 891525], -2.0, 0.2, 975, 997),
  row("Massachusetts", "MA", "Northeast", [959394, 921712, 921180, 923349, 914958, 915932], -4.5, 0.1, 997, 994),
  row("Michigan", "MI", "Midwest", [1495925, 1434137, 1440090, 1433914, 1426491, 1423933], -4.8, -0.2, 1578, 1573),
  row("Minnesota", "MN", "Midwest", [893203, 872083, 870506, 870019, 869967, 876182], -1.9, 0.7, 952, 964),
  row("Mississippi", "MS", "South", [466002, 442627, 442000, 440285, 436523, 431864], -7.3, -1.1, 515, 504),
  row("Missouri", "MO", "Midwest", [910466, 882477, 888823, 892246, 891248, 889059], -2.4, -0.2, 1004, 1011),
  row("Montana", "MT", "West", [149917, 146252, 150195, 150733, 149291, 147208], -1.8, -1.4, 168, 176),
  row("Nebraska", "NE", "Midwest", [330018, 324697, 327564, 329234, 329162, 330622], 0.2, 0.4, 345, 353),
  row("Nevada", "NV", "West", [496934, 482348, 486648, 484192, 479574, 477563], -3.9, -0.4, 509, 516),
  row("New Hampshire", "NH", "Northeast", [177351, 169027, 170005, 168909, 166594, 164153], -7.4, -1.5, 192, 190),
  row("New Jersey", "NJ", "Northeast", [1411917, 1373960, 1372381, 1383830, 1392567, 1394971], -1.2, 0.2, 1426, 1478),
  row("New Mexico", "NM", "West", [331206, 316840, 316590, 315023, 311719, 307110], -7.3, -1.5, 356, 349),
  row("New York", "NY", "Northeast", [2692589, 2606748, 2548490, 2532888, 2533449, 2527258], -6.1, -0.2, 2902, 2930),
  row("North Carolina", "NC", "South", [1560350, 1513677, 1525223, 1541722, 1544289, 1555418], -0.3, 0.7, 1695, 1698),
  row("North Dakota", "ND", "Midwest", [116185, 114955, 116864, 118513, 119033, 119792], 3.1, 0.6, 126, 133),
  row("Ohio", "OH", "Midwest", [1689867, 1645412, 1683612, 1680639, 1675300, 1665566], -1.4, -0.6, 1890, 1901),
  row("Oklahoma", "OK", "South", [703719, 694113, 698696, 701301, 698761, 697358], -0.9, -0.2, 697, 709),
  row("Oregon", "OR", "West", [610648, 578723, 576201, 577335, 572624, 570233], -6.6, -0.4, 639, 631),
  row("Pennsylvania", "PA", "Northeast", [1732449, 1704396, 1695092, 1693347, 1692829, 1691456], -2.4, -0.1, 1938, 1953),
  row("Rhode Island", "RI", "Northeast", [143557, 139184, 138566, 137449, 136154, 135978], -5.3, -0.1, 149, 151),
  row("South Carolina", "SC", "South", [786879, 766819, 780878, 789231, 793860, 796780], 1.3, 0.4, 820, 832),
  row("South Dakota", "SD", "Midwest", [139949, 139566, 141307, 141888, 141467, 141065], 0.8, -0.3, 157, 161),
  row("Tennessee", "TN", "South", [1014744, 985207, 996709, 1006752, 1004625, 1003622], -1.1, -0.1, 1102, 1133),
  row("Texas", "TX", "South", [5495398, 5372806, 5428613, 5519599, 5532518, 5545640], 0.9, 0.2, 5415, 5554),
  row("Utah", "UT", "West", [684694, 680659, 690934, 691906, 689883, 684604], 0.0, -0.8, 684, 699),
  row("Vermont", "VT", "Northeast", [86759, 82401, 83975, 83654, 82455, 81398], -6.2, -1.3, 86, 87),
  row("Virginia", "VA", "South", [1297012, 1251639, 1249815, 1260351, 1258852, 1257315], -3.1, -0.1, 1360, 1379),
  row("Washington", "WA", "West", [1142073, 1087354, 1081835, 1090227, 1093745, 1094502], -4.2, 0.1, 1206, 1221),
  row("West Virginia", "WV", "South", [263486, 253930, 252720, 251224, 246883, 242155], -8.1, -1.9, 267, 264),
  row("Wisconsin", "WI", "Midwest", [855400, 830066, 829359, 823040, 814202, 806065], -5.8, -1.0, 937, 933),
  row("Wyoming", "WY", "West", [94616, 92772, 93093, 92467, 91036, 89915], -5.0, -1.2, 99, 99),
];

export const NATIONAL_PATH = [
  { year: 2019, enrollment: 50_796_445, index: 100.0 },
  { year: 2020, enrollment: 49_374_751, index: 97.2 },
  { year: 2021, enrollment: 49_433_092, index: 97.3 },
  { year: 2022, enrollment: 49_618_464, index: 97.7 },
  { year: 2023, enrollment: 49_516_361, index: 97.5 },
  { year: 2024, enrollment: 49_387_403, index: 97.2 },
] as const;

export const REGION_SUMMARY = [
  {
    region: "Northeast" as RegionId,
    enroll2019: 7_907_997,
    enroll2024: 7_586_857,
    pct2019_24: -4.1,
    pct2023_24: -0.2,
  },
  {
    region: "Midwest" as RegionId,
    enroll2019: 10_440_828,
    enroll2024: 10_121_273,
    pct2019_24: -3.1,
    pct2023_24: -0.2,
  },
  {
    region: "South" as RegionId,
    enroll2019: 19_998_517,
    enroll2024: 19_828_708,
    pct2019_24: -0.8,
    pct2023_24: -0.2,
  },
  {
    region: "West" as RegionId,
    enroll2019: 12_449_103,
    enroll2024: 11_850_565,
    pct2019_24: -4.8,
    pct2023_24: -0.5,
  },
] as const;

export const BAND_MIX = (
  ["deep-loss", "moderate-loss", "near-flat", "gain"] as BandId[]
).map((id) => {
  const n = STATE_PANEL.filter((s) => s.band === id).length;
  return { id, label: bandLabel(id), count: n, share: n / STATE_PANEL.length };
});

function bandLabel(id: BandId): string {
  switch (id) {
    case "deep-loss":
      return "Deep loss (≤ −5%)";
    case "moderate-loss":
      return "Moderate loss (−5% to −2%)";
    case "near-flat":
      return "Near flat (−2% to +2%)";
    case "gain":
      return "Gain (≥ +2%)";
  }
}

/** Steepest enrollment losses fall 2019–24 */
export const TOP_LOSSES = [...STATE_PANEL]
  .sort((a, b) => a.pct2019_24 - b.pct2019_24)
  .slice(0, 12);

/** Largest enrollment gains fall 2019–24 */
export const TOP_GAINS = [...STATE_PANEL]
  .sort((a, b) => b.pct2019_24 - a.pct2019_24)
  .slice(0, 8);

/** States where enrollment fell much faster than school-age pop (most negative gap) */
export const GAP_OUTLIERS = [...STATE_PANEL]
  .sort((a, b) => a.gapPp - b.gapPp)
  .slice(0, 12);

export function statesByRegion(region: "all" | RegionId): StateRow[] {
  if (region === "all") return STATE_PANEL;
  return STATE_PANEL.filter((s) => s.region === region);
}

export function statesByBand(band: "all" | BandId): StateRow[] {
  if (band === "all") return STATE_PANEL;
  return STATE_PANEL.filter((s) => s.band === band);
}

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtEnroll(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

export function fmtPp(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} pp`;
}
