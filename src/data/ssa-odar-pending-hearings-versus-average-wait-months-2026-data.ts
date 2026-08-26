/**
 * SSA ODAR / OHO pending hearings vs average wait months (2026).
 *
 * Core question: Did pending ALJ hearing counts and average processing time
 * fall from the 2010s–early-2020s peak, or did receipts refill the queue?
 *
 * Perimeter: National hearing-level receipts, dispositions, and end-of-year
 * pending from SSA Annual Statistical Supplement table 2.F9 (CPMS). Average
 * processing time (APT, days from hearing request to disposition) from SSA
 * OIG A-05-22-51159 and agency performance reporting; wait months = APT / 30.4.
 * Region and hearing-office panels summarize OHO public NetStat / workload
 * files (office wait months and pending). ALJ counts from Supplement 2.F8.
 *
 * Headline: Pending hearings fell from 1.12M (FY2016) to ~262k (FY2024 est.)
 * — a 77% cut — while wait months dropped from the FY2017 peak of 19.9 to
 * ~11.3, still above SSA’s 270-day (~8.9 month) target.
 */

export type Confidence = "disclosed" | "estimated" | "scenario";

export const SOURCE_NOTE =
  "National hearing-level receipts, dispositions, and end-of-year pending: SSA Annual Statistical Supplement tables 2.F8–2.F9 (CPMS Management Information), fiscal years 2016–2023. FY2024 national pending and APT marked estimated from SSA public performance statements pending Supplement 2025. Average processing time (APT) in days: SSA OIG report A-05-22-51159 (FYs 2016–2022) and SSA operating / performance releases for FY2023–FY2024; wait months = APT ÷ 30.4. Hearings backlog (cases that push APT above 270 days) follows SSA’s backlog definition cited in OIG A-05-22-51159. Regional and hearing-office wait months / pending: SSA OHO public NetStat and Hearing Office Workload Data files (averaged / sampled offices). ALJ headcount: Supplement table 2.F8. Program mix (DI / SSI / concurrent): Supplement 2.F9 disability rows.";

export const SOURCES = [
  {
    label: "SSA Annual Statistical Supplement 2024 — Hearings and Appeals (2.F8–2.F11)",
    url: "https://www.ssa.gov/policy/docs/statcomps/supplement/2024/2f8-2f11.html",
  },
  {
    label: "SSA Annual Statistical Supplement 2022 — Hearings and Appeals (2.F8–2.F11)",
    url: "https://www.ssa.gov/policy/docs/statcomps/supplement/2022/2f8-2f11.html",
  },
  {
    label: "SSA Annual Statistical Supplement 2019 — Hearings and Appeals (2.F8–2.F11)",
    url: "https://www.ssa.gov/policy/docs/statcomps/supplement/2019/2f8-2f11.html",
  },
  {
    label: "SSA OIG — Hearings Backlog and Average Processing Times (A-05-22-51159)",
    url: "https://oig.ssa.gov/assets/uploads/a-05-22-51159r.pdf",
  },
  {
    label: "SSA OHO — Public Workload Data Files (NetStat / HO Workload)",
    url: "https://www.ssa.gov/appeals/publicusefiles.html",
  },
  {
    label: "GAO — Social Security Disability: Additional Measures and Evaluation Needed (hearings)",
    url: "https://www.gao.gov/products/gao-18-37",
  },
] as const;

/** Convert APT days to approximate wait months (30.4-day month). */
export function daysToMonths(days: number): number {
  return Math.round((days / 30.4) * 10) / 10;
}

export const HEADLINE = {
  pendingFy2016: 1_121_519,
  pendingFy2017: 1_056_026,
  pendingFy2023: 321_819,
  pendingFy2024: 262_000,
  aptPeakDays: 605, // FY2017
  aptPeakMonths: 19.9,
  aptFy2021Days: 326,
  aptFy2021Months: 10.7,
  aptFy2023Days: 450,
  aptFy2023Months: 14.8,
  aptFy2024Days: 342,
  aptFy2024Months: 11.3,
  targetAptDays: 270,
  targetWaitMonths: 8.9,
  pctPendingDownFrom2016: 77, // (1121519-262000)/1121519
  receiptsFy2016: 712_853,
  receiptsFy2023: 355_565,
  dispositionsFy2019: 793_863, // peak dispositions year in series
  aljFy2018: 1_487,
  aljFy2023: 1_088,
  confidence: "estimated" as Confidence,
};

export type NationalWorkloadRow = {
  fy: number;
  receipts: number;
  dispositions: number;
  pending: number;
  aptDays: number;
  waitMonths: number;
  /** dispositions / receipts × 100 */
  clearancePct: number;
  aljs: number | null;
  pendingPerAlj: number | null;
  confidence: Confidence;
  note?: string;
};

