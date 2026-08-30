/**
 * QA: food-at-home-cpi-versus-typical-worker-wages-2026
 * // viz-types: composed dual line, area gap, horizontal category bars, APU multi-line, home-vs-away area+line, epoch bars, wage scatter | layout: default
 * // smoke-marker: Food-at-home index vs wages
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL,
  APU_BASKET,
  CATEGORY_LATEST,
  EPOCH_BARS,
  HEADLINE,
  MONTHLY,
  MONTHLY_YOY,
  QUARTERS,
  SUMMARY_TABLE,
} from "../src/data/food-at-home-cpi-versus-typical-worker-wages-2026-data.ts";

assert.equal(HEADLINE.latestQuarter, "2026Q02");
assert.equal(HEADLINE.foodIdx, 132.8);
assert.equal(HEADLINE.wageIdx, 137.2);
assert.equal(HEADLINE.awayIdx, 138.8);
assert.equal(HEADLINE.allIdx, 130.7);
assert.equal(HEADLINE.gapPp, -4.3);
assert.equal(HEADLINE.peakGapPp, 5.6);
assert.equal(HEADLINE.peakGapLabel, "2022Q04");
assert.equal(HEADLINE.wageUsd, 1258);
assert.equal(HEADLINE.latestMonth, "2026-07");
assert.ok(MONTHLY.length >= 85);
assert.ok(MONTHLY_YOY.length >= 70);
assert.ok(QUARTERS.length >= 28);
assert.ok(ANNUAL.length >= 7);
assert.equal(SUMMARY_TABLE.length, ANNUAL.length);
assert.equal(EPOCH_BARS.length, 4);
assert.equal(CATEGORY_LATEST.length, 6);
assert.equal(APU_BASKET.length, 3);
assert.equal(ANALYTICS.smokeMarker, "Food-at-home index vs wages");
assert.equal(QUARTERS.at(-1)?.label, "2026Q02");

const root = process.cwd();
const slug = "food-at-home-cpi-versus-typical-worker-wages-2026";
const markers = [
  "Food-at-home index vs wages",
  "Economics · Food-at-home index vs wages",
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
  const port = Number(process.env.SMOKE_PORT || 4184);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Gap ribbon");
    await clickBtn(page, "Shelf ladder");
    await clickBtn(page, "Carton path");
    await clickBtn(page, "Home vs away");
    await clickBtn(page, "Epoch bars");
    await clickBtn(page, "Wage scatter");
    await clickBtn(page, "+ Away");
    await clickBtn(page, "Spike era");
    await clickBtn(page, "Food + wages");
    await clickBtn(page, "Since 2019");
    await clickBtn(page, "Dual track");
    await auditVizInteractions(page, { slug });
    console.log("✓ food-at-home-cpi-versus-typical-worker-wages-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
