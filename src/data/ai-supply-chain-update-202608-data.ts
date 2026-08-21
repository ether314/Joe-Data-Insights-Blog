/**
 * Semiconductor supply-chain August 2026 vintage update.
 * Versus the Q3 CoWoS tracker post (gap ~20%, NVIDIA >50%, Mid-Year path carried),
 * this cut reads the newest official OEM stack Mid-Year still prints — especially the
 * back-end asymmetry: test equipment $15.3B (+31%) vs assembly & packaging $6.7B (+9.6%)
 * — against that packaging-capacity rationing story.
 *
 * Primary sources:
 * - SEMI Mid-Year Total Equipment Forecast – OEM Perspective (July 14, 2026)
 * - SEMI / SEAJ WWSEMS Q1 2026 billings (June 4–5, 2026) — pace check
 * - Prior theme post — Q3 CoWoS / NVIDIA reservation vintage
 */

export const SOURCE_NOTE =
  "Vintage delta vs Q3 CoWoS tracker: SEMI Mid-Year OEM back-end cut shows test equipment at $15.3B (+31% YoY) while assembly & packaging tools only rise 9.6% to $6.7B — even as CoWoS supply-demand gap still prints ~20% and NVIDIA locks >50% of 2026 CoWoS. Total equipment path remains $165.9B (+23.2%); Q1 billings $36.55B (+14%) are the pace check. Bottleneck scores are editorial composites (1–10), not SEMI metrics.";

export const SOURCES = [
  {
    label: "SEMI — Mid-Year OEM Forecast (July 2026)",
    url: "https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-sales-forecast-to-reach-a-record-229-billion-dollars-in-2028-semi-reports",
  },
  {
    label: "SEMI — Q1 2026 Equipment Billings ($36.55B)",
    url: "https://www.semi.org/en/semi-press-release/semi-reports-global-semiconductor-equipment-billings-increased-14-percent-year-over-year-in-q1-2026",
  },
  {
    label: "Prior theme update — Q3 CoWoS tracker",
    url: "/blog/ai-supply-chain-update-2026q3",
  },
] as const;

export const PRIOR_Q3_PATH = "/blog/ai-supply-chain-update-2026q3";
export const PRIOR_WWSEMS_PATH = "/blog/ai-supply-chain-update-2026";
export const RESEARCH_PATH = "/blog/ai-supply-chain-research-2026";
export const PACKAGING_PATH = "/blog/ai-gpu-packaging-memory-bottleneck-2025";

export const HEADLINE = {
  fy2026Forecast: 165.9,
  fy2026YoyPct: 23.2,
  wfe2026: 143.9,
  wfeYoyPct: 23.1,
  dram2026: 38.8,
  dramYoyPct: 39,
  test2026: 15.3,
  testYoyPct: 31.0,
  packaging2026: 6.7,
  packagingYoyPct: 9.6,
  test2028: 20.8,
  packaging2028: 8.6,
  q1_2026: 36.55,
  q1YoyPct: 14,
  q1ShareOfFyPct: 22.0,
  h1SimpleRunrate: 73.1,
  h1ShareOfFyPct: 44.1,
  taiwanQ1YoyPct: 24,
  koreaQ1YoyPct: 16,
  cowosCapQ3Ye: 140_000,
  cowosGapQ3Pct: 20,
  nvidiaSharePct: 50,
  nvidiaReservedLow: 800_000,
  nvidiaReservedHigh: 850_000,
  backendAsymmetryPts: 21.4, // test YoY − packaging YoY
  bindingLayers: 2,
} as const;

/** Mid-Year OEM segment path — focus on front/back-end asymmetry (USD bn). */
export const SEGMENT_PATH = [
  {
    id: "total",
    label: "Total equipment",
    y2025: 135.1,
    y2026: 165.9,
    y2028: 229.5,
    yoy2026Pct: 23.2,
    color: "#0ea5e9",
  },
  {
    id: "wfe",
    label: "Wafer fab equipment",
    y2025: 116.9,
    y2026: 143.9,
    y2028: 200.0,
    yoy2026Pct: 23.1,
    color: "#6366f1",
  },
  {
    id: "dram",
    label: "DRAM equipment",
    y2025: 27.9,
    y2026: 38.8,
    y2028: 56.9,
    yoy2026Pct: 39.0,
    color: "#a855f7",
  },
  {
    id: "test",
    label: "Test equipment",
    y2025: 11.7,
    y2026: 15.3,
    y2028: 20.8,
    yoy2026Pct: 31.0,
    color: "#f97316",
  },
  {
    id: "packaging",
    label: "Assembly & packaging",
    y2025: 6.1,
    y2026: 6.7,
    y2028: 8.6,
    yoy2026Pct: 9.6,
    color: "#f59e0b",
  },
] as const;

