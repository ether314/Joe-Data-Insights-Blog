/**
 * Farm share of the food dollar (2026).
 *
 * Core question: What is the farm-production share of US food-at-home
 * spending, and how did marketing margins absorb the recent commodity swings?
 *
 * Perimeter: USDA ERS Food Dollar Series (March 2026 model update releasing
 * 2024 data and revised prior years); BLS CPI food-at-home / food-away-from-home
 * annual percent changes via ERS Food Price Outlook; farm-level PPI egg path
 * for the commodity-vs-retail wedge. Industry-group and product-account cents
 * are marketing-bill / industry-bill shares of domestically produced food
 * dollars — not net farm income after all production expenses.
 *
 * Headline: Food-at-home farm share was 18.5¢ per dollar in 2024 (up 0.1¢
 * from 2023); the all-food farm share fell to 11.8¢ as spending shifted toward
 * food away from home (7.1¢ farm share).
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "USDA ERS Food Dollar Series summary findings and chart gallery (March 10, 2026 model update): marketing bill, industry group bill, and food-at-home product-account farm shares for 2023–2024 under the revised definition that includes bottled water, soft drinks, coffee, tea, and beverage materials. Spending levels and farm receipts from the same release. BLS CPI annual percent changes for food at home / food away from home via ERS Food Price Outlook / Amber Waves (2022–2025). Farm-level egg PPI path from ERS Food Price Outlook summary findings. Product-account farm shares cross-checked against AFBF Focus on Ag reporting of the 2024 ERS accounts. Pre-2023 trend points on the revised model are carried interpolations between disclosed anchors where ERS has not published a full public table in this build — treat as directionally consistent, not audit-grade.";

export const SOURCES = [
  {
    label: "USDA ERS — Food Dollar summary findings (2024 / Mar 2026 update)",
    url: "https://www.ers.usda.gov/data-products/food-dollar/summary-findings",
  },
  {
    label: "USDA ERS — Food Dollar data product",
    url: "https://www.ers.usda.gov/data-products/food-dollar",
  },
  {
    label: "USDA ERS — Charts of Note: farm share at home vs away (2024)",
    url: "https://www.ers.usda.gov/data-products/charts-of-note/114103",
  },
  {
    label: "USDA ERS — Food Price Outlook summary findings",
    url: "https://www.ers.usda.gov/data-products/food-price-outlook/summary-findings",
  },
  {
    label: "USDA ERS — Amber Waves: food price inflation slowed 2023–2024",
    url: "https://www.ers.usda.gov/amber-waves/2025/june/food-price-inflation-slowed-in-2023-and-2024",
  },
] as const;

export const HEADLINE = {
  /** Marketing-bill farm share, all domestically produced food, 2024 */
  farmShareAll2024Cents: 11.8,
  farmShareAll2023Cents: 12.1,
  marketingShare2024Cents: 88.2,
  /** Food-at-home farm share (groceries), 2024 */
  farmShareAtHome2024Cents: 18.5,
  farmShareAtHome2023Cents: 18.4,
  /** Food-away-from-home farm share, 2024 */
  farmShareAway2024Cents: 7.1,
  farmShareAway2023Cents: 7.5,
  /** Industry-group farm value added (net of purchased inputs), 2024 */
  farmValueAdded2024Cents: 6.7,
  cropsVa2024Cents: 2.5,
  livestockVa2024Cents: 3.3,
  forestryFishingAgServicesVa2024Cents: 0.9,
  /** Gross farm receipts linked to domestic food dollars, $ billions */
  farmReceipts2024Bn: 256.7,
  farmReceipts2023Bn: 254.1,
  domesticFoodSpending2024Tn: 2.17,
  totalFoodSpending2024Tn: 2.58,
  foodAtHomeSpending2024Bn: 901,
  foodAwaySpending2024Tn: 1.27,
  confidence: "disclosed" as Confidence,
};

/** Marketing bill farm vs marketing share, revised model */
export type MarketingBillRow = {
  year: number;
  farmShareCents: number;
  marketingShareCents: number;
  atHomeFarmCents: number;
  awayFarmCents: number;
  confidence: Confidence;
};

export const MARKETING_BILL_TREND: MarketingBillRow[] = [
  {
    year: 2019,
    farmShareCents: 13.4,
    marketingShareCents: 86.6,
    atHomeFarmCents: 20.1,
    awayFarmCents: 8.4,
    confidence: "carried",
  },
  {
    year: 2020,
    farmShareCents: 13.8,
    marketingShareCents: 86.2,
    atHomeFarmCents: 20.6,
    awayFarmCents: 8.0,
    confidence: "carried",
  },
  {
    year: 2021,
    farmShareCents: 13.0,
    marketingShareCents: 87.0,
    atHomeFarmCents: 19.8,
    awayFarmCents: 7.8,
    confidence: "carried",
  },
  {
    year: 2022,
    farmShareCents: 12.6,
    marketingShareCents: 87.4,
    atHomeFarmCents: 19.2,
    awayFarmCents: 7.6,
    confidence: "carried",
  },
  {
    year: 2023,
    farmShareCents: 12.1,
    marketingShareCents: 87.9,
    atHomeFarmCents: 18.4,
    awayFarmCents: 7.5,
    confidence: "disclosed",
  },
  {
    year: 2024,
    farmShareCents: 11.8,
    marketingShareCents: 88.2,
    atHomeFarmCents: 18.5,
    awayFarmCents: 7.1,
    confidence: "disclosed",
  },
];

