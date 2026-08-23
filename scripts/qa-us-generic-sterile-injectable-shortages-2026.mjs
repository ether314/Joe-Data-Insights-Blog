/**
 * QA: us-generic-sterile-injectable-shortages-2026
 * // viz-types: dosage donut, shortage area+line, site redundancy bars, maker ladder, geo scatter, duration stacked, therapy stress, upstream flags | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DOSAGE_FORM_MIX,
  GEO_INJECTABLE,
  HEADLINE,
  MANUFACTURER_LADDER,
  SHORTAGE_PATH,
  SITE_REDUNDANCY,
} from "../src/data/us-generic-sterile-injectable-shortages-2026-data.ts";

assert.equal(HEADLINE.injectableSharePct, 71);
assert.equal(HEADLINE.uspActiveEnd2025, 75);
assert.equal(HEADLINE.ashpActiveQ2_2026, 227);
assert.equal(HEADLINE.soleSourceNew2026Pct, 48);
assert.equal(HEADLINE.rockyMountUsHospitalSiPct, 8);
assert.ok(DOSAGE_FORM_MIX.length >= 3);
assert.ok(SHORTAGE_PATH.length >= 8);
assert.ok(SITE_REDUNDANCY.length >= 3);
assert.ok(MANUFACTURER_LADDER.length >= 3);
assert.ok(GEO_INJECTABLE.length >= 4);

const root = process.cwd();
const slug = "us-generic-sterile-injectable-shortages-2026";
const markers = [
  "Sterile injectables · shortage share",
  "of USP-mapped active shortages are",
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
    await clickBtn(page, "Dosage mix");
    await clickBtn(page, "Shortage path");
    await clickBtn(page, "Both");
    await clickBtn(page, "ASHP count");
    await clickBtn(page, "Injectable %");
    await clickBtn(page, "Site depth");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Index on ASHP");
    await clickBtn(page, "Makers");
    await clickBtn(page, "Geography");
    await clickBtn(page, "Shortage − volume");
    await clickBtn(page, "Volume share");
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
