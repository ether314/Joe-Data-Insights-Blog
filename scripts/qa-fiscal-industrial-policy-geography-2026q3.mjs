/**
 * QA: fiscal-industrial-policy-geography-2026q3
 * // viz-types: mismatch bars, region dual+pie, count×$ scatter, monthly area+line, US/EU ladders+donuts, corridor stacked, vintage slope | layout: default
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
  EU_MEMBER_SHARES,
  JUNE_FLOW,
  MONTHLY_FLOW_PATH,
} from "../src/data/fiscal-industrial-policy-geography-2026q3-data.ts";

assert.equal(HEADLINE.eastAsiaStockSharePct, 33);
assert.ok(HEADLINE.northAmericaPackageSharePct > 70);
assert.ok(HEADLINE.naMismatchPp > 45);
assert.equal(HEADLINE.usTop3StateAwardSharePct, 58);
assert.equal(HEADLINE.euTop3MemberSharePct, 61);
assert.equal(HEADLINE.juneRowSharePct, 62);
assert.equal(REGION_SHARES.length, 4);
assert.ok(EU_MEMBER_SHARES.length >= 5);
const juneSum = JUNE_FLOW.reduce((s, f) => s + f.sharePct, 0);
assert.equal(juneSum, 100);
assert.equal(MONTHLY_FLOW_PATH.length, 3);

const root = process.cwd();
const slug = "fiscal-industrial-policy-geography-2026q3";
const markers = [
  "Fiscal & industrial policy — Q3 geography lens",
  "Regional shares that disagree on who leads",
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
    for (const label of ["Mismatch", "Flow path", "Subnational", "Corridors"]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Subnational" }).first().click();
    await page.getByRole("button", { name: "EU members" }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Subnational EU toggle");
    await page.getByRole("button", { name: "Corridors" }).first().click();
    await page.getByRole("button", { name: "Clean" }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Corridor theme toggle");
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
