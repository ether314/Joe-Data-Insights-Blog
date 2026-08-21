/**
 * QA: fiscal-industrial-policy-concentration-202608
 * // viz-types: HHI bars, Lorenz area+line, ownership ranked bars, monthly flow path, toolkit donut, lens scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  HHI_BY_LENS,
  JUNE_FLOW,
  OWNERSHIP_STAKES,
  PACKAGE_SHARES_CORE,
  STOCK_SHARES,
} from "../src/data/fiscal-industrial-policy-concentration-202608-data.ts";

assert.equal(HEADLINE.top3StockSharePct, 63);
assert.equal(HEADLINE.top1StockSharePct, 24);
assert.equal(HEADLINE.top1PackageSharePct, 71);
assert.equal(HEADLINE.top3PackageSharePct, 93);
assert.equal(HEADLINE.packageHhi, 5320);
assert.equal(HEADLINE.ownershipTop1SharePct, 63);
assert.equal(HEADLINE.altTop1SharePct, 60);
assert.equal(HEADLINE.juneTop3SharePct, 38);
assert.equal(HEADLINE.juneRestSharePct, 62);
assert.equal(HEADLINE.julVsMayDeltaPct, 25);
assert.equal(STOCK_SHARES[0].sharePct, 24);
assert.equal(PACKAGE_SHARES_CORE[0].short, "US");
assert.equal(JUNE_FLOW[0].sharePct, 20);
assert.equal(OWNERSHIP_STAKES[0].short, "CN subnational");
assert.ok(HHI_BY_LENS.length >= 5);

const root = process.cwd();
const slug = "fiscal-industrial-policy-concentration-202608";
const markers = [
  "Fiscal & industrial policy — Aug 202608 concentration lens",
  "HHI by concentration lens",
  "Top-1 vs top-3 scatter",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(150);
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
    await page.waitForSelector(
      '[data-viz="fiscal-industrial-policy-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Package ladders");
    await clickBtn(page, "Core war chest");
    await clickBtn(page, "+ Korea mega-plan");
    await page
      .getByText("Sensitivity: adds Korea mega-plan", { exact: false })
      .first()
      .waitFor({ timeout: 20000 });
    console.log("✓ Sensitivity: adds Korea mega-plan");
    await clickBtn(page, "Ownership stakes");
    await page
      .getByText("Ownership / equity stake ladder", { exact: false })
      .first()
      .waitFor({ timeout: 20000 });
    console.log("✓ Ownership / equity stake ladder");
    await clickBtn(page, "Flow path");
    await clickBtn(page, "HHI radar");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-fiscal-industrial-policy-concentration-202608: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
