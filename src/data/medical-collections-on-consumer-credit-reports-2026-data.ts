/**
 * Medical collections on consumer credit reports — 2026 desk.
 *
 * Core question: How much collections debt is medical by state and credit-score
 * band, and which populations still carry balances after the 2022–23 reporting
 * changes?
 *
 * Primary anchors: CFPB Consumer Credit Panel (CCP) data points on medical
 * collections reporting changes (July 2022 paid/delay; April 2023 <$500);
 * CFPB Market Snapshot / FDCPA annual report medical share of third-party
 * collections tradelines; Urban Institute August 2024 credit bureau panel
 * (Debt in America / ban-impact brief).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "National prevalence: CFPB CCP — share of consumers with ≥1 medical collections tradeline fell from ~14% (Mar 2022) to ~5% (Jun 2023); Urban Institute August 2024 credit bureau panel prints 4.1% (~9.7M consumers), down from ~27M in August 2022. Medical share of third-party collections tradelines: CFPB Market Snapshot Q1 2022 = 57%; CFPB FDCPA Annual Report 2024 cites Q1 2023 = 36% after the <$500 removal. Remaining balances: CFPB Mar 2024 Data Point — avg total medical collections balance among remaining holders rose from ~$2,091 (Mar 2022) to ~$3,149 (Jun 2023); nationwide balances fell ~38% while consumer share fell ~two-thirds. Mean credit score among remaining holders: 598.2 → 582.0. State prevalence Aug 2024: Urban ban-impact brief (Oklahoma 8.8% high; Colorado and New York 0% under 2023 state bans). State ladder mixes Urban disclosed anchors with desk-carried rates for remaining states calibrated to South-high / Northeast-low geography in CFPB maps — labeled estimated where not published in the brief. Score-band shares among remaining holders are desk estimates calibrated to the disclosed Jun 2023 mean score of 582. Credit records are not the universe of medical debt owed.";

export const SOURCES = [
  {
    label:
      "CFPB — Recent Changes in Medical Collections on Consumer Credit Records (Mar 2024)",
    url: "https://www.consumerfinance.gov/data-research/research-reports/recent-changes-in-medical-collections-on-consumer-credit-records/",
  },
  {
    label:
      "CFPB — Paid and Low-Balance Medical Collections on Consumer Credit Reports (Jul 2022)",
    url: "https://www.consumerfinance.gov/data-research/research-reports/paid-and-low-balance-medical-collections-on-consumer-credit-reports/",
  },
  {
    label:
      "CFPB — Market Snapshot: Third-Party Debt Collections Tradelines (Feb 2023)",
    url: "https://www.consumerfinance.gov/data-research/research-reports/market-snapshot-third-party-debt-collections-tradelines-reporting/",
  },
  {
    label: "CFPB — FDCPA Annual Report 2024 (medical share 36%)",
    url: "https://files.consumerfinance.gov/f/documents/cfpb_fdcpa-2024-annual-report_2024-09.pdf",
  },
  {
    label:
      "Urban Institute — How Many Consumers Would Be Affected by a Potential Ban on Medical Debt (Apr 2025)",
    url: "https://www.urban.org/research/publication/how-many-consumers-would-be-affected-potential-ban-medical-debt-credit-reports",
  },
  {
    label: "Urban Institute — Debt in America interactive / credit bureau panel",
    url: "https://apps.urban.org/features/debt-interactive-map/?type=medical&variable=medcoll",
  },
] as const;

export const VIZ_MARKERS = [
  "Medical share of collections — 57%→36%",
  "Remaining holders mean score 582",
  "Oklahoma prevalence 8.8%",
] as const;

/** Headline punchline — medical share of third-party collections tradelines */
export const HEADLINE = {
  /** Medical share of third-party collections tradelines, Q1 2022 (%) */
  medicalShareQ1_2022: 57,
  /** Medical share of third-party collections tradelines, Q1 2023 (%) */
  medicalShareQ1_2023: 36,
  /** Percentage-point drop in medical share */
  medicalShareDropPp: 21,
  /** Share of consumers with ≥1 medical collection, Mar 2022 (%) */
  prevalenceMar2022: 14,
  /** Share of consumers with ≥1 medical collection, Jun 2023 (%) */
  prevalenceJun2023: 5,
  /** Urban Aug 2024 prevalence (%) */
  prevalenceAug2024: 4.1,
  /** Consumers with medical collections Aug 2022 (millions) */
  consumersAug2022M: 27,
  /** Consumers with medical collections Aug 2024 (millions) */
  consumersAug2024M: 9.7,
  /** Avg medical collections balance remaining holders Jun 2023 ($) */
  avgBalanceJun2023: 3149,
  /** Avg medical collections balance Mar 2022 ($) */
  avgBalanceMar2022: 2091,
  /** Nationwide medical collections balances decline Mar 2022→Jun 2023 (%) */
  balanceDeclinePct: 38,
  /** Mean credit score of remaining medical-collections holders Jun 2023 */
  meanScoreJun2023: 582,
  /** Mean credit score Mar 2022 */
  meanScoreMar2022: 598.2,
  /** Highest Urban Aug 2024 state prevalence — Oklahoma (%) */
  oklahomaRate2024: 8.8,
  /** Median balance among those with medical debt Aug 2024 ($) */
  medianBalanceAug2024: 1465,
  /** Medical collections remaining on CCP-scaled records Jun 2023 ($B, lower bound) */
  remainingBalancesBn: 49.2,
  /** Share age 62+ with medical collections Mar 2022 (%) */
  age62PlusMar2022: 8.4,
  /** Share age 62+ with medical collections Jun 2023 (%) */
  age62PlusJun2023: 2.7,
} as const;

