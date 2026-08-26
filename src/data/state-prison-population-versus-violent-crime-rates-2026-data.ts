/**
 * State prison population versus violent crime rates (2026).
 *
 * Core question: How did year-end state prison custody change versus FBI
 * violent-crime rates after 2010, and which states decoupled?
 *
 * Method: Join BJS National Prisoner Statistics (NPS) imprisonment rates
 * (sentenced prisoners >1 year per 100,000 residents) for year-end 2010 and
 * 2022 to FBI UCR/NIBRS state violent-crime rates (murder, rape, robbery,
 * aggravated assault) for calendar 2010 and 2022. Classify each state into a
 * path bucket using a ±5% band for "flat". Also publish the national dual
 * series 2010–2022 and a custody-to-violence ratio (imprisonment rate ÷
 * violent rate) as a desk intensity index — not a causal elasticity.
 *
 * Confidence: BJS NPS rates are disclosed. FBI 2010 UCR rates are disclosed.
 * 2021–2022 NIBRS transition reduced agency coverage in some states
 * (notably FL, IL, MD, PA); those 2022 violent rates are marked estimated.
 * Population denominators are Census resident estimates used by BJS/FBI.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";
export type Region = "northeast" | "midwest" | "south" | "west";
export type PathBucket =
  | "both_down"
  | "prison_down_crime_up"
  | "prison_up_crime_down"
  | "both_up"
  | "prison_down_crime_flat"
  | "crime_down_prison_flat"
  | "prison_up_crime_flat"
  | "crime_up_prison_flat"
  | "both_flat";

export const SOURCE_NOTE =
  "Imprisonment rates: BJS Prisoners in 2010 (Appendix Table 9) and Prisoners in 2022 – Statistical Tables (Table 7), sentenced prisoners under jurisdiction per 100,000 residents. Violent crime rates: FBI UCR Crime in the United States 2010 (state totals) and FBI Crime Data Explorer / CIUS estimates for 2018–2022 as compiled for state tables. National imprisonment path uses BJS NPS annual rates; national violent path uses FBI estimated crime rates. FL/IL/MD/PA 2022 violent rates flagged estimated under NIBRS coverage gaps.";

export const SOURCES = [
  {
    label: "BJS — Prisoners in 2010 (NPS)",
    url: "https://bjs.ojp.gov/content/pub/pdf/p10.pdf",
  },
  {
    label: "BJS — Prisoners in 2022 Statistical Tables",
    url: "https://bjs.ojp.gov/library/publications/prisoners-2022-statistical-tables",
  },
  {
    label: "FBI — Crime in the United States 2010, Table 5",
    url: "https://ucr.fbi.gov/crime-in-the-u.s/2010/crime-in-the-u.s.-2010/tables/10tbl05.xls",
  },
  {
    label: "FBI Crime Data Explorer — estimated crime",
    url: "https://cde.ucr.cjis.gov/",
  },
  {
    label: "U.S. Census Bureau — resident population estimates",
    url: "https://www.census.gov/programs-surveys/popest.html",
  },
] as const;

export const HEADLINE = {
  nationalPrison2010: 500,
  nationalPrison2022: 355,
  nationalPrisonDeltaPct: -29.0,
  nationalViolent2010: 404.5,
  nationalViolent2022: 380.7,
  nationalViolentDeltaPct: -5.9,
  medianStatePrisonDeltaPct: -27.6,
  medianStateViolentDeltaPct: 1.8,
  statesPrisonDownCrimeUp: 19,
  statesBothDown: 19,
  statesBothUp: 1,
  flatBandPct: 5,
  panelStates: 50,
  endYear: 2022,
  startYear: 2010,
} as const;

export const ANALYTICS = {
  smokeMarker: "Prisoners per 100k vs violent rate",
  headlineLabel: "States with prison↓ / violent↑",
  headlineValue: String(HEADLINE.statesPrisonDownCrimeUp),
} as const;

export const PATH_LABELS: Record<PathBucket, string> = {
  "both_down": "Both down",
  "prison_down_crime_up": "Prison down / crime up",
  "prison_up_crime_down": "Prison up / crime down",
  "both_up": "Both up",
  "prison_down_crime_flat": "Prison down / crime flat",
  "crime_down_prison_flat": "Crime down / prison flat",
  "prison_up_crime_flat": "Prison up / crime flat",
  "crime_up_prison_flat": "Crime up / prison flat",
  "both_flat": "Both flat"
} as Record<
  PathBucket,
  string
>;

export type StateRow = {
  state: string;
  abbr: string;
  region: Region;
  prison2010: number;
  prison2022: number;
  prisonDeltaPct: number;
  violent2010: number;
  violent2022: number;
  violentDeltaPct: number;
  /** Imprisonment rate ÷ violent rate (desk intensity index) */
  ratio2010: number;
  ratio2022: number;
  path: PathBucket;
  confidence: Confidence;
};

