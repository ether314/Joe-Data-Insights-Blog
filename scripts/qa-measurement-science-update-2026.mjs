/**
 * QA: measurement-science-update-2026
 * // viz-types: share Δ diverging bars, prior→new volume dumbbell, GERD share path, HCA×pubs scatter, intensity paired bars | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "measurement-science-update-2026";
const htmlPathFlat = path.join(root, "out", "blog", `${slug}.html`);
const htmlPathNested = path.join(root, "out", "blog", slug, "index.html");
const htmlPath = fs.existsSync(htmlPathFlat)
  ? htmlPathFlat
  : fs.existsSync(htmlPathNested)
    ? htmlPathNested
    : htmlPathFlat;
const dataPath = path.join(root, "src", "data", "measurement-science-update-2026-data.ts");
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "MeasurementScienceUpdateDashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "global-systems-measurement-science-update-2026-hero.png",
);

const markers = [
  "China overtakes the US on PPP R&D share",
  "GERD share change, 2022 → 2024",
  "Share Δ",
  "Volume bridge",
  "Share path",
  "Pubs vintage",
  "HCA vs volume",
  "Intensity",
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
  ["SHARE_DELTAS exported", dataSrc.includes("export const SHARE_DELTAS")],
  ["chinaShare2024Pct 30", dataSrc.includes("chinaShare2024Pct: 30")],
  ["usChinaShare2024Pct 59", dataSrc.includes("usChinaShare2024Pct: 59")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired", dashboardSrc.includes('data-viz="measurement-science-update-2026"')],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("China overtakes the US on PPP R&D share") ||
      findInChunks("GERD share change, 2022"),
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

  await page.goto(`http://127.0.0.1:${port}/category/global-systems`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  const heroVisible = await page
    .locator('img[src*="global-systems-measurement-science-update-2026-hero"]')
    .first()
    .isVisible()
    .catch(() => false);
  if (heroVisible) {
    console.log("✓ Hero PNG visible on Global Systems listing card");
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
