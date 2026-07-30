import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";

const root = process.cwd();
const slug = "deflationary-growth-economies-2025";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", "deflationary-growth-2025-data.ts");
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "DeflationaryGrowth2025Dashboard.tsx",
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
  await page.getByText("GDP growth vs CPI deflation", { exact: false }).first().waitFor({ timeout: 20000 });
  await page.getByText("GDP growth ranking", { exact: false }).first().waitFor({ timeout: 5000 });
  await page.getByText("CPI deflation depth", { exact: false }).first().waitFor({ timeout: 5000 });

  const showing = page.getByText(/Showing \d+ of \d+ records/);
  const allCountText = await showing.textContent();
  await page.locator("#deflation-region").selectOption("East Asia");
  let regionFilterWorks = false;
  for (let i = 0; i < 20; i++) {
    const next = await showing.textContent();
    if (next && next !== allCountText) {
      regionFilterWorks = true;
      break;
    }
    await page.waitForTimeout(250);
  }

  const stuckLoading = await page.getByText("Loading interactive charts…").isVisible().catch(() => false);

  await page.goto(`http://127.0.0.1:${port}/category/economics`, { waitUntil: "networkidle", timeout: 30000 });
  const heroVisible = await page
    .locator('img[src*="economics-deflationary-growth-economies-2025-hero"]')
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

  return { consoleErrors: relevantConsole, pageErrors, stuckLoading, heroVisible, regionFilterWorks };
}

const dataSrc = fs.existsSync(dataPath) ? fs.readFileSync(dataPath, "utf8") : "";
const dashboardSrc = fs.existsSync(dashboardPath) ? fs.readFileSync(dashboardPath, "utf8") : "";

const staticChecks = [
  ["Deflationary growth post HTML exists", fs.existsSync(htmlPath)],
  [
    "Has loading fallback",
    fs.existsSync(htmlPath) && fs.readFileSync(htmlPath, "utf8").includes("Loading interactive charts"),
  ],
  ["Data module exists", fs.existsSync(dataPath)],
  ["DATA_YEAR is 2025", dataSrc.includes("export const DATA_YEAR = 2025")],
  ["GLOBAL_SUMMARY exported", dataSrc.includes("export const GLOBAL_SUMMARY")],
  ["DEFLATIONARY_GROWTH exported", dataSrc.includes("export const DEFLATIONARY_GROWTH")],
  ["Dashboard component exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired to deflationary-growth-2025", dashboardSrc.includes('data-viz="deflationary-growth-2025"')],
  ["Dashboard uses GLOBAL_SUMMARY", dashboardSrc.includes("GLOBAL_SUMMARY")],
  ["Dashboard uses DEFLATIONARY_GROWTH", dashboardSrc.includes("DEFLATIONARY_GROWTH")],
  ["Dashboard bundled", findInChunks("GDP growth vs CPI deflation") || findInChunks("CPI deflation depth")],
];

let failed = 0;
for (const [name, ok] of staticChecks) {
  console.log(ok ? "✓" : "✗", name);
  if (!ok) failed++;
}

if (failed > 0) {
  process.exit(1);
}

const port = 4173;
let server;
try {
  server = await startStaticServer(path.join(root, "out"), port);
  const { consoleErrors, pageErrors, stuckLoading, heroVisible, regionFilterWorks } = await browserSmoke(port);

  if (stuckLoading) {
    console.log("✗ Dashboard stuck on loading state");
    failed++;
  } else {
    console.log("✓ Dashboard renders (not stuck loading)");
  }

  if (regionFilterWorks) {
    console.log("✓ Region filter updates record count");
  } else {
    console.log("✗ Region filter did not update");
    failed++;
  }

  if (heroVisible) {
    console.log("✓ Hero PNG visible on Economics listing card");
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
  await stopStaticServer(server);
}

if (failed > 0) process.exit(1);
console.log("\nAll deflationary growth QA checks passed.");
