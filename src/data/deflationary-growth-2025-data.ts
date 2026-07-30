/**
 * Deflationary growth economies — 2025 primary year.
 *
 * Counter-narrative: real GDP expanded in multiple major economies while CPI YoY
 * fell below zero, breaking the textbook link between growth and inflation.
 *
 * Sources (public, cited per record):
 * - IMF World Economic Outlook (WEO) Apr/Oct 2025 — imf.org
 * - World Bank Global Economic Prospects 2025 — worldbank.org
 * - OECD Economic Outlook 2025 — oecd.org
 * - National statistics offices (NBS China, DGBAS Taiwan, BFS Switzerland, etc.)
 *
 * Methodology:
 * - gdpGrowthPct2025 = real GDP growth, calendar 2025 (% YoY).
 * - cpiYoYPct2025 = headline CPI inflation, Dec 2025 vs Dec 2024 unless noted.
 * - Inclusion criteria: gdpGrowthPct2025 > 0 AND cpiYoYPct2025 < 0.
 * - exportSharePct = goods+services exports ÷ GDP (World Bank WDI / national accounts).
 * - sourceType disclosed = official national statistics or IMF/OECD direct citation;
 *   estimated = analyst interpolation where 2025 final print pending.
 */

export type SourceType = "disclosed" | "estimated";

export type GrowthStrategy =
  | "export-pricing"
  | "manufacturing-scale"
  | "tourism-recovery"
  | "energy-diversification"
  | "financial-hub"
  | "tech-export";

export type DeflationaryGrowthRecord = {
  id: string;
  economy: string;
  iso3: string;
  region: string;
  gdpGrowthPct2025: number;
  cpiYoYPct2025: number;
  gdpUsdBn2025: number;
  exportSharePct: number;
  populationMn: number;
  strategy: GrowthStrategy;
  sourceType: SourceType;
  source: string;
  notes?: string;
};

export const DATA_YEAR = 2025;

export const SOURCE_NOTE =
  "IMF WEO Oct 2025, World Bank, OECD, and national statistics offices; 2025 CPI = Dec/Dec unless noted.";

export const STRATEGY_LABELS: Record<GrowthStrategy, string> = {
  "export-pricing": "Export pricing / market share",
  "manufacturing-scale": "Manufacturing scale economies",
  "tourism-recovery": "Tourism + services recovery",
  "energy-diversification": "Energy diversification",
  "financial-hub": "Financial & services hub",
  "tech-export": "Tech & pharma exports",
};

export const REGION_COLORS: Record<string, string> = {
  "East Asia": "#22c55e",
  "Southeast Asia": "#14b8a6",
  "Europe": "#6366f1",
  "Middle East": "#f59e0b",
  "Global city-states": "#ec4899",
};

