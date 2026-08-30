/**
 * HUD Point-in-Time sheltered versus unsheltered counts.
 * Core question: How much of the latest PIT increase is unsheltered people
 * versus people in emergency shelter or transitional housing?
 *
 * Primary series: HUD AHAR Part 1 national PIT by shelter status (2007–2025),
 * with 2023→2024 change composition as the headline increment and 2025 as the
 * first subsequent national pullback. State rows are 2024 PIT by state;
 * emergency shelter vs transitional housing split uses the 2024 CoC national
 * populations and subpopulations report.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "National sheltered and unsheltered Point-in-Time (PIT) totals follow HUD’s Annual Homelessness Assessment Report (AHAR) Part 1 for January counts in 2007–2025. The 2023→2024 increase (+118,376) and its sheltered (+100,762) / unsheltered (+17,614) split are taken from the 2024 AHAR Part 1; January 2025 totals (745,652 total; 479,332 sheltered; 266,320 unsheltered) follow the 2025 AHAR Part 1 / CRS summary. Emergency shelter vs transitional housing bed-night persons for 2024 use HUD Exchange CoC Populations and Subpopulations (national). State sheltered/unsheltered rows are 2024 PIT state aggregates compiled from HUD AHAR state tables. PIT is a one-night snapshot; 22 CoCs carried forward prior-year unsheltered counts in 2024; 2021 unsheltered national totals were disrupted by COVID and are omitted from the continuous series.";

export const SOURCES = [
  {
    label: "HUD USER — 2024 AHAR Part 1 (PIT)",
    url: "https://www.huduser.gov/portal/datasets/ahar/2024-ahar-part-1-pit-estimates-of-homelessness-in-the-us.html",
  },
  {
    label: "HUD USER — 2025 AHAR Part 1 (PIT)",
    url: "https://www.huduser.gov/portal/datasets/ahar/2025-ahar-part-1-pit-estimates-of-homelessness-in-the-us.html",
  },
  {
    label: "HUD Exchange — 2024 CoC Populations & Subpopulations (national)",
    url: "https://files.hudexchange.info/reports/published/CoC_PopSub_NatlTerrDC_2024.pdf",
  },
  {
    label: "CRS — Homelessness (IF12985)",
    url: "https://www.congress.gov/crs_external_products/IF/HTML/IF12985.html",
  },
  {
    label: "USICH — performance / federal homelessness strategy materials",
    url: "https://www.usich.gov/",
  },
] as const;

/** Headline focuses on the 2023→2024 jump composition — the latest large PIT increase. */
export const HEADLINE = {
  year2023Total: 653_104,
  year2023Sheltered: 396_494,
  year2023Unsheltered: 256_610,
  year2024Total: 771_480,
  year2024Sheltered: 497_256,
  year2024Unsheltered: 274_224,
  year2025Total: 745_652,
  year2025Sheltered: 479_332,
  year2025Unsheltered: 266_320,
  increase2023to2024: 118_376,
  shelteredDelta2023to2024: 100_762,
  unshelteredDelta2023to2024: 17_614,
  shelteredShareOfIncreasePct: 85.1,
  unshelteredShareOfIncreasePct: 14.9,
  shelteredPctChange2023to2024: 25.4,
  unshelteredPctChange2023to2024: 6.9,
  totalPctChange2023to2024: 18.1,
  decrease2024to2025: 25_828,
  shelteredDelta2024to2025: -17_924,
  unshelteredDelta2024to2025: -7_904,
  shelteredShareOf2025DeclinePct: 69.4,
  year2024ShelteredSharePct: 64.5,
  year2024UnshelteredSharePct: 35.5,
  year2024EmergencyShelter: 431_478,
  year2024TransitionalHousing: 65_778,
  per10k2024: 23,
} as const;

export const VIZ_MARKERS = [
  "Sheltered vs unsheltered stack",
  "Increase waterfall",
  "Increase share donut",
  "State shelter mix",
  "ES / TH / street split",
  "Household-type mix",
] as const;

