/**
 * US money market funds vs bank deposits — cash parking after the rate-hike cycle.
 * Sources: ICI weekly MMF assets; ICI Fact Book year-end tables; Fed FEDS Note
 * (Im/Li/Wang, Nov 2025) on deposit–MMF substitution (H.8 deposits excl. large time).
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "ICI weekly Money Market Fund Assets (week ended 29 Jul 2026) and ICI Fact Book year-end taxable totals; Fed FEDS Note “What Drives the Substitution Between Bank Deposits and Money Market Funds?” (Nov 2025) for deposits excl. large time deposits (~$15T as of May 2025). Yields: ICI Fact Book YE 2025 taxable MMF average vs money-market deposit accounts. Deposit path points outside May 2025 are estimated from the note’s narrative and H.8 trends — labeled as such.";

export const SOURCES = [
  {
    label: "ICI — Money Market Fund Assets (weekly)",
    url: "https://www.ici.org/research/stats/mmf/",
  },
  {
    label: "Fed FEDS Note — deposit vs MMF substitution (Nov 2025)",
    url: "https://www.federalreserve.gov/econres/notes/feds-notes/what-drives-the-substitution-between-bank-deposits-and-money-market-funds-20251106.html",
  },
  {
    label: "ICI Investment Company Fact Book (MMF tables)",
    url: "https://www.ici.org/system/files/2025-05/2025_factbook.pdf",
  },
] as const;

export const HEADLINE = {
  mmfTotalTn: 7.85,
  mmfAsOf: "29 Jul 2026",
  governmentSharePct: 82.4,
  mmfYieldPct: 3.9,
  depositYieldPct: 0.6,
  yieldGapPp: 3.3,
  depositsMay2025Tn: 15.0,
  mmfMay2025Tn: 7.0,
  substitutionBeta: -0.213,
} as const;

/** Latest ICI weekly snapshot — week ended 29 Jul 2026 ($ billions) */
export const WEEKLY_SNAPSHOT_2026_07_29 = {
  asOf: "2026-07-29",
  governmentBn: 6472.66,
  primeBn: 1231.13,
  taxExemptBn: 150.14,
  totalBn: 7853.92,
  retailBn: 3077.83,
  institutionalBn: 4776.1,
  confidence: "disclosed" as Confidence,
};

export type YearEndComposition = {
  year: number;
  governmentTn: number;
  primeTn: number;
  taxExemptTn: number;
  totalTn: number;
  retailTn: number;
  institutionalTn: number;
  confidence: Confidence;
  note?: string;
};

/** ICI Fact Book taxable year-end totals (+ tax-exempt where disclosed). 2025 from Fact Book YE; 2026 = latest weekly. */
export const YEAR_END_COMPOSITION: YearEndComposition[] = [
  {
    year: 2019,
    governmentTn: 2.72,
    primeTn: 0.774,
    taxExemptTn: 0.138,
    totalTn: 3.632,
    retailTn: 1.37,
    institutionalTn: 2.262,
    confidence: "disclosed",
  },
  {
    year: 2021,
    governmentTn: 4.228,
    primeTn: 0.441,
    taxExemptTn: 0.087,
    totalTn: 4.756,
    retailTn: 1.48,
    institutionalTn: 3.276,
    confidence: "disclosed",
  },
  {
    year: 2022,
    governmentTn: 4.05,
    primeTn: 0.62,
    taxExemptTn: 0.11,
    totalTn: 4.789,
    retailTn: 1.75,
    institutionalTn: 3.04,
    confidence: "estimated",
    note: "Total disclosed YE 2022; type split interpolated from adjacent Fact Book years",
  },
  {
    year: 2023,
    governmentTn: 4.843,
    primeTn: 0.952,
    taxExemptTn: 0.124,
    totalTn: 5.919,
    retailTn: 2.306,
    institutionalTn: 3.613,
    confidence: "disclosed",
  },
  {
    year: 2024,
    governmentTn: 5.638,
    primeTn: 1.079,
    taxExemptTn: 0.136,
    totalTn: 6.852,
    retailTn: 2.738,
    institutionalTn: 4.114,
    confidence: "disclosed",
  },
  {
    year: 2025,
    governmentTn: 6.375,
    primeTn: 1.22,
    taxExemptTn: 0.151,
    totalTn: 7.746,
    retailTn: 3.084,
    institutionalTn: 4.663,
    confidence: "disclosed",
    note: "ICI Fact Book YE 2025 taxable + tax-exempt",
  },
  {
    year: 2026,
    governmentTn: 6.473,
    primeTn: 1.231,
    taxExemptTn: 0.15,
    totalTn: 7.854,
    retailTn: 3.078,
    institutionalTn: 4.776,
    confidence: "disclosed",
    note: "ICI weekly 29 Jul 2026 (not year-end)",
  },
];

export type DualCashPoint = {
  period: string;
  sortKey: number;
  mmfTn: number;
  depositsTn: number;
  mmfSharePct: number;
  confidence: Confidence;
  note?: string;
};

/**
 * Parallel cash piles: MMF AUM vs bank deposits excl. large time (H.8 definition in FEDS note).
 * May 2025 deposits = disclosed ~$15T; other deposit points estimated from note narrative.
 */
