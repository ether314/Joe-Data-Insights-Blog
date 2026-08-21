/**
 * QA: ai-compute-demand-concentration-202608
 * // viz-types: delta dumbbells, site stacked bars, Lorenz area+line, ownership bars, cloud donut, electricity donut, path multi-line, market bands, seat bars, region bars, token bars, token-vs-owner scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  SCOREBOARD,
  SITE_LEDGER,
  TOKEN_BRANDS,
} from "../src/data/ai-compute-demand-concentration-202608-data.ts";

assert.equal(HEADLINE.ownerTop1Pct, 25.0);
assert.equal(HEADLINE.ownerTop3Pct, 54.8);
assert.equal(HEADLINE.cloudTop3Pct, 57);
assert.equal(HEADLINE.dualHubPct, 17);
assert.equal(HEADLINE.marketTop20Pct, 60);
assert.equal(HEADLINE.worldPipelineSites, 915);
assert.equal(HEADLINE.tokenTop1Pct, 27);
assert.equal(HEADLINE.tokenTop1Label, "Google");
assert.equal(SCOREBOARD.length, 4);
assert.equal(SITE_LEDGER[0].id, "us");
assert.equal(TOKEN_BRANDS[0].id, "google");

const root = process.cwd();
const slug = "ai-compute-demand-concentration-202608";
const markers = [
  "AI compute demand — Aug 2026 concentration lens",
  "Q3 → Aug concentration deltas",
  "Concentration path",
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
    await page.waitForSelector(
      '[data-viz="ai-compute-demand-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Sites & cloud");
    await clickBtn(page, "Ops seats");
    await clickBtn(page, "Pipeline seats");
    await clickBtn(page, "Ownership");
    await clickBtn(page, "Regions");
    await clickBtn(page, "Tokens");
    await clickBtn(page, "Tokens vs chips");
    await clickBtn(page, "Scoreboard");
    await clickBtn(page, "All four");
    await clickBtn(page, "Cloud");
    await clickBtn(page, "Ownership");
    await clickBtn(page, "Scoreboard");
    await clickBtn(page, "All four");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-ai-compute-demand-concentration-202608: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
