/**
 * QA: afcars-exit-reasons-versus-median-time-in-care-2026
 * // smoke-marker: Exit mix vs median months
 * // viz-types: dual-axis mix+median composed, stacked area exit mix, scatter mix vs median,
 * // duration horizontal bars, permanency pace bars, volume ladder
 * // | controls: panel, mix focus, year window | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL_EXITS,
  FY2023_DURATION_BUCKETS,
  GLANCE_VOLUMES,
  HEADLINE,
  PERMANENCY_PACE,
  VIZ_MARKERS,
} from "../src/data/afcars-exit-reasons-versus-median-time-in-care-2026-data.ts";

assert.equal(HEADLINE.fy2019MedianMonths, 15.5);
assert.equal(HEADLINE.fy2022MedianMonths, 17.5);
assert.equal(HEADLINE.reunificationShareFy2019Pct, 47);
assert.equal(HEADLINE.reunificationShareFy2023Pct, 44);
assert.equal(HEADLINE.adoptionShareFy2023Pct, 27);
assert.ok(ANNUAL_EXITS.length === 5);
assert.ok(GLANCE_VOLUMES.length === 5);
assert.ok(FY2023_DURATION_BUCKETS.length >= 6);
assert.ok(PERMANENCY_PACE.length >= 3);
assert.ok(VIZ_MARKERS.includes("Exit mix vs median months"));
assert.ok(VIZ_MARKERS.includes("Median exit stay 15.5→17.5 months (FY19–FY22)"));

const root = process.cwd();
const slug = "afcars-exit-reasons-versus-median-time-in-care-2026";
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
  const port = Number(process.env.SMOKE_PORT || 4184);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}.html`,
    ];
    let loaded = false;
    for (const url of candidates) {
      const res = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      if (res && res.ok()) {
        loaded = true;
        break;
      }
    }
    assert.ok(loaded, "post HTML not found");

    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 }).catch(() => null);
    await page.getByText(markers[0], { exact: false }).first().waitFor({
      state: "attached",
      timeout: 20000,
    });
    console.log(`✓ ${markers[0]}`);

    await page
      .getByText("Median exit stay 15.5→17.5 months (FY19–FY22)", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Median exit stay 15.5→17.5 months (FY19–FY22)");

    await clickBtn(page, "Exit mix stack");
    await page
      .getByText("Stacked discharge-reason shares", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Scatter");
    await page
      .getByText("Mix share vs median scatter", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "FY23 duration");
    await page
      .getByText("FY2023 time-in-care buckets", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Permanency pace");
    await page
      .getByText("Permanency pace by exit type", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Volume ladder");
    await page
      .getByText("Entries, in-care stock, and exits", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Mix vs median");
    await clickBtn(page, "Adoption share");
    await clickBtn(page, "After FY2019");
    console.log("✓ view controls");

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
