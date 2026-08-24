/**
 * QA: contract-renewal-season-vs-spot-divergence-2026
 * // smoke-marker: Spot–contract spread peak
 * // viz-types: composed dual tape, sector bid bars, cass composed, renewal scatter, equipment bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  EQUIPMENT_SPREADS,
  HEADLINE,
  MONTHLY_TAPE,
  RENEWAL_SCATTER,
  RENEWAL_WINDOWS,
  SECTOR_BIDS,
  VIZ_MARKERS,
} from "../src/data/contract-renewal-season-vs-spot-divergence-2026-data.ts";

assert.equal(HEADLINE.peakVanSpreadUsd, 0.74);
assert.equal(HEADLINE.peakVanSpreadMonth, "2022-07");
assert.equal(HEADLINE.topSector, "Food & beverage");
assert.equal(HEADLINE.topSectorBidLiftPct, 19);
assert.equal(HEADLINE.secondSectorBidLiftPct, 16);
assert.equal(HEADLINE.troughVanSpreadUsd, -0.28);
assert.ok(MONTHLY_TAPE.length >= 20);
assert.ok(SECTOR_BIDS.length >= 8);
assert.ok(RENEWAL_SCATTER.length >= 8);
assert.ok(RENEWAL_WINDOWS.length >= 5);
assert.ok(EQUIPMENT_SPREADS.length === 3);
assert.equal(ANALYTICS.lagMonthsPeakToRenewal, 3);
assert.ok(ANALYTICS.spotBetaVsBidCorr2022 < 0.6);

const root = process.cwd();
const slug = "contract-renewal-season-vs-spot-divergence-2026";
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

    await clickBtn(page, "Dual rate tape");
    await clickBtn(page, "reefer");
    await clickBtn(page, "flatbed");
    await clickBtn(page, "van");
    await clickBtn(page, "Sector bid ladder");
    await clickBtn(page, "Fall 2021");
    await clickBtn(page, "Fall 2023");
    await clickBtn(page, "Fall 2022");
    await clickBtn(page, "Cass vs spread");
    await page.getByText("Cass expenditures", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Renewal scatter");
    await page
      .getByText("Fall-2022 bid lift", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Equipment mix");
    await clickBtn(page, "reefer");

    await auditVizInteractions(page, { slug });
    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