/** Industry group bill — cents per all-food dollar, 2024 */
export type IndustryGroupRow = {
  id: string;
  label: string;
  cents2024: number;
  cents2023: number;
  /** Value-added $ billions where disclosed */
  valueAdded2024Bn?: number;
  confidence: Confidence;
  sector: "farm" | "midstream" | "retail-service" | "support";
};

export const INDUSTRY_GROUP_BILL: IndustryGroupRow[] = [
  {
    id: "food-services",
    label: "Food services",
    cents2024: 38.6,
    cents2023: 37.5,
    valueAdded2024Bn: 836.8,
    confidence: "disclosed",
    sector: "retail-service",
  },
  {
    id: "food-processing",
    label: "Food processing",
    cents2024: 16.1,
    cents2023: 16.4,
    confidence: "disclosed",
    sector: "midstream",
  },
  {
    id: "food-retail",
    label: "Food retail",
    cents2024: 13.8,
    cents2023: 13.9,
    confidence: "disclosed",
    sector: "retail-service",
  },
  {
    id: "food-wholesale",
    label: "Food wholesale",
    cents2024: 6.3,
    cents2023: 6.4,
    confidence: "disclosed",
    sector: "midstream",
  },
  {
    id: "livestock",
    label: "Livestock",
    cents2024: 3.3,
    cents2023: 3.0,
    confidence: "disclosed",
    sector: "farm",
  },
  {
    id: "agribusiness",
    label: "Agribusiness inputs",
    cents2024: 3.0,
    cents2023: 3.1,
    confidence: "disclosed",
    sector: "support",
  },
  {
    id: "crops",
    label: "Crops",
    cents2024: 2.5,
    cents2023: 2.9,
    confidence: "disclosed",
    sector: "farm",
  },
  {
    id: "transport-storage",
    label: "Transportation & storage",
    cents2024: 3.4,
    cents2023: 3.6,
    confidence: "estimated",
    sector: "midstream",
  },
  {
    id: "energy",
    label: "Energy",
    cents2024: 3.2,
    cents2023: 3.6,
    confidence: "estimated",
    sector: "support",
  },
  {
    id: "finance-insurance",
    label: "Finance & insurance",
    cents2024: 2.8,
    cents2023: 2.9,
    confidence: "estimated",
    sector: "support",
  },
  {
    id: "forestry-fishing-ag",
    label: "Forestry, fishing & ag services",
    cents2024: 0.9,
    cents2023: 0.9,
    confidence: "disclosed",
    sector: "farm",
  },
  {
    id: "other-business",
    label: "Other business services",
    cents2024: 6.1,
    cents2023: 5.7,
    confidence: "estimated",
    sector: "support",
  },
];

/** Food-at-home product-account farm shares, 2024 (cents per product dollar) */
export type ProductFarmShareRow = {
  id: string;
  label: string;
  farmShareCents: number;
  processingIntensity: "minimal" | "moderate" | "heavy";
  confidence: Confidence;
};

export const PRODUCT_FARM_SHARES: ProductFarmShareRow[] = [
  {
    id: "eggs",
    label: "Fresh eggs",
    farmShareCents: 69.1,
    processingIntensity: "minimal",
    confidence: "disclosed",
  },
  {
    id: "beef",
    label: "Beef",
    farmShareCents: 52.2,
    processingIntensity: "moderate",
    confidence: "disclosed",
  },
  {
    id: "tree-nuts",
    label: "Tree nuts & peanuts",
    farmShareCents: 51.0,
    processingIntensity: "minimal",
    confidence: "disclosed",
  },
  {
    id: "milk",
    label: "Fresh milk",
    farmShareCents: 50.8,
    processingIntensity: "minimal",
    confidence: "disclosed",
  },
  {
    id: "fresh-fruit",
    label: "Fresh fruits",
    farmShareCents: 39.6,
    processingIntensity: "minimal",
    confidence: "disclosed",
  },
  {
    id: "poultry",
    label: "Poultry",
    farmShareCents: 30.4,
    processingIntensity: "moderate",
    confidence: "disclosed",
  },
  {
    id: "fish",
    label: "Fish",
    farmShareCents: 29.3,
    processingIntensity: "moderate",
    confidence: "disclosed",
  },
  {
    id: "fresh-veg",
    label: "Fresh vegetables",
    farmShareCents: 26.7,
    processingIntensity: "minimal",
    confidence: "disclosed",
  },
  {
    id: "pork",
    label: "Pork",
    farmShareCents: 23.7,
    processingIntensity: "moderate",
    confidence: "disclosed",
  },
  {
    id: "all-at-home",
    label: "All food at home",
    farmShareCents: 18.5,
    processingIntensity: "moderate",
    confidence: "disclosed",
  },
  {
    id: "cereals",
    label: "Cereals",
    farmShareCents: 11.0,
    processingIntensity: "heavy",
    confidence: "disclosed",
  },
  {
    id: "snacks",
    label: "Snack foods",
    farmShareCents: 9.7,
    processingIntensity: "heavy",
    confidence: "disclosed",
  },
  {
    id: "bakery",
    label: "Bakery products",
    farmShareCents: 4.8,
    processingIntensity: "heavy",
    confidence: "disclosed",
  },
];

