/**
 * QA: rail-headcount-after-precision-scheduling-2026
 * // smoke-marker: Headcount vs dwell inflection
 * // viz-types: composed dual-axis area+lines, era bars, inflection scatter, carrier ladder bars, share pie, craft stacked area | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL_TAPE,
  CARRIER_CUTS,
  CRAFT_SHARES,
  ERA_SUMMARIES,
  HEADLINE,
  INFLECTION_SCATTER,
  VIZ_MARKERS,
} from "../src/data/rail-headcount-after-precision-scheduling-2026-data.ts";

assert.equal(HEADLINE.employmentDropPct, 29.1);
assert.equal(HEADLINE.employmentPeakK, 163.4);
assert.equal(HEADLINE.employmentTroughK, 115.8);
assert.equal(HEADLINE.dwellPeakHours, 26.8);
assert.equal(HEADLINE.dwellRiseHours, 4.7);
assert.equal(HEADLINE.dwellLeadYears, 3);
assert.ok(ANNUAL_TAPE.length >= 12);
assert.ok(CARRIER_CUTS.length >= 6);
assert.ok(CRAFT_SHARES.length >= 5);
assert.ok(INFLECTION_SCATTER.length >= 10);
assert.ok(ERA_SUMMARIES.length === 4);
assert.equal(ANALYTICS.firstDwellStressYear, 2017);
assert.ok(ANALYTICS.empDwellCorrPreCovid < -0.8);

const root = process.cwd();
const slug = "rail-headcount-after-precision-scheduling-2026";
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
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }

    await clickBtn(page, "Dual tape");
    await clickBtn(page, "Dwell");
    await clickBtn(page, "Speed");
    await clickBtn(page, "Employment");
    await clickBtn(page, "PSR wave (2017–19)");
    await clickBtn(page, "All eras");
    await clickBtn(page, "Inflection scatter");
    await page.getByText("Did dwell move first?", { exact: false }).first().waitFor({ timeout: 10000 });
    await clickBtn(page, "Carrier cuts");
    await page.getByText("Carrier employment cuts", { exact: false }).first().waitFor({ timeout: 10000 });
    await clickBtn(page, "≥30%");
    await clickBtn(page, "≥20%");
    await clickBtn(page, "Craft mix");
    await page.getByText("Craft mix under thinner payrolls", { exact: false }).first().waitFor({ timeout: 10000 });
    console.log("✓ panel + era + lens + min-drop controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ rail-headcount-after-precision-scheduling-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
