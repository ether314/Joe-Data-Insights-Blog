/**
 * QA: usps-cost-coverage-by-product-class-2026
 * // smoke-marker: Cost coverage % by class
 * // viz-types: multi-line class paths, horizontal product bars with 100% ref,
 * // loss waterfall bars, competitive-failure grouped bars, coverage-loss scatter
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AGGREGATE_NONCOMP_LOSS,
  CLASS_COVERAGE_PATH,
  COMPLIANCE_COUNTS,
  DETAIL_TABLE,
  FLATS_GAP,
  HEADLINE,
  LOSS_WATERFALL,
  PRODUCT_COVERAGE,
  VIZ_MARKERS,
} from "../src/data/usps-cost-coverage-by-product-class-2026-data.ts";

assert.equal(HEADLINE.periodicalsCoverage2025, 74.82);
assert.equal(HEADLINE.mktFlatsCoverage2025, 73.7);
assert.equal(HEADLINE.nonCompLoss2025, 711.6);
assert.equal(HEADLINE.competitiveFailures2025, 18);
assert.equal(HEADLINE.competitiveFailures2024, 10);
assert.ok(CLASS_COVERAGE_PATH.length >= 25);
assert.ok(PRODUCT_COVERAGE.length >= 8);
assert.ok(FLATS_GAP.length >= 3);
assert.ok(LOSS_WATERFALL.length >= 3);
assert.ok(AGGREGATE_NONCOMP_LOSS.length === 5);
assert.ok(COMPLIANCE_COUNTS.some((r) => r.fy === 2025 && r.failures === 18));
assert.ok(DETAIL_TABLE.length >= 10);
assert.ok(VIZ_MARKERS.includes("Cost coverage % by class"));
assert.ok(VIZ_MARKERS.includes("Flats still below 100%"));

const root = process.cwd();
const slug = "usps-cost-coverage-by-product-class-2026";
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

    await clickBtn(page, "Product bars");
    await page
      .getByText("Flats still below 100%", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "FY2024");
    await clickBtn(page, "FY2025");
    await clickBtn(page, "Loss waterfall");
    await page
      .getByText("non-compensatory loss", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Competitive gap");
    await page
      .getByText("Competitive failures doubled", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Coverage vs loss");
    await clickBtn(page, "Periodicals");
    await clickBtn(page, "All classes");
    await clickBtn(page, "Class paths");
    console.log("✓ view + fy + class controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