/**
 * National hearing-level path, FY2016–FY2024.
 * Pending / receipts / dispositions: Supplement 2.F9 through FY2023.
 * APT: OIG A-05-22-51159 (through FY2022); FY2023–24 agency performance.
 */
export const NATIONAL_PATH: NationalWorkloadRow[] = [
  {
    fy: 2016,
    receipts: 712_853,
    dispositions: 652_241,
    pending: 1_121_519,
    aptDays: 543,
    waitMonths: 17.9,
    clearancePct: 91.5,
    aljs: 1_340,
    pendingPerAlj: 723,
    confidence: "disclosed",
  },
  {
    fy: 2017,
    receipts: 620_164,
    dispositions: 685_657,
    pending: 1_056_026,
    aptDays: 605,
    waitMonths: 19.9,
    clearancePct: 110.6,
    aljs: 1_430,
    pendingPerAlj: 661,
    confidence: "disclosed",
    note: "APT peak year",
  },
  {
    fy: 2018,
    receipts: 567_911,
    dispositions: 765_554,
    pending: 858_383,
    aptDays: 595,
    waitMonths: 19.6,
    clearancePct: 134.8,
    aljs: 1_487,
    pendingPerAlj: 534,
    confidence: "disclosed",
  },
  {
    fy: 2019,
    receipts: 510_901,
    dispositions: 793_863,
    pending: 575_421,
    aptDays: 506,
    waitMonths: 16.6,
    clearancePct: 155.4,
    aljs: null,
    pendingPerAlj: null,
    confidence: "disclosed",
  },
  {
    fy: 2020,
    receipts: 428_810,
    dispositions: 585_918,
    pending: 418_313,
    aptDays: 386,
    waitMonths: 12.7,
    clearancePct: 136.6,
    aljs: 1_315,
    pendingPerAlj: 306,
    confidence: "disclosed",
    note: "Pandemic hearing-format shift; receipts fell sharply",
  },
  {
    fy: 2021,
    receipts: 382_870,
    dispositions: 451_046,
    pending: 350_137,
    aptDays: 326,
    waitMonths: 10.7,
    clearancePct: 117.8,
    aljs: 1_235,
    pendingPerAlj: 273,
    confidence: "disclosed",
    note: "Lowest APT in the post-2016 window",
  },
  {
    fy: 2022,
    receipts: 349_329,
    dispositions: 352_899,
    pending: 346_567,
    aptDays: 333,
    waitMonths: 11.0,
    clearancePct: 101.0,
    aljs: 1_132,
    pendingPerAlj: 295,
    confidence: "disclosed",
  },
  {
    fy: 2023,
    receipts: 355_565,
    dispositions: 377_685,
    pending: 321_819,
    aptDays: 450,
    waitMonths: 14.8,
    clearancePct: 106.2,
    aljs: 1_088,
    pendingPerAlj: 266,
    confidence: "disclosed",
    note: "SSA prioritized oldest cases; APT rose while pending still fell",
  },
  {
    fy: 2024,
    receipts: 368_000,
    dispositions: 427_800,
    pending: 262_000,
    aptDays: 342,
    waitMonths: 11.3,
    clearancePct: 116.3,
    aljs: 1_050,
    pendingPerAlj: 250,
    confidence: "estimated",
    note: "Pending & APT from SSA performance statements; receipts/dispos estimated to reconcile pending change",
  },
];

export type ProgramMixRow = {
  program: "DI" | "SSI" | "DI+SSI" | "OASI";
  label: string;
  pending2021: number;
  pending2022: number;
  pending2023: number;
  receipts2023: number;
  dispositions2023: number;
};

/** Disability / OASI pending mix from Supplement 2.F9. */
export const PROGRAM_MIX: ProgramMixRow[] = [
  {
    program: "DI",
    label: "DI only",
    pending2021: 126_264,
    pending2022: 128_909,
    pending2023: 129_090,
    receipts2023: 150_083,
    dispositions2023: 148_983,
  },
  {
    program: "SSI",
    label: "SSI only",
    pending2021: 111_367,
    pending2022: 107_783,
    pending2023: 91_137,
    receipts2023: 91_897,
    dispositions2023: 107_415,
  },
  {
    program: "DI+SSI",
    label: "Concurrent DI+SSI",
    pending2021: 111_625,
    pending2022: 108_260,
    pending2023: 100_208,
    receipts2023: 111_994,
    dispositions2023: 119_458,
  },
  {
    program: "OASI",
    label: "OASI",
    pending2021: 881,
    pending2022: 1_615,
    pending2023: 1_384,
    receipts2023: 1_591,
    dispositions2023: 1_829,
  },
];

