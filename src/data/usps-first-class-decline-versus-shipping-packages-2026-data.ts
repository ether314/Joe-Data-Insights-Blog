/**
 * USPS First-Class decline versus Shipping & Packages (2026).
 *
 * Core question: How far has First-Class volume fallen relative to
 * Shipping/Packages since FY2019, and did revenue follow pieces?
 *
 * Primary anchors: USPS service-category tables in annual Form 10-K /
 * Form 8-K news releases (Revenue, Pieces & Weight category rollups)
 * for FY2019–FY2025. Revenue per piece, indexes (FY2019=100), and
 * mix shares are desk calculations from those disclosed category totals.
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "Category revenue ($ millions) and volume (millions of pieces) follow " +
  "U.S. Postal Service operating revenue and volume by service category " +
  "tables published with the FY2019–FY2025 Form 10-K / Form 8-K results " +
  "releases and Annual Reports to Congress. First-Class Mail and Shipping " +
  "and Packages are USPS reporting categories; product reclassifications " +
  "(notably First-Class Package Service folding into USPS Ground Advantage " +
  "in FY2023–FY2024) affect Shipping sub-lines but the category totals " +
  "remain the comparison frame. Indexes (FY2019=100), revenue-per-piece, " +
  "and piece/revenue mix shares are desk derivations — not a Postal " +
  "Regulatory Commission published index product.";

export const SOURCES = [
  {
    label: "USPS — FY2025 Results (service category table)",
    url: "https://about.usps.com/newsroom/national-releases/2025/1114-usps-reports-fiscal-year-2025-results.htm",
  },
  {
    label: "USPS — FY2025 Annual Report to Congress",
    url: "https://about.usps.com/what/financials/annual-reports/fy2025.pdf",
  },
  {
    label: "USPS — Revenue, Pieces & Weight (RPW) FY2025",
    url: "https://about.usps.com/what/financials/revenue-pieces-weight-reports/fy2025.pdf",
  },
  {
    label: "USPS — FY2019 Results (service category table)",
    url: "https://about.usps.com/newsroom/national-releases/2019/1114-usps-reports-fiscal-year-2019-results.htm",
  },
  {
    label: "USPS — FY2021 Results (FY2020–FY2021 bridge)",
    url: "https://about.usps.com/newsroom/national-releases/2021/1110-usps-reports-fiscal-year-2021-results.htm",
  },
  {
    label: "USPS — FY2023 Results",
    url: "https://about.usps.com/newsroom/national-releases/2023/1114-usps-reports-fiscal-year-2023-results.htm",
  },
] as const;

export const VIZ_MARKERS = [
  "Piece mix vs revenue mix",
  "Dual index tracks",
  "Revenue did not follow pieces",
] as const;

/** Headline punchline — pieces diverge from revenue */
export const HEADLINE = {
  /** FY2019 First-Class pieces (millions) */
  fcmPieces2019: 54943,
  /** FY2025 First-Class pieces (millions) */
  fcmPieces2025: 42049,
  /** FCM piece change FY2019→FY2025 (%) */
  fcmPieceChangePct: -23.5,
  /** FCM piece index FY2025 (FY2019=100) */
  fcmPieceIndex2025: 76.5,
  /** FCM revenue FY2019 ($M) */
  fcmRev2019: 24434,
  /** FCM revenue FY2025 ($M) */
  fcmRev2025: 25769,
  /** FCM revenue change (%) */
  fcmRevChangePct: 5.5,
  /** FCM revenue index FY2025 */
  fcmRevIndex2025: 105.5,
  /** Shipping pieces FY2019 (millions) */
  shipPieces2019: 6165,
  /** Shipping pieces FY2025 (millions) */
  shipPieces2025: 6837,
  /** Shipping piece change (%) */
  shipPieceChangePct: 10.9,
  /** Shipping piece index FY2025 */
  shipPieceIndex2025: 110.9,
  /** Shipping revenue FY2019 ($M) */
  shipRev2019: 22787,
  /** Shipping revenue FY2025 ($M) */
  shipRev2025: 32580,
  /** Shipping revenue change (%) */
  shipRevChangePct: 43.0,
  /** Shipping revenue index FY2025 */
  shipRevIndex2025: 143.0,
  /** Shipping share of FCM+Ship revenue FY2019 (%) */
  shipRevShare2019: 48.3,
  /** Shipping share of FCM+Ship revenue FY2025 (%) */
  shipRevShare2025: 55.8,
  /** FCM share of FCM+Ship pieces FY2019 (%) */
  fcmPieceShare2019: 89.9,
  /** FCM share of FCM+Ship pieces FY2025 (%) */
  fcmPieceShare2025: 86.0,
  /** FCM revenue per piece FY2019 ($) */
  fcmRpp2019: 0.445,
  /** FCM revenue per piece FY2025 ($) */
  fcmRpp2025: 0.613,
  /** Shipping revenue per piece FY2019 ($) */
  shipRpp2019: 3.7,
  /** Shipping revenue per piece FY2025 ($) */
  shipRpp2025: 4.77,
  /** Years in series */
  yearN: 7,
} as const;

