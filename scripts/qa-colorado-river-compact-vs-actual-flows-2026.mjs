/**
 * QA: colorado-river-compact-vs-actual-flows-2026
 * // viz-types: flow vs compact composed, gap bars, paper-claim stack, lower-basin bars, use-vs-entitlement grouped, rolling-10 line | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  LEES_FERRY_NATURAL,
  LOWER_BASIN_STATES,
  PAPER_CLAIMS,
  meanNatural,
} from "../src/data/colorado-river-compact-vs-actual-flows-2026-data.ts";

assert.equal(HEADLINE.compactAssumedSupplyMaf, 16.4);
assert.equal(HEADLINE.paperClaimsMaf, 16.5);
assert.equal(HEADLINE.millennialDroughtAvg2000_2024Maf, 12.4);
assert.equal(HEADLINE.gapVsCompactAssumedMaf, 4.0);
assert.ok(LEES_FERRY_NATURAL.length >= 50);
assert.ok(PAPER_CLAIMS.length === 3);
assert.ok(LOWER_BASIN_STATES.length === 3);
const millennial =
  LEES_FERRY_NATURAL.filter((r) => r.year >= 2000 && r.year <= 2024);
const millennialMean =
  millennial.reduce((s, r) => s + r.naturalMaf, 0) / millennial.length;
assert.ok(Math.abs(millennialMean - 12.4) < 0.05);
assert.ok(meanNatural("from2000") > 11 && meanNatural("from2000") < 13);
assert.ok(
  Math.abs(LOWER_BASIN_STATES.reduce((s, r) => s + r.maf, 0) - 7.5) < 0.01,
);
assert.ok(
  Math.abs(PAPER_CLAIMS.reduce((s, r) => s + r.maf, 0) - 16.5) < 0.01,
);

const root = process.cwd();
const slug = "colorado-river-compact-vs-actual-flows-2026";
const markers = [
  "Colorado River · compact vs actual flows",
  "Flow vs compact allocation",
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
    await clickBtn(page, "Flows");
    await clickBtn(page, "2000+");
    await clickBtn(page, "Assumed + claims");
    await clickBtn(page, "Era gaps");
    await clickBtn(page, "Paper claims");
    await clickBtn(page, "Use vs rights");
    await clickBtn(page, "2015+");
    await clickBtn(page, "Flows");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 12,
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
