/**
 * Four-firm beefpacking share (2026).
 *
 * Core question: How concentrated is fed-cattle slaughter regionally, and what
 * did packer margins do through the herd contraction?
 *
 * Perimeter: USDA AMS Packers and Stockyards Division (PSD) four-firm
 * concentration ratios for steers & heifers; AMS regional HHI disclosures for
 * fed-cattle procurement; Livestock Mandatory Reporting (LMR) regional cash
 * negotiated shares; Sterling Marketing Beef Profit Tracker packer margins
 * (as cited in Meat Institute market updates). National CR4 answers "who
 * kills the cattle"; regional HHI and cash-share panels answer "how many
 * buyers a feedlot can actually reach."
 *
 * Headline: National fed-cattle CR4 holds near 81%, but Texas–OK–NM regional
 * HHI exceeded 3,200 in 2021 — and packer margins flipped deeply negative
 * once the herd contraction tightened fed supplies.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "USDA AMS Packers and Stockyards Division Report to Congress 2021–2022 (Table 5 four-firm concentration ratios for steers & heifers, cows & bulls, and national HHI methodology). USDA AMS Agricultural Competition plan (May 2022) and Federal Register ANPR (Oct 11, 2024) for regional fed-cattle procurement HHI ranges as of 2021 and LMR regional cash-negotiated purchase shares. Historical CR4 path 1980→1995 from AMS FR citations of GIPSA/PSD series. Plant-size structure from USDA NASS Livestock Slaughter / industry summaries of federally inspected plants by annual capacity. Packer margin path from Sterling Marketing Beef Profit Tracker as reported in Meat Institute cattle/beef market updates (2024–2026 annual averages and selected weekly prints). Margin dollars are industry tracker estimates — not USDA-audited firm P&L.";

export const SOURCES = [
  {
    label: "USDA AMS — Packers and Stockyards 2021–2022 Report to Congress",
    url: "https://www.ams.usda.gov/sites/default/files/media/PackersandStockyards2021_2022ReporttoCongress.pdf",
  },
  {
    label: "USDA AMS — Agricultural Competition plan (May 2022)",
    url: "https://www.ams.usda.gov/sites/default/files/media/USDAPlan_EO_COMPETITION.pdf",
  },
  {
    label: "Federal Register — AMS cattle AMA / formula pricing ANPR (Oct 2024)",
    url: "https://www.govinfo.gov/content/pkg/FR-2024-10-11/pdf/2024-23528.pdf",
  },
  {
    label: "USDA ERS — Amber Waves: meatpacking concentration (Jan 2024)",
    url: "https://www.ers.usda.gov/amber-waves/2024/january/concentration-in-u-s-meatpacking-industry-and-how-it-affects-competition-and-cattle-prices",
  },
  {
    label: "Meat Institute — beef cattle market update (packer margins)",
    url: "https://www.meatinstitute.org/sites/default/files/documents/MI_BeefCattleMarketUpdate.pdf",
  },
] as const;

export const HEADLINE = {
  /** National four-firm share of steer & heifer slaughter, latest PSD print */
  nationalCr4Pct: 81,
  nationalCr4Year: 2021,
  /** Mid-1990s plateau after the consolidation wave */
  cr4Mid1990sPct: 79.3,
  cr4Year1980Pct: 35.7,
  /** National fed-cattle procurement HHI, 2021 */
  nationalHhi2021: 1687,
  /** Highest disclosed regional HHI band (TX-OK-NM), 2021 */
  peakRegionalHhi2021: 3200,
  peakRegionalLabel: "Texas–Oklahoma–New Mexico",
  /** Cow/bull CR4 contrast (less concentrated) */
  cowBullCr4Pct: 47,
  /** Packer margin cycle through herd contraction */
  packerMargin2023PerHead: 114,
  packerMargin2024PerHead: -75,
  packerMargin2025PerHead: -141,
  marginsNegativeSince: "2024-09",
  confidence: "disclosed" as Confidence,
};

/** National four-firm CR4 for steers & heifers (head basis), PSD series */
export type Cr4Row = {
  year: number;
  steersHeifersCr4Pct: number;
  cowBullCr4Pct: number | null;
  confidence: Confidence;
};

