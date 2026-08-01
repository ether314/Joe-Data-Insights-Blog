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
  visualization?:
    | "gdp-analysis"
    | "subsidies-tariffs"
    | "brokerage-bonuses"
    | "ai-data-centers"
    | "ccp-nomenklatura"
    | "china-fiscal-revenue"
    | "electricity-generation-mix"
    | "refugee-hosting-burden"
    | "ai-packaging-bottleneck"
    | "ai-token-consumption"
    | "deflationary-growth-2025"
    | "last-mile-delivery-robotics"
    | "goldman-sachs-ai-capex"
    | "social-security-trust-fund"
    | "ai-capex-intensity-research-2026"
    | "ai-capex-spend-research-2026"
    | "global-remittance-corridors"
    | "phosphate-fertilizer-export"
    | "billion-dollar-disasters"
    | "commercial-aircraft-assembly"
    | "money-market-funds-deposits"
    | "oecd-dac-oda"
    | "irena-renewable-capacity"
    | "bank-loan-chargeoffs"
    | "natural-graphite-mine-concentration"
    | "macro-growth-trade-research-2026"
    | "ai-compute-demand-research-2026"
    | "ai-financing-research-2026";
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
