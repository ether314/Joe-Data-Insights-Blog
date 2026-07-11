/**
 * Global refugee hosting burden by country (end-2024).
 *
 * Source: UNHCR Global Trends Report 2024 (published June 2025).
 *   https://www.unhcr.org/global-trends
 *   PDF: https://www.unhcr.org/sites/default/files/2025-06/global-trends-report-2024.pdf
 *
 * Supplementary country rows (marked `refugees_mandate_only`) from Our World in Data,
 *   grapher/refugee-population-by-country-or-territory-of-asylum (UNHCR Refugee
 *   Population Statistics, downloaded July 2026; raw extract: tmp-owid-refugees.csv).
 *
 * Population denominators: Our World in Data population series, year 2023
 *   (latest available in OWID extract; tmp-owid-population.csv).
 *
 * Methodology:
 * - Primary metric (`refugees_opniip`): refugees, people in a refugee-like situation,
 *   and other people in need of international protection — UNHCR Global Trends headline
 *   stock figures at 31 December 2024.
 * - Secondary metric (`refugees_mandate_only`): refugees under UNHCR mandate only (OWID).
 * - `perCapitaHostedPct` = hostedCount ÷ population × 100.
 * - `refugeesPerThousandResidents` = hostedCount ÷ population × 1,000.
 * - `oneInNResidents` = population ÷ hostedCount (UNHCR "1 in N" framing).
 * - Income levels: World Bank FY2024–2025 country classifications (UNHCR Table 2 notes).
 * - Regions assigned for dashboard grouping (not in UNHCR source).
 */

export type Region =
  | "Middle East"
  | "Asia-Pacific"
  | "Africa"
  | "Europe"
  | "Americas"
  | "Global";

export type IncomeLevel =
  | "low"
  | "lower_middle"
  | "upper_middle"
  | "high";

export type PopulationMetric = "refugees_opniip" | "refugees_mandate_only";

export type RefugeeHostRecord = {
  country: string;
  isoCode: string;
  year: number;
  region: Region;
  incomeLevel: IncomeLevel;
  isLeastDeveloped: boolean;
  population: number;
  hostedCount: number;
  populationMetric: PopulationMetric;
  perCapitaHostedPct: number;
  refugeesPerThousandResidents: number;
  oneInNResidents: number;
  primaryOrigin: string;
  neighborsMajority: boolean;
};

export type IncomeHostingShare = {
  incomeLevel: IncomeLevel;
  label: string;
  sharePct: number;
  color: string;
};

export const DATA_YEAR = 2024;

export const SOURCE_NOTE =
  "UNHCR Global Trends 2024 (end-year stock). Supplementary rows from OWID/UNHCR Refugee Population Statistics.";

/** Headline aggregates — UNHCR Global Trends 2024, Table 2 / Trends at a Glance */
export const GLOBAL_SUMMARY = {
  totalRefugeesOpniip: 36_900_000,
  lowAndMiddleIncomeSharePct: 73,
  neighboringCountriesSharePct: 67,
  leastDevelopedCountriesSharePct: 23,
  highIncomeSharePct: 27,
  topFiveHostSharePct: 32,
} as const;

export const INCOME_HOSTING_SHARES: IncomeHostingShare[] = [
  { incomeLevel: "upper_middle", label: "Upper-middle income", sharePct: 37, color: "#f59e0b" },
  { incomeLevel: "low", label: "Low income", sharePct: 19, color: "#dc2626" },
  { incomeLevel: "high", label: "High income", sharePct: 27, color: "#6366f1" },
  { incomeLevel: "lower_middle", label: "Lower-middle income", sharePct: 17, color: "#ea580c" },
];

export const INCOME_COLORS: Record<IncomeLevel, string> = {
  low: "#dc2626",
  lower_middle: "#ea580c",
  upper_middle: "#f59e0b",
  high: "#6366f1",
};

export const REGION_COLORS: Record<Region, string> = {
  "Middle East": "#0891b2",
  "Asia-Pacific": "#22c55e",
  Africa: "#a855f7",
  Europe: "#818cf8",
  Americas: "#f97316",
  Global: "#94a3b8",
};

function derivePerCapita(hostedCount: number, population: number) {
  const perCapitaHostedPct = (hostedCount / population) * 100;
  const refugeesPerThousandResidents = (hostedCount / population) * 1000;
  const oneInNResidents = population / hostedCount;
  return { perCapitaHostedPct, refugeesPerThousandResidents, oneInNResidents };
}

function host(
  country: string,
  isoCode: string,
  region: Region,
  incomeLevel: IncomeLevel,
  isLeastDeveloped: boolean,
  population: number,
  hostedCount: number,
  populationMetric: PopulationMetric,
  primaryOrigin: string,
  neighborsMajority: boolean,
): RefugeeHostRecord {
  return {
    country,
    isoCode,
    year: DATA_YEAR,
    region,
    incomeLevel,
    isLeastDeveloped,
    population,
    hostedCount,
    populationMetric,
    primaryOrigin,
    neighborsMajority,
    ...derivePerCapita(hostedCount, population),
  };
}

