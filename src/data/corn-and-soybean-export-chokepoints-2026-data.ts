/**
 * Corn and soybean export chokepoints (2026).
 *
 * Core question: How concentrated are corn and soybean net-exportable
 * supplies, and what share moves through a few ports?
 *
 * Primary anchors: USDA WASDE (July–Aug 2026 vintage for 2026/27 trade);
 * UN Comtrade / WITS oilseed & cereal export quantities (recent HS years);
 * port-share literature (USACE / grain elevators; ANTAQ / Brazilian
 * complex; Black Sea corridor reporting) labeled estimated where not in WASDE.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Country export tonnages follow USDA WASDE July–August 2026 framing for 2026/27 marketing-year trade (world corn exports ~210 Mt; world soybean exports ~190 Mt). Port and corridor shares are analytical estimates from USACE/grain-elevator throughput patterns, ANTAQ/Brazilian complex reporting, and Black Sea corridor summaries — not a WASDE line item. COMTRADE HS cereal/oilseed quantities can disagree with WASDE on timing, product coverage (beans vs meal/oil), and re-exports. HHI and cumulative Top-k maths are desk-constructed. Not a freight or basis trading guide.";

export const SOURCES = [
  {
    label: "USDA WASDE — July 2026 (WASDE-672)",
    url: "https://www.usda.gov/oce/commodity/wasde",
  },
  {
    label: "USDA FAS PSD Online — coarse grains & oilseeds",
    url: "https://apps.fas.usda.gov/psdonline/app/index.html",
  },
  {
    label: "UN Comtrade / WITS — cereals & oilseeds export quantities",
    url: "https://wits.worldbank.org/",
  },
  {
    label: "USACE / Mississippi River grain export corridor summaries",
    url: "https://www.mvr.usace.army.mil/",
  },
  {
    label: "ANTAQ — Brazilian port throughput (soy complex)",
    url: "https://www.antaq.gov.br/",
  },
] as const;

/** Headline punchline — Top-origin share */
export const HEADLINE = {
  worldCornExportsMt: 210.0,
  worldSoyExportsMt: 190.4,
  usCornExportsMt: 81.3,
  brazilCornExportsMt: 44.0,
  argentinaCornExportsMt: 38.0,
  ukraineCornExportsMt: 22.0,
  brazilSoyExportsMt: 118.0,
  usSoyExportsMt: 45.2,
  argentinaSoyExportsMt: 6.2,
  cornTop3SharePct: 77.8,
  cornTop4SharePct: 88.2,
  soyTop2SharePct: 85.7,
  soyBrazilSharePct: 62.0,
  gulfShareOfUsGrainExportsPct: 58,
  santosShareOfBrazilSoyExportsPct: 34,
  blackSeaShareOfUkraineCornPct: 78,
  topOriginSoyLabel: "Brazil + US",
  topOriginCornLabel: "US + Brazil + Argentina",
} as const;

export type CropId = "corn" | "soy";

export type OriginId =
  | "us"
  | "brazil"
  | "argentina"
  | "ukraine"
  | "paraguay"
  | "canada"
  | "eu"
  | "russia"
  | "other";

export const CORN_ORIGINS: {
  id: OriginId;
  label: string;
  mt: number;
  sharePct: number;
  confidence: Confidence;
  note: string;
}[] = [
  {
    id: "us",
    label: "United States",
    mt: 81.3,
    sharePct: 38.7,
    confidence: "disclosed",
    note: "WASDE 2026/27 corn export projection (~3.275 bb)",
  },
  {
    id: "brazil",
    label: "Brazil",
    mt: 44.0,
    sharePct: 21.0,
    confidence: "disclosed",
    note: "WASDE Brazil corn exports 2026/27",
  },
  {
    id: "argentina",
    label: "Argentina",
    mt: 38.0,
    sharePct: 18.1,
    confidence: "disclosed",
    note: "WASDE Argentina corn exports 2026/27",
  },
  {
    id: "ukraine",
    label: "Ukraine",
    mt: 22.0,
    sharePct: 10.5,
    confidence: "disclosed",
    note: "WASDE Ukraine corn exports (Aug cut vs July)",
  },
  {
    id: "eu",
    label: "EU",
    mt: 4.5,
    sharePct: 2.1,
    confidence: "estimated",
    note: "Residual exporter; EU is also a large importer",
  },
  {
    id: "russia",
    label: "Russia",
    mt: 4.0,
    sharePct: 1.9,
    confidence: "estimated",
    note: "Black Sea competitor slice; PSD-carried",
  },
  {
    id: "other",
    label: "Other exporters",
    mt: 16.2,
    sharePct: 7.7,
    confidence: "carried",
    note: "South Africa, Canada, Paraguay, etc. residual to world total",
  },
];