export const NATIONAL_CR4: Cr4Row[] = [
  { year: 1980, steersHeifersCr4Pct: 35.7, cowBullCr4Pct: null, confidence: "disclosed" },
  { year: 1985, steersHeifersCr4Pct: 50.2, cowBullCr4Pct: null, confidence: "carried" },
  { year: 1990, steersHeifersCr4Pct: 71.6, cowBullCr4Pct: null, confidence: "carried" },
  { year: 1995, steersHeifersCr4Pct: 79.3, cowBullCr4Pct: null, confidence: "disclosed" },
  { year: 2012, steersHeifersCr4Pct: 85, cowBullCr4Pct: 56, confidence: "disclosed" },
  { year: 2013, steersHeifersCr4Pct: 84, cowBullCr4Pct: 53, confidence: "disclosed" },
  { year: 2014, steersHeifersCr4Pct: 83, cowBullCr4Pct: 57, confidence: "disclosed" },
  { year: 2015, steersHeifersCr4Pct: 85, cowBullCr4Pct: 58, confidence: "disclosed" },
  { year: 2016, steersHeifersCr4Pct: 84, cowBullCr4Pct: 58, confidence: "disclosed" },
  { year: 2017, steersHeifersCr4Pct: 83, cowBullCr4Pct: 55, confidence: "disclosed" },
  { year: 2018, steersHeifersCr4Pct: 84, cowBullCr4Pct: 52, confidence: "disclosed" },
  { year: 2019, steersHeifersCr4Pct: 85, cowBullCr4Pct: 50, confidence: "disclosed" },
  { year: 2020, steersHeifersCr4Pct: 81, cowBullCr4Pct: 46, confidence: "disclosed" },
  { year: 2021, steersHeifersCr4Pct: 81, cowBullCr4Pct: 47, confidence: "disclosed" },
];

/** Regional fed-cattle procurement concentration (2021 AMS disclosures) */
export type RegionalRow = {
  region: string;
  regionId: "tx-ok-nm" | "ks" | "ne" | "co" | "ia-mn" | "national";
  hhi2021: number;
  hhiBand?: string;
  cashNegotiatedSharePct: number;
  cashShareNote: string;
  buyerDepth: "one-to-two" | "few" | "broader";
  confidence: Confidence;
};

export const REGIONAL_MARKETS: RegionalRow[] = [
  {
    region: "Texas–OK–NM",
    regionId: "tx-ok-nm",
    hhi2021: 3250,
    hhiBand: ">3,200",
    cashNegotiatedSharePct: 2.6,
    cashShareNote: "LMR residual cash share among the thinnest major regions",
    buyerDepth: "one-to-two",
    confidence: "disclosed",
  },
  {
    region: "Kansas",
    regionId: "ks",
    hhi2021: 2300,
    hhiBand: "2,200–2,400",
    cashNegotiatedSharePct: 12.5,
    cashShareNote: "Corporate feedlot belt; formula AMAs dominate procurement",
    buyerDepth: "few",
    confidence: "disclosed",
  },
  {
    region: "Nebraska",
    regionId: "ne",
    hhi2021: 2300,
    hhiBand: "2,200–2,400",
    cashNegotiatedSharePct: 35,
    cashShareNote: "Cash share typically 30–40%; more discovery than Southern Plains",
    buyerDepth: "few",
    confidence: "disclosed",
  },
  {
    region: "Colorado",
    regionId: "co",
    hhi2021: 2800,
    hhiBand: "often withheld in Market News",
    cashNegotiatedSharePct: 8.3,
    cashShareNote: "Price reports often withheld — fewer than 3 active buyers",
    buyerDepth: "one-to-two",
    confidence: "estimated",
  },
  {
    region: "Iowa–Minnesota",
    regionId: "ia-mn",
    hhi2021: 1900,
    hhiBand: "lower than Plains peaks",
    cashNegotiatedSharePct: 50,
    cashShareNote: "Farmer-feeder structure sustains ≥50% cash negotiated share",
    buyerDepth: "broader",
    confidence: "estimated",
  },
  {
    region: "National",
    regionId: "national",
    hhi2021: 1687,
    hhiBand: "below 1,800 highly-concentrated line nationally",
    cashNegotiatedSharePct: 19,
    cashShareNote: "National cash negotiated ~19% by 2021; formulas ~61%",
    buyerDepth: "few",
    confidence: "disclosed",
  },
];

/** Procurement method mix (national), FR/AMS citations */
export type ProcurementRow = {
  year: number;
  cashNegotiatedPct: number;
  formulaPct: number;
  otherPct: number;
  confidence: Confidence;
};

export const PROCUREMENT_MIX: ProcurementRow[] = [
  { year: 2005, cashNegotiatedPct: 55, formulaPct: 30, otherPct: 15, confidence: "disclosed" },
  { year: 2008, cashNegotiatedPct: 50.5, formulaPct: 34.4, otherPct: 15.1, confidence: "disclosed" },
  { year: 2015, cashNegotiatedPct: 28, formulaPct: 52, otherPct: 20, confidence: "carried" },
  { year: 2021, cashNegotiatedPct: 19, formulaPct: 61, otherPct: 20, confidence: "disclosed" },
];

/** Sterling / Meat Institute packer margin path ($/head) */
export type MarginRow = {
  period: string;
  sortKey: number;
  packerMarginPerHead: number;
  kind: "annual" | "weekly";
  note: string;
  confidence: Confidence;
};

