/**
 * QA: women-and-men-in-apprentice-trades-2026
 * // viz-types: composed bar+line, horizontal bars, scatter, stacked area, grouped bars | layout: default
 * // smoke-marker: Female share by trade
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  CONSTRUCTION_PROGRAM_MIX,
  HEADLINE,
  INDUSTRY_SEX_MIX,
  SYSTEM_TREND,
  TRADE_SEX_MIX,
  WOMEN_PORTFOLIO_SHIFT,
} from "../src/data/women-and-men-in-apprentice-trades-2026-data.ts";

assert.equal(HEADLINE.womenShareAll2023Pct, 14.8);
assert.equal(HEADLINE.womenShareAll2014Pct, 9.2);
assert.equal(HEADLINE.constructionWomenSharePct, 4.5);
assert.equal(HEADLINE.healthWomenSharePct, 84.7);
assert.equal(HEADLINE.completerEarningsRatioPct, 64.3);
assert.ok(TRADE_SEX_MIX.length >= 12);
assert.ok(SYSTEM_TREND.length >= 8);
assert.ok(INDUSTRY_SEX_MIX.length >= 5);
assert.ok(WOMEN_PORTFOLIO_SHIFT.length >= 4);
assert.ok(CONSTRUCTION_PROGRAM_MIX.length >= 3);
assert.equal(ANALYTICS.healthVsConstructionGapPp, 80.2);

const root = process.cwd();
const slug = "women-and-men-in-apprentice-trades-2026";
const markers = [
  "Female share by trade",
  "Labor & Skills · Apprenticeship pipelines",
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
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "System trend");
    await clickBtn(page, "Trade ladder");
    await clickBtn(page, "Construction");
    await clickBtn(page, "Lowest ♀ share");
    await clickBtn(page, "Highest ♀ share");
    await clickBtn(page, "Most women");
    await clickBtn(page, "All trades");
    await clickBtn(page, "Wage scatter");
    await clickBtn(page, "Health");
    await clickBtn(page, "Portfolio shift");
    await clickBtn(page, "Program mix");
    await clickBtn(page, "Trade ladder");
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
