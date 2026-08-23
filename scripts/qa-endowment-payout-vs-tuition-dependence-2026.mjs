/**
 * QA: endowment-payout-vs-tuition-dependence-2026
 * // viz-types: size bars, payout-vs-tuition scatter, ops-support trend lines, decile composed | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  INSTITUTIONS,
  SIZE_BANDS,
  OPS_SUPPORT_TREND,
  DECILE_BUFFER,
} from "../src/data/endowment-payout-vs-tuition-dependence-2026-data.ts";

assert.equal(HEADLINE.avgEndowmentShareOfOpsPct, 15.2);
assert.equal(HEADLINE.medianEndowmentShareOfOpsPct, 6.1);
assert.equal(HEADLINE.topSizeBandShareOfOpsPct, 20.1);
assert.equal(HEADLINE.over5bShareOfOpsPct, 18.1);
assert.equal(HEADLINE.leastReliantBandShareOfOpsPct, 12.1);
assert.equal(HEADLINE.harvardEndowmentSharePct, 37);
assert.equal(HEADLINE.yaleEndowmentSharePct, 34);
assert.equal(HEADLINE.yaleNetTuitionSharePct, 8);
assert.equal(HEADLINE.princetonEndowmentSharePct, 67);
assert.equal(HEADLINE.effectiveSpendRatePct, 4.9);
assert.equal(HEADLINE.totalWithdrawalsBn, 33.4);
assert.equal(SIZE_BANDS.length, 7);
assert.equal(INSTITUTIONS.length, 12);
assert.equal(OPS_SUPPORT_TREND.length, 8);
assert.equal(DECILE_BUFFER.length, 10);
assert.equal(INSTITUTIONS[0].id, "princeton");

const root = process.cwd();
const slug = "endowment-payout-vs-tuition-dependence-2026";
const markers = [
  "Higher-ed endowments · payout vs tuition",
  "Endowment support by size band",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(200);
}

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
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Payout vs tuition");
    await clickBtn(page, "Private");
    await clickBtn(page, "Public");
    await clickBtn(page, "All");
    await clickBtn(page, "Ops-support trend");
    await clickBtn(page, "Decile buffer");
    await clickBtn(page, "Size bands");
    await clickBtn(page, "Spend rate");
    await clickBtn(page, "% of ops");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