export const SOY_ORIGINS: {
  id: OriginId;
  label: string;
  mt: number;
  sharePct: number;
  confidence: Confidence;
  note: string;
}[] = [
  {
    id: "brazil",
    label: "Brazil",
    mt: 118.0,
    sharePct: 62.0,
    confidence: "disclosed",
    note: "WASDE Brazil soybean exports 2026/27",
  },
  {
    id: "us",
    label: "United States",
    mt: 45.2,
    sharePct: 23.7,
    confidence: "disclosed",
    note: "WASDE US soybean exports 2026/27 (~1.66 bb)",
  },
  {
    id: "argentina",
    label: "Argentina",
    mt: 6.2,
    sharePct: 3.3,
    confidence: "disclosed",
    note: "Bean exports thin; crush → meal/oil is the larger Argentine pipe",
  },
  {
    id: "paraguay",
    label: "Paraguay",
    mt: 6.5,
    sharePct: 3.4,
    confidence: "estimated",
    note: "PSD / COMTRADE bean export slice",
  },
  {
    id: "canada",
    label: "Canada",
    mt: 4.8,
    sharePct: 2.5,
    confidence: "estimated",
    note: "Western Canada bean exports",
  },
  {
    id: "other",
    label: "Other exporters",
    mt: 9.7,
    sharePct: 5.1,
    confidence: "carried",
    note: "Residual to world soybean export total",
  },
];

/** Cumulative Top-k origin concentration (export share %) */
export const ORIGIN_CUMULATIVE: {
  crop: CropId;
  k: number;
  sharePct: number;
  label: string;
}[] = [
  { crop: "corn", k: 1, sharePct: 38.7, label: "US" },
  { crop: "corn", k: 2, sharePct: 59.7, label: "US + Brazil" },
  { crop: "corn", k: 3, sharePct: 77.8, label: "US + Brazil + Argentina" },
  { crop: "corn", k: 4, sharePct: 88.2, label: "+ Ukraine" },
  { crop: "soy", k: 1, sharePct: 62.0, label: "Brazil" },
  { crop: "soy", k: 2, sharePct: 85.7, label: "Brazil + US" },
  { crop: "soy", k: 3, sharePct: 89.1, label: "+ Paraguay" },
  { crop: "soy", k: 4, sharePct: 92.4, label: "+ Argentina" },
];

export type PortId =
  | "us_gulf"
  | "us_pnw"
  | "santos"
  | "paranagua"
  | "rio_grande"
  | "rosario"
  | "black_sea_ua"
  | "other";