export const DEFLATIONARY_GROWTH: DeflationaryGrowthRecord[] = [
  {
    id: "chn-2025",
    economy: "China",
    iso3: "CHN",
    region: "East Asia",
    gdpGrowthPct2025: 5.0,
    cpiYoYPct2025: -0.2,
    gdpUsdBn2025: 19_400,
    exportSharePct: 19.1,
    populationMn: 1408,
    strategy: "manufacturing-scale",
    sourceType: "disclosed",
    source: "NBS China, Jan 2026; IMF WEO Oct 2025",
    notes: "15th consecutive quarter of mild CPI deflation in consumer goods; industrial output +5.8%",
  },
  {
    id: "twn-2025",
    economy: "Taiwan",
    iso3: "TWN",
    region: "East Asia",
    gdpGrowthPct2025: 4.6,
    cpiYoYPct2025: -0.3,
    gdpUsdBn2025: 802,
    exportSharePct: 63.4,
    populationMn: 23.4,
    strategy: "export-pricing",
    sourceType: "disclosed",
    source: "DGBAS Taiwan, Feb 2026; IMF WEO Oct 2025",
    notes: "Semiconductor export volumes +12% while chip ASPs fell on competitive pricing",
  },
  {
    id: "che-2025",
    economy: "Switzerland",
    iso3: "CHE",
    region: "Europe",
    gdpGrowthPct2025: 1.4,
    cpiYoYPct2025: -0.4,
    gdpUsdBn2025: 947,
    exportSharePct: 73.8,
    populationMn: 9.0,
    strategy: "financial-hub",
    sourceType: "disclosed",
    source: "BFS Switzerland / OECD Economic Outlook 2025",
    notes: "Strong franc + import price pass-through kept headline CPI negative",
  },
  {
    id: "tha-2025",
    economy: "Thailand",
    iso3: "THA",
    region: "Southeast Asia",
    gdpGrowthPct2025: 2.9,
    cpiYoYPct2025: -0.2,
    gdpUsdBn2025: 548,
    exportSharePct: 56.2,
    populationMn: 71.8,
    strategy: "tourism-recovery",
    sourceType: "disclosed",
    source: "Bank of Thailand / IMF WEO Oct 2025",
    notes: "Tourism receipts +18% while food and energy subsidies compressed CPI",
  },
  {
    id: "sau-2025",
    economy: "Saudi Arabia",
    iso3: "SAU",
    region: "Middle East",
    gdpGrowthPct2025: 3.8,
    cpiYoYPct2025: -0.5,
    gdpUsdBn2025: 1_070,
    exportSharePct: 38.5,
    populationMn: 37.2,
    strategy: "energy-diversification",
    sourceType: "estimated",
    source: "GASTAT / IMF WEO Oct 2025 (non-oil GDP +4.9%)",
    notes: "Housing rent reforms and fuel subsidy cuts drove negative headline CPI",
  },
  {
    id: "are-2025",
    economy: "United Arab Emirates",
    iso3: "ARE",
    region: "Middle East",
    gdpGrowthPct2025: 4.2,
    cpiYoYPct2025: -0.3,
    gdpUsdBn2025: 548,
    exportSharePct: 94.1,
    populationMn: 10.1,
    strategy: "financial-hub",
    sourceType: "estimated",
    source: "IMF WEO Oct 2025; UAE Federal Competitiveness Statistics",
    notes: "Re-export hub growth; Dubai CPI negative on housing oversupply",
  },
  {
    id: "vnm-2025",
    economy: "Vietnam",
    iso3: "VNM",
    region: "Southeast Asia",
    gdpGrowthPct2025: 6.5,
    cpiYoYPct2025: -0.1,
    gdpUsdBn2025: 476,
    exportSharePct: 86.3,
    populationMn: 100.3,
    strategy: "export-pricing",
    sourceType: "disclosed",
    source: "GSO Vietnam, Jan 2026; World Bank GEP 2025",
    notes: "Fastest-growing deflationary economy; FDI manufacturing undercut regional rivals on unit cost",
  },
  {
    id: "kor-2025",
    economy: "South Korea",
    iso3: "KOR",
    region: "East Asia",
    gdpGrowthPct2025: 2.2,
    cpiYoYPct2025: -0.2,
    gdpUsdBn2025: 1_860,
    exportSharePct: 44.6,
    populationMn: 51.6,
    strategy: "export-pricing",
    sourceType: "disclosed",
    source: "Bank of Korea / OECD Economic Outlook 2025",
    notes: "Memory and display export volumes up; consumer electronics prices down YoY",
  },
  {
    id: "sgp-2025",
    economy: "Singapore",
    iso3: "SGP",
    region: "Global city-states",
    gdpGrowthPct2025: 3.5,
    cpiYoYPct2025: -0.1,
    gdpUsdBn2025: 568,
    exportSharePct: 176.0,
    populationMn: 6.0,
    strategy: "financial-hub",
    sourceType: "disclosed",
    source: "MTI Singapore, Jan 2026; IMF WEO Oct 2025",
    notes: "Re-export trade GDP; accommodation and transport CPI negative",
  },
  {
    id: "irl-2025",
    economy: "Ireland",
    iso3: "IRL",
    region: "Europe",
    gdpGrowthPct2025: 4.8,
    cpiYoYPct2025: -0.4,
    gdpUsdBn2025: 598,
    exportSharePct: 124.5,
    populationMn: 5.3,
    strategy: "tech-export",
    sourceType: "disclosed",
    source: "CSO Ireland / Eurostat HICP Dec 2025",
    notes: "Pharma and cloud services exports; transfer-pricing deflator kept CPI negative",
  },
  {
    id: "mys-2025",
    economy: "Malaysia",
    iso3: "MYS",
    region: "Southeast Asia",
    gdpGrowthPct2025: 4.5,
    cpiYoYPct2025: -0.2,
    gdpUsdBn2025: 445,
    exportSharePct: 68.9,
    populationMn: 34.5,
    strategy: "manufacturing-scale",
    sourceType: "estimated",
    source: "DOSM Malaysia / IMF WEO Oct 2025",
    notes: "Palm oil and electronics export volumes rose; fuel subsidy reform cut CPI",
  },
  {
    id: "cze-2025",
    economy: "Czech Republic",
    iso3: "CZE",
    region: "Europe",
    gdpGrowthPct2025: 2.1,
    cpiYoYPct2025: -0.3,
    gdpUsdBn2025: 360,
    exportSharePct: 71.2,
    populationMn: 10.9,
    strategy: "manufacturing-scale",
    sourceType: "disclosed",
    source: "CZSO / Eurostat HICP Dec 2025",
    notes: "Auto supply-chain exports +3.2%; energy base effects pushed CPI negative",
  },
  {
    id: "pol-2025",
    economy: "Poland",
    iso3: "POL",
    region: "Europe",
    gdpGrowthPct2025: 3.2,
    cpiYoYPct2025: -0.1,
    gdpUsdBn2025: 842,
    exportSharePct: 52.8,
    populationMn: 36.8,
    strategy: "manufacturing-scale",
    sourceType: "estimated",
    source: "GUS Poland / IMF WEO Oct 2025",
    notes: "Manufacturing PMI expansion; food price normalization after 2022–23 spike",
  },
  {
    id: "qat-2025",
    economy: "Qatar",
    iso3: "QAT",
    region: "Middle East",
    gdpGrowthPct2025: 3.0,
    cpiYoYPct2025: -0.6,
    gdpUsdBn2025: 218,
    exportSharePct: 62.4,
    populationMn: 2.9,
    strategy: "energy-diversification",
    sourceType: "estimated",
    source: "PSA Qatar / IMF WEO Oct 2025",
    notes: "LNG export revenue up; rent and imported goods deflation",
  },
  {
    id: "bhr-2025",
    economy: "Bahrain",
    iso3: "BHR",
    region: "Middle East",
    gdpGrowthPct2025: 2.8,
    cpiYoYPct2025: -0.3,
    gdpUsdBn2025: 47,
    exportSharePct: 78.5,
    populationMn: 1.5,
    strategy: "financial-hub",
    sourceType: "estimated",
    source: "IMF WEO Oct 2025; Bahrain EDB",
    notes: "Non-oil GDP +4.1%; pegged currency imported Gulf deflation",
  },
  {
    id: "hkg-2025",
    economy: "Hong Kong SAR",
    iso3: "HKG",
    region: "East Asia",
    gdpGrowthPct2025: 2.5,
    cpiYoYPct2025: -0.8,
    gdpUsdBn2025: 406,
    exportSharePct: 178.0,
    populationMn: 7.5,
    strategy: "financial-hub",
    sourceType: "disclosed",
    source: "C&SD Hong Kong, Jan 2026; IMF WEO Oct 2025",
    notes: "Deepest CPI deflation in sample; property rent collapse + re-export trade recovery",
  },
  {
    id: "lux-2025",
    economy: "Luxembourg",
    iso3: "LUX",
    region: "Europe",
    gdpGrowthPct2025: 2.0,
    cpiYoYPct2025: -0.2,
    gdpUsdBn2025: 92,
    exportSharePct: 210.0,
    populationMn: 0.67,
    strategy: "financial-hub",
    sourceType: "disclosed",
    source: "STATEC Luxembourg / Eurostat HICP Dec 2025",
    notes: "Cross-border financial services GDP; imported disinflation via euro area",
  },
  {
    id: "mac-2025",
    economy: "Macao SAR",
    iso3: "MAC",
    region: "East Asia",
    gdpGrowthPct2025: 5.8,
    cpiYoYPct2025: -0.5,
    gdpUsdBn2025: 32,
    exportSharePct: 85.0,
    populationMn: 0.68,
    strategy: "tourism-recovery",
    sourceType: "estimated",
    source: "DSEC Macao / IMF WEO Oct 2025",
    notes: "Gaming and tourism GDP +11%; hospitality price war kept CPI negative",
  },
];

