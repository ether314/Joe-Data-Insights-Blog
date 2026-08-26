/**
 * QA: state-unclaimed-property-holdings-versus-dollars-returned-2026
 * // viz-types: composed bar+line, scatter, area+line, pie, region composed, grouped bars | layout: default
 * // smoke-marker: Holdings vs returned $
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  HEADLINE,
  NATIONAL_SERIES,
  PROPERTY_TYPE_MIX,
  REGION_SUMMARY,
  RETURN_BANDS,
  STATE_PANEL,
  SUMMARY_TABLE,
} from "../src/data/state-unclaimed-property-holdings-versus-dollars-returned-2026-data.ts";

assert.equal(HEADLINE.nationalStockB, 70);
assert.equal(HEADLINE.nationalReturnedFy2024B, 4.49);
assert.equal(HEADLINE.nationalReturnRatePct, 6.4);
assert.equal(HEADLINE.panelStates, 20);
assert.ok(STATE_PANEL.length === 20);
assert.ok(SUMMARY_TABLE.length === 20);
assert.ok(NATIONAL_SERIES.length >= 6);
assert.equal(NATIONAL_SERIES.at(-1)?.returnedB, 4.49);
assert.ok(PROPERTY_TYPE_MIX.length >= 5);
assert.ok(REGION_SUMMARY.length === 4);
assert.ok(RETURN_BANDS.length === 4);
assert.equal(ANALYTICS.smokeMarker, "Holdings vs returned $");
const mixSum = PROPERTY_TYPE_MIX.reduce((s, b) => s + b.sharePct, 0);
assert.ok(Math.abs(mixSum - 100) < 0.2);
const ny = STATE_PANEL.find((s) => s.abbr === "NY");
assert.ok(ny && ny.holdingsB === 19.0);

const root = process.cwd();
const slug = "state-unclaimed-property-holdings-versus-dollars-returned-2026";
const markers = [
  "Holdings vs returned $",
  "Finance · Holdings vs returned $",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Rate scatter");
    await clickBtn(page, "National path");
    await page.locator("select").nth(0).selectOption("Northeast");
    console.log("→ region Northeast");
    await page.locator("select").nth(1).selectOption("rate");
    console.log("→ sort rate");
    await clickBtn(page, "Property mix");
    await clickBtn(page, "Region stack");
    await clickBtn(page, "Return bands");
    await clickBtn(page, "Holdings ladder");
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
