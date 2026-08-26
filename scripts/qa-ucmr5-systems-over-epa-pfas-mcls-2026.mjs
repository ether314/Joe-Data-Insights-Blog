/**
 * QA: ucmr5-systems-over-epa-pfas-mcls-2026
 * // viz-types: horizontal size-tier bars, contaminant bars, state occurrence bars, co-occurrence composed area+line, detection concentration composed, size-vs-rate scatter | layout: default
 * // smoke-marker: Share of systems over MCL
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CO_OCCURRENCE,
  CONTAMINANT_OVER_MCL,
  DETECTION_CONCENTRATION,
  HEADLINE,
  SIZE_TIER_OVER_MCL,
  STATE_OCCURRENCE,
} from "../src/data/ucmr5-systems-over-epa-pfas-mcls-2026-data.ts";

assert.equal(HEADLINE.weightedNationalOverMclPct, 8.0);
assert.equal(HEADLINE.largeOverMclPct, 15.3);
assert.equal(HEADLINE.mediumOverMclPct, 8.6);
assert.equal(HEADLINE.smallOverMclPct, 7.3);
assert.ok(SIZE_TIER_OVER_MCL.length >= 4);
assert.ok(CONTAMINANT_OVER_MCL.length >= 5);
assert.ok(STATE_OCCURRENCE.length >= 15);
assert.ok(CO_OCCURRENCE.length >= 8);
assert.ok(DETECTION_CONCENTRATION.length >= 8);

const root = process.cwd();
const slug = "ucmr5-systems-over-epa-pfas-mcls-2026";
const markers = ["Share of systems over MCL"];

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
    await clickBtn(page, "Size tiers over MCL");
    await clickBtn(page, "By contaminant");
    await clickBtn(page, "Large only");
    await clickBtn(page, "Medium only");
    await clickBtn(page, "All sizes (overall)");
    await clickBtn(page, "State occurrence");
    await clickBtn(page, "High (≥45%)");
    await clickBtn(page, "Low (<25%)");
    await clickBtn(page, "All bands");
    await clickBtn(page, "Co-occurrence");
    await clickBtn(page, "Detection concentration");
    await clickBtn(page, "Size vs rate");
    await auditVizInteractions(page, slug);
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
