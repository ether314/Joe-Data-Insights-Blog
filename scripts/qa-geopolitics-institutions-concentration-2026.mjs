/**
 * QA: geopolitics-institutions-concentration-2026
 * // viz-types: Lorenz area+line, ranked share bars, institution compare bars, region donut, veto stacked area, vote×GDP scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  TOP_K_LADDER,
  VOTE_SHARES,
} from "../src/data/geopolitics-institutions-concentration-2026-data.ts";

assert.equal(HEADLINE.imfTop1SharePct, 16.5);
assert.equal(HEADLINE.imfTop3SharePct, 28.7);
assert.equal(HEADLINE.imfTop5SharePct, 40.0);
assert.equal(HEADLINE.unscVetoTop5SharePct, 100);
assert.equal(HEADLINE.usAloneBlocksSpecialMajority, true);
assert.equal(TOP_K_LADDER[0].imfSharePct, 16.5);
assert.equal(VOTE_SHARES[0].name, "United States");
assert.ok(VOTE_SHARES[0].imfVotePct > 15);

const root = process.cwd();
const slug = "geopolitics-institutions-concentration-2026";
const markers = [
  "Institutions & governance — concentration lens",
  "Cumulative share vs equal split",
  "Ranked vote shares",
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
      '[data-viz="geopolitics-institutions-concentration-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "IBRD vote %");
    await clickBtn(page, "Institutions");
    await clickBtn(page, "Top-1");
    await clickBtn(page, "Regions & gaps");
    await clickBtn(page, "Asia-Pac");
    await clickBtn(page, "UNSC vetoes");
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
