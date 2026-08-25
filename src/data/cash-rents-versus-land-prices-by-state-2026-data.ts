/**
 * Cash rents versus land prices by state (2026).
 *
 * Core question: Where did cash rent-to-price ratios compress most,
 * signaling pure appreciation demand rather than farming returns?
 *
 * Perimeter: USDA NASS Land Values 2025 Summary cropland $/acre by state
 * and region (2021–2025); USDA NASS Cash Rents Survey cropland $/acre
 * (state highlights + U.S. series); ERS regional farmland-value table
 * (2025); Federal Reserve Bank of Kansas City and Chicago Fed Ag Credit /
 * AgLetter surveys for credit-condition and rent-vs-value narrative.
 *
 * Headline: U.S. implied cropland rent yield fell from ~3.24% in 2021
 * (rent $141 / value $4,350) to ~2.76% in 2025 ($161 / $5,830) — a
 * −0.48 pp compression while cropland appreciated +34%.
 */

export type Confidence = "disclosed" | "estimated" | "scenario";

export const SOURCE_NOTE =
  "Cropland values: USDA NASS Land Values 2025 Summary (August 2025), state and farm-production-region tables, 2021–2025. Cash rents: USDA NASS Cash Rents Survey (August releases 2021–2025) and Land Values & Cash Rents highlights PDFs; U.S. cropland rent $141 (2021) → $161 (2025). Regional 2025 rent/value pairs: USDA ERS Farmland Value topic page (August 2025 regional table). Implied rent yield = cash rent ÷ cropland value (current yield). Compression = yield_2021 − yield_2025 (percentage points). Federal Reserve context: Kansas City Fed Ag Credit Survey (Q4 2024 / Q1 2025) and Chicago Fed AgLetter (February 2025) on flattened values, sticky rents, and credit-condition deterioration. State rents outside published highlight top-10 / Southern Regional releases are labeled estimated when anchored to regional NASS means and prior-year disclosed prints.";

export const SOURCES = [
  {
    label: "USDA NASS — Land Values 2025 Summary",
    url: "https://www.nass.usda.gov/Publications/Todays_Reports/reports/land0825.pdf",
  },
  {
    label: "USDA NASS — Land Values & Cash Rents highlights (2025)",
    url: "https://www.nass.usda.gov/Publications/Highlights/2025/2025LandValuesCashRents_FINAL.pdf",
  },
  {
    label: "USDA ERS — Farmland value (regional table, 2025)",
    url: "https://www.ers.usda.gov/topics/farm-economy/land-use-land-value-tenure/farmland-value",
  },
  {
    label: "Kansas City Fed — Ag Credit Survey (Q1 2025)",
    url: "https://www.kansascityfed.org/agriculture/ag-credit-survey/subdued-farm-economy-weighs-on-land-values-and-credit-conditions/",
  },
  {
    label: "Chicago Fed — AgLetter (February 2025)",
    url: "https://www.chicagofed.org/publications/agletter/2025-2029/february-2025",
  },
] as const;

export const HEADLINE = {
  usValue2021: 4350,
  usValue2025: 5830,
  usValueSince2021Pct: 34.0,
  usRent2021: 141,
  usRent2025: 161,
  usRentSince2021Pct: 14.2,
  usYield2021Pct: 3.24, // 141/4350
  usYield2025Pct: 2.76, // 161/5830
  usYieldCompressionPp: 0.48, // 3.24 - 2.76
  maxCompressionState: "Nebraska",
  maxCompressionPp: 0.91, // 4.23 → 3.32
  kansasCityRentVsValueNote:
    "KC Fed: values >50% above 2020 while rents only ~30% higher",
  confidence: "disclosed" as Confidence,
};

export type NassRegionId =
  | "northeast"
  | "lake-states"
  | "corn-belt"
  | "northern-plains"
  | "appalachian"
  | "southeast"
  | "delta-states"
  | "southern-plains"
  | "mountain"
  | "pacific"
  | "united-states";

export type NationalPathRow = {
  year: number;
  croplandValue: number;
  cashRent: number;
  yieldPct: number;
  confidence: Confidence;
};

