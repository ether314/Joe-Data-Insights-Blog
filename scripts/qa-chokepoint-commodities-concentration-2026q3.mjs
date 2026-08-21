/**
 * QA: chokepoint-commodities-concentration-2026q3
 * // viz-types: vintage delta bars, Lorenz area+line, mine→plant slope, HHI donut, producer bars, risk×share scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COMMODITIES,
  HEADLINE,
  TOP_K_LADDER,
} from "../src/data/chokepoint-commodities-concentration-2026q3-data.ts";

assert.equal(HEADLINE.commoditiesTracked, 16);
assert.equal(HEADLINE.extremeTop1Pct, 99);
assert.equal(HEADLINE.extremeTop1Count, 10);
assert.equal(HEADLINE.chinaTop1Count, 11);
assert.equal(HEADLINE.avgRefineExReePct, 72);
assert.equal(HEADLINE.avgRefineDeltaPp, 2);
assert.equal(HEADLINE.reeRefinePct, 85);
assert.equal(HEADLINE.liChemPct, 70);
assert.equal(HEADLINE.cuSmeltPct, 50);
assert.equal(HEADLINE.medianTop1Pct, 73.1);
assert.equal(TOP_K_LADDER[0].count, 10);
assert.equal(COMMODITIES[0].id, "gallium-refine");
assert.ok(COMMODITIES[0].top1SharePct >= 99);

const root = process.cwd();
const slug = "chokepoint-commodities-concentration-2026q3";
const markers = [
  "Chokepoint commodities — Q3 2026 concentration lens",
  "Prior → Q3 Top-1 restatement",
  "Top-k concentration thresholds",
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
  const port = Number(process.env.SMOKE_PORT || 4188);
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
      '[data-viz="chokepoint-commodities-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      if (m === "Prior → Q3 Top-1 restatement") {
        await clickBtn(page, "Vintage delta");
      }
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Ranked shares");
    await clickBtn(page, "Top-3");
    await clickBtn(page, "HHI");
    await clickBtn(page, "Mine→plant");
    await clickBtn(page, "Risk & HHI");
    await clickBtn(page, "Vintage delta");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-chokepoint-commodities-concentration-2026q3: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
