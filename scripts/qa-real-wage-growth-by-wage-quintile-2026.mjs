/**
 * QA: real-wage-growth-by-wage-quintile-2026
 * // viz-types: area fan, composed bar+line, diverging bar, heatmap, composed bar+line | layout: default
 * // smoke-marker: Quintile real growth spread
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  CUMULATIVE_FAN,
  HEADLINE,
  LATEST_CUMULATIVE,
  QUINTILES,
  QUARTERS,
  SPREAD_SERIES,
  SUMMARY_TABLE,
} from "../src/data/real-wage-growth-by-wage-quintile-2026-data.ts";

assert.equal(HEADLINE.q1CumRealPp, 7.2);
assert.equal(HEADLINE.q5CumRealPp, 0.1);
assert.equal(HEADLINE.q1MinusQ5LatestPp, 7.1);
assert.equal(HEADLINE.q1MinusQ5PeakPp, 9.4);
assert.equal(HEADLINE.leadTighteningPp, 2.3);
assert.equal(HEADLINE.positiveQuintiles, 3);
assert.ok(QUINTILES.length === 5);
assert.ok(QUARTERS.length >= 10);
assert.ok(CUMULATIVE_FAN.length === QUARTERS.length);
assert.ok(SPREAD_SERIES.length === QUARTERS.length);
assert.ok(LATEST_CUMULATIVE.length === 5);
assert.ok(SUMMARY_TABLE.length === 5);
assert.equal(ANALYTICS.defaultQuintile, "q1");
assert.equal(CUMULATIVE_FAN.at(-1)?.q1, 7.2);
assert.equal(CUMULATIVE_FAN.at(-1)?.q5, 0.1);
const peak = SPREAD_SERIES.find((r) => r.quarter === "2023Q2");
assert.ok(peak);
assert.equal(peak.spread, 9.4);

const root = process.cwd();
const slug = "real-wage-growth-by-wage-quintile-2026";
const markers = [
  "Quintile real growth spread",
  "Labor & Skills · Quintile real growth spread",
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
    await clickBtn(page, "Q1−Q5 spread");
    await clickBtn(page, "Latest ladder");
    await clickBtn(page, "Q3");
    await clickBtn(page, "2023Q2");
    await clickBtn(page, "Nom vs real");
    await clickBtn(page, "Q5");
    await clickBtn(page, "Real heat");
    await clickBtn(page, "CES cross-check");
    await clickBtn(page, "Cumulative fan");
    await clickBtn(page, "Q1");
    await clickBtn(page, "2026Q2");
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
