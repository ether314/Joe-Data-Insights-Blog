/**
 * Phosphate fertilizer export dependence — processed P fertilizers (MAP/DAP/TSP),
 * not raw phosphate rock. Primary: TFI phosphorus brief (2025), IFPRI/FAO (2025),
 * IFA demand notes; corridors informed by IFPRI trade analysis + UN Comtrade patterns.
 */

export const SOURCE_NOTE =
  "Export and production shares for processed phosphate fertilizers (MAP, DAP, TSP) from The Fertilizer Institute phosphorus brief (2025). China export volumes and importer corridor shares from IFPRI (March 2025) and IFPRI fertilizer-trade analysis (2021–2023). Global phosphate trade tonnage context from FAO Focus on Fertilizers. Distinct from USGS phosphate-rock mine/reserve tables.";

export const SOURCES = [
  {
    label: "TFI — Phosphorus / phosphate (P) one-pager (2025)",
    url: "https://www.tfi.org/wp-content/uploads/2025/10/phosphorus-one-pager-1.pdf",
  },
  {
    label: "IFPRI — High global phosphate prices (Mar 2025)",
    url: "https://www.ifpri.org/blog/high-global-phosphate-prices-pose-potential-food-security-risks/",
  },
  {
    label: "IFPRI — Global fertilizer trade 2021–2023",
    url: "https://southasia.ifpri.info/2024/05/13/global-fertilizer-trade-2021-2023-what-happened-after-war-related-price-spikes/",
  },
  {
    label: "FAO — Focus on fertilizers",
    url: "https://openknowledge.fao.org/server/api/core/bitstreams/f981b7a6-a2bb-46ff-9cf7-b00b177307ab/content",
  },
] as const;

export type Confidence = "disclosed" | "estimated" | "derived";

export type Exporter = {
  country: string;
  shortLabel: string;
  iso: string;
  /** Share of world processed phosphate fertilizer exports (%) */
  exportSharePct: number;
  /** Share of world MAP/DAP/TSP production (%) */
  productionSharePct: number;
  confidence: Confidence;
  note?: string;
};

/** Leading exporters / producers of processed phosphates (TFI 2025). */
export const EXPORTERS: Exporter[] = [
  {
    country: "Morocco",
    shortLabel: "Morocco",
    iso: "MA",
    exportSharePct: 30,
    productionSharePct: 14,
    confidence: "disclosed",
    note: "Leading seaborne supplier; rising TSP share of processed exports",
  },
  {
    country: "China",
    shortLabel: "China",
    iso: "CN",
    exportSharePct: 21,
    productionSharePct: 44,
    confidence: "disclosed",
    note: "Largest producer; export licensing since 2021 cuts seaborne tons",
  },
  {
    country: "Saudi Arabia",
    shortLabel: "Saudi Arabia",
    iso: "SA",
    exportSharePct: 16,
    productionSharePct: 9,
    confidence: "disclosed",
  },
  {
    country: "Russia",
    shortLabel: "Russia",
    iso: "RU",
    exportSharePct: 15,
    productionSharePct: 9,
    confidence: "disclosed",
  },
  {
    country: "United States",
    shortLabel: "United States",
    iso: "US",
    exportSharePct: 4,
    productionSharePct: 8,
    confidence: "disclosed",
    note: "Net producer that also imports; AD/CVD on Morocco & Russia since 2019",
  },
  {
    country: "Other exporters",
    shortLabel: "Other",
    iso: "XX",
    exportSharePct: 14,
    productionSharePct: 16,
    confidence: "derived",
    note: "Residual to 100% across ~22 exporting / ~30 producing countries (TFI)",
  },
];

export const HEADLINE = {
  top3ExportSharePct: 67,
  top3Labels: "Morocco + China + Saudi Arabia",
  top4ExportSharePct: 82,
  top4Labels: "Morocco + China + Saudi + Russia",
  top5ProductionSharePct: 84,
  chinaExport2021Mt: 10.0,
  chinaExport2024Mt: 6.6,
  chinaExportDropPct: 34,
  worldPhosphateTrade2023Mt: 30.4,
  exporterCount: 22,
  producerCount: 30,
} as const;

