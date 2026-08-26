/**
 * QA: state-prison-population-versus-violent-crime-rates-2026
 * // viz-types: composed dual line, horizontal bar, scatter, grouped bar | layout: default
 * // smoke-marker: Prisoners per 100k vs violent rate
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  HEADLINE,
  NATIONAL_SERIES,
  PATH_COUNTS,
  REGION_AGGS,
  STATE_PANEL,
} from "../src/data/state-prison-population-versus-violent-crime-rates-2026-data.ts";

assert.equal(HEADLINE.nationalPrison2010, 500);
assert.equal(HEADLINE.nationalPrison2022, 355);
assert.equal(HEADLINE.statesPrisonDownCrimeUp, 19);
assert.equal(HEADLINE.statesBothDown, 19);
assert.equal(HEADLINE.panelStates, 50);
assert.ok(STATE_PANEL.length === 50);
assert.ok(NATIONAL_SERIES.length >= 12);
assert.ok(PATH_COUNTS.length >= 5);
assert.ok(REGION_AGGS.length === 4);
assert.equal(ANALYTICS.smokeMarker, "Prisoners per 100k vs violent rate");

const root = process.cwd();
const slug = "state-prison-population-versus-violent-crime-rates-2026";
const markers = [
  "Prisoners per 100k vs violent rate",
];

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
  const port = Number(process.env.SMOKE_PORT || 4188);
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
    await clickBtn(page, "Path buckets");
    await clickBtn(page, "Δ scatter");
    await clickBtn(page, "Region means");
    await clickBtn(page, "West");
    await clickBtn(page, "Prison↓ / crime↑");
    await clickBtn(page, "Decouple only");
    await clickBtn(page, "2022 levels");
    await clickBtn(page, "Custody intensity");
    await clickBtn(page, "Decouple leaders");
    await clickBtn(page, "National dual path");
    await clickBtn(page, "All regions");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues?.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    console.log("✓ viz interaction audit");
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
