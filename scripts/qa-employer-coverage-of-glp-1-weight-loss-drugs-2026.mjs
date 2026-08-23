/**
 * QA: employer-coverage-of-glp-1-weight-loss-drugs-2026
 * // viz-types: size ladder bars, YoY grouped bars, pharmacy composed (area+line),
 * // cost horizontal bars, indication bars + pie | layout: default
 * // smoke-marker: GLP-1 employer coverage · Rx spend tilt
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COVERAGE_BY_YEAR,
  HEADLINE,
  PHARMACY_TREND,
  SIZE_LADDER,
} from "../src/data/employer-coverage-of-glp-1-weight-loss-drugs-2026-data.ts";

assert.equal(HEADLINE.kff5kCover2024, 28);
assert.equal(HEADLINE.kff5kCover2025, 43);
assert.equal(HEADLINE.kff200PlusCover2025, 19);
assert.equal(HEADLINE.mercer500Plus2024, 44);
assert.equal(HEADLINE.mercer20k2024, 64);
assert.equal(HEADLINE.weightMgmtShareOfIncrease2024, 46.8);
assert.equal(HEADLINE.weightMgmtShareOfTotal2024, 6.7);
assert.ok(SIZE_LADDER.length >= 4);
assert.ok(COVERAGE_BY_YEAR.length >= 6);
assert.ok(PHARMACY_TREND.some((r) => r.glp1WeightLossNetTrendPct != null));

const root = process.cwd();
const slug = "employer-coverage-of-glp-1-weight-loss-drugs-2026";
const markers = [
  "GLP-1 employer coverage · Rx spend tilt",
  "Jumbo firms covering GLP-1s for weight loss",
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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Coverage");
    await clickBtn(page, "KFF");
    await clickBtn(page, "Mercer");
    await clickBtn(page, "All");
    await clickBtn(page, "KFF 5k+");
    await clickBtn(page, "Pharmacy");
    await clickBtn(page, "Cost shock");
    await clickBtn(page, "Indication");
    await clickBtn(page, "Coverage");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 16,
      maxCharts: 4,
    });
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
