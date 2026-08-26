/**
 * NTD unlinked passenger trips versus 2019 by agency size (2026).
 *
 * Core question: How close are large urban reporters to 2019 unlinked
 * passenger trips, and did rail recover faster than bus?
 *
 * Primary anchors: FTA National Transit Database (NTD) annual UPT and
 * monthly ridership time series through CY2024; APTA Ridership Report /
 * Policy Brief (May 2025) mode recovery vs 2019; Census ACS journey-to-
 * work public-transit commute shares for context. Size-band medians,
 * mode indices, and the curated agency panel are desk compilations from
 * those public series — not an FTA-published size-band product.
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "National unlinked passenger trip (UPT) totals and mode splits follow " +
  "FTA NTD annual / monthly ridership releases for calendar years 2019–2024 " +
  "(2024 National Transit Summaries and Trends and Monthly Module). Mode " +
  "recovery percentages versus the same month in 2019 follow APTA Ridership " +
  "Trends / Policy Brief (May 2025) for December 2024. Agency-size bands " +
  "group full reporters by 2019 total UPT; band medians and the curated " +
  "panel are desk calculations from public NTD agency totals. ACS " +
  "commute-by-public-transportation shares are Census ACS 1-year estimates " +
  "for the named metro areas (2019 vs 2023). Figures illustrate the public " +
  "recovery pattern — not a substitute for raw NTD agency downloads.";

export const SOURCES = [
  {
    label: "FTA — National Transit Database data products",
    url: "https://www.transit.dot.gov/ntd/ntd-data",
  },
  {
    label: "FTA — 2024 National Transit Summaries and Trends",
    url: "https://www.transit.dot.gov/ntd/data-product/2024-national-transit-summaries-and-trends",
  },
  {
    label: "APTA — Transit Ridership Policy Brief (May 2025)",
    url: "https://www.apta.com/wp-content/uploads/APTA-Policy-Brief-Transit-Ridership-May-2025.pdf",
  },
  {
    label: "APTA — 2024 Q4 Ridership Report",
    url: "https://www.apta.com/wp-content/uploads/2024-Q4-Ridership-APTA.pdf",
  },
  {
    label: "Census — ACS journey to work (public transportation)",
    url: "https://www.census.gov/programs-surveys/acs",
  },
] as const;

export const VIZ_MARKERS = [
  "UPT index vs 2019 path",
  "Size-band recovery bars",
  "Mode recovery radar",
  "Agency scatter by size",
] as const;

export const BASE_YEAR = 2019;
export const COMPARE_YEAR = 2024;

/** Headline punchline for cards / job ready */
export const HEADLINE = {
  nationalIndex2024: 79,
  busIndexDec2024: 86,
  railIndexDec2024: 72,
  megaUrbanMedianIndex: 74,
  midSizeMedianIndex: 88,
  agenciesAtOrAbove2019Pct: 7,
  panelN: 24,
  busLeadsRailPts: 14,
} as const;

export type SizeBandId = "mega" | "large" | "mid" | "small";
export type ModeId =
  | "bus"
  | "heavy-rail"
  | "light-rail"
  | "commuter-rail"
  | "demand-response"
  | "all-rail"
  | "all-modes";

export type SizeBand = {
  id: SizeBandId;
  label: string;
  /** Inclusive lower bound on 2019 UPT (millions) */
  minUptM: number;
  maxUptM: number | null;
  /** Desk median UPT index vs 2019 for CY2024 */
  medianIndex: number;
  /** Interquartile-style low / high for the band */
  p25Index: number;
  p75Index: number;
  /** Share of national 2019 UPT in band (approx.) */
  shareOf2019UptPct: number;
  /** Count of full reporters in curated universe */
  agencyCount: number;
  confidence: Confidence;
};

