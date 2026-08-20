/**
 * Semiconductor supply-chain vintage update (Aug 2026).
 * Compares the Jul 2026 research print (SEMI Mid-Year OEM Forecast +
 * 2025 WWSEMS annuals / editorial bottleneck scores) against the newest
 * official billings vintage: WWSEMS Q1 2026 ($36.55B) plus mid-2026
 * CoWoS / packaging tracker revisions.
 *
 * Primary sources:
 * - SEMI / SEAJ WWSEMS Q1 2026 billings (June 4–5, 2026)
 * - SEMI Mid-Year Total Equipment Forecast – OEM Perspective (July 14, 2026)
 * - TrendForce / EDN synthesis for CoWoS gap & capacity (June 2026)
 */

export const SOURCE_NOTE =
  "Vintage delta: Jul 2026 research (SEMI Mid-Year OEM forecast $165.9B / 2025 annual billings) vs Aug 2026 update (WWSEMS Q1 2026 billings $36.55B, +14% YoY). CoWoS gap & capacity from mid-2026 industry trackers. Bottleneck scores are editorial composites (1–10), not SEMI metrics.";

export const SOURCES = [
  {
    label: "SEMI — Q1 2026 Equipment Billings ($36.55B)",
    url: "https://www.semi.org/en/semi-press-release/semi-reports-global-semiconductor-equipment-billings-increased-14-percent-year-over-year-in-q1-2026",
  },
  {
    label: "SEAJ — Q1 2026 regional billings table",
    url: "https://www.seaj.or.jp/english/statistics/8287498067106.pdf",
  },
  {
    label: "SEMI — Mid-Year OEM Forecast (July 2026)",
    url: "https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-sales-forecast-to-reach-a-record-229-billion-dollars-in-2028-semi-reports",
  },
] as const;

export const HEADLINE = {
  q1_2026: 36.55,
  q1_2025: 32.05,
  q1YoyPct: 14,
  q1QoqPct: 1,
  fy2026Forecast: 165.9,
  q1ShareOfFyPct: 22.0,
  taiwanQ1: 8.77,
  taiwanYoyPct: 24,
  koreaQ1: 8.93,
  koreaYoyPct: 16,
  chinaQ1: 10.99,
  chinaYoyPct: 7,
  chinaQoqPct: -16,
  cowosGapPriorPct: 20,
  cowosGapNewPct: 10,
  cowosCapPriorTarget: 125_000,
  cowosCapMid2026: 130_000,
  bindingLayersStill: 2,
} as const;

export type RegionName =
  | "China"
  | "Korea"
  | "Taiwan"
  | "N. America"
  | "Japan"
  | "Europe"
  | "Rest of World";

export const REGION_COLORS: Record<RegionName, string> = {
  China: "#ef4444",
  Korea: "#8b5cf6",
  Taiwan: "#0ea5e9",
  "N. America": "#22c55e",
  Japan: "#f59e0b",
  Europe: "#64748b",
  "Rest of World": "#94a3b8",
};

/** Official WWSEMS quarterly billings (USD bn). */
export type RegionalQuarter = {
  region: RegionName;
  q1_2025: number;
  q4_2025: number;
  q1_2026: number;
  yoyPct: number;
  qoqPct: number;
  color: string;
};

