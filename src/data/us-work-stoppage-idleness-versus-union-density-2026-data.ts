/**
 * US major-work-stoppage idleness versus union density (2026).
 *
 * Core question: How do BLS major-work-stoppage idle days compare with
 * union coverage by industry — are strikes happening where density is
 * already high?
 *
 * Primary anchors: BLS Work Stoppages Program (major stoppages ≥1,000
 * workers); BLS Union Members news release Table 3 (CPS).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Idle-day and workers-idled figures are BLS major work stoppages (involving 1,000 or more workers lasting at least one weekday shift). Industry idle-day cross-sections use the BLS Economics Daily industry table for stoppages that began in 2024; annual aggregates use the BLS annual listing through 2025. Union membership and representation (coverage) rates are 2025 CPS annual averages from the Union Members news release Table 3 (11-month averages excluding October 2025 due to the federal shutdown — not strictly comparable with prior years). Utilities appear with zero 2024 major-stoppage idle days because the industry was absent from the published industry idle-day table. Representation = members plus non-members covered by a union contract. Desk ratios (idle days per coverage point) are analytical, not BLS products. Stoppages include strikes and lockouts; BLS does not separate them.";

export const SOURCES = [
  {
    label: "BLS — Major Work Stoppages in 2025 (news release)",
    url: "https://www.bls.gov/news.release/wkstp.htm",
  },
  {
    label: "BLS — Major Work Stoppages annual listing (1947–present)",
    url: "https://www.bls.gov/web/wkstp/annual-listing.htm",
  },
  {
    label: "BLS TED — 271,500 workers idled in major stoppages, 2024 (industry table)",
    url: "https://www.bls.gov/opub/ted/2025/271500-workers-idled-during-major-work-stoppages-in-2024.htm",
  },
  {
    label: "BLS TED — 33 major work stoppages began in 2023 (industry workers)",
    url: "https://www.bls.gov/opub/ted/2024/33-major-work-stoppages-began-in-2023.htm",
  },
  {
    label: "BLS — Union Members 2025 (Table 3 by industry)",
    url: "https://www.bls.gov/news.release/union2.htm",
  },
  {
    label: "BLS TED — Union membership rate 10.0 percent in 2025",
    url: "https://www.bls.gov/opub/ted/2026/union-membership-rate-10-0-percent-in-2025.htm",
  },
] as const;

/** Headline punchline — idle days vs coverage */
export const HEADLINE = {
  /** Manufacturing cumulative days idle, stoppages beginning 2024 */
  mfgDaysIdle2024: 1_316_000,
  /** Manufacturing union membership rate, 2025 (%) */
  mfgMembership2025: 7.7,
  /** Educational services workers idled, stoppages beginning 2024 */
  eduWorkers2024: 110_400,
  /** Educational services days idle, 2024 */
  eduDaysIdle2024: 782_200,
  /** Educational services membership rate, 2025 (%) */
  eduMembership2025: 13.4,
  /** Utilities membership rate, 2025 (%) — highest major private industry */
  utilitiesMembership2025: 17.8,
  /** Utilities major-stoppage days idle on 2024 industry table */
  utilitiesDaysIdle2024: 0,
  /** National union membership rate, 2025 (%) */
  nationalMembership2025: 10.0,
  /** National representation (coverage) rate, 2025 (%) */
  nationalCoverage2025: 11.1,
  /** Public-sector membership, 2025 (%) */
  publicMembership2025: 32.9,
  /** Private-sector membership, 2025 (%) */
  privateMembership2025: 5.9,
  /** Total days idle, all major stoppages, 2025 (thousands in BLS listing = 1991.2) */
  totalDaysIdle2025: 1_991_200,
  /** Total days idle, 2024 */
  totalDaysIdle2024: 3_364_100,
  /** Total days idle, 2023 (Hollywood + auto spike year) */
  totalDaysIdle2023: 16_673_000,
  /** Workers idled in stoppages beginning 2025 */
  workersIdled2025: 306_800,
  /** Private share of 2025 cumulative days idle */
  privateDaysIdle2025: 784_400,
  /** State+local government days idle, stoppages beginning 2025 */
  govDaysIdle2025: 711_600,
  /**
   * Desk: manufacturing idle-day lead at mid-single-digit density vs
   * utilities’ peak private density with no 2024 major-idle entry.
   */
  mfgVsUtilitiesIdleGap: 1_316_000,
} as const;

