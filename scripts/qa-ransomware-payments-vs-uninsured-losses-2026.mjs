/**
 * QA: ransomware-payments-vs-uninsured-losses-2026
 * // viz-types: stacked horiz bars, donut+composed, bar+line meters, stacked cost bars, scatter, sector bars | layout: default
 * // smoke-marker: Insured share of ransomware loss
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL_METERS,
  FUNDING_MIX_ILLUSTRATION,
  HEADLINE,
  INSURED_SHARE_BANDS,
  NAIC_CYBER_MARKET,
  SECTOR_PRESSURE,
  SIZE_SHARE_SCATTER,
  SOPHOS_STACK_PATH,
} from "../src/data/ransomware-payments-vs-uninsured-losses-2026-data.ts";

assert.equal(HEADLINE.insuredShareOfIncidentCostPct, 32);
assert.equal(HEADLINE.cashFundedSharePct, 68);
assert.equal(HEADLINE.smeInsuredSharePct, 69);
assert.equal(HEADLINE.largeInsuredSharePct, 27);
assert.equal(HEADLINE.chainalysisPayments2023UsdB, 1.25);
assert.equal(HEADLINE.ic3Losses2023UsdM, 59.6);
assert.ok(ANNUAL_METERS.length >= 6);
assert.ok(INSURED_SHARE_BANDS.length >= 3);
assert.ok(FUNDING_MIX_ILLUSTRATION.length >= 2);
assert.ok(SOPHOS_STACK_PATH.length >= 3);
assert.ok(NAIC_CYBER_MARKET.length >= 5);
assert.ok(SIZE_SHARE_SCATTER.length >= 3);
assert.ok(SECTOR_PRESSURE.length >= 5);
assert.equal(ANALYTICS.insuredShareOfIncidentCostPct, 32);

const root = process.cwd();
const slug = "ransomware-payments-vs-uninsured-losses-2026";
const markers = [
  "Insured share of ransomware loss",
  "Finance · Cyber risk markets",
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
    await clickBtn(page, "Insured share");
    await clickBtn(page, "Funding mix");
    await clickBtn(page, "Payment meters");
    await clickBtn(page, "Payments path");
    await clickBtn(page, "IC3 gap multiple");
    await clickBtn(page, "Cost stack");
    await clickBtn(page, "Dollars");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Size scatter");
    await clickBtn(page, "Sector pressure");
    await auditVizInteractions(page, { slug });
    console.log("✓ ransomware-payments-vs-uninsured-losses-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
