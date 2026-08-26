/**
 * QA: stranded-spent-fuel-at-shutdown-reactor-sites-2026
 * // viz-types: site horizontal bars, region composed bars+line, license pie, years-stranded scatter, cohort area+bar+line, storage grouped bars | layout: default
 * // smoke-marker: Headline — 20 Group A sites, 12,310 MTU onsite
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  HEADLINE,
  LICENSE_MIX,
  REGION_TOTALS,
  SHUTDOWN_COHORTS,
  SHUTDOWN_SITES,
  STORAGE_SPLIT,
} from "../src/data/stranded-spent-fuel-at-shutdown-reactor-sites-2026-data.ts";

assert.equal(HEADLINE.groupASites, 20);
assert.equal(HEADLINE.groupAMtu, 12310);
assert.equal(HEADLINE.a1Sites, 18);
assert.equal(HEADLINE.isfsiOnlyLwrSites, 6);
assert.equal(HEADLINE.isfsiOnlyLwrMtu, 1729);
assert.equal(SHUTDOWN_SITES.length, 20);
assert.ok(REGION_TOTALS.length === 4);
assert.ok(LICENSE_MIX.length >= 3);
assert.ok(SHUTDOWN_COHORTS.length >= 8);
assert.ok(STORAGE_SPLIT.length === 2);
assert.equal(ANALYTICS.largestSite, "San Onofre");

const root = process.cwd();
const slug = "stranded-spent-fuel-at-shutdown-reactor-sites-2026";
const markers = [
  "Headline — 20 Group A sites, 12,310 MTU onsite",
  "Site MTU ladder",
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
    await clickBtn(page, "Region map");
    await clickBtn(page, "License mix");
    await clickBtn(page, "Years stranded");
    await clickBtn(page, "Cohort path");
    await clickBtn(page, "Dry vs wet");
    await clickBtn(page, "Site MTU ladder");
    await clickBtn(page, "ISFSI-only");
    await clickBtn(page, "West");
    await clickBtn(page, "Pre-2000 shutdowns");
    await clickBtn(page, "All regions");
    await clickBtn(page, "All licenses");
    await clickBtn(page, "All eras");
    await clickBtn(page, "Top 10 by MTU");
    await clickBtn(page, "All sites");
    await auditVizInteractions(page, slug);
    console.log("✓ stranded-spent-fuel-at-shutdown-reactor-sites-2026 QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
