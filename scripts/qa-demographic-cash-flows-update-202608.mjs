/**
 * QA: demographic-cash-flows-update-202608
 * // viz-types: T12M composed bars+YoY, nominal-vs-real bars, state horizontal bars, payout donut, vintage dumbbell, age×remit scatter, pension path | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "demographic-cash-flows-update-202608";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(
  root,
  "src",
  "data",
  "demographic-cash-flows-update-202608-data.ts",
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "DemographicCashFlowsUpdate202608Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "global-systems-demographic-cash-flows-update-202608-hero.png",
);

const markers = [
  "Aug 202608 vintage delta — Q3 H1 rebound → T12M soft + real −8.3%",
  "Mexico remittances: T12M still soft after H1 rebound",
  "Nominal rebound vs real purchasing-power erosion",
  "State remittance leaders — Guanajuato leads; CDMX growth outlier",
  "How remittances are claimed — deposit share edges cash",
  "Q3 → Aug 202608 vintage swing",
  "Age structure × remittance dependence",
  "Host ledger unchanged: public pensions still climb toward 10% of GDP",
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
  ["MEXICO_T12M_SERIES exported", dataSrc.includes("export const MEXICO_T12M_SERIES")],
  ["mexicoT12mYoyPct -0.1", dataSrc.includes("mexicoT12mYoyPct: -0.1")],
  ["mexicoRealJuneYoyPct -8.3", dataSrc.includes("mexicoRealJuneYoyPct: -8.3")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  [
    "Dashboard wired",
    dashboardSrc.includes('data-viz="demographic-cash-flows-update-202608"'),
  ],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("Aug 202608 vintage delta") ||
      findInChunks("T12M still soft"),
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

  for (const label of [
    "T12M soft",
    "Nominal vs real",
    "State leaders",
    "Cash vs deposit",
    "Q3 → Aug swing",
    "Age × remit",
    "Host pensions",
  ]) {
    const btn = page.getByRole("button", { name: label });
    if (await btn.count()) {
      await btn.first().click();
      await page.waitForTimeout(400);
    }
  }

  await page.getByRole("button", { name: "Nominal vs real" }).first().click();
  await page
    .getByText("Nominal rebound vs real", { exact: false })
    .first()
    .waitFor({ timeout: 10000 });
  console.log("✓ Real panel");

  await page.getByRole("button", { name: "Age × remit" }).first().click();
  await page.getByRole("button", { name: "T12M soft" }).nth(1).click().catch(() => {});
  // Prefer scatter vintage "T12M soft" toggle if present
  const softVintage = page.getByRole("button", { name: "T12M soft" });
  if ((await softVintage.count()) > 1) {
    await softVintage.nth(1).click();
  }
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Both" }).first().click();
  console.log("✓ Scatter vintage toggles");

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