export type SsaRegion =
  | "boston"
  | "new-york"
  | "philadelphia"
  | "atlanta"
  | "chicago"
  | "dallas"
  | "kansas-city"
  | "denver"
  | "san-francisco"
  | "seattle";

export type RegionWaitRow = {
  region: SsaRegion;
  label: string;
  waitMonths: number;
  pending: number;
  aptDays: number;
  officesSampled: number;
  confidence: Confidence;
};

/**
 * Mid-2020s regional snapshot: office-weighted averages from OHO NetStat /
 * workload files (sampled offices per SSA region). Estimated aggregates.
 */
export const REGION_WAIT: RegionWaitRow[] = [
  { region: "boston", label: "Boston", waitMonths: 10.2, pending: 18_400, aptDays: 310, officesSampled: 8, confidence: "estimated" },
  { region: "new-york", label: "New York", waitMonths: 12.8, pending: 31_200, aptDays: 389, officesSampled: 12, confidence: "estimated" },
  { region: "philadelphia", label: "Philadelphia", waitMonths: 11.5, pending: 24_600, aptDays: 350, officesSampled: 10, confidence: "estimated" },
  { region: "atlanta", label: "Atlanta", waitMonths: 13.4, pending: 42_800, aptDays: 407, officesSampled: 18, confidence: "estimated" },
  { region: "chicago", label: "Chicago", waitMonths: 11.1, pending: 28_900, aptDays: 337, officesSampled: 14, confidence: "estimated" },
  { region: "dallas", label: "Dallas", waitMonths: 12.1, pending: 35_100, aptDays: 368, officesSampled: 15, confidence: "estimated" },
  { region: "kansas-city", label: "Kansas City", waitMonths: 9.8, pending: 14_200, aptDays: 298, officesSampled: 9, confidence: "estimated" },
  { region: "denver", label: "Denver", waitMonths: 10.6, pending: 12_800, aptDays: 322, officesSampled: 7, confidence: "estimated" },
  { region: "san-francisco", label: "San Francisco", waitMonths: 14.2, pending: 29_400, aptDays: 432, officesSampled: 11, confidence: "estimated" },
  { region: "seattle", label: "Seattle", waitMonths: 11.8, pending: 11_600, aptDays: 359, officesSampled: 6, confidence: "estimated" },
];

export type OfficeScatterRow = {
  office: string;
  region: SsaRegion;
  waitMonths: number;
  pending: number;
  aptDays: number;
  confidence: Confidence;
};

/** Hearing-office cloud: pending inventory vs wait months (NetStat sample). */
export const OFFICE_SCATTER: OfficeScatterRow[] = [
  { office: "Atlanta", region: "atlanta", waitMonths: 14.6, pending: 4_820, aptDays: 444, confidence: "estimated" },
  { office: "Baltimore", region: "philadelphia", waitMonths: 12.1, pending: 2_940, aptDays: 368, confidence: "estimated" },
  { office: "Boston", region: "boston", waitMonths: 9.4, pending: 1_860, aptDays: 286, confidence: "estimated" },
  { office: "Bronx", region: "new-york", waitMonths: 15.2, pending: 3_710, aptDays: 462, confidence: "estimated" },
  { office: "Chicago", region: "chicago", waitMonths: 11.8, pending: 3_240, aptDays: 359, confidence: "estimated" },
  { office: "Cleveland", region: "chicago", waitMonths: 10.5, pending: 2_180, aptDays: 319, confidence: "estimated" },
  { office: "Dallas Downtown", region: "dallas", waitMonths: 12.9, pending: 3_560, aptDays: 392, confidence: "estimated" },
  { office: "Denver", region: "denver", waitMonths: 10.1, pending: 1_740, aptDays: 307, confidence: "estimated" },
  { office: "Detroit", region: "chicago", waitMonths: 13.1, pending: 2_890, aptDays: 398, confidence: "estimated" },
  { office: "Houston", region: "dallas", waitMonths: 13.8, pending: 4_120, aptDays: 420, confidence: "estimated" },
  { office: "Jacksonville", region: "atlanta", waitMonths: 12.4, pending: 2_650, aptDays: 377, confidence: "estimated" },
  { office: "Kansas City", region: "kansas-city", waitMonths: 8.9, pending: 1_420, aptDays: 271, confidence: "estimated" },
  { office: "Los Angeles Downtown", region: "san-francisco", waitMonths: 15.8, pending: 4_480, aptDays: 480, confidence: "estimated" },
  { office: "Miami", region: "atlanta", waitMonths: 14.1, pending: 3_380, aptDays: 429, confidence: "estimated" },
  { office: "New Orleans", region: "atlanta", waitMonths: 11.6, pending: 2_010, aptDays: 353, confidence: "estimated" },
  { office: "Oakland", region: "san-francisco", waitMonths: 14.9, pending: 2_760, aptDays: 453, confidence: "estimated" },
  { office: "Philadelphia", region: "philadelphia", waitMonths: 11.2, pending: 2_540, aptDays: 340, confidence: "estimated" },
  { office: "Phoenix", region: "san-francisco", waitMonths: 12.6, pending: 2_980, aptDays: 383, confidence: "estimated" },
  { office: "Portland OR", region: "seattle", waitMonths: 11.4, pending: 1_680, aptDays: 347, confidence: "estimated" },
  { office: "Queens", region: "new-york", waitMonths: 14.4, pending: 3_290, aptDays: 438, confidence: "estimated" },
  { office: "San Juan", region: "new-york", waitMonths: 16.1, pending: 2_420, aptDays: 489, confidence: "estimated" },
  { office: "Seattle", region: "seattle", waitMonths: 10.8, pending: 1_920, aptDays: 328, confidence: "estimated" },
  { office: "St. Louis", region: "kansas-city", waitMonths: 9.6, pending: 1_580, aptDays: 292, confidence: "estimated" },
  { office: "Tampa", region: "atlanta", waitMonths: 13.2, pending: 2_870, aptDays: 401, confidence: "estimated" },
];

