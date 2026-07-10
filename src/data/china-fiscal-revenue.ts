import { REVENUE_COMMENTARY } from "./china-fiscal-revenue-commentary";

/** 2024 MOF actuals converted at 2024 avg FX — reported as 2025 USD (site convention) */
export const FX = 7.2;
export const USD_YEAR = "USD";
export const FX_LABEL = "¥7.2/$";

export type BudgetKey = "General Public" | "Gov. Funds" | "State Capital" | "Social Insurance";

export type RevTypeKey =
  | "goods-services"
  | "income-tax"
  | "property-behavior"
  | "nontax-asset"
  | "nontax-soe"
  | "nontax-fines"
  | "nontax-fees"
  | "nontax-other"
  | "gov-fund-land"
  | "gov-fund-fee"
  | "soe-profit"
  | "social-ins";

type RevLine = { name: string; cny100m: number; official?: boolean; note?: string };

export const BUDGET_OFFICIAL_TOTALS: Record<BudgetKey, number> = {
  "General Public": 219702,
  "Gov. Funds": 62090,
  "State Capital": 6783,
  "Social Insurance": 120135,
};

export const BUDGET_BAR_COLORS: Record<BudgetKey, string> = {
  "General Public": "#3b82f6",
  "Gov. Funds": "#22c55e",
  "State Capital": "#f97316",
  "Social Insurance": "#ec4899",
};

export const BUDGET_LABELS: Record<BudgetKey, string> = {
  "General Public": "General Public Budget",
  "Gov. Funds": "Gov. Funds Budget",
  "State Capital": "State Capital (SOE) Budget",
  "Social Insurance": "Social Insurance Budget",
};

export const BUDGET_LEGEND_ORDER: BudgetKey[] = [
  "General Public",
  "Gov. Funds",
  "State Capital",
  "Social Insurance",
];

const TAXES: RevLine[] = [
  { name: "Domestic VAT", cny100m: 66672 },
  { name: "Corporate Income Tax", cny100m: 40887 },
  { name: "Import VAT + Consumption", cny100m: 19177 },
  { name: "Domestic Consumption Tax", cny100m: 16532 },
  { name: "Individual Income Tax", cny100m: 14522 },
  { name: "Deed Tax", cny100m: 5170 },
  { name: "Urban Maintenance & Construction", cny100m: 5026 },
  { name: "Property Tax", cny100m: 4705 },
  { name: "Land Appreciation Tax", cny100m: 4869 },
  { name: "Stamp Tax", cny100m: 3427 },
  { name: "Resource Tax", cny100m: 2964 },
  { name: "Vehicle Purchase Tax", cny100m: 2430 },
  { name: "Tariffs", cny100m: 2443 },
  { name: "Urban Land Use Tax", cny100m: 2425 },
  { name: "Farmland Occupation Tax", cny100m: 1368 },
  { name: "Environmental Protection Tax", cny100m: 246 },
  { name: "Other (vehicle, vessel, tobacco leaf)", cny100m: 1390 },
];

const NON_TAX: RevLine[] = [
  { name: "State asset & resource use fees", cny100m: 19000 },
  { name: "State SOE remittance (general budget)", cny100m: 6231 },
  { name: "Fines & confiscations", cny100m: 4522.58 },
  { name: "Special receipts (surcharges)", cny100m: 7817.58 },
  { name: "Administrative fees", cny100m: 4094.84 },
  { name: "Other non-tax", cny100m: 3065.0 },
];

const GOV_FUNDS: RevLine[] = [
  { name: "Land use rights transfer", cny100m: 48699 },
  { name: "Lottery public welfare fund", cny100m: 1601 },
  { name: "Renewable energy surcharge", cny100m: 1174 },
  { name: "City infrastructure配套费", cny100m: 1782 },
  { name: "State land benefit fund", cny100m: 1360 },
  { name: "Railway construction fund", cny100m: 639 },
  { name: "Vehicle tolls", cny100m: 664 },
  { name: "Aviation development fund", cny100m: 401.91 },
  { name: "Central reservoir migrant fund", cny100m: 373 },
  { name: "Major water conservancy fund", cny100m: 180 },
  { name: "Lottery sales agency fees", cny100m: 238 },
  { name: "Ag. land development fund", cny100m: 74 },
  { name: "Other gov. fund items", cny100m: 4904 },
];

const CENTRAL_SOE_INDUSTRY: RevLine[] = [
  { name: "Tobacco", cny100m: 575.53 },
  { name: "Oil & petrochemical", cny100m: 508.34 },
  { name: "Power", cny100m: 224.4 },
  { name: "Telecom", cny100m: 212.69 },
  { name: "Overseas / international", cny100m: 104.88 },
  { name: "Construction", cny100m: 102.41 },
  { name: "Coal", cny100m: 98.43 },
  { name: "Other industries", cny100m: 275.11 },
];