export const REGIONAL_Q1: RegionalQuarter[] = [
  {
    region: "China",
    q1_2025: 10.26,
    q4_2025: 13.13,
    q1_2026: 10.99,
    yoyPct: 7,
    qoqPct: -16,
    color: REGION_COLORS.China,
  },
  {
    region: "Korea",
    q1_2025: 7.69,
    q4_2025: 7.08,
    q1_2026: 8.93,
    yoyPct: 16,
    qoqPct: 26,
    color: REGION_COLORS.Korea,
  },
  {
    region: "Taiwan",
    q1_2025: 7.09,
    q4_2025: 7.44,
    q1_2026: 8.77,
    yoyPct: 24,
    qoqPct: 18,
    color: REGION_COLORS.Taiwan,
  },
  {
    region: "N. America",
    q1_2025: 2.93,
    q4_2025: 3.09,
    q1_2026: 3.28,
    yoyPct: 12,
    qoqPct: 6,
    color: REGION_COLORS["N. America"],
  },
  {
    region: "Japan",
    q1_2025: 2.18,
    q4_2025: 2.82,
    q1_2026: 2.16,
    yoyPct: -1,
    qoqPct: -24,
    color: REGION_COLORS.Japan,
  },
  {
    region: "Europe",
    q1_2025: 0.87,
    q4_2025: 0.74,
    q1_2026: 0.95,
    yoyPct: 9,
    qoqPct: 28,
    color: REGION_COLORS.Europe,
  },
  {
    region: "Rest of World",
    q1_2025: 1.03,
    q4_2025: 1.97,
    q1_2026: 1.48,
    yoyPct: 43,
    qoqPct: -25,
    color: REGION_COLORS["Rest of World"],
  },
];

/** Equipment cycle path: prior research actuals/forecast + Q1 pace marker. */
export const EQUIPMENT_PACE = [
  { year: 2024, total: 117.1, status: "actual" as const },
  { year: 2025, total: 135.1, status: "actual" as const },
  { year: 2026, total: 165.9, status: "forecast" as const },
  { year: 2027, total: 197.0, status: "forecast" as const },
  { year: 2028, total: 229.5, status: "forecast" as const },
];

/** Annualized Q1 run-rate vs Mid-Year FY forecast (illustrative pace check). */
export const PACE_CHECK = {
  q1Annualized: Math.round(HEADLINE.q1_2026 * 4 * 10) / 10, // 146.2
  fyForecast: HEADLINE.fy2026Forecast,
  gapBn: Math.round((HEADLINE.fy2026Forecast - HEADLINE.q1_2026 * 4) * 10) / 10,
  note: "Simple ×4 annualization understates H2 AI tool intensity; use as pace check only.",
} as const;

export type StackLayer =
  | "euv"
  | "logic-fab"
  | "dram-hbm"
  | "cowos"
  | "osat"
  | "substrate"
  | "test";

export type BottleneckVintage = {
  id: StackLayer;
  label: string;
  priorTightness: number;
  newTightness: number;
  priorLeadWeeks: number;
  newLeadWeeks: number;
  concentrationPct: number;
  note: string;
  color: string;
};

/** Editorial tightness: Jul research → Aug update. */
export const BOTTLENECK_DELTA: BottleneckVintage[] = [
  {
    id: "cowos",
    label: "CoWoS packaging",
    priorTightness: 10,
    newTightness: 9,
    priorLeadWeeks: 52,
    newLeadWeeks: 52,
    concentrationPct: 75,
    note: "Gap ~20%→~10%; mid-2026 capacity ~130k wpm vs prior 125k YE target",
    color: "#f59e0b",
  },
  {
    id: "dram-hbm",
    label: "HBM / advanced DRAM",
    priorTightness: 9,
    newTightness: 9,
    priorLeadWeeks: 52,
    newLeadWeeks: 48,
    concentrationPct: 52,
    note: "Korea Q1 tools +16% YoY; HBM still allocation-gated into 2H26",
    color: "#a855f7",
  },
  {
    id: "euv",
    label: "EUV lithography",
    priorTightness: 8,
    newTightness: 8,
    priorLeadWeeks: 70,
    newLeadWeeks: 68,
    concentrationPct: 100,
    note: "ASML sole HVM EUV; High-NA still ramping",
    color: "#6366f1",
  },
  {
    id: "test",
    label: "Final test / burn-in",
    priorTightness: 8,
    newTightness: 7,
    priorLeadWeeks: 36,
    newLeadWeeks: 32,
    concentrationPct: 40,
    note: "Back-end tools still elevated; AI burn-in intensity eases slightly",
    color: "#f97316",
  },
  {
    id: "osat",
    label: "OSAT advanced package",
    priorTightness: 7,
    newTightness: 6,
    priorLeadWeeks: 30,
    newLeadWeeks: 26,
    concentrationPct: 45,
    note: "Partner CoWoS-class capacity +50–60k wpm absorbs overflow",
    color: "#22c55e",
  },
  {
    id: "substrate",
    label: "ABF / substrates",
    priorTightness: 7,
    newTightness: 7,
    priorLeadWeeks: 28,
    newLeadWeeks: 28,
    concentrationPct: 55,
    note: "Still a materials buffer; no structural relief vs Jul print",
    color: "#14b8a6",
  },
  {
    id: "logic-fab",
    label: "Leading-edge logic fab",
    priorTightness: 6,
    newTightness: 5,
    priorLeadWeeks: 26,
    newLeadWeeks: 24,
    concentrationPct: 65,
    note: "Taiwan Q1 +24% YoY funds 2nm / AI logic; less binding than packaging",
    color: "#0ea5e9",
  },
];

