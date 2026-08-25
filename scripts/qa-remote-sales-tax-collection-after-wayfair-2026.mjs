/**
 * QA: remote-sales-tax-collection-after-wayfair-2026
 * // viz-types: composed area+line, area, pie, horizontal bar, scatter, grouped bar, step line | layout: default
 * // smoke-marker: Remote-collection share
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ADOPTION_SERIES,
  CHANNEL_MIX_FY2025,
  COLLECTION_SERIES,
  HEADLINE,
  OFFSET_BANDS,
  STATE_PANEL,
  SUMMARY_TABLE,
} from "../src/data/remote-sales-tax-collection-after-wayfair-2026-data.ts";

assert.equal(HEADLINE.remoteSharePct, 11.4);
assert.equal(HEADLINE.remoteShare2017Pct, 2.1);
assert.equal(HEADLINE.remoteShareRisePp, 9.3);
assert.equal(HEADLINE.statesFullyOffset, 4);
assert.equal(HEADLINE.cumulativeRemoteRecoveryB, 49.2);
assert.equal(HEADLINE.cumulativeErosionDragB, 44.0);
assert.equal(HEADLINE.netOffsetB, 5.2);
assert.ok(COLLECTION_SERIES.length >= 10);
assert.equal(COLLECTION_SERIES.at(-1)?.remoteSharePct, 11.4);
assert.equal(COLLECTION_SERIES.at(-1)?.cumRecoveryB, 49.2);
assert.equal(COLLECTION_SERIES.at(-1)?.cumErosionB, 44.0);
assert.ok(CHANNEL_MIX_FY2025.length === 3);
assert.ok(STATE_PANEL.length >= 12);
assert.ok(SUMMARY_TABLE.length >= 12);
assert.ok(ADOPTION_SERIES.length >= 8);
assert.ok(OFFSET_BANDS.length === 3);
assert.equal(ANALYTICS.smokeMarker, "Remote-collection share");
const channelSum = CHANNEL_MIX_FY2025.reduce((s, b) => s + b.sharePct, 0);
assert.ok(Math.abs(channelSum - 100) < 0.2);

const root = process.cwd();
const slug = "remote-sales-tax-collection-after-wayfair-2026";
const markers = [
  "Remote-collection share",
  "Economics · Remote-collection share",
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
    await clickBtn(page, "Channel mix");
    await clickBtn(page, "State ladder");
    await page.locator("select").nth(0).selectOption("midwest");
    console.log("→ region midwest");
    await page.locator("select").nth(1).selectOption("netOffset");
    console.log("→ sort netOffset");
    await clickBtn(page, "Offset scatter");
    await clickBtn(page, "Recovery stack");
    await clickBtn(page, "Nexus adoption");
    await clickBtn(page, "Share path");
    await clickBtn(page, "Cumulative offset");
    await clickBtn(page, "Share + dollars");
    await page.locator("select").nth(0).selectOption("all");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues?.length > 0) {
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
