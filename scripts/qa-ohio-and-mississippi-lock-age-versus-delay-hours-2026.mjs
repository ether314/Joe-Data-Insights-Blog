/**
 * QA: ohio-and-mississippi-lock-age-versus-delay-hours-2026
 * // smoke-marker: Age–delay scatter cloud
 * // viz-types: age-delay scatter bubbles, median-delay age-band bars,
 * // river dual-metric composed bars+line, chamber delay pie,
 * // traffic-bin horizontal bars
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AGE_BANDS,
  DETAIL_TABLE,
  HEADLINE,
  LOCKS,
  RIVER_SUMMARIES,
  SCATTER,
  TRAFFIC_BINS,
  VIZ_MARKERS,
} from "../src/data/ohio-and-mississippi-lock-age-versus-delay-hours-2026-data.ts";

assert.equal(LOCKS.length, HEADLINE.panelN);
assert.equal(LOCKS.length, 30);
assert.equal(SCATTER.length, 30);
assert.equal(DETAIL_TABLE.length, 30);
assert.ok(AGE_BANDS.length >= 4);
assert.ok(RIVER_SUMMARIES.length >= 1);
assert.equal(
  RIVER_SUMMARIES.filter((r) => r.river === "ohio" || r.river === "mississippi")
    .length,
  2,
);
assert.ok(TRAFFIC_BINS.length >= 3);
assert.equal(HEADLINE.band60MedianDelay, 2.14);
assert.equal(HEADLINE.band80MedianDelay, 0.6);
assert.equal(HEADLINE.midVsOldRatio, 3.57);
assert.equal(HEADLINE.highestDelayName, "Markland");
assert.equal(HEADLINE.oldestName, "Lock 19 (Keokuk)");
assert.ok(HEADLINE.corrAll < 0);
assert.ok(VIZ_MARKERS.includes("Age–delay scatter cloud"));

const root = process.cwd();
const slug = "ohio-and-mississippi-lock-age-versus-delay-hours-2026";
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

    await clickBtn(page, "Age bands");
    await page
      .getByText("Median delay by age band", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "River contrast");
    await page
      .getByText("River slope contrast", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Chambers");
    await page
      .getByText("Median delay by chamber layout", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Traffic bins");
    await page
      .getByText("Median delay by traffic intensity", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Ohio only");
    await clickBtn(page, "Mississippi only");
    await clickBtn(page, "Both rivers");
    await clickBtn(page, "Twin 1,200′");
    await clickBtn(page, "All chambers");
    await clickBtn(page, "Scatter cloud");
    console.log("✓ view + river + chamber controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