export type YearRow = {
  year: number;
  total: number | null;
  sheltered: number;
  unsheltered: number | null;
  note?: string;
  confidence: Confidence;
};

/** Continuous national PIT by shelter status; 2021 unsheltered omitted (COVID). */
export const YEARLY: YearRow[] = [
  { year: 2007, total: 647_258, sheltered: 391_401, unsheltered: 255_857, confidence: "disclosed" },
  { year: 2008, total: 639_784, sheltered: 386_361, unsheltered: 253_423, confidence: "disclosed" },
  { year: 2009, total: 630_227, sheltered: 403_308, unsheltered: 226_919, confidence: "disclosed" },
  { year: 2010, total: 637_077, sheltered: 403_543, unsheltered: 233_534, confidence: "disclosed" },
  { year: 2011, total: 623_788, sheltered: 392_316, unsheltered: 231_472, confidence: "disclosed" },
  { year: 2012, total: 621_553, sheltered: 390_534, unsheltered: 231_019, confidence: "disclosed" },
  { year: 2013, total: 590_364, sheltered: 394_698, unsheltered: 195_666, confidence: "disclosed" },
  { year: 2014, total: 576_450, sheltered: 401_051, unsheltered: 175_399, confidence: "disclosed" },
  { year: 2015, total: 564_708, sheltered: 391_440, unsheltered: 173_268, confidence: "disclosed" },
  { year: 2016, total: 549_928, sheltered: 373_571, unsheltered: 176_357, confidence: "disclosed" },
  { year: 2017, total: 550_996, sheltered: 360_867, unsheltered: 190_129, confidence: "disclosed" },
  { year: 2018, total: 552_830, sheltered: 358_363, unsheltered: 194_467, confidence: "disclosed" },
  { year: 2019, total: 567_715, sheltered: 356_422, unsheltered: 211_293, confidence: "disclosed" },
  { year: 2020, total: 580_466, sheltered: 354_386, unsheltered: 226_080, confidence: "disclosed" },
  {
    year: 2021,
    total: null,
    sheltered: 326_764,
    unsheltered: null,
    note: "Sheltered-only national estimate during COVID disruptions",
    confidence: "estimated",
  },
  { year: 2022, total: 582_462, sheltered: 348_630, unsheltered: 233_832, confidence: "disclosed" },
  { year: 2023, total: 653_104, sheltered: 396_494, unsheltered: 256_610, confidence: "disclosed" },
  { year: 2024, total: 771_480, sheltered: 497_256, unsheltered: 274_224, confidence: "disclosed" },
  { year: 2025, total: 745_652, sheltered: 479_332, unsheltered: 266_320, confidence: "disclosed" },
];

export type ChangeStep = {
  id: string;
  label: string;
  value: number;
  kind: "base" | "add" | "total";
};

/** Waterfall building blocks for the 2023→2024 national increase. */
export const INCREASE_WATERFALL: ChangeStep[] = [
  { id: "base", label: "2023 total", value: HEADLINE.year2023Total, kind: "base" },
  {
    id: "sheltered",
    label: "Sheltered Δ",
    value: HEADLINE.shelteredDelta2023to2024,
    kind: "add",
  },
  {
    id: "unsheltered",
    label: "Unsheltered Δ",
    value: HEADLINE.unshelteredDelta2023to2024,
    kind: "add",
  },
  { id: "end", label: "2024 total", value: HEADLINE.year2024Total, kind: "total" },
];

export const INCREASE_SHARE = [
  {
    id: "sheltered",
    label: "Sheltered (ES/TH/SH)",
    value: HEADLINE.shelteredDelta2023to2024,
    sharePct: HEADLINE.shelteredShareOfIncreasePct,
    fill: "#0f766e",
  },
  {
    id: "unsheltered",
    label: "Unsheltered",
    value: HEADLINE.unshelteredDelta2023to2024,
    sharePct: HEADLINE.unshelteredShareOfIncreasePct,
    fill: "#b45309",
  },
] as const;

