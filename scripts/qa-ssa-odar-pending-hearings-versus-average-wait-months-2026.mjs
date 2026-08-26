/**
 * QA: ssa-odar-pending-hearings-versus-average-wait-months-2026
 * // viz-types: dual-path area+line, flow composed bars+line, region horizontal bars, office scatter, program grouped bars, backlog area+bar+line | layout: default
 * // smoke-marker: Headline — pending hearings 1.12M → 262k
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  BACKLOG_SHARE,
  FLOW_BALANCE,
  HEADLINE,
  NATIONAL_PATH,
  OFFICE_SCATTER,
  PROGRAM_MIX,
  REGION_WAIT,
} from "../src/data/ssa-odar-pending-hearings-versus-average-wait-months-2026-data.ts";

assert.equal(HEADLINE.pendingFy2016, 1_121_519);
assert.equal(HEADLINE.pendingFy2024, 262_000);
assert.equal(HEADLINE.aptPeakMonths, 19.9);
assert.equal(HEADLINE.aptFy2024Months, 11.3);
assert.equal(HEADLINE.pctPendingDownFrom2016, 77);
assert.equal(HEADLINE.targetAptDays, 270);
assert.ok(NATIONAL_PATH.length >= 8);
assert.ok(FLOW_BALANCE.length >= 8);
assert.ok(REGION_WAIT.length === 10);
assert.ok(OFFICE_SCATTER.length >= 20);
assert.ok(PROGRAM_MIX.length === 4);
assert.ok(BACKLOG_SHARE.length >= 8);
assert.equal(ANALYTICS.peakAptFy, 2017);
assert.equal(ANALYTICS.troughAptFy, 2021);

const root = process.cwd();
const slug = "ssa-odar-pending-hearings-versus-average-wait-months-2026";
const markers = [
  "Headline — pending hearings 1.12M → 262k",
  "OHO pending & wait months",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Receipts vs dispositions");
    await clickBtn(page, "Atlanta");
    await clickBtn(page, "Wait months only");
    await clickBtn(page, "Include FY2024 est.");
    await clickBtn(page, "Disclosed only");
    await clickBtn(page, "Both series");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Region waits");
    await clickBtn(page, "Office cloud");
    await clickBtn(page, "Program mix");
    await clickBtn(page, "Backlog share");
    await clickBtn(page, "Pending vs wait");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
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
