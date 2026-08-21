/**
 * QA: fiscal-plumbing-concentration-202608
 * // viz-types: Lens ladder bars, Lorenz area+line, trust crossover, HHI donut, leverage scatter, vintage slope + Top-1 deltas | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  LENS_COMPARE,
  OFF_BALANCE_SHARES,
  TE_SHARES,
  TRUST_SHARES,
  VINTAGE_SLOPE,
} from "../src/data/fiscal-plumbing-concentration-202608-data.ts";

assert.equal(HEADLINE.teTop1Pct, 15.9);
assert.equal(HEADLINE.teTop3Pct, 37.8);
assert.equal(HEADLINE.teUniverseTn, 2.57);
assert.equal(HEADLINE.trustTop1Pct, 54.3);
assert.equal(HEADLINE.offTop3Pct, 91.1);
assert.equal(HEADLINE.offStockTn, 24.0);
assert.equal(TE_SHARES[0].short, "Pensions");
assert.equal(TRUST_SHARES[0].short, "OASI");
assert.equal(OFF_BALANCE_SHARES[0].short, "FDIC DI");
assert.ok(LENS_COMPARE.length >= 4);
assert.equal(VINTAGE_SLOPE.length, 3);

const root = process.cwd();
const slug = "fiscal-plumbing-concentration-202608";
const markers = [
  "Fiscal plumbing — Aug 202608 concentration lens",
  "Top-3 share % across plumbing lenses",
  "HHI band mix",
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
      '[data-viz="fiscal-plumbing-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Concentration curve");
    await page
      .getByText("concentration curve", { exact: false })
      .first()
      .waitFor({ timeout: 20000 });
    console.log("✓ concentration curve panel");
    await clickBtn(page, "Trust crossovers");
    await page
      .getByText("Trust-fund revenue vs cost", { exact: false })
      .first()
      .waitFor({ timeout: 20000 });
    console.log("✓ Trust-fund revenue vs cost");
    await clickBtn(page, "Gap only");
    await clickBtn(page, "Rev · Cost");
    await clickBtn(page, "Off-balance leverage");
    await page
      .getByText("Budget visibility × policy leverage", { exact: false })
      .first()
      .waitFor({ timeout: 20000 });
    console.log("✓ Budget visibility × policy leverage");
    await clickBtn(page, "Vintage slope");
    await page
      .getByText("Top-1 share: Q3 → Aug 202608", { exact: false })
      .first()
      .waitFor({ timeout: 20000 });
    console.log("✓ Top-1 share: Q3 → Aug 202608");
    await clickBtn(page, "TE Top-3");
    await clickBtn(page, "Trust Top-1");
    await clickBtn(page, "Lens ladder");
    await clickBtn(page, "Top-1");
    await clickBtn(page, "HHI");
    await clickBtn(page, "Trust funds");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-fiscal-plumbing-concentration-202608: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