export type CategoryId = "first-class" | "shipping" | "marketing" | "other";

export type FiscalYearRow = {
  fy: number;
  /** First-Class Mail revenue ($ millions) */
  fcmRevenue: number;
  /** First-Class Mail pieces (millions) */
  fcmPieces: number;
  /** Shipping and Packages revenue ($ millions) */
  shipRevenue: number;
  /** Shipping and Packages pieces (millions) */
  shipPieces: number;
  /** Marketing Mail revenue ($ millions) */
  mktRevenue: number;
  /** Marketing Mail pieces (millions) */
  mktPieces: number;
  /** Total operating revenue ($ millions) */
  totalRevenue: number;
  /** Total mail+package pieces (millions) */
  totalPieces: number;
  confidence: Confidence;
};

/** USPS service-category tables, FY2019–FY2025 */
export const YEARLY: FiscalYearRow[] = [
  {
    fy: 2019,
    fcmRevenue: 24434,
    fcmPieces: 54943,
    shipRevenue: 22787,
    shipPieces: 6165,
    mktRevenue: 16359,
    mktPieces: 75653,
    totalRevenue: 71136,
    totalPieces: 142570,
    confidence: "disclosed",
  },
  {
    fy: 2020,
    fcmRevenue: 23781,
    fcmPieces: 52628,
    shipRevenue: 28529,
    shipPieces: 7325,
    mktRevenue: 13909,
    mktPieces: 64004,
    totalRevenue: 73123,
    totalPieces: 129171,
    confidence: "disclosed",
  },
  {
    fy: 2021,
    fcmRevenue: 23281,
    fcmPieces: 50695,
    shipRevenue: 32013,
    shipPieces: 7578,
    mktRevenue: 14590,
    mktPieces: 66200,
    totalRevenue: 77009,
    totalPieces: 128861,
    confidence: "disclosed",
  },
  {
    fy: 2022,
    fcmRevenue: 23990,
    fcmPieces: 48960,
    shipRevenue: 31317,
    shipPieces: 7232,
    mktRevenue: 15996,
    mktPieces: 67092,
    totalRevenue: 78507,
    totalPieces: 127444,
    confidence: "disclosed",
  },
  {
    fy: 2023,
    fcmRevenue: 24505,
    fcmPieces: 45979,
    shipRevenue: 31641,
    shipPieces: 7057,
    mktRevenue: 15076,
    mktPieces: 59410,
    totalRevenue: 78186,
    totalPieces: 116146,
    confidence: "disclosed",
  },
  {
    fy: 2024,
    fcmRevenue: 25399,
    fcmPieces: 44277,
    shipRevenue: 32265,
    shipPieces: 7252,
    mktRevenue: 15384,
    mktPieces: 57520,
    totalRevenue: 79537,
    totalPieces: 112456,
    confidence: "disclosed",
  },
  {
    fy: 2025,
    fcmRevenue: 25769,
    fcmPieces: 42049,
    shipRevenue: 32580,
    shipPieces: 6837,
    mktRevenue: 15734,
    mktPieces: 56756,
    totalRevenue: 80453,
    totalPieces: 108695,
    confidence: "disclosed",
  },
];

