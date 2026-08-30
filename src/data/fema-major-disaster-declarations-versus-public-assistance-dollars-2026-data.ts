/**
 * FEMA major disaster declarations versus Public Assistance dollars (2026).
 *
 * Core question: Did the count of FEMA major disaster declarations and
 * obligated Public Assistance rise together over the last decade?
 *
 * Method: OpenFEMA Disaster Declarations Summaries v2 — unique disasterNumber
 * counts where declarationType = DR, by federal fiscal year (fyDeclared).
 * OpenFEMA Public Assistance Funded Projects Summaries v1 — sum of
 * federalObligatedAmount attributed to each declaration fiscal year
 * (declarationDate → federal FY). NOAA NCEI billion-dollar disaster counts
 * and CPI-adjusted costs for calendar-year context.
 *
 * Snapshot: OpenFEMA pull 2026-08-30. PA obligations continue to accrue on
 * open disasters; FY2024–FY2025 totals are still settling.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Primary: FEMA OpenFEMA Disaster Declarations Summaries v2 (unique DR disasterNumber by fyDeclared) and Public Assistance Funded Projects Summaries v1 (federalObligatedAmount summed by declaration fiscal year from declarationDate). Context: NOAA NCEI U.S. Billion-Dollar Weather and Climate Disasters time series (CPI-adjusted). Snapshot pulled 2026-08-30. County/area designation rows are NOT used as declaration counts — OpenFEMA stores one row per designated area. Biological (COVID-19) PA is shown separately because it dominates FY2020 dollars and is not a weather/climate event class.";

export const SOURCES = [
  {
    label: "OpenFEMA — Disaster Declarations Summaries v2",
    url: "https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v2",
  },
  {
    label: "OpenFEMA — Public Assistance Funded Projects Summaries v1",
    url: "https://www.fema.gov/openfema-data-page/public-assistance-funded-projects-summaries-v1",
  },
  {
    label: "OpenFEMA — Public Assistance Funded Projects Details v1",
    url: "https://www.fema.gov/openfema-dataset-public-assistance-funded-projects-details-v1",
  },
  {
    label: "NOAA NCEI — U.S. Billion-Dollar Weather & Climate Disasters",
    url: "https://www.ncei.noaa.gov/access/billions/",
  },
] as const;

export const VIZ_MARKERS = [
  "Declarations vs PA dollars by fiscal year",
  "FY2017 $66B and FY2020 $105B PA spikes",
] as const;

export const HEADLINE = {
  /** Peak unique major disaster declarations in the window */
  peakDrFy: 2024,
  peakDrCount: 88,
  /** Decade-start unique DR count (FY2015) */
  startDrCount: 44,
  /** Peak PA federal obligation attributed to declaration FY ($B) */
  peakPaFy: 2020,
  peakPaB: 105.07,
  /** Biological share of FY2020 PA */
  fy2020BioB: 98.01,
  /** FY2017 hurricane-dominated PA spike ($B) */
  fy2017PaB: 66.24,
  /** FY2015–FY2024 unique DR CAGR-ish framing: near-double peak vs start */
  peakVsStartRatio: 2.0,
  /** Median PA $B excluding FY2017 and FY2020 mega-spikes (approx) */
  typicalNonSpikePaB: 3.9,
  confidence: "disclosed" as Confidence,
};

export type AnnualRow = {
  fy: number;
  uniqueDrs: number;
  /** Unique DRs excluding Biological incident type */
  weatherDrs: number;
  countyDesignationRows: number;
  paProgramDeclared: number;
  /** Federal PA obligated ($B) for disasters declared in this FY */
  paFederalB: number;
  /** PA excluding Biological incident dollars ($B) */
  paNonBioB: number;
  bioPaB: number;
  /** Federal PA $M per unique DR */
  paPerDrM: number;
  /** NOAA calendar-year billion-dollar event count (same numeric year; N/A for FY2025 yet) */
  noaaBillionCount: number | null;
  noaaCostB: number | null;
  confidence: Confidence;
};