export const DECLINE_SHARE_2025 = [
  {
    id: "sheltered",
    label: "Sheltered decline",
    value: Math.abs(HEADLINE.shelteredDelta2024to2025),
    sharePct: HEADLINE.shelteredShareOf2025DeclinePct,
    fill: "#0f766e",
  },
  {
    id: "unsheltered",
    label: "Unsheltered decline",
    value: Math.abs(HEADLINE.unshelteredDelta2024to2025),
    sharePct: 30.6,
    fill: "#b45309",
  },
] as const;

export type ShelterSplitRow = {
  id: string;
  label: string;
  people: number;
  fill: string;
};

/** 2024 night-of count by project / location type. */
export const SHELTER_SPLIT_2024: ShelterSplitRow[] = [
  { id: "es", label: "Emergency shelter", people: 431_478, fill: "#0e7490" },
  { id: "th", label: "Transitional housing", people: 65_778, fill: "#14b8a6" },
  { id: "un", label: "Unsheltered", people: 274_224, fill: "#b45309" },
];

export type HouseholdMixRow = {
  group: string;
  sheltered: number;
  unsheltered: number;
};

/** 2024 persons by household type and shelter status (CoC PopSub). */
export const HOUSEHOLD_MIX_2024: HouseholdMixRow[] = [
  {
    group: "Families with children",
    sheltered: 212_938 + 27_978,
    unsheltered: 18_557,
  },
  {
    group: "Individuals (no children)",
    sheltered: 431_478 + 65_778 - (212_938 + 27_978) - (1_268 + 441),
    unsheltered: 274_224 - 18_557 - 1_114,
  },
  {
    group: "Child-only households",
    sheltered: 1_268 + 441,
    unsheltered: 1_114,
  },
];

export type StateMixRow = {
  state: string;
  abbr: string;
  total: number;
  sheltered: number;
  unsheltered: number;
  unshelteredSharePct: number;
  yoyChangePct: number;
  confidence: Confidence;
};

/** Selected 2024 state PIT rows spanning high-sheltered and high-unsheltered systems. */
export const STATE_MIX_2024: StateMixRow[] = [
  {
    state: "California",
    abbr: "CA",
    total: 187_084,
    sheltered: 63_110,
    unsheltered: 123_974,
    unshelteredSharePct: 66.3,
    yoyChangePct: 3.1,
    confidence: "disclosed",
  },
  {
    state: "New York",
    abbr: "NY",
    total: 158_019,
    sheltered: 152_381,
    unsheltered: 5_638,
    unshelteredSharePct: 3.6,
    yoyChangePct: 53.1,
    confidence: "disclosed",
  },
  {
    state: "Washington",
    abbr: "WA",
    total: 31_554,
    sheltered: 15_332,
    unsheltered: 16_222,
    unshelteredSharePct: 51.4,
    yoyChangePct: 12.6,
    confidence: "disclosed",
  },
  {
    state: "Florida",
    abbr: "FL",
    total: 31_362,
    sheltered: 14_494,
    unsheltered: 16_868,
    unshelteredSharePct: 53.8,
    yoyChangePct: 2.0,
    confidence: "disclosed",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    total: 29_360,
    sheltered: 27_725,
    unsheltered: 1_635,
    unshelteredSharePct: 5.6,
    yoyChangePct: 53.4,
    confidence: "disclosed",
  },
  {
    state: "Texas",
    abbr: "TX",
    total: 27_987,
    sheltered: 15_648,
    unsheltered: 12_339,
    unshelteredSharePct: 44.1,
    yoyChangePct: 2.2,
    confidence: "disclosed",
  },
  {
    state: "Illinois",
    abbr: "IL",
    total: 25_832,
    sheltered: 23_168,
    unsheltered: 2_664,
    unshelteredSharePct: 10.3,
    yoyChangePct: 116.2,
    confidence: "disclosed",
  },
  {
    state: "Oregon",
    abbr: "OR",
    total: 22_875,
    sheltered: 8_684,
    unsheltered: 14_191,
    unshelteredSharePct: 62.0,
    yoyChangePct: 13.6,
    confidence: "disclosed",
  },
  {
    state: "Colorado",
    abbr: "CO",
    total: 18_715,
    sheltered: 13_924,
    unsheltered: 4_791,
    unshelteredSharePct: 25.6,
    yoyChangePct: 29.6,
    confidence: "disclosed",
  },
  {
    state: "Hawaii",
    abbr: "HI",
    total: 11_637,
    sheltered: 8_200,
    unsheltered: 3_437,
    unshelteredSharePct: 29.5,
    yoyChangePct: 87.0,
    confidence: "estimated",
  },
];

