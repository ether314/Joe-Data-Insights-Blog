/**
 * QA: bead-allocations-versus-fcc-unserved-locations-2026
 * // viz-types: horizontal rank bars, unserved×BEAD scatter, stacked baseline split,
 * // regional grouped bars, distribution histogram | layout: default
 * // smoke-marker: BEAD dollars per unserved location by state
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  JURISDICTIONS,
  REGION_AVG,
  VIZ_MARKERS,
} from "../src/data/bead-allocations-versus-fcc-unserved-locations-2026-data.ts";

assert.equal(HEADLINE.peakDpuState, "DC");
assert.ok(HEADLINE.peakDpu > 500000);
assert.equal(HEADLINE.texasDpu, 4263);
assert.ok(JURISDICTIONS.length >= 50);
assert.ok(REGION_AVG.length >= 4);
assert.ok(VIZ_MARKERS[0].includes("BEAD dollars per unserved"));

const root = process.cwd();
const slug = "bead-allocations-versus-fcc-unserved-locations-2026";
const markers = ["BEAD dollars per unserved location by state"];

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
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "$/unserved rank");
    await clickBtn(page, "Unserved × BEAD $");
    await clickBtn(page, "Baseline split");
    await clickBtn(page, "Regional avg");
    await clickBtn(page, "$/unserved bins");
    await clickBtn(page, "Sort high→low");
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed", err);
  process.exit(1);
});
