/**
 * Demographic cash flows — age structure, remittances, and public pensions.
 * Sources disclosed in SOURCE_NOTE / SOURCES. Remittance GDP shares and
 * pension % GDP are latest disclosed prints; mid-path dependency years may be
 * interpolated from UN WPP anchors.
 */

export type Confidence = "disclosed" | "estimated";

export type CountryRole = "aging-host" | "remittance-origin" | "bridge";

export type CountryProfile = {
  id: string;
  label: string;
  shortLabel: string;
  role: CountryRole;
  /** Old-age dependency: population 65+ per 100 aged 15–64 (UN WPP 2024 ~2024) */
  oldAgeDependency: number;
  medianAge: number;
  /** Remittance inflows, $bn (World Bank / Brief 41 2024 est. where available) */
  remittanceInBn: number | null;
  /** Remittances as % of GDP (World Bank dependence table / Brief 41) */
  remittanceGdpPct: number | null;
  /** Public cash pension + survivors % GDP (OECD Pensions at a Glance latest) */
  publicPensionGdpPct: number | null;
  confidence: Confidence;
};

export type RemittanceYear = {
  year: number;
  lmicBn: number;
  growthPct: number | null;
  confidence: Confidence;
};

export type DependencyPathPoint = {
  year: number;
  japan: number;
  italy: number;
  germany: number;
  unitedStates: number;
  mexico: number;
  india: number;
  nigeria: number;
  confidence: Confidence;
};

export type CorridorRow = {
  id: string;
  from: string;
  to: string;
  bn: number;
  note: string;
  confidence: Confidence;
};

export type FlowCompareRow = {
  id: string;
  label: string;
  bn: number;
  confidence: Confidence;
};

export type UsEmploymentIndex = {
  year: number;
  foreignBorn: number;
  nativeBorn: number;
  confidence: Confidence;
};

export const HEADLINE = {
  lmicRemittances2024Bn: 685,
  remittanceGrowth2024Pct: 5.8,
  indiaInflowBn: 129,
  mexicoInflowBn: 68,
  topCorridorUsMxBn: 52,
  tajikistanRemitGdpPct: 45,
  italyPensionGdpPct: 16.3,
  oecdPensionAvgGdpPct: 8.1,
  japanOldAgeDep: 54,
  nigeriaOldAgeDep: 6,
  usOasdiDepletionYear: 2034,
  fdiCompareBn: 470,
  odaCompareBn: 210,
};

export const SOURCE_NOTE =
  "World Bank Migration and Development Brief 41 (Dec 2024) for LMIC remittance totals, top recipients, GDP-share leaders, and FDI/ODA comparisons; KNOMAD bilateral matrix (2021) for corridor dollars; UN World Population Prospects 2024 for old-age dependency and median age; OECD Pensions at a Glance / Society at a Glance for public pension % GDP; SSA 2025 Trustees Report for US OASDI depletion year; World Bank People Move blog for US foreign-born employment recovery narrative.";

export const SOURCES = [
  {
    label: "World Bank Migration & Development Brief 41",
    href: "https://blogs.worldbank.org/en/peoplemove/in-2024--remittance-flows-to-low--and-middle-income-countries-ar",
  },
  {
    label: "UN World Population Prospects 2024",
    href: "https://population.un.org/wpp/",
  },
  {
    label: "OECD Pensions at a Glance",
    href: "https://www.oecd.org/en/publications/2025/11/pensions-at-a-glance-2025_76510fe4/full-report/public-expenditure-on-pensions_ddc9a2dd.html",
  },
  {
    label: "SSA 2025 Trustees Report",
    href: "https://www.ssa.gov/oact/TR/2025/",
  },
] as const;

