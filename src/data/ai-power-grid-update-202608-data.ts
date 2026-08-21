/**
 * AI power & grid — August 2026 (202608) vintage update.
 * Prior theme post: ai-power-grid-update-2026q3 (Gartner newsroom 10 Jun 2026
 *   near-term path + IEA Electricity 2026 queues/US growth attribution).
 * Newest official vintages: IEA Electricity Mid-Year Update 2026 (H1 evidence
 *   + 2026/2027 demand & price path) + LBNL Queued Up 2026 Edition (end-2025
 *   US interconnection queues, published mid-2026).
 *
 * Core delta: Mid-Year locks US demand at +1.8% (2026) / +3% (2027) with data
 * centres still the main growth driver and H1 services +3%; US wholesale prices
 * flat amid Hormuz LNG shock (EU/Japan Q2 +30%+); LBNL restates active queues
 * at 2,061 GW (−10% y/y) while gas in queue jumps +86% to 253 GW. Dual-ledger
 * Gartner 565→>1,200 vs IEA ~950 carried — not restated.
 */

export type Confidence = "disclosed" | "estimated" | "secondary" | "carried";

export const SOURCE_NOTE =
  "Aug 202608 vintage delta vs ai-power-grid-update-2026q3. Demand, wholesale-price geography, renewables/flexibility, and US fossil-spend note from IEA Electricity Mid-Year Update 2026. US interconnection stock (gen + storage, gas surge, IA backlog, timelines) from LBNL Queued Up 2026 Edition (end-2025 data). Gartner Jun 2026 TWh/GW path and IEA Key Questions ~950 TWh / onsite-gas meters are carried — do not average ledgers.";

export const SOURCES = [
  {
    label: "IEA — Electricity Mid-Year Update 2026",
    url: "https://www.iea.org/reports/electricity-mid-year-update-2026",
  },
  {
    label: "LBNL — Queued Up: 2026 Edition (end-2025 queues)",
    url: "https://emp.lbl.gov/queues",
  },
  {
    label: "Gartner — Data center electricity +26% in 2026 (10 Jun 2026, carried)",
    url: "https://www.gartner.com/en/newsroom/press-releases/2026-06-10-gartner-says-data-center-electricity-demand-to-grow-26-percent-in-2026",
  },
  {
    label: "Prior theme update — Q3 Gartner + Electricity 2026",
    url: "/blog/ai-power-grid-update-2026q3",
  },
] as const;

export const HEADLINE = {
  priorVintage: "Gartner Jun 2026 + IEA Electricity 2026 (Q3 post)",
  newDemandVintage: "IEA Electricity Mid-Year Update 2026",
  newQueueVintage: "LBNL Queued Up 2026 Edition",
  /** Mid-Year global demand path */
  worldDemand2025Twh: 28600,
  worldDemand2027Twh: 30700,
  worldYoy2025Pct: 3.0,
  worldYoy2026Pct: 3.6,
  worldYoy2027Pct: 3.8,
  /** US demand path + H1 evidence */
  usYoy2025Pct: 2.6,
  usH1Yoy2026Pct: 1.0,
  usServicesH1YoyPct: 3.0,
  usResidentialH1YoyPct: -1.7,
  usYoy2026Pct: 1.8,
  usYoy2027Pct: 3.0,
  /** Price geography (Q2 2026 wholesale y/y) */
  euJapanQ2PriceYoyPct: 30,
  usQ2PriceYoyPct: 0,
  australiaQ2PriceYoyPct: -45,
  indiaQ2PriceYoyPct: 10,
  /** Flexibility */
  negativePriceShareCaSaPct: 20,
  negativePriceShareSpainPct: 17,
  euHeatwaveSpreadUsdMwh: 600,
  /** Renewables / supply context */
  renewablesShare2025Pct: 33,
  renewablesShare2027Pct: 37,
  solarAdd2026Twh: 600,
  gasGen2026Flat: true,
  /** LBNL queue restatement */
  usActiveTotalGw: 2061,
  usActiveGenGw: 1312,
  usActiveStorageGw: 749,
  usQueueYoyPct: -10,
  usGasQueueGw: 253,
  usGasQueueYoyPct: 86,
  usSolarQueueGw: 773,
  usSolarQueueYoyPct: -19,
  usWindQueueGw: 220,
  usWindQueueYoyPct: -19,
  usStorageQueueYoyPct: -16,
  usIaBacklogGw: 549,
  usMedianIrToCodYears: 5.5,
  usCompletionRate2000_2020Pct: 13,
  usWithdrawn2000_2020Pct: 75,
  /** Carried dual-ledger / Gartner */
  gartnerTwh2026: 565,
  gartnerYoy2026Pct: 26.4,
  ieaCentral2030Twh: 950,
  gartner2030Twh: 1200,
  dualLedgerGapTwh: 250,
  globalQueueStalledGw: 2500,
  unlockMidGw: 1400,
  usDcShareOfGrowthPct: 50,
  onsiteGasGwMid: 21,
  dcBatteryGwMid: 22.5,
  delayRiskPct: 20,
} as const;

