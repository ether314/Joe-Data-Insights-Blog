/**
 * QA: macro-growth-trade-geography-2026q3
 * // viz-types: mismatch bars+meters, region dual+pie, GDP×growth scatter, CPB area+line, trade bars+donut, Asia base-vs-sens stacked, price-regime pie+bars, vintage slope | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  REGION_SHARES,
  TRADE_CORRIDORS,
  PRICE_REGIMES,
  CPB_FLOW_PATH,
  VINTAGE_SLOPE,
} from "../src/data/macro-growth-trade-geography-2026q3-data.ts";

assert.equal(HEADLINE.asiaGrowthContribPct, 54);
assert.equal(HEADLINE.asiaTradeGrowthSharePct, 71);
assert.equal(HEADLINE.asiaGrowthSensPct, 51);
assert.equal(HEADLINE.asiaGrowthSensDeltaPp, -3);
assert.equal(HEADLINE.chinaGdpQ2Yoy, 4.3);
assert.equal(HEADLINE.usGdpQ2Saar, 1.5);
assert.equal(HEADLINE.elevatedCpiGdpSharePct, 38);
assert.equal(REGION_SHARES.length, 6);
assert.equal(TRADE_CORRIDORS.length, 4);
assert.equal(PRICE_REGIMES.length, 4);
assert.equal(CPB_FLOW_PATH.length, 3);
assert.equal(VINTAGE_SLOPE.length, 2);
const tradeSum = TRADE_CORRIDORS.reduce((s, t) => s + t.sharePct, 0);
assert.equal(tradeSum, 100);

const root = process.cwd();
const slug = "macro-growth-trade-geography-2026q3";
const markers = [
  "Q3 2026 geography lens · growth · trade · prices",
  "Stock–growth mismatch by region",
];

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
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    for (const label of ["Mismatch", "Regions", "Trade + flow", "Prices + Asia"]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Regions" }).first().click();
    await page.getByRole("button", { name: "Q2 sens." }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Regions Q2 sens. toggle");
    await page.getByRole("button", { name: "Trade + flow" }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Trade + flow view");
    await page.getByRole("button", { name: "Prices + Asia" }).first().click();
    await page.getByRole("button", { name: "Q2 sens." }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Prices Asia lens toggle");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("⚠ warnings:", audit.warnings.join("; "));
    }
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
