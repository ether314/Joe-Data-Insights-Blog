/**
 * Lead pipe replacement pace versus inventory (2026).
 *
 * Core question: How many lead and galvanized-requiring-replacement (GRR)
 * service lines are actually replaced per year relative to remaining
 * inventories — and how many years does that pace imply?
 *
 * Unit note: U.S. water-sector accounting is in service *lines* (connections),
 * not miles. An illustrative 60-ft mean length converts lines → approximate
 * miles for context only; regulatory deadlines and capital plans are line-based.
 *
 * Headline: EPA’s 2025 LCRR-inventory DWINSA update puts ~4 million lead+GRR
 * lines still requiring replacement. A 10% LCRI-style national pace would be
 * ~400,000 lines/year; observed large-city programs mostly run far below that
 * share of their own inventories, so calendar years-to-clear stretch into the
 * teens or decades outside a handful of crash programs.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "National inventory: EPA 2025 Update to the 7th Drinking Water Infrastructure Needs Survey and Assessment (DWINSA), incorporating Lead and Copper Rule Revisions (LCRR) initial inventory state summaries — approximately 4 million lead and galvanized service lines requiring replacement (also restated in FY2025/FY2026 IIJA LSLR allotment memoranda). Earlier 2024 one-time DWINSA LSL update projected ~9 million; the 2025 cut revises that stock downward using inventory filings. Replacement deadline math: EPA Lead and Copper Rule Improvements (LCRI) technical fact sheet — cumulative average annual replacement rate of 10% for most systems (assessment begins end of program year 3), with deferred-deadline eligibility when 10% of known lead+GRR exceeds 39 replacements per 1,000 service connections. City pace rows: Denver Water Lead Reduction Program Annual Report 2024 (7,973 replacements in 2024; 12.5% annual / 9.5% cumulative); Newark NJDEP audit (23,190 LSL replacements completed); DC Water Lead-Free DC FY24 summary (2,199 FY2024; 6,961 cumulative; 34,196 remaining as of 1 Oct 2024); Chicago Department of Water Management inventory / Grist 2025 reporting (~412,000 lead or suspected; planned ~8,300/year from 2027); Milwaukee Water Works public progress briefings (~2,700 in 2024; ~63,000 remaining; multi-year ramp toward ~5,000/year); Pittsburgh Water & Sewer Authority milestone reporting (~11,000 removed by April 2024; ~7,000 remaining toward a 2026 residential goal). IIJA LSLR allotments: EPA DWSRF memoranda (~$3 billion/year FY2025–FY2026 class). Scenario paths are editorial illustrations consistent with LCRI rates, not EPA forecasts.";

export const SOURCES = [
  {
    label: "EPA — 2025 Update to the 7th DWINSA (LSL fact sheet)",
    url: "https://www.epa.gov/system/files/documents/2025-11/fact-sheet-2025-7th-dwinsa-update.pdf",
  },
  {
    label: "EPA — FY2025 IIJA LSLR DWSRF allotments memorandum",
    url: "https://www.epa.gov/system/files/documents/2025-11/fy25-dwsrf-lslr-allotments-memorandum_november-2025.pdf",
  },
  {
    label: "EPA — LCRI technical fact sheet: inventory & replacement",
    url: "https://www.epa.gov/system/files/documents/2024-10/final_lcri_fact-sheet_service-line-inventory.pdf",
  },
  {
    label: "EPA — Updated 7th DWINSA LSL fact sheet (2024, ~9M prior cut)",
    url: "https://www.epa.gov/system/files/documents/2024-05/fact-sheet_one-time-update_2024.04.30_508_compliant_1.pdf",
  },
  {
    label: "Denver Water — Lead Reduction Program Annual Report 2024",
    url: "https://www.denverwater.org/sites/default/files/lead-reduction-program-annual-report-2024.pdf",
  },
  {
    label: "NJDEP — Newark LSL replacement compliance audit summary",
    url: "https://dep.nj.gov/wp-content/uploads/newarklead/docs/newark-lsl-replacement-audit-summary.pdf",
  },
  {
    label: "DC Water — Lead-Free DC FY24 report summary",
    url: "https://www.dcwater.com/sites/default/files/Lead-Testing/LFDC%20FY24%20Report%20Summary%20FINAL.pdf",
  },
  {
    label: "Grist — Chicago lead service line inventory mapping (2025)",
    url: "https://grist.org/accountability/chicago-lead-pipe-replacement-map-health/",
  },
] as const;

export const HEADLINE = {
  /** EPA 2025 DWINSA / LCRR inventory synthesis */
  nationalLeadGrrMillions: 4,
  nationalLeadGrrLines: 4_000_000,
  /** Prior 2024 one-time DWINSA LSL projection */
  priorEstimateMillions: 9,
  /** LCRI default 10% cumulative average annual */
  lcriAnnualSharePct: 10,
  /** Implied national lines/year at 10% of 4M */
  lcriImpliedAnnualLines: 400_000,
  /** Illustrative mean service-line length (ft) for mile conversion */
  meanLineFeet: 60,
  /** Approximate miles equivalent of 4M × 60 ft */
  inventoryMilesApprox: Math.round((4_000_000 * 60) / 5280),
  /** Approx miles/year at 400k × 60 ft */
  lcriImpliedMilesPerYear: Math.round((400_000 * 60) / 5280),
  /** IIJA dedicated LSLR DWSRF class (~$3B/yr in recent allotments) */
  iijaLslrBillionPerYear: 3,
  confidence: "disclosed" as Confidence,
};

