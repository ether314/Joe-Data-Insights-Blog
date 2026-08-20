/**
 * QA: heavy-industrial-capacity-research-2026
 * // viz-types: sector share bars, build-vs-own scatter, ship milestone area, yard lollipop, FAL treemap, forge strip | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import {
  FAL_SITES,
  FORGE_SHOPS,
  HEADLINE,
  SECTOR_SHARES,
  YARD_NODES,
  sharesForSector,
} from "../src/data/heavy-industrial-capacity-research-2026-data.ts";

assert.equal(HEADLINE.chinaShipGtShare2024Pct, 54.6);
assert.equal(HEADLINE.asiaShipTrioShare2024Pct, 95.2);
assert.equal(HEADLINE.rentonLargeJetShare2025Pct, 31.7);
assert.equal(HEADLINE.ultraHeavyForgeShops, 6);
assert.ok(FORGE_SHOPS.length === 6);
assert.ok(YARD_NODES.length >= 8);
assert.ok(FAL_SITES[0].short === "Renton");
assert.ok(sharesForSector("shipbuilding")[0].region === "china");
assert.ok(SECTOR_SHARES.length >= 20);

const root = process.cwd();
const slug = "heavy-industrial-capacity-research-2026";
const markers = [
  "Yards, dry docks, and the forge base that still builds capital stock",
  "Who holds the builder base — by sector",
];

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
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    for (const label of [
      "Sector shares",
      "Build vs own",
      "Yard / dock map",
      "Aircraft FALs",
      "Heavy forges",
      "Ship share path",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Sector shares" }).first().click();
    for (const sector of ["Aircraft FALs", "Dry docks", "Heavy forges", "Crude steel", "Shipyards"]) {
      const btn = page.getByRole("button", { name: sector });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(250);
      }
    }
    await page.getByRole("button", { name: "Build vs own" }).first().click();
    for (const f of ["Shipping", "Aviation", "Steel", "All"]) {
      const btn = page.getByRole("button", { name: f });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(250);
      }
    }
    console.log("✓ sector + tab controls");
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
