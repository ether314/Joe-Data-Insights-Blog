/**
 * QA: us-crushed-stone-vs-construction-put-in-place-2026
 * // viz-types: area+line composed, intensity area, gap bars, division bars, radar, pie, scatter | layout: default
 * // smoke-marker: Headline — tonnage vs real CIP
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL_PANEL,
  CRUSHED_USE_MIX,
  DIVISION_CRUSHED_2024,
  HEADLINE,
  INDEX_GAP,
  INTENSITY_PATH,
  UNIT_VALUES,
} from "../src/data/us-crushed-stone-vs-construction-put-in-place-2026-data.ts";

assert.equal(HEADLINE.intensity2024, 1.49);
assert.equal(HEADLINE.intensity2019, 1.76);
assert.equal(HEADLINE.crushedStone2024Mt, 1480);
assert.equal(HEADLINE.sandGravel2024Mt, 900);
assert.equal(HEADLINE.totalAggregates2024Gt, 2.38);
assert.equal(HEADLINE.aggregatesYoYPct, -6);
assert.ok(ANNUAL_PANEL.length >= 8);
assert.ok(INDEX_GAP.length === ANNUAL_PANEL.length);
assert.ok(INTENSITY_PATH.length === ANNUAL_PANEL.length);
assert.ok(DIVISION_CRUSHED_2024.length >= 8);
assert.ok(CRUSHED_USE_MIX.length >= 4);
assert.ok(UNIT_VALUES.length >= 4);
assert.ok(ANALYTICS.caveats.length >= 3);

const root = process.cwd();
const slug = "us-crushed-stone-vs-construction-put-in-place-2026";
const markers = [
  "Headline — tonnage vs real CIP",
  "1.49 Mt per $B real CIP in 2024",
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
    await clickBtn(page, "Crushed stone");
    await clickBtn(page, "Sand & gravel");
    await clickBtn(page, "Total aggregates");
    await clickBtn(page, "Nominal CIP");
    await clickBtn(page, "Both CIP");
    await clickBtn(page, "Real CIP");
    await clickBtn(page, "Intensity + gap");
    await clickBtn(page, "Division map");
    await clickBtn(page, "Midwest");
    await clickBtn(page, "South");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Crushed-stone uses");
    await clickBtn(page, "Price vs intensity");
    await clickBtn(page, "Tonnage vs CIP index");
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
