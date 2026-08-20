/**
 * QA: measurement-science-update-2026q3
 * // viz-types: share restatement dumbbell, measure-frame ladder, sector gap diverging, OECD growth bars, funding donut, EU/US ratio path, scoreboard scatter | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "measurement-science-update-2026q3";
const htmlPathFlat = path.join(root, "out", "blog", `${slug}.html`);
const htmlPathNested = path.join(root, "out", "blog", slug, "index.html");
const htmlPath = fs.existsSync(htmlPathFlat)
  ? htmlPathFlat
  : fs.existsSync(htmlPathNested)
    ? htmlPathNested
    : htmlPathFlat;
const dataPath = path.join(
  root,
  "src",
  "data",
  "measurement-science-update-2026q3-data.ts",
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "MeasurementScienceUpdate2026q3Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "global-systems-measurement-science-update-2026q3-hero.png",
);

const markers = [
  "PPP overtake gap narrows to 0.3 pp",
  "Vintage delta — NSF State of S&E → OECD/AAAS Q3",
  "Share restatement",
  "Same 2024 GERD, four converters",
  "Sector gaps: business vs government",
  "OECD-area real GERD growth",
  "OECD funding mix",
  "AAAS scoreboard",
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
  ["SHARE_RESTATE exported", dataSrc.includes("export const SHARE_RESTATE")],
  ["chinaSharePct 29.4", dataSrc.includes("chinaSharePct: 29.4")],
  ["businessBerdGapBn 100", dataSrc.includes("businessBerdGapBn: 100")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  [
    "Dashboard wired",
    dashboardSrc.includes('data-viz="measurement-science-update-2026q3"'),
  ],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  [
    "Dashboard bundled",
    findInChunks("PPP overtake gap narrows to 0.3 pp") ||
      findInChunks("Vintage delta — NSF State of S&E"),
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

  const blogUrl = fs.existsSync(htmlPathFlat)
    ? `http://127.0.0.1:${port}/blog/${slug}.html`
    : `http://127.0.0.1:${port}/blog/${slug}/`;

  await page.goto(blogUrl, { waitUntil: "networkidle", timeout: 60000 });

  await page
    .getByText(markers[0], { exact: false })
    .first()
    .waitFor({ timeout: 20000 });
  console.log(`✓ ${markers[0]}`);

  for (const label of [
    "Share restatement",
    "Measure frames",
    "Sector gaps",
    "OECD growth",
    "Funding mix",
    "Scoreboard",
  ]) {
    const btn = page.getByRole("button", { name: label });
    if (await btn.count()) {
      await btn.first().click();
      await page.waitForTimeout(400);
    }
  }

  await page.getByRole("button", { name: "Measure frames" }).first().click();
  await page
    .getByText("Same 2024 GERD, four converters", { exact: false })
    .first()
    .waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: "Sensitivity" }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "All frames" }).first().click();
  console.log("✓ Frames panel + filter toggles");

  await page.getByRole("button", { name: "OECD growth" }).first().click();
  await page.getByRole("button", { name: "Since 1992" }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "2024 YoY" }).first().click();
  console.log("✓ Growth view toggles");

  await page.getByRole("button", { name: "Scoreboard" }).first().click();
  await page
    .getByText("AAAS scoreboard", { exact: false })
    .first()
    .waitFor({ timeout: 10000 });
  console.log("✓ Scoreboard panel");

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
