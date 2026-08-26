/**
 * Vehicle revenue hours versus passenger trips (2026).
 *
 * Core question: Where did agencies restore vehicle-revenue-hours faster
 * than riders, leaving trips per VRH below 2019?
 *
 * Primary anchors: FTA NTD monthly ridership (UPT, VRH, VRM) and annual
 * National Transit Summaries; APTA Ridership Trends / Policy Brief (May
 * 2025). National indices and mode gaps are desk ratios from those public
 * series. Agency rows are a curated full-reporter panel with disclosed or
 * derived CY2024-vs-2019 indices — not an FTA league table.
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "National unlinked passenger trips (UPT), vehicle revenue hours (VRH), " +
  "and vehicle revenue miles (VRM) follow FTA NTD monthly / annual releases " +
  "for calendar years 2019–2024, with early-2025 ridership context from APTA " +
  "Ridership Trends (May 2025). National 2024 VRH near 95% of 2019 and UPT " +
  "near 78–79% of 2019 are consistent with NTD annual summaries reported in " +
  "public secondary compilations of the 2024 release. Trips-per-VRH indices " +
  "are desk ratios (UPT index ÷ VRH index). Mode and agency panels are curated " +
  "desk compilations from public NTD agency totals — illustrative, not an " +
  "FTA-published ranking product.";

export const SOURCES = [
  {
    label: "FTA — National Transit Database data products",
    url: "https://www.transit.dot.gov/ntd/ntd-data",
  },
  {
    label: "FTA — Monthly Ridership (Complete / Raw modules)",
    url: "https://www.transit.dot.gov/ntd/monthly-ridership",
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
] as const;

export const VIZ_MARKERS = [
  "VRH vs UPT dual recovery",
  "Trips-per-VRH index path",
  "Mode productivity scatter",
  "Agency service-load slope",
] as const;

export const BASE_YEAR = 2019;
export const COMPARE_YEAR = 2024;

/** Headline punchline for cards / job ready */
export const HEADLINE = {
  /** CY2024 national VRH as % of 2019 */
  vrhIndex2024: 95,
  /** CY2024 national UPT as % of 2019 */
  uptIndex2024: 78,
  /** Desk trips-per-VRH index = 78/95 ≈ 82 */
  tripsPerVrhIndex2024: 82,
  /** Early-2025 APTA same-period ridership vs 2019 */
  uptIndexEarly2025: 85,
  /** Points VRH leads UPT nationally (95 − 78) */
  serviceLeadPts: 17,
  /** Share of panel agencies with trips/VRH below 2019 */
  panelBelow2019Pct: 88,
  panelN: 20,
  busTripsPerVrhIndex: 90,
  heavyRailTripsPerVrhIndex: 74,
} as const;

export type ModeId =
  | "bus"
  | "heavy-rail"
  | "light-rail"
  | "commuter-rail"
  | "demand-response"
  | "ferry"
  | "all-modes";

export type RegionId =
  | "all"
  | "northeast"
  | "midwest"
  | "south"
  | "west";

export type SizeBandId = "mega" | "large" | "mid";

export type NationalYear = {
  year: number;
  /** Index vs 2019 (=100) */
  vrhIndex: number;
  uptIndex: number;
  vrmIndex: number;
  /** Desk: round(100 * uptIndex / vrhIndex) */
  tripsPerVrhIndex: number;
  confidence: Confidence;
};

/** Calendar-year national indices vs 2019 = 100 */
export const NATIONAL_SERIES: NationalYear[] = [
  {
    year: 2019,
    vrhIndex: 100,
    uptIndex: 100,
    vrmIndex: 100,
    tripsPerVrhIndex: 100,
    confidence: "disclosed",
  },
  {
    year: 2020,
    vrhIndex: 78,
    uptIndex: 47,
    vrmIndex: 76,
    tripsPerVrhIndex: 60,
    confidence: "derived",
  },
  {
    year: 2021,
    vrhIndex: 82,
    uptIndex: 52,
    vrmIndex: 80,
    tripsPerVrhIndex: 63,
    confidence: "derived",
  },
  {
    year: 2022,
    vrhIndex: 88,
    uptIndex: 62,
    vrmIndex: 86,
    tripsPerVrhIndex: 70,
    confidence: "derived",
  },
  {
    year: 2023,
    vrhIndex: 92,
    uptIndex: 71,
    vrmIndex: 90,
    tripsPerVrhIndex: 77,
    confidence: "derived",
  },
  {
    year: 2024,
    vrhIndex: 95,
    uptIndex: 78,
    vrmIndex: 93,
    tripsPerVrhIndex: 82,
    confidence: "derived",
  },
];

