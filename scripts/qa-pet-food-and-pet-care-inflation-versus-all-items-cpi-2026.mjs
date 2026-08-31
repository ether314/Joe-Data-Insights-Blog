/**
 * QA: pet-food-and-pet-care-inflation-versus-all-items-cpi-2026
 * // viz-types: line triple-track, area gap ribbons, composed YoY, epoch bars, scatter, burden lines | layout: default
 * // smoke-marker: Pet-food and pet-care indexes vs all-items
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
  EPOCHS,
  HEADLINE,
  MONTHLY,
  MONTHLY_YOY,
} from "../src/data/pet-food-and-pet-care-inflation-versus-all-items-cpi-2026-data.ts";

assert.equal(HEADLINE.latestPeriod, "2026-07");
assert.equal(HEADLINE.foodIdx, 141.2);
assert.equal(HEADLINE.careIdx, 147.56);
assert.equal(HEADLINE.allIdx, 132.66);
assert.equal(HEADLINE.foodGapPp, 8.54);
assert.equal(HEADLINE.careGapPp, 14.9);
assert.ok(MONTHLY.length >= 85);
assert.ok(MONTHLY_YOY.length >= 70);
assert.ok(ANNUAL.length >= 7);
assert.equal(EPOCHS.length, 4);
assert.equal(
  ANALYTICS.smokeMarker,
  "Pet-food and pet-care indexes vs all-items",
);
assert.ok(HEADLINE.foodIdx > HEADLINE.allIdx);
assert.ok(HEADLINE.careIdx > HEADLINE.allIdx);

const root = process.cwd();
const slug = "pet-food-and-pet-care-inflation-versus-all-items-cpi-2026";
const markers = ["Pet-food and pet-care indexes vs all-items"];

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
  const port = Number(process.env.SMOKE_PORT || 4182);
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
    }
    for (const name of [
      "Gap ribbons",
      "YoY pace",
      "Epoch bars",
      "Scatter",
      "Burden ratio",
      "Triple track",
    ]) {
      await clickBtn(page, name);
    }
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
