/**
 * QA: federal-student-loan-balances-versus-borrowers-in-repayment-2026
 * // viz-types: status stacked area, forbearance path composed, recipient×dollar scatter, active-repay pie, IDR dual bars, status ladder bars | layout: default
 * // smoke-marker: 39% of ED-managed dollars in repayment
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  FORBEARANCE_PATH,
  HEADLINE,
  IDR_VINTAGE,
  RECIPIENT_VS_DOLLAR,
  STATUS_MARCH_2026,
  STATUS_VINTAGE,
  VIZ_MARKERS,
} from "../src/data/federal-student-loan-balances-versus-borrowers-in-repayment-2026-data.ts";

assert.equal(HEADLINE.repaymentDollarSharePct, 39);
assert.equal(HEADLINE.repaymentBalanceBn, 633);
assert.equal(HEADLINE.forbearanceBn, 485);
assert.equal(HEADLINE.defaultBn, 220);
assert.equal(HEADLINE.managedPortfolioT, 1.64);
assert.ok(STATUS_MARCH_2026.length >= 5);
assert.ok(STATUS_VINTAGE.length >= 4);
assert.ok(FORBEARANCE_PATH.length >= 4);
assert.ok(RECIPIENT_VS_DOLLAR.length >= 4);
assert.ok(IDR_VINTAGE.length >= 2);
assert.ok(VIZ_MARKERS.length >= 3);

const root = process.cwd();
const slug = "federal-student-loan-balances-versus-borrowers-in-repayment-2026";
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
  const port = Number(process.env.SMOKE_PORT || 4182);
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
    await clickBtn(page, "Status mix path");
    await clickBtn(page, "Forbearance path");
    await clickBtn(page, "Status ladder");
    await clickBtn(page, "By recipients");
    await clickBtn(page, "By dollars");
    await clickBtn(page, "Recipients × dollars");
    await clickBtn(page, "Active-repay delinq");
    await clickBtn(page, "By recipients");
    await clickBtn(page, "By dollars");
    await clickBtn(page, "IDR share");
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
