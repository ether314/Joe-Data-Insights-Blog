/**
 * US cyber insurance premiums vs incurred losses — 2026 desk synthesis.
 * Core question: Did cyber written premium grow faster than incurred losses,
 * and how concentrated are economic losses in ransomware vs BEC?
 *
 * Anchors: NAIC Cybersecurity Insurance Coverage Supplement / 2025 NAIC
 * Cybersecurity Insurance Report; Aon U.S. Cyber Market Update (CY 2020–2024
 * loss + DCC ratios); FBI IC3 Annual Reports 2022–2024. Derived incurred
 * dollars labeled estimated (loss ratio × domestic DWP proxy).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Domestic and total (incl. alien surplus lines) direct written premium (DWP) follow the NAIC 2025 Cybersecurity Insurance Report. Calendar-year industry loss + defense cost containment (DCC) ratios follow Aon’s U.S. Cyber Market Update series compiled from the NAIC Cyber Supplement (2019–2024). Estimated incurred loss+DCC dollars = disclosed loss ratio × same-year domestic DWP (proxy for earned; not a statutory incurred total). Policy-structure premium shares are 2024 NAIC primary/excess/endorsement splits. IC3 ransomware, BEC, and personal-data-breach complaint/loss figures follow FBI IC3 Annual Reports 2022–2024; ransomware IC3 loss dollars exclude business interruption and most remediation costs.";

export const SOURCES = [
  {
    label: "NAIC — Report on the Cybersecurity Insurance Market (2025)",
    url: "https://content.naic.org/sites/default/files/inline-files/2025_Cybersecurity_Insurance%20Report.pdf",
  },
  {
    label: "Aon — U.S. Cyber Market Update (CY 2024)",
    url: "https://www.aon.com/getmedia/e8087f7c-d1c0-4d15-af60-f4e3fb72bbe0/2024-US-Cyber-Market-Update.pdf",
  },
  {
    label: "Aon — U.S. Cyber Market Update (CY 2023)",
    url: "https://www.aon.com/getmedia/4afa8654-6534-48c3-91c1-b27d57170cdb/20240806-US-Cyber-Market-Update.pdf",
  },
  {
    label: "FBI IC3 — 2024 Internet Crime Report",
    url: "https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf",
  },
  {
    label: "FBI IC3 — 2023 Internet Crime Report",
    url: "https://www.ic3.gov/AnnualReport/Reports/2023_IC3Report.pdf",
  },
] as const;

/** Headline desk stats for cards / excerpt. */
export const HEADLINE = {
  domesticDwp2020B: 2.75,
  domesticDwp2024B: 7.08,
  domesticDwpGrowthPct: 157,
  totalDwp2023B: 9.84,
  totalDwp2024B: 9.14,
  totalDwpDeclinePct: -7.1,
  lossRatio2020Pct: 67,
  lossRatio2023Pct: 42,
  lossRatio2024Pct: 49,
  estimatedIncurred2020B: 1.85,
  estimatedIncurred2024B: 3.47,
  estimatedIncurredGrowthPct: 88,
  premiumVsLossGrowthGapPp: 69,
  claims2024: 50_000,
  claimsYoYPct: 40,
  primaryPremiumShare2024Pct: 65,
  excessPremiumShare2024Pct: 31,
  endorsementPremiumShare2024Pct: 4,
  ic3RansomwareComplaints2024: 3156,
  ic3RansomwareLosses2024M: 12.47,
  ic3BecLosses2024B: 2.77,
  ic3TotalLosses2024B: 16.6,
} as const;

export type MarketYearRow = {
  year: number;
  domesticDwpB: number;
  totalDwpB: number;
  /** Calendar-year incurred loss + DCC ratio (%), Aon/NAIC. */
  lossRatioPct: number;
  /** Estimated incurred loss+DCC $B = lossRatio × domestic DWP. */
  estimatedIncurredB: number;
  confidence: Confidence;
};

/** Domestic DWP + total DWP (NAIC) and loss ratios (Aon from NAIC supplement). */
export const MARKET_SERIES: MarketYearRow[] = [
  {
    year: 2019,
    domesticDwpB: 2.26,
    totalDwpB: 3.36,
    lossRatioPct: 45,
    estimatedIncurredB: 1.02,
    confidence: "carried",
  },
  {
    year: 2020,
    domesticDwpB: 2.754,
    totalDwpB: 4.065,
    lossRatioPct: 67,
    estimatedIncurredB: 1.845,
    confidence: "disclosed",
  },
  {
    year: 2021,
    domesticDwpB: 4.827,
    totalDwpB: 6.543,
    lossRatioPct: 66,
    estimatedIncurredB: 3.186,
    confidence: "disclosed",
  },
  {
    year: 2022,
    domesticDwpB: 7.265,
    totalDwpB: 9.686,
    lossRatioPct: 45,
    estimatedIncurredB: 3.269,
    confidence: "disclosed",
  },
  {
    year: 2023,
    domesticDwpB: 7.248,
    totalDwpB: 9.843,
    lossRatioPct: 42,
    estimatedIncurredB: 3.044,
    confidence: "disclosed",
  },
  {
    year: 2024,
    domesticDwpB: 7.083,
    totalDwpB: 9.144,
    lossRatioPct: 49,
    estimatedIncurredB: 3.471,
    confidence: "disclosed",
  },
];

export type PremiumScope = "domestic" | "total";

export function premiumFor(row: MarketYearRow, scope: PremiumScope): number {
  return scope === "domestic" ? row.domesticDwpB : row.totalDwpB;
}

