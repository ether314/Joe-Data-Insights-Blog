export type Category = "Economics" | "Politics" | "Finance" | "Technology";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
  featured?: boolean;
  /** Renders an interactive visualization instead of static images */
  visualization?: "gdp-analysis" | "subsidies-tariffs" | "brokerage-bonuses" | "ai-data-centers" | "ccp-nomenklatura" | "china-fiscal-revenue" | "electricity-generation-mix" | "refugee-hosting-burden";
  /** Canvas-style posts: viz is the page body, minimal prose */
  layout?: "default" | "canvas" | "fullscreen";
}

export const CATEGORIES: Category[] = ["Economics", "Politics", "Finance", "Technology"];

export function categorySlug(category: Category): string {
  return category.toLowerCase();
}

export function slugToCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => categorySlug(c) === slug);
}