export type IndustryId =
  | "manufacturing"
  | "educational_services"
  | "information"
  | "accommodation_food"
  | "health_care"
  | "other_services"
  | "construction"
  | "transportation_warehousing"
  | "retail_trade"
  | "admin_support"
  | "utilities";

export type IndustryBand = "goods" | "services" | "infra";

export type IndustryCrossRow = {
  id: IndustryId;
  label: string;
  band: IndustryBand;
  /** Workers involved in major stoppages beginning 2024 */
  workers2024: number;
  /** Cumulative days idle, stoppages beginning 2024 */
  daysIdle2024: number;
  /** Union membership rate, 2025 CPS (%) */
  membershipPct2025: number;
  /** Union representation (coverage) rate, 2025 CPS (%) */
  coveragePct2025: number;
  /** Idle days per coverage percentage point (desk) */
  idlePerCoveragePt: number;
  confidence: Confidence;
  note: string;
};

/**
 * 2024 major-stoppage industry table × 2025 CPS union rates.
 * Utilities row is a disclosed zero (absent from idle-day table).
 */
export const INDUSTRY_CROSS_2024: IndustryCrossRow[] = [
  {
    id: "manufacturing",
    label: "Manufacturing",
    band: "goods",
    workers2024: 38_000,
    daysIdle2024: 1_316_000,
    membershipPct2025: 7.7,
    coveragePct2025: 8.4,
    idlePerCoveragePt: Math.round(1_316_000 / 8.4),
    confidence: "disclosed",
    note: "Largest 2024 idle-day total; mid-single-digit private density.",
  },
  {
    id: "educational_services",
    label: "Educational services",
    band: "services",
    workers2024: 110_400,
    daysIdle2024: 782_200,
    membershipPct2025: 13.4,
    coveragePct2025: 15.7,
    idlePerCoveragePt: Math.round(782_200 / 15.7),
    confidence: "disclosed",
    note: "Most workers idled in 2024; elevated density via public teachers.",
  },
  {
    id: "information",
    label: "Information",
    band: "services",
    workers2024: 19_600,
    daysIdle2024: 620_800,
    membershipPct2025: 6.6,
    coveragePct2025: 7.6,
    idlePerCoveragePt: Math.round(620_800 / 7.6),
    confidence: "disclosed",
    note: "Long-duration media stoppages; density near private average.",
  },
  {
    id: "accommodation_food",
    label: "Accommodation & food",
    band: "services",
    workers2024: 16_400,
    daysIdle2024: 236_200,
    membershipPct2025: 2.4,
    coveragePct2025: 2.9,
    idlePerCoveragePt: Math.round(236_200 / 2.9),
    confidence: "disclosed",
    note: "Low density, still six-figure idle days.",
  },
  {
    id: "health_care",
    label: "Health care & social assistance",
    band: "services",
    workers2024: 16_100,
    daysIdle2024: 159_900,
    membershipPct2025: 6.8,
    coveragePct2025: 8.0,
    idlePerCoveragePt: Math.round(159_900 / 8.0),
    confidence: "disclosed",
    note: "Hospital/nursing disputes; density below education.",
  },
  {
    id: "other_services",
    label: "Other services (ex. public admin)",
    band: "services",
    workers2024: 47_000,
    daysIdle2024: 141_000,
    membershipPct2025: 3.5,
    coveragePct2025: 4.0,
    idlePerCoveragePt: Math.round(141_000 / 4.0),
    confidence: "disclosed",
    note: "High worker count, shorter average duration.",
  },
  {
    id: "construction",
    label: "Construction",
    band: "goods",
    workers2024: 1_000,
    daysIdle2024: 48_000,
    membershipPct2025: 11.1,
    coveragePct2025: 12.0,
    idlePerCoveragePt: Math.round(48_000 / 12.0),
    confidence: "disclosed",
    note: "Above-average private density; limited 2024 major idle volume.",
  },
  {
    id: "transportation_warehousing",
    label: "Transportation & warehousing",
    band: "infra",
    workers2024: 7_000,
    daysIdle2024: 28_000,
    membershipPct2025: 13.6,
    coveragePct2025: 14.9,
    idlePerCoveragePt: Math.round(28_000 / 14.9),
    confidence: "disclosed",
    note: "High private density with modest 2024 major idle days.",
  },
  {
    id: "retail_trade",
    label: "Retail trade",
    band: "services",
    workers2024: 12_000,
    daysIdle2024: 20_000,
    membershipPct2025: 4.0,
    coveragePct2025: 4.7,
    idlePerCoveragePt: Math.round(20_000 / 4.7),
    confidence: "disclosed",
    note: "Large employment base; thin major-stoppage footprint.",
  },
  {
    id: "admin_support",
    label: "Admin & support / waste mgmt",
    band: "services",
    workers2024: 4_000,
    daysIdle2024: 12_000,
    membershipPct2025: 2.1,
    coveragePct2025: 2.8,
    idlePerCoveragePt: Math.round(12_000 / 2.8),
    confidence: "estimated",
    note: "Coverage proxied from professional & business services CPS row.",
  },
  {
    id: "utilities",
    label: "Utilities",
    band: "infra",
    workers2024: 0,
    daysIdle2024: 0,
    membershipPct2025: 17.8,
    coveragePct2025: 18.8,
    idlePerCoveragePt: 0,
    confidence: "disclosed",
    note: "Highest major private membership rate; no 2024 major-idle table entry.",
  },
];

