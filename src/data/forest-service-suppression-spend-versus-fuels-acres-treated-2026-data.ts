/**
 * Forest Service suppression spend versus fuels acres treated (2026).
 *
 * Core question: How has USDA Forest Service wildfire suppression outlay
 * grown versus acres of hazardous-fuels treatment since FY2010?
 *
 * Desk join: NIFC federal firefighting suppression costs (FS column, fiscal
 * year, nominal dollars) against Forests & Rangelands / FACTS hazardous-fuels
 * accomplishment acres (FS WUI+Non-WUI totals and treatment-type breakouts).
 * Ratio series (suppression $ per fuels acre) are analytical products — not
 * an official NIFC or Forest Service published index.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Forest Service suppression dollars are National Interagency Fire Center " +
  "(NIFC) fiscal-year firefighting costs (suppression only), Forest Service " +
  "column, nominal dollars. Hazardous-fuels acres are USDA Forest Service " +
  "totals from the Forests & Rangelands federal fuels-management " +
  "accomplishments tables (FACTS / NFPORS lineage), including WUI and " +
  "non-WUI designations and prescribed-fire, wildfire, mechanical, and " +
  "other treatment-type breakouts. Suppression-per-acre ratios and " +
  "FY2010=100 indexes are desk composites from that join; NIFC and the " +
  "Forest Service do not publish an official suppression-to-fuels-acres " +
  "league table. FY2024 fuels acres are disclosed; NIFC FS suppression for " +
  "FY2024 was not yet in the published table at desk close, so the dual " +
  "panel runs through FY2023 unless noted.";

export const SOURCES = [
  {
    label: "NIFC — Federal Firefighting Costs (Suppression Only)",
    url: "https://www.nifc.gov/fire-information/statistics/suppression-costs",
  },
  {
    label: "Forests & Rangelands — FS/DOI Fuels Accomplishments FY2003–2025",
    url: "https://www.forestsandrangelands.gov/documents/resources/reports/2025/hfr-doi-fs-accomplishments-fy2003-2025.pdf",
  },
  {
    label: "CRS — Federal Wildfire Management Funding Trends (R46583)",
    url: "https://crsreports.congress.gov/product/pdf/R/R46583",
  },
  {
    label: "USDA Forest Service — Wildfire Crisis Strategy / budget justifications",
    url: "https://www.fs.usda.gov/managing-land/fire",
  },
] as const;

export const VIZ_MARKERS = [
  "Suppression $ vs fuels acres",
  "Dollars per treated acre",
  "Treatment mix & WUI share",
] as const;

/** Headline punchline */
export const HEADLINE = {
  /** Panel start / end fiscal years with both series */
  fyStart: 2010,
  fyEnd: 2023,
  /** FY2010 FS suppression ($M, NIFC) */
  fy2010SuppressM: 578,
  /** FY2021 peak FS suppression ($M) */
  peakSuppressM: 3741,
  peakFy: 2021,
  /** FY2023 FS suppression ($M) */
  fy2023SuppressM: 2700,
  /** Multiple of FY2010 suppression in FY2023 */
  suppressMultipleVs2010: 4.7,
  /** FY2010 FS fuels acres treated (millions) */
  fy2010FuelsM: 3.26,
  /** FY2023 FS fuels acres (millions) — record in panel */
  fy2023FuelsM: 3.89,
  /** FY2020 trough fuels acres (millions) */
  troughFuelsM: 2.34,
  troughFy: 2020,
  /** FY2010 suppression $ per fuels acre */
  fy2010PerAcre: 177,
  /** FY2021 peak $ per fuels acre */
  peakPerAcre: 1116,
  /** FY2023 $ per fuels acre */
  fy2023PerAcre: 693,
  /** Fuels acres index FY2023 (FY2010=100) */
  fuelsIndex2023: 119,
  /** Suppression index FY2023 (FY2010=100) */
  suppressIndex2023: 467,
  /** WUI share of FS acres FY2023 (%) */
  wuiShare2023Pct: 67,
  /** Prescribed-fire share of treatment-type acres FY2023 (%) */
  rxShare2023Pct: 50,
} as const;

