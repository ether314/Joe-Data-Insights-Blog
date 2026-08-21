/**
 * QA: chokepoint-commodities-concentration-202608
 * // viz-types: binding bars, stress×share scatter, mine→plant slopes, price path area+line, HHI donut, producer bars | layout: default
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
  STRESS_SHARE,
  TOP_K_LADDER,
} from "../src/data/chokepoint-commodities-concentration-202608-data.ts";

assert.equal(HEADLINE.avgRefineExReePct, 72);
assert.equal(HEADLINE.avgRefineTop3Pct, 88);
assert.equal(HEADLINE.top1ExtremePct, 99);
assert.equal(HEADLINE.tip70Count, 10);
assert.equal(HEADLINE.tip70Of, 19);
assert.equal(HEADLINE.cuMineTop1Pct, 23);
assert.equal(HEADLINE.cuSmeltTop1Pct, 50);
assert.equal(HEADLINE.cuPriceYoyPct, 36.2);
assert.equal(HEADLINE.cuSpotTcUsd, -90);
assert.equal(HEADLINE.tinYoyPct, 55.5);
assert.equal(COMMODITIES[0].id, "gallium-refine");
assert.ok(COMMODITIES[0].top1SharePct >= 99);
assert.ok(TOP_K_LADDER.length >= 16);
assert.ok(STRESS_SHARE.length >= 5);

const root = process.cwd();
const slug = "chokepoint-commodities-concentration-202608";
const markers = [
  "Chokepoint commodities — Aug 202608 concentration lens",
  "Pink Sheet YoY × Top-1 share",
  "Mine → plant Top-1 slopes",
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
  const port = Number(process.env.SMOKE_PORT || 4184);
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
      '[data-viz="chokepoint-commodities-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      if (m === "Pink Sheet YoY × Top-1 share") {
        await clickBtn(page, "Stress × share");
      }
      if (m === "Mine → plant Top-1 slopes") {
        await clickBtn(page, "Mine → plant");
      }
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Binding tip");
    await clickBtn(page, "Top-3");
    await clickBtn(page, "Binding");
    await clickBtn(page, "Price & HHI");
    await clickBtn(page, "Stress × share");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-chokepoint-commodities-concentration-202608: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