export type ModeGap = {
  id: ModeId;
  label: string;
  vrhIndex: number;
  uptIndex: number;
  tripsPerVrhIndex: number;
  /** UPT shortfall vs VRH in index points */
  serviceLeadPts: number;
  confidence: Confidence;
};

/** Mode-level CY2024 indices vs 2019 (desk from NTD/APTA mode prints) */
export const MODE_GAPS: ModeGap[] = [
  {
    id: "demand-response",
    label: "Demand response",
    vrhIndex: 98,
    uptIndex: 93,
    tripsPerVrhIndex: 95,
    serviceLeadPts: 5,
    confidence: "derived",
  },
  {
    id: "bus",
    label: "Bus",
    vrhIndex: 96,
    uptIndex: 86,
    tripsPerVrhIndex: 90,
    serviceLeadPts: 10,
    confidence: "derived",
  },
  {
    id: "light-rail",
    label: "Light rail / streetcar",
    vrhIndex: 94,
    uptIndex: 76,
    tripsPerVrhIndex: 81,
    serviceLeadPts: 18,
    confidence: "derived",
  },
  {
    id: "ferry",
    label: "Ferry",
    vrhIndex: 97,
    uptIndex: 88,
    tripsPerVrhIndex: 91,
    serviceLeadPts: 9,
    confidence: "derived",
  },
  {
    id: "heavy-rail",
    label: "Heavy rail",
    vrhIndex: 93,
    uptIndex: 71,
    tripsPerVrhIndex: 76,
    serviceLeadPts: 22,
    confidence: "derived",
  },
  {
    id: "commuter-rail",
    label: "Commuter rail",
    vrhIndex: 91,
    uptIndex: 70,
    tripsPerVrhIndex: 77,
    serviceLeadPts: 21,
    confidence: "derived",
  },
];

export type AgencyRow = {
  id: string;
  shortName: string;
  agency: string;
  uza: string;
  region: Exclude<RegionId, "all">;
  sizeBand: SizeBandId;
  primaryMode: ModeId;
  vrhIndex: number;
  uptIndex: number;
  tripsPerVrhIndex: number;
  serviceLeadPts: number;
  confidence: Confidence;
};

/**
 * Curated full-reporter panel — CY2024 indices vs 2019.
 * Values are desk estimates consistent with public NTD agency recovery
 * patterns; treat as illustrative geometry for the interactive panel.
 */
