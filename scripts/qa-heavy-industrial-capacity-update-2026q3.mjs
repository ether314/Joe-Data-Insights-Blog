/**
 * QA: heavy-industrial-capacity-update-2026q3
 * // viz-types: diverging Δ bars, ship completions-vs-orders grouped, steel H1 dual, aircraft monthly composed, capacity radar, dock+forge strip | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import {
  FORGE_SHOPS,
  HEADLINE,
  STEEL_H1_LEADERS,
  VINTAGE_DELTAS,
} from "../src/data/heavy-industrial-capacity-update-2026q3-data.ts";

assert.equal(HEADLINE.chinaSteelH1SharePct, 53.7);
assert.equal(HEADLINE.chinaSteelH1ShareDeltaPp, -1.3);
assert.equal(HEADLINE.chinaOrdersGtPct, 66.0);
assert.equal(HEADLINE.airbusDuoYtdJulPct, 53.2);
assert.equal(HEADLINE.ultraHeavyForgeShops, 6);
assert.ok(FORGE_SHOPS.length === 6);
assert.ok(STEEL_H1_LEADERS.length >= 5);
assert.ok(
  VINTAGE_DELTAS.some((d) => d.id === "china-steel-h1" && d.deltaPp === -1.3),
);

const root = process.cwd();
const slug = "heavy-industrial-capacity-update-2026q3";
const markers = [
  "China H1 steel share 53.7%",
  "Aug update → Q3 official print",
];

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
      "Vintage Δ",
      "Yard flow",
      "Steel H1",
      "Aircraft YTD",
      "Capacity radar",
      "Docks & forges",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Vintage Δ" }).first().click();
    for (const f of ["Moved only", "Held / flat", "All metrics"]) {
      const btn = page.getByRole("button", { name: f });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(250);
      }
    }
    await page.getByRole("button", { name: "Yard flow" }).first().click();
    for (const f of [
      "Completions only",
      "Orders only",
      "Order gap (pp)",
      "Completions vs orders",
    ]) {
      const btn = page.getByRole("button", { name: f });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(250);
      }
    }
    await page.getByRole("button", { name: "Steel H1" }).first().click();
    for (const f of ["YoY % change", "Million tonnes", "Region YoY", "World share %"]) {
      const btn = page.getByRole("button", { name: f });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(250);
      }
    }
    console.log("✓ controls exercised");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
