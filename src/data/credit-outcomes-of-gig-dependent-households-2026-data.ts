/**
 * Credit outcomes of gig-dependent households — 2026 desk synthesis.
 * Core question: Do households relying on platform income show different
 * delinquency and buffer patterns than comparable W-2-only households?
 *
 * Anchors: CFPB Consumer Credit Panel / Making Ends Meet research notes;
 * Federal Reserve SHED (gig / side-activity and emergency-expense modules);
 * NY Fed SCE credit access. Estimated rows labeled.
 */

export type Confidence = "disclosed" | "estimated" | "carried";
export type SegmentId = "gig-primary" | "gig-secondary" | "w2-only";
export type ProductId = "card" | "auto" | "mortgage" | "personal";
export type ViewId =
  | "gap"
  | "buffers"
  | "scatter"
  | "ladder"
  | "vintage"
  | "table";

export const SOURCE_NOTE =
  "Segment delinquency and revolving utilization are desk-harmonized from CFPB Consumer Credit Panel research briefs and Making Ends Meet survey crosstabs (2022–2024 vintages), matched on income band and age. Buffer / $400-expense shares follow Fed SHED gig and emergency-expense modules (2019–2024). Income-volatility coefficients are estimated from Chase Institute platform-economy volatility patterns applied to CCP past-due rates. Rows marked estimated are not official CFPB or Fed tabulations.";

export const SOURCES = [
  {
    label: "CFPB — Consumer Credit Trends / Making Ends Meet",
    url: "https://www.consumerfinance.gov/data-research/research-reports/",
  },
  {
    label: "Federal Reserve — Survey of Household Economics and Decisionmaking (SHED)",
    url: "https://www.federalreserve.gov/consumerscommunities/shed.htm",
  },
  {
    label: "NY Fed — Survey of Consumer Expectations (credit access)",
    url: "https://www.newyorkfed.org/microeconomics/sce",
  },
  {
    label: "JPMorgan Chase Institute — Platform economy / income volatility",
    url: "https://www.jpmorganchase.com/institute",
  },
] as const;

/** Headline delinquency gap: gig-primary card 60+ DPD minus matched W-2 */
export const HEADLINE = {
  gigPrimaryCard60DpdPct: 8.4,
  w2Card60DpdPct: 5.6,
  delinquencyGapPp: 2.8,
  gigPrimaryCanCover400Pct: 48,
  w2CanCover400Pct: 67,
  bufferGapPp: 19,
  gigPrimaryShareOfAdultsPct: 4.1,
  gigAnyShareOfAdultsPct: 16.2,
  medianMoMSwingGigPrimaryPct: 28,
  medianMoMSwingW2Pct: 6,
} as const;

export const VIZ_MARKERS = [
  "Delinquency gap vs W-2 — 2.8 pp",
  "Gig-primary card 60+ DPD 8.4%",
  "Buffer gap $400 expense — 19 pp",
] as const;

export type SegmentProfile = {
  id: SegmentId;
  label: string;
  shareOfAdultsPct: number;
  card60DpdPct: number;
  auto60DpdPct: number;
  mortgage60DpdPct: number;
  personal60DpdPct: number;
  revolvingUtilPct: number;
  canCover400Pct: number;
  wouldBorrowOrSellPct: number;
  medianMoMIncomeSwingPct: number;
  confidence: Confidence;
};

export const SEGMENTS: SegmentProfile[] = [
  {
    id: "gig-primary",
    label: "Gig-primary (≥50% earnings)",
    shareOfAdultsPct: 4.1,
    card60DpdPct: 8.4,
    auto60DpdPct: 5.9,
    mortgage60DpdPct: 2.1,
    personal60DpdPct: 7.2,
    revolvingUtilPct: 62,
    canCover400Pct: 48,
    wouldBorrowOrSellPct: 41,
    medianMoMIncomeSwingPct: 28,
    confidence: "estimated",
  },
  {
    id: "gig-secondary",
    label: "Gig-secondary (<50% earnings)",
    shareOfAdultsPct: 12.1,
    card60DpdPct: 6.5,
    auto60DpdPct: 4.4,
    mortgage60DpdPct: 1.5,
    personal60DpdPct: 5.4,
    revolvingUtilPct: 51,
    canCover400Pct: 58,
    wouldBorrowOrSellPct: 32,
    medianMoMIncomeSwingPct: 14,
    confidence: "estimated",
  },
  {
    id: "w2-only",
    label: "W-2 only (matched)",
    shareOfAdultsPct: 58.0,
    card60DpdPct: 5.6,
    auto60DpdPct: 3.8,
    mortgage60DpdPct: 1.2,
    personal60DpdPct: 4.1,
    revolvingUtilPct: 44,
    canCover400Pct: 67,
    wouldBorrowOrSellPct: 24,
    medianMoMIncomeSwingPct: 6,
    confidence: "carried",
  },
];

export type ProductGapRow = {
  product: ProductId;
  label: string;
  gigPrimaryPct: number;
  gigSecondaryPct: number;
  w2OnlyPct: number;
  gapVsW2Pp: number;
  confidence: Confidence;
};

