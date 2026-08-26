/**
 * QA: issuer-count-in-municipal-distress-versus-go-ratings-2026
 * // viz-types: composed bar+line, horizontal bar, area+line, scatter, grouped bar, composed dual-bar+line | layout: default
 * // smoke-marker: Defaulted issuers vs IG-to-junk GOs
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL_SERIES,
  CUMULATIVE_PATH,
  ERA_COMPARE,
  EVENT_MIX,
  HEADLINE,
  SECTOR_MIX,
  SUMMARY_TABLE,
} from "../src/data/issuer-count-in-municipal-distress-versus-go-ratings-2026-data.ts";

assert.equal(HEADLINE.distressIssuers2015_2025, 94);
assert.equal(HEADLINE.goIgToJunk2015_2025, 17);
assert.equal(HEADLINE.distressPerGoJunk, 5.5);
assert.equal(HEADLINE.housingHealthcareSharePct, 58);
assert.equal(HEADLINE.goDistressSharePct, 4);
assert.equal(HEADLINE.peakDistressIssuers, 18);
assert.ok(ANNUAL_SERIES.length >= 10);
assert.equal(ANNUAL_SERIES.at(-1)?.year, 2025);
assert.equal(CUMULATIVE_PATH.at(-1)?.distressCumulative, 94);
assert.equal(CUMULATIVE_PATH.at(-1)?.goJunkCumulative, 17);
assert.ok(SECTOR_MIX.length >= 5);
assert.ok(EVENT_MIX.length >= 3);
assert.ok(ERA_COMPARE.length >= 3);
assert.ok(SUMMARY_TABLE.length >= 6);
assert.equal(ANALYTICS.smokeMarker, "Defaulted issuers vs IG-to-junk GOs");
const sumDistress = ANNUAL_SERIES.reduce((a, r) => a + r.distressUnique, 0);
assert.equal(sumDistress, 94);
const sumGo = ANNUAL_SERIES.reduce((a, r) => a + r.goIgToJunk, 0);
assert.equal(sumGo, 17);

const root = process.cwd();
const slug = "issuer-count-in-municipal-distress-versus-go-ratings-2026";
const markers = [
  "Defaulted issuers vs IG-to-junk GOs",
  "Capital Markets · Defaulted issuers vs IG-to-junk GOs",
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
    await clickBtn(page, "Sector mix");
    await clickBtn(page, "Cumulative");
    await page.locator("select").nth(0).selectOption("post2020");
    console.log("→ era post2020");
    await page.locator("select").nth(1).selectOption("ratio");
    console.log("→ metric ratio");
    await page.locator("select").nth(2).selectOption("enterprise");
    console.log("→ pledge enterprise");
    await clickBtn(page, "Scatter gap");
    await clickBtn(page, "Event split");
    await clickBtn(page, "Era ratio");
    await clickBtn(page, "Dual track");
    await page.locator("select").nth(0).selectOption("all");
    await page.locator("select").nth(1).selectOption("issuers");
    await page.locator("select").nth(2).selectOption("all");
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
