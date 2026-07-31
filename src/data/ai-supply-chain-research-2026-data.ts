/**
 * Semiconductor supply-chain research (2026): equipment cycle, regional concentration,
 * and multi-layer bottleneck tightness across the AI chip stack.
 *
 * Primary sources:
 * - SEMI Mid-Year Total Semiconductor Equipment Forecast – OEM Perspective (July 14, 2026)
 * - SEMI Worldwide Semiconductor Equipment Market Statistics / 2025 billings (April 7, 2026)
 * - TrendForce / TSMC disclosures for CoWoS & HBM tightness (cross-check with packaging post)
 *
 * Scope note: equipment dollars are OEM billings / forecasts — not hyperscaler capex.
 */

export const SOURCE_NOTE =
  "SEMI WWSEMS 2025 billings ($135.1B) and Mid-Year OEM Forecast (July 2026: $165.9B total equipment / $143.9B WFE in 2026). CoWoS & HBM tightness from TrendForce / TSMC disclosures. Bottleneck scores are editorial composites (1–10), not SEMI metrics.";

export const SOURCES = [
  {
    label: "SEMI — Mid-Year Total Equipment Forecast (July 2026)",
    url: "https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-sales-forecast-to-reach-a-record-229-billion-dollars-in-2028-semi-reports",
  },
  {
    label: "SEMI — 2025 Equipment Billings ($135.1B)",
    url: "https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025",
  },
] as const;

export const HEADLINE = {
  totalEquip2025: 135.1,
  totalEquip2026: 165.9,
  totalEquip2028: 229.5,
  wfe2025: 116.9,
  wfe2026: 143.9,
  wfe2028: 200,
  taiwan2025: 31.5,
  taiwanYoyPct: 90,
  china2025: 49.3,
  korea2025: 25.8,
  dramEquip2026: 38.8,
  dramYoyPct: 39,
  nandEquip2026: 13.9,
  testYoyPct2025: 55,
  assemblyYoyPct2025: 21,
  cowosWpm2025: 75_000,
  cowosWpm2026Target: 125_000,
} as const;

/** Total OEM equipment + WFE path (USD billions). */
export const EQUIPMENT_CYCLE = [
  { year: 2024, total: 117.1, wfe: 95.0, status: "actual" as const },
  { year: 2025, total: 135.1, wfe: 116.9, status: "actual" as const },
  { year: 2026, total: 165.9, wfe: 143.9, status: "forecast" as const },
  { year: 2027, total: 197.0, wfe: 175.3, status: "forecast" as const },
  { year: 2028, total: 229.5, wfe: 200.0, status: "forecast" as const },
];

/**
 * Regional equipment billings (USD bn). 2024–2025 from SEMI WWSEMS;
 * 2026 rows are directional shares scaled to the $165.9B total for visualization —
 * not a SEMI regional release.
 */
export const REGIONAL_BILLINGS = [
  { year: 2024, region: "China", value: 49.5, color: "#ef4444" },
  { year: 2024, region: "Taiwan", value: 16.6, color: "#0ea5e9" },
  { year: 2024, region: "Korea", value: 20.5, color: "#8b5cf6" },
  { year: 2024, region: "N. America", value: 13.6, color: "#22c55e" },
  { year: 2024, region: "Japan", value: 7.8, color: "#f59e0b" },
  { year: 2024, region: "Europe", value: 4.9, color: "#64748b" },
  { year: 2024, region: "Rest of World", value: 4.2, color: "#94a3b8" },
  { year: 2025, region: "China", value: 49.3, color: "#ef4444" },
  { year: 2025, region: "Taiwan", value: 31.5, color: "#0ea5e9" },
  { year: 2025, region: "Korea", value: 25.8, color: "#8b5cf6" },
  { year: 2025, region: "N. America", value: 10.9, color: "#22c55e" },
  { year: 2025, region: "Japan", value: 9.5, color: "#f59e0b" },
  { year: 2025, region: "Europe", value: 2.9, color: "#64748b" },
  { year: 2025, region: "Rest of World", value: 5.2, color: "#94a3b8" },
  { year: 2026, region: "China", value: 52.0, color: "#ef4444" },
  { year: 2026, region: "Taiwan", value: 42.0, color: "#0ea5e9" },
  { year: 2026, region: "Korea", value: 34.0, color: "#8b5cf6" },
  { year: 2026, region: "N. America", value: 14.0, color: "#22c55e" },
  { year: 2026, region: "Japan", value: 12.0, color: "#f59e0b" },
  { year: 2026, region: "Europe", value: 4.5, color: "#64748b" },
  { year: 2026, region: "Rest of World", value: 7.4, color: "#94a3b8" },
] as const;

export type RegionName = (typeof REGIONAL_BILLINGS)[number]["region"];

