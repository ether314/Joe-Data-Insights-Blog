/**
 * US NEVI corridor gaps (2026).
 *
 * Core question: What share of designated AFC mileage still lacks a qualifying
 * DC-fast pair, and which states dominate the remaining gaps?
 *
 * Perimeter: FHWA Alternative Fuel Corridor (AFC) designations (Rounds 1–8);
 * Joint Office NEVI annual report AFC mileage; DOE AFDC corridor / station
 * inventory used to score “NEVI-creditable” DCFC pairs (4 ports, ≥150 kW
 * simultaneous capability class, ≤50 mi spacing, ≤1 mi from corridor —
 * the pre–Aug 2025 planning benchmark still used here as the gap yardstick).
 *
 * Headline: Unqualified AFC miles — the share of designated EV AFC mileage
 * without a NEVI-creditable DC-fast pair under the 50-mile / 1-mile rule.
 */

export type Confidence = "disclosed" | "estimated" | "constructed";

export const SOURCE_NOTE =
  "AFC mileage anchors: Joint Office NEVI Annual Report (Plan Year 2023–2024) ~81,000 EV AFC miles through Round 7; Atlas EV Hub / state plan digests cite ~81,700 AFC miles across Rounds 1–7. Round 8 (2024) designations add corridor-ready and corridor-pending segments (FHWA). “Qualifying DC-fast pair” here means stations that meet the NEVI minimum-standards class used for corridor build-out scoring before the Aug 11, 2025 Interim Final Guidance relaxed mandatory 50-mile spacing: typically ≥4 DC ports, ≥150 kW per port with simultaneous power, within 1 mile of the AFC, and spaced so consecutive creditable sites are ≤50 miles. FHWA “Corridor-Ready” EV signage status is a looser designation and is NOT treated as NEVI-creditable. National and state gap miles are desk constructions that overlay AFDC public DCFC inventory attributes onto FHWA AFC centerlines; they are not an FHWA certified build-out table. Aug 2025 guidance lets states redefine spacing for fully-built-out certification — this dashboard keeps the 50-mile benchmark so gaps remain comparable across states.";

export const SOURCES = [
  {
    label: "Joint Office — NEVI Formula Program Annual Report (Plan Year 2023–2024)",
    url: "https://driveelectric.gov/files/nevi-annual-report-2023-2024.pdf",
  },
  {
    label: "FHWA — Alternative Fuel Corridors (Round 8 designations)",
    url: "https://www.fhwa.dot.gov/environment/alternative_fuel_corridors/",
  },
  {
    label: "FHWA — Corridor-Pending EV segments (Round 8)",
    url: "https://www.fhwa.dot.gov/environment/alternative_fuel_corridors/pending/",
  },
  {
    label: "FHWA — NEVI Formula Program Interim Final Guidance (Aug 11, 2025)",
    url: "https://www.fhwa.dot.gov/environment/nevi/resources/NEVI-Interim-Final-Program-Guidance-8-11-2025.pdf",
  },
  {
    label: "DOE AFDC — Alternative Fuel Corridors mapping tool",
    url: "https://afdc.energy.gov/stations/corridors",
  },
  {
    label: "DOE AFDC — electric charging infrastructure trends",
    url: "https://afdc.energy.gov/fuels/electricity-infrastructure-trends",
  },
] as const;

/** Joint Office / Atlas disclosed AFC EV-mile anchor (Rounds 1–7 ~81k; digests ~81.7k) */
export const AFC_MILES_ANCHOR = 81_700;

function sumField(rows: { afcMiles: number; qualifiedMiles: number; gapMiles: number }[]) {
  return rows.reduce(
    (a, r) => {
      a.afcMiles += r.afcMiles;
      a.qualifiedMiles += r.qualifiedMiles;
      a.gapMiles += r.gapMiles;
      return a;
    },
    { afcMiles: 0, qualifiedMiles: 0, gapMiles: 0 },
  );
}

export type RegionId = "Northeast" | "Midwest" | "South" | "West";

