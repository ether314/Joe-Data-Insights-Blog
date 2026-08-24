/**
 * QA: trade-wages-versus-college-majors-2026
 * // viz-types: composed bar+line, diverging bar, scatter, multi area, bar | layout: default
 * // smoke-marker: Wage gap at 10 years
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  CAREER_TRACKS,
  COST_AMORT_ROWS,
  CUMULATIVE_NET,
  GAP_PAIRS,
  HEADLINE,
  REGION_PREMIUMS,
} from "../src/data/trade-wages-versus-college-majors-2026-data.ts";

assert.equal(HEADLINE.gapAt10ElecVsBio, 12_800);
assert.equal(HEADLINE.netGapAt10ElecVsBio, 17_760);
assert.equal(HEADLINE.crossoverYearsElecBio, 6);
assert.equal(HEADLINE.electricianAt10, 71_200);
assert.equal(HEADLINE.biologyAt10, 58_400);
assert.ok(CAREER_TRACKS.length >= 10);
assert.ok(COST_AMORT_ROWS.length >= 10);
assert.ok(GAP_PAIRS.length >= 5);
assert.ok(CUMULATIVE_NET.length >= 20);
assert.ok(REGION_PREMIUMS.length >= 6);
assert.equal(ANALYTICS.defaultTradeId, "electrician");
assert.equal(ANALYTICS.defaultMajorId, "biology");
assert.equal(ANALYTICS.defaultYear, 10);

const root = process.cwd();
const slug = "trade-wages-versus-college-majors-2026";
const markers = [
  "Wage gap at 10 years",
  "Labor & Skills · Trade vs degree earnings",
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
    await clickBtn(page, "Gap ladder");
    await clickBtn(page, "5y");
    await clickBtn(page, "Plumber");
    await clickBtn(page, "Business");
    await clickBtn(page, "Gross");
    await clickBtn(page, "Cost scatter");
    await clickBtn(page, "Cumulative net");
    await clickBtn(page, "Region edge");
    await clickBtn(page, "Wage paths");
    await clickBtn(page, "Electrician");
    await clickBtn(page, "Biology");
    await clickBtn(page, "10y");
    await clickBtn(page, "Net of cost");
    await clickBtn(page, "Cost scatter");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues?.length > 0) {
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
