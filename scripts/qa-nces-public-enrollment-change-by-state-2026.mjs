/**
 * QA: nces-public-enrollment-change-by-state-2026
 * // smoke-marker: Enrollment % change 2019–24
 * // viz-types: national path area+line, diverging state bars, enrollment vs
 * // school-age scatter, band mix pie, regional composed bars, gap ladder
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
  GAP_OUTLIERS,
  HEADLINE,
  NATIONAL_PATH,
  REGION_SUMMARY,
  STATE_PANEL,
  TOP_GAINS,
  TOP_LOSSES,
  VIZ_MARKERS,
} from "../src/data/nces-public-enrollment-change-by-state-2026-data.ts";

assert.equal(HEADLINE.stateN, 51);
assert.equal(STATE_PANEL.length, 51);
assert.equal(HEADLINE.usPctChange2019_24, -2.8);
assert.equal(HEADLINE.deepestPct, -8.1);
assert.equal(HEADLINE.deepestState, "West Virginia");
assert.equal(HEADLINE.statesDownOver4, 21);
assert.equal(HEADLINE.statesUp, 9);
assert.equal(
  STATE_PANEL.filter((s) => s.pct2019_24 < -4).length,
  21,
);
assert.equal(
  STATE_PANEL.filter((s) => s.pct2019_24 > 0).length,
  9,
);
assert.ok(NATIONAL_PATH.length >= 6);
assert.ok(REGION_SUMMARY.length === 4);
assert.ok(BAND_MIX.length === 4);
assert.ok(TOP_LOSSES.length >= 10);
assert.ok(TOP_GAINS.length >= 5);
assert.ok(GAP_OUTLIERS.length >= 8);
assert.equal(TOP_LOSSES[0].state, "West Virginia");

const root = process.cwd();
const slug = "nces-public-enrollment-change-by-state-2026";
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

    await clickBtn(page, "National path");
    await page
      .getByText("National path since 2019", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Vs school-age");
    await page
      .getByText("Enrollment vs school-age gap", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Loss bands");
    await page
      .getByText("How many states in each loss band", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Regions");
    await page
      .getByText("Census regions", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Gains");
    await page
      .getByText("States that gained", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "West");
    await clickBtn(page, "Deep ≤−5%");
    await clickBtn(page, "Biggest losses");
    await clickBtn(page, "All");
    console.log("✓ view + region + band controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ nces-public-enrollment-change-by-state-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
