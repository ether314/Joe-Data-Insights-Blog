/**
 * QA: subsidy-cost-per-converted-apartment-2026
 * // viz-types: cost ladder bars, cost×scale scatter, conversion vs ground-up bars, NYC composed split, abatement schedule areas | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CALGARY_YIELD,
  CITY_PROGRAMS,
  CONVERSION_VS_GROUNDUP,
  COST_UNIT_SCATTER,
  HEADLINE,
  NYC_GEO_SPLIT,
  VIZ_MARKERS,
} from "../src/data/subsidy-cost-per-converted-apartment-2026-data.ts";

assert.equal(HEADLINE.nycTaxExpenditurePerUnitUsd, 386000);
assert.equal(HEADLINE.nycOppCostPerIncomeRestrictedUsd, 1400000);
assert.equal(HEADLINE.calgaryGrantPerHomeUsd, 63300);
assert.equal(HEADLINE.dcFramedPerProjectedUnitUsd, 4880);
assert.equal(HEADLINE.nycPipelineUnits, 14500);
assert.ok(HEADLINE.nycVsCalgaryPerUnitRatio > 5);
assert.ok(CITY_PROGRAMS.length >= 4);
assert.ok(CONVERSION_VS_GROUNDUP.length >= 6);
assert.ok(COST_UNIT_SCATTER.length >= 4);
assert.ok(NYC_GEO_SPLIT.length === 3);
assert.ok(CALGARY_YIELD.sfPerHome > 1000);

const root = process.cwd();
const slug = "subsidy-cost-per-converted-apartment-2026";
const markers = [...VIZ_MARKERS];

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

    const rootViz = page.locator(`[data-viz="${slug}"]`);
    const selects = rootViz.locator("select");
    assert.ok((await selects.count()) >= 2, "expected >=2 select controls");

    await rootViz.getByRole("button", { name: "Cost × scale" }).click();
    await page.waitForTimeout(250);
    await page
      .getByText("Public $ per unit versus pipeline scale", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });

    await selects.nth(0).selectOption({ value: "perIncomeRestricted" });
    await page.waitForTimeout(200);
    await selects.nth(1).selectOption({ value: "conversion" });
    await page.waitForTimeout(200);
    await selects.nth(2).selectOption({ value: "nyc" });
    await page.waitForTimeout(200);

    await rootViz.getByRole("button", { name: "Conversion vs ground-up" }).click();
    await page.waitForTimeout(250);
    await page
      .getByText("Conversion public cost vs ground-up benchmarks", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });

    await rootViz.getByRole("button", { name: "NYC geo split" }).click();
    await page.waitForTimeout(250);
    await page
      .getByText("NYC 467-m: tax expenditure vs opportunity cost", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });

    await rootViz.getByRole("button", { name: "Instrument schedule" }).click();
    await page.waitForTimeout(250);
    await page
      .getByText("How long the public dollar stays on the table", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });

    await rootViz.getByRole("button", { name: "Cost ladder" }).click();
    await page.waitForTimeout(250);
    console.log("✓ panel buttons + metric/pathway/city controls");

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
