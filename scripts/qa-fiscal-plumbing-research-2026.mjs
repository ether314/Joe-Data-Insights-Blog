/**
 * QA: fiscal-plumbing-research-2026
 * // viz-types: plumbing pie, trust depletion dual-line, off-balance scatter, ranked lollipop, family bars, cumulative area | layout: canvas
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  JCT_TOP10,
  OFF_BALANCE,
  TREASURY_HEADLINES,
  TRUST_FUNDS,
  rankedJctTop10,
} from "../src/data/fiscal-plumbing-research-2026-data.ts";

assert.equal(HEADLINE.jctFy2026Tn, 2.3);
assert.equal(HEADLINE.treasuryEsiBn, 296);
assert.equal(HEADLINE.jctEsiBn, 240);
assert.equal(HEADLINE.oasdiDepletionYear, 2034);
assert.equal(JCT_TOP10.length, 10);
assert.equal(TREASURY_HEADLINES.length, 4);
assert.ok(TRUST_FUNDS.length >= 4);
assert.ok(OFF_BALANCE.length >= 4);
const ranked = rankedJctTop10();
assert.equal(ranked[0].shortLabel, "Pensions / retirement");
assert.ok(ranked[0].fy2026Bn >= ranked[1].fy2026Bn);

const root = process.cwd();
const slug = "fiscal-plumbing-research-2026";
const markers = [
  "Fiscal plumbing — trust funds · tax code · off-balance credit",
  "Where the real annual levers sit",
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
    for (const label of [
      "Trust funds",
      "Off-balance",
      "Tax-exp rank",
      "By family",
      "Top-N build-up",
      "Plumbing map",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Tax-exp rank" }).first().click();
    await page.getByRole("button", { name: "Treasury headlines" }).first().click();
    await page.getByText("Treasury published FY2026 headline items", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("✓ Treasury scope toggle");
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
