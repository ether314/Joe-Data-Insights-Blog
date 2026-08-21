/**
 * Theme registry + balance engine for autonomous blog production.
 * Agents may append new themes here when creation criteria are met.
 */

import type { Category } from "@/types/post";

export type ThemeLane =
  | "ai-infrastructure"
  | "global-systems"
  | "macro-economics"
  | "geopolitics-governance"
  | "markets-finance"
  | "industrial-adoption";

export type PipelineCandidate = {
  title: string;
  coreQuestion: string;
  primarySources: string[];
  headlineStatHint: string;
  overlapNotes: string;
  priority: "high" | "medium";
};

export type ThemeDefinition = {
  id: string;
  label: string;
  lane: ThemeLane;
  category: Category;
  metaQuestion: string;
  visualLane: string;
  /** Target % of rolling window (all active themes should sum ~100) */
  targetSharePct: number;
  /** Hard cap % in rolling window — block selection above this */
  maxSharePct: number;
  /** Max consecutive posts with this theme id */
  maxConsecutive: number;
  status: "active" | "proposed";
  candidates: PipelineCandidate[];
};

export const BALANCE_CONFIG = {
  /** Posts used for representation math */
  rollingWindow: 12,
  /** Max posts in a row from the same lane */
  maxConsecutivePerLane: 2,
  /** If a lane exceeds this % in rolling window, next post MUST be another lane */
  laneHardCapPct: 40,
  /** If a lane is below this % and has active themes, prefer it */
  laneStarvationPct: 8,
  /** Min rubric score to justify creating a new theme */
  newThemeMinRubric: 22,
} as const;

export const LANE_LABELS: Record<ThemeLane, string> = {
  "ai-infrastructure": "AI infrastructure",
  "global-systems": "Global Systems",
  "macro-economics": "Macro economics",
  "geopolitics-governance": "Geopolitics & governance",
  "markets-finance": "Markets & finance",
  "industrial-adoption": "Industrial adoption",
};

/** Default category per lane (override per theme if needed) */
export const LANE_DEFAULT_CATEGORY: Record<ThemeLane, Category> = {
  "ai-infrastructure": "Technology",
  "global-systems": "Global Systems",
  "macro-economics": "Economics",
  "geopolitics-governance": "Politics",
  "markets-finance": "Finance",
  "industrial-adoption": "Industry",
};