export const STATE_PANEL: StateRow[] = [
  {
    "state": "Alabama",
    "abbr": "AL",
    "region": "south",
    "prison2010": 648,
    "prison2022": 390,
    "prisonDeltaPct": -39.8,
    "violent2010": 383.7,
    "violent2022": 409.1,
    "violentDeltaPct": 6.6,
    "ratio2010": 1.69,
    "ratio2022": 0.95,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Alaska",
    "abbr": "AK",
    "region": "west",
    "prison2010": 340,
    "prison2022": 205,
    "prisonDeltaPct": -39.7,
    "violent2010": 635.3,
    "violent2022": 758.9,
    "violentDeltaPct": 19.5,
    "ratio2010": 0.54,
    "ratio2022": 0.27,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Arizona",
    "abbr": "AZ",
    "region": "west",
    "prison2010": 572,
    "prison2022": 446,
    "prisonDeltaPct": -22,
    "violent2010": 413.6,
    "violent2022": 431.5,
    "violentDeltaPct": 4.3,
    "ratio2010": 1.38,
    "ratio2022": 1.03,
    "path": "prison_down_crime_flat",
    "confidence": "disclosed"
  },
  {
    "state": "Arkansas",
    "abbr": "AR",
    "region": "south",
    "prison2010": 552,
    "prison2022": 574,
    "prisonDeltaPct": 4,
    "violent2010": 503.5,
    "violent2022": 645.3,
    "violentDeltaPct": 28.2,
    "ratio2010": 1.1,
    "ratio2022": 0.89,
    "path": "crime_up_prison_flat",
    "confidence": "disclosed"
  },
  {
    "state": "California",
    "abbr": "CA",
    "region": "west",
    "prison2010": 439,
    "prison2022": 250,
    "prisonDeltaPct": -43.1,
    "violent2010": 439.6,
    "violent2022": 499.5,
    "violentDeltaPct": 13.6,
    "ratio2010": 1,
    "ratio2022": 0.5,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Colorado",
    "abbr": "CO",
    "region": "west",
    "prison2010": 445,
    "prison2022": 288,
    "prisonDeltaPct": -35.3,
    "violent2010": 323.7,
    "violent2022": 492.5,
    "violentDeltaPct": 52.1,
    "ratio2010": 1.37,
    "ratio2022": 0.58,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Connecticut",
    "abbr": "CT",
    "region": "northeast",
    "prison2010": 376,
    "prison2022": 170,
    "prisonDeltaPct": -54.8,
    "violent2010": 282,
    "violent2022": 150,
    "violentDeltaPct": -46.8,
    "ratio2010": 1.33,
    "ratio2022": 1.13,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Delaware",
    "abbr": "DE",
    "region": "south",
    "prison2010": 443,
    "prison2022": 272,
    "prisonDeltaPct": -38.6,
    "violent2010": 623.3,
    "violent2022": 383.5,
    "violentDeltaPct": -38.5,
    "ratio2010": 0.71,
    "ratio2022": 0.71,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Florida",
    "abbr": "FL",
    "region": "south",
    "prison2010": 556,
    "prison2022": 377,
    "prisonDeltaPct": -32.2,
    "violent2010": 541.3,
    "violent2022": 258.9,
    "violentDeltaPct": -52.2,
    "ratio2010": 1.03,
    "ratio2022": 1.46,
    "path": "both_down",
    "confidence": "estimated"
  },
  {
    "state": "Georgia",
    "abbr": "GA",
    "region": "south",
    "prison2010": 550,
    "prison2022": 435,
    "prisonDeltaPct": -20.9,
    "violent2010": 402.3,
    "violent2022": 367,
    "violentDeltaPct": -8.8,
    "ratio2010": 1.37,
    "ratio2022": 1.19,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Hawaii",
    "abbr": "HI",
    "region": "west",
    "prison2010": 302,
    "prison2022": 174,
    "prisonDeltaPct": -42.4,
    "violent2010": 262.3,
    "violent2022": 259.6,
    "violentDeltaPct": -1,
    "ratio2010": 1.15,
    "ratio2022": 0.67,
    "path": "prison_down_crime_flat",
    "confidence": "disclosed"
  },
  {
    "state": "Idaho",
    "abbr": "ID",
    "region": "west",
    "prison2010": 474,
    "prison2022": 460,
    "prisonDeltaPct": -3,
    "violent2010": 220.5,
    "violent2022": 241.4,
    "violentDeltaPct": 9.5,
    "ratio2010": 2.15,
    "ratio2022": 1.91,
    "path": "crime_up_prison_flat",
    "confidence": "disclosed"
  },
  {
    "state": "Illinois",
    "abbr": "IL",
    "region": "midwest",
    "prison2010": 373,
    "prison2022": 236,
    "prisonDeltaPct": -36.7,
    "violent2010": 444.9,
    "violent2022": 287.3,
    "violentDeltaPct": -35.4,
    "ratio2010": 0.84,
    "ratio2022": 0.82,
    "path": "both_down",
    "confidence": "estimated"
  },
  {
    "state": "Indiana",
    "abbr": "IN",
    "region": "midwest",
    "prison2010": 434,
    "prison2022": 349,
    "prisonDeltaPct": -19.6,
    "violent2010": 323.3,
    "violent2022": 306.2,
    "violentDeltaPct": -5.3,
    "ratio2010": 1.34,
    "ratio2022": 1.14,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Iowa",
    "abbr": "IA",
    "region": "midwest",
    "prison2010": 309,
    "prison2022": 264,
    "prisonDeltaPct": -14.6,
    "violent2010": 268.5,
    "violent2022": 286.5,
    "violentDeltaPct": 6.7,
    "ratio2010": 1.15,
    "ratio2022": 0.92,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Kansas",
    "abbr": "KS",
    "region": "midwest",
    "prison2010": 317,
    "prison2022": 292,
    "prisonDeltaPct": -7.9,
    "violent2010": 370.8,
    "violent2022": 414.6,
    "violentDeltaPct": 11.8,
    "ratio2010": 0.85,
    "ratio2022": 0.7,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Kentucky",
    "abbr": "KY",
    "region": "south",
    "prison2010": 458,
    "prison2022": 437,
    "prisonDeltaPct": -4.6,
    "violent2010": 243.9,
    "violent2022": 214.1,
    "violentDeltaPct": -12.2,
    "ratio2010": 1.88,
    "ratio2022": 2.04,
    "path": "crime_down_prison_flat",
    "confidence": "disclosed"
  },
  {
    "state": "Louisiana",
    "abbr": "LA",
    "region": "south",
    "prison2010": 867,
    "prison2022": 596,
    "prisonDeltaPct": -31.3,
    "violent2010": 555.3,
    "violent2022": 628.6,
    "violentDeltaPct": 13.2,
    "ratio2010": 1.56,
    "ratio2022": 0.95,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Maine",
    "abbr": "ME",
    "region": "northeast",
    "prison2010": 148,
    "prison2022": 107,
    "prisonDeltaPct": -27.7,
    "violent2010": 122.1,
    "violent2022": 103.3,
    "violentDeltaPct": -15.4,
    "ratio2010": 1.21,
    "ratio2022": 1.04,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Maryland",
    "abbr": "MD",
    "region": "south",
    "prison2010": 387,
    "prison2022": 252,
    "prisonDeltaPct": -34.9,
    "violent2010": 546.3,
    "violent2022": 398.5,
    "violentDeltaPct": -27.1,
    "ratio2010": 0.71,
    "ratio2022": 0.63,
    "path": "both_down",
    "confidence": "estimated"
  },
  {
    "state": "Massachusetts",
    "abbr": "MA",
    "region": "northeast",
    "prison2010": 200,
    "prison2022": 94,
    "prisonDeltaPct": -53,
    "violent2010": 468.9,
    "violent2022": 322,
    "violentDeltaPct": -31.3,
    "ratio2010": 0.43,
    "ratio2022": 0.29,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Michigan",
    "abbr": "MI",
    "region": "midwest",
    "prison2010": 445,
    "prison2022": 323,
    "prisonDeltaPct": -27.4,
    "violent2010": 493,
    "violent2022": 461,
    "violentDeltaPct": -6.5,
    "ratio2010": 0.9,
    "ratio2022": 0.7,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Minnesota",
    "abbr": "MN",
    "region": "midwest",
    "prison2010": 185,
    "prison2022": 151,
    "prisonDeltaPct": -18.4,
    "violent2010": 235.7,
    "violent2022": 280.6,
    "violentDeltaPct": 19,
    "ratio2010": 0.78,
    "ratio2022": 0.54,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Mississippi",
    "abbr": "MS",
    "region": "south",
    "prison2010": 686,
    "prison2022": 661,
    "prisonDeltaPct": -3.6,
    "violent2010": 269.3,
    "violent2022": 245,
    "violentDeltaPct": -9,
    "ratio2010": 2.55,
    "ratio2022": 2.7,
    "path": "crime_down_prison_flat",
    "confidence": "disclosed"
  },
  {
    "state": "Missouri",
    "abbr": "MO",
    "region": "midwest",
    "prison2010": 508,
    "prison2022": 381,
    "prisonDeltaPct": -25,
    "violent2010": 457.7,
    "violent2022": 488,
    "violentDeltaPct": 6.6,
    "ratio2010": 1.11,
    "ratio2022": 0.78,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Montana",
    "abbr": "MT",
    "region": "west",
    "prison2010": 378,
    "prison2022": 414,
    "prisonDeltaPct": 9.5,
    "violent2010": 275.8,
    "violent2022": 417.9,
    "violentDeltaPct": 51.5,
    "ratio2010": 1.37,
    "ratio2022": 0.99,
    "path": "both_up",
    "confidence": "disclosed"
  },
  {
    "state": "Nebraska",
    "abbr": "NE",
    "region": "midwest",
    "prison2010": 247,
    "prison2022": 284,
    "prisonDeltaPct": 15,
    "violent2010": 278.3,
    "violent2022": 282.8,
    "violentDeltaPct": 1.6,
    "ratio2010": 0.89,
    "ratio2022": 1,
    "path": "prison_up_crime_flat",
    "confidence": "disclosed"
  },
  {
    "state": "Nevada",
    "abbr": "NV",
    "region": "west",
    "prison2010": 472,
    "prison2022": 322,
    "prisonDeltaPct": -31.8,
    "violent2010": 663,
    "violent2022": 454,
    "violentDeltaPct": -31.5,
    "ratio2010": 0.71,
    "ratio2022": 0.71,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "New Hampshire",
    "abbr": "NH",
    "region": "northeast",
    "prison2010": 209,
    "prison2022": 149,
    "prisonDeltaPct": -28.7,
    "violent2010": 167.4,
    "violent2022": 125.6,
    "violentDeltaPct": -25,
    "ratio2010": 1.25,
    "ratio2022": 1.19,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "New Jersey",
    "abbr": "NJ",
    "region": "northeast",
    "prison2010": 286,
    "prison2022": 137,
    "prisonDeltaPct": -52.1,
    "violent2010": 307.5,
    "violent2022": 202.9,
    "violentDeltaPct": -34,
    "ratio2010": 0.93,
    "ratio2022": 0.68,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "New Mexico",
    "abbr": "NM",
    "region": "west",
    "prison2010": 323,
    "prison2022": 231,
    "prisonDeltaPct": -28.5,
    "violent2010": 588,
    "violent2022": 780.5,
    "violentDeltaPct": 32.7,
    "ratio2010": 0.55,
    "ratio2022": 0.3,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "New York",
    "abbr": "NY",
    "region": "northeast",
    "prison2010": 288,
    "prison2022": 159,
    "prisonDeltaPct": -44.8,
    "violent2010": 394.4,
    "violent2022": 429.3,
    "violentDeltaPct": 8.8,
    "ratio2010": 0.73,
    "ratio2022": 0.37,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "North Carolina",
    "abbr": "NC",
    "region": "south",
    "prison2010": 373,
    "prison2022": 268,
    "prisonDeltaPct": -28.2,
    "violent2010": 362.7,
    "violent2022": 405.1,
    "violentDeltaPct": 11.7,
    "ratio2010": 1.03,
    "ratio2022": 0.66,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "North Dakota",
    "abbr": "ND",
    "region": "midwest",
    "prison2010": 226,
    "prison2022": 230,
    "prisonDeltaPct": 1.8,
    "violent2010": 229.5,
    "violent2022": 279.6,
    "violentDeltaPct": 21.8,
    "ratio2010": 0.98,
    "ratio2022": 0.82,
    "path": "crime_up_prison_flat",
    "confidence": "disclosed"
  },
  {
    "state": "Ohio",
    "abbr": "OH",
    "region": "midwest",
    "prison2010": 448,
    "prison2022": 385,
    "prisonDeltaPct": -14.1,
    "violent2010": 314.7,
    "violent2022": 293.6,
    "violentDeltaPct": -6.7,
    "ratio2010": 1.42,
    "ratio2022": 1.31,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Oklahoma",
    "abbr": "OK",
    "region": "south",
    "prison2010": 654,
    "prison2022": 563,
    "prisonDeltaPct": -13.9,
    "violent2010": 481.4,
    "violent2022": 419.7,
    "violentDeltaPct": -12.8,
    "ratio2010": 1.36,
    "ratio2022": 1.34,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Oregon",
    "abbr": "OR",
    "region": "west",
    "prison2010": 361,
    "prison2022": 295,
    "prisonDeltaPct": -18.3,
    "violent2010": 251.4,
    "violent2022": 342.4,
    "violentDeltaPct": 36.2,
    "ratio2010": 1.44,
    "ratio2022": 0.86,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Pennsylvania",
    "abbr": "PA",
    "region": "northeast",
    "prison2010": 403,
    "prison2022": 292,
    "prisonDeltaPct": -27.5,
    "violent2010": 366.5,
    "violent2022": 279.9,
    "violentDeltaPct": -23.6,
    "ratio2010": 1.1,
    "ratio2022": 1.04,
    "path": "both_down",
    "confidence": "estimated"
  },
  {
    "state": "Rhode Island",
    "abbr": "RI",
    "region": "northeast",
    "prison2010": 197,
    "prison2022": 124,
    "prisonDeltaPct": -37.1,
    "violent2010": 257.4,
    "violent2022": 172.3,
    "violentDeltaPct": -33.1,
    "ratio2010": 0.77,
    "ratio2022": 0.72,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "South Carolina",
    "abbr": "SC",
    "region": "south",
    "prison2010": 495,
    "prison2022": 302,
    "prisonDeltaPct": -39,
    "violent2010": 602.2,
    "violent2022": 491.3,
    "violentDeltaPct": -18.4,
    "ratio2010": 0.82,
    "ratio2022": 0.61,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "South Dakota",
    "abbr": "SD",
    "region": "midwest",
    "prison2010": 416,
    "prison2022": 370,
    "prisonDeltaPct": -11.1,
    "violent2010": 268.9,
    "violent2022": 377.4,
    "violentDeltaPct": 40.3,
    "ratio2010": 1.55,
    "ratio2022": 0.98,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Tennessee",
    "abbr": "TN",
    "region": "south",
    "prison2010": 432,
    "prison2022": 334,
    "prisonDeltaPct": -22.7,
    "violent2010": 612,
    "violent2022": 621.6,
    "violentDeltaPct": 1.6,
    "ratio2010": 0.71,
    "ratio2022": 0.54,
    "path": "prison_down_crime_flat",
    "confidence": "disclosed"
  },
  {
    "state": "Texas",
    "abbr": "TX",
    "region": "south",
    "prison2010": 648,
    "prison2022": 452,
    "prisonDeltaPct": -30.2,
    "violent2010": 448.4,
    "violent2022": 431.9,
    "violentDeltaPct": -3.7,
    "ratio2010": 1.45,
    "ratio2022": 1.05,
    "path": "prison_down_crime_flat",
    "confidence": "disclosed"
  },
  {
    "state": "Utah",
    "abbr": "UT",
    "region": "west",
    "prison2010": 238,
    "prison2022": 176,
    "prisonDeltaPct": -26.1,
    "violent2010": 213.5,
    "violent2022": 241.8,
    "violentDeltaPct": 13.3,
    "ratio2010": 1.11,
    "ratio2022": 0.73,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Vermont",
    "abbr": "VT",
    "region": "northeast",
    "prison2010": 265,
    "prison2022": 126,
    "prisonDeltaPct": -52.5,
    "violent2010": 131,
    "violent2022": 221.9,
    "violentDeltaPct": 69.4,
    "ratio2010": 2.02,
    "ratio2022": 0.57,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Virginia",
    "abbr": "VA",
    "region": "south",
    "prison2010": 468,
    "prison2022": 312,
    "prisonDeltaPct": -33.3,
    "violent2010": 214.2,
    "violent2022": 234,
    "violentDeltaPct": 9.2,
    "ratio2010": 2.18,
    "ratio2022": 1.33,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Washington",
    "abbr": "WA",
    "region": "west",
    "prison2010": 269,
    "prison2022": 174,
    "prisonDeltaPct": -35.3,
    "violent2010": 313.5,
    "violent2022": 375.6,
    "violentDeltaPct": 19.8,
    "ratio2010": 0.86,
    "ratio2022": 0.46,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "West Virginia",
    "abbr": "WV",
    "region": "south",
    "prison2010": 363,
    "prison2022": 331,
    "prisonDeltaPct": -8.8,
    "violent2010": 301.2,
    "violent2022": 277.9,
    "violentDeltaPct": -7.7,
    "ratio2010": 1.21,
    "ratio2022": 1.19,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Wisconsin",
    "abbr": "WI",
    "region": "midwest",
    "prison2010": 366,
    "prison2022": 311,
    "prisonDeltaPct": -15,
    "violent2010": 248.9,
    "violent2022": 297,
    "violentDeltaPct": 19.3,
    "ratio2010": 1.47,
    "ratio2022": 1.05,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Wyoming",
    "abbr": "WY",
    "region": "west",
    "prison2010": 385,
    "prison2022": 369,
    "prisonDeltaPct": -4.2,
    "violent2010": 197.9,
    "violent2022": 201.9,
    "violentDeltaPct": 2,
    "ratio2010": 1.95,
    "ratio2022": 1.83,
    "path": "both_flat",
    "confidence": "disclosed"
  }
];

