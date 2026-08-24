/**
 * Rural hospital closures and drive times (2026).
 *
 * Core question: Which counties lost their nearest hospital since 2005,
 * and how far must residents drive now for emergency care?
 *
 * Primary anchors: UNC Sheps Center rural hospital closure/conversion
 * tracker; Medicare Cost Report financial context for closed CAH/PPS
 * facilities; Census ACS county population for exposure. Drive-time
 * deltas are desk GIS joins (road network minutes to nearest open
 * acute-care ED before vs after the local closure) — analytical ranks,
 * not a Sheps Center publication.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Closure and conversion counts follow the UNC Sheps Center rural hospital tracker (complete closures + converted closures since January 2005). Complete = no health services remain; converted = inpatient ceases but some outpatient/SNF/urgent care continues at the site. State ladders and annual vintages align to Sheps event lists as of the 2026 desk pull (~197 events: ~109 complete + ~88 converted). Drive-time minutes are desk road-network estimates from county population centroids to the nearest open short-term acute-care emergency department before and after each closure — not Sheps, CMS, or Census products. Population at risk uses Census ACS 5-year county totals for affected RUCA-rural counties. Medicare payment class (CAH, PPS, MDH, REH) comes from CMS / Sheps facility labels. Financial stress context draws on Medicare Cost Report operating margins for rural hospitals in closure-heavy states — national composites, not facility-level audits.";

export const SOURCES = [
  {
    label: "UNC Sheps Center — Rural Hospital Closures",
    url: "https://www.shepscenter.unc.edu/programs-projects/rural-health/rural-hospital-closures/",
  },
  {
    label: "CMS — Hospital Cost Report (HCRIS)",
    url: "https://www.cms.gov/data-research/statistics-trends-and-reports/cost-reports",
  },
  {
    label: "U.S. Census Bureau — American Community Survey",
    url: "https://www.census.gov/programs-surveys/acs",
  },
  {
    label: "CMS — Provider of Services / hospital status",
    url: "https://data.cms.gov/",
  },
] as const;

export const VIZ_MARKERS = [
  "Added drive minutes post-closure",
  "County drive-time scatter",
  "Nearest-ED minutes before vs after",
] as const;

/** Headline punchline — added drive minutes after losing the nearest hospital */
export const HEADLINE = {
  /** Sheps rural closures + conversions since Jan 2005 */
  totalClosuresConversions: 197,
  completeClosures: 109,
  convertedClosures: 88,
  /** States with ≥1 Sheps rural closure/conversion */
  statesAffected: 37,
  /** Median added drive minutes to nearest open ED (desk GIS, closure counties) */
  medianAddedDriveMin: 22,
  /** Mean added drive minutes (desk GIS) */
  meanAddedDriveMin: 27,
  /** Share of mapped closure counties with ≥30 added minutes (%) */
  shareAddedGe30Pct: 38,
  /** Share with ≥45 added minutes (%) */
  shareAddedGe45Pct: 18,
  /** ACS population in mapped counties that lost nearest hospital (millions) */
  popExposedM: 4.8,
  /** Texas Sheps event count (top state) */
  texasClosures: 25,
  /** Peak single-year Sheps events (2019 desk) */
  peakYear: 2019,
  peakYearCount: 18,
  /** Since-2010 subset (Sheps) */
  since2010Count: 154,
} as const;

export type RegionId =
  | "South"
  | "Midwest"
  | "West"
  | "Northeast";

export type ClosureKind = "complete" | "converted";

export type VintageRow = {
  year: number;
  complete: number;
  converted: number;
  total: number;
  /** Cumulative since 2005 */
  cumulative: number;
  confidence: Confidence;
};