export const THEME_REGISTRY: ThemeDefinition[] = [
  {
    id: "ai-capex-spend",
    label: "AI capex & spend totals",
    lane: "ai-infrastructure",
    category: "Capital Markets",
    metaQuestion: "How large is AI infrastructure spending in dollars and scenarios?",
    visualLane: "Stacked bars, scenario layers",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 1,
    status: "active",
    candidates: [],
  },
  {
    id: "ai-capex-intensity",
    label: "Capex intensity & ratios",
    lane: "ai-infrastructure",
    category: "Capital Markets",
    metaQuestion: "What fraction of revenue is reinvested — and is it sustainable?",
    visualLane: "Ratio time series, benchmark bands",
    targetSharePct: 6,
    maxSharePct: 12,
    maxConsecutive: 1,
    status: "active",
    candidates: [],
  },
  {
    id: "ai-financing",
    label: "AI financing (bonds, credit, ETFs)",
    lane: "ai-infrastructure",
    category: "Capital Markets",
    metaQuestion: "How is the build-out funded in credit and public markets?",
    visualLane: "Issuance bars, flow comparisons",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 1,
    status: "active",
    candidates: [],
  },
  {
    id: "ai-supply-chain",
    label: "Semiconductor supply chain",
    lane: "ai-infrastructure",
    category: "Industry",
    metaQuestion: "Where are upstream/downstream bottlenecks in the chip stack?",
    visualLane: "Equipment cycles, packaging capacity",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 1,
    status: "active",
    candidates: [],
  },
  {
    id: "ai-power-grid",
    label: "AI power & grid",
    lane: "ai-infrastructure",
    category: "Energy",
    metaQuestion: "Can electricity and grid build-out keep pace with AI load?",
    visualLane: "TWh vs transmission, peak forecasts",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 1,
    status: "active",
    candidates: [],
  },
  {
    id: "ai-compute-demand",
    label: "Compute demand (tokens, DC sites)",
    lane: "ai-infrastructure",
    category: "Technology",
    metaQuestion: "Who processes how much compute and where is it located?",
    visualLane: "Provider leaderboards, site maps",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 1,
    status: "active",
    candidates: [],
  },
  {
    id: "chokepoint-commodities",
    label: "Chokepoint commodities",
    lane: "global-systems",
    category: "Global Systems",
    metaQuestion:
      "What physical inputs does the economy assume will always be available — and where is supply thin?",
    visualLane: "Trade maps, concentration bars",
    targetSharePct: 10,
    maxSharePct: 18,
    maxConsecutive: 2,
    status: "active",
    candidates: [
      {
        title: "Phosphate & fertilizer export dependence",
        coreQuestion: "Which food systems depend on few phosphate exporters?",
        primarySources: ["IFA", "FAO", "UN Comtrade"],
        headlineStatHint: "Top-3 exporter share",
        overlapNotes: "Shipped production/reserves post; export-dependence angle still open",
        priority: "medium",
      },
      {
        title: "Copper mine vs refinery geography",
        coreQuestion: "Who digs copper vs who refines it?",
        primarySources: ["USGS MCS"],
        headlineStatHint: "China refine share vs mine share",
        overlapNotes: "Shipped; phosphate/helium are different minerals",
        priority: "medium",
      },
    ],
  },
  {
    id: "fiscal-plumbing",
    label: "Fiscal plumbing",
    lane: "global-systems",
    category: "Global Systems",
    metaQuestion: "Which budget lines, trust funds, and off-balance vehicles move real levers?",
    visualLane: "Trust-fund crossovers, stacked areas",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 2,
    status: "active",
    candidates: [
      {
        title: "US Social Security trust fund depletion path",
        coreQuestion: "When does OASDI hit zero under SSA trustees scenarios?",
        primarySources: ["SSA Trustees Report"],
        headlineStatHint: "Depletion year",
        overlapNotes: "Not China fiscal post",
        priority: "high",
      },
      {
        title: "US tax expenditure catalog",
        coreQuestion: "How large is hidden spending via credits?",
        primarySources: ["JCT", "US Treasury"],
        headlineStatHint: "Tax expenditures % GDP",
        overlapNotes: "Not subsidies vs tariffs",
        priority: "high",
      },
    ],
  },
  {
    id: "adaptation-economics",
    label: "Adaptation economics",
    lane: "global-systems",
    category: "Energy",
    metaQuestion: "Who pays for climate damage and adaptation before policy catches up?",
    visualLane: "Indexed disaster costs, insurance maps",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 2,
    status: "active",
    candidates: [
      {
        title: "US billion-dollar weather disasters",
        coreQuestion: "Is normalized disaster cost accelerating?",
        primarySources: ["NOAA NCEI"],
        headlineStatHint: "Inflation-adjusted annual total",
        overlapNotes: "Not fuel mix snapshot",
        priority: "high",
      },
    ],
  },
  {
    id: "demographic-cash-flows",
    label: "Demographic cash flows",
    lane: "global-systems",
    category: "Global Systems",
    metaQuestion: "How do age and migration show up in money flows?",
    visualLane: "Remittance chords, cohort lines",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 2,
    status: "active",
    candidates: [
      {
        title: "Global remittance corridors",
        coreQuestion: "Which country pairs move the most remittance dollars?",
        primarySources: ["World Bank bilateral remittances"],
        headlineStatHint: "Top corridor $ flow",
        overlapNotes: "Not refugee hosting post",
        priority: "high",
      },
    ],
  },
  {
    id: "measurement-science",
    label: "Measurement & science",
    lane: "global-systems",
    category: "Global Systems",
    metaQuestion: "Where is progress funded and published — is it concentrating?",
    visualLane: "Streamgraphs, bump charts",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 2,
    status: "active",
    candidates: [],
  },
  {
    id: "macro-growth-trade",
    label: "Growth, trade & prices",
    lane: "macro-economics",
    category: "Economics",
    metaQuestion: "How are economies growing, trading, and experiencing price dynamics?",
    visualLane: "Multi-country trajectories, scatter plots",
    targetSharePct: 12,
    maxSharePct: 20,
    maxConsecutive: 2,
    status: "active",
    candidates: [],
  },
  {
    id: "geopolitics-institutions",
    label: "Institutions & governance",
    lane: "geopolitics-governance",
    category: "Politics",
    metaQuestion: "How do power structures and institutions allocate authority?",
    visualLane: "Org charts, hierarchy maps",
    targetSharePct: 12,
    maxSharePct: 20,
    maxConsecutive: 2,
    status: "active",
    candidates: [],
  },
  {
    id: "fiscal-industrial-policy",
    label: "Fiscal & industrial policy",
    lane: "geopolitics-governance",
    category: "Politics",
    metaQuestion: "How do subsidies, tariffs, and industrial policy reshape economies?",
    visualLane: "Long time series, policy overlays",
    targetSharePct: 10,
    maxSharePct: 18,
    maxConsecutive: 2,
    status: "active",
    candidates: [],
  },
  {
    id: "consumer-finance-markets",
    label: "Consumer finance & household balance sheets",
    lane: "markets-finance",
    category: "Consumer Finance",
    metaQuestion: "How are households saving, borrowing, and allocating retail money?",
    visualLane: "Tables, comparison matrices",
    targetSharePct: 10,
    maxSharePct: 18,
    maxConsecutive: 2,
    status: "active",
    candidates: [],
  },
  {
    id: "bank-commercial-credit",
    label: "Bank & commercial credit",
    lane: "markets-finance",
    category: "Finance",
    metaQuestion: "Where is stress showing up on bank loan books and CRE portfolios?",
    visualLane: "Delinquency curves, size-cohort splits",
    targetSharePct: 6,
    maxSharePct: 12,
    maxConsecutive: 1,
    status: "active",
    candidates: [],
  },
  {
    id: "industrial-robotics",
    label: "Industrial adoption & robotics",
    lane: "industrial-adoption",
    category: "Industry",
    metaQuestion: "Where are physical automation and industrial tech scaling?",
    visualLane: "Fleet counts, adoption curves",
    targetSharePct: 7,
    maxSharePct: 16,
    maxConsecutive: 2,
    status: "active",
    candidates: [],
  },
  {
    id: "heavy-industrial-capacity",
    label: "Heavy industrial capacity",
    lane: "industrial-adoption",
    category: "Industry",
    metaQuestion:
      "Who still has the yards, dry docks, and heavy fabrication base to build the physical capital stock?",
    visualLane: "Builder-share areas, own-vs-build scatters, segment slopes",
    targetSharePct: 7,
    maxSharePct: 14,
    maxConsecutive: 1,
    status: "active",
    candidates: [
      {
        title: "Global shipbuilding GT delivery concentration",
        coreQuestion:
          "Who delivers the world’s new merchant-ship capacity — and who owns vs builds?",
        primarySources: ["UNCTAD Review of Maritime Transport", "UNCTAD Handbook"],
        headlineStatHint: "China >50% of GT deliveries",
        overlapNotes: "Not robot installations; not LNG export capacity",
        priority: "high",
      },
      {
        title: "Commercial aircraft final-assembly geography",
        coreQuestion: "How concentrated is large-jet assembly outside Boeing/Airbus duopoly framing?",
        primarySources: ["OEM disclosures", "ASCEND/Cirium"],
        headlineStatHint: "Assembly-line share by site",
        overlapNotes: "Different from shipyards and chip fabs",
        priority: "medium",
      },
    ],
  },
  {
    id: "energy-systems",
    label: "Energy systems",
    lane: "macro-economics",
    category: "Energy",
    metaQuestion: "How do countries source, mix, and trade energy?",
    visualLane: "Generation mix maps",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 1,
    status: "active",
    candidates: [],
  },
  {
    id: "migration-humanitarian",
    label: "Migration & humanitarian burden",
    lane: "geopolitics-governance",
    category: "Politics",
    metaQuestion: "Who bears migration and humanitarian costs vs narratives?",
    visualLane: "Hosting burden maps",
    targetSharePct: 8,
    maxSharePct: 15,
    maxConsecutive: 1,
    status: "active",
    candidates: [],
  },
];

