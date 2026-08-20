/**
 * QA: chokepoint-commodities-update-2026q3
 * // viz-types: midstream Δ bars, prior→new scatter, smelter utilisation composed, investment diverging bars, risk-dollar bars, price-multiple bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  INVESTMENT_DELTAS,
  RISK_DOLLARS,
  SMELTER_STRESS,
  VINTAGE_ROWS,
  deltaBuckets,
  filterVintage,
} from "../src/data/chokepoint-commodities-update-2026q3-data.ts";

assert.ok(VINTAGE_ROWS.length >= 10);
assert.ok(HEADLINE.avgRefineDeltaPp >= 2);
assert.ok(HEADLINE.reeRefineDeltaPp <= -5);
assert.ok(HEADLINE.cuSmeltCapacity2025Pct >= 45);
assert.ok(HEADLINE.liChemDeltaPp >= 4);
assert.ok(SMELTER_STRESS.length >= 2);
assert.ok(INVESTMENT_DELTAS.some((d) => d.yoyPct < 0));
assert.ok(RISK_DOLLARS.some((r) => r.riskUsdBn >= 300));
assert.ok(deltaBuckets().some((b) => b.id === "tighter" && b.count >= 1));
assert.ok(filterVintage(VINTAGE_ROWS, { stage: "midstream" }).length >= 4);

const ree = VINTAGE_ROWS.find((r) => r.id === "ree-refine");
assert.ok(ree);
assert.ok(ree.newTop1Pct < ree.priorTop1Pct);

const root = process.cwd();
const slug = "chokepoint-commodities-update-2026q3";
const markers = [
  "Vintage delta — MCS 2026 update / secondary midstream → IEA GCMO 2026",
  "Avg top refine",
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
      "Midstream Δ",
      "Prior → new",
      "Smelter stress",
      "Capex YoY",
      "Risk $",
      "Price multiples",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Midstream Δ" }).first().click();
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
