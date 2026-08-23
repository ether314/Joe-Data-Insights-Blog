/**
 * QA: public-dc-fast-chargers-vs-ev-stock-2026
 * // viz-types: rank bars, path lines, capacity bars, home×DCFC scatter, DCFC stock areas, AFDC ports line, gap delta bars, fast-share stacked | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DCFC_STOCK_PATH,
  EVS_PER_CHARGER_PATH,
  HEADLINE,
  MARKETS_2025,
} from "../src/data/public-dc-fast-chargers-vs-ev-stock-2026-data.ts";

assert.equal(HEADLINE.usEvsPerPublicCharger2025, 33);
assert.equal(HEADLINE.usBevsPerAfdcDcfc2025, 59);
assert.equal(HEADLINE.koreaBevsPerDcfc2025, 8);
assert.ok(MARKETS_2025.length >= 12);
assert.ok(EVS_PER_CHARGER_PATH.length >= 5);
assert.ok(DCFC_STOCK_PATH.length >= 3);
assert.ok(HEADLINE.usVsKoreaBevPerDcfcMultiple > 5);

const root = process.cwd();
const slug = "public-dc-fast-chargers-vs-ev-stock-2026";
const markers = [
  "Public DC fast chargers · BEV stock coverage",
  "BEVs per US DC Fast",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Coverage rank");
    await clickBtn(page, "BEVs / DCFC");
    await clickBtn(page, "EVs / public point");
    await clickBtn(page, "kW / EV");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Americas");
    await clickBtn(page, "Gap path");
    await clickBtn(page, "Capacity");
    await clickBtn(page, "Fast mix");
    await clickBtn(page, "Coverage rank");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 14,
      maxCharts: 4,
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
