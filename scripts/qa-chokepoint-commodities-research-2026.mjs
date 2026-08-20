/**
 * QA: chokepoint-commodities-research-2026
 * // viz-types: concentration bars, reliance×concentration scatter, mine→midstream slope, sector composed bars, producer scoreboard | layout: default
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
  STAGE_SPLITS,
  filterCommodities,
  producerScoreboard,
} from "../src/data/chokepoint-commodities-research-2026-data.ts";

assert.ok(COMMODITIES.length >= 15);
assert.equal(HEADLINE.commoditiesTracked, COMMODITIES.length);
assert.ok(HEADLINE.chinaTop1Count >= 8);
assert.ok(HEADLINE.galliumChinaPct >= 90);
assert.ok(HEADLINE.graphiteChinaPct >= 70);
assert.ok(HEADLINE.extremeTop1Count >= 5);
assert.ok(STAGE_SPLITS.length >= 4);
assert.ok(producerScoreboard()[0]?.iso === "CN");
assert.ok(filterCommodities({ stage: "mine" }).length >= 5);
assert.ok(filterCommodities({ sector: "batteries" }).length >= 4);

const gallium = COMMODITIES.find((c) => c.id === "gallium-refine");
assert.ok(gallium);
assert.ok(gallium.top1SharePct >= 90);

const root = process.cwd();
const slug = "chokepoint-commodities-research-2026";
const markers = [
  "Where supply is thin",
  "Chokepoint commodities",
];

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
      "Concentration",
      "Reliance map",
      "Mine → midstream",
      "By sector",
      "Who leads",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Concentration" }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "All stages", exact: true }).first().click();
    await page.getByRole("button", { name: "All sectors", exact: true }).first().click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Midstream", exact: true }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Stage filter");
    await page.getByRole("button", { name: "Batteries", exact: true }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Sector filter");
    await page.getByRole("button", { name: "HHI", exact: true }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Metric toggle");
    await page.getByRole("button", { name: "Reliance map", exact: true }).first().click();
    await page.waitForTimeout(400);
    console.log("✓ Reliance map panel");
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
