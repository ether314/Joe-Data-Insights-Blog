/**
 * QA: adaptation-economics-update-2026q3
 * // viz-types: vintage grouped bars, area+line OECD flows w/ Glasgow ref, multi-ledger bars, residual pie, NCQG compare | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  OECD_ADAPT_FLOWS,
  gapVsOecdBn,
  needsBn,
} from "../src/data/adaptation-economics-update-2026q3-data.ts";

assert.equal(HEADLINE.oecdAdapt2024Bn, 34.7);
assert.equal(HEADLINE.oecdAdapt2023Bn, 33.6);
assert.equal(HEADLINE.oecdAdaptYoYDeltaBn, 1.1);
assert.equal(HEADLINE.unepFlows2023Bn, 26);
assert.equal(HEADLINE.needsLowBn, 310);
assert.equal(HEADLINE.needsHighBn, 365);
assert.equal(HEADLINE.glasgowShortfall2025Bn, 5.8);
assert.equal(HEADLINE.cpiAdapt2023Bn, 65);
assert.equal(HEADLINE.protectionGap2025Bn, 424);
assert.ok(OECD_ADAPT_FLOWS.some((r) => r.year === 2024 && r.oecdAdaptBn === 34.7));
assert.equal(needsBn("low"), 310);
assert.ok(Math.abs(gapVsOecdBn("low") - (310 - 34.7)) < 0.01);

const root = process.cwd();
const slug = "adaptation-economics-update-2026q3";
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
  "adaptation-economics-update-2026q3-data.ts",
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "AdaptationEconomicsUpdate2026q3Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "energy-adaptation-economics-update-2026q3-hero.png",
);

const markers = [
  "Vintage delta — AGR 2025 / UNEP $26B → OECD May 2026 $34.7B",
  "OECD Adaptation Finance Rises to $34.7B",
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
  ["oecdAdapt2024Bn 34.7", dataSrc.includes("oecdAdapt2024Bn: 34.7")],
  ["oecdAdaptYoYDeltaBn 1.1", dataSrc.includes("oecdAdaptYoYDeltaBn: 1.1")],
  ["unepFlows2023Bn 26", dataSrc.includes("unepFlows2023Bn: 26")],
  ["glasgowShortfall2025Bn 5.8", dataSrc.includes("glasgowShortfall2025Bn: 5.8")],
  ["Word count >= 1200", wordCount >= 1200],
  ["H2 count >= 6", h2Count >= 6],
  ["Internal links >= 2", internalLinks >= 2],
  ["Caveats section", body.includes("## Caveats")],
  ["Table markdown", body.includes("| Metric |")],
  ["viz has >=2 controls", /ToggleGroup/.test(dashboardSrc)],
  ["viz chart diversity", /BarChart/.test(dashboardSrc) && /PieChart/.test(dashboardSrc) && /ComposedChart|AreaChart/.test(dashboardSrc)],
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
      "OECD flows",
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
