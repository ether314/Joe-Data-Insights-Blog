export type Category =
  | "Economics"
  | "Politics"
  | "Finance"
  | "Technology"
  | "Global Systems"
  | "Energy"
  | "Industry"
  | "Consumer Finance"
  | "Capital Markets";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  /** Theme id from `src/data/theme-registry.ts` — required on all new posts */
  themeId?: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
  featured?: boolean;
  /** Renders an interactive visualization instead of static images */
  visualization?: "gdp-analysis" | "subsidies-tariffs" | "brokerage-bonuses" | "ai-data-centers" | "ccp-nomenklatura" | "china-fiscal-revenue" | "electricity-generation-mix" | "refugee-hosting-burden" | "ai-packaging-bottleneck" | "ai-token-consumption" | "deflationary-growth-2025" | "last-mile-delivery-robotics" | "goldman-sachs-ai-capex" | "hyperscaler-capex-intensity" | "semiconductor-equipment-cycle" | "us-data-center-power-grid" | "hyperscaler-ai-bond-issuance" | "ai-etf-flows" | "helium-supply-concentration" | "billion-dollar-disasters" | "household-debt-delinquency" | "personal-saving-rate" | "social-security-trust-fund" | "global-remittance-corridors" | "nato-defense-spending" | "manufacturing-robot-density" | "phosphate-rock-supply" | "nih-disease-funding" | "lng-export-capacity" | "credit-card-apr" | "immigration-court-backlog" | "us-lng-export-capacity" | "manufacturing-construction-chips" | "cre-bank-delinquency" | "us-goods-services-trade" | "nuclear-under-construction" | "tax-expenditures" | "copper-mine-refinery" | "oecd-rd-tax-support" | "china-robot-installations"   | "us-net-interest" | "global-shipbuilding" | "foreign-treasury-holders" | "sipri-military-expenditure" | "us-business-ai-adoption" | "commercial-aircraft-assembly" | "money-market-funds-deposits" | "oecd-dac-oda" | "irena-renewable-capacity" | "bank-loan-chargeoffs" | "natural-graphite-mine-concentration" | "jolts-openings-unemployed" | "rare-earth-mine-concentration" | "central-bank-gold-purchases" | "phosphate-fertilizer-export";
  /** Canvas-style posts: viz is the page body, minimal prose */
  layout?: "default" | "canvas" | "fullscreen";
}

export const CATEGORIES: Category[] = [
  "Economics",
  "Politics",
  "Finance",
  "Technology",
  "Global Systems",
  "Energy",
  "Industry",
  "Consumer Finance",
  "Capital Markets",
];

export function categorySlug(category: Category): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function slugToCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => categorySlug(c) === slug);
}