/** 25 countries — 16 UNHCR OPNIIP headline hosts + 9 mandate-only comparison hosts */
export const REFUGEE_HOSTS: RefugeeHostRecord[] = [
  // ── UNHCR Global Trends 2024: refugees + OPNIIP (end-2024) ──
  host("Iran", "IRN", "Middle East", "upper_middle", false, 90_608_708, 3_500_000, "refugees_opniip", "Afghanistan", true),
  host("Türkiye", "TUR", "Middle East", "upper_middle", false, 87_270_502, 2_900_000, "refugees_opniip", "Syria", true),
  host("Colombia", "COL", "Americas", "upper_middle", false, 52_321_152, 2_800_000, "refugees_opniip", "Venezuela", true),
  host("Germany", "DEU", "Europe", "high", false, 84_548_233, 2_700_000, "refugees_opniip", "Ukraine / Syria", false),
  host("Uganda", "UGA", "Africa", "low", true, 48_656_606, 1_800_000, "refugees_opniip", "South Sudan / DRC", true),
  host("Pakistan", "PAK", "Asia-Pacific", "lower_middle", false, 247_504_505, 1_600_000, "refugees_opniip", "Afghanistan", true),
  host("Chad", "TCD", "Africa", "low", true, 19_319_075, 1_100_000, "refugees_opniip", "Sudan", true),
  host("Peru", "PER", "Americas", "upper_middle", false, 33_845_616, 1_100_000, "refugees_opniip", "Venezuela", true),
  host("Bangladesh", "BGD", "Asia-Pacific", "lower_middle", true, 171_466_986, 1_100_000, "refugees_opniip", "Myanmar (Rohingya)", true),
  host("Poland", "POL", "Europe", "high", false, 38_762_847, 991_200, "refugees_opniip", "Ukraine", false),
  host("Brazil", "BRA", "Americas", "upper_middle", false, 211_140_731, 605_700, "refugees_opniip", "Venezuela", true),
  host("Lebanon", "LBN", "Middle East", "upper_middle", false, 5_773_494, 755_400, "refugees_opniip", "Syria", true),
  host("Jordan", "JOR", "Middle East", "upper_middle", false, 11_439_220, 611_500, "refugees_opniip", "Syria", true),
  host("Chile", "CHL", "Americas", "high", false, 19_658_833, 523_800, "refugees_opniip", "Venezuela", true),
  host("Ecuador", "ECU", "Americas", "upper_middle", false, 17_980_079, 441_600, "refugees_opniip", "Venezuela", true),
  host("Egypt", "EGY", "Africa", "lower_middle", false, 114_535_772, 602_700, "refugees_opniip", "Sudan", true),

  // ── OWID / UNHCR mandate refugees only (end-2024) — high-income comparison set ──
  host("Ethiopia", "ETH", "Africa", "low", true, 128_691_695, 1_008_826, "refugees_mandate_only", "South Sudan / Somalia", true),
  host("France", "FRA", "Europe", "high", false, 66_438_828, 721_771, "refugees_mandate_only", "Various", false),
  host("Kenya", "KEN", "Africa", "lower_middle", false, 55_339_007, 604_257, "refugees_mandate_only", "Somalia / South Sudan", true),
  host("Spain", "ESP", "Europe", "high", false, 47_911_583, 429_333, "refugees_mandate_only", "Various", false),
  host("United States", "USA", "Americas", "high", false, 343_477_330, 435_333, "refugees_mandate_only", "Various", false),
  host("Italy", "ITA", "Europe", "high", false, 59_499_452, 312_849, "refugees_mandate_only", "Various", false),
  host("Canada", "CAN", "Americas", "high", false, 39_299_098, 269_496, "refugees_mandate_only", "Various", false),
  host("Netherlands", "NLD", "Europe", "high", false, 18_092_526, 263_399, "refugees_mandate_only", "Various", false),
  host("Australia", "AUS", "Asia-Pacific", "high", false, 26_451_126, 29_511, "refugees_mandate_only", "Various", false),
];

export const OPNIIP_HOSTS = REFUGEE_HOSTS.filter((r) => r.populationMetric === "refugees_opniip");

export const TOP_HOSTS = [...OPNIIP_HOSTS].sort((a, b) => b.hostedCount - a.hostedCount);

export const TOP_PER_CAPITA = [...REFUGEE_HOSTS]
  .filter((r) => r.hostedCount >= 10_000)
  .sort((a, b) => b.perCapitaHostedPct - a.perCapitaHostedPct);

export function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString("en-US");
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPerThousand(n: number): string {
  return `${n.toFixed(1)} per 1,000`;
}

export function fmtOneInN(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  const rounded = Math.max(1, Math.round(n));
  return `1 in ${rounded.toLocaleString("en-US")}`;
}

export function incomeLabel(level: IncomeLevel): string {
  const map: Record<IncomeLevel, string> = {
    low: "Low income",
    lower_middle: "Lower-middle income",
    upper_middle: "Upper-middle income",
    high: "High income",
  };
  return map[level];
}

export function hostsByRegion(region: Region): RefugeeHostRecord[] {
  return REFUGEE_HOSTS.filter((r) => r.region === region);
}

export function hostsByIncome(level: IncomeLevel): RefugeeHostRecord[] {
  return REFUGEE_HOSTS.filter((r) => r.incomeLevel === level);
}

export function lmicHostedTotal(): number {
  return OPNIIP_HOSTS.filter((r) => r.incomeLevel !== "high").reduce((s, r) => s + r.hostedCount, 0);
}

export function highIncomeHostedTotal(): number {
  return OPNIIP_HOSTS.filter((r) => r.incomeLevel === "high").reduce((s, r) => s + r.hostedCount, 0);
}
