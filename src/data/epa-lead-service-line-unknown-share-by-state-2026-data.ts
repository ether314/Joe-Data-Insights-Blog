/**
 * EPA LCRR / LCRI service-line inventories — unknown-material share by state (2026).
 *
 * Core question: What share of service-line inventories is still 'unknown material',
 * and which states dominate the remaining confirmed lead (LSL + GRR) count?
 *
 * Anchors: EPA SDWIS Service Line Inventory dashboard (late-2025 national release
 * tied to FY25/FY26 LSLR allotments); Environmental Policy Innovation Center
 * national aggregates (Dec 2025 download); Unleaded Kids state/system rollups of
 * the same dashboard; California State Water Board statewide inventory table;
 * EPA FY25–FY26 LSLR allotment methodology memo (unknowns prorated by state
 * known lead:known-material ratios).
 *
 * State rows mix published dashboard rollups (confidence: "epa") with desk
 * composites that preserve national totals and published qualitative bands
 * (confidence: "composite"). Not a substitute for the live SDWIS report.
 */

export const SOURCE_NOTE =
  "National counts follow EPA SDWIS Service Line Inventory reporting as summarized by EPIC (Dec 1, 2025 download): ~73.0M non-lead, ~23.5M unknown, ~1.97M lead, ~0.97M galvanized requiring replacement (GRR). Top-ten state projected LSL+GRR, reported lead+GRR, unknown, and total lines follow Unleaded Kids rollups of the same EPA dashboard (Dec 2025). California material mix follows the State Water Resources Control Board accepted-inventory table. EPA projects ~4M LSL+GRR nationally (~3M confirmed + ~1M of unknowns). Remaining state rows are desk composites scaled to national leftovers and EPIC coverage bands (≥90% identified: OR/AK/CA/CO/WA; <50% identified: NM/PA). Non-lead reporting to EPA was optional until Nov 2027 — Maryland and New Hampshire gaps are noted in sources.";

export const SOURCES = [
  {
    label: "EPA SDWIS — Service Line Inventory dashboard",
    url: "https://sdwis.epa.gov/ords/sfdw_pub/r/sfdw/sdwis_fed_reports_public/service-line-inventory",
  },
  {
    label: "EPIC — What best available data tells us about lead service lines",
    url: "https://www.policyinnovation.org/insights/what-best-available-data-tells-us-about-lead-service-lines",
  },
  {
    label: "Unleaded Kids — EPA dashboard & 4M LSL estimate",
    url: "https://unleadedkids.org/service-line-dashboard-sls-estimated/2025/12/18/",
  },
  {
    label: "EPA — FY25/FY26 LSLR allotments inventory methodology",
    url: "https://www.epa.gov/system/files/documents/2025-01/fy25-and-fy26-lslr-allotments_01172025_0.pdf",
  },
  {
    label: "California State Water Board — statewide service line inventory",
    url: "https://www.waterboards.ca.gov/lead-copper-rule/service-line-data.html",
  },
] as const;

/** Headline punchline figures (thousands where noted) */
export const HEADLINE = {
  unknownLinesM: 23.5,
  unknownSharePct: 23.7,
  confirmedLeadGrrM: 2.94,
  projectedLeadGrrM: 4.0,
  nonLeadM: 73.0,
  systemsReportingK: 57.0,
  top10UnknownShareOfNationalPct: 43,
  paUnknownM: 2.34,
  txUnknownM: 2.29,
  ilProjectedLeadGrrK: 632,
  statesOver30PctUnknown: 17,
  highIdStates: 5,
  /** Share of national confirmed lead+GRR in top 10 projected states */
  top10ConfirmedSharePct: 61,
} as const;

export type Confidence = "epa" | "state" | "composite";
export type CensusRegion =
  | "Northeast"
  | "Midwest"
  | "South"
  | "West";

export type StateInventory = {
  state: string;
  abbr: string;
  region: CensusRegion;
  /** Reported lead service lines (thousands) */
  leadK: number;
  /** Galvanized requiring replacement (thousands) */
  grrK: number;
  /** Lead-status unknown (thousands) */
  unknownK: number;
  /** Non-lead (thousands); may be undercount where optional reporting lagged */
  nonLeadK: number;
  /** EPA-style projected LSL+GRR including proration of unknowns (thousands) */
  projectedLeadGrrK: number;
  confidence: Confidence;
};

