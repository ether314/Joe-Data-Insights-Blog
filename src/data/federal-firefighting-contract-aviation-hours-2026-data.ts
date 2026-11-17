/**
 * Federal firefighting contract aviation hours (2026).
 *
 * Core question: What share of large-fire aviation hours is exclusive-use
 * (EU/EXU) air tankers and helicopters versus call-when-needed (CWN), and
 * how did unit costs move?
 *
 * Desk join: USDA Forest Service Calendar-Year Aviation Utilization reports
 * (IBS/FAMWEB flight hours and pay codes) with published EU vs CWN contract
 * rate benchmarks. LAT/VLAT hours are calendar-year billed flight time on
 * large and very-large airtanker contracts — the primary federal fixed-wing
 * large-fire suppression fleet. Type 1 helicopter hours are the heaviest
 * rotor-wing tier; CY2020–2021 reflect a Type 1 EU contract gap bridged
 * by CWN/surge task orders.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "LAT/VLAT flight hours and pay-code costs are from USDA Forest Service " +
  "Calendar-Year Aviation Utilization and Cost Information reports (CY2017–" +
  "CY2021), sourced from Incident Business System (IBS) billing via FAMWEB. " +
  "Hours are calendar-year totals, not incident-size filtered — LAT/VLAT " +
  "assets are overwhelmingly ordered on extended attack and large-fire " +
  "incidents, but the reports do not isolate fire-size codes. Type 1 " +
  "helicopter contract splits are from the same reports; CY2020–2021 Type 1 " +
  "use was dominated by CWN/surge task orders after EU Type 1 acquisitions " +
  "were delayed or cancelled. EU vs CWN daily/hourly rate spreads are " +
  "published contract benchmarks (Fire Aviation desk composite, 2018; USFS " +
  "Large Airtanker Modernization Strategy, 2018). Implied flight $/hour " +
  "series divide IBS flight-time pay by total LAT/VLAT hours — a blended " +
  "desk metric, not a contract tariff.";

export const SOURCES = [
  {
    label: "USFS — CY2021 Aviation Utilization and Cost Information",
    url: "https://www.fs.usda.gov/sites/default/files/2022-11/CY21-Aviation-Report.pdf",
  },
  {
    label: "USFS — CY2020 Aviation Utilization and Cost Information",
    url: "https://www.fs.usda.gov/sites/default/files/2021-06/CY2020_USFSAviationReport_Final_1.pdf",
  },
  {
    label: "USFS — Aviation Publications Index",
    url: "https://www.fs.usda.gov/managing-land/fire/aviation/publications",
  },
  {
    label: "Fire Aviation — EU vs CWN large airtanker rate comparison (2018)",
    url: "https://web.archive.org/web/20180822170308/http://fireaviation.com/2018/02/21/cost-exclusive-use-vs-call-needed-air-tankers/",
  },
  {
    label: "USFS — Large Airtanker Modernization Strategy (2018)",
    url: "https://www.fs.usda.gov/sites/default/files/aviation_strategy_implementation-final-4.3.18.pdf",
  },
  {
    label: "DOI OWFC — Interagency Aviation Publications",
    url: "https://www.doi.gov/wildlandfire/aviation",
  },
] as const;

export const VIZ_MARKERS = [
  "Exclusive-use vs CWN hours",
  "LAT/VLAT hour share by contract",
  "Flight $/hour and rate spread",
] as const;

/** Headline punchline — CY2021 LAT/VLAT EXU hour share */
export const HEADLINE = {
  panelStart: 2017,
  panelEnd: 2021,
  /** CY2021 EXU share of LAT/VLAT flight hours (%) */
  cy2021ExuSharePct: 81.4,
  /** CY2020 EXU share — surge CWN year (%) */
  cy2020ExuSharePct: 53.9,
  /** CY2021 total LAT/VLAT flight hours */
  cy2021TotalHours: 7678,
  /** CY2021 EXU LAT/VLAT flight hours */
  cy2021ExuHours: 6247,
  /** CY2021 CWN LAT/VLAT flight hours */
  cy2021CwnHours: 1431,
  /** CWN daily rate premium vs EU (2018 benchmark, %) */
  cwnDailyPremiumPct: 54,
  /** CWN hourly rate premium vs EU (2018 benchmark, %) */
  cwnHourlyPremiumPct: 18,
  /** CY2021 implied flight $/hour (IBS flight pay ÷ hours) */
  cy2021FlightCostPerHour: 8715,
  /** CY2020 implied flight $/hour */
  cy2020FlightCostPerHour: 9525,
  /** CY2021 Type 1 helicopter hours — all CWN (no EU Type 1 contracts) */
  cy2021Type1CwnHours: 23228,
  /** Availability share of LAT/VLAT total cost CY2021 (%) */
  cy2021AvailabilityCostSharePct: 62,
} as const;

