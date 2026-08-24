/**
 * QA: oecd-strike-days-per-1-000-employees-2026
 * // smoke-marker: Days not worked per 1,000
 * // viz-types: horizontal intensity ladder, multi-line trend, diverging bump bars, baseline-vs-recent scatter, intensity-band donut | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BAND_COUNTS,
  COUNTRY_LATEST,
  HEADLINE,
  TREND_SERIES,
  VIZ_MARKERS,
  bumpRows,
  scatterPairs,
} from "../src/data/oecd-strike-days-per-1-000-employees-2026-data.ts";

assert.ok(HEADLINE.canada2023 > 350);
assert.ok(HEADLINE.finland2022 > 350);
assert.ok(HEADLINE.uk2024 < 30);
assert.ok(HEADLINE.germany2024 < 20);
assert.ok(COUNTRY_LATEST.length >= 18);
assert.ok(TREND_SERIES.length >= 40);
assert.ok(bumpRows().length >= 8);
assert.ok(scatterPairs().length >= 8);
assert.ok(BAND_COUNTS.high + BAND_COUNTS.elevated >= 3);
assert.equal(VIZ_MARKERS.root, "oecd-strike-days-root");

const can = COUNTRY_LATEST.find((c) => c.iso3 === "CAN");
assert.ok(can && can.post2022Bump === true);
const swe = COUNTRY_LATEST.find((c) => c.iso3 === "SWE");
assert.ok(swe && swe.latestRate < 2);

const root = process.cwd();
const slug = "oecd-strike-days-per-1-000-employees-2026";

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(250);
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
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}.html`,
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}/index.html`,
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
    assert.ok(loaded, "post HTML not found under out/blog");

    await page.waitForSelector(`[data-viz="${VIZ_MARKERS.root}"]`, {
      timeout: 20000,
    });
    await page.getByText("Days not worked per 1,000", { exact: false }).first().waitFor({
      state: "attached",
      timeout: 20000,
    });
    console.log("✓ Days not worked per 1,000");

    await clickBtn(page, "Intensity ladder");
    await page.waitForSelector(`[data-viz="${VIZ_MARKERS.panelLadder}"]`, {
      timeout: 8000,
    });
    await clickBtn(page, "2022–24 avg");
    await clickBtn(page, "Europe");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Country trends");
    await page.waitForSelector(`[data-viz="${VIZ_MARKERS.panelTrend}"]`, {
      timeout: 8000,
    });
    await clickBtn(page, "Post-2022 bump");
    await page.waitForSelector(`[data-viz="${VIZ_MARKERS.panelBump}"]`, {
      timeout: 8000,
    });
    await clickBtn(page, "Baseline vs recent");
    await page.waitForSelector(`[data-viz="${VIZ_MARKERS.panelScatter}"]`, {
      timeout: 8000,
    });
    await clickBtn(page, "Intensity bands");
    await page.waitForSelector(`[data-viz="${VIZ_MARKERS.panelBands}"]`, {
      timeout: 8000,
    });

    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
