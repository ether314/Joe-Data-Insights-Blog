/**
 * QA: energy-systems-concentration-2026
 * // viz-types: Top-k ladder bars, Lorenz area+line, fuel export stacks, HHI donut, import×fossil scatter, lens avg bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CONCENTRATION_ROWS,
  HEADLINE,
  FUEL_EXPORT_STACK,
} from "../src/data/energy-systems-concentration-2026-data.ts";

assert.equal(HEADLINE.demandTop1Pct, 27.4);
assert.equal(HEADLINE.demandTop3Pct, 49.2);
assert.equal(HEADLINE.coalExportTop3Pct, 72);
assert.equal(HEADLINE.lngTop3Pct, 61);
assert.equal(HEADLINE.solarModuleTop1Pct, 80);
assert.ok(CONCENTRATION_ROWS.length >= 12);
assert.equal(FUEL_EXPORT_STACK[0].fuel, "Coal");
assert.equal(FUEL_EXPORT_STACK[0].top3BlocPct, 72);

const root = process.cwd();
const slug = "energy-systems-concentration-2026";
const markers = [
  "Energy systems — concentration lens",
  "Top-1 demand",
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
  const port = Number(process.env.SMOKE_PORT || 4188);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector('[data-viz="energy-systems-concentration-2026"]', {
      timeout: 20000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Top-3");
    await clickBtn(page, "HHI");
    await clickBtn(page, "Demand");
    await clickBtn(page, "Demand curve");
    await page.getByText("World TPES concentration curve", { exact: false }).first().waitFor({ timeout: 10000 });
    console.log("✓ World TPES concentration curve");
    await clickBtn(page, "Fuel exports");
    await clickBtn(page, "Import risk");
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
    console.log("qa-energy-systems-concentration-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
