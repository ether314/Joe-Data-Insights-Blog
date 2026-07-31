/**
 * QA: macro-growth-trade-research-2026
 * // viz-types: triad composed (area+dual lines), multi-country GDP trajectories, growth×CPI scatter, regional contribution lollipop, goods-vs-services grouped bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  REGION_CONTRIBUTIONS,
  ECONOMIES,
  GLOBAL_PATH,
  rankedContributions,
} from "../src/data/macro-growth-trade-research-2026-data.ts";

assert.equal(HEADLINE.wtoMerch2025, 4.6);
assert.equal(HEADLINE.worldGdp2026, 3.1);
assert.equal(HEADLINE.worldCpi2026, 4.4);
assert.equal(HEADLINE.asiaShareOfTradeGrowthPct, 71);
assert.ok(Math.abs(HEADLINE.asiaContributionPp2025 - 3.2) < 0.01);
assert.ok(GLOBAL_PATH.some((p) => p.year === 2025 && p.merchVolume === 4.6));
assert.ok(ECONOMIES.some((e) => e.id === "usa" && e.gdp2026 === 2.3));
const ranked = rankedContributions();
assert.equal(ranked[0].region, "Asia");
assert.ok(ranked[0].pp2025 >= ranked[1].pp2025);
assert.equal(REGION_CONTRIBUTIONS.length, 4);

const root = process.cwd();
const slug = "macro-growth-trade-research-2026";
const markers = [
  "Growth, trade & prices — IMF WEO Apr 2026",
  "Global triad: GDP, merchandise trade volume, and CPI",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4183);
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
    for (const label of ["GDP paths", "Growth × CPI", "Trade regions", "Goods vs services", "Global triad"]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Trade regions" }).first().click();
    await page.getByText("Who drove 2025 merchandise volume growth?", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("✓ Who drove 2025 merchandise volume growth?");
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
