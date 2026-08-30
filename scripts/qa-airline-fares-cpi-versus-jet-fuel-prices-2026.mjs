/**
 * QA: airline-fares-cpi-versus-jet-fuel-prices-2026
 * // viz-types: composed dual line, area gap, pass-through line, scatter, lag bars, epoch bars, yoy | layout: default
 * // smoke-marker: Airfare index vs jet fuel
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
  HEADLINE,
  LAG_CORR,
  MONTHLY,
  MONTHLY_YOY,
  QUARTERLY,
  SUMMARY_TABLE,
} from "../src/data/airline-fares-cpi-versus-jet-fuel-prices-2026-data.ts";

assert.equal(HEADLINE.latestLabel, "2026-07");
assert.equal(HEADLINE.fareIdx, 117.2);
assert.equal(HEADLINE.fuelIdx, 181.2);
assert.equal(HEADLINE.fuelUsd, 3.403);
assert.equal(HEADLINE.gapPp, -64);
assert.equal(HEADLINE.corr, 0.724);
assert.equal(HEADLINE.bestLag.lag, 1);
assert.equal(HEADLINE.bestLag.corr, 0.774);
assert.ok(MONTHLY.length >= 85);
assert.ok(MONTHLY_YOY.length >= 70);
assert.ok(QUARTERLY.length >= 28);
assert.ok(ANNUAL.length >= 7);
assert.equal(SUMMARY_TABLE.length, ANNUAL.length);
assert.equal(LAG_CORR.length, 7);
assert.equal(ANALYTICS.smokeMarker, "Airfare index vs jet fuel");
assert.equal(MONTHLY.at(-1)?.label, "2026-07");

const root = process.cwd();
const slug = "airline-fares-cpi-versus-jet-fuel-prices-2026";
const markers = [
  "Airfare index vs jet fuel",
  "Transport & Logistics · Airfare index vs jet fuel",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Gap ribbon");
    await clickBtn(page, "Pass-through");
    await clickBtn(page, "Fuel scatter");
    await clickBtn(page, "Lag bars");
    await clickBtn(page, "Epoch bars");
    await clickBtn(page, "YoY swings");
    await clickBtn(page, "Fares only");
    await clickBtn(page, "Spike era");
    await clickBtn(page, "Both");
    await clickBtn(page, "Since 2019");
    await clickBtn(page, "Dual track");
    await auditVizInteractions(page, { slug });
    console.log("✓ airline-fares-cpi-versus-jet-fuel-prices-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
