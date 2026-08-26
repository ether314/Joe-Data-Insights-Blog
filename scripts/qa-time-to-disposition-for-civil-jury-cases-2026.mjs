/**
 * QA: time-to-disposition-for-civil-jury-cases-2026
 * // viz-types: area band national path, horizontal state ladder, clearance scatter, diverging slowdown bars, grouped regional years | layout: default
 * // smoke-marker: Headline — median 495 days to disposition
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  BACKLOG_SCATTER,
  HEADLINE,
  NATIONAL_PATH,
  REGION_AGG,
  REGIONAL_YEAR_PATH,
  SLOWDOWN_LADDER,
  STATE_PANEL,
} from "../src/data/time-to-disposition-for-civil-jury-cases-2026-data.ts";

assert.equal(HEADLINE.medianDays2023, 495);
assert.equal(HEADLINE.medianDays2021, 640);
assert.equal(HEADLINE.medianDays2019, 420);
assert.equal(HEADLINE.pctAbove2019, 18);
assert.equal(HEADLINE.pctDownFromPeak, 23);
assert.equal(HEADLINE.statesInPanel, 22);
assert.ok(NATIONAL_PATH.length >= 6);
assert.ok(STATE_PANEL.length >= 20);
assert.ok(BACKLOG_SCATTER.length >= 20);
assert.ok(REGION_AGG.length === 4);
assert.ok(REGIONAL_YEAR_PATH.length >= 12);
assert.ok(SLOWDOWN_LADDER.length >= 20);
assert.equal(ANALYTICS.slowest2023.abbr, "NY");
assert.ok(ANALYTICS.statesGotSlower >= 10);

const root = process.cwd();
const slug = "time-to-disposition-for-civil-jury-cases-2026";
const markers = [
  "Headline — median 495 days to disposition",
  "civil jury disposition time",
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
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "State ladder");
    await clickBtn(page, "South");
    await clickBtn(page, "2021 peak");
    await clickBtn(page, "Include estimates");
    await clickBtn(page, "Disclosed only");
    await clickBtn(page, "All panel states");
    await clickBtn(page, "Slower vs 2019 only");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Clearance scatter");
    await clickBtn(page, "Slowdown delta");
    await clickBtn(page, "Regional years");
    await clickBtn(page, "Disposition band");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
