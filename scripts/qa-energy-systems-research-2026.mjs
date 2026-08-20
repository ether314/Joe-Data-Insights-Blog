/**
 * QA: energy-systems-research-2026
 * // viz-types: stacked primary mix, primary↔electricity slope, import×fossil scatter, fuel-trade bars, import scoreboard | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTRIES,
  FUEL_TRADES,
  HEADLINE,
  filterCountries,
  fossilPrimaryShare,
} from "../src/data/energy-systems-research-2026-data.ts";

assert.ok(COUNTRIES.length >= 15);
assert.equal(HEADLINE.countriesTracked, COUNTRIES.filter((c) => c.id !== "world").length);
assert.ok(HEADLINE.euImportDependencePct >= 50);
assert.ok(HEADLINE.japanImportDependencePct >= 80);
assert.ok(HEADLINE.lngTop3SharePct >= 55);
assert.ok(FUEL_TRADES.length >= 4);
assert.ok(filterCountries({ region: "Europe" }).length >= 3);
assert.ok(filterCountries({ stance: "net-importer" }).length >= 5);

const eu = COUNTRIES.find((c) => c.id === "eu27");
assert.ok(eu);
assert.ok(eu.importDependencePct >= 50);
assert.ok(fossilPrimaryShare(eu) >= 60);

const france = COUNTRIES.find((c) => c.id === "france");
assert.ok(france);
assert.ok(france.elecFossilSharePct < fossilPrimaryShare(france));

const root = process.cwd();
const slug = "energy-systems-research-2026";
const markers = [
  "How countries source, mix, and trade energy",
  "Energy systems",
];

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
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    for (const label of [
      "Primary mix",
      "Primary ↔ power",
      "Import map",
      "Fuel trade",
      "Dependence rank",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Primary mix" }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "All regions", exact: true }).first().click();
    await page.getByRole("button", { name: "All stances", exact: true }).first().click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Europe", exact: true }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Region filter");
    await page.getByRole("button", { name: "Net importers", exact: true }).first().click();
    await page.waitForTimeout(300);
    console.log("✓ Stance filter");
    await page.getByRole("button", { name: "Import map", exact: true }).first().click();
    await page.waitForTimeout(400);
    console.log("✓ Import map panel");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("⚠ warnings:", audit.warnings.join("; "));
    }
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