/** Global vs US demand growth path — Mid-Year vs prior narrative */
export type DemandPathPoint = {
  year: number;
  worldYoyPct: number | null;
  usYoyPct: number | null;
  note: string;
  confidence: Confidence;
};

export const DEMAND_PATH: DemandPathPoint[] = [
  {
    year: 2025,
    worldYoyPct: 3.0,
    usYoyPct: 2.6,
    note: "Mid-Year locked prints",
    confidence: "disclosed",
  },
  {
    year: 2026,
    worldYoyPct: 3.6,
    usYoyPct: 1.8,
    note: "US soft H1 weather; DC still main driver",
    confidence: "disclosed",
  },
  {
    year: 2027,
    worldYoyPct: 3.8,
    usYoyPct: 3.0,
    note: "Acceleration resumes",
    confidence: "disclosed",
  },
];

/** US H1 2026 sector split — Mid-Year evidence */
export type UsH1Slice = {
  id: string;
  label: string;
  yoyPct: number;
  note: string;
  confidence: Confidence;
};

export const US_H1_SECTORS: UsH1Slice[] = [
  {
    id: "total",
    label: "US total H1 2026",
    yoyPct: 1.0,
    note: "Milder winter; HDD −8%+",
    confidence: "disclosed",
  },
  {
    id: "residential",
    label: "Residential",
    yoyPct: -1.7,
    note: "Heating demand down",
    confidence: "disclosed",
  },
  {
    id: "services",
    label: "Services (incl. DCs)",
    yoyPct: 3.0,
    note: "Rising data-centre consumption",
    confidence: "disclosed",
  },
  {
    id: "industrial",
    label: "Industrial",
    yoyPct: 1.0,
    note: "Manufacturing +~1%",
    confidence: "disclosed",
  },
];

/** Wholesale price geography — Hormuz shock asymmetry */
export type PriceShockRow = {
  id: string;
  region: string;
  q2YoyPct: number;
  h2FuturesYoyPct: number | null;
  note: string;
  confidence: Confidence;
};

export const PRICE_SHOCK: PriceShockRow[] = [
  {
    id: "eu",
    region: "European Union",
    q2YoyPct: 30,
    h2FuturesYoyPct: 25,
    note: "LNG-linked gas sets marginal prices",
    confidence: "disclosed",
  },
  {
    id: "japan",
    region: "Japan",
    q2YoyPct: 30,
    h2FuturesYoyPct: 40,
    note: "Spot LNG pass-through",
    confidence: "disclosed",
  },
  {
    id: "us",
    region: "United States",
    q2YoyPct: 0,
    h2FuturesYoyPct: -10,
    note: "Insulated from Hormuz LNG shock",
    confidence: "disclosed",
  },
  {
    id: "australia",
    region: "Australia",
    q2YoyPct: -45,
    h2FuturesYoyPct: -5,
    note: "Renewables + battery shifting",
    confidence: "disclosed",
  },
  {
    id: "india",
    region: "India",
    q2YoyPct: 10,
    h2FuturesYoyPct: null,
    note: "LNG minor in power mix",
    confidence: "disclosed",
  },
];

/** LBNL queue composition — tech mix restatement */
export type QueueTech = {
  id: string;
  tech: string;
  gw: number;
  yoyPct: number;
  note: string;
  confidence: Confidence;
};

export const QUEUE_COMPOSITION: QueueTech[] = [
  {
    id: "solar",
    tech: "Solar",
    gw: 773,
    yoyPct: -19,
    note: "Still largest slice",
    confidence: "disclosed",
  },
  {
    id: "storage",
    tech: "Storage",
    gw: 749,
    yoyPct: -16,
    note: "Flexibility backlog",
    confidence: "disclosed",
  },
  {
    id: "gas",
    tech: "Natural gas",
    gw: 253,
    yoyPct: 86,
    note: "Only major tech rising — AI bridge fuel",
    confidence: "disclosed",
  },
  {
    id: "wind",
    tech: "Wind",
    gw: 220,
    yoyPct: -19,
    note: "Net withdrawals",
    confidence: "disclosed",
  },
];

