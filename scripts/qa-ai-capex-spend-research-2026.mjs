import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";

const root = process.cwd();
const slug = "ai-capex-spend-research-2026";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", "ai-capex-spend-research-2026-data.ts");
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AiCapexSpendResearchDashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "finance-ai-capex-spend-research-2026-hero.png",
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
  await page.getByText("Big-5 hyperscaler capex stack", { exact: false }).first().waitFor({
    timeout: 20000,
  });
  await page.getByText("Research-house scenario fan", { exact: false }).first().waitFor({
    timeout: 5000,
  });
  await page.getByText("$760B", { exact: false }).first().waitFor({ timeout: 5000 });

  const stuckLoading = await page.getByText("Loading interactive charts…").isVisible().catch(() => false);

  await page.getByRole("button", { name: "2027" }).first().click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "AI-attributed (~75%)" }).click();
  await page.waitForTimeout(400);

  await page.goto(`http://127.0.0.1:${port}/category/finance`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  const heroVisible = await page
    .locator('img[src*="finance-ai-capex-spend-research-2026-hero"]')
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
  ["AI capex spend research post HTML exists", htmlExists],
  ["Has loading fallback", html.includes("Loading interactive charts")],
  ["Data module exists", fs.existsSync(dataPath)],
  ["HYPERSCALER_GROSS_BN exported", dataSrc.includes("export const HYPERSCALER_GROSS_BN")],
  ["RESEARCH_SCENARIOS exported", dataSrc.includes("export const RESEARCH_SCENARIOS")],
  ["MCKINSEY_SCENARIOS exported", dataSrc.includes("export const MCKINSEY_SCENARIOS")],
  ["HEADLINE exported", dataSrc.includes("export const HEADLINE")],
  ["2026 Big-5 sum near 760", dataSrc.includes("big5_2026: 760")],
  ["Dashboard component exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired", dashboardSrc.includes('data-viz="ai-capex-spend-research"')],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Big-5 hyperscaler capex stack") || findInChunks("Research-house scenario fan"),
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

const port = Number(process.env.SMOKE_PORT || 4183);
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
    console.log("✓ Hero PNG visible on Finance listing card");
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
console.log("\nAll AI capex spend research QA checks passed.");
