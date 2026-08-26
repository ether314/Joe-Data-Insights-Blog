/**
 * QA: coffee-and-carbonated-drink-cpi-versus-typical-wages-2026
 * // viz-types: composed line, area gap, burden line, yoy heat+line, horizontal bar, grouped bar | layout: default
 * // smoke-marker: Coffee vs wage index race
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
} from "../src/data/coffee-and-carbonated-drink-cpi-versus-typical-wages-2026-data.ts";

assert.equal(HEADLINE.coffeeIndex, 156.3);
assert.equal(HEADLINE.sodaIndex, 123.9);
assert.equal(HEADLINE.wageIndex, 137.2);
assert.equal(HEADLINE.coffeeWageGapPp, 19.1);
assert.equal(HEADLINE.sodaWageGapPp, -13.3);
assert.equal(HEADLINE.coffeeBurden, 113.9);
assert.ok(QUARTERLY.length >= 28);
assert.ok(MONTHLY.length >= 80);
assert.ok(MONTHLY_YOY.length >= 70);
assert.ok(ANNUAL.length >= 7);
assert.ok(SUMMARY_TABLE.length === ANNUAL.length);
assert.equal(ANALYTICS.smokeMarker, "Coffee vs wage index race");
assert.equal(QUARTERLY.at(-1)?.label, "2026Q2");

const root = process.cwd();
const slug = "coffee-and-carbonated-drink-cpi-versus-typical-wages-2026";
const markers = [
  "Coffee vs wage index race",
  "Food & Agriculture · Coffee vs wage index race",
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
    await clickBtn(page, "Wage gaps");
    await clickBtn(page, "Wage burden");
    await clickBtn(page, "Coffee only");
    await clickBtn(page, "YoY heat");
    await clickBtn(page, "Since 2022");
    await clickBtn(page, "Latest ladder");
    await clickBtn(page, "Annual bars");
    await clickBtn(page, "Coffee + soda");
    await clickBtn(page, "Since 2019");
    await clickBtn(page, "Index race");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues?.length > 0) {
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