/**
 * State inventory panel. Counts in thousands of service lines.
 * Totals ≈ national EPIC/EPA aggregates when summed across the panel.
 */
export const STATE_INVENTORY: StateInventory[] = [
  // —— Top projected burden (Unleaded Kids / EPA dashboard) ——
  {
    state: "Illinois",
    abbr: "IL",
    region: "Midwest",
    leadK: 390,
    grrK: 87,
    unknownK: 939,
    nonLeadK: 2423,
    projectedLeadGrrK: 632,
    confidence: "epa",
  },
  {
    state: "Ohio",
    abbr: "OH",
    region: "Midwest",
    leadK: 248,
    grrK: 73,
    unknownK: 867,
    nonLeadK: 2416,
    projectedLeadGrrK: 407,
    confidence: "epa",
  },
  {
    state: "New York",
    abbr: "NY",
    region: "Northeast",
    leadK: 220,
    grrK: 70,
    unknownK: 948,
    nonLeadK: 2540,
    projectedLeadGrrK: 383,
    confidence: "epa",
  },
  {
    state: "Michigan",
    abbr: "MI",
    region: "Midwest",
    leadK: 198,
    grrK: 61,
    unknownK: 315,
    nonLeadK: 2037,
    projectedLeadGrrK: 294,
    confidence: "epa",
  },
  {
    state: "Pennsylvania",
    abbr: "PA",
    region: "Northeast",
    leadK: 78,
    grrK: 31,
    unknownK: 2343,
    nonLeadK: 1401,
    projectedLeadGrrK: 265,
    confidence: "epa",
  },
  {
    state: "Indiana",
    abbr: "IN",
    region: "Midwest",
    leadK: 132,
    grrK: 41,
    unknownK: 708,
    nonLeadK: 1215,
    projectedLeadGrrK: 262,
    confidence: "epa",
  },
  {
    state: "New Jersey",
    abbr: "NJ",
    region: "Northeast",
    leadK: 102,
    grrK: 33,
    unknownK: 861,
    nonLeadK: 1526,
    projectedLeadGrrK: 207,
    confidence: "epa",
  },
  {
    state: "Wisconsin",
    abbr: "WI",
    region: "Midwest",
    leadK: 128,
    grrK: 41,
    unknownK: 208,
    nonLeadK: 1060,
    projectedLeadGrrK: 193,
    confidence: "epa",
  },
  {
    state: "Texas",
    abbr: "TX",
    region: "South",
    leadK: 86,
    grrK: 28,
    unknownK: 2292,
    nonLeadK: 6942,
    projectedLeadGrrK: 144,
    confidence: "epa",
  },
  {
    state: "Missouri",
    abbr: "MO",
    region: "Midwest",
    leadK: 48,
    grrK: 18,
    unknownK: 965,
    nonLeadK: 1146,
    projectedLeadGrrK: 117,
    confidence: "epa",
  },
  // —— High-identification West (EPIC ≥90% identified) ——
  {
    state: "California",
    abbr: "CA",
    region: "West",
    leadK: 0,
    grrK: 12.1,
    unknownK: 588,
    nonLeadK: 9396,
    projectedLeadGrrK: 18,
    confidence: "state",
  },
  {
    state: "Washington",
    abbr: "WA",
    region: "West",
    leadK: 4,
    grrK: 3,
    unknownK: 145,
    nonLeadK: 2480,
    projectedLeadGrrK: 9,
    confidence: "composite",
  },
  {
    state: "Oregon",
    abbr: "OR",
    region: "West",
    leadK: 2,
    grrK: 2,
    unknownK: 95,
    nonLeadK: 1680,
    projectedLeadGrrK: 5,
    confidence: "composite",
  },
  {
    state: "Colorado",
    abbr: "CO",
    region: "West",
    leadK: 18,
    grrK: 8,
    unknownK: 160,
    nonLeadK: 2140,
    projectedLeadGrrK: 32,
    confidence: "composite",
  },
  {
    state: "Alaska",
    abbr: "AK",
    region: "West",
    leadK: 0.5,
    grrK: 0.4,
    unknownK: 18,
    nonLeadK: 265,
    projectedLeadGrrK: 1,
    confidence: "composite",
  },
  // —— Low-identification / high-unknown ——
  {
    state: "New Mexico",
    abbr: "NM",
    region: "West",
    leadK: 6,
    grrK: 4,
    unknownK: 420,
    nonLeadK: 380,
    projectedLeadGrrK: 22,
    confidence: "composite",
  },
  // —— Additional Midwestern / Northeastern lead-burden states (EPIC 5–13% band) ——
  {
    state: "Iowa",
    abbr: "IA",
    region: "Midwest",
    leadK: 42,
    grrK: 18,
    unknownK: 310,
    nonLeadK: 890,
    projectedLeadGrrK: 78,
    confidence: "composite",
  },
  {
    state: "Minnesota",
    abbr: "MN",
    region: "Midwest",
    leadK: 55,
    grrK: 22,
    unknownK: 280,
    nonLeadK: 1520,
    projectedLeadGrrK: 92,
    confidence: "composite",
  },
  {
    state: "Kansas",
    abbr: "KS",
    region: "Midwest",
    leadK: 28,
    grrK: 14,
    unknownK: 340,
    nonLeadK: 780,
    projectedLeadGrrK: 58,
    confidence: "composite",
  },
  {
    state: "Nebraska",
    abbr: "NE",
    region: "Midwest",
    leadK: 22,
    grrK: 16,
    unknownK: 210,
    nonLeadK: 620,
    projectedLeadGrrK: 48,
    confidence: "composite",
  },
  {
    state: "Rhode Island",
    abbr: "RI",
    region: "Northeast",
    leadK: 28,
    grrK: 9,
    unknownK: 95,
    nonLeadK: 280,
    projectedLeadGrrK: 48,
    confidence: "composite",
  },
  // —— Large southern / mid-Atlantic inventories ——
  {
    state: "Florida",
    abbr: "FL",
    region: "South",
    leadK: 22,
    grrK: 12,
    unknownK: 1180,
    nonLeadK: 6200,
    projectedLeadGrrK: 48,
    confidence: "composite",
  },
  {
    state: "Georgia",
    abbr: "GA",
    region: "South",
    leadK: 18,
    grrK: 10,
    unknownK: 720,
    nonLeadK: 3100,
    projectedLeadGrrK: 42,
    confidence: "composite",
  },
  {
    state: "North Carolina",
    abbr: "NC",
    region: "South",
    leadK: 16,
    grrK: 9,
    unknownK: 680,
    nonLeadK: 3400,
    projectedLeadGrrK: 36,
    confidence: "composite",
  },
  {
    state: "Virginia",
    abbr: "VA",
    region: "South",
    leadK: 14,
    grrK: 8,
    unknownK: 520,
    nonLeadK: 2680,
    projectedLeadGrrK: 32,
    confidence: "composite",
  },
  {
    state: "Louisiana",
    abbr: "LA",
    region: "South",
    leadK: 24,
    grrK: 11,
    unknownK: 410,
    nonLeadK: 980,
    projectedLeadGrrK: 55,
    confidence: "composite",
  },
  {
    state: "Maryland",
    abbr: "MD",
    region: "South",
    leadK: 35,
    grrK: 14,
    unknownK: 380,
    nonLeadK: 1680,
    projectedLeadGrrK: 68,
    confidence: "composite",
  },
  {
    state: "Massachusetts",
    abbr: "MA",
    region: "Northeast",
    leadK: 48,
    grrK: 16,
    unknownK: 420,
    nonLeadK: 1880,
    projectedLeadGrrK: 88,
    confidence: "composite",
  },
  {
    state: "Connecticut",
    abbr: "CT",
    region: "Northeast",
    leadK: 32,
    grrK: 12,
    unknownK: 280,
    nonLeadK: 980,
    projectedLeadGrrK: 58,
    confidence: "composite",
  },
  {
    state: "Arizona",
    abbr: "AZ",
    region: "West",
    leadK: 8,
    grrK: 5,
    unknownK: 520,
    nonLeadK: 2480,
    projectedLeadGrrK: 18,
    confidence: "composite",
  },
  {
    state: "Tennessee",
    abbr: "TN",
    region: "South",
    leadK: 12,
    grrK: 7,
    unknownK: 290,
    nonLeadK: 2100,
    projectedLeadGrrK: 26,
    confidence: "composite",
  },
  {
    state: "Alabama",
    abbr: "AL",
    region: "South",
    leadK: 10,
    grrK: 14,
    unknownK: 340,
    nonLeadK: 1480,
    projectedLeadGrrK: 32,
    confidence: "composite",
  },
  {
    state: "Mississippi",
    abbr: "MS",
    region: "South",
    leadK: 8,
    grrK: 9,
    unknownK: 260,
    nonLeadK: 820,
    projectedLeadGrrK: 24,
    confidence: "composite",
  },
  {
    state: "Oklahoma",
    abbr: "OK",
    region: "South",
    leadK: 9,
    grrK: 6,
    unknownK: 380,
    nonLeadK: 1180,
    projectedLeadGrrK: 22,
    confidence: "composite",
  },
  {
    state: "Arkansas",
    abbr: "AR",
    region: "South",
    leadK: 7,
    grrK: 5,
    unknownK: 310,
    nonLeadK: 920,
    projectedLeadGrrK: 18,
    confidence: "composite",
  },
  {
    state: "Kentucky",
    abbr: "KY",
    region: "South",
    leadK: 14,
    grrK: 8,
    unknownK: 360,
    nonLeadK: 1180,
    projectedLeadGrrK: 34,
    confidence: "composite",
  },
  {
    state: "West Virginia",
    abbr: "WV",
    region: "South",
    leadK: 11,
    grrK: 6,
    unknownK: 220,
    nonLeadK: 520,
    projectedLeadGrrK: 26,
    confidence: "composite",
  },
  {
    state: "Hawaii",
    abbr: "HI",
    region: "West",
    leadK: 0.2,
    grrK: 0.3,
    unknownK: 42,
    nonLeadK: 420,
    projectedLeadGrrK: 1,
    confidence: "composite",
  },
  {
    state: "Montana",
    abbr: "MT",
    region: "West",
    leadK: 3,
    grrK: 2,
    unknownK: 55,
    nonLeadK: 380,
    projectedLeadGrrK: 6,
    confidence: "composite",
  },
  {
    state: "Idaho",
    abbr: "ID",
    region: "West",
    leadK: 2,
    grrK: 1,
    unknownK: 70,
    nonLeadK: 620,
    projectedLeadGrrK: 4,
    confidence: "composite",
  },
];

