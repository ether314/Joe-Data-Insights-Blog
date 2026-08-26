/**
 * Average school-bus fleet age versus EPA Clean School Bus (CSB) awards (2026).
 *
 * Core question: Did CSB-awarded replacements move the national mean fleet
 * age, or is the yellow stock still a diesel tail?
 *
 * Primary anchors: EPA Clean School Bus Program awards page and Reports to
 * Congress (FY2023 Third / FY2024 Fourth); School Bus Fleet (SBF) annual
 * maintenance surveys for mean yellow-fleet age; SBF K-12 transportation
 * statistics for national yellow-bus count. Age–award dual series,
 * cumulative fleet-share, and state award panels are desk compilations from
 * those public prints — not an EPA official index of mean fleet age.
 */

export type Confidence = "disclosed" | "derived" | "carried";

export const SOURCE_NOTE =
  "Mean yellow-fleet age (years) follows School Bus Fleet / Bobit " +
  "Business Media annual maintenance-survey prints as reported in the " +
  "March 2026 issue chart series (survey years 2021–2026). National " +
  "yellow-bus stock uses the SBF K-12 Student Transportation Statistics " +
  "2024–25 total (483,041). CSB award dollars and bus counts follow EPA " +
  "Clean School Bus Program awards summaries and the Fourth Report to " +
  "Congress (FY2024): almost $3 billion reserved/awarded for more than " +
  "8,500 bus replacements at over 1,200 districts by end of FY2024. " +
  "Round-level bus counts use EPA press releases and Electric School Bus " +
  "Initiative round summaries. State awarded-bus figures are desk " +
  "compilations from EPA report state callouts and Atlas/PIRG ESB " +
  "trackers — illustrative of concentration, not a live EPA state " +
  "dashboard download. Counterfactual mean-age paths are desk arithmetic " +
  "assuming CSB units replace the oldest diesel stock; they are not an " +
  "EPA published scenario.";

export const SOURCES = [
  {
    label: "EPA — Clean School Bus Program Awards",
    url: "https://www.epa.gov/cleanschoolbus/clean-school-bus-program-awards",
  },
  {
    label: "EPA — CSB Fourth Report to Congress (FY2024)",
    url: "https://www.epa.gov/system/files/documents/2026-04/420r25004.pdf",
  },
  {
    label: "EPA — CSB Third Report to Congress (FY2023)",
    url: "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P1019JFZ.TXT",
  },
  {
    label: "School Bus Fleet — March 2026 maintenance survey chart",
    url: "https://schoolbusfleet.mydigitalpublication.com/march-2026/page-11",
  },
  {
    label: "School Bus Fleet — K-12 transportation statistics 2024–25",
    url: "https://www.schoolbusfleet.com/news/k-12-student-transportation-statistics-2024-25",
  },
  {
    label: "Electric School Bus Initiative — CSB program overview",
    url: "https://electricschoolbusinitiative.org/all-about-clean-school-bus-program",
  },
] as const;

export const VIZ_MARKERS = [
  "Mean age vs CSB units dual axis",
  "Cumulative award share of fleet",
  "State award concentration bars",
] as const;

export const HEADLINE = {
  meanAge2026: 8.3,
  meanAgePeak: 9.3,
  meanAgeDropYrs: 1.0,
  csbBusesAwarded: 8500,
  csbDollarsB: 3.0,
  fleetYellowBuses: 483041,
  csbShareOfFleetPct: 1.76,
  dieselSharePct: 90,
} as const;

/** National yellow-bus stock (SBF 2024–25 statistics). */
export const FLEET_YELLOW_BUSES = 483_041;

/** Typical school-bus service life cited in EPA CSB reports (years). */
export const TYPICAL_SERVICE_LIFE_YRS = 16;

export type SurveyYearRow = {
  surveyYear: number;
  meanAgeYrs: number;
  /** Cumulative CSB buses selected/awarded through that calendar year */
  csbCumulativeBuses: number;
  /** Cumulative CSB dollars reserved/awarded, $ billions */
  csbCumulativeDollarsB: number;
  confidence: Confidence;
  note?: string;
};

/**
 * Dual series: SBF mean yellow-fleet age vs cumulative EPA CSB awards.
 * Age values from March 2026 SBF chart. Cumulative CSB buses/dollars are
 * desk-stepped from EPA round announcements (2022 rebates → 2023 grants →
 * 2023 rebates → FY2024 closeout ~8,500 / ~$3B).
 */
