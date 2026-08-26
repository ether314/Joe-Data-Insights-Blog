/**
 * US commercial spent nuclear fuel — wet pool vs dry cask (ISFSI) inventory.
 *
 * Core question: What metric tons of heavy metal remain in reactor pools
 * versus independent spent fuel storage installations?
 *
 * Anchors: DOE / EIA Form GC-859 Nuclear Fuel Data Survey through 12/31/2022
 * (PNNL summary tables); PNNL-33938 Rev. 1.1 Spent Nuclear Fuel and
 * Reprocessing Waste Inventory (Dec 2024 vintage, inventory as of end-2022);
 * NRC ISFSI / StoreFuel cask counts referenced in the inventory report.
 * Masses are metric tons of initial heavy metal / initial uranium (MTiHM / MTU).
 */

export type Confidence = "reported" | "prior_report" | "desk";

export const SOURCE_NOTE =
  "Commercial light-water reactor spent fuel stored at nuclear power reactor sites and licensed ISFSIs, including the Morris, IL away-from-reactor pool. Figures exclude early reprocessing removals (West Valley), TMI-2 debris transferred off-site, Fort St. Vrain HTGR fuel, and DOE R&D transfers unless noted. End-2022 pool/dry split and state/region tables follow PNNL-33938 Rev. 1.1 Table 2.5 / Appendix D–E. End-2021 crossover uses the prior inventory print (dry 44,741 vs pool 44,139 MTiHM). GC-859 Summary 1 supplies assembly counts and reactor-type MTiHM totals. Cask counts are StoreFuel-derived as cited by PNNL. Vintage: inventory as of 31 Dec 2022; report release 2024.";

export const SOURCES = [
  {
    label: "DOE / EIA Form GC-859 — Nuclear Fuel Data Survey summaries (through 2022)",
    url: "https://gc859.pnnl.gov/summary",
  },
  {
    label: "PNNL-33938 Rev. 1.1 — Spent Nuclear Fuel and Reprocessing Waste Inventory (2024)",
    url: "https://curie.pnnl.gov/system/files/SNF%20and%20Rep%20Waste%20Inventory%20PNNL%2033938%20Rev.%201.1_0.pdf",
  },
  {
    label: "DOE FY 2027 Nuclear Waste Disposal budget narrative (commercial UNF context)",
    url: "https://www.energy.gov/documents/doe-fy-2027-volume-3-nwd",
  },
  {
    label: "NRC — Spent Fuel Storage in Pools and Dry Casks (ISFSI overview)",
    url: "https://www.nrc.gov/waste/spent-fuel-storage.html",
  },
] as const;

export const VIZ_MARKERS = [
  "Pool 42,037 vs dry 48,926 MTiHM",
  "Dry share of commercial SNF mass",
  "State pool vs dry MTiHM",
  "NRC region stacked inventory",
  "Site-group pool vs dry scatter",
] as const;

export const HEADLINE = {
  asOf: "2022-12-31",
  totalMtihm: 90963,
  poolMtihm: 42037,
  dryMtihm: 48926,
  drySharePct: 53.8,
  poolSharePct: 46.2,
  dryLeadMtihm: 6889,
  poolAssemblies: 145697,
  dryAssemblies: 169181,
  totalAssemblies: 314878,
  dryCasks: 3862,
  sitesReporting: 73,
  /** End-2021: first year dry mass exceeded pool mass */
  crossoverYear: 2021,
  pool2021Mtihm: 44139,
  dry2021Mtihm: 44741,
  total2021Mtihm: 88880,
  dryCasks2021: 3563,
  /** GC-859 reactor-type totals (all storage modes) */
  bwrMtihm: 32010,
  pwrMtihm: 58953,
  bwrAssemblies: 179373,
  pwrAssemblies: 135505,
  /** Site-group dry / pool from Table 2.5 */
  groupADryMtihm: 11306,
  groupAPoolMtihm: 1004,
  groupBDryMtihm: 1675,
  groupBPoolMtihm: 2400,
  groupCDryMtihm: 35945,
  groupCPoolMtihm: 37958,
  groupFPoolMtihm: 674,
  morrisAssemblies: 3217,
} as const;

export type ModeFilter = "all" | "pool" | "dry";
export type RegionFilter = "all" | "1" | "2" | "3" | "4";
export type SortKey = "total" | "dryShare" | "pool" | "dry";

