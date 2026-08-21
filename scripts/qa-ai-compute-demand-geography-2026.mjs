/**
 * QA: ai-compute-demand-geography-2026
 * // viz-types: region bars+pie, metro capacity/growth/pipeline bars, capacity×growth scatter, token origin pie+brand bars, pipeline vs live grouped bars, stacked area path, meter compare, owner HQ bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  METRO_MARKETS,
  REGION_CAPACITY,
  TOKEN_ORIGINS,
} from "../src/data/ai-compute-demand-geography-2026-data.ts";

assert.equal(HEADLINE.top1RegionSharePct, 45);
assert.equal(HEADLINE.top1RegionLabel, "United States");
assert.equal(HEADLINE.tokenChinaOriginPct, 61.8);
assert.equal(HEADLINE.dualHubSharePct, 17);
assert.equal(HEADLINE.usPipelineSharePct, 54);
assert.equal(HEADLINE.pipelineSites, 915);
assert.equal(HEADLINE.top3RegionSharePct, 77);
assert.ok(REGION_CAPACITY.length >= 6);
assert.equal(REGION_CAPACITY[0].region, "United States");
assert.equal(METRO_MARKETS[0].id, "nva");
assert.equal(TOKEN_ORIGINS[0].origin, "China");
const regionShareSum = REGION_CAPACITY.reduce((s, r) => s + r.sharePct, 0);
assert.equal(regionShareSum, 100);
const tokenSum = TOKEN_ORIGINS.reduce((s, t) => s + t.sharePct, 0);
assert.ok(Math.abs(tokenSum - 100) < 0.05);

const root = process.cwd();
const slug = "ai-compute-demand-geography-2026";
const markers = [
  "AI compute demand — geography lens",
  "Where tokens, sites, and capacity land on the map",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(200);
}

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4180);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(
      '[data-viz="ai-compute-demand-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Regions");
    await clickBtn(page, "GW draw");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Metros");
    await clickBtn(page, "YoY growth");
    await clickBtn(page, "Pipeline wt");
    await clickBtn(page, "Capacity %");
    await clickBtn(page, "US");
    await clickBtn(page, "All");
    await clickBtn(page, "Tokens");
    await clickBtn(page, "China");
    await clickBtn(page, "US");
    await clickBtn(page, "All");
    await clickBtn(page, "Pipeline");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