/** Map existing slugs → theme id (backfill before themeId on Post) */
export const SLUG_THEME_IDS: Record<string, string> = {
  "energy-systems-concentration-202608": "energy-systems",
  "ai-supply-chain-geography-2026": "ai-supply-chain",
  "ai-financing-geography-2026": "ai-financing",
  "ai-capex-intensity-concentration-202608": "ai-capex-intensity",
  "fiscal-industrial-policy-geography-202608": "fiscal-industrial-policy",
  "bank-commercial-credit-concentration-2026q3": "bank-commercial-credit",
  "macro-growth-trade-geography-2026": "macro-growth-trade",
  "geopolitics-institutions-geography-2026": "geopolitics-institutions",
  "adaptation-economics-concentration-202608": "adaptation-economics",
  "ai-compute-demand-geography-2026": "ai-compute-demand",
  "consumer-finance-markets-geography-2026": "consumer-finance-markets",
  "chokepoint-commodities-geography-2026": "chokepoint-commodities",
  "migration-humanitarian-concentration-2026": "migration-humanitarian",
  "ai-capex-spend-geography-2026": "ai-capex-spend",
  "measurement-science-concentration-202608": "measurement-science",
  "fiscal-plumbing-concentration-2026q3": "fiscal-plumbing",
  "demographic-cash-flows-geography-2026": "demographic-cash-flows",
  "ai-supply-chain-concentration-202608": "ai-supply-chain",
  "fiscal-industrial-policy-geography-2026q3": "fiscal-industrial-policy",
  "ai-power-grid-concentration-202608": "ai-power-grid",
  "energy-systems-concentration-2026q3": "energy-systems",
  "ai-capex-intensity-concentration-2026q3": "ai-capex-intensity",
  "ai-financing-concentration-202608": "ai-financing",
  "macro-growth-trade-concentration-202608": "macro-growth-trade",
  "geopolitics-institutions-concentration-202608": "geopolitics-institutions",
  "bank-commercial-credit-concentration-2026": "bank-commercial-credit",
  "industrial-robotics-concentration-202608": "industrial-robotics",
  "adaptation-economics-concentration-2026q3": "adaptation-economics",
  "ai-compute-demand-concentration-202608": "ai-compute-demand",
  "ai-capex-spend-concentration-202608": "ai-capex-spend",
  "migration-humanitarian-update-202608": "migration-humanitarian",
  "chokepoint-commodities-concentration-202608": "chokepoint-commodities",
  "consumer-finance-markets-concentration-202608": "consumer-finance-markets",
  "fiscal-plumbing-concentration-2026": "fiscal-plumbing",
  "measurement-science-concentration-2026q3": "measurement-science",
  "ai-supply-chain-concentration-2026q3": "ai-supply-chain",
  "ai-power-grid-concentration-2026q3": "ai-power-grid",
  "fiscal-industrial-policy-geography-2026": "fiscal-industrial-policy",
  "macro-growth-trade-concentration-2026q3": "macro-growth-trade",
  "demographic-cash-flows-concentration-202608": "demographic-cash-flows",
  "energy-systems-concentration-2026": "energy-systems",
  "bank-commercial-credit-update-202608": "bank-commercial-credit",
  "geopolitics-institutions-concentration-2026q3": "geopolitics-institutions",
  "industrial-robotics-concentration-2026q3": "industrial-robotics",
  "ai-financing-concentration-2026q3": "ai-financing",
  "adaptation-economics-concentration-2026": "adaptation-economics",
  "heavy-industrial-capacity-update-2026q3": "heavy-industrial-capacity",
  "chokepoint-commodities-concentration-2026q3": "chokepoint-commodities",
  "ai-compute-demand-concentration-2026q3": "ai-compute-demand",
  "consumer-finance-markets-concentration-2026q3": "consumer-finance-markets",
  "ai-power-grid-update-202608": "ai-power-grid",
  "ai-supply-chain-concentration-2026": "ai-supply-chain",
  "ai-capex-intensity-concentration-2026": "ai-capex-intensity",
  "fiscal-industrial-policy-concentration-202608": "fiscal-industrial-policy",
  "measurement-science-concentration-2026": "measurement-science",
  "fiscal-plumbing-update-202608": "fiscal-plumbing",
  "demographic-cash-flows-concentration-2026q3": "demographic-cash-flows",
  "ai-capex-spend-concentration-2026q3": "ai-capex-spend",
  "macro-growth-trade-concentration-2026": "macro-growth-trade",
  "fiscal-industrial-policy-concentration-2026q3": "fiscal-industrial-policy",
  "migration-humanitarian-update-2026q3": "migration-humanitarian",
  "demographic-cash-flows-concentration-2026": "demographic-cash-flows",
  "ai-compute-demand-concentration-2026": "ai-compute-demand",
  "bank-commercial-credit-update-2026q3": "bank-commercial-credit",
  "consumer-finance-markets-concentration-2026": "consumer-finance-markets",
  "ai-capex-intensity-update-202608": "ai-capex-intensity",
  "ai-supply-chain-update-202608": "ai-supply-chain",
  "macro-growth-trade-update-202608": "macro-growth-trade",
  "energy-systems-update-202608": "energy-systems",
  "ai-financing-concentration-2026": "ai-financing",
  "chokepoint-commodities-concentration-2026": "chokepoint-commodities",
  "fiscal-plumbing-update-2026q3": "fiscal-plumbing",
  "ai-capex-spend-concentration-2026": "ai-capex-spend",
  "measurement-science-update-202608": "measurement-science",
  "fiscal-industrial-policy-concentration-2026": "fiscal-industrial-policy",
  "migration-humanitarian-update-2026": "migration-humanitarian",
  "geopolitics-institutions-concentration-2026": "geopolitics-institutions",
  "heavy-industrial-capacity-update-2026": "heavy-industrial-capacity",
  "demographic-cash-flows-update-202608": "demographic-cash-flows",
  "industrial-robotics-concentration-2026": "industrial-robotics",
  "bank-commercial-credit-update-2026": "bank-commercial-credit",
  "fiscal-plumbing-update-2026": "fiscal-plumbing",
  "consumer-finance-markets-update-202608": "consumer-finance-markets",
  "ai-compute-demand-update-202608": "ai-compute-demand",
  "ai-capex-intensity-update-2026q3": "ai-capex-intensity",
  "macro-growth-trade-update-2026q3": "macro-growth-trade",
  "ai-supply-chain-update-2026q3": "ai-supply-chain",
  "ai-financing-update-202608": "ai-financing",
  "adaptation-economics-update-202608": "adaptation-economics",
  "ai-power-grid-update-2026q3": "ai-power-grid",
  "ai-capex-spend-update-202608": "ai-capex-spend",
  "chokepoint-commodities-update-202608": "chokepoint-commodities",
  "geopolitics-institutions-update-202608": "geopolitics-institutions",
  "fiscal-industrial-policy-update-202608": "fiscal-industrial-policy",
  "energy-systems-update-2026q3": "energy-systems",
  "industrial-robotics-update-202608": "industrial-robotics",
  "adaptation-economics-update-2026q3": "adaptation-economics",
  "measurement-science-update-2026q3": "measurement-science",
  "heavy-industrial-capacity-research-2026": "heavy-industrial-capacity",
  "demographic-cash-flows-update-2026q3": "demographic-cash-flows",
  "chokepoint-commodities-update-2026q3": "chokepoint-commodities",
  "consumer-finance-markets-update-2026q3": "consumer-finance-markets",
  "industrial-robotics-update-2026q3": "industrial-robotics",
  "ai-financing-update-2026q3": "ai-financing",
  "ai-power-grid-update-2026": "ai-power-grid",
  "ai-capex-spend-update-2026q3": "ai-capex-spend",
  "fiscal-industrial-policy-update-2026q3": "fiscal-industrial-policy",
  "ai-compute-demand-update-2026q3": "ai-compute-demand",
  "geopolitics-institutions-update-2026q3": "geopolitics-institutions",
  "consumer-finance-markets-update-2026": "consumer-finance-markets",
  "chokepoint-commodities-update-2026": "chokepoint-commodities",
  "energy-systems-update-2026": "energy-systems",
  "industrial-robotics-update-2026": "industrial-robotics",
  "adaptation-economics-update-2026": "adaptation-economics",
  "demographic-cash-flows-update-2026": "demographic-cash-flows",
  "measurement-science-update-2026": "measurement-science",
  "geopolitics-institutions-update-2026": "geopolitics-institutions",
  "fiscal-plumbing-research-2026": "fiscal-plumbing",
  "commercial-aircraft-final-assembly-geography-2026": "heavy-industrial-capacity",
  "fiscal-industrial-policy-update-2026": "fiscal-industrial-policy",
  "ai-financing-update-2026": "ai-financing",
  "ai-capex-spend-update-2026": "ai-capex-spend",
  "ai-compute-demand-update-2026": "ai-compute-demand",
  "macro-growth-trade-update-2026": "macro-growth-trade",
  "bank-commercial-credit-research-2026": "bank-commercial-credit",
  "ai-power-grid-concentration-2026": "ai-power-grid",
  "ai-supply-chain-update-2026": "ai-supply-chain",
  "ai-capex-intensity-update-2026": "ai-capex-intensity",
  "consumer-finance-markets-research-2026": "consumer-finance-markets",
  "energy-systems-research-2026": "energy-systems",
  "adaptation-economics-research-2026": "adaptation-economics",
  "chokepoint-commodities-research-2026": "chokepoint-commodities",
  "geopolitics-institutions-research-2026": "geopolitics-institutions",
  "copper-mine-vs-refinery-geography-2026": "chokepoint-commodities",
  "demographic-cash-flows-research-2026": "demographic-cash-flows",
  "measurement-science-research-2026": "measurement-science",
  "us-tax-expenditure-catalog-2026": "fiscal-plumbing",
  "migration-humanitarian-research-2026": "migration-humanitarian",
  "fiscal-industrial-policy-research-2026": "fiscal-industrial-policy",
  "ai-power-grid-research-2026": "ai-power-grid",
  "ai-financing-research-2026": "ai-financing",
  "us-billion-dollar-weather-disasters-2026": "adaptation-economics",
  "phosphate-fertilizer-export-dependence-2026": "chokepoint-commodities",
  "global-remittance-corridors-2026": "demographic-cash-flows",
  "ai-capex-spend-research-2026": "ai-capex-spend",
  "ai-capex-intensity-research-2026": "ai-capex-intensity",
  "central-bank-gold-purchases-2025": "geopolitics-institutions",
  "rare-earth-mine-concentration-2024": "chokepoint-commodities",
  "jolts-openings-unemployed-ratio-2026": "macro-growth-trade",
  "natural-graphite-mine-concentration-2024": "chokepoint-commodities",
  "bank-loan-chargeoffs-2026": "bank-commercial-credit",
  "nato-defense-spending-gdp-2-percent-2024": "geopolitics-institutions",
  "sipri-world-military-expenditure-2024": "geopolitics-institutions",
  "manufacturing-robot-density-ifr-2024": "industrial-robotics",
  "phosphate-rock-supply-concentration-2024": "chokepoint-commodities",
  "copper-mine-vs-refinery-concentration-2024": "chokepoint-commodities",
  "nih-disease-funding-alzheimers-vs-heart-2016-2024": "measurement-science",
  "lng-export-capacity-us-australia-qatar-2024": "energy-systems",
  "global-remittance-corridors-2024": "demographic-cash-flows",
  "us-social-security-trust-fund-depletion-2034": "fiscal-plumbing",
  "us-social-security-trust-fund-depletion-path-2026": "fiscal-plumbing",
  "us-net-interest-vs-defense-2025": "fiscal-plumbing",
  "us-personal-saving-rate-post-excess-2026": "consumer-finance-markets",
  "us-household-debt-delinquency-split-2026": "consumer-finance-markets",
  "global-helium-supply-concentration-2024": "chokepoint-commodities",
  "us-billion-dollar-weather-disasters-1980-2024": "adaptation-economics",
  "goldman-sachs-ai-capex-chips-data-centers-2027-2028": "ai-capex-spend",
  "hyperscaler-capex-intensity-vs-dotcom-telecom-2025": "ai-capex-intensity",
  "hyperscaler-ai-corporate-bond-issuance-2025": "ai-financing",
  "ai-etf-flows-qqq-vs-thematic-2025": "ai-financing",
  "semiconductor-equipment-spending-cycle-2025": "ai-supply-chain",
  "ai-gpu-packaging-memory-bottleneck-2025": "ai-supply-chain",
  "us-data-center-power-vs-grid-capacity-2025": "ai-power-grid",
  "global-ai-data-center-build-tracker": "ai-compute-demand",
  "major-ai-brands-token-consumption-2022-2026": "ai-compute-demand",
  "ai-compute-demand-research-2026": "ai-compute-demand",
  "global-last-mile-delivery-robotics-2026": "industrial-robotics",
  "china-industrial-robot-installations-share-2023": "industrial-robotics",
  "global-shipbuilding-concentration-2023": "heavy-industrial-capacity",
  "global-shipbuilding-gt-delivery-concentration-2026": "heavy-industrial-capacity",
  "china-us-india-gdp-30-years": "macro-growth-trade",
  "deflationary-growth-economies-2025": "macro-growth-trade",
  "macro-growth-trade-research-2026": "macro-growth-trade",
  "global-electricity-generation-mix-2024": "energy-systems",
  "china-fiscal-revenue-all-budgets-2024": "geopolitics-institutions",
  "ccp-nomenklatura-hierarchy-2026": "geopolitics-institutions",
  "us-industrial-subsidies-vs-tariffs-30-years": "fiscal-industrial-policy",
  "oecd-rd-tax-vs-direct-support-2023": "fiscal-industrial-policy",
  "global-refugee-hosting-burden-2024": "migration-humanitarian",
  "us-brokerage-fintech-investing-bonuses": "consumer-finance-markets",
  "us-immigration-court-backlog-2025": "migration-humanitarian",
  "manufacturing-construction-chips-boom-2026": "ai-supply-chain",
  "cre-bank-delinquency-size-split-2026": "bank-commercial-credit",
  "us-goods-services-trade-gap-2025": "macro-growth-trade",
  "foreign-treasury-holders-tic-2026": "macro-growth-trade",
  "nuclear-under-construction-china-share-2026": "energy-systems",
  "us-credit-card-apr-vs-fed-funds-2026": "consumer-finance-markets",
  "us-tax-expenditures-catalog-2024": "fiscal-plumbing",
  "us-business-ai-adoption-btos-2026": "ai-compute-demand",
  "commercial-aircraft-final-assembly-2025": "heavy-industrial-capacity",
  "money-market-funds-vs-deposits-2026": "consumer-finance-markets",
  "oecd-dac-oda-first-drop-2024": "geopolitics-institutions",
  "irena-renewable-capacity-record-2024": "energy-systems",
};