export type RegionId = "Northeast" | "Midwest" | "South" | "West";

export interface StateMedicalRow {
  abbr: string;
  name: string;
  region: RegionId;
  /** Urban Aug 2024 share with medical debt in collections (%) */
  prevalence2024: number;
  /** Desk-carried / CFPB-pattern Mar 2022 prevalence proxy (%) */
  prevalence2022: number;
  /** Estimated medical share of remaining collections tradelines (%) */
  medicalShareOfCollections: number;
  /** Estimated avg medical collections balance among holders ($) */
  avgBalance: number;
  /** Medicaid expansion as of 2024 (approx) */
  medicaidExpanded: boolean;
  /** State ban on medical debt credit reporting active by Aug 2024 */
  stateBan: boolean;
  confidence: Confidence;
}

/**
 * State panel: Urban Aug 2024 disclosed for OK / CO / NY / national shape;
 * other prevalences are desk estimates calibrated to CFPB South-high geography
 * and Urban Debt in America rank order — not a full appendix dump.
 */
export const STATE_PANEL: StateMedicalRow[] = [
  { abbr: "OK", name: "Oklahoma", region: "South", prevalence2024: 8.8, prevalence2022: 19.2, medicalShareOfCollections: 44, avgBalance: 3380, medicaidExpanded: false, stateBan: false, confidence: "disclosed" },
  { abbr: "MS", name: "Mississippi", region: "South", prevalence2024: 8.1, prevalence2022: 20.4, medicalShareOfCollections: 46, avgBalance: 3520, medicaidExpanded: false, stateBan: false, confidence: "estimated" },
  { abbr: "LA", name: "Louisiana", region: "South", prevalence2024: 7.6, prevalence2022: 18.8, medicalShareOfCollections: 43, avgBalance: 3410, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "TX", name: "Texas", region: "South", prevalence2024: 7.4, prevalence2022: 17.6, medicalShareOfCollections: 42, avgBalance: 3290, medicaidExpanded: false, stateBan: false, confidence: "estimated" },
  { abbr: "AL", name: "Alabama", region: "South", prevalence2024: 7.2, prevalence2022: 18.1, medicalShareOfCollections: 45, avgBalance: 3350, medicaidExpanded: false, stateBan: false, confidence: "estimated" },
  { abbr: "AR", name: "Arkansas", region: "South", prevalence2024: 7.0, prevalence2022: 17.4, medicalShareOfCollections: 44, avgBalance: 3180, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "SC", name: "South Carolina", region: "South", prevalence2024: 6.8, prevalence2022: 16.9, medicalShareOfCollections: 41, avgBalance: 3120, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "TN", name: "Tennessee", region: "South", prevalence2024: 6.7, prevalence2022: 16.5, medicalShareOfCollections: 42, avgBalance: 3210, medicaidExpanded: false, stateBan: false, confidence: "estimated" },
  { abbr: "GA", name: "Georgia", region: "South", prevalence2024: 6.5, prevalence2022: 16.2, medicalShareOfCollections: 40, avgBalance: 3080, medicaidExpanded: false, stateBan: false, confidence: "estimated" },
  { abbr: "WV", name: "West Virginia", region: "South", prevalence2024: 6.3, prevalence2022: 22.0, medicalShareOfCollections: 38, avgBalance: 2980, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "KY", name: "Kentucky", region: "South", prevalence2024: 6.1, prevalence2022: 15.4, medicalShareOfCollections: 39, avgBalance: 3050, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "NC", name: "North Carolina", region: "South", prevalence2024: 5.9, prevalence2022: 15.1, medicalShareOfCollections: 40, avgBalance: 3010, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "FL", name: "Florida", region: "South", prevalence2024: 5.6, prevalence2022: 14.2, medicalShareOfCollections: 37, avgBalance: 2890, medicaidExpanded: false, stateBan: false, confidence: "estimated" },
  { abbr: "MO", name: "Missouri", region: "Midwest", prevalence2024: 5.5, prevalence2022: 14.8, medicalShareOfCollections: 39, avgBalance: 2950, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "IN", name: "Indiana", region: "Midwest", prevalence2024: 5.3, prevalence2022: 13.9, medicalShareOfCollections: 38, avgBalance: 2860, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "NV", name: "Nevada", region: "West", prevalence2024: 5.2, prevalence2022: 12.8, medicalShareOfCollections: 41, avgBalance: 3420, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "OH", name: "Ohio", region: "Midwest", prevalence2024: 5.0, prevalence2022: 13.2, medicalShareOfCollections: 37, avgBalance: 2780, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "AZ", name: "Arizona", region: "West", prevalence2024: 4.9, prevalence2022: 12.4, medicalShareOfCollections: 36, avgBalance: 2740, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "KS", name: "Kansas", region: "Midwest", prevalence2024: 4.8, prevalence2022: 12.9, medicalShareOfCollections: 38, avgBalance: 2820, medicaidExpanded: false, stateBan: false, confidence: "estimated" },
  { abbr: "WY", name: "Wyoming", region: "West", prevalence2024: 4.7, prevalence2022: 11.6, medicalShareOfCollections: 40, avgBalance: 3100, medicaidExpanded: false, stateBan: false, confidence: "estimated" },
  { abbr: "NM", name: "New Mexico", region: "West", prevalence2024: 4.6, prevalence2022: 13.5, medicalShareOfCollections: 37, avgBalance: 2910, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "MI", name: "Michigan", region: "Midwest", prevalence2024: 4.4, prevalence2022: 11.8, medicalShareOfCollections: 35, avgBalance: 2680, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "PA", name: "Pennsylvania", region: "Northeast", prevalence2024: 4.2, prevalence2022: 11.2, medicalShareOfCollections: 34, avgBalance: 2620, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "WI", name: "Wisconsin", region: "Midwest", prevalence2024: 4.0, prevalence2022: 10.6, medicalShareOfCollections: 33, avgBalance: 2550, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "IL", name: "Illinois", region: "Midwest", prevalence2024: 3.9, prevalence2022: 11.0, medicalShareOfCollections: 34, avgBalance: 2590, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "VA", name: "Virginia", region: "South", prevalence2024: 3.8, prevalence2022: 10.4, medicalShareOfCollections: 33, avgBalance: 2510, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "IA", name: "Iowa", region: "Midwest", prevalence2024: 3.6, prevalence2022: 9.8, medicalShareOfCollections: 32, avgBalance: 2480, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "OR", name: "Oregon", region: "West", prevalence2024: 3.4, prevalence2022: 9.2, medicalShareOfCollections: 31, avgBalance: 2420, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "WA", name: "Washington", region: "West", prevalence2024: 3.2, prevalence2022: 8.6, medicalShareOfCollections: 30, avgBalance: 2380, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "MD", name: "Maryland", region: "Northeast", prevalence2024: 3.1, prevalence2022: 8.4, medicalShareOfCollections: 29, avgBalance: 2350, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "MN", name: "Minnesota", region: "Midwest", prevalence2024: 2.9, prevalence2022: 8.1, medicalShareOfCollections: 28, avgBalance: 2290, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "NJ", name: "New Jersey", region: "Northeast", prevalence2024: 2.8, prevalence2022: 7.9, medicalShareOfCollections: 28, avgBalance: 2310, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "CT", name: "Connecticut", region: "Northeast", prevalence2024: 2.6, prevalence2022: 7.4, medicalShareOfCollections: 27, avgBalance: 2240, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "CA", name: "California", region: "West", prevalence2024: 2.5, prevalence2022: 7.8, medicalShareOfCollections: 26, avgBalance: 2210, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "MA", name: "Massachusetts", region: "Northeast", prevalence2024: 2.2, prevalence2022: 6.5, medicalShareOfCollections: 24, avgBalance: 2080, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "UT", name: "Utah", region: "West", prevalence2024: 2.1, prevalence2022: 9.4, medicalShareOfCollections: 22, avgBalance: 1980, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "HI", name: "Hawaii", region: "West", prevalence2024: 1.8, prevalence2022: 5.4, medicalShareOfCollections: 23, avgBalance: 2150, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "AK", name: "Alaska", region: "West", prevalence2024: 3.5, prevalence2022: 4.3, medicalShareOfCollections: 35, avgBalance: 3200, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "DC", name: "District of Columbia", region: "South", prevalence2024: 2.0, prevalence2022: 6.9, medicalShareOfCollections: 25, avgBalance: 2180, medicaidExpanded: true, stateBan: false, confidence: "estimated" },
  { abbr: "CO", name: "Colorado", region: "West", prevalence2024: 0, prevalence2022: 9.6, medicalShareOfCollections: 0, avgBalance: 0, medicaidExpanded: true, stateBan: true, confidence: "disclosed" },
  { abbr: "NY", name: "New York", region: "Northeast", prevalence2024: 0, prevalence2022: 8.8, medicalShareOfCollections: 0, avgBalance: 0, medicaidExpanded: true, stateBan: true, confidence: "disclosed" },
];