export type WindowId = "all" | "post2015" | "recent";
export type MetricId = "levels" | "share" | "delta";
export type ChangeFocus = "jump2024" | "pullback2025";

export const WINDOW_OPTIONS: { id: WindowId; label: string }[] = [
  { id: "all", label: "2007–2025" },
  { id: "post2015", label: "2015–2025" },
  { id: "recent", label: "2020–2025" },
];

export const METRIC_OPTIONS: { id: MetricId; label: string }[] = [
  { id: "levels", label: "People (levels)" },
  { id: "share", label: "Unsheltered %" },
  { id: "delta", label: "YoY change" },
];

export const CHANGE_FOCUS_OPTIONS: { id: ChangeFocus; label: string }[] = [
  { id: "jump2024", label: "2023→2024 increase" },
  { id: "pullback2025", label: "2024→2025 decline" },
];

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function yearlyForWindow(window: WindowId): YearRow[] {
  const min =
    window === "recent" ? 2020 : window === "post2015" ? 2015 : 2007;
  return YEARLY.filter((r) => r.year >= min);
}

export function stackSeries(window: WindowId) {
  return yearlyForWindow(window)
    .filter((r) => r.unsheltered != null && r.total != null)
    .map((r) => ({
      year: String(r.year),
      sheltered: r.sheltered,
      unsheltered: r.unsheltered as number,
      total: r.total as number,
      unshelteredSharePct:
        Math.round(((r.unsheltered as number) / (r.total as number)) * 1000) / 10,
    }));
}

export function yoyDeltaSeries(window: WindowId) {
  const rows = stackSeries(window);
  const out: {
    year: string;
    shelteredDelta: number;
    unshelteredDelta: number;
    totalDelta: number;
  }[] = [];
  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1];
    const cur = rows[i];
    out.push({
      year: cur.year,
      shelteredDelta: cur.sheltered - prev.sheltered,
      unshelteredDelta: cur.unsheltered - prev.unsheltered,
      totalDelta: cur.total - prev.total,
    });
  }
  return out;
}

export function shareSeries(window: WindowId) {
  return stackSeries(window).map((r) => ({
    year: r.year,
    unshelteredSharePct: r.unshelteredSharePct,
    shelteredSharePct: Math.round((1000 - r.unshelteredSharePct * 10)) / 10,
  }));
}

export function stateSorted(mode: "unshelteredShare" | "total" | "yoy") {
  const rows = [...STATE_MIX_2024];
  if (mode === "total") return rows.sort((a, b) => b.total - a.total);
  if (mode === "yoy") return rows.sort((a, b) => b.yoyChangePct - a.yoyChangePct);
  return rows.sort((a, b) => b.unshelteredSharePct - a.unshelteredSharePct);
}

export function validateHeadlineInvariants(): boolean {
  const h = HEADLINE;
  if (h.year2023Sheltered + h.year2023Unsheltered !== h.year2023Total) return false;
  if (h.year2024Sheltered + h.year2024Unsheltered !== h.year2024Total) return false;
  if (h.year2025Sheltered + h.year2025Unsheltered !== h.year2025Total) return false;
  if (
    h.shelteredDelta2023to2024 + h.unshelteredDelta2023to2024 !==
    h.increase2023to2024
  )
    return false;
  if (
    h.year2024EmergencyShelter + h.year2024TransitionalHousing !==
    h.year2024Sheltered
  )
    return false;
  return true;
}
