/**
 * QA: trucking-spot-rates-versus-carrier-exits-2026
 * // smoke-marker: Revocations per rate trough
 * // viz-types: composed spot×exits, lag scatter, exit pie, tier bars, concentration area, regional composed | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  CONCENTRATION_PATH,
  FLEET_TIERS,
  HEADLINE,
  LAG_SCATTER,
  QUARTERLY_TAPE,
  REGION_EXITS,
  VIZ_MARKERS,
} from "../src/data/trucking-spot-rates-versus-carrier-exits-2026-data.ts";

assert.equal(HEADLINE.vanSpotDropPct, 38);
assert.equal(HEADLINE.vanSpotPeak, 2.86);
assert.equal(HEADLINE.vanSpotTrough, 1.77);
assert.equal(HEADLINE.lagQuarters, 2);
assert.equal(HEADLINE.top1PctPowerShare, 42);
assert.ok(QUARTERLY_TAPE.length >= 20);
assert.ok(FLEET_TIERS.length >= 5);
assert.ok(REGION_EXITS.length >= 5);
assert.ok(LAG_SCATTER.length >= 15);
assert.ok(CONCENTRATION_PATH.length >= 6);
assert.ok(ANALYTICS.spotRevCorrLag2 < -0.5);
assert.ok(ANALYTICS.vanTrough < ANALYTICS.vanPeak);
assert.ok(ANALYTICS.revocationsPeakExit > ANALYTICS.revocationsAtPeak);

const root = process.cwd();
const slug = "trucking-spot-rates-versus-carrier-exits-2026";
const markers = [...VIZ_MARKERS];

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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }

    const selects = page.locator("select");
    assert.ok((await selects.count()) >= 2, "expected >=2 select controls");
    await selects.nth(0).selectOption({ value: "lag" });
    await page.waitForTimeout(250);
    await selects.nth(2).selectOption({ value: "bust" });
    await page.waitForTimeout(250);
    await page.getByText("Spot at t vs exits at t+2", { exact: false }).first().waitFor({ timeout: 10000 });
    await selects.nth(0).selectOption({ value: "tiers" });
    await page.waitForTimeout(250);
    await page.getByText("Survivor concentration path", { exact: false }).first().waitFor({ timeout: 10000 });
    await selects.nth(0).selectOption({ value: "regions" });
    await page.waitForTimeout(250);
    await page.getByText("Regional exit intensity", { exact: false }).first().waitFor({ timeout: 10000 });
    await selects.nth(1).selectOption({ value: "reefer" });
    await page.waitForTimeout(250);
    console.log("✓ panel + equipment + era controls + lag/tiers/regions panels");

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
