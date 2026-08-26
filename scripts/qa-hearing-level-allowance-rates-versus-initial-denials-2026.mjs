/**
 * QA: hearing-level-allowance-rates-versus-initial-denials-2026
 * // viz-types: dual composed area+line, gap bars, stage horizontal bars, region composed bars, program grouped bars, gap scatter | layout: default
 * // smoke-marker: Headline — cohort gap 29.7 pp → 13.3 pp trough
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  COHORT_GAP,
  FY_ALJ_VS_DDS,
  HEADLINE,
  PROGRAM_MIX_2018,
  REGION_RATES,
  STAGE_LADDER_FY2024,
} from "../src/data/hearing-level-allowance-rates-versus-initial-denials-2026-data.ts";

assert.equal(HEADLINE.gapPp2008, 29.7);
assert.equal(HEADLINE.gapPp2017, 13.3);
assert.equal(HEADLINE.gapPpFy2024, 19.7);
assert.equal(HEADLINE.aljFy2024Pct, 58);
assert.equal(HEADLINE.ddsInitialFy2024Pct, 38.3);
assert.equal(HEADLINE.gapNarrowedFromPeakPp, 16.4);
assert.ok(COHORT_GAP.length >= 12);
assert.ok(FY_ALJ_VS_DDS.length >= 14);
assert.equal(STAGE_LADDER_FY2024.length, 3);
assert.ok(REGION_RATES.length === 10);
assert.ok(PROGRAM_MIX_2018.length === 3);
assert.equal(ANALYTICS.peakGapYear, 2008);
assert.equal(ANALYTICS.troughGapYear, 2017);

const root = process.cwd();
const slug = "hearing-level-allowance-rates-versus-initial-denials-2026";
const markers = [
  "Headline — cohort gap 29.7 pp → 13.3 pp trough",
  "Allowance rate gap — ALJ vs DDS",
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
  const port = Number(process.env.SMOKE_PORT || 4186);
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
    await clickBtn(page, "Gap path");
    await clickBtn(page, "Rates only");
    await clickBtn(page, "South");
    await clickBtn(page, "Mature cohorts only");
    await clickBtn(page, "Include partial years");
    await clickBtn(page, "Use FY ALJ series");
    await clickBtn(page, "FY ALJ series on");
    await clickBtn(page, "Rates + gap");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Stage ladder");
    await clickBtn(page, "Region DDS");
    await clickBtn(page, "Program mix");
    await clickBtn(page, "Gap cloud");
    await clickBtn(page, "Rates over time");
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
