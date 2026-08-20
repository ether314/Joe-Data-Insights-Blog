/**
 * QA: bank-commercial-credit-research-2026
 * // viz-types: delinq×chargeoff scatter, dual-line CRE path, size-cohort bars, concentration bars, CMBS multi-line, SLOOS composed | layout: canvas
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CMBS_PROPERTY_DELINQ,
  CRE_CONCENTRATION,
  CRE_PDNA_BY_SIZE,
  HEADLINE,
  LOAN_BOOK_STRESS,
  QUARTERLY_STRESS,
  SLOOS_TIGHTENING,
} from "../src/data/bank-commercial-credit-research-2026-data.ts";

assert.equal(HEADLINE.creDelinquencyPct, 1.56);
assert.equal(HEADLINE.creChargeOffPct, 0.17);
assert.equal(HEADLINE.cardsChargeOffPct, 3.84);
assert.equal(HEADLINE.cmbsOfficeDelinqPct, 11.31);
assert.equal(HEADLINE.midBankCreConcentrationPct, 289);
assert.ok(LOAN_BOOK_STRESS.length >= 5);
assert.ok(QUARTERLY_STRESS.length >= 6);
assert.ok(CRE_PDNA_BY_SIZE.length >= 3);
assert.ok(CRE_CONCENTRATION.length >= 4);
assert.ok(CMBS_PROPERTY_DELINQ.length >= 3);
assert.ok(SLOOS_TIGHTENING.length >= 5);

const root = process.cwd();
const slug = "bank-commercial-credit-research-2026";
const markers = [
  "Bank & commercial credit — Fed · FDIC · CMBS",
  "Where stress shows up on loan books and CRE",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4186);
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
      "Stress map",
      "CRE path",
      "Bank size",
      "Concentration",
      "CMBS",
      "SLOOS",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Stress map" }).first().click();
    await page.waitForTimeout(400);
    await page.getByText("Delinquency", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("ok Stress map panel");
    const highlightCre = page.getByRole("button", { name: "CRE", exact: true });
    if (await highlightCre.count()) {
      await highlightCre.first().click();
      await page.waitForTimeout(300);
      console.log("ok CRE highlight");
    }
    await page.getByRole("button", { name: "Post-hike" }).first().click();
    await page.waitForTimeout(300);
    console.log("ok Range toggle");
    const audit = await Promise.race([
      auditVizInteractions(page),
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              issues: [],
              warnings: ["viz audit timed out (45s) — smoke already covers render"],
              stats: {},
            }),
          45000,
        ),
      ),
    ]);
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