/** Primary factor bill — cents per food dollar */
export type PrimaryFactorRow = {
  year: number;
  laborCents: number;
  propertyCents: number;
  outputTaxCents: number;
  importedInputsCents: number;
  confidence: Confidence;
};

export const PRIMARY_FACTOR_BILL: PrimaryFactorRow[] = [
  {
    year: 2023,
    laborCents: 52.0,
    propertyCents: 34.5,
    outputTaxCents: 7.7,
    importedInputsCents: 5.8,
    confidence: "disclosed",
  },
  {
    year: 2024,
    laborCents: 54.1,
    propertyCents: 32.7,
    outputTaxCents: 7.2,
    importedInputsCents: 6.0,
    confidence: "disclosed",
  },
];

/** CPI / farm-gate volatility for the marketing-margin absorption story */
export type PricePathRow = {
  year: number;
  cpiFoodAtHomePct: number;
  cpiFoodAwayPct: number;
  cpiAllFoodPct: number;
  /** Farm-level eggs PPI annual % change (commodity swing exemplar) */
  farmEggsPpiPct: number;
  confidence: Confidence;
};

export const PRICE_PATH: PricePathRow[] = [
  {
    year: 2021,
    cpiFoodAtHomePct: 3.5,
    cpiFoodAwayPct: 4.5,
    cpiAllFoodPct: 3.9,
    farmEggsPpiPct: 12.0,
    confidence: "carried",
  },
  {
    year: 2022,
    cpiFoodAtHomePct: 11.4,
    cpiFoodAwayPct: 7.7,
    cpiAllFoodPct: 9.9,
    farmEggsPpiPct: 158.1,
    confidence: "disclosed",
  },
  {
    year: 2023,
    cpiFoodAtHomePct: 5.0,
    cpiFoodAwayPct: 7.1,
    cpiAllFoodPct: 5.8,
    farmEggsPpiPct: -28.3,
    confidence: "disclosed",
  },
  {
    year: 2024,
    cpiFoodAtHomePct: 1.2,
    cpiFoodAwayPct: 4.1,
    cpiAllFoodPct: 2.3,
    farmEggsPpiPct: 43.1,
    confidence: "disclosed",
  },
  {
    year: 2025,
    cpiFoodAtHomePct: 2.3,
    cpiFoodAwayPct: 3.8,
    cpiAllFoodPct: 2.9,
    farmEggsPpiPct: 31.6,
    confidence: "disclosed",
  },
];

/** At-home vs away channel comparison for dual-axis / radar panels */
export const CHANNEL_COMPARE = [
  {
    channel: "Food at home",
    farmShare2024: 18.5,
    farmShare2023: 18.4,
    marketingShare2024: 81.5,
    spending2024Bn: 901,
    laborIntensityHint: 47.1,
  },
  {
    channel: "Food away from home",
    farmShare2024: 7.1,
    farmShare2023: 7.5,
    marketingShare2024: 92.9,
    spending2024Bn: 1270,
    laborIntensityHint: 59.1,
  },
] as const;

export const ANALYTICS = {
  atHomeFarmDeltaCents: 0.1,
  allFoodFarmDeltaCents: -0.3,
  awayFarmDeltaCents: -0.4,
  /** Share of domestic food dollar absorbed by post-farm marketing, 2024 */
  marketingBillShare2024: 0.882,
  /** Farm VA / gross farm share wedge (purchased inputs), 2024 */
  farmInputWedgeCents: 5.1,
  foodServicesShare2024: 0.386,
  cropsVaPctChange2023to2024: -10.5,
  livestockVaPctChange2023to2024: 12.1,
  foodServicesVaPctChange2023to2024: 5.9,
  domesticFoodSpendingPctChange: 3.0,
  farmReceiptsPctChange: 1.0,
};

export const METRIC_EXPLAINERS = {
  farmShare:
    "Gross returns to farm establishments from commodities linked to consumer food spending — before subtracting purchased nonfarm inputs.",
  farmValueAdded:
    "Industry-group value added at the farm (crops + livestock + forestry/fishing/ag services), net of inputs bought from other industry groups.",
  marketingShare:
    "Post-farm processing, transport, wholesale, retail, and foodservice value that turns farm commodities into finished food dollars.",
  productAccount:
    "Farm share of a single food-at-home product dollar (e.g., fresh eggs), not the all-food average.",
} as const;
