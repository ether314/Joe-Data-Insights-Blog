/**
 * QA: generic-price-declines-versus-manufacturer-exits-2026
 * // smoke-marker: Price decline vs exit lag
 * // viz-types: composed price×exits, shortage composed, lag scatter, class bars, class scatter, survivor area, root pie, exit bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL_TAPE,
  CLASS_ROWS,
  COHORT_PATH,
  HEADLINE,
  LAG_SCATTER,
  ROOT_CAUSES,
  VIZ_MARKERS,
} from "../src/data/generic-price-declines-versus-manufacturer-exits-2026-data.ts";

assert.equal(HEADLINE.oralSolidDropPct, 62);
assert.equal(HEADLINE.lagQuarters, 7);
assert.equal(HEADLINE.exitsPeakCount, 1840);
assert.equal(HEADLINE.exitsPeakYear, 2021);
assert.equal(HEADLINE.economicRootSharePct, 38);
assert.ok(ANNUAL_TAPE.length >= 14);
assert.ok(LAG_SCATTER.length >= 10);
assert.ok(CLASS_ROWS.length >= 6);
assert.ok(COHORT_PATH.length >= 6);
assert.ok(ROOT_CAUSES.length >= 4);
assert.ok(ANALYTICS.priceExitCorrLag < -0.5);
assert.ok(ANALYTICS.oralSolidTrough < ANALYTICS.oralSolidPeak);
assert.ok(ANALYTICS.exitsPeak > ANALYTICS.exits2015);

const root = process.cwd();
const slug = "generic-price-declines-versus-manufacturer-exits-2026";
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
    await selects.nth(0).selectOption({ value: "lag" });
    await page.waitForTimeout(250);
    await selects.nth(2).selectOption({ value: "steep-decline" });
    await page.waitForTimeout(250);
    await page.getByText("Price at t vs exits at t+~7Q", { exact: false }).first().waitFor({ timeout: 10000 });
    await selects.nth(0).selectOption({ value: "classes" });
    await page.waitForTimeout(250);
    await page.getByText("Price drop vs exit and shortage intensity by class", { exact: false }).first().waitFor({ timeout: 10000 });
    await selects.nth(0).selectOption({ value: "structure" });
    await page.waitForTimeout(250);
    await page.getByText("Survivor cohort and volume concentration", { exact: false }).first().waitFor({ timeout: 10000 });
    await selects.nth(1).selectOption({ value: "injectable" });
    await page.waitForTimeout(250);
    console.log("✓ panel + segment + era controls + lag/classes/structure panels");

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
