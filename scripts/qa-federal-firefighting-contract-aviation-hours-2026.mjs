/**
 * QA: federal-firefighting-contract-aviation-hours-2026
 * // viz-types: stacked area, share line, grouped rate bars, cost pie, hours×$/hr scatter, Type-1 bars | layout: default
 * // smoke-marker: Exclusive-use vs CWN hours
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  LAT_VLAT_ANNUAL,
  dualStackSeries,
  eraSummary,
  exuSharePct,
  latVlatTotalHours,
  rateCompareBars,
  type1Stack,
} from "../src/data/federal-firefighting-contract-aviation-hours-2026-data.ts";

assert.equal(HEADLINE.cy2021ExuSharePct, 81.4);
assert.equal(HEADLINE.cy2020ExuSharePct, 53.9);
assert.equal(HEADLINE.cwnDailyPremiumPct, 54);
assert.equal(HEADLINE.cy2021FlightCostPerHour, 8715);
assert.ok(LAT_VLAT_ANNUAL.length === 5);
assert.equal(LAT_VLAT_ANNUAL[0].cy, 2017);
assert.equal(LAT_VLAT_ANNUAL[4].cy, 2021);
assert.ok(Math.round(exuSharePct(LAT_VLAT_ANNUAL[4]) * 10) / 10 === 81.4);
assert.ok(latVlatTotalHours(LAT_VLAT_ANNUAL[3]) === 8575);
assert.ok(dualStackSeries().length === 5);
assert.ok(eraSummary().length === 3);
assert.ok(rateCompareBars().length === 2);
assert.ok(type1Stack().length === 2);
assert.equal(type1Stack()[1].cwnHours, 23228);

const root = process.cwd();
const slug = "federal-firefighting-contract-aviation-hours-2026";
const markers = [
  "Exclusive-use vs CWN hours",
  "81.4% of LAT/VLAT hours flew on exclusive-use contracts",
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
  const port = Number(process.env.SMOKE_PORT || 4180);
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
    await clickBtn(page, "EXU share");
    await clickBtn(page, "Type 1 helos");
    await clickBtn(page, "Rate spread");
    await clickBtn(page, "Cost mix");
    await clickBtn(page, "Hours × $/hr");
    await clickBtn(page, "2020 surge");
    await clickBtn(page, "Hour stack");
    await clickBtn(page, "CY2021");
    await clickBtn(page, "All eras");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
