/**
 * QA: chokepoint-commodities-update-202608
 * // viz-types: YoY Δ bars, copper/metals line path, price×concentration scatter, fertilizer area, smelter response composed | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  FERTILIZER_PATH,
  HEADLINE,
  PRICE_PATH,
  SMELTER_RESPONSE,
  VINTAGE_ROWS,
  YOY_DELTAS,
  deltaBuckets,
  filterVintage,
} from "../src/data/chokepoint-commodities-update-202608-data.ts";

assert.ok(VINTAGE_ROWS.length >= 10);
assert.ok(YOY_DELTAS.length >= 6);
assert.ok(PRICE_PATH.length >= 6);
assert.ok(FERTILIZER_PATH.length >= 5);
assert.ok(SMELTER_RESPONSE.length >= 3);
assert.ok(HEADLINE.cuYoyPct >= 30);
assert.ok(HEADLINE.cu2026JulUsd >= 13000);
assert.ok(HEADLINE.metalsIdxYoyPct >= 20);
assert.ok(HEADLINE.cuTcRcSpotMar2026Usd < 0);
assert.ok(deltaBuckets().some((b) => b.id === "tighter" && b.count >= 1));
assert.ok(filterVintage(VINTAGE_ROWS, { stage: "price" }).length >= 3);

const cu = YOY_DELTAS.find((r) => r.id === "copper");
assert.ok(cu);
assert.ok(cu.yoyPct >= 30);

const root = process.cwd();
const slug = "chokepoint-commodities-update-202608";
const markers = [
  "Vintage delta — IEA GCMO 2026 / Q3 midstream → Pink Sheet Aug 2026 (Jul monthly)",
  "Copper Jul",
];

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
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    for (const label of [
      "YoY Δ",
      "Price path",
      "Price × conc.",
      "Fertilizer",
      "Smelter reply",
      "Full ledger",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "YoY Δ" }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Price", exact: true }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Stage filter");
    await page.getByRole("button", { name: "Tighter", exact: true }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Direction filter");
    await page.getByRole("button", { name: "Structural", exact: true }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Sector filter");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("⚠ warnings:", audit.warnings.join("; "));
    }
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