/** U.S. cropland value (disclosed NASS) + cash rent (disclosed where cited). */
export const NATIONAL_PATH: NationalPathRow[] = [
  { year: 2019, croplandValue: 4030, cashRent: 136, yieldPct: 3.37, confidence: "disclosed" },
  { year: 2020, croplandValue: 4100, cashRent: 139, yieldPct: 3.39, confidence: "disclosed" },
  { year: 2021, croplandValue: 4350, cashRent: 141, yieldPct: 3.24, confidence: "disclosed" },
  { year: 2022, croplandValue: 4940, cashRent: 148, yieldPct: 3.0, confidence: "estimated" },
  { year: 2023, croplandValue: 5320, cashRent: 155, yieldPct: 2.91, confidence: "disclosed" },
  { year: 2024, croplandValue: 5570, cashRent: 160, yieldPct: 2.87, confidence: "disclosed" },
  { year: 2025, croplandValue: 5830, cashRent: 161, yieldPct: 2.76, confidence: "disclosed" },
];

export type RegionYieldRow = {
  regionId: NassRegionId;
  region: string;
  croplandValue2025: number;
  cashRent2025: number;
  yieldPct: number;
  confidence: Confidence;
};

/** ERS/NASS regional cropland value & rent, 2025. */
export const REGION_YIELDS_2025: RegionYieldRow[] = [
  { regionId: "corn-belt", region: "Corn Belt", croplandValue2025: 8940, cashRent2025: 240, yieldPct: 2.68, confidence: "disclosed" },
  { regionId: "pacific", region: "Pacific", croplandValue2025: 9830, cashRent2025: 281, yieldPct: 2.86, confidence: "disclosed" },
  { regionId: "northeast", region: "Northeast", croplandValue2025: 7900, cashRent2025: 102, yieldPct: 1.29, confidence: "disclosed" },
  { regionId: "lake-states", region: "Lake States", croplandValue2025: 6940, cashRent2025: 183, yieldPct: 2.64, confidence: "disclosed" },
  { regionId: "southeast", region: "Southeast", croplandValue2025: 5860, cashRent2025: 109, yieldPct: 1.86, confidence: "disclosed" },
  { regionId: "appalachian", region: "Appalachian", croplandValue2025: 5950, cashRent2025: 117, yieldPct: 1.97, confidence: "disclosed" },
  { regionId: "delta-states", region: "Delta States", croplandValue2025: 3750, cashRent2025: 134, yieldPct: 3.57, confidence: "disclosed" },
  { regionId: "northern-plains", region: "Northern Plains", croplandValue2025: 4220, cashRent2025: 123, yieldPct: 2.91, confidence: "disclosed" },
  { regionId: "southern-plains", region: "Southern Plains", croplandValue2025: 2640, cashRent2025: 46, yieldPct: 1.74, confidence: "disclosed" },
  { regionId: "mountain", region: "Mountain", croplandValue2025: 2800, cashRent2025: 106, yieldPct: 3.79, confidence: "disclosed" },
  { regionId: "united-states", region: "United States", croplandValue2025: 5830, cashRent2025: 161, yieldPct: 2.76, confidence: "disclosed" },
];

export type StateRentPriceRow = {
  state: string;
  abbr: string;
  regionId: NassRegionId;
  region: string;
  value2021: number;
  value2025: number;
  valueGrowthPct: number;
  rent2021: number;
  rent2025: number;
  rentGrowthPct: number;
  yield2021Pct: number;
  yield2025Pct: number;
  compressionPp: number;
  confidence: Confidence;
};

function row(
  state: string,
  abbr: string,
  regionId: NassRegionId,
  region: string,
  value2021: number,
  value2025: number,
  rent2021: number,
  rent2025: number,
  confidence: Confidence,
): StateRentPriceRow {
  const valueGrowthPct = Math.round(((value2025 / value2021 - 1) * 1000)) / 10;
  const rentGrowthPct = Math.round(((rent2025 / rent2021 - 1) * 1000)) / 10;
  const yield2021Pct = Math.round((rent2021 / value2021) * 10000) / 100;
  const yield2025Pct = Math.round((rent2025 / value2025) * 10000) / 100;
  const compressionPp = Math.round((yield2021Pct - yield2025Pct) * 100) / 100;
  return {
    state,
    abbr,
    regionId,
    region,
    value2021,
    value2025,
    valueGrowthPct,
    rent2021,
    rent2025,
    rentGrowthPct,
    yield2021Pct,
    yield2025Pct,
    compressionPp,
    confidence,
  };
}