export type EraId = "quiet" | "surge" | "rebalance";

export interface LatVlatAnnualRow {
  cy: number;
  exuHours: number;
  cwnHours: number;
  exuLatHours: number;
  exuVlatHours: number;
  cwnLatHours: number;
  cwnVlatHours: number;
  totalCostM: number;
  availabilityCostM: number;
  flightCostM: number;
  confidence: Confidence;
  era: EraId;
  note?: string;
}

/** CY2017–2021 LAT/VLAT flight hours and IBS pay-code costs (Tables 16–22). */
export const LAT_VLAT_ANNUAL: LatVlatAnnualRow[] = [
  {
    cy: 2017,
    exuLatHours: 6156,
    exuVlatHours: 673,
    exuHours: 6829,
    cwnLatHours: 395,
    cwnVlatHours: 199,
    cwnHours: 594,
    totalCostM: 0,
    availabilityCostM: 0,
    flightCostM: 0,
    confidence: "disclosed",
    era: "quiet",
    note: "High EXU share; cost pay codes not in desk extract",
  },
  {
    cy: 2018,
    exuLatHours: 4021,
    exuVlatHours: 678,
    exuHours: 4699,
    cwnLatHours: 1196,
    cwnVlatHours: 291,
    cwnHours: 1487,
    totalCostM: 0,
    availabilityCostM: 0,
    flightCostM: 0,
    confidence: "disclosed",
    era: "quiet",
  },
  {
    cy: 2019,
    exuLatHours: 2273,
    exuVlatHours: 491,
    exuHours: 2764,
    cwnLatHours: 608,
    cwnVlatHours: 55,
    cwnHours: 663,
    totalCostM: 0,
    availabilityCostM: 0,
    flightCostM: 0,
    confidence: "disclosed",
    era: "quiet",
    note: "Quiet fire year; lowest panel total hours",
  },
  {
    cy: 2020,
    exuLatHours: 3768,
    exuVlatHours: 857,
    exuHours: 4625,
    cwnLatHours: 3415,
    cwnVlatHours: 535,
    cwnHours: 3950,
    totalCostM: 206.6,
    availabilityCostM: 123.1,
    flightCostM: 81.7,
    confidence: "disclosed",
    era: "surge",
    note: "COVID surge + heavy CWN LAT activation (3,707 CWN LAT hours)",
  },
  {
    cy: 2021,
    exuLatHours: 5355.2,
    exuVlatHours: 891.8,
    exuHours: 6247,
    cwnLatHours: 757.29,
    cwnVlatHours: 673.44,
    cwnHours: 1430.73,
    totalCostM: 180.3,
    availabilityCostM: 111.8,
    flightCostM: 66.9,
    confidence: "disclosed",
    era: "rebalance",
    note: "EXU hour share rebounded; 90-day CWN surge contracts",
  },
];

export interface Type1HeloRow {
  cy: number;
  exuHours: number;
  cwnHours: number;
  confidence: Confidence;
  note?: string;
}

/** Type 1 helicopter hours by contract type — CY2020–2021 only in published tables. */
export const TYPE1_HELO: Type1HeloRow[] = [
  {
    cy: 2020,
    exuHours: 141,
    cwnHours: 19293,
    confidence: "disclosed",
    note: "28 T1 helos on modified CWN vs traditional EXU during contract gap",
  },
  {
    cy: 2021,
    exuHours: 0,
    cwnHours: 23227.8,
    confidence: "disclosed",
    note: "No Type 1 EU contracts; 48 T1 CWN/surge task orders",
  },
];

export interface RateBenchmark {
  label: string;
  year: number;
  exuDaily: number;
  cwnDaily: number;
  exuHourly: number;
  cwnHourly: number;
  source: string;
}

/** Published EU vs CWN tariff spreads for large airtankers. */
export const RATE_BENCHMARKS: RateBenchmark[] = [
  {
    label: "Next-gen LAT composite",
    year: 2018,
    exuDaily: 30150,
    cwnDaily: 46341,
    exuHourly: 7601,
    cwnHourly: 8970,
    source: "Fire Aviation desk average (BAe-146, RJ85, C-130)",
  },
  {
    label: "USFS strategy rule-of-thumb",
    year: 2018,
    exuDaily: 0,
    cwnDaily: 0,
    exuHourly: 0,
    cwnHourly: 0,
    source: "EU LAT ~50% of CWN all-in cost (Modernization Strategy)",
  },
];

