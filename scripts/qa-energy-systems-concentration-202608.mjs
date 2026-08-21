/**
 * QA: energy-systems-concentration-202608
 * // viz-types: vintage delta bars, Top-k ladder bars, Lorenz area+line (stock+growth), demand path line, coal/solar add pies+bars, mix path multi-line, fuel export stacks, import×wholesale scatter, clean-inv pie, vintage multi-line, lens avg bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COAL_ADD_SHARES,
  CONCENTRATION_ROWS,
  FUEL_EXPORT_STACK,
  HEADLINE,
  VINTAGE_DELTAS,
  VINTAGE_SLOPE,
} from "../src/data/energy-systems-concentration-202608-data.ts";

assert.equal(HEADLINE.elecTop1Pct, 33.2);
assert.equal(HEADLINE.elecTop3Pct, 56.5);
assert.equal(HEADLINE.lngTop1Pct, 24);
assert.equal(HEADLINE.coalAddTop1Pct, 48);
assert.equal(HEADLINE.growthTop1Pct, 42);
assert.equal(HEADLINE.solarAddTop1Pct, 50);
assert.equal(HEADLINE.demandGrowth2026Pct, 3.6);
assert.ok(CONCENTRATION_ROWS.length >= 16);
assert.equal(FUEL_EXPORT_STACK[0].fuel, "Coal");
assert.equal(COAL_ADD_SHARES[0].sharePct, 48);
assert.ok(VINTAGE_SLOPE.length >= 4);
assert.ok(VINTAGE_DELTAS.some((d) => d.id === "elecTop1" && d.delta === 0));
assert.ok(VINTAGE_DELTAS.some((d) => d.id === "coalAdd" && d.direction === "up"));

const root = process.cwd();
const slug = "energy-systems-concentration-202608";
const markers = [
  "Energy systems — late-Aug 202608 concentration lens",
  "Top-1 still 33.2%",
  "Vintage delta — Q3 → Aug",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(150);
}

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
  page.setDefaultTimeout(15000);
  try {
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}.html`,
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
      '[data-viz="energy-systems-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Top-3");
    await clickBtn(page, "HHI");
    await clickBtn(page, "Δ vs Q3");
    await clickBtn(page, "Path");
    await clickBtn(page, "Stock vs growth");
    await clickBtn(page, "Growth add");
    await clickBtn(page, "Aug path meters");
    await clickBtn(page, "Coal rebound");
    await clickBtn(page, "Solar add");
    await clickBtn(page, "Trade & shock");
    await clickBtn(page, "Capex & vintage");
    await clickBtn(page, "Scoreboard");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-energy-systems-concentration-202608: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