/**
 * State panel: cropland $/acre from NASS Land Values 2025 Summary;
 * cash rents from NASS Cash Rents Survey highlights / regional releases
 * (disclosed) or region-anchored estimates.
 */
export const STATE_PANEL: StateRentPriceRow[] = [
  row("Iowa", "IA", "corn-belt", "Corn Belt", 7490, 10300, 233, 274, "disclosed"),
  row("Illinois", "IL", "corn-belt", "Corn Belt", 7800, 9850, 227, 264, "disclosed"),
  row("Indiana", "IN", "corn-belt", "Corn Belt", 6420, 8250, 200, 227, "disclosed"),
  row("Ohio", "OH", "corn-belt", "Corn Belt", 6920, 9750, 175, 198, "estimated"),
  row("Missouri", "MO", "corn-belt", "Corn Belt", 3870, 5150, 120, 138, "estimated"),
  row("Nebraska", "NE", "northern-plains", "Northern Plains", 4660, 6800, 197, 226, "disclosed"),
  row("Kansas", "KS", "northern-plains", "Northern Plains", 2230, 3440, 57, 72, "estimated"),
  row("South Dakota", "SD", "northern-plains", "Northern Plains", 3190, 4610, 115, 138, "estimated"),
  row("North Dakota", "ND", "northern-plains", "Northern Plains", 1960, 2710, 72, 88, "estimated"),
  row("Minnesota", "MN", "lake-states", "Lake States", 5030, 7000, 177, 200, "disclosed"),
  row("Wisconsin", "WI", "lake-states", "Lake States", 5240, 7250, 157, 172, "estimated"),
  row("Michigan", "MI", "lake-states", "Lake States", 4470, 6350, 130, 155, "estimated"),
  row("California", "CA", "pacific", "Pacific", 14370, 17940, 310, 346, "disclosed"),
  row("Washington", "WA", "pacific", "Pacific", 2860, 3480, 220, 259, "disclosed"),
  row("Idaho", "ID", "mountain", "Mountain", 4720, 6050, 185, 211, "disclosed"),
  row("Arizona", "AZ", "mountain", "Mountain", 7600, 8150, 320, 334, "disclosed"),
  row("Texas", "TX", "southern-plains", "Southern Plains", 2060, 2710, 38, 48, "estimated"),
  row("Oklahoma", "OK", "southern-plains", "Southern Plains", 1710, 2470, 32, 42, "estimated"),
  row("Arkansas", "AR", "delta-states", "Delta States", 3080, 3720, 115, 138, "estimated"),
  row("Mississippi", "MS", "delta-states", "Delta States", 3340, 3960, 118, 140, "estimated"),
  row("Georgia", "GA", "southeast", "Southeast", 3450, 4520, 135, 155, "disclosed"),
  row("Florida", "FL", "southeast", "Southeast", 7570, 10550, 127, 145, "disclosed"),
  row("Alabama", "AL", "southeast", "Southeast", 3650, 4550, 66.5, 78, "disclosed"),
  row("North Carolina", "NC", "appalachian", "Appalachian", 4260, 5360, 95, 112, "estimated"),
  row("Tennessee", "TN", "appalachian", "Appalachian", 4160, 6050, 90, 110, "estimated"),
  row("Montana", "MT", "mountain", "Mountain", 1110, 1320, 36.5, 39.5, "disclosed"),
].sort((a, b) => b.compressionPp - a.compressionPp);

export const COMPRESSION_LEADERS = STATE_PANEL.slice(0, 10);

export type GrowthScatterRow = {
  abbr: string;
  state: string;
  valueGrowthPct: number;
  rentGrowthPct: number;
  compressionPp: number;
  yield2025Pct: number;
  region: string;
  confidence: Confidence;
};

