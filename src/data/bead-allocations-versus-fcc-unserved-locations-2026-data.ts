/**
 * BEAD allocations versus FCC unserved locations (2026).
 *
 * Core question: Which states received the most BEAD dollars per remaining
 * unserved location on the FCC fabric at the allocation vintage?
 *
 * Method: NTIA BEAD state allocations announced 2026-06-26 (disclosed).
 * Unserved Broadband Serviceable Locations from FCC National Broadband Map
 * Version 2 (May 2023 release) — the map vintage NTIA used for allocation.
 * Alabama (191,164) and Texas (777,115) unserved counts are disclosed in
 * state BEAD filings / industry analysis; other state unserved counts are
 * estimated by apportioning the ~8.35M national unserved total using each
 * jurisdiction's share of variable BEAD dollars (allocation minus statutory
 * baseline), calibrated to those anchors.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Primary: NTIA BEAD Program state allocation table (announced June 26, 2023; $42.45B program). Unserved locations: FCC National Broadband Map Version 2 (May 2023 release) — allocation vintage per NTIA and GAO BEAD implementation reviews. Anchor unserved counts: Alabama BEAD Five-Year Action Plan (191,164 unserved, May 2023 map data); Texas Telephone Association / Benton Institute analysis of June 2023 map (777,115 unserved). Remaining state unserved counts estimated from variable-allocation shares against ~8.35M national unserved (FCC/NTIA public totals). High-cost area block groups from NTIA allocation methodology file. BEAD subgrantee awards and post-challenge location lists will diverge from this snapshot.";

export const SOURCES = [
  {
    label: "NTIA — BEAD state allocations (June 2023)",
    url: "https://www.ntia.gov/press-release/2023/biden-harris-administration-announces-state-allocations-4245-billion-high-speed-internet-grant",
  },
  {
    label: "NTIA — How the FCC National Broadband Map impacts BEAD allocations",
    url: "https://www.internetforall.gov/blog/how-fcc-national-broadband-map-impacts-bead-program-part-1-3-allocation-funds",
  },
  {
    label: "FCC — National Broadband Map",
    url: "https://broadbandmap.fcc.gov/home",
  },
  {
    label: "GAO — BEAD program implementation",
    url: "https://www.gao.gov/products/gao-24-106832",
  },
  {
    label: "Alabama BEAD Five-Year Action Plan (unserved counts)",
    url: "https://broadband.alabama.gov/wp-content/uploads/Five-Year%20Action%20Plan/Alabama%20BEAD%205YAP%20Summary.pdf",
  },
] as const;

export const VIZ_MARKERS = [
  "BEAD dollars per unserved location by state",
  "DC floor effect above $600K per unserved",
] as const;

export const HEADLINE = {
  "peakDpuState": "DC",
  "peakDpuName": "District of Columbia",
  "peakDpu": 613993,
  "texasDpu": 4263,
  "texasBeadB": 3312.62,
  "nationalUnservedM": 8.35,
  "totalBeadB": 42.45,
  "medianDpu": 5271,
  "floorStates": 4,
  "confidence": "estimated" as Confidence
} as const;

export type Region = "Northeast" | "South" | "Midwest" | "West" | "Territories";

export type JurisdictionRow = {
  name: string;
  abbr: string;
  region: Region;
  /** Total BEAD allocation ($M) */
  beadAllocationM: number;
  /** Statutory minimum ($M) */
  baselineM: number;
  /** Allocation above baseline ($M) */
  variableM: number;
  /** FCC fabric unserved locations at allocation vintage */
  unservedLocations: number;
  /** BEAD allocation / unserved locations ($) */
  dollarsPerUnserved: number;
  /** Share of national unserved (%) */
  unservedSharePct: number;
  confidence: Confidence;
};

