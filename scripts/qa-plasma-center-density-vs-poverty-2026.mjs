/**
 * QA: plasma-center-density-vs-poverty-2026
 * // viz-types: quintile density bars, new-vs-stock grouped bars, state poverty×density scatter, stock path area+line, tract contrast bars, cohort density composed | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CENTER_STOCK_PATH,
  HEADLINE,
  NEW_VS_STOCK_BANDS,
  OPENINGS_BY_COHORT,
  POVERTY_QUINTILES,
  STATE_DENSITY,
  TRACT_CONTRAST,
} from "../src/data/plasma-center-density-vs-poverty-2026-data.ts";

assert.equal(HEADLINE.usCentersEnd2025, 1_247);
assert.equal(HEADLINE.highPovertyQ5CentersPer100k, 0.66);
assert.equal(HEADLINE.lowPovertyQ1CentersPer100k, 0.35);
assert.equal(HEADLINE.q5VsQ1DensityMultiple, 1.9);
assert.equal(HEADLINE.newCentersHighPovertySharePct, 41);
assert.equal(HEADLINE.adultPopHighPovertySharePct, 22);
assert.ok(POVERTY_QUINTILES.length >= 5);
assert.ok(NEW_VS_STOCK_BANDS.length >= 4);
assert.ok(STATE_DENSITY.length >= 12);
assert.ok(CENTER_STOCK_PATH.length >= 8);
assert.ok(TRACT_CONTRAST.length >= 4);
assert.ok(OPENINGS_BY_COHORT.length >= 3);

const root = process.cwd();
const slug = "plasma-center-density-vs-poverty-2026";
const markers = [
  "Plasma · density vs poverty",
  "Highest-poverty ZCTAs host",
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
    await clickBtn(page, "Density");
    await clickBtn(page, "Per 100k");
    await clickBtn(page, "Index");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Openings");
    await clickBtn(page, "States");
    await clickBtn(page, "South");
    await clickBtn(page, "All");
    await clickBtn(page, "Context");
    await clickBtn(page, "Density");
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