const CENTRAL_SOE_OTHER: RevLine[] = [
  { name: "Dividends & equity disposal", cny100m: 149.07 },
  { name: "Property transfer income", cny100m: 0.77 },
  { name: "Liquidation income", cny100m: 0.27 },
];

const SOCIAL_INS: RevLine[] = [
  { name: "Enterprise employee pension", cny100m: 56952.51 },
  { name: "Employee basic medical", cny100m: 23725.56 },
  { name: "Government employee pension", cny100m: 17687.79 },
  { name: "Urban-rural resident medical", cny100m: 11189.34 },
  { name: "Urban-rural resident pension", cny100m: 7293.48 },
  { name: "Unemployment insurance", cny100m: 1973.03 },
  { name: "Work injury insurance", cny100m: 1313.29 },
];

const NET_TAX_CNY100M = 174972;
const GROSS_TAX_CNY100M = TAXES.reduce((s, t) => s + t.cny100m, 0);
const TAX_NET_FACTOR = NET_TAX_CNY100M / GROSS_TAX_CNY100M;

function classifyRevType(name: string, kind: "tax" | "nontax"): RevTypeKey {
  if (kind === "nontax") {
    if (name.startsWith("State asset")) return "nontax-asset";
    if (name.startsWith("State SOE")) return "nontax-soe";
    if (name.startsWith("Fines")) return "nontax-fines";
    if (name.startsWith("Special") || name.startsWith("Administrative")) return "nontax-fees";
    return "nontax-other";
  }
  if (name === "Domestic VAT" || name === "Import VAT + Consumption" || name === "Domestic Consumption Tax") {
    return "goods-services";
  }
  if (name === "Corporate Income Tax" || name === "Individual Income Tax") return "income-tax";
  return "property-behavior";
}

function buildGranularGenPublic() {
  const netTaxLines = TAXES.map((t, idx) => {
    const raw = t.cny100m * TAX_NET_FACTOR;
    const cny100m = idx === 0 ? raw : Math.round(raw * 100) / 100;
    return { label: t.name, cny100m, revType: classifyRevType(t.name, "tax") };
  });
  const netTaxSum = netTaxLines.slice(1).reduce((s, r) => s + r.cny100m, 0);
  netTaxLines[0].cny100m = Math.round((NET_TAX_CNY100M - netTaxSum) * 100) / 100;

  return [
    ...netTaxLines,
    ...NON_TAX.map((n) => ({
      label: n.name,
      cny100m: n.cny100m,
      revType: classifyRevType(n.name, "nontax"),
    })),
  ].sort((a, b) => b.cny100m - a.cny100m);
}

type GranularItem = {
  label: string;
  cny100m: number;
  revType: RevTypeKey;
  budget: BudgetKey;
};

function normalizeBudgetGroup(items: GranularItem[], targetTotal: number): GranularItem[] {
  const sum = items.reduce((s, i) => s + i.cny100m, 0);
  if (Math.abs(sum - targetTotal) < 0.01) return items;
  const scaled = items.map((item, idx) => {
    if (idx === 0) return { ...item, cny100m: item.cny100m * (targetTotal / sum) };
    return { ...item, cny100m: Math.round(item.cny100m * (targetTotal / sum) * 100) / 100 };
  });
  const tailSum = scaled.slice(1).reduce((s, i) => s + i.cny100m, 0);
  scaled[0].cny100m = Math.round((targetTotal - tailSum) * 100) / 100;
  return scaled;
}

function rawCentralShare(item: GranularItem): number {
  const { label, revType, budget } = item;
  if (budget === "Social Insurance") return 26279.16 / 120135;
  if (budget === "State Capital") return label.startsWith("Local SOE") ? 0 : 1;
  if (budget === "Gov. Funds") {
    if (revType === "gov-fund-land") return 0.01;
    if (label.includes("Aviation") || label.includes("Railway") || label.includes("Central reservoir")) return 1;
    return 0.05;
  }
  if (label === "Domestic VAT") return 0.5;
  if (label === "Corporate Income Tax" || label === "Individual Income Tax") return 0.6;
  if (
    label === "Import VAT + Consumption" ||
    label === "Domestic Consumption Tax" ||
    label === "Vehicle Purchase Tax" ||
    label === "Tariffs"
  ) {
    return 1;
  }
  if (label === "Stamp Tax") return 0.37;
  if (revType === "property-behavior") return 0.08;
  if (revType === "nontax-asset") return 0.02;
  if (revType === "nontax-soe") return 0.82;
  if (revType === "nontax-fines") return 0.12;
  if (label === "Special receipts (surcharges)") return 0.38;
  if (label === "Administrative fees") return 0.15;
  if (revType === "nontax-other") return 0.22;
  return 0.457;
}

