/**
 * QA: uscis-n-400-pending-forms-versus-completions-2026
 * // viz-types: dual-path area+line, flow composed bars+line, military stacked bars, annual FY composed, processing area+line, office scatter, denial stacked+line | layout: default
 * // smoke-marker: Headline — pending 393,563 → 648,583
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL_PATH,
  CIVILIAN_QUARTERS,
  DENIAL_SHARE,
  FIELD_OFFICES,
  FLOW_BALANCE,
  HEADLINE,
  MILITARY_QUARTERS,
} from "../src/data/uscis-n-400-pending-forms-versus-completions-2026-data.ts";

assert.equal(HEADLINE.pendingCivilianFy2024Q1, 393_563);
assert.equal(HEADLINE.pendingCivilianFy2026Q2, 648_583);
assert.equal(HEADLINE.pendingTotalFy2026Q2, 660_692);
assert.equal(HEADLINE.pctPendingUpCivilian, 65);
assert.equal(HEADLINE.processingMonthsFy2026Q2, 7.4);
assert.ok(CIVILIAN_QUARTERS.length === 8);
assert.ok(MILITARY_QUARTERS.length === 8);
assert.ok(ANNUAL_PATH.length === 5);
assert.ok(FIELD_OFFICES.length >= 10);
assert.ok(FLOW_BALANCE.length === 8);
assert.ok(DENIAL_SHARE.length === 8);
assert.equal(ANALYTICS.largestOffice, "Miami");

const root = process.cwd();
const slug = "uscis-n-400-pending-forms-versus-completions-2026";
const markers = [
  "Headline — pending 393,563 → 648,583",
  "N-400 pending vs quarterly completions",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Receipts vs completions");
    await clickBtn(page, "Southeast");
    await clickBtn(page, "Completions only");
    await clickBtn(page, "Civilian only");
    await clickBtn(page, "Both series");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Military stack");
    await clickBtn(page, "Annual FY path");
    await clickBtn(page, "Processing months");
    await clickBtn(page, "Office cloud");
    await clickBtn(page, "Denial share");
    await clickBtn(page, "Pending vs completions");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
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
