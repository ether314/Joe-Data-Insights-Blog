/**
 * QA: us-cattle-herd-at-seventy-year-lows-2026
 * // viz-types: herd×price composed, drought area+bars, rebuild signal bars, inventory×retail scatter, class ladder, price ladder multi-line | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  HERD_PATH,
  HERD_VS_PRICE,
  REBUILD_SIGNALS,
} from "../src/data/us-cattle-herd-at-seventy-year-lows-2026-data.ts";

assert.equal(HEADLINE.allCattle2026M, 86.2);
assert.equal(HEADLINE.beefCows2026M, 27.6);
assert.equal(HEADLINE.lowestSinceYear, 1951);
assert.equal(HEADLINE.beefReplacementHeifersYoYPct, 1.0);
assert.ok(HERD_PATH.length >= 20);
assert.ok(HERD_VS_PRICE.length >= 10);
assert.ok(REBUILD_SIGNALS.length >= 4);
const y2026 = HERD_PATH.find((r) => r.year === 2026);
assert.ok(y2026 && y2026.allCattleM === 86.2);

const root = process.cwd();
const slug = "us-cattle-herd-at-seventy-year-lows-2026";
const markers = [
  "Food & agriculture · cattle–beef squeeze",
  "Herd size vs beef price",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Beef cows");
    await clickBtn(page, "Retail");
    await clickBtn(page, "Drought");
    await clickBtn(page, "Rebuild signals");
    await clickBtn(page, "Price ladder");
    await clickBtn(page, "All cattle");
    await clickBtn(page, "Herd vs price");
    await clickBtn(page, "Cutout");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 14,
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
