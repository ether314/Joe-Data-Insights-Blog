/**
 * QA: ai-power-grid-concentration-2026q3
 * // viz-types: vintage delta bars, Lorenz area+line, US-share compare bars, growth donut, dual-ledger line, cluster scatter, intensity lollipops, queue meters, pace clocks, lens scatter | layout: default
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
  VINTAGE_DELTAS,
} from "../src/data/ai-power-grid-concentration-2026q3-data.ts";

assert.equal(HEADLINE.top1SharePct, 45);
assert.equal(HEADLINE.top3SharePct, 85);
assert.equal(HEADLINE.gartnerUsShare2026Pct, 36);
assert.equal(HEADLINE.gartnerWorldTwh2026, 565);
assert.equal(HEADLINE.usChinaGrowthSharePct, 80);
assert.equal(HEADLINE.globalQueueStalledGw, 2500);
assert.equal(HEADLINE.virginiaDcSharePct, 25);
assert.equal(REGION_SHARES[0].sharePct, 45);
assert.equal(GROWTH_SLICES[0].short, "US");
assert.ok(VINTAGE_DELTAS.some((d) => d.id === "top1" && d.delta === 0));
assert.ok(VINTAGE_DELTAS.some((d) => d.id === "usGartner" && d.direction === "scope"));

const root = process.cwd();
const slug = "ai-power-grid-concentration-2026q3";
const markers = [
  "AI power & grid — Q3 2026 concentration lens",
  "Vintage delta — what moved",
  "Cumulative share vs equal split",
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
      '[data-viz="ai-power-grid-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Perimeters");
    await clickBtn(page, "Clusters");
    await clickBtn(page, "Pipeline intensity");
    await clickBtn(page, "Global capacity %");
    await clickBtn(page, "Pace & queues");
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
    console.log(`qa-ai-power-grid-concentration-2026q3: PASS`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