export type IndexRow = {
  fy: number;
  fcmPieces: number;
  fcmRevenue: number;
  shipPieces: number;
  shipRevenue: number;
  mktPieces: number;
  mktRevenue: number;
};

const base = YEARLY[0];

export const INDEX_PATH: IndexRow[] = YEARLY.map((r) => ({
  fy: r.fy,
  fcmPieces: +(100 * (r.fcmPieces / base.fcmPieces)).toFixed(1),
  fcmRevenue: +(100 * (r.fcmRevenue / base.fcmRevenue)).toFixed(1),
  shipPieces: +(100 * (r.shipPieces / base.shipPieces)).toFixed(1),
  shipRevenue: +(100 * (r.shipRevenue / base.shipRevenue)).toFixed(1),
  mktPieces: +(100 * (r.mktPieces / base.mktPieces)).toFixed(1),
  mktRevenue: +(100 * (r.mktRevenue / base.mktRevenue)).toFixed(1),
}));

export type MixYear = {
  fy: number;
  fcmPieceShare: number;
  shipPieceShare: number;
  fcmRevShare: number;
  shipRevShare: number;
  /** Among FCM + Shipping only */
  fcmOfPairPieces: number;
  shipOfPairPieces: number;
  fcmOfPairRev: number;
  shipOfPairRev: number;
};

export const MIX_PATH: MixYear[] = YEARLY.map((r) => {
  const pairPieces = r.fcmPieces + r.shipPieces;
  const pairRev = r.fcmRevenue + r.shipRevenue;
  return {
    fy: r.fy,
    fcmPieceShare: +((100 * r.fcmPieces) / r.totalPieces).toFixed(1),
    shipPieceShare: +((100 * r.shipPieces) / r.totalPieces).toFixed(1),
    fcmRevShare: +((100 * r.fcmRevenue) / r.totalRevenue).toFixed(1),
    shipRevShare: +((100 * r.shipRevenue) / r.totalRevenue).toFixed(1),
    fcmOfPairPieces: +((100 * r.fcmPieces) / pairPieces).toFixed(1),
    shipOfPairPieces: +((100 * r.shipPieces) / pairPieces).toFixed(1),
    fcmOfPairRev: +((100 * r.fcmRevenue) / pairRev).toFixed(1),
    shipOfPairRev: +((100 * r.shipRevenue) / pairRev).toFixed(1),
  };
});

export type RppRow = {
  fy: number;
  fcmRpp: number;
  shipRpp: number;
  mktRpp: number;
  shipOverFcm: number;
};

export const RPP_PATH: RppRow[] = YEARLY.map((r) => {
  const fcm = r.fcmRevenue / r.fcmPieces;
  const ship = r.shipRevenue / r.shipPieces;
  return {
    fy: r.fy,
    fcmRpp: +fcm.toFixed(3),
    shipRpp: +ship.toFixed(2),
    mktRpp: +(r.mktRevenue / r.mktPieces).toFixed(3),
    shipOverFcm: +(ship / fcm).toFixed(1),
  };
});

/** Endpoint slope for piece vs revenue divergence */
export type SlopeEndpoint = {
  label: string;
  category: "first-class" | "shipping";
  pieceIndex: number;
  revenueIndex: number;
  pieceDeltaPts: number;
  revenueDeltaPts: number;
  gapPts: number;
};

export const SLOPE_ENDPOINTS: SlopeEndpoint[] = [
  {
    label: "First-Class Mail",
    category: "first-class",
    pieceIndex: HEADLINE.fcmPieceIndex2025,
    revenueIndex: HEADLINE.fcmRevIndex2025,
    pieceDeltaPts: HEADLINE.fcmPieceIndex2025 - 100,
    revenueDeltaPts: HEADLINE.fcmRevIndex2025 - 100,
    gapPts: +(HEADLINE.fcmRevIndex2025 - HEADLINE.fcmPieceIndex2025).toFixed(1),
  },
  {
    label: "Shipping & Packages",
    category: "shipping",
    pieceIndex: HEADLINE.shipPieceIndex2025,
    revenueIndex: HEADLINE.shipRevIndex2025,
    pieceDeltaPts: HEADLINE.shipPieceIndex2025 - 100,
    revenueDeltaPts: HEADLINE.shipRevIndex2025 - 100,
    gapPts: +(
      HEADLINE.shipRevIndex2025 - HEADLINE.shipPieceIndex2025
    ).toFixed(1),
  },
];