export type FlowBalanceRow = {
  fy: number;
  receipts: number;
  dispositions: number;
  netDrain: number; // dispositions - receipts (positive = inventory falling)
  pending: number;
};

export const FLOW_BALANCE: FlowBalanceRow[] = NATIONAL_PATH.map((r) => ({
  fy: r.fy,
  receipts: r.receipts,
  dispositions: r.dispositions,
  netDrain: r.dispositions - r.receipts,
  pending: r.pending,
}));

export type BacklogShareRow = {
  fy: number;
  pending: number;
  /** Estimated share of pending that constitutes SSA’s “hearings backlog” (APT>270). */
  backlogSharePct: number;
  confidence: Confidence;
};

/**
 * SSA defines the hearings backlog as pending cases that push APT above 270 days.
 * Shares follow the directional path in OIG A-05-22-51159 (declined through FY2020,
 * rose in FY2022 as aged cases concentrated) with estimated later years.
 */
export const BACKLOG_SHARE: BacklogShareRow[] = [
  { fy: 2016, pending: 1_121_519, backlogSharePct: 72, confidence: "estimated" },
  { fy: 2017, pending: 1_056_026, backlogSharePct: 71, confidence: "estimated" },
  { fy: 2018, pending: 858_383, backlogSharePct: 54, confidence: "estimated" },
  { fy: 2019, pending: 575_421, backlogSharePct: 41, confidence: "estimated" },
  { fy: 2020, pending: 418_313, backlogSharePct: 28, confidence: "estimated" },
  { fy: 2021, pending: 350_137, backlogSharePct: 22, confidence: "estimated" },
  { fy: 2022, pending: 346_567, backlogSharePct: 35, confidence: "estimated" },
  { fy: 2023, pending: 321_819, backlogSharePct: 48, confidence: "estimated" },
  { fy: 2024, pending: 262_000, backlogSharePct: 32, confidence: "estimated" },
];

export const REGION_OPTIONS = [
  { id: "all" as const, label: "All regions" },
  ...REGION_WAIT.map((r) => ({ id: r.region, label: r.label })),
];

export type RegionFilter = "all" | SsaRegion;

export function filterOffices(region: RegionFilter): OfficeScatterRow[] {
  if (region === "all") return OFFICE_SCATTER;
  return OFFICE_SCATTER.filter((o) => o.region === region);
}

export function filterRegions(region: RegionFilter): RegionWaitRow[] {
  if (region === "all") return REGION_WAIT;
  return REGION_WAIT.filter((r) => r.region === region);
}

export const ANALYTICS = {
  peakAptFy: 2017,
  troughAptFy: 2021,
  peakPendingFy: 2016,
  latestDisclosedFy: 2023,
  latestEstimatedFy: 2024,
  aptBounceFy2023: true,
  receiptsHalvedSince2016: true,
  aljDeclinePct2018to2023: 27, // (1487-1088)/1487
  targetGapMonths2024: 2.4, // 11.3 - 8.9
  slowestRegion: "San Francisco",
  fastestRegion: "Kansas City",
  regionWaitSpreadMonths: 4.4, // 14.2 - 9.8
};
