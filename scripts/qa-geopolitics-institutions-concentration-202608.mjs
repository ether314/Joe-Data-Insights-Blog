/**
 * QA: geopolitics-institutions-concentration-202608
 * // viz-types: HHI bars, Q3→Aug delta bars, Lorenz area+line, ranked share bars, consent+clock path lines, institution compare bars, region donut, veto stacked area, vote×GDP scatter, blocking bars, Diriyah tip-impact table | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  SCOREBOARD,
  CONSENT_METERS,
  VOTE_SHARES,
  DIRIYAH_ROWS,
} from "../src/data/geopolitics-institutions-concentration-202608-data.ts";

assert.equal(HEADLINE.imfTop1Pct, 16.5);
assert.equal(HEADLINE.imfTop3Pct, 28.7);
assert.equal(HEADLINE.imfTop5Pct, 40.0);
assert.equal(HEADLINE.quotaConsentPct, 76.66);
assert.equal(HEADLINE.quotaDeltaPpVsQ3, 0);
assert.equal(HEADLINE.daysRemaining, 87);
assert.equal(HEADLINE.windowElapsedPct, 54.5);
assert.equal(HEADLINE.usConsented, false);
assert.equal(HEADLINE.relativeSharesMoved, false);
assert.equal(SCOREBOARD.length, 4);
assert.equal(CONSENT_METERS[0].id, "quota");
assert.equal(VOTE_SHARES[0].id, "us");
assert.equal(VOTE_SHARES[0].consented16th, false);
assert.ok(DIRIYAH_ROWS.length >= 3);

const root = process.cwd();
const slug = "geopolitics-institutions-concentration-202608";
const markers = [
  "Institutions & governance — August 202608 concentration lens",
  "Q3 → August concentration deltas",
  "Cross-perimeter HHI map",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(150);
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
    await page.waitForSelector(
      '[data-viz="geopolitics-institutions-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Vote ladder");
    await clickBtn(page, "IMF vote %");
    await clickBtn(page, "Cumulative %");
    await clickBtn(page, "Equal-split line");
    await clickBtn(page, "Clock & consent");
    await clickBtn(page, "Quota (→85%)");
    await clickBtn(page, "NAB (→90%)");
    await clickBtn(page, "Days to gate");
    await page
      .getByText("Diriyah principles vs tip dilution", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Diriyah principles vs tip dilution");
    await clickBtn(page, "Block & veto");
    await page
      .getByText("Who can block an 85% special majority", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Who can block an 85% special majority");
    await clickBtn(page, "Scoreboard");
    await clickBtn(page, "Top-1");
    await clickBtn(page, "HHI");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