export type ThemeBalanceRow = {
  themeId: string;
  label: string;
  lane: ThemeLane;
  count: number;
  sharePct: number;
  consecutive: number;
  overCap: boolean;
  underTarget: boolean;
};

export function getThemeById(id: string): ThemeDefinition | undefined {
  return THEME_REGISTRY.find((t) => t.id === id && t.status === "active");
}

export function resolveThemeId(slug: string, themeId?: string): string | undefined {
  if (themeId) return themeId;
  return SLUG_THEME_IDS[slug];
}

export function computeThemeBalance(
  slugThemePairs: Array<{ slug: string; themeId?: string }>,
  window = BALANCE_CONFIG.rollingWindow,
): ThemeBalanceRow[] {
  const recent = slugThemePairs.slice(0, window);
  const total = recent.length || 1;
  const counts = new Map<string, number>();

  for (const post of recent) {
    const tid = resolveThemeId(post.slug, post.themeId);
    if (!tid) continue;
    counts.set(tid, (counts.get(tid) ?? 0) + 1);
  }

  const consecutiveByTheme = new Map<string, number>();
  let lastTheme: string | undefined;
  let streak = 0;
  for (const post of recent) {
    const tid = resolveThemeId(post.slug, post.themeId);
    if (!tid) break;
    if (tid === lastTheme) streak++;
    else {
      lastTheme = tid;
      streak = 1;
    }
    consecutiveByTheme.set(tid, streak);
  }

  return THEME_REGISTRY.filter((t) => t.status === "active").map((theme) => {
    const count = counts.get(theme.id) ?? 0;
    const sharePct = (count / total) * 100;
    return {
      themeId: theme.id,
      label: theme.label,
      lane: theme.lane,
      count,
      sharePct,
      consecutive: consecutiveByTheme.get(theme.id) ?? 0,
      overCap: sharePct > theme.maxSharePct,
      underTarget: sharePct < theme.targetSharePct * 0.5 && count === 0,
    };
  });
}

