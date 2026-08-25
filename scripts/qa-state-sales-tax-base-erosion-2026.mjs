/**
 * QA: state-sales-tax-base-erosion-2026
 * // viz-types: composed area+line, pie, horizontal bar, scatter, horizontal bar, composed bar+line | layout: default
 * // smoke-marker: Base leak to services
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  DECADE_DELTAS,
  EROSION_SERIES,
  HEADLINE,
  LEAK_COMPOSITION,
  SERVICE_CATEGORIES,
  STATE_PANEL,
  SUMMARY_TABLE,
} from "../src/data/state-sales-tax-base-erosion-2026-data.ts";

assert.equal(HEADLINE.escapedSharePct, 54.8);
assert.equal(HEADLINE.escapedShare1970Pct, 38.2);
assert.equal(HEADLINE.escapeRisePp, 16.6);
assert.equal(HEADLINE.mixShiftContributionPp, 12.4);
assert.equal(HEADLINE.medianServicesTaxed, 40);
assert.equal(HEADLINE.ftaSurveyItems, 176);
assert.ok(EROSION_SERIES.length >= 10);
assert.equal(EROSION_SERIES.at(-1)?.escapedSharePct, 54.8);
assert.ok(LEAK_COMPOSITION.length === 4);
assert.ok(SERVICE_CATEGORIES.length >= 6);
assert.ok(STATE_PANEL.length >= 20);
assert.ok(SUMMARY_TABLE.length >= 10);
assert.ok(DECADE_DELTAS.length >= 4);
assert.equal(ANALYTICS.smokeMarker, "Base leak to services");
const leakSum = LEAK_COMPOSITION.reduce((s, b) => s + b.sharePct, 0);
assert.ok(Math.abs(leakSum - 100) < 0.2);

const root = process.cwd();
const slug = "state-sales-tax-base-erosion-2026";
const markers = [
  "Base leak to services",
  "Economics · Base leak to services",
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
    await clickBtn(page, "Leak mix");
    await clickBtn(page, "State ladder");
    await clickBtn(page, "Midwest");
    await clickBtn(page, "FTA services");
    await clickBtn(page, "Rate vs breadth");
    await clickBtn(page, "South");
    await clickBtn(page, "Service leaks");
    await clickBtn(page, "Decade deltas");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Escaped %");
    await clickBtn(page, "Erosion path");
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
