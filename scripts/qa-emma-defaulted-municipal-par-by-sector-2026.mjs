/**
 * QA: emma-defaulted-municipal-par-by-sector-2026
 * // viz-types: stacked area, grouped horizontal bar, stacked bar, scatter, grouped bar, composed area+line | layout: default
 * // smoke-marker: Defaulted par share by sector
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  COUNT_VS_PAR,
  EVENT_MIX,
  FLOW_SERIES,
  HEADLINE,
  MIX_COMPARE,
  STOCK_SERIES,
  SUMMARY_TABLE,
} from "../src/data/emma-defaulted-municipal-par-by-sector-2026-data.ts";

assert.equal(HEADLINE.healthcareShare2025Pct, 34.2);
assert.equal(HEADLINE.landSecuredShare2025Pct, 27.8);
assert.equal(HEADLINE.goShare2025Pct, 8.1);
assert.equal(HEADLINE.goShare2019Pct, 58.4);
assert.equal(HEADLINE.riskPairShare2025Pct, 62.0);
assert.equal(HEADLINE.outstandingPar2025B, 4.85);
assert.equal(HEADLINE.outstandingPar2019B, 41.2);
assert.ok(STOCK_SERIES.length >= 10);
assert.ok(FLOW_SERIES.length >= 10);
assert.equal(STOCK_SERIES.at(-1)?.year, 2025);
assert.equal(STOCK_SERIES.at(-1)?.totalM, 4850);
assert.ok(MIX_COMPARE.length === 5);
assert.ok(EVENT_MIX.length === 5);
assert.ok(COUNT_VS_PAR.length === 5);
assert.ok(SUMMARY_TABLE.length >= 5);
assert.equal(ANALYTICS.smokeMarker, "Defaulted par share by sector");
const y25 = STOCK_SERIES.find((r) => r.year === 2025);
assert.ok(y25);
const hcShare = (100 * y25.healthcareM) / y25.totalM;
assert.ok(Math.abs(hcShare - 34.2) < 0.2);

const root = process.cwd();
const slug = "emma-defaulted-municipal-par-by-sector-2026";
const markers = [
  "Defaulted par share by sector",
  "Capital Markets · Defaulted par share by sector",
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
    await clickBtn(page, "Mix slope");
    await clickBtn(page, "Flow grid");
    await page.locator("select").nth(0).selectOption("post2020");
    console.log("→ era post2020");
    await page.locator("select").nth(1).selectOption("dollars");
    console.log("→ metric dollars");
    await page.locator("select").nth(2).selectOption("healthcare");
    console.log("→ sector healthcare");
    await clickBtn(page, "Count vs par");
    await clickBtn(page, "Era events");
    await clickBtn(page, "Stock path");
    await clickBtn(page, "Stock stack");
    await page.locator("select").nth(0).selectOption("all");
    await page.locator("select").nth(2).selectOption("all");
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
