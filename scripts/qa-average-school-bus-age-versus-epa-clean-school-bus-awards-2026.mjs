/**
 * QA: average-school-bus-age-versus-epa-clean-school-bus-awards-2026
 * // smoke-marker: Mean age vs CSB units dual axis
 * // viz-types: dual-axis age vs CSB composed, counterfactual area,
 * // state award horizontal bars, fuel-mix pie, award-round bars,
 * // age-band diesel-tail bars
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AGE_BANDS,
  AGE_VS_AWARDS,
  AWARD_ROUND_INCREMENTS,
  FLEET_YELLOW_BUSES,
  FUEL_MIX_BASELINE,
  HEADLINE,
  STATE_AWARDS,
  VIZ_MARKERS,
  buildCounterfactual,
  fleetSharePct,
} from "../src/data/average-school-bus-age-versus-epa-clean-school-bus-awards-2026-data.ts";

assert.equal(HEADLINE.meanAge2026, 8.3);
assert.equal(HEADLINE.meanAgePeak, 9.3);
assert.equal(HEADLINE.csbBusesAwarded, 8500);
assert.equal(HEADLINE.fleetYellowBuses, FLEET_YELLOW_BUSES);
assert.ok(AGE_VS_AWARDS.length >= 6);
assert.equal(AGE_VS_AWARDS[AGE_VS_AWARDS.length - 1].meanAgeYrs, 8.3);
assert.ok(AWARD_ROUND_INCREMENTS.length >= 3);
assert.ok(STATE_AWARDS.length >= 10);
assert.ok(AGE_BANDS.length >= 4);
assert.ok(FUEL_MIX_BASELINE.some((f) => f.id === "diesel" && f.sharePct >= 85));
assert.ok(fleetSharePct(8500) < 2.5);
assert.ok(buildCounterfactual().length === AGE_VS_AWARDS.length);
assert.ok(VIZ_MARKERS.includes("Mean age vs CSB units dual axis"));

const root = process.cwd();
const slug = "average-school-bus-age-versus-epa-clean-school-bus-awards-2026";
const markers = [...VIZ_MARKERS];

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
  const port = Number(process.env.SMOKE_PORT || 4180);
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

    await clickBtn(page, "CSB drag");
    await page
      .getByText("Observed mean age vs desk", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "State concentration");
    await page
      .getByText("State award concentration", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Northeast");
    await clickBtn(page, "≥500 buses");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Fuel mix");
    await page
      .getByText("National fuel mix", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Award rounds");
    await page
      .getByText("EPA CSB award rounds", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Age bands");
    await page
      .getByText("Illustrative age-band shares", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Age vs awards");
    console.log("✓ view + region + min-award controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
