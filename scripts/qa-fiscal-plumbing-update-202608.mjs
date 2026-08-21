/**
 * QA: fiscal-plumbing-update-202608
 * // viz-types: diverging-delta-bar, jct composed, interest dual-area, delta-share pie, trust dual-path, layer grouped bar, off-balance scatter, jct waterfall, ESI gap | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  JCT_LINE_DELTAS,
  OFF_BALANCE_DELTAS,
  TRUST_DELTAS,
  VINTAGE_DELTAS,
} from "../src/data/fiscal-plumbing-update-202608-data.ts";

assert.equal(HEADLINE.jctPriorTn, 2.51);
assert.equal(HEADLINE.jctNewTn, 2.57);
assert.equal(HEADLINE.oasdiPriorYear, 2033);
assert.equal(HEADLINE.oasdiNewYear, 2033);
assert.equal(HEADLINE.gsePriorTn, 8.35);
assert.equal(HEADLINE.gseNewTn, 8.55);
assert.equal(HEADLINE.netInterestPriorBn, 1120);
assert.equal(HEADLINE.netInterestNewBn, 1180);
assert.ok(VINTAGE_DELTAS.length >= 8);
assert.ok(JCT_LINE_DELTAS.length >= 8);
assert.ok(TRUST_DELTAS.length >= 4);
assert.ok(OFF_BALANCE_DELTAS.length >= 4);
assert.ok(HEADLINE.jctNewTn > HEADLINE.jctPriorTn);
assert.ok(HEADLINE.netInterestNewBn > HEADLINE.netInterestPriorBn);
assert.equal(HEADLINE.oasdiDeltaYears, 0);

const root = process.cwd();
const slug = "fiscal-plumbing-update-202608";
const markers = [
  "Fiscal plumbing — late-Aug 202608 vintage delta",
  "Net interest $1.12T → $1.18T",
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
    for (const label of [
      "Vintage deltas",
      "Code pressure",
      "Guarantee book",
      "All layers",
      "Tax code",
      "Trust funds",
      "Off-balance",
      "All families",
      "retirement",
      "health",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Code pressure" }).first().click();
    await page.getByText("Net interest vs discretionary", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("✓ View + layer filter interaction");
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
