import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";

const root = process.cwd();
const slug = "ai-financing-research-2026";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", "ai-financing-research-2026-data.ts");
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AiFinancingResearchDashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "capital-markets-ai-financing-research-2026-hero.png",
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
    .getByText("Hyperscaler IG bond issuance vs debt share of capex", { exact: false })
    .first()
    .waitFor({ timeout: 20000 });
  await page.getByText("33%", { exact: false }).first().waitFor({ timeout: 5000 });

  const stuckLoading = await page.getByText("Loading interactive charts…").isVisible().catch(() => false);

  await page.getByRole("button", { name: "2027" }).first().click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Funding mix" }).click();
  await page.waitForTimeout(400);
  await page.getByText("Funding mix — 2027", { exact: false }).first().waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: "Equity / ETFs" }).click();
  await page.waitForTimeout(400);

  await page.goto(`http://127.0.0.1:${port}/category/capital-markets`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  const heroVisible = await page
    .locator('img[src*="capital-markets-ai-financing-research-2026-hero"]')
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
  ["AI financing research post HTML exists", htmlExists],
  ["Has loading fallback", html.includes("Loading interactive charts")],
  ["Data module exists", fs.existsSync(dataPath)],
  ["FINANCING_PATH exported", dataSrc.includes("export const FINANCING_PATH")],
  ["FUNDING_CHANNELS exported", dataSrc.includes("export const FUNDING_CHANNELS")],
  ["HEADLINE exported", dataSrc.includes("export const HEADLINE")],
  ["2026 debt share 33%", dataSrc.includes("debtShare2026Pct: 33")],
  ["2026 IG bonds 250", dataSrc.includes("igBonds2026Bn: 250")],
  ["Dashboard component exists", fs.existsSync(dashboardPath)],
  ["Dashboard wired", dashboardSrc.includes('data-viz="ai-financing-research-2026"')],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Hyperscaler IG bond issuance vs debt share of capex") ||
      findInChunks("ai-financing-research-2026"),
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
    console.log("✓ Hero PNG visible on Capital Markets listing card");
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
console.log("\nAll AI financing research QA checks passed.");
