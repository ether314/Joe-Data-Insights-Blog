/**
 * IMLS library visits versus electronic circulation (2026).
 *
 * Core question: Did physical visits fall while electronic circulation rose,
 * and in which states did both drop together?
 *
 * Primary anchors: IMLS Public Libraries Survey (PLS) FY 2018–FY 2023 —
 * national visit totals / per-capita visits, physical vs electronic circulation
 * per person, and state-level desk indexes of visits and e-circ vs FY 2019.
 * Quadrant labels and dual-decline counts are analytical joins, not an IMLS
 * published product.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "National visit and circulation levels follow the Institute of Museum and " +
  "Library Services (IMLS) Public Libraries Survey (PLS) for FY 2018–FY 2023, " +
  "including the FY 2023 research brief on pandemic disruption and recovery " +
  "and FY 2019 supplementary findings. Per-person medians (visits, physical " +
  "circulation, electronic circulation) are IMLS-reported medians; national " +
  "means and visit totals also draw on PLS benchmarking / findings tables. " +
  "State visit and e-circ indexes (FY 2019 = 100) are desk composites from " +
  "PLS state ranking and services tables for overlapping fiscal years — not " +
  "a single IMLS published index series. Quadrant counts (visits down / e-circ " +
  "up, dual decline, etc.) are analytical classifications of those indexes.";

export const SOURCES = [
  {
    label: "IMLS — Public Libraries Survey (PLS)",
    url: "https://www.imls.gov/research-evaluation/surveys/public-libraries-survey-pls",
  },
  {
    label: "IMLS — FY 2023 Research Brief (visits & circulation recovery)",
    url: "https://www.imls.gov/sites/default/files/2026-05/FY2023-Research-Brief-508_05132026.pdf",
  },
  {
    label: "IMLS — FY 2019 PLS Findings",
    url: "https://imls.gov/sites/default/files/2021-08/fy19-pls-results.pdf",
  },
  {
    label: "IMLS — PLS Benchmarking Tables (FY 2023 release)",
    url: "https://www.imls.gov/research-evaluation/surveys/public-libraries-survey-pls",
  },
] as const;

export const VIZ_MARKERS = [
  "Visits vs e-circ index",
  "National dual track",
  "State quadrant map",
] as const;

/** Headline punchline — visits still below 2019 while e-circ climbs */
export const HEADLINE = {
  /** FY 2019 national library visits (billions) */
  visits2019B: 1.2,
  /** FY 2023 national library visits (millions) — recovery but below 2019 */
  visits2023M: 800,
  /** Visits index FY 2023 vs FY 2019 (=100) */
  visitsIndex2023: 67,
  /** Electronic circulation per person FY 2019 (national mean) */
  eCirc2019: 1.1,
  /** Electronic circulation per person FY 2023 (benchmarking mean) */
  eCirc2023: 1.68,
  /** E-circ index FY 2023 vs FY 2019 (=100) */
  eCircIndex2023: 153,
  /** Median e-circ per person FY 2018 → FY 2023 (IMLS brief) */
  medianECirc2018: 0.49,
  medianECirc2023: 0.9,
  /** Median e-circ % growth FY 2018–FY 2023 */
  medianECircGrowthPct: 84,
  /** Median visits per person FY 2021 → FY 2023 */
  medianVisits2021: 0.4,
  medianVisits2023: 2.8,
  /** States in desk panel */
  stateN: 51,
  /** States with visits index <100 and e-circ index >100 (substitution path) */
  visitsDownEcircUp: 38,
  /** States where both indexes <100 (dual decline) */
  dualDecline: 7,
  /** States with both indexes ≥100 (full recovery+) */
  bothUp: 4,
  /** States with visits ≥100 but e-circ still below FY 2019 */
  visitsUpEcircDown: 2,
  /** Visits still below FY 2019 while e-circ above — national story */
  nationalGapPts: 86,
} as const;

export type RegionId =
  | "Northeast"
  | "Midwest"
  | "South"
  | "West";

export type LocaleId = "City" | "Suburb" | "Town" | "Rural";

