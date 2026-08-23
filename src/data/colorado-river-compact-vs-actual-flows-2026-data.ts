/**
 * Colorado River Compact vs actual flows (2026).
 *
 * Core question: How far do recent basin flows sit below the 1922
 * compact allocations the Southwest still budgets against?
 *
 * Anchors: USBR natural-flow accounting at Lees Ferry (via GCDAMP
 * hydrology tables); Colorado River Compact (1922); Boulder Canyon
 * Project Act (1928) Lower Basin state splits; 1944 US–Mexico Water
 * Treaty; CRS / Reclamation era averages (1906–2024, millennial drought).
 */

export const SOURCE_NOTE =
  "Naturalized Lees Ferry water-year volumes are compiled from Glen Canyon Dam Adaptive Management Program hydrology tables (Reclamation natural-flow accounting). Compact and treaty apportionments are statutory: 1922 Compact (7.5 maf each basin), Boulder Canyon Project Act Lower Basin state splits, and the 1944 Mexico Treaty (1.5 maf). Era averages (1906–2024 ≈ 14.6 maf; 2000–2024 ≈ 12.4 maf; compact-era assumed supply ≈ 16.4 maf) follow Reclamation / CRS published summaries. Upper Basin consumptive-use levels are approximate recent CUL-range figures, not compact entitlements. Gap maths are analytical (desk). Not an operating guideline or legal opinion.";

export const SOURCES = [
  {
    label: "USBR — Colorado River natural flow & salt data",
    url: "https://www.usbr.gov/lc/region/g4000/NaturalFlow/current.html",
  },
  {
    label: "GCDAMP — Upper Colorado hydrology (Lees Ferry naturalized flow)",
    url: "https://gcdamp.com/index.php/Hydrology",
  },
  {
    label: "USBR — Colorado River Compact text",
    url: "https://www.usbr.gov/lc/region/g1000/pdfiles/crcompct.pdf",
  },
  {
    label: "CRS — Management of the Colorado River (R45546)",
    url: "https://www.congress.gov/crs-product/R45546",
  },
  {
    label: "USBR — Post-2026 Colorado River operations (DEIS hydrology)",
    url: "https://www.usbr.gov/ColoradoRiverBasin/post2026/",
  },
] as const;

/** Headline punchline figures (maf unless noted) */
export const HEADLINE = {
  compactAssumedSupplyMaf: 16.4,
  paperClaimsMaf: 16.5,
  upperBasinCompactMaf: 7.5,
  lowerBasinCompactMaf: 7.5,
  mexicoTreatyMaf: 1.5,
  longTermAvg1906_2024Maf: 14.6,
  millennialDroughtAvg2000_2024Maf: 12.4,
  recent10yrAvg2015_2024Maf: 12.6,
  gapVsCompactAssumedMaf: 4.0,
  gapVsCompactAssumedPct: 24.4,
  gapVsPaperClaimsMaf: 4.1,
  upperBasinRecentUseMaf: 4.5,
  lowerBasinStateSumMaf: 7.5,
  leeFerry10yrFloorMaf: 75,
  leeFerry10yrAnnualEquivMaf: 7.5,
} as const;

export type Confidence = "statutory" | "reclamation" | "estimated";

/** Paper claims the Law of the River still budgets against */
export const PAPER_CLAIMS: {
  id: string;
  label: string;
  maf: number;
  confidence: Confidence;
  note: string;
}[] = [
  {
    id: "upper",
    label: "Upper Basin compact",
    maf: 7.5,
    confidence: "statutory",
    note: "1922 Compact Art. III(a)",
  },
  {
    id: "lower",
    label: "Lower Basin compact",
    maf: 7.5,
    confidence: "statutory",
    note: "1922 Compact Art. III(a); BCPA splits among CA/AZ/NV",
  },
  {
    id: "mexico",
    label: "Mexico treaty",
    maf: 1.5,
    confidence: "statutory",
    note: "1944 US–Mexico Water Treaty (shared delivery obligation)",
  },
];

/** Lower Basin fixed state apportionments (BCPA 1928) */
export const LOWER_BASIN_STATES: {
  id: string;
  label: string;
  maf: number;
  sharePct: number;
  priorityNote: string;
}[] = [
  {
    id: "ca",
    label: "California",
    maf: 4.4,
    sharePct: 58.67,
    priorityNote: "Senior among Lower Basin states under shortage priority rules",
  },
  {
    id: "az",
    label: "Arizona",
    maf: 2.8,
    sharePct: 37.33,
    priorityNote: "Junior to California; CAP faces early curtailment tiers",
  },
  {
    id: "nv",
    label: "Nevada",
    maf: 0.3,
    sharePct: 4.0,
    priorityNote: "Smallest Lower Basin share; Southern Nevada highly urban",
  },
];

