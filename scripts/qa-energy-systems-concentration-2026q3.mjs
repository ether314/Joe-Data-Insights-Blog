/**
 * QA: energy-systems-concentration-2026q3
 * // viz-types: Top-k ladder bars, Lorenz area+line, fuel export stacks, HHI donut, clean-inv pie, growth bars, import×wholesale scatter, vintage multi-line, lens avg bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CONCENTRATION_ROWS,
  FUEL_EXPORT_STACK,
  HEADLINE,
  VINTAGE_SLOPE,
} from "../src/data/energy-systems-concentration-2026q3-data.ts";

assert.equal(HEADLINE.elecTop1Pct, 33.2);
assert.equal(HEADLINE.elecTop3Pct, 56.5);
assert.equal(HEADLINE.lngTop1Pct, 24);
assert.equal(HEADLINE.lngTop3Pct, 63);
assert.equal(HEADLINE.cleanInvTop1Pct, 34);
assert.equal(HEADLINE.solarModuleTop1Pct, 80);
assert.ok(CONCENTRATION_ROWS.length >= 14);
assert.equal(FUEL_EXPORT_STACK[0].fuel, "Coal");
assert.equal(FUEL_EXPORT_STACK[1].top1SharePct, 24);
assert.ok(VINTAGE_SLOPE.length >= 3);

const root = process.cwd();
const slug = "energy-systems-concentration-2026q3";
const markers = [
  "Energy systems — Q3 concentration lens",
  "Power Top-1",
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
      '[data-viz="energy-systems-concentration-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Top-3");
    await clickBtn(page, "HHI");
    await clickBtn(page, "Δ pp");
    await clickBtn(page, "Demand");
    await clickBtn(page, "Power curve");
    await page
      .getByText("Electricity concentration curve", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Electricity concentration curve");
    await clickBtn(page, "Fuel exports");
    await clickBtn(page, "Capex tip");
    await clickBtn(page, "Import shock");
    await clickBtn(page, "Vintage slope");
    await clickBtn(page, "Top-k ladder");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-energy-systems-concentration-2026q3: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