export const GROWTH_SCATTER: GrowthScatterRow[] = STATE_PANEL.map((s) => ({
  abbr: s.abbr,
  state: s.state,
  valueGrowthPct: s.valueGrowthPct,
  rentGrowthPct: s.rentGrowthPct,
  compressionPp: s.compressionPp,
  yield2025Pct: s.yield2025Pct,
  region: s.region,
  confidence: s.confidence,
}));

export type FedPulseRow = {
  period: string;
  district: string;
  valueYoyPct: number;
  rentYoyPct: number | null;
  note: string;
  confidence: Confidence;
};

/** Fed survey pulse: value moves vs sticky rents (disclosed narrative prints). */
export const FED_PULSE: FedPulseRow[] = [
  {
    period: "2024 full year",
    district: "Chicago Fed (7th)",
    valueYoyPct: -1.0,
    rentYoyPct: null,
    note: "Ended a four-year run of large annual farmland gains",
    confidence: "disclosed",
  },
  {
    period: "2024 Q4",
    district: "Kansas City Fed (10th)",
    valueYoyPct: 0.5,
    rentYoyPct: 1.5,
    note: "Nonirrigated values ~flat; cash rents <2% higher",
    confidence: "estimated",
  },
  {
    period: "2025 Q1",
    district: "Kansas City Fed (10th)",
    valueYoyPct: -2.0,
    rentYoyPct: 0.0,
    note: "Nonirrigated −2%; irrigated −4%; rents unchanged",
    confidence: "disclosed",
  },
  {
    period: "2025 cash rents",
    district: "Chicago Fed (7th)",
    valueYoyPct: 1.0,
    rentYoyPct: -2.0,
    note: "Q1 2025 values +1% y/y; 2025 annual cash rents −2%",
    confidence: "disclosed",
  },
];

export const REGION_OPTIONS = [
  { id: "all" as const, label: "All regions" },
  { id: "corn-belt" as const, label: "Corn Belt" },
  { id: "northern-plains" as const, label: "Northern Plains" },
  { id: "lake-states" as const, label: "Lake States" },
  { id: "pacific" as const, label: "Pacific" },
  { id: "mountain" as const, label: "Mountain" },
  { id: "southern-plains" as const, label: "Southern Plains" },
  { id: "delta-states" as const, label: "Delta States" },
  { id: "southeast" as const, label: "Southeast" },
  { id: "appalachian" as const, label: "Appalachian" },
  { id: "northeast" as const, label: "Northeast" },
];

export type RegionFilter = (typeof REGION_OPTIONS)[number]["id"];

export const ANALYTICS = {
  panelStates: STATE_PANEL.length,
  disclosedStates: STATE_PANEL.filter((s) => s.confidence === "disclosed").length,
  medianCompressionPp:
    Math.round(
      ([...STATE_PANEL].sort((a, b) => a.compressionPp - b.compressionPp)[
        Math.floor(STATE_PANEL.length / 2)
      ].compressionPp) *
        100,
    ) / 100,
  maxCompressionPp: STATE_PANEL[0].compressionPp,
  maxCompressionState: STATE_PANEL[0].state,
  minCompressionState: STATE_PANEL[STATE_PANEL.length - 1].state,
  minCompressionPp: STATE_PANEL[STATE_PANEL.length - 1].compressionPp,
  usYieldCompressionPp: HEADLINE.usYieldCompressionPp,
  valueOutpacedRentPp: Math.round((HEADLINE.usValueSince2021Pct - HEADLINE.usRentSince2021Pct) * 10) / 10,
};

export function filterStates(region: RegionFilter): StateRentPriceRow[] {
  if (region === "all") return STATE_PANEL;
  return STATE_PANEL.filter((s) => s.regionId === region);
}

export function sortStates(
  rows: StateRentPriceRow[],
  key: "compressionPp" | "yield2025Pct" | "valueGrowthPct" | "rentGrowthPct",
): StateRentPriceRow[] {
  return [...rows].sort((a, b) => b[key] - a[key]);
}
