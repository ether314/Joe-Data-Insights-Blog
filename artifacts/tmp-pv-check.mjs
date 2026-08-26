import fs from "node:fs";
const t = fs.readFileSync("src/components/PostVisualization.tsx", "utf8");
console.log("lines:", t.split(/\r?\n/).length);
console.log("dispatch ai-supply-chain-research-2026:", /type === "ai-supply-chain-research-2026"/.test(t));
console.log("dispatch industrial-robotics-research-2026:", /type === "industrial-robotics-research-2026"/.test(t));
console.log("dispatch us-billion-dollar:", /type === "us-billion-dollar-weather-disasters-ms94skof"/.test(t));
console.log("dynamic AiSupplyChainResearch:", /AiSupplyChainResearchDashboard = dynamic/.test(t));
console.log("dynamic IndustrialRoboticsResearch:", /IndustrialRoboticsResearchDashboard = dynamic/.test(t));
console.log("dynamic UsBillionDollar:", /UsBillionDollarWeatherDisastersMs94skofDashboard = dynamic/.test(t));
const dupes = [...t.matchAll(/type === "([a-z0-9-]+)"/g)].map((m) => m[1]);
const seen = new Set();
for (const d of dupes) {
  if (seen.has(d)) console.log("DUPLICATE DISPATCH:", d);
  seen.add(d);
}
console.log("total dispatch branches:", dupes.length, "| unique:", seen.size);
