/**
 * Endowment payout share of operations vs tuition dependence.
 *
 * Primary: 2025 NACUBO-Commonfund Study of Endowments (NCSE) FY25 —
 * endowment support of operating budgets by size cohort, effective spending
 * rates, median vs mean support. Institution panel joins published FY25
 * financial-report endowment distribution shares with IPEDS-style net tuition
 * / student-charge shares of operating revenue for the largest endowments.
 */

export const HEADLINE = {
  avgEndowmentShareOfOpsPct: 15.2,
  medianEndowmentShareOfOpsPct: 6.1,
  topSizeBandShareOfOpsPct: 20.1,
  topSizeBandLabel: "$1B–$5B",
  over5bShareOfOpsPct: 18.1,
  under100mShareOfOpsPct: 14.8,
  leastReliantBandShareOfOpsPct: 12.1,
  leastReliantBandLabel: "$101M–$250M",
  bufferTopVsLeastPctPts: 8.0,
  meanMinusMedianPctPts: 9.1,
  effectiveSpendRatePct: 4.9,
  totalWithdrawalsBn: 33.4,
  participants: 657,
  harvardEndowmentSharePct: 37,
  yaleEndowmentSharePct: 34,
  yaleNetTuitionSharePct: 8,
  princetonEndowmentSharePct: 67,
  fy: 2025,
} as const;

export const SOURCES = [
  "2025 NACUBO-Commonfund Study of Endowments (NCSE) — FY25 endowment support of operating budgets, effective spending rates, withdrawals ($33.4B), 657 institutions",
  "Commonfund / AGB analysis of NCSE — size-band and institution-type endowment share of operating budgets (FY18–FY25)",
  "Harvard University Financial Report / endowment overview — FY25 endowment distribution $2.5B = 37% of operating revenue",
  "Yale University Financial Report 2024–2025 — endowment spending 34% of operating revenue; net tuition, room & board 8%",
  "Princeton University / PRINCO public releases — endowment ~two-thirds of net annual operating revenue (FY25)",
  "IPEDS Finance Survey — net tuition and fees / student charges as % of core revenues (institution panel cross-check; FY23–FY24 vintages where FY25 not yet filed)",
] as const;

export const SOURCE_NOTE =
  "NCSE 'share of operating budget supported by endowment' is self-reported by volunteer participants and is not identical to GAAP operating-revenue shares in audited financial statements. Institution-panel endowment % figures use each university's published operating-revenue allocation; net tuition shares use financial-report or IPEDS Finance student-charge ratios. Size-band averages can mask extreme tails — the NCSE mean (15.2%) sits far above the median (6.1%).";

export type SizeBandId =
  | "under50"
  | "51to100"
  | "101to250"
  | "251to500"
  | "501to1b"
  | "1bto5b"
  | "over5b";

export type SizeBandRow = {
  id: SizeBandId;
  label: string;
  short: string;
  endowmentShareOfOpsPct: number;
  effectiveSpendRatePct: number;
  color: string;
};

/** FY25 NCSE size cohorts — endowment % of ops + effective spending rate */
export const SIZE_BANDS: SizeBandRow[] = [
  {
    id: "under50",
    label: "Under $50M",
    short: "<$50M",
    endowmentShareOfOpsPct: 14.8,
    effectiveSpendRatePct: 4.7,
    color: "#94a3b8",
  },
  {
    id: "51to100",
    label: "$51M–$100M",
    short: "$51–100M",
    endowmentShareOfOpsPct: 14.8,
    effectiveSpendRatePct: 5.5,
    color: "#64748b",
  },
  {
    id: "101to250",
    label: "$101M–$250M",
    short: "$101–250M",
    endowmentShareOfOpsPct: 12.1,
    effectiveSpendRatePct: 5.0,
    color: "#0ea5e9",
  },
  {
    id: "251to500",
    label: "$251M–$500M",
    short: "$251–500M",
    endowmentShareOfOpsPct: 13.4,
    effectiveSpendRatePct: 4.8,
    color: "#38bdf8",
  },
  {
    id: "501to1b",
    label: "$501M–$1B",
    short: "$501M–1B",
    endowmentShareOfOpsPct: 14.2,
    effectiveSpendRatePct: 4.3,
    color: "#2dd4bf",
  },
  {
    id: "1bto5b",
    label: "$1B–$5B",
    short: "$1–5B",
    endowmentShareOfOpsPct: 20.1,
    effectiveSpendRatePct: 4.5,
    color: "#f59e0b",
  },
  {
    id: "over5b",
    label: "Over $5B",
    short: ">$5B",
    endowmentShareOfOpsPct: 18.1,
    effectiveSpendRatePct: 5.0,
    color: "#e11d48",
  },
];

