/**
 * QA: macro-growth-trade-concentration-2026
 * // viz-types: Lorenz area+line, ranked bars, export pie, lens scatter, price scatter, triad lines | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  GROWTH_CONTRIB_SHARES,
  HEADLINE,
  TRADE_GROWTH_SHARES,
} from "../src/data/macro-growth-trade-concentration-2026-data.ts";

assert.equal(HEADLINE.top1GrowthContribPct, 32);
assert.equal(HEADLINE.top3GrowthContribPct, 55);
assert.equal(HEADLINE.top1TradeGrowthSharePct, 71);
assert.equal(HEADLINE.top1PppSharePct, 19);
assert.equal(HEADLINE.top3ExportSharePct, 29);
assert.equal(GROWTH_CONTRIB_SHARES[0].id, "chn");
assert.equal(GROWTH_CONTRIB_SHARES[0].sharePct, 31.8);
assert.equal(TRADE_GROWTH_SHARES[0].id, "asia");
assert.equal(TRADE_GROWTH_SHARES[0].sharePct, 71);

const root = process.cwd();
const slug = "macro-growth-trade-concentration-2026";
const markers = [
  "Growth, trade & prices — concentration lens",
  "Cumulative share vs equal split",
  "World PPP growth contribution ladder",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(150);
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
    await page.waitForSelector(
      '[data-viz="macro-growth-trade-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "PPP stock");
    await clickBtn(page, "Trade-growth regions");
    await clickBtn(page, "Export value");
    await clickBtn(page, "Growth contribution");
    await clickBtn(page, "GDP / volume");
    await clickBtn(page, "Cumulative");
    await clickBtn(page, "Trade growth");
    await clickBtn(page, "Equal split");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-macro-growth-trade-concentration-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
