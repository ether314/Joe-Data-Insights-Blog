/**
 * Consumer finance & household balance sheets — geography lens (2026).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * How are households saving, borrowing, and allocating retail money?
 *
 * Complements concentration (percentile / issuer tips) and tape updates with
 * Census-region debt shares, top-state mortgage ladders, delinquency geography,
 * deposit/cash parking by region, and a debt×risk scatter.
 *
 * Primary sources (latest published / carried vintages as of Aug 2026):
 * - NY Fed Household Debt and Credit — state / regional balance aggregates
 * - Fed G.19 — consumer credit (national revolving context)
 * - FDIC Summary of Deposits — commercial-bank deposit geography
 * - Theme baselines: research-2026, concentration-2026, update-202608
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Census-region and top-state debt shares roll NY Fed Household Debt and Credit state aggregates into Census Bureau regions / large-state tips against the ~$18.9T 2026Q2 national perimeter (theme Q3 / Aug tape). Delinquency rates by region are estimated from NY Fed product transition patterns and regional credit reports, labeled estimated. Deposit shares follow FDIC Summary of Deposits commercial-bank geography (not credit-union or MMF domicile). Wealth / housing-equity regional weights are analytical DFA×geography composites — not official Fed regional DFA cells. Confidence tags separate disclosed national anchors from regional roll-ups.";

export const SOURCES = [
  {
    label: "NY Fed — Household Debt and Credit",
    url: "https://www.newyorkfed.org/microeconomics/hhdc",
  },
  {
    label: "Fed G.19 — Consumer Credit",
    url: "https://www.federalreserve.gov/releases/g19/current/",
  },
  {
    label: "FDIC — Summary of Deposits",
    url: "https://www.fdic.gov/analysis/quarterly-banking-profile/summary-of-deposits/",
  },
  {
    label: "Theme research roll-up",
    url: "/blog/consumer-finance-markets-research-2026",
  },
  {
    label: "Concentration lens",
    url: "/blog/consumer-finance-markets-concentration-2026",
  },
  {
    label: "Aug 202608 vintage update",
    url: "/blog/consumer-finance-markets-update-202608",
  },
] as const;

export const PRIOR_RESEARCH_PATH = "/blog/consumer-finance-markets-research-2026";
export const PRIOR_CONCENTRATION_PATH =
  "/blog/consumer-finance-markets-concentration-2026";
export const PRIOR_CONC_Q3_PATH =
  "/blog/consumer-finance-markets-concentration-2026q3";
export const PRIOR_UPDATE_PATH = "/blog/consumer-finance-markets-update-202608";
export const PRIOR_DELINQ_PATH = "/blog/us-household-debt-delinquency-split-2026";
export const PRIOR_MMF_PATH = "/blog/money-market-funds-vs-deposits-2026";

export const HEADLINE = {
  asOfDebt: "NY Fed 2026Q2 / theme Aug tape",
  asOfDeposits: "FDIC SOD latest published window",
  totalDebtTn: 18.926,
  revolvingTn: 1.351,
  depositsTn: 14.98,
  mmfTn: 7.928,
  /** Debt stock — West leads Census regions */
  top1RegionSharePct: 28,
  top1RegionLabel: "West",
  top1RegionDebtTn: 5.3,
  top3RegionSharePct: 78,
  top3RegionLabel: "West · South · Northeast",
  /** California tip inside national mortgage / HH debt */
  top1StateSharePct: 15.2,
  top1StateLabel: "California",
  top1StateDebtTn: 2.88,
  top4StateSharePct: 38,
  top4StateLabel: "CA · TX · FL · NY",
  /** Risk geography — South leads serious card delinquency */
  top1DelinqRegion: "South",
  top1CardDelinqPct: 8.4,
  northeastCardDelinqPct: 5.9,
  nationalCardDelinqPct: 7.2,
  /** Deposit geography — Northeast still thick on $ */
  top1DepositRegionSharePct: 32,
  top1DepositRegionLabel: "Northeast",
  westDepositSharePct: 24,
  southDepositSharePct: 28,
  midwestDepositSharePct: 16,
} as const;

