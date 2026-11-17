/**
 * QA: first-time-buyer-share-versus-30-year-mortgage-rates-2026
 * // viz-types: dual-axis composed (share+rate), rate×share scatter, quarterly rate vs HPI YoY area+line, RCI monthly dual-line, regime comparison bars | layout: default
 * // smoke-marker: First-time share 21%
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL,
  HEADLINE,
  MONTHLY_RCI,
  QUARTERLY,
  REGIMES,
  SCATTER,
  VIZ_MARKERS,
} from "../src/data/first-time-buyer-share-versus-30-year-mortgage-rates-2026-data.ts";

assert.equal(HEADLINE.latestFtbSharePct, 21);
assert.equal(HEADLINE.priorFtbSharePct, 24);
assert.equal(HEADLINE.peakFtbSharePct, 34);
assert.equal(HEADLINE.medianFtbAge2025, 40);
assert.equal(HEADLINE.avgRate2025Pct, 6.6);
assert.ok(ANNUAL.length >= 10);
assert.ok(QUARTERLY.length >= 20);
assert.ok(SCATTER.length >= 10);
assert.ok(REGIMES.length >= 3);
assert.ok(MONTHLY_RCI.length >= 12);
assert.ok(VIZ_MARKERS.length >= 3);

const root = process.cwd();
const slug = "first-time-buyer-share-versus-30-year-mortgage-rates-2026";
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
    await clickBtn(page, "Share vs rate");
    await clickBtn(page, "2015+");
    await clickBtn(page, "2021+");
    await clickBtn(page, "2019+");
    await clickBtn(page, "6% line on");
    await clickBtn(page, "6% line off");
    await clickBtn(page, "Rate × share scatter");
    await clickBtn(page, "Rate vs HPI YoY");
    await clickBtn(page, "RCI monthly path");
    await clickBtn(page, "Rate regimes");
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
