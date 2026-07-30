/**
 * Goldman Sachs Global Institute baseline AI capex model.
 * Source: Tracking Trillions (April 2026)
 * https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out
 */

export const GS_REPORT_URL =
  "https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out";

export const SOURCE_NOTE =
  "Goldman Sachs Global Institute baseline scenario model, April 2026. Authors: George Lee and Lucas Greenbaum. GS states this is a sensitivity framework, not a forecast. All figures USD billions unless noted.";

export const YEARS = ["2026", "2027", "2028", "2029", "2030", "2031"] as const;

export const COMPUTE_BN = [494, 661, 808, 934, 1073, 1127];
export const DATACENTERS_BN = [232, 300, 353, 393, 433, 436];
export const POWER_BN = [39, 50, 59, 65, 72, 73];
export const TOTAL_BN = [765, 1011, 1220, 1392, 1579, 1636];

export const CUMULATIVE_2026_2031 = {
  compute: 5098,
  dataCenters: 2147,
  power: 358,
  total: 7603,
};

export const HEADLINE = {
  y2027: { compute: 661, dataCenters: 300, chipsPlusDc: 961, total: 1011 },
  y2028: { compute: 808, dataCenters: 353, chipsPlusDc: 1161, total: 1220 },
};

export type DcCostScenario = {
  label: string;
  perMw: number;
  y2027: number;
  y2028: number;
};

export const DC_COST_SCENARIOS: DcCostScenario[] = [
  { label: "$11M/MW", perMw: 11, y2027: 220, y2028: 259 },
  { label: "$13M/MW", perMw: 13, y2027: 260, y2028: 306 },
  { label: "$15M/MW (baseline)", perMw: 15, y2027: 300, y2028: 353 },
  { label: "$17M/MW", perMw: 17, y2027: 340, y2028: 400 },
  { label: "$19M/MW", perMw: 19, y2027: 380, y2028: 447 },
];

export type CrossCheckRow = {
  basis: string;
  y2026: string;
  y2027: string;
  y2028: string;
};

export const CROSS_CHECK: CrossCheckRow[] = [
  { basis: "GS Global Institute — total AI capex", y2026: "$765bn", y2027: "$1,011bn", y2028: "$1,220bn" },
  { basis: "GS Investment Research — hyperscaler capex (base)", y2026: "~$750bn", y2027: "~$1,140bn", y2028: "not published" },
  { basis: "GS Investment Research — hyperscaler capex (bull)", y2026: "—", y2027: "~$1,400bn", y2028: "not published" },
  { basis: "Street consensus — hyperscaler capex", y2026: "—", y2027: "~$920bn", y2028: "—" },
];

export type ChipEstimate = {
  lineItem: string;
  y2026: string;
  y2027: string;
  y2028: string;
};

export const CHIP_ESTIMATES: ChipEstimate[] = [
  { lineItem: "Broadcom AI semiconductor revenue (FY)", y2026: "$57bn", y2027: "$133bn", y2028: "$193bn" },
  { lineItem: "HBM total market", y2026: "—", y2027: "$116bn", y2028: "$168bn" },
  { lineItem: "MediaTek AI ASIC revenue", y2026: "$2.0bn", y2027: "$12.3bn", y2028: "—" },
  { lineItem: "TSMC capital expenditure", y2026: "$56bn", y2027: "$70bn", y2028: "$74bn" },
];

export const LAYER_COLORS = {
  compute: "#06b6d4",
  dataCenters: "#3b82f6",
  power: "#a78bfa",
} as const;

export function fmtBn(n: number): string {
  return `$${n.toLocaleString()}B`;
}
