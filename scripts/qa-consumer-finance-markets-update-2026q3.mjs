/**
 * QA: consumer-finance-markets-update-2026q3
 * // viz-types: vintage Δ bars, saving area, debt dumbbell scatter, stress multi-line + radar, cash dual bars, APR composed | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "consumer-finance-markets-update-2026q3";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(
  root,
  "src",
  "data",
  "consumer-finance-markets-update-2026q3-data.ts",
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "ConsumerFinanceMarketsUpdate2026q3Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "consumer-finance-consumer-finance-markets-update-2026q3-hero.png",
);

const markers = [
  "Q3 vintage update · vs Aug update print",
  "What changed vs the Aug update print",
  "Personal saving rate path into July 2026",
  "Product dumbbell — 2026Q1 → 2026Q2",
  "Delinquency path into 2026Q2",
  "Liquid cash sleeves",
  "Card APR − fed funds gap",
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
  ["savingNewPct 3.1", dataSrc.includes("savingNewPct: 3.1")],
  ["totalDebtNewTn 18.926", dataSrc.includes("totalDebtNewTn: 18.926")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  [
    "Dashboard wired",
    dashboardSrc.includes('data-viz="consumer-finance-markets-update-2026q3"'),
  ],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Q3 vintage update · vs Aug update print") ||
      findInChunks("What changed vs the Aug update print"),
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

const port = Number(process.env.SMOKE_PORT || 4188);
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

  for (const label of ["Δ meters", "Saving", "Debt", "Stress", "Cash", "APR gap"]) {
    const btn = page.getByRole("button", { name: label });
    if (await btn.count()) {
      await btn.first().click();
      await page.waitForTimeout(400);
    }
  }

  await page.getByRole("button", { name: "Saving" }).first().click();
  await page
    .getByText("Personal saving rate path into July 2026", { exact: false })
    .first()
    .waitFor({ timeout: 10000 });
  console.log("✓ Saving panel");

  await page.getByRole("button", { name: "Stress" }).first().click();
  await page.getByRole("button", { name: "Mix radar" }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "QoQ path" }).first().click();
  console.log("✓ Stress view toggles");

  await page.getByRole("button", { name: "Cash" }).first().click();
  await page.getByRole("button", { name: "Prior | New" }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Δ vs prior" }).first().click();
  console.log("✓ Cash view toggles");

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
