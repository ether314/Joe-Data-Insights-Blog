import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";

const root = process.cwd();
const slug = "ai-supply-chain-research-2026";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", "ai-supply-chain-research-2026-data.ts");
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AiSupplyChainResearchDashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "industry-ai-supply-chain-research-2026-hero.png",
);

function findInChunks(needle) {
  const chunksDir = path.join(root, "out", "_next", "static", "chunks");
  if (!fs.existsSync(chunksDir)) return false;
  for (const file of fs.readdirSync(chunksDir)) {
    if (!file.endsWith(".js")) continue;
    if (fs.readFileSync(path.join(chunksDir, file), "utf8").includes(needle)) return true;
  }
  return false;
}

async function browserSmoke(port) {
  const url = `http://127.0.0.1:${port}/blog/${slug}.html`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page
    .getByText("Semiconductor supply chain — equipment cycle & bottlenecks", { exact: false })
    .first()
    .waitFor({ timeout: 20000 });
  await page.getByText("$165.9B", { exact: false }).first().waitFor({ timeout: 5000 });
  await page.getByText("Equipment cycle", { exact: false }).first().waitFor({ timeout: 5000 });

  const stuckLoading = await page.getByText("Loading interactive charts…").isVisible().catch(() => false);

  await page.getByRole("button", { name: "Regions" }).first().click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Bottlenecks" }).first().click();
  await page.waitForTimeout(400);

  await page.goto(`http://127.0.0.1:${port}/category/industry`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  const heroVisible = await page
    .locator('img[src*="industry-ai-supply-chain-research-2026-hero"]')
    .first()
    .isVisible()
    .catch(() => false);

  await browser.close();

  const relevantConsole = consoleErrors.filter(
    (e) =>
      !e.includes("404") &&
      !e.includes("Failed to load resource") &&
      !e.includes("metamask") &&
      !e.includes("ObjectMultiplex"),
  );

  return { consoleErrors: relevantConsole, pageErrors, stuckLoading, heroVisible };
}

const dataSrc = fs.existsSync(dataPath) ? fs.readFileSync(dataPath, "utf8") : "";
const dashboardSrc = fs.existsSync(dashboardPath) ? fs.readFileSync(dashboardPath, "utf8") : "";
const htmlExists = fs.existsSync(htmlPath);
const html = htmlExists ? fs.readFileSync(htmlPath, "utf8") : "";

const staticChecks = [
  ["AI supply chain research post HTML exists", htmlExists],
  ["Has loading fallback", html.includes("Loading interactive charts")],
  ["Data module exists", fs.existsSync(dataPath)],
  ["EQUIPMENT_CYCLE exported", dataSrc.includes("export const EQUIPMENT_CYCLE")],
  ["REGIONAL_BILLINGS exported", dataSrc.includes("export const REGIONAL_BILLINGS")],
  ["BOTTLENECK_LAYERS exported", dataSrc.includes("export const BOTTLENECK_LAYERS")],
  ["HEADLINE exported", dataSrc.includes("export const HEADLINE")],
  ["2026 total near 165.9", dataSrc.includes("totalEquip2026: 165.9")],
  ["Dashboard component exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired", dashboardSrc.includes('data-viz="ai-supply-chain-research"')],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Semiconductor supply chain — equipment cycle & bottlenecks") ||
      findInChunks("Equipment cycle: total OEM sales"),
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
  const { consoleErrors, pageErrors, stuckLoading, heroVisible } = await browserSmoke(port);

  if (stuckLoading) {
    console.log("✗ Dashboard stuck on loading state");
    failed++;
  } else {
    console.log("✓ Dashboard renders (not stuck loading)");
  }

  if (heroVisible) {
    console.log("✓ Hero PNG visible on Industry listing card");
  } else {
    console.log("✗ Hero PNG not visible on listing card");
    failed++;
  }

  if (pageErrors.length) {
    console.log("✗ Page errors:");
    for (const e of pageErrors) console.log("  ", e);
    failed++;
  } else {
    console.log("✓ No page errors");
  }

  if (consoleErrors.length) {
    console.log("✗ Console errors:");
    for (const e of consoleErrors) console.log("  ", e);
    failed++;
  } else {
    console.log("✓ No console errors");
  }
} finally {
  if (server) await stopStaticServer(server);
}

if (failed > 0) process.exit(1);
console.log("\nAll AI supply chain research QA checks passed.");
