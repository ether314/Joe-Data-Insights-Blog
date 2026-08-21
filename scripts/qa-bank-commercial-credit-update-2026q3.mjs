/**
 * QA: bank-commercial-credit-update-2026q3
 * // viz-types: signed Δ bars, SLOOS multi-line, CMBS dumbbell, Fed dual-line, bank×CMBS scatter, size-split | layout: canvas
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "bank-commercial-credit-update-2026q3";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(
  root,
  "src",
  "data",
  "bank-commercial-credit-update-2026q3-data.ts",
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "BankCommercialCreditUpdate2026q3Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "finance-bank-commercial-credit-update-2026q3-hero.png",
);

const markers = [
  "Q3 vintage · July SLOOS + Trepp CMBS vs Aug update",
  "What changed versus the August update",
  "Credit supply — net % tightening (negative = easing)",
  "CMBS delinquency — prior post vs Trepp July 2026",
  "Bank book still on 2026Q1 Fed SA — carried path",
  "Two ledgers — bank SA rates vs CMBS delinquency",
  "Who eased? Large banks — not the whole panel",
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
  ["sloosCreNfnrNet -11.3", dataSrc.includes("sloosCreNfnrNet: -11.3")],
  ["cmbsOfficeNew 11.91", dataSrc.includes("cmbsOfficeNew: 11.91")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  [
    "Dashboard wired",
    dashboardSrc.includes('data-viz="bank-commercial-credit-update-2026q3"'),
  ],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Q3 vintage · July SLOOS + Trepp CMBS vs Aug update") ||
      findInChunks("What changed versus the August update"),
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

  await page
    .getByText(markers[0], { exact: false })
    .first()
    .waitFor({ timeout: 20000 });
  console.log(`✓ ${markers[0]}`);

  for (const label of [
    "Δ meters",
    "SLOOS path",
    "CMBS",
    "Fed SA",
    "Stress map",
    "Size split",
  ]) {
    const btn = page.getByRole("button", { name: label });
    if (await btn.count()) {
      await btn.first().click();
      await page.waitForTimeout(400);
    }
  }

  await page.getByRole("button", { name: "SLOOS path" }).first().click();
  await page
    .getByText("Credit supply — net % tightening", { exact: false })
    .first()
    .waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: "C&I / cards" }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "All" }).first().click();
  console.log("✓ SLOOS series toggles");

  await page.getByRole("button", { name: "Stress map" }).first().click();
  await page.getByRole("button", { name: "CMBS" }).nth(1).click().catch(() => {});
  // Book toggle "CMBS" may collide with panel "CMBS" — use Book group via text
  const bookCmbs = page.getByRole("button", { name: "Bank SA" });
  if (await bookCmbs.count()) {
    await bookCmbs.first().click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "All" }).first().click();
  }
  console.log("✓ Stress map book toggles");

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
