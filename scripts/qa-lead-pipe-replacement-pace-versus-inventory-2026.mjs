/**
 * QA: lead-pipe-replacement-pace-versus-inventory-2026
 * // viz-types: composed area+lines clearance, horizontal years bars, scatter remaining vs annual, inventory bars, composed rate bands, Denver composed bars+line | layout: default
 * // smoke-marker: National stock under 2% / 5% / 10% annual clearance
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CLEARANCE_SCENARIOS,
  DENVER_PATH,
  HEADLINE,
  INVENTORY_REVISIONS,
  PACE_SCATTER,
  REQUIRED_RATE_BANDS,
  UTILITY_PACE,
} from "../src/data/lead-pipe-replacement-pace-versus-inventory-2026-data.ts";

assert.equal(HEADLINE.nationalLeadGrrMillions, 4);
assert.equal(HEADLINE.nationalLeadGrrLines, 4_000_000);
assert.equal(HEADLINE.lcriImpliedAnnualLines, 400_000);
assert.equal(HEADLINE.priorEstimateMillions, 9);
assert.ok(CLEARANCE_SCENARIOS.length >= 10);
assert.ok(UTILITY_PACE.length >= 5);
assert.ok(PACE_SCATTER.length >= 4);
assert.ok(INVENTORY_REVISIONS.length >= 3);
assert.ok(REQUIRED_RATE_BANDS.length >= 4);
assert.ok(DENVER_PATH.length >= 4);

const root = process.cwd();
const slug = "lead-pipe-replacement-pace-versus-inventory-2026";
const markers = [
  "National stock under 2% / 5% / 10% annual clearance",
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
    await clickBtn(page, "Clearance paths");
    await clickBtn(page, "2% slow");
    await clickBtn(page, "5% mid");
    await clickBtn(page, "10% LCRI");
    await clickBtn(page, "All paces");
    await clickBtn(page, "City years-to-clear");
    await clickBtn(page, "Crash");
    await clickBtn(page, "Behind");
    await clickBtn(page, "All bands");
    await clickBtn(page, "Pace scatter");
    await clickBtn(page, "Inventory revision");
    await clickBtn(page, "Required rate bands");
    await clickBtn(page, "Denver path");
    // Leave on sorted years-to-clear panel for ranked tooltip audit
    await clickBtn(page, "City years-to-clear");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
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
