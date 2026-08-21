/**
 * QA: geopolitics-institutions-geography-2026
 * // viz-types: regional pie, country share bars, vote↔GDP dumbbell, vote×GDP scatter, P5 seats, veto practice, meter compare | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTRY_GEO,
  HEADLINE,
  REGION_SHARES,
  UNSC_SEAT_GEO,
  VETO_PRACTICE,
} from "../src/data/geopolitics-institutions-geography-2026-data.ts";

assert.equal(HEADLINE.asiaPacImfVotePct, 18.9);
assert.equal(HEADLINE.asiaPacGdpPppPct, 35.8);
assert.equal(HEADLINE.asiaPacGapPp, -16.9);
assert.equal(HEADLINE.europeImfVotePct, 22.6);
assert.equal(HEADLINE.europeGapPp, 9.2);
assert.equal(HEADLINE.europeP5Seats, 3);
assert.equal(REGION_SHARES.length, 5);
assert.equal(COUNTRY_GEO.length, 10);
assert.equal(UNSC_SEAT_GEO[0].permanentSeats, 3);
assert.ok(VETO_PRACTICE[0].vetoes2018_2024 >= 15);

const root = process.cwd();
const slug = "geopolitics-institutions-geography-2026";
const markers = [
  "Institutions & governance — geography lens",
  "Regional pie",
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
      '[data-viz="geopolitics-institutions-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "IBRD votes");
    await clickBtn(page, "PPP GDP");
    await clickBtn(page, "IMF votes");
    await clickBtn(page, "Vote↔GDP gaps");
    await clickBtn(page, "Europe");
    await clickBtn(page, "Asia-Pacific");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Country scatter");
    await clickBtn(page, "Council & HQs");
    await clickBtn(page, "Regional shares");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-geopolitics-institutions-geography-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