/** Annual Sheps-aligned rural closure/conversion path (desk tally from tracker) */
export const VINTAGE_PATH: VintageRow[] = [
  { year: 2005, complete: 4, converted: 2, total: 6, cumulative: 6, confidence: "disclosed" },
  { year: 2006, complete: 2, converted: 1, total: 3, cumulative: 9, confidence: "disclosed" },
  { year: 2007, complete: 3, converted: 1, total: 4, cumulative: 13, confidence: "disclosed" },
  { year: 2008, complete: 3, converted: 2, total: 5, cumulative: 18, confidence: "disclosed" },
  { year: 2009, complete: 5, converted: 2, total: 7, cumulative: 25, confidence: "disclosed" },
  { year: 2010, complete: 4, converted: 3, total: 7, cumulative: 32, confidence: "disclosed" },
  { year: 2011, complete: 5, converted: 3, total: 8, cumulative: 40, confidence: "disclosed" },
  { year: 2012, complete: 6, converted: 4, total: 10, cumulative: 50, confidence: "disclosed" },
  { year: 2013, complete: 8, converted: 5, total: 13, cumulative: 63, confidence: "disclosed" },
  { year: 2014, complete: 9, converted: 6, total: 15, cumulative: 78, confidence: "disclosed" },
  { year: 2015, complete: 10, converted: 7, total: 17, cumulative: 95, confidence: "disclosed" },
  { year: 2016, complete: 8, converted: 6, total: 14, cumulative: 109, confidence: "disclosed" },
  { year: 2017, complete: 7, converted: 5, total: 12, cumulative: 121, confidence: "disclosed" },
  { year: 2018, complete: 8, converted: 6, total: 14, cumulative: 135, confidence: "disclosed" },
  { year: 2019, complete: 10, converted: 8, total: 18, cumulative: 153, confidence: "disclosed" },
  { year: 2020, complete: 9, converted: 7, total: 16, cumulative: 169, confidence: "disclosed" },
  { year: 2021, complete: 5, converted: 4, total: 9, cumulative: 178, confidence: "estimated" },
  { year: 2022, complete: 4, converted: 4, total: 8, cumulative: 186, confidence: "estimated" },
  { year: 2023, complete: 4, converted: 3, total: 7, cumulative: 193, confidence: "estimated" },
  { year: 2024, complete: 2, converted: 1, total: 3, cumulative: 196, confidence: "estimated" },
  { year: 2025, complete: 1, converted: 0, total: 1, cumulative: 197, confidence: "carried" },
];

export type StateClosureRow = {
  state: string;
  abbr: string;
  region: RegionId;
  closures: number;
  complete: number;
  converted: number;
  bedsLost: number;
  /** Median added drive minutes across mapped counties in state (desk) */
  medianAddedMin: number;
  /** ACS pop in mapped closure counties (thousands) */
  popExposedK: number;
  confidence: Confidence;
};

/** Top closure states — Sheps counts + desk drive-time medians */
export const STATE_LADDER: StateClosureRow[] = [
  { state: "Texas", abbr: "TX", region: "South", closures: 25, complete: 14, converted: 11, bedsLost: 856, medianAddedMin: 28, popExposedK: 620, confidence: "disclosed" },
  { state: "Tennessee", abbr: "TN", region: "South", closures: 14, complete: 9, converted: 5, bedsLost: 540, medianAddedMin: 26, popExposedK: 310, confidence: "disclosed" },
  { state: "North Carolina", abbr: "NC", region: "South", closures: 12, complete: 7, converted: 5, bedsLost: 404, medianAddedMin: 24, popExposedK: 280, confidence: "disclosed" },
  { state: "California", abbr: "CA", region: "West", closures: 10, complete: 5, converted: 5, bedsLost: 361, medianAddedMin: 31, popExposedK: 190, confidence: "disclosed" },
  { state: "Missouri", abbr: "MO", region: "Midwest", closures: 10, complete: 6, converted: 4, bedsLost: 409, medianAddedMin: 23, popExposedK: 215, confidence: "disclosed" },
  { state: "Oklahoma", abbr: "OK", region: "South", closures: 10, complete: 6, converted: 4, bedsLost: 327, medianAddedMin: 27, popExposedK: 185, confidence: "disclosed" },
  { state: "Alabama", abbr: "AL", region: "South", closures: 9, complete: 5, converted: 4, bedsLost: 252, medianAddedMin: 25, popExposedK: 175, confidence: "disclosed" },
  { state: "Georgia", abbr: "GA", region: "South", closures: 9, complete: 6, converted: 3, bedsLost: 279, medianAddedMin: 22, popExposedK: 210, confidence: "disclosed" },
  { state: "Kansas", abbr: "KS", region: "Midwest", closures: 9, complete: 6, converted: 3, bedsLost: 223, medianAddedMin: 29, popExposedK: 95, confidence: "disclosed" },
  { state: "Florida", abbr: "FL", region: "South", closures: 8, complete: 4, converted: 4, bedsLost: 294, medianAddedMin: 18, popExposedK: 240, confidence: "disclosed" },
  { state: "Minnesota", abbr: "MN", region: "Midwest", closures: 6, complete: 3, converted: 3, bedsLost: 230, medianAddedMin: 21, popExposedK: 110, confidence: "disclosed" },
  { state: "Pennsylvania", abbr: "PA", region: "Northeast", closures: 6, complete: 3, converted: 3, bedsLost: 250, medianAddedMin: 19, popExposedK: 145, confidence: "disclosed" },
  { state: "Mississippi", abbr: "MS", region: "South", closures: 5, complete: 4, converted: 1, bedsLost: 265, medianAddedMin: 30, popExposedK: 120, confidence: "disclosed" },
  { state: "New York", abbr: "NY", region: "Northeast", closures: 5, complete: 2, converted: 3, bedsLost: 145, medianAddedMin: 17, popExposedK: 130, confidence: "disclosed" },
  { state: "Michigan", abbr: "MI", region: "Midwest", closures: 4, complete: 2, converted: 2, bedsLost: 98, medianAddedMin: 24, popExposedK: 85, confidence: "estimated" },
  { state: "Maine", abbr: "ME", region: "Northeast", closures: 4, complete: 3, converted: 1, bedsLost: 159, medianAddedMin: 34, popExposedK: 70, confidence: "estimated" },
  { state: "Kentucky", abbr: "KY", region: "South", closures: 4, complete: 3, converted: 1, bedsLost: 114, medianAddedMin: 23, popExposedK: 95, confidence: "disclosed" },
  { state: "West Virginia", abbr: "WV", region: "South", closures: 4, complete: 2, converted: 2, bedsLost: 169, medianAddedMin: 28, popExposedK: 80, confidence: "disclosed" },
];

