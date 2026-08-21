/**
 * QA: ai-power-grid-update-2026q3
 * // viz-types: YoY bars, dual-ledger dumbbell, stacked segment areas, US composition bars, grid Δ bars, capacity dual-axis, pace scatter | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "ai-power-grid-update-2026q3";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", `${slug}-data.ts`);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AiPowerGridUpdate2026q3Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "energy-ai-power-grid-update-2026q3-hero.png",
);

const alwaysVisible = [
  "Vintage delta — Key Questions Apr 2026 → Gartner Jun 2026 + Electricity 2026",
  "YoY growth — prior IEA vs Q3 Gartner",
];

const panelMarkers = [
  { button: "Dual ledger", text: "Dual ledger dumbbell" },
  { button: "AI vs conventional", text: "Gartner segment stack" },
  { button: "Grid queues", text: "Grid-pace meters" },
  { button: "Pace mismatch", text: "Pace mismatch scatter" },
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
  ["HEADLINE exported", dataSrc.includes("export const HEADLINE")],
  ["565 TWh 2026", dataSrc.includes("gartnerTwh2026: 565")],
  ["+26.4% yoy", dataSrc.includes("yoy2026Pct: 26.4")],
  ["Dual ledger gap", dataSrc.includes("dualLedgerGapTwh: 250")],
  ["Global queue 2500", dataSrc.includes("globalQueueStalledGw: 2500")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired", dashboardSrc.includes('data-viz="ai-power-grid-update-2026q3"')],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Vintage delta — Key Questions Apr 2026") ||
      findInChunks("ai-power-grid-update-2026q3"),
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

  await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
    waitUntil: "networkidle",
    timeout: 45000,
  });

  for (const m of alwaysVisible) {
    await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
    console.log(`✓ Marker: ${m}`);
  }

  for (const { button, text } of panelMarkers) {
    await page.getByRole("button", { name: button }).first().click();
    await page.getByText(text, { exact: false }).first().waitFor({ timeout: 20000 });
    console.log(`✓ Marker: ${text}`);
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
    .locator('img[src*="energy-ai-power-grid-update-2026q3-hero"]')
    .first()
    .isVisible()
    .catch(() => false);
  if (heroVisible) {
    console.log("✓ Hero PNG visible on Energy listing card");
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
  if (server) await stopStaticServer(server);
}

if (failed > 0) {
  console.log(`qa-ai-power-grid-update-2026q3: FAIL (${failed})`);
  process.exit(1);
}
console.log("qa-ai-power-grid-update-2026q3: PASS");
