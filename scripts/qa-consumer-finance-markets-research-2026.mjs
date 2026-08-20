/**
 * QA: consumer-finance-markets-research-2026
 * // viz-types: stacked debt area, saving line, delinquency multi-line, wealth donut, APR composed, liquid cash bars | layout: canvas
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  APR_GAP_PATH,
  DEBT_STOCK_PATH,
  DELINQUENCY_PATH,
  HEADLINE,
  SAVING_RATE_PATH,
  WEALTH_ALLOCATION,
  latestDebtProductShares,
} from "../src/data/consumer-finance-markets-research-2026-data.ts";

assert.equal(HEADLINE.totalHouseholdDebtTn, 18.42);
assert.equal(HEADLINE.cardDelinq90Pct, 7.2);
assert.equal(HEADLINE.mortgageDelinq90Pct, 1.1);
assert.equal(HEADLINE.personalSavingRatePct, 3.9);
assert.equal(HEADLINE.mmfCashTn, 7.85);
assert.ok(DEBT_STOCK_PATH.length >= 5);
assert.ok(DELINQUENCY_PATH.length >= 5);
assert.ok(SAVING_RATE_PATH.length >= 5);
assert.ok(APR_GAP_PATH.length >= 5);
assert.ok(WEALTH_ALLOCATION.length >= 5);
assert.ok(latestDebtProductShares()[0].sharePct > 50);

const root = process.cwd();
const slug = "consumer-finance-markets-research-2026";
const markers = [
  "Consumer finance & household balance sheets — BEA · NY Fed · Z.1",
  "$18.42T in household debt",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4184);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`ok ${m}`);
    }
    for (const label of [
      "Debt stack",
      "Saving rate",
      "Delinquency",
      "Wealth mix",
      "APR gap",
      "Liquid cash",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Delinquency" }).first().click();
    await page.getByRole("button", { name: "Cards" }).first().click();
    await page.getByText("90+ day delinquency", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("ok Delinquency product highlight");
    await page.getByRole("button", { name: "Post-COVID" }).first().click();
    await page.waitForTimeout(300);
    console.log("ok Range toggle");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join("; "));
    }
    console.log(`QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
