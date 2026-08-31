/**
 * QA: credit-card-interest-rates-versus-new-account-openings-2026
 * // viz-types: dual-axis composed, APR×accounts scatter, annual bars, underwriting dual-line, regime comparison bars | layout: default
 * // smoke-marker: All-accounts APR 20.94%
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL,
  HEADLINE,
  QUARTERLY,
  REGIMES,
  SCATTER,
  VIZ_MARKERS,
} from "../src/data/credit-card-interest-rates-versus-new-account-openings-2026-data.ts";

assert.equal(HEADLINE.latestAprAllPct, 20.94);
assert.equal(HEADLINE.peakAprAllPct, 21.76);
assert.equal(HEADLINE.latestNewAccountsM, 17.12);
assert.equal(HEADLINE.peakNewAccountsM, 20.86);
assert.equal(HEADLINE.accountsBelowPeakPct, 17.9);
assert.ok(QUARTERLY.length >= 20);
assert.ok(ANNUAL.length >= 5);
assert.ok(SCATTER.length >= 15);
assert.ok(REGIMES.length >= 3);
assert.ok(VIZ_MARKERS.length >= 3);

const root = process.cwd();
const slug = "credit-card-interest-rates-versus-new-account-openings-2026";
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
    await clickBtn(page, "APR vs openings path");
    await clickBtn(page, "All accounts");
    await clickBtn(page, "Assessed interest");
    await clickBtn(page, "2021+");
    await clickBtn(page, "2019+");
    await clickBtn(page, "APR × accounts");
    await clickBtn(page, "Annual openings");
    await clickBtn(page, "Underwriting mix");
    await clickBtn(page, "Rate regimes");
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed", err);
  process.exit(1);
});
