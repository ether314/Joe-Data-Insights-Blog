/**
 * Global shipbuilding GT delivery concentration — UNCTAD RMT 2024/2025.
 * Units: thousand gross tons (GT) for deliveries; deadweight tons (dwt) for ownership.
 */

export const SOURCE_NOTE =
  "Delivery shares and vessel-type breakdowns are UNCTAD calculations from Clarksons Research (Review of Maritime Transport 2025, Table II.6; RMT 2024 for 2023 country shares). Beneficial-ownership shares are UNCTAD fleet statistics as of 1 January 2025 (vessels ≥1,000 GT). Orderbook and contracting shares cited from Clarksons via UNCTAD RMT 2025. Historical Korea/Japan peaks are narrative benchmarks from RMT 2024, not a full reconstructed time series.";

export const SOURCES = [
  "UNCTAD — Review of Maritime Transport 2025, Chapter II (shipbuilding deliveries Table II.6; ownership; orderbook)",
  "UNCTAD — Review of Maritime Transport 2024, Chapter II (2023 delivery shares; China >50% milestone)",
  "UNCTADStat — Ships built by country of building (US.ShipBuilding)",
  "UNCTADStat — Merchant fleet by country of beneficial ownership (US.FleetBeneficialOwners)",
  "Clarksons Research — cited via UNCTAD for orderbook / contracting shares",
] as const;

export const HEADLINE = {
  chinaShare2024Pct: 54.6,
  chinaShare2023Pct: 50.0,
  koreaShare2024Pct: 28.0,
  japanShare2024Pct: 12.6,
  asiaTrioShare2024Pct: 95.2,
  totalDeliveries2024Kgt: 71_691,
  chinaOrderbookStart2025Pct: 63.7,
  chinaContracting2024Pct: 74.4,
  greeceOwnershipPct: 16.4,
  chinaOwnershipPct: 14.4,
  usBuildShare2024Pct: 0.04,
} as const;

export type BuilderId =
  | "china"
  | "korea"
  | "japan"
  | "vietnam"
  | "philippines"
  | "europe"
  | "rest";

export type DeliveryBuilder = {
  id: BuilderId;
  label: string;
  shortLabel: string;
  gt2024K: number;
  share2024Pct: number;
  share2023Pct: number | null;
  color: string;
};

/** UNCTAD RMT 2025 Table II.6 totals; 2023 country shares from RMT 2024 narrative */
export const DELIVERY_BUILDERS: DeliveryBuilder[] = [
  {
    id: "china",
    label: "China",
    shortLabel: "China",
    gt2024K: 39_118,
    share2024Pct: 54.6,
    share2023Pct: 50.0,
    color: "#ef4444",
  },
  {
    id: "korea",
    label: "Republic of Korea",
    shortLabel: "Korea",
    gt2024K: 20_091,
    share2024Pct: 28.0,
    share2023Pct: 28.2,
    color: "#3b82f6",
  },
  {
    id: "japan",
    label: "Japan",
    shortLabel: "Japan",
    gt2024K: 9_002,
    share2024Pct: 12.6,
    share2023Pct: 14.9,
    color: "#14b8a6",
  },
  {
    id: "vietnam",
    label: "Viet Nam",
    shortLabel: "Viet Nam",
    gt2024K: 721,
    share2024Pct: 1.0,
    share2023Pct: null,
    color: "#a78bfa",
  },
  {
    id: "philippines",
    label: "Philippines",
    shortLabel: "Philippines",
    gt2024K: 668,
    share2024Pct: 0.9,
    share2023Pct: null,
    color: "#f59e0b",
  },
  {
    id: "europe",
    label: "Europe (aggregate)",
    shortLabel: "Europe",
    gt2024K: 625,
    share2024Pct: 0.9,
    share2023Pct: null,
    color: "#64748b",
  },
  {
    id: "rest",
    label: "Rest of world",
    shortLabel: "Rest",
    gt2024K: 1_466,
    share2024Pct: 2.0,
    share2023Pct: null,
    color: "#94a3b8",
  },
];

/** Narrative + disclosed milestones for share path (not a full annual series) */
export const SHARE_MILESTONES = [
  { year: 1980, china: 2, korea: 5, japan: 50, note: "Japan ~50% peak era (1970s–80s)" },
  { year: 2016, china: 35, korea: 35, japan: 20, note: "Korea output peak ~35%" },
  { year: 2023, china: 50, korea: 28.2, japan: 14.9, note: "China first crosses 50%" },
  { year: 2024, china: 54.6, korea: 28.0, japan: 12.6, note: "China ~55%; Asia trio 95%" },
] as const;

export type VesselSegment = {
  segment: string;
  shortLabel: string;
  chinaKgt: number;
  koreaKgt: number;
  japanKgt: number;
  worldKgt: number;
  worldSharePct: number;
};