export const AGE_VS_AWARDS: SurveyYearRow[] = [
  {
    surveyYear: 2021,
    meanAgeYrs: 9.2,
    csbCumulativeBuses: 0,
    csbCumulativeDollarsB: 0,
    confidence: "disclosed",
    note: "Pre-CSB baseline (IIJA signed Nov 2021; first rebates 2022)",
  },
  {
    surveyYear: 2022,
    meanAgeYrs: 9.3,
    csbCumulativeBuses: 0,
    csbCumulativeDollarsB: 0,
    confidence: "disclosed",
    note: "2022 rebate lottery announced Oct 2022; few deliveries yet",
  },
  {
    surveyYear: 2023,
    meanAgeYrs: 9.3,
    csbCumulativeBuses: 2463,
    csbCumulativeDollarsB: 0.965,
    confidence: "derived",
    note: "2022 rebate round ~2,463 buses / ~$965M selected",
  },
  {
    surveyYear: 2024,
    meanAgeYrs: 8.8,
    csbCumulativeBuses: 5100,
    csbCumulativeDollarsB: 1.84,
    confidence: "derived",
    note: "Third Report: ~$1.84B / 5,103 buses as of Jan 2024",
  },
  {
    surveyYear: 2025,
    meanAgeYrs: 8.5,
    csbCumulativeBuses: 8500,
    csbCumulativeDollarsB: 2.83,
    confidence: "derived",
    note: "Three rounds complete; ~8,500 / almost $3B by FY2024 close",
  },
  {
    surveyYear: 2026,
    meanAgeYrs: 8.3,
    csbCumulativeBuses: 8500,
    csbCumulativeDollarsB: 3.0,
    confidence: "disclosed",
    note: "SBF: lowest mean age in ≥15 years; CSB still ~1.8% of stock",
  },
];

export type AwardRoundId =
  | "2022-rebates"
  | "2023-grants"
  | "2023-rebates"
  | "fy2024-close";

export type AwardRound = {
  id: AwardRoundId;
  label: string;
  year: number;
  buses: number;
  dollarsM: number;
  electricSharePct: number;
  districts: number;
  confidence: Confidence;
};

export const AWARD_ROUNDS: AwardRound[] = [
  {
    id: "2022-rebates",
    label: "2022 Rebates",
    year: 2022,
    buses: 2463,
    dollarsM: 965,
    electricSharePct: 95,
    districts: 389,
    confidence: "disclosed",
  },
  {
    id: "2023-grants",
    label: "2023 Grants",
    year: 2023,
    buses: 2700,
    dollarsM: 965,
    electricSharePct: 97,
    districts: 280,
    confidence: "carried",
  },
  {
    id: "2023-rebates",
    label: "2023 Rebates",
    year: 2023,
    buses: 3400,
    dollarsM: 900,
    electricSharePct: 92,
    districts: 530,
    confidence: "carried",
  },
  {
    id: "fy2024-close",
    label: "FY2024 program total",
    year: 2024,
    buses: 8500,
    dollarsM: 3000,
    electricSharePct: 90,
    districts: 1200,
    confidence: "disclosed",
  },
];

/** Incremental (non-cumulative) round rows for stacked charts. */
export const AWARD_ROUND_INCREMENTS: AwardRound[] = AWARD_ROUNDS.filter(
  (r) => r.id !== "fy2024-close",
);

export type FuelSlice = {
  id: string;
  label: string;
  sharePct: number;
  confidence: Confidence;
};

/** Approximate national fuel mix entering the CSB era (industry/EPA carried). */
export const FUEL_MIX_BASELINE: FuelSlice[] = [
  { id: "diesel", label: "Diesel", sharePct: 90, confidence: "carried" },
  { id: "propane", label: "Propane / LPG", sharePct: 5, confidence: "carried" },
  { id: "cng", label: "CNG / other ICE", sharePct: 3, confidence: "carried" },
  { id: "electric", label: "Battery electric", sharePct: 2, confidence: "derived" },
];

export type AgeBandId = "0-5" | "6-10" | "11-15" | "16-plus";

export type AgeBand = {
  id: AgeBandId;
  label: string;
  /** Approximate share of national yellow stock */
  sharePct: number;
  /** Whether EPA CSB typically targets this band for scrappage */
  csbTarget: boolean;
  confidence: Confidence;
};

/**
 * Illustrative age-band shares consistent with mean ~8.3–9.3 and
 * ~16-year retirement — desk-smoothed, not an SBF published histogram.
 */
export const AGE_BANDS: AgeBand[] = [
  {
    id: "0-5",
    label: "0–5 years",
    sharePct: 28,
    csbTarget: false,
    confidence: "derived",
  },
  {
    id: "6-10",
    label: "6–10 years",
    sharePct: 34,
    csbTarget: false,
    confidence: "derived",
  },
  {
    id: "11-15",
    label: "11–15 years",
    sharePct: 24,
    csbTarget: true,
    confidence: "derived",
  },
  {
    id: "16-plus",
    label: "16+ years (diesel tail)",
    sharePct: 14,
    csbTarget: true,
    confidence: "derived",
  },
];

export type StateAwardRow = {
  state: string;
  stateCode: string;
  /** Awarded / committed clean buses (desk panel) */
  awardedBuses: number;
  /** Yellow buses in state (SBF 2024–25 where available; carried otherwise) */
  fleetBuses: number;
  region: "northeast" | "midwest" | "south" | "west";
  confidence: Confidence;
};