/** National vintage — consumer share with medical collections */
export const PREVALENCE_VINTAGE = [
  { period: "2018 Q1", label: "2018", sharePct: 18.5, source: "CFPB trend", confidence: "carried" as Confidence },
  { period: "2019 Q1", label: "2019", sharePct: 17.2, source: "CFPB trend", confidence: "carried" as Confidence },
  { period: "2020 Q1", label: "2020", sharePct: 16.0, source: "CFPB trend", confidence: "carried" as Confidence },
  { period: "2021 Q1", label: "2021", sharePct: 15.0, source: "CFPB trend", confidence: "carried" as Confidence },
  { period: "2022 Mar", label: "Mar 2022", sharePct: 14.0, source: "CFPB CCP", confidence: "disclosed" as Confidence },
  { period: "2022 Jun", label: "Jun 2022", sharePct: 12.0, source: "CFPB CCP", confidence: "estimated" as Confidence },
  { period: "2022 Dec", label: "Dec 2022", sharePct: 10.5, source: "CFPB CCP", confidence: "estimated" as Confidence },
  { period: "2023 Mar", label: "Mar 2023", sharePct: 7.0, source: "CFPB CCP", confidence: "estimated" as Confidence },
  { period: "2023 Jun", label: "Jun 2023", sharePct: 5.0, source: "CFPB CCP", confidence: "disclosed" as Confidence },
  { period: "2024 Aug", label: "Aug 2024", sharePct: 4.1, source: "Urban", confidence: "disclosed" as Confidence },
];

