/**
 * QA: survival-curves-of-pandemic-era-startups-2026
 * // viz-types: survival curves, national path line, division delta bars, 2020×2022 scatter, sector ladder | layout: default
 * // smoke-marker: One-year survival share
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COHORT_CURVES,
  DIVISION_COMPARE,
  HEADLINE,
  NATIONAL_ONE_YEAR,
  ONE_YEAR_BY_DIVISION,
  SECTOR_ONE_YEAR,
} from "../src/data/survival-curves-of-pandemic-era-startups-2026-data.ts";

assert.equal(HEADLINE.oneYear2020Pct, 80.8);
assert.equal(HEADLINE.oneYear2022Pct, 76.9);
assert.equal(HEADLINE.drop2020to2022Pp, 3.9);
assert.ok(NATIONAL_ONE_YEAR.length >= 8);
assert.ok(COHORT_CURVES.length >= 5);
assert.ok(DIVISION_COMPARE.length === 9);
assert.ok(SECTOR_ONE_YEAR.length >= 6);
assert.ok(ONE_YEAR_BY_DIVISION[2020].ENC === 82.1);
assert.ok(ONE_YEAR_BY_DIVISION[2022].MTN === 74.4);

const root = process.cwd();
const slug = "survival-curves-of-pandemic-era-startups-2026";
const markers = [
  "One-year survival share",
  "Survival curves by birth cohort",
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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "National path");
    await clickBtn(page, "Division deltas");
    await clickBtn(page, "2020 × 2022");
    await clickBtn(page, "Sector ladder");
    await clickBtn(page, "Survival curves");
    await clickBtn(page, "Exit %");
    await clickBtn(page, "Survival %");
    await clickBtn(page, "2021");
    await auditVizInteractions(page, { slug, maxButtons: 16 });
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
