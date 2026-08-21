/**
 * QA: consumer-finance-markets-geography-2026
 * // viz-types: region bars+pie, state ladder, product stacked, debt×risk scatter, cash capacity scatter, meter compare | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CENSUS_REGIONS,
  HEADLINE,
  PRODUCT_GEO,
  TOP_STATES,
} from "../src/data/consumer-finance-markets-geography-2026-data.ts";

assert.equal(HEADLINE.top1RegionSharePct, 28);
assert.equal(HEADLINE.top1RegionLabel, "West");
assert.equal(HEADLINE.top1StateSharePct, 15.2);
assert.equal(HEADLINE.top1StateLabel, "California");
assert.equal(HEADLINE.top1CardDelinqPct, 8.4);
assert.equal(HEADLINE.top1DepositRegionSharePct, 32);
assert.equal(HEADLINE.totalDebtTn, 18.926);
assert.ok(CENSUS_REGIONS.length === 4);
assert.equal(CENSUS_REGIONS[0].region, "West");
assert.equal(TOP_STATES[0].abbrev, "CA");
assert.ok(PRODUCT_GEO.length >= 4);
const debtSum = CENSUS_REGIONS.reduce((s, r) => s + r.sharePct, 0);
assert.ok(Math.abs(debtSum - 100) < 0.2);

const root = process.cwd();
const slug = "consumer-finance-markets-geography-2026";
const markers = [
  "Consumer finance — geography lens",
  "Where household debt, cash, and card stress sit on the US map",
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
  const port = Number(process.env.SMOKE_PORT || 4188);
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
      '[data-viz="consumer-finance-markets-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Regions");
    await clickBtn(page, "Debt $");
    await clickBtn(page, "vs Pop");
    await clickBtn(page, "Share %");
    await clickBtn(page, "States");
    await clickBtn(page, "South");
    await clickBtn(page, "All");
    await clickBtn(page, "Products");
    await clickBtn(page, "Top-1 by product");
    await clickBtn(page, "Regional stack");
    await clickBtn(page, "Risk & cash");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit", audit.summary ?? "ok");
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed", err);
  process.exit(1);
});