/** Queue stock meters — Q3 carry → LBNL full restatement */
export type QueueMeter = {
  id: string;
  metric: string;
  prior: string;
  neu: string;
  delta: string;
  valuePrior: number;
  valueNew: number;
  unit: string;
  confidence: Confidence;
};

export const QUEUE_METERS: QueueMeter[] = [
  {
    id: "active-total",
    metric: "US active gen + storage queue",
    prior: "Gen 1,312 GW featured; storage not lead",
    neu: "2,061 GW total (−10% y/y)",
    delta: "Full LBNL stock restated",
    valuePrior: 1312,
    valueNew: 2061,
    unit: "GW",
    confidence: "disclosed",
  },
  {
    id: "gas-surge",
    metric: "US active gas in queues",
    prior: "Not featured in Q3 lead",
    neu: "253 GW (+86% y/y)",
    delta: "AI bridge-fuel meter",
    valuePrior: 136,
    valueNew: 253,
    unit: "GW",
    confidence: "estimated",
  },
  {
    id: "ia-backlog",
    metric: "Draft/executed IA not yet COD",
    prior: "Not quantified in Q3",
    neu: "549 GW with IA, not online",
    delta: "New near-COD stock",
    valuePrior: 0,
    valueNew: 549,
    unit: "GW",
    confidence: "disclosed",
  },
  {
    id: "ir-cod",
    metric: "Median IR → COD (built 2025)",
    prior: ">5 years (carried narrative)",
    neu: ">5 years (restated)",
    delta: "Timeline still binding",
    valuePrior: 5.5,
    valueNew: 5.5,
    unit: "years",
    confidence: "disclosed",
  },
  {
    id: "completion",
    metric: "COD share of 2000–2020 requests",
    prior: "Most withdrawn (narrative)",
    neu: "13% COD / 75% withdrawn",
    delta: "Hit-rate meter locked",
    valuePrior: 0,
    valueNew: 13,
    unit: "%",
    confidence: "disclosed",
  },
  {
    id: "global-stall",
    metric: "Worldwide stalled connections",
    prior: ">2,500 GW (Electricity 2026)",
    neu: ">2,500 GW (carried)",
    delta: "0 — Mid-Year did not restate",
    valuePrior: 2500,
    valueNew: 2500,
    unit: "GW",
    confidence: "carried",
  },
];

/** Dual-ledger carry — not restated this vintage */
export type DualLedgerPoint = {
  year: number;
  ieaTwh: number | null;
  gartnerTwh: number | null;
  note: string;
  confidence: Confidence;
};

export const DUAL_LEDGER: DualLedgerPoint[] = [
  {
    year: 2025,
    ieaTwh: 485,
    gartnerTwh: 447,
    note: "Scope gap at base year",
    confidence: "carried",
  },
  {
    year: 2026,
    ieaTwh: null,
    gartnerTwh: 565,
    note: "Gartner near-term (carried)",
    confidence: "carried",
  },
  {
    year: 2027,
    ieaTwh: 680,
    gartnerTwh: 702,
    note: "IEA mid-path estimated",
    confidence: "estimated",
  },
  {
    year: 2030,
    ieaTwh: 950,
    gartnerTwh: 1200,
    note: "+250 TWh dual-ledger gap",
    confidence: "carried",
  },
];

/** Flexibility / negative-price hours — Mid-Year */
export type FlexMarket = {
  id: string;
  market: string;
  negativeSharePct: number;
  priorSharePct: number | null;
  note: string;
  confidence: Confidence;
};

export const FLEX_MARKETS: FlexMarket[] = [
  {
    id: "sa-ca",
    market: "S. Australia & California",
    negativeSharePct: 20,
    priorSharePct: 20,
    note: "H1 2026 ≈ 2025 level",
    confidence: "disclosed",
  },
  {
    id: "spain",
    market: "Spain",
    negativeSharePct: 17,
    priorSharePct: 10,
    note: "Up from 10% in 2025",
    confidence: "disclosed",
  },
  {
    id: "nordics",
    market: "Sweden & Finland",
    negativeSharePct: 2,
    priorSharePct: 6,
    note: "Flexibility cut negatives",
    confidence: "disclosed",
  },
];

/** Pace mismatch — campus vs wires (refreshed with LBNL / Mid-Year) */
export type PacePoint = {
  name: string;
  campusYears: number;
  interconnectYears: number;
  cluster: "campus" | "wires" | "fuel" | "price" | "unlock";
};