export const SIZE_BANDS: SizeBand[] = [
  {
    id: "mega",
    label: "Mega urban (≥500M UPT)",
    minUptM: 500,
    maxUptM: null,
    medianIndex: 74,
    p25Index: 66,
    p75Index: 79,
    shareOf2019UptPct: 42,
    agencyCount: 4,
    confidence: "derived",
  },
  {
    id: "large",
    label: "Large urban (50–500M)",
    minUptM: 50,
    maxUptM: 500,
    medianIndex: 78,
    p25Index: 68,
    p75Index: 86,
    shareOf2019UptPct: 38,
    agencyCount: 28,
    confidence: "derived",
  },
  {
    id: "mid",
    label: "Mid-size (10–50M)",
    minUptM: 10,
    maxUptM: 50,
    medianIndex: 88,
    p25Index: 78,
    p75Index: 98,
    shareOf2019UptPct: 12,
    agencyCount: 55,
    confidence: "derived",
  },
  {
    id: "small",
    label: "Small urban (<10M)",
    minUptM: 0,
    maxUptM: 10,
    medianIndex: 92,
    p25Index: 82,
    p75Index: 105,
    shareOf2019UptPct: 8,
    agencyCount: 120,
    confidence: "derived",
  },
];

/** National UPT index path (2019 = 100), desk-aligned to NTD/APTA annuals */
export type YearIndex = {
  year: number;
  allModes: number;
  bus: number;
  rail: number;
  demandResponse: number;
  uptBillions: number;
  confidence: Confidence;
};

export const NATIONAL_INDEX: YearIndex[] = [
  {
    year: 2019,
    allModes: 100,
    bus: 100,
    rail: 100,
    demandResponse: 100,
    uptBillions: 9.9,
    confidence: "disclosed",
  },
  {
    year: 2020,
    allModes: 47,
    bus: 52,
    rail: 38,
    demandResponse: 55,
    uptBillions: 4.6,
    confidence: "disclosed",
  },
  {
    year: 2021,
    allModes: 52,
    bus: 58,
    rail: 44,
    demandResponse: 62,
    uptBillions: 5.1,
    confidence: "disclosed",
  },
  {
    year: 2022,
    allModes: 65,
    bus: 69,
    rail: 62,
    demandResponse: 74,
    uptBillions: 6.4,
    confidence: "disclosed",
  },
  {
    year: 2023,
    allModes: 72,
    bus: 81,
    rail: 70,
    demandResponse: 86,
    uptBillions: 7.1,
    confidence: "disclosed",
  },
  {
    year: 2024,
    allModes: 79,
    bus: 86,
    rail: 72,
    demandResponse: 93,
    uptBillions: 7.7,
    confidence: "disclosed",
  },
];

/** December 2024 mode recovery vs Dec 2019 (APTA Policy Brief) */
export type ModeRecovery = {
  mode: ModeId;
  label: string;
  indexVs2019: number;
  /** Rough share of 2019 national UPT */
  share2019Pct: number;
  note: string;
  confidence: Confidence;
};

export const MODE_RECOVERY: ModeRecovery[] = [
  {
    mode: "demand-response",
    label: "Demand response",
    indexVs2019: 93,
    share2019Pct: 2,
    note: "Highest mode recovery; paratransit retained essential trips.",
    confidence: "disclosed",
  },
  {
    mode: "bus",
    label: "Bus (all)",
    indexVs2019: 86,
    share2019Pct: 48,
    note: "Led fixed-route recovery; essential-worker base held better than CBD rail.",
    confidence: "disclosed",
  },
  {
    mode: "light-rail",
    label: "Light rail / streetcar",
    indexVs2019: 76,
    share2019Pct: 5,
    note: "Between bus and heavy rail; mixed traffic corridors recovered unevenly.",
    confidence: "disclosed",
  },
  {
    mode: "heavy-rail",
    label: "Heavy rail",
    indexVs2019: 71,
    share2019Pct: 35,
    note: "Office-corridor subways still short of 2019 peak loads.",
    confidence: "disclosed",
  },
  {
    mode: "commuter-rail",
    label: "Commuter rail",
    indexVs2019: 70,
    share2019Pct: 5,
    note: "Peak-period CBD feeders lag; hybrid work cut midday and reverse peaks less.",
    confidence: "disclosed",
  },
  {
    mode: "all-rail",
    label: "All rail (aggregate)",
    indexVs2019: 72,
    share2019Pct: 45,
    note: "Rail aggregate trails bus by ~14 index points as of Dec 2024.",
    confidence: "disclosed",
  },
  {
    mode: "all-modes",
    label: "All modes",
    indexVs2019: 79,
    share2019Pct: 100,
    note: "Industry closed 2024 near four-fifths of 2019 UPT.",
    confidence: "disclosed",
  },
];