export type AnnualRow = {
  year: number;
  stoppagesBeginning: number;
  workersBeginningK: number;
  daysIdleK: number;
  confidence: Confidence;
};

/** BLS annual listing — days of idleness in thousands */
export const ANNUAL_SERIES: AnnualRow[] = [
  { year: 2016, stoppagesBeginning: 15, workersBeginningK: 99.4, daysIdleK: 1543.4, confidence: "disclosed" },
  { year: 2017, stoppagesBeginning: 7, workersBeginningK: 25.3, daysIdleK: 439.8, confidence: "disclosed" },
  { year: 2018, stoppagesBeginning: 20, workersBeginningK: 485.2, daysIdleK: 2815.4, confidence: "disclosed" },
  { year: 2019, stoppagesBeginning: 25, workersBeginningK: 425.5, daysIdleK: 3244.3, confidence: "disclosed" },
  { year: 2020, stoppagesBeginning: 8, workersBeginningK: 27.0, daysIdleK: 965.7, confidence: "disclosed" },
  { year: 2021, stoppagesBeginning: 16, workersBeginningK: 80.7, daysIdleK: 1551.9, confidence: "disclosed" },
  { year: 2022, stoppagesBeginning: 23, workersBeginningK: 120.6, daysIdleK: 2194.5, confidence: "disclosed" },
  { year: 2023, stoppagesBeginning: 33, workersBeginningK: 458.9, daysIdleK: 16673.0, confidence: "disclosed" },
  { year: 2024, stoppagesBeginning: 31, workersBeginningK: 271.5, daysIdleK: 3364.1, confidence: "disclosed" },
  { year: 2025, stoppagesBeginning: 30, workersBeginningK: 306.8, daysIdleK: 1991.2, confidence: "disclosed" },
];

export type OwnershipRow = {
  id: "private" | "government";
  label: string;
  year: 2024 | 2025;
  workers: number;
  daysIdle: number;
  membershipPct: number;
  coveragePct: number;
  confidence: Confidence;
};

/** Ownership split — 2024/2025 WSP + CPS public/private rates */
export const OWNERSHIP_SPLIT: OwnershipRow[] = [
  {
    id: "private",
    label: "Private industry",
    year: 2024,
    workers: 158_200,
    daysIdle: 2_997_400,
    membershipPct: 5.9,
    coveragePct: 6.7,
    confidence: "disclosed",
  },
  {
    id: "government",
    label: "State & local government",
    year: 2024,
    workers: 113_300,
    daysIdle: 366_700,
    membershipPct: 32.2,
    coveragePct: 35.7,
    confidence: "disclosed",
  },
  {
    id: "private",
    label: "Private industry",
    year: 2025,
    workers: 74_000,
    daysIdle: 784_400,
    membershipPct: 5.9,
    coveragePct: 6.8,
    confidence: "disclosed",
  },
  {
    id: "government",
    label: "State & local government",
    year: 2025,
    workers: 232_800,
    daysIdle: 711_600,
    membershipPct: 32.9,
    coveragePct: 36.4,
    confidence: "disclosed",
  },
];

