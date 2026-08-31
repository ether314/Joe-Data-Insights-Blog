/**
 * USDA / BIP honey bee colony loss vs California almond bearing acres.
 *
 * Core question: How do winter and annual colony loss rates compare with
 * almond acres that still require rented hives?
 *
 * Method: Pair Bee Informed Partnership / AIA national total winter and
 * annual colony-loss rates (Oct–Apr winter; Apr–Apr annual) with USDA
 * NASS California almond bearing acreage for the matching bloom year.
 * Implied hive demand uses the industry conventional stocking rate of
 * 2 colonies per bearing acre (ABC / CSBA practice guidance). USDA NASS
 * Honey Bee Colonies Jan-1 U.S. inventory (operations with 5+ colonies)
 * anchors the national stock against almond demand. Confidence: disclosed
 * survey totals and NASS acreage; hive-demand is a derived scenario, not
 * a NASS count of contracts signed.
 */

export const SOURCE_NOTE =
  "BIP / AIA national total colony-loss surveys; USDA NASS California Almond acreage & production; USDA NASS Honey Bee Colonies (ops with 5+ colonies). Implied hive demand = bearing acres × 2. Confidence: disclosed survey/NASS levels; demand scenario derived.";

export const SOURCES = [
  {
    label: "USDA NASS — Honey Bee Colonies (Aug 2025)",
    url: "https://www.nass.usda.gov/Publications/Todays_Reports/reports/hcny0825.pdf",
  },
  {
    label: "USDA NASS — California Almond Forecast (May 2025)",
    url: "https://www.nass.usda.gov/Statistics_by_State/California/Publications/Specialty_and_Other_Releases/Almond/Forecast/202505almpd.pdf",
  },
  {
    label: "AIA / Auburn — 2024–2025 US Beekeeping Survey",
    url: "https://apiaryinspectors.org/US-beekeeping-survey-24-25",
  },
  {
    label: "AIA / Auburn — 2023–2024 US Beekeeping Survey",
    url: "https://apiaryinspectors.org/US-beekeeping-survey-23-24/",
  },
  {
    label: "BIP — Journal of Apicultural Research colony-loss papers",
    url: "https://doi.org/10.1080/00218839.2023.2264601",
  },
] as const;

export const HEADLINE = {
  latestWinterLossPct: 40.2,
  latestAnnualLossPct: 55.6,
  latestAlmondAcresK: 1390,
  latestHiveDemandM: 2.78,
  latestUsJanColoniesM: 2.63,
  demandGapM: 0.15,
  acresGainPctSince2015: 46.3,
  winterAvgPct: 31.3,
  acceptableWinterPct: 21.7,
  stockingRate: 2,
  latestSeason: "2024-25",
  latestBloomYear: 2025,
} as const;

export const ANALYTICS = {
  smokeMarker: "Winter loss vs almond acres",
} as const;

export const VIZ_MARKERS = [
  "winter-vs-acres",
  "demand-vs-stock",
  "loss-scatter",
  "stocking-ladder",
] as const;

/** Bloom year pairs winter ending that spring with that crop's bearing acres. */
export type SeasonRow = {
  bloomYear: number;
  season: string;
  winterLossPct: number;
  annualLossPct: number;
  summerLossPct: number | null;
  almondBearingAcresK: number;
  hiveDemandM: number;
  usJanColoniesM: number;
  /** Hive demand ÷ Jan-1 U.S. colonies (ops 5+). */
  demandShareOfStock: number;
  winterVsAcceptablePp: number;
};

/**
 * National total loss rates from BIP / AIA published abstracts.
 * Almond acres: USDA NASS CA almond bearing acreage (000s).
 * Jan-1 colonies: USDA NASS Honey Bee Colonies, ops with 5+ colonies (millions).
 * Winter-vs-acceptable uses survey "acceptable" winter loss (~20–23%); we use
 * 21.7 (2024-25 reported) as a stable reference for the gap series.
 */