export type StateGapRow = {
  state: string;
  abbr: string;
  region: RegionId;
  /** Designated EV AFC miles in state */
  afcMiles: number;
  /** Miles covered by NEVI-creditable pairs (50-mi rule) */
  qualifiedMiles: number;
  /** Unqualified / gap miles */
  gapMiles: number;
  /** Gap share of state AFC (%) */
  gapSharePct: number;
  /** AFDC public DC Fast ports (approx early 2026) */
  afdcDcFastPorts: number;
  /** FHWA Corridor-Ready EV miles (signage class; looser than NEVI) */
  fhwaReadyMiles: number;
  /** FHWA Corridor-Pending EV miles */
  fhwaPendingMiles: number;
  /** Fully built-out certification status */
  fboStatus: "certified" | "approaching" | "open";
  confidence: Confidence;
};

/**
 * State panel — AFC miles scaled to ~81,700 national total.
 * Gap miles are constructed: AFDC NEVI-class DCFC overlay on AFC mileage.
 * AFDC port counts are rounded AFDC state locator snapshots (~early 2026).
 * FHWA Ready/Pending split approximates Round 8 EV designation status.
 */
export const STATE_GAPS: StateGapRow[] = [
  { state: "Texas", abbr: "TX", region: "South", afcMiles: 6200, qualifiedMiles: 2680, gapMiles: 3520, gapSharePct: 56.8, afdcDcFastPorts: 6200, fhwaReadyMiles: 4100, fhwaPendingMiles: 2100, fboStatus: "open", confidence: "constructed" },
  { state: "California", abbr: "CA", region: "West", afcMiles: 5800, qualifiedMiles: 3480, gapMiles: 2320, gapSharePct: 40.0, afdcDcFastPorts: 14800, fhwaReadyMiles: 4900, fhwaPendingMiles: 900, fboStatus: "approaching", confidence: "constructed" },
  { state: "Montana", abbr: "MT", region: "West", afcMiles: 2100, qualifiedMiles: 420, gapMiles: 1680, gapSharePct: 80.0, afdcDcFastPorts: 210, fhwaReadyMiles: 700, fhwaPendingMiles: 1400, fboStatus: "open", confidence: "constructed" },
  { state: "New Mexico", abbr: "NM", region: "West", afcMiles: 1950, qualifiedMiles: 585, gapMiles: 1365, gapSharePct: 70.0, afdcDcFastPorts: 380, fhwaReadyMiles: 900, fhwaPendingMiles: 1050, fboStatus: "open", confidence: "constructed" },
  { state: "Nevada", abbr: "NV", region: "West", afcMiles: 1800, qualifiedMiles: 720, gapMiles: 1080, gapSharePct: 60.0, afdcDcFastPorts: 920, fhwaReadyMiles: 1100, fhwaPendingMiles: 700, fboStatus: "open", confidence: "constructed" },
  { state: "Wyoming", abbr: "WY", region: "West", afcMiles: 1400, qualifiedMiles: 350, gapMiles: 1050, gapSharePct: 75.0, afdcDcFastPorts: 140, fhwaReadyMiles: 520, fhwaPendingMiles: 880, fboStatus: "certified", confidence: "constructed" },
  { state: "Oregon", abbr: "OR", region: "West", afcMiles: 2200, qualifiedMiles: 1210, gapMiles: 990, gapSharePct: 45.0, afdcDcFastPorts: 1100, fhwaReadyMiles: 1600, fhwaPendingMiles: 600, fboStatus: "open", confidence: "constructed" },
  { state: "Idaho", abbr: "ID", region: "West", afcMiles: 1600, qualifiedMiles: 640, gapMiles: 960, gapSharePct: 60.0, afdcDcFastPorts: 280, fhwaReadyMiles: 850, fhwaPendingMiles: 750, fboStatus: "open", confidence: "constructed" },
  { state: "Arizona", abbr: "AZ", region: "West", afcMiles: 2400, qualifiedMiles: 1440, gapMiles: 960, gapSharePct: 40.0, afdcDcFastPorts: 2100, fhwaReadyMiles: 1800, fhwaPendingMiles: 600, fboStatus: "open", confidence: "constructed" },
  { state: "Florida", abbr: "FL", region: "South", afcMiles: 3100, qualifiedMiles: 2170, gapMiles: 930, gapSharePct: 30.0, afdcDcFastPorts: 4800, fhwaReadyMiles: 2500, fhwaPendingMiles: 600, fboStatus: "approaching", confidence: "constructed" },
  { state: "Colorado", abbr: "CO", region: "West", afcMiles: 2100, qualifiedMiles: 1260, gapMiles: 840, gapSharePct: 40.0, afdcDcFastPorts: 1400, fhwaReadyMiles: 1500, fhwaPendingMiles: 600, fboStatus: "open", confidence: "constructed" },
  { state: "Minnesota", abbr: "MN", region: "Midwest", afcMiles: 1900, qualifiedMiles: 1140, gapMiles: 760, gapSharePct: 40.0, afdcDcFastPorts: 980, fhwaReadyMiles: 1200, fhwaPendingMiles: 700, fboStatus: "open", confidence: "constructed" },
  { state: "Oklahoma", abbr: "OK", region: "South", afcMiles: 1800, qualifiedMiles: 1080, gapMiles: 720, gapSharePct: 40.0, afdcDcFastPorts: 720, fhwaReadyMiles: 1100, fhwaPendingMiles: 700, fboStatus: "open", confidence: "constructed" },
  { state: "Kansas", abbr: "KS", region: "Midwest", afcMiles: 1600, qualifiedMiles: 880, gapMiles: 720, gapSharePct: 45.0, afdcDcFastPorts: 410, fhwaReadyMiles: 900, fhwaPendingMiles: 700, fboStatus: "open", confidence: "constructed" },
  { state: "Nebraska", abbr: "NE", region: "Midwest", afcMiles: 1400, qualifiedMiles: 700, gapMiles: 700, gapSharePct: 50.0, afdcDcFastPorts: 320, fhwaReadyMiles: 750, fhwaPendingMiles: 650, fboStatus: "open", confidence: "constructed" },
  { state: "South Dakota", abbr: "SD", region: "Midwest", afcMiles: 1200, qualifiedMiles: 480, gapMiles: 720, gapSharePct: 60.0, afdcDcFastPorts: 180, fhwaReadyMiles: 500, fhwaPendingMiles: 700, fboStatus: "open", confidence: "constructed" },
  { state: "North Dakota", abbr: "ND", region: "Midwest", afcMiles: 1100, qualifiedMiles: 385, gapMiles: 715, gapSharePct: 65.0, afdcDcFastPorts: 150, fhwaReadyMiles: 420, fhwaPendingMiles: 680, fboStatus: "open", confidence: "constructed" },
  { state: "Alaska", abbr: "AK", region: "West", afcMiles: 900, qualifiedMiles: 180, gapMiles: 720, gapSharePct: 80.0, afdcDcFastPorts: 60, fhwaReadyMiles: 250, fhwaPendingMiles: 650, fboStatus: "open", confidence: "constructed" },
  { state: "Washington", abbr: "WA", region: "West", afcMiles: 2300, qualifiedMiles: 1610, gapMiles: 690, gapSharePct: 30.0, afdcDcFastPorts: 1900, fhwaReadyMiles: 1900, fhwaPendingMiles: 400, fboStatus: "approaching", confidence: "constructed" },
  { state: "Utah", abbr: "UT", region: "West", afcMiles: 1600, qualifiedMiles: 960, gapMiles: 640, gapSharePct: 40.0, afdcDcFastPorts: 680, fhwaReadyMiles: 1100, fhwaPendingMiles: 500, fboStatus: "certified", confidence: "constructed" },
  { state: "Georgia", abbr: "GA", region: "South", afcMiles: 2200, qualifiedMiles: 1540, gapMiles: 660, gapSharePct: 30.0, afdcDcFastPorts: 2100, fhwaReadyMiles: 1700, fhwaPendingMiles: 500, fboStatus: "approaching", confidence: "constructed" },
  { state: "Illinois", abbr: "IL", region: "Midwest", afcMiles: 2100, qualifiedMiles: 1470, gapMiles: 630, gapSharePct: 30.0, afdcDcFastPorts: 1800, fhwaReadyMiles: 1600, fhwaPendingMiles: 500, fboStatus: "open", confidence: "constructed" },
  { state: "Missouri", abbr: "MO", region: "Midwest", afcMiles: 2000, qualifiedMiles: 1400, gapMiles: 600, gapSharePct: 30.0, afdcDcFastPorts: 1100, fhwaReadyMiles: 1500, fhwaPendingMiles: 500, fboStatus: "open", confidence: "constructed" },
  { state: "Louisiana", abbr: "LA", region: "South", afcMiles: 1500, qualifiedMiles: 900, gapMiles: 600, gapSharePct: 40.0, afdcDcFastPorts: 520, fhwaReadyMiles: 950, fhwaPendingMiles: 550, fboStatus: "open", confidence: "constructed" },
  { state: "Arkansas", abbr: "AR", region: "South", afcMiles: 1400, qualifiedMiles: 840, gapMiles: 560, gapSharePct: 40.0, afdcDcFastPorts: 390, fhwaReadyMiles: 850, fhwaPendingMiles: 550, fboStatus: "open", confidence: "constructed" },
  { state: "Mississippi", abbr: "MS", region: "South", afcMiles: 1300, qualifiedMiles: 780, gapMiles: 520, gapSharePct: 40.0, afdcDcFastPorts: 310, fhwaReadyMiles: 800, fhwaPendingMiles: 500, fboStatus: "open", confidence: "constructed" },
  { state: "Alabama", abbr: "AL", region: "South", afcMiles: 1600, qualifiedMiles: 1120, gapMiles: 480, gapSharePct: 30.0, afdcDcFastPorts: 680, fhwaReadyMiles: 1100, fhwaPendingMiles: 500, fboStatus: "open", confidence: "constructed" },
  { state: "Tennessee", abbr: "TN", region: "South", afcMiles: 1700, qualifiedMiles: 1275, gapMiles: 425, gapSharePct: 25.0, afdcDcFastPorts: 980, fhwaReadyMiles: 1300, fhwaPendingMiles: 400, fboStatus: "approaching", confidence: "constructed" },
  { state: "North Carolina", abbr: "NC", region: "South", afcMiles: 2100, qualifiedMiles: 1680, gapMiles: 420, gapSharePct: 20.0, afdcDcFastPorts: 1600, fhwaReadyMiles: 1700, fhwaPendingMiles: 400, fboStatus: "certified", confidence: "constructed" },
  { state: "Virginia", abbr: "VA", region: "South", afcMiles: 1800, qualifiedMiles: 1440, gapMiles: 360, gapSharePct: 20.0, afdcDcFastPorts: 1700, fhwaReadyMiles: 1500, fhwaPendingMiles: 300, fboStatus: "approaching", confidence: "constructed" },
  { state: "Pennsylvania", abbr: "PA", region: "Northeast", afcMiles: 1900, qualifiedMiles: 1615, gapMiles: 285, gapSharePct: 15.0, afdcDcFastPorts: 2100, fhwaReadyMiles: 1700, fhwaPendingMiles: 200, fboStatus: "certified", confidence: "constructed" },
  { state: "New York", abbr: "NY", region: "Northeast", afcMiles: 2000, qualifiedMiles: 1600, gapMiles: 400, gapSharePct: 20.0, afdcDcFastPorts: 2400, fhwaReadyMiles: 1600, fhwaPendingMiles: 400, fboStatus: "open", confidence: "constructed" },
  { state: "Michigan", abbr: "MI", region: "Midwest", afcMiles: 1800, qualifiedMiles: 1530, gapMiles: 270, gapSharePct: 15.0, afdcDcFastPorts: 1600, fhwaReadyMiles: 1550, fhwaPendingMiles: 250, fboStatus: "certified", confidence: "constructed" },
  { state: "Ohio", abbr: "OH", region: "Midwest", afcMiles: 1700, qualifiedMiles: 1445, gapMiles: 255, gapSharePct: 15.0, afdcDcFastPorts: 1500, fhwaReadyMiles: 1450, fhwaPendingMiles: 250, fboStatus: "certified", confidence: "constructed" },
  { state: "Indiana", abbr: "IN", region: "Midwest", afcMiles: 1400, qualifiedMiles: 1120, gapMiles: 280, gapSharePct: 20.0, afdcDcFastPorts: 900, fhwaReadyMiles: 1100, fhwaPendingMiles: 300, fboStatus: "open", confidence: "constructed" },
  { state: "Wisconsin", abbr: "WI", region: "Midwest", afcMiles: 1500, qualifiedMiles: 1200, gapMiles: 300, gapSharePct: 20.0, afdcDcFastPorts: 980, fhwaReadyMiles: 1200, fhwaPendingMiles: 300, fboStatus: "approaching", confidence: "constructed" },
  { state: "Iowa", abbr: "IA", region: "Midwest", afcMiles: 1300, qualifiedMiles: 910, gapMiles: 390, gapSharePct: 30.0, afdcDcFastPorts: 520, fhwaReadyMiles: 900, fhwaPendingMiles: 400, fboStatus: "open", confidence: "constructed" },
  { state: "Kentucky", abbr: "KY", region: "South", afcMiles: 1300, qualifiedMiles: 975, gapMiles: 325, gapSharePct: 25.0, afdcDcFastPorts: 610, fhwaReadyMiles: 1000, fhwaPendingMiles: 300, fboStatus: "open", confidence: "constructed" },
  { state: "South Carolina", abbr: "SC", region: "South", afcMiles: 1400, qualifiedMiles: 1050, gapMiles: 350, gapSharePct: 25.0, afdcDcFastPorts: 720, fhwaReadyMiles: 1100, fhwaPendingMiles: 300, fboStatus: "open", confidence: "constructed" },
  { state: "West Virginia", abbr: "WV", region: "South", afcMiles: 900, qualifiedMiles: 540, gapMiles: 360, gapSharePct: 40.0, afdcDcFastPorts: 220, fhwaReadyMiles: 550, fhwaPendingMiles: 350, fboStatus: "open", confidence: "constructed" },
  { state: "Maine", abbr: "ME", region: "Northeast", afcMiles: 700, qualifiedMiles: 420, gapMiles: 280, gapSharePct: 40.0, afdcDcFastPorts: 280, fhwaReadyMiles: 450, fhwaPendingMiles: 250, fboStatus: "open", confidence: "constructed" },
  { state: "Vermont", abbr: "VT", region: "Northeast", afcMiles: 450, qualifiedMiles: 383, gapMiles: 67, gapSharePct: 14.9, afdcDcFastPorts: 220, fhwaReadyMiles: 400, fhwaPendingMiles: 50, fboStatus: "certified", confidence: "constructed" },
  { state: "New Hampshire", abbr: "NH", region: "Northeast", afcMiles: 500, qualifiedMiles: 375, gapMiles: 125, gapSharePct: 25.0, afdcDcFastPorts: 260, fhwaReadyMiles: 400, fhwaPendingMiles: 100, fboStatus: "open", confidence: "constructed" },
  { state: "Massachusetts", abbr: "MA", region: "Northeast", afcMiles: 700, qualifiedMiles: 595, gapMiles: 105, gapSharePct: 15.0, afdcDcFastPorts: 1400, fhwaReadyMiles: 620, fhwaPendingMiles: 80, fboStatus: "approaching", confidence: "constructed" },
  { state: "Connecticut", abbr: "CT", region: "Northeast", afcMiles: 450, qualifiedMiles: 383, gapMiles: 67, gapSharePct: 14.9, afdcDcFastPorts: 620, fhwaReadyMiles: 400, fhwaPendingMiles: 50, fboStatus: "approaching", confidence: "constructed" },
  { state: "Rhode Island", abbr: "RI", region: "Northeast", afcMiles: 180, qualifiedMiles: 180, gapMiles: 0, gapSharePct: 0, afdcDcFastPorts: 180, fhwaReadyMiles: 180, fhwaPendingMiles: 0, fboStatus: "certified", confidence: "estimated" },
  { state: "Maryland", abbr: "MD", region: "Northeast", afcMiles: 700, qualifiedMiles: 595, gapMiles: 105, gapSharePct: 15.0, afdcDcFastPorts: 980, fhwaReadyMiles: 600, fhwaPendingMiles: 100, fboStatus: "approaching", confidence: "constructed" },
  { state: "New Jersey", abbr: "NJ", region: "Northeast", afcMiles: 650, qualifiedMiles: 553, gapMiles: 97, gapSharePct: 14.9, afdcDcFastPorts: 1200, fhwaReadyMiles: 550, fhwaPendingMiles: 100, fboStatus: "approaching", confidence: "constructed" },
  { state: "Delaware", abbr: "DE", region: "Northeast", afcMiles: 220, qualifiedMiles: 187, gapMiles: 33, gapSharePct: 15.0, afdcDcFastPorts: 220, fhwaReadyMiles: 190, fhwaPendingMiles: 30, fboStatus: "approaching", confidence: "constructed" },
  { state: "Hawaii", abbr: "HI", region: "West", afcMiles: 350, qualifiedMiles: 175, gapMiles: 175, gapSharePct: 50.0, afdcDcFastPorts: 340, fhwaReadyMiles: 200, fhwaPendingMiles: 150, fboStatus: "open", confidence: "constructed" },
];

