/**
 * QA: corn-and-soybean-export-chokepoints-2026
 * // viz-types: origin bars+dest pie, cumulative area, port bars, balance stacks, share-path multi-line, port×origin scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CORN_ORIGINS,
  HEADLINE,
  PORT_CHOKEPOINTS,
  SOY_ORIGINS,
} from "../src/data/corn-and-soybean-export-chokepoints-2026-data.ts";

assert.equal(HEADLINE.brazilSoyExportsMt, 118.0);
assert.equal(HEADLINE.usCornExportsMt, 81.3);
assert.ok(Math.abs(HEADLINE.soyTop2SharePct - 85.7) < 0.2);
assert.ok(Math.abs(HEADLINE.cornTop3SharePct - 77.8) < 0.2);
assert.ok(CORN_ORIGINS.length >= 5);
assert.ok(SOY_ORIGINS.length >= 5);
assert.ok(PORT_CHOKEPOINTS.length >= 5);
assert.ok(
  Math.abs(CORN_ORIGINS.reduce((s, o) => s + o.sharePct, 0) - 100) < 1.5,
);
assert.ok(
  Math.abs(SOY_ORIGINS.reduce((s, o) => s + o.sharePct, 0) - 100) < 1.5,
);

const root = process.cwd();
const slug = "corn-and-soybean-export-chokepoints-2026";
const markers = [
  "Staple crop markets · corn & soybean export chokepoints",
  "Top-origin share",
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
    await clickBtn(page, "Origins");
    await clickBtn(page, "Soybeans");
    await clickBtn(page, "Corn");
    await clickBtn(page, "Ports");
    await clickBtn(page, "Exportable supply");
    await clickBtn(page, "Share path");
    await clickBtn(page, "Soybeans");
    await clickBtn(page, "Origins");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 12,
    });
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
