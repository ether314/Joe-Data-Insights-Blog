/**
 * QA: ai-supply-chain-update-2026
 * // viz-types: YoY/QoQ delta bars, Q1 dumbbell, tightness Δ bars, dual-vintage scatter, CoWoS gap composed | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "ai-supply-chain-update-2026";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", "ai-supply-chain-update-2026-data.ts");
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AiSupplyChainUpdateDashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "industry-ai-supply-chain-update-2026-hero.png",
);

const markers = [
  "Vintage delta — Jul research → Aug 2026 WWSEMS Q1",
  "Regional growth rates (Q1 2026)",
  "Q1 levels — prior year → newest print",
  "Tightness score Δ (Jul → Aug)",
  "Bottleneck scatter — tightness × lead time",
  "CoWoS capacity vs demand — vintage revision",
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
  ["REGIONAL_Q1 exported", dataSrc.includes("export const REGIONAL_Q1")],
  ["BOTTLENECK_DELTA exported", dataSrc.includes("export const BOTTLENECK_DELTA")],
  ["Q1 headline 36.55", dataSrc.includes("q1_2026: 36.55")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired", dashboardSrc.includes('data-viz="ai-supply-chain-update-2026"')],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Vintage delta — Jul research") || findInChunks("CoWoS capacity vs demand"),
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

const port = Number(process.env.SMOKE_PORT || 4182);
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

  // Default panel shows first two markers; click through for the rest
  for (const m of markers.slice(0, 3)) {
    await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
    console.log(`✓ Marker: ${m}`);
  }

  await page.getByRole("button", { name: "Bottlenecks" }).click();
  for (const m of markers.slice(3, 5)) {
    await page.getByText(m, { exact: false }).first().waitFor({ timeout: 15000 });
    console.log(`✓ Marker: ${m}`);
  }

  await page.getByRole("button", { name: "CoWoS path" }).click();
  await page.getByText(markers[5], { exact: false }).first().waitFor({ timeout: 15000 });
  console.log(`✓ Marker: ${markers[5]}`);

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

  await page.goto(`http://127.0.0.1:${port}/category/industry`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  const heroVisible = await page
    .locator('img[src*="industry-ai-supply-chain-update-2026-hero"]')
    .first()
    .isVisible()
    .catch(() => false);
  if (heroVisible) {
    console.log("✓ Hero PNG visible on Industry listing card");
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
