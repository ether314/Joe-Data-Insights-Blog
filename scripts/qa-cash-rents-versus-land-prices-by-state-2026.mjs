/**
 * QA: cash-rents-versus-land-prices-by-state-2026
 * // viz-types: composed dual-axis path, horizontal compression bars, growth scatter, region yield bars, fed pulse composed | layout: default
 * // smoke-marker: Headline — U.S. cropland yield
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  FED_PULSE,
  GROWTH_SCATTER,
  HEADLINE,
  NATIONAL_PATH,
  REGION_YIELDS_2025,
  STATE_PANEL,
} from "../src/data/cash-rents-versus-land-prices-by-state-2026-data.ts";

assert.equal(HEADLINE.usValue2025, 5830);
assert.equal(HEADLINE.usRent2025, 161);
assert.equal(HEADLINE.usYieldCompressionPp, 0.48);
assert.equal(HEADLINE.maxCompressionState, "Nebraska");
assert.ok(NATIONAL_PATH.length >= 6);
assert.ok(STATE_PANEL.length >= 20);
assert.ok(GROWTH_SCATTER.length >= 20);
assert.ok(REGION_YIELDS_2025.length >= 10);
assert.ok(FED_PULSE.length >= 3);
assert.equal(ANALYTICS.maxCompressionState, "Nebraska");
assert.ok(ANALYTICS.maxCompressionPp >= 0.85);

const root = process.cwd();
const slug = "cash-rents-versus-land-prices-by-state-2026";
const markers = [
  "Headline — U.S. cropland yield",
  "rent yield compression",
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
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Compression ladder");
    await clickBtn(page, "Northern Plains");
    await clickBtn(page, "Value growth");
    await clickBtn(page, "Include estimates");
    await clickBtn(page, "Disclosed only");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Growth scatter");
    await clickBtn(page, "Region yields");
    await clickBtn(page, "Fed pulse");
    await clickBtn(page, "Yield path");
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
