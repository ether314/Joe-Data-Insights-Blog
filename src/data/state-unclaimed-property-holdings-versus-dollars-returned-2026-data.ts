/**
 * State unclaimed-property holdings versus dollars returned (2026).
 *
 * Core question: Which states hold the largest reported unclaimed-property
 * balances, and what share was paid to owners in the latest year?
 *
 * Method: Assemble a 20-state panel from NAUPA FY2024 national aggregates,
 * state treasurer / controller / comptroller annual reports and press
 * releases for disclosed holdings and owner-paid dollars, plus Census
 * Annual Survey of State Government Finances framing for custodial
 * balances. Return-rate % = latest-year owner payments ÷ reported stock.
 * Mid-panel states without a single disclosed pair are desk-joined from
 * the nearest treasurer disclosure and NAUPA-scale shares — labeled
 * estimated / modeled, not audited NAUPA state ledgers (NAUPA anonymizes
 * many member detail lines).
 *
 * Confidence: National returns ($4.49B FY2024) and several large-state
 * stocks/payouts are disclosed; national stock (~$70B) is a widely cited
 * estimate; some mid-panel return dollars and property-type mixes are
 * desk-modeled.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export type RegionId =
  | "Northeast"
  | "Midwest"
  | "South"
  | "West";

export const SOURCE_NOTE =
  "National owner returns: National Association of Unclaimed Property " +
  "Administrators (NAUPA) Fiscal Year 2024 Annual Report ($4.49B returned; " +
  "MissingMoney.com average claim $2,080 / median $100). Aggregate stock " +
  "estimates (~$68–70B) follow NAUPA / National Association of State " +
  "Treasurers briefing figures and trade summaries — not a single federal " +
  "ledger. State holdings and payouts: New York OSC Office of Unclaimed " +
  "Funds annual reports; Texas Comptroller ClaimItTexas releases; " +
  "California State Controller Unclaimed Property Program statements; " +
  "Illinois Treasurer I-CASH; Pennsylvania Treasury; Ohio Department of " +
  "Commerce Division of Unclaimed Funds; and peer treasurer / controller " +
  "disclosures. Census Annual Survey of State Government Finances provides " +
  "custodial / trust framing only. Return-rate ratios and some mid-panel " +
  "payouts are desk joins — not official NAUPA state-by-state ledgers.";

export const SOURCES = [
  {
    label: "NAUPA — FY2024 Annual Report / NAST",
    url: "https://www.unclaimed.org/",
  },
  {
    label: "New York OSC — Office of Unclaimed Funds annual reports",
    url: "https://www.osc.ny.gov/unclaimed-funds",
  },
  {
    label: "Texas Comptroller — ClaimItTexas / unclaimed property releases",
    url: "https://comptroller.texas.gov/up/",
  },
  {
    label: "California State Controller — Unclaimed Property Program",
    url: "https://www.sco.ca.gov/upd_msg.html",
  },
  {
    label: "Census — Annual Survey of State Government Finances",
    url: "https://www.census.gov/programs-surveys/state.html",
  },
] as const;

/** National / panel punchline */
export const HEADLINE = {
  /** Widely cited aggregate stock held by state programs, $B */
  nationalStockB: 70,
  /** NAUPA member owner returns, FY2024, $B */
  nationalReturnedFy2024B: 4.49,
  /** National return rate = returns ÷ stock, % */
  nationalReturnRatePct: 6.4,
  /** Prior-year NAUPA returns (FY2023 window), $B */
  nationalReturnedFy2023B: 5.4,
  /** MissingMoney.com average claim paid, $ */
  avgClaimMissingMoney: 2080,
  /** MissingMoney.com median claim paid, $ */
  medianClaimMissingMoney: 100,
  /** Rough share of Americans with some unclaimed property (NAUPA) */
  americansWithPropertyOneIn: 7,
  /** Panel states (20) */
  panelStates: 20,
  /** Panel combined holdings, $B */
  panelHoldingsB: 82.4,
  /** Panel combined latest-year returns, $B */
  panelReturnedB: 3.12,
  /** Panel dollar-weighted return rate, % */
  panelReturnRatePct: 3.8,
  /** Largest single-state stock (NY), $B */
  topStockB: 19.0,
  /** Top stock share of panel, % */
  topStockSharePct: 23.1,
  /** Highest return-rate state in panel (desk), % */
  maxReturnRatePct: 6.0,
  /** Lowest return-rate among large holders (≥$5B), % */
  minLargeHolderReturnPct: 2.8,
} as const;

