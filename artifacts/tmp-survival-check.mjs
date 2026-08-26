import fs from "node:fs";

// 1) markers on the 16 dashboards
const files = [
  ["CcpNomenklaturaDashboard.tsx", "ccp-nomenklatura"],
  ["ChinaFiscalRevenueDashboard.tsx", "china-fiscal-revenue"],
  ["GdpInteractiveDashboard.tsx", "gdp-analysis"],
  ["SubsidiesTariffsDashboard.tsx", "subsidies-tariffs"],
  ["DemographicCashFlowsResearchDashboard.tsx", "demographic-cash-flows-research-2026"],
  ["CopperMineVsRefineryGeographyDashboard.tsx", "copper-mine-vs-refinery-geography-2026"],
  ["ChokepointCommoditiesResearchDashboard.tsx", "chokepoint-commodities-research-2026"],
  ["EnergySystemsResearchDashboard.tsx", "energy-systems-research-2026"],
  ["FiscalIndustrialPolicyGeography2026Dashboard.tsx", "fiscal-industrial-policy-geography-2026"],
  ["FiscalIndustrialPolicyGeography202608Dashboard.tsx", "fiscal-industrial-policy-geography-202608"],
  ["FiscalIndustrialPolicyGeography2026q3Dashboard.tsx", "fiscal-industrial-policy-geography-2026q3"],
  ["AiDataCentersDashboard.tsx", "ai-data-centers"],
  ["LastMileDeliveryRoboticsDashboard.tsx", "last-mile-delivery-robotics"],
  ["GoldmanSachsAiCapexDashboard.tsx", "goldman-sachs-ai-capex"],
  ["MacroGrowthTradeGeography2026q3Dashboard.tsx", "macro-growth-trade-geography-2026q3"],
  ["BrokerageBonusesDashboard.tsx", "brokerage-bonuses"],
];
let ok = 0;
for (const [f, id] of files) {
  const t = fs.readFileSync(`src/components/visualizations/${f}`, "utf8");
  const c = (t.match(new RegExp(`data-viz="${id}"`, "g")) || []).length;
  if (c === 1) ok++;
  else console.log("MARKER PROBLEM:", f, "count=", c);
}
console.log(`markers: ${ok}/16`);

// 2) posts.ts: do the 3 ids still exist? any dead links again?
const posts = fs.readFileSync("src/data/posts.ts", "utf8").replace(/\r\n/g, "\n");
for (const id of ["industrial-robotics-research-2026", "ai-supply-chain-research-2026", "us-billion-dollar-weather-disasters-ms94skof"]) {
  console.log(`posts.ts declares ${id}:`, posts.includes(`"${id}"`));
}
const slugs = new Set([...posts.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));
const remaining = [];
let m;
const re = /\[[^\]]*\]\(\/blog\/([a-z0-9-]+)\)/g;
while ((m = re.exec(posts)) !== null) if (!slugs.has(m[1])) remaining.push(m[1]);
console.log("dead internal targets:", [...new Set(remaining)].length ? [...new Set(remaining)] : "NONE");

// 3) which new branches did the conveyor add? (compare against known 197)
const pv = fs.readFileSync("src/components/PostVisualization.tsx", "utf8");
const ids = [...pv.matchAll(/type === "([a-z0-9-]+)"/g)].map((x) => x[1]);
console.log("\ndispatch ids count:", ids.length);
