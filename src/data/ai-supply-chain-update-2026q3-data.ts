/**
 * Semiconductor supply-chain Q3 vintage update (Aug 2026).
 * Compares the Aug WWSEMS Q1 billings update (gap ~10%, mid-print ~130k CoWoS)
 * against the newest packaging-tracker vintage: early-Aug TrendForce / OSAT
 * outsourcing notes + Aug 11 TSMC advanced-packaging disclosures, set against
 * the still-current SEMI Mid-Year OEM equipment path ($165.9B / DRAM +39%).
 *
 * Primary sources:
 * - SEMI Mid-Year Total Equipment Forecast – OEM Perspective (July 14, 2026)
 * - SEMI / SEAJ WWSEMS Q1 2026 billings (June 4–5, 2026) — prior update baseline
 * - TrendForce (Aug 5, 2026) CoWoS outsourcing / NVIDIA reservation synthesis
 * - TSMC advanced packaging disclosures (Aug 11, 2026) — 5.5× CoWoS yield / capacity path
 */

export const SOURCE_NOTE =
  "Q3 vintage delta vs Aug WWSEMS Q1 update: CoWoS YE capacity raised toward ~140k wpm and NVIDIA reservations printed at 800–850k wafers (>50% of 2026 CoWoS), while some Aug trackers still show a ~20% supply-demand gap (vs the prior update’s ~10% mid-print). Equipment ledger remains SEMI Mid-Year $165.9B (+23%) with Q1 billings $36.55B as pace check. Bottleneck scores are editorial composites (1–10), not SEMI metrics.";

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
    label: "TrendForce — CoWoS OSAT outsourcing / NVIDIA reservation (Aug 5, 2026)",
    url: "https://www.trendforce.com/news/2026/08/05/news-tsmc-reportedly-expands-outsourcing-of-key-cowos-front-end-step-to-osats-amid-rising-nvidia-asic-demand/",
  },
  {
    label: "Prior theme update — WWSEMS Q1 vintage",
    url: "/blog/ai-supply-chain-update-2026",
  },
] as const;

export const PRIOR_UPDATE_PATH = "/blog/ai-supply-chain-update-2026";
export const RESEARCH_PATH = "/blog/ai-supply-chain-research-2026";
export const PACKAGING_PATH = "/blog/ai-gpu-packaging-memory-bottleneck-2025";

export const HEADLINE = {
  fy2026Forecast: 165.9,
  fy2026YoyPct: 23.2,
  wfe2026: 143.9,
  dram2026: 38.8,
  dramYoyPct: 39,
  q1_2026: 36.55,
  q1YoyPct: 14,
  q1ShareOfFyPct: 22.0,
  taiwanQ1YoyPct: 24,
  koreaQ1YoyPct: 16,
  cowosCapJulTarget: 125_000,
  cowosCapPriorMid: 130_000,
  cowosCapQ3Ye: 140_000,
  cowosCap2027: 220_000,
  cowosGapPriorPct: 10,
  cowosGapQ3Pct: 20,
  nvidiaReservedLow: 800_000,
  nvidiaReservedHigh: 850_000,
  nvidiaSharePct: 50,
  osatOverflowLow: 50_000,
  osatOverflowHigh: 60_000,
  tsmcPackagingFabs: 10,
  cowosYieldPct: 98,
  bindingLayers: 2,
} as const;

/** Equipment segment path — Mid-Year OEM (USD bn). */
export const SEGMENT_PATH = [
  {
    id: "total",
    label: "Total equipment",
    y2025: 135.1,
    y2026: 165.9,
    y2027: 197.0,
    y2028: 229.5,
    yoy2026Pct: 23.2,
    color: "#0ea5e9",
  },
  {
    id: "wfe",
    label: "Wafer fab equipment",
    y2025: 116.9,
    y2026: 143.9,
    y2027: 175.3,
    y2028: 200.0,
    yoy2026Pct: 23.1,
    color: "#6366f1",
  },
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
] as const;

export type SegmentId = (typeof SEGMENT_PATH)[number]["id"];

/** Regional Q1 AI-install signature (from prior WWSEMS print; USD bn). */
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

/**
 * CoWoS capacity / gap vintages (wafers per month; tracker midpoints).
 * prior = Aug WWSEMS update mid-print; q3 = early-Aug / Aug 11 tracker revision.
 */
export const COWOS_VINTAGES = [
  {
    period: "Jul research\nYE target",
    capacity: 125_000,
    demand: 150_000,
    gapPct: 20,
    vintage: "research" as const,
  },
  {
    period: "Aug mid-print\n(prior update)",
    capacity: 130_000,
    demand: 145_000,
    gapPct: 10,
    vintage: "prior" as const,
  },
  {
    period: "Q3 tracker\nYE-2026",
    capacity: 140_000,
    demand: 175_000,
    gapPct: 20,
    vintage: "q3" as const,
  },
  {
    period: "Tracker\nYE-2027",
    capacity: 220_000,
    demand: 245_000,
    gapPct: 10,
    vintage: "q3" as const,
  },
] as const;

