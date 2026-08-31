/**
 * QA: auto-insurance-cpi-versus-used-car-and-repair-prices-2026
 * // viz-types: composed triple line, area decoupling, area repair wedge, scatter, lag bars, epoch bars, yoy multi-line | layout: default
 * // smoke-marker: Insurance vs used-car and repair indexes
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
  EPOCH_BARS,
  HEADLINE,
  LAG_CORR,
  MONTHLY,
  QUARTERLY,
  SUMMARY_TABLE,
} from "../src/data/auto-insurance-cpi-versus-used-car-and-repair-prices-2026-data.ts";

assert.equal(HEADLINE.latestLabel, "2026-07");
assert.equal(HEADLINE.insuranceIdx, 149.9);
assert.equal(HEADLINE.usedCarsIdx, 132.1);
assert.equal(HEADLINE.bodyWorkIdx, 144.5);
assert.equal(HEADLINE.insUsedGapPp, 17.8);
assert.equal(HEADLINE.corr, 0.55);
assert.equal(HEADLINE.bestLag.lag, 6);
assert.equal(HEADLINE.bestLag.corr, 0.629);
assert.ok(MONTHLY.length >= 85);
assert.ok(QUARTERLY.length >= 28);
assert.ok(ANNUAL.length >= 7);
assert.equal(SUMMARY_TABLE.length, ANNUAL.length);
assert.equal(LAG_CORR.length, 7);
assert.equal(EPOCH_BARS.length, 5);
assert.equal(ANALYTICS.smokeMarker, "Insurance vs used-car and repair indexes");
assert.equal(MONTHLY.at(-1)?.label, "2026-07");

const root = process.cwd();
const slug = "auto-insurance-cpi-versus-used-car-and-repair-prices-2026";
const markers = [
  "Insurance vs used-car and repair indexes",
  "Economics · Insurance vs used-car and repair indexes",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Decoupling");
    await clickBtn(page, "Repair wedge");
    await clickBtn(page, "Used scatter");
    await clickBtn(page, "Lag bars");
    await clickBtn(page, "Epoch bars");
    await clickBtn(page, "YoY pulse");
    await clickBtn(page, "Insurance");
    await clickBtn(page, "Spike era");
    await clickBtn(page, "All three");
    await clickBtn(page, "Since 2019");
    await clickBtn(page, "Triple track");
    await auditVizInteractions(page, { slug });
    console.log("✓ auto-insurance-cpi-versus-used-car-and-repair-prices-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
