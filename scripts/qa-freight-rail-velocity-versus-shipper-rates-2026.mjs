/**
 * QA: freight-rail-velocity-versus-shipper-rates-2026
 * // viz-types: composed speed×dwell×rev, scatter, terminal lag bars, commodity pie, Class I recovery bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  CARRIER_ROWS,
  COMMODITY_SHARE,
  HEADLINE,
  QUARTERLY_TAPE,
  TERMINAL_ROWS,
  VIZ_MARKERS,
} from "../src/data/freight-rail-velocity-versus-shipper-rates-2026-data.ts";

assert.equal(HEADLINE.speedDropPeakTroughPct, 12);
assert.equal(HEADLINE.revPerCarRisePct, 28);
assert.equal(HEADLINE.revPerCar2026Index, 118);
assert.equal(HEADLINE.chicagoDwellPeakHrs, 38.5);
assert.ok(QUARTERLY_TAPE.length >= 20);
assert.ok(CARRIER_ROWS.length >= 6);
assert.ok(TERMINAL_ROWS.length >= 6);
assert.ok(COMMODITY_SHARE.length >= 5);
assert.ok(ANALYTICS.speedRevCorr < 0);
assert.ok(ANALYTICS.troughSpeed2022 < ANALYTICS.baselineSpeed2019);

const root = process.cwd();
const slug = "freight-rail-velocity-versus-shipper-rates-2026";
const markers = [...VIZ_MARKERS];

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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }

    const selects = page.locator("select");
    assert.ok((await selects.count()) >= 2, "expected >=2 select controls");
    await selects.nth(0).selectOption({ value: "scatter" });
    await page.waitForTimeout(250);
    await selects.nth(1).selectOption({ value: "crisis" });
    await page.waitForTimeout(250);
    await selects.nth(0).selectOption({ value: "terminals" });
    await page.waitForTimeout(250);
    await page.getByText("Corridor dwell lag map", { exact: false }).first().waitFor({ timeout: 10000 });
    await selects.nth(0).selectOption({ value: "carriers" });
    await page.waitForTimeout(250);
    await page.getByText("Class I speed recovery", { exact: false }).first().waitFor({ timeout: 10000 });
    console.log("✓ panel + era controls + lag/recovery panels");

    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log(`qa-${slug}: PASS`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
