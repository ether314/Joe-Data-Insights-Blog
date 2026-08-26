/**
 * QA: north-america-battery-recycling-capacity-versus-ev-sales-2026
 * // smoke-marker: Recycling tons vs pack tons
 * // viz-types: gap bars, coverage area+line, plant ladder,
 * // feedstock pie, country scatter, tech stacked bars
 * // | layout: split-rail
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTRY_SUMMARY,
  FEEDSTOCK_MIX,
  GAP_BARS,
  HEADLINE,
  PLANTS,
  RECOVERY_PLANTS,
  SALES_CAPACITY_PATH,
  TECH_MIX,
  VIZ_MARKERS,
} from "../src/data/north-america-battery-recycling-capacity-versus-ev-sales-2026-data.ts";

assert.equal(HEADLINE.packTonsFromSalesKt, 777);
assert.equal(HEADLINE.operatingRecoveryKt, 98);
assert.equal(HEADLINE.operatingPlusUcKt, 238);
assert.equal(HEADLINE.coverageOperatingPct, 12.6);
assert.equal(HEADLINE.usEvSalesM, 1.6);
assert.ok(HEADLINE.operatingRecoveryKt < HEADLINE.packTonsFromSalesKt);
assert.ok(RECOVERY_PLANTS.length >= 8);
assert.ok(PLANTS.length >= 12);
assert.ok(SALES_CAPACITY_PATH.length >= 6);
assert.ok(FEEDSTOCK_MIX.length >= 4);
assert.ok(GAP_BARS.length >= 3);
assert.ok(COUNTRY_SUMMARY.length === 3);
assert.ok(TECH_MIX.length >= 3);
assert.ok(VIZ_MARKERS.length >= 2);

const root = process.cwd();
const slug = "north-america-battery-recycling-capacity-versus-ev-sales-2026";
const markers = [...VIZ_MARKERS];

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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Capacity gap");
    await clickBtn(page, "Operating");
    await clickBtn(page, "Op + UC");
    await clickBtn(page, "Pretreatment");
    await clickBtn(page, "Coverage path");
    await clickBtn(page, "Plant book");
    await clickBtn(page, "Operating");
    await clickBtn(page, "Under construction");
    await clickBtn(page, "Hydromet");
    await clickBtn(page, "USA");
    await clickBtn(page, "All status");
    await clickBtn(page, "Feedstock mix");
    await clickBtn(page, "By country");
    await clickBtn(page, "Tech routes");
    await clickBtn(page, "Capacity gap");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 16,
      maxCharts: 4,
    });
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