export const JURISDICTIONS: JurisdictionRow[] = [
  {
    "name": "Alabama",
    "abbr": "AL",
    "region": "South",
    "beadAllocationM": 1401.22,
    "baselineM": 100,
    "variableM": 1301.22,
    "unservedLocations": 191164,
    "dollarsPerUnserved": 7330,
    "unservedSharePct": 2.29,
    "confidence": "disclosed" as Confidence
  },
  {
    "name": "Alaska",
    "abbr": "AK",
    "region": "West",
    "beadAllocationM": 1017.14,
    "baselineM": 100,
    "variableM": 917.14,
    "unservedLocations": 203558,
    "dollarsPerUnserved": 4997,
    "unservedSharePct": 2.44,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Arizona",
    "abbr": "AZ",
    "region": "West",
    "beadAllocationM": 993.11,
    "baselineM": 100,
    "variableM": 893.11,
    "unservedLocations": 198225,
    "dollarsPerUnserved": 5010,
    "unservedSharePct": 2.37,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Arkansas",
    "abbr": "AR",
    "region": "South",
    "beadAllocationM": 1024.3,
    "baselineM": 100,
    "variableM": 924.3,
    "unservedLocations": 205148,
    "dollarsPerUnserved": 4993,
    "unservedSharePct": 2.46,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "California",
    "abbr": "CA",
    "region": "West",
    "beadAllocationM": 1864.14,
    "baselineM": 100,
    "variableM": 1764.14,
    "unservedLocations": 415383,
    "dollarsPerUnserved": 4488,
    "unservedSharePct": 4.97,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Colorado",
    "abbr": "CO",
    "region": "West",
    "beadAllocationM": 826.52,
    "baselineM": 100,
    "variableM": 726.52,
    "unservedLocations": 161251,
    "dollarsPerUnserved": 5126,
    "unservedSharePct": 1.93,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Connecticut",
    "abbr": "CT",
    "region": "Northeast",
    "beadAllocationM": 144.18,
    "baselineM": 100,
    "variableM": 44.18,
    "unservedLocations": 10402,
    "dollarsPerUnserved": 13861,
    "unservedSharePct": 0.12,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Delaware",
    "abbr": "DE",
    "region": "South",
    "beadAllocationM": 107.75,
    "baselineM": 100,
    "variableM": 7.75,
    "unservedLocations": 1824,
    "dollarsPerUnserved": 59073,
    "unservedSharePct": 0.02,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Florida",
    "abbr": "FL",
    "region": "South",
    "beadAllocationM": 1169.95,
    "baselineM": 100,
    "variableM": 1069.95,
    "unservedLocations": 237474,
    "dollarsPerUnserved": 4927,
    "unservedSharePct": 2.84,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Georgia",
    "abbr": "GA",
    "region": "South",
    "beadAllocationM": 1307.21,
    "baselineM": 100,
    "variableM": 1207.21,
    "unservedLocations": 267940,
    "dollarsPerUnserved": 4879,
    "unservedSharePct": 3.21,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Hawaii",
    "abbr": "HI",
    "region": "West",
    "beadAllocationM": 149.48,
    "baselineM": 100,
    "variableM": 49.48,
    "unservedLocations": 11651,
    "dollarsPerUnserved": 12830,
    "unservedSharePct": 0.14,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Idaho",
    "abbr": "ID",
    "region": "West",
    "beadAllocationM": 583.26,
    "baselineM": 100,
    "variableM": 483.26,
    "unservedLocations": 107258,
    "dollarsPerUnserved": 5438,
    "unservedSharePct": 1.28,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Illinois",
    "abbr": "IL",
    "region": "Midwest",
    "beadAllocationM": 1040.42,
    "baselineM": 100,
    "variableM": 940.42,
    "unservedLocations": 208725,
    "dollarsPerUnserved": 4985,
    "unservedSharePct": 2.5,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Indiana",
    "abbr": "IN",
    "region": "Midwest",
    "beadAllocationM": 868.11,
    "baselineM": 100,
    "variableM": 768.11,
    "unservedLocations": 170481,
    "dollarsPerUnserved": 5092,
    "unservedSharePct": 2.04,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Iowa",
    "abbr": "IA",
    "region": "Midwest",
    "beadAllocationM": 415.33,
    "baselineM": 100,
    "variableM": 315.33,
    "unservedLocations": 69987,
    "dollarsPerUnserved": 5934,
    "unservedSharePct": 0.84,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Kansas",
    "abbr": "KS",
    "region": "Midwest",
    "beadAllocationM": 451.73,
    "baselineM": 100,
    "variableM": 351.73,
    "unservedLocations": 78065,
    "dollarsPerUnserved": 5787,
    "unservedSharePct": 0.93,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Kentucky",
    "abbr": "KY",
    "region": "South",
    "beadAllocationM": 1086.17,
    "baselineM": 100,
    "variableM": 986.17,
    "unservedLocations": 218880,
    "dollarsPerUnserved": 4962,
    "unservedSharePct": 2.62,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Louisiana",
    "abbr": "LA",
    "region": "South",
    "beadAllocationM": 1355.55,
    "baselineM": 100,
    "variableM": 1255.55,
    "unservedLocations": 278669,
    "dollarsPerUnserved": 4864,
    "unservedSharePct": 3.34,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Maine",
    "abbr": "ME",
    "region": "Northeast",
    "beadAllocationM": 271.98,
    "baselineM": 100,
    "variableM": 171.98,
    "unservedLocations": 38170,
    "dollarsPerUnserved": 7125,
    "unservedSharePct": 0.46,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Maryland",
    "abbr": "MD",
    "region": "South",
    "beadAllocationM": 267.74,
    "baselineM": 100,
    "variableM": 167.74,
    "unservedLocations": 37229,
    "dollarsPerUnserved": 7192,
    "unservedSharePct": 0.45,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Massachusetts",
    "abbr": "MA",
    "region": "Northeast",
    "beadAllocationM": 147.42,
    "baselineM": 100,
    "variableM": 47.42,
    "unservedLocations": 11166,
    "dollarsPerUnserved": 13203,
    "unservedSharePct": 0.13,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Michigan",
    "abbr": "MI",
    "region": "Midwest",
    "beadAllocationM": 1559.36,
    "baselineM": 100,
    "variableM": 1459.36,
    "unservedLocations": 343621,
    "dollarsPerUnserved": 4538,
    "unservedSharePct": 4.12,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Minnesota",
    "abbr": "MN",
    "region": "Midwest",
    "beadAllocationM": 651.84,
    "baselineM": 100,
    "variableM": 551.84,
    "unservedLocations": 122480,
    "dollarsPerUnserved": 5322,
    "unservedSharePct": 1.47,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Mississippi",
    "abbr": "MS",
    "region": "South",
    "beadAllocationM": 1203.56,
    "baselineM": 100,
    "variableM": 1103.56,
    "unservedLocations": 244934,
    "dollarsPerUnserved": 4914,
    "unservedSharePct": 2.93,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Missouri",
    "abbr": "MO",
    "region": "Midwest",
    "beadAllocationM": 1736.3,
    "baselineM": 100,
    "variableM": 1636.3,
    "unservedLocations": 385284,
    "dollarsPerUnserved": 4507,
    "unservedSharePct": 4.61,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Montana",
    "abbr": "MT",
    "region": "West",
    "beadAllocationM": 628.97,
    "baselineM": 100,
    "variableM": 528.97,
    "unservedLocations": 124552,
    "dollarsPerUnserved": 5050,
    "unservedSharePct": 1.49,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Nebraska",
    "abbr": "NE",
    "region": "Midwest",
    "beadAllocationM": 405.28,
    "baselineM": 100,
    "variableM": 305.28,
    "unservedLocations": 67757,
    "dollarsPerUnserved": 5981,
    "unservedSharePct": 0.81,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Nevada",
    "abbr": "NV",
    "region": "West",
    "beadAllocationM": 416.67,
    "baselineM": 100,
    "variableM": 316.67,
    "unservedLocations": 70284,
    "dollarsPerUnserved": 5928,
    "unservedSharePct": 0.84,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "New Hampshire",
    "abbr": "NH",
    "region": "Northeast",
    "beadAllocationM": 196.56,
    "baselineM": 100,
    "variableM": 96.56,
    "unservedLocations": 22736,
    "dollarsPerUnserved": 8645,
    "unservedSharePct": 0.27,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "New Jersey",
    "abbr": "NJ",
    "region": "Northeast",
    "beadAllocationM": 263.69,
    "baselineM": 100,
    "variableM": 163.69,
    "unservedLocations": 36331,
    "dollarsPerUnserved": 7258,
    "unservedSharePct": 0.44,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "New Mexico",
    "abbr": "NM",
    "region": "West",
    "beadAllocationM": 675.37,
    "baselineM": 100,
    "variableM": 575.37,
    "unservedLocations": 127703,
    "dollarsPerUnserved": 5289,
    "unservedSharePct": 1.53,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "New York",
    "abbr": "NY",
    "region": "Northeast",
    "beadAllocationM": 664.62,
    "baselineM": 100,
    "variableM": 564.62,
    "unservedLocations": 125316,
    "dollarsPerUnserved": 5304,
    "unservedSharePct": 1.5,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "North Carolina",
    "abbr": "NC",
    "region": "South",
    "beadAllocationM": 1533,
    "baselineM": 100,
    "variableM": 1433,
    "unservedLocations": 337414,
    "dollarsPerUnserved": 4543,
    "unservedSharePct": 4.04,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "North Dakota",
    "abbr": "ND",
    "region": "Midwest",
    "beadAllocationM": 130.16,
    "baselineM": 100,
    "variableM": 30.16,
    "unservedLocations": 7103,
    "dollarsPerUnserved": 18325,
    "unservedSharePct": 0.09,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Ohio",
    "abbr": "OH",
    "region": "Midwest",
    "beadAllocationM": 793.69,
    "baselineM": 100,
    "variableM": 693.69,
    "unservedLocations": 153963,
    "dollarsPerUnserved": 5155,
    "unservedSharePct": 1.84,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Oklahoma",
    "abbr": "OK",
    "region": "South",
    "beadAllocationM": 797.44,
    "baselineM": 100,
    "variableM": 697.44,
    "unservedLocations": 154795,
    "dollarsPerUnserved": 5152,
    "unservedSharePct": 1.85,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Oregon",
    "abbr": "OR",
    "region": "West",
    "beadAllocationM": 688.91,
    "baselineM": 100,
    "variableM": 588.91,
    "unservedLocations": 130709,
    "dollarsPerUnserved": 5271,
    "unservedSharePct": 1.57,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Pennsylvania",
    "abbr": "PA",
    "region": "Northeast",
    "beadAllocationM": 1161.78,
    "baselineM": 100,
    "variableM": 1061.78,
    "unservedLocations": 235661,
    "dollarsPerUnserved": 4930,
    "unservedSharePct": 2.82,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Rhode Island",
    "abbr": "RI",
    "region": "Northeast",
    "beadAllocationM": 108.72,
    "baselineM": 100,
    "variableM": 8.72,
    "unservedLocations": 2053,
    "dollarsPerUnserved": 52956,
    "unservedSharePct": 0.02,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "South Carolina",
    "abbr": "SC",
    "region": "South",
    "beadAllocationM": 551.54,
    "baselineM": 100,
    "variableM": 451.54,
    "unservedLocations": 100218,
    "dollarsPerUnserved": 5503,
    "unservedSharePct": 1.2,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "South Dakota",
    "abbr": "SD",
    "region": "Midwest",
    "beadAllocationM": 207.23,
    "baselineM": 100,
    "variableM": 107.23,
    "unservedLocations": 25248,
    "dollarsPerUnserved": 8208,
    "unservedSharePct": 0.3,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Tennessee",
    "abbr": "TN",
    "region": "South",
    "beadAllocationM": 813.32,
    "baselineM": 100,
    "variableM": 713.32,
    "unservedLocations": 158321,
    "dollarsPerUnserved": 5137,
    "unservedSharePct": 1.9,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Texas",
    "abbr": "TX",
    "region": "South",
    "beadAllocationM": 3312.62,
    "baselineM": 100,
    "variableM": 3212.62,
    "unservedLocations": 777115,
    "dollarsPerUnserved": 4263,
    "unservedSharePct": 9.31,
    "confidence": "disclosed" as Confidence
  },
  {
    "name": "Utah",
    "abbr": "UT",
    "region": "West",
    "beadAllocationM": 317.4,
    "baselineM": 100,
    "variableM": 217.4,
    "unservedLocations": 48252,
    "dollarsPerUnserved": 6578,
    "unservedSharePct": 0.58,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Vermont",
    "abbr": "VT",
    "region": "Northeast",
    "beadAllocationM": 228.91,
    "baselineM": 100,
    "variableM": 128.91,
    "unservedLocations": 30354,
    "dollarsPerUnserved": 7541,
    "unservedSharePct": 0.36,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Virginia",
    "abbr": "VA",
    "region": "South",
    "beadAllocationM": 1481.49,
    "baselineM": 100,
    "variableM": 1381.49,
    "unservedLocations": 306620,
    "dollarsPerUnserved": 4832,
    "unservedSharePct": 3.67,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Washington",
    "abbr": "WA",
    "region": "West",
    "beadAllocationM": 1227.74,
    "baselineM": 100,
    "variableM": 1127.74,
    "unservedLocations": 250301,
    "dollarsPerUnserved": 4905,
    "unservedSharePct": 3,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "West Virginia",
    "abbr": "WV",
    "region": "South",
    "beadAllocationM": 1210.8,
    "baselineM": 100,
    "variableM": 1110.8,
    "unservedLocations": 246541,
    "dollarsPerUnserved": 4911,
    "unservedSharePct": 2.95,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Wisconsin",
    "abbr": "WI",
    "region": "Midwest",
    "beadAllocationM": 1055.82,
    "baselineM": 100,
    "variableM": 955.82,
    "unservedLocations": 212144,
    "dollarsPerUnserved": 4977,
    "unservedSharePct": 2.54,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Wyoming",
    "abbr": "WY",
    "region": "West",
    "beadAllocationM": 347.88,
    "baselineM": 100,
    "variableM": 247.88,
    "unservedLocations": 55016,
    "dollarsPerUnserved": 6323,
    "unservedSharePct": 0.66,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "District of Columbia",
    "abbr": "DC",
    "region": "South",
    "beadAllocationM": 100.69,
    "baselineM": 100,
    "variableM": 0.69,
    "unservedLocations": 164,
    "dollarsPerUnserved": 613993,
    "unservedSharePct": 0,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "American Samoa",
    "abbr": "AS",
    "region": "Territories",
    "beadAllocationM": 37.56,
    "baselineM": 25,
    "variableM": 12.56,
    "unservedLocations": 4200,
    "dollarsPerUnserved": 8944,
    "unservedSharePct": 0.05,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Guam",
    "abbr": "GU",
    "region": "Territories",
    "beadAllocationM": 156.83,
    "baselineM": 25,
    "variableM": 131.83,
    "unservedLocations": 8500,
    "dollarsPerUnserved": 18451,
    "unservedSharePct": 0.1,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Northern Mariana Islands",
    "abbr": "MP",
    "region": "Territories",
    "beadAllocationM": 80.8,
    "baselineM": 25,
    "variableM": 55.8,
    "unservedLocations": 6200,
    "dollarsPerUnserved": 13032,
    "unservedSharePct": 0.07,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "Puerto Rico",
    "abbr": "PR",
    "region": "Territories",
    "beadAllocationM": 334.61,
    "baselineM": 100,
    "variableM": 234.61,
    "unservedLocations": 89000,
    "dollarsPerUnserved": 3760,
    "unservedSharePct": 1.07,
    "confidence": "estimated" as Confidence
  },
  {
    "name": "U.S. Virgin Islands",
    "abbr": "VI",
    "region": "Territories",
    "beadAllocationM": 27.1,
    "baselineM": 25,
    "variableM": 2.1,
    "unservedLocations": 2100,
    "dollarsPerUnserved": 12906,
    "unservedSharePct": 0.03,
    "confidence": "estimated" as Confidence
  }
];

