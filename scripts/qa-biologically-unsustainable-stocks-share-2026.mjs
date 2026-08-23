/**
 * QA: biologically-unsustainable-stocks-share-2026
 * // viz-types: path area+line, area ladder bars, composition pie, weight dual-area, benchmark bars, census scatter | layout: default
 * // smoke-marker: Unsustainable stock %
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AREA_ROWS,
  BENCHMARK_ROWS,
  CENSUS_CONTRAST,
  COMPOSITION_2021,
  GLOBAL_STATUS_PATH,
  HEADLINE,
  VIZ_MARKERS,
  WEIGHT_LENS,
} from "../src/data/biologically-unsustainable-stocks-share-2026-data.ts";

assert.equal(HEADLINE.unsustainablePct2021, 37.7);
assert.equal(HEADLINE.sustainablePct2021, 62.3);
assert.equal(HEADLINE.unsustainablePct2019, 35.4);
assert.equal(HEADLINE.unsustainablePct1974, 10);
assert.equal(HEADLINE.deltaPp2019to2021, 2.3);
assert.equal(HEADLINE.landingsWeightedSustainablePct2021, 76.9);
assert.ok(GLOBAL_STATUS_PATH.length >= 10);
assert.ok(AREA_ROWS.length >= 12);
assert.ok(COMPOSITION_2021.length === 3);
assert.ok(WEIGHT_LENS.length >= 6);
assert.ok(BENCHMARK_ROWS.length >= 4);
assert.ok(CENSUS_CONTRAST.length === 2);
assert.ok(VIZ_MARKERS.length >= 3);

const root = process.cwd();
const slug = "biologically-unsustainable-stocks-share-2026";
const markers = [...VIZ_MARKERS];

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

    const selects = page.locator("select");
    assert.ok((await selects.count()) >= 2, "expected >=2 select controls");
    await selects.nth(0).selectOption({ value: "areas" });
    await page.waitForTimeout(250);
    await selects.nth(1).selectOption({ value: "sustainable" });
    await page.waitForTimeout(250);
    await selects.nth(0).selectOption({ value: "composition" });
    await page.waitForTimeout(250);
    await selects.nth(0).selectOption({ value: "benchmarks" });
    await page.waitForTimeout(250);
    await selects.nth(0).selectOption({ value: "path" });
    await selects.nth(1).selectOption({ value: "unsustainable" });
    await page.waitForTimeout(400);
    console.log("✓ panel + metric controls");

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
