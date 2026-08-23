/**
 * QA: cement-clinker-process-emissions-by-country-2026
 * // viz-types: process rank bars, share ladder bars, intensity-vs-volume composed, region donut, process-intensity scatter, clinker-ratio line | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTRY_PROCESS_2023,
  HEADLINE,
  INTENSITY_VS_VOLUME,
  REGION_PROCESS,
  SHARE_LADDER,
  VIZ_MARKERS,
} from "../src/data/cement-clinker-process-emissions-by-country-2026-data.ts";

assert.equal(HEADLINE.top3SharePct, 61.4);
assert.equal(HEADLINE.top3ProcessMt, 912);
assert.equal(HEADLINE.globalProcessMt, 1485);
assert.equal(HEADLINE.chinaProcessMt, 718);
assert.equal(HEADLINE.indiaProcessMt, 152);
assert.equal(HEADLINE.vietnamProcessMt, 42);
assert.ok(COUNTRY_PROCESS_2023.length >= 12);
assert.ok(SHARE_LADDER.length >= 4);
assert.ok(INTENSITY_VS_VOLUME.length >= 6);
assert.ok(REGION_PROCESS.length >= 4);
assert.ok(
  Math.abs(
    COUNTRY_PROCESS_2023.reduce((s, r) => s + r.processMt, 0) -
      HEADLINE.globalProcessMt,
  ) < 1,
);

const root = process.cwd();
const slug = "cement-clinker-process-emissions-by-country-2026";
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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Rank & ladder");
    await clickBtn(page, "Process Mt");
    await clickBtn(page, "Cement Mt");
    await clickBtn(page, "Intensity");
    await clickBtn(page, "Asia");
    await clickBtn(page, "All");
    await clickBtn(page, "Intensity vs volume");
    await clickBtn(page, "Regions");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Rank & ladder");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 14,
      maxCharts: 4,
    });
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