/** Upper Basin percentage compact (1948) — applied to remaining supply after Lee Ferry duties */
export const UPPER_BASIN_SHARES: {
  id: string;
  label: string;
  sharePct: number;
  note: string;
}[] = [
  { id: "co", label: "Colorado", sharePct: 51.75, note: "1948 Upper Basin Compact %" },
  { id: "ut", label: "Utah", sharePct: 23.0, note: "1948 Upper Basin Compact %" },
  { id: "wy", label: "Wyoming", sharePct: 14.0, note: "1948 Upper Basin Compact %" },
  { id: "nm", label: "New Mexico", sharePct: 11.25, note: "1948 Upper Basin Compact %" },
  {
    id: "az-ub",
    label: "Arizona (UB slice)",
    sharePct: 0.0,
    note: "Fixed 50 kaf entitlement (not a % of remainder)",
  },
];

export const UPPER_BASIN_AZ_FIXED_KAF = 50;

/**
 * Water-year naturalized flow at Lees Ferry (maf).
 * Source: GCDAMP hydrology table (Reclamation natural-flow accounting).
 */
export const LEES_FERRY_NATURAL: {
  year: number;
  naturalMaf: number;
}[] = [
  { year: 1964, naturalMaf: 10.38 },
  { year: 1965, naturalMaf: 18.36 },
  { year: 1966, naturalMaf: 11.06 },
  { year: 1967, naturalMaf: 11.71 },
  { year: 1968, naturalMaf: 13.34 },
  { year: 1969, naturalMaf: 14.45 },
  { year: 1970, naturalMaf: 15.06 },
  { year: 1971, naturalMaf: 14.73 },
  { year: 1972, naturalMaf: 12.44 },
  { year: 1973, naturalMaf: 19.14 },
  { year: 1974, naturalMaf: 12.96 },
  { year: 1975, naturalMaf: 16.53 },
  { year: 1976, naturalMaf: 11.21 },
  { year: 1977, naturalMaf: 5.52 },
  { year: 1978, naturalMaf: 14.85 },
  { year: 1979, naturalMaf: 17.55 },
  { year: 1980, naturalMaf: 17.27 },
  { year: 1981, naturalMaf: 8.68 },
  { year: 1982, naturalMaf: 16.67 },
  { year: 1983, naturalMaf: 23.7 },
  { year: 1984, naturalMaf: 24.18 },
  { year: 1985, naturalMaf: 21.06 },
  { year: 1986, naturalMaf: 22.36 },
  { year: 1987, naturalMaf: 16.61 },
  { year: 1988, naturalMaf: 11.68 },
  { year: 1989, naturalMaf: 9.6 },
  { year: 1990, naturalMaf: 9.0 },
  { year: 1991, naturalMaf: 12.35 },
  { year: 1992, naturalMaf: 11.1 },
  { year: 1993, naturalMaf: 18.63 },
  { year: 1994, naturalMaf: 10.64 },
  { year: 1995, naturalMaf: 19.8 },
  { year: 1996, naturalMaf: 14.07 },
  { year: 1997, naturalMaf: 21.15 },
  { year: 1998, naturalMaf: 16.97 },
  { year: 1999, naturalMaf: 16.43 },
  { year: 2000, naturalMaf: 10.56 },
  { year: 2001, naturalMaf: 11.04 },
  { year: 2002, naturalMaf: 5.93 },
  { year: 2003, naturalMaf: 10.53 },
  { year: 2004, naturalMaf: 9.59 },
  { year: 2005, naturalMaf: 16.89 },
  { year: 2006, naturalMaf: 12.61 },
  { year: 2007, naturalMaf: 12.56 },
  { year: 2008, naturalMaf: 16.21 },
  { year: 2009, naturalMaf: 14.27 },
  { year: 2010, naturalMaf: 12.32 },
  { year: 2011, naturalMaf: 20.16 },
  { year: 2012, naturalMaf: 8.5 },
  { year: 2013, naturalMaf: 9.11 },
  { year: 2014, naturalMaf: 13.98 },
  { year: 2015, naturalMaf: 13.41 },
  { year: 2016, naturalMaf: 13.44 },
  { year: 2017, naturalMaf: 16.4 },
  { year: 2018, naturalMaf: 8.63 },
  { year: 2019, naturalMaf: 17.67 },
  { year: 2020, naturalMaf: 9.89 },
  { year: 2021, naturalMaf: 7.15 },
  { year: 2022, naturalMaf: 9.85 },
  { year: 2023, naturalMaf: 17.41 },
  { year: 2024, naturalMaf: 11.88 },
  { year: 2025, naturalMaf: 8.5 },
];

