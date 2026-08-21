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
    | "ai-financing-research-2026"
    | "ai-power-grid-research-2026"
    | "fiscal-industrial-policy-research-2026"
    | "migration-humanitarian-research-2026"
    | "us-tax-expenditure-catalog-2026"
    | "measurement-science-research-2026"
    | "demographic-cash-flows-research-2026"
    | "copper-mine-vs-refinery-geography-2026"
    | "global-shipbuilding-gt-delivery-concentration-2026"
    | "industrial-robotics-research-2026"
    | "ai-supply-chain-research-2026"
    | "us-billion-dollar-weather-disasters-ms94skof"
    | "geopolitics-institutions-research-2026"
    | "chokepoint-commodities-research-2026"
    | "adaptation-economics-research-2026"
    | "energy-systems-research-2026"
    | "consumer-finance-markets-research-2026"
    | "ai-capex-intensity-update-2026"
    | "ai-supply-chain-update-2026"
    | "ai-power-grid-concentration-2026"
    | "bank-commercial-credit-research-2026"
    | "macro-growth-trade-update-2026"
    | "ai-compute-demand-update-2026"
    | "ai-capex-spend-update-2026"
    | "ai-financing-update-2026"
    | "fiscal-industrial-policy-update-2026"
    | "commercial-aircraft-final-assembly-geography-2026"
    | "fiscal-plumbing-research-2026"
    | "geopolitics-institutions-update-2026"
    | "measurement-science-update-2026"
    | "demographic-cash-flows-update-2026"
    | "adaptation-economics-update-2026"
    | "industrial-robotics-update-2026"
    | "energy-systems-update-2026"
    | "chokepoint-commodities-update-2026"
    | "consumer-finance-markets-update-2026"
    | "geopolitics-institutions-update-2026q3"
    | "ai-compute-demand-update-2026q3"
    | "fiscal-industrial-policy-update-2026q3"
    | "ai-capex-spend-update-2026q3"
    | "ai-power-grid-update-2026"
    | "ai-financing-update-2026q3"
    | "industrial-robotics-update-2026q3"
    | "consumer-finance-markets-update-2026q3"
    | "chokepoint-commodities-update-2026q3"
    | "demographic-cash-flows-update-2026q3"
    | "heavy-industrial-capacity-research-2026"
    | "measurement-science-update-2026q3"
    | "adaptation-economics-update-2026q3"
    | "industrial-robotics-update-202608"
    | "energy-systems-update-2026q3"
    | "fiscal-industrial-policy-update-202608"
    | "geopolitics-institutions-update-202608"
    | "chokepoint-commodities-update-202608"
    | "ai-capex-spend-update-202608"
    | "ai-power-grid-update-2026q3"
    | "adaptation-economics-update-202608"
    | "ai-financing-update-202608"
    | "ai-supply-chain-update-2026q3"
    | "macro-growth-trade-update-2026q3"
    | "ai-capex-intensity-update-2026q3"
    | "ai-compute-demand-update-202608"
    | "consumer-finance-markets-update-202608"
    | "fiscal-plumbing-update-2026"
    | "bank-commercial-credit-update-2026"
    | "industrial-robotics-concentration-2026"
    | "demographic-cash-flows-update-202608"
    | "heavy-industrial-capacity-update-2026"
    | "geopolitics-institutions-concentration-2026"
    | "migration-humanitarian-update-2026"
    | "fiscal-industrial-policy-concentration-2026"
    | "measurement-science-update-202608"
    | "ai-capex-spend-concentration-2026"
    | "fiscal-plumbing-update-2026q3"
    | "chokepoint-commodities-concentration-2026"
    | "ai-financing-concentration-2026"
    | "energy-systems-update-202608"
    | "macro-growth-trade-update-202608"
    | "ai-supply-chain-update-202608"
    | "ai-capex-intensity-update-202608"
    | "consumer-finance-markets-concentration-2026"
    | "bank-commercial-credit-update-2026q3"
    | "ai-compute-demand-concentration-2026"
    | "demographic-cash-flows-concentration-2026"
    | "migration-humanitarian-update-2026q3"
    | "fiscal-industrial-policy-concentration-2026q3"
    | "macro-growth-trade-concentration-2026"
    | "ai-capex-spend-concentration-2026q3"
    | "demographic-cash-flows-concentration-2026q3"
    | "fiscal-plumbing-update-202608"
    | "measurement-science-concentration-2026"
    | "fiscal-industrial-policy-concentration-202608"
    | "ai-capex-intensity-concentration-2026"
    | "ai-supply-chain-concentration-2026"
    | "ai-power-grid-update-202608"
    | "consumer-finance-markets-concentration-2026q3"
    | "ai-compute-demand-concentration-2026q3"
    | "chokepoint-commodities-concentration-2026q3"
    | "heavy-industrial-capacity-update-2026q3"
    | "adaptation-economics-concentration-2026"
    | "ai-financing-concentration-2026q3"
    | "industrial-robotics-concentration-2026q3"
    | "geopolitics-institutions-concentration-2026q3"
    | "bank-commercial-credit-update-202608"
    | "energy-systems-concentration-2026"
    | "demographic-cash-flows-concentration-202608"
    | "macro-growth-trade-concentration-2026q3"
    | "fiscal-industrial-policy-geography-2026"
    | "ai-power-grid-concentration-2026q3"
    | "ai-supply-chain-concentration-2026q3"
    | "measurement-science-concentration-2026q3"
    | "fiscal-plumbing-concentration-2026"
    | "consumer-finance-markets-concentration-202608"
    | "chokepoint-commodities-concentration-202608"
    | "migration-humanitarian-update-202608"
    | "ai-capex-spend-concentration-202608"
    | "ai-compute-demand-concentration-202608"
    | "adaptation-economics-concentration-2026q3"
    | "industrial-robotics-concentration-202608"
    | "bank-commercial-credit-concentration-2026"
    | "geopolitics-institutions-concentration-202608"
    | "macro-growth-trade-concentration-202608"
    | "ai-financing-concentration-202608"
    | "ai-capex-intensity-concentration-2026q3"
    | "energy-systems-concentration-2026q3"
    | "ai-power-grid-concentration-202608"
    | "fiscal-industrial-policy-geography-2026q3"
    | "ai-supply-chain-concentration-202608"
    | "demographic-cash-flows-geography-2026"
    | "fiscal-plumbing-concentration-2026q3"
    | "measurement-science-concentration-202608"
    | "ai-capex-spend-geography-2026"
    | "migration-humanitarian-concentration-2026"
    | "chokepoint-commodities-geography-2026"
    | "consumer-finance-markets-geography-2026"
    | "ai-compute-demand-geography-2026"
    | "adaptation-economics-concentration-202608";
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