const _nat = sumField(STATE_GAPS);
const _top5Gap = [...STATE_GAPS]
  .sort((a, b) => b.gapMiles - a.gapMiles)
  .slice(0, 5)
  .reduce((a, r) => a + r.gapMiles, 0);

export const HEADLINE = {
  afcMilesNational: _nat.afcMiles,
  qualifiedMiles: _nat.qualifiedMiles,
  unqualifiedMiles: _nat.gapMiles,
  unqualifiedSharePct: Math.round((_nat.gapMiles / _nat.afcMiles) * 1000) / 10,
  qualifiedSharePct: Math.round((_nat.qualifiedMiles / _nat.afcMiles) * 1000) / 10,
  stationsNeededLow: 1000,
  stationsNeededHigh: 1500,
  top5GapSharePct: Math.round((_top5Gap / _nat.gapMiles) * 1000) / 10,
  fboCertifiedStates: 8,
  afcMilesAnchor: AFC_MILES_ANCHOR,
  confidence: "constructed" as Confidence,
} as const;

export type RegionRollup = {
  region: RegionId;
  afcMiles: number;
  qualifiedMiles: number;
  gapMiles: number;
  gapSharePct: number;
  stateCount: number;
};

export function regionRollup(rows: StateGapRow[] = STATE_GAPS): RegionRollup[] {
  const map = new Map<RegionId, RegionRollup>();
  for (const r of rows) {
    const cur = map.get(r.region) ?? {
      region: r.region,
      afcMiles: 0,
      qualifiedMiles: 0,
      gapMiles: 0,
      gapSharePct: 0,
      stateCount: 0,
    };
    cur.afcMiles += r.afcMiles;
    cur.qualifiedMiles += r.qualifiedMiles;
    cur.gapMiles += r.gapMiles;
    cur.stateCount += 1;
    map.set(r.region, cur);
  }
  return [...map.values()].map((r) => ({
    ...r,
    gapSharePct: r.afcMiles ? Math.round((r.gapMiles / r.afcMiles) * 1000) / 10 : 0,
  }));
}

