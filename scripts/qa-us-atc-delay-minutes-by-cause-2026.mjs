/**
 * QA: us-atc-delay-minutes-by-cause-2026
 * // viz-types: stacked-area shares, year donut, staffing bars+scatter, concentration line, dual-lens bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL_BY_CAUSE,
  HEADLINE,
  STAFFING_FACILITIES_2024,
} from "../src/data/us-atc-delay-minutes-by-cause-2026-data.ts";

assert.equal(HEADLINE.totalMinutes2024, 16_065_315);
assert.equal(HEADLINE.weatherSharePct2024, 61.4);
assert.equal(HEADLINE.staffingMinutes2024, 622_669);
assert.equal(HEADLINE.staffingSharePct2024, 3.9);
assert.equal(HEADLINE.staffingTop7SharePct, 86);
assert.equal(HEADLINE.core30MinutesSharePct, 92.1);
assert.equal(HEADLINE.delays2024, 359_694);
assert.equal(ANNUAL_BY_CAUSE.length, 10);
assert.equal(ANNUAL_BY_CAUSE.at(-1)?.year, 2024);
assert.equal(STAFFING_FACILITIES_2024.length, 7);
assert.equal(STAFFING_FACILITIES_2024[0].id, "EWR");

const root = process.cwd();
const slug = "us-atc-delay-minutes-by-cause-2026";
const markers = [
  "US ATC delay minutes by cause — aviation ops lens",
  "Cause share of delay minutes, 2015-2024",
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
    await page.waitForSelector(
      '[data-viz="us-atc-delay-minutes-by-cause-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ state: 'attached', timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Share %");
    await clickBtn(page, "Minutes");
    await clickBtn(page, "2023");
    await clickBtn(page, "2024");
    await clickBtn(page, "Staffing tail");
    await clickBtn(page, "OPSNET vs BTS");
    await clickBtn(page, "Cause mix");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
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
