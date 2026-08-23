/**
 * QA: who-glass-bloodstream-resistance-2026
 * // viz-types: peak bars, global scoreboard bars, region bars+radar, trend scatter+bars, US dual bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  GLOBAL_BSI_COMBOS,
  HEADLINE,
  PEAK_CELLS,
  REGIONAL_BSI,
  TREND_ROWS,
  VIZ_MARKER,
} from "../src/data/who-glass-bloodstream-resistance-2026-data.ts";

assert.equal(HEADLINE.acinetobacterCarbPct, 54.3);
assert.equal(HEADLINE.ecoli3gcAfricaPct, 70.7);
assert.equal(HEADLINE.kpneuCarbSeAsiaPct, 41.2);
assert.equal(HEADLINE.mrsaEmrPct, 50.3);
assert.ok(PEAK_CELLS.length >= 6);
assert.ok(REGIONAL_BSI.length >= 6);
assert.ok(GLOBAL_BSI_COMBOS.length >= 5);
assert.ok(TREND_ROWS.length >= 5);
assert.ok(VIZ_MARKER.includes("WHO GLASS"));

const root = process.cwd();
const slug = "who-glass-bloodstream-resistance-2026";
const markers = [VIZ_MARKER, "resistant isolate share"];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(250);
}

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4188);
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
    await clickBtn(page, "Peak cells");
    await clickBtn(page, "Last-line");
    await clickBtn(page, "First-choice");
    await clickBtn(page, "All drugs");
    await clickBtn(page, "Regions");
    await clickBtn(page, "Trends");
    await clickBtn(page, "Last-line");
    await clickBtn(page, "US vs GLASS");
    await clickBtn(page, "Peak cells");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
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
