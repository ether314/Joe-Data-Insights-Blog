/**
 * QA: electrician-and-plumber-age-cohorts-2026
 * // viz-types: horizontal dual bars, composed bar+line, scatter, dual area, composed bar+line | layout: default
 * // smoke-marker: Near-retirement share by state
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
  LICENSE_TREND,
  NATIONAL_AGE_BANDS,
  REGION_ROLLUP,
  STATE_COHORTS,
} from "../src/data/electrician-and-plumber-age-cohorts-2026-data.ts";

assert.equal(HEADLINE.elecShare55, 18.4);
assert.equal(HEADLINE.plumbShare55, 20.4);
assert.equal(HEADLINE.elecMedianAge, 39.6);
assert.equal(HEADLINE.plumbMedianAge, 40.1);
assert.equal(HEADLINE.oldestElecShare55, 27.8);
assert.equal(HEADLINE.oldestPlumbShare55, 28.4);
assert.ok(NATIONAL_AGE_BANDS.length >= 7);
assert.ok(STATE_COHORTS.length >= 40);
assert.equal(REGION_ROLLUP.length, 4);
assert.ok(LICENSE_TREND.length >= 7);
assert.equal(ANALYTICS.oldestElec, "Maine");
assert.equal(ANALYTICS.oldestPlumb, "West Virginia");

const root = process.cwd();
const slug = "electrician-and-plumber-age-cohorts-2026";
const markers = [
  "Near-retirement share by state",
  "Labor & Skills · Skilled-trades workforce age",
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
    await clickBtn(page, "Age bands");
    await clickBtn(page, "State ladder");
    await clickBtn(page, "Plumbers");
    await clickBtn(page, "Northeast");
    await clickBtn(page, "Pressure");
    await clickBtn(page, "Pipeline scatter");
    await clickBtn(page, "West");
    await clickBtn(page, "License path");
    await clickBtn(page, "Region compare");
    await clickBtn(page, "Electricians");
    await clickBtn(page, "All");
    await clickBtn(page, "State ladder");
    await clickBtn(page, "Oldest first");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues?.length > 0) {
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