export type NationalYear = {
  year: number;
  prisonRate: number;
  violentRate: number;
  note: string | null;
};

export const NATIONAL_SERIES: NationalYear[] = [
  {
    "year": 2010,
    "prisonRate": 500,
    "violentRate": 404.5,
    "note": "BJS NPS / FBI UCR"
  },
  {
    "year": 2011,
    "prisonRate": 492,
    "violentRate": 386.3,
    "note": null
  },
  {
    "year": 2012,
    "prisonRate": 480,
    "violentRate": 386.9,
    "note": null
  },
  {
    "year": 2013,
    "prisonRate": 478,
    "violentRate": 367.9,
    "note": null
  },
  {
    "year": 2014,
    "prisonRate": 471,
    "violentRate": 361.6,
    "note": null
  },
  {
    "year": 2015,
    "prisonRate": 458,
    "violentRate": 373.7,
    "note": null
  },
  {
    "year": 2016,
    "prisonRate": 450,
    "violentRate": 386.3,
    "note": null
  },
  {
    "year": 2017,
    "prisonRate": 440,
    "violentRate": 394,
    "note": null
  },
  {
    "year": 2018,
    "prisonRate": 431,
    "violentRate": 383.4,
    "note": null
  },
  {
    "year": 2019,
    "prisonRate": 419,
    "violentRate": 380.8,
    "note": null
  },
  {
    "year": 2020,
    "prisonRate": 358,
    "violentRate": 398.5,
    "note": "COVID custody drop"
  },
  {
    "year": 2021,
    "prisonRate": 350,
    "violentRate": 387,
    "note": null
  },
  {
    "year": 2022,
    "prisonRate": 355,
    "violentRate": 380.7,
    "note": "BJS Prisoners in 2022"
  }
];

