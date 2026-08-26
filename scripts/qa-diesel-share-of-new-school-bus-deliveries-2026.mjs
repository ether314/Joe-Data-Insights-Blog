/**
 * QA: diesel-share-of-new-school-bus-deliveries-2026
 * // smoke-marker: Diesel share of new deliveries
 * // viz-types: stacked fuel-mix bars, diesel-share composed area+line,
 * // body-style horizontal stacked bars, CSB award bars, OEM-vs-CSB scatter
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BODY_FUEL_MIX_2023_24,
  BODY_STYLES,
  CYCLE_FUEL,
  CSB_AWARDS,
  HEADLINE,
  OEM_VS_CSB,
  TABLE_ROWS,
  VIZ_MARKERS,
} from "../src/data/diesel-share-of-new-school-bus-deliveries-2026-data.ts";

assert.equal(HEADLINE.dieselSharePct, 66.1);
assert.equal(HEADLINE.dieselUnits, 26_677);
assert.equal(HEADLINE.totalUnits, 40_345);
assert.equal(HEADLINE.electricSharePct, 7.2);
assert.equal(HEADLINE.dieselShareDeltaPpVs2022_23, 6.5);
assert.ok(CYCLE_FUEL.length >= 4);
assert.equal(CYCLE_FUEL.at(-1)?.dieselSharePct, 66.1);
assert.ok(BODY_STYLES.length >= 3);
assert.ok(BODY_FUEL_MIX_2023_24.length >= 3);
assert.ok(CSB_AWARDS.length >= 3);
assert.ok(OEM_VS_CSB.length >= 3);
assert.ok(TABLE_ROWS.length >= 4);
assert.ok(VIZ_MARKERS.includes("Fuel-mix stacked cycle bars"));

const root = process.cwd();
const slug = "diesel-share-of-new-school-bus-deliveries-2026";
const markers = ["Diesel share of new deliveries", ...VIZ_MARKERS];

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
    await page
      .getByText("Diesel share of new deliveries", { exact: false })
      .first()
      .waitFor({ state: "attached", timeout: 20000 });
    console.log("✓ Diesel share of new deliveries");

    await clickBtn(page, "Fuel mix");
    await page
      .getByText("Fuel-mix stacked cycle bars", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Diesel share");
    await page
      .getByText("Diesel share trend line", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "By body type");
    await page
      .getByText("Type body-style composition", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "CSB awards");
    await page
      .getByText("CSB awards vs OEM electric", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "OEM vs CSB");
    await page
      .getByText("OEM EV vs diesel-share scatter", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });

    await page.locator("select").nth(0).selectOption("2024-25");
    await page.locator("select").nth(1).selectOption("diesel");
    await page.locator("select").nth(1).selectOption("all");
    console.log("✓ view + cycle + fuel controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
    void markers;
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