/** Merged FY series — OpenFEMA pull 2026-08-30 + NOAA calendar series */
export const ANNUAL: AnnualRow[] = [
  {
    fy: 2015,
    uniqueDrs: 44,
    weatherDrs: 44,
    countyDesignationRows: 809,
    paProgramDeclared: 43,
    paFederalB: 1.02,
    paNonBioB: 1.02,
    bioPaB: 0,
    paPerDrM: 23,
    noaaBillionCount: 11,
    noaaCostB: 31.0,
    confidence: "disclosed",
  },
  {
    fy: 2016,
    uniqueDrs: 41,
    weatherDrs: 41,
    countyDesignationRows: 797,
    paProgramDeclared: 41,
    paFederalB: 2.37,
    paNonBioB: 2.37,
    bioPaB: 0,
    paPerDrM: 58,
    noaaBillionCount: 15,
    noaaCostB: 61.3,
    confidence: "disclosed",
  },
  {
    fy: 2017,
    uniqueDrs: 60,
    weatherDrs: 60,
    countyDesignationRows: 1124,
    paProgramDeclared: 57,
    paFederalB: 66.24,
    paNonBioB: 66.24,
    bioPaB: 0,
    paPerDrM: 1104,
    noaaBillionCount: 19,
    noaaCostB: 395.9,
    confidence: "disclosed",
  },
  {
    fy: 2018,
    uniqueDrs: 55,
    weatherDrs: 55,
    countyDesignationRows: 548,
    paProgramDeclared: 52,
    paFederalB: 2.74,
    paNonBioB: 2.74,
    bioPaB: 0,
    paPerDrM: 50,
    noaaBillionCount: 16,
    noaaCostB: 116.1,
    confidence: "disclosed",
  },
  {
    fy: 2019,
    uniqueDrs: 68,
    weatherDrs: 68,
    countyDesignationRows: 1296,
    paProgramDeclared: 66,
    paFederalB: 7.01,
    paNonBioB: 7.01,
    bioPaB: 0,
    paPerDrM: 103,
    noaaBillionCount: 14,
    noaaCostB: 55.5,
    confidence: "disclosed",
  },
  {
    fy: 2020,
    uniqueDrs: 100,
    weatherDrs: 43,
    countyDesignationRows: 4800,
    paProgramDeclared: 94,
    paFederalB: 105.07,
    paNonBioB: 7.06,
    bioPaB: 98.01,
    paPerDrM: 1051,
    noaaBillionCount: 22,
    noaaCostB: 120.6,
    confidence: "disclosed",
  },
  {
    fy: 2021,
    uniqueDrs: 59,
    weatherDrs: 57,
    countyDesignationRows: 1160,
    paProgramDeclared: 55,
    paFederalB: 8.25,
    paNonBioB: 8.25,
    bioPaB: 0,
    paPerDrM: 140,
    noaaBillionCount: 20,
    noaaCostB: 164.5,
    confidence: "disclosed",
  },
  {
    fy: 2022,
    uniqueDrs: 52,
    weatherDrs: 52,
    countyDesignationRows: 755,
    paProgramDeclared: 47,
    paFederalB: 6.84,
    paNonBioB: 6.84,
    bioPaB: 0,
    paPerDrM: 132,
    noaaBillionCount: 18,
    noaaCostB: 183.6,
    confidence: "disclosed",
  },
  {
    fy: 2023,
    uniqueDrs: 68,
    weatherDrs: 68,
    countyDesignationRows: 902,
    paProgramDeclared: 63,
    paFederalB: 3.43,
    paNonBioB: 3.43,
    bioPaB: 0,
    paPerDrM: 50,
    noaaBillionCount: 28,
    noaaCostB: 95.3,
    confidence: "disclosed",
  },
  {
    fy: 2024,
    uniqueDrs: 88,
    weatherDrs: 88,
    countyDesignationRows: 1214,
    paProgramDeclared: 76,
    paFederalB: 7.82,
    paNonBioB: 7.82,
    bioPaB: 0,
    paPerDrM: 89,
    noaaBillionCount: 27,
    noaaCostB: 182.7,
    confidence: "disclosed",
  },
  {
    fy: 2025,
    uniqueDrs: 61,
    weatherDrs: 61,
    countyDesignationRows: 859,
    paProgramDeclared: 55,
    paFederalB: 3.93,
    paNonBioB: 3.93,
    bioPaB: 0,
    paPerDrM: 64,
    noaaBillionCount: null,
    noaaCostB: null,
    confidence: "estimated",
  },
];

export type IncidentMixRow = {
  fy: number;
  incidentType: string;
  uniqueDrs: number;
};

