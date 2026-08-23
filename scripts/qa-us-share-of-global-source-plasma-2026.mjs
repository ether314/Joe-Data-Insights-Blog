/**
 * QA: us-share-of-global-source-plasma-2026
 * // viz-types: region donut, EU origin pie, collection area+line compose, intensity bars, dependency scatter, deficit area, capacity bubble | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COLLECTION_PATH,
  EU_ORIGIN_MIX,
  HEADLINE,
  INTENSITY_ROWS,
  REGION_SHARES,
} from "../src/data/us-share-of-global-source-plasma-2026-data.ts";

assert.equal(HEADLINE.usGlobalSharePct, 68);
assert.equal(HEADLINE.euUsImportSharePct, 38);
assert.equal(HEADLINE.usLiters2025M, 62.5);
assert.equal(HEADLINE.usCenters2025, 1247);
assert.ok(REGION_SHARES.length >= 5);
assert.equal(REGION_SHARES[0].id, "us");
assert.ok(Math.abs(REGION_SHARES.reduce((s, r) => s + r.sharePct, 0) - 100) < 0.5);
assert.ok(EU_ORIGIN_MIX.length === 3);
assert.ok(Math.abs(EU_ORIGIN_MIX.reduce((s, r) => s + r.sharePct, 0) - 100) < 0.5);
assert.ok(COLLECTION_PATH.length >= 8);
assert.ok(INTENSITY_ROWS.length >= 8);
assert.equal(INTENSITY_ROWS[0].id, "us");

const root = process.cwd();
const slug = "us-share-of-global-source-plasma-2026";
const markers = [
  "Source plasma · fractionation feedstock",
  "US collects ~68% of global source plasma",
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
  const port = Number(process.env.SMOKE_PORT || 4184);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(
      '[data-viz="us-share-of-global-source-plasma-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Global share");
    await clickBtn(page, "Liters");
    await clickBtn(page, "US share %");
    await clickBtn(page, "Centers");
    await clickBtn(page, "Show world");
    await clickBtn(page, "US only");
    await clickBtn(page, "EU dependence");
    await clickBtn(page, "Intensity");
    await clickBtn(page, "Compensated");
    await clickBtn(page, "VNRD only");
    await clickBtn(page, "All");
    await clickBtn(page, "Capacity");
    await clickBtn(page, "Global share");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 12,
      maxCharts: 4,
    });
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