export function computeLaneBalance(
  slugThemePairs: Array<{ slug: string; themeId?: string }>,
  window = BALANCE_CONFIG.rollingWindow,
): Record<ThemeLane, { count: number; sharePct: number }> {
  const recent = slugThemePairs.slice(0, window);
  const total = recent.length || 1;
  const lanes = Object.keys(LANE_LABELS) as ThemeLane[];
  const out = {} as Record<ThemeLane, { count: number; sharePct: number }>;

  for (const lane of lanes) {
    out[lane] = { count: 0, sharePct: 0 };
  }

  for (const post of recent) {
    const tid = resolveThemeId(post.slug, post.themeId);
    if (!tid) continue;
    const theme = getThemeById(tid);
    if (!theme) continue;
    out[theme.lane].count++;
  }

  for (const lane of lanes) {
    out[lane].sharePct = (out[lane].count / total) * 100;
  }

  return out;
}

/** Pick themes eligible for next post (not over cap, not over consecutive) */
export function getEligibleThemes(
  slugThemePairs: Array<{ slug: string; themeId?: string }>,
): ThemeDefinition[] {
  const balance = computeThemeBalance(slugThemePairs);
  const laneBalance = computeLaneBalance(slugThemePairs);

  const recentLane =
    slugThemePairs.length > 0
      ? getThemeById(resolveThemeId(slugThemePairs[0].slug, slugThemePairs[0].themeId) ?? "")?.lane
      : undefined;

  let consecutiveLane = 0;
  if (recentLane) {
    for (const post of slugThemePairs) {
      const lane = getThemeById(resolveThemeId(post.slug, post.themeId) ?? "")?.lane;
      if (lane === recentLane) consecutiveLane++;
      else break;
    }
  }

  const overCapLanes = (Object.entries(laneBalance) as [ThemeLane, { sharePct: number }][])
    .filter(([, v]) => v.sharePct > BALANCE_CONFIG.laneHardCapPct)
    .map(([k]) => k);

  const starvedLanes = (Object.entries(laneBalance) as [ThemeLane, { sharePct: number }][])
    .filter(([, v]) => v.sharePct < BALANCE_CONFIG.laneStarvationPct)
    .map(([k]) => k);

  return THEME_REGISTRY.filter((theme) => {
    if (theme.status !== "active") return false;
    const row = balance.find((b) => b.themeId === theme.id);
    if (row?.overCap) return false;
    if ((row?.consecutive ?? 0) >= theme.maxConsecutive) return false;
    if (overCapLanes.includes(theme.lane)) return false;
    if (consecutiveLane >= BALANCE_CONFIG.maxConsecutivePerLane && theme.lane === recentLane) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    const aStarved = starvedLanes.includes(a.lane) ? 1 : 0;
    const bStarved = starvedLanes.includes(b.lane) ? 1 : 0;
    if (aStarved !== bStarved) return bStarved - aStarved;
    const aCount = balance.find((r) => r.themeId === a.id)?.count ?? 0;
    const bCount = balance.find((r) => r.themeId === b.id)?.count ?? 0;
    return aCount - bCount;
  });
}

