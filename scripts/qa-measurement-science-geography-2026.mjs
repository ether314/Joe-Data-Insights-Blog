/**
 * QA: measurement-science-geography-2026
 * // viz-types: country bars+pie, region blocs, share path area+line, intensity×share scatter, funding-output gap bars, US state ladder, meter compare | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COUNTRY_ROWS,
  HEADLINE,
  REGION_BLOCS,
  US_STATE_ROWS,
} from "../src/data/measurement-science-geography-2026-data.ts";

assert.equal(HEADLINE.gerdTop1Pct, 29.4);
assert.equal(HEADLINE.gerdTop1Label, "China");
assert.equal(HEADLINE.gerdUsPct, 29.1);
assert.equal(HEADLINE.pubsTop1Pct, 31);
assert.equal(HEADLINE.cetAiTop1Pct, 75);
assert.equal(HEADLINE.ktiTop1Pct, 28);
assert.equal(HEADLINE.ktiTop1Label, "United States");
assert.equal(HEADLINE.eastAsiaGerdPct, 40.8);
assert.ok(COUNTRY_ROWS.length >= 8);
assert.equal(COUNTRY_ROWS[0].id, "chn");
assert.ok(REGION_BLOCS.length >= 5);
assert.equal(REGION_BLOCS[0].id, "eas");
assert.ok(US_STATE_ROWS.length >= 6);
assert.equal(US_STATE_ROWS[0].id, "ca");
const gerdSum = COUNTRY_ROWS.reduce((s, r) => s + r.gerdSharePct, 0);
assert.ok(Math.abs(gerdSum - 100) < 0.2, `GERD shares sum ${gerdSum}`);

const root = process.cwd();
const slug = "measurement-science-geography-2026";
const markers = [
  "Measurement & science — geography lens",
  "Where R&D funding, papers, and patents sit on the map",
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
      '[data-viz="measurement-science-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Countries");
    await clickBtn(page, "Publications");
    await clickBtn(page, "CET AI patents");
    await clickBtn(page, "KTI VA");
    await clickBtn(page, "GERD PPP");
    await clickBtn(page, "Regions");
    await clickBtn(page, "Share of US %");
    await clickBtn(page, "Dollars ($B)");
    await clickBtn(page, "Intensity %");
    await clickBtn(page, "Share paths");
    await clickBtn(page, "China vs US pubs");
    await clickBtn(page, "East Asia vs N. America");
    await clickBtn(page, "East Asia");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Pubs share");
    await clickBtn(page, "Funding vs output");
    await clickBtn(page, "Countries");
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
