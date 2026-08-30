/**
 * QA: undergraduate-enrollment-versus-high-school-graduate-cohorts-2026
 * // viz-types: composed dual-track, ratio line, stacked area level split, immediate bars+line, gap horizontal bars, index scatter | layout: default
 * // smoke-marker: Undergrad headcount vs HS graduate cohort
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  COHORT_YEARS,
  COMPLETER_EXTENSION,
  GAP_ANCHORS,
  HEADLINE,
  IMMEDIATE_PATH,
  LEVEL_SPLIT,
  SUMMARY_TABLE,
} from "../src/data/undergraduate-enrollment-versus-high-school-graduate-cohorts-2026-data.ts";

assert.equal(HEADLINE.peakYear, 2010);
assert.equal(HEADLINE.peakUndergradM, 18.082);
assert.equal(HEADLINE.troughUndergradM, 15.397);
assert.equal(HEADLINE.undergradDropFromPeakPct, 14.8);
assert.equal(HEADLINE.ratio2010, 5.72);
assert.equal(HEADLINE.ratio2022, 5.15);
assert.equal(HEADLINE.immediateRate2024Pct, 62.8);
assert.ok(COHORT_YEARS.length >= 12);
assert.equal(COMPLETER_EXTENSION.length, 2);
assert.equal(GAP_ANCHORS.length, 3);
assert.equal(LEVEL_SPLIT.length, 2);
assert.ok(SUMMARY_TABLE.length >= 6);
assert.ok(IMMEDIATE_PATH.length >= 14);
assert.equal(ANALYTICS.smokeMarker, "Undergrad headcount vs HS graduate cohort");
assert.equal(COHORT_YEARS.at(-1)?.year, 2022);

const root = process.cwd();
const slug = "undergraduate-enrollment-versus-high-school-graduate-cohorts-2026";
const markers = [
  "Undergrad headcount vs HS graduate cohort",
  "Economics · Undergrad headcount vs HS graduate cohort",
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
    await clickBtn(page, "Ratio");
    await clickBtn(page, "2yr vs 4yr");
    await clickBtn(page, "Immediate rate");
    await clickBtn(page, "Gap");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "2019 = 100");
    await clickBtn(page, "2-year");
    await clickBtn(page, "Dual track");
    await clickBtn(page, "2010 = 100");
    await clickBtn(page, "Both levels");
    await auditVizInteractions(page, { slug });
    console.log(
      "✓ undergraduate-enrollment-versus-high-school-graduate-cohorts-2026 QA passed",
    );
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