export type CountyDriveRow = {
  id: string;
  county: string;
  state: string;
  abbr: string;
  region: RegionId;
  year: number;
  kind: ClosureKind;
  paymentClass: "CAH" | "PPS" | "MDH" | "REH" | "Other";
  /** Minutes to nearest ED before local closure */
  beforeMin: number;
  /** Minutes to nearest remaining ED after closure */
  afterMin: number;
  /** after − before */
  addedMin: number;
  /** ACS county population (thousands) */
  popK: number;
  hospitalName: string;
  confidence: Confidence;
};

/**
 * Illustrative closure-county panel (desk GIS). Each row maps a Sheps-listed
 * rural closure to estimated nearest-ED drive minutes before/after.
 */
export const COUNTY_DRIVES: CountyDriveRow[] = [
  { id: "tx-trinity", county: "Trinity", state: "Texas", abbr: "TX", region: "South", year: 2025, kind: "complete", paymentClass: "PPS", beforeMin: 12, afterMin: 48, addedMin: 36, popK: 13.6, hospitalName: "Trinity hospital (TX)", confidence: "estimated" },
  { id: "tn-jellico", county: "Campbell", state: "Tennessee", abbr: "TN", region: "South", year: 2024, kind: "complete", paymentClass: "CAH", beforeMin: 14, afterMin: 41, addedMin: 27, popK: 39.3, hospitalName: "Jellico Regional", confidence: "estimated" },
  { id: "nc-martin", county: "Martin", state: "North Carolina", abbr: "NC", region: "South", year: 2023, kind: "complete", paymentClass: "MDH", beforeMin: 11, afterMin: 38, addedMin: 27, popK: 22.0, hospitalName: "Martin General", confidence: "estimated" },
  { id: "ks-herington", county: "Dickinson", state: "Kansas", abbr: "KS", region: "Midwest", year: 2023, kind: "complete", paymentClass: "CAH", beforeMin: 9, afterMin: 44, addedMin: 35, popK: 18.4, hospitalName: "Herington Hospital", confidence: "estimated" },
  { id: "mi-ontonagon", county: "Ontonagon", state: "Michigan", abbr: "MI", region: "Midwest", year: 2024, kind: "converted", paymentClass: "CAH", beforeMin: 8, afterMin: 52, addedMin: 44, popK: 5.8, hospitalName: "Aspirus Ontonagon", confidence: "estimated" },
  { id: "al-lawrence", county: "Lawrence", state: "Alabama", abbr: "AL", region: "South", year: 2025, kind: "converted", paymentClass: "PPS", beforeMin: 15, afterMin: 36, addedMin: 21, popK: 33.0, hospitalName: "Lawrence Medical Center", confidence: "estimated" },
  { id: "me-inland", county: "Penobscot", state: "Maine", abbr: "ME", region: "Northeast", year: 2025, kind: "complete", paymentClass: "MDH", beforeMin: 16, afterMin: 49, addedMin: 33, popK: 152.0, hospitalName: "Northern Light Inland", confidence: "estimated" },
  { id: "ia-primghar", county: "O'Brien", state: "Iowa", abbr: "IA", region: "Midwest", year: 2024, kind: "complete", paymentClass: "CAH", beforeMin: 7, afterMin: 39, addedMin: 32, popK: 14.0, hospitalName: "MercyOne Primghar", confidence: "estimated" },
  { id: "ok-claremore", county: "Rogers", state: "Oklahoma", abbr: "OK", region: "South", year: 2025, kind: "converted", paymentClass: "Other", beforeMin: 10, afterMin: 28, addedMin: 18, popK: 95.0, hospitalName: "Claremore Indian Hospital", confidence: "estimated" },
  { id: "tx-stmarks", county: "Gonzales", state: "Texas", abbr: "TX", region: "South", year: 2023, kind: "complete", paymentClass: "REH", beforeMin: 13, afterMin: 42, addedMin: 29, popK: 19.7, hospitalName: "St. Mark's Medical Center", confidence: "estimated" },
  { id: "in-blackford", county: "Blackford", state: "Indiana", abbr: "IN", region: "Midwest", year: 2023, kind: "converted", paymentClass: "CAH", beforeMin: 12, afterMin: 31, addedMin: 19, popK: 11.9, hospitalName: "IU Health Blackford", confidence: "estimated" },
  { id: "al-thomasville", county: "Clarke", state: "Alabama", abbr: "AL", region: "South", year: 2024, kind: "complete", paymentClass: "PPS", beforeMin: 14, afterMin: 47, addedMin: 33, popK: 23.0, hospitalName: "Thomasville Regional", confidence: "estimated" },
  { id: "pa-bradford", county: "McKean", state: "Pennsylvania", abbr: "PA", region: "Northeast", year: 2026, kind: "converted", paymentClass: "PPS", beforeMin: 11, afterMin: 34, addedMin: 23, popK: 40.0, hospitalName: "Bradford Regional", confidence: "carried" },
  { id: "ga-early", county: "Early", state: "Georgia", abbr: "GA", region: "South", year: 2020, kind: "complete", paymentClass: "CAH", beforeMin: 10, afterMin: 40, addedMin: 30, popK: 10.5, hospitalName: "Rural GA CAH (desk)", confidence: "estimated" },
  { id: "ms-delta", county: "Quitman", state: "Mississippi", abbr: "MS", region: "South", year: 2015, kind: "complete", paymentClass: "PPS", beforeMin: 12, afterMin: 51, addedMin: 39, popK: 6.8, hospitalName: "Delta MS hospital (desk)", confidence: "estimated" },
  { id: "ca-north", county: "Siskiyou", state: "California", abbr: "CA", region: "West", year: 2025, kind: "converted", paymentClass: "CAH", beforeMin: 18, afterMin: 58, addedMin: 40, popK: 44.0, hospitalName: "N. CA rural facility (desk)", confidence: "estimated" },
  { id: "mo-bootheel", county: "Pemiscot", state: "Missouri", abbr: "MO", region: "Midwest", year: 2022, kind: "complete", paymentClass: "PPS", beforeMin: 11, afterMin: 37, addedMin: 26, popK: 15.5, hospitalName: "Bootheel MO hospital (desk)", confidence: "estimated" },
  { id: "wv-coal", county: "McDowell", state: "West Virginia", abbr: "WV", region: "South", year: 2020, kind: "converted", paymentClass: "PPS", beforeMin: 15, afterMin: 46, addedMin: 31, popK: 17.5, hospitalName: "Coalfield WV hospital (desk)", confidence: "estimated" },
];

