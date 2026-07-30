/**
 * AI GPU packaging & memory supply-chain bottleneck (2025 primary, 2026 where available).
 *
 * Counter-narrative: HBM + advanced packaging (CoWoS / OSAT) — not leading-edge fab
 * capacity — is the binding constraint on AI accelerator shipments.
 *
 * Sources (public, cited per record):
 * - TrendForce (CoWoS capacity, HBM market sizing, supplier share) — trendforce.com
 * - TSMC earnings calls & packaging disclosures (C.C. Wei, Jun He) — investor.tsmc.com
 * - SK hynix investor / news releases — news.skhynix.com
 * - Silicon Analysts CoWoS capacity tracker — siliconanalysts.com/market-data/cowos-capacity
 * - GlobalSemiResearch / Nomad Semi industry estimates — globalsemiresearch.substack.com
 * - Counterpoint Research, BofA, Goldman Sachs (HBM outlook via SK hynix 2026 outlook)
 *
 * Methodology:
 * - CoWoS capacity in wafer starts per month (wpm); annual demand in wafers/year.
 * - HBM market share as % of HBM revenue or shipments (source-specific per row).
 * - Ranges stored as midpoint with low/high where analysts disagree.
 * - 2026 rows included only where publicly sourced (capacity targets, demand forecasts).
 */

export type BottleneckLayer = "hbm" | "cowos" | "osat" | "demand" | "market";

export type SupplyChainRecord = {
  id: string;
  entity: string;
  layer: BottleneckLayer;
  metric: string;
  year: number;
  value: number;
  unit: string;
  valueLow?: number;
  valueHigh?: number;
  product?: string;
  region?: string;
  status: "sold_out" | "tight" | "ramping" | "expanding" | "benchmark";
  source: string;
  notes?: string;
};

export const DATA_YEAR = 2025;

export const SOURCE_NOTE =
  "TrendForce, TSMC disclosures, SK hynix, Silicon Analysts, and industry research (2025–2026).";

export const BOTTLENECK_COLORS: Record<BottleneckLayer, string> = {
  hbm: "#a855f7",
  cowos: "#f59e0b",
  osat: "#22c55e",
  demand: "#6366f1",
  market: "#94a3b8",
};

export const LAYER_LABELS: Record<BottleneckLayer, string> = {
  hbm: "HBM memory",
  cowos: "CoWoS packaging",
  osat: "OSAT outsourcing",
  demand: "Customer demand",
  market: "Market benchmark",
};

/** Headline stats for dashboard summary cards */
export const GLOBAL_SUMMARY = {
  hbmMarketUsdB2025: 46.7,
  hbmMarketUsdB2024: 18.2,
  hbmDramSharePct2025: 34,
  hbm3eMixPct2025: 85,
  cowosCapacityWpmEnd2025: 75_000,
  cowosCapacityWpmEnd2026Target: 125_000,
  cowosDemandWafers2025: 670_000,
  cowosDemandWafers2026: 1_000_000,
  cowosLeadTimeWeeks: 52,
  skHynixHbmSharePct2025: 52.3,
  nvidiaCowosSharePct2025: 60,
} as const;

