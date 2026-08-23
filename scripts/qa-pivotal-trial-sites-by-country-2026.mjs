/**
 * QA: pivotal-trial-sites-by-country-2026
 * // viz-types: country ladder bars, top-3 pie, regional stacked area, site×DALY scatter, bloc grouped bars, therapy bars, initiation composed | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  BLOC_COMPARE,
  COUNTRY_SITES,
  HEADLINE,
  REGION_PATH,
  THERAPY_MIX,
} from "../src/data/pivotal-trial-sites-by-country-2026-data.ts";

assert.equal(HEADLINE.top3CountryUsePct, 34.2);
assert.equal(HEADLINE.top3FacilityPct, 52.4);
assert.equal(HEADLINE.usCountryUsePct, 16);
assert.equal(HEADLINE.chinaCountryUsePct, 13);
assert.equal(HEADLINE.usFacilityPct, 39.6);
assert.ok(COUNTRY_SITES.length >= 12);
assert.equal(COUNTRY_SITES[0].country, "United States");
assert.ok(BLOC_COMPARE.length >= 5);
assert.ok(REGION_PATH.length >= 4);
assert.ok(THERAPY_MIX.length >= 4);
assert.ok(ANALYTICS.top3Use > 30);
assert.ok(ANALYTICS.hhiUse > 500);

const root = process.cwd();
const slug = "pivotal-trial-sites-by-country-2026";
const markers = [
  "Top-3 country site share",
  "Clinical development — site geography lens",
];

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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }

    const selects = page.locator("select");
    assert.ok((await selects.count()) >= 2, "expected >=2 select controls");
    await selects.nth(0).selectOption({ value: "facilityPct" });
    await page.waitForTimeout(250);
    await selects.nth(1).selectOption({ label: "Western Europe" });
    await page.waitForTimeout(250);
    console.log("✓ metric + region controls");

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