/** Cross-section used for scatter + ranked panels */
export const COUNTRY_PROFILES: CountryProfile[] = [
  {
    id: "japan",
    label: "Japan",
    shortLabel: "Japan",
    role: "aging-host",
    oldAgeDependency: 54,
    medianAge: 49,
    remittanceInBn: 5,
    remittanceGdpPct: 0.1,
    publicPensionGdpPct: 9.3,
    confidence: "disclosed",
  },
  {
    id: "italy",
    label: "Italy",
    shortLabel: "Italy",
    role: "aging-host",
    oldAgeDependency: 40,
    medianAge: 48,
    remittanceInBn: 11,
    remittanceGdpPct: 0.5,
    publicPensionGdpPct: 16.3,
    confidence: "disclosed",
  },
  {
    id: "germany",
    label: "Germany",
    shortLabel: "Germany",
    role: "aging-host",
    oldAgeDependency: 37,
    medianAge: 45,
    remittanceInBn: 20,
    remittanceGdpPct: 0.5,
    publicPensionGdpPct: 10.4,
    confidence: "disclosed",
  },
  {
    id: "france",
    label: "France",
    shortLabel: "France",
    role: "aging-host",
    oldAgeDependency: 37,
    medianAge: 42,
    remittanceInBn: 27,
    remittanceGdpPct: 0.9,
    publicPensionGdpPct: 14.5,
    confidence: "estimated",
  },
  {
    id: "united-states",
    label: "United States",
    shortLabel: "US",
    role: "bridge",
    oldAgeDependency: 29,
    medianAge: 39,
    remittanceInBn: 7,
    remittanceGdpPct: 0.03,
    publicPensionGdpPct: 7.1,
    confidence: "disclosed",
  },
  {
    id: "united-kingdom",
    label: "United Kingdom",
    shortLabel: "UK",
    role: "aging-host",
    oldAgeDependency: 32,
    medianAge: 41,
    remittanceInBn: 4,
    remittanceGdpPct: 0.1,
    publicPensionGdpPct: 5.2,
    confidence: "estimated",
  },
  {
    id: "china",
    label: "China",
    shortLabel: "China",
    role: "bridge",
    oldAgeDependency: 21,
    medianAge: 40,
    remittanceInBn: 48,
    remittanceGdpPct: 0.3,
    publicPensionGdpPct: null,
    confidence: "disclosed",
  },
  {
    id: "mexico",
    label: "Mexico",
    shortLabel: "Mexico",
    role: "remittance-origin",
    oldAgeDependency: 13,
    medianAge: 30,
    remittanceInBn: 68,
    remittanceGdpPct: 3.7,
    publicPensionGdpPct: 3.1,
    confidence: "disclosed",
  },
  {
    id: "india",
    label: "India",
    shortLabel: "India",
    role: "remittance-origin",
    oldAgeDependency: 11,
    medianAge: 29,
    remittanceInBn: 129,
    remittanceGdpPct: 3.4,
    publicPensionGdpPct: null,
    confidence: "disclosed",
  },
  {
    id: "philippines",
    label: "Philippines",
    shortLabel: "Philippines",
    role: "remittance-origin",
    oldAgeDependency: 9,
    medianAge: 26,
    remittanceInBn: 40,
    remittanceGdpPct: 8.5,
    publicPensionGdpPct: null,
    confidence: "disclosed",
  },
  {
    id: "pakistan",
    label: "Pakistan",
    shortLabel: "Pakistan",
    role: "remittance-origin",
    oldAgeDependency: 8,
    medianAge: 23,
    remittanceInBn: 33,
    remittanceGdpPct: 8.0,
    publicPensionGdpPct: null,
    confidence: "estimated",
  },
  {
    id: "nigeria",
    label: "Nigeria",
    shortLabel: "Nigeria",
    role: "remittance-origin",
    oldAgeDependency: 6,
    medianAge: 18,
    remittanceInBn: 21,
    remittanceGdpPct: 4.0,
    publicPensionGdpPct: null,
    confidence: "estimated",
  },
  {
    id: "tajikistan",
    label: "Tajikistan",
    shortLabel: "Tajikistan",
    role: "remittance-origin",
    oldAgeDependency: 7,
    medianAge: 23,
    remittanceInBn: 5.5,
    remittanceGdpPct: 45,
    publicPensionGdpPct: null,
    confidence: "disclosed",
  },
  {
    id: "nicaragua",
    label: "Nicaragua",
    shortLabel: "Nicaragua",
    role: "remittance-origin",
    oldAgeDependency: 10,
    medianAge: 27,
    remittanceInBn: 5,
    remittanceGdpPct: 27,
    publicPensionGdpPct: null,
    confidence: "disclosed",
  },
  {
    id: "lebanon",
    label: "Lebanon",
    shortLabel: "Lebanon",
    role: "remittance-origin",
    oldAgeDependency: 16,
    medianAge: 30,
    remittanceInBn: 6.7,
    remittanceGdpPct: 27,
    publicPensionGdpPct: null,
    confidence: "disclosed",
  },
  {
    id: "uae",
    label: "United Arab Emirates",
    shortLabel: "UAE",
    role: "bridge",
    oldAgeDependency: 2,
    medianAge: 34,
    remittanceInBn: null,
    remittanceGdpPct: null,
    publicPensionGdpPct: null,
    confidence: "estimated",
  },
];

