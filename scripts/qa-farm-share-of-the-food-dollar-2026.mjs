/**
 * QA: farm-share-of-the-food-dollar-2026
 * // viz-types: area+line composed, horizontal bars, industry bars, pie, dual-axis composed, scatter, radar | layout: default
 * // smoke-marker: Headline — USDA ERS Food Dollar
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  HEADLINE,
  INDUSTRY_GROUP_BILL,
  MARKETING_BILL_TREND,
  PRICE_PATH,
  PRODUCT_FARM_SHARES,
} from "../src/data/farm-share-of-the-food-dollar-2026-data.ts";

assert.equal(HEADLINE.farmShareAtHome2024Cents, 18.5);
assert.equal(HEADLINE.farmShareAll2024Cents, 11.8);
assert.equal(HEADLINE.farmShareAway2024Cents, 7.1);
assert.equal(HEADLINE.marketingShare2024Cents, 88.2);
assert.equal(HEADLINE.farmValueAdded2024Cents, 6.7);
assert.ok(MARKETING_BILL_TREND.length >= 4);
assert.ok(PRODUCT_FARM_SHARES.length >= 10);
assert.ok(INDUSTRY_GROUP_BILL.length >= 8);
assert.ok(PRICE_PATH.length >= 4);
assert.equal(ANALYTICS.allFoodFarmDeltaCents, -0.3);

const root = process.cwd();
const slug = "farm-share-of-the-food-dollar-2026";
const markers = [
  "Headline — USDA ERS Food Dollar",
  "18.5¢ of every food-at-home dollar reaches the farm",
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
    await clickBtn(page, "Product farm ladder");
    await clickBtn(page, "Minimal processing");
    await clickBtn(page, "Heavy processing");
    await clickBtn(page, "All products");
    await clickBtn(page, "Industry group bill");
    await clickBtn(page, "CPI vs farm eggs");
    await clickBtn(page, "At-home vs away");
    await clickBtn(page, "At home");
    await clickBtn(page, "Away from home");
    await clickBtn(page, "All food");
    await clickBtn(page, "Marketing bill path");
    await clickBtn(page, "Including carried years");
    await clickBtn(page, "Disclosed years only");
    await clickBtn(page, "Including carried years");
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
