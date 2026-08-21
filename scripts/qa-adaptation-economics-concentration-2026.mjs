/**
 * QA: adaptation-economics-concentration-2026
 * // viz-types: Lorenz area+line, ranked residual bars, region gap bars, resilience×gap scatter, donor bars, instrument donut, scarcity ledgers | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DONOR_SHARES,
  HEADLINE,
  REGION_GAPS,
  RESIDUAL_BEARERS,
} from "../src/data/adaptation-economics-concentration-2026-data.ts";

assert.equal(HEADLINE.top1BearerSharePct, 40);
assert.equal(HEADLINE.top3BearerSharePct, 87);
assert.equal(HEADLINE.residualHhi, 2826);
assert.equal(HEADLINE.top1GapRegionSharePct, 22.4);
assert.equal(HEADLINE.top3GapRegionSharePct, 52.6);
assert.equal(HEADLINE.top1DonorSharePct, 18);
assert.equal(HEADLINE.top3DonorSharePct, 46);
assert.equal(HEADLINE.oecdAdapt2024Bn, 34.7);
assert.equal(HEADLINE.mdbLmicAdapt2025Bn, 35);
assert.equal(HEADLINE.protectionGapBn, 424);
assert.equal(HEADLINE.loanSharePublic2024Pct, 67);
assert.equal(RESIDUAL_BEARERS[0].sharePct, 40);
assert.equal(REGION_GAPS[0].gapBn, 95);
assert.equal(DONOR_SHARES[0].sharePct, 18);

const root = process.cwd();
const slug = "adaptation-economics-concentration-2026";
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
  "adaptation-economics-concentration-2026-data.ts",
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AdaptationEconomicsConcentrationDashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "energy-adaptation-economics-concentration-2026-hero.png",
);

const markers = [
  "Adaptation economics — concentration lens",
  "Cumulative share vs equal split",
  "Who absorbs residual damage",
];

function extractPostBody() {
  const postsSrc = fs.readFileSync(
    path.join(root, "src", "data", "posts.ts"),
    "utf8",
  );
  const start = postsSrc.indexOf(`id: "${slug}"`);
  if (start < 0) return "";
  const contentStart = postsSrc.indexOf("content: `", start);
  if (contentStart < 0) return "";
  const after = postsSrc.slice(contentStart + 10);
  const endMatch = after.match(/`,\r?\n\s*\},/);
  if (!endMatch || endMatch.index == null) return "";
  return after.slice(0, endMatch.index);
}

const body = extractPostBody();
const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
const h2Count = (body.match(/^## /gm) || []).length;
const internalLinks = (body.match(/\]\(\/blog\//g) || []).length;

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
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  ["top1BearerSharePct 40", dataSrc.includes("top1BearerSharePct: 40")],
  ["top3BearerSharePct 87", dataSrc.includes("top3BearerSharePct: 87")],
  ["protectionGapBn 424", dataSrc.includes("protectionGapBn: 424")],
  ["Word count >= 1200", wordCount >= 1200],
  ["H2 count >= 6", h2Count >= 6],
  ["Internal links >= 2", internalLinks >= 2],
  ["Caveats section", body.includes("## Caveats")],
  ["Table markdown", body.includes("| Lens |")],
  ["viz has >=2 controls", (dashboardSrc.match(/ToggleGroup/g) || []).length >= 2],
  [
    "viz chart diversity",
    /BarChart/.test(dashboardSrc) &&
      /PieChart/.test(dashboardSrc) &&
      /ScatterChart/.test(dashboardSrc) &&
      /ComposedChart/.test(dashboardSrc),
  ],
];

let failed = false;
for (const [label, ok] of staticChecks) {
  if (!ok) {
    console.error(`FAIL ${label}`);
    failed = true;
  } else {
    console.log(`ok ${label}`);
  }
}
console.log(`words=${wordCount} h2=${h2Count} links=${internalLinks}`);
if (failed) process.exit(1);

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4186);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    const url = fs.existsSync(htmlPathNested)
      ? `http://127.0.0.1:${port}/blog/${slug}/`
      : `http://127.0.0.1:${port}/blog/${slug}.html`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForSelector(
      '[data-viz="adaptation-economics-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`ok ${m}`);
    }
    for (const label of [
      "Protection gaps",
      "Donors & instruments",
      "Scarcity stack",
      "Residual ladder",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(200);
      }
    }
    await page.getByRole("button", { name: "Residual ladder" }).first().click();
    await page.getByRole("button", { name: "Cumulative %" }).first().click();
    await page.getByRole("button", { name: "Protection gaps" }).first().click();
    await page.getByRole("button", { name: "Developing" }).first().click();
    console.log("ok view / metric / income toggles");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.warn("Viz interaction warnings", audit.warnings);
    }
    console.log("ok viz interaction audit");
    console.log("qa-adaptation-economics-concentration-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