export const SUPPLY_CHAIN: SupplyChainRecord[] = [
  // ── CoWoS capacity milestones ──
  {
    id: "tsmc-cowos-e2024",
    entity: "TSMC",
    layer: "cowos",
    metric: "CoWoS capacity",
    year: 2024,
    value: 37_500,
    unit: "wpm",
    valueLow: 35_000,
    valueHigh: 40_000,
    status: "tight",
    source: "TrendForce / Silicon Analysts interpolation",
    notes: "Pre-expansion baseline before 2025 doubling push",
  },
  {
    id: "tsmc-cowos-e2025",
    entity: "TSMC",
    layer: "cowos",
    metric: "CoWoS capacity",
    year: 2025,
    value: 75_000,
    unit: "wpm",
    valueLow: 70_000,
    valueHigh: 80_000,
    status: "sold_out",
    source: "TrendForce, Jan 2025",
    notes: "AP8 (ex-Innolux) + Taichung; nearly 2× 2024 output",
  },
  {
    id: "tsmc-cowos-e2026",
    entity: "TSMC",
    layer: "cowos",
    metric: "CoWoS capacity target",
    year: 2026,
    value: 125_000,
    unit: "wpm",
    valueLow: 120_000,
    valueHigh: 130_000,
    status: "expanding",
    source: "Silicon Analysts / GlobalSemiResearch, Dec 2025",
    notes: "C.C. Wei: sold out through 2025 into 2026 despite ramp",
  },
  {
    id: "tsmc-cowos-cagr",
    entity: "TSMC",
    layer: "cowos",
    metric: "CoWoS capacity CAGR",
    year: 2026,
    value: 50,
    unit: "%",
    product: "2022–2026",
    status: "benchmark",
    source: "TSMC VP Jun He, TrendForce Jan 2025",
    notes: "Fab build cycle shortened from 3–5 yrs to 1.5–2 yrs",
  },
  {
    id: "cowos-lead-time",
    entity: "Industry",
    layer: "cowos",
    metric: "CoWoS lead time",
    year: 2025,
    value: 52,
    unit: "weeks",
    valueLow: 50,
    valueHigh: 78,
    status: "sold_out",
    source: "Silicon Analysts / TSMC supply-chain reports",
    notes: "Booking window, not fab cycle — lines stay full at higher wpm",
  },

  // ── CoWoS annual demand ──
  {
    id: "cowos-demand-2024",
    entity: "Global",
    layer: "demand",
    metric: "CoWoS wafer demand",
    year: 2024,
    value: 370_000,
    unit: "wafers/yr",
    status: "benchmark",
    source: "Silicon Analysts foundry allocation tracker",
  },
  {
    id: "cowos-demand-2025",
    entity: "Global",
    layer: "demand",
    metric: "CoWoS wafer demand",
    year: 2025,
    value: 670_000,
    unit: "wafers/yr",
    status: "sold_out",
    source: "Silicon Analysts, Q1 2026",
    notes: "Demand growth outpaces capacity even as wpm doubles",
  },
  {
    id: "cowos-demand-2026",
    entity: "Global",
    layer: "demand",
    metric: "CoWoS wafer demand forecast",
    year: 2026,
    value: 1_000_000,
    unit: "wafers/yr",
    status: "sold_out",
    source: "Silicon Analysts / sell-side consensus",
    notes: "~3× 2024 demand; top 3 customers >85% of bookings",
  },

  // ── Customer CoWoS allocation ──
  {
    id: "nvidia-cowos-2025",
    entity: "NVIDIA",
    layer: "demand",
    metric: "CoWoS wafer allocation",
    year: 2025,
    value: 400_000,
    unit: "wafers/yr",
    valueLow: 380_000,
    valueHigh: 420_000,
    product: "Blackwell B200/GB200",
    status: "sold_out",
    source: "GlobalSemiResearch, late 2025",
    notes: "~60% of TSMC CoWoS; shift to CoWoS-L",
  },
  {
    id: "nvidia-cowos-2026",
    entity: "NVIDIA",
    layer: "demand",
    metric: "CoWoS wafer allocation forecast",
    year: 2026,
    value: 700_000,
    unit: "wafers/yr",
    product: "Blackwell Ultra / Vera Rubin",
    status: "sold_out",
    source: "GlobalSemiResearch / Silicon Analysts",
    notes: "75%+ YoY growth; 70–80% outsourced to OSAT",
  },
  {
    id: "amd-cowos-2025",
    entity: "AMD",
    layer: "demand",
    metric: "CoWoS wafer allocation",
    year: 2025,
    value: 55_000,
    unit: "wafers/yr",
    valueLow: 45_000,
    valueHigh: 65_000,
    product: "MI300X / MI325",
    status: "tight",
    source: "TrendForce / industry allocation estimates",
    notes: "Shares tight remainder with Broadcom, Marvell, AWS ASICs",
  },
  {
    id: "google-cowos-2025",
    entity: "Google",
    layer: "demand",
    metric: "CoWoS wafer allocation",
    year: 2025,
    value: 80_000,
    unit: "wafers/yr",
    product: "TPU v6 (CoWoS-S)",
    status: "tight",
    source: "GlobalSemiResearch",
  },
  {
    id: "google-cowos-2026",
    entity: "Google",
    layer: "demand",
    metric: "CoWoS wafer demand target",
    year: 2026,
    value: 240_000,
    unit: "wafers/yr",
    valueLow: 150_000,
    valueHigh: 180_000,
    product: "TPU v7 / v8",
    status: "tight",
    source: "GlobalSemiResearch",
    notes: "Target 240K; TSMC delivery est. 150–180K → ~3.2M TPUs vs 6M goal",
  },
  {
    id: "broadcom-cowos-2025",
    entity: "Broadcom",
    layer: "demand",
    metric: "CoWoS wafer allocation",
    year: 2025,
    value: 40_000,
    unit: "wafers/yr",
    valueLow: 30_000,
    valueHigh: 50_000,
    product: "Custom ASIC (Google/Meta)",
    status: "tight",
    source: "TrendForce / Silicon Analysts",
    notes: "Hyperscaler ASICs compete for post-NVIDIA CoWoS slots",
  },

  // ── OSAT outsourcing ──
  {
    id: "amkor-cowos-2026",
    entity: "Amkor",
    layer: "osat",
    metric: "Outsourced CoWoS wafers",
    year: 2026,
    value: 185_000,
    unit: "wafers/yr",
    valueLow: 180_000,
    valueHigh: 190_000,
    region: "Arizona / Vietnam",
    status: "ramping",
    source: "GlobalSemiResearch",
    notes: "Largest OSAT CoWoS partner for TSMC overflow",
  },
  {
    id: "spil-cowos-2026",
    entity: "SPIL (ASE)",
    layer: "osat",
    metric: "Outsourced CoWoS wafers",
    year: 2026,
    value: 70_000,
    unit: "wafers/yr",
    valueLow: 60_000,
    valueHigh: 80_000,
    region: "Taiwan",
    status: "ramping",
    source: "GlobalSemiResearch",
  },
  {
    id: "osat-total-2026",
    entity: "OSAT (combined)",
    layer: "osat",
    metric: "Outsourced CoWoS wafers",
    year: 2026,
    value: 255_000,
    unit: "wafers/yr",
    valueLow: 240_000,
    valueHigh: 270_000,
    status: "expanding",
    source: "GlobalSemiResearch",
    notes: "TSMC outsources 240–270K wafers/yr to relieve CoWoS-S load",
  },

  // ── HBM supply ──
  {
    id: "hbm-tam-2024",
    entity: "Global",
    layer: "market",
    metric: "HBM market size",
    year: 2024,
    value: 18.2,
    unit: "USD B",
    status: "benchmark",
    source: "TrendForce Roadshow Korea, late 2024",
  },
  {
    id: "hbm-tam-2025",
    entity: "Global",
    layer: "market",
    metric: "HBM market size",
    year: 2025,
    value: 46.7,
    unit: "USD B",
    status: "benchmark",
    source: "TrendForce (Avril Wu), +156% YoY",
    notes: "HBM = 34% of total DRAM market in 2025",
  },
  {
    id: "hbm-tam-2026",
    entity: "Global",
    layer: "market",
    metric: "HBM market size forecast",
    year: 2026,
    value: 54.6,
    unit: "USD B",
    status: "benchmark",
    source: "BofA via SK hynix 2026 outlook",
    notes: "+58% YoY; ASIC HBM demand +82% per Goldman",
  },
  {
    id: "skhynix-hbm-share-2025",
    entity: "SK hynix",
    layer: "hbm",
    metric: "HBM market share",
    year: 2025,
    value: 52.3,
    unit: "%",
    product: "HBM3E / HBM3E 12-hi",
    status: "sold_out",
    source: "TrendForce, Aug 2025",
    notes: "Sold out for 2025; taking 2026 orders",
  },
  {
    id: "samsung-hbm-share-2025",
    entity: "Samsung",
    layer: "hbm",
    metric: "HBM market share",
    year: 2025,
    value: 28.7,
    unit: "%",
    product: "HBM3E 12-hi (qual ongoing)",
    status: "ramping",
    source: "TrendForce, Aug 2025",
    notes: "Down from 41% in 2024; NVIDIA 12-hi verification delays",
  },
  {
    id: "micron-hbm-share-2025",
    entity: "Micron",
    layer: "hbm",
    metric: "HBM market share",
    year: 2025,
    value: 19.0,
    unit: "%",
    product: "HBM3E 12-hi",
    status: "ramping",
    source: "TrendForce, Aug 2025",
    notes: "Idaho + Malaysia expansion; target 20–25% by Aug 2025",
  },
  {
    id: "skhynix-hbm-rev-2024",
    entity: "SK hynix",
    layer: "hbm",
    metric: "HBM revenue",
    year: 2024,
    value: 10.0,
    unit: "USD B",
    valueLow: 10.0,
    valueHigh: 12.0,
    status: "benchmark",
    source: "TrendForce / SK hynix disclosures",
    notes: ">225% YoY HBM revenue growth",
  },
  {
    id: "nvidia-skhynix-rev-1h25",
    entity: "NVIDIA → SK hynix",
    layer: "hbm",
    metric: "Customer revenue share",
    year: 2025,
    value: 27,
    unit: "%",
    product: "HBM for Blackwell",
    status: "sold_out",
    source: "TrendForce, Aug 2025",
    notes: "NVIDIA = 27% of SK hynix total revenue in 1H25",
  },
  {
    id: "hbm3e-mix-2025",
    entity: "Global",
    layer: "hbm",
    metric: "HBM3E mix of HBM shipments",
    year: 2025,
    value: 85,
    unit: "%",
    status: "benchmark",
    source: "TrendForce",
    notes: "Up from 46% in 2024; driven by NVIDIA Blackwell",
  },
  {
    id: "hbm4-qual-2026",
    entity: "SK hynix",
    layer: "hbm",
    metric: "HBM4 NVIDIA qualification",
    year: 2026,
    value: 1,
    unit: "qualified",
    product: "Vera Rubin",
    status: "ramping",
    source: "Silicon Analysts qual tracker, Jun 2026",
    notes: "Samsung HBM4 also qualified Jun 2026; SK hynix ~60% share",
  },
];

