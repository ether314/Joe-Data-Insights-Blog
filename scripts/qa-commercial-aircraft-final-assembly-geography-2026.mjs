/**
 * QA: commercial-aircraft-final-assembly-geography-2026
 * // viz-types: site-share bars, concentration Lorenz area+line, region donut, throughput scatter, dual-frame bars, rate area | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  LARGE_JET_DELIVERIES,
  LARGE_JET_SITES,
  SITE_HHI,
} from "../src/data/commercial-aircraft-final-assembly-geography-2026-data.ts";

assert.equal(LARGE_JET_DELIVERIES, 1408);
assert.equal(HEADLINE.topSiteSharePct, 31.7);
assert.equal(HEADLINE.top3SharePct, 66);
assert.equal(HEADLINE.usSiteSharePct, 54.5);
assert.equal(HEADLINE.nonDuopolySharePct, 1.1);
assert.equal(HEADLINE.siteCount, 8);
assert.equal(LARGE_JET_SITES[0].short, "Renton");
assert.equal(LARGE_JET_SITES[0].deliveries2025, 447);
assert.ok(SITE_HHI > 1500 && SITE_HHI < 2500);

const root = process.cwd();
const slug = "commercial-aircraft-final-assembly-geography-2026";
const markers = [
  "Assembly-line share by final-assembly site",
  "2025 deliveries by final-assembly site",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.getByRole("button", { name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(200);
}

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
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(
      '[data-viz="commercial-aircraft-final-assembly-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Concentration");
    await page
      .getByText("Cumulative share vs equal split", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Cumulative share vs equal split");
    await clickBtn(page, "Geography");
    await clickBtn(page, "Throughput");
    await clickBtn(page, "Site share");
    await clickBtn(page, "Aircraft");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Airbus");
    await clickBtn(page, "All");
    await clickBtn(page, "Narrowbody");
    await clickBtn(page, "Large jets");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-commercial-aircraft-final-assembly-geography-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