export type DensityBucket = {
  id: string;
  label: string;
  /** Inclusive lower bound on coverage % */
  coverageMin: number;
  coverageMax: number;
  industries: IndustryId[];
  totalDaysIdle2024: number;
  meanCoveragePct: number;
};

export const DENSITY_BUCKETS: DensityBucket[] = (() => {
  const defs: {
    id: string;
    label: string;
    coverageMin: number;
    coverageMax: number;
    industries: IndustryId[];
  }[] = [
    {
      id: "low",
      label: "Coverage < 5%",
      coverageMin: 0,
      coverageMax: 5,
      industries: ["accommodation_food", "retail_trade", "admin_support", "other_services"],
    },
    {
      id: "mid",
      label: "Coverage 5–12%",
      coverageMin: 5,
      coverageMax: 12,
      industries: ["manufacturing", "information", "health_care"],
    },
    {
      id: "high",
      label: "Coverage ≥ 12%",
      coverageMin: 12,
      coverageMax: 100,
      industries: ["educational_services", "construction", "transportation_warehousing", "utilities"],
    },
  ];
  return defs.map((d) => {
    const rows = INDUSTRY_CROSS_2024.filter((r) => d.industries.includes(r.id));
    const totalDaysIdle2024 = rows.reduce((s, r) => s + r.daysIdle2024, 0);
    const meanCoveragePct =
      rows.reduce((s, r) => s + r.coveragePct2025, 0) / Math.max(rows.length, 1);
    return {
      id: d.id,
      label: d.label,
      coverageMin: d.coverageMin,
      coverageMax: d.coverageMax,
      industries: d.industries,
      totalDaysIdle2024,
      meanCoveragePct: Math.round(meanCoveragePct * 10) / 10,
    };
  });
})();

export type WorkersByIndustry2023 = {
  id: string;
  label: string;
  workers: number;
  membershipPct2025: number;
};

/** 2023 workers idled by industry (TED) — duration spike year context */
export const WORKERS_2023: WorkersByIndustry2023[] = [
  { id: "information", label: "Information", workers: 171_500, membershipPct2025: 6.6 },
  { id: "health_care", label: "Health care & social assistance", workers: 103_200, membershipPct2025: 6.8 },
  { id: "educational_services", label: "Educational services", workers: 85_700, membershipPct2025: 13.4 },
  { id: "manufacturing", label: "Manufacturing", workers: 61_200, membershipPct2025: 7.7 },
  { id: "accommodation_food", label: "Accommodation & food", workers: 15_000, membershipPct2025: 2.4 },
  { id: "admin_support", label: "Admin & support / waste", workers: 12_100, membershipPct2025: 2.1 },
  { id: "professional", label: "Professional & technical", workers: 4_300, membershipPct2025: 1.3 },
  { id: "arts", label: "Arts, entertainment & recreation", workers: 3_700, membershipPct2025: 3.0 },
  { id: "transportation_warehousing", label: "Transportation & warehousing", workers: 1_100, membershipPct2025: 13.6 },
  { id: "finance", label: "Finance & insurance", workers: 1_100, membershipPct2025: 1.0 },
];

export type SectorShare2025 = {
  id: string;
  label: string;
  workers: number;
  sharePct: number;
};

export const SECTOR_SHARE_2025: SectorShare2025[] = [
  {
    id: "edu_health",
    label: "Education & health services",
    workers: 196_500,
    sharePct: 64.0,
  },
  {
    id: "public_admin",
    label: "Public administration",
    workers: 82_300,
    sharePct: 26.8,
  },
  {
    id: "other_services",
    label: "Other service sectors",
    workers: 21_800,
    sharePct: 7.1,
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    workers: 6_200,
    sharePct: 2.0,
  },
];

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtK(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return fmtInt(n);
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function industriesByDaysIdle(): IndustryCrossRow[] {
  return [...INDUSTRY_CROSS_2024].sort((a, b) => b.daysIdle2024 - a.daysIdle2024);
}

export function industriesByCoverage(): IndustryCrossRow[] {
  return [...INDUSTRY_CROSS_2024].sort((a, b) => b.coveragePct2025 - a.coveragePct2025);
}

export function ownershipForYear(year: 2024 | 2025): OwnershipRow[] {
  return OWNERSHIP_SPLIT.filter((r) => r.year === year);
}
