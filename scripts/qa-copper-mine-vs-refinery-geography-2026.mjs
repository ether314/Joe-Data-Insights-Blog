/**
 * QA: copper-mine-vs-refinery-geography-2026
 * // viz-types: mine↔refine dumbbell, gap diverging bars, mine×refine scatter, US import donut | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  COUNTRIES,
  WORLD_MINE_2024,
  WORLD_REFINE_2024,
  mineShare2024,
  refineShare2024,
} from "../src/data/copper-mine-vs-refinery-geography-2026-data.ts";

assert.ok(HEADLINE.chinaRefineSharePct > 40);
assert.ok(HEADLINE.chinaMineSharePct < 12);
assert.ok(HEADLINE.chinaRefineOverMineRatio > 4);
assert.equal(WORLD_MINE_2024, 23_000);
assert.equal(WORLD_REFINE_2024, 27_000);
const china = COUNTRIES.find((c) => c.iso === "CN");
assert.ok(china);
assert.equal(china.refine2024Kt, 12_000);
assert.ok(refineShare2024(china) > mineShare2024(china) * 4);

const root = process.cwd();
const slug = "copper-mine-vs-refinery-geography-2026";
const markers = [
  "Copper mine vs refinery geography",
  "Who digs vs who refines",
];

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
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    for (const label of ["Mine ↔ refine", "Share gap", "Scatter", "US exposure"]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Share gap" }).first().click();
    await page.getByRole("button", { name: "Refine-heavy" }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Gap sort toggle");
    await page.getByRole("button", { name: "Mine ↔ refine" }).first().click();
    await page.getByRole("button", { name: "Refine tons" }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Rank mode toggle");
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
