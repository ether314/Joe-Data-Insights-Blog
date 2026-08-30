/**
 * QA: credit-card-90-day-delinquency-versus-revolving-balances-2026
 * // smoke-marker: Card 90+ vs revolving balances
 * // viz-types: dual-axis line/area, indexed divergence ribbon, product bars, scatter
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ERA_SNAPSHOTS,
  HEADLINE,
  PRODUCT_COMPARE,
  QUARTERS,
  REFERENCE_TABLE,
  VIZ_MARKERS,
} from "../src/data/credit-card-90-day-delinquency-versus-revolving-balances-2026-data.ts";

assert.equal(HEADLINE.card90FlowPct, 6.97);
assert.equal(HEADLINE.revolvingBn, 1351.1);
assert.equal(HEADLINE.card90PeakPct, 7.18);
assert.equal(HEADLINE.card90TroughPct, 3.04);
assert.equal(HEADLINE.latestLabel, "2026Q2");
assert.ok(QUARTERS.length >= 30);
assert.equal(QUARTERS.at(-1)?.label, "2026Q2");
assert.equal(QUARTERS.at(-1)?.card90Flow, 6.97);
assert.ok(PRODUCT_COMPARE.length >= 4);
assert.ok(ERA_SNAPSHOTS.length >= 4);
assert.ok(REFERENCE_TABLE.length >= 8);
assert.ok(VIZ_MARKERS.includes("Dual-axis stress vs stock"));

const root = process.cwd();
const slug = "credit-card-90-day-delinquency-versus-revolving-balances-2026";
const markers = ["Card 90+ vs revolving balances", ...VIZ_MARKERS];

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
  const port = Number(process.env.SMOKE_PORT || 4182);
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
      .getByText("Card 90+ vs revolving balances", { exact: false })
      .first()
      .waitFor({ state: "attached", timeout: 20000 });
    console.log("✓ Card 90+ vs revolving balances");

    await clickBtn(page, "Stress vs stock");
    await page
      .getByText("Dual-axis stress vs stock", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });

    await page.locator("select").first().selectOption("recent");
    await page.locator('input[type="checkbox"]').first().check();
    console.log("✓ view + range + checkbox controls");

    await clickBtn(page, "Indexed gap");
    await page
      .getByText("Indexed divergence ribbon", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Product ladder");
    await page
      .getByText("Product 90+ comparison", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Balance scatter");
    await page
      .getByText("Balance–stress scatter", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Stress vs stock");

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