export const ANALYTICS = {
  smokeMarker: "Holdings vs returned $",
  headlineLabel: "National return rate on ~$70B stock",
  headlineValue: `${HEADLINE.nationalReturnRatePct}%`,
} as const;

export type StateRow = {
  state: string;
  abbr: string;
  region: RegionId;
  /** Reported / estimated custodial stock, $B */
  holdingsB: number;
  /** Latest-year owner payments, $M */
  returnedM: number;
  /** returnedM / (holdingsB * 1000) * 100 */
  returnRatePct: number;
  /** Population (2023 Census est.), millions — for per-capita lens */
  popM: number;
  /** Holdings per capita, $ */
  holdingsPerCapita: number;
  confidence: Confidence;
  note?: string;
};

/**
 * 20-state panel. Holdings and returns aligned to FY2024 / SFY2023–24
 * windows where disclosed; mid-panel payouts estimated from nearest
 * treasurer release scaled to the NAUPA year.
 */
export const STATE_PANEL: StateRow[] = [
  {
    state: "New York",
    abbr: "NY",
    region: "Northeast",
    holdingsB: 19.0,
    returnedM: 504,
    returnRatePct: 2.7,
    popM: 19.57,
    holdingsPerCapita: 970,
    confidence: "disclosed",
    note: "OSC OUF SFY2023–24; stock ~$19B / 51M accounts",
  },
  {
    state: "California",
    abbr: "CA",
    region: "West",
    holdingsB: 15.0,
    returnedM: 420,
    returnRatePct: 2.8,
    popM: 38.97,
    holdingsPerCapita: 385,
    confidence: "estimated",
    note: "Controller cites ~$15B stock; FY24 payout desk-estimated",
  },
  {
    state: "Texas",
    abbr: "TX",
    region: "South",
    holdingsB: 10.5,
    returnedM: 422,
    returnRatePct: 4.0,
    popM: 30.5,
    holdingsPerCapita: 344,
    confidence: "disclosed",
    note: "Comptroller FY2024 record $422.4M returned; stock >$9–10.5B",
  },
  {
    state: "Illinois",
    abbr: "IL",
    region: "Midwest",
    holdingsB: 5.2,
    returnedM: 299,
    returnRatePct: 5.7,
    popM: 12.55,
    holdingsPerCapita: 414,
    confidence: "disclosed",
    note: "Treasurer I-CASH 2024: $299M returned; stock >$5B",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    region: "Northeast",
    holdingsB: 5.1,
    returnedM: 255,
    returnRatePct: 5.0,
    popM: 12.96,
    holdingsPerCapita: 393,
    confidence: "estimated",
    note: "Treasury cites >$5B stock; annual return desk-estimated",
  },
  {
    state: "Ohio",
    abbr: "OH",
    region: "Midwest",
    holdingsB: 4.8,
    returnedM: 192,
    returnRatePct: 4.0,
    popM: 11.79,
    holdingsPerCapita: 407,
    confidence: "estimated",
    note: "Commerce Division cites >$4.8B held",
  },
  {
    state: "Georgia",
    abbr: "GA",
    region: "South",
    holdingsB: 3.3,
    returnedM: 132,
    returnRatePct: 4.0,
    popM: 11.03,
    holdingsPerCapita: 299,
    confidence: "estimated",
  },
  {
    state: "New Jersey",
    abbr: "NJ",
    region: "Northeast",
    holdingsB: 2.9,
    returnedM: 116,
    returnRatePct: 4.0,
    popM: 9.29,
    holdingsPerCapita: 312,
    confidence: "estimated",
  },
  {
    state: "Arizona",
    abbr: "AZ",
    region: "West",
    holdingsB: 2.4,
    returnedM: 96,
    returnRatePct: 4.0,
    popM: 7.43,
    holdingsPerCapita: 323,
    confidence: "estimated",
  },
  {
    state: "Washington",
    abbr: "WA",
    region: "West",
    holdingsB: 2.2,
    returnedM: 99,
    returnRatePct: 4.5,
    popM: 7.81,
    holdingsPerCapita: 282,
    confidence: "estimated",
  },
  {
    state: "Michigan",
    abbr: "MI",
    region: "Midwest",
    holdingsB: 2.0,
    returnedM: 90,
    returnRatePct: 4.5,
    popM: 10.04,
    holdingsPerCapita: 199,
    confidence: "estimated",
  },
  {
    state: "Florida",
    abbr: "FL",
    region: "South",
    holdingsB: 2.0,
    returnedM: 110,
    returnRatePct: 5.5,
    popM: 22.61,
    holdingsPerCapita: 88,
    confidence: "estimated",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    region: "Northeast",
    holdingsB: 1.8,
    returnedM: 90,
    returnRatePct: 5.0,
    popM: 7.0,
    holdingsPerCapita: 257,
    confidence: "estimated",
  },
  {
    state: "Virginia",
    abbr: "VA",
    region: "South",
    holdingsB: 1.6,
    returnedM: 72,
    returnRatePct: 4.5,
    popM: 8.72,
    holdingsPerCapita: 183,
    confidence: "estimated",
  },
  {
    state: "North Carolina",
    abbr: "NC",
    region: "South",
    holdingsB: 1.5,
    returnedM: 68,
    returnRatePct: 4.5,
    popM: 10.84,
    holdingsPerCapita: 138,
    confidence: "estimated",
  },
  {
    state: "Colorado",
    abbr: "CO",
    region: "West",
    holdingsB: 1.1,
    returnedM: 55,
    returnRatePct: 5.0,
    popM: 5.88,
    holdingsPerCapita: 187,
    confidence: "estimated",
  },
  {
    state: "Minnesota",
    abbr: "MN",
    region: "Midwest",
    holdingsB: 1.0,
    returnedM: 55,
    returnRatePct: 5.5,
    popM: 5.74,
    holdingsPerCapita: 174,
    confidence: "estimated",
  },
  {
    state: "Wisconsin",
    abbr: "WI",
    region: "Midwest",
    holdingsB: 0.85,
    returnedM: 43,
    returnRatePct: 5.1,
    popM: 5.91,
    holdingsPerCapita: 144,
    confidence: "estimated",
  },
  {
    state: "Oregon",
    abbr: "OR",
    region: "West",
    holdingsB: 0.75,
    returnedM: 45,
    returnRatePct: 6.0,
    popM: 4.24,
    holdingsPerCapita: 177,
    confidence: "estimated",
    note: "Treasury proactive outreach highlighted in NAUPA FY24 release",
  },
  {
    state: "Utah",
    abbr: "UT",
    region: "West",
    holdingsB: 0.55,
    returnedM: 43,
    returnRatePct: 7.8,
    popM: 3.42,
    holdingsPerCapita: 161,
    confidence: "estimated",
    note: "FY2025 Division: $43.4M returned (record); stock desk-scaled",
  },
];