/** Top incident types within unique DR counts by FY */
export const INCIDENT_MIX: IncidentMixRow[] = [
  { fy: 2015, incidentType: "Severe Storm", uniqueDrs: 24 },
  { fy: 2015, incidentType: "Flood", uniqueDrs: 10 },
  { fy: 2015, incidentType: "Snow / Ice", uniqueDrs: 5 },
  { fy: 2015, incidentType: "Other", uniqueDrs: 5 },
  { fy: 2016, incidentType: "Severe Storm", uniqueDrs: 18 },
  { fy: 2016, incidentType: "Flood", uniqueDrs: 13 },
  { fy: 2016, incidentType: "Snow / Ice", uniqueDrs: 6 },
  { fy: 2016, incidentType: "Other", uniqueDrs: 4 },
  { fy: 2017, incidentType: "Severe Storm", uniqueDrs: 24 },
  { fy: 2017, incidentType: "Flood", uniqueDrs: 14 },
  { fy: 2017, incidentType: "Hurricane", uniqueDrs: 13 },
  { fy: 2017, incidentType: "Other", uniqueDrs: 9 },
  { fy: 2018, incidentType: "Flood", uniqueDrs: 17 },
  { fy: 2018, incidentType: "Severe Storm", uniqueDrs: 16 },
  { fy: 2018, incidentType: "Hurricane", uniqueDrs: 8 },
  { fy: 2018, incidentType: "Other", uniqueDrs: 14 },
  { fy: 2019, incidentType: "Flood", uniqueDrs: 27 },
  { fy: 2019, incidentType: "Severe Storm", uniqueDrs: 26 },
  { fy: 2019, incidentType: "Hurricane", uniqueDrs: 8 },
  { fy: 2019, incidentType: "Other", uniqueDrs: 7 },
  { fy: 2020, incidentType: "Biological", uniqueDrs: 57 },
  { fy: 2020, incidentType: "Severe Storm", uniqueDrs: 23 },
  { fy: 2020, incidentType: "Flood", uniqueDrs: 6 },
  { fy: 2020, incidentType: "Hurricane", uniqueDrs: 6 },
  { fy: 2020, incidentType: "Other", uniqueDrs: 8 },
  { fy: 2021, incidentType: "Hurricane", uniqueDrs: 17 },
  { fy: 2021, incidentType: "Severe Storm", uniqueDrs: 13 },
  { fy: 2021, incidentType: "Severe Ice Storm", uniqueDrs: 9 },
  { fy: 2021, incidentType: "Flood", uniqueDrs: 8 },
  { fy: 2021, incidentType: "Other", uniqueDrs: 12 },
  { fy: 2022, incidentType: "Severe Storm", uniqueDrs: 24 },
  { fy: 2022, incidentType: "Flood", uniqueDrs: 10 },
  { fy: 2022, incidentType: "Hurricane", uniqueDrs: 7 },
  { fy: 2022, incidentType: "Other", uniqueDrs: 11 },
  { fy: 2023, incidentType: "Severe Storm", uniqueDrs: 28 },
  { fy: 2023, incidentType: "Flood", uniqueDrs: 20 },
  { fy: 2023, incidentType: "Winter Storm", uniqueDrs: 7 },
  { fy: 2023, incidentType: "Hurricane", uniqueDrs: 6 },
  { fy: 2023, incidentType: "Other", uniqueDrs: 7 },
  { fy: 2024, incidentType: "Severe Storm", uniqueDrs: 39 },
  { fy: 2024, incidentType: "Flood", uniqueDrs: 21 },
  { fy: 2024, incidentType: "Tropical Storm", uniqueDrs: 8 },
  { fy: 2024, incidentType: "Hurricane", uniqueDrs: 6 },
  { fy: 2024, incidentType: "Other", uniqueDrs: 14 },
  { fy: 2025, incidentType: "Severe Storm", uniqueDrs: 27 },
  { fy: 2025, incidentType: "Flood", uniqueDrs: 13 },
  { fy: 2025, incidentType: "Tropical Storm", uniqueDrs: 7 },
  { fy: 2025, incidentType: "Fire", uniqueDrs: 7 },
  { fy: 2025, incidentType: "Other", uniqueDrs: 7 },
];

export type PaIncidentDollarRow = {
  fy: number;
  type: string;
  billions: number;
};

