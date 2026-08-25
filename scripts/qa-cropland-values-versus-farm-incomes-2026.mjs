/**
 * QA: cropland-values-versus-farm-incomes-2026
 * // viz-types: dual-line composed, region bar+line, horizontal bars, scatter, yield bars, rate composed | layout: default
 * // smoke-marker: Headline — $/acre vs income index
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  CROPLAND_BY_REGION,
  DECOUPLE_SCATTER,
  HEADLINE,
  NATIONAL_PATH,
  RATE_BANDS,
  RENT_YIELD_STRESS,
} from "../src/data/cropland-values-versus-farm-incomes-2026-data.ts";

assert.equal(HEADLINE.usCropland2025PerAcre, 5830);
assert.equal(HEADLINE.usCroplandYoyPct, 4.7);
assert.equal(HEADLINE.nfi2025Bn, 154.6);
assert.equal(HEADLINE.nfi2026FBn, 153.4);
assert.ok(CROPLAND_BY_REGION.length >= 11);
assert.ok(NATIONAL_PATH.length >= 6);
assert.ok(DECOUPLE_SCATTER.length >= 10);
assert.ok(RENT_YIELD_STRESS.length >= 10);
assert.ok(RATE_BANDS.length >= 5);
assert.equal(ANALYTICS.maxYoyPct, 7.3);
assert.equal(ANALYTICS.maxGapRegion, "Northern Plains");

const root = process.cwd();
const slug = "cropland-values-versus-farm-incomes-2026";
const markers = [
  "Headline — $/acre vs income index",
  "U.S. cropland $5,830/acre in 2025",
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
    await clickBtn(page, "Regional cropland");
    await clickBtn(page, "Since 2021");
    await clickBtn(page, "2024–25 YoY");
    await clickBtn(page, "Decoupling scatter");
    await clickBtn(page, "Row-crop");
    await clickBtn(page, "Cattle");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Rent-yield stress");
    await clickBtn(page, "Rate bands");
    await clickBtn(page, "National path");
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
