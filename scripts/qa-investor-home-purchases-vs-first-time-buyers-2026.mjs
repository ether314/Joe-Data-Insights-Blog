/**
 * QA: investor-home-purchases-vs-first-time-buyers-2026
 * // viz-types: composed dual-axis line, diverging bar, scatter, dual bar | layout: default
 * // smoke-marker: Investor % of closings vs first-time buyers
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  GAP_PEAK_ROWS,
  HEADLINE,
  METROS,
  NATIONAL_SERIES,
  REVERSAL_SCATTER,
} from "../src/data/investor-home-purchases-vs-first-time-buyers-2026-data.ts";

assert.equal(HEADLINE.peakInvestorSharePct, 28.4);
assert.equal(HEADLINE.peakInvestorMetro, "Atlanta");
assert.equal(HEADLINE.peakInvestorYear, 2021);
assert.equal(HEADLINE.atlantaGap2021Pp, 10.2);
assert.equal(HEADLINE.metrosInvestorOutbidCount, 10);
assert.equal(HEADLINE.metrosGapReversedBy2025, 10);
assert.ok(METROS.length >= 14);
assert.ok(GAP_PEAK_ROWS.length >= 14);
assert.ok(REVERSAL_SCATTER.length >= 14);
assert.ok(NATIONAL_SERIES.length === 5);
assert.equal(ANALYTICS.defaultMetroId, "atlanta");
assert.equal(ANALYTICS.outbidMetroIds.length, 10);

const root = process.cwd();
const slug = "investor-home-purchases-vs-first-time-buyers-2026";
const markers = [
  "Investor % of closings vs first-time buyers",
  "Real Estate · Investor % of closings",
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
    await clickBtn(page, "Gap ladder");
    await clickBtn(page, "At peak");
    await clickBtn(page, "2025");
    await clickBtn(page, "Reversal scatter");
    await clickBtn(page, "National + rates");
    await clickBtn(page, "Outbid metros");
    await clickBtn(page, "Metro paths");
    await clickBtn(page, "Investor");
    await clickBtn(page, "FTB");
    await clickBtn(page, "Both");
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
