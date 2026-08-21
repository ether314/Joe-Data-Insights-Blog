/**
 * QA: ai-supply-chain-concentration-2026
 * // viz-types: concentration Lorenz area+line, layer top-1/top-3 bars, foundry dual bars, HBM donut, share×tightness scatter, regional bars + CoWoS composed | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "ai-supply-chain-concentration-2026";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", `${slug}-data.ts`);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AiSupplyChainConcentrationDashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "industry-ai-supply-chain-concentration-2026-hero.png",
);

const markers = [
  "Semiconductor supply chain — concentration lens",
  "Stack concentration ladder",
  "Top-k share path across key layers",
  "Foundry: advanced-node vs overall share",
  "HBM vendor donut + cumulative ladder",
  "Top-1 share × bottleneck tightness",
  "Equipment billings geography (2025)",
  "CoWoS path — capacity vs NVIDIA reservation share",
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
  ["STACK_LAYERS exported", dataSrc.includes("export const STACK_LAYERS")],
  ["HBM_SHARES exported", dataSrc.includes("export const HBM_SHARES")],
  ["Headline EUV 100%", dataSrc.includes("euvTop1Pct: 100")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired", dashboardSrc.includes(`data-viz="${slug}"`)],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Semiconductor supply chain — concentration lens") ||
      findInChunks("Stack concentration ladder"),
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

  await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
    waitUntil: "networkidle",
    timeout: 45000,
  });

  for (const m of markers.slice(0, 3)) {
    await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
    console.log(`✓ Marker: ${m}`);
  }

  await page.getByRole("button", { name: "Foundry / HBM" }).click();
  await page.getByText(markers[3], { exact: false }).first().waitFor({ timeout: 15000 });
  console.log(`✓ Marker: ${markers[3]}`);
  await page.getByText(markers[4], { exact: false }).first().waitFor({ timeout: 15000 });
  console.log(`✓ Marker: ${markers[4]}`);

  await page.getByRole("button", { name: "Share × tightness" }).click();
  await page.getByText(markers[5], { exact: false }).first().waitFor({ timeout: 15000 });
  console.log(`✓ Marker: ${markers[5]}`);

  await page.getByRole("button", { name: "Regions / CoWoS" }).click();
  await page.getByText(markers[6], { exact: false }).first().waitFor({ timeout: 15000 });
  console.log(`✓ Marker: ${markers[6]}`);
  await page.getByText(markers[7], { exact: false }).first().waitFor({ timeout: 15000 });
  console.log(`✓ Marker: ${markers[7]}`);

  const stuckLoading = await page
    .getByText("Loading interactive charts…")
    .isVisible()
    .catch(() => false);
  if (stuckLoading) {
    console.log("✗ Still showing loading fallback");
    failed++;
  } else {
    console.log("✓ Viz rendered (not stuck loading)");
  }

  const audit = await auditVizInteractions(page, { slug });
  if (audit.issues?.length) {
    console.log("✗ Viz interaction audit failed", audit.issues);
    failed++;
  } else {
    console.log("✓ Viz interaction audit", audit.stats);
    if (audit.warnings?.length) {
      for (const w of audit.warnings) console.log("  ⚠", w);
    }
  }

  const relevantConsole = consoleErrors.filter(
    (e) =>
      !e.includes("404") &&
      !e.includes("Failed to load resource") &&
      !e.includes("metamask") &&
      !e.includes("favicon"),
  );
  if (pageErrors.length) {
    console.log("✗ Page errors:", pageErrors.slice(0, 3));
    failed++;
  } else {
    console.log("✓ No page errors");
  }

  if (relevantConsole.length) {
    console.log("⚠ Console errors:", relevantConsole.slice(0, 3));
  }

  await browser.close();
} finally {
  if (server) await stopStaticServer(server);
}

if (failed > 0) {
  console.log(`\nQA FAILED (${failed})`);
  process.exit(1);
}

console.log("\nQA PASSED");
