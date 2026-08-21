/**
 * QA: fiscal-industrial-policy-concentration-2026q3
 * // viz-types: HHI bars, Lorenz area+line, sectoral stacked bars, vintage slope, toolkit donut, lens scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  HHI_BY_LENS,
  JUNE_FLOW,
  PACKAGE_SHARES,
  STOCK_SHARES,
  US_SECTOR_PACKAGES,
} from "../src/data/fiscal-industrial-policy-concentration-2026q3-data.ts";

assert.equal(HEADLINE.top3StockSharePct, 63);
assert.equal(HEADLINE.top1StockSharePct, 24);
assert.equal(HEADLINE.top1PackageSharePct, 71);
assert.equal(HEADLINE.top3PackageSharePct, 93);
assert.equal(HEADLINE.packageHhi, 5320);
assert.equal(HEADLINE.usIraShareOfUsPct, 83);
assert.equal(HEADLINE.juneTop3SharePct, 38);
assert.equal(HEADLINE.juneRestSharePct, 62);
assert.equal(STOCK_SHARES[0].sharePct, 24);
assert.equal(PACKAGE_SHARES[0].short, "US");
assert.equal(JUNE_FLOW[0].sharePct, 20);
assert.equal(US_SECTOR_PACKAGES[0].short, "IRA TE");
assert.ok(HHI_BY_LENS.length >= 4);

const root = process.cwd();
const slug = "fiscal-industrial-policy-concentration-2026q3";
const markers = [
  "Fiscal & industrial policy — Q3 concentration lens",
  "HHI by concentration lens",
  "Top-1 vs top-3 scatter",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(150);
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
    await page.waitForSelector(
      '[data-viz="fiscal-industrial-policy-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Share ladders");
    await clickBtn(page, "Package dollars");
    await clickBtn(page, "Stock counts");
    await clickBtn(page, "Sectoral packages");
    await page
      .getByText("US sectoral stack — IRA TE vs CHIPS", { exact: false })
      .first()
      .waitFor({ timeout: 20000 });
    console.log("✓ US sectoral stack — IRA TE vs CHIPS");
    await clickBtn(page, "USD billions");
    await clickBtn(page, "% of universe");
    await clickBtn(page, "Vintage slope");
    await clickBtn(page, "Top-1 %");
    await clickBtn(page, "HHI radar");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-fiscal-industrial-policy-concentration-2026q3: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
