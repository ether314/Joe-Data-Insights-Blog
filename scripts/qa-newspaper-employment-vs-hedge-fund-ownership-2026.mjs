/**
 * QA: newspaper-employment-vs-hedge-fund-ownership-2026
 * // smoke-marker: Newsroom jobs vs ownership
 * // viz-types: national composed, cohort bars, county scatter, acquisition lines, region gap bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ACQUISITION_EVENTS,
  COUNTY_PANEL,
  HEADLINE,
  NATIONAL_EMPLOYMENT,
  OWNER_COHORTS,
  REGION_GAPS,
} from "../src/data/newspaper-employment-vs-hedge-fund-ownership-2026-data.ts";

assert.equal(HEADLINE.industryJobs2024, 91_550);
assert.equal(HEADLINE.hedgeCountyMedianDecline2012_24Pct, 62);
assert.equal(HEADLINE.independentCountyMedianDecline2012_24Pct, 41);
assert.equal(HEADLINE.hedgeVsIndepGapPp, 21);
assert.ok(NATIONAL_EMPLOYMENT.length >= 8);
assert.ok(OWNER_COHORTS.length >= 4);
assert.ok(COUNTY_PANEL.length >= 16);
assert.ok(ACQUISITION_EVENTS.length >= 4);
assert.ok(REGION_GAPS.length >= 4);
assert.equal(OWNER_COHORTS.find((c) => c.id === "hedge_pe")?.medianDeclinePct, 62);

const root = process.cwd();
const slug = "newspaper-employment-vs-hedge-fund-ownership-2026";
const markers = [
  "Newsroom jobs vs ownership",
  "Median county employment decline by remaining-paper owner",
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
  const port = Number(process.env.SMOKE_PORT || 4182);
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
    await clickBtn(page, "National jobs");
    await clickBtn(page, "County scatter");
    await clickBtn(page, "Post-deal path");
    await clickBtn(page, "Region gaps");
    await clickBtn(page, "Owner cohorts");
    await clickBtn(page, "Hedge/PE");
    await clickBtn(page, "Midwest");
    await clickBtn(page, "All");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 16,
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