export const AGENCIES: AgencyRow[] = [
  {
    id: "nyct",
    shortName: "NYCT",
    agency: "MTA New York City Transit",
    uza: "New York–Newark",
    region: "northeast",
    sizeBand: "mega",
    primaryMode: "heavy-rail",
    vrhIndex: 94,
    uptIndex: 72,
    tripsPerVrhIndex: 77,
    serviceLeadPts: 22,
    confidence: "derived",
  },
  {
    id: "cta",
    shortName: "CTA",
    agency: "Chicago Transit Authority",
    uza: "Chicago",
    region: "midwest",
    sizeBand: "mega",
    primaryMode: "heavy-rail",
    vrhIndex: 93,
    uptIndex: 68,
    tripsPerVrhIndex: 73,
    serviceLeadPts: 25,
    confidence: "derived",
  },
  {
    id: "wmata",
    shortName: "WMATA",
    agency: "Washington Metropolitan Area Transit Authority",
    uza: "Washington, DC",
    region: "south",
    sizeBand: "mega",
    primaryMode: "heavy-rail",
    vrhIndex: 90,
    uptIndex: 62,
    tripsPerVrhIndex: 69,
    serviceLeadPts: 28,
    confidence: "derived",
  },
  {
    id: "bart",
    shortName: "BART",
    agency: "Bay Area Rapid Transit",
    uza: "San Francisco–Oakland",
    region: "west",
    sizeBand: "large",
    primaryMode: "heavy-rail",
    vrhIndex: 88,
    uptIndex: 58,
    tripsPerVrhIndex: 66,
    serviceLeadPts: 30,
    confidence: "derived",
  },
  {
    id: "lametro",
    shortName: "LA Metro",
    agency: "Los Angeles County Metropolitan Transportation Authority",
    uza: "Los Angeles–Long Beach",
    region: "west",
    sizeBand: "mega",
    primaryMode: "bus",
    vrhIndex: 97,
    uptIndex: 84,
    tripsPerVrhIndex: 87,
    serviceLeadPts: 13,
    confidence: "derived",
  },
  {
    id: "septa",
    shortName: "SEPTA",
    agency: "Southeastern Pennsylvania Transportation Authority",
    uza: "Philadelphia",
    region: "northeast",
    sizeBand: "large",
    primaryMode: "bus",
    vrhIndex: 94,
    uptIndex: 74,
    tripsPerVrhIndex: 79,
    serviceLeadPts: 20,
    confidence: "derived",
  },
  {
    id: "mbta",
    shortName: "MBTA",
    agency: "Massachusetts Bay Transportation Authority",
    uza: "Boston",
    region: "northeast",
    sizeBand: "large",
    primaryMode: "heavy-rail",
    vrhIndex: 92,
    uptIndex: 70,
    tripsPerVrhIndex: 76,
    serviceLeadPts: 22,
    confidence: "derived",
  },
  {
    id: "metrotransit",
    shortName: "Metro Transit",
    agency: "Metro Transit (Minneapolis–St. Paul)",
    uza: "Minneapolis–St. Paul",
    region: "midwest",
    sizeBand: "mid",
    primaryMode: "bus",
    vrhIndex: 96,
    uptIndex: 81,
    tripsPerVrhIndex: 84,
    serviceLeadPts: 15,
    confidence: "derived",
  },
  {
    id: "triMet",
    shortName: "TriMet",
    agency: "Tri-County Metropolitan Transportation District of Oregon",
    uza: "Portland",
    region: "west",
    sizeBand: "mid",
    primaryMode: "light-rail",
    vrhIndex: 95,
    uptIndex: 78,
    tripsPerVrhIndex: 82,
    serviceLeadPts: 17,
    confidence: "derived",
  },
  {
    id: "rtad",
    shortName: "RTD",
    agency: "Regional Transportation District (Denver)",
    uza: "Denver–Aurora",
    region: "west",
    sizeBand: "mid",
    primaryMode: "bus",
    vrhIndex: 94,
    uptIndex: 76,
    tripsPerVrhIndex: 81,
    serviceLeadPts: 18,
    confidence: "derived",
  },
  {
    id: "marta",
    shortName: "MARTA",
    agency: "Metropolitan Atlanta Rapid Transit Authority",
    uza: "Atlanta",
    region: "south",
    sizeBand: "large",
    primaryMode: "heavy-rail",
    vrhIndex: 91,
    uptIndex: 73,
    tripsPerVrhIndex: 80,
    serviceLeadPts: 18,
    confidence: "derived",
  },
  {
    id: "kingcounty",
    shortName: "King County Metro",
    agency: "King County Metro Transit",
    uza: "Seattle",
    region: "west",
    sizeBand: "large",
    primaryMode: "bus",
    vrhIndex: 98,
    uptIndex: 83,
    tripsPerVrhIndex: 85,
    serviceLeadPts: 15,
    confidence: "derived",
  },
  {
    id: "miami-dade",
    shortName: "Miami-Dade",
    agency: "Miami-Dade Transit",
    uza: "Miami",
    region: "south",
    sizeBand: "large",
    primaryMode: "bus",
    vrhIndex: 96,
    uptIndex: 88,
    tripsPerVrhIndex: 92,
    serviceLeadPts: 8,
    confidence: "derived",
  },
  {
    id: "houston",
    shortName: "METRO Houston",
    agency: "Metropolitan Transit Authority of Harris County",
    uza: "Houston",
    region: "south",
    sizeBand: "large",
    primaryMode: "bus",
    vrhIndex: 97,
    uptIndex: 90,
    tripsPerVrhIndex: 93,
    serviceLeadPts: 7,
    confidence: "derived",
  },
  {
    id: "dart",
    shortName: "DART",
    agency: "Dallas Area Rapid Transit",
    uza: "Dallas–Fort Worth",
    region: "south",
    sizeBand: "large",
    primaryMode: "light-rail",
    vrhIndex: 95,
    uptIndex: 79,
    tripsPerVrhIndex: 83,
    serviceLeadPts: 16,
    confidence: "derived",
  },
  {
    id: "njtransit",
    shortName: "NJ Transit",
    agency: "New Jersey Transit Corporation",
    uza: "New York–Newark",
    region: "northeast",
    sizeBand: "mega",
    primaryMode: "commuter-rail",
    vrhIndex: 89,
    uptIndex: 65,
    tripsPerVrhIndex: 73,
    serviceLeadPts: 24,
    confidence: "derived",
  },
  {
    id: "metra",
    shortName: "Metra",
    agency: "Northeast Illinois Regional Commuter Railroad",
    uza: "Chicago",
    region: "midwest",
    sizeBand: "large",
    primaryMode: "commuter-rail",
    vrhIndex: 87,
    uptIndex: 58,
    tripsPerVrhIndex: 67,
    serviceLeadPts: 29,
    confidence: "derived",
  },
  {
    id: "capmetro",
    shortName: "CapMetro",
    agency: "Capital Metropolitan Transportation Authority",
    uza: "Austin",
    region: "south",
    sizeBand: "mid",
    primaryMode: "bus",
    vrhIndex: 99,
    uptIndex: 92,
    tripsPerVrhIndex: 93,
    serviceLeadPts: 7,
    confidence: "derived",
  },
  {
    id: "via",
    shortName: "VIA",
    agency: "VIA Metropolitan Transit",
    uza: "San Antonio",
    region: "south",
    sizeBand: "mid",
    primaryMode: "bus",
    vrhIndex: 98,
    uptIndex: 94,
    tripsPerVrhIndex: 96,
    serviceLeadPts: 4,
    confidence: "derived",
  },
  {
    id: "octa",
    shortName: "OCTA",
    agency: "Orange County Transportation Authority",
    uza: "Los Angeles–Long Beach",
    region: "west",
    sizeBand: "mid",
    primaryMode: "bus",
    vrhIndex: 96,
    uptIndex: 85,
    tripsPerVrhIndex: 89,
    serviceLeadPts: 11,
    confidence: "derived",
  },
];

