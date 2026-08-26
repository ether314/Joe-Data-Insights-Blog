/**
 * QA: epa-lead-service-line-unknown-share-by-state-2026
 * // viz-types: unknown-share bars, material stacked bars, unknown×lead scatter, vintage dual-line, region rollup bars, unknown concentration cumulative | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  STATE_INVENTORY,
  unknownSharePct,
} from "../src/data/epa-lead-service-line-unknown-share-by-state-2026-data.ts";

assert.equal(HEADLINE.unknownLinesM, 23.5);
assert.equal(HEADLINE.unknownSharePct, 23.7);
assert.equal(HEADLINE.projectedLeadGrrM, 4.0);
assert.equal(HEADLINE.paUnknownM, 2.34);
assert.ok(STATE_INVENTORY.length >= 30);
const pa = STATE_INVENTORY.find((s) => s.abbr === "PA");
assert.ok(pa && pa.unknownK === 2343);
assert.ok(unknownSharePct(pa) > 50);
const il = STATE_INVENTORY.find((s) => s.abbr === "IL");
assert.ok(il && il.projectedLeadGrrK === 632);
const ca = STATE_INVENTORY.find((s) => s.abbr === "CA");
assert.ok(ca && ca.leadK === 0 && ca.unknownK === 588);

const root = process.cwd();
const slug = "epa-lead-service-line-unknown-share-by-state-2026";
const markers = [
  "EPA LCRR inventories · unknown-material share",
  "Unknown-material share",
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
    await clickBtn(page, "Unknown share");
    await clickBtn(page, "Midwest");
    await clickBtn(page, "Material mix");
    await clickBtn(page, "Unknown × lead");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Survey→inventory");
    await clickBtn(page, "Region rollup");
    await clickBtn(page, "Unknown stack");
    await clickBtn(page, "Unknown share");
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
