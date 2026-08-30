/**
 * QA: motor-vehicle-insurance-cpi-versus-median-weekly-earnings-2026
 * // viz-types: composed line, area gap, yoy bars, annual bars, burden line, scatter | layout: default
 * // smoke-marker: Auto-insurance index vs wage index
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL,
  HEADLINE,
  MONTHLY,
  QUARTERS,
  TABLE_ROWS,
} from "../src/data/motor-vehicle-insurance-cpi-versus-median-weekly-earnings-2026-data.ts";

assert.equal(HEADLINE.insuranceIndex, 153.5);
assert.equal(HEADLINE.wageIndex, 137.2);
assert.equal(HEADLINE.allItemsIndex, 130.7);
assert.equal(HEADLINE.insuranceWageGapPp, 16.3);
assert.equal(HEADLINE.insuranceBurden, 111.9);
assert.equal(HEADLINE.maintenanceIndex, 153);
assert.equal(HEADLINE.latestQuarter, "2026Q2");
assert.equal(HEADLINE.peakGapPp, 26.1);
assert.equal(HEADLINE.peakGapLabel, "2025Q1");
assert.ok(QUARTERS.length >= 28);
assert.ok(MONTHLY.length >= 85);
assert.ok(ANNUAL.length >= 7);
assert.ok(TABLE_ROWS.length >= 28);

const root = process.cwd();
const slug = "motor-vehicle-insurance-cpi-versus-median-weekly-earnings-2026";
const markers = [
  "Auto-insurance index vs wage index",
  "Economics · Auto-insurance index vs wage index",
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
    await clickBtn(page, "Premium wedge");
    await clickBtn(page, "YoY pulse");
    await clickBtn(page, "Annual gap");
    await clickBtn(page, "Burden path");
    await clickBtn(page, "45° scatter");
    await clickBtn(page, "Index race");
    await page.locator("select").nth(0).selectOption("ins-wages");
    await page.waitForTimeout(200);
    await page.locator("select").nth(1).selectOption("post2022");
    await page.waitForTimeout(200);
    await page.locator("select").nth(0).selectOption("full");
    await page.locator("select").nth(1).selectOption("full");
    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
