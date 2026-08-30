/**
 * QA: cdc-heat-related-deaths-versus-noaa-extreme-heat-days-2026
 * // viz-types: dual-axis composed, scatter, rolling areas, era radar, agency gap bars, tercile bars | layout: default
 * // smoke-marker: Heat deaths vs CONUS hot-summer footprint
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AGENCY_GAP,
  ANNUAL,
  ERA_COMPARE,
  HEADLINE,
  HOT_TERCILES,
  ROLLING_5YR,
  VIZ_MARKERS,
} from "../src/data/cdc-heat-related-deaths-versus-noaa-extreme-heat-days-2026-data.ts";

assert.equal(HEADLINE.peakYear, 2023);
assert.equal(HEADLINE.peakDeaths, 2325);
assert.equal(HEADLINE.startDeaths, 1069);
assert.equal(HEADLINE.peakVsStartPct, 117);
assert.equal(HEADLINE.joinpointYear, 2016);
assert.equal(HEADLINE.periodTotalDeaths, 21518);
assert.equal(HEADLINE.nws2023Fatalities, 555);
assert.equal(ANNUAL.length, 25);
assert.equal(
  ANNUAL.reduce((s, r) => s + r.heatDeaths, 0),
  21518,
);
assert.equal(ANNUAL[0].year, 1999);
assert.equal(ANNUAL.at(-1)?.year, 2023);
assert.equal(ERA_COMPARE.length, 2);
assert.ok(ROLLING_5YR.length >= 20);
assert.equal(HOT_TERCILES.length, 3);
assert.ok(AGENCY_GAP.length >= 6);
assert.equal(VIZ_MARKERS[0], "Heat deaths vs CONUS hot-summer footprint");

const root = process.cwd();
const slug = "cdc-heat-related-deaths-versus-noaa-extreme-heat-days-2026";
const markers = [
  "Heat deaths vs CONUS hot-summer footprint",
];

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
    await clickBtn(page, "Scatter");
    await clickBtn(page, "5-yr means");
    await clickBtn(page, "Era radar");
    await clickBtn(page, "CDC vs NWS");
    await clickBtn(page, "Hot terciles");
    await clickBtn(page, "Deaths vs footprint");
    await clickBtn(page, "NWS fatalities");
    await clickBtn(page, "CDC deaths");
    await clickBtn(page, "Hot nights on");
    await clickBtn(page, "Hot nights off");
    await auditVizInteractions(page, { slug });
    console.log("✓ cdc-heat-related-deaths-versus-noaa-extreme-heat-days-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
