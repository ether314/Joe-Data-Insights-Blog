/**
 * QA: adaptation-economics-update-202608
 * // viz-types: vintage grouped bars, area+line MDB path w/ 2030 ref, H1 grouped compare, LMIC mix pie, residual pie, stack horizontal | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  MDB_ADAPT_PATH,
  gapVsMdbBn,
  needsBn,
} from "../src/data/adaptation-economics-update-202608-data.ts";

assert.equal(HEADLINE.mdbLmicAdapt2025Bn, 35);
assert.equal(HEADLINE.mdbLmicAdapt2024Bn, 26.7);
assert.equal(HEADLINE.mdbAdaptYoYDeltaBn, 8.3);
assert.equal(HEADLINE.mdbAdaptYoYPct, 31);
assert.equal(HEADLINE.oecdAdapt2024Bn, 34.7);
assert.equal(HEADLINE.needsLowBn, 310);
assert.equal(HEADLINE.needsHighBn, 365);
assert.equal(HEADLINE.h1InsuredNatCat2026Bn, 42);
assert.equal(HEADLINE.h1InsuredNatCat2025Bn, 91);
assert.equal(HEADLINE.protectionGap2025Bn, 424);
assert.equal(HEADLINE.mdb2030LmicAdaptBn, 42);
assert.ok(MDB_ADAPT_PATH.some((r) => r.year === 2025 && r.adaptBn === 35));
assert.equal(needsBn("low"), 310);
assert.ok(Math.abs(gapVsMdbBn("low") - (310 - 35)) < 0.01);

const root = process.cwd();
const slug = "adaptation-economics-update-202608";
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
  "adaptation-economics-update-202608-data.ts",
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AdaptationEconomicsUpdate202608Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "energy-adaptation-economics-update-202608-hero.png",
);

const markers = [
  "Vintage delta — OECD $34.7B (2024) → MDB LMIC $35B (2025, +31% YoY)",
  "MDB Adaptation Finance Jumps +31% to $35B",
];

function extractPostBody() {
  const postsSrc = fs.readFileSync(path.join(root, "src", "data", "posts.ts"), "utf8");
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
  ["mdbLmicAdapt2025Bn 35", dataSrc.includes("mdbLmicAdapt2025Bn: 35")],
  ["mdbAdaptYoYDeltaBn 8.3", dataSrc.includes("mdbAdaptYoYDeltaBn: 8.3")],
  ["oecdAdapt2024Bn 34.7", dataSrc.includes("oecdAdapt2024Bn: 34.7")],
  ["h1InsuredNatCat2026Bn 42", dataSrc.includes("h1InsuredNatCat2026Bn: 42")],
  ["Word count >= 1200", wordCount >= 1200],
  ["H2 count >= 6", h2Count >= 6],
  ["Internal links >= 2", internalLinks >= 2],
  ["Caveats section", body.includes("## Caveats")],
  ["Table markdown", body.includes("| Metric |")],
  ["viz has >=2 controls", /ToggleGroup/.test(dashboardSrc)],
  [
    "viz chart diversity",
    /BarChart/.test(dashboardSrc) &&
      /PieChart/.test(dashboardSrc) &&
      /ComposedChart|AreaChart/.test(dashboardSrc),
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
  const port = Number(process.env.SMOKE_PORT || 4188);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    const url = fs.existsSync(htmlPathNested)
      ? `http://127.0.0.1:${port}/blog/${slug}/`
      : `http://127.0.0.1:${port}/blog/${slug}.html`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`ok ${m}`);
    }
    for (const label of [
      "Vintage delta",
      "MDB path",
      "H1 damage",
      "Multi-ledger",
      "Gap levers",
      "Who pays",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Vintage delta" }).first().click();
    await page.getByRole("button", { name: /High \$365B/ }).first().click();
    await page.getByText("Prior vs newest", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("ok Needs scenario toggle");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.warn("Viz interaction warnings", audit.warnings);
    }
    console.log("ok viz interaction audit");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
