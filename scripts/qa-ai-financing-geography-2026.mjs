/**
 * QA: ai-financing-geography-2026
 * // viz-types: region bars+pie, facility ladder, stacked area path, HQ×asset gap, currency books, ETF domicile, credit×risk scatter, meter compare | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  FACILITY_REGIONS,
  HEADLINE,
  REGION_ROWS,
  US_CORRIDORS,
} from "../src/data/ai-financing-geography-2026-data.ts";

assert.equal(HEADLINE.top1RegionSharePct, 72);
assert.equal(HEADLINE.top1RegionLabel, "United States");
assert.equal(HEADLINE.hsIgUsHqSharePct, 100);
assert.equal(HEADLINE.projectUsSharePct, 52);
assert.equal(HEADLINE.usdBookSharePct, 78);
assert.equal(HEADLINE.etfUsListingSharePct, 91);
assert.equal(HEADLINE.fundedStockBn, 1065);
assert.ok(REGION_ROWS.length >= 6);
assert.equal(REGION_ROWS[0].region, "United States");
assert.equal(US_CORRIDORS[0].id, "nova");
const regionSum = REGION_ROWS.reduce((s, r) => s + r.amountBn, 0);
assert.equal(regionSum, 1065);
const facilitySum = FACILITY_REGIONS.reduce((s, r) => s + r.amountBn, 0);
assert.equal(facilitySum, 250);
const usCorridorSum = US_CORRIDORS.reduce((s, c) => s + c.projectBn, 0);
assert.equal(usCorridorSum, 130);

const root = process.cwd();
const slug = "ai-financing-geography-2026";
const markers = [
  "AI financing — geography lens",
  "Where AI credit, books, and ETF flows sit on the map",
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
      '[data-viz="ai-financing-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Regions");
    await clickBtn(page, "Dollars");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Facilities");
    await clickBtn(page, "Of US %");
    await clickBtn(page, "YoY growth");
    await clickBtn(page, "Risk score");
    await clickBtn(page, "Global %");
    await clickBtn(page, "Books & ETFs");
    await clickBtn(page, "ETF domicile");
    await clickBtn(page, "Currency books");
    await clickBtn(page, "HQ vs assets");
    await clickBtn(page, "Europe");
    await clickBtn(page, "All");
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