export type AgencyRow = {
  id: string;
  name: string;
  shortName: string;
  urbanArea: string;
  sizeBand: SizeBandId;
  /** 2019 UPT, millions */
  upt2019M: number;
  /** 2024 UPT, millions */
  upt2024M: number;
  /** Index vs 2019 (= 100 × 2024/2019) */
  indexVs2019: number;
  /** Bus share of 2019 UPT within agency (approx.) */
  busShare2019Pct: number;
  /** Rail share of 2019 UPT within agency (approx.) */
  railShare2019Pct: number;
  /** Bus-only index vs 2019 where separable */
  busIndex: number | null;
  /** Rail-only index vs 2019 where separable */
  railIndex: number | null;
  atOrAbove2019: boolean;
  confidence: Confidence;
};

/**
 * Curated 24-agency panel spanning size bands. Totals desk-aligned to
 * published NTD agency annuals / APTA urban-area summaries (rounded).
 */
export const AGENCIES: AgencyRow[] = [
  {
    id: "nyct",
    name: "MTA New York City Transit",
    shortName: "NYCT",
    urbanArea: "New York–Newark",
    sizeBand: "mega",
    upt2019M: 2270,
    upt2024M: 1790,
    indexVs2019: 79,
    busShare2019Pct: 32,
    railShare2019Pct: 68,
    busIndex: 84,
    railIndex: 76,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "cta",
    name: "Chicago Transit Authority",
    shortName: "CTA",
    urbanArea: "Chicago",
    sizeBand: "large",
    upt2019M: 455,
    upt2024M: 302,
    indexVs2019: 66,
    busShare2019Pct: 55,
    railShare2019Pct: 45,
    busIndex: 72,
    railIndex: 58,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "lametro",
    name: "Los Angeles County Metro",
    shortName: "LA Metro",
    urbanArea: "Los Angeles–Long Beach",
    sizeBand: "large",
    upt2019M: 378,
    upt2024M: 315,
    indexVs2019: 83,
    busShare2019Pct: 78,
    railShare2019Pct: 22,
    busIndex: 85,
    railIndex: 76,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "wmata",
    name: "Washington Metropolitan Area Transit Authority",
    shortName: "WMATA",
    urbanArea: "Washington, DC",
    sizeBand: "large",
    upt2019M: 350,
    upt2024M: 245,
    indexVs2019: 70,
    busShare2019Pct: 35,
    railShare2019Pct: 65,
    busIndex: 78,
    railIndex: 65,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "mbta",
    name: "Massachusetts Bay Transportation Authority",
    shortName: "MBTA",
    urbanArea: "Boston",
    sizeBand: "large",
    upt2019M: 360,
    upt2024M: 254,
    indexVs2019: 71,
    busShare2019Pct: 40,
    railShare2019Pct: 60,
    busIndex: 76,
    railIndex: 68,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "septa",
    name: "Southeastern Pennsylvania Transportation Authority",
    shortName: "SEPTA",
    urbanArea: "Philadelphia",
    sizeBand: "large",
    upt2019M: 308,
    upt2024M: 212,
    indexVs2019: 69,
    busShare2019Pct: 55,
    railShare2019Pct: 45,
    busIndex: 74,
    railIndex: 62,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "bart",
    name: "Bay Area Rapid Transit",
    shortName: "BART",
    urbanArea: "San Francisco–Oakland",
    sizeBand: "large",
    upt2019M: 128,
    upt2024M: 70,
    indexVs2019: 55,
    busShare2019Pct: 0,
    railShare2019Pct: 100,
    busIndex: null,
    railIndex: 55,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "sfmta",
    name: "San Francisco Municipal Transportation Agency",
    shortName: "SFMTA",
    urbanArea: "San Francisco–Oakland",
    sizeBand: "large",
    upt2019M: 223,
    upt2024M: 156,
    indexVs2019: 70,
    busShare2019Pct: 70,
    railShare2019Pct: 30,
    busIndex: 74,
    railIndex: 62,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "metro-houston",
    name: "Metropolitan Transit Authority of Harris County",
    shortName: "Houston METRO",
    urbanArea: "Houston",
    sizeBand: "large",
    upt2019M: 90,
    upt2024M: 77,
    indexVs2019: 86,
    busShare2019Pct: 82,
    railShare2019Pct: 18,
    busIndex: 88,
    railIndex: 78,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "miami-dade",
    name: "Miami-Dade Transit",
    shortName: "Miami-Dade",
    urbanArea: "Miami",
    sizeBand: "large",
    upt2019M: 78,
    upt2024M: 67,
    indexVs2019: 86,
    busShare2019Pct: 85,
    railShare2019Pct: 15,
    busIndex: 88,
    railIndex: 74,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "dart",
    name: "Dallas Area Rapid Transit",
    shortName: "DART",
    urbanArea: "Dallas–Fort Worth",
    sizeBand: "large",
    upt2019M: 70,
    upt2024M: 57,
    indexVs2019: 81,
    busShare2019Pct: 55,
    railShare2019Pct: 45,
    busIndex: 86,
    railIndex: 74,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "marta",
    name: "Metropolitan Atlanta Rapid Transit Authority",
    shortName: "MARTA",
    urbanArea: "Atlanta",
    sizeBand: "large",
    upt2019M: 134,
    upt2024M: 77,
    indexVs2019: 57,
    busShare2019Pct: 50,
    railShare2019Pct: 50,
    busIndex: 62,
    railIndex: 52,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "king-county",
    name: "King County Metro",
    shortName: "King County",
    urbanArea: "Seattle",
    sizeBand: "large",
    upt2019M: 122,
    upt2024M: 95,
    indexVs2019: 78,
    busShare2019Pct: 92,
    railShare2019Pct: 8,
    busIndex: 79,
    railIndex: 68,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "rti",
    name: "TriMet",
    shortName: "TriMet",
    urbanArea: "Portland, OR",
    sizeBand: "large",
    upt2019M: 98,
    upt2024M: 72,
    indexVs2019: 73,
    busShare2019Pct: 60,
    railShare2019Pct: 40,
    busIndex: 78,
    railIndex: 66,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "rtad",
    name: "Regional Transportation District",
    shortName: "RTD Denver",
    urbanArea: "Denver",
    sizeBand: "large",
    upt2019M: 105,
    upt2024M: 72,
    indexVs2019: 69,
    busShare2019Pct: 55,
    railShare2019Pct: 45,
    busIndex: 76,
    railIndex: 60,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "utah-ta",
    name: "Utah Transit Authority",
    shortName: "UTA",
    urbanArea: "Salt Lake City",
    sizeBand: "mid",
    upt2019M: 46,
    upt2024M: 40,
    indexVs2019: 87,
    busShare2019Pct: 55,
    railShare2019Pct: 45,
    busIndex: 90,
    railIndex: 82,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "capmetro",
    name: "Capital Metropolitan Transportation Authority",
    shortName: "CapMetro",
    urbanArea: "Austin",
    sizeBand: "mid",
    upt2019M: 32,
    upt2024M: 28,
    indexVs2019: 88,
    busShare2019Pct: 95,
    railShare2019Pct: 5,
    busIndex: 89,
    railIndex: 70,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "valley-metro",
    name: "Valley Metro",
    shortName: "Valley Metro",
    urbanArea: "Phoenix",
    sizeBand: "large",
    upt2019M: 68,
    upt2024M: 41,
    indexVs2019: 60,
    busShare2019Pct: 80,
    railShare2019Pct: 20,
    busIndex: 62,
    railIndex: 52,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "richmond",
    name: "Greater Richmond Transit Company",
    shortName: "GRTC",
    urbanArea: "Richmond",
    sizeBand: "small",
    upt2019M: 9.2,
    upt2024M: 11.5,
    indexVs2019: 125,
    busShare2019Pct: 100,
    railShare2019Pct: 0,
    busIndex: 125,
    railIndex: null,
    atOrAbove2019: true,
    confidence: "derived",
  },
  {
    id: "tucson",
    name: "City of Tucson / Sun Tran",
    shortName: "Sun Tran",
    urbanArea: "Tucson",
    sizeBand: "mid",
    upt2019M: 16.5,
    upt2024M: 18.2,
    indexVs2019: 110,
    busShare2019Pct: 100,
    railShare2019Pct: 0,
    busIndex: 110,
    railIndex: null,
    atOrAbove2019: true,
    confidence: "derived",
  },
  {
    id: "alexandria",
    name: "City of Alexandria DASH",
    shortName: "DASH",
    urbanArea: "Washington, DC",
    sizeBand: "small",
    upt2019M: 4.1,
    upt2024M: 5.5,
    indexVs2019: 134,
    busShare2019Pct: 100,
    railShare2019Pct: 0,
    busIndex: 134,
    railIndex: null,
    atOrAbove2019: true,
    confidence: "derived",
  },
  {
    id: "albany-cdta",
    name: "Capital District Transportation Authority",
    shortName: "CDTA",
    urbanArea: "Albany",
    sizeBand: "small",
    upt2019M: 16.8,
    upt2024M: 17.4,
    indexVs2019: 104,
    busShare2019Pct: 100,
    railShare2019Pct: 0,
    busIndex: 104,
    railIndex: null,
    atOrAbove2019: true,
    confidence: "derived",
  },
  {
    id: "indygo",
    name: "Indianapolis Public Transportation Corporation",
    shortName: "IndyGo",
    urbanArea: "Indianapolis",
    sizeBand: "small",
    upt2019M: 9.8,
    upt2024M: 8.6,
    indexVs2019: 88,
    busShare2019Pct: 100,
    railShare2019Pct: 0,
    busIndex: 88,
    railIndex: null,
    atOrAbove2019: false,
    confidence: "derived",
  },
  {
    id: "milwaukee",
    name: "Milwaukee County Transit System",
    shortName: "MCTS",
    urbanArea: "Milwaukee",
    sizeBand: "mid",
    upt2019M: 38,
    upt2024M: 33,
    indexVs2019: 87,
    busShare2019Pct: 100,
    railShare2019Pct: 0,
    busIndex: 87,
    railIndex: null,
    atOrAbove2019: false,
    confidence: "derived",
  },
];