export function getBacklogFromEligibleThemes(
  slugThemePairs: Array<{ slug: string; themeId?: string }>,
): Array<PipelineCandidate & { themeId: string; themeLabel: string }> {
  const eligible = getEligibleThemes(slugThemePairs);
  return eligible.flatMap((theme) =>
    theme.candidates.map((c) => ({
      ...c,
      themeId: theme.id,
      themeLabel: theme.label,
      title: `[${theme.label}] ${c.title}`,
    })),
  );
}

/** Criteria for agent-proposed new themes — append to THEME_REGISTRY when all pass */
export type NewThemeProposal = {
  id: string;
  label: string;
  lane: ThemeLane;
  category: Category;
  metaQuestion: string;
  visualLane: string;
  targetSharePct: number;
  maxSharePct: number;
  maxConsecutive: number;
  candidates: PipelineCandidate[];
  justification: string;
};

export function validateNewThemeProposal(proposal: NewThemeProposal): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9-]+$/.test(proposal.id)) errors.push("id must be kebab-case");
  if (THEME_REGISTRY.some((t) => t.id === proposal.id)) errors.push("id already exists");
  if (proposal.candidates.length < 2) errors.push("need ≥2 seed candidates");
  if (proposal.targetSharePct < 4 || proposal.targetSharePct > 15) {
    errors.push("targetSharePct should be 4–15");
  }
  if (!proposal.justification || proposal.justification.length < 40) {
    errors.push("justification too short");
  }
  return errors;
}
