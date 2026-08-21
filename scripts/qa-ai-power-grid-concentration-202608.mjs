/**
 * QA: ai-power-grid-concentration-202608
 * // viz-types: vintage delta bars, Lorenz area+line, US-share bars, growth donut, queue-tech pie, demand path line, H1 sector bars, price shock bars, dual-ledger line, cluster scatter, intensity bars, queue meters, pace clocks, lens scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  GROWTH_SLICES,
  HEADLINE,
  REGION_SHARES,
  US_QUEUE_TECH,
  VINTAGE_DELTAS,
} from "../src/data/ai-power-grid-concentration-202608-data.ts";

assert.equal(HEADLINE.top1SharePct, 45);
assert.equal(HEADLINE.top3SharePct, 85);
assert.equal(HEADLINE.gartnerUsShare2026Pct, 36);
assert.equal(HEADLINE.usActiveTotalGw, 2061);
assert.equal(HEADLINE.usGasQueueGw, 253);
assert.equal(HEADLINE.usGasQueueYoyPct, 86);
assert.equal(HEADLINE.usMedianIrToCodYears, 5.5);
assert.equal(HEADLINE.usYoy2026Pct, 1.8);
assert.equal(REGION_SHARES[0].sharePct, 45);
assert.equal(GROWTH_SLICES[0].short, "US");
assert.equal(US_QUEUE_TECH[0].id, "solar");
assert.ok(VINTAGE_DELTAS.some((d) => d.id === "top1" && d.delta === 0));
assert.ok(VINTAGE_DELTAS.some((d) => d.id === "gasQueue" && d.direction === "up"));

const root = process.cwd();
const slug = "ai-power-grid-concentration-202608";
const markers = [
  "AI power & grid — late-Aug 202608 concentration lens",
  "Top-1 still 45%",
  "Vintage delta — Q3 → Aug",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(150);
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
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}.html`,
      `http://127.0.0.1:${port}/blog/${slug}`,
    ];
    let loaded = false;
    for (const url of candidates) {
      const res = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      if (res && res.ok()) {
        loaded = true;
        break;
      }
    }
    if (!loaded) {
      console.error("✗ Failed to load post HTML");
      process.exit(1);
    }
    await page.waitForSelector(
      '[data-viz="ai-power-grid-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Perimeters");
    await clickBtn(page, "Queues & tech");
    await clickBtn(page, "YoY %");
    await clickBtn(page, "GW stock");
    await clickBtn(page, "Pace & local");
    await clickBtn(page, "Pipeline %");
    await clickBtn(page, "Global load %");
    await clickBtn(page, "Scoreboard");
    await clickBtn(page, "Growth Δ");
    await clickBtn(page, "Stock");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log(`qa-ai-power-grid-concentration-202608: PASS`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