export type QuadrantId =
  | "visits-down-ecirc-up"
  | "both-up"
  | "both-down"
  | "visits-up-ecirc-down";

export type NationalYear = {
  fy: number;
  /** Visits index vs FY 2019 = 100 (desk; FY 2019 anchored at 100) */
  visitsIndex: number;
  /** E-circ index vs FY 2019 = 100 */
  eCircIndex: number;
  /** Median visits per person (IMLS brief / PLS) */
  medianVisitsPerPerson: number;
  /** Median physical circ per person */
  medianPhysCirc: number;
  /** Median electronic circ per person */
  medianECirc: number;
  confidence: Confidence;
};

export type StateRow = {
  state: string;
  abbr: string;
  region: RegionId;
  /** Visits per capita index, FY 2023 vs FY 2019 (=100) */
  visitsIndex: number;
  /** Electronic circ per capita index, FY 2023 vs FY 2019 (=100) */
  eCircIndex: number;
  /** FY 2023 visits per capita (approx) */
  visitsPerCapita: number;
  /** FY 2023 e-circ per capita (approx) */
  eCircPerCapita: number;
  /** Population of legal service area (millions) */
  lsaM: number;
  quadrant: QuadrantId;
  confidence: Confidence;
};

export type LocaleRow = {
  locale: LocaleId;
  medianVisits2018: number;
  medianVisits2021: number;
  medianVisits2023: number;
  medianECirc2018: number;
  medianECirc2023: number;
  eCircGrowthPct: number;
  confidence: Confidence;
};

export type RegionSummary = {
  region: RegionId;
  states: number;
  dualDecline: number;
  visitsDownEcircUp: number;
  bothUp: number;
  medianVisitsIndex: number;
  medianECircIndex: number;
};

function quadrant(visitsIndex: number, eCircIndex: number): QuadrantId {
  const visitsUp = visitsIndex >= 100;
  const eUp = eCircIndex >= 100;
  if (!visitsUp && eUp) return "visits-down-ecirc-up";
  if (visitsUp && eUp) return "both-up";
  if (!visitsUp && !eUp) return "both-down";
  return "visits-up-ecirc-down";
}

/** National dual-track path: visits collapse then partial rebound; e-circ climbs */
export const NATIONAL_PATH: NationalYear[] = [
  {
    fy: 2018,
    visitsIndex: 103,
    eCircIndex: 78,
    medianVisitsPerPerson: 4.1,
    medianPhysCirc: 5.2,
    medianECirc: 0.49,
    confidence: "disclosed",
  },
  {
    fy: 2019,
    visitsIndex: 100,
    eCircIndex: 100,
    medianVisitsPerPerson: 3.9,
    medianPhysCirc: 5.0,
    medianECirc: 0.55,
    confidence: "disclosed",
  },
  {
    fy: 2020,
    visitsIndex: 52,
    eCircIndex: 118,
    medianVisitsPerPerson: 1.6,
    medianPhysCirc: 3.6,
    medianECirc: 0.65,
    confidence: "estimated",
  },
  {
    fy: 2021,
    visitsIndex: 38,
    eCircIndex: 132,
    medianVisitsPerPerson: 0.4,
    medianPhysCirc: 3.41,
    medianECirc: 0.73,
    confidence: "disclosed",
  },
  {
    fy: 2022,
    visitsIndex: 58,
    eCircIndex: 142,
    medianVisitsPerPerson: 2.5,
    medianPhysCirc: 3.7,
    medianECirc: 0.82,
    confidence: "disclosed",
  },
  {
    fy: 2023,
    visitsIndex: 67,
    eCircIndex: 153,
    medianVisitsPerPerson: 2.8,
    medianPhysCirc: 3.91,
    medianECirc: 0.9,
    confidence: "disclosed",
  },
];

/**
 * State panel: FY 2023 indexes vs FY 2019 (=100).
 * Desk composites from PLS state services / ranking tables; dual-decline
 * and substitution-path classifications are analytical.
 */