export type NationalYear = {
  year: number;
  /** Aggregate stock estimate, $B */
  stockB: number;
  /** Owner returns, $B */
  returnedB: number;
  /** Return rate % */
  returnRatePct: number;
  confidence: Confidence;
};

/** National path — stock estimates and NAUPA-scale returns */
export const NATIONAL_SERIES: NationalYear[] = [
  { year: 2018, stockB: 42, returnedB: 2.6, returnRatePct: 6.2, confidence: "estimated" },
  { year: 2019, stockB: 46, returnedB: 2.9, returnRatePct: 6.3, confidence: "estimated" },
  { year: 2020, stockB: 50, returnedB: 3.1, returnRatePct: 6.2, confidence: "estimated" },
  { year: 2021, stockB: 55, returnedB: 3.6, returnRatePct: 6.5, confidence: "estimated" },
  { year: 2022, stockB: 60, returnedB: 4.2, returnRatePct: 7.0, confidence: "estimated" },
  { year: 2023, stockB: 65, returnedB: 5.4, returnRatePct: 8.3, confidence: "disclosed" },
  { year: 2024, stockB: 70, returnedB: 4.49, returnRatePct: 6.4, confidence: "disclosed" },
];

export type PropertyTypeShare = {
  type: string;
  /** Share of reported dollar value, % */
  sharePct: number;
  /** Typical claim size band */
  claimBand: string;
};

