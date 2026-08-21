/**
 * QA: consumer-finance-markets-concentration-2026
 * // viz-types: Lorenz area+line, wealth share bars, asset-lens grouped bars, issuer pie, lens scatter, revolving vs equity contrast | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  ISSUER_SHARES,
  WEALTH_SHARES,
} from "../src/data/consumer-finance-markets-concentration-2026-data.ts";

assert.equal(HEADLINE.top1WealthSharePct, 30.5);
assert.equal(HEADLINE.top10WealthSharePct, 67.5);
assert.equal(HEADLINE.top1EquitySharePct, 54);
assert.equal(HEADLINE.top3IssuerSharePct, 52);
assert.equal(HEADLINE.bottom50WealthSharePct, 2.5);
assert.equal(WEALTH_SHARES[0].sharePct, 30.5);
assert.equal(ISSUER_SHARES[0].short, "Chase");

const root = process.cwd();
const slug = "consumer-finance-markets-concentration-2026";
const markers = [
  "Consumer finance — concentration lens",
  "Cumulative share vs equal split",
  "Wealth percentile ladder",
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
    await page.waitForSelector(
      '[data-viz="consumer-finance-markets-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Asset lenses");
    await clickBtn(page, "Top 10%");
    await clickBtn(page, "Save vs borrow");
    await clickBtn(page, "Equities only");
    await clickBtn(page, "Card issuers");
    await clickBtn(page, "Wealth ladder");
    await clickBtn(page, "$ trillions");
    await clickBtn(page, "Issuer ranks");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