export type TrendRow = {
  fy: number;
  avgSharePct: number;
  medianSharePct: number;
};

/** NCSE / Commonfund series — average & median endowment support of ops */
export const OPS_SUPPORT_TREND: TrendRow[] = [
  { fy: 2018, avgSharePct: 10.0, medianSharePct: 4.0 },
  { fy: 2019, avgSharePct: 11.6, medianSharePct: 4.4 },
  { fy: 2020, avgSharePct: 12.3, medianSharePct: 4.8 },
  { fy: 2021, avgSharePct: 11.3, medianSharePct: 5.0 },
  { fy: 2022, avgSharePct: 11.4, medianSharePct: 5.2 },
  { fy: 2023, avgSharePct: 10.9, medianSharePct: 5.5 },
  { fy: 2024, avgSharePct: 14.0, medianSharePct: 6.1 },
  { fy: 2025, avgSharePct: 15.2, medianSharePct: 6.1 },
];

export type InstTypeId = "private" | "public" | "irf";

export type InstTypeRow = {
  id: InstTypeId;
  label: string;
  fy25SharePct: number;
  fy24SharePct: number;
  color: string;
};

export const INST_TYPE_SUPPORT: InstTypeRow[] = [
  {
    id: "private",
    label: "Private nonprofit",
    fy25SharePct: 16.8,
    fy24SharePct: 15.5,
    color: "#0f766e",
  },
  {
    id: "public",
    label: "Public",
    fy25SharePct: 13.1,
    fy24SharePct: 8.4,
    color: "#0369a1",
  },
  {
    id: "irf",
    label: "Institutionally-related foundation",
    fy25SharePct: 24.7,
    fy24SharePct: 19.4,
    color: "#b45309",
  },
];

export type ControlId = "private" | "public";

export type InstitutionRow = {
  id: string;
  name: string;
  short: string;
  control: ControlId;
  endowmentBn: number;
  endowmentShareOfOpsPct: number;
  netTuitionShareOfOpsPct: number;
  /** Endowment share − net tuition share (pp) — positive = payout dominates tuition */
  payoutMinusTuitionPp: number;
  /** Approximate endowment-assets percentile among NCSE participants */
  sizeDecile: number;
  sourceNote: string;
};

/**
 * Largest-endowment panel: published FY25 (or nearest) operating-revenue mix.
 * Net tuition = net student charges / operating revenue (financial report or IPEDS).
 */
