/**
 * QA: usace-lock-unavailability-versus-barge-tonnage-2026
 * // viz-types: stacked unavail bars, tons×hours scatter, system dual-line, commodity stacked, waterway exposure bars, exposure concentration cumulative | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  LOCK_PANEL,
  totalUnavailH,
  exposureTonHoursB,
} from "../src/data/usace-lock-unavailability-versus-barge-tonnage-2026-data.ts";

assert.equal(HEADLINE.melvinPriceTonsM, 45.86);
assert.equal(HEADLINE.topUnavailHours, 2680);
assert.equal(HEADLINE.asceEvents2020, 9147);
assert.ok(LOCK_PANEL.length >= 14);
const lock27 = LOCK_PANEL.find((r) => r.id === "lock27");
assert.ok(lock27 && totalUnavailH(lock27) === 2680);
assert.ok(Math.abs(exposureTonHoursB(lock27) - 164.6) < 0.2);
const melvin = LOCK_PANEL.find((r) => r.id === "melvin-price");
assert.ok(melvin && melvin.tonsM === 45.86 && melvin.confidence === "district");

const root = process.cwd();
const slug = "usace-lock-unavailability-versus-barge-tonnage-2026";
const markers = [
  "USACE LPMS · lock hours vs barge tons",
  "Unavailability hours vs tons",
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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Unavail stack");
    await clickBtn(page, "Ohio");
    await clickBtn(page, "Tons × hours");
    await clickBtn(page, "All rivers");
    await clickBtn(page, "System path");
    await clickBtn(page, "Commodity mix");
    await clickBtn(page, "Waterway exposure");
    await clickBtn(page, "Exposure stack");
    await clickBtn(page, "Unavail stack");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 16,
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