export const SEASONS: SeasonRow[] = [
  {
    bloomYear: 2016,
    season: "2015-16",
    winterLossPct: 28.1,
    annualLossPct: 40.5,
    summerLossPct: 23.6,
    almondBearingAcresK: 970,
    hiveDemandM: 1.94,
    usJanColoniesM: 2.59,
    demandShareOfStock: 0.749,
    winterVsAcceptablePp: 6.4,
  },
  {
    bloomYear: 2017,
    season: "2016-17",
    winterLossPct: 21.1,
    annualLossPct: 33.2,
    summerLossPct: 18.0,
    almondBearingAcresK: 1030,
    hiveDemandM: 2.06,
    usJanColoniesM: 2.89,
    demandShareOfStock: 0.713,
    winterVsAcceptablePp: -0.6,
  },
  {
    bloomYear: 2018,
    season: "2017-18",
    winterLossPct: 30.7,
    annualLossPct: 40.1,
    summerLossPct: 17.9,
    almondBearingAcresK: 1090,
    hiveDemandM: 2.18,
    usJanColoniesM: 2.64,
    demandShareOfStock: 0.826,
    winterVsAcceptablePp: 9.0,
  },
  {
    bloomYear: 2019,
    season: "2018-19",
    winterLossPct: 37.7,
    annualLossPct: 40.4,
    summerLossPct: 17.8,
    almondBearingAcresK: 1180,
    hiveDemandM: 2.36,
    usJanColoniesM: 2.67,
    demandShareOfStock: 0.884,
    winterVsAcceptablePp: 16.0,
  },
  {
    bloomYear: 2020,
    season: "2019-20",
    winterLossPct: 22.9,
    annualLossPct: 44.0,
    summerLossPct: 32.1,
    almondBearingAcresK: 1250,
    hiveDemandM: 2.5,
    usJanColoniesM: 2.88,
    demandShareOfStock: 0.868,
    winterVsAcceptablePp: 1.2,
  },
  {
    bloomYear: 2021,
    season: "2020-21",
    winterLossPct: 33.5,
    annualLossPct: 50.8,
    summerLossPct: 31.1,
    almondBearingAcresK: 1310,
    hiveDemandM: 2.62,
    usJanColoniesM: 2.92,
    demandShareOfStock: 0.897,
    winterVsAcceptablePp: 11.8,
  },
  {
    bloomYear: 2022,
    season: "2021-22",
    winterLossPct: 24.2,
    annualLossPct: 39.0,
    summerLossPct: 23.8,
    almondBearingAcresK: 1350,
    hiveDemandM: 2.7,
    usJanColoniesM: 2.93,
    demandShareOfStock: 0.922,
    winterVsAcceptablePp: 2.5,
  },
  {
    bloomYear: 2023,
    season: "2022-23",
    winterLossPct: 37.4,
    annualLossPct: 48.2,
    summerLossPct: 24.9,
    almondBearingAcresK: 1380,
    hiveDemandM: 2.76,
    usJanColoniesM: 2.7,
    demandShareOfStock: 1.022,
    winterVsAcceptablePp: 15.7,
  },
  {
    bloomYear: 2024,
    season: "2023-24",
    winterLossPct: 37.3,
    annualLossPct: 55.1,
    summerLossPct: 30.4,
    almondBearingAcresK: 1380,
    hiveDemandM: 2.76,
    usJanColoniesM: 2.67,
    demandShareOfStock: 1.034,
    winterVsAcceptablePp: 15.6,
  },
  {
    bloomYear: 2025,
    season: "2024-25",
    winterLossPct: 40.2,
    annualLossPct: 55.6,
    summerLossPct: 28.8,
    almondBearingAcresK: 1390,
    hiveDemandM: 2.78,
    usJanColoniesM: 2.63,
    demandShareOfStock: 1.057,
    winterVsAcceptablePp: 18.5,
  },
];

