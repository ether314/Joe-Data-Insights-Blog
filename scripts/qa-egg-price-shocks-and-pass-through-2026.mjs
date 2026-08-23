/**
 * QA: egg-price-shocks-and-pass-through-2026
 * // viz-types: dual-line composed, unwind area, region bars, pass-through scatter, episode ladder | layout: default
 * // smoke-marker: Wholesale-to-retail lag
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  EPISODES,
  HEADLINE,
  MONTHLY_SPREAD,
  REGION_QUOTES,
  UNWIND_2025,
} from "../src/data/egg-price-shocks-and-pass-through-2026-data.ts";

assert.ok(HEADLINE.retailPeakUsd >= 6.2 && HEADLINE.retailPeakUsd <= 6.3);
assert.ok(HEADLINE.wholesalePeakUsd >= 8.0 && HEADLINE.wholesalePeakUsd <= 8.1);
assert.equal(HEADLINE.shelfLagWeeks, 4);
assert.ok(HEADLINE.crestPassThroughPct >= 70 && HEADLINE.crestPassThroughPct <= 75);
assert.ok(MONTHLY_SPREAD.length >= 40);
assert.ok(EPISODES.length >= 3);
assert.ok(REGION_QUOTES.length >= 4);
assert.ok(UNWIND_2025.length >= 6);
const mar25 = MONTHLY_SPREAD.find((r) => r.month === "2025-03");
assert.ok(mar25 && mar25.retailUsd >= 6.2);

const root = process.cwd();
const slug = "egg-price-shocks-and-pass-through-2026";
const markers = [
  "Wholesale-to-retail lag",
  "Wholesale vs retail dollars per dozen",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Unwind");
    await clickBtn(page, "Regions");
    await clickBtn(page, "Δ pass-through");
    await clickBtn(page, "Episodes");
    await clickBtn(page, "Price path");
    await clickBtn(page, "Retail − wholesale");
    await clickBtn(page, "Retail / wholesale %");
    await clickBtn(page, "Levels");
    await clickBtn(page, "2025");
    await clickBtn(page, "All");
    await auditVizInteractions(page, { slug, maxButtons: 14 });
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
