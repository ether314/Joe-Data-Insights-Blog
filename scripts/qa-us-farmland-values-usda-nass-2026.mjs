/**
 * QA: us-farmland-values-usda-nass-2026
 * // viz-types: dual-axis composed path, regional YoY grouped bars, cropland×pasture scatter,
 * //            premium horizontal bars, lead-share pie, state ladder | layout: default
 * // smoke-marker: USDA NASS Land Values · regional cropland & pasture
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  NATIONAL_PATH,
  REGIONS,
  STATE_SPOTLIGHTS,
} from "../src/data/us-farmland-values-usda-nass-2026-data.ts";

assert.equal(HEADLINE.usCropland2025, 5830);
assert.equal(HEADLINE.usPasture2025, 1920);
assert.equal(HEADLINE.fastestPastureRegion, "Northern Plains");
assert.equal(HEADLINE.fastestPastureYoyPct, 7.6);
assert.equal(HEADLINE.fastestCroplandRegion, "Lake States");
assert.equal(HEADLINE.fastestCroplandYoyPct, 7.3);
assert.ok(NATIONAL_PATH.length >= 10);
assert.ok(REGIONS.length >= 10);
assert.ok(STATE_SPOTLIGHTS.length >= 6);

const root = process.cwd();
const slug = "us-farmland-values-usda-nass-2026";
const markers = [
  "USDA NASS Land Values · regional cropland & pasture",
  "Northern Plains pasture",
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
  const port = Number(process.env.SMOKE_PORT || 4186);
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
    await clickBtn(page, "Regional YoY");
    await clickBtn(page, "Pasture YoY");
    await clickBtn(page, "Cropland YoY");
    await clickBtn(page, "Pasture led");
    await clickBtn(page, "Cropland led");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Growth scatter");
    await clickBtn(page, "Crop–pasture gap");
    await clickBtn(page, "Who leads");
    await clickBtn(page, "State leaders");
    await clickBtn(page, "National path");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
