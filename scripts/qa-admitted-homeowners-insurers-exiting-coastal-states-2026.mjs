/**
 * QA: admitted-homeowners-insurers-exiting-coastal-states-2026
 * // viz-types: residual share composed, channel stacked bars, exit-pressure scatter, pace horizontal bars, channel pie | layout: default
 * // smoke-marker: Admitted HO premium → residual markets
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  STATE_COMPARE,
  FLORIDA_SERIES,
  EXIT_PRESSURE,
} from "../src/data/admitted-homeowners-insurers-exiting-coastal-states-2026-data.ts";

assert.equal(HEADLINE.flResidualPremiumShare2018Pct, 7);
assert.equal(HEADLINE.flResidualPremiumShare2023Pct, 20);
assert.equal(HEADLINE.flResidualPremiumShareDeltaPp, 13);
assert.ok(STATE_COMPARE.length === 3);
assert.ok(FLORIDA_SERIES.length >= 6);
assert.ok(EXIT_PRESSURE.length >= 4);

const root = process.cwd();
const slug = "admitted-homeowners-insurers-exiting-coastal-states-2026";
const markers = [
  "Admitted HO premium → residual markets",
  "Share path",
  "Channel mix",
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
    await clickBtn(page, "Channel mix");
    await clickBtn(page, "2023");
    await clickBtn(page, "Exit pressure");
    await clickBtn(page, "Pace ladder");
    await clickBtn(page, "State mix");
    await clickBtn(page, "California");
    await clickBtn(page, "Share path");
    await clickBtn(page, "Florida");
    await clickBtn(page, "Admitted %");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