export type NationalMaterial = {
  material: string;
  linesM: number;
  sharePct: number;
};

export const NATIONAL_MATERIALS: NationalMaterial[] = [
  { material: "Non-lead", linesM: 73.0, sharePct: 73.4 },
  { material: "Unknown", linesM: 23.5, sharePct: 23.7 },
  { material: "Lead", linesM: 1.97, sharePct: 2.0 },
  { material: "GRR", linesM: 0.97, sharePct: 1.0 },
];

/** Vintage path: survey → inventory eras (millions of lines) */
export const INVENTORY_VINTAGE: {
  era: string;
  year: number;
  reportedLeadGrrM: number;
  unknownM: number;
  projectedLeadGrrM: number;
}[] = [
  {
    era: "AWWA '16",
    year: 2016,
    reportedLeadGrrM: 6.1,
    unknownM: 0,
    projectedLeadGrrM: 6.1,
  },
  {
    era: "DWINSA '23",
    year: 2023,
    reportedLeadGrrM: 5.1,
    unknownM: 23.8,
    projectedLeadGrrM: 9.0,
  },
  {
    era: "LCRR '25",
    year: 2025,
    reportedLeadGrrM: 2.94,
    unknownM: 23.5,
    projectedLeadGrrM: 4.0,
  },
];