/** Published era averages for comparison panels */
export const ERA_AVERAGES: {
  id: string;
  label: string;
  maf: number;
  kind: "assumed" | "observed" | "claim";
}[] = [
  {
    id: "compact-assumed",
    label: "Compact-era assumed supply",
    maf: 16.4,
    kind: "assumed",
  },
  {
    id: "paper-claims",
    label: "Paper claims (UB+LB+MX)",
    maf: 16.5,
    kind: "claim",
  },
  {
    id: "long-term",
    label: "1906–2024 natural avg",
    maf: 14.6,
    kind: "observed",
  },
  {
    id: "stress-test",
    label: "1988–2024 stress-test avg",
    maf: 13.0,
    kind: "observed",
  },
  {
    id: "millennial",
    label: "2000–2024 millennial drought",
    maf: 12.4,
    kind: "observed",
  },
  {
    id: "recent10",
    label: "2015–2024 10-yr avg",
    maf: 12.6,
    kind: "observed",
  },
];

/** Basin-side use vs entitlement (illustrative recent levels) */
export const USE_VS_ENTITLEMENT: {
  id: string;
  label: string;
  entitlementMaf: number;
  recentUseMaf: number;
  note: string;
}[] = [
  {
    id: "upper",
    label: "Upper Basin",
    entitlementMaf: 7.5,
    recentUseMaf: 4.5,
    note: "~4.5 maf recent consumptive use; holds Lee Ferry non-depletion duty",
  },
  {
    id: "lower",
    label: "Lower Basin states",
    entitlementMaf: 7.5,
    recentUseMaf: 7.0,
    note: "Near-full take of 7.5 maf before shortage tiers / ICS / ICS-like cuts",
  },
  {
    id: "mexico",
    label: "Mexico delivery",
    entitlementMaf: 1.5,
    recentUseMaf: 1.5,
    note: "Treaty delivery; Minute 323 flexibility in extreme shortage years",
  },
];

export type FlowWindow = "all" | "from1990" | "from2000" | "from2015";

export function filterFlows(window: FlowWindow) {
  const min =
    window === "from2015" ? 2015 : window === "from2000" ? 2000 : window === "from1990" ? 1990 : 1964;
  return LEES_FERRY_NATURAL.filter((r) => r.year >= min);
}

export function meanNatural(window: FlowWindow): number {
  const rows = filterFlows(window);
  if (!rows.length) return 0;
  return rows.reduce((s, r) => s + r.naturalMaf, 0) / rows.length;
}

/** Rolling 10-year mean ending in each year (needs ≥10 prior years in series) */
export function rolling10yrMeans(window: FlowWindow = "all") {
  const rows = filterFlows(window === "all" ? "all" : window);
  const out: { year: number; rolling10Maf: number; floorAnnualMaf: number }[] = [];
  for (let i = 9; i < rows.length; i++) {
    const slice = rows.slice(i - 9, i + 1);
    const avg = slice.reduce((s, r) => s + r.naturalMaf, 0) / 10;
    out.push({
      year: rows[i].year,
      rolling10Maf: Math.round(avg * 100) / 100,
      floorAnnualMaf: HEADLINE.leeFerry10yrAnnualEquivMaf,
    });
  }
  return out;
}

export function flowVsCompactSeries(window: FlowWindow) {
  return filterFlows(window).map((r) => ({
    year: r.year,
    naturalMaf: r.naturalMaf,
    compactAssumedMaf: HEADLINE.compactAssumedSupplyMaf,
    paperClaimsMaf: HEADLINE.paperClaimsMaf,
    gapVsAssumedMaf: Math.round((HEADLINE.compactAssumedSupplyMaf - r.naturalMaf) * 100) / 100,
  }));
}

export function gapByEra() {
  return ERA_AVERAGES.filter((e) => e.kind === "observed").map((e) => ({
    label: e.label,
    actualMaf: e.maf,
    compactAssumedMaf: HEADLINE.compactAssumedSupplyMaf,
    gapMaf: Math.round((HEADLINE.compactAssumedSupplyMaf - e.maf) * 100) / 100,
    gapPct:
      Math.round(
        ((HEADLINE.compactAssumedSupplyMaf - e.maf) / HEADLINE.compactAssumedSupplyMaf) * 1000,
      ) / 10,
  }));
}

export function paperClaimBars() {
  return PAPER_CLAIMS.map((c) => ({
    name: c.label,
    maf: c.maf,
    confidence: c.confidence,
  }));
}

export function lowerBasinBars() {
  return LOWER_BASIN_STATES.map((s) => ({
    name: s.label,
    maf: s.maf,
    sharePct: s.sharePct,
  }));
}

export function useVsEntitlementBars() {
  return USE_VS_ENTITLEMENT.map((r) => ({
    name: r.label,
    entitlement: r.entitlementMaf,
    recentUse: r.recentUseMaf,
    unused: Math.max(0, Math.round((r.entitlementMaf - r.recentUseMaf) * 100) / 100),
  }));
}

export function fmtMaf(n: number, digits = 1): string {
  return `${n.toFixed(digits)} maf`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}