/** RMT 2025 Table II.6 — major cargo segments (thousand GT) */
export const VESSEL_SEGMENTS: VesselSegment[] = [
  {
    segment: "Container ships",
    shortLabel: "Container",
    chinaKgt: 16_578,
    koreaKgt: 11_326,
    japanKgt: 1_735,
    worldKgt: 29_639,
    worldSharePct: 41.3,
  },
  {
    segment: "Bulk carriers",
    shortLabel: "Bulk",
    chinaKgt: 12_510,
    koreaKgt: 0,
    japanKgt: 5_729,
    worldKgt: 19_072,
    worldSharePct: 26.6,
  },
  {
    segment: "Gas carriers",
    shortLabel: "Gas",
    chinaKgt: 1_710,
    koreaKgt: 6_818,
    japanKgt: 220,
    worldKgt: 8_749,
    worldSharePct: 12.2,
  },
  {
    segment: "Oil tankers",
    shortLabel: "Oil tanker",
    chinaKgt: 1_499,
    koreaKgt: 1_310,
    japanKgt: 206,
    worldKgt: 3_630,
    worldSharePct: 5.1,
  },
  {
    segment: "Offshore supply",
    shortLabel: "Offshore",
    chinaKgt: 1_674,
    koreaKgt: 257,
    japanKgt: 8,
    worldKgt: 2_406,
    worldSharePct: 3.4,
  },
  {
    segment: "General cargo",
    shortLabel: "Gen. cargo",
    chinaKgt: 1_133,
    koreaKgt: 229,
    japanKgt: 305,
    worldKgt: 1_966,
    worldSharePct: 2.7,
  },
];

export type OwnerNation = {
  rank: number;
  country: string;
  shortLabel: string;
  ownershipPct: number;
  dwtM: number;
  foreignFlagPct: number;
  color: string;
};

/** Top beneficial owners by dwt, 1 Jan 2025 (UNCTAD / Clarksons via RMT 2025) */
export const TOP_OWNERS: OwnerNation[] = [
  {
    rank: 1,
    country: "Greece",
    shortLabel: "Greece",
    ownershipPct: 16.4,
    dwtM: 397.6,
    foreignFlagPct: 88,
    color: "#0ea5e9",
  },
  {
    rank: 2,
    country: "China",
    shortLabel: "China",
    ownershipPct: 14.4,
    dwtM: 347.2,
    foreignFlagPct: 61,
    color: "#ef4444",
  },
  {
    rank: 3,
    country: "Japan",
    shortLabel: "Japan",
    ownershipPct: 9.9,
    dwtM: 240.7,
    foreignFlagPct: 84,
    color: "#14b8a6",
  },
  {
    rank: 4,
    country: "Singapore",
    shortLabel: "Singapore",
    ownershipPct: 6.3,
    dwtM: 153.4,
    foreignFlagPct: 53,
    color: "#f59e0b",
  },
  {
    rank: 5,
    country: "Hong Kong, China",
    shortLabel: "HK",
    ownershipPct: 5.8,
    dwtM: 139.5,
    foreignFlagPct: 41,
    color: "#a78bfa",
  },
  {
    rank: 6,
    country: "Republic of Korea",
    shortLabel: "Korea",
    ownershipPct: 4.1,
    dwtM: 98.5,
    foreignFlagPct: 79,
    color: "#3b82f6",
  },
  {
    rank: 7,
    country: "Germany",
    shortLabel: "Germany",
    ownershipPct: 3.0,
    dwtM: 71.5,
    foreignFlagPct: 89,
    color: "#64748b",
  },
  {
    rank: 8,
    country: "United Kingdom",
    shortLabel: "UK",
    ownershipPct: 2.4,
    dwtM: 57.0,
    foreignFlagPct: 84,
    color: "#84cc16",
  },
];

/** Build vs own contrast for the three East Asian yards + Greece */
export const BUILD_VS_OWN = [
  {
    country: "China",
    buildSharePct: 54.6,
    ownSharePct: 14.4,
    color: "#ef4444",
  },
  {
    country: "Korea",
    buildSharePct: 28.0,
    ownSharePct: 4.1,
    color: "#3b82f6",
  },
  {
    country: "Japan",
    buildSharePct: 12.6,
    ownSharePct: 9.9,
    color: "#14b8a6",
  },
  {
    country: "Greece",
    buildSharePct: 0.05,
    ownSharePct: 16.4,
    color: "#0ea5e9",
  },
] as const;

/** Pipeline / capacity context (Clarksons / BRS via UNCTAD) */
export const PIPELINE = [
  { metric: "China GT deliveries 2024", value: 54.6, unit: "% of world" },
  { metric: "China contracting 2024", value: 74.4, unit: "% of GT ordered" },
  { metric: "China orderbook start-2025", value: 63.7, unit: "% of GT" },
  { metric: "Orderbook / active fleet", value: 15.0, unit: "% (start-2025)" },
  { metric: "Active yards 2024", value: 348, unit: "yards" },
  { metric: "Chinese active yards", value: 120, unit: "yards (~45% capacity)" },
] as const;

export const MINOR_BUILDERS_2024 = [
  { country: "Viet Nam", sharePct: 1.01 },
  { country: "Philippines", sharePct: 0.93 },
  { country: "Italy", sharePct: 0.64 },
  { country: "Germany", sharePct: 0.26 },
  { country: "Türkiye", sharePct: 0.12 },
  { country: "India", sharePct: 0.06 },
  { country: "United States", sharePct: 0.04 },
] as const;

export function fmtKgt(k: number): string {
  if (k >= 1000) return `${(k / 1000).toFixed(1)}M GT`;
  return `${Math.round(k).toLocaleString()}k GT`;
}

export function fmtPct(p: number, digits = 1): string {
  return `${p.toFixed(digits)}%`;
}

export function asiaTrioShare(year: 2023 | 2024): number {
  if (year === 2023) return 50.0 + 28.2 + 14.9;
  return HEADLINE.asiaTrioShare2024Pct;
}

export function segmentLeader(seg: VesselSegment): "China" | "Korea" | "Japan" {
  const entries: Array<{ label: "China" | "Korea" | "Japan"; v: number }> = [
    { label: "China", v: seg.chinaKgt },
    { label: "Korea", v: seg.koreaKgt },
    { label: "Japan", v: seg.japanKgt },
  ];
  return entries.sort((a, b) => b.v - a.v)[0].label;
}
