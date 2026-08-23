/**
 * QA: us-housing-permits-vs-household-formation-2026
 * // viz-types: dual-axis composed bars+line, cumulative area+bars, metro ladder bars, scatter, stacked area+pie, region stacks | layout: default
 * // smoke-marker: units authorized per net new household
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  CUMULATIVE_GAP,
  HEADLINE,
  METRO_LADDER,
  NATIONAL_ANNUAL,
  REGION_PERMITS,
  STRUCTURE_MIX,
} from "../src/data/us-housing-permits-vs-household-formation-2026-data.ts";

assert.equal(HEADLINE.permitsPerHousehold2024, 0.94);
assert.equal(HEADLINE.permits2024Thousands, 1470);
assert.equal(HEADLINE.householdGrowth2024Thousands, 1560);
assert.equal(HEADLINE.lowestMetroRatio, 0.42);
assert.ok(NATIONAL_ANNUAL.length >= 8);
assert.ok(METRO_LADDER.length >= 12);
assert.ok(STRUCTURE_MIX.length >= 5);
assert.ok(REGION_PERMITS.length >= 4);
assert.ok(CUMULATIVE_GAP.length >= 4);
assert.ok(ANALYTICS.metrosBelowOne >= 8);
assert.ok(ANALYTICS.southShareOf2024PermitsPct >= 45);

const root = process.cwd();
const slug = "us-housing-permits-vs-household-formation-2026";
const markers = [
  "units authorized per net new household",
  "Permits per net household",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Cumulative gap");
    await clickBtn(page, "Metro ladder");
    await clickBtn(page, "Metro scatter");
    await clickBtn(page, "Structure mix");
    await clickBtn(page, "Region stack");
    await clickBtn(page, "National ratio");
    const audit = await auditVizInteractions(page, { slug });
    console.log(`✓ viz interaction audit: ${audit.clicked} controls`);
    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