/** Medical share of third-party collections tradelines */
export const MEDICAL_SHARE_VINTAGE = [
  { period: "2018", medicalSharePct: 58, confidence: "carried" as Confidence },
  { period: "2019", medicalSharePct: 58, confidence: "carried" as Confidence },
  { period: "2020", medicalSharePct: 57, confidence: "carried" as Confidence },
  { period: "2021", medicalSharePct: 57, confidence: "carried" as Confidence },
  { period: "2022 Q1", medicalSharePct: 57, confidence: "disclosed" as Confidence },
  { period: "2023 Q1", medicalSharePct: 36, confidence: "disclosed" as Confidence },
];

export type ScoreBandId =
  | "deep-subprime"
  | "subprime"
  | "near-prime"
  | "prime-plus";

export interface ScoreBandRow {
  id: ScoreBandId;
  label: string;
  scoreRange: string;
  /** Share of remaining medical-collections holders in band (%) */
  shareOfHolders: number;
  /** Estimated prevalence of medical collections within band (%) */
  prevalenceInBand: number;
  /** Estimated medical share of collections tradelines in band (%) */
  medicalShareOfCollections: number;
  /** Mean balance among holders in band ($) */
  avgBalance: number;
  confidence: Confidence;
}

/** Remaining holders Jun 2023 — desk estimates calibrated to mean score 582 */
export const SCORE_BANDS: ScoreBandRow[] = [
  {
    id: "deep-subprime",
    label: "Deep subprime",
    scoreRange: "<580",
    shareOfHolders: 48,
    prevalenceInBand: 18.5,
    medicalShareOfCollections: 52,
    avgBalance: 3680,
    confidence: "estimated",
  },
  {
    id: "subprime",
    label: "Subprime",
    scoreRange: "580–619",
    shareOfHolders: 28,
    prevalenceInBand: 9.2,
    medicalShareOfCollections: 41,
    avgBalance: 3120,
    confidence: "estimated",
  },
  {
    id: "near-prime",
    label: "Near-prime",
    scoreRange: "620–659",
    shareOfHolders: 16,
    prevalenceInBand: 3.8,
    medicalShareOfCollections: 29,
    avgBalance: 2540,
    confidence: "estimated",
  },
  {
    id: "prime-plus",
    label: "Prime+",
    scoreRange: "660+",
    shareOfHolders: 8,
    prevalenceInBand: 1.1,
    medicalShareOfCollections: 18,
    avgBalance: 1980,
    confidence: "estimated",
  },
];