export const REGION_ROLLUP = regionRollup();

/** National coverage mix for pie / donut */
export const COVERAGE_MIX = [
  { id: "qualified", label: "NEVI-creditable coverage", miles: HEADLINE.qualifiedMiles, sharePct: HEADLINE.qualifiedSharePct },
  { id: "unqualified", label: "Unqualified AFC miles", miles: HEADLINE.unqualifiedMiles, sharePct: HEADLINE.unqualifiedSharePct },
] as const;

export type GapBucket = {
  bucket: string;
  /** Gap share band */
  minPct: number;
  maxPct: number;
  states: number;
  gapMiles: number;
  afcMiles: number;
};

export const GAP_BUCKETS: GapBucket[] = [
  { bucket: "0–20% gap", minPct: 0, maxPct: 20, states: 0, gapMiles: 0, afcMiles: 0 },
  { bucket: "20–40% gap", minPct: 20, maxPct: 40, states: 0, gapMiles: 0, afcMiles: 0 },
  { bucket: "40–60% gap", minPct: 40, maxPct: 60, states: 0, gapMiles: 0, afcMiles: 0 },
  { bucket: "60%+ gap", minPct: 60, maxPct: 100, states: 0, gapMiles: 0, afcMiles: 0 },
].map((b) => {
  const rows = STATE_GAPS.filter((s) => s.gapSharePct >= b.minPct && s.gapSharePct < (b.maxPct === 100 ? 101 : b.maxPct));
  return {
    ...b,
    states: rows.length,
    gapMiles: rows.reduce((a, r) => a + r.gapMiles, 0),
    afcMiles: rows.reduce((a, r) => a + r.afcMiles, 0),
  };
});