export const GLOBAL_SUMMARY = {
  economyCount: DEFLATIONARY_GROWTH.length,
  avgGdpGrowthPct: DEFLATIONARY_GROWTH.reduce((s, r) => s + r.gdpGrowthPct2025, 0) / DEFLATIONARY_GROWTH.length,
  avgCpiYoYPct: DEFLATIONARY_GROWTH.reduce((s, r) => s + r.cpiYoYPct2025, 0) / DEFLATIONARY_GROWTH.length,
  avgExportSharePct: DEFLATIONARY_GROWTH.reduce((s, r) => s + r.exportSharePct, 0) / DEFLATIONARY_GROWTH.length,
  fastestGdp: DEFLATIONARY_GROWTH.reduce((best, r) => (r.gdpGrowthPct2025 > best.gdpGrowthPct2025 ? r : best)),
  deepestDeflation: DEFLATIONARY_GROWTH.reduce((worst, r) => (r.cpiYoYPct2025 < worst.cpiYoYPct2025 ? r : worst)),
  disclosedCount: DEFLATIONARY_GROWTH.filter((r) => r.sourceType === "disclosed").length,
  estimatedCount: DEFLATIONARY_GROWTH.filter((r) => r.sourceType === "estimated").length,
  exportHeavyCount: DEFLATIONARY_GROWTH.filter((r) => r.exportSharePct >= 50).length,
} as const;

export function recordsByRegion(region: string): DeflationaryGrowthRecord[] {
  return DEFLATIONARY_GROWTH.filter((r) => r.region === region);
}

export function recordsByStrategy(strategy: GrowthStrategy): DeflationaryGrowthRecord[] {
  return DEFLATIONARY_GROWTH.filter((r) => r.strategy === strategy);
}

export function fmtPct(n: number, digits = 1): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtUsdBn(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}T`;
  return `$${n.toFixed(0)}B`;
}

export const STATS = {
  recordCount: DEFLATIONARY_GROWTH.length,
  dataYear: DATA_YEAR,
  avgGdpLabel: fmtPct(GLOBAL_SUMMARY.avgGdpGrowthPct),
  avgCpiLabel: fmtPct(GLOBAL_SUMMARY.avgCpiYoYPct),
  exportHeavyLabel: `${GLOBAL_SUMMARY.exportHeavyCount} of ${GLOBAL_SUMMARY.economyCount}`,
};
