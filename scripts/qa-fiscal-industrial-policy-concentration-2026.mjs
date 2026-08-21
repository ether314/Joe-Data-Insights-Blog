/**
 * QA: fiscal-industrial-policy-concentration-2026
 * // viz-types: Lorenz area+line, ranked share bars, package pie, strategic dumbbell, lens scatter, flow donut | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  JUNE_FLOW,
  PACKAGE_SHARES,
  STOCK_SHARES,
} from "../src/data/fiscal-industrial-policy-concentration-2026-data.ts";

assert.equal(HEADLINE.top3StockSharePct, 63);
assert.equal(HEADLINE.top1StockSharePct, 24);
assert.equal(HEADLINE.top1PackageSharePct, 71);
assert.equal(HEADLINE.top3PackageSharePct, 93);
assert.equal(HEADLINE.juneTop3SharePct, 38);
assert.equal(HEADLINE.juneRestSharePct, 62);
assert.equal(STOCK_SHARES[0].sharePct, 24);
assert.equal(PACKAGE_SHARES[0].short, "US");
assert.equal(JUNE_FLOW[0].sharePct, 20);

const root = process.cwd();
const slug = "fiscal-industrial-policy-concentration-2026";
const markers = [
  "Fiscal & industrial policy — concentration lens",
  "Cumulative share vs equal split",
  "Jurisdiction ladder (stock counts)",
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
  const port = Number(process.env.SMOKE_PORT || 4182);
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
      '[data-viz="fiscal-industrial-policy-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Package $");
    await clickBtn(page, "Package dollars");
    await clickBtn(page, "USD billions");
    await clickBtn(page, "Strategic intensity");
    await clickBtn(page, "Monthly flow");
    await clickBtn(page, "Concentration ladder");
    await clickBtn(page, "Cumulative");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-fiscal-industrial-policy-concentration-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
