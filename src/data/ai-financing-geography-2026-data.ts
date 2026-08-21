/**
 * AI financing — geography lens (2026).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * How is the build-out funded in credit and public markets?
 *
 * Complements issuer / channel concentration (Aug 202608 stock map ~$1.065T;
 * five-name IG YTD ~$194B) with HQ geography, facility-collateral maps,
 * currency/book placement, and ETF domicile shares.
 *
 * Primary sources:
 * - Chicago Booth Review / Stefan Hepp funded channel stock (Aug 7 2026)
 * - Goldman Sachs credit / Exchanges (IG path; AI ~18–23% of US IG)
 * - FactSet / Reuters–LSEG deal tallies (issuer HQ + currency sleeves)
 * - FactSet / ETF.com thematic flow summary (QQQ vs thematic; listing domicile)
 * - Synergy / CBRE-style DC capacity geography (desk roll-up for project finance)
 */

export type Confidence = "disclosed" | "estimated" | "desk" | "forecast";

export const SOURCE_NOTE =
  "Geography lens on the Aug 202608 Booth/Hepp funded AI-infra credit map (~$1.065T) and the five-name hyperscaler IG YTD spine (~$194B). HQ and currency shares are desk reconstructions from disclosed issuer domicile + FactSet currency tags — not regulator geographic segment filings. Facility/collateral shares for project/DC finance (~$250B) are capacity-weighted desk roll-ups (Synergy/CBRE-style), not lender geographic disclosures. ETF domicile shares use FactSet 2025 thematic listing tallies. Confidence tags separate disclosed issuer HQ from geographic estimates.";

export const PRIOR_RESEARCH_PATH = "/blog/ai-financing-research-2026";
export const PRIOR_UPDATE_PATH = "/blog/ai-financing-update-2026";
export const PRIOR_Q3_PATH = "/blog/ai-financing-update-2026q3";
export const PRIOR_STOCK_PATH = "/blog/ai-financing-update-202608";
export const PRIOR_CONCENTRATION_PATH = "/blog/ai-financing-concentration-202608";
export const PRIOR_LATE_AUG_CONC_PATH = "/blog/ai-financing-concentration-2026";
export const CAPEX_GEO_PATH = "/blog/ai-capex-spend-geography-2026";
export const ETF_PATH = "/blog/ai-etf-flows-qqq-vs-thematic-2025";
export const BOND_PATH = "/blog/hyperscaler-ai-corporate-bond-issuance-2025";

export const HEADLINE = {
  /** Primary spine — funded credit stock by economic / collateral geography */
  fundedStockBn: 1065,
  top1RegionSharePct: 72,
  top1RegionLabel: "United States",
  top1RegionBn: 767,
  top3RegionSharePct: 94,
  top3RegionLabel: "US · Europe · Asia-Pacific",
  top3RegionBn: 1001,
  /** HS IG issuer HQ (five-name YTD ~$194B) — US HQ = 100% */
  hsIgUniverseBn: 194,
  hsIgUsHqSharePct: 100,
  top1IssuerSharePct: 41,
  top1IssuerLabel: "Amazon (US HQ)",
  /** Project / DC facility collateral geography tip */
  projectDcBn: 250,
  projectUsSharePct: 52,
  projectEuropeSharePct: 24,
  projectApacSharePct: 18,
  /** Currency / book placement on HS IG flow */
  usdBookSharePct: 78,
  eurBookSharePct: 18,
  otherFxSharePct: 4,
  /** ETF listing domicile (thematic + QQQ 2025 flows ~$43.5B) */
  etfFlowsBn: 43.5,
  etfUsListingSharePct: 91,
  qqqFlowsBn: 21.7,
  /** Private credit GP HQ vs asset location mismatch tip */
  privateCreditBn: 200,
  privateGpUsSharePct: 84,
  privateAssetUsSharePct: 48,
  /** Lease overhang geography (S&P ~$675B) — US densification tip */
  leaseOverhangBn: 675,
  leaseUsSharePct: 68,
  /** Channel reminders */
  hsSeniorBn: 520,
  channelTop3Pct: 91,
} as const;

