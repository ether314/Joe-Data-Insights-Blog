/**
 * QA: single-owner-subsea-cable-risk-2026
 * // viz-types: stacked vintage bars, route 100% bars, owner sole/part bars, capex-vs-km scatter, demand area, fiber economy | layout: default
 * // smoke-marker: Single-owner subsea cable risk — ownership of new km
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import {
  HEADLINE,
  SYSTEMS_TABLE,
  VINTAGE_NEW_KM,
} from "../src/data/single-owner-subsea-cable-risk-2026-data.ts";

assert.equal(HEADLINE.soleOwnerNewKmSharePct, 31);
assert.equal(HEADLINE.privateCpCapexSharePct, 27);
assert.equal(HEADLINE.hybridCpCapexSharePct, 26);
assert.equal(HEADLINE.consortiumNewKmSharePct, 42);
assert.equal(HEADLINE.cpBandwidthDemandSharePct, 74);
assert.equal(HEADLINE.soleOwnerShare2015_18Pct, 4);
assert.ok(VINTAGE_NEW_KM.length >= 4);
assert.ok(SYSTEMS_TABLE.length >= 8);

const root = process.cwd();
const slug = "single-owner-subsea-cable-risk-2026";
const markers = [
  "Single-owner subsea cable risk — ownership of new km",
  "Ownership mix of new cable-km by vintage",
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
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "By route");
    await clickBtn(page, "T-Pacific");
    await clickBtn(page, "All routes");
    await clickBtn(page, "Owner ladder");
    await clickBtn(page, "Capex vs km");
    await clickBtn(page, "Vintage mix");
    await clickBtn(page, "Thousand km");
    await clickBtn(page, "% of new km");
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