/** ACS public-transit commute share context (percentage points of workers) */
export type CommuteRow = {
  urbanArea: string;
  share2019Pct: number;
  share2023Pct: number;
  deltaPts: number;
  note: string;
};

export const COMMUTE_SHARES: CommuteRow[] = [
  {
    urbanArea: "New York–Newark",
    share2019Pct: 31.6,
    share2023Pct: 26.8,
    deltaPts: -4.8,
    note: "Still the U.S. transit-commute capital; hybrid work cut CBD peaks.",
  },
  {
    urbanArea: "San Francisco–Oakland",
    share2019Pct: 17.2,
    share2023Pct: 11.4,
    deltaPts: -5.8,
    note: "Steepest large-metro drop; BART/Caltrain peak loads remain soft.",
  },
  {
    urbanArea: "Washington, DC",
    share2019Pct: 13.1,
    share2023Pct: 9.8,
    deltaPts: -3.3,
    note: "Federal hybrid schedules compressed Metrorail peaks.",
  },
  {
    urbanArea: "Boston",
    share2019Pct: 13.4,
    share2023Pct: 10.6,
    deltaPts: -2.8,
    note: "Commuter rail recovered faster than heavy/light rail locally.",
  },
  {
    urbanArea: "Chicago",
    share2019Pct: 12.4,
    share2023Pct: 9.1,
    deltaPts: -3.3,
    note: "Loop office occupancy still below 2019; CTA rail lags bus.",
  },
  {
    urbanArea: "Houston",
    share2019Pct: 2.4,
    share2023Pct: 2.1,
    deltaPts: -0.3,
    note: "Low baseline; bus-heavy METRO closer to 2019 UPT.",
  },
  {
    urbanArea: "Phoenix",
    share2019Pct: 1.9,
    share2023Pct: 1.5,
    deltaPts: -0.4,
    note: "Auto-oriented metro; UPT recovery still weak on a thin base.",
  },
  {
    urbanArea: "Tucson",
    share2019Pct: 2.8,
    share2023Pct: 2.9,
    deltaPts: 0.1,
    note: "Fare-free period and bus-only network pushed UPT above 2019.",
  },
];

