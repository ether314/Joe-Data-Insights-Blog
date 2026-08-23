/**
 * QA: us-nevi-corridor-gaps-2026
 * // viz-types: pie, bar, composed area+line, radar, scatter, bucket bars | layout: default
 * // smoke-marker: Unqualified AFC miles
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  BUILDOUT_PATH,
  COVERAGE_MIX,
  FAILURE_MODES,
  GAP_BUCKETS,
  HEADLINE,
  REGION_ROLLUP,
  STATE_GAPS,
} from "../src/data/us-nevi-corridor-gaps-2026-data.ts";

assert.equal(HEADLINE.unqualifiedSharePct, 38.4);
assert.equal(HEADLINE.afcMilesNational, 82_250);
assert.equal(HEADLINE.unqualifiedMiles, 31_604);
assert.equal(HEADLINE.qualifiedMiles, 50_646);
assert.ok(STATE_GAPS.length >= 45);
assert.ok(REGION_ROLLUP.length === 4);
assert.ok(COVERAGE_MIX.length === 2);
assert.ok(FAILURE_MODES.length >= 4);
assert.ok(GAP_BUCKETS.length === 4);
assert.ok(BUILDOUT_PATH.length >= 5);
assert.ok(ANALYTICS.top5GapMiles > 0);
assert.ok(ANALYTICS.westGapSharePct > 40);

const root = process.cwd();
const slug = "us-nevi-corridor-gaps-2026";
const markers = ["Unqualified AFC miles", "38.4%"];

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
    await clickBtn(page, "State gaps");
    await clickBtn(page, "West");
    await clickBtn(page, "Gap %");
    await clickBtn(page, "Gap miles");
    await clickBtn(page, "All");
    await clickBtn(page, "Build-out path");
    await clickBtn(page, "Failure modes");
    await clickBtn(page, "Ports vs gaps");
    await clickBtn(page, "Gap bands");
    await clickBtn(page, "Coverage mix");
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