/** National mode split for stacked / donut-style panels */
export const MODE_SPLIT = [
  {
    id: "pool",
    label: "Wet pool",
    mtihm: HEADLINE.poolMtihm,
    assemblies: HEADLINE.poolAssemblies,
    sharePct: HEADLINE.poolSharePct,
    note: "Includes Morris AFR pool ISFSI",
  },
  {
    id: "dry",
    label: "Dry cask (ISFSI)",
    mtihm: HEADLINE.dryMtihm,
    assemblies: HEADLINE.dryAssemblies,
    sharePct: HEADLINE.drySharePct,
    note: `${HEADLINE.dryCasks.toLocaleString()} loaded casks/canisters`,
  },
] as const;

/**
 * Historical pool vs dry MTiHM. 2021–2022 are inventory-report reported;
 * earlier years are desk reconstructions from prior PNNL prints and
 * StoreFuel-linked dry loading (confidence marked).
 */
export const MODE_HISTORY: Array<{
  year: number;
  poolMtihm: number;
  dryMtihm: number;
  totalMtihm: number;
  dryCasks: number | null;
  confidence: Confidence;
}> = [
  { year: 2010, poolMtihm: 52000, dryMtihm: 16000, totalMtihm: 68000, dryCasks: null, confidence: "desk" },
  { year: 2014, poolMtihm: 50000, dryMtihm: 25000, totalMtihm: 75000, dryCasks: null, confidence: "desk" },
  { year: 2018, poolMtihm: 47000, dryMtihm: 34000, totalMtihm: 81000, dryCasks: null, confidence: "desk" },
  { year: 2020, poolMtihm: 45500, dryMtihm: 41600, totalMtihm: 87100, dryCasks: 3334, confidence: "prior_report" },
  {
    year: 2021,
    poolMtihm: HEADLINE.pool2021Mtihm,
    dryMtihm: HEADLINE.dry2021Mtihm,
    totalMtihm: HEADLINE.total2021Mtihm,
    dryCasks: HEADLINE.dryCasks2021,
    confidence: "reported",
  },
  {
    year: 2022,
    poolMtihm: HEADLINE.poolMtihm,
    dryMtihm: HEADLINE.dryMtihm,
    totalMtihm: HEADLINE.totalMtihm,
    dryCasks: HEADLINE.dryCasks,
    confidence: "reported",
  },
];

/** PNNL site groups — Table 2.5 */
export const SITE_GROUPS = [
  {
    id: "A",
    label: "Group A — all units shutdown",
    dryMtihm: 11306,
    poolMtihm: 1004,
    dryAssemblies: 36965,
    poolAssemblies: 2256,
    casks: 907,
    note: "Mostly dry-only (A1); A2 still holds limited pool inventory",
  },
  {
    id: "B",
    label: "Group B — mixed operating status",
    dryMtihm: 1675,
    poolMtihm: 2400,
    dryAssemblies: 7822,
    poolAssemblies: 10474,
    casks: 141,
    note: "Sites with some units shutdown and some still operating",
  },
  {
    id: "C",
    label: "Group C — operating fleet",
    dryMtihm: 35945,
    poolMtihm: 37958,
    dryAssemblies: 124394,
    poolAssemblies: 129750,
    casks: 2814,
    note: "Operating NPPs; still the largest pool stock",
  },
  {
    id: "F",
    label: "Group F — Morris AFR pool",
    dryMtihm: 0,
    poolMtihm: 674,
    dryAssemblies: 0,
    poolAssemblies: 3217,
    casks: 0,
    note: "Only non-DOE away-from-reactor pool ISFSI",
  },
] as const;

/** NRC regions — Table E.2 */
export const NRC_REGIONS = [
  {
    id: "1" as const,
    label: "Region I (Northeast)",
    dryMtihm: 13294,
    poolMtihm: 10410,
    dryAssemblies: 54297,
    poolAssemblies: 41046,
    casks: 1091,
  },
  {
    id: "2" as const,
    label: "Region II (Southeast)",
    dryMtihm: 14863,
    poolMtihm: 13035,
    dryAssemblies: 43980,
    poolAssemblies: 39293,
    casks: 1116,
  },
  {
    id: "3" as const,
    label: "Region III (Midwest)",
    dryMtihm: 10142,
    poolMtihm: 10630,
    dryAssemblies: 39351,
    poolAssemblies: 42884,
    casks: 795,
  },
  {
    id: "4" as const,
    label: "Region IV (West / South-Central)",
    dryMtihm: 10626,
    poolMtihm: 7962,
    dryAssemblies: 31553,
    poolAssemblies: 22474,
    casks: 860,
  },
] as const;