export const DETAIL_TABLE = AGENCIES.map((a) => ({
  agency: a.shortName,
  urbanArea: a.urbanArea,
  sizeBand: SIZE_BANDS.find((b) => b.id === a.sizeBand)?.label ?? a.sizeBand,
  upt2019M: a.upt2019M,
  upt2024M: a.upt2024M,
  indexVs2019: a.indexVs2019,
  busShare2019Pct: a.busShare2019Pct,
  railShare2019Pct: a.railShare2019Pct,
  busIndex: a.busIndex,
  railIndex: a.railIndex,
  recovered: a.atOrAbove2019 ? "Yes" : "No",
}));

export function filterAgencies(
  size: SizeBandId | "all",
  modeFocus: "all" | "bus-heavy" | "rail-heavy",
): AgencyRow[] {
  return AGENCIES.filter((a) => {
    if (size !== "all" && a.sizeBand !== size) return false;
    if (modeFocus === "bus-heavy" && a.busShare2019Pct < 70) return false;
    if (modeFocus === "rail-heavy" && a.railShare2019Pct < 40) return false;
    return true;
  });
}

export function sizeBandBars(rows: AgencyRow[]) {
  const ids: SizeBandId[] = ["mega", "large", "mid", "small"];
  return ids.map((id) => {
    const band = SIZE_BANDS.find((b) => b.id === id)!;
    const subset = rows.filter((r) => r.sizeBand === id);
    const median =
      subset.length === 0
        ? band.medianIndex
        : medianOf(subset.map((r) => r.indexVs2019));
    return {
      id,
      label: band.label.replace(/ \(.*\)/, ""),
      fullLabel: band.label,
      medianIndex: Math.round(median),
      p25: band.p25Index,
      p75: band.p75Index,
      n: subset.length || band.agencyCount,
      shareOf2019UptPct: band.shareOf2019UptPct,
    };
  });
}