export type PathCount = { path: PathBucket; label: string; count: number };
export const PATH_COUNTS: PathCount[] = [
  {
    "path": "prison_down_crime_up",
    "label": "Prison down / crime up",
    "count": 19
  },
  {
    "path": "prison_down_crime_flat",
    "label": "Prison down / crime flat",
    "count": 4
  },
  {
    "path": "crime_up_prison_flat",
    "label": "Crime up / prison flat",
    "count": 3
  },
  {
    "path": "both_down",
    "label": "Both down",
    "count": 19
  },
  {
    "path": "crime_down_prison_flat",
    "label": "Crime down / prison flat",
    "count": 2
  },
  {
    "path": "both_up",
    "label": "Both up",
    "count": 1
  },
  {
    "path": "prison_up_crime_flat",
    "label": "Prison up / crime flat",
    "count": 1
  },
  {
    "path": "both_flat",
    "label": "Both flat",
    "count": 1
  }
];

export type RegionAgg = {
  region: Region;
  states: number;
  meanPrisonDeltaPct: number;
  meanViolentDeltaPct: number;
  prisonDownCrimeUp: number;
};

export const REGION_AGGS: RegionAgg[] = [
  {
    "region": "south",
    "states": 16,
    "meanPrisonDeltaPct": -23.6,
    "meanViolentDeltaPct": -7.5,
    "prisonDownCrimeUp": 4
  },
  {
    "region": "west",
    "states": 13,
    "meanPrisonDeltaPct": -24.6,
    "meanViolentDeltaPct": 17.1,
    "prisonDownCrimeUp": 7
  },
  {
    "region": "northeast",
    "states": 9,
    "meanPrisonDeltaPct": -42,
    "meanViolentDeltaPct": -14.6,
    "prisonDownCrimeUp": 2
  },
  {
    "region": "midwest",
    "states": 12,
    "meanPrisonDeltaPct": -14.4,
    "meanViolentDeltaPct": 6.1,
    "prisonDownCrimeUp": 6
  }
];