export type SegmentId = (typeof SEGMENT_PATH)[number]["id"];

/**
 * Back-end dollars vs CoWoS gap across theme vintages.
 * Gap % from research / Aug mid-print / Q3 tracker; tool $ from Mid-Year OEM.
 */
export const BACKEND_VS_GAP = [
  {
    period: "Jul research",
    packagingBn: 6.7,
    testBn: 15.3,
    cowosGapPct: 20,
    vintage: "research" as const,
  },
  {
    period: "Aug mid-print",
    packagingBn: 6.7,
    testBn: 15.3,
    cowosGapPct: 10,
    vintage: "mid" as const,
  },
  {
    period: "Q3 tracker",
    packagingBn: 6.7,
    testBn: 15.3,
    cowosGapPct: 20,
    vintage: "q3" as const,
  },
  {
    period: "Aug Mid-Year cut",
    packagingBn: 6.7,
    testBn: 15.3,
    cowosGapPct: 20,
    vintage: "aug" as const,
  },
] as const;

/** Regional Q1 AI-install signature (WWSEMS; USD bn). */
export const AI_INSTALL_REGIONS = [
  {
    region: "Taiwan",
    q1_2026: 8.77,
    yoyPct: 24,
    qoqPct: 18,
    role: "Logic + CoWoS install",
    color: "#0ea5e9",
  },
  {
    region: "Korea",
    q1_2026: 8.93,
    yoyPct: 16,
    qoqPct: 26,
    role: "HBM / DRAM tools",
    color: "#8b5cf6",
  },
  {
    region: "China",
    q1_2026: 10.99,
    yoyPct: 7,
    qoqPct: -16,
    role: "Largest absolute, cooled QoQ",
    color: "#ef4444",
  },
  {
    region: "N. America",
    q1_2026: 3.28,
    yoyPct: 12,
    qoqPct: 6,
    role: "Domestic fab tools",
    color: "#22c55e",
  },
] as const;

export type RegionName = (typeof AI_INSTALL_REGIONS)[number]["region"];

/** Pace ladder: Q1 stamp → H1 simple run-rate → Mid-Year FY path. */
export const PACE_LADDER = [
  {
    stage: "Q1 2026 billings",
    value: 36.55,
    sharePct: 22.0,
    note: "Official WWSEMS stamp",
    color: "#0ea5e9",
  },
  {
    stage: "H1 simple (2×Q1)",
    value: 73.1,
    sharePct: 44.1,
    note: "Editorial run-rate — not official Q2",
    color: "#6366f1",
  },
  {
    stage: "FY Mid-Year path",
    value: 165.9,
    sharePct: 100,
    note: "SEMI OEM forecast",
    color: "#22c55e",
  },
] as const;

export type StackLayer =
  | "cowos"
  | "dram-hbm"
  | "test"
  | "packaging-tools"
  | "euv"
  | "osat"
  | "logic-fab";

export type BottleneckVintage = {
  id: StackLayer;
  label: string;
  q3Tightness: number;
  augTightness: number;
  q3LeadWeeks: number;
  augLeadWeeks: number;
  concentrationPct: number;
  note: string;
  color: string;
};

