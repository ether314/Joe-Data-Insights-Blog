/**
 * QA: cheap-metro-rent-convergence-2026
 * // viz-types: composed gap path, metro line path, zori scatter, rise ladder bars, gap-closed grouped bars | layout: default
 * // smoke-marker: Burden-share gap narrowing
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  COHORT_SERIES,
  CONVERGENCE_SCATTER,
  GAP_CLOSED_ROWS,
  HEADLINE,
  INTERIOR_RISE_LADDER,
  METROS,
} from "../src/data/cheap-metro-rent-convergence-2026-data.ts";

assert.equal(HEADLINE.gap2019Pp, 9.2);
assert.equal(HEADLINE.gap2024Pp, 3.1);
assert.equal(HEADLINE.gapNarrowPp, 6.1);
assert.equal(HEADLINE.interiorBurden2019, 40.9);
assert.equal(HEADLINE.interiorBurden2024, 49.4);
assert.equal(HEADLINE.interiorCount, 12);
assert.equal(HEADLINE.coastalCount, 8);
assert.ok(COHORT_SERIES.length >= 6);
assert.ok(METROS.length === 20);
assert.ok(CONVERGENCE_SCATTER.length === 20);
assert.ok(INTERIOR_RISE_LADDER.length === 12);
assert.ok(GAP_CLOSED_ROWS.length === 12);
assert.equal(ANALYTICS.defaultMetroId, "boise");
assert.ok(ANALYTICS.metrosBurdenUp5pp.length >= 12);

const root = process.cwd();
const slug = "cheap-metro-rent-convergence-2026";
const markers = [
  "Burden-share gap narrowing",
  "Coastal vs interior rent-burden gap",
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
    await clickBtn(page, "Metro paths");
    await clickBtn(page, "ZORI scatter");
    await clickBtn(page, "Interior");
    await clickBtn(page, "Coastal");
    await clickBtn(page, "All metros");
    await clickBtn(page, "Rise ladder");
    await clickBtn(page, "ZORI cum %");
    await clickBtn(page, "Burden rise (pp)");
    await clickBtn(page, "Gap closed");
    await clickBtn(page, "Gap path");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
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
