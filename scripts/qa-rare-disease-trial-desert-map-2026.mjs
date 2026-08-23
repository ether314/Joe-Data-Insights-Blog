/**
 * QA: rare-disease-trial-desert-map-2026
 * // viz-types: density bars, mismatch bars+radar, scatter+trend lines, phase+sponsor bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  REGION_ROWS,
  PHASE_MIX,
  TREND_INDEX,
  VIZ_MARKER,
} from "../src/data/rare-disease-trial-desert-map-2026-data.ts";

assert.equal(HEADLINE.eurTrialsPerMillion, 5.92);
assert.equal(HEADLINE.afrTrialsPerMillion, 0.22);
assert.ok(HEADLINE.eurOverAfrDensity >= 26);
assert.ok(REGION_ROWS.length === 6);
assert.ok(PHASE_MIX.length >= 4);
assert.ok(TREND_INDEX.length >= 5);
assert.ok(VIZ_MARKER.includes("trials per million"));

const root = process.cwd();
const slug = "rare-disease-trial-desert-map-2026";
const markers = [VIZ_MARKER, "WHO-region trial density"];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(250);
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
    await clickBtn(page, "Density");
    await clickBtn(page, "Trials / million patients");
    await clickBtn(page, "Deserts");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Mismatch");
    await clickBtn(page, "Scatter");
    await clickBtn(page, "Pipeline");
    await clickBtn(page, "Density");
    await clickBtn(page, "Trials / million pop.");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