export function cny100mToUsdB(cny100m: number): number {
  return cny100m / FX / 10;
}

export function cny100mToUsdT(cny100m: number): number {
  return cny100mToUsdB(cny100m) / 1000;
}

export function fmtUsdB(v: number): string {
  if (v >= 1000) return `$${(v / 1000).toFixed(2)}T ${USD_YEAR}`;
  if (v >= 1) return `$${v.toFixed(0)}B ${USD_YEAR}`;
  return `$${(v * 1000).toFixed(0)}M ${USD_YEAR}`;
}

export function fmtUsdT(v: number): string {
  return `$${v.toFixed(2)}T ${USD_YEAR}`;
}

export const ALL_REVENUE_TOTAL = Object.values(BUDGET_OFFICIAL_TOTALS).reduce((s, v) => s + v, 0);
export const ALL_REVENUE_USD_T = cny100mToUsdT(ALL_REVENUE_TOTAL);

export type GranularChartRow = GranularItem & {
  central: number;
  local: number;
  splitLeft: string;
  splitRight: string;
  commentary: string;
  usdB: number;
  pctOfTotal: number;
};

function buildAll(): GranularChartRow[] {
  const genPublic = normalizeBudgetGroup(
    buildGranularGenPublic().map((r) => ({ ...r, budget: "General Public" as const })),
    BUDGET_OFFICIAL_TOTALS["General Public"],
  );

  const govFunds = normalizeBudgetGroup(
    GOV_FUNDS.map((g) => ({
      label: g.name,
      cny100m: g.cny100m,
      revType: g.name.includes("Land use") ? ("gov-fund-land" as RevTypeKey) : ("gov-fund-fee" as RevTypeKey),
      budget: "Gov. Funds" as const,
    })),
    BUDGET_OFFICIAL_TOTALS["Gov. Funds"],
  );

  const soeCapital = normalizeBudgetGroup(
    [
      ...CENTRAL_SOE_INDUSTRY.map((s) => ({
        label: `Central SOE · ${s.name}`,
        cny100m: s.cny100m,
        revType: "soe-profit" as RevTypeKey,
        budget: "State Capital" as const,
      })),
      ...CENTRAL_SOE_OTHER.map((s) => ({
        label: `Central SOE · ${s.name}`,
        cny100m: s.cny100m,
        revType: "soe-profit" as RevTypeKey,
        budget: "State Capital" as const,
      })),
      {
        label: "Local SOE profit remittance",
        cny100m: 4531.1,
        revType: "soe-profit" as RevTypeKey,
        budget: "State Capital" as const,
      },
    ],
    BUDGET_OFFICIAL_TOTALS["State Capital"],
  );

  const social = normalizeBudgetGroup(
    SOCIAL_INS.map((s) => ({
      label: s.name,
      cny100m: s.cny100m,
      revType: "social-ins" as RevTypeKey,
      budget: "Social Insurance" as const,
    })),
    BUDGET_OFFICIAL_TOTALS["Social Insurance"],
  );

  const items = [...genPublic, ...govFunds, ...soeCapital, ...social].sort((a, b) => b.cny100m - a.cny100m);

  return items.map((item) => {
    const share = rawCentralShare(item);
    const central = item.cny100m * share;
    const isSocial = item.budget === "Social Insurance";
    const usdB = cny100mToUsdB(item.cny100m);
    return {
      ...item,
      central,
      local: item.cny100m - central,
      splitLeft: isSocial ? "Fiscal subsidy (central)" : "Central government",
      splitRight: isSocial ? "Premiums & local collections" : "Local government",
      commentary:
        REVENUE_COMMENTARY[item.label] ??
        `${item.label} — ${BUDGET_LABELS[item.budget]}. MOF 2024 execution (亿元), converted to ${USD_YEAR} at ${FX_LABEL}.`,
      usdB,
      pctOfTotal: (item.cny100m / ALL_REVENUE_TOTAL) * 100,
    };
  });
}

export const GRANULAR_CHART_ITEMS = buildAll();

export const GRANULAR_CHART_SUM = GRANULAR_CHART_ITEMS.reduce((s, i) => s + i.cny100m, 0);

export const STATS = {
  lineItems: GRANULAR_CHART_ITEMS.length,
  totalUsdT: ALL_REVENUE_USD_T,
  totalCny100m: ALL_REVENUE_TOTAL,
};
