/**
 * Stranded spent fuel at US shutdown reactor sites (ISFSI / Group A).
 *
 * Core question: How many shutdown US reactor sites still host stranded used
 * fuel with no offsite repository path?
 *
 * Perimeter:
 * - PNNL-33938 Rev. 1.1 (2024 Inventory Report) Group A = all units permanently
 *   shutdown, SNF remaining on site as of 12/31/2022 (GC-859). Subgroups A1
 *   (dry only) and A2 (wet + dry). Fort St. Vrain HTGR and TMI-2 debris excluded
 *   from LWR MTU totals per PNNL footnotes.
 * - EIA U.S. Nuclear Reactor Shutdown List "ISFSI Only" license status for the
 *   classic Part-72-only sites (plant dismantled; fuel storage license remains).
 * - NRC decommissioning site finder for DECON/SAFSTOR context; GAO nuclear-waste
 *   oversight for repository-path framing (no operating geologic repository /
 *   consolidated interim storage acceptance as of report date).
 *
 * Headline: 20 all-shutdown (Group A) sites still hold ~12,310 MTU of SNF on
 * site; 17 of those are dry-storage-only (A1). Seven EIA-flagged ISFSI-only LWR
 * licenses account for ~1,729 MTU of the oldest stranded inventory.
 */

export type Confidence = "disclosed" | "estimated" | "scenario";

export type StorageMode = "dry-only" | "wet-and-dry";
export type LicenseStatus =
  | "isfsi-only"
  | "decon-with-isfsi"
  | "safstor-with-isfsi"
  | "mixed-pool";

export type CensusRegion =
  | "Northeast"
  | "Midwest"
  | "South"
  | "West";

export const SOURCE_NOTE =
  "Site inventories and Group A / A1 / A2 classifications: Pacific Northwest National Laboratory, Spent Nuclear Fuel and Reprocessing Waste Inventory (PNNL-33938 Rev. 1.1, 2024), Tables 2.1, 2.5, 2.7, and 2.8 — GC-859 discharges through 12/31/2022. ISFSI Only license labels: U.S. Energy Information Administration, U.S. Nuclear Reactor Shutdown List. Decommissioning context: U.S. Nuclear Regulatory Commission, Locations of Power Reactor Sites Undergoing Decommissioning. Repository-path framing: GAO reports on spent nuclear fuel management and the absence of an operating geologic repository or accepted consolidated interim storage path. MTU = metric tons of uranium (initial heavy metal). Fort St. Vrain HTGR and TMI-2 debris are excluded from LWR Group A MTU per PNNL footnotes.";

export const SOURCES = [
  {
    label: "PNNL-33938 Rev. 1.1 — SNF & Reprocessing Waste Inventory (2024)",
    url: "https://curie.pnnl.gov/system/files/SNF%20and%20Rep%20Waste%20Inventory%20PNNL%2033938%20Rev.%201.1_0.pdf",
  },
  {
    label: "EIA — U.S. Nuclear Reactor Shutdown List",
    url: "https://www.eia.gov/nuclear/reactors/shutdown/",
  },
  {
    label: "NRC — Power Reactor Sites Undergoing Decommissioning",
    url: "https://www.nrc.gov/info-finder/decommissioning/power-reactor",
  },
  {
    label: "GAO — Commercial Spent Nuclear Fuel (overview)",
    url: "https://www.gao.gov/products/gao-21-603",
  },
] as const;

export const HEADLINE = {
  /** PNNL Table 2.1 — Group A all-units-shutdown sites */
  groupASites: 20,
  groupAReactors: 25,
  /** Table 2.5 Group A total remaining on site */
  groupAMtu: 12310,
  groupAAssemblies: 39221,
  /** A1 dry-only (pre + post 2000) */
  a1Sites: 18,
  a1Mtu: 9683,
  a1Casks: 781,
  /** A2 still holding pool inventory */
  a2Sites: 2,
  a2PoolMtu: 1004,
  /** EIA ISFSI Only LWR licenses still hosting SNF (excludes Fort St. Vrain HTGR) */
  isfsiOnlyLwrSites: 6,
  isfsiOnlyLwrMtu: 1729,
  /** Years since Yucca Mountain license application era with no operating repository */
  yearsWithoutRepository: 40,
  confidence: "disclosed" as Confidence,
};

