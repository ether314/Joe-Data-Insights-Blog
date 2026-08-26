/**
 * QA: ntd-unlinked-trips-versus-2019-by-agency-size-2026
 * // smoke-marker: UPT index vs 2019 path
 * // viz-types: national UPT index multi-line, size-band median bars,
 * // mode recovery radar, agency size-vs-index scatter, commute-share delta bars
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AGENCIES,
  DETAIL_TABLE,
  HEADLINE,
  MODE_RECOVERY,
  NATIONAL_INDEX,
  SIZE_BANDS,
  VIZ_MARKERS,
} from "../src/data/ntd-unlinked-trips-versus-2019-by-agency-size-2026-data.ts";

assert.equal(AGENCIES.length, HEADLINE.panelN);
assert.equal(AGENCIES.length, 24);
assert.equal(DETAIL_TABLE.length, 24);
assert.ok(SIZE_BANDS.length >= 4);
assert.ok(NATIONAL_INDEX.length >= 5);
assert.ok(MODE_RECOVERY.length >= 5);
assert.equal(HEADLINE.nationalIndex2024, 79);
assert.equal(HEADLINE.busIndexDec2024, 86);
assert.equal(HEADLINE.railIndexDec2024, 72);
assert.equal(HEADLINE.midSizeMedianIndex, 88);
assert.equal(HEADLINE.busLeadsRailPts, 14);
assert.ok(VIZ_MARKERS.includes("UPT index vs 2019 path"));

const root = process.cwd();
const slug = "ntd-unlinked-trips-versus-2019-by-agency-size-2026";
const markers = [...VIZ_MARKERS];

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
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }

    await clickBtn(page, "Size-band recovery bars");
    await page
      .getByText("Size-band recovery bars", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Mode recovery radar");
    await page
      .getByText("Mode recovery radar", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Agency scatter by size");
    await page
      .getByText("Agency scatter by size", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Commute-share deltas");
    await page
      .getByText("Commute-share deltas", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Large");
    await clickBtn(page, "Bus-heavy (≥70%)");
    await clickBtn(page, "All agencies");
    await clickBtn(page, "All sizes");
    await clickBtn(page, "UPT index vs 2019 path");
    console.log("✓ view + size + mode controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
