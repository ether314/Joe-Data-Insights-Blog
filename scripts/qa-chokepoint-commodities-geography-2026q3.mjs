/**
 * QA: chokepoint-commodities-geography-2026q3
 * // viz-types: regional stacked mix, vintage delta bars, mine→mid area+scatter, radar seats, hub stacks | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  MINE_GEOGRAPHIES,
  MIDSTREAM_GEOGRAPHIES,
  STAGE_FLIPS,
  VINTAGE_DELTAS,
} from "../src/data/chokepoint-commodities-geography-2026q3-data.ts";

assert.equal(HEADLINE.commoditiesMapped, 16);
assert.equal(HEADLINE.chinaTotalTop1Count, 11);
assert.equal(HEADLINE.chinaMidstreamTop1Count, 8);
assert.equal(HEADLINE.eastAsiaMidstreamTop1Count, 8);
assert.equal(HEADLINE.copperRefineTop1Pct, 50);
assert.equal(HEADLINE.copperRefineDeltaPp, 6);
assert.equal(HEADLINE.lithiumChemTop1Pct, 70);
assert.equal(HEADLINE.reeSeparateTop1Pct, 85);
assert.equal(HEADLINE.largestCrossBorderFlipPp, 74);
assert.equal(MINE_GEOGRAPHIES.length, 8);
assert.equal(MIDSTREAM_GEOGRAPHIES.length, 8);
assert.equal(STAGE_FLIPS[0].id, "cobalt");
assert.equal(STAGE_FLIPS[0].crossBorder, true);
assert.ok(VINTAGE_DELTAS.some((d) => d.id === "copper-refine" && d.deltaPp === 6));

const root = process.cwd();
const slug = "chokepoint-commodities-geography-2026q3";
const markers = [
  "Chokepoint commodities — Q3 2026 geography lens",
  "Regional production mix by commodity",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.getByRole("button", { name, exact: true }).first().click({ timeout: 8000 });
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
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}.html`,
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}`,
    ];
    let loaded = false;
    for (const url of candidates) {
      const res = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      if (res && res.ok()) {
        loaded = true;
        break;
      }
    }
    if (!loaded) {
      console.error("✗ Failed to load post HTML");
      process.exit(1);
    }
    await page.waitForSelector(
      '[data-viz="chokepoint-commodities-geography-2026q3"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Mine");
    await clickBtn(page, "Plant");
    await clickBtn(page, "All stages");
    await clickBtn(page, "Prior → Q3 Δ");
    await clickBtn(page, "Batteries");
    await clickBtn(page, "Structural");
    await clickBtn(page, "All");
    await clickBtn(page, "Mine × mid flips");
    await clickBtn(page, "Seat radar");
    await clickBtn(page, "Regional hubs");
    await clickBtn(page, "Country hub stack");
    await clickBtn(page, "Regional Top-1 seats");
    await clickBtn(page, "Regional mix");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-chokepoint-commodities-geography-2026q3: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