/** CoWoS capacity / gap path (wafers per month; tracker midpoints). */
export const COWOS_PATH = [
  {
    period: "End-2024",
    capacity: 37_500,
    demand: 48_000,
    gapPct: 22,
    vintage: "prior" as const,
  },
  {
    period: "End-2025",
    capacity: 75_000,
    demand: 95_000,
    gapPct: 21,
    vintage: "prior" as const,
  },
  {
    period: "Jul research\n2026 target",
    capacity: 125_000,
    demand: 150_000,
    gapPct: 20,
    vintage: "prior" as const,
  },
  {
    period: "Mid-2026\nupdate",
    capacity: 130_000,
    demand: 145_000,
    gapPct: 10,
    vintage: "new" as const,
  },
  {
    period: "YE-2026\ntracker",
    capacity: 140_000,
    demand: 155_000,
    gapPct: 10,
    vintage: "new" as const,
  },
];

export function fmtBn(n: number, digits = 2): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function tightnessDelta(row: BottleneckVintage): number {
  return row.newTightness - row.priorTightness;
}

export function regionalYoyBars(regions: RegionName[] = REGIONAL_Q1.map((r) => r.region)) {
  return REGIONAL_Q1.filter((r) => regions.includes(r.region))
    .map((r) => ({
      region: r.region,
      yoyPct: r.yoyPct,
      qoqPct: r.qoqPct,
      q1_2026: r.q1_2026,
      fill: r.color,
    }))
    .sort((a, b) => b.yoyPct - a.yoyPct);
}

export function regionalDumbbell(regions: RegionName[] = REGIONAL_Q1.map((r) => r.region)) {
  return REGIONAL_Q1.filter((r) => regions.includes(r.region)).map((r) => ({
    region: r.region,
    prior: r.q1_2025,
    neu: r.q1_2026,
    fill: r.color,
  }));
}

export function bottleneckScatter(mode: "prior" | "new" | "both") {
  const rows: Array<{
    id: string;
    label: string;
    tightness: number;
    leadWeeks: number;
    concentrationPct: number;
    vintage: "prior" | "new";
    color: string;
  }> = [];
  for (const b of BOTTLENECK_DELTA) {
    if (mode === "prior" || mode === "both") {
      rows.push({
        id: `${b.id}-prior`,
        label: b.label,
        tightness: b.priorTightness,
        leadWeeks: b.priorLeadWeeks,
        concentrationPct: b.concentrationPct,
        vintage: "prior",
        color: b.color,
      });
    }
    if (mode === "new" || mode === "both") {
      rows.push({
        id: `${b.id}-new`,
        label: b.label,
        tightness: b.newTightness,
        leadWeeks: b.newLeadWeeks,
        concentrationPct: b.concentrationPct,
        vintage: "new",
        color: b.color,
      });
    }
  }
  return rows;
}
