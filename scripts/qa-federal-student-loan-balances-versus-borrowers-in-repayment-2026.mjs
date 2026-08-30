/**
 * QA: federal-student-loan-balances-versus-borrowers-in-repayment-2026
 * // viz-types: horizontal bar, dual bar, composed area/line/bar, forbearance bars, scatter, pie, delinquency strip | layout: default
 * // smoke-marker: Balance share in repayment
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  FORBEARANCE_ANCHORS,
  HEADLINE,
  IDR_SPLIT,
  QUARTERS,
  STATUS_MIX,
  SUMMARY_TABLE,
} from "../src/data/federal-student-loan-balances-versus-borrowers-in-repayment-2026-data.ts";

assert.equal(HEADLINE.asOfLabel, "Mar 2026");
assert.equal(HEADLINE.portfolioBn, 1640);
assert.equal(HEADLINE.repaymentBn, 633);
assert.equal(HEADLINE.repaymentSharePct, 38.6);
assert.equal(HEADLINE.forbearanceBn, 485);
assert.equal(HEADLINE.defaultBn, 220);
assert.equal(HEADLINE.idrShareOfRepayPlanDollarsPct, 62);
assert.ok(STATUS_MIX.length >= 5);
assert.ok(QUARTERS.length >= 5);
assert.equal(FORBEARANCE_ANCHORS.length, 6);
assert.equal(IDR_SPLIT.length, 2);
assert.equal(SUMMARY_TABLE.length, 5);
assert.equal(ANALYTICS.smokeMarker, "Balance share in repayment");
assert.equal(QUARTERS.at(-1)?.label, "Mar 2026");

const root = process.cwd();
const slug = "federal-student-loan-balances-versus-borrowers-in-repayment-2026";
const markers = [
  "Balance share in repayment",
  "Consumer Finance · Balance share in repayment",
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
    await clickBtn(page, "Dollars vs heads");
    await clickBtn(page, "Repay path");
    await clickBtn(page, "Forbear anchors");
    await clickBtn(page, "Avg balance");
    await clickBtn(page, "IDR split");
    await clickBtn(page, "Delinquency");
    await clickBtn(page, "Recipients");
    await clickBtn(page, "Since Jun 2025");
    await clickBtn(page, "Status mix");
    await clickBtn(page, "Dollars");
    await clickBtn(page, "Full path");
    await auditVizInteractions(page, { slug });
    console.log(
      "✓ federal-student-loan-balances-versus-borrowers-in-repayment-2026 QA passed",
    );
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
