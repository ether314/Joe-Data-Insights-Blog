import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";

const root = process.cwd();
const slug = "major-ai-brands-token-consumption-2022-2026";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", "ai-token-consumption-data.ts");
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AiTokenConsumptionDashboard.tsx",
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
  await page.getByText("June 2026 provider comparison", { exact: false }).first().waitFor({ timeout: 20000 });
  await page.getByText("US vs China token volume", { exact: false }).first().waitFor({ timeout: 5000 });
  await page.getByText("OpenRouter routed volume", { exact: false }).first().waitFor({ timeout: 5000 });
  await page.getByText("Price per million input tokens", { exact: false }).first().waitFor({ timeout: 5000 });
  await page.getByText("China's official national token volume", { exact: false }).first().waitFor({ timeout: 5000 });

  const showing = page.getByText(/Showing \d+ of \d+ records/);
  const allCountText = await showing.textContent();
  await page.locator("#token-brand").selectOption("bytedance");
  let brandFilterWorks = false;
  for (let i = 0; i < 20; i++) {
    const next = await showing.textContent();
    if (next && next !== allCountText) {
      brandFilterWorks = true;
      break;
    }
    await page.waitForTimeout(250);
  }

  await page.locator("#token-brand").selectOption("All");
  await page.locator("#token-origin").selectOption("China");
  let originFilterWorks = false;
  for (let i = 0; i < 20; i++) {
    const next = await showing.textContent();
    if (next && next !== allCountText) {
      originFilterWorks = true;
      break;
    }
    await page.waitForTimeout(250);
  }

  const stuckLoading = await page.getByText("Loading interactive charts…").isVisible().catch(() => false);

  await page.goto(`http://127.0.0.1:${port}/category/technology`, { waitUntil: "networkidle", timeout: 30000 });
  const heroVisible = await page
    .locator('img[src*="technology-major-ai-brands-token-consumption-2022-2026-hero"]')
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

  return {
    consoleErrors: relevantConsole,
    pageErrors,
    stuckLoading,
    heroVisible,
    brandFilterWorks,
    originFilterWorks,
  };
}

const dataSrc = fs.existsSync(dataPath) ? fs.readFileSync(dataPath, "utf8") : "";
const dashboardSrc = fs.existsSync(dashboardPath) ? fs.readFileSync(dashboardPath, "utf8") : "";

const staticChecks = [
  ["AI token consumption post HTML exists", fs.existsSync(htmlPath)],
  [
    "Has loading fallback",
    fs.existsSync(htmlPath) && fs.readFileSync(htmlPath, "utf8").includes("Loading interactive charts"),
  ],
  ["Data module exists", fs.existsSync(dataPath)],
  ["DATA_YEAR_START is 2022", dataSrc.includes("export const DATA_YEAR_START = 2022")],
  ["DATA_YEAR_END is 2026", dataSrc.includes("export const DATA_YEAR_END = 2026")],
  ["GLOBAL_SUMMARY exported", dataSrc.includes("export const GLOBAL_SUMMARY")],
  ["JUNE_2026_SLICE exported", dataSrc.includes("export const JUNE_2026_SLICE")],
  ["Dashboard component exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired to ai-token-consumption", dashboardSrc.includes('data-viz="ai-token-consumption"')],
  ["Dashboard uses GLOBAL_SUMMARY", dashboardSrc.includes("GLOBAL_SUMMARY")],
  ["Dashboard uses JUNE_2026_SLICE", dashboardSrc.includes("JUNE_2026_SLICE")],
  ["Origin dimension exported", dataSrc.includes("export const BRAND_ORIGIN")],
  ["China providers present", ["bytedance", "alibaba", "deepseek", "tencent", "moonshot", "zhipu", "minimax", "xiaomi", "baidu"].every((id) => dataSrc.includes(`"${id}"`))],
  ["OpenRouter split exported", dataSrc.includes("export const OPENROUTER_SPLIT")],
  ["China national series exported", dataSrc.includes("export const CHINA_NATIONAL_DAILY")],
  ["Price comparison exported", dataSrc.includes("export const PRICE_PER_MTOK")],
  ["Dashboard has origin filter", dashboardSrc.includes('id="token-origin"')],
  ["Dashboard bundled", findInChunks("June 2026 provider comparison") || findInChunks("US vs China token volume")],
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
  const {
    consoleErrors,
    pageErrors,
    stuckLoading,
    heroVisible,
    brandFilterWorks,
    originFilterWorks,
  } = await browserSmoke(port);

  if (stuckLoading) {
    console.log("✗ Dashboard stuck on loading state");
    failed++;
  } else {
    console.log("✓ Dashboard renders (not stuck loading)");
  }

  if (brandFilterWorks) {
    console.log("✓ Provider filter updates record count");
  } else {
    console.log("✗ Provider filter did not update");
    failed++;
  }

  if (originFilterWorks) {
    console.log("✓ Origin filter updates record count");
  } else {
    console.log("✗ Origin filter did not update");
    failed++;
  }

  if (heroVisible) {
    console.log("✓ Hero PNG visible on Technology listing card");
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
console.log("\nAll AI token consumption QA checks passed.");