/**
 * Curated state panel: awarded clean buses vs yellow fleet stock.
 * Awarded figures mix EPA FY2024 report callouts (NY >1,700; AZ/CA/IL/NC/TX
 * >1,000) with Atlas/PIRG May 2024 awarded-ESB tracker for mid-tier states.
 * Fleet counts from SBF 2024–25 state table (rounded).
 */
export const STATE_AWARDS: StateAwardRow[] = [
  {
    state: "New York",
    stateCode: "NY",
    awardedBuses: 1700,
    fleetBuses: 44000,
    region: "northeast",
    confidence: "carried",
  },
  {
    state: "California",
    stateCode: "CA",
    awardedBuses: 1100,
    fleetBuses: 32000,
    region: "west",
    confidence: "carried",
  },
  {
    state: "Texas",
    stateCode: "TX",
    awardedBuses: 1050,
    fleetBuses: 38000,
    region: "south",
    confidence: "carried",
  },
  {
    state: "Illinois",
    stateCode: "IL",
    awardedBuses: 1020,
    fleetBuses: 18000,
    region: "midwest",
    confidence: "carried",
  },
  {
    state: "North Carolina",
    stateCode: "NC",
    awardedBuses: 1010,
    fleetBuses: 14500,
    region: "south",
    confidence: "carried",
  },
  {
    state: "Arizona",
    stateCode: "AZ",
    awardedBuses: 1005,
    fleetBuses: 7200,
    region: "west",
    confidence: "carried",
  },
  {
    state: "Pennsylvania",
    stateCode: "PA",
    awardedBuses: 360,
    fleetBuses: 22000,
    region: "northeast",
    confidence: "derived",
  },
  {
    state: "Florida",
    stateCode: "FL",
    awardedBuses: 229,
    fleetBuses: 21000,
    region: "south",
    confidence: "derived",
  },
  {
    state: "Massachusetts",
    stateCode: "MA",
    awardedBuses: 288,
    fleetBuses: 9500,
    region: "northeast",
    confidence: "derived",
  },
  {
    state: "Georgia",
    stateCode: "GA",
    awardedBuses: 222,
    fleetBuses: 16000,
    region: "south",
    confidence: "derived",
  },
  {
    state: "Michigan",
    stateCode: "MI",
    awardedBuses: 310,
    fleetBuses: 14000,
    region: "midwest",
    confidence: "carried",
  },
  {
    state: "Virginia",
    stateCode: "VA",
    awardedBuses: 236,
    fleetBuses: 13000,
    region: "south",
    confidence: "derived",
  },
];

export type RegionId = StateAwardRow["region"] | "all";

export type CounterfactualPoint = {
  surveyYear: number;
  observedMeanAge: number;
  /** Desk path: observed age + CSB share × (mean − young-replacement age) */
  withoutCsbMeanAge: number;
  csbShareOfFleetPct: number;
};

/**
 * Back-of-envelope: if each cumulative CSB bus replaced a ~16-year diesel
 * with a 0-year unit, the national mean would fall by roughly
 * share × 16 years. Observed means already include all replacement
 * channels (local budgets, state programs, CSB). The "without CSB" path
 * adds that arithmetic back onto the observed series.
 */
export function buildCounterfactual(): CounterfactualPoint[] {
  return AGE_VS_AWARDS.map((row) => {
    const share = row.csbCumulativeBuses / FLEET_YELLOW_BUSES;
    const csbDragYrs = share * TYPICAL_SERVICE_LIFE_YRS;
    return {
      surveyYear: row.surveyYear,
      observedMeanAge: row.meanAgeYrs,
      withoutCsbMeanAge: Math.round((row.meanAgeYrs + csbDragYrs) * 100) / 100,
      csbShareOfFleetPct: Math.round(share * 10000) / 100,
    };
  });
}

export function fleetSharePct(buses: number): number {
  return Math.round((buses / FLEET_YELLOW_BUSES) * 10000) / 100;
}

export function filterStates(
  region: RegionId,
  minAwarded = 0,
): StateAwardRow[] {
  return STATE_AWARDS.filter((s) => {
    if (region !== "all" && s.region !== region) return false;
    if (s.awardedBuses < minAwarded) return false;
    return true;
  }).sort((a, b) => b.awardedBuses - a.awardedBuses);
}

export function stateAwardSharePct(row: StateAwardRow): number {
  if (row.fleetBuses <= 0) return 0;
  return Math.round((row.awardedBuses / row.fleetBuses) * 1000) / 10;
}

export function fmtAge(n: number): string {
  return `${n.toFixed(1)} yrs`;
}

export function fmtBuses(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtDollarsB(n: number): string {
  return `$${n.toFixed(2)}B`;
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}