export const REGION_AVG = [
  {
    "region": "Northeast",
    "states": 9,
    "beadB": 3187.9,
    "unserved": 512189,
    "avgDpu": 13425
  },
  {
    "region": "South",
    "states": 17,
    "beadB": 18724.3,
    "unserved": 3764450,
    "avgDpu": 44204
  },
  {
    "region": "Midwest",
    "states": 12,
    "beadB": 9315.3,
    "unserved": 1844858,
    "avgDpu": 6568
  },
  {
    "region": "West",
    "states": 13,
    "beadB": 9736.6,
    "unserved": 1904143,
    "avgDpu": 5941
  }
] as const;

export const FORMULA = {
  "totalBudgetB": 42.45,
  "baselineStatesM": 100,
  "baselineTerritoriesM": 25,
  "highCostPoolB": 4.245,
  "remainingPoolB": 32.905,
  "nationalUnservedUsed": 8350000
} as const;

export type RegionFilter = Region | "All";

export function filterJurisdictions(
  region: RegionFilter,
  includeTerritories: boolean,
  minUnserved: number,
): JurisdictionRow[] {
  return JURISDICTIONS.filter((j) => {
    if (!includeTerritories && j.region === "Territories") return false;
    if (region !== "All" && j.region !== region) return false;
    if (j.unservedLocations < minUnserved) return false;
    return true;
  });
}

export function sortByMetric(
  rows: JurisdictionRow[],
  metric: "dollarsPerUnserved" | "beadAllocationM" | "unservedLocations",
  desc = true,
): JurisdictionRow[] {
  return [...rows].sort((a, b) => (desc ? b[metric] - a[metric] : a[metric] - b[metric]));
}