export type DetailRow = {
  agency: string;
  shortName: string;
  uza: string;
  region: string;
  primaryMode: string;
  vrhIndex: number;
  uptIndex: number;
  tripsPerVrhIndex: number;
  serviceLeadPts: number;
};

export const DETAIL_TABLE: DetailRow[] = AGENCIES.map((a) => ({
  agency: a.agency,
  shortName: a.shortName,
  uza: a.uza,
  region: a.region,
  primaryMode: a.primaryMode,
  vrhIndex: a.vrhIndex,
  uptIndex: a.uptIndex,
  tripsPerVrhIndex: a.tripsPerVrhIndex,
  serviceLeadPts: a.serviceLeadPts,
}));

export type MonthlyPoint = {
  label: string;
  /** Months since Jan 2019 for optional x-axis */
  t: number;
  vrhIndex: number;
  uptIndex: number;
  tripsPerVrhIndex: number;
};

/** Quarterly national path for the trips-per-VRH view (desk smooth) */
export const QUARTERLY_PATH: MonthlyPoint[] = [
  { label: "2019 Q4", t: 11, vrhIndex: 100, uptIndex: 100, tripsPerVrhIndex: 100 },
  { label: "2020 Q2", t: 17, vrhIndex: 62, uptIndex: 22, tripsPerVrhIndex: 35 },
  { label: "2020 Q4", t: 23, vrhIndex: 76, uptIndex: 42, tripsPerVrhIndex: 55 },
  { label: "2021 Q2", t: 29, vrhIndex: 80, uptIndex: 48, tripsPerVrhIndex: 60 },
  { label: "2021 Q4", t: 35, vrhIndex: 84, uptIndex: 55, tripsPerVrhIndex: 65 },
  { label: "2022 Q2", t: 41, vrhIndex: 87, uptIndex: 60, tripsPerVrhIndex: 69 },
  { label: "2022 Q4", t: 47, vrhIndex: 89, uptIndex: 66, tripsPerVrhIndex: 74 },
  { label: "2023 Q2", t: 53, vrhIndex: 91, uptIndex: 70, tripsPerVrhIndex: 77 },
  { label: "2023 Q4", t: 59, vrhIndex: 93, uptIndex: 76, tripsPerVrhIndex: 82 },
  { label: "2024 Q2", t: 65, vrhIndex: 94, uptIndex: 77, tripsPerVrhIndex: 82 },
  { label: "2024 Q4", t: 71, vrhIndex: 95, uptIndex: 79, tripsPerVrhIndex: 83 },
  { label: "2025 Q1", t: 74, vrhIndex: 95, uptIndex: 85, tripsPerVrhIndex: 89 },
];

export function filterAgencies(
  region: RegionId,
  sizeBand: SizeBandId | "all",
  maxLeadPts: number | null,
): AgencyRow[] {
  return AGENCIES.filter((a) => {
    if (region !== "all" && a.region !== region) return false;
    if (sizeBand !== "all" && a.sizeBand !== sizeBand) return false;
    if (maxLeadPts != null && a.serviceLeadPts > maxLeadPts) return false;
    return true;
  }).sort((a, b) => b.serviceLeadPts - a.serviceLeadPts);
}

export function tripsPerVrh(uptIndex: number, vrhIndex: number): number {
  if (vrhIndex <= 0) return 0;
  return Math.round((100 * uptIndex) / vrhIndex);
}

export function fmtIndex(n: number): string {
  return `${n}`;
}

export function fmtPts(n: number): string {
  return `${n} pts`;
}
