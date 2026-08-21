/**
 * QA: chokepoint-commodities-concentration-2026
 * // viz-types: Lorenz area+line, ranked top1/top3 bars, mine→midstream slope, HHI donut, producer bars, reliance×concentration scatter | layout: default
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
} from "../src/data/chokepoint-commodities-concentration-2026-data.ts";

assert.equal(HEADLINE.commoditiesTracked, 20);
assert.equal(HEADLINE.extremeTop1Pct, 98);
assert.equal(HEADLINE.extremeTop1Count, 8);
assert.equal(HEADLINE.chinaTop1Count, 12);
assert.equal(HEADLINE.medianTop1Pct, 65);
assert.equal(TOP_K_LADDER[0].count, 8);
assert.equal(COMMODITIES[0].id, "gallium-refine");
assert.ok(COMMODITIES[0].top1SharePct >= 98);

const root = process.cwd();
const slug = "chokepoint-commodities-concentration-2026";
const markers = [
  "Chokepoint commodities — concentration lens",
  "Ranked market shares",
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
      '[data-viz="chokepoint-commodities-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      if (m === "Cumulative share vs equal split") {
        await clickBtn(page, "Lorenz");
      }
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Top-3");
    await clickBtn(page, "HHI");
    await clickBtn(page, "Stages");
    await page
      .getByText("Mine → midstream Top-1", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Mine → midstream Top-1");
    await clickBtn(page, "Producers");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Midstream");
    await clickBtn(page, "Batteries");
    await clickBtn(page, "Ladder");
    await clickBtn(page, "Top-1");
    await clickBtn(page, "All");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("⚠ warnings:", audit.warnings.join("; "));
    }
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
