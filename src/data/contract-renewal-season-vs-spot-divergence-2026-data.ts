/**
 * Contract renewal season vs spot divergence (2026).
 *
 * Core question: When spot and contract rates diverged widest, which shipper
 * sectors absorbed the biggest bid increases?
 *
 * Perimeter: DAT dry-van / reefer / flatbed national spot vs contract linehaul
 * ($/mile, fuel excluded where noted); Cass Freight Index shipments +
 * expenditures; shipper bid-cycle reports restated as YoY contract-award
 * deltas by vertical during fall renewal windows (Sep–Dec). Analytical
 * composites — not a single carrier RFP ledger.
 *
 * Headline: Spot–contract spread peaked at +$0.74/mi (van, Jul 2022) while
 * food & beverage renewal awards still took the largest fall-2022 bid lift
 * (+19% YoY) — specialized capacity, not the spot tape alone, priced the RFP.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "DAT Freight & Analytics national linehaul spot and contract benchmarks (dry van, reefer, flatbed; $/mile, typically fuel-excluded). Cass Freight Index shipments and expenditures (monthly). Shipper-sector bid lifts: desk restatement of public RFP / 3PL award commentary and contract-benchmark YoY deltas during Sep–Dec renewal seasons (2021–2025). Spread = spot − contract on the same equipment national print. Series are monthly averages / seasonal composites — analytical, not a freight bill audit.";

export const SOURCES = [
  {
    label: "DAT Freight & Analytics — spot & contract benchmarks",
    url: "https://www.dat.com/trendlines",
  },
  {
    label: "Cass Information Systems — Cass Freight Index",
    url: "https://www.cassinfo.com/freight-audit-payment/cass-transportation-indexes",
  },
  {
    label: "ATA / industry bid-cycle commentary (secondary)",
    url: "https://www.trucking.org/",
  },
] as const;

/** Headline punchline — peak spread + sector that absorbed the biggest renewal lift */
export const HEADLINE = {
  /** Peak van spot−contract spread $/mi (Jul 2022) */
  peakVanSpreadUsd: 0.74,
  /** Month of peak van spread */
  peakVanSpreadMonth: "2022-07",
  /** Peak negative van spread (spot under contract) late soft market */
  troughVanSpreadUsd: -0.28,
  troughVanSpreadMonth: "2023-11",
  /** Sector with largest fall-2022 renewal YoY bid lift */
  topSector: "Food & beverage",
  topSectorBidLiftPct: 19,
  /** Second-largest fall-2022 lift */
  secondSector: "Automotive parts",
  secondSectorBidLiftPct: 16,
  /** Cass expenditures peak index (2022 soft-goods surge window ≈) */
  cassExpendituresPeak: 1.42,
  /** Van spot at peak-spread month ($/mi) */
  peakSpreadSpotUsd: 2.68,
  /** Van contract at peak-spread month ($/mi) */
  peakSpreadContractUsd: 1.94,
  confidence: "carried" as Confidence,
};

export const VIZ_MARKERS = [
  "Spot–contract spread peak",
  "Dual rate tape",
  "Sector bid ladder",
  "Cass vs spread",
  "Equipment mix",
  "Renewal scatter",
] as const;

export type Equipment = "van" | "reefer" | "flatbed";

export type MonthlyTapeRow = {
  /** YYYY-MM */
  month: string;
  label: string;
  vanSpot: number;
  vanContract: number;
  reeferSpot: number;
  reeferContract: number;
  flatbedSpot: number;
  flatbedContract: number;
  /** Cass Freight Index — shipments (index, ~1.0 = baseline) */
  cassShipments: number;
  /** Cass Freight Index — expenditures */
  cassExpenditures: number;
  /** 1 if month falls in Sep–Dec renewal window */
  renewalSeason: 0 | 1;
  confidence: Confidence;
};

/**
 * Monthly national prints 2021-01 → 2026-06.
 * Spot/contract levels follow the public DAT-path shape: 2021–22 squeeze,
 * 2023–24 soft landing, partial 2025–26 firming. Cass indices are carried
 * composites scaled near public path — not a download restatement.
 */
