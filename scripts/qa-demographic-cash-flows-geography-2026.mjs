/**
 * QA: demographic-cash-flows-geography-2026
 * // viz-types: recipient region bars+pie, host origin bars, corridor bloc ladder, dependence×age scatter, host pension scatter, meter compare | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  CORRIDOR_BLOCS,
  HEADLINE,
  HOST_BLOCS,
  REGION_RECIPIENTS,
} from "../src/data/demographic-cash-flows-geography-2026-data.ts";

assert.equal(HEADLINE.top1RegionSharePct, 26);
assert.equal(HEADLINE.top1RegionLabel, "South Asia");
assert.equal(HEADLINE.usHostSharePct, 31);
assert.equal(HEADLINE.top1CorridorBlocSharePct, 12);
assert.equal(HEADLINE.top1DependenceGdpPct, 45);
assert.equal(HEADLINE.lmicUniverseBn, 685);
assert.ok(REGION_RECIPIENTS.length >= 6);
assert.equal(REGION_RECIPIENTS[0].region, "South Asia");
assert.equal(HOST_BLOCS[0].bloc, "United States");
assert.equal(CORRIDOR_BLOCS[0].id, "us-latam");
const regionSum = REGION_RECIPIENTS.reduce((s, r) => s + r.amountBn, 0);
assert.equal(regionSum, 685);

const root = process.cwd();
const slug = "demographic-cash-flows-geography-2026";
const markers = [
  "Demographic cash flows — geography lens",
  "Where remittance dollars and age risk sit on the map",
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
  const port = Number(process.env.SMOKE_PORT || 4184);
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
      '[data-viz="demographic-cash-flows-geography-2026"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Destinations");
    await clickBtn(page, "Dollars");
    await clickBtn(page, "Share %");
    await clickBtn(page, "Hosts");
    await clickBtn(page, "Hosts only");
    await clickBtn(page, "Corridors");
    await clickBtn(page, "Age & risk");
    await clickBtn(page, "LatAm");
    await clickBtn(page, "All");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-demographic-cash-flows-geography-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