export const STATE_PANEL: StateRow[] = (
  [
    // Northeast
    ["Connecticut", "CT", "Northeast", 71, 168, 3.2, 2.1, 3.5],
    ["Maine", "ME", "Northeast", 74, 142, 4.1, 1.4, 1.3],
    ["Massachusetts", "MA", "Northeast", 69, 175, 3.8, 2.4, 6.8],
    ["New Hampshire", "NH", "Northeast", 78, 155, 4.5, 1.8, 1.3],
    ["New Jersey", "NJ", "Northeast", 64, 161, 2.9, 1.9, 8.9],
    ["New York", "NY", "Northeast", 62, 158, 3.1, 1.7, 19.2],
    ["Pennsylvania", "PA", "Northeast", 66, 148, 3.4, 1.5, 12.5],
    ["Rhode Island", "RI", "Northeast", 70, 152, 3.6, 1.6, 1.0],
    ["Vermont", "VT", "Northeast", 81, 138, 5.2, 1.5, 0.6],
    // Midwest — Plains include full-recovery and in-person-only outliers
    ["Illinois", "IL", "Midwest", 65, 149, 3.5, 1.6, 12.1],
    ["Indiana", "IN", "Midwest", 72, 141, 4.0, 1.3, 6.5],
    ["Iowa", "IA", "Midwest", 79, 136, 5.1, 1.4, 3.1],
    ["Kansas", "KS", "Midwest", 76, 133, 4.8, 1.2, 2.8],
    ["Michigan", "MI", "Midwest", 68, 146, 3.7, 1.5, 9.8],
    ["Minnesota", "MN", "Midwest", 82, 159, 5.4, 2.0, 5.5],
    ["Missouri", "MO", "Midwest", 70, 139, 4.2, 1.3, 5.9],
    ["Nebraska", "NE", "Midwest", 84, 145, 5.6, 1.5, 1.9],
    ["North Dakota", "ND", "Midwest", 102, 128, 6.1, 1.1, 0.7],
    ["Ohio", "OH", "Midwest", 73, 151, 4.3, 1.6, 11.4],
    ["South Dakota", "SD", "Midwest", 101, 124, 5.9, 1.0, 0.9],
    ["Wisconsin", "WI", "Midwest", 77, 154, 4.9, 1.7, 5.7],
    // South — dual-decline cluster where both channels lag FY 2019
    ["Alabama", "AL", "South", 58, 97, 2.4, 0.8, 4.8],
    ["Arkansas", "AR", "South", 61, 95, 2.8, 0.7, 2.9],
    ["Delaware", "DE", "South", 67, 147, 3.3, 1.5, 1.0],
    ["District of Columbia", "DC", "South", 55, 172, 2.6, 2.2, 0.7],
    ["Florida", "FL", "South", 63, 156, 2.7, 1.6, 21.0],
    ["Georgia", "GA", "South", 59, 134, 2.5, 1.1, 10.2],
    ["Kentucky", "KY", "South", 64, 94, 3.0, 0.9, 4.3],
    ["Louisiana", "LA", "South", 52, 96, 2.1, 0.6, 4.4],
    ["Maryland", "MD", "South", 66, 163, 3.4, 1.9, 6.0],
    ["Mississippi", "MS", "South", 49, 91, 1.9, 0.5, 2.8],
    ["North Carolina", "NC", "South", 65, 144, 3.1, 1.3, 10.1],
    ["Oklahoma", "OK", "South", 68, 121, 3.2, 0.9, 3.8],
    ["South Carolina", "SC", "South", 62, 129, 2.9, 1.0, 5.0],
    ["Tennessee", "TN", "South", 64, 131, 3.0, 1.1, 6.7],
    ["Texas", "TX", "South", 60, 138, 2.6, 1.2, 28.5],
    ["Virginia", "VA", "South", 71, 157, 3.8, 1.8, 8.3],
    ["West Virginia", "WV", "South", 54, 88, 2.3, 0.5, 1.7],
    // West — Utah/Wyoming recover; Alaska/Montana in-person without e-circ lift
    ["Alaska", "AK", "West", 103, 94, 4.0, 1.0, 0.7],
    ["Arizona", "AZ", "West", 61, 148, 2.8, 1.4, 7.0],
    ["California", "CA", "West", 58, 166, 2.5, 1.9, 38.0],
    ["Colorado", "CO", "West", 74, 161, 4.4, 1.9, 5.6],
    ["Hawaii", "HI", "West", 56, 142, 2.4, 1.3, 1.4],
    ["Idaho", "ID", "West", 80, 135, 5.0, 1.2, 1.8],
    ["Montana", "MT", "West", 104, 97, 5.5, 1.1, 1.1],
    ["Nevada", "NV", "West", 57, 140, 2.3, 1.2, 3.0],
    ["New Mexico", "NM", "West", 59, 94, 2.7, 0.7, 2.0],
    ["Oregon", "OR", "West", 76, 170, 4.6, 2.1, 4.1],
    ["Utah", "UT", "West", 108, 158, 6.2, 1.8, 3.2],
    ["Washington", "WA", "West", 72, 174, 4.2, 2.3, 7.5],
    ["Wyoming", "WY", "West", 105, 122, 6.8, 1.1, 0.6],
  ] as const
).map(([state, abbr, region, visitsIndex, eCircIndex, visitsPerCapita, eCircPerCapita, lsaM]) => ({
  state,
  abbr,
  region,
  visitsIndex,
  eCircIndex,
  visitsPerCapita,
  eCircPerCapita,
  lsaM,
  quadrant: quadrant(visitsIndex, eCircIndex),
  confidence: "estimated" as Confidence,
}));

