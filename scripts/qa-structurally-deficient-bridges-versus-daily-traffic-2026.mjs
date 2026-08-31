/**
 * QA: structurally-deficient-bridges-versus-daily-traffic-2026
 * // smoke-marker: Poor-share trend vs deck area
 * // viz-types: dual-line poor-share trend, condition stacked bars,
 * // functional-class grouped exposure bars, state scatter, crossing area stack
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CONDITION_MIX,
  DETAIL_TABLE,
  FUNCTIONAL_CLASSES,
  HEADLINE,
  POOR_ADT_SUM,
  STATE_PANEL,
  VIZ_MARKERS,
} from "../src/data/structurally-deficient-bridges-versus-daily-traffic-2026-data.ts";

assert.equal(STATE_PANEL.length, HEADLINE.panelN);
assert.equal(STATE_PANEL.length, 24);
assert.equal(DETAIL_TABLE.length, 8);
assert.equal(CONDITION_MIX.length, 3);
assert.equal(FUNCTIONAL_CLASSES.length, 12);
assert.equal(HEADLINE.poorBridges, 42_080);
assert.equal(HEADLINE.poorSharePct, 6.75);
assert.equal(HEADLINE.dailyCrossingsPoorM, 168.5);
assert.equal(HEADLINE.poorCrossingSharePct, 3.4);
assert.ok(Math.abs(POOR_ADT_SUM - 168_605_928) < 2);
assert.ok(VIZ_MARKERS.includes("Poor-share trend vs deck area"));

const root = process.cwd();
const slug = "structurally-deficient-bridges-versus-daily-traffic-2026";
const markers = [...VIZ_MARKERS];

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

    await clickBtn(page, "Functional class ADT exposure");
    await page
      .getByText("Functional class ADT exposure", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Urban");
    await clickBtn(page, "State poor share scatter");
    await clickBtn(page, "Daily crossing split");
    await clickBtn(page, "Condition mix treemap");
    await clickBtn(page, "Deck area");

    await auditVizInteractions(page, slug);
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