export const PACKER_MARGINS: MarginRow[] = [
  {
    period: "2023",
    sortKey: 2023,
    packerMarginPerHead: 114,
    kind: "annual",
    note: "Annual projection while supplies were still relatively ample",
    confidence: "disclosed",
  },
  {
    period: "2024",
    sortKey: 2024,
    packerMarginPerHead: -75,
    kind: "annual",
    note: "Margins flipped negative from September 2024",
    confidence: "disclosed",
  },
  {
    period: "2025",
    sortKey: 2025,
    packerMarginPerHead: -141,
    kind: "annual",
    note: "Herd still contracting; fed supplies tighter year over year",
    confidence: "disclosed",
  },
  {
    period: "Oct 2025 wk",
    sortKey: 2025.77,
    packerMarginPerHead: -126.5,
    kind: "weekly",
    note: "Week ending ~4 Oct 2025 (Sterling Profit Tracker)",
    confidence: "disclosed",
  },
  {
    period: "Jan 2026 wk",
    sortKey: 2026.04,
    packerMarginPerHead: -191.89,
    kind: "weekly",
    note: "Week of Jan 24, 2026 tracker print",
    confidence: "disclosed",
  },
  {
    period: "Jun 2026 wk",
    sortKey: 2026.5,
    packerMarginPerHead: -314.48,
    kind: "weekly",
    note: "Week ending June 27, 2026 — deep negative print",
    confidence: "disclosed",
  },
];

/** Federally inspected plant capacity structure (2025 snapshot) */
export type PlantTierRow = {
  tier: string;
  plantCount: number;
  headSlaughteredM: number;
  shareOfTotalSlaughterPct: number;
  shareOfFedSlaughterPct: number | null;
  confidence: Confidence;
};

export const PLANT_TIERS: PlantTierRow[] = [
  {
    tier: "≤100k head/yr",
    plantCount: 888,
    headSlaughteredM: 1.92,
    shareOfTotalSlaughterPct: 7.14,
    shareOfFedSlaughterPct: null,
    confidence: "disclosed",
  },
  {
    tier: "Mid-size plants",
    plantCount: 38,
    headSlaughteredM: 11.5,
    shareOfTotalSlaughterPct: 45.56,
    shareOfFedSlaughterPct: null,
    confidence: "estimated",
  },
  {
    tier: "≥1M head/yr",
    plantCount: 11,
    headSlaughteredM: 13.834,
    shareOfTotalSlaughterPct: 47.3,
    shareOfFedSlaughterPct: 58.1,
    confidence: "disclosed",
  },
];

/** Scatter: regional cash share vs HHI */
export type RegionScatterPoint = {
  region: string;
  hhi: number;
  cashPct: number;
  cr4ProxyLabel: string;
};

export const REGION_SCATTER: RegionScatterPoint[] = REGIONAL_MARKETS.filter(
  (r) => r.regionId !== "national",
).map((r) => ({
  region: r.region,
  hhi: r.hhi2021,
  cashPct: r.cashNegotiatedSharePct,
  cr4ProxyLabel: r.buyerDepth,
}));

export const ANALYTICS = {
  cr4Rise1980To1995Pts: HEADLINE.cr4Mid1990sPct - HEADLINE.cr4Year1980Pct,
  regionalHhiPremiumVsNational:
    HEADLINE.peakRegionalHhi2021 - HEADLINE.nationalHhi2021,
  doJHighlyConcentratedLine: 1800,
  nationalBelowDoJLine: HEADLINE.nationalHhi2021 < 1800,
  marginSwing2023To2025:
    HEADLINE.packerMargin2025PerHead - HEADLINE.packerMargin2023PerHead,
  fedVsCowBullCr4GapPts: HEADLINE.nationalCr4Pct - HEADLINE.cowBullCr4Pct,
  megaPlantFedSharePct: 58.1,
  megaPlantCount: 11,
};

export const TABLE_ROWS = [
  {
    metric: "National fed-cattle CR4 (steers & heifers)",
    value: "81%",
    year: "2021",
    source: "USDA PSD",
  },
  {
    metric: "National fed-cattle HHI",
    value: "1,687",
    year: "2021",
    source: "USDA AMS",
  },
  {
    metric: "TX–OK–NM regional HHI",
    value: ">3,200",
    year: "2021",
    source: "USDA AMS",
  },
  {
    metric: "KS / NE regional HHI",
    value: "2,200–2,400",
    year: "2021",
    source: "USDA AMS",
  },
  {
    metric: "Cow & bull CR4",
    value: "47%",
    year: "2021",
    source: "USDA PSD",
  },
  {
    metric: "National cash negotiated share",
    value: "~19%",
    year: "2021",
    source: "AMS / FR ANPR",
  },
  {
    metric: "Packer margin (annual avg)",
    value: "−$141 / head",
    year: "2025",
    source: "Sterling / MI",
  },
  {
    metric: "Plants ≥1M head / fed slaughter share",
    value: "11 plants · 58.1%",
    year: "2025",
    source: "NASS / industry",
  },
] as const;