export type RegionRow = {
  region: string;
  short: string;
  amountBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  hsIgBn: number;
  projectBn: number;
  privateBn: number;
  otherBn: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Funded AI-infra credit stock (~$1.065T) by economic / collateral geography.
 * HS IG attributed to issuer HQ (US); project/private/ABS/GPU attributed to
 * facility or borrower geography desk roll-up.
 */
/**
 * Funded stock by region. Channel tips (hs/project/private/other) sum to amountBn.
 * HS IG (~$520B) is attributed entirely to US issuer HQ; project/private/other
 * follow facility / borrower geography so US funded share (~72%) sits below
 * US HQ share (100% of HS IG).
 */
export const REGION_ROWS: RegionRow[] = [
  {
    region: "United States",
    short: "US",
    amountBn: 767,
    sharePct: 72.0,
    cumulativeSharePct: 72.0,
    hsIgBn: 520,
    projectBn: 130,
    privateBn: 96,
    otherBn: 21,
    confidence: "estimated",
    fill: "#3b82f6",
    note: "All HS IG HQ + ~52% of project collateral + ~48% of private assets",
  },
  {
    region: "Europe",
    short: "Europe",
    amountBn: 138,
    sharePct: 13.0,
    cumulativeSharePct: 85.0,
    hsIgBn: 0,
    projectBn: 60,
    privateBn: 48,
    otherBn: 30,
    confidence: "estimated",
    fill: "#06b6d4",
    note: "Ireland / Nordics / DE-NL project finance + EUR structured sleeves",
  },
  {
    region: "Asia-Pacific",
    short: "APAC",
    amountBn: 96,
    sharePct: 9.0,
    cumulativeSharePct: 94.0,
    hsIgBn: 0,
    projectBn: 45,
    privateBn: 32,
    otherBn: 19,
    confidence: "estimated",
    fill: "#22c55e",
    note: "JP / SG / IN / AU facility debt; thin vs US HQ IG",
  },
  {
    region: "Middle East & Africa",
    short: "MEA",
    amountBn: 32,
    sharePct: 3.0,
    cumulativeSharePct: 97.0,
    hsIgBn: 0,
    projectBn: 8,
    privateBn: 12,
    otherBn: 12,
    confidence: "desk",
    fill: "#f59e0b",
    note: "UAE / Saudi sovereign AI campus financing tips",
  },
  {
    region: "Latin America",
    short: "LatAm",
    amountBn: 16,
    sharePct: 1.5,
    cumulativeSharePct: 98.5,
    hsIgBn: 0,
    projectBn: 4,
    privateBn: 6,
    otherBn: 6,
    confidence: "desk",
    fill: "#a855f7",
    note: "Brazil tip; residual ecosystem credit",
  },
  {
    region: "Residual / cross-border",
    short: "Residual",
    amountBn: 16,
    sharePct: 1.5,
    cumulativeSharePct: 100.0,
    hsIgBn: 0,
    projectBn: 3,
    privateBn: 6,
    otherBn: 7,
    confidence: "desk",
    fill: "#64748b",
    note: "Closes $1.065T; multi-jurisdiction SPVs + unallocated",
  },
];

export type FacilityRegion = {
  region: string;
  short: string;
  amountBn: number;
  sharePct: number;
  topCorridor: string;
  powerRisk: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Project / data-centre finance collateral geography (~$250B). */
export const FACILITY_REGIONS: FacilityRegion[] = [
  {
    region: "United States",
    short: "US",
    amountBn: 130,
    sharePct: 52.0,
    topCorridor: "NoVA / Texas / Midwest",
    powerRisk: 88,
    confidence: "estimated",
    fill: "#2563eb",
    note: "Largest disclosed campus densification + interconnect queues",
  },
  {
    region: "Europe",
    short: "Europe",
    amountBn: 60,
    sharePct: 24.0,
    topCorridor: "Dublin / Nordics / Frankfurt",
    powerRisk: 74,
    confidence: "estimated",
    fill: "#06b6d4",
  },
  {
    region: "Asia-Pacific",
    short: "APAC",
    amountBn: 45,
    sharePct: 18.0,
    topCorridor: "Tokyo / Singapore / Mumbai",
    powerRisk: 71,
    confidence: "estimated",
    fill: "#22c55e",
  },
  {
    region: "MEA + LatAm + residual",
    short: "Other",
    amountBn: 15,
    sharePct: 6.0,
    topCorridor: "UAE / São Paulo",
    powerRisk: 55,
    confidence: "desk",
    fill: "#94a3b8",
  },
];

export type UsCorridor = {
  id: string;
  label: string;
  short: string;
  projectBn: number;
  shareOfUsProjectPct: number;
  shareOfGlobalProjectPct: number;
  leaseTipBn: number;
  growthYoYPct: number;
  riskScore: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** US project-finance corridors inside the US facility slice (~$130B). */
export const US_CORRIDORS: UsCorridor[] = [
  {
    id: "nova",
    label: "Northern Virginia",
    short: "NoVA",
    projectBn: 32,
    shareOfUsProjectPct: 24.6,
    shareOfGlobalProjectPct: 12.8,
    leaseTipBn: 95,
    growthYoYPct: 22,
    riskScore: 92,
    confidence: "estimated",
    fill: "#1d4ed8",
    note: "Largest facility-tied credit densification tip",
  },
  {
    id: "texas",
    label: "Texas (Dallas / Central)",
    short: "Texas",
    projectBn: 24,
    shareOfUsProjectPct: 18.5,
    shareOfGlobalProjectPct: 9.6,
    leaseTipBn: 72,
    growthYoYPct: 48,
    riskScore: 78,
    confidence: "estimated",
    fill: "#f97316",
  },
  {
    id: "midwest",
    label: "Midwest (OH / IA / IL)",
    short: "Midwest",
    projectBn: 20,
    shareOfUsProjectPct: 15.4,
    shareOfGlobalProjectPct: 8.0,
    leaseTipBn: 58,
    growthYoYPct: 41,
    riskScore: 70,
    confidence: "estimated",
    fill: "#22c55e",
  },
  {
    id: "pacific",
    label: "Pacific NW / Bay",
    short: "Pacific",
    projectBn: 18,
    shareOfUsProjectPct: 13.8,
    shareOfGlobalProjectPct: 7.2,
    leaseTipBn: 64,
    growthYoYPct: 18,
    riskScore: 66,
    confidence: "estimated",
    fill: "#a855f7",
  },
  {
    id: "southeast",
    label: "Southeast (GA / NC / SC)",
    short: "SE",
    projectBn: 16,
    shareOfUsProjectPct: 12.3,
    shareOfGlobalProjectPct: 6.4,
    leaseTipBn: 42,
    growthYoYPct: 36,
    riskScore: 62,
    confidence: "estimated",
    fill: "#eab308",
  },
  {
    id: "other-us",
    label: "Other US",
    short: "Other US",
    projectBn: 20,
    shareOfUsProjectPct: 15.4,
    shareOfGlobalProjectPct: 8.0,
    leaseTipBn: 48,
    growthYoYPct: 28,
    riskScore: 55,
    confidence: "desk",
    fill: "#64748b",
  },
];

export type CurrencyBook = {
  currency: string;
  short: string;
  amountBn: number;
  sharePct: number;
  primaryBook: string;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** HS IG YTD currency / primary book placement (~$194B). */
export const CURRENCY_BOOKS: CurrencyBook[] = [
  {
    currency: "US dollar",
    short: "USD",
    amountBn: 151.3,
    sharePct: 78.0,
    primaryBook: "New York / US IG",
    confidence: "estimated",
    fill: "#3b82f6",
    note: "Domestic US IG calendar dominates Mag-7 AI notes",
  },
  {
    currency: "Euro",
    short: "EUR",
    amountBn: 34.9,
    sharePct: 18.0,
    primaryBook: "London / Frankfurt",
    confidence: "estimated",
    fill: "#06b6d4",
    note: "Amazon / Meta EUR megadeals widen EU book share",
  },
  {
    currency: "Other FX",
    short: "Other",
    amountBn: 7.8,
    sharePct: 4.0,
    primaryBook: "Asia / multi",
    confidence: "desk",
    fill: "#94a3b8",
    note: "GBP / CHF / local residual sleeves",
  },
];

export type EtfDomicile = {
  domicile: string;
  short: string;
  flowsBn: number;
  sharePct: number;
  flagship: string;
  confidence: Confidence;
  fill: string;
};

/** 2025 thematic AI + mega-tech ETF flow domicile (~$43.5B). */
export const ETF_DOMICILES: EtfDomicile[] = [
  {
    domicile: "United States",
    short: "US",
    flowsBn: 39.6,
    sharePct: 91.0,
    flagship: "QQQ + US listed AI thematic",
    confidence: "disclosed",
    fill: "#3b82f6",
  },
  {
    domicile: "Europe (UCITS)",
    short: "EU",
    flowsBn: 2.8,
    sharePct: 6.4,
    flagship: "UCITS AI / tech trackers",
    confidence: "estimated",
    fill: "#06b6d4",
  },
  {
    domicile: "Asia-Pacific",
    short: "APAC",
    flowsBn: 0.9,
    sharePct: 2.1,
    flagship: "HK / JP / AU listings",
    confidence: "desk",
    fill: "#22c55e",
  },
  {
    domicile: "Other",
    short: "Other",
    flowsBn: 0.2,
    sharePct: 0.5,
    flagship: "Residual",
    confidence: "desk",
    fill: "#94a3b8",
  },
];

export type HqVsAsset = {
  channel: string;
  short: string;
  amountBn: number;
  hqUsSharePct: number;
  assetUsSharePct: number;
  gapPp: number;
  fill: string;
  note: string;
};

/**
 * HQ geography vs asset / collateral geography — the mismatch meter.
 * Positive gap = US HQ share exceeds US asset share (funding HQ > facility map).
 */
export const HQ_VS_ASSET: HqVsAsset[] = [
  {
    channel: "HS senior unsecured",
    short: "HS IG",
    amountBn: 520,
    hqUsSharePct: 100,
    assetUsSharePct: 58,
    gapPp: 42,
    fill: "#8b5cf6",
    note: "US HQ issuers; facility spend still US-heavy but not 100%",
  },
  {
    channel: "Project / DC finance",
    short: "Project",
    amountBn: 250,
    hqUsSharePct: 58,
    assetUsSharePct: 52,
    gapPp: 6,
    fill: "#10b981",
    note: "Lender + SPV HQ roughly tracks facility geography",
  },
  {
    channel: "Private credit",
    short: "Private",
    amountBn: 200,
    hqUsSharePct: 84,
    assetUsSharePct: 48,
    gapPp: 36,
    fill: "#f59e0b",
    note: "US GP HQ funds more global DC assets than US share alone",
  },
  {
    channel: "ABS / structured",
    short: "ABS",
    amountBn: 60,
    hqUsSharePct: 78,
    assetUsSharePct: 70,
    gapPp: 8,
    fill: "#06b6d4",
    note: "US ABS shelves; collateral still mostly US campuses",
  },
  {
    channel: "GPU / asset-secured",
    short: "GPU",
    amountBn: 35,
    hqUsSharePct: 90,
    assetUsSharePct: 55,
    gapPp: 35,
    fill: "#ef4444",
    note: "US SPV tips; GPU fleets sit where power clears",
  },
];

export type RegionYear = {
  year: string;
  US: number;
  Europe: number;
  APAC: number;
  Other: number;
};

/** Rough funded-stock geography path (desk; $Bn). */
export const REGION_BY_YEAR: RegionYear[] = [
  { year: "2024", US: 310, Europe: 58, APAC: 42, Other: 28 },
  { year: "2025", US: 520, Europe: 92, APAC: 68, Other: 48 },
  { year: "2026 YTD", US: 767, Europe: 138, APAC: 96, Other: 64 },
];

export type MeterRow = {
  id: string;
  label: string;
  short: string;
  top1SharePct: number;
  top1Label: string;
  fill: string;
};

/** Compare Top-1 regional shares across financing maps. */
export const METER_COMPARE: MeterRow[] = [
  {
    id: "funded",
    label: "Funded credit stock",
    short: "Funded",
    top1SharePct: 72,
    top1Label: "US",
    fill: "#3b82f6",
  },
  {
    id: "hs-hq",
    label: "HS IG issuer HQ",
    short: "HS HQ",
    top1SharePct: 100,
    top1Label: "US",
    fill: "#8b5cf6",
  },
  {
    id: "project",
    label: "Project / DC collateral",
    short: "Project",
    top1SharePct: 52,
    top1Label: "US",
    fill: "#10b981",
  },
  {
    id: "fx",
    label: "HS IG currency book",
    short: "USD book",
    top1SharePct: 78,
    top1Label: "USD",
    fill: "#06b6d4",
  },
  {
    id: "etf",
    label: "ETF listing domicile",
    short: "ETF",
    top1SharePct: 91,
    top1Label: "US",
    fill: "#f59e0b",
  },
  {
    id: "private-gap",
    label: "Private credit GP HQ",
    short: "PC HQ",
    top1SharePct: 84,
    top1Label: "US",
    fill: "#ef4444",
  },
];

export type RiskScatterPoint = {
  id: string;
  label: string;
  region: "US" | "Europe" | "APAC" | "Other";
  creditBn: number;
  riskScore: number;
  growthYoYPct: number;
  fill: string;
};

export const RISK_SCATTER: RiskScatterPoint[] = [
  {
    id: "nova",
    label: "NoVA",
    region: "US",
    creditBn: 32,
    riskScore: 92,
    growthYoYPct: 22,
    fill: "#1d4ed8",
  },
  {
    id: "texas",
    label: "Texas",
    region: "US",
    creditBn: 24,
    riskScore: 78,
    growthYoYPct: 48,
    fill: "#f97316",
  },
  {
    id: "midwest",
    label: "Midwest",
    region: "US",
    creditBn: 20,
    riskScore: 70,
    growthYoYPct: 41,
    fill: "#22c55e",
  },
  {
    id: "dublin",
    label: "Dublin",
    region: "Europe",
    creditBn: 20,
    riskScore: 80,
    growthYoYPct: 16,
    fill: "#06b6d4",
  },
  {
    id: "nordics",
    label: "Nordics",
    region: "Europe",
    creditBn: 16,
    riskScore: 62,
    growthYoYPct: 28,
    fill: "#0ea5e9",
  },
  {
    id: "frankfurt",
    label: "Frankfurt/NL",
    region: "Europe",
    creditBn: 14,
    riskScore: 68,
    growthYoYPct: 20,
    fill: "#67e8f9",
  },
  {
    id: "tokyo",
    label: "Tokyo/Osaka",
    region: "APAC",
    creditBn: 14,
    riskScore: 58,
    growthYoYPct: 24,
    fill: "#22c55e",
  },
  {
    id: "singapore",
    label: "Singapore",
    region: "APAC",
    creditBn: 12,
    riskScore: 72,
    growthYoYPct: 19,
    fill: "#4ade80",
  },
  {
    id: "mumbai",
    label: "Mumbai/Chennai",
    region: "APAC",
    creditBn: 10,
    riskScore: 65,
    growthYoYPct: 44,
    fill: "#86efac",
  },
  {
    id: "uae",
    label: "UAE",
    region: "Other",
    creditBn: 6,
    riskScore: 54,
    growthYoYPct: 55,
    fill: "#f59e0b",
  },
];

export function fmtUsdBn(n: number): string {
  if (Math.abs(n) >= 100) return `$${n.toFixed(0)}B`;
  if (Math.abs(n) >= 10) return `$${n.toFixed(1)}B`;
  return `$${n.toFixed(1)}B`;
}

export function fmtPct(n: number): string {
  return `${n.toFixed(n % 1 === 0 ? 0 : 1)}%`;
}

export function regionBars(metric: "share" | "dollars") {
  return REGION_ROWS.filter((r) => r.short !== "Residual").map((r) => ({
    name: r.short,
    full: r.region,
    value: metric === "share" ? r.sharePct : r.amountBn,
    fill: r.fill,
  }));
}

export function facilityBars(metric: "share" | "dollars") {
  return FACILITY_REGIONS.map((r) => ({
    name: r.short,
    full: r.region,
    value: metric === "share" ? r.sharePct : r.amountBn,
    fill: r.fill,
    risk: r.powerRisk,
  }));
}

export function corridorBars(metric: "us" | "global" | "growth" | "risk") {
  return US_CORRIDORS.map((c) => ({
    name: c.short,
    full: c.label,
    value:
      metric === "us"
        ? c.shareOfUsProjectPct
        : metric === "global"
          ? c.shareOfGlobalProjectPct
          : metric === "growth"
            ? c.growthYoYPct
            : c.riskScore,
    fill: c.fill,
    bn: c.projectBn,
  }));
}

export function currencyBars(metric: "share" | "dollars") {
  return CURRENCY_BOOKS.map((c) => ({
    name: c.short,
    full: c.currency,
    value: metric === "share" ? c.sharePct : c.amountBn,
    fill: c.fill,
  }));
}

export function hqAssetGapBars() {
  return HQ_VS_ASSET.map((h) => ({
    name: h.short,
    hq: h.hqUsSharePct,
    asset: h.assetUsSharePct,
    gap: h.gapPp,
    fill: h.fill,
    bn: h.amountBn,
  }));
}

export function riskScatter(region: "all" | "US" | "Europe" | "APAC" | "Other") {
  return RISK_SCATTER.filter((p) => region === "all" || p.region === region);
}

export function meterBars() {
  return METER_COMPARE.map((m) => ({
    name: m.short,
    full: m.label,
    value: m.top1SharePct,
    fill: m.fill,
    tip: m.top1Label,
  }));
}
