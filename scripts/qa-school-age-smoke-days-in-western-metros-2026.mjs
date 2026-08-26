/**
 * QA: school-age-smoke-days-in-western-metros-2026
 * // smoke-marker: School-year USG+ days by metro
 * // viz-types: USG+ metro ladder bars, child-days×days scatter,
 * // corridor vintage area+line, AQI band pie + month profile,
 * // corridor group bars, child-day volume ladder
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BAND_MIX,
  CORRIDOR_SUMMARY,
  CORRIDOR_VINTAGE,
  HEADLINE,
  METRO_PANEL,
  MONTH_PROFILE,
  SCHOOL_YEARS,
  VIZ_MARKERS,
} from "../src/data/school-age-smoke-days-in-western-metros-2026-data.ts";

assert.equal(HEADLINE.panelN, 16);
assert.equal(HEADLINE.schoolYears, 6);
assert.equal(HEADLINE.topMetroSy2324Days, 31);
assert.equal(HEADLINE.topMetroName, "Fresno");
assert.equal(HEADLINE.medianSy2324Days, 15);
assert.equal(HEADLINE.childDaysM, 86.3);
assert.equal(HEADLINE.peakMetroDays, 48);
assert.equal(METRO_PANEL.length, HEADLINE.panelN);
assert.equal(SCHOOL_YEARS.length, HEADLINE.schoolYears);
assert.ok(CORRIDOR_VINTAGE.length === 6);
assert.ok(CORRIDOR_SUMMARY.length === 5);
assert.ok(BAND_MIX.length === 4);
assert.ok(MONTH_PROFILE.length === 9);
assert.ok(METRO_PANEL[0].metro === "Fresno");
assert.ok(METRO_PANEL.every((m) => m.usgDays2324 >= m.unhealthyDays2324));
assert.ok(
  Math.abs(
    METRO_PANEL.reduce((s, m) => s + m.childDaysM, 0) - HEADLINE.childDaysM,
  ) < 0.15,
);

const root = process.cwd();
const slug = "school-age-smoke-days-in-western-metros-2026";
const markers = [...VIZ_MARKERS];

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

    await clickBtn(page, "Kids × days");
    await clickBtn(page, "Unhealthy+");
    await clickBtn(page, "Central Valley");
    await clickBtn(page, "Corridor vintage");
    await page
      .getByText("Mean school-year USG+ days by corridor", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Band & month");
    await page
      .getByText("AQI band mix of USG+ days", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Corridors");
    await page
      .getByText("Corridor means vs child-day load", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Child-day volume");
    await page
      .getByText("Child-day volume ladder", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "USG+ ladder");
    await clickBtn(page, "All corridors");
    console.log("✓ view + corridor + lens controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ school-age-smoke-days-in-western-metros-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