/** Indexed growth (2020 = 100) for premium vs estimated incurred. */
export function indexedSeries(scope: PremiumScope = "domestic") {
  const base = MARKET_SERIES.find((r) => r.year === 2020)!;
  const basePrem = premiumFor(base, scope);
  const baseLoss = base.estimatedIncurredB;
  return MARKET_SERIES.filter((r) => r.year >= 2020).map((r) => ({
    year: r.year,
    premiumIndex: (premiumFor(r, scope) / basePrem) * 100,
    lossIndex: (r.estimatedIncurredB / baseLoss) * 100,
    lossRatioPct: r.lossRatioPct,
    premiumB: premiumFor(r, scope),
    estimatedIncurredB: r.estimatedIncurredB,
  }));
}

export type PolicyStructureRow = {
  id: "primary" | "excess" | "endorsement";
  label: string;
  premiumSharePct: number;
  /** Closure rate closed/reported (NAIC 2024). */
  closureRatePct: number;
  confidence: Confidence;
};

export const POLICY_STRUCTURE_2024: PolicyStructureRow[] = [
  {
    id: "primary",
    label: "Primary",
    premiumSharePct: 65,
    closureRatePct: 83.93,
    confidence: "disclosed",
  },
  {
    id: "excess",
    label: "Excess",
    premiumSharePct: 31,
    closureRatePct: 76.84,
    confidence: "disclosed",
  },
  {
    id: "endorsement",
    label: "Endorsement",
    premiumSharePct: 4,
    closureRatePct: 91.52,
    confidence: "disclosed",
  },
];

export type ClaimsOutcomeRow = {
  id: string;
  label: string;
  count: number;
  confidence: Confidence;
};

/** NAIC 2024 closed claims with vs without payment (all structures). */
export const CLAIMS_OUTCOMES_2024: ClaimsOutcomeRow[] = [
  {
    id: "with-payment",
    label: "Closed with payment",
    count: 9941,
    confidence: "disclosed",
  },
  {
    id: "without-payment",
    label: "Closed without payment",
    count: 28555,
    confidence: "disclosed",
  },
];

export type Ic3ThreatRow = {
  year: number;
  ransomwareComplaints: number;
  ransomwareLossesM: number;
  becComplaints: number;
  becLossesB: number;
  personalDataBreachLossesB: number;
  totalIc3LossesB: number;
  confidence: Confidence;
};

export const IC3_THREAT_SERIES: Ic3ThreatRow[] = [
  {
    year: 2022,
    ransomwareComplaints: 2385,
    ransomwareLossesM: 34.35,
    becComplaints: 21832,
    becLossesB: 2.74,
    personalDataBreachLossesB: 0.74,
    totalIc3LossesB: 10.3,
    confidence: "disclosed",
  },
  {
    year: 2023,
    ransomwareComplaints: 2825,
    ransomwareLossesM: 59.64,
    becComplaints: 21489,
    becLossesB: 2.95,
    personalDataBreachLossesB: 0.54,
    totalIc3LossesB: 12.5,
    confidence: "disclosed",
  },
  {
    year: 2024,
    ransomwareComplaints: 3156,
    ransomwareLossesM: 12.47,
    becComplaints: 21442,
    becLossesB: 2.77,
    personalDataBreachLossesB: 1.45,
    totalIc3LossesB: 16.6,
    confidence: "disclosed",
  },
];

/**
 * Desk estimate of cyber insurance claim-driver mix by severity contribution.
 * Not a NAIC statutory breakout — labeled estimated for viz only.
 */
export type ClaimDriverRow = {
  id: string;
  label: string;
  severitySharePct: number;
  note: string;
  confidence: Confidence;
};

export const CLAIM_DRIVER_MIX_2024: ClaimDriverRow[] = [
  {
    id: "ransomware-bi",
    label: "Ransomware + business interruption",
    severitySharePct: 48,
    note: "Still the severity anchor for first-party cyber; frequency up, paid ransom severity down (broker reports).",
    confidence: "estimated",
  },
  {
    id: "funds-transfer-bec",
    label: "Funds transfer / BEC",
    severitySharePct: 22,
    note: "IC3 shows BEC as a multi-billion external loss class; insurer coverage depends on crime vs cyber forms.",
    confidence: "estimated",
  },
  {
    id: "privacy-third-party",
    label: "Privacy / third-party liability",
    severitySharePct: 18,
    note: "Third-party share of reported cyber claims rose to ~25% in 2024 (Aon/NAIC).",
    confidence: "estimated",
  },
  {
    id: "other-first-party",
    label: "Other first-party (forensics, notification, fraud)",
    severitySharePct: 12,
    note: "Residual first-party costs outside ransomware BI towers.",
    confidence: "estimated",
  },
];

export type SofteningRow = {
  year: number;
  /** YoY % change in domestic DWP. */
  dwpYoYPct: number;
  lossRatioPct: number;
  phase: "hardening" | "peak" | "softening";
};

export const MARKET_PHASES: SofteningRow[] = [
  { year: 2020, dwpYoYPct: 21.7, lossRatioPct: 67, phase: "hardening" },
  { year: 2021, dwpYoYPct: 75.3, lossRatioPct: 66, phase: "hardening" },
  { year: 2022, dwpYoYPct: 50.5, lossRatioPct: 45, phase: "peak" },
  { year: 2023, dwpYoYPct: -0.2, lossRatioPct: 42, phase: "softening" },
  { year: 2024, dwpYoYPct: -2.3, lossRatioPct: 49, phase: "softening" },
];

export function fmtB(n: number, digits = 2): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtM(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}M`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtIndex(n: number): string {
  return n.toFixed(0);
}

export function growthPct(from: number, to: number): number {
  if (from === 0) return 0;
  return ((to - from) / from) * 100;
}