export type EraId = "pre-spike" | "mega-fire" | "crisis-ramp";

export interface AnnualRow {
  fy: number;
  /** FS suppression outlay, $ millions (NIFC, nominal) */
  suppressM: number;
  /** FS hazardous-fuels acres treated (WUI+Non-WUI total) */
  fuelsAcres: number;
  /** WUI designation acres */
  wuiAcres: number;
  /** Non-WUI designation acres */
  nonWuiAcres: number;
  /** Treatment-type acres (may differ slightly from WUI totals in early years) */
  rxFireAcres: number;
  wildfireAcres: number;
  mechanicalAcres: number;
  otherAcres: number;
  confidence: Confidence;
  era: EraId;
  note?: string;
}

/**
 * Dual annual panel FY2010–FY2023.
 * Suppression: NIFC FS column ($). Fuels: HFR FS WUI+Non-WUI totals.
 * FY2023 fuels row is the unlabeled FY2023 block in the 2025 HFR PDF
 * (FS total 3,894,062) immediately preceding the FY2024 block.
 */
export const ANNUAL: AnnualRow[] = [
  {
    fy: 2010,
    suppressM: 578.285,
    fuelsAcres: 3_262_000,
    wuiAcres: 1_965_000,
    nonWuiAcres: 1_297_000,
    rxFireAcres: 1_612_090,
    wildfireAcres: 164_218,
    mechanicalAcres: 1_435_000,
    otherAcres: 51_000,
    confidence: "disclosed",
    era: "pre-spike",
    note: "Includes Recovery Act–funded FS treatments",
  },
  {
    fy: 2011,
    suppressM: 1_055.736,
    fuelsAcres: 2_772_000,
    wuiAcres: 1_612_000,
    nonWuiAcres: 1_160_000,
    rxFireAcres: 1_081_381,
    wildfireAcres: 400_957,
    mechanicalAcres: 1_255_000,
    otherAcres: 35_000,
    confidence: "disclosed",
    era: "pre-spike",
  },
  {
    fy: 2012,
    suppressM: 1_436.614,
    fuelsAcres: 2_620_000,
    wuiAcres: 1_862_000,
    nonWuiAcres: 758_000,
    rxFireAcres: 1_230_593,
    wildfireAcres: 141_314,
    mechanicalAcres: 1_231_000,
    otherAcres: 17_000,
    confidence: "disclosed",
    era: "pre-spike",
  },
  {
    fy: 2013,
    suppressM: 1_341.735,
    fuelsAcres: 2_626_000,
    wuiAcres: 1_738_000,
    nonWuiAcres: 888_000,
    rxFireAcres: 1_279_275,
    wildfireAcres: 465_914,
    mechanicalAcres: 861_000,
    otherAcres: 20_000,
    confidence: "disclosed",
    era: "pre-spike",
  },
  {
    fy: 2014,
    suppressM: 1_195.955,
    fuelsAcres: 2_542_000,
    wuiAcres: 1_725_000,
    nonWuiAcres: 817_000,
    rxFireAcres: 1_357_791,
    wildfireAcres: 246_018,
    mechanicalAcres: 794_000,
    otherAcres: 19_000,
    confidence: "disclosed",
    era: "pre-spike",
  },
  {
    fy: 2015,
    suppressM: 1_713.0,
    fuelsAcres: 2_317_000,
    wuiAcres: 1_471_000,
    nonWuiAcres: 846_000,
    rxFireAcres: 1_131_388,
    wildfireAcres: 436_090,
    mechanicalAcres: 733_000,
    otherAcres: 24_000,
    confidence: "disclosed",
    era: "mega-fire",
  },
  {
    fy: 2016,
    suppressM: 1_603.806,
    fuelsAcres: 3_082_000,
    wuiAcres: 1_870_000,
    nonWuiAcres: 1_212_000,
    rxFireAcres: 1_380_568,
    wildfireAcres: 932_217,
    mechanicalAcres: 734_000,
    otherAcres: 35_000,
    confidence: "disclosed",
    era: "mega-fire",
  },
  {
    fy: 2017,
    suppressM: 2_410.165,
    fuelsAcres: 2_600_000,
    wuiAcres: 1_413_000,
    nonWuiAcres: 1_187_000,
    rxFireAcres: 1_115_621,
    wildfireAcres: 715_100,
    mechanicalAcres: 727_000,
    otherAcres: 43_000,
    confidence: "disclosed",
    era: "mega-fire",
  },
  {
    fy: 2018,
    suppressM: 2_615.256,
    fuelsAcres: 3_192_000,
    wuiAcres: 1_985_000,
    nonWuiAcres: 1_207_000,
    rxFireAcres: 1_652_929,
    wildfireAcres: 635_690,
    mechanicalAcres: 841_000,
    otherAcres: 63_000,
    confidence: "disclosed",
    era: "mega-fire",
  },
  {
    fy: 2019,
    suppressM: 1_150.0,
    fuelsAcres: 2_594_225,
    wuiAcres: 1_599_476,
    nonWuiAcres: 994_750,
    rxFireAcres: 1_229_351,
    wildfireAcres: 493_829,
    mechanicalAcres: 816_063,
    otherAcres: 54_982,
    confidence: "disclosed",
    era: "mega-fire",
  },
  {
    fy: 2020,
    suppressM: 1_764.0,
    fuelsAcres: 2_337_857,
    wuiAcres: 1_350_869,
    nonWuiAcres: 986_988,
    rxFireAcres: 1_028_794,
    wildfireAcres: 363_538,
    mechanicalAcres: 884_197,
    otherAcres: 61_328,
    confidence: "disclosed",
    era: "mega-fire",
  },
  {
    fy: 2021,
    suppressM: 3_741.0,
    fuelsAcres: 3_353_607,
    wuiAcres: 2_066_591,
    nonWuiAcres: 1_287_015,
    rxFireAcres: 1_693_606,
    wildfireAcres: 758_675,
    mechanicalAcres: 822_427,
    otherAcres: 78_900,
    confidence: "disclosed",
    era: "crisis-ramp",
  },
  {
    fy: 2022,
    suppressM: 2_900.0,
    fuelsAcres: 2_924_045,
    wuiAcres: 1_982_822,
    nonWuiAcres: 941_223,
    rxFireAcres: 1_669_751,
    wildfireAcres: 384_821,
    mechanicalAcres: 824_086,
    otherAcres: 45_388,
    confidence: "disclosed",
    era: "crisis-ramp",
  },
  {
    fy: 2023,
    suppressM: 2_700.0,
    fuelsAcres: 3_894_062,
    wuiAcres: 2_620_455,
    nonWuiAcres: 1_273_608,
    rxFireAcres: 1_951_372,
    wildfireAcres: 615_172,
    mechanicalAcres: 1_242_200,
    otherAcres: 85_318,
    confidence: "disclosed",
    era: "crisis-ramp",
    note: "Record FS fuels acres in panel; Wildfire Crisis Strategy ramp",
  },
];

