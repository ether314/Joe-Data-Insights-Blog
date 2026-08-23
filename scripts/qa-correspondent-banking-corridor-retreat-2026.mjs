/**
 * QA: correspondent-banking-corridor-retreat-2026
 * // viz-types: global AC/corridor/volume composed, regional retreat bars, thin-corridor scatter, AC-bucket pie, Lorenz area+line, currency decline bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  REGION_RETREAT,
  THIN_CORRIDORS,
  CURRENCY_SPLITS,
} from "../src/data/correspondent-banking-corridor-retreat-2026-data.ts";

assert.equal(HEADLINE.acDeclineSince2011Pct, 22);
assert.equal(HEADLINE.corridorDeclineSince2011Pct, 12);
assert.equal(HEADLINE.thinCorridorTop3SharePct, 71);
assert.ok(REGION_RETREAT.length >= 6);
assert.ok(THIN_CORRIDORS.length >= 6);
assert.ok(CURRENCY_SPLITS.length >= 3);

const root = process.cwd();
const slug = "correspondent-banking-corridor-retreat-2026";
const markers = [
  "Active correspondent corridors",
  "Network timeline",
  "Regional retreat",
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
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(
      '[data-viz="correspondent-banking-corridor-retreat-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Regional retreat");
    await clickBtn(page, "Corridor decline");
    await clickBtn(page, "Thin corridors");
    await clickBtn(page, "Top-1 share");
    await page
      .getByText("Thin corridors", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ thin corridors panel");
    await clickBtn(page, "AC buckets");
    await clickBtn(page, "Volume share");
    await clickBtn(page, "Concentration curve");
    await clickBtn(page, "Currency lens");
    await clickBtn(page, "Network timeline");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
