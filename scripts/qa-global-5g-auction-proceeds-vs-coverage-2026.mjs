/**
 * QA: global-5g-auction-proceeds-vs-coverage-2026
 * // viz-types: price-coverage scatter, proceeds area, top-price bars, obligation composed, quadrant bars, band averages | layout: default
 * // smoke-marker: $ per MHz-pop vs coverage
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTRY_AWARDS,
  GLOBAL_PROCEEDS,
  HEADLINE,
  auctionOnly,
} from "../src/data/global-5g-auction-proceeds-vs-coverage-2026-data.ts";

assert.equal(HEADLINE.usCbandUsdPerMhzPop, 0.875);
assert.equal(HEADLINE.peakYearProceedsB, 140.1);
assert.equal(HEADLINE.brazilCoveragePct, 95);
assert.ok(COUNTRY_AWARDS.length >= 15);
assert.ok(auctionOnly().length >= 12);
assert.ok(GLOBAL_PROCEEDS.length >= 5);

const root = process.cwd();
const slug = "global-5g-auction-proceeds-vs-coverage-2026";
const markers = [
  "$ per MHz-pop vs coverage",
  "Price vs coverage",
  "Global proceeds",
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
  const port = Number(process.env.SMOKE_PORT || 4188);
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
    await clickBtn(page, "Top $/MHz-pop");
    await clickBtn(page, "Global proceeds");
    await clickBtn(page, "Obligations");
    await clickBtn(page, "Quadrants");
    await clickBtn(page, "Band averages");
    await clickBtn(page, "Incl. admin");
    await clickBtn(page, "Auctions + hybrid");
    await clickBtn(page, "Price vs coverage");
    await clickBtn(page, "Log $");
    await clickBtn(page, "Linear $");
    await clickBtn(page, "Europe");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
  console.log(`✓ QA passed for ${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