export const DUAL_CASH_PATH: DualCashPoint[] = [
  {
    period: "2019 YE",
    sortKey: 2019,
    mmfTn: 3.63,
    depositsTn: 12.4,
    mmfSharePct: 22.6,
    confidence: "estimated",
    note: "MMF = ICI YE; deposits estimated from H.8 trend pre-COVID",
  },
  {
    period: "2021 YE",
    sortKey: 2021,
    mmfTn: 4.76,
    depositsTn: 16.2,
    mmfSharePct: 22.7,
    confidence: "estimated",
    note: "Post-stimulus deposit peak era; deposits estimated",
  },
  {
    period: "2022 YE",
    sortKey: 2022,
    mmfTn: 4.79,
    depositsTn: 15.6,
    mmfSharePct: 23.5,
    confidence: "estimated",
  },
  {
    period: "2023 YE",
    sortKey: 2023,
    mmfTn: 5.92,
    depositsTn: 15.1,
    mmfSharePct: 28.2,
    confidence: "estimated",
  },
  {
    period: "2024 YE",
    sortKey: 2024,
    mmfTn: 6.85,
    depositsTn: 15.0,
    mmfSharePct: 31.4,
    confidence: "estimated",
  },
  {
    period: "May 2025",
    sortKey: 2025.4,
    mmfTn: 7.0,
    depositsTn: 15.0,
    mmfSharePct: 31.8,
    confidence: "disclosed",
    note: "Fed FEDS Note snapshot",
  },
  {
    period: "Jul 2026",
    sortKey: 2026.6,
    mmfTn: 7.85,
    depositsTn: 15.2,
    mmfSharePct: 34.1,
    confidence: "estimated",
    note: "MMF = ICI weekly disclosed; deposits held near May 2025 level (estimated)",
  },
];

export type YieldGapPoint = {
  period: string;
  sortKey: number;
  mmfYieldPct: number;
  depositYieldPct: number;
  gapPp: number;
  confidence: Confidence;
};

/** Yield gap anchors — YE 2025 disclosed by ICI commentary; earlier points estimated. */
export const YIELD_GAP_PATH: YieldGapPoint[] = [
  {
    period: "2019",
    sortKey: 2019,
    mmfYieldPct: 1.5,
    depositYieldPct: 0.2,
    gapPp: 1.3,
    confidence: "estimated",
  },
  {
    period: "2021",
    sortKey: 2021,
    mmfYieldPct: 0.05,
    depositYieldPct: 0.05,
    gapPp: 0.0,
    confidence: "estimated",
  },
  {
    period: "2022",
    sortKey: 2022,
    mmfYieldPct: 3.8,
    depositYieldPct: 0.3,
    gapPp: 3.5,
    confidence: "estimated",
  },
  {
    period: "2023",
    sortKey: 2023,
    mmfYieldPct: 5.1,
    depositYieldPct: 0.5,
    gapPp: 4.6,
    confidence: "estimated",
  },
  {
    period: "2024",
    sortKey: 2024,
    mmfYieldPct: 4.8,
    depositYieldPct: 0.5,
    gapPp: 4.3,
    confidence: "estimated",
  },
  {
    period: "2025 YE",
    sortKey: 2025,
    mmfYieldPct: 3.9,
    depositYieldPct: 0.6,
    gapPp: 3.3,
    confidence: "disclosed",
  },
];

export type InvestorSlope = {
  label: string;
  shortLabel: string;
  startTn: number;
  endTn: number;
  startYear: number;
  endYear: number;
  confidence: Confidence;
};

export const RETAIL_INST_SLOPE: InvestorSlope[] = [
  {
    label: "Retail MMFs",
    shortLabel: "Retail",
    startTn: 1.37,
    endTn: 3.078,
    startYear: 2019,
    endYear: 2026,
    confidence: "disclosed",
  },
  {
    label: "Institutional MMFs",
    shortLabel: "Institutional",
    startTn: 2.262,
    endTn: 4.776,
    startYear: 2019,
    endYear: 2026,
    confidence: "disclosed",
  },
];

export type CompositionSlice = {
  type: string;
  shortLabel: string;
  bn: number;
  sharePct: number;
  confidence: Confidence;
};

export function latestCompositionRanked(): CompositionSlice[] {
  const s = WEEKLY_SNAPSHOT_2026_07_29;
  const rows: CompositionSlice[] = [
    {
      type: "Government",
      shortLabel: "Gov",
      bn: s.governmentBn,
      sharePct: (s.governmentBn / s.totalBn) * 100,
      confidence: "disclosed",
    },
    {
      type: "Prime",
      shortLabel: "Prime",
      bn: s.primeBn,
      sharePct: (s.primeBn / s.totalBn) * 100,
      confidence: "disclosed",
    },
    {
      type: "Tax-exempt",
      shortLabel: "Muni",
      bn: s.taxExemptBn,
      sharePct: (s.taxExemptBn / s.totalBn) * 100,
      confidence: "disclosed",
    },
  ];
  return rows.sort((a, b) => b.bn - a.bn);
}

export function rankedInvestorShares(): CompositionSlice[] {
  const s = WEEKLY_SNAPSHOT_2026_07_29;
  const rows: CompositionSlice[] = [
    {
      type: "Institutional",
      shortLabel: "Inst",
      bn: s.institutionalBn,
      sharePct: (s.institutionalBn / s.totalBn) * 100,
      confidence: "disclosed",
    },
    {
      type: "Retail",
      shortLabel: "Retail",
      bn: s.retailBn,
      sharePct: (s.retailBn / s.totalBn) * 100,
      confidence: "disclosed",
    },
  ];
  return rows.sort((a, b) => b.bn - a.bn);
}

export function fmtTn(n: number, digits = 2): string {
  return `$${n.toFixed(digits)}T`;
}

export function fmtBn(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}T`;
  return `$${n.toFixed(0)}B`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  return `${n.toFixed(digits)} pp`;
}