export const ANALYTICS = {
  shareOfNationalMtuPct: 13.5, // 12310 / 90963 ≈ 13.5% of NPR site total (Table 2.5)
  a1ShareOfGroupAMtuPct: 78.7, // 9683 / 12310
  pre2000A1Mtu: 2815,
  post2000A1Mtu: 6868,
  medianYearsStrandedIsfsiOnly: 28, // approx for classic ISFSI-only cohort vs 2022
  largestSite: "San Onofre",
  largestSiteMtu: 1609,
  oldestOperatingShutdownWithFuel: "Humboldt Bay",
  oldestShutdownYear: 1976,
};

export type SiteRow = {
  site: string;
  state: string;
  region: CensusRegion;
  shutdownYear: number;
  /** Last unit shutdown year when multi-unit */
  reactors: number;
  assemblies: number;
  mtu: number;
  snfCasks: number;
  storage: StorageMode;
  license: LicenseStatus;
  /** Years from last shutdown through end-2022 inventory date */
  yearsStranded: number;
  confidence: Confidence;
};

/**
 * Group A LWR sites with remaining SNF, end-2022.
 * Multi-unit campuses collapsed to one site row (Indian Point, San Onofre, Zion).
 * Palisades listed as A2 at inventory date (restart path later; inventory still stranded then).
 */