export const INSTITUTIONS: InstitutionRow[] = [
  {
    id: "princeton",
    name: "Princeton University",
    short: "Princeton",
    control: "private",
    endowmentBn: 36.4,
    endowmentShareOfOpsPct: 67,
    netTuitionShareOfOpsPct: 12,
    payoutMinusTuitionPp: 55,
    sizeDecile: 10,
    sourceNote: "PRINCO / university: endowment ~2/3 of net operating revenue",
  },
  {
    id: "harvard",
    name: "Harvard University",
    short: "Harvard",
    control: "private",
    endowmentBn: 56.9,
    endowmentShareOfOpsPct: 37,
    netTuitionShareOfOpsPct: 21,
    payoutMinusTuitionPp: 16,
    sizeDecile: 10,
    sourceNote: "FY25 financial report: $2.5B distribution = 37% of ops revenue",
  },
  {
    id: "yale",
    name: "Yale University",
    short: "Yale",
    control: "private",
    endowmentBn: 44.2,
    endowmentShareOfOpsPct: 34,
    netTuitionShareOfOpsPct: 8,
    payoutMinusTuitionPp: 26,
    sizeDecile: 10,
    sourceNote: "FY25 financial report: endowment 34%; net TRB 8%",
  },
  {
    id: "stanford",
    name: "Stanford University",
    short: "Stanford",
    control: "private",
    endowmentBn: 40.0,
    endowmentShareOfOpsPct: 22,
    netTuitionShareOfOpsPct: 14,
    payoutMinusTuitionPp: 8,
    sizeDecile: 10,
    sourceNote: "FY24–25 reports / IPEDS cross-check — hospital & SLAC dilute shares",
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    short: "MIT",
    control: "private",
    endowmentBn: 27.4,
    endowmentShareOfOpsPct: 28,
    netTuitionShareOfOpsPct: 11,
    payoutMinusTuitionPp: 17,
    sizeDecile: 10,
    sourceNote: "MIT Report of the Treasurer — endowment distribution vs net tuition",
  },
  {
    id: "penn",
    name: "University of Pennsylvania",
    short: "Penn",
    control: "private",
    endowmentBn: 22.3,
    endowmentShareOfOpsPct: 18,
    netTuitionShareOfOpsPct: 24,
    payoutMinusTuitionPp: -6,
    sizeDecile: 10,
    sourceNote: "Health-system scale lifts tuition/clinical mix vs pure-arts peers",
  },
  {
    id: "columbia",
    name: "Columbia University",
    short: "Columbia",
    control: "private",
    endowmentBn: 14.8,
    endowmentShareOfOpsPct: 16,
    netTuitionShareOfOpsPct: 28,
    payoutMinusTuitionPp: -12,
    sizeDecile: 9,
    sourceNote: "IPEDS Finance + university financials — tuition-heavier mix",
  },
  {
    id: "notre-dame",
    name: "University of Notre Dame",
    short: "Notre Dame",
    control: "private",
    endowmentBn: 20.0,
    endowmentShareOfOpsPct: 26,
    netTuitionShareOfOpsPct: 22,
    payoutMinusTuitionPp: 4,
    sizeDecile: 10,
    sourceNote: "University financial report — balanced payout vs net tuition",
  },
  {
    id: "michigan",
    name: "University of Michigan",
    short: "Michigan",
    control: "public",
    endowmentBn: 19.2,
    endowmentShareOfOpsPct: 9,
    netTuitionShareOfOpsPct: 26,
    payoutMinusTuitionPp: -17,
    sizeDecile: 10,
    sourceNote: "IPEDS + U-M financials — state + tuition dominate vs endowment",
  },
  {
    id: "texas",
    name: "University of Texas System",
    short: "UT System",
    control: "public",
    endowmentBn: 44.0,
    endowmentShareOfOpsPct: 7,
    netTuitionShareOfOpsPct: 22,
    payoutMinusTuitionPp: -15,
    sizeDecile: 10,
    sourceNote: "System-scale PUF/PHF support diluted across many campuses",
  },
  {
    id: "virginia",
    name: "University of Virginia",
    short: "UVA",
    control: "public",
    endowmentBn: 10.0,
    endowmentShareOfOpsPct: 11,
    netTuitionShareOfOpsPct: 30,
    payoutMinusTuitionPp: -19,
    sizeDecile: 9,
    sourceNote: "IPEDS Finance — tuition still the larger operating pillar",
  },
  {
    id: "amherst",
    name: "Amherst College",
    short: "Amherst",
    control: "private",
    endowmentBn: 3.8,
    endowmentShareOfOpsPct: 52,
    netTuitionShareOfOpsPct: 18,
    payoutMinusTuitionPp: 34,
    sizeDecile: 9,
    sourceNote: "Small-enrollment liberal-arts model — payout >> net tuition",
  },
];