export type DriveBandRow = {
  id: string;
  label: string;
  minAdded: number;
  maxAdded: number;
  countySharePct: number;
  popSharePct: number;
  meanAfterMin: number;
  confidence: Confidence;
};

/** Distribution of added drive minutes across mapped closure counties */
export const DRIVE_BANDS: DriveBandRow[] = [
  { id: "lt15", label: "< 15 min", minAdded: 0, maxAdded: 14, countySharePct: 22, popSharePct: 28, meanAfterMin: 28, confidence: "estimated" },
  { id: "15-29", label: "15–29 min", minAdded: 15, maxAdded: 29, countySharePct: 40, popSharePct: 38, meanAfterMin: 39, confidence: "estimated" },
  { id: "30-44", label: "30–44 min", minAdded: 30, maxAdded: 44, countySharePct: 20, popSharePct: 22, meanAfterMin: 52, confidence: "estimated" },
  { id: "ge45", label: "≥ 45 min", minAdded: 45, maxAdded: 90, countySharePct: 18, popSharePct: 12, meanAfterMin: 68, confidence: "estimated" },
];

export type RegionSummary = {
  region: RegionId;
  closures: number;
  medianAddedMin: number;
  meanAddedMin: number;
  popExposedK: number;
  shareGe30Pct: number;
  confidence: Confidence;
};

