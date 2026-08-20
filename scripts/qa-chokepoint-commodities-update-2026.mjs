/**
 * QA: chokepoint-commodities-update-2026
 * // viz-types: delta waterfall bars, prior→new dumbbell, reliance spike bars, direction pie-proxy bars, stage-flip composed | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  STAGE_FLIP_DELTAS,
  VINTAGE_ROWS,
  deltaBuckets,
  filterVintage,
  relianceSpikes,
} from "../src/data/chokepoint-commodities-update-2026-data.ts";

assert.ok(VINTAGE_ROWS.length >= 12);
assert.ok(HEADLINE.copperRefineDeltaPp >= 3);
assert.ok(HEADLINE.usCopperRelianceDeltaPp >= 10);
assert.ok(HEADLINE.galliumNewPct >= 98);
assert.ok(STAGE_FLIP_DELTAS.length >= 4);
assert.ok(deltaBuckets().some((b) => b.id === "tighter" && b.count >= 1));
assert.ok(filterVintage(VINTAGE_ROWS, { stage: "midstream" }).length >= 3);
assert.ok(relianceSpikes(5).some((r) => r.id === "copper-refine"));

const copper = VINTAGE_ROWS.find((r) => r.id === "copper-refine");
assert.ok(copper);
assert.ok(copper.newTop1Pct > copper.priorTop1Pct);

const root = process.cwd();
const slug = "chokepoint-commodities-update-2026";
const markers = [
  "Vintage delta — MCS 2025 / 2024e → MCS 2026 / 2025e",
  "Copper refine",
];

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
      "Top-1 Δ",
      "Prior → new",
      "US reliance",
      "Mine → mid",
      "Direction map",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Top-1 Δ" }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Midstream", exact: true }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Stage filter");
    await page.getByRole("button", { name: "Tighter", exact: true }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Direction filter");
    await page.getByRole("button", { name: "Batteries", exact: true }).first().click();
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