export const REGION_COLORS: Record<string, string> = {
  China: "#ef4444",
  Taiwan: "#0ea5e9",
  Korea: "#8b5cf6",
  "N. America": "#22c55e",
  Japan: "#f59e0b",
  Europe: "#64748b",
  "Rest of World": "#94a3b8",
};

/** Memory & back-end equipment growth (USD bn where available). */
export const SEGMENT_GROWTH = [
  {
    id: "dram",
    label: "DRAM equipment",
    y2025: 27.9,
    y2026: 38.8,
    y2027: 49.4,
    y2028: 56.9,
    yoy2026Pct: 39.0,
    color: "#a855f7",
  },
  {
    id: "nand",
    label: "NAND equipment",
    y2025: 10.6,
    y2026: 13.9,
    y2027: 18.2,
    y2028: 20.8,
    yoy2026Pct: 30.7,
    color: "#ec4899",
  },
  {
    id: "wfe",
    label: "Total WFE",
    y2025: 116.9,
    y2026: 143.9,
    y2027: 175.3,
    y2028: 200.0,
    yoy2026Pct: 23.1,
    color: "#0ea5e9",
  },
  {
    id: "test",
    label: "Test equipment (index)",
    y2025: 155,
    y2026: 180,
    y2027: 200,
    y2028: 215,
    yoy2026Pct: 55,
    color: "#f59e0b",
    indexBase: true,
  },
  {
    id: "assembly",
    label: "Assembly & packaging (index)",
    y2025: 121,
    y2026: 140,
    y2027: 155,
    y2028: 168,
    yoy2026Pct: 21,
    color: "#14b8a6",
    indexBase: true,
  },
] as const;

export type StackLayer =
  | "euv"
  | "logic-fab"
  | "dram-hbm"
  | "cowos"
  | "osat"
  | "substrate"
  | "test";

/** Editorial tightness scores (1 = slack, 10 = binding). */
export const BOTTLENECK_LAYERS: Array<{
  id: StackLayer;
  label: string;
  tightness: number;
  leadWeeks: number;
  concentrationPct: number;
  note: string;
  color: string;
}> = [
  {
    id: "euv",
    label: "EUV lithography",
    tightness: 8,
    leadWeeks: 70,
    concentrationPct: 100,
    note: "ASML sole HVM EUV supplier; High-NA ramping",
    color: "#6366f1",
  },
  {
    id: "logic-fab",
    label: "Leading-edge logic fab",
    tightness: 6,
    leadWeeks: 26,
    concentrationPct: 65,
    note: "TSMC still dominates <5nm AI silicon",
    color: "#0ea5e9",
  },
  {
    id: "dram-hbm",
    label: "HBM / advanced DRAM",
    tightness: 9,
    leadWeeks: 52,
    concentrationPct: 52,
    note: "SK hynix ~52% HBM; sold-out into 2026",
    color: "#a855f7",
  },
  {
    id: "cowos",
    label: "CoWoS packaging",
    tightness: 10,
    leadWeeks: 52,
    concentrationPct: 80,
    note: "TSMC CoWoS sold out; ~75k→125k wpm ramp",
    color: "#f59e0b",
  },
  {
    id: "osat",
    label: "OSAT advanced package",
    tightness: 7,
    leadWeeks: 30,
    concentrationPct: 45,
    note: "Amkor / ASE / JCET absorb overflow",
    color: "#22c55e",
  },
  {
    id: "substrate",
    label: "ABF / substrates",
    tightness: 7,
    leadWeeks: 40,
    concentrationPct: 60,
    note: "Substrate lead times lag GPU ramps",
    color: "#14b8a6",
  },
  {
    id: "test",
    label: "Final test / burn-in",
    tightness: 8,
    leadWeeks: 28,
    concentrationPct: 40,
    note: "SEMI: test billings +55% in 2025",
    color: "#ef4444",
  },
];

/** CoWoS capacity path (wpm) — aligned with packaging-bottleneck research. */
export const COWOS_CAPACITY = [
  { year: 2024, capacityWpm: 37_500, demandWafers: 420_000 },
  { year: 2025, capacityWpm: 75_000, demandWafers: 670_000 },
  { year: 2026, capacityWpm: 125_000, demandWafers: 1_000_000 },
];

export function regionalForYear(year: number) {
  return REGIONAL_BILLINGS.filter((r) => r.year === year)
    .slice()
    .sort((a, b) => b.value - a.value);
}

export function fmtBn(n: number): string {
  return `$${n.toFixed(n >= 100 ? 0 : 1)}B`;
}

export function fmtPct(n: number): string {
  return `${n > 0 ? "+" : ""}${n}%`;
}

export function fmtWpm(n: number): string {
  return `${(n / 1000).toFixed(0)}k wpm`;
}
