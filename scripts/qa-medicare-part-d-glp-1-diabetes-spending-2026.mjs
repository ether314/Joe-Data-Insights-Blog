/**
 * QA: medicare-part-d-glp-1-diabetes-spending-2026
 * // viz-types: share-path composed (area+line), brand horizontal bars,
 * // enrollee dual lines, plan-carrier bars + pie, brand scatter,
 * // gross-vs-net bars + mix pie | layout: default
 * // smoke-marker: GLP-1 share of Part D spend
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BRAND_LADDER,
  HEADLINE,
  PLAN_CARRIER,
  SHARE_PATH,
} from "../src/data/medicare-part-d-glp-1-diabetes-spending-2026-data.ts";

assert.equal(HEADLINE.glp1GrossCost2024B, 24.57);
assert.equal(HEADLINE.glp1CostSharePct, 10.8);
assert.equal(HEADLINE.glp1ClaimSharePct, 1.3);
assert.equal(HEADLINE.ozempicCost2024B, 12.38);
assert.equal(HEADLINE.partDTotalCost2024B, 226.74);
assert.ok(BRAND_LADDER.length >= 4);
assert.ok(SHARE_PATH.length >= 5);
assert.ok(PLAN_CARRIER.length >= 3);

const root = process.cwd();
const slug = "medicare-part-d-glp-1-diabetes-spending-2026";
const markers = [
  "GLP-1 share of Part D spend",
  "Diabetes-indicated GLP-1s",
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
    await clickBtn(page, "Share path");
    await clickBtn(page, "Brands");
    await clickBtn(page, "All");
    await clickBtn(page, "Ozempic");
    await clickBtn(page, "Enrollees");
    await clickBtn(page, "Plan carriers");
    await clickBtn(page, "GLP-1 $ share");
    await clickBtn(page, "Enrollment share");
    await clickBtn(page, "Gross vs net");
    await clickBtn(page, "Share path");
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