export const SHUTDOWN_SITES: SiteRow[] = [
  {
    site: "Big Rock Point",
    state: "MI",
    region: "Midwest",
    shutdownYear: 1997,
    reactors: 1,
    assemblies: 441,
    mtu: 57.92,
    snfCasks: 7,
    storage: "dry-only",
    license: "isfsi-only",
    yearsStranded: 25,
    confidence: "disclosed",
  },
  {
    site: "Haddam Neck",
    state: "CT",
    region: "Northeast",
    shutdownYear: 1996,
    reactors: 1,
    assemblies: 1019,
    mtu: 413.53,
    snfCasks: 40,
    storage: "dry-only",
    license: "isfsi-only",
    yearsStranded: 26,
    confidence: "disclosed",
  },
  {
    site: "Humboldt Bay",
    state: "CA",
    region: "West",
    shutdownYear: 1976,
    reactors: 1,
    assemblies: 390,
    mtu: 28.94,
    snfCasks: 5,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 46,
    confidence: "disclosed",
  },
  {
    site: "La Crosse",
    state: "WI",
    region: "Midwest",
    shutdownYear: 1987,
    reactors: 1,
    assemblies: 333,
    mtu: 37.97,
    snfCasks: 5,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 35,
    confidence: "disclosed",
  },
  {
    site: "Maine Yankee",
    state: "ME",
    region: "Northeast",
    shutdownYear: 1996,
    reactors: 1,
    assemblies: 1434,
    mtu: 542.26,
    snfCasks: 60,
    storage: "dry-only",
    license: "isfsi-only",
    yearsStranded: 26,
    confidence: "disclosed",
  },
  {
    site: "Rancho Seco",
    state: "CA",
    region: "West",
    shutdownYear: 1989,
    reactors: 1,
    assemblies: 493,
    mtu: 228.38,
    snfCasks: 21,
    storage: "dry-only",
    license: "isfsi-only",
    yearsStranded: 33,
    confidence: "disclosed",
  },
  {
    site: "Trojan",
    state: "OR",
    region: "West",
    shutdownYear: 1992,
    reactors: 1,
    assemblies: 790,
    mtu: 359.26,
    snfCasks: 34,
    storage: "dry-only",
    license: "isfsi-only",
    yearsStranded: 30,
    confidence: "disclosed",
  },
  {
    site: "Yankee Rowe",
    state: "MA",
    region: "Northeast",
    shutdownYear: 1991,
    reactors: 1,
    assemblies: 533,
    mtu: 127.13,
    snfCasks: 15,
    storage: "dry-only",
    license: "isfsi-only",
    yearsStranded: 31,
    confidence: "disclosed",
  },
  {
    site: "Zion",
    state: "IL",
    region: "Midwest",
    shutdownYear: 1998,
    reactors: 2,
    assemblies: 2226,
    mtu: 1019.41,
    snfCasks: 61,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 24,
    confidence: "disclosed",
  },
  {
    site: "Crystal River",
    state: "FL",
    region: "South",
    shutdownYear: 2013,
    reactors: 1,
    assemblies: 1243,
    mtu: 582.24,
    snfCasks: 39,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 9,
    confidence: "disclosed",
  },
  {
    site: "Kewaunee",
    state: "WI",
    region: "Midwest",
    shutdownYear: 2013,
    reactors: 1,
    assemblies: 1335,
    mtu: 518.7,
    snfCasks: 38,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 9,
    confidence: "disclosed",
  },
  {
    site: "San Onofre",
    state: "CA",
    region: "West",
    shutdownYear: 2013,
    reactors: 3,
    assemblies: 3855,
    mtu: 1609,
    snfCasks: 123,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 9,
    confidence: "disclosed",
  },
  {
    site: "Vermont Yankee",
    state: "VT",
    region: "Northeast",
    shutdownYear: 2014,
    reactors: 1,
    assemblies: 3880,
    mtu: 705.66,
    snfCasks: 58,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 8,
    confidence: "disclosed",
  },
  {
    site: "Fort Calhoun",
    state: "NE",
    region: "Midwest",
    shutdownYear: 2016,
    reactors: 1,
    assemblies: 1264,
    mtu: 466,
    snfCasks: 40,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 6,
    confidence: "disclosed",
  },
  {
    site: "Oyster Creek",
    state: "NJ",
    region: "Northeast",
    shutdownYear: 2018,
    reactors: 1,
    assemblies: 4504,
    mtu: 802.24,
    snfCasks: 67,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 4,
    confidence: "disclosed",
  },
  {
    site: "Pilgrim",
    state: "MA",
    region: "Northeast",
    shutdownYear: 2019,
    reactors: 1,
    assemblies: 4116,
    mtu: 734.82,
    snfCasks: 62,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 3,
    confidence: "disclosed",
  },
  {
    site: "Three Mile Island 1",
    state: "PA",
    region: "Northeast",
    shutdownYear: 2019,
    reactors: 1,
    assemblies: 1663,
    mtu: 786.49,
    snfCasks: 46,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 3,
    confidence: "disclosed",
  },
  {
    site: "Duane Arnold",
    state: "IA",
    region: "Midwest",
    shutdownYear: 2020,
    reactors: 1,
    assemblies: 3648,
    mtu: 662.64,
    snfCasks: 60,
    storage: "dry-only",
    license: "decon-with-isfsi",
    yearsStranded: 2,
    confidence: "disclosed",
  },
  {
    site: "Indian Point",
    state: "NY",
    region: "Northeast",
    shutdownYear: 2021,
    reactors: 3,
    assemblies: 4001,
    mtu: 1777,
    snfCasks: 77,
    storage: "wet-and-dry",
    license: "mixed-pool",
    yearsStranded: 1,
    confidence: "disclosed",
  },
  {
    site: "Palisades",
    state: "MI",
    region: "Midwest",
    shutdownYear: 2022,
    reactors: 1,
    assemblies: 2053,
    mtu: 850.48,
    snfCasks: 49,
    storage: "wet-and-dry",
    license: "mixed-pool",
    yearsStranded: 0,
    confidence: "disclosed",
  },
];

/** Fort St. Vrain noted separately — HTGR, not in LWR Group A MTU. */
export const NON_LWR_NOTE = {
  site: "Fort St. Vrain",
  state: "CO",
  license: "isfsi-only" as const,
  note: "HTGR spent fuel under DOE custody path; excluded from PNNL LWR Group A MTU totals.",
};

export type RegionAgg = {
  region: CensusRegion;
  sites: number;
  mtu: number;
  isfsiOnlySites: number;
};

export const REGION_TOTALS: RegionAgg[] = (() => {
  const order: CensusRegion[] = ["Northeast", "Midwest", "South", "West"];
  return order.map((region) => {
    const rows = SHUTDOWN_SITES.filter((s) => s.region === region);
    return {
      region,
      sites: rows.length,
      mtu: Math.round(rows.reduce((a, s) => a + s.mtu, 0)),
      isfsiOnlySites: rows.filter((s) => s.license === "isfsi-only").length,
    };
  });
})();