export type StateRow = {
  state: string;
  abbr: string;
  dryMtihm: number;
  poolMtihm: number;
  dryAssemblies: number;
  poolAssemblies: number;
  casks: number;
  region: "1" | "2" | "3" | "4";
};

/** State inventory by storage mode — PNNL-33938 Table D.2 (end-2022) */
export const STATE_INVENTORY: StateRow[] = [
  { state: "Alabama", abbr: "AL", dryMtihm: 2364, poolMtihm: 2032, dryAssemblies: 10491, poolAssemblies: 8467, casks: 165, region: "2" },
  { state: "Arizona", abbr: "AZ", dryMtihm: 1847, poolMtihm: 1093, dryAssemblies: 4314, poolAssemblies: 2511, casks: 170, region: "4" },
  { state: "Arkansas", abbr: "AR", dryMtihm: 1210, poolMtihm: 610, dryAssemblies: 2752, poolAssemblies: 1336, casks: 102, region: "4" },
  { state: "California", abbr: "CA", dryMtihm: 2676, poolMtihm: 848, dryAssemblies: 6594, poolAssemblies: 2005, casks: 207, region: "4" },
  { state: "Connecticut", abbr: "CT", dryMtihm: 1057, poolMtihm: 1428, dryAssemblies: 2587, poolAssemblies: 4955, casks: 89, region: "1" },
  { state: "Florida", abbr: "FL", dryMtihm: 1889, poolMtihm: 1953, dryAssemblies: 4379, poolAssemblies: 4654, casks: 137, region: "2" },
  { state: "Georgia", abbr: "GA", dryMtihm: 1889, poolMtihm: 1659, dryAssemblies: 8088, poolAssemblies: 6118, casks: 147, region: "2" },
  { state: "Illinois", abbr: "IL", dryMtihm: 4971, poolMtihm: 6607, dryAssemblies: 20954, poolAssemblies: 29508, casks: 378, region: "3" },
  { state: "Iowa", abbr: "IA", dryMtihm: 663, poolMtihm: 0, dryAssemblies: 3648, poolAssemblies: 0, casks: 60, region: "3" },
  { state: "Kansas", abbr: "KS", dryMtihm: 84, poolMtihm: 839, dryAssemblies: 185, poolAssemblies: 1827, casks: 5, region: "4" },
  { state: "Louisiana", abbr: "LA", dryMtihm: 862, poolMtihm: 902, dryAssemblies: 3508, poolAssemblies: 3310, casks: 68, region: "4" },
  { state: "Maine", abbr: "ME", dryMtihm: 542, poolMtihm: 0, dryAssemblies: 1434, poolAssemblies: 0, casks: 60, region: "1" },
  { state: "Maryland", abbr: "MD", dryMtihm: 1106, poolMtihm: 571, dryAssemblies: 2846, poolAssemblies: 1411, casks: 100, region: "1" },
  { state: "Massachusetts", abbr: "MA", dryMtihm: 862, poolMtihm: 0, dryAssemblies: 4649, poolAssemblies: 0, casks: 77, region: "1" },
  { state: "Michigan", abbr: "MI", dryMtihm: 1679, poolMtihm: 1951, dryAssemblies: 5184, poolAssemblies: 6034, casks: 136, region: "3" },
  { state: "Minnesota", abbr: "MN", dryMtihm: 1052, poolMtihm: 597, dryAssemblies: 3830, poolAssemblies: 2139, casks: 80, region: "3" },
  { state: "Mississippi", abbr: "MS", dryMtihm: 525, poolMtihm: 592, dryAssemblies: 2992, poolAssemblies: 3260, casks: 44, region: "2" },
  { state: "Missouri", abbr: "MO", dryMtihm: 466, poolMtihm: 462, dryAssemblies: 1110, poolAssemblies: 1083, casks: 30, region: "3" },
  { state: "Nebraska", abbr: "NE", dryMtihm: 795, poolMtihm: 297, dryAssemblies: 3094, poolAssemblies: 1626, casks: 70, region: "4" },
  { state: "New Hampshire", abbr: "NH", dryMtihm: 440, poolMtihm: 333, dryAssemblies: 960, poolAssemblies: 727, casks: 30, region: "1" },
  { state: "New Jersey", abbr: "NJ", dryMtihm: 1880, poolMtihm: 1606, dryAssemblies: 8256, poolAssemblies: 5325, casks: 146, region: "1" },
  { state: "New York", abbr: "NY", dryMtihm: 2211, poolMtihm: 2591, dryAssemblies: 8397, poolAssemblies: 10801, casks: 173, region: "1" },
  { state: "North Carolina", abbr: "NC", dryMtihm: 1585, poolMtihm: 3086, dryAssemblies: 5459, poolAssemblies: 10565, casks: 125, region: "2" },
  { state: "Ohio", abbr: "OH", dryMtihm: 578, poolMtihm: 1032, dryAssemblies: 2373, poolAssemblies: 4069, casks: 42, region: "3" },
  { state: "Oregon", abbr: "OR", dryMtihm: 359, poolMtihm: 0, dryAssemblies: 790, poolAssemblies: 0, casks: 34, region: "4" },
  { state: "Pennsylvania", abbr: "PA", dryMtihm: 4490, poolMtihm: 3882, dryAssemblies: 21288, poolAssemblies: 17827, casks: 358, region: "1" },
  { state: "South Carolina", abbr: "SC", dryMtihm: 3200, poolMtihm: 2289, dryAssemblies: 7010, poolAssemblies: 5089, casks: 275, region: "2" },
  { state: "Tennessee", abbr: "TN", dryMtihm: 1529, poolMtihm: 1067, dryAssemblies: 3332, poolAssemblies: 2338, casks: 96, region: "2" },
  { state: "Texas", abbr: "TX", dryMtihm: 1156, poolMtihm: 2105, dryAssemblies: 2542, poolAssemblies: 4324, casks: 76, region: "4" },
  { state: "Vermont", abbr: "VT", dryMtihm: 706, poolMtihm: 0, dryAssemblies: 3880, poolAssemblies: 0, casks: 58, region: "1" },
  { state: "Virginia", abbr: "VA", dryMtihm: 2407, poolMtihm: 949, dryAssemblies: 5221, poolAssemblies: 2062, casks: 171, region: "2" },
  { state: "Washington", abbr: "WA", dryMtihm: 646, poolMtihm: 216, dryAssemblies: 3672, poolAssemblies: 1192, casks: 54, region: "4" },
  { state: "Wisconsin", abbr: "WI", dryMtihm: 1200, poolMtihm: 444, dryAssemblies: 3362, poolAssemblies: 1134, casks: 99, region: "3" },
];