/** Approximate DAP/MAP export volumes by major supplier (Mt product), IFPRI + TFI context. */
export const EXPORT_VOLUME_HISTORY: {
  year: number;
  morocco: number;
  china: number;
  saudi: number;
  russia: number;
  other: number;
}[] = [
  { year: 2019, morocco: 7.8, china: 9.0, saudi: 4.2, russia: 3.5, other: 5.5 },
  { year: 2020, morocco: 8.1, china: 9.0, saudi: 4.4, russia: 3.6, other: 5.4 },
  { year: 2021, morocco: 8.4, china: 10.0, saudi: 4.6, russia: 3.8, other: 5.2 },
  { year: 2022, morocco: 8.0, china: 5.5, saudi: 4.8, russia: 4.0, other: 4.8 },
  { year: 2023, morocco: 8.6, china: 7.2, saudi: 5.0, russia: 4.5, other: 5.1 },
  { year: 2024, morocco: 9.0, china: 6.6, saudi: 5.1, russia: 4.6, other: 5.0 },
];

export type ImporterCorridor = {
  importer: string;
  shortLabel: string;
  iso: string;
  year: number;
  /** Share of that importer's DAP imports by origin (%) */
  origins: { exporter: string; iso: string; sharePct: number }[];
  note?: string;
};

/** DAP import origin shares for food-system-critical buyers (IFPRI trade notes). */
export const IMPORTER_CORRIDORS: ImporterCorridor[] = [
  {
    importer: "India",
    shortLabel: "India",
    iso: "IN",
    year: 2023,
    origins: [
      { exporter: "China", iso: "CN", sharePct: 39 },
      { exporter: "Morocco", iso: "MA", sharePct: 13 },
      { exporter: "Russia", iso: "RU", sharePct: 10 },
      { exporter: "Saudi Arabia", iso: "SA", sharePct: 18 },
      { exporter: "Other", iso: "XX", sharePct: 20 },
    ],
    note: "China share of Indian DAP imports swung 19%→39% from 2022→2023 as licensing eased",
  },
  {
    importer: "Brazil",
    shortLabel: "Brazil",
    iso: "BR",
    year: 2023,
    origins: [
      { exporter: "China", iso: "CN", sharePct: 20 },
      { exporter: "Morocco", iso: "MA", sharePct: 28 },
      { exporter: "Russia", iso: "RU", sharePct: 22 },
      { exporter: "Saudi Arabia", iso: "SA", sharePct: 14 },
      { exporter: "Other", iso: "XX", sharePct: 16 },
    ],
    note: "China share of Brazilian DAP was 27% in 2021, 14% in 2022, 20% in 2023",
  },
  {
    importer: "Kenya",
    shortLabel: "Kenya",
    iso: "KE",
    year: 2023,
    origins: [
      { exporter: "Saudi Arabia", iso: "SA", sharePct: 83 },
      { exporter: "Morocco", iso: "MA", sharePct: 17 },
      { exporter: "Russia", iso: "RU", sharePct: 0 },
      { exporter: "China", iso: "CN", sharePct: 0 },
      { exporter: "Other", iso: "XX", sharePct: 0 },
    ],
    note: "Two-origin market in 2023; Russia held 11% in 2021 then exited",
  },
  {
    importer: "European Union",
    shortLabel: "EU",
    iso: "EU",
    year: 2023,
    origins: [
      { exporter: "Morocco", iso: "MA", sharePct: 42 },
      { exporter: "Russia", iso: "RU", sharePct: 26 },
      { exporter: "Saudi Arabia", iso: "SA", sharePct: 12 },
      { exporter: "China", iso: "CN", sharePct: 8 },
      { exporter: "Other", iso: "XX", sharePct: 12 },
    ],
    note: "Fertilizers exempted from EU sanctions on Russia; Morocco remains primary origin",
  },
  {
    importer: "Bangladesh",
    shortLabel: "Bangladesh",
    iso: "BD",
    year: 2023,
    origins: [
      { exporter: "China", iso: "CN", sharePct: 35 },
      { exporter: "Morocco", iso: "MA", sharePct: 22 },
      { exporter: "Saudi Arabia", iso: "SA", sharePct: 20 },
      { exporter: "Russia", iso: "RU", sharePct: 8 },
      { exporter: "Other", iso: "XX", sharePct: 15 },
    ],
    note: "Illustrative South Asian corridor pattern consistent with IFPRI/FAO importer mix",
  },
];

export const EXPORTER_COLORS: Record<string, string> = {
  Morocco: "#0d9488",
  China: "#e11d48",
  "Saudi Arabia": "#f59e0b",
  Russia: "#6366f1",
  "United States": "#0ea5e9",
  Other: "#94a3b8",
  "Other exporters": "#94a3b8",
};

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtMt(n: number, digits = 1): string {
  return `${n.toFixed(digits)} Mt`;
}

export function rankedExporters(): Exporter[] {
  return [...EXPORTERS]
    .filter((e) => e.iso !== "XX")
    .sort((a, b) => b.exportSharePct - a.exportSharePct);
}

export function productionVsExportGap(e: Exporter): number {
  return e.exportSharePct - e.productionSharePct;
}