export const HBM_SUPPLIERS = SUPPLY_CHAIN.filter((r) => r.layer === "hbm" && r.metric === "HBM market share");

export const COWOS_CAPACITY = SUPPLY_CHAIN.filter(
  (r) => r.layer === "cowos" && r.metric.includes("CoWoS capacity"),
);

export const CUSTOMER_DEMAND = SUPPLY_CHAIN.filter((r) => r.layer === "demand");

export const OSAT_PARTNERS = SUPPLY_CHAIN.filter((r) => r.layer === "osat");

export function fmtWpm(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K wpm`;
  return `${n.toLocaleString("en-US")} wpm`;
}

export function fmtWafers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M wafers/yr`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K wafers/yr`;
  return `${n.toLocaleString("en-US")} wafers/yr`;
}

export function fmtUsdB(n: number): string {
  return `$${n.toFixed(1)}B`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtWeeks(n: number): string {
  return `${n} weeks`;
}

export function recordsByLayer(layer: BottleneckLayer): SupplyChainRecord[] {
  return SUPPLY_CHAIN.filter((r) => r.layer === layer);
}

export function recordsByYear(year: number): SupplyChainRecord[] {
  return SUPPLY_CHAIN.filter((r) => r.year === year);
}

export function demandGap2025(): number {
  const demand = GLOBAL_SUMMARY.cowosDemandWafers2025;
  const capacity = GLOBAL_SUMMARY.cowosCapacityWpmEnd2025 * 12;
  return Math.max(0, demand - capacity);
}

/** Dashboard summary cards — derived from GLOBAL_SUMMARY */
export const STATS = {
  recordCount: SUPPLY_CHAIN.length,
  hbmMarketLabel: fmtUsdB(GLOBAL_SUMMARY.hbmMarketUsdB2025),
  cowosCapacityLabel: fmtWpm(GLOBAL_SUMMARY.cowosCapacityWpmEnd2025),
  cowosDemandLabel: fmtWafers(GLOBAL_SUMMARY.cowosDemandWafers2025),
  skHynixShareLabel: fmtPct(GLOBAL_SUMMARY.skHynixHbmSharePct2025),
  cowosLeadTimeLabel: fmtWeeks(GLOBAL_SUMMARY.cowosLeadTimeWeeks),
  nvidiaCowosShareLabel: fmtPct(GLOBAL_SUMMARY.nvidiaCowosSharePct2025),
};