/** Inventory revision path (national stock estimates used for allotments) */
export type InventoryRevisionRow = {
  label: string;
  year: number;
  leadGrrMillions: number;
  basis: string;
  confidence: Confidence;
};

export const INVENTORY_REVISIONS: InventoryRevisionRow[] = [
  {
    label: "7th DWINSA (initial LSL need)",
    year: 2023,
    leadGrrMillions: 9.2,
    basis: "Survey questionnaire / modelled need",
    confidence: "estimated",
  },
  {
    label: "One-time DWINSA LSL update",
    year: 2024,
    leadGrrMillions: 9.0,
    basis: "Updated state LSL questionnaires",
    confidence: "estimated",
  },
  {
    label: "LCRR inventory → DWINSA 2025",
    year: 2025,
    leadGrrMillions: 4.0,
    basis: "State LCRR inventory summaries + unknowns prorated",
    confidence: "disclosed",
  },
];

/**
 * Illustrative national clearance path under alternative annual paces.
 * Starting stock = 4,000,000; no new discoveries (optimistic).
 */
export type ClearanceScenarioRow = {
  year: number;
  /** Remaining under 5% of starting stock / year */
  remainingAt5Pct: number;
  /** Remaining under LCRI-like 10%/year of starting stock */
  remainingAt10Pct: number;
  /** Remaining under a slow 2%/year national blend */
  remainingAt2Pct: number;
};

export const CLEARANCE_SCENARIOS: ClearanceScenarioRow[] = (() => {
  const start = HEADLINE.nationalLeadGrrLines;
  const rows: ClearanceScenarioRow[] = [];
  for (let y = 2025; y <= 2045; y++) {
    const t = y - 2025;
    rows.push({
      year: y,
      remainingAt5Pct: Math.max(0, Math.round(start * (1 - 0.05 * t))),
      remainingAt10Pct: Math.max(0, Math.round(start * (1 - 0.1 * t))),
      remainingAt2Pct: Math.max(0, Math.round(start * (1 - 0.02 * t))),
    });
  }
  return rows;
})();

export type PaceBand = "crash" | "on-track" | "behind" | "multi-decade";

/** Large-system pace vs remaining inventory */
export type UtilityPaceRow = {
  utility: string;
  metro: string;
  remainingLines: number;
  annualReplacements: number;
  /** Years to clear at disclosed annual pace (remaining / annual) */
  yearsAtPace: number;
  annualShareOfRemainingPct: number;
  paceBand: PaceBand;
  note: string;
  confidence: Confidence;
};

export const UTILITY_PACE: UtilityPaceRow[] = [
  {
    utility: "Newark (completed program)",
    metro: "Newark, NJ",
    remainingLines: 0,
    annualReplacements: 7_730,
    yearsAtPace: 0,
    annualShareOfRemainingPct: 100,
    paceBand: "crash",
    note: "23,190 LSLs replaced over ~3 program years; peak ~900/month after cost-share removed",
    confidence: "disclosed",
  },
  {
    utility: "Denver Water LRP",
    metro: "Denver, CO",
    remainingLines: 56_000,
    annualReplacements: 7_973,
    yearsAtPace: 7.0,
    annualShareOfRemainingPct: 14.2,
    paceBand: "on-track",
    note: "2024: 7,973 replacements (12.5% annual rate vs program inventory; 9.5% cumulative)",
    confidence: "estimated",
  },
  {
    utility: "Pittsburgh Water & Sewer",
    metro: "Pittsburgh, PA",
    remainingLines: 7_000,
    annualReplacements: 3_500,
    yearsAtPace: 2.0,
    annualShareOfRemainingPct: 50.0,
    paceBand: "crash",
    note: "~11,000 removed by Apr 2024; ~7,000 remaining toward end-2026 residential goal",
    confidence: "estimated",
  },
  {
    utility: "Milwaukee Water Works",
    metro: "Milwaukee, WI",
    remainingLines: 63_000,
    annualReplacements: 2_700,
    yearsAtPace: 23.3,
    annualShareOfRemainingPct: 4.3,
    paceBand: "behind",
    note: "~2,700 in 2024; goals rising toward 3,500 then ~5,000/year to hit federal windows",
    confidence: "estimated",
  },
  {
    utility: "DC Water (Lead-Free DC)",
    metro: "Washington, DC",
    remainingLines: 34_196,
    annualReplacements: 2_199,
    yearsAtPace: 15.6,
    annualShareOfRemainingPct: 6.4,
    paceBand: "behind",
    note: "FY2024: 2,199; cumulative 6,961 since 2019; remaining as of 1 Oct 2024",
    confidence: "disclosed",
  },
  {
    utility: "Chicago DWM (planned pace)",
    metro: "Chicago, IL",
    remainingLines: 412_000,
    annualReplacements: 8_300,
    yearsAtPace: 49.6,
    annualShareOfRemainingPct: 2.0,
    paceBand: "multi-decade",
    note: "~412k lead/suspected; capital plan ~8,300/year from 2027 (state window longer than LCRI)",
    confidence: "estimated",
  },
];

