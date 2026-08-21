/**
 * QA: industrial-robotics-concentration-2026
 * // viz-types: Lorenz area+line, ranked share bars, region donut, supplier stacked area, industry bars, share×growth scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  MARKET_SHARES,
  TOP_K_LADDER,
} from "../src/data/industrial-robotics-concentration-2026-data.ts";

assert.equal(HEADLINE.top1SharePct, 54);
assert.equal(HEADLINE.top3SharePct, 69);
assert.equal(HEADLINE.top5SharePct, 80);
assert.equal(HEADLINE.chinaDomesticSupplierPct, 57);
assert.equal(HEADLINE.asiaShare2024Pct, 74);
assert.equal(TOP_K_LADDER[0].sharePct, 54);
assert.equal(MARKET_SHARES[0].market, "China");
assert.ok(MARKET_SHARES[0].sharePct > 50);

const root = process.cwd();
const slug = "industrial-robotics-concentration-2026";
const markers = [
  "Industrial robotics — concentration lens",
  "Cumulative share vs equal split",
  "Ranked market shares",
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
      '[data-viz="industrial-robotics-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Units");
    await clickBtn(page, "Cumulative %");
    await clickBtn(page, "Regions");
    await clickBtn(page, "China suppliers");
    await page
      .getByText("China domestic vs foreign supplier share", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ China domestic vs foreign supplier share");
    await clickBtn(page, "Industry mix");
    await clickBtn(page, "China of global");
    await clickBtn(page, "Concentration ladder");
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