/** Port / corridor share of national (or crop) export flow */
export const PORT_CHOKEPOINTS: {
  id: PortId;
  label: string;
  crop: CropId | "both";
  country: string;
  shareOfNationalExportsPct: number;
  approxMt: number;
  confidence: Confidence;
  note: string;
}[] = [
  {
    id: "us_gulf",
    label: "US Gulf (Lower Miss. + Gulf elevators)",
    crop: "both",
    country: "United States",
    shareOfNationalExportsPct: 58,
    approxMt: 73.4,
    confidence: "estimated",
    note: "Analytical share of combined US corn+soy export tons via Gulf complex",
  },
  {
    id: "us_pnw",
    label: "US Pacific Northwest",
    crop: "both",
    country: "United States",
    shareOfNationalExportsPct: 18,
    approxMt: 22.8,
    confidence: "estimated",
    note: "Asia-bound corn/soy PNW slice",
  },
  {
    id: "santos",
    label: "Santos",
    crop: "soy",
    country: "Brazil",
    shareOfNationalExportsPct: 34,
    approxMt: 40.1,
    confidence: "estimated",
    note: "Largest single Brazilian soy load-port share (ANTAQ-era pattern)",
  },
  {
    id: "paranagua",
    label: "Paranaguá",
    crop: "soy",
    country: "Brazil",
    shareOfNationalExportsPct: 22,
    approxMt: 26.0,
    confidence: "estimated",
    note: "Southern Brazil soy complex",
  },
  {
    id: "rio_grande",
    label: "Rio Grande",
    crop: "soy",
    country: "Brazil",
    shareOfNationalExportsPct: 12,
    approxMt: 14.2,
    confidence: "estimated",
    note: "RS load-port; weather-sensitive draft",
  },
  {
    id: "rosario",
    label: "Greater Rosario / Up-River",
    crop: "corn",
    country: "Argentina",
    shareOfNationalExportsPct: 72,
    approxMt: 27.4,
    confidence: "estimated",
    note: "Paraná Up-River elevator complex for Argentine grains",
  },
  {
    id: "black_sea_ua",
    label: "Ukrainian Black Sea ports",
    crop: "corn",
    country: "Ukraine",
    shareOfNationalExportsPct: 78,
    approxMt: 17.2,
    confidence: "estimated",
    note: "Corridor-dependent; river/rail alternatives thinner",
  },
];

/** Destination absorption of soy beans (COMTRADE / PSD import framing) */
export const SOY_DESTINATIONS: {
  id: string;
  label: string;
  sharePct: number;
  mt: number;
  confidence: Confidence;
}[] = [
  { id: "china", label: "China", sharePct: 58, mt: 110.4, confidence: "estimated" },
  { id: "eu", label: "EU", sharePct: 8, mt: 15.2, confidence: "estimated" },
  { id: "mexico", label: "Mexico", sharePct: 4, mt: 7.6, confidence: "estimated" },
  { id: "egypt", label: "Egypt", sharePct: 3, mt: 5.7, confidence: "estimated" },
  { id: "other_asia", label: "Other Asia", sharePct: 15, mt: 28.6, confidence: "carried" },
  { id: "other", label: "Other", sharePct: 12, mt: 22.9, confidence: "carried" },
];

/** Destination absorption of corn */
export const CORN_DESTINATIONS: {
  id: string;
  label: string;
  sharePct: number;
  mt: number;
  confidence: Confidence;
}[] = [
  { id: "mexico", label: "Mexico", sharePct: 12, mt: 25.2, confidence: "estimated" },
  { id: "japan", label: "Japan", sharePct: 8, mt: 16.8, confidence: "estimated" },
  { id: "china", label: "China", sharePct: 7, mt: 14.7, confidence: "estimated" },
  { id: "korea", label: "South Korea", sharePct: 5, mt: 10.5, confidence: "estimated" },
  { id: "eu", label: "EU", sharePct: 11, mt: 23.1, confidence: "estimated" },
  { id: "se_asia", label: "SE Asia", sharePct: 14, mt: 29.4, confidence: "carried" },
  { id: "mena", label: "MENA", sharePct: 18, mt: 37.8, confidence: "carried" },
  { id: "other", label: "Other", sharePct: 25, mt: 52.5, confidence: "carried" },
];

/** Marketing-year path for top-origin export shares (WASDE-carried desk series) */
export const ORIGIN_SHARE_PATH: {
  year: string;
  cornUsPct: number;
  cornBrazilPct: number;
  cornArgentinaPct: number;
  soyBrazilPct: number;
  soyUsPct: number;
}[] = [
  { year: "2022/23", cornUsPct: 32, cornBrazilPct: 24, cornArgentinaPct: 16, soyBrazilPct: 53, soyUsPct: 30 },
  { year: "2023/24", cornUsPct: 34, cornBrazilPct: 23, cornArgentinaPct: 17, soyBrazilPct: 56, soyUsPct: 28 },
  { year: "2024/25", cornUsPct: 36, cornBrazilPct: 22, cornArgentinaPct: 17, soyBrazilPct: 59, soyUsPct: 26 },
  { year: "2025/26", cornUsPct: 39, cornBrazilPct: 21, cornArgentinaPct: 18, soyBrazilPct: 61, soyUsPct: 24 },
  { year: "2026/27", cornUsPct: 38.7, cornBrazilPct: 21.0, cornArgentinaPct: 18.1, soyBrazilPct: 62.0, soyUsPct: 23.7 },
];

