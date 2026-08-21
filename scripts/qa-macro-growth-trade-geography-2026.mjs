/**
 * QA: macro-growth-trade-geography-2026
 * // viz-types: region bars+pie, growth×CPI scatter, trade corridor bars+donut, Asia split stacked, price-regime pie+bars, meter compare | layout: default
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
} from "../src/data/macro-growth-trade-geography-2026-data.ts";

assert.equal(HEADLINE.asiaGrowthContribPct, 54);
assert.equal(HEADLINE.asiaTradeGrowthSharePct, 71);
assert.ok(HEADLINE.nAmericaPppSharePct >= 17);
assert.equal(HEADLINE.elevatedCpiGdpSharePct, 38);
assert.equal(REGION_SHARES.length, 6);
assert.equal(TRADE_CORRIDORS.length, 4);
assert.equal(PRICE_REGIMES.length, 4);
const tradeSum = TRADE_CORRIDORS.reduce((s, t) => s + t.sharePct, 0);
assert.equal(tradeSum, 100);

const root = process.cwd();
const slug = "macro-growth-trade-geography-2026";
const markers = [
  "Growth, trade & prices — geography lens",
  "Where growth, trade, and prices land on the map",
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
    await page.waitForSelector(
      '[data-viz="macro-growth-trade-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Regions");
    await clickBtn(page, "PPP stock");
    await clickBtn(page, "Growth");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "All");
    await clickBtn(page, "Trade");
    await clickBtn(page, "Prices");
    await clickBtn(page, "Regions");
    console.log("→ auditVizInteractions");
    const audit = await Promise.race([
      auditVizInteractions(page, { slug, maxCharts: 3, maxButtons: 6 }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("auditVizInteractions timeout")), 90000),
      ),
    ]);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("⚠ warnings:", audit.warnings.join("; "));
    }
    console.log("✓ viz interaction audit");
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
