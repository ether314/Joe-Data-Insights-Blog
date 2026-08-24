/**
 * QA: rural-hospital-closures-and-drive-times-2026
 * // smoke-marker: Added drive minutes post-closure
 * // viz-types: vintage stacked area+cumulative line, state ladder bars,
 * // county before/after scatter, drive-band bars, region composed,
 * // margin-stress composed | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTY_DRIVES,
  DRIVE_BANDS,
  HEADLINE,
  MARGIN_STRESS,
  REGION_SUMMARY,
  STATE_LADDER,
  VINTAGE_PATH,
  VIZ_MARKERS,
} from "../src/data/rural-hospital-closures-and-drive-times-2026-data.ts";

assert.equal(HEADLINE.totalClosuresConversions, 197);
assert.equal(HEADLINE.completeClosures, 109);
assert.equal(HEADLINE.convertedClosures, 88);
assert.equal(HEADLINE.medianAddedDriveMin, 22);
assert.equal(HEADLINE.shareAddedGe30Pct, 38);
assert.equal(HEADLINE.texasClosures, 25);
assert.ok(VINTAGE_PATH.length >= 15);
assert.ok(STATE_LADDER.length >= 12);
assert.ok(COUNTY_DRIVES.length >= 12);
assert.ok(DRIVE_BANDS.length === 4);
assert.ok(REGION_SUMMARY.length === 4);
assert.ok(MARGIN_STRESS.length >= 8);
assert.equal(
  VINTAGE_PATH[VINTAGE_PATH.length - 1].cumulative,
  HEADLINE.totalClosuresConversions,
);

const root = process.cwd();
const slug = "rural-hospital-closures-and-drive-times-2026";
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

    await clickBtn(page, "County drive times");
    await clickBtn(page, "Added minutes");
    await clickBtn(page, "After minutes");
    await clickBtn(page, "South");
    await clickBtn(page, "Complete");
    await clickBtn(page, "All kinds");
    await clickBtn(page, "Closure vintage");
    await page.getByText("Closure vintage path", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "State ladder");
    await page.getByText("State closure ladder", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Added-minute bands");
    await page.getByText("Added-minute bands", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Margin stress");
    await page.getByText("Margin stress vs closure flow", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("✓ panel + region + kind + lens controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ rural-hospital-closures-and-drive-times-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
