/**
 * QA: ai-supply-chain-geography-2026
 * // viz-types: equip bars+pie, stacked area path, stack-geo ladder bars, share×risk scatter, stage flip bars, risk-seat bars, meter compare | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  EQUIPMENT_REGIONS,
  HEADLINE,
  STACK_GEO_LAYERS,
} from "../src/data/ai-supply-chain-geography-2026-data.ts";

assert.equal(HEADLINE.equipTop1Pct, 36.5);
assert.equal(HEADLINE.equipTop1Label, "China");
assert.equal(HEADLINE.equipTop3Pct, 78.9);
assert.equal(HEADLINE.taiwanFoundryLePct, 90);
assert.equal(HEADLINE.taiwanCowosPct, 78);
assert.equal(HEADLINE.koreaHbmPct, 53);
assert.equal(HEADLINE.usGpuHqPct, 88);
assert.ok(EQUIPMENT_REGIONS.length >= 6);
assert.equal(EQUIPMENT_REGIONS[0].region, "China");
assert.ok(STACK_GEO_LAYERS.length >= 7);
const equipSum = EQUIPMENT_REGIONS.reduce((s, r) => s + r.sharePct, 0);
assert.ok(Math.abs(equipSum - 100) < 0.15);

const root = process.cwd();
const slug = "ai-supply-chain-geography-2026";
const markers = [
  "AI semiconductor supply chain — geography lens",
  "Where tool dollars, wafer seats, and design HQs land on the map",
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
    await page.waitForSelector(
      '[data-viz="ai-supply-chain-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Equipment");
    await clickBtn(page, "Billings $B");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Stack geo");
    await clickBtn(page, "Midstream");
    await clickBtn(page, "Top-1 ≥70%");
    await clickBtn(page, "All layers");
    await clickBtn(page, "All");
    await clickBtn(page, "Stages");
    await clickBtn(page, "Meters");
    await clickBtn(page, "Equipment");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
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
