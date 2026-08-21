/**
 * QA: ai-capex-spend-geography-2026
 * // viz-types: region bars+pie, US metro ladder, stacked area by year, scenario stacks, spend×risk scatter, meter compare | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  REGION_ROWS,
  US_METROS,
} from "../src/data/ai-capex-spend-geography-2026-data.ts";

assert.equal(HEADLINE.usSharePct, 58);
assert.equal(HEADLINE.top1RegionLabel, "United States");
assert.equal(HEADLINE.top1MetroSharePct, 11);
assert.equal(HEADLINE.top1MetroLabel, "Northern Virginia");
assert.equal(HEADLINE.big5GrossBn, 858);
assert.equal(HEADLINE.aiSliceBn, 644);
assert.equal(HEADLINE.top3RegionSharePct, 92);
assert.ok(REGION_ROWS.length >= 6);
assert.equal(REGION_ROWS[0].region, "United States");
assert.equal(US_METROS[0].id, "nova");
const regionSum = REGION_ROWS.reduce((s, r) => s + r.amountBn, 0);
assert.equal(regionSum, 858);
const usSum = US_METROS.reduce((s, m) => s + m.amountBn, 0);
assert.equal(usSum, 498);

const root = process.cwd();
const slug = "ai-capex-spend-geography-2026";
const markers = [
  "AI capex & spend — geography lens",
  "Where AI infrastructure dollars land on the map",
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
    await page.waitForSelector(
      '[data-viz="ai-capex-spend-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Regions");
    await clickBtn(page, "Dollars");
    await clickBtn(page, "AI slice");
    await clickBtn(page, "Gross");
    await clickBtn(page, "Share %");
    await clickBtn(page, "US metros");
    await clickBtn(page, "Of US %");
    await clickBtn(page, "YoY growth");
    await clickBtn(page, "Global %");
    await clickBtn(page, "Scenarios");
    await clickBtn(page, "Risk map");
    await clickBtn(page, "Europe");
    await clickBtn(page, "All");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