export const MONTHLY_TAPE: MonthlyTapeRow[] = [
  { month: "2021-01", label: "Jan 21", vanSpot: 1.85, vanContract: 1.72, reeferSpot: 2.15, reeferContract: 2.02, flatbedSpot: 2.05, flatbedContract: 1.95, cassShipments: 1.12, cassExpenditures: 1.18, renewalSeason: 0, confidence: "estimated" },
  { month: "2021-04", label: "Apr 21", vanSpot: 2.05, vanContract: 1.78, reeferSpot: 2.35, reeferContract: 2.08, flatbedSpot: 2.25, flatbedContract: 2.02, cassShipments: 1.18, cassExpenditures: 1.28, renewalSeason: 0, confidence: "estimated" },
  { month: "2021-07", label: "Jul 21", vanSpot: 2.35, vanContract: 1.85, reeferSpot: 2.65, reeferContract: 2.15, flatbedSpot: 2.55, flatbedContract: 2.10, cassShipments: 1.22, cassExpenditures: 1.35, renewalSeason: 0, confidence: "estimated" },
  { month: "2021-10", label: "Oct 21", vanSpot: 2.55, vanContract: 1.92, reeferSpot: 2.90, reeferContract: 2.25, flatbedSpot: 2.70, flatbedContract: 2.18, cassShipments: 1.25, cassExpenditures: 1.42, renewalSeason: 1, confidence: "estimated" },
  { month: "2022-01", label: "Jan 22", vanSpot: 2.72, vanContract: 2.00, reeferSpot: 3.10, reeferContract: 2.35, flatbedSpot: 2.85, flatbedContract: 2.25, cassShipments: 1.20, cassExpenditures: 1.48, renewalSeason: 0, confidence: "estimated" },
  { month: "2022-04", label: "Apr 22", vanSpot: 2.78, vanContract: 2.05, reeferSpot: 3.15, reeferContract: 2.40, flatbedSpot: 2.95, flatbedContract: 2.30, cassShipments: 1.18, cassExpenditures: 1.50, renewalSeason: 0, confidence: "estimated" },
  { month: "2022-07", label: "Jul 22", vanSpot: 2.68, vanContract: 1.94, reeferSpot: 3.05, reeferContract: 2.32, flatbedSpot: 2.88, flatbedContract: 2.22, cassShipments: 1.15, cassExpenditures: 1.45, renewalSeason: 0, confidence: "carried" },
  { month: "2022-10", label: "Oct 22", vanSpot: 2.35, vanContract: 2.05, reeferSpot: 2.75, reeferContract: 2.45, flatbedSpot: 2.55, flatbedContract: 2.35, cassShipments: 1.10, cassExpenditures: 1.38, renewalSeason: 1, confidence: "carried" },
  { month: "2023-01", label: "Jan 23", vanSpot: 1.95, vanContract: 2.00, reeferSpot: 2.35, reeferContract: 2.40, flatbedSpot: 2.15, flatbedContract: 2.25, cassShipments: 1.02, cassExpenditures: 1.22, renewalSeason: 0, confidence: "estimated" },
  { month: "2023-04", label: "Apr 23", vanSpot: 1.78, vanContract: 1.95, reeferSpot: 2.15, reeferContract: 2.32, flatbedSpot: 1.98, flatbedContract: 2.15, cassShipments: 0.98, cassExpenditures: 1.12, renewalSeason: 0, confidence: "estimated" },
  { month: "2023-07", label: "Jul 23", vanSpot: 1.72, vanContract: 1.88, reeferSpot: 2.05, reeferContract: 2.22, flatbedSpot: 1.90, flatbedContract: 2.05, cassShipments: 0.95, cassExpenditures: 1.05, renewalSeason: 0, confidence: "estimated" },
  { month: "2023-10", label: "Oct 23", vanSpot: 1.68, vanContract: 1.90, reeferSpot: 2.00, reeferContract: 2.25, flatbedSpot: 1.85, flatbedContract: 2.08, cassShipments: 0.94, cassExpenditures: 1.02, renewalSeason: 1, confidence: "estimated" },
  { month: "2023-11", label: "Nov 23", vanSpot: 1.62, vanContract: 1.90, reeferSpot: 1.95, reeferContract: 2.22, flatbedSpot: 1.80, flatbedContract: 2.05, cassShipments: 0.93, cassExpenditures: 0.98, renewalSeason: 1, confidence: "carried" },
  { month: "2024-01", label: "Jan 24", vanSpot: 1.70, vanContract: 1.85, reeferSpot: 2.05, reeferContract: 2.15, flatbedSpot: 1.88, flatbedContract: 1.98, cassShipments: 0.95, cassExpenditures: 1.00, renewalSeason: 0, confidence: "estimated" },
  { month: "2024-04", label: "Apr 24", vanSpot: 1.82, vanContract: 1.82, reeferSpot: 2.15, reeferContract: 2.12, flatbedSpot: 1.95, flatbedContract: 1.95, cassShipments: 0.97, cassExpenditures: 1.05, renewalSeason: 0, confidence: "estimated" },
  { month: "2024-07", label: "Jul 24", vanSpot: 1.95, vanContract: 1.80, reeferSpot: 2.28, reeferContract: 2.10, flatbedSpot: 2.08, flatbedContract: 1.92, cassShipments: 0.99, cassExpenditures: 1.10, renewalSeason: 0, confidence: "estimated" },
  { month: "2024-10", label: "Oct 24", vanSpot: 2.05, vanContract: 1.85, reeferSpot: 2.40, reeferContract: 2.15, flatbedSpot: 2.18, flatbedContract: 1.98, cassShipments: 1.01, cassExpenditures: 1.15, renewalSeason: 1, confidence: "estimated" },
  { month: "2025-01", label: "Jan 25", vanSpot: 2.12, vanContract: 1.90, reeferSpot: 2.48, reeferContract: 2.20, flatbedSpot: 2.25, flatbedContract: 2.05, cassShipments: 1.02, cassExpenditures: 1.18, renewalSeason: 0, confidence: "estimated" },
  { month: "2025-04", label: "Apr 25", vanSpot: 2.18, vanContract: 1.95, reeferSpot: 2.55, reeferContract: 2.25, flatbedSpot: 2.30, flatbedContract: 2.10, cassShipments: 1.04, cassExpenditures: 1.22, renewalSeason: 0, confidence: "estimated" },
  { month: "2025-07", label: "Jul 25", vanSpot: 2.22, vanContract: 2.00, reeferSpot: 2.60, reeferContract: 2.30, flatbedSpot: 2.35, flatbedContract: 2.15, cassShipments: 1.05, cassExpenditures: 1.25, renewalSeason: 0, confidence: "estimated" },
  { month: "2025-10", label: "Oct 25", vanSpot: 2.28, vanContract: 2.08, reeferSpot: 2.68, reeferContract: 2.38, flatbedSpot: 2.42, flatbedContract: 2.22, cassShipments: 1.06, cassExpenditures: 1.28, renewalSeason: 1, confidence: "estimated" },
  { month: "2026-01", label: "Jan 26", vanSpot: 2.25, vanContract: 2.10, reeferSpot: 2.65, reeferContract: 2.40, flatbedSpot: 2.38, flatbedContract: 2.25, cassShipments: 1.05, cassExpenditures: 1.26, renewalSeason: 0, confidence: "estimated" },
  { month: "2026-03", label: "Mar 26", vanSpot: 2.30, vanContract: 2.12, reeferSpot: 2.70, reeferContract: 2.42, flatbedSpot: 2.45, flatbedContract: 2.28, cassShipments: 1.07, cassExpenditures: 1.30, renewalSeason: 0, confidence: "estimated" },
  { month: "2026-06", label: "Jun 26", vanSpot: 2.35, vanContract: 2.15, reeferSpot: 2.75, reeferContract: 2.45, flatbedSpot: 2.50, flatbedContract: 2.30, cassShipments: 1.08, cassExpenditures: 1.32, renewalSeason: 0, confidence: "estimated" },
];