export const PRODUCT_GAPS: ProductGapRow[] = [
  {
    product: "card",
    label: "Credit card 60+ DPD",
    gigPrimaryPct: 8.4,
    gigSecondaryPct: 6.5,
    w2OnlyPct: 5.6,
    gapVsW2Pp: 2.8,
    confidence: "estimated",
  },
  {
    product: "auto",
    label: "Auto loan 60+ DPD",
    gigPrimaryPct: 5.9,
    gigSecondaryPct: 4.4,
    w2OnlyPct: 3.8,
    gapVsW2Pp: 2.1,
    confidence: "estimated",
  },
  {
    product: "personal",
    label: "Personal loan 60+ DPD",
    gigPrimaryPct: 7.2,
    gigSecondaryPct: 5.4,
    w2OnlyPct: 4.1,
    gapVsW2Pp: 3.1,
    confidence: "estimated",
  },
  {
    product: "mortgage",
    label: "Mortgage 60+ DPD",
    gigPrimaryPct: 2.1,
    gigSecondaryPct: 1.5,
    w2OnlyPct: 1.2,
    gapVsW2Pp: 0.9,
    confidence: "estimated",
  },
];

export type BufferVintage = {
  year: number;
  gigPrimaryCanCoverPct: number;
  gigSecondaryCanCoverPct: number;
  w2OnlyCanCoverPct: number;
  confidence: Confidence;
};

export const BUFFER_VINTAGE: BufferVintage[] = [
  {
    year: 2019,
    gigPrimaryCanCoverPct: 44,
    gigSecondaryCanCoverPct: 55,
    w2OnlyCanCoverPct: 63,
    confidence: "carried",
  },
  {
    year: 2020,
    gigPrimaryCanCoverPct: 51,
    gigSecondaryCanCoverPct: 61,
    w2OnlyCanCoverPct: 70,
    confidence: "carried",
  },
  {
    year: 2021,
    gigPrimaryCanCoverPct: 54,
    gigSecondaryCanCoverPct: 63,
    w2OnlyCanCoverPct: 72,
    confidence: "carried",
  },
  {
    year: 2022,
    gigPrimaryCanCoverPct: 50,
    gigSecondaryCanCoverPct: 60,
    w2OnlyCanCoverPct: 69,
    confidence: "disclosed",
  },
  {
    year: 2023,
    gigPrimaryCanCoverPct: 47,
    gigSecondaryCanCoverPct: 58,
    w2OnlyCanCoverPct: 67,
    confidence: "disclosed",
  },
  {
    year: 2024,
    gigPrimaryCanCoverPct: 48,
    gigSecondaryCanCoverPct: 58,
    w2OnlyCanCoverPct: 67,
    confidence: "estimated",
  },
];

export type DelinquencyVintage = {
  year: number;
  gigPrimaryCard60Pct: number;
  w2Card60Pct: number;
  gapPp: number;
  confidence: Confidence;
};

export const DELINQ_VINTAGE: DelinquencyVintage[] = [
  {
    year: 2019,
    gigPrimaryCard60Pct: 7.1,
    w2Card60Pct: 5.2,
    gapPp: 1.9,
    confidence: "estimated",
  },
  {
    year: 2020,
    gigPrimaryCard60Pct: 5.8,
    w2Card60Pct: 4.4,
    gapPp: 1.4,
    confidence: "estimated",
  },
  {
    year: 2021,
    gigPrimaryCard60Pct: 5.4,
    w2Card60Pct: 4.1,
    gapPp: 1.3,
    confidence: "estimated",
  },
  {
    year: 2022,
    gigPrimaryCard60Pct: 6.9,
    w2Card60Pct: 4.9,
    gapPp: 2.0,
    confidence: "estimated",
  },
  {
    year: 2023,
    gigPrimaryCard60Pct: 7.8,
    w2Card60Pct: 5.3,
    gapPp: 2.5,
    confidence: "estimated",
  },
  {
    year: 2024,
    gigPrimaryCard60Pct: 8.4,
    w2Card60Pct: 5.6,
    gapPp: 2.8,
    confidence: "estimated",
  },
];

/** Scatter: volatility vs card delinquency by income × segment cell */
export type VolatilityCell = {
  id: string;
  segment: SegmentId;
  incomeBand: string;
  medianSwingPct: number;
  card60DpdPct: number;
  utilPct: number;
  nWeight: number;
  confidence: Confidence;
};

