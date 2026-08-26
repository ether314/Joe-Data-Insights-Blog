import fs from "node:fs";

const posts = fs.readFileSync("src/data/posts.ts", "utf8");
const noViz = [
  "chokepoint-commodities-research-2026",
  "energy-systems-research-2026",
  "ai-supply-chain-research-2026",
  "ccp-nomenklatura-hierarchy-2026",
  "china-fiscal-revenue-all-budgets-2024",
  "china-us-india-gdp-30-years",
  "copper-mine-vs-refinery-geography-2026",
  "demographic-cash-flows-research-2026",
  "fiscal-industrial-policy-geography-2026",
  "fiscal-industrial-policy-geography-202608",
  "fiscal-industrial-policy-geography-2026q3",
  "global-ai-data-center-build-tracker",
  "global-last-mile-delivery-robotics-2026",
  "goldman-sachs-ai-capex-chips-data-centers-2027-2028",
  "industrial-robotics-research-2026",
  "macro-growth-trade-geography-2026q3",
  "us-billion-dollar-weather-disasters-ms94skof",
  "us-brokerage-fintech-investing-bonuses",
  "us-industrial-subsidies-vs-tariffs-30-years",
];

// Split into entry blocks at top-level "  {" boundaries following slug lines
const starts = [...posts.matchAll(/^    slug: "([a-z0-9-]+)",$/gm)].map((m) => ({
  slug: m[1],
  idx: m.index,
}));
starts.push({ slug: "__END__", idx: posts.length });

for (const slug of noViz) {
  const si = starts.findIndex((s) => s.slug === slug);
  if (si === -1) {
    console.log(`${slug} => ENTRY NOT FOUND`);
    continue;
  }
  const block = posts.slice(starts[si].idx, starts[si + 1].idx);
  const vm = block.match(/visualization:\s*\n?\s*"([^"]+)"/);
  console.log(`${slug} => ${vm ? vm[1] : "NO visualization FIELD"}`);
}