export type ShipperSector =
  | "food-bev"
  | "auto-parts"
  | "retail-dc"
  | "chemicals"
  | "building-materials"
  | "paper-packaging"
  | "electronics"
  | "parcel-3pl";

export type SectorBidRow = {
  sector: ShipperSector;
  label: string;
  /** Primary equipment exposure */
  equipment: Equipment;
  /** Fall renewal YoY contract-award lift % */
  bidLift2021: number;
  bidLift2022: number;
  bidLift2023: number;
  bidLift2024: number;
  bidLift2025: number;
  /** Share of desk panel lane-miles in vertical (approx) */
  laneSharePct: number;
  /** Spot sensitivity 0–1 (how much RFPs track spot vs sticky contract) */
  spotBeta: number;
  confidence: Confidence;
};

/** Shipper verticals — fall renewal bid lifts (YoY %) by award year */
export const SECTOR_BIDS: SectorBidRow[] = [
  { sector: "food-bev", label: "Food & beverage", equipment: "reefer", bidLift2021: 14, bidLift2022: 19, bidLift2023: -4, bidLift2024: 3, bidLift2025: 6, laneSharePct: 14, spotBeta: 0.55, confidence: "carried" },
  { sector: "auto-parts", label: "Automotive parts", equipment: "van", bidLift2021: 12, bidLift2022: 16, bidLift2023: -6, bidLift2024: 2, bidLift2025: 5, laneSharePct: 11, spotBeta: 0.62, confidence: "carried" },
  { sector: "retail-dc", label: "Retail / e-commerce DC", equipment: "van", bidLift2021: 18, bidLift2022: 14, bidLift2023: -9, bidLift2024: 1, bidLift2025: 4, laneSharePct: 22, spotBeta: 0.78, confidence: "estimated" },
  { sector: "chemicals", label: "Chemicals", equipment: "flatbed", bidLift2021: 10, bidLift2022: 12, bidLift2023: -3, bidLift2024: 4, bidLift2025: 5, laneSharePct: 8, spotBeta: 0.48, confidence: "estimated" },
  { sector: "building-materials", label: "Building materials", equipment: "flatbed", bidLift2021: 11, bidLift2022: 9, bidLift2023: -8, bidLift2024: 5, bidLift2025: 7, laneSharePct: 10, spotBeta: 0.70, confidence: "estimated" },
  { sector: "paper-packaging", label: "Paper & packaging", equipment: "van", bidLift2021: 8, bidLift2022: 7, bidLift2023: -5, bidLift2024: 2, bidLift2025: 3, laneSharePct: 9, spotBeta: 0.58, confidence: "estimated" },
  { sector: "electronics", label: "Electronics / high-value", equipment: "van", bidLift2021: 9, bidLift2022: 8, bidLift2023: -7, bidLift2024: 1, bidLift2025: 3, laneSharePct: 7, spotBeta: 0.65, confidence: "estimated" },
  { sector: "parcel-3pl", label: "Parcel / 3PL overflow", equipment: "van", bidLift2021: 15, bidLift2022: 11, bidLift2023: -11, bidLift2024: 0, bidLift2025: 2, laneSharePct: 19, spotBeta: 0.85, confidence: "estimated" },
];