export type CensusRegion = {
  id: string;
  region: string;
  short: string;
  debtTn: number;
  sharePct: number;
  cumulativeSharePct: number;
  mortgageSharePct: number;
  revolvingSharePct: number;
  popSharePct: number;
  cardDelinq90Pct: number;
  depositSharePct: number;
  housingEquitySharePct: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Census-region roll-up of NY Fed household debt vs ~$18.9T perimeter.
 * Debt shares are estimated from state aggregates; product mix and delinquency
 * are regional composites labeled estimated where not a single disclosed cell.
 */
export const CENSUS_REGIONS: CensusRegion[] = [
  {
    id: "west",
    region: "West",
    short: "West",
    debtTn: 5.3,
    sharePct: 28.0,
    cumulativeSharePct: 28.0,
    mortgageSharePct: 30.5,
    revolvingSharePct: 24.0,
    popSharePct: 23.5,
    cardDelinq90Pct: 6.8,
    depositSharePct: 24.0,
    housingEquitySharePct: 31.0,
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "CA tip + WA/OR/CO growth; mortgage-heavy vs population",
  },
  {
    id: "south",
    region: "South",
    short: "South",
    debtTn: 5.1,
    sharePct: 27.0,
    cumulativeSharePct: 55.0,
    mortgageSharePct: 26.0,
    revolvingSharePct: 32.0,
    popSharePct: 38.0,
    cardDelinq90Pct: 8.4,
    depositSharePct: 28.0,
    housingEquitySharePct: 24.0,
    confidence: "estimated",
    fill: "#f59e0b",
    note: "TX·FL·GA debt growth; revolving & delinquency overweight",
  },
  {
    id: "northeast",
    region: "Northeast",
    short: "Northeast",
    debtTn: 4.35,
    sharePct: 23.0,
    cumulativeSharePct: 78.0,
    mortgageSharePct: 24.5,
    revolvingSharePct: 20.0,
    popSharePct: 17.0,
    cardDelinq90Pct: 5.9,
    depositSharePct: 32.0,
    housingEquitySharePct: 27.0,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "NY·NJ·MA wealth/deposit tip; lower card stress, high balances",
  },
  {
    id: "midwest",
    region: "Midwest",
    short: "Midwest",
    debtTn: 4.18,
    sharePct: 22.0,
    cumulativeSharePct: 100,
    mortgageSharePct: 19.0,
    revolvingSharePct: 24.0,
    popSharePct: 21.5,
    cardDelinq90Pct: 7.1,
    depositSharePct: 16.0,
    housingEquitySharePct: 18.0,
    confidence: "estimated",
    fill: "#14b8a6",
    note: "More proportional to population; thinner deposit share",
  },
];

export type StateDebtRow = {
  rank: number;
  state: string;
  abbrev: string;
  region: string;
  debtTn: number;
  sharePct: number;
  mortgageTn: number;
  revolvingBn: number;
  cardDelinq90Pct: number;
  confidence: Confidence;
  fill: string;
};

/** Top-state household debt ladder (NY Fed state aggregates, rounded). */
export const TOP_STATES: StateDebtRow[] = [
  {
    rank: 1,
    state: "California",
    abbrev: "CA",
    region: "West",
    debtTn: 2.88,
    sharePct: 15.2,
    mortgageTn: 2.35,
    revolvingBn: 145,
    cardDelinq90Pct: 6.5,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    rank: 2,
    state: "Texas",
    abbrev: "TX",
    region: "South",
    debtTn: 1.55,
    sharePct: 8.2,
    mortgageTn: 1.05,
    revolvingBn: 118,
    cardDelinq90Pct: 8.1,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    rank: 3,
    state: "Florida",
    abbrev: "FL",
    region: "South",
    debtTn: 1.42,
    sharePct: 7.5,
    mortgageTn: 0.98,
    revolvingBn: 105,
    cardDelinq90Pct: 8.6,
    confidence: "estimated",
    fill: "#fb923c",
  },
  {
    rank: 4,
    state: "New York",
    abbrev: "NY",
    region: "Northeast",
    debtTn: 1.35,
    sharePct: 7.1,
    mortgageTn: 1.05,
    revolvingBn: 88,
    cardDelinq90Pct: 5.8,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    rank: 5,
    state: "Pennsylvania",
    abbrev: "PA",
    region: "Northeast",
    debtTn: 0.62,
    sharePct: 3.3,
    mortgageTn: 0.42,
    revolvingBn: 48,
    cardDelinq90Pct: 6.2,
    confidence: "estimated",
    fill: "#a78bfa",
  },
  {
    rank: 6,
    state: "Illinois",
    abbrev: "IL",
    region: "Midwest",
    debtTn: 0.58,
    sharePct: 3.1,
    mortgageTn: 0.4,
    revolvingBn: 46,
    cardDelinq90Pct: 7.0,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    rank: 7,
    state: "Georgia",
    abbrev: "GA",
    region: "South",
    debtTn: 0.55,
    sharePct: 2.9,
    mortgageTn: 0.36,
    revolvingBn: 52,
    cardDelinq90Pct: 8.8,
    confidence: "estimated",
    fill: "#fbbf24",
  },
  {
    rank: 8,
    state: "New Jersey",
    abbrev: "NJ",
    region: "Northeast",
    debtTn: 0.52,
    sharePct: 2.7,
    mortgageTn: 0.4,
    revolvingBn: 38,
    cardDelinq90Pct: 5.7,
    confidence: "estimated",
    fill: "#c4b5fd",
  },
  {
    rank: 9,
    state: "Ohio",
    abbrev: "OH",
    region: "Midwest",
    debtTn: 0.48,
    sharePct: 2.5,
    mortgageTn: 0.3,
    revolvingBn: 42,
    cardDelinq90Pct: 7.3,
    confidence: "estimated",
    fill: "#2dd4bf",
  },
  {
    rank: 10,
    state: "North Carolina",
    abbrev: "NC",
    region: "South",
    debtTn: 0.46,
    sharePct: 2.4,
    mortgageTn: 0.32,
    revolvingBn: 40,
    cardDelinq90Pct: 8.0,
    confidence: "estimated",
    fill: "#fcd34d",
  },
];

export type ProductGeoRow = {
  product: string;
  short: string;
  westPct: number;
  southPct: number;
  northeastPct: number;
  midwestPct: number;
  top1Region: string;
  top1SharePct: number;
  nationalTn: number;
  confidence: Confidence;
  fill: string;
};

/** Product-mix geography: same regions, different tips by liability type. */
export const PRODUCT_GEO: ProductGeoRow[] = [
  {
    product: "Mortgage",
    short: "Mortgage",
    westPct: 30.5,
    southPct: 26.0,
    northeastPct: 24.5,
    midwestPct: 19.0,
    top1Region: "West",
    top1SharePct: 30.5,
    nationalTn: 13.25,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    product: "HELOC",
    short: "HELOC",
    westPct: 28.0,
    southPct: 24.0,
    northeastPct: 30.0,
    midwestPct: 18.0,
    top1Region: "Northeast",
    top1SharePct: 30.0,
    nationalTn: 0.42,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    product: "Auto",
    short: "Auto",
    westPct: 24.0,
    southPct: 34.0,
    northeastPct: 18.0,
    midwestPct: 24.0,
    top1Region: "South",
    top1SharePct: 34.0,
    nationalTn: 1.66,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    product: "Credit card / revolving",
    short: "Cards",
    westPct: 24.0,
    southPct: 32.0,
    northeastPct: 20.0,
    midwestPct: 24.0,
    top1Region: "South",
    top1SharePct: 32.0,
    nationalTn: 1.351,
    confidence: "estimated",
    fill: "#ef4444",
  },
  {
    product: "Student",
    short: "Student",
    westPct: 22.0,
    southPct: 30.0,
    northeastPct: 26.0,
    midwestPct: 22.0,
    top1Region: "South",
    top1SharePct: 30.0,
    nationalTn: 1.64,
    confidence: "estimated",
    fill: "#14b8a6",
  },
];

export type CashParkingRow = {
  id: string;
  region: string;
  short: string;
  depositSharePct: number;
  depositTn: number;
  mmfProxySharePct: number;
  wealthProxySharePct: number;
  debtSharePct: number;
  confidence: Confidence;
  fill: string;
};

/**
 * Cash / capacity geography: FDIC deposit shares vs debt shares and
 * analytical MMF / wealth proxies (not official regional MMF AUM).
 */
export const CASH_PARKING: CashParkingRow[] = [
  {
    id: "northeast",
    region: "Northeast",
    short: "NE",
    depositSharePct: 32,
    depositTn: 4.79,
    mmfProxySharePct: 38,
    wealthProxySharePct: 34,
    debtSharePct: 23,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    id: "south",
    region: "South",
    short: "South",
    depositSharePct: 28,
    depositTn: 4.19,
    mmfProxySharePct: 24,
    wealthProxySharePct: 24,
    debtSharePct: 27,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "west",
    region: "West",
    short: "West",
    depositSharePct: 24,
    depositTn: 3.6,
    mmfProxySharePct: 26,
    wealthProxySharePct: 28,
    debtSharePct: 28,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "midwest",
    region: "Midwest",
    short: "MW",
    depositSharePct: 16,
    depositTn: 2.4,
    mmfProxySharePct: 12,
    wealthProxySharePct: 14,
    debtSharePct: 22,
    confidence: "estimated",
    fill: "#14b8a6",
  },
];

export type MeterRow = {
  id: string;
  label: string;
  top1Label: string;
  top1SharePct: number;
  top3SharePct: number;
  unit: string;
  fill: string;
  note: string;
};

export const METER_COMPARE: MeterRow[] = [
  {
    id: "debt",
    label: "HH debt stock",
    top1Label: "West",
    top1SharePct: 28,
    top3SharePct: 78,
    unit: "% of $18.9T",
    fill: "#0ea5e9",
    note: "Census regions vs NY Fed perimeter",
  },
  {
    id: "mortgage",
    label: "Mortgage balances",
    top1Label: "West",
    top1SharePct: 30.5,
    top3SharePct: 81,
    unit: "% of mortgage book",
    fill: "#38bdf8",
    note: "CA tip lifts West above population",
  },
  {
    id: "state",
    label: "Top-state debt",
    top1Label: "California",
    top1SharePct: 15.2,
    top3SharePct: 30.9,
    unit: "% of national HH debt",
    fill: "#f43f5e",
    note: "CA alone ≈ next two states combined",
  },
  {
    id: "revolving",
    label: "Revolving / cards",
    top1Label: "South",
    top1SharePct: 32,
    top3SharePct: 80,
    unit: "% of revolving",
    fill: "#ef4444",
    note: "Risk & balance tip diverge from mortgages",
  },
  {
    id: "deposits",
    label: "Bank deposits",
    top1Label: "Northeast",
    top1SharePct: 32,
    top3SharePct: 84,
    unit: "% of SOD deposits",
    fill: "#8b5cf6",
    note: "Cash capacity ≠ debt activity map",
  },
  {
    id: "delinq",
    label: "Card 90+ stress",
    top1Label: "South (rate)",
    top1SharePct: 8.4,
    top3SharePct: 0,
    unit: "90+ transition %",
    fill: "#f59e0b",
    note: "Rate meter, not dollar share",
  },
];

export function debtRiskScatter() {
  return CENSUS_REGIONS.map((r) => ({
    region: r.region,
    short: r.short,
    x: r.sharePct,
    y: r.cardDelinq90Pct,
    z: r.debtTn,
    debtTn: r.debtTn,
    depositSharePct: r.depositSharePct,
    fill: r.fill,
  }));
}

export function productStackedRows() {
  return PRODUCT_GEO.map((p) => ({
    product: p.short,
    West: p.westPct,
    South: p.southPct,
    Northeast: p.northeastPct,
    Midwest: p.midwestPct,
    top1: p.top1Region,
    top1SharePct: p.top1SharePct,
    fill: p.fill,
  }));
}

export function cashCapacityScatter() {
  return CASH_PARKING.map((r) => ({
    region: r.region,
    short: r.short,
    x: r.debtSharePct,
    y: r.depositSharePct,
    z: r.wealthProxySharePct,
    mmfProxySharePct: r.mmfProxySharePct,
    depositTn: r.depositTn,
    fill: r.fill,
  }));
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtTn(n: number, digits = 2): string {
  return `$${n.toFixed(digits)}T`;
}

export function fmtBn(n: number, digits = 0): string {
  return `$${n.toFixed(digits)}B`;
}