/** Age composition of medical-collections holders — CFPB Table 1 */
export const AGE_HOLDER_MIX = [
  { age: "18–29", mar2022: 15.0, jun2023: 15.8 },
  { age: "30–44", mar2022: 33.5, jun2023: 37.4 },
  { age: "45–61", mar2022: 31.2, jun2023: 31.2 },
  { age: "62+", mar2022: 18.1, jun2023: 14.8 },
];

/** Age prevalence (share of age group with medical collections) — CFPB Fig 2 anchors */
export const AGE_PREVALENCE = [
  { age: "18–29", mar2022: 12.8, jun2023: 5.1, confidence: "estimated" as Confidence },
  { age: "30–44", mar2022: 16.2, jun2023: 6.4, confidence: "estimated" as Confidence },
  { age: "45–61", mar2022: 15.5, jun2023: 5.8, confidence: "estimated" as Confidence },
  { age: "62+", mar2022: 8.4, jun2023: 2.7, confidence: "disclosed" as Confidence },
];

/** Reporting-change milestones for timeline panel */
export const REPORTING_MILESTONES = [
  {
    date: "2022-07",
    label: "Jul 2022",
    detail: "Paid medical collections off reports; reporting delay 180d → 1 year",
  },
  {
    date: "2023-04",
    label: "Apr 2023",
    detail: "Unpaid medical collections under $500 removed",
  },
  {
    date: "2023-08",
    label: "2023+",
    detail: "CO / NY state bans; VantageScore excludes medical collections",
  },
] as const;

/** Balance path among remaining holders */
export const BALANCE_PATH = [
  { period: "Mar 2022", avgBalance: 2090.9, meanScore: 598.2, pctUnder500: 65.2 },
  { period: "Dec 2022", avgBalance: 1886.8, meanScore: 591.8, pctUnder500: 62.2 },
  { period: "Jun 2023", avgBalance: 3148.7, meanScore: 582.0, pctUnder500: 0 },
];

/** Region summary — desk aggregation of STATE_PANEL */
export const REGION_SUMMARY = (
  ["South", "Midwest", "West", "Northeast"] as RegionId[]
).map((region) => {
  const rows = STATE_PANEL.filter((s) => s.region === region && !s.stateBan);
  const n = rows.length || 1;
  return {
    region,
    meanPrevalence2024: +(rows.reduce((a, s) => a + s.prevalence2024, 0) / n).toFixed(1),
    meanMedicalShare: +(
      rows.reduce((a, s) => a + s.medicalShareOfCollections, 0) / n
    ).toFixed(0),
    meanAvgBalance: Math.round(
      rows.reduce((a, s) => a + s.avgBalance, 0) / n,
    ),
    states: rows.length,
  };
});

export function statesByRegion(region: RegionId | "all"): StateMedicalRow[] {
  if (region === "all") return STATE_PANEL;
  return STATE_PANEL.filter((s) => s.region === region);
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function fmtPp(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} pp`;
}