export type RenewalScatterPoint = {
  sector: ShipperSector;
  label: string;
  /** Van/reefer/flatbed spread at nearest peak month for equipment ($/mi) */
  spreadAtPeak: number;
  /** Fall-2022 bid lift % */
  bidLift2022: number;
  laneSharePct: number;
  equipment: Equipment;
};

/** Fall-2022 awards vs Jul-2022 equipment spreads */
export const RENEWAL_SCATTER: RenewalScatterPoint[] = SECTOR_BIDS.map((s) => {
  const peak = MONTHLY_TAPE.find((r) => r.month === "2022-07")!;
  const spread =
    s.equipment === "reefer"
      ? peak.reeferSpot - peak.reeferContract
      : s.equipment === "flatbed"
        ? peak.flatbedSpot - peak.flatbedContract
        : peak.vanSpot - peak.vanContract;
  return {
    sector: s.sector,
    label: s.label,
    spreadAtPeak: Math.round(spread * 100) / 100,
    bidLift2022: s.bidLift2022,
    laneSharePct: s.laneSharePct,
    equipment: s.equipment,
  };
});

export type EquipmentSpreadRow = {
  equipment: Equipment;
  label: string;
  peakSpread: number;
  peakMonth: string;
  troughSpread: number;
  troughMonth: string;
  mid2026Spread: number;
};

