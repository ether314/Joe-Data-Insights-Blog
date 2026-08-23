/**
 * QA: orbital-launch-cadence-by-operator-2026
 * // viz-types: composed bar+line, horizontal bars, grouped bars, scatter, stacked area, pie | layout: default
 * // smoke-marker: Operator launch share
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL_CADENCE,
  HEADLINE,
  MASS_VS_CADENCE,
  OPERATOR_2025,
  OPERATOR_DELTA,
  US_OPERATOR_MIX_2025,
} from "../src/data/orbital-launch-cadence-by-operator-2026-data.ts";

assert.equal(HEADLINE.spacexShare2025Pct, 50.8);
assert.equal(HEADLINE.spacexShare2020Pct, 24.3);
assert.equal(HEADLINE.shareDeltaPp, 26.5);
assert.equal(HEADLINE.spacexLaunches2025, 165);
assert.equal(HEADLINE.worldLaunches2025, 325);
assert.ok(ANNUAL_CADENCE.length >= 6);
assert.ok(OPERATOR_2025.length >= 8);
assert.ok(OPERATOR_DELTA.length >= 5);
assert.ok(MASS_VS_CADENCE.length >= 5);
assert.ok(US_OPERATOR_MIX_2025.length >= 4);
assert.equal(ANALYTICS.topOperatorShare2025Pct, 50.8);

const root = process.cwd();
const slug = "orbital-launch-cadence-by-operator-2026";
const markers = [
  "Operator launch share",
  "Technology · Orbital launches & debris",
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
    await clickBtn(page, "Share path");
    await clickBtn(page, "Operator ladder");
    await clickBtn(page, "Region: U.S.");
    await clickBtn(page, "Region: China");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Five-year delta");
    await clickBtn(page, "Launch count");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Mass vs cadence");
    await clickBtn(page, "Bloc stack");
    await clickBtn(page, "U.S. mix");
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
