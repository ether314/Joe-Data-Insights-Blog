/**
 * QA: macro-growth-trade-concentration-2026q3
 * // viz-types: vintage delta bars, Lorenz area+line, growth base/Q2 bars, CPB rebound line, trade donut, hard-data dumbbells, price scatter, lens scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  GROWTH_CONTRIB_SHARES,
  HEADLINE,
  TRADE_GROWTH_SHARES,
  VINTAGE_DELTAS,
} from "../src/data/macro-growth-trade-concentration-2026q3-data.ts";

assert.equal(HEADLINE.top1GrowthContribPct, 32);
assert.equal(HEADLINE.top3GrowthContribPct, 55);
assert.equal(HEADLINE.q2SensTop1GrowthPct, 29);
assert.equal(HEADLINE.top1TradeGrowthSharePct, 71);
assert.equal(HEADLINE.top1PppSharePct, 19);
assert.equal(HEADLINE.top3ExportSharePct, 29);
assert.equal(GROWTH_CONTRIB_SHARES[0].id, "chn");
assert.equal(GROWTH_CONTRIB_SHARES[0].sharePct, 31.8);
assert.equal(TRADE_GROWTH_SHARES[0].id, "asia");
assert.equal(TRADE_GROWTH_SHARES[0].sharePct, 71);
assert.ok(VINTAGE_DELTAS.some((d) => d.id === "growth-q2" && d.deltaPp === -3));

const root = process.cwd();
const slug = "macro-growth-trade-concentration-2026q3";
const markers = [
  "Growth, trade & prices — Q3 2026 concentration lens",
  "Prior → Q3 Top-1 restatement",
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
  const port = Number(process.env.SMOKE_PORT || 4186);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}.html`,
      `http://127.0.0.1:${port}/blog/${slug}/`,
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
      '[data-viz="macro-growth-trade-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Growth ladder");
    await clickBtn(page, "Q2 sensitivity");
    await clickBtn(page, "2025 base");
    await clickBtn(page, "Trade + CPB");
    await clickBtn(page, "Prices");
    await clickBtn(page, "Scoreboard");
    await clickBtn(page, "Growth Q2");
    await clickBtn(page, "Hide");
    await clickBtn(page, "Show");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-macro-growth-trade-concentration-2026q3: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