/** Editorial tightness: Q3 packaging tracker → Aug Mid-Year back-end reading. */
export const BOTTLENECK_DELTA: BottleneckVintage[] = [
  {
    id: "cowos",
    label: "CoWoS packaging",
    q3Tightness: 10,
    augTightness: 10,
    q3LeadWeeks: 52,
    augLeadWeeks: 52,
    concentrationPct: 75,
    note: "Gap still ~20%; packaging tool $ grow only +9.6%",
    color: "#f59e0b",
  },
  {
    id: "dram-hbm",
    label: "HBM / advanced DRAM",
    q3Tightness: 9,
    augTightness: 9,
    q3LeadWeeks: 48,
    augLeadWeeks: 48,
    concentrationPct: 52,
    note: "DRAM tools +39% fund capacity; allocation still gates",
    color: "#a855f7",
  },
  {
    id: "test",
    label: "Final test / burn-in",
    q3Tightness: 7,
    augTightness: 6,
    q3LeadWeeks: 32,
    augLeadWeeks: 30,
    concentrationPct: 40,
    note: "Official test path +31% to $15.3B eases tool scarcity",
    color: "#f97316",
  },
  {
    id: "packaging-tools",
    label: "Packaging equipment $",
    q3Tightness: 7,
    augTightness: 8,
    q3LeadWeeks: 36,
    augLeadWeeks: 38,
    concentrationPct: 55,
    note: "Only +9.6% to $6.7B — slowest major segment YoY",
    color: "#eab308",
  },
  {
    id: "euv",
    label: "EUV lithography",
    q3Tightness: 8,
    augTightness: 8,
    q3LeadWeeks: 66,
    augLeadWeeks: 66,
    concentrationPct: 100,
    note: "ASML sole HVM EUV; High-NA still ramping",
    color: "#6366f1",
  },
  {
    id: "osat",
    label: "OSAT advanced package",
    q3Tightness: 7,
    augTightness: 7,
    q3LeadWeeks: 30,
    augLeadWeeks: 30,
    concentrationPct: 45,
    note: "Overflow valve still load-bearing from Q3 notes",
    color: "#22c55e",
  },
  {
    id: "logic-fab",
    label: "Leading-edge logic fab",
    q3Tightness: 5,
    augTightness: 5,
    q3LeadWeeks: 24,
    augLeadWeeks: 24,
    concentrationPct: 65,
    note: "Taiwan Q1 +24% funds logic — still less binding",
    color: "#0ea5e9",
  },
];

/** Upstream funded layers → downstream ship gate. */
export const STACK_FLOW = [
  {
    stage: "Total equip $",
    metric: "FY26 Mid-Year",
    valueLabel: "$165.9B",
    value: 165.9,
    status: "funded",
    color: "#0ea5e9",
  },
  {
    stage: "WFE tools",
    metric: "FY26 WFE",
    valueLabel: "$143.9B",
    value: 143.9,
    status: "funded",
    color: "#6366f1",
  },
  {
    stage: "Test tools",
    metric: "Test YoY",
    valueLabel: "+31%",
    value: 31,
    status: "easing",
    color: "#f97316",
  },
  {
    stage: "Pkg tools",
    metric: "A&P YoY",
    valueLabel: "+9.6%",
    value: 9.6,
    status: "lagging",
    color: "#eab308",
  },
  {
    stage: "CoWoS slots",
    metric: "Gap (Q3)",
    valueLabel: "~20%",
    value: 20,
    status: "binding",
    color: "#f59e0b",
  },
  {
    stage: "GPU ship",
    metric: "NVIDIA share",
    valueLabel: ">50%",
    value: 52,
    status: "gated",
    color: "#76b900",
  },
] as const;

export function fmtBn(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function fmtWpm(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

export function tightnessDelta(row: BottleneckVintage): number {
  return row.augTightness - row.q3Tightness;
}

export function segmentBars(ids: SegmentId[] = SEGMENT_PATH.map((s) => s.id)) {
  return SEGMENT_PATH.filter((s) => ids.includes(s.id)).map((s) => ({
    id: s.id,
    label: s.label,
    y2025: s.y2025,
    y2026: s.y2026,
    yoyPct: s.yoy2026Pct,
    fill: s.color,
  }));
}

export function yoyRankBars(ids: SegmentId[] = SEGMENT_PATH.map((s) => s.id)) {
  return segmentBars(ids)
    .slice()
    .sort((a, b) => b.yoyPct - a.yoyPct);
}

export function bottleneckScatter(mode: "q3" | "aug" | "both") {
  const rows: Array<{
    id: string;
    label: string;
    tightness: number;
    leadWeeks: number;
    concentrationPct: number;
    vintage: "q3" | "aug";
    color: string;
  }> = [];
  for (const b of BOTTLENECK_DELTA) {
    if (mode === "q3" || mode === "both") {
      rows.push({
        id: `${b.id}-q3`,
        label: b.label,
        tightness: b.q3Tightness,
        leadWeeks: b.q3LeadWeeks,
        concentrationPct: b.concentrationPct,
        vintage: "q3",
        color: b.color,
      });
    }
    if (mode === "aug" || mode === "both") {
      rows.push({
        id: `${b.id}-aug`,
        label: b.label,
        tightness: b.augTightness,
        leadWeeks: b.augLeadWeeks,
        concentrationPct: b.concentrationPct,
        vintage: "aug",
        color: b.color,
      });
    }
  }
  return rows;
}

export function installRegions(regions: RegionName[] = AI_INSTALL_REGIONS.map((r) => r.region)) {
  return AI_INSTALL_REGIONS.filter((r) => regions.includes(r.region));
}
