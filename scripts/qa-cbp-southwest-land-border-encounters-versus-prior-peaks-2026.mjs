/**
 * QA: cbp-southwest-land-border-encounters-versus-prior-peaks-2026
 * // smoke-marker: Monthly SW border encounters vs prior peak
 * // viz-types: dual peak-ratio composed, same-month ladder bars, USBP/OFO pie,
 * // FY stack bars, calendar overlay lines, share-of-peak area
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  FY_TOTALS,
  HEADLINE,
  MONTHLY,
  SAME_MONTH_LADDER,
  VIZ_MARKERS,
  validateHeadlineInvariants,
} from "../src/data/cbp-southwest-land-border-encounters-versus-prior-peaks-2026-data.ts";

assert.equal(HEADLINE.peakUsbp, 249_740);
assert.equal(HEADLINE.latestUsbp, 9_295);
assert.equal(HEADLINE.latestShareOfPeakPct, 3.7);
assert.equal(HEADLINE.fy2025Usbp, 237_538);
assert.ok(MONTHLY.length >= 50);
assert.ok(SAME_MONTH_LADDER.length === 12);
assert.ok(FY_TOTALS.length >= 5);
assert.ok(validateHeadlineInvariants());

const root = process.cwd();
const slug = "cbp-southwest-land-border-encounters-versus-prior-peaks-2026";
const markers = [...VIZ_MARKERS];

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

    await clickBtn(page, "Peak-ratio ribbon");
    await page
      .getByText("Peak-ratio ribbon", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Same-month ladder");
    await clickBtn(page, "USBP vs OFO mix");
    await clickBtn(page, "Fiscal-year stack");
    await clickBtn(page, "Calendar overlay");
    await clickBtn(page, "Peak path");
    await clickBtn(page, "FY2026 YTD");
    await clickBtn(page, "% of Dec 2023 peak");
    await clickBtn(page, "Oct 21–Jul 26");

    const audit = await auditVizInteractions(page, slug);
    console.log("interaction audit", audit);
    assert.ok(audit.ok !== false);

    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
