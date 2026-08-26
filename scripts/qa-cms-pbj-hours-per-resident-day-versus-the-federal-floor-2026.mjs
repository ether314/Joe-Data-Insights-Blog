/**
 * QA: cms-pbj-hours-per-resident-day-versus-the-federal-floor-2026
 * // smoke-marker: Share below HPRD floor
 * // viz-types: floor-gap bars, state scatter, quarterly area+line,
 * // gap-band pie, ownership grouped bars, size ladder, urban-rural
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  FLOOR_GAP_ROWS,
  GAP_BANDS,
  HEADLINE,
  OWNERSHIP_COMPLIANCE,
  QUARTERLY_PATH,
  SIZE_BAND_ROWS,
  STATE_PANEL,
  URBAN_RURAL,
  VIZ_MARKERS,
} from "../src/data/cms-pbj-hours-per-resident-day-versus-the-federal-floor-2026-data.ts";

assert.equal(HEADLINE.below348Pct, 35.6);
assert.equal(HEADLINE.atOrAbove348Pct, 64.4);
assert.equal(HEADLINE.reportingHomes, 14573);
assert.equal(HEADLINE.meanTotalHprd, 3.75);
assert.equal(HEADLINE.belowNaPct, 70);
assert.equal(HEADLINE.floorTotal, 3.48);
assert.ok(FLOOR_GAP_ROWS.length >= 4);
assert.ok(STATE_PANEL.length >= 48);
assert.ok(QUARTERLY_PATH.length >= 6);
assert.ok(GAP_BANDS.length >= 5);
assert.ok(OWNERSHIP_COMPLIANCE.length === 3);
assert.ok(SIZE_BAND_ROWS.length >= 4);
assert.ok(URBAN_RURAL.length === 2);
assert.ok(VIZ_MARKERS.includes("Share below HPRD floor"));

const root = process.cwd();
const slug = "cms-pbj-hours-per-resident-day-versus-the-federal-floor-2026";
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

    await clickBtn(page, "State HPRD map");
    await page.getByText("State HPRD vs 3.48 line", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Y: % contract");
    await clickBtn(page, "South");
    await clickBtn(page, "Sort: mean HPRD");
    await clickBtn(page, "Quarterly path");
    await page
      .getByText("Share below HPRD floor — quarterly path", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Distance bands");
    await page.getByText("Distance from the 3.48 floor", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Ownership");
    await page
      .getByText("Ownership: below-floor vs component compliance", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Size & rural");
    await page
      .getByText("Below-floor share by bed-size band", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Floor gaps");
    console.log("✓ panel + region + lens controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
