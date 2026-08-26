/**
 * QA: usps-first-class-decline-versus-shipping-packages-2026
 * // smoke-marker: Piece mix vs revenue mix
 * // viz-types: dual-index composed area+line, stacked mix areas,
 * // diverging delta bars, revenue-mix dual pie, RPP dual-axis line,
 * // piece-vs-revenue scatter slope
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DELTA_BARS,
  DETAIL_TABLE,
  HEADLINE,
  INDEX_PATH,
  MIX_PATH,
  RPP_PATH,
  SLOPE_ENDPOINTS,
  VIZ_MARKERS,
  YEARLY,
} from "../src/data/usps-first-class-decline-versus-shipping-packages-2026-data.ts";

assert.equal(YEARLY.length, HEADLINE.yearN);
assert.equal(YEARLY.length, 7);
assert.equal(YEARLY[0].fy, 2019);
assert.equal(YEARLY[6].fy, 2025);
assert.equal(YEARLY[0].fcmPieces, 54943);
assert.equal(YEARLY[6].fcmPieces, 42049);
assert.equal(YEARLY[0].shipRevenue, 22787);
assert.equal(YEARLY[6].shipRevenue, 32580);
assert.equal(HEADLINE.fcmPieceIndex2025, 76.5);
assert.equal(HEADLINE.shipRevIndex2025, 143.0);
assert.equal(HEADLINE.shipRevShare2025, 55.8);
assert.ok(INDEX_PATH.length === 7);
assert.ok(MIX_PATH.length === 7);
assert.ok(RPP_PATH.length === 7);
assert.ok(DELTA_BARS.length >= 4);
assert.ok(SLOPE_ENDPOINTS.length === 2);
assert.ok(DETAIL_TABLE.length === 7);
assert.ok(VIZ_MARKERS.includes("Piece mix vs revenue mix"));

const root = process.cwd();
const slug = "usps-first-class-decline-versus-shipping-packages-2026";
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

    await clickBtn(page, "Piece / revenue mix");
    await page
      .getByText("Revenue mix (FCM + Shipping pair)", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Piece mix");
    await clickBtn(page, "FY2019");
    await clickBtn(page, "Divergence");
    await page
      .getByText("Revenue did not follow pieces", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Rev / piece");
    await page
      .getByText("Revenue per piece", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Scatter");
    await page
      .getByText("First-Class: pieces vs revenue index", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "First-Class only");
    await clickBtn(page, "Shipping only");
    await clickBtn(page, "Both categories");
    await clickBtn(page, "Dual indexes");
    console.log("✓ view + focus + mix controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
