/**
 * QA: platform-earnings-swings-and-household-reliance-2026
 * // smoke-marker: Month-over-month platform earnings swing
 * // viz-types: swing bars, reliance bands, participation composed,
 * // sector medians, substitute bars, SHED attitudes | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  PARTICIPATION_PATH,
  PLATFORM_TYPES,
  RELIANCE_BANDS,
  SECTOR_INCOME_SHARE,
  SECTOR_MEDIAN_EARN,
  SECTOR_PARTICIPATION,
  SHED_ATTITUDES,
  SHED_MIX,
  SWING_SCENARIOS,
  VIZ_MARKERS,
} from "../src/data/platform-earnings-swings-and-household-reliance-2026-data.ts";

assert.equal(HEADLINE.laborActiveMonthsPct, 56);
assert.equal(HEADLINE.capitalActiveMonthsPct, 32);
assert.equal(HEADLINE.laborAvgActiveEarn, 533);
assert.equal(HEADLINE.laborShareOfIncomePct, 33);
assert.equal(HEADLINE.laborRelianceGt75Pct, 25);
assert.equal(HEADLINE.medianDriverSharePct, 10);
assert.equal(HEADLINE.peakMonthlyParticipationPct, 2.5);
assert.equal(HEADLINE.covidTroughMonthlyPct, 1.9);
assert.equal(HEADLINE.shedWishConsistentPlatformPct, 61);
assert.ok(PARTICIPATION_PATH.length >= 10);
assert.ok(SECTOR_PARTICIPATION.length >= 5);
assert.ok(SECTOR_MEDIAN_EARN.length >= 6);
assert.ok(SECTOR_INCOME_SHARE.length >= 5);
assert.ok(RELIANCE_BANDS.length === 4);
assert.ok(PLATFORM_TYPES.length === 2);
assert.ok(SWING_SCENARIOS.length >= 4);
assert.ok(SHED_MIX.length >= 4);
assert.ok(SHED_ATTITUDES.length >= 3);

const root = process.cwd();
const slug = "platform-earnings-swings-and-household-reliance-2026";
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

    await clickBtn(page, "Earnings swings");
    await clickBtn(page, "Reliance bands");
    await clickBtn(page, "Labor");
    await clickBtn(page, "Capital");
    await clickBtn(page, "Both");
    await clickBtn(page, "Participation path");
    await page.getByText("Monthly vs trailing-year", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Sector medians");
    await page.getByText("Median monthly platform revenue", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Substitute vs supplement");
    await page.getByText("Labor substitutes", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Fed SHED attitudes");
    await page.getByText("Fed SHED 2024", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("✓ panel + filter controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ platform-earnings-swings-and-household-reliance-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
