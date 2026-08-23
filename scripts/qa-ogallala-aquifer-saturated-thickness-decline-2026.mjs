/**
 * QA: ogallala-aquifer-saturated-thickness-decline-2026
 * // viz-types: county decline bars, years-to-floor bars, mining scatter, state decline bars, era cumulative line, GMD remaining, sat-loss bands | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTY_PANEL,
  HEADLINE,
  STATE_LEVEL_CHANGE,
  yearsToFloor,
} from "../src/data/ogallala-aquifer-saturated-thickness-decline-2026-data.ts";

assert.equal(HEADLINE.areaWeightedDeclineFtPredevTo2019, 16.5);
assert.equal(HEADLINE.texasAreaWeightedDeclineFt, 44.1);
assert.equal(HEADLINE.fastestYearsToFloor, 12);
assert.equal(HEADLINE.fastestDeclineFtPerYr, 2.4);
assert.ok(STATE_LEVEL_CHANGE.length === 8);
assert.ok(COUNTY_PANEL.length >= 10);
const texas = STATE_LEVEL_CHANGE.find((s) => s.abbr === "TX");
assert.ok(texas && texas.predevTo2019Ft === -44.1);
const hale = COUNTY_PANEL.find((c) => c.id === "hale-tx");
assert.ok(hale);
assert.equal(yearsToFloor(hale.remainingSatFt, hale.declineFtPerYr), 11.7);
// Headline uses rounded ~12 yr
assert.ok(Math.abs(yearsToFloor(hale.remainingSatFt, hale.declineFtPerYr) - 11.7) < 0.01);

const root = process.cwd();
const slug = "ogallala-aquifer-saturated-thickness-decline-2026";
const markers = [
  "High Plains · saturated-thickness change",
  "Saturated-thickness change",
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
    await clickBtn(page, "County decline");
    await clickBtn(page, "Southern");
    await clickBtn(page, "Years to floor");
    await clickBtn(page, "Mining scatter");
    await clickBtn(page, "Central");
    await clickBtn(page, "State ledger");
    await clickBtn(page, "Era path");
    await clickBtn(page, "All regions");
    await clickBtn(page, "County decline");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 14,
    });
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
