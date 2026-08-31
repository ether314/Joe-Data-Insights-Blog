/**
 * QA: streaming-video-cpi-versus-cable-and-satellite-tv-cpi-2026
 * // viz-types: composed dual line, area gap, yoy composed bar+line, annual bars, scatter, horizontal bundle bars | layout: default
 * // smoke-marker: Streaming vs cable TV service indexes
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
  MONTHS,
  QUARTERS,
  TABLE_ROWS,
} from "../src/data/streaming-video-cpi-versus-cable-and-satellite-tv-cpi-2026-data.ts";

assert.equal(HEADLINE.latestMonth, "2026-07");
assert.equal(HEADLINE.cableIdx, 127.6);
assert.equal(HEADLINE.streamIdx, 114.2);
assert.equal(HEADLINE.gapPp, -13.4);
assert.equal(HEADLINE.troughGapPp, -24.4);
assert.equal(HEADLINE.troughGapLabel, "2023-03");
assert.equal(HEADLINE.closedFromTroughPp, 11);
assert.equal(HEADLINE.cablePctSince2019, 27.6);
assert.equal(HEADLINE.streamPctSince2019, 14.2);
assert.ok(MONTHS.length >= 85);
assert.ok(QUARTERS.length >= 28);
assert.ok(ANNUAL.length >= 7);
assert.equal(TABLE_ROWS.length, ANNUAL.length);

const root = process.cwd();
const slug = "streaming-video-cpi-versus-cable-and-satellite-tv-cpi-2026";
const markers = [
  "Streaming vs cable TV service indexes",
  "Economics · Streaming vs cable TV service indexes",
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
    await clickBtn(page, "Gap area");
    await clickBtn(page, "YoY pace");
    await clickBtn(page, "Annual ladder");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Bundle bars");
    await clickBtn(page, "+ Internet");
    await clickBtn(page, "2020–23 split");
    await clickBtn(page, "Cable + video");
    await clickBtn(page, "Since 2019");
    await clickBtn(page, "Index race");
    await auditVizInteractions(page, { slug });
    console.log("✓ streaming-video-cpi-versus-cable-and-satellite-tv-cpi-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
