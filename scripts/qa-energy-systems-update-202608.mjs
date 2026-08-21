/**
 * QA: energy-systems-update-202608
 * // viz-types: demand path composed, regional grouped bars, fuel outlook diverging, share area, wholesale bars, flex scatter | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "energy-systems-update-202608";
const htmlPathFlat = path.join(root, "out", "blog", `${slug}.html`);
const htmlPathNested = path.join(root, "out", "blog", slug, "index.html");
const htmlPath = fs.existsSync(htmlPathFlat)
  ? htmlPathFlat
  : fs.existsSync(htmlPathNested)
    ? htmlPathNested
    : htmlPathFlat;
const dataPath = path.join(
  root,
  "src",
  "data",
  "energy-systems-update-202608-data.ts",
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "EnergySystemsUpdate202608Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "energy-energy-systems-update-202608-hero.png",
);

const markers = [
  "August 2026 vintage · IEA Electricity Mid-Year Update vs Ember/WEI lens",
  "Demand path",
  "Regions",
  "Fuel outlook",
  "RE / VRE shares",
  "Wholesale",
  "Flexibility",
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
  ["DEMAND_PATH exported", dataSrc.includes("export const DEMAND_PATH")],
  ["coalGenGrowth2026Pct 1.4", dataSrc.includes("coalGenGrowth2026Pct: 1.4")],
  ["demandGrowth2026Pct 3.6", dataSrc.includes("demandGrowth2026Pct: 3.6")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  [
    "Dashboard wired",
    dashboardSrc.includes('data-viz="energy-systems-update-202608"'),
  ],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("August 2026 vintage · IEA Electricity Mid-Year Update") ||
      findInChunks("coal generation rebounds"),
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

const port = Number(process.env.SMOKE_PORT || 4186);
let server;
try {
  server = await startStaticServer(path.join(root, "out"), port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  const blogUrl = fs.existsSync(htmlPathFlat)
    ? `http://127.0.0.1:${port}/blog/${slug}.html`
    : `http://127.0.0.1:${port}/blog/${slug}/`;

  await page.goto(blogUrl, { waitUntil: "networkidle", timeout: 60000 });

  for (const m of markers) {
    await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
    console.log(`✓ Marker: ${m}`);
  }

  const stuckLoading = await page
    .getByText("Loading interactive charts…")
    .isVisible()
    .catch(() => false);
  if (stuckLoading) {
    console.log("✗ Dashboard stuck on loading state");
    failed++;
  } else {
    console.log("✓ Dashboard renders (not stuck loading)");
  }

  const audit = await auditVizInteractions(page, { slug });
  if (audit.issues?.length) {
    console.error("✗ Viz interaction audit failed", audit);
    failed++;
  } else {
    console.log("✓ Viz interaction audit passed", audit.stats);
    if (audit.warnings?.length) {
      for (const w of audit.warnings) console.log("  ⚠", w);
    }
  }

  await page.goto(`http://127.0.0.1:${port}/category/energy`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  const heroVisible = await page
    .locator('img[src*="energy-energy-systems-update-202608-hero"]')
    .first()
    .isVisible()
    .catch(() => false);
  if (heroVisible) {
    console.log("✓ Hero PNG visible on Energy listing card");
  } else {
    console.log("✗ Hero PNG not visible on listing card");
    failed++;
  }

  const serious = [...consoleErrors, ...pageErrors].filter(
    (e) =>
      !e.includes("404") &&
      !e.includes("Failed to load resource") &&
      !/favicon|ResizeObserver|hydration/i.test(e),
  );
  if (serious.length) {
    console.error("✗ Console/page errors", serious.slice(0, 8));
    failed++;
  } else {
    console.log("✓ No serious console/page errors");
  }

  await browser.close();
} catch (err) {
  console.error("✗ QA runtime failed", err);
  failed++;
} finally {
  if (server) await stopStaticServer(server);
}

if (failed > 0) {
  console.log(`qa-${slug}: FAIL (${failed})`);
  process.exit(1);
}
console.log(`qa-${slug}: PASS`);
