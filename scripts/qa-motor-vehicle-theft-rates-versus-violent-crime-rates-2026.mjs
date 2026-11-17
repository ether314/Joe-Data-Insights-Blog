/**
 * QA: motor-vehicle-theft-rates-versus-violent-crime-rates-2026
 * // viz-types: dual-index composed, gap area, regional bars, state scatter, offense-mix composed, volume+NCVS dual-axis | layout: default
 * // smoke-marker: MV theft vs violent index
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  DUAL_SERIES,
  HEADLINE,
  STATE_PANEL,
} from "../src/data/motor-vehicle-theft-rates-versus-violent-crime-rates-2026-data.ts";

assert.equal(ANALYTICS.smokeMarker, "MV theft vs violent index");
assert.equal(HEADLINE.mvtIndex2023, 144.9);
assert.equal(HEADLINE.violentIndex2023, 99.2);
assert.equal(HEADLINE.peakGapPoints, 45.7);
assert.equal(HEADLINE.mvtIndex2024, 117.7);
assert.ok(DUAL_SERIES.length >= 10);
assert.ok(STATE_PANEL.length >= 12);
assert.ok(
  DUAL_SERIES.every(
    (r) =>
      Number.isFinite(r.mvtRate) &&
      Number.isFinite(r.violentRate) &&
      Number.isFinite(r.gapPoints),
  ),
);

const root = process.cwd();
const slug = "motor-vehicle-theft-rates-versus-violent-crime-rates-2026";
const markers = ["MV theft vs violent index"];

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
    await clickBtn(page, "Divergence gap");
    await clickBtn(page, "Regional Δ");
    await clickBtn(page, "State scatter");
    await clickBtn(page, "Offense mix");
    await clickBtn(page, "Volume + NCVS");
    await clickBtn(page, "Dual index");
    await clickBtn(page, "rate");
    await clickBtn(page, "index");
    await page.locator("select").first().selectOption("post2019");
    await page.waitForTimeout(200);
    await page.locator("select").nth(1).selectOption("west");
    await page.waitForTimeout(200);
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
