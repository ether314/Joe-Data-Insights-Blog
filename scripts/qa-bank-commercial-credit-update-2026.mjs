/**
 * QA: bank-commercial-credit-update-2026
 * // viz-types: YoY Δ bars, charge-off dumbbell, CRE dual-line path, multiple composed, stress scatter, SLOOS composed | layout: canvas
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "bank-commercial-credit-update-2026";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(
  root,
  "src",
  "data",
  "bank-commercial-credit-update-2026-data.ts",
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "BankCommercialCreditUpdateDashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "finance-bank-commercial-credit-update-2026-hero.png",
);

const markers = [
  "Vintage update · YoY vs research map",
  "What changed year over year",
  "Charge-off levels — year-ago vs 2026Q1",
  "CRE vs cards — delinquency and charge-off path",
  "CRE delinquency ÷ charge-off multiple",
  "2026Q1 stress map — delinquency × charge-off",
  "Credit supply — net % of banks tightening",
];

function findInChunks(needle) {
  const chunksDir = path.join(root, "out", "_next", "static", "chunks");
  if (!fs.existsSync(chunksDir)) return false;
  for (const file of fs.readdirSync(chunksDir)) {
    if (!file.endsWith(".js")) continue;
    if (fs.readFileSync(path.join(chunksDir, file), "utf8").includes(needle))
      return true;
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
  ["VINTAGE_METERS exported", dataSrc.includes("export const VINTAGE_METERS")],
  ["cardsChargeOffYoyDelta -0.62", dataSrc.includes("cardsChargeOffYoyDelta: -0.62")],
  ["creDelinqNew 1.56", dataSrc.includes("creDelinqNew: 1.56")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  [
    "Dashboard wired",
    dashboardSrc.includes('data-viz="bank-commercial-credit-update-2026"'),
  ],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Vintage update · YoY vs research map") ||
      findInChunks("What changed year over year"),
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

  await page
    .getByText(markers[0], { exact: false })
    .first()
    .waitFor({ timeout: 20000 });
  console.log(`✓ ${markers[0]}`);

  for (const label of ["Δ meters", "Charge-offs", "CRE path", "Multiple", "Stress map", "SLOOS"]) {
    const btn = page.getByRole("button", { name: label });
    if (await btn.count()) {
      await btn.first().click();
      await page.waitForTimeout(400);
    }
  }

  await page.getByRole("button", { name: "Δ meters" }).first().click();
  await page.getByRole("button", { name: "QoQ" }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "YoY" }).first().click();
  console.log("✓ YoY/QoQ delta toggles");

  await page.getByRole("button", { name: "CRE path" }).first().click();
  await page
    .getByText("CRE vs cards — delinquency and charge-off path", { exact: false })
    .first()
    .waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: "Cards" }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "All" }).first().click();
  console.log("✓ CRE path series toggles");

  const audit = await auditVizInteractions(page, { slug });
  if (audit.issues?.length) {
    console.error("✗ Viz interaction audit failed", audit);
    process.exit(1);
  }
  console.log("✓ Viz interaction audit passed", audit.stats);
  if (audit.warnings?.length) {
    for (const w of audit.warnings) console.log("  ⚠", w);
  }

  const relevantConsole = consoleErrors.filter(
    (e) =>
      !e.includes("404") &&
      !e.includes("Failed to load resource") &&
      !e.includes("metamask") &&
      !e.includes("ObjectMultiplex") &&
      !/favicon|Download the React DevTools|hydration/i.test(e),
  );
  if (pageErrors.length) {
    console.error("✗ Page errors", pageErrors.slice(0, 5));
    process.exit(1);
  }
  if (relevantConsole.length) {
    console.error("✗ Console errors", relevantConsole.slice(0, 5));
    process.exit(1);
  }

  console.log(`✓ QA passed: ${slug}`);
  await browser.close();
} finally {
  if (server) await stopStaticServer(server);
}