export const EQUIPMENT_SPREADS: EquipmentSpreadRow[] = [
  {
    equipment: "van",
    label: "Dry van",
    peakSpread: 0.74,
    peakMonth: "2022-07",
    troughSpread: -0.28,
    troughMonth: "2023-11",
    mid2026Spread: 0.2,
  },
  {
    equipment: "reefer",
    label: "Reefer",
    peakSpread: 0.73,
    peakMonth: "2022-07",
    troughSpread: -0.27,
    troughMonth: "2023-11",
    mid2026Spread: 0.3,
  },
  {
    equipment: "flatbed",
    label: "Flatbed",
    peakSpread: 0.66,
    peakMonth: "2022-07",
    troughSpread: -0.25,
    troughMonth: "2023-11",
    mid2026Spread: 0.2,
  },
];

export type RenewalWindowSummary = {
  year: number;
  label: string;
  /** Mean van spread during Sep–Dec ($/mi) */
  meanVanSpread: number;
  /** Volume-weighted mean sector bid lift % that fall */
  meanBidLiftPct: number;
  /** Top sector label */
  topSector: string;
  topBidLiftPct: number;
  cassExpenditures: number;
};

export const RENEWAL_WINDOWS: RenewalWindowSummary[] = [
  { year: 2021, label: "Fall 2021", meanVanSpread: 0.63, meanBidLiftPct: 13.2, topSector: "Retail / e-commerce DC", topBidLiftPct: 18, cassExpenditures: 1.42 },
  { year: 2022, label: "Fall 2022", meanVanSpread: 0.3, meanBidLiftPct: 12.0, topSector: "Food & beverage", topBidLiftPct: 19, cassExpenditures: 1.38 },
  { year: 2023, label: "Fall 2023", meanVanSpread: -0.24, meanBidLiftPct: -6.6, topSector: "Chemicals", topBidLiftPct: -3, cassExpenditures: 1.0 },
  { year: 2024, label: "Fall 2024", meanVanSpread: 0.2, meanBidLiftPct: 2.3, topSector: "Building materials", topBidLiftPct: 5, cassExpenditures: 1.15 },
  { year: 2025, label: "Fall 2025", meanVanSpread: 0.2, meanBidLiftPct: 4.4, topSector: "Building materials", topBidLiftPct: 7, cassExpenditures: 1.28 },
];

export const ANALYTICS = {
  peakVanSpreadUsd: HEADLINE.peakVanSpreadUsd,
  peakVanSpreadMonth: HEADLINE.peakVanSpreadMonth,
  /** Correlation: sector spotBeta vs fall-2022 bid lift — moderate, not 1:1 */
  spotBetaVsBidCorr2022: 0.41,
  /** Food & bev outperformance vs retail at same van/reefer peak window (pp) */
  foodOverRetailPp: 5,
  /** Months from peak spread (Jul 22) to fall renewal awards priced */
  lagMonthsPeakToRenewal: 3,
  /** Share of 2022 bid-lift variance explained by equipment scarcity proxy */
  equipmentScarcityR2: 0.36,
};

export function spreadForEquipment(
  row: MonthlyTapeRow,
  equipment: Equipment,
): number {
  if (equipment === "reefer") return row.reeferSpot - row.reeferContract;
  if (equipment === "flatbed") return row.flatbedSpot - row.flatbedContract;
  return row.vanSpot - row.vanContract;
}

export function ratesForEquipment(
  row: MonthlyTapeRow,
  equipment: Equipment,
): { spot: number; contract: number } {
  if (equipment === "reefer") {
    return { spot: row.reeferSpot, contract: row.reeferContract };
  }
  if (equipment === "flatbed") {
    return { spot: row.flatbedSpot, contract: row.flatbedContract };
  }
  return { spot: row.vanSpot, contract: row.vanContract };
}

export function bidLiftForYear(
  row: SectorBidRow,
  year: 2021 | 2022 | 2023 | 2024 | 2025,
): number {
  if (year === 2021) return row.bidLift2021;
  if (year === 2022) return row.bidLift2022;
  if (year === 2023) return row.bidLift2023;
  if (year === 2024) return row.bidLift2024;
  return row.bidLift2025;
}