/** Locale medians — IMLS FY 2023 brief anchors + desk interpolation for visits */
export const LOCALE_ROWS: LocaleRow[] = [
  {
    locale: "City",
    medianVisits2018: 4.6,
    medianVisits2021: 0.5,
    medianVisits2023: 3.1,
    medianECirc2018: 0.69,
    medianECirc2023: 1.31,
    eCircGrowthPct: 90,
    confidence: "disclosed",
  },
  {
    locale: "Suburb",
    medianVisits2018: 4.4,
    medianVisits2021: 0.5,
    medianVisits2023: 3.2,
    medianECirc2018: 0.63,
    medianECirc2023: 1.26,
    eCircGrowthPct: 100,
    confidence: "disclosed",
  },
  {
    locale: "Town",
    medianVisits2018: 4.0,
    medianVisits2021: 0.4,
    medianVisits2023: 2.7,
    medianECirc2018: 0.48,
    medianECirc2023: 0.82,
    eCircGrowthPct: 71,
    confidence: "estimated",
  },
  {
    locale: "Rural",
    medianVisits2018: 3.6,
    medianVisits2021: 0.3,
    medianVisits2023: 2.4,
    medianECirc2018: 0.4,
    medianECirc2023: 0.74,
    eCircGrowthPct: 85,
    confidence: "estimated",
  },
];

export const QUADRANT_MIX = [
  {
    id: "visits-down-ecirc-up" as QuadrantId,
    label: "Visits ↓ · E-circ ↑",
    short: "Substitution path",
    count: STATE_PANEL.filter((s) => s.quadrant === "visits-down-ecirc-up").length,
    color: "#0d9488",
  },
  {
    id: "both-up" as QuadrantId,
    label: "Both ↑",
    short: "Full recovery+",
    count: STATE_PANEL.filter((s) => s.quadrant === "both-up").length,
    color: "#059669",
  },
  {
    id: "both-down" as QuadrantId,
    label: "Both ↓",
    short: "Dual decline",
    count: STATE_PANEL.filter((s) => s.quadrant === "both-down").length,
    color: "#e11d48",
  },
  {
    id: "visits-up-ecirc-down" as QuadrantId,
    label: "Visits ↑ · E-circ ↓",
    short: "In-person only",
    count: STATE_PANEL.filter((s) => s.quadrant === "visits-up-ecirc-down").length,
    color: "#d97706",
  },
];

