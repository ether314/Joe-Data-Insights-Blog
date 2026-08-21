/**
 * QA: Fiscal & industrial policy update 202608 post.
 * // viz-types: diverging-delta-bar, annual-flow-line, toolkit-pie, monthly-area, june-bloc-bar, steel-dumbbell, ownership-hbar, mix-scatter | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "fiscal-industrial-policy-update-202608";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(
  root,
  "src",
  "data",
  "fiscal-industrial-policy-update-202608-data.ts"
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "FiscalIndustrialPolicyUpdate202608Dashboard.tsx"
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "politics-fiscal-industrial-policy-update-202608-hero.png"
);

const markers = [
  "Vintage delta — Q3 chokepoint print → 2025 toolkit mix + mid-2026 monthly flow",
  "Vintage change (counts / percentage points)",
  "Annual distortive IP: 2009 → 2025",
  "2025 distortive toolkit mix",
  "Mid-2026 monthly flow (GTA Roundups)",
  "June 2026 geography split",
];

function findInChunks(needle) {
  const chunksDir = path.join(root, "out", "_next", "static", "chunks");
  if (!fs.existsSync(chunksDir)) return false;
  for (const file of fs.readdirSync(chunksDir)) {
    if (!file.endsWith(".js")) continue;
    if (fs.readFileSync(path.join(chunksDir, file), "utf8").includes(needle))
      return true;
  }
  return false;
}

const dataSrc = fs.existsSync(dataPath) ? fs.readFileSync(dataPath, "utf8") : "";
const dashboardSrc = fs.existsSync(dashboardPath)
  ? fs.readFileSync(dashboardPath, "utf8")
  : "";

const staticChecks = [
  ["Post HTML exists", fs.existsSync(htmlPath)],
  [
    "Has loading fallback",
    fs.existsSync(htmlPath) &&
      fs.readFileSync(htmlPath, "utf8").includes("Loading interactive charts"),
  ],
  ["Data module exists", fs.existsSync(dataPath)],
  ["HEADLINE exported", dataSrc.includes("export const HEADLINE")],
  ["KEY_DELTAS exported", dataSrc.includes("export const KEY_DELTAS")],
  ["Annual 1977", dataSrc.includes("annualDistortive2025: 1977")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  [
    "Dashboard wired",
    dashboardSrc.includes('data-viz="fiscal-industrial-policy-update-202608"'),
  ],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Vintage change (counts / percentage points)") ||
      findInChunks("2025 distortive toolkit mix"),
  ],
];

let failed = 0;
for (const [name, ok] of staticChecks) {
  console.log(ok ? "✓" : "✗", name);
  if (!ok) failed++;
}

if (failed > 0) {
  process.exit(1);
}

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4182);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
