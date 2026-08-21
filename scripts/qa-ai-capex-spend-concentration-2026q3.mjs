/**
 * QA: ai-capex-spend-concentration-2026q3
 * // viz-types: Lorenz area+line, ranked share bars, raise donut, path multi-line, perimeter bars, share-dollar scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  SHARE_LADDER_Q3,
  POSITIVE_RAISE_SLICES,
} from "../src/data/ai-capex-spend-concentration-2026q3-data.ts";

assert.equal(HEADLINE.top1SharePct, 27.5);
assert.equal(HEADLINE.top3SharePct, 73.6);
assert.equal(HEADLINE.big5TotalBn, 835);
assert.equal(HEADLINE.top1Bn, 230);
assert.equal(HEADLINE.hhi, 2211);
assert.equal(SHARE_LADDER_Q3[0].company, "Amazon");
assert.equal(SHARE_LADDER_Q3[0].sharePct, 27.5);
assert.ok(POSITIVE_RAISE_SLICES.length >= 3);

const root = process.cwd();
const slug = "ai-capex-spend-concentration-2026q3";
const markers = [
  "AI capex & spend — Q3 concentration lens",
  "Cumulative share vs equal split",
  "Share vs absolute dollars",
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
      '[data-viz="ai-capex-spend-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Multi-year path");
    await clickBtn(page, "Raise concentration");
    await clickBtn(page, "Perimeters");
    await clickBtn(page, "Concentration ladder");
    await clickBtn(page, "Jul research");
    await clickBtn(page, "Mid-Q3");
    await clickBtn(page, "~75% AI-attributed");
    await clickBtn(page, "Gross capex");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-ai-capex-spend-concentration-2026q3: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