/** LMIC remittance path — Brief 40/41 anchors; mid years estimated */
export const REMITTANCE_SERIES: RemittanceYear[] = [
  { year: 2015, lmicBn: 441, growthPct: null, confidence: "estimated" },
  { year: 2016, lmicBn: 444, growthPct: 0.7, confidence: "estimated" },
  { year: 2017, lmicBn: 483, growthPct: 8.8, confidence: "estimated" },
  { year: 2018, lmicBn: 529, growthPct: 9.5, confidence: "estimated" },
  { year: 2019, lmicBn: 554, growthPct: 4.7, confidence: "estimated" },
  { year: 2020, lmicBn: 549, growthPct: -0.9, confidence: "estimated" },
  { year: 2021, lmicBn: 605, growthPct: 10.2, confidence: "estimated" },
  { year: 2022, lmicBn: 647, growthPct: 6.9, confidence: "estimated" },
  { year: 2023, lmicBn: 647, growthPct: 1.2, confidence: "disclosed" },
  { year: 2024, lmicBn: 685, growthPct: 5.8, confidence: "disclosed" },
];

/**
 * Old-age dependency paths (65+ / 15–64 × 100).
 * Anchors from UN WPP 2024; intermediate years linearly interpolated.
 */
export const DEPENDENCY_PATH: DependencyPathPoint[] = [
  {
    year: 2000,
    japan: 25,
    italy: 27,
    germany: 24,
    unitedStates: 19,
    mexico: 8,
    india: 7,
    nigeria: 6,
    confidence: "estimated",
  },
  {
    year: 2010,
    japan: 36,
    italy: 31,
    germany: 31,
    unitedStates: 20,
    mexico: 9,
    india: 8,
    nigeria: 6,
    confidence: "estimated",
  },
  {
    year: 2020,
    japan: 48,
    italy: 37,
    germany: 34,
    unitedStates: 26,
    mexico: 11,
    india: 10,
    nigeria: 6,
    confidence: "estimated",
  },
  {
    year: 2024,
    japan: 54,
    italy: 40,
    germany: 37,
    unitedStates: 29,
    mexico: 13,
    india: 11,
    nigeria: 6,
    confidence: "disclosed",
  },
  {
    year: 2035,
    japan: 60,
    italy: 48,
    germany: 45,
    unitedStates: 36,
    mexico: 17,
    india: 14,
    nigeria: 6,
    confidence: "estimated",
  },
  {
    year: 2050,
    japan: 74,
    italy: 65,
    germany: 55,
    unitedStates: 40,
    mexico: 28,
    india: 22,
    nigeria: 8,
    confidence: "estimated",
  },
];

