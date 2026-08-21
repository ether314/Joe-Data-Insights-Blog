/**
 * QA: heavy-industrial-capacity-update-2026
 * // viz-types: diverging vintage bars, ship trio area+line, steel dual bars, build-own scatter, FAL H1 bars, forge strip | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import {
  FORGE_SHOPS,
  HEADLINE,
  STEEL_LEADERS,
  VINTAGE_DELTAS,
} from "../src/data/heavy-industrial-capacity-update-2026-data.ts";

assert.equal(HEADLINE.asiaTrioPriorPct, 95.2);
assert.equal(HEADLINE.asiaTrioNewPct, 91.0);
assert.equal(HEADLINE.asiaTrioDeltaPp, -4.2);
assert.equal(HEADLINE.chinaSteelNewPct, 52.0);
assert.equal(HEADLINE.ultraHeavyForgeShops, 6);
assert.ok(FORGE_SHOPS.length === 6);
assert.ok(STEEL_LEADERS.length >= 5);
assert.ok(VINTAGE_DELTAS.some((d) => d.id === "asia-trio" && d.deltaPp === -4.2));

const root = process.cwd();
const slug = "heavy-industrial-capacity-update-2026";
const markers = [
  "Asia ship trio slips to 91%",
  "Prior research → newest official print",
];

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
      "Ship path",
      "Steel 2025",
      "Build vs own",
      "Aircraft H1",
      "Forges held",
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
    await page.getByRole("button", { name: "Steel 2025" }).first().click();
    for (const f of ["YoY % change", "Million tonnes", "World share %"]) {
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
