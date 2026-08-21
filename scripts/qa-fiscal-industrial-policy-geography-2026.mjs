/**
 * QA: fiscal-industrial-policy-geography-2026
 * // viz-types: region dual bars, stock pie, count×$ scatter, US state ladder+donut, sector stacked, meter compare | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  REGION_SHARES,
  US_STATE_AWARDS,
  JUNE_FLOW,
} from "../src/data/fiscal-industrial-policy-geography-2026-data.ts";

assert.equal(HEADLINE.eastAsiaStockSharePct, 33);
assert.ok(HEADLINE.northAmericaPackageSharePct > 70);
assert.equal(HEADLINE.usTop3StateAwardSharePct, 58);
assert.equal(HEADLINE.juneRowSharePct, 62);
assert.equal(REGION_SHARES.length, 4);
assert.ok(US_STATE_AWARDS.length >= 5);
const juneSum = JUNE_FLOW.reduce((s, f) => s + f.sharePct, 0);
assert.equal(juneSum, 100);

const root = process.cwd();
const slug = "fiscal-industrial-policy-geography-2026";
const markers = [
  "Fiscal & industrial policy — geography lens",
  "Where policy capacity lands on the map",
];

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
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    for (const label of ["Regions", "Count × $", "US states", "Sectors"]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Regions" }).first().click();
    await page.getByRole("button", { name: "Package $" }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Region metric toggle");
    await page.getByRole("button", { name: "Sectors" }).first().click();
    await page.getByRole("button", { name: "Semis" }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Sector focus toggle");
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
