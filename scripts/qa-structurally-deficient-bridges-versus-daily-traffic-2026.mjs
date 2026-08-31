/**
 * QA: structurally-deficient-bridges-versus-daily-traffic-2026
 * // viz-types: donut condition, stacked count-vs-ADT, FC grouped bars, area+line trend, highway system bars, state scatter | layout: default
 * // smoke-marker: Structurally deficient bridges versus daily traffic
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CONDITION_SPLIT,
  FUNCTIONAL_CLASS,
  HEADLINE,
  HIGHWAY_SYSTEM,
  POOR_TREND,
  STATE_PANEL,
} from "../src/data/structurally-deficient-bridges-versus-daily-traffic-2026-data.ts";

assert.equal(HEADLINE.poorBridges, 42_080);
assert.equal(HEADLINE.totalBridges, 623_218);
assert.equal(HEADLINE.poorAdt, 168_605_928);
assert.ok(Math.abs(HEADLINE.poorSharePct - 6.75) < 0.01);
assert.ok(Math.abs(HEADLINE.poorAdtSharePct - 3.41) < 0.01);
assert.ok(CONDITION_SPLIT.length === 3);
assert.ok(FUNCTIONAL_CLASS.length === 12);
assert.ok(HIGHWAY_SYSTEM.length === 3);
assert.ok(POOR_TREND.length >= 6);
assert.ok(STATE_PANEL.length >= 12);
assert.equal(
  CONDITION_SPLIT.reduce((s, r) => s + r.bridges, 0),
  HEADLINE.totalBridges,
);

const root = process.cwd();
const slug = "structurally-deficient-bridges-versus-daily-traffic-2026";
const markers = ["Structurally deficient bridges versus daily traffic"];

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
    await clickBtn(page, "Condition mix");
    await clickBtn(page, "Functional class");
    await clickBtn(page, "Rural");
    await clickBtn(page, "Poor count share (%)");
    await clickBtn(page, "Poor ADT volume");
    await clickBtn(page, "All");
    await clickBtn(page, "Decade path");
    await clickBtn(page, "NHS vs non-NHS");
    await clickBtn(page, "State scatter");
    await clickBtn(page, "Midwest");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Count vs ADT");
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
