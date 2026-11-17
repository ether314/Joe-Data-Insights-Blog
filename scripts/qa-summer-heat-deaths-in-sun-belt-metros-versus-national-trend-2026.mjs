/**
 * QA: summer-heat-deaths-in-sun-belt-metros-versus-national-trend-2026
 * // smoke-marker: Metro share of heat-coded deaths
 * // viz-types: metro share bars, national composed trend, rate-vs-heat scatter,
 * // Sun Belt attribution stack, detail table
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BELT_STACK,
  DETAIL_TABLE,
  HEADLINE,
  METRO_PANEL,
  NATIONAL_PERIOD_DEATHS,
  NATIONAL_SERIES,
  VIZ_MARKERS,
} from "../src/data/summer-heat-deaths-in-sun-belt-metros-versus-national-trend-2026-data.ts";

assert.equal(METRO_PANEL.length, HEADLINE.metroPanelN);
assert.equal(METRO_PANEL.length, 12);
assert.equal(DETAIL_TABLE.length, 12);
assert.ok(NATIONAL_SERIES.length >= 6);
assert.equal(NATIONAL_PERIOD_DEATHS, HEADLINE.nationalPeriodDeaths);
assert.equal(HEADLINE.national2023, 2325);
assert.equal(HEADLINE.national2018, 1008);
assert.equal(HEADLINE.phoenixDeaths, 648);
assert.equal(HEADLINE.lasVegasDeaths, 391);
assert.ok(HEADLINE.top2SharePct > 10);
assert.ok(HEADLINE.coreSunBeltSharePct > 14);
assert.ok(BELT_STACK.length >= 6);
assert.ok(VIZ_MARKERS.includes("Metro share of heat-coded deaths"));

const root = process.cwd();
const slug =
  "summer-heat-deaths-in-sun-belt-metros-versus-national-trend-2026";
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
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      // Markers appear across panels; click through to surface each.
      if (m.includes("National")) await clickBtn(page, "National trend");
      else if (m.includes("Rate vs")) await clickBtn(page, "Rate vs heat");
      else if (m.includes("Sun Belt")) await clickBtn(page, "Sun Belt stack");
      else await clickBtn(page, "Metro share");

      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }

    await clickBtn(page, "Detail table");
    await page
      .getByText("Metro detail", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Metro share");
    await clickBtn(page, "By share");
    await clickBtn(page, "By rate");
    await clickBtn(page, "By deaths");
    console.log("✓ panel + sort controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