/** Dominant PA dollar incident classes by declaration FY (OpenFEMA summaries) */
export const PA_BY_INCIDENT: PaIncidentDollarRow[] = [
  { fy: 2015, type: "Severe Storm(s)", billions: 0.58 },
  { fy: 2015, type: "Fire", billions: 0.22 },
  { fy: 2015, type: "Other", billions: 0.22 },
  { fy: 2016, type: "Flood", billions: 1.66 },
  { fy: 2016, type: "Severe Storm(s)", billions: 0.39 },
  { fy: 2016, type: "Other", billions: 0.32 },
  { fy: 2017, type: "Hurricane", billions: 64.31 },
  { fy: 2017, type: "Flood", billions: 1.09 },
  { fy: 2017, type: "Other", billions: 0.84 },
  { fy: 2018, type: "Hurricane", billions: 0.92 },
  { fy: 2018, type: "Wildfire / Fire", billions: 1.04 },
  { fy: 2018, type: "Other", billions: 0.78 },
  { fy: 2019, type: "Hurricane", billions: 2.66 },
  { fy: 2019, type: "Wildfire", billions: 1.97 },
  { fy: 2019, type: "Severe Storm(s)", billions: 1.29 },
  { fy: 2019, type: "Other", billions: 1.09 },
  { fy: 2020, type: "Biological", billions: 98.01 },
  { fy: 2020, type: "Hurricane", billions: 3.88 },
  { fy: 2020, type: "Other", billions: 3.18 },
  { fy: 2021, type: "Hurricane", billions: 4.17 },
  { fy: 2021, type: "Tropical Storm", billions: 2.21 },
  { fy: 2021, type: "Other", billions: 1.87 },
  { fy: 2022, type: "Hurricane", billions: 4.82 },
  { fy: 2022, type: "Flood", billions: 0.5 },
  { fy: 2022, type: "Other", billions: 1.52 },
  { fy: 2023, type: "Severe Storm(s)", billions: 1.42 },
  { fy: 2023, type: "Wildfire", billions: 0.75 },
  { fy: 2023, type: "Hurricane", billions: 0.67 },
  { fy: 2023, type: "Other", billions: 0.59 },
  { fy: 2024, type: "Hurricane", billions: 3.28 },
  { fy: 2024, type: "Tropical Storm", billions: 2.96 },
  { fy: 2024, type: "Severe Storm(s)", billions: 0.88 },
  { fy: 2024, type: "Other", billions: 0.7 },
  { fy: 2025, type: "Hurricane", billions: 1.57 },
  { fy: 2025, type: "Tropical Storm", billions: 0.88 },
  { fy: 2025, type: "Severe Storm(s)", billions: 0.51 },
  { fy: 2025, type: "Other", billions: 0.97 },
];

export type StatePaRow = {
  state: string;
  paB: number;
  nonBioB: number;
  bioB: number;
};

/** Top jurisdictions by federal PA obligated for FY2015–FY2025 declarations */
export const STATE_PA_TOP: StatePaRow[] = [
  { state: "Puerto Rico", paB: 39.01, nonBioB: 38.85, bioB: 0.16 },
  { state: "Virgin Islands", paB: 22.22, nonBioB: 22.08, bioB: 0.14 },
  { state: "California", paB: 20.93, nonBioB: 6.26, bioB: 14.67 },
  { state: "New York", paB: 19.52, nonBioB: 2.13, bioB: 17.39 },
  { state: "Texas", paB: 19.01, nonBioB: 4.63, bioB: 14.38 },
  { state: "Florida", paB: 16.71, nonBioB: 11.78, bioB: 4.93 },
  { state: "Louisiana", paB: 10.63, nonBioB: 8.33, bioB: 2.3 },
  { state: "North Carolina", paB: 5.94, nonBioB: 3.88, bioB: 2.07 },
  { state: "New Jersey", paB: 3.79, nonBioB: 0.55, bioB: 3.23 },
  { state: "Massachusetts", paB: 3.67, nonBioB: 0.18, bioB: 3.49 },
  { state: "Georgia", paB: 3.46, nonBioB: 2.26, bioB: 1.2 },
  { state: "Maryland", paB: 3.39, nonBioB: 0.12, bioB: 3.27 },
];

export type ScatterRow = {
  fy: number;
  uniqueDrs: number;
  paFederalB: number;
  paNonBioB: number;
  label: string;
};

export const SCATTER: ScatterRow[] = ANNUAL.map((r) => ({
  fy: r.fy,
  uniqueDrs: r.uniqueDrs,
  paFederalB: r.paFederalB,
  paNonBioB: r.paNonBioB,
  label: `FY${r.fy}`,
}));

export function filterAnnual(
  includeBio: boolean,
  fyMin: number,
  fyMax: number,
): AnnualRow[] {
  return ANNUAL.filter((r) => r.fy >= fyMin && r.fy <= fyMax).map((r) =>
    includeBio
      ? r
      : {
          ...r,
          uniqueDrs: r.weatherDrs,
          paFederalB: r.paNonBioB,
          paPerDrM:
            r.weatherDrs > 0
              ? Math.round((r.paNonBioB * 1000) / r.weatherDrs)
              : 0,
        },
  );
}
