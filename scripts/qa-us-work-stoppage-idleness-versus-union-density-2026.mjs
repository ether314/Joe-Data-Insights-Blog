/**
 * QA: us-work-stoppage-idleness-versus-union-density-2026
 * // viz-types: coverage×idle scatter, idle rank bars, annual composed, ownership bars, density buckets, 2025 sector share | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL_SERIES,
  HEADLINE,
  INDUSTRY_CROSS_2024,
  OWNERSHIP_SPLIT,
} from "../src/data/us-work-stoppage-idleness-versus-union-density-2026-data.ts";

assert.equal(HEADLINE.mfgDaysIdle2024, 1_316_000);
assert.equal(HEADLINE.mfgMembership2025, 7.7);
assert.equal(HEADLINE.utilitiesMembership2025, 17.8);
assert.equal(HEADLINE.utilitiesDaysIdle2024, 0);
assert.equal(HEADLINE.eduWorkers2024, 110_400);
assert.ok(INDUSTRY_CROSS_2024.length >= 10);
assert.ok(ANNUAL_SERIES.length >= 8);
assert.ok(OWNERSHIP_SPLIT.length >= 4);
assert.ok(HEADLINE.totalDaysIdle2023 > HEADLINE.totalDaysIdle2024);

const root = process.cwd();
const slug = "us-work-stoppage-idleness-versus-union-density-2026";
const markers = [
  "Organized labor · idle days vs coverage",
  "Manufacturing logged",
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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Days idle");
    await clickBtn(page, "Workers idled");
    await clickBtn(page, "Goods");
    await clickBtn(page, "All");
    await clickBtn(page, "Rank");
    await clickBtn(page, "Timeline");
    await clickBtn(page, "Ownership");
    await clickBtn(page, "2024");
    await clickBtn(page, "2025");
    await clickBtn(page, "Scatter");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 14,
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