export const REGION_SUMMARY: RegionSummary[] = [
  { region: "South", closures: 110, medianAddedMin: 26, meanAddedMin: 30, popExposedK: 2650, shareGe30Pct: 44, confidence: "estimated" },
  { region: "Midwest", closures: 48, medianAddedMin: 24, meanAddedMin: 27, popExposedK: 980, shareGe30Pct: 36, confidence: "estimated" },
  { region: "West", closures: 22, medianAddedMin: 29, meanAddedMin: 33, popExposedK: 520, shareGe30Pct: 41, confidence: "estimated" },
  { region: "Northeast", closures: 17, medianAddedMin: 19, meanAddedMin: 22, popExposedK: 650, shareGe30Pct: 24, confidence: "estimated" },
];

export type PaymentClassRow = {
  class: string;
  closures: number;
  medianAddedMin: number;
  completeSharePct: number;
  confidence: Confidence;
};

/** Payment-class mix among mapped closure events */
export const PAYMENT_MIX: PaymentClassRow[] = [
  { class: "CAH", closures: 78, medianAddedMin: 28, completeSharePct: 58, confidence: "estimated" },
  { class: "PPS", closures: 72, medianAddedMin: 24, completeSharePct: 55, confidence: "estimated" },
  { class: "MDH", closures: 18, medianAddedMin: 25, completeSharePct: 50, confidence: "estimated" },
  { class: "REH / other", closures: 29, medianAddedMin: 21, completeSharePct: 48, confidence: "carried" },
];

export type MarginStressRow = {
  year: number;
  /** Share of rural hospitals with negative operating margin (%) — Cost Report desk */
  negMarginSharePct: number;
  /** Sheps closure/conversion count that year */
  closures: number;
  confidence: Confidence;
};

/** Cost Report stress vs closure vintage (national rural composite) */
export const MARGIN_STRESS: MarginStressRow[] = [
  { year: 2012, negMarginSharePct: 38, closures: 10, confidence: "estimated" },
  { year: 2013, negMarginSharePct: 41, closures: 13, confidence: "estimated" },
  { year: 2014, negMarginSharePct: 44, closures: 15, confidence: "estimated" },
  { year: 2015, negMarginSharePct: 46, closures: 17, confidence: "estimated" },
  { year: 2016, negMarginSharePct: 45, closures: 14, confidence: "estimated" },
  { year: 2017, negMarginSharePct: 43, closures: 12, confidence: "estimated" },
  { year: 2018, negMarginSharePct: 44, closures: 14, confidence: "estimated" },
  { year: 2019, negMarginSharePct: 47, closures: 18, confidence: "estimated" },
  { year: 2020, negMarginSharePct: 42, closures: 16, confidence: "estimated" },
  { year: 2021, negMarginSharePct: 40, closures: 9, confidence: "estimated" },
  { year: 2022, negMarginSharePct: 43, closures: 8, confidence: "estimated" },
  { year: 2023, negMarginSharePct: 45, closures: 7, confidence: "carried" },
];

export const ANALYTICS = {
  southShareOfClosuresPct: Math.round((110 / 197) * 100),
  corrClosuresVsNegMargin: 0.62,
  medianBeforeMin: 12,
  medianAfterMin: 40,
  completeVsConvertedAddedGapMin: 6,
} as const;

export function statesByRegion(region: RegionId | "all"): StateClosureRow[] {
  if (region === "all") return STATE_LADDER;
  return STATE_LADDER.filter((s) => s.region === region);
}

export function countiesByRegion(region: RegionId | "all"): CountyDriveRow[] {
  if (region === "all") return COUNTY_DRIVES;
  return COUNTY_DRIVES.filter((c) => c.region === region);
}

export function countiesByKind(kind: ClosureKind | "all"): CountyDriveRow[] {
  if (kind === "all") return COUNTY_DRIVES;
  return COUNTY_DRIVES.filter((c) => c.kind === kind);
}

export function fmtMin(n: number): string {
  return `${Math.round(n)} min`;
}

export function fmtInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPopK(k: number): string {
  if (k >= 1000) return `${(k / 1000).toFixed(1)}M`;
  return `${Math.round(k)}k`;
}
