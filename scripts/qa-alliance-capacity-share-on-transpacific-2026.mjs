/**
 * QA: alliance-capacity-share-on-transpacific-2026
 * // viz-types: alliance bars, pie, stacked coast, carrier bars, scatter, composed path/fleet | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ALLIANCE_SHARES,
  ANALYTICS,
  CARRIER_LADDER,
  COAST_SPLIT,
  CONCENTRATION_PATH,
  HEADLINE,
  VIZ_MARKERS,
} from "../src/data/alliance-capacity-share-on-transpacific-2026-data.ts";

assert.equal(HEADLINE.oceanSharePct, 35.3);
assert.equal(HEADLINE.premierSharePct, 21.4);
assert.equal(HEADLINE.geminiSharePct, 17);
assert.equal(HEADLINE.top3AlliancePct, 73.7);
assert.equal(HEADLINE.geminiTeu, 884_500);
assert.ok(ALLIANCE_SHARES.length >= 12);
assert.ok(CARRIER_LADDER.length >= 8);
assert.ok(COAST_SPLIT.length >= 2);
assert.ok(CONCENTRATION_PATH.length >= 3);
assert.equal(ANALYTICS.oceanSharePct, 35.3);

const root = process.cwd();
const slug = "alliance-capacity-share-on-transpacific-2026";
const markers = [...VIZ_MARKERS];

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

    const selects = page.locator("select");
    assert.ok((await selects.count()) >= 2, "expected >=2 select controls");
    await selects.nth(0).selectOption({ value: "carriers" });
    await page.waitForTimeout(250);
    await selects.nth(1).selectOption({ value: "2025-01" });
    await page.waitForTimeout(250);
    await selects.nth(0).selectOption({ value: "coast" });
    await page.waitForTimeout(250);
    // Return to alliance ladder (descending share) before interaction audit
    await selects.nth(0).selectOption({ value: "ladder" });
    await selects.nth(1).selectOption({ value: "2026-01" });
    await page.waitForTimeout(400);
    console.log("✓ panel + vintage controls");

    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log(`qa-${slug}: PASS`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
