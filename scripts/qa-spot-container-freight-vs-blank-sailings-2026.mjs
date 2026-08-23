/**
 * QA: spot-container-freight-vs-blank-sailings-2026
 * // viz-types: composed rate×blank, scatter, blank-mix pie, event bars, TEU bars, corridor area | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  BLANK_MIX,
  CORRIDOR_SUMMARY,
  HEADLINE,
  MONTHLY_TAPE,
  PEAK_BLANK_EVENTS,
  VIZ_MARKERS,
} from "../src/data/spot-container-freight-vs-blank-sailings-2026-data.ts";

assert.equal(HEADLINE.peakBlankUsecPct, 42);
assert.equal(HEADLINE.peakBlankUswcPct, 28);
assert.equal(HEADLINE.fewbOctBlankPct, 25);
assert.equal(HEADLINE.scfiEuropeSoftUsd, 1052);
assert.ok(MONTHLY_TAPE.length >= 12);
assert.ok(PEAK_BLANK_EVENTS.length >= 4);
assert.ok(BLANK_MIX.length >= 3);
assert.ok(CORRIDOR_SUMMARY.length >= 4);
assert.ok(ANALYTICS.blankUswcCorr > 0);
assert.ok(ANALYTICS.softestEurope <= 1052);

const root = process.cwd();
const slug = "spot-container-freight-vs-blank-sailings-2026";
const markers = [...VIZ_MARKERS];

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
    await selects.nth(0).selectOption({ value: "europe" });
    await page.waitForTimeout(250);
    await selects.nth(1).selectOption({ value: "uswc" });
    await page.waitForTimeout(250);
    console.log("✓ spot metric + scatter lane controls");

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