export const PACE_SCATTER: PacePoint[] = [
  { name: "Hyperscale campus", campusYears: 2.5, interconnectYears: 2.5, cluster: "campus" },
  { name: "AI rack density ramp", campusYears: 2, interconnectYears: 3, cluster: "campus" },
  { name: "US IR → COD median", campusYears: 5.5, interconnectYears: 5.5, cluster: "wires" },
  { name: "IA signed → COD lag", campusYears: 4, interconnectYears: 4.5, cluster: "wires" },
  { name: "Gas queue surge (+86%)", campusYears: 3.5, interconnectYears: 4, cluster: "fuel" },
  { name: "Onsite gas workaround", campusYears: 3, interconnectYears: 2, cluster: "fuel" },
  { name: "US price insulation", campusYears: 1.5, interconnectYears: 1, cluster: "price" },
  { name: "EU/Japan price shock", campusYears: 2, interconnectYears: 3.5, cluster: "price" },
  { name: "Battery / DR flex value", campusYears: 2, interconnectYears: 1.5, cluster: "unlock" },
  { name: "Flexible non-firm connect", campusYears: 2.5, interconnectYears: 2, cluster: "unlock" },
];

export const CLUSTER_COLORS: Record<PacePoint["cluster"], string> = {
  campus: "#22d3ee",
  wires: "#f59e0b",
  fuel: "#a78bfa",
  price: "#fb7185",
  unlock: "#34d399",
};

/** Scenario stance shift — Q3 → Mid-Year + LBNL */
export type StanceRow = {
  horizon: string;
  priorStance: string;
  newStance: string;
  deltaLabel: string;
  direction: "down" | "up" | "flat" | "split";
  score: number;
};

export const STANCE_SHIFT: StanceRow[] = [
  {
    horizon: "US demand 2026–27",
    priorStance: "~50% of growth is DC (to 2030)",
    newStance: "+1.8% / +3% path; DC still #1 driver",
    deltaLabel: "Live H1 path locked",
    direction: "up",
    score: 2.5,
  },
  {
    horizon: "Power-cost geography",
    priorStance: "Not featured",
    newStance: "US flat vs EU/JP Q2 +30%+",
    deltaLabel: "Hormuz asymmetry",
    direction: "split",
    score: 3,
  },
  {
    horizon: "US queue stock",
    priorStance: "Gen 1,312 GW; global >2,500",
    newStance: "2,061 GW total (−10%); gas +86%",
    deltaLabel: "LBNL full restatement",
    direction: "up",
    score: 2.5,
  },
  {
    horizon: "Near-COD IA backlog",
    priorStance: "Not quantified",
    newStance: "549 GW with IA, not online",
    deltaLabel: "New near-COD meter",
    direction: "up",
    score: 2,
  },
  {
    horizon: "Flexibility value",
    priorStance: "DC batteries 20–25 GW carried",
    newStance: "Neg. prices 17–20% of hours; €/$ spreads",
    deltaLabel: "Market signal louder",
    direction: "up",
    score: 2,
  },
  {
    horizon: "Dual-ledger 2030",
    priorStance: "IEA ~950 vs Gartner >1,200",
    newStance: "Carried — Mid-Year silent",
    deltaLabel: "0 TWh restatement",
    direction: "flat",
    score: 0,
  },
];

export function demandGrowthBars() {
  return DEMAND_PATH.flatMap((d) => {
    const rows: { label: string; yoyPct: number; fill: string }[] = [];
    if (d.worldYoyPct != null) {
      rows.push({
        label: `World ${d.year}`,
        yoyPct: d.worldYoyPct,
        fill: "#6366f1",
      });
    }
    if (d.usYoyPct != null) {
      rows.push({
        label: `US ${d.year}`,
        yoyPct: d.usYoyPct,
        fill: "#22d3ee",
      });
    }
    return rows;
  });
}

export function priceDumbbell() {
  return PRICE_SHOCK.map((p) => ({
    region: p.region.replace("United States", "US").replace("European Union", "EU"),
    q2: p.q2YoyPct,
    h2: p.h2FuturesYoyPct,
    full: p.region,
  }));
}

export function queueStack() {
  return QUEUE_COMPOSITION.map((q) => ({
    tech: q.tech,
    gw: q.gw,
    yoyPct: q.yoyPct,
    fill:
      q.id === "gas"
        ? "#a78bfa"
        : q.id === "storage"
          ? "#34d399"
          : q.id === "solar"
            ? "#f59e0b"
            : "#64748b",
  }));
}

export function dualLedgerDumbbell() {
  return DUAL_LEDGER.map((d) => ({
    year: String(d.year),
    iea: d.ieaTwh,
    gartner: d.gartnerTwh,
    note: d.note,
  }));
}