export const VOLATILITY_CELLS: VolatilityCell[] = [
  {
    id: "gp-lo",
    segment: "gig-primary",
    incomeBand: "<$40k",
    medianSwingPct: 34,
    card60DpdPct: 11.2,
    utilPct: 74,
    nWeight: 18,
    confidence: "estimated",
  },
  {
    id: "gp-mid",
    segment: "gig-primary",
    incomeBand: "$40–80k",
    medianSwingPct: 27,
    card60DpdPct: 8.1,
    utilPct: 61,
    nWeight: 22,
    confidence: "estimated",
  },
  {
    id: "gp-hi",
    segment: "gig-primary",
    incomeBand: ">$80k",
    medianSwingPct: 22,
    card60DpdPct: 5.4,
    utilPct: 48,
    nWeight: 12,
    confidence: "estimated",
  },
  {
    id: "gs-lo",
    segment: "gig-secondary",
    incomeBand: "<$40k",
    medianSwingPct: 18,
    card60DpdPct: 8.0,
    utilPct: 63,
    nWeight: 28,
    confidence: "estimated",
  },
  {
    id: "gs-mid",
    segment: "gig-secondary",
    incomeBand: "$40–80k",
    medianSwingPct: 13,
    card60DpdPct: 6.2,
    utilPct: 50,
    nWeight: 35,
    confidence: "estimated",
  },
  {
    id: "gs-hi",
    segment: "gig-secondary",
    incomeBand: ">$80k",
    medianSwingPct: 10,
    card60DpdPct: 4.6,
    utilPct: 41,
    nWeight: 24,
    confidence: "estimated",
  },
  {
    id: "w2-lo",
    segment: "w2-only",
    incomeBand: "<$40k",
    medianSwingPct: 9,
    card60DpdPct: 7.4,
    utilPct: 58,
    nWeight: 40,
    confidence: "carried",
  },
  {
    id: "w2-mid",
    segment: "w2-only",
    incomeBand: "$40–80k",
    medianSwingPct: 6,
    card60DpdPct: 5.3,
    utilPct: 43,
    nWeight: 55,
    confidence: "carried",
  },
  {
    id: "w2-hi",
    segment: "w2-only",
    incomeBand: ">$80k",
    medianSwingPct: 4,
    card60DpdPct: 3.2,
    utilPct: 32,
    nWeight: 48,
    confidence: "carried",
  },
];

export type RelianceLadderRow = {
  band: string;
  platformShareMinPct: number;
  platformShareMaxPct: number;
  card60DpdPct: number;
  canCover400Pct: number;
  revolvingUtilPct: number;
  confidence: Confidence;
};

/** Ladder by platform-income share of household earnings */
export const RELIANCE_LADDER: RelianceLadderRow[] = [
  {
    band: "0% (W-2 only)",
    platformShareMinPct: 0,
    platformShareMaxPct: 0,
    card60DpdPct: 5.6,
    canCover400Pct: 67,
    revolvingUtilPct: 44,
    confidence: "carried",
  },
  {
    band: "1–24%",
    platformShareMinPct: 1,
    platformShareMaxPct: 24,
    card60DpdPct: 6.1,
    canCover400Pct: 61,
    revolvingUtilPct: 48,
    confidence: "estimated",
  },
  {
    band: "25–49%",
    platformShareMinPct: 25,
    platformShareMaxPct: 49,
    card60DpdPct: 6.9,
    canCover400Pct: 55,
    revolvingUtilPct: 54,
    confidence: "estimated",
  },
  {
    band: "50–74%",
    platformShareMinPct: 50,
    platformShareMaxPct: 74,
    card60DpdPct: 8.0,
    canCover400Pct: 50,
    revolvingUtilPct: 60,
    confidence: "estimated",
  },
  {
    band: "75%+",
    platformShareMinPct: 75,
    platformShareMaxPct: 100,
    card60DpdPct: 9.1,
    canCover400Pct: 44,
    revolvingUtilPct: 68,
    confidence: "estimated",
  },
];

export type OutcomeTableRow = {
  metric: string;
  gigPrimary: string;
  gigSecondary: string;
  w2Only: string;
  note: string;
};

export const OUTCOME_TABLE: OutcomeTableRow[] = [
  {
    metric: "Card 60+ DPD rate",
    gigPrimary: "8.4%",
    gigSecondary: "6.5%",
    w2Only: "5.6%",
    note: "Matched income/age CCP cells",
  },
  {
    metric: "Auto 60+ DPD rate",
    gigPrimary: "5.9%",
    gigSecondary: "4.4%",
    w2Only: "3.8%",
    note: "Matched income/age CCP cells",
  },
  {
    metric: "Revolving utilization",
    gigPrimary: "62%",
    gigSecondary: "51%",
    w2Only: "44%",
    note: "Mean utilized / limit",
  },
  {
    metric: "Can cover $400 expense",
    gigPrimary: "48%",
    gigSecondary: "58%",
    w2Only: "67%",
    note: "SHED cash/equivalent",
  },
  {
    metric: "Would borrow or sell",
    gigPrimary: "41%",
    gigSecondary: "32%",
    w2Only: "24%",
    note: "SHED emergency coping",
  },
  {
    metric: "Median MoM income swing",
    gigPrimary: "28%",
    gigSecondary: "14%",
    w2Only: "6%",
    note: "Platform vs paycheck volatility",
  },
];

export const SEGMENT_COLORS: Record<SegmentId, string> = {
  "gig-primary": "#e11d48",
  "gig-secondary": "#d97706",
  "w2-only": "#0d9488",
};

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function segmentById(id: SegmentId): SegmentProfile {
  const row = SEGMENTS.find((s) => s.id === id);
  if (!row) throw new Error(`Unknown segment ${id}`);
  return row;
}
