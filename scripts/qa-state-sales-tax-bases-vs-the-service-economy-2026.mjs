/**
 * QA: state-sales-tax-bases-vs-the-service-economy-2026
 * // viz-types: scatter, horizontal bars, composed area+line, radar, vertical bars | layout: default
 * // smoke-marker: Headline — Taxable share of consumption
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  FTA_SURVEY_TOTAL_SERVICES,
  GST_STATES,
  HEADLINE,
  PCE_MIX_TREND,
  STATE_ROWS,
} from "../src/data/state-sales-tax-bases-vs-the-service-economy-2026-data.ts";

assert.equal(FTA_SURVEY_TOTAL_SERVICES, 176);
assert.equal(HEADLINE.medianServicesTaxedGst, 40);
assert.equal(HEADLINE.servicesShareOfPcePct, 68.2);
assert.equal(HEADLINE.topRelianceSalesSharePct, 64.6);
assert.equal(HEADLINE.topRelianceServicesTaxed, 69);
assert.ok(STATE_ROWS.length >= 50);
assert.ok(GST_STATES.length >= 40);
assert.ok(PCE_MIX_TREND.length >= 8);
assert.ok(ANALYTICS.narrowCount >= 1);

const fl = STATE_ROWS.find((r) => r.abbr === "FL");
assert.ok(fl);
assert.equal(fl.servicesTaxed, 69);
assert.equal(fl.salesTaxShareOfCollectionsPct, 64.6);

const hi = STATE_ROWS.find((r) => r.abbr === "HI");
assert.ok(hi);
assert.equal(hi.servicesTaxed, 167);

const root = process.cwd();
const slug = "state-sales-tax-bases-vs-the-service-economy-2026";
const markers = [
  "Headline — Taxable share of consumption",
  "Median GST state taxes 40 of 176 FTA services",
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
    await clickBtn(page, "Outside-base ladder");
    await clickBtn(page, "Outside share %");
    await clickBtn(page, "Taxable share %");
    await clickBtn(page, "Services taxed");
    await clickBtn(page, "PCE goods vs services");
    await clickBtn(page, "Service categories");
    await clickBtn(page, "Exposure scoreboard");
    await clickBtn(page, "Narrow");
    await clickBtn(page, "All bands");
    await clickBtn(page, "South");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Reliance vs services");
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
