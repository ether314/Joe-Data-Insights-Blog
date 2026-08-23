/**
 * QA: institutional-share-of-single-family-rentals-2026
 * // viz-types: metro horizontal bars, share path multi-line, SFR vs all-SF scatter, ZIP tip bars, operator ladder, region rollup | layout: default
 * // smoke-marker: Atlanta · 27.9% of SFR stock
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  METRO_SFR_SHARES,
  OPERATOR_LADDER,
  SHARE_PATH,
  ZIP_TIPS,
} from "../src/data/institutional-share-of-single-family-rentals-2026-data.ts";

assert.equal(HEADLINE.topMetroSfrSharePct, 27.9);
assert.equal(HEADLINE.jacksonvilleGao5kSfrPct2024, 22);
assert.equal(HEADLINE.tipZipSharePct, 41);
assert.ok(METRO_SFR_SHARES.length >= 8);
assert.ok(SHARE_PATH.length >= 6);
assert.ok(ZIP_TIPS.length >= 6);
assert.ok(OPERATOR_LADDER.length >= 4);

const root = process.cwd();
const slug = "institutional-share-of-single-family-rentals-2026";
const markers = [
  "Atlanta · 27.9% of SFR stock",
  "Institutional SFR ownership",
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
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 25000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Metro shares");
    await clickBtn(page, "All cuts");
    await clickBtn(page, "JB ≥100");
    await clickBtn(page, "GAO ≥5k");
    await clickBtn(page, "2018–24 path");
    await clickBtn(page, "All six");
    await clickBtn(page, "Jacksonville");
    await clickBtn(page, "ZIP tips");
    await clickBtn(page, "SFR share");
    await clickBtn(page, "Year built");
    await clickBtn(page, "Operators");
    await clickBtn(page, "Definitions");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 14,
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
