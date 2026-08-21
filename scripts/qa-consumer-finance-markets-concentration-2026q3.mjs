/**
 * QA: consumer-finance-markets-concentration-2026q3
 * // viz-types: HHI bars, Lorenz area+line, debt-product stacked+pie, vintage slope lines, lens scatter, liquid donut | layout: default
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
  HHI_BY_LENS,
  ISSUER_SHARES,
  WEALTH_SHARES,
} from "../src/data/consumer-finance-markets-concentration-2026q3-data.ts";

assert.equal(HEADLINE.top1WealthSharePct, 30.5);
assert.equal(HEADLINE.top10WealthSharePct, 67.5);
assert.equal(HEADLINE.top1EquitySharePct, 54);
assert.equal(HEADLINE.equityHhi, 4150);
assert.equal(HEADLINE.top1DebtProductSharePct, 70.1);
assert.equal(HEADLINE.top3DebtProductSharePct, 87.9);
assert.equal(HEADLINE.top3IssuerSharePct, 52);
assert.equal(HEADLINE.mmfTn, 8.02);
assert.equal(WEALTH_SHARES[0].sharePct, 30.5);
assert.equal(DEBT_PRODUCTS[0].short, "Mortgage");
assert.equal(ISSUER_SHARES[0].short, "Chase");
assert.ok(HHI_BY_LENS.length >= 4);

const root = process.cwd();
const slug = "consumer-finance-markets-concentration-2026q3";
const markers = [
  "Consumer finance — Q3 concentration lens",
  "Concentration index by ledger",
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
    await page.waitForSelector(
      '[data-viz="consumer-finance-markets-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Wealth ladder");
    await clickBtn(page, "$ trillions");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Hide");
    await clickBtn(page, "Show");
    await clickBtn(page, "Vintage slope");
    await clickBtn(page, "Top-1 wealth");
    await clickBtn(page, "Top-10 wealth");
    await clickBtn(page, "Top-1 equity");
    await clickBtn(page, "Debt products");
    await clickBtn(page, "$ trillions");
    await clickBtn(page, "Share %");
    await clickBtn(page, "HHI map");
    await clickBtn(page, "Top 10%");
    await clickBtn(page, "Bottom 50%");
    await clickBtn(page, "Top 1%");
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
