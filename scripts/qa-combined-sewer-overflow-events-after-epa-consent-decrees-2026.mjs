/**
 * QA: combined-sewer-overflow-events-after-epa-consent-decrees-2026
 * // viz-types: outcome donut, years-since dual line, city cut bars, annual composed, era summary bars, rain-vs-cut scatter | layout: default
 * // smoke-marker: Overflow events vs decree baseline
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL_COHORT_SERIES,
  CITY_PANEL,
  DECREE_ERA_SUMMARY,
  HEADLINE,
  OUTCOME_MIX,
  YEARS_SINCE_DECREE_CURVE,
} from "../src/data/combined-sewer-overflow-events-after-epa-consent-decrees-2026-data.ts";

assert.equal(HEADLINE.citiesInPanel, 12);
assert.equal(HEADLINE.medianEventCutPct, 31);
assert.equal(HEADLINE.medianRainNormCutPct, 18);
assert.equal(HEADLINE.wetYearReboundSharePct, 42);
assert.equal(HEADLINE.recentIndexVsBaseline, 69);
assert.equal(CITY_PANEL.length, 12);
assert.equal(OUTCOME_MIX.reduce((s, r) => s + r.cities, 0), 12);
assert.ok(YEARS_SINCE_DECREE_CURVE.length >= 5);
assert.ok(ANNUAL_COHORT_SERIES.length >= 10);
assert.equal(DECREE_ERA_SUMMARY.length, 3);
assert.equal(
  DECREE_ERA_SUMMARY.reduce((s, r) => s + r.cities, 0),
  12,
);

const root = process.cwd();
const slug = "combined-sewer-overflow-events-after-epa-consent-decrees-2026";
const markers = ["Overflow events vs decree baseline"];

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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Years since decree");
    await clickBtn(page, "City cuts");
    await clickBtn(page, "Events per inch");
    await clickBtn(page, "Raw events");
    await clickBtn(page, "Ohio Valley");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Annual wet years");
    await clickBtn(page, "Decree eras");
    await clickBtn(page, "Rain vs cut");
    await clickBtn(page, "Outcome mix");
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