export type CoverageBand = {
  band: string;
  states: number;
  label: string;
};

export const COVERAGE_BANDS: CoverageBand[] = [
  {
    band: "≥90% identified",
    states: 5,
    label: "OR · AK · CA · CO · WA",
  },
  {
    band: "70–89% identified",
    states: 14,
    label: "Mixed West & South",
  },
  {
    band: "50–69% identified",
    states: 14,
    label: "Many Midwest / Mid-Atlantic",
  },
  {
    band: "<50% identified",
    states: 2,
    label: "NM · PA (panel)",
  },
  {
    band: ">30% unknown",
    states: 17,
    label: "~⅓ of states (EPIC)",
  },
];

export function totalLinesK(s: StateInventory): number {
  return s.leadK + s.grrK + s.unknownK + s.nonLeadK;
}

export function unknownSharePct(s: StateInventory): number {
  const t = totalLinesK(s);
  return t > 0 ? (s.unknownK / t) * 100 : 0;
}

export function confirmedLeadGrrK(s: StateInventory): number {
  return s.leadK + s.grrK;
}

export function leadBurdenPct(s: StateInventory): number {
  const t = totalLinesK(s);
  return t > 0 ? (confirmedLeadGrrK(s) / t) * 100 : 0;
}

/** Ratio of known lead+GRR among known materials (EPA proration base) */
export function knownLeadRatioPct(s: StateInventory): number {
  const known = s.leadK + s.grrK + s.nonLeadK;
  return known > 0 ? (confirmedLeadGrrK(s) / known) * 100 : 0;
}

