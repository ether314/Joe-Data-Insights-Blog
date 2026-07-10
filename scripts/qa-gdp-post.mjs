import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlPath = path.join(root, "out", "blog", "china-us-india-gdp-30-years.html");
const commentaryPath = path.join(root, "src", "data", "gdp-commentary.ts");
const gapChartPath = path.join(root, "src", "components", "visualizations", "GrowthGapLineChart.tsx");
const dashboardPath = path.join(root, "src", "components", "visualizations", "GdpInteractiveDashboard.tsx");

const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, "utf8") : "";
const commentary = fs.readFileSync(commentaryPath, "utf8");
const gapChartSrc = fs.readFileSync(gapChartPath, "utf8");
const dashboardSrc = fs.readFileSync(dashboardPath, "utf8");

function findInChunks(needle) {
  const chunksDir = path.join(root, "out", "_next", "static", "chunks");
  if (!fs.existsSync(chunksDir)) return false;
  for (const file of fs.readdirSync(chunksDir)) {
    if (!file.endsWith(".js")) continue;
    const content = fs.readFileSync(path.join(chunksDir, file), "utf8");
    if (content.includes(needle)) return true;
  }
  return false;
}

const years = [];
for (let y = 1995; y <= 2026; y++) {
  if (!commentary.includes(`${y}:`)) years.push(y);
}

const checks = [
  ["GDP post HTML exists", fs.existsSync(htmlPath)],
  ["No static SVG hero", !html.includes("china-us-india-gdp-hero.svg")],
  ["Has loading fallback", html.includes("Loading interactive charts")],
  ["Gap chart component exists", fs.existsSync(gapChartPath)],
  ["Gap tooltip includes commentary", gapChartSrc.includes("gapChartNote")],
  ["Commentary covers 1995–2026", years.length === 0],
  ["2008 Lehman commentary present", commentary.includes("Lehman collapse")],
  ["US-China gap chart bundled", findInChunks("US − China growth gap") || findInChunks("US \\u2212 China growth gap")],
  ["India-China gap chart bundled", findInChunks("India − China growth gap") || findInChunks("India \\u2212 China growth gap")],
  ["Explore a Year uses year commentary", dashboardSrc.includes("COUNTRY_COMMENTARY") && dashboardSrc.includes("fmtPop")],
  ["Explore a Year shows GDP per capita row", dashboardSrc.includes("GDP per capita")],
  ["No old combined face-off chart", !dashboardSrc.includes('title="Growth Rate Face-Off"')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(ok ? "✓" : "✗", name);
  if (!ok) failed++;
}

if (failed > 0) {
  if (years.length) console.error("Missing commentary years:", years);
  process.exit(1);
}
console.log("\nAll QA checks passed.");