/** FY2024 fuels-only extension (suppression not yet in NIFC table) */
export const FY2024_FUELS = {
  fy: 2024,
  fuelsAcres: 3_683_214,
  wuiAcres: 2_457_420,
  nonWuiAcres: 1_225_795,
  rxFireAcres: 2_186_635,
  wildfireAcres: 361_848,
  mechanicalAcres: 1_045_350,
  otherAcres: 89_381,
  confidence: "disclosed" as Confidence,
  note: "NFS accomplishments; excludes SFA/CWDG state grant acres",
} as const;

export function suppressPerAcre(row: AnnualRow): number {
  return (row.suppressM * 1_000_000) / row.fuelsAcres;
}

export function suppressIndex(row: AnnualRow): number {
  const base = ANNUAL[0]!.suppressM;
  return (row.suppressM / base) * 100;
}

export function fuelsIndex(row: AnnualRow): number {
  const base = ANNUAL[0]!.fuelsAcres;
  return (row.fuelsAcres / base) * 100;
}

export function wuiSharePct(row: AnnualRow): number {
  const tot = row.wuiAcres + row.nonWuiAcres;
  return tot > 0 ? (row.wuiAcres / tot) * 100 : 0;
}

export function dualSeries() {
  return ANNUAL.map((r) => ({
    fy: r.fy,
    label: `FY${r.fy}`,
    suppressM: Math.round(r.suppressM),
    fuelsAcresM: +(r.fuelsAcres / 1_000_000).toFixed(2),
    perAcre: Math.round(suppressPerAcre(r)),
    suppressIdx: Math.round(suppressIndex(r)),
    fuelsIdx: Math.round(fuelsIndex(r)),
    wuiShare: +wuiSharePct(r).toFixed(1),
    era: r.era,
  }));
}