export interface EraSummary {
  id: EraId;
  label: string;
  years: string;
  avgExuSharePct: number;
  avgTotalHours: number;
  color: string;
}

export function latVlatTotalHours(row: LatVlatAnnualRow): number {
  return row.exuHours + row.cwnHours;
}

export function exuSharePct(row: LatVlatAnnualRow): number {
  const total = latVlatTotalHours(row);
  return total > 0 ? (row.exuHours / total) * 100 : 0;
}

export function cwnSharePct(row: LatVlatAnnualRow): number {
  return 100 - exuSharePct(row);
}

export function flightCostPerHour(row: LatVlatAnnualRow): number | null {
  if (row.flightCostM <= 0) return null;
  const total = latVlatTotalHours(row);
  return Math.round((row.flightCostM * 1_000_000) / total);
}

export function availabilitySharePct(row: LatVlatAnnualRow): number | null {
  if (row.totalCostM <= 0) return null;
  return Math.round((row.availabilityCostM / row.totalCostM) * 1000) / 10;
}

export function dualStackSeries() {
  return LAT_VLAT_ANNUAL.map((r) => ({
    cy: r.cy,
    exuHours: r.exuHours,
    cwnHours: Math.round(r.cwnHours),
    total: latVlatTotalHours(r),
    exuShare: Math.round(exuSharePct(r) * 10) / 10,
    cwnShare: Math.round(cwnSharePct(r) * 10) / 10,
    era: r.era,
    flightPerHour: flightCostPerHour(r),
    availShare: availabilitySharePct(r),
  }));
}

export function latVlatDecompose(cy: number) {
  const row = LAT_VLAT_ANNUAL.find((r) => r.cy === cy);
  if (!row) return [];
  return [
    { segment: "EXU LAT", hours: row.exuLatHours, kind: "exu" as const },
    { segment: "EXU VLAT", hours: row.exuVlatHours, kind: "exu" as const },
    { segment: "CWN LAT", hours: row.cwnLatHours, kind: "cwn" as const },
    { segment: "CWN VLAT", hours: row.cwnVlatHours, kind: "cwn" as const },
  ];
}

export function costStackForCy(cy: number) {
  const row = LAT_VLAT_ANNUAL.find((r) => r.cy === cy);
  if (!row || row.totalCostM <= 0) return [];
  const other =
    row.totalCostM - row.availabilityCostM - row.flightCostM;
  return [
    { payCode: "Availability", millions: row.availabilityCostM },
    { payCode: "Flight time", millions: row.flightCostM },
    { payCode: "Standby & other", millions: Math.max(0, Math.round(other * 10) / 10) },
  ];
}

export function eraSummary(): EraSummary[] {
  const eras: EraId[] = ["quiet", "surge", "rebalance"];
  const labels: Record<EraId, { label: string; years: string; color: string }> = {
    quiet: { label: "Quiet years", years: "2017–2019", color: "#0d9488" },
    surge: { label: "Surge CWN", years: "2020", color: "#d97706" },
    rebalance: { label: "EXU rebound", years: "2021", color: "#4f46e5" },
  };
  return eras.map((id) => {
    const rows = LAT_VLAT_ANNUAL.filter((r) => r.era === id);
    const avgShare =
      rows.reduce((s, r) => s + exuSharePct(r), 0) / rows.length;
    const avgHours =
      rows.reduce((s, r) => s + latVlatTotalHours(r), 0) / rows.length;
    return {
      id,
      ...labels[id],
      avgExuSharePct: Math.round(avgShare * 10) / 10,
      avgTotalHours: Math.round(avgHours),
    };
  });
}

export function rateCompareBars() {
  const b = RATE_BENCHMARKS[0];
  return [
    { metric: "Daily availability", exu: b.exuDaily, cwn: b.cwnDaily },
    { metric: "Hourly flight", exu: b.exuHourly, cwn: b.cwnHourly },
  ];
}

export function scatterEfficiency() {
  return LAT_VLAT_ANNUAL.filter((r) => r.flightCostM > 0).map((r) => ({
    cy: r.cy,
    hours: latVlatTotalHours(r),
    flightPerHour: flightCostPerHour(r)!,
    exuShare: exuSharePct(r),
    era: r.era,
  }));
}

export function type1Stack() {
  return TYPE1_HELO.map((r) => ({
    cy: r.cy,
    exuHours: r.exuHours,
    cwnHours: Math.round(r.cwnHours),
    cwnShare: r.exuHours + r.cwnHours > 0
      ? Math.round((r.cwnHours / (r.exuHours + r.cwnHours)) * 1000) / 10
      : 100,
  }));
}

export function fmtHours(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString("en-US");
}

export function fmtUsd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}
