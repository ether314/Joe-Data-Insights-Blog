/**
 * QA: local-police-fire-plan-underfunding-2026
 * // viz-types: weighted gap bars, median ladder bars, funded-bin grouped bars, funded×liability scatter, type-path composed lines | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  PLAN_SAMPLE,
  TYPE_SPLITS,
  medianFunded,
  plansByCohort,
} from "../src/data/local-police-fire-plan-underfunding-2026-data.ts";

assert.equal(HEADLINE.muniPsWeightedPct, 76.7);
assert.equal(HEADLINE.teacherWeightedPct, 76.4);
assert.equal(HEADLINE.weightedGapMuniPsVsTeacherPp, 0.3);
assert.equal(HEADLINE.medianGapPsVsTeacherPp, 30.0);
assert.ok(PLAN_SAMPLE.length >= 25);
assert.ok(TYPE_SPLITS.length >= 10);
assert.equal(medianFunded(plansByCohort("all-public-safety")), 92);
assert.equal(medianFunded(plansByCohort("teacher")), 62);

const root = process.cwd();
const slug = "local-police-fire-plan-underfunding-2026";
const markers = [
  "Local police / fire · funded-ratio gap",
  "Median gap: public-safety sample",
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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Median ladder");
    await clickBtn(page, "Funded bins");
    await clickBtn(page, "Funded × size");
    await clickBtn(page, "Type path");
    await clickBtn(page, "FY 2023");
    await clickBtn(page, "FY 2024");
    await clickBtn(page, "Muni P&F only");
    await clickBtn(page, "Teachers");
    await clickBtn(page, "Weighted gaps");
    await clickBtn(page, "All public safety");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 16,
      maxCharts: 4,
    });
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
