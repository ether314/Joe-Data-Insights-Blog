/**
 * QA: macro-growth-trade-update-202608
 * // viz-types: US CPI×PCE composed path, MoM inflation delta bars, SAAR-vs-YoY unit bridge, triad track, energy×core component bars, growth×price scatter | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "macro-growth-trade-update-202608";
const htmlPathFlat = path.join(root, "out", "blog", `${slug}.html`);
const htmlPathNested = path.join(root, "out", "blog", slug, "index.html");
const htmlPath = fs.existsSync(htmlPathFlat)
  ? htmlPathFlat
  : fs.existsSync(htmlPathNested)
    ? htmlPathNested
    : htmlPathFlat;
const dataPath = path.join(root, "src", "data", "macro-growth-trade-update-202608-data.ts");
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "MacroGrowthTradeUpdate202608Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "economics-macro-growth-trade-update-202608-hero.png",
);

const markers = [
  "Aug 202608 vintage · vs Q3 hard-data check",
  "US CPI × PCE — monthly YoY path",
  "July vs June inflation — MoM vintage deltas",
  "Triad tracking — July IMF path vs Aug hard signal",
  "Vintage ledger — what moved since Q3",
  "Growth × July price scatter",
  "CPB merchandise MoM — held through May",
];

function findInChunks(needle) {
  const chunksDir = path.join(root, "out", "_next", "static", "chunks");
  if (!fs.existsSync(chunksDir)) return false;
  for (const file of fs.readdirSync(chunksDir)) {
    if (!file.endsWith(".js")) continue;
    if (fs.readFileSync(path.join(chunksDir, file), "utf8").includes(needle)) return true;
  }
  return false;
}

const dataSrc = fs.existsSync(dataPath) ? fs.readFileSync(dataPath, "utf8") : "";
const dashboardSrc = fs.existsSync(dashboardPath) ? fs.readFileSync(dashboardPath, "utf8") : "";

const staticChecks = [
  ["Post HTML exists", fs.existsSync(htmlPath)],
  [
    "Has loading fallback",
    fs.existsSync(htmlPath) && fs.readFileSync(htmlPath, "utf8").includes("Loading interactive charts"),
  ],
  ["Data module exists", fs.existsSync(dataPath)],
  ["TRIAD_TRACK exported", dataSrc.includes("export const TRIAD_TRACK")],
  ["usCpiJulYoy 3.4", dataSrc.includes("usCpiJulYoy: 3.4")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired", dashboardSrc.includes('data-viz="macro-growth-trade-update-202608"')],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Aug 202608 vintage · vs Q3 hard-data check") ||
      findInChunks("US CPI × PCE — monthly YoY path"),
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

const port = Number(process.env.SMOKE_PORT || 4184);
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

  await page.goto(blogUrl, {
    waitUntil: "networkidle",
    timeout: 45000,
  });

  for (const m of markers) {
    await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
    console.log(`✓ Marker: ${m}`);
  }

  const stuckLoading = await page.getByText("Loading interactive charts…").isVisible().catch(() => false);
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

  await page.goto(`http://127.0.0.1:${port}/category/economics`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  const heroVisible = await page
    .locator('img[src*="economics-macro-growth-trade-update-202608-hero"]')
    .first()
    .isVisible()
    .catch(() => false);
  if (heroVisible) {
    console.log("✓ Hero PNG visible on Economics listing card");
  } else {
    console.log("✗ Hero PNG not visible on listing card");
    failed++;
  }

  const relevantConsole = consoleErrors.filter(
    (e) =>
      !e.includes("404") &&
      !e.includes("Failed to load resource") &&
      !e.includes("metamask") &&
      !e.includes("ObjectMultiplex"),
  );
  if (pageErrors.length) {
    console.log("✗ Page errors:", pageErrors);
    failed++;
  } else {
    console.log("✓ No page errors");
  }
  if (relevantConsole.length) {
    console.log("✗ Console errors:", relevantConsole);
    failed++;
  } else {
    console.log("✓ No console errors");
  }

  await browser.close();
} finally {
  await stopStaticServer(server);
}

if (failed > 0) process.exit(1);
console.log(`\nAll QA checks passed: ${slug}`);
