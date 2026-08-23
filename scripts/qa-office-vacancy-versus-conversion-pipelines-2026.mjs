/**
 * QA: office-vacancy-versus-conversion-pipelines-2026
 * // viz-types: intensity ladder bars, vacancy×intensity scatter, pipeline path area+line, cost stacks, reuse pie + region area | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  COST_STACK,
  HEADLINE,
  METRO_ROWS,
  PIPELINE_PATH,
  REUSE_SOURCE_MIX,
  VIZ_MARKERS,
} from "../src/data/office-vacancy-versus-conversion-pipelines-2026-data.ts";

assert.equal(HEADLINE.nationalPipelineUnits, 90300);
assert.equal(HEADLINE.nationalPipelineYoyPct, 28);
assert.equal(HEADLINE.nationalVacancyPct, 18.3);
assert.ok(HEADLINE.nycUnitsPerMVacantSf > 150);
assert.ok(HEADLINE.houstonUnitsPerMVacantSf < 20);
assert.ok(HEADLINE.nycVsHoustonIntensityRatio > 10);
assert.ok(METRO_ROWS.length >= 12);
assert.ok(PIPELINE_PATH.length >= 5);
assert.ok(COST_STACK.length >= 6);
assert.ok(REUSE_SOURCE_MIX.some((r) => r.source === "Office" && r.sharePct === 47));
assert.ok(ANALYTICS.incentiveAvgIntensity > ANALYTICS.noIncentiveAvgIntensity);

const stranded = METRO_ROWS.filter((m) => m.quadrant === "vacancy-stranded");
assert.ok(stranded.length >= 3);
assert.ok(stranded.some((m) => m.id === "houston"));

const root = process.cwd();
const slug = "office-vacancy-versus-conversion-pipelines-2026";
const markers = [...VIZ_MARKERS];

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

    const selects = page.locator(`[data-viz="${slug}"] select`);
    assert.ok((await selects.count()) >= 2, "expected >=2 select controls");
    await selects.nth(0).selectOption({ value: "scatter" });
    await page.waitForTimeout(250);
    await page.getByText("Vacancy rate × conversion intensity", { exact: false }).first().waitFor({ timeout: 10000 });
    await selects.nth(1).selectOption({ value: "South" });
    await page.waitForTimeout(250);
    await selects.nth(2).selectOption({ value: "without" });
    await page.waitForTimeout(250);
    await selects.nth(0).selectOption({ value: "path" });
    await page.waitForTimeout(250);
    await page.getByText("National pipeline path vs vacancy", { exact: false }).first().waitFor({ timeout: 10000 });
    await selects.nth(0).selectOption({ value: "costs" });
    await page.waitForTimeout(250);
    await page.getByText("Conversion vs ground-up cost per unit", { exact: false }).first().waitFor({ timeout: 10000 });
    await selects.nth(0).selectOption({ value: "mix" });
    await page.waitForTimeout(250);
    await page.getByText("Adaptive-reuse source mix", { exact: false }).first().waitFor({ timeout: 10000 });
    console.log("✓ panel + region + incentive controls");

    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log(`qa-${slug}: PASS`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
