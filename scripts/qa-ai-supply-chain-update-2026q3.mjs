/**
 * QA: ai-supply-chain-update-2026q3
 * // viz-types: segment YoY bars, CoWoS capacity/demand composed, reservation share bars, tightness Δ + dual-vintage scatter, stack-flow bars | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "ai-supply-chain-update-2026q3";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", "ai-supply-chain-update-2026q3-data.ts");
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AiSupplyChainUpdate2026q3Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "industry-ai-supply-chain-update-2026q3-hero.png",
);

const markers = [
  "Vintage delta — Aug WWSEMS Q1 update → Q3 CoWoS tracker",
  "CoWoS capacity vs demand — vintage revision",
  "2026 CoWoS reservation split",
  "Equipment dollars — 2025 actual → 2026 Mid-Year",
  "Tightness score Δ (Aug mid-print → Q3)",
  "Upstream dollars → downstream gate",
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
    fs.existsSync(htmlPath) &&
      fs.readFileSync(htmlPath, "utf8").includes("Loading interactive charts"),
  ],
  ["Data module exists", fs.existsSync(dataPath)],
  ["COWOS_VINTAGES exported", dataSrc.includes("export const COWOS_VINTAGES")],
  ["BOTTLENECK_DELTA exported", dataSrc.includes("export const BOTTLENECK_DELTA")],
  ["Headline 140k capacity", dataSrc.includes("cowosCapQ3Ye: 140_000")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired", dashboardSrc.includes('data-viz="ai-supply-chain-update-2026q3"')],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Vintage delta — Aug WWSEMS Q1 update") ||
      findInChunks("CoWoS capacity vs demand"),
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

  for (const m of markers.slice(0, 3)) {
    await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
    console.log(`✓ Marker: ${m}`);
  }

  await page.getByRole("button", { name: "Equipment $" }).click();
  await page.getByText(markers[3], { exact: false }).first().waitFor({ timeout: 15000 });
  console.log(`✓ Marker: ${markers[3]}`);

  await page.getByRole("button", { name: "Bottlenecks" }).click();
  await page.getByText(markers[4], { exact: false }).first().waitFor({ timeout: 15000 });
  console.log(`✓ Marker: ${markers[4]}`);

  await page.getByRole("button", { name: "Stack flow" }).click();
  await page.getByText(markers[5], { exact: false }).first().waitFor({ timeout: 15000 });
  console.log(`✓ Marker: ${markers[5]}`);

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

  await page.goto(`http://127.0.0.1:${port}/category/industry`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  const heroVisible = await page
    .locator('img[src*="industry-ai-supply-chain-update-2026q3-hero"]')
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
