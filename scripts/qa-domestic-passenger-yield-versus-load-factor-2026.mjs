/**
 * QA: domestic-passenger-yield-versus-load-factor-2026
 * // viz-types: dual-axis composed, PRASM area, scatter, carrier bars, epoch bars, YoY composed | layout: default
 * // smoke-marker: Yield vs load factor
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  ANNUAL,
  CARRIER_YIELDS,
  EPOCH_BARS,
  HEADLINE,
  MONTHLY,
  QUARTERLY,
  SUMMARY_TABLE,
} from "../src/data/domestic-passenger-yield-versus-load-factor-2026-data.ts";

assert.equal(HEADLINE.latestLabel, "2026-04");
assert.equal(HEADLINE.yieldCents, 17.12);
assert.equal(HEADLINE.loadFactorPct, 79.6);
assert.equal(HEADLINE.yieldPctSince2019, 14.4);
assert.equal(HEADLINE.peakLfPct, 87.48);
assert.equal(HEADLINE.peakYieldCents, 19.24);
assert.ok(MONTHLY.length >= 85);
assert.ok(QUARTERLY.length >= 28);
assert.equal(ANNUAL.length, 8);
assert.equal(SUMMARY_TABLE.length, ANNUAL.length);
assert.equal(EPOCH_BARS.length, 5);
assert.equal(CARRIER_YIELDS.length, 6);
assert.equal(ANALYTICS.smokeMarker, "Yield vs load factor");
assert.equal(MONTHLY.at(-1)?.label, "2026-04");

const root = process.cwd();
const slug = "domestic-passenger-yield-versus-load-factor-2026";
const markers = [
  "Yield vs load factor",
  "Transport & Logistics · Yield vs load factor",
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
    await clickBtn(page, "PRASM bridge");
    await clickBtn(page, "LF scatter");
    await clickBtn(page, "Carrier bars");
    await clickBtn(page, "Epoch bars");
    await clickBtn(page, "YoY swings");
    await clickBtn(page, "Yield only");
    await clickBtn(page, "Since 2021");
    await clickBtn(page, "Since 2023");
    await clickBtn(page, "Dual track");
    await clickBtn(page, "Both");
    await auditVizInteractions(page, { slug });
    console.log("✓ domestic-passenger-yield-versus-load-factor-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
