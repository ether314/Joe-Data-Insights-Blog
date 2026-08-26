/**
 * QA: jail-adp-versus-property-crime-after-2019-2026
 * // viz-types: dual composed area+line, shortfall bars, offense mix composed, flow composed, geography horizontal bars, gap scatter | layout: default
 * // smoke-marker: Headline — ADP still 10.4% below 2019; property ~4.5% below
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  DUAL_INDEX,
  FLOW_PROXY,
  GEOGRAPHY_REFILL,
  HEADLINE,
  OFFENSE_MIX,
  SHORTFALL_VS_2019,
} from "../src/data/jail-adp-versus-property-crime-after-2019-2026-data.ts";

assert.equal(HEADLINE.adp2019, 741_900);
assert.equal(HEADLINE.adp2023, 664_800);
assert.equal(HEADLINE.adpShortfallVs2019Pct, 10.4);
assert.equal(HEADLINE.propertyShortfallVs2019Pct, 4.5);
assert.equal(HEADLINE.propertyRate2019, 2109.9);
assert.equal(HEADLINE.propertyRate2023, 2015.2);
assert.ok(DUAL_INDEX.length >= 8);
assert.ok(OFFENSE_MIX.length >= 4);
assert.ok(SHORTFALL_VS_2019.length >= 4);
assert.ok(GEOGRAPHY_REFILL.length >= 4);
assert.ok(FLOW_PROXY.length >= 8);
assert.equal(ANALYTICS.troughYear, 2021);
assert.equal(ANALYTICS.latestYear, 2023);

const root = process.cwd();
const slug = "jail-adp-versus-property-crime-after-2019-2026";
const markers = [
  "Headline — ADP still 10.4% below 2019; property ~4.5% below",
  "Jail ADP vs property index",
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
  const port = Number(process.env.SMOKE_PORT || 4188);
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
    await clickBtn(page, "2019 shortfall");
    await clickBtn(page, "Admissions off");
    await clickBtn(page, "Admissions on");
    await clickBtn(page, "Offense mix");
    await clickBtn(page, "Admissions vs ADP");
    await clickBtn(page, "Urban–rural refill");
    await clickBtn(page, "Rural lean");
    await clickBtn(page, "All segments");
    await clickBtn(page, "Gap cloud");
    await clickBtn(page, "Recovery window");
    await clickBtn(page, "Midyear stock");
    await clickBtn(page, "Levels");
    await clickBtn(page, "Index 2019=100");
    await clickBtn(page, "ADP");
    await clickBtn(page, "From 2019");
    await clickBtn(page, "Dual index");
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
