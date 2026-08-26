/**
 * QA: deceased-donor-kidney-discard-versus-offer-filters-2026
 * // viz-types: grouped KDPI bars, area+line nonuse path, dual-axis discard vs filters, filter scatter, horizontal complexity bars, willingness bars, reason-shift grouped bars | layout: default
 * // smoke-marker: Headline — overall nonuse 29.3% in 2024; KDPI ≥85% still ~69.5%
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  COMPLEXITY_NONUSE_2024,
  DISCARD_VS_FILTERS,
  HEADLINE,
  KDPI_BAND_NONUSE,
  OFFER_FILTER_ADOPTION,
  OVERALL_NONUSE,
} from "../src/data/deceased-donor-kidney-discard-versus-offer-filters-2026-data.ts";

assert.equal(HEADLINE.overallNonuse2024Pct, 29.3);
assert.equal(HEADLINE.overallNonuse2012Pct, 18.7);
assert.equal(HEADLINE.highKdpiNonuse2024Pct, 69.5);
assert.equal(HEADLINE.highKdpiNonuse2023Pct, 72.5);
assert.equal(HEADLINE.programsWithFilterPct, 60);
assert.ok(OVERALL_NONUSE.length >= 10);
assert.ok(KDPI_BAND_NONUSE.length >= 16);
assert.ok(OFFER_FILTER_ADOPTION.length >= 3);
assert.ok(DISCARD_VS_FILTERS.length >= 4);
assert.ok(COMPLEXITY_NONUSE_2024.length >= 5);
assert.ok(ANALYTICS.overallRisePp > 10);

const root = process.cwd();
const slug = "deceased-donor-kidney-discard-versus-offer-filters-2026";
const markers = [
  "Headline — overall nonuse 29.3% in 2024; KDPI ≥85% still ~69.5%",
  "KDPI band discard",
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
  const port = Number(process.env.SMOKE_PORT || 4186);
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
    await clickBtn(page, "Overall nonuse path");
    await clickBtn(page, "Discard vs filters");
    await clickBtn(page, "Filter uptake scatter");
    await clickBtn(page, "Complexity correlates");
    await clickBtn(page, "High-KDPI willingness");
    await clickBtn(page, "Reason shift");
    await clickBtn(page, "KDPI band discard");
    await clickBtn(page, "Offer-filter era");
    await clickBtn(page, "All years");
    await clickBtn(page, "KDPI ≥85");
    await clickBtn(page, "All KDPI bands");
    await clickBtn(page, "High-KDPI willingness");
    await clickBtn(page, "2023");
    await clickBtn(page, "2024");
    await auditVizInteractions(page, slug);
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