export const TOP_CORRIDORS: CorridorRow[] = [
  {
    id: "us-mx",
    from: "United States",
    to: "Mexico",
    bn: 52,
    note: "Largest bilateral corridor",
    confidence: "disclosed",
  },
  {
    id: "uae-in",
    from: "UAE",
    to: "India",
    bn: 20,
    note: "Gulf → South Asia",
    confidence: "disclosed",
  },
  {
    id: "us-ph",
    from: "United States",
    to: "Philippines",
    bn: 15,
    note: "OFW + US diaspora",
    confidence: "disclosed",
  },
  {
    id: "sa-in",
    from: "Saudi Arabia",
    to: "India",
    bn: 13,
    note: "Gulf → South Asia",
    confidence: "disclosed",
  },
  {
    id: "us-in",
    from: "United States",
    to: "India",
    bn: 12,
    note: "Skilled diaspora",
    confidence: "estimated",
  },
  {
    id: "us-gt",
    from: "United States",
    to: "Guatemala",
    bn: 10,
    note: "Central America corridor",
    confidence: "estimated",
  },
  {
    id: "uk-in",
    from: "United Kingdom",
    to: "India",
    bn: 5,
    note: "OECD skilled corridor",
    confidence: "estimated",
  },
  {
    id: "ru-tj",
    from: "Russia",
    to: "Tajikistan",
    bn: 3.5,
    note: "High GDP-share destination",
    confidence: "estimated",
  },
];

export const FLOW_COMPARE: FlowCompareRow[] = [
  { id: "remit", label: "LMIC remittances", bn: 685, confidence: "disclosed" },
  { id: "fdi", label: "FDI to LMICs", bn: 470, confidence: "disclosed" },
  { id: "oda", label: "ODA (DAC)", bn: 210, confidence: "disclosed" },
];

/** Indexed employment (Feb 2020 = 100) — World Bank People Move narrative */
export const US_EMPLOYMENT_INDEX: UsEmploymentIndex[] = [
  { year: 2019, foreignBorn: 98, nativeBorn: 99, confidence: "estimated" },
  { year: 2020, foreignBorn: 100, nativeBorn: 100, confidence: "disclosed" },
  { year: 2021, foreignBorn: 102, nativeBorn: 98, confidence: "estimated" },
  { year: 2022, foreignBorn: 106, nativeBorn: 99, confidence: "estimated" },
  { year: 2023, foreignBorn: 109, nativeBorn: 100, confidence: "estimated" },
  { year: 2024, foreignBorn: 111, nativeBorn: 100, confidence: "disclosed" },
];

export const ROLE_COLORS: Record<CountryRole, string> = {
  "aging-host": "#0f766e",
  "remittance-origin": "#c2410c",
  bridge: "#1d4ed8",
};

export function fmtBn(n: number, digits = 0): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function rankedByRemittanceIn(): CountryProfile[] {
  return [...COUNTRY_PROFILES]
    .filter((c) => c.remittanceInBn != null && c.remittanceInBn > 0)
    .sort((a, b) => (b.remittanceInBn ?? 0) - (a.remittanceInBn ?? 0));
}

export function rankedByRemittanceGdp(): CountryProfile[] {
  return [...COUNTRY_PROFILES]
    .filter((c) => c.remittanceGdpPct != null && c.remittanceGdpPct > 1)
    .sort((a, b) => (b.remittanceGdpPct ?? 0) - (a.remittanceGdpPct ?? 0));
}

export function rankedByPensionSpend(): CountryProfile[] {
  return [...COUNTRY_PROFILES]
    .filter((c) => c.publicPensionGdpPct != null)
    .sort((a, b) => (b.publicPensionGdpPct ?? 0) - (a.publicPensionGdpPct ?? 0));
}

export function scatterPoints(): Array<
  CountryProfile & { x: number; y: number; z: number }
> {
  return COUNTRY_PROFILES.filter(
    (c) => c.remittanceGdpPct != null && c.oldAgeDependency != null,
  ).map((c) => ({
    ...c,
    x: c.oldAgeDependency,
    y: c.remittanceGdpPct ?? 0,
    z: c.remittanceInBn ?? 1,
  }));
}

export function dependencySeriesFor(
  key: keyof Omit<DependencyPathPoint, "year" | "confidence">,
): Array<{ year: number; value: number }> {
  return DEPENDENCY_PATH.map((d) => ({ year: d.year, value: d[key] as number }));
}
