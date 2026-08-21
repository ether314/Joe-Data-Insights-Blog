/**
 * QA: industrial-robotics-concentration-202608
 * // viz-types: Lorenz area+line, ranked share bars, dual-ledger tip bars, path multi-line + NA overlay, NA bloc donut, industry YoY bars, cobot share bars, share×growth scatter, binding meters | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  MARKET_SHARES,
  DUAL_LEDGER_TIPS,
  NA_BLOC_SHARES,
} from "../src/data/industrial-robotics-concentration-202608-data.ts";

assert.equal(HEADLINE.top1Share2025Pct, 61.2);
assert.equal(HEADLINE.top3Share2025Pct, 74.2);
assert.equal(HEADLINE.worldUnits2025, 621_000);
assert.equal(HEADLINE.naNonAutoShareQ2Pct, 56);
assert.equal(HEADLINE.marketHhi2025, 4161);
assert.equal(MARKET_SHARES[0].short, "China");
assert.equal(MARKET_SHARES[0].share2025Pct, 61.2);
assert.ok(DUAL_LEDGER_TIPS.length >= 4);
assert.equal(NA_BLOC_SHARES[0].sharePct, 56);

const root = process.cwd();
const slug = "industrial-robotics-concentration-202608";
const markers = [
  "Industrial robotics — Aug 202608 dual-ledger concentration",
  "Cumulative share vs equal split",
  "Ranked market shares",
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
      '[data-viz="industrial-robotics-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Dual ledger");
    await page.getByText("Dual-ledger tip comparison", { exact: false }).first().waitFor({ timeout: 10000 });
    console.log("✓ Dual-ledger tip comparison");
    await clickBtn(page, "Share path");
    await page.getByText("Top-1 / Top-3 / Asia share path", { exact: false }).first().waitFor({ timeout: 10000 });
    console.log("✓ Top-1 / Top-3 / Asia share path");
    await clickBtn(page, "NA order book");
    await page.getByText("NA Q2 order bloc shares", { exact: false }).first().waitFor({ timeout: 10000 });
    console.log("✓ NA Q2 order bloc shares");
    await clickBtn(page, "Industry YoY");
    await page.getByText("NA industry", { exact: false }).first().waitFor({ timeout: 10000 });
    console.log("✓ NA industry YoY");
    await clickBtn(page, "Cobot share");
    await page.getByText("Cobot unit vs value share path", { exact: false }).first().waitFor({ timeout: 10000 });
    console.log("✓ Cobot unit vs value share path");
    await clickBtn(page, "Install ladder");
    await clickBtn(page, "2024 WR");
    await clickBtn(page, "2025 prelim");
    await clickBtn(page, "Units");
    await clickBtn(page, "Share %");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-industrial-robotics-concentration-202608: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