/** Stocking-rate scenarios for the demand ladder panel. */
export type StockingScenario = {
  id: string;
  label: string;
  coloniesPerAcre: number;
  demandM: number;
  vsJanStockPct: number;
};

export function stockingScenarios(acresK: number, janColoniesM: number): StockingScenario[] {
  const acres = acresK * 1000;
  return [
    { id: "1.5", label: "1.5 / acre (self-fertile lean)", coloniesPerAcre: 1.5, demandM: +(acres * 1.5 / 1e6).toFixed(2), vsJanStockPct: 0 },
    { id: "2.0", label: "2.0 / acre (conventional)", coloniesPerAcre: 2.0, demandM: +(acres * 2.0 / 1e6).toFixed(2), vsJanStockPct: 0 },
    { id: "2.5", label: "2.5 / acre (heavy set)", coloniesPerAcre: 2.5, demandM: +(acres * 2.5 / 1e6).toFixed(2), vsJanStockPct: 0 },
  ].map((s) => ({
    ...s,
    vsJanStockPct: +((s.demandM / janColoniesM) * 100).toFixed(1),
  }));
}

export type WindowId = "all" | "since2019" | "since2022";

export const WINDOW_OPTIONS: { id: WindowId; label: string }[] = [
  { id: "all", label: "2015–25" },
  { id: "since2019", label: "Since 2018-19" },
  { id: "since2022", label: "Since 2021-22" },
];

export function seasonsForWindow(window: WindowId): SeasonRow[] {
  if (window === "since2019") return SEASONS.filter((r) => r.bloomYear >= 2019);
  if (window === "since2022") return SEASONS.filter((r) => r.bloomYear >= 2022);
  return SEASONS;
}

export type LossMetric = "winter" | "annual" | "summer";

export const LOSS_METRIC_OPTIONS: { id: LossMetric; label: string }[] = [
  { id: "winter", label: "Winter loss" },
  { id: "annual", label: "Annual loss" },
  { id: "summer", label: "Summer loss" },
];

export function lossPct(row: SeasonRow, metric: LossMetric): number | null {
  if (metric === "winter") return row.winterLossPct;
  if (metric === "annual") return row.annualLossPct;
  return row.summerLossPct;
}

export function dualAxisRows(window: WindowId, metric: LossMetric) {
  return seasonsForWindow(window).map((r) => ({
    season: r.season,
    bloomYear: r.bloomYear,
    lossPct: lossPct(r, metric),
    almondAcresK: r.almondBearingAcresK,
    hiveDemandM: r.hiveDemandM,
    usJanColoniesM: r.usJanColoniesM,
  }));
}

export function demandStockRows(window: WindowId) {
  return seasonsForWindow(window).map((r) => ({
    season: r.season,
    bloomYear: r.bloomYear,
    hiveDemandM: r.hiveDemandM,
    usJanColoniesM: r.usJanColoniesM,
    demandSharePct: +(r.demandShareOfStock * 100).toFixed(1),
    gapM: +(r.hiveDemandM - r.usJanColoniesM).toFixed(2),
  }));
}

export function scatterLossVsAcres(window: WindowId, metric: LossMetric) {
  return seasonsForWindow(window)
    .map((r) => ({
      season: r.season,
      bloomYear: r.bloomYear,
      acresK: r.almondBearingAcresK,
      lossPct: lossPct(r, metric),
      demandSharePct: +(r.demandShareOfStock * 100).toFixed(1),
    }))
    .filter((r) => r.lossPct != null) as Array<{
    season: string;
    bloomYear: number;
    acresK: number;
    lossPct: number;
    demandSharePct: number;
  }>;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtAcresK(n: number): string {
  return `${n.toLocaleString()}k acres`;
}

export function fmtM(n: number, digits = 2): string {
  return `${n.toFixed(digits)}M`;
}
