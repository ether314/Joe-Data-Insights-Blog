/**
 * QA: adaptation-economics-geography-2026
 * // viz-types: gap bars+pie, flow bars+dual, donor pie+bars, resilience×gap scatter, mismatch scatter, loss stacked+bars, hazard stacked, meter compare | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DONOR_BLOCS,
  FLOW_RECIPIENTS,
  HEADLINE,
  REGION_GAPS,
} from "../src/data/adaptation-economics-geography-2026-data.ts";

assert.equal(HEADLINE.top1GapRegionSharePct, 22.4);
assert.equal(HEADLINE.top1GapRegionLabel, "North America");
assert.equal(HEADLINE.top3GapRegionSharePct, 52.6);
assert.equal(HEADLINE.protectionGapBn, 424);
assert.equal(HEADLINE.top1FlowRegionSharePct, 28);
assert.equal(HEADLINE.top1FlowRegionLabel, "Sub-Saharan Africa");
assert.equal(HEADLINE.top1DonorBlocSharePct, 52);
assert.equal(HEADLINE.mdbLmicAdapt2025Bn, 35);
assert.ok(REGION_GAPS.length >= 7);
assert.equal(REGION_GAPS[0].region, "North America");
assert.equal(FLOW_RECIPIENTS[0].region, "Sub-Saharan Africa");
assert.equal(DONOR_BLOCS[0].bloc, "Western Europe");
const gapSum = REGION_GAPS.reduce((s, r) => s + r.gapBn, 0);
assert.equal(gapSum, 424);
const flowSum = Math.round(
  FLOW_RECIPIENTS.reduce((s, r) => s + r.amountBn, 0) * 10,
) / 10;
assert.equal(flowSum, 35);

const root = process.cwd();
const slug = "adaptation-economics-geography-2026";
const markers = [
  "Adaptation economics — geography lens",
  "Where damage dollars, adaptation flows, and capacity sit on the map",
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
  const port = Number(process.env.SMOKE_PORT || 4180);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(
      '[data-viz="adaptation-economics-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Gap map");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Gap $");
    await clickBtn(page, "Developing");
    await clickBtn(page, "All");
    await clickBtn(page, "Flow map");
    await clickBtn(page, "Mismatch");
    await clickBtn(page, "Damage map");
    await clickBtn(page, "Insured %");
    await clickBtn(page, "Uninsured $");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-adaptation-economics-geography-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