export function eraSummary() {
  const eras: EraId[] = ["pre-spike", "mega-fire", "crisis-ramp"];
  return eras.map((era) => {
    const rows = ANNUAL.filter((r) => r.era === era);
    const avgSuppress =
      rows.reduce((s, r) => s + r.suppressM, 0) / rows.length;
    const avgFuels =
      rows.reduce((s, r) => s + r.fuelsAcres, 0) / rows.length;
    const avgPerAcre =
      rows.reduce((s, r) => s + suppressPerAcre(r), 0) / rows.length;
    return {
      era,
      label:
        era === "pre-spike"
          ? "FY2010–14 · pre-spike"
          : era === "mega-fire"
            ? "FY2015–20 · mega-fire years"
            : "FY2021–23 · crisis ramp",
      years: rows.length,
      avgSuppressM: Math.round(avgSuppress),
      avgFuelsM: +(avgFuels / 1_000_000).toFixed(2),
      avgPerAcre: Math.round(avgPerAcre),
    };
  });
}

export function treatmentMixForFy(fy: number) {
  const row = ANNUAL.find((r) => r.fy === fy) ?? ANNUAL[ANNUAL.length - 1]!;
  const parts = [
    { name: "Prescribed fire", acres: row.rxFireAcres, fill: "#d97706" },
    { name: "Mechanical", acres: row.mechanicalAcres, fill: "#0d9488" },
    { name: "Wildfire (counted)", acres: row.wildfireAcres, fill: "#e11d48" },
    { name: "Other", acres: row.otherAcres, fill: "#64748b" },
  ];
  const total = parts.reduce((s, p) => s + p.acres, 0);
  return parts.map((p) => ({
    ...p,
    sharePct: total > 0 ? +((p.acres / total) * 100).toFixed(1) : 0,
  }));
}

export function wuiNonWuiLadder() {
  return ANNUAL.map((r) => ({
    fy: r.fy,
    label: `FY${String(r.fy).slice(2)}`,
    wuiM: +(r.wuiAcres / 1_000_000).toFixed(2),
    nonWuiM: +(r.nonWuiAcres / 1_000_000).toFixed(2),
  }));
}

export function scatterPoints() {
  return ANNUAL.map((r) => ({
    fy: r.fy,
    fuelsM: +(r.fuelsAcres / 1_000_000).toFixed(2),
    suppressM: Math.round(r.suppressM),
    perAcre: Math.round(suppressPerAcre(r)),
    era: r.era,
  }));
}

export function fmtM(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}B`;
  return `$${Math.round(n)}M`;
}

export function fmtAcresM(n: number): string {
  return `${n.toFixed(2)}M ac`;
}

export function fmtPerAcre(n: number): string {
  return `$${n.toLocaleString("en-US")}/ac`;
}

export function fmtPct(n: number): string {
  return `${n.toFixed(0)}%`;
}
