import fs from "node:fs";

const pv = fs.readFileSync("src/components/PostVisualization.tsx", "utf8");
const supported = new Set(
  [...pv.matchAll(/if \(type === "([a-z0-9-]+)"\)/g)].map((m) => m[1]),
);

const posts = fs.readFileSync("src/data/posts.ts", "utf8");
const entries = [...posts.matchAll(/slug:\s*"([^"]+)"[\s\S]{0,2000}?visualization:\s*\n?\s*"([\s\S]*?)",\n/g)];

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

console.log("supported types:", supported.size);
for (const slug of noViz) {
  const e = entries.find((x) => x[1] === slug);
  const viz = e ? e[2] : "(entry not found)";
  const ok = supported.has(viz.replace(/\s+/g, ""));
  console.log(`${ok ? "SUPPORTED" : "MISSING  "} | ${slug} | visualization="${viz}"`);
}

// also list all declared viz values that are NOT in the dispatch table
const allViz = [...posts.matchAll(/visualization:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]);
const unknown = [...new Set(allViz.filter((v) => !supported.has(v)))];
console.log("\nDeclared-but-unsupported visualization ids across ALL posts:");
for (const u of unknown) console.log(" -", u);