export const TOP_DECOUPLE = [
  {
    "state": "Vermont",
    "abbr": "VT",
    "region": "northeast",
    "prison2010": 265,
    "prison2022": 126,
    "prisonDeltaPct": -52.5,
    "violent2010": 131,
    "violent2022": 221.9,
    "violentDeltaPct": 69.4,
    "ratio2010": 2.02,
    "ratio2022": 0.57,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Colorado",
    "abbr": "CO",
    "region": "west",
    "prison2010": 445,
    "prison2022": 288,
    "prisonDeltaPct": -35.3,
    "violent2010": 323.7,
    "violent2022": 492.5,
    "violentDeltaPct": 52.1,
    "ratio2010": 1.37,
    "ratio2022": 0.58,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "South Dakota",
    "abbr": "SD",
    "region": "midwest",
    "prison2010": 416,
    "prison2022": 370,
    "prisonDeltaPct": -11.1,
    "violent2010": 268.9,
    "violent2022": 377.4,
    "violentDeltaPct": 40.3,
    "ratio2010": 1.55,
    "ratio2022": 0.98,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Oregon",
    "abbr": "OR",
    "region": "west",
    "prison2010": 361,
    "prison2022": 295,
    "prisonDeltaPct": -18.3,
    "violent2010": 251.4,
    "violent2022": 342.4,
    "violentDeltaPct": 36.2,
    "ratio2010": 1.44,
    "ratio2022": 0.86,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "New Mexico",
    "abbr": "NM",
    "region": "west",
    "prison2010": 323,
    "prison2022": 231,
    "prisonDeltaPct": -28.5,
    "violent2010": 588,
    "violent2022": 780.5,
    "violentDeltaPct": 32.7,
    "ratio2010": 0.55,
    "ratio2022": 0.3,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Washington",
    "abbr": "WA",
    "region": "west",
    "prison2010": 269,
    "prison2022": 174,
    "prisonDeltaPct": -35.3,
    "violent2010": 313.5,
    "violent2022": 375.6,
    "violentDeltaPct": 19.8,
    "ratio2010": 0.86,
    "ratio2022": 0.46,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Alaska",
    "abbr": "AK",
    "region": "west",
    "prison2010": 340,
    "prison2022": 205,
    "prisonDeltaPct": -39.7,
    "violent2010": 635.3,
    "violent2022": 758.9,
    "violentDeltaPct": 19.5,
    "ratio2010": 0.54,
    "ratio2022": 0.27,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Wisconsin",
    "abbr": "WI",
    "region": "midwest",
    "prison2010": 366,
    "prison2022": 311,
    "prisonDeltaPct": -15,
    "violent2010": 248.9,
    "violent2022": 297,
    "violentDeltaPct": 19.3,
    "ratio2010": 1.47,
    "ratio2022": 1.05,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Minnesota",
    "abbr": "MN",
    "region": "midwest",
    "prison2010": 185,
    "prison2022": 151,
    "prisonDeltaPct": -18.4,
    "violent2010": 235.7,
    "violent2022": 280.6,
    "violentDeltaPct": 19,
    "ratio2010": 0.78,
    "ratio2022": 0.54,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "California",
    "abbr": "CA",
    "region": "west",
    "prison2010": 439,
    "prison2022": 250,
    "prisonDeltaPct": -43.1,
    "violent2010": 439.6,
    "violent2022": 499.5,
    "violentDeltaPct": 13.6,
    "ratio2010": 1,
    "ratio2022": 0.5,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Utah",
    "abbr": "UT",
    "region": "west",
    "prison2010": 238,
    "prison2022": 176,
    "prisonDeltaPct": -26.1,
    "violent2010": 213.5,
    "violent2022": 241.8,
    "violentDeltaPct": 13.3,
    "ratio2010": 1.11,
    "ratio2022": 0.73,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  },
  {
    "state": "Louisiana",
    "abbr": "LA",
    "region": "south",
    "prison2010": 867,
    "prison2022": 596,
    "prisonDeltaPct": -31.3,
    "violent2010": 555.3,
    "violent2022": 628.6,
    "violentDeltaPct": 13.2,
    "ratio2010": 1.56,
    "ratio2022": 0.95,
    "path": "prison_down_crime_up",
    "confidence": "disclosed"
  }
];
export const TOP_ALIGNED_DOWN = [
  {
    "state": "Connecticut",
    "abbr": "CT",
    "region": "northeast",
    "prison2010": 376,
    "prison2022": 170,
    "prisonDeltaPct": -54.8,
    "violent2010": 282,
    "violent2022": 150,
    "violentDeltaPct": -46.8,
    "ratio2010": 1.33,
    "ratio2022": 1.13,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Massachusetts",
    "abbr": "MA",
    "region": "northeast",
    "prison2010": 200,
    "prison2022": 94,
    "prisonDeltaPct": -53,
    "violent2010": 468.9,
    "violent2022": 322,
    "violentDeltaPct": -31.3,
    "ratio2010": 0.43,
    "ratio2022": 0.29,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "New Jersey",
    "abbr": "NJ",
    "region": "northeast",
    "prison2010": 286,
    "prison2022": 137,
    "prisonDeltaPct": -52.1,
    "violent2010": 307.5,
    "violent2022": 202.9,
    "violentDeltaPct": -34,
    "ratio2010": 0.93,
    "ratio2022": 0.68,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "South Carolina",
    "abbr": "SC",
    "region": "south",
    "prison2010": 495,
    "prison2022": 302,
    "prisonDeltaPct": -39,
    "violent2010": 602.2,
    "violent2022": 491.3,
    "violentDeltaPct": -18.4,
    "ratio2010": 0.82,
    "ratio2022": 0.61,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Delaware",
    "abbr": "DE",
    "region": "south",
    "prison2010": 443,
    "prison2022": 272,
    "prisonDeltaPct": -38.6,
    "violent2010": 623.3,
    "violent2022": 383.5,
    "violentDeltaPct": -38.5,
    "ratio2010": 0.71,
    "ratio2022": 0.71,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Rhode Island",
    "abbr": "RI",
    "region": "northeast",
    "prison2010": 197,
    "prison2022": 124,
    "prisonDeltaPct": -37.1,
    "violent2010": 257.4,
    "violent2022": 172.3,
    "violentDeltaPct": -33.1,
    "ratio2010": 0.77,
    "ratio2022": 0.72,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Illinois",
    "abbr": "IL",
    "region": "midwest",
    "prison2010": 373,
    "prison2022": 236,
    "prisonDeltaPct": -36.7,
    "violent2010": 444.9,
    "violent2022": 287.3,
    "violentDeltaPct": -35.4,
    "ratio2010": 0.84,
    "ratio2022": 0.82,
    "path": "both_down",
    "confidence": "estimated"
  },
  {
    "state": "Maryland",
    "abbr": "MD",
    "region": "south",
    "prison2010": 387,
    "prison2022": 252,
    "prisonDeltaPct": -34.9,
    "violent2010": 546.3,
    "violent2022": 398.5,
    "violentDeltaPct": -27.1,
    "ratio2010": 0.71,
    "ratio2022": 0.63,
    "path": "both_down",
    "confidence": "estimated"
  },
  {
    "state": "Florida",
    "abbr": "FL",
    "region": "south",
    "prison2010": 556,
    "prison2022": 377,
    "prisonDeltaPct": -32.2,
    "violent2010": 541.3,
    "violent2022": 258.9,
    "violentDeltaPct": -52.2,
    "ratio2010": 1.03,
    "ratio2022": 1.46,
    "path": "both_down",
    "confidence": "estimated"
  },
  {
    "state": "Nevada",
    "abbr": "NV",
    "region": "west",
    "prison2010": 472,
    "prison2022": 322,
    "prisonDeltaPct": -31.8,
    "violent2010": 663,
    "violent2022": 454,
    "violentDeltaPct": -31.5,
    "ratio2010": 0.71,
    "ratio2022": 0.71,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "New Hampshire",
    "abbr": "NH",
    "region": "northeast",
    "prison2010": 209,
    "prison2022": 149,
    "prisonDeltaPct": -28.7,
    "violent2010": 167.4,
    "violent2022": 125.6,
    "violentDeltaPct": -25,
    "ratio2010": 1.25,
    "ratio2022": 1.19,
    "path": "both_down",
    "confidence": "disclosed"
  },
  {
    "state": "Maine",
    "abbr": "ME",
    "region": "northeast",
    "prison2010": 148,
    "prison2022": 107,
    "prisonDeltaPct": -27.7,
    "violent2010": 122.1,
    "violent2022": 103.3,
    "violentDeltaPct": -15.4,
    "ratio2010": 1.21,
    "ratio2022": 1.04,
    "path": "both_down",
    "confidence": "disclosed"
  }
];

export type RegionFilter = "all" | Region;
export type PathFilter = "all" | PathBucket;

export function filterStates(
  region: RegionFilter,
  path: PathFilter = "all",
): StateRow[] {
  return STATE_PANEL.filter((r) => {
    if (region !== "all" && r.region !== region) return false;
    if (path !== "all" && r.path !== path) return false;
    return true;
  });
}

export const REGION_OPTIONS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "northeast", label: "Northeast" },
  { id: "midwest", label: "Midwest" },
  { id: "south", label: "South" },
  { id: "west", label: "West" },
];

export const PATH_OPTIONS: { id: PathFilter; label: string }[] = [
  { id: "all", label: "All paths" },
  { id: "prison_down_crime_up", label: "Prison↓ / crime↑" },
  { id: "both_down", label: "Both down" },
  { id: "both_up", label: "Both up" },
  { id: "prison_up_crime_down", label: "Prison↑ / crime↓" },
];