export type BuildoutStage = {
  stage: string;
  year: number;
  /** Cumulative AFC miles designated */
  afcMiles: number;
  /** Cumulative miles with NEVI-creditable coverage (desk) */
  qualifiedMiles: number;
  /** Operational NEVI-funded sites (tracker / Joint Office path) */
  neviSitesOpen: number;
  confidence: Confidence;
};

/** Build-out path — AFC miles disclosed; qualified/open sites estimated */
export const BUILDOUT_PATH: BuildoutStage[] = [
  { stage: "Round 5", year: 2021, afcMiles: 55_000, qualifiedMiles: 18_000, neviSitesOpen: 0, confidence: "estimated" },
  { stage: "Round 6", year: 2022, afcMiles: 75_000, qualifiedMiles: 24_000, neviSitesOpen: 0, confidence: "estimated" },
  { stage: "Round 7", year: 2023, afcMiles: 81_000, qualifiedMiles: 31_000, neviSitesOpen: 8, confidence: "estimated" },
  { stage: "Mid-2024", year: 2024, afcMiles: 81_000, qualifiedMiles: 36_500, neviSitesOpen: 61, confidence: "estimated" },
  { stage: "Mid-2025", year: 2025, afcMiles: 81_700, qualifiedMiles: 39_800, neviSitesOpen: 120, confidence: "estimated" },
  { stage: "Mid-2026", year: 2026, afcMiles: HEADLINE.afcMilesNational, qualifiedMiles: HEADLINE.qualifiedMiles, neviSitesOpen: 200, confidence: "constructed" },
];

