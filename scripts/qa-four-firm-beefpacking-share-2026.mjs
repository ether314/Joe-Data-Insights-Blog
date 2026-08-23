/**
 * QA: four-firm-beefpacking-share-2026
 * // viz-types: dual-axis composed, area+line, stacked area, bars, pie, scatter | layout: default
 * // smoke-marker: Headline — fed CR4 81%
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  HEADLINE,
  NATIONAL_CR4,
  PACKER_MARGINS,
  PLANT_TIERS,
  PROCUREMENT_MIX,
  REGIONAL_MARKETS,
} from "../src/data/four-firm-beefpacking-share-2026-data.ts";

assert.equal(HEADLINE.nationalCr4Pct, 81);
assert.equal(HEADLINE.nationalHhi2021, 1687);
assert.equal(HEADLINE.peakRegionalHhi2021, 3200);
assert.equal(HEADLINE.packerMargin2025PerHead, -141);
assert.equal(HEADLINE.cowBullCr4Pct, 47);
assert.ok(NATIONAL_CR4.length >= 10);
assert.ok(REGIONAL_MARKETS.length >= 5);
assert.ok(PACKER_MARGINS.length >= 4);
assert.ok(PROCUREMENT_MIX.length >= 3);
assert.ok(PLANT_TIERS.length >= 3);
assert.ok(ANALYTICS.regionalHhiPremiumVsNational > 1000);

const root = process.cwd();
const slug = "four-firm-beefpacking-share-2026";
const markers = [
  "Headline — fed CR4 81%",
  "Regional four-firm share",
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
    await clickBtn(page, "National CR4 path");
    await clickBtn(page, "Disclosed only");
    await clickBtn(page, "Including carried years");
    await clickBtn(page, "Procurement mix");
    await clickBtn(page, "Packer margins");
    await clickBtn(page, "Annual only");
    await clickBtn(page, "Annual + weekly");
    await clickBtn(page, "Plants + cash–HHI scatter");
    await clickBtn(page, "Southern / Central Plains");
    await clickBtn(page, "Midwest contrast");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Regional HHI vs cash");
    const audit = await auditVizInteractions(page, { slug });
    console.log(`✓ viz interaction audit: ${audit.clicked} controls`);
    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