export function modeRadarRows() {
  return MODE_RECOVERY.filter((m) =>
    ["bus", "heavy-rail", "light-rail", "commuter-rail", "demand-response"].includes(
      m.mode,
    ),
  ).map((m) => ({
    mode: m.label,
    index: m.indexVs2019,
    fullMark: 100,
  }));
}

export function nationalPathSeries() {
  return NATIONAL_INDEX.map((y) => ({
    year: String(y.year),
    allModes: y.allModes,
    bus: y.bus,
    rail: y.rail,
    demandResponse: y.demandResponse,
    uptBillions: y.uptBillions,
  }));
}

export function scatterPoints(rows: AgencyRow[]) {
  return rows.map((a) => ({
    name: a.shortName,
    upt2019M: a.upt2019M,
    indexVs2019: a.indexVs2019,
    busShare: a.busShare2019Pct,
    railShare: a.railShare2019Pct,
    sizeBand: a.sizeBand,
    recovered: a.atOrAbove2019,
  }));
}

function medianOf(vals: number[]): number {
  if (vals.length === 0) return 0;
  const s = [...vals].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

export function fmtIndex(n: number): string {
  return `${Math.round(n)}`;
}

export function fmtUptM(n: number): string {
  if (n >= 100) return `${Math.round(n)}M`;
  if (n >= 10) return `${n.toFixed(0)}M`;
  return `${n.toFixed(1)}M`;
}
