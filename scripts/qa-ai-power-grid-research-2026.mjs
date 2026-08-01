/**
 * QA: ai-power-grid-research-2026
 * // viz-types: composed area+multi-line scenarios, ranked horizontal bars, donut pie, waterfall growth drivers, queue bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  REGION_DEMAND,
  SCENARIO_PATH,
  SUPPLY_MIX_2024,
} from "../src/data/ai-power-grid-research-2026-data.ts";

assert.equal(HEADLINE.dcTwh2024, 415);
assert.equal(HEADLINE.dcTwh2030Base, 945);
assert.equal(HEADLINE.dcTwh2035LiftOff, 1700);
assert.equal(HEADLINE.projectsAtDelayRiskPct, 20);
assert.equal(HEADLINE.queueGenGw2025, 1312);
assert.ok(SCENARIO_PATH.some((p) => p.year === 2030 && p.base === 945));
assert.equal(
  REGION_DEMAND.find((r) => r.short === "United States")?.deltaTwh,
  240,
);
assert.ok(SUPPLY_MIX_2024[0].sharePct >= SUPPLY_MIX_2024[1].sharePct);

const root = process.cwd();
const slug = "ai-power-grid-research-2026";
const markers = [
  "AI power & grid — IEA global frame",
  "Global data-centre electricity — scenario band",
  "What drives the Base Case increase",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4181);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await page.getByRole("button", { name: "Regions" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "2030 level" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "Supply mix" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "Incremental to 2030" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "Grid bottlenecks" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "Scenario path" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Lift-Off" }).click();
    await page.waitForTimeout(200);
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-ai-power-grid-research-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