/** NVIDIA / OSAT reservation split for 2026 CoWoS annual wafers (synthesis). */
export const RESERVATION_SPLIT = [
  {
    id: "nvidia",
    label: "NVIDIA reserved",
    wafers: 825_000,
    sharePct: 52,
    color: "#76b900",
    note: "800–850k midpoint; >50% of TSMC 2026 CoWoS",
  },
  {
    id: "other-gpu-asic",
    label: "Other GPU / ASIC",
    wafers: 520_000,
    sharePct: 33,
    color: "#0ea5e9",
    note: "Broadcom / AMD / remaining AI ASIC book",
  },
  {
    id: "cpu-other",
    label: "Server CPU / other",
    wafers: 235_000,
    sharePct: 15,
    color: "#f59e0b",
    note: "Rising server-CPU CoWoS share into 2027",
  },
] as const;

export type StackLayer =
  | "cowos"
  | "dram-hbm"
  | "euv"
  | "osat"
  | "test"
  | "substrate"
  | "logic-fab";

export type BottleneckVintage = {
  id: StackLayer;
  label: string;
  priorTightness: number;
  q3Tightness: number;
  priorLeadWeeks: number;
  q3LeadWeeks: number;
  concentrationPct: number;
  note: string;
  color: string;
};

/** Editorial tightness: Aug WWSEMS update → Q3 packaging-tracker vintage. */
export const BOTTLENECK_DELTA: BottleneckVintage[] = [
  {
    id: "cowos",
    label: "CoWoS packaging",
    priorTightness: 9,
    q3Tightness: 10,
    priorLeadWeeks: 52,
    q3LeadWeeks: 52,
    concentrationPct: 75,
    note: "Capacity ↑ to ~140k YE, but gap re-prints ~20% on demand",
    color: "#f59e0b",
  },
  {
    id: "dram-hbm",
    label: "HBM / advanced DRAM",
    priorTightness: 9,
    q3Tightness: 9,
    priorLeadWeeks: 48,
    q3LeadWeeks: 48,
    concentrationPct: 52,
    note: "Korea tools +16% YoY; HBM still allocation-gated",
    color: "#a855f7",
  },
  {
    id: "euv",
    label: "EUV lithography",
    priorTightness: 8,
    q3Tightness: 8,
    priorLeadWeeks: 68,
    q3LeadWeeks: 66,
    concentrationPct: 100,
    note: "ASML sole HVM EUV; High-NA still ramping",
    color: "#6366f1",
  },
  {
    id: "osat",
    label: "OSAT advanced package",
    priorTightness: 6,
    q3Tightness: 7,
    priorLeadWeeks: 26,
    q3LeadWeeks: 30,
    concentrationPct: 45,
    note: "TSMC expands CoWoS front-end step outsourcing to OSATs",
    color: "#22c55e",
  },
  {
    id: "test",
    label: "Final test / burn-in",
    priorTightness: 7,
    q3Tightness: 7,
    priorLeadWeeks: 32,
    q3LeadWeeks: 32,
    concentrationPct: 40,
    note: "AI burn-in intensity unchanged vs Aug mid-print",
    color: "#f97316",
  },
  {
    id: "substrate",
    label: "ABF / substrates",
    priorTightness: 7,
    q3Tightness: 7,
    priorLeadWeeks: 28,
    q3LeadWeeks: 28,
    concentrationPct: 55,
    note: "Materials buffer; no structural relief",
    color: "#14b8a6",
  },
  {
    id: "logic-fab",
    label: "Leading-edge logic fab",
    priorTightness: 5,
    q3Tightness: 5,
    priorLeadWeeks: 24,
    q3LeadWeeks: 24,
    concentrationPct: 65,
    note: "Taiwan Q1 +24% funds 2nm / AI logic — still less binding",
    color: "#0ea5e9",
  },
];

/** Stack flow: upstream equipment → downstream ship constraint. */
export const STACK_FLOW = [
  {
    stage: "Equipment $",
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
    stage: "HBM DRAM",
    metric: "DRAM tools YoY",
    valueLabel: "+39%",
    value: 39,
    status: "tight",
    color: "#a855f7",
  },
  {
    stage: "CoWoS slots",
    metric: "YE capacity",
    valueLabel: "140k wpm",
    value: 140,
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
  return row.q3Tightness - row.priorTightness;
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

export function cowosPath(mode: "all" | "prior-q3" = "all") {
  return COWOS_VINTAGES.filter((r) => {
    if (mode === "all") return true;
    return r.vintage === "prior" || r.vintage === "q3";
  }).map((r) => ({
    ...r,
    periodShort: r.period.replace("\n", " "),
  }));
}

export function bottleneckScatter(mode: "prior" | "q3" | "both") {
  const rows: Array<{
    id: string;
    label: string;
    tightness: number;
    leadWeeks: number;
    concentrationPct: number;
    vintage: "prior" | "q3";
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
  }
  return rows;
}

export function installRegions(regions: RegionName[] = AI_INSTALL_REGIONS.map((r) => r.region)) {
  return AI_INSTALL_REGIONS.filter((r) => regions.includes(r.region));
}
