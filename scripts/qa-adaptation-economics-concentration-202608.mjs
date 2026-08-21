/**
 * QA: adaptation-economics-concentration-202608
 * // viz-types: HHI bars, scenario bars, Lorenz area+line, stacked hazard bars, MDB bars, instrument donut, vintage multi-line, insured composed, resilience×gap scatter, scarcity multiples | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  HHI_BY_LENS,
  MDB_BANK_SHARES,
  RESIDUAL_BEARERS,
  SCENARIO_SCOREBOARD,
  TOP_K_LADDER,
} from "../src/data/adaptation-economics-concentration-202608-data.ts";

assert.equal(HEADLINE.top1BearerSharePct, 38);
assert.equal(HEADLINE.top3BearerSharePct, 86);
assert.equal(HEADLINE.reboundTop1BearerSharePct, 39.5);
assert.equal(HEADLINE.top1MdbSharePct, 34);
assert.equal(HEADLINE.top3MdbSharePct, 68);
assert.equal(HEADLINE.mdbLmicAdapt2025Bn, 35);
assert.equal(HEADLINE.top3GapRegionSharePct, 52.6);
assert.equal(RESIDUAL_BEARERS[0].id, "households");
assert.equal(MDB_BANK_SHARES[0].id, "wbg");
assert.ok(HHI_BY_LENS.length >= 4);
assert.ok(TOP_K_LADDER.length >= 5);
assert.ok(SCENARIO_SCOREBOARD.length === 3);

const root = process.cwd();
const slug = "adaptation-economics-concentration-202608";
const markers = [
  "Adaptation economics — Aug 608 concentration lock",
  "Residual Top-1 / Top-3 by scenario",
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
  const port = Number(process.env.SMOKE_PORT || 4186);
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
      '[data-viz="adaptation-economics-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Rebound");
    await clickBtn(page, "Residual & hazards");
    await page
      .getByText("Cumulative share vs equal split", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Cumulative share vs equal split");
    await clickBtn(page, "Δ vs FY pp");
    await clickBtn(page, "MDB & donors");
    await clickBtn(page, "Vintage slope");
    await clickBtn(page, "Gaps & scarcity");
    await clickBtn(page, "Scenario lock");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("⚠ warnings:", audit.warnings.join("; "));
    }
    console.log(`qa-${slug}: PASS`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