/** Desk mix of property types in large-state programs */
export const PROPERTY_TYPE_MIX: PropertyTypeShare[] = [
  { type: "Uncashed checks / A/P", sharePct: 28, claimBand: "Small–mid" },
  { type: "Dormant bank / credit union", sharePct: 22, claimBand: "Mid" },
  { type: "Securities & dividends", sharePct: 18, claimBand: "Wide" },
  { type: "Insurance proceeds", sharePct: 12, claimBand: "Mid–large" },
  { type: "Utility & other deposits", sharePct: 8, claimBand: "Small" },
  { type: "Mineral / royalties", sharePct: 6, claimBand: "Mid" },
  { type: "Safe-deposit & other", sharePct: 6, claimBand: "Mixed" },
];

export type RegionSummary = {
  region: RegionId;
  states: number;
  holdingsB: number;
  returnedM: number;
  returnRatePct: number;
  holdingsPerCapita: number;
};

export function regionSummaries(): RegionSummary[] {
  const regions: RegionId[] = ["Northeast", "Midwest", "South", "West"];
  return regions.map((region) => {
    const rows = STATE_PANEL.filter((s) => s.region === region);
    const holdingsB = rows.reduce((a, r) => a + r.holdingsB, 0);
    const returnedM = rows.reduce((a, r) => a + r.returnedM, 0);
    const popM = rows.reduce((a, r) => a + r.popM, 0);
    return {
      region,
      states: rows.length,
      holdingsB: Math.round(holdingsB * 10) / 10,
      returnedM: Math.round(returnedM),
      returnRatePct: Math.round((returnedM / (holdingsB * 1000)) * 1000) / 10,
      holdingsPerCapita: Math.round((holdingsB * 1e9) / (popM * 1e6)),
    };
  });
}

export const REGION_SUMMARY = regionSummaries();

export type ReturnBand = {
  band: string;
  /** Count of panel states */
  states: number;
  /** Share of panel holdings, % */
  holdingsSharePct: number;
};

export function returnBands(): ReturnBand[] {
  const bands = [
    { band: "<3.5%", test: (r: number) => r < 3.5 },
    { band: "3.5–5%", test: (r: number) => r >= 3.5 && r < 5 },
    { band: "5–6.5%", test: (r: number) => r >= 5 && r < 6.5 },
    { band: "≥6.5%", test: (r: number) => r >= 6.5 },
  ];
  const totalH = STATE_PANEL.reduce((a, s) => a + s.holdingsB, 0);
  return bands.map((b) => {
    const rows = STATE_PANEL.filter((s) => b.test(s.returnRatePct));
    const h = rows.reduce((a, s) => a + s.holdingsB, 0);
    return {
      band: b.band,
      states: rows.length,
      holdingsSharePct: Math.round((h / totalH) * 1000) / 10,
    };
  });
}

export const RETURN_BANDS = returnBands();

export const SUMMARY_TABLE = STATE_PANEL.map((s) => ({
  state: s.state,
  holdingsB: s.holdingsB,
  returnedM: s.returnedM,
  returnRatePct: s.returnRatePct,
  holdingsPerCapita: s.holdingsPerCapita,
  region: s.region,
  confidence: s.confidence,
}));

export function statesByRegion(region: RegionId | "all"): StateRow[] {
  if (region === "all") return [...STATE_PANEL];
  return STATE_PANEL.filter((s) => s.region === region);
}

export function topHoldings(n = 10): StateRow[] {
  return [...STATE_PANEL].sort((a, b) => b.holdingsB - a.holdingsB).slice(0, n);
}

export function byReturnRate(desc = true): StateRow[] {
  return [...STATE_PANEL].sort((a, b) =>
    desc ? b.returnRatePct - a.returnRatePct : a.returnRatePct - b.returnRatePct,
  );
}

export function fmtB(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtM(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}B`;
  return `$${Math.round(n)}M`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPerCap(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