export type FailureMode = {
  mode: string;
  /** Share of unqualified segment-miles attributable (desk attribution) */
  sharePct: number;
  note: string;
};

/** Why a corridor mile fails the qualifying-pair test */
export const FAILURE_MODES: FailureMode[] = [
  { mode: "Spacing >50 mi", sharePct: 38, note: "No consecutive NEVI-class pair within 50 miles along the AFC." },
  { mode: "Power / ports short", sharePct: 27, note: "DCFC present but <4 ports or below 150 kW simultaneous class." },
  { mode: ">1 mi from AFC", sharePct: 14, note: "Stations exist but sit outside the 1-mile corridor buffer." },
  { mode: "Connector / access", sharePct: 12, note: "Non-CCS-dominant or restricted access that fails creditable criteria." },
  { mode: "Uptime / incomplete", sharePct: 9, note: "Awarded or under-construction sites not yet operationally creditable." },
];

export type ScatterRow = {
  abbr: string;
  gapSharePct: number;
  gapMiles: number;
  afdcDcFastPorts: number;
  region: RegionId;
};

export const SCATTER: ScatterRow[] = STATE_GAPS.map((s) => ({
  abbr: s.abbr,
  gapSharePct: s.gapSharePct,
  gapMiles: s.gapMiles,
  afdcDcFastPorts: s.afdcDcFastPorts,
  region: s.region,
}));

export function topGapStates(n = 12, rows: StateGapRow[] = STATE_GAPS): StateGapRow[] {
  return [...rows].sort((a, b) => b.gapMiles - a.gapMiles).slice(0, n);
}

export function filterByRegion(
  region: RegionId | "all",
  rows: StateGapRow[] = STATE_GAPS,
): StateGapRow[] {
  if (region === "all") return rows;
  return rows.filter((r) => r.region === region);
}

export const ANALYTICS = {
  nationalGapSharePct: HEADLINE.unqualifiedSharePct,
  top5GapMiles: topGapStates(5).reduce((a, r) => a + r.gapMiles, 0),
  westGapSharePct: REGION_ROLLUP.find((r) => r.region === "West")?.gapSharePct ?? 0,
  westGapMiles: REGION_ROLLUP.find((r) => r.region === "West")?.gapMiles ?? 0,
  fboCertified: STATE_GAPS.filter((s) => s.fboStatus === "certified").length,
  meanGapSharePct:
    Math.round(
      (STATE_GAPS.reduce((a, r) => a + r.gapSharePct, 0) / STATE_GAPS.length) * 10,
    ) / 10,
} as const;
