/**
 * QA: credit-outcomes-of-gig-dependent-households-2026
 * // smoke-marker: Delinquency gap vs W-2 — 2.8 pp
 * // viz-types: product gap grouped bars, buffer area+line vintage,
 * // volatility scatter, reliance ladder bars, delinquency gap vintage,
 * // outcome table | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BUFFER_VINTAGE,
  DELINQ_VINTAGE,
  HEADLINE,
  OUTCOME_TABLE,
  PRODUCT_GAPS,
  RELIANCE_LADDER,
  SEGMENTS,
  VOLATILITY_CELLS,
  VIZ_MARKERS,
} from "../src/data/credit-outcomes-of-gig-dependent-households-2026-data.ts";

assert.equal(HEADLINE.delinquencyGapPp, 2.8);
assert.equal(HEADLINE.gigPrimaryCard60DpdPct, 8.4);
assert.equal(HEADLINE.w2Card60DpdPct, 5.6);
assert.equal(HEADLINE.bufferGapPp, 19);
assert.ok(SEGMENTS.length === 3);
assert.ok(PRODUCT_GAPS.length === 4);
assert.ok(BUFFER_VINTAGE.length >= 5);
assert.ok(DELINQ_VINTAGE.length >= 5);
assert.ok(VOLATILITY_CELLS.length >= 9);
assert.ok(RELIANCE_LADDER.length >= 5);
assert.ok(OUTCOME_TABLE.length >= 6);
assert.equal(
  Math.round((HEADLINE.gigPrimaryCard60DpdPct - HEADLINE.w2Card60DpdPct) * 10) /
    10,
  HEADLINE.delinquencyGapPp,
);

const root = process.cwd();
const slug = "credit-outcomes-of-gig-dependent-households-2026";
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
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }

    await clickBtn(page, "Product gaps");
    await clickBtn(page, "Card");
    await clickBtn(page, "All products");
    await clickBtn(page, "Cash buffers");
    await page.getByText("Cash-buffer path", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    await clickBtn(page, "Volatility map");
    await page
      .getByText("Income volatility vs card delinquency", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Gig-primary");
    await clickBtn(page, "All segments");
    await clickBtn(page, "Reliance ladder");
    await clickBtn(page, "$400 buffer");
    await clickBtn(page, "Card 60+ DPD");
    await clickBtn(page, "Gap vintage");
    await page
      .getByText("Card delinquency gap vintage", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Outcome table");
    await page.getByText("Outcome comparison table", { exact: false }).first().waitFor({
      timeout: 10000,
    });

    await auditVizInteractions(page, { slug });
    console.log("✓ viz interaction audit");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
  console.log(`\nQA passed: ${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
