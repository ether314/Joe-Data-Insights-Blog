/**
 * QA: bank-commercial-credit-concentration-2026
 * // viz-types: bank share bars, concentration curve area+line, CRE cohort composed, CMBS pie, stress scatter, loan dual bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BANK_SHARES,
  CRE_COHORTS,
  HEADLINE,
} from "../src/data/bank-commercial-credit-concentration-2026-data.ts";

assert.equal(HEADLINE.top1BankSharePct, 12.8);
assert.equal(HEADLINE.top3BankSharePct, 33.4);
assert.equal(HEADLINE.topCreCohortPct, 311);
assert.equal(HEADLINE.officeCmbsStressSharePct, 42);
assert.equal(BANK_SHARES[0].short, "JPM");
assert.equal(CRE_COHORTS.find((c) => c.id === "community")?.creCapitalPct, 311);

const root = process.cwd();
const slug = "bank-commercial-credit-concentration-2026";
const markers = [
  "Bank & commercial credit — concentration lens",
  "Domestic bank market shares",
  "Cumulative top-N deposit share",
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
  const port = Number(process.env.SMOKE_PORT || 4184);
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
      '[data-viz="bank-commercial-credit-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "CRE cohorts");
    await clickBtn(page, "CRE PDNA %");
    await clickBtn(page, "Loan-book stress");
    await clickBtn(page, "Delinquency $");
    await clickBtn(page, "CMBS property");
    await clickBtn(page, "Delinquency rate");
    await clickBtn(page, "Bank shares");
    await clickBtn(page, "Assets");
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
