import fs from "node:fs";

// Confirm all 19 previously-flagged viz ids now have dispatch branches + data-viz markers.
const t = fs.readFileSync("src/components/PostVisualization.tsx", "utf8");

const ids = [
  "industrial-robotics-research-2026",
  "ai-supply-chain-research-2026",
  "us-billion-dollar-weather-disasters-ms94skof",
  "ccp-nomenklatura-hierarchy-2026",
  "china-fiscal-revenue-all-budgets-2024",
  "china-us-india-gdp-30-years",
  "us-industrial-subsidies-vs-tariffs-30-years",
  "demographic-cash-flows-research-2026",
  "copper-mine-vs-refinery-geography-2026",
  "chokepoint-commodities-research-2026",
  "energy-systems-research-2026",
  "fiscal-industrial-policy-geography-2026",
  "fiscal-industrial-policy-geography-202608",
  "fiscal-industrial-policy-geography-2026q3",
  "global-ai-data-center-build-tracker",
  "global-last-mile-delivery-robotics-2026",
  "goldman-sachs-ai-capex-chips-data-centers-2027-2028",
  "macro-growth-trade-research-2026",
  "us-brokerage-fintech-investing-bonuses",
];

let bad = 0;
for (const id of ids) {
  const hasBranch = t.includes(`"${id}"`);
  const hasMarker = t.includes(`data-viz="${id}"`) || new RegExp(`data-viz=\\{?"?${id}`).test(t);
  if (!hasBranch || !hasMarker) {
    console.log(`MISSING: ${id} branch=${hasBranch} marker=${hasMarker}`);
    bad++;
  }
}
console.log(bad === 0 ? `ALL ${ids.length} flagged viz ids wired (branch + data-viz marker)` : `${bad} still broken`);
