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
    | "billion-dollar-disasters";
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