export function identifiedSharePct(s: StateInventory): number {
  return 100 - unknownSharePct(s);
}

export type SortMetric =
  | "unknownShare"
  | "unknownCount"
  | "projectedLead"
  | "confirmedLead"
  | "leadBurden";

export type RegionFilter = CensusRegion | "All";

export function enrichState(s: StateInventory) {
  return {
    ...s,
    totalK: totalLinesK(s),
    unknownShare: +unknownSharePct(s).toFixed(1),
    identifiedShare: +identifiedSharePct(s).toFixed(1),
    confirmedLeadGrr: +confirmedLeadGrrK(s).toFixed(1),
    leadBurden: +leadBurdenPct(s).toFixed(1),
    knownLeadRatio: +knownLeadRatioPct(s).toFixed(1),
    unknownGapK: +(s.projectedLeadGrrK - confirmedLeadGrrK(s)).toFixed(1),
  };
}

export function sortedStates(
  metric: SortMetric,
  region: RegionFilter,
  limit = 20,
) {
  let rows = STATE_INVENTORY.map(enrichState);
  if (region !== "All") {
    rows = rows.filter((r) => r.region === region);
  }
  const key = (r: ReturnType<typeof enrichState>): number => {
    switch (metric) {
      case "unknownShare":
        return r.unknownShare;
      case "unknownCount":
        return r.unknownK;
      case "projectedLead":
        return r.projectedLeadGrrK;
      case "confirmedLead":
        return r.confirmedLeadGrr;
      case "leadBurden":
        return r.leadBurden;
    }
  };
  return [...rows].sort((a, b) => key(b) - key(a)).slice(0, limit);
}

export function regionRollup() {
  const map = new Map<
    CensusRegion,
    { region: CensusRegion; unknownK: number; confirmedK: number; projectedK: number; totalK: number }
  >();
  for (const s of STATE_INVENTORY) {
    const cur = map.get(s.region) ?? {
      region: s.region,
      unknownK: 0,
      confirmedK: 0,
      projectedK: 0,
      totalK: 0,
    };
    cur.unknownK += s.unknownK;
    cur.confirmedK += confirmedLeadGrrK(s);
    cur.projectedK += s.projectedLeadGrrK;
    cur.totalK += totalLinesK(s);
    map.set(s.region, cur);
  }
  return [...map.values()].map((r) => ({
    ...r,
    unknownShare: +((r.unknownK / r.totalK) * 100).toFixed(1),
  }));
}

export function unknownConcentration() {
  const enriched = STATE_INVENTORY.map(enrichState).sort(
    (a, b) => b.unknownK - a.unknownK,
  );
  const nationalUnknown = enriched.reduce((a, s) => a + s.unknownK, 0);
  let cum = 0;
  return enriched.slice(0, 12).map((s, i) => {
    cum += s.unknownK;
    return {
      rank: i + 1,
      abbr: s.abbr,
      state: s.state,
      unknownK: s.unknownK,
      cumSharePct: +((cum / nationalUnknown) * 100).toFixed(1),
    };
  });
}

export function fmtK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(2)}M`;
  if (n >= 100) return `${Math.round(n)}k`;
  return `${n.toFixed(1)}k`;
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}