/** Diverging index deltas FY2019→FY2025 */
export type DeltaBar = {
  id: string;
  label: string;
  delta: number;
  kind: "pieces" | "revenue";
};

export const DELTA_BARS: DeltaBar[] = [
  {
    id: "fcm-pieces",
    label: "FCM pieces",
    delta: HEADLINE.fcmPieceChangePct,
    kind: "pieces",
  },
  {
    id: "fcm-rev",
    label: "FCM revenue",
    delta: HEADLINE.fcmRevChangePct,
    kind: "revenue",
  },
  {
    id: "ship-pieces",
    label: "Ship pieces",
    delta: HEADLINE.shipPieceChangePct,
    kind: "pieces",
  },
  {
    id: "ship-rev",
    label: "Ship revenue",
    delta: HEADLINE.shipRevChangePct,
    kind: "revenue",
  },
  {
    id: "mkt-pieces",
    label: "Mkt pieces",
    delta: +((100 * (YEARLY[6].mktPieces / YEARLY[0].mktPieces) - 100).toFixed(
      1,
    )),
    kind: "pieces",
  },
  {
    id: "mkt-rev",
    label: "Mkt revenue",
    delta: +((100 * (YEARLY[6].mktRevenue / YEARLY[0].mktRevenue) - 100).toFixed(
      1,
    )),
    kind: "revenue",
  },
];

/** FY2019 vs FY2025 revenue mix (donut) among major categories */
export type MixSlice = {
  name: string;
  value2019: number;
  value2025: number;
  fill: string;
};

export const REVENUE_MIX_SLICES: MixSlice[] = [
  {
    name: "First-Class",
    value2019: YEARLY[0].fcmRevenue,
    value2025: YEARLY[6].fcmRevenue,
    fill: "#0284c8",
  },
  {
    name: "Shipping",
    value2019: YEARLY[0].shipRevenue,
    value2025: YEARLY[6].shipRevenue,
    fill: "#d97706",
  },
  {
    name: "Marketing",
    value2019: YEARLY[0].mktRevenue,
    value2025: YEARLY[6].mktRevenue,
    fill: "#64748b",
  },
  {
    name: "All other",
    value2019:
      YEARLY[0].totalRevenue -
      YEARLY[0].fcmRevenue -
      YEARLY[0].shipRevenue -
      YEARLY[0].mktRevenue,
    value2025:
      YEARLY[6].totalRevenue -
      YEARLY[6].fcmRevenue -
      YEARLY[6].shipRevenue -
      YEARLY[6].mktRevenue,
    fill: "#94a3b8",
  },
];

export type TableRow = {
  fy: number;
  fcmPieces: string;
  fcmRevenue: string;
  shipPieces: string;
  shipRevenue: string;
  fcmRpp: string;
  shipRpp: string;
  shipRevShareOfPair: string;
};

export const DETAIL_TABLE: TableRow[] = YEARLY.map((r, i) => {
  const mix = MIX_PATH[i];
  const rpp = RPP_PATH[i];
  return {
    fy: r.fy,
    fcmPieces: r.fcmPieces.toLocaleString("en-US"),
    fcmRevenue: r.fcmRevenue.toLocaleString("en-US"),
    shipPieces: r.shipPieces.toLocaleString("en-US"),
    shipRevenue: r.shipRevenue.toLocaleString("en-US"),
    fcmRpp: `$${rpp.fcmRpp.toFixed(3)}`,
    shipRpp: `$${rpp.shipRpp.toFixed(2)}`,
    shipRevShareOfPair: `${mix.shipOfPairRev}%`,
  };
});

export function fmtIndex(n: number): string {
  return n.toFixed(1);
}

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtBillionsFromMillions(m: number): string {
  return `$${(m / 1000).toFixed(1)}B`;
}

export function fmtPiecesB(millions: number): string {
  return `${(millions / 1000).toFixed(1)}B`;
}
