/**
 * QA: imls-library-visits-versus-electronic-circulation-2026
 * // smoke-marker: Visits vs e-circ index
 * // viz-types: dual-track composed area+line, state quadrant scatter,
 * // quadrant pie, dual-decline bars, locale grouped bars, substitution ladder
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DUAL_DECLINE_STATES,
  HEADLINE,
  LOCALE_ROWS,
  NATIONAL_PATH,
  QUADRANT_MIX,
  REGION_SUMMARY,
  STATE_PANEL,
  TOP_SUBSTITUTION,
  VIZ_MARKERS,
} from "../src/data/imls-library-visits-versus-electronic-circulation-2026-data.ts";

assert.equal(HEADLINE.stateN, 51);
assert.equal(STATE_PANEL.length, 51);
assert.equal(HEADLINE.visitsIndex2023, 67);
assert.equal(HEADLINE.eCircIndex2023, 153);
assert.equal(HEADLINE.visitsDownEcircUp, 38);
assert.equal(HEADLINE.dualDecline, 7);
assert.equal(HEADLINE.bothUp, 4);
assert.equal(
  STATE_PANEL.filter((s) => s.quadrant === "visits-down-ecirc-up").length,
  38,
);
assert.equal(
  STATE_PANEL.filter((s) => s.quadrant === "both-down").length,
  7,
);
assert.equal(DUAL_DECLINE_STATES.length, 7);
assert.ok(NATIONAL_PATH.length >= 6);
assert.ok(LOCALE_ROWS.length === 4);
assert.ok(REGION_SUMMARY.length === 4);
assert.ok(QUADRANT_MIX.length === 4);
assert.ok(TOP_SUBSTITUTION.length >= 8);
assert.ok(HEADLINE.medianECircGrowthPct === 84);

const root = process.cwd();
const slug = "imls-library-visits-versus-electronic-circulation-2026";
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

    await clickBtn(page, "State quadrant");
    await clickBtn(page, "Gap (e − visits)");
    await page
      .getByText("State quadrant map", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Locale");
    await page
      .getByText("Locale visits recovery", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Dual decline");
    await page
      .getByText("Dual-decline states", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Substitution");
    await page
      .getByText("Largest visit–e-circ gaps", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Regions");
    await page
      .getByText("Regional median indexes", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "South");
    await clickBtn(page, "Dual ↓");
    await clickBtn(page, "Dual track");
    await clickBtn(page, "All");
    console.log("✓ view + region + quadrant controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ imls-library-visits-versus-electronic-circulation-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
