/**
 * QA: catalogued-orbital-debris-growth-2026
 * // viz-types: composed stacked bars+line, grouped density bars, horizontal stacked regime bars, scatter, pie, area+lines growth index | layout: default
 * // smoke-marker: Catalogue grew — but active sats grew faster
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ALTITUDE_BANDS,
  CATALOG_PATH,
  CLASS_MIX_2024,
  FRAGMENTATION_MILESTONES,
  GROWTH_INDEX,
  HEADLINE,
  REGIME_COMPOSITION,
} from "../src/data/catalogued-orbital-debris-growth-2026-data.ts";

assert.equal(HEADLINE.cataloguedTrackedEnd2024, 40000);
assert.equal(HEADLINE.activePayloadsEsaEnd2024, 11000);
assert.equal(HEADLINE.catalogPerActiveEsa, 3.64);
assert.equal(HEADLINE.newFragments2024, 3000);
assert.ok(CATALOG_PATH.length >= 10);
assert.ok(ALTITUDE_BANDS.length >= 6);
assert.ok(REGIME_COMPOSITION.length >= 8);
assert.ok(GROWTH_INDEX.length >= 6);
assert.ok(CLASS_MIX_2024.length >= 4);
assert.ok(FRAGMENTATION_MILESTONES.length >= 3);

const root = process.cwd();
const slug = "catalogued-orbital-debris-growth-2026";
const markers = [
  "Catalogue grew — but active sats grew faster",
  "Technology · Orbital debris catalogue",
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
  const port = Number(process.env.SMOKE_PORT || 4184);
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
    await clickBtn(page, "Catalogue path");
    await clickBtn(page, "Pre-constellation ≤2018");
    await clickBtn(page, "Constellation era ≥2019");
    await clickBtn(page, "Full path");
    await clickBtn(page, "Altitude density");
    await clickBtn(page, "Active only");
    await clickBtn(page, "Debris only");
    await clickBtn(page, "Active + debris");
    await clickBtn(page, "Regime ladder");
    await clickBtn(page, "Band scatter");
    await clickBtn(page, "Class mix");
    await clickBtn(page, "Growth index");
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