export const DETAIL_TABLE = STATE_INVENTORY.map((r) => {
  const total = r.dryMtihm + r.poolMtihm;
  return {
    state: r.state,
    abbr: r.abbr,
    region: r.region,
    poolMtihm: r.poolMtihm,
    dryMtihm: r.dryMtihm,
    totalMtihm: total,
    drySharePct: total > 0 ? Math.round((1000 * r.dryMtihm) / total) / 10 : 0,
    casks: r.casks,
    poolAssemblies: r.poolAssemblies,
    dryAssemblies: r.dryAssemblies,
  };
}).sort((a, b) => b.totalMtihm - a.totalMtihm);

export function fmtMtihm(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function filterStates(
  region: RegionFilter,
  mode: ModeFilter,
  sort: SortKey,
  topN = 12,
) {
  let rows = STATE_INVENTORY.map((r) => {
    const total = r.dryMtihm + r.poolMtihm;
    return {
      ...r,
      totalMtihm: total,
      drySharePct: total > 0 ? (100 * r.dryMtihm) / total : 0,
      displayMtihm:
        mode === "pool" ? r.poolMtihm : mode === "dry" ? r.dryMtihm : total,
    };
  });
  if (region !== "all") rows = rows.filter((r) => r.region === region);
  if (mode === "pool") rows = rows.filter((r) => r.poolMtihm > 0);
  if (mode === "dry") rows = rows.filter((r) => r.dryMtihm > 0);
  rows.sort((a, b) => {
    if (sort === "dryShare") return b.drySharePct - a.drySharePct;
    if (sort === "pool") return b.poolMtihm - a.poolMtihm;
    if (sort === "dry") return b.dryMtihm - a.dryMtihm;
    return b.totalMtihm - a.totalMtihm;
  });
  return rows.slice(0, topN);
}