/** Exportable supply vs domestic crush/feed (analytical balance framing) */
export const BALANCE_LENS: {
  crop: CropId;
  country: string;
  productionMt: number;
  domesticUseMt: number;
  exportsMt: number;
  exportableSharePct: number;
}[] = [
  { crop: "corn", country: "United States", productionMt: 406, domesticUseMt: 320, exportsMt: 81.3, exportableSharePct: 20.0 },
  { crop: "corn", country: "Brazil", productionMt: 128, domesticUseMt: 80, exportsMt: 44.0, exportableSharePct: 34.4 },
  { crop: "corn", country: "Argentina", productionMt: 53, domesticUseMt: 14, exportsMt: 38.0, exportableSharePct: 71.7 },
  { crop: "corn", country: "Ukraine", productionMt: 31.8, domesticUseMt: 8, exportsMt: 22.0, exportableSharePct: 69.2 },
  { crop: "soy", country: "Brazil", productionMt: 186, domesticUseMt: 65, exportsMt: 118.0, exportableSharePct: 63.4 },
  { crop: "soy", country: "United States", productionMt: 123, domesticUseMt: 76, exportsMt: 45.2, exportableSharePct: 36.7 },
  { crop: "soy", country: "Argentina", productionMt: 51, domesticUseMt: 42, exportsMt: 6.2, exportableSharePct: 12.2 },
];

/** Port throughput vs origin share scatter inputs */
export const PORT_VS_ORIGIN: {
  port: string;
  originSharePct: number;
  portShareOfWorldCropPct: number;
  crop: CropId;
  mt: number;
}[] = [
  { port: "US Gulf", originSharePct: 38.7, portShareOfWorldCropPct: 22.4, crop: "corn", mt: 47.2 },
  { port: "Greater Rosario", originSharePct: 18.1, portShareOfWorldCropPct: 13.0, crop: "corn", mt: 27.4 },
  { port: "Black Sea UA", originSharePct: 10.5, portShareOfWorldCropPct: 8.2, crop: "corn", mt: 17.2 },
  { port: "Santos", originSharePct: 62.0, portShareOfWorldCropPct: 21.1, crop: "soy", mt: 40.1 },
  { port: "Paranaguá", originSharePct: 62.0, portShareOfWorldCropPct: 13.7, crop: "soy", mt: 26.0 },
  { port: "US Gulf (soy)", originSharePct: 23.7, portShareOfWorldCropPct: 13.8, crop: "soy", mt: 26.2 },
];

export function fmtMt(n: number): string {
  return n >= 100 ? n.toFixed(0) : n.toFixed(1);
}

export function fmtPct(n: number): string {
  return `${n.toFixed(n >= 10 ? 0 : 1)}%`;
}

export function originBars(crop: CropId) {
  return crop === "corn" ? CORN_ORIGINS : SOY_ORIGINS;
}

export function destinationBars(crop: CropId) {
  return crop === "corn" ? CORN_DESTINATIONS : SOY_DESTINATIONS;
}

export function cumulativeFor(crop: CropId) {
  return ORIGIN_CUMULATIVE.filter((r) => r.crop === crop);
}

export function portsFor(crop: CropId | "both") {
  if (crop === "both") return PORT_CHOKEPOINTS;
  return PORT_CHOKEPOINTS.filter((p) => p.crop === crop || p.crop === "both");
}

export function balanceFor(crop: CropId) {
  return BALANCE_LENS.filter((b) => b.crop === crop);
}

export function hhi(shares: number[]): number {
  return Math.round(shares.reduce((s, p) => s + p * p, 0));
}

export function originHhi(crop: CropId): number {
  return hhi(originBars(crop).map((o) => o.sharePct));
}
