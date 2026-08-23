/**
 * QA: registered-apprenticeships-vs-trades-retirements-2026
 * // viz-types: ratio scatter, state rank bars, region composed, national RAP trend + funnel | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  NATIONAL_RAP_TREND,
  STATE_TRADE_ROWS,
  TRADE_FUNNEL,
} from "../src/data/registered-apprenticeships-vs-trades-retirements-2026-data.ts";

assert.equal(HEADLINE.elecEntrantsPerRetire, 1.39);
assert.equal(HEADLINE.plumbEntrantsPerRetire, 1.11);
assert.equal(HEADLINE.elecOpenings, 81_000);
assert.equal(HEADLINE.plumbOpenings, 44_000);
assert.ok(STATE_TRADE_ROWS.length >= 40);
assert.ok(NATIONAL_RAP_TREND.length >= 5);
assert.equal(TRADE_FUNNEL.length, 2);
assert.ok(HEADLINE.newElectricianRap > HEADLINE.elecRetirements);

const root = process.cwd();
const slug = "registered-apprenticeships-vs-trades-retirements-2026";
const markers = [
  "Apprenticeship pipelines · entrants per retirement",
  "National RAP starts cover",
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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Electrician");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Rank");
    await clickBtn(page, "Regions");
    await clickBtn(page, "National");
    await clickBtn(page, "Plumber");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "<1.0×");
    await clickBtn(page, "All");
    await clickBtn(page, "Electrician");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 16,
      maxCharts: 4,
    });
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
