/**
 * QA: epa-pm2-5-smoke-days-versus-population-2026
 * // smoke-marker: Person-days unhealthy AQI
 * // viz-types: vintage stacked area+mean line, decade compare bars,
 * // state ladder bars, metro days scatter, peak-day stacked bars,
 * // severity mix dual bars, region season composed | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DECADE_COMPARE,
  HEADLINE,
  METRO_SCATTER,
  PEAK_DAYS,
  SEVERITY_MIX,
  STATE_LADDER,
  VINTAGE_PATH,
  VIZ_MARKERS,
} from "../src/data/epa-pm2-5-smoke-days-versus-population-2026-data.ts";

assert.equal(HEADLINE.decade2010sMeanM, 420);
assert.equal(HEADLINE.recentMeanM, 2280);
assert.equal(HEADLINE.recentVs2010sMultiple, 5.4);
assert.equal(HEADLINE.year2023M, 4200);
assert.equal(HEADLINE.peakDayPopM, 101);
assert.ok(VINTAGE_PATH.length >= 14);
assert.ok(STATE_LADDER.length >= 12);
assert.ok(METRO_SCATTER.length >= 10);
assert.ok(PEAK_DAYS.length >= 4);
assert.ok(DECADE_COMPARE.length === 2);
assert.ok(SEVERITY_MIX.length === 4);
assert.equal(VIZ_MARKERS[0], "Person-days unhealthy AQI");

const root = process.cwd();
const slug = "epa-pm2-5-smoke-days-versus-population-2026";
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

    await clickBtn(page, "Decade gap");
    await page.getByText("Decade person-day gap", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "State ladder");
    await clickBtn(page, "2023");
    await clickBtn(page, "West");
    await clickBtn(page, "Metro scatter");
    await page.getByText("Metro smoke days vs population", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Peak days");
    await page.getByText("Peak-day population under smoke", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Severity mix");
    await clickBtn(page, "Season path");
    await clickBtn(page, "2020");
    console.log("✓ panel + region + metric + season controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ viz interaction audit");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
