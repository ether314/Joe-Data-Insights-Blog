/**
 * QA: consumer-finance-markets-concentration-202608
 * // viz-types: top-1/top-3 grouped bars, tip scatter, liquid path+donut, save-borrow grouped+mirror, issuer cumulative area, debt stress dual bars, vintage delta bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DEBT_PRODUCTS,
  HEADLINE,
  ISSUER_SHARES,
  TOP_SHARE_SCOREBOARD,
  WEALTH_SHARES,
} from "../src/data/consumer-finance-markets-concentration-202608-data.ts";

assert.equal(HEADLINE.top1WealthSharePct, 30.5);
assert.equal(HEADLINE.top10WealthSharePct, 67.5);
assert.equal(HEADLINE.top1EquitySharePct, 54);
assert.equal(HEADLINE.top3IssuerSharePct, 52);
assert.equal(HEADLINE.top1DebtProductSharePct, 70.1);
assert.equal(HEADLINE.mmfTn, 7.928);
assert.equal(HEADLINE.mmfDeltaBn, -92);
assert.equal(HEADLINE.g19RevolvingTn, 1.351);
assert.equal(WEALTH_SHARES[0].sharePct, 30.5);
assert.equal(DEBT_PRODUCTS[0].short, "Mortgage");
assert.equal(ISSUER_SHARES[0].short, "Chase");
assert.ok(TOP_SHARE_SCOREBOARD.length >= 5);

const root = process.cwd();
const slug = "consumer-finance-markets-concentration-202608";
const markers = [
  "Consumer finance — Aug 202608 concentration lens",
  "Concentration scoreboard",
  "Top-1 vs thick-top scatter",
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
      '[data-viz="consumer-finance-markets-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Liquid tape");
    await clickBtn(page, "Moved");
    await clickBtn(page, "Sticky tip");
    await clickBtn(page, "All meters");
    await clickBtn(page, "Save vs borrow");
    await clickBtn(page, "By revolving");
    await clickBtn(page, "By deposits");
    await clickBtn(page, "By equities");
    await clickBtn(page, "Firms & products");
    await clickBtn(page, "$ trillions");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Top-1 / top-3");
    await clickBtn(page, "Top 3");
    await clickBtn(page, "Thick top");
    await clickBtn(page, "Top 1%");
    await clickBtn(page, "Hide");
    await clickBtn(page, "Show");
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
