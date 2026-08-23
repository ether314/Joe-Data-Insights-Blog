/**
 * QA: us-traffic-deaths-per-vmt-vs-peer-countries-2026
 * // viz-types: peer ladder bars, US path+bands composed, spike bars, 2019 scatter, region pie, dual-lens bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import {
  HEADLINE,
  IRTAD_PER_BILLION_VKM,
  US_VMT_SERIES,
} from "../src/data/us-traffic-deaths-per-vmt-vs-peer-countries-2026-data.ts";

assert.equal(HEADLINE.usRate2024, 1.19);
assert.equal(HEADLINE.usPeak2021, 1.38);
assert.equal(HEADLINE.usRate2019, 1.11);
assert.equal(HEADLINE.usVsNorwayMultiple2021, 4.7);
assert.equal(HEADLINE.us2024Vs2019Pct, 7.2);
assert.equal(HEADLINE.spikeUnwindSharePct, 70);
assert.equal(US_VMT_SERIES.at(-1)?.year, 2024);
assert.equal(US_VMT_SERIES.at(-1)?.ratePer100mVmt, 1.19);
assert.ok(IRTAD_PER_BILLION_VKM.length >= 10);

const root = process.cwd();
const slug = "us-traffic-deaths-per-vmt-vs-peer-countries-2026";
const markers = [
  "US traffic deaths per VMT vs peer countries — road-safety lens",
  "IRTAD 2021 distance-risk ladder",
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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "US path");
    await clickBtn(page, "Per billion vkm");
    await clickBtn(page, "Per 100M VMT");
    await clickBtn(page, "Spike unwind");
    await clickBtn(page, "VMT vs pop");
    await clickBtn(page, "Peer ladder");
    await clickBtn(page, "US + peers");
    await clickBtn(page, "Full IRTAD set");
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
