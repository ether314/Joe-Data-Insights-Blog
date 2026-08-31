/**
 * QA: usda-honey-bee-colony-loss-versus-almond-pollination-acres-2026
 * // viz-types: dual-axis loss+acres composed, demand-vs-stock bars+line, scatter loss vs acres, stocking-rate ladder bars | layout: default
 * // smoke-marker: Winter loss vs almond acres
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  HEADLINE,
  SEASONS,
} from "../src/data/usda-honey-bee-colony-loss-versus-almond-pollination-acres-2026-data.ts";

assert.equal(ANALYTICS.smokeMarker, "Winter loss vs almond acres");
assert.equal(HEADLINE.latestWinterLossPct, 40.2);
assert.equal(HEADLINE.latestAnnualLossPct, 55.6);
assert.equal(HEADLINE.latestAlmondAcresK, 1390);
assert.equal(HEADLINE.latestHiveDemandM, 2.78);
assert.equal(HEADLINE.latestUsJanColoniesM, 2.63);
assert.ok(SEASONS.length >= 8);
assert.equal(SEASONS[SEASONS.length - 1].season, "2024-25");
assert.ok(SEASONS.every((r) => r.hiveDemandM > 0 && r.usJanColoniesM > 0));

const root = process.cwd();
const slug = "usda-honey-bee-colony-loss-versus-almond-pollination-acres-2026";
const markers = ["Winter loss vs almond acres"];

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
    await clickBtn(page, "Demand vs stock");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Stocking ladder");
    await clickBtn(page, "Season table");
    await clickBtn(page, "Annual loss");
    await clickBtn(page, "Since 2018-19");
    await clickBtn(page, "Loss vs acres");
    await clickBtn(page, "Winter loss");
    await clickBtn(page, "2015–25");
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
