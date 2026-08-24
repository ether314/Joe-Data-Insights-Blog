/**
 * QA: reinsurance-rate-on-line-vs-residual-take-up-2026
 * // viz-types: dual-axis coincidence composed, RoL area+YoY bars, residual multi-line, growth scatter, hard-market pie, phase grouped bars | layout: default
 * // smoke-marker: RoL vs residual take-up
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  COINCIDENCE_SERIES,
  ROL_SERIES,
  SCATTER_POINTS,
  PHASE_BANDS,
} from "../src/data/reinsurance-rate-on-line-vs-residual-take-up-2026-data.ts";

assert.equal(HEADLINE.rolIndex2017, 100);
assert.equal(HEADLINE.rolIndex2024Peak, 194);
assert.equal(HEADLINE.rolDropJan2026Pct, 12);
assert.equal(HEADLINE.flPoliciesPeak2023, 1_400_000);
assert.equal(HEADLINE.caFairPifJun2026, 696_562);
assert.ok(ROL_SERIES.length >= 8);
assert.ok(COINCIDENCE_SERIES.length >= 6);
assert.ok(SCATTER_POINTS.length === 4);
assert.ok(PHASE_BANDS.length >= 4);

const root = process.cwd();
const slug = "reinsurance-rate-on-line-vs-residual-take-up-2026";
const markers = [
  "RoL vs residual take-up",
  "RoL vs residual",
  "RoL path",
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
    await clickBtn(page, "RoL path");
    await clickBtn(page, "YoY %");
    await clickBtn(page, "Residual paths");
    await clickBtn(page, "Florida");
    await clickBtn(page, "Growth scatter");
    await clickBtn(page, "Hard-market mix");
    await clickBtn(page, "Phase bands");
    await clickBtn(page, "RoL vs residual");
    await clickBtn(page, "All states");
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
