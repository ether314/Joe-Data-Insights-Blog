/**
 * QA: rent-burden-share-of-renter-income-2026
 * // smoke-marker: Renters above 30% of income
 * // viz-types: metro ladder bars, vintage scatter, national path area+line,
 * // income stacks + state bars, region bars + geo-tier pie | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  GEO_TIERS,
  HEADLINE,
  INCOME_BANDS,
  METRO_ROWS,
  NATIONAL_PATH,
  REGION_ROWS,
  STATE_LADDER,
  VIZ_MARKERS,
} from "../src/data/rent-burden-share-of-renter-income-2026-data.ts";

assert.equal(HEADLINE.nationalBurdenPct2023, 50);
assert.equal(HEADLINE.nationalSeverePct2023, 27);
assert.equal(HEADLINE.burdenedHouseholdsM, 22.6);
assert.equal(HEADLINE.capeCoralBurdenPct, 65);
assert.equal(HEADLINE.miamiBurdenPct, 63);
assert.equal(HEADLINE.top100OverHalfCount, 50);
assert.ok(METRO_ROWS.length >= 18);
assert.ok(NATIONAL_PATH.length >= 7);
assert.ok(REGION_ROWS.length === 4);
assert.ok(INCOME_BANDS.length === 4);
assert.ok(GEO_TIERS.length === 4);
assert.ok(STATE_LADDER.length >= 10);
assert.ok(VIZ_MARKERS.length >= 2);

const root = process.cwd();
const slug = "rent-burden-share-of-renter-income-2026";
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

    await clickBtn(page, "Metro ladder");
    await page.getByText("Metro cost-burden ladder", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "2015 → 2023");
    await page.getByText("vintage scatter", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "National path");
    await page.getByText("National renter burden path", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "By income");
    await page.getByText("Burden by income band", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Regions & tiers");
    await page.getByText("Census region", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("✓ panel controls");

    await page.locator('select[aria-label="Region filter"]').selectOption("South");
    await page.waitForTimeout(300);
    await page.locator('select[aria-label="Sort lens"]').selectOption("delta");
    await page.waitForTimeout(300);
    await clickBtn(page, "Metro ladder");
    console.log("✓ region + sort controls");

    await auditVizInteractions(page, { slug });
    console.log("✓ rent-burden-share-of-renter-income-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
