/**
 * QA: sports-admissions-cpi-versus-median-weekly-earnings-2026
 * // viz-types: composed line, area gap, burden line, radar, scatter, slope | layout: default
 * // smoke-marker: Ticket index vs paycheck
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
  MONTHLY,
  MONTHLY_YOY,
  QUARTERLY,
  SUMMARY_TABLE,
} from "../src/data/sports-admissions-cpi-versus-median-weekly-earnings-2026-data.ts";

assert.equal(HEADLINE.sportsIndex, 109.9);
assert.equal(HEADLINE.wageIndex, 137.2);
assert.equal(HEADLINE.allItemsIndex, 130.7);
assert.equal(HEADLINE.sportsWageGapPp, -27.3);
assert.equal(HEADLINE.sportsBurden, 80.1);
assert.equal(HEADLINE.latestQuarter, "2026Q2");
assert.ok(QUARTERLY.length >= 26);
assert.ok(MONTHLY.length >= 70);
assert.ok(MONTHLY_YOY.length >= 50);
assert.ok(ANNUAL.length >= 7);
assert.equal(SUMMARY_TABLE.length, ANNUAL.length);
assert.equal(ANALYTICS.smokeMarker, "Ticket index vs paycheck");
assert.equal(QUARTERLY.at(-1)?.label, "2026Q2");

const root = process.cwd();
const slug = "sports-admissions-cpi-versus-median-weekly-earnings-2026";
const markers = [
  "Ticket index vs paycheck",
  "Economics · Ticket index vs paycheck",
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
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Gap waterline");
    await clickBtn(page, "Ticket minutes");
    await clickBtn(page, "Seasonal pulse");
    await clickBtn(page, "Wage scatter");
    await clickBtn(page, "2019 slope");
    await clickBtn(page, "Sports + wages");
    await clickBtn(page, "Venue reopen");
    await clickBtn(page, "All three");
    await clickBtn(page, "Since 2019");
    await clickBtn(page, "Index race");
    await auditVizInteractions(page, { slug });
    console.log("✓ sports-admissions-cpi-versus-median-weekly-earnings-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
