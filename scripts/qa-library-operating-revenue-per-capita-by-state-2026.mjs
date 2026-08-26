/**
 * QA: library-operating-revenue-per-capita-by-state-2026
 * // viz-types: spread composed area+line, horizontal revenue ladder, 2019×2022 scatter,
 * stacked source-mix bars, diverging delta bars, region comparison bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  NATIONAL_SPREAD,
  STATE_PANEL,
} from "../src/data/library-operating-revenue-per-capita-by-state-2026-data.ts";

assert.equal(HEADLINE.ratio2022, 6.08);
assert.equal(HEADLINE.max2022, 110.47);
assert.equal(HEADLINE.min2022, 18.16);
assert.equal(HEADLINE.range2022, 92.31);
assert.equal(HEADLINE.stateN, 51);
assert.equal(STATE_PANEL.length, 51);
assert.ok(NATIONAL_SPREAD.length >= 5);
const dc = STATE_PANEL.find((r) => r.abbr === "DC");
const ms = STATE_PANEL.find((r) => r.abbr === "MS");
assert.ok(dc && dc.total2022 === 110.47);
assert.ok(ms && ms.total2022 === 18.16);

const root = process.cwd();
const slug = "library-operating-revenue-per-capita-by-state-2026";
const markers = [
  "Revenue per capita spread",
  "IMLS PLS · Table 8 · FY 2018–2022",
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
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Gap over time");
    await clickBtn(page, "State ladder");
    await clickBtn(page, "2019 → 2022");
    await clickBtn(page, "Revenue mix");
    await clickBtn(page, "Dollar deltas");
    await clickBtn(page, "Regions");
    await clickBtn(page, "Gap over time");
    await auditVizInteractions(page, {
      slug,
      maxButtons: 16,
    });
    console.log("✓ QA passed:", slug);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
