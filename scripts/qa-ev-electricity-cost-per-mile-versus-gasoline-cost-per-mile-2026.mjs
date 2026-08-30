/**
 * QA: ev-electricity-cost-per-mile-versus-gasoline-cost-per-mile-2026
 * // smoke-marker: EV vs gasoline cents per mile
 * // viz-types: dual cents/mi lines, EV sensitivity heatmap, regional scatter,
 * // break-even mpg contour
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BREAK_EVEN_CURVE,
  HEADLINE,
  NATIONAL_SERIES,
  REGION_COMPARE,
  REFERENCE_TABLE,
  SCENARIOS,
  VIZ_MARKERS,
} from "../src/data/ev-electricity-cost-per-mile-versus-gasoline-cost-per-mile-2026-data.ts";

assert.equal(HEADLINE.residentialCentsPerKwh, 17.3);
assert.equal(HEADLINE.regularGasDollarsPerGal, 3.097);
assert.equal(HEADLINE.typicalEvKwhPerMile, 0.3);
assert.equal(HEADLINE.typicalIceMpg, 28);
assert.equal(HEADLINE.evCentsPerMile, 5.19);
assert.equal(HEADLINE.iceCentsPerMile, 11.06);
assert.ok(NATIONAL_SERIES.length >= 8);
assert.equal(NATIONAL_SERIES.at(-1)?.year, 2025);
assert.ok(REGION_COMPARE.length >= 5);
assert.ok(BREAK_EVEN_CURVE.length >= 5);
assert.ok(REFERENCE_TABLE.length >= 5);
assert.ok(SCENARIOS.length >= 4);
assert.ok(VIZ_MARKERS.includes("National cents-per-mile dual line"));

const root = process.cwd();
const slug = "ev-electricity-cost-per-mile-versus-gasoline-cost-per-mile-2026";
const markers = ["EV vs gasoline cents per mile", ...VIZ_MARKERS];

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
      .getByText("EV vs gasoline cents per mile", { exact: false })
      .first()
      .waitFor({ state: "attached", timeout: 20000 });
    console.log("✓ EV vs gasoline cents per mile");

    await clickBtn(page, "National trend");
    await page
      .getByText("National cents-per-mile dual line", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "EV sensitivity");
    await page
      .getByText("Efficiency sensitivity heatmap", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "PADD regions");
    await page
      .getByText("PADD regional cost scatter", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Break-even mpg");
    await page
      .getByText("Break-even mpg contour", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });

    await page.locator("select").first().selectOption("west-coast");
    await page.locator('input[type="range"]').nth(0).fill("22");
    await page.locator('input[type="range"]').nth(2).fill("0.28");
    console.log("✓ view + scenario + slider controls");

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