export type LicenseAgg = {
  license: LicenseStatus;
  label: string;
  sites: number;
  mtu: number;
};

export const LICENSE_MIX: LicenseAgg[] = [
  {
    license: "isfsi-only",
    label: "ISFSI-only license",
    sites: SHUTDOWN_SITES.filter((s) => s.license === "isfsi-only").length,
    mtu: Math.round(
      SHUTDOWN_SITES.filter((s) => s.license === "isfsi-only").reduce(
        (a, s) => a + s.mtu,
        0,
      ),
    ),
  },
  {
    license: "decon-with-isfsi",
    label: "DECON + onsite ISFSI",
    sites: SHUTDOWN_SITES.filter((s) => s.license === "decon-with-isfsi").length,
    mtu: Math.round(
      SHUTDOWN_SITES.filter((s) => s.license === "decon-with-isfsi").reduce(
        (a, s) => a + s.mtu,
        0,
      ),
    ),
  },
  {
    license: "mixed-pool",
    label: "Still wet + dry (A2)",
    sites: SHUTDOWN_SITES.filter((s) => s.license === "mixed-pool").length,
    mtu: Math.round(
      SHUTDOWN_SITES.filter((s) => s.license === "mixed-pool").reduce(
        (a, s) => a + s.mtu,
        0,
      ),
    ),
  },
];

/** Cumulative MTU added to the stranded pool by shutdown-year cohort (site last-unit year). */
export type CohortRow = {
  year: number;
  sitesThatYear: number;
  mtuAdded: number;
  cumulativeMtu: number;
  cumulativeSites: number;
};

export const SHUTDOWN_COHORTS: CohortRow[] = (() => {
  const byYear = new Map<number, { sites: number; mtu: number }>();
  for (const s of SHUTDOWN_SITES) {
    const cur = byYear.get(s.shutdownYear) ?? { sites: 0, mtu: 0 };
    cur.sites += 1;
    cur.mtu += s.mtu;
    byYear.set(s.shutdownYear, cur);
  }
  const years = [...byYear.keys()].sort((a, b) => a - b);
  let cumMtu = 0;
  let cumSites = 0;
  return years.map((year) => {
    const { sites, mtu } = byYear.get(year)!;
    cumMtu += mtu;
    cumSites += sites;
    return {
      year,
      sitesThatYear: sites,
      mtuAdded: Math.round(mtu),
      cumulativeMtu: Math.round(cumMtu),
      cumulativeSites: cumSites,
    };
  });
})();

export type StorageSlice = {
  mode: StorageMode;
  label: string;
  sites: number;
  mtu: number;
};

export const STORAGE_SPLIT: StorageSlice[] = [
  {
    mode: "dry-only",
    label: "Dry storage only (A1)",
    sites: SHUTDOWN_SITES.filter((s) => s.storage === "dry-only").length,
    mtu: Math.round(
      SHUTDOWN_SITES.filter((s) => s.storage === "dry-only").reduce(
        (a, s) => a + s.mtu,
        0,
      ),
    ),
  },
  {
    mode: "wet-and-dry",
    label: "Wet + dry still (A2)",
    sites: SHUTDOWN_SITES.filter((s) => s.storage === "wet-and-dry").length,
    mtu: Math.round(
      SHUTDOWN_SITES.filter((s) => s.storage === "wet-and-dry").reduce(
        (a, s) => a + s.mtu,
        0,
      ),
    ),
  },
];

export type RegionFilter = "all" | CensusRegion;
export type LicenseFilter = "all" | LicenseStatus;
export type EraFilter = "all" | "pre-2000" | "post-2000";

export function filterSites(
  region: RegionFilter,
  license: LicenseFilter,
  era: EraFilter,
): SiteRow[] {
  return SHUTDOWN_SITES.filter((s) => {
    if (region !== "all" && s.region !== region) return false;
    if (license !== "all" && s.license !== license) return false;
    if (era === "pre-2000" && s.shutdownYear >= 2000) return false;
    if (era === "post-2000" && s.shutdownYear < 2000) return false;
    return true;
  });
}

export function siteMtuSum(rows: SiteRow[]): number {
  return Math.round(rows.reduce((a, s) => a + s.mtu, 0));
}
