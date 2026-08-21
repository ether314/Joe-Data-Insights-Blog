/**
 * QA: geopolitics-institutions-concentration-2026q3
 * // viz-types: HHI bars, delta dumbbells, Lorenz area+line, ranked share bars, consent path lines, institution compare bars, region donut, veto stacked area, vote×GDP scatter, blocking bars | layout: default
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
} from "../src/data/geopolitics-institutions-concentration-2026q3-data.ts";

assert.equal(HEADLINE.imfTop1Pct, 16.5);
assert.equal(HEADLINE.imfTop3Pct, 28.7);
assert.equal(HEADLINE.imfTop5Pct, 40.0);
assert.equal(HEADLINE.quotaConsentPct, 76.66);
assert.equal(HEADLINE.quotaDeltaPp, 3.88);
assert.equal(HEADLINE.usConsented, false);
assert.equal(HEADLINE.relativeSharesMoved, false);
assert.equal(SCOREBOARD.length, 4);
assert.equal(CONSENT_METERS[0].id, "quota");
assert.equal(VOTE_SHARES[0].id, "us");
assert.equal(VOTE_SHARES[0].consented16th, false);

const root = process.cwd();
const slug = "geopolitics-institutions-concentration-2026q3";
const markers = [
  "Institutions & governance — Q3 2026 concentration lens",
  "Prior → Q3 concentration deltas",
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
    await page.waitForSelector(
      '[data-viz="geopolitics-institutions-concentration-2026q3"]',
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
    await clickBtn(page, "Consent gate");
    await clickBtn(page, "NAB (→90%)");
    await clickBtn(page, "Quota (→85%)");
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