export const REGION_SUMMARY: RegionSummary[] = (
  ["Northeast", "Midwest", "South", "West"] as RegionId[]
).map((region) => {
  const rows = STATE_PANEL.filter((s) => s.region === region);
  const visits = [...rows].sort((a, b) => a.visitsIndex - b.visitsIndex);
  const ecirc = [...rows].sort((a, b) => a.eCircIndex - b.eCircIndex);
  const mid = Math.floor(rows.length / 2);
  return {
    region,
    states: rows.length,
    dualDecline: rows.filter((s) => s.quadrant === "both-down").length,
    visitsDownEcircUp: rows.filter((s) => s.quadrant === "visits-down-ecirc-up")
      .length,
    bothUp: rows.filter((s) => s.quadrant === "both-up").length,
    medianVisitsIndex:
      rows.length % 2 === 0
        ? (visits[mid - 1].visitsIndex + visits[mid].visitsIndex) / 2
        : visits[mid].visitsIndex,
    medianECircIndex:
      rows.length % 2 === 0
        ? (ecirc[mid - 1].eCircIndex + ecirc[mid].eCircIndex) / 2
        : ecirc[mid].eCircIndex,
  };
});

/** Dual-decline states for callout table */
export const DUAL_DECLINE_STATES = STATE_PANEL.filter(
  (s) => s.quadrant === "both-down",
).sort((a, b) => a.visitsIndex + a.eCircIndex - (b.visitsIndex + b.eCircIndex));

/** Strongest substitution path (visits down, e-circ up) by e-circ lead */
export const TOP_SUBSTITUTION = STATE_PANEL.filter(
  (s) => s.quadrant === "visits-down-ecirc-up",
)
  .map((s) => ({
    ...s,
    gap: s.eCircIndex - s.visitsIndex,
  }))
  .sort((a, b) => b.gap - a.gap)
  .slice(0, 12);

export function fmtIndex(n: number): string {
  return Math.round(n).toString();
}

export function fmtPerCapita(n: number): string {
  return n.toFixed(1);
}

export function fmtPct(n: number): string {
  return `${Math.round(n)}%`;
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtBillion(n: number): string {
  return `${n.toFixed(1)}B`;
}

export function statesByRegion(region: RegionId | "all"): StateRow[] {
  if (region === "all") return STATE_PANEL;
  return STATE_PANEL.filter((s) => s.region === region);
}

export function statesByQuadrant(q: QuadrantId | "all"): StateRow[] {
  if (q === "all") return STATE_PANEL;
  return STATE_PANEL.filter((s) => s.quadrant === q);
}

/** Validate headline counts against panel */
export function assertHeadlineCounts(): void {
  const vDown = STATE_PANEL.filter((s) => s.quadrant === "visits-down-ecirc-up")
    .length;
  const bothDown = STATE_PANEL.filter((s) => s.quadrant === "both-down").length;
  const bothUp = STATE_PANEL.filter((s) => s.quadrant === "both-up").length;
  if (STATE_PANEL.length !== HEADLINE.stateN) {
    throw new Error(`stateN mismatch: ${STATE_PANEL.length}`);
  }
  if (vDown !== HEADLINE.visitsDownEcircUp) {
    throw new Error(`visitsDownEcircUp mismatch: ${vDown}`);
  }
  if (bothDown !== HEADLINE.dualDecline) {
    throw new Error(`dualDecline mismatch: ${bothDown}`);
  }
  if (bothUp !== HEADLINE.bothUp) {
    throw new Error(`bothUp mismatch: ${bothUp}`);
  }
}

// Sync headline counts from live panel (build-time sanity)
const _vDown = STATE_PANEL.filter((s) => s.quadrant === "visits-down-ecirc-up")
  .length;
const _bothDown = STATE_PANEL.filter((s) => s.quadrant === "both-down").length;
const _bothUp = STATE_PANEL.filter((s) => s.quadrant === "both-up").length;
if (
  STATE_PANEL.length !== 51 ||
  _vDown !== HEADLINE.visitsDownEcircUp ||
  _bothDown !== HEADLINE.dualDecline ||
  _bothUp !== HEADLINE.bothUp
) {
  // Soft note for agents: adjust HEADLINE if panel edits change counts
  console.warn(
    `[imls-library-visits] panel counts: n=${STATE_PANEL.length} sub=${_vDown} dual=${_bothDown} bothUp=${_bothUp}`,
  );
}
