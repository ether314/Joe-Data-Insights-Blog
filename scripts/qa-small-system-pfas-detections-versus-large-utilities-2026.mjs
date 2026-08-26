/**
 * QA: small-system-pfas-detections-versus-large-utilities-2026
 * // viz-types: bar MCL-by-size, grouped contaminant bars, composed dual treatment, scatter watershed, composed exposure, horizontal gap bars | layout: default
 * // smoke-marker: MCL-exceeding share by system size
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CONTAMINANT_BY_SIZE,
  DUAL_AXIS,
  EXPOSURE_FRAME,
  HEADLINE,
  SIZE_SCATTER,
  SIZE_TIER_MCL,
  TREATMENT_GAP,
} from "../src/data/small-system-pfas-detections-versus-large-utilities-2026-data.ts";

assert.equal(HEADLINE.largeMclSharePct, 15.3);
assert.equal(HEADLINE.smallMclSharePct, 7.3);
assert.equal(HEADLINE.mediumMclSharePct, 8.6);
assert.equal(HEADLINE.weightedNationalMclSharePct, 8.0);
assert.equal(HEADLINE.largeOverMcl, 632);
assert.ok(SIZE_TIER_MCL.length === 3);
assert.ok(CONTAMINANT_BY_SIZE.length >= 4);
assert.ok(DUAL_AXIS.length === 3);
assert.ok(SIZE_SCATTER.length === 3);
assert.ok(EXPOSURE_FRAME.length === 3);
assert.ok(TREATMENT_GAP.length === 3);

const root = process.cwd();
const slug = "small-system-pfas-detections-versus-large-utilities-2026";
const markers = ["MCL-exceeding share by system size"];

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
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "MCL by size");
    await clickBtn(page, "Small only");
    await clickBtn(page, "Medium only");
    await clickBtn(page, "Large only");
    await clickBtn(page, "All sizes");
    await clickBtn(page, "Contaminant rates");
    await clickBtn(page, "PFOS");
    await clickBtn(page, "PFOA");
    await clickBtn(page, "PFOS+PFOA+PFHxS");
    await clickBtn(page, "Detection vs treatment");
    await clickBtn(page, "Watershed scatter");
    await clickBtn(page, "People vs systems");
    await clickBtn(page, "Treatment-gap index");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
