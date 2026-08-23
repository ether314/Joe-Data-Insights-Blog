/**
 * QA: oecd-childcare-costs-versus-total-fertility-2026
 * // viz-types: scatter cost-vs-TFR, band mean bars, region bars, fee/benefit bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTRIES,
  COST_BANDS,
  HEADLINE,
} from "../src/data/oecd-childcare-costs-versus-total-fertility-2026-data.ts";

assert.equal(HEADLINE.oecdAvgNetCostPctAW, 13);
assert.equal(HEADLINE.sampleN, 33);
assert.equal(HEADLINE.pearsonR, 0.244);
assert.equal(HEADLINE.pearsonRExclOutliers, 0.373);
assert.equal(HEADLINE.lowCostMeanTfr, 1.388);
assert.equal(HEADLINE.highCostMeanTfr, 1.531);
assert.equal(HEADLINE.maxNetCostPctAW, 37);
assert.equal(HEADLINE.minTfr, 0.778);
assert.equal(COUNTRIES.length, 33);
assert.equal(COST_BANDS.length, 3);
assert.equal(COUNTRIES[0].iso3, "NZL");

const root = process.cwd();
const slug = "oecd-childcare-costs-versus-total-fertility-2026";
const markers = [
  "OECD childcare costs vs total fertility - family-policy lens",
  "Net childcare cost vs total fertility",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Cost bands");
    await clickBtn(page, "Regions");
    await clickBtn(page, "Fee vs benefit");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Lone 67%");
    await clickBtn(page, "Dual 100+67");
    await clickBtn(page, "Excl. IL/KR");
    await clickBtn(page, "All 33");
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