/** Scatter points: remaining vs annual pace (exclude completed Newark for log-friendly axes) */
export type PaceScatterRow = {
  utility: string;
  remainingLines: number;
  annualReplacements: number;
  yearsAtPace: number;
  paceBand: PaceBand;
};

export const PACE_SCATTER: PaceScatterRow[] = UTILITY_PACE.filter(
  (r) => r.remainingLines > 0,
).map((r) => ({
  utility: r.utility,
  remainingLines: r.remainingLines,
  annualReplacements: r.annualReplacements,
  yearsAtPace: r.yearsAtPace,
  paceBand: r.paceBand,
}));

/** Required annual share bands under LCRI-style math */
export type RequiredRateRow = {
  band: string;
  sharePct: number;
  linesPerYearAt4M: number;
  yearsToClear: number;
  description: string;
};

export const REQUIRED_RATE_BANDS: RequiredRateRow[] = [
  {
    band: "Slow blend (2%)",
    sharePct: 2,
    linesPerYearAt4M: 80_000,
    yearsToClear: 50,
    description: "Near multi-decade capital-plan tempo for mega-inventories",
  },
  {
    band: "Mid (5%)",
    sharePct: 5,
    linesPerYearAt4M: 200_000,
    yearsToClear: 20,
    description: "Aggressive for most systems; still short of default LCRI",
  },
  {
    band: "LCRI default (10%)",
    sharePct: 10,
    linesPerYearAt4M: 400_000,
    yearsToClear: 10,
    description: "Cumulative average annual replacement rate for most CWSs",
  },
  {
    band: "Crash (20%)",
    sharePct: 20,
    linesPerYearAt4M: 800_000,
    yearsToClear: 5,
    description: "Newark-class tempo if sustained nationally (not observed)",
  },
];

/** Denver annual path (disclosed program years) */
export type DenverYearRow = {
  year: number;
  replacements: number;
  annualRatePct: number;
  confidence: Confidence;
};

export const DENVER_PATH: DenverYearRow[] = [
  { year: 2020, replacements: 5_514, annualRatePct: 8.6, confidence: "disclosed" },
  { year: 2021, replacements: 4_814, annualRatePct: 7.5, confidence: "disclosed" },
  { year: 2022, replacements: 5_119, annualRatePct: 8.0, confidence: "disclosed" },
  { year: 2023, replacements: 6_200, annualRatePct: 9.7, confidence: "estimated" },
  { year: 2024, replacements: 7_973, annualRatePct: 12.5, confidence: "disclosed" },
];

/** Funding vs physical clearance — IIJA allotment class vs implied LCRI volume */
export type FundingGapRow = {
  label: string;
  value: number;
  unit: string;
  confidence: Confidence;
};

export const FUNDING_CONTEXT: FundingGapRow[] = [
  {
    label: "IIJA LSLR DWSRF class (recent FY)",
    value: 3,
    unit: "$ billions / year",
    confidence: "disclosed",
  },
  {
    label: "Implied LCRI national pace",
    value: 400_000,
    unit: "lines / year",
    confidence: "estimated",
  },
  {
    label: "Implied spend if $8k–$15k per full replacement",
    value: 4.6,
    unit: "$ billions / year at mid $11.5k",
    confidence: "estimated",
  },
  {
    label: "Chicago alone — published total cost band",
    value: 12,
    unit: "$ billions (program lifetime)",
    confidence: "estimated",
  },
];

export const PACE_BAND_COLORS: Record<PaceBand, string> = {
  crash: "#14b8a6",
  "on-track": "#0ea5e9",
  behind: "#f97316",
  "multi-decade": "#ef4444",
};

export function yearsToClear(remaining: number, annual: number): number | null {
  if (annual <= 0) return null;
  if (remaining <= 0) return 0;
  return Math.round((remaining / annual) * 10) / 10;
}

export function linesToMiles(lines: number, feetPerLine = HEADLINE.meanLineFeet): number {
  return Math.round((lines * feetPerLine) / 5280);
}
