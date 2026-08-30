/**
 * QA: fema-major-disaster-declarations-versus-public-assistance-dollars-2026
 * // viz-types: dual-axis composed, scatter, stacked mix, jurisdiction bars, spike pie | layout: default
 * // smoke-marker: Declarations vs PA dollars by fiscal year
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANNUAL,
  HEADLINE,
  INCIDENT_MIX,
  STATE_PA_TOP,
  VIZ_MARKERS,
} from "../src/data/fema-major-disaster-declarations-versus-public-assistance-dollars-2026-data.ts";

assert.equal(HEADLINE.peakDrCount, 88);
assert.equal(HEADLINE.peakDrFy, 2024);
assert.equal(HEADLINE.peakPaB, 105.07);
assert.equal(HEADLINE.fy2017PaB, 66.24);
assert.ok(ANNUAL.length >= 11);
assert.ok(INCIDENT_MIX.length >= 20);
assert.ok(STATE_PA_TOP.length >= 8);
assert.ok(VIZ_MARKERS[0].includes("Declarations vs PA"));

const root = process.cwd();
const slug =
  "fema-major-disaster-declarations-versus-public-assistance-dollars-2026";
const markers = ["Declarations vs PA dollars by fiscal year"];

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
    await clickBtn(page, "Declarations vs $");
    await clickBtn(page, "DR × PA scatter");
    await clickBtn(page, "Incident mix");
    await clickBtn(page, "Jurisdictions");
    await clickBtn(page, "All PA $");
    await clickBtn(page, "Non-biological PA $");
    await clickBtn(page, "Spike share");
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
