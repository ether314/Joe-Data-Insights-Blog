import fs from "node:fs";

const files = {
  "ccp-nomenklatura": ["CcpNomenklaturaDashboard.tsx", "CcpNomenklaturaDashboard"],
  "china-fiscal-revenue": ["ChinaFiscalRevenueDashboard.tsx", "ChinaFiscalRevenueDashboard"],
  "gdp-analysis": ["GdpInteractiveDashboard.tsx", "GdpInteractiveDashboard"],
  "copper-mine-vs-refinery-geography-2026": ["CopperMineVsRefineryGeographyDashboard.tsx", "CopperMineVsRefineryGeographyDashboard"],
  "demographic-cash-flows-research-2026": ["DemographicCashFlowsResearchDashboard.tsx", "DemographicCashFlowsResearchDashboard"],
  "fiscal-industrial-policy-geography-2026": ["FiscalIndustrialPolicyGeography2026Dashboard.tsx", "FiscalIndustrialPolicyGeography2026Dashboard"],
  "fiscal-industrial-policy-geography-202608": ["FiscalIndustrialPolicyGeography202608Dashboard.tsx", "FiscalIndustrialPolicyGeography202608Dashboard"],
  "fiscal-industrial-policy-geography-2026q3": ["FiscalIndustrialPolicyGeography2026q3Dashboard.tsx", "FiscalIndustrialPolicyGeography2026q3Dashboard"],
  "ai-data-centers": ["AiDataCentersDashboard.tsx", "AiDataCentersDashboard"],
  "last-mile-delivery-robotics": ["LastMileDeliveryRoboticsDashboard.tsx", "LastMileDeliveryRoboticsDashboard"],
  "goldman-sachs-ai-capex": ["GoldmanSachsAiCapexDashboard.tsx", "GoldmanSachsAiCapexDashboard"],
  "macro-growth-trade-geography-2026q3": ["MacroGrowthTradeGeography2026q3Dashboard.tsx", "MacroGrowthTradeGeography2026q3Dashboard"],
  "brokerage-bonuses": ["BrokerageBonusesDashboard.tsx", "BrokerageBonusesDashboard"],
  "subsidies-tariffs": ["SubsidiesTariffsDashboard.tsx", "SubsidiesTariffsDashboard"],
};

for (const [id, [file, fn]] of Object.entries(files)) {
  const text = fs.readFileSync(`src/components/visualizations/${file}`, "utf8");
  const fi = text.indexOf(`export function ${fn}`);
  if (fi === -1) {
    console.log(`### ${id} (${file}): FN NOT FOUND`);
    continue;
  }
  const ri = text.indexOf("return (", fi);
  const snippet = text.slice(ri, ri + 400);
  console.log(`### ${id} (${file})`);
  console.log(snippet.split("\n").slice(0, 8).join("\n"));
  console.log("---");
}
