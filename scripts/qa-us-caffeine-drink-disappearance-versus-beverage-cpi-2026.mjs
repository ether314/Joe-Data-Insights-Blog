/**
 * QA: us-caffeine-drink-disappearance-versus-beverage-cpi-2026
 * // viz-types: dual-axis volume vs CPI composed, decade grouped bars, volume-price scatter, era compare bars, gap area | layout: default
 * // smoke-marker: Gallons and pounds versus beverage CPI
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL,
  DECADE_BARS,
  DETAIL_TABLE,
  ERA_COMPARE,
  HEADLINE,
  INDEX_1990,
  SCATTER_POINTS,
  VIZ_MARKERS,
} from "../src/data/us-caffeine-drink-disappearance-versus-beverage-cpi-2026-data.ts";

assert.equal(HEADLINE.coffeeGreenBean2015, 10.23);
assert.equal(HEADLINE.coffeeGreenBean1995, 7.88);
assert.equal(HEADLINE.csdGallons1997, 53.0);
assert.equal(HEADLINE.csdGallons2025Ext, 41.9);
assert.equal(HEADLINE.bevCpi1990, 129.3);
assert.ok(HEADLINE.bevCpiIndex1990_2025 > 200);
assert.ok(ANNUAL.length >= 40);
assert.ok(INDEX_1990.length >= 25);
assert.ok(DECADE_BARS.length === 4);
assert.ok(ERA_COMPARE.length >= 5);
assert.ok(DETAIL_TABLE.length >= 8);
assert.ok(SCATTER_POINTS.length >= 20);
assert.equal(VIZ_MARKERS[0], "Gallons and pounds versus beverage CPI");

const root = process.cwd();
const slug = "us-caffeine-drink-disappearance-versus-beverage-cpi-2026";
const markers = ["Gallons and pounds versus beverage CPI"];

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
    await clickBtn(page, "Volume vs CPI race");
    await clickBtn(page, "Decade changes");
    await clickBtn(page, "Price–volume scatter");
    await clickBtn(page, "Era snapshots");
    await clickBtn(page, "Volume−price gaps");
    await clickBtn(page, "Detail table");
    await clickBtn(page, "Coffee CPI");
    await clickBtn(page, "Soda CPI");
    await clickBtn(page, "Beverage CPI");
    await clickBtn(page, "Coffee volume");
    await clickBtn(page, "CSD volume");
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