export type DecileBufferRow = {
  decile: number;
  label: string;
  meanEndowmentSharePct: number;
  meanNetTuitionSharePct: number;
  bufferVsTopDecilePp: number;
};

/**
 * Synthetic decile profile anchored to NCSE size bands + panel means.
 * Top decile ≈ over-$5B / mega-private arts colleges; D1–D5 ≈ under-$250M.
 */
export const DECILE_BUFFER: DecileBufferRow[] = [
  {
    decile: 10,
    label: "D10 (top)",
    meanEndowmentSharePct: 28.0,
    meanNetTuitionSharePct: 16.0,
    bufferVsTopDecilePp: 0,
  },
  {
    decile: 9,
    label: "D9",
    meanEndowmentSharePct: 20.1,
    meanNetTuitionSharePct: 22.0,
    bufferVsTopDecilePp: -7.9,
  },
  {
    decile: 8,
    label: "D8",
    meanEndowmentSharePct: 16.5,
    meanNetTuitionSharePct: 28.0,
    bufferVsTopDecilePp: -11.5,
  },
  {
    decile: 7,
    label: "D7",
    meanEndowmentSharePct: 14.2,
    meanNetTuitionSharePct: 32.0,
    bufferVsTopDecilePp: -13.8,
  },
  {
    decile: 6,
    label: "D6",
    meanEndowmentSharePct: 13.4,
    meanNetTuitionSharePct: 36.0,
    bufferVsTopDecilePp: -14.6,
  },
  {
    decile: 5,
    label: "D5",
    meanEndowmentSharePct: 12.8,
    meanNetTuitionSharePct: 40.0,
    bufferVsTopDecilePp: -15.2,
  },
  {
    decile: 4,
    label: "D4",
    meanEndowmentSharePct: 12.1,
    meanNetTuitionSharePct: 44.0,
    bufferVsTopDecilePp: -15.9,
  },
  {
    decile: 3,
    label: "D3",
    meanEndowmentSharePct: 13.5,
    meanNetTuitionSharePct: 48.0,
    bufferVsTopDecilePp: -14.5,
  },
  {
    decile: 2,
    label: "D2",
    meanEndowmentSharePct: 14.8,
    meanNetTuitionSharePct: 52.0,
    bufferVsTopDecilePp: -13.2,
  },
  {
    decile: 1,
    label: "D1 (bottom)",
    meanEndowmentSharePct: 14.8,
    meanNetTuitionSharePct: 55.0,
    bufferVsTopDecilePp: -13.2,
  },
];

export function institutionsFiltered(
  control: ControlId | "all",
): InstitutionRow[] {
  if (control === "all") return INSTITUTIONS;
  return INSTITUTIONS.filter((r) => r.control === control);
}

export function scatterPoints(control: ControlId | "all") {
  return institutionsFiltered(control).map((r) => ({
    name: r.short,
    endowmentBn: r.endowmentBn,
    endowmentShare: r.endowmentShareOfOpsPct,
    tuitionShare: r.netTuitionShareOfOpsPct,
    gap: r.payoutMinusTuitionPp,
    control: r.control,
  }));
}

export function sizeBandBars() {
  return SIZE_BANDS.map((b) => ({
    short: b.short,
    share: b.endowmentShareOfOpsPct,
    spendRate: b.effectiveSpendRatePct,
    fill: b.color,
  }));
}

export function decileGapRows() {
  return [...DECILE_BUFFER].reverse().map((d) => ({
    label: d.label,
    endowment: d.meanEndowmentSharePct,
    tuition: d.meanNetTuitionSharePct,
    buffer: d.bufferVsTopDecilePp,
  }));
}
